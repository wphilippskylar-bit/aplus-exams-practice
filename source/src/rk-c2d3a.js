/* A+ Core 2 (220-1202) — Domain 3.0 Software Troubleshooting — objectives 3.1 to 3.4 + domain wrap lab */
(function () {
  var RK = window.RK, P = RK.P, M = RK.M, O = RK.O, T = RK.T, TR = 'core2';
  function pro(t) { return '<div class="callout pro"><b class="k">On the job</b>' + t + '</div>'; }
  function trap(t) { return '<div class="callout trap"><b class="k">Exam trap</b>' + t + '</div>'; }

  // ===================== 3.1 Windows OS issues =====================
  T('c2-bootfix', 'Fix a PC that will not boot', 'Windows Recovery Environment',
    'A desktop shows "No operating system found" / "Bootable device not found" after a power cut. Startup Repair failed. You booted from Windows install media into the Recovery Environment command prompt.',
    { shell: 'cmd', prompt: 'X:\\Sources>' },
    [{ t: 'First rule out the simple cause: list the disks to make sure the system drive is detected at all.', accept: [/^diskpart$/i], show: 'diskpart', hint: 'Start the partitioning tool, then list disk.', out: 'Microsoft DiskPart version 10.0.26100.1', prompt: 'DISKPART>', why: 'If the disk is missing entirely, it is hardware/BIOS boot order, not Windows.' },
     { t: 'List the disks.', accept: [/^list disk$/i, /^lis dis$/i], show: 'list disk', hint: 'list disk', out: '  Disk ###  Status   Size     Free   Gpt\n  Disk 0    Online   476 GB   0 B     *', ask: { q: 'Is Disk 0 detected? (yes/no)', accept: ['yes'], why: 'The drive is there and GPT — so the boot configuration is damaged, not the hardware.' }, why: 'Detected drive → repair the boot files.' },
     { t: 'Leave diskpart.', accept: [/^exit$/i], show: 'exit', hint: 'exit', out: 'Leaving DiskPart...', prompt: 'X:\\Sources>', why: 'Back to the recovery prompt.' },
     { t: 'Scan for Windows installations and rebuild the Boot Configuration Data.', accept: [/^bootrec \/rebuildbcd$/i], show: 'bootrec /rebuildbcd', hint: 'bootrec with the switch that rebuilds the BCD.', out: 'Scanning all disks for Windows installations.\nSuccessfully scanned Windows installations.\nTotal identified Windows installations: 1\n[1]  C:\\Windows\nAdd installation to boot list? Yes(Y)/No(N)/All(A): Y\nThe operation completed successfully.', why: 'The BCD tells the boot manager where Windows is.' },
     { t: 'Check the Windows system files on the offline C: installation.', accept: [/^sfc \/scannow \/offbootdir=c:\\? \/offwindir=c:\\windows$/i, /^sfc \/scannow \/offwindir=c:\\windows \/offbootdir=c:\\?$/i], show: 'sfc /scannow /offbootdir=C:\\ /offwindir=C:\\Windows', hint: 'sfc /scannow with /offbootdir= and /offwindir= for an offline install.', out: 'Beginning system scan...\nWindows Resource Protection found corrupt files and successfully repaired them.', why: 'The power cut corrupted system files too. Now restart and test.' }],
    'Detected disk → rebuild boot data → repair system files → restart. If the disk is NOT detected: check cables, BIOS/UEFI boot order and the drive itself.',
    ['In WinRE, bootrec repairs boot records; sfc can repair an offline Windows folder.']);
  T('c2-perfts', 'Slow, crashing and unstable', 'Find the cause, then repair Windows',
    'Ticket: "My PC is slow, I get low-memory warnings, and Excel crashes several times a day." Elevated PowerShell on the PC.',
    { shell: 'ps', prompt: 'PS C:\\Windows\\system32>' },
    [{ t: 'List the 5 processes using the most memory (working set).', accept: [/^get-process \| sort(-object)? (-property )?ws -descending \| select(-object)? -first 5$/i, /^get-process \| sort(-object)? (-property )?workingset64? -descending \| select(-object)? -first 5$/i, /^gps \| sort ws -desc(ending)? \| select -first 5$/i], show: 'Get-Process | Sort-Object WS -Descending | Select-Object -First 5', hint: 'Get-Process | Sort-Object WS -Descending | Select-Object -First 5', out: 'Handles  WS(K)     ProcessName\n-------  -----     -----------\n   2210  6,812,440 SyncAgentX\n   1405    612,300 EXCEL\n    980    402,100 msedge\n    611    220,800 Teams\n    402    101,200 explorer', ask: { q: 'Which process is using about 6.8 GB of RAM?', accept: ['syncagentx'], why: 'A third-party sync agent is leaking memory — the cause of the low-memory warnings and Excel crashes.' }, why: 'Low memory warnings → find the process, not just add RAM.' },
     { t: 'Look at the last 5 application errors in the Application log.', accept: [/^get-winevent -filterhashtable @\{ ?logname ?= ?['"]?application['"]?; ?level ?= ?2 ?\} -maxevents 5$/i, /^get-eventlog -logname application -entrytype error -newest 5$/i], show: 'Get-EventLog -LogName Application -EntryType Error -Newest 5', hint: 'Get-EventLog -LogName Application -EntryType Error -Newest 5', out: 'Index Time         EntryType Source              Message\n----- ----         --------- ------              -------\n 8812 Nov 17 10:42 Error     Application Error   Faulting application name: EXCEL.EXE … exception 0xc0000017 (out of memory)\n 8790 Nov 17 09:15 Error     Application Error   Faulting application name: EXCEL.EXE … exception 0xc0000017', why: 'Event log confirms: Excel crashes are out-of-memory, not an Office fault.' },
     { t: 'Stop the leaking SyncAgentX process.', accept: [/^stop-process -name syncagentx( -force)?$/i, /^(kill|spps) -name syncagentx( -force)?$/i], show: 'Stop-Process -Name SyncAgentX', hint: 'Stop-Process -Name <name>', out: '', why: 'Immediate relief; the lasting fix is to update or uninstall the agent.' },
     { t: 'Because of the repeated crashes, repair the Windows component store first.', accept: [/^dism \/online \/cleanup-image \/restorehealth$/i, /^repair-windowsimage -online -restorehealth$/i], show: 'DISM /Online /Cleanup-Image /RestoreHealth', hint: 'DISM /Online /Cleanup-Image /RestoreHealth', out: '[==========================100.0%==========================]\nThe restore operation completed successfully.', why: 'DISM repairs the store that sfc copies good files from.' },
     { t: 'Then verify and repair protected system files.', accept: [/^sfc \/scannow$/i], show: 'sfc /scannow', hint: 'System File Checker.', out: 'Windows Resource Protection did not find any integrity violations.', why: 'Windows itself is healthy; the problem was the third-party app.' }],
    'Order: identify the resource hog → confirm in logs → stop it → repair Windows (DISM then sfc) → fix the root cause (update/uninstall the app, add RAM if it is genuinely short).',
    ['Sort processes by WS (working set = memory in use).']);
  T('c2-svcts', 'Services, USB and time drift', 'Get-Service, Set-Service, w32tm',
    'Two tickets on one domain PC: the backup service does not start after reboot, and the user cannot sign in to a cloud app ("clock skew"). Elevated PowerShell.',
    { shell: 'ps', prompt: 'PS C:\\Windows\\system32>' },
    [{ t: 'Show the status and start type of the service <b>BackupAgent</b>.', accept: [/^get-service backupagent \| select(-object)? (name,\s?)?status,\s?starttype$/i, /^get-service backupagent \| select(-object)? \*$/i, /^get-service backupagent \| fl \*$/i], show: 'Get-Service BackupAgent | Select-Object Name,Status,StartType', hint: 'Get-Service <name> | Select-Object Name,Status,StartType', out: 'Name        Status  StartType\n----        ------  ---------\nBackupAgent Stopped Manual', ask: { q: 'What is the start type?', accept: ['manual'], why: 'Manual services do not start at boot. It should be Automatic (or Automatic (Delayed Start)).' }, why: '"Service not starting" is often just the start type.' },
     { t: 'Set it to start automatically.', accept: [/^set-service( -name)? backupagent -startuptype automatic$/i], show: 'Set-Service BackupAgent -StartupType Automatic', hint: 'Set-Service <name> -StartupType Automatic', out: '', why: 'Starts at every boot from now on.' },
     { t: 'Start it now.', accept: [/^start-service( -name)? backupagent$/i], show: 'Start-Service BackupAgent', hint: 'Start-Service <name>', out: '', why: 'If it failed to start, the next stop is the System log and the service\'s logon account.' },
     { t: 'Show the Windows Time service status for the clock problem.', accept: [/^w32tm \/query \/status$/i], show: 'w32tm /query /status', hint: 'w32tm /query /status', out: 'Leap Indicator: 3(not synchronized)\nStratum: 0 (unspecified)\nSource: Local CMOS Clock\nLast Successful Sync Time: unspecified', ask: { q: 'What is the time source?', accept: ['local cmos clock', 'cmos', 'local cmos'], why: 'It is not syncing with the domain — the clock drifted, which breaks Kerberos and cloud sign-ins.' }, why: 'Time drift → check the time source.' },
     { t: 'Force the PC to resynchronize its clock now.', accept: [/^w32tm \/resync( \/force)?$/i], show: 'w32tm /resync', hint: 'w32tm /resync', out: 'Sending resync command to local computer\nThe command completed successfully.', why: 'Clock corrected; sign-ins work again. A dead CMOS battery causes drift that keeps returning.' }],
    'Service won\'t start → start type, dependencies, logon account, System log. Time drift → w32tm status/resync; if it keeps drifting, replace the CMOS battery.',
    ['Get-Service / Set-Service / Start-Service; w32tm for time.']);
  M('c2-fixpick', 'Pick the fix', 'Common Windows troubleshooting fixes',
    'Pick the best first fix for each symptom.', ['Reboot', 'Restart the service', 'Uninstall/reinstall/update the app', 'Add resources (RAM/storage)', 'Verify requirements', 'Run sfc / repair Windows', 'Restore to a restore point', 'Roll back the update', 'Rebuild the Windows profile', 'Reimage'],
    [['A PC has been up for 47 days and is sluggish', 'Reboot', 'Clears memory and stuck processes.'],
     ['Printing stopped; the Print Spooler shows Stopped', 'Restart the service', 'Restart and check its start type.'],
     ['One app crashes on open since its last update', 'Uninstall/reinstall/update the app', 'App-specific fault.'],
     ['Low memory warnings with only 4 GB installed and normal workloads', 'Add resources (RAM/storage)', 'Genuinely undersized.'],
     ['New CAD software is unusably slow on an old laptop', 'Verify requirements', 'Check it meets the app\'s specs.'],
     ['Random errors about missing system DLLs', 'Run sfc / repair Windows', 'Corrupt system files.'],
     ['Problems started right after a driver install yesterday', 'Restore to a restore point', 'Return to yesterday\'s state.'],
     ['BSODs began after last night\'s Windows update', 'Roll back the update', 'Uninstall the update.'],
     ['Only one user\'s sign-in takes 10 minutes; other users are fine', 'Rebuild the Windows profile', 'Corrupt user profile.'],
     ['Repeated failures, nothing else worked, data is backed up', 'Reimage', 'Known-good state.']],
    'Start with the least invasive fix that matches the evidence; reimage last.');
  M('c2-winos-wrap', 'Windows troubleshooting desk', 'Combined 3.1',
    'Pick the most likely cause or tool.', ['Bad driver / RAM (check the BSOD stop code)', 'Rebuild the BCD (bootrec)', 'Overheating', 'Service start type / dependency', 'Memory leak in an app', 'USB controller resource limits', 'Corrupt user profile', 'CMOS battery / time sync', 'Windows Update failure / corrupt store (DISM)'],
    [['Blue screen naming a network driver file after a driver update', 'Bad driver / RAM (check the BSOD stop code)', 'Roll back the driver.'],
     ['"No operating system found" but the drive is detected', 'Rebuild the BCD (bootrec)', 'Boot configuration.'],
     ['PC shuts off without warning under load; fans clogged', 'Overheating', 'Frequent shutdowns.'],
     ['A service fails at boot because the service it depends on is disabled', 'Service start type / dependency', 'Services not starting.'],
     ['Memory use climbs all day until an app crashes', 'Memory leak in an app', 'Low memory warnings.'],
     ['"Not enough USB controller resources" with many devices on one dock', 'USB controller resource limits', 'Move devices to another controller/port.'],
     ['Only one user gets a temporary profile or a very slow sign-in', 'Corrupt user profile', 'Slow profile load.'],
     ['Clock is wrong every morning after the PC is unplugged overnight', 'CMOS battery / time sync', 'Time drift.'],
     ['Windows updates fail repeatedly with the same error', 'Windows Update failure / corrupt store (DISM)', 'Repair component store.']],
    'Every 3.1 symptom has a short list of usual causes — learn the list, then let the evidence pick.');

  RK.add({ track: TR, id: '3.1', dom: 3, short: 'Windows OS issues', title: 'Given a scenario, troubleshoot common Windows OS issues',
    goal: 'Diagnose and fix BSODs, boot failures, performance and stability problems, failing services, USB resource warnings, slow profiles and time drift.',
    kw: /\b(bsod|blue screen|stop code|boot (issue|failure|loop)|no os found|operating system not found|bootrec|degraded performance|sluggish|slow (pc|computer|boot)|frequent shutdown|services? (not|fail(ed|s)? to) start|application crash|low memory|usb controller|system instability|unstable|slow profile|user profile|time drift|clock|restore point|roll back|reimage|rebuild (the )?profile|sfc)/,
    parts: [
      P('Boot problems and BSODs', 'Diagnose blue screens, boot failures and "no OS found", and repair boot files from the recovery environment.',
        `<ul><li><b>Blue screen of death (BSOD)</b> — Windows stopped to protect itself. Note the <b>stop code</b> and any file named (e.g. a driver). Usual causes: bad/new driver, failing RAM or drive, overheating, recent update. Fixes: roll back the driver or update, test RAM (Windows Memory Diagnostic), check the drive.</li>
<li><b>Boot issues</b> — stuck at logo, boot loop, slow boot. Try <b>Startup Repair</b> and <b>Safe Mode</b> from the Windows Recovery Environment (WinRE).</li>
<li><b>No OS found</b> — first check hardware: is the drive detected in UEFI? Is it first in boot order? Is a USB stick taking priority? If the drive is fine, repair the boot data: <code>bootrec /rebuildbcd</code> (plus <code>/fixboot</code> and <code>/fixmbr</code> on older MBR systems).</li></ul>
<p>Reach WinRE: hold Shift while clicking Restart, interrupt boot three times, or boot from install media → Repair your computer.</p>` + pro('Write the BSOD stop code into the ticket before anything else. "CRITICAL_PROCESS_DIED" and "MEMORY_MANAGEMENT" lead to very different fixes.') + trap('"No OS found" with a USB stick plugged in is usually just the boot order.'),
        [['A PC shows "No operating system found". What should you check first?', 'Whether the drive is detected and first in the boot order', ['Reinstall Windows immediately', 'Run Disk Cleanup', 'Rebuild the user profile'], 'Hardware/boot order first.'],
         ['Which command rebuilds the Boot Configuration Data?', 'bootrec /rebuildbcd', ['sfc /scannow', 'chkdsk /f', 'gpupdate /force'], 'BCD repair.']],
        'c2-bootfix'),
      P('Performance, crashes and instability', 'Find what is causing slowness, low memory, crashes, instability and unexpected shutdowns.',
        `<ul><li><b>Degraded performance</b> — Task Manager / Resource Monitor: which process uses CPU, memory, disk? Check startup items, free disk space, malware, and whether the PC meets the app\'s requirements.</li>
<li><b>Low memory warnings</b> — a leaking process, too many apps, or genuinely too little RAM.</li>
<li><b>Applications crashing</b> — Event Viewer → Application log (Event ID 1000) names the faulting module. Update, repair or reinstall the app.</li>
<li><b>System instability</b> — random errors and freezes: corrupt system files (<code>DISM /Online /Cleanup-Image /RestoreHealth</code>, then <code>sfc /scannow</code>), bad drivers, failing hardware.</li>
<li><b>Frequent shutdowns</b> — overheating (dust, failed fan), failing power supply, or a power setting. Check the System log for unexpected shutdown events (Event ID 41).</li></ul>` + pro('Run DISM before sfc: DISM fixes the repair store, then sfc uses it to fix Windows files.') + trap('Low memory warnings do not always mean "add RAM". Find the process first.'),
        [['Which order should you run the Windows repair tools?', 'DISM /RestoreHealth, then sfc /scannow', ['sfc, then format', 'chkdsk, then DISM, then reimage', 'gpupdate, then sfc'], 'Fix the store, then the files.'],
         ['A PC shuts off under heavy load and the fans are clogged. Most likely cause?', 'Overheating', ['Corrupt profile', 'Time drift', 'Bad BCD'], 'Thermal protection.']],
        'c2-perfts'),
      P('Services, USB resources, profiles and time', 'Fix services that will not start, USB controller resource warnings, slow profile loads and time drift.',
        `<ul><li><b>Services not starting</b> — check the <b>start type</b> (Automatic/Manual/Disabled), <b>dependencies</b> (a required service is disabled), the <b>logon account</b> (expired password), and the System log. services.msc or <code>Get-Service</code>/<code>Set-Service</code>.</li>
<li><b>USB controller resource warnings</b> — too many devices (or high-bandwidth devices) on one controller/hub. Move devices to ports on another controller, use a powered hub, update chipset/USB drivers.</li>
<li><b>Slow profile load</b> — large roaming profiles, network drives that time out, or a corrupt profile (one user only). Fix the network path, or rebuild the profile (rename it, sign in fresh, copy data back).</li>
<li><b>Time drift</b> — clock wrong → Kerberos/certificate/cloud sign-in failures. <code>w32tm /query /status</code>, <code>w32tm /resync</code>. If it drifts again after power-off, replace the CMOS battery.</li></ul>` + pro('A service that "will not start" after a password change is almost always running under that account. Update the service\'s logon credentials.') + trap('If only one user is slow to sign in, suspect their profile; if everyone is, suspect the network, policies or the server.'),
        [['A service never starts after reboot but starts fine by hand. Likely cause?', 'Its start type is Manual', ['Corrupt BCD', 'Time drift', 'USB controller limits'], 'Set it to Automatic.'],
         ['Which command forces Windows to resync its clock?', 'w32tm /resync', ['sfc /scannow', 'bootrec /fixboot', 'net time /set'], 'Windows Time service.']],
        'c2-svcts'),
      P('Choosing the fix', 'Choose between reboot, service restart, app repair, more resources, sfc/repair, restore, rollback, profile rebuild and reimage.',
        `<p>CompTIA lists these common troubleshooting steps. Use the <b>least invasive</b> one that fits the evidence:</p>
<ol><li><b>Reboot</b>.</li>
<li><b>Restart services</b>.</li>
<li><b>Uninstall/reinstall/update applications</b>.</li>
<li><b>Add resources</b> (RAM, storage) and <b>verify requirements</b>.</li>
<li><b>System file check</b> (sfc, DISM) and <b>repair Windows</b> (repair install keeps apps and data).</li>
<li><b>Restore</b> (System Restore point) or <b>roll back updates</b>/drivers when trouble started after a change.</li>
<li><b>Rebuild Windows profiles</b> when one user is affected.</li>
<li><b>Reimage</b> — when nothing else works and data is backed up.</li></ol>` + pro('"When did it start, and what changed then?" usually points straight at roll back or restore.') + trap('Reimaging is the last option, not the first — unless the evidence is malware you cannot trust (then it is the right call).'),
        [['Problems started right after last night\'s update. Best first fix?', 'Roll back the update', ['Reimage', 'Add RAM', 'Rebuild every profile'], 'Undo the change.'],
         ['Only one of five users on a PC has a slow, broken sign-in. Likely fix?', 'Rebuild that user\'s Windows profile', ['Reimage the PC', 'Replace the RAM', 'Rebuild the BCD'], 'Profile-specific.']],
        'c2-fixpick')
    ],
    wrap: { recap: ['BSOD: read the stop code; roll back drivers/updates; test RAM and drive.', 'No OS found: drive detected? boot order? then bootrec /rebuildbcd from WinRE.', 'Slowness/low memory/crashes: find the process (Task Manager, Event Viewer); DISM then sfc.', 'Frequent shutdowns: heat, PSU, Event ID 41.', 'Services: start type, dependencies, logon account. USB resource warnings: spread devices across controllers.', 'Slow profile: one user → rebuild profile. Time drift: w32tm /resync; CMOS battery.'], lab: 'c2-winos-wrap' }
  });

  // ===================== 3.2 Mobile OS & app issues =====================
  M('c2-mobapp', 'Mobile app problems', 'Launch, crash, update, install, slow',
    'Pick the best first fix.', ['Force-stop and relaunch the app', 'Clear the app cache/data', 'Update the app', 'Free up storage', 'Check OS version compatibility', 'Restart the device', 'Reinstall the app'],
    [['An app is frozen on one screen and will not close', 'Force-stop and relaunch the app', 'Kill and restart.'],
     ['An app crashes on open after weeks of working fine', 'Clear the app cache/data', 'Corrupt cached data.'],
     ['App crashes; the store shows an update with "bug fixes"', 'Update the app', 'Developer fix.'],
     ['App update fails: "not enough space"', 'Free up storage', 'Updates need room.'],
     ['App will not install: "requires iOS 17 or later"', 'Check OS version compatibility', 'Update the OS or use a supported device.'],
     ['Everything is slow to respond after days without a restart', 'Restart the device', 'Clears memory.'],
     ['Cache clear and update did not help', 'Reinstall the app', 'Fresh copy.']],
    'App issues: force-stop → clear cache → update → free space → reinstall → restart.');
  M('c2-mobos', 'Mobile OS, battery and connectivity', 'OS updates, battery, reboots, Bluetooth/Wi-Fi/NFC, autorotate',
    'Pick the most likely cause or fix.', ['Free storage / charge / Wi-Fi for the OS update', 'Check battery usage by app', 'Battery health / replace battery', 'Remove the faulty app or update the OS', 'Toggle Bluetooth and re-pair', 'Forget and rejoin the Wi-Fi network', 'Enable NFC / check payment app', 'Turn off rotation lock'],
    [['The OS update will not install', 'Free storage / charge / Wi-Fi for the OS update', 'Needs space, battery and Wi-Fi.'],
     ['Battery drains fast since installing a new app', 'Check battery usage by app', 'Find the app draining it.'],
     ['Two-year-old phone dies at 30% and is slow', 'Battery health / replace battery', 'Worn battery.'],
     ['Phone reboots randomly since a recent app was installed', 'Remove the faulty app or update the OS', 'Random reboots.'],
     ['Car audio will not connect after a phone update', 'Toggle Bluetooth and re-pair', 'Remove and re-add the pairing.'],
     ['Connects to every network except the office Wi-Fi after a password change', 'Forget and rejoin the Wi-Fi network', 'Stale saved credentials.'],
     ['Tap-to-pay does nothing at the register', 'Enable NFC / check payment app', 'NFC off or wallet not set.'],
     ['Screen does not rotate when the phone is turned', 'Turn off rotation lock', 'Autorotate setting.']],
    'Connectivity: toggle the radio, forget/re-pair, airplane mode on/off, restart, then reset network settings.');
  M('c2-mob-ts-wrap', 'Mobile help desk', 'Combined 3.2',
    'Pick the best first step.', ['Force-stop the app', 'Clear cache', 'Update the app', 'Free storage', 'Update the OS', 'Check battery usage', 'Re-pair Bluetooth', 'Reset network settings', 'Check rotation lock'],
    [['Banking app freezes on login', 'Force-stop the app', 'First step for a hung app.'],
     ['Photo app crashes when opening an album', 'Clear cache', 'Corrupt cache.'],
     ['App says "this version is no longer supported"', 'Update the app', 'Required update.'],
     ['Cannot install any new apps', 'Free storage', 'Storage full.'],
     ['Several apps require a newer system version', 'Update the OS', 'OS fails to update? Check space and charge.'],
     ['Battery lasts half a day since last week', 'Check battery usage', 'Find the culprit.'],
     ['Headset drops audio after an update', 'Re-pair Bluetooth', 'Remove and re-add.'],
     ['Wi-Fi, Bluetooth and VPN all misbehave after an update', 'Reset network settings', 'Resets all radios and saved networks.'],
     ['Videos stay portrait when the phone is turned', 'Check rotation lock', 'Autorotate.']],
    'Most mobile tickets are solved in under five minutes with the first fix that matches.');

  RK.add({ track: TR, id: '3.2', dom: 3, short: 'Mobile OS & application issues', title: 'Given a scenario, troubleshoot common mobile OS and application issues',
    goal: 'Fix mobile apps that fail to launch, close, update or install, slow devices, OS update failures, battery drain, random reboots, Bluetooth/Wi-Fi/NFC problems and autorotate.',
    kw: /\b(app(lication)? (fails?|won.t|will not|crash|freez)|fails? to (launch|close|update|install)|slow to respond|battery (life|drain)|random reboot|bluetooth|nfc|autorotat|rotation|mobile (os|app)|iphone|android|ios update|os fails to update)/,
    parts: [
      P('Mobile application issues', 'Fix apps that fail to launch, close, update or install, and slow responses.',
        `<table><tr><th>Symptom</th><th>Usual fixes (in order)</th></tr>
<tr><td><b>Fails to launch</b></td><td>Restart device → update app → clear cache (Android) / offload &amp; reinstall (iOS) → check OS compatibility</td></tr>
<tr><td><b>Fails to close / crashes</b></td><td>Force-stop → clear cache/data → update → reinstall</td></tr>
<tr><td><b>Fails to update</b></td><td>Free storage, stable Wi-Fi, correct account signed in to the store, OS version supported</td></tr>
<tr><td><b>Fails to install</b></td><td>Storage, OS version, store restrictions (MDM may block it), payment/account issues</td></tr>
<tr><td><b>Slow to respond</b></td><td>Restart, close background apps, free storage (keep 10%+ free), update</td></tr></table>
<p>Android lets you <b>clear cache</b> or <b>clear data</b> per app (Settings → Apps). iOS uses <b>offload app</b> (keeps data) or delete and reinstall.</p>` + pro('On managed phones, check MDM first: "cannot install" is often a policy block, not a fault.') + trap('Clear data resets the app completely (logins, settings). Clear cache is the gentler first step.'),
        [['An Android app crashes on open. Which gentle step comes before reinstalling?', 'Clear the app cache', ['Factory reset', 'Remote wipe', 'Replace the battery'], 'Least invasive first.'],
         ['An app update fails with "storage full". Fix?', 'Free up storage space', ['Turn off Wi-Fi', 'Enable developer mode', 'Rotate the screen'], 'Updates need space.']],
        'c2-mobapp'),
      P('OS, battery, reboots and connectivity', 'Fix OS update failures, battery drain, random reboots, Bluetooth/Wi-Fi/NFC problems and autorotate.',
        `<ul><li><b>OS fails to update</b> — needs free storage, battery above ~50% or charging, and Wi-Fi; device may no longer be supported.</li>
<li><b>Battery life issues</b> — Settings → Battery shows usage by app; screen brightness, location, background refresh. Old batteries lose capacity (check battery health); swollen = replace immediately.</li>
<li><b>Random reboots</b> — faulty app or OS bug (update/remove the app), overheating, failing battery.</li>
<li><b>Connectivity issues</b>:
<ul><li><b>Bluetooth</b> — toggle off/on, forget and re-pair, check the other device.</li>
<li><b>Wi-Fi</b> — forget and rejoin, toggle airplane mode, check captive portal, reset network settings.</li>
<li><b>NFC</b> — enabled? wallet/payment app set as default? case too thick?</li></ul></li>
<li><b>Screen does not autorotate</b> — rotation lock on; app does not support rotation; sensor fault (rare).</li></ul>` + pro('"Reset network settings" fixes stubborn Wi-Fi/Bluetooth/VPN issues without touching apps or data — but users must re-enter Wi-Fi passwords.') + trap('Autorotate not working is almost always the rotation lock, not hardware.'),
        [['A phone will not install an OS update. What should you check?', 'Free storage, battery charge and Wi-Fi', ['Rotation lock', 'NFC', 'Developer mode'], 'Update prerequisites.'],
         ['Headphones stopped connecting after an update. First fix?', 'Forget the device and re-pair it', ['Factory reset', 'Replace the battery', 'Clear browser cache'], 'Bluetooth pairing refresh.']],
        'c2-mobos')
    ],
    wrap: { recap: ['Apps: force-stop → clear cache → update → reinstall; check storage and OS compatibility.', 'OS update fails: storage, battery, Wi-Fi, device support.', 'Battery drain: usage by app, settings, battery health.', 'Random reboots: faulty app/OS bug, heat, battery.', 'Bluetooth re-pair; Wi-Fi forget/rejoin or reset network settings; NFC enabled + wallet default.', 'No autorotate: rotation lock.'], lab: 'c2-mob-ts-wrap' }
  });

  // ===================== 3.3 Mobile security issues =====================
  M('c2-mobsec-concern', 'Mobile security concerns', 'Sideloading, developer mode, root/jailbreak, spoofed apps',
    'Pick the concern described.', ['Unofficial application store', 'Developer mode', 'Root access / jailbreak', 'Application spoofing'],
    [['Installing an APK downloaded from a forum instead of Google Play', 'Unofficial application store', 'Sideloading bypasses store vetting.'],
     ['Hidden settings unlocked that allow USB debugging and app installs from a PC', 'Developer mode', 'Leaves the device more open.'],
     ['Removing the OS restrictions to get full admin control of an iPhone', 'Root access / jailbreak', 'Breaks the security model.'],
     ['A fake "WhatsApp Plus" that looks real but steals messages', 'Application spoofing', 'Malicious look-alike app.'],
     ['MDM reports the phone as compromised because system files were modified', 'Root access / jailbreak', 'Compliance failure.']],
    'Corporate policy usually blocks rooted/jailbroken devices and sideloading outright.');
  M('c2-mobsec-sym', 'Is this phone compromised?', 'Symptoms of mobile malware',
    'Pick the symptom category.', ['High network traffic', 'Degraded response time', 'Data-usage limit notification', 'Limited or no Internet connectivity', 'High number of ads', 'Fake security warnings', 'Unexpected application behavior', 'Leaked personal files/data'],
    [['Phone sends 3 GB overnight while idle', 'High network traffic', 'Data exfiltration or botnet.'],
     ['Everything lags and the phone is warm in the pocket', 'Degraded response time', 'Background malware.'],
     ['Carrier warns the monthly data cap is nearly used on day 5', 'Data-usage limit notification', 'Hidden traffic.'],
     ['A rogue VPN/proxy profile breaks all browsing', 'Limited or no Internet connectivity', 'Malicious configuration.'],
     ['Full-screen ads appear over the home screen', 'High number of ads', 'Adware.'],
     ['"Your phone has 13 viruses — install this cleaner"', 'Fake security warnings', 'Scareware.'],
     ['An app sends texts by itself', 'Unexpected application behavior', 'Malicious app.'],
     ['Private photos appear on a website', 'Leaked personal files/data', 'Data theft.']],
    'Fix: remove suspicious apps/profiles, update the OS, run mobile security software, change passwords — and factory-reset if in doubt.');
  M('c2-mobsec-wrap', 'Mobile security response', 'Combined 3.3',
    'Pick the best action.', ['Uninstall the sideloaded app', 'Disable developer mode', 'Factory reset (rooted/jailbroken)', 'Remove the unknown VPN/config profile', 'Change account passwords from a clean device', 'Ignore and close the fake warning'],
    [['Malicious APK from an unofficial store found', 'Uninstall the sideloaded app', 'Remove the source.'],
     ['User enabled USB debugging to "speed up" the phone', 'Disable developer mode', 'Close the door.'],
     ['Company phone was jailbroken', 'Factory reset (rooted/jailbroken)', 'Restore the security model.'],
     ['All traffic goes through a profile nobody installed knowingly', 'Remove the unknown VPN/config profile', 'Malicious config.'],
     ['Personal data was leaked from the phone', 'Change account passwords from a clean device', 'Assume credentials are stolen.'],
     ['Browser pop-up says the phone is infected and demands an app install', 'Ignore and close the fake warning', 'Scareware.']],
    'Remove the cause, restore trust in the device, then protect the accounts.');

  T('c2-adb', 'Clean a compromised Android phone', 'Android Debug Bridge (adb) from a support PC',
    'A company Android phone shows full-screen ads and burns data. MDM says "developer options enabled". The phone is connected by USB to your support PC with USB debugging authorized for this job only.',
    { shell: 'cmd', prompt: 'C:\\platform-tools>' },
    [{ t: 'Confirm the PC can see the phone.', accept: [/^adb devices$/i], show: 'adb devices', hint: 'adb devices', out: 'List of devices attached\nR58N91XYZ    device', why: '"device" = connected and authorized.' },
     { t: 'List only the third-party (user-installed) packages.', accept: [/^adb shell pm list packages -3$/i], show: 'adb shell pm list packages -3', hint: 'adb shell pm list packages with the switch for third-party apps (-3).', out: 'package:com.microsoft.teams\npackage:com.whatsapp\npackage:com.wh4tsapp.plus.free\npackage:com.okta.android.auth', ask: { q: 'Which package is the spoofed look-alike app?', accept: ['com.wh4tsapp.plus.free'], why: 'Misspelled publisher name and "plus.free" — a spoofed app, sideloaded from outside the store.' }, why: '3.3 — application spoofing.' },
     { t: 'Uninstall the spoofed app.', accept: [/^adb uninstall com\.wh4tsapp\.plus\.free$/i, /^adb shell pm uninstall com\.wh4tsapp\.plus\.free$/i], show: 'adb uninstall com.wh4tsapp.plus.free', hint: 'adb uninstall <package>', out: 'Success', why: 'Source of the ads and traffic removed.' },
     { t: 'Block installs from unknown sources by turning off developer options again.', accept: [/^adb shell settings put global development_settings_enabled 0$/i], show: 'adb shell settings put global development_settings_enabled 0', hint: 'adb shell settings put global development_settings_enabled 0', out: '', why: 'Closes the door that was opened. USB debugging turns off with it.' },
     { t: 'Verify the setting is now off.', accept: [/^adb shell settings get global development_settings_enabled$/i], show: 'adb shell settings get global development_settings_enabled', hint: 'settings get instead of put.', out: '0', ask: { q: 'What value means developer options are off?', accept: ['0'], why: '0 = off. MDM compliance will clear on the next check-in. Have the user change passwords used on the phone.' }, why: 'Verify, then document.' }],
    'Real help-desk flow: confirm connection → find the bad package → remove it → close developer mode → verify → change passwords.',
    ['adb is the Android support tool: adb devices, adb shell pm list packages -3, adb uninstall.']);

  RK.add({ track: TR, id: '3.3', dom: 3, moreLabs: ['c2-adb'], short: 'Mobile security issues', title: 'Given a scenario, troubleshoot common mobile OS and application security issues',
    goal: 'Recognize risky mobile practices (sideloading, developer mode, root/jailbreak, spoofed apps) and the symptoms of a compromised device.',
    kw: /\b(sideload|unofficial (app )?store|developer mode|root(ed|ing)?|jailbr|spoof(ed|ing)? app|high (network|data) traffic|data.usage|fake (security )?warning|leaked|unexpected app|mobile malware|ads on (the )?phone)/,
    parts: [
      P('Security concerns', 'Explain the risks of unofficial app stores, developer mode, root/jailbreak and spoofed apps.',
        `<ul><li><b>Application source / unofficial application stores</b> — installing outside the official store (<b>sideloading</b>) skips the store\'s malware screening.</li>
<li><b>Developer mode</b> — Android developer options (USB debugging, install over USB). Useful for developers, risky for everyone else.</li>
<li><b>Root access / jailbreak</b> — removes the OS sandbox and restrictions (root = Android, jailbreak = iOS). Malware gets full control; updates may break; MDM marks the device non-compliant.</li>
<li><b>Unauthorized/malicious application — application spoofing</b> — fake apps imitating real ones (copy-cat names and icons) to steal data or credentials.</li></ul>` + pro('Check the developer name and download count before installing — spoofed apps often have a slightly different publisher name.') + trap('Root is Android; jailbreak is iOS. Both have the same security consequence.'),
        [['What is the main risk of installing apps from an unofficial store?', 'The apps are not screened for malware', ['They use more battery', 'They cannot be updated', 'They disable NFC'], 'No vetting.'],
         ['Removing iOS restrictions to gain full control is called:', 'Jailbreaking', ['Rooting', 'Sideloading', 'Developer mode'], 'iOS = jailbreak.']],
        'c2-mobsec-concern'),
      P('Symptoms of a compromised device', 'Recognize mobile malware symptoms and respond.',
        `<p><b>Common symptoms:</b></p>
<ul><li><b>High network traffic</b> and <b>data-usage limit notifications</b> — something is uploading or downloading in the background.</li>
<li><b>Degraded response time</b> — lag, heat, fast battery drain.</li>
<li><b>Limited or no Internet connectivity</b> — malicious VPN/proxy profile intercepting traffic.</li>
<li><b>High number of ads</b> — adware, often from a sideloaded or fake app.</li>
<li><b>Fake security warnings</b> — scareware pushing a "cleaner" app.</li>
<li><b>Unexpected application behavior</b> — apps sending texts, opening by themselves, new unknown apps.</li>
<li><b>Leaked personal files/data</b>.</li></ul>
<p><b>Response:</b> remove suspicious apps and profiles, update the OS, scan with mobile security software, change passwords from a clean device; factory reset if in doubt (after confirming backups do not restore the bad app).</p>` + pro('Check Settings → VPN & device management (iOS) or Security → device admin apps (Android) for profiles and admin apps the user did not install.') + trap('A browser pop-up claiming the phone has viruses is itself the attack, not a real warning.'),
        [['A phone uses huge amounts of data while idle. What does this suggest?', 'Malware sending data in the background', ['A worn battery', 'Rotation lock', 'A full cache'], 'High network traffic.'],
         ['A pop-up says "Your phone is infected, install CleanerPro now". What is it?', 'A fake security warning (scareware)', ['A real antivirus alert', 'An OS update', 'An MDM message'], 'Do not install.']],
        'c2-mobsec-sym')
    ],
    wrap: { recap: ['Sideloading/unofficial stores skip malware screening.', 'Developer mode opens debugging/installs; disable it.', 'Root (Android) / jailbreak (iOS) break the security model; MDM blocks them.', 'Application spoofing = malicious look-alike apps.', 'Symptoms: high traffic, data-limit warnings, lag, no connectivity, ads, fake warnings, odd app behavior, leaked data.', 'Respond: remove app/profile, update, scan, change passwords, factory reset if in doubt.'], lab: 'c2-mobsec-wrap' }
  });

  // ===================== 3.4 PC security issues =====================
  T('c2-pcsec', 'Browser redirects and a hijacked PC', 'hosts file, proxy, DNS cache',
    'Ticket: "Every time I go to my bank, I get a different-looking site, and I get certificate warnings." Elevated Command Prompt on the PC.',
    { shell: 'cmd', prompt: 'C:\\Windows\\System32>' },
    [{ t: 'Show the contents of the Windows hosts file.', accept: [/^type c:\\windows\\system32\\drivers\\etc\\hosts$/i, /^type drivers\\etc\\hosts$/i, /^notepad c:\\windows\\system32\\drivers\\etc\\hosts$/i], show: 'type C:\\Windows\\System32\\drivers\\etc\\hosts', hint: 'type <path to hosts> — it is in System32\\drivers\\etc', out: '# Copyright (c) 1993-2009 Microsoft Corp.\n#\n# localhost name resolution is handled within DNS itself.\n185.243.115.7   www.firstbank.com\n185.243.115.7   firstbank.com', ask: { q: 'Which IP address is the bank\'s name being sent to?', accept: ['185.243.115.7'], why: 'Malware added a hosts entry: the bank name now resolves to an attacker\'s server — hence the redirect and the certificate warning.' }, why: 'The hosts file is checked before DNS.' },
     { t: 'Check whether a system proxy has also been set.', accept: [/^netsh winhttp show proxy$/i], show: 'netsh winhttp show proxy', hint: 'netsh winhttp show proxy', out: 'Current WinHTTP proxy settings:\n    Proxy Server(s) :  127.0.0.1:8877\n    Bypass List     :  (none)', ask: { q: 'Is a proxy set? (yes/no)', accept: ['yes'], why: 'A local proxy on 127.0.0.1:8877 — malware intercepting traffic. Legitimate company proxies point at a company server, not localhost.' }, why: 'Malware often changes proxy settings.' },
     { t: 'Reset the WinHTTP proxy to direct access.', accept: [/^netsh winhttp reset proxy$/i], show: 'netsh winhttp reset proxy', hint: 'netsh winhttp reset proxy', out: 'Current WinHTTP proxy settings:\n    Direct access (no proxy server).', why: 'Removes the rogue proxy (also check the browser/Internet Options proxy).' },
     { t: 'After removing the bad hosts lines (and running the malware removal procedure), clear the DNS cache.', accept: [/^ipconfig \/flushdns$/i], show: 'ipconfig /flushdns', hint: 'ipconfig with the flush switch.', out: 'Windows IP Configuration\n\nSuccessfully flushed the DNS Resolver Cache.', why: 'Removes any cached bad answers so the real bank address is used.' },
     { t: 'Confirm the bank now resolves through DNS.', accept: [/^nslookup (www\.)?firstbank\.com$/i], show: 'nslookup www.firstbank.com', hint: 'nslookup <name>', out: 'Server:  dns01.corp.local\nAddress:  10.20.30.5\n\nNon-authoritative answer:\nName:    www.firstbank.com\nAddress:  23.212.44.19', why: 'Real address; no certificate warning. Have the user change the bank password from a clean device.' }],
    'Redirects + certificate warnings = hosts file, proxy, DNS settings, or a malicious extension. Fix the setting, then run the full malware removal procedure, then change passwords.',
    ['hosts file → proxy → DNS cache → verify.']);
  M('c2-pcsym', 'PC security symptoms', 'What does each symptom suggest?',
    'Pick the most likely explanation.', ['Malware changed network settings', 'Fake antivirus (scareware)', 'Ransomware', 'Malware blocking updates', 'Browser hijacker / malicious extension', 'Interception or fake site (certificate)', 'Unwanted notifications from a site', 'Resource-hungry malware'],
    [['Unable to access the network; DNS and proxy were changed', 'Malware changed network settings', 'Common malware action.'],
     ['Alert from an antivirus product that was never installed demands payment', 'Fake antivirus (scareware)', 'False alerts.'],
     ['Files renamed to .encrypted and cannot be opened', 'Ransomware', 'Altered/inaccessible files.'],
     ['Windows Update fails every time and Defender cannot update', 'Malware blocking updates', 'OS update failures.'],
     ['Home page and search engine changed; searches redirect', 'Browser hijacker / malicious extension', 'Redirection.'],
     ['"Your connection is not private" on a site that worked yesterday', 'Interception or fake site (certificate)', 'Certificate warnings.'],
     ['Pop-up notifications in the corner of the desktop advertising "prizes"', 'Unwanted notifications from a site', 'A site was allowed to send notifications.'],
     ['Browser is very slow and CPU is high on every page', 'Resource-hungry malware', 'Degraded browser performance (cryptojacking).']],
    'Most of these share one fix: the malware removal procedure (2.6), then repair the specific setting.');
  M('c2-pcsec-wrap', 'PC security help desk', 'Combined 3.4',
    'Pick the best next step.', ['Run the malware removal procedure', 'Remove the extension and reset the browser', 'Check hosts file and proxy settings', 'Block site notifications', 'Restore files from backup after cleaning', 'Investigate the certificate before entering credentials', 'Repair Windows Update after removal'],
    [['Desktop alerts from a "PC Doctor" nobody installed', 'Run the malware removal procedure', 'Scareware is malware.'],
     ['Searches go to an unknown search engine', 'Remove the extension and reset the browser', 'Hijacker.'],
     ['All banking sites redirect to look-alikes', 'Check hosts file and proxy settings', 'Redirection.'],
     ['Notification pop-ups keep appearing from one website', 'Block site notifications', 'Browser settings.'],
     ['User\'s documents were renamed and encrypted', 'Restore files from backup after cleaning', 'Ransomware recovery.'],
     ['Certificate warning on the payroll portal', 'Investigate the certificate before entering credentials', 'Possible interception.'],
     ['Updates still fail after malware was removed', 'Repair Windows Update after removal', 'DISM/sfc, reset update components.']],
    'Identify the symptom → treat the PC as infected → fix the specific damage → protect the accounts.');

  RK.add({ track: TR, id: '3.4', dom: 3, short: 'PC security issues', title: 'Given a scenario, troubleshoot common personal computer (PC) security issues',
    goal: 'Recognize PC and browser symptoms of compromise and fix the settings malware changes.',
    kw: /\b(pop.?ups?|redirect|certificate warning|desktop alert|false alert|fake antivirus|rogue antivirus|altered (system )?files|renamed files|missing files|cannot access files|unwanted notification|update fail|hosts file|browser (slow|hijack)|degraded browser|unable to access the network)/,
    parts: [
      P('PC symptoms of compromise', 'Recognize network loss, false alerts, altered or inaccessible files, unwanted notifications and update failures as possible malware.',
        `<ul><li><b>Unable to access the network</b> — malware changed DNS, proxy or hosts settings, or disabled the adapter.</li>
<li><b>Desktop alerts</b> and <b>false alerts regarding antivirus protection</b> — scareware/fake antivirus demanding payment or an install.</li>
<li><b>Altered system or personal files</b> — <b>missing or renamed</b> files; extensions changed (ransomware).</li>
<li><b>Inability to access files</b> — encrypted (ransomware) or permissions changed.</li>
<li><b>Unwanted notifications within the OS</b> — a malicious app, or a website allowed to push notifications.</li>
<li><b>OS update failures</b> — malware often blocks Windows Update and antivirus updates to protect itself.</li></ul>
<p>Treat these as a possible infection: follow the malware removal procedure (2.6), then repair what was changed.</p>` + pro('Check for a malicious scheduled task or startup entry too — many infections reinstall themselves at every boot.') + trap('An antivirus alert from a product that is not installed is a false alert — the alert itself is the malware.'),
        [['Windows Update and Defender updates both fail repeatedly. What might this indicate?', 'Malware blocking updates', ['A slow profile', 'Rotation lock', 'A bad monitor'], 'Self-protection.'],
         ['Files suddenly have new extensions and will not open. Most likely?', 'Ransomware', ['Adware', 'Time drift', 'Low memory'], 'Encrypted files.']],
        'c2-pcsym'),
      P('Browser-related symptoms', 'Diagnose pop-ups, certificate warnings, redirection and degraded browser performance.',
        `<ul><li><b>Random/frequent pop-ups</b> — adware, a malicious extension, or site notifications the user allowed. Remove extensions, block notifications, reset the browser.</li>
<li><b>Certificate warnings</b> — the site\'s certificate is not trusted, expired, or for a different name. Could be interception (on-path, rogue proxy), a fake site from a hosts/DNS change, or a wrong PC clock. Never enter credentials past a warning on a sensitive site.</li>
<li><b>Redirection</b> — searches or sites go elsewhere: browser hijacker, changed hosts file, DNS or proxy.</li>
<li><b>Degraded browser performance</b> — too many extensions, cryptojacking scripts, or malware.</li></ul>
<p>Places to check: extensions list, browser proxy (and <code>netsh winhttp show proxy</code>), the <b>hosts</b> file (<code>C:\\Windows\\System32\\drivers\\etc\\hosts</code>), DNS servers in <code>ipconfig /all</code>, and the PC clock.</p>` + pro('A certificate warning on every HTTPS site at once usually means the clock is wrong or a proxy is intercepting — not that every website broke.') + trap('Clearing the cache will not fix a redirect caused by the hosts file or proxy; fix the setting.'),
        [['Every attempt to reach the bank goes to a look-alike site. Where do you look?', 'The hosts file, proxy and DNS settings', ['The rotation lock', 'Device Manager', 'Disk Management'], 'Redirection causes.'],
         ['Certificate warnings appear on every HTTPS site. A quick thing to check is:', 'The PC\'s date and time', ['The wallpaper', 'The keyboard layout', 'The screen resolution'], 'Wrong clock invalidates certificates.']],
        'c2-pcsec')
    ],
    wrap: { recap: ['PC symptoms: no network, desktop/false AV alerts, altered/renamed/missing files, inaccessible files, unwanted notifications, update failures.', 'Treat them as infection: malware removal procedure, then repair settings.', 'Browser: pop-ups (adware/extensions/notifications), certificate warnings (interception, fake site, clock), redirection (hijacker, hosts, DNS, proxy), slow browser.', 'Check extensions, proxy (netsh winhttp), hosts file, DNS, clock.', 'Never enter credentials past a certificate warning on a sensitive site.'], lab: 'c2-pcsec-wrap' }
  });

  // ===================== Domain 3 combined terminal lab =====================
  T('c2-d3-wrap', 'Domain 3 shift: "my PC is acting weird"', 'Windows + security troubleshooting',
    'Ticket: "My PC is slow, a service I need stopped working, and websites look strange." Elevated PowerShell. No hints in the tasks.',
    { shell: 'ps', prompt: 'PS C:\\Windows\\system32>' },
    [{ t: '<b>3.1</b> — List the 5 processes using the most CPU time.', accept: [/^get-process \| sort(-object)? (-property )?cpu -descending \| select(-object)? -first 5$/i, /^gps \| sort cpu -desc(ending)? \| select -first 5$/i], show: 'Get-Process | Sort-Object CPU -Descending | Select-Object -First 5', hint: '3.1 — Get-Process | Sort-Object CPU -Descending | Select-Object -First 5', out: 'ProcessName   CPU(s)\n-----------   ------\nwinsvchost    18402.6\nmsedge          912.3\nexplorer        301.8\nTeams           288.0\nOUTLOOK         140.2', ask: { q: 'Which process name looks suspicious (it imitates a real Windows process)?', accept: ['winsvchost'], why: 'The real process is svchost.exe. "winsvchost" burning CPU suggests a cryptominer.' }, why: '3.1/3.4 — degraded performance can be malware.' },
     { t: '<b>3.4</b> — Check the system proxy setting.', accept: [/^netsh winhttp show proxy$/i], show: 'netsh winhttp show proxy', hint: '3.4 — netsh winhttp', out: '    Proxy Server(s) :  127.0.0.1:9050', why: '3.4 — rogue local proxy explains the strange websites.' },
     { t: '<b>2.6</b> — Run a full Defender scan.', accept: [/^start-mpscan -scantype fullscan$/i], show: 'Start-MpScan -ScanType FullScan', hint: '2.6 — Start-MpScan', out: 'Threats found: 1\n  Trojan:Win32/CoinMiner   C:\\ProgramData\\winsvchost\\winsvchost.exe   Removed', why: 'Malware removed.' },
     { t: '<b>3.4</b> — Reset the proxy.', accept: [/^netsh winhttp reset proxy$/i], show: 'netsh winhttp reset proxy', hint: '3.4 — netsh winhttp reset', out: '    Direct access (no proxy server).', why: 'Setting repaired.' },
     { t: '<b>3.1</b> — Check the service <b>VaultSync</b> the user needs.', accept: [/^get-service vaultsync( \| select(-object)? (name,\s?)?status,\s?starttype)?$/i], show: 'Get-Service VaultSync', hint: '3.1 — Get-Service', out: 'Status   Name       DisplayName\n------   ----       -----------\nStopped  VaultSync  Vault Sync Service', why: 'Stopped (the malware had disabled it).' },
     { t: '<b>3.1</b> — Start it.', accept: [/^start-service( -name)? vaultsync$/i], show: 'Start-Service VaultSync', hint: '3.1 — Start-Service', out: '', why: 'Service restored.' },
     { t: '<b>3.1</b> — Repair system files after the infection.', accept: [/^sfc \/scannow$/i], show: 'sfc /scannow', hint: '3.1 — System File Checker', out: 'Windows Resource Protection found corrupt files and successfully repaired them.', why: 'System files repaired. Next: educate the user and close the ticket.' }],
    'Domain 3 in one ticket: performance (3.1), browser and network tampering (3.4), malware removal (2.6), services (3.1), and repair (3.1).',
    ['Each task names its objective. Flip back to it if you are stuck.']);

  // ---------- extra questions + cards ----------
  RK.extra(TR, '3.1', [
    ['Which tool checks RAM for errors after repeated BSODs?', 'Windows Memory Diagnostic', ['Disk Cleanup', 'msinfo32', 'w32tm'], 'Tests memory at boot.'],
    ['Which Event ID in the System log records an unexpected shutdown?', '41', ['1000', '4624', '7036'], 'Kernel-Power 41.'],
    ['What should you run before sfc when system file repair fails?', 'DISM /Online /Cleanup-Image /RestoreHealth', ['bootrec /fixmbr', 'gpupdate /force', 'diskpart clean'], 'Repair the store.'],
    ['Where do you reach Startup Repair?', 'Windows Recovery Environment', ['Task Manager', 'Device Manager', 'Control Panel → Sound'], 'WinRE.'],
    ['A user\'s clock is wrong every morning after the PC is unplugged overnight. Likely cause?', 'Failing CMOS battery', ['Corrupt profile', 'Bad driver', 'Full disk'], 'Firmware clock loses time.'],
    ['Many USB devices on one dock produce resource warnings. Fix?', 'Spread devices across different USB controllers/ports', ['Rebuild the BCD', 'Reimage', 'Disable the firewall'], 'Controller limits.']
  ]);
  RK.extra(TR, '3.2', [
    ['Which phone setting stops the screen rotating?', 'Rotation lock', ['Airplane mode', 'NFC', 'Developer mode'], 'Autorotate.'],
    ['Which fix resets Wi-Fi, Bluetooth and VPN settings without erasing apps?', 'Reset network settings', ['Factory reset', 'Clear app data', 'Remote wipe'], 'Network-only reset.'],
    ['Tap-to-pay fails. What should you check first?', 'That NFC is enabled and the wallet app is the default', ['Rotation lock', 'Battery health', 'Bluetooth pairing'], 'NFC.'],
    ['A phone reboots at random after a new app install. First step?', 'Remove or update that app', ['Replace the screen', 'Disable Wi-Fi', 'Factory reset immediately'], 'Most recent change.'],
    ['Which fixes an app that is stuck and will not close?', 'Force-stop it', ['Rotation lock', 'Enable NFC', 'Reset network settings'], 'Kill the process.'],
    ['An app requires a newer OS. What is the fix?', 'Update the OS if the device supports it', ['Clear the cache', 'Root the phone', 'Enable developer mode'], 'Compatibility.'],
    ['Where do you find which app drains the battery?', 'Battery usage in Settings', ['Developer options', 'Wallet', 'Rotation settings'], 'Per-app usage.']
  ]);
  RK.extra(TR, '3.3', [
    ['Which Android setting allows USB debugging?', 'Developer mode / developer options', ['Airplane mode', 'Battery saver', 'Rotation lock'], 'Hidden developer settings.'],
    ['Why do organizations block rooted or jailbroken devices?', 'The OS security controls are bypassed', ['They are slower', 'They use more data', 'They cannot use Wi-Fi'], 'Broken security model.'],
    ['An unknown VPN profile appeared and the phone has no Internet. Likely?', 'A malicious configuration profile', ['Weak battery', 'Rotation lock', 'Low storage'], 'Traffic interception.'],
    ['A fake app imitates a real banking app. This is called:', 'Application spoofing', ['Jailbreaking', 'Rooting', 'Developer mode'], 'Look-alike app.'],
    ['Many full-screen ads appear on a phone\'s home screen. Most likely?', 'Adware from a malicious or sideloaded app', ['A worn battery', 'NFC fault', 'Low brightness'], 'High number of ads.'],
    ['What should a user do after data was leaked from a compromised phone?', 'Change passwords from a clean device', ['Rotate the screen', 'Clear the browser cache', 'Disable NFC'], 'Protect accounts.'],
    ['Which symptom suggests a phone is sending data in the background?', 'Data-usage limit warnings early in the month', ['Rotation lock on', 'Screen brightness low', 'Bluetooth off'], 'Hidden traffic.'],
    ['Which source is safest for installing mobile apps?', 'The official app store', ['A forum link', 'A text message link', 'A file-sharing site'], 'Vetted apps.'],
    ['A phone is laggy, hot and drains fast while idle. Possible cause?', 'Malware running in the background', ['Rotation lock', 'NFC off', 'Airplane mode'], 'Degraded response time.'],
    ['Root access applies to which mobile OS?', 'Android', ['iOS', 'iPadOS', 'ChromeOS only'], 'Jailbreak is iOS.'],
    ['What is the safest response to a fake security warning on a phone?', 'Close it without installing anything', ['Install the recommended cleaner', 'Call the number shown', 'Enable developer mode'], 'Scareware.']
  ]);
  RK.extra(TR, '3.4', [
    ['Where is the Windows hosts file?', 'C:\\Windows\\System32\\drivers\\etc\\hosts', ['C:\\Program Files\\hosts', 'C:\\Users\\Public\\hosts', 'C:\\Windows\\hosts.ini'], 'Checked before DNS.'],
    ['Which command shows the system WinHTTP proxy?', 'netsh winhttp show proxy', ['ipconfig /all', 'nslookup', 'netstat -an'], 'Proxy setting.'],
    ['Which command clears cached DNS answers?', 'ipconfig /flushdns', ['ipconfig /renew', 'sfc /scannow', 'gpupdate'], 'DNS resolver cache.'],
    ['Pop-up "notifications" come from a website the user allowed. Fix?', 'Block that site\'s notification permission', ['Reimage', 'Replace RAM', 'Reset BIOS'], 'Browser setting.'],
    ['Browser is slow and CPU is high on every page. Possible cause?', 'A cryptojacking script or malicious extension', ['Rotation lock', 'Time drift', 'Corrupt BCD'], 'Degraded browser performance.'],
    ['After cleaning ransomware, how are the user\'s files recovered?', 'Restore from a clean backup', ['Rename them back', 'Run chkdsk', 'Clear the cache'], 'Backup recovery.'],
    ['A fake antivirus alert demands payment. What is the correct response?', 'Treat the PC as infected and run the malware removal procedure', ['Pay to remove it', 'Ignore it permanently', 'Disable Windows Update'], 'Scareware is malware.']
  ]);
  RK.cards(TR, '3.1', [['bootrec /rebuildbcd', 'Rebuild Boot Configuration Data from WinRE.'], ['DISM then sfc', 'Repair the component store, then system files.'], ['Event ID 41', 'Unexpected shutdown (Kernel-Power).'], ['Time drift', 'w32tm /query /status, w32tm /resync; CMOS battery.'], ['Slow profile, one user', 'Rebuild that Windows profile.'], ['Service will not start', 'Start type, dependencies, logon account, System log.']]);
  RK.cards(TR, '3.2', [['Clear cache vs clear data', 'Cache = temporary files; data = full app reset.'], ['Reset network settings', 'Resets Wi-Fi, Bluetooth, VPN — keeps apps and data.'], ['OS update prerequisites', 'Storage, battery/charging, Wi-Fi, supported device.'], ['No autorotate', 'Rotation lock.']]);
  RK.cards(TR, '3.3', [['Sideloading', 'Installing apps outside the official store.'], ['Root / jailbreak', 'Android / iOS restrictions removed; device untrusted.'], ['Application spoofing', 'Fake look-alike app.'], ['Fake security warning', 'Scareware; never install what it offers.']]);
  RK.cards(TR, '3.4', [['hosts file', 'C:\\Windows\\System32\\drivers\\etc\\hosts — checked before DNS; malware edits it.'], ['netsh winhttp reset proxy', 'Removes a system proxy.'], ['Certificate warning everywhere', 'Check the clock, then for interception.'], ['Redirection', 'Hijacker extension, hosts, DNS or proxy.']]);
})();
