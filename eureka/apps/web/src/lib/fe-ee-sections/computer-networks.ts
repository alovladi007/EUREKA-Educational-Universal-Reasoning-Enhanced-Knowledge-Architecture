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
the *subnet* bits borrowed from the host portion — value binary 10, so this is
subnet number 2 of the four the /26 creates.

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
| 3 | B (50 hosts) | /26 | .64 | .64 works, but .48 to .63 is now stranded |
| 4 | A (100 hosts) | /25 | .128 | fits, with nothing left over |

Sixteen addresses at .16 and sixteen at .48 are stranded — too small for any
remaining department and not contiguous with anything else. Largest-first
allocation avoids this because a large block placed at the bottom always
leaves an aligned boundary for the next-smaller block to start on.

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
address**, its role taken by multicast (ff00::/8) and anycast, and the
all-zeros and all-ones host patterns are not reserved, so a /64 really does
hold 2^64 usable addresses.

| Special address | IPv4 equivalent | Purpose |
|---|---|---|
| ::1 | 127.0.0.1 | Loopback |
| fe80::/10 | 169.254.0.0/16 | Link-local, auto-configured |
| ff00::/8 | 224.0.0.0/4 | Multicast |
| :: | 0.0.0.0 | Unspecified source before configuration |`,
      examTip: 'To summarise a set of networks, write the varying octet in binary and count the leading bits they all share; the prefix length is that count plus the bits before the octet. The aggregate must also start on a multiple of its own block size.',
      importantNote: 'The :: compression may appear only ONCE in an IPv6 address, because two runs of zeros collapsed the same way could not be expanded unambiguously. DHCP uses UDP 67 (server) and 68 (client); a 169.254.x.x address means DHCP failed.',
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
layout. Take one switch with eight ports: three ports each feed a four-port
hub, five ports feed a host directly, and the switch uplinks to a router
interface.

| Question | Count | Reasoning |
|---|---|---|
| Hosts | 17 | 3 hubs × 4 hosts + 5 direct |
| Collision domains | **9** | Each hub is one shared segment (3), each directly switched port is its own (5), plus the uplink (1) |
| Broadcast domains | **1** | One router interface, no VLANs — every host sees every broadcast |
| Broadcast domains with 3 VLANs | **3** | A VLAN is a broadcast domain, whether or not a router is involved |

The hub-versus-switch distinction is the whole point: the twelve hosts behind
hubs contend with three other stations each, while the five switched hosts
contend with nobody and can run full duplex. Replacing the three hubs with
switches would take the collision-domain count to 17 and eliminate CSMA/CD
entirely — which is what actually happened to Ethernet, and why collision
arithmetic is now a historical topic rather than an operational one.`,
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
rate would have to fall to **0.0099 %**, a hundredfold improvement. It is the
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

Between 10 % and 80 % utilisation the queueing delay grows by a factor of 37;
between 90 % and 99 % it grows by a factor of 11 again, over a load increase
of only 10 %. The 1/(1 − ρ) term is a vertical asymptote at ρ = 1, and that is
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

![Achievable throughput against send-window size on a 1 Gbps path, for round-trip times of 20 and 100 milliseconds, on logarithmic axes. Each curve rises linearly with the window and then flattens at the link rate; the knee falls exactly at the bandwidth-delay product, 2.5 MB at 20 ms and 12.5 MB at 100 ms. A 64 KB window caps the path at 26.2 and 5.2 Mbps respectively.](/courses/fe-ee/figures/net-window-throughput.svg)

The knee of each curve is the **bandwidth-delay product**, and its position is
not a coincidence: the window that first saturates the link is exactly the
number of bits the pipe holds. Below the knee the window is the constraint and
throughput is proportional to it; above the knee the link is the constraint
and a larger window buys nothing but buffer occupancy.

This is why the historical 16-bit TCP window field became a problem. 64 KB was
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
