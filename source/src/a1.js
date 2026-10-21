/* A+ Core 1 — 1.0 Mobile Devices */
(function () {
  var S = COURSE.stages, Q = window.Q, T = window.TYPE, L = COURSE.labs;

  S.push({
    id: 'a1', track: 'core1', tier: 'c1-mobile', title: 'Laptops & mobile devices', code: 'A1-FOLD-AND-GO',
    goal: 'Laptop parts and how to replace them safely, display tech, and the ports and accessories that connect mobile devices.',
    lesson: [
      { h: 'What makes a laptop a laptop', html: '<p>A laptop packs a whole computer into a hinged shell: a <b>display</b>, a <b>keyboard</b>, a <b>trackpad</b> (pointing device), a <b>battery</b>, and a motherboard with CPU, RAM and storage — all in a small, power-sipping package. Because space is tight, parts are smaller and often proprietary, so you always check the manufacturer\'s service manual before opening one.</p><ul><li><b>Battery</b>: usually lithium-ion. A <b>swollen (spicy) battery</b> is a fire/rupture hazard — power the device off, stop using it, and dispose of it safely. Never puncture it.</li><li><b>Keyboard</b> and <b>trackpad</b> are common replacements; a sticky key or dead trackpad is often a whole-assembly swap.</li><li>Laptops use <b>SODIMM</b> memory (smaller than desktop DIMMs) and increasingly <b>M.2</b> storage. Some RAM and storage are <b>soldered</b> and not upgradeable.</li></ul>' },
      { h: 'The display assembly', html: '<ul><li><b>LCD</b> panels are lit by a <b>backlight</b>. Older ones used a <b>CCFL</b> tube driven by an <b>inverter</b> (which converts DC to the AC the lamp needs); modern ones use <b>LED</b> backlights (no inverter). A dim display that still shows a faint image points at the backlight or inverter.</li><li><b>OLED</b> panels light each pixel themselves — deeper blacks, no separate backlight, but risk of burn-in.</li><li>The lid also holds <b>Wi-Fi antennas</b> (wires routed around the screen), the <b>webcam</b>, microphone, and sometimes a <b>digitizer</b> for touch/pen input.</li><li>A <b>privacy filter</b> narrows the viewing angle so people beside the user can\'t read the screen.</li></ul>' },
      { h: 'Ports, connectivity and accessories', html: '<ul><li><b>USB-C / Thunderbolt</b> carries data, video (DisplayPort alt mode) and power on one reversible connector. A <b>docking station</b> turns one cable into many ports; a simpler <b>port replicator</b> just adds ports.</li><li>Wireless: <b>Wi-Fi</b> (networks), <b>Bluetooth</b> (peripherals, pair by making the device discoverable), <b>NFC</b> (tap-to-pay, very short range), and <b>cellular</b> (a mobile hotspot shares that connection over Wi-Fi).</li><li>Location uses <b>GPS</b> (needs sky view) or cell/Wi-Fi assisted location indoors.</li><li>Mobile sync: back up and move data over USB, Wi-Fi, or the cloud; corporate mail often uses a <b>mail profile</b> or MDM to configure accounts and enforce policy.</li></ul>' }
    ],
    cards: [
      ['Swollen battery', 'Fire/rupture hazard — power off, stop using, dispose safely. Never puncture.'],
      ['SODIMM', 'Small-outline memory module used in laptops (desktops use full-size DIMMs).'],
      ['M.2 / NVMe', 'Small circuit-board SSD that plugs into a slot; NVMe runs over PCIe for high speed.'],
      ['Inverter', 'Converts DC to AC to drive a CCFL backlight. A dim-but-visible LCD often means backlight/inverter.'],
      ['LED backlight', 'Modern LCD lighting; no inverter needed.'],
      ['OLED', 'Each pixel emits light — deep blacks, thin panel, burn-in risk.'],
      ['Digitizer', 'The touch/pen input layer on a display.'],
      ['Docking station', 'Adds many ports (and often power/video) through one connector.'],
      ['USB-C / Thunderbolt', 'Reversible connector carrying data, video and power.'],
      ['NFC', 'Near-field communication — tap-to-pay range (a few cm).'],
      ['Bluetooth pairing', 'Make the device discoverable, then confirm the code to pair a peripheral.'],
      ['Mobile hotspot', 'Shares a cellular data connection with other devices over Wi-Fi.'],
      ['Privacy filter', 'Narrows viewing angle so bystanders cannot read the screen.'],
      ['Field replaceable unit (FRU)', 'A part a tech can swap in the field: battery, keyboard, RAM, drive, display.']
    ],
    qs: [
      Q("A laptop's battery has begun swelling and is pushing up on the trackpad. What should a technician do first?", "Power off the device and stop using it immediately, then arrange safe disposal", ["Continue using the laptop until a replacement battery arrives", "Puncture the battery to release trapped gas", "Charge the battery fully to test its capacity"], "A swollen battery indicates a dangerous chemical breakdown and fire/rupture risk. The device should be powered off and not used until the battery is safely replaced and disposed of properly.", 1),
      Q("Which mobile device component would a technician most likely replace to fix a laptop that no longer detects any wireless networks, when the antenna itself tests fine?", "Wireless card", ["Digitizer", "Inverter", "Trackpad"], "The wireless (Wi-Fi) card is the component responsible for detecting and connecting to networks; if the antenna is confirmed good, the card itself is the next suspect.", 1),
      Q("A user wants to unlock their phone using their face instead of a PIN. Which category of component enables this?", "Physical privacy and security components (biometrics)", ["Wireless card", "Digitizer", "Docking station"], "Biometric hardware, such as a front-facing IR camera for facial recognition or a fingerprint reader, falls under physical privacy and security components.", 1),
      Q("Which connection method is most associated with contactless mobile payments at a store terminal?", "NFC", ["Bluetooth", "Lightning", "Tethering"], "Near-field communication (NFC) is a very short-range wireless technology commonly used for contactless payments and quick pairing.", 1),
      Q("A technician wants to give a laptop access to full-size HDMI, Ethernet, and USB-A ports it lacks natively. What accessory accomplishes this?", "Docking station", ["Stylus", "Webcam", "Trackpad"], "A docking station (or port replicator) expands the available ports on a laptop by connecting through a single cable or bay.", 1),
      Q("Which technology allows a laptop to use a smartphone's cellular data connection over Wi-Fi?", "Hotspot/tethering", ["NFC", "Bluetooth pairing PIN", "SIM ejection"], "Tethering (creating a mobile hotspot) shares a phone's cellular data connection with other devices over Wi-Fi, Bluetooth, or USB.", 1),
      Q("During Bluetooth pairing, a phone displays a six-digit code that must match on both devices. What step of the pairing process is this?", "Entering the appropriate PIN code", ["Enabling Bluetooth", "Finding a device for pairing", "Testing connectivity"], "Confirming a matching passkey/PIN is the authentication step of Bluetooth pairing, ensuring the correct device is being paired with.", 1),
      Q("An organization allows employees to enroll their personal phones for corporate email while restricting corporate data with a management profile. What model does this describe?", "BYOD (Bring Your Own Device)", ["Corporate-owned device configuration", "Tethering", "APIPA"], "Bring Your Own Device (BYOD) is an MDM configuration model where employees use personally owned hardware enrolled under corporate policy enforcement.", 1),
      Q("Which mobile location technology can determine a device's position indoors, where GPS signals are typically weak or unavailable?", "Cellular location services", ["SIM swapping", "eSIM provisioning", "Bluetooth pairing"], "Cellular (and Wi-Fi) location services triangulate position using nearby towers/access points, which works better indoors than GPS satellite signals.", 1),
      Q("A user is warned they are about to exceed their monthly mobile plan allotment while streaming video over cellular. What mobile device synchronization concept does this describe?", "Recognizing data caps", ["Calendar sync", "Contact sync", "Cloud storage sync"], "Recognizing data caps refers to monitoring and warning users about cellular data usage limits imposed by their carrier plan.", 1),
      Q("Which component would a technician check first if a tablet's on-screen keyboard stops responding to touch in one specific area of the screen?", "Digitizer", ["Inverter", "Wireless card", "Microphone"], "The digitizer is the touch-sensing layer; localized dead zones for touch input point to a digitizer issue rather than the display panel itself.", 1),
      Q("A company issues corporate smartphones and pushes required apps, restricts the camera, and enforces a passcode policy remotely. Which technology enables this?", "Mobile device management (MDM)", ["NFC pairing", "Tethering", "eSIM"], "MDM software lets an organization enforce policies, push corporate applications, and manage configurations on enrolled corporate or BYOD devices.", 1),
      Q("A laptop's keyboard has several keys that have stopped registering input, while the rest work fine. What is the most direct fix?", "Replace the keyboard assembly", ["Replace the wireless card", "Replace the inverter", "Reinstall the OS"], "A keyboard with multiple dead keys, especially in a cluster, usually points to a failing keyboard membrane/assembly that needs replacement.", 1),
      Q("Which mobile hardware component converts the low-voltage DC signal into the higher voltage needed to power a CCFL backlight on older LCD laptop screens?", "Inverter", ["Digitizer", "Wireless card", "Docking station"], "The inverter boosts DC voltage to the level required by a CCFL backlight; failing inverters commonly cause dim or flickering older laptop displays.", 1),
      Q("A user wants to add extended battery life to an older laptop by carrying a spare charged battery. Which mobile hardware component are they replacing/swapping?", "Battery", ["RAM", "SSD", "Camera/webcam"], "Swapping in a charged spare battery replaces the primary power source, extending runtime away from an outlet.", 1),
      Q("Which accessory is specifically designed for precise handwriting or drawing input on a touchscreen tablet?", "Stylus", ["Webcam", "Headset", "Port replicator"], "A stylus provides fine-tipped, pressure-sensitive input for handwriting, sketching, or precise navigation on touchscreens.", 1),
      Q("A conference room laptop needs a single cable connection to simultaneously provide external monitor output, wired network, and extra USB ports. What device is best suited?", "Docking station", ["Stylus", "Speaker", "Webcam"], "A docking station consolidates video, network, and USB expansion into a single connector, ideal for quickly connecting a laptop to peripherals.", 1),
      Q("Which short-range wireless technology is most associated with pairing a wireless keyboard, mouse, or headset to a laptop?", "Bluetooth", ["NFC", "Cellular data", "RFID"], "Bluetooth is the standard short-range wireless technology for pairing peripherals such as keyboards, mice, and headsets.", 1),
      Q("A corporate MDM enforces a 6-digit passcode and can remotely wipe a lost phone. Which MDM capability makes the remote wipe possible?", "Enrollment of the device under the MDM so policies and remote actions apply", ["A longer cellular contract", "Enabling the device hotspot", "Installing a larger battery"], "Devices must be enrolled/managed by the MDM; enrollment is what lets it enforce passcodes and push remote-wipe or lock commands.", 1),      Q("A phone uses an embedded, non-removable chip to store carrier profile information instead of a physical card. What is this called?", "eSIM", ["NFC chip", "TPM", "Digitizer"], "An eSIM (embedded SIM) is soldered into the device and can be provisioned with carrier profiles digitally, without a removable physical SIM card.", 1),
      Q("Which mobile synchronization category ensures a user's meeting appointments update across their phone, tablet, and desktop automatically?", "Calendar sync", ["Data cap tracking", "Business application (mail)", "Cloud storage"], "Calendar synchronization keeps appointment data consistent across all of a user's enrolled devices in near real time.", 1),
      Q("A technician needs to determine whether a tablet's poor Wi-Fi reception is caused by the antenna or the wireless card. Which is more likely if signal strength varies noticeably depending on how the device is physically held?", "The antenna or its connector/placement", ["The wireless card's firmware", "The battery", "The digitizer"], "Signal strength that changes with how a device is physically oriented or held often points to an antenna or antenna-connector issue rather than the card itself.", 1),
      Q("Which biometric technology captures a unique pattern from a fingertip pressed against a small sensor, often built into a phone's power button?", "Fingerprint biometric sensor", ["Facial recognition camera", "Near-field scanner for payments", "Iris scanner only"], "A fingerprint sensor reads the unique ridge pattern of a fingertip and is commonly embedded in a phone's power button or home button.", 1),
      Q("A phone's front camera fails to focus and produces consistently blurry selfies, while the rear camera works fine. What is the most likely cause?", "A hardware fault in the front camera module", ["A corrupted wireless card driver", "A failing digitizer", "A depleted eSIM profile"], "Since only the front camera is affected, the issue is isolated to that specific camera module rather than a broader system or software issue.", 1),
    ],
    labs: ['la-ports', 'la-laptop'],
    gateN: 20
  });

  // ---- labs for this stage ----
  L['la-ports'] = { kind: 'match', title: 'Match the connector to its job', sum: 'Mobile ports & wireless → use',
    brief: 'Pick the right technology for each mobile-device need.',
    options: ['USB-C / Thunderbolt', 'Bluetooth', 'NFC', 'Wi-Fi', 'Cellular (hotspot)', 'GPS', 'Docking station'],
    items: [
      { t: 'One reversible cable for data, external display and charging', a: 'USB-C / Thunderbolt', why: 'Alt mode carries DisplayPort video plus data and power.' },
      { t: 'Pair a wireless mouse or headset to the laptop', a: 'Bluetooth', why: 'Short-range peripheral pairing.' },
      { t: 'Tap the phone on a reader to pay', a: 'NFC', why: 'A few centimeters of range.' },
      { t: 'Share the phone\'s internet with a laptop in a coffee shop', a: 'Cellular (hotspot)', why: 'The phone bridges cellular data to Wi-Fi.' },
      { t: 'Turn-by-turn navigation outdoors', a: 'GPS', why: 'Needs a view of the sky to lock satellites.' },
      { t: 'Connect to the office network for file shares', a: 'Wi-Fi', why: 'Local wireless networking.' },
      { t: 'Plug in once at the desk and get monitor, keyboard, wired network and power', a: 'Docking station', why: 'One connector expands to many ports.' }
    ],
    hints: ['Tap-to-pay is the shortest range of all.', 'A hotspot turns cellular into Wi-Fi for other devices.'],
    debrief: 'Knowing which radio or port solves a need is a daily help-desk skill and a frequent exam target.' };

  L['la-laptop'] = { kind: 'order', title: 'Replace a laptop battery safely', sum: 'Order the service steps',
    brief: 'Put the steps for safely replacing a laptop battery in order.',
    items: [
      { t: 'Check the manufacturer service manual for this exact model', why: 'Procedures and screws differ; always confirm first.' },
      { t: 'Power off the laptop and unplug the AC adapter', why: 'Remove external power before opening.' },
      { t: 'Put on an anti-static (ESD) strap and work on a grounded mat', why: 'Protect components from static discharge.' },
      { t: 'Remove the access panel and disconnect the battery connector', why: 'Disconnect internal power before handling parts.' },
      { t: 'Remove the old battery and inspect for swelling or damage', why: 'Note hazards; a swollen cell needs safe disposal.' },
      { t: 'Install the new battery, reconnect it, and reassemble', why: 'Reverse the disassembly.' },
      { t: 'Power on, verify charging, and recycle the old battery properly', why: 'Confirm the fix and dispose of lithium-ion safely.' }
    ],
    hints: ['Documentation first; disposal last.', 'Power down and remove AC before touching anything inside.'],
    debrief: 'Manual → power down → ESD protection → work → verify → safe disposal is the shape of almost every hardware repair.' };
})();
