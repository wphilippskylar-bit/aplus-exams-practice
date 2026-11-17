/* A+ Core 1 (220-1201) — Domain 1.0 Mobile Devices — objectives 1.1 to 1.3 + domain wrap lab */
(function () {
  var RK = window.RK, P = RK.P, M = RK.M, O = RK.O, T = RK.T, TR = 'core1';
  function pro(t) { return '<div class="callout pro"><b class="k">On the job</b>' + t + '</div>'; }
  function trap(t) { return '<div class="callout trap"><b class="k">Exam trap</b>' + t + '</div>'; }

  // ===================== 1.1 Mobile hardware =====================
  T('c1-batt', 'Is it the battery?', 'powercfg battery report',
    'Ticket: "My laptop used to last 8 hours, now it dies after 2." Command Prompt on the laptop (no admin needed for this).',
    { shell: 'cmd', prompt: 'C:\\Users\\jlee>' },
    [{ t: 'Generate Windows\' built-in battery health report.', accept: [/^powercfg \/batteryreport( \/output .+)?$/i], show: 'powercfg /batteryreport', hint: 'powercfg has a /batteryreport switch.', out: 'Battery life report saved to file path C:\\Users\\jlee\\battery-report.html.', why: 'The report shows design capacity, current full-charge capacity, cycle count and usage history.' },
     { t: 'Read the key lines from the report (shown below). Open it.', accept: [/^(start )?battery-report\.html$/i, /^start c:\\users\\jlee\\battery-report\.html$/i], show: 'start battery-report.html', hint: 'start <file> opens it in the browser.', out: 'Installed batteries\n  NAME                 Primary\n  CHEMISTRY            LiIon\n  DESIGN CAPACITY      56,000 mWh\n  FULL CHARGE CAPACITY 19,600 mWh\n  CYCLE COUNT          1,104', ask: { q: 'What percent of its design capacity does the battery still hold? (number only)', accept: ['35', '35%'], why: '19,600 ÷ 56,000 = 35%. Most makers call a battery worn out below about 80%. Replace it.' }, why: 'Evidence before replacement: a worn battery, not Windows, is the cause.' },
     { t: 'Before ordering, get the laptop\'s exact model so the right battery part is ordered.', accept: [/^wmic (computersystem|csproduct) get (model|name).*$/i, /^powershell (-c(ommand)? )?"?get-ciminstance win32_computersystem.*$/i], show: 'wmic csproduct get name,identifyingnumber', hint: 'wmic csproduct get name,identifyingnumber', out: 'IdentifyingNumber  Name\n5CG4210QXZ         HP EliteBook 840 G9 Notebook PC', why: 'Batteries are model-specific. Order the OEM part for this model and serial (warranty check).' }],
    'Monitor → evidence → order the right part. Swollen battery = stop using the device and replace immediately; never puncture or press on it.',
    ['powercfg /batteryreport; compare full-charge to design capacity.']);
  T('c1-upgrade', 'Upgrade RAM and storage on a laptop', 'Check before and after the swap',
    'Ticket: an engineer\'s laptop needs more RAM and a bigger SSD. Before opening it, record what is installed and what it supports; after, verify. Elevated PowerShell.',
    { shell: 'ps', prompt: 'PS C:\\Windows\\system32>' },
    [{ t: 'List the installed memory modules: capacity, speed and form factor.', accept: [/^get-ciminstance (-classname )?win32_physicalmemory( \| select(-object)? .+| \| (ft|format-table) .+)?$/i, /^gcim win32_physicalmemory.*$/i], show: 'Get-CimInstance Win32_PhysicalMemory | Select-Object BankLabel,Capacity,Speed,FormFactor', hint: 'The Win32_PhysicalMemory class lists each stick.', out: 'BankLabel Capacity    Speed FormFactor\n--------- --------    ----- ----------\nBANK 0    8589934592  4800  12\nBANK 2    8589934592  4800  12', ask: { q: 'FormFactor 12 means SODIMM. How many GB are installed in total?', accept: ['16', '16gb'], why: 'Two 8 GB DDR5-4800 SODIMMs = 16 GB. Order a matched pair of DDR5-4800 SODIMMs (laptops use SODIMM, desktops DIMM).' }, why: 'Match type, speed and form factor.' },
     { t: 'Find the maximum memory the board supports and how many slots it has.', accept: [/^get-ciminstance (-classname )?win32_physicalmemoryarray( \| select(-object)? .+)?$/i, /^gcim win32_physicalmemoryarray.*$/i], show: 'Get-CimInstance Win32_PhysicalMemoryArray | Select-Object MaxCapacityEx,MemoryDevices', hint: 'Win32_PhysicalMemoryArray.', out: 'MaxCapacityEx MemoryDevices\n------------- -------------\n   67108864             2', ask: { q: 'MaxCapacityEx is in KB. What is the maximum in GB?', accept: ['64', '64gb'], why: '67,108,864 KB = 64 GB in 2 slots → 2 × 32 GB SODIMMs.' }, why: 'Never order more than the board supports.' },
     { t: 'Check the current drive: media type, bus type and size.', accept: [/^get-physicaldisk( \| select(-object)? .+| \| (ft|format-table) .+)?$/i], show: 'Get-PhysicalDisk | Select-Object FriendlyName,MediaType,BusType,Size', hint: 'Get-PhysicalDisk', out: 'FriendlyName              MediaType BusType Size\n------------              --------- ------- ----\nSAMSUNG MZVL2512HCJQ      SSD       NVMe    512110190592', ask: { q: 'Which bus type must the new drive use?', accept: ['nvme'], why: 'An NVMe M.2 slot. Buy an NVMe M.2 SSD of the same length (usually 2280). Clone or image the old drive, power off, unplug and remove the battery connector, use ESD protection, then swap.' }, why: 'Same interface and form factor.' },
     { t: 'After the swap, confirm Windows sees the new memory total.', accept: [/^\(get-ciminstance (-classname )?win32_computersystem\)\.totalphysicalmemory( ?\/ ?1gb)?$/i, /^get-ciminstance (-classname )?win32_computersystem( \| select(-object)? totalphysicalmemory)?$/i], show: '(Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB', hint: '(Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB', out: '63.7', why: '≈64 GB visible (a little is reserved). Verify full functionality, then document the change on the asset record.' }],
    'Laptop upgrade flow: record what is installed → check what is supported → order matching SODIMM/M.2 → back up/clone → ESD + battery disconnected → swap → verify.',
    ['Win32_PhysicalMemory, Win32_PhysicalMemoryArray, Get-PhysicalDisk.']);
  M('c1-mobhw', 'Which component?', 'Wireless card, antenna, camera, mic, biometrics, NFC',
    'Pick the part to check or replace.', ['Wireless card (M.2 Wi-Fi/Bluetooth)', 'Wi-Fi antenna connector/placement', 'Camera/webcam', 'Microphone', 'Biometric reader (fingerprint/face)', 'Near-field (NFC) scanner', 'Keyboard/keys'],
    [['Wi-Fi works only when the laptop sits next to the access point, after a screen replacement', 'Wi-Fi antenna connector/placement', 'The antenna leads run up the display; one was left unplugged.'],
     ['Device Manager shows no wireless adapter at all after a liquid spill', 'Wireless card (M.2 Wi-Fi/Bluetooth)', 'The card itself failed.'],
     ['Video calls show a black image; the privacy shutter is open and drivers are current', 'Camera/webcam', 'Replace the camera module in the display bezel.'],
     ['Coworkers cannot hear the user, but a USB headset works', 'Microphone', 'Built-in mic (usually in the bezel).'],
     ['Windows Hello fingerprint sign-in fails every time; the sensor is scratched', 'Biometric reader (fingerprint/face)', 'Privacy/security component.'],
     ['Badge-tap login on the laptop palm rest stopped working', 'Near-field (NFC) scanner', 'Near-field scanner feature.'],
     ['Several keys type nothing after coffee was spilled', 'Keyboard/keys', 'Replace the keyboard (often part of the top cover).']],
    'Antenna leads live in the lid — check them after any screen work.');
  O('c1-replace-order', 'Replace a laptop part safely', 'Combined 1.1',
    'Put the replacement steps in order.',
    [['Back up data and confirm the exact part number for the model', 'Right part, no data loss.'],
     ['Shut down, unplug AC power', 'Never work on a powered laptop.'],
     ['Disconnect the internal battery connector', 'Removes the last power source.'],
     ['Use ESD protection (strap or mat) and keep screws organized by location', 'Different screw lengths go in different holes.'],
     ['Replace the component, reconnecting antenna and ribbon cables', 'Ribbon cables and antennas are the usual mistakes.'],
     ['Reassemble, reconnect battery, power on and verify full function', 'Test keyboard, Wi-Fi, camera, mic, biometrics.'],
     ['Document the replacement and recycle the old part properly', 'Batteries are hazardous waste.']],
    'Most failed laptop repairs are a missed ribbon cable or antenna lead, not a bad part.');

  RK.add({ track: TR, id: '1.1', dom: 1, short: 'Mobile hardware', title: 'Given a scenario, monitor mobile device hardware and use appropriate replacement techniques',
    goal: 'Monitor laptop/mobile hardware health and replace batteries, keyboards, RAM, drives, wireless cards, antennas, cameras, microphones and biometric/NFC components.',
    kw: /\b(battery|batteries|keyboard|sodimm|laptop (ram|memory)|m\.2|2\.5|ssd|hdd|wireless card|mini.?pcie|antenna|webcam|camera|microphone|biometric|fingerprint|nfc (reader|scanner)|smart card reader|replace(ment)? (a |the )?(laptop|component))/,
    parts: [
      P('Battery and power', 'Monitor battery health and replace a failing or swollen battery safely.',
        `<p>Laptops and phones use <b>lithium-ion (Li-ion)</b> batteries. They wear with every charge <b>cycle</b>, so capacity drops over the years.</p>
<ul><li><b>Monitor</b> — Windows: <code>powercfg /batteryreport</code> (design vs full-charge capacity, cycle count). macOS: System Settings → Battery → Battery Health. iOS: Settings → Battery → Battery Health. Many OEMs have their own diagnostics.</li>
<li><b>Replace</b> when capacity falls well below design (about 80% is a common threshold), the laptop dies early, or it will not charge.</li>
<li><b>Removable vs internal</b> — most modern laptops and all phones have <b>internal</b> batteries: open the case, disconnect the battery connector first, then unscrew or release the adhesive.</li>
<li><b>Swollen battery</b> — case bulging, trackpad lifting, screen separating. Stop using it, do not charge, puncture or press on it; replace it and recycle it as hazardous waste.</li></ul>` + pro('Check the warranty first: a battery under 80% inside the warranty period is often a free replacement from the manufacturer.') + trap('A laptop that only runs while plugged in usually has a dead battery, not a bad charger — the charger is clearly supplying power.'),
        [['Which Windows command shows battery design and full-charge capacity?', 'powercfg /batteryreport', ['ipconfig /all', 'chkdsk /f', 'sfc /scannow'], 'Battery report.'],
         ['A laptop\'s trackpad is lifting and the case is bulging. What do you do?', 'Stop using it and replace the swollen battery', ['Press the case closed', 'Charge it fully to recalibrate', 'Puncture it to release pressure'], 'Swollen Li-ion is a fire risk.']],
        'c1-batt'),
      P('Keyboard, RAM and storage', 'Replace keyboards/keys and upgrade laptop RAM and HDD/SSD storage.',
        `<ul><li><b>Keyboard/keys</b> — a single key cap can often be clipped back on; spills or dead rows mean replacing the keyboard. On many laptops it is riveted to the top cover (palm rest), so you replace the whole assembly. An external USB keyboard is the quick workaround.</li>
<li><b>RAM</b> — laptops use <b>SODIMM</b> modules. Match the DDR generation (DDR4/DDR5) and speed; check the maximum and number of slots. Some thin laptops have memory soldered to the board — no upgrade possible.</li>
<li><b>HDD/SSD</b> — older laptops use <b>2.5-inch</b> SATA drives; modern ones use <b>M.2</b> SSDs (SATA or <b>NVMe</b> — check which the slot supports, and the length, e.g. 2280). Clone or image the old drive, or reinstall the OS, then restore data.</li></ul>
<p><b>Replacement technique</b>: back up, power off, unplug, disconnect the battery, use ESD protection, keep screws organized (different lengths), photograph cable routing, reassemble, test.</p>` + pro('Take a phone photo of the inside before you remove anything. It is the fastest way to get every ribbon cable and screw back where it was.') + trap('An M.2 slot that only supports SATA will not run an NVMe drive (and vice versa) even though they look the same.'),
        [['Which memory form factor do laptops use?', 'SODIMM', ['DIMM', 'SIMM', 'RIMM'], 'Small outline.'],
         ['What must you check before buying an M.2 SSD for a laptop?', 'Whether the slot supports SATA or NVMe, and the module length', ['The screen resolution', 'The battery chemistry', 'The keyboard layout'], 'Interface and size.']],
        'c1-upgrade'),
      P('Wireless, cameras, microphones and security parts', 'Diagnose and replace wireless cards, Wi-Fi antennas, cameras, microphones, biometrics and near-field scanners.',
        `<ul><li><b>Wireless cards</b> — usually an <b>M.2</b> Wi-Fi + Bluetooth card on the motherboard. Replace with a supported model (some BIOSes allow only approved cards).</li>
<li><b>Wi-Fi antenna connector/placement</b> — antennas run up the <b>display lid</b> (highest point = best signal) and clip onto the card with tiny connectors. Weak Wi-Fi after screen work = a lead not reattached or pinched.</li>
<li><b>Camera/webcam</b> and <b>microphone</b> — in the display bezel. Check the privacy shutter, the Fn key, OS privacy settings and drivers before replacing hardware.</li>
<li><b>Physical privacy and security components</b>:
<ul><li><b>Biometrics</b> — fingerprint readers (often in the power button) and IR face cameras (Windows Hello).</li>
<li><b>Near-field scanner features</b> — NFC readers for badge tap-to-log-in or smart cards.</li>
<li>Privacy shutters and kill switches for the camera/mic.</li></ul></li></ul>` + pro('Before ordering a webcam, check Settings → Privacy → Camera. A "broken" camera is very often just blocked for apps.') + trap('Weak Wi-Fi after a screen replacement points to the antenna leads in the lid, not the wireless card.'),
        [['Where are laptop Wi-Fi antennas usually located?', 'In the display lid', ['Under the keyboard', 'Inside the battery', 'Behind the trackpad'], 'Highest point.'],
         ['A webcam shows black but drivers are fine. What should you check before replacing it?', 'The privacy shutter, Fn key and OS camera privacy settings', ['The RAM', 'The SSD', 'The battery report'], 'Software/privacy first.']],
        'c1-mobhw')
    ],
    wrap: { recap: ['Battery: powercfg /batteryreport (design vs full-charge, cycles); replace below ~80%; swollen = stop and replace.', 'Keyboard: key cap, keyboard, or whole top cover; USB keyboard as a workaround.', 'RAM: SODIMM, match DDR type/speed, check max and slots; some is soldered.', 'Storage: 2.5-inch SATA or M.2 (SATA vs NVMe, length); clone or reinstall.', 'Wireless card is M.2; antennas run up the lid — check leads after screen work.', 'Camera, microphone, biometrics, near-field scanner: check privacy settings first. Always: backup, power off, battery disconnected, ESD, organized screws, test.'], lab: 'c1-replace-order' }
  });

  // ===================== 1.2 Accessories & connectivity =====================
  M('c1-conn', 'Which connection?', 'USB, Lightning, NFC, Bluetooth, tethering, hotspot',
    'Pick the best connection method.', ['USB-C', 'microUSB', 'miniUSB', 'Lightning', 'NFC', 'Bluetooth', 'Tethering', 'Hotspot'],
    [['Current Android phones, iPhone 15 and later, and most new laptops charge through it', 'USB-C', 'Reversible, carries data, power and video.'],
     ['An older budget Android phone and many cheap accessories', 'microUSB', 'Small, not reversible.'],
     ['A very old digital camera or GPS unit', 'miniUSB', 'Older, larger than micro.'],
     ['An iPhone 14 or older', 'Lightning', 'Apple\'s proprietary connector until 2023.'],
     ['Tap the phone to pay or to pair a speaker in a few centimeters', 'NFC', 'Very short range.'],
     ['Wireless earbuds and a keyboard about 10 m away', 'Bluetooth', 'Personal area network.'],
     ['Share the phone\'s cellular data with one laptop over a USB cable', 'Tethering', 'Wired sharing.'],
     ['Share the phone\'s cellular data with three laptops over Wi-Fi', 'Hotspot', 'Phone becomes a Wi-Fi access point.']],
    'Tethering (USB or Bluetooth) and hotspot (Wi-Fi) both share cellular data — watch the data cap.');
  M('c1-acc', 'Which accessory?', 'Stylus, headset, speakers, webcam, dock, port replicator, trackpad/drawing pad/track point',
    'Pick the accessory that fits.', ['Docking station', 'Port replicator', 'Stylus', 'Headset', 'Speakers', 'Webcam', 'Drawing pad', 'Track point'],
    [['One cable at the desk gives the laptop two monitors, Ethernet, charging and USB devices — the manufacturer\'s model with extra ports and charging', 'Docking station', 'Full dock.'],
     ['A simple adapter that just copies the laptop\'s ports to the desk so cables stay plugged in', 'Port replicator', 'Fewer features than a dock.'],
     ['A designer wants to write and draw directly on a touchscreen tablet', 'Stylus', 'Pen input.'],
     ['A call-center agent needs hands-free audio with a microphone', 'Headset', 'Mic + headphones.'],
     ['A conference room needs louder audio than the laptop provides', 'Speakers', 'Audio output.'],
     ['A laptop\'s built-in camera is poor for client meetings', 'Webcam', 'External camera.'],
     ['An artist needs a pressure-sensitive surface beside the keyboard', 'Drawing pad', 'Graphics tablet.'],
     ['The small rubber nub in the middle of some ThinkPad keyboards', 'Track point', 'Pointing stick.']],
    'Dock = many ports + often power and video. Port replicator = copies ports.');
  M('c1-acc-wrap', 'Accessory desk', 'Combined 1.2',
    'Pick the best option.', ['USB-C dock', 'Lightning-to-USB-C adapter', 'Bluetooth', 'NFC', 'Hotspot', 'Tethering', 'Stylus', 'Trackpad'],
    [['New laptop has only two USB-C ports; user needs monitors, Ethernet and charging', 'USB-C dock', 'One cable.'],
     ['User\'s iPhone 13 cable will not fit the new USB-C charger', 'Lightning-to-USB-C adapter', 'Or a Lightning-to-USB-C cable.'],
     ['Pair a wireless mouse with no dongle', 'Bluetooth', 'PAN.'],
     ['Pay at the register by tapping a phone', 'NFC', 'Near-field.'],
     ['Team at an off-site meeting needs Internet for four laptops', 'Hotspot', 'Wi-Fi sharing.'],
     ['A laptop with no Wi-Fi card must use the phone\'s data over a cable', 'Tethering', 'USB tethering.'],
     ['Annotate PDFs by hand on a 2-in-1 laptop', 'Stylus', 'Pen.'],
     ['User wants a larger external pointing surface with gestures', 'Trackpad', 'External touch surface.']],
    'Match the accessory to the port the device actually has.');

  RK.add({ track: TR, id: '1.2', dom: 1, short: 'Accessories & connectivity', title: 'Compare and contrast accessories and connectivity options for mobile devices',
    goal: 'Choose the right connector, wireless method and accessory for a mobile device.',
    kw: /\b(usb.?c|micro.?usb|mini.?usb|lightning|tether|hotspot|stylus|headset|speaker|docking station|dock\b|port replicator|trackpad|drawing pad|track ?point|accessor)/,
    parts: [
      P('Connection methods', 'Compare USB-C, microUSB, miniUSB, Lightning, NFC, Bluetooth, tethering and hotspots.',
        `<table><tr><th>Method</th><th>What it is</th></tr>
<tr><td><b>USB-C</b></td><td>Reversible 24-pin connector. Data, charging (USB Power Delivery) and video (DisplayPort alt mode/Thunderbolt). Standard on new phones and laptops.</td></tr>
<tr><td><b>microUSB</b> / <b>miniUSB</b></td><td>Older, non-reversible small USB connectors. micro = older Android phones; mini = very old cameras and devices.</td></tr>
<tr><td><b>Lightning</b></td><td>Apple\'s 8-pin reversible connector (iPhone 5 to iPhone 14). iPhone 15 and later use USB-C.</td></tr>
<tr><td><b>NFC</b></td><td>Near-field communication, a few centimeters. Tap-to-pay, badge access, quick pairing.</td></tr>
<tr><td><b>Bluetooth</b></td><td>Wireless personal area network (PAN), about 10 m. Headsets, keyboards, mice, speakers.</td></tr>
<tr><td><b>Tethering</b></td><td>Sharing the phone\'s cellular data with one device over USB (or Bluetooth).</td></tr>
<tr><td><b>Hotspot</b></td><td>The phone acts as a Wi-Fi access point for several devices.</td></tr></table>` + pro('Not every USB-C cable is equal: some are charge-only or USB 2.0 speed. If a monitor will not light up through USB-C, try a cable rated for video/Thunderbolt.') + trap('Tethering usually means a cable (USB); a hotspot means Wi-Fi. Both use the cellular data plan.'),
        [['Which connector did iPhones use before the iPhone 15?', 'Lightning', ['microUSB', 'miniUSB', 'USB-B'], 'Apple proprietary.'],
         ['Several laptops need to share one phone\'s cellular connection. Which feature?', 'Hotspot', ['NFC', 'Tethering over USB', 'Lightning'], 'Wi-Fi AP.']],
        'c1-conn'),
      P('Accessories, docks and pointing devices', 'Compare styluses, headsets, speakers, webcams, docking stations, port replicators, trackpads, drawing pads and track points.',
        `<ul><li><b>Stylus</b> — a pen for touchscreens. Active styluses (with batteries) support pressure and palm rejection; passive ones are just a soft tip.</li>
<li><b>Headsets</b> — headphones + microphone (USB, 3.5 mm, Bluetooth). <b>Speakers</b> — external audio output.</li>
<li><b>Webcam</b> — external camera, usually USB, for better video than the built-in one.</li>
<li><b>Docking station</b> — one connection gives the laptop extra monitors, Ethernet, USB, audio and charging. Often vendor-specific or USB-C/Thunderbolt.</li>
<li><b>Port replicator</b> — a simpler device that duplicates the laptop\'s ports at the desk; fewer features, usually no extra video or charging.</li>
<li><b>Trackpad / drawing pad / track points</b> — trackpad (touchpad) for gestures; drawing pad (graphics tablet) for pressure-sensitive art; track point (pointing stick) is the rubber nub between the G, H and B keys.</li></ul>` + pro('Before blaming a dock, update its firmware and the laptop\'s USB-C/Thunderbolt drivers — most "dock drops monitors" tickets are fixed that way.') + trap('Dock vs port replicator: a dock adds capability (video, charging, more ports); a port replicator only duplicates ports.'),
        [['Which accessory gives a laptop extra monitors, Ethernet and charging through one connection?', 'Docking station', ['Port replicator', 'Stylus', 'Track point'], 'Full dock.'],
         ['What is the small rubber pointing nub on some laptop keyboards called?', 'Track point', ['Trackpad', 'Drawing pad', 'Digitizer'], 'Pointing stick.']],
        'c1-acc')
    ],
    wrap: { recap: ['USB-C = reversible, data/power/video; microUSB and miniUSB are older; Lightning = older iPhones.', 'NFC = centimeters, tap to pay; Bluetooth = ~10 m PAN.', 'Tethering = share cellular data over USB/Bluetooth; hotspot = over Wi-Fi to many devices.', 'Accessories: stylus, headset, speakers, webcam.', 'Docking station adds video/Ethernet/charging; port replicator duplicates ports.', 'Trackpad, drawing pad, track point are pointing/input devices.'], lab: 'c1-acc-wrap' }
  });

  // ===================== 1.3 Mobile network connectivity & app support =====================
  T('c1-tether', 'Get a laptop online through a phone hotspot', 'netsh wlan from the laptop',
    'Ticket: the office Internet is down. A manager turned on her iPhone hotspot ("Dana-iPhone") so her laptop can work. The laptop will not connect. Command Prompt on the laptop.',
    { shell: 'cmd', prompt: 'C:\\Users\\dana>' },
    [{ t: 'Show what the laptop\'s Wi-Fi adapter is connected to right now.', accept: [/^netsh wlan show interfaces?$/i], show: 'netsh wlan show interfaces', hint: 'netsh wlan show interfaces', out: '    Name                   : Wi-Fi\n    State                  : disconnected\n    Radio status           : Hardware On\n                             Software Off', ask: { q: 'The hardware radio is on. Which radio status is off?', accept: ['software', 'software off'], why: 'Wi-Fi is turned off in Windows (airplane mode or the Wi-Fi toggle). Turn it on in Quick Settings.' }, why: 'Check the radio before anything else.' },
     { t: 'After switching Wi-Fi on, list the networks the laptop can see.', accept: [/^netsh wlan show networks( mode=bssid)?$/i], show: 'netsh wlan show networks', hint: 'netsh wlan show networks', out: 'SSID 1 : CORP-WIFI\n    Authentication          : WPA2-Enterprise\nSSID 2 : Dana-iPhone\n    Authentication          : WPA3-Personal', why: 'The hotspot is visible. (If not: keep the phone on the hotspot screen, enable "Maximize Compatibility" for 2.4 GHz.)' },
     { t: 'Connect to the phone\'s hotspot (a saved profile already exists for it).', accept: [/^netsh wlan connect name="?dana-iphone"?( ssid="?dana-iphone"?)?$/i], show: 'netsh wlan connect name="Dana-iPhone"', hint: 'netsh wlan connect name="<profile>"', out: 'Connection request was completed successfully.', why: 'Connected to the hotspot.' },
     { t: 'Confirm the laptop got an address from the phone.', accept: [/^ipconfig$/i, /^ipconfig \/all$/i], show: 'ipconfig', hint: 'ipconfig', out: 'Wireless LAN adapter Wi-Fi:\n   IPv4 Address. . . . . . . . . . . : 172.20.10.4\n   Subnet Mask . . . . . . . . . . . : 255.255.255.240\n   Default Gateway . . . . . . . . . : 172.20.10.1', ask: { q: 'Which device is the default gateway 172.20.10.1?', accept: ['the phone', 'phone', 'iphone', 'the iphone'], why: 'iPhone hotspots hand out 172.20.10.x and the phone is the gateway. Remind the user: this uses her cellular data plan — large syncs and updates can hit the data cap.' }, why: 'Verify, then warn about data use.' },
     { t: 'Mark the connection as metered so Windows does not download big updates over the hotspot.', accept: [/^netsh wlan set profileparameter name="?dana-iphone"? cost=fixed$/i], show: 'netsh wlan set profileparameter name="Dana-iPhone" cost=Fixed', hint: 'netsh wlan set profileparameter name="<profile>" cost=Fixed', out: 'Profile "Dana-iPhone" on interface "Wi-Fi" updated successfully.', why: 'Metered = Windows Update and OneDrive hold back large transfers. Protects the data cap.' }],
    'Hotspot ticket: radio on → network visible → connect → verify address → protect the data cap.',
    ['netsh wlan show interfaces / show networks / connect / set profileparameter cost=Fixed.']);
  O('c1-bt-order', 'Pair a Bluetooth headset', 'Bluetooth pairing steps',
    'Put the steps in the order CompTIA lists them.',
    [['Enable Bluetooth on the phone or laptop', 'Turn the radio on.'],
     ['Put the headset in pairing mode (enable pairing)', 'Usually hold the power button until the light flashes.'],
     ['Find the device for pairing in the Bluetooth list', 'Select it by name.'],
     ['Enter the appropriate PIN code (or confirm the code shown)', 'Often 0000 or a matching number on both screens.'],
     ['Test connectivity — play audio and make a test call', 'Paired is not the same as working.']],
    'Enable → pairing mode → find → PIN → test.');
  T('c1-mdm', 'Is this phone managed, and why won\'t mail sync?', 'Android Debug Bridge on a support PC',
    'Ticket: a sales rep\'s company Android phone has stopped syncing mail and calendar while traveling. The phone is connected by USB with USB debugging authorized for this ticket. Command Prompt in the platform-tools folder.',
    { shell: 'cmd', prompt: 'C:\\platform-tools>' },
    [{ t: 'Confirm the phone is connected.', accept: [/^adb devices$/i], show: 'adb devices', hint: 'adb devices', out: 'List of devices attached\nRF8T30ABC12    device', why: 'Connected and authorized.' },
     { t: 'Find out who manages the device (MDM owner).', accept: [/^adb shell dpm list-owners$/i], show: 'adb shell dpm list-owners', hint: 'adb shell dpm list-owners', out: 'Device Owner: admin=com.microsoft.windowsintune.companyportal/...DeviceAdminReceiver,name=Intune', ask: { q: 'Is this a corporate-owned (Device Owner) or BYOD (Profile Owner / work profile) device?', accept: ['corporate', 'corporate-owned', 'corporate owned', 'device owner'], why: 'Device Owner = fully managed, corporate-owned. BYOD phones show a Profile Owner (work profile only), so IT manages only the work apps and data.' }, why: 'MDM device configuration: corporate vs BYOD.' },
     { t: 'Check that the corporate mail app pushed by policy is installed.', accept: [/^adb shell pm list packages com\.microsoft\.office\.outlook$/i, /^adb shell pm list packages (-3 )?outlook$/i], show: 'adb shell pm list packages com.microsoft.office.outlook', hint: 'adb shell pm list packages <package name>', out: 'package:com.microsoft.office.outlook', why: 'Corporate application is present (MDM pushed it).' },
     { t: 'Check whether Data Saver is restricting background data.', accept: [/^adb shell cmd netpolicy get restrict-background$/i], show: 'adb shell cmd netpolicy get restrict-background', hint: 'adb shell cmd netpolicy get restrict-background', out: 'Restrict background data: enabled', ask: { q: 'Can Outlook sync mail and calendar in the background right now? (yes/no)', accept: ['no'], why: 'The rep turned on Data Saver after a data-cap warning, so background sync stopped. Exempt the mail app, or sync on Wi-Fi.' }, why: 'Data caps change sync behavior.' },
     { t: 'Allow the mail app to use background data even with Data Saver on (find its UID first: it is 10234).', accept: [/^adb shell cmd netpolicy add restrict-background-whitelist 10234$/i], show: 'adb shell cmd netpolicy add restrict-background-whitelist 10234', hint: 'adb shell cmd netpolicy add restrict-background-whitelist <uid>', out: '', why: 'Mail, calendar and contacts sync again; other apps stay restricted to protect the data cap. Document it in the ticket.' }],
    'Corporate phone sync ticket: who manages it (corporate vs BYOD) → corporate app present → what is blocking sync (data saver, cap, account) → targeted fix.',
    ['dpm list-owners shows the MDM; netpolicy shows data saver.']);
  M('c1-mobnet-wrap', 'Mobile support desk', 'Combined 1.3',
    'Pick the best answer.', ['Enable cellular data / check 5G-4G setting', 'Activate the eSIM', 'Turn on the hotspot', 'Re-pair Bluetooth and enter the PIN', 'Enable GPS / location services', 'Cellular location (no GPS fix)', 'Enroll in MDM (corporate)', 'BYOD work profile', 'Check the data cap / sync on Wi-Fi'],
    [['Phone shows Wi-Fi only; mobile data toggle is off', 'Enable cellular data / check 5G-4G setting', 'Wireless/cellular data network.'],
     ['New phone with no physical SIM slot needs the carrier plan', 'Activate the eSIM', 'Embedded SIM via QR code or carrier app.'],
     ['Share the phone\'s connection with a tablet', 'Turn on the hotspot', 'Hotspot.'],
     ['Car audio asks for a code', 'Re-pair Bluetooth and enter the PIN', 'Pairing.'],
     ['Navigation app cannot find the user\'s position outdoors', 'Enable GPS / location services', 'Location services.'],
     ['Location is approximate (a few hundred meters) indoors', 'Cellular location (no GPS fix)', 'Cell-tower location is coarser.'],
     ['A company-purchased phone must be fully controlled by IT', 'Enroll in MDM (corporate)', 'Device configuration.'],
     ['Employee\'s personal phone needs work email, but IT must not see personal data', 'BYOD work profile', 'Separates work data.'],
     ['Calendar and contacts stopped syncing near the end of the month', 'Check the data cap / sync on Wi-Fi', 'Data caps.']],
    'Connectivity, location, management and sync — the four things a mobile tech configures every day.');

  RK.add({ track: TR, id: '1.3', dom: 1, short: 'Mobile networking & app support', title: 'Given a scenario, configure basic mobile device network connectivity and provide application support',
    goal: 'Configure cellular, Wi-Fi, hotspot, SIM/eSIM, Bluetooth and location services; support MDM-managed devices and mail/calendar/contacts/cloud synchronization.',
    kw: /\b(3g|4g|5g|lte|cellular|sim\b|esim|airplane|pair(ing)?|pin code|gps|location services|mdm|mobile device management|byod|sync(hroniz)?|data cap|activesync|exchange|calendar|contacts|corporate (app|email))/,
    parts: [
      P('Cellular, Wi-Fi, hotspot and SIM', 'Enable and disable cellular data (3G/4G/5G), Wi-Fi and hotspot, and set up SIM/eSIM service.',
        `<ul><li><b>Wireless/cellular data network (enable/disable)</b> — Settings → Mobile/Cellular data. Turn off to save the data plan; airplane mode turns off all radios (Wi-Fi and Bluetooth can then be turned back on).</li>
<li><b>3G / 4G / 5G</b> — cellular generations. <b>3G</b> networks are mostly shut down; <b>4G LTE</b> is the baseline; <b>5G</b> is faster with lower latency but drains more battery. Phones can be set to prefer LTE to save power.</li>
<li><b>Hotspot</b> — share cellular data over Wi-Fi; set a strong WPA2/WPA3 password and remember it uses the data plan.</li>
<li><b>Wi-Fi</b> — prefer Wi-Fi for big downloads; forget and rejoin when a password changes.</li>
<li><b>SIM / eSIM</b> — the SIM identifies the subscriber to the carrier. A physical SIM card moves between phones; an <b>eSIM</b> is built in and activated by QR code or carrier app. A phone can often use both (dual SIM: work + personal line).</li></ul>` + pro('When a laptop on a phone hotspot is slow or eats data, set the connection to metered so updates and cloud sync wait for Wi-Fi.') + trap('"No service" after a phone swap usually means the SIM or eSIM was not moved or activated, not a hardware fault.'),
        [['What is an eSIM?', 'An embedded SIM activated by QR code or carrier app', ['A removable SIM card', 'A Wi-Fi password', 'A Bluetooth PIN'], 'Built in.'],
         ['Which setting stops all wireless radios at once?', 'Airplane mode', ['Hotspot', 'Data saver', 'Location services'], 'All radios off.']],
        'c1-tether'),
      P('Bluetooth pairing and location services', 'Pair Bluetooth devices step by step and configure GPS and cellular location services.',
        `<p><b>Bluetooth pairing</b> (CompTIA\'s steps, in order):</p>
<ol><li><b>Enable Bluetooth</b> on the phone/laptop.</li>
<li><b>Enable pairing</b> on the accessory (pairing mode, usually a flashing light).</li>
<li><b>Find a device for pairing</b> in the list.</li>
<li><b>Enter the appropriate PIN code</b> (or confirm matching numbers).</li>
<li><b>Test connectivity</b> — play audio, type on the keyboard, make a call.</li></ol>
<p><b>Location services</b>:</p>
<ul><li><b>GPS services</b> — satellite positioning, accurate to a few meters outdoors; needs a clear sky view.</li>
<li><b>Cellular location services</b> — position estimated from cell towers (and Wi-Fi networks); works indoors but is less accurate.</li></ul>
<p>Location can be turned off globally or per app (Always / While using / Never). MDM can require it for lost-device tracking.</p>` + pro('Most "Bluetooth will not connect" tickets are an old pairing. Forget the device on both sides, then pair again from step 1.') + trap('GPS works without cellular service (it only receives satellite signals), but it struggles indoors. Cellular location works indoors but is less precise.'),
        [['What is the last step in pairing a Bluetooth device?', 'Test connectivity', ['Enable Bluetooth', 'Enter the PIN', 'Find the device'], 'Verify it works.'],
         ['Which location method is most accurate outdoors?', 'GPS', ['Cell-tower location', 'IP geolocation', 'Bluetooth'], 'Satellites.']],
        'c1-bt-order'),
      P('MDM and synchronization', 'Support MDM-managed corporate and BYOD devices and keep mail, calendar, contacts and cloud storage in sync.',
        `<p><b>Mobile device management (MDM)</b> — e.g. Microsoft Intune, Jamf, Workspace ONE.</p>
<ul><li><b>Device configurations</b>: <b>corporate</b>-owned devices are fully managed (IT can wipe the whole phone); <b>BYOD</b> (bring your own device) uses a work profile/container so IT manages only work apps and data.</li>
<li><b>Policy enforcement</b> — passcode, encryption, OS version, no jailbreak/root, remote wipe, Wi-Fi/VPN profiles.</li>
<li><b>Corporate applications</b> — pushed or offered in a company portal; can be removed when the user leaves.</li></ul>
<p><b>Mobile device synchronization</b>:</p>
<ul><li><b>Business applications</b> — <b>mail</b> (Exchange/Microsoft 365, Gmail), <b>calendar</b> and <b>contacts</b> sync with the server; <b>cloud storage</b> (OneDrive, Google Drive, iCloud) syncs files.</li>
<li><b>Recognizing data caps</b> — sync over cellular uses the plan; Data Saver/Low Data Mode or a reached cap stops background sync. Sync large files on Wi-Fi.</li></ul>` + pro('When one user\'s phone stops syncing mail, check in this order: the account password (changed recently?), the MDM compliance status, then data saver/low data mode.') + trap('BYOD does not give IT control of the whole phone — a selective (work-profile) wipe, not a full wipe, is the normal action when a BYOD user leaves.'),
        [['Which ownership model keeps work data in a separate profile on a personal phone?', 'BYOD', ['Corporate-owned, fully managed', 'Kiosk mode', 'Jailbreak'], 'Work profile.'],
         ['Calendar sync stopped after the user turned on Data Saver. Why?', 'Background data is restricted', ['The GPS is off', 'Bluetooth is off', 'The SIM is missing'], 'Data saver blocks background sync.']],
        'c1-mdm')
    ],
    wrap: { recap: ['Enable/disable cellular data; 3G (retiring), 4G LTE, 5G; airplane mode turns off all radios.', 'Hotspot shares data over Wi-Fi (uses the plan); SIM vs eSIM (QR/carrier activation).', 'Bluetooth: enable → pairing mode → find device → PIN → test connectivity.', 'GPS (accurate outdoors) vs cellular location (indoors, coarser); per-app location permissions.', 'MDM: corporate (full control) vs BYOD (work profile); policy enforcement; corporate applications.', 'Sync mail, calendar, contacts and cloud storage; data caps and data saver stop background sync.'], lab: 'c1-mobnet-wrap' }
  });

  // ===================== Domain 1 combined lab =====================
  T('c1-d1-wrap', 'Domain 1 shift: a road warrior\'s laptop', 'Mobile hardware + connectivity in one ticket',
    'Ticket: "My laptop dies by lunch, my headset won\'t connect, and I\'m on my phone\'s hotspot." Elevated PowerShell. Each task names its objective; no command hints in the tasks.',
    { shell: 'ps', prompt: 'PS C:\\Windows\\system32>' },
    [{ t: '<b>1.1</b> — Generate the battery health report.', accept: [/^powercfg \/batteryreport( \/output .+)?$/i], show: 'powercfg /batteryreport', hint: '1.1 — powercfg', out: 'Battery life report saved to file path C:\\Windows\\system32\\battery-report.html.\n  DESIGN CAPACITY 52,000 mWh · FULL CHARGE CAPACITY 46,800 mWh · CYCLE COUNT 210', ask: { q: 'Is the battery worn out? (yes/no)', accept: ['no'], why: '46,800 ÷ 52,000 = 90% — healthy. Short runtime is something else: check what is using power.' }, why: 'Evidence rules out the battery.' },
     { t: '<b>1.1</b> — See which processes use the most CPU (a busy CPU drains the battery).', accept: [/^get-process \| sort(-object)? (-property )?cpu -descending \| select(-object)? -first 5$/i, /^gps \| sort cpu -desc(ending)? \| select -first 5$/i], show: 'Get-Process | Sort-Object CPU -Descending | Select-Object -First 5', hint: '1.1 — Get-Process sorted by CPU', out: 'ProcessName  CPU(s)\n-----------  ------\nOneDrive     5120.4\nmsedge        602.1\nTeams         410.9', why: 'OneDrive is syncing nonstop over the hotspot — draining battery and data.' },
     { t: '<b>1.3</b> — Mark the hotspot ("Sam-Pixel") connection as metered so sync pauses.', accept: [/^netsh wlan set profileparameter name="?sam-pixel"? cost=fixed$/i], show: 'netsh wlan set profileparameter name="Sam-Pixel" cost=Fixed', hint: '1.3 — netsh wlan set profileparameter … cost=Fixed', out: 'Profile "Sam-Pixel" on interface "Wi-Fi" updated successfully.', why: 'OneDrive pauses on metered networks: battery and data cap protected.' },
     { t: '<b>1.2/1.3</b> — List the Bluetooth devices Windows knows about and their status.', accept: [/^get-pnpdevice -class bluetooth( \| select(-object)? .+)?$/i], show: 'Get-PnpDevice -Class Bluetooth', hint: '1.2 — Get-PnpDevice -Class Bluetooth', out: 'Status  Class      FriendlyName\n------  -----      ------------\nOK      Bluetooth  Intel(R) Wireless Bluetooth(R)\nError   Bluetooth  Jabra Evolve2 65\nOK      Bluetooth  Logitech MX Keys', ask: { q: 'Which device is in an Error state?', accept: ['jabra evolve2 65', 'jabra', 'jabra evolve2'], why: 'The headset pairing is broken. Remove it, put the headset in pairing mode, pair again, test a call.' }, why: 'Broken pairing.' },
     { t: '<b>1.3</b> — Remove the broken headset pairing so it can be paired fresh (its instance ID is BTHENUM\\JABRA01).', accept: [/^pnputil \/remove-device "?bthenum\\jabra01"?$/i], show: 'pnputil /remove-device "BTHENUM\\JABRA01"', hint: '1.3 — pnputil /remove-device "<instance id>"', out: 'Device removed successfully.', why: 'Now: enable pairing on the headset → find it → confirm PIN → test connectivity.' }],
    'Domain 1 in one ticket: monitor hardware (1.1), connectivity and accessories (1.2), hotspot and pairing (1.3).',
    ['Each task names its objective.']);

  // ---------- extra questions + cards ----------
  RK.extra(TR, '1.1', [
    ['What is the first step before replacing any internal laptop component?', 'Back up data, power off, unplug and disconnect the battery', ['Remove the keyboard', 'Update the BIOS', 'Format the drive'], 'Safety and data first.'],
    ['A new SODIMM is not detected. What should you check first?', 'That it matches the DDR generation and is fully seated', ['The battery report', 'The Wi-Fi antenna', 'The webcam driver'], 'Type and seating.'],
    ['Where is the fingerprint reader often built into modern laptops?', 'The power button', ['The battery', 'The SSD', 'The Wi-Fi card'], 'Biometrics.'],
    ['What does a falling "full charge capacity" in the battery report show?', 'The battery is wearing out', ['The charger is faulty', 'Windows is corrupt', 'RAM is failing'], 'Capacity loss.'],
    ['Why organize laptop screws by location during disassembly?', 'Screws of different lengths can damage the board if put in the wrong hole', ['To pass ESD tests', 'To void the warranty', 'To speed up the battery'], 'Long screws can puncture parts.'],
    ['Which form factor do modern laptop SSDs most often use?', 'M.2', ['3.5-inch', 'DIMM', 'PCI'], 'M.2 2280.'],
    ['A laptop has soldered RAM. What is the upgrade option?', 'None — memory cannot be upgraded; replace the laptop or choose a model with slots', ['Add a SODIMM', 'Add a DIMM', 'Use a wireless card'], 'Soldered memory.'],
    ['After replacing a laptop keyboard, which item should you test before closing the ticket?', 'Every key, the trackpad and the backlight', ['Only the power button', 'Only Wi-Fi', 'Nothing'], 'Verify full function.']
  ]);
  RK.extra(TR, '1.2', [
    ['Which connector is reversible and carries data, power and video?', 'USB-C', ['microUSB', 'miniUSB', 'VGA'], 'USB-C.'],
    ['Which connection has the shortest range?', 'NFC', ['Bluetooth', 'Wi-Fi', 'Cellular'], 'A few centimeters.'],
    ['What is the main difference between a docking station and a port replicator?', 'A dock adds capabilities like extra video and charging; a replicator only copies ports', ['They are identical', 'A replicator adds a GPU', 'A dock only works with phones'], 'Capability.'],
    ['Which accessory supports pressure-sensitive drawing next to a keyboard?', 'Drawing pad', ['Track point', 'Port replicator', 'Speaker'], 'Graphics tablet.'],
    ['Sharing a phone\'s data with one laptop over a USB cable is called:', 'Tethering', ['Hotspot', 'NFC', 'Pairing'], 'Wired sharing.'],
    ['Which wireless technology creates a personal area network for headsets?', 'Bluetooth', ['NFC', 'Cellular', 'RFID'], 'PAN.'],
    ['A USB-C monitor stays black though the laptop charges from the same cable. Likely cause?', 'The cable or port does not support video (alt mode)', ['Bad battery', 'Bluetooth off', 'Wrong SIM'], 'Not all USB-C supports video.'],
    ['Which older Apple connector is reversible with 8 pins?', 'Lightning', ['microUSB', 'miniUSB', 'USB-B'], 'Lightning.']
  ]);
  RK.extra(TR, '1.3', [
    ['How is an eSIM usually activated?', 'By scanning a carrier QR code or using the carrier app', ['By inserting a card', 'By pairing over Bluetooth', 'Through the BIOS'], 'Embedded SIM.'],
    ['Which MDM action is normal when a BYOD employee leaves?', 'Selective wipe of the work profile', ['Full factory wipe of the personal phone', 'Jailbreak it', 'Disable GPS permanently'], 'Work data only.'],
    ['What does MDM policy enforcement commonly require?', 'Passcode, encryption and a minimum OS version', ['A specific wallpaper', 'Bluetooth always on', 'Unlimited data'], 'Compliance.'],
    ['Why might location be accurate outdoors but poor indoors?', 'GPS needs a clear view of the sky; indoors the phone falls back to cellular/Wi-Fi location', ['Bluetooth is off', 'The SIM is missing', 'Hotspot is on'], 'GPS vs cellular.'],
    ['A user\'s mail stops syncing right after a password change. First fix?', 'Update the account password on the phone', ['Replace the battery', 'Turn on GPS', 'Reset the eSIM'], 'Credentials.'],
    ['Which is the correct first Bluetooth pairing step?', 'Enable Bluetooth', ['Enter the PIN', 'Test connectivity', 'Find the device'], 'Radio on first.'],
    ['Why set a laptop\'s hotspot connection to metered?', 'To stop large updates and syncs using the cellular data cap', ['To increase speed', 'To enable GPS', 'To pair Bluetooth'], 'Data caps.'],
    ['Which cellular generation is mostly shut down by carriers?', '3G', ['4G LTE', '5G', 'Wi-Fi 6'], 'Retired networks.']
  ]);
  RK.cards(TR, '1.1', [['powercfg /batteryreport', 'Battery design vs full-charge capacity and cycle count.'], ['SODIMM', 'Laptop memory module.'], ['M.2 SATA vs NVMe', 'Same slot shape, different interface — check support.'], ['Antenna leads', 'Run up the display lid; check after screen work.'], ['Swollen battery', 'Stop use, do not puncture, replace and recycle.']]);
  RK.cards(TR, '1.2', [['USB-C', 'Reversible; data, power (PD) and video.'], ['Lightning', 'Apple 8-pin, iPhone 5–14.'], ['Tethering vs hotspot', 'USB/Bluetooth to one device vs Wi-Fi to many.'], ['Dock vs port replicator', 'Adds capability vs duplicates ports.']]);
  RK.cards(TR, '1.3', [['eSIM', 'Embedded SIM activated by QR/carrier app.'], ['Bluetooth pairing', 'Enable → pairing mode → find → PIN → test.'], ['GPS vs cellular location', 'Satellites (accurate, outdoors) vs towers (indoors, coarse).'], ['Corporate vs BYOD', 'Fully managed vs work profile only.'], ['Data saver', 'Stops background sync to protect the data cap.']]);
})();
