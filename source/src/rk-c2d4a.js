/* A+ Core 2 (220-1202) — Domain 4.0 Operational Procedures — objectives 4.1 to 4.5 */
(function () {
  var RK = window.RK, P = RK.P, M = RK.M, O = RK.O, C = RK.C, TR = 'core2';
  function pro(t) { return '<div class="callout pro"><b class="k">On the job</b>' + t + '</div>'; }
  function trap(t) { return '<div class="callout trap"><b class="k">Exam trap</b>' + t + '</div>'; }

  // ===================== 4.1 Documentation & support systems =====================
  M('c2-ticket', 'Write a good ticket', 'Put each detail in the right ticket field',
    'A user calls: "Hi, it\'s Dana Ruiz in Payroll, ext. 4412. My laptop LT-0388 can\'t print to the 2nd-floor printer since this morning, and payroll runs at 3 PM." Pick the ticket field for each piece.',
    ['User information', 'Device information', 'Issue description', 'Category', 'Severity', 'Escalation level', 'Progress notes', 'Resolution'],
    [['Dana Ruiz, Payroll, ext. 4412', 'User information', 'Who, where, how to reach them.'],
     ['Laptop asset LT-0388, Windows 11 Pro', 'Device information', 'Which machine.'],
     ['Cannot print to PRN-2F since 08:00; other apps work', 'Issue description', 'What, since when, what still works.'],
     ['Hardware → Printing', 'Category', 'Routes the ticket and feeds reports.'],
     ['High — payroll deadline at 3 PM', 'Severity', 'Business impact and urgency.'],
     ['Tier 1 → Tier 2 print-server team', 'Escalation level', 'Who owns it next.'],
     ['10:15 cleared queue, restarted spooler, test page still stuck', 'Progress notes', 'What was tried, in order.'],
     ['Print-server driver updated; test page printed; user confirmed', 'Resolution', 'Fix + confirmation.']],
    'A ticket is written for the next person who opens it. Clear, concise, in order: who, what device, what is wrong, how bad, what you tried, how it ended.');
  M('c2-asset', 'Asset management', 'Inventory, CMDB, tags, life cycle',
    'Pick the term for each description.', ['Inventory list', 'CMDB', 'Asset tag / ID', 'Procurement life cycle', 'Warranty', 'Licensing', 'Assigned user'],
    [['Spreadsheet of every laptop with serial number and location', 'Inventory list', 'What we own.'],
     ['Database that records how assets relate: this server runs that app for this department', 'CMDB', 'Configuration management database.'],
     ['Barcode sticker "LT-0388" on the bottom of a laptop', 'Asset tag / ID', 'Links the device to its record.'],
     ['Request → purchase → receive → deploy → maintain → retire', 'Procurement life cycle', 'Cradle to grave.'],
     ['Vendor replaces a failed motherboard for free until next March', 'Warranty', 'Check before you pay for a repair.'],
     ['Company owns 250 seats of the office suite; 247 are in use', 'Licensing', 'Track seats against installs.'],
     ['The record shows LT-0388 belongs to Dana Ruiz', 'Assigned user', 'Accountability for the device.']],
    'If it has a serial number or a license key, it belongs in asset management.');
  O('c2-offboard', 'Off-board a leaving employee', 'Order the off-boarding checklist',
    'An employee leaves on Friday at 5 PM. Put the off-boarding checklist in a sensible order.',
    [['HR confirms the last day and manager in the ticket', 'Authorization first.'],
     ['Disable the account at the exact end time (do not delete yet)', 'Stops access immediately; keeps data and audit trail.'],
     ['Revoke MFA tokens, VPN access, badges and remote sessions', 'Close every other door.'],
     ['Transfer or preserve mailbox and files as the manager requests', 'Data belongs to the company.'],
     ['Collect laptop, phone and keys; update the asset records', 'Asset management.'],
     ['Remove licenses so the seats can be reused', 'Cost.'],
     ['Delete the account after the retention period', 'Last step, per policy.']],
    'Onboarding and off-boarding checklists exist so nothing depends on memory. Disable first, delete last.');
  M('c2-docs-wrap', 'Which document?', 'Combined 4.1',
    'Pick the document or system for each need.', ['Ticketing system', 'CMDB', 'Incident report', 'Standard operating procedure (SOP)', 'Onboarding checklist', 'Off-boarding checklist', 'SLA', 'Knowledge base article'],
    [['Track a user\'s problem from first call to closure', 'Ticketing system', 'One record per issue.'],
     ['See which business services fail if a database server goes down', 'CMDB', 'Relationships between assets.'],
     ['Record what happened during a malware outbreak, timeline and actions', 'Incident report', 'After a security or major incident.'],
     ['Exact steps to install the custom accounting package the same way every time', 'Standard operating procedure (SOP)', 'Repeatable procedure.'],
     ['Account, laptop, licenses and training for a new hire', 'Onboarding checklist', 'New-user setup.'],
     ['Disable access and recover equipment when someone leaves', 'Off-boarding checklist', 'User removal.'],
     ['The internal promise that priority-1 tickets get a response within 15 minutes', 'SLA', 'Internal or external.'],
     ['A how-to so Tier 1 can fix the VPN error without escalating', 'Knowledge base article', 'Self-service and deflection.']],
    'Every one of these saves time the second time a problem happens.');

  RK.add({ track: TR, id: '4.1', dom: 4, moreLabs: ['c2-asset-ps'], short: 'Documentation & support systems', title: 'Given a scenario, implement best practices associated with documentation and support systems information management',
    goal: 'Write useful tickets, manage assets through their life cycle, and pick the right document for a job.',
    kw: /\b(ticket|asset (tag|management)|inventory|cmdb|procurement|warranty|knowledge base|kb article|incident report|standard operating|\bsop\b|onboarding|off.?boarding|\bsla\b|service.level|severity|escalat)/,
    parts: [
      RK.P('Ticketing systems', 'Write a ticket another technician can pick up and finish without calling the user again.',
        `<p>Every request goes into a <b>ticketing system</b>. A good ticket holds:</p>
<ul><li><b>User information</b> — name, department, contact.</li>
<li><b>Device information</b> — asset tag, model, OS.</li>
<li><b>Description of the issue</b> — what is wrong, since when, what still works, any error text.</li>
<li><b>Category</b> — hardware, software, network, access… Routes the ticket and drives reports.</li>
<li><b>Severity</b> — how much business impact (one user vs the whole site; deadline or not).</li>
<li><b>Escalation level</b> — Tier 1 (help desk) → Tier 2 (specialist) → Tier 3 (engineering/vendor).</li></ul>
<p><b>Clear, concise written communication</b> has three parts:</p>
<ol><li><b>Issue description</b> in the user's symptoms, not your guess.</li>
<li><b>Progress notes</b> — each thing you tried, with time and result.</li>
<li><b>Issue resolution</b> — the cause, the fix, and that the user confirmed it.</li></ol>` + pro('Write notes as if the next tech knows nothing. "Fixed it" helps no one; "Cleared stuck job, restarted Print Spooler, test page OK, user confirmed" does.') + trap('Severity is about business impact, not how loud the caller is.'),
        [['Which ticket field tells the team how much the problem affects the business?', 'Severity', ['Category', 'Device information', 'Progress notes'], 'Severity = impact and urgency.'],
         ['What belongs in the resolution section?', 'The cause, the fix, and that the user confirmed it', ['Only "fixed"', 'The user\'s phone number', 'A copy of the original complaint'], 'Resolution closes the loop.']],
        'c2-ticket'),
      RK.P('Asset management', 'Track a device from purchase to disposal with tags, an inventory and a CMDB.',
        `<ul><li><b>Inventory list</b> — every device: asset tag, serial number, model, location, status.</li>
<li><b>Asset tags and IDs</b> — a barcode/label on the device that matches its record.</li>
<li><b>Configuration management database (CMDB)</b> — more than an inventory: it records <i>relationships</i> (this server hosts that app, which serves that department). Used for impact analysis in change management.</li>
<li><b>Procurement life cycle</b> — request → approve → buy → receive → deploy → maintain → retire/dispose.</li>
<li><b>Warranty and licensing</b> — track expiry dates and seat counts; a warranty claim is cheaper than a repair, and an audit finds unlicensed installs.</li>
<li><b>Assigned users</b> — who has which device, for accountability and off-boarding.</li></ul>` + pro('Scan the asset tag into the ticket every time you touch a device. Over a year that history shows which models fail.') + trap('An inventory says what you have; a CMDB also says how the pieces depend on each other.'),
        [['What does a CMDB record that a simple inventory list does not?', 'Relationships between assets and services', ['Serial numbers', 'Purchase prices only', 'User passwords'], 'Configuration items and their dependencies.'],
         ['A laptop fails three months after purchase. What should you check before paying for a repair?', 'Warranty status', ['License seat count', 'The CMDB relationship', 'The escalation level'], 'Warranty repairs are free.']],
        'c2-asset'),
      RK.P('Types of documents', 'Choose between an incident report, SOP, onboarding/off-boarding checklist, SLA and knowledge base article.',
        `<table><tr><th>Document</th><th>Purpose</th></tr>
<tr><td><b>Incident report</b></td><td>What happened in a security or major incident: timeline, impact, actions, lessons.</td></tr>
<tr><td><b>Standard operating procedure (SOP)</b></td><td>Exact steps for a repeated task — e.g. a <b>software package custom installation procedure</b> (the company\'s exact way to install its custom installation of an app).</td></tr>
<tr><td><b>New-user setup (onboarding) checklist</b></td><td>Account, groups, mailbox, device, licenses, training.</td></tr>
<tr><td><b>User off-boarding checklist</b></td><td>Disable access, recover equipment, transfer data, remove licenses.</td></tr>
<tr><td><b>Service-level agreement (SLA)</b></td><td>Measurable promises. <b>Internal</b>: IT to the business. <b>External/third-party</b>: a vendor or ISP to you.</td></tr>
<tr><td><b>Knowledge base / articles</b></td><td>How-tos and known fixes, for techs and for user self-service.</td></tr></table>` + pro('When you solve something twice, write the knowledge base article. The third time it takes two minutes.') + trap('Off-boarding disables the account first and deletes it later. Deleting immediately loses data and the audit trail.'),
        [['Which document gives the exact repeatable steps to install a custom application?', 'Standard operating procedure', ['Incident report', 'SLA', 'Asset inventory'], 'SOPs make tasks repeatable.'],
         ['An ISP promises 99.9% uptime and credits if it misses. Which document?', 'External/third-party SLA', ['Internal SLA', 'Knowledge base article', 'Onboarding checklist'], 'A provider\'s commitment to you.']],
        'c2-offboard')
    ],
    wrap: { recap: ['Tickets: user, device, description, category, severity, escalation level.', 'Write clearly: issue description, progress notes, resolution with user confirmation.', 'Asset management: inventory, asset tags/IDs, CMDB (relationships), procurement life cycle, warranty, licensing, assigned users.', 'Incident report = what happened. SOP = exact repeatable steps. Knowledge base = known fixes.', 'Onboarding sets a user up; off-boarding disables first, deletes last.', 'SLA = measurable promises; internal (IT to business) or external (vendor to you).'], lab: 'c2-docs-wrap' }
  });

  // ===================== 4.2 Change management =====================
  M('c2-chgtype', 'Classify the change', 'Standard, normal or emergency',
    'Pick the change type.', ['Standard change', 'Normal change', 'Emergency change'],
    [['Adding a new user to an existing distribution group — pre-approved, low risk, done weekly', 'Standard change', 'Pre-approved and repeatable.'],
     ['Upgrading the firewall firmware next Saturday', 'Normal change', 'Goes to the change board.'],
     ['The mail server is down after a failed patch; roll it back now', 'Emergency change', 'Fix first, paperwork right after.'],
     ['Replacing the core switches during a planned maintenance window', 'Normal change', 'Planned, assessed, approved.'],
     ['Patching a zero-day being actively exploited, tonight', 'Emergency change', 'Expedited approval.'],
     ['Resetting a user\'s password via the documented process', 'Standard change', 'Routine.']],
    'Standard = pre-approved routine. Normal = full review. Emergency = urgent, approved fast, documented afterwards.');
  O('c2-chgflow', 'Run a normal change', 'Order the change process',
    'You will upgrade the file server OS. Put the change steps in order.',
    [['Fill in the change request form: purpose and scope', 'What and why.'],
     ['List affected systems and do a risk analysis (risk level)', 'Impact.'],
     ['Test in a sandbox and write the backup and rollback plans', 'Prove it before production.'],
     ['Name the responsible staff and pick a maintenance window outside any change freeze', 'Who and when.'],
     ['Change advisory board approves', 'Approval before work.'],
     ['Implement, with a peer reviewing the steps', 'Do it carefully.'],
     ['End users confirm the share works (end-user acceptance), then close the change', 'Done when users agree.']],
    'The paperwork is the safety net: it forces you to plan the undo before you need it.');
  M('c2-chg-wrap', 'What went wrong?', 'Combined 4.2 post-mortems',
    'Each change went badly. Pick the step that was skipped.', ['Sandbox testing', 'Rollback plan', 'Backup plan', 'Risk analysis / affected systems', 'Change board approval', 'Maintenance window', 'Peer review', 'End-user acceptance'],
    [['The new driver crashed every PC; it had only been tried on the tech\'s own laptop', 'Sandbox testing', 'Test in a representative environment.'],
     ['The upgrade failed and nobody knew how to get the old version back', 'Rollback plan', 'Plan the undo first.'],
     ['The migration corrupted data and there was no copy taken beforehand', 'Backup plan', 'Back up before you change.'],
     ['Changing the DNS server broke the VPN, which nobody knew depended on it', 'Risk analysis / affected systems', 'Check dependencies (CMDB).'],
     ['A tech rebooted the core switch on his own decision at 10 AM', 'Change board approval', 'Approval is required.'],
     ['The change ran during month-end close and stopped accounting', 'Maintenance window', 'Schedule around the business.'],
     ['A typo in an ACL went live because nobody else read the commands', 'Peer review', 'Second pair of eyes.'],
     ['IT closed the change but users could not open the new app', 'End-user acceptance', 'Users confirm it works.']],
    'Every element of change management exists because a change once went wrong without it.');

  RK.add({ track: TR, id: '4.2', dom: 4, moreLabs: ['c2-change-ps'], short: 'Change management', title: 'Given a scenario, apply change management procedures',
    goal: 'Request, assess, approve, implement and close a change — with a tested rollback plan.',
    kw: /\b(change (management|request|control|board|advisory)|\bcab\b|rollback|back.?out|sandbox|maintenance window|change freeze|risk (analysis|level)|scope of (the )?change|peer review|end.user acceptance|emergency change|standard change)/,
    parts: [
      RK.P('The change request', 'Fill in a change request: purpose, scope, type, timing, affected systems and risk.',
        `<p><b>Change management</b> makes changes predictable. Every change starts with a <b>request form</b>:</p>
<ul><li><b>Purpose of the change</b> — why (fix, security, new feature).</li>
<li><b>Scope of the change</b> — exactly what will and will not be touched.</li>
<li><b>Change type</b>:
<ul><li><b>Standard</b> — routine, low risk, pre-approved (password reset process).</li>
<li><b>Normal</b> — planned, needs review and approval.</li>
<li><b>Emergency</b> — must happen now to restore service or stop an attack; approved quickly, documented after.</li></ul></li>
<li><b>Date and time</b> — inside a <b>maintenance window</b>, and never during a <b>change freeze</b> (e.g. month-end or holidays).</li>
<li><b>Affected systems / impact</b> — what else depends on it (the CMDB helps).</li>
<li><b>Risk analysis</b> — a <b>risk level</b> (low/medium/high) from likelihood × impact.</li></ul>` + pro('Write scope in one sentence a manager can read. If you cannot, the change is too big — split it.') + trap('An emergency change still gets documented and reviewed; it just happens before the paperwork is finished.'),
        [['Which change type is pre-approved and routine?', 'Standard', ['Normal', 'Emergency', 'Major'], 'No board review needed each time.'],
         ['What is a change freeze?', 'A period when no non-emergency changes are allowed', ['A failed change', 'A rollback', 'A type of backup'], 'Protects busy business periods.']],
        'c2-chgtype'),
      RK.P('Approval, testing and implementation', 'Get a change approved and implement it with sandbox testing, backup and rollback plans, peer review and user acceptance.',
        `<p><b>Documented business processes</b> that must exist before work starts:</p>
<ul><li><b>Sandbox testing</b> — try the change in a safe copy of production first.</li>
<li><b>Backup plan</b> — take a backup of what you are changing.</li>
<li><b>Rollback plan</b> — the exact steps to undo the change if it fails.</li>
<li><b>Responsible staff members</b> — who does it, who approves, who is on call.</li></ul>
<p><b>Then:</b></p>
<ol><li><b>Change board approval</b> — a change advisory board (CAB) reviews risk and timing.</li>
<li><b>Implementation</b> — in the window, following the plan.</li>
<li><b>Peer review</b> — another tech checks the work (or the commands before they run).</li>
<li><b>End-user acceptance</b> — users confirm it works. Only then is the change closed.</li></ol>` + pro('Set a "go/no-go" time in the window: if the change is not working by then, you roll back. Deciding that in advance prevents 4 a.m. heroics.') + trap('Testing happens in a sandbox before approval and implementation, not in production afterwards.'),
        [['What describes how to undo a change that fails?', 'Rollback plan', ['Scope', 'Change freeze', 'Risk level'], 'Plan the undo first.'],
         ['When is a change complete?', 'After end users confirm it works', ['When the tech finishes typing', 'When the CAB approves it', 'When the request is submitted'], 'End-user acceptance closes it.']],
        'c2-chgflow')
    ],
    wrap: { recap: ['Request form: purpose, scope, type (standard, normal, emergency), date/time, affected systems, risk analysis.', 'Schedule in a maintenance window; never in a change freeze.', 'Before work: sandbox testing, backup plan, rollback plan, responsible staff.', 'Change board approves; implement; peer review; end-user acceptance closes it.', 'Emergency changes are approved fast and documented afterwards.'], lab: 'c2-chg-wrap' }
  });

  // ===================== 4.3 Backup & recovery =====================
  C('c2-bkcalc', 'Backup math', 'Full, incremental, differential',
    'A server has <b>500 GB</b>. A full backup runs Sunday night. About <b>20 GB</b> of different data changes each weekday (Mon–Fri), and no file changes twice.',
    [['Size of Wednesday night\'s INCREMENTAL backup (GB)', 20, '20', 'Only Wednesday\'s changes.'],
     ['Size of Wednesday night\'s DIFFERENTIAL backup (GB)', 60, '60', 'Mon + Tue + Wed since the last full.'],
     ['Thursday crash, incremental scheme: how many backup sets must be restored? (full + each incremental through Wednesday)', 4, '4', 'Full + Mon + Tue + Wed.'],
     ['Thursday crash, differential scheme: how many backup sets must be restored?', 2, '2', 'Full + Wednesday\'s differential.']],
    'Incremental = small, fast backups but long restores. Differential = growing backups but a two-step restore.',
    ['Incremental: since the last backup of any kind. Differential: since the last full.']);
  M('c2-restore', 'Restore it the right way', 'In-place vs alternative location, testing',
    'Pick the best recovery approach.', ['In-place (overwrite)', 'Alternative location', 'Test restore'],
    [['A corrupted spreadsheet must be replaced by last night\'s good copy', 'In-place (overwrite)', 'Put the good copy back where it belongs.'],
     ['User wants yesterday\'s version but also to keep today\'s edits', 'Alternative location', 'Restore beside it and let them compare.'],
     ['Ransomware hit the server; restore to a clean, rebuilt server', 'Alternative location', 'Never restore onto the infected system.'],
     ['Monthly check that the backups can actually be read back', 'Test restore', 'An untested backup is a hope.'],
     ['Restore a whole folder over the damaged one after a bad script ran', 'In-place (overwrite)', 'Overwrite the damage.']],
    'When in doubt, restore to an alternative location: you never destroy anything by doing so.');
  M('c2-321', 'Rotation and storage', '3-2-1, GFS, onsite vs offsite',
    'Pick the term for each statement.', ['3-2-1 rule', 'Grandfather-father-son (GFS)', 'Onsite backup', 'Offsite backup'],
    [['Three copies of data, on two kinds of media, one of them off-site', '3-2-1 rule', 'Survives most disasters.'],
     ['Daily backups kept a week, weekly kept a month, monthly kept a year', 'Grandfather-father-son (GFS)', 'Son, father, grandfather.'],
     ['Backup appliance in the server room: fastest to restore from', 'Onsite backup', 'Quick, but shares the building\'s risks.'],
     ['Cloud or another building: survives fire and flood', 'Offsite backup', 'Slower, but separate.'],
     ['Why ransomware often fails to destroy all backups at a well-run company', '3-2-1 rule', 'At least one copy is off-site/offline.']],
    'Onsite for speed, offsite for survival. 3-2-1 gives you both.');
  M('c2-bk-wrap', 'Design the backup plan', 'Combined 4.3',
    'A 40-person office needs a backup plan. Pick the best answer for each requirement.', ['Full backup', 'Incremental backup', 'Differential backup', 'Synthetic full', 'Alternative-location restore', 'Monthly test restore', '3-2-1 rule', 'GFS rotation'],
    [['Weekend job that copies everything', 'Full backup', 'The baseline.'],
     ['Nightly job that must finish fast on a slow link', 'Incremental backup', 'Smallest nightly set.'],
     ['Nightly job where restores must need only two sets', 'Differential backup', 'Full + latest differential.'],
     ['Build a new full on the backup server from the last full plus incrementals, without re-reading the source', 'Synthetic full', 'Saves source load and bandwidth.'],
     ['Recover after ransomware without touching the infected server', 'Alternative-location restore', 'Clean target.'],
     ['Prove the backups work', 'Monthly test restore', 'Frequency matters.'],
     ['Keep a copy that survives the building burning down', '3-2-1 rule', 'One copy offsite.'],
     ['Keep a year of monthly restore points without keeping every daily', 'GFS rotation', 'Tiered retention.']],
    'A backup plan is only as good as its last successful test restore.');

  RK.add({ track: TR, id: '4.3', dom: 4, moreLabs: ['c2-backup-ps'], short: 'Backup & recovery', title: 'Given a scenario, implement workstation backup and recovery methods',
    goal: 'Choose backup types, restore safely, test backups, and keep copies with GFS and the 3-2-1 rule.',
    kw: /\b(backup|incremental|differential|synthetic|full backup|restore|recovery|3.2.1|grandfather|\bgfs\b|off.?site|on.?site|rotation)/,
    parts: [
      RK.P('Backup types', 'Explain full, incremental, differential and synthetic full backups, and what each costs at restore time.',
        `<table><tr><th>Type</th><th>Copies</th><th>Backup</th><th>Restore needs</th></tr>
<tr><td><b>Full</b></td><td>Everything</td><td>Slowest, biggest</td><td>Just the full</td></tr>
<tr><td><b>Incremental</b></td><td>Changes since the <b>last backup of any kind</b></td><td>Fastest, smallest</td><td>Last full + <b>every</b> incremental since</td></tr>
<tr><td><b>Differential</b></td><td>Changes since the <b>last full</b></td><td>Grows each day</td><td>Last full + <b>latest</b> differential</td></tr>
<tr><td><b>Synthetic full</b></td><td>A new full built on the backup server from the last full + incrementals</td><td>No load on the source</td><td>Like a full</td></tr></table>
<p>Typical plan: full on the weekend, incremental or differential nightly.</p>` + pro('Backups run when users are gone. If the nightly job is still running at 8 AM, switch to incrementals or synthetic fulls.') + trap('Incremental restores need every incremental since the full, in order. Lose one and the chain breaks.'),
        [['Which backup copies only data changed since the last full backup?', 'Differential', ['Incremental', 'Synthetic full', 'Full'], 'Differential grows until the next full.'],
         ['Which scheme has the fastest nightly backups but the most sets to restore?', 'Incremental', ['Differential', 'Full every night', 'Synthetic full'], 'Each night is small; restores need them all.']],
        'c2-bkcalc'),
      RK.P('Recovery and testing', 'Restore in place or to an alternative location, and test backups on a schedule.',
        `<ul><li><b>In-place / overwrite</b> — restore over the original. Fast and simple; destroys whatever is there now.</li>
<li><b>Alternative location</b> — restore to a different folder or server. Safe: nothing is overwritten. Use it when the user wants to compare versions, or after ransomware (restore onto a clean system).</li></ul>
<p><b>Backup testing</b>:</p>
<ul><li>A backup that has never been restored is unproven. Test-restore a few files <b>monthly</b> and a full system at least <b>yearly</b> (or per policy).</li>
<li>Check the backup job reports every day: a job "completed with warnings" may have skipped the files that matter.</li>
<li>Time the restore. If it takes 14 hours and the business can only be down for 4, the plan has failed already.</li></ul>` + pro('After any restore, have the user open the files. "Restored" and "usable" are not the same thing.') + trap('Backup testing frequency is part of the objective: the answer is regular, scheduled tests, not "after a disaster".'),
        [['A user wants yesterday\'s version of a document but must keep today\'s edits. How do you restore?', 'To an alternative location', ['In-place overwrite', 'Full system restore', 'Delete and recreate'], 'Restoring beside it keeps both.'],
         ['Why test restores regularly?', 'To prove the backups can actually be recovered', ['To make backups faster', 'To free disk space', 'To change the rotation'], 'Untested backups often fail.']],
        'c2-restore'),
      RK.P('Rotation: onsite, offsite, GFS and 3-2-1', 'Plan backup rotation with onsite/offsite copies, GFS and the 3-2-1 rule.',
        `<ul><li><b>Onsite</b> — in the building. Fast restores; lost with the building (fire, flood, theft, ransomware on the same network).</li>
<li><b>Offsite</b> — cloud or another location. Survives a site disaster; slower to restore.</li>
<li><b>Grandfather-father-son (GFS)</b> — keep <i>sons</i> (daily, ~1 week), <i>fathers</i> (weekly, ~1 month), <i>grandfathers</i> (monthly, ~1 year). Long history without keeping every daily.</li>
<li><b>3-2-1 rule</b> — <b>3</b> copies of the data, on <b>2</b> different media types, <b>1</b> offsite. Many add "1 offline/immutable" against ransomware.</li></ul>` + pro('Make at least one backup copy immutable or offline. Ransomware operators look for backup servers first.') + trap('3-2-1 counts copies of the data, including the live copy — not three backup jobs.'),
        [['What does the "1" in the 3-2-1 rule mean?', 'One copy is kept offsite', ['One backup per day', 'One media type', 'One restore test'], 'Survives a site disaster.'],
         ['In GFS, which backups are the "grandfathers"?', 'Monthly backups', ['Daily backups', 'Weekly backups', 'Incremental backups'], 'Son = daily, father = weekly, grandfather = monthly.']],
        'c2-321')
    ],
    wrap: { recap: ['Full = everything. Incremental = since last backup. Differential = since last full. Synthetic full = built on the backup server.', 'Incremental restore = full + every incremental. Differential restore = full + latest differential.', 'In-place overwrites; alternative location keeps both and suits ransomware recovery.', 'Test restores on a schedule (monthly files, yearly full system).', 'Onsite = fast; offsite = survives disasters. GFS = daily/weekly/monthly retention.', '3-2-1: three copies, two media, one offsite.'], lab: 'c2-bk-wrap' }
  });

  // ===================== 4.4 Safety =====================
  M('c2-esd', 'Protect the equipment', 'ESD and handling',
    'Pick the control for each risk.', ['ESD strap', 'ESD mat', 'Antistatic bag', 'Equipment grounding', 'Proper component handling', 'Cable management', 'Government regulations'],
    [['You are about to touch RAM modules on a carpeted floor', 'ESD strap', 'Wrist strap clipped to the case/ground.'],
     ['A safe surface to lay the motherboard on while you work', 'ESD mat', 'Grounded work surface.'],
     ['Storing a spare SSD on the shelf', 'Antistatic bag', 'Shields components from static.'],
     ['A metal rack must be bonded so a fault cannot make it live', 'Equipment grounding', 'Electrical safety.'],
     ['Hold a card by its edges, never the gold contacts or chips', 'Proper component handling', 'Avoid static and oils.'],
     ['Loose cables across the floor of the server room', 'Cable management', 'Trip hazard and airflow.'],
     ['OSHA-style workplace safety rules your company must follow', 'Government regulations', 'Compliance.']],
    'ESD damage is often invisible and can show up weeks later as random faults.');
  M('c2-personal', 'Protect yourself', 'Personal safety',
    'Pick the precaution for each task.', ['Disconnect power first', 'Proper lifting technique', 'Class C fire extinguisher', 'Safety goggles', 'Air filter mask'],
    [['Replacing a desktop power supply', 'Disconnect power first', 'Unplug, then hold the power button to drain.'],
     ['Moving a 25 kg UPS from the floor to a rack', 'Proper lifting technique', 'Bend the knees, straight back, get help.'],
     ['A PSU catches fire on the bench', 'Class C fire extinguisher', 'Electrical fires (CO₂).'],
     ['Cutting cable ties or using compressed air near your face', 'Safety goggles', 'Eye protection.'],
     ['Cleaning out a printer full of toner dust', 'Air filter mask', 'Toner particles are fine and harmful.']],
    'Never open a power supply or a CRT. They hold a dangerous charge even when unplugged.');
  O('c2-safety-wrap', 'Open the case safely', 'Combined 4.4',
    'You must replace RAM in a desktop. Put the safety steps in order.',
    [['Shut down Windows and unplug the power cord', 'Disconnect power.'],
     ['Hold the power button a few seconds to drain remaining charge', 'Residual power.'],
     ['Put on the ESD strap and clip it to bare metal on the case', 'Equalize static.'],
     ['Lay the PC on an ESD mat at a comfortable height, lifting properly', 'Work surface and back.'],
     ['Take the new RAM out of its antistatic bag, holding it by the edges', 'Handling.'],
     ['Install, close the case, tidy cables, then reconnect power', 'Cable management, then power last.']],
    'Power off before you touch; ground yourself before you handle; power on last.');

  RK.add({ track: TR, id: '4.4', dom: 4, short: 'Safety procedures', title: 'Given a scenario, use common safety procedures',
    goal: 'Protect equipment from static and yourself from electricity, lifting injuries, fire and dust.',
    kw: /\b(esd|electrostatic|static|wrist strap|antistatic|ground(ing|ed)|lift(ing)?|fire (safety|extinguisher)|class c|goggles|mask|safety|shock|cable management)/,
    parts: [
      RK.P('Protecting equipment: ESD and handling', 'Use ESD straps, mats and bags, grounding and proper handling to protect components.',
        `<p><b>Electrostatic discharge (ESD)</b> — the spark you feel from a doorknob is thousands of volts. Far less can damage a chip, often without any visible sign.</p>
<ul><li><b>ESD strap</b> — wrist strap clipped to the PC's bare metal frame or a ground point, so you and the PC are at the same potential.</li>
<li><b>ESD mat</b> — a grounded work surface for parts.</li>
<li><b>Antistatic bags</b> — store and move components in them (the shiny shielded ones).</li>
<li><b>Proper component handling and storage</b> — hold boards by the edges; never touch contacts or chips; store in bags, in a dry place.</li>
<li><b>Equipment grounding</b> — racks and cases bonded to earth so an electrical fault cannot make the metal live.</li>
<li><b>Cable management</b> — no trip hazards, no cables blocking airflow.</li>
<li><b>Compliance with government regulations</b> — workplace safety laws (e.g. OSHA in the US) apply to IT work too.</li></ul>` + pro('No strap? Touch bare metal on the case often and keep one hand on it. It is not as good, but far better than nothing.') + trap('An ESD strap is never worn while working inside a CRT or power supply: you would be the path to ground.'),
        [['What equalizes static between you and the computer while you work?', 'An ESD wrist strap', ['Safety goggles', 'A surge suppressor', 'An air filter mask'], 'Clip it to the case frame.'],
         ['How should a spare memory module be stored?', 'In an antistatic bag', ['In a plastic sandwich bag', 'Loose in a drawer', 'Wrapped in paper'], 'Shielded bags block static.']],
        'c2-esd'),
      RK.P('Personal safety', 'Work safely: power off, lift correctly, handle fires, and protect eyes and lungs.',
        `<ul><li><b>Disconnect power before repairing a PC</b> — unplug it, then press the power button to drain stored charge. Remove laptop batteries where possible.</li>
<li><b>Lifting techniques</b> — bend at the knees, keep the back straight, hold the load close, do not twist. Get help or a cart for anything heavy (UPSs, servers, printers).</li>
<li><b>Fire safety</b> — electrical fires need a <b>Class C</b> (CO₂ or clean-agent) extinguisher. Never water. Know the exits and the extinguisher location.</li>
<li><b>Safety goggles</b> — when cutting, using compressed air, or around batteries and chemicals.</li>
<li><b>Air filter mask</b> — when cleaning toner, dust or debris.</li></ul>
<p>If someone is being shocked: do not touch them. Cut the power first, then call for help.</p>` + pro('Two-person lifts for anything above about 20 kg. Back injuries end careers in field service.') + trap('Power supplies and CRT monitors hold dangerous charge even when unplugged. The exam answer is "replace, do not open".'),
        [['Which extinguisher is used on an electrical fire?', 'Class C (CO₂)', ['Class A (water)', 'Class K', 'Class B foam only'], 'Non-conductive agent.'],
         ['What is the correct lifting technique?', 'Bend the knees and keep the back straight', ['Bend at the waist', 'Twist while lifting', 'Lift with the arms straight out'], 'Legs do the work.']],
        'c2-personal')
    ],
    wrap: { recap: ['ESD strap clipped to bare metal; ESD mat; antistatic bags for storage.', 'Hold components by the edges; ground equipment; manage cables.', 'Follow government safety regulations.', 'Unplug and drain power before working inside a PC; never open a PSU or CRT.', 'Lift with the legs; Class C extinguisher for electrical fires; goggles and air filter masks.'], lab: 'c2-safety-wrap' }
  });

  // ===================== 4.5 Environmental impacts =====================
  M('c2-dispose', 'Dispose of it properly', 'SDS, batteries, toner, devices',
    'Pick the right handling for each item.', ['Check the SDS', 'Battery recycling', 'Toner return/recycling program', 'Certified e-waste recycler'],
    [['A tech spilled toner and wants to know if it is hazardous to clean up', 'Check the SDS', 'Safety data sheet.'],
     ['A swollen lithium-ion laptop battery', 'Battery recycling', 'Never in the trash; it can catch fire.'],
     ['Empty laser toner cartridges', 'Toner return/recycling program', 'Many vendors take them back.'],
     ['Thirty retired monitors and PCs (after data wiping)', 'Certified e-waste recycler', 'Follow local regulations.'],
     ['Which cleaning chemical needs gloves and ventilation', 'Check the SDS', 'Handling and PPE details.']],
    'If it has a battery, toner, ink or a circuit board, it does not go in the trash.');
  M('c2-power-env', 'Keep the room and power healthy', 'Climate, dust and power problems',
    'Pick the best fix or control.', ['UPS', 'Surge suppressor', 'Control temperature / ventilation', 'Control humidity', 'Move the equipment', 'Compressed air / ESD-safe vacuum'],
    [['Equipment must keep running through a 5-minute outage and shut down cleanly', 'UPS', 'Battery backup.'],
     ['Lightning spikes keep killing PCs at a branch office', 'Surge suppressor', 'Clamps spikes (no outage protection).'],
     ['Brownouts make PCs reboot several times a day', 'UPS', 'Line conditioning + battery.'],
     ['A closet hits 35 °C every afternoon', 'Control temperature / ventilation', 'Cooling and airflow.'],
     ['Static shocks every winter in the server room', 'Control humidity', 'Keep around 40–60%.'],
     ['A PC sits under a desk next to a space heater and a dusty floor', 'Move the equipment', 'Placement matters.'],
     ['Fans clogged with dust in a workshop PC', 'Compressed air / ESD-safe vacuum', 'Clean outdoors or with a vacuum to catch dust.']],
    'Surge = spike. Brownout = sag. Blackout = total loss. Only a UPS handles all three.');
  M('c2-env-wrap', 'Environmental walk-through', 'Combined 4.5',
    'Pick the best answer for each finding.', ['SDS', 'Battery recycling', 'Toner recycling', 'UPS', 'Surge suppressor', 'Humidity control', 'Ventilation', 'Dust cleanup'],
    [['Where to find first aid steps after toner contacts skin', 'SDS', 'Safety data sheet.'],
     ['Box of old UPS batteries in the storeroom', 'Battery recycling', 'Lead-acid and lithium are regulated.'],
     ['Cartridges piling up next to the printer', 'Toner recycling', 'Vendor programs.'],
     ['Brief blackouts corrupt files on the file server', 'UPS', 'Ride-through and clean shutdown.'],
     ['Desk PCs plugged straight into the wall in a storm-prone area', 'Surge suppressor', 'Spike protection.'],
     ['Condensation inside a basement network cabinet', 'Humidity control', 'Too humid.'],
     ['Rack equipment pressed against a wall with no airflow', 'Ventilation', 'Clearance for intake/exhaust.'],
     ['Heat sinks caked in dust on factory-floor PCs', 'Dust cleanup', 'Scheduled cleaning.']],
    'Most "random hardware failures" in harsh locations are environmental.');

  RK.add({ track: TR, id: '4.5', dom: 4, short: 'Environmental impacts & controls', title: 'Summarize environmental impacts and local environment controls',
    goal: 'Handle and dispose of hazardous materials properly and protect equipment from heat, humidity, dust and power problems.',
    kw: /\b(msds|\bsds\b|safety data sheet|dispos|recycl|toner|battery|batteries|temperature|humidity|ventilation|dust|compressed air|vacuum|surge|brownout|blackout|\bups\b|power (problem|outage))/,
    parts: [
      RK.P('Hazardous materials and disposal', 'Use SDS documentation and dispose of batteries, toner and devices properly.',
        `<p>A <b>safety data sheet (SDS)</b>, formerly MSDS, comes with every chemical product (toner, cleaning solvents, batteries, thermal paste). It lists hazards, safe handling, protective equipment, first aid, spill cleanup and <b>disposal</b>. Find it on the vendor's website.</p>
<ul><li><b>Proper battery disposal</b> — lithium-ion, NiMH and lead-acid (UPS) batteries go to recycling, never the trash. Swollen lithium batteries are a fire risk: store them in a fireproof container until collected.</li>
<li><b>Proper toner disposal</b> — return or recycle cartridges. Clean spills with a toner vacuum or damp cloth; a normal vacuum can melt toner or spread it.</li>
<li><b>Other devices and assets</b> — monitors, PCs, phones contain heavy metals: use a certified e-waste recycler and follow local regulations. Wipe data first (objective 2.9).</li></ul>` + pro('Keep a labelled bin for dead batteries in every IT room. If disposal is easy, people do it.') + trap('The document is the SDS (or MSDS). It is the answer whenever the question asks about a chemical\'s hazards or disposal.'),
        [['Which document describes how to handle and dispose of a toner cartridge safely?', 'Safety data sheet (SDS)', ['End-user license agreement', 'Acceptable use policy', 'Service-level agreement'], 'SDS covers chemical hazards.'],
         ['How should a swollen lithium-ion battery be handled?', 'Store it safely and send it to battery recycling', ['Throw it in the trash', 'Puncture it to release pressure', 'Keep using it carefully'], 'It is a fire hazard.']],
        'c2-dispose'),
      RK.P('Climate, dust and power', 'Protect equipment from temperature, humidity, dust and power surges, brownouts and blackouts.',
        `<ul><li><b>Temperature and ventilation</b> — hot equipment fails early. Keep air flowing, leave clearance around vents and racks.</li>
<li><b>Humidity-level awareness</b> — too dry → static; too humid → condensation and corrosion. Aim for about 40–60%.</li>
<li><b>Location / equipment placement</b> — away from heaters, windows, water pipes, floors that get mopped, and dusty areas.</li>
<li><b>Dust cleanup</b> — compressed air (outdoors, short bursts, hold fans still) or an <b>ESD-safe vacuum</b>.</li></ul>
<table><tr><th>Power problem</th><th>Is</th><th>Protection</th></tr>
<tr><td><b>Surge</b></td><td>Short voltage spike</td><td>Surge suppressor</td></tr>
<tr><td><b>Brownout</b></td><td>Voltage sag</td><td>UPS (line conditioning)</td></tr>
<tr><td><b>Blackout</b></td><td>Total loss</td><td>UPS (battery), generator for long outages</td></tr></table>` + pro('Plug the UPS\'s USB/network cable into the server and configure automatic shutdown. A UPS that just runs flat helps nobody.') + trap('A surge suppressor does nothing during a blackout. Only a UPS keeps equipment running.'),
        [['Which device keeps a PC running through a short power outage?', 'UPS', ['Surge suppressor', 'Power strip', 'PDU'], 'Battery backup.'],
         ['What problem does very high humidity cause?', 'Condensation and corrosion', ['Static discharge', 'Brownouts', 'Faster fans'], 'Too wet.']],
        'c2-power-env')
    ],
    wrap: { recap: ['SDS/MSDS: hazards, handling, first aid and disposal for chemicals and batteries.', 'Recycle batteries, toner and e-waste; never the trash.', 'Control temperature and ventilation; keep humidity about 40–60%.', 'Place equipment away from heat, water and dust; clean with compressed air or an ESD-safe vacuum.', 'Surge → surge suppressor. Brownout and blackout → UPS.'], lab: 'c2-env-wrap' }
  });
})();
