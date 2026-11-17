/* A+ Core 1 (220-1201) — Domain 5.0 Hardware and Network Troubleshooting — 5.4 to 5.6 + domain wrap lab + extras */
(function () {
  var RK = window.RK, P = RK.P, M = RK.M, O = RK.O, T = RK.T, TR = 'core1';
  function pro(t) { return '<div class="callout pro"><b class="k">On the job</b>' + t + '</div>'; }
  function trap(t) { return '<div class="callout trap"><b class="k">Exam trap</b>' + t + '</div>'; }

  // ===================== 5.4 Mobile device issues =====================
  T('c1-mobts', 'A hot, slow phone that will not install apps', 'Diagnose an Android phone with adb',
    'Ticket: a company Android phone gets hot, the battery dies by noon, it is slow, and new apps fail to install. USB debugging is authorized for this ticket. Command Prompt in platform-tools.',
    { shell: 'cmd', prompt: 'C:\\platform-tools>' },
    [{ t: 'Read the battery status, health and temperature.', accept: [/^adb shell dumpsys battery$/i], show: 'adb shell dumpsys battery', hint: 'adb shell dumpsys battery', out: 'Current Battery Service state:\n  AC powered: false\n  USB powered: true\n  status: 2\n  health: 2\n  level: 41\n  voltage: 3790\n  temperature: 468', ask: { q: 'Temperature is in tenths of °C. How hot is the battery? (°C, number)', accept: ['46.8', '47', '46'], why: '46.8 °C is hot for a phone at rest — something is working it hard. Health 2 = "good", so the battery itself is not worn or swollen yet.' }, why: 'Overheating + poor battery life symptoms.' },
     { t: 'Check free space on the data partition.', accept: [/^adb shell df( -h)? \/data$/i], show: 'adb shell df -h /data', hint: 'adb shell df -h /data', out: 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/block/dm-6 110G  109G  0.9G  99% /data', ask: { q: 'What percent of storage is used?', accept: ['99', '99%'], why: 'Unable to install new applications: storage is full. Updates need several GB free; full storage also makes the phone slow.' }, why: 'Storage → install failures and degraded performance.' },
     { t: 'List third-party apps to look for anything unexpected.', accept: [/^adb shell pm list packages -3$/i], show: 'adb shell pm list packages -3', hint: 'adb shell pm list packages -3', out: 'package:com.microsoft.office.outlook\npackage:com.microsoft.teams\npackage:com.fast.cleaner.boost.pro\npackage:com.whatsapp', ask: { q: 'Which package looks like adware/malware?', accept: ['com.fast.cleaner.boost.pro'], why: '"Cleaner/booster" apps from outside the store commonly run ads and miners in the background — heat, battery drain, data use.' }, why: 'Malware symptom: heat + drain + slowness.' },
     { t: 'Remove that app.', accept: [/^adb uninstall com\.fast\.cleaner\.boost\.pro$/i], show: 'adb uninstall com.fast.cleaner.boost.pro', hint: 'adb uninstall <package>', out: 'Success', why: 'Removed. Then have the user clear old videos/photos to cloud storage, and update the OS. Check MDM compliance.' }],
    'Mobile hardware tickets: battery health + temperature, storage, apps (malware), then physical checks (ports, screen, liquid indicators).',
    ['adb shell dumpsys battery, df -h /data, pm list packages -3, adb uninstall.']);
  M('c1-mobsym', 'Mobile symptom → cause/fix', 'Battery, screen, charging, connectivity, liquid, digitizer, ports',
    'Pick the most likely cause or fix.', ['Replace the battery', 'Stop using it — swollen battery', 'Replace the screen/digitizer assembly', 'Check cable, charger and port debris', 'Toggle radios / reset network settings', 'Liquid damage — power off, do not charge', 'Remove case/cover, check for heavy apps', 'Calibrate touch / update OS', 'Replace the damaged port', 'Free up storage', 'Charge or pair the stylus', 'Remove malware / suspicious apps'],
    [['Phone dies at 40% and battery health reads 68%', 'Replace the battery', 'Poor battery health.'], ['Back cover is bulging and the screen is lifting', 'Stop using it — swollen battery', 'Fire risk.'], ['Cracked glass and touches do nothing in one area', 'Replace the screen/digitizer assembly', 'Broken screen/digitizer.'], ['Charges only when the cable is held at an angle', 'Check cable, charger and port debris', 'Improper charging — lint in port is common.'], ['Wi-Fi and Bluetooth connect poorly after an update', 'Toggle radios / reset network settings', 'Poor/no connectivity.'], ['Phone was dropped in a pool and the liquid indicator is red', 'Liquid damage — power off, do not charge', 'Liquid damage.'], ['Phone hot in a thick case while gaming and charging', 'Remove case/cover, check for heavy apps', 'Overheating.'], ['Cursor drifts and taps land in the wrong spot', 'Calibrate touch / update OS', 'Cursor drift/touch calibration.'], ['USB-C port is physically cracked and loose', 'Replace the damaged port', 'Physically damaged port.'], ['"Not enough space" when installing apps', 'Free up storage', 'Unable to install new applications.'], ['Stylus draws nothing on a tablet', 'Charge or pair the stylus', 'Active stylus needs power/pairing.'], ['Pop-up ads, heat and data use from an unknown "booster" app', 'Remove malware / suspicious apps', 'Malware.']],
    'Physical (battery, screen, port, liquid) vs software (storage, malware, settings) — classify first.');
  M('c1-mob-ts-wrap', 'Mobile repair bench', 'Combined 5.4',
    'Pick the best first action.', ['Power off; do not charge; dry and inspect', 'Replace battery under warranty', 'Clean the charging port', 'Recalibrate / update the OS', 'Delete unused apps and media', 'Remove the malicious app', 'Replace the digitizer'],
    [['Phone fell in water five minutes ago and is still on', 'Power off; do not charge; dry and inspect', 'Liquid damage.'], ['Year-old phone: battery health 72%', 'Replace battery under warranty', 'Poor battery health.'], ['Charges intermittently; lint visible in the port', 'Clean the charging port', 'Improper charging.'], ['Touches register slightly off after a screen protector was added', 'Recalibrate / update the OS', 'Touch calibration.'], ['Phone lags and updates fail with 200 MB free', 'Delete unused apps and media', 'Storage.'], ['Battery drains and ads appear on the lock screen', 'Remove the malicious app', 'Malware.'], ['Display works but touch is dead in one band', 'Replace the digitizer', 'Digitizer issue.']],
    'Safety first (swollen battery, liquid), then the cheapest likely fix.');

  RK.add({ track: TR, id: '5.4', dom: 5, short: 'Mobile device issues', title: 'Given a scenario, troubleshoot common mobile device issues',
    goal: 'Diagnose battery health, swollen batteries, broken screens, charging, connectivity, liquid damage, overheating, digitizer, ports, malware, touch drift, app installs, stylus and performance problems.',
    kw: /\b(battery health|swollen|broken screen|cracked|charging|liquid|water damage|overheat|digitizer|port damage|charging port|malware|cursor drift|touch calibration|unable to install|stylus|degraded performance|phone (slow|hot))/,
    parts: [
      P('Power, heat and performance', 'Troubleshoot poor battery health, swollen batteries, improper charging, overheating, malware, app install failures and degraded performance.',
        `<table><tr><th>Symptom</th><th>Likely cause</th><th>Fix</th></tr>
<tr><td><b>Poor battery health</b></td><td>Worn battery (cycles, age, heat)</td><td>Check battery health; replace.</td></tr>
<tr><td><b>Swollen battery</b></td><td>Failing Li-ion cell</td><td>Stop using, do not charge or puncture; replace; recycle properly.</td></tr>
<tr><td><b>Improper charging</b></td><td>Cable, charger wattage, lint in port, damaged port, battery</td><td>Swap cable/charger, clean port with a non-metal tool.</td></tr>
<tr><td><b>Overheating</b></td><td>Heavy apps, charging + gaming, thick case, sun, malware</td><td>Close apps, remove case, cool down, check battery usage.</td></tr>
<tr><td><b>Malware</b></td><td>Sideloaded or fake apps</td><td>Remove the app, update OS, scan; factory reset if needed.</td></tr>
<tr><td><b>Unable to install new applications</b></td><td>Storage full, OS too old, MDM policy, account</td><td>Free space, update, check MDM.</td></tr>
<tr><td><b>Degraded performance</b></td><td>Low storage, background apps, old OS, heat, worn battery throttling</td><td>Restart, free space, update, replace battery.</td></tr></table>` + pro('On phones, a worn battery can make the whole device slow — iOS and Android throttle the CPU to avoid sudden shutdowns. A battery replacement often "fixes" performance.') + trap('Never charge or puncture a swollen battery. "Pressing it back in" is a fire risk.'),
        [['A phone cannot install apps and shows 99% storage used. Fix?', 'Free up storage', ['Replace the screen', 'Re-pair Bluetooth', 'Calibrate touch'], 'Storage.'],
         ['A phone only charges with the cable at an angle. First check?', 'Clean lint from the port and try another cable', ['Factory reset', 'Replace the battery immediately', 'Update the OS'], 'Improper charging.']],
        'c1-mobts'),
      P('Screens, ports, connectivity and liquid', 'Troubleshoot broken screens, digitizer issues, cursor drift, stylus problems, damaged ports, poor connectivity and liquid damage.',
        `<ul><li><b>Broken screen</b> — glass, display and digitizer are often one assembly; replace the assembly. Back up first.</li>
<li><b>Digitizer issues</b> — touches ignored in an area, or "ghost" touches; screen protector, moisture, damage. Replace the digitizer/screen.</li>
<li><b>Cursor drift/touch calibration</b> — taps land in the wrong place or the pointer wanders (laptop trackpads too): clean the screen, remove a bad protector, update/calibrate, check drivers.</li>
<li><b>Stylus does not work</b> — active stylus needs charge/pairing; wrong stylus model; passive stylus needs a capacitive tip.</li>
<li><b>Physically damaged ports</b> — loose, bent, cracked: replace the port (often a daughterboard); use wireless charging meanwhile.</li>
<li><b>Poor/no connectivity</b> — toggle airplane mode, restart, forget/rejoin Wi-Fi, re-pair Bluetooth, reset network settings, check SIM/eSIM and carrier.</li>
<li><b>Liquid damage</b> — power off immediately, do not charge, remove case/SIM, dry; check liquid contact indicators; corrosion can appear days later.</li></ul>` + pro('Check the liquid contact indicator (usually in the SIM tray) before quoting a repair — liquid damage typically voids the warranty.') + trap('Rice does not fix a wet phone. Power off, do not charge, and let it dry with airflow — then test.'),
        [['Touches register in the wrong place but the display looks fine. Which part?', 'Digitizer (touch calibration)', ['Battery', 'SIM card', 'Speaker'], 'Touch layer.'],
         ['What should you do first with a phone that fell in water?', 'Power it off and do not charge it', ['Charge it to test', 'Put it in rice and charge', 'Run a speed test'], 'Prevent shorts.']],
        'c1-mobsym')
    ],
    wrap: { recap: ['Battery: health %, replace when worn; swollen = stop, do not charge, replace.', 'Improper charging: cable, charger, lint in port, damaged port.', 'Overheating: heavy apps, case, charging; malware → remove app, update, reset if needed.', 'Unable to install apps / degraded performance: storage, OS version, MDM, battery throttling.', 'Broken screen/digitizer, cursor drift, stylus (charge/pair), damaged ports.', 'Connectivity: radios, network reset, SIM. Liquid: power off, no charging, indicators.'], lab: 'c1-mob-ts-wrap' }
  });

  // ===================== 5.5 Network issues =====================
  T('c1-netts', 'Choppy calls and slow Wi-Fi', 'Measure latency, jitter and signal',
    'Ticket: "Teams calls are robotic and the Internet is slow at my desk, but fine in the break room." Command Prompt on the user\'s laptop.',
    { shell: 'cmd', prompt: 'C:\\Users\\kpatel>' },
    [{ t: 'Check the Wi-Fi signal and link rate.', accept: [/^netsh wlan show interfaces?$/i], show: 'netsh wlan show interfaces', hint: 'netsh wlan show interfaces', out: '    Band                   : 2.4 GHz\n    Channel                : 6\n    Receive rate (Mbps)    : 26\n    Signal                 : 31%', ask: { q: 'What is the signal strength (%)?', accept: ['31', '31%'], why: 'Weak signal at the desk — far from the AP or blocked (concrete, metal, a microwave on 2.4 GHz). That causes intermittent wireless connectivity and slow speeds.' }, why: 'Signal first.' },
     { t: 'Send 20 pings to the gateway (10.4.0.1) to measure latency and loss on the local link.', accept: [/^ping -n 20 10\.4\.0\.1$/i, /^ping 10\.4\.0\.1 -n 20$/i], show: 'ping -n 20 10.4.0.1', hint: 'ping -n 20 <gateway>', out: 'Reply from 10.4.0.1: time=3ms\nReply from 10.4.0.1: time=148ms\nRequest timed out.\nReply from 10.4.0.1: time=9ms\nReply from 10.4.0.1: time=211ms\n…\nPackets: Sent = 20, Received = 17, Lost = 3 (15% loss),\nMinimum = 3ms, Maximum = 211ms, Average = 64ms', ask: { q: 'What percent packet loss is there to the gateway?', accept: ['15', '15%'], why: 'Loss + wildly varying times (3 → 211 ms) = high latency and jitter on the Wi-Fi hop itself. Voice needs under ~30 ms jitter and under 1% loss.' }, why: 'Latency and jitter cause poor VoIP quality.' },
     { t: 'Trace the full path to the Teams service with per-hop loss statistics.', accept: [/^pathping( -n)? teams\.microsoft\.com$/i], show: 'pathping teams.microsoft.com', hint: 'pathping <host> (traceroute + per-hop loss)', out: 'Computing statistics for 50 seconds...\nHop  RTT    Source to Here   Node\n  0                           kpatel-lt [10.4.0.57]\n  1  71ms    15/ 100 = 15%    10.4.0.1\n  2   9ms     0/ 100 =  0%    203.0.113.1\n  3  12ms     0/ 100 =  0%    teams edge', ask: { q: 'At which hop does the loss start? (number)', accept: ['1'], why: 'Loss only at hop 1 (the wireless link to the AP); the ISP path is clean. The fix is local wireless, not the Internet provider.' }, why: 'Isolate local vs external problems.' },
     { t: 'Look at nearby networks and channels for external interference.', accept: [/^netsh wlan show networks mode=bssid$/i], show: 'netsh wlan show networks mode=bssid', hint: 'netsh wlan show networks mode=bssid', out: 'SSID 1 : CORP         Band : 2.4 GHz  Channel : 6   Signal : 31%\nSSID 1 : CORP         Band : 5 GHz    Channel : 44  Signal : 58%\nSSID 2 : WAREHOUSE-CAM Band : 2.4 GHz Channel : 6   Signal : 80%', why: 'A strong camera network on the same 2.4 GHz channel = co-channel interference. Move the laptop to 5 GHz (58%), and ask the network team to move the camera AP or add an AP near the desk.' }],
    'Network tickets: measure (signal, latency, loss, jitter) → isolate the hop (local, ISP, service) → fix the right layer → re-measure.',
    ['netsh wlan show interfaces, ping -n, pathping, netsh wlan show networks mode=bssid.']);
  T('c1-flap', 'The port that keeps dropping', 'Port flapping on a switch',
    'Ticket: a desk PC loses its network connection every few minutes. It is on switch SW1 port Gi1/0/14. You are on the switch CLI.',
    { shell: 'ios', prompt: 'SW1#' },
    [{ t: 'Show the interface details for Gi1/0/14.', accept: [/^sh(ow)? int(erfaces?)? g(i|igabitethernet)1\/0\/14$/i], show: 'show interfaces gi1/0/14', hint: 'show interfaces <port>', out: 'GigabitEthernet1/0/14 is up, line protocol is up\n  Full-duplex, 100Mb/s, media type is 10/100/1000BaseTX\n  27 interface resets\n  Input errors 4812, CRC 4790\n  Last input 00:00:01, output 00:00:00', ask: { q: 'How many CRC errors are there?', accept: ['4790'], why: 'High CRC errors + a gigabit port running at 100 Mb/s + many resets = a bad cable or connector (a pair is damaged, so it falls back to 100 Mb/s).' }, why: 'Read the physical-layer counters.' },
     { t: 'Check the log for link up/down events on that port.', accept: [/^sh(ow)? log(ging)? \| (i|in|inc|include) (gi|gigabitethernet)?1\/0\/14$/i], show: 'show logging | include 1/0/14', hint: 'show logging | include <port>', out: '%LINK-3-UPDOWN: Interface GigabitEthernet1/0/14, changed state to down\n%LINK-3-UPDOWN: Interface GigabitEthernet1/0/14, changed state to up\n%LINK-3-UPDOWN: Interface GigabitEthernet1/0/14, changed state to down\n%LINK-3-UPDOWN: Interface GigabitEthernet1/0/14, changed state to up', why: 'Port flapping: the link goes up and down repeatedly. Replace the patch cable; test the wall run with a cable tester.' },
     { t: 'After the cable is replaced, clear the counters so you can confirm the fix.', accept: [/^clear counters( g(i|igabitethernet)1\/0\/14)?$/i], show: 'clear counters gi1/0/14', hint: 'clear counters <port>', out: 'Clear "show interface" counters on this interface [confirm]\n[OK]', why: 'Fresh counters show whether errors continue.' },
     { t: 'Check the interface again.', accept: [/^sh(ow)? int(erfaces?)? g(i|igabitethernet)1\/0\/14$/i], show: 'show interfaces gi1/0/14', hint: 'Same as step 1.', out: 'GigabitEthernet1/0/14 is up, line protocol is up\n  Full-duplex, 1000Mb/s\n  0 interface resets\n  Input errors 0, CRC 0', why: 'Gigabit, no errors, no resets. Fixed and documented.' }],
    'Port flapping / slow wired speed: interface counters (CRC, resets, speed/duplex) → logs → replace cable → clear counters → verify.',
    ['show interfaces, show logging | include, clear counters.']);
  M('c1-netsym', 'Network symptom → likely cause', 'Wireless, speed, latency, jitter, VoIP, flapping, interference, authentication',
    'Pick the most likely cause.', ['Weak signal / too far from AP', 'Bandwidth saturation', 'APIPA / DHCP problem', 'Jitter on the network', 'QoS not configured for voice', 'Bad cable (port flapping)', 'External interference', 'Wrong password / expired certificate', 'ISP or upstream outage'],
    [['Wi-Fi drops in and out in one corner of the office', 'Weak signal / too far from AP', 'Intermittent wireless connectivity.'], ['Everyone is slow at 9 a.m. when cloud backups start', 'Bandwidth saturation', 'Slow network speeds.'], ['Laptop shows "No Internet" with a 169.254 address', 'APIPA / DHCP problem', 'Limited connectivity.'], ['Ping times jump between 5 ms and 200 ms', 'Jitter on the network', 'Jitter.'], ['Calls are choppy only when large downloads run', 'QoS not configured for voice', 'Poor VoIP quality.'], ['Switch log shows a port going up and down every minute', 'Bad cable (port flapping)', 'Port flapping.'], ['Wi-Fi fails whenever the break-room microwave runs', 'External interference', '2.4 GHz interference.'], ['802.1X Wi-Fi rejects a user since the weekend', 'Wrong password / expired certificate', 'Authentication failures.'], ['All sites unreachable; ping to gateway works, beyond it fails', 'ISP or upstream outage', 'Intermittent internet connectivity.']],
    'Measure, then isolate: device, Wi-Fi/cable, LAN, ISP.');

  RK.add({ track: TR, id: '5.5', dom: 5, short: 'Network issues', title: 'Given a scenario, troubleshoot network issues',
    goal: 'Troubleshoot intermittent wireless, slow speeds, limited connectivity, jitter, poor VoIP, port flapping, high latency, interference, authentication failures and intermittent Internet.',
    kw: /\b(intermittent|slow network|limited connectivity|jitter|voip|call quality|port flap|flapping|latency|interference|authentication fail|no internet|packet loss|pathping|crc)/,
    parts: [
      P('Wireless, speed and connectivity', 'Troubleshoot intermittent wireless connectivity, slow speeds, limited connectivity, external interference, authentication failures and intermittent Internet.',
        `<table><tr><th>Symptom</th><th>Common causes</th><th>Check / fix</th></tr>
<tr><td><b>Intermittent wireless connectivity</b></td><td>Weak signal, roaming, channel overlap, power saving</td><td>Signal %, AP placement, 5 GHz, driver/power settings.</td></tr>
<tr><td><b>Slow network speeds</b></td><td>Saturation, duplex/speed mismatch, 2.4 GHz, bad cable, malware</td><td>Link speed, utilization, cable test.</td></tr>
<tr><td><b>Limited connectivity</b></td><td>APIPA (no DHCP), wrong gateway/DNS, captive portal</td><td><code>ipconfig</code>, renew, DNS test.</td></tr>
<tr><td><b>External interference</b></td><td>Microwaves, cordless phones, neighbors, Bluetooth, metal/concrete</td><td>Wi-Fi analyzer; change channel/band.</td></tr>
<tr><td><b>Authentication failures</b></td><td>Wrong/expired password, expired certificate (802.1X), wrong security type</td><td>Re-enter credentials; check RADIUS/cert dates.</td></tr>
<tr><td><b>Intermittent internet connectivity</b></td><td>ISP problems, modem/router, DNS</td><td>Ping gateway vs beyond; pathping; ISP status.</td></tr></table>` + pro('Always test from the bottom up: link light/signal → IP config → ping gateway → ping an Internet IP → resolve a name. Where it fails tells you where to look.') + trap('Limited connectivity with a 169.254 address is a DHCP problem, not a DNS problem.'),
        [['Wi-Fi drops every time the microwave is used. What is this?', 'External interference on 2.4 GHz', ['DHCP failure', 'Port flapping', 'Expired certificate'], 'Interference.'],
         ['A laptop shows limited connectivity and 169.254.x.x. Where do you look?', 'DHCP / the connection to the DHCP server', ['DNS records', 'The printer', 'The VoIP phone'], 'APIPA.']],
        'c1-netts'),
      P('Latency, jitter, VoIP and port flapping', 'Troubleshoot jitter, poor VoIP quality, high latency and port flapping.',
        `<ul><li><b>High latency</b> — long delay (ms) for each round trip: distance (satellite), congestion, overloaded devices, Wi-Fi retries. Measure with <code>ping</code>, find the hop with <code>tracert</code>/<code>pathping</code>.</li>
<li><b>Jitter</b> — variation in latency between packets. Bad for real-time traffic even when average latency is fine.</li>
<li><b>Poor VoIP quality</b> — robotic, choppy, one-way audio: jitter, packet loss, latency, no <b>QoS</b> priority for voice, busy Wi-Fi. Targets: under ~150 ms latency, under ~30 ms jitter, under 1% loss.</li>
<li><b>Port flapping</b> — a switch port repeatedly goes up and down: bad cable or connector, failing NIC, power-saving, duplex mismatch, loose patch. Switch logs and interface counters (CRC errors, resets) show it.</li></ul>
<p>Tools: <code>ping -t</code>/<code>-n</code>, <code>pathping</code> (per-hop loss), switch <code>show interfaces</code>/<code>show logging</code>, Wi-Fi analyzer, the VoIP system\'s call-quality reports.</p>` + pro('For voice complaints, ask "is it everyone or one person, and wired or Wi-Fi?". One Wi-Fi user = local signal; everyone at one time of day = bandwidth/QoS.') + trap('Jitter is the variation in delay, not the delay itself. A steady 80 ms is better for voice than 10–150 ms swinging.'),
        [['What is jitter?', 'Variation in latency between packets', ['Total bandwidth', 'Packet size', 'Signal strength'], 'Delay variation.'],
         ['A switch log shows a port going up and down repeatedly. First fix?', 'Replace and test the cable', ['Reboot the DNS server', 'Change the SSID', 'Update the printer driver'], 'Port flapping.']],
        'c1-flap')
    ],
    wrap: { recap: ['Test bottom-up: link/signal → IP → gateway → Internet IP → DNS name.', 'Intermittent wireless/slow speeds: signal, band, channel, saturation, cable, duplex.', 'Limited connectivity = APIPA/DHCP, gateway or DNS. External interference → analyzer, change channel/band.', 'Authentication failures: credentials, expired certificates, security type.', 'Latency (delay), jitter (variation), loss → poor VoIP; QoS for voice.', 'Port flapping → cable/NIC; read CRC and resets; intermittent Internet → pathping, ISP.'], lab: 'c1-netsym' }
  });

  // ===================== 5.6 Printer issues =====================
  T('c1-printts', 'Frozen print queue', 'Clear stuck jobs and restart the spooler',
    'Ticket: nobody on the second floor can print. 40 jobs are pending in the queue for "Floor2-MFD". Elevated PowerShell on print server PS01.',
    { shell: 'ps', prompt: 'PS C:\\Windows\\system32>' },
    [{ t: 'List the jobs in the Floor2-MFD queue.', accept: [/^get-printjob( -printername)? "?floor2-mfd"?( \| select(-object)? .+)?$/i], show: 'Get-PrintJob -PrinterName "Floor2-MFD" | Select-Object Id,DocumentName,UserName,JobStatus -First 3', hint: 'Get-PrintJob -PrinterName …', out: 'Id DocumentName        UserName JobStatus\n-- ------------        -------- ---------\n 4 Q3-report.pdf       mlee     Error, Printing\n 5 Invoice-2291.docx   jdoe     Spooling\n 6 Badges.xlsx         rkim     Spooling', ask: { q: 'Which job Id is stuck in an error and blocking the queue?', accept: ['4'], why: 'One corrupt job blocks everything behind it: multiple prints pending in the queue / frozen print queue.' }, why: 'Find the blocking job.' },
     { t: 'Remove the stuck job.', accept: [/^remove-printjob -printername "?floor2-mfd"? -id 4$/i, /^remove-printjob -id 4 -printername "?floor2-mfd"?$/i], show: 'Remove-PrintJob -PrinterName "Floor2-MFD" -ID 4', hint: 'Remove-PrintJob -PrinterName … -ID …', out: '', why: 'If the queue still does not move, the spooler is hung.' },
     { t: 'Stop the Print Spooler service.', accept: [/^stop-service( -name)? spooler( -force)?$/i, /^net stop spooler$/i], show: 'Stop-Service Spooler -Force', hint: 'Stop-Service Spooler', out: '', why: 'Needed before clearing leftover spool files.' },
     { t: 'Delete leftover spool files from the spool folder.', accept: [/^remove-item c:\\windows\\system32\\spool\\printers\\\*( -force)?$/i, /^del \/q c:\\windows\\system32\\spool\\printers\\\*$/i], show: 'Remove-Item C:\\Windows\\System32\\spool\\PRINTERS\\* -Force', hint: 'Remove-Item C:\\Windows\\System32\\spool\\PRINTERS\\*', out: '', why: 'Corrupt .SPL/.SHD files are what keep a queue frozen after restarts.' },
     { t: 'Start the spooler again and confirm it is running.', accept: [/^start-service( -name)? spooler( -passthru)?$/i, /^net start spooler$/i], show: 'Start-Service Spooler -PassThru', hint: 'Start-Service Spooler', out: 'Status   Name     DisplayName\n------   ----     -----------\nRunning  Spooler  Print Spooler', why: 'Queue flowing. Ask users to resend the lost jobs (the cleared ones are gone). Note: the job owner\'s PDF may be corrupt.' }],
    'Frozen queue: find the blocking job → remove → if still stuck, stop spooler → clear spool folder → start spooler → verify.',
    ['Get-PrintJob, Remove-PrintJob, Stop/Start-Service Spooler, spool\\PRINTERS.']);
  M('c1-printsym', 'Printer symptom → cause', 'Print quality, feeding, queue and hardware',
    'Pick the most likely cause.', ['Dirty/scratched drum or dirty printhead', 'Wrong driver / corrupt job', 'Paper path obstruction or worn rollers', 'Low toner / ink', 'Pickup roller worn / wrong paper', 'Separation pad worn / humid paper', 'Toner leak / dirty fuser', 'Ghosting: drum cleaning or fuser', 'Failing gears / motor', 'Finisher jam', 'Driver orientation setting', 'Tray sensor / tray settings', 'Network/IP or cable issue'],
    [['Vertical lines down every printed page', 'Dirty/scratched drum or dirty printhead', 'Lines down the page.'], ['Pages of random symbols', 'Wrong driver / corrupt job', 'Garbled print.'], ['Paper jams in the same spot every time', 'Paper path obstruction or worn rollers', 'Paper jams.'], ['Print getting lighter across the whole page', 'Low toner / ink', 'Faded prints.'], ['Printer makes noise but takes no paper', 'Pickup roller worn / wrong paper', 'Paper not feeding.'], ['Several sheets pulled through at once', 'Separation pad worn / humid paper', 'Multipage misfeed.'], ['Random black dots across the page', 'Toner leak / dirty fuser', 'Speckling.'], ['Faint copy of the image repeats lower on the page', 'Ghosting: drum cleaning or fuser', 'Double/echo images.'], ['Loud grinding when printing starts', 'Failing gears / motor', 'Grinding noise.'], ['Booklets stop with a staple error', 'Finisher jam', 'Finishing issues.'], ['Landscape document prints portrait and cut off', 'Driver orientation setting', 'Incorrect page orientation.'], ['Printer says tray 2 is missing though it is installed', 'Tray sensor / tray settings', 'Tray not recognized.'], ['Printer shows offline to everyone after a power outage', 'Network/IP or cable issue', 'Connectivity issues.']],
    'Quality → consumables/drum/fuser; feeding → rollers/pads/paper; jobs → driver/queue; offline → network.');
  M('c1-print-ts-wrap', 'Printer help desk', 'Combined 5.6',
    'Pick the best first action.', ['Clear the queue and restart the spooler', 'Install the correct driver', 'Replace the toner cartridge', 'Clean/replace pickup rollers', 'Use fresh, dry paper', 'Remove the jam and check the paper path', 'Clear the staple jam', 'Set a DHCP reservation / fix IP', 'Change orientation in the app/driver'],
    [['20 jobs pending and nothing prints', 'Clear the queue and restart the spooler', 'Frozen queue.'], ['Garbled symbols after a new PC was set up', 'Install the correct driver', 'Driver.'], ['Faded prints on a laser, toner low warning', 'Replace the toner cartridge', 'Consumable.'], ['Paper not feeding from tray 1', 'Clean/replace pickup rollers', 'Rollers.'], ['Multipage misfeeds in a humid storeroom', 'Use fresh, dry paper', 'Humidity.'], ['Paper jam light, crumpled sheet inside', 'Remove the jam and check the paper path', 'Jam.'], ['Finisher reports staple jam', 'Clear the staple jam', 'Finishing.'], ['Printer IP changed after power outage; shows offline', 'Set a DHCP reservation / fix IP', 'Connectivity.'], ['Spreadsheet prints portrait instead of landscape', 'Change orientation in the app/driver', 'Orientation.']],
    'Most printer tickets: queue, driver, consumable, rollers or network.');

  RK.add({ track: TR, id: '5.6', dom: 5, short: 'Printer issues', title: 'Given a scenario, troubleshoot printer issues',
    goal: 'Troubleshoot print quality, feeding, jams, queue, noise, finishing, orientation, tray and connectivity problems.',
    kw: /\b(lines down|garbled|paper jam|faded|not feeding|misfeed|print queue|pending|speckl|double image|echo|ghost|grinding|staple|hole punch|finishing|orientation|tray not recognized|printer offline|spooler)/,
    parts: [
      P('Print quality problems', 'Troubleshoot lines down the page, garbled print, faded prints, speckling and double/echo images.',
        `<table><tr><th>Symptom</th><th>Laser cause</th><th>Inkjet cause</th></tr>
<tr><td><b>Lines down the printed pages</b></td><td>Scratched/dirty drum, dirty corona/transfer roller</td><td>Clogged nozzles → clean printhead</td></tr>
<tr><td><b>Garbled print</b></td><td colspan="2">Wrong or corrupt driver, corrupt job, wrong PCL/PS language — reinstall driver, clear queue</td></tr>
<tr><td><b>Faded prints</b></td><td>Low toner, toner density setting, economy mode</td><td>Low ink, dried head</td></tr>
<tr><td><b>Speckling on printed pages</b></td><td>Toner leaking or loose toner inside, dirty fuser/drum</td><td>Ink spatter, dirty rollers</td></tr>
<tr><td><b>Double/echo images</b></td><td>Drum not cleaning fully, fuser problem — ghosting</td><td>—</td></tr></table>
<p>Also: toner that smudges off = fuser not hot enough; colors misaligned = calibrate.</p>` + pro('Print the printer\'s own test/config page from its front panel. If that page is fine, the hardware is fine and the problem is the driver, app or job.') + trap('Garbled print is a driver/data problem, not a toner or hardware problem.'),
        [['A laser printer prints a faint repeat of the image lower on the page. Problem?', 'Double/echo image (ghosting) from the drum or fuser', ['Wrong driver', 'Paper not feeding', 'Frozen queue'], 'Ghosting.'],
         ['A new PC prints pages of random symbols. Fix?', 'Install the correct driver and clear the job', ['Replace the toner', 'Clean the fuser', 'Replace the tray'], 'Garbled print.']],
        'c1-printsym'),
      P('Feeding, queue, hardware and connectivity', 'Troubleshoot paper jams, feeding and misfeeds, pending and frozen queues, grinding noises, finishing, orientation, tray and connectivity issues.',
        `<ul><li><b>Paper jams</b> — remove gently in the paper-path direction; check for torn pieces, worn rollers, wrong paper weight.</li>
<li><b>Paper not feeding</b> — worn/dirty pickup rollers, wrong paper size setting, overfilled tray. <b>Multipage misfeed</b> — worn separation pad, humid or unfanned paper.</li>
<li><b>Multiple prints pending in queue</b> / <b>frozen print queue</b> — a stuck job or hung spooler: delete the job, restart the Print Spooler, clear <code>spool\\PRINTERS</code>.</li>
<li><b>Grinding noise</b> — stripped gears, failing motor, obstruction; stop and inspect.</li>
<li><b>Finishing issues</b> — staple jams, hole punch full/jammed; clear and empty the punch bin.</li>
<li><b>Incorrect page orientation</b> — app or driver orientation setting.</li>
<li><b>Tray not recognized</b> — tray not configured in the driver\'s device settings, bad sensor, tray not seated.</li>
<li><b>Connectivity issues</b> — printer IP changed (use a reservation), cable/Wi-Fi, port in the driver, firewall.</li></ul>` + pro('"Printer offline" after a power cut is almost always a new DHCP address. Give every printer a reservation and point the port at it.') + trap('Multipage misfeed (several sheets at once) is the separation pad; no feeding at all is the pickup roller.'),
        [['Every job is stuck behind one errored job. First fix?', 'Delete the stuck job; restart the spooler if needed', ['Replace the fuser', 'Reinstall Windows', 'Replace the tray'], 'Frozen queue.'],
         ['A printer pulls several sheets at once. Likely part?', 'Separation pad (or humid paper)', ['Fuser', 'Drum', 'Toner'], 'Multipage misfeed.']],
        'c1-printts')
    ],
    wrap: { recap: ['Lines down the page → drum (laser) or printhead (inkjet); faded → toner/ink; speckling → toner leak/dirty parts.', 'Garbled print → driver/job; double/echo images → drum cleaning or fuser.', 'Jams → paper path, rollers, paper type; not feeding → pickup roller; misfeed → separation pad/humidity.', 'Pending/frozen queue → delete job, restart spooler, clear spool folder.', 'Grinding → gears/motor; finishing → staple/punch; orientation → driver/app; tray not recognized → device settings/sensor.', 'Connectivity → IP/reservation, cable/Wi-Fi, driver port.'], lab: 'c1-print-ts-wrap' }
  });

  // ===================== Domain 5 combined lab =====================
  T('c1-d5-wrap', 'Domain 5 shift: the Monday queue', 'Hardware and network troubleshooting in one shift',
    'Four tickets on one desktop and its network. Elevated PowerShell. Each task names its objective; no command hints.',
    { shell: 'ps', prompt: 'PS C:\\Windows\\system32>' },
    [{ t: '<b>5.1</b> — The PC rebooted twice overnight. Count the Kernel-Power 41 events.', accept: [/^\(?get-winevent -filterhashtable @\{ ?logname ?= ?['"]?system['"]?; ?id ?= ?41 ?\}( -maxevents \d+)?\)?(\.count| \| measure(-object)?)?$/i], show: "(Get-WinEvent -FilterHashtable @{LogName='System'; Id=41}).Count", hint: "5.1 — Get-WinEvent with Id=41", out: '2', why: 'Two unexpected power losses. Next: temperatures and PSU.' },
     { t: '<b>5.2</b> — Check physical disk health.', accept: [/^get-physicaldisk( \| select(-object)? .+| \| (ft|format-table) .+)?$/i], show: 'Get-PhysicalDisk | Select-Object FriendlyName,HealthStatus,OperationalStatus', hint: '5.2 — Get-PhysicalDisk', out: 'FriendlyName HealthStatus OperationalStatus\n------------ ------------ -----------------\nNVMe-512     Healthy      OK\nHDD-2TB      Unhealthy    Lost Communication', ask: { q: 'Which drive has a problem?', accept: ['hdd-2tb'], why: 'Lost communication: loose SATA cable or failing drive. Reseat; if it returns, back up and check S.M.A.R.T.' }, why: 'Drives.' },
     { t: '<b>5.5</b> — Test the network path to the file server FS01 on the SMB port.', accept: [/^test-netconnection( -computername)? fs01 -port 445$/i, /^tnc fs01 -port 445$/i], show: 'Test-NetConnection FS01 -Port 445', hint: '5.5 — Test-NetConnection', out: 'TcpTestSucceeded : True\nPingReplyDetails (RTT) : 1 ms', why: 'Network fine — the "slow files" complaint was the failing HDD, not the network.' },
     { t: '<b>5.6</b> — The local printer queue is stuck. Restart the print spooler in one command.', accept: [/^restart-service( -name)? spooler( -force)?$/i], show: 'Restart-Service Spooler -Force', hint: '5.6 — Restart-Service', out: '', why: 'Queue cleared after the stuck job was deleted.' },
     { t: '<b>5.3</b> — Second monitor is black. Check the display adapters.', accept: [/^get-pnpdevice -class display( \| select(-object)? .+)?$/i], show: 'Get-PnpDevice -Class Display', hint: '5.3 — Get-PnpDevice', out: 'Status Class   FriendlyName\n------ -----   ------------\nOK     Display NVIDIA T600', why: 'Adapter fine → check the monitor\'s input source and cable. (It was set to HDMI; the cable is DisplayPort.)' }],
    'Domain 5 in one shift: power (5.1), drives (5.2), display (5.3), network (5.5), printing (5.6) — evidence first every time.',
    ['Each task names its objective.']);

  // ---------- extras + cards ----------
  RK.extra(TR, '5.1', [
    ['Which component most often causes POST beeps with no video?', 'RAM', ['Hard drive', 'Keyboard', 'Optical drive'], 'Reseat RAM.'],
    ['What do swollen capacitors on a motherboard indicate?', 'The board is failing and should be replaced', ['A CMOS reset is needed', 'The RAM is mismatched', 'Overclocking is enabled'], 'Capacitor swelling.'],
    ['A computer has no power at all. After the outlet, what do you test?', 'The power supply (PSU tester)', ['The DNS server', 'The monitor', 'The printer'], 'No power.'],
    ['What is macOS\'s equivalent of a BSOD called?', 'Kernel panic', ['Pinwheel only', 'Force quit', 'Safe mode'], 'Crash screen.'],
    ['Sluggish performance with high CPU temperature points to:', 'Thermal throttling from poor cooling', ['DNS failure', 'Bad printer driver', 'Low toner'], 'Throttling.'],
    ['Which Windows tool tests RAM at boot?', 'Windows Memory Diagnostic (mdsched)', ['chkdsk', 'sfc', 'diskpart'], 'Memory test.'],
    ['A grinding noise that changes with fan speed is most likely:', 'A failing fan bearing', ['A dead CMOS battery', 'A bad DIMM', 'A failing SSD'], 'Unusual noise.']
  ]);
  RK.extra(TR, '5.2', [
    ['What does a S.M.A.R.T. warning mean?', 'The drive predicts it may fail soon', ['The drive is encrypted', 'The drive is full', 'The RAID is RAID 0'], 'Predictive failure.'],
    ['Which RAID level loses all data if one drive fails?', 'RAID 0', ['RAID 1', 'RAID 5', 'RAID 10'], 'No redundancy.'],
    ['What should you never do to a missing array before checking the configuration?', 'Initialize it', ['Read the logs', 'Check cables', 'Import the foreign config'], 'Initializing erases.'],
    ['A new drive is detected in BIOS but has no volume in Windows. What next?', 'Initialize, partition and format it in Disk Management', ['Replace it', 'Flash the BIOS', 'Run sfc'], 'New disk.'],
    ['Extended read/write times on an older HDD suggest:', 'A failing drive or heavy fragmentation', ['Wrong printer driver', 'Weak Wi-Fi', 'A bad monitor'], 'Performance symptom.'],
    ['Why back up before rebuilding a degraded array?', 'The rebuild stresses the remaining drives, which may fail', ['Rebuilds delete data', 'It is required by Windows', 'It speeds up the rebuild'], 'Risk.']
  ]);
  RK.extra(TR, '5.3', [
    ['A monitor shows "No signal" while the PC runs. First check?', 'The monitor input source and the cable', ['Replace the GPU', 'Reinstall the OS', 'Replace the PSU'], 'Input/cable.'],
    ['Which display issue is permanent image retention from static content?', 'Burn-in', ['Dead pixel', 'Keystone', 'Flicker'], 'Burn-in.'],
    ['A projector fan runs but there is no light. Most likely?', 'Burnt-out bulb', ['Wrong input', 'Dead pixels', 'Wrong refresh rate'], 'Lamp.'],
    ['Colors look wrong after the monitor cable was bent. Fix?', 'Replace the cable', ['Recalibrate the CPU', 'Replace RAM', 'Change DNS'], 'Pin damage.'],
    ['Black bars appear around the image on a TV. Which setting?', 'Resolution/aspect ratio or scaling', ['Audio device', 'Input source', 'Projector lamp'], 'Sizing.'],
    ['A laptop display is very dim even at full brightness. Likely?', 'Failing backlight', ['Wrong DNS', 'Bad keyboard', 'Low disk space'], 'Dim image.']
  ]);
  RK.extra(TR, '5.4', [
    ['What is the safest action with a swollen phone battery?', 'Stop using and charging it, and replace it', ['Press it flat', 'Charge it to 100%', 'Puncture it to release gas'], 'Fire risk.'],
    ['Why might a phone with an old battery feel slow?', 'The OS throttles the CPU to prevent shutdowns', ['Bluetooth is on', 'The SIM is old', 'GPS is enabled'], 'Battery throttling.'],
    ['Where is a phone\'s liquid contact indicator usually found?', 'In the SIM tray or near the battery', ['On the screen', 'Inside the app store', 'On the charger'], 'LCI.'],
    ['An active stylus stopped working. First check?', 'Charge or re-pair the stylus', ['Replace the screen', 'Factory reset', 'Replace the battery'], 'Stylus power.'],
    ['Which is a sign of mobile malware?', 'Unexplained heat, battery drain and data use', ['Rotation lock on', 'Dark mode', 'A cracked case'], 'Malware.'],
    ['A phone\'s USB-C port is cracked. Interim workaround?', 'Use wireless charging until the port is replaced', ['Glue the port', 'Use a higher-wattage charger', 'Disable Wi-Fi'], 'Damaged port.']
  ]);
  RK.extra(TR, '5.5', [
    ['Which tool shows packet loss at each hop on the path?', 'pathping', ['ipconfig', 'nslookup', 'arp'], 'Per-hop statistics.'],
    ['Calls are choppy only during large downloads. Fix?', 'Configure QoS to prioritize voice', ['Change DNS', 'Replace the phone', 'Use APIPA'], 'Priority.'],
    ['What do rising CRC errors on a switch port usually indicate?', 'A bad cable or connector', ['A DNS error', 'A full disk', 'A wrong SSID'], 'Physical layer.'],
    ['802.1X Wi-Fi fails for everyone the morning a certificate expired. Problem?', 'Authentication failure due to the expired certificate', ['Interference', 'APIPA', 'Port flapping'], 'Authentication.'],
    ['Ping to the gateway works but not to any Internet address. Where is the problem?', 'Beyond the LAN — router/ISP', ['The NIC', 'The cable', 'The local IP'], 'Isolate.'],
    ['Which band is most affected by microwave ovens?', '2.4 GHz', ['5 GHz', '6 GHz', 'Cellular 5G'], 'Interference.']
  ]);
  RK.extra(TR, '5.6', [
    ['Where are Windows spool files stored?', 'C:\\Windows\\System32\\spool\\PRINTERS', ['C:\\Temp\\print', 'C:\\Users\\Public', 'C:\\Program Files\\Printers'], 'Spool folder.'],
    ['Toner smears off the page when rubbed. Which part?', 'Fuser', ['Pickup roller', 'Separation pad', 'Tray sensor'], 'Not fused.'],
    ['Paper is not picked up from the tray at all. Likely part?', 'Pickup roller', ['Fuser', 'Drum', 'Toner'], 'Feeding.'],
    ['A printer shows offline after a power outage. Most likely?', 'Its IP address changed', ['Toner is low', 'Drum is scratched', 'Driver is PostScript'], 'Connectivity.'],
    ['Black dots randomly across laser pages suggest:', 'Loose toner inside or a dirty drum/fuser', ['Wrong driver', 'Frozen queue', 'Wrong orientation'], 'Speckling.'],
    ['A newly installed tray 3 is not recognized. First check?', 'Enable it in the driver\'s device settings and reseat it', ['Replace the fuser', 'Clear the spooler', 'Change toner'], 'Tray config.']
  ]);
  RK.cards(TR, '5.1', [['POST beeps', 'Look up code; reseat RAM first.'], ['Event ID 41', 'Unexpected power loss.'], ['Swollen capacitors', 'Replace board/PSU.'], ['Wrong date/time', 'CMOS battery.']]);
  RK.cards(TR, '5.2', [['Clicking/grinding', 'Mechanical failure — back up, replace.'], ['S.M.A.R.T.', 'Drive self-monitoring predictive failure.'], ['Degraded array', 'Replace member, rebuild (back up first).'], ['Array missing', 'Import config; never initialize.']]);
  RK.cards(TR, '5.3', [['No signal', 'Input source, cable, projection mode.'], ['Projector shutdown', 'Filter/fan overheating.'], ['Fuzzy', 'Native resolution, focus.'], ['Keystone', 'Fixes trapezoid projected image.']]);
  RK.cards(TR, '5.4', [['Swollen battery', 'Stop use; replace.'], ['Liquid damage', 'Power off; no charging.'], ['Unable to install apps', 'Storage, OS version, MDM.'], ['Cursor drift', 'Clean, calibrate, update.']]);
  RK.cards(TR, '5.5', [['Jitter', 'Variation in latency.'], ['Port flapping', 'Link up/down repeatedly — cable/NIC.'], ['Limited connectivity', 'APIPA/DHCP, gateway, DNS.'], ['pathping', 'Per-hop latency and loss.']]);
  RK.cards(TR, '5.6', [['Frozen queue', 'Delete job, restart spooler, clear spool folder.'], ['Garbled print', 'Driver/job.'], ['Ghosting', 'Drum cleaning/fuser.'], ['Misfeed vs no feed', 'Separation pad vs pickup roller.']]);
})();
