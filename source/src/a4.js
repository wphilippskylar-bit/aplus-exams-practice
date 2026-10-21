/* A+ Core 1 — 4.0 Virtualization & Cloud */
(function () {
  var S = COURSE.stages, Q = window.Q, T = window.TYPE, L = COURSE.labs;

  S.push({
    id: 'a4', track: 'core1', tier: 'c1-virt', title: 'Virtualization & cloud', code: 'A4-MACHINES-ON-MACHINES',
    goal: 'Cloud service and deployment models, their key traits, and running virtual machines on a client PC.',
    lesson: [
      { h: 'Cloud models', html: '<ul><li><b>Service models</b>: <b>IaaS</b> (you rent VMs/storage/networking and manage the OS up), <b>PaaS</b> (you deploy apps on a managed platform), <b>SaaS</b> (you just use the software — Microsoft 365, Google Workspace).</li><li><b>Deployment models</b>: <b>public</b> (shared provider), <b>private</b> (your own), <b>hybrid</b> (both, working together), <b>community</b> (shared by similar orgs).</li><li><b>Key traits</b>: <b>on-demand self-service</b>, <b>rapid elasticity</b> (scale up/down automatically), <b>measured/metered usage</b> (pay for what you use), <b>resource pooling</b>, and broad network access. <b>High availability</b> spreads workloads so one failure doesn\'t take the service down.</li><li>File sync services keep data consistent across devices; be mindful of sync conflicts and storage limits.</li></ul>' },
      { h: 'Client-side virtualization', html: '<ul><li>A <b>hypervisor</b> runs virtual machines. <b>Type 1</b> runs directly on hardware (servers); <b>Type 2</b> runs as an app on your OS (VirtualBox, VMware Workstation, Hyper-V on a desktop).</li><li>Requirements: enough <b>CPU cores, RAM and disk</b>, and <b>virtualization enabled in UEFI/BIOS</b> (Intel VT-x / AMD-V). Without it, VMs won\'t start or run slowly.</li><li>Uses: testing, sandboxing suspicious software, running legacy or other operating systems, and training labs. A <b>sandbox</b> isolates risky code from the host.</li><li>VMs share the host\'s resources, so over-committing RAM/CPU slows everything. Each VM gets a <b>virtual NIC</b> (bridged, NAT, or host-only networking).</li></ul>' }
    ],
    cards: [
      ['IaaS', 'Rent infrastructure (VMs, storage); you manage the OS and up.'],
      ['PaaS', 'Managed platform to deploy apps; provider handles the OS/runtime.'],
      ['SaaS', 'Finished software you just use (M365, Google Workspace).'],
      ['Public / private / hybrid', 'Shared provider / your own / a combination.'],
      ['Rapid elasticity', 'Scale resources up and down automatically on demand.'],
      ['Measured service', 'Pay only for what you use (metered).'],
      ['Type 1 hypervisor', 'Runs on bare metal (servers).'],
      ['Type 2 hypervisor', 'Runs as an app on your desktop OS.'],
      ['VT-x / AMD-V', 'CPU virtualization enabled in UEFI/BIOS; required for VMs.'],
      ['Sandbox', 'Isolated environment to run risky or untrusted software safely.'],
      ['High availability', 'Design so one failure does not take the service down.'],
      ['Virtual NIC modes', 'Bridged (on the LAN), NAT (shares host IP), host-only (isolated).']
    ],
    qs: [
      Q("A developer wants to test a new application in an isolated environment without risking the host system, and plans to discard the environment afterward. What is the best use of a VM here?", "Sandbox", ["Desktop virtualization", "Public cloud IaaS", "Load balancing"], "A sandbox VM provides an isolated, disposable environment ideal for testing potentially unstable or unknown software safely.", 4),
      Q("An organization runs an old accounting application that only supports a legacy operating system no longer installed on any physical machines. Which virtualization use case addresses this?", "Application virtualization for legacy software/OS", ["Cross-platform virtualization only", "Type 1 hypervisor on bare desktop", "Containerization only"], "Running the legacy OS inside a VM lets the old application continue functioning on modern hardware without requiring dedicated legacy machines.", 4),
      Q("Which hypervisor type runs directly on server hardware without a host operating system underneath it, typically used in datacenters?", "Type 1 (bare-metal)", ["Type 2 (hosted)", "Container runtime only", "Desktop emulator"], "A Type 1 hypervisor installs directly on the hardware (bare-metal), offering better performance and is common in enterprise/datacenter deployments.", 4),
      Q("A hypervisor such as VirtualBox or VMware Workstation runs as an application on top of Windows. What type of hypervisor is this?", "Type 2", ["Type 1", "Container engine", "Bare-metal"], "A Type 2 (hosted) hypervisor runs as an application on top of an existing host operating system, unlike a Type 1 which runs directly on hardware.", 4),
      Q("Which virtualization technology packages an application with its dependencies but shares the host OS kernel, making it more lightweight than a full VM?", "Container", ["Type 1 hypervisor", "VDI session", "Sandbox VM"], "Containers share the host operating system's kernel and package only the application and its dependencies, making them more lightweight than full VMs.", 4),
      Q("Employees connect from thin clients to centrally hosted desktop sessions running on datacenter servers. What is this architecture called?", "VDI (Virtual Desktop Infrastructure)", ["IaaS", "Community cloud", "SCADA"], "Virtual Desktop Infrastructure (VDI) hosts full desktop operating systems centrally, letting users connect remotely from thin clients or other devices.", 4),
      Q("A cloud provider allows a company to rent virtual servers, storage, and networking, while the company manages its own OS and applications on top. What cloud service model is this?", "IaaS", ["SaaS", "PaaS", "DaaS"], "Infrastructure as a Service (IaaS) provides virtualized compute, storage, and network resources, leaving the OS and application layer to the customer.", 4),
      Q("A cloud environment automatically adds or removes virtual server instances based on real-time demand. Which cloud characteristic does this describe?", "Elasticity", ["Multitenancy", "Metered utilization", "File synchronization"], "Elasticity is the ability of a cloud environment to automatically scale resources up or down in response to changing demand.", 4),
      Q("Several unrelated organizations share the same underlying physical cloud infrastructure while their data remains logically isolated from each other. What is this called?", "Multitenancy", ["Private cloud", "Community cloud", "VDI"], "Multitenancy describes multiple customers (tenants) sharing the same physical infrastructure in a public cloud, with logical separation of their data.", 4),
      Q("Several hospitals within the same healthcare network jointly fund and share a cloud environment tailored to their shared regulatory needs, but it is not open to the general public. What cloud model is this?", "Community cloud", ["Public cloud", "Private cloud", "Hybrid cloud"], "A community cloud is shared by several organizations with common concerns (such as compliance requirements), and access is restricted to that community rather than the general public.", 4),
      Q("A software company wants developers to test their app across Windows, macOS, and Linux without owning separate physical machines for each. Which VM use case fits best?", "Cross-platform virtualization", ["SCADA monitoring", "PoE injection", "RAID striping"], "Cross-platform virtualization lets a single physical host run VMs of different guest operating systems, enabling multi-OS testing without dedicated hardware for each.", 4),
      Q("Which resource requirement is most critical to plan for when hosting many VMs on a single server, since each guest OS consumes its own share continuously?", "RAM (memory) allocation", ["Bluetooth pairing", "NFC range", "RFID tag count"], "Because each VM runs its own OS instance, sufficient RAM allocation across all guests is one of the most critical resource planning factors on a virtualization host.", 4),
      Q("Which virtualization requirement addresses isolating VM network traffic from other tenants or VMs on the same physical host?", "Network requirements (segmentation/isolation)", ["Storage requirements", "CPU core count", "Cooling requirements"], "Proper network configuration, including VLANs or virtual switches, is required to isolate and secure traffic between VMs sharing a physical host.", 4),
      Q("Which hypervisor type would a home user most likely install to run a single VM on their existing Windows gaming PC?", "Type 2 (hosted) hypervisor", ["Type 1 (bare-metal) hypervisor", "SCADA controller", "Container orchestrator only"], "A Type 2 hosted hypervisor, like VirtualBox or VMware Workstation, installs as an application on an existing OS, which is the typical setup for home/desktop use.", 4),
      Q("A datacenter runs dozens of VMs directly on server hardware with no underlying general-purpose OS, maximizing performance and resource allocation. Which hypervisor type is this?", "Type 1 (bare-metal)", ["Type 2 (hosted)", "Container runtime only", "Emulator"], "Type 1 (bare-metal) hypervisors install directly on server hardware, avoiding the overhead of a host OS and offering better performance for many VMs.", 4),
      Q("Which cloud model would best fit a startup that wants to avoid owning any physical servers and rents shared infrastructure from a major provider available to the general public?", "Public cloud", ["Private cloud", "Community cloud", "On-premises datacenter"], "A public cloud is owned and operated by a third-party provider and made available to the general public/multiple customers on shared infrastructure.", 4),
      Q("A large enterprise maintains its own dedicated cloud infrastructure, accessible only to its internal departments, for strict regulatory reasons. What cloud model is this?", "Private cloud", ["Public cloud", "Community cloud", "Hybrid cloud"], "A private cloud is dedicated to a single organization, offering greater control, often chosen to meet strict security or regulatory requirements.", 4),
      Q("An organization keeps sensitive data on-premises but bursts additional compute capacity into a public cloud provider during peak demand. What cloud model combines these?", "Hybrid cloud", ["Community cloud", "Private cloud only", "IaaS only"], "A hybrid cloud combines private/on-premises infrastructure with public cloud resources, allowing workloads to move between them as needed.", 4),
      Q("A company subscribes to a web-based email and office suite, accessing it entirely through a browser without installing or managing any servers. What cloud service model is this?", "SaaS", ["IaaS", "PaaS", "VDI"], "Software as a Service (SaaS) delivers a fully managed application over the internet, with the provider handling the underlying infrastructure and platform.", 4),
      Q("A developer deploys application code to a managed cloud platform that automatically handles the underlying OS, runtime, and scaling, letting them focus only on code. What cloud service model is this?", "PaaS", ["IaaS", "SaaS", "On-premises virtualization"], "Platform as a Service (PaaS) provides a managed runtime/platform layer so developers can deploy code without managing servers or OS patching themselves.", 4),
    ],
    labs: ['la-cloud'],
    gateN: 16
  });

  L['la-cloud'] = { kind: 'match', title: 'Classify the cloud scenario', sum: 'Match each example to its model',
    brief: 'Pick the cloud service or deployment model each scenario describes.',
    options: ['IaaS', 'PaaS', 'SaaS', 'Public cloud', 'Private cloud', 'Hybrid cloud', 'Rapid elasticity'],
    items: [
      { t: 'A company uses Microsoft 365 email and Office apps in the browser', a: 'SaaS', why: 'Finished software, nothing to manage.' },
      { t: 'Developers deploy code to a managed platform without touching servers', a: 'PaaS', why: 'Platform managed by the provider.' },
      { t: 'A team rents virtual machines and installs their own OS and software', a: 'IaaS', why: 'They manage the OS and up.' },
      { t: 'Servers automatically add capacity during a traffic spike, then shrink', a: 'Rapid elasticity', why: 'Scales on demand.' },
      { t: 'Sensitive workloads stay in the company\'s own data center only', a: 'Private cloud', why: 'Owned and operated internally.' },
      { t: 'Everyday apps run in the public cloud but regulated data stays on-prem, linked together', a: 'Hybrid cloud', why: 'Public and private working together.' },
      { t: 'A startup uses a shared provider like AWS or Azure with no hardware of its own', a: 'Public cloud', why: 'Shared multi-tenant provider.' }
    ],
    hints: ['IaaS = you manage the OS; PaaS = you manage the app; SaaS = you just use it.', 'Hybrid mixes public and private.'],
    debrief: 'Sorting a scenario into the right model is exactly how the exam tests cloud, and how you advise a customer.' };
})();
