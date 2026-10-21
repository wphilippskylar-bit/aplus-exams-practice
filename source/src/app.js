/* Study engine — shared by every course repo.
   A course registers window.COURSE before this file runs. */
(function () {
  'use strict';
  var C = window.COURSE;
  var KEY = C.id + ':v1';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  var PASS = C.passPct || 90; // must score OVER this

  // ---------- storage (localStorage, guarded) ----------
  function load(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  var S = load(KEY, null) || { device: null, stages: {}, cards: {}, missed: {}, history: [], created: Date.now() };
  function persist() { save(KEY, S); }
  function st(id) { return S.stages[id] || (S.stages[id] = { lesson: false, labs: {}, best: 0, passed: false, attempts: 0 }); }

  // ---------- content normalisation ----------
  var STAGES = C.stages;
  var TRACKS = C.tracks || [{ id: 'main', name: C.title }], lastIn = {}, countIn = {};
  STAGES.forEach(function (s, i) {
    s.idx = i;
    s.track = s.track || TRACKS[0].id;
    s.prev = lastIn[s.track] || null; lastIn[s.track] = s;
    s.tidx = countIn[s.track] = (countIn[s.track] === undefined ? 0 : countIn[s.track] + 1);
    s.qs = (s.qs || []).map(normQ);
    s.cards = (s.cards || []).map(function (c, k) { return { id: s.id + ':' + k, t: c[0], d: c[1], stage: s.id }; });
  });
  function normQ(q) {
    if (Array.isArray(q)) return { q: q[0], c: q[1], a: q[2], e: q[3], d: q[4] || 0 };
    return q;
  }
  function realize(q) { // turn generator stubs into concrete questions
    if (q.gen) { var g = C.gens[q.gen](); g.d = g.d || q.d || 0; g.gen = q.gen; return normQ(g); }
    return q;
  }
  function stageById(id) { return STAGES.filter(function (s) { return s.id === id; })[0]; }
  function unlocked(s) { return !s.prev || st(s.prev.id).passed; }
  function trackOf(id) { return TRACKS.filter(function (t) { return t.id === id; })[0] || TRACKS[0]; }
  function inTrack(t) { return STAGES.filter(function (s) { return s.track === t; }); }
  function activeTrack() { return trackOf(S.track || TRACKS[0].id).id; }
  function current(t) { var l = inTrack(t || activeTrack()); for (var i = 0; i < l.length; i++) if (!st(l[i].id).passed) return l[i]; return null; }
  function stepLabel(s) { return (TRACKS.length > 1 ? trackOf(s.track).short + ' ' : '') + 'Step ' + (s.tidx + 1); }
  function labsDone(s) { return (s.labs || []).filter(function (l) { return st(s.id).labs[l]; }).length; }
  function gateReady(s) { var x = st(s.id); return x.lesson && labsDone(s) === (s.labs || []).length; }
  function overall() { var n = STAGES.filter(function (s) { return st(s.id).passed; }).length; return Math.round(100 * n / STAGES.length); }

  // ---------- shell ----------
  var ICON = {
    path: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="5" cy="6" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M7.5 6H15a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h7.5"/></svg>',
    cards: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="6" width="14" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/></svg>',
    labs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M12 15h5"/></svg>',
    tools: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/></svg>',
    codes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 18h4"/></svg>',
    pc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>'
  };

  function shell() {
    document.body.innerHTML =
      '<header id="top"><div class="brand"><span class="dot"></span><span>' + esc(C.title) + '</span></div>' +
      '<div class="prog"><span id="pp"></span><div class="bar"><i id="pb"></i></div></div></header>' +
      '<main id="main"></main><nav id="nav"></nav>';
    var nav = [['path', 'Path'], ['cards', 'Cards'], ['labs', 'Labs'], ['tools', 'Tools'], ['codes', 'Save']];
    $('#nav').innerHTML = nav.map(function (n) { return '<button data-go="#' + n[0] + '" data-nav="' + n[0] + '">' + ICON[n[0]] + '<span>' + n[1] + '</span></button>'; }).join('');
    applyDevice();
  }
  function applyDevice() {
    document.body.classList.toggle('lite', S.device === 'phone');
    document.body.classList.toggle('pc', S.device === 'pc');
  }
  function topbar() { var p = overall(); $('#pp').textContent = p + '%'; $('#pb').style.width = p + '%'; }
  function toast(msg, ms) {
    var t = document.createElement('div'); t.className = 'toast'; t.innerHTML = msg; document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, ms || 2200);
  }
  function modal(html) {
    var m = document.createElement('div'); m.className = 'modal'; m.innerHTML = '<div class="panel">' + html + '</div>';
    m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('[data-close]')) m.remove(); });
    document.body.appendChild(m); return m;
  }
  function copy(text) {
    try { navigator.clipboard.writeText(text).then(function () { toast('Copied'); }, function () { toast('Long-press the code to copy'); }); }
    catch (e) { toast('Long-press the code to copy'); }
  }

  // ---------- device picker ----------
  function picker(force) {
    var p = document.createElement('div'); p.className = 'picker';
    p.innerHTML = '<div class="box"><div class="tag">' + esc(C.title) + '</div><h1 style="margin-top:6px">Where are you studying?</h1>' +
      '<p class="muted">Phone mode trims effects and stacks everything for a smooth iPhone experience. Laptop mode spreads labs and terminals side by side. Switch anytime under Save.</p>' +
      '<div class="opts"><button class="opt" data-dev="phone">' + ICON.phone + '<b>iPhone / phone</b><span>Lighter, faster, thumb-friendly</span></button>' +
      '<button class="opt" data-dev="pc">' + ICON.pc + '<b>Laptop / PC</b><span>Full console, side-by-side labs</span></button></div>' +
      (force ? '<button class="btn ghost" data-dev="cancel">Cancel</button>' : '') + '</div>';
    p.addEventListener('click', function (e) {
      var b = e.target.closest('[data-dev]'); if (!b) return;
      if (b.dataset.dev !== 'cancel') { S.device = b.dataset.dev; persist(); applyDevice(); }
      p.remove(); route();
    });
    document.body.appendChild(p);
  }

  // ---------- router ----------
  var view = { tab: {} }, cleanup = null;
  function route() {
    if (cleanup) { try { cleanup(); } catch (e) { } cleanup = null; }
    var h = location.hash || '#path', parts = h.slice(1).split('/');
    var main = $('#main'); main.innerHTML = '';
    document.querySelectorAll('#nav button').forEach(function (b) { b.classList.toggle('on', b.dataset.nav === parts[0] || (parts[0] === 'stage' && b.dataset.nav === 'path') || (parts[0] === 'lab' && b.dataset.nav === 'labs')); });
    topbar();
    var R = { path: vPath, stage: vStage, lab: vLab, cards: vCards, labs: vLabs, tools: vTools, tool: vTool, codes: vCodes };
    (R[parts[0]] || vPath)(main, parts.slice(1));
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  document.addEventListener('click', function (e) {
    var g = e.target.closest('[data-go]'); if (g) { e.preventDefault(); if (location.hash === g.dataset.go) route(); else location.hash = g.dataset.go; }
  });

  // ---------- PATH ----------
  function vPath(m) {
    var T = activeTrack(), cur = current(T), html = '';
    if (TRACKS.length > 1) html += '<div class="tabs trk" style="margin-top:0">' + TRACKS.map(function (t) {
      var l = inTrack(t.id), d = l.filter(function (s) { return st(s.id).passed; }).length;
      return '<button class="' + (t.id === T ? 'on' : '') + '" data-trk="' + t.id + '">' + esc(t.name) + ' · ' + d + '/' + l.length + '</button>'; }).join('') + '</div>';
    var tk = trackOf(T);
    html += '<div class="panel" style="margin-bottom:6px"><div class="tag">' + esc(tk.subtitle || C.subtitle || '') + '</div>';
    if (cur) {
      html += '<h2 style="margin:6px 0">Next up: ' + esc(cur.title) + '</h2><p class="muted small">' + esc(cur.goal || '') + '</p>' +
        '<div class="row"><button class="btn pri" data-go="#stage/' + cur.id + '">Continue</button>' +
        '<span class="chip lock">Pass = over ' + PASS + '% on the gate test</span></div>';
    } else html += '<h2 style="margin:6px 0">Path complete. You are the senior engineer now.</h2>';
    html += '</div>';
    C.tiers.forEach(function (t) {
      if (t.track && t.track !== T) return;
      var list = STAGES.filter(function (s) { return s.tier === t.id && s.track === T; });
      if (!list.length) return;
      html += '<div class="tier"><h2>' + esc(t.name) + '</h2><span class="muted small">' + esc(t.desc || '') + '</span></div><div class="path">';
      list.forEach(function (s) {
        var x = st(s.id), un = unlocked(s), cls = x.passed ? 'done' : (cur && cur.id === s.id ? 'cur' : (un ? '' : 'locked'));
        var sub = x.passed ? 'Passed · best ' + x.best + '%' : (un ? (s.goal || '') : 'Locked — pass step ' + s.tidx + ' first');
        html += '<button class="node ' + cls + '" ' + (un ? 'data-go="#stage/' + s.id + '"' : 'data-locked="1"') + '>' +
          '<span class="num">' + (x.passed ? '✓' : (un ? (s.tidx + 1) : '🔒')) + '</span><span class="grow"><span class="t">' + (s.tidx + 1) + '. ' + esc(s.title) + '</span><br><span class="s">' + esc(sub) + '</span></span></button>';
      });
      html += '</div>';
    });
    m.innerHTML = html;
    m.addEventListener('click', function (e) { var tb = e.target.closest('[data-trk]'); if (tb) { S.track = tb.dataset.trk; persist(); route(); return; } if (e.target.closest('[data-locked]')) toast('🔒 Locked. Score over ' + PASS + '% on the previous gate test to open it.'); });
  }

  // ---------- STAGE ----------
  function vStage(m, args) {
    var s = stageById(args[0]);
    if (!s) return vPath(m);
    if (!unlocked(s)) { location.hash = '#path'; return; }
    var tab = args[1] || view.tab[s.id] || 'learn';
    view.tab[s.id] = tab;
    var x = st(s.id);
    var tabs = [['learn', 'Learn'], ['cards', 'Cards (' + s.cards.length + ')'], ['practice', 'Practice'], ['labs', 'Labs (' + labsDone(s) + '/' + (s.labs || []).length + ')'], ['gate', x.passed ? 'Gate ✓' : 'Gate 🔒']];
    if (!(s.labs || []).length) tabs.splice(3, 1);
    m.innerHTML = '<div class="tag">' + esc((C.tiers.filter(function (t) { return t.id === s.tier; })[0] || {}).name) + ' · ' + stepLabel(s) + ' of ' + inTrack(s.track).length + '</div>' +
      '<h1 style="margin:4px 0 6px">' + esc(s.title) + '</h1><p class="muted" style="margin:0 0 8px">' + esc(s.goal || '') + '</p>' +
      '<div class="req">' + reqChips(s) + '</div>' +
      '<div class="tabs">' + tabs.map(function (t) { return '<button class="' + (t[0] === tab ? 'on' : '') + '" data-go="#stage/' + s.id + '/' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div><div id="pane"></div>';
    var pane = $('#pane', m);
    ({ learn: pLearn, cards: pCards, practice: pPractice, labs: pLabs, gate: pGate })[tab](pane, s);
  }
  function reqChips(s) {
    var x = st(s.id), n = (s.labs || []).length;
    return '<span class="chip ' + (x.lesson ? 'ok' : '') + '">' + (x.lesson ? '✓' : '○') + ' Lesson</span>' +
      (n ? '<span class="chip ' + (labsDone(s) === n ? 'ok' : '') + '">' + (labsDone(s) === n ? '✓' : '○') + ' Labs ' + labsDone(s) + '/' + n + '</span>' : '') +
      '<span class="chip ' + (x.passed ? 'ok' : 'lock') + '">' + (x.passed ? '✓ Gate ' + x.best + '%' : '🔒 Gate >' + PASS + '%' + (x.best ? ' · best ' + x.best + '%' : '')) + '</span>';
  }

  function pLearn(p, s) {
    var x = st(s.id);
    p.innerHTML = '<div class="panel lesson">' + (s.lesson || []).map(function (sec) { return (sec.h ? '<h3>' + esc(sec.h) + '</h3>' : '') + sec.html; }).join('') + '</div>' +
      '<div class="row" style="margin-top:12px">' + (x.lesson ? '<span class="chip ok">✓ Lesson complete</span>' : '<button class="btn pri" id="mark">I read it — mark lesson complete</button>') +
      '<button class="btn" data-go="#stage/' + s.id + '/cards">Drill the cards →</button></div>';
    var b = $('#mark', p); if (b) b.onclick = function () { x.lesson = true; persist(); route(); };
  }

  // ---------- flashcards (Leitner) ----------
  var BOX_DAYS = [0, 1, 2, 4, 8, 16, 30];
  function cardState(c) { return S.cards[c.id] || { box: 0, due: 0 }; }
  function dueCards(list) { var now = Date.now(); return list.filter(function (c) { return cardState(c).due <= now; }); }
  function cardSession(p, list, label) {
    var mode = 'term', deck = shuffle(dueCards(list)), extra = false;
    if (!deck.length) { deck = shuffle(list); extra = true; }
    var i = 0, flipped = false, done = 0;
    function draw() {
      if (i >= deck.length) {
        p.innerHTML = '<div class="panel center"><div class="big">✓</div><h2>Deck cleared</h2><p class="muted">' + done + ' cards reviewed. Cards you marked "Again" come back first next time.</p><button class="btn pri" id="again">Run it again</button></div>';
        $('#again', p).onclick = function () { cardSession(p, list, label); }; return;
      }
      var c = deck[i], cs = cardState(c);
      var front = mode === 'term' ? '<b>' + esc(c.t) + '</b>' : '<div>' + c.d + '</div>';
      var back = mode === 'term' ? '<div>' + c.d + '</div>' : '<b>' + esc(c.t) + '</b>';
      p.innerHTML = '<div class="row small muted"><span>' + esc(label) + ' · ' + (i + 1) + '/' + deck.length + (extra ? ' (extra practice — nothing due)' : '') + '</span><span class="grow"></span>' +
        '<button class="btn sm ghost" id="swap">' + (mode === 'term' ? 'Term → Def' : 'Def → Term') + '</button></div>' +
        '<div class="flash' + (flipped ? ' flip' : '') + '" id="fc"><div class="in"><div class="f">' + front + '<div class="dim small" style="margin-top:12px">tap to flip · box ' + cs.box + '</div></div><div class="b">' + back + '</div></div></div>' +
        '<div class="grade"><button class="btn warn" data-g="0">Again</button><button class="btn" data-g="1">Hard</button><button class="btn pri" data-g="2">Got it</button></div>' +
        '<p class="dim small center" style="margin-top:10px">Laptop: Space flips · 1/2/3 grade</p>';
      $('#fc', p).onclick = function () { flipped = !flipped; this.classList.toggle('flip', flipped); };
      $('#swap', p).onclick = function () { mode = mode === 'term' ? 'def' : 'term'; flipped = false; draw(); };
      p.querySelectorAll('[data-g]').forEach(function (b) { b.onclick = function () { grade(+b.dataset.g); }; });
    }
    function grade(g) {
      var c = deck[i], cs = cardState(c);
      cs.box = g === 0 ? 0 : g === 1 ? Math.max(1, cs.box) : Math.min(6, cs.box + 1);
      cs.due = g === 0 ? Date.now() : Date.now() + BOX_DAYS[cs.box] * 864e5;
      S.cards[c.id] = cs; persist();
      if (g === 0) deck.push(c);
      i++; done++; flipped = false; draw();
    }
    function key(e) {
      if (!p.isConnected) { document.removeEventListener('keydown', key); return; }
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') { e.preventDefault(); var f = $('#fc', p); if (f) f.click(); }
      if (e.key === '1' || e.key === '2' || e.key === '3') grade(+e.key - 1);
    }
    document.addEventListener('keydown', key);
    cleanup = function () { document.removeEventListener('keydown', key); };
    draw();
  }
  function pCards(p, s) { cardSession(p, s.cards, s.title); }

  // ---------- questions ----------
  function letter(i) { return 'ABCDEFG'.charAt(i); }
  function normAns(s) { return String(s).trim().toLowerCase().replace(/\s+/g, ' ').replace(/;$/, ''); }
  function checkInput(q, val) {
    var v = normAns(val);
    return (q.accept || []).some(function (a) {
      if (a instanceof RegExp) return a.test(val.trim());
      return normAns(a) === v;
    });
  }
  function renderQ(q, opts) { // returns html
    var h = '<div class="q">' + (q.html ? q.q : esc(q.q)) + '</div>';
    if (q.input) h += '<input class="answer-in" id="ain" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="' + esc(q.ph || 'Type your answer') + '" enterkeyhint="done">' +
      '<div class="row" style="margin-top:8px"><button class="btn pri" id="asub">Submit</button></div>';
    else h += '<div class="choices">' + q.order.map(function (ci, k) { return '<button class="choice" data-c="' + ci + '"><span class="l">' + letter(k) + '</span><span>' + esc(q.c[ci]) + '</span></button>'; }).join('') + '</div>';
    return h;
  }
  function prep(q) { q = realize(q); var o = { order: q.c ? shuffle(q.c.map(function (_, i) { return i; })) : null }; for (var k in q) o[k] = q[k]; if (q.keep) o.order = q.c.map(function (_, i) { return i; }); return o; }
  function explainHtml(q, ok) {
    var ans = q.input ? (q.show || (q.accept && typeof q.accept[0] === 'string' ? q.accept[0] : '')) : q.c[q.a];
    return '<div class="explain"><b class="v" style="color:' + (ok ? 'var(--ok)' : 'var(--bad)') + '">' + (ok ? 'Correct.' : 'Not quite.') + '</b>' +
      (!ok ? '<div class="small" style="margin-bottom:6px">Answer: <code>' + esc(ans) + '</code></div>' : '') + '<div>' + (q.e || '') + '</div></div>';
  }

  function pPractice(p, s) {
    var pool = s.qs, missedOnly = false;
    var right = 0, total = 0;
    function next() {
      var src = missedOnly ? pool.filter(function (q, i) { return S.missed[s.id + ':' + i]; }) : pool;
      if (!src.length) { p.innerHTML = '<div class="panel">No missed questions here. Nice.</div>'; return; }
      var qi = Math.floor(Math.random() * src.length), raw = src[qi], idx = pool.indexOf(raw), q = prep(raw);
      p.innerHTML = '<div class="row small" style="margin-bottom:8px"><span class="muted">Practice · instant explanations · ' + right + '/' + total + '</span><span class="grow"></span>' +
        '<button class="btn sm ' + (missedOnly ? 'pri' : 'ghost') + '" id="mo">Missed only</button></div><div class="panel" id="qp">' + renderQ(q) + '</div>';
      $('#mo', p).onclick = function () { missedOnly = !missedOnly; next(); };
      wire($('#qp', p), q, function (ok) {
        total++; if (ok) right++;
        if (!q.gen) { if (ok) delete S.missed[s.id + ':' + idx]; else S.missed[s.id + ':' + idx] = 1; persist(); }
        var b = document.createElement('div'); b.className = 'row'; b.style.marginTop = '10px';
        b.innerHTML = '<button class="btn pri" id="nx">Next question</button>'; $('#qp', p).appendChild(b);
        $('#nx', p).onclick = next; $('#nx', p).focus();
      }, true);
    }
    next();
  }
  // wire answering for a rendered question. instant=true shows explanation.
  function wire(box, q, done, instant) {
    var answered = false;
    function finish(ok, picked) {
      if (answered) return; answered = true;
      if (!q.input && instant) box.querySelectorAll('.choice').forEach(function (b) {
        var ci = +b.dataset.c; if (ci === q.a) b.classList.add('right'); else if (ci === picked) b.classList.add('wrong'); b.disabled = true;
      });
      if (instant) box.insertAdjacentHTML('beforeend', explainHtml(q, ok));
      done(ok, picked);
    }
    if (q.input) {
      var inp = $('#ain', box), sub = $('#asub', box);
      sub.onclick = function () { if (!inp.value.trim()) return; inp.disabled = true; sub.disabled = true; finish(checkInput(q, inp.value), inp.value); };
      inp.onkeydown = function (e) { if (e.key === 'Enter') sub.click(); };
      if (document.body.classList.contains('pc')) inp.focus();
    } else box.querySelectorAll('.choice').forEach(function (b) { b.onclick = function () { finish(+b.dataset.c === q.a, +b.dataset.c); }; });
  }

  // ---------- gate test ----------
  function pGate(p, s) {
    var x = st(s.id);
    if (!gateReady(s)) {
      p.innerHTML = '<div class="panel"><h2>🔒 Gate locked</h2><p>Before you can test out of this step:</p><ul>' +
        '<li>' + (x.lesson ? '✓' : '○') + ' Read the lesson and mark it complete</li>' +
        ((s.labs || []).length ? '<li>' + (labsDone(s) === s.labs.length ? '✓' : '○') + ' Complete every lab (' + labsDone(s) + '/' + s.labs.length + ')</li>' : '') +
        '</ul><p class="muted">Then score <b>over ' + PASS + '%</b> to unlock the next step and earn your checkpoint phrase.</p></div>';
      return;
    }
    var cap = s.capstone, n = cap ? cap.n : Math.min(s.gateN || 15, s.qs.length);
    p.innerHTML = '<div class="panel"><h2>' + (cap ? 'Capstone exam' : 'Gate test') + '</h2>' +
      '<p>' + n + ' questions' + (cap ? ', weighted to the official domain percentages, ' + cap.minutes + '-minute timer' : '') + '. No hints or explanations until the end. You need <b>over ' + PASS + '%</b> (' + Math.floor(n * PASS / 100 + 1) + '/' + n + ' or better).</p>' +
      (x.passed ? '<p class="chip ok">Already passed — best ' + x.best + '%. Retakes keep your best.</p>' : '') +
      '<p class="muted small">Attempts: ' + x.attempts + (x.best ? ' · best ' + x.best + '%' : '') + '</p>' +
      '<button class="btn pri" id="go">Start ' + (cap ? 'exam' : 'gate test') + '</button></div>' +
      (x.passed ? '<div class="panel" style="margin-top:12px"><div class="tag">Checkpoint phrase for this step</div><div class="code" style="margin-top:8px">' + esc(s.code) + '</div></div>' : '');
    $('#go', p).onclick = function () { runTest(p, s, buildSet(s, n), cap); };
  }
  function buildSet(s, n) {
    if (s.capstone) {
      var pool = [];
      STAGES.forEach(function (o) {
        var inPool = s.capstone.pool ? s.capstone.pool.indexOf(o.id) >= 0 : (o.idx <= s.idx && o.tier !== 'pro' && o.track === s.track);
        if (inPool) o.qs.forEach(function (q) { if (q.d) pool.push(q); });
      });
      var W = s.capstone.weights || C.weights, out = [];
      var counts = {}, tot = 0;
      Object.keys(W).forEach(function (d) { counts[d] = Math.round(n * W[d] / 100); tot += counts[d]; });
      var dk = Object.keys(W).sort(function (a, b) { return W[b] - W[a]; }), k = 0;
      while (tot !== n) { counts[dk[k % dk.length]] += tot < n ? 1 : -1; tot += tot < n ? 1 : -1; k++; }
      Object.keys(counts).forEach(function (d) {
        var dp = shuffle(pool.filter(function (q) { return String(q.d) === d; }));
        out = out.concat(dp.slice(0, counts[d]));
      });
      if (out.length < n) out = out.concat(shuffle(pool.filter(function (q) { return out.indexOf(q) < 0; })).slice(0, n - out.length));
      return shuffle(out).map(prep);
    }
    return shuffle(s.qs).slice(0, n).map(prep);
  }
  function runTest(p, s, set, cap) {
    var i = 0, answers = [], t0 = Date.now(), timerId = null, limit = cap ? cap.minutes * 60 : 0;
    function tick() {
      var el = $('#tm', p); if (!el) return;
      var left = limit - Math.floor((Date.now() - t0) / 1000);
      if (left <= 0) { finish(); return; }
      el.textContent = Math.floor(left / 60) + ':' + ('0' + left % 60).slice(-2);
    }
    if (cap) { timerId = setInterval(tick, 1000); cleanup = function () { clearInterval(timerId); }; }
    function show() {
      if (i >= set.length) return finish();
      var q = set[i];
      p.innerHTML = '<div class="qmeta"><span>' + (cap ? 'CAPSTONE' : 'GATE') + ' · Q' + (i + 1) + '/' + set.length + (q.d && (cap && cap.domains || C.domains) ? ' · D' + q.d : '') + '</span>' + (cap ? '<span class="timer" id="tm"></span>' : '') + '</div>' +
        '<div class="bar" style="margin-bottom:12px"><i style="width:' + (100 * i / set.length) + '%"></i></div><div class="panel" id="qp">' + renderQ(q) + '</div>' +
        '<div class="row" style="margin-top:10px"><button class="btn sm ghost" id="quit">Abandon test</button></div>';
      if (cap) tick();
      $('#quit', p).onclick = function () { if (confirm('Abandon this attempt? It counts as an attempt but not a score.')) { st(s.id).attempts++; persist(); if (timerId) clearInterval(timerId); route(); } };
      wire($('#qp', p), q, function (ok, picked) {
        answers.push({ ok: ok, picked: picked });
        if (!q.input) { var b = $('#qp', p).querySelector('[data-c="' + picked + '"]'); if (b) b.classList.add('sel'); }
        setTimeout(function () { i++; show(); }, q.input ? 150 : 220);
      }, false);
    }
    function finish() {
      if (timerId) clearInterval(timerId);
      while (answers.length < set.length) answers.push({ ok: false, picked: null, timeout: true });
      var right = answers.filter(function (a) { return a.ok; }).length, pct = Math.round(1000 * right / set.length) / 10;
      var x = st(s.id), passed = pct > PASS, first = passed && !x.passed;
      x.attempts++; x.best = Math.max(x.best || 0, pct);
      if (passed) x.passed = true;
      S.history.push({ stage: s.id, pct: pct, at: Date.now() });
      if (cap) {
        var byD = {}; set.forEach(function (q, k) { var d = q.d || 0; byD[d] = byD[d] || [0, 0]; byD[d][1]++; if (answers[k].ok) byD[d][0]++; });
      }
      persist(); topbar();
      var next = STAGES.filter(function (o) { return o.prev === s; })[0];
      var h = '<div class="panel center"><div class="tag">' + (passed ? 'PASSED' : 'NOT YET') + '</div><div class="big" style="color:' + (passed ? 'var(--ok)' : 'var(--bad)') + '">' + pct + '%</div>' +
        '<p>' + right + '/' + set.length + ' correct · needed over ' + PASS + '%</p>';
      if (passed) h += '<p class="muted">Write down your checkpoint phrase. Typing it into <b>Save → Restore</b> on any device puts you right back here.</p><div class="code" id="cp">' + esc(s.code) + '</div>' +
        '<div class="row" style="justify-content:center;margin-top:10px"><button class="btn" id="cpy">Copy phrase</button>' + (next ? '<button class="btn pri" data-go="#stage/' + next.id + '">Unlocked: ' + esc(next.title) + ' →</button>' : '') + '</div>';
      else h += '<p class="muted">Review every miss below, drill the cards, and use Practice → Missed only. Then retake — the questions reshuffle.</p>';
      h += '</div>';
      if (cap && byD) h += '<div class="panel" style="margin-top:12px"><h3>By domain</h3>' + Object.keys(byD).map(function (d) { var v = byD[d], pc = Math.round(100 * v[0] / v[1]); return '<div class="row small" style="margin:6px 0"><span style="flex:0 0 52%">' + esc(((cap && cap.domains) || C.domains || {})[d] || 'Other') + '</span><div class="bar grow"><i style="width:' + pc + '%;background:' + (pc > PASS ? 'var(--ok)' : pc >= 75 ? 'var(--lock)' : 'var(--bad)') + '"></i></div><span class="mono">' + pc + '%</span></div>'; }).join('') + '</div>';
      h += '<h3 style="margin-top:18px">Review</h3><div class="stack">';
      set.forEach(function (q, k) {
        var a = answers[k];
        var yours = a.timeout ? '(time ran out)' : q.input ? a.picked : (a.picked != null ? q.c[a.picked] : '');
        if (!a.ok && !q.gen) { var oi = s.qs.indexOf(q); }
        h += '<div class="panel tight"><div class="small muted">Q' + (k + 1) + ' · ' + (a.ok ? '<span style="color:var(--ok)">correct</span>' : '<span style="color:var(--bad)">missed</span>') + '</div><div class="q" style="font-size:.95rem">' + (q.html ? q.q : esc(q.q)) + '</div>' +
          (!a.ok ? '<div class="small">You: <code>' + esc(yours) + '</code></div>' : '') + explainHtml(q, a.ok) + '</div>';
      });
      h += '</div>';
      p.innerHTML = h;
      var cp = $('#cpy', p); if (cp) cp.onclick = function () { copy(s.code); };
      if (first) toast('🔓 ' + (next ? next.title + ' unlocked' : 'Path complete!'), 3000);
    }
    show();
  }

  // ---------- LABS ----------
  function pLabs(p, s) {
    p.innerHTML = '<div class="list">' + (s.labs || []).map(function (id) {
      var L = C.labs[id], ok = st(s.id).labs[id];
      return '<button class="li" data-go="#lab/' + id + '"><span class="chip ' + (ok ? 'ok' : '') + '">' + (ok ? '✓' : 'LAB') + '</span><span class="grow"><b>' + esc(L.title) + '</b><div class="s">' + esc(L.sum || '') + '</div></span><span class="muted">›</span></button>';
    }).join('') + '</div>';
  }
  function labStage(id) { return STAGES.filter(function (s) { return (s.labs || []).indexOf(id) >= 0; })[0]; }
  function vLabs(m) {
    var h = '<h1>Labs</h1><p class="muted">Every lab from steps you have unlocked. Labs stay open for practice after you pass.</p>';
    STAGES.forEach(function (s) {
      if (!(s.labs || []).length) return;
      var un = unlocked(s);
      h += '<div class="tier"><h3>' + esc(stepLabel(s)) + '. ' + esc(s.title) + '</h3>' + (un ? '' : '<span class="chip lock">🔒</span>') + '</div><div class="list">';
      s.labs.forEach(function (id) {
        var L = C.labs[id], ok = st(s.id).labs[id];
        h += '<button class="li" ' + (un ? 'data-go="#lab/' + id + '"' : 'disabled style="opacity:.5"') + '><span class="chip ' + (ok ? 'ok' : '') + '">' + (ok ? '✓' : 'LAB') + '</span><span class="grow"><b>' + esc(L.title) + '</b><div class="s">' + esc(L.sum || '') + '</div></span></button>';
      });
      h += '</div>';
    });
    m.innerHTML = h;
  }
  function vLab(m, args) {
    var id = args[0], L = C.labs[id], s = labStage(id);
    if (!L || !s || !unlocked(s)) { location.hash = '#labs'; return; }
    var kind = window.LAB_KINDS && window.LAB_KINDS[L.kind || 'net'];
    var api = {
      lite: S.device === 'phone',
      load: function () { return load(C.id + ':lab:' + id, null); },
      save: function (v) { save(C.id + ':lab:' + id, v); },
      clear: function () { try { localStorage.removeItem(C.id + ':lab:' + id); } catch (e) { } },
      complete: function () {
        if (!st(s.id).labs[id]) { st(s.id).labs[id] = true; persist(); toast('✓ Lab complete: ' + esc(L.title), 2600); }
      },
      done: function () { return !!st(s.id).labs[id]; },
      back: '#stage/' + s.id + '/labs',
      esc: esc, modal: modal, toast: toast,
      setCleanup: function (f) { cleanup = f; }
    };
    kind.render(m, L, api);
  }

  // ---------- CARDS (global) ----------
  function vCards(m) {
    var open = STAGES.filter(unlocked), all = [];
    open.forEach(function (s) { all = all.concat(s.cards); });
    var due = dueCards(all).length;
    m.innerHTML = '<h1>Flashcards</h1><p class="muted">Spaced repetition across every unlocked step. ' + due + ' due now of ' + all.length + '.</p>' +
      '<div class="row" style="margin-bottom:12px"><button class="btn pri" id="all">Review all due</button></div><div class="list">' +
      open.map(function (s) { return '<button class="li" data-st="' + s.id + '"><span class="grow"><b>' + esc(stepLabel(s)) + '. ' + esc(s.title) + '</b><div class="s">' + dueCards(s.cards).length + ' due · ' + s.cards.length + ' cards</div></span><span class="muted">›</span></button>'; }).join('') + '</div><div id="pane"></div>';
    $('#all', m).onclick = function () { var p = document.createElement('div'); m.innerHTML = ''; m.appendChild(p); cardSession(p, all, 'All decks'); };
    m.querySelectorAll('[data-st]').forEach(function (b) { b.onclick = function () { location.hash = '#stage/' + b.dataset.st + '/cards'; }; });
  }

  // ---------- TOOLS ----------
  function vTools(m) {
    m.innerHTML = '<h1>Tools & drills</h1><p class="muted">Endless, randomly generated practice. Use them any time — they never run out.</p><div class="list">' +
      (C.tools || []).map(function (t) { return '<button class="li" data-go="#tool/' + t.id + '"><span class="grow"><b>' + esc(t.title) + '</b><div class="s">' + esc(t.desc) + '</div></span><span class="muted">›</span></button>'; }).join('') + '</div>';
  }
  function vTool(m, args) {
    var t = (C.tools || []).filter(function (x) { return x.id === args[0]; })[0];
    if (!t) return vTools(m);
    m.innerHTML = '<div class="row" style="margin-bottom:8px"><button class="btn sm ghost" data-go="#tools">← Tools</button></div><h1>' + esc(t.title) + '</h1><div id="tool"></div>';
    t.render($('#tool', m), { esc: esc, shuffle: shuffle, toast: toast, gens: C.gens, renderQ: renderQ, wire: wire, prep: prep, setCleanup: function (f) { cleanup = f; } });
  }

  // ---------- SAVE / CODES ----------
  function normCode(c) { return String(c).toUpperCase().replace(/[^A-Z0-9]+/g, ''); }
  function restoreTo(s) {
    STAGES.forEach(function (o) {
      if (o.track === s.track && o.tidx <= s.tidx) { var x = st(o.id); x.lesson = true; (o.labs || []).forEach(function (l) { x.labs[l] = true; }); if (!x.passed) { x.passed = true; x.best = Math.max(x.best || 0, PASS + 1); x.restored = true; } }
    });
    persist();
  }
  function vCodes(m) {
    var earned = STAGES.filter(function (s) { return st(s.id).passed; });
    var hist = S.history.slice(-8).reverse();
    m.innerHTML = '<h1>Save & restore</h1>' +
      '<div class="panel"><h3>Restore from a checkpoint phrase</h3><p class="muted small">Lost your progress or switched devices? Type the phrase from the last step you passed. Every step up to it unlocks.</p>' +
      '<div class="row"><input class="answer-in grow" id="rc" placeholder="e.g. ' + esc(C.codeExample || 'PHRASE-HERE') + '" autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck="false"><button class="btn pri" id="rb">Restore</button></div></div>' +
      '<div class="panel" style="margin-top:12px"><h3>Your checkpoint phrases</h3>' +
      (earned.length ? '<div class="list">' + earned.map(function (s) { return '<div class="li" style="cursor:default"><span class="chip ok">' + esc(stepLabel(s).replace('Step ', '')) + '</span><span class="grow"><b>' + esc(s.title) + '</b><div class="mono small" style="color:var(--acc);margin-top:2px">' + esc(s.code) + '</div></span><button class="btn sm" data-cp="' + esc(s.code) + '">Copy</button></div>'; }).join('') + '</div>' +
        '<p class="muted small" style="margin-top:10px">Only your latest phrase in each track matters — it restores everything before it in that track.</p>' : '<p class="muted">Pass your first gate test to earn a phrase.</p>') + '</div>' +
      '<div class="panel" style="margin-top:12px"><h3>Backup file</h3><p class="muted small">Exports everything — card schedules, missed questions, lab configs. Use it to move between iPhone and laptop with full detail.</p>' +
      '<div class="row"><button class="btn" id="ex">Export backup</button><label class="btn">Import backup<input type="file" id="im" accept=".json,application/json" hidden></label></div></div>' +
      '<div class="panel" style="margin-top:12px"><h3>Device mode</h3><p class="muted small">Currently: <b>' + (S.device === 'phone' ? 'Phone (lite)' : 'Laptop (full)') + '</b></p><button class="btn" id="dev">Switch device mode</button></div>' +
      (hist.length ? '<div class="panel" style="margin-top:12px"><h3>Recent tests</h3>' + hist.map(function (h) { var s = stageById(h.stage); return '<div class="row small" style="margin:4px 0"><span class="grow">' + esc(s ? s.title : h.stage) + '</span><span class="mono" style="color:' + (h.pct > PASS ? 'var(--ok)' : 'var(--bad)') + '">' + h.pct + '%</span><span class="dim">' + new Date(h.at).toLocaleDateString() + '</span></div>'; }).join('') + '</div>' : '') +
      '<div class="panel" style="margin-top:12px"><h3>Danger zone</h3><button class="btn warn" id="rs">Reset all progress</button></div>';
    $('#rb', m).onclick = function () {
      var v = normCode($('#rc', m).value);
      var s = STAGES.filter(function (x) { return normCode(x.code) === v; })[0];
      if (!s) { toast('That phrase does not match any step. Check spelling.'); return; }
      restoreTo(s); S.track = s.track; toast('✓ Restored through ' + esc(stepLabel(s)) + ': ' + esc(s.title), 3000); route();
    };
    m.querySelectorAll('[data-cp]').forEach(function (b) { b.onclick = function () { copy(b.dataset.cp); }; });
    $('#ex', m).onclick = function () {
      var labs = {}; try { for (var k = 0; k < localStorage.length; k++) { var key = localStorage.key(k); if (key.indexOf(C.id + ':lab:') === 0) labs[key] = localStorage.getItem(key); } } catch (e) { }
      var blob = new Blob([JSON.stringify({ course: C.id, at: Date.now(), state: S, labs: labs })], { type: 'application/json' });
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = C.id + '-backup-' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    };
    $('#im', m).onchange = function (e) {
      var f = e.target.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var d = JSON.parse(r.result);
          if (d.course !== C.id) { toast('That backup belongs to a different course (' + esc(d.course) + ')'); return; }
          var dev = S.device; S = d.state; S.device = dev; persist();
          Object.keys(d.labs || {}).forEach(function (k) { try { localStorage.setItem(k, d.labs[k]); } catch (e) { } });
          toast('✓ Backup imported'); route();
        } catch (err) { toast('Could not read that file'); }
      };
      r.readAsText(f);
    };
    $('#dev', m).onclick = function () { picker(true); };
    $('#rs', m).onclick = function () {
      if (prompt('Type RESET to wipe all progress on this device') === 'RESET') {
        try { Object.keys(localStorage).forEach(function (k) { if (k.indexOf(C.id + ':') === 0) localStorage.removeItem(k); }); } catch (e) { }
        var dev = S.device; S = { device: dev, stages: {}, cards: {}, missed: {}, history: [], created: Date.now() }; persist(); route();
      }
    };
  }

  // expose for lab plugins / debugging
  window.ENGINE_Q = { prep: prep, renderQ: renderQ, wire: wire };
  window.ENGINE = { state: function () { return S; }, persist: persist, stages: STAGES, st: st, route: route, esc: esc };

  // ---------- boot ----------
  shell();
  if (!S.device) picker(false); else route();
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () { }); });
  }
})();
