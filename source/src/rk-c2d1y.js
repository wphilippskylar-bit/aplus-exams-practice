/* A+ Core 2 Domain 1 — depth pass: paired labs for parts that had none, On-the-job / Exam-trap callouts on every part,
   extra test questions. Loads after rk-c2d1a/b/x and before rk-build. Only adds a callout type a part does not already have. */
(function () {
  var RK = window.RK, M = RK.M, T = RK.T, TR = 'core2';
  function obj(id) { return RK.objs.filter(function (o) { return o.track === TR && o.id === id; })[0]; }
  function pair(id, i, lab) { obj(id).parts[i].lab = lab; }

  // ---------- new paired labs ----------
  M('c2-eol', 'Keep it, upgrade it, or replace it?', 'Life cycle and compatibility decisions',
    'Each line is a machine or file you found during an audit. Pick the right call.', ['Supported — keep patching', 'EOL — upgrade or replace', 'EOL — isolate (cannot be replaced yet)', 'Hardware blocks the upgrade', 'Cross-OS compatibility problem'],
    [['Windows 11 24H2 laptop receiving monthly updates', 'Supported — keep patching', 'Still inside its support window.'],
     ['Front-desk PC on an OS version that stopped getting security patches last year', 'EOL — upgrade or replace', 'No patches = growing risk.'],
     ['Lab PC that runs a machine controller only certified on an old, unsupported OS', 'EOL — isolate (cannot be replaced yet)', 'Segment it off the network until the vendor certifies a newer OS.'],
     ['Five-year-old phone that no longer receives OS updates from its maker', 'EOL — upgrade or replace', 'Mobile update windows end too.'],
     ['Desktop with a 32-bit CPU that fails the Windows 11 check', 'Hardware blocks the upgrade', 'Update limitation: the hardware cannot run it.'],
     ['A designer\'s Mac external drive (APFS) cannot be read on a Windows PC', 'Cross-OS compatibility problem', 'Reformat a shared drive as exFAT.']],
    'Life cycle questions always have one of three answers: patch it, replace it, or isolate it until you can.');
  pair('1.1', 2, 'c2-eol');

  M('c2-bootm', 'Which boot method?', 'Pick how the installer starts',
    'Pick the boot method for each situation.', ['USB', 'Network (PXE)', 'Solid-state / flash drive', 'Internet-based', 'External / hot-swappable drive', 'Internal hard drive (partition)', 'Multiboot'],
    [['You have a 16 GB installer stick made with the vendor\'s media tool', 'USB', 'Most common.'],
     ['Forty identical lab PCs, no media, deployment server on the LAN', 'Network (PXE)', 'Boot from the network card.'],
     ['A Mac with an erased drive downloads macOS from Apple\'s servers at startup', 'Internet-based', 'Internet Recovery.'],
     ['Installer copied onto an external SSD in a USB enclosure', 'External / hot-swappable drive', 'External drive boot.'],
     ['Laptop rebuilt from the factory image hidden on its own disk', 'Internal hard drive (partition)', 'Recovery partition.'],
     ['A developer chooses Windows or Ubuntu from a menu each time the PC starts', 'Multiboot', 'Two OSes, one machine.'],
     ['An SD card holds the installer for a small single-board device', 'Solid-state / flash drive', 'Flash media.']],
    'If the PC ignores your media: boot order, boot menu key, USB boot allowed, Secure Boot.');
  pair('1.2', 0, 'c2-bootm');

  M('c2-edname', 'Name that edition', 'Windows 10/11 editions',
    'Pick the edition each description fits.', ['Home', 'Pro', 'Pro for Workstations', 'Enterprise', 'N edition'],
    [['Sold to consumers on most retail laptops', 'Home', 'Consumer edition.'],
     ['Business edition sold at retail and on business laptops', 'Pro', 'Domain join, BitLocker, RDP host.'],
     ['Supports up to 4 CPUs and 6 TB of RAM; ReFS', 'Pro for Workstations', 'High-end workstation edition.'],
     ['Only through volume licensing for large organizations', 'Enterprise', 'Volume licensing.'],
     ['Same as another edition but without media features, for European markets', 'N edition', 'Media pack can be added.']],
    'Home → Pro → Pro for Workstations → Enterprise is a ladder of business features.');
  pair('1.3', 0, 'c2-edname');

  T('c2-run2', 'Open the admin snap-ins', 'lusrmgr, certmgr, perfmon, gpedit',
    'Four tickets on a Windows 11 Pro PC. Open the right tool for each by typing its run name.',
    { shell: 'cmd', prompt: 'C:\\Users\\tech>' },
    [{ t: 'The user is locked out of the local account <b>kiosk</b>. Open the snap-in where local accounts are unlocked and reset.', accept: [/^lusrmgr(\.msc)?$/i], show: 'lusrmgr.msc', hint: 'Local Users and Groups Manager.', out: '[Local Users and Groups opened]\n  Users\n    Administrator   (disabled)\n    kiosk           Account is locked out\n    tech', why: 'lusrmgr.msc — Properties → untick "Account is locked out".' },
     { t: 'An internal site says its certificate is not trusted. Open the tool that shows the <b>current user\'s</b> certificates.', accept: [/^certmgr(\.msc)?$/i], show: 'certmgr.msc', hint: 'Certificate Manager.', out: '[Certificates - Current User]\n  Personal\n  Trusted Root Certification Authorities\n    Certificates (Corp-Root-CA missing)', why: 'certmgr.msc — the company root CA is missing from Trusted Root; importing it fixes the warning.' },
     { t: 'The PC slows down every afternoon. Open the tool that can <b>log counters over time</b>.', accept: [/^perfmon(\.msc|\.exe)?$/i], show: 'perfmon.msc', hint: 'Performance Monitor.', out: '[Performance Monitor opened]\n  Monitoring Tools > Performance Monitor\n  Data Collector Sets > User Defined', why: 'perfmon.msc — build a data collector set and read it the next morning.' },
     { t: 'You must stop this PC\'s users opening Control Panel. Open the <b>local</b> policy editor.', accept: [/^gpedit(\.msc)?$/i], show: 'gpedit.msc', hint: 'Group Policy Editor.', out: '[Local Group Policy Editor]\n  User Configuration > Administrative Templates > Control Panel\n    Prohibit access to Control Panel and PC settings   Not configured', why: 'gpedit.msc edits local policy; it exists only on Pro and above.' }],
    'lusrmgr.msc accounts · certmgr.msc certificates · perfmon.msc counters over time · gpedit.msc local policy.',
    ['Shorten the tool name: Local USeR ManaGeR → lusrmgr.']);
  pair('1.4', 2, 'c2-run2');

  T('c2-cli-disk', 'Prepare and copy a data drive', 'diskpart, format, chkdsk, robocopy',
    'A new 1 TB drive (Disk 1) must become drive <b>E:</b>, be checked, and receive a copy of the old share. Elevated Command Prompt.',
    { shell: 'cmd', prompt: 'C:\\Windows\\System32>' },
    [{ t: 'Start the command-line partitioning tool.', accept: [/^diskpart$/i], show: 'diskpart', hint: 'disk + part.', out: 'Microsoft DiskPart version 10.0.26100.1\nOn computer: WS-ACCT-014', prompt: 'DISKPART>', why: 'diskpart is interactive: every following command runs inside it.' },
     { t: 'List the disks so you can be sure which one is new.', accept: [/^list disk$/i, /^lis dis$/i], show: 'list disk', hint: 'list + disk.', out: '  Disk ###  Status         Size     Free     Dyn  Gpt\n  --------  -------------  -------  -------  ---  ---\n  Disk 0    Online          476 GB      0 B        *\n  Disk 1    Online          931 GB   931 GB', ask: { q: 'Which disk number has all its space free?', accept: ['1', 'disk 1'], why: 'Disk 1 is the empty new drive. Disk 0 is Windows — selecting it by mistake and running clean would wipe the PC.' }, why: 'Always list and read before select.' },
     { t: 'Select the new disk.', accept: [/^sel(ect)? dis(k)? 1$/i], show: 'select disk 1', hint: 'select disk and the number.', out: 'Disk 1 is now the selected disk.', why: 'Every later command acts on the selected disk.' },
     { t: 'Convert it to the partition style that supports large disks and UEFI.', accept: [/^convert gpt$/i], show: 'convert gpt', hint: 'convert + the style name.', out: 'DiskPart successfully converted the selected disk to GPT format.', why: 'GPT: no 2 TB limit, 128 partitions.' },
     { t: 'Create one primary partition using the whole disk.', accept: [/^create part(ition)? primary$/i, /^cre par pri$/i], show: 'create partition primary', hint: 'create partition primary', out: 'DiskPart succeeded in creating the specified partition.', why: 'No size given = use all free space.' },
     { t: 'Quick-format it as NTFS with the label DATA.', accept: [/^format (fs=ntfs (label=['"]?data['"]? )?quick|fs=ntfs quick label=['"]?data['"]?|quick fs=ntfs label=['"]?data['"]?)$/i], show: 'format fs=ntfs label=DATA quick', hint: 'format fs=ntfs label=DATA quick', out: '  100 percent completed\nDiskPart successfully formatted the volume.', why: 'Inside diskpart the syntax is fs=, label=, quick.' },
     { t: 'Give it the drive letter E and leave diskpart.', accept: [/^assign letter=?e:?$/i], show: 'assign letter=E', hint: 'assign letter=…', out: 'DiskPart successfully assigned the drive letter or mount point.\n(type exit to leave)', prompt: 'C:\\Windows\\System32>', why: 'assign gives the volume a letter. You are back at the normal prompt.' },
     { t: 'Mirror <b>\\\\fs-old\\shared</b> to <b>E:\\shared</b>, including empty subfolders, with 2 retries and a 5-second wait.', accept: [/^robocopy \\\\fs-old\\shared e:\\shared \/(mir|e)( \/r:2 \/w:5| \/w:5 \/r:2)?$/i, /^robocopy \\\\fs-old\\shared e:\\shared \/(mir|e) \/r:2 \/w:5$/i], show: 'robocopy \\\\fs-old\\shared E:\\shared /MIR /R:2 /W:5', hint: 'robocopy source destination /MIR /R:2 /W:5', out: '               Total    Copied   Skipped  Mismatch    FAILED    Extras\n    Dirs :       412       412         0         0         0         0\n   Files :     18304     18304         0         0         0         0', why: 'robocopy is restartable and logs results; /MIR mirrors the tree.' }],
    'List → select → convert → create → format → assign. Read "list disk" before "select" every single time.',
    ['Inside diskpart, commands are words: list, select, create, format, assign.']);
  pair('1.5', 2, 'c2-cli-disk');

  M('c2-macprefs', 'Which System Settings pane?', 'macOS preferences',
    'Pick the pane for each task.', ['Displays', 'Network', 'Printers & Scanners', 'Privacy & Security', 'Accessibility', 'Time Machine', 'Software Update'],
    [['Arrange a second monitor to the left of the laptop', 'Displays', 'Arrangement and resolution.'],
     ['Add a VPN or set DNS servers by hand', 'Network', 'Interfaces, VPN, DNS, proxies.'],
     ['Add the office MFP and its scanner', 'Printers & Scanners', 'Add devices.'],
     ['Allow the conferencing app to use the camera and screen recording', 'Privacy & Security', 'App permissions.'],
     ['Turn on VoiceOver or zoom', 'Accessibility', 'Vision, hearing, motor aids.'],
     ['Back up hourly to an external drive', 'Time Machine', 'Built-in backup.'],
     ['Install a Rapid Security Response', 'Software Update', 'Updates and security responses.']],
    'Newer macOS calls System Preferences "System Settings"; the panes are the same idea.');
  pair('1.8', 1, 'c2-macprefs');

  T('c2-lnx-nav', 'Find it in the Linux tree', 'pwd, cd, ls, cat, grep, find',
    'A Linux web server is returning errors. Find the log and the error. Commands are case-sensitive.',
    { shell: 'bash', prompt: 'tech@web01:~$' },
    [{ t: 'Show where you are.', accept: [/^pwd$/], show: 'pwd', hint: 'print working directory', out: '/home/tech', why: 'Your home directory.' },
     { t: 'Change to the system log directory <b>/var/log</b>.', accept: [/^cd \/var\/log\/?$/], show: 'cd /var/log', hint: 'cd and an absolute path.', out: '', prompt: 'tech@web01:/var/log$', why: 'Paths starting with / are absolute.' },
     { t: 'List the files here in long format.', accept: [/^ls -l$/, /^ls -la$/, /^ls -al$/, /^ll$/], show: 'ls -l', hint: 'ls with -l.', out: 'drwxr-x--- 2 root adm   4096 Nov 17 08:00 apache2\n-rw-r----- 1 syslog adm 812044 Nov 17 14:58 syslog\n-rw-r----- 1 root adm    40211 Nov 17 14:57 auth.log', why: 'apache2 is a directory (d); syslog and auth.log are files.' },
     { t: 'Search <b>apache2/error.log</b> for lines containing <b>error</b>, ignoring case (needs root).', accept: [/^sudo grep -i ['"]?error['"]? apache2\/error\.log$/], show: 'sudo grep -i error apache2/error.log', hint: 'sudo grep -i pattern file', out: '[Mon Nov 17 14:51:02] [core:error] AH00037: Symbolic link not allowed or link target not accessible: /var/www/html/app', ask: { q: 'Which directory does the error complain about?', accept: ['/var/www/html/app', 'var/www/html/app'], why: 'The site folder is a symlink Apache is not allowed to follow — a permissions/config problem, not a crash.' }, why: 'grep -i finds a pattern regardless of case.' },
     { t: 'Find every file named <b>*.conf</b> under <b>/etc/apache2</b>.', accept: [/^(sudo )?find \/etc\/apache2\/? -name ['"]?\*\.conf['"]?$/], show: 'find /etc/apache2 -name "*.conf"', hint: 'find path -name "pattern"', out: '/etc/apache2/apache2.conf\n/etc/apache2/sites-enabled/000-default.conf', why: 'find searches a tree by name.' },
     { t: 'Print the contents of <b>/etc/apache2/sites-enabled/000-default.conf</b>.', accept: [/^(sudo )?cat \/etc\/apache2\/sites-enabled\/000-default\.conf$/], show: 'cat /etc/apache2/sites-enabled/000-default.conf', hint: 'cat and the full path.', out: '<VirtualHost *:80>\n    DocumentRoot /var/www/html\n    <Directory /var/www/html>\n        Options -FollowSymLinks\n    </Directory>\n</VirtualHost>', why: '"-FollowSymLinks" is why the symlinked app folder is refused. Fix the option (with change control) and reload Apache.' }],
    'Log → error line → config file → cause. That path works for almost every Linux service problem.',
    ['/var/log holds logs; /etc holds configuration.']);
  pair('1.9', 0, 'c2-lnx-nav');

  M('c2-cloudapps', 'Which cloud tool?', 'Email, storage and collaboration',
    'Pick the cloud productivity tool type for each need.', ['Email system', 'Cloud storage / sync', 'Spreadsheet', 'Word processing', 'Presentation tool', 'Videoconferencing', 'Instant messaging'],
    [['Hosted mailbox reachable from Outlook and a browser', 'Email system', 'Exchange Online, Gmail.'],
     ['Keep the Documents folder backed up and available on every device', 'Cloud storage / sync', 'OneDrive, Google Drive.'],
     ['Five people update the same budget figures at once', 'Spreadsheet', 'Excel/Sheets co-authoring.'],
     ['Two people edit a policy document with tracked comments', 'Word processing', 'Word/Docs.'],
     ['Build slides for Monday\'s all-hands together', 'Presentation tool', 'PowerPoint/Slides.'],
     ['Weekly meeting with cameras and screen sharing', 'Videoconferencing', 'Teams, Zoom, Meet.'],
     ['Quick question to a teammate with presence status', 'Instant messaging', 'Chat.']],
    'One license usually unlocks all of these; the help desk supports the whole suite.');
  pair('1.11', 0, 'c2-cloudapps');

  // ---------- callouts: [On the job, Exam trap] per part ----------
  var D = {
    '1.1': [['', 'iPadOS is its own OS name on the exam even though it grew out of iOS. Android is built on the Linux kernel but is listed as a mobile OS.'],
            ['Format shared USB sticks exFAT and you will never get the "file too large" call again.', 'FAT32\'s limit is per file (4 GB), not per drive.'],
            ['Keep a list of every system near or past end of life with its owner. Auditors ask for exactly that list.', '']],
    '1.2': [['', 'PXE boots from the network card, not from a network share mapped in Windows.'],
            ['Imaging plus zero-touch is how real teams deploy: image or Autopilot for the OS, then management tools push apps.', 'A repair installation keeps apps and data; a clean install keeps nothing.'],
            ['Initialize every new disk as GPT unless something old forces MBR.', ''],
            ['', 'Backing up data comes before every install or upgrade on the exam, even when the question does not mention it.']],
    '1.3': [['Check the edition first on any "feature is missing" ticket: Settings → System → About.', 'Windows 11 has no "Pro for Workstations" bullet in the objectives; Windows 10 does.'],
            ['Upgrading Home to Pro only needs a Pro key (Settings → System → Activation). No reinstall.', ''],
            ['Most "can\'t run Windows 11" PCs only need TPM and Secure Boot switched on in UEFI setup.', 'Windows 11 is 64-bit only. A 32-bit install anywhere in the question means clean install or new hardware.']],
    '1.4': [['', 'Services can be restarted from Task Manager\'s Services tab, but startup type (Automatic/Manual/Disabled) is changed in services.msc.'],
            ['Event Viewer\'s "Custom Views → Administrative Events" collects every error and warning in one place.', 'Disk Management changes partitions; Device Manager changes drivers. Questions swap them on purpose.'],
            ['Put people in groups, never permissions on individual accounts. It is the same rule in Active Directory.', 'Group Policy Editor (gpedit.msc) edits one PC\'s local policy. Domain policy is managed on a server.'],
            ['', '']],
    '1.5': [['Tab completes file and folder names in cmd and PowerShell. Use it; typos in paths cause most "file not found" errors.', 'cd .. goes up one level; cd \\ goes to the root of the drive.'],
            ['', 'ipconfig without /all does not show DNS servers or the MAC address.'],
            ['', ''],
            ['Paste gpresult /r output into the ticket when you escalate a policy problem; it saves a round trip.', 'gpupdate applies policy; gpresult reports what applied. sfc repairs Windows files; it does not touch the filesystem.']],
    '1.6': [['Run control from Win + R to open Control Panel; many detailed settings still live only there.', 'Proxy settings exist in two places: Internet Options (classic) and Settings → Network and Internet → Proxy.'],
            ['Turn file extensions on for every user you support. It stops the most common malware trick.', 'Sleep keeps work in RAM; if the battery dies, unsaved work is lost. Hibernate writes it to disk.'],
            ['Windows 11 renamed several categories (Accessibility, Bluetooth & devices). Learn the exam names, but expect the new ones on real PCs.', 'Default apps are under Apps, not System.']],
    '1.7': [['Ask "is this a domain PC?" first: the fix for logins, drives and policy is completely different on a workgroup PC.', 'A mapped drive is a drive letter; a UNC path (\\\\server\\share) is the address it points to.'],
            ['Document every static address in IPAM or a spreadsheet the moment you set it. Duplicate IPs come from undocumented statics.', 'APIPA (169.254.x.x) means no DHCP answer, not a bad DNS server.'],
            ['Never "fix" an app by turning the firewall off. Add one exception and test.', 'Public is the safe default for unknown networks; it turns discovery and sharing off.']],
    '1.8': [['Ask for the user\'s Apple ID status on company Macs: personal Apple IDs on managed Macs cause most iCloud and App Store tickets.', 'A .dmg is mounted then ejected; it is not the installed app. The app is the .app copied into /Applications.'],
            ['Turn on Time Machine before you touch a user\'s Mac. It is the only undo button you will have.', 'FileVault encrypts the disk; Keychain stores passwords. They are easy to mix up.'],
            ['', 'Force Quit is Command + Option + Esc, not Ctrl + Alt + Del.']],
    '1.9': [['Use Tab to complete paths and the up arrow to repeat commands. Speed on the command line comes from those two keys.', 'Linux has no drive letters and is case-sensitive: Report.txt and report.txt are different files.'],
            ['Never chmod 777 to "fix" a permissions error; it gives everyone write access. Find the right owner or group instead.', ''],
            ['Run apt update before apt install, or you may install an old version from a stale list.', 'df reports filesystems; du reports a directory. top is live; ps is a snapshot.'],
            ['', 'dig and nslookup both query DNS; curl tests a web server; traceroute shows the path.']],
    '1.10': [['Check requirements on the vendor page and in msinfo32 before you promise a user an install date.', 'A 64-bit OS runs 32-bit apps; a 32-bit OS cannot run 64-bit apps.'],
             ['', 'A mountable ISO is a file; "physical media" means an actual disc or USB from the vendor.']],
    '1.11': [['', 'Online-only files need Internet. "Always keep on this device" makes them available offline.'],
             ['Most "my Office stopped working" tickets in the first week of a job are license assignment. Check the user\'s licenses first.', 'Identity sync copies accounts to the cloud; it does not assign licenses.']]
  };
  Object.keys(D).forEach(function (id) {
    var o = obj(id); if (!o) return;
    o.parts.forEach(function (p, i) {
      var c = D[id][i]; if (!c) return;
      if (c[0] && !/callout pro/.test(p.html)) p.html += '<div class="callout pro"><b class="k">On the job</b>' + c[0] + '</div>';
      if (c[1] && !/callout trap/.test(p.html)) p.html += '<div class="callout trap"><b class="k">Exam trap</b>' + c[1] + '</div>';
    });
  });

  // ---------- extra test questions ----------
  RK.extra(TR, '1.10', [
    ['A 64-bit application will not install on a PC. What should you check first?', 'Whether the OS is 32-bit', ['Whether the drive is GPT', 'Whether the PC has a TPM', 'Whether the user is on Wi-Fi'], '64-bit apps need a 64-bit OS.'],
    ['Which is the best source for a business application installer?', 'The vendor\'s official site or the company software portal', ['A file-sharing forum', 'An email attachment from an unknown sender', 'A search-engine ad'], 'Trusted sources only.']
  ]);
  RK.extra(TR, '1.11', [
    ['Which tool is best for a quick text question to a teammate who shows as "available"?', 'Instant messaging', ['Videoconferencing', 'Email system', 'Cloud storage'], 'Presence + chat.'],
    ['Which cloud setting saves disk space on a laptop with a small SSD?', 'Online-only files (Files On-Demand)', ['Always keep on this device', 'Metered connection', 'Fast startup'], 'Files stay in the cloud until opened.'],
    ['What must exist before a user can sign in to cloud apps with their on-premises password?', 'Identity synchronization from the directory', ['A mapped drive', 'A static IP address', 'A local administrator account'], 'Sync copies the account and password hash or federation.']
  ]);
})();
