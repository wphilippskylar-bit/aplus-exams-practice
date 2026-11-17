/* A+ Core 1 (220-1201) — Domain 3.0 Hardware — objectives 3.1 to 3.4 (numbering confirmed against the official objective list) */
(function () {
  var RK = window.RK, P = RK.P, M = RK.M, O = RK.O, T = RK.T, C = RK.C, TR = 'core1';
  function pro(t) { return '<div class="callout pro"><b class="k">On the job</b>' + t + '</div>'; }
  function trap(t) { return '<div class="callout trap"><b class="k">Exam trap</b>' + t + '</div>'; }

  // ===================== 3.1 Displays =====================
  T('c1-display', 'The 144 Hz monitor that runs at 60 Hz', 'Resolution and refresh from PowerShell',
    'Ticket: a designer\'s new 27-inch 2560×1440, 144 Hz IPS monitor "looks choppy". PowerShell on the PC.',
    { shell: 'ps', prompt: 'PS C:\\Users\\ana>' },
    [{ t: 'Show the graphics adapter\'s current resolution and refresh rate.', accept: [/^get-ciminstance (-classname )?win32_videocontroller( \| select(-object)? .+| \| (fl|format-list).*)?$/i, /^gcim win32_videocontroller.*$/i], show: 'Get-CimInstance Win32_VideoController | Select-Object Name,CurrentHorizontalResolution,CurrentVerticalResolution,CurrentRefreshRate', hint: 'Win32_VideoController has CurrentRefreshRate.', out: 'Name                         : NVIDIA RTX A2000\nCurrentHorizontalResolution  : 2560\nCurrentVerticalResolution    : 1440\nCurrentRefreshRate           : 60', ask: { q: 'What refresh rate (Hz) is it running at?', accept: ['60'], why: 'Native resolution is right, but 60 Hz instead of 144 Hz. Refresh rate = how many times per second the image is redrawn.' }, why: 'Read the attributes.' },
     { t: 'Find out how the monitor is connected (look at the monitor connection parameters).', accept: [/^get-ciminstance -namespace root\\wmi (-classname )?wmimonitorconnectionparams$/i], show: 'Get-CimInstance -Namespace root\\wmi WmiMonitorConnectionParams', hint: 'Get-CimInstance -Namespace root\\wmi WmiMonitorConnectionParams', out: 'InstanceName    : DISPLAY\\DEL41F2\\5&2a1b&0&UID4352_0\nVideoOutputTechnology : 5', ask: { q: 'VideoOutputTechnology 5 = HDMI, 10 = DisplayPort. Which cable is in use?', accept: ['hdmi'], why: 'An old HDMI 1.4 cable/port tops out at 1440p 60 Hz-ish. DisplayPort (or HDMI 2.0+) carries 1440p at 144 Hz.' }, why: 'Cable and connector limit the attributes (3.2 links here).' },
     { t: 'After swapping to a DisplayPort cable, check the refresh rate again.', accept: [/^get-ciminstance (-classname )?win32_videocontroller( \| select(-object)? .+| \| (fl|format-list).*)?$/i, /^gcim win32_videocontroller.*$/i], show: 'Get-CimInstance Win32_VideoController | Select-Object CurrentRefreshRate', hint: 'Same as step 1.', out: 'CurrentRefreshRate\n------------------\n               144', why: 'Fixed. (If it still shows 60, set it in Settings → Display → Advanced display → Refresh rate.)' }],
    'Display attributes: resolution (pixels), refresh rate (Hz), pixel density (PPI), color gamut. The cable and port must support the combination.',
    ['Win32_VideoController; WmiMonitorConnectionParams.']);
  M('c1-paneltype', 'Which display?', 'IPS, TN, VA, OLED, mini-LED, touch, inverter',
    'Pick the display type or component.', ['IPS', 'TN', 'VA', 'OLED', 'Mini-LED', 'Touch screen/digitizer', 'Inverter'],
    [['Best color accuracy and viewing angles for a photo editor', 'IPS', 'In-plane switching.'], ['Cheapest, fastest response for competitive gaming, poor angles', 'TN', 'Twisted nematic.'], ['Deep blacks/high contrast, between TN and IPS', 'VA', 'Vertical alignment.'], ['Each pixel makes its own light: perfect black, can burn in', 'OLED', 'No backlight.'], ['LCD with thousands of tiny LED backlight zones for HDR', 'Mini-LED', 'Local dimming.'], ['Layer that turns finger or stylus touches into input', 'Touch screen/digitizer', 'Digitizer.'], ['Powers the CCFL backlight on old LCDs', 'Inverter', 'Legacy backlight power.']],
    'LCD panel types (IPS/TN/VA) still need a backlight; OLED does not.');
  M('c1-disp-wrap', 'Display advisor', 'Combined 3.1',
    'Pick the best answer.', ['IPS', 'OLED', 'TN', 'Higher refresh rate', 'Higher pixel density', 'Wider color gamut', 'Digitizer', 'Inverter'],
    [['Graphic designer needs accurate colors from any angle on a budget', 'IPS', 'Color + angles.'], ['Home theater wants perfect blacks', 'OLED', 'Self-lit pixels.'], ['Esports player on a tight budget', 'TN', 'Fast and cheap.'], ['Fast-moving games look smeared and choppy', 'Higher refresh rate', 'Hz.'], ['Text looks pixelated on a small, high-resolution laptop screen is wanted to look sharper', 'Higher pixel density', 'PPI.'], ['Video editor needs to see the full DCI-P3 color range', 'Wider color gamut', 'Gamut.'], ['Tablet ignores touches in one corner', 'Digitizer', 'Touch layer.'], ['Old LCD shows a faint image only under a flashlight', 'Inverter', 'Backlight power failed (or the backlight).']],
    'Match the panel type and attribute to the workload.');

  RK.add({ track: TR, id: '3.1', dom: 3, short: 'Display components', title: 'Compare and contrast display components and attributes',
    goal: 'Compare LCD (IPS, TN, VA), OLED and mini-LED, touch screens/digitizers and inverters, and display attributes.',
    kw: /\b(lcd|ips|tn\b|va panel|oled|mini.?led|digitizer|touch ?screen|inverter|backlight|pixel density|ppi|refresh rate|hz\b|resolution|color gamut|display)/,
    parts: [
      P('Display types and components', 'Compare LCD panel types (IPS, TN, VA), OLED and mini-LED, and identify digitizers and inverters.',
        `<p><b>LCD</b> panels use liquid crystals in front of a <b>backlight</b>:</p>
<table><tr><th>LCD type</th><th>Strength</th><th>Weakness</th></tr>
<tr><td><b>IPS</b> (in-plane switching)</td><td>Best color and viewing angles</td><td>Higher cost; "IPS glow"</td></tr>
<tr><td><b>TN</b> (twisted nematic)</td><td>Cheapest, fastest response</td><td>Poor color and viewing angles</td></tr>
<tr><td><b>VA</b> (vertical alignment)</td><td>High contrast, deep blacks</td><td>Slower response than TN</td></tr></table>
<ul><li><b>OLED</b> — each pixel emits its own light: true black, thin, great contrast; can suffer burn-in; no backlight.</li>
<li><b>Mini-LED</b> — an LCD with thousands of small LED backlight zones for better contrast and HDR.</li>
<li><b>Touch screen/digitizer</b> — the layer that converts touch or pen contact into input; can fail separately from the display.</li>
<li><b>Inverter</b> — on older CCFL-backlit LCDs, converts DC to the AC the backlight tube needs. A failed inverter or backlight = very dim image visible with a flashlight.</li></ul>` + pro('When a laptop screen is black, shine a flashlight at it. A faint image means the panel works and the backlight (or inverter) has failed.') + trap('OLED has no backlight and no inverter — those are LCD parts.'),
        [['Which LCD type has the best color and viewing angles?', 'IPS', ['TN', 'VA', 'CCFL'], 'In-plane switching.'],
         ['Which display technology can suffer burn-in and needs no backlight?', 'OLED', ['IPS', 'TN', 'Mini-LED'], 'Self-emitting.']],
        'c1-paneltype'),
      P('Display attributes', 'Explain pixel density, refresh rate, resolution and color gamut.',
        `<ul><li><b>Screen resolution</b> — pixel count, e.g. 1920×1080 (FHD), 2560×1440 (QHD), 3840×2160 (4K UHD). Run at the panel\'s <b>native</b> resolution for a sharp image.</li>
<li><b>Pixel density</b> — pixels per inch (PPI). The same resolution on a smaller screen = higher density = sharper. Windows display scaling keeps text readable.</li>
<li><b>Refresh rates</b> — times per second the image is redrawn, in hertz (60, 120, 144, 240 Hz). Higher = smoother motion. Needs a GPU, port and cable that support it.</li>
<li><b>Color gamut</b> — the range of colors a display can show, given as % of a standard (sRGB, Adobe RGB, DCI-P3). Wider gamut matters for photo and video work.</li></ul>
<p>Check settings: Settings → System → Display (resolution, scaling) → Advanced display (refresh rate).</p>` + pro('A "blurry" new monitor is usually set to a non-native resolution, or Windows scaling is fighting the app. Set native first, then adjust scaling.') + trap('Refresh rate (Hz) is about the display; frame rate (FPS) is what the GPU produces. A 60 Hz monitor shows at most 60 frames per second.'),
        [['What does refresh rate measure?', 'How many times per second the screen is redrawn', ['Pixels per inch', 'Color range', 'Brightness'], 'Hz.'],
         ['Which attribute matters most for accurate photo editing colors?', 'Color gamut', ['Refresh rate', 'Response time only', 'Inverter type'], 'Range of colors.']],
        'c1-display')
    ],
    wrap: { recap: ['LCD: IPS (color, angles), TN (cheap, fast), VA (contrast); all need a backlight.', 'OLED: self-lit pixels, true black, burn-in risk. Mini-LED: LCD with many local dimming zones.', 'Digitizer = touch input layer; inverter = power for old CCFL backlights.', 'Resolution (native!), pixel density (PPI), refresh rate (Hz), color gamut (sRGB/DCI-P3).', 'Cable/port must support the resolution + refresh combination.', 'Dim image visible with a flashlight → backlight/inverter.'], lab: 'c1-disp-wrap' }
  });

  // ===================== 3.2 Cables & connectors =====================
  M('c1-netcable', 'Which network cable?', 'Cat ratings, coax, STP, direct burial, plenum, fiber',
    'Pick the cable.', ['Cat 5e', 'Cat 6', 'Cat 6a', 'Coaxial', 'Shielded twisted pair (STP)', 'Direct burial', 'Plenum-rated', 'Single-mode fiber', 'Multimode fiber'],
    [['1 Gbps to 100 m on a budget', 'Cat 5e', 'Gigabit.'], ['10 Gbps but only to about 55 m', 'Cat 6', 'Shorter at 10G.'], ['10 Gbps to the full 100 m', 'Cat 6a', 'Augmented.'], ['Cable modem to the wall, with an F-type connector', 'Coaxial', 'Coax.'], ['Run next to heavy machinery causing interference', 'Shielded twisted pair (STP)', 'EMI protection.'], ['Run underground between two buildings without conduit', 'Direct burial', 'Waterproof, UV-resistant.'], ['Run through the air-handling space above a drop ceiling', 'Plenum-rated', 'Fire code.'], ['20 km link between campuses', 'Single-mode fiber', 'Laser, long distance.'], ['Inside a data center, 300 m runs, cheaper optics', 'Multimode fiber', 'LED/VCSEL, shorter.']],
    'Cat 5 is legacy (100 Mbps). Cat 5e = 1G, Cat 6 = 10G short, Cat 6a = 10G 100 m.');
  M('c1-connector', 'Name the connector', 'RJ11, RJ45, F type, ST, SC, LC, punchdown, USB, Molex, Lightning, DB9',
    'Pick the connector.', ['RJ11', 'RJ45', 'F type', 'ST', 'SC', 'LC', 'Punchdown block', 'microUSB', 'miniUSB', 'USB-C', 'Molex', 'Lightning', 'DB9'],
    [['Phone line / DSL, 6-position', 'RJ11', 'Smaller than RJ45.'], ['Ethernet, 8-position 8-contact', 'RJ45', 'Twisted pair.'], ['Screw-on coax for cable modems and TV', 'F type', 'Coax.'], ['Round bayonet fiber connector, twist to lock', 'ST', 'Stick and twist.'], ['Square push-pull fiber connector', 'SC', 'Square.'], ['Small-form-factor fiber connector, common on switches', 'LC', 'Little.'], ['Where in-wall wires are terminated in a wiring closet', 'Punchdown block', '110/66.'], ['Older Android phone port', 'microUSB', 'Small.'], ['Very old cameras', 'miniUSB', 'Legacy.'], ['Reversible data, power and video', 'USB-C', 'Modern.'], ['4-pin power for old IDE drives and fans', 'Molex', 'Legacy power.'], ['iPhone 14 and older', 'Lightning', 'Apple.'], ['9-pin serial port for console cables', 'DB9', 'RS-232.']],
    'Fiber: ST (twist), SC (square), LC (little). Copper: RJ11 phone, RJ45 Ethernet, F coax.');
  M('c1-periph', 'Which cable?', 'USB, Thunderbolt, serial, video and drive cables',
    'Pick the cable.', ['USB 2.0', 'USB 3.0', 'Thunderbolt', 'Serial', 'HDMI', 'DisplayPort', 'DVI', 'VGA', 'SATA', 'eSATA'],
    [['480 Mbps keyboard and mouse connections', 'USB 2.0', 'High Speed.'], ['5 Gbps external drive, blue port', 'USB 3.0', 'SuperSpeed.'], ['40 Gbps daisy-chained displays and storage over a USB-C connector', 'Thunderbolt', 'TB3/4.'], ['Configure a switch through its console port', 'Serial', 'RS-232/DB9 or USB-to-serial.'], ['TV and projector with audio + video in one cable', 'HDMI', 'Consumer AV.'], ['PC monitor at high refresh, with daisy-chain support', 'DisplayPort', 'PC display.'], ['Digital-only or digital+analog legacy monitor connector, no audio', 'DVI', 'Legacy digital.'], ['Analog 15-pin legacy projector connector', 'VGA', 'Analog.'], ['Internal drive data cable', 'SATA', 'Internal.'], ['External version of the internal drive interface', 'eSATA', 'External.']],
    'Video: VGA (analog), DVI, HDMI (audio), DisplayPort, USB-C alt mode.');
  O('c1-cable-wrap', 'Pick, terminate and connect', 'Combined 3.2',
    'A new desk in a busy warehouse office needs Ethernet and a dual-monitor setup. Order the steps.',
    [['Choose STP Cat 6a (machinery interference, 10 Gbps-ready)', 'Cable type.'], ['Use plenum-rated cable because it runs above the drop ceiling', 'Fire code.'], ['Terminate both ends to T568B and test', 'Standard + test.'], ['Connect monitor 1 by DisplayPort and monitor 2 by HDMI', 'Video cables.'], ['Use a USB-C to DisplayPort adapter for the laptop\'s second output', 'Adapters.'], ['Label both ends of the run', 'Documentation.']],
    'Environment decides the cable (shielding, plenum, burial); the devices decide the connectors and adapters.');

  RK.add({ track: TR, id: '3.2', dom: 3, short: 'Cables & connectors', title: 'Summarize basic cable types and their connectors, features, and purposes',
    goal: 'Choose network, peripheral, video and drive cables, adapters and connectors for each job.',
    kw: /\b(cat ?5e?|cat ?6a?|coax|stp|utp|direct burial|plenum|t568|single.?mode|multimode|fiber|thunderbolt|serial|hdmi|displayport|dvi|vga|sata|esata|rj.?11|rj.?45|f.type|\bst\b|\bsc\b|\blc\b|molex|db.?9|adapter|connector|cable)/,
    parts: [
      P('Network cables', 'Compare copper (Cat 5/5e/6/6a, coax, STP, direct burial, plenum) and optical (single-mode, multimode) cables, and T568A/T568B.',
        `<p><b>Copper</b> twisted pair (UTP unless shielded):</p>
<table><tr><th>Category</th><th>Speed</th><th>Distance</th></tr>
<tr><td>Cat 5</td><td>100 Mbps</td><td>100 m (legacy)</td></tr>
<tr><td>Cat 5e</td><td>1 Gbps</td><td>100 m</td></tr>
<tr><td>Cat 6</td><td>1 Gbps / 10 Gbps</td><td>100 m / ~55 m</td></tr>
<tr><td>Cat 6a</td><td>10 Gbps</td><td>100 m</td></tr></table>
<ul><li><b>Coaxial</b> — cable TV and cable modems (RG-6, F-type connector).</li>
<li><b>Shielded twisted pair (STP)</b> — foil/braid shielding against electromagnetic interference (motors, lights).</li>
<li><b>Direct burial</b> — waterproof, rugged jacket for underground runs.</li>
<li><b>Plenum</b> — fire-resistant, low-smoke jacket required in air-handling spaces.</li>
<li><b>T568A / T568B</b> — the two pin-order wiring standards; use one consistently.</li>
<li><b>Optical</b>: <b>single-mode</b> (laser, thin core, kilometers) and <b>multimode</b> (LED/VCSEL, thicker core, hundreds of meters). Immune to EMI.</li></ul>` + pro('Above drop ceilings that carry return air, inspectors check for plenum-rated cable. Using cheaper PVC there can fail an inspection and is a fire hazard.') + trap('Single-mode goes farther than multimode — "multi" does not mean more distance.'),
        [['Which category supports 10 Gbps for the full 100 m?', 'Cat 6a', ['Cat 5e', 'Cat 6', 'Cat 5'], 'Augmented.'],
         ['Which cable jacket is required in air-handling spaces?', 'Plenum', ['Direct burial', 'PVC', 'Coax'], 'Fire code.']],
        'c1-netcable'),
      P('Peripheral, video and drive cables', 'Choose USB 2.0/3.0, serial, Thunderbolt, HDMI, DisplayPort, DVI, VGA, USB-C, SATA and eSATA cables and adapters.',
        `<ul><li><b>Peripheral cables</b>: <b>USB 2.0</b> (480 Mbps), <b>USB 3.0</b> (5 Gbps, blue port; later 3.x up to 20 Gbps), <b>serial</b> (RS-232, DB9 — console ports), <b>Thunderbolt</b> (3/4: 40 Gbps over a USB-C connector, displays + storage + docks).</li>
<li><b>Video cables</b>: <b>HDMI</b> (video + audio, TVs/projectors), <b>DisplayPort</b> (PC monitors, high refresh, daisy-chain), <b>DVI</b> (legacy digital; DVI-I also analog), <b>VGA</b> (analog, 15-pin, legacy), <b>USB-C</b> (DisplayPort alt mode).</li>
<li><b>Hard drive cables</b>: <b>SATA</b> (internal, 7-pin data + 15-pin power) and <b>eSATA</b> (external SATA).</li>
<li><b>Adapters</b> — convert between connectors: USB-C to HDMI, DisplayPort to HDMI, DVI to VGA (only works with DVI-I, which carries analog). Digital-to-analog needs an active adapter.</li></ul>` + pro('When an adapter chain gives "no signal", remove adapters one at a time. Passive DisplayPort-to-HDMI only works if the port supports DP++ — an active adapter fixes it.') + trap('HDMI carries audio; DVI and VGA do not.'),
        [['Which video cable carries both audio and video to a TV?', 'HDMI', ['VGA', 'DVI', 'Serial'], 'Audio + video.'],
         ['Which cable is used for a switch console port?', 'Serial (RS-232/DB9 or USB-to-serial)', ['eSATA', 'HDMI', 'Coax'], 'Console.']],
        'c1-periph'),
      P('Connector types', 'Identify RJ11, RJ45, F type, ST, SC, LC, punchdown blocks, microUSB, miniUSB, USB-C, Molex, Lightning and DB9.',
        `<table><tr><th>Connector</th><th>Used for</th></tr>
<tr><td><b>RJ11</b></td><td>Telephone/DSL (6P2C/6P4C)</td></tr>
<tr><td><b>RJ45</b></td><td>Ethernet (8P8C)</td></tr>
<tr><td><b>F type</b></td><td>Coax, screw-on</td></tr>
<tr><td><b>ST</b> / <b>SC</b> / <b>LC</b></td><td>Fiber: ST round twist-lock; SC square push-pull; LC small, latching, common on SFP modules</td></tr>
<tr><td><b>Punchdown block</b></td><td>Wiring-closet termination (66 for phone, 110 for data)</td></tr>
<tr><td><b>microUSB</b> / <b>miniUSB</b> / <b>USB-C</b></td><td>Small USB connectors; USB-C is reversible</td></tr>
<tr><td><b>Molex</b></td><td>4-pin legacy power for drives/fans</td></tr>
<tr><td><b>Lightning</b></td><td>Apple iPhone/iPad (pre-2023)</td></tr>
<tr><td><b>DB9</b></td><td>9-pin serial (RS-232)</td></tr></table>` + pro('Fiber connectors look similar in photos — check the switch\'s SFP module (usually LC) before ordering patch cables.') + trap('RJ11 is smaller with fewer contacts than RJ45; an RJ11 plug fits loosely in an RJ45 jack but will not carry Ethernet.'),
        [['Which fiber connector is square and push-pull?', 'SC', ['ST', 'LC', 'F type'], 'Square.'],
         ['Which connector is used on coax for cable modems?', 'F type', ['RJ45', 'DB9', 'Molex'], 'Screw-on.']],
        'c1-connector')
    ],
    wrap: { recap: ['Cat 5e 1G, Cat 6 10G short, Cat 6a 10G 100 m; coax for cable; STP for EMI; direct burial; plenum for air spaces.', 'T568A/T568B pin standards. Fiber: single-mode (far) vs multimode (shorter).', 'USB 2.0 480 Mbps, USB 3.0 5 Gbps, Thunderbolt 40 Gbps, serial for consoles.', 'Video: HDMI (audio), DisplayPort, DVI, VGA (analog), USB-C alt mode. Drives: SATA, eSATA.', 'Connectors: RJ11, RJ45, F type, ST/SC/LC, punchdown block, micro/mini/USB-C, Molex, Lightning, DB9.', 'Adapters convert connectors; analog conversion needs an active adapter.'], lab: 'c1-cable-wrap' }
  });

  // ===================== 3.3 RAM =====================
  T('c1-ram', 'Plan a workstation memory upgrade', 'Form factor, DDR, ECC and channels',
    'Ticket: a CAD workstation has 32 GB and needs 64 GB. Read what is installed and what the board needs before ordering. Elevated PowerShell.',
    { shell: 'ps', prompt: 'PS C:\\Windows\\system32>' },
    [{ t: 'List each module: slot, capacity, speed, memory type code and form factor.', accept: [/^get-ciminstance (-classname )?win32_physicalmemory( \| select(-object)? .+| \| (ft|format-table) .+)?$/i, /^gcim win32_physicalmemory.*$/i], show: 'Get-CimInstance Win32_PhysicalMemory | Select-Object DeviceLocator,Capacity,Speed,SMBIOSMemoryType,FormFactor', hint: 'Win32_PhysicalMemory', out: 'DeviceLocator Capacity     Speed SMBIOSMemoryType FormFactor\n------------- --------     ----- ---------------- ----------\nDIMM_A1       17179869184  4800  34               8\nDIMM_B1       17179869184  4800  34               8', ask: { q: 'SMBIOSMemoryType 34 = DDR5 and FormFactor 8 = DIMM. Which channels are the two sticks in (letters)?', accept: ['a and b', 'a,b', 'ab', 'a b', 'a & b'], why: 'One stick in channel A, one in B = dual-channel. Keep pairs matched across channels when adding memory.' }, why: 'DDR5 DIMMs, dual-channel.' },
     { t: 'Check whether the board uses error-correcting memory.', accept: [/^get-ciminstance (-classname )?win32_physicalmemoryarray( \| select(-object)? .+)?$/i, /^gcim win32_physicalmemoryarray.*$/i], show: 'Get-CimInstance Win32_PhysicalMemoryArray | Select-Object MemoryDevices,MaxCapacityEx,MemoryErrorCorrection', hint: 'Win32_PhysicalMemoryArray has MemoryErrorCorrection.', out: 'MemoryDevices MaxCapacityEx MemoryErrorCorrection\n------------- ------------- ---------------------\n            4     134217728                     6', ask: { q: 'MemoryErrorCorrection 6 = multi-bit ECC, 3 = none. Must the new modules be ECC? (yes/no)', accept: ['yes'], why: 'The workstation uses ECC. Do not mix ECC and non-ECC. Order two more 16 GB DDR5-4800 ECC DIMMs for slots A2/B2 (4 slots, 128 GB max).' }, why: 'ECC vs non-ECC.' },
     { t: 'After installing, confirm the new total in GB.', accept: [/^\(get-ciminstance (-classname )?win32_computersystem\)\.totalphysicalmemory( ?\/ ?1gb)?$/i], show: '(Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB', hint: '(Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB', out: '63.7', why: '64 GB, still dual-channel (two DIMMs per channel). Run Windows Memory Diagnostic overnight on a workstation upgrade.' }],
    'Before ordering RAM: form factor (DIMM/SODIMM), DDR generation, speed, ECC or not, slots, max capacity, channel layout.',
    ['Win32_PhysicalMemory and Win32_PhysicalMemoryArray.']);
  M('c1-rampick', 'RAM characteristics', 'SODIMM/DIMM, DDR, ECC, channels',
    'Pick the answer.', ['SODIMM', 'DIMM', 'DDR4', 'DDR5', 'ECC', 'Non-ECC', 'Dual-channel', 'Quad-channel'],
    [['Laptop and mini-PC memory module', 'SODIMM', 'Small outline.'], ['Desktop and server memory module', 'DIMM', 'Full size.'], ['288-pin, notch in a different place than DDR5, up to 3200 MT/s officially', 'DDR4', 'Not interchangeable.'], ['Two 32-bit subchannels per module and on-module power management', 'DDR5', 'Newest.'], ['Detects and corrects single-bit errors; used in servers', 'ECC', 'Error-correcting.'], ['Typical consumer desktop memory', 'Non-ECC', 'No correction.'], ['Two matched modules in slots of different colors/channels', 'Dual-channel', 'Doubles bandwidth.'], ['Workstation board with four memory channels populated', 'Quad-channel', 'HEDT/servers.']],
    'DDR generations are keyed differently — they cannot be mixed or forced.');
  M('c1-ram-wrap', 'Memory desk', 'Combined 3.3',
    'Pick the best answer.', ['Buy a matched pair for dual-channel', 'SODIMM', 'ECC registered DIMMs', 'DDR5 only', 'Check max capacity first', 'Install in the colored slots per the manual'],
    [['User wants 32 GB in a desktop with two free slots for best performance', 'Buy a matched pair for dual-channel', 'Channel configuration.'], ['Mini PC upgrade', 'SODIMM', 'Small form factor.'], ['New virtualization server', 'ECC registered DIMMs', 'Reliability.'], ['Board with DDR5 slots and a spare DDR4 stick on the shelf', 'DDR5 only', 'Not compatible.'], ['User wants 256 GB in an office PC', 'Check max capacity first', 'Board limit.'], ['Two sticks installed in adjacent slots run single-channel', 'Install in the colored slots per the manual', 'Wrong slots.']],
    'Compatibility first (form factor, DDR, ECC), then capacity, then channel layout.');

  RK.add({ track: TR, id: '3.3', dom: 3, short: 'RAM', title: 'Compare and contrast RAM characteristics',
    goal: 'Compare SODIMM and DIMM, DDR generations, ECC vs non-ECC, and channel configurations.',
    kw: /\b(ram\b|memory (module|stick|upgrade)|dimm|sodimm|so.dimm|ddr[2-5]?|ecc|non.ecc|dual.channel|quad.channel|channel config|registered|buffered)/,
    parts: [
      P('Form factors and DDR generations', 'Compare SODIMM and DIMM modules and DDR generations.',
        `<ul><li><b>DIMM</b> — full-size module for desktops, workstations and servers.</li>
<li><b>SODIMM</b> (small outline DIMM) — about half the length, for laptops, mini PCs and some all-in-ones and NAS units.</li></ul>
<table><tr><th>Generation</th><th>Key points</th></tr>
<tr><td><b>DDR3</b></td><td>240-pin DIMM, 1.5 V (legacy)</td></tr>
<tr><td><b>DDR4</b></td><td>288-pin DIMM, 1.2 V, up to ~3200 MT/s standard</td></tr>
<tr><td><b>DDR5</b></td><td>288-pin DIMM but keyed differently, 1.1 V, 4800 MT/s and up, two subchannels per module, power management on the module</td></tr></table>
<p>Each generation has a <b>notch in a different place</b>, so it physically will not fit another generation\'s slot. Speed is given in MT/s (megatransfers per second) or as PC-numbers (DDR4-3200 = PC4-25600). Mixed speeds run at the slowest module\'s speed.</p>` + pro('Read the motherboard manual\'s Qualified Vendor List (QVL) for workstations and servers — it avoids "memory not detected" returns.') + trap('DDR4 and DDR5 DIMMs both have 288 pins but are not interchangeable — the key notch is in a different place.'),
        [['Which module form factor do laptops use?', 'SODIMM', ['DIMM', 'RIMM', 'SIMM'], 'Small outline.'],
         ['A DDR4 stick will not go into a DDR5 slot. Why?', 'The key notch is in a different position', ['It needs more voltage', 'It is ECC', 'The BIOS blocks it'], 'Keyed.']],
        'c1-rampick'),
      P('ECC and channel configurations', 'Explain ECC vs non-ECC memory and single-, dual- and quad-channel configurations.',
        `<ul><li><b>ECC</b> (error-correcting code) — an extra chip/bits detect and correct single-bit memory errors. Used in servers and workstations where silent data corruption is unacceptable. The motherboard and CPU must support it.</li>
<li><b>Non-ECC</b> — normal consumer memory; cheaper, no correction.</li>
<li>Do not mix ECC and non-ECC modules. Many servers also use <b>registered (buffered)</b> ECC DIMMs.</li></ul>
<p><b>Channel configurations</b> — the memory controller talks to several channels at once:</p>
<ul><li><b>Single-channel</b> — one module, or modules in the same channel.</li>
<li><b>Dual-channel</b> — matched modules in two channels (usually same-color slots, e.g. A2 + B2): roughly double the bandwidth.</li>
<li><b>Triple/quad-channel</b> (and more) — workstations and servers.</li></ul>
<p>Use identical modules (size, speed, timings) in matched slots, following the manual.</p>` + pro('Two 8 GB sticks usually outperform one 16 GB stick in a desktop because they run dual-channel — especially with integrated graphics.') + trap('Dual-channel needs the modules in the correct slots (check the manual), not just two modules anywhere on the board.'),
        [['What does ECC memory do?', 'Detects and corrects single-bit errors', ['Doubles capacity', 'Allows mixing DDR4 and DDR5', 'Reduces voltage'], 'Error correction.'],
         ['What is the main benefit of dual-channel memory?', 'More memory bandwidth', ['More capacity', 'ECC protection', 'Lower cost'], 'Two channels at once.']],
        'c1-ram')
    ],
    wrap: { recap: ['DIMM (desktop/server) vs SODIMM (laptop/mini PC).', 'DDR3/4/5 are keyed differently; DDR5 = 4800+ MT/s, two subchannels.', 'Mixed speeds run at the slowest module.', 'ECC corrects single-bit errors (servers/workstations); non-ECC for consumer; do not mix.', 'Single/dual/quad-channel: matched modules in the right slots for bandwidth.', 'Before ordering: form factor, DDR, speed, ECC, slots, max capacity.'], lab: 'c1-ram-wrap' }
  });

  // ===================== 3.4 Storage =====================
  C('c1-raidcalc', 'RAID math', 'Usable capacity and fault tolerance',
    'You have <b>four 4 TB drives</b>. Work out the usable capacity (TB) for each RAID level, and how many drives can fail.',
    [['RAID 0 usable capacity (TB)', 16, '16', 'Striping: all capacity, no redundancy.'],
     ['RAID 1 with two of the drives — usable capacity (TB)', 4, '4', 'Mirror: half.'],
     ['RAID 5 with all four — usable capacity (TB)', 12, '12', 'One drive\'s worth of parity: (n−1) × size.'],
     ['RAID 6 with all four — usable capacity (TB)', 8, '8', 'Two drives of parity: (n−2) × size.'],
     ['RAID 10 with all four — usable capacity (TB)', 8, '8', 'Mirrored pairs, striped: half.'],
     ['RAID 6: how many drives can fail without data loss?', 2, '2', 'Double parity.']],
    'RAID 0 = speed, no protection. 1 = mirror. 5 = one parity drive (min 3). 6 = two parity (min 4). 10 = mirror + stripe (min 4). RAID is not a backup.',
    ['RAID 5 = (n−1) × size; RAID 6 = (n−2) × size; RAID 1 and 10 = half.']);
  T('c1-disk', 'What storage is in this PC?', 'Drives, interfaces and media type',
    'Ticket: before a refresh, document each PC\'s drives. Elevated PowerShell.',
    { shell: 'ps', prompt: 'PS C:\\Windows\\system32>' },
    [{ t: 'List the physical disks with media type, bus type and size.', accept: [/^get-physicaldisk( \| select(-object)? .+| \| (ft|format-table) .+)?$/i], show: 'Get-PhysicalDisk | Select-Object FriendlyName,MediaType,BusType,Size', hint: 'Get-PhysicalDisk', out: 'FriendlyName         MediaType BusType Size\n------------         --------- ------- ----\nWD Black SN850X      SSD       NVMe    2000398934016\nST4000DM004          HDD       SATA    4000787030016\nSanDisk Ultra USB    Unspecified USB   64023257088', ask: { q: 'Which drive is an NVMe SSD (name)?', accept: ['wd black sn850x', 'sn850x', 'wd black'], why: 'NVMe = SSD over PCIe lanes, usually M.2 form factor. The Seagate is a SATA HDD; the SanDisk is removable flash.' }, why: 'Interface and media type.' },
     { t: 'Get the spinning drive\'s rotation speed.', accept: [/^get-physicaldisk( -friendlyname)? "?st4000dm004"? \| select(-object)? .*spindlespeed.*$/i, /^get-physicaldisk \| select(-object)? .*spindlespeed.*$/i], show: 'Get-PhysicalDisk -FriendlyName ST4000DM004 | Select-Object FriendlyName,SpindleSpeed', hint: 'The SpindleSpeed property.', out: 'FriendlyName SpindleSpeed\n------------ ------------\nST4000DM004          5400', ask: { q: 'What is the spindle speed in RPM?', accept: ['5400'], why: '5,400 RPM: slower desktop/archive drive. 7,200 is typical desktop; 10,000/15,000 RPM were enterprise SAS drives.' }, why: 'HDD spindle speeds.' },
     { t: 'Check the drives\' health and wear (reliability counters).', accept: [/^get-physicaldisk \| get-storagereliabilitycounter( \| select(-object)? .+)?$/i], show: 'Get-PhysicalDisk | Get-StorageReliabilityCounter | Select-Object DeviceId,Wear,Temperature,ReadErrorsTotal', hint: 'Get-PhysicalDisk | Get-StorageReliabilityCounter', out: 'DeviceId Wear Temperature ReadErrorsTotal\n-------- ---- ----------- ---------------\n0           3          41               0\n1           0          38              12', ask: { q: 'Which DeviceId is showing read errors?', accept: ['1'], why: 'The HDD (DeviceId 1) has read errors — back it up and plan replacement. (Troubleshooting continues in 5.2.)' }, why: 'Document health with the inventory.' }],
    'Record media (HDD/SSD), interface (SATA, NVMe/PCIe, SAS, USB), form factor, size and health.',
    ['Get-PhysicalDisk, SpindleSpeed, Get-StorageReliabilityCounter.']);
  M('c1-storpick', 'Which storage?', 'HDD, SSD interfaces and form factors, removable, optical',
    'Pick the storage.', ['3.5-inch 7,200 RPM HDD', '2.5-inch SATA SSD', 'M.2 NVMe SSD', 'mSATA SSD', 'SAS drive', 'Flash drive', 'Memory card', 'Optical drive'],
    [['Cheapest bulk storage in a desktop', '3.5-inch 7,200 RPM HDD', 'Capacity per dollar.'], ['Speed up an old laptop that has a 2.5-inch bay', '2.5-inch SATA SSD', 'Drop-in.'], ['Fastest boot drive on a modern motherboard', 'M.2 NVMe SSD', 'PCIe lanes.'], ['Older small laptop slot, before M.2', 'mSATA SSD', 'Mini-SATA.'], ['Enterprise server drive with dual ports', 'SAS drive', 'Serial attached SCSI.'], ['Carry files between PCs on a USB stick', 'Flash drive', 'Removable.'], ['Camera storage (SD/microSD)', 'Memory card', 'Removable.'], ['Install software from a DVD or burn Blu-ray archives', 'Optical drive', 'CD/DVD/Blu-ray.']],
    'Interface (SATA, NVMe/PCIe, SAS) and form factor (2.5, 3.5, M.2, mSATA) are separate questions.');

  RK.add({ track: TR, id: '3.4', dom: 3, short: 'Storage devices', title: 'Compare and contrast storage devices',
    goal: 'Compare HDDs (spindle speeds, form factors), SSDs (NVMe, SATA, PCIe, SAS; M.2, mSATA), RAID 0/1/5/6/10, removable and optical storage.',
    kw: /\b(hdd|hard drive|ssd|solid.state|nvme|sata|pcie|sas\b|m\.2|msata|rpm|spindle|2\.5.inch|3\.5.inch|raid|stripe|mirror|parity|flash drive|memory card|sd card|optical|dvd|blu.?ray)/,
    parts: [
      P('Hard drives and SSDs', 'Compare HDD spindle speeds and form factors with SSD interfaces (NVMe, SATA, PCIe, SAS) and form factors (M.2, mSATA).',
        `<p><b>Hard drives (HDD)</b> — spinning platters and a moving head.</p>
<ul><li><b>Spindle speeds</b>: 5,400 RPM (quiet, slower), 7,200 RPM (desktop standard), 10,000 and 15,000 RPM (older enterprise). Faster = lower latency.</li>
<li><b>Form factors</b>: <b>2.5-inch</b> (laptops) and <b>3.5-inch</b> (desktops, NAS, servers).</li></ul>
<p><b>Solid-state drives (SSD)</b> — flash memory, no moving parts: faster, silent, shock-resistant.</p>
<ul><li><b>Communications interfaces</b>: <b>SATA</b> (~600 MB/s max), <b>NVMe</b> over <b>PCIe</b> lanes (several GB/s), <b>SAS</b> (enterprise, dual-port, hot-swap).</li>
<li><b>Form factors</b>: 2.5-inch SATA, <b>M.2</b> (stick on the board; SATA or NVMe; lengths like 2242/2280), <b>mSATA</b> (older mini-SATA card), plus PCIe add-in cards.</li></ul>` + pro('An M.2 slot may accept only NVMe, only SATA, or both — and some boards disable a SATA port when an M.2 slot is used. Read the manual before installing.') + trap('M.2 is a form factor, not a speed. An M.2 SATA SSD is no faster than a 2.5-inch SATA SSD.'),
        [['Which SSD interface is fastest for a desktop boot drive?', 'NVMe over PCIe', ['SATA', 'USB 2.0', 'eSATA'], 'PCIe lanes.'],
         ['Which HDD form factor is used in desktops and NAS units?', '3.5-inch', ['2.5-inch', 'M.2', 'mSATA'], 'Larger.']],
        'c1-disk'),
      P('RAID and removable storage', 'Compare RAID 0, 1, 5, 6 and 10, flash drives, memory cards and optical drives.',
        `<table><tr><th>RAID</th><th>Min drives</th><th>How</th><th>Survives</th><th>Usable</th></tr>
<tr><td><b>0</b></td><td>2</td><td>Striping</td><td>No failures</td><td>100%</td></tr>
<tr><td><b>1</b></td><td>2</td><td>Mirroring</td><td>1 drive</td><td>50%</td></tr>
<tr><td><b>5</b></td><td>3</td><td>Striping + single parity</td><td>1 drive</td><td>(n−1) drives</td></tr>
<tr><td><b>6</b></td><td>4</td><td>Striping + double parity</td><td>2 drives</td><td>(n−2) drives</td></tr>
<tr><td><b>10</b></td><td>4</td><td>Mirrored pairs, striped</td><td>1 per pair</td><td>50%</td></tr></table>
<p><b>Removable storage</b>: <b>flash drives</b> (USB), <b>memory cards</b> (SD, microSD — speed classes matter for video), and <b>optical drives</b> (CD 700 MB, DVD 4.7/8.5 GB, Blu-ray 25/50 GB) — still used for archives and older software.</p>` + pro('RAID protects against a drive failure, not against deletion, ransomware or fire. Every RAID array still needs a backup.') + trap('RAID 0 has no fault tolerance — losing one drive loses everything.'),
        [['Which RAID level survives two drive failures?', 'RAID 6', ['RAID 0', 'RAID 1', 'RAID 5'], 'Double parity.'],
         ['Five 2 TB drives in RAID 5 give how much usable space?', '8 TB', ['10 TB', '6 TB', '4 TB'], '(5−1) × 2.']],
        'c1-raidcalc')
    ],
    wrap: { recap: ['HDD: 5,400/7,200/10k/15k RPM; 2.5-inch and 3.5-inch.', 'SSD interfaces: SATA, NVMe over PCIe, SAS. Form factors: 2.5-inch, M.2, mSATA.', 'M.2 is a shape; check SATA vs NVMe support.', 'RAID 0 stripe (no protection), RAID 1 mirror, RAID 5 single parity (min 3), RAID 6 double parity (min 4), RAID 10 mirror+stripe (min 4).', 'RAID is not a backup.', 'Removable: flash drives, memory cards; optical: CD/DVD/Blu-ray.'], lab: 'c1-storpick' }
  });
})();
