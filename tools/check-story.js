"use strict";
const STORY = require("../js/story.js");
const errs = [];
const { meta, nodes, items, archetypes } = STORY;
const ids = Object.keys(nodes);
const ref = (to, from) => { if (!nodes[to]) errs.push(`${from}: destino inexistente "${to}"`); };
const chkItems = (list, from) => (list || []).forEach(i => { if (!items[i]) errs.push(`${from}: item inexistente "${i}"`); });
if (!nodes[meta.startNode]) errs.push("startNode inexistente");
if (!nodes[meta.deathNode]) errs.push("deathNode inexistente");
for (const id of ids) {
  const n = nodes[id];
  const fx = n.onEnter || {};
  chkItems(fx.addItems, id); chkItems(fx.removeItems, id);
  if (n.ending) {
    if (n.choices) errs.push(`${id}: final não pode ter choices`);
    continue;
  }
  if (!Array.isArray(n.choices) || !n.choices.length) { errs.push(`${id}: nó sem choices`); continue; }
  if (!n.choices.some(c => !c.requires)) errs.push(`${id}: nenhuma escolha sem requires`);
  n.choices.forEach((c, i) => {
    const w = `${id}#${i}`;
    if (!!c.goto === !!c.check) errs.push(`${w}: deve ter exatamente um entre goto/check`);
    if (c.goto) ref(c.goto, w);
    if (c.check) { ref(c.check.success, w); ref(c.check.failure, w); }
    const r = c.requires || {};
    chkItems(r.items, w); chkItems(r.notItems, w);
    chkItems((c.effects || {}).addItems, w); chkItems((c.effects || {}).removeItems, w);
  });
}
const seen = new Set([meta.startNode, meta.deathNode]);
const q = [meta.startNode];
while (q.length) {
  const n = nodes[q.pop()];
  if (!n || !n.choices) continue;
  for (const c of n.choices) for (const t of [c.goto, c.check && c.check.success, c.check && c.check.failure])
    if (t && !seen.has(t)) { seen.add(t); q.push(t); }
}
ids.forEach(id => { if (!seen.has(id)) errs.push(`${id}: inalcançável`); });
archetypes.forEach(a => {
  const s = a.stats.vigor + a.stats.astucia + a.stats.empatia;
  if (s !== 6) errs.push(`arquétipo ${a.id}: soma ${s} != 6`);
});
if (errs.length) { console.error(errs.join("\n")); process.exit(1); }
console.log("OK");
