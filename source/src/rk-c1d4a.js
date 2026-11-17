/* A+ Core 1 (220-1201) — Domain 4.0 Virtualization and Cloud Computing — 4.1, 4.2 + domain wrap lab + extras */
(function () {
  var RK = window.RK, P = RK.P, M = RK.M, O = RK.O, T = RK.T, C = RK.C, TR = 'core1';
  function pro(t) { return '<div class="callout pro"><b class="k">On the job</b>' + t + '</div>'; }
  function trap(t) { return '<div class="callout trap"><b class="k">Exam trap</b>' + t + '</div>'; }

  // ===================== 4.1 Virtualization =====================
  T('c1-hyperv', 'Build a sandbox VM for a suspicious installer', 'Hyper-V from PowerShell',
    'Ticket: a vendor sent an old installer that only runs on Windows 10, and security wants it tested in isolation first. Build a sandboxed VM on the tech\'s Windows 11 Pro PC. Elevated PowerShell.',
    { shell: 'ps', prompt: 'PS C:\\Windows\\system32>' },
    [{ t: 'Check whether the Hyper-V feature is enabled.', accept: [/^get-windowsoptionalfeature -online -featurename microsoft-hyper-v(-all)?$/i], show: 'Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All', hint: 'Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All', out: 'FeatureName : Microsoft-Hyper-V-All\nState       : Disabled', why: 'Hyper-V is off. It needs Windows Pro/Enterprise, a 64-bit CPU with virtualization support enabled in UEFI, and enough RAM.' },
     { t: 'Enable Hyper-V.', accept: [/^enable-windowsoptionalfeature -online -featurename microsoft-hyper-v(-all)?( -all)?( -norestart)?$/i], show: 'Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All', hint: 'Enable-WindowsOptionalFeature -Online -FeatureName …', out: 'Do you want to restart the computer to complete this operation now? [Y] Yes\n(after restart)', ask: { q: 'Hyper-V runs directly on the hardware with Windows as a privileged partition. Is that a Type 1 or Type 2 hypervisor? (1 or 2)', accept: ['1', 'type 1'], why: 'Type 1 (bare metal): Hyper-V, ESXi, Proxmox. Type 2 (hosted, an app on an OS): VirtualBox, VMware Workstation.' }, why: 'Hypervisor installed.' },
     { t: 'Create a Private virtual switch so the sandbox VM cannot reach the host or the network.', accept: [/^new-vmswitch -name "?sandbox"? -switchtype private$/i, /^new-vmswitch -switchtype private -name "?sandbox"?$/i], show: 'New-VMSwitch -Name "Sandbox" -SwitchType Private', hint: 'New-VMSwitch -Name "Sandbox" -SwitchType Private', out: 'Name    SwitchType NetAdapterInterfaceDescription\n----    ---------- ------------------------------\nSandbox Private', why: 'Network requirement: Private = VMs only; Internal = VMs + host; External = real network.' },
     { t: 'Create the VM "Test-Win10": 4 GB RAM, new 60 GB virtual disk, on the Sandbox switch.', accept: [/^new-vm -name "?test-win10"? -memorystartupbytes 4gb -newvhdpath "?.+\.vhdx"? -newvhdsizebytes 60gb -switchname "?sandbox"?( -generation 2)?$/i, /^new-vm -name "?test-win10"? .*-switchname "?sandbox"?.*$/i], show: 'New-VM -Name "Test-Win10" -MemoryStartupBytes 4GB -NewVHDPath "D:\\VMs\\Test-Win10.vhdx" -NewVHDSizeBytes 60GB -SwitchName "Sandbox" -Generation 2', hint: 'New-VM -Name … -MemoryStartupBytes 4GB -NewVHDPath … -NewVHDSizeBytes 60GB -SwitchName "Sandbox"', out: 'Name       State CPUUsage(%) MemoryAssigned(M) Uptime   Status\n----       ----- ----------- ----------------- ------   ------\nTest-Win10 Off   0           0                 00:00:00 Operating normally', why: 'Storage requirement: a VHDX file on a disk with room to spare (and a dynamic disk grows as used).' },
     { t: 'After installing Windows 10 in the VM, take a checkpoint (snapshot) before running the installer.', accept: [/^checkpoint-vm -name "?test-win10"?( -snapshotname "?.+"?)?$/i], show: 'Checkpoint-VM -Name "Test-Win10" -SnapshotName "Clean before vendor app"', hint: 'Checkpoint-VM -Name … -SnapshotName …', out: '', why: 'Sandbox: run the suspicious installer, watch it, then roll back to the clean checkpoint. Nothing touches the host or network.' }],
    'Virtualization requirements: CPU virtualization support + enough RAM + storage + the right virtual network + isolation (security). Checkpoints make sandboxes disposable.',
    ['Get/Enable-WindowsOptionalFeature, New-VMSwitch, New-VM, Checkpoint-VM.']);
  T('c1-docker', 'VM or container?', 'Run an app in a container',
    'Ticket: a developer needs the same web app version on every laptop without a full VM per app. Linux build box with Docker installed.',
    { shell: 'bash', prompt: 'dev@build01:~$' },
    [{ t: 'Download the official nginx web server image.', accept: [/^(sudo )?docker pull nginx(:[\w.-]+)?$/], show: 'docker pull nginx:1.27', hint: 'docker pull <image>:<tag>', out: '1.27: Pulling from library/nginx\nStatus: Downloaded newer image for nginx:1.27', why: 'An image = the app plus its libraries, without a whole OS kernel.' },
     { t: 'Run it detached as "web", mapping host port 8080 to the container\'s port 80.', accept: [/^(sudo )?docker run -d --name web -p 8080:80 nginx(:1\.27)?$/, /^(sudo )?docker run --name web -d -p 8080:80 nginx(:1\.27)?$/, /^(sudo )?docker run -d -p 8080:80 --name web nginx(:1\.27)?$/], show: 'docker run -d --name web -p 8080:80 nginx:1.27', hint: 'docker run -d --name web -p 8080:80 nginx:1.27', out: '3f9c2a7d1b44e0c8a2…', why: 'Started in about a second — no OS to boot.' },
     { t: 'List running containers.', accept: [/^(sudo )?docker ps$/], show: 'docker ps', hint: 'docker ps', out: 'CONTAINER ID  IMAGE       STATUS         PORTS                  NAMES\n3f9c2a7d1b44  nginx:1.27  Up 4 seconds   0.0.0.0:8080->80/tcp   web', why: 'Running and published on 8080.' },
     { t: 'Show which kernel the container is using.', accept: [/^(sudo )?docker exec web uname -r$/], show: 'docker exec web uname -r', hint: 'docker exec <name> uname -r', out: '6.8.0-45-generic', ask: { q: 'Is that the host\'s own kernel? (yes/no)', accept: ['yes'], why: 'Containers share the host OS kernel and isolate only the app. VMs each run a full guest OS with its own kernel — heavier, but stronger isolation and any OS.' }, why: 'The key container vs VM difference.' }],
    'Containers: lightweight, share the host kernel, start in seconds, same app everywhere. VMs: full OS each, stronger isolation, can run a different OS.',
    ['docker pull / run / ps / exec.']);
  M('c1-virt-wrap', 'Virtualization advisor', 'Combined 4.1',
    'Pick the best answer.', ['Sandbox VM', 'Test/development VM', 'Legacy OS VM', 'Cross-platform virtualization', 'Application virtualization', 'VDI', 'Container', 'Type 1 hypervisor', 'Type 2 hypervisor'],
    [['Open a suspicious attachment safely and throw it away afterwards', 'Sandbox VM', 'Isolated, disposable.'], ['Try a new OS update before rolling it out', 'Test/development VM', 'Test.'], ['Accounting app only runs on Windows XP', 'Legacy OS VM', 'Legacy software/OS.'], ['Mac user needs a Windows-only program', 'Cross-platform virtualization', 'Run another OS.'], ['App streamed to the desktop without being installed locally', 'Application virtualization', 'App-V/RemoteApp style.'], ['Call center agents log into the same desktop from any thin client', 'VDI', 'Hosted desktops.'], ['Run the same microservice identically on 50 servers with little overhead', 'Container', 'Shares kernel.'], ['Data center hosts running ESXi or Hyper-V Server', 'Type 1 hypervisor', 'Bare metal.'], ['VirtualBox on a technician\'s laptop', 'Type 2 hypervisor', 'Hosted.']],
    'Purpose → VM, container, VDI or app virtualization; scale → Type 1 or Type 2.');

  RK.add({ track: TR, id: '4.1', dom: 4, short: 'Virtualization concepts', title: 'Explain virtualization concepts',
    goal: 'Explain why VMs are used, their requirements, VDI, containers and Type 1 vs Type 2 hypervisors.',
    kw: /\b(virtual machine|\bvm\b|vms|hypervisor|type 1|type 2|bare.metal|hosted|sandbox|vdi|virtual desktop|container|docker|application virtualization|hyper-v|virtualbox|vmware|esxi|guest|host os|snapshot|checkpoint)/,
    parts: [
      P('Why VMs, and hypervisors', 'Explain the purposes of virtual machines and compare Type 1 and Type 2 hypervisors.',
        `<p>A <b>virtual machine (VM)</b> is a complete computer in software: virtual CPU, RAM, disk and NIC, running its own guest OS on a host.</p>
<p><b>Purpose of VMs</b>:</p>
<ul><li><b>Sandbox</b> — run untrusted software isolated, then roll back with a snapshot/checkpoint.</li>
<li><b>Test development</b> — try updates, builds and configurations without touching production.</li>
<li><b>Application virtualization</b> — keep apps running that need <b>legacy software/OS</b> (an old Windows version), and <b>cross-platform virtualization</b> (Windows on a Mac, Linux on Windows).</li>
<li>Consolidation — many servers on one physical host.</li></ul>
<p><b>Hypervisors</b> create and run VMs:</p>
<ul><li><b>Type 1</b> (bare metal) — runs directly on hardware: VMware ESXi, Microsoft Hyper-V, Proxmox, KVM. Data centers.</li>
<li><b>Type 2</b> (hosted) — an application on a normal OS: VirtualBox, VMware Workstation, Parallels. Desktops and labs.</li></ul>` + pro('Take a snapshot before any risky change in a VM, but do not leave snapshots for weeks — they grow and slow the VM. Snapshots are not backups.') + trap('Type 1 = bare metal (no host OS underneath). Type 2 runs on top of an existing OS.'),
        [['Which hypervisor type runs directly on hardware?', 'Type 1', ['Type 2', 'Container engine', 'VDI client'], 'Bare metal.'],
         ['Running an old Windows XP app on a modern PC is an example of:', 'Using a VM for legacy software/OS', ['Multitenancy', 'Elasticity', 'Port replication'], 'Legacy support.']],
        'c1-hyperv'),
      P('Requirements, VDI and containers', 'Describe VM security, network and storage requirements, and compare VDI and containers.',
        `<p><b>Requirements</b>:</p>
<ul><li><b>Security</b> — patch every guest like a real PC; isolate sandboxes; protect the host (a compromised host owns all its VMs); watch for VM escape and VM sprawl (forgotten, unpatched VMs).</li>
<li><b>Network</b> — virtual switches: external (real network), internal (VMs + host), private (VMs only). Each VM needs its own address.</li>
<li><b>Storage</b> — virtual disks (VHDX, VMDK) need space and fast drives; plan for snapshots. Plus <b>CPU virtualization support</b> (VT-x/AMD-V) and enough <b>RAM</b> for host + all guests.</li></ul>
<p><b>Desktop virtualization — VDI</b> (virtual desktop infrastructure): users\' desktops run as VMs in a data center or cloud; they connect from any device (thin client, laptop). Central management and data stays in the data center.</p>
<p><b>Containers</b> (Docker, Kubernetes) package an app with its libraries and share the host OS <b>kernel</b>. Much lighter and faster than VMs, but all containers on a host use that host\'s OS type.</p>` + pro('Before enabling Hyper-V or WSL2 on a user\'s PC, confirm VT-x/AMD-V is on in UEFI and there is enough RAM — most "VM will not start" tickets are one of those two.') + trap('Containers do not include a full guest OS; VMs do. A Linux container cannot run natively on a Windows kernel without a Linux VM underneath.'),
        [['What do containers share with the host?', 'The OS kernel', ['Nothing', 'A full guest OS', 'A Type 2 hypervisor'], 'Kernel.'],
         ['Users connect to desktops hosted in the data center from thin clients. What is this?', 'VDI', ['Containers', 'Type 2 hypervisor', 'SaaS email'], 'Desktop virtualization.']],
        'c1-docker')
    ],
    wrap: { recap: ['VM purposes: sandbox, test development, application virtualization (legacy software/OS, cross-platform).', 'Type 1 = bare metal (ESXi, Hyper-V); Type 2 = hosted app (VirtualBox, Workstation).', 'Requirements: VT-x/AMD-V, RAM, storage for virtual disks/snapshots, virtual networking.', 'Security: patch guests, isolate sandboxes, protect the host, avoid VM sprawl.', 'VDI = hosted desktops reached from any device.', 'Containers share the host kernel: light and fast; VMs carry a full OS.'], lab: 'c1-virt-wrap' }
  });

  // ===================== 4.2 Cloud computing =====================
  M('c1-cloudmodel', 'Which cloud model?', 'Deployment and service models',
    'Pick the model.', ['Public cloud', 'Private cloud', 'Hybrid cloud', 'Community cloud', 'IaaS', 'PaaS', 'SaaS'],
    [['Anyone can rent resources from a provider like AWS or Azure', 'Public cloud', 'Shared provider.'], ['A bank runs its own cloud platform for itself only', 'Private cloud', 'Single organization.'], ['On-premises servers burst to Azure during peak season', 'Hybrid cloud', 'Mix.'], ['Several hospitals share a cloud built for healthcare compliance', 'Community cloud', 'Shared by a group with common needs.'], ['Rent virtual servers, storage and networks; you manage the OS', 'IaaS', 'Infrastructure.'], ['Upload code; the provider runs the OS, runtime and scaling', 'PaaS', 'Platform.'], ['Use Microsoft 365 or Salesforce in a browser', 'SaaS', 'Software.']],
    'IaaS → PaaS → SaaS: you manage less at each step.');
  C('c1-cloudcost', 'Metered cloud bill', 'Metered utilization and egress',
    'A VM costs <b>$0.10 per hour</b>. Storage costs <b>$0.02 per GB-month</b>. Ingress (data in) is free; egress (data out to the Internet) costs <b>$0.09 per GB</b>. This month: the VM ran <b>300 hours</b>, stored <b>500 GB</b>, received 2,000 GB and sent <b>400 GB</b>.',
    [['VM compute cost ($)', 30, '30', '300 h × $0.10.'],
     ['Storage cost ($)', 10, '10', '500 × $0.02.'],
     ['Egress cost ($)', 36, '36', '400 GB × $0.09; the 2,000 GB of ingress is free.'],
     ['Total bill ($)', 76, '76', '30 + 10 + 36.']],
    'Metered utilization: you pay for what you use. Egress is often the surprise on the bill.',
    ['Cost = usage × rate; ingress usually free, egress charged.']);
  M('c1-cloudchar', 'Which cloud characteristic?', 'Shared/dedicated, metered, ingress/egress, elasticity, availability, sync, multitenancy',
    'Pick the characteristic.', ['Shared resources', 'Dedicated resources', 'Metered utilization', 'Ingress/egress', 'Elasticity', 'Availability', 'File synchronization', 'Multitenancy'],
    [['Your VMs run on hosts that also run other customers\' VMs', 'Shared resources', 'Cheaper.'], ['A compliance rule requires hardware used only by your company', 'Dedicated resources', 'Dedicated hosts.'], ['Billed per second of compute and per GB stored', 'Metered utilization', 'Pay as you go.'], ['Moving data out of the cloud is charged, moving it in is free', 'Ingress/egress', 'Data transfer.'], ['Web servers scale from 2 to 20 for Black Friday, then back', 'Elasticity', 'Scale up and down automatically.'], ['Running in two zones so a data-center outage does not stop service', 'Availability', 'Uptime/SLA.'], ['A file saved on a laptop appears on the phone and web', 'File synchronization', 'OneDrive/Dropbox.'], ['Many customers use one SaaS app instance, each seeing only its own data', 'Multitenancy', 'Logical separation.']],
    'Cloud value: elastic, metered, highly available — on shared (multitenant) infrastructure unless you pay for dedicated.');
  M('c1-cloud-wrap', 'Cloud advisor', 'Combined 4.2',
    'Pick the best answer.', ['SaaS', 'PaaS', 'IaaS', 'Hybrid cloud', 'Private cloud', 'Community cloud', 'Elasticity', 'Egress charges', 'Dedicated resources'],
    [['Small office wants email and documents without servers', 'SaaS', 'Microsoft 365/Google Workspace.'], ['Developers want to deploy web code without managing servers', 'PaaS', 'Platform.'], ['Lift an existing server VM into the cloud as-is', 'IaaS', 'Infrastructure.'], ['Keep the patient database on-site but host the website in public cloud', 'Hybrid cloud', 'Mix.'], ['Agency must keep everything on infrastructure it owns and runs', 'Private cloud', 'Single org.'], ['Several state agencies share a government cloud', 'Community cloud', 'Common requirements.'], ['Ticket sales spike for one hour when a concert goes on sale', 'Elasticity', 'Scale out/in.'], ['Bill jumped after users started downloading large videos from cloud storage', 'Egress charges', 'Data out.'], ['Licensing requires software on hardware not shared with others', 'Dedicated resources', 'Dedicated hosts.']],
    'Model (who manages what) + deployment (who shares it) + characteristic (how it behaves and bills).');

  RK.add({ track: TR, id: '4.2', dom: 4, moreLabs: ['c1-cloudchar'], short: 'Cloud computing', title: 'Summarize cloud computing concepts',
    goal: 'Summarize public, private, hybrid and community clouds; IaaS, PaaS and SaaS; and cloud characteristics.',
    kw: /\b(cloud|public cloud|private cloud|hybrid|community cloud|iaas|paas|saas|infrastructure as a service|platform as a service|software as a service|elastic|metered|pay.as.you.go|multitenan|ingress|egress|shared resources|dedicated|file sync|availability zone)/,
    parts: [
      P('Cloud models', 'Compare private, public, hybrid and community clouds and IaaS, PaaS and SaaS.',
        `<p><b>Deployment models</b> — who the cloud is for:</p>
<ul><li><b>Public</b> — provider-owned, shared by many customers (AWS, Azure, Google Cloud).</li>
<li><b>Private</b> — used by one organization, on-premises or hosted.</li>
<li><b>Hybrid</b> — private/on-premises and public combined, with workloads and data moving between them.</li>
<li><b>Community</b> — shared by organizations with common requirements (government, healthcare, research).</li></ul>
<p><b>Service models</b> — what the provider manages:</p>
<table><tr><th>Model</th><th>Provider manages</th><th>You manage</th><th>Example</th></tr>
<tr><td><b>IaaS</b></td><td>Hardware, virtualization, network</td><td>OS, apps, data</td><td>Azure VMs, AWS EC2</td></tr>
<tr><td><b>PaaS</b></td><td>+ OS and runtime</td><td>Apps and data</td><td>Azure App Service, Heroku</td></tr>
<tr><td><b>SaaS</b></td><td>Everything</td><td>Users and data settings</td><td>Microsoft 365, Salesforce</td></tr></table>` + pro('With SaaS the provider runs the software, but you still own the data and the accounts. Turn on MFA and keep a backup of critical SaaS data.') + trap('IaaS = you patch the OS. PaaS = the provider patches the OS. SaaS = you only use the app.'),
        [['Which service model gives you virtual servers whose OS you manage?', 'IaaS', ['PaaS', 'SaaS', 'Community'], 'Infrastructure.'],
         ['Several hospitals share a compliant cloud. Which deployment model?', 'Community', ['Public', 'Private', 'Hybrid'], 'Common needs.']],
        'c1-cloudmodel'),
      P('Cloud characteristics', 'Explain shared vs dedicated resources, metered utilization, ingress/egress, elasticity, availability, file synchronization and multitenancy.',
        `<ul><li><b>Shared vs dedicated resources</b> — by default your workloads share physical hosts with other customers; dedicated hosts/instances cost more but meet licensing or compliance needs.</li>
<li><b>Metered utilization</b> — pay per use (per second/hour of compute, per GB stored, per request).</li>
<li><b>Ingress/egress</b> — data in (ingress) is usually free; data out (egress) to the Internet or another region is charged.</li>
<li><b>Elasticity</b> — resources scale up/out and back down automatically with demand.</li>
<li><b>Availability</b> — redundancy across zones and regions; providers publish SLAs (e.g. 99.9%).</li>
<li><b>File synchronization</b> — services like OneDrive, Google Drive and Dropbox keep files the same on every device; conflicts create duplicate copies.</li>
<li><b>Multitenancy</b> — many customers (tenants) share the same infrastructure or app instance, logically separated.</li></ul>` + pro('Set budget alerts on every cloud subscription. Forgotten test VMs and unexpected egress are the two classic surprise bills.') + trap('Elasticity is automatic scaling with demand (up and down); scalability is the ability to grow at all.'),
        [['Which characteristic means you pay for exactly what you use?', 'Metered utilization', ['Multitenancy', 'Dedicated resources', 'Private cloud'], 'Pay per use.'],
         ['Which is usually charged: ingress or egress?', 'Egress', ['Ingress', 'Neither, ever', 'Both always free'], 'Data out.']],
        'c1-cloudcost')
    ],
    wrap: { recap: ['Public (provider, shared), private (one org), hybrid (mix), community (shared by similar orgs).', 'IaaS: you manage OS/apps. PaaS: you manage apps/code. SaaS: you use the app.', 'Shared vs dedicated resources; multitenancy = many tenants, logically separated.', 'Metered utilization; ingress usually free, egress charged.', 'Elasticity = automatic scale up/down; availability = zones/regions/SLA.', 'File synchronization keeps files the same across devices.'], lab: 'c1-cloud-wrap' }
  });

  // ===================== Domain 4 combined lab =====================
  T('c1-d4-wrap', 'Domain 4 shift: lab host and cloud check', 'Virtualization + cloud in one ticket',
    'Ticket: set up a test VM on the help-desk lab host and check the team\'s cloud-synced files. Elevated PowerShell. Each task names its objective.',
    { shell: 'ps', prompt: 'PS C:\\Windows\\system32>' },
    [{ t: '<b>4.1</b> — Confirm the CPU has virtualization enabled in firmware.', accept: [/^get-ciminstance (-classname )?win32_processor( \| select(-object)? .+| \| (fl|format-list).*)?$/i, /^gcim win32_processor.*$/i], show: 'Get-CimInstance Win32_Processor | Select-Object Name,VirtualizationFirmwareEnabled', hint: '4.1 — Win32_Processor', out: 'Name                           VirtualizationFirmwareEnabled\n----                           -----------------------------\nAMD Ryzen 7 7700               True', why: 'AMD-V is on.' },
     { t: '<b>4.1</b> — Create an Internal virtual switch "LabNet" (VMs + host, no outside network).', accept: [/^new-vmswitch -name "?labnet"? -switchtype internal$/i, /^new-vmswitch -switchtype internal -name "?labnet"?$/i], show: 'New-VMSwitch -Name "LabNet" -SwitchType Internal', hint: '4.1 — New-VMSwitch', out: 'Name   SwitchType\n----   ----------\nLabNet Internal', why: 'Network requirement for a test lab.' },
     { t: '<b>4.1</b> — List the VMs and their state.', accept: [/^get-vm$/i], show: 'Get-VM', hint: '4.1 — Get-VM', out: 'Name        State   CPUUsage(%) MemoryAssigned(M)\n----        -----   ----------- -----------------\nTest-Win10  Off     0           0\nOld-ERP-XP  Running 3           1024', ask: { q: 'Which VM exists to keep legacy software running?', accept: ['old-erp-xp'], why: 'A legacy OS VM for an old ERP app — isolate it on LabNet; XP gets no patches.' }, why: 'VM purposes.' },
     { t: '<b>4.2</b> — Check the OneDrive sync folder size to estimate cloud storage use (path: $env:OneDrive).', accept: [/^\(?get-childitem \$env:onedrive -recurse( -file)? \| measure-object -property length -sum\)?(\.sum)?( ?\/ ?1gb)?$/i, /^gci \$env:onedrive -recurse( -file)? \| measure -property length -sum$/i], show: '(Get-ChildItem $env:OneDrive -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1GB', hint: '4.2 — Get-ChildItem … | Measure-Object -Property Length -Sum', out: '412.6', ask: { q: 'About how many GB are synced? (round to whole GB)', accept: ['413', '412'], why: 'File synchronization; metered storage. If the plan is 1 TB per user, this user is fine.' }, why: 'File synchronization and metered utilization.' }],
    'Domain 4 in one ticket: virtualization requirements and purposes (4.1), cloud file sync and metered use (4.2).',
    ['Each task names its objective.']);

  // ---------- extras + cards ----------
  RK.extra(TR, '4.1', [
    ['Which is an example of a Type 2 hypervisor?', 'VirtualBox', ['VMware ESXi', 'Microsoft Hyper-V Server', 'Proxmox VE'], 'Hosted.'],
    ['What must be enabled in UEFI to run most hypervisors?', 'CPU virtualization support (VT-x/AMD-V)', ['Secure Boot only', 'Legacy USB', 'Fast Boot'], 'Hardware virtualization.'],
    ['Which virtual switch type isolates VMs from both the host and the network?', 'Private', ['External', 'Internal', 'Bridged'], 'VMs only.'],
    ['What is VM sprawl?', 'Uncontrolled, forgotten VMs that waste resources and go unpatched', ['A type of container', 'A hypervisor crash', 'A backup method'], 'Security/management risk.'],
    ['Which technology starts in seconds because it does not boot a full OS?', 'Container', ['Type 1 VM', 'VDI desktop', 'Dual boot'], 'Shares kernel.'],
    ['What is a key benefit of VDI?', 'Desktops and data are managed centrally and reachable from any device', ['No network needed', 'No servers needed', 'Free licensing'], 'Central management.'],
    ['Why use a snapshot/checkpoint before testing malware in a VM?', 'To roll the VM back to a clean state afterwards', ['To speed up the VM', 'To encrypt the host', 'To share the kernel'], 'Disposable sandbox.'],
    ['Which describes cross-platform virtualization?', 'Running Windows in a VM on a Mac', ['Running two apps on one OS', 'Using RAID 1', 'Using a KVM switch'], 'Another OS.']
  ]);
  RK.extra(TR, '4.2', [
    ['Which service model is Microsoft 365?', 'SaaS', ['IaaS', 'PaaS', 'Private cloud'], 'Software.'],
    ['Which deployment model combines on-premises and public cloud?', 'Hybrid', ['Community', 'Private', 'Public only'], 'Mix.'],
    ['What is multitenancy?', 'Many customers share infrastructure while their data stays separated', ['One customer per server', 'A backup type', 'A VPN feature'], 'Shared, isolated.'],
    ['Which characteristic adds servers automatically during a traffic spike and removes them later?', 'Elasticity', ['Multitenancy', 'Egress', 'Community cloud'], 'Scale with demand.'],
    ['In PaaS, who patches the operating system?', 'The cloud provider', ['The customer', 'The end user', 'Nobody'], 'Platform managed.'],
    ['Why might a company pay for dedicated resources?', 'Licensing or compliance requires hardware not shared with others', ['It is always cheaper', 'To enable egress', 'To use SaaS'], 'Dedicated hosts.'],
    ['What does a 99.9% availability SLA promise?', 'Uptime target the provider commits to', ['Unlimited storage', 'Free egress', 'No data loss ever'], 'Availability.'],
    ['A file edited on two devices offline creates a duplicate copy. Which feature is involved?', 'File synchronization conflict', ['Elasticity', 'Multitenancy', 'Metering'], 'Sync conflict.']
  ]);
  RK.cards(TR, '4.1', [['Type 1 vs Type 2', 'Bare metal vs hosted on an OS.'], ['Container', 'App + libraries; shares host kernel.'], ['VDI', 'Hosted desktops from any device.'], ['Sandbox', 'Isolated VM; roll back with a checkpoint.']]);
  RK.cards(TR, '4.2', [['IaaS / PaaS / SaaS', 'You manage OS / code / nothing but use.'], ['Hybrid cloud', 'On-premises + public.'], ['Egress', 'Data out — usually charged.'], ['Elasticity', 'Automatic scale up and down.']]);
})();
