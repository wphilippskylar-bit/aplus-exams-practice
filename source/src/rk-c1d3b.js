/* A+ Core 1 (220-1201) — Domain 3.0 Hardware — objectives 3.5 to 3.8 + domain wrap lab + extras */
(function () {
  var RK = window.RK, P = RK.P, M = RK.M, O = RK.O, T = RK.T, C = RK.C, TR = 'core1';
  function pro(t) { return '<div class="callout pro"><b class="k">On the job</b>' + t + '</div>'; }
  function trap(t) { return '<div class="callout trap"><b class="k">Exam trap</b>' + t + '</div>'; }

  // ===================== 3.5 Motherboards, CPUs, add-on cards =====================
  M('c1-mobo', 'Board, slot or socket?', 'Form factors, connectors, sockets',
    'Pick the answer.', ['ATX', 'microATX', 'ITX', 'PCIe x16', 'PCI', 'M.2 slot', 'SATA port', 'Front-panel header', '24-pin power connector', 'LGA socket (Intel)', 'AM5 socket (AMD)', 'Multisocket board'],
    [['Full-size 12 × 9.6 in board with up to seven expansion slots', 'ATX', 'Standard.'], ['9.6 × 9.6 in board for a mid-size case', 'microATX', 'Fewer slots.'], ['Tiny 6.7 × 6.7 in board for a small home-theater PC', 'ITX', 'Mini-ITX.'], ['Where the graphics card goes', 'PCIe x16', 'Most lanes.'], ['Old parallel expansion slot for a legacy capture card', 'PCI', 'Legacy.'], ['Where an NVMe SSD screws onto the board', 'M.2 slot', 'Storage.'], ['7-pin port for a 3.5-inch HDD data cable', 'SATA port', 'Drive data.'], ['Pins for the case power button, reset and LEDs', 'Front-panel header', 'Headers.'], ['Main power from the PSU to the board', '24-pin power connector', 'ATX power.'], ['Pins are in the socket, not on the CPU', 'LGA socket (Intel)', 'Land grid array.'], ['Current AMD desktop socket (now LGA as well)', 'AM5 socket (AMD)', 'AMD.'], ['Server board that holds two CPUs', 'Multisocket board', 'Multi-CPU.']],
    'Form factor must fit the case; socket must match the CPU; slots must match the cards.');
  T('c1-uefi', 'Is this PC ready for Windows 11 and virtualization?', 'TPM, Secure Boot, CPU features',
    'Ticket: before upgrading a PC and enabling Hyper-V for a developer, check the firmware security features and CPU support. Elevated PowerShell.',
    { shell: 'ps', prompt: 'PS C:\\Windows\\system32>' },
    [{ t: 'Check the Trusted Platform Module.', accept: [/^get-tpm$/i], show: 'Get-Tpm', hint: 'Get-Tpm', out: 'TpmPresent                : True\nTpmReady                  : True\nTpmEnabled                : True\nManufacturerVersionFull20 : 7.2.3.1', why: 'TPM 2.0 present and ready: stores BitLocker keys and measures the boot.' },
     { t: 'Check whether Secure Boot is on.', accept: [/^confirm-securebootuefi$/i], show: 'Confirm-SecureBootUEFI', hint: 'Confirm-SecureBootUEFI', out: 'False', ask: { q: 'Is Secure Boot enabled? (yes/no)', accept: ['no'], why: 'It is off. Enable it in UEFI setup (Boot/Security tab). Secure Boot only runs signed boot loaders, blocking bootkits.' }, why: 'BIOS/UEFI setting.' },
     { t: 'Check the CPU: name, architecture, cores and logical processors.', accept: [/^get-ciminstance (-classname )?win32_processor( \| select(-object)? .+| \| (fl|format-list).*)?$/i, /^gcim win32_processor.*$/i], show: 'Get-CimInstance Win32_Processor | Select-Object Name,Architecture,NumberOfCores,NumberOfLogicalProcessors,VirtualizationFirmwareEnabled', hint: 'Win32_Processor', out: 'Name                          : Intel(R) Core(TM) i7-12700\nArchitecture                  : 9\nNumberOfCores                 : 12\nNumberOfLogicalProcessors     : 20\nVirtualizationFirmwareEnabled : False', ask: { q: 'Architecture 9 = x64, 12 = ARM64. Which architecture is this CPU?', accept: ['x64', 'x86-64', 'x86_64', 'amd64'], why: 'x64. 12 cores / 20 threads (hybrid P- and E-cores with hyper-threading on the P-cores). VirtualizationFirmwareEnabled is False → virtualization support (VT-x) is off in UEFI.' }, why: 'CPU architecture, core configuration, virtualization support.' },
     { t: 'After enabling Secure Boot and Intel VT-x in UEFI, reboot to firmware setup from Windows to confirm (no need to press keys at boot).', accept: [/^shutdown \/r \/fw( \/t 0)?$/i, /^shutdown \/r \/t 0 \/fw$/i], show: 'shutdown /r /fw /t 0', hint: 'shutdown /r /fw', out: 'Restarting into UEFI firmware settings...', why: 'Handy when Fast Boot makes the setup key hard to catch. Also set a BIOS/UEFI admin password so users cannot turn these off.' }],
    'Firmware checklist: TPM 2.0, Secure Boot, virtualization support, boot order and USB permissions, BIOS/boot passwords, fan and temperature monitoring.',
    ['Get-Tpm, Confirm-SecureBootUEFI, Win32_Processor, shutdown /r /fw.']);
  M('c1-cards', 'CPU, cards and cooling', 'Architecture, expansion cards, cooling, encryption',
    'Pick the answer.', ['x64', 'ARM', 'Sound card', 'Video card', 'Capture card', 'NIC', 'Heat sink + fan', 'Thermal paste', 'Liquid cooling', 'TPM', 'HSM'],
    [['Standard 64-bit desktop/laptop CPU architecture (Intel/AMD)', 'x64', 'x86-64.'], ['Power-efficient architecture in phones, tablets and some laptops', 'ARM', 'RISC.'], ['Studio needs better audio inputs and outputs', 'Sound card', 'Audio.'], ['3D design and gaming performance', 'Video card', 'GPU.'], ['Record HDMI from a camera or game console', 'Capture card', 'Video in.'], ['Add a 10 GbE port to a workstation', 'NIC', 'Network.'], ['Basic air cooling on a CPU', 'Heat sink + fan', 'Air.'], ['Fills microscopic gaps between CPU and cooler', 'Thermal paste', 'Heat transfer.'], ['Pump, radiator and block for a high-power CPU', 'Liquid cooling', 'Water.'], ['Chip on the motherboard that stores encryption keys for this PC', 'TPM', 'Trusted Platform Module.'], ['Dedicated appliance that stores keys for many servers', 'HSM', 'Hardware security module.']],
    'Expansion cards add capability; cooling keeps the CPU under its limit; TPM/HSM protect keys.');
  O('c1-build-order', 'Build a desktop', 'Combined 3.5',
    'Put the build steps in order.',
    [['Check compatibility: CPU socket, chipset, RAM type, case form factor', 'Before buying.'], ['Use ESD protection; install CPU in the socket (align the triangle, lever down)', 'Socket first, on the bench.'], ['Apply thermal paste (if not pre-applied) and mount the cooler; plug its fan into CPU_FAN', 'Cooling.'], ['Install RAM in the channel slots from the manual and the M.2 SSD', 'Memory and storage.'], ['Mount the board in the case on standoffs; connect 24-pin, CPU 8-pin and front-panel headers', 'Power and headers.'], ['Install expansion cards (GPU in PCIe x16) and connect their power', 'Cards.'], ['Enter UEFI: check temps, enable XMP/EXPO, TPM, Secure Boot, set boot order', 'Firmware.'], ['Install the OS and drivers, then test under load', 'Verify.']],
    'Compatibility → CPU/cooler/RAM on the bench → board in case → cards → firmware → OS.');

  RK.add({ track: TR, id: '3.5', dom: 3, short: 'Motherboards, CPUs & cards', title: 'Given a scenario, install and configure motherboards, central processing units (CPUs), and add-on cards',
    goal: 'Choose and install motherboards, CPUs, expansion cards and cooling, and configure BIOS/UEFI settings including TPM and Secure Boot.',
    kw: /\b(motherboard|atx|microatx|itx|pcie|pci\b|header|socket|lga|pga|am[45]|cpu|processor|bios|uefi|secure boot|tpm|hsm|boot password|virtualization support|vt-x|amd-v|x64|x86|arm\b|core|expansion card|sound card|video card|capture card|heat sink|thermal paste|liquid cool|fan)/,
    parts: [
      P('Form factors, connectors and sockets', 'Match motherboard form factors, connector types and CPU sockets.',
        `<ul><li><b>Form factors</b>: <b>ATX</b> (12 × 9.6 in, most slots), <b>microATX</b> (9.6 × 9.6 in), <b>ITX</b> (mini-ITX 6.7 × 6.7 in, one slot). Smaller boards fit bigger cases, not the reverse.</li>
<li><b>Connector types</b>:
<ul><li><b>PCIe</b> (x1, x4, x8, x16 lanes; x16 for graphics) and legacy <b>PCI</b>.</li>
<li><b>Power connectors</b>: 24-pin main, 4/8-pin CPU (EPS 12 V).</li>
<li><b>SATA</b> and <b>eSATA</b> ports; <b>M.2</b> slots for SSDs/Wi-Fi.</li>
<li><b>Headers</b>: front panel (power/reset/LEDs), USB, audio, fan, RGB.</li></ul></li>
<li><b>Motherboard compatibility</b> — the <b>CPU socket</b> must match: Intel uses LGA (pins in the socket, e.g. LGA 1700/1851); AMD uses AM4 (PGA, pins on the CPU) and AM5 (LGA). The chipset and BIOS version must support the CPU. <b>Multisocket</b> server boards hold two or more CPUs.</li></ul>` + pro('A new CPU on an older board often needs a BIOS update first — many boards support "BIOS flashback" from a USB stick with no CPU installed.') + trap('A microATX board fits in an ATX case, but an ATX board does not fit in a microATX case.'),
        [['Which slot is used for a modern graphics card?', 'PCIe x16', ['PCI', 'PCIe x1', 'M.2'], 'Most lanes.'],
         ['Which board form factor is smallest?', 'Mini-ITX', ['ATX', 'microATX', 'Extended ATX'], '6.7 in square.']],
        'c1-mobo'),
      P('BIOS/UEFI settings and encryption', 'Configure boot options, USB permissions, TPM, Secure Boot, passwords, fans, temperatures and virtualization support.',
        `<p><b>UEFI</b> is the modern firmware (replacing legacy BIOS): mouse-driven setup, GPT boot disks, Secure Boot. Enter it with a key at power-on (Del, F2, F10) or <code>shutdown /r /fw</code>.</p>
<ul><li><b>Boot options</b> — boot order, USB/network (PXE) boot, Fast Boot.</li>
<li><b>USB permissions</b> — disable USB ports or USB boot to stop data theft and booting other OSs.</li>
<li><b>Trusted Platform Module (TPM) security features</b> — enable TPM 2.0 (fTPM/PTT on many boards) for BitLocker and Windows 11.</li>
<li><b>Secure Boot</b> — only signed boot loaders run.</li>
<li><b>Boot password</b> (needed to start the PC) and <b>BIOS password</b> (needed to change settings).</li>
<li><b>Fan considerations</b> and <b>temperature monitoring</b> — fan curves, alarms.</li>
<li><b>Virtualization support</b> — Intel VT-x / AMD-V (and VT-d/IOMMU) must be on for hypervisors.</li></ul>
<p><b>Encryption hardware</b>: <b>TPM</b> = a chip on one PC storing its keys; <b>HSM</b> (hardware security module) = a dedicated device or card that stores and uses keys for many systems (CAs, payment).</p>` + pro('Always set a firmware admin password on company PCs. Without it, anyone can disable Secure Boot or boot a USB tool.') + trap('A BIOS/UEFI password protects the settings; a boot password is required to start the computer at all.'),
        [['Which firmware setting must be on to run a hypervisor like Hyper-V?', 'Virtualization support (VT-x/AMD-V)', ['Fast Boot', 'Legacy USB', 'Fan alarm'], 'CPU virtualization.'],
         ['What is the difference between a TPM and an HSM?', 'TPM is a chip in one PC; an HSM is a dedicated device managing keys for many systems', ['They are the same', 'HSM is only for laptops', 'TPM is software only'], 'Scope.']],
        'c1-uefi'),
      P('CPU architecture, expansion cards and cooling', 'Compare x86/x64 and ARM, core configurations, expansion cards and cooling methods.',
        `<ul><li><b>CPU architecture</b>: <b>x86</b> (32-bit) and <b>x64</b> (64-bit) from Intel/AMD — desktops, laptops, servers. <b>ARM</b> — power-efficient RISC design in phones, tablets, Apple Silicon Macs and Windows on ARM laptops. Software must be built for (or emulated on) the architecture.</li>
<li><b>Core configurations</b> — multicore CPUs; hyper-threading/SMT gives two threads per core; hybrid designs mix performance and efficiency cores.</li>
<li><b>Expansion cards</b>: <b>sound card</b>, <b>video card</b> (GPU), <b>capture card</b> (record/stream video input), <b>NIC</b> (more or faster network ports).</li>
<li><b>Cooling</b>: <b>fans</b> (case and CPU), <b>heat sink</b> (metal fins), <b>thermal paste/pads</b> (fill the gap between chip and cooler — paste for CPUs, pads for VRMs/memory), <b>liquid</b> cooling (pump, block, radiator) for high-heat parts.</li></ul>` + pro('Replacing a CPU cooler? Clean old paste with isopropyl alcohol and apply a pea-sized dot of fresh paste. Too much is as bad as too little.') + trap('A 32-bit (x86) OS can use only about 4 GB of RAM and cannot run 64-bit apps.'),
        [['Which CPU architecture is common in phones and tablets?', 'ARM', ['x86', 'x64', 'PCIe'], 'Power-efficient.'],
         ['What does thermal paste do?', 'Fills gaps between the CPU and cooler to improve heat transfer', ['Glues the CPU to the socket', 'Insulates the CPU', 'Replaces the fan'], 'Heat transfer.']],
        'c1-cards')
    ],
    wrap: { recap: ['ATX > microATX > ITX; PCIe (x1–x16), PCI, M.2, SATA/eSATA, power connectors, headers.', 'CPU socket (Intel LGA, AMD AM4/AM5) and chipset/BIOS must match; multisocket for servers.', 'UEFI: boot options, USB permissions, TPM, Secure Boot, boot/BIOS passwords, fans/temps, virtualization.', 'TPM (one PC) vs HSM (dedicated key device).', 'x86/x64 vs ARM; cores, threads, hybrid cores.', 'Cards: sound, video, capture, NIC. Cooling: fans, heat sink, paste/pads, liquid.'], lab: 'c1-build-order' }
  });

  // ===================== 3.6 Power supply =====================
  C('c1-psucalc', 'Size the power supply', 'Wattage rating and efficiency',
    'A workstation draws: CPU <b>125 W</b>, GPU <b>220 W</b>, motherboard/RAM/drives/fans <b>105 W</b>.',
    [['Total estimated load (W)', 450, '450', '125 + 220 + 105.'],
     ['Add 30% headroom: minimum PSU rating (W)', 585, '585', '450 × 1.3 — buy the next common size, 650 W.'],
     ['At 450 W load, how many watts does a 90%-efficient PSU pull from the wall? (round to whole W)', 500, '500', '450 ÷ 0.90.'],
     ['How many of those watts become heat in the PSU?', 50, '50', '500 − 450.']],
    'Size for load + headroom; higher 80 Plus efficiency = less wall power and heat.',
    ['Wall power = load ÷ efficiency.'], 2);
  M('c1-psu', 'Power supply facts', 'Input, output voltages, connectors, redundant, modular',
    'Pick the answer.', ['110–120 VAC', '220–240 VAC', '3.3 V', '5 V', '12 V', '20+4-pin', 'Redundant PSU', 'Modular PSU', '80 Plus rating'],
    [['Standard wall voltage in North America', '110–120 VAC', 'Input.'], ['Standard wall voltage in most of Europe and Asia', '220–240 VAC', 'Input.'], ['Rail used by some memory and chipset circuits', '3.3 V', 'Low voltage.'], ['Rail for USB ports and some drive logic', '5 V', 'USB.'], ['Rail that powers the CPU, GPU and fans', '12 V', 'Main load.'], ['Main motherboard connector that fits both old and new boards', '20+4-pin', '24-pin split.'], ['Server keeps running when one of its two PSUs fails', 'Redundant PSU', 'Hot-swap pair.'], ['Only the cables you need are attached, for airflow', 'Modular PSU', 'Detachable cables.'], ['Gold, Platinum, Titanium efficiency badge', '80 Plus rating', 'Efficiency.']],
    'Input = AC from the wall; output = DC rails inside the PC.');
  M('c1-psu-wrap', 'Power supply desk', 'Combined 3.6',
    'Pick the best action.', ['Check the input voltage switch/auto-ranging', 'Buy a higher wattage PSU', 'Use a redundant PSU', 'Choose a modular PSU', 'Choose an 80 Plus Gold or better unit', 'Use the 20+4-pin connector correctly'],
    [['PC brought from the US to Germany', 'Check the input voltage switch/auto-ranging', 'Most are auto-ranging; old ones have a switch.'], ['PC shuts down when a new GPU is under load', 'Buy a higher wattage PSU', 'Under-sized.'], ['Database server must not go down if a PSU fails', 'Use a redundant PSU', 'Redundancy.'], ['Small case with poor airflow and a cable mess', 'Choose a modular PSU', 'Fewer cables.'], ['Lower electricity bills for 200 PCs', 'Choose an 80 Plus Gold or better unit', 'Efficiency.'], ['Older 20-pin board, new PSU', 'Use the 20+4-pin connector correctly', 'Detach the 4.']],
    'Input voltage, wattage, redundancy, modularity, efficiency.');

  RK.add({ track: TR, id: '3.6', dom: 3, short: 'Power supply', title: 'Given a scenario, install the appropriate power supply',
    goal: 'Choose a PSU by input voltage, output rails, connectors, redundancy, modularity, wattage and efficiency.',
    kw: /\b(power supply|psu|watt|vac|110|120|220|240|3\.3 ?v|5 ?v|12 ?v|20\+4|24.pin|redundant|modular|80 plus|efficien)/,
    parts: [
      P('Input, output and connectors', 'Explain PSU input voltages, output voltages and the 20+4-pin connector.',
        `<ul><li><b>Input</b>: <b>110–120 VAC</b> (North America) vs <b>220–240 VAC</b> (most of Europe, Asia, Africa). Modern PSUs are <b>auto-ranging</b> (100–240 V); older ones have a red voltage switch — wrong setting can destroy it.</li>
<li><b>Output</b> (DC): <b>3.3 V</b> (some chipset/memory circuits), <b>5 V</b> (USB, drive logic), <b>12 V</b> (CPU, GPU, fans, drive motors — the main load).</li>
<li><b>20+4-pin motherboard connector</b> — the 24-pin main connector splits so it also fits older 20-pin boards.</li>
<li>Other connectors: 4/8-pin CPU (EPS), 6/8-pin and 12V-2x6 PCIe for GPUs, SATA power, legacy Molex.</li></ul>
<p>Safety: never open a PSU — capacitors hold a dangerous charge even when unplugged. Replace, do not repair.</p>` + pro('A PSU tester checks the rails in seconds. If a PC is completely dead with known-good wall power, test or swap the PSU before blaming the board.') + trap('VAC is the AC input from the wall; 3.3/5/12 V are the DC outputs to components.'),
        [['Which DC rail powers the CPU and GPU?', '12 V', ['3.3 V', '5 V', '120 VAC'], 'Main load.'],
         ['What is the standard wall voltage in North America?', '110–120 VAC', ['220–240 VAC', '12 VDC', '5 VDC'], 'Input.']],
        'c1-psu'),
      P('Wattage, efficiency, redundancy and modularity', 'Size a PSU by wattage and efficiency, and choose redundant or modular designs.',
        `<ul><li><b>Wattage rating</b> — add the components\' power draw and allow 20–30% headroom. Too small = shutdowns under load; much too large = wasted money and lower efficiency at light loads.</li>
<li><b>Energy efficiency</b> — how much wall power becomes useful DC. 80 Plus Bronze/Silver/Gold/Platinum/Titanium (80%+ to ~94%). Wall draw = load ÷ efficiency; the rest is heat.</li>
<li><b>Redundant power supply</b> — two (or more) hot-swappable PSUs in servers; one can fail or be replaced without downtime. Plug each into a different circuit/UPS.</li>
<li><b>Modular power supply</b> — detachable cables; use only what you need for better airflow and tidier builds (semi-modular has fixed main cables).</li></ul>` + pro('When upgrading a GPU, check both the PSU\'s total wattage and its 12 V connectors. A new card can need a 12V-2x6 or extra 8-pin connectors the old unit does not have.') + trap('A higher-wattage PSU does not push more power into components — they draw only what they need.'),
        [['Which feature lets a server keep running when one PSU fails?', 'Redundant power supplies', ['Modular cables', 'Higher efficiency', '20+4-pin connector'], 'Redundancy.'],
         ['A 300 W load on a 75%-efficient PSU draws how much from the wall?', '400 W', ['300 W', '225 W', '375 W'], '300 ÷ 0.75.']],
        'c1-psucalc')
    ],
    wrap: { recap: ['Input 110–120 VAC vs 220–240 VAC; auto-ranging or switch.', 'Output DC: 3.3 V, 5 V, 12 V (main load).', '20+4-pin main connector; CPU EPS, PCIe GPU, SATA, Molex.', 'Wattage = load + 20–30% headroom.', 'Efficiency (80 Plus): wall draw = load ÷ efficiency.', 'Redundant (servers, hot-swap) and modular (detachable cables) designs. Never open a PSU.'], lab: 'c1-psu-wrap' }
  });

  // ===================== 3.7 Multifunction devices / printers =====================
  T('c1-printer-ps', 'Deploy a shared office MFD', 'Install, configure and share a printer from PowerShell',
    'Ticket: a new multifunction printer is on the network at 10.1.1.60. Install it on print server PS01 with the right driver, set defaults (duplex, mono), share it, and confirm. Elevated PowerShell on PS01.',
    { shell: 'ps', prompt: 'PS C:\\Windows\\system32>' },
    [{ t: 'Create a TCP/IP port for the printer\'s address.', accept: [/^add-printerport -name "?(ip_)?10\.1\.1\.60"? -printerhostaddress "?10\.1\.1\.60"?$/i], show: 'Add-PrinterPort -Name "IP_10.1.1.60" -PrinterHostAddress "10.1.1.60"', hint: 'Add-PrinterPort -Name <name> -PrinterHostAddress <ip>', out: '', why: 'Device connectivity over Ethernet.' },
     { t: 'List the installed drivers for this model.', accept: [/^get-printerdriver( \| where(-object)? .+)?( -name .+)?$/i], show: 'Get-PrinterDriver | Where-Object Name -like "*MFC-9000*"', hint: 'Get-PrinterDriver', out: 'Name                        PrinterEnvironment\n----                        ------------------\nBrand MFC-9000 PCL6         Windows x64\nBrand MFC-9000 PS           Windows x64', ask: { q: 'Which driver language suits general office printing on Windows and is usually faster (PCL6 or PS)?', accept: ['pcl6', 'pcl', 'pcl 6'], why: 'PCL is printer-specific and fast for office documents; PostScript is device-independent and preferred for graphics/design and Macs.' }, why: 'Use the appropriate driver for the OS (PCL vs PostScript).' },
     { t: 'Add the printer named "Floor2-MFD" using the PCL6 driver and the new port.', accept: [/^add-printer -name "?floor2-mfd"? -drivername "?brand mfc-9000 pcl6"? -portname "?ip_10\.1\.1\.60"?$/i], show: 'Add-Printer -Name "Floor2-MFD" -DriverName "Brand MFC-9000 PCL6" -PortName "IP_10.1.1.60"', hint: 'Add-Printer -Name … -DriverName … -PortName …', out: '', why: 'Installed on the print server.' },
     { t: 'Set the defaults: two-sided (long edge) and black-and-white.', accept: [/^set-printconfiguration -printername "?floor2-mfd"? -duplexingmode twosidedlongedge -color \$false$/i, /^set-printconfiguration -printername "?floor2-mfd"? -color \$false -duplexingmode twosidedlongedge$/i], show: 'Set-PrintConfiguration -PrinterName "Floor2-MFD" -DuplexingMode TwoSidedLongEdge -Color $false', hint: 'Set-PrintConfiguration -PrinterName … -DuplexingMode TwoSidedLongEdge -Color $false', out: '', why: 'Configuration settings: duplex, color/quality defaults save paper and toner.' },
     { t: 'Share it as "Floor2-MFD" so clients can connect to \\\\PS01\\Floor2-MFD.', accept: [/^set-printer -name "?floor2-mfd"? -shared \$true -sharename "?floor2-mfd"?$/i], show: 'Set-Printer -Name "Floor2-MFD" -Shared $true -ShareName "Floor2-MFD"', hint: 'Set-Printer -Name … -Shared $true -ShareName …', out: '', why: 'Public/shared device via a print server: one driver install, central control.' },
     { t: 'Confirm the printer, its driver, port and share.', accept: [/^get-printer( -name)? "?floor2-mfd"?( \| (fl|format-list).*| \| select(-object)? .+)?$/i], show: 'Get-Printer -Name "Floor2-MFD" | Format-List Name,DriverName,PortName,Shared,ShareName', hint: 'Get-Printer -Name …', out: 'Name       : Floor2-MFD\nDriverName : Brand MFC-9000 PCL6\nPortName   : IP_10.1.1.60\nShared     : True\nShareName  : Floor2-MFD', why: 'Done. Next on the device\'s web page: update firmware, enable badge release (secured prints), audit logs, and scan to email/SMB.' }],
    'MFD deployment: place → connect → firmware → driver (PCL/PS) → port → defaults → share → security → scan services.',
    ['Add-PrinterPort, Get-PrinterDriver, Add-Printer, Set-PrintConfiguration, Set-Printer, Get-Printer.']);
  M('c1-mfd', 'MFD setup and security', 'Placement, connectivity, security, scan services',
    'Pick the answer.', ['Setup location', 'USB connection', 'Ethernet connection', 'Wireless connection', 'Firmware update', 'User authentication', 'Badging', 'Audit logs', 'Secured prints', 'Scan to email', 'Scan to SMB folder', 'Scan to cloud', 'ADF', 'Flatbed'],
    [['Needs ventilation, a stable surface, power and network, and not in direct sunlight', 'Setup location', 'Placement.'], ['One user, directly attached', 'USB connection', 'Local.'], ['Whole office prints over the wired LAN', 'Ethernet connection', 'Network.'], ['Placed where there is no network jack', 'Wireless connection', 'Wi-Fi.'], ['Vendor fixed a security flaw in the device', 'Firmware update', 'Patch it.'], ['Users must sign in with a PIN before copying', 'User authentication', 'Access control.'], ['Users tap their ID card to release jobs', 'Badging', 'Badge release.'], ['Record of who printed and scanned what', 'Audit logs', 'Accountability.'], ['HR payroll prints held until the user is at the printer', 'Secured prints', 'Pull printing.'], ['Send a scan to the user\'s mailbox', 'Scan to email', 'SMTP.'], ['Save scans to a shared network folder', 'Scan to SMB folder', 'File share.'], ['Save scans to OneDrive/Google Drive', 'Scan to cloud', 'Cloud service.'], ['Scan a 40-page stack automatically', 'ADF', 'Automatic document feeder.'], ['Scan a page from a bound book', 'Flatbed', 'Glass.']],
    'An MFD is a networked computer — patch it, lock it down, and log it.');
  O('c1-mfd-order', 'Unbox and deploy an MFD', 'Combined 3.7',
    'Put the deployment steps in order.',
    [['Choose a location: ventilation, power, network, space for trays', 'Setup location.'], ['Unbox properly: remove all packing tape and shipping locks, let it reach room temperature', 'Properly unbox.'], ['Connect it (Ethernet or Wi-Fi), assign a reserved IP', 'Connectivity.'], ['Update the firmware', 'Security and fixes.'], ['Install the correct driver (PCL or PostScript) on the print server and share it', 'Drivers + sharing.'], ['Set defaults: duplex, orientation, trays, quality', 'Configuration.'], ['Enable authentication, badge release and audit logs; configure scan to email/SMB/cloud', 'Security + scan.'], ['Print and scan a test page from a client', 'Verify.']],
    'Unbox → connect → firmware → driver/share → defaults → security/scan → test.');

  RK.add({ track: TR, id: '3.7', dom: 3, short: 'Multifunction devices/printers', title: 'Given a scenario, deploy and configure multifunction devices/printers and settings',
    goal: 'Unbox, place, connect, install drivers and firmware, share, configure, secure and set up scanning on multifunction printers.',
    kw: /\b(multifunction|mfd|mfp|printer (driver|share|server)|print server|pcl|postscript|duplex|orientation|tray|print quality|badg|secured print|audit log|scan to|adf|flatbed|unbox)/,
    parts: [
      P('Setup, drivers, firmware and sharing', 'Unbox and place an MFD, connect it, choose PCL or PostScript drivers, update firmware and share it.',
        `<ul><li><b>Properly unbox and consider setup location</b> — remove all tape and shipping locks; let it reach room temperature; place on a stable surface with ventilation, near power and network, away from heat and sunlight; lift heavy devices with two people.</li>
<li><b>Use appropriate drivers for the OS</b> — <b>PCL</b> (Printer Command Language): fast, printer-specific, best for office documents on Windows. <b>PostScript</b>: device-independent page description, best for graphics and design work and macOS. Match the 64-bit/ARM driver to the OS.</li>
<li><b>Firmware</b> — update on day one and regularly (security fixes and features).</li>
<li><b>Device connectivity</b> — <b>USB</b> (one PC), <b>Ethernet</b> (best for shared use), <b>wireless</b> (Wi-Fi or Wi-Fi Direct).</li>
<li><b>Public/shared devices</b> — <b>printer share</b> from a PC, or a <b>print server</b> that hosts queues and drivers for everyone.</li></ul>` + pro('Give every network printer a DHCP reservation. "Printer offline" tickets after a power cut are usually a printer that came back on a new IP.') + trap('PostScript is the choice for graphics-heavy/Mac environments; PCL for general Windows office printing.'),
        [['Which driver type is device-independent and preferred for graphic design?', 'PostScript', ['PCL', 'TWAIN', 'USB'], 'Page description language.'],
         ['Which setup centralizes printer drivers and queues for an office?', 'Print server', ['USB connection', 'Wi-Fi Direct', 'Flatbed'], 'Shared device.']],
        'c1-printer-ps'),
      P('Settings, security and scanning', 'Configure duplex, orientation, trays and quality; secure the MFD; set up scan to email, SMB and cloud.',
        `<ul><li><b>Configuration settings</b> — <b>duplex</b> (two-sided), <b>orientation</b> (portrait/landscape), <b>tray settings</b> (paper size and type per tray), <b>quality</b> (draft, normal, high; DPI).</li>
<li><b>Security</b>:
<ul><li><b>User authentication</b> — PIN or account before copy/scan/print.</li>
<li><b>Badging</b> — tap an ID card to sign in or release jobs.</li>
<li><b>Audit logs</b> — who printed, copied, scanned and sent what.</li>
<li><b>Secured prints</b> — jobs held until released at the device (PIN/badge), so confidential pages do not sit in the tray.</li></ul></li>
<li><b>Network scan services</b> — scan to <b>email</b> (needs SMTP settings), to an <b>SMB</b> shared folder (needs a service account with write permission), or to <b>cloud services</b>.</li>
<li><b>Automatic document feeder (ADF)</b> for stacks (often duplex scanning) vs <b>flatbed scanner</b> for books, photos, fragile pages.</li></ul>` + pro('MFDs store scanned and printed images on an internal drive. Enable encryption/overwrite, and wipe or remove the drive before the lease returns the device.') + trap('Secured print (hold and release) protects confidential output; audit logs only record it.'),
        [['Which feature holds a print job until the user badges in at the device?', 'Secured prints / badge release', ['Duplex', 'ADF', 'Audit logs'], 'Pull printing.'],
         ['What does scan to SMB need?', 'A shared folder path and an account with write permission', ['A fax line', 'A PostScript driver', 'A USB cable'], 'File share target.']],
        'c1-mfd')
    ],
    wrap: { recap: ['Unbox properly (tape, locks, acclimate); location with ventilation, power and network.', 'Drivers: PCL (fast, Windows office) vs PostScript (graphics, macOS); update firmware.', 'Connectivity: USB, Ethernet, wireless. Share via printer share or print server.', 'Settings: duplex, orientation, trays, quality.', 'Security: user authentication, badging, audit logs, secured prints; wipe internal storage.', 'Scan to email/SMB/cloud; ADF for stacks, flatbed for books.'], lab: 'c1-mfd-order' }
  });

  // ===================== 3.8 Printer maintenance =====================
  O('c1-laser-order', 'The laser imaging process', 'Seven steps in order',
    'Put the laser printer imaging process in order.',
    [['Processing — the page is rendered into an image in memory', 'Raster image.'], ['Charging — the primary charge roller puts a uniform negative charge on the drum', 'Conditioning.'], ['Exposing — the laser writes the image, discharging those spots on the drum', 'Writing.'], ['Developing — toner sticks to the discharged areas of the drum', 'Toner on drum.'], ['Transferring — the transfer roller/belt pulls toner from the drum onto the paper', 'Toner on paper.'], ['Fusing — heat and pressure melt the toner into the paper', 'Fuser.'], ['Cleaning — a blade removes leftover toner and the drum is discharged', 'Ready for next page.']],
    'Processing, charging, exposing, developing, transferring, fusing, cleaning.');
  M('c1-maint', 'Which maintenance task?', 'Laser, inkjet, thermal, impact',
    'Pick the maintenance task.', ['Replace toner', 'Apply maintenance kit', 'Calibrate', 'Clean printheads', 'Replace ink cartridge', 'Clear jam / clean rollers and feeder', 'Replace special thermal paper', 'Clean heating element', 'Remove debris', 'Replace ribbon', 'Replace printhead (impact)', 'Use multipart paper'],
    [['Laser prints are getting faded evenly across the page and the toner alert is on', 'Replace toner', 'Consumable.'], ['Laser page count reached 200,000; fuser and rollers are due', 'Apply maintenance kit', 'Fuser + rollers; reset the counter.'], ['Colors are misaligned on a color laser or inkjet', 'Calibrate', 'Alignment.'], ['Inkjet has gaps and missing lines in the print', 'Clean printheads', 'Clogged nozzles.'], ['Inkjet reports a cartridge empty', 'Replace ink cartridge', 'Consumable.'], ['Inkjet takes several sheets at once or none', 'Clear jam / clean rollers and feeder', 'Roller/feeder.'], ['Receipt printer prints nothing visible on normal paper', 'Replace special thermal paper', 'Heat-sensitive paper required.'], ['Receipts have a faint vertical blank stripe', 'Clean heating element', 'Isopropyl alcohol on the element.'], ['Thermal label printer jams on paper dust', 'Remove debris', 'Clean the path.'], ['Dot-matrix printout keeps getting lighter', 'Replace ribbon', 'Ink ribbon.'], ['Dot-matrix printer has a missing horizontal line of dots in every character', 'Replace printhead (impact)', 'Failed pin.'], ['Warehouse needs carbon copies of each pick ticket', 'Use multipart paper', 'Impact pressure prints all layers.']],
    'Every printer type has its consumables and its cleaning job.');
  M('c1-maint-wrap', 'Printer maintenance desk', 'Combined 3.8',
    'Pick the printer type and task.', ['Laser — maintenance kit', 'Laser — calibrate', 'Inkjet — clean printheads', 'Inkjet — replace cartridge', 'Thermal — clean heating element', 'Thermal — replace paper', 'Impact — replace ribbon', 'Impact — replace paper (multipart)'],
    [['"Perform user maintenance" message on an office laser', 'Laser — maintenance kit', 'Fuser, rollers.'], ['Color laser prints have colored halos around text', 'Laser — calibrate', 'Registration.'], ['Photo printer shows banding after weeks unused', 'Inkjet — clean printheads', 'Dried nozzles.'], ['Inkjet magenta is missing completely', 'Inkjet — replace cartridge', 'Empty.'], ['Shipping labels have a blank line through every label', 'Thermal — clean heating element', 'Dirty/failed element.'], ['Point-of-sale printer out of rolls', 'Thermal — replace paper', 'Thermal rolls.'], ['Auto parts invoice printer output is too faint', 'Impact — replace ribbon', 'Worn ribbon.'], ['Invoice copies need three layers', 'Impact — replace paper (multipart)', 'Multipart forms.']],
    'Identify the printer type first; the task follows.');

  RK.add({ track: TR, id: '3.8', dom: 3, short: 'Printer maintenance', title: 'Given a scenario, perform appropriate printer maintenance',
    goal: 'Maintain laser, inkjet, thermal and impact printers: consumables, cleaning, calibration and the laser imaging process.',
    kw: /\b(laser|toner|drum|fuser|maintenance kit|imaging (process|drum)|charging|exposing|developing|transferring|fusing|inkjet|ink cartridge|printhead|thermal|heating element|impact|dot.matrix|ribbon|multipart|tractor|calibrat)/,
    parts: [
      P('Laser printers', 'Maintain laser printers and explain the imaging process and its parts.',
        `<p><b>Parts</b>: imaging drum (often in the toner cartridge), primary charge roller, laser assembly, toner, transfer roller/belt, fuser (heated roller + pressure roller), pickup rollers and separation pads, duplexing assembly.</p>
<p><b>Imaging process</b> (7 steps): <b>processing</b> → <b>charging</b> → <b>exposing</b> → <b>developing</b> → <b>transferring</b> → <b>fusing</b> → <b>cleaning</b>.</p>
<p><b>Maintenance</b>:</p>
<ul><li><b>Replace toner</b> — shake gently to spread toner; remove the seal.</li>
<li><b>Apply maintenance kit</b> — at the page count the vendor specifies: new fuser, pickup/feed rollers, transfer roller; then reset the page counter.</li>
<li><b>Calibrate</b> — color registration and density from the printer menu.</li>
<li><b>Clean</b> — power off, let the fuser cool, use a toner-safe vacuum and lint-free cloths; never a normal vacuum (toner is a fire and health hazard).</li></ul>` + pro('The fuser runs at about 200 °C. Power off and wait before reaching inside — burns are the most common laser printer injury for techs.') + trap('Toner that smears off the page is a fusing problem (step 6), not a toner problem.'),
        [['Which laser step melts toner into the paper?', 'Fusing', ['Developing', 'Charging', 'Transferring'], 'Heat and pressure.'],
         ['What does a laser maintenance kit usually contain?', 'Fuser and feed/pickup/transfer rollers', ['Ink cartridges', 'Thermal paper', 'A new ribbon'], 'Wear parts.']],
        'c1-laser-order'),
      P('Inkjet, thermal and impact printers', 'Maintain inkjet, thermal and impact printers.',
        `<ul><li><b>Inkjet</b> — parts: <b>ink cartridge</b>, <b>printhead</b> (nozzles, sometimes built into the cartridge), <b>roller</b>, <b>feeder</b>, carriage and belt, duplexer. Maintenance: <b>clean printheads</b> (utility cycle), <b>replace cartridges</b>, <b>calibrate</b> (alignment), <b>clear jams</b> and clean rollers.</li>
<li><b>Thermal</b> — parts: <b>feed assembly</b> and <b>heating element</b>; needs <b>special thermal paper</b> that darkens with heat (receipts, labels). Maintenance: <b>replace paper</b>, <b>clean the heating element</b> (isopropyl alcohol), <b>remove debris</b>.</li>
<li><b>Impact</b> (dot-matrix) — pins strike an ink ribbon; uses <b>multipart paper</b> (carbon copies) and often tractor-feed paper. Maintenance: <b>replace ribbon</b>, <b>replace printhead</b>, <b>replace paper</b>.</li></ul>` + pro('Run the inkjet head-cleaning cycle once or twice, not ten times — each cycle burns ink. If it is still streaky, the cartridge or head needs replacing.') + trap('Thermal printers have no ink or toner: blank output means wrong (non-thermal) paper or paper loaded upside down.'),
        [['A receipt printer prints blank pages after new paper was loaded. Likely cause?', 'The paper is not thermal or is loaded upside down', ['Out of toner', 'Ribbon worn', 'Printhead clogged with ink'], 'Thermal paper.'],
         ['Which printer type is needed for multipart forms?', 'Impact', ['Inkjet', 'Thermal', 'Laser'], 'Pins strike through layers.']],
        'c1-maint')
    ],
    wrap: { recap: ['Laser imaging: processing, charging, exposing, developing, transferring, fusing, cleaning.', 'Laser: replace toner, apply maintenance kit (fuser/rollers), calibrate, clean with a toner vacuum; fuser is hot.', 'Inkjet: cartridges, printheads, rollers, feeder — clean heads, replace cartridges, calibrate, clear jams.', 'Thermal: feed assembly, heating element, special paper — replace paper, clean element, remove debris.', 'Impact: ribbon, printhead, multipart paper — replace them as they wear.', 'Know each type\'s consumables and cleaning job.'], lab: 'c1-maint-wrap' }
  });

  // ===================== Domain 3 combined lab =====================
  T('c1-d3-wrap', 'Domain 3 shift: workstation refresh', 'Hardware in one ticket',
    'Ticket: refresh a video editor\'s workstation and set up their printer. Elevated PowerShell. Each task names its objective.',
    { shell: 'ps', prompt: 'PS C:\\Windows\\system32>' },
    [{ t: '<b>3.5</b> — Confirm the TPM is present and ready.', accept: [/^get-tpm$/i], show: 'Get-Tpm', hint: '3.5 — Get-Tpm', out: 'TpmPresent : True\nTpmReady   : True', why: 'BitLocker-ready.' },
     { t: '<b>3.3</b> — List the memory modules.', accept: [/^get-ciminstance (-classname )?win32_physicalmemory( \| select(-object)? .+| \| (ft|format-table) .+)?$/i, /^gcim win32_physicalmemory.*$/i], show: 'Get-CimInstance Win32_PhysicalMemory | Select-Object DeviceLocator,Capacity,Speed', hint: '3.3 — Win32_PhysicalMemory', out: 'DeviceLocator Capacity     Speed\n------------- --------     -----\nDIMM_A1       34359738368  5600\nDIMM_A2       34359738368  5600', ask: { q: 'Both sticks are in channel A. Is the PC running dual-channel? (yes/no)', accept: ['no'], why: 'Move one stick to B1 (per the manual) for dual-channel bandwidth.' }, why: 'Channel configuration.' },
     { t: '<b>3.4</b> — List the drives with bus type.', accept: [/^get-physicaldisk( \| select(-object)? .+| \| (ft|format-table) .+)?$/i], show: 'Get-PhysicalDisk | Select-Object FriendlyName,MediaType,BusType', hint: '3.4 — Get-PhysicalDisk', out: 'FriendlyName    MediaType BusType\n------------    --------- -------\nNVMe 2TB        SSD       NVMe\nRAID-Media      Unspecified RAID', ask: { q: 'The RAID-Media volume is four 8 TB drives in RAID 5. How many TB usable?', accept: ['24', '24tb'], why: '(4−1) × 8 = 24 TB; survives one drive failure — and still needs a backup.' }, why: 'Storage and RAID.' },
     { t: '<b>3.1</b> — Check the display\'s refresh rate.', accept: [/^get-ciminstance (-classname )?win32_videocontroller( \| select(-object)? .+| \| (fl|format-list).*)?$/i, /^gcim win32_videocontroller.*$/i], show: 'Get-CimInstance Win32_VideoController | Select-Object CurrentHorizontalResolution,CurrentRefreshRate', hint: '3.1 — Win32_VideoController', out: 'CurrentHorizontalResolution CurrentRefreshRate\n--------------------------- ------------------\n                       3840                 60', why: '4K at 60 Hz over DisplayPort — correct for this IPS editing monitor.' },
     { t: '<b>3.7</b> — Set the editor\'s printer "Studio-Color" to PostScript-friendly defaults: color on, one-sided.', accept: [/^set-printconfiguration -printername "?studio-color"? -color \$true -duplexingmode onesided$/i, /^set-printconfiguration -printername "?studio-color"? -duplexingmode onesided -color \$true$/i], show: 'Set-PrintConfiguration -PrinterName "Studio-Color" -Color $true -DuplexingMode OneSided', hint: '3.7 — Set-PrintConfiguration', out: '', why: 'Proof prints in color, single-sided. Then calibrate the color printer (3.8).' }],
    'Domain 3 in one ticket: firmware/TPM (3.5), RAM channels (3.3), storage/RAID (3.4), display attributes (3.1), printer configuration (3.7).',
    ['Each task names its objective.']);

  // ---------- extras + cards ----------
  RK.extra(TR, '3.1', [
    ['Which panel type is cheapest with the fastest response but poor viewing angles?', 'TN', ['IPS', 'VA', 'OLED'], 'Twisted nematic.'],
    ['Which LCD type is known for high contrast and deep blacks?', 'VA', ['TN', 'IPS', 'CCFL'], 'Vertical alignment.'],
    ['What improves contrast in mini-LED displays?', 'Many local-dimming backlight zones', ['Self-emitting pixels', 'An inverter', 'A digitizer'], 'Local dimming.'],
    ['A tablet displays fine but does not respond to touch. Which part has failed?', 'Digitizer', ['Inverter', 'Backlight', 'GPU'], 'Touch layer.'],
    ['Which unit measures pixel density?', 'PPI (pixels per inch)', ['Hz', 'Nits', 'MT/s'], 'Density.'],
    ['Why run an LCD at native resolution?', 'Non-native resolutions look blurry because pixels must be scaled', ['It increases refresh rate', 'It enables HDR', 'It saves toner'], 'Sharpness.'],
    ['Which display issue is a specific risk of OLED panels?', 'Burn-in from static images', ['Inverter failure', 'CCFL dimming', 'Dead backlight'], 'Burn-in.']
  ]);
  RK.extra(TR, '3.2', [
    ['Which connector is used with RG-6 coax?', 'F type', ['RJ45', 'LC', 'DB9'], 'Coax.'],
    ['Which fiber type uses a laser and reaches the farthest?', 'Single-mode', ['Multimode', 'Coax', 'STP'], 'Long haul.'],
    ['Which cable is rated for underground runs without conduit?', 'Direct burial', ['Plenum', 'Patch', 'Coax RG-59 indoor'], 'Rugged jacket.'],
    ['Which video connector is analog?', 'VGA', ['HDMI', 'DisplayPort', 'DVI-D'], 'Analog 15-pin.'],
    ['What is the maximum speed of USB 2.0?', '480 Mbps', ['5 Gbps', '10 Gbps', '40 Gbps'], 'High Speed.'],
    ['Which connector powers legacy IDE drives and some fans?', 'Molex', ['SATA', 'RJ11', 'LC'], '4-pin.'],
    ['Thunderbolt 3/4 uses which physical connector?', 'USB-C', ['Mini DisplayPort only', 'DB9', 'RJ45'], 'USB-C.']
  ]);
  RK.extra(TR, '3.3', [
    ['What happens if DDR5 modules of different speeds are mixed?', 'They run at the slowest module\'s speed', ['They run at the fastest', 'The PC will not boot ever', 'ECC turns on'], 'Lowest common speed.'],
    ['Which systems most commonly use ECC memory?', 'Servers and workstations', ['Phones', 'Gaming laptops only', 'Printers'], 'Reliability.'],
    ['What does MT/s measure for RAM?', 'Data transfers per second', ['Capacity', 'Voltage', 'Latency only'], 'Speed.'],
    ['Where do you find which slots to use for dual-channel?', 'The motherboard manual (often color-coded slots)', ['The PSU label', 'Device Manager', 'The BIOS password page'], 'Slot layout.'],
    ['Can ECC and non-ECC modules be mixed?', 'No — use one type', ['Yes, always', 'Only in laptops', 'Only with DDR3'], 'Do not mix.'],
    ['Which RAM type has two independent subchannels per module?', 'DDR5', ['DDR3', 'DDR4', 'SDR'], 'DDR5.']
  ]);
  RK.extra(TR, '3.4', [
    ['What is the minimum number of drives for RAID 5?', '3', ['2', '4', '5'], 'Two data + parity.'],
    ['Which RAID level gives the most usable space with no protection?', 'RAID 0', ['RAID 1', 'RAID 5', 'RAID 10'], 'Striping.'],
    ['What is the minimum number of drives for RAID 10?', '4', ['2', '3', '6'], 'Two mirrored pairs.'],
    ['Which interface is used by enterprise hot-swap drives with dual ports?', 'SAS', ['SATA', 'USB', 'mSATA'], 'Serial attached SCSI.'],
    ['Which spindle speed is typical for desktop HDDs?', '7,200 RPM', ['15,000 RPM', '1,200 RPM', '3,600 RPM'], 'Desktop.'],
    ['How much does a single-layer Blu-ray hold?', '25 GB', ['4.7 GB', '700 MB', '100 GB'], 'BD.'],
    ['Why is RAID not a backup?', 'It does not protect against deletion, ransomware, theft or fire', ['It is too slow', 'It only works on SSDs', 'It cannot use SAS'], 'Separate copy needed.']
  ]);
  RK.extra(TR, '3.5', [
    ['Which socket type has the pins in the socket rather than on the CPU?', 'LGA', ['PGA', 'ZIF only', 'DIMM'], 'Land grid array.'],
    ['Which firmware feature allows only signed boot loaders?', 'Secure Boot', ['Fast Boot', 'PXE', 'XMP'], 'Signed.'],
    ['Which setting stops users booting from a USB stick?', 'USB boot disabled / boot order + BIOS password', ['Secure Boot off', 'Higher fan speed', 'Larger page file'], 'Boot options + password.'],
    ['What expansion card records video from an external HDMI source?', 'Capture card', ['Sound card', 'NIC', 'RAID card'], 'Video in.'],
    ['Which header connects the case power button?', 'Front-panel header', ['USB header', 'CPU_FAN', 'Audio header'], 'Front panel.'],
    ['A new CPU is not recognized on a compatible-socket board. First fix?', 'Update the BIOS/UEFI', ['Replace the PSU', 'Add RAM', 'Reinstall Windows'], 'CPU support.'],
    ['What do thermal pads usually cool?', 'VRMs, memory chips and SSD controllers', ['Only the CPU die', 'The PSU fan', 'Fiber connectors'], 'Pads vs paste.']
  ]);
  RK.extra(TR, '3.6', [
    ['What does an 80 Plus Gold rating describe?', 'PSU energy efficiency', ['Maximum wattage', 'Number of cables', 'Output voltage'], 'Efficiency.'],
    ['Which rail powers USB ports?', '5 V', ['3.3 V', '12 V', '120 VAC'], 'USB.'],
    ['What should you do before plugging an old PSU with a voltage switch into 230 V?', 'Set the switch to 230 V', ['Leave it at 115 V', 'Remove the fan', 'Open the case'], 'Avoid damage.'],
    ['Why should you never open a power supply?', 'Its capacitors can hold a dangerous charge', ['It voids the RAM warranty', 'It resets the BIOS', 'It loses efficiency'], 'Safety.'],
    ['How much headroom is typically added when sizing a PSU?', 'About 20–30%', ['0%', '200%', '5%'], 'Headroom.'],
    ['What is a semi-modular PSU?', 'Main cables fixed, others detachable', ['All cables fixed', 'Two PSUs in one', 'A PSU with no fan'], 'Partial modular.'],
    ['Where should the two cords of a redundant PSU server be plugged?', 'Into different circuits or UPS units', ['Into the same power strip', 'Into one UPS outlet only', 'Daisy-chained'], 'Real redundancy.']
  ]);
  RK.extra(TR, '3.7', [
    ['Which connection is best for a printer shared by a whole office?', 'Ethernet', ['USB', 'Bluetooth', 'Serial'], 'Network.'],
    ['Which setting prints on both sides of the paper?', 'Duplex', ['Orientation', 'Quality', 'Collate'], 'Two-sided.'],
    ['Why update an MFD\'s firmware?', 'To fix bugs and security vulnerabilities', ['To refill toner', 'To change paper size', 'To clean the drum'], 'Patch.'],
    ['Which scanner part handles a 50-page stack automatically?', 'ADF', ['Flatbed', 'Fuser', 'Duplexer only'], 'Automatic document feeder.'],
    ['What must you remove after unboxing a laser printer?', 'Packing tape and shipping locks/seals', ['The fuser', 'The drum', 'The firmware'], 'Proper unboxing.'],
    ['What security feature records who printed confidential documents?', 'Audit logs', ['Duplexing', 'ADF', 'Tray settings'], 'Accountability.'],
    ['What does scan to email require on the MFD?', 'SMTP server settings', ['A PostScript driver', 'A ribbon', 'A flatbed'], 'Mail relay.'],
    ['Users print landscape spreadsheets that come out cut off. Which setting?', 'Orientation', ['Duplex', 'Badging', 'ADF'], 'Portrait vs landscape.'],
    ['Letterhead must always come from tray 2. Which setting?', 'Tray settings', ['Quality', 'Audit logs', 'Firmware'], 'Paper source per tray.'],
    ['Why give a network MFD a DHCP reservation or static IP?', 'So clients and the print server always find it at the same address', ['To enable duplex', 'To speed up the fuser', 'To allow PostScript'], 'Stable address.'],
    ['What should be done with an MFD\'s internal drive before the lease is returned?', 'Wipe or remove it, because it stores copies of documents', ['Nothing', 'Update the firmware only', 'Replace the toner'], 'Data on the device.'],
    ['Which printer sharing method needs one PC to stay on for others to print?', 'Printer share from a workstation', ['Print server', 'Direct IP printing', 'Cloud print service'], 'Host PC dependency.']
  ]);
  RK.extra(TR, '3.8', [
    ['In which laser step does the laser discharge areas of the drum?', 'Exposing', ['Charging', 'Developing', 'Fusing'], 'Writing.'],
    ['What tool should clean spilled toner?', 'A toner-rated (ESD-safe) vacuum', ['A household vacuum', 'Compressed air indoors only', 'A wet towel on hot fuser'], 'Toner vacuum.'],
    ['Inkjet output has missing lines. First fix?', 'Run the printhead cleaning utility', ['Replace the fuser', 'Replace the ribbon', 'Change thermal paper'], 'Clogged nozzles.'],
    ['What cleans a thermal printer heating element?', 'Isopropyl alcohol on a lint-free swab', ['Water', 'Toner vacuum', 'Sandpaper'], 'Gentle cleaning.'],
    ['Which printer type uses a ribbon?', 'Impact', ['Laser', 'Inkjet', 'Thermal'], 'Dot-matrix.'],
    ['What should be reset after installing a laser maintenance kit?', 'The page/maintenance counter', ['The BIOS', 'The IP address', 'The duplex setting'], 'Counter.'],
    ['Which laser step uses a blade to remove leftover toner?', 'Cleaning', ['Transferring', 'Processing', 'Charging'], 'Last step.']
  ]);
  RK.cards(TR, '3.1', [['IPS / TN / VA', 'Color & angles / cheap & fast / contrast.'], ['OLED', 'Self-lit pixels; burn-in.'], ['Refresh rate', 'Redraws per second (Hz).'], ['Color gamut', 'Range of colors (sRGB, DCI-P3).']]);
  RK.cards(TR, '3.2', [['Cat 6a', '10 Gbps to 100 m.'], ['Plenum', 'Fire-rated for air spaces.'], ['ST / SC / LC', 'Twist / square / little fiber connectors.'], ['HDMI vs DVI', 'Audio+video vs video only.']]);
  RK.cards(TR, '3.3', [['SODIMM vs DIMM', 'Laptop vs desktop.'], ['ECC', 'Corrects single-bit errors.'], ['Dual-channel', 'Matched modules in two channels.'], ['DDR keying', 'Different notch per generation.']]);
  RK.cards(TR, '3.4', [['RAID 5', '(n−1) × size; min 3; 1 failure.'], ['RAID 6', '(n−2) × size; min 4; 2 failures.'], ['RAID 10', 'Half; min 4.'], ['NVMe', 'SSD over PCIe; M.2 form factor common.']]);
  RK.cards(TR, '3.5', [['Secure Boot', 'Only signed boot loaders.'], ['TPM vs HSM', 'One PC chip vs dedicated key appliance.'], ['VT-x/AMD-V', 'Firmware virtualization support.'], ['ATX/mATX/ITX', 'Large/medium/small boards.']]);
  RK.cards(TR, '3.6', [['3.3/5/12 V', 'DC output rails; 12 V = CPU/GPU.'], ['20+4-pin', 'Main board connector.'], ['Redundant PSU', 'Hot-swap pair in servers.'], ['Efficiency', 'Wall draw = load ÷ efficiency.']]);
  RK.cards(TR, '3.7', [['PCL vs PostScript', 'Fast office vs device-independent graphics.'], ['Secured print', 'Held until released at device.'], ['Scan to SMB', 'Shared folder + write account.'], ['ADF vs flatbed', 'Stacks vs books/photos.']]);
  RK.cards(TR, '3.8', [['Laser steps', 'Processing, charging, exposing, developing, transferring, fusing, cleaning.'], ['Maintenance kit', 'Fuser + rollers; reset counter.'], ['Thermal', 'Special paper; clean heating element.'], ['Impact', 'Ribbon, printhead, multipart paper.']]);
})();
