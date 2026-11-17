/* A+ Core 1 (220-1201) — Domain 2.0 Networking — objectives 2.5 to 2.8 + domain wrap lab + extras */
(function () {
  var RK = window.RK, P = RK.P, M = RK.M, O = RK.O, T = RK.T, TR = 'core1';
  function pro(t) { return '<div class="callout pro"><b class="k">On the job</b>' + t + '</div>'; }
  function trap(t) { return '<div class="callout trap"><b class="k">Exam trap</b>' + t + '</div>'; }

  // ===================== 2.5 Networking hardware =====================
  M('c1-nethw', 'Which device?', 'Router, switch, AP, patch panel, firewall, PoE',
    'Pick the device.', ['Router', 'Unmanaged switch', 'Managed switch', 'Access point', 'Patch panel', 'Firewall', 'PoE injector', 'PoE switch'],
    [['Connects the office LAN to the Internet and forwards between IP networks', 'Router', 'Layer 3, between networks.'], ['Plug-and-play 8-port switch with no settings for a small office', 'Unmanaged switch', 'No VLANs, no monitoring.'], ['Switch configured with VLANs, port security and SNMP monitoring', 'Managed switch', 'Configurable.'], ['Lets laptops join the wired network over Wi-Fi', 'Access point', 'Wireless to wired bridge.'], ['Rack panel where wall-jack cables terminate before patch cables run to the switch', 'Patch panel', 'Cable management.'], ['Allows or blocks traffic by rule between the LAN and the Internet', 'Firewall', 'Filtering.'], ['Powers a single camera from a normal switch port', 'PoE injector', 'Adds power to one cable.'], ['Powers 24 phones and APs directly from their network ports', 'PoE switch', 'Built-in power.']],
    'Switches connect devices in one network (MAC addresses); routers connect networks (IP addresses).');
  T('c1-mac', 'Reserve an address for the new printer', 'Find a physical MAC address',
    'Ticket: a new network printer took a random DHCP address (192.168.10.57). You need its MAC address to create a DHCP reservation on the SOHO router. Command Prompt on a PC in the same network.',
    { shell: 'cmd', prompt: 'C:\\Users\\tech>' },
    [{ t: 'Show this PC\'s own adapters with their physical (MAC) addresses.', accept: [/^getmac( \/v)?$/i, /^ipconfig \/all$/i], show: 'getmac /v', hint: 'getmac /v (or ipconfig /all → Physical Address)', out: 'Connection Name Network Adapter              Physical Address\n=============== ============================ =================\nEthernet        Intel(R) Ethernet I219-LM    3C-52-82-1A-77-04', ask: { q: 'How many bits long is a MAC address? (number)', accept: ['48'], why: '48 bits = 12 hex digits. The first half (OUI) identifies the NIC manufacturer.' }, why: 'Physical MAC address = burned into the NIC.' },
     { t: 'Reach the printer once so this PC learns its MAC address.', accept: [/^ping 192\.168\.10\.57( -n \d+)?$/i], show: 'ping 192.168.10.57', hint: 'ping <printer IP>', out: 'Reply from 192.168.10.57: bytes=32 time=2ms TTL=64', why: 'Any traffic triggers ARP, which maps the IP to a MAC.' },
     { t: 'Show the ARP cache entry for the printer.', accept: [/^arp -a( 192\.168\.10\.57)?$/i], show: 'arp -a 192.168.10.57', hint: 'arp -a <IP>', out: 'Interface: 192.168.10.23 --- 0x7\n  Internet Address      Physical Address      Type\n  192.168.10.57         00-1b-a9-4c-8e-21     dynamic', ask: { q: 'What is the printer\'s MAC address?', accept: ['00-1b-a9-4c-8e-21', '00:1b:a9:4c:8e:21', '001ba94c8e21'], why: 'Use this in the router\'s DHCP reservation so the printer always gets the same address.' }, why: 'ARP only works inside the local network — across a router you would see the router\'s MAC.' }],
    'Every NIC has a physical MAC address. Switches forward by MAC; DHCP reservations and port security use it.',
    ['getmac /v, ping, arp -a.']);
  M('c1-wan-hw', 'Which Internet device?', 'Cable modem, DSL, ONT, NIC',
    'Pick the device.', ['Cable modem', 'DSL modem', 'ONT', 'NIC'],
    [['Connects to the coaxial line from the cable company', 'Cable modem', 'DOCSIS over coax.'], ['Connects to the telephone line', 'DSL modem', 'Copper phone pair.'], ['Box on the wall where the fiber line ends at a home', 'ONT', 'Optical network terminal.'], ['The port inside a PC that connects it to the network', 'NIC', 'Network interface card.'], ['Uses the same cable as cable TV', 'Cable modem', 'Coax.'], ['Converts light on fiber to Ethernet', 'ONT', 'Fiber termination.']],
    'The ISP device depends on the medium: coax → cable modem, phone line → DSL, fiber → ONT.');

  RK.add({ track: TR, id: '2.5', dom: 2, short: 'Networking hardware', title: 'Compare and contrast common networking hardware devices',
    goal: 'Compare routers, managed and unmanaged switches, access points, patch panels, firewalls, PoE, cable/DSL modems, ONTs, NICs and MAC addresses.',
    kw: /\b(router|switch(es)?|unmanaged|managed switch|access point|patch panel|firewall|poe|power over ethernet|injector|802\.3a[ft]|802\.3bt|cable modem|dsl|ont|optical network terminal|nic\b|network interface card|mac address)/,
    parts: [
      P('Routers, switches, APs, patch panels, firewalls, PoE', 'Compare the core LAN devices and Power over Ethernet options.',
        `<ul><li><b>Router</b> — connects different IP networks (e.g. LAN to Internet) and picks the path. SOHO routers also do NAT, DHCP, Wi-Fi and a basic firewall.</li>
<li><b>Switch</b> — connects devices inside one network and forwards frames by MAC address.
<ul><li><b>Unmanaged</b> — plug and play, no settings.</li><li><b>Managed</b> — VLANs, port security, link aggregation, monitoring (SNMP), remote management.</li></ul></li>
<li><b>Access point</b> — connects wireless clients to the wired network.</li>
<li><b>Patch panel</b> — rack-mounted termination point for in-wall cables; short patch cables connect panel ports to switch ports.</li>
<li><b>Firewall</b> — allows or blocks traffic by rules (IP, port, application).</li>
<li><b>Power over Ethernet (PoE)</b> — power and data on one cable for APs, phones, cameras.
<ul><li><b>PoE switch</b> (power on every port) or <b>injector</b> (adds power to one cable).</li>
<li><b>Standards</b>: 802.3af PoE (15.4 W), 802.3at PoE+ (30 W), 802.3bt PoE++ (60–100 W).</li></ul></li></ul>` + pro('A new PoE camera that keeps rebooting is often asking for more power than the port budget allows. Check the switch\'s PoE budget and the device\'s class.') + trap('Switch = same network, MAC addresses. Router = between networks, IP addresses.'),
        [['Which device forwards traffic between different IP networks?', 'Router', ['Unmanaged switch', 'Patch panel', 'Access point'], 'Layer 3.'],
         ['Which PoE standard provides up to 30 W per port?', '802.3at (PoE+)', ['802.3af', '802.11ax', '802.1X'], 'PoE+.']],
        'c1-nethw'),
      P('Modems, ONT, NIC and MAC addresses', 'Compare cable modems, DSL modems and ONTs, and explain NICs and physical MAC addresses.',
        `<ul><li><b>Cable modem</b> — connects to the cable company\'s coaxial line (DOCSIS).</li>
<li><b>DSL</b> modem — uses the telephone copper line; speed drops with distance from the provider\'s equipment.</li>
<li><b>ONT</b> (optical network terminal) — where the ISP\'s fiber ends at the customer; converts light to Ethernet.</li>
<li><b>NIC</b> (network interface card) — the wired or wireless adapter in each device; built into the motherboard or added as a card/USB adapter.</li>
<li><b>Physical MAC address</b> — a 48-bit hardware address burned into each NIC, written as 12 hex digits (e.g. 3C-52-82-1A-77-04). The first 24 bits (OUI) identify the manufacturer. Find it with <code>ipconfig /all</code>, <code>getmac</code>, or <code>arp -a</code> for other local devices.</li></ul>
<p>The modem/ONT connects to the provider; your router plugs into it and runs the LAN.</p>` + pro('Many phones and laptops now use a random (private) MAC address per Wi-Fi network. If a DHCP reservation or MAC filter "stops working" for a phone, turn private address off for that network.') + trap('A MAC address is Layer 2 and stays inside the local network; an IP address is Layer 3 and is routed.'),
        [['Which device terminates a fiber connection at the customer premises?', 'ONT', ['Cable modem', 'DSL modem', 'Patch panel'], 'Optical network terminal.'],
         ['How long is a MAC address?', '48 bits', ['32 bits', '64 bits', '128 bits'], '12 hex digits.']],
        'c1-mac')
    ],
    wrap: { recap: ['Router between networks (IP); switch inside a network (MAC); managed vs unmanaged.', 'Access point = wireless onto the wired LAN; patch panel = cable termination in the rack.', 'Firewall filters by rules.', 'PoE: switch or injector; af 15.4 W, at 30 W, bt 60–100 W.', 'ISP devices: cable modem (coax), DSL (phone line), ONT (fiber).', 'NIC has a 48-bit physical MAC address; find with ipconfig /all, getmac, arp -a.'], lab: 'c1-wan-hw' }
  });

  // ===================== 2.6 SOHO network IP configuration =====================
  T('c1-ipcfg', 'New PC has no Internet', 'APIPA, DHCP and static addressing',
    'Ticket: a new PC in a small office cannot reach anything. The SOHO router (192.168.1.1) is the DHCP server. Command Prompt (elevated).',
    { shell: 'cmd', prompt: 'C:\\Windows\\system32>' },
    [{ t: 'Show the PC\'s IP configuration.', accept: [/^ipconfig$/i, /^ipconfig \/all$/i], show: 'ipconfig', hint: 'ipconfig', out: 'Ethernet adapter Ethernet:\n   Link-local IPv6 Address . . . . . : fe80::9c1:4d2e:7a10:3b5%7\n   Autoconfiguration IPv4 Address. . : 169.254.38.112\n   Subnet Mask . . . . . . . . . . . : 255.255.0.0\n   Default Gateway . . . . . . . . . :', ask: { q: 'A 169.254.x.x address is called what?', accept: ['apipa', 'automatic private ip addressing', 'link-local'], why: 'APIPA: Windows could not reach a DHCP server, so it gave itself a link-local address with no gateway. Check the cable/port and the DHCP server.' }, why: 'APIPA = DHCP failed.' },
     { t: 'The patch cable was in the wrong switch port and is now fixed. Ask DHCP for a new address.', accept: [/^ipconfig \/renew$/i], show: 'ipconfig /renew', hint: 'ipconfig /renew', out: 'Ethernet adapter Ethernet:\n   IPv4 Address. . . . . . . . . . . : 192.168.1.23\n   Subnet Mask . . . . . . . . . . . : 255.255.255.0\n   Default Gateway . . . . . . . . . : 192.168.1.1', ask: { q: 'Is 192.168.1.23 a private or public address?', accept: ['private'], why: '192.168.0.0/16 is private (RFC 1918), as are 10.0.0.0/8 and 172.16.0.0/12. The router translates (NAT) to its one public address.' }, why: 'Dynamic address from DHCP.' },
     { t: 'Show the full details, including the DHCP server and lease.', accept: [/^ipconfig \/all$/i], show: 'ipconfig /all', hint: 'ipconfig /all', out: '   DHCP Enabled. . . . . . . . . . . : Yes\n   IPv6 Address. . . . . . . . . . . : 2001:db8:a1:5::23\n   DHCP Server . . . . . . . . . . . : 192.168.1.1\n   Lease Obtained. . . . . . . . . . : Tuesday, November 17, 2026 4:31 PM\n   Lease Expires . . . . . . . . . . : Wednesday, November 18, 2026 4:31 PM\n   DNS Servers . . . . . . . . . . . : 192.168.1.1', ask: { q: 'How many hours is the lease? (number)', accept: ['24'], why: 'A 24-hour lease. The PC also has a global IPv6 address (2001:db8:…) and a link-local fe80:: address.' }, why: 'Read the lease and the server.' },
     { t: 'Test the default gateway.', accept: [/^ping 192\.168\.1\.1( -n \d+)?$/i], show: 'ping 192.168.1.1', hint: 'ping <gateway>', out: 'Reply from 192.168.1.1: bytes=32 time<1ms TTL=64', why: 'Local network works; Internet access follows.' },
     { t: 'The office NAS must never change address. Give the NAS\'s adapter "Ethernet" a static address 192.168.1.10, mask 255.255.255.0, gateway 192.168.1.1 (you are now on the NAS).', accept: [/^netsh interface (ipv4|ip) set address (name=)?"?ethernet"? (source=)?static 192\.168\.1\.10 255\.255\.255\.0 192\.168\.1\.1$/i], show: 'netsh interface ipv4 set address name="Ethernet" static 192.168.1.10 255.255.255.0 192.168.1.1', hint: 'netsh interface ipv4 set address name="Ethernet" static <ip> <mask> <gateway>', out: '', why: 'Static address outside the DHCP pool (or excluded) so it never conflicts.' }],
    'Read ipconfig: 169.254 = APIPA (no DHCP); private vs public; mask; gateway; lease. Static for servers/printers outside the DHCP pool.',
    ['ipconfig, ipconfig /renew, ipconfig /all, netsh interface ipv4 set address.']);
  M('c1-ippick', 'Read the address', 'IPv4, IPv6, APIPA, static, dynamic',
    'Pick what the address or setting is.', ['Private IPv4', 'Public IPv4', 'APIPA', 'IPv6 link-local', 'IPv6 global', 'Loopback', 'Subnet mask', 'Default gateway'],
    [['10.20.4.15', 'Private IPv4', '10.0.0.0/8.'], ['172.20.1.5', 'Private IPv4', '172.16.0.0–172.31.255.255.'], ['8.8.8.8', 'Public IPv4', 'Routable on the Internet.'], ['169.254.77.2', 'APIPA', 'No DHCP response.'], ['fe80::1c2b:3a4d', 'IPv6 link-local', 'Always present on IPv6 interfaces.'], ['2001:db8:12::40', 'IPv6 global', 'Global unicast (2000::/3).'], ['127.0.0.1', 'Loopback', 'This computer.'], ['255.255.255.0', 'Subnet mask', 'Network vs host portion.'], ['192.168.1.1 in a PC\'s settings: where traffic for other networks goes', 'Default gateway', 'The router.']],
    'Private ranges: 10/8, 172.16/12, 192.168/16. APIPA 169.254/16. IPv6 link-local fe80::/10.');

  O('c1-soho-wrap', 'Set up a SOHO router', 'Combined 2.6',
    'Put the SOHO addressing setup in order.',
    [['Change the router admin password from the default', 'First, before anything else.'],
     ['Set the router LAN address and subnet mask (192.168.1.1, 255.255.255.0)', 'This becomes every client\'s default gateway.'],
     ['Enable the DHCP server with a pool (192.168.1.100–192.168.1.200) and DNS servers', 'Dynamic addresses for clients.'],
     ['Keep 192.168.1.2–192.168.1.99 outside the pool for static devices and reservations', 'No conflicts.'],
     ['Give the NAS and printer static addresses or DHCP reservations in that block', 'Addresses that never change.'],
     ['Confirm IPv6 is enabled from the ISP and clients get global and fe80:: addresses', 'Dual stack.'],
     ['Test a client: ipconfig shows a private address, mask and gateway; ping the gateway and a website', 'Verify.']],
    'Gateway, pool, static block, reservations, IPv6, test — the SOHO addressing checklist.');

  RK.add({ track: TR, id: '2.6', dom: 2, short: 'SOHO IP configuration', title: 'Given a scenario, configure basic wired/wireless small office/home office (SOHO) networks',
    goal: 'Configure and read IPv4 and IPv6 addressing: private/public, APIPA, static vs dynamic, subnet mask and gateway.',
    kw: /\b(ipv4|ipv6|apipa|169\.254|private (ip|address)|public (ip|address)|static (ip|address)|dynamic|subnet mask|default gateway|soho|192\.168|10\.0\.0|172\.16|nat\b|link.local)/,
    parts: [
      P('IPv4: private, public, mask and gateway', 'Read and assign IPv4 addresses, subnet masks and default gateways, including private and public ranges.',
        `<p>An <b>IPv4</b> address is 32 bits written as four numbers (192.168.1.23). The <b>subnet mask</b> (255.255.255.0 or /24) says which part is the network and which part is the host. Devices in the same subnet talk directly; anything else goes to the <b>gateway</b> (the router).</p>
<table><tr><th>Type</th><th>Range</th><th>Use</th></tr>
<tr><td><b>Private</b></td><td>10.0.0.0/8 · 172.16.0.0–172.31.255.255 · 192.168.0.0/16</td><td>Inside LANs; not routed on the Internet. The SOHO router uses <b>NAT</b> to share one public address.</td></tr>
<tr><td><b>Public</b></td><td>Everything else (assigned by ISPs)</td><td>Routable on the Internet.</td></tr>
<tr><td><b>APIPA</b></td><td>169.254.0.0/16</td><td>Self-assigned when DHCP fails; no gateway → no Internet.</td></tr>
<tr><td>Loopback</td><td>127.0.0.1</td><td>Tests the local TCP/IP stack.</td></tr></table>` + pro('A 169.254 address is a symptom, not the problem. Check the cable, switch port, VLAN, Wi-Fi association and whether the DHCP server is up before touching the PC\'s settings.') + trap('172.32.x.x is public — the private 172 range stops at 172.31.255.255.'),
        [['A PC shows 169.254.10.4. What happened?', 'It could not reach a DHCP server (APIPA)', ['It has a public address', 'It is using IPv6', 'Its gateway is correct'], 'APIPA.'],
         ['Which address is private?', '172.18.5.9', ['172.40.5.9', '8.8.4.4', '203.0.113.9'], '172.16–172.31.']],
        'c1-ippick'),
      P('Static vs dynamic, and IPv6', 'Choose static or dynamic addressing for each device and recognize IPv6 addresses.',
        `<ul><li><b>Dynamic</b> (DHCP) — the default for PCs, phones and laptops; easy to manage, no duplicates.</li>
<li><b>Static</b> — typed in by hand (address, mask, gateway, DNS). Use for routers, servers, NAS, some printers — or give them DHCP reservations instead. Keep static addresses outside the DHCP pool.</li>
<li><b>IPv6</b> — 128 bits in hex, e.g. 2001:db8:a1:5::23 (:: replaces a run of zeros). Every IPv6 interface has a <b>link-local</b> address (fe80::) and usually a <b>global</b> address. No NAT and no broadcast; devices can configure themselves (SLAAC) or use DHCPv6.</li></ul>
<p>SOHO setup on the router: set LAN address and mask, enable the DHCP server with a pool, set DNS, keep a block outside the pool for static devices.</p>` + pro('Keep a small spreadsheet of every static and reserved address in a small office. Duplicate IP conflicts are the classic SOHO ticket.') + trap('fe80:: is link-local IPv6 — like APIPA it only works on the local link, but unlike APIPA its presence is normal.'),
        [['Which device should normally get a static IP or a DHCP reservation?', 'A network printer or NAS', ['A guest\'s phone', 'A visitor laptop', 'Every user PC'], 'Must not change.'],
         ['Which prefix is an IPv6 link-local address?', 'fe80::', ['2001:db8::', '169.254', '127.0.0.1'], 'Link-local.']],
        'c1-ipcfg')
    ],
    wrap: { recap: ['IPv4 = 32 bits; subnet mask separates network and host; gateway = router for other networks.', 'Private: 10/8, 172.16–172.31, 192.168/16 (NAT to one public IP). Public = Internet-routable.', 'APIPA 169.254.x.x = no DHCP; no gateway, no Internet.', 'Dynamic (DHCP) for clients; static or reservations for servers, NAS, printers, outside the pool.', 'IPv6 = 128-bit hex; fe80:: link-local + global; :: shortens zeros.', 'Tools: ipconfig, ipconfig /all, /renew, netsh interface ipv4 set address.'], lab: 'c1-soho-wrap' }
  });

  // ===================== 2.7 Internet connection & network types =====================
  M('c1-inet', 'Which Internet connection?', 'Satellite, fiber, cable, DSL, cellular, WISP',
    'Pick the connection type.', ['Satellite', 'Fiber', 'Cable', 'DSL', 'Cellular', 'Wireless Internet service provider (WISP)'],
    [['Remote ranch with no wired service; latency affected by weather (low-orbit service improves latency)', 'Satellite', 'Space link.'], ['Symmetric gigabit and lowest latency in town', 'Fiber', 'Light over glass.'], ['Shares coax with TV service; neighborhood bandwidth is shared', 'Cable', 'DOCSIS.'], ['Uses the phone line; speed falls with distance from the exchange', 'DSL', 'Copper.'], ['5G home Internet or a phone hotspot', 'Cellular', 'Mobile network.'], ['Local provider beams service from a tower to a dish on the roof', 'Wireless Internet service provider (WISP)', 'Fixed wireless.']],
    'Compare by speed, latency, availability and cost.');
  M('c1-nettype', 'Which network type?', 'LAN, WAN, PAN, MAN, SAN, WLAN',
    'Pick the network type.', ['LAN', 'WAN', 'PAN', 'MAN', 'SAN', 'WLAN'],
    [['All PCs and printers in one office building', 'LAN', 'Local area network.'], ['Head office and three branches across the country', 'WAN', 'Wide area network.'], ['Phone, smartwatch and earbuds', 'PAN', 'Personal area network.'], ['City-wide network linking libraries and schools', 'MAN', 'Metropolitan area network.'], ['Dedicated high-speed network giving servers block-level disk storage', 'SAN', 'Storage area network.'], ['The office Wi-Fi', 'WLAN', 'Wireless LAN.']],
    'Size order: PAN < LAN/WLAN < MAN < WAN. SAN is about storage, not size.');
  M('c1-conn-wrap', 'Connectivity advisor', 'Combined 2.7',
    'Pick the best fit.', ['Fiber', 'Cable', 'DSL', 'Cellular', 'Satellite', 'WISP', 'SAN', 'WAN'],
    [['Video studio uploading huge files needs fast upload', 'Fiber', 'Symmetric speeds.'], ['Home in a suburb, TV provider offers Internet bundle', 'Cable', 'Coax.'], ['Rural farmhouse with only a phone line', 'DSL', 'Copper.'], ['Construction trailer for 6 months', 'Cellular', '5G/4G router.'], ['Cabin with no towers or wires in sight', 'Satellite', 'Anywhere with sky view.'], ['Small town with a local tower-based provider', 'WISP', 'Fixed wireless.'], ['Virtualization hosts need shared fast block storage', 'SAN', 'Storage network.'], ['Link branch offices to the data center', 'WAN', 'Wide area.']],
    'Match need (upload, latency, location, duration) to connection type.');

  RK.add({ track: TR, id: '2.7', dom: 2, short: 'Internet & network types', title: 'Compare and contrast Internet connection types, network types, and their characteristics',
    goal: 'Compare satellite, fiber, cable, DSL, cellular and WISP connections, and LAN, WAN, PAN, MAN, SAN and WLAN networks.',
    kw: /\b(satellite|fiber|cable (internet|broadband)|dsl|cellular|wisp|fixed wireless|lan\b|wan\b|pan\b|man\b|san\b|wlan|metropolitan|storage area|personal area|wide area|local area|connection type)/,
    parts: [
      P('Internet connection types', 'Compare satellite, fiber, cable, DSL, cellular and WISP Internet connections.',
        `<table><tr><th>Type</th><th>Medium</th><th>Characteristics</th></tr>
<tr><td><b>Fiber</b></td><td>Light in glass to an ONT</td><td>Fastest, often symmetric (same up/down), lowest latency; limited availability.</td></tr>
<tr><td><b>Cable</b></td><td>Coax (DOCSIS)</td><td>Fast download, slower upload; bandwidth shared with the neighborhood.</td></tr>
<tr><td><b>DSL</b></td><td>Telephone line</td><td>Slower; speed drops with distance from the provider.</td></tr>
<tr><td><b>Cellular</b></td><td>4G/5G radio</td><td>Mobile, quick to deploy; data caps; varies with signal.</td></tr>
<tr><td><b>Satellite</b></td><td>Dish to satellite</td><td>Available almost anywhere; geostationary = high latency (600 ms+); low Earth orbit is much better; weather can affect it.</td></tr>
<tr><td><b>WISP</b></td><td>Fixed wireless from a local tower</td><td>Rural option; needs line of sight to the tower.</td></tr></table>` + pro('For VoIP and video calls, latency and upload speed matter more than the advertised download number. Ask for both before recommending a connection.') + trap('Traditional satellite has the highest latency of any option — bad for real-time gaming and VoIP, even when bandwidth is fine.'),
        [['Which connection type usually has the highest latency?', 'Geostationary satellite', ['Fiber', 'Cable', 'DSL'], 'Distance to orbit.'],
         ['Which uses the telephone line?', 'DSL', ['Cable', 'Fiber', 'WISP'], 'Copper phone pair.']],
        'c1-inet'),
      P('Network types', 'Compare LAN, WAN, PAN, MAN, SAN and WLAN.',
        `<ul><li><b>PAN</b> (personal area network) — devices around one person, usually Bluetooth: phone, watch, earbuds.</li>
<li><b>LAN</b> (local area network) — one building or campus, high speed, owned by the organization.</li>
<li><b>WLAN</b> (wireless LAN) — the Wi-Fi part of a LAN.</li>
<li><b>MAN</b> (metropolitan area network) — spans a city: a city government or university linking sites across town.</li>
<li><b>WAN</b> (wide area network) — connects distant sites (branches, data centers); the Internet is the largest WAN. Usually leased from carriers.</li>
<li><b>SAN</b> (storage area network) — a dedicated, high-speed network that gives servers block-level access to shared storage (Fibre Channel or iSCSI).</li></ul>` + pro('"WAN is slow" tickets at a branch usually mean the WAN link is saturated (backups or updates in business hours), not a LAN fault — check the link\'s utilization first.') + trap('SAN (storage area network) is not about size; NAS is a single file-sharing device on the LAN, a SAN is a separate block-storage network.'),
        [['Which network type connects a phone to a smartwatch?', 'PAN', ['MAN', 'WAN', 'SAN'], 'Personal area.'],
         ['Which network gives servers block-level access to shared storage?', 'SAN', ['WLAN', 'PAN', 'MAN'], 'Storage area network.']],
        'c1-nettype')
    ],
    wrap: { recap: ['Fiber: fastest, symmetric, low latency. Cable: coax, shared, fast down.', 'DSL: phone line, distance-limited. Cellular: 4G/5G, data caps.', 'Satellite: anywhere, high latency (LEO better). WISP: fixed wireless from a tower.', 'PAN (person) < LAN/WLAN (building) < MAN (city) < WAN (distant sites).', 'SAN: dedicated block-storage network for servers.', 'Choose by speed, upload, latency, availability, cost.'], lab: 'c1-conn-wrap' }
  });

  // ===================== 2.8 Networking tools =====================
  M('c1-tools', 'Which tool?', 'Crimper, stripper, Wi-Fi analyzer, toner probe, punchdown, cable tester, loopback, tap',
    'Pick the tool.', ['Crimper', 'Cable stripper', 'Wi-Fi analyzer', 'Toner probe', 'Punchdown tool', 'Cable tester', 'Loopback plug', 'Network tap'],
    [['Attach an RJ45 connector to the end of a cable', 'Crimper', 'Crimps the pins.'], ['Remove the outer jacket without nicking the wires', 'Cable stripper', 'Strip first.'], ['Find the least-crowded channel and map signal strength', 'Wi-Fi analyzer', 'Wireless survey.'], ['Find which unlabeled wall cable lands on which patch panel port', 'Toner probe', 'Tone and trace.'], ['Terminate wires into a patch panel or keystone jack', 'Punchdown tool', '110 block.'], ['Check a new cable for opens, shorts and miswires', 'Cable tester', 'Continuity and pinout.'], ['Test whether a NIC or switch port can send and receive', 'Loopback plug', 'Loops transmit to receive.'], ['Copy all traffic on a link to a monitoring device', 'Network tap', 'Passive monitoring.']],
    'Make (stripper, crimper, punchdown) → find (toner probe) → test (cable tester, loopback) → see (Wi-Fi analyzer, tap).');
  O('c1-t568b', 'Build a T568B patch cable', 'Wire order on the connector',
    'Hold the RJ45 connector clip down, contacts facing you. Put the wire colors in order from pin 1 to pin 8 for T568B.',
    [['Pin 1: white/orange', 'T568B starts with the orange pair.'], ['Pin 2: orange', ''], ['Pin 3: white/green', ''], ['Pin 4: blue', ''], ['Pin 5: white/blue', ''], ['Pin 6: green', 'Green pair splits across 3 and 6.'], ['Pin 7: white/brown', ''], ['Pin 8: brown', 'Then crimp and test with a cable tester.']],
    'T568A swaps the orange and green pairs. Same standard on both ends = straight-through; A on one end, B on the other = crossover.');
  O('c1-cable-order', 'Run a new drop to a desk', 'Combined 2.8',
    'Put the steps in order.',
    [['Use a toner probe to identify the unlabeled cable at the patch panel', 'Find it first.'], ['Strip the jacket with a cable stripper', 'Do not nick the pairs.'], ['Punch the wires down on the patch panel with a punchdown tool (T568B)', 'Panel end.'], ['Crimp an RJ45 connector on the desk patch cable with a crimper', 'Desk end.'], ['Test the run with a cable tester', 'Verify pinout and continuity.'], ['Plug in and confirm link; test the switch port with a loopback plug if no link', 'Isolate port vs cable.']],
    'Find → strip → terminate → test. Every new cable gets tested before it is called done.');

  RK.add({ track: TR, id: '2.8', dom: 2, short: 'Networking tools', title: 'Explain networking tools and their purposes',
    goal: 'Choose the right tool: crimper, cable stripper, Wi-Fi analyzer, toner probe, punchdown tool, cable tester, loopback plug, network tap.',
    kw: /\b(crimp|stripper|wi.?fi analyzer|toner|tone generator|probe|punch.?down|cable tester|loopback plug|network tap|t568[ab])/,
    parts: [
      P('Cable-making and cable-finding tools', 'Use a cable stripper, crimper, punchdown tool and toner probe, and wire T568A/B.',
        `<ul><li><b>Cable stripper</b> — removes the outer jacket (and insulation) cleanly.</li>
<li><b>Crimper</b> — presses an RJ45 (or RJ11) connector onto the wires.</li>
<li><b>Punchdown tool</b> — seats and trims wires into a patch panel, keystone jack or 110/66 block.</li>
<li><b>Toner probe</b> — a tone generator clips onto one end; the probe beeps near the matching cable at the other end. Finds unlabeled cables.</li></ul>
<p>Wiring standards: <b>T568B</b> pin order is white/orange, orange, white/green, blue, white/blue, green, white/brown, brown. <b>T568A</b> swaps the orange and green pairs. Use the same standard on both ends for a normal (straight-through) cable.</p>` + pro('Label both ends of every cable you install, and update the patch-panel map. Future-you with a toner probe will be grateful.') + trap('A crimper is for connectors on cable ends; a punchdown tool is for terminating wires into panels and jacks.'),
        [['Which tool finds the far end of an unlabeled cable?', 'Toner probe', ['Crimper', 'Loopback plug', 'Punchdown tool'], 'Tone and trace.'],
         ['What is pin 1 in T568B?', 'White/orange', ['White/green', 'Blue', 'Brown'], 'Orange pair first.']],
        'c1-t568b'),
      P('Testing and monitoring tools', 'Use a cable tester, loopback plug, Wi-Fi analyzer and network tap.',
        `<ul><li><b>Cable tester</b> — checks continuity, opens, shorts and miswires (wrong pin order). Advanced testers certify length and speed.</li>
<li><b>Loopback plug</b> — connects a port\'s transmit pins to its receive pins so you can test a NIC or switch port by itself.</li>
<li><b>Wi-Fi analyzer</b> — software or hardware that shows nearby networks, channels, signal strength and interference; used for channel selection and site surveys.</li>
<li><b>Network tap</b> — sits inline on a link and copies all traffic to a monitoring or security tool without changing it.</li></ul>
<p>Troubleshooting order for "no link": swap the patch cable → test the run with a cable tester → test the port with a loopback plug → check the NIC.</p>` + pro('A phone Wi-Fi analyzer app and a walk around the office solve most "Wi-Fi is bad in that corner" tickets: you see the signal drop and the crowded channels.') + trap('A cable tester tests the cable; a loopback plug tests the port. Pick the tool that matches the part in doubt.'),
        [['Which tool tests whether a switch port itself can send and receive?', 'Loopback plug', ['Cable stripper', 'Toner probe', 'Crimper'], 'Loops TX to RX.'],
         ['Which tool shows channel use and signal strength of nearby wireless networks?', 'Wi-Fi analyzer', ['Network tap', 'Punchdown tool', 'Cable tester'], 'Wireless survey.']],
        'c1-tools')
    ],
    wrap: { recap: ['Cable stripper removes jacket; crimper attaches RJ45; punchdown tool terminates into panels/jacks.', 'T568B: w/o, o, w/g, bl, w/bl, g, w/br, br; T568A swaps orange and green.', 'Toner probe finds unlabeled cables.', 'Cable tester: continuity, shorts, miswires. Loopback plug: tests a port/NIC.', 'Wi-Fi analyzer: channels and signal. Network tap: copies traffic for monitoring.', 'Always test a new cable before calling it done.'], lab: 'c1-cable-order' }
  });

  // ===================== Domain 2 combined lab =====================
  T('c1-d2-wrap', 'Domain 2 shift: the new branch office', 'Networking in one ticket',
    'Ticket: first day at a new small branch. "Nothing works right." Command Prompt on a staff PC. Each task names its objective; no command hints.',
    { shell: 'cmd', prompt: 'C:\\Users\\tech>' },
    [{ t: '<b>2.6</b> — Check the PC\'s address configuration.', accept: [/^ipconfig( \/all)?$/i], show: 'ipconfig', hint: '2.6 — ipconfig', out: '   IPv4 Address. . . . . . . . . . . : 192.168.20.31\n   Subnet Mask . . . . . . . . . . . : 255.255.255.0\n   Default Gateway . . . . . . . . . : 192.168.20.1', why: 'DHCP worked: private address, mask, gateway.' },
     { t: '<b>2.5</b> — Find the gateway router\'s MAC address in the ARP cache.', accept: [/^arp -a( 192\.168\.20\.1)?$/i], show: 'arp -a 192.168.20.1', hint: '2.5 — arp', out: '  192.168.20.1          b4-fb-e4-11-22-33     dynamic', why: 'Layer 2 to the router is fine.' },
     { t: '<b>2.4</b> — Confirm DNS resolves the company intranet (intranet.brightpath.example).', accept: [/^nslookup intranet\.brightpath\.example$/i], show: 'nslookup intranet.brightpath.example', hint: '2.4 — nslookup', out: 'Server:  UnKnown\nAddress:  192.168.20.1\n\n*** UnKnown can\'t find intranet.brightpath.example: Non-existent domain', ask: { q: 'Which device is answering DNS?', accept: ['192.168.20.1', 'the router', 'router'], why: 'The branch router is the DNS server and does not know internal names. Point DHCP\'s DNS option at the company DNS server (via the site-to-site VPN).' }, why: '2.3/2.4 — DNS server role and DHCP options.' },
     { t: '<b>2.2</b> — Wi-Fi users complain too. Check this laptop\'s wireless band and channel.', accept: [/^netsh wlan show interfaces?$/i], show: 'netsh wlan show interfaces', hint: '2.2 — netsh wlan', out: '    Radio type : 802.11n\n    Band       : 2.4 GHz\n    Channel    : 3\n    Signal     : 70%', ask: { q: 'Channel 3 overlaps the clean 2.4 GHz channels. Which of 1, 6 or 11 is closest to move it to? (number)', accept: ['1'], why: 'Use 1, 6 or 11 — and enable 5 GHz on the AP.' }, why: 'Channel selection.' },
     { t: '<b>2.1</b> — Check whether this PC has an open RDP listener exposed (it should not).', accept: [/^netstat -an(o)? \| findstr (:)?3389$/i, /^netstat -an(o)? \| find "?:?3389"?$/i], show: 'netstat -ano | findstr :3389', hint: '2.1 — netstat filtered for the RDP port', out: '  TCP    0.0.0.0:3389    0.0.0.0:0    LISTENING    1180', why: 'RDP is listening on every interface — disable it on staff PCs or restrict it to the VPN subnet. Ticket documented.' }],
    'Domain 2 in one ticket: addressing (2.6), hardware/MAC (2.5), DNS/DHCP (2.3–2.4), wireless (2.2), ports (2.1).',
    ['Each task names its objective.']);

  // ---------- extras + cards ----------
  RK.extra(TR, '2.1', [
    ['Which protocol and port should replace Telnet?', 'SSH on TCP 22', ['FTP on 21', 'SMTP on 25', 'HTTP on 80'], 'Encrypted.'],
    ['Which port does LDAP use?', '389', ['3389', '445', '143'], 'Directory.'],
    ['Which ports belong to legacy NetBIOS/NetBT?', '137–139', ['20–21', '67–68', '110'], 'Name, datagram, session.'],
    ['Which port does HTTPS use?', '443', ['80', '8080', '22'], 'TLS web.'],
    ['Which is the best transport for live voice where late packets are useless?', 'UDP', ['TCP', 'SMB', 'LDAP'], 'Low overhead.'],
    ['Which port must be open to send email between mail servers?', '25', ['110', '143', '389'], 'SMTP.']
  ]);
  RK.extra(TR, '2.2', [
    ['What does a Wi-Fi analyzer help with most?', 'Choosing a clear channel', ['Crimping cables', 'Assigning MAC addresses', 'Setting DNS records'], 'Channel selection.'],
    ['Which standard first supported both 2.4 and 5 GHz?', '802.11n', ['802.11b', '802.11g', '802.11ac'], 'Wi-Fi 4.'],
    ['Why should the AP country code be set correctly?', 'Regulations decide which channels and power levels are legal', ['It changes the SSID', 'It enables NFC', 'It sets the DHCP lease'], 'Regulations.'],
    ['What is a downside of wide 160 MHz channels in a busy office?', 'Fewer non-overlapping channels and more interference', ['Lower security', 'No IPv6', 'No Bluetooth'], 'Width trade-off.'],
    ['Which technology is used for inventory tags read at a distance by a scanner?', 'RFID', ['NFC payment', 'Bluetooth LE audio', '802.11be'], 'Radio-frequency ID.'],
    ['Which Wi-Fi generation can use the 6 GHz band?', 'Wi-Fi 6E and Wi-Fi 7', ['Wi-Fi 4 only', '802.11g', '802.11b'], '6 GHz.']
  ]);
  RK.extra(TR, '2.3', [
    ['Which UDP port does NTP use?', '123', ['514', '53', '161'], 'Time.'],
    ['Which service would centralize logs from all firewalls?', 'Syslog server', ['Print server', 'DHCP server', 'Web server'], 'Central logs.'],
    ['Which device acts on behalf of clients to fetch and filter web content?', 'Proxy server', ['Load balancer', 'Patch panel', 'ONT'], 'Proxy.'],
    ['Which best describes a UTM appliance?', 'One device combining firewall, IPS, antivirus and content filtering', ['A database server', 'A storage network', 'A type of DNS record'], 'All-in-one.'],
    ['What does a database server provide?', 'Structured data storage for applications', ['Name resolution', 'Time sync', 'IP leases'], 'SQL.'],
    ['Why put IoT devices on their own VLAN?', 'They are often insecure, so isolation limits damage', ['They need faster Wi-Fi', 'They use IPv6 only', 'They cannot use DHCP'], 'Segmentation.']
  ]);
  RK.extra(TR, '2.4', [
    ['Which record type points www to another host name?', 'CNAME', ['A', 'MX', 'AAAA'], 'Alias.'],
    ['When does a DHCP client first try to renew its lease?', 'At 50% of the lease time', ['At 10%', 'Only when it expires', 'Every reboot only'], 'T1 renewal.'],
    ['Which DHCP setting keeps addresses for static devices out of the pool?', 'Exclusion', ['Reservation', 'Lease', 'MX'], 'Never handed out.'],
    ['What does DKIM publish in DNS?', 'A public key to verify message signatures', ['A list of allowed IPs', 'The mail server address', 'A quarantine policy'], 'Signature verification.'],
    ['Which VPN type connects two office networks permanently?', 'Site-to-site', ['Remote access', 'Split DNS', 'Captive portal'], 'Office to office.'],
    ['Traffic between two VLANs must pass through what?', 'A router or Layer 3 device/firewall', ['A patch panel', 'A hub', 'An ONT'], 'Inter-VLAN routing.']
  ]);
  RK.extra(TR, '2.5', [
    ['Which switch type supports VLANs and port security?', 'Managed', ['Unmanaged', 'Hub', 'Patch panel'], 'Configurable.'],
    ['Which device adds power to one Ethernet cable from a non-PoE switch?', 'PoE injector', ['Patch panel', 'ONT', 'DSL modem'], 'Single-port power.'],
    ['Which PoE standard provides the most power?', '802.3bt', ['802.3af', '802.3at', '802.11ac'], 'PoE++.'],
    ['What does the first half of a MAC address identify?', 'The manufacturer (OUI)', ['The subnet', 'The VLAN', 'The DNS server'], 'Organizationally unique identifier.'],
    ['Which device connects wireless clients to the wired LAN?', 'Access point', ['Router only', 'Patch panel', 'Cable modem'], 'Wireless bridge.'],
    ['Which ISP device connects to a coaxial cable line?', 'Cable modem', ['ONT', 'DSL modem', 'Loopback plug'], 'DOCSIS.']
  ]);
  RK.extra(TR, '2.6', [
    ['What is the default gateway?', 'The router address used to reach other networks', ['The DNS server', 'The DHCP lease time', 'The MAC address'], 'Way out.'],
    ['Which address tests the local TCP/IP stack?', '127.0.0.1', ['169.254.1.1', '192.168.1.1', '8.8.8.8'], 'Loopback.'],
    ['What does NAT on a SOHO router do?', 'Lets many private addresses share one public address', ['Assigns MAC addresses', 'Encrypts Wi-Fi', 'Resolves names'], 'Address translation.'],
    ['How many bits is an IPv6 address?', '128', ['32', '48', '64'], 'IPv6.'],
    ['Which command requests a new DHCP address on Windows?', 'ipconfig /renew', ['ipconfig /flushdns', 'arp -a', 'getmac'], 'Renew.'],
    ['A subnet mask of 255.255.255.0 is written in CIDR as:', '/24', ['/8', '/16', '/32'], '24 network bits.']
  ]);
  RK.extra(TR, '2.7', [
    ['Which connection is often symmetric (same upload and download)?', 'Fiber', ['Cable', 'DSL', 'Geostationary satellite'], 'Fiber.'],
    ['Which connection shares bandwidth with neighbors on the same node?', 'Cable', ['Fiber point-to-point', 'DSL', 'Satellite'], 'Shared coax.'],
    ['Which network type is the Internet an example of?', 'WAN', ['LAN', 'PAN', 'SAN'], 'Largest WAN.'],
    ['A city links its libraries with its own fiber ring. Network type?', 'MAN', ['PAN', 'SAN', 'WLAN'], 'Metropolitan.'],
    ['What does a WISP need between the customer and the tower?', 'Line of sight', ['A phone line', 'Coax', 'A SIM card'], 'Fixed wireless.'],
    ['Which is the best quick Internet for a 3-month job site trailer?', 'Cellular', ['New fiber install', 'DSL', 'SAN'], 'Fast to deploy.']
  ]);
  RK.extra(TR, '2.8', [
    ['Which tool removes the outer jacket of a cable?', 'Cable stripper', ['Crimper', 'Toner probe', 'Network tap'], 'Strip.'],
    ['Which tool terminates wires into a keystone jack?', 'Punchdown tool', ['Crimper', 'Loopback plug', 'Wi-Fi analyzer'], 'Punch down.'],
    ['A cable tester reports pins 1 and 2 swapped. What is the problem?', 'Miswired connector', ['Bad switch port', 'Wrong DNS', 'Weak Wi-Fi'], 'Re-terminate.'],
    ['Which device copies all traffic on a link to a monitoring tool?', 'Network tap', ['Toner probe', 'Crimper', 'PoE injector'], 'Passive copy.'],
    ['What does T568A swap compared to T568B?', 'The orange and green pairs', ['The blue and brown pairs', 'Nothing', 'Pins 4 and 5 only'], 'Pairs 2 and 3.'],
    ['Which tool would you use to survey Wi-Fi signal strength across an office?', 'Wi-Fi analyzer', ['Cable tester', 'Punchdown tool', 'Crimper'], 'Wireless survey.'],
    ['A new wall jack shows no link. The patch cable tests good. What do you test next?', 'The in-wall run with a cable tester', ['The DNS server', 'The DHCP lease', 'The Wi-Fi channel'], 'Isolate the run.'],
    ['Which tool attaches an RJ11 connector to phone cable?', 'Crimper', ['Punchdown tool', 'Toner probe', 'Network tap'], 'Same tool, different die.'],
    ['Which tool would a security team use to feed an IDS a copy of all traffic on a link?', 'Network tap', ['Loopback plug', 'Cable stripper', 'Toner probe'], 'Passive copy.']
  ]);
  RK.cards(TR, '2.1', [['445', 'SMB/CIFS file sharing.'], ['3389', 'RDP.'], ['110 vs 143', 'POP3 download vs IMAP keep on server.'], ['67/68', 'DHCP (UDP).'], ['TCP vs UDP', 'Reliable, handshake vs connectionless, fast.']]);
  RK.cards(TR, '2.2', [['Channels 1/6/11', 'Non-overlapping 2.4 GHz.'], ['802.11ax', 'Wi-Fi 6/6E, OFDMA.'], ['Channel width', 'Wider = faster but fewer channels.'], ['RFID vs NFC', 'Tags read by scanners vs cm-range tap.']]);
  RK.cards(TR, '2.3', [['AAA', 'Authentication, authorization, accounting.'], ['Syslog', 'Central log collection.'], ['UTM', 'All-in-one security appliance.'], ['SCADA', 'Industrial control; isolate.']]);
  RK.cards(TR, '2.4', [['SPF / DKIM / DMARC', 'Allowed senders / signature key / policy.'], ['MX', 'Mail exchanger.'], ['Reservation vs exclusion', 'Same address per MAC vs never handed out.'], ['VLAN', 'Logical network on shared switches.']]);
  RK.cards(TR, '2.5', [['PoE af/at/bt', '15.4 / 30 / 60–100 W.'], ['ONT', 'Fiber termination at customer.'], ['Managed switch', 'VLANs, port security, monitoring.'], ['MAC address', '48-bit physical address; OUI = vendor.']]);
  RK.cards(TR, '2.6', [['APIPA', '169.254.x.x — no DHCP.'], ['Private ranges', '10/8, 172.16/12, 192.168/16.'], ['fe80::', 'IPv6 link-local.'], ['Static vs dynamic', 'Servers/printers vs clients.']]);
  RK.cards(TR, '2.7', [['Satellite', 'Anywhere; high latency (GEO).'], ['WISP', 'Fixed wireless from a tower.'], ['SAN', 'Block-storage network.'], ['MAN', 'City-wide network.']]);
  RK.cards(TR, '2.8', [['T568B', 'w/o, o, w/g, bl, w/bl, g, w/br, br.'], ['Toner probe', 'Find unlabeled cables.'], ['Loopback plug', 'Test a port/NIC.'], ['Network tap', 'Copies link traffic.']]);
})();
