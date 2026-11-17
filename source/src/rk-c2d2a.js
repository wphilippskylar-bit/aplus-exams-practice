/* A+ Core 2 (220-1202) — Domain 2.0 Security — objectives 2.1 to 2.5 */
(function () {
  var RK = window.RK, P = RK.P, M = RK.M, O = RK.O, T = RK.T, TR = 'core2';
  function pro(t) { return '<div class="callout pro"><b class="k">On the job</b>' + t + '</div>'; }
  function trap(t) { return '<div class="callout trap"><b class="k">Exam trap</b>' + t + '</div>'; }

  // ===================== 2.1 Security measures =====================
  M('c2-phys', 'Physical security controls', 'Pick the control',
    'Pick the physical control that best fits each need.', ['Bollards', 'Access control vestibule', 'Badge reader', 'Video surveillance', 'Alarm system', 'Motion sensor', 'Door lock', 'Equipment lock', 'Security guard', 'Fence'],
    [['Stop a vehicle being driven into the building entrance', 'Bollards', 'Short posts that block vehicles.'],
     ['Two doors where the second opens only after the first closes, to stop tailgating', 'Access control vestibule', 'Formerly "mantrap".'],
     ['Log who enters the server room and when', 'Badge reader', 'Electronic access with an audit trail.'],
     ['Record the loading dock for later review', 'Video surveillance', 'Detect and deter.'],
     ['Alert the monitoring company when a door is forced at night', 'Alarm system', 'Detect and respond.'],
     ['Turn on lights or trigger alerts when someone enters an empty room', 'Motion sensor', 'Presence detection.'],
     ['Basic keyed lock on the wiring closet', 'Door lock', 'Simplest barrier.'],
     ['Cable lock that stops a laptop walking off a desk', 'Equipment lock', 'Kensington-style lock.'],
     ['A person who checks IDs and can make judgment calls', 'Security guard', 'Flexible human control.'],
     ['Perimeter barrier around the parking lot and generator', 'Fence', 'Outer layer.']],
    'Layers: fence and bollards outside, guards and vestibules at the entry, badges and locks inside, cameras and alarms everywhere.');
  M('c2-access', 'How do people prove who they are at the door?', 'Physical access methods and biometrics',
    'Pick the access method each description fits.', ['Key fob', 'Smart card', 'Mobile digital key', 'Physical key', 'Fingerprint', 'Retina scan', 'Palm print', 'Facial recognition', 'Voice recognition', 'Lighting', 'Magnetometer'],
    [['Small proximity token you tap on a reader', 'Key fob', 'RFID/NFC token.'],
     ['Badge with an embedded chip that also holds a certificate for PC sign-in', 'Smart card', 'Something you have, with a chip.'],
     ['Phone app that unlocks the door over NFC or Bluetooth', 'Mobile digital key', 'The phone is the badge.'],
     ['Cheapest option; cannot tell you who used it', 'Physical key', 'No audit trail; keys get copied.'],
     ['Touch sensor on a laptop or door', 'Fingerprint', 'Common biometric.'],
     ['Scans the blood-vessel pattern at the back of the eye', 'Retina scan', 'Very accurate, intrusive.'],
     ['Reads the vein pattern of the hand', 'Palm print', 'Contactless biometric.'],
     ['Camera matches the face to the enrolled user', 'Facial recognition', 'Windows Hello, phones.'],
     ['Matches the speaker\'s voice pattern', 'Voice recognition', 'Least reliable (noise, colds).'],
     ['Bright exterior lights that remove hiding places', 'Lighting', 'Deterrent.'],
     ['Walk-through metal detector at the entrance', 'Magnetometer', 'Detects weapons/metal objects.']],
    'Keys and fobs are "something you have"; biometrics are "something you are".');
  M('c2-mfa', 'Logical access and MFA', 'Least privilege, zero trust, ACLs, MFA types',
    'Pick the term for each description.', ['Least privilege', 'Zero trust', 'Access control list', 'Hardware token', 'Authenticator app', 'SMS code', 'Email code', 'Voice call', 'TOTP'],
    [['A help-desk tech gets password-reset rights only, not domain admin', 'Least privilege', 'Minimum access to do the job.'],
     ['Every request is verified, even from inside the office network', 'Zero trust', 'Never trust, always verify.'],
     ['A list of who may read or change a folder', 'Access control list', 'ACL.'],
     ['Physical USB/NFC key such as a FIDO2 security key', 'Hardware token', 'Strongest common factor.'],
     ['App on your phone that shows a 6-digit code or a push prompt', 'Authenticator app', 'Code or push approval.'],
     ['Code sent as a text message', 'SMS code', 'Weakest of the common methods (SIM swapping).'],
     ['Code sent to your mailbox', 'Email code', 'Only as safe as the mailbox.'],
     ['Automated phone call reads you a code', 'Voice call', 'Phone-based OTP.'],
     ['Code that changes every 30 seconds based on the time', 'TOTP', 'Time-based one-time password.']],
    'MFA = two different factor types. A password plus a security question is still one factor (both are "know").');
  M('c2-iam', 'Identity and data controls', 'SAML, SSO, JIT/PAM, MDM, DLP, IAM, directory services',
    'Pick the technology for each need.', ['SSO', 'SAML', 'Just-in-time access / PAM', 'MDM', 'DLP', 'IAM', 'Directory services'],
    [['Log in once in the morning and reach email, HR and CRM without logging in again', 'SSO', 'Single sign-on.'],
     ['XML standard that passes the user\'s identity from the company login page to a cloud app', 'SAML', 'Federation for web SSO.'],
     ['Admin rights granted for 2 hours for one approved task, then removed automatically', 'Just-in-time access / PAM', 'Privileged access management.'],
     ['Enforce a passcode and encryption on every company phone, and wipe lost ones', 'MDM', 'Mobile device management.'],
     ['Block an email that contains 40 credit card numbers from leaving the company', 'DLP', 'Data loss prevention.'],
     ['The overall process of creating, managing and removing user identities and access', 'IAM', 'Identity and access management.'],
     ['Central database of users, groups and computers, such as Active Directory', 'Directory services', 'LDAP-based directory.']],
    'IAM is the umbrella. Directory services store identities; SSO/SAML reuse them; PAM controls the powerful ones.');
  M('c2-sec-wrap', 'Security measures review', 'Combined 2.1',
    'Pick the best control for each risk.', ['Access control vestibule', 'Bollards', 'Video surveillance', 'Biometrics', 'Least privilege', 'MFA', 'Just-in-time access / PAM', 'DLP', 'MDM', 'SSO'],
    [['Tailgaters follow staff into the data center', 'Access control vestibule', 'One person at a time.'],
     ['Vehicle attack on the front lobby', 'Bollards', 'Stop vehicles.'],
     ['Need evidence of who took a laptop from reception', 'Video surveillance', 'Record and review.'],
     ['Badges are shared between staff', 'Biometrics', 'Cannot be lent.'],
     ['Interns can read the payroll share', 'Least privilege', 'Remove unneeded access.'],
     ['Phished passwords are used to log into webmail', 'MFA', 'A second factor stops it.'],
     ['Domain admin accounts are permanently active and targeted', 'Just-in-time access / PAM', 'Standing privilege removed.'],
     ['Staff email customer lists to personal accounts', 'DLP', 'Inspect and block outbound data.'],
     ['Lost phones still have company email on them', 'MDM', 'Remote wipe and policy.'],
     ['Users reuse weak passwords because they have 15 logins', 'SSO', 'One strong login.']],
    'Match the control to the risk; the exam rewards the most specific control.');

  RK.add({ track: TR, id: '2.1', dom: 2, short: 'Security measures', title: 'Summarize various security measures and their purposes',
    goal: 'Choose physical, physical-access and logical security controls — including MFA types, SSO/SAML, PAM, MDM, DLP and directory services.',
    kw: /\b(bollard|vestibule|mantrap|badge|surveillance|cctv|camera|alarm|motion sensor|door lock|cable lock|guard|fence|key fob|smart card|biometric|retina|fingerprint|palm|facial|voice recognition|magnetometer|least privilege|zero trust|\bmfa\b|multifactor|two.factor|hardware token|authenticator|\botp\b|totp|\bsaml\b|\bsso\b|single sign|just.in.time|\bpam\b|\bmdm\b|\bdlp\b|data loss|\biam\b|directory service)/,
    parts: [
      P('Physical security', 'Pick bollards, vestibules, badge readers, cameras, alarms, sensors, locks, guards and fences for a site.',
        `<p>Physical security keeps people from reaching equipment they should not touch. Think in <b>layers</b>, outside in:</p>
<ul><li><b>Fences</b> and <b>bollards</b> (posts that stop vehicles) at the perimeter.</li>
<li><b>Security guards</b> — the only control that can use judgment.</li>
<li><b>Access control vestibule</b> — two interlocking doors; the inner one opens only after the outer one closes. Stops <b>tailgating</b>.</li>
<li><b>Badge readers</b> — open doors and log who entered and when.</li>
<li><b>Video surveillance</b>, <b>alarm systems</b> and <b>motion sensors</b> — detect, deter and record.</li>
<li><b>Door locks</b> on rooms and closets; <b>equipment locks</b> (cable locks) on laptops and racks.</li></ul>` + pro('Walk the building once with fresh eyes: propped fire doors and unlocked wiring closets defeat every expensive control.') + trap('An access control vestibule (old name: mantrap) is the answer to "prevent tailgating" — not a camera.'),
        [['Which control stops an unauthorized person following an employee through a secure door?', 'Access control vestibule', ['Video surveillance', 'Bollards', 'Motion sensor'], 'Only one person passes at a time.'],
         ['What are bollards for?', 'Stopping vehicles reaching a building', ['Logging badge entries', 'Detecting motion', 'Locking laptops'], 'Short sturdy posts.']],
        'c2-phys'),
      P('Physical access: badges, keys and biometrics', 'Compare key fobs, smart cards, mobile keys, keys and biometrics, plus lighting and magnetometers.',
        `<p><b>Something you have:</b></p>
<ul><li><b>Key fobs</b> — tap-to-open proximity tokens.</li>
<li><b>Smart cards</b> — badges with a chip; can also hold a certificate to sign in to PCs.</li>
<li><b>Mobile digital key</b> — the phone unlocks the door (NFC/Bluetooth).</li>
<li><b>Keys</b> — cheap, but copyable and leave no record.</li></ul>
<p><b>Something you are — biometrics:</b> <b>retina</b> (very accurate, intrusive), <b>fingerprint</b>, <b>palm print</b>, <b>facial recognition</b>, <b>voice recognition</b> (least reliable). Biometrics cannot be lent, but they cannot be changed if stolen either.</p>
<p><b>Supporting controls:</b> <b>lighting</b> removes hiding places and helps cameras; <b>magnetometers</b> (metal detectors) screen people entering.</p>` + pro('When someone leaves, deactivating their badge is part of off-boarding — the same day, not at the end of the month.') + trap('A smart card is "something you have" even though it holds a certificate. Add a PIN and it becomes two factors.'),
        [['Which access method is "something you are"?', 'Palm print', ['Smart card', 'Key fob', 'PIN'], 'Biometric.'],
         ['Which physical access method provides no record of who used it?', 'A traditional key', ['Badge reader', 'Smart card', 'Mobile digital key'], 'Keys leave no log.']],
        'c2-access'),
      P('Logical security: least privilege, zero trust, ACLs and MFA', 'Apply least privilege, zero trust and ACLs, and rank MFA methods.',
        `<ul><li><b>Principle of least privilege</b> — every account gets only the access its job needs, for only as long as needed.</li>
<li><b>Zero Trust model</b> — no implicit trust for being "inside"; every request is authenticated and authorized.</li>
<li><b>Access control lists (ACLs)</b> — lists of who may do what to a resource (folders, routers, firewalls).</li></ul>
<p><b>Multifactor authentication (MFA)</b> = two or more <i>different</i> factor types (know / have / are / where). Methods, roughly strongest to weakest:</p>
<ol><li><b>Hardware token</b> (security key, FIDO2) — phishing-resistant.</li>
<li><b>Authenticator application</b> — push approval or a <b>TOTP</b> code (time-based one-time password, changes every 30 s).</li>
<li><b>One-time password (OTP)</b> by <b>SMS</b>, <b>voice call</b> or <b>email</b> — better than nothing; SMS is vulnerable to SIM swapping and email to mailbox compromise.</li></ol>` + pro('Watch for "MFA fatigue": attackers spam push prompts until a tired user taps Approve. Teach users to deny prompts they did not start, and turn on number matching.') + trap('Password + PIN is not MFA: both are something you know.'),
        [['Which MFA method is the most resistant to phishing?', 'Hardware security key', ['SMS code', 'Email code', 'Voice call'], 'The key checks the real site.'],
         ['What does TOTP stand for?', 'Time-based one-time password', ['Token of trusted password', 'Two-option temporary passcode', 'Total one-time protection'], 'Codes change every 30 seconds.']],
        'c2-mfa'),
      P('Identity and data controls', 'Explain SAML, SSO, just-in-time/PAM, MDM, DLP, IAM and directory services.',
        `<ul><li><b>IAM</b> (identity and access management) — the whole process of creating identities, granting access, reviewing it and removing it.</li>
<li><b>Directory services</b> — the central store of users, groups and computers (Active Directory, Entra ID), queried with LDAP.</li>
<li><b>SSO</b> (single sign-on) — authenticate once, reach many apps.</li>
<li><b>SAML</b> — the XML standard that carries "this user is authenticated" from an identity provider to web/cloud apps; how most cloud SSO works.</li>
<li><b>Just-in-time access / PAM</b> (privileged access management) — admin rights are checked out for a limited time, approved and logged, then removed.</li>
<li><b>MDM</b> (mobile device management) — enforce passcodes, encryption, app rules; locate and wipe devices.</li>
<li><b>DLP</b> (data loss prevention) — inspects email, uploads and USB copies and blocks sensitive data leaving.</li></ul>` + pro('Admins should have two accounts: a normal one for email and browsing, and a separate privileged one used only for admin work.') + trap('SSO is the experience (log in once); SAML is one protocol that makes it work for web apps.'),
        [['Which control blocks an email containing customer card numbers from leaving the company?', 'DLP', ['SSO', 'MDM', 'SAML'], 'Data loss prevention.'],
         ['Admin rights granted for a limited time and then removed automatically describes:', 'Just-in-time access / PAM', ['Zero trust', 'Directory services', 'Least privilege only'], 'No standing privilege.']],
        'c2-iam')
    ],
    wrap: { recap: ['Physical layers: fences, bollards, guards, vestibules, badge readers, cameras, alarms, motion sensors, door and equipment locks.', 'Access: key fobs, smart cards, mobile keys, keys; biometrics (retina, fingerprint, palm, face, voice); lighting; magnetometers.', 'Least privilege, zero trust, ACLs.', 'MFA = different factor types. Hardware token > authenticator app/TOTP > SMS/voice/email OTP.', 'IAM, directory services, SSO, SAML, just-in-time/PAM.', 'MDM manages mobile devices; DLP stops sensitive data leaving.'], lab: 'c2-sec-wrap' }
  });

  // ===================== 2.2 Windows security settings + Active Directory =====================
  T('c2-defender', 'Check Defender and the firewall', 'Get-MpComputerStatus, Update-MpSignature, Get-NetFirewallProfile',
    'A user\'s laptop shows a "Virus & threat protection" warning. You are in an elevated PowerShell on it.',
    { shell: 'ps', prompt: 'PS C:\\Windows\\system32>' },
    [{ t: 'Show Microsoft Defender\'s status.', accept: [/^get-mpcomputerstatus$/i], show: 'Get-MpComputerStatus', hint: 'Get-Mp…Status', out: 'AMRunningMode                 : Normal\nAntivirusEnabled              : True\nRealTimeProtectionEnabled     : True\nAntivirusSignatureLastUpdated : 10/02/2026 06:14:51\nAntivirusSignatureAge         : 46', ask: { q: 'How many days old are the virus definitions?', accept: ['46'], why: 'Definitions should be hours old, not 46 days. New malware is not being recognized.' }, why: 'Defender is on, but its definitions are stale.' },
     { t: 'Update the virus definitions now.', accept: [/^update-mpsignature$/i], show: 'Update-MpSignature', hint: 'Update-Mp…', out: '', why: 'Same as "Check for updates" in Windows Security.' },
     { t: 'Run a quick scan.', accept: [/^start-mpscan( -scantype quickscan)?$/i], show: 'Start-MpScan -ScanType QuickScan', hint: 'Start-MpScan -ScanType …', out: 'Scan completed. No threats found.', why: 'Quick scan checks the most common infection locations.' },
     { t: 'Show whether the Windows firewall is on for each network profile.', accept: [/^get-netfirewallprofile( \| (format-table|ft) name,\s?enabled)?$/i], show: 'Get-NetFirewallProfile', hint: 'Get-NetFirewall…', out: 'Name    : Domain\nEnabled : True\n\nName    : Private\nEnabled : True\n\nName    : Public\nEnabled : False', ask: { q: 'Which profile has the firewall turned off?', accept: ['public'], why: 'Off on Public — exactly the profile used on hotel and coffee-shop Wi-Fi.' }, why: 'Each profile is switched on or off separately.' },
     { t: 'Turn the firewall on for the Public profile.', accept: [/^set-netfirewallprofile -(name|profile) public -enabled true$/i], show: 'Set-NetFirewallProfile -Name Public -Enabled True', hint: 'Set-NetFirewallProfile -Name … -Enabled True', out: '', why: 'Never leave a profile off. Allow a specific app or port instead.' },
     { t: 'The user\'s accounting app needs inbound TCP 8443. Allow only that port, inbound.', accept: [/^new-netfirewallrule -displayname ["'][^"']+["'] -direction inbound -protocol tcp -localport 8443 -action allow$/i, /^new-netfirewallrule -displayname ["'][^"']+["'] -direction inbound -localport 8443 -protocol tcp -action allow$/i], show: 'New-NetFirewallRule -DisplayName "AcctApp 8443" -Direction Inbound -Protocol TCP -LocalPort 8443 -Action Allow', hint: 'New-NetFirewallRule -DisplayName "…" -Direction Inbound -Protocol TCP -LocalPort 8443 -Action Allow', out: 'Name        : {6c1e…}\nDisplayName : AcctApp 8443\nEnabled     : True\nDirection   : Inbound\nAction      : Allow', why: 'Port security: allow one port, not the whole firewall.' }],
    'Defender: on, real-time, current definitions. Firewall: on for every profile, with narrow exceptions for specific apps or ports.',
    ['Defender cmdlets start with -Mp; firewall cmdlets with -NetFirewall.']);
  M('c2-users', 'Accounts, sign-in and UAC', 'Users and groups, log-in options, UAC',
    'Pick the term for each description.', ['Standard user', 'Administrator', 'Guest', 'Power user', 'Microsoft account', 'Local account', 'Windows Hello (PIN/biometric)', 'UAC', 'Run as administrator'],
    [['Can use apps and change their own settings but not install software for everyone', 'Standard user', 'Daily-use account type.'],
     ['Full control of the PC', 'Administrator', 'Use only when needed.'],
     ['Temporary, very limited account; disabled by default', 'Guest', 'Keep it disabled.'],
     ['Legacy group kept for old-app compatibility; slightly more than a standard user', 'Power user', 'Rarely used today.'],
     ['Sign-in with an email-based cloud identity that syncs settings', 'Microsoft account', 'Online account.'],
     ['Account that exists only on this PC', 'Local account', 'Stored in the local SAM.'],
     ['Sign in with a PIN tied to this device or a face/fingerprint — passwordless', 'Windows Hello (PIN/biometric)', 'The PIN never leaves the device.'],
     ['The prompt that asks for consent or admin credentials before a system change', 'UAC', 'User Account Control.'],
     ['Right-click option to start one program elevated', 'Run as administrator', 'Elevate just that program.']],
    'Daily work as a standard user + UAC prompts for admin tasks = most malware cannot install itself.');
  T('c2-ntfs', 'Permissions and attributes', 'icacls and attrib',
    'Finance says an intern can open files in <b>D:\\Finance</b>. Check and fix the permissions. Elevated Command Prompt.',
    { shell: 'cmd', prompt: 'C:\\Windows\\System32>' },
    [{ t: 'Show the NTFS permissions on <b>D:\\Finance</b>.', accept: [/^icacls d:\\finance\\?$/i], show: 'icacls D:\\Finance', hint: 'icacls <path>', out: 'D:\\Finance CORP\\Finance-RW:(OI)(CI)(M)\n           CORP\\Domain Users:(OI)(CI)(RX)\n           BUILTIN\\Administrators:(OI)(CI)(F)\n           NT AUTHORITY\\SYSTEM:(OI)(CI)(F)', ask: { q: 'Which group gives everyone in the company read access?', accept: ['domain users', 'corp\\domain users'], why: 'Domain Users has RX (read & execute) — that includes the intern. (OI)(CI) = inherited by files and subfolders.' }, why: 'F full, M modify, RX read & execute. (OI)(CI) = inheritance.' },
     { t: 'Remove the Domain Users entry from the folder.', accept: [/^icacls d:\\finance\\? \/remove:?g? ["']?corp\\domain users["']?$/i, /^icacls d:\\finance\\? \/remove ["']?domain users["']?$/i], show: 'icacls D:\\Finance /remove "CORP\\Domain Users"', hint: 'icacls <path> /remove "<group>"', out: 'processed file: D:\\Finance\nSuccessfully processed 1 files; Failed processing 0 files', why: 'Least privilege: only Finance-RW and admins remain.' },
     { t: 'Check the attributes of <b>D:\\Finance\\salaries.xlsx</b>.', accept: [/^attrib d:\\finance\\salaries\.xlsx$/i], show: 'attrib D:\\Finance\\salaries.xlsx', hint: 'attrib <file>', out: 'A    H       D:\\Finance\\salaries.xlsx', ask: { q: 'Which attribute letter shows the file is hidden?', accept: ['h'], why: 'H = hidden. Hidden is not security: anyone with "show hidden files" sees it. Permissions protect it.' }, why: 'Attributes: R read-only, H hidden, S system, A archive.' },
     { t: 'Make the file read-only as an extra safeguard against accidental edits.', accept: [/^attrib \+r d:\\finance\\salaries\.xlsx$/i], show: 'attrib +r D:\\Finance\\salaries.xlsx', hint: 'attrib +r <file>', out: '', why: 'Read-only is an attribute, not a permission; admins can still clear it.' }],
    'Permissions decide who can access. Attributes are flags on the file. Inheritance passes folder permissions down unless you break it.',
    ['icacls shows and changes NTFS permissions; attrib shows and changes attributes.']);
  M('c2-perm-calc', 'Effective permissions', 'NTFS + share, combined',
    'A user is in the <b>Sales</b> group. Work out what they can actually do in each case.', ['Full control', 'Modify', 'Read', 'No access'],
    [['Over the network: Share = Read; NTFS = Modify', 'Read', 'Across the network the MOST restrictive of share and NTFS wins.'],
     ['Sitting at the server (local logon): Share = Read; NTFS = Modify', 'Modify', 'Share permissions do not apply locally; only NTFS.'],
     ['Over the network: Share = Full control; NTFS = Read', 'Read', 'Most restrictive wins.'],
     ['NTFS: Sales = Modify, and the user is also in Contractors with Deny Write', 'Read', 'An explicit Deny overrides Allow.'],
     ['NTFS: user = Read, Sales = Modify (no Deny); Share = Full control', 'Modify', 'NTFS permissions from groups add up; share does not restrict.'],
     ['Over the network: Share = Full control; NTFS = no entry for the user or their groups', 'No access', 'No NTFS permission = no access.']],
    'NTFS: add up allows, any deny wins. Network access: then take the more restrictive of NTFS and share.');
  T('c2-bitlocker', 'Encrypt a laptop and a USB drive', 'manage-bde',
    'A sales laptop must be encrypted before it leaves the office, and so must the USB drive the rep carries. Elevated Command Prompt.',
    { shell: 'cmd', prompt: 'C:\\Windows\\System32>' },
    [{ t: 'Show the BitLocker status of all drives.', accept: [/^manage-bde -status$/i], show: 'manage-bde -status', hint: 'manage-bde with -status', out: 'Volume C: [OS]\n    Conversion Status:    Fully Decrypted\n    Protection Status:    Protection Off\nVolume E: [SALESUSB]\n    Conversion Status:    Fully Decrypted\n    Protection Status:    Protection Off', why: 'Neither drive is encrypted.' },
     { t: 'Turn on BitLocker for <b>C:</b> using the TPM, and add a recovery password.', accept: [/^manage-bde -on c: -recoverypassword( -usedspaceonly| -tpm)*$/i, /^manage-bde -on c: (-tpm )?-recoverypassword( -usedspaceonly)?$/i], show: 'manage-bde -on C: -RecoveryPassword', hint: 'manage-bde -on C: -RecoveryPassword', out: 'Key Protectors Added:\n    TPM\n    Numerical Password:\n      ID: {5A1C...}\n      Password: 412863-099781-530112-...', why: 'The TPM unlocks it at boot; the 48-digit recovery password is the backup.' },
     { t: 'Display the key protectors for C: so you can save the recovery password ID to the ticket.', accept: [/^manage-bde -protectors -get c:$/i], show: 'manage-bde -protectors -get C:', hint: 'manage-bde -protectors -get <drive>', out: 'Volume C: [OS]\nAll Key Protectors\n    TPM:\n      ID: {9E2B...}\n    Numerical Password:\n      ID: {5A1C...}', ask: { q: 'Besides the numerical password, which key protector unlocks C: automatically at boot?', accept: ['tpm'], why: 'The TPM chip releases the key only if the boot chain is untouched.' }, why: 'In a domain, the recovery key is also backed up to Active Directory/Entra ID.' },
     { t: 'Turn on BitLocker To Go for the USB drive <b>E:</b> protected by a password.', accept: [/^manage-bde -on e: -password$/i, /^manage-bde -on e: -pw$/i], show: 'manage-bde -on E: -Password', hint: 'manage-bde -on E: -Password', out: 'Type the password to protect the volume: ********\nConfirm the password: ********\nEncryption is now in progress.', why: 'BitLocker To Go = removable drives; unlocked with a password or smart card on any Windows PC.' }],
    'BitLocker = whole volume (TPM + recovery key). BitLocker To Go = removable drives. EFS = individual files/folders for one user on NTFS.',
    ['manage-bde is the BitLocker command-line tool.']);
  M('c2-ad-pick', 'Active Directory tasks', 'Domain join, OUs, GPO, groups, home folders, folder redirection',
    'Pick the Active Directory feature that solves each request.', ['Join the computer to the domain', 'Move the object to another OU', 'Apply a Group Policy Object', 'Add the user to a security group', 'Assign a home folder', 'Configure folder redirection', 'Assign a log-in script'],
    [['A new PC must accept domain accounts and receive company policies', 'Join the computer to the domain', 'Domain join.'],
     ['A user transferred from Sales to Marketing and should get Marketing\'s policies', 'Move the object to another OU', 'GPOs linked to the OU now apply.'],
     ['Every PC in the Finance OU must lock after 10 minutes idle', 'Apply a Group Policy Object', 'GPO linked to the OU.'],
     ['A user needs access to the Projects share that the Engineering group already has', 'Add the user to a security group', 'Grant access through groups.'],
     ['Each user needs a private network drive H: on the file server', 'Assign a home folder', 'Profile tab: home folder path.'],
     ['Users\' Documents and Desktop should live on the server so they follow them to any PC and are backed up', 'Configure folder redirection', 'Via Group Policy.'],
     ['Map the shared S: drive and printers for everyone at sign-in', 'Assign a log-in script', 'Or Group Policy preferences.']],
    'Users and computers live in OUs. GPOs link to OUs. Access is granted to groups, not individuals.');
  T('c2-ad-ps', 'Active Directory from PowerShell', 'Join, move, group, home folder, verify',
    'Ticket: new hire <b>Maria Lopez</b> (user <b>mlopez</b>) starts in Marketing tomorrow on PC <b>WS-MKT-007</b>. Her account was created in the default Users container. You have the AD PowerShell module and domain admin rights.',
    { shell: 'ps', prompt: 'PS C:\\Users\\tech.admin>' },
    [{ t: 'On WS-MKT-007 (you are on it now), join it to the domain <b>corp.local</b> and restart.', accept: [/^add-computer -domainname corp\.local( -credential [^ ]+)? -restart$/i, /^add-computer -domainname corp\.local -restart( -credential [^ ]+)?$/i], show: 'Add-Computer -DomainName corp.local -Restart', hint: 'Add-Computer -DomainName <domain> -Restart', out: 'cmdlet Add-Computer at command pipeline position 1\nSupply values for the following parameters:\nCredential: CORP\\tech.admin ********\nWARNING: The changes will take effect after you restart the computer WS-MKT-007.\n[restarting… you reconnect from the admin workstation]', why: 'The PC now trusts the domain and gets domain policies.' },
     { t: 'Show mlopez\'s account, including where it sits in the directory.', accept: [/^get-aduser mlopez$/i, /^get-aduser -identity mlopez$/i, /^get-aduser mlopez -properties \*$/i], show: 'Get-ADUser mlopez', hint: 'Get-ADUser <username>', out: 'DistinguishedName : CN=Maria Lopez,CN=Users,DC=corp,DC=local\nEnabled           : True\nSamAccountName    : mlopez', ask: { q: 'Which container is she in now? (the CN= right after her name)', accept: ['users', 'cn=users'], why: 'The default Users container cannot have GPOs linked to it. She needs to be in the Marketing OU.' }, why: 'The DistinguishedName shows the account\'s location.' },
     { t: 'Move her account into the OU <b>OU=Marketing,DC=corp,DC=local</b>.', accept: [/^get-aduser mlopez \| move-adobject -targetpath ["']?ou=marketing,dc=corp,dc=local["']?$/i, /^move-adobject -identity ["']?cn=maria lopez,cn=users,dc=corp,dc=local["']? -targetpath ["']?ou=marketing,dc=corp,dc=local["']?$/i], show: 'Get-ADUser mlopez | Move-ADObject -TargetPath "OU=Marketing,DC=corp,DC=local"', hint: 'Get-ADUser mlopez | Move-ADObject -TargetPath "OU=…"', out: '', why: 'Marketing\'s GPOs (drive maps, lock screen, folder redirection) now apply to her.' },
     { t: 'Give her the same file access as the team: add her to the security group <b>Marketing-RW</b>.', accept: [/^add-adgroupmember -identity ["']?marketing-rw["']? -members mlopez$/i, /^add-adgroupmember ["']?marketing-rw["']? -members mlopez$/i, /^add-adgroupmember ["']?marketing-rw["']? mlopez$/i], show: 'Add-ADGroupMember -Identity Marketing-RW -Members mlopez', hint: 'Add-ADGroupMember -Identity <group> -Members <user>', out: '', why: 'Access through groups: the share already trusts Marketing-RW.' },
     { t: 'Assign her home folder <b>\\\\fs01\\home\\mlopez</b> as drive <b>H:</b>.', accept: [/^set-aduser mlopez -homedirectory ["']?\\\\fs01\\home\\mlopez["']? -homedrive ["']?h:?["']?$/i, /^set-aduser mlopez -homedrive ["']?h:?["']? -homedirectory ["']?\\\\fs01\\home\\mlopez["']?$/i], show: 'Set-ADUser mlopez -HomeDirectory \\\\fs01\\home\\mlopez -HomeDrive H:', hint: 'Set-ADUser <user> -HomeDirectory <UNC> -HomeDrive H:', out: '', why: 'Same as the Profile tab in Active Directory Users and Computers.' },
     { t: 'Check her group memberships to confirm.', accept: [/^get-adprincipalgroupmembership mlopez( \| select(-object)? name)?$/i, /^get-aduser mlopez -properties memberof$/i], show: 'Get-ADPrincipalGroupMembership mlopez | Select Name', hint: 'Get-ADPrincipalGroupMembership <user>', out: 'name\n----\nDomain Users\nMarketing-RW', why: 'Domain Users + Marketing-RW — correct.' },
     { t: 'On WS-MKT-007, after she signs in, prove which GPOs applied to her (summary).', accept: [/^gpresult \/r( \/scope:user)?$/i, /^gpresult \/r \/user mlopez$/i], show: 'gpresult /r', hint: 'gpresult with the summary switch.', out: 'USER SETTINGS\n    CN=Maria Lopez,OU=Marketing,DC=corp,DC=local\n    Applied Group Policy Objects\n        Marketing Drive Maps\n        Marketing Folder Redirection\n        Default Domain Policy', ask: { q: 'Which GPO moves her Documents folder to the server?', accept: ['marketing folder redirection', 'folder redirection'], why: 'Folder redirection is delivered by Group Policy; her files now live on the server and are backed up.' }, why: 'gpresult proves the OU move worked.' }],
    'Join the PC → place the user in the right OU → access through groups → home folder → verify with gpresult. That is a complete AD onboarding.',
    ['AD cmdlets: Get-ADUser, Move-ADObject, Add-ADGroupMember, Set-ADUser.']);
  M('c2-winsec-wrap', 'Windows security desk', 'Combined 2.2',
    'Pick the best setting or tool.', ['Update Defender definitions', 'Firewall rule for one app/port', 'Standard user account', 'Windows Hello PIN', 'Share + NTFS permissions', 'Break inheritance', 'BitLocker', 'BitLocker To Go', 'EFS', 'Group Policy via OU'],
    [['Defender shows definitions 40 days old', 'Update Defender definitions', 'Keep signatures current.'],
     ['A legitimate app is blocked by the firewall', 'Firewall rule for one app/port', 'Never disable the firewall.'],
     ['Users keep installing unapproved software', 'Standard user account', 'No admin rights for daily use.'],
     ['Users want to stop typing long passwords on their own laptops', 'Windows Hello PIN', 'Device-bound, passwordless.'],
     ['A shared folder must be read-only over the network but editable for admins at the server', 'Share + NTFS permissions', 'Most restrictive wins remotely.'],
     ['A subfolder must not get the parent\'s permissions', 'Break inheritance', 'Then set its own.'],
     ['Stolen laptop must not expose any data', 'BitLocker', 'Full-volume encryption.'],
     ['USB drive with client files', 'BitLocker To Go', 'Removable drive encryption.'],
     ['One user wants to encrypt a single folder on a shared PC', 'EFS', 'File-level, per user.'],
     ['All marketing PCs need the same screen lock setting', 'Group Policy via OU', 'Central policy.']],
    'Windows security is layered: AV + firewall + least-privilege accounts + permissions + encryption + central policy.');

  RK.add({ track: TR, id: '2.2', dom: 2, short: 'Windows security settings & Active Directory', title: 'Given a scenario, configure and apply basic Microsoft Windows OS security settings',
    goal: 'Configure Defender and the firewall, accounts and UAC, NTFS/share permissions, BitLocker/EFS — and the basic Active Directory tasks.',
    kw: /\b(defender|windows firewall|firewall rule|standard user|administrator account|guest account|power user|microsoft account|local account|windows hello|passwordless|\bpin\b|ntfs|share permission|inherit|attribute|run as admin|\buac\b|user account control|bitlocker|\befs\b|encrypting file system|active directory|domain|organizational unit|\bou\b|group policy|\bgpo\b|home folder|folder redirection|login script|log-in script|security group)/,
    parts: [
      P('Defender Antivirus and the firewall', 'Check and update Microsoft Defender and configure the Windows firewall with narrow exceptions.',
        `<p><b>Microsoft Defender Antivirus</b> is built into Windows.</p>
<ul><li><b>Activate/deactivate</b> — it turns itself off when another antivirus is installed, and back on if that AV is removed. Real-time protection should stay on.</li>
<li><b>Updated definitions</b> — signatures update through Windows Update; check their age if a PC keeps missing threats.</li></ul>
<p><b>Windows Defender Firewall</b>:</p>
<ul><li><b>Activate/deactivate</b> per profile (Domain, Private, Public). Leave it on everywhere.</li>
<li><b>Port security</b> — allow a specific port (TCP 8443) inbound.</li>
<li><b>Application security</b> — allow a specific program through, rather than a port.</li></ul>
<p>GUI: Windows Security app. PowerShell: <code>Get-MpComputerStatus</code>, <code>Update-MpSignature</code>, <code>Get-NetFirewallProfile</code>, <code>New-NetFirewallRule</code>.</p>` + pro('"Turn the firewall off and see if it works" is a valid two-minute test — as long as you turn it back on and replace it with one narrow rule.') + trap('Defender being "off" because a third-party antivirus is installed is normal, not a fault.'),
        [['A PC keeps missing new malware although Defender is on. What should you check?', 'The age of the virus definitions', ['The firewall profile', 'BitLocker status', 'The UAC level'], 'Stale signatures miss new threats.'],
         ['A new app needs inbound access. What is the correct firewall change?', 'Allow that app or its specific port', ['Disable the firewall', 'Set the profile to Public', 'Uninstall Defender'], 'Narrow exceptions only.']],
        'c2-defender'),
      P('Accounts, sign-in options and UAC', 'Choose account types and sign-in methods, and explain run as administrator and UAC.',
        `<p><b>Users and groups:</b> <b>local</b> account (only on this PC) vs <b>Microsoft account</b> (cloud identity, syncs settings). Account types/groups: <b>Standard user</b>, <b>Administrator</b>, <b>Guest</b> (disabled by default — keep it that way), <b>Power user</b> (legacy).</p>
<p><b>Log-in OS options:</b> username/password, <b>PIN</b>, <b>fingerprint</b>, <b>facial recognition</b>, <b>SSO</b>, and <b>passwordless / Windows Hello</b>. A Windows Hello PIN is tied to that one device and the TPM, so a stolen PIN is useless elsewhere — unlike a password.</p>
<p><b>Run as administrator vs standard user:</b> work daily as a standard user; elevate one program when needed (right-click → <i>Run as administrator</i>).</p>
<p><b>UAC (User Account Control)</b> — prompts for consent (admins) or admin credentials (standard users) before system-wide changes. It stops software silently making changes with your rights.</p>` + pro('Never give users permanent local admin "to stop the tickets". It is the single change that most increases malware damage.') + trap('Turning UAC off is never the right exam answer to "too many prompts".'),
        [['Which feature prompts before a program makes system-wide changes?', 'UAC', ['BitLocker', 'EFS', 'SSO'], 'User Account Control.'],
         ['Why is a Windows Hello PIN safer than a password?', 'It is tied to one device and its TPM', ['It is longer', 'It is stored in the cloud', 'It never expires'], 'Useless on any other device.']],
        'c2-users'),
      P('NTFS vs share permissions, attributes and inheritance', 'Work out effective permissions and use attributes and inheritance correctly.',
        `<ul><li><b>NTFS permissions</b> — set on the file/folder; apply locally <b>and</b> over the network. Full control, Modify, Read &amp; execute, List, Read, Write.</li>
<li><b>Share permissions</b> — set on the share; apply <b>only over the network</b>. Full control, Change, Read.</li></ul>
<p><b>Effective permission rules:</b></p>
<ol><li>Permissions from all your groups <b>add up</b>.</li>
<li>An explicit <b>Deny</b> beats any Allow.</li>
<li>Over the network, the <b>more restrictive</b> of share and NTFS wins. (Common practice: share = Full control for authenticated users, control everything with NTFS.)</li></ol>
<p><b>Inheritance</b> — folders pass permissions down to their contents. Break it on a subfolder to give it its own permissions. Moving within the same volume keeps permissions; copying (or moving to another volume) takes the destination's.</p>
<p><b>File and folder attributes</b> — Read-only, Hidden, System, Archive (<code>attrib</code>). They are flags, not security.</p>` + pro('Grant permissions to groups, never to individual users. When people change jobs you change their groups, not 40 folder ACLs.') + trap('Share = Read and NTFS = Full control means Read over the network, but Full control for someone logged on at the server.'),
        [['Over the network, Share = Change and NTFS = Read. What is the effective permission?', 'Read', ['Change', 'Full control', 'No access'], 'Most restrictive wins.'],
         ['Which beats all Allow permissions?', 'An explicit Deny', ['Share Full control', 'Inheritance', 'The Archive attribute'], 'Deny wins.']],
        'c2-ntfs'),
      P('BitLocker, BitLocker To Go and EFS', 'Choose and enable BitLocker, BitLocker To Go or EFS.',
        `<table><tr><th></th><th>Encrypts</th><th>Use when</th></tr>
<tr><td><b>BitLocker</b></td><td>A whole volume (usually C:)</td><td>Laptops and PCs: a stolen drive is unreadable</td></tr>
<tr><td><b>BitLocker To Go</b></td><td>Removable drives (USB)</td><td>Carrying data on flash drives</td></tr>
<tr><td><b>EFS</b> (Encrypting File System)</td><td>Individual files/folders on NTFS, per user</td><td>One user\'s private files on a shared PC</td></tr></table>
<ul><li>BitLocker uses the <b>TPM</b> to unlock automatically if the boot process is untouched; the <b>48-digit recovery key</b> is needed if hardware or firmware changes.</li>
<li>Store recovery keys centrally (Active Directory / Entra ID / Microsoft account). A lost key = lost data.</li>
<li>BitLocker needs <b>Pro</b> or above; Home has only basic "device encryption" on some hardware.</li>
<li>EFS is tied to the user\'s certificate: another user, or the same user after a profile rebuild without the key, cannot open the files.</li></ul>` + pro('Before replacing a motherboard or updating firmware on a BitLocker laptop, confirm the recovery key is on file — or suspend BitLocker first.') + trap('EFS encrypts files for one user; BitLocker encrypts the whole drive for everyone who can log on.'),
        [['Which feature encrypts a USB flash drive?', 'BitLocker To Go', ['EFS', 'UAC', 'Windows Hello'], 'Removable drives.'],
         ['A BitLocker laptop asks for a recovery key after a motherboard replacement. Why?', 'The TPM changed, so automatic unlock failed', ['The user forgot their PIN', 'EFS was turned off', 'The firewall blocked it'], 'Hardware change → recovery key.']],
        'c2-bitlocker'),
      P('Active Directory: domains, OUs, groups and Group Policy', 'Explain domain join, OUs, security groups, Group Policy, home folders, folder redirection and log-in scripts.',
        `<p><b>Active Directory (AD)</b> — the directory that stores users, groups and computers for a Windows <b>domain</b>, running on <b>domain controllers</b>.</p>
<ul><li><b>Joining a domain</b> — the PC trusts the domain; domain users can sign in; policies apply.</li>
<li><b>Organizational units (OUs)</b> — folders inside AD (Sales, Marketing, Laptops). <b>Moving objects within OUs</b> changes which policies apply.</li>
<li><b>Group Policy Objects (GPOs)</b> — sets of settings linked to OUs (or the domain): password rules, lock screen, software, drive maps.</li>
<li><b>Security groups</b> — grant access to shares and resources; put users in groups.</li>
<li><b>Home folders</b> — a private network folder per user, usually mapped as H:.</li>
<li><b>Folder redirection</b> — GPO setting that stores Documents/Desktop on a server: available on any PC, backed up centrally.</li>
<li><b>Log-in scripts</b> — run at sign-in (map drives, printers); assigned per user or by GPO.</li></ul>` + pro('The default "Users" and "Computers" containers are not OUs and cannot have GPOs linked. New accounts left there get no department policies — a classic help-desk ticket.') + trap('GPOs link to OUs, sites and domains — not to security groups (groups can filter who a GPO applies to).'),
        [['A user moved departments and needs the new department\'s policies. What do you do in AD?', 'Move the user object to the new department\'s OU', ['Reset their password', 'Rejoin their PC to the domain', 'Delete and recreate the account'], 'Policies follow the OU.'],
         ['Which feature stores users\' Documents folders on a server automatically?', 'Folder redirection', ['BitLocker To Go', 'EFS', 'A local account'], 'Applied by Group Policy.']],
        'c2-ad-pick'),
      P('Active Directory tasks in PowerShell', 'Join a PC, move a user to an OU, add group membership, set a home folder and verify with gpresult.',
        `<p>Most AD work at the help desk is done in <b>Active Directory Users and Computers</b> (dsa.msc) — or faster in PowerShell:</p>
<table><tr><th>Task</th><th>PowerShell</th></tr>
<tr><td>Join this PC to the domain</td><td><code>Add-Computer -DomainName corp.local -Restart</code></td></tr>
<tr><td>Look up a user</td><td><code>Get-ADUser mlopez</code></td></tr>
<tr><td>Move to an OU</td><td><code>Get-ADUser mlopez | Move-ADObject -TargetPath "OU=Marketing,DC=corp,DC=local"</code></td></tr>
<tr><td>Add to a group</td><td><code>Add-ADGroupMember -Identity Marketing-RW -Members mlopez</code></td></tr>
<tr><td>Home folder</td><td><code>Set-ADUser mlopez -HomeDirectory \\\\fs01\\home\\mlopez -HomeDrive H:</code></td></tr>
<tr><td>Unlock / reset</td><td><code>Unlock-ADAccount mlopez</code> · <code>Set-ADAccountPassword</code></td></tr>
<tr><td>Prove policy applied</td><td><code>gpresult /r</code> on the PC</td></tr></table>
<p>A <b>distinguished name</b> reads right to left: <code>CN=Maria Lopez,OU=Marketing,DC=corp,DC=local</code> = Maria, in Marketing, in corp.local.</p>` + pro('Script onboarding once and run it for every new hire. It is the fastest way to stop "forgot to add her to the group" tickets.') + trap('A new group membership only appears in the user\'s access token after they sign out and back in.'),
        [['Which cmdlet adds a user to a security group?', 'Add-ADGroupMember', ['Move-ADObject', 'Set-ADUser', 'Add-Computer'], 'Group membership.'],
         ['In CN=Maria Lopez,OU=Marketing,DC=corp,DC=local, which OU is the user in?', 'Marketing', ['corp', 'local', 'Users'], 'OU= component.']],
        'c2-ad-ps')
    ],
    moreLabs: ['c2-perm-calc'],
    wrap: { recap: ['Defender: on, current definitions. Firewall on for every profile; allow specific apps or ports.', 'Local vs Microsoft accounts; standard, administrator, guest (disabled), power user. Windows Hello = passwordless PIN/biometric.', 'Work as standard user; run as administrator when needed; UAC prompts before system changes.', 'NTFS applies locally and remotely; share only remotely; most restrictive wins; Deny beats Allow; inheritance flows down.', 'BitLocker = volume (TPM + recovery key); BitLocker To Go = removable; EFS = files per user.', 'AD: join domain, OUs, GPOs link to OUs, security groups, home folders, folder redirection, log-in scripts.'], lab: 'c2-winsec-wrap' }
  });

  // ===================== 2.3 Wireless security & authentication =====================
  M('c2-wpa', 'Wireless encryption', 'WPA2, WPA3, TKIP, AES',
    'Pick the term for each description.', ['WPA3', 'WPA2', 'TKIP', 'AES'],
    [['Current standard; replaces the pre-shared key handshake with SAE', 'WPA3', 'Resists offline password guessing.'],
     ['Widely deployed standard that uses AES-CCMP', 'WPA2', 'Still common.'],
     ['Old WPA encryption method; deprecated and weak', 'TKIP', 'Never choose it.'],
     ['Strong block cipher used by WPA2 and WPA3', 'AES', 'Advanced Encryption Standard.'],
     ['Best choice for a new deployment when all clients support it', 'WPA3', 'Strongest.'],
     ['Choose this if an older printer cannot do WPA3', 'WPA2', 'With AES, not TKIP.']],
    'WPA3 > WPA2-AES > anything with TKIP. "WPA2 with TKIP" is a wrong answer.');
  M('c2-aaa', 'Authentication protocols', 'RADIUS, TACACS+, Kerberos, MFA',
    'Pick the protocol for each description.', ['RADIUS', 'TACACS+', 'Kerberos', 'Multifactor'],
    [['Authenticates Wi-Fi users for WPA2/WPA3-Enterprise (802.1X)', 'RADIUS', 'Network access AAA, UDP.'],
     ['Cisco protocol for admins logging into routers and switches; encrypts the whole packet', 'TACACS+', 'Device administration, TCP 49.'],
     ['Ticket-based authentication used by Active Directory domain logons', 'Kerberos', 'Tickets from the KDC on the domain controller.'],
     ['Wi-Fi login needs a certificate on the laptop plus the user\'s password', 'Multifactor', 'Have + know.'],
     ['Fails if the PC clock is more than 5 minutes off', 'Kerberos', 'Timestamps in tickets.'],
     ['Separates authentication, authorization and accounting and authorizes each command', 'TACACS+', 'Per-command control.']],
    'RADIUS = network access. TACACS+ = device admin. Kerberos = Windows domain sign-in.');
  M('c2-wifi-wrap', 'Secure the office Wi-Fi', 'Combined 2.3',
    'Pick the best choice.', ['WPA3-Enterprise with RADIUS', 'WPA3-Personal', 'WPA2-Personal with AES', 'Kerberos', 'TACACS+', 'MFA'],
    [['300 staff each with their own credentials; revoke one without changing anyone else\'s', 'WPA3-Enterprise with RADIUS', '802.1X per user.'],
     ['Five-person office, all new devices, no server', 'WPA3-Personal', 'SAE with a strong passphrase.'],
     ['Small office with an older label printer that lacks WPA3', 'WPA2-Personal with AES', 'Never TKIP.'],
     ['Users sign in to domain PCs and reach file shares without typing passwords again', 'Kerberos', 'Ticket-based SSO in AD.'],
     ['Network admins need logged, per-command authorization on switches', 'TACACS+', 'Device admin AAA.'],
     ['Phished Wi-Fi passwords are being reused', 'MFA', 'Add a second factor.']],
    'Enterprise Wi-Fi = RADIUS. Personal Wi-Fi = WPA3 (or WPA2-AES). Never TKIP.');

  RK.add({ track: TR, id: '2.3', dom: 2, short: 'Wireless security & authentication', title: 'Compare and contrast wireless security protocols and authentication methods',
    goal: 'Choose WPA2/WPA3 with AES, and RADIUS, TACACS+, Kerberos or MFA for authentication.',
    kw: /\b(wpa2|wpa3|\bwpa\b|\bwep\b|tkip|\baes\b|radius|tacacs|kerberos|802\.1x|\bsae\b|wireless (security|encryption))/,
    parts: [
      P('Wireless encryption: WPA2, WPA3, TKIP, AES', 'Pick the right wireless security protocol and cipher.',
        `<ul><li><b>WPA2</b> — uses <b>AES</b> (CCMP). Strong when the passphrase is long. Personal (PSK) or Enterprise (802.1X).</li>
<li><b>WPA3</b> — current standard. <b>SAE</b> replaces the PSK handshake, so captured traffic cannot be cracked offline; also forward secrecy and protected management frames. Personal or Enterprise.</li>
<li><b>TKIP</b> — the old WPA method; weak and deprecated. Never select it.</li>
<li><b>AES</b> — the strong cipher used by WPA2 and WPA3.</li></ul>
<p><b>Personal vs Enterprise:</b> Personal = one shared passphrase. Enterprise = each user authenticates with their own credentials through a RADIUS server — remove one person without changing everyone\'s password.</p>` + pro('Many routers offer "WPA2/WPA3 transition mode" so old devices still connect. Use it during a migration, then switch to WPA3-only.') + trap('WEP and WPA (TKIP) are always wrong answers for "most secure".'),
        [['Which wireless security protocol uses SAE?', 'WPA3', ['WPA2', 'WEP', 'TKIP'], 'Simultaneous Authentication of Equals.'],
         ['Which encryption should WPA2 use?', 'AES', ['TKIP', 'RC4', 'DES'], 'AES-CCMP.']],
        'c2-wpa'),
      P('Authentication: RADIUS, TACACS+, Kerberos, MFA', 'Match RADIUS, TACACS+, Kerberos and MFA to their uses.',
        `<table><tr><th>Protocol</th><th>Used for</th><th>Notes</th></tr>
<tr><td><b>RADIUS</b></td><td>Network access: Enterprise Wi-Fi, VPN, 802.1X switch ports</td><td>UDP 1812/1813; encrypts only the password</td></tr>
<tr><td><b>TACACS+</b></td><td>Admins logging into network devices</td><td>TCP 49; encrypts everything; per-command authorization</td></tr>
<tr><td><b>Kerberos</b></td><td>Windows domain sign-in and access to domain resources</td><td>Tickets from the domain controller; needs clocks within ~5 minutes</td></tr>
<tr><td><b>Multifactor</b></td><td>Adding a second factor to any of these</td><td>Know + have/are</td></tr></table>
<p>All three are <b>AAA</b> protocols: <b>authentication</b> (who), <b>authorization</b> (what may they do), <b>accounting</b> (what did they do).</p>` + pro('"The password is right but domain login fails" on one PC — check the clock. Kerberos refuses tickets when time drifts.') + trap('RADIUS is for users joining the network; TACACS+ is for administrators managing network devices.'),
        [['Which protocol does WPA2-Enterprise use to authenticate users?', 'RADIUS', ['TACACS+', 'Kerberos', 'TKIP'], '802.1X with a RADIUS server.'],
         ['Which protocol issues tickets for Active Directory logons?', 'Kerberos', ['RADIUS', 'TACACS+', 'SAML'], 'Ticket-based.']],
        'c2-aaa')
    ],
    wrap: { recap: ['WPA3 (SAE) > WPA2 with AES. TKIP and WEP are obsolete.', 'Personal = shared passphrase; Enterprise = per-user via RADIUS (802.1X).', 'RADIUS: network access, UDP. TACACS+: device admin, TCP 49, encrypts all.', 'Kerberos: AD domain sign-in with tickets; sensitive to clock drift.', 'MFA adds a second factor type to any of these.'], lab: 'c2-wifi-wrap' }
  });

  // ===================== 2.4 Malware =====================
  M('c2-malware-id', 'Name the malware', 'Malware types',
    'Pick the malware type each symptom describes.', ['Trojan', 'Rootkit', 'Virus', 'Spyware', 'Ransomware', 'Keylogger', 'Boot sector virus', 'Cryptominer', 'Stalkerware', 'Fileless', 'Adware / PUP'],
    [['"Free PDF converter" also installed a remote-access backdoor', 'Trojan', 'Disguised as something useful.'],
     ['Hides itself and other malware deep in the OS; antivirus cannot see it', 'Rootkit', 'Kernel-level hiding.'],
     ['Infects files and spreads when the infected program is run', 'Virus', 'Needs a host and user action.'],
     ['Secretly reports browsing habits and personal data', 'Spyware', 'Collects information.'],
     ['Files renamed .locked with a payment note on the desktop', 'Ransomware', 'Encrypts and extorts.'],
     ['Captures everything typed, including passwords', 'Keylogger', 'Keystroke capture.'],
     ['Infects the boot record so it loads before the OS', 'Boot sector virus', 'Survives normal scans.'],
     ['CPU at 100% with fans roaring while idle, mining cryptocurrency', 'Cryptominer', 'Steals compute.'],
     ['Hidden app on a phone tracks a person\'s location and messages', 'Stalkerware', 'Covert monitoring of a person.'],
     ['Runs only in memory via PowerShell; nothing written to disk', 'Fileless', 'Evades file scanners.'],
     ['Toolbar and pop-ups appeared after installing freeware', 'Adware / PUP', 'Potentially unwanted program.']],
    'Learn the symptom that gives each away: pop-ups (adware), 100% CPU (cryptominer), renamed files (ransomware), "invisible" (rootkit).');
  M('c2-edr', 'Detection and removal tools', 'AV, EDR/MDR/XDR, gateways, firewalls, training',
    'Pick the tool or method for each need.', ['Antivirus / anti-malware', 'EDR', 'MDR', 'XDR', 'Email security gateway', 'Software firewall', 'Recovery console', 'User education', 'OS reinstallation'],
    [['Signature scanning of files on a single PC', 'Antivirus / anti-malware', 'Classic protection.'],
     ['Agent records process behaviour and can isolate a laptop from the network remotely', 'EDR', 'Endpoint detection and response.'],
     ['An outside security team watches your EDR alerts 24/7 and responds', 'MDR', 'Managed detection and response.'],
     ['Correlates signals from endpoints, email, network and cloud in one platform', 'XDR', 'Extended detection and response.'],
     ['Strips malicious attachments and links before they reach inboxes', 'Email security gateway', 'Filters email.'],
     ['Blocks unknown programs on the PC from making network connections', 'Software firewall', 'Host firewall.'],
     ['Boot into a repair environment to fix the boot sector', 'Recovery console', 'Windows RE command prompt.'],
     ['Teach staff to spot phishing', 'User education', 'Anti-phishing training.'],
     ['Rootkit cannot be removed with confidence', 'OS reinstallation', 'Wipe and rebuild.']],
    'Antivirus finds known files; EDR watches behaviour; XDR connects many sources; MDR is people doing it for you.');
  M('c2-malware-wrap', 'Malware triage', 'Combined 2.4',
    'Pick the best response.', ['Reimage the PC', 'Remove the PUP and reset the browser', 'Isolate with EDR, then investigate', 'Restore from backup after reimaging', 'Change passwords from a clean device', 'Run an offline/boot-time scan'],
    [['Rootkit detected on a workstation', 'Reimage the PC', 'You cannot trust a rootkitted OS.'],
     ['New search toolbar and pop-ups after a freeware install', 'Remove the PUP and reset the browser', 'Low-severity cleanup.'],
     ['Suspicious PowerShell connecting to an unknown server at 3 AM', 'Isolate with EDR, then investigate', 'Contain first.'],
     ['Ransomware encrypted local files; backups are clean', 'Restore from backup after reimaging', 'Do not restore onto an infected system.'],
     ['A keylogger was found on a laptop used for banking', 'Change passwords from a clean device', 'Assume credentials are stolen.'],
     ['Boot sector virus suspected; normal scan finds nothing', 'Run an offline/boot-time scan', 'Scan before the OS loads.']],
    'Contain, eradicate, recover — and assume any secret typed on an infected PC is compromised.');

  RK.add({ track: TR, id: '2.4', dom: 2, short: 'Malware & removal tools', title: 'Summarize types of malware and tools/methods for detection, removal, and prevention',
    goal: 'Recognize each malware type by its symptoms and pick the right detection, removal and prevention tools.',
    kw: /\b(malware|trojan|rootkit|virus|spyware|ransomware|keylogger|boot sector|cryptomin|stalkerware|fileless|adware|\bpup\b|potentially unwanted|\bedr\b|\bmdr\b|\bxdr\b|anti.?malware|antivirus|email (security )?gateway|recovery console)/,
    parts: [
      P('Malware types', 'Identify trojans, rootkits, viruses, spyware, ransomware, keyloggers, boot sector viruses, cryptominers, stalkerware, fileless malware, adware and PUPs.',
        `<table><tr><th>Type</th><th>What it does / tell-tale sign</th></tr>
<tr><td><b>Trojan</b></td><td>Pretends to be useful software; installs something malicious</td></tr>
<tr><td><b>Rootkit</b></td><td>Hides itself and other malware deep in the OS; hard to detect</td></tr>
<tr><td><b>Virus</b></td><td>Attaches to files; spreads when they run</td></tr>
<tr><td><b>Boot sector virus</b></td><td>Infects the boot record; loads before the OS</td></tr>
<tr><td><b>Spyware</b> / <b>keylogger</b></td><td>Collects data / records keystrokes</td></tr>
<tr><td><b>Ransomware</b></td><td>Encrypts files and demands payment</td></tr>
<tr><td><b>Cryptominer</b></td><td>Uses your CPU/GPU to mine coins — high usage, heat, noise</td></tr>
<tr><td><b>Stalkerware</b></td><td>Covertly tracks a specific person\'s location and messages</td></tr>
<tr><td><b>Fileless</b></td><td>Lives in memory and legitimate tools (PowerShell, WMI); little on disk</td></tr>
<tr><td><b>Adware / PUP</b></td><td>Ads, toolbars, browser changes bundled with freeware</td></tr></table>` + pro('Ask "what did you install or click recently?" first. Most infections start with something the user chose to run.') + trap('A worm spreads by itself; a virus needs a host file and a user to run it.'),
        [['A PC\'s fans run at full speed and CPU is at 100% while idle. Which malware is most likely?', 'Cryptominer', ['Keylogger', 'Stalkerware', 'Rootkit'], 'Steals processing power.'],
         ['Which malware type is designed to hide itself and other malware from the OS?', 'Rootkit', ['Adware', 'Trojan', 'Spyware'], 'Deep concealment.']],
        'c2-malware-id'),
      P('Detection, removal and prevention tools', 'Choose antivirus, EDR, MDR, XDR, email gateways, firewalls, recovery tools, training or reinstallation.',
        `<ul><li><b>Antivirus / anti-malware</b> — scans files for known signatures and suspicious traits.</li>
<li><b>EDR</b> (endpoint detection and response) — records behaviour on each endpoint, alerts on suspicious activity, can isolate a device remotely.</li>
<li><b>MDR</b> (managed detection and response) — a provider\'s team monitors and responds for you, 24/7.</li>
<li><b>XDR</b> (extended detection and response) — correlates endpoint, email, network, identity and cloud signals.</li>
<li><b>Email security gateway</b> — filters spam, malicious links and attachments before delivery.</li>
<li><b>Software firewalls</b> — host firewall controls which programs talk on the network.</li>
<li><b>Recovery console</b> — Windows Recovery Environment command prompt to repair boot problems.</li>
<li><b>User education regarding common threats</b> — anti-phishing training; users are the most targeted layer.</li>
<li><b>OS reinstallation</b> — the only trustworthy fix for rootkits and deep infections: wipe and rebuild.</li></ul>` + pro('With EDR, the first move is "isolate host": the device keeps its connection to the security console but cannot reach anything else.') + trap('Antivirus alone does not stop fileless malware well; behaviour-based EDR does.'),
        [['Which tool records behaviour on each endpoint and can isolate a device remotely?', 'EDR', ['Email security gateway', 'Recovery console', 'Software firewall'], 'Endpoint detection and response.'],
         ['What is the most reliable fix for a rootkit infection?', 'Reinstall/reimage the OS', ['Run Disk Cleanup', 'Update the browser', 'Change the wallpaper'], 'You cannot trust the infected OS.']],
        'c2-edr')
    ],
    wrap: { recap: ['Trojan (disguised), rootkit (hides), virus (needs a host), boot sector virus (before the OS).', 'Spyware, keylogger, stalkerware collect data; ransomware encrypts; cryptominer burns CPU.', 'Fileless runs in memory/legitimate tools; adware/PUPs come with freeware.', 'Antivirus/anti-malware; EDR (endpoint behaviour), MDR (managed), XDR (many sources).', 'Email security gateway, software firewall, recovery console, user education.', 'Rootkits and deep infections: reinstall the OS.'], lab: 'c2-malware-wrap' }
  });

  // ===================== 2.5 Social engineering, threats, vulnerabilities =====================
  M('c2-soceng', 'Name the social engineering', 'People-focused attacks',
    'Pick the attack described.', ['Phishing', 'Vishing', 'Smishing', 'QR code phishing', 'Spear phishing', 'Whaling', 'Shoulder surfing', 'Tailgating', 'Impersonation', 'Dumpster diving'],
    [['Mass email: "Your mailbox is full, log in here"', 'Phishing', 'Broad email lure.'],
     ['Phone call from "the bank fraud team" asking for a code', 'Vishing', 'Voice phishing.'],
     ['Text message: "Your package is held, pay the fee here"', 'Smishing', 'SMS phishing.'],
     ['Sticker over a parking-meter QR code leads to a fake payment site', 'QR code phishing', 'Also called quishing.'],
     ['Email to one accountant naming her manager and a real project', 'Spear phishing', 'Targeted and researched.'],
     ['Fake legal notice sent to the CEO', 'Whaling', 'Targets executives.'],
     ['Watching someone type their PIN at a kiosk', 'Shoulder surfing', 'Observation.'],
     ['Following an employee through a badge door', 'Tailgating', 'Physical entry.'],
     ['Caller claims to be from IT and asks the user to approve an MFA prompt', 'Impersonation', 'Pretending to be someone trusted.'],
     ['Searching the recycling for printed network diagrams', 'Dumpster diving', 'Shred everything.']],
    'Phishing = email, vishing = voice, smishing = SMS, quishing = QR. Spear = targeted, whaling = executives.');
  M('c2-threats', 'Name the threat', 'Technical attacks and threats',
    'Pick the threat described.', ['DoS', 'DDoS', 'Evil twin', 'Zero-day', 'Spoofing', 'On-path attack', 'Brute-force', 'Dictionary attack', 'Insider threat', 'SQL injection', 'XSS', 'Business email compromise', 'Supply chain attack'],
    [['One machine floods a server until it stops responding', 'DoS', 'Single source.'],
     ['Thousands of infected devices flood the website at once', 'DDoS', 'Many sources.'],
     ['Fake Wi-Fi with the company SSID in the parking lot', 'Evil twin', 'Rogue look-alike AP.'],
     ['Attack using a flaw the vendor does not know about yet', 'Zero-day', 'No patch exists.'],
     ['Email "from" the CFO address is forged', 'Spoofing', 'Faked identity/address.'],
     ['Attacker secretly relays traffic between a user and a website', 'On-path attack', 'Man-in-the-middle.'],
     ['Trying every possible password combination', 'Brute-force', 'Exhaustive guessing.'],
     ['Trying a list of common passwords and words', 'Dictionary attack', 'Wordlist guessing.'],
     ['A disgruntled employee copies the customer list before leaving', 'Insider threat', 'Trusted person misusing access.'],
     ['\' OR 1=1 -- typed into a login box returns all records', 'SQL injection', 'Database command injection.'],
     ['A forum post runs a script in other visitors\' browsers', 'XSS', 'Cross-site scripting.'],
     ['A compromised vendor mailbox sends "new bank details" for invoices', 'Business email compromise', 'BEC fraud.'],
     ['Malicious code inserted into a trusted software update', 'Supply chain attack', 'Compromise the supplier (pipeline).']],
    'Threats target people (social engineering), networks (DoS, evil twin, on-path), passwords (brute-force, dictionary), apps (SQLi, XSS) and trust (BEC, supply chain).');
  M('c2-vulns', 'Spot the vulnerability', 'Non-compliant, unpatched, unprotected, EOL, BYOD',
    'Pick the vulnerability each audit finding shows.', ['Non-compliant system', 'Unpatched system', 'Unprotected system', 'End-of-life OS', 'BYOD risk'],
    [['A laptop is missing the required disk encryption policy', 'Non-compliant system', 'Fails the security baseline.'],
     ['Server has not installed security updates for four months', 'Unpatched system', 'Known holes open.'],
     ['PC has no antivirus and the firewall is off', 'Unprotected system', 'Missing basic protection.'],
     ['Kiosk runs an OS version that no longer gets updates', 'End-of-life OS', 'Cannot be patched.'],
     ['Personal phones with unknown security access company email', 'BYOD risk', 'Unmanaged devices.']],
    'Vulnerabilities are weaknesses; threats exploit them. Fix the weakness and many threats stop working.');
  M('c2-se-wrap', 'Threat briefing', 'Combined 2.5',
    'Pick the best defence.', ['User training + report button', 'Call back on a known number', 'Access control vestibule', 'Shred documents', 'MFA + lockout', 'Input validation', 'Verify payment changes by phone', 'Patch management', 'MDM for BYOD'],
    [['Spear-phishing emails to the finance team', 'User training + report button', 'People are the control.'],
     ['A caller says they are the CEO and need a password reset now', 'Call back on a known number', 'Verify identity.'],
     ['Visitors slip in behind staff', 'Access control vestibule', 'Stops tailgating.'],
     ['Network diagrams found in the recycling', 'Shred documents', 'Stops dumpster diving.'],
     ['Brute-force and dictionary attacks on the VPN', 'MFA + lockout', 'Guessing alone fails.'],
     ['SQL injection on the customer portal', 'Input validation', 'Treat input as data.'],
     ['Vendor email asks to change bank details', 'Verify payment changes by phone', 'Stops BEC.'],
     ['Servers months behind on updates', 'Patch management', 'Close known holes.'],
     ['Unmanaged personal phones reading company email', 'MDM for BYOD', 'Enforce policy on devices.']],
    'For every threat, there is a matching control — and the cheapest one is often a process: verify, call back, shred, train.');

  RK.add({ track: TR, id: '2.5', dom: 2, short: 'Social engineering, threats & vulnerabilities', title: 'Compare and contrast common social engineering attacks, threats, and vulnerabilities',
    goal: 'Recognize social engineering, technical threats and common vulnerabilities, and match each to a defence.',
    kw: /\b(social engineering|phishing|vishing|smishing|quishing|qr code|spear|whaling|shoulder surf|tailgat|piggyback|impersonat|dumpster|\bdos\b|ddos|denial of service|evil twin|zero.day|spoof|on.path|man.in.the.middle|brute.force|dictionary|insider|sql injection|cross.site|\bxss\b|business email compromise|\bbec\b|supply chain|unpatched|non.compliant|unprotected|byod)/,
    parts: [
      P('Social engineering', 'Identify phishing variants, shoulder surfing, tailgating, impersonation and dumpster diving.',
        `<p><b>Social engineering</b> manipulates people into giving access or information.</p>
<ul><li><b>Phishing</b> — fraudulent email. Variants: <b>vishing</b> (voice calls), <b>smishing</b> (SMS), <b>QR code phishing</b> (malicious QR codes), <b>spear phishing</b> (researched, targeted at one person or team), <b>whaling</b> (targets executives).</li>
<li><b>Shoulder surfing</b> — watching someone enter a password or PIN.</li>
<li><b>Tailgating</b> — following an authorized person through a secured door.</li>
<li><b>Impersonation</b> — pretending to be IT, a vendor, a manager, or an auditor.</li>
<li><b>Dumpster diving</b> — searching trash for passwords, diagrams, org charts.</li></ul>
<p>Red flags in all of them: <b>urgency</b>, <b>authority</b>, and a request to bypass the normal process.</p>` + pro('Help-desk rule: never reset a password or approve MFA for a caller you have not verified through a callback or a documented identity check. Help desks are prime impersonation targets.') + trap('Whaling targets executives; spear phishing targets any specific person. Whaling is a kind of spear phishing.'),
        [['A text message with a fake delivery link is:', 'Smishing', ['Vishing', 'Whaling', 'Tailgating'], 'SMS phishing.'],
         ['Phishing aimed specifically at the CEO is called:', 'Whaling', ['Smishing', 'Vishing', 'Dumpster diving'], 'Big fish.']],
        'c2-soceng'),
      P('Threats', 'Recognize DoS/DDoS, evil twin, zero-day, spoofing, on-path, password attacks, insider threats, SQLi, XSS, BEC and supply chain attacks.',
        `<ul><li><b>DoS / DDoS</b> — overwhelm a service so legitimate users cannot use it (one source / many).</li>
<li><b>Evil twin</b> — a rogue Wi-Fi AP copying a real SSID.</li>
<li><b>Zero-day</b> — exploit for a flaw with no patch yet.</li>
<li><b>Spoofing</b> — faking an identity: email sender, IP, MAC, caller ID.</li>
<li><b>On-path attack</b> — attacker secretly between two parties, reading or altering traffic.</li>
<li><b>Brute-force</b> (every combination) and <b>dictionary</b> (common words/leaked passwords) attacks.</li>
<li><b>Insider threat</b> — a trusted person misusing access.</li>
<li><b>SQL injection</b> — database commands entered into an input field. <b>Cross-site scripting (XSS)</b> — malicious script injected into a web page for other users.</li>
<li><b>Business email compromise (BEC)</b> — fraud using real or look-alike business email (fake invoices, payroll redirects).</li>
<li><b>Supply chain / pipeline attack</b> — compromise a supplier or build pipeline to reach its customers.</li></ul>` + pro('Account lockout and MFA make brute-force and dictionary attacks nearly useless; long passphrases make them slow even without lockout.') + trap('DoS vs DDoS: the only difference is the number of attacking sources.'),
        [['Malicious code delivered inside a trusted vendor\'s software update is a:', 'Supply chain attack', ['Zero-day', 'Evil twin', 'Brute-force attack'], 'Compromised supplier.'],
         ['An attacker enters database commands into a website login box. Which attack?', 'SQL injection', ['XSS', 'Spoofing', 'DDoS'], 'Injection into the database query.']],
        'c2-threats'),
      P('Vulnerabilities', 'Spot non-compliant, unpatched, unprotected, EOL and BYOD weaknesses.',
        `<p>A <b>vulnerability</b> is a weakness that a threat can use. A+ lists five common ones:</p>
<ul><li><b>Non-compliant systems</b> — do not meet the organization\'s security baseline or regulations (missing encryption, wrong settings).</li>
<li><b>Unpatched systems</b> — missing OS, firmware or application updates; known exploits work.</li>
<li><b>Unprotected systems</b> — missing antivirus and/or firewall.</li>
<li><b>EOL OSs</b> — end of life: no security patches will ever come.</li>
<li><b>Bring your own device (BYOD)</b> — personal devices with unknown security touching company data.</li></ul>
<p>Most real breaches use an <i>old</i> vulnerability on an unpatched or unprotected system, not a zero-day.</p>` + pro('Compliance dashboards in MDM/endpoint tools list non-compliant devices daily. Working that list down is real, valued help-desk work.') + trap('A vulnerability is the weakness; the threat is what uses it; the exploit is how.'),
        [['A PC with no antivirus and the firewall turned off is:', 'An unprotected system', ['A zero-day', 'A supply chain attack', 'A BYOD device'], 'Missing basic protection.'],
         ['Why is an EOL OS a vulnerability?', 'It will never receive new security patches', ['It runs too fast', 'It cannot join Wi-Fi', 'It blocks antivirus'], 'No more fixes.']],
        'c2-vulns')
    ],
    wrap: { recap: ['Phishing (email), vishing (voice), smishing (SMS), QR phishing, spear phishing (targeted), whaling (executives).', 'Shoulder surfing, tailgating, impersonation, dumpster diving.', 'DoS/DDoS, evil twin, zero-day, spoofing, on-path.', 'Brute-force and dictionary attacks; insider threats; SQL injection; XSS; BEC; supply chain.', 'Vulnerabilities: non-compliant, unpatched, unprotected, EOL, BYOD.', 'Defences: training, verification, MFA + lockout, input validation, patching, MDM.'], lab: 'c2-se-wrap' }
  });
})();
