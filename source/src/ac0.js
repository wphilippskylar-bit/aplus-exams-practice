/* A+ Range — course definition (meta). Stages are appended by the a*.js (Core 1) and b*.js (Core 2) files. */
window.Q = function (q, right, wrong, e, d) { return [q, [right].concat(wrong), 0, e, d]; };
window.TYPE = function (q, accept, e, d, ph) { return { q: q, input: true, accept: accept, show: typeof accept[0] === 'string' ? accept[0] : undefined, e: e, d: d, ph: ph }; };

window.COURSE = {
  id: 'aplus',
  title: 'A+ Range',
  subtitle: 'Zero → CompTIA A+ (220-1201 Core 1 & 220-1202 Core 2) → confident IT technician',
  codeExample: 'A1-FIRST-BOOT',
  passPct: 90,
  tracks: [
    { id: 'core1', name: 'Core 1 · 220-1201', short: 'C1', subtitle: 'Hardware, networking, mobile, virtualization & troubleshooting' },
    { id: 'core2', name: 'Core 2 · 220-1202', short: 'C2', subtitle: 'Operating systems, security, software troubleshooting & procedures' }
  ],
  tiers: [
    // ---- Core 1 ----
    { id: 'c1-mobile', track: 'core1', name: '1.0 Mobile Devices', desc: 'Laptops, their parts, and mobile accessories & connectivity. (~13%)' },
    { id: 'c1-net', track: 'core1', name: '2.0 Networking', desc: 'Ports, protocols, devices, Wi-Fi, IP addressing and SOHO networks. (~23%)' },
    { id: 'c1-hw', track: 'core1', name: '3.0 Hardware', desc: 'Cables, connectors, storage, RAM, motherboards, CPUs, power and printers. (~25%)' },
    { id: 'c1-virt', track: 'core1', name: '4.0 Virtualization & Cloud', desc: 'Cloud models and client-side virtualization. (~11%)' },
    { id: 'c1-ts', track: 'core1', name: '5.0 Troubleshooting', desc: 'Hardware, storage, display, network and printer problems. (~28%)' },
    { id: 'c1-x', track: 'core1', name: 'Core 1 Exam Ready', desc: 'A weighted, timed 90-question exam simulation. Pass it, book 220-1201.' },
    // ---- Core 2 ----
    { id: 'c2-os', track: 'core2', name: '1.0 Operating Systems', desc: 'Windows, macOS, Linux, commands, install and configuration. (~28%)' },
    { id: 'c2-sec', track: 'core2', name: '2.0 Security', desc: 'Threats, physical & logical security, wireless, malware and best practices. (~28%)' },
    { id: 'c2-swts', track: 'core2', name: '3.0 Software Troubleshooting', desc: 'OS, application, malware and mobile software problems. (~22%)' },
    { id: 'c2-ops', track: 'core2', name: '4.0 Operational Procedures', desc: 'Documentation, change & safety, communication and scripting. (~22%)' },
    { id: 'c2-x', track: 'core2', name: 'Core 2 Exam Ready', desc: 'A weighted, timed 90-question exam simulation. Pass it, book 220-1202.' }
  ],
  // domain ids are per-core (a Core 1 capstone only pools Core 1 questions)
  domainsCore1: { 1: '1.0 Mobile Devices', 2: '2.0 Networking', 3: '3.0 Hardware', 4: '4.0 Virtualization & Cloud', 5: '5.0 Troubleshooting' },
  domainsCore2: { 1: '1.0 Operating Systems', 2: '2.0 Security', 3: '3.0 Software Troubleshooting', 4: '4.0 Operational Procedures' },
  domains: { 1: 'Domain 1', 2: 'Domain 2', 3: 'Domain 3', 4: 'Domain 4', 5: 'Domain 5' },
  stages: [],
  labs: {},
  gens: null,
  tools: null
};
