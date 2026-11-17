/* A+ Core 2 Domain 2 — extra objective-test questions for thin objectives. */
(function () {
  var RK = window.RK, TR = 'core2';
  RK.extra(TR, '2.7', [
    ['Which account should always be disabled on a workstation?', 'Guest', ['Administrator', 'SYSTEM', 'The current user'], 'Guest gives anonymous access.'],
    ['Which control limits a shift worker\'s account to business hours?', 'Restrict log-in times', ['Account expiration', 'AutoRun', 'BIOS password'], 'Time-of-day restriction.'],
    ['Which control protects data if a laptop\'s drive is removed?', 'Data-at-rest encryption', ['Screen saver lock', 'Password expiration', 'Log-in times'], 'BitLocker/FileVault.'],
    ['Why change the default administrator account password?', 'Default credentials are publicly known', ['It speeds up logins', 'It enables AutoRun', 'It is required for Wi-Fi'], 'Defaults are the first thing attackers try.'],
    ['What does disabling unused services achieve?', 'Reduces the attack surface', ['Increases RAM', 'Enables encryption', 'Removes the Guest account'], 'Fewer listening services.'],
    ['Which habit protects an unattended unlocked PC?', 'Lock the screen (Win + L) or a screen saver lock', ['Turn off the monitor', 'Close the browser', 'Unplug the keyboard'], 'Requires a password to resume.']
  ]);
  RK.extra(TR, '2.8', [
    ['Which screen lock types are biometric?', 'Facial recognition and fingerprint', ['PIN and pattern', 'Swipe and PIN', 'Pattern and swipe'], 'Something you are.'],
    ['A phone is lost inside the office. What should be tried first?', 'A locator application', ['Remote wipe', 'Factory reset', 'New SIM card'], 'Locate before wiping.'],
    ['Which keeps phones protected against newly found vulnerabilities?', 'OS and application updates', ['A swipe lock', 'Disabling Bluetooth', 'Remote backup'], 'Patch management.'],
    ['Which software blocks malicious websites on company tablets?', 'Endpoint security with content filtering', ['Locator app', 'Remote backup', 'A configuration profile only'], 'Mobile security software.'],
    ['What do profile security requirements in MDM typically check?', 'Minimum OS version, passcode and encryption', ['Wallpaper and ringtone', 'Battery health only', 'Screen brightness'], 'Compliance before access.'],
    ['Which lets a user restore contacts and photos to a replacement phone?', 'Remote backup application', ['Remote wipe', 'Failed log-in restriction', 'Content filtering'], 'Cloud backup.'],
    ['Under BYOD, who owns the device?', 'The employee', ['The company', 'The carrier', 'The MDM vendor'], 'Bring your own device.'],
    ['What is pushed to a phone to set Wi-Fi, VPN and email settings?', 'A configuration profile', ['A remote wipe', 'A locator app', 'A screen lock'], 'Settings package.']
  ]);
  RK.extra(TR, '2.10', [
    ['A SOHO router\'s Wi-Fi name is "Linksys-E9450". Why change it?', 'It reveals the router make and model to attackers', ['It slows the network', 'It disables WPA3', 'It breaks DHCP'], 'Do not advertise the device.'],
    ['Which firewall step reduces exposure on a SOHO router?', 'Disable ports and forwards that are not needed', ['Forward every port to one PC', 'Enable UPnP', 'Turn off the firewall'], 'Minimal exposure.'],
    ['Which setting blocks categories of websites for every device on a SOHO network?', 'Content filtering', ['IP filtering', 'Port forwarding', 'SSID broadcast'], 'Category-based.']
  ]);
})();
