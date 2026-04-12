# Domain 5 — IAM: Animation Storyboards

> 10 storyboards. Narration ~150 wpm.

| # | Concept | Duration | Tool |
|---|---|---|---|
| D5-01 | IAAA — Identification, Authentication, Authorization, Accountability | 90 s | AE |
| D5-02 | Authentication factors (know/have/are/do/somewhere) | 85 s | Lottie + AE |
| D5-03 | Why FIDO2 beats TOTP against phishing | 120 s | Manim + AE |
| D5-04 | Kerberos flow: AS-REQ → TGT → TGS-REQ → service ticket | 150 s | Manim |
| D5-05 | Kerberoasting attack in slow motion | 115 s | Manim |
| D5-06 | SAML SP-initiated login flow | 120 s | AE |
| D5-07 | OAuth 2.0 Authorization Code + PKCE | 130 s | Manim |
| D5-08 | OIDC vs OAuth: AuthN vs AuthZ | 95 s | AE |
| D5-09 | Access control models: DAC / MAC / RBAC / ABAC | 130 s | AE |
| D5-10 | PAM: JIT + vault + session recording | 110 s | AE |

---

## D5-01 · IAAA (90 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Four boxes: Identification, Authentication, Authorization, Accountability | "Four steps. Every IAM system does these in order." |
| 2 | User enters username. | "Identification: you claim an identity. No security yet — anyone can claim any username." |
| 3 | User proves the claim (password + token). | "Authentication: you prove the claim. Factors combine to defeat guessing and theft." |
| 4 | System checks what this identity can do. | "Authorization: the system looks up what this identity is permitted to do and enforces the policy." |
| 5 | Audit log records the event. | "Accountability: the action is logged with attribution. Without audit logs, the other three are unverifiable." |

## D5-02 · MFA Factor Types (85 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Five icons: brain (know), key (have), fingerprint (are), pen (do), map pin (somewhere) | "Five factor types." |
| 2 | Password | "Know: password, PIN, passphrase." |
| 3 | Hardware token | "Have: hardware token, smart card, phone." |
| 4 | Fingerprint | "Are: fingerprint, face, iris." |
| 5 | Signature | "Do: signature, typing rhythm, gesture." |
| 6 | Map pin | "Somewhere: GPS, IP geolocation — weaker, reintroduces perimeter thinking." |
| 7 | Two-password example with a big red X | "Two passwords is not MFA. Same factor type." |
| 8 | Password + token = valid MFA | "Password plus token is MFA. Different types." |

## D5-03 · FIDO2 vs TOTP against Phishing (120 s)

| # | Visual | Narration |
|---|---|---|
| 1 | User typing password + TOTP into a phishing site. | "Here's the attack. Phishing site. Real-looking login page. User enters password and TOTP code." |
| 2 | Phishing site relays credentials to the real site in real time. | "The phishing site relays the credentials to the real site in real time. It logs in as the user." |
| 3 | TOTP was bypassed — the code was valid for the session. | "TOTP didn't save the user. The code was valid, and the phishing site used it before it expired." |
| 4 | FIDO2 scene: user touches token on phishing site. | "Now FIDO2. Same phishing site. User touches their token." |
| 5 | The FIDO2 token sees that the origin is 'phishing-site.com', not the real site. It cryptographically refuses. | "The token cryptographically binds authentication to the real origin. 'phishing-site.com' is not the real origin. The token refuses. The attack fails." |
| 6 | Summary: "FIDO2 is phishing-resistant by design." | "That's why CISA and NIST push FIDO2 and WebAuthn as the minimum bar for high-assurance authentication." |

## D5-04 · Kerberos Flow (150 s)

| # | Visual | Narration |
|---|---|---|
| 1 | Client, KDC (AS + TGS), Service | "Kerberos has three parties: client, KDC, and service. KDC is split into AS and TGS." |
| 2 | AS-REQ: client sends username and timestamp encrypted with password-derived key. | "Step 1: client sends AS-REQ. Username plus a timestamp encrypted with a key derived from the password. AS decrypts — if it works, the user knows the password." |
| 3 | AS-REP: AS issues TGT (encrypted with KDC key) + session key. | "AS issues a TGT encrypted with the KDC's long-term secret, plus a session key." |
| 4 | Client presents TGT to TGS with service name. | "Client presents the TGT to TGS with the desired service name. TGS verifies the TGT." |
| 5 | TGS issues service ticket encrypted with service's secret. | "TGS issues a service ticket encrypted with the service account's secret." |
| 6 | Client presents service ticket to service. | "Client presents the ticket. Service decrypts and grants access." |
| 7 | Summary: no passwords on the wire, mutual authentication, time-bound tickets. | "No passwords cross the wire. Clocks must be synchronized (Kerberos is sensitive to time skew). Tickets are time-bound. This has been the backbone of enterprise authentication for decades." |

## D5-05 · Kerberoasting (115 s)

| # | Visual | Narration |
|---|---|---|
| 1 | An AD domain with several service accounts, each with an SPN. | "Service accounts with SPNs are Kerberoastable." |
| 2 | Attacker (authenticated domain user) requests service tickets for each SPN. | "Attacker requests service tickets for every SPN they can find. This is normal AD traffic — no privilege needed beyond ordinary domain-user access." |
| 3 | KDC issues tickets encrypted with the service accounts' password-derived keys. | "KDC issues each ticket. Each ticket is encrypted with the key derived from the service account's password." |
| 4 | Attacker takes tickets offline and runs hashcat to crack the passwords. | "Attacker takes the tickets offline and runs hashcat against them. Weak service account passwords crack quickly." |
| 5 | Defenses: strong passwords (25+ characters), gMSA, restrict SPN accounts. | "Defenses: strong service account passwords, group Managed Service Accounts that rotate automatically, and eliminating SPNs where not needed. Also monitor for bulk TGS-REQ activity." |

## D5-06 · SAML SP-Initiated Login (120 s)

| # | Visual | Narration |
|---|---|---|
| 1 | User visits SP (SaaS app) without a session. | "User visits a SaaS app. No session." |
| 2 | SP redirects user to IdP with a SAML AuthnRequest. | "SP redirects the browser to the IdP with a SAML AuthnRequest embedded in the URL or POST body." |
| 3 | IdP authenticates user (password + MFA). | "IdP authenticates the user. Password plus MFA. The authentication happens at the IdP, not the SP — the SP never sees credentials." |
| 4 | IdP generates signed SAML assertion and POSTs it to SP via the browser. | "IdP generates a signed SAML assertion containing the user's identity and attributes. Posts it to the SP via the browser." |
| 5 | SP validates signature against IdP's public key, creates local session. | "SP validates the signature. Creates a local session. User is logged in. The assertion is the trust currency — nothing else is needed." |

## D5-07 · OAuth 2.0 Authorization Code + PKCE (130 s)

| # | Visual | Narration |
|---|---|---|
| 1 | User, client app, authorization server, resource server. | "OAuth Authorization Code flow with PKCE. Four parties." |
| 2 | Client generates a code verifier and a code challenge (hash of verifier). | "Client generates a random code verifier and hashes it into a code challenge." |
| 3 | Client redirects user to authorization server with the code challenge. | "Client redirects user to the authorization server, including the code challenge." |
| 4 | User authenticates and consents. | "User authenticates and consents to the requested scopes." |
| 5 | Authorization server redirects user back to client with an authorization code. | "Authorization server redirects back to the client with an authorization code." |
| 6 | Client exchanges code plus code verifier for an access token. | "Client sends the code and the original code verifier to the authorization server's token endpoint. Authorization server verifies the hash matches the earlier challenge, then issues the access token." |
| 7 | Client uses access token to call resource server. | "Client uses the access token to call the resource server. PKCE prevents a malicious app intercepting the code from exchanging it — because it doesn't have the verifier." |

## D5-08 · OIDC vs OAuth (95 s)

| # | Visual | Narration |
|---|---|---|
| 1 | OAuth 2.0 box: access token for a resource | "OAuth 2.0 gives you an access token. That token authorizes access to a resource. It tells you nothing about who the user is." |
| 2 | App checking 'is this user logged in?' against an access token. Red X. | "Using an OAuth access token to authenticate a user is a common bug. OAuth is about delegation, not identity." |
| 3 | OIDC adds an ID Token — a signed JWT that asserts identity. | "OIDC layers authentication on top by adding an ID Token. The ID Token is a signed JWT that asserts the user's identity." |
| 4 | Client validates the ID Token signature and treats the user as authenticated. | "Client validates the signature against the issuer's public key. Now the client knows who the user is. This is authentication." |
| 5 | Summary: "OAuth 2.0 authorizes. OIDC identifies." | "OAuth 2.0 authorizes. OIDC identifies. Use OIDC when you need to know who the user is. Use OAuth when you need to act on their behalf against an API." |

## D5-09 · Access Control Models (130 s)

| # | Visual | Narration |
|---|---|---|
| 1 | DAC: a file with a padlock and an owner icon. | "DAC: owner decides who can access. Windows file permissions, Linux chmod. Flexible but error-prone." |
| 2 | MAC: classified document with a label 'SECRET'. System enforces clearance check. | "MAC: system enforces labels. No owner override. Classified environments, SELinux in enforcing mode. Strong but inflexible." |
| 3 | RBAC: users assigned to roles (admin, developer, reader). Each role has permissions. | "RBAC: users are assigned to roles. Each role has permissions. Scales well to thousands of users." |
| 4 | ABAC: a policy engine evaluating attributes of subject, resource, action, environment. | "ABAC: policy engine evaluates attributes of subject, resource, action, and environment. 'Allow if subject.department == resource.department and environment.time < 6pm'. Most flexible, hardest to audit." |
| 5 | Summary: DAC flexible, MAC strict, RBAC scales, ABAC dynamic. | "Pick the model that matches the scenario. Government classified: MAC. Enterprise with hundreds of apps: RBAC. Cloud and modern apps: ABAC." |

## D5-10 · PAM Design (110 s)

| # | Visual | Narration |
|---|---|---|
| 1 | An admin user without PAM: permanent admin access everywhere. | "Traditional model: admin users have permanent domain admin rights. If a credential is stolen, the attacker has full access." |
| 2 | PAM model: admin requests access through a vault for a specific time window. | "PAM: admin submits a request through the vault. 'I need Server-Alpha admin access for 2 hours to perform patching.'" |
| 3 | Approval workflow triggers a second approver. | "Approval workflow: a second authorized approver reviews and approves." |
| 4 | Vault issues a temporary credential; session is launched through the bastion with recording. | "Vault issues a temporary credential — or connects the admin directly through a bastion without revealing the credential at all. Session is recorded. Keyboard and screen are captured." |
| 5 | Timer expires, credential is revoked, session ends. | "When the window expires, credential is revoked. Session ends. The admin had exactly the access needed, for the time needed, under oversight. This is the defense against credential theft, lateral movement, and insider misuse." |
