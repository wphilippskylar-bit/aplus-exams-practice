# Console Upgrade Playbook

How to finish rebuilding Phil's study consoles to the same standard as **Net+ Range** and **A+ Core 2 Domain 1**.
Written for whichever model (or person) continues the work. Read this whole file before touching a repo.

## 1. The standard (what "done" means)

Every certification console follows **Domain → Objective → Part**, in the official exam-objective order.

- **No mixed domains** until the final practice exam.
- **Objective** = one stage, titled with the official number (`1.5 Microsoft command-line tools`) and showing CompTIA's exact objective statement.
- **Part** = one idea. Target 2–3 minutes of reading, **never over 5**; a part plus its lab never over **15**.
  Each part has:
  1. `obj` — "🎯 Objective for this part": one sentence starting with a verb, saying what the learner will be able to *do*.
  2. `html` — the lesson. Plain words, short sentences, a table when comparing 3+ things. Define every term the first time.
  3. `q` — a quick check of 2–3 multiple-choice questions on exactly what the part taught.
  4. `lab` — a **paired lab that practices only what that part taught** (at least half the parts in an objective, all of them where a lab makes sense).
- **Objective wrap-up** = 5–6 recap lines + one *combined* lab (different from any part's lab) + a 15-question objective test.
- **Domain wrap-up** = recap of every objective + a bigger mixed lab + a 30-question domain test. 90% or better unlocks the next stage.
- **Flip**: every lab opens from its part ("Flip to the lab →") and has a banner back to that exact part ("⇄ Flip back to Learn"). The engine does this; you only set `lab`.

### Writing rules (these are what make it feel like TryHackMe / Professor Messer)

- Teach **only what the objective lists**, bullet by bullet — every bullet in the official objective must appear in some part. Do not drift into other objectives; point forward instead ("more in 4.9").
- Beginner-first (a true beginner uses these): no undefined jargon, one idea per sentence. Then add one professional touch per part:
  - `<div class="callout pro"><b class="k">On the job</b> …</div>` — how a working tech really uses it.
  - `<div class="callout trap"><b class="k">Exam trap</b> …</div>` — the confusion the exam exploits.
- Symptom → cause → fix tables for anything troubleshooting.
- Labs must match the verb of the objective: "Given a scenario, use…" → the learner *uses* it (terminal lab or scenario match). "Compare and contrast…" → a pick-the-right-one lab.
- **Terminal labs** (`RK.T`) are the priority wherever a command exists. Rules:
  - The task says **what to achieve, never the command**.
  - Give realistic output, then where useful an `ask` question that makes the learner **read the output**.
  - Chain tasks into one real ticket (config → gateway → DNS → path), not a list of unrelated commands.
  - `accept` regexes must be forgiving (spacing, common variants) and `show` must pass its own `accept` (the checker enforces this).
- Questions: one clearly right answer, three plausible wrong ones, and an explanation that teaches. No "all of the above".
- Everything stays **defensive / simulated / authorized-only**. No live targets, no attack tooling instructions beyond what the exam objectives themselves name.

## 2. Report card (16 Nov 2026)

Scale: 100 = finishing it leaves you able to do the job and teach it. Target for every console: **90+**.
Five criteria × 20: objective coverage · depth & accuracy · hands-on · structure & pacing · assessment.

| Console | Coverage | Depth | Hands-on | Structure | Assessment | **Now** | After the queue below |
|---|---|---|---|---|---|---|---|
| Net+ Range (N10-009) | 18 | 14 | 16 | 19 | 17 | **84** | 91 (terminal labs + depth pass) |
| A+ Range — Core 2 Domain 1 (rebuilt) | 19 | 17 | 18 | 19 | 17 | **90** | — |
| A+ Range — the other 8 domains | 12 | 6 | 5 | 6 | 15 | **44** | 90 |
| Security+ Range (SY0-701) | 16 | 9 | 8 | 12 | 18 | **63** | 90 |
| Cloud Range (15 cert tracks) | 10 | 10 | 10 | 9 | 12 | **51** | 85–90 on the tracks you finish |
| Code Range (11 skill tracks) | 16 | 14 | 18 | 10 | 12 | **70** | 90 |

Why the low scores:
- **A+ (old domains)**: about 250 words of lesson per *domain*. It is a question bank with a thin summary on top.
- **Security+**: already organized by objective and has 1,300 questions, but only ~170 words of teaching per objective and 13 objectives with no lab.
- **Cloud**: far too wide for its depth — 15 certifications at 3–6 stages each. Finish one ladder properly before widening (recommended: AZ-900 → AZ-104, or CLF-C02 → SAA-C03, whichever the job hunt asks for).
- **Code**: best hands-on of all (real code runner, shell, Git and AD simulators) but the Windows track is 2 stages with no labs, there is no remote-access track, and nothing is in the part format yet.
- **Net+**: structure is right; parts average ~115 words, so depth is exam-level, not yet job-level, and it has no terminal labs.

## 3. Work queue (do in this order)

Each item is one sitting. Finish, run the checker, push, tick it off here.

**A+ Range** (`aplus-exams-practice`) — objective lists are in `source/objectives/`.
- [x] Core 2 Domain 1 — Operating Systems (1.1–1.11)
- [ ] Core 2 Domain 4 — Operational Procedures (4.1–4.10). **4.8 scripting and 4.9 remote access get terminal labs** (ssh, mstsc, Enter-PSSession, winrm). Wrap lab id `c2-d4-wrap`.
- [ ] Core 2 Domain 2 — Security (2.1–2.11). **2.2 covers Active Directory** (domain join, OUs, home folders, GPO, security groups, folder redirection): scenario labs + PowerShell terminal lab. Wrap lab `c2-d2-wrap`.
- [ ] Core 2 Domain 3 — Software Troubleshooting (3.1–3.4). Symptom → cause → fix. Wrap lab `c2-d3-wrap`.
- [ ] Core 1 Domain 1 — Mobile Devices (1.1–1.3). Wrap lab `c1-d1-wrap`.
- [ ] Core 1 Domain 2 — Networking (2.1–2.8). Reuse ideas (not text) from Net+ Range. Wrap lab `c1-d2-wrap`.
- [ ] Core 1 Domain 3 — Hardware (3.1–3.8). Wrap lab `c1-d3-wrap`.
- [ ] Core 1 Domain 4 — Virtualization & Cloud (4.1–4.2). Wrap lab `c1-d4-wrap`.
- [ ] Core 1 Domain 5 — Troubleshooting (5.1–5.6). Wrap lab `c1-d5-wrap`.

**Code Range** (`code-range`) — see section 6 for what exists.
- [ ] **New track: Remote Access & Support** (track id `remote`, `unit: 'Module'`, added with `trackDef`/`tierDef` in `RK.build`). All terminal labs.
  - Module 1 · Foundations: 1.1 the remote-access map (RDP 3389, SSH 22, WinRM 5985/5986, VNC 5900, VPN, RMM — which to use when) · 1.2 SSH from the command line (ssh user@host, -p, ssh-keygen, ssh-copy-id, known_hosts, scp) · 1.3 Remote Desktop (mstsc /v, enabling RDP, NLA, Remote Desktop Users group, firewall, qwinsta/logoff).
  - Module 2 · Remote administration: 2.1 PowerShell remoting (Enable-PSRemoting, Test-WSMan, Enter-PSSession, Invoke-Command, TrustedHosts) · 2.2 remote support workflow (verify identity, consent, attended vs unattended, document) · 2.3 troubleshooting ("can't RDP": ping → Test-NetConnection -Port 3389 → service → firewall → group → NLA; "can't SSH": same ladder) · 2.4 secure remote access (VPN first, MFA, jump host, least privilege, keys over passwords, never expose RDP to the Internet).
- [ ] **Rebuild the Windows track** (`win1`, `win2` → two modules, old stages listed in `old` so their questions carry over).
  - Module 1 · Command Prompt: 1.1 files and navigation (cd, dir, md, rd, copy, move, del, ren, type, wildcards) · 1.2 network and system (ipconfig, ping, tracert, nslookup, netstat, tasklist/taskkill, systeminfo, shutdown) · 1.3 admin (net user/localgroup, net use, sfc, chkdsk, robocopy, gpupdate/gpresult, redirection and findstr).
  - Module 2 · PowerShell: 2.1 cmdlets and help (Verb-Noun, Get-Help, Get-Command, aliases) · 2.2 objects and the pipeline (Where-Object, Sort-Object, Select-Object, Get-Member, Export-Csv) · 2.3 managing a PC (Get-Service/Restart-Service, Get-WinEvent, Test-NetConnection, Get-NetIPAddress, execution policy, .ps1 scripts).
- [ ] Convert the Active Directory track (ad1–ad9) to parts, pairing each part with an `ad` simulator lab or a PowerShell terminal lab.
- [ ] Convert the Linux track (lnx1–lnx7) to parts, pairing with the `sh` simulator labs.

**Security+ Range** (`sec-training`) — stages are already one per objective.
- [ ] For each of the 28 objectives: split the lesson into parts, write quick checks, add paired labs (13 objectives have none), add wrap recaps. Keep the XP/level game layer and the 80% gate that app uses.

**Net+ Range** (`netplus-range`)
- [ ] Add terminal labs (5.5 tools, 5.3 tickets, 3.4 DHCP/DNS checks) and one "On the job" + one "Exam trap" callout per part.

**Cloud Range** (`cloud-range`)
- [ ] Pick ONE ladder with Phil, rebuild it by official exam domain → objective, then the next.

## 4. How to build (A+ and Sec+ have source folders)

```
cd aplus-exams-practice/source
#   src/rk-base.js        RangeKit helpers + terminal lab kind   (do not edit per-app; canonical copy in source/rangekit/)
#   src/rk-c2d1a.js …     content files, one or two per domain   (name them rk-c<core>d<domain><letter>.js)
#   src/rk-build.js       domain table: tier ids, old stage ids, wrap lab ids
python3 build.py                                   # writes dist/
node rangekit/rk-check.js dist/index.html          # MUST print "✓ all checks passed"
cp dist/index.html dist/sw.js dist/manifest.json ../ && cp dist/icons/* ../icons/
cd .. && git add -A && git commit -m "…" && git push
```

- A domain is rebuilt as soon as **any** objective for it is registered, and it then replaces the old stage for that domain — so **write a whole domain before building**, never half.
- Old question banks are kept: each objective declares `kw: /regex/`, and old questions/cards from the domain's old stage are sorted to the best-matching objective automatically; unmatched ones go to the domain test. So write `kw` with the objective's distinctive terms.
- The checker fails on: page errors, a learn part over 5 min, part + lab over 15 min, a part without a quick check or objective line, an objective with under 12 test questions (add `RK.extra`), a wrap with under 4 recap lines, match answers missing from their options, a terminal `show` command its own `accept` rejects, or a broken flip/lab/test flow.
- Progress: if the learner had passed the old domain stage, the new objectives start passed ("carried over"). Nothing to do.

For apps **without** a source folder (Cloud, Code): copy `source/rangekit/` from the A+ repo, then
`python3 source/rangekit/rk-inject.py index.html source/rangekit/rk-base.js source/content1.js … source/rk-build.js`.
It patches the engine and inserts the files before it; re-running replaces the earlier block. Keep the content files in `source/` in that repo.
The engine patch has been trial-run on all four track-based consoles (A+, Sec+, Cloud, Code) and loads cleanly.

Skill tracks (not certifications) use the same format with `unit: 'Module'`, and can be brand-new:
```js
RK.build({ track: 'remote', pfx: 'rem', unit: 'Module',
  trackDef: { name: 'Remote Access & Support', short: 'REM', subtitle: 'SSH, RDP, PowerShell remoting and secure remote support', after: 'ad' },
  domains: [{ d: 1, tier: 'rem-f', tierDef: { name: 'Foundations', desc: '…' }, name: 'Foundations', wrapLab: 'rem-m1-wrap' }, …] });
```

### Content file template

```js
(function () {
  var RK = window.RK, P = RK.P, M = RK.M, O = RK.O, T = RK.T, TR = 'core2';
  // labs first (ids must be unique across the app: prefix with the track, e.g. c2-)
  RK.M('c2-xxx', 'Title', 'One-line summary', 'Brief shown at the top.', ['Option A', 'Option B'],
    [['Scenario text', 'Option A', 'Why.'], …], 'Debrief shown when all correct.');
  RK.O('c2-yyy', 'Title', 'Summary', 'Brief.', [['First step', 'why'], ['Second step', 'why'], …], 'Debrief.');   // list in the CORRECT order
  RK.T('c2-zzz', 'Title', 'Summary', 'Ticket / scenario brief.', { shell: 'cmd' | 'ps' | 'bash', prompt: 'C:\\Users\\tech>' },
    [{ t: 'What to achieve (no command!)', accept: [/^regex$/i], show: 'the canonical command', hint: 'a nudge',
       out: 'realistic output', prompt: 'new prompt (optional)', shell: 'bash (optional switch)',
       ask: { q: 'Question about the output', accept: ['answer'], why: 'what it means' }, why: 'one-line takeaway' }], 'Debrief.');

  RK.add({ track: TR, id: '4.9', dom: 4, short: 'Remote access', title: 'CompTIA\'s exact objective statement',
    goal: 'One line: what you can do after this objective.',
    kw: /\b(rdp|remote desktop|vnc|ssh|rmm|spice|winrm|…)/,
    parts: [ P('Part title', 'Verb-first objective for this part.', `<p>lesson html</p>`,
               [['Question?', 'Right answer', ['Wrong', 'Wrong', 'Wrong'], 'Explanation.'], …], 'c2-zzz') ],
    wrap: { recap: ['…', '…', '…', '…', '…'], lab: 'c2-combined-lab-id' } });
  RK.extra(TR, '4.9', [[q, right, [wrong…], why], …]);      // extra test questions (not quick checks)
  RK.cards(TR, '4.9', [['Term', 'Definition'], …]);          // flashcards
})();
```

`cmd` and `ps` terminal labs match case-insensitively (write `/…/i`); `bash` labs are case-sensitive (no `i`).

## 5. Quality bar — reread before every domain

A finished objective passes when someone who has never seen the topic can:
1. read each part in under 5 minutes and answer its quick check;
2. do the paired lab using only what that part taught;
3. explain the wrap-up lines out loud without looking;
4. score 90%+ on the objective test;
and when a working professional reading it finds nothing wrong, nothing missing from the official bullets, and at least one thing per part they would actually say to a junior.

Use **Core 2 objectives 1.5 and 1.9** (`src/rk-c2d1a.js`, `rk-c2d1b.js`) as the model to copy.

## 6. Facts about each repo

| Repo | Site | Engine | Source | Notes |
|---|---|---|---|---|
| netplus-range | /netplus-range/ | single-track, patched by `source/n10-009/patch.py` | content in `source/n10-009/*.js` | storage key `netplus:v2` |
| aplus-exams-practice | /aplus-exams-practice/ | track-based, RangeKit | `source/src`, `build.py` | tracks `core1`, `core2`; 90% gate |
| sec-training | /sec-training/ | track-based + XP game layer | `source/src`, `build.py` | 80% gate; engine not yet patched — run `partsify.py source/src/app.js` first |
| cloud-range | /cloud-range/ | track-based | index.html only | use `rk-inject.py`; has `cloud` console-sim lab kind |
| code-range | /code-range/ | track-based | index.html only (+ `source/` for RangeKit files) | lab kinds `code`, `sh`, `git`, `ad` are real simulators — prefer them over `term` where they fit |

All consoles: GitHub owner `wphilippskylar-bit`, GitHub Pages from the repo root, service worker serves the page network-first.

## 7. Prompt to give the next model

> Read `source/rangekit/PLAYBOOK.md` in `aplus-exams-practice` and follow it exactly. Do the next unticked item in the work queue: write the whole domain as content files modeled on Core 2 objectives 1.5 and 1.9, covering every bullet of each official objective in `source/objectives/`. Build, run `rk-check.js` until it prints "all checks passed", open three parts and one terminal lab in a headless browser to confirm they read well on a phone, then commit, push, and tick the item in the playbook. Tell me the checker output and anything you were unsure about.
