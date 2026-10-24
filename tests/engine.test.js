const assert = require("assert");
const RPG = require("../js/engine.js");

const story = {
  meta: { title: "T", startNode: "a", deathNode: "morte", maxFolego: 5 },
  archetypes: [{ id: "x", name: "X", desc: "d", stats: { vigor: 3, astucia: 1, empatia: 2 } }],
  items: { chave: { name: "Chave", desc: "" } },
  chapters: { 1: "Um" },
  nodes: {
    a: { chapter: 1, text: "Olá, {nome}!", choices: [
      { text: "pegar", goto: "b", effects: { addItems: ["chave"], setFlags: ["f"] } },
      { text: "porta", goto: "fim", requires: { items: ["chave"] } },
      { text: "secreta", goto: "fim", hidden: true, requires: { flags: ["zzz"] } },
      { text: "teste", check: { stat: "vigor", dc: 6, success: "fim", failure: "b" } },
      { text: "dor", goto: "b", effects: { folego: -9 } }
    ] },
    b: { chapter: 1, text: "b", onEnter: { addItems: ["chave"], folego: -1 }, choices: [{ text: "volta", goto: "a" }] },
    fim: { chapter: 1, text: "fim", ending: { type: "boa", title: "F" } },
    morte: { chapter: 1, text: "m", ending: { type: "ruim", title: "M" } }
  }
};

// createState
let s = RPG.createState(story, "x", "  ");
assert.strictEqual(s.name, "Viajante");
assert.strictEqual(s.folego, 5);
assert.strictEqual(s.node, "a");
assert.strictEqual(s.lastRoll, null);
s.stats.vigor = 99;
assert.strictEqual(story.archetypes[0].stats.vigor, 3, "stats devem ser cópia");

// formatText
s = RPG.createState(story, "x", "Ana");
assert.strictEqual(RPG.formatText("Olá, {nome}! {nome}", s), "Olá, Ana! Ana");

// requires / hidden
assert.strictEqual(RPG.meetsRequires(s, undefined), true);
assert.strictEqual(RPG.meetsRequires(s, { items: ["chave"] }), false);
assert.strictEqual(RPG.meetsRequires(s, { notItems: ["chave"], notFlags: ["f"] }), true);
let v = RPG.visibleChoices(s, story);
assert.strictEqual(v.length, 4, "hidden some");
assert.strictEqual(v[1].locked, true);
assert.throws(function () { RPG.choose(s, story, 1); });

// itens sem duplicar + efeitos
RPG.choose(s, story, 0);
assert.strictEqual(s.node, "b");
assert.deepStrictEqual(s.items, ["chave"]);
assert.strictEqual(s.folego, 4);
assert.strictEqual(s.lastRoll, null);
RPG.applyEffects(s, { addItems: ["chave"], setFlags: ["f"] }, story);
assert.deepStrictEqual(s.items, ["chave"]);
assert.deepStrictEqual(s.flags, ["f"]);
RPG.applyEffects(s, { folego: 10 }, story);
assert.strictEqual(s.folego, 5);
RPG.applyEffects(s, { removeItems: ["chave"] }, story);
assert.deepStrictEqual(s.items, []);

// check com rng fixo: roll = 1+floor(rng*6)
s = RPG.createState(story, "x", "Ana");
RPG.choose(s, story, 2, function () { return 0.99; }); // roll 6 + 3 = 9 >= 6 (índice 2 = teste; secreta oculta)
assert.strictEqual(s.node, "fim");
assert.strictEqual(s.lastRoll.roll, 6);
assert.strictEqual(s.lastRoll.total, 9);
assert.strictEqual(s.lastRoll.success, true);
s = RPG.createState(story, "x", "Ana");
RPG.choose(s, story, 2, function () { return 0; }); // roll 1 + 3 = 4 < 6
assert.strictEqual(s.node, "b");
assert.strictEqual(s.lastRoll.success, false);
assert.strictEqual(s.lastRoll.next, "b");
assert.strictEqual(s.lastRoll.dc, 6);
const r = RPG.rollCheck(s, { stat: "vigor", dc: 4, success: "x", failure: "y" }, function () { return 0.5; });
assert.deepStrictEqual(r, { stat: "vigor", roll: 4, bonus: 3, total: 7, dc: 4, success: true, next: "x" });

// folego zerando -> deathNode (na escolha e no onEnter)
s = RPG.createState(story, "x", "Ana");
RPG.choose(s, story, 3);
assert.strictEqual(s.folego, 0);
assert.strictEqual(s.node, "morte");
s = RPG.createState(story, "x", "Ana");
s.folego = 1;
RPG.enterNode(s, story, "b");
assert.strictEqual(s.node, "morte");
s = RPG.createState(story, "x", "Ana");
s.folego = 0;
RPG.enterNode(s, story, "fim");
assert.strictEqual(s.node, "fim", "final não desvia");

console.log("OK");
