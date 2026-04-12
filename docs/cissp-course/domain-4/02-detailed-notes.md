# Domain 4 — Communication and Network Security: Detailed Notes

> **AI-generated study material.** Aligned to the (ISC)² CISSP Exam
> Outline effective April 15, 2024. Domain weight: **13%**. Requires
> human SME review before publication.

---

## 1. Domain Overview

Domain 4 covers secure network architecture and design, secure
protocols, network components and their vulnerabilities, secure
communication channels, and network-based attacks and defenses. On
the current exam, Domain 4 is about 13% of questions — roughly 20
items on a 150-question form. The domain is technically dense but
the exam's framing is still manager-mindset: pick the architecture
that reflects defense in depth, pick the protocol that matches the
threat model, pick the control that addresses the actual risk.

### Key themes

1. **Segment first.** Network segmentation is the foundational
   security control. A flat network is a single compromise away
   from a catastrophic breach.
2. **Standardized protocols only.** The exam uniformly rewards
   standardized, peer-reviewed, widely-implemented protocols and
   punishes custom or proprietary designs.
3. **Layered defense across OSI.** Different threats live at
   different layers; controls must be deployed at the layer where
   the threat operates and at layers below it.
4. **Encrypt in transit, always.** Modern designs encrypt
   everything in transit, including intra-data-center traffic.
5. **Monitor for what you cannot prevent.** Detection and response
   are peer disciplines to prevention; no perimeter control is
   sufficient alone.

### Manager-mindset traps

| Trap | Engineer thinks | Manager thinks |
|---|---|---|
| "Put up a firewall" | Yes, done | Segment, label zones, apply firewalls between zones, log and alert |
| "VPN is secure" | It's encrypted | Authenticate endpoints, enforce posture, log traffic, monitor for misuse |
| "TLS is sufficient" | Data is encrypted | TLS covers in-transit only; terminate points are trust boundaries |
| "Our network is internal" | Trusted | In zero trust, nothing is trusted by location |
| "We block at the firewall" | Done | Log blocks; investigate patterns; tune rules over time |

---

## 2. Sub-objectives

Domain 4 sub-objectives (verify against current outline):

- **4.1** Assess and implement secure design principles in network
  architectures (OSI, TCP/IP, IPsec, IPv4/IPv6, protocols, routing)
- **4.2** Secure network components (operation of hardware,
  transmission media, NAC, endpoint security, content-distribution
  networks)
- **4.3** Implement secure communication channels according to design
  (voice, multimedia collaboration, remote access, data
  communications, virtualized networks, third-party connectivity)

---

## 3. Sub-objective 4.1 — Secure network design

### 3.a Conceptual

The **OSI reference model** has 7 layers (Physical, Data Link,
Network, Transport, Session, Presentation, Application). The
**TCP/IP model** has 4 (Link, Internet, Transport, Application).
Threats and controls map to specific layers:

| Layer | Examples | Threats | Controls |
|---|---|---|---|
| L1 Physical | cable, radio, optical | tapping, emanations | shielding, conduit, TEMPEST |
| L2 Data Link | Ethernet, ARP, MAC | ARP poisoning, VLAN hopping, MAC flood | port security, DAI, 802.1X, DHCP snooping |
| L3 Network | IP, ICMP, IPsec | spoofing, routing attacks, IP fragmentation | ACLs, uRPF, IPsec, ingress/egress filtering |
| L4 Transport | TCP, UDP, QUIC | SYN flood, session hijacking | SYN cookies, stateful firewalls |
| L5 Session | RPC, NetBIOS | session fixation | modern session tokens |
| L6 Presentation | TLS (often mapped here) | downgrade, cipher negotiation | TLS 1.3, strict config |
| L7 Application | HTTP, DNS, SMTP, LDAP | injection, XSS, SSRF | WAF, input validation, DNSSEC |

**TCP/IP** is what runs on the wire; OSI is the teaching model. The
exam references both.

**IPv6** is structurally different from IPv4: 128-bit addresses, no
broadcast (multicast instead), mandatory ICMPv6, built-in IPsec
capability (not always enabled), SLAAC for address auto-config.
IPv6 brings its own attack surface: rogue RA, SLAAC abuse,
transition mechanisms (6to4, Teredo) that can tunnel unexpected
traffic.

**Routing.** Static, RIP, OSPF, BGP, EIGRP. BGP is the internet's
routing protocol and is historically insecure — BGP hijacks
(intentional or accidental) have redirected global traffic. RPKI
(Resource Public Key Infrastructure) provides route origin
validation; BGPSEC adds path validation. Both rollout is
incomplete.

### 3.b Technical deep-dive

**Segmentation** is implemented at multiple levels:

- **Physical** — air gaps, separate cable plants.
- **VLAN** (L2) — logical segments sharing physical hardware.
- **Subnet** (L3) — separate IP ranges with routed separation.
- **VRF** — virtual routing and forwarding tables for carrier-grade
  separation.
- **Micro-segmentation** — per-workload policy enforcement, often
  implemented via host agents, service mesh, or cloud security
  groups.

**Micro-segmentation** is the modern high-assurance pattern: policy
enforcement at the workload boundary, default-deny, identity-aware.
NIST SP 800-207 zero trust draws heavily on it.

**NAC (Network Access Control)** authenticates devices before
granting network access, typically using 802.1X, and enforces
posture (antivirus, patching level, encryption state) before
admitting.

### 3.c Frameworks

- NIST SP 800-41 (firewalls), 800-46 (remote access), 800-77 (IPsec),
  800-97 (802.11i), 800-113 (SSL VPN), 800-125 (virtualization),
  800-207 (zero trust), 800-215 (secure TCP/IP).
- CIS Controls v8 categories for network monitoring, access control,
  and secure configuration.
- ISO/IEC 27033 series on network security.

### 3.d Misconceptions

- "VLANs are security boundaries." Weakly — VLAN hopping is real
  (double tagging, switch spoofing). For strong isolation, use
  separate physical networks or properly-configured VRFs.
- "The OSI model is obsolete." It is still the teaching framework
  and the CISSP exam's vocabulary; learn it even if the wire runs
  TCP/IP.

### 3.e Exam nuance

The exam loves threats mapped to layers. Memorize:

- ARP attacks → L2
- IP spoofing → L3
- SYN flood → L4
- DNS poisoning → L7 (or L3 conceptually)
- SSL strip → L7 / L6

When a scenario asks "at which layer does this attack operate", pick
the layer where the protocol lives, not the application layer above
it.

### 3.f Case studies

1. **ARP cache poisoning in corporate networks (ongoing).** MITM
   attacks at L2 that bypass L3/L4 defenses. Mitigation: Dynamic
   ARP Inspection, 802.1X.
2. **Pakistan YouTube BGP hijack (2008).** Pakistan Telecom's BGP
   announcement propagated globally, taking YouTube offline. Lesson:
   BGP trust was (and largely remains) unauthenticated.
3. **Spamhaus DDoS (2013).** 300 Gbps DDoS via DNS amplification.
   Lesson: reflection attacks exploit misconfigured services.

### 3.g Mnemonics

- **OSI layers (top down): "All People Seem To Need Data Processing"**
- **OSI (bottom up): "Please Do Not Throw Sausage Pizza Away"**
- **TCP/IP: Link, Internet, Transport, Application**

### 3.h Cross-refs

- Domain 3 — cryptographic protocols run at L6/L7.
- Domain 5 — 802.1X ties to IAM.
- Domain 7 — network monitoring feeds detection.

---

## 4. Sub-objective 4.2 — Secure network components

### 4.a Conceptual

Network components the exam tests:

- **Firewalls** — L3/L4 stateless (packet filter), L3/L4 stateful,
  L7 application-layer (proxy, next-gen), web application firewall
  (WAF). Next-generation firewalls (NGFW) combine stateful with
  application awareness and often IDS/IPS.
- **IDS/IPS** — intrusion detection vs prevention; signature-based
  vs anomaly-based vs heuristic; network (NIDS/NIPS) vs host
  (HIDS/HIPS).
- **Proxies and reverse proxies** — forward proxies for user
  traffic; reverse proxies for server-side load balancing and
  protection.
- **Load balancers** — L4 (TCP/UDP) vs L7 (HTTP); TLS termination
  implications.
- **VPN concentrators** — IPsec or SSL VPN endpoints.
- **Switches, routers, hubs, bridges** — L2/L3 infrastructure.
- **Transmission media** — copper (UTP, STP, coax), fiber (SMF, MMF),
  wireless. Fiber is harder to tap and not subject to EMI;
  unshielded copper is vulnerable to emanations.
- **Endpoint security** — EDR, antivirus, host firewall.
- **CDN** — content distribution for performance and DDoS mitigation.
- **NAC** — network access control.

### 4.b Technical deep-dive

**Firewall types in depth:**

- **Packet filter (stateless)** — simplest, checks each packet
  against ACL. Fast but cannot track connection state.
- **Stateful** — tracks connection state so return traffic for
  established connections is allowed automatically.
- **Proxy (application-layer)** — terminates the connection,
  inspects content, forwards to destination. Can filter based on
  application semantics.
- **Next-gen (NGFW)** — stateful + application awareness + often
  integrated IDS/IPS + threat intelligence feeds.
- **WAF** — specifically for HTTP; understands HTTP semantics,
  blocks injection/XSS/SSRF.
- **Host-based** — runs on the endpoint, restricts inbound and
  outbound.

**IDS/IPS detection methods:**

- **Signature-based** — matches known attack patterns; fast and
  accurate on known attacks; misses novel attacks.
- **Anomaly-based** — baselines normal behavior and alerts on
  deviation; catches novel attacks but prone to false positives.
- **Heuristic** — combines rules and statistical methods.
- **ML-based** — modern variant; requires training data and
  careful tuning.

**Proxies vs reverse proxies:**

- **Forward proxy**: sits between users and internet; provides
  filtering, caching, anonymization. User traffic is proxied out.
- **Reverse proxy**: sits in front of servers; provides load
  balancing, TLS termination, WAF, caching. Clients talk to the
  reverse proxy as if it were the server.

### 4.c Frameworks

- CSA CCM v4 for cloud network components.
- NIST SP 800-41 (firewalls), 800-94 (IDS/IPS).

### 4.d Misconceptions

- "IDS and IPS are the same." IDS detects; IPS detects AND blocks.
  IPS is inline; IDS is typically out-of-band.
- "Signature-based IDS catches everything." Only catches what is
  in the signature database.

### 4.e Exam nuance

When the exam asks which firewall type to pick, match the
requirement:

- L3/L4 filtering → stateful firewall
- Application content inspection → proxy or NGFW
- Web application protection → WAF
- High-performance with basic rules → stateless packet filter

### 4.f Case studies

1. **Target (2013).** Flat network let HVAC credentials reach POS.
2. **Equifax (2017).** Network segmentation failure compounded an
   Apache Struts vulnerability.
3. **MOVEit (2023).** Internet-facing file transfer service with
   SQL injection, compromised 2000+ organizations.

### 4.g Mnemonics

- **Stateful vs Stateless: "State tracks the conversation, stateless tracks the packet."**

### 4.h Cross-refs

- Domain 3 — secure design principles applied to network components.
- Domain 7 — monitoring feeds SIEM from network controls.

---

## 5. Sub-objective 4.3 — Secure communication channels

### 5.a Conceptual

The exam tests several major channel types:

**Voice:** VoIP protocols (SIP, H.323, RTP), SRTP for media
encryption, signaling vulnerabilities (SIP registration flooding,
toll fraud).

**Multimedia/collaboration:** Zoom, Teams, Meet, WebRTC. End-to-end
encryption in some (Signal, WhatsApp, iMessage Core) vs server-
side encryption in others.

**Remote access:** SSH, RDP, VPN, jump hosts, bastion hosts, ZTNA.

**Data communications:** TLS, IPsec, SSH, mTLS in service meshes.

**Virtualized networks:** SDN, overlay networks, VXLAN, service
mesh (Istio, Linkerd), network policies.

**Third-party connectivity:** B2B VPNs, dedicated links (MPLS,
direct connect, ExpressRoute), API gateways.

### 5.b Protocols deep-dive

**TLS 1.3** (RFC 8446):

- Mandatory forward secrecy (ECDHE or DHE only).
- Removed static RSA key exchange, CBC-mode ciphers, compression,
  and legacy hash algorithms.
- Reduced handshake to 1-RTT (or 0-RTT for resumed sessions, with
  caveats).
- AEAD-only cipher suites (AES-GCM, ChaCha20-Poly1305, AES-CCM).

**IPsec** (RFC 4301+):

- Two protocols: **AH** (Authentication Header, integrity only)
  and **ESP** (Encapsulating Security Payload, confidentiality
  and/or integrity).
- Two modes: **Transport** (protects payload, keeps original IP
  header) and **Tunnel** (protects entire original packet,
  encapsulates in new IP header). Tunnel mode is used for
  site-to-site VPNs; transport mode for host-to-host.
- IKE (Internet Key Exchange) for key management; IKEv2 is current.
- Common in site-to-site VPNs and some remote-access scenarios.

**SSH** (RFC 4251+):

- Secure shell for administrative access and file transfer.
- Host key verification, user auth (password, public key, certificate).
- SSH tunneling (port forwarding, SOCKS proxy).
- Common weakness: weak host key policies, default users with keys.

**DNSSEC:** signs DNS records with a chain of trust rooted in the
root zone. Prevents DNS cache poisoning and spoofing but does not
provide confidentiality (that's DoT/DoH).

**DoH / DoT (DNS over HTTPS / DNS over TLS):** encrypts DNS
queries. DoT uses port 853; DoH uses port 443 (indistinguishable
from web traffic).

**S/MIME, PGP/OpenPGP:** email signing and encryption. S/MIME is
X.509-based; PGP uses web-of-trust.

**WPA3:** Current wireless standard. Replaces pre-shared key with
SAE (Simultaneous Authentication of Equals), which is resistant
to offline dictionary attacks. Also provides forward secrecy and
opportunistic encryption (OWE) for open networks.

**802.1X:** Port-based network access control. Supplicant
(client), authenticator (switch or AP), authentication server
(RADIUS). EAP methods: EAP-TLS (certificate-based), PEAP, EAP-TTLS.

### 5.c VPN topologies

- **Site-to-site VPN:** two networks connected as if adjacent.
  Typically IPsec tunnel mode with pre-shared keys or certificates.
- **Remote-access VPN:** individual users connecting to a corporate
  network. IPsec or SSL VPN.
- **SSL VPN:** browser-based or client-based, typically over 443.
  Won market share for remote access because of firewall
  friendliness.
- **WireGuard:** modern, minimal, fast VPN. Single cipher suite,
  cryptographic key identities.
- **ZTNA (Zero Trust Network Access):** per-application tunneling
  instead of full-network VPN. Aligns with zero trust.

### 5.d Wireless security

- **WEP** — broken for decades.
- **WPA/WPA2** — TKIP/AES; WPA2-PSK vulnerable to offline
  dictionary attacks after handshake capture; KRACK attack (2017)
  broke WPA2 handshake.
- **WPA3** — SAE replaces PSK, forward secrecy, OWE for open
  networks.
- **WPA3-Enterprise** — 192-bit mode for highest assurance.

### 5.e Network attacks

- **Sniffing** — passive capture of unencrypted traffic.
- **ARP poisoning** — L2 spoofing redirecting traffic through
  attacker.
- **DNS poisoning / cache poisoning** — insert false records in
  a resolver's cache.
- **DNS hijacking** — compromise DNS authoritative service or
  registrar.
- **Session hijacking** — steal or guess session tokens; defense
  is strong random tokens, binding to properties, TLS.
- **MITM** — attacker between two endpoints; defense is authenticated
  key exchange (TLS, SSH).
- **Replay** — resending captured messages; defense is nonces and
  timestamps.
- **SYN flood** — half-open TCP connections exhaust server state;
  defense is SYN cookies.
- **Amplification / reflection** (DNS, NTP, memcached) — attacker
  spoofs source, protocol responds to victim with larger reply.
- **DDoS** — volumetric (bandwidth), protocol (SYN flood),
  application-layer (slow loris, HTTP GET floods).
- **Rogue AP / Evil twin** — attacker-controlled wireless AP
  mimicking legitimate.
- **Karma attack** — rogue AP responds to probe requests with any
  SSID, tricking clients into connecting.
- **VLAN hopping** — escaping a VLAN via double tagging or switch
  spoofing.
- **IP spoofing** — forging source IP.
- **Port scanning** — reconnaissance.

### 5.f Exam nuance

Memorize the attack-layer mapping above. Memorize the difference
between tunnel and transport IPsec modes. Memorize that TLS 1.3
mandates forward secrecy.

### 5.g Case studies

1. **KRACK (2017).** Key Reinstallation Attack against WPA2's
   four-way handshake, forcing nonce reuse and enabling decryption.
2. **DNS poisoning campaigns (ongoing).** Registrar and DNS
   infrastructure attacks in 2019 affected multiple organizations.
3. **Mirai botnet (2016).** Used default-credentialed IoT devices
   to launch record-breaking DDoS against Dyn, Krebs, OVH.
4. **Colonial Pipeline (2021).** Compromised VPN credential
   without MFA; enabled ransomware operation.

### 5.h Mnemonics

- **"AH authenticates; ESP encrypts (and can authenticate)."**
- **"Tunnel encapsulates; Transport decorates."**
- **"WPA3 SAE = Simultaneous Authentication of Equals."**

### 5.i Cross-refs

- Domain 3 — crypto primitives behind these protocols.
- Domain 5 — 802.1X as IAM integration.
- Domain 7 — network monitoring generates alerts on these attacks.

---

## 6. Cheat sheet

- **OSI mnemonic (top down): All People Seem To Need Data Processing**
- **TCP/IP: Link / Internet / Transport / Application**
- **Attack→Layer: ARP=L2, IP spoof=L3, SYN flood=L4, DNS=L7**
- **TLS 1.3: forward secrecy mandatory, AEAD-only, 1-RTT handshake**
- **IPsec: AH authenticates, ESP encrypts; Tunnel vs Transport**
- **WPA3 SAE replaces WPA2 PSK; resistant to offline dictionary**
- **802.1X: supplicant, authenticator, RADIUS; EAP-TLS strongest**
- **VPN types: site-to-site (IPsec tunnel), remote (SSL VPN), modern (WireGuard, ZTNA)**
- **Segment first; encrypt by default; monitor always**
- **NGFW > stateful > stateless; WAF for HTTP; proxy for content inspection**

## 7. Glossary (condensed)

| Term | Meaning |
|---|---|
| AH / ESP | IPsec protocols for authentication / encryption |
| ARP poisoning | L2 MITM attack |
| BGP | Internet routing protocol, historically unauthenticated |
| CDN | Content Delivery Network |
| DNSSEC | DNS signing for integrity |
| DoH / DoT | DNS over HTTPS / DNS over TLS |
| EAP-TLS | Certificate-based 802.1X method |
| IDS / IPS | Intrusion Detection / Prevention System |
| Micro-segmentation | Per-workload policy enforcement |
| NAC | Network Access Control |
| NGFW | Next-Generation Firewall |
| OSI | Open Systems Interconnection model (7 layers) |
| RPKI | Resource Public Key Infrastructure (BGP origin validation) |
| SAE | Simultaneous Authentication of Equals (WPA3) |
| SASE / SSE | Secure Access Service Edge / Security Service Edge |
| Site-to-site VPN | Network-level tunnel between sites |
| SSL VPN | Browser/client VPN over TLS |
| Tunnel mode | IPsec mode encapsulating full IP packet |
| WAF | Web Application Firewall |
| WireGuard | Modern minimal VPN protocol |
| WPA3 | Current Wi-Fi security standard |
| ZTNA | Zero Trust Network Access |

## 8. Further reading

- NIST SP 800-41, 800-46, 800-47, 800-77, 800-94, 800-97, 800-113,
  800-125, 800-207, 800-215
- ISO/IEC 27033 series
- RFCs: 8446 (TLS 1.3), 4301 (IPsec), 4251 (SSH), 4033-4035 (DNSSEC),
  5246 (TLS 1.2), 7540 (HTTP/2), 9293 (TCP)
- IEEE 802.11, 802.1X standards

---

## End of Domain 4 Notes
