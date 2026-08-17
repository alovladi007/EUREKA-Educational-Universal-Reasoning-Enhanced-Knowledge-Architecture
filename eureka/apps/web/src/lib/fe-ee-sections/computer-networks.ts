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
    { id: 'osi-overhead', title: '4. Encapsulation Arithmetic: Overhead, MTU, and Fragmentation',
      content: `## 4.1 What Each Header Costs

Layering is not free. Every header the stack pushes on is a byte the link must
carry and the application never sees, and the exam expects you to be able to
add them up. The minimum sizes are fixed by the standards that define them, so
these are numbers to know rather than numbers to derive:

| Field | Bytes | Standard |
|---|---|---|
| Ethernet II header (dest MAC, src MAC, EtherType) | 14 | IEEE 802.3 |
| Ethernet FCS trailer | 4 | IEEE 802.3 |
| Preamble and start-frame delimiter | 8 | IEEE 802.3 |
| Interframe gap (idle medium, still charged as time) | 12 | IEEE 802.3 |
| IPv4 header, no options | 20 | RFC 791 |
| TCP header, no options | 20 | RFC 9293 |
| UDP header | 8 | RFC 768 |

The **MTU** (maximum transmission unit) is the largest payload the link layer
will carry, and on classic Ethernet it is **1500 bytes**. That budget has to
cover the IP header, the transport header, and only then the application's
data. The remainder is the **MSS** (maximum segment size) that TCP advertises:

**$\\mathrm{MSS} = \\mathrm{MTU} - \\mathrm{IP} - \\mathrm{TCP} = 1500 - 20 - 20 = 1460$ bytes**

Three different totals therefore describe the same segment, and questions
trade on the difference between them. A full-size segment is 1460 bytes of
data, a **1518-byte frame** once the 58 bytes of TCP, IP, Ethernet header and
FCS are added, and **1538 bytes of medium time** once the preamble and the
interframe gap are included.

## 4.2 Efficiency Is a Function of Payload Size

Because the overhead is a fixed number of bytes rather than a fixed
percentage, small packets are punished and large ones are not:

![Payload as a percentage of the bytes sent, plotted against application payload size on a logarithmic axis. One curve charges the 58 bytes of TCP, IP, Ethernet header and frame check sequence; the other also charges the 8-byte preamble and 12-byte interframe gap. A full 1460-byte segment reaches 94.9 percent useful on the wire, while a 100-byte payload reaches only 56.2 percent.](/courses/fe-ee/figures/net-osi-overhead.svg)

Read two values off the curve and the whole idea is in hand. At the full MSS,
1460 of every 1538 bytes of medium time carry data, which is
**94.9 % efficiency**. At a 100-byte payload — a keystroke, a sensor reading,
a game state update — the same 78 bytes of overhead now dwarf the message and
only **56.2 %** of the wire is doing useful work. Cut the payload to a
20-byte record and efficiency collapses to 20.4 %: four fifths of a very
expensive link would be spent on addressing.

This is why a 1 Gbps interface never delivers 1 Gbps of application data. The
ceiling set by framing alone is

**$1000 \\times (1460/1538) = 949.3$ Mbps**

with full segments, and only 450.7 Mbps if the traffic is 64-byte payloads.
Jumbo frames attack the same arithmetic from the other side: a 9000-byte MTU
yields an 8960-byte MSS in a 9038-byte wire slot, or **99.1 %** efficiency.

## 4.3 Fragmentation: The Offset Field Is in Units of Eight

When a datagram is larger than the next link's MTU, IPv4 splits it. The rule
that trips people up is that the fragment offset field counts **8-byte
units**, so every fragment except the last must carry a payload that is a
multiple of 8.

**Worked example.** A 4000-byte IP datagram must cross a link with MTU 1500.

- Datagram payload = 4000 − 20 = **3980 bytes**
- Largest fragment payload = the largest multiple of 8 that fits in
  1500 − 20 = 1480, and 1480 is already a multiple of 8, so **1480 bytes**
- 3980 = 1480 + 1480 + 1020

| Fragment | Payload (B) | Offset field | Byte position | Total size (B) | More-fragments flag |
|---|---|---|---|---|---|
| 1 | 1480 | 0 | 0 | 1500 | 1 |
| 2 | 1480 | 185 | 1480 | 1500 | 1 |
| 3 | 1020 | 370 | 2960 | 1040 | 0 |

Check the offsets: 1480/8 = 185 and 2960/8 = 370, both integers, which is
exactly the constraint the multiple-of-8 rule enforces. Reassembly happens
only at the **destination host**, never at an intermediate router, and losing
any one fragment forces the whole datagram to be discarded — three chances to
lose one packet instead of one, which is why path-MTU discovery exists and why
IPv6 removed router fragmentation entirely.

## 4.4 Choosing a Packet Size

Two opposing pressures set the answer, and exam questions usually name one of
them:

| Pressure | Pushes toward | Reason |
|---|---|---|
| Header overhead | Larger packets | Fixed 78-byte cost is amortised |
| Serialisation delay | Smaller packets | A 1500-byte frame occupies a 1 Mbps link for 12 ms |
| Loss probability | Smaller packets | A bit error kills the whole frame; longer frames are hit more often |
| Interactive latency | Smaller packets | A queued jumbo frame delays everything behind it |
| Per-packet CPU cost | Larger packets | Interrupt and header processing is per packet, not per byte |

Voice over IP sits at the small end deliberately: a 20 ms G.711 sample is
160 bytes of audio in a 40-byte RTP/UDP/IP wrapper, so barely two thirds of
the traffic is voice — and that is the right trade, because doubling the
payload to improve efficiency would add 20 ms of delay to every packet.`,
      examTip: 'MSS = MTU - 20 (IP) - 20 (TCP) = 1460 on a 1500-byte Ethernet MTU. If a question gives you a payload and asks for bytes on the wire, add 58 for the frame or 78 if the preamble and interframe gap are being counted.',
      importantNote: 'The IPv4 fragment offset field counts 8-byte units, so every fragment except the last must carry a payload that is a multiple of 8. Reassembly is done by the destination host only — routers never reassemble.',
    },
    { id: 'osi-forwarding', title: '5. Forwarding in Practice: ARP, Routing Tables, ICMP, Handshake',
      content: `## 5.1 One Packet, Two Addressing Schemes

The single most useful mental model for the network layers is that a packet
carries **two destinations at once, and only one of them changes**.

- The **IP addresses are end-to-end**. Source and destination IP are written
  by the sending host and are still there when the packet arrives, unless a
  NAT device deliberately rewrites them.
- The **MAC addresses are hop-by-hop**. Every router strips the incoming
  frame, decides where the packet goes next, and builds a *new* frame whose
  destination MAC is the next hop's interface.

| Hop | Source IP | Destination IP | Source MAC | Destination MAC |
|---|---|---|---|---|
| Host to router A | 10.1.2.50 | 203.0.113.9 | host NIC | router A LAN port |
| Router A to router B | 10.1.2.50 | 203.0.113.9 | router A WAN port | router B port |
| Router B to server | 10.1.2.50 | 203.0.113.9 | router B LAN port | server NIC |

**ARP** is the mechanism that fills in the right-hand columns. When a host has
an IP address and needs the matching MAC, it broadcasts an ARP request to
ff:ff:ff:ff:ff:ff asking who owns that IP; the owner answers with its MAC and
both sides cache the mapping. Note the asymmetry the exam likes: a host ARPs
for the **default gateway**, not for the remote server, because the remote
server is not on its link and only the gateway's MAC is usable.

## 5.2 Building and Reading a Routing Table

A routing table is a list of prefixes with next hops. Forwarding uses
**longest-prefix match**: among every entry that contains the destination, the
one with the most network bits wins, regardless of the order the entries were
entered.

| Destination prefix | Next hop | Interface |
|---|---|---|
| 10.1.2.0/24 | direct | eth1 |
| 10.1.0.0/16 | 10.1.2.1 | eth1 |
| 10.0.0.0/8 | 172.20.0.1 | eth0 |
| 192.168.1.0/24 | 172.20.0.5 | eth0 |
| 0.0.0.0/0 (default) | 172.20.0.254 | eth0 |

Work four destinations through it:

| Destination | Entries that match | Longest match | Sent to |
|---|---|---|---|
| 10.1.2.77 | /0, /8, /16, /24 | **10.1.2.0/24** | delivered directly on eth1 |
| 10.1.9.5 | /0, /8, /16 | **10.1.0.0/16** | 10.1.2.1 |
| 10.7.7.7 | /0, /8 | **10.0.0.0/8** | 172.20.0.1 |
| 172.16.0.1 | /0 only | **0.0.0.0/0** | 172.20.0.254 |

Three points fall out of this drill and each has appeared as a question. The
default route 0.0.0.0/0 matches everything, which is why it can never be the
longest match when any other entry also matches. A more specific prefix always
beats a less specific one even if the less specific entry was added first or
has a better metric — **specificity is checked before cost**. And a packet for
which no entry matches at all, in a table with no default route, is dropped
and an ICMP destination-unreachable is returned.

## 5.3 ICMP: The Network Layer's Error Channel

ICMP rides inside IP but is not a transport protocol — it has no ports, which
is why "what port does ping use?" is a trick question. The types worth
recognising:

| Type | Name | Used by |
|---|---|---|
| 0 | Echo reply | ping |
| 3 | Destination unreachable | routers with no route; code 4 signals fragmentation-needed for path-MTU discovery |
| 8 | Echo request | ping |
| 11 | Time exceeded | traceroute; TTL reached zero |

**Traceroute** is built entirely from type 11. It sends a probe with TTL = 1;
the first router decrements the TTL to zero, discards the packet, and reports
a time-exceeded message, revealing itself. The next probe goes out with
TTL = 2 and exposes the second router, and so on until the destination
answers. The TTL field exists to stop a routing loop from circulating a packet
forever; traceroute simply abuses it as a measuring instrument.

## 5.4 The Handshake and What It Costs

TCP opens a connection with the three-way handshake of RFC 9293, and the
sequence numbers matter:

| Step | Direction | Flags | Sequence and acknowledgement |
|---|---|---|---|
| 1 | client to server | SYN | seq = x |
| 2 | server to client | SYN, ACK | seq = y, ack = x + 1 |
| 3 | client to server | ACK | seq = x + 1, ack = y + 1 |

The acknowledgement is x + 1 rather than x because the SYN flag itself
consumes one sequence number. Closing is a four-way exchange (FIN, ACK, FIN,
ACK) because each direction is shut down independently.

The cost is one full round trip before a single byte of request can be sent.
With a 40 ms RTT that is **40 ms** of pure setup for plain TCP, **80 ms** if
TLS 1.3 adds its one-round-trip handshake, and **120 ms** for TLS 1.2's two.
Add a DNS lookup and the request itself and a cold HTTPS page fetch spends
**5 RTT = 200 ms** before the first byte of HTML arrives. UDP spends none of
this, which is precisely why DNS queries, DHCP, and real-time media use it:
for a single small exchange, the handshake costs more than the data.`,
      examTip: 'Longest-prefix match decides forwarding, and specificity beats metric: a /24 entry always wins over a /16 entry that also matches. The default route 0.0.0.0/0 matches everything and therefore wins only when nothing else does.',
      importantNote: 'MAC addresses are rewritten at every router; IP addresses survive end to end. A host ARPs for its default gateway, never for a remote server on another network — that mapping would be useless because the server is not on the local link.',
    },
    { id: 'osi-delay-budget', title: '6. The End-to-End Delay Budget',
      content: `## 6.1 Four terms, and only two of them are yours to set

Every packet that crosses one hop waits for four separate things. A question
that asks how long a transfer takes is asking you to name all four and add
them:

$$d_{\\mathrm{hop}} = d_{\\mathrm{proc}} + d_{\\mathrm{queue}} + d_{\\mathrm{trans}} + d_{\\mathrm{prop}}$$

**Processing delay** is the time a router spends reading the header, verifying
the checksum and looking up the outgoing interface. On current hardware it is
a few microseconds, and problems quote it rather than expect you to derive it.

**Queueing delay** is the wait in the outbound buffer behind packets that
arrived earlier. It is the only term that depends on somebody else's traffic,
and the only one that is a random variable rather than a number.

**Transmission delay**, also called serialisation delay, is the time needed to
push every bit of the packet through the interface at its clock rate:

$$d_{\\mathrm{trans}} = \\frac{L}{R}$$

**Propagation delay** is the flight time of the leading bit along the medium:

$$d_{\\mathrm{prop}} = \\frac{d}{v}$$

The signal velocity is not the speed of light in vacuum. Silica fibre has a
group index close to 1.5, and twisted pair and coaxial cable fall in the same
neighbourhood, so exam problems use

$$v = c/n = 2.998 \\times 10^{8}/1.5 \\approx 2.0 \\times 10^{8}\\ \\mathrm{m/s}$$

which is a convenient two thirds of $c$. A useful number to carry: at that
velocity a signal covers 200 km in exactly 1 ms.

Notice what each term does **not** depend on. Transmission delay depends on
the packet length and the link rate but not at all on the distance.
Propagation delay depends on the distance and the medium but not at all on
the packet length or the link rate. Confusing the two is the single most
common error in this material, and it is the error every distractor in a
delay question is built to catch.

## 6.2 Worked example 1 — one hop, all four terms

A 1500-byte frame crosses a 100 Mbps link 200 km long. The router adds
20 microseconds of processing and the outbound queue holds the packet for
50 microseconds. Find the one-way delay.

Convert the length to bits first, because $R$ is in bits per second:

$$L = 1500 \\times 8 = 12000\\ \\mathrm{bits}$$

$$d_{\\mathrm{trans}} = \\frac{12000}{100 \\times 10^{6}} = 1.2 \\times 10^{-4}\\ \\mathrm{s} = 120\\ \\mu\\mathrm{s}$$

$$d_{\\mathrm{prop}} = \\frac{200 \\times 10^{3}}{2.0 \\times 10^{8}} = 1.0 \\times 10^{-3}\\ \\mathrm{s} = 1000\\ \\mu\\mathrm{s}$$

$$d_{\\mathrm{hop}} = 20 + 50 + 120 + 1000 = 1190\\ \\mu\\mathrm{s} = 1.19\\ \\mathrm{ms}$$

Propagation alone is $1000/1190 = 0.840$, or **84.0 %** of the budget. Doubling
the link rate to 200 Mbps would remove 60 microseconds and shorten the hop by
about five percent; moving the endpoints 100 km closer would remove 500
microseconds and shorten it by forty-two.

## 6.3 Which term dominates, and where the crossover sits

The two deterministic terms are equal when

$$\\frac{L}{R} = \\frac{d}{v} \\quad \\Longrightarrow \\quad L^{*} = \\frac{R\\,d}{v}$$

![One-way delay against packet size for a 100 Mbps link 200 km long. Transmission delay rises linearly from the origin, propagation delay is a flat 1.0 ms that does not depend on packet size, and their sum is the dashed line. The two terms are equal only at a packet of 12,500 bytes, more than eight times the Ethernet MTU, so every realistic packet on this link is propagation-bound.](/courses/fe-ee/figures/net2-delay-terms.svg)

For the link of the previous example that crossover packet is

$$L^{*} = \\frac{100 \\times 10^{6} \\times 200 \\times 10^{3}}{2.0 \\times 10^{8}} = 1.0 \\times 10^{5}\\ \\mathrm{bits} = 12500\\ \\mathrm{bytes}$$

which is more than eight Ethernet MTUs. No packet you can legally send on
that link is transmission-bound. The general lesson is that $L^{*}$ scales
with the product of rate and distance, so faster links and longer links both
push the crossover upward: the faster the network, the more thoroughly
propagation dominates.

## 6.4 Worked example 2 — two links at opposite extremes

Take the same 1500-byte frame across two very different links.

A 1 Gbps link 10 m long, inside a rack:

$$d_{\\mathrm{trans}} = \\frac{12000}{10^{9}} = 12\\ \\mu\\mathrm{s}, \\qquad d_{\\mathrm{prop}} = \\frac{10}{2.0 \\times 10^{8}} = 0.05\\ \\mu\\mathrm{s}$$

Transmission beats propagation by a factor of $12/0.05 = 240$.

A 10 Mbps link 5000 km long, a continental leased line:

$$d_{\\mathrm{trans}} = \\frac{12000}{10^{7}} = 1200\\ \\mu\\mathrm{s}, \\qquad d_{\\mathrm{prop}} = \\frac{5 \\times 10^{6}}{2.0 \\times 10^{8}} = 25000\\ \\mu\\mathrm{s}$$

Propagation now beats transmission by $25000/1200 = 20.8$. The same packet,
the same formulas, and the answer to "which term dominates" flips by a factor
of five thousand. There is no rule of thumb here — you compute both.

## 6.5 Queueing: the term that is not a constant

Model the outbound port as a single server fed by a Poisson arrival stream at
$\\lambda$ packets per second, each taking a service time $T_s = L/R$. The
**traffic intensity** is the fraction of the server's capacity demanded:

$$\\rho = \\lambda\\, T_s = \\frac{\\lambda L}{R}$$

For that M/M/1 model the standard results are

$$W_q = \\frac{\\rho}{1 - \\rho}\\, T_s, \\qquad T = \\frac{T_s}{1 - \\rho} = W_q + T_s$$

and the mean number of packets waiting is $N_q = \\rho^{2}/(1-\\rho)$. What
matters for the exam is the shape, not the derivation: the delay does not
grow in proportion to the load, it grows as one over the headroom.

![Mean queueing wait and mean time in system for an M/M/1 port, both expressed in service times, plotted against utilisation. At sixty percent utilisation a packet waits 1.5 service times; at ninety percent it waits nine. The curve is nearly flat to about seventy percent and then turns almost vertical, which is why links are engineered well below saturation.](/courses/fe-ee/figures/net2-queue-knee.svg)

Two consequences are worth stating outright. A link run at 50 % utilisation
queues each packet for one service time on average, which is negligible. A
link run at 95 % queues each packet for nineteen, which is not. And because
$\\rho$ contains $L$, the same offered bit rate carried in smaller packets
raises the packet rate but leaves $\\rho$ unchanged — utilisation is a bit-rate
ratio, not a packet-rate ratio.

## 6.6 Worked example 3 — a port at 60 % and at 90 %

A 20 Mbps port carries 1500-byte packets. Find the queueing delay at 1000
packets per second and at 1500 packets per second.

$$T_s = \\frac{12000}{20 \\times 10^{6}} = 6.0 \\times 10^{-4}\\ \\mathrm{s} = 600\\ \\mu\\mathrm{s}$$

At 1000 packets per second, $\\rho = 1000 \\times 600 \\times 10^{-6} = 0.60$:

$$W_q = \\frac{0.60}{0.40} \\times 600 = 900\\ \\mu\\mathrm{s}, \\qquad T = \\frac{600}{0.40} = 1500\\ \\mu\\mathrm{s}$$

At 1500 packets per second, $\\rho = 0.90$:

$$W_q = \\frac{0.90}{0.10} \\times 600 = 5400\\ \\mu\\mathrm{s}, \\qquad T = \\frac{600}{0.10} = 6000\\ \\mu\\mathrm{s}$$

Traffic rose by half; the queueing delay rose by a factor of
$5400/900 = 6.0$. That non-linearity is the entire reason capacity planning
exists, and it is why an operator treats 70 % as "busy" rather than "fine".

## 6.7 An end-to-end path is a sum over hops

Nothing about the four terms changes when the path is longer; the terms are
simply summed over every link and every device in between:

$$d_{\\mathrm{e2e}} = \\sum_{i=1}^{N}\\left(\\frac{L}{R_i} + \\frac{d_i}{v}\\right) + \\sum_{k=1}^{N-1}\\left(d_{\\mathrm{proc},k} + d_{\\mathrm{queue},k}\\right)$$

Note the index ranges. A path of $N$ links contains $N-1$ intermediate
devices, so a three-link path serialises the packet three times but only
processes and queues it twice. Off-by-one errors here are worth real marks.

Round-trip time is the sum in both directions. If the path is symmetric,

$$\\mathrm{RTT} = 2\\, d_{\\mathrm{e2e}}$$

but that assumption is worth stating rather than assuming, because
asymmetric routing and asymmetric access rates are both common.

## 6.8 Worked example 4 — a three-hop budget, term by term

A 1500-byte frame goes from a host to a server over three links: 1 Gbps and
2 km to the first router, 100 Mbps and 800 km to the second, then 1 Gbps and
5 km to the server. Each router adds 20 microseconds of processing and 150
microseconds of queueing. Find the one-way delay and the share of each term.

Transmission, hop by hop:

$$\\frac{12000}{10^{9}} = 12\\ \\mu\\mathrm{s}, \\qquad \\frac{12000}{10^{8}} = 120\\ \\mu\\mathrm{s}, \\qquad \\frac{12000}{10^{9}} = 12\\ \\mu\\mathrm{s}$$

Propagation, hop by hop:

$$\\frac{2 \\times 10^{3}}{2 \\times 10^{8}} = 10\\ \\mu\\mathrm{s}, \\quad \\frac{8 \\times 10^{5}}{2 \\times 10^{8}} = 4000\\ \\mu\\mathrm{s}, \\quad \\frac{5 \\times 10^{3}}{2 \\times 10^{8}} = 25\\ \\mu\\mathrm{s}$$

Two routers contribute $2 \\times 20 = 40$ microseconds of processing and
$2 \\times 150 = 300$ microseconds of queueing. Adding everything:

$$d_{\\mathrm{e2e}} = 144 + 4035 + 40 + 300 = 4519\\ \\mu\\mathrm{s} = 4.519\\ \\mathrm{ms}$$

| Term | Total (microseconds) | Share of the budget |
|---|---|---|
| Transmission on three links | 144 | 3.2 % |
| Propagation on three links | 4035 | 89.3 % |
| Processing at two routers | 40 | 0.9 % |
| Queueing at two routers | 300 | 6.6 % |

If the path is symmetric the round trip is $2 \\times 4.519 = 9.038$ ms. The
table is the answer to almost every "how do I make this faster" question:
upgrading the 100 Mbps middle hop to 1 Gbps removes 108 microseconds, about
2.4 % of the total, while moving the server 400 km closer removes 2000
microseconds, about 44 %.

## 6.9 Store-and-forward, segmentation, and the pipeline

A store-and-forward device receives an entire packet before it forwards any
of it, so sending one large message across $N$ hops costs $N$ full
serialisations. Cutting the message into $P$ packets lets the hops overlap:
while hop 2 forwards packet $k$, hop 1 is already receiving packet $k+1$.
Ignoring headers, the last bit arrives after

$$t(P) = (N + P - 1)\\,\\frac{L}{P R}$$

The $(N-1)$ term is the cost of filling the pipeline, and it is the only
penalty that remains as $P$ grows. Restore a per-packet header of $h$ bits and
the picture changes, because every extra packet buys another header:

$$t(P) = (N + P - 1)\\,\\frac{L/P + h}{R} = \\frac{1}{R}\\left[L + (N-1)h + \\frac{(N-1)L}{P} + Ph\\right]$$

The bracket is a constant plus a term falling as $1/P$ plus a term rising as
$P$, so it has a minimum. Differentiating and setting the derivative to zero,

$$-\\frac{(N-1)L}{P^{2}} + h = 0 \\quad \\Longrightarrow \\quad P^{*} = \\sqrt{\\frac{(N-1)L}{h}}$$

$$t_{\\min} = \\frac{1}{R}\\left[L + (N-1)h + 2\\sqrt{(N-1)L h}\\right]$$

![Delivery time of a six-megabit message across three store-and-forward hops at 100 Mbps, plotted against the number of packets the message is cut into. Sending it whole costs 180 ms because each hop serialises the entire message; cutting it into 194 packets reaches a minimum of 61.25 ms, and cutting it finer than that loses ground again to the forty-byte header charged on every packet. The dashed curve, which ignores headers, falls monotonically toward the sixty-millisecond floor.](/courses/fe-ee/figures/net2-segment-pipeline.svg)

## 6.10 Worked example 5 — the packet count that minimises delivery time

A 6 Mbit message crosses three 100 Mbps store-and-forward hops. Headers cost
40 bytes per packet. Find the delivery time for the whole message, for 1000
packets ignoring headers, and the optimum packet count with headers charged.

Whole message, three serialisations:

$$t = 3 \\times \\frac{6 \\times 10^{6}}{10^{8}} = 3 \\times 0.06 = 0.18\\ \\mathrm{s} = 180\\ \\mathrm{ms}$$

One thousand packets of 6000 bits each, headers ignored:

$$t = (3 + 1000 - 1)\\,\\frac{6000}{10^{8}} = 1002 \\times 60\\ \\mu\\mathrm{s} = 60.12\\ \\mathrm{ms}$$

a speed-up of $180/60.12 = 2.994$, essentially the factor of $N = 3$ that the
pipeline can deliver. Now charge $h = 40 \\times 8 = 320$ bits per packet:

$$P^{*} = \\sqrt{\\frac{2 \\times 6 \\times 10^{6}}{320}} = \\sqrt{37500} = 193.6$$

$$t_{\\min} = \\frac{6 \\times 10^{6} + 640 + 2\\sqrt{1.2 \\times 10^{7} \\times 320}}{10^{8}} = 61.25\\ \\mathrm{ms}$$

The integer optimum is 194 packets, at 61.246 ms. Two things are worth
carrying away. The minimum is very flat — 100 packets gives 61.53 ms and 400
gives 61.59 ms, both within half a percent — so any sensible packet size is
fine. And the floor is $L/R = 60$ ms no matter how many hops there are,
because once the pipeline is full the bottleneck link is busy continuously.`,
      examTip: 'Transmission delay is L/R and ignores distance; propagation delay is d/v and ignores packet size and link rate. Compute both before deciding which dominates — the crossover distance is d = Lv/R, which for a 1500-byte frame at 100 Mbps is 24 km and at 1 Gbps only 2.4 km, so almost any wide-area link is propagation-bound and almost any rack-scale link is not.',
      importantNote: 'A path of N links has only N-1 intermediate routers, so it serialises the packet N times but processes and queues it N-1 times. Queueing delay is rho/(1-rho) service times: it is roughly flat to 70 % utilisation and then rises without bound, so a 50 % traffic increase from rho = 0.6 to rho = 0.9 multiplies the wait by six.',
    },
    { id: 'osi-window-arq', title: '7. Bandwidth-Delay Product, Windows, and ARQ Efficiency',
      content: `## 7.1 The pipe, and what it takes to fill it

A link with a round-trip time has a volume, not just a rate. The
**bandwidth-delay product** is the number of bits that fit in flight between
sender and receiver and back:

$$\\mathrm{BDP} = R \\times \\mathrm{RTT}$$

It is the amount of unacknowledged data a sender must be willing to have
outstanding if the link is never to go idle. Divide by eight for bytes, and by
the segment size for segments:

$$W_{\\mathrm{bytes}} = \\frac{R \\times \\mathrm{RTT}}{8}, \\qquad W_{\\mathrm{segments}} = \\frac{R \\times \\mathrm{RTT}}{8\\,\\mathrm{MSS}}$$

TCP's header carries the receive window in a 16-bit field, so the largest
window it can advertise without help is 65,535 bytes. The **window scale**
option of RFC 7323 multiplies that field by $2^{s}$ with $s$ up to 14, giving
a ceiling near 1 GB, and the scale factor is negotiated once in the SYN.

## 7.2 Worked example 6 — the pipe and the 16-bit ceiling

A 100 Mbps path has an 80 ms round-trip time. Find the window needed to keep
it busy, and the throughput obtainable without window scaling.

$$\\mathrm{BDP} = 100 \\times 10^{6} \\times 0.080 = 8.0 \\times 10^{6}\\ \\mathrm{bits} = 10^{6}\\ \\mathrm{bytes}$$

A full megabyte must be in flight. An unscaled TCP window of 65,535 bytes
delivers one window per round trip:

$$B = \\frac{65535 \\times 8}{0.080} = 6.5535 \\times 10^{6}\\ \\mathrm{bits/s} = 6.55\\ \\mathrm{Mbps}$$

which is $6.5535/100 = 6.55$ % of the link. The window, not the link, is the
bottleneck — and no amount of extra bandwidth changes the answer, because
throughput is window over RTT. The required scale factor is
$10^{6}/65535 = 15.3$, so $s = 4$ (a multiplier of 16) is the smallest that
works.

## 7.3 Stop-and-wait, derived from the timeline

Stop-and-wait sends one frame and waits for its acknowledgement. Draw the
timeline and read off the cycle: the frame takes $T_t = L/R$ to serialise, one
propagation time $T_p$ to arrive, the acknowledgement is short enough to
ignore, and one more $T_p$ to come back. The cycle is therefore
$T_t + 2T_p$ and the useful fraction of it is

$$\\eta_{\\mathrm{sw}} = \\frac{T_t}{T_t + 2T_p} = \\frac{1}{1 + 2a}, \\qquad a \\equiv \\frac{T_p}{T_t}$$

The dimensionless ratio $a$ is the whole story: it is the number of frame
times that fit in one propagation time, and $1 + 2a$ is the number of frames
that would fit in one full cycle. With a window of $W$ frames the sender can
keep going until the first acknowledgement returns, so

$$\\eta_{W} = \\min\\!\\left(1,\\; \\frac{W}{1 + 2a}\\right), \\qquad B_{\\mathrm{eff}} = \\eta_W R$$

and the window that just fills the pipe is $W = \\lceil 1 + 2a \\rceil$. That is
the bandwidth-delay product measured in frames rather than bits, and the two
statements are the same statement.

![Sliding-window efficiency against window size for three link shapes. Each curve rises linearly from the stop-and-wait point at a window of one and saturates at a window of 1 plus 2a: two frames on a short LAN hop, twenty-six frames on a ten-megabit path with a thirty-millisecond round trip, and 251 frames on a satellite hop. Stop-and-wait on the thirty-millisecond path achieves only 3.85 percent of the link.](/courses/fe-ee/figures/net2-arq-efficiency.svg)

## 7.4 Worked example 7 — stop-and-wait against a sliding window

A 10 Mbps link carries 1500-byte frames with a 30 ms round-trip time. Find
the stop-and-wait efficiency and throughput, and the window that reaches full
rate.

$$T_t = \\frac{12000}{10 \\times 10^{6}} = 1.2\\ \\mathrm{ms}, \\qquad T_p = \\frac{30}{2} = 15\\ \\mathrm{ms}, \\qquad a = \\frac{15}{1.2} = 12.5$$

$$\\eta_{\\mathrm{sw}} = \\frac{1.2}{1.2 + 30} = \\frac{1}{26} = 0.03846 = 3.85\\ \\%$$

$$B_{\\mathrm{eff}} = 0.03846 \\times 10 = 0.385\\ \\mathrm{Mbps}$$

A ten-megabit link is delivering 385 kbps. The window that fixes it is
$1 + 2a = 26$ frames, or $26 \\times 1500 = 39000$ bytes. Check that against
the pipe directly: the bandwidth-delay product is
$10 \\times 10^{6} \\times 0.030/8 = 37500$ bytes, and one more frame is needed
to cover the sender's own serialisation, giving $37500 + 1500 = 39000$ bytes.
The two routes agree exactly, which is the point — "one plus two a frames" and
"the bandwidth-delay product plus one frame" are the same quantity written in
different units.

## 7.5 From bit errors to frame losses

A frame is destroyed by a **single** bit error, so a frame error probability
is not a bit error rate. If bit errors are independent with probability
$p_b$, a frame of $n$ bits survives with probability $(1-p_b)^n$, so

$$p_f = 1 - (1 - p_b)^{n} \\approx n\\,p_b \\quad (n\\,p_b \\ll 1)$$

With retransmission until success, the number of transmissions per delivered
frame is geometric, so its expectation is

$$E[k] = \\frac{1}{1 - p_f}$$

and a pipelined protocol whose window already covers the pipe delivers

$$B_{\\mathrm{eff}} = R\\,(1 - p_f)$$

For a window too small to cover the pipe, and assuming selective repeat so
that only the damaged frame is resent, the two penalties multiply:

$$\\eta = \\frac{W(1 - p_f)}{1 + 2a} \\quad (W < 1 + 2a)$$

## 7.6 Worked example 8 — effective throughput under a bit error rate

A 1 Gbps link has a bit error rate of $10^{-6}$ and carries full 1518-byte
Ethernet frames. Find the frame error probability, the mean number of
transmissions per delivered frame, and the effective throughput assuming the
window is large enough that only errors cost anything.

$$n = 1518 \\times 8 = 12144\\ \\mathrm{bits}$$

$$p_f = 1 - (1 - 10^{-6})^{12144} = 0.012071$$

The linear approximation $n p_b = 0.012144$ is high by six tenths of a
percent, which is close enough for a multiple-choice answer and a useful sanity
check on the exponent.

$$E[k] = \\frac{1}{1 - 0.012071} = 1.0122$$

$$B_{\\mathrm{eff}} = 1000 \\times (1 - 0.012071) = 987.9\\ \\mathrm{Mbps}$$

Raise the bit error rate one decade to $10^{-5}$ and the frame error
probability becomes 0.1144: eleven percent of frames are lost, throughput
falls to 886 Mbps, and a go-back-N protocol would do far worse still because
each loss discards a whole window. This is why long links use forward error
correction rather than retransmission — at a fixed frame length, frame loss
rises almost linearly with the bit error rate, and retransmission cost rises
faster than that.`,
      examTip: 'BDP = R x RTT gives bits in flight; divide by 8 for the window in bytes. Sliding-window efficiency is min(1, W/(1+2a)) with a = Tp/Tt, so the window that fills a pipe is 1 + 2a frames — the same number as the bandwidth-delay product expressed in frames.',
      importantNote: 'One bit error destroys the whole frame, so the frame error probability is 1 - (1 - BER)^n, not the BER. Without window scaling TCP cannot advertise more than 65,535 bytes, which caps throughput at 65535 x 8/RTT regardless of link speed — 6.55 Mbps on an 80 ms path.',
    },
    { id: 'osi-tcp-control', title: '8. TCP Control Loops and the Switching Decision',
      content: `## 8.1 Flow control and congestion control are different problems

TCP runs two limits at once and a question that confuses them is easy to get
wrong. **Flow control** protects the *receiver*: the receive window
$\\mathrm{rwnd}$ is advertised in every segment and says how much buffer the
receiving application has left. **Congestion control** protects the
*network*: the congestion window $\\mathrm{cwnd}$ is the sender's own estimate
of what the path will carry, and no one advertises it. The sender may have

$$\\mathrm{outstanding} \\le \\min(\\mathrm{cwnd},\\ \\mathrm{rwnd})$$

bytes unacknowledged, and throughput follows from whichever is smaller:

$$B = \\frac{\\min(\\mathrm{cwnd},\\ \\mathrm{rwnd})}{\\mathrm{RTT}}$$

A receiver that advertises a zero window has stopped the sender for its own
reasons and the network is uninvolved; a sender whose cwnd has collapsed has
seen loss and the receiver is uninvolved.

## 8.2 Slow start is exponential, and shorter than it sounds

A new connection has no idea what the path will carry, so it probes. Starting
from an initial window $W_0$ (ten segments under RFC 6928), every
acknowledged window doubles the next one:

$$W_n = W_0\\, 2^{n}$$

so the number of round trips needed to reach a target window $W_T$ is

$$n = \\left\\lceil \\log_2 \\frac{W_T}{W_0} \\right\\rceil$$

and the data delivered in the first $n$ rounds is the geometric sum

$$S_n = W_0\\left(2^{n} - 1\\right) \\ \\text{segments}$$

Slow start is a badly chosen name: nothing about doubling is slow. What is
slow is that the growth is measured in **round trips**, so on a long path the
clock, not the link, sets the pace.

## 8.3 Worked example 9 — round trips to fill a 100 Mbps pipe

A connection with MSS 1460 bytes and an initial window of 10 segments runs
over a 100 Mbps path with a 40 ms round-trip time. How many round trips does
slow start need before the window covers the pipe, and how long is that?

$$W_T = \\frac{100 \\times 10^{6} \\times 0.040}{8} = 500000\\ \\mathrm{bytes} = \\frac{500000}{1460} = 342.5\\ \\mathrm{segments}$$

$$n = \\left\\lceil \\log_2 \\frac{342.5}{10} \\right\\rceil = \\left\\lceil 5.10 \\right\\rceil = 6\\ \\text{round trips}$$

$$t = 6 \\times 40 = 240\\ \\mathrm{ms}$$

In those six rounds the sender has delivered
$S_6 = 10(2^{6} - 1) = 630$ segments, which is
$630 \\times 1460 = 919800$ bytes. A transfer smaller than about 900 kB
therefore never reaches full rate at all — it finishes inside slow start, and
its average throughput is governed by RTT and the initial window, not by the
link. That is the arithmetic behind every recommendation to reduce round
trips rather than buy bandwidth for small-object workloads.

## 8.4 AIMD and the sawtooth

Once slow start ends, TCP switches to congestion avoidance: additive increase,
multiplicative decrease. Per round trip,

$$\\text{no loss:}\\quad \\mathrm{cwnd} \\leftarrow \\mathrm{cwnd} + 1\\ \\mathrm{MSS}$$

$$\\text{loss:}\\quad \\mathrm{cwnd} \\leftarrow \\beta\\,\\mathrm{cwnd}, \\qquad \\beta = \\tfrac{1}{2}$$

The window therefore sawtooths between $W/2$ and $W$, where $W$ is whatever
the path plus buffer will hold. Its time average over one cycle is the mean of
a linear ramp:

$$\\overline{W} = \\frac{W/2 + W}{2} = \\frac{3W}{4}$$

$$B = \\frac{3W\\,\\mathrm{MSS}}{4\\,\\mathrm{RTT}}$$

so a single AIMD flow with a small buffer uses **75 %** of a bottleneck, not
100 %. Sizing the router buffer at one bandwidth-delay product is exactly what
lifts that back to full utilisation: the buffer holds the data the window
would otherwise have to give up.

![Congestion window against round trip number for a connection on a ten-megabit path with a forty-millisecond round trip, whose pipe holds 34 segments. Slow start doubles the window from ten to twenty to forty, the forty overruns the pipe and provokes a loss, and from then on the window sawtooths between seventeen and thirty-four segments. The mean of the sawtooth is 25.5 segments, three quarters of the pipe.](/courses/fe-ee/figures/net2-slowstart-aimd.svg)

## 8.5 Worked example 10 — the average throughput of a sawtooth

A 10 Mbps path with a 40 ms round-trip time carries a single TCP flow with
MSS 1460 bytes and a bottleneck buffer too small to matter. Find the pipe in
segments, the sawtooth limits, and the average throughput.

$$W = \\frac{10 \\times 10^{6} \\times 0.040}{8 \\times 1460} = \\frac{50000}{1460} = 34.2 \\rightarrow 34\\ \\mathrm{segments}$$

The window climbs to 34, overshoots, halves to 17, and climbs again, so it
oscillates over $17 \\le \\mathrm{cwnd} \\le 34$ with mean

$$\\overline{W} = \\frac{17 + 34}{2} = 25.5 = 0.75 \\times 34$$

$$B = \\frac{25.5 \\times 1460 \\times 8}{0.040} = 7.446 \\times 10^{6}\\ \\mathrm{bits/s} = 7.45\\ \\mathrm{Mbps}$$

which is 74.5 % of the link. Quoting the peak window instead gives
$34 \\times 11680/0.040 = 9.93$ Mbps and overstates the answer by a third — that
is the standard distractor in this family of questions.

## 8.6 The square-root law

Each sawtooth cycle ends in exactly one loss. The window rises from $W/2$ to
$W$ in $W/2$ round trips, and the packets delivered in the cycle are the sum
of that ramp:

$$\\text{packets per cycle} = \\sum_{k=W/2}^{W} k \\approx \\frac{W}{2}\\cdot\\frac{3W}{4} = \\frac{3W^{2}}{8}$$

One loss per cycle means the loss probability is the reciprocal of that count,
so

$$p = \\frac{8}{3W^{2}} \\quad \\Longrightarrow \\quad W = \\sqrt{\\frac{8}{3p}}$$

Substituting into $B = 3W\\,\\mathrm{MSS}/(4\\,\\mathrm{RTT})$ gives the
result usually called the TCP throughput or Mathis equation:

$$B = \\frac{\\mathrm{MSS}}{\\mathrm{RTT}}\\sqrt{\\frac{3}{2p}} = \\frac{1.2247\\,\\mathrm{MSS}}{\\mathrm{RTT}\\sqrt{p}}$$

![Achievable TCP throughput against packet loss probability on logarithmic axes, for round-trip times of twenty and forty milliseconds with a 1460-byte segment. Every decade of extra loss costs a factor of 3.16 in rate, and a loss probability of one in ten thousand caps a forty-millisecond flow at 35.8 Mbps no matter how fast the underlying link is.](/courses/fe-ee/figures/net2-loss-throughput.svg)

## 8.7 Worked example 11 — throughput from a loss rate

A path has a 40 ms round-trip time and loses one packet in ten thousand. With
MSS 1460 bytes, what rate can one TCP flow sustain, and what window does that
imply?

$$\\mathrm{MSS} = 1460 \\times 8 = 11680\\ \\mathrm{bits}, \\qquad \\sqrt{p} = \\sqrt{10^{-4}} = 0.01$$

$$B = \\frac{1.2247 \\times 11680}{0.040 \\times 0.01} = 3.576 \\times 10^{7}\\ \\mathrm{bits/s} = 35.8\\ \\mathrm{Mbps}$$

Check by the other route. The peak window implied by that loss rate is

$$W = \\sqrt{\\frac{8}{3 \\times 10^{-4}}} = \\sqrt{26667} = 163.3\\ \\mathrm{segments}$$

with a mean of $0.75 \\times 163.3 = 122.5$ segments, giving
$122.5 \\times 11680/0.040 = 3.58 \\times 10^{7}$ bits per second, the same
35.8 Mbps. The two routes agree.
The practical reading is blunt: on that path a 1 Gbps link and a 100 Mbps link
deliver the same 35.8 Mbps to a single flow, because loss and round-trip time,
not capacity, are the binding constraints.

## 8.8 Switching and routing: two lookups, two costs

A switch and a router both consult a table, but the tables are different
objects and so are their costs.

| Property | Layer 2 switch | Layer 3 router |
|---|---|---|
| Key | 48-bit MAC address | Variable-length IP prefix |
| Match | Exact | Longest prefix |
| Table built by | Learning source addresses from frames | Routing protocols and static entries |
| Unknown destination | Flooded to every other port | Dropped, ICMP unreachable returned |
| Header edited | No — addresses pass through unchanged (a VLAN tag may be added or removed) | Yes — TTL decremented and header checksum recomputed |
| Domain boundary | Ends a collision domain | Ends a broadcast domain |

The exact-match lookup is why switch tables are content-addressable memory
sized in entries, while the longest-prefix lookup is why routers need
tries or specialised search hardware. Both devices then face the same
forwarding-time choice. A **store-and-forward** device receives the entire
frame before sending any of it, so it can verify the frame check sequence but
pays a full serialisation per hop. A **cut-through** device forwards as soon
as it has read the 14-byte Ethernet header, so it pays only a header time per
hop but propagates corrupt frames. For $N$ links and $N-1$ devices:

$$t_{\\mathrm{sf}} = N\\,\\frac{L}{R} + (N-1)\\,d_{\\mathrm{proc}}$$

$$t_{\\mathrm{ct}} = \\frac{L}{R} + (N-1)\\left(\\frac{h}{R} + d_{\\mathrm{proc}}\\right)$$

## 8.9 Worked example 12 — cut-through against store-and-forward

A 1518-byte frame crosses four switches, so five links, all at 1 Gbps. Each
switch adds 2 microseconds of internal latency. Compare the two forwarding
modes.

$$\\frac{L}{R} = \\frac{12144}{10^{9}} = 12.144\\ \\mu\\mathrm{s}, \\qquad \\frac{h}{R} = \\frac{112}{10^{9}} = 0.112\\ \\mu\\mathrm{s}$$

$$t_{\\mathrm{sf}} = 5 \\times 12.144 + 4 \\times 2 = 60.72 + 8 = 68.72\\ \\mu\\mathrm{s}$$

$$t_{\\mathrm{ct}} = 12.144 + 4 \\times 2.112 = 12.144 + 8.448 = 20.592\\ \\mu\\mathrm{s}$$

Cut-through is $68.72/20.592 = 3.34$ times faster here. Two observations
finish the argument. The saving grows with hop count and with frame size but
vanishes as link rates rise, because $L/R$ shrinks while the fixed
per-switch latency does not. And cut-through cannot drop a corrupted frame,
so on a link with any appreciable error rate it wastes downstream capacity
carrying frames that will be discarded at the far end — which is why
store-and-forward is the default everywhere except low-latency trading and
cluster fabrics.`,
      examTip: 'Throughput is window over RTT, so a flow limited by cwnd or rwnd does not care how fast the link is. AIMD averages 0.75 of the peak window, and the loss-limited rate is 1.2247 x MSS/(RTT x sqrt(p)) — every decade of extra loss costs a factor of 3.16.',
      importantNote: 'rwnd is advertised by the receiver and protects the receiver; cwnd is computed by the sender and protects the network. Slow start doubles cwnd every RTT, so the time to fill a pipe is ceil(log2(WT/W0)) round trips — six on a 100 Mbps, 40 ms path, by which point only 920 kB has been sent.',
    },
    { id: 'osi-pset-a', title: '9. Problem Set A — Layers, Encapsulation, and Delay',
      content: `Six problems in the FE style, each finishable in about three minutes with a
calculator. Every one is built around a specific way of going wrong, and each
solution names the trap and the number it produces, because recognising a
plausible wrong answer is most of what the exam tests. Work all six before
reading the solutions.

## 9.1 Problem Set A — the problems

**A1.** A 1200-byte application payload is sent over TCP and IPv4 on an
Ethernet link. How many bytes occupy the medium once the preamble, the
start-frame delimiter and the interframe gap are counted, and what fraction of
that is payload?

**A2.** A 3000-byte IPv4 datagram must cross a link whose MTU is 576 bytes.
How many fragments result, what is the offset field of each, and how large is
each fragment?

**A3.** A 64-byte frame crosses a 1 Gbps link 300 m long. Find the
transmission and propagation delays, say which dominates, and give the total
one-way delay.

**A4.** A 100 Mbps router port carries 1250-byte packets arriving at 6000 per
second. Find the utilisation, the mean queueing delay and the mean time in
system. Then find the arrival rate that would double the queueing delay.

**A5.** A 2 Mbit file crosses four store-and-forward hops at 50 Mbps. Compare
sending it as one message with cutting it into 500 equal packets, ignoring
headers.

**A6.** A voice codec emits a 160-byte frame every 20 ms, carried in RTP, UDP
and IPv4 over Ethernet. Find the packet rate, the payload bit rate, the bit
rate on the medium including preamble and interframe gap, and the efficiency.

## 9.2 Problem Set A — answers, worked in full

**A1 — 1278 bytes, 93.9 % payload.** Stack the headers: 20 bytes of TCP, 20 of
IPv4, 14 of Ethernet header and 4 of frame check sequence, then 8 of preamble
and start-frame delimiter and 12 of interframe gap.

$$1200 + 20 + 20 + 14 + 4 + 8 + 12 = 1278\\ \\mathrm{bytes}$$

$$\\eta = 1200/1278 = 0.9390 = 93.9\\ \\%$$

*The trap.* Counting only the TCP and IP headers gives 1240 bytes and 96.8 %;
stopping at the frame check sequence gives 1258 bytes and 95.4 %. The question
said "occupy the medium", and the preamble and interframe gap occupy the
medium even though they carry nothing.

**A2 — six fragments.** The datagram payload is $3000 - 20 = 2980$ bytes. The
MTU leaves $576 - 20 = 556$ bytes for payload, but the offset field counts
8-byte units, so each fragment except the last must carry a multiple of 8:
the largest usable is 552.

$$2980 = 5 \\times 552 + 220$$

| Fragment | Payload (bytes) | Offset field | Byte position | Total size (bytes) | More fragments |
|---|---|---|---|---|---|
| 1 | 552 | 0 | 0 | 572 | 1 |
| 2 | 552 | 69 | 552 | 572 | 1 |
| 3 | 552 | 138 | 1104 | 572 | 1 |
| 4 | 552 | 207 | 1656 | 572 | 1 |
| 5 | 552 | 276 | 2208 | 572 | 1 |
| 6 | 220 | 345 | 2760 | 240 | 0 |

*The trap.* Using 556 bytes per fragment gives $2980/556 = 5.36$ and a
five-or-six answer with non-integer offsets, which is the tell that the
multiple-of-8 rule was skipped. Forgetting to re-add the 20-byte header to
every fragment understates each fragment's size by 20 bytes and the total
bytes on the wire by 120.

**A3 — propagation dominates; 2.012 microseconds.** A 64-byte frame is 512
bits.

$$d_{\\mathrm{trans}} = \\frac{512}{10^{9}} = 0.512\\ \\mu\\mathrm{s}, \\qquad d_{\\mathrm{prop}} = \\frac{300}{2 \\times 10^{8}} = 1.5\\ \\mu\\mathrm{s}$$

$$d = 0.512 + 1.5 = 2.012\\ \\mu\\mathrm{s}$$

Propagation is larger by $1.5/0.512 = 2.93$.

*The trap.* "It is a gigabit link, so transmission is negligible" gives
0.512 microseconds and is wrong by a factor of four. The crossover length at
this rate and frame size is $L v/R = 512 \\times 2 \\times 10^{8}/10^{9} = 102$ m,
so any span longer than about a hundred metres is already
propagation-dominated even at 1 Gbps.

**A4 — 60 %, 150 microseconds, 250 microseconds; 7500 packets per second.**

$$T_s = \\frac{1250 \\times 8}{100 \\times 10^{6}} = 10^{-4}\\ \\mathrm{s} = 100\\ \\mu\\mathrm{s}$$

$$\\rho = 6000 \\times 10^{-4} = 0.60$$

$$W_q = \\frac{0.60}{0.40} \\times 100 = 150\\ \\mu\\mathrm{s}, \\qquad T = \\frac{100}{0.40} = 250\\ \\mu\\mathrm{s}$$

Doubling the wait needs $\\rho/(1-\\rho) = 3$, so $\\rho = 0.75$ and
$\\lambda = 0.75/10^{-4} = 7500$ packets per second.

*The trap.* Assuming delay is proportional to load and answering 12,000
packets per second. It takes only a 25 % traffic increase to double the queue,
because the denominator $1 - \\rho$ falls from 0.40 to 0.25 while the numerator
rises.

**A5 — 160 ms whole, 40.24 ms segmented, a speed-up of 3.98.**

$$t_{\\text{whole}} = 4 \\times \\frac{2 \\times 10^{6}}{50 \\times 10^{6}} = 4 \\times 40 = 160\\ \\mathrm{ms}$$

Five hundred packets of 4000 bits each take $4000/(50 \\times 10^{6}) = 80$
microseconds per hop, and the pipeline costs $N - 1 = 3$ extra packet times:

$$t_{\\text{seg}} = (4 + 500 - 1) \\times 80 = 503 \\times 80 = 40240\\ \\mu\\mathrm{s} = 40.24\\ \\mathrm{ms}$$

$$\\text{speed-up} = 160/40.24 = 3.976$$

*The trap.* Dividing 160 by 4 and answering 40 ms exactly. The pipeline-fill
term $(N-1)$ never disappears; it is small here because 3 is small against
500, but a question with 20 packets instead of 500 would make it a 15 %
error.

**A6 — 50 packets per second, 64 kbps of voice, 95.2 kbps on the medium,
67.2 % efficient.** Twenty milliseconds per frame is 50 frames per second.
The payload rate is $160 \\times 8 \\times 50 = 64000$ bits per second, which is
the familiar G.711 rate and a good check that the codec numbers are being read
correctly. Wrapping costs 12 bytes of RTP, 8 of UDP, 20 of IPv4, 18 of
Ethernet header and frame check sequence, and 20 of preamble and interframe
gap:

$$160 + 12 + 8 + 20 + 18 + 20 = 238\\ \\mathrm{bytes}$$

$$B_{\\text{wire}} = 238 \\times 8 \\times 50 = 95200\\ \\mathrm{bits/s} = 95.2\\ \\mathrm{kbps}$$

$$\\eta = 160/238 = 0.6723 = 67.2\\ \\%$$

*The trap.* Provisioning a link at 64 kbps per call. The real load is
$95200/64000 = 1.4875$ times that, so a link sized for 100 calls at the codec
rate carries only 67. Doubling the packetisation interval to 40 ms would raise
efficiency to $320/398 = 80.4$ % but add 20 ms of one-way delay to every
packet, which is the trade every voice deployment argues about.`,
      examTip: 'When a question says "on the wire" or "on the medium", decide whether the preamble and interframe gap are included before you compute anything: 58 bytes of overhead becomes 78, and a 1200-byte payload moves from 95.4 % efficient to 93.9 %.',
    },
    { id: 'osi-pset-b', title: '10. Problem Set B — Windows, Throughput, and Congestion',
      content: `Six more, aimed at the transport layer. These are the questions that separate
students who have memorised formulas from students who know which quantity is
in which units, so every answer below carries its units through the whole
chain.

## 10.1 Problem Set B — the problems

**B1.** A 500 Mbps path has a 60 ms round-trip time. Find the bandwidth-delay
product in bytes, the number of 1460-byte segments that represents, and the
smallest window scale factor that lets TCP advertise it.

**B2.** A satellite link runs at 1 Mbps with a one-way propagation delay of
270 ms and carries 1000-byte frames. Find the stop-and-wait efficiency and
throughput, and the window needed for full utilisation.

**B3.** A link has a bit error rate of $2 \\times 10^{-7}$ and carries
12,000-bit frames. Find the frame error probability, the mean transmissions
per delivered frame, and the effective throughput on a 100 Mbps link with a
window large enough to cover the pipe.

**B4.** A TCP connection with MSS 1460 bytes, an initial window of 10 segments
and a 25 ms round-trip time transfers a 1,000,000-byte object with no loss and
no link limit. How many round trips of data does it take?

**B5.** A flow on a 30 ms path shows its congestion window oscillating between
30 and 60 segments of 1460 bytes. Find the average throughput and the packet
loss probability that sawtooth implies.

**B6.** A 9000-byte jumbo frame crosses three switches, so four links, at
10 Gbps with 1.5 microseconds of latency per switch. Compare store-and-forward
with cut-through.

## 10.2 Problem Set B — answers, worked in full

**B1 — 3,750,000 bytes, 2569 segments, scale factor 6.**

$$\\mathrm{BDP} = 500 \\times 10^{6} \\times 0.060 = 3.0 \\times 10^{7}\\ \\mathrm{bits}$$

$$W = \\frac{3.0 \\times 10^{7}}{8} = 3750000\\ \\mathrm{bytes}, \\qquad \\frac{3750000}{1460} = 2568.5 \\rightarrow 2569\\ \\text{segments}$$

The unscaled window field holds 65,535 bytes, so the multiplier needed is
$3750000/65535 = 57.2$, and the scale is a power of two:
$2^{6} = 64 \\ge 57.2$, so $s = 6$.

*The trap.* Reporting 30 Mbit as though it were bytes, which overstates the
window by eight and the scale factor by three shifts. Always divide by eight
before comparing with a window field, which is specified in bytes.

**B2 — 1.46 %, 14.6 kbps, and a 69-frame window.**

$$T_t = \\frac{8000}{10^{6}} = 8\\ \\mathrm{ms}, \\qquad \\mathrm{RTT} = 2 \\times 270 = 540\\ \\mathrm{ms}$$

$$\\eta = \\frac{8}{8 + 540} = \\frac{8}{548} = 0.01460 = 1.46\\ \\%$$

$$B_{\\mathrm{eff}} = 0.01460 \\times 10^{6} = 14.6\\ \\mathrm{kbps}$$

$$a = \\frac{270}{8} = 33.75, \\qquad 1 + 2a = 68.5 \\rightarrow W = 69\\ \\text{frames}$$

Check the rounding: 68 frames gives $68 \\times 8/548 = 0.9927$ and 69 gives
1.007, so 69 is the smallest integer that saturates the link.

*The trap.* Using the one-way 270 ms instead of the round trip, which gives
$8/278 = 2.88$ %, nearly double the true figure. The acknowledgement has to
come back before the sender may proceed, so the cycle is a round trip.

**B3 — 0.0024, 1.0024 transmissions, 99.76 Mbps.**

$$p_f = 1 - (1 - 2 \\times 10^{-7})^{12000} = 0.0023971$$

$$E[k] = \\frac{1}{1 - 0.0023971} = 1.0024$$

$$B_{\\mathrm{eff}} = 100 \\times (1 - 0.0023971) = 99.76\\ \\mathrm{Mbps}$$

The linear approximation $n p_b = 12000 \\times 2 \\times 10^{-7} = 0.0024$
matches to four figures, because $n p_b$ is well under one.

*The trap.* Treating the bit error rate as a frame error rate and answering
99.99998 Mbps. A frame is 12,000 chances to be destroyed, not one, and the
factor between the two answers is the frame length in bits.

**B4 — seven round trips.** The window doubles each round, so cumulative
segments after $n$ rounds are $10(2^{n} - 1)$:

$$10\\left(2^{6} - 1\\right) \\times 1460 = 630 \\times 1460 = 919800\\ \\mathrm{bytes}$$

which is short of a million, while

$$10\\left(2^{7} - 1\\right) \\times 1460 = 1270 \\times 1460 = 1854200\\ \\mathrm{bytes}$$

covers it. Seven rounds of data, or $7 \\times 25 = 175$ ms, and the handshake
adds one more round trip before any of it.

*The trap.* Dividing the object by the final window and calling that the
number of rounds. The window is different in every round, so only the
geometric sum answers the question; using the seventh-round window of 640
segments alone suggests two rounds.

**B5 — 17.52 Mbps and a loss probability near $7.5 \\times 10^{-4}$.** The mean
of the sawtooth is $(30 + 60)/2 = 45$ segments.

$$B = \\frac{45 \\times 1460 \\times 8}{0.030} = 1.752 \\times 10^{7}\\ \\mathrm{bits/s} = 17.52\\ \\mathrm{Mbps}$$

One cycle climbs from 30 to 59 segments, one per round trip, and delivers

$$\\sum_{k=30}^{59} k = \\frac{30\\,(30 + 59)}{2} = 1335\\ \\text{packets}$$

for exactly one loss, so $p = 1/1335 = 7.49 \\times 10^{-4}$. The continuous
approximation $3W^{2}/8 = 3 \\times 3600/8 = 1350$ agrees to about one percent,
and feeding $p$ back through the square-root law returns 17.4 Mbps, which
closes the loop.

*The trap.* Using the peak window of 60 segments and answering 23.36 Mbps,
33 % high. AIMD spends most of its time below the peak, and the average of a
linear ramp is its midpoint, not its top.

**B6 — 33.3 microseconds against 11.73, a factor of 2.84.**

$$\\frac{L}{R} = \\frac{72000}{10^{10}} = 7.2\\ \\mu\\mathrm{s}, \\qquad \\frac{h}{R} = \\frac{112}{10^{10}} = 0.0112\\ \\mu\\mathrm{s}$$

$$t_{\\mathrm{sf}} = 4 \\times 7.2 + 3 \\times 1.5 = 28.8 + 4.5 = 33.3\\ \\mu\\mathrm{s}$$

$$t_{\\mathrm{ct}} = 7.2 + 3 \\times 1.5112 = 7.2 + 4.5336 = 11.73\\ \\mu\\mathrm{s}$$

*The trap.* Forgetting that the source still has to serialise the whole frame
onto the first link, which gives 4.53 microseconds and an impossible answer —
the frame cannot arrive faster than it can be sent. Note also that at 10 Gbps
the header time of 11.2 nanoseconds is negligible against the 1.5 microsecond
switch latency, so the cut-through advantage here is almost entirely the
saving of three full serialisations.`,
      examTip: 'Carry units through every step. Bandwidth-delay products come out in bits and window fields are in bytes; MSS is quoted in bytes and throughput in bits per second. Most wrong answers in this set are the right number off by a factor of eight.',
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
    { id: 'subnet-binary', title: '4. The Binary Method: Masks, ANDing, and the Address Map',
      content: `## 4.1 Why the Mask Is a Row of Ones

The block-size shortcut in section 3 is fast, but it is a shortcut for
something, and questions that use an unusual mask or ask for a wildcard are
easier if you know what it stands for. A subnet mask is a 32-bit number whose
**network bits are 1 and whose host bits are 0**, and it must be contiguous —
ones first, zeros after, never interleaved. The router computes the network
address by a bitwise AND of the address with the mask:

For 192.168.10.147 with mask 255.255.255.192 (a /26):

| | Binary |
|---|---|
| Address | 11000000 10101000 00001010 **10**010011 |
| Mask | 11111111 11111111 11111111 **11**000000 |
| Network (AND) | 11000000 10101000 00001010 **10**000000 |

The AND clears the last six bits, giving **192.168.10.128**. Setting those six
bits instead gives the broadcast address 192.168.10.191, and the 62 addresses
between them are the usable hosts. Notice that the two highlighted bits are
the *subnet* bits borrowed from the host portion — value binary 10, which is
subnet **index 2** counting from zero, and therefore the **third** of the four
blocks the /26 creates, the one listed as subnet 3 in section 3.1.

The **wildcard mask** is the bitwise complement, used by access lists and by
OSPF network statements:

| Prefix | Subnet mask | Wildcard mask | Block | Usable hosts |
|---|---|---|---|---|
| /25 | 255.255.255.128 | 0.0.0.127 | 128 | 126 |
| /26 | 255.255.255.192 | 0.0.0.63 | 64 | 62 |
| /27 | 255.255.255.224 | 0.0.0.31 | 32 | 30 |
| /28 | 255.255.255.240 | 0.0.0.15 | 16 | 14 |
| /30 | 255.255.255.252 | 0.0.0.3 | 4 | 2 |

The mask and wildcard always sum to 255.255.255.255, which is the fastest way
to convert between them under exam pressure.

## 4.2 Reading a VLSM Allocation as an Address Map

The four-department allocation from section 3 is easier to check when it is
drawn as the address space it actually occupies:

![The 256 addresses of 192.168.10.0/24 drawn as a single bar and partitioned by the largest-first VLSM allocation. Department A takes a 128-address slash 25 block, B a 64-address slash 26, C a 32-address slash 27, D a 16-address slash 28, leaving a free slash 28 at the top. An inner bar in each block shows how many hosts the department actually needs, so the unused remainder is visible.](/courses/fe-ee/figures/net-subnet-partition.svg)

Every block boundary in the figure is computed from the mask, not placed by
hand, and it makes the rule that governs valid subnets visible: **each block
starts at an address that is a multiple of its own size**. A /26 block can
begin at .0, .64, .128 or .192 and nowhere else; a /28 block can begin at .0,
.16, .32 and so on. An exam option that offers "192.168.10.100/26" as a
network address is wrong for exactly this reason — 100 is not a multiple of 64.

The figure also shows the waste that VLSM is designed to limit. The four
departments need 185 addresses in total; the allocation consumes 240 of the
256 available and supplies 232 usable ones. The overhead has two sources: each
subnet surrenders two addresses to its own network and broadcast (eight in
total here), and each department is rounded up to the next power of two.
Department C needs 25 hosts and receives 30, because a /28 would supply only
14 and there is nothing in between.

## 4.3 Allocating in the Wrong Order

The rule "largest first" is worth testing rather than memorising. Suppose the
same four departments are allocated smallest first from 192.168.10.0/24:

| Order | Department | Prefix | Block starts at | Legal? |
|---|---|---|---|---|
| 1 | D (10 hosts) | /28 | .0 | yes |
| 2 | C (25 hosts) | /27 | .32 | .16 is skipped — 16 is not a multiple of 32 |
| 3 | B (50 hosts) | /26 | .64 | .64 works; C already ends at .63 |
| 4 | A (100 hosts) | /25 | .128 | fits, with nothing left over |

Sixteen addresses, .16 through .31, are stranded — too small for any remaining
department and not contiguous with anything else, and the whole /24 is now
consumed with no free block at all. Compare the largest-first order of section
3.3, which ends at .239 and leaves a clean, aligned /28 free at .240.
Largest-first allocation avoids stranding because a large block placed at the
bottom always leaves an aligned boundary for the next-smaller block to start
on.

## 4.4 The Three Special Cases at the Bottom of the Table

The formula 2^(32−n) − 2 has three exceptions the exam enjoys:

| Prefix | Total addresses | Usable | Why |
|---|---|---|---|
| /30 | 4 | 2 | The classic point-to-point link between two routers |
| /31 | 2 | 2 | RFC 3021 removes network and broadcast for point-to-point links |
| /32 | 1 | 1 | A single host route, used for loopbacks and static routes |

A /31 looks like it should have 2 − 2 = 0 usable addresses. RFC 3021 makes an
explicit exception: on a link with exactly two endpoints there is nobody to
broadcast to, so both addresses are assignable. This halves the address
consumption of a large router network, which mattered enormously before IPv6.`,
      examTip: 'Network address = address AND mask; broadcast = network OR wildcard. Mask + wildcard = 255.255.255.255 always, which converts one to the other in a second.',
      importantNote: 'A valid network address is always a multiple of its own block size. 192.168.10.100/26 cannot be a network address because 100 is not a multiple of 64 — spotting this eliminates wrong options immediately.',
    },
    { id: 'subnet-nat-ipv6', title: '5. Aggregation, NAT, DHCP, and IPv6 Addressing',
      content: `## 5.1 Route Aggregation: Subnetting Run Backwards

Subnetting borrows host bits to make more networks. **Aggregation** (also
called supernetting or route summarisation) gives bits back to advertise many
networks as one, which is what keeps the global routing table from exploding.

**Worked example.** A branch office owns 172.16.4.0/24, 172.16.5.0/24,
172.16.6.0/24 and 172.16.7.0/24. Summarise them into one advertisement.

Write the third octet in binary and find the bits they all share:

| Network | Third octet | Binary |
|---|---|---|
| 172.16.4.0/24 | 4 | 000001**00** |
| 172.16.5.0/24 | 5 | 000001**01** |
| 172.16.6.0/24 | 6 | 000001**10** |
| 172.16.7.0/24 | 7 | 000001**11** |

The first six bits of the third octet are identical and the last two vary.
Sixteen bits are common in the first two octets, so the summary prefix is
16 + 6 = **/22**, and the aggregate is **172.16.4.0/22** — 1024 addresses,
1022 usable, advertised as a single route instead of four.

Two conditions must hold, and questions are usually built by breaking one of
them. The blocks must be **contiguous**, and the aggregate must start on a
boundary that is a multiple of its own size: 172.16.4.0 works for a /22
because 4 is a multiple of 4. The set 172.16.5.0/24 through 172.16.8.0/24
cannot be summarised into a single /22, because it straddles the boundary at
172.16.8.0.

## 5.2 NAT and PAT: One Public Address, Many Hosts

Network address translation rewrites the source IP of outbound packets to the
router's public address and reverses the rewrite on the way back. **PAT**
(port address translation, or NAT overload) is the version everyone actually
runs: it also rewrites the **source port**, so one public address can serve
many hosts at once.

| Inside address:port | Translated to | Return traffic matched on |
|---|---|---|
| 10.1.2.50:51001 | 203.0.113.9:51001 | destination port 51001 |
| 10.1.2.51:51001 | 203.0.113.9:51002 | destination port 51002 |
| 10.1.2.52:44300 | 203.0.113.9:44300 | destination port 44300 |

The capacity of that table is bounded by the 16-bit port field: 65535 usable
ports per public address, of which the IANA dynamic range 49152 to 65535 gives
**16384** freely assignable ports. In practice a single public address
supports thousands of simultaneously active hosts, which is why RFC 1918
private space plus PAT postponed IPv4 exhaustion by two decades.

The cost is that NAT breaks the end-to-end model. An inside host has no
reachable address from outside, so inbound connections need explicit port
forwarding, and any protocol that carries an IP address inside its payload
needs a helper to rewrite it.

## 5.3 DHCP: How a Host Gets Its Address

DHCP is a four-message exchange, remembered as **DORA**, carried over UDP with
the **server on port 67 and the client on port 68**:

| Step | Message | Direction | Notes |
|---|---|---|---|
| D | Discover | client broadcast | Client has no address yet, so source is 0.0.0.0 |
| O | Offer | server | Proposes an address, mask, gateway, DNS, lease time |
| R | Request | client broadcast | Broadcast so declined offers are withdrawn |
| A | Acknowledge | server | Lease is now binding |

Because Discover is a broadcast it cannot cross a router. A DHCP **relay
agent** on the router forwards it as a unicast to a central server, which is
how one server can address dozens of subnets. If no server answers, a host
self-assigns from **169.254.0.0/16** (link-local, sometimes called APIPA) —
seeing a 169.254 address in a troubleshooting question is a direct statement
that DHCP failed.

## 5.4 IPv6 Notation and Subnetting

IPv6 addresses are 128 bits written as eight groups of four hex digits. Two
compression rules apply, and both are needed to read exam options:

1. Leading zeros in any group may be dropped.
2. One run of all-zero groups may be replaced by :: — **once only**, because
   two such runs would be ambiguous.

2001:0db8:0000:0000:0000:ff00:0042:8329 compresses to
**2001:db8::ff00:42:8329**.

Subnetting is unusually simple because the host portion is fixed at 64 bits by
convention. A site given a /48 subnets it to /64s:

| Quantity | Bits | Count |
|---|---|---|
| Subnets available in a /48 | 64 − 48 = 16 | 2^16 = 65,536 |
| Addresses in each /64 | 64 | 2^64 ≈ 1.845 × 10^19 |
| Total IPv6 space | 128 | 2^128 ≈ 3.403 × 10^38 |

Sixty-five thousand subnets for one site sounds absurd until you notice that
the point is to make subnetting arithmetic disappear — nobody sizes an IPv6
subnet to its host count. Note also what IPv6 removes: there is **no broadcast
address**, its role taken by multicast (ff00::/8) and anycast, so the all-ones
interface identifier is an ordinary assignable address. The all-zeros pattern
is *not* free, however — RFC 4291 reserves it as the **subnet-router anycast
address**, and RFC 2526 reserves the top 128 identifiers as well, so a /64
supplies 2^64 − 129 assignable addresses rather than the full 2^64. The
difference is invisible in practice and the reason is worth knowing: with
2^64 ≈ 1.845 × 10^19 addresses in every subnet, IPv6 can afford reservations
that IPv4 could not.

| Special address | IPv4 equivalent | Purpose |
|---|---|---|
| ::1 | 127.0.0.1 | Loopback |
| fe80::/10 | 169.254.0.0/16 | Link-local, auto-configured |
| ff00::/8 | 224.0.0.0/4 | Multicast |
| :: | 0.0.0.0 | Unspecified source before configuration |`,
      examTip: 'To summarise a set of networks, write the varying octet in binary and count the leading bits they all share; the prefix length is that count plus the bits before the octet. The aggregate must also start on a multiple of its own block size.',
      importantNote: 'The :: compression may appear only ONCE in an IPv6 address, because two runs of zeros collapsed the same way could not be expanded unambiguously. DHCP uses UDP 67 (server) and 68 (client); a 169.254.x.x address means DHCP failed.',
    },
    { id: 'subnet-binary-arith', title: '6. Address Arithmetic from First Principles',
      content: `## 6.1 An address is one integer, written four ways

Dotted decimal is a display convention, nothing more. An IPv4 address is a
single unsigned 32-bit integer, and the four octets are its base-256 digits:

$$A = a_3\\,2^{24} + a_2\\,2^{16} + a_1\\,2^{8} + a_0$$

Every operation in this chapter is integer arithmetic on that number, and
doing it that way removes the octet boundary as a source of confusion. Write
$n$ for the prefix length and $m$ for the number of host bits:

$$m = 32 - n$$

The **block size**, the number of addresses the prefix covers, is $2^{m}$, and
the **mask** is the integer whose top $n$ bits are ones:

$$M = 2^{32} - 2^{m}$$

The **wildcard**, used by access lists and by OSPF network statements, is the
complement, which is also one less than the block size:

$$W = 2^{m} - 1 = 2^{32} - 1 - M$$

so mask and wildcard always sum to $2^{32} - 1$, which is why 255.255.255.255
minus one gives the other in a second.

## 6.2 Worked example 1 — converting a prefix to a mask and back

Convert /21 to a dotted-decimal mask, then convert 255.255.240.0 back to a
prefix.

$$m = 32 - 21 = 11, \\qquad M = 2^{32} - 2^{11} = 4294967296 - 2048 = 4294965248$$

Break that integer into octets. The top sixteen bits are all ones, giving
255.255. The third octet holds the remaining $21 - 16 = 5$ network bits:

$$128 + 64 + 32 + 16 + 8 = 248$$

so /21 is **255.255.248.0**, and the wildcard is 0.0.7.255 because
$2^{11} - 1 = 2047 = 7 \\times 256 + 255$.

Going the other way, 240 in binary is 11110000, four ones, so the mask
carries $8 + 8 + 4 = 20$ network bits and 255.255.240.0 is **/20**. The habit
worth building is to memorise only the eight possible non-trivial octet
values, because a mask octet is always one of them:

| Ones in the octet | Octet value | Wildcard octet | Block size in that octet |
|---|---|---|---|
| 1 | 128 | 127 | 128 |
| 2 | 192 | 63 | 64 |
| 3 | 224 | 31 | 32 |
| 4 | 240 | 15 | 16 |
| 5 | 248 | 7 | 8 |
| 6 | 252 | 3 | 4 |
| 7 | 254 | 1 | 2 |
| 8 | 255 | 0 | 1 |

## 6.3 Network and broadcast without writing any binary

The network address is the address with its host bits cleared, which is a
bitwise AND — but it is also, and more usefully for mental arithmetic, the
address rounded **down** to the nearest multiple of the block size:

$$N = A \\wedge M = \\left\\lfloor \\frac{A}{2^{m}} \\right\\rfloor 2^{m}$$

The broadcast address sets those same bits, which is an OR with the wildcard,
or equivalently the last address of the block:

$$B = N \\vee W = N + 2^{m} - 1$$

The usable range is everything strictly between them, so the first host is
$N+1$, the last is $B-1$, and the count is

$$H = 2^{m} - 2 \\qquad (m \\ge 2)$$

## 6.4 Worked example 2 — a /21 that ignores the octet boundary

Find the network, broadcast, usable range and host count for
10.117.203.19/21.

The prefix is 21, so $m = 11$ and the block is $2^{11} = 2048$ addresses. As
an integer,

$$A = 10 \\times 2^{24} + 117 \\times 2^{16} + 203 \\times 2^{8} + 19 = 175491859$$

$$\\left\\lfloor \\frac{175491859}{2048} \\right\\rfloor = 85689, \\qquad N = 85689 \\times 2048 = 175491072$$

and 175,491,072 converts back to **10.117.200.0**. The broadcast is
$N + 2047$, which is **10.117.207.255**, so the usable range runs from
10.117.200.1 to 10.117.207.254 and

$$H = 2^{11} - 2 = 2046$$

The octet shortcut gives the same thing faster once you trust it. With eleven
host bits, three of them live in the third octet, so the third-octet block
size is $2^{3} = 8$: the /21 boundaries are 0, 8, 16, ... and 203 rounds down
to 200. The fourth octet contributes its full 256 addresses, hence
$8 \\times 256 = 2048$.

![Total and usable addresses in a block against prefix length, on a logarithmic scale from a slash eight down to a slash thirty. Each extra prefix bit halves the block, and the two curves are indistinguishable for large blocks but diverge sharply at the small end where subtracting the network and broadcast addresses removes a significant fraction: a slash twenty-four supplies 254 usable, a slash twenty-six supplies 62 and a slash thirty supplies only two.](/courses/fe-ee/figures/net2-prefix-capacity.svg)

## 6.5 Why exactly two addresses are lost, and when they are not

The subtraction of two is not a convention; each of the two addresses has a
job that would make it ambiguous as a host identifier.

The **all-zeros host pattern** is the name of the subnet itself. It is what
appears in a routing table entry, in a summary advertisement and in an access
list, and it is what "10.117.200.0/21" means. If a host answered to it, every
routing statement about the subnet would also be a statement about that host.

The **all-ones host pattern** is the directed broadcast, delivered to every
interface on the link. A frame sent to it is expanded to the layer-2 broadcast
address, so assigning it to one host would give that host's traffic to
everybody.

Two prefixes escape the rule:

| Prefix | Addresses | Usable | Reason |
|---|---|---|---|
| /31 | 2 | 2 | RFC 3021: a link with exactly two ends has nobody to broadcast to |
| /32 | 1 | 1 | A host route, not a subnet; no link and therefore no broadcast |

The /31 case is pure arithmetic in its motivation. A router network with 1000
point-to-point links spends $1000 \\times 4 = 4000$ addresses on /30s but only
$1000 \\times 2 = 2000$ on /31s, a saving of exactly half.

## 6.6 Classful addressing, and the arithmetic that killed it

Before 1993 the prefix was not carried at all: it was inferred from the
leading bits of the address itself.

| Class | Leading bits | First octet | Implied prefix | Networks | Hosts per network |
|---|---|---|---|---|---|
| A | 0 | 1 to 126 | /8 | 126 | 16,777,214 |
| B | 10 | 128 to 191 | /16 | 16,384 | 65,534 |
| C | 110 | 192 to 223 | /24 | 2,097,152 | 254 |
| D | 1110 | 224 to 239 | multicast | — | — |
| E | 1111 | 240 to 255 | reserved | — | — |

The host counts come straight from the formula: $2^{24} - 2 = 16777214$,
$2^{16} - 2 = 65534$, $2^{8} - 2 = 254$. The problem is the gap between the
last two. An organisation needing 500 addresses could not use a class C, and
a class B handed it 65,534 — a hundred and thirty times more than it asked
for. **CIDR** (RFC 4632) removed the inference and made the prefix explicit,
so any length from /0 to /32 became available and the granularity between
tiers disappeared.

![Address efficiency against host requirement under power-of-two allocation. Because the prefix chosen is the smallest whose usable count covers the requirement, efficiency sawtooths: it climbs toward one hundred percent just below each power of two and then collapses to just above fifty percent the moment the requirement crosses it. Five hundred hosts into a slash twenty-three uses 97.7 percent of the block; two hundred and fifty-five hosts need the same slash twenty-three and use only 49.8 percent.](/courses/fe-ee/figures/net2-alloc-efficiency.svg)

The prefix a requirement of $H$ hosts forces is

$$m = \\left\\lceil \\log_2 (H + 2) \\right\\rceil, \\qquad n = 32 - m$$

and the efficiency of that choice is

$$\\eta = \\frac{H}{2^{m}}, \\qquad \\tfrac{1}{2} < \\eta \\le 1$$

The lower bound is worth stating explicitly: rounding to a power of two can
never waste more than half a block, and the worst case is a requirement one
host above a power of two.

## 6.7 Worked example 3 — what a classful allocation cost

An organisation needs 500 host addresses. Compare the classful answer with
the CIDR answer.

Classful: a class C supplies $2^{8} - 2 = 254$, which is too few, so the
organisation is given a class B.

$$\\eta_{\\mathrm{B}} = 500/65536 = 0.00763 = 0.763\\ \\%$$

$$\\text{addresses wasted} = 65536 - 500 = 65036$$

CIDR: $m = \\lceil \\log_2 502 \\rceil = 9$, so the allocation is a **/23**
supplying $2^{9} - 2 = 510$ usable addresses.

$$\\eta_{\\mathrm{CIDR}} = 500/512 = 0.9766 = 97.7\\ \\%$$

The same requirement, satisfied 128 times more efficiently. Multiply 65,036
wasted addresses by the tens of thousands of class B assignments made in the
1980s and the whole IPv4 exhaustion story is in that one subtraction.`,
      examTip: 'Network address = the address rounded DOWN to a multiple of the block size 2^(32-n); broadcast = network + block - 1. The mask and wildcard sum to 255.255.255.255, and only eight octet values can ever appear in a mask: 128, 192, 224, 240, 248, 252, 254, 255.',
      importantNote: 'The two lost addresses are the subnet name (all-zero host bits) and the directed broadcast (all-one host bits), which is why 2^(32-n) - 2 is the count. RFC 3021 exempts /31 because a two-ended link has nobody to broadcast to, halving the address cost of a large router network.',
    },
    { id: 'subnet-vlsm-depth', title: '7. Subnetting to a Requirement, and VLSM in Full',
      content: `## 7.1 Two constraints meeting at one prefix

A subnetting question hands you a parent prefix $n$ and asks for $S$ subnets
of at least $H$ hosts each. Those are two separate constraints on the same
number of borrowed bits $b$:

$$2^{b} \\ge S \\quad \\Longrightarrow \\quad b \\ge \\left\\lceil \\log_2 S \\right\\rceil$$

$$2^{32 - n - b} - 2 \\ge H \\quad \\Longrightarrow \\quad b \\le 32 - n - \\left\\lceil \\log_2 (H+2) \\right\\rceil$$

If the two bounds cross, no single-mask answer exists and the block is simply
too small — a legitimate exam answer, and one that students rarely offer.
Where both hold, take the **smaller** $b$ that satisfies the subnet count,
because every extra borrowed bit halves the hosts per subnet for no reason.

The resulting subnets are laid out at multiples of the new block size:

$$N_k = N_0 + k\\,2^{32-n-b}, \\qquad k = 0, 1, \\ldots, 2^{b}-1$$

which is the formal statement of the rule that a network address is always a
multiple of its own block size.

## 7.2 Worked example 4 — six subnets of at least 25 hosts

Subnet 192.168.40.0/24 into at least six subnets, each supporting at least 25
hosts. Give the layout and the address utilisation.

Subnet-count constraint: $2^{2} = 4 < 6$ and $2^{3} = 8 \\ge 6$, so $b = 3$
and the new prefix is **/27**.

Host constraint check: $2^{32-27} - 2 = 30 \\ge 25$, satisfied with five to
spare. Block size is 32.

| Subnet | Network | First host | Last host | Broadcast | Usable |
|---|---|---|---|---|---|
| 0 | 192.168.40.0/27 | .1 | .30 | .31 | 30 |
| 1 | 192.168.40.32/27 | .33 | .62 | .63 | 30 |
| 2 | 192.168.40.64/27 | .65 | .94 | .95 | 30 |
| 3 | 192.168.40.96/27 | .97 | .126 | .127 | 30 |
| 4 | 192.168.40.128/27 | .129 | .158 | .159 | 30 |
| 5 | 192.168.40.160/27 | .161 | .190 | .191 | 30 |
| 6 | 192.168.40.192/27 | .193 | .222 | .223 | 30 |
| 7 | 192.168.40.224/27 | .225 | .254 | .255 | 30 |

Now count the waste three ways, because questions ask for all three. Usable
addresses supplied across the whole /24:

$$8 \\times 30 = 240 \\ \\text{of}\\ 256$$

so 16 addresses, one pair per subnet, went to network and broadcast.
Addresses actually requested:

$$6 \\times 25 = 150, \\qquad 150/256 = 0.5859 = 58.6\\ \\%$$

And two entire subnets, $2 \\times 32 = 64$ addresses, are unallocated — which
is not waste at all if the organisation expects to grow, and is the reason
the subnet-count constraint is a floor rather than an equality.

## 7.3 Worked example 5 — placing a host and finding its neighbours

Where does 203.0.113.201/28 sit, and what are the blocks either side of it?

Block size is $2^{4} = 16$, so boundaries fall at every multiple of 16.

$$\\left\\lfloor 201/16 \\right\\rfloor = 12, \\qquad N = 12 \\times 16 = 192$$

The host lives in **203.0.113.192/28**, whose broadcast is
$192 + 16 - 1 = 207$ and whose usable range is .193 to .206, fourteen
addresses. The preceding block is 203.0.113.176/28 (.176 to .191) and the
following one is 203.0.113.208/28 (.208 to .223).

The check that catches most errors takes two seconds: 201 is inside the range
193 to 206, and 192 is a multiple of 16. If a candidate network address is not
a multiple of the block size it is not a network address, whatever else is
true about it.

## 7.4 VLSM: one block, many prefix lengths

Fixed-length subnetting forces every segment to the same size, so a
point-to-point link between two routers consumes as many addresses as a floor
full of workstations. **Variable-length subnet masking** allocates each
segment the smallest prefix that covers its own requirement. The procedure is
mechanical:

1. Sort the segments by requirement, **largest first**.
2. For each, take $m = \\lceil \\log_2 (H+2) \\rceil$ and prefix $32 - m$.
3. Place it at the next free address, which is automatically a multiple of
   its own block size because every block already placed is larger.
4. Advance the cursor by the block size and repeat.

Step 3 is the whole reason for step 1. A block of size $2^{m}$ placed after
blocks that are all at least $2^{m}$ in size starts at a multiple of $2^{m}$
without any adjustment, so largest-first allocation can never strand
addresses. Smallest-first can, as section 4.3 showed.

![The 1024 addresses of a slash twenty-two campus block, partitioned by a largest-first VLSM allocation across nine segments. Engineering takes a slash twenty-three, wireless and sales a slash twenty-five each, operations a slash twenty-six, the laboratory a slash twenty-seven, voice a slash twenty-eight and three router links a slash thirty each, leaving 132 addresses free at the top. Within each block an inner bar marks the hosts actually required, so the rounding-up waste is visible block by block.](/courses/fe-ee/figures/net2-vlsm-campus.svg)

## 7.5 Worked example 6 — a nine-segment campus from a /22

Allocate 172.20.8.0/22 across six user segments needing 300, 120, 100, 60, 25
and 12 hosts, plus three router-to-router links.

Sorted largest first, each requirement forces a prefix, and the cursor starts
at 172.20.8.0:

| Segment | Hosts needed | Prefix | Network | Usable range | Broadcast | Usable |
|---|---|---|---|---|---|---|
| Engineering | 300 | /23 | 172.20.8.0 | 172.20.8.1 to 172.20.9.254 | 172.20.9.255 | 510 |
| Wireless | 120 | /25 | 172.20.10.0 | 172.20.10.1 to 172.20.10.126 | 172.20.10.127 | 126 |
| Sales | 100 | /25 | 172.20.10.128 | 172.20.10.129 to 172.20.10.254 | 172.20.10.255 | 126 |
| Operations | 60 | /26 | 172.20.11.0 | 172.20.11.1 to 172.20.11.62 | 172.20.11.63 | 62 |
| Laboratory | 25 | /27 | 172.20.11.64 | 172.20.11.65 to 172.20.11.94 | 172.20.11.95 | 30 |
| Voice | 12 | /28 | 172.20.11.96 | 172.20.11.97 to 172.20.11.110 | 172.20.11.111 | 14 |
| Router link 1 | 2 | /30 | 172.20.11.112 | 172.20.11.113 to 172.20.11.114 | 172.20.11.115 | 2 |
| Router link 2 | 2 | /30 | 172.20.11.116 | 172.20.11.117 to 172.20.11.118 | 172.20.11.119 | 2 |
| Router link 3 | 2 | /30 | 172.20.11.120 | 172.20.11.121 to 172.20.11.122 | 172.20.11.123 | 2 |

Three checks turn this from a table into an answer. Every prefix is the
smallest that works: engineering needs 300 and a /24 supplies only 254, so
/23 it is; wireless needs 120 and a /26 supplies only 62, so /25. Every
network address is a multiple of its block size — 172.20.10.128 is a legal
/25 start because 128 is a multiple of 128, and 172.20.11.112 is a legal /30
start because 112 is a multiple of 4. And the totals close:

$$512 + 128 + 128 + 64 + 32 + 16 + 4 + 4 + 4 = 892\\ \\text{addresses committed}$$

$$510 + 126 + 126 + 62 + 30 + 14 + 2 + 2 + 2 = 874\\ \\text{usable supplied}$$

$$892 - 874 = 18 = 9 \\times 2\\ \\text{lost to network and broadcast}$$

$$300 + 120 + 100 + 60 + 25 + 12 + 2 + 2 + 2 = 623\\ \\text{requested}$$

$$1024 - 892 = 132\\ \\text{addresses left free}$$

The free remainder is not a scattered residue: it is 172.20.11.124/30 and
172.20.11.128/25, both properly aligned and both immediately usable for a
tenth and eleventh segment.

## 7.6 Worked example 7 — sizing the parent block, and auditing the result

Two follow-up questions that the same table answers.

**How small a parent block could have served this campus?** The blocks pack
contiguously from offset 0 to offset 892, so any parent of at least 892
addresses works, and parents come in powers of two:

$$2^{9} = 512 < 892 \\le 1024 = 2^{10} \\quad \\Longrightarrow \\quad \\text{a /22 is the minimum}$$

A /23 could not hold the engineering segment plus anything else at all, since
engineering alone takes 512 of the 512 addresses a /23 contains.

**How efficient is the allocation?** Two ratios, and questions ask for either:

$$\\frac{623}{1024} = 0.6084 = 60.8\\ \\%\\ \\text{of the parent block}$$

$$\\frac{623}{892} = 0.6984 = 69.8\\ \\%\\ \\text{of what was committed}$$

The gap between them is the 132 free addresses, and the gap between 69.8 %
and 100 % has two causes worth separating. Eighteen addresses went to network
and broadcast, which is unavoidable. The remaining 251 went to rounding: the
laboratory asked for 25 and received a block of 32, wireless asked for 120 and
received 128. That is the price of power-of-two allocation, and section 6.6
bounds it — no segment can ever waste more than half its block.`,
      examTip: 'Take the SMALLER number of borrowed bits that satisfies the subnet count: every extra bit halves the hosts per subnet for nothing. Then verify both constraints separately — 2^b >= subnets AND 2^(32-n-b) - 2 >= hosts — because a question whose two constraints cross has "impossible from this block" as its answer.',
      importantNote: 'Largest-first VLSM can never strand addresses, because a block placed after larger blocks automatically lands on a multiple of its own size. Always audit with three sums: addresses committed, usable supplied, and addresses requested. Committed minus usable must equal twice the number of subnets.',
    },
    { id: 'subnet-agg-nat-v6', title: '8. Summarisation, Longest-Prefix Match, NAT and IPv6 Arithmetic',
      content: `## 8.1 Summarisation is subnetting run backwards

Section 5.1 introduced aggregation on four networks. The general statement:
$k$ consecutive blocks of prefix $n$ combine into one block of prefix

$$n_{\\mathrm{agg}} = n - \\log_2 k$$

and the combination is legal only if two conditions hold. The blocks must be
**contiguous**, with no gaps, and $k$ must be a power of two. And the first
network address must be **aligned** on the aggregate's own boundary:

$$N_0 \\bmod 2^{32 - n_{\\mathrm{agg}}} = 0$$

Questions in this family are almost always built by breaking the alignment
condition while leaving contiguity intact, because that is the one people
forget to check.

## 8.2 Worked example 8 — the set that summarises and the set that does not

**Set one:** 10.44.16.0/24 through 10.44.23.0/24, eight consecutive /24s.

$$k = 8, \\qquad n_{\\mathrm{agg}} = 24 - \\log_2 8 = 24 - 3 = 21$$

Alignment: the aggregate block spans $2^{11} = 2048$ addresses, and the third
octet must be a multiple of 8. Since $16 = 2 \\times 8$, the summary is
**10.44.16.0/21**, covering 10.44.16.0 through 10.44.23.255,
$2^{11} - 2 = 2046$ usable addresses, advertised as one route instead of
eight.

**Set two:** 10.44.20.0/24 through 10.44.27.0/24, also eight consecutive /24s.
The count is the same, so $n_{\\mathrm{agg}} = 21$ again, but $20 = 2 \\times 8 + 4$
is **not** a multiple of 8. A /21 starting at 10.44.20.0 does not exist. The
minimum covering set splits at the boundary the alignment rule marks:

| Aggregate | Covers | Addresses |
|---|---|---|
| 10.44.20.0/22 | 10.44.20.0 to 10.44.23.255 | 1024 |
| 10.44.24.0/22 | 10.44.24.0 to 10.44.27.255 | 1024 |

Two routes, not one. The distractor is 10.44.20.0/21, which is not a valid
network address at all — the same error as offering 192.168.10.100/26.

## 8.3 Longest-prefix match, evaluated address by address

Aggregation creates overlapping entries on purpose, and forwarding resolves
the overlap with one rule: among every entry that contains the destination,
the one with the **most prefix bits** wins. Administrative distance and
metric are compared only between entries of the *same* prefix length, so
specificity is checked first and always.

![The winning routing-table entry as the destination address is swept through a range, for a table containing a slash twenty-one, a more specific slash twenty-two nested inside it, a slash twenty-five nested inside that, and a default route. The result is a step function whose steps are exactly the nested blocks: inside the slash twenty-five the slash twenty-five wins, elsewhere inside the slash twenty-two the slash twenty-two wins, elsewhere inside the slash twenty-one the slash twenty-one wins, and outside all of them the default route takes over.](/courses/fe-ee/figures/net2-lpm-steps.svg)

## 8.4 Worked example 9 — reading an overlapping table

| Destination prefix | Range it covers | Next hop |
|---|---|---|
| 10.44.16.0/21 | 10.44.16.0 to 10.44.23.255 | A |
| 10.44.20.0/22 | 10.44.20.0 to 10.44.23.255 | B |
| 10.44.20.128/25 | 10.44.20.128 to 10.44.20.255 | C |
| 0.0.0.0/0 | everything | D |

| Destination | Entries that contain it | Longest | Sent to |
|---|---|---|---|
| 10.44.17.5 | /21, /0 | /21 | A |
| 10.44.21.9 | /21, /22, /0 | /22 | B |
| 10.44.20.200 | /21, /22, /25, /0 | /25 | C |
| 10.44.20.100 | /21, /22, /0 | /22 | B |
| 10.50.0.1 | /0 only | /0 | D |

The pair 10.44.20.100 and 10.44.20.200 is the whole lesson. Both are in the
same /24 and differ only in the last octet, yet they leave by different
interfaces, because 128 is the /25 boundary and 100 falls below it while 200
falls above. Reading the table top to bottom and taking the first match — the
way an access list works — sends both to A and is wrong for all but one of
the five destinations.

## 8.5 Private space and the port arithmetic of NAT

RFC 1918 reserves three blocks that are never routed on the public Internet:

$$2^{24} + 2^{20} + 2^{16} = 16777216 + 1048576 + 65536 = 17891328\\ \\text{addresses}$$

split as one /8, one /12 and one /16. Behind them, PAT multiplexes many inside
hosts onto one public address by rewriting the source port as well as the
source address, so the translation table is keyed on a five-tuple and its
capacity is bounded by the port field. If the NAT draws from a pool of $P$
ports and each inside host holds $s$ concurrent sessions, the number of hosts
it can serve is

$$h_{\\max} = \\left\\lfloor \\frac{P}{s} \\right\\rfloor$$

with the two pools that matter being the IANA dynamic range and everything
above the well-known ports:

$$P_{\\mathrm{dyn}} = 65535 - 49152 + 1 = 16384, \\qquad P_{\\mathrm{wide}} = 65535 - 1024 + 1 = 64512$$

![Inside hosts one public address can serve, against the number of simultaneous sessions each host holds, on a logarithmic vertical scale. Two hyperbolas are drawn: one for the sixteen thousand three hundred and eighty-four ports of the IANA dynamic range and one for the sixty-four thousand five hundred and twelve ports above the well-known range. At twelve sessions per host the wide pool serves 5,376 hosts and the dynamic range alone serves 1,365.](/courses/fe-ee/figures/net2-nat-capacity.svg)

## 8.6 Worked example 10 — sizing a PAT pool

A campus of 20,000 devices averages 9 concurrent sessions each. The NAT
allocates from ports 1024 to 65535. How many public addresses are needed?

$$\\text{sessions} = 20000 \\times 9 = 180000$$

$$\\frac{180000}{64512} = 2.79 \\quad \\Longrightarrow \\quad 3\\ \\text{public addresses}$$

Restrict the NAT to the IANA dynamic range instead and the same load needs
$180000/16384 = 10.99$, so eleven addresses — nearly four times as many,
purely from the choice of port pool.

*The distractor.* Dividing hosts by ports rather than sessions by ports gives
$20000/64512 = 0.31$ and the answer "one address", which is short by a factor
of nine. The port is consumed per **session**, not per host, and a browser
opening six connections to each of several origins is holding far more than
one.

## 8.7 IPv6: notation, prefix structure, and why the arithmetic disappears

Section 5.4 gave the two compression rules. The structural point is that a
global unicast address is cut at fixed, conventional boundaries rather than at
whatever the host count demands.

![The 128 bits of a global unicast IPv6 address, drawn as a bar cut at bit 32, bit 48 and bit 64. The first 32 bits are a registry allocation to an internet service provider, the next 16 identify one of 65,536 customer sites within it, the next 16 identify one of 65,536 subnets within the site, and the last 64 bits are the interface identifier, giving 1.845 times ten to the nineteenth addresses in every subnet.](/courses/fe-ee/figures/net2-ipv6-fields.svg)

| Boundary | Field above it | Count it yields |
|---|---|---|
| /32 | typical ISP allocation | one registry block |
| /48 | typical site allocation | 2^16 = 65,536 sites per /32 |
| /56 | small-site allocation | 2^8 = 256 subnets per site |
| /64 | subnet | 2^16 = 65,536 subnets per /48 |
| 128 | interface identifier | 2^64 addresses per subnet |

The counts are all differences of exponents. Subnets available when a site
prefix $p$ is cut into /64s:

$$S = 2^{64 - p}$$

and the totals worth carrying:

$$2^{64} \\approx 1.845 \\times 10^{19}, \\qquad 2^{128} \\approx 3.403 \\times 10^{38}, \\qquad \\frac{2^{128}}{2^{32}} = 2^{96} \\approx 7.923 \\times 10^{28}$$

The last of those is the honest measure of the change: IPv6 is not four times
IPv4, it is $2^{96}$ times IPv4.

## 8.8 Worked example 11 — compress, expand, and subnet

**Compress** 2001:0db8:0000:0f00:0000:0000:0000:0042. Drop the leading zeros
in each group to get 2001:db8:0:f00:0:0:0:42, then replace the **longest** run
of zero groups — the three groups in positions five to seven — with a double
colon:

**2001:db8:0:f00::42**

The single zero group in position three stays written as 0, because :: may
appear once and is spent on the longer run.

**Expand** 2001:db8:acad::1234. Eight groups are required, four are written,
so :: stands for four zero groups:

**2001:0db8:acad:0000:0000:0000:0000:1234**

**Subnet** the site prefix 2001:db8:acad::/48 into /64s. The subnet field is
$64 - 48 = 16$ bits wide, so

$$S = 2^{16} = 65536\\ \\text{subnets}$$

and they are numbered by the fourth group: 2001:db8:acad:0::/64,
2001:db8:acad:1::/64, and so on to 2001:db8:acad:ffff::/64. The fifth of them,
index 4 counting from zero, is **2001:db8:acad:4::/64**, whose addresses run
from 2001:db8:acad:4:: to 2001:db8:acad:4:ffff:ffff:ffff:ffff.

Every one of those 65,536 subnets holds $2^{64}$ addresses whether it serves
two hosts or two thousand, which is the point: in IPv6 the host count never
drives the prefix.

## 8.9 Worked example 12 — EUI-64 and the link-local address

A NIC has MAC address 00:1b:44:11:3a:b7. Derive its modified EUI-64 interface
identifier and its link-local address.

The rule inserts fffe between the two halves of the 48-bit MAC and inverts the
universal/local bit, which is the second-least-significant bit of the first
octet and therefore carries the value 2:

$$0\\mathrm{x}00 \\oplus 0\\mathrm{x}02 = 0\\mathrm{x}02$$

So 00 becomes 02, and the identifier is

**021b:44ff:fe11:3ab7**

Link-local addresses use the reserved prefix fe80::/10 with the remaining
54 bits of the prefix set to zero, so the address is

**fe80::21b:44ff:fe11:3ab7**

which expands to fe80:0000:0000:0000:021b:44ff:fe11:3ab7. Note the compressed
form writes 21b, not 021b, because leading zeros within a group are dropped
after the double colon just as everywhere else.

*The distractor.* Forgetting the bit inversion leaves 001b:44ff:fe11:3ab7,
which differs from the correct answer in exactly one bit and is offered in
every question of this type. The inversion exists so that a locally
administered identifier and a globally unique one can be told apart, and its
effect on a MAC beginning 00 is always to produce 02.`,
      examTip: 'A summary is legal only if the blocks are contiguous, the count is a power of two, AND the first network address is a multiple of the aggregate block size. Check the alignment last and check it always: eight consecutive /24s starting at .20 do not make a /21.',
      importantNote: 'Longest-prefix match compares specificity before metric, and it is not first-match: two addresses in the same /24 can leave by different interfaces if a /25 covers one of them. PAT capacity is ports divided by SESSIONS, not by hosts.',
    },
    { id: 'subnet-pset-a', title: '9. Problem Set A — Masks, Blocks, and Host Counts',
      content: `Six problems in the FE style. Each one is short enough for three minutes and
each is built around a specific way of going wrong; the solutions name the
trap and the wrong number it produces. Every address, mask, broadcast and host
count below was checked twice, once by bitmask arithmetic and once against a
standard address library.

## 9.1 Problem Set A — the problems

**A1.** Given 172.30.91.200/20, find the mask, network address, broadcast
address, usable range and usable host count.

**A2.** How many /27 subnets fit in a /22, and how many usable host addresses
do they supply in total?

**A3.** A segment must support 255 hosts. What is the smallest prefix that
works, and what fraction of the block does the requirement use?

**A4.** Which of 192.168.5.64, 192.168.5.100 and 192.168.5.192 can be a valid
/26 network address? For any that cannot, name the network it actually belongs
to.

**A5.** Can 10.8.14.130 and 10.8.15.20 exchange traffic without a router if
both carry a /23 mask? What if both carry a /24 mask?

**A6.** A 203.0.113.0/24 is carved entirely into /30 point-to-point links. How
many links, how many usable addresses, and what fraction of the block is lost?
Repeat for /31 links.

## 9.2 Problem Set A — answers, worked in full

**A1 — 255.255.240.0, network 172.30.80.0, broadcast 172.30.95.255, 4094
hosts.** A /20 leaves $m = 12$ host bits, so the block is $2^{12} = 4096$
addresses and the third-octet block size is $4096/256 = 16$.

$$\\left\\lfloor 91/16 \\right\\rfloor = 5, \\qquad 5 \\times 16 = 80$$

The network is 172.30.80.0/20, the broadcast is
$80 + 16 - 1 = 95$ in the third octet with 255 in the fourth, so
172.30.95.255. Usable range 172.30.80.1 to 172.30.95.254, and

$$H = 2^{12} - 2 = 4094$$

*The trap.* Writing the /20 mask as 255.255.255.240, which puts the four
borrowed bits in the wrong octet. That mask is a /28, gives a network of
172.30.91.192 and a host count of 14 — three of the four answers wrong from
one misplaced boundary. The mask boundary is at bit 20, and bit 20 is inside
the third octet.

**A2 — 32 subnets, 960 usable addresses.**

$$2^{27-22} = 2^{5} = 32\\ \\text{subnets}$$

Each /27 holds $2^{5} = 32$ addresses of which 30 are usable, so

$$32 \\times 30 = 960 \\ \\text{of}\\ 1024$$

*The trap.* Answering 1024 by multiplying 32 subnets by 32 addresses and
forgetting the reservation. Subdividing a block always costs addresses: the
parent /22 alone would have supplied 1022 usable, so cutting it into /27s
spends 62 addresses on the extra network and broadcast pairs.

**A3 — /23, and 49.8 % of the block.**

$$m = \\left\\lceil \\log_2 (255 + 2) \\right\\rceil = \\left\\lceil \\log_2 257 \\right\\rceil = 9$$

so the prefix is $32 - 9 = 23$, the block is 512 addresses and 510 are usable.

$$\\eta = 255/512 = 0.498 = 49.8\\ \\%$$

*The trap.* Taking $2^{8} = 256 \\ge 255$ and answering /24. A /24 supplies only
254 usable addresses, one short of the requirement, and the whole point of the
minus two is that it moves the threshold from 256 to 254. This requirement
sits in the worst possible place — one host above a power of two — which is
why the efficiency is barely over one half.

**A4 — .64 and .192 are valid; .100 is not.** A /26 block is 64 addresses, so
a valid network address is a multiple of 64: 0, 64, 128, 192.

$$64 = 1 \\times 64, \\qquad 192 = 3 \\times 64, \\qquad 100 = 1 \\times 64 + 36$$

192.168.5.100 belongs to **192.168.5.64/26**, whose range is .65 to .126 and
whose broadcast is .127.

*The trap.* Treating any address ending in a round decimal number as a network
address. Decimal roundness is irrelevant; only divisibility by the block size
matters, and 100 is divisible by 4, 10, 20, 25 and 50 without being divisible
by 64.

**A5 — yes with /23, no with /24.** With a /23 the block is 512 addresses and
the third octet advances in steps of 2, so the boundaries are at even third
octets. Both addresses reduce to

$$\\left\\lfloor 14/2 \\right\\rfloor \\times 2 = 14 \\quad \\text{and} \\quad \\left\\lfloor 15/2 \\right\\rfloor \\times 2 = 14$$

so both lie in 10.8.14.0/23, whose broadcast is 10.8.15.255 and whose 510
usable addresses include both. They are on the same subnet and reach each
other directly.

With a /24 they reduce to 10.8.14.0/24 and 10.8.15.0/24, two different
subnets, and every packet between them goes through a router.

*The trap.* Reading a difference in the third octet as proof of different
subnets. Whether an octet difference matters depends entirely on where the
mask boundary falls, and a /23 puts the boundary one bit inside the third
octet.

**A6 — 64 links and 128 usable with /30; 128 links and 256 usable with /31.**

$$\\frac{256}{4} = 64\\ \\text{links}, \\qquad 64 \\times 2 = 128\\ \\text{usable}$$

$$\\frac{128}{256} = 0.5 \\quad \\Longrightarrow \\quad 50\\ \\%\\ \\text{of the block is network and broadcast}$$

With /31 links under RFC 3021 there is no network or broadcast address, so

$$\\frac{256}{2} = 128\\ \\text{links}, \\qquad 128 \\times 2 = 256\\ \\text{usable}, \\qquad 0\\ \\%\\ \\text{lost}$$

*The trap.* Answering 256 usable for the /30 case by multiplying 64 links by
4 addresses. Half of every /30 is unusable, which is exactly the arithmetic
RFC 3021 was written to eliminate — and the doubling from 64 links to 128 is
the whole benefit.`,
      examTip: 'Find the block size 2^(32-n) first, then find which multiple of it the address falls in. Every other quantity follows: broadcast is network plus block minus one, first host is network plus one, last host is broadcast minus one, and the count is block minus two.',
    },
    { id: 'subnet-pset-b', title: '10. Problem Set B — Summarisation, NAT, and IPv6',
      content: `Six more, on the material that separates a student who can subnet from one
who can operate a network. As before, every prefix, range and count in the
answers was produced twice by independent routes and the two agreed.

## 10.1 Problem Set B — the problems

**B1.** Summarise 192.168.96.0/24 through 192.168.111.0/24 into a single
prefix. Give the aggregate, its broadcast address and its usable count.

**B2.** Can 10.1.6.0/24 through 10.1.13.0/24 be advertised as one route? If
not, give the smallest set of routes that covers them exactly.

**B3.** A router holds 172.16.0.0/16 via A, 172.16.32.0/19 via B,
172.16.40.0/21 via C and a default via D. Where do 172.16.35.9, 172.16.44.7,
172.16.80.1 and 8.8.8.8 go?

**B4.** A NAT serves 20,000 inside hosts averaging 9 concurrent sessions each,
drawing from ports 1024 to 65535. How many public addresses are needed?

**B5.** Expand 2001:db8:0:0:8:800:200c:417a to its full form, give the /64 it
belongs to, and state how many /64 subnets a /56 contains.

**B6.** A site receives 2001:db8:acad::/48. How many /64 subnets does that
give, and what is the address range of the fifth of them?

## 10.2 Problem Set B — answers, worked in full

**B1 — 192.168.96.0/20.** Sixteen consecutive /24s, and 16 is a power of two:

$$n_{\\mathrm{agg}} = 24 - \\log_2 16 = 24 - 4 = 20$$

Alignment: a /20 spans 4096 addresses, so the third octet must be a multiple
of 16, and $96 = 6 \\times 16$. The aggregate is **192.168.96.0/20**, its
broadcast is 192.168.111.255, and

$$H = 2^{12} - 2 = 4094\\ \\text{usable addresses}$$

*The trap.* Counting the networks as 111 minus 96 and getting 15, which is one
short and leads to a /21 covering only eight of them. Inclusive counts need
the plus one: $111 - 96 + 1 = 16$.

**B2 — no; three routes.** There are eight consecutive /24s, so the count is
right, but a /21 must start on a multiple of 8 and

$$6 = 0 \\times 8 + 6$$

is not one. Split at the boundaries the alignment rule allows:

| Route | Covers | Addresses |
|---|---|---|
| 10.1.6.0/23 | 10.1.6.0 to 10.1.7.255 | 512 |
| 10.1.8.0/22 | 10.1.8.0 to 10.1.11.255 | 1024 |
| 10.1.12.0/23 | 10.1.12.0 to 10.1.13.255 | 512 |

Three routes, covering exactly 2048 addresses and not one more.

*The trap.* Advertising 10.1.6.0/21. That prefix does not exist, and a router
that accepted the configuration would be advertising 10.1.0.0/21 — a block
that includes 10.1.0.0 through 10.1.5.255, addresses this site does not own,
and excludes 10.1.8.0 through 10.1.13.255, most of the addresses it does.

**B3 — B, C, A and D respectively.** Write out what each entry covers before
matching anything:

| Entry | Range |
|---|---|
| 172.16.0.0/16 | 172.16.0.0 to 172.16.255.255 |
| 172.16.32.0/19 | 172.16.32.0 to 172.16.63.255 |
| 172.16.40.0/21 | 172.16.40.0 to 172.16.47.255 |

172.16.35.9 falls in the /16 and the /19 but not the /21, since 35 is below
40, so the /19 wins and it goes to **B**. 172.16.44.7 falls in all three and
the /21 is longest, so **C**. 172.16.80.1 falls only in the /16, since 80 is
above 63, so **A**. 8.8.8.8 matches nothing but the default, so **D**.

*The trap.* Evaluating the table top to bottom and stopping at the first
match, the way an access list is evaluated. That sends the first three
destinations to A and gets two of the four wrong. Route lookup examines every
entry and then picks the most specific.

**B4 — three public addresses.** Ports are consumed per session:

$$20000 \\times 9 = 180000\\ \\text{sessions}$$

$$P = 65535 - 1024 + 1 = 64512\\ \\text{ports per public address}$$

$$\\frac{180000}{64512} = 2.79 \\quad \\Longrightarrow \\quad 3$$

*The trap.* Dividing hosts by ports, $20000/64512 = 0.31$, and answering one
address. That ignores the session multiplier entirely and understates the
requirement ninefold. A second trap is using the IANA dynamic range of 16,384
ports without being told to, which gives $180000/16384 = 10.99$ and eleven
addresses.

**B5 — 2001:0db8:0000:0000:0008:0800:200c:417a, in 2001:db8::/64, and a /56
holds 256 subnets.** Restore every group to four hex digits, and note that the
two written zero groups expand to 0000 each:

**2001:0db8:0000:0000:0008:0800:200c:417a**

The first 64 bits are 2001:0db8:0000:0000, so the subnet is
**2001:db8::/64**. Cutting a /56 into /64s leaves

$$64 - 56 = 8\\ \\text{bits}, \\qquad 2^{8} = 256\\ \\text{subnets}$$

*The trap.* Reading the 8 in the fifth group as part of the prefix and putting
the address in 2001:db8:0:8::/64. The /64 boundary falls after the **fourth**
group, and the fifth group is the first sixteen bits of the interface
identifier. A second trap is answering 8 subnets for the /56 rather than
$2^{8}$; the exponent counts bits, and the count is two to that power.

**B6 — 65,536 subnets; the fifth is 2001:db8:acad:4::/64.** The subnet field
runs from bit 48 to bit 63:

$$S = 2^{64-48} = 2^{16} = 65536$$

Subnets are numbered by the fourth group starting at 0, so the fifth is index
4 and the prefix is **2001:db8:acad:4::/64**. Its range is

$$\\text{2001:db8:acad:4::} \\ \\text{to} \\ \\text{2001:db8:acad:4:ffff:ffff:ffff:ffff}$$

containing $2^{64}$ addresses.

*The trap.* Counting from one and answering 2001:db8:acad:5::/64. Subnet
numbering starts at zero in IPv6 exactly as it does in IPv4 — the first /64 of
the site is 2001:db8:acad:0::/64, usually written 2001:db8:acad::/64, and
"the fifth" is therefore index 4. The same off-by-one turns a 65,536-subnet
answer into 65,535 if the zero subnet is excluded for no reason.`,
      examTip: 'For any summarisation question: count the blocks inclusively (last minus first PLUS ONE), check that the count is a power of two, then check that the first network address is a multiple of the aggregate block size. Failing the third test means two or more routes, not one.',
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
    { id: 'topo-metrics', title: '4. Counting Links, Diameter, and the Cost of Growth',
      content: `## 4.1 Three Numbers Describe a Topology

Link count answers "what does it cost to build". Two other numbers answer
questions the exam asks just as often. **Diameter** is the largest number of
hops between any two nodes, and it bounds worst-case latency. **Incremental
cost** is the number of new links needed to attach one more node, and it is
what decides whether a design can grow.

| Topology | Links | Diameter | Links added per new node |
|---|---|---|---|
| Bus | 1 shared segment | 1 | 0 (tap the segment) |
| Star | N − 1 | 2 (up to hub, back down) | 1 |
| Ring | N | ⌊N/2⌋ | 2 (break and re-join) |
| Full mesh | N(N − 1)/2 | 1 | N |
| Tree (binary) | N − 1 | about 2·log₂N | 1 |
| Hypercube | N·log₂(N)/2 | log₂N | log₂N |

Evaluate the three main rows at four sizes and the trade becomes concrete:

| N | Star links | Ring links | Mesh links | Mesh diameter | Ring diameter |
|---|---|---|---|---|---|
| 4 | 3 | 4 | 6 | 1 | 2 |
| 8 | 7 | 8 | 28 | 1 | 4 |
| 16 | 15 | 16 | 120 | 1 | 8 |
| 32 | 31 | 32 | 496 | 1 | 16 |
| 64 | 63 | 64 | 2016 | 1 | 32 |

## 4.2 Why the Mesh Line Is Steeper

![Links required against node count for full mesh, ring and star, on logarithmic axes. The full mesh curve N times N minus one over two has slope two; the ring and star curves have slope one. At eight nodes the mesh needs 28 links against the star's seven, and at thirty-two nodes 496 against thirty-one.](/courses/fe-ee/figures/net-mesh-link-growth.svg)

On logarithmic axes a power law is a straight line whose slope is the
exponent, and the figure makes the difference visible rather than asserted:
star and ring have slope 1, the full mesh has slope 2. Doubling from 16 to 32
nodes takes the star from 15 links to 31 — roughly double — while the mesh
goes from 120 to 496, roughly quadruple.

The incremental column is the part that kills full mesh in practice. Adding
the 33rd node to a 32-node mesh requires **32 new links, all of them
terminating on existing equipment**. Every one of the 32 incumbent nodes needs
a spare port, so growth is not a matter of running one cable but of having
provisioned 32 ports on every device in advance. A star adds one cable and one
port.

## 4.3 Where Full Mesh Still Wins

The reason to pay for a mesh is the diameter column: **1**, unconditionally.
There is no intermediate node to add queueing delay, to fail, or to become a
bottleneck. That is why partial mesh survives in exactly the two places the
exam names:

| Setting | Why mesh, and how much |
|---|---|
| Carrier or data-centre core | Node count is small (4 to 8), traffic is huge, and a single hop matters |
| Critical redundancy | Two or three disjoint paths, not full mesh — the reliability gain saturates fast |

The three-tier design in section 2 is a direct application: mesh where N is
small and the traffic is aggregated, star where N is large and each node is
cheap.

## 4.4 Domains, Counted on a Real Diagram

Collision-domain and broadcast-domain counting is best done on a concrete
layout. Take one switch with nine ports: three ports each feed a hub that
serves four hosts, five ports feed a host directly, and the ninth port uplinks
to a router interface. Count the ports before anything else — three plus five
plus one is nine, and each hub needs five ports of its own, four for hosts and
one for the link back to the switch.

| Question | Count | Reasoning |
|---|---|---|
| Hosts | 17 | 3 hubs × 4 hosts + 5 direct |
| Collision domains | **9** | Each hub is one shared segment (3), each directly switched port is its own (5), plus the uplink (1) |
| Broadcast domains | **1** | One router interface, no VLANs — every host sees every broadcast |
| Broadcast domains with 3 VLANs | **3** | A VLAN is a broadcast domain, whether or not a router is involved |

The hub-versus-switch distinction is the whole point: the twelve hosts behind
hubs contend with three other stations each, while the five switched hosts
contend with nobody and can run full duplex. Replacing the three hubs with
switches raises the count on the same convention used in the table — one
domain per shared segment or per point-to-point link — to twelve host links,
plus three switch-to-switch links, plus the five direct hosts, plus the
uplink, which is **21**. CSMA/CD disappears entirely at that point, which is
what actually happened to Ethernet, and why collision arithmetic is now a
historical topic rather than an operational one.`,
      examTip: 'Diameter is the metric behind latency questions: star = 2, ring = floor(N/2), full mesh = 1. Incremental cost is the metric behind scalability questions: star = 1 link per node, full mesh = N links per node.',
      importantNote: 'A VLAN creates a broadcast domain without a router. If a question puts three VLANs on one switch, the answer is three broadcast domains even though there is only one physical switch and possibly no router at all.',
    },
    { id: 'topo-reliability', title: '5. Reliability Arithmetic and Switched-Ethernet Design',
      content: `## 5.1 Series and Parallel Paths

Reliability questions on a network reduce to the same series and parallel
algebra used for components. Let **a** be the availability of one link — the
fraction of time it works.

**Links in series** (a path that needs every hop): availability is the product.

**$A_{\\mathrm{series}} = a^{k}$**

**Paths in parallel** (any one suffices): the system fails only if all fail.

**$A_{\\mathrm{parallel}} = 1 - (1 - a)^{k}$**

With a = 0.99 per link:

| Configuration | Availability | Percentage |
|---|---|---|
| 1 link | 0.990000 | 99.0000 % |
| 3 links in series | 0.970299 | 97.0299 % |
| 5 links in series | 0.950990 | 95.0990 % |
| 2 independent paths | 0.999900 | 99.9900 % |
| 3 independent paths | 0.999999 | 99.9999 % |

The asymmetry is the lesson. Stringing three links together turns 99 % into
97 %; duplicating one link turns 99 % into 99.99 %. Redundancy multiplies
*unavailability*, which is why the second path buys two extra nines and the
third buys two more, with rapidly diminishing returns after that.

## 5.2 Nines, Downtime, and MTBF

Availability is usually quoted in nines. A year is 365 × 24 × 60 = 525,600
minutes, so the downtime budget follows directly:

| Availability | Downtime per year | Per month |
|---|---|---|
| 99 % | 5256 min = 87.6 h | 7.30 h |
| 99.9 % | 525.6 min = 8.76 h | 43.8 min |
| 99.99 % | 52.56 min | 4.38 min |
| 99.999 % | 5.256 min | 26 s |

Availability also follows from maintenance statistics:

**$A = \\dfrac{\\mathrm{MTBF}}{\\mathrm{MTBF} + \\mathrm{MTTR}}$**

A switch with MTBF 10,000 hours and MTTR 4 hours gives
A = 10000/10004 = **0.99960**, or 99.96 % — about 3.5 hours of downtime a
year. Notice that halving the repair time does as much for availability as
doubling the time between failures: **holding a spare on site is often the
cheapest nine you can buy.**

## 5.3 Spanning Tree: Why Redundant Switches Need a Protocol

A redundant link between two switches creates a loop, and a loop in a
switched Ethernet is not merely wasteful — it is fatal. A broadcast frame has
no TTL at layer 2, so it circulates forever, is duplicated at every switch,
and saturates the network in seconds. This is the **broadcast storm** the exam
asks about.

**STP** (IEEE 802.1D) solves it by computing a loop-free tree and blocking the
remaining ports:

| Step | Rule |
|---|---|
| 1. Elect the root bridge | Lowest bridge ID wins; bridge ID = priority (default 32768) then MAC address |
| 2. Root port on each switch | The port with the lowest path cost to the root |
| 3. Designated port per segment | The port on the switch with the lowest cost to the root |
| 4. Everything else | Blocked — carries no data, listens for topology changes |

Because the default priority is identical on every switch out of the box, the
election falls through to the MAC address, and **the oldest switch on the
network usually becomes root** — the lowest MAC tends to be the oldest
hardware. That is precisely the wrong choice, since the root should be a core
switch, and it is why priorities are configured manually in practice.

## 5.4 Getting Bandwidth Out of the Blocked Links

STP's cost is that a blocked link carries nothing. Two techniques recover it:

| Technique | Standard | What it does |
|---|---|---|
| Link aggregation | IEEE 802.3ad / 802.1AX | Bonds parallel links into one logical link; STP sees one link, so none is blocked |
| VLAN load balancing | Per-VLAN spanning tree | Different VLANs elect different roots, so each physical link forwards some traffic |

Link aggregation also improves the reliability arithmetic in a specific way
worth understanding: four bonded 1 Gbps links give 4 Gbps when healthy and
3 Gbps after one failure, whereas a single 4 Gbps link gives 4 Gbps or
nothing. The aggregate degrades rather than fails — the same graceful pattern
as the parallel-path formula above, now applied to capacity instead of
availability.`,
      examTip: 'Series availability multiplies (a^k); parallel availability is 1-(1-a)^k. Going from one path to two at 99 % per link buys two extra nines — from 99 % to 99.99 %.',
      importantNote: 'STP elects the switch with the LOWEST bridge ID as root, and because every switch ships with priority 32768 the tie-break falls to the lowest MAC address — typically the oldest switch, which is rarely the one you want at the root.',
    },
    { id: 'topo-graph', title: '6. Topology as a Graph: Degree, Diameter, Bisection',
      content: `## 6.1 Replacing Adjectives With Quantities

The first five sections described topologies in words and gave one formula.
That is not enough to design with, and it is not enough for the exam either.
Every arrangement in this chapter is a **graph**: the devices are its vertices
and the links are its edges. Written that way, six measurable quantities take
the place of words like "robust" or "expensive", and each of them can be
computed before anything is bought and counted afterwards to check.

$$G = (V, E), \\qquad n = \\lvert V \\rvert, \\qquad m = \\lvert E \\rvert$$

| Quantity | Written | What it settles |
|---|---|---|
| Node count | n | The size of the problem |
| Link count | m | Cable spend, port count, installation labour |
| Node degree | d(v) | How many ports each individual device must have |
| Diameter | D | Worst-case hop count, and therefore worst-case latency |
| Bisection width | B | Traffic the fabric carries across its own middle |
| Node connectivity | kappa | How many devices must die before the network splits |

The figures in this section were produced by building each graph in software,
walking its adjacency lists to count edges, and running breadth-first search
from every vertex to measure distance. The formulas below are then checked
against those measurements rather than being trusted on sight, which is
exactly the discipline to bring to an exam question: derive, then count a
small case.

## 6.2 Link Count Comes From the Degree Sum

Every edge has two ends, so adding up how many links touch each device counts
every link exactly twice. That single observation — the **handshake lemma** —
gives the link count of any topology whose degrees are known.

$$\\sum_{v \\in V} d(v) = 2m$$

For a **regular** topology, where every device has the same degree d, the
result rearranges into the only link-count formula that has to be memorised:

$$m = \\frac{n\\,d}{2}$$

Apply it once per topology and the whole table falls out. A ring gives every
device two neighbours, so d = 2 and the links equal the nodes. A square torus
gives four, a hypercube of n = 2^k nodes gives k = log2 n, and a full mesh
gives n − 1.

$$m_{\\mathrm{ring}} = \\frac{2n}{2} = n, \\qquad m_{\\mathrm{torus}} = \\frac{4n}{2} = 2n$$

$$m_{\\mathrm{cube}} = \\frac{n \\log_{2} n}{2}, \\qquad m_{\\mathrm{mesh}} = \\frac{n(n-1)}{2}$$

A star and a tree are not regular, so the sum is taken in two pieces. In a
star the hub has degree n − 1 and each of the n − 1 leaves has degree 1:

$$2m_{\\mathrm{star}} = (n-1) + (n-1)\\cdot 1 = 2(n-1) \\;\\Longrightarrow\\; m_{\\mathrm{star}} = n - 1$$

Any tree obeys the same result for a deeper reason: a connected graph with no
cycle has exactly one fewer edge than it has vertices, which is why a star, a
bus drawn as a chain, and a hierarchical tree all cost n − 1 links.

$$m_{\\mathrm{tree}} = n - 1$$

## 6.3 Diameter Is a Shortest-Path Maximum

Diameter is the largest of all the shortest paths, so it bounds the hop count
of the unluckiest pair of devices on the network.

$$D = \\max_{u,v\\,\\in\\,V} \\operatorname{dist}(u,v)$$

![Diameter against node count for a ring, a hypercube and a full mesh, on doubling axes from four to sixty-four nodes. The ring line rises as floor of n over two, from two hops at four nodes to thirty-two at sixty-four; the hypercube rises as log base two of n, from two to six; the full mesh is flat at one. Every point was measured by breadth-first search on a constructed graph.](/courses/fe-ee/figures/net3-topology-diameter.svg)

Each curve has a one-line derivation. In a ring the two directions split the
distance, so the worst pair sits half way round. In a hypercube the shortest
path flips one address bit at a time, so the worst pair differs in all k bits.
In a full mesh every pair is adjacent.

$$D_{\\mathrm{ring}} = \\left\\lfloor \\frac{n}{2} \\right\\rfloor, \\qquad D_{\\mathrm{cube}} = \\log_{2} n, \\qquad D_{\\mathrm{mesh}} = 1$$

$$D_{\\mathrm{star}} = 2, \\qquad D_{\\mathrm{torus}} = 2\\left\\lfloor \\frac{\\sqrt{n}}{2} \\right\\rfloor$$

A complete binary tree of height h holds n = 2^(h+1) − 1 nodes, and its worst
pair is two leaves on opposite sides, so the path climbs h levels and descends
h again:

$$D_{\\mathrm{bintree}} = 2h = 2\\log_{2}(n+1) - 2$$

The contrast that matters is the second column against the first. Going from
16 nodes to 64 takes a ring from 8 hops to 32 — the latency grows with the
network — while a hypercube goes from 4 to 6. That is the whole reason
hierarchical and hypercube-like fabrics exist.

## 6.4 Bisection Width: Bandwidth Through the Middle

Diameter measures the worst *path*; bisection width measures the worst *cut*.
Split the devices into two halves as evenly as possible, choosing the split
that severs the fewest links, and count what had to be cut.

$$B = \\min_{\\substack{S \\subset V \\\\ \\lvert S \\rvert = \\lfloor n/2 \\rfloor}} \\lvert \\{\\,uv \\in E : u \\in S,\\; v \\notin S \\,\\} \\rvert$$

![Bisection width against node count for a ring, a hypercube and a full mesh, on doubling axes. The ring is flat at two links cut at every size; the hypercube rises as n over two, reaching thirty-two at sixty-four nodes; the full mesh rises as n squared over four, reaching one thousand and twenty-four. Small cases were confirmed by enumerating every balanced cut.](/courses/fe-ee/figures/net3-bisection-width.svg)

A ring is severed by exactly two links no matter how large it grows, which is
why a ring cannot be scaled by adding stations: the cross-sectional bandwidth
is fixed at two links for ever. A hypercube cut along one address bit severs
half the nodes, one link each. A full mesh has every left-hand node joined to
every right-hand node.

$$B_{\\mathrm{ring}} = 2, \\qquad B_{\\mathrm{cube}} = \\frac{n}{2}, \\qquad B_{\\mathrm{mesh}} = \\left\\lceil \\frac{n}{2}\\right\\rceil\\left\\lfloor \\frac{n}{2}\\right\\rfloor$$

For even n the mesh expression is simply n²/4, so a 64-node mesh has to have
1024 links severed before it splits, while the 64-node ring needs two. Every
one of these was confirmed by brute force at n = 8 and n = 16: the software
enumerated every balanced partition and took the minimum cut, and the answers
were 2, 4, 8 and 16 exactly as the formulas predict.

## 6.5 Connectivity: How Much Failure the Shape Absorbs

$$\\kappa(G) \\le \\lambda(G) \\le \\delta(G)$$

Node connectivity kappa is the fewest devices whose loss disconnects the
survivors, edge connectivity lambda is the same question for links, and delta
is the smallest degree in the graph. The chain of inequalities says something
useful without any calculation: **no topology can tolerate more failures than
its least-connected device has ports.** A device with one uplink is a single
point of failure regardless of how much redundancy exists elsewhere.

| Topology | kappa | lambda | Smallest degree | Single point of failure |
|---|---|---|---|---|
| Star, n = 6 | 1 | 1 | 1 | Yes — the hub, and every leaf link |
| Bus or line, n = 6 | 1 | 1 | 1 | Yes — every interior node |
| Ring, n = 6 | 2 | 2 | 2 | No — survives any one failure |
| Hypercube, n = 8 | 3 | 3 | 3 | No — survives any two |
| Torus, n = 9 | 4 | 4 | 4 | No — survives any three |
| Full mesh, n = 6 | 5 | 5 | 5 | No — survives any four |

Every entry in that table was obtained by removing nodes and links from the
constructed graph and testing whether the survivors could still reach one
another, not by quoting the formula. That is worth doing once by hand for a
small ring, because it makes Menger's theorem concrete: the number of
independent paths between two devices equals the number of failures the pair
can absorb.

### Worked Example 6.1 — Four Metrics for an Eight-Node Fabric

**Given.** Eight devices. Compare a star, a ring, a hypercube of dimension 3
and a full mesh on link count, degree, diameter and bisection width.

**Link count.** From the degree sum, m = nd/2 for the regular shapes:

$$m_{\\mathrm{ring}} = \\frac{8 \\times 2}{2} = 8, \\qquad m_{\\mathrm{cube}} = \\frac{8 \\times 3}{2} = 12$$

$$m_{\\mathrm{mesh}} = \\frac{8 \\times 7}{2} = 28, \\qquad m_{\\mathrm{star}} = 8 - 1 = 7$$

**Diameter.** Ring gives floor(8/2) = 4, cube gives log2 8 = 3, mesh gives 1,
star gives 2.

**Bisection.** Ring 2, cube 8/2 = 4, mesh 4 × 4 = 16, star 4.

| Shape | Links | Degree | Diameter | Bisection |
|---|---|---|---|---|
| Star | 7 | 7 at the hub, 1 elsewhere | 2 | 4 |
| Ring | 8 | 2 | 4 | 2 |
| Hypercube | 12 | 3 | 3 | 4 |
| Full mesh | 28 | 7 | 1 | 16 |

**Answer.** The hypercube costs 50 % more links than a ring and buys a
diameter cut from 4 to 3 and a bisection width doubled from 2 to 4. The mesh
costs 3.5 times the ring and buys a diameter of 1. All four numbers were
confirmed by construction: the software built each graph, counted 7, 8, 12 and
28 edges, and measured diameters of 2, 4, 3 and 1 by breadth-first search.

### Worked Example 6.2 — When Is a Hypercube Cheaper Than a Mesh?

**Given.** Find the smallest n = 2^k at which a hypercube costs less than half
the links of a full mesh.

**Set up the ratio.**

$$\\frac{m_{\\mathrm{cube}}}{m_{\\mathrm{mesh}}} = \\frac{n\\log_{2}n / 2}{n(n-1)/2} = \\frac{\\log_{2}n}{n-1}$$

**Evaluate.** At n = 4 the ratio is 2/3 = 0.667. At n = 8 it is 3/7 = 0.4286,
which is already below one half.

**Answer.** n = 8. Beyond that the advantage compounds: at n = 64 the ratio is
6/63 = 0.0952, so a hypercube of 64 nodes costs under a tenth of the mesh
while still holding the diameter to 6 hops instead of the ring's 32.

### Worked Example 6.3 — The Incremental Cost of One More Node

**Given.** A network of n devices grows by one. How many new links are needed
in each topology, and how many existing devices must have a spare port?

**Take the difference of the link-count formulas.**

$$\\Delta m_{\\mathrm{mesh}} = \\frac{(n+1)n}{2} - \\frac{n(n-1)}{2} = n$$

$$\\Delta m_{\\mathrm{star}} = n - (n-1) = 1, \\qquad \\Delta m_{\\mathrm{ring}} = (n+1) - n = 1$$

**Interpret the ring result carefully.** The count rises by one, but the work
is not one cable: an existing link must be broken and two new ones run, so the
network is interrupted. The star adds one cable to a spare hub port and
touches nothing else.

**Answer.** Mesh n new links on n existing devices, ring one net link but two
cable pulls and an outage, star one cable and one port. For n = 32 the mesh
answer is 32 new links, every one of them terminating on an incumbent device —
so all 32 must have been built with a spare port years earlier.`,
      examTip: 'Learn one formula, not six: the degree sum gives 2m, so m = nd/2 for any regular topology. Ring d = 2 gives m = n, torus d = 4 gives m = 2n, hypercube d = log2 n gives m = n log2 n over 2, full mesh d = n-1 gives m = n(n-1)/2.',
      importantNote: 'Bisection width, not diameter, is the number that decides whether a topology can carry more traffic as it grows. A ring has bisection width 2 at every size, so doubling the stations on a ring does not double what the ring can carry across itself — it halves the share each station gets.',
    },
    { id: 'topo-robust', title: '7. Reliability, Redundancy and the Cost of Robustness',
      content: `## 7.1 From Two Formulas to a Whole Network

Section 5 gave the two rules that everything else is built from: a path needs
every hop, so its availability is a product, while parallel paths fail only
together, so their unavailabilities multiply.

$$A_{\\mathrm{series}} = \\prod_{i=1}^{k} a_i = a^{k} \\quad \\text{(identical links)}$$

$$A_{\\mathrm{parallel}} = 1 - \\prod_{i=1}^{k}(1 - a_i) = 1 - (1-a)^{k}$$

Plotting both on a scale of **nines** makes the asymmetry impossible to miss.
Define the nines of an availability as

$$N_{9} = -\\log_{10}(1 - A)$$

![Nines of availability against the number of links, for links in series and paths in parallel, each link at ninety-nine per cent. The parallel curve is a straight line rising two nines per added path, reaching sixteen nines at eight paths. The series curve falls from two nines at one link towards about one nine at eight. Both were confirmed by Monte-Carlo trials over independent link failures.](/courses/fe-ee/figures/net3-reliability-paths.svg)

The parallel line is straight because the unavailability is a pure power:
1 − A = (1 − a)^k, so N9 = −k·log10(1 − a), which at a = 0.99 is exactly 2k.
**Each redundant path buys two more nines, at this link quality, for ever.**
The series curve bends the other way and much more slowly, because a^k decays
gently at first. Both curves were confirmed by simulating independent link
failures a few hundred thousand times and counting how often the whole
arrangement worked.

## 7.2 All-Terminal Reliability: The Question a Network Actually Asks

Series and parallel answer "can these two devices talk". A network asks
something harder: **can every device still reach every other device**. That is
the all-terminal reliability, and for the shapes on this exam it has closed
forms worth knowing.

A ring stays fully connected as long as at most one of its n links has failed,
because cutting one link leaves a chain. Cut two and it splits.

$$R_{\\mathrm{ring}} = a^{n} + n\\,a^{\\,n-1}(1-a)$$

A star needs every leaf link and it needs the hub, so with hub availability h:

$$R_{\\mathrm{star}} = h\\,a^{\\,n-1}$$

At n = 6 and a = 0.99, with a perfect hub for the sake of the comparison:

| Shape | Expression | Value | Unavailability |
|---|---|---|---|
| Ring, 6 links | 0.99^6 + 6 × 0.99^5 × 0.01 | 0.99853955 | 0.00146045 |
| Star, 5 links | 0.99^5 | 0.95099005 | 0.04900995 |

The ring is **33.6 times less likely to be broken**, since 0.04900995 divided
by 0.00146045 is 33.558. It pays one extra link for that. Both figures were
confirmed twice over: once by enumerating all 2^6 and 2^5 link-failure
patterns and adding the probabilities of the connected ones, and once by
Monte-Carlo trials that failed links at random and ran a reachability search
on what was left.

## 7.3 Partial Redundancy: k Working Out of n

Full mesh and single path are the two ends of a spectrum. The middle is
described by the binomial sum, which gives the probability that at least k of
n parallel components survive.

$$A_{k/n} = \\sum_{j=k}^{n} \\binom{n}{j} a^{j} (1-a)^{\\,n-j}$$

| Requirement | At a = 0.99 | Value |
|---|---|---|
| 1 of 2 (plain redundant pair) | 1 − 0.01² | 0.99990000 |
| 2 of 3 (quorum) | 3 × 0.99² × 0.01 + 0.99³ | 0.99970200 |
| 3 of 4 (capacity floor) | 4 × 0.99³ × 0.01 + 0.99⁴ | 0.99940797 |
| 4 of 4 (no spare capacity) | 0.99⁴ | 0.96059601 |

The last two rows are the design lesson. Four bonded links that must all work
give only 1.40 nines, since the log of 0.03940399 is -1.4045; the same four
links with a design that tolerates one failure give 3.23 nines *and* keep 75 %
of the capacity when one does fail. This is why link aggregation is specified
with a capacity floor rather than as an all-or-nothing bundle.

## 7.4 Blast Radius: What One Failure Costs

Availability says how often something breaks. **Blast radius** says how much
breaks when it does, and the two are independent design goals. Define the
expected number of devices that lose service when exactly one device fails,
averaged over which device it is:

$$E[\\ell] = \\frac{1}{n}\\sum_{v \\in V} \\ell(v)$$

where ℓ(v) counts v itself plus every device cut off from the rest once v is
gone. Measured by removing each node of a six-device network in turn and
running a reachability search on the survivors:

| Shape, n = 6 | Hub fails | A leaf or peer fails | Expected loss |
|---|---|---|---|
| Star | 5 devices lose service | 1 device | 10/6 = 1.667 |
| Ring | not applicable | 1 device | 1.000 |
| Full mesh | not applicable | 1 device | 1.000 |

The star is **1.667 times worse per failure** than either alternative, and all
of that excess comes from one sixth of the cases. That is the shape of every
single-point-of-failure argument: rare, but catastrophic when it lands, and
invisible to an availability figure that averages over time rather than over
consequence.

## 7.5 Pricing the Trade

Put cost and robustness in the same table and the design conversation becomes
arithmetic. Take a link cost of one unit and compare at n = 6.

| Shape | Links | Relative cost | kappa | Expected loss per failure |
|---|---|---|---|---|
| Star | 5 | 1.00 | 1 | 1.667 |
| Ring | 6 | 1.20 | 2 | 1.000 |
| Ring plus a second ring on next-nearest neighbours | 12 | 2.40 | 4 | 1.000 |
| Full mesh | 15 | 3.00 | 5 | 1.000 |

The 20 % surcharge from star to ring buys the first unit of connectivity and
removes the single point of failure entirely; the 150 % surcharge from ring to
full mesh buys three more units of connectivity that no realistic failure rate
will ever call upon. **Redundancy saturates.** That is the quantitative form
of the advice in section 2 to use partial mesh rather than full mesh: the
second path is worth more than the third, fourth and fifth combined.

### Worked Example 7.1 — Nines for a Three-Hop Path With a Backup

**Given.** A primary route crosses three links, each 99.5 % available. A
backup route crosses five links of the same quality. The two routes share no
equipment. Find the availability of the pair.

**Step 1 — each route in series.**

$$A_1 = 0.995^{3} = 0.985075, \\qquad A_2 = 0.995^{5} = 0.975249$$

**Step 2 — the routes in parallel.**

$$A = 1 - (1 - 0.985075)(1 - 0.975249) = 1 - 0.014925 \\times 0.024751$$

$$A = 1 - 0.000369 = 0.999631$$

**Step 3 — express it as nines and as downtime.**

$$N_{9} = -\\log_{10}(0.000369) = 3.433, \\qquad U = 0.000369 \\times 525600 = 193.95 \\ \\mathrm{min/yr}$$

**Answer.** 99.9631 %, about 3.4 nines, or 194 minutes of outage a year. The
weaker five-hop backup still lifts the pair from 1.8 nines to 3.4, which is
the point: a mediocre second path is worth far more than a better first one.

### Worked Example 7.2 — Choosing Between a Spare and a Better Switch

**Given.** A switch has MTBF 10,000 h and MTTR 4 h. Two proposals: double the
MTBF to 20,000 h by buying better hardware, or halve the MTTR to 2 h by
stocking a spare on site. Which wins?

**Use the availability definition.**

$$A = \\frac{\\mathrm{MTBF}}{\\mathrm{MTBF} + \\mathrm{MTTR}}$$

**Baseline.** A = 10000/10004 = 0.99960016, so downtime is
(1 − 0.99960016) × 8760 = 3.503 h a year.

**Better hardware.** A = 20000/20004 = 0.99980004.

**Spare on site.** A = 10000/10002 = 0.99980004.

**Answer.** They are identical to eight decimal places, and both halve the
downtime to 1.752 h a year. The algebra explains why: for MTTR much smaller
than MTBF, 1 − A is very nearly MTTR/MTBF, so halving the numerator and
doubling the denominator do exactly the same thing. Since a spare unit almost
always costs less than a doubling of hardware quality, **the cheapest nine on
the shelf is usually a spare in the cupboard.**

### Worked Example 7.3 — How Many Parallel Paths Reach Five Nines?

**Given.** Each path is 97 % available. How many independent paths are needed
for 99.999 % overall?

**Set the requirement.**

$$1 - (1 - 0.97)^{k} \\ge 0.99999 \\;\\Longleftrightarrow\\; 0.03^{k} \\le 10^{-5}$$

**Take logarithms.**

$$k \\ge \\frac{-5}{\\log_{10} 0.03} = \\frac{-5}{-1.52288} = 3.283$$

**Answer.** k = 4. Check it: 0.03⁴ = 8.1 × 10⁻⁷, so A = 0.99999919, comfortably
past five nines, while k = 3 gives 0.03³ = 2.7 × 10⁻⁵ and only 99.9973 %. Note
how weak each path is allowed to be — 97 % is poor — and how few of them are
needed. Independence is doing the work, which is why the assumption deserves
more scrutiny than the arithmetic: two paths in the same duct are not
independent, and the formula silently assumes they are.`,
      examTip: 'Series availability is a product and parallel availability is one minus a product of unavailabilities. On a nines scale, -log10(1-A), every extra parallel path at 99 percent per link adds exactly two nines. Availability and blast radius are different questions: a star and a ring can have similar uptime while the star loses five devices per hub failure and the ring loses one.',
      importantNote: 'MTTR and MTBF are equally powerful levers. For MTTR much smaller than MTBF the unavailability is approximately MTTR divided by MTBF, so halving repair time equals doubling time-between-failures. Stocking a spare is nearly always the cheaper of the two.',
    },
    { id: 'topo-loops', title: '8. Loops, Spanning Trees and How Fast a Storm Grows',
      content: `## 8.1 How Many Trees Does a Fabric Contain?

Section 5 explained that a loop must be broken. The next question is how many
ways there are to break it, because that is what a spanning-tree protocol is
choosing among. **Cayley's formula** counts the spanning trees of a complete
graph, and the cycle has an answer just as simple.

$$\\tau(K_n) = n^{\\,n-2}, \\qquad \\tau(C_n) = n$$

| Fabric | Devices | Links | Spanning trees |
|---|---|---|---|
| Ring | 4 | 4 | 4 |
| Ring | 6 | 6 | 6 |
| Full mesh | 4 | 6 | 16 |
| Full mesh | 5 | 10 | 125 |
| Full mesh | 6 | 15 | 1296 |

The ring result is obvious once stated — remove any one of the n links and
what remains is a tree — and it was confirmed by enumerating every subset of
n − 1 links and testing connectivity. The mesh numbers were confirmed the same
way. A protocol therefore has to *choose*, deterministically and identically on
every switch, and that is the entire purpose of the root election and the
path-cost tie-breaks in section 5.3.

## 8.2 How Many Ports Get Blocked

A tree has n − 1 links, so everything else is turned off:

$$b = m - (n - 1)$$

| Fabric | n | m | Forwarding | Blocked | Blocked share |
|---|---|---|---|---|---|
| Ring of 6 switches | 6 | 6 | 5 | 1 | 16.7 % |
| Four meshed switches | 4 | 6 | 3 | 3 | 50.0 % |
| Five meshed switches | 5 | 10 | 4 | 6 | 60.0 % |
| Nine switches as a torus | 9 | 18 | 8 | 10 | 55.6 % |

Half or more of a meshed fabric is idle under a single spanning tree. That is
the cost the techniques in section 5.4 exist to recover, and it is why per-VLAN
trees and link aggregation are not optional refinements on a densely meshed
core — they are how the money already spent gets used.

## 8.3 The Growth Law of a Broadcast Storm

A frame that arrives on one trunk port of a switch is flooded out **every other
trunk port**. If each switch has t trunk ports, one incoming frame becomes
t − 1 outgoing frames, so the population multiplies once per hop. Starting from
a single broadcast injected at one switch, which is flooded out all t of its
trunks:

$$F(1) = t, \\qquad F(g) = F(1)\\,(t-1)^{\\,g-1}$$

There is nothing to stop this. An Ethernet frame carries **no hop count** —
the time-to-live field lives in the IP header, which a layer-2 switch never
examines — so nothing decays and nothing expires.

![Broadcast frames in flight against hop generation for two switch fabrics, on a doubling vertical axis. Four fully-meshed switches replicate by two per generation, going three, six, twelve, twenty-four and reaching the twelve-link fabric capacity at the third generation. A triangle of three switches merely circulates two frames for ever. The counts were produced by simulating the flood rather than by evaluating the formula.](/courses/fe-ee/figures/net3-storm-growth.svg)

The triangle in the figure is the instructive counter-case. Three switches in
a ring give each of them two trunk ports, so t − 1 = 1 and the population is
constant: the frames circulate for ever without growing, which is bad enough,
because every host receives a duplicate on every lap. **Growth needs t of at
least 3**, which four meshed switches supply.

## 8.4 How Long Until the Fabric Is Full

Saturation arrives when the frames in flight exceed what the trunks can hold.
With m trunk links carrying traffic in both directions, and one frame of
length L on each direction per serialisation slot, the capacity in frames is

$$C = 2m, \\qquad t_{\\mathrm{slot}} = \\frac{L}{R}$$

and the generation at which the fabric fills follows from setting F(g) = C:

$$g^{*} = 1 + \\left\\lceil \\log_{t-1} \\frac{C}{F(1)} \\right\\rceil$$

$$T^{*} = g^{*}\\,t_{\\mathrm{slot}}$$

### Worked Example 8.1 — Time to Saturation on Four Meshed Switches

**Given.** Four switches, fully meshed, 1 Gbps trunks, minimum-size 64-byte
frames. One host sends one broadcast. How long until the trunks are full?

**Step 1 — the fabric.** Four meshed switches have m = 4 × 3 / 2 = 6 links, so
C = 2 × 6 = 12 directed trunk links. Each switch has t = 3 trunk ports.

**Step 2 — the slot.** A 64-byte frame is 512 bits:

$$t_{\\mathrm{slot}} = \\frac{512}{10^{9}} = 5.12 \\times 10^{-7}\\ \\mathrm{s} = 0.512\\ \\mu\\mathrm{s}$$

**Step 3 — the population.** F(1) = 3, and each generation doubles: 3, 6, 12,
24, 48.

**Step 4 — saturation.**

$$g^{*} = 1 + \\left\\lceil \\log_{2} \\frac{12}{3} \\right\\rceil = 1 + 2 = 3$$

$$T^{*} = 3 \\times 0.512 = 1.536\\ \\mu\\mathrm{s}$$

**Answer.** The trunks are completely full **1.536 microseconds** after a
single broadcast, and the offered load keeps doubling after that. This is why
a loop takes a switched network down in less time than a person can notice
anything is wrong, and why the protection has to be automatic. The generation
counts were checked by simulating the flood frame by frame — a frame in on one
trunk, out on the others — which reproduced 3, 6, 12 and 24 exactly.

## 8.5 What the Protocol Costs to Run

Breaking the loop is not free. The 802.1D timers are conservative because they
must outlast the worst-case propagation of a topology change across a network
whose diameter the protocol does not know:

$$t_{\\mathrm{converge}} = \\mathrm{MaxAge} + 2 \\times \\mathrm{ForwardDelay}$$

| Timer | Default | Why |
|---|---|---|
| Hello | 2 s | How often the root announces itself |
| MaxAge | 20 s | How long a switch keeps stale information before reacting |
| Forward delay | 15 s | Listening, then learning, before forwarding |
| Worst-case convergence | 50 s | 20 + 15 + 15 |

Fifty seconds is an eternity for a voice call, which is the whole motivation
for the rapid variants that renegotiate in well under a second on
point-to-point links. Path selection uses additive costs along the route:

$$c_{\\mathrm{path}} = \\sum_{i=1}^{h} c_i$$

| Link rate | 802.1D cost |
|---|---|
| 10 Mbps | 2,000,000 |
| 100 Mbps | 200,000 |
| 1 Gbps | 20,000 |
| 10 Gbps | 2,000 |

### Worked Example 8.2 — Which Port Becomes the Root Port?

**Given.** A switch reaches the root two ways. Route A crosses two 1 Gbps
links and one 100 Mbps link. Route B crosses one 10 Gbps link and one 1 Gbps
link. Which port forwards?

**Add the costs.**

$$c_A = 20000 + 20000 + 200000 = 240000$$

$$c_B = 2000 + 20000 = 22000$$

**Answer.** Route B, at cost 22,000 against 240,000 — a factor of 10.9 — even
though both routes are the same number of hops for two of the three legs.
Notice what the arithmetic punishes: a single 100 Mbps link contributes
200,000, which is more than eight 1 Gbps links put together. **Spanning tree
counts bandwidth, not hops**, and one slow link anywhere on a route disqualifies
it. That is the most commonly missed point in root-port questions, where
candidates count hops out of habit.`,
      examTip: 'A broadcast frame has no TTL at layer 2, so a loop never decays. With t trunk ports per switch the frames in flight grow as (t-1) per hop generation, and four fully meshed switches at 1 Gbps fill their own trunks in about 1.5 microseconds. Spanning tree blocks m - (n-1) links, which is half or more of a densely meshed core.',
      importantNote: 'Spanning tree adds path COSTS, and the 802.1D cost of a 100 Mbps link is 200000 against 20000 for a gigabit link. One slow leg makes an otherwise short route lose. Count cost, never hops.',
    },
    { id: 'topo-wireless', title: '9. Physical Against Logical, and Wireless Topologies',
      content: `## 9.1 The Same Cabling Can Be Two Different Networks

A topology question has two answers, and the exam expects both. The
**physical** topology is where the cables run; the **logical** topology is how
frames actually flow. They are frequently different, and the difference is
where the performance lives.

| Technology | Physical | Logical | Consequence |
|---|---|---|---|
| Ethernet over a hub | Star | Bus | One collision domain shared by everyone |
| Ethernet over a switch | Star | Point-to-point per port | One collision domain per port, full duplex |
| Token ring on a media access unit | Star | Ring | Deterministic access despite star cabling |
| Wireless infrastructure mode | Star at the access point | Bus over the air | Shared medium, half duplex, hidden terminals |
| Wireless ad hoc or mesh | Mesh | Mesh | Multi-hop, no central point of failure |

The pattern is that almost everything is cabled as a star, because a star is
what a structured-cabling system physically is, and the logical behaviour is
decided by the box in the middle. Replacing a hub with a switch changes no
cable and changes everything.

## 9.2 The Cost of Sharing a Medium

Where the logical topology is a bus, capacity has to be shared, and the
sharing is imperfect. The simplest analysable case is **ALOHA**, where a
station transmits whenever it has something to send. With offered load G in
frames per frame-time, and a vulnerable period of two frame times, throughput
follows from the Poisson probability of no other arrival in that window:

$$S_{\\mathrm{pure}} = G\\,e^{-2G}, \\qquad S_{\\mathrm{slotted}} = G\\,e^{-G}$$

Differentiating each and setting the derivative to zero puts the maxima at
G = 0.5 and G = 1 respectively:

$$S^{\\max}_{\\mathrm{pure}} = \\frac{1}{2e} = 0.1839, \\qquad S^{\\max}_{\\mathrm{slotted}} = \\frac{1}{e} = 0.3679$$

**Aligning transmissions to slots halves the vulnerable window and exactly
doubles the peak throughput**, from 18.4 % to 36.8 % of the raw rate. Both
figures were confirmed by simulating Poisson arrivals and counting the frames
that survived. Carrier sensing does far better than either, because a station
that listens first avoids most of the collisions rather than merely detecting
them, and section 3.3 gives the standard efficiency estimate 1/(1 + 5a) for
the wired case.

## 9.3 The Hidden Terminal: Carrier Sensing That Cannot Hear

Carrier sensing assumes every station can hear every other. Over the air that
assumption fails: two stations at opposite edges of an access point's range
can each hear the access point and neither can hear the other. Both sense an
idle medium, both transmit, and both frames are destroyed at the receiver.
Neither sender detects anything wrong.

The probability is computable. If hidden stations offer traffic at a combined
Poisson rate lambda, and a frame is exposed for a vulnerable period Tv, then

$$T_f = \\frac{L}{R}, \\qquad T_v = 2T_f, \\qquad P_{\\mathrm{coll}} = 1 - e^{-\\lambda T_v}$$

### Worked Example 9.1 — Hidden-Terminal Collision Probability

**Given.** 1500-byte frames at 54 Mbps. Four hidden stations, each offering 50
frames per second. Find the probability that a given frame is destroyed by a
hidden transmitter.

**Step 1 — frame time.**

$$T_f = \\frac{1500 \\times 8}{54 \\times 10^{6}} = \\frac{12000}{54 \\times 10^{6}} = 222.22\\ \\mu\\mathrm{s}$$

**Step 2 — vulnerable period.** Tv = 2 × 222.22 = 444.44 microseconds.

**Step 3 — combined rate.** lambda = 4 × 50 = 200 frames per second.

**Step 4 — probability.**

$$P_{\\mathrm{coll}} = 1 - e^{-200 \\times 444.44\\times 10^{-6}} = 1 - e^{-0.088889} = 0.08505$$

**Answer.** 8.5 % of frames are lost to stations the sender cannot hear, and
no amount of carrier sensing will reduce it. The result was confirmed by
sampling exponential interarrival times and counting how often the first
arrival landed inside the window. Note the shape of the answer: because the
exponent is small, the probability is very nearly lambda × Tv, so it grows
almost linearly with hidden traffic and with frame length. **Shorter frames
are more robust to hidden terminals**, which is the reverse of the efficiency
advice, and the tension between the two is real.

## 9.4 The Handshake, and the Threshold That Justifies It

The defence is to reserve the medium before sending. A request-to-send and a
clear-to-send are exchanged first; the clear-to-send is heard by every station
in the *receiver's* range, including the hidden ones, and silences them. The
cost is airtime. Adding up the interframe spaces and the control frames:

$$T_{\\mathrm{basic}} = \\mathrm{DIFS} + T_f + \\mathrm{SIFS} + T_{\\mathrm{ACK}}$$

$$T_{\\mathrm{rts}} = \\mathrm{DIFS} + T_{\\mathrm{RTS}} + T_{\\mathrm{CTS}} + T_f + T_{\\mathrm{ACK}} + 3\\,\\mathrm{SIFS}$$

$$\\Theta = \\frac{L}{T_{\\mathrm{cycle}}}$$

### Worked Example 9.2 — When Does the Handshake Pay for Itself?

**Given.** Data at 54 Mbps, control frames at 6 Mbps. RTS 20 bytes, CTS and
ACK 14 bytes each, SIFS 16 microseconds, DIFS 34 microseconds, data 1500
bytes. Backoff is ignored so that the comparison is between the two cycles
alone. Find the collision probability above which the handshake wins.

**Step 1 — airtimes.**

$$T_{\\mathrm{RTS}} = \\frac{160}{6 \\times 10^{6}} = 26.667\\ \\mu\\mathrm{s}, \\qquad T_{\\mathrm{CTS}} = T_{\\mathrm{ACK}} = \\frac{112}{6 \\times 10^{6}} = 18.667\\ \\mu\\mathrm{s}$$

**Step 2 — the two cycles.**

$$T_{\\mathrm{basic}} = 34 + 222.2222 + 16 + 18.6667 = 290.8889\\ \\mu\\mathrm{s}$$

$$T_{\\mathrm{rts}} = 34 + 26.6667 + 18.6667 + 222.2222 + 18.6667 + 48 = 368.2223\\ \\mu\\mathrm{s}$$

**Step 3 — goodput of each.**

$$\\Theta_{\\mathrm{basic}} = \\frac{12000}{290.8889 \\times 10^{-6}} = 41.25\\ \\mathrm{Mbps}$$

$$\\Theta_{\\mathrm{rts}} = \\frac{12000}{368.2223 \\times 10^{-6}} = 32.59\\ \\mathrm{Mbps}$$

**Step 4 — the break-even.** Basic access loses a fraction p of its frames to
hidden terminals; the handshake loses none. Set the two expected goodputs
equal:

$$(1-p)\\,\\Theta_{\\mathrm{basic}} = \\Theta_{\\mathrm{rts}} \\;\\Longrightarrow\\; p^{*} = 1 - \\frac{32.589}{41.253} = 0.2100$$

**Answer.** The handshake costs 21.0 % of goodput and repays it once the
hidden-terminal collision probability exceeds **21.0 %**. Below that, turning
it on makes things worse. This is why the feature is governed by a
length threshold rather than a switch: long frames are exposed for longer, so
they cross the break-even first, and short frames are cheaper to lose than to
protect. Worked example 9.1 gave 8.5 % for four moderately busy hidden
stations, which is well below the threshold — that network should leave the
handshake off.

## 9.5 Wireless Topologies in One Table

| Arrangement | Structure | Failure behaviour | Where it fits |
|---|---|---|---|
| Infrastructure basic service set | Star at one access point | Access point is a single point of failure | Offices, homes |
| Extended service set | Several access points on one wired backbone | Loss of one leaves a coverage hole only | Campuses |
| Ad hoc | Peer-to-peer mesh | No central point of failure | Temporary, field |
| Wireless mesh backhaul | Multi-hop mesh between access points | Routes around a failed node | Coverage without cabling |

The wired reasoning carries straight over. An infrastructure cell is a star,
so its connectivity is 1 and its blast radius is every associated station; a
mesh has connectivity equal to its least-connected node, and it trades that
robustness for hop count, since every relayed frame consumes airtime twice and
therefore roughly halves the usable throughput per hop.`,
      examTip: 'Physical and logical topology are separate answers. A hub is a physical star and a logical bus; a switch is a physical star with a point-to-point logical link per port; a media access unit is a physical star and a logical ring. Slotting a shared medium halves the vulnerable period and doubles peak throughput, from 1/(2e) = 18.4 percent to 1/e = 36.8 percent.',
      importantNote: 'Carrier sensing cannot detect a station it cannot hear. The RTS/CTS handshake fixes that but costs airtime, so it only pays above a computable collision probability — 21 percent for 1500-byte frames at 54 Mbps with control frames at 6 Mbps. That is why it is enabled by a frame-length threshold rather than always.',
    },
    { id: 'topo-cabling', title: '10. Structured Cabling: Where the Distance Limits Come From',
      content: `## 10.1 Copper Loss Grows With the Square Root of Frequency

The 100-metre rule is not a convention. It is the length at which a cable's
insertion loss uses up the budget the receiver was designed around. Loss in a
balanced pair is dominated by conductor skin effect, which makes the
attenuation per metre grow as the square root of frequency:

$$\\alpha(f) = \\alpha_{100}\\sqrt{\\frac{f}{100}} \\quad [\\mathrm{dB/m},\\ f \\ \\mathrm{in\\ MHz}]$$

$$IL = \\alpha(f)\\,L, \\qquad L_{\\max} = \\frac{IL_{\\mathrm{budget}}}{\\alpha(f)}$$

![Insertion loss against channel length for a twisted-pair cable at one hundred, two hundred and fifty and five hundred megahertz, with a horizontal guide at the twenty-one point seven decibel channel budget. The three lines meet the budget at one hundred and eight point five, sixty-eight point six and forty-eight point five metres, and a vertical guide marks one hundred metres.](/courses/fe-ee/figures/net3-cable-loss.svg)

Take a cable specified at 0.20 dB per metre at 100 MHz as the design input and
a channel budget of 21.7 dB. Everything else on the figure follows:

| Frequency | alpha (dB/m) | Reach at 21.7 dB |
|---|---|---|
| 100 MHz | 0.2000 | 108.5 m |
| 250 MHz | 0.3162 | 68.6 m |
| 500 MHz | 0.4472 | 48.5 m |

**Doubling the signalling frequency does not halve the reach — it divides it
by the square root of two**, which is 1.414. That is why higher-rate copper
standards are not simply the old cable driven faster: they specify a lower
alpha, tighter twist, and better balance, all bought to keep the same 100 m.

## 10.2 The Channel Is Not All One Cable

A structured-cabling channel is a fixed horizontal run plus flexible patch
cords at each end. The patch cords use stranded conductors, which are more
lossy than solid ones — take a factor of 1.2 as the design allowance — so the
budget must be spent in two pieces:

$$IL_{\\mathrm{channel}} = \\alpha\\,L_{h} + 1.2\\,\\alpha\\,L_{p}$$

### Worked Example 10.1 — Does a Standard Channel Fit Its Budget?

**Given.** 90 m of solid horizontal cable at 0.20 dB/m and 10 m of stranded
patch cord, at 100 MHz, against a 21.7 dB channel budget.

**Step 1 — horizontal.** 90 × 0.20 = 18.0 dB.

**Step 2 — patch cords.** 10 × 0.20 × 1.2 = 2.4 dB.

**Step 3 — total and margin.**

$$IL_{\\mathrm{channel}} = 18.0 + 2.4 = 20.4\\ \\mathrm{dB}, \\qquad \\text{margin} = 21.7 - 20.4 = 1.3\\ \\mathrm{dB}$$

**Answer.** 20.4 dB against a 21.7 dB budget, leaving 1.3 dB — about 6 % of
the budget. That is why the 90 m and 10 m split is written into the design
rather than left to the installer: swapping 5 m of the horizontal run for 5 m
of patch cord adds 5 × 0.20 × 0.2 = 0.2 dB, which eats a sixth of the
remaining margin for no length gained at all. **Patch cords are the most
expensive metres in the channel.**

## 10.3 The Fibre Loss Budget Is the Same Sum With More Terms

Optical reach is set by a power budget: what the transmitter launches, minus
what the receiver needs, minus everything the path takes away.

$$P_{\\mathrm{budget}} = P_{\\mathrm{tx}} - S_{\\mathrm{rx}}$$

$$P_{\\mathrm{budget}} = \\alpha_f\\,\\ell + n_c L_c + n_s L_s + M$$

$$\\ell_{\\max} = \\frac{P_{\\mathrm{budget}} - n_c L_c - n_s L_s - M}{\\alpha_f}$$

### Worked Example 10.2 — Reach of a Single-Mode Link

**Given.** Launch power −4 dBm, receiver sensitivity −20 dBm, fibre 0.35 dB/km
at 1310 nm, two connector pairs at 0.5 dB each, three fusion splices at 0.1 dB
each, and 3.0 dB of ageing and repair margin.

**Step 1 — the budget.**

$$P_{\\mathrm{budget}} = -4 - (-20) = 16\\ \\mathrm{dB}$$

**Step 2 — the fixed losses.** Connectors 2 × 0.5 = 1.0 dB, splices
3 × 0.1 = 0.3 dB, margin 3.0 dB. Total fixed = 4.3 dB.

**Step 3 — what is left for fibre, and how far it goes.**

$$16 - 4.3 = 11.7\\ \\mathrm{dB}, \\qquad \\ell_{\\max} = \\frac{11.7}{0.35} = 33.43\\ \\mathrm{km}$$

**Answer.** 33.4 km. Note where the budget actually goes: the 3 dB margin
alone is worth 8.57 km of fibre, and the five connections together are worth
3.71 km. **Reach is lost at the joints, not along the glass** — which is why
splice counts and connector counts appear on link budgets at all, and why an
extra patch panel in the middle of a long run is never free.

## 10.4 The Other Distance Limit: Collision Detection

For shared-medium Ethernet the distance limit came from timing, not loss. A
sender must still be transmitting when the first bit of a collision returns to
it, otherwise it will never learn that its frame was destroyed. That
requirement fixes the **slot time** at 512 bit times and therefore the minimum
frame at 64 bytes:

$$t_{\\mathrm{slot}} = \\frac{512}{R}, \\qquad L_{\\min} = R\\,t_{\\mathrm{slot}} = 512\\ \\mathrm{bits} = 64\\ \\mathrm{bytes}$$

$$d_{\\max} = \\frac{t_{\\mathrm{slot}}\\;v}{2}$$

### Worked Example 10.3 — Why 2500 m, and Why Gigabit Needed a Fix

**Given.** Signal velocity 2.31 × 10⁸ m/s in coaxial cable. Compute the
propagation-only span implied by the slot time at 10 Mbps, 100 Mbps and
1 Gbps.

**Step 1 — slot times.**

$$t_{10} = \\frac{512}{10 \\times 10^{6}} = 51.2\\ \\mu\\mathrm{s}, \\qquad t_{100} = \\frac{512}{100\\times 10^{6}} = 5.12\\ \\mu\\mathrm{s}$$

**Step 2 — spans at 10 Mbps.** Half the slot is the one-way budget:

$$d_{\\max} = \\frac{51.2 \\times 10^{-6}}{2}\\times 2.31\\times 10^{8} = 5913.6\\ \\mathrm{m}$$

**Step 3 — compare with the standard's 2500 m.** The five-segment rule allows
only 2500 m, which is 42.3 % of the propagation-only figure, since
2500 / 5913.6 = 0.42275. The remaining 14.78 microseconds of the one-way
budget is spent in repeaters, transceivers and the collision-detect logic.

**Step 4 — scale to 100 Mbps and 1 Gbps.** The slot time falls with the rate,
so the span falls with it: 591.4 m at 100 Mbps on the same arithmetic. At
1 Gbps a 512-bit slot would give only 59.1 m, which is unusable, so gigabit
extends the slot to 4096 bit times:

$$t_{1000} = \\frac{4096}{10^{9}} = 4.096\\ \\mu\\mathrm{s}, \\qquad d_{\\max} = \\frac{4.096\\times 10^{-6}}{2}\\times 2.31 \\times 10^{8} = 473.1\\ \\mathrm{m}$$

**Answer.** 5913.6 m, 591.4 m and 473.1 m of propagation-only span. **The
minimum frame size and the maximum network diameter are the same constraint
seen from two ends**, which is the single most useful thing to know about the
64-byte minimum: it is not a header requirement, it is a distance requirement.
Full-duplex switching removes the constraint entirely — with no collisions
there is no slot time — and that is why modern segment lengths are set by
attenuation, as in 10.1, and not by timing at all.

## 10.5 The Three Limits Side by Side

| Limit | Set by | Typical figure | What relaxes it |
|---|---|---|---|
| Copper channel length | Insertion loss against the receiver budget | 100 m | Lower-loss cable, lower signalling frequency |
| Fibre reach | Power budget against connector, splice and margin losses | 33 km at 1310 nm | Fewer joints, better sensitivity, lower fibre loss |
| Shared-medium diameter | Slot time and propagation velocity | 2500 m at 10 Mbps | Full duplex, which removes it completely |

## Problem Set A — Graph Metrics and Reliability

**A1.** A fabric of 32 switches is arranged as a hypercube. How many links,
what degree, what diameter and what bisection width?
*Answer.* n = 32 so k = 5. Links = 32 × 5 / 2 = 80. Degree 5. Diameter 5.
Bisection 16.

**A2.** A full mesh of 12 routers is proposed. How many links, and how many
new links would a thirteenth router require?
*Answer.* 12 × 11 / 2 = 66 links; a thirteenth needs 12 new links, one to each
incumbent, so all 12 need a spare port.

**A3.** Each of four independent paths is 96 % available. What is the
availability of the group, and how many nines?
*Answer.* 1 − 0.04⁴ = 1 − 2.56 × 10⁻⁶ = 0.99999744, which is
−log10(2.56 × 10⁻⁶) = 5.59 nines.

**A4.** A route crosses six links each 99.8 % available. What is its
availability and its annual downtime?
*Answer.* 0.998⁶ = 0.988060. Downtime = 0.011940 × 525600 = 6275.6 minutes,
about 104.6 hours.

**A5.** A switch has MTBF 40,000 h and MTTR 6 h. What is its availability and
its annual downtime?
*Answer.* 40000/40006 = 0.99985002; downtime = 0.00014998 × 8760 = 1.314 h.

**A6.** A six-node ring has links that are each 98 % available. What is the
probability that all six nodes can still reach one another?
*Answer.* 0.98⁶ + 6 × 0.98⁵ × 0.02 = 0.885842 + 0.108471 = 0.994313.

**A7.** Which fails more often per year: eight links in series at 99.9 % each,
or one link at 99.2 %?
*Answer.* Series gives 0.999⁸ = 0.992028, so the single 99.2 % link is
marginally worse — 0.99200 against 0.99203. Eight good links are about as
risky as one mediocre one, which is the practical meaning of the series rule.

**A8.** A design must survive any two simultaneous device failures. What is
the minimum node connectivity, and what is the minimum degree of every device?
*Answer.* kappa of at least 3, and since kappa is at most the smallest degree,
every device needs at least three links.

## Problem Set B — Loops, Wireless and Cabling

**B1.** Six switches are connected as a ring. How many ports does spanning
tree block, and what fraction of the links is that?
*Answer.* m − (n − 1) = 6 − 5 = 1 link, which is 16.7 %.

**B2.** Five switches are fully meshed. How many spanning trees exist, and how
many links are blocked?
*Answer.* 5³ = 125 spanning trees; m = 10, so 10 − 4 = 6 links blocked, 60 %.

**B3.** A switch reaches the root over three 1 Gbps links, or over one 1 Gbps
and one 10 Mbps link. Which route wins?
*Answer.* 3 × 20000 = 60000 against 20000 + 2000000 = 2020000. The three-hop
gigabit route wins by a factor of 33.7.

**B4.** Six switches are each connected to three others. If one switch has
t = 3 trunk ports and a broadcast is injected, how many frames are in flight
at the fourth generation?
*Answer.* F(1) = 3 and the multiplier is t − 1 = 2, so F(4) = 3 × 2³ = 24.

**B5.** A 2312-byte frame is sent at 54 Mbps. Two hidden stations each offer
80 frames per second. What is the collision probability?
*Answer.* Tf = 18496/54e6 = 342.5 microseconds; Tv = 685.0 microseconds;
lambda = 160/s; P = 1 − exp(−0.10960) = 0.10381, about 10.4 %.

**B6.** A cable is rated 0.24 dB/m at 100 MHz. What is its loss per metre at
400 MHz, and how far will 21.7 dB reach at that frequency?
*Answer.* 0.24 × sqrt(4) = 0.48 dB/m; 21.7/0.48 = 45.2 m.

**B7.** A fibre link has a 14 dB budget, 0.25 dB/km fibre, four connector
pairs at 0.4 dB, two splices at 0.15 dB and 3 dB of margin. What is the reach?
*Answer.* Fixed losses 1.6 + 0.3 + 3.0 = 4.9 dB; 14 − 4.9 = 9.1 dB;
9.1/0.25 = 36.4 km.

**B8.** At 100 Mbps, what is the slot time and the propagation-only span at
2.31 × 10⁸ m/s?
*Answer.* 512/100e6 = 5.12 microseconds; span = 5.12e−6/2 × 2.31e8 = 591.4 m.`,
      examTip: 'Copper attenuation grows as the square root of frequency, so doubling the signalling rate divides reach by 1.414, not by 2. A fibre budget is transmit power minus receiver sensitivity, then minus connectors, splices and margin, with only the remainder divided by the per-kilometre loss. The 64-byte minimum Ethernet frame and the maximum collision-domain diameter are one constraint seen from two ends.',
      importantNote: 'Reach is lost at the joints. In the worked fibre budget the 3 dB margin alone is worth 8.57 km of glass and the five connections are worth 3.71 km, out of a 33.4 km reach — so an extra patch panel is never free.',
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
| **TLS/SSL** | Above L4 — runs on top of TCP, mapped to L5/L6 in OSI terms |

IPSec tunnel mode encrypts entire packet; transport mode encrypts payload only.

Place the two by what they protect. IPSec sits **at** the network layer and so
protects everything above it, transparently, for every application on the
host. TLS sits **above** the transport layer, so it protects one TCP
connection at a time and the application must ask for it — which is the same
L5/L6 placement the OSI table in the first topic gives for SSL/TLS.

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
    { id: 'netsec-keymath', title: '4. Key Management Arithmetic and Brute-Force Work Factor',
      content: `## 4.1 Why Symmetric Cryptography Alone Does Not Scale

The "key distribution problem" has a number attached to it. If N parties want
to talk privately in pairs using symmetric keys, every pair needs its own key
— the same counting problem as a full mesh:

**$K_{\\mathrm{symmetric}} = \\dfrac{N(N-1)}{2}$**

With public-key cryptography each party needs one key pair and nothing else,
so the key material grows as **2N**:

| Parties N | Symmetric keys | Asymmetric keys (2N) | Ratio |
|---|---|---|---|
| 10 | 45 | 20 | 2.25 |
| 100 | 4,950 | 200 | 24.75 |
| 1,000 | 499,500 | 2,000 | 249.75 |

The crossover is at N = 6, and after that the gap widens without limit. Worse
than the count is the *distribution*: each of those 499,500 symmetric keys has
to reach two specific parties over some channel that is already secure, which
is circular. A public key can be published on a billboard.

## 4.2 Work Factor: What a Key Length Buys

Attacking a well-designed symmetric cipher means trying keys. A k-bit key has
2^k possibilities, and on average the right one is found after **2^(k−1)**
trials. Fix an attacker's speed and the expected time follows:

![Expected exhaustive-search time against symmetric key length, on a logarithmic time axis, for an attacker managing ten to the twelve keys per second and one managing ten to the eighteen. Horizontal guides mark one hour, one year and the age of the universe. A 56-bit DES key falls in ten hours at the lower rate; a 128-bit AES key needs 5.4 times ten to the eighteen years.](/courses/fe-ee/figures/net-keyspace-time.svg)

Two readings carry the whole argument:

| Cipher | Key bits | Expected search at 10^12 keys/s |
|---|---|---|
| DES | 56 | 2^55 / 10^12 = 36,029 s = **10.0 hours** |
| 3DES (effective) | 112 | 8.2 × 10^13 years |
| AES-128 | 128 | **5.4 × 10^18 years** |
| AES-256 | 256 | 1.8 × 10^57 years |

DES is not broken because the algorithm is weak; it is broken because 56 bits
is now a morning's work. AES-128 at the same rate would take about 400 million
times the current age of the universe. The second curve in the figure gives an
attacker a million times more throughput — 10^18 keys per second — and it
moves the survivable key length by only **20 bits**. That is the practical
meaning of exponential security: attacker improvements are linear in the
exponent, so defenders win by adding a handful of bits.

## 4.3 Hashes: Preimage Versus Birthday Resistance

A hash has two very different attack costs, and mixing them up is a common
exam error:

| Attack | Goal | Work for an n-bit digest |
|---|---|---|
| Preimage | Find any input giving a specified digest | 2^n |
| Collision (birthday) | Find any two inputs sharing a digest | 2^(n/2) |

| Digest | Preimage work | Collision work |
|---|---|---|
| 128-bit (MD5) | 2^128 ≈ 3.4 × 10^38 | 2^64 ≈ 1.8 × 10^19 |
| 160-bit (SHA-1) | 2^160 ≈ 1.5 × 10^48 | 2^80 ≈ 1.2 × 10^24 |
| 256-bit (SHA-256) | 2^256 ≈ 1.2 × 10^77 | 2^128 ≈ 3.4 × 10^38 |

The birthday bound is why **a hash needs twice the bits of a cipher for
comparable strength**: SHA-256 pairs with AES-128, not with AES-256. It is
also why MD5 and SHA-1 were retired for signatures while still being fine for
non-adversarial checksums — 2^64 collisions became reachable, 2^128 preimages
did not.

The same square-root logic sets password strength. An 8-character password
drawn uniformly from the 95 printable ASCII characters has
95^8 = 6.6 × 10^15 possibilities, which is **8 · log₂95 = 52.6 bits** of
entropy — less than DES. Twelve characters gives 78.8 bits, which is
respectable; a 4-digit PIN gives 13.3 bits, which is nothing.

## 4.4 The Two Public-Key Operations, on Exam-Sized Numbers

**Diffie–Hellman** lets two parties agree a secret over an open channel.
Publicly: p = 23, g = 5. Alice picks a = 6, Bob picks b = 15, and each keeps
their exponent secret.

| Step | Alice | Bob |
|---|---|---|
| Send | A = 5^6 mod 23 = **8** | B = 5^15 mod 23 = **19** |
| Compute | 19^6 mod 23 = **2** | 8^15 mod 23 = **2** |

Both arrive at 2 without ever transmitting it. An eavesdropper sees 23, 5, 8
and 19 and must solve the discrete logarithm to recover 6 or 15.

**RSA** uses the difficulty of factoring. Take p = 11, q = 13:

| Quantity | Value |
|---|---|
| n = p·q | 143 |
| φ(n) = (p−1)(q−1) | 120 |
| Public exponent e (coprime to φ) | 7 |
| Private exponent d = e⁻¹ mod φ | 103, since 7 · 103 = 721 = 6 · 120 + 1 |
| Encrypt m = 9 | c = 9^7 mod 143 = **48** |
| Decrypt | 48^103 mod 143 = **9** |

The public key is (e, n) = (7, 143) and the private key is (d, n) = (103, 143).
Anyone who can factor 143 into 11 × 13 recovers d immediately, which is why
real moduli are 2048 bits or more.`,
      examTip: 'Symmetric key count is N(N-1)/2, the same formula as full-mesh links; asymmetric is 2N. Brute-force work is 2^(k-1) on average, and a hash needs 2n bits to match an n-bit cipher because of the birthday bound.',
      importantNote: 'RSA private exponent d is the modular inverse of e modulo phi(n), not modulo n. Check your answer by confirming that e*d leaves remainder 1 when divided by phi(n) — for e=7 and phi=120, 7*103 = 721 = 6*120 + 1.',
    },
    { id: 'netsec-recon', title: '5. Reconnaissance, Scanning, and Layered Detection',
      content: `## 5.1 What an Attacker Does Before Attacking

Every intrusion methodology puts reconnaissance first, because an attack needs
a target with a known weakness. The stages, and what defends against each:

| Stage | What it gathers | Countermeasure |
|---|---|---|
| Passive reconnaissance | Public records, DNS entries, job adverts, published documents | Minimise published detail; no internal hostnames in public DNS |
| Host discovery | Which addresses respond at all | Filter inbound ICMP echo at the edge |
| Port scanning | Which services are listening | Close unused ports; filter rather than reject |
| Banner grabbing | Software names and version numbers | Suppress version strings |
| Vulnerability scanning | Known flaws in those versions | Patch management |

Nothing in the first two stages is illegal or even unusual, which is why
detection has to start with the third.

## 5.2 How a Port Scan Reads the TCP State Machine

A scanner learns a port's state from the response the TCP state machine of
RFC 9293 is obliged to give. There are only three outcomes:

| Probe sent | Response | Inference | What it means |
|---|---|---|---|
| SYN | SYN-ACK | **Open** | A service is listening; the scanner sends RST rather than completing the handshake |
| SYN | RST-ACK | **Closed** | The host is reachable but nothing is bound to that port |
| SYN | nothing | **Filtered** | A firewall silently dropped the probe |

The distinction between "closed" and "filtered" is the entire security value
of a firewall's drop-versus-reject setting. A rejected probe confirms the host
exists and tells the scanner it can move on quickly; a dropped probe forces
the scanner to wait for a timeout on every port, which turns a scan of all
**65,535** TCP ports from seconds into hours and leaves the attacker unsure
whether the host is even there.

Two facts about the scan itself are commonly tested. Because the scanner sends
RST instead of the final ACK, the connection is never established and older
logging that records only completed connections misses it entirely — hence the
name **half-open scan**. And the port ranges are fixed by IANA: **1–1023**
well-known, **1024–49151** registered, **49152–65535** dynamic or private, so a
scan of the first thousand ports finds essentially every standard service.

## 5.3 Detection: IDS, IPS, and the Base-Rate Problem

| System | Position | Action on detection |
|---|---|---|
| **IDS** | Out of band, on a mirror port | Alerts; traffic already passed |
| **IPS** | In line | Drops the traffic |
| **Signature-based** | Either | Matches known patterns — precise, blind to novel attacks |
| **Anomaly-based** | Either | Flags deviation from a learned baseline — catches novel attacks, noisy |

The reason tuning matters is arithmetic, not opinion. Suppose a sensor watches
**1,000,000 sessions a day** of which **100 are genuinely malicious**, and it
achieves an excellent 99 % detection rate at a false-positive rate of only
0.1 %:

| Outcome | Count |
|---|---|
| True positives (99 % of 100) | 99 |
| False negatives | 1 |
| False positives (0.1 % of 999,900) | 999.9 |
| Alerts raised per day | 1098.9 |

**Precision = 99 / 1098.9 = 9.0 %.** Nine out of ten alerts are wrong, despite
a sensor that looks superb on both headline numbers. This is the base-rate
effect: when the thing you are looking for is rare, even a tiny false-positive
rate dominates the alert queue. To reach 50 % precision the false-positive
rate would have to fall to **0.0099 %** — a tenfold tightening, since
0.1 / 0.0099 = 10.1. It is the
quantitative reason security teams drown in alerts and why correlation,
allow-listing, and risk scoring exist.

## 5.4 Mapping Controls to the Layer They Defend

Defence in depth means each layer catches what the one outside it missed:

| Layer | Control | Stops |
|---|---|---|
| Perimeter | Stateful firewall, rate limiting | Unsolicited inbound connections, floods |
| Network | Segmentation, VLANs, ingress filtering (BCP 38) | Lateral movement, spoofed source addresses |
| Transport | TLS | Eavesdropping and tampering in transit |
| Host | Patching, host firewall, least privilege | Exploitation of a reachable service |
| Application | Input validation, parameterised queries | Injection |
| Data | Encryption at rest, key management | Loss of a stolen disk or backup |
| Identity | Multi-factor authentication | Credential reuse and phishing |

Two of these deserve emphasis because they are commonly confused.
**Authentication** proves who you are, **authorisation** decides what you may
do, and **accounting** records what you did — the AAA triad, and a question
that describes a user who logs in successfully but cannot open a file is an
authorisation question, not an authentication one. And **ingress filtering**
per BCP 38 is the only control in the table that protects other people's
networks rather than your own: it prevents your hosts from emitting packets
with forged source addresses, which is what makes reflection and amplification
attacks possible.`,
      examTip: 'A port scan distinguishes three states, not two: SYN-ACK means open, RST means closed, and silence means filtered. Configure firewalls to DROP rather than REJECT so scanners get silence and must wait out a timeout on every port.',
      importantNote: 'Detection rate and false-positive rate are not enough to judge a sensor. With rare events, precision = TP/(TP+FP) collapses: a 99 % detector at 0.1 % false positives on a million sessions produces about 1099 alerts of which only 99 are real — 9 % precision.',
    },
    { id: 'netsec-cia', title: '6. The CIA Triad, Made Operational',
      content: `## 6.1 Three Properties, Three Numbers

Confidentiality, integrity and availability are a checklist until each is
attached to a quantity. Once they are, a security decision becomes the same
kind of engineering comparison as a cable budget: state the requirement, state
the mechanism, compute whether the mechanism meets it.

| Property | Mechanism | The number that measures it |
|---|---|---|
| Confidentiality | Encryption | Expected work to recover the key, 2 to the power k minus 1 |
| Integrity | Authentication tag or signature | Probability an altered message passes, 2 to the power minus t |
| Availability | Redundancy and capacity | Uptime fraction, and the downtime minutes it implies |

Each of those has an exact expression. For confidentiality, an attacker who
can test r keys per second and faces a k-bit key expects to succeed after
half the key space:

$$t_{\\mathrm{break}} = \\frac{2^{\\,k-1}}{r}$$

For integrity, an authentication tag of t bits can be guessed blindly with
probability 2 to the power minus t per attempt, so the expected number of
attempts before one succeeds is 2 to the power t:

$$P_{\\mathrm{forge}} = 2^{-t}, \\qquad E[\\text{attempts}] = 2^{\\,t}$$

For availability, the arithmetic of section 5 in the topologies chapter
applies unchanged, because a denial-of-service attack and a failed power
supply produce the same downtime column:

$$A = \\frac{\\mathrm{MTBF}}{\\mathrm{MTBF} + \\mathrm{MTTR}}, \\qquad U = (1 - A)\\times 525600 \\ \\mathrm{min/yr}$$

## 6.2 Integrity Is Where Truncation Quietly Costs You

The forgery expression makes a common shortcut visible as a number. Tags are
often truncated to save bytes, and each bit removed halves the work an
attacker needs.

| Tag length t | Probability one blind forgery passes | Attempts at 10^6 per second |
|---|---|---|
| 128 bits | 2.94 × 10^-39 | 1.08 × 10^25 years |
| 96 bits | 1.26 × 10^-29 | 2.51 × 10^15 years |
| 64 bits | 5.42 × 10^-20 | 584,542 years |
| 32 bits | 2.328 × 10^-10 | 71.6 minutes |

### Worked Example 6.1 — Is a 32-Bit Tag Ever Acceptable?

**Given.** A protocol truncates its authentication tag to 32 bits. An attacker
can submit 10^6 forged messages per second and the system does not rate-limit
failures. How long until one is accepted?

**Step 1 — attempts needed.** The expected number of blind attempts is 2^32.

**Step 2 — divide by the rate.**

$$\\frac{2^{32}}{10^{6}} = 4295\\ \\mathrm{s} = 71.6\\ \\mathrm{min}$$

**Step 3 — introduce a defence and recompute.** Lock the channel after 10
consecutive failures, so an attacker gets 10 attempts per session and sessions
cost one second to establish. The effective rate falls to 10 per second:

$$\\frac{2^{32}}{10} = 4.295\\times 10^{8}\\ \\mathrm{s} = 13.6\\ \\mathrm{years}$$

**Answer.** 71.6 minutes unprotected, 13.6 years with a failure lockout. The
tag length did not change; the *rate* did. This is the general shape of every
authentication defence: **when the secret is short, the only remaining lever
is how fast an attacker may guess**, which is why lockouts, rate limits and
deliberately slow verification exist at all.

## 6.3 Risk Arithmetic: Deciding Whether a Control Is Worth Buying

Security spending is justified with two multiplications. The single loss
expectancy is what one incident costs, and the annualised loss expectancy is
what the risk costs per year.

$$\\mathrm{SLE} = \\mathrm{AV} \\times \\mathrm{EF}, \\qquad \\mathrm{ALE} = \\mathrm{SLE} \\times \\mathrm{ARO}$$

Here AV is the asset value, EF the exposure factor — the fraction of the asset
lost in one incident — and ARO the annualised rate of occurrence. A control is
worth buying when the reduction in ALE exceeds its annual cost:

$$\\mathrm{ROSI} = \\frac{\\mathrm{ALE}_{\\mathrm{before}} - \\mathrm{ALE}_{\\mathrm{after}} - C}{C}$$

### Worked Example 6.2 — Justifying a Control

**Given.** An asset valued at 250,000 (all figures in one consistent currency
unit). An incident destroys 40 % of its value. The incident is expected once
every four years. A proposed control costs 8,000 a year and cuts the rate to
once every twenty years. Should it be bought?

**Step 1 — single loss expectancy.**

$$\\mathrm{SLE} = 250000 \\times 0.40 = 100000$$

**Step 2 — annualised loss, before and after.** Once in four years is
ARO = 0.25; once in twenty is ARO = 0.05.

$$\\mathrm{ALE}_{\\mathrm{before}} = 100000 \\times 0.25 = 25000$$

$$\\mathrm{ALE}_{\\mathrm{after}} = 100000 \\times 0.05 = 5000$$

**Step 3 — return.**

$$\\mathrm{ROSI} = \\frac{25000 - 5000 - 8000}{8000} = \\frac{12000}{8000} = 1.5$$

**Answer.** Yes: the control returns 150 % a year. The break-even is worth
computing too — the control pays for itself as long as it removes at least
8,000 of expected loss, which is an ARO reduction of 8000/100000 = 0.08, so
anything that takes the rate from 0.25 down below 0.17 is profitable. Note
what this framework does and does not do: it compares *expected* values, so it
is silent about a rare catastrophic loss that would end the organisation. That
is why availability requirements are usually written as hard floors rather
than as expected values.`,
      examTip: 'Attach a number to each leg of the triad: confidentiality is 2^(k-1)/r seconds of expected search, integrity is 2^-t per forgery attempt, availability is MTBF/(MTBF+MTTR). Risk arithmetic is two multiplications: SLE = AV x EF and ALE = SLE x ARO, and a control is worth buying when the drop in ALE exceeds its annual cost.',
      importantNote: 'A short authentication tag is not automatically broken — what breaks it is an unlimited guessing rate. A 32-bit tag falls in 71.6 minutes at a million attempts a second and survives 13.6 years at ten a second. Rate limiting is a cryptographic control, not an operational nicety.',
    },
    { id: 'netsec-strength', title: '7. Key Strength and Why Length Beats Obscurity',
      content: `## 7.1 The Only Security Property That Scales Exponentially

Every other defence in this chapter is linear or worse: more firewall rules,
more sensors, more staff. Key length is the exception, and the reason is the
shape of the search:

$$N = 2^{k}, \\qquad E[\\text{trials}] = 2^{\\,k-1}, \\qquad t_{\\mathrm{break}} = \\frac{2^{\\,k-1}}{r}$$

An attacker who multiplies their rate by a factor sigma gains only the
logarithm of that factor in effective key bits:

$$\\Delta k = \\log_{2}\\sigma$$

| Attacker improvement | Bits it is worth |
|---|---|
| 10 times faster | 3.32 |
| 1,000 times faster | 9.97 |
| One million times faster | 19.93 |
| One billion times faster | 29.90 |

**A billion-fold improvement in attack hardware is worth thirty bits.** A
defender adds thirty bits by changing a configuration line. That asymmetry —
exponential defence against linear attack — is the entire argument for
choosing long keys rather than secret algorithms, and it is the quantitative
form of the principle that a system should stay secure even when everything
except the key is public.

## 7.2 What a Published Algorithm Buys

Keeping an algorithm secret adds, at best, the entropy of "which algorithm",
which is a handful of bits from a small catalogue and falls to zero the first
time anyone examines an implementation. Keeping a key secret adds k bits that
cannot be recovered by examination. Concretely, guessing among 64 plausible
algorithm choices is worth 6 bits, which a 56-bit key already dwarfs and a
128-bit key makes irrelevant. Publishing also buys something a secret cannot:
review. A published algorithm that has survived years of public attack has a
measured strength; a secret one has an assumed strength, and the difference is
not a preference but the presence or absence of evidence.

## 7.3 Public Keys Must Be Far Longer, and Here Is Why

Symmetric keys are attacked by exhaustive search, which costs 2^(k−1). Public
keys are attacked by algorithms that exploit their structure, and those cost
far less than exhaustive search. Factoring an RSA modulus with the general
number field sieve costs approximately

$$L(n) = \\exp\\left(1.923\\,(\\ln n)^{1/3}(\\ln\\ln n)^{2/3}\\right)$$

$$\\log_{2} L(n) = \\frac{1.923\\,(\\ln n)^{1/3}(\\ln \\ln n)^{2/3}}{\\ln 2}$$

![Equivalent symmetric strength against public-key modulus width, from five hundred to eight thousand bits, computed from the number field sieve cost expression. The curve passes about eighty-seven bits at a thousand-and-twenty-four-bit modulus, one hundred and seventeen at two thousand and forty-eight, one hundred and thirty-nine at three thousand and seventy-two, and reaches one hundred and ninety-two at about six thousand seven hundred. Horizontal guides mark the one hundred and twelve, one hundred and twenty-eight and one hundred and ninety-two bit symmetric levels.](/courses/fe-ee/figures/net3-keylength-margin.svg)

| Modulus width | Estimated work, log2 L | Nearest symmetric level |
|---|---|---|
| 1024 bits | 86.8 | below 112 |
| 2048 bits | 116.9 | 112 |
| 3072 bits | 138.7 | 128 |
| 6706 bits | 192.0 | 192 |

The curve flattens, and that is the whole point. Going from 1024 to 2048 bits
buys 30 bits; going from 2048 to 3072 buys 22 more; reaching 192 bits of
strength needs a modulus 3.27 times as wide as the one that reaches 117. A
symmetric key would have covered the same ground by adding 75 characters of
nothing to a configuration file. The estimates above drop a slowly varying
term from the cost expression and therefore run a few bits optimistic against
the strengths that standards bodies publish; the *shape* — sublinear, sharply
diminishing — is what to carry into the exam.

Elliptic curves do far better because the best known attack on them is a
generic square-root search rather than a structural one. Pollard rho on a
curve group of order 2^m costs

$$W_{\\rho} \\approx \\sqrt{\\frac{\\pi}{4}\\,2^{m}} = 2^{\\,m/2 - 0.175}$$

so a 256-bit curve delivers 127.8 bits of work — matching a 128-bit symmetric
key with a public value one twelfth the width of the RSA modulus that does the
same job.

## 7.4 Stretching a Weak Secret Into a Stronger One

Human-chosen secrets are short, and no policy fixes that. What can be fixed is
the cost of testing one. A key-derivation function repeats its inner operation
c times, so an attacker pays c times as much per guess, which adds log2 c bits
of effective strength:

$$H_{\\mathrm{eff}} = H + \\log_{2} c$$

### Worked Example 7.1 — How Much Does Stretching Buy?

**Given.** An eight-character password drawn uniformly from the 95 printable
ASCII characters, hashed with 600,000 iterations. What is the effective
strength, and how long does an attacker at 10^10 raw hashes per second need?

**Step 1 — raw entropy.**

$$H = 8 \\times 6.5699 = 52.56\\ \\mathrm{bits}$$

**Step 2 — the stretch.**

$$\\log_{2} 600000 = 19.19\\ \\mathrm{bits}, \\qquad H_{\\mathrm{eff}} = 52.56 + 19.19 = 71.75\\ \\mathrm{bits}$$

**Step 3 — time to search half the space.**

$$t = \\frac{2^{70.75}}{10^{10}} = 1.986 \\times 10^{11}\\ \\mathrm{s} = 6292\\ \\mathrm{years}$$

**Answer.** 71.75 effective bits, about 6,290 years. Without the stretch the
same password falls after 2^51.56 guesses, which is 3.32 × 10^5 seconds, or
**3.84 days**. The ratio of the two is 600,000 exactly, which is the iteration
count — a useful check that the arithmetic has not gone astray. **Iteration
count is the single most powerful lever available for protecting stored
credentials**, and it costs the defender one verification per login while
costing the attacker one per guess, an asymmetry of exactly the ratio between
logins and guesses.

### Worked Example 7.2 — Comparing Two Key Lengths Honestly

**Given.** An attacker manages 10^12 keys per second. Compare a 56-bit key, a
112-bit key and a 128-bit key.

**Apply the work-factor expression.**

$$\\frac{2^{55}}{10^{12}} = 36028.8\\ \\mathrm{s} = 10.01\\ \\mathrm{h}$$

$$\\frac{2^{111}}{10^{12}} = 2.596\\times 10^{21}\\ \\mathrm{s} = 8.23\\times 10^{13}\\ \\mathrm{yr}$$

$$\\frac{2^{127}}{10^{12}} = 1.701 \\times 10^{26}\\ \\mathrm{s} = 5.39\\times 10^{18}\\ \\mathrm{yr}$$

**Answer.** Ten hours, 82 trillion years, and 5.4 billion billion years. The
56-bit figure is the one to remember, because it is the reason a whole
generation of equipment was retired: the algorithm was never broken, the key
simply became short enough to enumerate. **Adding 56 bits multiplied the work
by 7.2 × 10^16** — that is one configuration change against sixteen orders of
magnitude, and it is why the answer to "is this cipher strong enough" is
almost always a statement about key length rather than about the cipher.`,
      examTip: 'Expected brute-force work is 2^(k-1), and an attacker who gets sigma times faster gains only log2(sigma) bits — a billion-fold speedup is worth thirty bits. Public keys need far more bits than symmetric keys because the attack is structural rather than exhaustive: roughly 2048 RSA bits or 256 curve bits to match a 112 to 128 bit symmetric key.',
      importantNote: 'Key stretching adds log2(c) bits for c iterations, so 600000 iterations add 19.19 bits. The same eight-character password goes from falling in about a third of a second to surviving thousands of years. The password did not improve; the cost per guess did.',
    },
    { id: 'netsec-hash', title: '8. Hashing and the Birthday Bound, Derived',
      content: `## 8.1 Deriving the Collision Probability

A hash maps arbitrary input into one of M = 2^n possible digests. Ask for the
probability that q distinct inputs produce at least one repeat. It is easier to
compute the complement: the first input can land anywhere, the second must miss
one occupied value, the third must miss two, and so on.

$$P_{\\mathrm{no}} = \\prod_{i=0}^{q-1}\\left(1 - \\frac{i}{M}\\right)$$

Take logarithms and use the fact that the logarithm of one minus a small
quantity is approximately the negative of that quantity:

$$\\ln P_{\\mathrm{no}} = \\sum_{i=0}^{q-1}\\ln\\left(1 - \\frac{i}{M}\\right) \\approx -\\sum_{i=0}^{q-1}\\frac{i}{M} = -\\frac{q(q-1)}{2M}$$

$$P_{\\mathrm{coll}} \\approx 1 - \\exp\\left(-\\frac{q(q-1)}{2M}\\right)$$

Setting that equal to one half and solving for q gives the number of samples
at which a collision becomes more likely than not:

$$q_{50} \\approx \\sqrt{2 \\ln 2 \\cdot M} = 1.1774\\sqrt{M} = 1.1774 \\times 2^{\\,n/2}$$

**The square root is the entire story.** Doubling the digest width does not
double the collision resistance; it squares it, which is why an n-bit hash is
said to give only n/2 bits of collision resistance.

![Probability of at least one collision against the number of items hashed into a twenty-four-bit digest space. The exact product and the exponential approximation lie on top of one another and cross one half at four thousand eight hundred and twenty-three items, and Monte-Carlo points at two thousand, five thousand and nine thousand items sit on the curve.](/courses/fe-ee/figures/net3-birthday-curve.svg)

The classic sanity check is the shared-birthday problem, which is the same
formula with M = 365:

$$1 - e^{-23 \\times 22 / (2 \\times 365)} = 1 - e^{-0.6932} = 0.5000$$

The exact product gives 0.5073, so the approximation is good to seven parts in
a thousand at a sample size only 1.2 times the square root of M. Both were
confirmed by simulation: drawing 23 values from 365 a few hundred thousand
times produced a collision about 50.7 % of the time.

## 8.2 What the Bound Means for Real Digest Sizes

$$q_{50} = 1.1774 \\times 2^{32} = 5.057\\times 10^{9} \\quad (n = 64)$$

$$q_{50} = 1.1774 \\times 2^{64} = 2.172\\times 10^{19} \\quad (n = 128)$$

$$q_{50} = 1.1774 \\times 2^{128} = 4.006\\times 10^{38} \\quad (n = 256)$$

| Digest | Preimage work | Collision work | Time to a collision at 10^12 hashes per second |
|---|---|---|---|
| 64-bit | 2^64 | 2^32 | 5.06 milliseconds |
| 128-bit | 2^128 | 2^64 | 251 days |
| 160-bit | 2^160 | 2^80 | 45,100 years |
| 256-bit | 2^256 | 2^128 | 1.27 × 10^19 years |

The 128-bit row is the one that changes behaviour. A digest that sounds
enormous falls to a determined adversary inside a year, which is why 128-bit
digests were retired from signature use while remaining perfectly adequate for
non-adversarial integrity checks — a corrupted download is not choosing its
own corruption. **Pair a hash with a cipher of half its width**: a 256-bit
digest matches a 128-bit key, and a 128-bit digest matches a 64-bit key, which
is no longer a sensible pairing at all.

## 8.3 The Truncation Trap

Truncating a strong hash to save space cuts the collision resistance by half
the bits removed, and does so silently.

| Stored digest | Preimage resistance | Collision resistance |
|---|---|---|
| Full 256-bit | 256 bits | 128 bits |
| Truncated to 160 | 160 bits | 80 bits |
| Truncated to 128 | 128 bits | 64 bits |
| Truncated to 64 | 64 bits | 32 bits |

A 64-bit truncation of a 256-bit hash has 32 bits of collision resistance,
which is about four billion attempts — seconds of work. Nothing about the
underlying algorithm changed.

### Worked Example 8.1 — Collision Risk in a Deduplication Index

**Given.** A storage system identifies blocks by a 64-bit fingerprint and holds
10^6 blocks. What is the probability that two different blocks are treated as
identical?

**Apply the approximation with M = 2^64.**

$$P_{\\mathrm{coll}} \\approx 1 - \\exp\\left(-\\frac{10^{6}(10^{6}-1)}{2 \\times 2^{64}}\\right)$$

**Evaluate the exponent.** The numerator q(q − 1) is 9.99999 × 10^11 and the
denominator 2M is 3.68935 × 10^19, so the exponent is 2.7105 × 10^-8. Because
that exponent is tiny, the exponential is very nearly one minus itself, and
the probability equals the exponent to five figures.

$$P_{\\mathrm{coll}} \\approx 2.7105\\times 10^{-8}$$

**Answer.** About one chance in 36.9 million, per index of that size. Now
scale it: at 10^9 blocks the same expression gives 2.67 × 10^-2, roughly one
chance in 37, because the probability grows as the *square* of the block
count. By 5.06 × 10^9 blocks — the q50 figure for a 64-bit space — a collision
is an even bet. **Collision risk grows quadratically with scale**, so the
fingerprint that was overwhelmingly safe at a million blocks becomes a coin
toss after a thousandfold growth, which is the single most useful thing to
know when a design is asked to scale.

### Worked Example 8.2 — Sizing a Digest for a Stated Risk

**Given.** A system will hash 2^40 items and must keep the collision
probability below 2^-30. What digest width is needed?

**Start from the approximation and use the small-argument form.**

$$P \\approx \\frac{q^{2}}{2M} = \\frac{2^{80}}{2 \\cdot 2^{n}} = 2^{\\,79-n}$$

**Set the requirement and solve.**

$$2^{\\,79-n} \\le 2^{-30} \\;\\Longrightarrow\\; n \\ge 109$$

**Answer.** At least 109 bits, so a 128-bit digest suffices and a 96-bit one
does not. Notice the structure of the answer: the required width is roughly
twice the log of the item count plus the number of bits of safety demanded.
That rule of thumb — **twice the log of the population, plus the safety
margin** — sizes a digest correctly without re-deriving anything.

## 8.4 Keyed Hashes: Integrity Against an Adversary

A bare hash proves a message was not corrupted by accident. It proves nothing
against an adversary, who can recompute the digest of whatever they substitute.
Integrity against an adversary needs a secret, which is what a message
authentication code adds:

$$\\mathrm{MAC} = H\\left((K \\oplus \\mathrm{opad}) \\,\\Vert\\, H\\left((K \\oplus \\mathrm{ipad}) \\,\\Vert\\, m\\right)\\right)$$

The nested construction exists because appending a key to a message and
hashing it is vulnerable to length extension in some hash designs; the two-pass
form is not. The security of the result is the smaller of the key entropy and
the tag width, so a 256-bit key with a 96-bit tag delivers 96 bits, and the
work of matching that tag by chance is the forgery expression of section 6.2.

| Construction | Detects accidental corruption | Detects deliberate substitution | Proves who sent it |
|---|---|---|---|
| Plain hash | Yes | No | No |
| Keyed hash with a shared key | Yes | Yes | Only to the two key holders |
| Digital signature | Yes | Yes | Yes, to anyone |

The third column is the one exam questions turn on. A shared-key tag cannot
provide non-repudiation, because either holder of the key could have produced
it; only a private key held by exactly one party can.`,
      examTip: 'Collision work is the square root of preimage work: 2^(n/2) against 2^n. The fifty per cent point is 1.1774 times 2^(n/2). Collision probability grows as the SQUARE of the number of items, so a fingerprint that is safe at a million items may not be at a billion. A truncated digest loses collision resistance at half the rate bits are removed.',
      importantNote: 'A plain hash gives integrity only against accidents. Against an adversary who can recompute it, integrity requires a secret — a keyed tag for two parties, or a signature when anyone must be able to verify. Only the signature gives non-repudiation, because a shared key could have been used by either holder.',
    },
    { id: 'netsec-trust', title: '9. Signatures, Certificate Chains and Authentication',
      content: `## 9.1 A Signature on Exam-Sized Numbers

Section 4.4 built the key pair (e, n) = (7, 143) and (d, n) = (103, 143).
Signing uses the private exponent on the digest and verification uses the
public one, which is the reverse of encryption and the most commonly reversed
answer on this topic.

$$s = H(m)^{d} \\bmod n, \\qquad \\text{verify: } s^{e} \\bmod n \\overset{?}{=} H(m)$$

### Worked Example 9.1 — Sign, Verify, and Watch a Forgery Fail

**Given.** The key pair above. The digest of the message is H(m) = 5.

**Step 1 — sign with the private exponent.**

$$s = 5^{103} \\bmod 143 = 125$$

**Step 2 — verify with the public exponent.**

$$125^{7} \\bmod 143 = 5 = H(m) \\quad \\checkmark$$

**Step 3 — try a forgery.** An attacker who does not know d guesses a
signature of 124:

$$124^{7} \\bmod 143 = 97 \\ne 5 \\quad \\times$$

**Answer.** The signature is 125, verification returns the digest exactly, and
a wrong signature returns an unrelated value. The forger's problem is that
producing a value whose seventh power modulo 143 equals 5 means computing a
seventh root modulo a composite, which is as hard as factoring 143 — trivial at
this size, and the reason real moduli are 2048 bits or wider. Every modular
exponentiation here was recomputed independently by repeated squaring rather
than reused from the encryption example.

## 9.2 A Certificate Chain Is a Series System

A certificate proves a binding between a name and a public key, and it is
trusted because something else signed it, and that in turn because something
else signed *it*. The chain is therefore a **series** arrangement in exactly
the sense of the reliability algebra: every link must hold.

$$P_{\\mathrm{chain}} = \\prod_{i=1}^{k} p_i = 0.999^{3} = 0.997003$$

The more interesting number is the trust store. A relying party trusts many
roots, and a compromise of **any one** of them produces a certificate the party
will accept. That is a parallel arrangement of failures, so the probabilities
add up rather than multiply down:

$$P_{\\mathrm{any}} = 1 - (1 - \\varepsilon)^{r}$$

| Roots trusted, r | At epsilon = 0.001 per year | At epsilon = 0.0001 |
|---|---|---|
| 10 | 0.00996 | 0.00100 |
| 50 | 0.04879 | 0.00499 |
| 150 | 0.13936 | 0.01489 |
| 300 | 0.25929 | 0.02956 |

**A trust store of 150 roots at one-in-a-thousand each fails about 14 % of
years.** Nothing about the cryptography is weak; the exposure comes entirely
from the count. This is why pinning a specific key, or constraining a root to
particular name spaces, buys so much: both reduce r for the connection that
matters, and r is the term doing the damage.

## 9.3 Revocation Is a Window, Not an Event

Revoking a certificate does not un-issue it. Relying parties learn about the
revocation only when they next fetch the status, so the exposure is the
average age of the information they hold:

$$E[\\text{window}] = \\frac{T_{\\mathrm{refresh}}}{2}, \\qquad E[\\text{accepted}] = \\lambda\\,E[\\text{window}]$$

### Worked Example 9.2 — Sizing the Revocation Exposure

**Given.** A service handles 40 transactions per second. Compare a revocation
list published every 24 hours with a status responder whose answers are cached
for 4 hours.

**Step 1 — expected windows.** 24/2 = 12 h and 4/2 = 2 h.

**Step 2 — transactions inside each window.**

$$40 \\times 12 \\times 3600 = 1728000 \\ \\text{transactions}$$

$$40 \\times 2 \\times 3600 = 288000 \\ \\text{transactions}$$

**Answer.** 1,728,000 against 288,000 — a factor of six, which is exactly the
ratio of the refresh intervals. The lesson is that revocation latency is a
design parameter with a directly computable cost, and that shortening
certificate lifetimes achieves the same thing from the other end: a certificate
valid for 90 days cannot be misused for longer than that even if revocation
fails entirely.

## 9.4 Authentication Factors and the Honest Entropy of a Policy

An authentication factor is something known, something held, or something
measured. Combining independent factors multiplies the probabilities that each
is defeated:

$$P_{\\mathrm{joint}} = \\prod_{i} p_i$$

![Secret entropy against length for three alphabets — ten digits, twenty-six lower-case letters and ninety-five printable characters — with dashed guides at the strength needed to survive one day and one century at ten to the tenth guesses per second. Eight printable characters give 52.6 bits, twelve give 78.8 bits, and a four-digit PIN gives 13.3 bits.](/courses/fe-ee/figures/net3-password-entropy.svg)

The entropy of a uniformly drawn secret is exact:

$$H = L \\log_{2} A$$

$$H_{8} = 8 \\times 6.5699 = 52.56\\ \\mathrm{bits}, \\qquad H_{12} = 12 \\times 6.5699 = 78.84\\ \\mathrm{bits}$$

$$H_{\\mathrm{PIN}} = 4 \\times 3.3219 = 13.29\\ \\mathrm{bits}$$

The honest part is admitting that people do not draw uniformly. A policy
demanding one capital, one digit and one symbol in nine characters is usually
satisfied by a capital, six lower-case letters, a digit and a symbol, in that
order. Compute the entropy of *that pattern* rather than of the alphabet:

$$H = \\log_{2}26 + 6\\log_{2}26 + \\log_{2}10 + \\log_{2}32 = 4.700 + 28.203 + 3.322 + 5.000 = 41.225$$

$$9 \\times 6.5699 = 59.13, \\qquad 59.13 - 41.225 = 17.905\\ \\mathrm{bits\\ lost}$$

**The predictable arrangement costs about 17.9 bits**, which is a factor of
245,000 in attacker work, and it is lost precisely because the policy told
everyone where to put the capital. A passphrase avoids the problem by making
the unit of choice a word instead of a character:

$$4\\log_{2}7776 = 4 \\times 12.925 = 51.70\\ \\mathrm{bits}, \\qquad 6 \\times 12.925 = 77.55\\ \\mathrm{bits}$$

Six words from a 7,776-word list land within 1.3 bits of twelve random
printable characters — 77.55 against 78.84 — and are enormously easier to
remember and to type. That is the case for length over composition rules,
stated as arithmetic rather than as opinion: the passphrase reaches the same
strength through a mechanism people will actually comply with, and compliance
is what keeps the *actual* distribution close to the uniform one the entropy
expression assumes.

### Worked Example 9.3 — What Multi-Factor Really Buys

**Given.** A password is compromised with probability 0.03 per user-year. A
hardware authenticator is compromised with probability 0.002. Compute the
joint risk, first assuming independence and then allowing that 60 % of
password compromises come from a phishing page that also captures the second
factor in real time.

**Step 1 — independent case.**

$$P_{\\mathrm{joint}} = 0.03 \\times 0.002 = 0.00006$$

$$\\text{reduction} = \\frac{0.03}{0.00006} = 500$$

**Step 2 — correlated case.** With correlation c = 0.6, a password compromise
defeats the second factor outright with probability c, and otherwise only if
the authenticator is independently compromised:

$$P_{\\mathrm{corr}} = p_1\\left(c + (1-c)\\,p_2\\right) = 0.03 \\times (0.6 + 0.4\\times 0.002) = 0.018024$$

$$\\text{reduction} = \\frac{0.03}{0.018024} = 1.664$$

**Answer.** 500-fold if the factors are independent, **1.66-fold if they are
not**. The multiplication rule was doing all the work, and correlation
destroys it. This is exactly why the design question about a second factor is
not "does it exist" but "can one event defeat both", and why factors bound to
the origin — so that a relayed challenge simply does not verify — are worth so
much more than a code a user can be persuaded to read aloud. Both figures were
confirmed by simulating the two-stage compromise a few hundred thousand times.`,
      examTip: 'Private key signs, public key verifies — the reverse of encryption. A certificate chain is a series system, so every link must hold, but a trust store is a parallel system, so a compromise of ANY root is enough: 150 roots at 0.001 each give a 13.9 percent annual chance. Revocation exposure is half the refresh interval times the transaction rate.',
      importantNote: 'Multi-factor authentication multiplies risks only when the factors are independent. If 60 percent of password compromises also capture the second factor, a 500-fold reduction collapses to 1.66-fold. Always ask whether one event can defeat both factors before quoting a product of probabilities.',
    },
    { id: 'netsec-controls', title: '10. Firewalls, Segmentation and the Cost of a Tunnel',
      content: `## 10.1 Rule Order Is a Measurable Cost

A first-match rule list is evaluated top to bottom, so the expected number of
comparisons per packet is the position of each rule weighted by how often it
is the one that matches:

$$E[c] = \\sum_{i=1}^{R} i\\,p_i$$

### Worked Example 10.1 — Ordering a Rule Set

**Given.** Five rules match with probabilities 0.60, 0.25, 0.10, 0.04 and
0.01. Compare the best and worst orderings.

**Best order, most frequent first.**

$$E[c] = (1)(0.60) + (2)(0.25) + (3)(0.10) + (4)(0.04) + (5)(0.01) = 1.61$$

**Worst order, reversed.**

$$E[c]_{\\mathrm{worst}} = (1)(0.01) + (2)(0.04) + (3)(0.10) + (4)(0.25) + (5)(0.60) = 4.39$$

**Ratio.**

$$\\frac{4.39}{1.61} = 2.727$$

**Answer.** 1.61 comparisons against 4.39, a 2.73-fold difference in
evaluation cost for a rule set that is functionally identical. On a device
processing millions of packets a second this is the difference between
comfortable headroom and a forwarding bottleneck. **Ordering is free
performance**, subject to the constraint that reordering must not change which
rule matches — which is why specific denies stay above general permits even
when they are rare.

## 10.2 Segmentation Counted as Reachable Pairs

A flat network lets every host reach every other, so the reachable pairs are
the same count as full-mesh links:

$$R_{\\mathrm{flat}} = \\frac{n(n-1)}{2}$$

Dividing the hosts into s segments that do not talk to one another leaves only
the within-segment pairs:

$$R_{\\mathrm{seg}} = s\\,\\frac{(n/s)\\left(n/s - 1\\right)}{2}, \\qquad \\frac{R_{\\mathrm{flat}}}{R_{\\mathrm{seg}}} = \\frac{n-1}{n/s - 1}$$

| Design, n = 1000 | Reachable pairs | Reduction | Hosts one compromise reaches |
|---|---|---|---|
| Flat | 499,500 | 1.00 | 999 |
| 10 segments of 100 | 49,500 | 10.09 | 99 |
| 20 segments of 50 | 24,500 | 20.39 | 49 |
| 50 segments of 20 | 9,500 | 52.58 | 19 |

$$\\frac{499500}{49500} = 10.09$$

The reduction is very nearly the segment count, and the blast radius falls in
exact step with it. That is the quantitative content of the phrase "limit
lateral movement": segmentation does not stop an intrusion, it divides by s
the number of things the intrusion can touch next.

## 10.3 Detection: Bayes With Security Labels

The precision expression in section 5.3 is Bayes' theorem written with the
labels a security team uses. Let pi be the base rate — the fraction of traffic
that is truly malicious:

$$\\mathrm{PPV} = \\frac{\\mathrm{TPR}\\,\\pi}{\\mathrm{TPR}\\,\\pi + \\mathrm{FPR}\\left(1 - \\pi\\right)}$$

![Precision against base rate for a detector held at a ninety-nine per cent detection rate, at false-positive rates of ten to the minus three, minus four and minus five. All three curves rise from near zero at a base rate of one in a million towards one at one in ten, and each crosses half precision at a base rate approximately equal to its own false-positive rate.](/courses/fe-ee/figures/net3-detection-precision.svg)

$$\\mathrm{PPV} = \\frac{0.99 \\times 10^{-4}}{0.99 \\times 10^{-4} + 10^{-3}\\left(1 - 10^{-4}\\right)} = 0.09009$$

The figure shows the shape that matters: each curve crosses 50 % precision
where the base rate is about equal to the false-positive rate. **A sensor is
useful when its false-positive rate is below the base rate of the thing it is
looking for**, and useless when it is above. That single sentence, read off the
crossings, answers most tuning questions without further arithmetic.

| Change made | Precision | Comment |
|---|---|---|
| Baseline: FPR 10^-3, base rate 10^-4 | 9.0 % | Nine alerts in ten are wrong |
| Tighten FPR to 10^-5 | 90.8 % | A hundredfold tightening |
| Instead, narrow the scope so the base rate is 10^-2 | 90.9 % | Same gain, no sensor change |
| Raise TPR from 0.99 to 0.999, FPR unchanged | 9.1 % | Almost nothing |

The third row is the practical one. Pointing the same sensor at a smaller,
higher-risk population raises precision exactly as much as a hundredfold
improvement in the sensor, and costs nothing. The fourth row is the trap:
improving the detection rate, which is the number vendors quote, barely moves
precision at all when events are rare.

## 10.4 What a Tunnel Costs in Bytes

Encapsulation adds fixed headers and rounds the payload up to the cipher's
block size. For a tunnel-mode packet with a new outer header, a sequence and
index header, an initialisation vector, ciphertext padded to 16-byte blocks,
and an integrity value:

$$W = 20 + 8 + 16 + P + 12, \\qquad P = 16\\left\\lceil \\frac{\\ell + 2}{16} \\right\\rceil$$

$$\\eta = \\frac{\\ell}{W}$$

![Goodput fraction against inner packet size for a tunnel-mode encapsulation, from forty to fourteen hundred and fifty bytes. The staircase caused by sixteen-byte block padding sits just below the smooth curve for fixed overhead alone. A sixty-four byte packet achieves forty-seven point one per cent, five hundred and seventy-six bytes achieve eighty-eight point nine, and fourteen hundred and thirty-eight achieve ninety-six point one.](/courses/fe-ee/figures/net3-esp-goodput.svg)

### Worked Example 10.2 — Overhead and the Inner MTU

**Given.** A 1500-byte path MTU. Find the wire size and goodput for inner
packets of 1400 and 64 bytes, and the largest inner packet that avoids
fragmentation.

**Step 1 — a 1400-byte inner packet.** The padded ciphertext must be a
multiple of 16 and cover 1400 + 2 = 1402 bytes:

$$P = 16\\left\\lceil \\frac{1402}{16} \\right\\rceil = 16 \\times 88 = 1408$$

$$W = 20 + 8 + 16 + 1408 + 12 = 1464, \\qquad \\eta = \\frac{1400}{1464} = 0.9563$$

**Step 2 — a 64-byte inner packet.** 64 + 2 = 66 rounds up to 80:

$$W_{64} = 20 + 8 + 16 + 80 + 12 = 136, \\qquad \\eta = \\frac{64}{136} = 0.4706$$

**Step 3 — the inner MTU.** The wire size must not exceed 1500, so the padded
block satisfies P at most 1500 − 56 = 1444, and the largest multiple of 16 not
exceeding 1444 is 1440, which covers an inner packet of 1438 bytes.

**Answer.** 95.6 % goodput at 1400 bytes, **47.1 % at 64 bytes**, and an inner
MTU of 1438 with 1496 bytes on the wire. Two consequences follow. Small
packets — acknowledgements, voice frames, control traffic — lose more than half
their capacity to encapsulation, so a tunnel carrying mostly small packets
needs roughly twice the raw bandwidth of the traffic it carries. And the inner
MTU must be advertised or discovered: a host that keeps sending 1500-byte
packets into this tunnel will have every one of them fragmented or dropped.

## 10.5 What a Tunnel Costs in Cycles

Bytes are only half the bill. Encryption throughput on a general-purpose core
is set by the cost of the cipher in cycles per byte:

$$T = \\frac{8f}{c} \\quad [\\mathrm{bit/s}], \\qquad c_{\\max} = \\frac{8f}{T_{\\mathrm{line}}}$$

![Encryption throughput against cipher cost in CPU cycles per byte, for cores at two, three and four gigahertz, on logarithmic axes, with guides at one and ten gigabits per second. A three gigahertz core at zero point six five cycles per byte reaches thirty-six point nine gigabits per second; the same core at fifteen cycles per byte reaches one point six.](/courses/fe-ee/figures/net3-crypto-ceiling.svg)

### Worked Example 10.3 — Can One Core Fill a 10 Gbps Tunnel?

**Given.** A 3 GHz core. Hardware-assisted encryption costs 0.65 cycles per
byte; a portable software implementation costs 15.

**Step 1 — hardware assisted.**

$$T = \\frac{8 \\times 3\\times 10^{9}}{0.65} = 3.69\\times 10^{10}\\ \\mathrm{bit/s}$$

**Step 2 — software.**

$$T = \\frac{8 \\times 3 \\times 10^{9}}{15} = 1.6\\times 10^{9}\\ \\mathrm{bit/s}$$

**Step 3 — cores needed for a 10 Gbps line.**

$$N_{\\mathrm{cores}} = \\left\\lceil \\frac{10}{1.6} \\right\\rceil = 7$$

**Step 4 — the ceiling that actually applies.** The tunnel delivers the lesser
of the crypto ceiling and the line rate after encapsulation overhead:

$$\\Theta_{\\mathrm{VPN}} = \\min\\left(\\frac{8f}{c},\\; \\eta\\,R\\right)$$

With eta = 0.9563 on a 10 Gbps line the byte overhead allows 9.56 Gbps, so the
hardware-assisted core is limited by the line at 9.56 Gbps while the software
one is limited by the CPU at 1.6 Gbps.

**Answer.** 36.9 Gbps with hardware assistance, 1.6 Gbps without, and seven
software cores to fill the link. The cycle budget for a 10 Gbps line on one
3 GHz core is 8 × 3 × 10^9 / 10^10 = 2.4 cycles per byte, which is the number
to carry: **a cipher costing more than about 2.4 cycles per byte cannot fill a
10 Gbps link from a single 3 GHz core**, and everything else — core count,
hardware assistance, offload — follows from that comparison.

## 10.6 Attack Classes and the Threshold That Defends Each

Each of the classes in section 3.1 has a defence whose effectiveness is a
computable threshold rather than a claim.

| Class | Mechanism | Defence | The number that decides it |
|---|---|---|---|
| Address spoofing | Forged source field | Ingress filtering at the edge | Filter coverage: an amplification attack needs unfiltered networks, so the residual risk scales with the unfiltered fraction |
| Amplification flood | Small query, large reply from a third party | Disable or restrict the amplifier, filter egress | Amplification factor: reply bytes divided by query bytes, which sets the bandwidth an attacker must supply |
| Credential stuffing | Reused secrets tried in bulk | Rate limit, second factor, stretching | Guesses per second the attacker gets, against the entropy of section 9.4 |
| Blind forgery | Guessed authentication tag | Longer tag, failure lockout | 2 to the power minus t per attempt, times the allowed attempt rate |
| Interception | Traffic read or altered in transit | Authenticated encryption with verified identity | Chain and trust-store probabilities of section 9.2 |
| Injection | Data interpreted as instruction | Separate code from data at the interface | Not probabilistic: the defence either parameterises the interface or it does not |

The last row deserves its own comment, because it is the one that does not
have a threshold. Injection is defeated structurally — by never constructing
an instruction out of untrusted text — and no amount of filtering, rate
limiting or detection substitutes for that. Everything above it is a
quantitative trade in which the defender pushes a probability below a stated
tolerance; injection is a design property that is either present or absent.

## Problem Set A — Keys, Hashes and Entropy

**A1.** An attacker manages 10^15 keys per second. How long to exhaust half a
90-bit key space?
*Answer.* 2^89/10^15 = 6.19 × 10^11 s = 19,600 years.

**A2.** How many bits does an attacker gain by getting 4,096 times faster?
*Answer.* log2 4096 = 12 bits.

**A3.** A system hashes 2^32 records into a 96-bit digest. What is the
approximate collision probability?
*Answer.* q²/(2M) = 2^64/2^97 = 2^-33 = 1.16 × 10^-10.

**A4.** What sample size makes a collision more likely than not in a 40-bit
digest space?
*Answer.* 1.1774 × 2^20 = 1.234 × 10^6 items.

**A5.** A passphrase uses five words from a 2,048-word list. What is its
entropy, and how does it compare with a ten-character lower-case password?
*Answer.* 5 × 11 = 55 bits against 10 × 4.7004 = 47.0 bits. The passphrase is
8 bits stronger, a factor of 256.

**A6.** A key-derivation function is raised from 10,000 to 1,000,000
iterations. How many bits of effective strength does that add?
*Answer.* log2(100) = 6.64 bits.

**A7.** A 160-bit digest is truncated to 80 bits for storage. What are the
preimage and collision resistances afterwards?
*Answer.* 80 bits preimage, 40 bits collision — the latter is about 10^12
attempts, which is minutes of work.

**A8.** A tag is 48 bits and an attacker is allowed 100 attempts per second.
What is the expected time to a successful blind forgery?
*Answer.* 2^48/100 = 2.815 × 10^12 s = 89,200 years.

## Problem Set B — Controls, Detection and Tunnels

**B1.** A sensor has TPR 0.95 and FPR 0.002 on a population with base rate
0.0005. What is the precision?
*Answer.* 0.95 × 0.0005 / (0.95 × 0.0005 + 0.002 × 0.9995) = 0.000475/0.002474
= 0.1920, about 19.2 %.

**B2.** How many alerts a day does that sensor raise on 500,000 sessions, and
how many are real?
*Answer.* Real sessions 250, true positives 237.5, false positives
0.002 × 499750 = 999.5, total 1237. About 237 of 1237 are real.

**B3.** A flat network of 400 hosts is split into 8 segments. By what factor
does the reachable-pair count fall?
*Answer.* 79800 against 8 × 1225 = 9800, a factor of 8.14.

**B4.** Four rules match with probabilities 0.5, 0.3, 0.15 and 0.05. What is
the expected comparison count in the best order?
*Answer.* 0.5 + 0.6 + 0.45 + 0.20 = 1.75 comparisons.

**B5.** An inner packet is 900 bytes. What is the wire size and goodput
fraction under the encapsulation of section 10.4?
*Answer.* 900 + 2 = 902 rounds to 912; W = 20 + 8 + 16 + 912 + 12 = 968;
goodput 900/968 = 0.9298.

**B6.** A 2.5 GHz core runs a cipher costing 4 cycles per byte. What
throughput does it reach, and can it fill a 1 Gbps link?
*Answer.* 8 × 2.5e9/4 = 5 × 10^9 bit/s = 5 Gbps, so yes, with headroom for
five such links.

**B7.** A trust store holds 200 roots, each with an annual compromise
probability of 0.0002. What is the chance at least one is compromised in a
year?
*Answer.* 1 − 0.9998^200 = 1 − 0.96079 = 0.03921, about 3.9 %.

**B8.** A certificate revocation list is published every 6 hours and the
service handles 25 transactions per second. How many transactions can be
accepted against a revoked certificate on average?
*Answer.* Window 3 h; 25 × 3 × 3600 = 270,000 transactions.`,
      examTip: 'Precision crosses fifty per cent where the base rate equals the false-positive rate, so a sensor is useful only when its FPR is below the prevalence of what it hunts. Narrowing the population raises precision as much as a hundredfold sensor improvement. Rule ordering is free performance: most frequent first cut 4.39 expected comparisons to 1.61 in the worked case.',
      importantNote: 'A tunnel has two independent ceilings. Bytes: goodput is 47 percent at 64-byte inner packets and 96 percent at 1400, with an inner MTU of 1438 for a 1500-byte path. Cycles: throughput is 8f/c, so a 3 GHz core needs a cipher under 2.4 cycles per byte to fill 10 Gbps. The tunnel delivers whichever ceiling is lower.',
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

**Utilization** = throughput/bandwidth. At > 80%, queuing delay climbs steeply — as 1/(1 - rho), which has a pole at full load rather than an exponential shape.`,
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

Every entry in that table is **decimal**: the rates are powers of ten, so
125 MB means 125,000,000 bytes and not 131,072,000. Window fields, by contrast,
are binary, which is why the next section is careful to write KiB.

## 3.3 TCP Window Sizing

**Throughput = Window_size / RTT** (simplified, no loss)

**Problem**: TCP window = 64 KiB (65,536 bytes — the window field counts bytes
in powers of two, while the link rate is decimal), RTT = 50 ms. What is max
throughput?

Throughput = 65536 * 8 / 0.050 = 524288 / 0.050 = **10.49 Mbps**

Even on a 1 Gbps link, a 64 KiB window limits throughput to ~10 Mbps with 50 ms RTT. **Window scaling** (RFC 1323) extends the window to 1 GB to solve this.

**Exam strategy**: Separate transmission delay (packet_size/BW) from propagation delay (distance/speed). They are fundamentally different. BDP = BW * RTT gives the pipe capacity. If TCP window < BDP, the link is underutilized.`,
      examTip: 'Transmission delay depends on packet size and link speed. Propagation delay depends on distance and medium speed. Do NOT mix them up — this is the #1 tested distinction in network performance.',
      importantNote: 'RTT = 2 * one-way propagation delay (approximately). For TCP throughput, RTT determines how fast ACKs return and thus how fast the sender can advance its window.',
    },
    { id: 'netperf-budget', title: '4. Building a Delay Budget Across Multiple Hops',
      content: `## 4.1 Which Term Dominates, and When

The two computable delay terms respond to completely different inputs, and
almost every performance question turns on knowing which one is in charge:

![Transmission delay and propagation delay against link rate for a 1500-byte packet over 200 km of fiber, on logarithmic axes. Transmission delay falls as twelve thousand bits divided by the rate; propagation delay is flat at 1.00 millisecond. They cross at 12 Mbps, below which the packet length dominates and above which the distance does.](/courses/fe-ee/figures/net-delay-crossover.svg)

The flat line is the point. Propagation delay for a fixed route is a constant
that no amount of money can reduce below distance over the speed of light in
the medium. Transmission delay is the only term a faster link improves. Set
them equal to find where control changes hands:

**$\\dfrac{L}{R} = \\dfrac{d}{v} \\;\\Rightarrow\\; R = \\dfrac{L v}{d} = \\dfrac{12000 \\times 2\\times 10^{8}}{200000} = 12$ Mbps**

Below 12 Mbps the 1500-byte packet's own length is the larger cost; above it,
the 200 km of fiber is. On a 100 Mbps link the split is 0.12 ms of
transmission against 1.00 ms of propagation, and on a 10 Gbps link it is
0.0012 ms against the same 1.00 ms — upgrading the link by two more orders of
magnitude improves the total by about one tenth of one percent.

## 4.2 Store-and-Forward: Transmission Delay Is Paid Per Hop

A router that uses store-and-forward must receive a packet **completely**
before it can begin sending it on. Each hop therefore charges a full
transmission delay, while propagation is charged once for the total distance:

**$d_{\\mathrm{total}} = N \\cdot \\dfrac{L}{R} + \\dfrac{d_{\\mathrm{total\\,path}}}{v} + d_{\\mathrm{queue}} + d_{\\mathrm{proc}}$**

**Worked example.** Three 100 Mbps store-and-forward hops over 300 km of fiber,
1500-byte packets, no congestion:

| Term | Calculation | Value |
|---|---|---|
| Transmission, per hop | 12000 / 10^8 | 0.120 ms |
| Transmission, 3 hops | 3 × 0.120 | **0.360 ms** |
| Propagation, whole path | 300,000 / (2 × 10^8) | **1.500 ms** |
| Total one way | 0.360 + 1.500 | **1.860 ms** |
| Round trip | 2 × 1.860 | **3.720 ms** |

Two traps live in this calculation. Transmission delay is multiplied by the
hop count but propagation is not — propagation is over the whole path once,
not per hop. And the round-trip figure doubles both terms, because the
acknowledgement is itself a packet that must be serialised and must travel
back.

## 4.3 Queueing: Why Utilisation Above 80 % Hurts

The fourth term has no fixed value; it depends on load. Modelling one
interface as an M/M/1 queue gives the standard results, with service rate
μ = R/L and arrival rate λ, and utilisation ρ = λ/μ:

**$W = \\dfrac{1}{\\mu - \\lambda}, \\qquad W_{q} = \\dfrac{\\rho}{\\mu - \\lambda}, \\qquad L_{q} = \\dfrac{\\rho^{2}}{1-\\rho}$**

For the 100 Mbps interface above, μ = 10^8/12000 = 8333.3 packets per second:

| ρ | Offered load | Queueing delay W_q | Total time in system W | Mean packets waiting |
|---|---|---|---|---|
| 0.10 | 10 Mbps | 0.013 ms | 0.133 ms | 0.011 |
| 0.50 | 50 Mbps | 0.120 ms | 0.240 ms | 0.500 |
| 0.80 | 80 Mbps | 0.480 ms | 0.600 ms | 3.200 |
| 0.90 | 90 Mbps | 1.080 ms | 1.200 ms | 8.100 |
| 0.95 | 95 Mbps | 2.280 ms | 2.400 ms | 18.050 |
| 0.99 | 99 Mbps | 11.880 ms | 12.000 ms | 98.010 |

Between 10 % and 80 % utilisation the queueing delay grows by a factor of 36;
between 90 % and 99 % it grows by a factor of 11 again, over a load increase
of only 10 %. (The first ratio is exactly 36: the table entries 0.480 and 0.013
are rounded, and dividing those gives 36.9, which is how a rounding artefact
becomes a published figure. Section 9.3 derives the ratio in closed form and
measures 35.956 from a simulation of the same interface.) The 1/(1 − ρ) term is a vertical asymptote at ρ = 1, and that is
what "queueing delay spikes exponentially above 80 %" means quantitatively.
Note also the last column: at 99 % utilisation the interface holds about 98
packets, so a router with a 64-packet buffer is dropping traffic long before
the link is nominally full.

## 4.4 A Complete Budget for a Voice Call

Putting the four terms together against the ITU-T G.114 target of 150 ms
one-way for voice:

| Component | Value | Note |
|---|---|---|
| Codec packetisation (G.711, 20 ms samples) | 20.0 ms | Fixed by the sample interval |
| Serialisation, 200-byte packet on 10 Mbps access | 0.16 ms | 1600 / 10^7 |
| Propagation, 4000 km | 20.0 ms | 4 × 10^6 / (2 × 10^8) |
| Queueing, 8 hops at 0.5 ms | 4.0 ms | The only term under engineering control |
| Jitter buffer | 40.0 ms | Trades delay for smoothness |
| **Total one way** | **84.2 ms** | Inside the 150 ms budget |

The budget is dominated by two terms nobody can shrink — the codec's sample
interval and the speed of light — and one that is a deliberate choice. Doubling
the jitter buffer to 80 ms would push the total to 124 ms, still legal but with
no margin left for a congested hop. This is why QoS work targets the queueing
line specifically: it is the only row a network engineer can actually move.`,
      examTip: 'Transmission delay is charged once per store-and-forward hop; propagation delay is charged once for the whole path. Multiplying propagation by the hop count is the most common arithmetic error in these problems.',
      importantNote: 'Queueing delay follows 1/(1 - rho), so it has a vertical asymptote at 100 % utilisation. Going from 90 % to 99 % load on a 100 Mbps link takes the queueing delay from 1.08 ms to 11.88 ms — an 11-fold increase for 10 % more traffic.',
    },
    { id: 'netperf-throughput', title: '5. Throughput Ceilings: Windows, Loss, and Goodput',
      content: `## 5.1 Why a Sender Must Have Many Packets in Flight

A protocol that sends one packet and waits for its acknowledgement can never
use more of a link than the ratio of transmission time to round-trip time.
Writing a = d_prop / d_trans, the classic **stop-and-wait efficiency** is

**$\\eta = \\dfrac{1}{1 + 2a}$**

| Link | d_trans (1500 B) | d_prop (200 km) | a | Efficiency | Effective rate |
|---|---|---|---|---|---|
| 1 Mbps | 12.00 ms | 1.00 ms | 0.083 | 85.7 % | 0.857 Mbps |
| 1 Gbps | 0.012 ms | 1.00 ms | 83.3 | **0.60 %** | 5.96 Mbps |

The 1 Gbps link delivers six megabits per second. Nothing is broken — the
sender simply spends 99.4 % of its time waiting for an acknowledgement to
travel 200 km and back. Recovering the link requires **N ≥ 1 + 2a = 168
frames** in flight, which is exactly what a sliding window provides.

## 5.2 Window Size and the Bandwidth-Delay Product

With a window of W bytes, the sender may transmit W bytes per round trip, so

**$\\mathrm{throughput} = \\min\\left(R,\\ \\dfrac{8W}{\\mathrm{RTT}}\\right)$**

![Achievable throughput against send-window size on a 1 Gbps path, for round-trip times of 20 and 100 milliseconds, on logarithmic axes. Each curve rises linearly with the window and then flattens at the link rate; the knee falls exactly at the bandwidth-delay product, 2.5 MB at 20 ms and 12.5 MB at 100 ms. A 64 KiB window caps the path at 26.2 and 5.2 Mbps respectively.](/courses/fe-ee/figures/net-window-throughput.svg)

The knee of each curve is the **bandwidth-delay product**, and its position is
not a coincidence: the window that first saturates the link is exactly the
number of bits the pipe holds. Below the knee the window is the constraint and
throughput is proportional to it; above the knee the link is the constraint
and a larger window buys nothing but buffer occupancy.

This is why the historical 16-bit TCP window field became a problem. 64 KiB —
65,536 bytes, binary, against a link rate quoted in decimal gigabits — was
generous when links were slow and paths were short, but on the 1 Gbps,
100 ms path in the figure it caps throughput at **5.24 Mbps** — half a percent
of the link. Window scaling (introduced in RFC 1323 and updated by RFC 7323)
adds a shift factor of up to 14, raising the maximum window to
65535 × 2^14 = **1,073,725,440 bytes**, or almost exactly 1 GiB.

## 5.3 Loss Changes the Shape of the Answer

Everything above assumes no loss. Once packets are dropped, a congestion-
controlled sender spends its life halving and re-growing the window, and the
throughput ceiling acquires a dependence on loss probability p. The Mathis
approximation captures it:

**$\\mathrm{throughput} \\approx \\dfrac{\\mathrm{MSS}}{\\mathrm{RTT}\\sqrt{p}}$**

For a 1460-byte MSS on a 50 ms path:

| Loss probability p | √p | Throughput ceiling |
|---|---|---|
| 10^−2 (1 %) | 0.100 | 2.34 Mbps |
| 10^−3 | 0.0316 | 7.39 Mbps |
| 10^−4 | 0.0100 | 23.4 Mbps |
| 10^−5 | 0.00316 | 73.9 Mbps |

The inverse-square-root shape is the useful part: reducing loss by a factor of
100 improves throughput only tenfold. It also explains a result that surprises
people — on a long path, 1 % loss caps a connection near 2 Mbps no matter how
fast the underlying links are. Latency and loss, not bandwidth, are what make
a transcontinental transfer slow.

## 5.4 Throughput, Goodput, and Honest Accounting

Three quantities get called "speed" and they differ by known factors:

| Quantity | Definition | On a 1 Gbps link with 1460-byte payloads |
|---|---|---|
| **Bandwidth** | Nominal signalling rate | 1000 Mbps |
| **Throughput** | Bits actually delivered, headers included | up to 1000 Mbps |
| **Goodput** | Application bytes delivered | 1000 × 1460/1538 = **949.3 Mbps** |

Retransmissions widen the gap further: they consume throughput and contribute
no goodput at all. A transfer running at 1 % loss delivers roughly 1 % less
goodput than throughput even before the congestion-window effect above is
counted.

Finally, **the bottleneck rule**. On a path of links in series, throughput is
set by the slowest link:

| Path | Bottleneck | End-to-end throughput |
|---|---|---|
| 1 Gbps → 100 Mbps → 1 Gbps | the 100 Mbps hop | 100 Mbps |
| 1 Gbps → 100 Mbps → 10 Mbps | the 10 Mbps hop | 10 Mbps |

Upgrading anything other than the bottleneck changes nothing, and upgrading
the bottleneck simply moves it to the next-slowest link — which is the network
version of Amdahl's law and a favourite exam framing.`,
      examTip: 'Throughput = min(link rate, 8 x window / RTT). The knee is at the bandwidth-delay product: if the window is smaller than BDP the link idles, and if it is larger the extra only fills buffers.',
      importantNote: 'Under loss, throughput scales as 1/sqrt(p), so cutting the loss rate a hundredfold only improves throughput tenfold. On a 50 ms path, 1 % loss caps a TCP connection near 2.3 Mbps regardless of the link speeds involved.',
    },
    { id: 'netperf-terms', title: '6. The Four Delay Terms, Separated and Each Computed',
      content: `## 6.1 One Packet, Four Clocks

A packet crossing one hop is delayed by four mechanisms that have nothing in
common except that they are all measured in seconds. Adding them is the easy
part; the exam-relevant skill is knowing which of them a given change moves,
because three of the four are indifferent to the thing a student instinctively
reaches for.

$$d_{\\mathrm{hop}} = d_{\\mathrm{proc}} + d_{\\mathrm{queue}} + d_{\\mathrm{trans}} + d_{\\mathrm{prop}}$$

**Processing** is the time a node spends deciding what to do with the packet:
verifying the frame check sequence, looking up the destination, decrementing the
hop count. On hardware forwarding it is a fixed few microseconds and does not
depend on packet size at all.

**Queueing** is the wait for the outgoing interface to become free. It is the
only term that depends on what *other* traffic is doing, and it is the subject
of section 9.

**Transmission**, also called serialisation, is the time to clock the packet's
bits onto the medium. It is set by two things and only two things:

$$d_{\\mathrm{trans}} = \\frac{L}{R} \\qquad L\\ \\text{in bits},\\quad R\\ \\text{in bit/s}$$

**Propagation** is the flight time of a bit down the medium. It is set by two
completely different things:

$$d_{\\mathrm{prop}} = \\frac{\\ell}{v} \\qquad \\ell\\ \\text{in metres},\\quad v \\approx 2.0 \\times 10^{8}\\ \\text{m/s in glass}$$

| Term | Grows with | Shrinks with | Indifferent to |
|---|---|---|---|
| Processing | node complexity | faster silicon | packet size, distance, rate |
| Queueing | offered load, burstiness | more capacity, smaller packets | distance |
| Transmission | packet size | a faster link | distance |
| Propagation | distance | nothing you can buy | packet size, link rate |

The last cell of the last row is the one that catches people. **Buying a faster
link does not reduce propagation delay by one nanosecond.** A 400 Gb/s upgrade
moves exactly one of the four rows.

## 6.2 Where the Two Computable Terms Differ by Five Orders of Magnitude

Take a 64-byte acknowledgement on a 10 Gb/s link spanning 3000 km of fibre.
Link rates here are decimal, so 10 Gb/s means exactly $10 \\times 10^{9}$ bit/s.

$$d_{\\mathrm{trans}} = \\frac{512\\ \\text{bit}}{10 \\times 10^{9}\\ \\text{bit/s}} = 5.12 \\times 10^{-8}\\ \\mathrm{s} = 51.2\\ \\mathrm{ns}$$

$$d_{\\mathrm{prop}} = \\frac{3.0 \\times 10^{6}\\ \\mathrm{m}}{2.0 \\times 10^{8}\\ \\mathrm{m/s}} = 1.50 \\times 10^{-2}\\ \\mathrm{s} = 15.0\\ \\mathrm{ms}$$

$$\\frac{d_{\\mathrm{prop}}}{d_{\\mathrm{trans}}} = \\frac{1.50 \\times 10^{-2}}{5.12 \\times 10^{-8}} = 2.9297 \\times 10^{5}$$

Now take the same two terms on a 1500-byte frame sent by a 250 kb/s sensor
radio across a 100 m room, where the medium is air and $v = 3.0 \\times 10^{8}$ m/s:

$$d_{\\mathrm{trans}} = \\frac{12000\\ \\text{bit}}{250 \\times 10^{3}\\ \\text{bit/s}} = 4.80 \\times 10^{-2}\\ \\mathrm{s} = 48.0\\ \\mathrm{ms}$$

$$d_{\\mathrm{prop}} = \\frac{100\\ \\mathrm{m}}{3.0 \\times 10^{8}\\ \\mathrm{m/s}} = 3.333 \\times 10^{-7}\\ \\mathrm{s} = 0.333\\ \\mathrm{\\mu s}$$

$$\\frac{d_{\\mathrm{trans}}}{d_{\\mathrm{prop}}} = \\frac{4.80 \\times 10^{-2}}{3.333 \\times 10^{-7}} = 1.440 \\times 10^{5}$$

The same two quantities have swapped ranks, and between the two situations the
ratio itself moves by a factor of $4.2 \\times 10^{10}$. There is no rule of
thumb that survives that. Each term has to be computed.

![Ratio of serialisation delay to propagation delay against link rate over three thousand kilometres of fibre, on logarithmic axes, for sixty-four, fifteen hundred and nine thousand byte packets. All three fall as one over the rate; the dashed guide marks equal terms, crossed near thirty kilobits per second for the small packet and near seven hundred kilobits per second for the largest. A marker at ten gigabits per second shows serialisation at three point four millionths of propagation.](/courses/fe-ee/figures/net4-term-ratio.svg)

The figure is a family of straight lines because the ratio is $Lv/(R\\ell)$,
which on logarithmic axes is a slope of exactly $-1$ shifted up or down by
packet size. Every line crosses the guide once, and that crossing is the rate at
which control changes hands.

### Worked Example 6.1 — All Four Terms on One Real Hop

**Given.** A 1500-byte packet on a 100 Mb/s interface, 200 km of fibre to the
next router, a forwarding engine that takes 20 μs, and an interface running at
80 % utilisation. What is the hop delay?

**Transmission.**

$$d_{\\mathrm{trans}} = \\frac{12000\\ \\text{bit}}{100 \\times 10^{6}\\ \\text{bit/s}} = 1.20 \\times 10^{-4}\\ \\mathrm{s} = 0.120\\ \\mathrm{ms}$$

**Propagation.**

$$d_{\\mathrm{prop}} = \\frac{2.00 \\times 10^{5}\\ \\mathrm{m}}{2.0 \\times 10^{8}\\ \\mathrm{m/s}} = 1.000\\ \\mathrm{ms}$$

**Queueing.** This one is not a formula question. Running the interface as a
discrete-event queue at 80 % load for twelve independent runs of half a million
packets each gives a mean wait of **0.4794 ± 0.0024 ms**, against the 0.480 ms
the M/M/1 expression predicts. The measurement is the answer; the expression is
the check.

**Processing.** 0.020 ms, given.

**Total.**

$$d_{\\mathrm{hop}} = 0.020 + 0.4794 + 0.120 + 1.000 = 1.6194\\ \\mathrm{ms}$$

**Answer.** About 1.62 ms, of which propagation is 61.8 %, queueing 29.6 %,
serialisation 7.4 % and processing 1.2 %. **Answer the follow-up before it is
asked**: upgrading this interface to 1 Gb/s removes 0.108 ms of serialisation,
and because the queue simulation depends on load rather than on speed, the same
run at the same 80 % load simply runs ten times faster, giving 0.04794 ms of
waiting. The hop becomes

$$d_{\\mathrm{hop}} = 0.020 + 0.04794 + 0.012 + 1.000 = 1.07994\\ \\mathrm{ms}$$

a 33 % improvement bought with a tenfold increase in link speed, because the
dominant term did not move at all.

### Worked Example 6.2 — The Conflation Error, Costed Both Ways

**Given.** Two candidates each compute one delay and call it the answer.
Candidate A computes $L/R$ for the 64-byte acknowledgement on the 3000 km,
10 Gb/s path. Candidate B computes $\\ell/v$ for the 1500-byte frame on the
100 m, 250 kb/s radio. Quantify each error.

**Candidate A** reports 51.2 ns. The true one-way delay of that packet, walked
across the link by simulation, is

$$d = 5.12 \\times 10^{-8} + 1.50 \\times 10^{-2} = 1.5000051 \\times 10^{-2}\\ \\mathrm{s}$$

so the reported figure is smaller than the truth by a factor of 292,969. A
protocol timer set from it would fire 293,000 times too early.

**Candidate B** reports 0.333 μs against a true

$$d = 4.80 \\times 10^{-2} + 3.333 \\times 10^{-7} = 4.800033 \\times 10^{-2}\\ \\mathrm{s}$$

a factor of 144,000 the other way. **The two mistakes are the same mistake**,
and they are not small: the terms they drop are five orders of magnitude larger
than the terms they keep. Compute both, then decide which one to neglect.

## 6.3 Store-and-Forward Pays Serialisation Once Per Hop

A store-and-forward node must receive the last bit of a packet before it may
send the first. Walking a packet across a path of $N$ links therefore charges
$N$ serialisation delays, but only one propagation delay per link length:

$$d_{\\mathrm{path}} = \\sum_{i=1}^{N} \\frac{L}{R_{i}} + \\sum_{i=1}^{N}\\frac{\\ell_{i}}{v} + (N-1)\\left(d_{\\mathrm{proc}} + d_{\\mathrm{queue}}\\right)$$

Stepping a 1500-byte packet across a four-link path — a 100 Mb/s access link of
2 km, two 10 Gb/s core spans of 800 km and 400 km, and a 1 Gb/s delivery link of
5 km, with 20 μs of processing and 200 μs of queueing in total — gives:

| Term | Value | Share |
|---|---|---|
| Serialisation, all four links | 134.4 μs | 2.09 % |
| Propagation, 1207 km of fibre | 6.035 ms | 93.86 % |
| Processing, three nodes | 60.0 μs | 0.93 % |
| Queueing, three nodes | 200.0 μs | 3.11 % |
| **Total one way** | **6.4294 ms** | 100 % |

Cut-through switching, which starts forwarding after the header, saves only
2.3 μs here, because the links that would benefit are already fast. On a LAN it
is a different story. Four 100 Mb/s hops with 10 m of cable between them and
5 μs of processing measure **0.4952 ms** store-and-forward against **0.2654 ms**
cut-through: a saving of 229.8 μs, or 46 %, because on slow links serialisation
is the whole budget.`,
      examTip: 'Four terms, four different independent variables. Transmission is L/R and cares only about packet size and link rate; propagation is distance over medium speed and cares about neither. Compute both before deciding which dominates — on a 10 Gb/s transcontinental path they differ by a factor of 293,000, and on a slow short radio link they differ by 144,000 the other way.',
      importantNote: 'Store-and-forward charges a full serialisation delay at every hop but propagation only once per link length. Cut-through removes most of the per-hop serialisation and is worth 46 % on a four-hop 100 Mb/s LAN, but only 2.3 microseconds on a path whose core links run at 10 Gb/s.',
    },
    { id: 'netperf-bdp', title: '7. The Pipe, the Window, and the Two Regimes',
      content: `## 7.1 How Much Data a Path Holds

A link with a delay is a container. While a bit is in flight it is neither at
the sender nor at the receiver, and the number of such bits is fixed by the rate
and the round trip:

$$\\mathrm{BDP} = R \\times \\mathrm{RTT}$$

For a 100 Mb/s path with a 40 ms round trip, using the decimal convention in
which 100 Mb/s is exactly $100 \\times 10^{6}$ bit/s:

$$\\mathrm{BDP} = 100 \\times 10^{6} \\times 0.040 = 4.0 \\times 10^{6}\\ \\text{bit}$$

$$\\mathrm{BDP} = \\frac{4.0 \\times 10^{6}}{8} = 500000\\ \\text{bytes} = 488.28\\ \\mathrm{KiB}$$

Notice both conversions. Dividing by eight moves from bits to bytes; dividing by
1024 moves from bytes to **kibibytes**, which is the unit a window field is
actually specified in. Writing "500 kB" is right under the decimal convention
and writing "488.28 KiB" is right under the binary one; writing "500 KiB" is
wrong by 2.4 %, and the same slip at the mega scale costs 4.86 % and at the giga
scale 7.37 %.

In 1500-byte packets the pipe holds

$$\\frac{4.0 \\times 10^{6}}{12000} = 333.33\\ \\text{packets}$$

## 7.2 Stop-and-Wait, Measured

Run a sender that transmits one packet and waits. Stepping that sender packet by
packet on the path above — 1500-byte packets, 100 Mb/s, and a 40 ms return time
measured from the last bit sent to the acknowledgement's arrival — measures a
throughput of **299,103 bit/s**, which is 0.299 Mb/s, or 0.2991 % of a link that
cost the same as one running two thousand times faster.

The cycle the simulation reveals is one serialisation plus one return time, so
the efficiency is

$$\\eta = \\frac{L/R}{L/R + \\mathrm{RTT}} = \\frac{0.12}{0.12 + 40} = \\frac{0.12}{40.12} = 0.002991$$

Writing $a$ for the ratio of one-way propagation to serialisation gives the form
the exam uses, and the two agree exactly:

$$a = \\frac{20}{0.12} = 166.667, \\qquad \\eta = \\frac{1}{1 + 2a} = \\frac{1}{334.333} = 0.002991$$

The sender spends 99.7 % of its life idle. Nothing is broken; a single
outstanding packet simply cannot fill a container that holds 333 of them.

## 7.3 Two Regimes and the Crossover Between Them

With a window of $W$ packets the sender may put $W$ packets into the pipe before
it must wait. Stepping the same simulation across window sizes measures this:

| Window (packets) | Measured throughput | Share of the link | Regime |
|---|---|---|---|
| 1 | 0.2991 Mb/s | 0.30 % | window-limited |
| 8 | 2.3928 Mb/s | 2.39 % | window-limited |
| 43 | 12.8614 Mb/s | 12.86 % | window-limited |
| 64 | 19.1426 Mb/s | 19.14 % | window-limited |
| 167 | 49.9501 Mb/s | 49.95 % | window-limited |
| 334 | 99.9003 Mb/s | 99.90 % | window-limited |
| 335 | 100.0000 Mb/s | 100.00 % | rate-limited |
| 500 | 100.0000 Mb/s | 100.00 % | rate-limited |

Every row below 335 is exactly proportional to the window: doubling the window
doubles the measurement, to the last digit. Every row above it is identical.
That is the whole behaviour, and it is captured by

$$T = \\min\\!\\left(R,\\ \\frac{8WL}{\\mathrm{RTT} + L/R}\\right)$$

![Measured throughput against send-window size on a 100 Mb/s path for round-trip times of twenty and forty milliseconds, on logarithmic axes. Each curve climbs with slope one while the window is the constraint and then goes flat at the link rate; the marked knees fall at one hundred and sixty-eight packets and three hundred and thirty-five packets.](/courses/fe-ee/figures/net4-window-regimes.svg)

Setting the two branches equal gives the crossover window exactly:

$$W^{*} = \\frac{\\mathrm{RTT} + L/R}{L/R} = \\frac{40.12}{0.12} = 334.333 \\rightarrow 335\\ \\text{packets}$$

and searching the simulation for the smallest window that measures the full
100 Mb/s returns 335, the same answer. **The bandwidth-delay product gives 333.33
packets and the honest crossover is 335**, two packets more, because the sender
must also cover its own serialisation and because a fraction of a packet is not
a thing a sender can transmit. Under exam conditions the BDP answer is the one
being asked for; in a laboratory the difference is measurable.

### Worked Example 7.1 — Sizing a Window for a Transcontinental Path

**Given.** A 1 Gb/s path with a 90 ms round trip carries 1500-byte frames. Find
the pipe capacity in bytes and in packets, the window a sender needs, and the
throughput it gets with a 64 KiB window.

**Pipe capacity.**

$$\\mathrm{BDP} = 1.0 \\times 10^{9} \\times 0.090 = 9.0 \\times 10^{7}\\ \\text{bit}$$

$$\\frac{9.0 \\times 10^{7}}{8} = 11250000\\ \\text{bytes} = 10.73\\ \\mathrm{MiB}$$

**In packets**, and then the exact crossover including serialisation, which on a
1 Gb/s link is $12000/10^{9} = 12\\ \\mathrm{\\mu s}$:

$$\\frac{9.0 \\times 10^{7}}{12000} = 7500\\ \\text{packets}, \\qquad W^{*} = \\frac{90.012}{0.012} = 7501\\ \\text{packets}$$

**With a 64 KiB window.** A 64 KiB window is 65,536 bytes — binary, because the
window field counts bytes in powers of two — which is 43.69 packets, so 43 whole
packets are outstanding:

$$T = \\frac{8 \\times 43 \\times 1500}{0.090012} = 5.733\\ \\mathrm{Mb/s}$$

**Answer.** 11.25 MB of pipe (10.73 MiB), a 7501-packet window to fill it, and
5.73 Mb/s from the unscaled window — **0.57 % of the link**. This is exactly the
problem window scaling exists to solve, and it is why a fast transfer between
continents is a configuration question, not a bandwidth question.

### Worked Example 7.2 — Reading the Regime Off a Measurement

**Given.** A transfer over a 100 Mb/s path measures 19.14 Mb/s. The operator
doubles the window and measures 38.28 Mb/s; doubling it again gives 76.57 Mb/s;
doubling a third time gives 100 Mb/s. What is the round-trip time, and what
window is in use at the first measurement?

**Identify the regime.** Throughput doubled with the window twice, so the first
three points are window-limited and

$$T = \\frac{8WL}{\\mathrm{RTT} + L/R} \\quad\\Longrightarrow\\quad \\mathrm{RTT} + \\frac{L}{R} = \\frac{8WL}{T}$$

**Solve using the first point**, with $W = 64$ packets:

$$\\mathrm{RTT} + 0.00012 = \\frac{8 \\times 64 \\times 1500}{19142572} = 0.04012\\ \\mathrm{s}$$

$$\\mathrm{RTT} = 0.04012 - 0.00012 = 0.04000\\ \\mathrm{s} = 40.0\\ \\mathrm{ms}$$

**Check the fourth point.** Three doublings from 64 is 512 packets, which is above
the 335-packet crossover, so the fourth measurement must be rate-limited — and
it is, at exactly 100 Mb/s. **The ratio between consecutive measurements is the
diagnostic**: a ratio of two means window-limited, a ratio of one means
rate-limited, and any ratio in between means the crossover sits inside that
step.`,
      examTip: 'Throughput is the smaller of the link rate and the window divided by the round trip. Below the bandwidth-delay product the window is the constraint and throughput is proportional to it; above it, the link is the constraint and a bigger window only fills buffers. Convert carefully: bits to bytes is a factor of 8, and bytes to KiB is a factor of 1024, not 1000.',
      importantNote: 'A stepped simulation of a stop-and-wait sender on a 100 Mb/s, 40 ms path measures 299,103 bit/s — 0.2991 % of the link. The same sender with a 335-packet window measures the full 100 Mb/s. The bandwidth-delay product predicts 333.33 packets; the exact crossover is 335, because the sender must also cover its own serialisation time.',
    },
    { id: 'netperf-goodput', title: '8. Throughput Against Goodput, Counted Layer by Layer',
      content: `## 8.1 Three Quantities Called "Speed"

**Bandwidth** is the signalling rate of the medium. **Throughput** is the rate at
which bits actually cross it, headers included. **Goodput** is the rate at which
the bytes an application asked for arrive. The gaps between them are not vague:
they are a sum of header sizes, and every one of those sizes is a number.

| Layer | Bytes added | Why it is on the wire |
|---|---|---|
| Ethernet preamble and start delimiter | 8 | Receiver clock recovery |
| Ethernet header | 14 | Two addresses and a type field |
| IPv4 header | 20 | Addresses, fragmentation, hop count |
| IPv6 header | 40 | Larger addresses, no checksum |
| TCP header | 20 | Ports, sequence, window, flags |
| UDP header | 8 | Ports and length only |
| RTP header | 12 | Sequence and timestamp for media |
| Ethernet frame check sequence | 4 | Error detection over the frame |
| Interframe gap | 12 | Mandatory silence between frames |

The rule follows from the table: the wire footprint of one packet is its payload
plus the sum of the layers wrapped around it.

$$W = P + \\sum_{i} h_{i}, \\qquad \\text{goodput} = R \\times \\frac{P}{W}$$

For a 1500-byte MTU carrying TCP over IPv4, the payload is
$1500 - 20 - 20 = 1460$ bytes, and the Ethernet layers add
$14 + 4 + 8 + 12 = 38$ bytes:

$$W = 1460 + 40 + 38 = 1538\\ \\text{bytes}, \\qquad \\frac{1460}{1538} = 0.949285$$

$$\\text{goodput} = 1.0 \\times 10^{9} \\times 0.949285 = 949.28\\ \\mathrm{Mb/s}$$

| Encapsulation | Payload | Wire | Goodput fraction | On a 1 Gb/s link |
|---|---|---|---|---|
| IPv4 + UDP, 1500 B MTU | 1472 B | 1538 B | 0.957087 | 957.09 Mb/s |
| IPv4 + TCP, 1500 B MTU | 1460 B | 1538 B | 0.949285 | 949.28 Mb/s |
| IPv6 + TCP, 1500 B MTU | 1440 B | 1538 B | 0.936281 | 936.28 Mb/s |
| IPv4 + TCP, 9000 B jumbo | 8960 B | 9038 B | 0.991370 | 991.37 Mb/s |
| RTP + UDP + IPv4 voice | 160 B | 238 B | 0.672269 | 672.27 Mb/s |

![Goodput as a percentage of the wire rate against application payload size for three encapsulations over Ethernet: IPv4 with UDP, IPv4 with TCP, and IPv6 with TCP. All three rise steeply from below twenty-five per cent at tiny payloads and flatten above ninety per cent past a thousand bytes; a dashed guide marks the hundred and sixty byte voice sample, where the best of the three reaches only about seventy-one per cent.](/courses/fe-ee/figures/net4-goodput-layers.svg)

The curve is $P/(P + c)$ with $c$ the total header count, which is why it
punishes small packets so brutally and why jumbo frames are worth having on a
storage network. Moving from IPv4 to IPv6 costs a flat 20 bytes per packet: at
1460 bytes of payload that is 1.3 % of the wire, and at 160 bytes it is 8.4 %.

## 8.2 The Voice Case, Where the Headers Win

A G.711 codec produces 64,000 bit/s of audio. Packetised every 20 ms, that is
$64000 \\times 0.020 = 1280$ bits, or 160 bytes, fifty times a second. Each of
those samples then collects 78 bytes of headers:

$$R_{\\mathrm{wire}} = 238 \\times 8 \\times 50 = 95200\\ \\text{bit/s}$$

$$\\frac{95200}{64000} = 1.4875$$

**A 64 kb/s call needs 95.2 kb/s of link.** The overhead factor of 1.4875 is why
capacity planning for voice is done in wire rate, never in codec rate, and why
header compression on slow access links is worth the trouble. Doubling the
sample interval to 40 ms halves the header count and brings the factor to 1.244,
at the cost of 20 ms more mouth-to-ear delay — the same trade every real-time
protocol makes.

### Worked Example 8.1 — Goodput of a Loaded Gigabit Link

**Given.** A 1 Gb/s Ethernet link carries full 1460-byte TCP segments, and 0.5 %
of frames are lost and retransmitted. What goodput does the application see?

**Encapsulation first.**

$$\\text{throughput after headers} = 1.0 \\times 10^{9} \\times \\frac{1460}{1538} = 949.28\\ \\mathrm{Mb/s}$$

**Then retransmissions.** Every delivered frame costs $1/(1-p)$ transmissions on
average, so the delivered fraction of the wire is $(1-p)$:

$$\\text{goodput} = 949.28 \\times (1 - 0.005) = 944.54\\ \\mathrm{Mb/s}$$

**Answer.** 944.54 Mb/s, which is 94.45 % of the nominal gigabit. Of the
55.462 Mb/s that went missing, **50.715 Mb/s was spent on headers and only
4.746 Mb/s on retransmission** — the loss is the part people notice and the
smaller of the two by more than a factor of ten. Note also what does not appear: the acknowledgements travelling the other
way cost nothing here, because the link is full duplex and the reverse direction
has its own capacity.

### Worked Example 8.2 — Transfer Time, and the Two Kinds of "Mega"

**Given.** A 100 MiB file moves over the same 1 Gb/s link with 1460-byte
segments and no loss. How long does it take, and what does a reader lose by
writing "100 MB" instead?

**Convert the file size honestly.** A mebibyte is $2^{20}$ bytes:

$$100\\ \\mathrm{MiB} = 100 \\times 1048576 = 104857600\\ \\text{bytes}$$

**Count the frames rather than dividing by a rate.** The file fills

$$\\left\\lfloor \\frac{104857600}{1460} \\right\\rfloor = 71820\\ \\text{full segments}$$

with a remainder of $104857600 - 71820 \\times 1460 = 400$ bytes in one short
final segment, which still pays a full 78 bytes of headers:

$$\\text{wire} = 71820 \\times 1538 + 478 = 110459638\\ \\text{bytes}$$

$$t = \\frac{110459638 \\times 8}{1.0 \\times 10^{9}} = 0.883677\\ \\mathrm{s}$$

**Now the two errors.** Dividing the payload by the goodput figure gives
0.883677 s as well, understating the true time by 0.45 μs — the short frame's
headers, and entirely negligible. Treating the file as $100 \\times 10^{6}$
bytes gives

$$t = \\frac{800000000}{949284785} = 0.842740\\ \\mathrm{s}$$

**Answer.** 0.8837 s correctly, against 0.8427 s from the decimal slip: an error
of **4.63 %**, a hundred times larger than the frame-counting subtlety that a
careful student worries about instead. **Link rates are decimal and file sizes
are binary**, and the two must never be mixed inside one division. At the giga
scale the same slip is worth 7.37 %.`,
      examTip: 'Goodput is the link rate times payload over wire footprint. For 1500-byte Ethernet with IPv4 and TCP that is 1460/1538 = 0.9493, so a gigabit link delivers 949.28 Mb/s at best. Small packets are punished hard: a 160-byte voice sample keeps only 67 %, so a 64 kb/s call occupies 95.2 kb/s of wire.',
      importantNote: 'Link rates are decimal (1 Gb/s is 10^9 bit/s) and file and memory sizes are binary (1 MiB is 2^20 bytes). Calling 104,857,600 bytes "100 MB" and dividing by a decimal rate understates the transfer time by 4.63 %; the same slip at the giga scale is worth 7.37 %.',
    },
    { id: 'netperf-queue', title: '9. Utilisation, Queueing Delay, and Where the Knee Really Is',
      content: `## 9.1 Little's Law Is Accounting, Not Modelling

Before any distribution is assumed, one relation holds for any stable system
whatever: the average number of items inside it equals the rate they arrive
multiplied by the average time each spends there.

$$L = \\lambda W, \\qquad L_{q} = \\lambda W_{q}$$

This is a statement about areas. Each packet contributes its own sojourn time to
the integral of the occupancy, so the time-average occupancy is the sum of the
sojourns divided by the horizon, which is exactly arrival rate times mean
sojourn. Running the discrete-event queue and computing both sides separately —
the occupancy integral on one side, the measured arrival rate times the measured
mean delay on the other — reproduces the identity to ten significant figures at
every load tested. **Little's law cannot be violated by a queueing discipline, a
distribution, or a scheduler**, which is what makes it the most useful single
equation in this chapter: two of the three quantities are always easier to
measure than the third.

## 9.2 One Interface, Simulated

Model a 100 Mb/s port carrying 1500-byte packets. The service rate is a packet
count, not a bit rate:

$$\\mu = \\frac{R}{8L} = \\frac{100 \\times 10^{6}}{12000} = 8333.33\\ \\text{packets/s}$$

$$\\rho = \\frac{\\lambda}{\\mu}$$

Now drive it with exponential interarrival and service times and *measure* what
comes out. Each row below is twelve independent runs of 500,000 packets; the
uncertainty is the standard error across those runs, not a guess.

| Utilisation | Offered load | Measured queueing delay | M/M/1 says | Measured packets in system | M/M/1 says |
|---|---|---|---|---|---|
| 0.10 | 10 Mb/s | 0.0133 ± 0.0000 ms | 0.0133 ms | 0.1111 ± 0.0001 | 0.1111 |
| 0.50 | 50 Mb/s | 0.1199 ± 0.0002 ms | 0.1200 ms | 1.0001 ± 0.0013 | 1.0000 |
| 0.80 | 80 Mb/s | 0.4794 ± 0.0024 ms | 0.4800 ms | 3.9980 ± 0.0172 | 4.0000 |
| 0.90 | 90 Mb/s | 1.0881 ± 0.0094 ms | 1.0800 ms | 9.0645 ± 0.0727 | 9.0000 |
| 0.95 | 95 Mb/s | 2.3208 ± 0.0362 ms | 2.2800 ms | 19.3318 ± 0.2930 | 19.0000 |

The closed forms the last column checks are

$$W = \\frac{1}{\\mu - \\lambda}, \\qquad W_{q} = \\frac{\\rho}{\\mu - \\lambda}, \\qquad L = \\frac{\\rho}{1 - \\rho}$$

Two things in that table deserve attention. First, the measurements land on the
formulas, which is the point of doing both. Second, **the uncertainty grows
faster than the mean**: at 10 % load the standard error is a thousandth of the
value and at 95 % it is 1.6 %, because a heavily loaded queue spends long
stretches in one state and a run of half a million packets contains far less
independent information than its length suggests. A single short measurement of
a busy link is not a reliable number, and that is a property of the queue, not
of the instrument.

![Mean queueing delay against utilisation for a 100 Mb/s port, with measured points from a discrete-event simulation on the analytic curves for exponential and for fixed-size service. Both are near zero until sixty per cent, bend upward through eighty per cent, and climb steeply toward one; the fixed-size discipline sits at half the delay of the exponential one throughout.](/courses/fe-ee/figures/net4-queue-knee.svg)

## 9.3 Why the Knee Sits Near 80 %

The shape is governed by $1/(1-\\rho)$, whose slope is

$$\\frac{dW_{q}}{d\\rho} = \\frac{1}{\\mu\\,(1 - \\rho)^{2}}$$

At $\\rho = 0.5$ that slope is $4/\\mu$; at $\\rho = 0.8$ it is $25/\\mu$; at
$\\rho = 0.95$ it is $400/\\mu$. **Every extra percent of load costs a hundred
times more delay at 95 % than at 50 %.** That is what an engineer means by "the
knee", and 80 % is the conventional place to draw the line because it is where
the slope has grown by a factor of six from its half-load value but the delay is
still a fraction of a millisecond.

The ratio between two loads follows from the formula alone and is worth
memorising as a check on arithmetic:

$$\\frac{W_{q}(\\rho_{2})}{W_{q}(\\rho_{1})} = \\frac{\\rho_{2}(1-\\rho_{1})}{\\rho_{1}(1-\\rho_{2})} = \\frac{0.8 \\times 0.9}{0.1 \\times 0.2} = 36$$

and the simulation measures $0.4794/0.013333 = 35.956$, agreeing with 36 inside
its error bar. Note that this exact ratio is 36 and not 37; dividing the rounded
table entries 0.48 by 0.013 gives 36.9, which is how a rounding error becomes a
published number.

Service-time variability matters as much as load. Repeating the run with
fixed-size packets instead of exponentially distributed ones — the M/D/1 case,
which is what a link carrying only full-MTU frames looks like — measures
**0.2412 ± 0.0010 ms** at 80 % load against 0.4794 ms for the variable case,
almost exactly half, as

$$W_{q}^{\\,\\mathrm{M/D/1}} = \\frac{\\rho}{2\\mu(1-\\rho)}$$

predicts. **Halving the variability halves the wait at no cost in capacity**,
which is the entire argument for traffic shaping and for fixed-size cells.

### Worked Example 9.1 — Little's Law on a Router You Cannot Open

**Given.** A router's counters report 2500 packets per second arriving at an
interface and an average of 12 packets queued for it. No distribution is known.
Find the mean queueing delay, and then the mean delay if the arrival rate rises
to 4000 packets per second with the queue holding 30.

**Apply the identity.**

$$W_{q} = \\frac{L_{q}}{\\lambda} = \\frac{12}{2500} = 0.0048\\ \\mathrm{s} = 4.8\\ \\mathrm{ms}$$

$$W_{q} = \\frac{30}{4000} = 0.0075\\ \\mathrm{s} = 7.5\\ \\mathrm{ms}$$

**Answer.** 4.8 ms and 7.5 ms. **No model was needed and none was used.** The
arrival rate rose by 60 % and the delay by 56 %, which tells you the queue is
still on the gentle part of its curve; had the delay tripled for a 60 % load
increase, the interface would be past its knee.

### Worked Example 9.2 — How Much Load Fits Under a Delay Budget

**Given.** The same 100 Mb/s interface, and a service-level target of no more
than 1.0 ms of mean queueing delay. What is the largest offered load that meets
it, and what happens to the answer if the target is tightened to 0.5 ms?

**Set the expression equal to the budget and solve for $\\rho$.**

$$\\frac{\\rho}{\\mu(1-\\rho)} \\le 0.001 \\quad\\Longrightarrow\\quad \\rho \\le \\frac{0.001\\,\\mu}{1 + 0.001\\,\\mu}$$

$$0.001 \\times 8333.33 = 8.3333, \\qquad \\rho \\le \\frac{8.33333}{9.33333} = 0.892857$$

**In bits per second**, and then again for the tighter budget:

$$0.892857 \\times 100 = 89.2857\\ \\mathrm{Mb/s}, \\qquad \\rho \\le \\frac{4.16667}{5.16667} = 0.806452 \\rightarrow 80.6452\\ \\mathrm{Mb/s}$$

**Answer.** 89.29 Mb/s under a 1.0 ms budget and 80.65 Mb/s under a 0.5 ms one.
**Halving the delay budget cost 8.64 Mb/s of usable capacity, 8.6 % of the
link.** Upgrading the port to 1 Gb/s does better than multiply that by ten: the
service rate becomes 83,333.33 packets per second, so the same 1.0 ms rule
allows

$$\\rho \\le \\frac{83.3333}{84.3333} = 0.988142 \\rightarrow 988.14\\ \\mathrm{Mb/s}$$

**A faster port may be run closer to full**, because every packet clears in a
tenth of the time and the queue that builds behind it drains ten times faster.
That, and not the raw capacity, is why fast links are allowed to run hot.`,
      examTip: 'Little\'s law, L = lambda W, holds for any queue with any discipline and any distribution — use it whenever two of the three quantities are known. The M/M/1 forms follow only after assuming exponential arrivals and service. Queueing delay grows as 1/(1 - rho), so its slope grows as 1/(1 - rho)^2: a hundred times steeper at 95 % load than at 50 %.',
      importantNote: 'A discrete-event simulation of a 100 Mb/s port measures 0.4794 +/- 0.0024 ms of queueing delay at 80 % load and 2.3208 +/- 0.0362 ms at 95 %. Fixed-size packets halve those figures at the same load, which is why shaping traffic to uniform sizes buys delay without buying capacity.',
    },
    { id: 'netperf-jitter', title: '10. Jitter, and Sizing a Playout Buffer From a Delay Trace',
      content: `## 10.1 Jitter Is a Property of the Distribution, Not of the Mean

A stream of packets sent at even intervals does not arrive at even intervals,
because each packet meets a different queue state. **Jitter is the variation in
one-way delay**, and it is the quantity that decides whether speech is
intelligible, while the mean delay decides only whether conversation is
comfortable.

Building a real trace makes the distinction concrete. Send a tagged stream of
voice packets across five hops, each an independently simulated queue on a
100 Mb/s port, and record the delay every packet actually experienced:

| Load per hop | Mean delay | Standard deviation | 99th percentile | 99.9th percentile | Worst seen |
|---|---|---|---|---|---|
| 50 % | 1.2006 ± 0.0017 ms | 0.535 ms | 2.767 ms | 3.547 ms | 5.449 ms |
| 80 % | 3.0127 ± 0.0128 ms | 1.330 ms | 6.911 ms | 8.602 ms | 11.647 ms |

Raising the load from 50 % to 80 % multiplied the mean by 2.5 and the tail by
the same factor, but **the worst case moved from 4.5 times the mean to 3.9 times
the mean** — the shape barely changed while the scale grew. That is what a sum
of five exponential sojourns does: it is an Erlang distribution of order five,
whose tail is

$$P(X > x) = e^{-\\theta x}\\sum_{k=0}^{4}\\frac{(\\theta x)^{k}}{k!}, \\qquad \\theta = \\mu(1-\\rho)$$

with mean $5/\\theta$ and standard deviation $\\sqrt{5}/\\theta$. At 80 % load,
$\\theta = 1666.67$ per second, so the predicted mean is 3.000 ms against a
measured 3.0127 ms, and the predicted 99th percentile is 6.963 ms against a
measured 6.911 ms.

## 10.2 The Estimator a Receiver Actually Runs

A receiver cannot compute percentiles in real time. RFC 3550 has it track a
first-order filter over successive differences in transit time:

$$J \\leftarrow J + \\frac{\\lvert D_{i-1,i}\\rvert - J}{16}$$

Running that filter over the tagged voice trace — packets 20 ms apart, so
successive samples meet independent queue states — settles at **0.596 ms** at
50 % load and **1.434 ms** at 80 % load, matching the direct mean absolute step
of 0.593 ms and 1.444 ms measured from the same trace.

**This is where a serious mistake lives.** The estimator reads 1.43 ms, and a
buffer of 1.43 ms would discard about one packet in three. The estimator
measures the average step between *neighbouring* packets; a playout buffer must
cover the *tail* of the whole distribution. On this path the ratio between the
two is very nearly six:

$$\\frac{8.602}{1.434} = 5.9986$$

## 10.3 Sizing the Buffer by Counting Late Packets

A playout buffer holds arriving packets and releases them on a fixed schedule
set one depth $D$ beyond the fixed part of the path delay. A packet is lost to
the listener when its variable delay exceeds $D$, whatever the network did with
it. Counting those directly from the trace gives the design curve:

| Buffer depth | Late at 50 % load | Late at 80 % load |
|---|---|---|
| 2 ms | 8.27 % | 75.84 % |
| 4 ms | 0.030 % | 20.52 % |
| 6 ms | below 0.001 % | 3.00 % |
| 8 ms | below 0.001 % | 0.33 % |

![Percentage of packets arriving too late to play against playout buffer depth, on a logarithmic vertical scale, for five-hop paths loaded to fifty and eighty per cent. Both curves fall steeply; the fifty per cent curve passes one per cent near two point eight milliseconds and the eighty per cent curve near seven milliseconds, with a dashed guide at the one per cent line.](/courses/fe-ee/figures/net4-playout-late.svg)

Every millisecond of buffer is a millisecond added to the conversation, so the
choice is a straight trade of delay against dropouts, and the curve is steep
enough that the trade is usually worth taking.

### Worked Example 10.1 — A Buffer for a Stated Dropout Budget

**Given.** The 80 %-loaded five-hop path above. Choose buffer depths for late
fractions of 1 %, 0.1 % and 0.01 %, and state the delay each costs.

**Read the quantiles off the trace, then confirm with the Erlang tail.** The
depth for a 1 % late target is by definition the 99th percentile of the delay
distribution, which the trace puts at 6.911 ms and the closed form at

$$e^{-\\theta D}\\sum_{k=0}^{4}\\frac{(\\theta D)^{k}}{k!} = 0.01 \\;\\Longrightarrow\\; D = 6.963\\ \\mathrm{ms}$$

Repeating for the tighter targets gives 8.877 ms and 10.669 ms, against 8.602 ms
and (beyond the trace) an unmeasurable count.

| Late target | Depth from the trace | Depth from the Erlang tail | Closed-form cost over the 1 % choice |
|---|---|---|---|
| 1 % | 6.911 ms | 6.963 ms | — |
| 0.1 % | 8.602 ms | 8.877 ms | 1.91 ms |
| 0.01 % | not resolvable | 10.669 ms | 3.71 ms |

**Answer.** Roughly 7 ms, 9 ms and 11 ms. **A tenfold reduction in dropouts
costs under 2 ms each time**, which is the geometry of an exponential tail:
equal multiplicative improvements cost equal additive delay. Note the last row
honestly — a 400,000-packet trace contains only 40 packets beyond the 0.01 %
point, so that depth is quoted from the distribution the trace validated rather
than from the trace itself.

### Worked Example 10.2 — The Mouth-to-Ear Budget, Without Double Counting

**Given.** G.711 with 20 ms sample packets, a 10 Mb/s access link, 4000 km of
fibre, the five-hop 80 %-loaded core above, and the 0.1 % playout buffer chosen
in 10.1. Does the call meet the 150 ms one-way target?

**Fixed terms first.**

$$d_{\\mathrm{pkt}} = 20.0\\ \\mathrm{ms}, \\qquad d_{\\mathrm{ser}} = \\frac{238 \\times 8}{10 \\times 10^{6}} = 0.1904\\ \\mathrm{ms}$$

$$d_{\\mathrm{prop}} = \\frac{4.0 \\times 10^{6}}{2.0 \\times 10^{8}} = 0.020\\ \\mathrm{s} = 20.0\\ \\mathrm{ms}$$

**Now the term students double count.** The measured mean queueing delay is
3.0127 ms, and it does **not** appear as a separate line. The playout buffer
holds every packet until its scheduled instant, so the listener experiences the
buffer depth and nothing else from the variable part; adding 3.01 ms of mean
queueing *and* 8.60 ms of buffer counts the same delay twice.

$$d_{\\mathrm{ear}} = 20.0 + 0.1904 + 20.0 + 8.6017 = 48.7921\\ \\mathrm{ms}$$

**Answer.** 48.79 ms one way, comfortably inside the 150 ms target with 101 ms
of margin for the codec, the far-end hardware and a worse day on the network.
**The buffer converts variable delay into fixed delay**, and the budget must be
written in terms of what the listener hears, which is the fixed schedule, not
the average packet.`,
      examTip: 'Jitter is delay variation, not delay. The RFC 3550 estimator tracks the mean step between successive packets and reads far smaller than the buffer a stream needs: 1.43 ms against 8.60 ms on the same measured path, a factor of six. Size a playout buffer from a percentile of the delay distribution, never from the jitter statistic.',
      importantNote: 'A playout buffer replaces variable delay with fixed delay. Once a buffer of depth D is in the budget, the mean queueing delay must NOT be added again — it is already inside D. Counting both is the most common error in a mouth-to-ear budget and inflates it by the mean queueing delay of every hop.',
    },
    { id: 'netperf-loss', title: '11. Loss, Retransmission, and Why Distance Multiplies the Damage',
      content: `## 11.1 Loss Without Congestion Control

The simplest cost of loss is arithmetic. A link that drops a fraction $p$ of
frames must send each one $1/(1-p)$ times on average before it is delivered, so
the delivered fraction of the wire is $(1-p)$:

$$E[k] = \\sum_{k=1}^{\\infty} k\\,p^{\\,k-1}(1-p) = \\frac{1}{1-p}, \\qquad T_{\\mathrm{eff}} = R\\,(1-p)$$

Loss usually arrives as a bit error rate rather than a frame loss rate, and the
conversion is the place errors are made. A frame of $n$ bits survives only if
every bit does:

$$p_{f} = 1 - (1 - p_{b})^{n} \\approx n\\,p_{b} \\quad \\text{for } n p_{b} \\ll 1$$

**A 1500-byte frame is 12,000 chances to be destroyed, not one.** That factor of
12,000 between the two rates is the single most common slip in this material.

## 11.2 Loss With Congestion Control Is a Different Shape

A sender that reacts to loss by halving its window behaves completely
differently. Between losses the window grows by one segment per round trip; on a
loss it halves. Stepping that loop round by round produces the sawtooth every
congested transfer shows.

Over one cycle the window climbs from $W/2$ to $W$, taking $W/2$ round trips and
delivering the area under the ramp:

$$N_{\\mathrm{cycle}} = \\frac{W}{2}\\times\\frac{W/2 + W}{2} = \\frac{3W^{2}}{8}$$

One loss per cycle means $p = 1/N_{\\mathrm{cycle}}$, so

$$W = \\sqrt{\\frac{8}{3p}}, \\qquad \\bar{W} = \\frac{3W}{4}, \\qquad T = \\frac{8\\,\\bar{W}\\,\\mathrm{MSS}}{\\mathrm{RTT}} = \\sqrt{\\frac{3}{2}}\\;\\frac{8\\,\\mathrm{MSS}}{\\mathrm{RTT}\\sqrt{p}}$$

Running the loop with a drop placed exactly every $1/p$ segments, on a 50 ms
path with 1460-byte segments, measures how good that closed form is:

| Loss rate | Measured sawtooth throughput | Square-root law | Ratio |
|---|---|---|---|
| 1 in 100 | 2.5697 Mb/s | 2.8610 Mb/s | 0.898 |
| 1 in 1000 | 8.8076 Mb/s | 9.0473 Mb/s | 0.974 |
| 1 in 10,000 | 28.3790 Mb/s | 28.6100 Mb/s | 0.992 |
| 1 in 100,000 | 89.8730 Mb/s | 90.4729 Mb/s | 0.993 |

**The law is asymptotic, and the simulation shows where it stops being true.**
At 1 % loss the window averages only about sixteen segments, integer truncation
and the lost segment itself both matter, and the formula is 10 % optimistic. By
one loss in ten thousand the two agree to within a percent. A formula quoted
without its domain of validity is a trap; running the process shows the domain.

## 11.3 The Same Loss on Two Continents

Replace the periodic drop with independent random loss and run the window loop
eight times at each setting:

| Loss rate | Measured at RTT 10 ms | Measured at RTT 100 ms | Ratio |
|---|---|---|---|
| 1 in 100 | 14.3885 ± 0.0283 Mb/s | 1.4389 ± 0.0028 Mb/s | 10.000 |
| 1 in 1000 | 47.4419 ± 0.2522 Mb/s | 4.7442 ± 0.0252 Mb/s | 10.000 |
| 1 in 10,000 | 152.9213 ± 1.0441 Mb/s | 15.2921 ± 0.1044 Mb/s | 10.000 |

The last column is not approximately ten; it is ten to every digit the
simulation prints, and for a reason worth understanding. Given the same sequence
of losses, the window follows an identical trajectory on both paths — only the
clock that advances between rounds differs. **Round-trip time divides throughput
exactly, and loss is what sets the window that gets divided.**

![Measured throughput against packet loss probability for round-trip times of ten and one hundred milliseconds, on logarithmic axes, with the square-root law drawn as a dashed reference through each set of points. The two measured series are parallel straight lines a factor of ten apart, falling by about a factor of ten for every hundredfold rise in loss.](/courses/fe-ee/figures/net4-loss-distance.svg)

Reading the slope off the measurements alone, without importing any constant:
cutting the loss rate a hundredfold multiplies the measured throughput by
$10.628 \\pm 0.076$, which is an exponent of

$$\\frac{\\ln 10.628}{\\ln 100} = 0.5132$$

against the square root's 0.5000 — the shape confirmed by measurement rather
than assumed.

**This is why a long path is fragile.** One percent loss on a 10 ms path still
delivers 14 Mb/s, which most users would call working. The same one percent on a
100 ms path delivers 1.44 Mb/s on a link that may be capable of ten gigabits.
Nothing is wrong with the links; the control loop simply cannot learn fast
enough to keep a long pipe full when it is being knocked back every few hundred
milliseconds.

### Worked Example 11.1 — From Bit Error Rate to Delivered Throughput

**Given.** A 100 Mb/s link with a bit error rate of $1 \\times 10^{-6}$ carries
1500-byte frames with 1460-byte TCP payloads and retransmits corrupted frames.
Find the frame error probability, the mean transmissions per delivered frame,
and the application goodput.

**Frame error probability.** A frame is 12,000 bits:

$$p_{f} = 1 - (1 - 10^{-6})^{12000} = 0.0119283$$

The linear approximation gives $12000 \\times 10^{-6} = 0.012$, high by 0.6 %,
which is the price of the approximation at this frame length.

**Transmissions per delivered frame.**

$$E[k] = \\frac{1}{1 - 0.0119283} = 1.01207$$

**Throughput and then goodput.**

$$T_{\\mathrm{eff}} = 100 \\times (1 - 0.0119283) = 98.807\\ \\mathrm{Mb/s}$$

$$\\text{goodput} = 98.807 \\times \\frac{1460}{1538} = 93.796\\ \\mathrm{Mb/s}$$

**Answer.** 1.19 % of frames fail, each delivered frame costs 1.012
transmissions, and the application sees 93.80 Mb/s. **Two independent taxes are
stacked here**: 5.07 Mb/s to headers and 1.13 Mb/s to retransmission. Note also
that improving the bit error rate to $10^{-7}$ takes the frame error rate to
0.12 % and the throughput to 99.88 Mb/s — a tenfold improvement in the physical
layer buys back only 1.07 Mb/s, because the header tax does not move.

### Worked Example 11.2 — What Loss Rate Makes a Long Path Behave

**Given.** A transfer over a 10 ms path at one loss in a thousand measures
47.44 Mb/s. The same application must reach the same throughput over a 100 ms
path. What loss rate does that require, and is it achievable?

**Use the measured scaling rather than a constant.** Throughput varies as
$1/\\mathrm{RTT}$ exactly and as $p^{-0.5}$ to a good approximation, so

$$\\frac{T_{2}}{T_{1}} = \\frac{\\mathrm{RTT}_{1}}{\\mathrm{RTT}_{2}}\\sqrt{\\frac{p_{1}}{p_{2}}} = 1 \\;\\Longrightarrow\\; \\sqrt{\\frac{p_{1}}{p_{2}}} = \\frac{\\mathrm{RTT}_{2}}{\\mathrm{RTT}_{1}} = 10$$

$$p_{2} = \\frac{p_{1}}{100} = \\frac{0.001}{100} = 0.00001$$

**Check it against the measurements.** The table gives 15.29 Mb/s at one loss in
ten thousand on the 100 ms path; another factor of ten in loss buys another
factor of 3.16, giving about 48 Mb/s — the target.

**Answer.** One loss in a hundred thousand, a hundred times better than the
short path needs. **A tenfold longer path demands a hundredfold better loss
rate for equal throughput**, which is why long-distance transfers are moved onto
protocols that do not halve their window on a single drop, rather than onto
faster links.`,
      examTip: 'Distinguish the two loss regimes. Without congestion control, effective throughput is R(1 - p) and loss costs almost nothing until p is large. With a window that halves on loss, throughput goes as 1/(RTT sqrt(p)): the RTT dependence is exact and the loss dependence is a square root, so a hundredfold better loss rate buys only a tenfold better throughput.',
      importantNote: 'Convert bit error rate to frame error rate before doing anything else: a 1500-byte frame is 12,000 chances to fail, so a BER of 1e-6 gives a frame error rate of 1.19 %, not 0.0001 %. The simulated sawtooth also shows the square-root law is 10 % optimistic at 1 % loss and accurate to a percent below one loss in ten thousand.',
    },
    { id: 'netperf-shaping', title: '12. Shaping and Policing: a Token Bucket Driven by a Real Trace',
      content: `## 12.1 The Mechanism, Stated as Two Numbers

A token bucket enforces an average rate while still permitting bursts. Tokens
accumulate at a fill rate $r$ into a bucket of depth $b$; a packet of $L$ bytes
may pass only if $L$ tokens are present, and passing spends them.

$$\\text{tokens}(t) = \\min\\bigl(b,\\ \\text{tokens}(t^{-}) + r\\,\\Delta t\\bigr)$$

Because the bucket can never hold more than $b$, the cumulative bytes that pass
in any interval of length $t$ obey one inequality, and that inequality is the
whole contract:

$$A_{\\mathrm{pass}}(t) \\le b + r\\,t$$

**The depth buys burst tolerance and the fill rate buys sustained throughput.**
They are independent dials, and confusing them is the usual design error: a
larger bucket does not raise the long-run rate by one bit per second, and a
higher fill rate does not help a source whose problem is one big burst.

A source sending at peak rate $P$ drains the bucket at $P - r$, so the longest
burst it can send at full speed and the size of that burst are

$$T_{\\max} = \\frac{b}{P - r}, \\qquad B_{\\max} = P\\,T_{\\max} = \\frac{P\\,b}{P - r}$$

## 12.2 Driving It With an Actual Burst

Take a 2 Mb/s contract with a 50 kB bucket, and feed it a source that fires 200
back-to-back 1500-byte packets at 10 Mb/s. In byte terms the fill rate is
250,000 B/s, the peak is 1,250,000 B/s, and packets arrive every

$$\\tau = \\frac{1500 \\times 8}{10 \\times 10^{6}} = 0.0012\\ \\mathrm{s}$$

so each interval brings 300 bytes of fresh tokens against a demand of 1500.
Packet $k$ passes only while

$$1500k \\le b + 300(k-1) \\;\\Longrightarrow\\; k \\le \\frac{49700}{1200} = 41.4167$$

Running the trace through a policer confirms it exactly: **the first 41 packets
conform and the 42nd is the first to be marked**. The closed form for the burst
agrees from the other direction:

$$T_{\\max} = \\frac{50000}{1250000 - 250000} = 0.050\\ \\mathrm{s}, \\qquad B_{\\max} = 1250000 \\times 0.050 = 62500\\ \\text{bytes}$$

and 62,500 bytes is 41.67 packets, of which 41 are whole.

Over the whole 238.8 ms burst the policer passes **73 packets and drops 127**,
and that too is the envelope rather than an accident:

$$\\left\\lfloor\\frac{b + r\\,T}{L}\\right\\rfloor = \\frac{50000 + 250000 \\times 0.2388}{1500} = \\frac{109700}{1500} = 73.133$$

![Two stacked panels sharing a time axis for a ten megabit per second burst meeting a two megabit per second bucket. The upper panel shows the token level falling from fifty kilobytes to zero over the first fifty milliseconds and then sawtoothing near empty. The lower panel shows cumulative offered bytes climbing as a straight steep line while the bytes passed follow the shallower dashed bucket envelope after the bucket empties.](/courses/fe-ee/figures/net4-token-bucket.svg)

The upper panel is the mechanism and the lower panel is the consequence. The
moment the token curve reaches zero, the passed curve leaves the offered curve
and follows the envelope $b + rt$ for the rest of the burst.

## 12.3 Policing Drops, Shaping Delays

The same bucket can be wired two ways. A **policer** marks or drops
non-conforming packets immediately; a **shaper** holds them until their tokens
exist. Running the identical trace through a shaper instead measures a very
different outcome: nothing is dropped, the last packet leaves at exactly

$$t_{\\mathrm{last}} = \\frac{A_{\\mathrm{total}} - b}{r} = \\frac{300000 - 50000}{250000} = 1.000\\ \\mathrm{s}$$

and, because it arrived at 238.8 ms, it waited

$$d = 1000.0 - 238.8 = 761.2\\ \\mathrm{ms}$$

The shaper needed somewhere to put those bytes. The peak backlog is the largest
gap between what arrived and what the envelope allowed:

$$Q_{\\max} = \\max_{t}\\bigl(A(t) - b - r\\,t\\bigr) = 300000 - 109700 = 190300\\ \\text{bytes}$$

| Property | Policer | Shaper |
|---|---|---|
| Non-conforming traffic | dropped or marked | delayed |
| Memory needed | none | 190,300 bytes, measured |
| Worst delay added | none | 761.2 ms, measured |
| Effect on a TCP source | triggers window halving | triggers retransmission timers if deep |
| Right place to use it | ingress of another operator's traffic | egress of your own |

**Neither is free**: the policer pays in loss and the shaper pays in delay and
memory, and 761 ms of added delay is worse than a drop for anything interactive.

### Worked Example 12.1 — Sizing a Bucket So a Known Burst Survives

**Given.** An application sends a 100 kB object as one burst at 10 Mb/s onto a
2 Mb/s contract. What bucket depth passes the whole object without a single
drop?

**Find the burst duration and the tokens that arrive during it.**

$$T = \\frac{100000}{1250000} = 0.080\\ \\mathrm{s}, \\qquad r\\,T = 250000 \\times 0.080 = 20000\\ \\text{bytes}$$

**Require the envelope to cover the arrivals at every instant.** The tightest
moment is the end of the burst:

$$b + r\\,T \\ge 100000 \\;\\Longrightarrow\\; b \\ge 100000 - 20000 = 80000\\ \\text{bytes}$$

**Answer.** 80 kB, and the 50 kB bucket of section 12.2 would drop the tail of
this object. Sanity-check it with the burst formula in reverse:
$B_{\\max} = 1250000 \\times 80000/1000000 = 100000$ bytes, exactly the object.
**Bucket depth is sized from the largest burst the application can produce, not
from its average rate**, and the two have no relationship whatsoever.

### Worked Example 12.2 — Choosing Between Dropping and Delaying

**Given.** The 300 kB burst of section 12.2 against the 50 kB bucket at 2 Mb/s.
Compare the outcome for a file transfer and for a voice stream.

**Policer outcome, measured.** 73 packets of 200 pass, 127 are dropped, and the
loss rate seen by the source is

$$\\frac{127}{200} = 0.635$$

**Shaper outcome, measured.** Nothing is dropped, the last packet is delayed
761.2 ms, and 190,300 bytes must be held.

**For the file transfer**, the policer is survivable but wasteful: a 63.5 % loss
burst will collapse the congestion window to its minimum, and the transfer will
spend seconds recovering. The shaper is better, because the transfer does not
care about 761 ms and does care about restarting its window.

**For the voice stream**, the answer inverts. A 761 ms delay is unusable — it is
five times the 150 ms one-way target of section 10 — while dropped voice packets
merely degrade quality for the duration of the burst. **Shape elastic traffic,
police real-time traffic**, and never put a deep shaper in front of a stream
that a playout buffer is waiting on.`,
      examTip: 'Bucket depth b sets the burst allowed and fill rate r sets the sustained rate; they are independent. A source at peak rate P empties the bucket in b/(P - r) seconds, passing Pb/(P - r) bytes. Over a longer window the passed bytes never exceed b + rt, which is the one inequality every token-bucket question reduces to.',
      importantNote: 'A policer and a shaper enforce the same contract with different currency. Driving the identical 300 kB burst through both measured 127 dropped packets for the policer against 761.2 ms of added delay and 190,300 bytes of buffer for the shaper. Elastic traffic prefers the shaper; real-time traffic prefers the policer.',
    },
    { id: 'netperf-measure', title: '13. Measuring It: ping, One-Way Delay, and the Halved Round Trip',
      content: `## 13.1 What a Round-Trip Measurement Contains

An echo probe measures one thing: the interval between sending a request and
receiving its reply, on a single clock. That interval contains the forward path,
the far end's turnaround, and the reverse path, and it cannot be decomposed by
the instrument that measured it.

$$\\mathrm{RTT} = d_{\\mathrm{fwd}} + d_{\\mathrm{turn}} + d_{\\mathrm{rev}}$$

A report of one hundred probes carries four numbers, and they mean different
things:

| Statistic | What it estimates | What it is useless for |
|---|---|---|
| Minimum | the path with no queueing anywhere | current congestion |
| Mean | the path plus average queueing on both directions | either direction alone |
| Maximum | one unlucky sample, often a slow-path event | planning |
| Mean deviation | spread of the round trip | sizing a playout buffer |

**The minimum is the most informative of the four.** Over a simulated run on a
path whose unqueued round trip is exactly 30.0000 ms, the smallest of 600,000
probes measures **30.0004 ms** — the queueing has been squeezed out of it, and
what is left is propagation, serialisation and processing. Subtracting the
minimum from the mean isolates the average queueing on the two directions
together, which is a genuinely useful number.

## 13.2 Half of a Round Trip Is Not a One-Way Delay

Take a path with a forward direction crossing 12.0 ms of fibre through an
interface at 80 % load, and a reverse direction returning by a different route
of 18.0 ms through a lightly loaded interface. Simulating both directions and
measuring each separately:

| Quantity | Measured |
|---|---|
| Forward one-way delay | 12.5961 ms |
| Reverse one-way delay | 18.1499 ms |
| Round trip | 30.7460 ms |
| Half the round trip | 15.3730 ms |

$$\\frac{15.3730 - 12.5961}{12.5961} = 0.22046, \\qquad \\frac{18.1499 - 15.3730}{18.1499} = 0.15300$$

**Halving the round trip overstates the forward direction by 22.0 % and
understates the reverse by 15.3 %, simultaneously.** Three independent causes
produce that, and any one of them is enough:

1. **Route asymmetry.** Return traffic frequently takes a different path through
   a different set of providers. The two directions are not the same length.
2. **Rate asymmetry.** An access link with 100 Mb/s down and 10 Mb/s up
   serialises the two directions at different speeds.
3. **Load asymmetry.** Congestion is directional. An interface at 80 % in one
   direction may be at 20 % in the other, and the queueing terms differ by the
   ratio the previous sections computed.

![Simulated forward and reverse one-way delays for four hundred consecutive probes, with a dashed line at half the mean round trip. The forward trace fluctuates around twelve and a half milliseconds with occasional excursions, the reverse trace sits near eighteen milliseconds, and the dashed line runs between them, coinciding with neither.](/courses/fe-ee/figures/net4-owd-asymmetry.svg)

The dashed line in the figure never touches either trace. That is the entire
lesson: **RTT/2 is an average of two things you wanted separately**, and it is
only correct when they happen to be equal.

## 13.3 Why Everybody Measures the Round Trip Anyway

If one-way delay is what matters, why is the round trip what gets measured?
Because a one-way measurement needs two clocks, and two clocks disagree. Write
$\\theta$ for the offset of the receiver's clock relative to the sender's. The
timestamps a one-way measurement produces are

$$\\hat{d}_{\\mathrm{fwd}} = d_{\\mathrm{fwd}} + \\theta, \\qquad \\hat{d}_{\\mathrm{rev}} = d_{\\mathrm{rev}} - \\theta$$

Add them, and the offset cancels exactly:

$$\\hat{d}_{\\mathrm{fwd}} + \\hat{d}_{\\mathrm{rev}} = d_{\\mathrm{fwd}} + d_{\\mathrm{rev}} = \\mathrm{RTT}$$

**The round trip is immune to clock offset and the one-way delays are not.**
That is why every protocol that has to time something — retransmission timers,
congestion control, path selection — is built on the round trip. It is also why
a one-way measurement without a disciplined clock is worth very little: the
error a reader is left with,

$$\\hat{d}_{\\mathrm{fwd}} - \\frac{\\mathrm{RTT}}{2} = \\frac{d_{\\mathrm{fwd}} - d_{\\mathrm{rev}}}{2} + \\theta$$

mixes the path asymmetry you were trying to find with the clock offset you
cannot see, and no amount of averaging separates them.

## 13.4 Two Traps in the Tools

**Echo replies are not data-plane traffic.** A router generating an ICMP reply
about itself usually does so on a control processor that is orders of magnitude
slower than the forwarding path, and it may rate-limit those replies. A hop that
shows 40 ms in a trace while the hops beyond it show 15 ms is almost always
reporting its own control plane, not a real 40 ms of path.

**Per-hop times in a trace are cumulative, not incremental.** The figure for hop
$n$ is a round trip from the source to hop $n$ and back, by whatever return path
that router chooses. Subtracting consecutive rows to get a per-link delay
assumes both return paths are identical, which is exactly the assumption section
13.2 destroyed.

### Worked Example 13.1 — Reading a Ping Report Properly

**Given.** One hundred probes to a server return a minimum of 30.00 ms, a mean
of 30.75 ms and a maximum of 42.00 ms. The physical path is 3000 km of fibre in
each direction. What can be concluded?

**Check the floor against physics.** Propagation alone, both ways:

$$2 \\times \\frac{3.0 \\times 10^{6}}{2.0 \\times 10^{8}} = 0.030\\ \\mathrm{s} = 30.0\\ \\mathrm{ms}$$

**Extract the queueing.** The minimum matches the propagation floor, so
serialisation and processing are negligible at this scale and there is at least
one uncongested moment in the sample:

$$\\bar{d}_{\\mathrm{queue}} = 30.75 - 30.00 = 0.75\\ \\mathrm{ms}$$

**Answer.** The path is propagation-dominated, the average total queueing on
both directions together is 0.75 ms, and the 42 ms maximum is 12 ms of excursion
in a single sample — a burst, a control-plane hiccup, or a route change.
**What cannot be concluded is that the one-way delay is 15.375 ms.** The
measurement supports no statement at all about the split between directions, and
the honest report is "30.75 ms round trip, of which 0.75 ms is queueing".

### Worked Example 13.2 — A Clock Offset That Hides an Asymmetry

**Given.** The path of section 13.2, whose true one-way delays are 12.5961 ms
forward and 18.1499 ms reverse. The receiver's clock is 3.0000 ms ahead of the
sender's. What does a one-way measurement report, and what does the round trip
report?

**Apply the offset to each direction.**

$$\\hat{d}_{\\mathrm{fwd}} = 12.5961 + 3.0000 = 15.5961\\ \\mathrm{ms}$$

$$\\hat{d}_{\\mathrm{rev}} = 18.1499 - 3.0000 = 15.1499\\ \\mathrm{ms}$$

**Sum them.**

$$15.5961 + 15.1499 = 30.7460\\ \\mathrm{ms}$$

**Answer.** The round trip is reported perfectly, and the one-way measurement
says the path is very nearly symmetric — which is the opposite of the truth, a
path whose directions differ by 5.55 ms. **A modest clock error turned a 44 %
asymmetry into an apparent 3 % one.** The offset that would make it look exactly
symmetric is

$$\\theta = \\frac{18.1499 - 12.5961}{2} = 2.7769\\ \\mathrm{ms}$$

which is a smaller error than an undisciplined clock makes in a day. One-way
delay is a measurement that requires GPS or a synchronisation protocol behind
it; without one, report the round trip and say so.`,
      examTip: 'A ping measures the sum of both directions plus the far end\'s turnaround, and no processing of that number recovers either direction. Use the minimum to estimate the unqueued path and the mean minus the minimum to estimate average queueing. RTT/2 equals the one-way delay only when routes, rates and loads are all symmetric.',
      importantNote: 'On a simulated path with 12.5961 ms forward and 18.1499 ms reverse, half the round trip is 15.3730 ms — 22.0 % above the forward delay and 15.3 % below the reverse one. A clock offset adds to one direction and subtracts from the other, so the round trip is immune to it while a one-way measurement is not. That immunity is why protocols time round trips.',
    },
    { id: 'netperf-pset-a', title: '14. Problem Set A — Delay, Pipes, Windows, and Overhead',
      content: `Six problems on the deterministic half of the chapter. Every answer carries its
units through the whole chain, and every one states which convention — decimal
for rates, binary for stored bytes — is in force at each conversion.

## 14.1 Problem Set A — the problems

**A1.** A 9000-byte jumbo frame crosses 600 km of fibre on a 40 Gb/s link. Find
the serialisation delay, the propagation delay, their ratio, and the link rate
at which the two would be equal.

**A2.** A 200 Mb/s path has a 25 ms round-trip time and carries 1500-byte
packets. Give the bandwidth-delay product in bits, bytes, kibibytes and packets,
and the exact window that first saturates the link.

**A3.** A 1200-byte packet crosses four 50 Mb/s store-and-forward links spanning
900 km of fibre, through three routers taking 30 μs each. Find the one-way delay
and the round trip if the acknowledgement is 64 bytes.

**A4.** A 100 Mb/s Ethernet link carries 576-byte IP packets with TCP over IPv4.
Find the goodput, and the gain from moving to a 1500-byte MTU.

**A5.** A 2 GiB file moves over a 500 Mb/s link using 1460-byte segments in
1538-byte frames. Find the transfer time, and the error a reader makes by
calling the file "2 GB".

**A6.** A satellite link runs at 2 Mb/s with 250 ms of one-way propagation and
carries 1500-byte frames. Find the stop-and-wait efficiency and throughput, and
the window needed to fill the link.

## 14.2 Problem Set A — answers, worked in full

**A1 — 1.8 μs, 3.0 ms, a ratio of 1666.67, and 24 Mb/s.**

$$d_{\\mathrm{trans}} = \\frac{72000\\ \\text{bit}}{40 \\times 10^{9}\\ \\text{bit/s}} = 1.8 \\times 10^{-6}\\ \\mathrm{s}$$

$$d_{\\mathrm{prop}} = \\frac{6.0 \\times 10^{5}\\ \\mathrm{m}}{2.0 \\times 10^{8}\\ \\mathrm{m/s}} = 3.0 \\times 10^{-3}\\ \\mathrm{s}$$

$$\\frac{3.0 \\times 10^{-3}}{1.8 \\times 10^{-6}} = 1666.67, \\qquad R_{\\mathrm{equal}} = \\frac{Lv}{\\ell} = \\frac{72000 \\times 2.0 \\times 10^{8}}{6.0 \\times 10^{5}} = 24\\ \\mathrm{Mb/s}$$

*The trap.* Reporting the jumbo frame as "slow to send". At 40 Gb/s even a
9000-byte frame serialises in under two microseconds; the distance costs
1667 times more, and no frame size available on Ethernet changes that.

**A2 — 5.0 Mbit, 625,000 bytes, 610.35 KiB, 416.67 packets, and a 418-packet window.**

$$\\mathrm{BDP} = 200 \\times 10^{6} \\times 0.025 = 5.0 \\times 10^{6}\\ \\text{bit}$$

$$\\frac{5.0 \\times 10^{6}}{8} = 625000\\ \\text{bytes}, \\qquad \\frac{625000}{1024} = 610.35\\ \\mathrm{KiB}$$

$$\\frac{5.0 \\times 10^{6}}{12000} = 416.67\\ \\text{packets}$$

The exact crossover adds the sender's own serialisation,
$12000/(200 \\times 10^{6}) = 0.06$ ms:

$$W^{*} = \\frac{25.06}{0.06} = 417.667 \\rightarrow 418\\ \\text{packets}$$

*The trap.* Dividing 625,000 by 1000 and reporting 625 KiB. The kibibyte is
1024 bytes; 625,000 bytes is 625 kB decimal or 610.35 KiB binary, and the two
differ by 2.4 %.

**A3 — 5.358 ms one way and 9.989 ms round trip.**

$$\\frac{9600}{50 \\times 10^{6}} = 1.92 \\times 10^{-4}\\ \\mathrm{s}, \\qquad 4 \\times 0.192 = 0.768\\ \\mathrm{ms}$$

$$d_{\\mathrm{prop}} = \\frac{9.0 \\times 10^{5}}{2.0 \\times 10^{8}} = 4.5\\ \\mathrm{ms}, \\qquad d_{\\mathrm{proc}} = 3 \\times 0.030 = 0.090\\ \\mathrm{ms}$$

$$d_{\\mathrm{fwd}} = 0.768 + 4.5 + 0.090 = 5.358\\ \\mathrm{ms}$$

The acknowledgement pays the same propagation and processing but a much smaller
serialisation, $512/(50 \\times 10^{6}) = 0.01024$ ms per link:

$$d_{\\mathrm{rev}} = 4 \\times 0.01024 + 4.5 + 0.090 = 4.63096\\ \\mathrm{ms}$$

$$\\mathrm{RTT} = 5.358 + 4.63096 = 9.98896\\ \\mathrm{ms}$$

*The trap.* Multiplying the propagation by four as well, which gives 18 ms of
propagation and a nonsense answer of 18.9 ms one way. The 900 km is the whole
path; only serialisation and per-node terms repeat.

**A4 — 87.30 Mb/s, rising to 94.93 Mb/s.**

With a 576-byte IP packet the payload is $576 - 40 = 536$ bytes and the wire
footprint is $576 + 38 = 614$ bytes:

$$\\text{goodput} = 100 \\times \\frac{536}{614} = 87.296\\ \\mathrm{Mb/s}$$

$$\\text{goodput}_{1500} = 100 \\times \\frac{1460}{1538} = 94.928\\ \\mathrm{Mb/s}$$

*The trap.* Forgetting the 20 bytes of interframe gap and preamble that never
appear in a packet capture. They occupy the wire and they belong in the
denominator; leaving them out overstates the goodput by about 1.3 %.

**A5 — 36.195 s, and a 6.87 % error.**

$$2\\ \\mathrm{GiB} = 2 \\times 1073741824 = 2147483648\\ \\text{bytes}$$

$$\\text{goodput} = 500 \\times 10^{6} \\times \\frac{1460}{1538} = 474642393\\ \\text{bit/s}$$

$$t = \\frac{2147483648 \\times 8}{474642393} = 36.195\\ \\mathrm{s}$$

Calling the file 2 GB means $2 \\times 10^{9}$ bytes and gives

$$t = \\frac{16000000000}{474642393} = 33.710\\ \\mathrm{s}$$

$$\\frac{36.195 - 33.710}{36.195} = 0.06866$$

*The trap.* The binary-decimal gap at the giga scale is 7.37 % of the decimal
figure and 6.87 % of the binary one — the same discrepancy expressed against two
different baselines. State which one the percentage is against.

**A6 — 1.186 %, 23.72 kb/s, and an 85-frame window.**

$$d_{\\mathrm{trans}} = \\frac{12000}{2 \\times 10^{6}} = 6.0\\ \\mathrm{ms}, \\qquad \\mathrm{RTT} = 2 \\times 250 = 500\\ \\mathrm{ms}$$

$$\\eta = \\frac{6}{6 + 500} = \\frac{6}{506} = 0.0118577$$

$$T = 0.0118577 \\times 2 \\times 10^{6} = 23715\\ \\text{bit/s}$$

$$W^{*} = \\frac{506}{6} = 84.333 \\rightarrow 85\\ \\text{frames}$$

*The trap.* Using the 250 ms one-way figure instead of the 500 ms round trip,
which gives 2.34 % and doubles the answer. The sender may not proceed until the
acknowledgement has come back, so the cycle is a full round trip plus the frame
itself.`,
      examTip: 'Work these in the order given: convert to bits, compute serialisation and propagation separately, multiply only serialisation by the hop count, then convert back. Keep decimal and binary units apart — a rate is decimal, a stored file is binary, and the gap is 2.4 % at kilo, 4.86 % at mega and 7.37 % at giga.',
      importantNote: 'A2 and A6 are the same question in different regimes. On the 200 Mb/s terrestrial path the window needed is 418 packets and easily configured; on the satellite path it is 85 frames but each is worth 6 ms, so the same protocol behaves completely differently. Always compute the bandwidth-delay product before judging whether a window is adequate.',
    },
    { id: 'netperf-pset-b', title: '15. Problem Set B — Queues, Jitter, Loss, Shaping, and Measurement',
      content: `Six problems on the statistical half of the chapter. Where a simulated figure
appears above, these use the same models, so an answer can be checked against
the measured tables rather than against a memory of a formula.

## 15.1 Problem Set B — the problems

**B1.** A 1 Gb/s port carries 1500-byte packets at 70 % utilisation. Find the
service rate, the mean queueing delay, the mean time in the system and the mean
number of packets present, then state what happens if every packet is exactly
1500 bytes.

**B2.** An interface counter reports 20,000 packets per second arriving and a
mean of 5 packets in the system. The interface serves 25,000 packets per second.
Find the measured mean delay, compare it with the M/M/1 prediction, and say what
the comparison implies.

**B3.** A stream crosses three hops, each contributing an exponentially
distributed delay of mean 0.5 ms. Find the mean end-to-end variable delay and
the playout buffer depths for late-packet fractions of 1 % and 0.1 %.

**B4.** A transfer on a 100 ms path with a 1460-byte segment size measures
4.744 Mb/s. Estimate the packet loss probability, then the throughput the same
loss would allow on a 20 ms path.

**B5.** A 5 Mb/s contract is enforced by a token bucket 100 kB deep. A source
bursts at 100 Mb/s. Find the longest burst at full speed and its size, then the
delay a shaper adds to a 500 kB object.

**B6.** A ping reports a minimum of 8.00 ms and a mean of 8.70 ms. The forward
interface runs at 85 % and the reverse at 10 %, both 100 Mb/s ports carrying
1500-byte packets; the forward route is 600 km and the reverse 900 km. Apportion
the queueing, estimate the forward one-way delay, and state the error in using
half the round trip.

## 15.2 Problem Set B — answers, worked in full

**B1 — 83,333.33 packets/s, 0.028 ms, 0.040 ms, 2.333 packets, and 0.014 ms.**

$$\\mu = \\frac{1.0 \\times 10^{9}}{12000} = 83333.33\\ \\text{packets/s}, \\qquad \\lambda = 0.7\\mu = 58333.33$$

$$W_{q} = \\frac{\\rho}{\\mu - \\lambda} = \\frac{0.7}{25000} = 2.8 \\times 10^{-5}\\ \\mathrm{s} = 0.028\\ \\mathrm{ms}$$

$$W = \\frac{1}{25000} = 4.0 \\times 10^{-5}\\ \\mathrm{s} = 0.040\\ \\mathrm{ms}, \\qquad L = \\frac{0.7}{0.3} = 2.333$$

With fixed-size packets the Pollaczek-Khinchine result halves the wait:

$$W_{q}^{\\,\\mathrm{M/D/1}} = \\frac{\\rho}{2\\mu(1-\\rho)} = 1.4 \\times 10^{-5}\\ \\mathrm{s} = 0.014\\ \\mathrm{ms}$$

*The trap.* Computing the service rate in bits per second and then using it as a
packet rate. The queue serves packets, so $\\mu$ must be a packet rate: divide
the link rate by the packet length in bits, not by the packet length in bytes.

**B2 — 0.25 ms measured against 0.20 ms predicted; the traffic is burstier than Poisson.**

$$W = \\frac{L}{\\lambda} = \\frac{5}{20000} = 2.5 \\times 10^{-4}\\ \\mathrm{s} = 0.25\\ \\mathrm{ms}$$

$$\\rho = \\frac{20000}{25000} = 0.8, \\qquad W_{\\mathrm{M/M/1}} = \\frac{1}{25000 - 20000} = 2.0 \\times 10^{-4}\\ \\mathrm{s}$$

The measurement is 25 % above the M/M/1 figure. Little's law is an identity and
cannot be wrong, so the discrepancy is in the *assumption*: arrivals more bursty
than Poisson, or service times more variable than exponential, both raise the
wait at the same utilisation.

*The trap.* Concluding that the counters are faulty. Little's law holds for any
discipline and any distribution; when a measurement disagrees with M/M/1, it is
M/M/1 that has been falsified, not the measurement.

**B3 — 1.5 ms mean, and buffers of 4.20 ms and 5.61 ms.**

Three exponential delays of mean 0.5 ms give $\\theta = 2000$ per second and an
Erlang distribution of order three:

$$E[X] = \\frac{3}{2000} = 1.5 \\times 10^{-3}\\ \\mathrm{s}$$

$$P(X > D) = e^{-\\theta D}\\left(1 + \\theta D + \\frac{(\\theta D)^{2}}{2}\\right)$$

Setting that to 0.01 and to 0.001 and solving numerically:

$$D_{1\\%} = 4.203\\ \\mathrm{ms}, \\qquad D_{0.1\\%} = 5.614\\ \\mathrm{ms}$$

*The trap.* Using the mean, or the mean plus a couple of standard deviations, as
the buffer. The mean is 1.5 ms and a buffer of that size loses roughly a third
of the stream; the tail, not the centre, sets the depth.

**B4 — about one loss in 1100, and 23.7 Mb/s on the short path.**

Invert the square-root law:

$$T = \\sqrt{\\frac{3}{2}}\\;\\frac{8\\,\\mathrm{MSS}}{\\mathrm{RTT}\\sqrt{p}} \\;\\Longrightarrow\\; \\sqrt{p} = \\sqrt{\\frac{3}{2}}\\;\\frac{8\\,\\mathrm{MSS}}{\\mathrm{RTT}\\,T}$$

$$\\sqrt{p} = 1.224745 \\times \\frac{11680}{0.1 \\times 4744000} = 0.030153, \\qquad p = 9.09 \\times 10^{-4}$$

Throughput varies exactly as $1/\\mathrm{RTT}$ at fixed loss, so a five-times
shorter path gives five times the throughput:

$$T_{20} = 5 \\times 4.744 = 23.72\\ \\mathrm{Mb/s}$$

*The trap.* Scaling the loss instead of the round trip. Loss enters under a
square root and the round trip does not, so a factor of five in RTT is worth a
factor of twenty-five in loss.

**B5 — 8.42 ms, 105,263 bytes, and 0.600 s of shaper delay.**

In byte terms the fill rate is 625,000 B/s and the peak is 12,500,000 B/s:

$$T_{\\max} = \\frac{b}{P - r} = \\frac{100000}{11875000} = 8.421\\ \\mathrm{ms}$$

$$B_{\\max} = P\\,T_{\\max} = 12500000 \\times 0.00842105 = 105263\\ \\text{bytes}$$

For the 500 kB object the shaper releases the last byte when the envelope
catches up with the arrivals, and the object finished arriving at
$500000/12500000 = 0.040$ s:

$$t_{\\mathrm{last}} = \\frac{500000 - 100000}{625000} = 0.640\\ \\mathrm{s}, \\qquad d = 0.640 - 0.040 = 0.600\\ \\mathrm{s}$$

*The trap.* Computing the burst allowance as $b/P$ rather than $b/(P-r)$. Tokens
keep arriving during the burst, so the bucket drains at the difference of the
rates, and ignoring the refill understates the allowed burst by 5.3 % here and
far more when $P$ and $r$ are close.

**B6 — 0.68 ms forward, 0.013 ms reverse, a forward delay near 3.93 ms, and RTT/2 wrong by 10.7 %.**

$$\\mu = \\frac{1.0 \\times 10^{8}}{12000} = 8333.33\\ \\text{packets/s}$$

$$W_{q}(0.85) = \\frac{0.85}{8333.33 \\times 0.15} = 6.80 \\times 10^{-4}\\ \\mathrm{s} = 0.680\\ \\mathrm{ms}$$

$$W_{q}(0.10) = \\frac{0.10}{8333.33 \\times 0.90} = 1.333 \\times 10^{-5}\\ \\mathrm{s} = 0.0133\\ \\mathrm{ms}$$

$$0.680 + 0.0133 = 0.693\\ \\mathrm{ms} \\approx 8.70 - 8.00 = 0.70\\ \\mathrm{ms}$$

The model accounts for the observed gap between mean and minimum, which is a
strong check. Now split the minimum. Propagation is 3.0 ms forward and 4.5 ms
reverse, totalling 7.5 ms of the 8.00 ms floor, so 0.50 ms of fixed
serialisation and processing remains; splitting it evenly gives

$$d_{\\mathrm{fwd}} \\approx 3.00 + 0.25 + 0.680 = 3.93\\ \\mathrm{ms}$$

$$\\frac{\\mathrm{RTT}}{2} = \\frac{8.70}{2} = 4.35\\ \\mathrm{ms}, \\qquad \\frac{4.35 - 3.93}{3.93} = 0.1069$$

*The trap.* Treating 4.35 ms as the forward one-way delay. It is 10.7 % too
large here, and the error is dominated by the 300 km of extra fibre on the
return path — a fact no round-trip measurement can reveal.`,
      examTip: 'The statistical half rewards checking one number against another. Little\'s law against a queueing formula, a measured mean against a predicted one, and a delay tail against a mean will each catch a wrong assumption. When the identity and the model disagree, it is always the model that is wrong.',
      importantNote: 'B6 shows the standard workflow for a real measurement: use the minimum round trip for the fixed path, the mean minus the minimum for total queueing, and a load estimate for each direction to split it. Half the round trip is a last resort, and on this path it overstates the forward one-way delay by 10.7 %.',
    },
  ],
  keyTakeaways: [
    'Total delay = propagation + transmission + queuing + processing.',
    'Transmission = packet_size/BW; propagation = distance/speed.',
    'Throughput limited by bottleneck (slowest) link.',
    'BDP = bandwidth * RTT; determines TCP window size.',
    'Jitter (delay variation) critical for real-time; worse than consistent high latency.',
    'QoS prioritizes voice/video; queueing delay grows as 1/(1 - utilisation), so its slope is a hundred times steeper at 95 % load than at 50 %.',
    'Bandwidth-delay product sets the window: a stepped simulation needs 335 packets to fill a 100 Mb/s, 40 ms path, against 333.33 from BDP alone.',
    'Goodput = rate x payload/wire footprint: 1460/1538 = 94.93 % on 1500-byte Ethernet, and only 67 % for a 160-byte voice sample.',
    'Link rates are decimal and file sizes are binary; mixing them costs 4.86 % at the mega scale and 7.37 % at the giga scale.',
    'A playout buffer is sized from a tail percentile, not from the RFC 3550 jitter estimate, which reads six times smaller on the same measured path.',
    'Throughput under congestion control goes as 1/(RTT sqrt(p)): the RTT dependence is exact, so the same loss costs a long path ten times more.',
    'A token bucket policer drops and a shaper delays; on the same 300 kB burst that was 127 dropped packets against 761 ms of added delay.',
    'RTT/2 is not the one-way delay: on a measured asymmetric path it was 22 % above the forward delay and 15 % below the reverse one.',
  ],
},

  /* ══════════════════════════════════════════════════════════════════
   * TOPIC 15 — DIGITAL SYSTEMS  (5 curriculum IDs)  ·  7–11 %
   * ══════════════════════════════════════════════════════════════════ */

};
