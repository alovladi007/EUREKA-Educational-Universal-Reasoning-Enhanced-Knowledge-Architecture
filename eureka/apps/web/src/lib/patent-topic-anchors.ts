/**
 * Topic map → primary MPEP chapters & statutes for Patent Bar reading lessons.
 * Use with exam-curriculum PATENT_BAR topic ids.
 */

export type PatentTopicAnchor = {
  mpepChapters: string[];
  statutes: string[];
  drillHint: string;
};

export const PATENT_TOPIC_ANCHORS: Record<string, PatentTopicAnchor> = {
  pp_application_types: {
    mpepChapters: ['200', '600'],
    statutes: ['35 U.S.C. §§ 111, 120, 121'],
    drillHint: 'Compare continuation vs divisional vs CIP filing dates.',
  },
  pp_specification: {
    mpepChapters: ['600', '2100'],
    statutes: ['35 U.S.C. § 112(a)-(f)'],
    drillHint: 'Written description vs enablement vs best mode (where applicable).',
  },
  pp_filing: {
    mpepChapters: ['500', '600'],
    statutes: ['37 CFR 1.52–1.57'],
    drillHint: 'Filing date vs priority date basics.',
  },
  pp_office_actions: {
    mpepChapters: ['700', '1200'],
    statutes: ['37 CFR 1.111–1.116'],
    drillHint: 'Final vs non-final; after-final practice.',
  },
  pp_priority: {
    mpepChapters: ['200', '2100', '1800'],
    statutes: ['35 U.S.C. §§ 119, 120, 365'],
    drillHint: 'Domestic benefit chain vs foreign priority.',
  },
  pp_examination: {
    mpepChapters: ['700', '800'],
    statutes: ['35 U.S.C. § 121'],
    drillHint: 'Restriction vs double patenting.',
  },
  pa_novelty: {
    mpepChapters: ['2100', '700'],
    statutes: ['35 U.S.C. § 102 (AIA)'],
    drillHint: '102(a)(1) vs (a)(2); prior art categories.',
  },
  pa_obviousness: {
    mpepChapters: ['2100'],
    statutes: ['35 U.S.C. § 103'],
    drillHint: 'Graham factors; obviousness type rejections.',
  },
  pa_subject_matter: {
    mpepChapters: ['2100'],
    statutes: ['35 U.S.C. § 101'],
    drillHint: 'Alice/Mayo framework at high level.',
  },
  pa_utility: {
    mpepChapters: ['2100'],
    statutes: ['35 U.S.C. § 101'],
    drillHint: 'Creditable utility vs inoperative embodiments.',
  },
  pa_prior_art: {
    mpepChapters: ['900', '2100'],
    statutes: ['35 U.S.C. § 102'],
    drillHint: 'Effective dates; public use/on sale.',
  },
  pi_reexam: {
    mpepChapters: ['2200', '2600'],
    statutes: ['35 U.S.C. §§ 301–307'],
    drillHint: 'Ex parte reexam vs supplemental examination.',
  },
  pi_ipr: {
    mpepChapters: ['2200'],
    statutes: ['35 U.S.C. §§ 311–319'],
    drillHint: 'IPR scope; estoppel basics.',
  },
  pi_pgr: {
    mpepChapters: ['2200'],
    statutes: ['35 U.S.C. §§ 321–329'],
    drillHint: 'PGR window vs IPR.',
  },
  pi_reissue: {
    mpepChapters: ['1400'],
    statutes: ['35 U.S.C. §§ 251–256'],
    drillHint: 'Enlarging reissue; error requirements.',
  },
  dp_design: {
    mpepChapters: ['1500'],
    statutes: ['35 U.S.C. §§ 171, 289'],
    drillHint: 'Broken line practice; single claim.',
  },
  dp_plant: {
    mpepChapters: ['1600'],
    statutes: ['35 U.S.C. §§ 161–164'],
    drillHint: 'Asexual reproduction requirement.',
  },
  pct_overview: {
    mpepChapters: ['1800'],
    statutes: ['35 U.S.C. § 351 et seq.', 'PCT Articles'],
    drillHint: 'International phase vs national phase.',
  },
  pct_search: {
    mpepChapters: ['1800'],
    statutes: ['PCT Rules'],
    drillHint: 'ISA vs IPEA; Chapter II demand.',
  },
  pct_national: {
    mpepChapters: ['1800', '600'],
    statutes: ['35 U.S.C. § 371'],
    drillHint: '371(c) date; entry deadlines.',
  },
  eth_duty: {
    mpepChapters: ['2000'],
    statutes: ['37 CFR 1.56', '35 U.S.C. § 1'],
    drillHint: 'Materiality; who must disclose.',
  },
  eth_discipline: {
    mpepChapters: ['1000'],
    statutes: ['37 CFR Part 11'],
    drillHint: 'OED vs USPTO prosecution.',
  },
  eth_representation: {
    mpepChapters: ['400', '1100'],
    statutes: ['37 CFR Part 11'],
    drillHint: 'Power of attorney; withdrawal.',
  },
  pa_novelty_preaia: {
    mpepChapters: ['700', '2100'],
    statutes: ['35 U.S.C. § 102 (pre-AIA)'],
    drillHint: 'Pre-AIA §102(b) bars vs AIA effective dates.',
  },
  pa_112a: {
    mpepChapters: ['2100', '600'],
    statutes: ['35 U.S.C. § 112(a)'],
    drillHint: 'Written description vs enablement; possession of the full scope.',
  },
  pa_112b_112f: {
    mpepChapters: ['2100', '600'],
    statutes: ['35 U.S.C. § 112(b), (f)'],
    drillHint: 'Definiteness; means-plus-function and corresponding structure.',
  },
  pa_double_patenting: {
    mpepChapters: ['800', '1400', '2100'],
    statutes: ['35 U.S.C. § 121', '37 CFR § 1.321'],
    drillHint: 'ODP vs statutory DP; terminal disclaimer effects.',
  },
  pp_claim_drafting: {
    mpepChapters: ['600', '2100'],
    statutes: ['35 U.S.C. § 112(b)'],
    drillHint: 'Independent vs dependent claims; multiplicity; best mode (historical).',
  },
  pp_drawings: {
    mpepChapters: ['600'],
    statutes: ['37 CFR §§ 1.52, 1.84'],
    drillHint: 'Black ink, margins, reference numerals, and formal drawing corrections.',
  },
  pp_oath_declaration: {
    mpepChapters: ['600'],
    statutes: ['35 U.S.C. § 115', '37 CFR § 1.63'],
    drillHint: 'Inventor oath/declaration; substitute statements.',
  },
  pp_ids: {
    mpepChapters: ['600', '2000'],
    statutes: ['37 CFR §§ 1.56, 1.97, 1.98'],
    drillHint: 'IDS timing; cumulative information; materiality.',
  },
  pp_inventorship: {
    mpepChapters: ['600'],
    statutes: ['35 U.S.C. § 116', '37 CFR §§ 1.48, 1.324'],
    drillHint: 'Correct inventors; derivation; correction after issue.',
  },
  pf_provisional: {
    mpepChapters: ['600'],
    statutes: ['35 U.S.C. § 111(b)'],
    drillHint: '12-month bridge; written description support for later non-provisional.',
  },
  pf_nonprovisional: {
    mpepChapters: ['600'],
    statutes: ['35 U.S.C. § 111(a)'],
    drillHint: 'Filing date vs priority date; basic filing papers.',
  },
  pf_priority: {
    mpepChapters: ['200', '2100', '1800'],
    statutes: ['35 U.S.C. §§ 119, 120, 365'],
    drillHint: 'Domestic benefit chain vs foreign priority.',
  },
  pf_continuations: {
    mpepChapters: ['600', '200'],
    statutes: ['35 U.S.C. § 120'],
    drillHint: 'Continuation vs CIP vs divisional; copendency.',
  },
  pf_restriction: {
    mpepChapters: ['800'],
    statutes: ['35 U.S.C. § 121'],
    drillHint: 'Restriction vs election of species; divisional safe harbor.',
  },
  pf_office_action_timing: {
    mpepChapters: ['700'],
    statutes: ['37 CFR §§ 1.134, 1.135'],
    drillHint: 'Shortened statutory periods; notices; suspension.',
  },
  pf_extensions: {
    mpepChapters: ['700'],
    statutes: ['37 CFR § 1.136'],
    drillHint: '§1.136(a) vs PTE; fee and max extension.',
  },
  pf_allowance_issue: {
    mpepChapters: ['1300'],
    statutes: ['35 U.S.C. § 151', '37 CFR § 1.311'],
    drillHint: 'Issue fee deadline; notice of allowance.',
  },
  pf_preissuance: {
    mpepChapters: ['700', '1300'],
    statutes: ['37 CFR §§ 1.114, 1.312'],
    drillHint: 'RCE; after-allowance amendments; express abandonment.',
  },
  po_nonfinal: {
    mpepChapters: ['700'],
    statutes: ['37 CFR §§ 1.111, 1.116'],
    drillHint: 'First action and non-final responses; traverse.',
  },
  po_final: {
    mpepChapters: ['700', '1200'],
    statutes: ['37 CFR §§ 1.113, 1.116'],
    drillHint: 'Final rejection; after-final practice; AFCP.',
  },
  po_amendments: {
    mpepChapters: ['600', '700'],
    statutes: ['37 CFR § 1.114'],
    drillHint: 'New matter; entry after final; examiner objections.',
  },
  po_response_strategies: {
    mpepChapters: ['700'],
    statutes: ['37 CFR Part 1'],
    drillHint: 'Interviews; arguments vs amendments; compact prosecution.',
  },
  po_appeal_brief_prep: {
    mpepChapters: ['1200'],
    statutes: ['37 CFR Part 41'],
    drillHint: 'Notice of appeal; appeal brief vs examiner’s answer.',
  },
  po_reopen_prosecution: {
    mpepChapters: ['700', '1300'],
    statutes: ['37 CFR §§ 1.114, 1.198'],
    drillHint: 'RCE vs reopening; withdrawal from appeal.',
  },
  pct_international_phase: {
    mpepChapters: ['1800'],
    statutes: ['PCT Articles', '35 U.S.C. § 351 et seq.'],
    drillHint: 'RO filing; priority date; international publication.',
  },
  pct_chapter_ii: {
    mpepChapters: ['1800'],
    statutes: ['PCT Chapter II'],
    drillHint: 'IPEA; demand; IPRP (non-binding).',
  },
  pct_strategy: {
    mpepChapters: ['1800', '600'],
    statutes: ['PCT', '35 U.S.C. § 371'],
    drillHint: 'ISA/IPEA selection; national phase entry strategy.',
  },
  pg_ptab_appeal: {
    mpepChapters: ['1200'],
    statutes: ['35 U.S.C. § 134', '37 CFR Part 41'],
    drillHint: 'Ex parte appeal; briefs; oral hearing; Fed. Cir. review.',
  },
  pg_supplemental_exam: {
    mpepChapters: ['2800'],
    statutes: ['35 U.S.C. §§ 257–258'],
    drillHint: 'Supplemental examination vs reexam; inequitable conduct cleanup.',
  },
  eth_signatures: {
    mpepChapters: ['500', '600'],
    statutes: ['37 CFR §§ 1.4, 11.18'],
    drillHint: 'Certificate of transmission; registered practitioner signature.',
  },
  st_pta_pte: {
    mpepChapters: ['2700', '2750'],
    statutes: ['35 U.S.C. §§ 154(b), 156'],
    drillHint: 'PTA A/B/C delays vs applicant delay; PTE for regulatory review.',
  },
  st_ai_inventions: {
    mpepChapters: ['2100'],
    statutes: ['35 U.S.C. §§ 100(f), 115'],
    drillHint: 'Natural-person inventors; human contribution to conception.',
  },

  // ── USPTO Gap-Fix anchors (added 2026-05-24) for the 18 new topics ─────
  pa_aia_effective_filing_date: {
    mpepChapters: ['2152', '2154', '2100'],
    statutes: ['35 U.S.C. §§ 100(i), 102(a)(1), 102(b)(1)'],
    drillHint: 'EFD per claim; one-year grace; Helsinn confidential-sale trap.',
  },
  pa_aia_102a2_secret_prior_art: {
    mpepChapters: ['2154', '2100'],
    statutes: ['35 U.S.C. §§ 102(a)(2), 102(b)(2), 102(c)'],
    drillHint: 'Secret prior art; Hilmer eliminated; CREATE Act JRA exception.',
  },
  pa_112f_means_plus_function: {
    mpepChapters: ['2181', '2182', '2183', '2184', '2185', '2186', '2187'],
    statutes: ['35 U.S.C. § 112(f), § 112(b)'],
    drillHint: 'Williamson nonce words; Aristocrat algorithm requirement.',
  },
  pa_terminal_disclaimer_odp: {
    mpepChapters: ['804', '1490', '1400'],
    statutes: ['35 U.S.C. § 121; 37 CFR § 1.321'],
    drillHint: 'One-way vs two-way ODP; §121 safe harbor; recapture rule.',
  },
  pp_claim_antecedent_basis: {
    mpepChapters: ['2173', '608', '600'],
    statutes: ['35 U.S.C. § 112(b)'],
    drillHint: 'Packard single-antecedent rule; comprising vs consisting; Markush.',
  },
  pp_ids_therasense_materiality: {
    mpepChapters: ['2000', '2001'],
    statutes: ['37 CFR §§ 1.56, 1.97, 1.98'],
    drillHint: 'Three IDS windows; Therasense but-for materiality; foreign 30-day rule.',
  },
  pp_inventorship_correction: {
    mpepChapters: ['602', '1481', '400'],
    statutes: ['35 U.S.C. §§ 116, 135, 256; 37 CFR § 1.48'],
    drillHint: 'Pre-issue (§116/§1.48) vs post-issue (§256) vs AIA derivation (§135).',
  },
  pf_priority_paris_120: {
    mpepChapters: ['213', '214', '215', '200'],
    statutes: ['35 U.S.C. §§ 119(a), 119(e), 120, 365; 37 CFR §§ 1.55, 1.78'],
    drillHint: 'Paris 12-month; certified copy 4mo/16mo; restoration with unintentional delay.',
  },
  pf_rce_vs_continuation_strategy: {
    mpepChapters: ['706', '201', '200'],
    statutes: ['35 U.S.C. §§ 120, 121; 37 CFR § 1.114'],
    drillHint: 'RCE vs continuation vs divisional vs CIP; PTA consumption.',
  },
  pf_restriction_elections_detailed: {
    mpepChapters: ['800', '802', '803', '804', '806', '808'],
    statutes: ['35 U.S.C. § 121; 37 CFR § 1.142'],
    drillHint: 'Two-part test; election with traverse; election by original presentation.',
  },
  po_ptab_appeal_practice: {
    mpepChapters: ['1200', '1204', '1205', '1207', '1208'],
    statutes: ['35 U.S.C. §§ 134, 141, 145; 37 CFR §§ 41.37, 41.39, 41.41, 41.47, 41.52'],
    drillHint: '§41.37 brief requirements; BRI vs Phillips; new ground response.',
  },
  pi_ipr_pgr_cbm_distinctions: {
    mpepChapters: ['2200', '2900'],
    statutes: ['35 U.S.C. §§ 311–319, 321–329, 315(e), 325(e)'],
    drillHint: 'IPR (§102/103 + patents/pubs) vs PGR (any ground, 9-mo) vs CBM (sunset).',
  },
  pi_reissue_reexam_supplemental: {
    mpepChapters: ['1400', '1410', '2200', '2800'],
    statutes: ['35 U.S.C. §§ 251, 252, 257, 302–307'],
    drillHint: 'Broadening reissue 2-yr; recapture rule; SNQ; §257 immunity.',
  },
  pct_chapter_ii_preliminary: {
    mpepChapters: ['1800', '1820', '1830', '1840', '1850'],
    statutes: ['PCT Articles 19, 31, 34; 37 CFR §§ 1.480'],
    drillHint: 'Demand 22mo/3mo-from-ISR; Article 19 (claims) vs Article 34 (claims/spec/drawings).',
  },
  pct_national_stage_371: {
    mpepChapters: ['1893', '1895', '1800'],
    statutes: ['35 U.S.C. §§ 371, 365(c)'],
    drillHint: '30-month deadline; §365(c) bypass continuation; restoration of priority.',
  },
  st_pta_calculation_abc: {
    mpepChapters: ['2730', '2731', '2732', '2733', '2700'],
    statutes: ['35 U.S.C. § 154(b); 37 CFR §§ 1.702–1.705'],
    drillHint: 'A/B/C delays; overlap rule; applicant delay offset; 2-mo reconsideration.',
  },
  st_pte_hatch_waxman: {
    mpepChapters: ['2750', '2700'],
    statutes: ['35 U.S.C. § 156'],
    drillHint: 'FDA delay PTE; 60-day filing; 5yr/14yr caps; PTA+PTE stacking.',
  },
  st_maintenance_fees: {
    mpepChapters: ['2500', '2540', '2550', '2580', '2590'],
    statutes: ['35 U.S.C. § 41(b); 37 CFR §§ 1.20(g)-(i), 1.362, 1.378'],
    drillHint: '3.5/7.5/11.5-year schedule; 6-mo grace; reinstatement (unintentional).',
  },
};
