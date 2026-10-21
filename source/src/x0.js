/* Depth packs: add lesson sections, questions, cards and labs to existing stages (runs before the engine). */
window.X = {
  add: function (id, o) {
    var s = COURSE.stages.filter(function (x) { return x.id === id; })[0];
    if (!s) throw new Error('X.add: no stage ' + id);
    if (o.lesson) s.lesson = (s.lesson || []).concat(o.lesson);
    if (o.qs) s.qs = (s.qs || []).concat(o.qs);
    if (o.cards) s.cards = (s.cards || []).concat(o.cards);
    if (o.labs) s.labs = (s.labs || []).concat(o.labs);
    if (o.gateN) s.gateN = o.gateN;
  }
};
