# Domain 4 — Communication and Network Security: Lesson Plan

> **AI-generated study material.** (ISC)² CISSP Exam Outline effective
> April 15, 2024. Domain weight: **13%**.
>
> Topic IDs: `cissp_network`, `cissp_protocols`, `cissp_wireless_net`,
> `cissp_network_attacks` (see `eureka/apps/web/src/lib/exam-curriculum.ts:449-454`).

---

## 1. Domain summary

Domain 4 is the network domain. It covers OSI/TCP-IP layering,
secure network design, secure communications protocols, wireless and
remote access, network-based attacks, and network defense. Like
Domain 3, it is technically dense; unlike Domain 3, the questions
lean more toward applied scenarios than pure primitive selection.

Mantra: **"Segment, authenticate, encrypt, monitor — in that order."**
Every network design question rewards candidates who recognize that
segmentation is the foundational control, authentication and
encryption protect the traffic that must cross segments, and
monitoring detects what the other controls miss.

## 2. Learning objectives

| # | LO | Bloom |
|---|---|---|
| LO4.1 | **Apply** OSI and TCP/IP models to attack/defense analysis. | Apply |
| LO4.2 | **Design** network segmentation and micro-segmentation strategies. | Create |
| LO4.3 | **Select** secure protocols (TLS 1.3, IPsec, SSH, DNSSEC, S/MIME, WPA3, 802.1X). | Evaluate |
| LO4.4 | **Analyze** network attacks (spoofing, sniffing, session hijacking, DDoS, DNS poisoning, MITM, ARP poisoning, rogue AP, VLAN hopping) and select defenses. | Analyze |
| LO4.5 | **Differentiate** VPN topologies (site-to-site, remote access, SSL VPN, IPsec tunnel vs transport). | Analyze |
| LO4.6 | **Evaluate** cloud network architecture (VPCs, security groups, NACLs, service mesh, CASB, SASE, ZTNA). | Evaluate |
| LO4.7 | **Compare** defense-in-depth controls at L2 (MAC filtering, port security, DAI), L3 (ACLs, firewalls), L4 (stateful inspection), L7 (WAF, IDS/IPS). | Analyze |

## 3. Estimated study hours

13 hours (1 hr/1%). 5 hr notes, 1 hr animations, 2 hr worked examples
(pcap analysis, ACL design, VPN tunnel selection), 2.5 hr QBank, 2.5
hr mini-mock + SR.

## 4. Sequenced path

Pre-read → diagnostic → animation → notes → pcap lab → ACL lab →
VPN lab → QBank → mini-mock → SR.

## 5. Knowledge checkpoints

| CP | After | Focus |
|---|---|---|
| CP-1 | 4.1, 4.2 | OSI/TCP, secure design |
| CP-2 | 4.3, 4.4 | Secure protocols, components |
| CP-3 | 4.5, 4.6 | VPNs, wireless, remote access |

## 6. Labs

- **Lab 4.A — Wireshark pcap analysis.** Given 5 capture files,
  identify the attack (ARP poisoning, DNS spoofing, SYN flood, port
  scan, TLS downgrade).
- **Lab 4.B — ACL design.** Given a network topology with specified
  allowed flows, write a minimal ACL.
- **Lab 4.C — VPN selection.** Given 6 scenarios, pick site-to-site
  IPsec vs remote-access SSL VPN vs WireGuard vs ZTNA, justifying.
- **Lab 4.D — Firewall ruleset review.** Review a 30-line ruleset for
  redundancy, ordering errors, and excess permissiveness.

## 7. Discussion prompts

1. "Why did SSL VPNs win over IPsec remote-access VPNs?"
2. "Is 'defense in depth' just 'more firewalls', or is it something
   richer?"
3. "SASE/SSE and ZTNA — marketing or meaningful architectural shift?"
4. "Where does DNS belong in the CISSP threat model — is it still a
   layer-7 problem now that DoH/DoT exist?"
5. "WPA3 fixes most WPA2 problems but rollout has been slow. Why?"

## 8. Readiness gate

- [ ] Notes first pass complete
- [ ] Labs met standard
- [ ] QBank ≥ 75%
- [ ] Mini-mock ≥ 70% timed
- [ ] θ pass prob ≥ 0.65

## 9. Differentiators

- Breach anchors: Mirai 2016 (IoT DDoS), KRACK 2017 (WPA2), DNS hijacks
  of 2019, SolarWinds 2020 (lateral movement), MOVEit 2023 (SQL
  injection via internet-facing service).
