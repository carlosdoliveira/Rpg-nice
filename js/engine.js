(function (root) {
  const SAVE_KEY = "rpgnice.save.v1";
  const STAT_NAMES = { vigor: "Vigor", astucia: "Astúcia", empatia: "Empatia" };

  function createState(story, archetypeId, name) {
    const a = story.archetypes.find(function (x) { return x.id === archetypeId; });
    if (!a) throw new Error("Arquétipo inexistente: " + archetypeId);
    const n = (name || "").trim();
    return {
      name: n || "Viajante", archetype: a.id, stats: Object.assign({}, a.stats),
      folego: story.meta.maxFolego, items: [], flags: [],
      node: story.meta.startNode, lastRoll: null
    };
  }

  function meetsRequires(state, req) {
    if (!req) return true;
    const has = function (l, id) { return l.indexOf(id) !== -1; };
    return (req.items || []).every(function (i) { return has(state.items, i); }) &&
      (req.notItems || []).every(function (i) { return !has(state.items, i); }) &&
      (req.flags || []).every(function (f) { return has(state.flags, f); }) &&
      (req.notFlags || []).every(function (f) { return !has(state.flags, f); });
  }

  function applyEffects(state, fx, story) {
    if (!fx) return state;
    (fx.addItems || []).forEach(function (i) { if (state.items.indexOf(i) === -1) state.items.push(i); });
    (fx.removeItems || []).forEach(function (i) { state.items = state.items.filter(function (x) { return x !== i; }); });
    (fx.setFlags || []).forEach(function (f) { if (state.flags.indexOf(f) === -1) state.flags.push(f); });
    if (typeof fx.folego === "number") {
      const max = story && story.meta ? story.meta.maxFolego : 5;
      state.folego = Math.max(0, Math.min(max, state.folego + fx.folego));
    }
    return state;
  }

  function rollCheck(state, check, rng) {
    const r = rng || Math.random;
    const roll = 1 + Math.floor(r() * 6);
    const bonus = state.stats[check.stat];
    const total = roll + bonus;
    const success = total >= check.dc;
    return { stat: check.stat, roll: roll, bonus: bonus, total: total, dc: check.dc,
      success: success, next: success ? check.success : check.failure };
  }

  function enterNode(state, story, id) {
    state.node = id;
    const node = story.nodes[id];
    if (node) applyEffects(state, node.onEnter, story);
    if (state.folego <= 0 && !(node && node.ending)) state.node = story.meta.deathNode;
    return state;
  }

  function visibleChoices(state, story) {
    const node = story.nodes[state.node];
    const out = [];
    ((node && node.choices) || []).forEach(function (c) {
      const ok = meetsRequires(state, c.requires);
      if (!ok && c.hidden) return;
      out.push({ choice: c, locked: !ok });
    });
    return out;
  }

  function choose(state, story, index, rng) {
    const v = visibleChoices(state, story)[index];
    if (!v) throw new Error("Escolha inexistente: " + index);
    if (v.locked) throw new Error("Escolha trancada: " + index);
    const c = v.choice;
    applyEffects(state, c.effects, story);
    if (state.folego <= 0) {
      state.lastRoll = null;
      return enterNode(state, story, story.meta.deathNode);
    }
    let dest;
    if (c.check) { state.lastRoll = rollCheck(state, c.check, rng); dest = state.lastRoll.next; }
    else { state.lastRoll = null; dest = c.goto; }
    return enterNode(state, story, dest);
  }

  function formatText(text, state) {
    return String(text).replace(/\{nome\}/g, state.name);
  }

  function isEnding(story, state) { return !!(story.nodes[state.node] && story.nodes[state.node].ending); }

  /* ---------- UI (somente no navegador) ---------- */
  function startUI(story) {
    const app = document.getElementById("app");
    let state = null;

    function el(tag, cls, text) {
      const e = document.createElement(tag);
      if (cls) e.className = cls;
      if (text !== undefined) e.textContent = text;
      return e;
    }
    function btn(label, cls, fn) {
      const b = el("button", cls, label);
      b.type = "button";
      b.addEventListener("click", fn);
      return b;
    }
    function store(op, val) {
      try {
        if (op === "get") return localStorage.getItem(SAVE_KEY);
        if (op === "set") localStorage.setItem(SAVE_KEY, val);
        if (op === "del") localStorage.removeItem(SAVE_KEY);
      } catch (e) { /* ignorado */ }
      return null;
    }
    function loadSave() {
      const raw = store("get");
      if (!raw) return null;
      try {
        const s = JSON.parse(raw);
        if (s && story.nodes[s.node] && s.stats && Array.isArray(s.items) && Array.isArray(s.flags)) return s;
      } catch (e) { /* save inválido */ }
      return null;
    }
    function clear() { while (app.firstChild) app.removeChild(app.firstChild); }

    function title() {
      clear();
      app.appendChild(el("h1", "", story.meta.title));
      app.appendChild(el("p", "center muted", "Um mini RPG de texto e decisão."));
      const m = el("div", "menu");
      m.appendChild(btn("Novo jogo", "primary", creation));
      if (loadSave()) m.appendChild(btn("Continuar", "", function () { state = loadSave(); render(); }));
      app.appendChild(m);
    }

    function creation() {
      clear();
      let chosen = null;
      app.appendChild(el("h2", "", "Quem é você?"));
      const lbl = el("label", "muted", "Seu nome");
      lbl.setAttribute("for", "nome");
      const input = el("input");
      input.type = "text"; input.id = "nome"; input.maxLength = 24; input.placeholder = "Viajante (opcional)";
      input.autocomplete = "off"; input.setAttribute("enterkeyhint", "done");
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") input.blur(); });
      app.appendChild(lbl); app.appendChild(input);
      const go = btn("Começar", "primary", function () {
        state = createState(story, chosen, input.value);
        enterNode(state, story, state.node);
        render();
      });
      go.disabled = true;
      const cards = [];
      story.archetypes.forEach(function (a) {
        const c = btn("", "card", function () {
          chosen = a.id; go.disabled = false;
          cards.forEach(function (x) { x.classList.toggle("sel", x === c); });
        });
        c.appendChild(el("b", "", a.name));
        c.appendChild(el("span", "", " — " + a.desc));
        c.appendChild(el("small", "", "Vigor " + a.stats.vigor + " · Astúcia " + a.stats.astucia + " · Empatia " + a.stats.empatia));
        cards.push(c); app.appendChild(c);
      });
      app.appendChild(go);
    }

    function render() {
      const node = story.nodes[state.node];
      if (node.ending) { store("del"); return endScreen(node); }
      store("set", JSON.stringify(state));
      clear();
      const ch = node.chapter;
      const hdr = el("div", "hdr");
      hdr.appendChild(el("span", "", "Capítulo " + ch + " — " + story.chapters[ch]));
      const menuBtn = btn("Menu", "mini", title);
      menuBtn.setAttribute("aria-label", "Voltar ao menu (o progresso fica salvo)");
      hdr.appendChild(menuBtn);
      app.appendChild(hdr);
      const bar = el("div", "bar");
      bar.appendChild(el("span", "", state.name));
      bar.appendChild(el("span", "", "Vigor " + state.stats.vigor + " · Astúcia " + state.stats.astucia + " · Empatia " + state.stats.empatia));
      const f = el("span", "folego", "Fôlego " + "●".repeat(state.folego) + "○".repeat(story.meta.maxFolego - state.folego));
      f.setAttribute("aria-label", "Fôlego " + state.folego + " de " + story.meta.maxFolego);
      bar.appendChild(f);
      const inv = el("span", "");
      inv.appendChild(document.createTextNode("Itens: "));
      if (!state.items.length) inv.appendChild(document.createTextNode("—"));
      const desc = el("div", "itemdesc");
      desc.hidden = true;
      state.items.forEach(function (id) {
        const it = story.items[id] || { name: id, desc: "" };
        const s = btn(it.name, "chip", function () {
          const open = !desc.hidden && desc.textContent === it.desc;
          desc.textContent = it.desc; desc.hidden = open;
        });
        s.title = it.desc; inv.appendChild(s);
      });
      bar.appendChild(inv);
      bar.appendChild(desc);
      app.appendChild(bar);
      const r = state.lastRoll;
      if (r) {
        app.appendChild(el("div", "roll " + (r.success ? "ok" : "fail"),
          "Teste de " + STAT_NAMES[r.stat] + ": " + r.bonus + " + " + r.roll + " = " + r.total +
          " vs " + r.dc + " — " + (r.success ? "Sucesso!" : "Falha."))); 
      }
      const t = el("div", "text");
      formatText(node.text, state).split(/\n\n+/).forEach(function (p) { t.appendChild(el("p", "", p)); });
      app.appendChild(t);
      const box = el("div", "choices");
      visibleChoices(state, story).forEach(function (v, i) {
        const c = v.choice;
        let label = (i + 1) + ". " + c.text;
        if (c.check) label += " [" + STAT_NAMES[c.check.stat] + ", dif. " + c.check.dc + "]";
        if (v.locked) label = "🔒 " + (i + 1) + ". " + c.text + " — " + (c.lockedHint || "Requisito não cumprido");
        const b = btn(label, "", function () { choose(state, story, i); render(); window.scrollTo(0, 0); });
        if (v.locked) b.disabled = true;
        box.appendChild(b);
      });
      app.appendChild(box);
      // Só foca automaticamente quando há teclado de verdade; no toque o foco causaria destaque fantasma.
      const first = box.querySelector("button:not(:disabled)");
      if (first && usingKeyboard) first.focus({ preventScroll: true });
    }

    function endScreen(node) {
      clear();
      const w = el("div", "center");
      w.appendChild(el("div", "hdr", "Fim"));
      w.appendChild(el("span", "seal " + node.ending.type, node.ending.type));
      w.appendChild(el("h2", "", node.ending.title));
      app.appendChild(w);
      const t = el("div", "text");
      formatText(node.text, state).split(/\n\n+/).forEach(function (p) { t.appendChild(el("p", "", p)); });
      app.appendChild(t);
      app.appendChild(btn("Jogar novamente", "primary", title));
    }

    let usingKeyboard = false;
    document.addEventListener("pointerdown", function () { usingKeyboard = false; });
    document.addEventListener("keydown", function (e) {
      usingKeyboard = true;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (!/^[1-9]$/.test(e.key) || !state || !story.nodes[state.node] || story.nodes[state.node].ending) return;
      if (document.activeElement && document.activeElement.tagName === "INPUT") return;
      if (!app.querySelector(".choices")) return;
      const v = visibleChoices(state, story)[Number(e.key) - 1];
      if (!v || v.locked) return;
      choose(state, story, Number(e.key) - 1); render();
    });

    title();
  }

  const RPG = {
    SAVE_KEY: SAVE_KEY, createState: createState, meetsRequires: meetsRequires,
    applyEffects: applyEffects, rollCheck: rollCheck, enterNode: enterNode,
    choose: choose, visibleChoices: visibleChoices, formatText: formatText, startUI: startUI
  };
  root.RPG = RPG;
  if (typeof module !== "undefined" && module.exports) module.exports = RPG;
  if (typeof document !== "undefined" && typeof root.STORY !== "undefined") {
    const go = function () { startUI(root.STORY); };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
  }
})(typeof window !== "undefined" ? window : globalThis);
