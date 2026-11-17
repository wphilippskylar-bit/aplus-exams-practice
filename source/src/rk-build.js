/* A+ Range — turn RangeKit objectives into stages. Domains without objectives yet keep their original stage,
   so the console can be converted one domain at a time. Runs after every rk-c*.js content file and before app.js. */
(function () {
  var RK = window.RK;
  RK.build({ track: 'core1', pfx: 'c1', domains: [
    { d: 1, tier: 'c1-mobile', name: 'Mobile Devices', old: ['a1'], wrapLab: 'c1-d1-wrap', next: 'Domain 2 · Networking' },
    { d: 2, tier: 'c1-net', name: 'Networking', old: ['a2'], wrapLab: 'c1-d2-wrap', next: 'Domain 3 · Hardware' },
    { d: 3, tier: 'c1-hw', name: 'Hardware', old: ['a3'], wrapLab: 'c1-d3-wrap', next: 'Domain 4 · Virtualization & Cloud' },
    { d: 4, tier: 'c1-virt', name: 'Virtualization and Cloud Computing', old: ['a4'], wrapLab: 'c1-d4-wrap', next: 'Domain 5 · Troubleshooting' },
    { d: 5, tier: 'c1-ts', name: 'Hardware and Network Troubleshooting', old: ['a5'], wrapLab: 'c1-d5-wrap', next: 'the Core 1 practice exam' }
  ] });
  RK.build({ track: 'core2', pfx: 'c2', domains: [
    { d: 1, tier: 'c2-os', name: 'Operating Systems', old: ['b1'], wrapLab: 'c2-d1-wrap', next: 'Domain 2 · Security' },
    { d: 2, tier: 'c2-sec', name: 'Security', old: ['b2'], wrapLab: 'c2-d2-wrap', next: 'Domain 3 · Software Troubleshooting' },
    { d: 3, tier: 'c2-swts', name: 'Software Troubleshooting', old: ['b3'], wrapLab: 'c2-d3-wrap', next: 'Domain 4 · Operational Procedures' },
    { d: 4, tier: 'c2-ops', name: 'Operational Procedures', old: ['b4'], wrapLab: 'c2-d4-wrap', next: 'the Core 2 practice exam' }
  ] });
  RK.attachKinds();
})();
