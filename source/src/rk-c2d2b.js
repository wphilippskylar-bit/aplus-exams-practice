/* A+ Core 2 (220-1202) — Domain 2.0 Security — objectives 2.6 to 2.11 + domain wrap lab */
(function () {
  var RK = window.RK, P = RK.P, M = RK.M, O = RK.O, T = RK.T, TR = 'core2';
  function pro(t) { return '<div class="callout pro"><b class="k">On the job</b>' + t + '</div>'; }
  function trap(t) { return '<div class="callout trap"><b class="k">Exam trap</b>' + t + '</div>'; }

  // ===================== 2.6 SOHO malware removal =====================
  O('c2-mr-order', 'The malware removal procedure', 'Put the 10 steps in order',
    'CompTIA\'s malware removal procedure is tested in order. Arrange the steps.',
    [['Investigate and verify malware symptoms', 'Confirm it is malware, not a hardware or app fault.'],
     ['Quarantine the infected system', 'Disconnect from the network; stop the spread.'],
     ['Disable System Restore (Windows Home)', 'Restore points may contain the malware.'],
     ['Remediate: update anti-malware software', 'Current definitions first.'],
     ['Remediate: scan and remove (safe mode / preinstallation environment)', 'Malware cannot defend itself as well there.'],
     ['Reimage/reinstall if removal is not reliable', 'Last resort for deep infections.'],
     ['Schedule scans and run updates', 'Prevent reinfection.'],
     ['Enable System Restore and create a new restore point (Windows Home)', 'A clean restore point.'],
     ['Educate the end user', 'Stop it happening again.']],
    'Memory aid: Investigate, Quarantine, Disable restore, Remediate (update, scan), Schedule, Enable restore, Educate.');
  T('c2-mr-ps', 'Clean an infected Home PC', 'System Restore, Defender updates and offline scan',
    'A Windows 11 Home PC shows pop-ups and a fake antivirus. You have verified the symptoms and unplugged the network cable (quarantine). Elevated PowerShell on the PC.',
    { shell: 'ps', prompt: 'PS C:\\Windows\\system32>' },
    [{ t: 'Step 3: turn off System Restore on drive C:.', accept: [/^disable-computerrestore( -drive)? ["']?c:\\?["']?$/i], show: 'Disable-ComputerRestore -Drive "C:\\"', hint: 'Disable-ComputerRestore -Drive "C:\\"', out: '', why: 'Old restore points may hold the malware; removing them stops reinfection from a restore.' },
     { t: 'Step 4a: the PC is on an isolated update-only network. Update Defender\'s definitions.', accept: [/^update-mpsignature$/i], show: 'Update-MpSignature', hint: 'Update-Mp…', out: 'Definitions updated: 1.421.1907.0', why: 'Always update before scanning.' },
     { t: 'Step 5: run a full scan.', accept: [/^start-mpscan -scantype fullscan$/i], show: 'Start-MpScan -ScanType FullScan', hint: 'Start-MpScan -ScanType …Scan', out: 'Threats found: 2\n  PUA:Win32/SearchProtect   C:\\Users\\kim\\AppData\\Local\\SProtect\\sp.exe   Removed\n  Trojan:Win32/FakeAV.B     C:\\ProgramData\\WinSvcHost\\svhost.exe          Removed', ask: { q: 'How many threats were found?', accept: ['2', 'two'], why: 'A PUP and a fake-AV trojan. Note "svhost.exe" — malware often mimics real names like svchost.exe.' }, why: 'Full scan covers every file.' },
     { t: 'Some malware resists removal while Windows runs. Start a Microsoft Defender <b>offline</b> scan (it reboots into a clean environment).', accept: [/^start-mpwdoscan$/i], show: 'Start-MpWDOScan', hint: 'Start-Mp + WDO (Windows Defender Offline) + Scan', out: 'The computer will restart to run Microsoft Defender Offline scan.', why: 'Like scanning from a preinstallation environment: the malware is not running.' },
     { t: 'After the clean result, step 8: turn System Restore back on for C:.', accept: [/^enable-computerrestore( -drive)? ["']?c:\\?["']?$/i], show: 'Enable-ComputerRestore -Drive "C:\\"', hint: 'Enable-ComputerRestore -Drive "C:\\"', out: '', why: 'Re-enable protection on the clean system.' },
     { t: 'Create a new restore point named <b>Clean after malware</b>.', accept: [/^checkpoint-computer -description ["']clean after malware["']( -restorepointtype ["']?\w+["']?)?$/i], show: 'Checkpoint-Computer -Description "Clean after malware"', hint: 'Checkpoint-Computer -Description "…"', out: '', why: 'The first restore point is known clean.' }],
    'Then: schedule scans and updates, and spend five minutes educating the user about what they installed. Steps 3 and 8 apply to Windows Home in the objective; business PCs are usually reimaged.',
    ['System Restore cmdlets: Disable-ComputerRestore, Enable-ComputerRestore, Checkpoint-Computer.']);
  M('c2-mr-wrap', 'Which removal step?', 'Combined 2.6',
    'Pick the step for each action.', ['1 Investigate and verify', '2 Quarantine', '3 Disable System Restore', '4 Remediate (update + scan)', '5 Reimage/reinstall', '6 Schedule scans and updates', '7 Enable System Restore + restore point', '8 Educate the user'],
    [['Check Task Manager and the browser to confirm the pop-ups are malware', '1 Investigate and verify', 'Confirm first.'],
     ['Unplug the Ethernet cable and turn off Wi-Fi', '2 Quarantine', 'Stop the spread.'],
     ['Turn off System Protection on C:', '3 Disable System Restore', 'Windows Home step.'],
     ['Boot to safe mode and run the updated scanner', '4 Remediate (update + scan)', 'Remove it.'],
     ['A rootkit keeps coming back after every scan', '5 Reimage/reinstall', 'Last resort.'],
     ['Set a weekly full scan and automatic updates', '6 Schedule scans and updates', 'Prevention.'],
     ['Create a "clean" restore point', '7 Enable System Restore + restore point', 'After removal.'],
     ['Explain how the fake download got in and how to avoid it', '8 Educate the user', 'Last step.']],
    'If the question gives an action and asks what comes next, map it to its step number first.');

  RK.add({ track: TR, id: '2.6', dom: 2, short: 'Malware removal procedure', title: 'Given a scenario, implement procedures for basic small office/home office (SOHO) malware removal',
    goal: 'Follow CompTIA\'s malware removal steps in order and carry them out on a real PC.',
    kw: /\b(malware removal|quarantine|system restore|restore point|safe mode|preinstallation|winpe|remediat|reimage|educate the (end )?user|best practice procedure for malware)/,
    parts: [
      P('The malware removal steps', 'List the CompTIA malware removal procedure in order and say why each step is there.',
        `<ol><li><b>Investigate and verify</b> malware symptoms (pop-ups, redirects, slowness, fake alerts) — rule out other causes.</li>
<li><b>Quarantine</b> the infected system — disconnect from the network; do not share its USB drives.</li>
<li><b>Disable System Restore</b> in Windows Home — restore points can hold the malware.</li>
<li><b>Remediate</b> the infected system:
<ul><li>a. <b>Update anti-malware software</b>.</li>
<li>b. <b>Scan and use removal techniques</b> — <b>safe mode</b> or a <b>preinstallation environment</b> (boot-time/offline scan), where the malware is not running.</li></ul></li>
<li><b>Reimage/reinstall</b> if needed.</li>
<li><b>Schedule scans and run updates</b>.</li>
<li><b>Enable System Restore</b> and <b>create a restore point</b> in Windows Home.</li>
<li><b>Educate the end user</b>.</li></ol>` + pro('In a business, a reliably clean reimage is usually faster than hours of cleaning — and you never wonder whether something was missed.') + trap('Quarantine comes before disabling System Restore, and updating the scanner comes before scanning.'),
        [['What is the step right after verifying malware symptoms?', 'Quarantine the infected system', ['Disable System Restore', 'Educate the user', 'Reimage the PC'], 'Stop the spread first.'],
         ['What is the last step of the malware removal procedure?', 'Educate the end user', ['Enable System Restore', 'Schedule scans', 'Quarantine'], 'Prevent repeats.']],
        'c2-mr-order'),
      P('Carrying out removal', 'Disable and re-enable System Restore, update and scan, use offline/safe-mode scanning, and create a clean restore point.',
        `<p>The same steps, as a technician actually does them on a Windows Home PC:</p>
<table><tr><th>Step</th><th>GUI</th><th>PowerShell</th></tr>
<tr><td>Disable System Restore</td><td>System Properties → System Protection → Configure → Disable</td><td><code>Disable-ComputerRestore -Drive "C:\\"</code></td></tr>
<tr><td>Update anti-malware</td><td>Windows Security → Check for updates</td><td><code>Update-MpSignature</code></td></tr>
<tr><td>Scan</td><td>Full scan</td><td><code>Start-MpScan -ScanType FullScan</code></td></tr>
<tr><td>Scan with malware not running</td><td>Safe mode (msconfig → Boot → Safe boot) or <b>Microsoft Defender Offline</b></td><td><code>Start-MpWDOScan</code></td></tr>
<tr><td>Re-enable + restore point</td><td>System Protection → Create</td><td><code>Enable-ComputerRestore</code> · <code>Checkpoint-Computer</code></td></tr></table>
<p>A <b>preinstallation environment</b> (WinPE, a bootable rescue USB) runs scanners from outside the infected OS — the best option for rootkits and boot sector viruses.</p>` + pro('Check the browser too: malicious extensions, changed home page, changed search provider and a rogue proxy setting are where most "still getting pop-ups" tickets come from.') + trap('Safe mode loads minimal drivers and services, so most malware does not start — but it is still the infected OS. Offline/PE scans are stronger.'),
        [['Which removal technique scans the drive while the infected OS is not running?', 'A preinstallation environment / offline scan', ['Task Manager', 'Disk Cleanup', 'Fast startup'], 'Boot from clean media.'],
         ['Why create a new restore point after cleaning?', 'So any future restore returns to a known-clean state', ['To delete the malware', 'To update definitions', 'To quarantine the PC'], 'Clean checkpoint.']],
        'c2-mr-ps')
    ],
    wrap: { recap: ['1 Investigate and verify symptoms.', '2 Quarantine. 3 Disable System Restore (Home).', '4 Remediate: update anti-malware, then scan/remove in safe mode or a preinstallation environment.', '5 Reimage/reinstall if needed. 6 Schedule scans and updates.', '7 Enable System Restore and create a restore point (Home). 8 Educate the user.'], lab: 'c2-mr-wrap' }
  });

  // ===================== 2.7 Workstation hardening =====================
  M('c2-pwd', 'Password and end-user practices', 'Strong passwords and habits',
    'Pick the practice each item describes.', ['Length', 'Complexity / character types', 'Uniqueness', 'Expiration', 'Password manager', 'Screen saver lock', 'Log off when not in use', 'Secure critical hardware', 'Secure PII and passwords', 'BIOS/UEFI password'],
    [['A 16-character passphrase beats an 8-character jumble', 'Length', 'Length matters most.'],
     ['Mix upper, lower, numbers and symbols', 'Complexity / character types', 'Larger search space.'],
     ['Never reuse the same password on two sites', 'Uniqueness', 'One breach ≠ all accounts.'],
     ['Force a change after a set number of days', 'Expiration', 'Modern guidance prefers change-on-compromise.'],
     ['Generates and stores a different strong password for every site', 'Password manager', 'Makes uniqueness possible.'],
     ['Screen locks automatically after 5 minutes idle', 'Screen saver lock', 'Unattended PC protection.'],
     ['Sign out of shared workstations at the end of a shift', 'Log off when not in use', 'Ends the session.'],
     ['Cable-lock the laptop in the hotel room', 'Secure critical hardware', 'Physical protection.'],
     ['No passwords on sticky notes; no client data left on screens', 'Secure PII and passwords', 'Protect sensitive data.'],
     ['Stop anyone booting from USB or changing firmware settings', 'BIOS/UEFI password', 'Firmware protection.']],
    'Long + unique (via a password manager) + MFA beats any complexity rule.');
  T('c2-harden', 'Harden a shared workstation', 'net user, net accounts, sc',
    'Audit finding on the front-desk PC (a workgroup machine): guest enabled, no lockout, a contractor account with no end date, unneeded remote services. Elevated Command Prompt.',
    { shell: 'cmd', prompt: 'C:\\Windows\\System32>' },
    [{ t: 'Disable the Guest account.', accept: [/^net user guest \/active:no$/i], show: 'net user guest /active:no', hint: 'net user <account> /active:no', out: 'The command completed successfully.', why: 'Guest should always be disabled.' },
     { t: 'Lock accounts out after <b>5</b> failed sign-in attempts.', accept: [/^net accounts \/lockoutthreshold:5$/i], show: 'net accounts /lockoutthreshold:5', hint: 'net accounts /lockoutthreshold:<n>', out: 'The command completed successfully.', why: 'Stops brute-force guessing.' },
     { t: 'Set the contractor account <b>temp-jlee</b> to expire on <b>12/31/2026</b>.', accept: [/^net user temp-jlee \/expires:12\/31\/2026$/i], show: 'net user temp-jlee /expires:12/31/2026', hint: 'net user <account> /expires:<date>', out: 'The command completed successfully.', why: 'Account expiration: no forgotten access after the contract ends.' },
     { t: 'Restrict the front-desk account <b>frontdesk</b> to sign in only Monday–Friday, 7 AM–7 PM.', accept: [/^net user frontdesk \/times:(m-f|monday-friday),7(am)?-7pm$/i, /^net user frontdesk \/times:m-f,07:00-19:00$/i], show: 'net user frontdesk /times:M-F,7am-7pm', hint: 'net user <account> /times:M-F,7am-7pm', out: 'The command completed successfully.', why: 'Restrict log-in times.' },
     { t: 'Show the current settings of the built-in Administrator account.', accept: [/^net user administrator$/i], show: 'net user administrator', hint: 'net user <account>', out: 'User name                    Administrator\nAccount active               Yes\nPassword last set            3/2/2023 9:14:02 AM\nLocal Group Memberships      *Administrators', ask: { q: 'Is the built-in Administrator account active? (yes/no)', accept: ['yes'], why: 'It is enabled with a three-year-old password. Change the default admin password (or disable it and use a named admin account).' }, why: 'Change the default administrator account/password.' },
     { t: 'Disable the Remote Registry service so it cannot start.', accept: [/^sc config remoteregistry start= ?disabled$/i], show: 'sc config RemoteRegistry start= disabled', hint: 'sc config <service> start= disabled (space after =)', out: '[SC] ChangeServiceConfig SUCCESS', why: 'Disable unused services: smaller attack surface.' }],
    'Hardening checklist: guest off, lockout on, expiry dates, log-in hours, default admin changed, unused services off, AutoRun off, screen lock, BIOS password, disk encryption.',
    ['net user manages accounts; net accounts sets policy; sc config changes services.']);
  M('c2-harden-wrap', 'Hardening review', 'Combined 2.7',
    'Pick the control that fixes each finding.', ['Data-at-rest encryption', 'BIOS/UEFI password', 'Disable AutoRun', 'Disable unused services', 'Failed-attempt lockout', 'Account expiration', 'Restrict user permissions', 'Change default admin password', 'Timeout/screen lock', 'Password manager'],
    [['A stolen laptop\'s drive could be read in another PC', 'Data-at-rest encryption', 'BitLocker.'],
     ['Anyone can boot the PC from a USB stick', 'BIOS/UEFI password', 'Lock firmware settings.'],
     ['A USB stick launched a program automatically when inserted', 'Disable AutoRun', 'AutoRun/AutoPlay off.'],
     ['Telnet server service is running on a desktop', 'Disable unused services', 'Reduce attack surface.'],
     ['Unlimited password guesses are allowed', 'Failed-attempt lockout', 'Lock after N failures.'],
     ['A summer intern\'s account still works in December', 'Account expiration', 'Set end dates.'],
     ['Every user is a local administrator', 'Restrict user permissions', 'Least privilege.'],
     ['Admin password is still the vendor default', 'Change default admin password', 'Defaults are public.'],
     ['Unattended PCs stay unlocked at lunch', 'Timeout/screen lock', 'Automatic lock.'],
     ['Users reuse one password everywhere', 'Password manager', 'Unique passwords made easy.']],
    'Hardening is many small switches. Each one closes a door attackers really use.');

  RK.add({ track: TR, id: '2.7', dom: 2, short: 'Workstation hardening', title: 'Given a scenario, apply workstation security options and hardening techniques',
    goal: 'Harden a workstation: encryption, password rules, BIOS/UEFI passwords, end-user habits, account management, default admin, AutoRun and services.',
    kw: /\b(harden|password (polic|complex|length|expir|manager)|complexity|bios password|uefi password|screen ?saver|lock (the )?screen|log off|lockout|failed (log.?in )?attempt|log.?in times|expiration date|guest account|default admin|autorun|autoplay|unused services|data.at.rest)/,
    parts: [
      P('Encryption, passwords and end-user habits', 'Set password rules, BIOS/UEFI passwords and encryption, and teach end-user best practices.',
        `<ul><li><b>Data-at-rest encryption</b> — BitLocker/FileVault so a stolen drive is unreadable.</li>
<li><b>Password considerations</b>: <b>length</b> (the biggest factor — passphrases), <b>character types</b>, <b>uniqueness</b> (never reuse), <b>complexity</b>, <b>expiration</b> (current guidance: change when compromised rather than every 30 days, but policies vary).</li>
<li><b>BIOS/UEFI passwords</b> — stop people changing boot order, disabling Secure Boot or booting other media.</li></ul>
<p><b>End-user best practices:</b></p>
<ul><li>Use <b>screen saver locks</b> and <b>log off</b> when not in use (Win + L to lock).</li>
<li><b>Secure critical hardware</b> — cable-lock laptops, never leave them in cars.</li>
<li><b>Secure PII and passwords</b> — no sticky notes, no sensitive data on visible screens.</li>
<li><b>Use password managers</b> — they make long, unique passwords practical.</li></ul>` + pro('Teach Win + L on day one. It is the cheapest security control you will ever deploy.') + trap('A longer password beats a shorter complex one. On the exam, length is the strongest single factor.'),
        [['Which password factor adds the most strength?', 'Length', ['Expiration', 'Using a word you remember', 'Changing one character each month'], 'Each extra character multiplies the possibilities.'],
         ['What stops someone booting a PC from their own USB stick?', 'A BIOS/UEFI password with boot order locked', ['A screen saver', 'A password manager', 'Disabling Guest'], 'Firmware protection.']],
        'c2-pwd'),
      P('Account management and system hardening', 'Restrict permissions and log-in times, disable guest, set lockouts and expirations, change default admin, and disable AutoRun and unused services.',
        `<p><b>Account management:</b></p>
<ul><li><b>Restrict user permissions</b> — standard users, not local admins.</li>
<li><b>Restrict log-in times</b> — e.g. weekdays 7 AM–7 PM for shift accounts.</li>
<li><b>Disable guest account</b>.</li>
<li><b>Use failed attempts lockout</b> — lock after a few wrong passwords.</li>
<li><b>Use timeout/screen lock</b>.</li>
<li><b>Apply account expiration dates</b> — contractors and temps.</li></ul>
<p><b>System hardening:</b></p>
<ul><li><b>Change the default administrator\'s user account/password</b> (or disable it and use named admin accounts).</li>
<li><b>Disable AutoRun</b> (and AutoPlay) so inserted media cannot launch programs.</li>
<li><b>Disable unused services</b> — fewer services, fewer vulnerabilities.</li></ul>
<p>In a domain these are set once by Group Policy; on a standalone PC with <code>net user</code>, <code>net accounts</code>, <code>sc config</code> or Local Security Policy.</p>` + pro('Export the hardened settings as a baseline (Group Policy or a script) so every new PC matches it automatically.') + trap('Disabling AutoRun is about removable media launching code — not about startup programs.'),
        [['Which setting stops brute-force password guessing on a workstation?', 'Failed-attempt account lockout', ['Account expiration', 'AutoRun', 'Screen saver'], 'Lock after N failures.'],
         ['A contractor\'s account must stop working when the contract ends. Which control?', 'Account expiration date', ['Log-in time restriction', 'Guest account', 'Password complexity'], 'Automatic end date.']],
        'c2-harden')
    ],
    wrap: { recap: ['Encrypt data at rest; BIOS/UEFI password to lock boot settings.', 'Passwords: length first, character types, uniqueness, complexity, expiration policy.', 'Users: screen locks, log off, secure laptops, protect PII/passwords, use a password manager.', 'Accounts: least permissions, log-in times, guest disabled, lockout, timeout, expiration dates.', 'Change the default admin account/password; disable AutoRun; disable unused services.'], lab: 'c2-harden-wrap' }
  });

  // ===================== 2.8 Mobile security =====================
  M('c2-mobharden', 'Harden the phone', 'Locks, encryption, updates, locator, wipe',
    'Pick the control for each need.', ['Device encryption', 'Facial recognition / fingerprint lock', 'PIN or pattern lock', 'Configuration profile', 'OS updates', 'Application updates', 'Endpoint security / content filtering', 'Locator application', 'Remote wipe', 'Remote backup', 'Failed log-in restriction'],
    [['Data on a lost phone must be unreadable even if the storage is removed', 'Device encryption', 'Usually on once a passcode is set.'],
     ['Quick unlock that is "something you are"', 'Facial recognition / fingerprint lock', 'Biometric lock.'],
     ['Backup unlock method that is "something you know"', 'PIN or pattern lock', 'Swipe alone is not security.'],
     ['File/policy that sets Wi-Fi, VPN, email and passcode rules on the device', 'Configuration profile', 'Pushed by MDM.'],
     ['Patch the vulnerability Apple/Google announced this week', 'OS updates', 'Patch management.'],
     ['Update the banking app that had a security fix', 'Application updates', 'Apps need patches too.'],
     ['Block malicious and adult sites on company tablets', 'Endpoint security / content filtering', 'Mobile security software.'],
     ['Find where a lost phone was last seen', 'Locator application', 'Find My / Find My Device.'],
     ['Erase a stolen phone from the admin console', 'Remote wipe', 'Protect the data.'],
     ['Photos and contacts restored to the replacement phone', 'Remote backup', 'Cloud backup.'],
     ['Phone erases itself after 10 wrong passcodes', 'Failed log-in restriction', 'Stops guessing.']],
    'A screen lock turns on encryption; MDM enforces the rest.');
  M('c2-mdm', 'MDM, BYOD and corporate-owned', 'Mobile policies',
    'Pick the best answer.', ['MDM', 'BYOD', 'Corporate-owned', 'Profile security requirements', 'Selective (work-only) wipe'],
    [['Central console that enforces passcodes and pushes apps to every phone', 'MDM', 'Mobile device management.'],
     ['Employees use their own phones for work email', 'BYOD', 'Bring your own device.'],
     ['Company buys and fully controls the phones', 'Corporate-owned', 'Full management and full wipe.'],
     ['Minimum OS version, passcode length and encryption required before email syncs', 'Profile security requirements', 'Compliance rules.'],
     ['A BYOD employee leaves; remove company data but keep their personal photos', 'Selective (work-only) wipe', 'Respect personal data.']],
    'BYOD needs a work profile/container and selective wipe; corporate-owned can be fully managed and fully wiped.');
  M('c2-mob-wrap', 'Mobile security desk', 'Combined 2.8',
    'Pick the best action.', ['Remote wipe', 'Locator application', 'Enforce screen lock via MDM', 'Push OS update', 'Selective wipe', 'Failed log-in restriction', 'Remote backup'],
    [['An executive\'s phone was stolen and will not be recovered', 'Remote wipe', 'Erase it.'],
     ['A phone was left somewhere in the office building', 'Locator application', 'Find it first.'],
     ['Some staff phones have no passcode', 'Enforce screen lock via MDM', 'Policy, not request.'],
     ['Critical OS vulnerability being exploited', 'Push OS update', 'Patch management.'],
     ['BYOD user resigns', 'Selective wipe', 'Company data only.'],
     ['Thieves try to guess phone passcodes', 'Failed log-in restriction', 'Wipe after N tries.'],
     ['User drops their phone in a lake and wants their contacts back', 'Remote backup', 'Restore from cloud.']],
    'Lost: locate. Stolen: wipe. Leaving (BYOD): selective wipe.');

  RK.add({ track: TR, id: '2.8', dom: 2, short: 'Mobile device security', title: 'Given a scenario, apply common methods for securing mobile devices',
    goal: 'Harden phones and tablets, keep them patched, locate and wipe them, and apply MDM, BYOD and corporate-owned policies.',
    kw: /\b(mobile|phone|tablet|smartphone|screen lock|swipe|pattern|remote wipe|locator|find my|configuration profile|\bmdm\b|byod|corporate.owned|failed (log.?in|unlock)|remote backup)/,
    parts: [
      P('Hardening and protecting mobile devices', 'Apply encryption, screen locks, profiles, updates, endpoint software, locator apps, remote wipe and backup.',
        `<ul><li><b>Device encryption</b> — on modern iOS/Android, turned on with a passcode.</li>
<li><b>Screen locks</b>: <b>facial recognition</b>, <b>fingerprint</b>, <b>PIN</b>, <b>pattern</b>, <b>swipe</b> (swipe = no security at all).</li>
<li><b>Configuration profiles</b> — settings packages (Wi-Fi, VPN, email, restrictions) installed by MDM.</li>
<li><b>Patch management</b> — <b>OS updates</b> and <b>application updates</b>.</li>
<li><b>Endpoint security software</b> — antivirus, anti-malware, <b>content filtering</b>.</li>
<li><b>Locator applications</b> — Find My (Apple), Find My Device (Google).</li>
<li><b>Remote wipes</b> — erase a lost or stolen device.</li>
<li><b>Remote backup applications</b> — iCloud/Google backups for restore.</li>
<li><b>Failed log-in attempts restrictions</b> — delays, then lockout or wipe after N failures.</li></ul>` + pro('Before you wipe, confirm the device is truly lost and the backup is recent. A wipe cannot be undone.') + trap('A swipe lock is not a security control. The exam wants PIN, pattern or biometric.'),
        [['Which screen lock provides no real security?', 'Swipe', ['PIN', 'Fingerprint', 'Pattern'], 'Anyone can swipe.'],
         ['A phone is stolen and contains client email. What is the priority action?', 'Remote wipe', ['Locator app only', 'Change the wallpaper', 'Update apps'], 'Protect the data.']],
        'c2-mobharden'),
      P('Policies: MDM, BYOD and corporate-owned', 'Apply MDM, choose BYOD or corporate-owned, and enforce profile security requirements.',
        `<ul><li><b>MDM</b> (mobile device management) — enrolls devices, pushes configuration profiles and apps, enforces passcodes/encryption, reports compliance, locks and wipes.</li>
<li><b>BYOD vs corporate-owned</b>:
<ul><li><b>BYOD</b> — the user owns the device. Company data goes in a work profile/container; IT can wipe only that (<b>selective wipe</b>). Privacy matters.</li>
<li><b>Corporate-owned</b> — the company owns it; full management and full wipe are fine.</li></ul></li>
<li><b>Profile security requirements</b> — minimum OS version, passcode length, encryption, no jailbreak/root — checked before the device gets email or apps. Non-compliant devices are blocked.</li></ul>` + pro('Write the BYOD policy so users agree to it at enrollment: what IT can see, what IT can wipe, and what IT cannot touch.') + trap('Full-wiping a BYOD phone erases the employee\'s personal data. Selective wipe is the answer for BYOD.'),
        [['Which removes only company data from an employee-owned phone?', 'Selective wipe', ['Full remote wipe', 'Locator app', 'Factory reset by the user'], 'Respects personal data.'],
         ['Which system enforces passcodes and pushes apps to company phones?', 'MDM', ['DLP', 'RADIUS', 'SSO'], 'Mobile device management.']],
        'c2-mdm')
    ],
    wrap: { recap: ['Encryption + screen locks (biometric, PIN, pattern — not swipe) + configuration profiles.', 'Patch OS and apps; endpoint security with content filtering.', 'Locator apps find; remote wipe erases; remote backup restores.', 'Failed log-in restrictions stop guessing.', 'MDM enforces policy. BYOD = work profile + selective wipe; corporate-owned = full control.', 'Profile security requirements block non-compliant devices.'], lab: 'c2-mob-wrap' }
  });

  // ===================== 2.9 Data destruction =====================
  M('c2-destroy', 'Destroy or reuse?', 'Physical destruction vs wiping',
    'Pick the best method for each drive.', ['Shredding', 'Drilling', 'Degaussing', 'Incineration', 'Erasing/wiping', 'Standard format', 'Third-party vendor + certificate'],
    [['Hundreds of HDDs and SSDs from a bank; nothing may survive', 'Shredding', 'Particles too small to recover.'],
     ['Quick in-house way to make a few old HDDs unusable', 'Drilling', 'Holes through the platters.'],
     ['Erase magnetic HDDs and tapes with a strong magnetic field', 'Degaussing', 'Does not work on SSDs.'],
     ['Burn media to ash', 'Incineration', 'Total destruction.'],
     ['Donate PCs to a school with the drives reusable but clean', 'Erasing/wiping', 'Overwrite/secure erase.'],
     ['Reuse a drive internally for non-sensitive data', 'Standard format', 'Data may still be recoverable.'],
     ['No time or tools in-house; auditors need proof', 'Third-party vendor + certificate', 'Certificate of destruction.']],
    'Reuse → wipe. Never reuse → physically destroy. Prove it → certificate of destruction.');
  M('c2-wipe', 'Formats and wipes', 'Standard vs low-level format, SSDs, compliance',
    'Pick the true statement for each item.', ['Standard format', 'Low-level format', 'Secure erase / wipe', 'Degaussing', 'Certificate of destruction', 'Regulatory requirement'],
    [['Writes a new file table; old data is often recoverable', 'Standard format', 'Not sanitization.'],
     ['Factory-level re-marking of sectors; today usually means a full zero-fill tool', 'Low-level format', 'Done with vendor tools.'],
     ['Overwrites every sector or uses the drive\'s built-in sanitize command', 'Secure erase / wipe', 'Makes the drive safely reusable.'],
     ['Has no effect on an SSD', 'Degaussing', 'SSDs are not magnetic.'],
     ['Document from the vendor listing each serial number destroyed', 'Certificate of destruction', 'Audit proof.'],
     ['Healthcare records must be destroyed by approved methods', 'Regulatory requirement', 'HIPAA and similar.']],
    'For SSDs: use the manufacturer\'s secure erase / sanitize, or shred.');
  M('c2-destroy-wrap', 'Disposal decisions', 'Combined 2.9',
    'Pick the method.', ['Shredding', 'Degaussing', 'Erasing/wiping', 'Drilling', 'Third-party vendor + certificate', 'Recycle per environmental rules'],
    [['SSDs with patient data, never to be reused', 'Shredding', 'Works for SSDs.'],
     ['Old backup tapes', 'Degaussing', 'Magnetic media.'],
     ['Laptops going to an employee purchase program', 'Erasing/wiping', 'Reusable and clean.'],
     ['Three failed HDDs, need to be unusable today', 'Drilling', 'Quick physical destruction.'],
     ['Auditor demands proof for 400 drives', 'Third-party vendor + certificate', 'Documented chain.'],
     ['Monitors and chassis after the drives are removed', 'Recycle per environmental rules', 'E-waste regulations.']],
    'Match method to media (magnetic vs flash) and to reuse plans.');

  RK.add({ track: TR, id: '2.9', dom: 2, short: 'Data destruction & disposal', title: 'Compare and contrast common data destruction and disposal methods',
    goal: 'Choose physical destruction, wiping or outsourcing for each drive, and meet regulatory and environmental rules.',
    kw: /\b(destruction|dispos|shred|drill|degauss|incinerat|wip(e|ing)|low.level format|standard format|certificate of (destruction|recycling)|sanitiz|secure erase)/,
    parts: [
      P('Physical destruction', 'Choose drilling, shredding, degaussing or incineration.',
        `<p>When a drive will <b>never be reused</b>, destroy it:</p>
<ul><li><b>Shredding</b> — industrial shredder grinds drives (HDD and SSD) into small pieces. The strongest method.</li>
<li><b>Drilling</b> — holes through HDD platters (or SSD memory chips). Quick in-house; small risk of partial recovery.</li>
<li><b>Degaussing</b> — powerful magnet erases <b>magnetic</b> media (HDDs, tapes); the drive is usually ruined. <b>No effect on SSDs or flash</b>.</li>
<li><b>Incineration</b> — burning media completely.</li></ul>
<p>Paper with sensitive information: cross-cut shredding or pulping.</p>` + pro('Remove and log the drive\'s serial number before it is destroyed. The log is what proves which drives were handled.') + trap('Degaussing does nothing to an SSD. For SSDs choose shredding or a secure erase.'),
        [['Which method does NOT work on solid-state drives?', 'Degaussing', ['Shredding', 'Incineration', 'Drilling'], 'SSDs are not magnetic.'],
         ['Which is the most thorough physical method for both HDDs and SSDs?', 'Shredding', ['Standard format', 'Degaussing', 'Quick erase'], 'Grinds to particles.']],
        'c2-destroy'),
      P('Recycling, reuse and outsourcing', 'Wipe drives for reuse, know why formatting is not enough, and use certified vendors.',
        `<p><b>Recycling or repurposing</b> (the drive will be used again):</p>
<ul><li><b>Erasing/wiping</b> — overwrite every sector, or use the drive\'s built-in secure erase/sanitize (the right choice for SSDs).</li>
<li><b>Low-level formatting</b> — originally done at the factory; today means vendor tools that zero the whole drive.</li>
<li><b>Standard formatting</b> — only writes a new file table. Data is usually recoverable with free tools. Not sanitization.</li></ul>
<p><b>Outsourcing concepts:</b></p>
<ul><li><b>Third-party vendor</b> — specialist destruction/recycling company.</li>
<li><b>Certification of destruction/recycling</b> — a document listing what was destroyed, how and when. Keep it for audits.</li></ul>
<p><b>Regulatory and environmental requirements</b> — some data (health, finance, government) has mandated destruction methods; e-waste must be recycled under environmental law.</p>` + pro('Wipe, then verify: spot-check a wiped drive with a recovery tool before it leaves the building.') + trap('"Format the drive" is never the right answer for sensitive data being disposed of.'),
        [['A company donates old PCs. How should the drives be prepared?', 'Securely wiped/erased', ['Standard formatted', 'Degaussed and donated', 'Left as they are'], 'Reusable and clean.'],
         ['What proves an outside vendor destroyed specific drives?', 'A certificate of destruction', ['An EULA', 'A purchase order', 'An SDS'], 'Audit evidence.']],
        'c2-wipe')
    ],
    wrap: { recap: ['Physical: shredding (strongest), drilling, degaussing (magnetic only — not SSDs), incineration.', 'Reuse: erase/wipe or secure erase; low-level format via vendor tools.', 'Standard format leaves data recoverable — not sanitization.', 'Outsourcing: third-party vendor + certificate of destruction/recycling.', 'Follow regulatory and environmental requirements.'], lab: 'c2-destroy-wrap' }
  });

  // ===================== 2.10 SOHO network security =====================
  M('c2-router', 'Secure the small-office router', 'Router and firewall settings',
    'Pick the setting for each need.', ['Change default passwords', 'Firmware updates', 'IP filtering', 'Content filtering', 'Physical placement', 'Disable UPnP', 'Screened subnet', 'Secure management access', 'Disable unused ports', 'Port forwarding'],
    [['The admin login is still admin/admin', 'Change default passwords', 'Defaults are published online.'],
     ['The router vendor released a patch for a remote-takeover flaw', 'Firmware updates', 'Patch the router.'],
     ['Block traffic to and from a known-bad address range', 'IP filtering', 'Allow/deny by address.'],
     ['Block gambling and adult websites for everyone', 'Content filtering', 'Category filtering.'],
     ['Router sits on a reception desk anyone can reach', 'Physical placement', 'Locked closet.'],
     ['Stop apps on the LAN opening ports in the firewall by themselves', 'Disable UPnP', 'Universal Plug and Play.'],
     ['The public web server should be reachable but isolated from the office LAN', 'Screened subnet', 'DMZ.'],
     ['Allow router admin only over HTTPS from the inside, never from the Internet', 'Secure management access', 'No remote WAN admin.'],
     ['Unused switch ports in the lobby are live', 'Disable unused ports', 'Attack surface.'],
     ['Send inbound TCP 443 from the Internet to the internal web server', 'Port forwarding', 'Port mapping.']],
    'First three things on any SOHO router: change the default password, update the firmware, turn off remote admin and UPnP.');
  M('c2-sohowifi', 'Secure the Wi-Fi', 'SSID, encryption, guest access',
    'Pick the best setting.', ['Change the SSID', 'Disable SSID broadcast', 'WPA3 encryption', 'Guest network', 'Lower transmit power / AP placement'],
    [['The network is called "NETGEAR42" and reveals the router model', 'Change the SSID', 'Do not advertise the make or the company.'],
     ['Hide the network name from casual scans (minor benefit)', 'Disable SSID broadcast', 'Not real security.'],
     ['Protect traffic and prevent password cracking', 'WPA3 encryption', 'Strongest option.'],
     ['Visitors need Internet but must not see office PCs', 'Guest network', 'Isolated.'],
     ['The signal reaches the parking lot across the street', 'Lower transmit power / AP placement', 'Limit coverage.']],
    'Encryption and a strong passphrase protect the network; hiding the SSID only hides the name.');
  M('c2-soho-wrap', 'SOHO security review', 'Combined 2.10',
    'Pick the best fix.', ['Change default passwords', 'Firmware updates', 'Disable UPnP', 'Guest network', 'WPA3 encryption', 'Port forwarding', 'Screened subnet', 'Content filtering'],
    [['Router admin password found on the vendor website', 'Change default passwords', 'First step.'],
     ['Router has a published remote-takeover vulnerability', 'Firmware updates', 'Patch.'],
     ['A game console keeps opening inbound ports automatically', 'Disable UPnP', 'Stop automatic openings.'],
     ['Clients in the waiting room want Wi-Fi', 'Guest network', 'Isolation.'],
     ['Wi-Fi still uses WEP', 'WPA3 encryption', 'Replace broken encryption.'],
     ['Security camera recorder must be reachable on one port from the Internet', 'Port forwarding', 'Narrow mapping (better: VPN).'],
     ['Hosting a public server in the office', 'Screened subnet', 'Isolate it.'],
     ['Block malicious websites for all devices', 'Content filtering', 'DNS/category filtering.']],
    'Default password, firmware, UPnP off, WPA3, guest isolation, minimal port forwards — that is a secured SOHO network.');

  RK.add({ track: TR, id: '2.10', dom: 2, short: 'SOHO network security', title: 'Given a scenario, apply security settings on SOHO wireless and wired networks',
    goal: 'Secure a small-office router, Wi-Fi and firewall: defaults, firmware, filtering, UPnP, screened subnet, SSID, encryption, guest access and port forwarding.',
    kw: /\b(soho|router|default password|firmware|ip filter|content filter|upnp|screened subnet|\bdmz\b|ssid|guest (network|access)|port forward|port mapping|unused ports|remote management|wireless settings)/,
    parts: [
      P('Router settings', 'Secure a SOHO router: defaults, firmware, filtering, placement, UPnP, screened subnet and management access.',
        `<ul><li><b>Change default passwords</b> — admin credentials for every model are published online.</li>
<li><b>Firmware updates</b> — routers have vulnerabilities too; update and enable automatic updates if offered.</li>
<li><b>IP filtering</b> — allow/deny traffic by source or destination address.</li>
<li><b>Content filtering</b> — block categories or known-malicious sites (often DNS-based).</li>
<li><b>Physical placement / secure locations</b> — a reachable router can be reset to defaults with a paperclip.</li>
<li><b>Universal Plug and Play (UPnP)</b> — lets devices open firewall ports automatically. Disable it.</li>
<li><b>Screened subnet</b> — isolated network segment for anything exposed to the Internet.</li>
<li><b>Configure secure management access</b> — admin over HTTPS from the LAN only; disable remote (WAN) management.</li></ul>` + pro('Write the new admin password in the client\'s password manager or documentation. A secured router no one can log into is the next ticket.') + trap('Many home routers call it "DMZ host", which simply forwards everything to one PC — that is not a real screened subnet.'),
        [['Which router feature lets devices open firewall ports automatically and should be disabled?', 'UPnP', ['Content filtering', 'IP filtering', 'WPA3'], 'Universal Plug and Play.'],
         ['What is the first thing to change on a new SOHO router?', 'The default admin password', ['The wallpaper', 'The channel width', 'The DHCP lease time'], 'Defaults are public.']],
        'c2-router'),
      P('Wireless and firewall settings', 'Configure SSID, encryption and guest access, disable unused ports, and use port forwarding safely.',
        `<p><b>Wireless specific:</b></p>
<ul><li><b>Change the SSID</b> — remove the vendor/model name; do not use the company or address.</li>
<li><b>Disable SSID broadcast</b> — hides the name from casual lists. It does <i>not</i> stop attackers, who see it in traffic.</li>
<li><b>Encryption settings</b> — WPA3 (or WPA2-AES) with a long passphrase.</li>
<li><b>Configure guest access</b> — separate network, Internet only, client isolation.</li></ul>
<p><b>Firewall settings:</b></p>
<ul><li><b>Disable unused ports</b> — physical switch ports and open service ports.</li>
<li><b>Port forwarding/mapping</b> — sends a specific inbound port to one internal device. Forward only what is necessary; prefer a VPN for remote access.</li></ul>` + pro('Forwarding RDP (3389) or a camera recorder straight to the Internet is how many small offices get breached. Offer a VPN instead.') + trap('Disabling SSID broadcast is listed, but it is a weak control. The strongest wireless choice is WPA3.'),
        [['Which wireless setting gives the real protection?', 'WPA3 encryption with a strong passphrase', ['Disabling SSID broadcast', 'Changing the SSID', 'Lowering the channel'], 'Encryption protects traffic.'],
         ['Inbound TCP 443 must reach one internal web server. What do you configure?', 'Port forwarding to that server', ['UPnP', 'Disable SSID broadcast', 'A guest network'], 'Port mapping.']],
        'c2-sohowifi')
    ],
    wrap: { recap: ['Change default passwords; update firmware; secure physical placement.', 'IP filtering and content filtering; disable UPnP.', 'Screened subnet for exposed servers; admin access from inside only, over HTTPS.', 'Change the SSID; hiding it is weak; WPA3 is the real control; guest network for visitors.', 'Disable unused ports; forward only necessary ports (prefer VPN).'], lab: 'c2-soho-wrap' }
  });

  // ===================== 2.11 Browser security =====================
  T('c2-hash', 'Verify a download before installing', 'Get-FileHash',
    'You downloaded <b>7z2409-x64.exe</b> from the vendor. The vendor\'s page lists its SHA-256 hash. Check it before anyone installs it.',
    { shell: 'ps', prompt: 'PS C:\\Users\\tech\\Downloads>' },
    [{ t: 'Calculate the SHA-256 hash of the installer.', accept: [/^get-filehash (\.\\)?7z2409-x64\.exe( -algorithm sha256)?$/i, /^get-filehash -path (\.\\)?7z2409-x64\.exe( -algorithm sha256)?$/i], show: 'Get-FileHash .\\7z2409-x64.exe -Algorithm SHA256', hint: 'Get-FileHash <file> -Algorithm SHA256', out: 'Algorithm       Hash                                                                   Path\n---------       ----                                                                   ----\nSHA256          A3F1E0B7C9...D41E                                                     C:\\Users\\tech\\Downloads\\7z2409-x64.exe', ask: { q: 'The vendor lists A3F1E0B7C9...D41E. Do they match? (yes/no)', accept: ['yes'], why: 'Matching hash = the file is exactly what the vendor published: not corrupted or tampered with.' }, why: 'A hash is a fingerprint of the file.' },
     { t: 'A coworker sends <b>setup.exe</b> from a file-sharing site. Hash it too.', accept: [/^get-filehash (\.\\)?setup\.exe( -algorithm sha256)?$/i, /^get-filehash -path (\.\\)?setup\.exe( -algorithm sha256)?$/i], show: 'Get-FileHash .\\setup.exe', hint: 'Same cmdlet, other file.', out: 'Algorithm       Hash                       Path\n---------       ----                       ----\nSHA256          77C0A29E...0B5F            C:\\Users\\tech\\Downloads\\setup.exe', ask: { q: 'The vendor\'s official hash is A3F1E0B7C9...D41E. Is setup.exe safe to run? (yes/no)', accept: ['no'], why: 'Different hash = different file. From an untrusted source, treat it as malicious: delete it and use the vendor download.' }, why: 'Untrusted source + mismatched hash = do not run.' },
     { t: 'Delete the untrusted file.', accept: [/^remove-item (\.\\)?setup\.exe$/i, /^(del|rm) (\.\\)?setup\.exe$/i], show: 'Remove-Item .\\setup.exe', hint: 'Remove-Item <file>', out: '', why: 'Install only from trusted sources, verified by hash.' }],
    'Trusted source + matching hash = safe to install. Anything else: do not run it.',
    ['Get-FileHash defaults to SHA256.']);
  M('c2-browser', 'Browser settings', 'Settings and feature management',
    'Pick the browser setting or feature for each need.', ['Pop-up blocker', 'Clear browsing data', 'Clear cache', 'Private-browsing mode', 'Sign-in / browser data sync', 'Ad blocker', 'Proxy', 'Secure DNS', 'Password manager', 'Disable an extension/plug-in', 'Check the certificate'],
    [['Stop new windows opening when a site loads', 'Pop-up blocker', 'Built in.'],
     ['Remove history, cookies and saved form data from a shared PC', 'Clear browsing data', 'Privacy cleanup.'],
     ['A site keeps showing an old version after an update', 'Clear cache', 'Forces fresh content.'],
     ['Browse without saving history or cookies on a hotel kiosk', 'Private-browsing mode', 'Incognito/InPrivate.'],
     ['Bookmarks and passwords should follow the user to their new laptop', 'Sign-in / browser data sync', 'Account sync.'],
     ['Block malvertising and tracking scripts', 'Ad blocker', 'Extension or built-in.'],
     ['Company requires all web traffic to go through its filter', 'Proxy', 'Browser/OS proxy setting.'],
     ['Encrypt DNS lookups from the browser (DoH)', 'Secure DNS', 'DNS over HTTPS.'],
     ['Store unique strong passwords and autofill them only on the real site', 'Password manager', 'Built-in or dedicated.'],
     ['A "coupon helper" add-on started injecting ads', 'Disable an extension/plug-in', 'Feature management.'],
     ['Make sure the bank site is genuine before typing a password', 'Check the certificate', 'Padlock, valid cert, correct name.']],
    'Most "my browser is acting weird" tickets: a bad extension, a changed proxy, or a stale cache.');
  M('c2-browser-wrap', 'Browser help desk', 'Combined 2.11',
    'Pick the best fix.', ['Install from the vendor and verify the hash', 'Update the browser', 'Remove the untrusted extension', 'Clear cache', 'Check the certificate warning', 'Use a password manager', 'Reset the proxy setting', 'Enable pop-up blocker'],
    [['User wants a "faster Chrome" from a download site', 'Install from the vendor and verify the hash', 'Trusted sources only.'],
     ['Browser is three versions behind', 'Update the browser', 'Patching.'],
     ['Searches redirect to an unknown search engine', 'Remove the untrusted extension', 'Hijacker extension.'],
     ['Web app shows yesterday\'s layout after an update', 'Clear cache', 'Stale files.'],
     ['"Your connection is not private" on the intranet login', 'Check the certificate warning', 'Expired/untrusted cert or interception.'],
     ['User writes passwords in a notebook', 'Use a password manager', 'Secure storage.'],
     ['No sites load, but other apps reach the Internet; a proxy you do not recognize is set', 'Reset the proxy setting', 'Malware or misconfiguration.'],
     ['Pages open endless new windows', 'Enable pop-up blocker', 'Block pop-ups.']],
    'Download safely, keep it patched, control extensions, read certificate warnings.');

  RK.add({ track: TR, id: '2.11', dom: 2, short: 'Browser security', title: 'Given a scenario, configure relevant security settings in a browser',
    goal: 'Install browsers safely, keep them patched, control extensions, and use certificates, password managers and privacy settings correctly.',
    kw: /\b(browser|extension|plug.?in|pop.?up|cache|cookie|private (browsing|mode)|incognito|inprivate|certificate warning|password manager|ad blocker|secure dns|\bdoh\b|hash(ing)?|trusted source)/,
    parts: [
      P('Installing and patching browsers safely', 'Download browsers from trusted sources, verify hashes, and keep browsers patched.',
        `<ul><li><b>Trusted sources</b> — the vendor\'s own website or an official app store/company software portal.</li>
<li><b>Hashing</b> — vendors publish a hash (e.g. SHA-256) of the installer. Hash your download (<code>Get-FileHash</code>, <code>sha256sum</code>) and compare. A match proves the file was not corrupted or altered.</li>
<li><b>Untrusted sources</b> — download sites, file-sharing links, pop-up "update" prompts. Common source of trojans and bundled PUPs.</li>
<li><b>Browser patching</b> — browsers are the most attacked app on a PC. Keep automatic updates on and restart the browser so updates apply.</li></ul>` + pro('"Your browser needs an update — click here" pop-ups are fake. Real browsers update themselves through their own menu.') + trap('A matching hash proves integrity (unchanged), not that the vendor is trustworthy. Use both: trusted source and hash.'),
        [['How do you confirm a downloaded installer was not altered?', 'Compare its hash with the vendor\'s published hash', ['Check its file size only', 'Rename it', 'Scan the wallpaper'], 'Hashes are fingerprints.'],
         ['Where should a browser installer come from?', 'The vendor\'s official site or company portal', ['A random download mirror', 'An email attachment', 'A pop-up ad'], 'Trusted sources.']],
        'c2-hash'),
      P('Extensions, certificates and browser settings', 'Manage extensions and plug-ins, use password managers and secure connections, and configure privacy and network settings.',
        `<ul><li><b>Extensions and plug-ins</b> — install only from trusted sources (official store, approved list). Remove anything unknown. <b>Browser feature management</b>: enable/disable plug-ins, extensions and features centrally (Group Policy for Chrome/Edge).</li>
<li><b>Password managers</b> — built-in or dedicated; autofill only on the genuine site, which also defeats look-alike phishing domains.</li>
<li><b>Secure connections/sites — valid certificates</b> — HTTPS with a certificate issued to that exact name, by a trusted CA, not expired. Read warnings; do not click through on sensitive sites.</li></ul>
<p><b>Settings:</b> <b>pop-up blocker</b>; <b>clearing browsing data</b>; <b>clearing cache</b>; <b>private-browsing mode</b>; <b>sign-in/browser data synchronization</b>; <b>ad blockers</b>; <b>proxy</b>; <b>secure DNS</b> (DNS over HTTPS).</p>` + pro('For "the website looks broken" try a private window first: it runs without cached files and most extensions, so it tells you in seconds whether the cache or an extension is the cause.') + trap('Private browsing hides history on that device. It does not hide you from the network, the employer or the website.'),
        [['Search results suddenly redirect to an unknown site. What is the most likely cause?', 'A malicious browser extension', ['An expired certificate', 'Secure DNS', 'The pop-up blocker'], 'Browser hijacker.'],
         ['What does private-browsing mode do?', 'Avoids saving history and cookies on the device', ['Hides your traffic from the network', 'Encrypts your hard drive', 'Blocks all ads'], 'Local privacy only.']],
        'c2-browser')
    ],
    wrap: { recap: ['Download from trusted sources; verify with a hash; avoid untrusted sources.', 'Keep browsers patched; restart to apply updates.', 'Install extensions/plug-ins only from trusted sources; manage features centrally.', 'Use password managers; trust only valid certificates for the exact site.', 'Settings: pop-up blocker, clear browsing data and cache, private browsing, sync, ad blockers, proxy, secure DNS.'], lab: 'c2-browser-wrap' }
  });

  // ===================== Domain 2 combined terminal lab =====================
  T('c2-d2-wrap', 'Domain 2 shift: secure a new hire\'s laptop', 'AD, Defender, firewall, BitLocker, hardening',
    'New hire <b>dpatel</b> joins Finance today on laptop <b>LT-FIN-031</b> (already domain-joined). Get it secure before handover. Elevated PowerShell on the laptop, with the AD module. No hints in the tasks.',
    { shell: 'ps', prompt: 'PS C:\\Windows\\system32>' },
    [{ t: '<b>2.2</b> — Move the user dpatel into <b>OU=Finance,DC=corp,DC=local</b>.', accept: [/^get-aduser dpatel \| move-adobject -targetpath ["']?ou=finance,dc=corp,dc=local["']?$/i], show: 'Get-ADUser dpatel | Move-ADObject -TargetPath "OU=Finance,DC=corp,DC=local"', hint: '2.2 — Get-ADUser … | Move-ADObject -TargetPath …', out: '', why: '2.2 — Finance GPOs now apply.' },
     { t: '<b>2.2</b> — Add dpatel to the group <b>Finance-RW</b>.', accept: [/^add-adgroupmember (-identity )?["']?finance-rw["']? (-members )?dpatel$/i], show: 'Add-ADGroupMember -Identity Finance-RW -Members dpatel', hint: '2.2 — Add-ADGroupMember', out: '', why: '2.2 — access through groups.' },
     { t: '<b>2.2</b> — Check Defender status on the laptop.', accept: [/^get-mpcomputerstatus$/i], show: 'Get-MpComputerStatus', hint: '2.2 — Get-MpComputerStatus', out: 'AntivirusEnabled              : True\nRealTimeProtectionEnabled     : True\nAntivirusSignatureAge         : 0', why: '2.2 — protected and current.' },
     { t: '<b>2.2</b> — Confirm the firewall is on for every profile.', accept: [/^get-netfirewallprofile( \| (format-table|ft) name,\s?enabled)?$/i], show: 'Get-NetFirewallProfile', hint: '2.2 — Get-NetFirewallProfile', out: 'Name : Domain   Enabled : True\nName : Private  Enabled : True\nName : Public   Enabled : True', why: '2.2 — all three on.' },
     { t: '<b>2.2 / 2.7</b> — Show BitLocker status for all volumes.', accept: [/^manage-bde -status$/i, /^get-bitlockervolume$/i], show: 'manage-bde -status', hint: '2.2 — manage-bde', out: 'Volume C: [OS]\n    Conversion Status:    Fully Encrypted\n    Protection Status:    Protection On\n    Key Protectors:       TPM, Numerical Password', ask: { q: 'Is C: protected? (yes/no)', accept: ['yes'], why: 'Data at rest is encrypted; recovery key escrowed.' }, why: '2.7 — data-at-rest encryption.' },
     { t: '<b>2.7</b> — Make sure the local Guest account is disabled.', accept: [/^disable-localuser( -name)? guest$/i, /^net user guest \/active:no$/i], show: 'Disable-LocalUser -Name Guest', hint: '2.7 — Disable-LocalUser (or net user)', out: '', why: '2.7 — guest disabled.' },
     { t: '<b>2.6 / 2.4</b> — Run a quick scan before handover.', accept: [/^start-mpscan( -scantype quickscan)?$/i], show: 'Start-MpScan -ScanType QuickScan', hint: '2.4 — Start-MpScan', out: 'Scan completed. No threats found.', why: 'Clean device, documented.' },
     { t: '<b>2.2</b> — After dpatel signs in, prove her Finance policies applied (summary).', accept: [/^gpresult \/r( \/scope:user)?$/i], show: 'gpresult /r', hint: '2.2 — gpresult', out: 'USER SETTINGS\n    CN=Divya Patel,OU=Finance,DC=corp,DC=local\n    Applied Group Policy Objects\n        Finance Folder Redirection\n        Finance Screen Lock 5min\n        Default Domain Policy', why: 'OU move worked: folder redirection and a 5-minute screen lock are applied.' }],
    'Domain 2 in one handover: right OU and groups (AD), antivirus and firewall on, disk encrypted, guest disabled, scanned clean, policy verified.',
    ['Each task names its objective. Flip back to it if you are stuck.']);

  // ---------- extra test questions where the old bank is thin ----------
  RK.extra(TR, '2.3', [
    ['Which wireless option should never be chosen for security?', 'TKIP', ['AES', 'WPA3', 'SAE'], 'Deprecated.'],
    ['Which component of WPA3-Personal resists offline password cracking?', 'SAE', ['TKIP', 'WEP', 'PSK in WPA2'], 'Simultaneous Authentication of Equals.'],
    ['Which AAA protocol uses TCP port 49?', 'TACACS+', ['RADIUS', 'Kerberos', 'LDAP'], 'Device administration.'],
    ['A domain login fails only on one PC whose clock is 10 minutes off. Which protocol is affected?', 'Kerberos', ['RADIUS', 'TACACS+', 'WPA3'], 'Timestamped tickets.'],
    ['WPA2-Enterprise authenticates each user through:', 'A RADIUS server (802.1X)', ['A shared passphrase', 'TKIP', 'The SSID'], 'Per-user credentials.'],
    ['Which RADIUS weakness does TACACS+ fix?', 'RADIUS encrypts only the password; TACACS+ encrypts the whole payload', ['RADIUS cannot do Wi-Fi', 'RADIUS needs Kerberos', 'RADIUS uses WEP'], 'Full encryption.'],
    ['Which is an example of multifactor authentication for Wi-Fi?', 'A device certificate plus the user\'s password', ['A long passphrase', 'Two passwords', 'Hiding the SSID'], 'Have + know.'],
    ['Which cipher does WPA3 use?', 'AES', ['RC4', 'TKIP', 'DES'], 'Strong block cipher.'],
    ['A small office with no server wants the strongest Wi-Fi setting. Choose:', 'WPA3-Personal', ['WPA2 with TKIP', 'WEP', 'Open with a hidden SSID'], 'SAE + AES.'],
    ['Which protocol is used for AD domain sign-in single sign-on to file shares?', 'Kerberos', ['TACACS+', 'RADIUS', 'SNMP'], 'Tickets enable SSO.']
  ]);
  RK.extra(TR, '2.6', [
    ['Which step comes right after quarantining an infected Windows Home PC?', 'Disable System Restore', ['Educate the user', 'Schedule scans', 'Enable System Restore'], 'Step 3.'],
    ['What must you do before scanning during remediation?', 'Update the anti-malware software', ['Create a restore point', 'Reimage', 'Educate the user'], 'Current definitions first.'],
    ['Which environment scans while the infected OS is not running?', 'Preinstallation environment / offline scan', ['Normal boot', 'Fast startup', 'Sleep mode'], 'Boot from clean media.'],
    ['When is reimaging the right choice?', 'When removal cannot be done reliably', ['Always first', 'Never', 'Only on macOS'], 'Last resort.'],
    ['Why disable System Restore during removal?', 'Restore points may contain the malware', ['It speeds up the scan', 'It updates definitions', 'It quarantines the PC'], 'Avoid reinfection.'],
    ['Why quarantine an infected PC?', 'To stop the malware spreading to other systems', ['To speed it up', 'To update Windows', 'To create a restore point'], 'Containment.'],
    ['Which is part of "remediate"?', 'Scanning and removal in safe mode', ['Educating the user', 'Disabling System Restore', 'Investigating symptoms'], 'Step 4.'],
    ['After cleaning, what do you do with System Restore?', 'Enable it and create a new restore point', ['Leave it disabled', 'Restore an old point', 'Delete the registry'], 'Clean checkpoint.'],
    ['What is the first step of the procedure?', 'Investigate and verify malware symptoms', ['Quarantine', 'Reimage', 'Disable System Restore'], 'Confirm first.'],
    ['Which step prevents reinfection on a schedule?', 'Schedule scans and run updates', ['Quarantine', 'Disable System Restore', 'Investigate'], 'Ongoing protection.']
  ]);
  RK.extra(TR, '2.9', [
    ['Which data destruction method uses a strong magnetic field?', 'Degaussing', ['Shredding', 'Incineration', 'Standard format'], 'Magnetic media only.'],
    ['Why is a standard format inadequate before donating a PC?', 'Data can usually be recovered', ['It damages the drive', 'It is illegal', 'It encrypts the drive'], 'Only the file table is rewritten.'],
    ['Which method suits SSDs that will be reused?', 'Manufacturer secure erase / sanitize', ['Degaussing', 'Drilling', 'Quick format'], 'Flash-aware wipe.'],
    ['Which document should a disposal vendor provide?', 'Certificate of destruction', ['SLA', 'SDS', 'EULA'], 'Proof.'],
    ['Burning media completely to ash is called:', 'Incineration', ['Degaussing', 'Wiping', 'Pulping'], 'Total destruction.'],
    ['Which is a quick in-house physical method for a few HDDs?', 'Drilling through the platters', ['Standard format', 'Defragmentation', 'Degaussing an SSD'], 'Physical damage.'],
    ['Disposal rules for health records come from:', 'Regulatory requirements', ['The EULA', 'The SSID', 'The AUP only'], 'Laws like HIPAA.'],
    ['Old monitors and PC chassis should be:', 'Recycled per environmental regulations', ['Thrown in the trash', 'Degaussed', 'Left in storage forever'], 'E-waste rules.'],
    ['Which is "recycling or repurposing" rather than destruction?', 'Erasing/wiping the drive', ['Shredding', 'Incineration', 'Drilling'], 'The drive is reused.']
  ]);
  RK.extra(TR, '2.10', [
    ['Which SOHO setting should be disabled because it lets devices open ports automatically?', 'UPnP', ['WPA3', 'DHCP', 'NAT'], 'Universal Plug and Play.'],
    ['Disabling SSID broadcast provides:', 'Minimal security — the name is still visible in traffic', ['Strong encryption', 'Guest isolation', 'Content filtering'], 'Weak control.'],
    ['Where should a public-facing server be placed on a SOHO network?', 'Screened subnet', ['The main LAN', 'The guest Wi-Fi', 'Behind UPnP'], 'Isolation.'],
    ['Why update router firmware?', 'To fix security vulnerabilities', ['To change the SSID', 'To reset the password', 'To speed up DNS'], 'Patching.'],
    ['How should router administration be configured?', 'HTTPS from the internal network only; remote admin off', ['HTTP from anywhere', 'Telnet from the Internet', 'No password'], 'Secure management access.'],
    ['A guest network should provide:', 'Internet access only, isolated from the office LAN', ['Access to file shares', 'Admin access to the router', 'No encryption'], 'Isolation.'],
    ['Which filter blocks traffic from specific addresses?', 'IP filtering', ['Content filtering', 'Port forwarding', 'SSID broadcast'], 'Address-based.'],
    ['A reachable router can be reset with a paperclip. Which setting addresses this?', 'Physical placement in a secure location', ['Disable UPnP', 'Change SSID', 'Port forwarding'], 'Physical security.'],
    ['Which is safer than forwarding RDP to an office PC?', 'Use a VPN', ['Forward port 3389', 'Enable UPnP', 'Disable the firewall'], 'Never expose RDP.']
  ]);
  RK.extra(TR, '2.11', [
    ['A browser warns the certificate name does not match the site. What should the user do?', 'Not enter credentials and report it', ['Click "proceed anyway"', 'Clear the cache', 'Disable the pop-up blocker'], 'Possible interception or misconfiguration.'],
    ['Which browser setting encrypts DNS lookups?', 'Secure DNS (DNS over HTTPS)', ['Private browsing', 'Pop-up blocker', 'Sync'], 'DoH.'],
    ['Which feature lets bookmarks and passwords follow the user across devices?', 'Browser sign-in/data synchronization', ['Clearing cache', 'Ad blocker', 'Proxy'], 'Sync.'],
    ['Where is a company proxy configured for the browser?', 'Proxy settings (browser or OS)', ['Pop-up blocker', 'Extensions page', 'Certificate store'], 'Network setting.'],
    ['Why use a password manager in the browser?', 'Unique strong passwords and autofill only on the genuine site', ['To disable certificates', 'To block pop-ups', 'To clear cache'], 'Defeats reuse and look-alikes.'],
    ['How can IT block unapproved browser extensions on every PC?', 'Browser feature management via policy', ['Clear browsing data', 'Private mode', 'Secure DNS'], 'Central control.'],
    ['A web app shows old content after an update. First fix?', 'Clear the cache', ['Reinstall the OS', 'Disable the firewall', 'Change the proxy'], 'Stale files.'],
    ['Which helps block malvertising?', 'Ad blocker', ['Sync', 'Proxy', 'Cache'], 'Blocks ad scripts.']
  ]);
  RK.extra(TR, '2.8', [
    ['Which setting erases a phone after too many wrong passcodes?', 'Failed log-in attempt restriction', ['Locator app', 'Configuration profile', 'Remote backup'], 'Stops guessing.'],
    ['What usually turns on device encryption on a modern phone?', 'Setting a passcode', ['Installing antivirus', 'Enabling Bluetooth', 'Using a swipe lock'], 'Encryption tied to the passcode.'],
    ['Which policy type allows a full wipe without privacy concerns?', 'Corporate-owned', ['BYOD', 'Guest', 'Shared personal'], 'Company owns the device.']
  ]);
  RK.extra(TR, '2.7', [
    ['Which hardening step stops USB media launching programs automatically?', 'Disable AutoRun', ['Disable Guest', 'Enable lockout', 'Set log-in times'], 'AutoRun/AutoPlay.'],
    ['Which practice makes unique passwords for every site realistic?', 'Using a password manager', ['Writing them down', 'Reusing one strong password', 'Short passwords'], 'Generates and stores them.']
  ]);

  // ---------- flashcards ----------
  RK.cards(TR, '2.1', [['Access control vestibule', 'Two interlocking doors that stop tailgating (old name: mantrap).'], ['Bollards', 'Posts that stop vehicles.'], ['TOTP', 'Time-based one-time password; changes every 30 seconds.'], ['Hardware token', 'Physical security key; most phishing-resistant MFA.'], ['SAML', 'XML standard for web/cloud SSO assertions.'], ['Just-in-time / PAM', 'Time-limited, approved privileged access.'], ['DLP', 'Data loss prevention: blocks sensitive data leaving.'], ['Zero trust', 'Never trust, always verify — even inside.']]);
  RK.cards(TR, '2.2', [['UAC', 'Prompts for consent or admin credentials before system changes.'], ['NTFS vs share', 'NTFS applies locally and remotely; share only remotely; most restrictive wins.'], ['Deny', 'An explicit Deny overrides any Allow.'], ['BitLocker / To Go / EFS', 'Volume / removable drive / individual files per user.'], ['Windows Hello', 'Passwordless PIN or biometric bound to the device and TPM.'], ['OU', 'Organizational unit; GPOs link to OUs.'], ['Folder redirection', 'GPO setting storing Documents/Desktop on a server.'], ['Home folder', 'Private network folder per user, usually H:.'], ['Add-ADGroupMember', 'PowerShell: add a user to an AD group.'], ['Move-ADObject', 'PowerShell: move an AD object to another OU.']]);
  RK.cards(TR, '2.3', [['WPA3', 'Current Wi-Fi security; SAE replaces the PSK handshake.'], ['TKIP', 'Deprecated WPA encryption — never use.'], ['RADIUS', 'Network access AAA (Wi-Fi, VPN, 802.1X); UDP.'], ['TACACS+', 'Device admin AAA; TCP 49; encrypts everything.'], ['Kerberos', 'AD ticket-based authentication; needs synced clocks.']]);
  RK.cards(TR, '2.4', [['Rootkit', 'Hides itself and other malware deep in the OS; reimage.'], ['Fileless malware', 'Runs in memory/legitimate tools; little on disk.'], ['Cryptominer', 'Uses CPU/GPU to mine; high usage and heat.'], ['Stalkerware', 'Covertly tracks a person\'s location and messages.'], ['EDR / MDR / XDR', 'Endpoint behaviour / managed service / extended across sources.'], ['PUP', 'Potentially unwanted program bundled with freeware.']]);
  RK.cards(TR, '2.5', [['Vishing / smishing / quishing', 'Voice / SMS / QR-code phishing.'], ['Spear phishing vs whaling', 'Targeted person vs targeted executive.'], ['BEC', 'Business email compromise — fake invoices, payment changes.'], ['Supply chain attack', 'Compromise a supplier or build pipeline to reach its customers.'], ['Brute-force vs dictionary', 'Every combination vs a wordlist.'], ['XSS', 'Script injected into a web page that runs in other users\' browsers.']]);
  RK.cards(TR, '2.6', [['Malware removal order', 'Investigate → quarantine → disable System Restore → remediate (update, scan) → reimage if needed → schedule scans/updates → enable System Restore + restore point → educate.'], ['Safe mode vs PE', 'Safe mode = minimal infected OS; preinstallation environment = clean OS from media.']]);
  RK.cards(TR, '2.7', [['Strongest password factor', 'Length.'], ['net accounts /lockoutthreshold', 'Sets failed-attempt lockout.'], ['net user /expires', 'Sets an account expiration date.'], ['net user /times', 'Restricts log-in hours.'], ['AutoRun', 'Disable so inserted media cannot launch code.']]);
  RK.cards(TR, '2.8', [['Remote wipe', 'Erase a lost or stolen device.'], ['Selective wipe', 'Remove only company data from a BYOD device.'], ['Configuration profile', 'Settings package installed by MDM.'], ['Swipe lock', 'Not a security control.']]);
  RK.cards(TR, '2.9', [['Degaussing', 'Magnetic erase; useless on SSDs.'], ['Shredding', 'Strongest physical destruction for any drive.'], ['Standard format', 'Not sanitization; data recoverable.'], ['Certificate of destruction', 'Vendor proof of what was destroyed.']]);
  RK.cards(TR, '2.10', [['UPnP', 'Devices open ports automatically — disable.'], ['Screened subnet', 'Isolated segment for exposed servers.'], ['Port forwarding', 'Maps one inbound port to one internal device.'], ['SSID broadcast off', 'Hides the name only; weak control.']]);
  RK.cards(TR, '2.11', [['Hash check', 'Compare a download\'s SHA-256 with the vendor\'s published value.'], ['Private browsing', 'No local history/cookies; not anonymous on the network.'], ['Secure DNS', 'DNS over HTTPS from the browser.'], ['Clear cache', 'Fixes stale pages after site updates.']]);
})();
