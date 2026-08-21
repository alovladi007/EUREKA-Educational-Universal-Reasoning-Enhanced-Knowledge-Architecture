#!/usr/bin/env python3
"""The authoritative CISSP module map, taken from the Instructor Edition PDF.

The book is built in MODULES: 8 domains, each an ordered list of modules ending
in a Domain Review.  72 modules in total, 64 of them content.  This file is the
single source of truth for the course's structure - `exam-curriculum.ts` and
`cissp-course-data.ts` are generated against it, so the shipped course follows
the book's model rather than an inherited chapter list.

Titles and order are the book's (structure only - all prose is authored
originally).  `maps_to` names the existing chapter whose content fills the
module; `absorbs` names extra chapters folded in as additional sections; None
means the module has no content yet and must be authored.
"""

# (domain number, domain name, official (ISC)2 weight)
DOMAINS = [
    (1, "Security and Risk Management", 16),
    (2, "Asset Security", 10),
    (3, "Security Architecture and Engineering", 13),
    (4, "Communication and Network Security", 13),
    (5, "Identity and Access Management", 13),
    (6, "Security Assessment and Testing", 12),
    (7, "Security Operations", 13),
    (8, "Software Development Security", 10),
]

# domain -> [(module_no, book title, topic_id, maps_to, absorbs)]
MODULES = {
1: [
 (1,  "Concepts of Confidentiality, Integrity, and Availability", "cissp_cia_concepts", None, []),
 (2,  "Organizational and Corporate Governance",                  "cissp_governance", "cissp_governance", []),
 (3,  "Risk Management Concepts",                                 "cissp_risk_mgmt", "cissp_risk_mgmt", []),
 (4,  "Compliance Requirements",                                  "cissp_compliance", "cissp_compliance", []),
 (5,  "Legal and Regulatory Issues in a Global Context",           "cissp_legal_global", None, []),
 (6,  "Security Policy, Standards, Procedures, and Guidelines",    "cissp_policy_framework", None, []),
 (7,  "Personnel Security Policies and Procedures",                "cissp_personnel", "cissp_personnel", []),
 (8,  "Security Awareness, Education, and Training Programs",      "cissp_awareness", None, []),
 (9,  "Business Continuity Requirements",                          "cissp_bcdr", "cissp_bcdr", []),
 (10, "Professional Ethics",                                       "cissp_ethics", None, []),
 (11, "Domain 1 Review",                                           "cissp_d1_review", None, []),
],
2: [
 (1,  "Information and Assets",                                    "cissp_data_class", "cissp_data_class", []),
 (2,  "Asset Lifecycle",                                           "cissp_data_lifecycle", "cissp_data_lifecycle", []),
 (3,  "Information and Asset Ownership",                           "cissp_asset_ownership", None, []),
 (4,  "Protect Privacy",                                           "cissp_privacy", "cissp_privacy", []),
 (5,  "Asset Retention",                                           "cissp_asset_retention", None, []),
 (6,  "Data Security Controls",                                    "cissp_data_controls", None, []),
 (7,  "Information and Asset Handling Requirements",               "cissp_asset_handling", None, []),
 (8,  "Data Remanence",                                            "cissp_data_remanence", None, []),
 (9,  "Domain 2 Review",                                           "cissp_d2_review", None, []),
],
3: [
 (1,  "Processes Using Secure Design Principles",                  "cissp_secure_design", "cissp_secure_design", []),
 (2,  "Fundamental Concepts of Security Models",                   "cissp_models", "cissp_models", ["cissp_security_models_deep"]),
 (3,  "Select Controls Based upon System Security Requirements",   "cissp_evaluation", "cissp_evaluation", []),
 (4,  "Security Capabilities of Information Systems",              "cissp_system_capabilities", None, []),
 (5,  "Vulnerabilities of Security Architectures, Designs, and Solution Elements",
                                                                   "cissp_arch_vulns", None, []),
 (6,  "Cryptography",                                              "cissp_crypto", "cissp_crypto", ["cissp_crypto_advanced"]),
 (7,  "Physical Security",                                         "cissp_physical", "cissp_physical", []),
 (8,  "Domain 3 Review",                                           "cissp_d3_review", None, []),
],
4: [
 (1,  "Secure Design Principles in Network Architectures",         "cissp_network", "cissp_network", []),
 (2,  "OSI Layer 1: Physical Layer",                               "cissp_osi_l1", None, []),
 (3,  "OSI Layer 2: Data-Link Layer",                              "cissp_osi_l2", None, []),
 (4,  "OSI Layer 3: Network Layer",                                "cissp_osi_l3", None, []),
 (5,  "OSI Layer 4: Transport Layer",                              "cissp_osi_l4", None, []),
 (6,  "OSI Layer 5: Session Layer",                                "cissp_osi_l5", None, []),
 (7,  "OSI Layer 6: Presentation Layer",                           "cissp_osi_l6", None, []),
 (8,  "OSI Layer 7: Application Layer",                            "cissp_osi_l7", None, []),
 (9,  "Service Considerations",                                    "cissp_service_considerations", None, []),
 (10, "Secure Network Components",                                 "cissp_network_attacks", "cissp_network_attacks", []),
 (11, "Secure Communications Channels According to Design",        "cissp_protocols", "cissp_protocols", ["cissp_wireless_net"]),
 (12, "Domain 4 Review",                                           "cissp_d4_review", None, []),
],
5: [
 (1,  "Control Physical and Logical Access to Assets",             "cissp_access_control", "cissp_access_control", []),
 (2,  "Identity and Access Provisioning Lifecycle",                "cissp_identity", "cissp_identity", []),
 (3,  "Identification and Authentication of People, Devices, and Services",
                                                                   "cissp_auth", "cissp_auth", []),
 (4,  "Identity Management Implementation",                        "cissp_idm_implementation", None, []),
 (5,  "Implement and Manage Authorization Mechanisms",             "cissp_authz_mechanisms", None, []),
 (6,  "Accountability",                                            "cissp_accountability", None, ["cissp_iam_attacks"]),
 (7,  "Domain 5 Review",                                           "cissp_d5_review", None, []),
],
6: [
 (1,  "Design and Validate Assessment, Test, and Audit Strategies","cissp_assess_strategy", None, []),
 (2,  "Security Control Testing",                                  "cissp_vuln", "cissp_vuln", ["cissp_testing_taxonomy"]),
 (3,  "Security Process Data",                                     "cissp_process_data", None, []),
 (4,  "Test Output and Generate Report",                           "cissp_test_reporting", None, ["cissp_testing"]),
 (5,  "Conduct or Facilitate Security Audits",                     "cissp_audit", "cissp_audit", []),
 (6,  "Domain 6 Review",                                           "cissp_d6_review", None, []),
],
7: [
 (1,  "Foundational Security Operations Concepts",                 "cissp_operations", "cissp_operations", []),
 (2,  "Securely Provisioning Resources",                           "cissp_provisioning", None, []),
 (3,  "Resource Protection Techniques",                            "cissp_resource_protection", None, []),
 (4,  "Detective and Preventative Measures",                       "cissp_detective_preventative", None, []),
 (5,  "Incident Management",                                       "cissp_ir", "cissp_ir", []),
 (6,  "Requirements for Investigation Types",                      "cissp_investigation_types", None, []),
 (7,  "Investigations",                                            "cissp_investigations", "cissp_investigations", ["cissp_forensics_legal"]),
 (8,  "Logging and Monitoring Activities",                         "cissp_logging_monitoring", None, []),
 (9,  "Recovery Strategies",                                       "cissp_recovery_strategies", None, []),
 (10, "Disaster Recovery Processes",                               "cissp_disaster", "cissp_disaster", []),
 (11, "Business Continuity Planning and Exercises",                "cissp_bcp_exercises", None, []),
 (12, "Test Disaster Recovery Plans",                              "cissp_dr_testing", None, []),
 (13, "Personnel Safety and Security Concerns",                    "cissp_personnel_safety", None, []),
 (14, "Domain 7 Review",                                           "cissp_d7_review", None, []),
],
8: [
 (1,  "Security in the Software Development Lifecycle (SDLC)",     "cissp_sdlc", "cissp_sdlc", []),
 (2,  "Secure Coding Guidelines and Standards",                    "cissp_owasp_patterns", "cissp_owasp_patterns", ["cissp_app_vuln"]),
 (3,  "Security Controls in Development Environments",             "cissp_devops", "cissp_devops", []),
 (4,  "The Effectiveness of Software Security",                    "cissp_software_effectiveness", None, []),
 (5,  "Domain 8 Review",                                           "cissp_d8_review", None, []),
],
}

SECTION_IDS = {1: "d1_security_risk", 2: "d2_asset_security",
               3: "d3_architecture", 4: "d4_network", 5: "d5_iam",
               6: "d6_assessment", 7: "d7_operations", 8: "d8_software"}


def all_modules():
    for dn, dname, w in DOMAINS:
        for mod in MODULES[dn]:
            yield dn, dname, w, mod


if __name__ == "__main__":
    total = sum(len(MODULES[d]) for d, _, _ in DOMAINS)
    reviews = sum(1 for _, _, _, m in all_modules() if m[1].endswith("Review"))
    have = sum(1 for _, _, _, m in all_modules() if m[3])
    need = total - have
    print(f"{total} modules ({total - reviews} content + {reviews} domain reviews)")
    print(f"{have} filled by an existing chapter, {need} to author")
    for dn, dname, w, m in all_modules():
        flag = "have" if m[3] else "AUTHOR"
        extra = f"  +absorbs {','.join(m[4])}" if m[4] else ""
        print(f"  D{dn}.{m[0]:02d}  {flag:6s} {m[1][:62]:64s}{extra}")
