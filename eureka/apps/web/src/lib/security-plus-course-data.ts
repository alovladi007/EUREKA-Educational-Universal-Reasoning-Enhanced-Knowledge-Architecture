/**
 * Complete CompTIA Security+ (SY0-701) course content.
 * 29 topics across 5 domains, with detailed sections, exam tips, and quiz questions.
 */

import type { QuizQuestion } from '@/components/test-prep/cissp/LessonQuiz';

export interface LessonSection {
  id: string;
  title: string;
  content: string;
  examTip?: string;
  importantNote?: string;
  quiz?: QuizQuestion[];
}

export interface TopicLesson {
  topicId: string;
  title: string;
  domainWeight: string;
  overview: string;
  sections: LessonSection[];
  keyTakeaways?: string[];
}

export const SECURITY_PLUS_COURSE: Record<string, TopicLesson> = {

// ═══════════════════════════════════════════════════════════════
// DOMAIN 1 — Threats, Vulnerabilities & Attacks (24%)
// ═══════════════════════════════════════════════════════════════

sp_malware: {
  topicId: 'sp_malware',
  title: `Malware Types & Indicators`,
  domainWeight: '24%',
  overview: `Malware is any software intentionally designed to cause damage, steal data, or gain unauthorized access to systems. Understanding malware types, propagation methods, and indicators of compromise is essential for both the Security+ exam and real-world defense. This topic covers the full spectrum of malicious software, from traditional viruses to modern fileless and polymorphic threats.`,
  sections: [
    {
      id: 'malware-types',
      title: `1. Malware Classification and Types`,
      content: `Malware is classified by how it propagates, what it does once installed, and how it evades detection. Understanding these distinctions is critical for selecting appropriate countermeasures.

## 1.1 Viruses

A virus is malicious code that attaches itself to a legitimate program or file and executes when the host is run. Viruses require user action to spread — they cannot self-propagate across networks without a carrier. Key virus types include:

- **Boot sector viruses** — Infect the master boot record (MBR) or volume boot record (VBR). They load before the operating system, making them difficult to detect with OS-level tools. Modern UEFI Secure Boot helps prevent these.
- **Macro viruses** — Embedded in documents (Word, Excel) that support macros. They execute when the document is opened and macros are enabled. Example: the Melissa virus spread via infected Word documents.
- **Polymorphic viruses** — Change their code signature each time they replicate, defeating signature-based antivirus detection. They use mutation engines to alter their appearance while maintaining functionality.
- **Metamorphic viruses** — More advanced than polymorphic; they completely rewrite their own code with each infection cycle. The resulting code performs the same function but looks entirely different to scanners.
- **Armored viruses** — Use techniques like code obfuscation, anti-debugging, and anti-disassembly to make reverse engineering difficult.
- **Multipartite viruses** — Infect multiple targets simultaneously (e.g., both boot sector and files), making complete removal more difficult.

## 1.2 Worms

Worms are self-replicating malware that spread across networks without requiring user interaction or a host file. They exploit vulnerabilities in network services, operating systems, or applications to propagate automatically.

- **Network worms** — Exploit vulnerabilities in network services (e.g., EternalBlue exploit used by WannaCry)
- **Email worms** — Spread by sending copies of themselves to contacts in the victim's address book
- **Internet worms** — Scan random IP ranges for vulnerable systems

Worms consume network bandwidth and system resources even before delivering a payload. The Morris Worm (1988) was one of the first internet worms. WannaCry (2017) combined worm propagation with ransomware payload, spreading to over 200,000 systems in 150 countries within days.

## 1.3 Trojans

A Trojan disguises itself as legitimate software to trick users into installing it. Unlike viruses and worms, Trojans do not self-replicate. They rely entirely on social engineering for distribution.

- **Remote Access Trojans (RATs)** — Provide attackers with remote control of the victim's system (e.g., DarkComet, njRAT). They typically include keylogging, screen capture, file transfer, and webcam access capabilities.
- **Banking Trojans** — Target financial credentials by injecting fake forms into banking websites or intercepting transactions (e.g., Zeus, Emotet).
- **Downloader Trojans** — Initial payload is small; once installed, they download additional malicious components from command-and-control servers.
- **Dropper Trojans** — Carry a secondary payload embedded within them and "drop" it onto the system upon execution.

## 1.4 Ransomware

Ransomware encrypts victim files or locks system access, demanding payment (typically in cryptocurrency) for the decryption key. Modern ransomware operations have evolved into sophisticated criminal enterprises.

- **Crypto-ransomware** — Encrypts files using strong encryption (AES-256 + RSA) making recovery without the key practically impossible. Examples: WannaCry, Ryuk, REvil.
- **Locker ransomware** — Locks the user out of the entire system or device without encrypting individual files.
- **Double extortion** — Attackers exfiltrate data before encrypting, threatening to publish stolen data if ransom isn't paid. This nullifies the "just restore from backup" defense.
- **Ransomware-as-a-Service (RaaS)** — Criminal operators provide ransomware tools to affiliates who carry out attacks, splitting the ransom payments.

Prevention: Regular offline backups, network segmentation, endpoint detection and response (EDR), email filtering, and user awareness training. Never pay the ransom — it funds criminal operations and doesn't guarantee data recovery.

## 1.5 Rootkits

Rootkits operate at the deepest levels of the operating system to hide their presence and maintain persistent access. They modify system functions to conceal malicious activity from security tools.

- **Kernel-level rootkits** — Modify the OS kernel to intercept system calls. They are extremely difficult to detect because they control the very mechanisms that security tools rely on.
- **Bootloader rootkits (Bootkits)** — Replace or modify the bootloader to load before the OS, gaining control before any security software initializes.
- **User-mode rootkits** — Operate at the application level by hooking API calls and modifying process listings.
- **Firmware rootkits** — Embed in hardware firmware (BIOS/UEFI, hard drive firmware), surviving OS reinstallation and even hard drive replacement in some cases.

Detection requires integrity checking, boot-time scanning, or behavioral analysis. Tools like chkrootkit and rkhunter can detect some rootkits on Linux systems. UEFI Secure Boot and Trusted Platform Module (TPM) provide hardware-level protection against boot-time rootkits.

## 1.6 Fileless Malware

Fileless malware operates entirely in memory without writing files to disk, evading traditional file-based antivirus scanning.

- **Living-off-the-land** — Uses legitimate system tools (PowerShell, WMI, .NET, Windows Management Instrumentation) to execute malicious actions. Since these tools are trusted by the OS, their activity often goes undetected.
- **Memory-only payloads** — Injected directly into running processes; disappear on reboot but can establish persistence through registry keys or scheduled tasks.
- **Script-based attacks** — Use PowerShell, JavaScript, or VBScript executed in memory. Often delivered via phishing emails with malicious macros that invoke PowerShell.

Detection requires behavioral analysis, memory forensics, and monitoring of scripting engine activity. Traditional antivirus with only signature-based detection is largely ineffective against fileless malware.

## 1.7 Other Malware Types

- **Spyware** — Monitors user activity (keystrokes, browsing, screenshots) and exfiltrates data to attackers. Often bundled with free software.
- **Adware** — Displays unwanted advertisements. While less malicious, it can degrade performance and serve as a vector for more dangerous malware.
- **Keyloggers** — Record keystrokes to capture passwords, credit card numbers, and other sensitive input. Can be software-based or hardware devices inserted between keyboard and computer.
- **Logic bombs** — Malicious code that triggers when specific conditions are met (date, event, user action). Often planted by disgruntled insiders.
- **Cryptominers** — Hijack system resources (CPU/GPU) to mine cryptocurrency. They degrade performance and increase energy costs.
- **Potentially Unwanted Programs (PUPs)** — Software that may not be strictly malicious but is unwanted, such as browser toolbars, search engine hijackers, or bundled software.`,
      examTip: `The exam tests your ability to distinguish between malware types based on behavior. Key distinctions: viruses need a host file and user action; worms self-replicate over networks; Trojans disguise as legitimate software; rootkits hide at the OS/kernel level; fileless malware lives in memory. Know that polymorphic malware changes its signature and metamorphic malware rewrites its entire code.`,
      importantNote: `Ransomware with double extortion exfiltrates data AND encrypts it — backups alone are not sufficient defense. You also need data loss prevention and network monitoring to detect exfiltration before encryption begins.`,
    },
    {
      id: 'malware-indicators',
      title: `2. Indicators of Malware Infection`,
      content: `Recognizing malware indicators is essential for rapid detection and response. These indicators fall into host-based and network-based categories.

## 2.1 Host-Based Indicators

- **Unusual process activity** — Unknown processes consuming high CPU/memory, processes running from temporary directories or unusual paths
- **File system changes** — Unexpected new files, modified system files, encrypted files with unusual extensions (ransomware), files with double extensions (e.g., report.pdf.exe)
- **Registry modifications** — New autorun entries, modified security settings, disabled Windows Defender or firewall entries
- **Performance degradation** — Sudden slowness, high disk I/O, excessive CPU usage without corresponding user activity
- **Unauthorized access attempts** — Failed login attempts, new user accounts, privilege escalation events
- **Disabled security tools** — Antivirus turned off, firewall rules modified, Windows Update disabled
- **Unusual scheduled tasks** — New tasks created for persistence, tasks running scripts from temporary folders

## 2.2 Network-Based Indicators

- **Beaconing** — Regular, periodic outbound connections to command-and-control (C2) servers, often at consistent intervals
- **DNS anomalies** — Queries to known malicious domains, unusually long DNS queries (DNS tunneling), queries to newly registered domains
- **Unusual outbound traffic** — Large data transfers to unknown external IPs (data exfiltration), traffic on non-standard ports, encrypted traffic to unusual destinations
- **Port scanning** — Internal systems scanning other internal systems (lateral movement), scanning for common vulnerable services
- **Protocol anomalies** — HTTP traffic on non-standard ports, DNS over non-standard ports, encapsulated protocols (tunneling)

## 2.3 Behavioral Indicators

- **Credential harvesting** — Pop-up login prompts that look slightly different, browser redirects to fake login pages
- **Lateral movement** — One compromised system attempting to connect to many others using captured credentials or exploits
- **Data staging** — Files being collected and compressed in preparation for exfiltration, often in temporary or hidden directories
- **Living-off-the-land activity** — PowerShell executing encoded commands, WMI used for remote code execution, certutil downloading files`,
      examTip: `Know the difference between host-based and network-based indicators. Beaconing (regular outbound C2 communication) is one of the most commonly tested network indicators. For the exam, if you see "regular periodic outbound connections to an unknown IP," think C2 beaconing.`,
    },
    {
      id: 'domain1-malware-quiz',
      title: `Malware Practice Questions`,
      content: ``,
      quiz: [
        {
          question: `A security analyst discovers that a system is making regular outbound HTTPS connections to an unknown IP address every 30 seconds. What type of activity does this most likely indicate?`,
          options: ["A software update check", "Command-and-control beaconing", "DNS tunneling", "A DDoS attack"],
          correctIndex: 1,
          explanation: `Regular, periodic outbound connections to unknown IPs are a classic indicator of C2 beaconing. Malware often "checks in" with its command-and-control server at consistent intervals to receive instructions or exfiltrate data. Software updates are typically less frequent and go to known vendor IPs. DNS tunneling uses DNS queries, not HTTPS. DDoS involves inbound traffic overwhelming a target.`,
        },
        {
          question: `Which type of malware can spread across a network without any user interaction?`,
          options: ["Virus", "Trojan", "Worm", "Logic bomb"],
          correctIndex: 2,
          explanation: `Worms self-replicate and spread across networks by exploiting vulnerabilities without requiring user action. Viruses require a host file and user action to spread. Trojans require users to install them. Logic bombs are triggered by specific conditions but don't self-propagate.`,
        },
        {
          question: `An organization discovers that attackers used PowerShell to execute malicious code directly in memory without writing any files to disk. What type of malware is this?`,
          options: ["Rootkit", "Fileless malware", "Macro virus", "Polymorphic virus"],
          correctIndex: 1,
          explanation: `Fileless malware operates entirely in memory using legitimate system tools like PowerShell (living-off-the-land technique). It evades traditional file-based antivirus by never writing to disk. Rootkits hide at the OS level. Macro viruses are embedded in documents. Polymorphic viruses change their file signature but still exist as files on disk.`,
        },
        {
          question: `A ransomware group encrypts an organization's files and also threatens to publish stolen data unless payment is made. What is this technique called?`,
          options: ["Crypto-ransomware", "Double extortion", "Locker ransomware", "Ransomware-as-a-Service"],
          correctIndex: 1,
          explanation: `Double extortion combines file encryption with data theft and the threat of public disclosure. This defeats the "restore from backup" strategy because even if files are recovered, the stolen data can still be published. Crypto-ransomware only encrypts files. Locker ransomware locks system access. RaaS is a business model for distributing ransomware.`,
        },
        {
          question: `Which malware type modifies the operating system kernel to hide its presence from security tools?`,
          options: ["Spyware", "Adware", "Kernel-level rootkit", "Trojan"],
          correctIndex: 2,
          explanation: `Kernel-level rootkits modify the OS kernel to intercept system calls, hiding malicious processes, files, and network connections from security tools. They are extremely difficult to detect because they control the mechanisms that security software relies on. Spyware monitors activity but doesn't modify the kernel. Adware displays ads. Trojans disguise as legitimate software.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'Viruses require a host file and user action; worms self-replicate across networks; Trojans rely on social engineering',
    'Fileless malware uses legitimate system tools (PowerShell, WMI) and operates in memory, evading file-based detection',
    'Ransomware double extortion combines encryption with data theft — backups alone are insufficient defense',
    'Rootkits operate at kernel or firmware level to hide from security tools; require specialized detection methods',
    'C2 beaconing (regular outbound connections) is a key network indicator of compromise',
  ],
},

sp_social_eng: {
  topicId: 'sp_social_eng',
  title: `Social Engineering Attacks`,
  domainWeight: '24%',
  overview: `Social engineering exploits human psychology rather than technical vulnerabilities. These attacks manipulate people into divulging confidential information, granting access, or performing actions that compromise security. Social engineering is consistently the most successful initial attack vector because it targets the weakest link in security — humans.`,
  sections: [
    {
      id: 'social-eng-techniques',
      title: `1. Social Engineering Techniques`,
      content: `Social engineering attacks leverage psychological principles including authority, urgency, scarcity, social proof, familiarity, and intimidation to manipulate targets.

## 1.1 Phishing

Phishing is the most common social engineering attack. Attackers send fraudulent communications (usually email) that appear to come from a trusted source to trick victims into revealing credentials, clicking malicious links, or downloading malware.

- **Spear phishing** — Targeted phishing aimed at a specific individual or organization. Attackers research the target to craft highly convincing messages using personal details (name, role, projects, colleagues). Far more effective than generic phishing.
- **Whaling** — Spear phishing targeting senior executives (CEO, CFO, CTO). These attacks often impersonate board members, legal counsel, or regulators and involve high-value requests like wire transfers or sensitive data disclosure.
- **Business Email Compromise (BEC)** — Attackers compromise or spoof a legitimate business email account to send fraudulent requests. Common scenarios include fake invoice payments, CEO impersonation requesting urgent wire transfers, and vendor email compromise redirecting payments.
- **Clone phishing** — Attacker copies a legitimate email previously received by the target, replaces links or attachments with malicious versions, and resends it from a spoofed address claiming it's an "updated" version.
- **Pharming** — Redirects users from legitimate websites to malicious ones by poisoning DNS records or modifying the local hosts file. Unlike phishing, victims don't need to click a link — they type the correct URL but are silently redirected.

## 1.2 Voice-Based Attacks (Vishing)

Vishing (voice phishing) uses phone calls to manipulate victims. Attackers may spoof caller ID to appear as a trusted number (bank, IT department, government agency).

Common vishing scenarios:
- IRS/tax authority scam — Caller claims taxes are overdue and threatens arrest
- Tech support scam — Caller claims to be from Microsoft or the victim's ISP, reporting a "virus" on their computer
- Bank fraud department — Caller claims suspicious activity on the victim's account and requests verification of account details
- IT help desk — Caller poses as help desk requesting password verification to "fix an account issue"

AI-generated voice deepfakes are making vishing increasingly sophisticated, allowing attackers to clone the voice of executives or trusted individuals.

## 1.3 SMS-Based Attacks (Smishing)

Smishing uses SMS text messages to deliver social engineering attacks. Messages typically contain malicious links or request sensitive information.

- Fake delivery notifications with tracking links
- Bank alerts about "suspicious activity" with links to fake login pages
- Prize/contest winning notifications
- Government benefit or tax refund messages

Smishing is effective because people tend to trust text messages more than email and mobile screens make it harder to verify URLs.

## 1.4 Pretexting

Pretexting involves creating a fabricated scenario (pretext) to engage the victim and extract information. The attacker builds a believable story and often assumes a false identity.

Examples:
- Attacker calls HR pretending to be a new employee who forgot their employee ID and needs it to access a system
- Attacker poses as an auditor or regulator requesting access to sensitive records
- Attacker pretends to be a vendor needing network credentials to perform maintenance
- Attacker impersonates a colleague from another office asking for help with a "locked account"

The key differentiator of pretexting is the fabricated backstory that establishes trust and plausibility.

## 1.5 Watering Hole Attacks

A watering hole attack compromises a website frequently visited by the target group. Instead of attacking targets directly, the attacker infects a trusted third-party site that the targets routinely use.

Process:
1. Identify websites commonly visited by the target group (industry forums, news sites, vendor portals)
2. Compromise the website by injecting malicious code (drive-by download, exploit kit)
3. Wait for targets to visit the compromised site
4. Malicious code executes on target's system, exploiting browser or plugin vulnerabilities

Watering holes are effective against security-conscious organizations because they bypass email filters and don't require the target to click suspicious links — they visit a site they already trust.

## 1.6 Additional Social Engineering Techniques

- **Tailgating/Piggybacking** — Following an authorized person through a secured door without presenting credentials. Tailgating is without the person's knowledge; piggybacking is with their consent (e.g., holding the door open).
- **Shoulder surfing** — Observing someone entering passwords, PINs, or other sensitive information by looking over their shoulder or using cameras/binoculars from a distance.
- **Dumpster diving** — Searching through an organization's trash for sensitive documents, discarded hardware, or information useful for further attacks.
- **Baiting** — Leaving infected USB drives or media in locations where targets will find them (parking lots, lobbies, conference rooms). Curiosity drives victims to plug them into their computers.
- **Quid pro quo** — Offering something in exchange for information. Example: attacker calls employees offering free tech support in exchange for their login credentials.
- **Typosquatting** — Registering domain names similar to legitimate ones (e.g., gogle.com instead of google.com) to capture users who mistype URLs. Often combined with credential harvesting pages.
- **Influence campaigns** — Large-scale disinformation operations using social media to manipulate public opinion, often used in hybrid warfare or to manipulate stock prices.`,
      examTip: `The exam tests specific social engineering types. Key distinctions: phishing = email; vishing = voice/phone; smishing = SMS; spear phishing = targeted at individuals; whaling = targeted at executives; BEC = compromised/spoofed business email; pretexting = fabricated scenario; watering hole = compromised trusted website; baiting = physical media (USB). Know each one and be able to identify them from scenario descriptions.`,
      importantNote: `Business Email Compromise (BEC) causes the highest financial losses of any cybercrime category according to the FBI. It doesn't require malware — just a convincing email from what appears to be a trusted source requesting a financial transaction.`,
    },
    {
      id: 'social-eng-defenses',
      title: `2. Defending Against Social Engineering`,
      content: `Technical controls alone cannot prevent social engineering. Defense requires a combination of training, policies, technical controls, and organizational culture.

## 2.1 Security Awareness Training

- **Regular training programs** — Annual or quarterly training covering current threats, with role-specific content for high-risk positions (finance, HR, executives)
- **Phishing simulations** — Controlled phishing campaigns that test employee awareness and track click rates over time. Effectiveness is measured by reduction in click rates, not just completion of training
- **Tabletop exercises** — Walk through social engineering scenarios to practice recognition and response
- **Just-in-time training** — Immediate feedback when an employee fails a phishing simulation, providing education at the moment they are most receptive

## 2.2 Technical Controls

- **Email filtering** — SPF, DKIM, and DMARC to prevent email spoofing; content filtering to detect phishing indicators
- **URL filtering and sandboxing** — Block known malicious URLs; sandbox suspicious links and attachments before delivery
- **Multi-factor authentication (MFA)** — Even if credentials are stolen through phishing, MFA prevents account compromise
- **USB device policies** — Disable USB autorun; use endpoint protection to scan removable media; consider restricting USB ports
- **DNS filtering** — Block access to known malicious domains and newly registered domains

## 2.3 Policy Controls

- **Verification procedures** — Require callback verification for financial transactions, especially wire transfers or changes to payment details
- **Data classification** — Clear policies on what information can be shared and with whom
- **Physical security** — Mantrap/airlock entries prevent tailgating; visitor badges and escort policies; clean desk policies
- **Incident reporting** — Easy-to-use reporting mechanism for suspicious emails or calls; no-blame culture to encourage reporting`,
      examTip: `For the exam, the BEST defense against social engineering is security awareness training — because social engineering targets people, the defense must also target people. However, technical controls like MFA, email filtering (SPF/DKIM/DMARC), and verification procedures are important layers. The exam may present scenarios where you need to choose the MOST effective control.`,
    },
    {
      id: 'domain1-social-eng-quiz',
      title: `Social Engineering Practice Questions`,
      content: ``,
      quiz: [
        {
          question: `An attacker sends an email to the CFO that appears to come from the CEO, requesting an urgent wire transfer of $250,000 to a new vendor. The email address looks legitimate. What type of attack is this?`,
          options: ["Spear phishing", "Whaling", "Business Email Compromise (BEC)", "Pretexting"],
          correctIndex: 2,
          explanation: `This is Business Email Compromise (BEC) — the attacker impersonates or spoofs a legitimate business email to request a financial transaction. While this is also whaling (targeting a senior executive) and spear phishing (targeted), BEC is the most specific and accurate classification because it involves impersonating a business email to request a fraudulent financial transaction. BEC is the #1 cybercrime by financial loss.`,
        },
        {
          question: `An attacker identifies that employees at a defense contractor frequently visit a specific industry news website. The attacker compromises that website to deliver malware. What type of attack is this?`,
          options: ["Phishing", "Drive-by download", "Watering hole attack", "Typosquatting"],
          correctIndex: 2,
          explanation: `This is a watering hole attack — compromising a website frequently visited by the target group. The attacker doesn't target victims directly but infects a trusted site they routinely use. While a drive-by download may be the delivery mechanism, the overall attack strategy of targeting a site frequented by specific victims is the watering hole technique.`,
        },
        {
          question: `Which of the following is the MOST effective way to measure the success of a security awareness program?`,
          options: ["Number of employees who completed training", "Reduction in phishing simulation click rates over time", "Amount spent on training programs", "Number of security policies published"],
          correctIndex: 1,
          explanation: `The most effective measure is behavioral change — specifically, reduction in phishing simulation click rates over time. This directly measures whether employees are recognizing and avoiding threats. Training completion, spending, and policy counts measure activity, not effectiveness. The goal of awareness training is changing behavior, not just delivering information.`,
        },
        {
          question: `An attacker calls an employee claiming to be from the IT help desk and asks them to verify their password to fix a system issue. What type of social engineering is this?`,
          options: ["Vishing with pretexting", "Smishing", "Phishing", "Baiting"],
          correctIndex: 0,
          explanation: `This combines vishing (voice phishing — using phone calls) with pretexting (creating a fabricated scenario — posing as IT help desk with a fake system issue). The attacker uses a phone call (vishing) and a fabricated backstory (pretexting) to extract credentials. Smishing uses SMS. Phishing uses email. Baiting uses physical media.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'Social engineering targets human psychology, not technical vulnerabilities — it is the most common initial attack vector',
    'Phishing (email), vishing (voice), smishing (SMS) are delivery channels; spear phishing and whaling add targeting specificity',
    'Business Email Compromise (BEC) causes the highest financial losses of any cybercrime category',
    'Watering hole attacks compromise trusted third-party websites to bypass email-based defenses',
    'Security awareness training with phishing simulations is the primary defense; measure behavior change, not just completion',
  ],
},

sp_app_attacks: {
  topicId: 'sp_app_attacks',
  title: `Application Attacks`,
  domainWeight: '24%',
  overview: `Application attacks exploit vulnerabilities in software to gain unauthorized access, steal data, or disrupt services. These attacks target web applications, APIs, databases, and compiled software. Understanding injection attacks, cross-site attacks, and input validation failures is critical for the Security+ exam.`,
  sections: [
    {
      id: 'injection-attacks',
      title: `1. Injection Attacks`,
      content: `Injection attacks occur when untrusted data is sent to an interpreter as part of a command or query. The attacker's input is executed as code rather than treated as data.

## 1.1 SQL Injection (SQLi)

SQL injection inserts malicious SQL statements into input fields that are incorporated into database queries without proper sanitization.

**Example of vulnerable code:**
A login form passes username and password directly into a SQL query:
\`SELECT * FROM users WHERE username = 'input' AND password = 'input'\`

An attacker enters: \`' OR 1=1 --\` as the username
The query becomes: \`SELECT * FROM users WHERE username = '' OR 1=1 --' AND password = ''\`

The \`OR 1=1\` makes the condition always true, and \`--\` comments out the rest of the query, bypassing authentication entirely.

**SQL injection types:**
- **In-band SQLi** — Results are returned directly in the application response. Includes UNION-based (using UNION SELECT to retrieve data from other tables) and error-based (extracting data from database error messages).
- **Blind SQLi** — No data is returned in the response. Boolean-based blind sends queries that return true/false and infers data from the application's behavior. Time-based blind uses SLEEP() to infer data from response timing.
- **Out-of-band SQLi** — Exfiltrates data through a different channel (e.g., DNS queries or HTTP requests to attacker-controlled servers).

**Prevention:**
- Parameterized queries (prepared statements) — The primary defense. Input is always treated as data, never as code.
- Input validation — Whitelist acceptable characters; reject or escape special characters
- Stored procedures — Pre-compiled SQL that limits injection opportunities
- Least privilege — Database accounts used by applications should have minimal permissions
- Web Application Firewall (WAF) — Can detect and block common SQLi patterns

## 1.2 Cross-Site Scripting (XSS)

XSS injects malicious scripts into web pages viewed by other users. The victim's browser executes the script because it trusts the website serving the page.

- **Reflected XSS** — The malicious script is part of the URL or request and is immediately reflected back in the response. Requires the victim to click a crafted link. Example: a search page that displays the search term without sanitization.
- **Stored XSS (Persistent XSS)** — The malicious script is permanently stored on the target server (in a database, comment field, forum post). Every user who views the affected page executes the script. More dangerous than reflected because it doesn't require victim interaction beyond normal browsing.
- **DOM-based XSS** — The vulnerability exists in client-side JavaScript that processes user input and writes it to the DOM without sanitization. The server never sees the malicious input — it's entirely client-side.

**XSS impacts:**
- Session hijacking — Stealing session cookies to impersonate users
- Credential theft — Injecting fake login forms
- Keylogging — Capturing keystrokes on the affected page
- Defacement — Modifying page content
- Malware distribution — Redirecting users to malicious sites

**Prevention:**
- Output encoding/escaping — Encode user input before rendering in HTML, JavaScript, CSS, or URLs
- Content Security Policy (CSP) — HTTP header that restricts which scripts can execute
- Input validation — Whitelist acceptable input formats
- HTTPOnly cookie flag — Prevents JavaScript from accessing session cookies

## 1.3 Cross-Site Request Forgery (CSRF/XSRF)

CSRF tricks an authenticated user's browser into making unwanted requests to a web application. The attack exploits the browser's automatic inclusion of authentication cookies with every request to a domain.

**Example:** A user is logged into their bank. They visit a malicious page containing:
\`<img src="https://bank.com/transfer?to=attacker&amount=10000">\`

The browser sends this request with the user's session cookie, executing the transfer.

**Prevention:**
- Anti-CSRF tokens — Unique, unpredictable tokens included in forms that the server validates
- SameSite cookie attribute — Prevents cookies from being sent with cross-origin requests
- Requiring re-authentication for sensitive operations
- Checking Referer/Origin headers

## 1.4 Other Injection Attacks

- **Command injection** — Injecting operating system commands through application inputs. If an application passes user input to a system shell, attackers can append commands using \`;\`, \`|\`, or \`&&\`.
- **LDAP injection** — Injecting LDAP query syntax to modify directory queries, potentially gaining unauthorized access to user data or bypassing authentication.
- **XML injection / XXE (XML External Entity)** — Injecting malicious XML that references external entities, potentially reading local files, performing SSRF, or causing denial of service.
- **Header injection** — Injecting HTTP headers through user input, potentially enabling response splitting, cache poisoning, or XSS.`,
      examTip: `SQL injection prevention: parameterized queries/prepared statements are THE answer. If the exam asks for the BEST defense against SQLi, it's parameterized queries — not input validation, not WAF, not stored procedures. For XSS: output encoding is the primary defense. For CSRF: anti-CSRF tokens. Know these primary defenses cold.`,
      importantNote: `Reflected XSS requires victim interaction (clicking a link). Stored XSS does NOT — it executes for every user who views the affected page, making it significantly more dangerous. The exam will test this distinction.`,
    },
    {
      id: 'additional-app-attacks',
      title: `2. Additional Application Attacks`,
      content: `Beyond injection, several other application attack categories appear on the Security+ exam.

## 2.1 Buffer Overflow

A buffer overflow occurs when a program writes more data to a buffer than it can hold, overwriting adjacent memory. Attackers exploit this to inject and execute arbitrary code.

- **Stack-based overflow** — Overwrites the return address on the stack, redirecting execution to attacker-controlled code
- **Heap-based overflow** — Corrupts data in the heap memory area, potentially altering program behavior or enabling code execution

**Prevention:**
- Input validation and bounds checking in code
- Address Space Layout Randomization (ASLR) — Randomizes memory addresses
- Data Execution Prevention (DEP) / No-Execute (NX) bit — Prevents execution of code in data segments
- Stack canaries — Values placed before the return address that are checked before function returns
- Use memory-safe languages (Rust, Go, Java) instead of C/C++ where possible

## 2.2 Race Conditions

A race condition occurs when the behavior of a system depends on the sequence or timing of events. Attackers exploit the time gap between a check and a use of a resource (TOCTOU — Time of Check, Time of Use).

Example: A file permission check determines a user can access a file. Between the check and the actual file access, the file is swapped with a sensitive file, giving the user unauthorized access.

**Prevention:** Atomic operations, proper locking mechanisms, mutex/semaphore controls.

## 2.3 API Attacks

Modern applications rely heavily on APIs (REST, GraphQL, SOAP), creating new attack surfaces.

- **Broken authentication** — Weak API keys, missing token expiration, exposed credentials
- **Broken object-level authorization (BOLA/IDOR)** — Accessing other users' data by modifying object IDs in API requests
- **Excessive data exposure** — APIs returning more data than needed, relying on client-side filtering
- **Rate limiting failures** — No throttling, enabling brute force, credential stuffing, or denial of service
- **Mass assignment** — Binding client-provided data to internal objects without filtering, allowing attackers to modify fields they shouldn't access

## 2.4 Directory Traversal (Path Traversal)

Attackers manipulate file path inputs to access files outside the intended directory. Using sequences like \`../../../etc/passwd\` to navigate the file system.

Prevention: Input validation, chroot jails, access control lists, avoiding passing user input to file system operations.

## 2.5 Privilege Escalation

- **Vertical escalation** — A lower-privilege user gains higher-privilege access (user → admin). Exploits vulnerabilities in access control, unpatched software, or misconfiguration.
- **Horizontal escalation** — A user accesses resources belonging to another user at the same privilege level. Often through IDOR vulnerabilities.

## 2.6 Replay Attacks

An attacker captures a valid data transmission (authentication token, session cookie) and retransmits it to gain unauthorized access.

Prevention: Session tokens with expiration, nonces (numbers used once), timestamps, and challenge-response protocols.`,
      examTip: `Buffer overflow prevention: ASLR randomizes memory layout, DEP/NX prevents code execution in data segments, stack canaries detect overwrites. Know all three. For race conditions, remember TOCTOU (Time of Check, Time of Use). For API security, BOLA/IDOR (Insecure Direct Object References) is the #1 API vulnerability.`,
    },
    {
      id: 'domain1-app-attacks-quiz',
      title: `Application Attacks Practice Questions`,
      content: ``,
      quiz: [
        {
          question: `A developer wants to prevent SQL injection in a web application. Which technique is the MOST effective?`,
          options: ["Input validation with a blacklist", "Web Application Firewall (WAF)", "Parameterized queries (prepared statements)", "Encoding all user input"],
          correctIndex: 2,
          explanation: `Parameterized queries (prepared statements) are the most effective defense against SQL injection because they separate SQL code from data — user input is always treated as data and never interpreted as SQL commands. Input validation and WAFs provide additional defense but can be bypassed. Encoding is primarily for XSS prevention. Parameterized queries are the gold standard for SQLi prevention.`,
        },
        {
          question: `An attacker posts a malicious JavaScript snippet in a forum comment. When other users view the comment, their browsers execute the script. What type of attack is this?`,
          options: ["Reflected XSS", "Stored XSS", "CSRF", "DOM-based XSS"],
          correctIndex: 1,
          explanation: `This is stored (persistent) XSS — the malicious script is permanently stored on the server (in the forum database) and executes for every user who views the page. Reflected XSS would require each victim to click a crafted link. CSRF tricks browsers into making unwanted requests. DOM-based XSS is processed entirely client-side.`,
        },
        {
          question: `Which memory protection technique randomizes the location of system components in memory to make exploitation more difficult?`,
          options: ["Data Execution Prevention (DEP)", "Address Space Layout Randomization (ASLR)", "Stack canaries", "Input validation"],
          correctIndex: 1,
          explanation: `ASLR randomizes the memory addresses of key system components (stack, heap, libraries) each time a program runs, making it significantly harder for attackers to predict where their injected code will be in memory. DEP prevents execution of code in data segments. Stack canaries detect buffer overwrites. Input validation prevents the overflow in the first place.`,
        },
        {
          question: `A user is logged into their banking application. They visit a malicious website that contains a hidden form that submits a transfer request to the bank using the user's active session. What type of attack is this?`,
          options: ["XSS", "SQL injection", "CSRF", "Session hijacking"],
          correctIndex: 2,
          explanation: `This is Cross-Site Request Forgery (CSRF). The malicious site tricks the user's browser into sending an authenticated request to the bank using the user's existing session cookie. The key indicator is that the attack leverages the victim's active authenticated session from a different website. XSS injects scripts into the vulnerable site itself. Session hijacking steals the session token.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'SQL injection: use parameterized queries as primary defense; input is treated as data, never as code',
    'XSS types: reflected (requires click), stored (permanent on server, more dangerous), DOM-based (client-side only)',
    'CSRF exploits authenticated sessions; prevent with anti-CSRF tokens and SameSite cookies',
    'Buffer overflow mitigations: ASLR (randomize memory), DEP/NX (prevent code execution in data segments), stack canaries',
    'BOLA/IDOR is the #1 API vulnerability — always validate authorization at the object level',
  ],
},

sp_network_attacks: {
  topicId: 'sp_network_attacks',
  title: `Network Attacks`,
  domainWeight: '24%',
  overview: `Network attacks target the communication infrastructure that connects systems. These attacks can intercept, modify, disrupt, or redirect network traffic. Understanding common network attack types, their mechanisms, and countermeasures is essential for Security+ candidates.`,
  sections: [
    {
      id: 'dos-attacks',
      title: `1. Denial of Service & Distributed Denial of Service`,
      content: `Denial of Service (DoS) and Distributed Denial of Service (DDoS) attacks overwhelm a target with traffic or requests, making it unavailable to legitimate users.

## 1.1 DoS Attack Types

- **Volumetric attacks** — Flood the target's bandwidth with massive amounts of traffic. Measured in bits per second (bps). Examples: UDP flood, ICMP flood, DNS amplification. DNS amplification sends small queries to open DNS resolvers with a spoofed source IP (the victim's), causing the resolvers to send large responses to the victim — amplification factors of 50x or more.
- **Protocol attacks** — Exploit weaknesses in network protocols to exhaust server resources. Measured in packets per second (pps). Examples: SYN flood (sends thousands of SYN packets without completing the three-way handshake, exhausting the target's connection table), Ping of Death, Smurf attack (ICMP broadcast amplification).
- **Application-layer attacks** — Target specific services (HTTP, DNS) with requests that appear legitimate but are designed to exhaust server resources. Measured in requests per second (rps). Examples: HTTP GET/POST floods, Slowloris (holds many connections open by sending partial HTTP headers slowly).

## 1.2 DDoS Architecture

DDoS attacks use many compromised systems (a botnet) to attack simultaneously. Modern DDoS attacks can exceed 1 Tbps.

- **Botnets** — Networks of compromised devices (computers, IoT devices, servers) controlled by an attacker through C2 infrastructure. IoT botnets (like Mirai) are particularly dangerous because IoT devices often have weak security and are rarely patched.
- **Reflection/Amplification** — Attackers send requests to legitimate servers (DNS, NTP, memcached) with the victim's spoofed source IP. The servers send amplified responses to the victim. Amplification factors range from 10x to 51,000x depending on the protocol.

## 1.3 DDoS Mitigation

- **Rate limiting** — Restrict the number of requests from a single source
- **Content Delivery Networks (CDNs)** — Distribute traffic across global edge servers
- **DDoS mitigation services** — Cloud-based scrubbing centers that filter malicious traffic (Cloudflare, AWS Shield, Akamai)
- **Blackhole routing** — Route attack traffic to a null route (drops all traffic, including legitimate)
- **SYN cookies** — Handle SYN floods without allocating resources until the handshake completes
- **Anycast routing** — Distribute attack traffic across multiple points of presence
- **Ingress filtering (BCP38)** — ISPs filter packets with spoofed source addresses at network edges`,
      examTip: `Key DDoS terms: volumetric = bandwidth flooding (bps), protocol = resource exhaustion (pps), application-layer = service targeting (rps). SYN flood is the most commonly tested protocol attack. Know that amplification attacks use spoofed source IPs and that DNS amplification can achieve 50x+ amplification.`,
    },
    {
      id: 'mitm-attacks',
      title: `2. On-Path (Man-in-the-Middle) and Interception Attacks`,
      content: `On-path attacks (previously called man-in-the-middle or MitM) involve an attacker positioning themselves between two communicating parties to intercept, modify, or inject traffic.

## 2.1 ARP Poisoning/Spoofing

Address Resolution Protocol (ARP) maps IP addresses to MAC addresses on a local network. ARP poisoning sends forged ARP replies to associate the attacker's MAC address with the IP address of the gateway or target.

Once successful, traffic intended for the gateway flows through the attacker, who can:
- Intercept unencrypted communications
- Modify packets in transit
- Capture credentials sent in plaintext
- Redirect traffic to malicious servers

**Prevention:** Dynamic ARP Inspection (DAI), static ARP entries for critical systems, encrypted protocols (HTTPS, SSH).

## 2.2 DNS Attacks

- **DNS spoofing/poisoning** — Injecting false DNS records into a resolver's cache, redirecting users to malicious IP addresses. When a user queries for legitimate-domain.com, the poisoned resolver returns the attacker's IP.
- **DNS hijacking** — Compromising DNS infrastructure (registrar accounts, DNS servers) to modify authoritative DNS records.
- **DNS tunneling** — Encoding data within DNS queries and responses to exfiltrate data or establish C2 channels. Effective because DNS traffic is rarely blocked or inspected.

**Prevention:** DNSSEC (cryptographically signs DNS records), DNS monitoring, restricting DNS resolvers, DNS-over-HTTPS (DoH) or DNS-over-TLS (DoT).

## 2.3 Additional Interception Attacks

- **SSL/TLS stripping** — Downgrading an HTTPS connection to HTTP. The attacker maintains HTTPS with the server but serves HTTP to the victim, intercepting all traffic in plaintext. Prevention: HTTP Strict Transport Security (HSTS).
- **MAC flooding** — Overwhelming a switch's MAC address table with fake entries, causing it to fail open and broadcast traffic like a hub, allowing the attacker to sniff all network traffic.
- **VLAN hopping** — Gaining access to traffic on other VLANs by exploiting switch misconfigurations. Double tagging sends frames with two VLAN tags; the first is stripped by the first switch, and the second tag routes the frame to the target VLAN.
- **Replay attacks** — Capturing and retransmitting valid authentication data. Prevention: timestamps, nonces, session tokens with expiration.
- **Rogue DHCP server** — Attacker sets up an unauthorized DHCP server that assigns clients a gateway IP pointing to the attacker's machine, enabling on-path interception.`,
      examTip: `The Security+ exam now uses "on-path attack" instead of "man-in-the-middle." ARP poisoning is the most common LAN-based on-path technique. Know that DNSSEC prevents DNS spoofing by cryptographically signing records, and that HSTS prevents SSL stripping by forcing HTTPS connections.`,
      importantNote: `DNS tunneling is used for both data exfiltration and C2 communication because DNS traffic is rarely blocked by firewalls. Look for unusually long DNS queries or high volumes of DNS traffic as indicators.`,
    },
    {
      id: 'domain1-network-attacks-quiz',
      title: `Network Attacks Practice Questions`,
      content: ``,
      quiz: [
        {
          question: `An attacker sends forged ARP replies to associate their MAC address with the default gateway's IP address. What is this attack called?`,
          options: ["DNS poisoning", "ARP poisoning", "MAC flooding", "VLAN hopping"],
          correctIndex: 1,
          explanation: `ARP poisoning (ARP spoofing) sends forged ARP replies to map the attacker's MAC address to the gateway's IP, redirecting traffic through the attacker. DNS poisoning targets DNS resolution. MAC flooding overwhelms the switch's MAC table. VLAN hopping accesses traffic on other VLANs.`,
        },
        {
          question: `Which DDoS mitigation technique allows handling SYN flood attacks without allocating server resources until the handshake is complete?`,
          options: ["Rate limiting", "Blackhole routing", "SYN cookies", "Anycast routing"],
          correctIndex: 2,
          explanation: `SYN cookies encode connection information in the sequence number of the SYN-ACK response, avoiding resource allocation until the client completes the three-way handshake with a valid ACK. Rate limiting restricts request volume. Blackhole routing drops all traffic. Anycast distributes traffic geographically.`,
        },
        {
          question: `An attacker downgrades a victim's HTTPS connection to HTTP to intercept traffic in plaintext. What prevents this attack?`,
          options: ["DNSSEC", "HTTP Strict Transport Security (HSTS)", "Certificate pinning", "Content Security Policy"],
          correctIndex: 1,
          explanation: `HSTS instructs browsers to always use HTTPS for a domain, preventing SSL stripping attacks. Once the browser has seen the HSTS header, it will refuse HTTP connections to that domain. DNSSEC secures DNS. Certificate pinning validates specific certificates. CSP restricts content sources.`,
        },
        {
          question: `Which type of DDoS attack sends small DNS queries with a spoofed source IP to generate large responses directed at the victim?`,
          options: ["SYN flood", "DNS amplification", "Slowloris", "MAC flooding"],
          correctIndex: 1,
          explanation: `DNS amplification is a reflection/amplification attack. Small queries (~60 bytes) to open DNS resolvers generate large responses (~3000+ bytes) sent to the spoofed victim IP — achieving 50x+ amplification. SYN flood is a protocol attack. Slowloris is application-layer. MAC flooding targets switches.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'DDoS categories: volumetric (bandwidth), protocol (resources), application-layer (services) — each measured differently',
    'SYN flood exhausts connection tables; mitigate with SYN cookies',
    'ARP poisoning is the primary LAN-based on-path attack; prevent with Dynamic ARP Inspection',
    'DNS amplification uses spoofed source IPs and open resolvers for massive amplification',
    'HSTS prevents SSL stripping; DNSSEC prevents DNS spoofing; both are critical exam topics',
  ],
},

sp_vuln_scanning: {
  topicId: 'sp_vuln_scanning',
  title: `Vulnerability Scanning & Assessment`,
  domainWeight: '24%',
  overview: `Vulnerability scanning and assessment is the systematic process of identifying, classifying, and prioritizing security weaknesses in systems, networks, and applications. This topic covers scanning tools, methodologies, vulnerability databases, and the relationship between vulnerability scanning and penetration testing.`,
  sections: [
    {
      id: 'vuln-scanning-concepts',
      title: `1. Vulnerability Scanning Concepts and Tools`,
      content: `Vulnerability scanning uses automated tools to identify known security weaknesses in systems and applications.

## 1.1 Types of Vulnerability Scans

- **Credentialed (authenticated) scans** — The scanner logs into systems using valid credentials to perform deeper analysis. Can check installed software versions, configurations, registry settings, and patch levels. Produces fewer false positives and identifies more vulnerabilities than non-credentialed scans.
- **Non-credentialed (unauthenticated) scans** — Scans from the network without system access. Identifies externally visible vulnerabilities but may miss internal configuration issues. Represents the attacker's perspective.
- **Internal scans** — Run from inside the network to identify vulnerabilities accessible to internal users or compromised systems.
- **External scans** — Run from outside the network (the internet) to identify vulnerabilities in internet-facing systems.
- **Active scans** — Send packets to targets and analyze responses. Can detect live hosts, open ports, running services, and known vulnerabilities. May impact system performance.
- **Passive scans** — Monitor network traffic without sending packets. Identify systems, services, and potential vulnerabilities by analyzing existing traffic. No impact on systems but limited in scope.

## 1.2 Vulnerability Scoring: CVE and CVSS

- **CVE (Common Vulnerabilities and Exposures)** — A standardized list of publicly known vulnerabilities. Each vulnerability receives a unique identifier (e.g., CVE-2021-44228 for Log4Shell). Maintained by MITRE Corporation.
- **CVSS (Common Vulnerability Scoring System)** — Provides a numerical score (0.0 to 10.0) indicating vulnerability severity.
  - **Base score** — Intrinsic characteristics: attack vector (network/adjacent/local/physical), attack complexity, privileges required, user interaction, scope, and impact (confidentiality, integrity, availability)
  - **Temporal score** — Changes over time: exploit code maturity, remediation level, report confidence
  - **Environmental score** — Organization-specific factors: modified base metrics reflecting the organization's environment

| CVSS Score | Severity |
|---|---|
| 0.0 | None |
| 0.1–3.9 | Low |
| 4.0–6.9 | Medium |
| 7.0–8.9 | High |
| 9.0–10.0 | Critical |

- **EPSS (Exploit Prediction Scoring System)** — Predicts the probability that a vulnerability will be exploited in the wild within the next 30 days. Complements CVSS by adding real-world exploitation likelihood.

## 1.3 Vulnerability Databases and Feeds

- **NVD (National Vulnerability Database)** — NIST-maintained database that enriches CVE entries with CVSS scores, CPE data, and fix information
- **Exploit-DB** — Database of publicly available exploits and proof-of-concept code
- **Vendor security advisories** — Microsoft Security Response Center, Cisco PSIRT, etc.
- **CISA KEV (Known Exploited Vulnerabilities)** — Catalog of vulnerabilities known to be actively exploited

## 1.4 Scan Results and False Positives

Vulnerability scan results must be validated before remediation:
- **True positive** — A real vulnerability correctly identified
- **False positive** — A reported vulnerability that doesn't actually exist (most common issue with scanning)
- **True negative** — Correctly identifying that no vulnerability exists
- **False negative** — A real vulnerability that the scanner failed to detect (most dangerous)

Credentialed scans significantly reduce false positives. Manual validation of critical findings is essential before investing remediation resources.`,
      examTip: `Credentialed scans find more vulnerabilities with fewer false positives than non-credentialed scans. CVSS scores rate severity (how bad), EPSS scores rate likelihood of exploitation (how likely). Know the CVSS severity ratings: 0.1-3.9 Low, 4.0-6.9 Medium, 7.0-8.9 High, 9.0-10.0 Critical.`,
      importantNote: `False negatives (real vulnerabilities not detected) are more dangerous than false positives (phantom vulnerabilities) because they leave actual vulnerabilities unaddressed. Always validate scan results, especially for critical systems.`,
    },
    {
      id: 'pentest-concepts',
      title: `2. Penetration Testing`,
      content: `Penetration testing (pentesting) goes beyond vulnerability scanning by actively attempting to exploit identified weaknesses. While scanning identifies potential vulnerabilities, pentesting confirms exploitability and demonstrates real-world impact.

## 2.1 Penetration Testing Types

- **Black box** — Testers have no prior knowledge of the target environment. Simulates an external attacker with no inside information. Takes the most time but is the most realistic external attack simulation.
- **White box** — Testers have full knowledge of the environment (source code, architecture, credentials, network diagrams). Most thorough and efficient, finds the most vulnerabilities, but doesn't simulate a realistic attack scenario.
- **Gray box** — Testers have partial knowledge (e.g., user-level credentials, basic network information). Balances realism with efficiency. Most commonly used in practice.

## 2.2 Penetration Testing Phases

1. **Planning and scoping** — Define rules of engagement (ROE), scope, timeline, emergency contacts, authorized activities, and legal authorization. Written authorization is MANDATORY before any testing begins.
2. **Reconnaissance/Information gathering** — Passive (OSINT, DNS lookups, social media) and active (port scanning, service enumeration) information collection.
3. **Vulnerability identification** — Scanning and manual analysis to find exploitable weaknesses.
4. **Exploitation** — Attempting to exploit vulnerabilities to gain access. May include privilege escalation, lateral movement, and persistence.
5. **Post-exploitation** — Determining the impact: what data can be accessed, how far can access extend, can persistence be maintained.
6. **Reporting** — Document findings, evidence, risk ratings, and remediation recommendations. The report is the deliverable that drives remediation.
7. **Remediation and re-testing** — Fix identified vulnerabilities and verify fixes through re-testing.

## 2.3 Penetration Testing Methodologies

- **PTES (Penetration Testing Execution Standard)** — Comprehensive standard covering all phases of penetration testing
- **OWASP Testing Guide** — Focused on web application security testing methodology
- **NIST SP 800-115** — Technical guide to information security testing and assessment
- **OSSTMM (Open Source Security Testing Methodology Manual)** — Scientific methodology for security testing

## 2.4 Bug Bounty Programs

Organizations offer rewards to security researchers who discover and responsibly disclose vulnerabilities. Programs may be managed through platforms like HackerOne or Bugcrowd.

- **Scope definition** — Clearly define which systems are in scope and which activities are allowed
- **Safe harbor** — Legal protection for researchers acting in good faith within program rules
- **Responsible disclosure** — Researchers report vulnerabilities to the organization before public disclosure, allowing time for remediation

## 2.5 Red Team vs. Blue Team vs. Purple Team

- **Red team** — Offensive security team that simulates real-world adversaries. Uses the same tactics, techniques, and procedures (TTPs) as actual threat actors. Focuses on achieving specific objectives (e.g., accessing the CEO's email, exfiltrating customer data).
- **Blue team** — Defensive security team responsible for detecting, responding to, and mitigating attacks. Operates the SOC, manages security tools, and performs incident response.
- **Purple team** — Collaborative approach where red and blue teams work together. Red team shares attack techniques with blue team in real-time, enabling immediate improvement of defensive capabilities. Not a permanent team but a collaborative exercise.
- **White team** — Manages and oversees red/blue team exercises, defines rules of engagement, and evaluates results.`,
      examTip: `Know the pentest types: black box (no knowledge), white box (full knowledge), gray box (partial knowledge). Written authorization (rules of engagement) is REQUIRED before any penetration testing. Red team = offense, blue team = defense, purple team = collaboration between red and blue. The exam loves scenario questions about which test type to use.`,
    },
    {
      id: 'domain1-vuln-quiz',
      title: `Vulnerability Assessment Practice Questions`,
      content: ``,
      quiz: [
        {
          question: `A security team runs two vulnerability scans: one with valid credentials and one without. Which statement is true about the results?`,
          options: ["Non-credentialed scans find more vulnerabilities", "Credentialed scans produce more false positives", "Credentialed scans find more vulnerabilities with fewer false positives", "Both produce identical results"],
          correctIndex: 2,
          explanation: `Credentialed (authenticated) scans log into systems to check software versions, configurations, and patch levels directly. This deeper access finds more vulnerabilities and produces fewer false positives than non-credentialed scans, which can only assess externally visible characteristics and must infer vulnerability status.`,
        },
        {
          question: `A vulnerability has a CVSS base score of 9.2. How is this severity classified?`,
          options: ["High", "Critical", "Severe", "Medium"],
          correctIndex: 1,
          explanation: `CVSS scores of 9.0–10.0 are classified as Critical. High is 7.0–8.9. Medium is 4.0–6.9. Low is 0.1–3.9. "Severe" is not a CVSS rating category. A score of 9.2 indicates an extremely serious vulnerability requiring immediate attention.`,
        },
        {
          question: `An organization hires a penetration testing firm. The testers are given user-level credentials and basic network documentation but no source code or admin access. What type of test is this?`,
          options: ["Black box", "White box", "Gray box", "Red team exercise"],
          correctIndex: 2,
          explanation: `Gray box testing provides testers with partial knowledge — in this case, user credentials and basic documentation. Black box provides no information. White box provides full information including source code and admin access. A red team exercise simulates real-world adversaries and may use any testing approach.`,
        },
        {
          question: `What is the MOST important prerequisite before conducting a penetration test?`,
          options: ["Installing vulnerability scanning tools", "Obtaining written authorization and defining rules of engagement", "Creating a network diagram", "Setting up a command-and-control server"],
          correctIndex: 1,
          explanation: `Written authorization and clearly defined rules of engagement (ROE) are mandatory before any penetration testing. Without them, testing activities could be considered unauthorized access — a criminal offense. ROE define scope, authorized activities, emergency contacts, and timelines. Tools, diagrams, and infrastructure are needed but secondary to legal authorization.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'Credentialed scans find more vulnerabilities with fewer false positives than non-credentialed scans',
    'CVSS scores severity (0-10); EPSS scores exploitation probability — use both for prioritization',
    'False negatives (missed real vulnerabilities) are more dangerous than false positives',
    'Written authorization and rules of engagement are mandatory before penetration testing',
    'Red team = offense, blue team = defense, purple team = collaborative improvement',
  ],
},

sp_threat_intel: {
  topicId: 'sp_threat_intel',
  title: `Threat Intelligence & Indicators`,
  domainWeight: '24%',
  overview: `Threat intelligence is evidence-based knowledge about existing or emerging threats that informs security decisions. It transforms raw data about threats into actionable intelligence that helps organizations prevent, detect, and respond to attacks. This topic covers indicators of compromise, threat intelligence sources, sharing frameworks, and threat hunting.`,
  sections: [
    {
      id: 'threat-intel-concepts',
      title: `1. Threat Intelligence Fundamentals`,
      content: `Threat intelligence enables proactive defense by providing context about who is attacking, how they attack, and what they target.

## 1.1 Intelligence Types

- **Strategic intelligence** — High-level information for executive decision-making. Covers threat landscape trends, geopolitical risks, and emerging threat actor motivations. Audience: C-suite, board. Format: reports, briefings.
- **Tactical intelligence** — Information about attacker tactics, techniques, and procedures (TTPs). Used to improve defenses and detection capabilities. Audience: security architects, SOC managers. Format: TTP reports, MITRE ATT&CK mappings.
- **Operational intelligence** — Specific details about upcoming attacks or campaigns. Includes target information, attack timing, and infrastructure. Audience: incident responders, threat hunters. Format: alerts, advisories.
- **Technical intelligence** — Machine-readable indicators (IPs, domains, file hashes) used for automated detection. Audience: security tools (SIEM, IDS, firewall). Format: IOC feeds.

## 1.2 Indicators of Compromise (IOCs)

IOCs are artifacts that indicate a system or network has been compromised. They are used to detect ongoing attacks and investigate past incidents.

**Network IOCs:**
- IP addresses associated with known threat actors or C2 infrastructure
- Domain names used for phishing, malware distribution, or C2
- URLs of exploit kits, malware download sites, or phishing pages
- Network traffic patterns (unusual ports, protocols, or volumes)

**Host IOCs:**
- File hashes (MD5, SHA-1, SHA-256) of known malware
- Suspicious file names or paths
- Registry key modifications associated with malware persistence
- Unusual process behavior or parent-child process relationships
- Unexpected scheduled tasks or services

**Email IOCs:**
- Sender addresses or domains associated with phishing campaigns
- Subject lines and email content patterns
- Malicious attachment hashes
- Embedded URLs in phishing emails

**Behavioral IOCs:**
- Login from unusual locations or impossible travel
- Spike in failed authentication attempts
- Large data transfers outside business hours
- Use of unauthorized remote access tools

## 1.3 MITRE ATT&CK Framework

MITRE ATT&CK (Adversarial Tactics, Techniques, and Common Knowledge) is a globally accessible knowledge base of adversary TTPs based on real-world observations.

- **Tactics** — The "why" — the adversary's goal for each phase (e.g., initial access, execution, persistence, privilege escalation, defense evasion, credential access, discovery, lateral movement, collection, exfiltration, command and control, impact)
- **Techniques** — The "how" — specific methods to achieve a tactic (e.g., phishing under initial access, PowerShell under execution)
- **Sub-techniques** — More granular detail (e.g., spear phishing attachment, spear phishing link under phishing)
- **Procedures** — Specific implementations used by threat actors

ATT&CK is used for: threat intelligence mapping, detection engineering, red/blue team exercises, gap analysis, and security tool evaluation.

## 1.4 Cyber Kill Chain

Lockheed Martin's Cyber Kill Chain describes the stages of a cyberattack:

1. **Reconnaissance** — Gathering information about the target
2. **Weaponization** — Creating a deliverable payload (exploit + backdoor)
3. **Delivery** — Transmitting the weapon to the target (email, web, USB)
4. **Exploitation** — Triggering the payload to exploit a vulnerability
5. **Installation** — Installing malware for persistent access
6. **Command and Control (C2)** — Establishing a channel for remote control
7. **Actions on Objectives** — Achieving the attacker's goal (data exfiltration, destruction, ransomware)

Defense should aim to break the kill chain as early as possible. Blocking at the delivery phase prevents the attack from progressing.`,
      examTip: `Know the four intelligence types: strategic (executives), tactical (TTPs), operational (specific attacks), technical (IOCs for tools). MITRE ATT&CK organizes adversary behavior into tactics (goals) and techniques (methods). The Cyber Kill Chain has 7 phases — breaking the chain early is most effective. Both frameworks are heavily tested.`,
      importantNote: `MITRE ATT&CK and the Cyber Kill Chain serve different purposes. ATT&CK maps specific adversary behaviors for detection. The Kill Chain models attack progression for strategic defense. Many organizations use both — ATT&CK for detection engineering and Kill Chain for understanding attack flow.`,
    },
    {
      id: 'threat-sharing',
      title: `2. Threat Intelligence Sharing`,
      content: `Sharing threat intelligence across organizations significantly improves collective defense. Standardized formats and platforms enable automated sharing at scale.

## 2.1 Sharing Formats

- **STIX (Structured Threat Information eXpression)** — A standardized language for describing cyber threat information. Defines objects for threat actors, campaigns, indicators, malware, vulnerabilities, and relationships between them. JSON-based format.
- **TAXII (Trusted Automated eXchange of Indicator Information)** — A transport protocol for sharing STIX data. Defines how threat intelligence is communicated between systems using a client-server model.
  - **Collection** — A set of STIX objects available from a TAXII server
  - **Channel** — A mechanism for publishing threat intelligence to subscribers

STIX defines WHAT to share; TAXII defines HOW to share it.

- **OpenIOC** — Open framework for sharing IOC information, developed by Mandiant/FireEye. XML-based format.
- **CybOX (Cyber Observable eXpression)** — Now incorporated into STIX 2.0, defines standardized schema for observable objects.

## 2.2 Intelligence Sharing Organizations

- **ISACs (Information Sharing and Analysis Centers)** — Sector-specific organizations for sharing threat intelligence. Examples: FS-ISAC (financial), H-ISAC (healthcare), IT-ISAC (information technology), A-ISAC (automotive).
- **ISAOs (Information Sharing and Analysis Organizations)** — More flexible sharing organizations not limited to specific sectors.
- **CISA (Cybersecurity and Infrastructure Security Agency)** — US government agency that shares threat intelligence and publishes advisories.
- **Threat intelligence platforms** — Commercial and open-source platforms for aggregating, analyzing, and distributing threat intelligence (MISP, ThreatConnect, Anomali).

## 2.3 Threat Hunting

Threat hunting is the proactive search for threats that have evaded existing detection mechanisms. Unlike reactive security (waiting for alerts), threat hunting assumes adversaries may already be in the network.

**Hunting approaches:**
- **Hypothesis-driven** — Start with a hypothesis based on intelligence (e.g., "APT29 targets our sector using spear phishing with DLL sideloading — are there indicators of this in our environment?")
- **IOC-driven** — Search for specific indicators from threat intelligence feeds
- **Analytics-driven** — Use statistical analysis, machine learning, or behavioral analytics to identify anomalies
- **TTP-driven** — Search for specific adversary techniques mapped to MITRE ATT&CK

**Hunting process:**
1. Develop hypothesis based on threat intelligence
2. Collect and analyze relevant data (logs, network traffic, endpoint telemetry)
3. Investigate anomalies and suspicious activity
4. Document findings and create new detection rules
5. Update threat intelligence and share discoveries

Effective threat hunting requires: skilled analysts, comprehensive logging and telemetry, threat intelligence, and appropriate tools (SIEM, EDR, network analysis).`,
      examTip: `STIX = what to share (threat intelligence format); TAXII = how to share (transport protocol). ISACs are sector-specific sharing organizations. Threat hunting is PROACTIVE (assumes breach), not reactive (waits for alerts). Know that hypothesis-driven hunting starts with intelligence-based assumptions about adversary activity.`,
    },
    {
      id: 'domain1-threat-intel-quiz',
      title: `Threat Intelligence Practice Questions`,
      content: ``,
      quiz: [
        {
          question: `Which standard defines HOW cyber threat intelligence is shared between organizations?`,
          options: ["STIX", "TAXII", "CVE", "MITRE ATT&CK"],
          correctIndex: 1,
          explanation: `TAXII (Trusted Automated eXchange of Indicator Information) is the transport protocol that defines how threat intelligence is communicated between systems. STIX defines the format (what to share). CVE identifies vulnerabilities. MITRE ATT&CK catalogs adversary tactics and techniques. Remember: STIX = what, TAXII = how.`,
        },
        {
          question: `A threat hunter begins an investigation based on intelligence that a specific threat actor targets their industry using a known attack technique. What type of threat hunting is this?`,
          options: ["IOC-driven", "Analytics-driven", "Hypothesis-driven", "Signature-driven"],
          correctIndex: 2,
          explanation: `Hypothesis-driven threat hunting starts with an intelligence-based assumption about adversary activity. The hunter hypothesizes that a specific threat actor may be targeting their environment and searches for evidence. IOC-driven searches for specific indicators. Analytics-driven uses statistical analysis. "Signature-driven" is a detection method, not a hunting approach.`,
        },
        {
          question: `In the MITRE ATT&CK framework, what do "tactics" represent?`,
          options: ["Specific tools used by attackers", "The attacker's strategic goals for each phase", "Vulnerability identifiers", "Defense countermeasures"],
          correctIndex: 1,
          explanation: `In MITRE ATT&CK, tactics represent the adversary's goals — the "why" behind each phase of an attack (initial access, persistence, privilege escalation, etc.). Techniques describe the "how" — specific methods to achieve those goals. ATT&CK does not catalog tools directly or provide defense countermeasures (though mitigations are included).`,
        },
        {
          question: `At which phase of the Cyber Kill Chain is it MOST effective to stop an attack?`,
          options: ["Actions on Objectives", "Command and Control", "Delivery", "Exploitation"],
          correctIndex: 2,
          explanation: `Stopping an attack at the Delivery phase (before the payload reaches the target) is most effective because it prevents the entire attack from progressing. Each subsequent phase means the attacker has already achieved more of their goals. By Actions on Objectives, the attacker has already achieved their primary goal.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'Threat intelligence types: strategic (executives), tactical (TTPs), operational (campaigns), technical (IOCs)',
    'STIX defines the format for sharing threat intelligence; TAXII defines the transport protocol',
    'MITRE ATT&CK: tactics = adversary goals (why), techniques = methods (how)',
    'Cyber Kill Chain: 7 phases from reconnaissance to actions on objectives — block early for maximum effect',
    'Threat hunting is proactive, assuming adversaries may already be present in the network',
  ],
},

// ═══════════════════════════════════════════════════════════════
// DOMAIN 2 — Security Architecture (21%)
// ═══════════════════════════════════════════════════════════════

sp_frameworks: {
  topicId: 'sp_frameworks',
  title: `Security Frameworks & Models`,
  domainWeight: '21%',
  overview: `Security frameworks provide structured approaches to implementing, managing, and improving an organization's security posture. Understanding major frameworks, their purposes, and when to apply them is essential for Security+ certification and real-world security architecture.`,
  sections: [
    {
      id: 'frameworks-overview',
      title: `1. Major Security Frameworks`,
      content: `Security frameworks provide standardized approaches to managing cybersecurity risk. Organizations select frameworks based on their industry, regulatory requirements, and maturity level.

## 1.1 NIST Cybersecurity Framework (CSF)

The NIST CSF is the most widely adopted cybersecurity framework in the United States. It provides a common language and systematic methodology for managing cybersecurity risk.

**Five Core Functions:**
1. **Identify** — Understand the organization's environment to manage cybersecurity risk. Asset management, business environment, governance, risk assessment, risk management strategy.
2. **Protect** — Implement safeguards to ensure delivery of critical services. Access control, awareness training, data security, information protection processes, maintenance, protective technology.
3. **Detect** — Identify cybersecurity events. Anomalies and events, security continuous monitoring, detection processes.
4. **Respond** — Take action regarding detected cybersecurity events. Response planning, communications, analysis, mitigation, improvements.
5. **Recover** — Restore capabilities impaired by cybersecurity events. Recovery planning, improvements, communications.

**Implementation Tiers:**
- Tier 1: Partial — Ad hoc, reactive
- Tier 2: Risk Informed — Approved but not organization-wide
- Tier 3: Repeatable — Formally approved, regularly updated
- Tier 4: Adaptive — Continuous improvement, real-time adaptation

## 1.2 NIST Risk Management Framework (RMF)

NIST SP 800-37 defines a six-step process for managing information security risk. Mandatory for US federal agencies.

1. **Prepare** — Establish context and priorities for managing security and privacy risk
2. **Categorize** — Categorize the system and information based on impact analysis (using FIPS 199: low, moderate, high)
3. **Select** — Select appropriate security controls from NIST SP 800-53
4. **Implement** — Implement the selected controls and document how they are deployed
5. **Assess** — Evaluate whether controls are implemented correctly and operating as intended
6. **Authorize** — Senior official makes a risk-based decision to authorize system operation
7. **Monitor** — Continuously monitor controls and system environment for changes

## 1.3 ISO/IEC 27001 and 27002

- **ISO 27001** — International standard specifying requirements for an Information Security Management System (ISMS). Organizations can achieve formal certification through independent audits. Follows the Plan-Do-Check-Act (PDCA) cycle.
- **ISO 27002** — Provides best practice guidance and implementation details for the security controls referenced in ISO 27001. Not certifiable — it's a reference document.

## 1.4 CIS Controls

The Center for Internet Security (CIS) provides a prioritized set of 18 critical security controls (v8) based on real-world attack data. Organized into three implementation groups (IGs):

- **IG1** — Essential cyber hygiene (basic safeguards for all organizations)
- **IG2** — For organizations with more complexity and data sensitivity
- **IG3** — For organizations with significant security resources and expertise

## 1.5 Zero Trust Architecture

Zero Trust is a security model based on the principle "never trust, always verify." It assumes that threats exist both inside and outside the network.

**Core principles:**
- **Verify explicitly** — Always authenticate and authorize based on all available data (identity, location, device health, service, data classification, anomalies)
- **Least privilege access** — Limit access to only what is needed for the current task, using just-in-time and just-enough-access
- **Assume breach** — Minimize blast radius and segment access. Verify end-to-end encryption, use analytics for detection

**Key components:**
- Identity verification (strong authentication, MFA)
- Device validation (health checks, compliance verification)
- Micro-segmentation (granular network segments)
- Software-defined perimeter (SDP)
- Continuous monitoring and validation
- Policy enforcement points at every access request

NIST SP 800-207 defines the zero trust architecture standard.`,
      examTip: `NIST CSF has 5 functions: Identify, Protect, Detect, Respond, Recover. NIST RMF has 7 steps starting with Prepare. Zero Trust = "never trust, always verify" + assume breach + least privilege. ISO 27001 is certifiable (ISMS requirements), ISO 27002 is not (best practice guidance). The exam tests these distinctions heavily.`,
      importantNote: `Zero Trust is NOT a product — it's an architecture and philosophy. No single vendor solution provides zero trust. It requires identity management, device management, network segmentation, and continuous monitoring working together.`,
    },
    {
      id: 'security-models',
      title: `2. Security Models and Concepts`,
      content: `Security models provide formal frameworks for implementing access controls and information flow policies.

## 2.1 Defense in Depth

Defense in depth (layered security) implements multiple overlapping security controls so that if one layer fails, others continue to provide protection.

**Layers:**
- Physical — Locks, fences, guards, mantraps, surveillance cameras
- Network — Firewalls, IDS/IPS, network segmentation, VLANs
- Host — Operating system hardening, endpoint protection, host-based firewalls
- Application — Secure coding, WAF, input validation, authentication
- Data — Encryption, DLP, access controls, backup
- Administrative — Policies, procedures, training, awareness
- Technical — All technology-based controls

## 2.2 CIA Triad

The foundation of information security:

- **Confidentiality** — Information is accessible only to authorized individuals. Controls: encryption, access controls, data classification. Threats: unauthorized disclosure, data breaches, eavesdropping.
- **Integrity** — Information is accurate, complete, and unmodified by unauthorized parties. Controls: hashing, digital signatures, access controls, version control. Threats: unauthorized modification, data tampering.
- **Availability** — Information and systems are accessible when needed by authorized users. Controls: redundancy, backups, load balancing, DDoS protection. Threats: DoS attacks, hardware failure, natural disasters.

## 2.3 AAA Framework

- **Authentication** — Verifying identity (who are you?)
- **Authorization** — Determining permissions (what can you do?)
- **Accounting** — Tracking activity (what did you do?)

AAA is implemented through protocols like RADIUS, TACACS+, and Kerberos.

## 2.4 Shared Responsibility Model

In cloud computing, security responsibilities are divided between the cloud provider and the customer:

- **IaaS** — Provider manages physical security, hypervisor. Customer manages OS, applications, data, access control.
- **PaaS** — Provider additionally manages OS and runtime. Customer manages applications and data.
- **SaaS** — Provider manages everything except user access and data classification.

The customer ALWAYS retains responsibility for their data, identity management, and access controls regardless of cloud model.

## 2.5 Security Control Categories

Controls are classified by their function:
- **Preventive** — Stop threats before they occur (firewalls, encryption, access controls)
- **Detective** — Identify threats that have occurred (IDS, SIEM, log analysis, auditing)
- **Corrective** — Remediate after an incident (patching, restoring from backup)
- **Deterrent** — Discourage threats (warning banners, security cameras, security guards)
- **Compensating** — Alternative controls when primary controls cannot be implemented
- **Physical** — Tangible controls (locks, fences, guards)
- **Technical (Logical)** — Technology-based controls (firewalls, encryption)
- **Administrative (Managerial)** — Policy and procedure-based controls (training, policies)`,
      examTip: `Know control categories cold: preventive, detective, corrective, deterrent, compensating, plus physical/technical/administrative classifications. The exam will give scenarios and ask you to identify the control type. Defense in depth = layered security. The shared responsibility model ALWAYS leaves data and identity management with the customer.`,
    },
    {
      id: 'domain2-frameworks-quiz',
      title: `Security Frameworks Practice Questions`,
      content: ``,
      quiz: [
        {
          question: `Which NIST CSF function involves implementing safeguards to ensure delivery of critical services?`,
          options: ["Identify", "Protect", "Detect", "Respond"],
          correctIndex: 1,
          explanation: `Protect implements safeguards including access control, training, data security, and protective technology. Identify understands the environment. Detect identifies security events. Respond takes action on detected events.`,
        },
        {
          question: `An organization deploys firewalls, IDS, endpoint protection, and encryption. What security principle does this represent?`,
          options: ["Least privilege", "Defense in depth", "Zero trust", "Separation of duties"],
          correctIndex: 1,
          explanation: `Defense in depth (layered security) implements multiple overlapping controls across different layers (network, host, data). If one control fails, others provide continued protection. Least privilege limits access. Zero trust verifies every request. Separation of duties divides responsibilities.`,
        },
        {
          question: `In a SaaS cloud model, which security responsibility ALWAYS remains with the customer?`,
          options: ["Physical server security", "Operating system patching", "Data classification and access control", "Network infrastructure"],
          correctIndex: 2,
          explanation: `Regardless of cloud model (IaaS, PaaS, SaaS), the customer always retains responsibility for their data (classification, handling) and identity/access management. In SaaS, the provider manages everything else including physical security, OS, applications, and infrastructure.`,
        },
        {
          question: `A security camera installed at the entrance of a data center is an example of what type of control?`,
          options: ["Preventive technical control", "Detective physical control", "Deterrent physical control", "Corrective administrative control"],
          correctIndex: 2,
          explanation: `A visible security camera serves primarily as a deterrent physical control — its presence discourages unauthorized access. While cameras also have detective capability (recording incidents), their primary function when visibly placed is deterrence. The camera is physical (tangible), not technical or administrative.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'NIST CSF: Identify, Protect, Detect, Respond, Recover — five core functions for managing cybersecurity risk',
    'Zero Trust: never trust, always verify; assume breach; least privilege access — it is a philosophy, not a product',
    'ISO 27001 is certifiable (ISMS requirements); ISO 27002 is guidance only',
    'Defense in depth implements multiple overlapping security layers',
    'Shared responsibility: customers ALWAYS own data classification and access control in any cloud model',
  ],
},

sp_network_design: {
  topicId: 'sp_network_design',
  title: `Secure Network Design`,
  domainWeight: '21%',
  overview: `Secure network design implements architecture patterns that protect data, control access, and limit the impact of security incidents. This topic covers network segmentation, perimeter defense, secure protocols, and modern network architectures including software-defined networking.`,
  sections: [
    {
      id: 'network-segmentation',
      title: `1. Network Segmentation and Architecture`,
      content: `Network segmentation divides a network into isolated segments, limiting lateral movement and containing breaches.

## 1.1 Network Zones

- **DMZ (Demilitarized Zone)** — A network segment between the internal network and the internet. Hosts internet-facing services (web servers, email gateways, DNS) while protecting the internal network. Typically uses dual firewalls: one between internet and DMZ, another between DMZ and internal network.
- **Intranet** — Private internal network accessible only to organization members. Contains internal applications, file servers, and sensitive data.
- **Extranet** — Extended network segment providing controlled access to external partners, vendors, or customers. More access than the internet-facing DMZ but less than the full intranet.
- **Guest network** — Isolated network for visitors and untrusted devices, providing internet access without access to internal resources.
- **Management network** — Dedicated segment for network device management (routers, switches, firewalls). Isolated from production traffic to prevent management interface compromise.

## 1.2 VLANs (Virtual Local Area Networks)

VLANs create logical network segments on a single physical switch infrastructure. Devices on different VLANs cannot communicate without routing through a firewall or router, enabling access control between segments.

- **Port-based VLANs** — Switch ports are assigned to specific VLANs
- **802.1Q tagging** — VLAN tags added to Ethernet frames to identify VLAN membership across trunk links between switches
- **Native VLAN** — Untagged traffic on a trunk is assigned to the native VLAN. VLAN hopping attacks exploit the native VLAN — always change the default native VLAN and avoid using it for user traffic

**Security benefits:**
- Contain broadcast domains
- Isolate sensitive systems (PCI, HIPAA)
- Limit lateral movement after compromise
- Apply different security policies per segment

## 1.3 Micro-segmentation

Micro-segmentation extends network segmentation to the workload level, applying security policies to individual servers, applications, or containers rather than network segments.

- Implemented through software-defined networking (SDN) or host-based firewalls
- Enables zero trust at the network level — every workload-to-workload communication is verified
- Particularly important in data center and cloud environments where traditional perimeter security is insufficient

## 1.4 Network Access Control (NAC)

NAC ensures that devices meet security requirements before being granted network access.

- **Pre-admission** — Checks device compliance (patches, antivirus, configuration) before granting access
- **Post-admission** — Monitors devices after connection for continued compliance
- **Agent-based** — Software installed on devices for deeper compliance checking
- **Agentless** — Assesses devices without installing software (useful for IoT and BYOD)
- **802.1X** — Port-based network access control standard. Requires a supplicant (client), authenticator (switch/AP), and authentication server (RADIUS). Devices must authenticate before receiving network access.

## 1.5 Software-Defined Networking (SDN) and SD-WAN

- **SDN** — Separates the control plane (routing decisions) from the data plane (packet forwarding). A centralized controller manages network behavior through software, enabling dynamic security policy enforcement and rapid reconfiguration.
- **SD-WAN** — Applies SDN principles to wide area networks. Provides centralized management of WAN connections, traffic routing based on application requirements, and built-in encryption. Replaces traditional MPLS with more flexible, often internet-based connectivity.

## 1.6 Jump Server / Bastion Host

A hardened server that acts as the single access point for administering systems in a different security zone. All administrative connections must pass through the jump server, which logs and controls access. This creates a choke point for monitoring and auditing administrative activity.`,
      examTip: `DMZ hosts internet-facing services between two firewalls. VLANs provide logical segmentation — change the default native VLAN to prevent VLAN hopping. 802.1X requires three components: supplicant, authenticator, authentication server (RADIUS). Micro-segmentation = workload-level segmentation for zero trust. Know these concepts for scenario questions.`,
      importantNote: `Network segmentation is the single most effective control for limiting lateral movement after a breach. If an attacker compromises one segment, proper segmentation prevents them from reaching other parts of the network.`,
    },
    {
      id: 'network-security-devices',
      title: `2. Network Security Devices and Protocols`,
      content: `Understanding the role and placement of network security devices is essential for secure network design.

## 2.1 Firewalls

- **Packet filtering** — Inspects individual packets based on source/destination IP, port, and protocol. Operates at OSI Layers 3-4. Fast but limited inspection.
- **Stateful inspection** — Tracks the state of network connections. Only allows packets that belong to established, legitimate connections. More secure than packet filtering.
- **Next-Generation Firewall (NGFW)** — Combines stateful inspection with application awareness, deep packet inspection (DPI), IPS, URL filtering, and threat intelligence. Operates at OSI Layer 7 (application layer).
- **Web Application Firewall (WAF)** — Specifically protects web applications by filtering HTTP/HTTPS traffic. Defends against SQLi, XSS, CSRF, and other web attacks. Can be hardware, software, or cloud-based.

## 2.2 Intrusion Detection and Prevention Systems

- **IDS (Intrusion Detection System)** — Monitors network traffic or host activity and generates alerts when suspicious activity is detected. Passive — does not block traffic.
- **IPS (Intrusion Prevention System)** — Monitors AND actively blocks malicious traffic. Placed inline with network traffic. Can drop packets, reset connections, or block IP addresses.
- **Placement:** IDS can be out-of-band (monitoring a copy of traffic). IPS must be inline (traffic flows through it).

**Detection methods:**
- **Signature-based** — Matches traffic against a database of known attack patterns. Accurate for known threats but cannot detect zero-day attacks.
- **Anomaly-based (behavioral)** — Establishes a baseline of normal activity and alerts on deviations. Can detect zero-day attacks but produces more false positives.
- **Heuristic** — Uses rules and algorithms to identify potentially malicious behavior based on characteristics common to malware.

## 2.3 Proxy Servers

- **Forward proxy** — Sits between internal users and the internet. Intercepts outbound requests, can filter content, cache responses, and provide anonymity.
- **Reverse proxy** — Sits between the internet and internal servers. Intercepts inbound requests, provides load balancing, SSL offloading, caching, and hides internal server architecture.
- **Transparent proxy** — Intercepts traffic without requiring client configuration. Users may not know the proxy exists.

## 2.4 Load Balancers

Distribute traffic across multiple servers for performance and availability. Security functions include SSL/TLS offloading, health monitoring, and protection against server overload. Can detect and isolate compromised backend servers.

## 2.5 Secure Protocols

| Insecure Protocol | Secure Replacement | Description |
|---|---|---|
| HTTP | HTTPS (TLS) | Web traffic encryption |
| Telnet | SSH | Secure remote administration |
| FTP | SFTP or FTPS | Secure file transfer |
| SNMP v1/v2 | SNMP v3 | Network management with encryption |
| LDAP | LDAPS | Secure directory queries |
| IMAP/POP3 | IMAPS/POP3S | Secure email retrieval |
| SMTP | SMTPS/STARTTLS | Secure email transmission |
| DNS | DNSSEC / DoH / DoT | Secure name resolution |
| RDP (unencrypted) | RDP with NLA + TLS | Secure remote desktop |

## 2.6 VPN Types

- **Site-to-site VPN** — Connects two networks (offices) through an encrypted tunnel. Uses IPSec.
- **Remote access VPN** — Individual users connect to the corporate network. Can use IPSec or SSL/TLS.
- **Split tunnel** — Only corporate-bound traffic goes through the VPN; internet traffic goes directly. Reduces VPN load but provides less control over user internet traffic.
- **Full tunnel** — ALL traffic routes through the VPN. Maximum security and visibility but higher latency and VPN bandwidth requirements.
- **Always-on VPN** — Automatically establishes a VPN connection whenever the device connects to a network.

**VPN Protocols:**
- **IPSec** — Network layer VPN. Uses ESP (Encryption) and AH (Authentication). Tunnel mode encrypts the entire packet; transport mode encrypts only the payload.
- **SSL/TLS VPN** — Application layer VPN. Runs over HTTPS (port 443), making it firewall-friendly.
- **WireGuard** — Modern, lightweight VPN protocol with simple configuration and strong performance.`,
      examTip: `Know the secure replacements: Telnet→SSH, HTTP→HTTPS, FTP→SFTP, SNMP v1/v2→v3. IDS is passive (alerts only), IPS is inline (blocks). NGFW = stateful + DPI + application awareness + IPS. Split tunnel = partial VPN routing; full tunnel = all traffic through VPN. IPSec tunnel mode = full packet encryption; transport mode = payload only.`,
    },
    {
      id: 'domain2-network-design-quiz',
      title: `Secure Network Design Practice Questions`,
      content: ``,
      quiz: [
        {
          question: `An organization needs to host a public web server while protecting internal network resources. Where should the web server be placed?`,
          options: ["Internal network", "DMZ", "Management network", "Guest network"],
          correctIndex: 1,
          explanation: `The DMZ (Demilitarized Zone) is designed for internet-facing services like web servers. It sits between the external and internal networks, typically protected by dual firewalls. This allows public access to the web server while isolating the internal network from direct internet exposure.`,
        },
        {
          question: `Which technology implements port-based network access control requiring a supplicant, authenticator, and authentication server?`,
          options: ["VLAN", "802.1X", "NAT", "SD-WAN"],
          correctIndex: 1,
          explanation: `802.1X is the IEEE standard for port-based network access control. It requires three components: a supplicant (client software), an authenticator (switch or wireless access point), and an authentication server (typically RADIUS). Devices must authenticate before receiving network access.`,
        },
        {
          question: `A security device monitors network traffic inline and actively blocks packets that match known attack signatures. What is this device?`,
          options: ["IDS", "IPS", "SIEM", "Proxy server"],
          correctIndex: 1,
          explanation: `An IPS (Intrusion Prevention System) operates inline and actively blocks malicious traffic. IDS is passive — it monitors and alerts but does not block. SIEM aggregates and analyzes logs. A proxy server handles client requests but doesn't perform signature-based attack detection.`,
        },
        {
          question: `Which VPN mode encrypts the entire IP packet, including the original headers?`,
          options: ["Transport mode", "Tunnel mode", "Split tunnel", "Full tunnel"],
          correctIndex: 1,
          explanation: `IPSec tunnel mode encrypts the entire original IP packet (headers + payload) and encapsulates it in a new IP packet. Transport mode only encrypts the payload, leaving the original headers visible. Split tunnel and full tunnel refer to routing decisions, not encryption scope.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'DMZ isolates internet-facing services between two firewalls, protecting the internal network',
    '802.1X provides port-based NAC with supplicant, authenticator, and RADIUS authentication server',
    'Micro-segmentation applies security policies at the workload level for zero trust networking',
    'IDS = passive/alerts, IPS = inline/blocks; NGFW combines stateful inspection with application awareness',
    'Always replace insecure protocols: Telnet→SSH, HTTP→HTTPS, FTP→SFTP, SNMP v1/v2→v3',
  ],
},

sp_cloud: {
  topicId: 'sp_cloud',
  title: `Cloud Security`,
  domainWeight: '21%',
  overview: `Cloud computing introduces unique security challenges around shared responsibility, data sovereignty, multi-tenancy, and visibility. Understanding cloud service models, deployment models, and cloud-native security controls is essential for protecting modern infrastructure.`,
  sections: [
    {
      id: 'cloud-models',
      title: `1. Cloud Service and Deployment Models`,
      content: `Cloud security starts with understanding the service models and how security responsibilities are divided.

## 1.1 Cloud Service Models

- **IaaS (Infrastructure as a Service)** — Provider manages physical hardware, networking, and virtualization. Customer manages operating systems, applications, data, and security configurations. Examples: AWS EC2, Azure VMs, Google Compute Engine. Customer has the MOST control and MOST security responsibility.
- **PaaS (Platform as a Service)** — Provider additionally manages the OS, runtime, and middleware. Customer manages applications and data. Examples: AWS Elastic Beanstalk, Azure App Service, Google App Engine.
- **SaaS (Software as a Service)** — Provider manages everything including the application. Customer manages user access, data classification, and configuration. Examples: Microsoft 365, Salesforce, Google Workspace. Customer has the LEAST control and LEAST security responsibility.

**Memory aid:** IaaS = most customer responsibility → SaaS = least customer responsibility. But data and identity management are ALWAYS the customer's responsibility.

## 1.2 Cloud Deployment Models

- **Public cloud** — Resources shared among multiple tenants over the internet. Cost-effective, scalable, but less control. Security depends on provider controls and customer configuration.
- **Private cloud** — Dedicated infrastructure for a single organization. More control and customization. Can be on-premises or hosted by a provider. Higher cost.
- **Hybrid cloud** — Combines public and private cloud. Sensitive data stays in private cloud; less sensitive workloads use public cloud. Requires careful data classification and access management.
- **Community cloud** — Shared infrastructure among organizations with common requirements (government, healthcare). Cost-sharing with aligned security needs.
- **Multi-cloud** — Using services from multiple cloud providers. Reduces vendor lock-in but increases management complexity.

## 1.3 Cloud-Specific Threats

- **Data breaches** — Misconfigured storage (S3 buckets, Azure Blobs with public access) is the #1 cause of cloud data breaches
- **Misconfiguration** — Overly permissive IAM policies, open security groups, disabled encryption, public-facing databases
- **Insecure APIs** — Cloud management and service APIs with weak authentication, missing authorization, or excessive data exposure
- **Account hijacking** — Stolen cloud credentials provide broad access to infrastructure and data
- **Insufficient logging** — Not enabling or monitoring cloud audit logs (CloudTrail, Azure Monitor)
- **Data sovereignty** — Data stored in cloud regions may be subject to local laws and regulations
- **Vendor lock-in** — Heavy reliance on provider-specific services makes migration difficult

## 1.4 Cloud Responsibility Matrix

| Layer | IaaS Customer | PaaS Customer | SaaS Customer |
|---|---|---|---|
| Data | ✓ | ✓ | ✓ |
| Identity/Access | ✓ | ✓ | ✓ |
| Applications | ✓ | ✓ | — |
| Runtime/Middleware | ✓ | — | — |
| Operating System | ✓ | — | — |
| Networking | Partial | — | — |
| Physical/Hypervisor | — | — | — |`,
      examTip: `Misconfigured cloud storage (public S3 buckets) is the #1 cause of cloud data breaches. The customer ALWAYS manages data and identity regardless of cloud model. IaaS = most customer responsibility, SaaS = least. The exam loves questions about who is responsible for what in each model.`,
    },
    {
      id: 'cloud-security-controls',
      title: `2. Cloud Security Controls and Tools`,
      content: `Cloud-native security tools and third-party solutions address the unique challenges of cloud environments.

## 2.1 Cloud Access Security Broker (CASB)

A CASB sits between cloud users and cloud providers to enforce security policies, provide visibility, and ensure compliance.

**Functions:**
- **Visibility** — Discover all cloud services used by the organization (shadow IT detection)
- **Compliance** — Ensure cloud usage meets regulatory requirements (GDPR, HIPAA, PCI-DSS)
- **Data security** — DLP for cloud services, encryption, tokenization, access control
- **Threat protection** — Detect anomalous behavior, malware, unauthorized access

**Deployment modes:**
- **Forward proxy** — Intercepts traffic from managed devices to cloud services
- **Reverse proxy** — Intercepts traffic at the cloud service, works with unmanaged devices
- **API-based** — Connects directly to cloud provider APIs for out-of-band monitoring

## 2.2 Cloud Workload Protection Platforms (CWPP)

Protect workloads (VMs, containers, serverless functions) across cloud environments. Features include vulnerability management, compliance monitoring, runtime protection, and network segmentation.

## 2.3 Cloud Security Posture Management (CSPM)

Continuously monitors cloud configurations for security misconfigurations and compliance violations. Automatically detects issues like:
- Public storage buckets
- Overly permissive security groups
- Unencrypted databases
- Missing MFA on admin accounts
- Disabled audit logging

## 2.4 Infrastructure as Code (IaC) Security

IaC tools (Terraform, CloudFormation, Ansible) define infrastructure in code. Security scanning of IaC templates catches misconfigurations before deployment:
- Static analysis of templates for security issues
- Policy-as-code enforcement
- Drift detection (infrastructure diverging from defined state)

## 2.5 Container Security

Containers (Docker, Kubernetes) require specific security considerations:
- **Image security** — Scan container images for vulnerabilities; use trusted base images; don't run as root
- **Registry security** — Secure container registries; sign and verify images
- **Runtime security** — Monitor running containers for anomalous behavior; enforce resource limits
- **Orchestration security** — Secure Kubernetes API, RBAC, network policies, secrets management
- **Immutable infrastructure** — Containers should not be modified at runtime; deploy new versions instead

## 2.6 Serverless Security

Serverless functions (AWS Lambda, Azure Functions) shift more responsibility to the provider but introduce new risks:
- Each function is an attack surface
- Dependencies and libraries may contain vulnerabilities
- Function permissions must follow least privilege
- Cold start data may persist between invocations
- Monitoring and debugging are more challenging

## 2.7 Key Cloud Security Practices

- **Encryption** — Encrypt data at rest and in transit. Use customer-managed keys (CMK) for sensitive data rather than provider-managed keys.
- **IAM policies** — Apply least privilege. Use roles instead of long-term credentials. Enforce MFA for all users, especially administrators.
- **Logging and monitoring** — Enable comprehensive audit logging (CloudTrail, Azure Activity Log). Centralize logs in a SIEM. Set up alerts for critical events.
- **Secrets management** — Use dedicated services (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault) rather than hardcoding credentials in code or configuration files.`,
      examTip: `CASB = security broker between users and cloud (visibility + compliance + data security + threat protection). CSPM = configuration monitoring and compliance checking. Know the deployment modes for CASB (forward proxy, reverse proxy, API). Container security: scan images, don't run as root, use immutable infrastructure. These are heavily tested cloud topics.`,
    },
    {
      id: 'domain2-cloud-quiz',
      title: `Cloud Security Practice Questions`,
      content: ``,
      quiz: [
        {
          question: `An organization discovers that employees are using unauthorized cloud services. Which tool provides visibility into shadow IT and enforces cloud security policies?`,
          options: ["SIEM", "CASB", "WAF", "DLP"],
          correctIndex: 1,
          explanation: `A CASB (Cloud Access Security Broker) provides visibility into all cloud services used by the organization (shadow IT discovery) and enforces security policies for cloud usage. SIEM aggregates logs but doesn't enforce cloud policies. WAF protects web applications. DLP prevents data loss but doesn't provide cloud service visibility.`,
        },
        {
          question: `What is the MOST common cause of cloud data breaches?`,
          options: ["Sophisticated hacking attacks", "Misconfigured cloud storage and services", "Insider threats", "Zero-day vulnerabilities"],
          correctIndex: 1,
          explanation: `Misconfiguration (especially publicly accessible storage buckets and overly permissive security groups) is consistently the #1 cause of cloud data breaches. These are preventable with CSPM tools and proper configuration management. Most cloud breaches are not caused by sophisticated attacks but by basic security oversights.`,
        },
        {
          question: `In a PaaS model, which of the following is the customer's responsibility?`,
          options: ["Physical server security", "Operating system patching", "Application code security", "Hypervisor management"],
          correctIndex: 2,
          explanation: `In PaaS, the customer is responsible for application code, data, and identity management. The provider manages physical infrastructure, hypervisor, OS, runtime, and middleware. Application code security is always the developer's responsibility in PaaS — the platform provides the runtime, but the application logic is the customer's.`,
        },
        {
          question: `A security tool continuously monitors cloud infrastructure configurations and alerts when storage buckets are made publicly accessible. What type of tool is this?`,
          options: ["CASB", "CSPM", "CWPP", "EDR"],
          correctIndex: 1,
          explanation: `CSPM (Cloud Security Posture Management) continuously monitors cloud configurations for security misconfigurations like public storage buckets, open security groups, and missing encryption. CASB brokers access between users and cloud services. CWPP protects cloud workloads. EDR protects endpoints.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'IaaS = most customer security responsibility; SaaS = least; data and identity are ALWAYS customer-owned',
    'Misconfigured cloud storage is the #1 cause of cloud data breaches — use CSPM to detect misconfigurations',
    'CASB provides visibility into shadow IT and enforces cloud security policies across all cloud services',
    'Container security: scan images, use trusted registries, enforce least privilege, implement immutable infrastructure',
    'Always encrypt data at rest and in transit; use customer-managed keys for sensitive data',
  ],
},

sp_virtualization: {
  topicId: 'sp_virtualization',
  title: `Virtualization & Containerization`,
  domainWeight: '21%',
  overview: `Virtualization and containerization are foundational technologies for modern IT infrastructure. Understanding their security implications — including hypervisor attacks, container escape, and serverless risks — is essential for Security+ candidates.`,
  sections: [
    {
      id: 'virtualization-security',
      title: `1. Virtualization Security`,
      content: `Virtualization creates multiple virtual environments on a single physical host, introducing new security considerations around isolation, hypervisor security, and resource management.

## 1.1 Hypervisor Types

- **Type 1 (Bare-metal)** — Runs directly on hardware. Examples: VMware ESXi, Microsoft Hyper-V, Citrix XenServer. More secure because there's no underlying OS to compromise. Used in data centers and enterprise environments.
- **Type 2 (Hosted)** — Runs on top of a host operating system. Examples: VMware Workstation, VirtualBox, Parallels. Less secure because the host OS is an additional attack surface. Used for development and testing.

## 1.2 Virtualization Threats

- **VM escape** — An attacker breaks out of a virtual machine to interact with the hypervisor or other VMs. This is the most serious virtualization threat because it breaks the isolation between VMs. Mitigation: keep hypervisors patched, minimize hypervisor attack surface, use Type 1 hypervisors.
- **VM sprawl** — Uncontrolled proliferation of virtual machines, leading to unpatched, unmonitored, and forgotten VMs that become security liabilities. Mitigation: VM lifecycle management, automated decommissioning, regular inventory.
- **Hyperjacking** — Attacker installs a rogue hypervisor beneath the legitimate one, gaining complete control over all VMs. Mitigation: TPM, Secure Boot, hypervisor integrity monitoring.
- **Resource exhaustion** — A compromised or poorly configured VM consumes excessive CPU, memory, or disk I/O, affecting other VMs on the same host (noisy neighbor). Mitigation: resource quotas, monitoring, capacity planning.
- **Data remnants** — Sensitive data from decommissioned VMs may persist in memory or storage. Mitigation: secure deletion, memory scrubbing, encryption of VM disk files.

## 1.3 Virtual Network Security

- **Virtual switches** — Software-based switches within the hypervisor. Must be configured with the same security rigor as physical switches (VLAN isolation, port security).
- **East-west traffic** — Traffic between VMs on the same host bypasses physical network security devices. Virtual firewalls and micro-segmentation address this blind spot.
- **VM-to-VM isolation** — Ensure VMs on the same host cannot communicate unless explicitly allowed. Use virtual firewalls and network segmentation.

## 1.4 Best Practices

- Keep hypervisors patched and updated
- Use Type 1 hypervisors for production environments
- Implement VM lifecycle management to prevent sprawl
- Monitor east-west traffic between VMs
- Encrypt VM disk files and snapshots
- Implement least privilege for hypervisor management accounts
- Use TPM and Secure Boot to protect hypervisor integrity
- Separate management network for hypervisor administration`,
      examTip: `VM escape is the most critical virtualization threat — it breaks VM isolation. Type 1 hypervisors (bare-metal) are more secure than Type 2 (hosted) because there's no underlying OS. VM sprawl creates unpatched, forgotten VMs. East-west traffic (VM-to-VM) bypasses physical security devices.`,
    },
    {
      id: 'containers-serverless',
      title: `2. Containerization and Serverless Computing`,
      content: `Containers and serverless computing offer efficiency benefits but introduce distinct security challenges.

## 2.1 Container Architecture

Containers share the host OS kernel but isolate applications in user space. They are lighter than VMs (no full OS per instance) but provide less isolation since they share the kernel.

**Docker containers:**
- Defined by Dockerfiles that specify base image, dependencies, and configuration
- Run from images stored in container registries (Docker Hub, Amazon ECR, Azure Container Registry)
- Orchestrated at scale using Kubernetes, Docker Swarm, or similar platforms

## 2.2 Container Security Risks

- **Container escape** — Exploiting kernel vulnerabilities to break out of the container and access the host OS. Since containers share the kernel, a kernel exploit affects all containers on the host.
- **Vulnerable base images** — Using outdated or unverified images with known vulnerabilities. Always scan images and use minimal, trusted base images.
- **Insecure registries** — Pulling images from untrusted or compromised registries. Use image signing (Docker Content Trust, Sigstore) to verify image integrity.
- **Excessive privileges** — Running containers as root or with unnecessary capabilities. Follow least privilege — run as non-root, drop unnecessary Linux capabilities.
- **Secrets exposure** — Hardcoded credentials, API keys, or certificates in container images or environment variables. Use secrets management tools (Kubernetes Secrets, HashiCorp Vault).
- **Supply chain attacks** — Compromised dependencies in container images. Implement Software Bill of Materials (SBOM) and dependency scanning.

## 2.3 Kubernetes Security

Kubernetes is the dominant container orchestration platform. Key security considerations:

- **API server security** — The Kubernetes API is the primary attack surface. Use RBAC, network policies, and audit logging.
- **Pod security** — Use Pod Security Standards (Restricted, Baseline, Privileged) to enforce security contexts.
- **Network policies** — Default allows all pod-to-pod communication. Implement network policies to restrict traffic.
- **Secrets management** — Kubernetes Secrets are base64-encoded, not encrypted by default. Use external secrets managers or enable encryption at rest.
- **RBAC** — Implement fine-grained role-based access control for cluster resources.

## 2.4 Serverless Security

Serverless computing (Functions as a Service — FaaS) executes code without managing servers. Examples: AWS Lambda, Azure Functions, Google Cloud Functions.

**Security considerations:**
- **Function-level permissions** — Each function should have the minimum permissions required (least privilege IAM roles)
- **Event injection** — Attackers may craft malicious events that trigger functions with unexpected input
- **Dependency vulnerabilities** — Functions include libraries that may contain vulnerabilities
- **Cold start data** — Previous execution context may leak to subsequent invocations
- **Monitoring challenges** — Distributed, ephemeral nature makes observability difficult
- **Denial of wallet** — Attackers trigger excessive function invocations to drive up costs

## 2.5 Infrastructure as Code (IaC)

IaC tools manage infrastructure through code definitions rather than manual configuration:
- **Terraform** — Multi-cloud IaC tool using HCL (HashiCorp Configuration Language)
- **CloudFormation** — AWS-specific IaC using JSON/YAML templates
- **Ansible** — Agentless configuration management and IaC

**IaC security:**
- Scan templates for misconfigurations before deployment (Checkov, tfsec, Snyk IaC)
- Store IaC in version control with code review processes
- Implement policy-as-code (Open Policy Agent, Sentinel)
- Detect configuration drift (deployed state differs from code)`,
      examTip: `Containers share the host OS kernel (less isolation than VMs). Container escape exploits kernel vulnerabilities. VMs have stronger isolation because each has its own OS. Key container practices: scan images, don't run as root, use trusted registries, implement SBOM for supply chain security. "Denial of wallet" is the serverless equivalent of DoS.`,
    },
    {
      id: 'domain2-virtualization-quiz',
      title: `Virtualization & Containerization Practice Questions`,
      content: ``,
      quiz: [
        {
          question: `What is the MOST serious security threat to a virtualization environment?`,
          options: ["VM sprawl", "VM escape", "Resource exhaustion", "Data remnants"],
          correctIndex: 1,
          explanation: `VM escape is the most serious threat because it allows an attacker to break out of a virtual machine and interact with the hypervisor or other VMs, completely breaking the isolation model. VM sprawl, resource exhaustion, and data remnants are important but less severe than losing VM isolation.`,
        },
        {
          question: `How do containers differ from virtual machines in terms of isolation?`,
          options: ["Containers provide stronger isolation than VMs", "Containers share the host OS kernel, providing less isolation than VMs", "Containers and VMs provide identical isolation", "Containers don't require any isolation mechanisms"],
          correctIndex: 1,
          explanation: `Containers share the host OS kernel and isolate only at the user space level, providing less isolation than VMs. VMs include their own OS kernel and run on a hypervisor, creating stronger isolation boundaries. A kernel vulnerability on a container host affects all containers, while VMs are more isolated from kernel exploits.`,
        },
        {
          question: `A security team discovers containers running as root with access to all host capabilities. What is the BEST remediation?`,
          options: ["Install antivirus in the containers", "Run containers as non-root users with minimal capabilities", "Move to serverless architecture", "Add a WAF in front of the containers"],
          correctIndex: 1,
          explanation: `Running containers as non-root with dropped unnecessary capabilities follows the principle of least privilege and significantly reduces the impact of a container compromise or escape. Antivirus is less effective in containers. Serverless migration and WAF don't address the root cause of excessive container privileges.`,
        },
        {
          question: `Which hypervisor type is generally considered MORE secure for production environments?`,
          options: ["Type 2 (hosted) because it has OS-level security", "Type 1 (bare-metal) because it has no underlying OS to attack", "Both types offer identical security", "Neither type — physical servers are always more secure"],
          correctIndex: 1,
          explanation: `Type 1 (bare-metal) hypervisors run directly on hardware without an underlying OS, reducing the attack surface. Type 2 hypervisors run on top of a host OS, adding an additional layer that could be compromised. Type 1 is the standard for production and enterprise environments.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'Type 1 (bare-metal) hypervisors are more secure than Type 2 (hosted) — no underlying OS attack surface',
    'VM escape breaks virtualization isolation and is the most critical virtualization threat',
    'Containers share the host kernel — less isolation than VMs; container escape is a key risk',
    'Container security: scan images, run as non-root, use trusted registries, implement secrets management',
    'Serverless "denial of wallet" attacks drive up costs through excessive function invocations',
  ],
},

// ═══════════════════════════════════════════════════════════════
// DOMAIN 3 — Security Implementation (25%)
// ═══════════════════════════════════════════════════════════════

sp_crypto: {
  topicId: 'sp_crypto',
  title: `Cryptography`,
  domainWeight: '25%',
  overview: `Cryptography is the foundation of data confidentiality, integrity, authentication, and non-repudiation. This topic covers symmetric and asymmetric encryption, hashing, digital signatures, PKI, and their practical applications in securing data at rest and in transit.`,
  sections: [
    {
      id: 'crypto-fundamentals',
      title: `1. Cryptographic Concepts and Algorithms`,
      content: `Understanding cryptographic primitives and when to apply each type is essential for Security+ certification.

## 1.1 Symmetric Encryption

Symmetric encryption uses the same key for encryption and decryption. Fast and efficient for large data volumes but requires secure key distribution.

**Algorithms:**
- **AES (Advanced Encryption Standard)** — The standard symmetric algorithm. Key sizes: 128, 192, or 256 bits. Used for bulk data encryption (disk encryption, VPN, TLS data transfer). AES-256 is the gold standard for data at rest.
- **3DES (Triple DES)** — Applies DES three times with different keys. Effective key length of 112 bits. Deprecated and being phased out — use AES instead.
- **ChaCha20** — Modern stream cipher. Fast in software without hardware AES support. Used in TLS 1.3 and WireGuard VPN.
- **Blowfish/Twofish** — Block ciphers used in some applications. Blowfish has a 64-bit block size (vulnerable to birthday attacks on large data).

**Block cipher modes:**
- **ECB (Electronic Codebook)** — Encrypts each block independently. INSECURE — identical plaintext blocks produce identical ciphertext, revealing patterns.
- **CBC (Cipher Block Chaining)** — Each block XORed with the previous ciphertext block. Requires an initialization vector (IV). Secure but not parallelizable.
- **CTR (Counter)** — Uses an incrementing counter. Parallelizable. Turns a block cipher into a stream cipher.
- **GCM (Galois/Counter Mode)** — Provides both encryption AND authentication (AEAD). Used in TLS 1.3 and IPSec. The preferred mode for modern applications.

## 1.2 Asymmetric Encryption

Asymmetric encryption uses a key pair: public key (shared) and private key (kept secret). Slower than symmetric but solves the key distribution problem.

**Algorithms:**
- **RSA** — Most widely used asymmetric algorithm. Key sizes: 2048, 3072, or 4096 bits. Used for key exchange, digital signatures, and encryption of small data (like symmetric keys).
- **Diffie-Hellman (DH)** — Key exchange protocol that allows two parties to establish a shared secret over an insecure channel. Not used for encryption or signing directly. Ephemeral DH (DHE) provides perfect forward secrecy.
- **Elliptic Curve Cryptography (ECC)** — Provides equivalent security to RSA with much smaller key sizes (256-bit ECC ≈ 3072-bit RSA). More efficient for mobile and IoT devices. ECDH for key exchange, ECDSA for digital signatures.

**How asymmetric encryption works:**
- **Encryption:** Sender encrypts with the RECIPIENT's public key. Only the recipient's private key can decrypt.
- **Digital signature:** Sender signs with their OWN private key. Anyone with the sender's public key can verify the signature.

## 1.3 Hashing

Hashing produces a fixed-length output (digest) from any input. One-way function — cannot reverse the hash to recover the original data.

**Properties:**
- Deterministic — Same input always produces the same hash
- Fixed-length output — Regardless of input size
- Avalanche effect — Small input change produces drastically different hash
- Collision resistant — Computationally infeasible to find two inputs producing the same hash

**Algorithms:**
- **SHA-256/SHA-3** — Current standard. SHA-256 produces a 256-bit hash. SHA-3 is the newest member of the SHA family.
- **MD5** — 128-bit hash. BROKEN — collision attacks are trivial. Do not use for security purposes.
- **SHA-1** — 160-bit hash. DEPRECATED — collision attacks demonstrated. Do not use for security purposes.

**Applications:**
- Password storage (with salting and key stretching)
- File integrity verification
- Digital signatures (hash the message, then sign the hash)
- Message authentication codes (HMAC)

## 1.4 Key Stretching and Password Hashing

Key stretching algorithms make brute-force password cracking computationally expensive:
- **bcrypt** — Adaptive hash function with configurable work factor. Standard for password hashing.
- **PBKDF2** — Key derivation function using HMAC with configurable iterations. NIST recommended.
- **Argon2** — Winner of the Password Hashing Competition. Memory-hard, making GPU attacks more difficult.
- **Salting** — Adding random data to each password before hashing prevents rainbow table attacks and ensures identical passwords have different hashes.

## 1.5 Digital Signatures

Digital signatures provide authentication, integrity, and non-repudiation:
1. Sender hashes the message
2. Sender encrypts the hash with their private key (this is the signature)
3. Recipient decrypts the signature using the sender's public key
4. Recipient hashes the received message and compares it to the decrypted hash

If the hashes match: the message hasn't been modified (integrity) and it came from the signer (authentication/non-repudiation).`,
      examTip: `AES is the standard symmetric algorithm. RSA is the standard asymmetric algorithm. Encrypt with recipient's PUBLIC key; sign with YOUR PRIVATE key. MD5 and SHA-1 are broken — never use for security. GCM mode provides both encryption and authentication. Diffie-Hellman is for key EXCHANGE, not encryption. ECC provides equivalent security with smaller keys than RSA.`,
      importantNote: `Perfect forward secrecy means that if a long-term key is compromised, past session keys remain secure. Achieved by using ephemeral (temporary) keys for each session — DHE and ECDHE provide this. Without PFS, capturing encrypted traffic and later stealing the private key allows decryption of all past communications.`,
    },
    {
      id: 'pki-certificates',
      title: `2. PKI and Certificates`,
      content: `Public Key Infrastructure (PKI) provides the trust framework for managing digital certificates and public keys.

## 2.1 PKI Components

- **Certificate Authority (CA)** — Trusted entity that issues, manages, and revokes digital certificates. Verifies the identity of certificate requestors.
  - **Root CA** — The top of the trust hierarchy. Its certificate is self-signed. Root CA private key is the most sensitive asset — should be stored offline (air-gapped).
  - **Intermediate/Subordinate CA** — Issued a certificate by the root CA. Issues certificates to end entities. Provides a layer of protection — if compromised, only its certificates are affected, not the root.
- **Registration Authority (RA)** — Verifies the identity of certificate requestors on behalf of the CA. Does not issue certificates.
- **Certificate Revocation List (CRL)** — A list of revoked certificates published by the CA. Clients check the CRL to verify certificate validity.
- **Online Certificate Status Protocol (OCSP)** — Real-time protocol for checking certificate revocation status. More efficient than downloading entire CRLs. OCSP Stapling: the server includes the OCSP response with its certificate, reducing client lookup latency.
- **Certificate store** — Local repository of trusted CA certificates on a device or browser.

## 2.2 Certificate Types

- **DV (Domain Validation)** — Verifies domain ownership only. Quickest and cheapest. Provides encryption but minimal identity assurance.
- **OV (Organization Validation)** — Verifies domain ownership AND organization identity. Moderate assurance.
- **EV (Extended Validation)** — Rigorous verification of organization identity, physical address, and legal status. Highest assurance level.
- **Wildcard certificate** — Covers a domain and all subdomains (\*.example.com). Convenient but if compromised, all subdomains are affected.
- **SAN (Subject Alternative Name)** — A single certificate covering multiple specific domain names. More flexible than wildcard for different domain names.
- **Self-signed certificate** — Issued and signed by the same entity, not by a trusted CA. Used for internal testing or development. Browsers display warnings for self-signed certificates.
- **Code signing certificate** — Verifies the identity of software publishers and ensures code hasn't been modified.

## 2.3 Certificate Lifecycle

1. **Key generation** — Generate a public/private key pair
2. **Certificate Signing Request (CSR)** — Submit the public key and identity information to a CA
3. **Validation** — CA verifies the requestor's identity
4. **Issuance** — CA signs and issues the certificate
5. **Usage** — Certificate used for TLS, signing, authentication
6. **Renewal** — Certificate renewed before expiration
7. **Revocation** — Certificate revoked if compromised or no longer needed (CRL or OCSP)
8. **Expiration** — Certificate becomes invalid after its validity period

## 2.4 TLS (Transport Layer Security)

TLS encrypts data in transit between clients and servers. TLS 1.3 is the current standard.

**TLS 1.3 improvements over TLS 1.2:**
- Reduced handshake from 2 round trips to 1 (0-RTT resumption possible)
- Removed insecure algorithms (RC4, 3DES, MD5, SHA-1, static RSA/DH)
- Only supports AEAD ciphers (AES-GCM, ChaCha20-Poly1305)
- Perfect forward secrecy is mandatory (only ephemeral key exchange)
- Simpler, more secure cipher suite negotiation

**TLS 1.2 should be the minimum acceptable version.** TLS 1.0 and 1.1 are deprecated and should be disabled.

## 2.5 Certificate Pinning

Certificate pinning associates a host with its expected public key or certificate, preventing on-path attacks that use fraudulent certificates from compromised CAs. If the presented certificate doesn't match the pinned certificate, the connection is rejected.`,
      examTip: `Root CA private key should be offline/air-gapped. CRL is a list of revoked certificates; OCSP provides real-time status checks. DV = domain only, OV = domain + org, EV = rigorous verification. TLS 1.3 requires PFS and only allows AEAD ciphers. Self-signed certificates are NOT trusted by browsers. Wildcard certificates cover *.domain.com (one level of subdomain).`,
    },
    {
      id: 'domain3-crypto-quiz',
      title: `Cryptography Practice Questions`,
      content: ``,
      quiz: [
        {
          question: `Which encryption algorithm is the current standard for symmetric encryption?`,
          options: ["DES", "3DES", "AES", "RSA"],
          correctIndex: 2,
          explanation: `AES (Advanced Encryption Standard) is the current standard symmetric encryption algorithm with key sizes of 128, 192, or 256 bits. DES is obsolete (56-bit key). 3DES is deprecated. RSA is asymmetric, not symmetric.`,
        },
        {
          question: `A sender wants to ensure that only the intended recipient can read a message. Which key should the sender use for encryption?`,
          options: ["Sender's private key", "Sender's public key", "Recipient's private key", "Recipient's public key"],
          correctIndex: 3,
          explanation: `To ensure confidentiality, the sender encrypts with the recipient's public key. Only the recipient's private key can decrypt the message. Using the sender's private key would create a digital signature (authentication), not encryption for confidentiality.`,
        },
        {
          question: `Which hashing algorithm is considered BROKEN and should NOT be used for security purposes?`,
          options: ["SHA-256", "SHA-3", "MD5", "bcrypt"],
          correctIndex: 2,
          explanation: `MD5 produces a 128-bit hash and has been broken — collision attacks are trivial, meaning two different inputs can produce the same hash. SHA-256, SHA-3, and bcrypt remain secure. MD5 should only be used for non-security purposes like checksums for file download verification (and even then SHA-256 is preferred).`,
        },
        {
          question: `What is the PRIMARY purpose of OCSP?`,
          options: ["Encrypting web traffic", "Checking certificate revocation status in real-time", "Generating digital signatures", "Managing encryption keys"],
          correctIndex: 1,
          explanation: `OCSP (Online Certificate Status Protocol) provides real-time checking of whether a digital certificate has been revoked. It's more efficient than downloading entire Certificate Revocation Lists (CRLs). OCSP Stapling further improves performance by having the server include the OCSP response.`,
        },
        {
          question: `Which property of TLS 1.3 ensures that past communications remain secure even if the server's private key is later compromised?`,
          options: ["Certificate pinning", "Perfect forward secrecy", "HSTS", "AEAD encryption"],
          correctIndex: 1,
          explanation: `Perfect forward secrecy (PFS) uses ephemeral keys for each session, so compromising the server's long-term private key doesn't allow decryption of past sessions. TLS 1.3 mandates PFS through ephemeral key exchange (DHE/ECDHE). Certificate pinning validates certificates. HSTS enforces HTTPS. AEAD provides authenticated encryption.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'AES (symmetric) for bulk encryption; RSA/ECC (asymmetric) for key exchange and signatures',
    'Encrypt with recipient\'s PUBLIC key; sign with YOUR PRIVATE key — this distinction is critical',
    'MD5 and SHA-1 are broken; use SHA-256/SHA-3 for hashing, bcrypt/Argon2 for password hashing',
    'PKI: Root CA should be offline; use OCSP (real-time) over CRLs for revocation checking',
    'TLS 1.3 mandates PFS and AEAD ciphers; TLS 1.2 is the minimum acceptable version',
  ],
},

sp_authentication: {
  topicId: 'sp_authentication',
  title: `Authentication & Authorization`,
  domainWeight: '25%',
  overview: `Authentication verifies identity; authorization determines permissions. This topic covers multi-factor authentication, single sign-on, identity federation, access control models, and authentication protocols. These concepts are central to the Security+ exam and to securing modern systems.`,
  sections: [
    {
      id: 'auth-concepts',
      title: `1. Authentication Concepts`,
      content: `Authentication is the process of verifying that an entity is who or what it claims to be.

## 1.1 Authentication Factors

- **Something you know** — Passwords, PINs, security questions. The weakest factor because it can be guessed, stolen, or shared.
- **Something you have** — Smart cards, hardware tokens, mobile phones (SMS codes, authenticator apps). Stronger than knowledge because it requires physical possession.
- **Something you are** — Biometrics: fingerprint, facial recognition, iris scan, retina scan, voice recognition. Strongest single factor but cannot be changed if compromised.
- **Somewhere you are** — Geolocation, IP address ranges. Used as a supplementary factor.
- **Something you do** — Behavioral biometrics: typing patterns, gait analysis, gesture patterns.

**Multi-Factor Authentication (MFA)** requires two or more DIFFERENT factors. Using two passwords is NOT MFA (same factor twice). A password + fingerprint IS MFA (knowledge + biometric).

## 1.2 MFA Methods

- **TOTP (Time-based One-Time Password)** — Authenticator apps (Google Authenticator, Authy, Microsoft Authenticator) generate time-based codes that change every 30 seconds. Based on a shared secret and current time.
- **HOTP (HMAC-based One-Time Password)** — Counter-based one-time passwords. Each code is valid until used.
- **Push notifications** — Authentication request sent to a registered mobile device. User approves or denies. Vulnerable to MFA fatigue attacks (bombarding users with push requests until they approve).
- **SMS codes** — One-time codes sent via text message. Considered WEAK because SMS can be intercepted (SIM swapping, SS7 vulnerabilities). NIST discourages SMS-based MFA.
- **Hardware security keys (FIDO2/WebAuthn)** — Physical devices (YubiKey, Titan Security Key) that use public-key cryptography. Phishing-resistant because the key is bound to the specific website. The strongest MFA method.
- **Smart cards** — Physical cards with embedded certificates. Require a PIN for use (two factors: have + know).

## 1.3 Biometric Considerations

- **False Acceptance Rate (FAR)** — Rate at which unauthorized users are incorrectly accepted. Also called Type II error.
- **False Rejection Rate (FRR)** — Rate at which authorized users are incorrectly rejected. Also called Type I error.
- **Crossover Error Rate (CER)** — The point where FAR equals FRR. Lower CER indicates a more accurate biometric system. CER is the primary metric for comparing biometric accuracy.

## 1.4 Passwordless Authentication

Modern approaches that eliminate passwords entirely:
- **FIDO2/WebAuthn** — Uses public-key cryptography with hardware or platform authenticators
- **Passkeys** — Device-bound or synced credentials using FIDO2 standards
- **Certificate-based** — Client certificates for mutual TLS authentication
- **Magic links** — One-time login links sent via email

## 1.5 Authentication Protocols

- **Kerberos** — Ticket-based authentication used in Active Directory. Uses a Key Distribution Center (KDC) with Authentication Service (AS) and Ticket-Granting Service (TGS). Uses AES encryption. Default authentication for Windows domains. Vulnerable to: golden ticket (forged TGT), silver ticket (forged service ticket), pass-the-ticket, and Kerberoasting attacks.
- **LDAP/LDAPS** — Protocol for querying directory services (Active Directory). LDAPS adds TLS encryption. Port 389 (LDAP) / Port 636 (LDAPS).
- **RADIUS** — Remote Authentication Dial-In User Service. Centralizes authentication for network access (VPN, Wi-Fi, switches). Encrypts only the password in transit. Uses UDP ports 1812/1813.
- **TACACS+** — Terminal Access Controller Access-Control System Plus. Cisco-developed. Encrypts the ENTIRE packet (more secure than RADIUS). Uses TCP port 49. Separates authentication, authorization, and accounting functions.
- **SAML (Security Assertion Markup Language)** — XML-based standard for exchanging authentication and authorization data between parties. Used for web-based SSO. Involves: Identity Provider (IdP), Service Provider (SP), and user. SAML assertions contain authentication, attribute, and authorization statements.
- **OAuth 2.0** — Authorization framework (NOT authentication). Grants third-party applications limited access to user resources WITHOUT sharing passwords. Uses access tokens. Does NOT tell the application WHO the user is.
- **OpenID Connect (OIDC)** — Authentication layer built ON TOP of OAuth 2.0. Adds an ID token that identifies the user. Used for "Login with Google/Facebook/etc."
- **PAP** — Password Authentication Protocol. Sends credentials in PLAINTEXT. Never use. Legacy only.
- **CHAP** — Challenge Handshake Authentication Protocol. Uses a challenge-response mechanism. More secure than PAP but still dated.
- **EAP** — Extensible Authentication Protocol. Framework for multiple authentication methods (EAP-TLS, EAP-TTLS, PEAP). EAP-TLS uses mutual certificate authentication and is the most secure EAP method.`,
      examTip: `MFA requires DIFFERENT factors (know + have + are). SMS is weak MFA — FIDO2 hardware keys are the strongest. RADIUS encrypts only the password; TACACS+ encrypts the entire packet. OAuth = authorization (not authentication); OIDC = authentication on top of OAuth. Kerberos uses tickets, not passwords for service access. CER is the best metric for comparing biometric systems.`,
      importantNote: `OAuth 2.0 is for AUTHORIZATION only — it grants access to resources but does not authenticate users. If you need to know WHO the user is, use OpenID Connect (which adds an ID token to OAuth). The exam tests this distinction frequently.`,
    },
    {
      id: 'access-control',
      title: `2. Authorization and Access Control Models`,
      content: `Authorization determines what authenticated users are permitted to do. Access control models define how permissions are assigned and managed.

## 2.1 Access Control Models

- **DAC (Discretionary Access Control)** — Resource owners decide who can access their resources. Used in most operating systems (file permissions). Flexible but less secure — users can share access inappropriately.
- **MAC (Mandatory Access Control)** — Access based on security labels and clearance levels. System-enforced, not user-discretionary. Users cannot change permissions. Used in military and government systems. Example: SELinux.
- **RBAC (Role-Based Access Control)** — Permissions assigned to roles, users assigned to roles. Simplifies administration in large organizations. Example: "Doctor" role has access to patient records; "Nurse" role has different access.
- **ABAC (Attribute-Based Access Control)** — Decisions based on attributes: user attributes (role, department, clearance), resource attributes (classification, type), environmental attributes (time, location, network). Most flexible model. Used in cloud and zero trust architectures.
- **Rule-Based Access Control** — Access determined by predefined rules (e.g., firewall ACLs, time-of-day restrictions). Not user-specific — rules apply to all users equally.

## 2.2 Access Control Principles

- **Least privilege** — Users receive only the minimum permissions necessary to perform their job functions. No more, no less.
- **Separation of duties** — Critical tasks divided among multiple people to prevent fraud or errors. No single person can complete a critical process alone.
- **Need to know** — Even with clearance, users only access information required for their specific task.
- **Implicit deny** — If no rule explicitly permits access, access is denied by default. Foundational principle for firewalls and ACLs.
- **Privilege creep** — Accumulation of unnecessary privileges over time as users change roles. Addressed through regular access reviews and recertification.

## 2.3 Single Sign-On (SSO)

SSO allows users to authenticate once and access multiple applications without re-entering credentials.

**Benefits:** Improved user experience, reduced password fatigue, centralized access management.
**Risks:** If the SSO credential is compromised, all connected applications are exposed. MFA is essential with SSO.

**SSO protocols:**
- SAML — Enterprise web SSO (XML-based)
- OAuth 2.0 / OIDC — Modern web and mobile SSO
- Kerberos — Windows domain SSO

## 2.4 Identity Federation

Federation extends SSO across organizational boundaries. Users authenticated by their home organization are trusted by partner organizations.

- **IdP (Identity Provider)** — Authenticates users and issues tokens/assertions
- **SP (Service Provider)** — Relies on the IdP for authentication
- **Trust relationship** — Established between IdP and SP through certificate exchange and configuration

Examples: Using your corporate credentials to access a SaaS application; "Login with Google" on third-party websites.

## 2.5 Privileged Access Management (PAM)

PAM controls and monitors privileged accounts (admin, root, service accounts):
- Just-in-time access — Elevated privileges granted temporarily for specific tasks
- Session recording — All privileged sessions recorded for audit
- Password vaulting — Privileged credentials stored in encrypted vaults, checked out for use
- Automatic credential rotation — Service account passwords rotated automatically`,
      examTip: `DAC = owner decides; MAC = system enforces labels; RBAC = roles; ABAC = attributes (most flexible). Implicit deny = no explicit allow means deny. Least privilege and separation of duties are the most tested principles. Privilege creep = users accumulating unnecessary access over time. Know that SSO + compromised credential = all apps exposed.`,
    },
    {
      id: 'domain3-auth-quiz',
      title: `Authentication & Authorization Practice Questions`,
      content: ``,
      quiz: [
        {
          question: `A user logs in with a password and then approves a push notification on their mobile phone. What type of authentication is this?`,
          options: ["Single-factor authentication", "Two-factor authentication", "Three-factor authentication", "Token-based authentication"],
          correctIndex: 1,
          explanation: `This is two-factor authentication using two different factors: something you know (password) and something you have (mobile phone receiving the push notification). Two different types of factors make this MFA, not just stronger single-factor.`,
        },
        {
          question: `Which authentication protocol encrypts the ENTIRE packet, not just the password?`,
          options: ["RADIUS", "TACACS+", "PAP", "LDAP"],
          correctIndex: 1,
          explanation: `TACACS+ encrypts the entire payload of the packet, providing full confidentiality for all authentication data. RADIUS only encrypts the password. PAP sends everything in plaintext. LDAP doesn't encrypt by default (LDAPS adds TLS). TACACS+ also separates authentication, authorization, and accounting.`,
        },
        {
          question: `In a biometric system, what does the Crossover Error Rate (CER) indicate?`,
          options: ["The maximum number of users the system can support", "The point where false acceptance rate equals false rejection rate", "The percentage of users who cannot enroll", "The speed of biometric verification"],
          correctIndex: 1,
          explanation: `CER is where the False Acceptance Rate (FAR) equals the False Rejection Rate (FRR). A lower CER indicates a more accurate biometric system. CER is the standard metric for comparing different biometric technologies because it balances security (FAR) against usability (FRR).`,
        },
        {
          question: `Which access control model assigns permissions based on user roles within an organization?`,
          options: ["DAC", "MAC", "RBAC", "ABAC"],
          correctIndex: 2,
          explanation: `RBAC (Role-Based Access Control) assigns permissions to roles (Doctor, Nurse, Admin), and users are assigned to roles. This simplifies administration in large organizations. DAC = owner decides. MAC = security labels. ABAC = attributes (most flexible).`,
        },
        {
          question: `OAuth 2.0 provides:`,
          options: ["Authentication only", "Authorization only", "Both authentication and authorization", "Encryption only"],
          correctIndex: 1,
          explanation: `OAuth 2.0 is an authorization framework that grants third-party applications limited access to resources without sharing credentials. It does NOT provide authentication (who the user is). OpenID Connect adds authentication on top of OAuth 2.0. This is a frequently tested distinction.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'MFA requires different factor types: know, have, are — using two passwords is NOT MFA',
    'FIDO2/hardware keys are the strongest MFA; SMS is the weakest due to SIM swapping',
    'RADIUS encrypts passwords only; TACACS+ encrypts entire packets',
    'OAuth = authorization (access to resources); OIDC = authentication (user identity) on top of OAuth',
    'RBAC = roles-based; ABAC = attributes-based (most flexible); implicit deny is the default',
  ],
},

sp_endpoint: {
  topicId: 'sp_endpoint',
  title: `Endpoint Security`,
  domainWeight: '25%',
  overview: `Endpoint security protects individual devices (workstations, laptops, mobile devices, servers) that connect to the network. This topic covers endpoint detection and response, data loss prevention, mobile device management, and application control technologies.`,
  sections: [
    {
      id: 'endpoint-protection',
      title: `1. Endpoint Protection Technologies`,
      content: `Modern endpoint security has evolved from simple antivirus to comprehensive platforms that detect, prevent, and respond to threats.

## 1.1 Antivirus/Antimalware

Traditional antivirus uses signature-based detection to identify known malware. Limitations:
- Signature databases must be constantly updated
- Cannot detect zero-day malware or fileless attacks
- Polymorphic and metamorphic malware evade signature detection
- Reactive approach — a threat must be known before it can be detected

Next-generation antimalware adds behavioral analysis, machine learning, and heuristic detection to identify unknown threats.

## 1.2 EDR (Endpoint Detection and Response)

EDR provides continuous monitoring, threat detection, investigation, and automated response at the endpoint level.

**Capabilities:**
- **Continuous monitoring** — Records all endpoint activity (process execution, file changes, network connections, registry modifications)
- **Threat detection** — Uses behavioral analysis, machine learning, and IOC matching to detect threats
- **Investigation** — Provides timeline and forensic data for security incidents
- **Automated response** — Can isolate endpoints, kill processes, quarantine files, and roll back changes
- **Threat hunting** — Enables proactive searching for threats across all endpoints

EDR is significantly more capable than traditional antivirus. It can detect fileless malware, living-off-the-land attacks, and lateral movement.

## 1.3 XDR (Extended Detection and Response)

XDR extends EDR by correlating data across multiple security layers: endpoint, network, cloud, email, and identity. Provides a unified view of threats across the entire environment rather than isolated endpoint alerts.

## 1.4 Data Loss Prevention (DLP)

DLP prevents unauthorized transmission of sensitive data outside the organization.

**DLP types:**
- **Endpoint DLP** — Agent on the device monitors and controls data transfer via USB, email, printing, clipboard, screen capture, and cloud upload
- **Network DLP** — Monitors network traffic for sensitive data patterns leaving the network
- **Cloud DLP** — Monitors data in cloud services and applications

**DLP methods:**
- **Content inspection** — Examines data for sensitive patterns (credit card numbers, SSN, keywords)
- **Context-based** — Evaluates who is sending, where it's going, and when (e.g., blocking USB transfers for non-approved users)
- **Exact data match** — Fingerprints specific sensitive data (actual database records)
- **Statistical analysis** — Machine learning to identify sensitive content based on data characteristics

## 1.5 Application Control

- **Allowlisting (whitelist)** — Only approved applications can execute. Very secure but requires careful management. Any application not on the list is blocked by default.
- **Blocklisting (blacklist)** — Known malicious or unauthorized applications are blocked. Everything else is allowed. Easier to manage but less secure — new threats are not blocked until added to the list.
- **Sandboxing** — Executing suspicious applications in an isolated environment to observe behavior before allowing them into the production environment.

## 1.6 Host-Based Firewalls and HIDS/HIPS

- **Host-based firewall** — Filters traffic at the individual endpoint level. Important for protecting devices when they're outside the corporate network (remote workers, travel).
- **HIDS (Host-based IDS)** — Monitors system activity on individual hosts for suspicious behavior. Analyzes log files, system calls, and file integrity.
- **HIPS (Host-based IPS)** — Monitors AND blocks suspicious activity on individual hosts.
- **File Integrity Monitoring (FIM)** — Detects unauthorized changes to critical system files. Essential for compliance (PCI-DSS requirement). Example: Tripwire, OSSEC.`,
      examTip: `EDR > traditional antivirus because it handles fileless malware and behavioral threats. XDR extends EDR across multiple security layers. Allowlisting is more secure than blocklisting (default deny vs. default allow). DLP prevents unauthorized data transmission — know the three types: endpoint, network, cloud. FIM detects changes to critical files (PCI-DSS requirement).`,
      importantNote: `Allowlisting (whitelist) follows the principle of implicit deny — only approved applications can run. This is significantly more secure than blocklisting, which allows everything except known bad. For high-security environments, allowlisting is the recommended approach.`,
    },
    {
      id: 'mobile-security',
      title: `2. Mobile Device Security`,
      content: `Mobile devices present unique security challenges due to their portability, connectivity, and the mixture of personal and corporate data.

## 2.1 Mobile Device Management (MDM)

MDM provides centralized management and security enforcement for mobile devices.

**Capabilities:**
- Remote device wipe (full or selective/corporate-only wipe)
- Screen lock and password policy enforcement
- Encryption enforcement
- Application management (install, update, remove apps)
- GPS tracking and geofencing
- Camera and microphone control
- VPN configuration
- Certificate deployment
- Containerization (separate corporate and personal data)

## 2.2 Mobile Application Management (MAM)

MAM focuses specifically on managing and securing applications rather than the entire device. Useful for BYOD environments where the organization doesn't own the device.

## 2.3 BYOD, COPE, and CYOD

- **BYOD (Bring Your Own Device)** — Employees use personal devices for work. Lowest cost to organization but highest risk. Requires MDM/MAM and acceptable use policies.
- **COPE (Corporate-Owned, Personally Enabled)** — Organization owns the device but allows personal use. More control than BYOD.
- **CYOD (Choose Your Own Device)** — Organization provides a list of approved devices; employee chooses. Balance of flexibility and control.
- **Corporate-owned** — Organization owns and fully manages the device. Maximum control, highest cost.

## 2.4 Mobile Threats

- **Jailbreaking/Rooting** — Removing manufacturer restrictions to gain full access. Bypasses security controls and voids warranties. MDM should detect and restrict jailbroken/rooted devices.
- **Sideloading** — Installing apps from sources other than official app stores. Higher malware risk.
- **Rogue apps** — Malicious applications disguised as legitimate apps in app stores.
- **SIM cloning/swapping** — Duplicating a SIM card to intercept calls and texts (including MFA codes).
- **Bluetooth attacks** — Bluejacking (unsolicited messages), Bluesnarfing (data theft), Bluebugging (device control).
- **Evil twin Wi-Fi** — Fake hotspot mimicking a legitimate network to intercept traffic.

## 2.5 Secure Boot and Hardware Security

- **Trusted Platform Module (TPM)** — Hardware chip that stores encryption keys, certificates, and performs cryptographic operations. Verifies system integrity at boot. Required for BitLocker full-disk encryption.
- **Hardware Security Module (HSM)** — Dedicated hardware for key management and cryptographic operations. Used for CA private keys, payment processing, and high-security environments. Tamper-resistant and tamper-evident.
- **Secure Boot** — UEFI feature that verifies the digital signature of boot components before loading them. Prevents boot-level malware (rootkits, bootkits).
- **Trusted Execution Environment (TEE)** — Isolated area within a processor that ensures code and data are protected from the main OS. Used for sensitive operations like biometric processing and payment transactions.`,
      examTip: `MDM provides device-level control (wipe, lock, encrypt). MAM provides app-level control (better for BYOD). BYOD = highest risk, lowest cost to organization. TPM stores keys and verifies boot integrity. HSM is dedicated cryptographic hardware for high-security key operations. Secure Boot prevents boot-level malware.`,
    },
    {
      id: 'domain3-endpoint-quiz',
      title: `Endpoint Security Practice Questions`,
      content: ``,
      quiz: [
        {
          question: `An organization wants to prevent employees from copying sensitive data to USB drives. Which technology should they implement?`,
          options: ["EDR", "Endpoint DLP", "Network DLP", "SIEM"],
          correctIndex: 1,
          explanation: `Endpoint DLP monitors and controls data transfer at the device level, including USB drives, email, printing, and cloud uploads. Network DLP monitors network traffic but wouldn't see USB transfers. EDR detects threats but doesn't specifically control data transfers. SIEM aggregates logs for analysis.`,
        },
        {
          question: `Which approach to application control is MORE secure: allowlisting or blocklisting?`,
          options: ["Blocklisting, because it blocks known threats", "Allowlisting, because it only permits approved applications", "They provide identical security", "Neither provides meaningful security"],
          correctIndex: 1,
          explanation: `Allowlisting (whitelist) is more secure because it follows the principle of implicit deny — only explicitly approved applications can execute. Any unknown or new malware is automatically blocked because it's not on the approved list. Blocklisting only blocks known bad, allowing unknown threats through.`,
        },
        {
          question: `A company allows employees to use personal phones for work email. Which mobile security approach provides the LEAST organizational control?`,
          options: ["Corporate-owned", "COPE", "CYOD", "BYOD"],
          correctIndex: 3,
          explanation: `BYOD (Bring Your Own Device) gives the organization the least control because employees own their devices. The organization can enforce policies through MDM/MAM but cannot fully manage the device. Corporate-owned provides maximum control, COPE provides strong control with personal use, and CYOD balances control with choice.`,
        },
        {
          question: `What hardware component stores encryption keys and verifies system integrity at boot time?`,
          options: ["HSM", "TPM", "UEFI", "TEE"],
          correctIndex: 1,
          explanation: `TPM (Trusted Platform Module) is a hardware chip on the motherboard that stores encryption keys, certificates, and passwords, and verifies system integrity during the boot process. HSM is for dedicated high-security cryptographic operations. UEFI is firmware. TEE is an isolated processor area.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'EDR provides behavioral detection, investigation, and automated response — far more capable than traditional AV',
    'Allowlisting is more secure than blocklisting (implicit deny vs. implicit allow)',
    'DLP types: endpoint (USB, email), network (traffic), cloud (SaaS) — know which applies where',
    'BYOD = highest risk, least control; corporate-owned = most control, highest cost',
    'TPM stores keys and verifies boot integrity; HSM is dedicated crypto hardware; Secure Boot prevents boot malware',
  ],
},

sp_wireless: {
  topicId: 'sp_wireless',
  title: `Wireless Security`,
  domainWeight: '25%',
  overview: `Wireless networks introduce unique security challenges because radio signals extend beyond physical boundaries. Understanding wireless security protocols, authentication methods, and common wireless attacks is essential for the Security+ exam.`,
  sections: [
    {
      id: 'wireless-protocols',
      title: `1. Wireless Security Standards and Protocols`,
      content: `Wireless security has evolved significantly, with each generation addressing vulnerabilities in previous standards.

## 1.1 Wi-Fi Security Standards Evolution

| Standard | Encryption | Status | Key Size |
|---|---|---|---|
| WEP | RC4 | BROKEN — Never use | 40/104-bit |
| WPA | TKIP (RC4-based) | Deprecated | 128-bit |
| WPA2 | AES-CCMP | Current standard | 128-bit |
| WPA3 | AES-GCMP / SAE | Latest standard | 128/192-bit |

- **WEP (Wired Equivalent Privacy)** — Uses RC4 stream cipher with weak IV (Initialization Vector) implementation. Can be cracked in minutes. NEVER use WEP.
- **WPA (Wi-Fi Protected Access)** — Interim fix using TKIP (Temporal Key Integrity Protocol). Still uses RC4 but with better key management. Deprecated — do not use for new deployments.
- **WPA2** — Uses AES-CCMP (Counter Mode CBC-MAC Protocol). Current widely deployed standard. Vulnerable to KRACK (Key Reinstallation Attack) and offline dictionary attacks on weak passwords.
- **WPA3** — Latest standard with significant security improvements:
  - **SAE (Simultaneous Authentication of Equals)** — Replaces the 4-way handshake with a more secure key exchange based on Dragonfly protocol. Provides protection against offline dictionary attacks.
  - **192-bit security mode** — For enterprise/government environments
  - **Forward secrecy** — Session keys cannot be derived from compromised credentials
  - **Protected Management Frames (PMF)** — Mandatory; prevents deauthentication attacks

## 1.2 Enterprise vs. Personal Modes

- **Personal mode (PSK — Pre-Shared Key)** — All users share the same password. Suitable for home and small office. If the password is compromised, all users are affected.
- **Enterprise mode (802.1X)** — Each user authenticates with unique credentials through a RADIUS server. Individual accountability, centralized management, and the ability to revoke access for specific users.

## 1.3 EAP Methods for Enterprise Wireless

- **EAP-TLS** — Mutual certificate authentication (both client and server present certificates). Most secure EAP method but requires certificate deployment to all clients.
- **EAP-TTLS** — Server certificate only; client authenticates through a TLS tunnel using password-based methods. Simpler to deploy than EAP-TLS.
- **PEAP (Protected EAP)** — Similar to EAP-TTLS. Creates a TLS tunnel using the server's certificate, then authenticates the client inside the tunnel. Most commonly deployed enterprise EAP method.
- **EAP-FAST** — Cisco-developed. Uses Protected Access Credentials (PAC) instead of certificates. Designed for environments where certificate deployment is impractical.

## 1.4 Other Wireless Technologies

- **Bluetooth** — Short-range wireless. Security modes: Mode 1 (no security), Mode 2 (service-level), Mode 3 (link-level), Mode 4 (SSP — Secure Simple Pairing). Vulnerabilities: Bluejacking, Bluesnarfing, Bluebugging.
- **NFC (Near Field Communication)** — Very short range (~10 cm). Used for contactless payments. Risks: eavesdropping, data manipulation, relay attacks.
- **RFID (Radio Frequency Identification)** — Used for asset tracking, access cards. Risks: cloning, eavesdropping, replay attacks.
- **Zigbee / Z-Wave** — IoT protocols for smart home devices. Often lack strong security implementations.`,
      examTip: `WEP = broken (RC4, weak IV). WPA = deprecated (TKIP). WPA2 = AES-CCMP (current standard). WPA3 = SAE + forward secrecy + mandatory PMF (latest). EAP-TLS (mutual certificates) is the most secure EAP method. Enterprise mode (802.1X + RADIUS) is required for unique user authentication. The exam tests the evolution of wireless security heavily.`,
      importantNote: `WPA3-SAE prevents offline dictionary attacks by using a Dragonfly handshake instead of the traditional 4-way handshake. Even if an attacker captures the handshake, they cannot perform offline brute force — each guess requires an online interaction.`,
    },
    {
      id: 'wireless-attacks',
      title: `2. Wireless Attacks and Defenses`,
      content: `Wireless networks are vulnerable to attacks that exploit the open nature of radio communications.

## 2.1 Wireless Attack Types

- **Evil twin** — Attacker creates a rogue access point with the same SSID as a legitimate network. Unsuspecting users connect to it, allowing the attacker to intercept all traffic. Often combined with a deauthentication attack to force disconnection from the legitimate AP.
- **Deauthentication attack** — Attacker sends forged deauthentication frames to disconnect clients from an access point. Used to force clients to reconnect (potentially to an evil twin) or as a denial of service. WPA3 mitigates this with mandatory Protected Management Frames.
- **Rogue access point** — Unauthorized AP connected to the corporate network, creating a backdoor that bypasses network security controls. Employees may install them for convenience, or attackers may plant them.
- **War driving / War walking** — Systematically searching for wireless networks by driving or walking around with a wireless-enabled device. Used for reconnaissance.
- **WPS (Wi-Fi Protected Setup) attacks** — WPS PIN is only 8 digits (effectively 7 with checksum), making brute force feasible. Disable WPS on all access points.
- **KRACK (Key Reinstallation Attack)** — Exploits WPA2's 4-way handshake by forcing nonce reuse, enabling decryption and injection. Patched in updated firmware and mitigated by WPA3.
- **Packet sniffing** — Capturing wireless traffic using tools like Wireshark or Aircrack-ng. Encrypted traffic (WPA2/3) protects content, but metadata is still visible.

## 2.2 Wireless Defense Strategies

- **Strong encryption** — Use WPA3 where possible, WPA2 as minimum. Never use WEP or open networks.
- **Enterprise authentication** — Use 802.1X with RADIUS for unique user credentials rather than shared PSK.
- **MAC filtering** — Restrict connections to known MAC addresses. Easy to bypass (MAC spoofing) — should not be the primary security control.
- **SSID management** — Hiding the SSID does NOT provide meaningful security (it can be discovered through probe requests). It may reduce casual connection attempts.
- **Access point hardening** — Disable WPS, update firmware regularly, change default credentials, limit transmit power.
- **Wireless IDS/IPS (WIDS/WIPS)** — Monitors wireless spectrum for rogue APs, evil twins, and other wireless attacks. Can automatically contain threats.
- **Network segmentation** — Place wireless networks on separate VLANs with firewall rules controlling access to internal resources.
- **Certificate-based authentication** — Use EAP-TLS or PEAP to prevent credential theft and evil twin attacks.
- **Captive portal** — Authentication page for guest wireless access. Provides terms of use acknowledgment and identity logging.`,
      examTip: `Evil twin = fake AP with same SSID. Deauthentication attacks are mitigated by WPA3's mandatory PMF. Hiding SSID is NOT effective security. WPS should always be disabled. MAC filtering is easily bypassed. WIDS/WIPS detects rogue APs and wireless attacks. Certificate-based authentication (EAP-TLS) prevents evil twin credential theft.`,
    },
    {
      id: 'domain3-wireless-quiz',
      title: `Wireless Security Practice Questions`,
      content: ``,
      quiz: [
        {
          question: `Which wireless security standard replaces the 4-way handshake with SAE to prevent offline dictionary attacks?`,
          options: ["WEP", "WPA", "WPA2", "WPA3"],
          correctIndex: 3,
          explanation: `WPA3 uses Simultaneous Authentication of Equals (SAE) based on the Dragonfly protocol, replacing the traditional 4-way handshake. SAE prevents offline dictionary attacks because each password guess requires an online interaction. WPA2 uses the 4-way handshake which is vulnerable to offline attacks.`,
        },
        {
          question: `An attacker sets up a wireless access point with the same SSID as the corporate Wi-Fi network in the building's lobby. What type of attack is this?`,
          options: ["Rogue access point", "Evil twin", "Deauthentication", "War driving"],
          correctIndex: 1,
          explanation: `An evil twin is a rogue AP that specifically mimics a legitimate network by using the same SSID. Users who connect to it have their traffic intercepted. A rogue AP is unauthorized but doesn't necessarily mimic an existing SSID. Deauthentication disconnects clients. War driving searches for networks.`,
        },
        {
          question: `Which EAP method requires BOTH client and server certificates and is considered the MOST secure?`,
          options: ["PEAP", "EAP-TTLS", "EAP-TLS", "EAP-FAST"],
          correctIndex: 2,
          explanation: `EAP-TLS uses mutual certificate authentication — both the client and server present digital certificates. This is the most secure EAP method because it doesn't rely on passwords at all. PEAP and EAP-TTLS only require server certificates. EAP-FAST uses Protected Access Credentials.`,
        },
        {
          question: `What is the PRIMARY reason to disable WPS (Wi-Fi Protected Setup) on access points?`,
          options: ["WPS uses WEP encryption", "WPS PIN can be brute-forced due to its short length", "WPS interferes with WPA3", "WPS exposes the SSID"],
          correctIndex: 1,
          explanation: `WPS uses an 8-digit PIN (effectively 7 with checksum) that can be brute-forced in a relatively short time (hours). This reveals the WPA/WPA2 passphrase regardless of its complexity. WPS doesn't use WEP and doesn't interfere with WPA3 or expose the SSID — the issue is purely the weak PIN mechanism.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'WEP is broken; WPA is deprecated; WPA2 (AES-CCMP) is the current standard; WPA3 (SAE) is the latest',
    'WPA3-SAE prevents offline dictionary attacks with the Dragonfly handshake protocol',
    'Enterprise mode (802.1X + RADIUS) provides individual authentication; PSK mode shares one password',
    'EAP-TLS (mutual certificates) is the most secure EAP method for enterprise wireless',
    'Disable WPS, use WIDS/WIPS for rogue AP detection, and segment wireless on separate VLANs',
  ],
},

sp_hardening: {
  topicId: 'sp_hardening',
  title: `System Hardening`,
  domainWeight: '25%',
  overview: `System hardening reduces the attack surface by removing unnecessary services, applying patches, configuring security settings, and implementing the principle of least functionality. This topic covers hardening techniques for operating systems, applications, and network devices.`,
  sections: [
    {
      id: 'hardening-techniques',
      title: `1. System Hardening Techniques`,
      content: `Hardening transforms a default system installation into a secure, production-ready system by removing unnecessary components and applying security configurations.

## 1.1 Patch Management

Patch management is the process of identifying, acquiring, testing, and deploying patches to systems and applications.

**Patch management process:**
1. **Inventory** — Maintain an accurate inventory of all systems and software
2. **Identify** — Monitor vendor bulletins, CVE feeds, and vulnerability scans for applicable patches
3. **Evaluate** — Assess patch relevance, criticality (CVSS score), and business impact
4. **Test** — Test patches in a staging environment before production deployment
5. **Deploy** — Roll out patches to production systems during maintenance windows
6. **Verify** — Confirm successful installation and check for issues
7. **Document** — Record all patching activities for compliance and audit

**Patch categories:**
- **Hotfix** — Emergency patch for a critical vulnerability, deployed immediately
- **Security update** — Addresses specific security vulnerabilities
- **Cumulative update** — Contains all previous patches plus new fixes
- **Service pack** — Major update bundling many patches and potentially new features
- **Firmware update** — Updates to hardware firmware (BIOS/UEFI, network devices)

## 1.2 Baseline Configuration

A security baseline is a standard configuration that meets the organization's security requirements. All systems should conform to the baseline.

**Sources for baselines:**
- **CIS Benchmarks** — Detailed, consensus-based configuration guides for operating systems, applications, and network devices. The most widely used industry baselines.
- **DISA STIGs** — Security Technical Implementation Guides for US Department of Defense systems. Highly prescriptive.
- **Vendor security guides** — Microsoft Security Baselines, Red Hat Security Guide, etc.

**Baseline enforcement:**
- Group Policy (Windows domains)
- Configuration management tools (Ansible, Puppet, Chef, Salt)
- Mobile Device Management (MDM) profiles
- Infrastructure as Code (IaC) templates

## 1.3 Removing Unnecessary Services and Features

- Disable all services not required for the system's function
- Remove unnecessary software and applications
- Close unused network ports
- Remove default accounts or disable them
- Change default passwords on all devices and applications
- Disable unnecessary protocols (TLS 1.0/1.1, SSLv3, SMBv1, Telnet)

## 1.4 Least Functionality

The principle of least functionality configures systems to provide only essential capabilities. Every additional service, port, protocol, or application increases the attack surface.

- Application servers should only run required applications
- Network devices should only enable required protocols
- Workstations should only have business-required software
- Disable unneeded browser plugins and extensions

## 1.5 Account Management Hardening

- **Disable default accounts** — Rename or disable built-in Administrator/root/guest accounts
- **Enforce strong password policies** — Minimum length (14+ characters recommended), complexity, history, lockout after failed attempts
- **Service accounts** — Use managed service accounts with minimal privileges and automatic password rotation
- **Privileged access** — Separate admin accounts from daily-use accounts; use just-in-time elevation

## 1.6 File System and Disk Security

- **Full-disk encryption** — BitLocker (Windows), FileVault (macOS), LUKS (Linux). Protects data if the device is lost or stolen.
- **File-level encryption** — EFS (Encrypting File System) for individual files/folders
- **Secure file permissions** — Remove world-readable permissions on sensitive files; apply least privilege to file access
- **Disk wiping** — Secure erasure of data when decommissioning devices (NIST SP 800-88 guidelines: Clear, Purge, Destroy)`,
      examTip: `Patch management: test before deploying to production. CIS Benchmarks are the most widely used security baselines. Least functionality = disable everything not needed. Default accounts must be renamed or disabled. Full-disk encryption protects against data theft if devices are lost. NIST 800-88 defines data sanitization methods: Clear (overwrite), Purge (crypto-erase), Destroy (physical).`,
      importantNote: `Never deploy patches directly to production without testing. A bad patch can cause more damage than the vulnerability it's fixing. Always test in a staging environment that mirrors production.`,
    },
    {
      id: 'change-management',
      title: `2. Change and Configuration Management`,
      content: `Change management ensures that modifications to systems are controlled, documented, and reversible.

## 2.1 Change Management Process

1. **Request** — Formal change request submitted with justification
2. **Review** — Change Advisory Board (CAB) evaluates the request, assessing risk, impact, and resource requirements
3. **Approve/Deny** — CAB decision based on risk assessment
4. **Test** — Changes tested in non-production environment
5. **Implement** — Changes deployed during approved maintenance window
6. **Verify** — Confirm changes work as expected with no adverse effects
7. **Document** — Record all changes for audit trail and rollback reference

## 2.2 Configuration Management

- **Configuration Management Database (CMDB)** — Centralized repository tracking all configuration items (CIs) and their relationships
- **Version control** — Track changes to configurations over time; enable rollback to known-good states
- **Drift detection** — Identify when system configurations deviate from the approved baseline
- **Immutable infrastructure** — Instead of modifying running systems, deploy new instances from a known-good image. Prevents configuration drift.

## 2.3 Asset Management

- **Hardware inventory** — Track all physical assets (servers, workstations, network devices, IoT devices)
- **Software inventory** — Track all installed software, versions, and licenses
- **Asset lifecycle** — Procurement → Deployment → Management → Decommissioning → Disposal
- **SBOM (Software Bill of Materials)** — Inventory of all components, libraries, and dependencies in software. Critical for supply chain security and vulnerability management.

## 2.4 Decommissioning and Data Disposal

When systems reach end of life, proper decommissioning prevents data exposure:

| Method | Description | Use Case |
|---|---|---|
| Clear | Overwrite with zeros/patterns | Reuse within organization |
| Purge | Cryptographic erasure or degaussing | Reuse outside organization |
| Destroy | Physical destruction (shredding, incineration) | Highest sensitivity data |

NIST SP 800-88 provides guidelines for media sanitization. The appropriate method depends on data classification and whether the media will be reused.`,
      examTip: `Change Advisory Board (CAB) reviews and approves changes. Changes must be tested before production deployment. CMDB tracks configuration items. Configuration drift = systems deviating from baseline. SBOM is essential for supply chain security. NIST 800-88: Clear (overwrite), Purge (crypto-erase/degauss), Destroy (physical).`,
    },
    {
      id: 'domain3-hardening-quiz',
      title: `System Hardening Practice Questions`,
      content: ``,
      quiz: [
        {
          question: `An organization needs a security baseline for hardening Windows servers. Which resource provides the most widely accepted configuration guidance?`,
          options: ["Vendor default settings", "CIS Benchmarks", "ISO 27001", "OWASP Top 10"],
          correctIndex: 1,
          explanation: `CIS Benchmarks provide detailed, consensus-based configuration guides for hardening operating systems, applications, and network devices. They are the most widely used industry security baselines. Vendor defaults are insecure. ISO 27001 is an ISMS framework, not a configuration guide. OWASP covers web application security.`,
        },
        {
          question: `A security team discovers that several servers have configurations that differ from the approved baseline. What is this called?`,
          options: ["Patch debt", "Configuration drift", "Privilege creep", "Shadow IT"],
          correctIndex: 1,
          explanation: `Configuration drift occurs when system configurations deviate from the approved baseline over time due to ad hoc changes, unmanaged updates, or manual modifications. Patch debt is falling behind on patches. Privilege creep is accumulating unnecessary access. Shadow IT is unauthorized technology use.`,
        },
        {
          question: `According to NIST SP 800-88, which data sanitization method is appropriate for the HIGHEST sensitivity data?`,
          options: ["Clear", "Purge", "Destroy", "Format"],
          correctIndex: 2,
          explanation: `Destroy (physical destruction: shredding, incineration, disintegration) is the most secure method and is appropriate for the highest sensitivity data. Clear (overwriting) is for reuse within the organization. Purge (crypto-erase/degaussing) is for reuse outside the organization. "Format" is not a recognized NIST sanitization method.`,
        },
        {
          question: `What is the FIRST step in a patch management process?`,
          options: ["Deploy patches immediately", "Test patches in staging", "Maintain an accurate system and software inventory", "Evaluate CVSS scores"],
          correctIndex: 2,
          explanation: `An accurate inventory of all systems and software is the first step — you cannot patch what you don't know about. After inventory, you identify applicable patches, evaluate criticality, test in staging, deploy to production, verify, and document.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'Patch management: inventory → identify → evaluate → test → deploy → verify → document',
    'CIS Benchmarks are the industry standard for security baselines; DISA STIGs for DoD',
    'Least functionality: disable all unnecessary services, ports, protocols, and software',
    'Configuration drift = deviations from baseline; detect with automated tools and enforce with IaC',
    'Data disposal: Clear (overwrite), Purge (crypto-erase), Destroy (physical) per NIST 800-88',
  ],
},

// ═══════════════════════════════════════════════════════════════
// DOMAIN 4 — Security Operations (20%)
// ═══════════════════════════════════════════════════════════════

sp_incident: {
  topicId: 'sp_incident',
  title: `Incident Response`,
  domainWeight: '20%',
  overview: `Incident response (IR) is the organized approach to addressing and managing security incidents. A well-prepared IR process minimizes damage, reduces recovery time, and prevents recurrence. This topic covers IR planning, phases, team roles, and communication.`,
  sections: [
    {
      id: 'ir-process',
      title: `1. Incident Response Process`,
      content: `The incident response lifecycle follows a structured process to ensure consistent, effective handling of security events.

## 1.1 NIST IR Phases (SP 800-61)

1. **Preparation** — Building capability before incidents occur
   - Develop and maintain an incident response plan (IRP)
   - Establish an Incident Response Team (IRT/CSIRT) with defined roles
   - Deploy detection and monitoring tools (SIEM, EDR, IDS/IPS)
   - Create communication plans (internal, external, legal, regulatory)
   - Conduct tabletop exercises and simulations
   - Establish evidence handling procedures
   - Build and maintain a jump bag (IR toolkit with forensic tools, cables, storage)

2. **Detection and Analysis** — Identifying and validating incidents
   - Monitor alerts from security tools
   - Analyze indicators of compromise (IOCs)
   - Correlate events across multiple sources
   - Determine scope and severity
   - Classify and prioritize the incident
   - Document initial findings and timeline

3. **Containment, Eradication, and Recovery**
   - **Containment** — Limit the incident's impact and prevent further damage
     - Short-term containment: Isolate affected systems (network isolation, disable accounts)
     - Long-term containment: Apply temporary fixes while preparing for eradication
   - **Eradication** — Remove the threat from the environment
     - Remove malware, close vulnerability, reset compromised credentials
     - Identify and address root cause
   - **Recovery** — Restore systems to normal operation
     - Rebuild systems from known-good images if necessary
     - Restore data from backups
     - Gradually return to production with increased monitoring
     - Verify systems are clean before reconnecting

4. **Post-Incident Activity (Lessons Learned)**
   - Conduct a post-incident review (ideally within 1-2 weeks)
   - Document what happened, timeline, actions taken, and outcomes
   - Identify what worked well and what needs improvement
   - Update IR plans, runbooks, and detection rules based on findings
   - Share intelligence with appropriate parties (ISACs, CISA)

## 1.2 Incident Severity Levels

| Level | Description | Example |
|---|---|---|
| Critical/P1 | Active breach with significant data loss or system compromise | Ransomware encrypting production systems |
| High/P2 | Confirmed attack with limited impact, immediate response needed | Compromised admin account with suspicious activity |
| Medium/P3 | Potential attack requiring investigation | Unusual outbound traffic pattern to unknown IP |
| Low/P4 | Minor security event, routine handling | Single failed login attempt from unknown IP |

## 1.3 Incident Response Team Roles

- **IR Manager/Lead** — Coordinates the overall response, makes decisions, communicates with leadership
- **Security Analysts** — Perform technical analysis, detection, and investigation
- **Forensic Analysts** — Collect and analyze digital evidence
- **Communications/PR** — Handle external communications, media, customer notifications
- **Legal Counsel** — Advise on legal obligations, regulatory notifications, evidence preservation
- **Management/Executive** — Make business decisions, authorize actions, provide resources
- **IT Operations** — Support containment and recovery actions
- **HR** — Involved when insider threat is suspected`,
      examTip: `NIST IR phases: Preparation → Detection & Analysis → Containment/Eradication/Recovery → Post-Incident (Lessons Learned). Preparation is the most important phase because it determines how effectively you handle everything that follows. Containment happens BEFORE eradication — stop the bleeding before removing the threat. The exam tests phase ordering.`,
      importantNote: `The post-incident review (lessons learned) is NOT optional. It drives continuous improvement and prevents the same incident from recurring. Organizations that skip this phase are doomed to repeat their mistakes.`,
    },
    {
      id: 'ir-communication',
      title: `2. Incident Communication and Planning`,
      content: `Effective communication during incidents is as critical as technical response.

## 2.1 Communication Plans

- **Internal stakeholders** — Executive leadership, IT management, affected business units, HR (if insider-related), legal
- **External stakeholders** — Customers (if data compromised), regulators (breach notification requirements), law enforcement (if criminal activity), insurance provider, media/PR
- **Regulatory notifications** — Many regulations require timely breach notification:
  - GDPR: 72 hours to supervisory authority
  - HIPAA: 60 days to individuals and HHS
  - State breach notification laws vary
  - PCI-DSS: Immediate notification to acquirer/payment brands

## 2.2 Incident Response Plan Components

- Purpose and scope
- Roles and responsibilities
- Incident classification and severity definitions
- Communication procedures and contact lists
- Detection and analysis procedures
- Containment strategies for different incident types
- Evidence handling and chain of custody procedures
- Escalation procedures
- Recovery procedures
- Post-incident review process

## 2.3 Tabletop Exercises

Tabletop exercises are discussion-based walkthroughs of incident scenarios. Participants describe how they would respond to a given scenario without actually performing technical actions.

**Benefits:**
- Tests IR plan effectiveness without risk
- Identifies gaps in procedures and communication
- Trains team members on their roles
- Builds team coordination and familiarity
- Low cost and easy to organize

## 2.4 Playbooks and Runbooks

- **Playbook** — High-level guidance for responding to specific incident types (ransomware playbook, phishing playbook, insider threat playbook)
- **Runbook** — Step-by-step technical procedures for specific actions (how to isolate a host, how to collect memory, how to reset credentials)

Playbooks ensure consistent response across different analysts and incidents.

## 2.5 Indicators of Incident

- **Precursors** — Signs that an incident may occur in the future (new exploit published, threat intelligence about targeting your sector, port scanning detected)
- **Indicators** — Signs that an incident has occurred or is occurring (IDS alerts, antivirus detections, unusual system behavior, user reports)

Precursors enable proactive defense; indicators trigger reactive response.`,
      examTip: `GDPR requires breach notification within 72 hours. Playbooks = high-level response guidance; runbooks = detailed step-by-step procedures. Tabletop exercises test the IR plan without risk. Know the difference between precursors (something may happen) and indicators (something has happened or is happening).`,
    },
    {
      id: 'domain4-ir-quiz',
      title: `Incident Response Practice Questions`,
      content: ``,
      quiz: [
        {
          question: `During an active ransomware attack, what should the incident response team do FIRST?`,
          options: ["Eradicate the malware", "Contain the attack by isolating affected systems", "Begin recovery from backups", "Conduct a lessons learned review"],
          correctIndex: 1,
          explanation: `Containment is the first active response step — isolate affected systems to prevent the ransomware from spreading. Eradication comes after containment. Recovery comes after eradication. Lessons learned is the final phase. The priority is stopping the spread before removing the threat.`,
        },
        {
          question: `Under GDPR, how long does an organization have to notify the supervisory authority of a personal data breach?`,
          options: ["24 hours", "48 hours", "72 hours", "30 days"],
          correctIndex: 2,
          explanation: `GDPR requires notification to the supervisory authority within 72 hours of becoming aware of a personal data breach, unless the breach is unlikely to result in a risk to individuals' rights. Individual notification must follow without undue delay if there is high risk.`,
        },
        {
          question: `Which IR phase is considered the MOST important for overall incident response effectiveness?`,
          options: ["Detection and Analysis", "Containment", "Preparation", "Recovery"],
          correctIndex: 2,
          explanation: `Preparation is the most important phase because it determines how effectively all subsequent phases are executed. Without proper preparation (IR plan, trained team, tools, procedures), response will be chaotic and slow. You can't effectively detect, contain, or recover without preparation.`,
        },
        {
          question: `A company conducts a discussion-based walkthrough where team members describe how they would respond to a simulated phishing attack. What type of exercise is this?`,
          options: ["Full-scale exercise", "Tabletop exercise", "Penetration test", "Red team exercise"],
          correctIndex: 1,
          explanation: `A tabletop exercise is a discussion-based walkthrough of an incident scenario. Participants describe their responses without performing actual technical actions. It tests IR plan effectiveness and team coordination with minimal risk and cost. Full-scale exercises involve actual system actions. Penetration tests and red team exercises involve active attacks.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'NIST IR phases: Preparation → Detection & Analysis → Containment/Eradication/Recovery → Lessons Learned',
    'Preparation is the most critical phase — it determines response effectiveness',
    'Contain FIRST (stop the spread), then eradicate (remove the threat), then recover (restore operations)',
    'GDPR: 72-hour breach notification; HIPAA: 60-day notification; state laws vary',
    'Tabletop exercises test IR plans through discussion-based scenarios with no system risk',
  ],
},

sp_forensics: {
  topicId: 'sp_forensics',
  title: `Digital Forensics`,
  domainWeight: '20%',
  overview: `Digital forensics is the process of identifying, preserving, collecting, analyzing, and reporting digital evidence. Proper forensic procedures ensure evidence integrity and admissibility in legal proceedings. This topic covers evidence handling, forensic tools, and the chain of custody.`,
  sections: [
    {
      id: 'forensics-process',
      title: `1. Digital Forensics Process`,
      content: `Digital forensics follows a rigorous methodology to ensure evidence is collected and preserved in a legally defensible manner.

## 1.1 Forensic Process Steps

1. **Identification** — Determine what evidence exists, where it's located, and how it's stored. Identify relevant systems, storage media, network logs, and cloud resources.
2. **Preservation** — Protect evidence from alteration or destruction. Implement legal holds to prevent automatic deletion of relevant data. Document the scene (photographs, notes).
3. **Collection** — Gather evidence using forensically sound methods that maintain integrity. Create forensic images (bit-for-bit copies) of storage media. Capture volatile data (RAM) before powering down.
4. **Analysis** — Examine evidence to extract relevant information. Use forensic tools to recover deleted files, analyze file systems, review logs, and reconstruct events.
5. **Reporting** — Document findings in a clear, comprehensive report suitable for legal proceedings. Include methodology, tools used, evidence analyzed, findings, and conclusions.

## 1.2 Order of Volatility

Evidence should be collected in order of volatility — most volatile (most easily lost) first:

1. **CPU registers and cache** — Lost immediately when power is interrupted
2. **RAM (system memory)** — Contains running processes, encryption keys, network connections. Lost on power-off.
3. **Swap/page files** — Virtual memory on disk. May contain fragments of RAM data.
4. **Hard drive data** — Persistent but can be overwritten or wiped
5. **Remote logging and monitoring data** — May be overwritten by rotation policies
6. **Physical configuration/network topology** — Relatively stable
7. **Archival media** — Backup tapes, offsite storage. Most stable.

## 1.3 Chain of Custody

Chain of custody documents every person who handled the evidence, when, why, and what they did with it. It establishes that evidence has not been tampered with.

**Chain of custody documentation includes:**
- Description of the evidence (serial numbers, model, capacity)
- Who collected it, when, and where
- Every transfer: who gave it, who received it, date/time, reason
- How it was stored and protected between transfers
- Cryptographic hashes (MD5, SHA-256) at each stage to verify integrity

A broken chain of custody can make evidence inadmissible in court.

## 1.4 Forensic Imaging

Forensic imaging creates an exact bit-for-bit copy of storage media, including deleted files, slack space, and unallocated space.

- **Write blockers** — Hardware or software that prevents any write operations to the source media during imaging. Ensures the original evidence is not modified. MANDATORY for forensic imaging.
- **Image formats** — E01 (EnCase), AFF (Advanced Forensic Format), DD (raw)
- **Hash verification** — Calculate and record cryptographic hashes of the original media and the image. Matching hashes prove the image is an exact copy.

## 1.5 Types of Evidence

- **Real/physical evidence** — Tangible objects (hard drives, USB drives, phones, laptops)
- **Documentary evidence** — Written or recorded material (logs, emails, reports)
- **Testimonial evidence** — Statements from witnesses or expert testimony
- **Demonstrative evidence** — Visual aids (timelines, diagrams, recreations) used to explain other evidence

## 1.6 Legal Considerations

- **Legal hold** — Formal notice requiring preservation of all potentially relevant data. Overrides normal retention/destruction policies.
- **Admissibility** — Evidence must be relevant, authentic, and obtained legally. Chain of custody must be maintained.
- **Fourth Amendment** — Protects against unreasonable search and seizure. Generally requires a warrant for law enforcement (not applicable to private-sector internal investigations).
- **Data sovereignty** — Evidence stored in other jurisdictions may be subject to local laws.`,
      examTip: `Order of volatility: CPU registers → RAM → swap → hard drive → logs → archives. Always collect the most volatile evidence first. Write blockers are MANDATORY for forensic imaging to prevent evidence modification. Chain of custody MUST be maintained or evidence is inadmissible. Hash the original AND the copy to verify integrity.`,
      importantNote: `RAM contains critical evidence including encryption keys, running processes, and network connections. Once a system is powered off, RAM contents are lost permanently. Always capture memory BEFORE shutting down a compromised system.`,
    },
    {
      id: 'forensic-techniques',
      title: `2. Forensic Analysis Techniques`,
      content: `Forensic analysts use various techniques to extract and interpret evidence from digital media.

## 2.1 File System Analysis

- **File carving** — Recovering files based on file headers and footers rather than file system metadata. Can recover deleted files even when directory entries are destroyed.
- **Slack space analysis** — Examining space between the end of a file and the end of the disk cluster it occupies. May contain fragments of previously deleted files.
- **Unallocated space** — Disk areas not currently assigned to files. May contain remnants of deleted files.
- **Metadata analysis** — Examining file metadata (creation date, modification date, access date, author, GPS coordinates for photos) to build timelines and establish context.
- **Timeline analysis** — Reconstructing a chronological sequence of events from file system timestamps, log entries, and other temporal data.

## 2.2 Memory Forensics

- Capture RAM using tools like WinPmem, FTK Imager, or Volatility
- Analyze running processes and their parent-child relationships
- Extract network connections and open sockets
- Recover encryption keys from memory
- Identify injected code and rootkit artifacts
- Detect fileless malware that exists only in memory

## 2.3 Network Forensics

- **Packet capture (PCAP)** — Full content capture of network traffic for analysis
- **NetFlow/sFlow** — Metadata about network connections (source, destination, ports, volumes) without payload content
- **DNS logs** — Query history can reveal C2 communications and malicious domain access
- **Proxy/firewall logs** — URL access history, blocked connections, traffic patterns

## 2.4 Mobile Device Forensics

- Physical extraction — Bit-for-bit copy of device storage
- Logical extraction — File system-level copy (files, databases, app data)
- Manual extraction — Screen captures and documentation of device content
- Challenges: encryption, locked devices, secure enclaves, data stored in cloud rather than locally

## 2.5 Cloud Forensics

Cloud forensics introduces unique challenges:
- Limited physical access to infrastructure
- Shared multi-tenant environments
- Data spread across multiple geographic regions
- Volatile/ephemeral resources (serverless, containers)
- Dependency on cloud provider for log access
- Need for specific cloud forensic skills and tools

## 2.6 Anti-Forensics

Techniques attackers use to hinder forensic investigation:
- **Encryption** — Encrypting data to prevent analysis
- **Steganography** — Hiding data within innocent files (images, audio)
- **Log tampering** — Modifying or deleting log files
- **Timestomping** — Altering file timestamps to obscure timeline analysis
- **Secure deletion** — Overwriting files to prevent recovery
- **Trail obfuscation** — Using VPNs, Tor, and compromised systems to hide the origin`,
      examTip: `File carving recovers files from raw disk data without file system metadata. Slack space may contain fragments of old data. Steganography hides data inside other files (images). Timestomping alters file timestamps to confuse timeline analysis. Cloud forensics is challenging due to multi-tenancy, geographic distribution, and limited physical access.`,
    },
    {
      id: 'domain4-forensics-quiz',
      title: `Digital Forensics Practice Questions`,
      content: ``,
      quiz: [
        {
          question: `A forensic analyst needs to create a copy of a suspect's hard drive for analysis. What must be used to prevent modifying the original evidence?`,
          options: ["Antivirus software", "Write blocker", "Encryption key", "Network analyzer"],
          correctIndex: 1,
          explanation: `A write blocker (hardware or software) prevents any write operations to the source media during forensic imaging, ensuring the original evidence is not modified. This is mandatory for maintaining evidence integrity and admissibility. Antivirus, encryption, and network tools don't address evidence preservation.`,
        },
        {
          question: `According to the order of volatility, which evidence should be collected FIRST?`,
          options: ["Hard drive data", "RAM contents", "Backup tapes", "Network logs"],
          correctIndex: 1,
          explanation: `RAM (system memory) is the most volatile commonly collected evidence type and should be captured first. It contains running processes, encryption keys, and network connections that are lost when the system is powered off. While CPU registers are more volatile, they are typically captured as part of memory acquisition. Hard drives, backups, and logs are less volatile.`,
        },
        {
          question: `A forensic investigator discovers that file timestamps on a compromised system have been altered to confuse the investigation timeline. What anti-forensic technique was used?`,
          options: ["Steganography", "Timestomping", "Log tampering", "Encryption"],
          correctIndex: 1,
          explanation: `Timestomping is the anti-forensic technique of altering file system timestamps (creation, modification, access dates) to confuse timeline analysis. Steganography hides data in other files. Log tampering modifies log files. Encryption makes data unreadable.`,
        },
        {
          question: `What is the PRIMARY purpose of maintaining chain of custody for digital evidence?`,
          options: ["To encrypt the evidence", "To prove evidence has not been tampered with", "To create backup copies", "To classify the evidence"],
          correctIndex: 1,
          explanation: `Chain of custody documentation proves that evidence has been handled properly and has not been tampered with from collection to presentation in court. It tracks every person who handled the evidence, when, and what they did. A broken chain of custody can make evidence inadmissible.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'Order of volatility: CPU registers → RAM → swap → disk → logs → archives — collect most volatile first',
    'Write blockers are MANDATORY for forensic imaging to preserve evidence integrity',
    'Chain of custody documents every transfer of evidence — broken chain = inadmissible evidence',
    'Hash verification (before and after) proves forensic images are exact copies of original media',
    'Anti-forensics: timestomping (alters dates), steganography (hides data), log tampering, secure deletion',
  ],
},

sp_logging: {
  topicId: 'sp_logging',
  title: `Logging & Monitoring`,
  domainWeight: '20%',
  overview: `Logging and monitoring provide visibility into security events across the enterprise. A robust logging infrastructure enables threat detection, incident investigation, compliance, and forensic analysis. This topic covers SIEM, log management, continuous monitoring, and alerting.`,
  sections: [
    {
      id: 'logging-concepts',
      title: `1. Logging and SIEM`,
      content: `Comprehensive logging is the foundation of security monitoring, detection, and investigation.

## 1.1 Log Types

- **Security logs** — Authentication events, access control decisions, privilege escalations, account changes
- **System logs** — OS events, service starts/stops, hardware errors, boot processes
- **Application logs** — Application-specific events, errors, transactions, user actions
- **Network logs** — Firewall decisions, IDS/IPS alerts, VPN connections, DNS queries
- **Audit logs** — Changes to configurations, policies, and access controls. Critical for compliance.
- **Web server logs** — HTTP requests, response codes, client IPs, user agents

## 1.2 SIEM (Security Information and Event Management)

SIEM aggregates, correlates, and analyzes log data from multiple sources to detect security threats.

**Core SIEM functions:**
- **Log aggregation** — Collects logs from across the environment into a central repository
- **Normalization** — Converts logs from different formats into a consistent format for analysis
- **Correlation** — Connects related events across multiple sources to identify complex attacks (e.g., failed logins from one IP followed by successful login from the same IP on a different system = lateral movement)
- **Alerting** — Generates alerts when correlation rules or thresholds are triggered
- **Dashboards** — Visual representation of security metrics, trends, and active alerts
- **Reporting** — Generates compliance and operational reports
- **Retention** — Stores logs for the required retention period (compliance-driven)

**SIEM data sources:** Firewalls, IDS/IPS, EDR, Active Directory, VPN, proxy servers, email gateways, cloud services, operating systems, applications.

## 1.3 SOAR (Security Orchestration, Automation, and Response)

SOAR platforms automate incident response workflows and orchestrate actions across multiple security tools.

**Capabilities:**
- **Orchestration** — Coordinate actions across different security tools (SIEM, EDR, firewall, ticketing)
- **Automation** — Automate repetitive tasks (enrich IOCs, block IPs, disable accounts, create tickets)
- **Response** — Execute predefined playbooks automatically when specific conditions are met
- **Case management** — Track incidents from detection through resolution

SOAR reduces response time by automating actions that would otherwise require manual intervention.

## 1.4 Log Management Best Practices

- **Centralized logging** — Send all logs to a central, secured location. Never rely solely on local logs (attackers delete them).
- **Time synchronization (NTP)** — All systems must use the same time source for accurate event correlation and timeline reconstruction.
- **Log integrity** — Write-once storage or cryptographic hashing to prevent log tampering.
- **Retention policies** — Define how long logs are kept based on regulatory requirements and operational needs. Common: 90 days hot (searchable), 1 year warm, 7 years archive (compliance).
- **Log protection** — Restrict access to log servers. Separate log infrastructure from production. Encrypt logs in transit and at rest.

## 1.5 Syslog and Log Protocols

- **Syslog** — Standard protocol for forwarding log messages. UDP port 514 (no encryption, no reliability guarantees).
- **Syslog over TLS (RFC 5425)** — Encrypted syslog using TCP port 6514. Recommended for sensitive environments.
- **Windows Event Forwarding (WEF)** — Centralized collection of Windows event logs.
- **Common Event Format (CEF)** — Standardized log format used by many SIEM platforms.`,
      examTip: `SIEM = aggregate + correlate + alert. SOAR = automate + orchestrate response. NTP time synchronization is CRITICAL for accurate event correlation. Centralized logging prevents attackers from hiding their tracks by deleting local logs. Syslog uses UDP 514 (insecure); use Syslog over TLS (TCP 6514) for encryption.`,
      importantNote: `If systems aren't time-synchronized (NTP), log correlation becomes unreliable because events from different sources can't be accurately sequenced. Time synchronization is a prerequisite for effective SIEM operation.`,
    },
    {
      id: 'continuous-monitoring',
      title: `2. Continuous Monitoring and Alerting`,
      content: `Continuous monitoring provides ongoing awareness of security posture, vulnerabilities, and threats.

## 2.1 Monitoring Types

- **Real-time monitoring** — Immediate analysis of events as they occur. Used for active threat detection (SIEM, IDS/IPS).
- **Near-real-time** — Analysis with a slight delay (seconds to minutes). Most SIEM environments operate in near-real-time.
- **Periodic monitoring** — Scheduled scans and assessments (vulnerability scans, compliance checks). Typically daily, weekly, or monthly.
- **Continuous monitoring** — Ongoing, automated process that maintains awareness of threats, vulnerabilities, and compliance. Combines real-time alerts with periodic assessments.

## 2.2 Security Operations Center (SOC)

The SOC is the centralized team responsible for monitoring, detecting, analyzing, and responding to security incidents.

**SOC Tiers:**
- **Tier 1 — Alert Triage** — Monitor dashboards, review alerts, perform initial investigation, escalate as needed
- **Tier 2 — Investigation** — Deep-dive analysis of escalated alerts, determine scope and impact, begin containment
- **Tier 3 — Threat Hunting/Engineering** — Proactive threat hunting, develop detection rules, reverse-engineer malware, create automation

## 2.3 Alerting and Alert Management

**Alert fatigue** — When analysts receive too many alerts (most of which are false positives), they become desensitized and may miss real threats. Alert fatigue is a critical SOC problem.

**Mitigation:**
- Tune detection rules to reduce false positives
- Implement alert prioritization based on asset criticality and threat context
- Use automation (SOAR) to handle low-priority alerts
- Suppress known false positive patterns
- Enrich alerts with threat intelligence for context

## 2.4 Key Performance Indicators for Monitoring

- **MTTD (Mean Time to Detect)** — Average time from intrusion to detection. Lower is better.
- **MTTR (Mean Time to Respond)** — Average time from detection to response/containment. Lower is better.
- **MTTC (Mean Time to Contain)** — Average time to contain an incident after detection.
- **False positive rate** — Percentage of alerts that are not actual threats.
- **Dwell time** — Time an attacker remains in the environment undetected. Industry average is declining but still measured in weeks.

## 2.5 Threat Intelligence Integration

Integrating threat intelligence feeds into monitoring tools enhances detection:
- IOC feeds update SIEM correlation rules with new threat indicators
- Reputation services score IPs, domains, and file hashes
- MITRE ATT&CK mapping helps detect specific adversary techniques
- Automated enrichment adds context to alerts (is this IP known malicious?)`,
      examTip: `MTTD = time to detect; MTTR = time to respond — both should be minimized. Alert fatigue is a major SOC problem caused by too many false positives. SOC tiers: T1 = triage, T2 = investigation, T3 = hunting/engineering. Dwell time is how long an attacker stays undetected — the goal is to reduce it.`,
    },
    {
      id: 'domain4-logging-quiz',
      title: `Logging & Monitoring Practice Questions`,
      content: ``,
      quiz: [
        {
          question: `Which technology aggregates logs from multiple sources, correlates events, and generates alerts for security incidents?`,
          options: ["IDS", "SOAR", "SIEM", "EDR"],
          correctIndex: 2,
          explanation: `SIEM (Security Information and Event Management) aggregates logs from across the environment, correlates related events, and generates alerts when security conditions are met. IDS detects intrusions on specific segments. SOAR automates response. EDR monitors endpoints.`,
        },
        {
          question: `Why is NTP (Network Time Protocol) critical for security monitoring?`,
          options: ["It encrypts log data in transit", "It ensures accurate event correlation across systems", "It compresses log files for storage", "It authenticates log sources"],
          correctIndex: 1,
          explanation: `NTP synchronizes time across all systems, which is essential for accurate event correlation in SIEM and for forensic timeline reconstruction. Without synchronized time, events from different sources cannot be reliably sequenced, making it impossible to determine the order of events during an incident.`,
        },
        {
          question: `A SOC receives 10,000 alerts per day, and analysts are struggling to identify real threats among the noise. What is this problem called?`,
          options: ["Alert fatigue", "Log saturation", "Analysis paralysis", "Dwell time"],
          correctIndex: 0,
          explanation: `Alert fatigue occurs when analysts are overwhelmed by too many alerts (most of which are false positives), causing them to become desensitized and potentially miss real threats. Solutions include tuning rules, implementing prioritization, and using SOAR automation for low-priority alerts.`,
        },
        {
          question: `Which metric measures the average time an attacker remains undetected in an environment?`,
          options: ["MTTD", "MTTR", "Dwell time", "False positive rate"],
          correctIndex: 2,
          explanation: `Dwell time is the total time from initial compromise to detection. It includes the time before detection (MTTD) but also any time the attacker spent in the environment before the organization was even aware of the intrusion. The goal is to minimize dwell time through effective monitoring and detection.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'SIEM aggregates, correlates, and alerts on security events from across the environment',
    'SOAR automates response workflows — reducing MTTR and analyst workload',
    'NTP time synchronization is mandatory for accurate log correlation and forensic timelines',
    'Alert fatigue (too many false positives) is a critical SOC problem — mitigate by tuning and automation',
    'Key metrics: MTTD (detect), MTTR (respond), dwell time (attacker undetected) — all should be minimized',
  ],
},

sp_backup: {
  topicId: 'sp_backup',
  title: `Backup & Disaster Recovery`,
  domainWeight: '20%',
  overview: `Backup and disaster recovery ensure business continuity by protecting data and enabling system restoration after disruptions. This topic covers backup types, disaster recovery planning, business continuity, high availability, and key recovery metrics.`,
  sections: [
    {
      id: 'backup-concepts',
      title: `1. Backup Strategies and Types`,
      content: `A robust backup strategy protects against data loss from hardware failure, ransomware, human error, and natural disasters.

## 1.1 Backup Types

- **Full backup** — Complete copy of all selected data. Longest backup time, shortest restore time. Requires the most storage space.
- **Incremental backup** — Copies only data that changed since the LAST backup (full or incremental). Fastest backup time, but restoration requires the last full backup plus ALL subsequent incrementals in order.
- **Differential backup** — Copies all data that changed since the LAST FULL backup. Faster than full, slower than incremental. Restoration requires only the last full backup plus the latest differential.

| Backup Type | Backup Speed | Restore Speed | Storage Required |
|---|---|---|---|
| Full | Slowest | Fastest | Most |
| Incremental | Fastest | Slowest | Least |
| Differential | Medium | Medium | Medium |

## 1.2 Backup Best Practices

- **3-2-1 Rule** — Maintain at least 3 copies of data, on 2 different types of media, with 1 copy offsite. Modern extension: 3-2-1-1-0 (plus 1 copy air-gapped/immutable + 0 errors verified).
- **Immutable backups** — Backups that cannot be modified or deleted for a specified retention period. Critical for ransomware defense — attackers frequently target backups.
- **Air-gapped backups** — Physically disconnected from the network. Cannot be reached by ransomware that spreads through the network.
- **Encryption** — Encrypt backups at rest and in transit to protect sensitive data.
- **Regular testing** — Test backup restoration regularly. A backup that can't be restored is worthless. Many organizations discover their backups are corrupt only when they try to restore.

## 1.3 Backup Storage

- **On-premises** — Local disk, tape, NAS/SAN. Fast restoration but vulnerable to site-level disasters.
- **Cloud backup** — Offsite storage in cloud services. Protection against site disasters. Consider bandwidth for large restores.
- **Tape** — Cost-effective for long-term archival. Slow restoration. Good for air-gapped, offsite storage.
- **Replication** — Real-time copying of data to a secondary location. Provides near-zero data loss but also replicates corruption/ransomware encryption.

## 1.4 Snapshot vs. Backup

- **Snapshot** — Point-in-time state capture, typically at the storage or VM level. Fast to create and restore. NOT a replacement for backup — snapshots are usually stored on the same storage system and don't protect against storage failure.
- **Backup** — Complete copy stored separately. Protects against storage failure and site-level disasters.`,
      examTip: `Incremental = changed since LAST backup (any type); differential = changed since last FULL backup. Know restore requirements: incremental needs full + all incrementals; differential needs full + latest differential. 3-2-1 rule: 3 copies, 2 media types, 1 offsite. Immutable backups defend against ransomware. Always test restores.`,
      importantNote: `Ransomware increasingly targets backups before encrypting production data. Immutable and air-gapped backups are critical defenses. If your backups are on the same network as production systems, ransomware will find and encrypt them.`,
    },
    {
      id: 'disaster-recovery',
      title: `2. Disaster Recovery and Business Continuity`,
      content: `Disaster recovery (DR) focuses on restoring IT systems after a disruption. Business continuity (BC) ensures critical business functions continue during and after a disaster.

## 2.1 Key Recovery Metrics

- **RTO (Recovery Time Objective)** — Maximum acceptable downtime. How long can the business function without this system? Example: RTO of 4 hours means the system must be restored within 4 hours.
- **RPO (Recovery Point Objective)** — Maximum acceptable data loss measured in time. How much data can the business afford to lose? Example: RPO of 1 hour means backups must be taken at least hourly; you can lose at most 1 hour of data.
- **MTD (Maximum Tolerable Downtime)** — The absolute maximum time a business function can be down before the organization faces unacceptable consequences (bankruptcy, regulatory action). RTO must be less than MTD.
- **MTBF (Mean Time Between Failures)** — Average time between system failures. Higher is better.
- **MTTR (Mean Time to Repair)** — Average time to repair a failed system. Lower is better.

## 2.2 Business Impact Analysis (BIA)

BIA identifies critical business functions and the impact of disruption. It drives DR/BC planning by prioritizing which systems to protect and how quickly to recover them.

**BIA determines:**
- Critical business functions and their dependencies
- RTO and RPO for each function
- Financial impact of downtime (per hour/day)
- Regulatory and legal impacts of disruption
- Resource requirements for recovery

## 2.3 DR Site Types

| Site Type | Description | Cost | Recovery Time |
|---|---|---|---|
| Hot site | Fully equipped, real-time data replication, ready to go | Highest | Minutes to hours |
| Warm site | Hardware installed, requires data restoration and configuration | Medium | Hours to days |
| Cold site | Empty facility with power and cooling, requires full setup | Lowest | Days to weeks |
| Cloud/DRaaS | Cloud-based DR with on-demand resources | Variable | Minutes to hours |

- **Hot site** — Mirror of production environment with real-time data replication. Most expensive but provides the fastest recovery. Near-zero RPO.
- **Warm site** — Hardware is in place but requires data restoration and some configuration. Balance of cost and recovery speed.
- **Cold site** — Just the facility (power, cooling, network connectivity). All equipment, software, and data must be deployed. Cheapest but longest recovery.
- **DRaaS (Disaster Recovery as a Service)** — Cloud-based DR with automated failover. Eliminates the need for physical DR sites.

## 2.4 High Availability Concepts

High availability (HA) ensures systems remain operational with minimal downtime.

- **Clustering** — Multiple servers working as a single system. If one fails, others take over (failover).
- **Load balancing** — Distributes traffic across multiple servers to prevent overload.
- **RAID (Redundant Array of Independent Disks)**:
  - RAID 0 — Striping (performance, no redundancy)
  - RAID 1 — Mirroring (redundancy, 50% capacity)
  - RAID 5 — Striping with parity (can lose 1 disk, minimum 3 disks)
  - RAID 6 — Striping with double parity (can lose 2 disks, minimum 4 disks)
  - RAID 10 — Mirroring + striping (performance + redundancy, 50% capacity)
- **Geographic redundancy** — Systems distributed across multiple locations.
- **Power redundancy** — UPS (Uninterruptible Power Supply) for short-term, generators for extended outages, dual power feeds.
- **Network redundancy** — Multiple ISPs, redundant network paths, failover routing.

## 2.5 Testing DR Plans

- **Checklist review** — Verify plan documentation is current. Least disruptive, least effective.
- **Tabletop exercise** — Discussion-based walkthrough of DR scenarios.
- **Simulation** — Walk through recovery procedures without actual failover.
- **Parallel test** — Activate DR site alongside production. Production remains operational.
- **Full interruption** — Switch operations to DR site. Highest confidence but highest risk. Production is actually stopped.

Test DR plans at least annually. Many organizations discover their DR plans don't work only when they need them.`,
      examTip: `RTO = maximum downtime (time-focused). RPO = maximum data loss (data-focused). Hot site = fastest recovery, highest cost. Cold site = slowest recovery, lowest cost. RAID 5 tolerates 1 disk failure; RAID 6 tolerates 2. Full interruption testing provides highest confidence but highest risk. BIA determines RTOs and RPOs.`,
    },
    {
      id: 'domain4-backup-quiz',
      title: `Backup & Disaster Recovery Practice Questions`,
      content: ``,
      quiz: [
        {
          question: `An organization's RPO for a critical database is 4 hours. What does this mean?`,
          options: ["The database must be restored within 4 hours", "The organization can tolerate losing up to 4 hours of data", "Backups must be kept for 4 hours", "The database fails every 4 hours"],
          correctIndex: 1,
          explanation: `RPO (Recovery Point Objective) defines the maximum acceptable data loss in time. An RPO of 4 hours means backups must be taken at least every 4 hours, and in a disaster, the most data that could be lost is 4 hours' worth. RTO (not RPO) defines maximum downtime.`,
        },
        {
          question: `Which backup type copies only data that has changed since the last FULL backup?`,
          options: ["Full backup", "Incremental backup", "Differential backup", "Snapshot"],
          correctIndex: 2,
          explanation: `Differential backups copy all data changed since the last FULL backup, growing larger each day until the next full backup. Incremental copies only changes since the LAST backup of any type. For restoration, differential requires only the full + latest differential, while incremental requires the full + all subsequent incrementals.`,
        },
        {
          question: `A disaster recovery site has hardware installed but requires data restoration and some configuration before it can operate. What type of site is this?`,
          options: ["Hot site", "Warm site", "Cold site", "Mobile site"],
          correctIndex: 1,
          explanation: `A warm site has hardware installed and network connectivity but requires data restoration and some configuration. Hot sites are fully operational with real-time data. Cold sites are empty facilities requiring everything. Warm sites balance cost and recovery speed.`,
        },
        {
          question: `Which RAID level provides disk striping with parity and can tolerate the failure of ONE disk?`,
          options: ["RAID 0", "RAID 1", "RAID 5", "RAID 6"],
          correctIndex: 2,
          explanation: `RAID 5 uses striping with distributed parity, requiring a minimum of 3 disks. It can tolerate the failure of one disk. RAID 0 provides no redundancy. RAID 1 uses mirroring. RAID 6 can tolerate two disk failures using double parity.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'RTO = maximum acceptable downtime; RPO = maximum acceptable data loss (in time)',
    'Incremental = since last backup; differential = since last FULL backup',
    '3-2-1 rule: 3 copies, 2 media types, 1 offsite; add immutable/air-gapped for ransomware defense',
    'Hot site (fastest/costliest) → warm site → cold site (slowest/cheapest)',
    'Always test DR plans — untested plans are unreliable; full interruption testing provides highest confidence',
  ],
},

// ═══════════════════════════════════════════════════════════════
// DOMAIN 5 — Security Program Management & Oversight (10%)
// ═══════════════════════════════════════════════════════════════

sp_policies: {
  topicId: 'sp_policies',
  title: `Policies & Procedures`,
  domainWeight: '10%',
  overview: `Security policies, procedures, standards, and guidelines form the governance foundation for an organization's security program. They define what is required, how it should be done, and provide the authority for security activities. This topic covers policy types, change management, data classification, and personnel security.`,
  sections: [
    {
      id: 'policy-hierarchy',
      title: `1. Policy Hierarchy and Document Types`,
      content: `Security governance documents form a hierarchy from high-level policy to detailed procedures.

## 1.1 Document Hierarchy

1. **Policies** — High-level statements of management intent. Define WHAT the organization requires. Mandatory and enforceable. Approved by senior management or the board. Example: "All data at rest must be encrypted."
2. **Standards** — Mandatory requirements that support policies. Define specific technologies or methods. Example: "Encryption must use AES-256 or equivalent."
3. **Guidelines** — Recommended best practices. NOT mandatory — they suggest approaches. Example: "Organizations should consider implementing full-disk encryption on all mobile devices."
4. **Procedures** — Detailed step-by-step instructions for performing tasks. Define HOW to accomplish policy requirements. Example: "To enable BitLocker on a Windows laptop: Step 1..."

## 1.2 Policy Types

- **Acceptable Use Policy (AUP)** — Defines acceptable and unacceptable use of organizational IT resources. Covers internet usage, email, personal devices, social media. Users typically sign acknowledgment upon hiring.
- **Information Security Policy** — Overarching policy defining the organization's approach to security. Sets the tone and direction for all security activities.
- **Access Control Policy** — Defines how access to systems and data is granted, managed, and revoked.
- **Password Policy** — Specifies password requirements: minimum length, complexity, expiration, reuse restrictions.
- **Remote Access Policy** — Defines requirements for remote connectivity (VPN, MFA, device requirements).
- **BYOD Policy** — Rules for using personal devices for work purposes.
- **Data Classification Policy** — Defines data categories and handling requirements for each.
- **Incident Response Policy** — Defines the organization's approach to security incident handling.
- **Privacy Policy** — Defines how personal information is collected, used, stored, and protected.
- **Change Management Policy** — Defines how changes to systems and configurations are requested, approved, and implemented.

## 1.3 Data Classification

Data classification categorizes information based on sensitivity to determine appropriate handling and protection.

**Government/Military classification:**
- Top Secret — Exceptionally grave damage to national security if disclosed
- Secret — Serious damage to national security
- Confidential — Damage to national security
- Unclassified — No damage to national security

**Commercial/Private sector classification:**
- Restricted/Confidential — Most sensitive (trade secrets, PII, financial data)
- Internal/Private — For internal use only (employee directories, internal memos)
- Public — Freely available to anyone (marketing materials, published reports)

**Data roles:**
- **Data owner** — Senior management responsible for data classification and protection decisions. Accountable for the data.
- **Data custodian** — IT staff responsible for implementing controls defined by the data owner. Manages day-to-day data protection.
- **Data steward** — Ensures data quality, accuracy, and compliance with policies.
- **Data processor** — Entity that processes data on behalf of the data controller (GDPR term).
- **Data controller** — Entity that determines the purpose and means of data processing (GDPR term).

## 1.4 Data Lifecycle

1. Creation/Collection
2. Classification
3. Storage
4. Usage
5. Sharing/Distribution
6. Archival
7. Destruction

Security controls must be applied throughout the entire lifecycle. Data destruction must follow NIST 800-88 guidelines.

## 1.5 Personnel Security

- **Background checks** — Verify identity, criminal history, employment history, education, credit history (for financial roles)
- **Onboarding** — Assign access based on role, complete security training, sign AUP and NDA
- **Separation of duties** — Divide critical functions to prevent fraud
- **Job rotation** — Rotate employees through positions to detect fraud and cross-train
- **Mandatory vacation** — Require employees to take time off; irregularities may surface when someone else performs their duties
- **Offboarding** — Revoke access immediately, collect organizational assets, conduct exit interview, enforce NDA terms
- **Non-Disclosure Agreement (NDA)** — Legal agreement preventing disclosure of confidential information
- **Non-Compete Agreement** — Restricts employees from working for competitors for a specified period`,
      examTip: `Policy = what (mandatory), standard = specific requirement (mandatory), guideline = recommendation (not mandatory), procedure = how (step-by-step). Data owner = classifies data and makes protection decisions. Data custodian = implements controls. Separation of duties prevents fraud. Mandatory vacation helps detect fraud. Know these distinctions cold.`,
      importantNote: `The data OWNER (typically a business executive) determines data classification and protection requirements. The data CUSTODIAN (typically IT staff) implements those requirements. The owner makes the decisions; the custodian executes them.`,
    },
    {
      id: 'security-concepts',
      title: `2. Additional Governance Concepts`,
      content: `Several governance concepts support the overall security program.

## 2.1 Change Management

Change management ensures that modifications to systems are controlled, documented, tested, and reversible. (Detailed in System Hardening topic.)

Key points for this domain:
- Changes without following the change management process are "unauthorized changes" and represent a security risk
- Emergency changes may bypass normal approval but must be documented and reviewed after implementation
- Change Advisory Board (CAB) reviews and approves changes

## 2.2 Security Awareness and Training

- **Awareness** — General security knowledge for all employees (phishing recognition, password security, clean desk policy, reporting procedures)
- **Training** — Role-specific skills development (secure coding for developers, forensics for analysts, compliance for managers)
- **Education** — Formal programs for security professionals (certifications, degree programs)

Effectiveness should be measured by behavior change (reduced phishing click rates), not just completion rates.

## 2.3 Third-Party Risk Management

- **Vendor assessment** — Evaluate vendor security posture before engagement (questionnaires, SOC 2 reports, penetration test results)
- **Service Level Agreements (SLAs)** — Define performance and availability requirements with penalties for non-compliance
- **Right to audit** — Contractual right to audit vendor security practices
- **Supply chain security** — Assess risks throughout the supply chain, not just direct vendors. Verify software integrity (SBOM, code signing).
- **Vendor monitoring** — Ongoing assessment of vendor security, not just at onboarding

## 2.4 Security Control Assessments

- **Vulnerability assessment** — Identifies security weaknesses
- **Penetration testing** — Validates exploitability of vulnerabilities
- **Security audit** — Formal evaluation of security controls against a standard (SOC 2, ISO 27001)
- **Gap analysis** — Compares current security posture against desired state or framework requirements
- **Maturity model** — Assesses the organization's security program maturity (e.g., CMMI: Initial → Managed → Defined → Quantitatively Managed → Optimizing)`,
      examTip: `Awareness = all employees; training = role-specific; education = formal programs. Third-party risk: SOC 2 reports provide assurance about vendor controls. SLAs define performance requirements. Right to audit is a contractual must-have. Supply chain security includes SBOM for software components.`,
    },
    {
      id: 'domain5-policies-quiz',
      title: `Policies & Procedures Practice Questions`,
      content: ``,
      quiz: [
        {
          question: `Who is responsible for classifying organizational data and defining its protection requirements?`,
          options: ["Data custodian", "Data owner", "Security administrator", "Database administrator"],
          correctIndex: 1,
          explanation: `The data owner (typically a senior business leader) is responsible for classifying data and defining protection requirements. The data custodian (typically IT) implements the controls specified by the owner. Security and database administrators support implementation but don't own the classification decision.`,
        },
        {
          question: `Which document type provides MANDATORY specific technical requirements that support a security policy?`,
          options: ["Guideline", "Standard", "Procedure", "Baseline"],
          correctIndex: 1,
          explanation: `Standards are mandatory documents that specify particular technologies, methods, or criteria to support policies. For example, a policy states "data must be encrypted"; the standard specifies "use AES-256." Guidelines are recommendations (not mandatory). Procedures are step-by-step instructions. Baselines are configuration standards.`,
        },
        {
          question: `An employee is required to take two consecutive weeks of vacation during which another employee performs their duties. What personnel security control is this?`,
          options: ["Job rotation", "Separation of duties", "Mandatory vacation", "Least privilege"],
          correctIndex: 2,
          explanation: `Mandatory vacation requires employees to take time off, during which someone else performs their duties. This helps detect fraud, embezzlement, or other irregularities that the regular employee might be concealing through their daily presence. Job rotation permanently moves people between roles. Separation of duties divides tasks.`,
        },
        {
          question: `A company wants assurance that a cloud vendor's security controls are independently verified. Which report should they request?`,
          options: ["Vulnerability scan results", "SOC 2 Type II report", "OWASP assessment", "Annual revenue report"],
          correctIndex: 1,
          explanation: `A SOC 2 Type II report provides independent auditor assurance about a service organization's controls relevant to security, availability, processing integrity, confidentiality, and privacy — tested over a period of time. Type II is preferred over Type I because it tests operating effectiveness, not just design. Vulnerability scans show technical weaknesses. OWASP is a web security framework. Revenue reports are financial.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'Policy hierarchy: Policy (what) → Standard (specific requirements) → Guideline (suggestions) → Procedure (how)',
    'Data owner classifies data and decides protection; data custodian implements the controls',
    'Mandatory vacation and job rotation help detect fraud and insider threats',
    'SOC 2 Type II reports provide independent assurance of vendor security controls over time',
    'Security awareness for all; training for role-specific skills; measure by behavior change',
  ],
},

sp_risk: {
  topicId: 'sp_risk',
  title: `Risk Management`,
  domainWeight: '10%',
  overview: `Risk management is the systematic process of identifying, analyzing, evaluating, and treating risks to an organization's information assets. It provides the foundation for making informed security investment decisions and is a core component of the Security+ exam.`,
  sections: [
    {
      id: 'risk-concepts',
      title: `1. Risk Management Concepts`,
      content: `Risk management balances the cost of protection against the potential impact of threats.

## 1.1 Risk Terminology

- **Risk** — The likelihood that a threat will exploit a vulnerability and the resulting impact. Risk = Threat × Vulnerability × Impact.
- **Threat** — Any potential cause of an unwanted event. Can be natural (earthquake), human (hacker), or technical (hardware failure).
- **Vulnerability** — A weakness that could be exploited by a threat.
- **Impact** — The negative effect on the organization if a risk materializes (financial loss, reputational damage, legal liability).
- **Likelihood** — The probability that a threat will exploit a vulnerability.
- **Risk appetite** — The level of risk an organization is willing to accept. Strategic, board-level decision.
- **Risk tolerance** — The acceptable variation in risk levels. Operational, more specific than appetite.
- **Residual risk** — Risk remaining after controls are applied. Residual risk must be within the organization's risk tolerance.
- **Inherent risk** — Risk level before any controls are applied.

## 1.2 Risk Assessment Process

1. **Identify assets** — What are we protecting? (Data, systems, people, facilities)
2. **Identify threats** — What could harm these assets?
3. **Identify vulnerabilities** — What weaknesses could threats exploit?
4. **Assess likelihood** — How probable is each threat-vulnerability pair?
5. **Assess impact** — What's the damage if this risk materializes?
6. **Calculate risk** — Combine likelihood and impact to prioritize risks
7. **Recommend controls** — Identify mitigating controls for high-priority risks

## 1.3 Quantitative Risk Analysis

Quantitative analysis uses numerical values and financial calculations:

- **AV (Asset Value)** — Monetary value of the asset ($500,000)
- **EF (Exposure Factor)** — Percentage of asset lost if the threat materializes (60%)
- **SLE (Single Loss Expectancy)** — Expected loss from a single event: SLE = AV × EF ($500,000 × 60% = $300,000)
- **ARO (Annualized Rate of Occurrence)** — Expected frequency per year (0.5 = once every 2 years)
- **ALE (Annualized Loss Expectancy)** — Expected yearly loss: ALE = SLE × ARO ($300,000 × 0.5 = $150,000)

The ALE helps determine how much to spend on controls — spending more than the ALE on prevention doesn't make financial sense.

## 1.4 Qualitative Risk Analysis

Qualitative analysis uses subjective ratings (High/Medium/Low) or (1-5 scale) rather than financial calculations.

- **Risk matrix** — Plots likelihood vs. impact on a grid to visualize and prioritize risks
- **Heat maps** — Color-coded visualization of risk levels
- **Expert judgment** — Subject matter experts assess risk levels based on experience

Qualitative is faster and easier but less precise. Most organizations use a combination of both approaches.

## 1.5 Risk Response Strategies

- **Avoidance** — Eliminate the risk by removing the source. Example: Don't store credit card data to avoid PCI-DSS breach risk.
- **Mitigation (Reduction)** — Implement controls to reduce likelihood or impact. Example: Deploy a firewall to reduce network attack likelihood.
- **Transfer (Sharing)** — Shift risk to a third party. Example: Purchase cyber insurance or outsource to a managed security provider.
- **Acceptance** — Acknowledge the risk and take no additional action. Appropriate when the cost of mitigation exceeds the potential loss. Must be a documented, management-approved decision.

## 1.6 Risk Register

A risk register is a living document that tracks identified risks and their management:
- Risk description
- Risk owner (person accountable for managing the risk)
- Likelihood and impact ratings
- Current controls
- Risk response strategy
- Residual risk after controls
- Status and review date`,
      examTip: `Know the quantitative formulas: SLE = AV × EF; ALE = SLE × ARO. ALE determines control spending. Risk responses: avoid (eliminate), mitigate (reduce), transfer (shift), accept (acknowledge). Risk acceptance must be documented and approved by management. Residual risk = risk after controls. The exam tests calculations and response strategies.`,
      importantNote: `Risk acceptance is a valid response ONLY when properly documented and approved by management at the appropriate level. An undocumented decision to "do nothing" is not risk acceptance — it's negligence.`,
    },
    {
      id: 'risk-frameworks',
      title: `2. Risk Management Frameworks and Tools`,
      content: `Structured frameworks guide the risk management process and ensure consistency.

## 2.1 Risk Management Frameworks

- **NIST SP 800-37 (RMF)** — Six-step risk management process for federal information systems (Prepare, Categorize, Select, Implement, Assess, Authorize, Monitor)
- **NIST SP 800-30** — Guide for conducting risk assessments. Covers threat identification, vulnerability analysis, impact and likelihood determination.
- **ISO 31000** — International standard for risk management applicable to any type of risk, not just cybersecurity.
- **FAIR (Factor Analysis of Information Risk)** — Quantitative framework focused on measuring risk in financial terms. Breaks down risk into specific, measurable factors.
- **OCTAVE** — Operationally Critical Threat, Asset, and Vulnerability Evaluation. Self-directed risk assessment methodology.

## 2.2 Threat Modeling

Threat modeling identifies potential threats to a system during design and development.

**STRIDE** — Microsoft's threat classification model:
- **Spoofing** — Impersonating something or someone
- **Tampering** — Modifying data or code
- **Repudiation** — Denying having performed an action
- **Information Disclosure** — Exposing data to unauthorized parties
- **Denial of Service** — Making a system unavailable
- **Elevation of Privilege** — Gaining unauthorized access at a higher level

**DREAD** — Risk assessment model for prioritizing threats:
- Damage potential
- Reproducibility
- Exploitability
- Affected users
- Discoverability

**Other approaches:**
- PASTA (Process for Attack Simulation and Threat Analysis)
- Visual/agile threat modeling
- Attack trees

## 2.3 Vulnerability Management Lifecycle

1. **Discover** — Identify assets and their vulnerabilities through scanning
2. **Prioritize** — Rank vulnerabilities by risk (CVSS + business context + EPSS)
3. **Remediate** — Fix vulnerabilities (patching, configuration changes, compensating controls)
4. **Verify** — Confirm remediation was effective through re-scanning
5. **Report** — Document findings, actions, and trends for stakeholders

## 2.4 Key Risk Indicators (KRIs)

Metrics that signal increasing risk levels:
- Number of unpatched critical vulnerabilities
- Mean time to patch critical vulnerabilities
- Number of incidents per period
- Percentage of systems compliant with security baseline
- Number of failed access attempts
- Data exfiltration attempts detected
- Third-party vendor risk scores`,
      examTip: `STRIDE is used for threat MODELING (identifying threats during design). DREAD is used for risk PRIORITIZATION (ranking threats). FAIR provides quantitative risk analysis in financial terms. NIST SP 800-30 guides risk assessments. Know STRIDE categories: Spoofing, Tampering, Repudiation, Information Disclosure, DoS, Elevation of Privilege.`,
    },
    {
      id: 'domain5-risk-quiz',
      title: `Risk Management Practice Questions`,
      content: ``,
      quiz: [
        {
          question: `An organization calculates that a server has an asset value of $200,000 with a 25% exposure factor. What is the Single Loss Expectancy?`,
          options: ["$25,000", "$50,000", "$100,000", "$200,000"],
          correctIndex: 1,
          explanation: `SLE = AV × EF = $200,000 × 25% = $50,000. The Single Loss Expectancy represents the expected monetary loss from a single occurrence of the threat.`,
        },
        {
          question: `An organization purchases cyber insurance to cover potential losses from a data breach. Which risk response strategy is this?`,
          options: ["Risk avoidance", "Risk mitigation", "Risk transfer", "Risk acceptance"],
          correctIndex: 2,
          explanation: `Risk transfer shifts the financial impact of a risk to a third party. Purchasing cyber insurance transfers the financial burden of a data breach to the insurance provider. Avoidance eliminates the risk. Mitigation reduces it. Acceptance acknowledges it without additional action.`,
        },
        {
          question: `Which risk remains AFTER all security controls have been applied?`,
          options: ["Inherent risk", "Residual risk", "Total risk", "Accepted risk"],
          correctIndex: 1,
          explanation: `Residual risk is the risk that remains after controls are implemented. Inherent risk is the risk level before any controls. Residual risk must be within the organization's risk tolerance. If residual risk exceeds tolerance, additional controls are needed or the risk must be accepted with management approval.`,
        },
        {
          question: `In the STRIDE threat model, what does the "R" stand for?`,
          options: ["Ransomware", "Repudiation", "Replay", "Reconnaissance"],
          correctIndex: 1,
          explanation: `STRIDE: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege. Repudiation refers to the ability to deny having performed an action — controls like logging and digital signatures provide non-repudiation.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'Quantitative: SLE = AV × EF; ALE = SLE × ARO — ALE guides security spending decisions',
    'Risk responses: avoid, mitigate, transfer, accept — acceptance must be documented and management-approved',
    'Residual risk = risk after controls; must be within organizational risk tolerance',
    'STRIDE for threat modeling; DREAD for risk prioritization; FAIR for quantitative financial analysis',
    'Risk register tracks all identified risks, owners, responses, and residual risk levels',
  ],
},

sp_compliance: {
  topicId: 'sp_compliance',
  title: `Compliance & Regulations`,
  domainWeight: '10%',
  overview: `Compliance ensures that organizations adhere to laws, regulations, standards, and contractual obligations. Understanding major regulations, their requirements, and their applicability is essential for the Security+ exam and for any security professional.`,
  sections: [
    {
      id: 'major-regulations',
      title: `1. Major Regulations and Standards`,
      content: `Different regulations apply based on industry, data type, and geographic location. Security professionals must understand which regulations apply to their organization.

## 1.1 GDPR (General Data Protection Regulation)

The EU's comprehensive data protection regulation with global reach:

- **Scope** — Applies to ANY organization processing personal data of EU residents, regardless of where the organization is located
- **Key rights** — Right to access, right to erasure ("right to be forgotten"), right to portability, right to restrict processing, right to object
- **Consent** — Must be freely given, specific, informed, and unambiguous. Opt-in required.
- **Data Protection Officer (DPO)** — Required for organizations that process personal data on a large scale
- **Breach notification** — 72 hours to supervisory authority
- **Penalties** — Up to €20 million or 4% of annual global turnover (whichever is higher)
- **Data Protection Impact Assessment (DPIA)** — Required for high-risk processing activities
- **Privacy by design** — Data protection measures must be built into systems from the start

## 1.2 HIPAA (Health Insurance Portability and Accountability Act)

US regulation protecting health information:

- **Scope** — Covered entities (healthcare providers, health plans, clearinghouses) and their business associates
- **Protected Health Information (PHI)** — Any individually identifiable health information
- **Privacy Rule** — Defines permitted uses and disclosures of PHI
- **Security Rule** — Requires administrative, physical, and technical safeguards for ePHI
- **Breach Notification Rule** — Notification within 60 days for breaches affecting 500+ individuals
- **Minimum necessary** — Access to PHI limited to what's needed for the task
- **Business Associate Agreement (BAA)** — Required contract with any third party handling PHI

## 1.3 PCI-DSS (Payment Card Industry Data Security Standard)

Industry standard (not a government regulation) for organizations handling payment card data:

- **12 requirements** organized into 6 goals:
  1. Build and maintain a secure network (firewalls, no vendor defaults)
  2. Protect cardholder data (encryption, key management)
  3. Maintain a vulnerability management program (antivirus, secure systems)
  4. Implement strong access controls (need-to-know, unique IDs, physical access)
  5. Regularly monitor and test networks (logging, testing)
  6. Maintain an information security policy

- **Compliance levels** based on transaction volume:
  - Level 1: >6 million transactions/year (on-site audit required)
  - Level 2-4: Fewer transactions (Self-Assessment Questionnaire)

## 1.4 SOX (Sarbanes-Oxley Act)

US regulation for publicly traded companies:
- Requires internal controls over financial reporting
- CEO/CFO must certify accuracy of financial statements
- Independent auditor must assess internal controls
- Severe penalties for non-compliance (criminal liability for executives)

## 1.5 FISMA (Federal Information Security Modernization Act)

US regulation for federal agencies:
- Requires agencies to develop, document, and implement information security programs
- Uses NIST frameworks (RMF, 800-53) for implementation
- Continuous monitoring requirements
- Annual reporting to Congress

## 1.6 Other Regulations

- **GLBA (Gramm-Leach-Bliley Act)** — Protects financial institution customer information. Requires Safeguards Rule.
- **FERPA (Family Educational Rights and Privacy Act)** — Protects student education records
- **COPPA (Children's Online Privacy Protection Act)** — Protects online privacy of children under 13
- **CCPA/CPRA (California Consumer Privacy Act/California Privacy Rights Act)** — California privacy law giving residents control over personal data. Similar to GDPR in many respects.
- **State breach notification laws** — All 50 US states have breach notification laws with varying requirements`,
      examTip: `GDPR applies to ANY org processing EU resident data (global reach). HIPAA covers healthcare (PHI). PCI-DSS covers payment cards (not a government law — it's an industry standard). SOX covers publicly traded companies (financial reporting). FISMA covers federal agencies (uses NIST). Know which regulation applies to which scenario.`,
      importantNote: `GDPR's penalties are the most severe: up to €20 million or 4% of annual global turnover. Its global reach means any organization serving EU residents must comply, even if based outside the EU.`,
    },
    {
      id: 'compliance-concepts',
      title: `2. Compliance Concepts and Frameworks`,
      content: `Organizations use various mechanisms to demonstrate compliance and assess their security posture.

## 2.1 Audit Types

- **Internal audit** — Conducted by the organization's own audit team. Independent of the functions being audited. Used for self-assessment and continuous improvement.
- **External audit** — Conducted by an independent third-party auditor. Required for certifications (ISO 27001) and regulatory compliance. Provides objective assurance.
- **Regulatory audit** — Conducted by or on behalf of regulatory authorities. Non-optional. Failures can result in fines, sanctions, or loss of license.

## 2.2 SOC Reports (System and Organization Controls)

SOC reports provide independent assurance about a service organization's controls:

- **SOC 1** — Focuses on controls relevant to financial reporting. Used by financial auditors.
- **SOC 2** — Focuses on security, availability, processing integrity, confidentiality, and privacy (Trust Services Criteria). Most relevant for security assessments.
  - **Type I** — Describes controls at a point in time (design only)
  - **Type II** — Tests operating effectiveness over a period (typically 6-12 months). More valuable than Type I.
- **SOC 3** — Public-facing summary of SOC 2. Less detailed, suitable for general audiences.

## 2.3 Compliance Frameworks

- **NIST Cybersecurity Framework** — Voluntary framework widely adopted across industries
- **ISO 27001** — International certifiable ISMS standard
- **CIS Controls** — Prioritized security controls based on real-world data
- **COBIT** — IT governance framework
- **CSA STAR** — Cloud-specific security framework

## 2.4 Privacy Concepts

- **PII (Personally Identifiable Information)** — Information that can identify a specific individual (name, SSN, email, phone, biometrics, IP address when combined with other data)
- **PHI (Protected Health Information)** — Individually identifiable health information (HIPAA)
- **Data minimization** — Collect only the minimum data necessary for the stated purpose
- **Purpose limitation** — Data collected for a specific purpose should not be used for other purposes
- **Anonymization** — Irreversibly removing identifying information so data can never be linked to an individual
- **Pseudonymization** — Replacing identifying information with artificial identifiers. Can be reversed with the right key (not as strong as anonymization).
- **Tokenization** — Replacing sensitive data with non-sensitive tokens that map back to the original data through a secure lookup. Used for payment card data protection.
- **Data masking** — Obscuring specific data within a dataset (e.g., showing only last 4 digits of SSN)

## 2.5 Legal Concepts

- **Due diligence** — Investigation and research to understand risks (doing your homework)
- **Due care** — Implementing reasonable safeguards based on what you know (acting on your homework)
- **Negligence** — Failure to exercise due care. Can result in legal liability.
- **Liability** — Legal responsibility for damages or harm
- **Jurisdiction** — Legal authority based on geographic location. Important for data sovereignty and cross-border data transfers.`,
      examTip: `SOC 2 Type II is the most valuable report for assessing vendor security (tests operating effectiveness over time). Anonymization = irreversible; pseudonymization = reversible. Tokenization replaces data with tokens (used for credit cards). Due diligence = research; due care = action. Negligence = failure of due care.`,
    },
    {
      id: 'domain5-compliance-quiz',
      title: `Compliance & Regulations Practice Questions`,
      content: ``,
      quiz: [
        {
          question: `Which regulation has the broadest geographic reach, applying to any organization that processes personal data of EU residents regardless of where the organization is located?`,
          options: ["HIPAA", "PCI-DSS", "GDPR", "SOX"],
          correctIndex: 2,
          explanation: `GDPR applies to any organization processing personal data of EU residents, regardless of the organization's location. A US company selling products online to EU customers must comply with GDPR. HIPAA applies to US healthcare entities. PCI-DSS applies to card payment processors. SOX applies to US publicly traded companies.`,
        },
        {
          question: `An organization replaces credit card numbers with random tokens in its database. The original numbers are stored securely in a separate vault. What technique is this?`,
          options: ["Anonymization", "Pseudonymization", "Tokenization", "Encryption"],
          correctIndex: 2,
          explanation: `Tokenization replaces sensitive data with non-sensitive tokens (random values) while the original data is stored in a separate secure vault (token vault). It's commonly used for payment card data. Anonymization is irreversible. Pseudonymization uses artificial identifiers. Encryption transforms data using a key.`,
        },
        {
          question: `Which SOC report provides the MOST assurance about a vendor's security controls operating effectively over time?`,
          options: ["SOC 1 Type I", "SOC 2 Type I", "SOC 2 Type II", "SOC 3"],
          correctIndex: 2,
          explanation: `SOC 2 Type II focuses on security-relevant controls (Trust Services Criteria) and tests their operating effectiveness over a period (typically 6-12 months). Type I only describes controls at a point in time. SOC 1 focuses on financial controls. SOC 3 is a simplified public summary.`,
        },
        {
          question: `Under HIPAA, what is required before a healthcare provider shares PHI with a cloud hosting vendor?`,
          options: ["A SOC 2 report", "A Business Associate Agreement (BAA)", "PCI-DSS compliance", "A data classification policy"],
          correctIndex: 1,
          explanation: `HIPAA requires a Business Associate Agreement (BAA) with any third party (business associate) that will create, receive, maintain, or transmit Protected Health Information (PHI). The BAA defines the vendor's obligations for protecting PHI. While SOC 2 reports are valuable, the BAA is the legal requirement.`,
        },
      ],
    },
  ],
  keyTakeaways: [
    'GDPR has global reach — applies to any org processing EU resident data; penalties up to 4% of global turnover',
    'HIPAA protects PHI in healthcare; requires BAA with business associates',
    'PCI-DSS is an industry standard (not law) for payment card data; 12 requirements in 6 goals',
    'SOC 2 Type II provides the best assurance of vendor security controls over time',
    'Anonymization = irreversible; pseudonymization = reversible; tokenization = token replacement with secure vault',
  ],
},

// ═══════════════════════════════════════════════════════════════
// AUDIT GAP FIX (2026-05-24) — 7 new topics covering SY0-701
// objectives 1.1, 1.2, 1.3, 3.3, 4.4-4.6, 5.3, 5.5, 5.6 that were
// missing or shallow in the original curriculum.
// ═══════════════════════════════════════════════════════════════

sp_controls: {
  topicId: 'sp_controls',
  title: `Security Control Types & Foundational Concepts`,
  domainWeight: '12%',
  overview: `Security controls are the safeguards organizations deploy to protect assets, detect adversaries, and recover from incidents. SY0-701 objective 1.1 expects you to classify any given control by both its FUNCTIONAL TYPE (what it does — prevent, detect, correct, deter, compensate, direct) and its CATEGORY (where it sits — technical, managerial, operational, physical). Objective 1.2 then layers on the foundational design principles every Security+ professional applies daily: CIA, AAA, defense in depth, zero trust, least privilege, separation of duties, and need-to-know. Mastering this taxonomy is the single highest-leverage thing you can do for the exam — most questions across all five domains can be solved faster if you can quickly identify "this is a detective technical control" or "this violates least privilege."`,
  sections: [
    {
      id: 'control-functional-types',
      title: `1. Control Functional Types`,
      content: `CompTIA classifies controls by FUNCTION — what the control DOES when it operates. Memorize all six; questions love to ask you to classify a real-world scenario.

## 1.1 Preventive controls

A preventive control STOPS a security event from happening at all. The event is blocked before it can cause harm.

- **Examples**: firewalls dropping malicious packets, multi-factor authentication blocking credential-stuffing logins, full-disk encryption preventing data theft from stolen laptops, door locks preventing physical intrusion, security training preventing users from clicking phishing links.
- **Trade-off**: prevention is the strongest position but usually has friction (extra login steps, slower throughput). Never assume prevention is 100% effective — pair with detection.

## 1.2 Detective controls

A detective control IDENTIFIES that a security event happened, ideally in real time. It does not stop the event but provides the information needed to respond.

- **Examples**: intrusion detection systems (IDS), security information and event management (SIEM), audit logs, motion sensors, file integrity monitoring (FIM), antivirus alerts, video surveillance.
- **Detection-only without response is theater.** Detective controls only have value when paired with an incident response process that acts on what they find.

## 1.3 Corrective controls

A corrective control RESTORES systems to a known-good state after a security event has occurred. It is what you reach for AFTER detection.

- **Examples**: backups + restore, patching a newly-discovered vulnerability, removing malware via re-imaging, revoking compromised credentials, applying a fix to a misconfigured firewall rule.
- Some sources distinguish "corrective" from "recovery": corrective fixes the immediate issue; recovery returns the business to normal operations. SY0-701 lumps them under one heading.

## 1.4 Deterrent controls

A deterrent control DISCOURAGES an attacker from attempting an attack in the first place. It works through visibility and the threat of consequence — not by physically blocking anything.

- **Examples**: warning banners on login screens ("Unauthorized access is prohibited and will be prosecuted"), visible CCTV cameras, security guards at entrances, prosecution notices, signs announcing penalties.
- The same physical device can be both deterrent AND detective: a visible camera deters (you see it and decide not to attempt) AND detects (it records you if you do attempt).

## 1.5 Compensating controls

A compensating control is a SECONDARY control used when the PRIMARY control isn't feasible. It satisfies the same security requirement through a different mechanism.

- **PCI-DSS context**: if you can't apply the latest patches to a legacy system that processes cardholder data (primary control: keep patched), you must implement compensating controls — typically a combination of network segmentation, enhanced monitoring, IPS, and tighter access controls.
- **Other examples**: if a database can't enforce password complexity natively, putting it behind an application gateway that enforces complexity is compensating. If hardware MFA tokens can't be issued in time, requiring SMS OTP plus a secondary verification call is compensating.
- The exam pattern: a question describes why the obvious control can't be used → the right answer is the compensating one that achieves the same security outcome.

## 1.6 Directive controls

A directive control TELLS people what to do via policy, procedure, or instruction. They are written guidance.

- **Examples**: acceptable use policies (AUP), security standards documents, posted procedures (e.g., "lock workstation when leaving"), regulatory requirements telling staff how to handle PHI.
- Directive controls only work when humans are aware of them and motivated to follow them — that is why directive controls are always paired with awareness training (a different type of control entirely).`,
      examTip: `Exam shortcut: the WORDS in the scenario tell you the type. "blocks" / "prevents" → preventive. "alerts" / "logs" / "detects" → detective. "restores" / "fixes" / "patches" → corrective. "warns" / "discourages" → deterrent. "because we can't do X, we did Y instead" → compensating. "policy says..." / "documented procedure" → directive.`,
      importantNote: `One control can fit multiple types. A SIEM is primarily DETECTIVE but its alert that triggers an automated firewall block becomes PREVENTIVE for the next attempt. When the exam asks for the "best" classification, choose the control's PRIMARY function in that scenario.`,
    },
    {
      id: 'control-categories',
      title: `2. Control Categories (Technical, Managerial, Operational, Physical)`,
      content: `In addition to FUNCTIONAL type (preventive/detective/etc.), every control has a CATEGORY — the domain in which it lives. Objective 1.1 expects you to use BOTH classifications on the same control: "MFA is a preventive technical control."

## 2.1 Technical (logical) controls

Implemented in hardware, software, or firmware. Operate without human intervention once deployed.

- **Examples**: firewalls, IDS/IPS, antivirus, EDR, encryption (full-disk, in-transit, at-rest), MFA, ACLs, RBAC, VLANs, automatic patching, biometric authentication.
- **Strength**: scale and consistency — a technical control enforces the same way for every user, every transaction.
- **Weakness**: bypass risk if misconfigured; needs ongoing maintenance and tuning.

## 2.2 Managerial (administrative) controls

Set the direction of the security program. People-driven, policy-driven, decisions about what to do.

- **Examples**: security policies, risk assessments, hiring + background-check procedures, security awareness program design, vendor risk assessments, organizational structure (who reports to whom), security strategy documents.
- These set the FRAMEWORK in which technical and operational controls operate. A great firewall (technical) is undermined by a policy that lets anyone change firewall rules (no managerial control).

## 2.3 Operational controls

Day-to-day procedures executed by people to operate the security program.

- **Examples**: incident response procedures, change management process, account provisioning/de-provisioning, log review, security training delivery, configuration management, backup operations, vulnerability scanning execution.
- The line between MANAGERIAL and OPERATIONAL: managerial is the policy ("we will respond to all critical incidents within 1 hour"); operational is the procedure people execute when it happens.

## 2.4 Physical controls

Tangible measures protecting the physical environment.

- **Examples**: door locks, security guards, fences, mantraps, badge readers, CCTV, lighting, bollards, server cage locks, biometric door scanners, fire suppression, environmental monitoring (temperature, humidity).
- Often overlooked in pure-software contexts but heavily tested: "an attacker tailgated into the data center" → physical control failure.

## 2.5 Combining classifications

Every control should be classifiable on both axes. Practice with these:

| Control | Functional Type | Category |
|---|---|---|
| Firewall blocking port 22 | Preventive | Technical |
| SIEM alerting on failed logins | Detective | Technical |
| Security awareness training | Preventive | Managerial |
| Backup tape restore process | Corrective | Operational |
| Sign on data center door | Deterrent | Physical |
| Mantrap | Preventive | Physical |
| Quarterly access review | Detective | Operational |
| AUP requiring users to lock workstations | Directive | Managerial |
| Visible CCTV camera | Deterrent + Detective | Physical |
| Acceptable Use Policy enforcement via log review | Detective | Operational |

Exam tip — when a question gives you a control and asks for one classification, look at the answer choices: if they're all functional types (preventive, detective, etc.), classify by FUNCTION. If they're all categories (technical, managerial, etc.), classify by WHERE the control lives.`,
      examTip: `Easiest decoder: TECHNICAL = code/hardware does the work. MANAGERIAL = policy/decision/oversight. OPERATIONAL = a human follows a procedure. PHYSICAL = tangible object you can touch.`,
    },
    {
      id: 'foundational-principles',
      title: `3. Foundational Security Principles (CIA, AAA, Defense in Depth, Zero Trust, Least Privilege, Separation of Duties)`,
      content: `Objective 1.2 establishes the conceptual foundation every other domain builds on. These principles appear in dozens of exam questions — not always by name, but as the reason one answer is "more secure" than another.

## 3.1 The CIA Triad

The three properties every security control should preserve:

- **Confidentiality** — only authorized parties can READ the data. Enforced by encryption, access controls, classification. Loss = data breach.
- **Integrity** — data has not been tampered with or corrupted. Enforced by hashing, digital signatures, version control, write-protected media. Loss = data manipulation, fraud.
- **Availability** — data + systems are accessible when needed. Enforced by redundancy, backups, DDoS protection, fault tolerance, business continuity. Loss = outage, ransomware lockout, DDoS.

Each control should map to one or more CIA goals. When the exam asks "which goal was violated?" decode the attack: data leak = C, modified records = I, system unreachable = A.

## 3.2 AAA — Authentication, Authorization, Accounting

The control flow for every access request:

1. **Authentication** — proving you are who you claim to be. Implemented via passwords, MFA, biometrics, certificates.
2. **Authorization** — once authenticated, which resources can you access? Implemented via RBAC, ABAC, ACLs, group memberships.
3. **Accounting (auditing)** — recording WHAT authenticated users actually did. Implemented via logs, audit trails, SIEM.

A common exam trap: "the user logged in successfully but couldn't access the file" is an AUTHORIZATION failure, not an authentication failure.

## 3.3 Non-repudiation

A separate property frequently grouped with CIA: the system can PROVE that a specific party performed a specific action — they cannot credibly deny it later. Provided by digital signatures (the signer's private key is presumed to be only in their possession) and audit logs paired with strong authentication.

## 3.4 Defense in Depth (layered security)

No single control is sufficient. Stack multiple independent controls so the attacker must defeat ALL of them. If one layer is bypassed, others remain. Classic stack for a web app:

1. Perimeter firewall blocks unsolicited inbound
2. WAF inspects HTTP for application attacks (SQLi, XSS)
3. TLS encrypts in transit
4. Authentication + MFA at the app
5. Authorization enforces what the user can do
6. Input validation prevents malformed data reaching the database
7. Database encryption at rest
8. Audit logging records actions
9. EDR on the server detects anomalous behavior

If the WAF misses an attack, the input validation catches it. If both miss, the audit logs flag the suspicious behavior. Each layer is INDEPENDENT — defeating one does not automatically defeat the next.

## 3.5 Zero Trust

A modern architecture model: NEVER TRUST, ALWAYS VERIFY. Traditional perimeter security assumed "inside the firewall = trusted." Zero trust assumes the network is already compromised — every request must be authenticated and authorized regardless of source.

Core zero-trust principles:

- **Explicit verification** — authenticate and authorize on every access, not once per session
- **Least-privilege access** — give the minimum permission needed for the task
- **Assume breach** — design as if an attacker is already inside
- **Micro-segmentation** — separate workloads so a breach in one cannot pivot to another
- **Continuous monitoring** — re-evaluate access decisions based on real-time signals (user behavior, device posture, location)

Practical implementation: identity-aware proxies (Google BeyondCorp, Cloudflare Access, Zscaler), micro-perimeter firewalls per workload, device-posture checks before granting access, conditional access policies (e.g., block access if device is jailbroken).

## 3.6 Least Privilege

Grant users (and systems) the MINIMUM permissions required to perform their function — nothing more. Limits blast radius if an account is compromised.

- Implementation: RBAC with granular roles, just-in-time (JIT) elevation for sensitive actions, time-bounded access, periodic access reviews to revoke creep.
- Counter-example: shared admin accounts where everyone has full domain admin "just in case."

## 3.7 Separation of Duties (SoD)

No single person should have end-to-end control over a sensitive process. Splits authority across multiple people so collusion is required to commit fraud or cause damage.

- Classic example: in finance, the person who CREATES a vendor in the AP system is not the person who APPROVES payments to that vendor.
- In tech: the developer who writes code is not the person who deploys it to production.

## 3.8 Need-to-Know

Even users with the appropriate clearance/role should only see data they NEED for their current task. A "Secret"-cleared analyst doesn't see every Secret document — only those relevant to their assignment. Implemented via compartmentalization, RBAC + ABAC combinations, and data labeling.

## 3.9 Job Rotation, Mandatory Vacation, Dual Control

Operational controls layered on top of the principles above:

- **Job rotation** — periodically rotating staff through different roles. Detects fraud (a successor in the role spots irregularities) AND prevents single-person dependency on critical skills.
- **Mandatory vacation** — requiring an employee to take a continuous absence (typically a week or more) so fraud that requires their ongoing maintenance is exposed.
- **Dual control / two-person integrity** — sensitive operations require two people simultaneously (e.g., crypto key ceremonies, vault access, nuclear missile launch keys).

## 3.10 Fail-Safe / Fail-Secure / Fail-Open

What does a control do when it BREAKS? Choose deliberately:

- **Fail-safe (fail-open)** — system reverts to a state that's safe for PEOPLE. Building doors unlock during fire alarm = people can escape. Sacrifices security for safety.
- **Fail-secure (fail-closed)** — system reverts to a state that's safe for DATA. A firewall that loses its rule database blocks ALL traffic = no leaks. Sacrifices availability for confidentiality.

Exam pattern: "the data center's badge reader system crashes — what should happen to the door?" Answer depends on whether life safety (fail-safe) or asset protection (fail-secure) is the priority for that door.`,
      examTip: `CIA is tested constantly. Memorize: read access = Confidentiality, modify = Integrity, reach the system = Availability. Defense in Depth ≠ Zero Trust. Defense in Depth is "many layers"; Zero Trust is "never trust the network." You can have one without the other, but modern security uses both.`,
      importantNote: `Separation of Duties and Least Privilege are related but distinct. Least Privilege: each individual gets the minimum. Separation of Duties: split a process across multiple individuals. You can violate one without violating the other.`,
    },
  ],
  keyTakeaways: [
    'Six functional control types: Preventive (block), Detective (alert), Corrective (fix), Deterrent (discourage), Compensating (alternative), Directive (policy)',
    'Four control categories: Technical (code/hardware), Managerial (policy/decision), Operational (procedure people execute), Physical (tangible)',
    'CIA triad: Confidentiality, Integrity, Availability — every control maps to one or more',
    'AAA flow: Authentication (who) → Authorization (what) → Accounting (audit)',
    'Defense in Depth: many independent layers. Zero Trust: never trust the network, verify every request.',
    'Least Privilege ≠ Separation of Duties — both are needed independently',
    'Fail-safe protects PEOPLE (fail open); Fail-secure protects DATA (fail closed). Pick deliberately per-control.',
  ],
},

sp_change_mgmt: {
  topicId: 'sp_change_mgmt',
  title: `Change & Configuration Management`,
  domainWeight: '12%',
  overview: `Most production outages and a non-trivial fraction of breaches are caused by changes — patches that broke something, a firewall rule modified without review, a server provisioned with default credentials. SY0-701 objective 1.3 makes change management a first-class exam topic because the security implications of poor change control are enormous. This topic covers the formal change-management process (CAB, RFC, impact analysis, rollback), configuration management (baselines, drift detection, CMDB), and how the two combine to keep systems in a known-good, auditable state.`,
  sections: [
    {
      id: 'change-management-process',
      title: `1. The Formal Change-Management Process`,
      content: `Change management is the structured workflow for evaluating, approving, implementing, and reviewing any modification to a production system. It exists to prevent the most common security incident pattern: "we made a change last night and now [bad thing]."

## 1.1 The standard change-management lifecycle

Every formal change-management process has roughly these stages, often abbreviated by frameworks like ITIL:

1. **Request** — someone submits a Request for Change (RFC) describing what they want to change and why
2. **Assessment / impact analysis** — what could go wrong? What systems depend on the thing being changed? Security review.
3. **Approval** — a Change Advisory Board (CAB) reviews and approves, defers, or rejects
4. **Scheduling** — when will the change occur? During a maintenance window? With what notice to users?
5. **Implementation** — perform the change per the documented plan
6. **Verification** — test that the change worked and didn't break anything else
7. **Closure & post-implementation review (PIR)** — document the outcome, lessons learned, update baselines

Each stage produces an artifact (the RFC, the impact analysis, the CAB decision, the implementation log, the PIR) that becomes part of the audit trail. Auditors will trace a sampled change end-to-end.

## 1.2 Change Advisory Board (CAB)

A committee that reviews and approves changes. Typical members:

- Change manager (chair)
- Affected system owners
- Security representative
- Operations / on-call lead
- Sometimes: legal, compliance, business stakeholders

The CAB exists to catch second-order effects the requester might not see. Example: a developer's patch RFC seems innocuous, but the security rep notes it bumps a dependency that breaks compliance with a regulatory requirement.

CAB cadence varies — weekly for most orgs, daily for fast-moving organizations, ad-hoc emergency CAB (eCAB) for urgent changes.

## 1.3 Change types

Most frameworks classify changes into three tiers, each with different approval requirements:

- **Standard changes** — pre-approved low-risk changes (e.g., patching a workstation, adding a user to a standard group). Don't need CAB review each time; covered by a standing approval.
- **Normal changes** — go through full CAB review. Most production changes.
- **Emergency changes** — required to resolve an active incident or imminent risk. Use the eCAB and abbreviated process, with FULL retroactive documentation.

The exam tests whether you know that "we needed to patch the zero-day on the public web server tonight" is an emergency change, not an excuse to skip change management entirely.

## 1.4 Impact analysis

For every non-standard change:

- **Affected systems** — what runs on the target? What does the target depend on?
- **Affected users** — who will lose access during the change window? Who needs to be notified?
- **Risk assessment** — what's the probability and impact of the change failing or causing unintended consequences?
- **Rollback plan** — exactly how do we revert if it goes wrong? Tested?
- **Security review** — does this change open new attack surface? Change a security boundary? Modify access controls?

A change RFC without a rollback plan should be rejected.

## 1.5 Approval, scheduling, and notification

After approval, the change is scheduled — typically during a maintenance window when impact is minimized. Stakeholders are notified via the agreed channel (email, ticket system, status page). Users get advance notice for changes that affect them. Maintenance windows are sized to include implementation + verification + rollback time.

## 1.6 Implementation, verification, post-implementation review

The implementer follows the documented plan exactly — no improvisation. After the change, the verification step confirms:

- The intended outcome was achieved
- No related systems broke
- Monitoring shows normal behavior
- Logs from the change are preserved

The PIR (a few days later) asks: did the change have any second-order effects we missed? What did we learn? Update the runbook / baseline / RFC template accordingly.

## 1.7 The unauthorized change problem

The biggest risk to a change-management program is the unauthorized change — someone modifying production WITHOUT going through the process. Detection mechanisms:

- **Configuration drift detection** — automated comparison of current config against the approved baseline (see §2)
- **File integrity monitoring (FIM)** — alerts when system files change unexpectedly
- **Privileged access logging** — every admin action is logged and reviewed
- **Tripwire-style audits** — periodic comparisons of running config against the CMDB

When an unauthorized change is detected: investigate (was it a mistake, malice, or a process failure?), correct, and follow up with the responsible party.`,
      examTip: `Memorize the change types: STANDARD (pre-approved, no CAB), NORMAL (full CAB review), EMERGENCY (eCAB, abbreviated process, full retroactive docs). The exam asks you to classify scenarios.`,
      importantNote: `Patching is the most common source of "I didn't go through change management" violations. Establish standard-change templates for routine patching so the team has a fast path that's STILL within the process.`,
    },
    {
      id: 'configuration-management',
      title: `2. Configuration Management, Baselines, and Drift Detection`,
      content: `Configuration management complements change management: change management governs HOW you modify systems; configuration management tracks WHAT state systems are in at any given time.

## 2.1 The configuration baseline

A baseline is the documented, approved state of a system or category of systems. Three common types:

- **Security baseline** — minimum security configuration every system of a given class must meet (e.g., disable telnet, enforce password complexity, enable audit logging)
- **Functional baseline** — the approved software versions, configuration files, dependencies for a system
- **Hardware baseline** — approved hardware models, firmware versions, BIOS settings

Baselines are CONCRETE — usually checklist artifacts (CIS Benchmarks, DISA STIGs) or scripts that codify the standard.

## 2.2 Baseline sources

You typically don't write baselines from scratch. Common starting points:

- **CIS Benchmarks** — Center for Internet Security publishes consensus-based baselines for every common OS, database, cloud platform, and application. Two levels: L1 (essential, low impact) and L2 (advanced, may affect functionality).
- **DISA STIGs** — Defense Information Systems Agency Security Technical Implementation Guides; mandatory for DoD systems but widely used elsewhere.
- **Vendor hardening guides** — Microsoft, Cisco, AWS, etc. publish their own.
- **Internal customization** — most orgs take a CIS or STIG baseline and ADD organization-specific requirements (e.g., specific logging endpoint, corporate certificate store).

## 2.3 Configuration drift

Over time, systems diverge from their baselines — admins make changes, hot-fixes get applied, undocumented modifications accumulate. This is "drift." Drift creates two problems:

1. **Inconsistency** — two servers labeled identically may behave differently because one drifted
2. **Security regression** — a hardening setting that gets disabled "because it was breaking something" stays disabled

Drift-detection tools continuously compare actual configuration to the baseline and report deltas. Examples: AWS Config Rules, Ansible drift detection, Chef InSpec, Puppet PE Compliance, OpenSCAP for Linux.

## 2.4 Configuration as code (IaC)

Modern best practice: express configuration as code (Terraform, CloudFormation, Ansible, Puppet, Chef) stored in version control. Benefits:

- Every change is reviewable in a pull request
- History is preserved (git log)
- Rollback = revert commit
- Reproducibility — a destroyed system can be rebuilt exactly
- Drift becomes detectable by comparing live state to declared code

This collapses change management AND configuration management into ONE workflow: change to the IaC repo → PR review (your CAB review) → CI/CD pipeline applies it → drift detection ensures the live state matches the code.

## 2.5 Configuration Management Database (CMDB)

The CMDB is the system of record for "what we have and how it's configured." It stores Configuration Items (CIs) — every asset, application, service, dependency — and the relationships between them.

- Used to answer "if I patch this library, what apps break?" or "if this server goes down, what business services are affected?"
- Populated and kept current via discovery scans, agent reports, and integration with change management
- Required by many frameworks (ITIL, ISO 20000) and useful for incident response, asset management, and compliance audits

## 2.6 Version control for security artifacts

Every security artifact should be version-controlled:

- Firewall rule sets
- IDS/IPS signatures
- Detection rules (SIEM correlation, EDR custom queries)
- Security policies and procedures
- IaC for infrastructure

Version control gives you: blame (who changed what when), diff (what exactly changed), rollback (revert a bad change), and approval gates (require review before merge).`,
      examTip: `Configuration baseline questions tend to focus on CIS Benchmarks (the most-named source in CompTIA materials). Know that CIS has L1 (basic) and L2 (advanced) profiles, and that DISA STIGs are the DoD equivalent.`,
    },
    {
      id: 'change-mgmt-failures',
      title: `3. Common Failure Modes and the Security Connection`,
      content: `Change management is a frequent exam topic precisely because its failures are so visible and so often security incidents.

## 3.1 The unapproved-change scenario

An admin pushes a change without RFC, breaks production OR opens a vulnerability. Controls that prevent it:

- Privileged Access Management (PAM) tools that GATE production access behind a ticket-approval workflow
- IaC pipelines where the only path to production is through reviewed code
- Detective: drift detection alerts on config that diverges from approved baseline
- Detective: audit log review flags admin actions without a corresponding RFC

## 3.2 The "I just applied the patch" scenario

A patch was applied without impact analysis; it broke a dependent system or introduced its own vulnerability. Controls:

- Patch deployment goes to a TEST environment first
- Standard-change templates for routine patches still include rollback steps and verification
- Patches are validated against compatibility matrices

## 3.3 The rollback that didn't work

A bad change is rolled back per the plan — but the rollback itself fails because no one tested it. Controls:

- The RFC requires the rollback plan to have been tested in non-production
- Backups are taken IMMEDIATELY before the change (not "we have last night's backup")
- Database changes use migrations with verified down-migrations

## 3.4 The change that violated the security baseline

A developer "temporarily" disabled a hardening setting to debug an issue, then never restored it. Controls:

- Configuration drift detection alerts within minutes of the baseline deviation
- Automated remediation reverts the change (with notification)
- PIR captures the deviation as a "do not let this happen again" lesson

## 3.5 The undocumented dependency

A change to System A broke System B because no one knew System B depended on System A. Controls:

- CMDB accurately models dependencies
- Impact analysis as a mandatory step in the RFC
- Service ownership clarity (every service has a known owner)

## 3.6 Emergency change abuse

Every change gets declared "emergency" to skip the CAB. Controls:

- Strict criteria for what qualifies as emergency (active incident, imminent compliance deadline, security vulnerability being actively exploited)
- Emergency changes are reviewed retroactively — abuse is visible in metrics
- The CAB tracks emergency-change rate and challenges teams whose rate is anomalously high

## 3.7 Putting it all together

A mature change-management program combines:

- Documented process (managerial control)
- CAB / eCAB (operational control)
- Change-management ticketing system (technical control)
- Configuration baselines + drift detection (technical detective)
- PIR feedback loop into baseline updates (managerial)
- Logging + monitoring of all admin actions (technical detective)

When the exam asks "what control would have prevented this incident?" and the incident was an unreviewed change, the answer is almost always either "formal change management" or "configuration drift detection" — both are correct depending on whether the question emphasizes the process gap or the detective gap.`,
      examTip: `When the exam describes an outage or incident caused by a misconfiguration, the right answer often involves a change-management or configuration-management control — even if you don't see those exact words in the options. Look for "approval workflow," "baseline," "version control," "drift detection."`,
    },
  ],
  keyTakeaways: [
    'Three change types: Standard (pre-approved), Normal (CAB review), Emergency (eCAB, retroactive docs)',
    'The CAB exists to catch second-order effects the requester might not see',
    'Every RFC needs an impact analysis AND a tested rollback plan',
    'Configuration baselines (CIS Benchmarks, DISA STIGs) define the known-good state',
    'Configuration drift = systems diverging from baseline over time; detect with tools like AWS Config, OpenSCAP, Chef InSpec',
    'Infrastructure as Code collapses change + config management into one reviewable workflow (PR = RFC)',
    'CMDB models dependencies so impact analysis can answer "what else does this affect?"',
  ],
},

sp_api_security: {
  topicId: 'sp_api_security',
  title: `API Security & Modern Integrations`,
  domainWeight: '18%',
  overview: `Every modern application is a collection of APIs talking to other APIs. The mobile app talks to a REST backend, which calls a payments API, which calls a fraud-scoring API, which calls a third-party identity API. SY0-701 objective 3.3 makes API security a discrete exam topic because the attack surface is now overwhelmingly API-shaped. This topic covers REST/SOAP fundamentals, authentication (API keys, OAuth 2.0, JWT), the OWASP API Top 10 threats, and the controls (API gateways, rate limiting, schema validation) that secure them.`,
  sections: [
    {
      id: 'api-fundamentals',
      title: `1. API Fundamentals and Authentication`,
      content: `## 1.1 API styles

The exam mentions these by name:

- **REST (Representational State Transfer)** — by far the most common. Resources are URIs (\`/users/42\`), operations are HTTP verbs (GET, POST, PUT, PATCH, DELETE). Stateless, JSON payloads.
- **SOAP (Simple Object Access Protocol)** — XML-based, formal contracts via WSDL, heavyweight. Still common in financial services and legacy enterprise. Built-in WS-Security for message-level signing/encryption.
- **GraphQL** — single endpoint, clients specify exactly what fields they need. Powerful but introduces new attack patterns (query depth abuse, introspection leakage).
- **gRPC** — Google's binary RPC protocol over HTTP/2, schema-defined with Protocol Buffers. Used heavily in microservices.

## 1.2 API key authentication

The simplest API auth — a shared static secret the client sends in a header (\`X-API-Key: abc123\`) or query parameter. Pros: trivial to implement. Cons:

- Static secrets leak (committed to git, screenshotted, stored in URLs which get logged)
- No expiration or rotation built-in
- No identity beyond "the key holder"

Best practice: use API keys ONLY for server-to-server, never expose to browsers or mobile apps, rotate frequently, scope to specific operations.

## 1.3 OAuth 2.0

The dominant standard for DELEGATED authorization — letting App A access Service B's data on behalf of User C, WITHOUT sharing User C's password with App A.

Core concepts:

- **Resource Owner** — the user
- **Client** — the app requesting access
- **Authorization Server** — the OAuth provider (Auth0, Okta, Google, Microsoft Entra)
- **Resource Server** — the API holding the protected data
- **Access Token** — short-lived credential the client presents to the resource server
- **Refresh Token** — longer-lived credential the client uses to get a new access token

The four standard grant types you must know:

| Grant Type | Use Case |
|---|---|
| **Authorization Code (+ PKCE)** | Web apps, mobile apps. User redirected to auth server, returns with a code that the client exchanges for tokens. PKCE (Proof Key for Code Exchange) extension prevents code interception attacks; now mandatory for public clients. |
| **Client Credentials** | Server-to-server with no user. The client (a backend service) authenticates with its own credentials. |
| **Resource Owner Password Credentials** | LEGACY — user gives password directly to the client. Deprecated. Do not use for new systems. |
| **Implicit** | DEPRECATED — tokens returned directly in URL fragment. Replaced by Authorization Code + PKCE. |

When the exam asks "which grant type for a single-page web app?" the answer is **Authorization Code with PKCE**.

## 1.4 OpenID Connect (OIDC)

OAuth 2.0 is AUTHORIZATION. OIDC is AUTHENTICATION layered on top of OAuth 2.0 — it adds an \`id_token\` (a JWT containing the user's identity claims) so the client knows WHO the user is, not just THAT they granted access. "Sign in with Google" is OIDC.

## 1.5 JWT (JSON Web Token)

A compact, signed token format used heavily by OAuth/OIDC. Three Base64URL-encoded parts joined by dots: \`header.payload.signature\`.

- **Header**: algorithm + token type (e.g., \`{"alg":"RS256","typ":"JWT"}\`)
- **Payload**: claims (e.g., \`{"sub":"user-42","iat":1716595200,"exp":1716598800,"role":"admin"}\`)
- **Signature**: HMAC or asymmetric signature over header+payload

Critical security properties:

- JWTs are SIGNED but NOT encrypted by default — anyone who intercepts one can read the claims (Base64 decode)
- Tampering invalidates the signature, so claims can't be modified without detection (IF the verifier checks)
- Common attack: \`{"alg":"none"}\` attack — old JWT libraries accepted unsigned tokens. Always validate the \`alg\` field server-side against a whitelist.
- Common attack: algorithm confusion — submitting an HS256 token to a server expecting RS256, using the public key as the HMAC secret. Always pin the expected algorithm.

## 1.6 mTLS (Mutual TLS)

Both client and server present certificates. Common in zero-trust and machine-to-machine scenarios where you want to authenticate the calling SERVICE, not just a user token. Strong but operationally heavy (cert provisioning, rotation, revocation).`,
      examTip: `Memorize the OAuth grant types: Authorization Code + PKCE = the right answer for browser/mobile apps. Client Credentials = the right answer for backend-to-backend. Implicit and Resource Owner Password are DEPRECATED.`,
      importantNote: `JWTs are signed, not encrypted. Don't put secrets in JWT payloads — anyone who intercepts the token can decode them. If you need confidentiality, use JWE (JSON Web Encryption) instead of plain JWT.`,
    },
    {
      id: 'owasp-api-top-10',
      title: `2. OWASP API Security Top 10 (2023)`,
      content: `OWASP maintains a separate Top 10 just for API risks because API attacks differ structurally from traditional web-app attacks. SY0-701 expects familiarity with at least the most common items.

## 2.1 API1 — Broken Object Level Authorization (BOLA / IDOR)

The #1 API risk. The API has authentication but doesn't check whether the AUTHENTICATED user is authorized to access THIS specific object.

\`\`\`
GET /api/v1/users/42/profile  → returns user 42's profile
GET /api/v1/users/43/profile  → also returns it! (bug: no check)
\`\`\`

Fix: every endpoint that takes an object ID checks that the requesting user owns or has access to that object. Don't rely on the client to send only valid IDs — clients are attackers.

## 2.2 API2 — Broken Authentication

Weak auth implementations: predictable tokens, missing token validation, weak password policies, missing brute-force protection, accepting expired tokens. Includes the JWT pitfalls above.

## 2.3 API3 — Broken Object Property Level Authorization

Subdivides into:

- **Excessive data exposure**: the API returns ALL fields of an object, including ones the client shouldn't see. Filtering left to the client = insecure.
- **Mass assignment**: client sends extra fields and the server blindly assigns them. \`PATCH /users/42\` with \`{"role":"admin"}\` makes the user an admin if the API auto-binds payload to model.

Fix: explicit allow-list of fields per endpoint, per user role. DTOs that don't include sensitive fields.

## 2.4 API4 — Unrestricted Resource Consumption

Without rate limits or quotas, an attacker can:

- Cause DoS by sending many requests
- Run up cloud bills (the "denial of wallet" attack)
- Exhaust resources (CPU, memory, database connections, third-party API quotas)

Fix: rate limiting per client, per endpoint, per resource. Quotas. Request size limits. Timeouts on long-running operations.

## 2.5 API5 — Broken Function Level Authorization

Admin endpoints accessible to regular users because authorization isn't enforced consistently. Often happens when admin functionality is "hidden" by client UI but not protected server-side.

Example: \`/admin/users/delete\` is hidden from the regular UI but a curious user discovers it and finds there's no role check.

Fix: deny-by-default, explicit role checks on every endpoint.

## 2.6 API6 — Unrestricted Access to Sensitive Business Flows

Attacker abuses a legitimate business flow at scale: bulk-purchasing limited inventory, brute-forcing promo codes, scraping a public-but-rate-limited dataset. The individual requests are legal; the volume is the attack.

Fix: bot detection (CAPTCHA, behavioral analysis), business-logic rate limits, anomaly detection.

## 2.7 API7 — Server-Side Request Forgery (SSRF)

The API takes a URL as input and fetches it server-side. Attacker provides a URL pointing to internal services (\`http://169.254.169.254/\` — AWS instance metadata) → API leaks internal info or makes the server perform actions the attacker can't.

Fix: validate URLs against an allow-list, block private IP ranges, disable URL redirects, use a dedicated egress proxy.

## 2.8 API8 — Security Misconfiguration

Default credentials, verbose error messages leaking internals, CORS too permissive (\`Access-Control-Allow-Origin: *\` on authenticated endpoints), missing security headers, exposed admin/debug endpoints.

Fix: hardening baselines, automated config scanning, security headers (HSTS, CSP, X-Frame-Options).

## 2.9 API9 — Improper Inventory Management

The org has APIs in production it forgot about. Old API versions still respond. Staging APIs are publicly reachable. Documentation says "we removed v1" but v1 still answers.

Fix: API inventory tooling, API gateway showing all routes, periodic discovery scans, formal sunset process for old versions.

## 2.10 API10 — Unsafe Consumption of APIs

Trusting data from a third-party API without validating it. Insecure deserialization of upstream JSON, blind eval of returned values. Treat upstream APIs as untrusted input just like client requests.`,
      examTip: `BOLA/IDOR is the single most-tested API attack. Memorize the pattern: API authenticates the user but doesn't check object ownership. Sequential or guessable IDs make this trivially exploitable.`,
    },
    {
      id: 'api-controls',
      title: `3. API Gateways, Rate Limiting, and Schema Validation`,
      content: `Putting the right controls at the right layer is what separates a secure API from a leaky one.

## 3.1 API gateway

A single front door for all API traffic. Common implementations: AWS API Gateway, Azure API Management, Kong, Apigee, Tyk. Responsibilities:

- **Authentication / authorization** — token validation, API-key checks, mTLS enforcement
- **Rate limiting + quotas** — per-client, per-endpoint
- **Request validation** — payload size, content type, schema conformance
- **TLS termination** — handles certificates, allows internal mTLS or plaintext as the backend prefers
- **Routing** — directs requests to the appropriate backend service
- **Logging + metrics** — every request observed
- **WAF integration** — runs request through web-app firewall rules

The gateway is where you centralize controls so the backend services don't each have to reinvent them.

## 3.2 Rate limiting strategies

| Strategy | What it does |
|---|---|
| **Fixed window** | "100 requests per minute starting at :00." Simple but bursty at window boundaries. |
| **Sliding window** | Smooths the boundary effect by averaging over a moving window. |
| **Token bucket** | Each client has a bucket that refills at a steady rate; requests consume tokens. Allows bursts up to the bucket size. |
| **Leaky bucket** | Requests queue and drain at a steady rate. Bursts get queued or dropped. |

Apply rate limits at MULTIPLE LAYERS: per-IP (to slow bots that haven't authenticated), per-user (to limit a single account's impact), per-API-key, per-endpoint (writes more limited than reads), per-resource (e.g., "max 10 OTP requests per phone number per hour").

When the limit is hit, return HTTP 429 (Too Many Requests) with a \`Retry-After\` header.

## 3.3 Schema validation

Every API request/response should conform to a SCHEMA — OpenAPI/Swagger for REST, GraphQL SDL for GraphQL, .proto for gRPC, WSDL for SOAP.

Server-side validation rejects malformed requests EARLY:

- Wrong field types
- Missing required fields
- Extra unexpected fields (catches mass-assignment attempts)
- Out-of-range values (e.g., a "quantity" field receiving negative numbers)

Many API gateways enforce OpenAPI schemas declaratively — you don't have to write per-field checks in your service code.

## 3.4 Web Application Firewall (WAF) for APIs

Traditional WAF rules (SQL injection patterns, XSS patterns) help on APIs too. Modern WAFs have API-specific rule sets that understand JSON, validate against OpenAPI schemas, and detect API-specific abuse like enumeration or scraping.

Notable open source: ModSecurity with OWASP Core Rule Set (CRS). Commercial: AWS WAF, Cloudflare WAF, Imperva.

## 3.5 Authentication architecture choices

- **Token validation at the gateway** vs **token validation at the service** — gateway validation is faster (single place) but services can't independently verify (e.g., for sensitive operations needing additional checks). Best practice: BOTH — gateway does primary validation, services do business-context authorization.
- **Sticky vs stateless sessions** — stateless JWT/OAuth scales horizontally; session cookies require sticky load balancing or shared session store.
- **API keys** for server-to-server, **OAuth 2.0 access tokens** for user-delegated, **mTLS** for high-assurance machine-to-machine.

## 3.6 Audit + monitoring specific to APIs

- Log every request (method, path, user, IP, response code, latency)
- Detect anomalies: spike in 4xx (attacker probing), unusual user-agent, geographic anomalies, sequential ID enumeration
- Alert on auth failures clusters (credential stuffing), high error rates from a single client, sudden bandwidth spikes
- Forward all API logs to SIEM for correlation with the rest of the environment

## 3.7 Versioning and deprecation

APIs evolve. The wrong way: silently break old clients. The right way:

- Version URLs or headers (\`/api/v1/\` vs \`/api/v2/\`)
- Announce deprecation well in advance
- Sunset old versions on a published schedule
- Log usage of deprecated versions so you know who'll break

API1 vulnerabilities in old versions are a frequent attack vector — if v1 is still responding, attackers will hunt it for bugs that were fixed in v2.`,
      examTip: `Two patterns to memorize: (1) Rate limiting goes at MULTIPLE layers — per-IP, per-user, per-endpoint. (2) Schema validation REJECTS requests with unexpected fields — this is the primary defense against mass assignment (API3).`,
    },
  ],
  keyTakeaways: [
    'OAuth 2.0 is for AUTHORIZATION; OIDC adds AUTHENTICATION on top. JWT is the token format both commonly use.',
    'Authorization Code + PKCE is the modern grant type for browser/mobile apps. Implicit and Resource Owner Password are DEPRECATED.',
    'BOLA/IDOR (#1 API risk): auth without object-level access checks. Always verify the authenticated user owns or can access the requested object.',
    'JWTs are signed, NOT encrypted. Anyone who captures one can read the claims. Use JWE for confidentiality.',
    'API gateway centralizes auth, rate limiting, schema validation, logging — so backend services don\'t reinvent each control',
    'Apply rate limits at multiple layers (per-IP, per-user, per-API-key, per-endpoint) using token-bucket or sliding-window',
    'Schema validation rejects requests with unexpected fields — primary defense against mass-assignment attacks',
  ],
},

sp_sdlc: {
  topicId: 'sp_sdlc',
  title: `Secure SDLC & Development Practices`,
  domainWeight: '28%',
  overview: `The Security Operations domain (28% of the exam) includes major objectives on secure software development that the platform previously covered only obliquely through application-attack topics. SY0-701 objectives 4.4–4.6 expect you to know SDLC models, secure coding practices, the testing tool stack (SAST/DAST/IAST/SCA), and how security integrates into modern CI/CD pipelines. This topic addresses the development side of the equation — building software that doesn't have the vulnerabilities the threat-modeling topics teach you to look for.`,
  sections: [
    {
      id: 'sdlc-models',
      title: `1. SDLC Models & Secure-by-Design Integration`,
      content: `## 1.1 The classic SDLC phases

Every software development lifecycle has roughly these phases:

1. **Requirements** — what should the software do?
2. **Design** — how should it be built?
3. **Implementation (coding)** — building it
4. **Testing** — verifying it works correctly
5. **Deployment** — releasing it to production
6. **Maintenance** — fixing bugs, applying patches, retiring it

Each phase has security activities:

| Phase | Security Activity |
|---|---|
| Requirements | Identify security + compliance requirements alongside functional ones |
| Design | Threat modeling, attack surface review, security architecture review |
| Implementation | Secure coding standards, code review, static analysis (SAST) |
| Testing | Penetration testing, dynamic analysis (DAST), security regression tests |
| Deployment | Infrastructure hardening, secrets management, security configuration review |
| Maintenance | Patch management, vulnerability scanning, sunset process |

## 1.2 Waterfall

The original SDLC model — phases happen sequentially, each completed before the next starts. Heavy upfront design, formal sign-off between phases.

- Pros: predictable, well-documented, suits regulated environments (medical devices, aerospace) where rework is expensive.
- Cons: slow to deliver, late discovery of design problems is expensive.
- Security implication: threat modeling happens once at design and may not be revisited. Vulnerabilities discovered late require expensive rework.

## 1.3 Agile

Iterative and incremental. Software is built in short cycles (sprints, typically 2 weeks). Each cycle produces working software that stakeholders review.

- Pros: fast feedback, adaptable to change, continuous delivery
- Cons: requires discipline to avoid accumulating tech debt; documentation is often lighter
- Security implication: traditional "do all the security work upfront" doesn't fit. Security must be EMBEDDED in each sprint — threat modeling deltas per feature, security tests in the definition of done.

## 1.4 DevOps

A culture + practice combining Development and Operations. Goals: faster delivery, fewer incidents, tight feedback loops. Built on CI/CD pipelines that automate build → test → deploy.

## 1.5 DevSecOps

DevOps with security as a first-class concern, NOT a final-stage gate. Core principle: **shift left** — find and fix security issues as early in the SDLC as possible, where they're cheapest to fix.

Practical DevSecOps activities:

- **Pre-commit**: SAST hooks, secrets scanning (block commits containing API keys)
- **Pull request**: peer code review (security-aware), SAST scan as a check, dependency vulnerability scan (SCA)
- **CI build**: SAST + SCA + license scan + container image scan
- **CI test**: DAST against the running app, fuzz testing, security regression tests
- **CI deploy**: infrastructure-as-code security scan (Checkov, tfsec), policy-as-code (OPA)
- **Production**: WAF, runtime application self-protection (RASP), continuous vulnerability scanning, incident response integration

The key DevSecOps insight: every security check that runs LATER costs more to remediate. A bug caught in the IDE costs ~$1; the same bug in production costs ~$10,000.

## 1.6 Threat modeling

A structured approach to identifying threats during design. Methodologies the exam may name:

- **STRIDE** (Microsoft) — categorizes threats: Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege.
- **DREAD** — used to score threats: Damage potential, Reproducibility, Exploitability, Affected users, Discoverability. Largely fallen out of favor.
- **PASTA** (Process for Attack Simulation and Threat Analysis) — risk-centric, 7 stages.
- **ATT&CK** (MITRE) — adversary-tactic-focused; mostly used post-design for detection planning.

For a new feature: enumerate components, draw data flows, apply STRIDE to each flow → list of threats → design mitigations.

## 1.7 Secure-by-design principles

Concepts from objective 1.2 (covered fully in sp_controls) that apply during design:

- **Least privilege** for the application itself (database user with minimum needed grants, file permissions tight)
- **Defense in depth** — multiple layers; don't rely on the WAF as the only XSS defense
- **Fail securely** — error paths default to safe state (deny access on auth failure, not allow)
- **Secure defaults** — out-of-the-box configuration is the SECURE configuration; insecure options require explicit opt-in
- **Don't trust input** — validate everything from anywhere
- **Don't trust the client** — server-side enforces all rules; client validation is UX, not security`,
      examTip: `"Shift left" is the DevSecOps slogan — finding bugs earlier in the SDLC is cheaper to fix. STRIDE is the most commonly tested threat-modeling methodology.`,
    },
    {
      id: 'secure-coding',
      title: `2. Secure Coding Practices`,
      content: `Specific coding techniques that prevent the application vulnerabilities tested across the exam.

## 2.1 Input validation

The foundational defense. Every input from outside the trust boundary is hostile until proven otherwise.

- **Allow-list, not block-list** — define what IS valid, reject everything else. Block-listing is brittle (attackers find ways around it).
- **Validate at the SERVER** — client-side validation is UX, not security. The client can be modified or bypassed.
- **Validate type, length, format, range, encoding** — a "username" should match \`^[a-zA-Z0-9_]{3,32}$\`, not just "non-empty."
- **Canonicalize first** — decode/normalize input before validation. \`%2e%2e%2f\` becomes \`../\` after URL decoding; validate after that.
- **Validate at the trust boundary** — once, completely, at the edge. Don't sprinkle ad-hoc checks throughout the code.

## 2.2 Parameterized queries (preventing SQL injection)

Never build SQL by string concatenation. Use parameterized queries / prepared statements:

\`\`\`python
# WRONG — vulnerable
cursor.execute(f"SELECT * FROM users WHERE id = '{user_id}'")

# RIGHT — parameterized
cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
\`\`\`

The database engine treats the parameter as DATA, not as SQL syntax. \`'; DROP TABLE users; --\` becomes a literal string searched for in the id column, not code that runs. Use an ORM or query builder for additional safety.

## 2.3 Output encoding (preventing XSS)

When inserting user data into HTML, JavaScript, CSS, or URLs, ENCODE for the OUTPUT CONTEXT:

- HTML context: \`<\` → \`&lt;\`, \`>\` → \`&gt;\`, \`"\` → \`&quot;\`
- JavaScript context: stricter — escape backslashes, quotes, control characters
- URL parameter: percent-encode
- CSS context: hex-encode

Modern frameworks (React, Vue, Angular) auto-encode by default in their template syntax. The danger is when developers explicitly bypass that (\`dangerouslySetInnerHTML\`, \`v-html\`).

## 2.4 Authentication + session handling

- Hash passwords with a memory-hard adaptive function: **bcrypt**, **scrypt**, **Argon2id** (preferred). NEVER MD5 or SHA-256 (too fast).
- Use cryptographically random session tokens (≥128 bits of entropy)
- Set session cookies as \`HttpOnly\` (no JS access), \`Secure\` (HTTPS only), \`SameSite=Lax\` or \`Strict\` (CSRF defense)
- Idle and absolute session timeouts
- Regenerate the session ID after authentication (prevents session fixation)
- Logout invalidates the session server-side

## 2.5 Authorization checks

Every action that accesses or modifies a protected resource needs an explicit authorization check IN THE SERVER CODE:

- Don't rely on UI hiding to enforce permissions
- Check both that the user has the right role AND that the user owns/can-access the SPECIFIC object
- Deny by default — explicit allows

## 2.6 Cryptography — use, don't roll

Use vetted libraries: OpenSSL/BoringSSL, libsodium, JCE, .NET Crypto, Python cryptography library. Never:

- Implement your own crypto algorithms
- Use deprecated algorithms (MD5, SHA-1, DES, RC4) for new code
- Use ECB mode block cipher
- Use a static IV with a stream cipher
- Hard-code keys in source

Always:

- AES-256-GCM for symmetric (provides authenticated encryption)
- RSA-2048+ or ECC-P256+ for asymmetric
- SHA-256 or SHA-3 for hashing
- Argon2id/bcrypt for password hashing
- TLS 1.2+ for transport (1.3 preferred)
- Rotate keys per policy; use a key management service (KMS) — AWS KMS, Azure Key Vault, HashiCorp Vault

## 2.7 Secrets management

- No secrets in source code (use a secrets manager: Vault, AWS Secrets Manager, doppler.com)
- No secrets in environment files committed to git
- Use \`gitleaks\` or similar to scan history for accidentally-committed secrets
- Rotate secrets that have been exposed, even briefly
- Service-to-service auth uses workload identity (IAM roles, service accounts) where possible, not static keys

## 2.8 Error handling and logging

- Catch exceptions but DON'T return them to the client — generic "Internal Server Error" with a correlation ID
- Log the full stack trace SERVER-SIDE with the correlation ID for debugging
- Don't log secrets, PII, full credit card numbers, or session tokens — sanitize before logging
- Log security-relevant events: auth failures, authorization denials, validation failures
- Send logs to a centralized SIEM with tamper-resistant storage

## 2.9 Dependency management

- Track all third-party dependencies (SBOM — Software Bill of Materials)
- Scan for known vulnerabilities continuously (SCA tools — see §3)
- Patch promptly — known CVEs in deps are the most common exploit vector in 2024-25
- Pin versions in lockfiles for reproducible builds
- Verify checksums of downloaded packages where supported

## 2.10 The OWASP Top 10 mapped to coding defenses

| OWASP Top 10 (2021) | Primary defense |
|---|---|
| A01 Broken Access Control | Server-side authorization checks on every action |
| A02 Cryptographic Failures | Use vetted libraries, modern algorithms, manage keys properly |
| A03 Injection (SQLi etc.) | Parameterized queries; allow-list input validation |
| A04 Insecure Design | Threat modeling; secure-by-design principles |
| A05 Security Misconfiguration | Hardening baselines; automated config scans |
| A06 Vulnerable and Outdated Components | SCA tools; rapid patching |
| A07 Identification & Auth Failures | bcrypt/Argon2id, MFA, session hardening |
| A08 Software and Data Integrity Failures | Signed packages, supply-chain controls (SLSA, in-toto), code signing |
| A09 Security Logging & Monitoring Failures | Centralized logging, alerting, SIEM |
| A10 Server-Side Request Forgery | URL allow-lists, block private IP ranges, dedicated egress proxy |`,
      examTip: `For password hashing in 2026, the correct answers are Argon2id (preferred), bcrypt, or scrypt. PBKDF2 with high iteration count is acceptable. NEVER pick MD5, SHA-1, SHA-256 alone, or "encrypt the password" — these are all wrong.`,
      importantNote: `Input validation alone is not enough. You also need output encoding for XSS, parameterized queries for SQLi, etc. Different bug classes need different defenses.`,
    },
    {
      id: 'security-testing-tools',
      title: `3. Security Testing Tools — SAST, DAST, IAST, SCA, Fuzzing, Pen Testing`,
      content: `Each testing tool catches a different class of bug. A mature program uses all of them.

## 3.1 SAST — Static Application Security Testing

Analyzes SOURCE CODE without executing it. Looks for vulnerable patterns: unsafe API calls, SQL string concatenation, hardcoded secrets, missing input validation.

- **When**: pre-commit hook, pull request check, CI build
- **Pros**: catches bugs early; coverage of all code paths; can pinpoint exact line
- **Cons**: false positives common (without runtime context, the analyzer can't always tell if a pattern is actually exploited); doesn't catch logic flaws or runtime-only issues
- **Examples**: SonarQube, Checkmarx, Veracode SAST, Semgrep (open source), CodeQL

## 3.2 DAST — Dynamic Application Security Testing

Tests a RUNNING application from the outside, like an attacker would. Sends crafted requests, observes responses.

- **When**: CI test stage against staging deployment; periodic scans of production
- **Pros**: finds runtime-only bugs (misconfiguration, auth flaws, server-side issues); fewer false positives than SAST
- **Cons**: only finds bugs in code paths the scanner reaches; requires a running deployment; slow
- **Examples**: OWASP ZAP (free), Burp Suite Pro, Acunetix, Veracode DAST

## 3.3 IAST — Interactive Application Security Testing

Combines SAST + DAST. An instrumented agent runs INSIDE the app and observes data flow during dynamic testing.

- **When**: CI test stage with agent attached
- **Pros**: high accuracy (very few false positives), pinpoints exact code line of runtime bugs
- **Cons**: requires agent installation; some performance overhead; language-specific
- **Examples**: Contrast Security, Checkmarx CxIAST

## 3.4 SCA — Software Composition Analysis

Specifically scans DEPENDENCIES for known vulnerabilities (CVEs). Reads package manifests (\`package.json\`, \`requirements.txt\`, \`pom.xml\`), looks up each dep in vulnerability databases (NVD, GitHub Advisory).

- **When**: pre-commit, PR check, CI build, continuous monitoring
- **Output**: list of vulnerable dependencies with CVE IDs, severity, suggested upgrade
- **Examples**: Snyk, Dependabot, Renovate, OWASP Dependency-Check, npm audit, pip-audit

In 2024-25, SCA findings outnumber SAST findings 10:1 — your code probably has few injection bugs but your 500 transitive dependencies have CVEs constantly.

## 3.5 Container image scanning

Containers ship application code + OS layers + dependencies. Each layer can have vulnerabilities.

- Scan images during build (CI)
- Scan registry images periodically (new CVEs are disclosed daily)
- Tools: Trivy (free), Snyk Container, Aqua, Prisma Cloud, AWS ECR scan

## 3.6 Secrets scanning

Detect API keys, passwords, tokens accidentally committed to repos.

- Tools: gitleaks (free), TruffleHog, GitHub Secret Scanning (auto), gitGuardian

## 3.7 IaC scanning

Scan Terraform / CloudFormation / Kubernetes manifests for misconfigurations.

- Tools: Checkov, tfsec, kube-linter, OPA Conftest

## 3.8 Fuzz testing

Sends random or semi-random inputs to find crashes or unexpected behavior. Especially valuable for parsers, file format handlers, protocol implementations.

- Tools: AFL++, libFuzzer, jazzer, OSS-Fuzz (Google runs continuous fuzzing for open source)
- Modern compilers support sanitizers (AddressSanitizer, UBSan, MemorySanitizer) that detect bugs at runtime during fuzzing

## 3.9 Penetration testing

Authorized humans actively attempt to compromise the application. Goes beyond automated scanners by chaining low-severity findings, abusing business logic, demonstrating real impact.

Pen test types:

- **Black box** — tester has no inside info; simulates external attacker
- **Gray box** — tester has limited info (credentials, architecture diagrams)
- **White box (a.k.a. crystal box)** — tester has full source code and design docs

Engagement structure:

1. Scoping + Rules of Engagement
2. Reconnaissance + discovery
3. Vulnerability identification
4. Exploitation (with explicit boundaries)
5. Post-exploitation (lateral movement, privilege escalation)
6. Reporting
7. Remediation verification (often a follow-up engagement)

The exam may name **PTES** (Penetration Testing Execution Standard) and **OSSTMM** (Open Source Security Testing Methodology Manual) as methodology frameworks.

## 3.10 Bug bounty programs

Continuous, crowd-sourced testing. Researchers find bugs and report via a coordinated disclosure platform (HackerOne, Bugcrowd, Intigriti). Triaged, deduplicated, paid based on severity.

- Complements (does not replace) internal testing
- Needs clear scope, ROE, safe-harbor language, and a triage capacity
- Vulnerability Disclosure Programs (VDP) are similar but unpaid — just a "tell us about bugs without legal risk" promise

## 3.11 Combining the tools

A mature pipeline:

1. **Pre-commit**: secrets scan + light SAST
2. **PR**: SAST + SCA + license check + diff-only DAST
3. **CI build**: full SAST + SCA + container image scan + IaC scan
4. **CI test**: DAST + IAST + integration tests with security assertions
5. **Pre-deploy**: policy-as-code gate (e.g., "no known critical CVEs in production")
6. **Post-deploy**: continuous DAST + RASP + vuln scanning
7. **Quarterly / annually**: external penetration test
8. **Always-on**: bug bounty / VDP`,
      examTip: `Decode the tool by what it analyzes: SAST = source code (static), DAST = running app from outside, IAST = running app with internal agent (combines both), SCA = dependencies. The exam loves to ask you to pick the right tool for a given goal.`,
      importantNote: `SAST is famous for false positives. A mature program TUNES the tool over time, marks accepted findings, and focuses on high-confidence true positives. Otherwise developers learn to ignore the noise — which defeats the whole purpose.`,
    },
  ],
  keyTakeaways: [
    'DevSecOps shifts security LEFT in the SDLC — fixing bugs at the IDE costs ~$1, in production ~$10,000',
    'STRIDE is the most commonly tested threat-modeling methodology (Spoofing, Tampering, Repudiation, Info disclosure, DoS, Elevation of privilege)',
    'For passwords use Argon2id (preferred), bcrypt, or scrypt — NEVER MD5/SHA-1/SHA-256',
    'Parameterized queries prevent SQLi; output encoding prevents XSS; allow-list input validation is foundational',
    'SAST = source code; DAST = running app from outside; IAST = combined with internal agent; SCA = dependency CVEs',
    'SCA findings vastly outnumber SAST findings in modern codebases — vulnerable dependencies are the #1 vector',
    'Defense in depth: a mature pipeline runs SAST + SCA + IaC scan + DAST + secrets scan + container scan + annual pen test + always-on bug bounty',
  ],
},

sp_third_party: {
  topicId: 'sp_third_party',
  title: `Third-Party Risk Management`,
  domainWeight: '20%',
  overview: `Modern enterprises are a constellation of third-party services — SaaS apps, IaaS providers, payment processors, identity providers, analytics, support tooling. Each is a potential breach vector (the SolarWinds, MOVEit, Okta, and Snowflake incidents in recent years all came through trusted vendors). SY0-701 objective 5.3 is explicit: you must understand vendor risk assessment, SLAs/MSAs/MOUs, right-to-audit, supply chain security, and the SBOM/SCRM controls that limit blast radius. This topic covers the lifecycle: due diligence before engagement, contractual controls during, monitoring throughout, and offboarding when the relationship ends.`,
  sections: [
    {
      id: 'vendor-due-diligence',
      title: `1. Vendor Risk Assessment & Due Diligence`,
      content: `Before you trust a vendor with data or system access, you need to know what they're doing to protect it.

## 1.1 The vendor risk lifecycle

1. **Identification + tiering** — categorize vendors by risk (volume of data, criticality, regulatory exposure)
2. **Pre-engagement due diligence** — assess controls before signing
3. **Contractual** — write the right protections into the contract
4. **Onboarding** — integrate securely (federation, network controls, monitoring)
5. **Ongoing monitoring** — re-assess at intervals; monitor for incidents
6. **Offboarding** — revoke access, recover data, certify destruction

## 1.2 Vendor tiering

Not every vendor warrants the same scrutiny. Common tiering scheme:

- **Tier 1 (Critical / High)** — vendors processing sensitive data, mission-critical SaaS, or with broad system access. Examples: identity providers (Okta), payment processors (Stripe), core SaaS (Salesforce), cloud IaaS (AWS).
- **Tier 2 (Moderate)** — vendors with some sensitive data access but not critical to operations. Examples: marketing tools with customer email lists, support tools with case data.
- **Tier 3 (Low)** — vendors with no sensitive data and minimal operational impact. Examples: company-branded merchandise vendor, office coffee service.

Tier determines the rigor of due diligence and the frequency of re-assessment (Tier 1 annually, Tier 3 maybe never beyond initial).

## 1.3 Due diligence artifacts

The standard set of evidence you ask a vendor to provide:

- **SOC 2 Type II report** — independent attestation of operating effectiveness of controls over a period (usually 6-12 months). The single most-requested document. Read the report — the "exceptions" section lists controls that DIDN'T operate effectively.
- **SOC 1 Type II** — for financial reporting controls (less relevant unless you rely on the vendor for SOX compliance)
- **ISO 27001 certificate** — certification of an Information Security Management System (ISMS). Indicates the vendor has a documented, audited program.
- **ISO 27017 / 27018** — cloud-specific extensions covering cloud controls and personal data in the cloud
- **PCI-DSS Attestation of Compliance (AOC)** — for vendors handling payment card data
- **HITRUST CSF certification** — common in healthcare
- **FedRAMP authorization** — for cloud services serving US federal government
- **Penetration test summary** — recent (within 12 months) external pen test results
- **Security policy summaries** — incident response, business continuity, encryption, access management

## 1.4 The vendor security questionnaire

Standardized questionnaires let you compare vendors on the same scale:

- **SIG (Standardized Information Gathering)** — Shared Assessments' questionnaire, very comprehensive
- **CAIQ (Consensus Assessments Initiative Questionnaire)** — Cloud Security Alliance's questionnaire for cloud providers
- **CIS RAM** — risk-assessment-focused questionnaire
- Industry-specific: HECVAT for higher ed, MQS for some sectors

Common questions: architecture overview, encryption (at rest, in transit, key management), access controls, vulnerability management cadence, incident response, business continuity, sub-processors (who do THEY use?), data location, data retention/destruction, breach notification timeline.

Don't accept "we have it" answers — ask for evidence.

## 1.5 Inherited risk and sub-processors

The vendor's vendors are YOUR vendors too. SolarWinds compromised customers via a single vendor's compromised build pipeline. Snowflake customers were breached via stolen credentials in a downstream processor.

Due diligence questions:

- Who are your sub-processors / third parties for X?
- How do you assess their security?
- What contractual right do we have to be notified of changes?
- What's your supply chain risk management (SCRM) program?

For Tier 1 vendors, list their critical sub-processors in your own vendor inventory and treat them as adjacent risk.

## 1.6 Financial + operational viability

Security isn't the only third-party risk. Also assess:

- **Financial health** — is the vendor likely to go out of business?
- **Geographic concentration** — single data center? Single region? Single country?
- **Concentration risk** — would loss of this vendor be catastrophic, with no realistic backup?
- **Insurance** — does the vendor carry cyber liability insurance? At what limits?

A great-security vendor that goes bankrupt is still a problem.

## 1.7 Recurring re-assessment

Tier 1 vendors: annual re-assessment with full questionnaire + updated SOC 2 + updated pen test.
Tier 2: every 18-24 months.
Tier 3: ad hoc.

Always re-assess when:
- The vendor has a publicly-disclosed incident
- Your usage materially expands (more data, more critical workflows)
- The vendor changes ownership / merges
- Regulations change`,
      examTip: `SOC 2 Type II is the most-tested third-party assurance artifact. Type I is "controls are designed correctly" at a point in time. Type II is "controls operated effectively" over a period. Type II is what you want.`,
    },
    {
      id: 'contractual-controls',
      title: `2. Contractual Controls — MSA, SLA, MOU, NDA, DPA, BAA`,
      content: `Contracts are how you ENFORCE security expectations. The exam tests your knowledge of the standard contract types and what each does.

## 2.1 The hierarchy

For a typical SaaS relationship, you'll likely have multiple agreements:

1. **MSA (Master Services Agreement)** — the umbrella commercial contract: pricing, payment terms, IP ownership, liability, governing law, dispute resolution. Long-lived; signed once and amended as needed.
2. **SOW (Statement of Work)** — under the MSA, the specifics of a particular engagement: scope, deliverables, timeline, fees for THIS work.
3. **SLA (Service Level Agreement)** — measurable commitments: uptime, response times, performance, with credits/penalties for breaches.
4. **DPA (Data Processing Agreement)** — GDPR-required when the vendor processes personal data on your behalf. Defines processor/controller roles, security obligations, sub-processor management, data subject rights handling.
5. **BAA (Business Associate Agreement)** — HIPAA-required when the vendor handles PHI. Imposes specific obligations including breach notification timelines.
6. **NDA (Non-Disclosure Agreement)** — confidentiality of information shared. Can be one-way or mutual.

## 2.2 MOU vs MOA

- **MOU (Memorandum of Understanding)** — non-binding statement of intent. "We intend to collaborate on X." Used between organizations exploring a relationship without yet committing.
- **MOA (Memorandum of Agreement)** — more formal than MOU but typically less than a full contract. Defines roles and responsibilities for a joint effort.

Neither is enforceable like a contract; both are common in government and academia.

## 2.3 SLA components

A good SLA defines:

- **Metrics** — what will be measured (uptime %, response time for critical issues, RTO/RPO)
- **Targets** — specific values (99.9% uptime monthly, P1 response within 1 hour)
- **Measurement methodology** — how is the metric calculated? Who collects the data?
- **Reporting cadence** — when do you receive SLA reports?
- **Penalties** — service credits or other remedies for missed SLAs
- **Exclusions** — what doesn't count (planned maintenance windows, force majeure)

99.9% uptime sounds high but allows ~43 minutes/month of downtime. 99.99% = ~4 minutes/month. 99.999% ("five nines") = ~26 seconds/month. Know the math.

## 2.4 Critical security clauses for any vendor contract

The exam may not name these by clause, but knowing they exist is important:

- **Data ownership** — the customer owns customer data. Vendor has license only as needed to provide the service.
- **Data location restrictions** — where data may be stored and processed (often required for GDPR, sovereign clouds)
- **Encryption requirements** — at rest, in transit, key management responsibilities
- **Right to audit** — customer (or their auditor) can audit vendor controls. May be triggered by specific events (incident) or periodic. Vendors prefer SOC 2 in lieu of customer audits — usually fine for Tier 2 but Tier 1 should retain audit rights.
- **Breach notification** — vendor must notify customer of suspected breach within a defined window (24-72 hours typical; 24 hours for GDPR, 60 days for HIPAA, but DPA/BAA pin specifics)
- **Sub-processor approval** — customer's right to approve (or at least be notified of) sub-processors
- **Data return + destruction at termination** — vendor returns all customer data and certifies destruction within a defined timeframe
- **Indemnification** — who pays for what if things go wrong
- **Insurance** — minimum cyber liability and E&O coverage
- **Compliance with applicable laws** — vendor warrants compliance with relevant regulations
- **Background checks** — for vendor personnel with access to sensitive data
- **Survival** — which clauses survive termination (confidentiality, indemnification, data destruction)

## 2.5 Specific regulatory contracts

| Regulation | Required Contract | Key Provisions |
|---|---|---|
| GDPR | DPA (Data Processing Agreement) | Processor obligations, sub-processor management, data subject request handling, 72-hour breach notice to controller |
| HIPAA | BAA (Business Associate Agreement) | HIPAA security/privacy compliance, 60-day breach notification, restrictions on use/disclosure of PHI |
| PCI-DSS | Service provider agreement | Vendor in PCI scope, compliance attestation, responsibilities matrix |
| SOX | Often built into MSA | Controls relevant to financial reporting, SOC 1 access |
| GLBA | Specific provisions in MSA | Safeguards for nonpublic personal information |

## 2.6 Liability + indemnification

Most vendor contracts cap the vendor's total liability — often at 12 months of fees paid. That's a serious risk: a breach that costs you $50M may give you a $500K recovery from the vendor.

What to negotiate:
- **Carve-outs from the cap** — data breach, IP infringement, gross negligence, willful misconduct should be EXCLUDED from the cap
- **Higher caps** for Tier 1 vendors
- **Indemnification** for third-party claims arising from vendor's breach
- **Insurance proof** — minimum cyber liability per occurrence and aggregate

## 2.7 Termination provisions

- **Termination for convenience** — customer's right to walk away (with notice)
- **Termination for cause** — material breach, insolvency, change of control
- **Data return** — format, timeline, certification of destruction
- **Transition assistance** — vendor's obligation to help migrate to a successor

Vendor lock-in is a non-trivial third-party risk. Negotiate transition assistance + data portability up front; once you're locked in, your leverage is minimal.`,
      examTip: `Match the contract to the relationship: MSA = umbrella commercial, SLA = measurable service commitments, DPA = GDPR processor agreement, BAA = HIPAA processor agreement, NDA = confidentiality, MOU/MOA = non-binding intent.`,
    },
    {
      id: 'supply-chain-security',
      title: `3. Supply Chain Security, SBOM, and Ongoing Monitoring`,
      content: `The software supply chain is now the most-attacked surface in technology. Defenses here are immature relative to the threat.

## 3.1 Recent supply chain incidents

Patterns the exam may reference:

- **SolarWinds (2020)** — attacker compromised the build pipeline of network-monitoring software, injecting malicious code into legitimate updates signed with valid certificates. ~18,000 customers downloaded the trojanized update; ~100 were exploited in the next stage.
- **Codecov (2021)** — bash uploader script modified to exfiltrate environment variables (secrets) from victim CI builds.
- **Log4j / Log4Shell (2021)** — critical RCE in a ubiquitous Java logging library. Every enterprise scrambled to find where Log4j was used (often deep in transitive deps).
- **3CX (2023)** — supply chain compromise of a desktop softphone client, cascaded from a different supply chain compromise (Trading Technologies).
- **MOVEit (2023)** — zero-day in a file-transfer product exploited by Cl0p; thousands of organizations whose vendors used MOVEit had data stolen.

The lesson: even with strong internal security, your software dependencies can be the breach.

## 3.2 SBOM (Software Bill of Materials)

A formal inventory of all components in a software product — direct dependencies, transitive dependencies, versions, licenses, source URLs.

Formats:
- **SPDX (Software Package Data Exchange)** — open standard, often XML or JSON
- **CycloneDX** — OWASP-stewarded, often JSON
- **SWID (Software Identification)** — ISO standard, used for vulnerability matching

What an SBOM enables:

- When a new CVE drops, you can answer "are we affected?" in minutes by searching SBOMs for the vulnerable component
- Vendor SBOMs let you assess YOUR exposure to THEIR dependencies
- Regulatory direction: US Executive Order 14028 requires SBOMs for software sold to the federal government
- Tools: Syft (generates SBOMs), Grype (queries SBOMs for vulnerabilities), Dependency-Track (SBOM management)

## 3.3 Code signing + provenance

Cryptographic guarantees that software came from the claimed publisher and wasn't tampered with in transit.

- Vendors sign releases with their private key
- Customers verify with the published public key
- Modern extensions: SLSA (Supply-chain Levels for Software Artifacts) provides graded levels of build provenance assurance; in-toto provides supply chain attestation
- Sigstore (free, Linux Foundation) provides keyless signing using OIDC identity + transparency log

## 3.4 Reproducible builds

If the build of a given source produces a bit-identical artifact across machines, you can verify that a published binary was built from the published source. Defends against compromised build pipelines (which is how SolarWinds and 3CX both happened).

Hard to achieve in practice — requires careful management of timestamps, build paths, dependencies. Active research project (reproducible-builds.org).

## 3.5 Hardware supply chain

Less covered on the exam but worth knowing:

- **Counterfeit components** — fake parts that fail in service or contain hidden functionality
- **Hardware implants** — modifications during manufacturing or transit (the alleged "Big Hack" reporting around Supermicro)
- **Firmware tampering** — modified BIOS/UEFI, network device firmware
- Defenses: trusted suppliers, certified components, hardware integrity monitoring, secure boot chains (UEFI Secure Boot, AMD PSP, Intel BootGuard), TPM-anchored measurements

## 3.6 Ongoing monitoring

Vendor risk doesn't stop at the contract. Continuous monitoring:

- **Vendor security ratings** — services (BitSight, SecurityScorecard, Black Kit) scan public-facing posture of vendors and produce a rating. Alerts on degradation, expired certificates, vulnerable services exposed.
- **Threat intel feeds** — subscribe to feeds of disclosed vendor incidents, breach notifications
- **News + alert monitoring** — track major-vendor news (set up news alerts for Tier 1 vendor names)
- **Vendor incident notifications** — track vendors' status pages, security advisory feeds, RSS

## 3.7 The vendor risk register

Maintain a single source of truth listing every vendor, their tier, the data/systems they access, contract dates, last review date, current findings, and risk ratings. Tools: ServiceNow GRC, Archer, Diligent, or a well-maintained spreadsheet.

The register feeds:
- Re-assessment scheduling
- Incident response (when a vendor has an incident, you instantly know your exposure)
- Compliance reporting (auditors will ask)
- Strategic decisions (concentration risk, sunset planning)

## 3.8 Offboarding

When a vendor relationship ends:

- Revoke ALL access (federated identity, API keys, mTLS certs, VPN access, badges)
- Recover all customer data per contract
- Get certification of data destruction (per contract timeline)
- Update the CMDB / asset inventory
- Notify affected internal teams
- Document the decommissioning in the vendor risk register

Failed offboarding is a frequent breach root cause — a contractor's access stayed enabled, became orphaned, was eventually compromised, and the original organization had no record of who was responsible.`,
      examTip: `SBOM is increasingly tested. Know that it's an INVENTORY of software components (not a vulnerability scan), in formats like SPDX or CycloneDX, used to answer "are we affected by CVE-X?" in minutes.`,
      importantNote: `The vendor's vendors are your vendors too. Tier 1 due diligence asks about SUB-PROCESSORS and how the vendor assesses them. SolarWinds-class compromise can cascade through multiple supply-chain hops.`,
    },
  ],
  keyTakeaways: [
    'Tier vendors by risk; rigor of due diligence and re-assessment frequency follow the tier',
    'SOC 2 Type II = controls operating effectively over a PERIOD (vs Type I = designed correctly at a point in time)',
    'Match the contract: MSA (umbrella), SLA (service commitments), DPA (GDPR), BAA (HIPAA), NDA (confidentiality)',
    'Right-to-audit, breach notification windows, sub-processor approval, data destruction at termination — non-negotiable for Tier 1',
    'SBOM lists all software components in a product (SPDX or CycloneDX); enables rapid "are we affected by this CVE?" lookups',
    'Code signing + build provenance (SLSA, sigstore) defend against compromised build pipelines (the SolarWinds attack class)',
    'Failed offboarding is a frequent breach vector — revoke all access, recover data, certify destruction, update inventory',
  ],
},

sp_audit: {
  topicId: 'sp_audit',
  title: `Audits, Assessments & Compliance Validation`,
  domainWeight: '20%',
  overview: `Audits are the mechanism by which security claims become verifiable. SY0-701 objective 5.5 expects you to distinguish audit types (internal vs external, compliance vs operational), name common certification frameworks (SOC 1/2, ISO 27001, PCI-DSS QSA assessment, HIPAA OCR investigation), and understand the lifecycle from planning through remediation. This is distinct from vulnerability assessment (which finds technical bugs) — audits validate whether your CONTROLS are designed and operating as policy claims.`,
  sections: [
    {
      id: 'audit-types',
      title: `1. Audit Types and When Each Is Used`,
      content: `## 1.1 Internal audit

Performed by the organization's own audit function — typically a team reporting to the audit committee of the board (not to the CIO/CISO, which would create independence issues).

- **Scope**: any process, control, or system the audit charter covers
- **Frequency**: per the annual internal audit plan; high-risk areas more often
- **Output**: report to management + audit committee with findings, recommendations, management responses
- **Independence**: from operational management but not from the organization itself
- **Standard**: IIA (Institute of Internal Auditors) standards

Internal audit is the FIRST LINE of formal assurance — catches issues before external auditors do.

## 1.2 External audit

Performed by an independent third party. Typically a CPA firm for financial/compliance audits, a security firm for technical audits.

- **Scope**: defined by the engagement letter
- **Output**: independent attestation, often required by regulators, customers, or boards
- **Independence**: independent of the organization
- **Trust**: external auditors carry professional liability and reputational risk for incorrect conclusions

Common external audits:

- **Financial statement audit** (annual) — required for public companies (SOX), often required for private companies with debt covenants
- **SOC 1 / SOC 2** — service organization control reports
- **ISO 27001 certification audit** — by an accredited certification body
- **PCI-DSS Report on Compliance (ROC)** — by a Qualified Security Assessor (QSA) for Level 1 merchants
- **HITRUST CSF assessment** — by an authorized assessor
- **FedRAMP** — by a 3PAO (Third Party Assessment Organization)

## 1.3 Compliance audit

Validates conformance to a specific regulation or framework.

- **HIPAA**: OCR (Office for Civil Rights) audits randomly + after breach reports. Looks at compliance with HIPAA Security and Privacy Rules.
- **PCI-DSS**: annual ROC (Report on Compliance) for Level 1 merchants; quarterly ASV scans for vulnerability validation.
- **GDPR**: data protection authorities can audit at will, often triggered by complaints or breach notifications.
- **SOX**: external audit of internal controls over financial reporting (ICFR), required annually for public companies.
- **FISMA / FedRAMP**: annual assessment of federal information systems.

## 1.4 Operational audit

Examines efficiency and effectiveness of operations — broader than compliance.

- Are processes working as intended?
- Are resources used efficiently?
- Are controls adequate for the risks?
- Are policies followed?

Less standardized than compliance audits, often internal.

## 1.5 IT general controls (ITGC) audit

A specific category looking at the controls that EVERY system relies on:

- Logical access (who can access what, periodic access reviews)
- Change management (changes follow process)
- Backup + recovery (regular, tested)
- Computer operations (job scheduling, monitoring)
- Physical + environmental controls

ITGCs underpin application controls — auditors test ITGCs first, then test application-specific controls in systems that depend on the ITGCs.

## 1.6 Attestation engagements

Under AICPA standards (SSAE 18), an attestation is a formal opinion by an auditor on subject matter. SOC reports are attestation engagements.

Two types of opinion:

- **Type I** — the auditor opines on whether the controls were DESIGNED appropriately at a point in time
- **Type II** — opines on whether the controls were DESIGNED AND OPERATING EFFECTIVELY over a period (usually 6-12 months)

Type II is the gold standard — anyone can have well-designed controls on paper; Type II proves they actually ran.

## 1.7 Certification vs attestation

Subtle but exam-relevant:

- **Attestation** (SOC 2): an auditor opines that controls met criteria. No certificate; a report.
- **Certification** (ISO 27001): a certification body certifies conformance. There IS a certificate.

The difference matters for vendor management — you might receive a SOC 2 report (review the actual findings) OR an ISO 27001 certificate (verify it's current, by an accredited body).`,
      examTip: `SOC 2 Type I = design only, point in time. Type II = operating effectiveness over a period. Type II is what you want for vendor due diligence.`,
    },
    {
      id: 'audit-frameworks',
      title: `2. Common Frameworks and Their Audits`,
      content: `## 2.1 SOC reports (SSAE 18 / ISAE 3402)

SOC stands for "System and Organization Controls." Three flavors:

- **SOC 1** — focuses on controls relevant to user organizations' FINANCIAL REPORTING. Used when your vendor's controls affect your SOX compliance (e.g., payroll processor).
- **SOC 2** — focuses on controls relevant to the Trust Services Criteria (TSC):
    - Security (mandatory)
    - Availability
    - Processing Integrity
    - Confidentiality
    - Privacy
  - Vendors choose which TSCs to include based on their service.
- **SOC 3** — a public-facing summary of a SOC 2, suitable for marketing. Much less detail.

When you ask a SaaS vendor for "their SOC 2," ask specifically for the SOC 2 TYPE II report (not Type I, not SOC 3). Read the report — pay attention to:

- Which TSCs are in scope (was Privacy assessed?)
- The audit period (recent? at least 6 months?)
- The sub-service organizations (carved out — the vendor's own vendors not in scope of THIS report)
- The "Description of the System" section
- THE EXCEPTIONS — controls that didn't operate effectively. Critical reading.

## 2.2 ISO 27001 + 27002

- **ISO/IEC 27001** — specification for an Information Security Management System (ISMS). Auditable, certifiable.
- **ISO/IEC 27002** — code of practice for information security controls. Not certifiable directly; provides the implementation guidance for the 27001 Annex A controls.

Certification process:

1. Implement the ISMS (define scope, policies, risk assessment, controls)
2. Internal audit
3. Management review
4. Stage 1 external audit (documentation review)
5. Stage 2 external audit (operational verification)
6. Certification granted (3-year cycle with annual surveillance audits)

Related: ISO 27017 (cloud-specific), ISO 27018 (personal data in the cloud), ISO 27701 (privacy extension), ISO 27005 (risk management).

## 2.3 PCI-DSS validation

Validation method depends on merchant level (transaction volume):

- **Level 1** (>6M Visa+MC txns/yr): annual Report on Compliance (ROC) by a Qualified Security Assessor (QSA), quarterly ASV scans
- **Level 2** (1-6M): annual Self-Assessment Questionnaire (SAQ) + ASV scans (some require ROC)
- **Level 3** (20K-1M e-commerce): SAQ + ASV scans
- **Level 4** (<20K e-commerce or <1M total): SAQ + ASV scans

ASV = Approved Scanning Vendor — external company that runs vulnerability scans on cardholder data environment from outside.

PCI-DSS v4.0 (current as of 2024) added a "customized approach" allowing alternative implementations validated to meet the same objective — moving toward outcome-based rather than prescriptive.

## 2.4 HIPAA enforcement

OCR (Office for Civil Rights) is the enforcement arm. Triggers for audit/investigation:

- **Breach reports** — breaches affecting >500 individuals trigger OCR investigation
- **Complaints** — individuals can complain about HIPAA violations
- **Random audits** — OCR audit program (currently focused but historically random)

Penalties (per violation, tiered by culpability):

- Did not know: $137-$68K
- Reasonable cause: $1,379-$68K
- Willful neglect (corrected): $13,785-$68K
- Willful neglect (not corrected): $68,928 minimum
- Annual cap: $2,067,813 per violation type

(Numbers are HHS's 2024 adjusted figures, change with inflation.)

## 2.5 GDPR supervisory authority audits

Each EU member state has a Data Protection Authority (DPA) with audit powers. Triggers:

- Complaint from a data subject
- Breach notification
- Sectoral investigation
- Cross-border investigations coordinated through the EDPB (European Data Protection Board)

Penalties:

- Up to €10M or 2% of global annual turnover (whichever higher) for lesser infringements
- Up to €20M or 4% of global annual turnover for serious infringements
- Article 30 (records of processing), Article 32 (security), Article 33-34 (breach notification) are heavily enforced

## 2.6 FedRAMP

Federal Risk and Authorization Management Program — single security framework for cloud services used by US federal agencies.

- Three impact levels: Low, Moderate, High (based on FIPS 199 categorization)
- Authorization by an agency (P-ATO from the JAB or ATO from individual agency)
- Annual assessment by a 3PAO (Third Party Assessment Organization)
- StateRAMP, TX-RAMP, etc. are state-level analogues

## 2.7 NIST frameworks (commonly assessed against)

NIST itself doesn't certify, but third parties assess against its frameworks:

- **NIST CSF (Cybersecurity Framework)** — 2.0 released 2024. Six functions: Govern (NEW), Identify, Protect, Detect, Respond, Recover.
- **NIST 800-53** — comprehensive controls catalog used in federal systems and as the basis for FedRAMP
- **NIST 800-171** — for federal contractors handling CUI (Controlled Unclassified Information). Self-assessed; CMMC adds third-party assessment.
- **CMMC (Cybersecurity Maturity Model Certification)** — DoD contractor certification, 3 levels, third-party assessed for Level 2+, will be required for DoD contracts going forward.

## 2.8 Industry-specific certifications

- **HITRUST CSF** — healthcare; combines HIPAA, ISO, PCI, NIST. Validated assessment (i1) or certified (r2) levels.
- **SOC 2 + HIPAA combined** — common bundled assessment
- **ISO 13485** — medical device quality (not infosec but related)
- **NERC CIP** — utilities (electric grid)
- **FIPS 140-3** — cryptographic modules`,
      examTip: `SOC 2 is for vendors. PCI-DSS is for payment cards. HIPAA is for healthcare. ISO 27001 is general-purpose ISMS certification. Know the mapping cold.`,
    },
    {
      id: 'audit-lifecycle',
      title: `3. The Audit Lifecycle: Planning, Fieldwork, Reporting, Remediation`,
      content: `Whether internal or external, audits follow a similar arc. Knowing each stage helps you plan, cooperate, and respond.

## 3.1 Planning

- **Scope definition** — which systems, processes, controls, time period
- **Risk-based selection** — which controls warrant more testing based on risk
- **Sampling methodology** — how many transactions, how chosen (random, judgmental, statistical)
- **Resource scheduling** — auditors, system owners, evidence custodians
- **Pre-audit walkthrough** — auditors interview process owners to understand the design

The "audit charter" or "engagement letter" formalizes scope, timeline, and access.

## 3.2 Fieldwork

The hands-on testing phase. Auditors collect evidence and test controls. Common techniques:

- **Inquiry** — interview process owners ("how does this work?")
- **Observation** — watch processes execute (auditor sits with operator)
- **Inspection** — examine documents, configurations, evidence ("show me the change ticket for this push")
- **Re-performance** — auditor reproduces the control to verify it works ("run the access review report yourself")

Evidence quality matters:

- **Direct + independent** (auditor's own observation, system-generated reports the auditee can't manipulate) — highest
- **Documentary** (signed approval, dated ticket) — strong
- **Verbal** (interview testimony) — weakest, used for context

## 3.3 Sampling

Auditors can't test every transaction; they sample.

- **Random sampling** — every item has equal probability
- **Stratified sampling** — divide population, sample from each stratum (e.g., test more high-dollar transactions)
- **Judgmental sampling** — auditor picks based on judgment (high-risk transactions, anomalies)
- **Statistical sampling** — sample size determined by formulas for desired confidence level

Sample sizes typically 25-60 items per control test, depending on risk.

## 3.4 Findings classification

Auditors classify findings by severity:

- **Significant deficiency** — control weakness less severe than material weakness, but still warranting attention
- **Material weakness** — reasonable possibility that a material misstatement / breach won't be prevented or detected
- **Control deficiency** — control was missing or didn't operate as designed
- **Observation / opportunity for improvement** — not a deficiency but suggested enhancement

For SOC 2: "exception" is the term used in the report when a control test failed.

## 3.5 Management response

For each finding, management provides:

- **Response** — agree / disagree (with rationale)
- **Remediation plan** — what will be done
- **Owner** — who is responsible
- **Target date** — when will remediation complete

A finding without a remediation plan + owner + date is incomplete.

## 3.6 Reporting

Final audit report includes:

- Executive summary
- Scope + methodology
- Findings + management responses
- Auditor's overall opinion (for attestation engagements)
- Distribution list (often limited — many SOC 2 reports go only to direct customers under NDA)

For SOC 2:

- **Unqualified opinion** — controls operate as described, no exceptions material
- **Qualified opinion** — most controls work but one or more areas have material exceptions
- **Adverse opinion** — controls don't operate as described (very rare; usually the org wouldn't publish such a report)
- **Disclaimer** — auditor unable to obtain sufficient evidence to form an opinion

## 3.7 Remediation tracking

After the report, remediation work begins. Mature programs track every finding to closure:

- Centralized issue tracker (Jira, GRC tool)
- Periodic status reviews
- Evidence collection as remediations complete
- Re-test by auditors (often as part of next audit cycle)
- Closure documented

## 3.8 Continuous controls monitoring

A mature alternative to point-in-time audits: automated continuous monitoring of control operating effectiveness, with auditors sampling from the automated evidence.

- Configuration baselines monitored automatically
- Access reviews triggered by user lifecycle events
- Change approvals enforced by tooling
- Logs sent to immutable storage

This is the direction the industry is heading; SOC 2 auditors increasingly accept automated evidence in lieu of manual sampling.

## 3.9 Common pitfalls during an audit

- **Defensive responses** — fighting findings rather than understanding them; auditors will dig deeper
- **Inability to produce evidence** — control may have worked but if you can't show it, the auditor concludes it didn't
- **Stale documentation** — policy says X, system does Y, neither matches what people actually do
- **Walking back commitments** — saying you'll do something in your management response then not doing it; auditors notice in the next cycle

## 3.10 The audit committee

For public companies and many private organizations, an audit committee of the board provides oversight independent of management. Audit committee responsibilities:

- Approves the annual internal audit plan
- Reviews external audit results
- Holds management accountable for remediation
- Has authority to hire/fire the external auditor
- Provides a "speak up" channel independent of management

For security: the audit committee often receives cybersecurity briefings, particularly post-breach or for major program changes.`,
      examTip: `Know the steps: Planning → Fieldwork (inquiry, observation, inspection, re-performance) → Reporting → Remediation. SOC 2 specifically: unqualified > qualified > adverse > disclaimer (best to worst opinion).`,
    },
  ],
  keyTakeaways: [
    'Internal audit reports to the audit committee (independent of operational management); external audit is fully independent',
    'SOC 2 Type II is the most-tested vendor assurance artifact — covers operating effectiveness over a 6-12 month period',
    'ISO 27001 = ISMS certification (3-year cycle with annual surveillance). PCI-DSS Level 1 = annual ROC by a QSA + quarterly ASV scans',
    'HIPAA OCR audits triggered by breaches >500 individuals or complaints; penalties up to ~$2M/year per violation type',
    'GDPR DPA audits triggered by complaints or breach notifications; penalties up to €20M or 4% of global turnover',
    'FedRAMP for cloud services to US federal government; three impact levels (Low/Moderate/High) assessed by 3PAOs',
    'Audit findings classified: significant deficiency, material weakness, control deficiency, observation. Every finding needs owner + remediation plan + date.',
  ],
},

sp_awareness: {
  topicId: 'sp_awareness',
  title: `Security Awareness & Training Programs`,
  domainWeight: '20%',
  overview: `The most-exploited vulnerability in 2025 is still the human being. Phishing remains the #1 initial access vector; credential reuse, oversharing of sensitive info, and procedural shortcuts cause more breaches than zero-days. SY0-701 objective 5.6 requires you to know how to BUILD effective awareness programs, not just deliver training. This topic covers program design, role-based curriculum, phishing simulation, measurement, and the deeper goal of building security culture.`,
  sections: [
    {
      id: 'awareness-program-design',
      title: `1. Designing an Awareness Program`,
      content: `## 1.1 Why "annual mandatory training" is not enough

A 30-minute click-through compliance video that everyone takes once a year doesn't change behavior. People forget within weeks. The decision they make in the moment — clicking the link, sharing the password, plugging in the USB — is what matters.

An effective awareness program is:

- **Continuous** — multiple touchpoints across the year (not once-and-done)
- **Targeted** — different content for different audiences
- **Engaging** — interactive, story-based, relevant to the audience
- **Measured** — leading indicators (training completion) AND lagging indicators (incidents caused by user error)
- **Reinforced** — short reminders close in time to relevant events
- **Tied to consequences** — celebrated when done well, addressed when not

## 1.2 Audience segmentation

Different audiences need different content:

- **All staff** — foundational topics: phishing recognition, password hygiene, MFA, reporting suspicious activity, acceptable use, data classification basics
- **Executives + high-value targets** — additional content on whaling, business email compromise (BEC), CEO fraud, deepfake voice/video, executive impersonation, travel security, social media OPSEC
- **Engineers / developers** — secure coding, sensitive data handling, secrets management, OWASP Top 10, threat modeling basics, secure SDLC
- **Customer service / sales** — social engineering tactics, customer data protection, NDAs, ethics
- **Finance / AP / payroll** — invoice fraud, BEC patterns, wire fraud, dual authorization requirements
- **HR** — PII handling, background check protocols, termination access removal
- **System administrators** — privileged access risks, password vault use, change management discipline
- **New hires** — onboarding-focused with first-30-day fundamentals
- **Contractors / temporary** — abbreviated but mandatory; often have less context

## 1.3 Delivery channels

Mix media to fit how people learn:

- **Computer-based training (CBT) modules** — for compliance baseline (15-30 min)
- **Short videos** (3-5 min) on specific topics
- **Live workshops or webinars** for high-impact topics
- **Microlearning** (1-2 minute bursts) — frequent, easy to consume
- **Posters + screen savers** — passive reinforcement
- **Newsletters** — monthly digest of relevant news + tips
- **Lunch-and-learns** — informal, voluntary
- **Capture-the-flag (CTF)** events — gamified hands-on
- **Simulated phishing** — see §2
- **Just-in-time training** — triggered by an event (a user clicked a sim → instant micro-training)

## 1.4 Topic cadence — a sample annual plan

A mature program might cover:

| Month | Focus |
|---|---|
| Jan | New year reset — password hygiene + MFA |
| Feb | Phishing recognition |
| Mar | Privacy + data handling |
| Apr | Insider threats |
| May | Mobile + travel security |
| Jun | Social engineering (vishing, smishing) |
| Jul | Working safely from home / public Wi-Fi |
| Aug | Physical security + tailgating |
| Sep | Incident reporting — "what to do if..." |
| Oct | National Cybersecurity Awareness Month — themed events |
| Nov | Holiday season threats (charity scams, package delivery phishing) |
| Dec | End-of-year wrap; refresher of full year |

Plus simulated phishing year-round and just-in-time micro-content when triggered.

## 1.5 Mandatory vs voluntary

The baseline (compliance-required content) is mandatory — completion tracked, escalated for missed deadlines, often blocking access if overdue.

Enrichment content (workshops, CTFs, deep dives) is voluntary. Voluntary programs work better when they're high-quality and rewarded (recognition, swag, leaderboards, career development).

## 1.6 Program governance

- **Owner** — typically the CISO or security awareness lead, with executive sponsorship
- **Content review** — content is updated annually (or as threats evolve) and reviewed for accuracy
- **Vendor selection** — most orgs use a commercial platform (KnowBe4, Proofpoint Security Awareness, Curricula, Living Security, etc.) for content + delivery; some build in-house
- **Compliance mapping** — content mapped to specific regulatory requirements (HIPAA, PCI-DSS, SOX, state laws)
- **Budget** — typical large-org budget is $5-25/user/year for the platform plus events`,
      examTip: `For the exam: "annual training only" is the WRONG answer. The right answer involves continuous, role-based, measured programs with simulated phishing and just-in-time reinforcement.`,
    },
    {
      id: 'phishing-simulation',
      title: `2. Phishing Simulation and Behavioral Measurement`,
      content: `## 2.1 The simulated phishing program

Periodic, organization-wide test emails designed to look like real phishing. Users who click are directed to a teachable moment (landing page explaining what they clicked and what to look for next time) and recorded for measurement.

Mature programs run continuously, escalating sophistication and tailoring to user behavior over time.

## 2.2 Sim design

Effective campaigns include:

- **Multiple difficulty levels** — easy (clear lures with obvious red flags) to hard (target-specific, credible)
- **Topical variety** — package delivery, IT password reset, HR document, vendor invoice, brand spoof (Microsoft, Google, Adobe)
- **Different vectors** — email (most common), SMS (smishing), voice (vishing), QR codes (quishing)
- **Targeted segments** — spear phishing of finance, whaling of executives
- **Seasonal relevance** — tax-time scams in spring, holiday-shipping in November

## 2.3 What to measure

- **Click-through rate** — % who clicked the link (the headline number, but oversimplified)
- **Credential entry rate** — % who actually submitted credentials on the fake login page (higher-fidelity signal)
- **Attachment open rate** — for sim campaigns testing macro execution
- **Reporting rate** — % who reported the sim using the "Report Phishing" button (the GOOD metric)
- **Repeat clicker rate** — % who click in multiple campaigns (the at-risk population)
- **Time-to-report** — how fast the first user reports the sim
- **Mean time from delivery to first report** — measures detection speed

Critical: TRACK BOTH click rate AND reporting rate. A 5% click rate is bad in isolation, but with a 60% reporting rate the org is actually well-defended (real attacks would be caught and reported quickly).

## 2.4 What good looks like

Industry benchmarks (rough):

- Baseline click rate (no training): 25-40%
- After 12 months of mature program: 5-10%
- Reporting rate: at least 20% (mature programs reach 40-60%)
- Repeat clickers: <5%

Aim to drive click rates down AND reporting rates up simultaneously. Don't optimize click rate alone — users get smarter at distinguishing sims from real attacks, which is not the goal.

## 2.5 Handling clickers

Punitive responses backfire — they discourage reporting (people who think they'll be punished hide their mistakes).

Better approach:

- **First click**: instant micro-training, no other consequence
- **Repeated clicks**: additional training, conversation with manager
- **Persistent high-risk behavior**: additional controls (mandatory longer training, removal of certain privileges, more frequent re-testing)
- **Always**: focus on systemic improvement (was the lure unfairly hard? Did training not cover this pattern?)

## 2.6 The reporting culture

Make reporting suspicious activity:

- **Easy** — one-click "Report Phishing" button in email client (Outlook, Gmail add-in)
- **Recognized** — thank-you messages for reports, public recognition for first reporters of sophisticated lures
- **Acted on** — visible feedback that reports led to blocking/quarantine, not just a black hole

If reporting feels useless, people stop doing it.

## 2.7 Just-in-time training

Trigger micro-training based on observed behavior:

- User clicks a sim → instant landing page with the specific lessons for that lure type
- User reports a real phishing → "thank you" with tip on what made it suspicious
- User receives a high-risk action (password reset request) → embedded reminder of verification steps
- New employee → first-30-days curriculum delivered weekly

The closer the training is to the moment of decision, the better it sticks.

## 2.8 Phishing-resistant authentication

A complementary control to training: deploy phishing-RESISTANT authentication (FIDO2/WebAuthn, hardware tokens, passkeys). Even if a user is fooled into clicking a phishing link, they cannot give the attacker credentials that work elsewhere.

This is the long-term solution. Training reduces click rate; phishing-resistant auth makes clicks consequence-free.`,
      examTip: `When the exam describes a metric to measure phishing-program effectiveness, the BEST answer is usually NOT click rate alone — it's a combination including REPORTING RATE.`,
      importantNote: `Punitive responses to phishing-sim clicks make the program WORSE because they suppress reporting of real attacks. Coaching + training + improved systems beat punishment.`,
    },
    {
      id: 'role-based-and-culture',
      title: `3. Role-Based Training, Insider Threats, and Building Culture`,
      content: `## 3.1 Role-based training depth

Beyond awareness baseline, technical roles need DEEPER training:

### Developers

- Secure coding practices (parameterized queries, input validation, output encoding, secret management)
- OWASP Top 10 with hands-on labs
- Threat modeling fundamentals
- Their part in SDLC + DevSecOps
- Cryptography basics — what to use, what NOT to use
- Common languages' security pitfalls

### System administrators

- Privileged access best practices (use a vault, never reuse, rotate)
- Principle of least privilege applied to their own accounts
- Change management discipline
- Configuration hardening
- Log review skills

### Network engineers

- Network segmentation principles
- Encryption protocols (deprecated vs current)
- Wireless security
- Cloud network security models

### Security team itself

- Continuous education: conferences (BSides, DEFCON, RSA), professional certifications (Security+, CySA+, CISSP, OSCP), hands-on labs
- Tabletop exercises
- Red team / purple team rotations
- Threat intelligence consumption

### Executives + board

- Cybersecurity risk in business terms
- Recent industry incidents + lessons
- Their personal threat profile (whaling, deepfakes, executive impersonation)
- Crisis communication
- Regulatory + fiduciary implications of breach

### Finance / AP

- Business email compromise (BEC) — the most expensive scam category
- Verification requirements for wire transfers (out-of-band confirmation via known phone number, not the one in the email)
- Vendor invoice verification — match to PO, confirm payment-detail changes via phone
- Internal authority chains for unusual requests

### HR

- PII protection in recruiting + onboarding
- Background check protocols
- Discipline + termination access-removal coordination with IT (offboarding day, badge revocation, account deactivation)
- Whistleblower / ethics line management

## 3.2 Insider threat awareness

A specialized awareness topic:

- **Malicious insider** — disgruntled employee, espionage, fraud
- **Negligent insider** — well-meaning but careless (clicks links, shares data inappropriately)
- **Compromised insider** — credentials stolen, used by external attacker (looks like insider activity)

Awareness elements:

- "If you see something, say something" — encourage reporting concerning behavior (downloaded large data sets unrelated to role, expressed grievances about company, exhibited financial stress)
- Use of UBA/UEBA tools to flag anomalous behavior
- Background checks at hiring, periodic re-checks for sensitive roles
- Separation of duties and least privilege limit insider damage potential
- Strong offboarding — especially for departing employees who knew they were leaving

Common patterns to recognize:

- Sudden interest in data outside role
- Working unusual hours
- Bypassing controls
- Resistance to vacation (covering up ongoing fraud)
- Significant lifestyle changes (financial stress or sudden wealth)

## 3.3 Insider Threat Programs (ITP)

Formal program (required for some classified contractors, increasingly common elsewhere):

- Cross-functional team: security, HR, legal, IT
- Documented procedures for assessment + intervention
- Privacy-preserving monitoring (clear policies, legal review)
- "Hub" model: indicators feed a central team that connects dots
- Reporting channels for concerned coworkers

## 3.4 Measuring culture

Awareness training is INPUT. Culture is OUTCOME. Measure both:

**Leading indicators (inputs)**

- Training completion rate
- Sim click + reporting rates
- Tabletop participation
- Self-reported security knowledge

**Lagging indicators (outcomes)**

- Number of real phishing reports received from users
- Time-to-report for real attacks
- User-caused incident rate
- Employee survey results ("do you feel safe reporting a mistake?")
- Number of policy exceptions requested
- Compliance audit findings related to user behavior

The best metric for security culture maturity: are users PROUD to report mistakes and concerns? In a healthy culture, yes. In a punitive one, mistakes are hidden until they explode.

## 3.5 Executive sponsorship

The CISO can run a great program, but if the CEO downplays a security ask in a leadership meeting, the program is doomed. Cultural change requires visible support from the top:

- Executives complete the same training as everyone (and publicize their results)
- Security is on the board agenda (not just after incidents)
- Security ROI is communicated alongside other operational investments
- Rewards and recognition come from leadership, not just security

## 3.6 The "security champion" model

Embed volunteer security advocates within product / engineering teams:

- Trained more deeply than average users
- First responders for team security questions
- Connect security to local context
- Feedback channel back to the security team
- Career development: champion programs often lead to security roles

Champions multiply the security team's reach without requiring growth proportional to the rest of the org.

## 3.7 The exam takeaway

When the exam asks about security awareness, look for the answer that combines:

- Continuous (not annual)
- Role-based (not one-size-fits-all)
- Measured (with both leading and lagging indicators)
- Reinforced (just-in-time micro-content)
- Reported (easy and rewarded reporting)
- Cultural (executive sponsorship, champion model)

That answer beats "annual mandatory video" every time.`,
      examTip: `Three things separate a mature security awareness program from a checkbox exercise: ROLE-BASED content, MEASURED outcomes (both clicks AND reporting), and CONTINUOUS reinforcement (just-in-time, not just annually).`,
    },
  ],
  keyTakeaways: [
    'Annual mandatory training alone is not enough — programs must be continuous, role-based, measured, and reinforced',
    'Phishing simulation: track BOTH click rate AND reporting rate. Aim to drive clicks DOWN and reports UP simultaneously',
    'Punitive responses to phishing clicks backfire — they suppress reporting of real attacks',
    'Role-based depth: developers get secure coding; finance gets BEC; executives get whaling + deepfake; sysadmins get privileged-access discipline',
    'Insider threats: malicious, negligent, compromised. Awareness includes recognizing concerning behavior + reporting via designated channels',
    'Just-in-time training (triggered by an action) sticks better than scheduled training disconnected from real moments',
    'Phishing-resistant auth (FIDO2/WebAuthn/passkeys) makes clicks consequence-free — the long-term solution beyond training',
  ],
},

};

export function getSecurityPlusCourseContent(topicId: string): TopicLesson | null {
  return SECURITY_PLUS_COURSE[topicId] || null;
}

export function hasSecurityPlusCourseContent(topicId: string): boolean {
  return topicId in SECURITY_PLUS_COURSE;
}
