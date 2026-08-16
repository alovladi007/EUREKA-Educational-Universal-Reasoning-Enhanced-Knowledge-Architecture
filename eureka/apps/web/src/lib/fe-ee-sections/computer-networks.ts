// FE EE course content — Computer Networks (5 topics).
// Split byte-identically from fe-ee-course-data.ts so section waves
// can be authored in parallel; spread back into FE_EE_COURSE there.
import type { TopicLesson } from '../fe-ee-course-data';

export const FE_EE_COMPUTER_NETWORKS: Record<string, TopicLesson> = {
fee_osi_tcpip: { topicId: 'fee_osi_tcpip', title: 'OSI and TCP/IP Models', domainWeight: 'Computer Networks · 3–5%',
  overview: 'The OSI seven-layer model and TCP/IP four-layer model provide the conceptual framework for network communication. Protocol layering, encapsulation, device-layer mapping, and well-known port numbers are fundamental FE exam topics.',
  sections: [
    { id: 'osi-layers', title: '1. OSI Reference Model',
      content: `## 1.1 The Seven Layers

| Layer | Name | Function | Examples | PDU |
|---|---|---|---|---|
| 7 | **Application** | User services | HTTP, SMTP, DNS, FTP, SSH | Data |
| 6 | **Presentation** | Encryption, encoding | SSL/TLS, JPEG | Data |
| 5 | **Session** | Session management | NetBIOS, RPC | Data |
| 4 | **Transport** | End-to-end delivery | **TCP** (reliable), **UDP** (fast) | Segment |
| 3 | **Network** | Routing, IP addressing | **IP**, ICMP, OSPF | Packet |
| 2 | **Data Link** | Framing, MAC addresses | Ethernet, WiFi | Frame |
| 1 | **Physical** | Bit transmission | Cables, fiber, hubs | Bits |

## 1.2 Encapsulation

Data moves DOWN the stack: each layer adds its header.
Data moves UP at receiver: each layer strips its header.

## 1.3 Devices by Layer

| Device | Layer | Function |
|---|---|---|
| **Hub / Repeater** | L1 | Amplifies signal; no intelligence |
| **Switch / Bridge** | L2 | Forwards by MAC address |
| **Router** | L3 | Forwards by IP address |
| **Firewall** | L3-L7 | Filters by IP, port, or content |`,
      examTip: 'Hub = L1 (dumb repeater), Switch = L2 (MAC), Router = L3 (IP). A switch does NOT examine IP addresses; a hub does NOT examine anything.',
    },
    { id: 'tcpip-ports', title: '2. TCP/IP Model and Key Protocols',
      content: `## 2.1 TCP/IP Layers

| TCP/IP Layer | OSI Equiv | Protocols |
|---|---|---|
| Application | L5-7 | HTTP, HTTPS, SMTP, DNS, FTP, SSH |
| Transport | L4 | TCP (reliable), UDP (fast) |
| Internet | L3 | IP, ICMP, ARP, OSPF |
| Link | L1-2 | Ethernet, WiFi, PPP |

## 2.2 TCP vs. UDP

| Feature | TCP | UDP |
|---|---|---|
| Connection | 3-way handshake | Connectionless |
| Reliability | Guaranteed, in-order | Best-effort |
| Overhead | 20+ byte header | 8-byte header |
| Use cases | Web, email, files | Streaming, DNS, VoIP |

## 2.3 Well-Known Ports

| Port | Protocol | Service |
|---|---|---|
| **$20/21$** | FTP | File transfer |
| **22** | SSH | Secure shell |
| **25** | SMTP | Email sending |
| **53** | DNS | Name resolution |
| **80** | HTTP | Web |
| **443** | HTTPS | Secure web |`,
      examTip: 'Memorize: HTTP=80, HTTPS=443, SSH=22, DNS=53, SMTP=25, FTP=20/21. TCP uses 3-way handshake (SYN, SYN-ACK, ACK); UDP does not.',
      importantNote: 'DNS typically uses UDP for queries (small packets) but TCP for zone transfers (large data). This dual-protocol behavior is commonly tested.',
    },
    { id: 'osi-exam', title: '3. Protocol Analysis Exam Problems',
      content: `## 3.1 Trace a Packet Through OSI Layers

**Scenario**: User sends an HTTP request to www.example.com.

| Layer | Action | Header/Encapsulation Added |
|---|---|---|
| **L7 Application** | HTTP GET request created | HTTP header |
| **L6 Presentation** | TLS encryption applied | TLS record header |
| **L5 Session** | Session tracking | Session ID |
| **L4 Transport** | TCP segment, port 443 | TCP header (src port, dst port 443, seq #) |
| **L3 Network** | IP packet, routing | IP header (src IP, dst IP) |
| **L2 Data Link** | Ethernet frame | MAC header (src MAC, dst MAC) + FCS trailer |
| **L1 Physical** | Electrical/optical bits | Preamble, encoding |

At the receiver, headers are stripped in **reverse order** (L1 -> L7).

## 3.2 Layer Identification Scenarios

**Match the scenario to the correct OSI layer:**

| Scenario | Layer | Why |
|---|---|---|
| MAC address lookup | **L2 (Data Link)** | Switch forwarding table |
| IP routing decision | **L3 (Network)** | Router next-hop lookup |
| Retransmission of lost segment | **L4 (Transport)** | TCP reliability |
| URL resolution to IP | **L7 (Application)** | DNS protocol |
| Bit encoding on copper wire | **L1 (Physical)** | Signal transmission |
| Establishing encrypted session | **L5/L6 (Session/Presentation)** | TLS handshake |

## 3.3 Port Number Quick-Reference

| Port | Protocol | Transport | Category |
|---|---|---|---|
| $20/21$ | FTP | TCP | File transfer |
| 22 | SSH/SFTP | TCP | Secure remote |
| 23 | Telnet | TCP | Insecure remote |
| 25 | SMTP | TCP | Email send |
| 53 | DNS | UDP/TCP | Name resolution |
| $67/68$ | DHCP | UDP | IP assignment |
| 80 | HTTP | TCP | Web |
| 110 | POP3 | TCP | Email retrieve |
| 143 | IMAP | TCP | Email retrieve |
| 443 | HTTPS | TCP | Secure web |

**Exam strategy**: For "which layer?" questions, ask: Is it about physical signals (L1)? MAC addresses (L2)? IP addresses/routing (L3)? End-to-end delivery/ports (L4)? Application protocol (L7)? This decision tree covers 90% of FE exam scenarios.`,
      examTip: 'The FE exam loves "which layer handles X?" questions. Remember: anything with MAC = L2, anything with IP = L3, anything with ports = L4, anything the user sees = L7.',
      importantNote: 'Switches operate at L2 (MAC) by default. A "Layer 3 switch" also routes by IP. If the exam says "switch" without qualification, assume L2.',
    },
  ],
  keyTakeaways: [
    'OSI: 7 layers (Physical through Application); TCP/IP: 4 practical layers.',
    'Encapsulation adds headers down the stack; decapsulation strips them up.',
    'Hub=L1, Switch=L2 (MAC), Router=L3 (IP) -- most-tested device-layer mapping.',
    'TCP: reliable, 3-way handshake. UDP: fast, connectionless, best-effort.',
    'Key ports: HTTP=80, HTTPS=443, SSH=22, DNS=53, SMTP=25, FTP=20/21.',
  ],
},

fee_ip_subnetting: { topicId: 'fee_ip_subnetting', title: 'IP Addressing and Subnetting', domainWeight: 'Computer Networks · 3–5%',
  overview: 'IP addressing and subnetting partition networks into manageable segments. IPv4 uses 32-bit addresses with CIDR notation. Calculating usable hosts, network addresses, and broadcast addresses from a CIDR prefix is a core FE exam skill.',
  sections: [
    { id: 'ipv4-addr', title: '1. IPv4 Addressing and CIDR',
      content: `## 1.1 Address Structure

IPv4: **32 bits** in dotted decimal (e.g., 192.168.1.100). Split into network and host by subnet mask.

| CIDR | Mask | Host Bits | Usable Hosts |
|---|---|---|---|
| /24 | 255.255.255.0 | 8 | 254 |
| /25 | 255.255.255.128 | 7 | 126 |
| /26 | 255.255.255.192 | 6 | 62 |
| /27 | 255.255.255.224 | 5 | 30 |
| /28 | 255.255.255.240 | 4 | 14 |
| /30 | 255.255.255.252 | 2 | 2 |

## 1.2 Key Formulas

- **Total addresses**: 2^(32 - prefix)
- **Usable hosts**: **2^(32 - prefix) - 2** (subtract network + broadcast)
- **Network address**: host bits all 0
- **Broadcast address**: host bits all 1

## 1.3 Private Ranges

| Class | Range | CIDR |
|---|---|---|
| A | 10.0.0.0 - 10.255.255.255 | 10.0.0.0/8 |
| B | 172.16.0.0 - 172.31.255.255 | 172.16.0.0/12 |
| C | 192.168.0.0 - 192.168.255.255 | 192.168.0.0/16 |`,
      examTip: 'Most common problem: given IP + prefix, find network, broadcast, and host range. Strategy: block size = 2^host_bits; find which block the IP falls in.',
      importantNote: '/30 has only 2 usable hosts (point-to-point links). /31 is a special case per RFC 3021. /32 is a single host.',
    },
    { id: 'subnetting-ipv6', title: '2. Subnetting and IPv6',
      content: `## 2.1 Subnetting Example

192.168.1.0/24 divided into 4 subnets (borrow 2 bits -> /26):

| Subnet | Network | Range | Broadcast |
|---|---|---|---|
| 1 | 192.168.1.0/26 | .1-.62 | .63 |
| 2 | 192.168.1.64/26 | .65-.126 | .127 |
| 3 | 192.168.1.128/26 | .129-.190 | .191 |
| 4 | 192.168.1.192/26 | .193-.254 | .255 |

Each: 2^6 - 2 = **62 usable hosts**.

**Subnets created = 2^(bits borrowed)**
**Hosts per subnet = 2^(remaining host bits) - 2**

## 2.2 Supernetting

Combine contiguous networks: 192.168.0.0/24 + 192.168.1.0/24 = **192.168.0.0/23** (510 hosts).

## 2.3 IPv6

- **128-bit** addresses in hex: 2001:0db8::1
- 2^128 = 3.4 x 10^38 addresses
- No broadcast (uses multicast/anycast), no NAT needed`,
      examTip: 'Subnets = 2^(bits borrowed). Hosts/subnet = 2^(remaining) - 2. Memorize powers of 2 up to 2^10 = 1024.',
    },
    { id: 'subnet-worked', title: '3. Subnetting Worked Examples',
      content: `## 3.1 Create 4 Subnets from 192.168.10.0/24

**Borrow 2 bits** from host portion: /24 -> **/26** (2^2 = 4 subnets).

Block size = 2^(32-26) = 2^6 = **64 addresses per subnet**.

| Subnet | Network Address | Usable Range | Broadcast | Hosts |
|---|---|---|---|---|
| 1 | 192.168.10.0/26 | .1 - .62 | .63 | 62 |
| 2 | 192.168.10.64/26 | .65 - .126 | .127 | 62 |
| 3 | 192.168.10.128/26 | .129 - .190 | .191 | 62 |
| 4 | 192.168.10.192/26 | .193 - .254 | .255 | 62 |

**Verification**: 4 subnets * 62 hosts = 248 usable (vs 254 in original /24 — lost 6 to extra network/broadcast addresses).

## 3.2 Find Network, Broadcast, and Usable Range

**Given**: Host IP = 192.168.10.147/26

**Step 1**: Block size = 64. Which block contains .147?
- 0, 64, 128, 192 -> **.147 falls in the 128 block** (128 <= 147 < 192)

**Step 2**:
- Network: **192.168.10.128/26**
- Broadcast: 128 + 64 - 1 = **192.168.10.191**
- Usable: **192.168.10.129 - 192.168.10.190** (62 hosts)

## 3.3 VLSM for Departments of 100, 50, 25, 10 Hosts

**Given**: 192.168.10.0/24. Assign subnets for each department (largest first).

| Department | Hosts Needed | Prefix | Block | Network | Range |
|---|---|---|---|---|---|
| Dept A (100) | $128 = 2^7$ | **/25** | 128 | 192.168.10.0/25 | .1-.126 |
| Dept B (50) | $64 = 2^6$ | **/26** | 64 | 192.168.10.128/26 | .129-.190 |
| Dept C (25) | $32 = 2^5$ | **/27** | 32 | 192.168.10.192/27 | .193-.222 |
| Dept D (10) | $16 = 2^4$ | **/28** | 16 | 192.168.10.224/28 | .225-.238 |

**VLSM key**: allocate largest subnet first, then fill remaining space with smaller subnets. Each subnet starts at the next available address after the previous broadcast.

**Exam strategy**: For subnetting, always compute block size = 2^(host bits) first. The network address is always a multiple of the block size. Broadcast = network + block - 1. For VLSM, sort departments largest-first.`,
      examTip: 'Block size is your best friend. /26 = block of 64. To find which subnet an IP belongs to, divide the host octet by block size and round down. 147/64 = 2.29 -> subnet starts at 2*64 = 128.',
      importantNote: 'VLSM (Variable Length Subnet Masking) uses different prefix lengths per subnet. Always allocate the LARGEST subnet first to avoid fragmentation and wasted addresses.',
    },
  ],
  keyTakeaways: [
    'IPv4: 32-bit; CIDR /n = n network bits, (32-n) host bits.',
    'Usable hosts = 2^(32-n) - 2 (subtract network + broadcast).',
    'Network addr: host bits 0; broadcast: host bits 1.',
    'Subnets = 2^(bits borrowed); hosts = 2^(remaining) - 2.',
    'Private: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16.',
    'IPv6: 128 bits, hex notation; no broadcast, no NAT.',
  ],
},

fee_topologies: { topicId: 'fee_topologies', title: 'Network Topologies', domainWeight: 'Computer Networks · 3–5%',
  overview: 'Network topology describes the arrangement of devices and links. Each offers tradeoffs in cost, reliability, and scalability. Full mesh link count and topology identification are common FE exam questions.',
  sections: [
    { id: 'topo-types', title: '1. Topology Types',
      content: `## 1.1 Common Topologies

| Topology | Structure | Advantage | Disadvantage |
|---|---|---|---|
| **Star** | All to central switch | Easy mgmt, isolated faults | Central failure point |
| **Ring** | Closed loop | Deterministic (token) | Single break disrupts |
| **Bus** | Shared medium | Simple, cheap | Collisions (CSMA/CD) |
| **Mesh** | Every node to every other | Max redundancy | Expensive: **N(N-1)/2 links** |
| **Tree** | Hierarchical star-of-stars | Scalable | Root failure affects all |

## 1.2 Full Mesh Link Count

**Links = N(N-1)/2**

| N | Links |
|---|---|
| 5 | 10 |
| 10 | 45 |
| 100 | 4,950 |

## 1.3 Access Methods

- **CSMA/CD**: Ethernet bus/hub; detect collisions, retransmit
- **CSMA/CA**: WiFi; avoid collisions via RTS/CTS
- **Token passing**: token ring; deterministic, no collisions`,
      examTip: 'Full mesh = N(N-1)/2 links -- most tested topology formula. Modern networks use star + switches; full mesh only for critical backbone.',
    },
    { id: 'topo-modern', title: '2. Reliability and Modern Design',
      content: `## 2.1 Failure Impact

| Topology | Link Failure | Node Failure |
|---|---|---|
| Star | Only that node | Central = total |
| Ring | Breaks network | Breaks network |
| Mesh | Alternate paths | Reroute around |

## 2.2 Redundancy Techniques

- **Dual ring**: counter-rotating backup (SONET)
- **Partial mesh**: selected redundant links (cost vs. reliability)
- **STP (Spanning Tree Protocol)**: prevents loops in switched Ethernet
- **Link aggregation**: bond multiple links for BW and redundancy

## 2.3 Modern Three-Tier Architecture

1. **Core**: high-speed backbone (mesh/partial mesh)
2. **Distribution**: policy, inter-VLAN routing (partial mesh)
3. **Access**: end-user connections (star with switches)`,
      examTip: 'Most common modern topology: star at access layer with switches. Pure ring and bus are largely obsolete for wired LANs.',
    },
    { id: 'topo-exam', title: '3. Topology Comparison & Design',
      content: `## 3.1 Calculate Links for Full Mesh of 8 Nodes

**Formula**: Links = N(N-1)/2

For N = 8: Links = 8 * 7 / 2 = **28 links**

| Nodes (N) | Full Mesh Links | Star Links | Ratio |
|---|---|---|---|
| 4 | 6 | 3 | 2x |
| 8 | **28** | 7 | 4x |
| 16 | 120 | 15 | 8x |
| 32 | 496 | 31 | 16x |

Full mesh grows as **$O(N^2)$** while star grows as **O(N)**. This is why full mesh is impractical beyond ~10 nodes in practice.

## 3.2 Star vs Mesh Reliability Comparison

**Scenario**: Compare reliability for a 6-node network.

| Failure Type | Star | Full Mesh | Ring |
|---|---|---|---|
| Single link failure | 1 node isolated | All nodes still connected | Network broken |
| Central node failure | **Total failure** | N/A (no central) | N/A |
| Any single node failure | Others unaffected | Others fully connected | Network broken |
| Links needed | 5 | 15 | 6 |

**Reliability ranking**: Full mesh > Partial mesh > Star (with redundant switch) > Ring > Bus

**Cost ranking** (inverse): Bus < Ring < Star < Partial mesh < Full mesh

## 3.3 Bus Collision Domain Analysis

**Bus topology** (shared medium with CSMA/CD):

- All N nodes share **one collision domain**
- Maximum throughput degrades with more nodes
- At high load: **efficiency ≈ 1 / (1 + 5a)** where a = propagation/transmission delay ratio

**Switched star eliminates collisions**: each switch port is its own collision domain.

| Topology | Collision Domains | Broadcast Domains |
|---|---|---|
| Hub (bus) | **1** (all share) | 1 |
| Switch (star) | **N** (one per port) | 1 |
| Router | N | **N** (one per interface) |

**Exam strategy**: Full mesh links = N(N-1)/2 — this is the most tested topology formula. For design questions, star is almost always the right choice for access layer. Use partial mesh only for backbone redundancy where the link count is manageable.`,
      examTip: 'Hub = 1 collision domain (all share). Switch = N collision domains (one per port). Router = N broadcast domains. This distinction appears on nearly every FE networking section.',
      importantNote: 'A switch does NOT reduce broadcast domains — all ports still receive broadcasts. Only a router (or VLAN) creates separate broadcast domains.',
    },
  ],
  keyTakeaways: [
    'Star: easy management, central failure point. Ring: deterministic but fragile.',
    'Full mesh: N(N-1)/2 links; grows O(N^2) -- impractical for large N.',
    'CSMA/CD for Ethernet, CSMA/CA for WiFi, token passing for token ring.',
    'Modern networks: star at access, partial mesh at core.',
    'STP prevents loops; link aggregation increases bandwidth and redundancy.',
  ],
},

fee_net_security: { topicId: 'fee_net_security', title: 'Network Security', domainWeight: 'Computer Networks · 3–5%',
  overview: 'Network security protects confidentiality, integrity, and availability through encryption, firewalls, and VPNs. Understanding symmetric vs. asymmetric encryption, digital signatures, and defense-in-depth is essential for the FE exam.',
  sections: [
    { id: 'netsec-crypto', title: '1. Encryption and Digital Signatures',
      content: `## 1.1 Symmetric Encryption

Same key for encrypt/decrypt:

| Algorithm | Key Size | Status |
|---|---|---|
| **AES** | $128/192/256$ | Current standard |
| **DES** | 56 | Obsolete |
| **3DES** | 168 | Legacy |

Fast but has **key distribution problem**.

## 1.2 Asymmetric Encryption (Public Key)

Key pair: public (shared) + private (secret):

| Algorithm | Use |
|---|---|
| **RSA** | Key exchange, signatures |
| **ECC** | Same security, shorter keys |
| **Diffie-Hellman** | Key exchange only |

## 1.3 Hash Functions

**SHA-256**: one-way, collision-resistant, fixed output. Used for integrity and signatures.

## 1.4 Digital Signatures

1. Sender hashes message -> digest
2. Sender encrypts digest with **private key**
3. Receiver decrypts with **public key**, compares to own hash

Provides: **authentication + integrity + non-repudiation**.`,
      examTip: 'Symmetric = fast (AES). Asymmetric = solves key distribution (RSA). Practice: asymmetric exchanges symmetric session key, then symmetric handles bulk data (TLS/HTTPS).',
      importantNote: 'Digital signatures: PRIVATE key to sign, PUBLIC key to verify. This is backwards from encryption. Mixing them up is a common exam error.',
    },
    { id: 'netsec-fw-vpn', title: '2. Firewalls, VPNs, Defense in Depth',
      content: `## 2.1 Firewall Types

| Type | Layer | Security |
|---|---|---|
| **Packet filter** | L3-L4 | Basic |
| **Stateful** | L3-L4 | Moderate |
| **Proxy / App** | L7 | High |
| **NGFW** | L3-L7 | Highest |

## 2.2 VPN

Encrypted tunnel over public network:

| Protocol | Layer |
|---|---|
| **IPSec** | L3 (transport + tunnel modes) |
| **TLS/SSL** | L4 |

IPSec tunnel mode encrypts entire packet; transport mode encrypts payload only.

## 2.3 Defense in Depth

Multiple layers: physical -> network (firewall, IDS) -> host (patches) -> application (auth) -> data (encryption).

### CIA Triad

- **Confidentiality**: prevent disclosure (encryption)
- **Integrity**: prevent modification (hashing, signatures)
- **Availability**: ensure access (redundancy, DDoS protection)`,
      examTip: 'Defense in depth = multiple layers, never a single tool. CIA triad (Confidentiality, Integrity, Availability) is the framework for evaluating security.',
    },
    { id: 'netsec-exam', title: '3. Security Scenario Analysis',
      content: `## 3.1 Identify the Attack Type

**Match each description to the correct attack:**

| Scenario | Attack | Layer | Defense |
|---|---|---|---|
| Attacker sends fake ARP replies mapping gateway IP to attacker MAC | **ARP Spoofing** | L2 | Dynamic ARP inspection, static ARP |
| Attacker intercepts traffic between client and server by sitting in the middle | **Man-in-the-Middle (MITM)** | L3-L7 | TLS/SSL, certificate pinning |
| Thousands of compromised hosts flood target server | **DDoS** | L3-L4 | Rate limiting, CDN, scrubbing |
| Attacker crafts packets with spoofed source IP | **IP Spoofing** | L3 | Ingress filtering (BCP38) |
| Malicious SQL in web form input | **SQL Injection** | L7 | Input validation, parameterized queries |

## 3.2 Choose Encryption for the Scenario

| Scenario | Best Choice | Rationale |
|---|---|---|
| Encrypt 10 GB file transfer | **AES-256** (symmetric) | Fast bulk encryption |
| Exchange keys over untrusted channel | **RSA / Diffie-Hellman** (asymmetric) | Key distribution problem |
| Verify file integrity | **SHA-256** (hash) | One-way, collision-resistant |
| Prove sender identity | **Digital signature** (RSA + SHA) | Non-repudiation |
| Secure web browsing | **TLS** (asymmetric + symmetric) | RSA for key exchange, AES for data |

**TLS combines both**: asymmetric (RSA/ECDH) for key exchange, then symmetric (AES) for bulk data. This is the most efficient approach.

## 3.3 VPN Tunnel Design

**IPSec Modes**:

| Mode | Encrypts | Use Case |
|---|---|---|
| **Transport** | Payload only | Host-to-host |
| **Tunnel** | Entire original packet | Site-to-site (gateway) |

**Design example**: Connect two offices (10.1.0.0/16 and 10.2.0.0/16) over public internet.
- Use **IPSec tunnel mode** between gateway routers
- ESP (Encapsulating Security Payload) provides confidentiality + integrity
- AH (Authentication Header) provides integrity only (no encryption)

**Exam strategy**: For "which attack?" questions, focus on what is being manipulated — MAC addresses (ARP spoofing), IP addresses (IP spoofing), or application data (SQL injection). For encryption, symmetric = fast bulk data, asymmetric = key exchange, hash = integrity.`,
      examTip: 'ARP spoofing = L2 attack (MAC). MITM = interception. DDoS = availability attack. Always map the attack to the CIA triad property it violates: spoofing violates integrity, DDoS violates availability.',
      importantNote: 'IPSec tunnel mode is required for site-to-site VPNs because it encrypts the entire original IP header. Transport mode only works host-to-host since the original header remains visible.',
    },
  ],
  keyTakeaways: [
    'Symmetric (AES): fast, shared key. Asymmetric (RSA): public/private pair, solves key distribution.',
    'Hash (SHA-256): one-way, integrity. Digital signature: private signs, public verifies.',
    'Firewall: packet filter < stateful < proxy < NGFW.',
    'VPN: encrypted tunnel; IPSec (L3) or TLS (L4).',
    'Defense in depth: multiple layers. CIA: confidentiality, integrity, availability.',
  ],
},

fee_net_perf: { topicId: 'fee_net_perf', title: 'Network Performance', domainWeight: 'Computer Networks · 3–5%',
  overview: 'Network performance is characterized by bandwidth, throughput, latency, jitter, and packet loss. Understanding delay components, bottleneck analysis, and QoS principles is critical for the FE exam.',
  sections: [
    { id: 'netperf-delay', title: '1. Delay Components and Throughput',
      content: `## 1.1 End-to-End Delay

**Total delay = d_prop + d_trans + d_queue + d_proc**

| Component | Formula | Depends On |
|---|---|---|
| **Propagation** | **d_prop = distance / speed** | Medium (~2/3 c for fiber) |
| **Transmission** | **d_trans = packet_size / bandwidth** | Link speed, packet size |
| **Queuing** | Variable | Traffic load |
| **Processing** | Small | Router speed |

### Example

1000-byte packet, 100 Mbps link, 200 km fiber:
- d_trans = 8000 / 10^8 = 80 us
- d_prop = 200000 / (2*10^8) = 1 ms
- Total ~ 1.08 ms

## 1.2 Bandwidth vs. Throughput

- **Bandwidth**: max capacity (theoretical)
- **Throughput**: actual rate achieved (<= bandwidth)
- **Bottleneck**: slowest link determines throughput

## 1.3 Bandwidth-Delay Product

**BDP = bandwidth * RTT** (bits in flight)

Determines optimal TCP window size for full utilization.`,
      examTip: 'Transmission delay = packet_size/bandwidth (push bits onto wire). Propagation delay = distance/speed (bit travels). These are DIFFERENT. Transmission dominates on slow links; propagation on long links.',
      importantNote: 'RTT = 2 * one-way delay (approx). For TCP, RTT determines ACK speed and throughput.',
    },
    { id: 'netperf-qos', title: '2. QoS, Jitter, Bottleneck Analysis',
      content: `## 2.1 QoS

| Traffic | Sensitivity | Priority |
|---|---|---|
| **Voice** | Latency < 150 ms, jitter < 30 ms | Highest |
| **Video** | Latency < 300 ms | High |
| **Web** | Tolerates latency | Medium |
| **Files** | Needs throughput | Low |

Techniques: priority queuing, weighted fair queuing, traffic shaping.

## 2.2 Jitter

**Jitter = variation in packet delay.** Caused by variable queuing.

- Critical for voice/video (choppy audio)
- High jitter often WORSE than high latency
- **Jitter buffer** smooths variations

## 2.3 Bottleneck

Slowest link = max throughput. For 1G -> 100M -> 1G: throughput = 100 Mbps.

**Utilization** = throughput/bandwidth. At > 80%, queuing delays spike exponentially.`,
      examTip: 'Bottleneck = slowest link. For voice/video, jitter matters more than absolute latency. Consistent 200 ms > varying 50-300 ms.',
    },
    { id: 'netperf-exam', title: '3. Network Performance Calculations',
      content: `## 3.1 Total Latency: 1500-Byte Packet Over 100 Mbps Link + 200 km Fiber

**Given**: Packet size = 1500 bytes, link rate = 100 Mbps, distance = 200 km, fiber speed = 2 x 10^8 m/s.

**Step 1 — Transmission delay** (push packet onto wire):
d_trans = packet_size / bandwidth = (1500 * 8) / (100 * 10^6) = 12000 / 10^8 = **0.12 ms**

**Step 2 — Propagation delay** (signal traverses fiber):
d_prop = distance / speed = 200,000 / (2 * 10^8) = **1.0 ms**

**Step 3 — Total** (ignoring queuing and processing):
$$d_{total} = 0.12 + 1.0 = 1.12\\ \\mathrm{ms}$$

Propagation dominates here (89%). On a 1 Gbps link, d_trans drops to 0.012 ms and propagation dominates even more.

## 3.2 Bandwidth-Delay Product

**BDP = bandwidth * RTT**

For 1 Gbps link with RTT = 20 ms:
BDP = 10^9 * 0.020 = **20 Mbit = 2.5 MB**

This means **2.5 MB of data is "in flight"** at any instant. The TCP window must be at least this large to fully utilize the link.

| Link | RTT | BDP | Required TCP Window |
|---|---|---|---|
| 100 Mbps, 2 ms | 2 ms | 200 kbit = 25 KB | 25 KB |
| 1 Gbps, 20 ms | 20 ms | 20 Mbit = **2.5 MB** | 2.5 MB |
| 10 Gbps, 100 ms | 100 ms | 1 Gbit = 125 MB | 125 MB |

## 3.3 TCP Window Sizing

**Throughput = Window_size / RTT** (simplified, no loss)

**Problem**: TCP window = 64 KB (default), RTT = 50 ms. What is max throughput?

Throughput = 65536 * 8 / 0.050 = 524288 / 0.050 = **10.49 Mbps**

Even on a 1 Gbps link, a 64 KB window limits throughput to ~10 Mbps with 50 ms RTT. **Window scaling** (RFC 1323) extends the window to 1 GB to solve this.

**Exam strategy**: Separate transmission delay (packet_size/BW) from propagation delay (distance/speed). They are fundamentally different. BDP = BW * RTT gives the pipe capacity. If TCP window < BDP, the link is underutilized.`,
      examTip: 'Transmission delay depends on packet size and link speed. Propagation delay depends on distance and medium speed. Do NOT mix them up — this is the #1 tested distinction in network performance.',
      importantNote: 'RTT = 2 * one-way propagation delay (approximately). For TCP throughput, RTT determines how fast ACKs return and thus how fast the sender can advance its window.',
    },
  ],
  keyTakeaways: [
    'Total delay = propagation + transmission + queuing + processing.',
    'Transmission = packet_size/BW; propagation = distance/speed.',
    'Throughput limited by bottleneck (slowest) link.',
    'BDP = bandwidth * RTT; determines TCP window size.',
    'Jitter (delay variation) critical for real-time; worse than consistent high latency.',
    'QoS prioritizes voice/video; utilization > 80% causes exponential queuing.',
  ],
},

  /* ══════════════════════════════════════════════════════════════════
   * TOPIC 15 — DIGITAL SYSTEMS  (5 curriculum IDs)  ·  7–11 %
   * ══════════════════════════════════════════════════════════════════ */

};
