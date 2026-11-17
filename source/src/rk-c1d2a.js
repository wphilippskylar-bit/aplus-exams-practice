/* A+ Core 1 (220-1201) — Domain 2.0 Networking — objectives 2.1 to 2.4 */
(function () {
  var RK = window.RK, P = RK.P, M = RK.M, O = RK.O, T = RK.T, TR = 'core1';
  function pro(t) { return '<div class="callout pro"><b class="k">On the job</b>' + t + '</div>'; }
  function trap(t) { return '<div class="callout trap"><b class="k">Exam trap</b>' + t + '</div>'; }

  // ===================== 2.1 Ports & protocols =====================
  T('c1-ports', 'Which services is this server offering?', 'Listening ports from PowerShell',
    'Ticket: users cannot open the shared drive on FS01, but they can Remote Desktop to it. You are on FS01 in elevated PowerShell, then on a user\'s PC.',
    { shell: 'ps', prompt: 'PS C:\\Windows\\system32>' },
    [{ t: 'List the TCP ports FS01 is listening on, sorted by port.', accept: [/^get-nettcpconnection -state listen \| sort(-object)? (-property )?localport( -unique)?( \| select(-object)? .+)?$/i, /^netstat -an(o)?( \| (findstr|select-string) listen(ing)?)?$/i], show: 'Get-NetTCPConnection -State Listen | Sort-Object LocalPort -Unique | Select-Object LocalPort', hint: 'Get-NetTCPConnection -State Listen | Sort-Object LocalPort', out: 'LocalPort\n---------\n       22\n      135\n      139\n     3389\n     5985', ask: { q: 'SMB file sharing needs which TCP port — and is it in the list? (answer the port number)', accept: ['445'], why: 'SMB/CIFS uses TCP 445 and it is missing: the Server service (LanmanServer) is stopped. 139 is old NetBIOS session, 3389 is RDP, 22 is SSH.' }, why: 'Know the port, then look for it.' },
     { t: 'Start the Server service that provides SMB file sharing.', accept: [/^start-service( -name)? lanmanserver$/i, /^net start (lanmanserver|server)$/i], show: 'Start-Service LanmanServer', hint: 'Start-Service LanmanServer', out: '', why: 'LanmanServer = the SMB server.' },
     { t: 'From the user\'s PC, test TCP 445 on FS01.', accept: [/^test-netconnection( -computername)? fs01 -port 445$/i, /^tnc fs01 -port 445$/i], show: 'Test-NetConnection FS01 -Port 445', hint: 'Test-NetConnection <host> -Port <n>', out: 'ComputerName     : FS01\nRemoteAddress    : 10.1.1.20\nRemotePort       : 445\nTcpTestSucceeded : True', why: 'SMB reachable. The drive maps again.' },
     { t: 'The user also says mail is not sending. Test the mail server MAIL01 on the port used to send mail between servers.', accept: [/^test-netconnection( -computername)? mail01 -port 25$/i, /^tnc mail01 -port 25$/i], show: 'Test-NetConnection MAIL01 -Port 25', hint: 'SMTP port.', out: 'RemotePort       : 25\nTcpTestSucceeded : True', why: 'SMTP (25) sends mail. POP3 (110) and IMAP (143) are for retrieving it.' },
     { t: 'List the UDP endpoints on the user\'s PC.', accept: [/^get-netudpendpoint( \| sort(-object)? (-property )?localport)?( \| select(-object)? .+)?$/i, /^netstat -an(o)? -p udp$/i], show: 'Get-NetUDPEndpoint | Sort-Object LocalPort | Select-Object LocalAddress,LocalPort', hint: 'Get-NetUDPEndpoint', out: 'LocalAddress LocalPort\n------------ ---------\n0.0.0.0             68\n0.0.0.0            123\n0.0.0.0            137\n0.0.0.0            138', ask: { q: 'Which DHCP port is the client using?', accept: ['68'], why: 'DHCP: server UDP 67, client UDP 68. 123 is NTP; 137/138 NetBIOS name/datagram. UDP has no "Listen" state — it is connectionless.' }, why: 'TCP vs UDP.' }],
    'Port-based troubleshooting: know the port → is it listening? → is it reachable? → fix the service or firewall.',
    ['Get-NetTCPConnection -State Listen, Test-NetConnection -Port, Get-NetUDPEndpoint.']);
  M('c1-portpick', 'Name that port', 'Ports 20–3389',
    'Pick the port.', ['20/21', '22', '23', '25', '53', '67/68', '80', '110', '143', '137–139', '389', '443', '445', '3389'],
    [['FTP data and control', '20/21', 'FTP.'], ['Encrypted remote command line', '22', 'SSH.'], ['Unencrypted remote command line', '23', 'Telnet.'], ['Send mail', '25', 'SMTP.'], ['Name resolution', '53', 'DNS.'], ['Automatic IP addressing', '67/68', 'DHCP.'], ['Unencrypted web', '80', 'HTTP.'], ['Download mail and remove from server', '110', 'POP3.'], ['Read mail while it stays on the server', '143', 'IMAP.'], ['Legacy Windows name/session services', '137–139', 'NetBIOS/NetBT.'], ['Directory queries', '389', 'LDAP.'], ['Encrypted web', '443', 'HTTPS.'], ['Windows file and printer sharing', '445', 'SMB/CIFS.'], ['Remote Desktop', '3389', 'RDP.']],
    'Learn them in groups: file (20/21, 445), remote (22, 23, 3389), mail (25, 110, 143), core (53, 67/68), web (80, 443), directory/legacy (389, 137–139).');
  M('c1-tcpudp', 'TCP or UDP?', 'Combined 2.1',
    'Pick the transport.', ['TCP', 'UDP'],
    [['Connection-oriented with a three-way handshake', 'TCP', 'SYN, SYN-ACK, ACK.'], ['Connectionless, no delivery guarantee', 'UDP', 'Fire and forget.'], ['Retransmits lost segments and puts them in order', 'TCP', 'Reliable.'], ['DHCP address requests', 'UDP', '67/68.'], ['Most DNS queries', 'UDP', 'TCP 53 for zone transfers/large replies.'], ['HTTPS web traffic', 'TCP', '443.'], ['Live voice and video where speed beats retransmission', 'UDP', 'Low overhead.'], ['SMB file copies', 'TCP', '445.'], ['TFTP and NTP', 'UDP', 'Simple, small.']],
    'TCP = reliable, ordered, slower. UDP = fast, no guarantees.');

  RK.add({ track: TR, id: '2.1', dom: 2, short: 'Ports & protocols', title: 'Compare and contrast TCP and UDP ports, protocols, and their purposes',
    goal: 'Name the ports and purposes of FTP, SSH, Telnet, SMTP, DNS, DHCP, HTTP, POP3, IMAP, NetBIOS, LDAP, HTTPS, SMB and RDP, and choose TCP or UDP.',
    kw: /\b(port \d+|tcp|udp|ftp|ssh|telnet|smtp|pop3|imap|netbios|ldap|smb|cifs|rdp|3389|443|445|\b53\b|67|68|110|143|389|handshake|connectionless|connection.oriented)/,
    parts: [
      P('TCP vs UDP', 'Compare the two transport protocols and decide which a service uses.',
        `<p>Every network service runs on a <b>port</b> (a number from 0 to 65,535) over one of two transports:</p>
<table><tr><th></th><th>TCP</th><th>UDP</th></tr>
<tr><td>Connection</td><td><b>Connection-oriented</b>: three-way handshake (SYN, SYN-ACK, ACK)</td><td><b>Connectionless</b>: just sends</td></tr>
<tr><td>Reliability</td><td>Acknowledges, retransmits, keeps order</td><td>No guarantee, no retransmit</td></tr>
<tr><td>Overhead</td><td>Higher</td><td>Lower, faster</td></tr>
<tr><td>Used by</td><td>Web, mail, file sharing, remote access</td><td>DHCP, most DNS queries, TFTP, NTP, VoIP/streaming</td></tr></table>
<p>A <b>socket</b> = IP address + port, e.g. 10.1.1.20:445. Servers <b>listen</b> on well-known ports (under 1024); clients use random high ports.</p>` + pro('"Can\'t reach X" tickets start with the port: is the service listening on the server, and does Test-NetConnection -Port succeed from the client? That splits a server problem from a network/firewall problem in one minute.') + trap('DNS uses UDP 53 for normal queries and TCP 53 for zone transfers and large responses — "DNS is UDP only" is wrong.'),
        [['Which transport uses a three-way handshake?', 'TCP', ['UDP', 'ICMP', 'ARP'], 'SYN, SYN-ACK, ACK.'],
         ['Which service uses UDP 67/68?', 'DHCP', ['SMTP', 'RDP', 'LDAP'], 'Address assignment.']],
        'c1-tcpudp'),
      P('The ports you must know', 'Match each common service to its port and purpose.',
        `<table><tr><th>Port</th><th>Protocol</th><th>Purpose</th></tr>
<tr><td>20/21</td><td>FTP</td><td>File transfer (20 data, 21 control); unencrypted</td></tr>
<tr><td>22</td><td>SSH</td><td>Encrypted remote shell (also SFTP/SCP)</td></tr>
<tr><td>23</td><td>Telnet</td><td>Unencrypted remote shell — avoid</td></tr>
<tr><td>25</td><td>SMTP</td><td>Send mail</td></tr>
<tr><td>53</td><td>DNS</td><td>Name resolution</td></tr>
<tr><td>67/68</td><td>DHCP</td><td>Automatic addressing (server/client)</td></tr>
<tr><td>80 / 443</td><td>HTTP / HTTPS</td><td>Web, unencrypted / TLS-encrypted</td></tr>
<tr><td>110</td><td>POP3</td><td>Download mail (usually removes it from the server)</td></tr>
<tr><td>143</td><td>IMAP</td><td>Read mail kept on the server, synced across devices</td></tr>
<tr><td>137–139</td><td>NetBIOS/NetBT</td><td>Legacy Windows name, datagram and session services</td></tr>
<tr><td>389</td><td>LDAP</td><td>Directory queries (Active Directory)</td></tr>
<tr><td>445</td><td>SMB/CIFS</td><td>Windows file and printer sharing</td></tr>
<tr><td>3389</td><td>RDP</td><td>Remote Desktop</td></tr></table>` + pro('Never expose 3389 (RDP), 23 (Telnet) or 445 (SMB) directly to the Internet — they are among the most attacked ports. Use a VPN.') + trap('POP3 vs IMAP: a user who reads mail on a phone and a laptop and wants both to match needs IMAP (143), not POP3 (110).'),
        [['Which port does RDP use?', '3389', ['445', '389', '22'], 'Remote Desktop.'],
         ['A user wants mail to stay on the server and sync across devices. Which protocol?', 'IMAP (143)', ['POP3 (110)', 'SMTP (25)', 'FTP (21)'], 'IMAP keeps mail on the server.']],
        'c1-ports')
    ],
    wrap: { recap: ['TCP: connection-oriented, handshake, reliable. UDP: connectionless, fast, no guarantee.', 'File: FTP 20/21, SMB/CIFS 445. Remote: SSH 22, Telnet 23 (unencrypted), RDP 3389.', 'Mail: SMTP 25 send; POP3 110 download; IMAP 143 keep on server.', 'Core: DNS 53 (UDP, TCP for big replies); DHCP 67/68 UDP.', 'Web: HTTP 80, HTTPS 443. Directory/legacy: LDAP 389, NetBIOS/NetBT 137–139.', 'Troubleshoot by port: listening on server? reachable from client?'], lab: 'c1-portpick' }
  });

  // ===================== 2.2 Wireless technologies =====================
  T('c1-wifi', 'Slow Wi-Fi on a new laptop', 'Band, channel and standard from netsh',
    'Ticket: "My brand-new laptop is slow on Wi-Fi at my desk." The access point supports 2.4, 5 and 6 GHz. PowerShell on the laptop.',
    { shell: 'ps', prompt: 'PS C:\\Users\\mreyes>' },
    [{ t: 'Show the current wireless connection details.', accept: [/^netsh wlan show interfaces?$/i], show: 'netsh wlan show interfaces', hint: 'netsh wlan show interfaces', out: '    SSID                   : OFFICE\n    Radio type             : 802.11n\n    Band                   : 2.4 GHz\n    Channel                : 6\n    Receive rate (Mbps)    : 72\n    Signal                 : 61%', ask: { q: 'Which frequency band is it using?', accept: ['2.4', '2.4 ghz', '2.4ghz'], why: '2.4 GHz with 802.11n — slow and crowded. The laptop supports 802.11ax (Wi-Fi 6E) on 5 and 6 GHz.' }, why: 'Read band, channel, standard and rate.' },
     { t: 'List every access point the laptop can hear, with channels.', accept: [/^netsh wlan show networks mode=bssid$/i], show: 'netsh wlan show networks mode=bssid', hint: 'netsh wlan show networks mode=bssid', out: 'SSID 1 : OFFICE\n    BSSID 1  : a4:2b:..:01   Signal : 61%  Radio type : 802.11ax  Band : 2.4 GHz  Channel : 6\n    BSSID 2  : a4:2b:..:02   Signal : 54%  Radio type : 802.11ax  Band : 5 GHz    Channel : 36\n    BSSID 3  : a4:2b:..:03   Signal : 48%  Radio type : 802.11ax  Band : 6 GHz    Channel : 37\nSSID 2 : NEIGHBOR-1   Band : 2.4 GHz  Channel : 6\nSSID 3 : CAFE-GUEST   Band : 2.4 GHz  Channel : 6\nSSID 4 : PRINTER-DIRECT Band : 2.4 GHz Channel : 6', ask: { q: 'How many networks are sharing 2.4 GHz channel 6? (number)', accept: ['4'], why: 'Four networks on channel 6 = contention and interference. In 2.4 GHz only channels 1, 6 and 11 do not overlap.' }, why: 'Channel congestion explains the slowness.' },
     { t: 'Tell the Wi-Fi adapter to prefer the 5 GHz band.', accept: [/^set-netadapteradvancedproperty -name "?wi-fi"? -displayname "?preferred band"? -displayvalue "?prefer 5(\.2)? ?ghz band"?$/i], show: 'Set-NetAdapterAdvancedProperty -Name "Wi-Fi" -DisplayName "Preferred Band" -DisplayValue "Prefer 5GHz band"', hint: 'Set-NetAdapterAdvancedProperty -Name "Wi-Fi" -DisplayName "Preferred Band" -DisplayValue "Prefer 5GHz band"', out: '', why: 'Driver setting. (Band steering on the AP does the same from the network side.)' },
     { t: 'Check the connection again after it reconnects.', accept: [/^netsh wlan show interfaces?$/i], show: 'netsh wlan show interfaces', hint: 'Same command as step 1.', out: '    Radio type             : 802.11ax\n    Band                   : 5 GHz\n    Channel                : 36\n    Receive rate (Mbps)    : 1201\n    Signal                 : 54%', ask: { q: 'What is the new receive rate in Mbps?', accept: ['1201'], why: '72 → 1201 Mbps: 802.11ax on a clear 5 GHz channel with an 80 MHz width. Slightly weaker signal, much more throughput.' }, why: 'Verify the fix with numbers.' }],
    'Wi-Fi slowness: read band/channel/standard → look for channel congestion → move to 5/6 GHz or a clear channel → verify the rate.',
    ['netsh wlan show interfaces / show networks mode=bssid.']);
  M('c1-80211', 'Which 802.11 standard?', 'a/b/g/n/ac/ax/be',
    'Pick the standard.', ['802.11a', '802.11b', '802.11g', '802.11n (Wi-Fi 4)', '802.11ac (Wi-Fi 5)', '802.11ax (Wi-Fi 6/6E)', '802.11be (Wi-Fi 7)'],
    [['5 GHz only, 54 Mbps, from 1999', '802.11a', 'Early 5 GHz.'], ['2.4 GHz, 11 Mbps', '802.11b', 'Oldest common.'], ['2.4 GHz, 54 Mbps', '802.11g', 'Successor to b.'], ['First with MIMO; 2.4 and 5 GHz', '802.11n (Wi-Fi 4)', 'MIMO.'], ['5 GHz only, MU-MIMO, gigabit speeds', '802.11ac (Wi-Fi 5)', 'Wave 2 MU-MIMO.'], ['OFDMA, up to 6 GHz with the E version', '802.11ax (Wi-Fi 6/6E)', 'Dense environments.'], ['320 MHz channels and multi-link operation', '802.11be (Wi-Fi 7)', 'Newest.']],
    'b/g = 2.4; a/ac = 5; n = both; ax = 2.4/5 (+6 with 6E); be = 2.4/5/6.');
  M('c1-wl-wrap', 'Wireless technologies desk', 'Combined 2.2',
    'Pick the best answer.', ['2.4 GHz', '5 GHz', '6 GHz', 'Channels 1, 6, 11', 'Wider channel (80/160 MHz)', 'Regulations (country setting)', 'Bluetooth', 'NFC', 'RFID'],
    [['Best range through walls, most interference', '2.4 GHz', 'Longer wavelength, crowded.'], ['Good speed, many non-overlapping channels, shorter range', '5 GHz', 'Common default.'], ['Newest, clean spectrum, needs Wi-Fi 6E/7 devices', '6 GHz', 'Shortest range.'], ['The only non-overlapping 2.4 GHz channels in North America', 'Channels 1, 6, 11', 'Avoid overlap.'], ['More throughput in a quiet area, fewer channels available', 'Wider channel (80/160 MHz)', 'Channel width trade-off.'], ['Which channels and power are legal depends on this', 'Regulations (country setting)', 'Set the AP country code.'], ['Wireless keyboard and earbuds', 'Bluetooth', 'PAN.'], ['Tap phone to pay', 'NFC', 'cm range.'], ['Inventory tags read by a handheld scanner in a warehouse', 'RFID', 'Radio-frequency identification.']],
    'Pick the band for the job: range (2.4), balance (5), clean speed (6).');

  RK.add({ track: TR, id: '2.2', dom: 2, short: 'Wireless technologies', title: 'Explain wireless networking technologies',
    goal: 'Compare 2.4/5/6 GHz bands, channels and widths, 802.11 standards, Bluetooth, NFC and RFID.',
    kw: /\b(2\.4 ?ghz|5 ?ghz|6 ?ghz|channel|802\.11|wi.?fi [4-7]|mimo|ofdma|bluetooth|nfc|rfid|wireless standard|frequenc)/,
    parts: [
      P('Frequencies and channels', 'Compare the 2.4, 5 and 6 GHz bands and choose channels and channel widths.',
        `<table><tr><th>Band</th><th>Range</th><th>Speed / interference</th></tr>
<tr><td><b>2.4 GHz</b></td><td>Longest, best through walls</td><td>Slowest; crowded (microwaves, Bluetooth, neighbors). Only <b>3 non-overlapping channels</b>: 1, 6, 11.</td></tr>
<tr><td><b>5 GHz</b></td><td>Shorter</td><td>Faster; many non-overlapping channels; some (DFS) shared with weather radar.</td></tr>
<tr><td><b>6 GHz</b></td><td>Shortest</td><td>Fastest and cleanest; Wi-Fi 6E and Wi-Fi 7 devices only.</td></tr></table>
<p><b>Channels</b>:</p>
<ul><li><b>Regulations</b> — each country decides which channels and transmit power are legal; set the AP\'s country code correctly.</li>
<li><b>Channel selection</b> — use a Wi-Fi analyzer, pick the least-used channel; neighboring APs on non-overlapping channels.</li>
<li><b>Channel width</b> — 20, 40, 80, 160 (and 320 on Wi-Fi 7) MHz. Wider = faster, but fewer channels and more chance of overlap. Use 20 MHz on 2.4 GHz.</li></ul>` + pro('In a crowded office, 20 or 40 MHz channels on 5 GHz often beat 160 MHz: more APs get a clean channel each.') + trap('Higher frequency = more speed but less range. 2.4 GHz reaches farther than 5 or 6 GHz.'),
        [['Which 2.4 GHz channels do not overlap?', '1, 6 and 11', ['1, 2 and 3', '36, 40 and 44', '6, 7 and 8'], 'Three clean channels.'],
         ['Which band has the longest range?', '2.4 GHz', ['5 GHz', '6 GHz', '60 GHz'], 'Lower frequency travels farther.']],
        'c1-wifi'),
      P('802.11 standards, Bluetooth, NFC and RFID', 'Identify 802.11 standards and compare Bluetooth, NFC and RFID.',
        `<table><tr><th>Standard</th><th>Band(s)</th><th>Note</th></tr>
<tr><td>802.11a</td><td>5 GHz</td><td>54 Mbps</td></tr>
<tr><td>802.11b / g</td><td>2.4 GHz</td><td>11 / 54 Mbps</td></tr>
<tr><td>802.11n (Wi-Fi 4)</td><td>2.4 + 5</td><td>MIMO (multiple antennas)</td></tr>
<tr><td>802.11ac (Wi-Fi 5)</td><td>5</td><td>MU-MIMO, gigabit</td></tr>
<tr><td>802.11ax (Wi-Fi 6 / 6E)</td><td>2.4 + 5 (+ 6 for 6E)</td><td>OFDMA, efficient in dense areas</td></tr>
<tr><td>802.11be (Wi-Fi 7)</td><td>2.4 + 5 + 6</td><td>320 MHz channels, multi-link</td></tr></table>
<ul><li><b>Bluetooth</b> — 2.4 GHz personal area network (PAN), ~10 m, for headsets, keyboards, mice.</li>
<li><b>NFC</b> — near-field communication, ~4 cm, payments and badge taps.</li>
<li><b>RFID</b> — radio-frequency identification: tags (often unpowered) read by a scanner; inventory, badges, toll tags. NFC is a short-range type of RFID.</li></ul>` + pro('Mixed old and new clients slow a network down. Disabling 802.11b support on the AP is a common quick win.') + trap('802.11ac is 5 GHz only. 802.11n is the first standard on both 2.4 and 5 GHz.'),
        [['Which standard added MU-MIMO on 5 GHz only?', '802.11ac', ['802.11b', '802.11g', '802.11a'], 'Wi-Fi 5.'],
         ['Warehouse pallets carry tags read by a handheld scanner. Which technology?', 'RFID', ['Bluetooth', 'NFC payment', 'Wi-Fi 6E'], 'Radio-frequency identification.']],
        'c1-80211')
    ],
    wrap: { recap: ['2.4 GHz: range, interference, channels 1/6/11. 5 GHz: speed, many channels. 6 GHz: cleanest, 6E/7 only.', 'Regulations set legal channels and power; set the country code.', 'Channel selection with an analyzer; wider channels = faster but fewer.', '802.11a/b/g/n/ac/ax/be — know bands and key features (MIMO, MU-MIMO, OFDMA).', 'Bluetooth PAN ~10 m; NFC ~4 cm; RFID tags for inventory/badges.', 'Verify fixes with netsh wlan show interfaces (band, channel, rate).'], lab: 'c1-wl-wrap' }
  });

  // ===================== 2.3 Networked host services =====================
  M('c1-roles', 'Which server role?', 'DNS, DHCP, file, print, mail, syslog, web, AAA, database, NTP',
    'Pick the server role.', ['DNS server', 'DHCP server', 'Fileshare', 'Print server', 'Mail server', 'Syslog', 'Web server', 'AAA', 'Database server', 'NTP'],
    [['Turns intranet.corp.local into 10.1.1.40', 'DNS server', 'Name resolution.'], ['Hands out IP address, mask, gateway and DNS', 'DHCP server', 'Addressing.'], ['Central folders users map as drives', 'Fileshare', 'SMB.'], ['Manages queues and drivers for 30 office printers', 'Print server', 'Central printing.'], ['Stores and delivers company email', 'Mail server', 'SMTP/IMAP.'], ['Collects log messages from switches, firewalls and servers', 'Syslog', 'Central logging.'], ['Hosts the company intranet site', 'Web server', 'HTTP/HTTPS.'], ['Checks VPN users\' credentials, permissions and logs their sessions', 'AAA', 'Authentication, authorization, accounting (RADIUS/TACACS+).'], ['Stores the CRM records behind an application', 'Database server', 'SQL.'], ['Keeps every clock in sync', 'NTP', 'Time.']],
    'Server roles are services; one physical server can run several.');
  M('c1-appliance', 'Appliance, legacy or IoT?', 'Spam gateway, UTM, load balancer, proxy, SCADA, IoT',
    'Pick the device type.', ['Spam gateway', 'Unified threat management (UTM)', 'Load balancer', 'Proxy server', 'SCADA', 'IoT device'],
    [['Filters junk and phishing mail before it reaches the mail server', 'Spam gateway', 'Mail filtering.'], ['One box: firewall, IPS, antivirus, content filter and VPN', 'Unified threat management (UTM)', 'All-in-one.'], ['Spreads web requests across four identical web servers', 'Load balancer', 'Availability and scale.'], ['Makes web requests on behalf of users and can cache and filter them', 'Proxy server', 'Intermediary.'], ['Controls pumps and valves at a water treatment plant', 'SCADA', 'Industrial control, often legacy/embedded.'], ['Smart thermostat and doorbell camera on the office network', 'IoT device', 'Put them on their own VLAN.']],
    'Legacy/embedded systems and IoT are hard to patch — isolate them.');
  M('c1-svc-wrap', 'Networked services desk', 'Combined 2.3',
    'Pick the best answer.', ['DNS server', 'DHCP server', 'Syslog', 'NTP', 'AAA', 'Load balancer', 'Proxy server', 'UTM', 'SCADA'],
    [['Every PC got 169.254 addresses this morning', 'DHCP server', 'No leases handed out.'], ['Users can reach sites by IP but not by name', 'DNS server', 'Name resolution failing.'], ['Investigator needs firewall logs from last week in one place', 'Syslog', 'Central log collection.'], ['Kerberos sign-ins fail because clocks differ by 10 minutes', 'NTP', 'Time sync.'], ['Wi-Fi users authenticate with their domain accounts through RADIUS', 'AAA', '802.1X/RADIUS.'], ['The web shop must keep running if one web server fails', 'Load balancer', 'Distributes and health-checks.'], ['School must block and log certain websites for all students', 'Proxy server', 'Content filtering.'], ['Small office wants firewall, antivirus and VPN in one device', 'UTM', 'All-in-one.'], ['Factory control system still runs an unsupported OS', 'SCADA', 'Legacy/embedded — segment it.']],
    'Symptom → which service is missing.');

  RK.add({ track: TR, id: '2.3', dom: 2, short: 'Networked host services', title: 'Summarize services provided by networked hosts',
    goal: 'Describe server roles, Internet appliances, legacy/embedded (SCADA) systems and IoT devices.',
    kw: /\b(server role|dns server|dhcp server|file ?share|file server|print server|mail server|syslog|web server|aaa|radius|tacacs|database server|ntp|spam gateway|utm|unified threat|load balanc|proxy|scada|legacy|embedded|iot|internet of things)/,
    parts: [
      P('Server roles', 'Describe what DNS, DHCP, fileshare, print, mail, syslog, web, AAA, database and NTP servers provide.',
        `<ul><li><b>DNS</b> — resolves names to IP addresses (port 53).</li>
<li><b>DHCP</b> — leases IP address, subnet mask, gateway and DNS servers to clients (67/68).</li>
<li><b>Fileshare</b> — central shared folders (SMB 445), with NTFS/share permissions.</li>
<li><b>Print servers</b> — host printer queues and drivers so clients install once and admins manage centrally.</li>
<li><b>Mail servers</b> — send (SMTP) and store/deliver (IMAP/POP3) email; e.g. Exchange, now often cloud.</li>
<li><b>Syslog</b> — collects log messages from many devices in one place (UDP 514), the basis of a SIEM.</li>
<li><b>Web servers</b> — host websites and web apps (HTTP/HTTPS).</li>
<li><b>AAA</b> — authentication, authorization and accounting, e.g. RADIUS or TACACS+ for VPN, Wi-Fi and device logins.</li>
<li><b>Database servers</b> — store structured data for applications (SQL).</li>
<li><b>NTP</b> — Network Time Protocol keeps clocks synchronized (UDP 123).</li></ul>` + pro('When "everything" breaks at once, think shared services first: DNS and DHCP outages look like a dozen different problems.') + trap('AAA is three things: authentication (who are you), authorization (what may you do), accounting (what did you do).'),
        [['Which server collects log messages from network devices?', 'Syslog', ['NTP', 'DHCP', 'Print'], 'Central logging.'],
         ['What does the second A in AAA stand for?', 'Authorization', ['Authentication', 'Accounting', 'Availability'], 'Authentication, authorization, accounting.']],
        'c1-roles'),
      P('Appliances, SCADA and IoT', 'Describe spam gateways, UTM, load balancers, proxy servers, legacy/embedded SCADA systems and IoT devices.',
        `<p><b>Internet appliances</b> sit between users and the Internet:</p>
<ul><li><b>Spam gateways</b> — filter spam, phishing and malware in email before delivery.</li>
<li><b>Unified threat management (UTM)</b> — one device combining firewall, intrusion prevention, antivirus, content filtering and VPN. Popular in small offices.</li>
<li><b>Load balancers</b> — spread traffic across several servers and stop sending to one that fails a health check.</li>
<li><b>Proxy servers</b> — make requests on behalf of clients; can cache, filter and log web use.</li></ul>
<p><b>Legacy/embedded systems</b> — <b>SCADA</b> (supervisory control and data acquisition) runs industrial equipment: power, water, manufacturing. Often old, hard to patch, and must stay running.</p>
<p><b>Internet of Things (IoT) devices</b> — thermostats, cameras, smart TVs, sensors, door locks. Convenient but often weak security.</p>` + pro('Put IoT devices and SCADA systems on their own VLAN, firewalled from user PCs and servers. Change every default password on day one.') + trap('A proxy acts for the client; a load balancer acts for the servers. Both sit in the middle.'),
        [['Which appliance spreads web traffic across several servers?', 'Load balancer', ['Proxy server', 'Spam gateway', 'Syslog'], 'Scale and availability.'],
         ['What is the main security concern with SCADA and IoT devices?', 'They are often hard to patch and weakly secured, so they should be isolated', ['They use too much bandwidth', 'They require RAID', 'They need eSIMs'], 'Segment them.']],
        'c1-appliance')
    ],
    wrap: { recap: ['DNS names → IPs; DHCP leases addresses; NTP time; syslog collects logs.', 'Fileshare (SMB), print servers, mail servers, web servers, database servers.', 'AAA = authentication, authorization, accounting (RADIUS/TACACS+).', 'Spam gateway filters mail; UTM = all-in-one security box.', 'Load balancer spreads traffic for servers; proxy requests on behalf of clients.', 'SCADA (legacy/embedded industrial) and IoT: hard to patch → isolate on their own network.'], lab: 'c1-svc-wrap' }
  });

  // ===================== 2.4 Network configuration concepts =====================
  T('c1-dns', 'Why is our email going to spam?', 'DNS records with nslookup',
    'Ticket: customers say mail from brightpath.example lands in spam since the company started using a new marketing mail service. Command Prompt.',
    { shell: 'cmd', prompt: 'C:\\Users\\tech>' },
    [{ t: 'Find the domain\'s mail servers.', accept: [/^nslookup -(type|q|querytype)=mx brightpath\.example$/i], show: 'nslookup -type=mx brightpath.example', hint: 'nslookup -type=<record type> <domain>', out: 'brightpath.example  MX preference = 10, mail exchanger = brightpath-example.mail.protection.outlook.com', why: 'MX = where mail for the domain is delivered.' },
     { t: 'Show the domain\'s TXT records (that is where SPF lives).', accept: [/^nslookup -(type|q|querytype)=txt brightpath\.example$/i], show: 'nslookup -type=txt brightpath.example', hint: 'TXT record type.', out: 'brightpath.example  text = "v=spf1 include:spf.protection.outlook.com -all"\nbrightpath.example  text = "MS=ms81726354"', ask: { q: 'SPF lists who may send for the domain. Is the new marketing service listed? (yes/no)', accept: ['no'], why: 'Only Microsoft 365 is allowed, with -all (fail everything else). The marketing service must be added: include:<its SPF host>.' }, why: 'SPF — a spam-management TXT record.' },
     { t: 'Check the domain\'s DMARC policy (TXT record at _dmarc).', accept: [/^nslookup -(type|q|querytype)=txt _dmarc\.brightpath\.example$/i], show: 'nslookup -type=txt _dmarc.brightpath.example', hint: 'The DMARC record is at _dmarc.<domain>.', out: '_dmarc.brightpath.example  text = "v=DMARC1; p=quarantine; rua=mailto:dmarc@brightpath.example"', ask: { q: 'What does the policy (p=) tell receivers to do with failing mail?', accept: ['quarantine'], why: 'Quarantine = send failing mail to spam. That is why the marketing mail, failing SPF, lands in spam.' }, why: 'DMARC tells receivers what to do when SPF/DKIM fail.' },
     { t: 'Check the DKIM public key the marketing service gave you (selector mk1).', accept: [/^nslookup -(type|q|querytype)=txt mk1\._domainkey\.brightpath\.example$/i], show: 'nslookup -type=txt mk1._domainkey.brightpath.example', hint: 'DKIM keys live at <selector>._domainkey.<domain>.', out: '*** can\'t find mk1._domainkey.brightpath.example: Non-existent domain', why: 'The DKIM key was never published. Fix: add the DKIM TXT record and the SPF include, then mail passes DMARC.' },
     { t: 'Separately, confirm www is an alias. Look up the website name.', accept: [/^nslookup www\.brightpath\.example$/i], show: 'nslookup www.brightpath.example', hint: 'nslookup <name>', out: 'Name:    bp-site.azurewebsites.example\nAddresses:  2001:db8:40::12\n          203.0.113.12\nAliases:  www.brightpath.example', ask: { q: 'Which record type makes www an alias of another name?', accept: ['cname'], why: 'CNAME = alias. The real host has an A record (IPv4) and an AAAA record (IPv6).' }, why: 'A, AAAA, CNAME in one lookup.' }],
    'Mail deliverability = MX (where to deliver) + SPF (who may send) + DKIM (signed) + DMARC (what to do on failure).',
    ['nslookup -type=mx / -type=txt; _dmarc and <selector>._domainkey names.']);
  M('c1-netcfg', 'DHCP, VLAN or VPN?', 'Configuration concepts',
    'Pick the concept.', ['DHCP lease', 'DHCP reservation', 'DHCP scope', 'DHCP exclusion', 'VLAN', 'VPN'],
    [['The client keeps its address for 8 days, then must renew', 'DHCP lease', 'Lease time.'], ['The printer always gets 10.1.1.50 based on its MAC address', 'DHCP reservation', 'Fixed via DHCP.'], ['The server hands out 10.1.1.100–10.1.1.200 with mask, gateway and DNS', 'DHCP scope', 'Pool + options.'], ['Keep 10.1.1.100–10.1.1.110 out of the pool for static devices', 'DHCP exclusion', 'Not handed out.'], ['Phones and PCs on the same switch but in separate logical networks', 'VLAN', 'Layer 2 segmentation.'], ['A home worker reaches office servers through an encrypted tunnel', 'VPN', 'Remote access.']],
    'Reservation = always the same address via DHCP. Exclusion = never handed out.');
  M('c1-cfg-wrap', 'Configuration concepts desk', 'Combined 2.4',
    'Pick the record or setting.', ['A', 'AAAA', 'CNAME', 'MX', 'TXT (SPF)', 'TXT (DKIM)', 'TXT (DMARC)', 'DHCP reservation', 'VLAN', 'VPN'],
    [['Maps a name to an IPv4 address', 'A', 'Address.'], ['Maps a name to an IPv6 address', 'AAAA', 'Quad-A.'], ['shop.example is an alias of shopify host', 'CNAME', 'Canonical name.'], ['Which server receives mail for the domain', 'MX', 'Mail exchanger.'], ['Lists servers allowed to send mail for the domain', 'TXT (SPF)', 'Sender Policy Framework.'], ['Publishes the public key used to verify mail signatures', 'TXT (DKIM)', 'DomainKeys Identified Mail.'], ['Tells receivers to reject or quarantine mail failing checks', 'TXT (DMARC)', 'Policy and reporting.'], ['The scanner needs the same address every time from DHCP', 'DHCP reservation', 'MAC-based.'], ['Separate guest Wi-Fi traffic from staff on the same switches', 'VLAN', 'Segmentation.'], ['Encrypt traffic for staff working from hotels', 'VPN', 'Tunnel.']],
    'DNS records, DHCP settings, VLANs and VPNs — the four configuration families of 2.4.');

  RK.add({ track: TR, id: '2.4', dom: 2, short: 'Network configuration', title: 'Explain common network configuration concepts',
    goal: 'Explain DNS record types (A, AAAA, CNAME, MX, TXT with SPF/DKIM/DMARC), DHCP leases/reservations/scopes/exclusions, VLANs and VPNs.',
    kw: /\b(a record|aaaa|cname|mx record|txt record|spf|dkim|dmarc|dns record|lease|reservation|scope|exclusion|vlan|vpn|virtual private)/,
    parts: [
      P('DNS records and spam management', 'Explain A, AAAA, CNAME, MX and TXT records, and how SPF, DKIM and DMARC fight spam.',
        `<table><tr><th>Record</th><th>Purpose</th></tr>
<tr><td><b>A</b></td><td>Name → IPv4 address</td></tr>
<tr><td><b>AAAA</b></td><td>Name → IPv6 address</td></tr>
<tr><td><b>CNAME</b></td><td>Alias: one name points to another name</td></tr>
<tr><td><b>MX</b></td><td>Mail exchanger: which server receives the domain\'s email (lowest preference number tried first)</td></tr>
<tr><td><b>TXT</b></td><td>Free text; used for domain verification and <b>spam management</b>:</td></tr></table>
<ul><li><b>SPF</b> (Sender Policy Framework) — lists the servers allowed to send mail for the domain.</li>
<li><b>DKIM</b> (DomainKeys Identified Mail) — the sending server signs each message; the public key is published in DNS so receivers can verify it was not forged or altered.</li>
<li><b>DMARC</b> — tells receivers what to do if SPF/DKIM fail (<code>none</code>, <code>quarantine</code>, <code>reject</code>) and where to send reports.</li></ul>` + pro('When a company adds a new service that sends mail as its domain (marketing, ticketing, invoicing), update SPF and publish its DKIM key before go-live — or customers will see it in spam.') + trap('MX points to a name, not an IP address, and that name needs its own A/AAAA record. A CNAME cannot be used for the MX target.'),
        [['Which record maps a name to an IPv6 address?', 'AAAA', ['A', 'MX', 'CNAME'], 'Quad-A.'],
         ['Which TXT-based standard tells receivers to quarantine or reject failing mail?', 'DMARC', ['SPF', 'DKIM', 'MX'], 'Policy.']],
        'c1-dns'),
      P('DHCP, VLANs and VPNs', 'Explain DHCP leases, reservations, scopes and exclusions, VLANs and VPNs.',
        `<p><b>DHCP</b> automatically configures clients (DORA: Discover, Offer, Request, Acknowledge).</p>
<ul><li><b>Scope</b> — the pool of addresses for a subnet plus options (subnet mask, gateway, DNS servers).</li>
<li><b>Leases</b> — how long a client keeps its address; it tries to renew at 50% of the lease time.</li>
<li><b>Reservations</b> — a specific address always given to a specific MAC address (printers, servers that use DHCP).</li>
<li><b>Exclusions</b> — addresses inside the scope that DHCP will never hand out (kept for statically configured devices).</li></ul>
<p><b>VLAN</b> (virtual LAN) — splits one physical switch into separate logical networks (staff, guest, VoIP, IoT). Traffic between VLANs must go through a router or firewall.</p>
<p><b>VPN</b> (virtual private network) — an encrypted tunnel across an untrusted network. <i>Remote-access</i> VPN connects a user to the office; <i>site-to-site</i> VPN links two offices.</p>` + pro('Give printers DHCP reservations rather than static addresses typed on the printer — you manage every address in one place and avoid duplicates.') + trap('A reservation guarantees an address to one device; an exclusion keeps an address from being given to any device.'),
        [['Which DHCP setting always gives the same address to a device\'s MAC address?', 'Reservation', ['Exclusion', 'Scope', 'Lease'], 'MAC-based.'],
         ['What separates guest and staff traffic on the same physical switch?', 'VLANs', ['A longer DHCP lease', 'An MX record', 'A CNAME'], 'Logical segmentation.']],
        'c1-netcfg')
    ],
    wrap: { recap: ['A = IPv4, AAAA = IPv6, CNAME = alias, MX = mail server, TXT = text.', 'SPF = allowed senders; DKIM = signature key; DMARC = policy (none/quarantine/reject) + reports.', 'DHCP scope = pool + options; lease = time; reservation = same address per MAC; exclusion = never handed out.', 'VLAN = logical network on shared switches; routing/firewall between VLANs.', 'VPN = encrypted tunnel; remote access or site-to-site.', 'Check DNS with nslookup -type=mx / -type=txt.'], lab: 'c1-cfg-wrap' }
  });
})();
