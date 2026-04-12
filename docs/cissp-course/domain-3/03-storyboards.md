# Domain 3 — Security Architecture and Engineering: Animation Storyboards

> AI-generated production briefs. 14 storyboards. Narration ~150 wpm.
> Domain 3 is the most animation-friendly domain because protocol flows
> and cryptographic primitives are inherently visual.

---

## Storyboard index

| # | Concept | Duration | Tool | Sub-obj |
|---|---|---|---|---|
| D3-01 | Reference monitor: always invoked, tamper-proof, verifiable | 95 s | After Effects | 3.4 |
| D3-02 | BLP vs Biba: no read up vs no read down | 110 s | Excalidraw + AE | 3.2 |
| D3-03 | Clark-Wilson: CDI-TP-IVP workflow | 100 s | After Effects | 3.2 |
| D3-04 | Brewer-Nash / Chinese Wall dynamic walls | 90 s | Lottie + AE | 3.2 |
| D3-05 | Symmetric vs asymmetric: when to use which | 130 s | Manim | 3.6 |
| D3-06 | ECB is broken (penguin demonstration) | 60 s | Manim | 3.6 |
| D3-07 | AEAD in one slide: AES-GCM flow | 120 s | Manim + AE | 3.6 |
| D3-08 | PKI certificate chain: root → intermediate → leaf | 145 s | After Effects | 3.6 |
| D3-09 | OCSP vs CRL vs Stapling | 110 s | After Effects | 3.6 |
| D3-10 | TPM measured boot chain | 115 s | Manim + AE | 3.4 |
| D3-11 | Padding oracle attack in slow motion | 140 s | Manim | 3.7 |
| D3-12 | Zero trust architecture (NIST SP 800-207) | 135 s | After Effects | 3.1 |
| D3-13 | Post-quantum crypto: why now | 125 s | After Effects | 3.6 |
| D3-14 | Data center fire suppression decision tree | 100 s | After Effects | 3.9 |

Total runtime: ~26 minutes.

---

## D3-01 · Reference Monitor (95 s)

**Learning objective:** Learner can name the three reference-monitor
requirements and identify violations in a scenario.

**Scenes:**

| # | Visual | Narration |
|---|---|---|
| 1 | Abstract diamond shape labeled "Reference Monitor" between a Subject and an Object. All subject→object arrows pass through. | "A reference monitor is an abstract machine that mediates every access between subjects and objects. Every access. No exceptions." |
| 2 | Three pillars appear: "Always Invoked", "Tamper-Proof", "Verifiable". | "Three requirements. First: always invoked. There is no bypass. Every request hits the monitor." |
| 3 | Tamper-proof pillar glows; a shield appears around the monitor. | "Second: tamper-proof. The monitor itself cannot be modified without detection. If an attacker can rewrite the access logic, the monitor is broken." |
| 4 | Verifiable pillar glows; a small, simple blueprint appears. | "Third: verifiable. The monitor must be small enough and simple enough to be thoroughly analyzed and tested. If it is too big, you cannot prove it works." |
| 5 | A scenario card: "A privileged user can disable the access-check middleware in production." An X lands on Always Invoked. | "If a privileged user can disable the check — complete mediation is violated. On the exam, this maps to 'always invoked'." |
| 6 | Scenario card: "The auth module is 200,000 lines of code with no unit tests." An X lands on Verifiable. | "If the monitor is too large to analyze, it cannot be verified. The exam tests this as a violation of the 'verifiable' requirement." |

**Assessment hook:** Given a scenario, which reference-monitor property is
violated?

---

## D3-02 · BLP vs Biba (110 s)

**Learning objective:** Learner can apply "no read up / no write down"
(BLP) and "no read down / no write up" (Biba) correctly.

**Scenes:**

| # | Visual | Narration |
|---|---|---|
| 1 | A classified-network scene: Top Secret, Secret, Confidential, Unclassified vertical bands. | "BLP is about confidentiality. We want secrets to stay secret." |
| 2 | A Confidential user reaches up to Top Secret and is blocked. | "No read up. A user at Confidential cannot read Top Secret. Why: because it would leak secrets downward." |
| 3 | A Top Secret user writes down to Confidential and is blocked. | "No write down. A user at Top Secret cannot write to Confidential. Why: because the writer might leak Top Secret content into a lower-classification channel." |
| 4 | Scene changes to medical records: integrity labels High / Medium / Low. | "Biba is about integrity. We want trusted data to stay trusted." |
| 5 | A Low-integrity user reads up from High and is blocked. | "No read down. A High-integrity user does not consume data from a Low-integrity source, because it could corrupt their decisions. This rule reverses BLP's read direction." |
| 6 | A Low-integrity user writes up to High and is blocked. | "No write up. A Low-integrity actor cannot modify High-integrity data. This also reverses BLP." |
| 7 | Summary card: BLP protects confidentiality; Biba protects integrity. | "BLP: no read up, no write down, for secrets. Biba: no read down, no write up, for trust. Memorize the reversal." |

**Assessment hook:** Given a scenario describing a military network vs a
medical records system, pick the correct model.

---

## D3-03 · Clark-Wilson (100 s)

**Learning objective:** Learner can recognize the CDI / TP / IVP roles
and match Clark-Wilson to commercial integrity scenarios.

**Scenes:**

| # | Visual | Narration |
|---|---|---|
| 1 | A bank ledger labeled CDI (Constrained Data Item). | "Clark-Wilson starts with constrained data items. A ledger. An inventory. A customer record. Things whose integrity matters." |
| 2 | A middleware function labeled TP (Transformation Procedure) between a user and the CDI. | "Every change to the CDI goes through a Transformation Procedure. A TP is a well-formed transaction that preserves integrity — validated inputs, atomic writes, audit logging." |
| 3 | An authenticated user crosses to the TP, then to the CDI. | "Only authenticated subjects can invoke TPs. Each TP is limited to specific subject-CDI combinations." |
| 4 | An IVP (Integrity Verification Procedure) runs periodically across the CDIs. | "Integrity Verification Procedures run separately, checking that CDIs are still in a consistent state. If they're not, something bypassed the TP and we have a problem." |
| 5 | Summary: "Subject + TP + CDI + IVP = Clark-Wilson integrity." | "That is Clark-Wilson. Commercial integrity. Maker-checker workflows. Financial systems. Audit trails. Whenever the scenario is 'prevent tampering with records', think Clark-Wilson." |

---

## D3-04 · Brewer-Nash / Chinese Wall (90 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Two client files: Client A and Client B, both in the consulting firm's vault. | "An audit firm has multiple clients. Some are competitors. Integrity requires that no consultant sees data from two competing clients." |
| 2 | A consultant accesses Client A. A wall appears between the consultant and Client B. | "The moment the consultant touches Client A's data, a wall forms. Brewer-Nash. The consultant is now blocked from Client B's competitive data — permanently, for the scope of this conflict class." |
| 3 | A different consultant accesses Client B. A separate wall forms. | "Another consultant can take Client B. The walls are per-subject. Different subjects can service competitors independently." |
| 4 | Scenario: "A consulting firm is asked to audit two competing investment banks." | "Brewer-Nash is the answer when the exam gives you audit firms, consulting, or investment banking scenarios where conflict of interest is the concern." |

---

## D3-05 · Symmetric vs Asymmetric (130 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Two scenes: (a) a conveyor belt of file blocks being encrypted quickly with one key; (b) two parties exchanging a small message with two different keys. | "Two families of crypto. Symmetric uses one key for encryption and decryption. Fast. Asymmetric uses a key pair. Slower — typically 1000x or more." |
| 2 | Use cases for symmetric: bulk encryption, TLS session traffic, disk encryption. | "Symmetric is for bulk data. Disk encryption. Database encryption. TLS session data. Any time speed matters and both parties already have a shared key." |
| 3 | Use cases for asymmetric: key exchange, digital signatures, authentication. | "Asymmetric is for key exchange and signatures. Exchange a symmetric key securely over a public channel. Sign a document so that only one private key could have produced the signature. Authenticate a party in a protocol handshake." |
| 4 | Hybrid: TLS handshake using asymmetric to exchange a symmetric session key, then symmetric for the data. | "Most real protocols are hybrid. TLS uses asymmetric (RSA or ECDH) to establish a session key, then symmetric (AES-GCM or ChaCha20-Poly1305) for the actual data." |
| 5 | Memory hook: "Symmetric for bulk, asymmetric for key exchange and signatures." | "That sentence covers 80% of CISSP crypto questions. Symmetric for bulk. Asymmetric for key exchange and signatures." |

---

## D3-06 · ECB is broken (60 s)

The famous "encrypted penguin" demonstration, animated.

| # | Visual | Narration |
|---|---|---|
| 1 | A Linux penguin image. | "Here's our plaintext: a photo of Tux." |
| 2 | Encrypted with AES-ECB. The silhouette is still visible. | "Encrypted with AES-ECB. Notice that the silhouette is still visible. Why? Because ECB encrypts each 16-byte block independently, so identical blocks produce identical ciphertext." |
| 3 | Encrypted with AES-CBC (same key). Now it is noise. | "Same key, CBC mode. Now it's noise. The previous block's ciphertext is XORed with the next block's plaintext, so identical inputs produce different outputs." |
| 4 | Title: "ECB is broken for anything with patterns. Do not use." | "The exam tests this explicitly. ECB is broken for any data with patterns. Do not use it. Use CBC if you must, GCM if you can." |

---

## D3-07 · AEAD in one slide — AES-GCM (120 s)

| # | Visual | Narration |
|---|---|---|
| 1 | A plaintext block on the left. A key icon. A nonce icon. AAD (associated data) icon. | "AES-GCM takes four inputs: plaintext, key, nonce, and associated data." |
| 2 | The plaintext is encrypted with AES-CTR, producing ciphertext. | "Internally it uses AES in counter mode to encrypt the plaintext." |
| 3 | A parallel track computes GHASH over the ciphertext and AAD, producing a 128-bit authentication tag. | "In parallel, it computes an authentication tag over the ciphertext and the associated data. This tag proves both integrity and authenticity." |
| 4 | Output: ciphertext + tag + nonce. | "Output: ciphertext, tag, and nonce. The recipient verifies the tag before decrypting." |
| 5 | Warning: "Nonce reuse is catastrophic in GCM." | "One critical rule. Never reuse a nonce with the same key in GCM. If you do, an attacker can recover the authentication key and forge messages. This is the most dangerous failure mode of AEAD." |
| 6 | Summary: "AES-GCM gives you confidentiality, integrity, and authenticity in one step." | "That's AEAD. Confidentiality, integrity, authenticity — in one primitive, one pass. It's why TLS 1.3 mandates AEAD ciphers." |

---

## D3-08 · PKI Certificate Chain (145 s)

| # | Visual | Narration |
|---|---|---|
| 1 | A trust store with several root certificates. | "Every TLS client starts with a trust store — a set of root certificates it trusts unconditionally. Browsers, OSes, and libraries all maintain these." |
| 2 | A web server presents its certificate. | "You connect to a server. The server presents its certificate, signed by an intermediate CA." |
| 3 | The server also presents the intermediate certificate. | "The server also presents the intermediate CA's certificate, signed by the root." |
| 4 | The client walks the chain: leaf → intermediate → root, matching against the trust store. | "Your client walks the chain. Does the leaf's signature match the intermediate's public key? Does the intermediate's signature match a root in the trust store? If yes on both, the chain is valid." |
| 5 | A revoked certificate scenario. OCSP check happens. | "But validity isn't just about signatures. The certificate could be revoked. The client checks revocation status via OCSP or a CRL." |
| 6 | Subject, issuer, validity, public key fields highlighted in the X.509 certificate. | "Each certificate contains the subject, the issuer, the validity period, the public key, and the signature. X.509 is the format standard." |
| 7 | Architecture: offline root, online intermediate. | "Mature PKIs keep the root offline. Only the intermediates are online. That way, a compromise of an intermediate does not compromise the root, and revocation of a compromised intermediate is feasible." |

---

## D3-09 · OCSP vs CRL vs Stapling (110 s)

| # | Visual | Narration |
|---|---|---|
| 1 | A relying party (browser) trying to check whether a cert has been revoked. | "Three ways to check revocation. Each has trade-offs." |
| 2 | CRL: a large file downloaded periodically from the CA. | "Option one: CRL. The CA publishes a list of revoked certificates, the client downloads it periodically. Simple but slow to update and bandwidth-heavy." |
| 3 | OCSP: a real-time query from the client to the CA's OCSP responder. | "Option two: OCSP. The client queries the CA in real time for the specific certificate's status. Timely but creates a load spike on the CA and leaks browsing activity to the CA." |
| 4 | OCSP stapling: the server fetches the OCSP response periodically and includes it in the TLS handshake. | "Option three: OCSP stapling. The server periodically fetches its own OCSP response and attaches it to every TLS handshake. Fast, privacy-preserving, and reduces CA load." |
| 5 | Summary table. | "Stapling is the modern default. CRL is legacy but still supported. OCSP without stapling is problematic at scale and is being deprecated in major browsers." |

---

## D3-10 · TPM Measured Boot (115 s)

| # | Visual | Narration |
|---|---|---|
| 1 | A computer booting. Each stage (BIOS, bootloader, kernel, initramfs) labeled. | "Measured boot creates a chain of hashes, each stage measuring the next before handing control." |
| 2 | BIOS hashes the bootloader and extends a PCR. | "BIOS hashes the bootloader and extends Platform Configuration Register 0 with the hash. PCR extension is a one-way operation." |
| 3 | Bootloader hashes the kernel and extends another PCR. | "Bootloader hashes the kernel and extends PCR 4. Each stage adds to the chain." |
| 4 | Kernel hashes modules and extends PCR 9. | "Kernel extends PCR 9 with module and initramfs hashes." |
| 5 | Remote attestation: a relying party asks for PCR values, TPM signs them with an attestation key. | "A remote party asks the TPM to sign its PCR values with the attestation key. If the values match expected measurements, the platform is in a known-good state." |
| 6 | Summary: "Measured boot answers 'am I still me?' for a running system." | "Measured boot lets a remote relying party verify the platform booted to a trusted state. It is the foundation of trusted computing." |

---

## D3-11 · Padding Oracle Attack (140 s)

| # | Visual | Narration |
|---|---|---|
| 1 | A CBC-mode ciphertext block. The client sends it to a server. | "A padding oracle attack exploits a single information leak: whether the server thinks the plaintext padding is valid or invalid." |
| 2 | The attacker flips bits in the preceding ciphertext block. The server returns 'padding invalid' or 'padding valid'. | "The attacker flips bits in the preceding ciphertext block. The server decrypts and checks the padding. A 'valid padding' response tells the attacker something." |
| 3 | Over many iterations, the attacker systematically recovers each byte of the plaintext. | "Byte by byte, the attacker recovers the plaintext. No key. No crypto math. Just one bit of information leaking from the server repeatedly." |
| 4 | Summary: "Defense: AEAD ciphers, or constant-time padding checks with MAC-then-encrypt inverted to encrypt-then-MAC." | "The defense is AEAD. GCM or Poly1305 does not leak padding status because there is no padding. The attack is why TLS 1.3 removed CBC." |

---

## D3-12 · Zero Trust Architecture (135 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Old perimeter-based architecture: castle wall, inside trusted, outside untrusted. | "The old model: trust inside the network, distrust outside. Castle and moat." |
| 2 | The wall disintegrates. Internal attackers, cloud services, remote workers, BYOD. | "The wall has broken. Internal attackers exist. Services run in cloud. Workers are remote. Devices are not corporate-managed. The moat is gone." |
| 3 | NIST SP 800-207 architecture: Policy Engine, Policy Administrator, Policy Enforcement Point. Continuous trust evaluation for every request. | "Zero trust answers this with continuous evaluation. Every request is authenticated and authorized against the current state of the subject, device, and context. NIST SP 800-207 defines the architecture: Policy Engine decides, Policy Administrator issues, Policy Enforcement Point enforces." |
| 4 | A user request flows: identity → device posture → context → policy decision → resource. | "For each request: who is the user, what device, what state, what context, does policy permit? If yes, grant — but only for this request. Next request, re-evaluate." |
| 5 | Summary: "Zero trust is an architecture, not a product. NIST SP 800-207 is the standard." | "It is an architecture, not a product. Vendors sell components. You assemble a zero trust implementation over many years." |

---

## D3-13 · Post-Quantum Crypto (125 s)

| # | Visual | Narration |
|---|---|---|
| 1 | A clock ticking. A quantum computer icon appears on the horizon. | "Shor's algorithm on a sufficiently large quantum computer breaks RSA, DH, and ECC. Most experts think we are a decade or more away. But 'harvest now, decrypt later' means data encrypted today with classical algorithms may be decrypted in the future." |
| 2 | NIST PQC standards, finalized August 2024: ML-KEM (FIPS 203), ML-DSA (FIPS 204), SLH-DSA (FIPS 205). | "NIST finalized the first post-quantum standards in August 2024. ML-KEM for key encapsulation, ML-DSA for signatures, SLH-DSA as a stateless hash-based signature option. Falcon is coming." |
| 3 | A diagram of hybrid key exchange: classical ECDH combined with ML-KEM. | "Transition is via hybrid: use classical and post-quantum in parallel so that if one is broken, the other still protects. TLS libraries are already implementing hybrid key exchange." |
| 4 | Summary: "Start planning now. Crypto-agility is the deliverable." | "The CISO's job is crypto-agility: inventory where you use public-key crypto, know how to swap it, prioritize high-value long-lived data first." |

---

## D3-14 · Data Center Fire Suppression (100 s)

| # | Visual | Narration |
|---|---|---|
| 1 | A data center with racks. Options: wet pipe, dry pipe, pre-action, inert gas, halocarbon. | "Four main fire suppression choices for data centers. Each has trade-offs." |
| 2 | Wet pipe: water always charged. Simple, fast, but false-discharge risk. | "Wet pipe: water sitting in the pipes, ready to release on head activation. Simple and fast. Biggest risk: a false activation floods the data center." |
| 3 | Dry pipe: air in pipes until activation. Slower. | "Dry pipe: the pipes hold air until a head opens. Slower, but less false-discharge risk. Common in colder climates where wet pipes would freeze." |
| 4 | Pre-action: requires both smoke detection AND head activation. | "Pre-action: both smoke detection and head activation required before water enters the pipes. Combines safety with speed. Common in mission-critical data centers." |
| 5 | Inert gas (Inergen, FE-13) / halocarbon (FM-200, Novec 1230). | "Inert gas or halocarbon systems: flood the room with a non-reactive gas that stops combustion without damaging electronics. Expensive but the only option for zero-water environments." |
| 6 | Summary: "Pre-action + VESDA + gas combination is the modern high-end design." | "Modern hyperscale data centers combine pre-action sprinklers with very-early smoke detection and gas backup. Defense in depth, even for fire." |
