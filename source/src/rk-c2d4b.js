/* A+ Core 2 (220-1202) — Domain 4.0 Operational Procedures — objectives 4.6 to 4.10 + domain wrap lab */
(function () {
  var RK = window.RK, P = RK.P, M = RK.M, O = RK.O, T = RK.T, TR = 'core2';
  function pro(t) { return '<div class="callout pro"><b class="k">On the job</b>' + t + '</div>'; }
  function trap(t) { return '<div class="callout trap"><b class="k">Exam trap</b>' + t + '</div>'; }

  // ===================== 4.6 Prohibited content, privacy, licensing =====================
  O('c2-ir-order', 'You found prohibited content', 'Incident response steps',
    'While repairing a laptop you see what looks like illegal content. Put your actions in order.',
    [['Stop working on the device and do not browse further', 'Do not alter evidence.'],
     ['Inform management (and follow policy on law enforcement)', 'Escalate; you are not the investigator.'],
     ['Secure the device; start a chain-of-custody record', 'Who had it, when, and why.'],
     ['Preserve data: a forensic copy of the drive is made by the authorized team', 'Data integrity — work on the copy.'],
     ['Collect volatile data first if instructed (RAM before disk)', 'Order of volatility.'],
     ['Document everything you saw and did, with times', 'Incident documentation.']],
    'Your job is to stop, report and preserve — never to investigate or delete.');
  M('c2-license', 'Which license or agreement?', 'EULA, DRM, licenses, NDA',
    'Pick the license or agreement for each case.', ['EULA', 'DRM', 'Perpetual license', 'Subscription / corporate-use license', 'Personal-use license', 'Open-source license', 'NDA', 'Mutual NDA'],
    [['The terms you accept when installing software', 'EULA', 'End-user license agreement.'],
     ['Technology that stops a purchased e-book being copied', 'DRM', 'Digital rights management.'],
     ['Buy once, use that version forever', 'Perpetual license', 'No renewal needed for that version.'],
     ['Company pays per seat per year to use the office suite at work', 'Subscription / corporate-use license', 'Business use, counted seats.'],
     ['Free "home" edition that forbids commercial use', 'Personal-use license', 'Using it at work breaks the terms.'],
     ['Source code you may read, change and share under the license terms', 'Open-source license', 'e.g. GPL, MIT.'],
     ['A contractor promises not to disclose the client\'s data', 'NDA', 'One-way non-disclosure.'],
     ['Two companies exploring a merger both agree to keep each other\'s information secret', 'Mutual NDA', 'Two-way.']],
    'Installing personal-use software on company PCs is a licensing violation the company pays for in an audit.');
  M('c2-regdata', 'Regulated data and policy', 'PII, PCI, healthcare, AUP, retention',
    'Pick the category for each item.', ['Credit card payment information', 'Government-issued information', 'PII', 'Healthcare data', 'Data retention requirement', 'Acceptable use policy (AUP)', 'Splash screen'],
    [['Card numbers stored by the online shop', 'Credit card payment information', 'PCI DSS applies.'],
     ['Passport and driver\'s license scans in HR files', 'Government-issued information', 'High-value identity data.'],
     ['Name + home address + date of birth', 'PII', 'Personally identifiable information.'],
     ['Patient diagnoses at a clinic', 'Healthcare data', 'HIPAA in the US.'],
     ['Financial records must be kept for seven years, then destroyed', 'Data retention requirement', 'Keep for the required time — no longer.'],
     ['Rules on what staff may do with company PCs and Internet', 'Acceptable use policy (AUP)', 'Signed by users.'],
     ['Warning banner at sign-in: "Authorized use only; activity is monitored"', 'Splash screen', 'Legal notice before access.']],
    'Regulated data is protected by law; the AUP and splash screen tell users the rules before they start.');
  M('c2-priv-wrap', 'Policy desk', 'Combined 4.6',
    'Pick the best answer for each situation.', ['Chain of custody', 'Order of volatility', 'Inform management', 'Valid license', 'Open-source license', 'Mutual NDA', 'PII', 'Data retention', 'AUP', 'Splash screen'],
    [['Record every person who handled the seized laptop', 'Chain of custody', 'Admissible evidence.'],
     ['Capture RAM before shutting down the PC', 'Order of volatility', 'Most volatile first.'],
     ['A tech finds prohibited content on a user\'s PC', 'Inform management', 'Escalate per policy.'],
     ['Audit finds 30 installs but only 20 seats purchased', 'Valid license', 'Buy seats or remove installs.'],
     ['The team wants to modify a tool\'s source and ship it internally', 'Open-source license', 'Check its terms.'],
     ['Both partners must keep each other\'s plans secret', 'Mutual NDA', 'Two-way.'],
     ['A spreadsheet of names with Social Security numbers', 'PII', 'Protect and minimize.'],
     ['Old emails must be deleted after the legally required period', 'Data retention', 'Policy-driven deletion.'],
     ['A user is warned for running a personal business on the company laptop', 'AUP', 'Acceptable use.'],
     ['Legal notice displayed before anyone can log in', 'Splash screen', 'Sets expectations.']],
    'Your role with prohibited content and regulated data: follow policy, protect, escalate, document.');

  RK.add({ track: TR, id: '4.6', dom: 4, short: 'Prohibited content, privacy & licensing', title: 'Explain the importance of prohibited content/activity and privacy, licensing, and policy concepts',
    goal: 'Respond correctly to prohibited content, respect licenses and agreements, and protect regulated data.',
    kw: /\b(prohibited|chain of custody|order of volatility|incident response|law enforcement|licens|\beula\b|\bdrm\b|open.source|\bnda\b|non.disclosure|\bpii\b|personally identifiable|pci|healthcare|hipaa|retention|acceptable use|\baup\b|splash screen|regulat)/,
    parts: [
      RK.P('Incident response to prohibited content', 'Respond to prohibited content with chain of custody, escalation, a drive copy and documentation.',
        `<p>If you find prohibited or illegal content or activity, you are <b>first response</b>, not the investigator:</p>
<ul><li><b>Inform management</b> (and law enforcement as necessary, per company policy and law).</li>
<li><b>Chain of custody</b> — a written record of everyone who has had the evidence, when and why. A gap can make evidence useless in court.</li>
<li><b>Copy of drive (data integrity and preservation)</b> — investigators work on a forensic copy, verified with a hash, never on the original.</li>
<li><b>Order of volatility</b> — collect the most short-lived data first: CPU cache/RAM → running processes and network connections → disk → logs → backups.</li>
<li><b>Incident documentation</b> — what you saw, what you did, timestamps.</li></ul>` + pro('Do not power off, delete, or "check one more folder". Stop, step back, and call your manager.') + trap('Order of volatility puts RAM before the hard drive: shutting the PC down destroys what was in memory.'),
        [['What records everyone who handled a piece of evidence?', 'Chain of custody', ['Order of volatility', 'EULA', 'Incident ticket category'], 'Unbroken custody record.'],
         ['According to order of volatility, which is collected first?', 'RAM contents', ['Hard drive image', 'Backup tapes', 'Printed logs'], 'Most volatile first.']],
        'c2-ir-order'),
      RK.P('Licensing, DRM, EULA and NDAs', 'Tell perpetual, personal, corporate and open-source licenses apart, and explain EULA, DRM and NDAs.',
        `<ul><li><b>Valid licenses</b> — every install needs one; audits compare installs to purchases.</li>
<li><b>Perpetual license agreement</b> — pay once, use that version indefinitely (updates may cost extra).</li>
<li><b>Personal-use vs corporate-use</b> — "free for personal use" software is <i>not</i> licensed for business. Corporate licenses are usually per user/device, often subscriptions.</li>
<li><b>Open-source license</b> — source is available to use, modify and share, under conditions (GPL requires sharing changes; MIT is permissive).</li>
<li><b>EULA</b> (end-user license agreement) — the terms you accept on install.</li>
<li><b>DRM</b> (digital rights management) — technology that enforces copying/usage limits on media and software.</li>
<li><b>NDA</b> — you agree not to disclose confidential information. <b>Mutual NDA</b> — both parties agree.</li></ul>` + pro('Keep proof of purchase and license keys in the asset system. "We bought it years ago" does not pass an audit.') + trap('Open source does not mean "no rules". The license still sets conditions.'),
        [['A user installs a "free for personal use" tool on a company PC. What is the issue?', 'It violates the license terms for business use', ['It needs a perpetual license key', 'It is protected by DRM', 'It requires an NDA'], 'Personal-use licenses exclude business use.'],
         ['Which agreement do you accept when installing software?', 'EULA', ['NDA', 'SLA', 'AUP'], 'End-user license agreement.']],
        'c2-license'),
      RK.P('Regulated data and policies', 'Identify regulated data types, retention requirements, AUPs and splash screens.',
        `<p><b>Regulated data</b> — protected by law or industry rules:</p>
<ul><li><b>Credit card payment information</b> — PCI DSS.</li>
<li><b>Personal government-issued information</b> — passport, driver\'s license, Social Security numbers.</li>
<li><b>PII</b> (personally identifiable information) — anything that identifies a person.</li>
<li><b>Healthcare data</b> — HIPAA in the US.</li>
<li><b>Data retention requirements</b> — keep certain records for a set time, then dispose of them securely.</li></ul>
<ul><li><b>Acceptable use policy (AUP)</b> — what users may and may not do with company systems; users sign it.</li>
<li><b>Regulatory and business compliance requirements</b> — the laws and contracts the company must meet; IT controls often exist because of them.</li>
<li><b>Splash screens</b> — a sign-in banner stating that use is monitored and authorized users only, so users cannot claim they were not told.</li></ul>` + pro('Never copy regulated data to a USB stick or personal email to "work on it from home". That single act can be a reportable breach.') + trap('Retention cuts both ways: keeping data longer than required is also a compliance problem.'),
        [['Which document do employees sign that defines permitted use of company IT?', 'Acceptable use policy', ['EULA', 'Mutual NDA', 'SDS'], 'AUP.'],
         ['A banner at login warns that the system is monitored. What is it called?', 'Splash screen', ['Order of volatility', 'DRM', 'Chain of custody'], 'Legal notice before access.']],
        'c2-regdata')
    ],
    wrap: { recap: ['Prohibited content: stop, inform management/law enforcement per policy, preserve.', 'Chain of custody; forensic copy of the drive; order of volatility (RAM first); document everything.', 'Valid licenses; perpetual vs subscription; personal vs corporate use; open source has conditions.', 'EULA = install terms. DRM = copy protection. NDA one-way; mutual NDA two-way.', 'Regulated data: card data, government IDs, PII, healthcare; retention requirements.', 'AUP sets user rules; splash screen warns before login.'], lab: 'c2-priv-wrap' }
  });

  // ===================== 4.7 Communication & professionalism =====================
  M('c2-pro-do', 'Professional or not?', 'Pick the professional response',
    'Pick the best behaviour for each situation.', ['Explain without jargon', 'Listen without interrupting', 'Call ahead if late', 'Ignore your phone', 'Use their title', 'Dress for the environment', 'Stay positive and confident'],
    [['A manager asks why the server was down; you are about to say "DNS TTL and a stale A record"', 'Explain without jargon', 'Plain words.'],
     ['The user is describing the problem and you already think you know the answer', 'Listen without interrupting', 'You may be wrong; they feel heard.'],
     ['Traffic means you will be 20 minutes late for an onsite appointment', 'Call ahead if late', 'Respect their time.'],
     ['Your phone buzzes with a text during a customer visit', 'Ignore your phone', 'Avoid distractions.'],
     ['Visiting a law office where staff address each other formally', 'Use their title', 'Cultural sensitivity and titles.'],
     ['Onsite at a bank where everyone wears business attire', 'Dress for the environment', 'Match the setting.'],
     ['You are unsure of the fix but the customer is anxious', 'Stay positive and confident', 'Project confidence; then find the answer.']],
    'Customers judge your competence by your communication before they see your fix.');
  O('c2-callflow', 'Handle a difficult call', 'Order the conversation',
    'An angry user calls: the third laptop failure this month, and a presentation in an hour. Put your approach in order.',
    [['Let them finish without interrupting, then acknowledge the frustration', 'Do not argue or be defensive.'],
     ['Restate the problem and ask open-ended questions to clarify', '"Tell me what happens when…"'],
     ['Set expectations: what you can do in the next hour and what will take longer', 'Timeline.'],
     ['Offer options: loaner laptop now, repair or replacement afterwards', 'Repair/replacement options.'],
     ['Give status updates while you work', 'Communicate status.'],
     ['Document the call and the outcome in the ticket', 'Proper documentation.'],
     ['Follow up after the presentation to confirm they are satisfied', 'Verify satisfaction.']],
    'Listen → clarify → set expectations → options → updates → document → follow up.');
  M('c2-comm-wrap', 'Professionalism review', 'Combined 4.7',
    'Pick the professional response.', ['Ask open-ended questions', 'Do not be judgmental', 'Do not dismiss the problem', 'Keep confidential materials private', 'Avoid social media about customers', 'Set a timeline and meet it', 'Provide documentation'],
    [['You need more detail about an intermittent error', 'Ask open-ended questions', '"What were you doing when…"'],
     ['The user clearly clicked a phishing link', 'Do not be judgmental', 'Fix it, then educate kindly.'],
     ['The issue seems minor to you but blocks the user\'s work', 'Do not dismiss the problem', 'Their impact is real.'],
     ['Payroll printouts are on the desk you are working at', 'Keep confidential materials private', 'Do not read, copy or move them unnecessarily.'],
     ['A funny story about a customer\'s messy office', 'Avoid social media about customers', 'Discretion and professionalism.'],
     ['A repair needs a part arriving Thursday', 'Set a timeline and meet it', 'Communicate status.'],
     ['The user should know how to avoid the problem next time', 'Provide documentation', 'Leave written steps.']],
    'Professionalism is consistent behaviour: respectful, discreet, clear, and reliable.');

  RK.add({ track: TR, id: '4.7', dom: 4, short: 'Communication & professionalism', title: 'Given a scenario, use proper communication techniques and professionalism',
    goal: 'Communicate clearly and respectfully, handle difficult customers, set expectations and protect confidential material.',
    kw: /\b(customer|jargon|listen|interrupt|professional|attire|appearance|on time|late|distraction|difficult|argue|defensive|judgmental|open.ended|expectation|follow up|confidential|culturally|polite|courteous)/,
    parts: [
      RK.P('Professional behaviour', 'Dress, speak, listen and act professionally with users.',
        `<ul><li><b>Professional appearance and attire</b> — match the environment: <i>formal</i> (bank, law firm) or <i>business casual</i>.</li>
<li><b>Use proper language</b> — avoid jargon, acronyms and slang. Explain in the user\'s terms.</li>
<li><b>Maintain a positive attitude / project confidence</b> — even when you do not know yet: "Let me find out."</li>
<li><b>Actively listen</b>, take notes, and <b>avoid interrupting</b>.</li>
<li><b>Be culturally sensitive</b> — use appropriate professional titles where the culture expects them.</li>
<li><b>Be on time</b> — if you will be late, contact the customer.</li>
<li><b>Avoid distractions</b> — personal calls, texting/social media, personal interruptions.</li></ul>` + pro('Repeat the user\'s problem back in one sentence before you start. It proves you listened and catches misunderstandings early.') + trap('"Avoid jargon" includes acronyms: "your DHCP lease expired" is jargon to most users.'),
        [['What should you do if you will be late to an onsite appointment?', 'Contact the customer before the scheduled time', ['Arrive late without comment', 'Reschedule by email next week', 'Send another tech without telling them'], 'Respect their time.'],
         ['Which is an example of active listening?', 'Letting the user finish, then restating the problem', ['Typing a fix while they talk', 'Finishing their sentences', 'Checking your phone while they speak'], 'Listen, then confirm.']],
        'c2-pro-do'),
      RK.P('Difficult customers, expectations and confidentiality', 'De-escalate difficult customers, set and meet expectations, and handle confidential material.',
        `<p><b>Dealing with difficult customers or situations:</b></p>
<ul><li>Do not argue or be defensive. Do not dismiss the problem. Do not be judgmental.</li>
<li>Clarify with <b>open-ended questions</b> and <b>restate</b> the issue to show understanding.</li>
<li>Use discretion and professionalism — including on social media.</li></ul>
<p><b>Set and meet expectations/timeline and communicate status:</b></p>
<ul><li>Offer <b>repair or replacement options</b> where they exist.</li>
<li>Provide proper <b>documentation</b> of what was done.</li>
<li><b>Follow up</b> with the customer to verify satisfaction.</li></ul>
<p><b>Confidential and private materials</b> — documents, screens, email, files on a PC you repair: do not read, copy, discuss or remove them. Lock screens and printouts are not your business.</p>` + pro('Under-promise and over-deliver: "by end of day" and done at 2 PM beats "in an hour" and done at 3.') + trap('With an angry customer, the exam answer is never to argue, defend yourself or blame the user — even when they are wrong.'),
        [['A user is shouting about repeated failures. What should you do first?', 'Listen without arguing and acknowledge the frustration', ['Explain it is their fault', 'Hang up and call back later', 'Transfer them immediately'], 'De-escalate first.'],
         ['What do you do after a repair to confirm success?', 'Follow up with the customer to verify satisfaction', ['Close the ticket silently', 'Post about it on social media', 'Ask a coworker'], 'Verify satisfaction.']],
        'c2-callflow')
    ],
    wrap: { recap: ['Dress for the environment; use plain language, no jargon or slang.', 'Positive attitude, active listening, no interrupting; culturally appropriate titles.', 'Be on time (call if late); avoid personal distractions.', 'Difficult customers: do not argue, dismiss or judge; open-ended questions; restate.', 'Set expectations, give status, offer options, document, follow up.', 'Never read, share or remove confidential materials.'], lab: 'c2-comm-wrap' }
  });

  // ===================== 4.8 Scripting =====================
  M('c2-scripttypes', 'Which script type?', '.bat, .ps1, .vbs, .sh, .js, .py',
    'Pick the script file type.', ['.bat', '.ps1', '.vbs', '.sh', '.js', '.py'],
    [['Windows batch file of cmd commands', '.bat', 'Runs in Command Prompt.'],
     ['PowerShell script that manages Windows and Microsoft 365', '.ps1', 'Modern Windows automation.'],
     ['Legacy Windows Script Host file (often abused by malware)', '.vbs', 'VBScript.'],
     ['Linux/macOS shell script that starts with #!/bin/bash', '.sh', 'Bash/zsh shell.'],
     ['JavaScript — runs in browsers or Node.js', '.js', 'Web and cross-platform.'],
     ['Cross-platform language popular for automation and data', '.py', 'Python.']],
    'Windows: .bat, .ps1, .vbs. Linux/macOS: .sh. Anywhere: .js, .py.');
  T('c2-ps-script', 'Run an inventory script safely', 'PowerShell execution policy and a .ps1',
    'You have been given <b>Get-Inventory.ps1</b> to collect PC details. Read it before you run it, then run it properly.',
    { shell: 'ps', prompt: 'PS C:\\Scripts>' },
    [{ t: 'Show the contents of <b>Get-Inventory.ps1</b> before running anything.', accept: [/^(get-content|gc|cat|type) \.?\\?get-inventory\.ps1$/i], show: 'Get-Content .\\Get-Inventory.ps1', hint: 'The PowerShell cmdlet that reads a file (Get-…).', out: '$pc = $env:COMPUTERNAME\n$os = (Get-CimInstance Win32_OperatingSystem).Caption\n$ram = [math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory/1GB)\n"$pc,$os,$ram GB" | Out-File \\\\fs01\\it\\inventory.csv -Append', ask: { q: 'Where does the script write its results? (the UNC path)', accept: ['\\\\fs01\\it\\inventory.csv', 'fs01\\it\\inventory.csv'], why: 'It only reads system info and appends one line to a share — safe to run. Always read a script before you run it.' }, why: 'Never run a script you have not read.' },
     { t: 'Check the current PowerShell execution policy.', accept: [/^get-executionpolicy$/i], show: 'Get-ExecutionPolicy', hint: 'Get-…Policy', out: 'Restricted', why: 'Restricted = no scripts run at all (the Windows client default).' },
     { t: 'Allow locally-created scripts (and signed downloaded ones) for <b>your user only</b>.', accept: [/^set-executionpolicy remotesigned -scope currentuser( -force)?$/i, /^set-executionpolicy -executionpolicy remotesigned -scope currentuser( -force)?$/i, /^set-executionpolicy -scope currentuser remotesigned( -force)?$/i], show: 'Set-ExecutionPolicy RemoteSigned -Scope CurrentUser', hint: 'Set-ExecutionPolicy RemoteSigned -Scope CurrentUser', out: 'Execution Policy Change\nDo you want to change the execution policy? [Y] Yes  [N] No: Y', why: 'RemoteSigned for the current user is the usual, least-invasive setting.' },
     { t: 'Run the script from the current folder.', accept: [/^\.\\get-inventory\.ps1$/i, /^& \.\\get-inventory\.ps1$/i], show: '.\\Get-Inventory.ps1', hint: 'PowerShell needs .\\ in front of a script in the current folder.', out: '', why: 'PowerShell does not run scripts from the current folder without .\\ — a safety feature.' },
     { t: 'Confirm the result by showing the last 3 lines of <b>\\\\fs01\\it\\inventory.csv</b>.', accept: [/^get-content \\\\fs01\\it\\inventory\.csv -tail 3$/i, /^gc \\\\fs01\\it\\inventory\.csv -tail 3$/i, /^get-content -path \\\\fs01\\it\\inventory\.csv -tail 3$/i], show: 'Get-Content \\\\fs01\\it\\inventory.csv -Tail 3', hint: 'Get-Content with -Tail.', out: 'WS-ACCT-012,Microsoft Windows 11 Pro,16 GB\nWS-ACCT-013,Microsoft Windows 11 Pro,8 GB\nWS-ACCT-014,Microsoft Windows 11 Pro,16 GB', why: 'Gathering information across many PCs is a classic scripting use case.' }],
    'Read → check policy → allow scripts as narrowly as possible → run with .\\ → verify the output.',
    ['PowerShell cmdlets are Verb-Noun: Get-Content, Get-ExecutionPolicy.']);
  T('c2-sh-script', 'Review a backup script before it runs', 'Bash script safety',
    'A colleague wrote <b>cleanup.sh</b> to delete old backups nightly. You are asked to review and schedule it.',
    { shell: 'bash', prompt: 'tech@backup01:~$' },
    [{ t: 'Print the script.', accept: [/^cat (\.\/)?cleanup\.sh$/, /^less (\.\/)?cleanup\.sh$/], show: 'cat cleanup.sh', hint: 'cat prints a file.', out: '#!/bin/bash\nBACKUP_DIR=$1\ncd $BACKUP_DIR\nrm -rf *', ask: { q: 'If the script is run with NO argument, which directory does "cd" go to? (type home or backups)', accept: ['home', '~', 'the home directory', 'home directory'], why: 'An empty $1 makes "cd" go home, then rm -rf * deletes your whole home directory. Scripts can destroy data or change settings by accident.' }, why: 'This is how scripts "inadvertently change system settings" or delete data.' },
     { t: 'Check the script\'s syntax without running it.', accept: [/^bash -n (\.\/)?cleanup\.sh$/], show: 'bash -n cleanup.sh', hint: 'bash with -n = read but do not execute.', out: '', why: 'No output = no syntax errors. Syntax-valid is not the same as safe.' },
     { t: 'After your colleague fixes it (it now refuses to run without a valid directory and only deletes files older than 30 days), make it executable.', accept: [/^chmod (\+x|u\+x|7[0-5][0-5]) (\.\/)?cleanup\.sh$/], show: 'chmod +x cleanup.sh', hint: 'chmod +x', out: '', why: 'Scripts need execute permission to run as ./cleanup.sh.' },
     { t: 'Test-run it against the backup folder <b>/srv/backups</b>.', accept: [/^\.\/cleanup\.sh \/srv\/backups\/?$/, /^bash cleanup\.sh \/srv\/backups\/?$/], show: './cleanup.sh /srv/backups', hint: './script argument', out: 'Deleting 12 files older than 30 days in /srv/backups\nDone. 1.4 GB freed.', why: 'Automated backups and cleanup are common scripting use cases — once the script is safe.' },
     { t: 'List your scheduled jobs to confirm the nightly entry.', accept: [/^crontab -l$/], show: 'crontab -l', hint: 'crontab with -l (list).', out: '# m h dom mon dow  command\n30 2 * * * /home/tech/cleanup.sh /srv/backups >> /var/log/cleanup.log 2>&1', ask: { q: 'At what time does the job run? (24-hour, e.g. 02:30)', accept: ['02:30', '2:30', '2:30 am', '0230'], why: 'Minute 30, hour 2 — 02:30 every day, with output logged for review.' }, why: 'cron schedules scripts on Linux; Task Scheduler does it on Windows.' }],
    'Before a script runs on a schedule: read it, check what happens with bad input, test it once by hand, log its output.',
    ['Unquoted, unchecked variables are the classic scripting accident.']);
  M('c2-script-wrap', 'Script it?', 'Combined 4.8',
    'Pick the best script type for each task.', ['.bat', '.ps1', '.sh', '.py', 'Do not run it'],
    [['Remap the H: drive for every user at logon on Windows', '.bat', 'A simple net use logon script works (PowerShell also fine).'],
     ['Restart the Print Spooler on 200 Windows PCs and report results', '.ps1', 'PowerShell remoting at scale.'],
     ['Nightly Linux backup with tar and rsync', '.sh', 'Native shell.'],
     ['Pull data from a REST API and build a report on any OS', '.py', 'Cross-platform scripting.'],
     ['A .vbs attachment from an unknown sender says "run to update your mailbox"', 'Do not run it', 'Classic malware delivery.'],
     ['Silent install of an application on all lab PCs', '.ps1', 'Installs, updates and checks.']],
    'Scripts are force multipliers — for you and for an attacker. Know where yours came from.');

  RK.add({ track: TR, id: '4.8', dom: 4, short: 'Scripting basics', title: 'Explain the basics of scripting',
    goal: 'Recognize script types, know what scripts are used for, and run them without breaking things.',
    kw: /\b(script|\.bat|\.ps1|\.vbs|\.sh\b|\.js\b|\.py\b|powershell|batch file|vbscript|python|javascript|automat)/,
    parts: [
      RK.P('Script file types', 'Match .bat, .ps1, .vbs, .sh, .js and .py to the platform and job.',
        `<p>A <b>script</b> is a text file of commands run in order. The extension tells you the language:</p>
<table><tr><th>Extension</th><th>Language</th><th>Runs on</th></tr>
<tr><td><code>.bat</code></td><td>Batch (cmd commands)</td><td>Windows</td></tr>
<tr><td><code>.ps1</code></td><td>PowerShell</td><td>Windows (PowerShell 7 also Linux/macOS)</td></tr>
<tr><td><code>.vbs</code></td><td>VBScript (Windows Script Host)</td><td>Windows — legacy, often abused by malware</td></tr>
<tr><td><code>.sh</code></td><td>Shell (bash/zsh)</td><td>Linux, macOS</td></tr>
<tr><td><code>.js</code></td><td>JavaScript</td><td>Browsers, Node.js</td></tr>
<tr><td><code>.py</code></td><td>Python</td><td>Anywhere Python is installed</td></tr></table>
<p>Scripts use the same building blocks: <b>variables</b> (store a value), <b>conditions</b> (if…), <b>loops</b> (do this for each PC), and <b>comments</b> (# notes for humans).</p>` + pro('Learn PowerShell first if you support Windows. Almost every admin task can be done — and repeated — with it.') + trap('.vbs and .js attachments in email are a common way malware is delivered; the exam may describe one as suspicious.'),
        [['Which file type is a PowerShell script?', '.ps1', ['.bat', '.sh', '.vbs'], '.ps1 = PowerShell.'],
         ['Which script type is native to Linux?', '.sh', ['.bat', '.ps1', '.vbs'], 'Shell script.']],
        'c2-scripttypes'),
      RK.P('What scripts are used for', 'Name the common scripting use cases and run a PowerShell script correctly.',
        `<p><b>Use cases</b> on the exam:</p>
<ul><li><b>Basic automation</b> — anything repeated: create users, clean temp files.</li>
<li><b>Restarting machines</b> — scheduled reboots after patching.</li>
<li><b>Remapping network drives</b> — logon scripts with <code>net use</code> or <code>New-PSDrive</code>.</li>
<li><b>Installation of applications</b> — silent installs across many PCs.</li>
<li><b>Automated backups</b> — copy data on a schedule (robocopy, rsync).</li>
<li><b>Gathering of information/data</b> — inventory: OS, RAM, serial numbers.</li>
<li><b>Initiating updates</b> — trigger OS or app updates.</li></ul>
<p><b>Running PowerShell scripts</b>: Windows blocks scripts by default (<b>execution policy</b> <code>Restricted</code>). <code>Set-ExecutionPolicy RemoteSigned -Scope CurrentUser</code> allows your own scripts. Run a script in the current folder with <code>.\\script.ps1</code>.</p>` + pro('Schedule scripts with Task Scheduler (Windows) or cron (Linux), and always write their output to a log file you can check.') + trap('PowerShell will not run "script.ps1" from the current folder without the .\\ prefix. That is by design.'),
        [['Which is a common scripting use case on the exam?', 'Remapping network drives at logon', ['Replacing a power supply', 'Cleaning a printer', 'Configuring BIOS passwords by hand'], 'Logon scripts map drives.'],
         ['Why does a .ps1 script fail to run on a new Windows PC?', 'The execution policy is Restricted by default', ['PowerShell is not installed', 'Scripts need admin rights always', 'The file must be renamed .bat'], 'Change the policy (narrowly).']],
        'c2-ps-script'),
      RK.P('Scripting risks', 'Explain how scripts can introduce malware, change settings by accident, or crash systems.',
        `<p><b>Other considerations when using scripts:</b></p>
<ul><li><b>Unintentionally introducing malware</b> — scripts downloaded from forums or emailed to you may contain malicious commands. Only run scripts from trusted sources, and read them first.</li>
<li><b>Inadvertently changing system settings</b> — one wrong line (a registry change, an <code>rm -rf</code> with an empty variable, a firewall rule) can affect every PC the script runs on.</li>
<li><b>Browser or system crashes due to mishandling of resources</b> — loops that never end, scripts that open thousands of files or processes, or eat all memory.</li></ul>
<p><b>Safe habits:</b> test on one machine first, run with the least privilege needed, keep scripts in source control, log output, and check what happens with missing or bad input.</p>` + pro('Add a "dry run" mode that prints what the script <i>would</i> do. Run that first on production.') + trap('A script that runs on hundreds of PCs multiplies mistakes. "Test on a small group first" is the exam-safe answer.'),
        [['A cleanup script with an empty variable deletes the wrong folder. Which risk is this?', 'Inadvertently changing system settings/data', ['Introducing malware', 'Resource mishandling crash', 'Licensing violation'], 'Unintended effects.'],
         ['What is the safest first step before deploying a new script to every PC?', 'Read it and test it on one machine', ['Run it on all PCs at once', 'Disable antivirus', 'Give it domain admin rights'], 'Test small first.']],
        'c2-sh-script')
    ],
    wrap: { recap: ['.bat (cmd), .ps1 (PowerShell), .vbs (VBScript) on Windows; .sh on Linux/macOS; .js and .py cross-platform.', 'Use cases: automation, restarts, drive remapping, app installs, backups, gathering data, initiating updates.', 'PowerShell execution policy is Restricted by default; RemoteSigned -Scope CurrentUser; run with .\\script.ps1.', 'Risks: introducing malware, changing settings by accident, crashes from resource mishandling.', 'Read before running, test on one machine, least privilege, log the output.'], lab: 'c2-script-wrap' }
  });

  // ===================== 4.9 Remote access =====================
  T('c2-rdp', 'Remote Desktop to a user\'s PC', 'Test the port, then connect',
    'A user at <b>WS-ACCT-014</b> needs help with a spreadsheet. You are on the help-desk PC, on the corporate network (VPN not needed). PowerShell prompt.',
    { shell: 'ps', prompt: 'PS C:\\Users\\tech>' },
    [{ t: 'Test whether the PC answers on the Remote Desktop port.', accept: [/^test-netconnection( -computername)? ws-acct-014 -port 3389$/i, /^tnc ws-acct-014 -port 3389$/i], show: 'Test-NetConnection WS-ACCT-014 -Port 3389', hint: 'Test-NetConnection <host> -Port <RDP port>', out: 'ComputerName     : WS-ACCT-014\nRemoteAddress    : 10.20.30.114\nRemotePort       : 3389\nTcpTestSucceeded : True', ask: { q: 'Did the TCP test succeed? (true/false)', accept: ['true', 'yes'], why: 'Port 3389 is open: RDP is enabled and the firewall allows it.' }, why: 'Test the port before blaming credentials.' },
     { t: 'Open the Remote Desktop client straight to that computer.', accept: [/^mstsc( \/v:| \/v )ws-acct-014$/i, /^mstsc \/v:10\.20\.30\.114$/i], show: 'mstsc /v:WS-ACCT-014', hint: 'mstsc /v:<computer>', out: '[Remote Desktop Connection]\nConnecting to WS-ACCT-014...\nWARNING: A user is currently signed in. Continuing will sign them out of their session.', ask: { q: 'Will a standard RDP connection share the user\'s screen with them, or take over their session? (share/take over)', accept: ['take over', 'takeover', 'take-over'], why: 'RDP opens a separate session and signs the local user out. To work alongside a user, use Remote Assistance/Quick Assist or a screen-sharing tool.' }, why: 'mstsc /v: launches RDP to a host.' },
     { t: 'Cancel, and instead start Windows\' built-in assistance tool so the user can share their screen with you.', accept: [/^quickassist(\.exe)?$/i, /^msra(\.exe)?( \/offerra ws-acct-014)?$/i], show: 'quickassist', hint: 'Quick Assist (or msra for Remote Assistance).', out: '[Quick Assist]\nHelp someone → Security code: 482 917 (expires in 10 min)\nGive this code to the user. They will approve before you can see or control their screen.', why: 'Attended support: the user sees everything and must consent.' }],
    'RDP = full remote session (TCP 3389, Pro and above, members of Remote Desktop Users). Screen-sharing tools = attended help with consent. Off-site? VPN first.',
    ['Test-NetConnection checks a TCP port from PowerShell.']);
  T('c2-ssh', 'SSH with keys, not passwords', 'ssh-keygen, ssh-copy-id, ssh, scp',
    'You manage the Linux web server <b>web01</b>. Set up key-based SSH, copy a file, and run a check.',
    { shell: 'bash', prompt: 'tech@laptop:~$' },
    [{ t: 'Generate a new key pair using the modern ed25519 algorithm.', accept: [/^ssh-keygen -t ed25519( -c ["'][^"']*["'])?$/i], show: 'ssh-keygen -t ed25519', hint: 'ssh-keygen -t <type>', out: 'Generating public/private ed25519 key pair.\nEnter passphrase (empty for no passphrase): ********\nYour identification has been saved in /home/tech/.ssh/id_ed25519\nYour public key has been saved in /home/tech/.ssh/id_ed25519.pub', ask: { q: 'Which file is safe to share with servers? (type the file name)', accept: ['id_ed25519.pub', '/home/tech/.ssh/id_ed25519.pub', '~/.ssh/id_ed25519.pub'], why: 'The .pub public key goes on servers. The private key never leaves your machine.' }, why: 'Key pairs replace passwords with something that cannot be guessed.' },
     { t: 'Install your public key on <b>web01</b> for user <b>tech</b>.', accept: [/^ssh-copy-id (-i ~\/\.ssh\/id_ed25519\.pub )?tech@web01$/], show: 'ssh-copy-id tech@web01', hint: 'ssh-copy-id user@host', out: 'tech@web01\'s password: ********\nNumber of key(s) added: 1\nNow try logging into the machine, with: "ssh \'tech@web01\'"', why: 'Your key is appended to ~/.ssh/authorized_keys on the server.' },
     { t: 'Connect to web01 as tech.', accept: [/^ssh tech@web01$/, /^ssh -l tech web01$/], show: 'ssh tech@web01', hint: 'ssh user@host', out: 'Enter passphrase for key \'/home/tech/.ssh/id_ed25519\': ********\nWelcome to Ubuntu 24.04 LTS (GNU/Linux 6.8.0 x86_64)', prompt: 'tech@web01:~$', why: 'Encrypted remote shell on TCP 22, authenticated by your key.' },
     { t: 'Check that the web server service is running.', accept: [/^(sudo )?systemctl status (apache2|nginx)(\.service)?$/], show: 'systemctl status apache2', hint: 'systemctl status <service>', out: '● apache2.service - The Apache HTTP Server\n     Loaded: loaded (/lib/systemd/system/apache2.service; enabled)\n     Active: active (running) since Mon 2026-11-17 08:01:12 CST', why: 'Remote administration is just the normal commands, run over SSH.' },
     { t: 'Disconnect from web01.', accept: [/^(exit|logout)$/], show: 'exit', hint: 'Leave the shell.', out: 'logout\nConnection to web01 closed.', prompt: 'tech@laptop:~$', why: 'Always close sessions you are done with.' },
     { t: 'Copy <b>report.txt</b> from your laptop to <b>/tmp</b> on web01 securely.', accept: [/^scp (\.\/)?report\.txt tech@web01:\/tmp\/?$/], show: 'scp report.txt tech@web01:/tmp', hint: 'scp file user@host:/path', out: 'report.txt                       100%   14KB   1.2MB/s   00:00', why: 'scp/sftp transfer files over SSH — never FTP or Telnet.' }],
    'Keys + passphrase, disable password logins on servers, and SSH only through the VPN or a jump host.',
    ['ssh user@host. Keys: ssh-keygen then ssh-copy-id.']);
  T('c2-winrm', 'Fix it with PowerShell remoting', 'WinRM: Test-WSMan, Enter-PSSession, Invoke-Command',
    'Two users say they cannot print. You suspect the Print Spooler on their PCs. Fix it remotely without interrupting them. Domain admin PowerShell prompt.',
    { shell: 'ps', prompt: 'PS C:\\Users\\tech.admin>' },
    [{ t: 'Check that WinRM (PowerShell remoting) answers on <b>WS-HR-021</b>.', accept: [/^test-wsman( -computername)? ws-hr-021$/i], show: 'Test-WSMan WS-HR-021', hint: 'Test-WSMan <computer>', out: 'wsmid           : http://schemas.dmtf.org/wbem/wsman/identity/1/wsmanidentity.xsd\nProtocolVersion : http://schemas.dmtf.org/wbem/wsman/1/wsman.xsd\nProductVendor   : Microsoft Corporation\nProductVersion  : OS: 0.0.0 SP: 0.0 Stack: 3.0', why: 'A reply means WinRM is listening (TCP 5985 HTTP / 5986 HTTPS).' },
     { t: 'Open an interactive remote session to WS-HR-021.', accept: [/^enter-pssession( -computername)? ws-hr-021$/i, /^etsn ws-hr-021$/i], show: 'Enter-PSSession WS-HR-021', hint: 'Enter-PSSession <computer>', out: '', prompt: '[WS-HR-021]: PS C:\\Users\\tech.admin\\Documents>', why: 'The prompt now shows the remote computer name.' },
     { t: 'Check the Print Spooler service.', accept: [/^get-service( -name)? spooler$/i, /^gsv spooler$/i], show: 'Get-Service Spooler', hint: 'Get-Service <name>', out: 'Status   Name               DisplayName\n------   ----               -----------\nStopped  Spooler            Print Spooler', ask: { q: 'What is the service status?', accept: ['stopped'], why: 'The spooler has stopped, so nothing can print.' }, why: 'Read before you change.' },
     { t: 'Start it.', accept: [/^(start|restart)-service( -name)? spooler$/i, /^sasv spooler$/i], show: 'Start-Service Spooler', hint: 'Start-Service <name>', out: '', why: 'Fixed without the user noticing — no screen takeover.' },
     { t: 'Leave the remote session.', accept: [/^exit-pssession$/i, /^exit$/i, /^exsn$/i], show: 'Exit-PSSession', hint: 'Exit-PSSession', out: '', prompt: 'PS C:\\Users\\tech.admin>', why: 'Back on your own PC.' },
     { t: 'Check the spooler on BOTH <b>WS-HR-021</b> and <b>WS-HR-022</b> in one command.', accept: [/^invoke-command -computername ws-hr-021,\s?ws-hr-022 -scriptblock \{ ?get-service spooler ?\}$/i, /^icm -computername ws-hr-021,\s?ws-hr-022 -scriptblock \{ ?get-service spooler ?\}$/i, /^invoke-command ws-hr-021,\s?ws-hr-022 \{ ?get-service spooler ?\}$/i], show: 'Invoke-Command -ComputerName WS-HR-021,WS-HR-022 -ScriptBlock { Get-Service Spooler }', hint: 'Invoke-Command -ComputerName A,B -ScriptBlock { … }', out: 'Status   Name     DisplayName      PSComputerName\n------   ----     -----------      --------------\nRunning  Spooler  Print Spooler    WS-HR-021\nStopped  Spooler  Print Spooler    WS-HR-022', ask: { q: 'Which PC still has a stopped spooler?', accept: ['ws-hr-022'], why: 'Fix it the same way — or with Invoke-Command { Start-Service Spooler } on many PCs at once.' }, why: 'Invoke-Command runs the same command on many computers.' }],
    'WinRM = remote PowerShell, unattended and invisible to the user. Enter-PSSession for one PC, Invoke-Command for many. Restrict it to admin networks and accounts.',
    ['Remoting cmdlets: Test-WSMan, Enter-PSSession, Invoke-Command.']);
  M('c2-remote-sec', 'Secure the remote access', 'Security considerations per method',
    'Pick the most important security control for each method.', ['Put it behind a VPN; never expose to the Internet', 'Use keys and disable password logins', 'Require the user\'s consent each session', 'Use the encrypted version or tunnel it', 'Restrict to admin hosts and accounts', 'Protect the RMM console with MFA'],
    [['RDP (TCP 3389) on a server', 'Put it behind a VPN; never expose to the Internet', 'Exposed RDP is a top ransomware entry point.'],
     ['SSH to Linux servers', 'Use keys and disable password logins', 'Stops password guessing.'],
     ['Screen-sharing support with a user', 'Require the user\'s consent each session', 'Attended, approved access.'],
     ['VNC, which may send traffic unencrypted', 'Use the encrypted version or tunnel it', 'Tunnel over SSH/VPN.'],
     ['WinRM / PowerShell remoting', 'Restrict to admin hosts and accounts', 'Least privilege + jump host.'],
     ['RMM agent installed on every PC', 'Protect the RMM console with MFA', 'Whoever owns the console owns every PC.']],
    'Every remote access tool is also an attacker\'s favourite door. Limit who, from where, and with what.');
  M('c2-remote-wrap', 'Pick the remote tool', 'Combined 4.9',
    'Pick the best method or tool.', ['RDP', 'VPN', 'VNC', 'SSH', 'RMM', 'SPICE', 'WinRM', 'Screen-sharing software', 'File transfer software', 'Desktop management software'],
    [['Full graphical session on a Windows server', 'RDP', 'TCP 3389.'],
     ['Remote worker must reach internal systems securely first', 'VPN', 'Encrypted tunnel.'],
     ['Cross-platform remote desktop on a Mac or Linux box', 'VNC', 'TCP 5900.'],
     ['Command line on a Linux server', 'SSH', 'TCP 22.'],
     ['MSP monitors and patches 2,000 client PCs from one console', 'RMM', 'Remote monitoring and management.'],
     ['Remote display for a KVM/QEMU virtual machine', 'SPICE', 'VM console protocol.'],
     ['Run PowerShell commands on 50 Windows PCs at once', 'WinRM', 'TCP 5985/5986.'],
     ['Help a user while they watch and approve', 'Screen-sharing software', 'Attended support.'],
     ['Send a large log bundle to a vendor securely', 'File transfer software', 'SFTP/managed transfer.'],
     ['Push software and settings to every company laptop', 'Desktop management software', 'Endpoint management.']],
    'Interactive GUI: RDP/VNC/screen-sharing. Command line: SSH/WinRM. Fleet: RMM/desktop management. Always: VPN or jump host first.');

  RK.add({ track: TR, id: '4.9', dom: 4, short: 'Remote access technologies', title: 'Given a scenario, use remote access technologies',
    goal: 'Connect and support remotely with RDP, VPN, VNC, SSH, RMM, SPICE, WinRM and third-party tools — and secure each one.',
    kw: /\b(remote (access|desktop|assistance|support)|\brdp\b|3389|\bvnc\b|\bssh\b|\brmm\b|spice|winrm|psremot|enter-pssession|screen.shar|quick assist|teamviewer|jump (box|host)|remote monitoring)/,
    parts: [
      RK.P('RDP and VPN', 'Connect to a Windows PC with RDP, know when to use screen-sharing instead, and use a VPN for off-site access.',
        `<ul><li><b>RDP</b> (Remote Desktop Protocol, <b>TCP 3389</b>) — a full graphical session on a Windows machine. Host must be <b>Pro or above</b>, RDP enabled, the user in the <b>Remote Desktop Users</b> group (or admin), and the firewall rule allowed. Client: <code>mstsc /v:computer</code>.</li>
<li>Connecting with RDP <b>signs the local user out</b> of their session. To help a user while they watch, use <b>Remote Assistance / Quick Assist</b> or a <b>screen-sharing</b> tool instead.</li>
<li><b>Network Level Authentication (NLA)</b> — the user authenticates before a session is created; keep it on.</li>
<li><b>VPN</b> — an encrypted tunnel into the company network. From outside, connect the VPN first, then RDP to internal hosts.</li></ul>` + pro('Test the port before anything else: Test-NetConnection host -Port 3389 tells you in two seconds whether it is a network problem or a login problem.') + trap('RDP hosting is not available on Windows Home — Home can only be the client.'),
        [['Which TCP port does RDP use?', '3389', ['22', '5900', '5985'], 'Remote Desktop Protocol.'],
         ['You need to help a user while they watch their own screen. Which is best?', 'Remote Assistance / Quick Assist', ['RDP as administrator', 'SSH', 'WinRM'], 'RDP would sign them out.']],
        'c2-rdp'),
      RK.P('SSH, VNC and SPICE', 'Use SSH with keys for command-line access, and know where VNC and SPICE fit.',
        `<ul><li><b>SSH</b> (TCP 22) — encrypted command-line access, mostly to Linux, macOS, network gear (and Windows via OpenSSH). <code>ssh user@host</code>.
<ul><li><b>Key-based authentication</b>: <code>ssh-keygen</code> creates a key pair; <code>ssh-copy-id</code> installs the public key on the server. Keys + a passphrase beat passwords.</li>
<li><b>scp/sftp</b> copy files over SSH.</li></ul></li>
<li><b>VNC</b> (Virtual Network Computing, TCP 5900+) — cross-platform remote desktop (screen sharing on macOS uses it). Older VNC may not encrypt: tunnel it over SSH or a VPN.</li>
<li><b>SPICE</b> — remote display protocol for virtual machines (KVM/QEMU): the console of a VM, with audio and USB redirection.</li></ul>` + pro('On servers, set PasswordAuthentication no in sshd_config once keys work. Most SSH attacks are password guessing.') + trap('SSH replaces Telnet (TCP 23). Telnet sends everything, including passwords, in clear text.'),
        [['Which file do you copy to a server for SSH key login?', 'The public key (.pub)', ['The private key', 'The known_hosts file', 'The sshd_config file'], 'Public key goes to authorized_keys.'],
         ['Which protocol provides remote display for KVM/QEMU virtual machines?', 'SPICE', ['VNC', 'RDP', 'WinRM'], 'Simple Protocol for Independent Computing Environments.']],
        'c2-ssh'),
      RK.P('WinRM, RMM and third-party tools', 'Manage PCs with WinRM/PowerShell remoting and RMM, and pick third-party tools for support tasks.',
        `<ul><li><b>WinRM</b> (Windows Remote Management, TCP 5985 HTTP / 5986 HTTPS) — runs PowerShell on remote Windows machines, invisibly to the user.
<ul><li><code>Test-WSMan PC</code> — is it listening?</li>
<li><code>Enter-PSSession PC</code> — interactive session on one PC.</li>
<li><code>Invoke-Command -ComputerName A,B -ScriptBlock {…}</code> — run on many PCs at once.</li></ul></li>
<li><b>RMM</b> (remote monitoring and management) — an agent on every device reports health and lets the team patch, script and remote in from one console. The standard tool of MSPs.</li>
<li><b>Third-party tools</b>:
<ul><li><b>Screen-sharing software</b> — attended support with user consent.</li>
<li><b>Videoconferencing software</b> — share a screen in a call for walkthroughs.</li>
<li><b>File transfer software</b> — move large files securely (SFTP, managed file transfer).</li>
<li><b>Desktop management software</b> — push apps, settings and updates to the fleet.</li></ul></li></ul>` + pro('Fix things invisibly when you can: restarting a service over WinRM interrupts nobody, while a screen takeover stops their work.') + trap('WinRM is not a graphical remote desktop. It is remote command-line/PowerShell management.'),
        [['Which cmdlet runs the same command on several remote Windows PCs?', 'Invoke-Command', ['Enter-PSSession', 'Test-WSMan', 'mstsc'], 'One command, many computers.'],
         ['An MSP monitors, patches and remotes into thousands of client PCs from one console. What is it using?', 'RMM', ['VNC', 'SPICE', 'Telnet'], 'Remote monitoring and management.']],
        'c2-winrm'),
      RK.P('Security considerations for each method', 'Choose the right security control for each remote access method.',
        `<table><tr><th>Method</th><th>Main risk</th><th>Control</th></tr>
<tr><td>RDP</td><td>Exposed 3389 is brute-forced and exploited</td><td>VPN/RD Gateway only, NLA, MFA, lockout</td></tr>
<tr><td>VPN</td><td>Stolen credentials = inside the network</td><td>MFA, up-to-date client, least-privilege access</td></tr>
<tr><td>VNC</td><td>May be unencrypted; weak passwords</td><td>Tunnel over SSH/VPN, strong passwords</td></tr>
<tr><td>SSH</td><td>Password guessing</td><td>Keys, no root login, no passwords</td></tr>
<tr><td>RMM</td><td>Console compromise = every device</td><td>MFA, limited admins, audit logs</td></tr>
<tr><td>WinRM</td><td>Lateral movement</td><td>Admin-only, from jump hosts, HTTPS</td></tr>
<tr><td>Third-party tools</td><td>Scammers posing as support</td><td>Approved tools only, user consent, verify identity</td></tr></table>
<p>For every method: <b>least privilege</b>, <b>MFA</b>, <b>logging</b>, and access only through a <b>VPN or jump host</b>.</p>` + pro('Verify identity before any remote session: call the user back on a known number. "IT support" scams start with a remote tool.') + trap('"Allow RDP from the Internet" is always the wrong answer. Put it behind a VPN or gateway.'),
        [['What is the best way to provide RDP to remote workers?', 'Require a VPN (or RD Gateway) before RDP', ['Forward TCP 3389 to every PC', 'Disable NLA', 'Use Telnet instead'], 'Never expose RDP directly.'],
         ['Why must RMM consoles be protected with MFA?', 'Compromising the console gives control of every managed device', ['RMM is slow without it', 'It encrypts VNC', 'It replaces antivirus'], 'One console, every device.']],
        'c2-remote-sec')
    ],
    wrap: { recap: ['RDP TCP 3389: full session, Pro and above, Remote Desktop Users, NLA; signs the local user out.', 'Quick Assist / Remote Assistance / screen-sharing for attended help with consent.', 'VPN first for off-site access. SSH TCP 22 with keys (ssh-keygen, ssh-copy-id); scp for files.', 'VNC TCP 5900 — tunnel it. SPICE = VM display protocol.', 'WinRM TCP 5985/5986: Test-WSMan, Enter-PSSession, Invoke-Command. RMM = fleet monitoring and management.', 'Secure every method: VPN/jump host, MFA, least privilege, logging, verified identity.'], lab: 'c2-remote-wrap' }
  });

  // ===================== 4.10 AI =====================
  M('c2-ai-policy', 'AI use at work', 'Integration and policy',
    'Pick the best label for each situation.', ['Appropriate use', 'Inappropriate use', 'Plagiarism', 'Application integration'],
    [['A tech asks the approved company AI assistant to draft a knowledge base article, then checks and edits it', 'Appropriate use', 'Approved tool, human review.'],
     ['A tech pastes a customer\'s full database export into a free public chatbot', 'Inappropriate use', 'Leaks confidential data.'],
     ['Submitting AI-written text as your own certification essay without credit', 'Plagiarism', 'Presenting others\' (or AI) work as yours.'],
     ['The ticketing system suggests categories and replies using built-in AI', 'Application integration', 'AI inside an existing app.'],
     ['Using AI to summarize a public vendor manual', 'Appropriate use', 'Public data, low risk.']],
    'Policy decides which AI tools are approved and what data may go into them.');
  M('c2-ai-risk', 'Can you trust the answer?', 'Limitations and private vs public AI',
    'Pick the risk or concept each situation shows.', ['Hallucination', 'Bias', 'Accuracy', 'Data privacy', 'Data security', 'Data source', 'Private AI'],
    [['The AI confidently cites a PowerShell cmdlet that does not exist', 'Hallucination', 'Invented but plausible.'],
     ['A screening tool trained on old hiring data favours one group', 'Bias', 'Skewed training data.'],
     ['The answer was right for Windows 10 but wrong for Windows 11', 'Accuracy', 'Verify against current sources.'],
     ['Employee names and health details were typed into a public chatbot', 'Data privacy', 'Personal data exposure.'],
     ['Prompts sent to a public service may be stored and used for training', 'Data security', 'Where your input goes.'],
     ['You need to know what documents the AI\'s answer is based on', 'Data source', 'Grounding and traceability.'],
     ['A model hosted in the company tenant that keeps data inside the organization', 'Private AI', 'Controlled data handling.']],
    'Treat AI output like advice from a fast, confident junior: useful, and always checked.');
  M('c2-ai-wrap', 'AI policy desk', 'Combined 4.10',
    'Pick the best response.', ['Use the approved private AI tool', 'Verify against official documentation', 'Do not enter the data', 'Credit or rewrite the work', 'Check for bias'],
    [['A user wants to analyse customer PII with AI', 'Use the approved private AI tool', 'Keep data inside the organization.'],
     ['AI suggests a registry change to fix a boot issue', 'Verify against official documentation', 'Hallucinations happen.'],
     ['Someone wants to paste source code under NDA into a public chatbot', 'Do not enter the data', 'NDA and data security.'],
     ['A report was mostly generated by AI', 'Credit or rewrite the work', 'Avoid plagiarism; follow policy.'],
     ['An AI tool ranks support tickets and one region always gets low priority', 'Check for bias', 'Unfair outcomes from training data.']],
    'AI questions on the exam are about judgment: approved tools, protected data, verified output.');

  RK.add({ track: TR, id: '4.10', dom: 4, short: 'Basic AI concepts', title: 'Explain basic concepts related to artificial intelligence (AI)',
    goal: 'Use AI tools at work within policy, recognise their limitations, and keep data safe.',
    kw: /\b(artificial intelligence|\bai\b|chatbot|large language|llm|hallucinat|plagiar|bias|generative)/,
    parts: [
      RK.P('AI integration and policy', 'Explain application integration and appropriate-use and plagiarism policies for AI.',
        `<p><b>Artificial intelligence (AI)</b> tools — especially generative AI (chat assistants) — now appear across IT work.</p>
<ul><li><b>Application integration</b> — AI built into tools you already use: ticketing systems that suggest replies, office suites that summarize, security tools that flag anomalies, scripting assistants.</li>
<li><b>Policy</b> — every organization should define:
<ul><li><b>Appropriate use</b> — which AI tools are approved, for which tasks, and which data may never be entered (customer data, credentials, regulated data, NDA material).</li>
<li><b>Plagiarism</b> — passing off AI-generated (or anyone else\'s) work as your own original work, in school, certifications or publications. Follow the policy on disclosure.</li></ul></li></ul>` + pro('Use AI to draft scripts, KB articles and explanations — then test and edit everything before it reaches a user or a production system.') + trap('Approved AI tool ≠ any AI tool. Using an unapproved public tool with company data is a policy violation even if the answer was good.'),
        [['A ticketing system that drafts replies with built-in AI is an example of:', 'Application integration', ['Plagiarism', 'Hallucination', 'Bias'], 'AI inside an existing app.'],
         ['Which data should never be pasted into an unapproved public AI tool?', 'Customer PII and credentials', ['A public vendor manual', 'A generic error message', 'A Windows version number'], 'Confidential/regulated data.']],
        'c2-ai-policy'),
      RK.P('Limitations and private vs public AI', 'Recognise bias, hallucinations and accuracy limits, and choose private or public AI for data.',
        `<p><b>Limitations:</b></p>
<ul><li><b>Bias</b> — models learn from data; skewed data gives unfair or skewed answers.</li>
<li><b>Hallucinations</b> — confident, plausible, <i>made-up</i> answers: commands that do not exist, invented references.</li>
<li><b>Accuracy</b> — answers can be out of date or wrong for your version/environment. Verify against official documentation.</li></ul>
<p><b>Private vs public:</b></p>
<table><tr><th></th><th>Public AI</th><th>Private AI</th></tr>
<tr><td>Where it runs</td><td>Vendor\'s shared service</td><td>Company tenant or own servers</td></tr>
<tr><td><b>Data security</b></td><td>Prompts may be stored or used for training</td><td>Data stays under company control</td></tr>
<tr><td><b>Data source</b></td><td>General internet training data</td><td>Can be grounded on company documents</td></tr>
<tr><td><b>Data privacy</b></td><td>Personal data leaves the organization</td><td>Governed by company policy</td></tr></table>` + pro('Ask the AI for its source, then open the source. If there is no source, treat the answer as a guess.') + trap('A hallucination is not a bug you can see: it reads exactly like a correct answer.'),
        [['An AI invents a command that does not exist. What is this called?', 'A hallucination', ['Bias', 'Plagiarism', 'Data locality'], 'Confident fabrication.'],
         ['Why might a company require a private AI instead of a public one?', 'To keep sensitive data under its control', ['Public AI is always less accurate', 'Private AI never hallucinates', 'Public AI cannot write scripts'], 'Data security and privacy.']],
        'c2-ai-risk')
    ],
    wrap: { recap: ['Application integration = AI inside existing tools.', 'Policy: appropriate use (approved tools, banned data) and plagiarism.', 'Limitations: bias, hallucinations, accuracy — always verify.', 'Public AI: data may be stored/used; private AI keeps data in company control.', 'Data security, data source and data privacy decide which tool is allowed.'], lab: 'c2-ai-wrap' }
  });

  // ===================== Domain 4 combined terminal lab =====================
  T('c2-d4-wrap', 'Domain 4 shift: remote fix, by the book', 'Change, remote access, scripting, documentation',
    'Approved change CHG-2211: "Restart the stuck Print Spooler on the HR floor PCs and clear the queue." You are on the help-desk PC in PowerShell. No hints in the tasks: this is the domain check.',
    { shell: 'ps', prompt: 'PS C:\\Users\\tech.admin>' },
    [{ t: '<b>4.9</b> — Confirm PowerShell remoting answers on <b>WS-HR-021</b> before you change anything.', accept: [/^test-wsman( -computername)? ws-hr-021$/i], show: 'Test-WSMan WS-HR-021', hint: '4.9 — WinRM test.', out: 'ProductVendor   : Microsoft Corporation\nProductVersion  : OS: 0.0.0 SP: 0.0 Stack: 3.0', why: '4.9 — WinRM is listening.' },
     { t: '<b>4.9</b> — Check the spooler on WS-HR-021 and WS-HR-022 in one command.', accept: [/^invoke-command -computername ws-hr-021,\s?ws-hr-022 -scriptblock \{ ?get-service spooler ?\}$/i, /^icm -computername ws-hr-021,\s?ws-hr-022 -scriptblock \{ ?get-service spooler ?\}$/i, /^invoke-command ws-hr-021,\s?ws-hr-022 \{ ?get-service spooler ?\}$/i], show: 'Invoke-Command -ComputerName WS-HR-021,WS-HR-022 -ScriptBlock { Get-Service Spooler }', hint: '4.9 — Invoke-Command with -ScriptBlock.', out: 'Status   Name     PSComputerName\n------   ----     --------------\nStopped  Spooler  WS-HR-021\nStopped  Spooler  WS-HR-022', why: 'Both stopped — matches the change scope.' },
     { t: '<b>4.8/4.9</b> — Restart the spooler on both PCs in one command.', accept: [/^invoke-command -computername ws-hr-021,\s?ws-hr-022 -scriptblock \{ ?(re)?start-service spooler ?\}$/i, /^icm -computername ws-hr-021,\s?ws-hr-022 -scriptblock \{ ?(re)?start-service spooler ?\}$/i, /^invoke-command ws-hr-021,\s?ws-hr-022 \{ ?(re)?start-service spooler ?\}$/i], show: 'Invoke-Command -ComputerName WS-HR-021,WS-HR-022 -ScriptBlock { Restart-Service Spooler }', hint: 'Same command, different cmdlet inside the script block.', out: '', why: 'One line, many PCs — scripting\'s main benefit.' },
     { t: '<b>4.2</b> — Verify (end-user acceptance starts with your own check): show the spooler status on both again.', accept: [/^invoke-command -computername ws-hr-021,\s?ws-hr-022 -scriptblock \{ ?get-service spooler ?\}$/i, /^icm -computername ws-hr-021,\s?ws-hr-022 -scriptblock \{ ?get-service spooler ?\}$/i, /^invoke-command ws-hr-021,\s?ws-hr-022 \{ ?get-service spooler ?\}$/i], show: 'Invoke-Command -ComputerName WS-HR-021,WS-HR-022 -ScriptBlock { Get-Service Spooler }', hint: 'Repeat the check.', out: 'Status   Name     PSComputerName\n------   ----     --------------\nRunning  Spooler  WS-HR-021\nRunning  Spooler  WS-HR-022', ask: { q: 'Is the change complete now? (yes/no)', accept: ['no'], why: 'Not until the users confirm they can print (end-user acceptance) and the change and ticket are documented.' }, why: 'Verify, then get user acceptance.' },
     { t: '<b>4.1</b> — Append a progress note to the change log file <b>\\\\fs01\\it\\CHG-2211.txt</b>: "Spooler restarted on WS-HR-021,022 - awaiting user test".', accept: [/^add-content( -path)? \\\\fs01\\it\\chg-2211\.txt( -value)? ["'][^"']+["']$/i, /^["'][^"']+["'] \| (out-file \\\\fs01\\it\\chg-2211\.txt -append|add-content \\\\fs01\\it\\chg-2211\.txt)$/i], show: 'Add-Content \\\\fs01\\it\\CHG-2211.txt "Spooler restarted on WS-HR-021,022 - awaiting user test"', hint: 'Add-Content <file> "text"', out: '', why: '4.1 — clear progress notes: what, where, what is next.' }],
    'Domain 4 in one ticket: an approved change (4.2), remote management (4.9), scripting across many PCs (4.8), and clear documentation (4.1). Next: the users confirm, then you close the change.',
    ['Each task names its objective. Flip back to it if you are stuck.']);

  // ---------- extra test questions for the objectives the old bank did not cover ----------
  RK.extra(TR, '4.8', [
    ['Which script type is most associated with legacy Windows Script Host malware attachments?', '.vbs', ['.ps1', '.sh', '.py'], 'VBScript files are a common lure.'],
    ['Which command lets your own PowerShell scripts run for your account only?', 'Set-ExecutionPolicy RemoteSigned -Scope CurrentUser', ['Set-ExecutionPolicy Unrestricted -Scope LocalMachine', 'Get-ExecutionPolicy', 'Enable-PSRemoting'], 'Narrowest change that works.'],
    ['A script loops forever and consumes all memory. Which risk is this?', 'Crash due to mishandling of resources', ['Introducing malware', 'Licensing violation', 'Order of volatility'], 'Resource exhaustion.'],
    ['Which is the best way to run a Windows script every night at 1 AM?', 'Task Scheduler', ['Device Manager', 'msconfig', 'Disk Cleanup'], 'Schedules tasks on Windows.'],
    ['Which language is cross-platform and popular for automation and data processing?', 'Python (.py)', ['Batch (.bat)', 'VBScript (.vbs)', 'Windows Registry (.reg)'], 'Python runs anywhere.'],
    ['How do you run a bash script in the current directory after making it executable?', './script.sh', ['script.sh /run', 'run script.sh', '.\\script.sh'], './ means this directory on Linux.'],
    ['Which is a scripting use case on the exam?', 'Initiating updates', ['Replacing a fuser', 'Reseating RAM', 'Calibrating a touchscreen'], 'Automation of updates.'],
    ['What should you do before running a script from an online forum?', 'Read it and test it in a safe environment', ['Run it as administrator immediately', 'Disable antivirus', 'Email it to all users'], 'Untrusted scripts can contain malware.'],
    ['Which file type is a Windows batch file?', '.bat', ['.sh', '.js', '.ps1'], 'Batch = cmd commands.'],
    ['A logon script maps drive S: for every user. Which use case?', 'Remapping network drives', ['Automated backups', 'Restarting machines', 'Gathering information'], 'Drive mapping.']
  ]);
  RK.extra(TR, '4.9', [
    ['Which protocol and port does SSH use?', 'TCP 22', ['TCP 23', 'TCP 3389', 'TCP 5900'], 'Secure Shell.'],
    ['Which TCP ports does WinRM use?', '5985 and 5986', ['3389 and 3390', '22 and 23', '5900 and 5901'], 'HTTP and HTTPS listeners.'],
    ['Which remote access method is most commonly used by MSPs to manage many clients?', 'RMM', ['VNC', 'SPICE', 'Telnet'], 'Remote monitoring and management.'],
    ['Which Windows editions can act as an RDP host?', 'Pro and above', ['Home only', 'All editions', 'Only Server'], 'Home is client-only.'],
    ['A user receives a call from "Microsoft support" asking to install a screen-sharing tool. What is this?', 'A likely scam', ['Normal support procedure', 'An RMM deployment', 'A VPN requirement'], 'Verify identity; never let unsolicited callers in.'],
    ['VNC traffic between offices must be protected. What should you do?', 'Tunnel it through SSH or a VPN', ['Use Telnet', 'Open port 5900 to the Internet', 'Disable passwords'], 'Encrypt the path.'],
    ['Which command opens an interactive PowerShell session on a remote PC?', 'Enter-PSSession', ['Invoke-WebRequest', 'Test-NetConnection', 'Get-ExecutionPolicy'], 'One-to-one remoting.'],
    ['Which tool lets a remote user approve before a technician can see their screen?', 'Quick Assist / Remote Assistance', ['RDP with admin rights', 'WinRM', 'SSH'], 'Attended, consented support.'],
    ['What is the safest way to give technicians RDP access to servers?', 'Through a VPN or jump host with MFA', ['Port-forward 3389 on the firewall', 'Disable NLA', 'Share one admin password'], 'Never expose RDP directly.'],
    ['Which command copies a file to a Linux server over SSH?', 'scp', ['ftp', 'telnet', 'net use'], 'Secure copy.']
  ]);
  RK.extra(TR, '4.10', [
    ['An AI model favours one group because of its training data. What is this limitation?', 'Bias', ['Hallucination', 'Plagiarism', 'Latency'], 'Skewed data, skewed results.'],
    ['Which is the best practice for AI-generated scripts?', 'Review and test them before use', ['Run them in production immediately', 'Trust them because they compile', 'Share them without reading'], 'Verify output.'],
    ['Which concern is about whether personal data leaves the organization?', 'Data privacy', ['Accuracy', 'Bias', 'Integration'], 'Privacy of personal data.'],
    ['Where should a company define which AI tools staff may use?', 'In policy (appropriate use)', ['In the EULA', 'In the SDS', 'In the chain of custody'], 'Organizational policy.'],
    ['An AI cites a knowledge-base article that does not exist. What is this?', 'Hallucination', ['Bias', 'Data locality', 'Escalation'], 'Fabricated reference.'],
    ['What is a key advantage of private AI over public AI for a company?', 'Control over where its data goes', ['It never makes mistakes', 'It needs no policy', 'It is always free'], 'Data security.'],
    ['A student submits AI-written work as entirely their own. What is this?', 'Plagiarism', ['Application integration', 'Bias', 'Data retention'], 'Misrepresenting authorship.'],
    ['Which question checks the data source of an AI answer?', '"Which documents is this answer based on?"', ['"How fast can you answer?"', '"Can you use more emoji?"', '"What is your model name?"'], 'Traceability.'],
    ['A help-desk tool auto-categorizes tickets with AI. What is this?', 'Application integration', ['Hallucination', 'Plagiarism', 'Public AI'], 'AI embedded in an app.'],
    ['Why verify AI answers against official documentation?', 'Answers can be inaccurate or out of date', ['Documentation is always shorter', 'AI cannot read', 'It is required by the EULA'], 'Accuracy limitation.']
  ]);
  RK.extra(TR, '4.7', [
    ['Which is an open-ended question?', '"What happens when you try to print?"', ['"Is it plugged in?"', '"Did you restart?"', '"Is it Windows 11?"'], 'Invites detail.'],
    ['A customer is wrong about the cause of a problem. What should you do?', 'Explain politely without arguing', ['Tell them they are wrong', 'Ignore their comments', 'Argue until they agree'], 'Stay professional.']
  ]);
  RK.extra(TR, '4.5', [
    ['Which device protects against voltage spikes but not outages?', 'Surge suppressor', ['UPS', 'Generator', 'PDU'], 'Spikes only.'],
    ['Where do you find disposal instructions for a chemical cleaner?', 'Its safety data sheet (SDS)', ['The EULA', 'The AUP', 'The SLA'], 'SDS.'],
    ['What is the best way to clean dust from a PC indoors?', 'An ESD-safe vacuum or compressed air', ['A household vacuum on the motherboard', 'A wet cloth on the components', 'Blowing with your mouth'], 'Safe dust removal.']
  ]);
  RK.extra(TR, '4.2', [
    ['Which change type is approved quickly because service is down?', 'Emergency change', ['Standard change', 'Normal change', 'Frozen change'], 'Expedited.'],
    ['What is tested in a sandbox?', 'The change, before it reaches production', ['The backup tapes', 'The help-desk phone', 'The SLA'], 'Safe test environment.'],
    ['Who approves normal changes?', 'The change advisory board', ['The end user alone', 'Any technician', 'The vendor'], 'CAB.']
  ]);
  RK.extra(TR, '4.4', [
    ['What should you do before replacing a desktop power supply?', 'Unplug the PC and drain residual power', ['Wear an ESD strap clipped to the PSU internals', 'Leave it plugged in for grounding', 'Open the PSU to check capacitors'], 'Power off first.']
  ]);
})();
