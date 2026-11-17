/* A+ Core 2 (220-1202) — Domain 1.0 Operating Systems — objectives 1.1 to 1.6 */
(function () {
  var RK = window.RK, P = RK.P, M = RK.M, O = RK.O, T = RK.T, TR = 'core2';

  // ===================== 1.1 OS types =====================
  M('c2-os-pick', 'Pick the operating system', 'Workstation and mobile OS scenarios',
    'Pick the operating system that best fits each description.', ['Windows', 'Linux', 'macOS', 'ChromeOS', 'iOS / iPadOS', 'Android'],
    [['Runs most business software and joins Active Directory domains out of the box', 'Windows', 'The standard corporate desktop.'],
     ['Free, open-source kernel sold as "distributions" such as Ubuntu and Fedora', 'Linux', 'Distros bundle the kernel with tools.'],
     ['Runs only on Apple desktops and laptops', 'macOS', 'Apple hardware only.'],
     ['Cheap school laptop that is mostly a web browser and stores work in the cloud', 'ChromeOS', 'Chromebooks.'],
     ['Closed mobile OS; apps come only from Apple\'s App Store', 'iOS / iPadOS', 'Apple controls hardware and store.'],
     ['Open-source mobile OS used by many phone makers, each adding its own skin', 'Android', 'Based on the Linux kernel.']],
    'Windows, Linux, macOS and ChromeOS are workstation OSes. iOS, iPadOS and Android are mobile OSes.');
  M('c2-fs-pick', 'Pick the filesystem', 'NTFS, ReFS, FAT32, exFAT, ext4, XFS, APFS',
    'Pick the filesystem that fits each job.', ['NTFS', 'ReFS', 'FAT32', 'exFAT', 'ext4', 'XFS', 'APFS'],
    [['Windows system drive that needs file permissions, encryption and compression', 'NTFS', 'The Windows default.'],
     ['64 GB flash drive that must hold a 12 GB video and work on Windows and Mac', 'exFAT', 'No 4 GB file limit, cross-platform.'],
     ['Tiny boot/firmware partition or a camera card that everything can read; files never exceed 4 GB', 'FAT32', 'Most compatible, 4 GB file limit.'],
     ['Default filesystem on Ubuntu and most Linux distributions', 'ext4', 'Journaling Linux filesystem.'],
     ['Default on Red Hat Enterprise Linux; built for very large files and volumes', 'XFS', 'High-performance journaling filesystem.'],
     ['Default on modern Macs; optimized for SSDs with snapshots and encryption', 'APFS', 'Apple File System.'],
     ['Windows Server storage pool that must detect and repair corruption automatically', 'ReFS', 'Resilient File System.']],
    'Exam shortcut: Windows = NTFS, big-file flash drive = exFAT, 4 GB limit = FAT32, Linux = ext4 (XFS on RHEL), Mac = APFS, self-healing Windows storage = ReFS.');
  M('c2-os11-wrap', 'OS and filesystem help desk', 'Combined 1.1 scenarios',
    'Each line is a help-desk ticket. Pick the best answer.', ['End-of-life OS', 'Format as exFAT', 'Format as NTFS', 'Filesystem not supported by this OS', 'Hardware cannot run the new OS', 'App is not available for that OS'],
    [['A PC runs an OS version that no longer gets security patches', 'End-of-life OS', 'EOL = no more fixes; replace or upgrade.'],
     ['User cannot copy a 6 GB file to a FAT32 flash drive', 'Format as exFAT', 'FAT32 tops out at 4 GB per file.'],
     ['A shared Windows data drive needs per-user permissions', 'Format as NTFS', 'FAT32/exFAT have no file permissions.'],
     ['A Mac-formatted (APFS) external drive shows as "unallocated/unknown" on Windows', 'Filesystem not supported by this OS', 'Windows cannot read APFS natively.'],
     ['A 2015 laptop without TPM 2.0 is refused the Windows 11 upgrade', 'Hardware cannot run the new OS', 'Vendor update limitation.'],
     ['A designer moving from Mac to Windows cannot find Final Cut Pro', 'App is not available for that OS', 'Compatibility concern between OSes.']],
    'Most "it will not open / will not copy / will not install" tickets come down to OS, filesystem, or life-cycle compatibility.');

  RK.add({ track: TR, id: '1.1', dom: 1, short: 'OS types & filesystems', title: 'Explain common operating system (OS) types and their purposes',
    goal: 'Know what each workstation and mobile OS is for, which filesystem goes with which OS, and why end-of-life and compatibility matter.',
    kw: /\b(ntfs|refs|fat32|exfat|ext4|xfs|apfs|file ?system|chrome ?os|chromebook|ipados|\bios\b|android|end.of.life|\beol\b|workstation os|open.source|operating system type|compatibility between)/,
    parts: [
      P('Workstation and mobile operating systems', 'Name the four workstation OSes and three mobile OSes on the exam and say what each is used for.',
        `<p>An <b>operating system (OS)</b> is the software that runs the hardware and lets you start apps. A+ wants you to recognize seven of them.</p>
<table><tr><th>OS</th><th>Runs on</th><th>Known for</th></tr>
<tr><td><b>Windows</b></td><td>PCs from many makers</td><td>Business standard; joins company domains; most software and games</td></tr>
<tr><td><b>Linux</b></td><td>Almost anything</td><td>Free and open source; comes as <i>distributions</i> (Ubuntu, Fedora, Mint); runs most servers</td></tr>
<tr><td><b>macOS</b></td><td>Apple Macs only</td><td>Creative work; tight Apple ecosystem</td></tr>
<tr><td><b>ChromeOS</b></td><td>Chromebooks</td><td>Cheap, simple, web-first; popular in schools</td></tr>
<tr><td><b>iOS / iPadOS</b></td><td>iPhone / iPad</td><td>Closed system; apps only from the App Store</td></tr>
<tr><td><b>Android</b></td><td>Phones and tablets from many makers</td><td>Open source; based on the Linux kernel</td></tr></table>
<p><b>Workstation OS</b> = desktops and laptops. <b>Mobile OS</b> = phones and tablets, built for touch, battery life and cellular radios.</p>
<div class="callout pro"><b class="k">On the job</b> The first question on almost every ticket is "What device and OS version are you on?" The fix for the same problem is different on every row of this table.</div>`,
        [['Which OS is open source and distributed as "distros" such as Ubuntu?', 'Linux', ['macOS', 'Windows', 'iPadOS'], 'Linux distributions bundle the Linux kernel with tools and a desktop.'],
         ['A school wants low-cost laptops that mostly run a browser and web apps. Which OS fits?', 'ChromeOS', ['macOS', 'Windows Enterprise', 'iOS'], 'Chromebooks are web-first and cheap to manage.']],
        'c2-os-pick'),
      P('Filesystems', 'Match NTFS, ReFS, FAT32, exFAT, ext4, XFS and APFS to the OS and job each one fits.',
        `<p>A <b>filesystem</b> is how a drive organizes files. The OS must understand the filesystem or the drive looks empty or "unformatted."</p>
<table><tr><th>Filesystem</th><th>Home</th><th>Remember</th></tr>
<tr><td><b>NTFS</b></td><td>Windows</td><td>Default for Windows drives. Permissions, encryption (EFS), compression, journaling, huge files.</td></tr>
<tr><td><b>ReFS</b></td><td>Windows (servers, Pro for Workstations)</td><td><i>Resilient</i>: detects and repairs corruption. For large storage, not everyday boot drives.</td></tr>
<tr><td><b>FAT32</b></td><td>Everything</td><td>Most compatible. <b>Max file size 4 GB.</b> No permissions.</td></tr>
<tr><td><b>exFAT</b></td><td>Flash drives, SD cards</td><td>FAT32 without the 4 GB limit. Works on Windows, macOS and Linux.</td></tr>
<tr><td><b>ext4</b></td><td>Linux</td><td>Default on most distros. Journaling.</td></tr>
<tr><td><b>XFS</b></td><td>Linux (Red Hat)</td><td>Very large files and volumes; high performance.</td></tr>
<tr><td><b>APFS</b></td><td>macOS / iOS</td><td>Built for SSDs: snapshots, cloning, strong encryption.</td></tr></table>
<p><b>Journaling</b> means the filesystem keeps a log of changes, so a crash or power cut is far less likely to corrupt it.</p>`,
        [['A user cannot copy a 5 GB file to a flash drive. Which filesystem is the drive most likely using?', 'FAT32', ['NTFS', 'exFAT', 'APFS'], 'FAT32 cannot store a single file larger than 4 GB.'],
         ['Which filesystem is the default for a Windows system drive?', 'NTFS', ['FAT32', 'ext4', 'ReFS'], 'NTFS supports permissions, encryption and large files.']],
        'c2-fs-pick'),
      P('Life cycle and compatibility', 'Explain end-of-life, update limitations, and why files or apps may not move between OSes.',
        `<p>Vendors do not support an OS forever.</p>
<ul><li><b>End of life (EOL)</b> — the vendor stops releasing security patches. An EOL system gets more dangerous every month. The fix is to upgrade or replace it; if it truly must stay, isolate it from the network.</li>
<li><b>Update limitations</b> — older hardware may not be allowed to run a newer OS. Example: Windows 11 needs TPM 2.0 and UEFI; many older PCs fail that check. Phones stop getting OS updates after a set number of years.</li></ul>
<p><b>Compatibility concerns between OSes:</b></p>
<ul><li><b>Apps</b> — a Windows .exe will not run on macOS, and a Mac app will not run on Windows, without virtualization or a different version of the app.</li>
<li><b>Filesystems</b> — Windows cannot read APFS or ext4 on its own; macOS reads NTFS but cannot write to it by default. For a drive shared between them, use <b>exFAT</b>.</li>
<li><b>File formats</b> — most documents open across OSes, but fonts, macros and special formats may not.</li></ul>
<div class="callout trap"><b class="k">Exam trap</b> "The software still works" is not a reason to keep an EOL OS. The exam answer is to upgrade/replace because it no longer receives security updates.</div>`,
        [['What is the main risk of running an operating system that has reached end of life?', 'It no longer receives security updates', ['It runs slower every day', 'It cannot connect to Wi-Fi', 'Its license becomes illegal'], 'No patches means every new vulnerability stays open.'],
         ['Which filesystem is the best choice for an external drive used on both Windows and macOS?', 'exFAT', ['NTFS', 'APFS', 'ext4'], 'Both OSes can read and write exFAT, and it has no 4 GB limit.']])
    ],
    wrap: { recap: ['Workstation OSes: Windows, Linux, macOS, ChromeOS. Mobile OSes: iOS, iPadOS, Android.', 'NTFS = Windows default (permissions, encryption). ReFS = resilient Windows storage.', 'FAT32 = most compatible, 4 GB file limit. exFAT = big files, cross-platform.', 'ext4 = Linux default; XFS = Red Hat, huge files. APFS = Apple, SSD-optimized.', 'EOL = no more security patches → upgrade, replace or isolate.', 'Apps, filesystems and some file formats do not move freely between OSes.'], lab: 'c2-os11-wrap' }
  });

  // ===================== 1.2 OS installations =====================
  M('c2-boot', 'Boot method and install type', 'Pick the right way to install',
    'Pick the boot method or installation type for each situation.', ['USB boot', 'Network boot (PXE)', 'Clean install', 'In-place upgrade', 'Image deployment', 'Zero-touch deployment', 'Repair installation', 'Recovery partition', 'Multiboot'],
    [['One PC, no OS, and you have an installer flash drive', 'USB boot', 'The most common method.'],
     ['200 lab PCs should start setup from a server with no media in each PC', 'Network boot (PXE)', 'PXE boots from the network card.'],
     ['PC is badly infected; wipe everything and start fresh', 'Clean install', 'Erases the drive; nothing carries over.'],
     ['Move a working Windows 10 PC to Windows 11 and keep apps, files and settings', 'In-place upgrade', 'Runs setup from inside the current OS.'],
     ['Copy one prepared PC setup (OS + apps + settings) to 50 identical PCs', 'Image deployment', 'One golden image, many PCs.'],
     ['New laptop ships straight to a remote worker and configures itself at first sign-in', 'Zero-touch deployment', 'IT never touches the device.'],
     ['Windows files are corrupted; reinstall Windows over itself and keep apps and data', 'Repair installation', 'Fixes the OS, keeps the rest.'],
     ['Reset a laptop to factory state using the hidden vendor copy on its own drive', 'Recovery partition', 'No external media needed.'],
     ['A developer needs to choose Windows or Linux each time the PC starts', 'Multiboot', 'Two OSes, one PC, pick at boot.']],
    'Clean = wipe. Upgrade = keep. Image = clone. Zero-touch = cloud-configured. Repair = fix the OS in place.');
  M('c2-part', 'MBR or GPT?', 'Partition styles',
    'Pick MBR or GPT for each fact.', ['MBR', 'GPT'],
    [['Maximum disk size of 2 TB', 'MBR', '32-bit sector addresses.'],
     ['Required to boot Windows 11 (UEFI)', 'GPT', 'UEFI boots from GPT.'],
     ['Limited to 4 primary partitions', 'MBR', 'Or 3 primary + 1 extended.'],
     ['Supports up to 128 partitions in Windows', 'GPT', 'No extended partitions needed.'],
     ['Keeps a backup copy of the partition table at the end of the disk', 'GPT', 'More resilient.'],
     ['Older style used with legacy BIOS', 'MBR', 'Master Boot Record.'],
     ['Needed to use the whole of a 4 TB drive', 'GPT', 'MBR stops at 2 TB.']],
    'Modern PCs: UEFI + GPT. Legacy: BIOS + MBR. A 2 TB ceiling or a 4-partition limit in a question means MBR.');
  O('c2-clean', 'Clean install, start to finish', 'Order the steps',
    'You are doing a clean install of Windows 11 on a used PC. Put the steps in a sensible order.',
    [['Back up the user\'s files and note licensed apps', 'A clean install erases everything.'],
     ['Check the hardware meets the requirements (TPM 2.0, UEFI, RAM, storage)', 'No point starting if it cannot run.'],
     ['Boot from the installer USB (change boot order or use the boot menu)', 'Start setup from media.'],
     ['Load a third-party storage driver if the drive is not detected', 'RAID/NVMe controllers sometimes need one.'],
     ['Delete old partitions, create new ones (GPT) and format', 'Partition and format.'],
     ['Let setup copy files, then finish the first-run setup (account, region)', 'Install and out-of-box experience.'],
     ['Install drivers and Windows updates', 'Patch before restoring data.'],
     ['Restore the user\'s files and reinstall apps', 'Last step.']],
    'Back up first, verify, install, patch, restore. On the exam, "back up user data" is nearly always the first step before any install or upgrade.');

  RK.add({ track: TR, id: '1.2', dom: 1, short: 'OS installations & upgrades', title: 'Given a scenario, perform OS installations and upgrades in a diverse environment',
    goal: 'Choose a boot method and installation type, partition a drive (MBR vs GPT), and plan an upgrade without losing data.',
    kw: /\b(pxe|network boot|boot method|clean install|in-place|image deployment|zero.touch|recovery partition|repair install|multiboot|dual.boot|\bgpt\b|\bmbr\b|partition|unattended|upgrade path|third.party driver|feature update|installation media|bootable usb)/,
    parts: [
      P('Boot methods', 'Choose how to start an OS installer: USB, network, internal partition, external drive or internet.',
        `<p>To install an OS, the PC must first <b>boot</b> (start) from something that holds the installer. You pick this in the firmware <b>boot order</b> or a one-time <b>boot menu</b> (often F12, F9 or Esc).</p>
<ul><li><b>USB</b> — a bootable flash drive. The everyday method.</li>
<li><b>Network (PXE)</b> — the network card downloads the installer from a server. Great for many PCs at once; no media per machine.</li>
<li><b>Solid-state / flash</b> — any flash media, such as an SD card or SSD.</li>
<li><b>Internet-based</b> — the firmware downloads the installer from the vendor (for example macOS Internet Recovery).</li>
<li><b>External / hot-swappable drive</b> — an external SSD/HDD in a dock or over USB/eSATA.</li>
<li><b>Internal hard drive (partition)</b> — a hidden <b>recovery partition</b> on the PC's own drive that holds a factory copy.</li>
<li><b>Multiboot</b> — more than one OS installed; a boot menu lets you choose each time.</li></ul>
<div class="callout pro"><b class="k">On the job</b> If a PC ignores your USB installer, check three things: the boot order, whether USB boot is allowed in firmware, and whether Secure Boot is blocking unsigned media.</div>`,
        [['Which boot method installs an OS on many PCs from a server without any media in each PC?', 'Network boot (PXE)', ['USB boot', 'Recovery partition', 'Multiboot'], 'PXE lets the network card load the installer.'],
         ['A laptop is reset to factory condition with no USB drive or download. What was used?', 'An internal recovery partition', ['PXE', 'Internet-based boot', 'An external hot-swappable drive'], 'The factory image lives on a hidden partition.']]),
      P('Installation types', 'Tell clean install, upgrade, image deployment, zero-touch, repair and recovery installs apart.',
        `<table><tr><th>Type</th><th>What happens</th><th>Use it when</th></tr>
<tr><td><b>Clean install</b></td><td>Drive is wiped; fresh OS</td><td>New drive, malware, a fresh start</td></tr>
<tr><td><b>Upgrade (in-place)</b></td><td>New OS installs over the old one; apps, files and settings stay</td><td>Moving a healthy PC to a newer version</td></tr>
<tr><td><b>Image deployment</b></td><td>A prepared image (OS + apps + settings) is copied to many PCs</td><td>Rolling out identical machines</td></tr>
<tr><td><b>Remote network installation</b></td><td>Installer is pushed or pulled over the network</td><td>No one on site; many PCs</td></tr>
<tr><td><b>Zero-touch deployment</b></td><td>Device configures itself from the cloud at first sign-in</td><td>Shipping laptops straight to users</td></tr>
<tr><td><b>Recovery partition</b></td><td>Restores the factory image stored on the drive</td><td>Quick factory reset</td></tr>
<tr><td><b>Repair installation</b></td><td>Reinstalls OS files over themselves; keeps apps and data</td><td>Corrupted system files</td></tr></table>
<p><b>Third-party drivers:</b> if the installer cannot see your drive, the storage controller (RAID or a new NVMe chipset) needs a driver. Click <i>Load driver</i> during setup and supply it from USB.</p>`,
        [['Which installation type keeps the user\'s applications, files and settings?', 'In-place upgrade', ['Clean install', 'Image deployment', 'Recovery partition reset'], 'An upgrade installs over the existing OS.'],
         ['Windows setup shows no drives to install to on a new RAID workstation. What should you do?', 'Load the third-party storage driver', ['Convert the disk to MBR', 'Disable the TPM', 'Use a recovery partition'], 'The installer needs a driver for that controller.']],
        'c2-boot'),
      P('Partitioning and formatting', 'Choose MBR or GPT and explain what formatting does.',
        `<p>A new drive must be <b>partitioned</b> (divided into sections) and then <b>formatted</b> (given a filesystem).</p>
<table><tr><th></th><th>MBR</th><th>GPT</th></tr>
<tr><td>Full name</td><td>Master Boot Record</td><td>GUID Partition Table</td></tr>
<tr><td>Max disk size</td><td><b>2 TB</b></td><td>Far larger (zettabytes)</td></tr>
<tr><td>Partitions</td><td><b>4 primary</b> (or 3 + 1 extended)</td><td><b>128</b> in Windows</td></tr>
<tr><td>Firmware</td><td>Legacy BIOS</td><td><b>UEFI</b></td></tr>
<tr><td>Safety</td><td>One copy of the table</td><td>Backup copy + checksums</td></tr></table>
<p>Windows 11 requires UEFI, so its boot drive is <b>GPT</b>.</p>
<p><b>Formatting</b> writes a new, empty filesystem:</p>
<ul><li><b>Quick format</b> — creates a new file table only. Fast. Old data is still recoverable.</li>
<li><b>Full format</b> — also scans for bad sectors (and on modern Windows writes zeros). Slow.</li></ul>
<div class="callout trap"><b class="k">Exam trap</b> "Only 2 TB of my 4 TB drive is usable" → the disk is MBR. Convert it to GPT.</div>`,
        [['A 4 TB drive shows only 2 TB of usable space in Disk Management. Why?', 'It was initialized as MBR', ['It was formatted as exFAT', 'It needs a full format', 'The TPM is disabled'], 'MBR cannot address more than 2 TB.'],
         ['Which partition style does a UEFI system use to boot Windows 11?', 'GPT', ['MBR', 'FAT32', 'APFS'], 'UEFI boots from GPT disks.']],
        'c2-part'),
      P('Upgrade considerations and life cycle', 'Plan an OS upgrade: backups, compatibility, feature updates.',
        `<p>Before any upgrade, answer four questions:</p>
<ol><li><b>Is the data backed up?</b> Back up files and user preferences first. Always.</li>
<li><b>Will the apps and drivers work?</b> Check application and driver support and backward compatibility. An old printer or accounting package may not have a version for the new OS.</li>
<li><b>Does the hardware qualify?</b> Check CPU, RAM, storage, TPM and firmware against the vendor's requirements.</li>
<li><b>Is there a supported upgrade path?</b> Some jumps (edition or 32-bit → 64-bit) need a clean install.</li></ol>
<p><b>Feature updates and product life cycle:</b></p>
<ul><li><b>Quality updates</b> — monthly security and bug fixes.</li>
<li><b>Feature updates</b> — the big version releases (for example 23H2 → 24H2). Each version is only supported for a limited time, so PCs must keep moving forward to stay patched.</li></ul>
<div class="callout pro"><b class="k">On the job</b> Test the upgrade on one or two pilot machines before rolling it out. It is how you find the one app that breaks.</div>`,
        [['What should a technician do FIRST before upgrading a user\'s operating system?', 'Back up the user\'s files and settings', ['Format the drive', 'Install the newest drivers', 'Disable the firewall'], 'Protect the data before anything else.'],
         ['Which update type delivers a new Windows version such as 24H2?', 'Feature update', ['Quality update', 'Driver update', 'Definition update'], 'Feature updates are the large version releases.']],
        'c2-clean')
    ],
    wrap: { recap: ['Boot methods: USB, network (PXE), flash, internet, external drive, internal recovery partition, multiboot.', 'Clean = wipe. Upgrade = keep apps/files/settings. Image = clone to many. Zero-touch = self-configures from the cloud.', 'Repair install fixes OS files and keeps data; recovery partition = factory reset.', 'Drive not seen during setup → load the third-party storage driver.', 'MBR: 2 TB, 4 primary partitions, BIOS. GPT: huge, 128 partitions, UEFI, backup table.', 'Before upgrading: back up, check app/driver support, check hardware, confirm the upgrade path.'], lab: 'c2-clean' }
  });

  // ===================== 1.3 Windows editions =====================
  M('c2-ed', 'Which edition do they need?', 'Home, Pro, Pro for Workstations, Enterprise',
    'Pick the <b>lowest</b> Windows edition that meets each need.', ['Home', 'Pro', 'Pro for Workstations', 'Enterprise'],
    [['Family PC for web, email and games', 'Home', 'No business features needed.'],
     ['Office PC that must join the company Active Directory domain', 'Pro', 'Home cannot join a domain.'],
     ['Staff need to connect <i>to</i> this PC with Remote Desktop', 'Pro', 'Home can only be an RDP client.'],
     ['Laptop must be encrypted with BitLocker and managed with gpedit.msc', 'Pro', 'Both are Pro features.'],
     ['3D rendering workstation with 4 CPUs and 3 TB of RAM', 'Pro for Workstations', 'High-end hardware support, ReFS.'],
     ['Large company buying volume licenses with advanced security and management', 'Enterprise', 'Volume licensing only.']],
    'Home = consumers. Pro = business basics (domain, RDP host, BitLocker, Group Policy). Pro for Workstations = extreme hardware. Enterprise = volume-licensed, most features.');
  M('c2-w11', 'Will it run Windows 11?', 'Check each PC against the requirements',
    'Decide whether each PC can be upgraded to Windows 11.', ['Yes — meets the requirements', 'No — TPM 2.0 missing', 'No — legacy BIOS only (no UEFI/Secure Boot)', 'No — not enough RAM', 'No — 32-bit CPU'],
    [['64-bit CPU, 8 GB RAM, 256 GB SSD, UEFI with Secure Boot, TPM 2.0', 'Yes — meets the requirements', 'Everything checks out.'],
     ['64-bit CPU, 16 GB RAM, UEFI, TPM 1.2', 'No — TPM 2.0 missing', 'Version 2.0 is required.'],
     ['64-bit CPU, 8 GB RAM, TPM 2.0 module, firmware is legacy BIOS with an MBR disk', 'No — legacy BIOS only (no UEFI/Secure Boot)', 'Needs UEFI and Secure Boot capability.'],
     ['64-bit CPU, 2 GB RAM, UEFI, TPM 2.0', 'No — not enough RAM', 'Minimum is 4 GB.'],
     ['32-bit only processor, 4 GB RAM', 'No — 32-bit CPU', 'Windows 11 is 64-bit only.']],
    'Windows 11 minimums: 64-bit CPU (1 GHz, 2+ cores), 4 GB RAM, 64 GB storage, UEFI with Secure Boot, TPM 2.0.');

  RK.add({ track: TR, id: '1.3', dom: 1, short: 'Windows editions', title: 'Compare and contrast basic features of Microsoft Windows editions',
    goal: 'Pick the right Windows 10/11 edition from its features, and know the Windows 11 hardware requirements and upgrade paths.',
    kw: /\b(home edition|windows (10|11) (home|pro|enterprise)|pro for workstations|\bn version|edition|domain vs\.? workgroup|ram (support )?limit|gpedit|tpm 2|windows 11 (hardware )?requirement|upgrade path)/,
    parts: [
      P('The editions', 'List the Windows 10 and Windows 11 editions and who each one is for.',
        `<table><tr><th>Edition</th><th>Windows 10</th><th>Windows 11</th><th>Who it is for</th></tr>
<tr><td><b>Home</b></td><td>✓</td><td>✓</td><td>Consumers</td></tr>
<tr><td><b>Pro</b></td><td>✓</td><td>✓</td><td>Small and mid-size business</td></tr>
<tr><td><b>Pro for Workstations</b></td><td>✓</td><td>(objective lists it under 10)</td><td>High-end workstations: up to 4 CPUs, 6 TB RAM, ReFS</td></tr>
<tr><td><b>Enterprise</b></td><td>✓</td><td>✓</td><td>Large organizations; volume licensing; extra security and management</td></tr></table>
<p><b>N versions</b> — editions sold without media features (Windows Media Player and related codecs), created to satisfy European regulations. Everything else is the same; the media pack can be added later.</p>
<p>Think of the editions as a ladder: each step up keeps everything below it and adds more business features.</p>`,
        [['What is missing from an "N" edition of Windows?', 'Media features such as Windows Media Player', ['Networking', 'The Microsoft Store', 'BitLocker'], 'N editions omit media technologies.'],
         ['Which edition is available only through volume licensing for large organizations?', 'Enterprise', ['Home', 'Pro', 'Pro N'], 'Enterprise is not sold at retail.']]),
      P('Feature differences', 'Choose an edition based on domain join, Remote Desktop, RAM limits, BitLocker and gpedit.msc.',
        `<table><tr><th>Feature</th><th>Home</th><th>Pro and above</th></tr>
<tr><td>Join an Active Directory <b>domain</b></td><td>✗ (workgroup only)</td><td>✓</td></tr>
<tr><td><b>Remote Desktop</b> host (others connect <i>to</i> it)</td><td>✗ (client only)</td><td>✓</td></tr>
<tr><td><b>BitLocker</b> drive encryption</td><td>✗ (basic "device encryption" on some PCs)</td><td>✓</td></tr>
<tr><td><b>gpedit.msc</b> (Local Group Policy Editor)</td><td>✗</td><td>✓</td></tr>
<tr><td>Maximum RAM (64-bit)</td><td>128 GB</td><td>Pro 2 TB · Pro for Workstations / Enterprise 6 TB</td></tr></table>
<ul><li><b>Workgroup</b> — a small peer-to-peer group; each PC keeps its own accounts.</li>
<li><b>Domain</b> — accounts and policies are managed centrally by a server (Active Directory).</li>
<li><b>Desktop styles/user interface</b> — Windows 10 has a left-aligned Start menu with live tiles; Windows 11 centers the taskbar and uses a simpler Start menu.</li></ul>
<div class="callout trap"><b class="k">Exam trap</b> "User cannot join the domain" or "cannot find gpedit.msc" on a new retail laptop → it is running <b>Home</b>. Upgrade the edition to Pro.</div>`,
        [['A user cannot find gpedit.msc on a new laptop. What is the most likely reason?', 'The laptop runs Windows Home', ['The laptop needs a TPM', 'The user is not an administrator', 'Windows needs activation'], 'Group Policy Editor is not included in Home.'],
         ['Which is the lowest edition that lets other people remote into the PC with RDP?', 'Pro', ['Home', 'Enterprise', 'Pro for Workstations'], 'Home can connect out, but cannot host RDP.']],
        'c2-ed'),
      P('Upgrade paths and hardware requirements', 'Decide between in-place upgrade and clean install, and check Windows 11 hardware requirements.',
        `<p><b>Upgrade paths:</b></p>
<ul><li><b>In-place upgrade</b> — keeps apps, files and settings. Works when moving up in the same family: Windows 10 Home → Windows 11 Home, or Home → Pro with a new key.</li>
<li><b>Clean install</b> — needed when no path exists: 32-bit → 64-bit, moving <i>down</i> an edition, or very old versions.</li></ul>
<p><b>Windows 11 hardware requirements</b> (memorize):</p>
<table><tr><th>Item</th><th>Minimum</th></tr>
<tr><td>Processor</td><td>64-bit, 1 GHz, 2 or more cores (on the supported list)</td></tr>
<tr><td>RAM</td><td>4 GB</td></tr><tr><td>Storage</td><td>64 GB</td></tr>
<tr><td>Firmware</td><td><b>UEFI</b>, Secure Boot capable</td></tr>
<tr><td>Security chip</td><td><b>TPM 2.0</b></td></tr></table>
<p>A <b>TPM</b> (Trusted Platform Module) is a chip that safely stores encryption keys. It is often present but switched off in firmware; enabling it there fixes many "This PC can't run Windows 11" messages.</p>`,
        [['A PC fails the Windows 11 check although it is only three years old. What should you look at first?', 'Whether TPM 2.0 and Secure Boot are enabled in UEFI', ['Whether the drive is NTFS', 'Whether it runs Home edition', 'Whether it has a DVD drive'], 'They are often present but disabled in firmware.'],
         ['Which move requires a clean install rather than an in-place upgrade?', '32-bit Windows 10 to 64-bit Windows 11', ['Windows 10 Home to Windows 11 Home', 'Windows 11 Home to Windows 11 Pro', 'Windows 10 Pro to Windows 11 Pro'], 'You cannot upgrade in place across architectures.']],
        'c2-w11')
    ],
    wrap: { recap: ['Windows 10: Home, Pro, Pro for Workstations, Enterprise. Windows 11: Home, Pro, Enterprise. N = no media features.', 'Home: no domain join, no RDP host, no BitLocker, no gpedit.msc, 128 GB RAM.', 'Pro adds all four; Pro 2 TB RAM; Pro for Workstations / Enterprise 6 TB.', 'Workgroup = each PC has its own accounts. Domain = central accounts and policy.', 'In-place upgrade keeps everything; clean install when no path (32→64-bit, downgrade).', 'Windows 11: 64-bit 2-core CPU, 4 GB RAM, 64 GB storage, UEFI + Secure Boot, TPM 2.0.'], lab: 'c2-ed' }
  });

  // ===================== 1.4 Windows features & tools =====================
  M('c2-tm', 'Which Task Manager tab?', 'Processes, Performance, Startup, Users, Services',
    'Pick the Task Manager tab you would open.', ['Processes', 'Performance', 'Startup', 'Users', 'Services', 'Details'],
    [['End a frozen application', 'Processes', 'Select it → End task.'],
     ['See live graphs of CPU, memory, disk, network and GPU use', 'Performance', 'Also links to Resource Monitor.'],
     ['Stop a program launching every time Windows boots', 'Startup', 'Disable it; note the Startup impact column.'],
     ['See who else is signed in to this PC and sign them out', 'Users', 'Shows each user\'s resource use.'],
     ['Restart the Print Spooler', 'Services', 'Right-click → Restart.'],
     ['Find a process ID (PID) or set a process priority', 'Details', 'The advanced process list.']],
    'Open Task Manager with Ctrl+Shift+Esc. Frozen app → Processes. Slow boot → Startup. Graphs → Performance.');
  T('c2-run', 'Open the right tool', 'Launch Windows tools by their run names',
    'A real tech opens tools from the keyboard, not by hunting through menus. For each ticket, type the <b>run name</b> of the correct tool (for example the kind of name that ends in <code>.msc</code>).',
    { shell: 'cmd', prompt: 'C:\\Users\\tech>' },
    [{ t: 'A user says an app crashed at 9:14 this morning. Open the tool that shows the Application and System <b>logs</b>.', accept: [/^eventvwr(\.msc|\.exe)?$/i], show: 'eventvwr.msc', hint: 'Event Viewer. Its run name starts with "event".', out: '[Event Viewer opened]\nWindows Logs > Application\n  Error   9:14:07 AM  Application Error   Event ID 1000\n  Faulting application name: acctpro.exe', why: 'eventvwr.msc = Event Viewer. Event ID 1000 = an application crash.', ask: { q: 'What is the Event ID of the crash?', accept: ['1000'], why: 'Search the Event ID plus the faulting app name to find known fixes.' } },
     { t: 'A new second drive does not show up in File Explorer. Open the tool where you initialize, partition and format disks.', accept: [/^diskmgmt(\.msc)?$/i], show: 'diskmgmt.msc', hint: 'Disk Management: "diskmgmt".', out: '[Disk Management opened]\nDisk 0  Basic  476.92 GB  Online   (C:) NTFS  Healthy (Boot)\nDisk 1  Unknown  931.51 GB  Not Initialized   Unallocated', why: 'diskmgmt.msc = Disk Management. "Not Initialized / Unallocated" means the disk needs initializing (GPT), a partition and a format.' },
     { t: 'A webcam stopped working after an update. Open the tool where you can see devices, roll back or update a driver.', accept: [/^devmgmt(\.msc)?$/i], show: 'devmgmt.msc', hint: 'Device Manager: "devmgmt".', out: '[Device Manager opened]\n  Cameras\n    ⚠ Integrated Webcam   (This device cannot start. Code 10)', why: 'devmgmt.msc = Device Manager. A yellow ⚠ means a driver/device problem; try Roll Back Driver.' },
     { t: 'You need to create a local account and add it to the Administrators group. Open the snap-in for local accounts and groups.', accept: [/^lusrmgr(\.msc)?$/i], show: 'lusrmgr.msc', hint: 'Local Users and Groups Manager: "lusrmgr".', out: '[Local Users and Groups opened]\n  Users\n  Groups', why: 'lusrmgr.msc = Local Users and Groups (not available on Home edition).' },
     { t: 'A backup script must run every night at 11 PM. Open the tool that runs programs on a schedule.', accept: [/^taskschd(\.msc)?$/i], show: 'taskschd.msc', hint: 'Task Scheduler: "taskschd".', out: '[Task Scheduler opened]\n  Task Scheduler Library', why: 'taskschd.msc = Task Scheduler. Triggers decide when; actions decide what.' },
     { t: 'You need a full hardware and software summary (BIOS version, installed RAM, system model). Open System Information.', accept: [/^msinfo32(\.exe)?$/i], show: 'msinfo32', hint: 'It starts with "msinfo".', out: '[System Information opened]\nSystem Model        Latitude 5440\nBIOS Version/Date   Dell Inc. 1.14.0, 3/12/2025\nInstalled Physical Memory (RAM)  16.0 GB\nBIOS Mode           UEFI\nSecure Boot State   On', why: 'msinfo32 = System Information: a read-only inventory of the whole machine.', ask: { q: 'What BIOS mode is this PC using?', accept: ['uefi'], why: 'UEFI + Secure Boot On — ready for Windows 11.' } },
     { t: 'A PC should boot with only basic services to find a bad startup item. Open System Configuration.', accept: [/^msconfig(\.exe)?$/i], show: 'msconfig', hint: 'System Configuration = "msconfig".', out: '[System Configuration opened]\nGeneral | Boot | Services | Startup | Tools\n  ( ) Normal startup  ( ) Diagnostic startup  (•) Selective startup', why: 'msconfig = System Configuration: boot options (Safe boot) and selective startup.' }],
    'Run names worth knowing cold: eventvwr.msc, diskmgmt.msc, devmgmt.msc, lusrmgr.msc, taskschd.msc, certmgr.msc, perfmon.msc, gpedit.msc, msinfo32, resmon, msconfig, cleanmgr, dfrgui, regedit.',
    ['Most MMC snap-ins end in .msc. Say the tool name out loud and shorten it: Device Manager → devmgmt.']);
  M('c2-tools', 'Pick the Windows tool', 'Snap-ins and utilities',
    'Pick the tool for each job.', ['Performance Monitor', 'Resource Monitor', 'Certificate Manager', 'Group Policy Editor', 'Disk Cleanup', 'Disk Defragmenter (Optimize Drives)', 'Registry Editor', 'System Configuration'],
    [['Log CPU and disk counters for a week to find a pattern', 'Performance Monitor', 'perfmon.msc: counters and data collector sets over time.'],
     ['See right now which process is hammering the disk or using a network port', 'Resource Monitor', 'resmon: live detail per process.'],
     ['View or remove a user\'s installed certificates', 'Certificate Manager', 'certmgr.msc.'],
     ['Enforce a password and lock-screen policy on one standalone PC', 'Group Policy Editor', 'gpedit.msc (Pro and above).'],
     ['Free space by deleting temp files and old update files', 'Disk Cleanup', 'cleanmgr.'],
     ['Speed up a fragmented <b>hard disk</b> drive', 'Disk Defragmenter (Optimize Drives)', 'dfrgui. SSDs are trimmed, not defragmented.'],
     ['Change a specific key such as one under HKEY_LOCAL_MACHINE', 'Registry Editor', 'regedit: back up before editing.'],
     ['Choose Safe boot for the next restart', 'System Configuration', 'msconfig → Boot tab.']],
    'Performance Monitor = over time. Resource Monitor = right now. Defrag HDDs only; SSDs get TRIM.');

  RK.add({ track: TR, id: '1.4', dom: 1, short: 'Windows features & tools', title: 'Given a scenario, use Microsoft Windows operating system features and tools',
    goal: 'Use Task Manager, the MMC snap-ins and the other built-in tools — and open each one by its run name.',
    kw: /\b(task manager|event viewer|eventvwr|disk management|diskmgmt|task scheduler|device manager|devmgmt|certificate manager|certmgr|local users and groups|lusrmgr|performance monitor|perfmon|group policy editor|gpedit|system information|msinfo32|resource monitor|resmon|system configuration|msconfig|disk cleanup|cleanmgr|defrag|dfrgui|registry|regedit|mmc|snap.in)/,
    parts: [
      P('Task Manager', 'Use each Task Manager tab to find and fix a slow or frozen PC.',
        `<p>Open it with <b>Ctrl + Shift + Esc</b> (or Ctrl + Alt + Del → Task Manager).</p>
<table><tr><th>Tab</th><th>Use it to</th></tr>
<tr><td><b>Processes</b></td><td>See apps and background processes with CPU, memory, disk and network use. Select a frozen app → <b>End task</b>.</td></tr>
<tr><td><b>Performance</b></td><td>Live graphs for CPU, memory, disk, network, GPU. Shows uptime and how much RAM is installed.</td></tr>
<tr><td><b>Startup</b></td><td>Enable/disable programs that launch at sign-in. Check the <i>Startup impact</i> column.</td></tr>
<tr><td><b>Users</b></td><td>See who is signed in and what each user is using; disconnect or sign them off.</td></tr>
<tr><td><b>Services</b></td><td>Start, stop or restart background services (for example Print Spooler).</td></tr>
<tr><td><b>Details</b></td><td>Advanced list: PID, priority, end process tree.</td></tr></table>
<p><b>Reading it:</b> one process at 100% CPU = runaway app. Memory at 95% = too many apps or a leak. Disk at 100% on an HDD = the drive is the bottleneck.</p>
<div class="callout pro"><b class="k">On the job</b> "My computer is slow" → open Task Manager first and sort by the busiest column. It answers the question in ten seconds.</div>`,
        [['Which Task Manager tab stops a program from launching when Windows boots?', 'Startup', ['Processes', 'Services', 'Performance'], 'Disable the item on the Startup tab.'],
         ['A user\'s spreadsheet app is frozen. What is the quickest fix?', 'End the task on the Processes tab', ['Restart the Print Spooler', 'Run Disk Cleanup', 'Reinstall Windows'], 'End task closes the hung app.']],
        'c2-tm'),
      P('MMC snap-ins, part 1: logs, disks, devices, tasks', 'Use Event Viewer, Disk Management, Device Manager and Task Scheduler, and open each by name.',
        `<p>The <b>Microsoft Management Console (MMC)</b> hosts admin tools called <b>snap-ins</b>. Each has a run name ending in <code>.msc</code> — press <b>Win + R</b> and type it.</p>
<table><tr><th>Snap-in</th><th>Run name</th><th>Use it to</th></tr>
<tr><td><b>Event Viewer</b></td><td><code>eventvwr.msc</code></td><td>Read logs: <i>Application</i>, <i>Security</i>, <i>System</i>. Levels: Information, Warning, Error, Critical. Note the <b>Event ID</b>.</td></tr>
<tr><td><b>Disk Management</b></td><td><code>diskmgmt.msc</code></td><td>Initialize disks, create/extend/shrink partitions, format, change drive letters.</td></tr>
<tr><td><b>Device Manager</b></td><td><code>devmgmt.msc</code></td><td>See hardware; update, roll back, disable or uninstall drivers. Yellow ⚠ = problem.</td></tr>
<tr><td><b>Task Scheduler</b></td><td><code>taskschd.msc</code></td><td>Run a program or script automatically on a <i>trigger</i> (time, logon, event).</td></tr></table>
<p><b>Device Manager clues:</b> yellow triangle = driver/device error; down arrow = disabled; "Unknown device" = no driver installed.</p>
<p>The paired lab is a terminal: you will type the run names to open each tool.</p>`,
        [['Where do you look to find out why an application crashed yesterday?', 'Event Viewer — Application log', ['Device Manager', 'Disk Management', 'Task Scheduler'], 'Application errors are logged with an Event ID.'],
         ['A device shows a yellow warning triangle in Device Manager. What does it mean?', 'There is a problem with the device or its driver', ['The device is disabled on purpose', 'The device is working normally', 'The device needs more power'], 'Check the device status code and the driver.']],
        'c2-run'),
      P('MMC snap-ins, part 2: accounts, certificates, performance, policy', 'Use Local Users and Groups, Certificate Manager, Performance Monitor and Group Policy Editor.',
        `<table><tr><th>Snap-in</th><th>Run name</th><th>Use it to</th></tr>
<tr><td><b>Local Users and Groups</b></td><td><code>lusrmgr.msc</code></td><td>Create local accounts, reset passwords, unlock accounts, change group membership. Not on Home.</td></tr>
<tr><td><b>Certificate Manager</b></td><td><code>certmgr.msc</code></td><td>View, import, export and delete the current user's certificates (personal, trusted root CAs).</td></tr>
<tr><td><b>Performance Monitor</b></td><td><code>perfmon.msc</code></td><td>Chart <i>counters</i> (CPU %, disk queue, memory) live or log them over hours/days with <i>data collector sets</i>.</td></tr>
<tr><td><b>Group Policy Editor</b></td><td><code>gpedit.msc</code></td><td>Set <b>local</b> policies on one PC: password rules, block Control Panel, startup scripts. Pro and above.</td></tr></table>
<ul><li>Local groups to know: <b>Administrators</b> (full control), <b>Users</b> (standard), <b>Guests</b> (very limited), <b>Power Users</b> (legacy; kept for compatibility).</li>
<li><code>gpedit.msc</code> edits one PC. In a domain, admins use Group Policy Management on a server to push policies to many PCs.</li></ul>`,
        [['Which tool logs performance counters over several days to find a recurring slowdown?', 'Performance Monitor', ['Task Manager', 'Event Viewer', 'System Information'], 'Data collector sets record counters over time.'],
         ['Which snap-in creates a local user account and adds it to a group?', 'Local Users and Groups (lusrmgr.msc)', ['Certificate Manager', 'Device Manager', 'Disk Management'], 'It manages local accounts and groups.']]),
      P('Additional tools', 'Use System Information, Resource Monitor, System Configuration, Disk Cleanup, Defragment and Registry Editor.',
        `<table><tr><th>Tool</th><th>Run name</th><th>Use it to</th></tr>
<tr><td><b>System Information</b></td><td><code>msinfo32</code></td><td>Read-only inventory: model, BIOS/UEFI version, RAM, drivers, Secure Boot state.</td></tr>
<tr><td><b>Resource Monitor</b></td><td><code>resmon</code></td><td>Live detail: which process uses which file, disk, port or how much memory.</td></tr>
<tr><td><b>System Configuration</b></td><td><code>msconfig</code></td><td>Boot options (Safe boot), selective/diagnostic startup, disable non-Microsoft services.</td></tr>
<tr><td><b>Disk Cleanup</b></td><td><code>cleanmgr</code></td><td>Delete temp files, Recycle Bin, old update files to free space.</td></tr>
<tr><td><b>Disk Defragment</b></td><td><code>dfrgui</code></td><td>"Optimize Drives." Defragments <b>HDDs</b>; sends TRIM to <b>SSDs</b> (never defragment an SSD).</td></tr>
<tr><td><b>Registry Editor</b></td><td><code>regedit</code></td><td>Edit the registry — the database of Windows and app settings. Back up (export) the key first.</td></tr></table>
<p><b>Registry hives to recognize:</b> <code>HKEY_LOCAL_MACHINE</code> (HKLM, whole PC) and <code>HKEY_CURRENT_USER</code> (HKCU, the signed-in user).</p>
<div class="callout trap"><b class="k">Exam trap</b> Performance Monitor = trends over <i>time</i>. Resource Monitor = what is happening <i>right now</i>, per process.</div>`,
        [['Which tool sets a PC to start in Safe boot on the next restart?', 'System Configuration (msconfig)', ['Disk Cleanup', 'System Information', 'Certificate Manager'], 'Boot tab → Safe boot.'],
         ['Why should you not defragment an SSD?', 'It gives no speed benefit and adds wear; SSDs use TRIM instead', ['SSDs cannot store fragmented files', 'It erases the SSD', 'Windows blocks SSDs from Optimize Drives'], 'Optimize Drives sends TRIM to SSDs.']],
        'c2-tools')
    ],
    wrap: { recap: ['Task Manager (Ctrl+Shift+Esc): Processes, Performance, Startup, Users, Services, Details.', 'eventvwr.msc logs · diskmgmt.msc disks · devmgmt.msc drivers · taskschd.msc schedules.', 'lusrmgr.msc local accounts · certmgr.msc certificates · perfmon.msc counters over time · gpedit.msc local policy.', 'msinfo32 inventory · resmon live per-process detail · msconfig boot/startup.', 'cleanmgr frees space · dfrgui defrags HDDs, TRIMs SSDs · regedit edits the registry (back up first).', 'Home edition lacks lusrmgr.msc and gpedit.msc.'], lab: 'c2-tools' }
  });

  // ===================== 1.5 Microsoft command-line tools =====================
  T('c2-cli-nav', 'Move around and get help', 'cd, dir, md, rmdir and /?',
    'You are at a Command Prompt on a Windows 11 PC. Complete each task by typing the real command.',
    { shell: 'cmd', prompt: 'C:\\Users\\tech>' },
    [{ t: 'List the files and folders in the current directory.', accept: [/^dir$/i], show: 'dir', hint: 'Three letters; short for "directory".', out: ' Directory of C:\\Users\\tech\n\n11/12/2026  09:02 AM    <DIR>          Desktop\n11/12/2026  09:02 AM    <DIR>          Documents\n11/14/2026  04:41 PM    <DIR>          Downloads\n11/10/2026  08:15 AM             1,204 notes.txt\n               1 File(s)          1,204 bytes', why: 'dir lists a folder. <DIR> marks folders.' },
     { t: 'Change into the <b>Documents</b> folder.', accept: [/^cd documents\\?$/i, /^cd \.\\documents\\?$/i, /^chdir documents$/i], show: 'cd Documents', hint: 'cd = change directory, then the folder name.', out: '', prompt: 'C:\\Users\\tech\\Documents>', why: 'The prompt always shows where you are.' },
     { t: 'Make a new folder here called <b>Reports</b>.', accept: [/^(md|mkdir) reports$/i], show: 'md Reports', hint: 'md = make directory.', out: '', why: 'md (or mkdir) creates a folder.' },
     { t: 'Go back <b>up one level</b> to the parent folder.', accept: [/^cd ?\.\.\\?$/i], show: 'cd ..', hint: 'Two dots mean "the parent folder".', out: '', prompt: 'C:\\Users\\tech>', why: '.. always means the folder above.' },
     { t: 'Remove the empty folder <b>Documents\\Reports</b> without changing directory.', accept: [/^(rmdir|rd) documents\\reports\\?$/i, /^(rmdir|rd) \.\\documents\\reports\\?$/i], show: 'rmdir Documents\\Reports', hint: 'rmdir = remove directory. Give the path from where you are.', out: '', why: 'rmdir removes an empty folder; add /s to remove a folder and everything in it.' },
     { t: 'You forgot the options for <b>robocopy</b>. Show its built-in help.', accept: [/^robocopy \/\?$/i], show: 'robocopy /?', hint: 'Every command accepts the same help switch: slash question mark.', out: '-------------------------------------------------------------------------------\n   ROBOCOPY     ::     Robust File Copy for Windows\n-------------------------------------------------------------------------------\n      Usage :: ROBOCOPY source destination [file [file]...] [options]\n      /E :: copy subdirectories, including Empty ones.\n    /MIR :: MIRror a directory tree (equivalent to /E plus /PURGE).', why: '[command] /? prints help for any command.', ask: { q: 'Which robocopy switch mirrors a directory tree?', accept: ['/mir', 'mir'], why: '/MIR makes the destination identical to the source — including deleting extra files.' } }],
    'Navigation: dir, cd, cd .., md, rmdir. Stuck on any command? Add /?.',
    ['cd = change directory. md = make directory. rmdir = remove directory.']);
  T('c2-cli-net', 'Network commands on a real ticket', 'ipconfig, ping, nslookup, tracert, netstat, net use',
    'Ticket: "I can\'t get to the intranet site." You are on the user\'s PC. Work through it like a tech would — from the PC outward.',
    { shell: 'cmd', prompt: 'C:\\Users\\jsmith>' },
    [{ t: 'Show this PC\'s <b>full</b> IP configuration, including DNS servers and whether DHCP is on.', accept: [/^ipconfig ?\/all$/i], show: 'ipconfig /all', hint: 'ipconfig with the switch that shows everything.', out: 'Ethernet adapter Ethernet:\n   Description . . . . . . . . : Intel(R) Ethernet Connection I219-LM\n   Physical Address. . . . . . : 8C-16-45-2A-91-0F\n   DHCP Enabled. . . . . . . . : Yes\n   IPv4 Address. . . . . . . . : 10.20.30.57(Preferred)\n   Subnet Mask . . . . . . . . : 255.255.255.0\n   Default Gateway . . . . . . : 10.20.30.1\n   DHCP Server . . . . . . . . : 10.20.30.5\n   DNS Servers . . . . . . . . : 10.20.30.5', ask: { q: 'What is the default gateway?', accept: ['10.20.30.1'], why: 'The gateway is the router that leads off this subnet. Ping it next.' }, why: 'ipconfig /all shows IP, mask, gateway, DHCP and DNS in one place.' },
     { t: 'Test whether the PC can reach its <b>default gateway</b>.', accept: [/^ping 10\.20\.30\.1$/i], show: 'ping 10.20.30.1', hint: 'ping followed by the gateway address you just read.', out: 'Reply from 10.20.30.1: bytes=32 time<1ms TTL=64\nReply from 10.20.30.1: bytes=32 time<1ms TTL=64\nReply from 10.20.30.1: bytes=32 time<1ms TTL=64\nReply from 10.20.30.1: bytes=32 time<1ms TTL=64\n\nPackets: Sent = 4, Received = 4, Lost = 0 (0% loss)', why: 'Replies from the gateway prove the cable, switch port, IP settings and local network are fine.' },
     { t: 'Check whether DNS can resolve the name <b>intranet.corp.local</b>.', accept: [/^nslookup intranet\.corp\.local$/i], show: 'nslookup intranet.corp.local', hint: 'The DNS lookup tool, then the name.', out: 'Server:  dc01.corp.local\nAddress:  10.20.30.5\n\nName:    intranet.corp.local\nAddress:  10.20.40.80', ask: { q: 'What IP address does the intranet site resolve to?', accept: ['10.20.40.80'], why: 'DNS works. The server is on another subnet (10.20.40.x), so traffic must be routed.' }, why: 'nslookup proves DNS is answering and shows which server answered.' },
     { t: 'Trace the route to <b>10.20.40.80</b> to see where packets stop.', accept: [/^tracert 10\.20\.40\.80$/i], show: 'tracert 10.20.40.80', hint: 'Windows spells it tracert.', out: 'Tracing route to 10.20.40.80 over a maximum of 30 hops\n\n  1    <1 ms    <1 ms    <1 ms  10.20.30.1\n  2     *        *        *     Request timed out.\n  3     *        *        *     Request timed out.', ask: { q: 'What is the last hop that answered?', accept: ['10.20.30.1'], why: 'Packets die right after the gateway — a routing or firewall problem between subnets. That is the network team\'s issue: escalate with this evidence.' }, why: 'tracert lists each router hop; the last reply shows where the path breaks.' },
     { t: 'Before you escalate, list this PC\'s active connections and listening ports <b>numerically</b>.', accept: [/^netstat ?-an?o?$/i, /^netstat ?-na$/i, /^netstat -a -n$/i, /^netstat$/i], show: 'netstat -an', hint: 'netstat, with -a (all) and -n (numbers).', out: 'Active Connections\n\n  Proto  Local Address          Foreign Address        State\n  TCP    0.0.0.0:135            0.0.0.0:0              LISTENING\n  TCP    0.0.0.0:445            0.0.0.0:0              LISTENING\n  TCP    10.20.30.57:49722      10.20.30.5:445         ESTABLISHED', why: 'netstat shows what the PC is connected to and which ports are open.' },
     { t: 'The user also needs the shared folder back. Map drive <b>S:</b> to <b>\\\\fs01\\sales</b>.', accept: [/^net use s: \\\\fs01\\sales( \/persistent:yes)?$/i], show: 'net use S: \\\\fs01\\sales', hint: 'net use, drive letter with a colon, then the UNC path (two backslashes, server, backslash, share).', out: 'The command completed successfully.', why: 'net use maps (or with /delete, removes) a network drive.' }],
    'The order matters: own config (ipconfig /all) → gateway (ping) → name resolution (nslookup) → path (tracert). You found the fault is beyond the gateway, with proof. That is a professional escalation.',
    ['Work from the PC outward: am I configured? can I reach the gateway? does the name resolve? where does the path stop?']);
  T('c2-cli-sys', 'Disk, system and policy commands', 'chkdsk, sfc, diskpart, gpupdate, gpresult, whoami and more',
    'You are in an <b>elevated</b> (Run as administrator) Command Prompt on a domain PC that has been crashing and is not getting a new policy.',
    { shell: 'cmd', prompt: 'C:\\Windows\\System32>' },
    [{ t: 'Confirm which account you are running as.', accept: [/^whoami$/i], show: 'whoami', hint: 'Literally ask "who am I".', out: 'corp\\tech.admin', why: 'whoami shows domain\\user. Useful to confirm you really are elevated/the right account.' },
     { t: 'Show this computer\'s name.', accept: [/^hostname$/i], show: 'hostname', hint: 'The command is the word for a computer\'s name.', out: 'WS-ACCT-014', why: 'hostname prints the computer name — put it in the ticket.' },
     { t: 'Scan protected Windows system files and repair any that are corrupted.', accept: [/^sfc ?\/scannow$/i], show: 'sfc /scannow', hint: 'System File Checker, with the switch that scans now.', out: 'Beginning system scan.  This process will take some time.\n\nBeginning verification phase of system scan.\nVerification 100% complete.\n\nWindows Resource Protection found corrupt files and successfully repaired them.', why: 'sfc /scannow replaces damaged system files from a cached copy.' },
     { t: 'Check drive <b>C:</b> for filesystem errors and <b>fix</b> them.', accept: [/^chkdsk c: ?\/f$/i, /^chkdsk ?\/f c:$/i, /^chkdsk c: ?\/r$/i, /^chkdsk c: \/f \/r$/i], show: 'chkdsk C: /f', hint: 'Check disk, the drive, and the switch that fixes.', out: 'The type of the file system is NTFS.\nCannot lock current drive.\n\nChkdsk cannot run because the volume is in use by another\nprocess.  Would you like to schedule this volume to be\nchecked the next time the system restarts? (Y/N) Y\n\nThis volume will be checked the next time the system restarts.', why: 'chkdsk /f fixes filesystem errors; /r also finds bad sectors. The system drive is checked at the next restart.' },
     { t: 'Force this PC to re-apply Group Policy right now.', accept: [/^gpupdate( ?\/force)?$/i], show: 'gpupdate /force', hint: 'Group policy update.', out: 'Updating policy...\n\nComputer Policy update has completed successfully.\nUser Policy update has completed successfully.', why: 'gpupdate /force re-applies all policies instead of waiting for the background refresh.' },
     { t: 'Show a <b>summary</b> of which policies (GPOs) are actually applied to this user and computer.', accept: [/^gpresult ?\/r$/i], show: 'gpresult /r', hint: 'Group policy result, with /r for the summary report.', out: 'COMPUTER SETTINGS\n    Applied Group Policy Objects\n        Default Domain Policy\n        Workstation Baseline\n\nUSER SETTINGS\n    Applied Group Policy Objects\n        Default Domain Policy\n    The following GPOs were not applied because they were filtered out\n        Accounting Drive Maps\n            Filtering:  Denied (Security)', ask: { q: 'Which GPO was filtered out (not applied)?', accept: ['accounting drive maps'], why: '"Denied (Security)" = the user is not in the group the GPO is filtered to. Fix the group membership, not the PC.' }, why: 'gpresult /r proves what did and did not apply — and why.' },
     { t: 'Show the Windows version and build in a pop-up window.', accept: [/^winver$/i], show: 'winver', hint: 'Windows version, shortened.', out: '[About Windows]\nWindows 11 Pro   Version 24H2 (OS Build 26100.2314)', why: 'winver is the fastest way to answer "what version are you on?"' }],
    'sfc repairs system files. chkdsk repairs the filesystem. gpupdate applies policy; gpresult proves what applied. These need an elevated prompt.',
    ['System File Checker = sfc. Check Disk = chkdsk. Group Policy = gpupdate / gpresult.']);
  M('c2-cli-pick', 'Pick the command', 'All 1.5 commands by purpose',
    'Pick the command for each job.', ['pathping', 'robocopy', 'diskpart', 'format', 'net user', 'net use', 'netstat', 'gpresult', 'sfc', 'chkdsk'],
    [['Trace the route AND measure packet loss at each hop', 'pathping', 'tracert + ping statistics.'],
     ['Copy a large folder tree to a server, resuming after a dropped connection', 'robocopy', 'Robust copy: retries, /MIR, logs.'],
     ['Partition a disk from the command line (list disk, select disk, clean)', 'diskpart', 'Powerful and destructive.'],
     ['Put a new filesystem on a volume', 'format', 'Erases the volume\'s file table.'],
     ['List local accounts or reset a local password', 'net user', 'net user name * to set a password.'],
     ['Map or disconnect a network drive', 'net use', 'net use Z: \\\\server\\share.'],
     ['See listening ports and active connections', 'netstat', 'netstat -an (add -o for PIDs).'],
     ['Prove which Group Policy Objects applied', 'gpresult', 'gpresult /r.'],
     ['Repair corrupted Windows system files', 'sfc', 'sfc /scannow.'],
     ['Repair filesystem errors and bad sectors on a drive', 'chkdsk', 'chkdsk /f or /r.']],
    'If you can pick the command from the job description, you can answer every 1.5 question.');

  RK.add({ track: TR, id: '1.5', dom: 1, short: 'Microsoft command-line tools', title: 'Given a scenario, use the appropriate Microsoft command-line tools',
    goal: 'Type the real commands: navigation, networking, disk, file, informational and OS-management tools — and read their output.',
    kw: /\b(command.line|command prompt|\bcmd\b|\bcd\b|\bdir\b|ipconfig|\bping\b|netstat|nslookup|net use|tracert|pathping|chkdsk|\bformat\b|diskpart|\bmd\b|rmdir|robocopy|hostname|net user|winver|whoami|gpupdate|gpresult|\bsfc\b|\/\?)/,
    parts: [
      P('Navigation and help: cd, dir, md, rmdir, /?', 'Move around the filesystem, create and remove folders, and get help on any command.',
        `<p>The <b>Command Prompt</b> (<code>cmd</code>) shows a <b>prompt</b> such as <code>C:\\Users\\tech&gt;</code>. That path is your current folder.</p>
<table><tr><th>Command</th><th>Does</th><th>Example</th></tr>
<tr><td><code>dir</code></td><td>List the folder</td><td><code>dir</code> · <code>dir /a</code> (include hidden)</td></tr>
<tr><td><code>cd</code></td><td>Change directory</td><td><code>cd Documents</code> · <code>cd ..</code> (up one) · <code>cd \\</code> (root)</td></tr>
<tr><td><code>md</code></td><td>Make a directory</td><td><code>md Reports</code></td></tr>
<tr><td><code>rmdir</code></td><td>Remove a directory</td><td><code>rmdir Reports</code> · <code>rmdir /s Reports</code> (with contents)</td></tr>
<tr><td><code>[command] /?</code></td><td>Help for that command</td><td><code>robocopy /?</code></td></tr></table>
<ul><li>Switch drives by typing the letter: <code>D:</code></li>
<li>Paths use backslashes: <code>C:\\Users\\tech\\Documents</code>. Put quotes around paths with spaces.</li>
<li>Commands are <b>not</b> case-sensitive in Windows.</li>
<li>Some commands need an <b>elevated</b> prompt: right-click → <i>Run as administrator</i>.</li></ul>`,
        [['Which command moves up one folder level?', 'cd ..', ['cd /', 'dir ..', 'md ..'], 'Two dots mean the parent directory.'],
         ['How do you see the available switches for any command?', 'Add /? after the command', ['Add --help', 'Type man before it', 'Press F1'], 'For example: chkdsk /?']],
        'c2-cli-nav'),
      P('Network commands', 'Use ipconfig, ping, nslookup, tracert, pathping, netstat and net use in the right order.',
        `<table><tr><th>Command</th><th>Answers</th><th>Useful forms</th></tr>
<tr><td><code>ipconfig</code></td><td>What are my IP settings?</td><td><code>/all</code> (everything) · <code>/release</code> + <code>/renew</code> (new DHCP lease) · <code>/flushdns</code></td></tr>
<tr><td><code>ping</code></td><td>Can I reach it? How fast?</td><td><code>ping 10.0.0.1</code> · <code>ping -t</code> (until stopped)</td></tr>
<tr><td><code>nslookup</code></td><td>Does the name resolve? Which DNS answered?</td><td><code>nslookup server01</code></td></tr>
<tr><td><code>tracert</code></td><td>Which routers are on the path? Where does it stop?</td><td><code>tracert 8.8.8.8</code></td></tr>
<tr><td><code>pathping</code></td><td>Path <i>plus</i> packet loss at each hop</td><td>Slower; great for "intermittent"</td></tr>
<tr><td><code>netstat</code></td><td>What connections and listening ports are open?</td><td><code>-a</code> all · <code>-n</code> numbers · <code>-o</code> process ID</td></tr>
<tr><td><code>net use</code></td><td>Map / list / remove network drives</td><td><code>net use Z: \\\\fs01\\share</code> · <code>net use Z: /delete</code></td></tr></table>
<p><b>Troubleshoot from the PC outward:</b> <code>ipconfig /all</code> → ping the gateway → <code>nslookup</code> the name → <code>tracert</code> to the server.</p>
<div class="callout pro"><b class="k">On the job</b> An address of <code>169.254.x.x</code> in ipconfig means the PC got no answer from DHCP. Check the cable/Wi-Fi, then <code>ipconfig /renew</code>.</div>`,
        [['Which command shows the DNS servers a PC is using?', 'ipconfig /all', ['ipconfig', 'ping', 'netstat -an'], 'Plain ipconfig omits DNS servers.'],
         ['A site loads by IP address but not by name. Which tool tests the likely cause?', 'nslookup', ['tracert', 'net use', 'chkdsk'], 'Name resolution (DNS) is the suspect.'],
         ['Which command combines the features of tracert and ping to show loss per hop?', 'pathping', ['netstat', 'nslookup', 'ipconfig /all'], 'pathping measures loss at each router.']],
        'c2-cli-net'),
      P('Disk and file commands', 'Use chkdsk, format, diskpart and robocopy safely.',
        `<table><tr><th>Command</th><th>Does</th><th>Know</th></tr>
<tr><td><code>chkdsk</code></td><td>Checks a volume's filesystem</td><td><code>/f</code> fix errors · <code>/r</code> locate bad sectors and recover data (includes /f). C: runs at next restart.</td></tr>
<tr><td><code>format</code></td><td>Creates a new filesystem on a volume</td><td><code>format D: /fs:ntfs /q</code>. <b>Erases the file table.</b></td></tr>
<tr><td><code>diskpart</code></td><td>Interactive disk partitioning</td><td><code>list disk</code> → <code>select disk 1</code> → <code>clean</code> → <code>create partition primary</code>. <code>clean</code> wipes the partition table — triple-check the selected disk.</td></tr>
<tr><td><code>robocopy</code></td><td>Robust file copy</td><td><code>robocopy C:\\Data \\\\fs01\\Backup /E</code> (subfolders) · <code>/MIR</code> (mirror — also deletes extras) · restarts after network drops.</td></tr></table>
<div class="callout trap"><b class="k">Exam trap</b> <code>chkdsk</code> fixes the <b>disk's filesystem</b>. <code>sfc</code> fixes <b>Windows system files</b>. Clicking noises or bad sectors → chkdsk /r. Missing/corrupt DLLs → sfc /scannow.</div>
<div class="callout pro"><b class="k">On the job</b> Use robocopy, not drag-and-drop, to move a user's profile or a big share. It logs, retries and can resume.</div>`,
        [['Which chkdsk switch locates bad sectors and recovers readable data?', '/r', ['/f', '/q', '/all'], '/r includes /f and adds a surface scan.'],
         ['Which command is best for copying a large folder tree over an unreliable network link?', 'robocopy', ['format', 'diskpart', 'cd'], 'It retries and resumes.']]),
      P('Informational and OS-management commands', 'Use hostname, whoami, winver, net user, gpupdate, gpresult and sfc.',
        `<table><tr><th>Command</th><th>Tells you / does</th></tr>
<tr><td><code>hostname</code></td><td>The computer's name</td></tr>
<tr><td><code>whoami</code></td><td>The signed-in account (<code>domain\\user</code>)</td></tr>
<tr><td><code>winver</code></td><td>Windows edition, version and build (opens a window)</td></tr>
<tr><td><code>net user</code></td><td>Lists local accounts. <code>net user jsmith</code> shows details; <code>net user jsmith *</code> sets a new password; <code>/add</code> creates one.</td></tr>
<tr><td><code>gpupdate</code></td><td>Re-applies Group Policy now. <code>/force</code> re-applies everything.</td></tr>
<tr><td><code>gpresult</code></td><td>Shows which policies <i>actually applied</i>. <code>/r</code> = summary.</td></tr>
<tr><td><code>sfc</code></td><td>System File Checker. <code>sfc /scannow</code> verifies and repairs protected system files.</td></tr></table>
<p><b>Typical use:</b> "The new drive mapping policy isn't working on my PC." → <code>gpupdate /force</code>, then <code>gpresult /r</code> to see whether the policy is listed. If it was filtered out, the problem is group membership or scope — not the PC.</p>`,
        [['Which command immediately re-applies Group Policy settings?', 'gpupdate /force', ['gpresult /r', 'sfc /scannow', 'net use'], 'gpupdate applies; gpresult reports.'],
         ['Which command verifies and repairs corrupted Windows system files?', 'sfc /scannow', ['chkdsk /f', 'format /q', 'diskpart clean'], 'System File Checker.']],
        'c2-cli-sys')
    ],
    wrap: { recap: ['Navigate: dir, cd, cd .., md, rmdir. Help on anything: command /?', 'Network, PC outward: ipconfig /all → ping gateway → nslookup → tracert / pathping. netstat for ports; net use for mapped drives.', 'ipconfig /release, /renew, /flushdns. 169.254.x.x = no DHCP.', 'chkdsk /f /r = filesystem and bad sectors. sfc /scannow = Windows system files.', 'format = new filesystem. diskpart = partitions (clean wipes). robocopy = robust copy (/E, /MIR).', 'hostname, whoami, winver, net user. gpupdate /force applies policy; gpresult /r proves it.'], lab: 'c2-cli-pick' }
  });

  // ===================== 1.6 Windows settings =====================
  M('c2-cp', 'Which Control Panel utility?', 'Classic Control Panel applets',
    'Pick the Control Panel utility for each task.', ['Programs and Features', 'Devices and Printers', 'Network and Sharing Center', 'Windows Defender Firewall', 'User Accounts', 'Internet Options', 'Power Options', 'File Explorer Options', 'Indexing Options', 'Sound', 'Mail'],
    [['Uninstall an application or turn a Windows feature on', 'Programs and Features', 'Also "Turn Windows features on or off".'],
     ['Set the default printer or view its queue', 'Devices and Printers', 'Printers, scanners, other devices.'],
     ['Change adapter settings or the network profile', 'Network and Sharing Center', 'Adapter, sharing and connection settings.'],
     ['Allow an app through, or block an inbound port', 'Windows Defender Firewall', 'Rules and exceptions.'],
     ['Change an account type from Standard to Administrator', 'User Accounts', 'Local account management.'],
     ['Set a proxy server, home page or clear browsing history for legacy browser settings', 'Internet Options', 'Connections tab → LAN settings.'],
     ['Stop a laptop sleeping when the lid closes', 'Power Options', 'Choose what closing the lid does.'],
     ['Show hidden files and file extensions', 'File Explorer Options', 'View tab.'],
     ['Searches cannot find files in a new folder; add it to the search catalog', 'Indexing Options', 'Rebuild or modify the index.'],
     ['Pick the default speakers or microphone', 'Sound', 'Playback / Recording tabs.'],
     ['Create or repair an Outlook mail profile', 'Mail', 'Appears when Outlook is installed.']],
    'Control Panel still holds the detailed, classic settings. Open it with "control" from Run.');
  M('c2-settings', 'Which Settings category?', 'The modern Settings app',
    'Pick the Settings category for each task.', ['System', 'Devices', 'Network and Internet', 'Personalization', 'Apps', 'Accounts', 'Time and Language', 'Gaming', 'Ease of Access', 'Privacy', 'Update and Security'],
    [['Change display resolution or see device specifications (About)', 'System', 'Display, notifications, storage, About.'],
     ['Pair a Bluetooth mouse or add a printer', 'Devices', 'Bluetooth, printers, mouse, USB.'],
     ['Connect to Wi-Fi, set a VPN or a proxy', 'Network and Internet', 'Wi-Fi, Ethernet, VPN, proxy.'],
     ['Change the wallpaper, theme or lock screen', 'Personalization', 'Look and feel.'],
     ['Set the default browser or uninstall an app', 'Apps', 'Installed apps, default apps, startup.'],
     ['Add a work or school account, set up a PIN or fingerprint', 'Accounts', 'Sign-in options, family.'],
     ['Fix the wrong time zone or add a keyboard language', 'Time and Language', 'Region, language, speech.'],
     ['Turn on Game Mode or the capture bar', 'Gaming', 'Game Bar, Game Mode.'],
     ['Turn on the screen reader or high contrast', 'Ease of Access', 'Called Accessibility in Windows 11.'],
     ['Stop apps using the camera, microphone or location', 'Privacy', 'App permissions.'],
     ['Check for Windows updates, open recovery or activation', 'Update and Security', 'Windows Update, recovery, backup.']],
    'Windows 11 renames a few: Ease of Access → Accessibility, Devices → Bluetooth & devices, Update & Security → Windows Update (+ Privacy & security). The exam uses the names above.');
  M('c2-power', 'Power and Explorer options', 'Sleep, hibernate, fast startup, hidden files',
    'Pick the setting for each need.', ['Sleep / suspend', 'Hibernate', 'Fast startup', 'Lid close action', 'USB selective suspend', 'Power plan', 'Show hidden files', 'Hide extensions (turn off)'],
    [['Pause quickly, keep work in RAM, wake in a second; still uses a little power', 'Sleep / suspend', 'State kept in RAM.'],
     ['Save everything to disk and power off completely; resume later exactly where you were', 'Hibernate', 'State saved to hiberfil.sys; zero power.'],
     ['Windows boots faster after Shut down, but a dual-boot or update issue appears', 'Fast startup', 'A hybrid shutdown; turn off to troubleshoot.'],
     ['Laptop should keep running when closed and docked', 'Lid close action', 'Set to "Do nothing".'],
     ['A USB device keeps disconnecting to save power', 'USB selective suspend', 'Disable it in advanced power settings.'],
     ['Choose Balanced, Power saver or High performance', 'Power plan', 'A named set of power settings.'],
     ['You need to see the AppData folder', 'Show hidden files', 'File Explorer Options → View.'],
     ['A user cannot tell invoice.pdf from invoice.pdf.exe', 'Hide extensions (turn off)', 'Show extensions to expose disguised malware.']],
    'Sleep = RAM, fast, some power. Hibernate = disk, slower, no power. Fast startup = partial hibernate on shutdown.');

  RK.add({ track: TR, id: '1.6', dom: 1, short: 'Windows settings', title: 'Given a scenario, configure Microsoft Windows settings',
    goal: 'Find the right Control Panel utility or Settings category for any task, including power and File Explorer options.',
    kw: /\b(control panel|internet options|devices and printers|programs and features|network and sharing|user accounts|indexing|administrative tools|file explorer options|hidden files|extensions|power options|power plan|hibernate|sleep|standby|suspend|fast startup|selective suspend|lid|ease of access|accessibility|time and language|personalization|settings app|privacy settings|gaming)/,
    parts: [
      P('Control Panel utilities', 'Pick the classic Control Panel utility for a task.',
        `<p>Windows has two places for settings: the classic <b>Control Panel</b> and the modern <b>Settings</b> app. The exam names both.</p>
<table><tr><th>Utility</th><th>Use it to</th></tr>
<tr><td><b>Internet Options</b></td><td>Proxy (Connections → LAN settings), security zones, home page, clear history</td></tr>
<tr><td><b>Devices and Printers</b></td><td>Add/remove printers, set the default, see the queue</td></tr>
<tr><td><b>Programs and Features</b></td><td>Uninstall/repair apps; turn Windows features on or off</td></tr>
<tr><td><b>Network and Sharing Center</b></td><td>Adapter settings, network profile, sharing options</td></tr>
<tr><td><b>System</b></td><td>Computer name, domain/workgroup, remote settings, performance options</td></tr>
<tr><td><b>Windows Defender Firewall</b></td><td>Turn on/off per profile; allow an app; advanced rules</td></tr>
<tr><td><b>Mail</b></td><td>Outlook profiles and data files</td></tr>
<tr><td><b>Sound</b></td><td>Default playback/recording device, levels</td></tr>
<tr><td><b>User Accounts</b></td><td>Account type, credentials, UAC settings</td></tr>
<tr><td><b>Device Manager</b></td><td>Drivers and hardware</td></tr>
<tr><td><b>Indexing Options</b></td><td>What Windows Search indexes; rebuild the index</td></tr>
<tr><td><b>Administrative Tools</b></td><td>Shortcuts to the snap-ins (called <i>Windows Tools</i> in Windows 11)</td></tr></table>`,
        [['Where do you uninstall a program or turn on a Windows feature such as Hyper-V?', 'Programs and Features', ['Devices and Printers', 'Indexing Options', 'Internet Options'], 'It also holds "Turn Windows features on or off".'],
         ['Windows Search cannot find files in a new data folder. Which utility fixes this?', 'Indexing Options', ['Sound', 'Mail', 'User Accounts'], 'Add the location or rebuild the index.']],
        'c2-cp'),
      P('File Explorer and Power Options', 'Configure hidden files, extensions, sleep, hibernate, lid action and fast startup.',
        `<p><b>File Explorer Options</b> (General and View tabs):</p>
<ul><li><b>Show hidden files, folders and drives</b> — needed to see folders like <code>AppData</code>.</li>
<li><b>Hide extensions for known file types</b> — turn this <b>off</b> so <code>report.pdf.exe</code> cannot pretend to be a PDF.</li>
<li><b>General</b> — open to "This PC" or "Home", single- or double-click, privacy (recent files).</li></ul>
<p><b>Power Options:</b></p>
<table><tr><th>Setting</th><th>Meaning</th></tr>
<tr><td><b>Sleep / suspend / standby</b></td><td>Work stays in RAM; low power; wakes in seconds. Lost if the battery dies.</td></tr>
<tr><td><b>Hibernate</b></td><td>Work saved to disk; PC fully off; slower to resume. Safe for a bag.</td></tr>
<tr><td><b>Power plans</b></td><td>Balanced, Power saver, High performance.</td></tr>
<tr><td><b>Choose what closing the lid does</b></td><td>Do nothing / Sleep / Hibernate / Shut down.</td></tr>
<tr><td><b>Fast startup</b></td><td>Shut down saves the kernel to disk for a quicker boot. Turn off when dual-booting or when updates/drivers misbehave.</td></tr>
<tr><td><b>USB selective suspend</b></td><td>Powers down idle USB ports. Disable if a USB device keeps dropping.</td></tr></table>`,
        [['Which power state saves open work to the drive and uses no power?', 'Hibernate', ['Sleep', 'Standby', 'Fast startup'], 'Hibernate writes RAM to disk and powers off.'],
         ['Why turn OFF "Hide extensions for known file types"?', 'So disguised files like invoice.pdf.exe are obvious', ['To make files open faster', 'To show hidden system folders', 'To enable file sharing'], 'Users can see the real file type.']],
        'c2-power'),
      P('The Settings app', 'Pick the Settings category for a task.',
        `<p>Open Settings with <b>Win + I</b>. The exam lists these categories:</p>
<table><tr><th>Category</th><th>Contains</th></tr>
<tr><td><b>System</b></td><td>Display, sound, notifications, power, storage, <b>About</b> (specs, rename PC)</td></tr>
<tr><td><b>Devices</b></td><td>Bluetooth, printers and scanners, mouse, typing, USB</td></tr>
<tr><td><b>Network and Internet</b></td><td>Wi-Fi, Ethernet, VPN, proxy, mobile hotspot, airplane mode</td></tr>
<tr><td><b>Personalization</b></td><td>Background, colors, themes, lock screen, taskbar</td></tr>
<tr><td><b>Apps</b></td><td>Installed apps, default apps, optional features, startup apps</td></tr>
<tr><td><b>Accounts</b></td><td>Your info, email accounts, sign-in options (PIN, fingerprint), work or school access</td></tr>
<tr><td><b>Time and Language</b></td><td>Date/time, time zone, region, language, keyboard</td></tr>
<tr><td><b>Gaming</b></td><td>Game Bar, captures, Game Mode</td></tr>
<tr><td><b>Ease of Access</b></td><td>Narrator, magnifier, high contrast, closed captions</td></tr>
<tr><td><b>Privacy</b></td><td>App permissions: location, camera, microphone; diagnostics</td></tr>
<tr><td><b>Update and Security</b></td><td>Windows Update, Windows Security, backup, recovery, activation</td></tr></table>
<p>A wrong clock breaks logins and secure websites — <b>Time and Language</b> is a real fix, not a cosmetic one.</p>`,
        [['Where do you allow or block an app\'s access to the microphone?', 'Privacy', ['Devices', 'Accounts', 'Personalization'], 'App permissions live under Privacy.'],
         ['Where do you add a work or school account to a PC?', 'Accounts', ['System', 'Apps', 'Update and Security'], 'Accounts → Access work or school.']],
        'c2-settings')
    ],
    wrap: { recap: ['Control Panel: Programs and Features (uninstall/features), Devices and Printers, Network and Sharing Center, User Accounts, Sound, Mail, Indexing Options, Internet Options (proxy).', 'File Explorer Options: show hidden files; show extensions to expose fake file types.', 'Sleep = RAM, quick. Hibernate = disk, no power. Fast startup = hybrid shutdown (disable to troubleshoot).', 'Lid close action and USB selective suspend live in Power Options.', 'Settings (Win+I): System, Devices, Network and Internet, Personalization, Apps, Accounts, Time and Language, Gaming, Ease of Access, Privacy, Update and Security.'], lab: 'c2-settings' }
  });
})();
