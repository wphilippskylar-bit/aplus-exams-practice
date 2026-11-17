/* A+ Core 2 (220-1202) — Domain 1.0 Operating Systems — objectives 1.7 to 1.11 + domain wrap lab */
(function () {
  var RK = window.RK, P = RK.P, M = RK.M, O = RK.O, T = RK.T, TR = 'core2';

  // ===================== 1.7 Windows networking =====================
  M('c2-dom', 'Workgroup or domain?', 'Where accounts and policies live',
    'Pick workgroup or domain for each statement.', ['Workgroup', 'Domain'],
    [['Each PC keeps its own user accounts; you need an account on every PC you use', 'Workgroup', 'Peer-to-peer, decentralized.'],
     ['One username and password works on every company PC', 'Domain', 'Accounts live in Active Directory.'],
     ['A server called a domain controller authenticates sign-ins', 'Domain', 'Central authentication.'],
     ['Fine for a home or an office of five PCs', 'Workgroup', 'Does not scale.'],
     ['IT pushes a password policy and drive mappings to 800 PCs at once', 'Domain', 'Group Policy.'],
     ['Windows Home edition can only be part of this', 'Workgroup', 'Home cannot join a domain.']],
    'Workgroup = every PC for itself. Domain = central accounts, central policy, single sign-on.');
  T('c2-netcfg', 'Fix a client\'s network settings', 'Read the config, find the fault, map resources',
    'Ticket: a new hire\'s PC (static IP, set by hand) can reach the printer next to it but not the file server or the Internet. You are at an elevated Command Prompt on that PC.',
    { shell: 'cmd', prompt: 'C:\\Windows\\System32>' },
    [{ t: 'Show the PC\'s full IP configuration.', accept: [/^ipconfig ?\/all$/i], show: 'ipconfig /all', hint: 'ipconfig with the "everything" switch.', out: 'Ethernet adapter Ethernet:\n   DHCP Enabled. . . . . . . . : No\n   IPv4 Address. . . . . . . . : 192.168.10.84\n   Subnet Mask . . . . . . . . : 255.255.255.0\n   Default Gateway . . . . . . : 192.168.11.1\n   DNS Servers . . . . . . . . : 192.168.10.10', ask: { q: 'Which setting is wrong? (type: ip, mask, gateway or dns)', accept: ['gateway', 'default gateway'], why: 'The gateway must be in the PC\'s own subnet (192.168.10.x). 192.168.11.1 is unreachable, so only local devices work.' }, why: 'Local works, remote fails → suspect the default gateway.' },
     { t: 'The correct gateway is 192.168.10.1. After fixing it in the adapter properties, confirm you can reach the gateway.', accept: [/^ping 192\.168\.10\.1$/i], show: 'ping 192.168.10.1', hint: 'ping the new gateway address.', out: 'Reply from 192.168.10.1: bytes=32 time<1ms TTL=64\nReply from 192.168.10.1: bytes=32 time<1ms TTL=64\n\nPackets: Sent = 4, Received = 4, Lost = 0 (0% loss)', why: 'Gateway answers — off-subnet traffic now has a way out.' },
     { t: 'Confirm name resolution works for <b>fs01.corp.local</b>.', accept: [/^nslookup fs01\.corp\.local$/i, /^ping fs01\.corp\.local$/i], show: 'nslookup fs01.corp.local', hint: 'Use the DNS lookup tool.', out: 'Server:  dc01.corp.local\nAddress:  192.168.10.10\n\nName:    fs01.corp.local\nAddress:  192.168.20.15', why: 'DNS is fine; the file server is on another subnet, which is why the gateway mattered.' },
     { t: 'Map drive <b>H:</b> to the user\'s home share <b>\\\\fs01\\home\\mlopez</b>.', accept: [/^net use h: \\\\fs01\\home\\mlopez( \/persistent:yes)?$/i], show: 'net use H: \\\\fs01\\home\\mlopez', hint: 'net use, the drive letter and colon, then the UNC path.', out: 'The command completed successfully.', why: 'A UNC path is \\\\server\\share\\folder.' },
     { t: 'List the drives that are currently mapped to confirm.', accept: [/^net use$/i], show: 'net use', hint: 'The same command with nothing after it.', out: 'Status       Local     Remote                    Network\n-------------------------------------------------------------------------------\nOK           H:        \\\\fs01\\home\\mlopez        Microsoft Windows Network\nThe command completed successfully.', why: 'net use with no arguments lists connections.' }],
    'Symptom pattern to memorize: local devices work but nothing beyond the subnet → wrong or missing default gateway.',
    ['The gateway has to be an address inside the PC\'s own subnet.']);
  M('c2-netfeat', 'Windows networking features', 'Profiles, firewall, proxy, VPN, metered',
    'Pick the feature or setting for each situation.', ['Public network profile', 'Private network profile', 'Firewall exception', 'Proxy settings', 'VPN connection', 'Metered connection', 'WWAN / cellular', 'Mapped drive'],
    [['Laptop on coffee-shop Wi-Fi should be hidden from other devices', 'Public network profile', 'Discovery and sharing off.'],
     ['Home network where the PC should see the printer and other PCs', 'Private network profile', 'Discovery on.'],
     ['A new accounting app cannot receive connections until it is allowed through', 'Firewall exception', 'Allow an app or port.'],
     ['Company requires all web traffic to go through a filtering server', 'Proxy settings', 'Settings → Network → Proxy.'],
     ['Remote worker needs an encrypted tunnel to reach internal file shares', 'VPN connection', 'Add under Network and Internet → VPN.'],
     ['Tethered to a phone with a 5 GB data cap; stop big updates downloading', 'Metered connection', 'Limits background data.'],
     ['Field laptop with a built-in SIM for Internet anywhere', 'WWAN / cellular', 'Wireless wide area network.'],
     ['Users want \\\\fs01\\projects to appear as drive P:', 'Mapped drive', 'A drive letter for a network share.']],
    'Public = hide me. Private = trust this network. Domain profile applies automatically when a domain PC sees its domain controller.');

  RK.add({ track: TR, id: '1.7', dom: 1, short: 'Windows networking', title: 'Given a scenario, configure Microsoft Windows networking features on a client/desktop',
    goal: 'Domain vs workgroup, shared resources and mapped drives, the local firewall, IP settings, connection types, proxy, network profiles and metered connections.',
    kw: /\b(workgroup|domain.joined|join(ing)? (a|the) domain|mapped drive|map(ping)? a (network )?drive|shared (resource|folder|printer)|file server|unc path|\\\\\\\\|firewall (exception|rule)|static (ip|address)|dynamic (ip|address)|subnet mask|default gateway|dns server|proxy|public network|private network|network profile|metered|wwan|vpn connection|network discovery)/,
    parts: [
      P('Workgroup vs domain and shared resources', 'Explain workgroups and domains, and reach shared printers, file servers and mapped drives.',
        `<table><tr><th></th><th>Workgroup</th><th>Domain</th></tr>
<tr><td>Accounts stored</td><td>On each PC (local accounts)</td><td>Centrally, in <b>Active Directory</b> on a <b>domain controller</b></td></tr>
<tr><td>Sign-in</td><td>Separate account per PC</td><td>One account works on any domain PC</td></tr>
<tr><td>Management</td><td>Each PC by hand</td><td><b>Group Policy</b> from the server</td></tr>
<tr><td>Size</td><td>Home / under ~20 PCs</td><td>Businesses of any size</td></tr>
<tr><td>Editions</td><td>Any</td><td>Pro and above</td></tr></table>
<p><b>Shared resources:</b></p>
<ul><li><b>File servers</b> hold shared folders (<b>shares</b>). You reach one with a <b>UNC path</b>: <code>\\\\server\\share</code>.</li>
<li><b>Mapped drive</b> — a drive letter that points at a share (<code>P:</code> → <code>\\\\fs01\\projects</code>). Map in File Explorer or with <code>net use</code>.</li>
<li><b>Printers</b> — shared from a print server (<code>\\\\print01\\HR-Laser</code>) or connected directly by IP.</li></ul>
<p>Join a domain in <b>Settings → Accounts → Access work or school</b> or System Properties → Computer Name → Change. You need a domain account allowed to join, and the PC must use the domain's DNS server.</p>`,
        [['Where are user accounts stored in a workgroup?', 'On each individual PC', ['On a domain controller', 'In the cloud only', 'On the router'], 'Workgroups are decentralized.'],
         ['Which is a valid UNC path to a shared folder?', '\\\\fs01\\projects', ['C:\\fs01\\projects', 'fs01:/projects', 'http://fs01.projects'], 'Two backslashes, server, backslash, share.']],
        'c2-dom'),
      P('Client IP configuration', 'Set and check IP address, subnet mask, gateway and DNS; choose static or dynamic.',
        `<p>Every network adapter needs four settings:</p>
<table><tr><th>Setting</th><th>Job</th><th>If it is wrong</th></tr>
<tr><td><b>IP address</b></td><td>This PC's address</td><td>Duplicate = conflict warnings; wrong subnet = no communication</td></tr>
<tr><td><b>Subnet mask</b></td><td>Says which addresses are "local"</td><td>Some local hosts unreachable</td></tr>
<tr><td><b>Default gateway</b></td><td>The router to everything else</td><td>Local works, Internet and other subnets fail</td></tr>
<tr><td><b>DNS server</b></td><td>Turns names into IPs</td><td>Sites work by IP but not by name</td></tr></table>
<ul><li><b>Dynamic</b> — settings come from <b>DHCP</b> automatically. Use for nearly all clients.</li>
<li><b>Static</b> — typed in by hand. Use for servers, printers and network gear that must not change.</li>
<li><b>APIPA</b> (<code>169.254.x.x</code>) — the PC asked for DHCP and nobody answered.</li>
<li><b>Alternate configuration</b> — a fallback static address used when DHCP is not available (a laptop that visits a site with no DHCP).</li></ul>
<p>Set them in <b>Settings → Network and Internet → adapter → IP assignment</b>, or the adapter's <b>IPv4 Properties</b>.</p>`,
        [['A PC can reach devices on its own subnet but nothing else. Which setting is most likely wrong?', 'Default gateway', ['DNS server', 'IP address', 'Computer name'], 'The gateway is the way off the subnet.'],
         ['A PC shows the address 169.254.12.7. What happened?', 'It could not reach a DHCP server', ['It has a static address', 'DNS failed', 'The firewall blocked it'], 'APIPA is self-assigned when DHCP does not answer.']],
        'c2-netcfg'),
      P('Firewall, profiles, proxy and connections', 'Configure the local firewall, network profile, proxy, VPN, WWAN and metered connections.',
        `<p><b>Network profiles</b> decide how open the PC is:</p>
<ul><li><b>Public</b> — untrusted (cafe, hotel). Network discovery and sharing <b>off</b>.</li>
<li><b>Private</b> — trusted (home, small office). Discovery <b>on</b>.</li>
<li><b>Domain</b> — applied automatically when the PC can see its domain controller.</li></ul>
<p><b>Local OS firewall (Windows Defender Firewall):</b></p>
<ul><li>Blocks unsolicited <b>inbound</b> traffic by default. Each profile has its own on/off state.</li>
<li><b>Exception / allow an app</b> — let one program through. <b>Restriction</b> — block one.</li>
<li>"Advanced security" lets you write inbound/outbound rules by port, protocol and program.</li></ul>
<p><b>Connections and options:</b></p>
<ul><li><b>Wired</b> (Ethernet), <b>wireless</b> (Wi-Fi), <b>WWAN/cellular</b> (built-in SIM or tethered phone), <b>VPN</b> (encrypted tunnel to the office).</li>
<li><b>Proxy settings</b> — send web traffic through a proxy server: automatic script or manual address:port.</li>
<li><b>Metered connection</b> — tells Windows the link has a data cap: big updates and syncing pause.</li>
<li><b>File Explorer navigation</b> — type a network path (<code>\\\\server\\share</code>) into the address bar.</li></ul>`,
        [['Which network profile should a laptop use on hotel Wi-Fi?', 'Public', ['Private', 'Domain', 'Workgroup'], 'Public hides the PC and turns sharing off.'],
         ['A user tethers to a phone with a small data plan. What stops Windows downloading large updates?', 'Set the connection as metered', ['Turn off the firewall', 'Use a static IP', 'Change to the Private profile'], 'Metered connections limit background data.']],
        'c2-netfeat')
    ],
    wrap: { recap: ['Workgroup: local accounts on each PC. Domain: central accounts (Active Directory) and Group Policy; Pro and above.', 'UNC path \\\\server\\share; mapped drive = letter → share (net use).', 'IP, mask, gateway, DNS. Wrong gateway → local only. Wrong DNS → IP works, names fail.', 'Dynamic (DHCP) for clients; static for servers/printers; 169.254.x.x = no DHCP.', 'Profiles: Public (hidden), Private (discoverable), Domain (automatic).', 'Firewall exceptions/restrictions; proxy; VPN; WWAN; metered connections limit data.'], lab: 'c2-netfeat' }
  });

  // ===================== 1.8 macOS =====================
  M('c2-mac', 'macOS feature finder', 'Name the feature or tool',
    'Pick the macOS feature for each description.', ['Finder', 'Dock', 'Spotlight', 'Mission Control', 'Keychain', 'Time Machine', 'FileVault', 'Disk Utility', 'Force Quit', 'Terminal', 'Continuity', 'iCloud'],
    [['The file manager (like File Explorer)', 'Finder', 'Always running.'],
     ['The bar of app icons at the bottom of the screen', 'Dock', 'Launch and switch apps.'],
     ['Search everything with Command + Space', 'Spotlight', 'Files, apps, settings, math.'],
     ['See all open windows and multiple desktops at once', 'Mission Control', 'Manage Spaces.'],
     ['Stores saved passwords and certificates securely', 'Keychain', 'Password manager.'],
     ['Built-in backup to an external drive with hourly snapshots', 'Time Machine', 'Restore files or the whole Mac.'],
     ['Full-disk encryption', 'FileVault', 'Like BitLocker.'],
     ['Partition, erase, format or repair (First Aid) a drive', 'Disk Utility', 'Like Disk Management + chkdsk.'],
     ['Close a frozen app with Command + Option + Esc', 'Force Quit', 'Like End task.'],
     ['The command line (zsh shell)', 'Terminal', 'UNIX commands.'],
     ['Start an email on the iPhone and finish it on the Mac', 'Continuity', 'Handoff between Apple devices.'],
     ['Sync photos, files and messages across Apple devices', 'iCloud', 'Drive, iMessage, FaceTime.']],
    'Windows ↔ Mac: File Explorer ↔ Finder, Taskbar ↔ Dock, BitLocker ↔ FileVault, Ctrl+Alt+Del/End task ↔ Force Quit.');
  M('c2-macfiles', 'macOS files and folders', 'Installers and system folders',
    'Pick the file type or folder.', ['.dmg', '.pkg', '.app', 'App Store', '/Applications', '/Users', '/Library', '/System', '~/Library (/Users/name/Library)'],
    [['A disk image you open, then drag the app out of', '.dmg', 'Mounts like a virtual disk.'],
     ['An installer package that runs a setup wizard and can place files system-wide', '.pkg', 'May ask for an admin password.'],
     ['The application bundle itself — looks like one file, is really a folder', '.app', 'Drag to Trash to uninstall most apps.'],
     ['Apple\'s vetted source of apps tied to an Apple ID', 'App Store', 'Automatic updates.'],
     ['Where installed apps live', '/Applications', 'All users.'],
     ['Where each person\'s home folder lives', '/Users', 'Documents, Desktop, Downloads.'],
     ['System-wide settings, fonts and support files shared by all users', '/Library', 'Local domain.'],
     ['macOS itself — protected; do not modify', '/System', 'System Integrity Protection.'],
     ['One user\'s own preferences and app support files (hidden by default)', '~/Library (/Users/name/Library)', 'Per-user settings.']],
    'Uninstall: drag the .app to the Trash (or use the vendor uninstaller for .pkg installs). Leftovers hide in ~/Library.');

  RK.add({ track: TR, id: '1.8', dom: 1, short: 'macOS features & tools', title: 'Explain common features and tools of the macOS/desktop operating system',
    goal: 'Install and remove Mac apps, know the system folders and settings, and use the key macOS features and tools.',
    kw: /\b(macos|mac os|\bmac\b|apple id|\.dmg|\.pkg|\.app\b|app store|finder|\bdock\b|spotlight|mission control|keychain|time machine|filevault|disk utility|force quit|terminal\b.*mac|continuity|icloud|gestures|system preferences|system settings|rapid security response)/,
    parts: [
      P('Installing apps and system folders', 'Install and uninstall Mac apps and name the main system folders.',
        `<p><b>Three installer types:</b></p>
<ul><li><b>.dmg</b> — a disk image. Double-click to mount it, then drag the app into Applications. Eject the image afterwards.</li>
<li><b>.pkg</b> — an installer package with a wizard. Can put files in system locations; may ask for an admin password.</li>
<li><b>.app</b> — the application itself. It is a <i>bundle</i>: one icon that is really a folder of files.</li>
<li><b>App Store</b> — vetted apps tied to an <b>Apple ID</b>; updates automatically.</li></ul>
<p><b>Uninstall:</b> drag the .app from Applications to the Trash and empty it. Apps installed by a .pkg may ship their own uninstaller.</p>
<table><tr><th>Folder</th><th>Holds</th></tr>
<tr><td><code>/Applications</code></td><td>Installed apps</td></tr>
<tr><td><code>/Users</code></td><td>Each user's home folder</td></tr>
<tr><td><code>/Library</code></td><td>Settings and support files for <i>all</i> users</td></tr>
<tr><td><code>/System</code></td><td>macOS itself (protected)</td></tr>
<tr><td><code>/Users/name/Library</code></td><td>One user's preferences and caches (hidden)</td></tr></table>
<p><b>Apple ID and corporate restrictions:</b> a personal Apple ID ties the Mac to the user's iCloud and purchases. Companies use <b>managed Apple IDs</b> and MDM to restrict the App Store, iCloud and settings.</p>`,
        [['Which macOS file type is a disk image that you mount and drag an app out of?', '.dmg', ['.pkg', '.app', '.exe'], 'A .dmg mounts like a virtual drive.'],
         ['How do you uninstall most Mac apps?', 'Drag the app from Applications to the Trash', ['Run Programs and Features', 'Delete /System', 'Use Disk Utility'], 'The .app bundle holds almost everything.']],
        'c2-macfiles'),
      P('System settings and best practices', 'Find macOS settings and apply backup, antivirus and update best practices.',
        `<p><b>System Preferences</b> (called <b>System Settings</b> on newer macOS) is the Mac's Settings app. Panes to know:</p>
<ul><li><b>Displays</b> — resolution, arrangement of multiple monitors.</li>
<li><b>Networks</b> — Wi-Fi, Ethernet, VPN, DNS, proxies.</li>
<li><b>Printers &amp; Scanners</b> — add or remove devices.</li>
<li><b>Privacy / Security</b> — app permissions (camera, mic, full disk access), FileVault, firewall.</li>
<li><b>Accessibility</b> — VoiceOver, zoom, display contrast.</li>
<li><b>Time Machine</b> — backups.</li></ul>
<p><b>Best practices:</b></p>
<ul><li><b>Backups</b> — <b>Time Machine</b> saves hourly snapshots to an external or network drive. You can restore one file or the whole Mac.</li>
<li><b>Antivirus</b> — Macs do get malware. macOS has built-in protection (Gatekeeper, XProtect); businesses add endpoint security.</li>
<li><b>Updates/patches</b> — Software Update installs macOS and security updates.</li>
<li><b>Rapid Security Response (RSR)</b> — small, urgent security fixes Apple ships between normal updates, often without a full restart.</li></ul>`,
        [['Which macOS feature makes automatic hourly backups to an external drive?', 'Time Machine', ['FileVault', 'Keychain', 'Mission Control'], 'Time Machine is the built-in backup.'],
         ['What is a Rapid Security Response?', 'A small urgent security fix released between regular macOS updates', ['A backup snapshot', 'An antivirus scan', 'A remote wipe command'], 'It patches quickly without a full OS update.']]),
      P('Features and tools', 'Use Finder, Dock, Spotlight, Mission Control, Keychain, iCloud, Disk Utility, FileVault, Terminal and Force Quit.',
        `<table><tr><th>Feature</th><th>What it is</th><th>Windows equivalent</th></tr>
<tr><td><b>Finder</b></td><td>File manager</td><td>File Explorer</td></tr>
<tr><td><b>Dock</b></td><td>App launcher bar</td><td>Taskbar</td></tr>
<tr><td><b>Spotlight</b> (⌘ + Space)</td><td>Search everything</td><td>Windows Search</td></tr>
<tr><td><b>Mission Control</b> / <b>multiple desktops</b></td><td>Overview of windows and Spaces</td><td>Task View / virtual desktops</td></tr>
<tr><td><b>Keychain</b></td><td>Saved passwords and certificates</td><td>Credential Manager</td></tr>
<tr><td><b>iCloud</b></td><td>iMessage, FaceTime, Drive sync</td><td>OneDrive + Microsoft account</td></tr>
<tr><td><b>Continuity</b></td><td>Handoff of work/calls between Apple devices</td><td>Phone Link</td></tr>
<tr><td><b>Gestures</b></td><td>Trackpad swipes and pinches</td><td>Touchpad gestures</td></tr>
<tr><td><b>Disk Utility</b></td><td>Erase, partition, <i>First Aid</i> repair</td><td>Disk Management + chkdsk</td></tr>
<tr><td><b>FileVault</b></td><td>Full-disk encryption</td><td>BitLocker</td></tr>
<tr><td><b>Terminal</b></td><td>Command line (zsh)</td><td>Command Prompt / PowerShell</td></tr>
<tr><td><b>Force Quit</b> (⌘ + ⌥ + Esc)</td><td>Kill a frozen app</td><td>Task Manager → End task</td></tr></table>
<div class="callout pro"><b class="k">On the job</b> A locked Keychain causes endless password prompts after a password reset. Fix: update or reset the login keychain.</div>`,
        [['A Mac app is frozen and will not close. What do you use?', 'Force Quit (Command + Option + Esc)', ['Disk Utility', 'Mission Control', 'Spotlight'], 'Force Quit ends the hung app.'],
         ['Which macOS tool encrypts the entire startup disk?', 'FileVault', ['Time Machine', 'Keychain', 'Finder'], 'FileVault is full-disk encryption.']],
        'c2-mac')
    ],
    wrap: { recap: ['.dmg = disk image (drag app out). .pkg = installer wizard. .app = the application bundle. App Store uses an Apple ID.', 'Uninstall: drag the .app to the Trash.', '/Applications, /Users, /Library (all users), /System (protected), ~/Library (one user).', 'System Preferences/Settings: Displays, Networks, Printers & Scanners, Privacy, Accessibility, Time Machine.', 'Time Machine = backup. FileVault = disk encryption. Keychain = passwords. Disk Utility = disks + First Aid.', 'Finder, Dock, Spotlight, Mission Control, Continuity, iCloud, Terminal, Force Quit. RSR = fast security fixes.'], lab: 'c2-mac' }
  });

  // ===================== 1.9 Linux =====================
  T('c2-lnx-files', 'Linux files and permissions', 'ls, pwd, cp, mv, rm, chmod, chown, grep, find',
    'You are logged in to an Ubuntu workstation as <b>tech</b>. Linux commands and file names are <b>case-sensitive</b>.',
    { shell: 'bash', prompt: 'tech@ws-lin01:~$' },
    [{ t: 'Print the full path of the directory you are in.', accept: [/^pwd$/], show: 'pwd', hint: 'Print working directory.', out: '/home/tech', why: 'pwd = print working directory.' },
     { t: 'List this directory in <b>long</b> format, including <b>hidden</b> files.', accept: [/^ls -(la|al)$/, /^ls -l -a$/, /^ls -a -l$/], show: 'ls -la', hint: 'ls with -l (long) and -a (all).', out: 'total 28\ndrwxr-x--- 4 tech tech 4096 Nov 14 09:02 .\ndrwxr-xr-x 3 root root 4096 Oct  2 11:40 ..\n-rw-r--r-- 1 tech tech  220 Oct  2 11:40 .bashrc\n-rwxr--r-- 1 tech tech  412 Nov 14 08:55 backup.sh\n-rw-r--r-- 1 root root 1893 Nov 13 17:20 inventory.csv\ndrwxr-xr-x 2 tech tech 4096 Nov 12 10:11 scripts', ask: { q: 'Who is the owner of inventory.csv?', accept: ['root'], why: 'Columns: permissions, links, owner, group, size, date, name. root owns it, so tech can read it but not change it.' }, why: 'ls -la shows permissions, owner, group and hidden dot-files.' },
     { t: 'Copy <b>backup.sh</b> into the <b>scripts</b> directory.', accept: [/^cp backup\.sh scripts\/?$/, /^cp \.\/backup\.sh \.?\/?scripts\/?$/, /^cp backup\.sh scripts\/backup\.sh$/], show: 'cp backup.sh scripts/', hint: 'cp source destination.', out: '', why: 'cp copies; the original stays.' },
     { t: 'Rename <b>inventory.csv</b> to <b>inventory-old.csv</b>. You do not own it, so run the command with administrator rights.', accept: [/^sudo mv inventory\.csv inventory-old\.csv$/], show: 'sudo mv inventory.csv inventory-old.csv', hint: 'mv renames (and moves). Put sudo in front to run it as root.', out: '[sudo] password for tech: ********', why: 'mv moves or renames. sudo runs one command as root.' },
     { t: 'Make <b>scripts/backup.sh</b> readable, writable and executable by the owner, and read + execute for group and others (numeric mode).', accept: [/^chmod 755 scripts\/backup\.sh$/, /^chmod 0755 scripts\/backup\.sh$/], show: 'chmod 755 scripts/backup.sh', hint: 'r=4 w=2 x=1. Owner 4+2+1, group 4+1, others 4+1.', out: '', why: '755 = rwx r-x r-x. The classic mode for a script.' },
     { t: 'Change the <b>owner</b> of inventory-old.csv to the user <b>tech</b> (needs admin rights).', accept: [/^sudo chown tech(:tech)? inventory-old\.csv$/], show: 'sudo chown tech inventory-old.csv', hint: 'chown = change owner: chown user file.', out: '', why: 'chown changes the owner (user:group changes both).' },
     { t: 'Search inside <b>inventory-old.csv</b> for lines containing the word <b>laptop</b>.', accept: [/^grep (-i )?['"]?laptop['"]? inventory-old\.csv$/], show: 'grep laptop inventory-old.csv', hint: 'grep pattern file.', out: 'A1042,laptop,Latitude 5440,jsmith\nA1077,laptop,ThinkPad T14,mlopez', why: 'grep prints lines that match a pattern.' },
     { t: 'Find every file under <b>/home/tech</b> whose name ends in <b>.sh</b>.', accept: [/^find (\/home\/tech|~|\.)\/? -name ['"]?\*\.sh['"]?$/], show: 'find /home/tech -name "*.sh"', hint: 'find where -name "pattern".', out: '/home/tech/backup.sh\n/home/tech/scripts/backup.sh', why: 'find searches a directory tree by name, type, size or date.' },
     { t: 'Delete the original <b>backup.sh</b> in your home directory (the copy in scripts stays).', accept: [/^rm (\.\/)?backup\.sh$/, /^rm ~\/backup\.sh$/, /^rm \/home\/tech\/backup\.sh$/], show: 'rm backup.sh', hint: 'rm = remove.', out: '', why: 'rm deletes immediately — there is no Recycle Bin.' }],
    'Permissions read in threes: owner, group, others. r=4, w=2, x=1. 755 = rwxr-xr-x, 644 = rw-r--r--.',
    ['Linux is case-sensitive and uses forward slashes.']);
  T('c2-lnx-admin', 'Linux admin and network checks', 'apt, df, du, ps, top, ip, ping, dig, cat, man',
    'A user says their Ubuntu PC is "full and slow" and cannot reach a web server. Investigate from the terminal.',
    { shell: 'bash', prompt: 'tech@ws-lin01:~$' },
    [{ t: 'Show disk <b>free space</b> for every mounted filesystem in human-readable sizes.', accept: [/^df -h$/, /^df -hT$/, /^df -Th$/], show: 'df -h', hint: 'df = disk free; -h = human-readable.', out: 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/nvme0n1p2  234G  221G  1.2G 100% /\n/dev/nvme0n1p1  511M  6.1M  505M   2% /boot/efi', ask: { q: 'What percentage of / is used?', accept: ['100', '100%'], why: 'The root filesystem is full — that alone can make a system slow and break updates.' }, why: 'df shows free space per filesystem.' },
     { t: 'Show the total size of the <b>/var/log</b> directory (summary, human-readable; needs admin rights).', accept: [/^sudo du -sh \/var\/log\/?$/, /^sudo du -hs \/var\/log\/?$/], show: 'sudo du -sh /var/log', hint: 'du = disk usage; -s summary, -h human-readable.', out: '187G\t/var/log', why: 'du shows how much space a directory uses. The logs are eating the disk.' },
     { t: 'List <b>all</b> running processes with full details (BSD style).', accept: [/^ps aux$/, /^ps -aux$/, /^ps -ef$/], show: 'ps aux', hint: 'ps with a, u and x.', out: 'USER   PID %CPU %MEM COMMAND\nroot     1  0.0  0.1 /sbin/init\ntech  4821 98.7  2.1 /opt/sync/syncd --verbose\ntech  5033  0.3  1.0 /usr/bin/gnome-shell', ask: { q: 'What is the PID of the process using almost all the CPU?', accept: ['4821'], why: 'syncd is spinning at 98.7% CPU and (with --verbose) is what is filling /var/log.' }, why: 'ps is a snapshot of processes; top is the live view.' },
     { t: 'Refresh the package list from the software repositories (needs admin rights).', accept: [/^sudo apt(-get)? update$/], show: 'sudo apt update', hint: 'apt is the Debian/Ubuntu package manager.', out: 'Hit:1 http://archive.ubuntu.com/ubuntu noble InRelease\nReading package lists... Done\n12 packages can be upgraded. Run \'apt list --upgradable\' to see them.', why: 'apt update refreshes the list; apt upgrade installs the updates. (dnf does both jobs on Red Hat/Fedora.)' },
     { t: 'Show this PC\'s network addresses with the modern Linux tool.', accept: [/^ip a(ddr)?( show)?$/, /^ip -br a(ddr)?$/], show: 'ip addr', hint: 'The ip command, then addr.', out: '2: enp0s3: <BROADCAST,MULTICAST,UP,LOWER_UP>\n    inet 10.20.30.61/24 brd 10.20.30.255 scope global dynamic enp0s3', why: 'ip addr replaces the old ifconfig.' },
     { t: 'Send exactly <b>3</b> pings to <b>10.20.30.1</b>.', accept: [/^ping -c ?3 10\.20\.30\.1$/, /^ping 10\.20\.30\.1 -c ?3$/], show: 'ping -c 3 10.20.30.1', hint: 'Linux ping runs forever unless you give it a count with -c.', out: '64 bytes from 10.20.30.1: icmp_seq=1 ttl=64 time=0.41 ms\n64 bytes from 10.20.30.1: icmp_seq=2 ttl=64 time=0.38 ms\n64 bytes from 10.20.30.1: icmp_seq=3 ttl=64 time=0.40 ms\n3 packets transmitted, 3 received, 0% packet loss', why: 'ping -c sets the count; Ctrl+C stops an endless ping.' },
     { t: 'Look up the DNS record for <b>web01.corp.local</b> with the Linux DNS tool.', accept: [/^dig web01\.corp\.local( a)?$/i, /^dig \+short web01\.corp\.local$/i], show: 'dig web01.corp.local', hint: 'Three letters; the Linux cousin of nslookup.', out: ';; ANSWER SECTION:\nweb01.corp.local.   3600  IN  A  10.20.40.80\n\n;; SERVER: 10.20.30.5#53', why: 'dig queries DNS and shows the answer and which server replied.' },
     { t: 'Display the file that lists which DNS servers this machine uses.', accept: [/^cat \/etc\/resolv\.conf$/], show: 'cat /etc/resolv.conf', hint: 'cat prints a file. The file is in /etc and its name starts with "resolv".', out: 'nameserver 10.20.30.5\nsearch corp.local', why: '/etc/resolv.conf holds the DNS servers.' },
     { t: 'Open the manual page for the <b>chmod</b> command.', accept: [/^man chmod$/], show: 'man chmod', hint: 'man = manual.', out: 'CHMOD(1)                User Commands\n\nNAME\n       chmod - change file mode bits\n\nSYNOPSIS\n       chmod [OPTION]... MODE[,MODE]... FILE...', why: 'man is the built-in help for every command (q to quit).' }],
    'You proved the cause: a runaway process (PID 4821) logging verbosely filled the disk. Next steps would be stopping it (kill 4821 or systemctl stop) and clearing the logs.',
    ['df = whole filesystems, du = one directory. ps = snapshot, top = live.']);
  M('c2-lnx-conf', 'Linux files and components', '/etc files, systemd, kernel, bootloader, root',
    'Pick the file or component.', ['/etc/passwd', '/etc/shadow', '/etc/hosts', '/etc/fstab', '/etc/resolv.conf', 'systemd', 'Kernel', 'Bootloader (GRUB)', 'root', 'nano'],
    [['List of user accounts (name, UID, home directory, shell)', '/etc/passwd', 'World-readable; no passwords inside.'],
     ['Hashed passwords; readable only by root', '/etc/shadow', 'Password hashes and aging.'],
     ['Local name-to-IP table checked before DNS', '/etc/hosts', 'Static name entries.'],
     ['Which filesystems mount automatically at boot', '/etc/fstab', 'Filesystem table.'],
     ['Which DNS servers to query', '/etc/resolv.conf', 'nameserver lines.'],
     ['Starts and manages services (systemctl start/stop/enable)', 'systemd', 'The init system, PID 1.'],
     ['The core of the OS that talks to hardware', 'Kernel', 'Linux itself.'],
     ['Loads the kernel at power-on and shows the boot menu', 'Bootloader (GRUB)', 'First software after firmware.'],
     ['The all-powerful administrator account (UID 0)', 'root', 'Use sudo instead of logging in as root.'],
     ['Simple terminal text editor (Ctrl+O save, Ctrl+X exit)', 'nano', 'Beginner-friendly editor.']],
    'passwd = who exists. shadow = their password hashes. hosts = names. fstab = mounts. resolv.conf = DNS.');

  RK.add({ track: TR, id: '1.9', dom: 1, short: 'Linux features & tools', title: 'Identify common features and tools of the Linux client/desktop operating system',
    goal: 'Use the exam\'s Linux commands for files, permissions, packages, networking and information, and know the key config files and OS components.',
    kw: /\b(linux|ubuntu|\bls\b|\bpwd\b|\bmv\b|\bcp\b|\brm\b|chmod|chown|grep|\bfind\b|fsck|\bmount\b|\bsu\b|sudo|\bapt\b|\bdnf\b|\byum\b|\bcurl\b|\bdig\b|traceroute|\bman\b|\bcat\b|\btop\b|\bps\b|\bdu\b|\bdf\b|nano|\/etc\/|passwd|shadow|fstab|resolv|systemd|systemctl|kernel|bootloader|grub|root account|bash)/,
    parts: [
      P('Files and navigation: ls, pwd, cp, mv, rm, find, grep', 'Move around a Linux filesystem and copy, move, delete and search files.',
        `<p>Linux has one tree starting at <code>/</code> (root). No drive letters. Paths use <b>forward</b> slashes and everything is <b>case-sensitive</b>. Your home is <code>/home/yourname</code>, also written <code>~</code>.</p>
<table><tr><th>Command</th><th>Does</th><th>Example</th></tr>
<tr><td><code>pwd</code></td><td>Print working directory</td><td><code>pwd</code></td></tr>
<tr><td><code>ls</code></td><td>List files</td><td><code>ls -l</code> (details) · <code>ls -a</code> (hidden) · <code>ls -la</code></td></tr>
<tr><td><code>cp</code></td><td>Copy</td><td><code>cp a.txt backup/</code> · <code>cp -r dir1 dir2</code></td></tr>
<tr><td><code>mv</code></td><td>Move <i>or rename</i></td><td><code>mv old.txt new.txt</code></td></tr>
<tr><td><code>rm</code></td><td>Remove (no Recycle Bin)</td><td><code>rm file</code> · <code>rm -r folder</code></td></tr>
<tr><td><code>find</code></td><td>Search for files</td><td><code>find /home -name "*.log"</code></td></tr>
<tr><td><code>grep</code></td><td>Search <i>inside</i> files</td><td><code>grep error app.log</code> · <code>-i</code> ignore case</td></tr>
<tr><td><code>cat</code></td><td>Print a file</td><td><code>cat /etc/hosts</code></td></tr>
<tr><td><code>nano</code></td><td>Simple text editor</td><td><code>nano notes.txt</code></td></tr></table>
<p>Files whose names start with a dot (<code>.bashrc</code>) are hidden.</p>`,
        [['Which Linux command renames a file?', 'mv', ['cp', 'rm', 'ls'], 'mv moves or renames.'],
         ['Which command searches for text inside files?', 'grep', ['find', 'pwd', 'cat'], 'find looks for files; grep looks inside them.']]),
      P('Permissions and admin rights: chmod, chown, su, sudo', 'Read rwx permissions, change them with chmod/chown, and run commands as root safely.',
        `<p><code>ls -l</code> shows something like <code>-rwxr-xr--</code>. After the first character (file type) come three groups:</p>
<table><tr><th>Owner</th><th>Group</th><th>Others</th></tr><tr><td><code>rwx</code></td><td><code>r-x</code></td><td><code>r--</code></td></tr></table>
<p><b>r</b>ead = 4, <b>w</b>rite = 2, e<b>x</b>ecute = 1. Add them per group: <code>rwx</code> = 7, <code>r-x</code> = 5, <code>r--</code> = 4 → <b>754</b>.</p>
<ul><li><code>chmod 755 script.sh</code> — set permissions. Common: <b>755</b> (scripts/folders), <b>644</b> (documents), <b>600</b> (private).</li>
<li><code>chmod +x script.sh</code> — add execute so it can run.</li>
<li><code>chown user:group file</code> — change owner (and group).</li></ul>
<p><b>The root account</b> (UID 0) can do anything, including destroying the system.</p>
<ul><li><code>sudo command</code> — run <b>one</b> command as root, using <i>your</i> password. It is logged. Preferred.</li>
<li><code>su</code> — <b>switch user</b>; <code>su -</code> becomes root until you type <code>exit</code>, using <i>root's</i> password.</li></ul>
<div class="callout trap"><b class="k">Exam trap</b> "Permission denied" when running your own script → it is missing execute: <code>chmod +x</code>. "Permission denied" on a system file → you need <code>sudo</code>.</div>`,
        [['What does chmod 644 give the owner?', 'Read and write', ['Read, write and execute', 'Read only', 'Execute only'], '6 = 4 (read) + 2 (write).'],
         ['Which command runs a single command with root privileges and logs it?', 'sudo', ['su', 'chown', 'man'], 'sudo elevates one command.']],
        'c2-lnx-files'),
      P('Packages, disks and system information', 'Use apt/dnf, df, du, mount, fsck, ps, top and man.',
        `<p><b>Package management</b> — software comes from repositories:</p>
<ul><li><b>apt</b> (Debian, Ubuntu, Mint): <code>sudo apt update</code> (refresh list) → <code>sudo apt upgrade</code> (install updates) · <code>sudo apt install nmap</code>.</li>
<li><b>dnf</b> (Red Hat, Fedora, Rocky): <code>sudo dnf install nmap</code> · <code>sudo dnf upgrade</code>.</li></ul>
<table><tr><th>Command</th><th>Shows / does</th></tr>
<tr><td><code>df -h</code></td><td>Free space on each <i>filesystem</i></td></tr>
<tr><td><code>du -sh folder</code></td><td>Space used by one <i>directory</i></td></tr>
<tr><td><code>mount</code></td><td>Attach a filesystem to a folder (<code>mount /dev/sdb1 /mnt/usb</code>)</td></tr>
<tr><td><code>fsck</code></td><td>Check and repair a filesystem (run on <b>unmounted</b> volumes) — Linux's chkdsk</td></tr>
<tr><td><code>ps</code></td><td>Snapshot of processes (<code>ps aux</code>)</td></tr>
<tr><td><code>top</code></td><td>Live process view — Linux's Task Manager (q quits)</td></tr>
<tr><td><code>man</code></td><td>Manual page for any command (<code>man ls</code>)</td></tr></table>
<p><b>OS components:</b> the <b>bootloader</b> (GRUB) loads the <b>kernel</b> (the core that controls hardware); the kernel starts <b>systemd</b>, which starts and supervises every service (<code>systemctl status ssh</code>).</p>`,
        [['Which package manager does Ubuntu use?', 'apt', ['dnf', 'msi', 'brew'], 'Debian-family distros use apt.'],
         ['Which command shows free space on every mounted filesystem?', 'df -h', ['du -sh', 'ps aux', 'fsck'], 'df = disk free.'],
         ['Which Linux command gives a live, updating list of processes?', 'top', ['ps', 'cat', 'man'], 'top refreshes continuously.']],
        'c2-lnx-admin'),
      P('Networking and configuration files', 'Use ip, ping, curl, dig, traceroute and read the key files in /etc.',
        `<table><tr><th>Command</th><th>Does</th><th>Windows cousin</th></tr>
<tr><td><code>ip addr</code> / <code>ip route</code></td><td>Show IP addresses / routing table</td><td>ipconfig</td></tr>
<tr><td><code>ping -c 4 host</code></td><td>Reachability (runs forever without <code>-c</code>)</td><td>ping</td></tr>
<tr><td><code>dig name</code></td><td>DNS lookup</td><td>nslookup</td></tr>
<tr><td><code>traceroute host</code></td><td>Hops along the path</td><td>tracert</td></tr>
<tr><td><code>curl URL</code></td><td>Fetch a web page or API from the terminal; tests a web server</td><td>—</td></tr></table>
<p><b>Configuration files</b> are plain text in <code>/etc</code>:</p>
<table><tr><th>File</th><th>Contains</th></tr>
<tr><td><code>/etc/passwd</code></td><td>User accounts (name, UID, home, shell) — no passwords</td></tr>
<tr><td><code>/etc/shadow</code></td><td>Password <b>hashes</b>; root-only</td></tr>
<tr><td><code>/etc/hosts</code></td><td>Local name → IP entries, checked before DNS</td></tr>
<tr><td><code>/etc/fstab</code></td><td>Filesystems to mount at boot</td></tr>
<tr><td><code>/etc/resolv.conf</code></td><td>DNS servers to use</td></tr></table>
<div class="callout pro"><b class="k">On the job</b> A bad line in <code>/etc/fstab</code> can stop a Linux box booting. Always back the file up before editing and test with <code>mount -a</code>.</div>`,
        [['Which file stores hashed user passwords on Linux?', '/etc/shadow', ['/etc/passwd', '/etc/hosts', '/etc/fstab'], 'passwd lists accounts; shadow holds the hashes.'],
         ['Which Linux command is the equivalent of nslookup?', 'dig', ['curl', 'df', 'grep'], 'dig queries DNS.']],
        'c2-lnx-conf')
    ],
    wrap: { recap: ['One tree from /; forward slashes; case-sensitive; ~ is your home.', 'ls, pwd, cp, mv (move/rename), rm, find (files), grep (inside files), cat, nano.', 'rwx = 4,2,1 for owner/group/others: 755, 644. chmod sets them; chown changes owner.', 'sudo = one command as root (logged). su = switch user. root = UID 0.', 'apt (Debian/Ubuntu), dnf (Red Hat). df = filesystems, du = a directory, fsck = repair, mount = attach. ps snapshot, top live, man help.', 'ip, ping -c, dig, traceroute, curl. /etc/passwd, shadow, hosts, fstab, resolv.conf. Bootloader → kernel → systemd.'], lab: 'c2-lnx-conf' }
  });

  // ===================== 1.10 Application installation =====================
  M('c2-appreq', 'Will the app install?', 'Requirements check',
    'An app needs: 64-bit OS, 8 GB RAM, 4 GB VRAM on a dedicated GPU, 20 GB free storage and a USB license token. Pick the result for each PC.',
    ['Meets the requirements', 'Fails: 32-bit OS', 'Fails: not enough RAM', 'Fails: integrated graphics / VRAM', 'Fails: not enough storage', 'Fails: hardware token missing'],
    [['64-bit Windows 11, 16 GB RAM, RTX card with 8 GB VRAM, 200 GB free, token plugged in', 'Meets the requirements', 'All boxes ticked.'],
     ['32-bit Windows 10, 4 GB RAM', 'Fails: 32-bit OS', 'A 64-bit app cannot run on a 32-bit OS.'],
     ['64-bit Windows 11, 4 GB RAM, RTX card 8 GB VRAM, 100 GB free, token present', 'Fails: not enough RAM', 'Needs 8 GB.'],
     ['64-bit Windows 11, 16 GB RAM, Intel integrated graphics, 100 GB free, token present', 'Fails: integrated graphics / VRAM', 'Integrated GPUs share system RAM; no dedicated VRAM.'],
     ['64-bit Windows 11, 16 GB RAM, dedicated 6 GB GPU, 9 GB free, token present', 'Fails: not enough storage', 'Needs 20 GB.'],
     ['64-bit Windows 11, 32 GB RAM, dedicated 8 GB GPU, 500 GB free, no USB key', 'Fails: hardware token missing', 'The licensing dongle is required.']],
    'A 64-bit OS can run 32-bit apps, but a 32-bit OS cannot run 64-bit apps.');
  M('c2-appimpact', 'Impact of a new application', 'Device, network, operation, business',
    'A company plans to roll out a new video-conferencing app to 500 PCs. Classify each concern.', ['Impact to device', 'Impact to network', 'Impact to operation', 'Impact to business'],
    [['Older laptops will run hot and slow while the app is open', 'Impact to device', 'CPU, RAM, storage, battery.'],
     ['HD video for 500 users may saturate the Internet link', 'Impact to network', 'Bandwidth and firewall ports.'],
     ['Help desk needs training and users need a how-to guide', 'Impact to operation', 'Support, training, workflow.'],
     ['Licensing costs $40,000 a year and meetings stop if the service is down', 'Impact to business', 'Cost, risk, productivity.'],
     ['The installer needs 6 GB on each PC\'s small SSD', 'Impact to device', 'Storage.'],
     ['Firewall rules must allow new outbound ports', 'Impact to network', 'Network change.']],
    'Before any rollout, ask: what does it do to the device, the network, daily operations and the business?');

  RK.add({ track: TR, id: '1.10', dom: 1, short: 'Application installation', title: 'Given a scenario, install applications according to requirements',
    goal: 'Check system requirements, choose a distribution method, and think through the impact of a new application.',
    kw: /\b(32.bit|64.bit|x86\b|dedicated (graphics|gpu)|integrated graphics|vram|system requirement|hardware token|dongle|\biso\b|mountable|physical media|downloadable|distribution method|impact to|application install|install(ing)? (an |the )?app)/,
    parts: [
      P('System requirements', 'Check an application\'s requirements against a PC: 32/64-bit, CPU, RAM, GPU/VRAM, storage, tokens and OS.',
        `<p>Before installing, compare the app's <b>minimum requirements</b> with the PC.</p>
<ul><li><b>32-bit vs 64-bit</b> — a 64-bit OS runs both 64-bit and 32-bit apps. A 32-bit OS runs <b>only</b> 32-bit apps and can use only about 4 GB of RAM. (32-bit is also called <b>x86</b>; 64-bit is <b>x64</b>.)</li>
<li><b>CPU</b> — minimum speed/cores, sometimes specific features.</li>
<li><b>RAM</b> — memory the app needs in addition to the OS.</li>
<li><b>Dedicated vs integrated graphics</b> — a <b>dedicated</b> card has its own memory (<b>VRAM</b>) and is far faster. <b>Integrated</b> graphics are built into the CPU and borrow system RAM. CAD, video editing and games often demand dedicated graphics with a minimum VRAM.</li>
<li><b>Storage</b> — free space to install and to work.</li>
<li><b>External hardware tokens</b> — a USB license key (dongle) or security key the app needs to run.</li>
<li><b>Application-to-OS compatibility</b> — the app must support this OS and version.</li></ul>
<p>Check a PC quickly: <b>Settings → System → About</b> (CPU, RAM, 64-bit) and <code>msinfo32</code>; GPU and VRAM in Task Manager → Performance → GPU.</p>`,
        [['Which statement about 32-bit and 64-bit is true?', 'A 64-bit OS can run 32-bit apps, but a 32-bit OS cannot run 64-bit apps', ['A 32-bit OS can run 64-bit apps slowly', '32-bit and 64-bit apps are interchangeable', 'A 64-bit OS cannot run 32-bit apps'], '64-bit is backward compatible.'],
         ['A CAD program requires 4 GB of VRAM. What must the PC have?', 'A dedicated graphics card with at least 4 GB of its own memory', ['4 GB more system RAM', 'A 4 GB flash drive', 'Integrated graphics'], 'VRAM is the graphics card\'s memory.']],
        'c2-appreq'),
      P('Distribution methods and impact', 'Choose how software is delivered and weigh its impact on device, network, operation and business.',
        `<p><b>Distribution methods:</b></p>
<ul><li><b>Physical media</b> — DVD or USB from the vendor. Rare today; needs a drive.</li>
<li><b>Mountable ISO file</b> — a disk image of the media. Double-click in Windows to mount it as a virtual drive; no physical disc needed.</li>
<li><b>Downloadable package</b> — an installer from the vendor's site or an app store (.exe/.msi on Windows). Download only from the official source and verify it.</li>
<li><b>Image deployment</b> — the app is baked into the OS image, or pushed by management software to many PCs at once.</li></ul>
<p><b>Other considerations for new applications — impact to:</b></p>
<table><tr><th>Area</th><th>Ask</th></tr>
<tr><td><b>Device</b></td><td>Will it slow the PC, fill the drive, drain the battery, conflict with other software?</td></tr>
<tr><td><b>Network</b></td><td>How much bandwidth? New firewall ports? Does it scan or broadcast?</td></tr>
<tr><td><b>Operation</b></td><td>Do users and the help desk need training? Does it change a workflow?</td></tr>
<tr><td><b>Business</b></td><td>Cost and licensing, compliance, what happens if it fails?</td></tr></table>
<div class="callout pro"><b class="k">On the job</b> Installing needs administrator rights. Standard users see a UAC prompt — that is by design, and it is why "can you install this for me?" is a daily ticket.</div>`,
        [['What is an ISO file?', 'A disk image that can be mounted as a virtual drive', ['A compressed photo', 'A driver package', 'A license key'], 'ISO = an image of an optical disc.'],
         ['A new app will use a lot of bandwidth for video. Which impact area is that?', 'Impact to network', ['Impact to device', 'Impact to business', 'Impact to operation'], 'Bandwidth and ports are network impacts.']],
        'c2-appimpact')
    ],
    wrap: { recap: ['64-bit OS runs 32- and 64-bit apps; 32-bit OS runs only 32-bit and ~4 GB RAM.', 'Check CPU, RAM, storage, and dedicated GPU/VRAM vs integrated graphics.', 'External hardware tokens (USB license/security keys) may be required.', 'Distribution: physical media, mountable ISO, downloadable package, image deployment.', 'Download only from trusted sources; installing needs admin rights.', 'Weigh impact to device, network, operation and business before rollout.'], lab: 'c2-appimpact' }
  });

  // ===================== 1.11 Cloud productivity tools =====================
  M('c2-cloud', 'Cloud productivity help desk', 'Email, storage, collaboration, identity, licensing',
    'Pick the area each ticket belongs to.', ['License assignment', 'Identity synchronization', 'Storage sync settings', 'Email system', 'Collaboration tools'],
    [['New hire can sign in to the portal but sees "You don\'t have a license to use this product" in the desktop apps', 'License assignment', 'Assign a license to the account.'],
     ['User changed their password on the domain PC but the cloud still wants the old one', 'Identity synchronization', 'Directory sync has not run or is failing.'],
     ['A folder shows a cloud icon and will not open on a plane with no Internet', 'Storage sync settings', 'Files are online-only; mark "Always keep on this device".'],
     ['Outlook on a new laptop needs to be connected to the user\'s hosted mailbox', 'Email system', 'Add the account; it autodiscovers.'],
     ['Team wants to edit one spreadsheet together and chat while doing it', 'Collaboration tools', 'Co-authoring and instant messaging.'],
     ['A disabled employee\'s account is still active in the cloud suite', 'Identity synchronization', 'Account state must sync from the directory.'],
     ['The sync app is uploading the whole Downloads folder over a slow link', 'Storage sync settings', 'Choose which folders sync.']],
    'Most cloud-suite tickets are one of three things: no license, identity not synced, or sync settings.');

  RK.add({ track: TR, id: '1.11', dom: 1, short: 'Cloud productivity tools', title: 'Given a scenario, install and configure cloud-based productivity tools',
    goal: 'Set up cloud email, storage sync and collaboration tools, and fix identity-sync and license problems.',
    kw: /\b(cloud.based|productivity (tool|suite)|microsoft 365|office 365|google workspace|onedrive|sharepoint|\bteams\b|videoconferenc|instant messag|collaboration|co.author|identity sync|license assign|sync(hroniz)?(e|ation)? (settings|folder|client)|files on.demand|hosted (mail|email)|exchange online)/,
    parts: [
      P('Email, storage and collaboration', 'Install and configure cloud email, file sync and collaboration apps.',
        `<p>Most companies now rent their office tools as a cloud suite (<b>Microsoft 365</b> or <b>Google Workspace</b>). One account unlocks everything.</p>
<ul><li><b>Email systems</b> — the mailbox lives in the cloud (Exchange Online, Gmail). Users reach it by web browser or a client such as Outlook. Adding the account usually needs only the email address: settings are found automatically.</li>
<li><b>Storage</b> — OneDrive, SharePoint, Google Drive. A <b>sync client</b> keeps a local folder matched with the cloud.
<ul><li><b>Sync/folder settings</b>: choose which folders sync. <i>Online-only</i> files (cloud icon) save disk space but need Internet; <i>Always keep on this device</i> (green tick) works offline.</li>
<li>Known-folder backup redirects Desktop/Documents/Pictures to the cloud.</li></ul></li>
<li><b>Collaboration tools</b>:
<ul><li><b>Spreadsheets, word processing, presentations</b> — several people edit one file at once (co-authoring) with version history.</li>
<li><b>Videoconferencing</b> — Teams, Zoom, Meet: check camera/mic permissions and bandwidth.</li>
<li><b>Instant messaging</b> — chat, channels, presence.</li></ul></li></ul>
<div class="callout pro"><b class="k">On the job</b> "My file is gone" in a synced folder → check the cloud recycle bin and <b>version history</b> before anything else.</div>`,
        [['A synced file shows a cloud icon and cannot be opened without Internet. Why?', 'It is online-only and not stored on the device', ['The license expired', 'The file is corrupted', 'The user lacks admin rights'], 'Mark it "Always keep on this device" for offline use.'],
         ['Which feature lets several people edit the same document at the same time?', 'Co-authoring in a cloud collaboration tool', ['Mapped drives', 'Email attachments', 'Disk mirroring'], 'Cloud suites support simultaneous editing.']]),
      P('Identity synchronization and licensing', 'Explain identity sync between the directory and the cloud, and assign licenses.',
        `<p><b>Identity synchronization</b> — the company's on-premises directory (Active Directory) is copied to the cloud directory (for example Microsoft Entra ID) on a schedule. Result: users sign in to cloud apps with the <b>same username and password</b> as their PC, often with <b>single sign-on</b>.</p>
<ul><li>A password change, a new user or a disabled account must <b>sync</b> before the cloud sees it. If it has not, the user gets the old behavior.</li>
<li>Typical fix: wait for or trigger the sync, and check the sync health in the admin portal.</li></ul>
<p><b>License assignment</b> — having an account is not enough. An admin must <b>assign a license</b> (a subscription seat) to the user before the apps and mailbox work.</p>
<ul><li>Symptoms of a missing license: no mailbox, apps in reduced-functionality/read-only mode, "You don't have a license" messages.</li>
<li>Licenses are often assigned by <b>group</b>, so adding the user to the right group fixes it.</li>
<li>When someone leaves: block sign-in, keep or transfer their data, then <b>remove the license</b> so it can be reused.</li></ul>`,
        [['A new user has an account but the office apps open in read-only mode. What is the most likely cause?', 'No license has been assigned to the account', ['The PC needs more RAM', 'The firewall is blocking email', 'The sync folder is full'], 'Assign a subscription license.'],
         ['What does identity synchronization provide?', 'The same sign-in credentials on-premises and in the cloud', ['Faster Wi-Fi', 'Automatic backups of every PC', 'Free licenses'], 'It copies directory accounts to the cloud directory.']],
        'c2-cloud')
    ],
    wrap: { recap: ['Cloud suites (Microsoft 365, Google Workspace): email, storage, collaboration under one account.', 'Sync clients match a local folder with the cloud; choose which folders sync.', 'Online-only files need Internet; "Always keep on this device" works offline.', 'Collaboration: co-authoring docs/sheets/slides, videoconferencing, instant messaging.', 'Identity sync copies directory accounts to the cloud; changes must sync before the cloud sees them.', 'An account needs a license assigned before apps and mailbox work; remove it when the user leaves.'], lab: 'c2-cloud' }
  });

  // ===================== Domain 1 combined terminal lab =====================
  T('c2-d1-wrap', 'Domain 1 shift: three tickets, two operating systems', 'Mixed Windows and Linux command line',
    'You are covering the help desk. Three quick tickets — the first four tasks are on a Windows PC, the rest after you connect to a Linux workstation. No hints in the task text: this is the domain check.',
    { shell: 'cmd', prompt: 'C:\\Windows\\System32>' },
    [{ t: '<b>Ticket 1 (Windows):</b> "What version am I on?" — Show the Windows version and build.', accept: [/^winver$/i], show: 'winver', hint: 'Objective 1.5, informational commands.', out: '[About Windows]\nWindows 11 Pro   Version 24H2 (OS Build 26100.2314)', why: '1.5 — winver.' },
     { t: '<b>Ticket 1:</b> The PC has an address starting 169.254. Ask DHCP for a new lease.', accept: [/^ipconfig ?\/renew$/i], show: 'ipconfig /renew', hint: 'ipconfig with the switch that renews.', out: 'Ethernet adapter Ethernet:\n   IPv4 Address. . . . . . . . : 10.20.30.57\n   Subnet Mask . . . . . . . . : 255.255.255.0\n   Default Gateway . . . . . . : 10.20.30.1', why: '1.5/1.7 — APIPA means no DHCP answer; /renew asks again.' },
     { t: '<b>Ticket 2 (Windows):</b> Random crashes after a power cut. Verify and repair Windows system files.', accept: [/^sfc ?\/scannow$/i], show: 'sfc /scannow', hint: 'System File Checker.', out: 'Verification 100% complete.\nWindows Resource Protection did not find any integrity violations.', why: '1.5 — sfc checks system files. Clean result → look at the disk next.' },
     { t: '<b>Ticket 2:</b> Open the tool that shows the System log so you can look for disk errors.', accept: [/^eventvwr(\.msc|\.exe)?$/i], show: 'eventvwr.msc', hint: 'Objective 1.4 — the log viewer\'s run name.', out: '[Event Viewer opened]\nWindows Logs > System\n  Warning  disk  Event ID 153  The IO operation at logical block address was retried.', why: '1.4 — Event ID 153 warns of disk I/O problems: back up and run chkdsk /r.' },
     { t: '<b>Ticket 3 (Linux):</b> Connect to the Linux workstation <b>ws-lin01</b> as user <b>tech</b> using the secure remote shell.', accept: [/^ssh tech@ws-lin01$/i, /^ssh -l tech ws-lin01$/i], show: 'ssh tech@ws-lin01', hint: 'ssh user@host (covered in depth in objective 4.9).', out: 'tech@ws-lin01\'s password: ********\nWelcome to Ubuntu 24.04 LTS', prompt: 'tech@ws-lin01:~$', shell: 'bash', why: 'ssh user@host opens an encrypted terminal on another machine (TCP 22).' },
     { t: '<b>Ticket 3:</b> The user\'s script will not run: "Permission denied". Show the long listing for <b>report.sh</b>.', accept: [/^ls -la? report\.sh$/, /^ls -al report\.sh$/], show: 'ls -l report.sh', hint: 'ls in long format, then the file name.', out: '-rw-r--r-- 1 tech tech 310 Nov 15 14:02 report.sh', ask: { q: 'Which permission is missing for the owner? (read, write or execute)', accept: ['execute', 'x'], why: 'rw- for the owner: no x, so the shell refuses to run it.' }, why: '1.9 — read the permission string before guessing.' },
     { t: '<b>Ticket 3:</b> Add execute permission to <b>report.sh</b>.', accept: [/^chmod \+x report\.sh$/, /^chmod u\+x report\.sh$/, /^chmod 7[0-7][0-7] report\.sh$/, /^chmod a\+x report\.sh$/], show: 'chmod +x report.sh', hint: 'chmod with +x.', out: '', why: '1.9 — chmod +x makes a script runnable.' },
     { t: '<b>Ticket 3:</b> Before you leave, check how full the disks are (human-readable).', accept: [/^df -h$/], show: 'df -h', hint: 'Disk free.', out: 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/nvme0n1p2  234G   88G  135G  40% /', why: '1.9 — df -h. 40% used: healthy.' }],
    'That was every command-line skill in Domain 1: Windows informational, network and repair commands, the snap-in run names, and Linux permissions. If any task needed the answer shown, flip back to 1.4, 1.5 or 1.9 before the domain test.',
    ['Each task names its objective in the takeaway. Flip back to that objective if you are stuck.']);
})();
