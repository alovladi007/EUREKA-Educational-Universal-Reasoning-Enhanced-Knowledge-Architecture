# Domain 4 — Communication and Network Security: Animation Storyboards

> 12 storyboards. Narration ~150 wpm. Network protocol flows are
> highly visual and this domain is the best animation candidate.

## Index

| # | Concept | Duration | Tool |
|---|---|---|---|
| D4-01 | OSI model in 90 seconds | 90 s | AE |
| D4-02 | TCP three-way handshake and teardown | 100 s | Manim + AE |
| D4-03 | SYN flood attack and SYN cookies defense | 110 s | Manim |
| D4-04 | ARP poisoning / MITM | 120 s | AE |
| D4-05 | DNS recursive resolution + poisoning + DNSSEC | 150 s | Excalidraw + AE |
| D4-06 | TLS 1.3 handshake (1-RTT) | 130 s | Manim |
| D4-07 | IPsec tunnel vs transport mode | 115 s | AE |
| D4-08 | WPA3 SAE vs WPA2 PSK | 120 s | AE |
| D4-09 | VLAN hopping: double tagging | 90 s | AE |
| D4-10 | DDoS: volumetric, protocol, application | 130 s | AE |
| D4-11 | ZTNA vs traditional VPN | 110 s | AE |
| D4-12 | WAF, IDS, IPS — how they differ | 95 s | AE |

---

## D4-01 · OSI in 90 seconds

| # | Visual | Narration |
|---|---|---|
| 1 | A stack of 7 boxes labeled Application, Presentation, Session, Transport, Network, Data Link, Physical. | "Seven layers. Top to bottom: Application, Presentation, Session, Transport, Network, Data Link, Physical. Mnemonic: All People Seem To Need Data Processing." |
| 2 | A browser request flows down from Application to Physical on the client, across the wire, up from Physical to Application on the server. | "A web request travels down the stack on the sender, across the wire, up the stack on the receiver. Each layer adds its own header." |
| 3 | Attack icons appear at different layers: ARP at L2, IP spoof at L3, SYN flood at L4, SSL strip at L6/7. | "Attacks live at specific layers. ARP poisoning at the data link layer. IP spoofing at the network layer. SYN flood at transport. SSL strip at presentation or application." |
| 4 | Defenses appear at the same layers: port security at L2, ACLs at L3, stateful firewall at L4, WAF at L7. | "Defenses go at the same layer as the attack — or below it. Port security at L2, ACLs at L3, stateful firewalls at L4, WAF at L7." |

---

## D4-02 · TCP three-way handshake (100 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Client and server on either side. | "TCP opens with three messages. Client sends SYN." |
| 2 | SYN arrow. | "SYN: 'I want to connect, my initial sequence number is X.'" |
| 3 | SYN-ACK arrow. | "Server responds SYN-ACK: 'I'll connect, my initial sequence is Y, and I acknowledge your X+1.'" |
| 4 | ACK arrow. | "Client ACKs: 'Got your Y, here is Y+1 acknowledging.' The connection is established." |
| 5 | Teardown: FIN-ACK, FIN-ACK. | "Teardown is four messages: each side sends FIN and the other ACKs." |
| 6 | The handshake is vulnerable to SYN flood — the server allocates state on SYN and must wait for the ACK. | "The handshake has a vulnerability: the server allocates state when it receives SYN and waits for the ACK. That's what SYN flood exploits." |

---

## D4-03 · SYN Flood and SYN Cookies (110 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Attacker sends flood of SYN packets, spoofing random source IPs. | "SYN flood: attacker sends millions of SYNs with spoofed source addresses." |
| 2 | Server allocates half-open connection state for each. | "Server allocates state for each, waits for the ACK that never comes." |
| 3 | Server's connection table fills; legitimate clients can't connect. | "State table fills. Legitimate clients cannot connect. Denial of service." |
| 4 | SYN cookies: server responds without allocating state, encodes state in the sequence number. | "SYN cookies defense: server responds SYN-ACK but does not allocate state. Instead, it encodes the connection state in the initial sequence number using a cryptographic hash." |
| 5 | When real ACK arrives, server validates the cookie and allocates state only then. | "When a real ACK arrives, the server validates the cookie, recovers the state, and allocates a real connection. Attacker can't forge the cookie without observing the SYN-ACK." |

---

## D4-04 · ARP Poisoning / MITM (120 s)

| # | Visual | Narration |
|---|---|---|
| 1 | A LAN with clients, a gateway, and an attacker. ARP table of each client. | "ARP maps IP addresses to MAC addresses on a LAN. It's unauthenticated — anyone can claim any mapping." |
| 2 | Attacker sends gratuitous ARP claiming to be the gateway. | "Attacker sends unsolicited ARP: 'I am the gateway.' Clients update their ARP tables." |
| 3 | Client traffic flows through the attacker. | "Now every client's 'gateway-bound' packet flows to the attacker. Attacker forwards to the real gateway — and reads everything in between." |
| 4 | Defense: Dynamic ARP Inspection on the switch validates ARP against DHCP snooping database. | "Defense: Dynamic ARP Inspection. The switch checks every ARP against the DHCP snooping database. Unauthorized claims are dropped." |
| 5 | Additional defenses: 802.1X authenticates the device; encrypted protocols make eavesdropping useless. | "And: 802.1X authenticates the device to the network, and encrypted protocols (TLS, SSH) make L2 eavesdropping useless for payload capture." |

---

## D4-05 · DNS Resolution, Poisoning, and DNSSEC (150 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Client queries local resolver: "what is example.com?" | "Client asks the resolver: what's example.com?" |
| 2 | Resolver walks: . → com → example.com. | "Resolver walks the hierarchy: root, then .com, then example.com's authoritative server." |
| 3 | Resolver caches the result and returns it. | "Resolver caches the result so future queries are fast." |
| 4 | Cache poisoning: attacker races the resolver with a forged response. | "Cache poisoning: attacker sends a forged response before the real one arrives, claiming example.com resolves to an attacker's IP. If the resolver accepts, it caches the poison." |
| 5 | DNSSEC: every zone signs its records with a chain of trust rooted at . | "DNSSEC adds signatures. Every zone signs its records. A chain of trust rooted at the root zone lets resolvers verify authenticity." |
| 6 | Resolver checks signatures before caching; bad signatures are rejected. | "Now the resolver verifies signatures before caching. Forged responses fail verification and are dropped." |
| 7 | Caveat: DNSSEC provides integrity, not confidentiality. For privacy, use DoT or DoH. | "DNSSEC provides integrity, not privacy. For encrypted queries, use DNS over TLS or DNS over HTTPS." |

---

## D4-06 · TLS 1.3 Handshake (130 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Client initiates ClientHello with supported cipher suites, ECDHE key share, and extensions. | "TLS 1.3 client sends ClientHello. Supported cipher suites, ECDHE key share, and extensions." |
| 2 | Server responds with ServerHello, its ECDHE key share, certificate, certificate verify, and Finished. | "Server responds with ServerHello, its ECDHE key share, the server certificate, a signature proving key ownership, and Finished." |
| 3 | Client verifies certificate chain, derives shared secret from ECDHE, and sends Finished. | "Client verifies the certificate chain, computes the shared secret from ECDHE, and sends its own Finished." |
| 4 | Application data flows encrypted with AEAD. | "Application data flows immediately, encrypted with AEAD. TLS 1.3 handshake is 1-RTT instead of 2-RTT in TLS 1.2. Forward secrecy is mandatory — only ECDHE and DHE." |
| 5 | TLS 1.3 removed: static RSA key exchange, CBC mode, SHA-1, RC4, compression, renegotiation. | "TLS 1.3 also removed: static RSA key exchange, CBC mode, SHA-1, RC4, compression, and renegotiation. The result is faster and more secure than TLS 1.2." |

---

## D4-07 · IPsec Tunnel vs Transport (115 s)

| # | Visual | Narration |
|---|---|---|
| 1 | An IP packet with its header and payload. | "IPsec has two modes: transport and tunnel." |
| 2 | Transport mode: ESP inserted between IP header and payload. Original IP header is kept. | "Transport mode: ESP inserted between the IP header and the payload. The original IP header is preserved. Used for host-to-host encryption." |
| 3 | Tunnel mode: the entire original packet is encapsulated in a new IP packet with new headers. | "Tunnel mode: the entire original packet — IP header included — is encrypted and wrapped in a new IP packet with new headers. Used for site-to-site VPNs." |
| 4 | Site-to-site VPN animation: traffic from one LAN to another, encapsulated between gateways. | "A site-to-site VPN uses tunnel mode between two gateways. Internal addresses are hidden from the public internet." |
| 5 | Quick summary: Transport for host-to-host, Tunnel for site-to-site. | "Transport decorates the packet; tunnel encapsulates it. Transport for host-to-host; tunnel for site-to-site." |

---

## D4-08 · WPA3 SAE vs WPA2 PSK (120 s)

| # | Visual | Narration |
|---|---|---|
| 1 | WPA2 four-way handshake between client and AP with PSK. | "WPA2 uses Pre-Shared Key. After authentication, a four-way handshake derives session keys." |
| 2 | Attacker captures the handshake and runs offline dictionary attack. | "An attacker can capture the handshake and run an offline dictionary attack against the PSK. Weak passwords fall quickly." |
| 3 | WPA3 SAE: dragonfly key exchange, resistant to offline attacks. | "WPA3 replaces PSK with SAE — Simultaneous Authentication of Equals. Each authentication exchange is unique, dictionary attacks require one online attempt per guess, and each attempt is visible." |
| 4 | Forward secrecy and protection even if password is weak. | "SAE provides forward secrecy: past sessions cannot be decrypted even if the password is later compromised. Even weak passwords are much harder to attack." |
| 5 | WPA3-Enterprise 192-bit mode for highest assurance. | "WPA3-Enterprise adds a 192-bit security mode for highest-assurance environments with stricter crypto requirements." |

---

## D4-09 · VLAN Hopping (90 s)

| # | Visual | Narration |
|---|---|---|
| 1 | A switch with two VLANs. A client in VLAN 10. | "VLANs provide logical segmentation. A client in VLAN 10 should not reach VLAN 20." |
| 2 | Double tagging: attacker crafts a frame with two 802.1Q tags. Outer VLAN 10, inner VLAN 20. | "Double tagging: attacker crafts a frame with two VLAN tags. Outer tag 10, inner tag 20." |
| 3 | Access switch strips outer tag, trunks frame to the distribution switch, which interprets the remaining tag as VLAN 20. | "Access switch strips the outer tag. Frame reaches the distribution switch still carrying the inner tag. Distribution switch delivers it to VLAN 20. Hop complete." |
| 4 | Defense: never use the native VLAN, force trunk ports to explicit, use private VLANs where appropriate. | "Defenses: never use the native VLAN; disable auto-trunk negotiation; use private VLANs; segment with routing and firewalls rather than trusting VLAN boundaries alone." |

---

## D4-10 · DDoS: Volumetric, Protocol, Application (130 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Target website. Three types of attack icons. | "DDoS has three main flavors. Each targets a different resource." |
| 2 | Volumetric: massive bandwidth flood (DNS amplification, NTP reflection, memcached reflection). | "Volumetric attacks fill the pipe. Spamhaus 2013: 300 Gbps via DNS amplification. Mirai 2016: over 1 Tbps against OVH and Dyn. Defense: upstream scrubbing, CDN, anti-DDoS services." |
| 3 | Protocol: exhausts server resources with crafted packets (SYN flood, fragmented IP, Ping of Death). | "Protocol attacks exhaust server resources with crafted packets. SYN flood is the classic. Defense: SYN cookies, stateful firewalls, rate limiting." |
| 4 | Application: high-effort-per-request (slowloris, HTTP GET flood, recursive query storms). | "Application attacks look like valid users but exhaust the application. Slowloris holds thousands of HTTP connections open. HTTP GET floods mimic real traffic. Defense: WAF, rate limiting, bot detection, CAPTCHA." |

---

## D4-11 · ZTNA vs Traditional VPN (110 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Traditional VPN: user connects once and gains full network access. | "Traditional VPN: user connects once and is on the internal network. All internal resources are reachable." |
| 2 | A compromised VPN user shows as a red node moving freely across internal resources. | "If the user is compromised, the attacker has the full internal network as a playground. Lateral movement is trivial." |
| 3 | ZTNA: per-application tunneling. Each request is authenticated and authorized individually. | "Zero Trust Network Access: per-application tunneling. The user does not 'join the network' — they are granted access to specific applications per-request, evaluated against current identity, device state, and policy." |
| 4 | A compromised ZTNA user only has access to the specific apps policy allowed. | "If a ZTNA user is compromised, the attacker has access only to the specific applications the policy allowed. Lateral movement is blocked by default." |
| 5 | Summary: VPNs are network-level; ZTNA is application-level and identity-aware. | "VPN trusts the network; ZTNA trusts the identity plus device plus context, per-request. Moving from VPN to ZTNA is a zero trust milestone." |

---

## D4-12 · WAF vs IDS vs IPS (95 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Three boxes: WAF, IDS, IPS. Each labeled. | "Three defenses. Related but different." |
| 2 | WAF: sits in front of web application, inspects HTTP, blocks known attack patterns. | "WAF: web-specific. Sits in front of the app. Understands HTTP. Blocks injection, XSS, SSRF, and OWASP Top 10 attacks. In-line." |
| 3 | IDS: observes traffic (often out-of-band via SPAN port), alerts on suspicious patterns, does not block. | "IDS: Intrusion Detection System. Observes traffic, alerts on suspicious patterns. Typically out-of-band — does not block. Network IDS observes the network; host IDS observes the host." |
| 4 | IPS: in-line, detects AND blocks. | "IPS: same detection, but in-line. When it sees something, it blocks it. Trade-off: a false positive blocks legitimate traffic." |
| 5 | Matching the right tool to the scenario. | "WAF for HTTP applications. IDS when you want visibility without blocking. IPS when you need immediate action and tolerate the false-positive risk." |
