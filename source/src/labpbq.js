/* Hands-on PBQ-style labs: match (one or more columns of dropdowns), order (arrange steps), calc (numeric answers), acl (build a firewall rule set and test it). */
(function () {
  'use strict';
  function $(s, r) { return (r || document).querySelector(s); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function head(L, api, tag) {
    return '<div class="row" style="margin-bottom:8px"><button class="btn sm ghost" data-go="' + api.back + '">← Back</button><span class="grow"></span>' +
      (L.hints && L.hints.length ? '<button class="btn sm ghost" id="hint">Hint</button>' : '') + '<button class="btn sm warn" id="rst">Reset</button></div>' +
      '<div class="tag">' + tag + ' · HANDS-ON LAB</div><h1 style="margin:4px 0 6px">' + esc(L.title) + '</h1>' +
      '<div class="panel tight small" style="margin-bottom:10px">' + L.brief + '</div>';
  }
  function common(m, L, api, redraw) {
    var hi = 0, h = $('#hint', m);
    if (h) h.onclick = function () { var k = Math.min(hi++, L.hints.length - 1); api.modal('<div class="tag">Hint ' + (k + 1) + ' of ' + L.hints.length + '</div><p>' + L.hints[k] + '</p><button class="btn" data-close>Got it</button>'); };
    $('#rst', m).onclick = function () { if (!confirm('Reset this lab?')) return; api.clear(); redraw(true); };
  }
  function finish(api, L, allOk, out) {
    if (allOk) {
      out.innerHTML = '<div class="explain"><b class="v" style="color:var(--ok)">All correct.</b><div>' + (L.debrief || '') + '</div></div>';
      if (!api.done()) { api.complete(); }
    } else out.innerHTML = '<div class="explain"><b class="v" style="color:var(--bad)">Not yet.</b><div>Rows marked red are wrong. Read the explanation on each, fix them, and check again.</div></div>';
  }

  // ---------------- MATCH ----------------
  function renderMatch(m, L, api, fresh) {
    var saved = fresh ? null : api.load();
    var cols = L.cols || [{ name: 'Answer', options: L.options }];
    var order = saved && saved.order && saved.order.length === L.items.length ? saved.order : (L.keep ? L.items.map(function (_, i) { return i; }) : shuffle(L.items.map(function (_, i) { return i; })));
    var picks = saved && saved.picks ? saved.picks : {};
    m.innerHTML = head(L, api, 'PBQ') + '<div id="rows"></div><div class="row" style="margin-top:10px"><button class="btn pri" id="chk">Check answers</button><span class="chip" id="sc"></span></div><div id="out" style="margin-top:10px"></div>' +
      '<p class="dim small">Pick an answer in every dropdown, then Check. This mirrors the drag-and-drop / dropdown performance-based questions on the real exam.</p>';
    var rows = $('#rows', m);
    rows.innerHTML = order.map(function (ii) {
      var it = L.items[ii];
      return '<div class="pbq-row" data-i="' + ii + '"><div class="it">' + it.t + '</div>' + cols.map(function (c, ci) {
        var opts = c.options, cur = (picks[ii] || [])[ci] || '';
        return '<label class="small muted" style="display:flex;flex-direction:column;gap:3px">' + (cols.length > 1 ? esc(c.name) : '') + '<select data-c="' + ci + '"><option value="">— choose —</option>' + opts.map(function (o) { return '<option' + (o === cur ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('') + '</select></label>';
      }).join('') + '<div class="why small" style="flex-basis:100%;display:none"></div></div>';
    }).join('');
    function persist() { api.save({ order: order, picks: picks }); }
    rows.addEventListener('change', function (e) { var sel = e.target.closest('select'); if (!sel) return; var r = sel.closest('.pbq-row'), ii = +r.dataset.i; picks[ii] = picks[ii] || []; picks[ii][+sel.dataset.c] = sel.value; r.classList.remove('ok', 'bad'); persist(); });
    $('#chk', m).onclick = function () {
      var right = 0;
      rows.querySelectorAll('.pbq-row').forEach(function (r) {
        var ii = +r.dataset.i, it = L.items[ii], ans = Array.isArray(it.a) ? it.a : [it.a], p = picks[ii] || [];
        var ok = ans.every(function (a, ci) { return Array.isArray(a) ? a.indexOf(p[ci]) >= 0 : p[ci] === a; });
        r.classList.toggle('ok', ok); r.classList.toggle('bad', !ok); if (ok) right++;
        var w = r.querySelector('.why'); w.style.display = 'block';
        w.innerHTML = (ok ? '<span style="color:var(--ok)">✓</span> ' : '<span style="color:var(--bad)">✗ Answer: ' + esc(ans.map(function (a) { return Array.isArray(a) ? a[0] : a; }).join(' · ')) + '.</span> ') + (it.why || '');
      });
      $('#sc', m).textContent = right + '/' + L.items.length;
      finish(api, L, right === L.items.length, $('#out', m));
    };
    common(m, L, api, function () { renderMatch(m, L, api, true); });
  }

  // ---------------- ORDER ----------------
  function renderOrder(m, L, api, fresh) {
    var saved = fresh ? null : api.load(), n = L.items.length;
    var cur = saved && saved.cur && saved.cur.length === n ? saved.cur : (function () { var o = shuffle(L.items.map(function (_, i) { return i; })); var same = o.every(function (v, i) { return v === i; }); if (same) o.reverse(); return o; })();
    function draw(checked) {
      var right = 0;
      $('#ol', m).innerHTML = cur.map(function (ii, pos) {
        var ok = ii === pos; if (ok) right++;
        return '<div class="ord' + (checked ? (ok ? ' pbq-row ok' : ' pbq-row bad') : '') + '"><span class="n">' + (pos + 1) + '</span><span class="t">' + L.items[ii].t + (checked && L.items[ii].why ? '<div class="small muted" style="margin-top:4px">' + (ok ? '✓ ' : '✗ belongs at step ' + (ii + 1) + '. ') + L.items[ii].why + '</div>' : '') + '</span>' +
          '<button class="btn sm" data-up="' + pos + '" ' + (pos === 0 ? 'disabled' : '') + '>▲</button><button class="btn sm" data-dn="' + pos + '" ' + (pos === n - 1 ? 'disabled' : '') + '>▼</button></div>';
      }).join('');
      return right;
    }
    m.innerHTML = head(L, api, 'PBQ') + '<div id="ol"></div><div class="row" style="margin-top:10px"><button class="btn pri" id="chk">Check order</button><span class="chip" id="sc"></span></div><div id="out" style="margin-top:10px"></div>' +
      '<p class="dim small">Use ▲ ▼ to move each step into the correct order (first at the top).</p>';
    draw(false);
    $('#ol', m).addEventListener('click', function (e) {
      var u = e.target.closest('[data-up]'), d = e.target.closest('[data-dn]');
      if (u) { var i = +u.dataset.up; var t = cur[i]; cur[i] = cur[i - 1]; cur[i - 1] = t; }
      else if (d) { var j = +d.dataset.dn; var t2 = cur[j]; cur[j] = cur[j + 1]; cur[j + 1] = t2; }
      else return;
      api.save({ cur: cur }); draw(false); $('#out', m).innerHTML = '';
    });
    $('#chk', m).onclick = function () { var r = draw(true); $('#sc', m).textContent = r + '/' + n; finish(api, L, r === n, $('#out', m)); };
    common(m, L, api, function () { renderOrder(m, L, api, true); });
  }

  // ---------------- CALC ----------------
  function num(v) { var t = String(v).replace(/[$,%\s]/g, ''); return t === '' ? NaN : +t; }
  function renderCalc(m, L, api, fresh) {
    var saved = fresh ? null : api.load(), vals = saved && saved.vals ? saved.vals : {};
    m.innerHTML = head(L, api, 'PBQ') + '<div class="pbq">' + L.fields.map(function (f, i) {
      var txt = typeof f.a === 'string';
      return '<div class="pbq-row" data-i="' + i + '"><div class="it">' + f.label + '</div><input class="num"' + (txt ? ' autocapitalize="none" autocorrect="off" spellcheck="false"' : ' inputmode="decimal"') + ' data-f="' + i + '" placeholder="' + esc(f.unit || (txt ? 'answer' : 'number')) + '" value="' + esc(vals[i] || '') + '"><div class="why small" style="flex-basis:100%;display:none"></div></div>';
    }).join('') + '</div><div class="row" style="margin-top:10px"><button class="btn pri" id="chk">Check</button><span class="chip" id="sc"></span></div><div id="out" style="margin-top:10px"></div>' +
      '<p class="dim small">Enter plain numbers ($ and commas are fine). Answers within ' + (L.tolPct || 1) + '% are accepted.</p>';
    m.querySelectorAll('[data-f]').forEach(function (inp) { inp.oninput = function () { vals[inp.dataset.f] = inp.value; api.save({ vals: vals }); inp.closest('.pbq-row').classList.remove('ok', 'bad'); }; });
    $('#chk', m).onclick = function () {
      var right = 0;
      L.fields.forEach(function (f, i) {
        var r = m.querySelector('.pbq-row[data-i="' + i + '"]'), ok;
        if (typeof f.a === 'string') {
          var norm = function (s) { return String(s).trim().toLowerCase().replace(/\s+/g, '').replace(/^\//, ''); };
          ok = norm(vals[i] || '') === norm(f.a);
        } else {
          var v = num(vals[i] || ''), tol = Math.max(Math.abs(f.a) * (L.tolPct || 1) / 100, f.tol || 0.005);
          ok = !isNaN(v) && Math.abs(v - f.a) <= tol;
        }
        if (ok) right++;
        r.classList.toggle('ok', ok); r.classList.toggle('bad', !ok);
        var w = r.querySelector('.why'); w.style.display = 'block'; w.innerHTML = (ok ? '<span style="color:var(--ok)">✓</span> ' : '<span style="color:var(--bad)">✗ Expected ' + esc(f.show || f.a) + '.</span> ') + (f.why || '');
      });
      $('#sc', m).textContent = right + '/' + L.fields.length;
      finish(api, L, right === L.fields.length, $('#out', m));
    };
    common(m, L, api, function () { renderCalc(m, L, api, true); });
  }

  // ---------------- ACL (firewall rule builder) ----------------
  function ip2n(ip) { var p = String(ip).split('.').map(Number); return p.length === 4 && p.every(function (x) { return x >= 0 && x <= 255; }) ? ((p[0] << 24) >>> 0) + (p[1] << 16) + (p[2] << 8) + p[3] : null; }
  function inNet(ip, spec) {
    if (spec === 'ANY') return true;
    var m = /^(\d+\.\d+\.\d+\.\d+)(?:\/(\d+))?$/.exec(spec); if (!m) return false;
    var bits = m[2] === undefined ? 32 : +m[2], a = ip2n(ip), b = ip2n(m[1]); if (a === null || b === null) return false;
    var mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0; return ((a & mask) >>> 0) === ((b & mask) >>> 0);
  }
  function portOk(port, spec) { if (spec === 'ANY' || spec === '') return true; return String(spec).split(',').some(function (s) { var r = /^(\d+)-(\d+)$/.exec(s.trim()); if (r) return port >= +r[1] && port <= +r[2]; return +s === port; }); }
  function evalRules(rules, f) {
    for (var i = 0; i < rules.length; i++) {
      var r = rules[i];
      if (!r.src || !r.dst || !r.act) continue;
      if (!inNet(f.src, r.src) || !inNet(f.dst, r.dst)) continue;
      if (r.proto !== 'ANY' && r.proto !== f.proto) continue;
      if (f.proto !== 'ICMP' && !portOk(f.port, r.port || 'ANY')) continue;
      return { act: r.act, rule: i + 1 };
    }
    return { act: 'DENY', rule: 0 };
  }
  function renderAcl(m, L, api, fresh) {
    var saved = fresh ? null : api.load(), N = L.rows || 5;
    var rules = saved && saved.rules ? saved.rules : (L.prefill || []).concat([]).map(function (r) { return Object.assign({}, r); });
    while (rules.length < N) rules.push({ src: '', dst: '', proto: 'TCP', port: '', act: '' });
    function sel(name, opts, v, i) { return '<select data-r="' + i + '" data-k="' + name + '">' + opts.map(function (o) { var val = typeof o === 'string' ? o : o[0], lab = typeof o === 'string' ? o : o[1]; return '<option value="' + esc(val) + '"' + (val === v ? ' selected' : '') + '>' + esc(lab) + '</option>'; }).join('') + '</select>'; }
    var nets = [['', '—']].concat(L.nets.map(function (n) { return [n[0], n[1] + ' (' + n[0] + ')']; })).concat([['ANY', 'ANY']]);
    m.innerHTML = head(L, api, 'FIREWALL PBQ') +
      '<div class="panel tight small" style="margin-bottom:10px"><b>Networks</b><br>' + L.nets.map(function (n) { return esc(n[1]) + ': <code>' + esc(n[0]) + '</code>'; }).join(' · ') + '<br><span class="muted">Rules are checked top to bottom; the first match wins. Anything that matches no rule is denied (implicit deny).</span></div>' +
      '<div style="overflow-x:auto"><table class="acl"><tr><th>#</th><th>Source</th><th>Destination</th><th>Proto</th><th>Port(s)</th><th>Action</th></tr>' +
      rules.map(function (r, i) {
        return '<tr><td class="mono">' + (i + 1) + '</td><td>' + sel('src', nets, r.src, i) + '</td><td>' + sel('dst', nets, r.dst, i) + '</td><td>' + sel('proto', ['TCP', 'UDP', 'ICMP', 'ANY'], r.proto, i) + '</td><td><input data-r="' + i + '" data-k="port" value="' + esc(r.port) + '" placeholder="443 or ANY" inputmode="numeric"></td><td>' + sel('act', [['', '—'], 'ALLOW', 'DENY'], r.act, i) + '</td></tr>';
      }).join('') + '</table></div>' +
      '<div class="row" style="margin-top:10px"><button class="btn pri" id="chk">Test the rule set</button><span class="chip" id="sc"></span></div><div id="flows" style="margin-top:8px"></div><div id="out" style="margin-top:10px"></div>';
    m.querySelector('table').addEventListener('input', function (e) { var t = e.target; if (!t.dataset.k) return; rules[+t.dataset.r][t.dataset.k] = t.value.trim().toUpperCase() === 'ANY' ? 'ANY' : t.value.trim(); api.save({ rules: rules }); });
    m.querySelector('table').addEventListener('change', function (e) { var t = e.target; if (!t.dataset.k) return; rules[+t.dataset.r][t.dataset.k] = t.value; api.save({ rules: rules }); });
    $('#chk', m).onclick = function () {
      var right = 0;
      $('#flows', m).innerHTML = L.tests.map(function (f) {
        var r = evalRules(rules, f), ok = r.act === f.expect; if (ok) right++;
        return '<div class="flow ' + (ok ? 'ok' : 'bad') + '">' + (ok ? '✓ ' : '✗ ') + esc(f.name) + ' — ' + esc(f.src) + ' → ' + esc(f.dst) + ' ' + esc(f.proto) + (f.proto === 'ICMP' ? '' : '/' + f.port) + ': ' + r.act + (r.rule ? ' by rule ' + r.rule : ' (implicit deny)') + (ok ? '' : ' — should be ' + f.expect) + '</div>';
      }).join('');
      $('#sc', m).textContent = right + '/' + L.tests.length + ' flows';
      var extra = L.maxRules && rules.filter(function (r) { return r.src && r.dst && r.act; }).length > L.maxRules;
      if (extra && right === L.tests.length) { $('#out', m).innerHTML = '<div class="explain"><b class="v" style="color:var(--lock)">Works, but too many rules.</b><div>Every flow behaves correctly, but use ' + L.maxRules + ' rules or fewer — simplify (one rule can cover a whole subnet, and the implicit deny already blocks everything else).</div></div>'; return; }
      finish(api, L, right === L.tests.length, $('#out', m));
    };
    common(m, L, api, function () { renderAcl(m, L, api, true); });
  }

  window.LAB_KINDS = window.LAB_KINDS || {};
  window.LAB_KINDS.match = { render: function (m, L, api) { renderMatch(m, L, api, false); } };
  window.LAB_KINDS.order = { render: function (m, L, api) { renderOrder(m, L, api, false); } };
  window.LAB_KINDS.calc = { render: function (m, L, api) { renderCalc(m, L, api, false); } };
  window.LAB_KINDS.acl = { render: function (m, L, api) { renderAcl(m, L, api, false); } };
  window.PBQ_TEST = { evalRules: evalRules, inNet: inNet };
})();
