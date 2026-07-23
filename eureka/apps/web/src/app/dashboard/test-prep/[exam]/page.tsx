'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  PlayCircle, BookOpen, BarChart3, Clock, CheckCircle2,
  Plus, Search, Filter, ChevronRight, Star, Pin, Trash2, Edit3,
  Flag, ArrowRight, ArrowLeft, Timer, Pause, Play, X, Lightbulb,
  BookMarked, Video, StickyNote, BrainCircuit, Trophy, AlertCircle,
  RotateCcw, Eye, EyeOff, Layers, Zap, ThumbsUp, ThumbsDown,
  Library, ExternalLink, Search as SearchIcon, Hash, Sparkles, XCircle,
  Puzzle, ShieldCheck,
} from 'lucide-react';
import { getExamConfig, getSectionsForExam } from '@/lib/exam-config';
import { getCurriculum, getTotalTopics } from '@/lib/exam-curriculum';
import { PATENT_TOPIC_ANCHORS } from '@/lib/patent-topic-anchors';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';
import { eMpepChapterUrl } from '@/lib/mpep-chapters';
import { getCISSPLessonContent } from '@/lib/cissp-lesson-content';
import { getSecurityPlusLessonContent } from '@/lib/security-plus-lesson-content';
// Course-data modules are now lazy-loaded via exam-course-loader so a
// student picking PATENT_BAR doesn't ship MCAT/LSAT/CISSP/etc. chunks
// (P3-C / task #62). Keep TopicLesson as a TYPE-ONLY import so the
// inferred-type chain still works at zero runtime cost.
import type { TopicLesson } from '@/lib/cissp-course-data';
import { loadExamCourse, type CoursePack } from '@/lib/exam-course-loader';
// All exam qbank modules are lazy-loaded now (P3-9 stages 2 + 3):
// QBankTab.startSession dynamic-imports per branch; per-exam ExamTab
// components useEffect-load their pool on mount. Removed eager
// imports of FME_QUESTIONS / PE_EE_QUESTIONS / MCAT_QUESTIONS here
// and FE_EE_QUESTIONS below.
import { getFMEFlashcards, FME_FLASHCARD_DOMAINS, FME_FLASHCARD_COUNT } from '@/lib/fme-flashcard-data';
import { getPEEEFlashcards, PEEE_FLASHCARD_DOMAINS, PEEE_FLASHCARD_COUNT } from '@/lib/pe-ee-flashcard-data';
import { getMCATFlashcards, MCAT_FLASHCARD_DOMAINS, MCAT_FLASHCARD_COUNT } from '@/lib/mcat-flashcard-data';
import { LSAT_FLASHCARDS, LSAT_FLASHCARD_DOMAINS } from '@/lib/lsat-flashcard-data';
import { LessonQuiz } from '@/components/test-prep/cissp/LessonQuiz';
// getCISSPQuestions lazy-loaded inside QBankTab.startSession (P3-9
// stage 2). Type-only import keeps Question typing without runtime cost.
import type { CISSPQuestion } from '@/lib/cissp-qbank-data';
import { getCISSPVideoLessons } from '@/lib/cissp-video-lessons';
import { getCISSPFlashcards, CISSP_FLASHCARD_DOMAINS, CISSP_FLASHCARD_COUNT } from '@/lib/cissp-flashcard-data';
import { getSecurityPlusFlashcards, SECPLUS_FLASHCARD_DOMAINS, SECPLUS_FLASHCARD_COUNT } from '@/lib/security-plus-flashcard-data';
import { getPatentBarFlashcards, PATENT_BAR_FLASHCARD_DOMAINS, PATENT_BAR_FLASHCARD_COUNT } from '@/lib/patent-bar-flashcard-data';
import { getFEEEFlashcards, FEEE_FLASHCARD_DOMAINS, FEEE_FLASHCARD_COUNT } from '@/lib/fe-ee-flashcard-data';
import { getGREFlashcards, GRE_FLASHCARD_DOMAINS, GRE_FLASHCARD_COUNT } from '@/lib/gre-flashcard-data';
import { getSATFlashcards, SAT_FLASHCARD_DOMAINS, SAT_FLASHCARD_COUNT } from '@/lib/sat-flashcard-data';
import { getGMATFlashcards, GMAT_FLASHCARD_DOMAINS, GMAT_FLASHCARD_COUNT } from '@/lib/gmat-flashcard-data';
// FE_EE_QUESTIONS lazy-loaded in QBankTab + FEEEExamTab (P3-9 stage 3).
// Type-only import keeps Question typing without runtime cost.
import type { FEEEQuestion } from '@/lib/fe-ee-qbank-data';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PatentBarCohortPanel } from '@/components/test-prep/patent/PatentBarCohortPanel';
import { LsatFrequencyHeatmap } from '@/components/test-prep/LsatFrequencyHeatmap';
import { McatFrequencyHeatmap } from '@/components/test-prep/McatFrequencyHeatmap';
import { SecurityPlusPBQTab } from '@/components/test-prep/SecurityPlusPBQ';
import { LessonVideoPlayer } from '@/components/test-prep/LessonVideoPlayer';
import { VideoLessonTabs } from '@/components/test-prep/VideoLessonTabs';
import { LessonCurriculumRail } from '@/components/test-prep/LessonCurriculumRail';
import { LSAT_QUESTION_TYPES } from '@/lib/lsat-frequency';
import { recordExamAttempt, getExamAttempts, mergeExamHistory } from '@/lib/exam-attempts';

type Tab = 'read' | 'lessons' | 'flashcards' | 'notes' | 'qbank' | 'mpep' | 'lsat' | 'exam' | 'analytics' | 'pbq';

// Fisher-Yates. The old `.sort(() => Math.random() - 0.5)` idiom is a biased
// shuffle — items keep a strong pull toward their original array position, so
// questions appended late in a pool (e.g. the official USPTO banks) rarely
// surfaced early in a session.
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ExamPage() {
  const params = useParams();
  const examId = (params.exam as string)?.toUpperCase();
  const config = getExamConfig(examId);
  const sections = getSectionsForExam(examId);
  const isPatentBar = examId === 'PATENT_BAR';
  const isFEEE = examId === 'FE_EE';
  const isFEME = examId === 'FE_ME';
  const isPEEE = examId === 'PE_EE';
  const isMCAT = examId === 'MCAT';
  const isLSAT = examId === 'LSAT';
  const isSecPlus = examId === 'SECURITY_PLUS';
  const [activeTab, setActiveTab] = useState<Tab>('read');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'read', label: 'Read Lessons', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'lessons', label: 'Video Lessons', icon: <Video className="h-4 w-4" /> },
    { id: 'flashcards', label: 'Flashcards', icon: <Layers className="h-4 w-4" /> },
    { id: 'notes', label: 'My Notes', icon: <StickyNote className="h-4 w-4" /> },
    { id: 'qbank', label: 'QBank', icon: <BrainCircuit className="h-4 w-4" /> },
    ...(isPatentBar ? [{ id: 'mpep' as Tab, label: 'MPEP', icon: <Library className="h-4 w-4" /> }] : []),
    ...(isLSAT ? [{ id: 'lsat' as Tab, label: 'Question Types', icon: <Library className="h-4 w-4" /> }] : []),
    ...((isFEEE || isFEME || isPEEE || isMCAT || isSecPlus) ? [
      { id: 'exam' as Tab, label: 'Full Exam', icon: <Trophy className="h-4 w-4" /> },
      { id: 'analytics' as Tab, label: 'Analytics', icon: <BarChart3 className="h-4 w-4" /> },
    ] : []),
    ...(isSecPlus ? [{ id: 'pbq' as Tab, label: 'PBQ Sims', icon: <Puzzle className="h-4 w-4" /> }] : []),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{config.name}</h1>
        <p className="text-muted-foreground mt-1">
          {config.description} &middot; {config.sections.length} sections &middot; Score range: {config.scoreRange.label}
        </p>
      </div>

      {isPatentBar && (
        <Card className="p-4 bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-sm">Patent Bar command center</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                MPEP weakness analytics, time vs accuracy, and an exam-style MPEP workbench (tabs, bookmarks, eMPEP reader).
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href={`/dashboard/test-prep/${String(params.exam).toLowerCase()}/live`}>
                <Button size="sm" variant="default" className="gap-1.5">
                  <Video className="h-3.5 w-3.5" /> Live instruction
                </Button>
              </Link>
              <Link href={`/dashboard/test-prep/${String(params.exam).toLowerCase()}/patent-program`}>
                <Button size="sm" variant="secondary" className="gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" /> Full program
                </Button>
              </Link>
              <Link href={`/dashboard/test-prep/${String(params.exam).toLowerCase()}/command-center`}>
                <Button size="sm" variant="secondary" className="gap-1.5">
                  <BarChart3 className="h-3.5 w-3.5" /> Analytics &amp; SRS
                </Button>
              </Link>
              <Link href={`/dashboard/test-prep/${String(params.exam).toLowerCase()}/mpep-workbench`}>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Library className="h-3.5 w-3.5" /> MPEP workbench
                </Button>
              </Link>
              <Link href={`/dashboard/test-prep/${String(params.exam).toLowerCase()}/review-queue`}>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> SME review queue
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {isPatentBar && <PatentBarCohortPanel />}

      {isLSAT && (
        <Card className="p-4 bg-purple-50/70 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-sm">LSAT command center</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Question-type weakness analytics, LR vs RC pacing, and a LawHub-style workbench (TOC,
                bookmarks, question-type heatmap, official LSAC reference).
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href={`/dashboard/test-prep/${String(params.exam).toLowerCase()}/lsat-live`}>
                <Button size="sm" variant="default" className="gap-1.5">
                  <Video className="h-3.5 w-3.5" /> Live instruction
                </Button>
              </Link>
              <Link href={`/dashboard/test-prep/${String(params.exam).toLowerCase()}/lsat-program`}>
                <Button size="sm" variant="secondary" className="gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" /> Full program
                </Button>
              </Link>
              <Link href={`/dashboard/test-prep/${String(params.exam).toLowerCase()}/lsat-analytics`}>
                <Button size="sm" variant="secondary" className="gap-1.5">
                  <BarChart3 className="h-3.5 w-3.5" /> Analytics &amp; SRS
                </Button>
              </Link>
              <Link href={`/dashboard/test-prep/${String(params.exam).toLowerCase()}/lawhub-workbench`}>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Library className="h-3.5 w-3.5" /> LawHub workbench
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Exam-specific frequency heatmaps with official-site deep links.
          Same pattern as the MPEP workbench heatmap but for non-Patent-Bar
          exams: shows what's most-tested + clicks open the official content
          reference (LSAC LawHub for LSAT, AAMC store for MCAT). */}
      {isLSAT && <LsatFrequencyHeatmap />}
      {isMCAT && <McatFrequencyHeatmap />}

      {/* Tabs — scroll horizontally on mobile (Patent Bar has 9 tabs;
          flex-wrap wraps awkwardly on narrow screens). overflow-x-auto
          keeps tabs in a single row, scrollbar-thin trims the visual
          weight. w-fit on a parent inline-flex preserves desktop look. */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-flex gap-1 bg-muted p-1 rounded-lg w-fit min-w-full sm:min-w-0 mx-4 sm:mx-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'read' && <ReadLessonsTab examType={examId} />}
      {activeTab === 'lessons' && <LessonsTab examType={examId} sections={sections} />}
      {activeTab === 'flashcards' && <FlashcardsTab examType={examId} sections={sections} />}
      {activeTab === 'notes' && <NotesTab examType={examId} sections={sections} />}
      {activeTab === 'qbank' && <QBankTab examType={examId} config={config} sections={sections} />}
      {activeTab === 'mpep' && isPatentBar && <MPEPTab />}
      {activeTab === 'lsat' && isLSAT && <LSATTab />}
      {activeTab === 'exam' && isFEEE && <FEEEExamTab />}
      {activeTab === 'analytics' && isFEEE && <FEEEAnalyticsTab />}
      {activeTab === 'exam' && isFEME && <FMEExamTab />}
      {activeTab === 'analytics' && isFEME && <FMEAnalyticsTab />}
      {activeTab === 'exam' && isPEEE && <PEEEExamTab />}
      {activeTab === 'analytics' && isPEEE && <PEEEAnalyticsTab />}
      {activeTab === 'exam' && isMCAT && <MCATExamTab />}
      {activeTab === 'analytics' && isMCAT && <MCATAnalyticsTab />}
      {activeTab === 'exam' && isSecPlus && <SECPLUSExamTab />}
      {activeTab === 'analytics' && isSecPlus && <SECPLUSAnalyticsTab />}
      {activeTab === 'pbq' && isSecPlus && <SecurityPlusPBQTab />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MPEP TAB (Patent Bar only)
// ═══════════════════════════════════════════════════════════════

const MPEP_CHAPTERS = [
  { num: '100', title: 'Secrecy, Access, National Security, and Foreign Filing', sections: '101-150' },
  { num: '200', title: 'Types and Status of Application; Naming of Inventor', sections: '201-217' },
  { num: '300', title: 'Ownership and Assignment', sections: '301-324' },
  { num: '400', title: 'Representative of Inventor or Owner', sections: '401-409' },
  { num: '500', title: 'Receipt and Handling of Mail and Papers', sections: '501-513' },
  { num: '600', title: 'Parts, Form, and Content of Application', sections: '601-608' },
  { num: '700', title: 'Examination of Applications', sections: '701-724' },
  { num: '800', title: 'Restriction in Applications Filed Under 35 U.S.C. 111; Double Patenting', sections: '801-823' },
  { num: '900', title: 'Prior Art, Classification, and Search', sections: '901-904' },
  { num: '1000', title: 'Matters Decided by Various U.S. Patent and Trademark Office Officials', sections: '1001-1006' },
  { num: '1100', title: 'Statutory Invention Registration (Rescinded) and Pre-Grant Publication', sections: '1101-1134' },
  { num: '1200', title: 'Appeal', sections: '1201-1216' },
  { num: '1300', title: 'Allowance and Issue', sections: '1301-1312' },
  { num: '1400', title: 'Correction of Patents', sections: '1401-1485' },
  { num: '1500', title: 'Design Patents', sections: '1501-1512' },
  { num: '1600', title: 'Plant Patents', sections: '1601-1613' },
  { num: '1700', title: 'Miscellaneous', sections: '1701-1730' },
  { num: '1800', title: 'Patent Cooperation Treaty', sections: '1801-1896' },
  { num: '1900', title: 'Protest', sections: '1901-1907' },
  { num: '2000', title: 'Duty of Disclosure, Candor, and Good Faith', sections: '2001-2023' },
  { num: '2100', title: 'Patentability', sections: '2101-2190' },
  { num: '2200', title: 'Citation of Prior Art and Ex Parte Reexamination', sections: '2201-2296' },
  { num: '2300', title: 'Inter Partes Reexamination', sections: '2301-2388' },
  { num: '2400', title: 'Biotechnology', sections: '2401-2427' },
  { num: '2500', title: 'Maintenance Fees', sections: '2501-2595' },
  { num: '2600', title: 'Optional Inter Partes Reexamination', sections: '2601-2694' },
  { num: '2700', title: 'Patent Terms and Extensions', sections: '2701-2780' },
  { num: '2800', title: 'Supplemental Examination', sections: '2801-2817' },
  { num: '2900', title: 'International Design Applications', sections: '2901-2921' },
];

const MPEP_HIGH_YIELD = [
  { chapter: '700', topic: 'Examination of Applications', why: 'Core prosecution procedures — most heavily tested chapter on the exam.' },
  { chapter: '2100', topic: 'Patentability (35 USC 101, 102, 103, 112)', why: 'Novelty, obviousness, eligibility, written description — single most tested area.' },
  { chapter: '600', topic: 'Parts, Form, and Content of Application', why: 'Specification structure, claim drafting, drawings, oath/declaration.' },
  { chapter: '1200', topic: 'Appeal to PTAB', why: '§41.37 brief content, examiner answer, oral hearing, BRI vs Phillips.' },
  { chapter: '2000', topic: 'Duty of Disclosure', why: 'Rule 56 duty, IDS timing windows, Therasense inequitable conduct.' },
  { chapter: '1800', topic: 'Patent Cooperation Treaty (PCT)', why: 'International filing, ISR/IPEA, 30-month national stage, §365(c) bypass.' },
  { chapter: '200', topic: 'Types and Status of Application', why: 'Provisional, continuation, divisional, CIP, RCE, priority/benefit claims.' },
  { chapter: '1500', topic: 'Design Patents', why: 'Design rules differ — ornamentality, single claim, 15-year term.' },
  // ─── Expanded high-yield chapters (gap-fix 2026-05-24) ──────────────────
  { chapter: '1400', topic: 'Correction of Patents', why: 'Reissue (§251) 2-yr broadening, recapture, certificate of correction.' },
  { chapter: '2200', topic: 'Citation of Prior Art & Ex Parte Reexam', why: 'SNQ standard, ex parte reexam scope, third-party requesters.' },
  { chapter: '2700', topic: 'Patent Terms and Extensions', why: 'PTA A/B/C delays, §156 PTE for FDA review, term calculations.' },
  { chapter: '2500', topic: 'Maintenance Fees', why: '3.5/7.5/11.5-year schedule, 6-mo grace, reinstatement for unintentional delay.' },
  { chapter: '2900', topic: 'IPR / PGR Proceedings', why: 'IPR (§102/103 + patents/pubs) vs PGR (9-mo window, any ground).' },
  { chapter: '400', topic: 'Representative of Inventor or Owner', why: 'POA, foreign representation, signatures, withdrawal of representation.' },
  { chapter: '2800', topic: 'Supplemental Examination', why: '§257 immunity from inequitable conduct; SNQ → reexam pathway.' },
  { chapter: '800', topic: 'Restriction & Double Patenting', why: 'Two-part test, election with traverse, §121 safe harbor, ODP.' },
];

function MPEPTab() {
  const params = useParams();
  const examPath = String(params.exam || 'patent_bar').toLowerCase();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  const filteredChapters = searchQuery.trim()
    ? MPEP_CHAPTERS.filter((ch) =>
        ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.num.includes(searchQuery) ||
        ch.sections.includes(searchQuery)
      )
    : MPEP_CHAPTERS;

  return (
    <div className="space-y-6">
      {/* MPEP Header */}
      <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
            <Library className="h-7 w-7 text-amber-700 dark:text-amber-300" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1">Manual of Patent Examining Procedure (MPEP)</h2>
            <p className="text-sm text-muted-foreground mb-3">
              9th Edition, Revision 01.2024 (R-01.2024) &middot; Published November 2024 &middot; Current as of January 31, 2024
            </p>
            <p className="text-sm mb-4">
              The MPEP is the primary reference for the Patent Bar exam. The exam is &quot;open book&quot; — you can search the MPEP during the test. Knowing how to navigate it quickly is critical.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href={`/dashboard/test-prep/${examPath}/patent-program`}>
                <Button size="sm" variant="default" className="gap-2">
                  <BookOpen className="h-3.5 w-3.5" /> Full program (7 pillars)
                </Button>
              </Link>
              <Link href={`/dashboard/test-prep/${examPath}/mpep-workbench`}>
                <Button size="sm" variant="secondary" className="gap-2">
                  <Library className="h-3.5 w-3.5" /> MPEP workbench
                </Button>
              </Link>
              <Link href={`/dashboard/test-prep/${examPath}/command-center`}>
                <Button size="sm" variant="outline" className="gap-2">
                  <BarChart3 className="h-3.5 w-3.5" /> Weakness analytics
                </Button>
              </Link>
              <a href="https://mpep.uspto.gov/RDMS/MPEP/current" target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="gap-2">
                  <ExternalLink className="h-3.5 w-3.5" /> Open Searchable MPEP (eMPEP)
                </Button>
              </a>
              <a href="https://www.uspto.gov/web/offices/pac/mpep/index.html" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="h-3.5 w-3.5" /> HTML Version
                </Button>
              </a>
              <a href="https://www.uspto.gov/MPEP" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="h-3.5 w-3.5" /> USPTO MPEP Portal
                </Button>
              </a>
            </div>
          </div>
        </div>
      </Card>

      {/* High-Yield Chapters */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" /> High-Yield Chapters for the Patent Bar
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {MPEP_HIGH_YIELD.map((item) => (
            <a
              key={item.chapter}
              // eMpepChapterUrl maps the chapter number to the SPA's actual d0e####
              // anchor (the only URL pattern the SPA recognises). chXXX.html spins
              // forever because it isn't a real eMPEP route.
              href={eMpepChapterUrl(item.chapter)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Card className="p-4 hover:shadow-md transition-all cursor-pointer border-l-4 border-l-amber-400 h-full">
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="font-mono text-xs flex-shrink-0">Ch. {item.chapter}</Badge>
                  <div>
                    <p className="font-medium text-sm">{item.topic}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.why}</p>
                  </div>
                </div>
              </Card>
            </a>
          ))}
        </div>
      </div>

      {/* Chapter Directory */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Complete Chapter Directory</h3>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chapters..."
              className="pl-9 pr-3 py-1.5 border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="space-y-1">
          {filteredChapters.map((ch) => (
            <a
              key={ch.num}
              // Same helper as the high-yield cards — maps chapter # → SPA d0e
              // anchor with static-mirror fallback for chapters without one.
              href={eMpepChapterUrl(ch.num)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Card className="p-3 hover:bg-accent/50 transition-colors cursor-pointer flex items-center gap-3">
                <div className="flex-shrink-0 w-14 text-center">
                  <Badge variant="outline" className="font-mono text-xs">{ch.num}</Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{ch.title}</p>
                  <p className="text-xs text-muted-foreground">Sections {ch.sections}</p>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              </Card>
            </a>
          ))}
        </div>
      </div>

      {/* Study Tips */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-blue-600" /> MPEP Study Tips for the Patent Bar
        </h3>
        <div className="space-y-2 text-sm">
          <p><strong>1. Learn to search, not memorize.</strong> The exam gives you access to the MPEP — practice using Ctrl+F to find answers quickly.</p>
          <p><strong>2. Focus on Chapters 700 and 2100.</strong> These two chapters account for the largest portion of exam questions.</p>
          <p><strong>3. Know the rules by number.</strong> 37 CFR rules (e.g., Rule 56, Rule 131, Rule 132) are frequently tested. Know what each rule covers.</p>
          <p><strong>4. Understand flowcharts and timelines.</strong> Prosecution timelines, appeal procedures, and PCT deadlines come up repeatedly.</p>
          <p><strong>5. Practice with the actual MPEP interface.</strong> The exam uses the searchable MPEP — get comfortable navigating it before test day.</p>
          <p><strong>6. Track section revisions.</strong> Sections marked with [R-01.2024] have been recently updated and may be more likely to appear on the exam.</p>
          <p><strong>7. Memorize key deadlines.</strong> Paris 12-month, PCT 30-month, IDS 3-month, broadening reissue 2-year, PTE 60-day, maintenance 3.5/7.5/11.5-year. Mistakes here are common &amp; costly.</p>
          <p><strong>8. Know post-AIA vs pre-AIA distinctions.</strong> Effective filing date (EFD) on/after March 16, 2013 → AIA §102/§103. Earlier filings → pre-AIA. The exam tests both.</p>
          <p><strong>9. Distinguish PTAB proceedings.</strong> IPR (§102/§103 + patents/pubs only), PGR (any ground, 9-mo window), CBM (sunset 2020), ex parte appeal (§134(a)). Estoppel rules differ.</p>
          <p><strong>10. Practice MPEP cross-references.</strong> Many sections cite each other (e.g., MPEP 2100 ↔ MPEP 700). Follow the cross-references to understand context.</p>
        </div>
      </Card>

      {/* Quick Reference */}
      <Card className="p-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Hash className="h-5 w-5 text-indigo-500" /> Key Rules Quick Reference
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            // ── Rule 56 family (duty of disclosure) ────────────────────────
            { rule: '37 CFR 1.56', desc: 'Duty to disclose material information (Rule 56)' },
            { rule: '37 CFR 1.97', desc: 'IDS timing windows (three filing windows)' },
            { rule: '37 CFR 1.98', desc: 'IDS content requirements (citation format, copies)' },
            // ── Response & amendment practice ──────────────────────────────
            { rule: '37 CFR 1.111', desc: 'Reply to non-final Office action' },
            { rule: '37 CFR 1.113', desc: 'Final rejection' },
            { rule: '37 CFR 1.114', desc: 'Request for Continued Examination (RCE)' },
            { rule: '37 CFR 1.116', desc: 'Amendments after final rejection' },
            { rule: '37 CFR 1.130', desc: 'Declarations to overcome AIA §102 prior art' },
            { rule: '37 CFR 1.131', desc: 'Affidavit to antedate prior art (pre-AIA)' },
            { rule: '37 CFR 1.132', desc: 'Declaration of evidence (secondary considerations)' },
            { rule: '37 CFR 1.136', desc: 'Extensions of time' },
            { rule: '37 CFR 1.142', desc: 'Requirement for restriction; election with traverse' },
            { rule: '37 CFR 1.144', desc: 'Petition to challenge restriction requirement' },
            { rule: '37 CFR 1.181', desc: 'Petition to the Director (general)' },
            // ── PTAB appeal practice ───────────────────────────────────────
            { rule: '37 CFR 41.31', desc: 'Pre-appeal brief request' },
            { rule: '37 CFR 41.37', desc: 'Appeal brief content (10 required sections)' },
            { rule: '37 CFR 41.39', desc: 'Examiner answer (may designate new ground)' },
            { rule: '37 CFR 41.41', desc: 'Reply brief (limited to new grounds)' },
            { rule: '37 CFR 41.47', desc: 'Oral hearing request' },
            { rule: '37 CFR 41.52', desc: 'Request for rehearing of PTAB decision' },
            // ── Term & maintenance ─────────────────────────────────────────
            { rule: '37 CFR 1.321', desc: 'Terminal disclaimers (TD)' },
            { rule: '37 CFR 1.362', desc: 'Maintenance fee schedule & grace period' },
            { rule: '37 CFR 1.378', desc: 'Reinstatement of expired patents (unintentional)' },
            { rule: '37 CFR 1.705', desc: 'PTA reconsideration (2-mo window)' },
            // ── 35 USC core patentability ─────────────────────────────────
            { rule: '35 USC 101', desc: 'Patent-eligible subject matter (Alice/Mayo)' },
            { rule: '35 USC 102', desc: 'Novelty / Prior art (AIA §102(a)(1), (a)(2))' },
            { rule: '35 USC 103', desc: 'Obviousness (Graham factors, KSR)' },
            { rule: '35 USC 112', desc: 'Spec. requirements: (a) written description/enablement, (b) definiteness, (f) MPF' },
            // ── Priority & benefit ────────────────────────────────────────
            { rule: '35 USC 119', desc: 'Foreign priority (Paris 12-month) and provisional §119(e)' },
            { rule: '35 USC 120', desc: 'Domestic benefit (continuation chain)' },
            { rule: '35 USC 121', desc: 'Restriction; divisional §121 safe harbor' },
            { rule: '35 USC 135', desc: 'AIA derivation proceedings' },
            { rule: '35 USC 141', desc: 'Appeals to Federal Circuit from PTAB' },
            // ── Post-grant ────────────────────────────────────────────────
            { rule: '35 USC 154', desc: 'Patent term (20 yrs from filing) + PTA (§154(b))' },
            { rule: '35 USC 156', desc: 'Patent Term Extension (PTE) — Hatch-Waxman' },
            { rule: '35 USC 251', desc: 'Reissue — broadening allowed within 2 years' },
            { rule: '35 USC 252', desc: 'Intervening rights (reissue/reexam)' },
            { rule: '35 USC 256', desc: 'Post-issue inventorship correction' },
            { rule: '35 USC 257', desc: 'Supplemental examination (immunity from IC)' },
            { rule: '35 USC 271', desc: 'Infringement (incl. §271(e) safe harbor for FDA)' },
            { rule: '35 USC 311–319', desc: 'Inter Partes Review (IPR); §315(e) estoppel' },
            { rule: '35 USC 321–329', desc: 'Post-Grant Review (PGR); §325(e) estoppel' },
            { rule: '35 USC 365', desc: 'PCT priority (§365(c) bypass continuation)' },
            { rule: '35 USC 371', desc: 'National stage of PCT applications (30-month)' },
          ].map((r) => (
            <div key={r.rule} className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50">
              <Badge variant="outline" className="font-mono text-[10px] flex-shrink-0 mt-0.5">{r.rule}</Badge>
              <span className="text-sm">{r.desc}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LSAT TAB — analogue of MPEPTab. High-yield question types,
// complete question-type directory, format reference, study tips.
// ═══════════════════════════════════════════════════════════════

const LSAT_HIGH_YIELD_LR = [
  { id: 'lr_strengthen', name: 'Strengthen', why: 'Most-tested LR type. ~12% per section — 6+ questions per LR test on average.' },
  { id: 'lr_weaken', name: 'Weaken', why: 'Mirror of Strengthen; same skill in reverse. ~10% per section.' },
  { id: 'lr_necessary_assumption', name: 'Necessary Assumption', why: '~10%. Use the negation test — if negating the answer destroys the argument, it\'s necessary.' },
  { id: 'lr_inference', name: 'Inference / Must Be True', why: '~10%. Stay inside the four corners of the stimulus; do not import outside knowledge.' },
  { id: 'lr_flaw', name: 'Flaw', why: '~10%. Memorise the standard flaw types (correlation/causation, equivocation, sampling, etc.).' },
  { id: 'lr_principle', name: 'Principle', why: '~7%. Bridge an abstract rule to a specific case in either direction.' },
];

const LSAT_HIGH_YIELD_RC = [
  { id: 'rc_detail', name: 'Detail / Specific Reference', why: 'Highest-frequency RC type (~25%). Send-back to the line cited — don\'t paraphrase from memory.' },
  { id: 'rc_inference', name: 'Inference', why: '~20%. The correct answer is one short step from the text — not a leap, but not a paraphrase.' },
  { id: 'rc_function', name: 'Function / Purpose / Role', why: '~15%. Why was X included? Examples support claims; quotations illustrate views; concessions soften.' },
];

const LSAT_STUDY_TIPS = [
  { tip: 'Time pressure is the exam.', detail: 'The content isn\'t hard in the abstract — it\'s hard at 1:25 per LR question and 1:20 per RC question. Drill timing relentlessly.' },
  { tip: 'Skip & flag, return later.', detail: 'No partial credit. If a Parallel Reasoning question is eating 4 minutes, flag and move on — you can come back if time permits.' },
  { tip: 'Diagram conditionals.', detail: 'A → B and its contrapositive (¬B → ¬A) are essential. Practice translating "only," "unless," "no" into conditionals automatically.' },
  { tip: 'For RC, read for structure first.', detail: 'Identify the main point, the author\'s attitude, and the role of each paragraph BEFORE attempting questions. The questions reward structural readers.' },
  { tip: 'Master the wrong-answer types.', detail: 'Out-of-scope, too-strong, half-right, opposite, irrelevant comparison — naming the wrong-answer pattern is faster than verifying the right one.' },
  { tip: 'Use LawHub PrepTests.', detail: 'LSAC PrepTests are the gold standard. The interface in LawHub matches the real exam — practise there for muscle memory.' },
  { tip: 'Track your error log.', detail: 'For every miss, write: question type, your wrong answer, the trap that hooked you, and the rule you\'ll use next time. Review weekly.' },
  { tip: 'Don\'t ignore Argumentative Writing.', detail: 'It\'s separate and unscored on 120–180 but law schools see it. Spend a few hours on the prompt format and rubric before test day.' },
];

const LSAT_FORMAT_REFERENCE = [
  { item: 'Scored sections', value: '3', detail: '2× Logical Reasoning (≈25 Qs / 35 min each) + 1× Reading Comprehension (≈27 Qs / 35 min)' },
  { item: 'Experimental section', value: '1', detail: 'Unscored, indistinguishable from a real LR or RC section. Treat every section as real.' },
  { item: 'Total test time', value: '~2h 20m', detail: '4 × 35-min sections + 10-min intermission after section 2' },
  { item: 'Score range', value: '120 – 180', detail: 'Median ~152, top 1% ≥175. Most T14 medians are 170+' },
  { item: 'Logic Games', value: 'REMOVED', detail: 'Analytical Reasoning eliminated August 2024. Don\'t spend time on it for the current LSAT.' },
  { item: 'Argumentative Writing', value: 'Separate', detail: 'Take-at-home, unscored on 120–180. Required at least once before reports issue.' },
  { item: 'Retakes', value: '3 / cycle', detail: 'Maximum 3 LSAT attempts in a single testing cycle (Aug–Jun); 7 in a lifetime; 5 in 5 years' },
];

function LSATTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const allTypes = LSAT_QUESTION_TYPES;
  const filteredTypes = searchQuery.trim()
    ? allTypes.filter(
        (q) =>
          q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.section.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : allTypes;

  return (
    <div className="space-y-6">
      {/* Header / LawHub access card */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 border-purple-200 dark:border-purple-900">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Library className="h-5 w-5 text-purple-600" />
              LSAT Question Type Reference
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Current LSAT format (post-Aug 2024): 2× Logical Reasoning + 1× Reading Comprehension.
              Logic Games is REMOVED. The LSAT is &quot;open-LawHub&quot; only for practice — at the real
              exam you have no reference material, so practice the patterns until they&apos;re automatic.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="https://lawhub.lsac.org/preptests" target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="default" className="gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" /> LawHub PrepTests
              </Button>
            </a>
            <a href="https://lawhub.lsac.org/free" target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" /> LawHub Free
              </Button>
            </a>
          </div>
        </div>
      </Card>

      {/* LSAT Format Reference */}
      <Card className="p-5">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Hash className="h-5 w-5 text-purple-500" /> LSAT Format Reference (R-2024+)
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {LSAT_FORMAT_REFERENCE.map((r) => (
            <div key={r.item} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
              <Badge variant="outline" className="font-mono text-[10px] flex-shrink-0 mt-0.5">{r.value}</Badge>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{r.item}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{r.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* High-Yield Question Types — LR */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" /> High-Yield Logical Reasoning Types
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {LSAT_HIGH_YIELD_LR.map((item) => (
            <a key={item.id} href="https://www.lsac.org/lsat/prepare/types-lsat-questions" target="_blank" rel="noopener noreferrer">
              <Card className="p-4 hover:shadow-md transition-all cursor-pointer border-l-4 border-l-amber-400 h-full">
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.why}</p>
              </Card>
            </a>
          ))}
        </div>
      </div>

      {/* High-Yield RC Types */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Zap className="h-5 w-5 text-orange-500" /> High-Yield Reading Comprehension Types
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {LSAT_HIGH_YIELD_RC.map((item) => (
            <a key={item.id} href="https://www.lsac.org/lsat/prepare/types-lsat-questions/reading-comprehension" target="_blank" rel="noopener noreferrer">
              <Card className="p-4 hover:shadow-md transition-all cursor-pointer border-l-4 border-l-orange-400 h-full">
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.why}</p>
              </Card>
            </a>
          ))}
        </div>
      </div>

      {/* Complete Question Type Directory */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Complete Question Type Directory</h3>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search types..."
              className="pl-9 pr-3 py-1.5 border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="space-y-1">
          {filteredTypes.map((q) => (
            <a key={q.id} href={q.url || 'https://lawhub.lsac.org/preptests'} target="_blank" rel="noopener noreferrer">
              <Card className="p-3 hover:bg-accent/50 transition-colors cursor-pointer flex items-center gap-3">
                <div className="flex-shrink-0 w-16 text-center">
                  <Badge variant="outline" className="font-mono text-xs">{q.section} · {q.frequency}%</Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{q.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{q.description}</p>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              </Card>
            </a>
          ))}
        </div>
      </div>

      {/* Study Tips */}
      <Card className="p-6 bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-purple-600" /> LSAT Study Tips
        </h3>
        <div className="space-y-2 text-sm">
          {LSAT_STUDY_TIPS.map((s, i) => (
            <p key={s.tip}><strong>{i + 1}. {s.tip}</strong> {s.detail}</p>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// READ LESSONS TAB
// ═══════════════════════════════════════════════════════════════

function ReadLessonsTab({ examType }: { examType: string }) {
  const curriculum = getCurriculum(examType);
  const totalTopics = getTotalTopics(examType);
  const [expandedSection, setExpandedSection] = useState<string | null>(curriculum[0]?.sectionId || null);
  const [activeTopic, setActiveTopic] = useState<any>(null);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [expandedLessonSections, setExpandedLessonSections] = useState<Set<string>>(new Set());
  const [readSections, setReadSections] = useState<Set<string>>(new Set());

  // Lazy-loaded course content for the active exam (P3-C / task #62).
  // Until the dynamic import resolves the pack returns nulls so the
  // lesson reader shows the generic placeholder; once loaded the
  // syllabus badge ("has content") and the rich lesson body switch on.
  const [coursePack, setCoursePack] = useState<CoursePack>({
    get: () => null,
    has: () => false,
  });
  useEffect(() => {
    let cancelled = false;
    loadExamCourse(examType).then((pack) => {
      if (!cancelled) setCoursePack(pack);
    });
    return () => { cancelled = true; };
  }, [examType]);

  const toggleLessonSection = (sectionId: string) => {
    setExpandedLessonSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId); else next.add(sectionId);
      return next;
    });
    // Mark as read when expanded
    setReadSections(prev => new Set(prev).add(sectionId));
  };

  const expandAllSections = (sectionIds: string[]) => {
    setExpandedLessonSections(new Set(sectionIds));
    setReadSections(prev => {
      const next = new Set(prev);
      sectionIds.forEach(id => next.add(id));
      return next;
    });
  };

  const collapseAllSections = () => setExpandedLessonSections(new Set());

  const toggleComplete = (topicId: string) => {
    setCompletedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) next.delete(topicId); else next.add(topicId);
      return next;
    });
  };

  const completedCount = completedTopics.size;

  if (activeTopic) {
    const section = curriculum.find((s) => s.topics.some((t) => t.id === activeTopic.id));
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setActiveTopic(null)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to syllabus
        </Button>

        <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-8 py-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-white/20 text-white border-0 text-xs backdrop-blur-sm">{section?.sectionName}</Badge>
              <Badge className="bg-white/20 text-white border-0 text-xs backdrop-blur-sm flex items-center gap-1">
                <Clock className="h-3 w-3" /> {activeTopic.readTimeMin} min read
              </Badge>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">{activeTopic.title}</h2>
            <p className="text-white/80 text-sm leading-relaxed">{activeTopic.summary}</p>
          </div>
          <div className="p-6 sm:p-8">

          {examType === 'PATENT_BAR' && PATENT_TOPIC_ANCHORS[activeTopic.id] && (
            <Card className="p-4 mb-6 bg-amber-50/60 dark:bg-amber-950/25 border-amber-200 dark:border-amber-900">
              <p className="text-xs font-semibold text-amber-900 dark:text-amber-100 mb-2">Topic map → MPEP &amp; statutes</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {PATENT_TOPIC_ANCHORS[activeTopic.id].mpepChapters.map((ch) => (
                  <Badge key={ch} variant="secondary" className="font-mono text-[10px]">MPEP Ch. {ch}</Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mb-1">
                <span className="font-medium text-foreground">Statutes / rules: </span>
                {PATENT_TOPIC_ANCHORS[activeTopic.id].statutes.join(' · ')}
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-200">
                <span className="font-medium">Drill focus: </span>
                {PATENT_TOPIC_ANCHORS[activeTopic.id].drillHint}
              </p>
            </Card>
          )}

          {(() => {
              // Rich course data via the lazy per-exam pack. The page
              // renders one exam at a time so a single .get() suffices —
              // no need to walk all 8 modules like the old eager chain.
              const courseData = coursePack.get(activeTopic.id);

              // Custom ReactMarkdown components for beautiful table + content rendering
              const mdComponents = {
                table: ({ children, ...props }: any) => (
                  <div className="my-5 overflow-x-auto rounded-xl border-2 border-indigo-100 dark:border-indigo-900/60 shadow-sm">
                    <table className="w-full text-sm border-collapse" {...props}>{children}</table>
                  </div>
                ),
                thead: ({ children, ...props }: any) => (
                  <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/60 dark:to-purple-950/60" {...props}>{children}</thead>
                ),
                th: ({ children, ...props }: any) => (
                  <th className="px-4 py-3 text-left text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider border-b-2 border-indigo-200 dark:border-indigo-800" {...props}>{children}</th>
                ),
                td: ({ children, ...props }: any) => (
                  <td className="px-4 py-3 text-sm border-b border-gray-100 dark:border-gray-800" {...props}>{children}</td>
                ),
                tr: ({ children, ...props }: any) => (
                  <tr className="hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-colors" {...props}>{children}</tr>
                ),
                h2: ({ children, ...props }: any) => (
                  <h2 className="text-xl font-bold mt-8 mb-4 pb-2 border-b-2 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-100" {...props}>{children}</h2>
                ),
                h3: ({ children, ...props }: any) => (
                  <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2" {...props}>
                    <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500 flex-shrink-0" />
                    {children}
                  </h3>
                ),
                h4: ({ children, ...props }: any) => (
                  <h4 className="text-base font-semibold mt-5 mb-2 text-gray-800 dark:text-gray-200" {...props}>{children}</h4>
                ),
                ul: ({ children, ...props }: any) => (
                  <ul className="my-3 space-y-1.5 list-none pl-0" {...props}>{children}</ul>
                ),
                li: ({ children, ...props }: any) => (
                  <li className="flex items-start gap-2.5 text-sm leading-relaxed" {...props}>
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500 flex-shrink-0" />
                    <span className="flex-1">{children}</span>
                  </li>
                ),
                strong: ({ children, ...props }: any) => (
                  <strong className="font-semibold text-gray-900 dark:text-gray-100" {...props}>{children}</strong>
                ),
                p: ({ children, ...props }: any) => (
                  <p className="my-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300" {...props}>{children}</p>
                ),
                hr: (props: any) => (
                  <hr className="my-6 border-none h-px bg-gradient-to-r from-transparent via-indigo-200 dark:via-indigo-800 to-transparent" {...props} />
                ),
              };

              if (courseData) {
                const allSectionIds = courseData.sections.map(s => s.id);
                const readCount = courseData.sections.filter(s => readSections.has(s.id)).length;
                const sectionProgress = courseData.sections.length > 0 ? Math.round((readCount / courseData.sections.length) * 100) : 0;

                return (
                  <div className="space-y-6">
                    {/* Topic Overview Card */}
                    <div className="relative overflow-hidden rounded-2xl border-2 border-indigo-100 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 dark:from-indigo-950/40 dark:via-gray-950 dark:to-purple-950/40 p-6 shadow-sm">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-200/30 to-transparent dark:from-indigo-800/20 rounded-bl-full" />
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                          <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 border-0 text-xs">
                              {courseData.domainWeight} Exam Weight
                            </Badge>
                            <span className="text-xs text-muted-foreground">{courseData.sections.length} sections</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{courseData.overview}</p>
                        </div>
                      </div>
                      {/* Section Progress */}
                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex-1 h-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700" style={{ width: `${sectionProgress}%` }} />
                        </div>
                        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{readCount}/{courseData.sections.length} read</span>
                      </div>
                    </div>

                    {/* Expand/Collapse Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => expandAllSections(allSectionIds)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors font-medium"
                      >
                        Expand All
                      </button>
                      <button
                        onClick={collapseAllSections}
                        className="text-xs px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors font-medium"
                      >
                        Collapse All
                      </button>
                    </div>

                    {/* Sections - Collapsible Accordion */}
                    <div className="space-y-3">
                    {courseData.sections.map((section, sIdx) => {
                      const isOpen = expandedLessonSections.has(section.id);
                      const isRead = readSections.has(section.id);
                      const hasQuiz = section.quiz && section.quiz.length > 0;
                      const hasExamTip = !!section.examTip;

                      return (
                        <div
                          key={section.id}
                          className={`rounded-2xl border-2 overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md ${
                            isOpen
                              ? 'border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-950'
                              : isRead
                              ? 'border-green-200/60 dark:border-green-900/40 bg-green-50/30 dark:bg-green-950/10'
                              : 'border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80'
                          }`}
                        >
                          {/* Section Header (clickable) */}
                          <button
                            onClick={() => toggleLessonSection(section.id)}
                            className="w-full flex items-center gap-4 p-4 sm:p-5 text-left hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all duration-200"
                          >
                            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm transition-all duration-300 ${
                              isRead
                                ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white'
                                : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                            }`}>
                              {isRead ? <CheckCircle2 className="h-4 w-4" /> : sIdx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 truncate">{section.title}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                {hasExamTip && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                                    <Lightbulb className="h-2.5 w-2.5" /> Exam Tip
                                  </span>
                                )}
                                {hasQuiz && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                                    <BrainCircuit className="h-2.5 w-2.5" /> Quiz
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-transform duration-300 ${
                              isOpen ? 'rotate-90 bg-indigo-100 dark:bg-indigo-900' : 'bg-gray-100 dark:bg-gray-800'
                            }`}>
                              <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            </div>
                          </button>

                          {/* Section Content (collapsible) */}
                          {isOpen && (
                            <div className="px-5 pb-6 pt-1 border-t border-gray-100 dark:border-gray-800">
                              <div className="prose prose-sm dark:prose-invert max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                                  {section.content}
                                </ReactMarkdown>
                              </div>

                              {/* Exam Tip */}
                              {section.examTip && (
                                <div className="mt-6 rounded-xl border-2 border-amber-200 dark:border-amber-800/60 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 p-5 shadow-sm">
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="flex-shrink-0 h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
                                      <Lightbulb className="h-4 w-4 text-white" />
                                    </div>
                                    <h4 className="font-bold text-amber-900 dark:text-amber-100 text-sm uppercase tracking-wide">Exam Tip</h4>
                                  </div>
                                  <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed pl-12">{section.examTip}</p>
                                </div>
                              )}

                              {/* Important Note */}
                              {section.importantNote && (
                                <div className="mt-5 rounded-xl border-2 border-blue-200 dark:border-blue-800/60 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/30 p-5 shadow-sm">
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="flex-shrink-0 h-9 w-9 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-sm">
                                      <AlertCircle className="h-4 w-4 text-white" />
                                    </div>
                                    <h4 className="font-bold text-blue-900 dark:text-blue-100 text-sm uppercase tracking-wide">Important</h4>
                                  </div>
                                  <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed pl-12">{section.importantNote}</p>
                                </div>
                              )}

                              {/* Inline Quiz */}
                              {section.quiz && section.quiz.length > 0 && (
                                <div className="mt-6">
                                  <LessonQuiz questions={section.quiz} title={`${section.title} — Quick Check`} />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    </div>

                    {/* Key Takeaways */}
                    {courseData.keyTakeaways && courseData.keyTakeaways.length > 0 && (
                      <div className="rounded-2xl border-2 border-green-200 dark:border-green-800/60 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/30 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
                            <Trophy className="h-5 w-5 text-white" />
                          </div>
                          <h3 className="font-bold text-green-900 dark:text-green-100 text-base">Key Takeaways</h3>
                        </div>
                        <ul className="space-y-3 pl-1">
                          {courseData.keyTakeaways.map((takeaway, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-green-800 dark:text-green-200">
                              <div className="flex-shrink-0 mt-0.5 h-5 w-5 rounded-full bg-green-500/20 dark:bg-green-500/30 flex items-center justify-center">
                                <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                              </div>
                              <span className="leading-relaxed">{takeaway}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Supplementary SY0-701 deep-dive notes (Security+ only; */}
                    {/* renders beneath the structured course-data lesson).    */}
                    {(() => {
                      const deep = getSecurityPlusLessonContent(activeTopic.id);
                      if (!deep) return null;
                      return (
                        <details className="mt-6 rounded-2xl border-2 border-indigo-200 dark:border-indigo-900 bg-indigo-50/40 dark:bg-indigo-950/20 overflow-hidden">
                          <summary className="cursor-pointer select-none px-5 py-4 font-semibold text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                            <BookOpen className="h-4 w-4" /> In-Depth Notes — SY0-701 deep dive
                          </summary>
                          <div className="px-5 pb-5 prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                              {deep}
                            </ReactMarkdown>
                          </div>
                        </details>
                      );
                    })()}
                  </div>
                );
              }

              // Fall back to markdown lesson content
              const lessonContent = getCISSPLessonContent(activeTopic.id);
              if (lessonContent) {
                return (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                      {lessonContent}
                    </ReactMarkdown>
                  </div>
                );
              }

              // Final fallback: generic placeholder
              return (
                <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-8 text-center">
                  <BookOpen className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{activeTopic.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{activeTopic.summary}</p>
                  <p className="text-xs text-muted-foreground">Content is being prepared for this topic.</p>
                </div>
              );
            })()}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            <Button
              variant={completedTopics.has(activeTopic.id) ? "default" : "outline"}
              onClick={() => toggleComplete(activeTopic.id)}
              className={`gap-2 rounded-xl ${completedTopics.has(activeTopic.id) ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 border-0 text-white' : ''}`}
            >
              <CheckCircle2 className="h-4 w-4" />
              {completedTopics.has(activeTopic.id) ? 'Completed' : 'Mark as Complete'}
            </Button>

            {/* Next topic */}
            {(() => {
              const allTopics = curriculum.flatMap((s) => s.topics);
              const idx = allTopics.findIndex((t) => t.id === activeTopic.id);
              const next = idx >= 0 && idx < allTopics.length - 1 ? allTopics[idx + 1] : null;
              return next ? (
                <Button variant="outline" onClick={() => { setActiveTopic(next); window.scrollTo(0, 0); }} className="gap-2 rounded-xl">
                  Next: {next.title} <ArrowRight className="h-4 w-4" />
                </Button>
              ) : null;
            })()}
          </div>
          </div>{/* close p-6 sm:p-8 */}
        </div>{/* close outer card */}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <div className="rounded-2xl border-2 border-indigo-100 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 dark:from-indigo-950/40 dark:via-gray-950 dark:to-purple-950/40 p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <BookMarked className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">Reading Progress</span>
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{completedCount}/{totalTopics} lessons</span>
            </div>
            <div className="w-full h-2.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700" style={{ width: `${totalTopics > 0 ? (completedCount / totalTopics) * 100 : 0}%` }} />
            </div>
          </div>
        </div>
        {completedCount === totalTopics && totalTopics > 0 && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-medium">
            <Trophy className="h-4 w-4" /> All lessons complete!
          </div>
        )}
      </div>

      {/* Curriculum */}
      {curriculum.length === 0 ? (
        <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-12 text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-700" />
          <h3 className="text-lg font-semibold mb-2">Curriculum coming soon</h3>
          <p className="text-muted-foreground">Reading lessons for {examType} are being prepared.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {curriculum.map((section, secIdx) => {
            const isExpanded = expandedSection === section.sectionId;
            const sectionCompleted = section.topics.filter((t) => completedTopics.has(t.id)).length;
            const sectionProgress = section.topics.length > 0 ? Math.round((sectionCompleted / section.topics.length) * 100) : 0;
            const isDone = sectionCompleted === section.topics.length && section.topics.length > 0;

            return (
              <div key={section.sectionId} className={`rounded-2xl border-2 overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md ${
                isDone
                  ? 'border-green-200 dark:border-green-900/50 bg-green-50/30 dark:bg-green-950/10'
                  : isExpanded
                  ? 'border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-950'
                  : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950'
              }`}>
                <button
                  onClick={() => setExpandedSection(isExpanded ? null : section.sectionId)}
                  className="w-full p-5 flex items-center justify-between hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all duration-200 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex-shrink-0 h-11 w-11 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm transition-all ${
                      isDone
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white'
                        : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                    }`}>
                      {isDone ? <CheckCircle2 className="h-5 w-5" /> : secIdx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-gray-100">{section.sectionName}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">{section.topics.length} lessons</span>
                        <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${isDone ? 'bg-green-500' : 'bg-indigo-500'}`} style={{ width: `${sectionProgress}%` }} />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">{sectionCompleted}/{section.topics.length}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {isDone && (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 border-0 text-xs">Complete</Badge>
                    )}
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-transform duration-300 ${
                      isExpanded ? 'rotate-90 bg-indigo-100 dark:bg-indigo-900' : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-100 dark:border-gray-800">
                    {section.topics.map((topic, i) => {
                      const done = completedTopics.has(topic.id);
                      const hasContent = coursePack.has(topic.id);
                      return (
                        <div
                          key={topic.id}
                          className="flex items-center gap-4 px-5 py-4 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all duration-200 cursor-pointer border-b border-gray-50 dark:border-gray-900 last:border-b-0"
                          onClick={() => setActiveTopic(topic)}
                        >
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleComplete(topic.id); }}
                            aria-label={done ? `Mark ${topic.title} as incomplete` : `Mark ${topic.title} as complete`}
                            className={`flex-shrink-0 h-8 w-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                              done
                                ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-sm'
                                : 'border-2 border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
                            }`}
                          >
                            {done && <CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
                            {!done && <span className="text-xs font-bold text-gray-400 dark:text-gray-500">{i + 1}</span>}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold ${done ? 'text-gray-400 dark:text-gray-600 line-through' : 'text-gray-900 dark:text-gray-100'}`}>{topic.title}</p>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">{topic.summary}</p>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            {hasContent && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-medium">
                                Full Content
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {topic.readTimeMin}m
                            </span>
                            <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LESSONS TAB (Video)
// ═══════════════════════════════════════════════════════════════

// Real clips can be well under a minute — show m:ss, not a rounded "0 min".
function fmtLessonDur(s?: number): string | null {
  if (!s || s <= 0) return null;
  const m = Math.floor(s / 60);
  const sec = Math.round(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}

function LessonsTab({ examType }: { examType: string; sections: any[] }) {
  const [lessons, setLessons] = useState<Record<string, any[]>>({});
  const [progress] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Per-lesson completion lives in api-core /me/progress (one row per
  // (user, exam, topic)); a completed video lesson is a progress row whose
  // topic_id equals the lesson id. This also feeds mastery analytics.
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      try {
        const [lessonData, userProgress] = await Promise.all([
          apiClient.getLessons(examType).catch(() => null),
          apiClient.getUserProgress(examType).catch(() => [] as any[]),
        ]);
        if (lessonData?.sections && Object.keys(lessonData.sections).length > 0) {
          setLessons(lessonData.sections);
        } else if (examType === 'CISSP') {
          // Fallback: use static CISSP video lesson data
          setLessons(getCISSPVideoLessons());
        }
        if (Array.isArray(userProgress)) {
          setCompletedIds(new Set(userProgress.map((r: any) => r.topic_id)));
        }
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, [examType]);

  const allLessons = Object.values(lessons).flat();
  const hasLessons = allLessons.length > 0;
  const completedCount = allLessons.filter((l: any) => completedIds.has(l.id)).length;
  // Derived progress for the rail + list header (the old python lessons/progress
  // endpoint never existed — this is computed from real /me/progress rows).
  const progressView = hasLessons
    ? { completed: completedCount, total_lessons: allLessons.length, completion_percent: Math.round((completedCount / allLessons.length) * 100) }
    : progress;

  const markComplete = async (lesson: any) => {
    if (!lesson?.id || completedIds.has(lesson.id)) return;
    setCompletedIds((prev) => new Set(prev).add(lesson.id)); // optimistic
    try {
      await apiClient.recordProgress({
        exam_type: examType,
        topic_id: lesson.id,
        is_correct: true,
        seconds: lesson.duration_seconds || undefined,
      });
    } catch { /* keep optimistic state; next load re-syncs */ }
  };

  const activeIndex = activeLesson ? allLessons.findIndex((l: any) => l.id === activeLesson.id) : -1;
  const prevLesson = activeIndex > 0 ? allLessons[activeIndex - 1] : null;
  const nextLesson = activeIndex >= 0 && activeIndex < allLessons.length - 1 ? allLessons[activeIndex + 1] : null;

  if (activeLesson) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => setActiveLesson(null)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to lessons
        </Button>
        <div className="flex gap-4">
          <LessonCurriculumRail
            lessons={lessons}
            activeId={activeLesson.id}
            onSelect={setActiveLesson}
            progress={progressView}
            completedIds={completedIds}
          />
          <div className="min-w-0 flex-1">
            <Card className="overflow-hidden">
              <LessonVideoPlayer
                videoUrl={activeLesson.video_url}
                title={activeLesson.title}
                onEnded={() => markComplete(activeLesson)}
              />
              <div className="p-6 space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold">{activeLesson.title}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {[
                        activeLesson.section,
                        fmtLessonDur(activeLesson.duration_seconds),
                        activeLesson.domain ? `Domain ${activeLesson.domain}` : null,
                      ].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  {completedIds.has(activeLesson.id) ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" /> Completed
                    </span>
                  ) : (
                    <Button variant="outline" size="sm" className="gap-1.5" onClick={() => markComplete(activeLesson)}>
                      <CheckCircle2 className="h-4 w-4" /> Mark complete
                    </Button>
                  )}
                </div>
                <VideoLessonTabs lesson={activeLesson} />
                {/* Prev / next lesson navigation */}
                <div className="flex items-center justify-between border-t pt-4">
                  <Button
                    variant="ghost"
                    className="gap-1 text-muted-foreground disabled:opacity-40"
                    disabled={!prevLesson}
                    onClick={() => prevLesson && setActiveLesson(prevLesson)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="max-w-[16rem] truncate">{prevLesson ? prevLesson.title : 'First lesson'}</span>
                  </Button>
                  <Button
                    className="gap-1 disabled:opacity-40"
                    disabled={!nextLesson}
                    onClick={() => nextLesson && setActiveLesson(nextLesson)}
                  >
                    <span className="max-w-[16rem] truncate">{nextLesson ? nextLesson.title : 'Last lesson'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      {progressView && progressView.total_lessons > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Course Progress</span>
            <span className="text-sm text-muted-foreground">{progressView.completed}/{progressView.total_lessons} lessons</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progressView.completion_percent}%` }} />
          </div>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : !hasLessons ? (
        <Card className="p-12 text-center">
          <Video className="h-16 w-16 mx-auto mb-4 text-muted-foreground/40" />
          <h3 className="text-lg font-semibold mb-2">No lessons yet</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Video lessons for {examType} are being prepared. Check back soon, or start with the QBank to test your knowledge.
          </p>
        </Card>
      ) : (
        // Render straight from the lessons record — its keys ARE the display
        // group names (e.g. "Domain 1 · Security & Risk Management"), so this
        // works for any exam's grouping without a separate section-id lookup.
        Object.entries(lessons).map(([groupName, sectionLessons]) => {
          if (!sectionLessons || sectionLessons.length === 0) return null;
          return (
            <div key={groupName}>
              <h3 className="font-semibold text-lg mb-3">{groupName}</h3>
              <div className="grid gap-3">
                {sectionLessons.map((lesson: any) => (
                  <Card
                    key={lesson.id}
                    className="p-4 hover:shadow-md transition-all cursor-pointer flex items-center gap-4"
                    onClick={async () => {
                      try {
                        const full = await apiClient.getLesson(lesson.id);
                        setActiveLesson(full);
                      } catch {
                        setActiveLesson(lesson);
                      }
                    }}
                  >
                    <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      {completedIds.has(lesson.id)
                        ? <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                        : <PlayCircle className="h-6 w-6 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{lesson.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {[lesson.topic, fmtLessonDur(lesson.duration_seconds)].filter(Boolean).join(' · ') || 'Video'}
                      </p>
                    </div>
                    {lesson.is_free && <Badge variant="secondary">Free</Badge>}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Card>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// NOTES TAB
// ═══════════════════════════════════════════════════════════════

function NotesTab({ examType, sections }: { examType: string; sections: any[] }) {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', content: '', section_id: '', topic: '', color_label: 'yellow' });

  const colors = ['yellow', 'blue', 'green', 'red', 'purple'];
  const colorMap: Record<string, string> = {
    yellow: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800',
    blue: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800',
    green: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
    red: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
    purple: 'bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800',
  };

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.getNotes(examType);
      setNotes(data.notes || []);
    } catch { setNotes([]); }
    setLoading(false);
  }, [examType]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const saveNote = async () => {
    if (!form.content.trim()) return;
    try {
      if (editingId) {
        await apiClient.updateNote(editingId, form);
      } else {
        await apiClient.createNote({ exam_type: examType, ...form });
      }
      setShowCreate(false);
      setEditingId(null);
      setForm({ title: '', content: '', section_id: '', topic: '', color_label: 'yellow' });
      fetchNotes();
    } catch { /* ignore */ }
  };

  const deleteNote = async (id: string) => {
    try {
      await apiClient.deleteNote(id);
      fetchNotes();
    } catch { /* ignore */ }
  };

  const togglePin = async (note: any) => {
    try {
      await apiClient.updateNote(note.id, { is_pinned: !note.is_pinned });
      fetchNotes();
    } catch { /* ignore */ }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{notes.length} note{notes.length !== 1 ? 's' : ''}</p>
        <Button onClick={() => { setShowCreate(true); setEditingId(null); setForm({ title: '', content: '', section_id: '', topic: '', color_label: 'yellow' }); }}>
          <Plus className="h-4 w-4 mr-2" /> New Note
        </Button>
      </div>

      {/* Create/Edit form */}
      {showCreate && (
        <Card className="p-4 space-y-3 border-2 border-primary">
          <input
            placeholder="Title (optional)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <textarea
            placeholder="Write your note..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={5}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
          <div className="flex items-center gap-3">
            <select
              value={form.section_id}
              onChange={(e) => setForm({ ...form, section_id: e.target.value })}
              className="px-3 py-1.5 border rounded-lg text-sm"
            >
              <option value="">All sections</option>
              {sections.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <div className="flex gap-1">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setForm({ ...form, color_label: c })}
                  aria-label={`${c} color label`}
                  className={`w-6 h-6 rounded-full border-2 ${form.color_label === c ? 'border-foreground scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c === 'yellow' ? '#fef08a' : c === 'blue' ? '#bfdbfe' : c === 'green' ? '#bbf7d0' : c === 'red' ? '#fecaca' : '#e9d5ff' }}
                />
              ))}
            </div>
            <div className="ml-auto flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => { setShowCreate(false); setEditingId(null); }}>Cancel</Button>
              <Button size="sm" onClick={saveNote}>{editingId ? 'Update' : 'Save'}</Button>
            </div>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : notes.length === 0 && !showCreate ? (
        <Card className="p-12 text-center">
          <StickyNote className="h-16 w-16 mx-auto mb-4 text-muted-foreground/40" />
          <h3 className="text-lg font-semibold mb-2">No notes yet</h3>
          <p className="text-muted-foreground mb-4">Create notes while studying to review later.</p>
          <Button onClick={() => setShowCreate(true)}><Plus className="h-4 w-4 mr-2" /> Create your first note</Button>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Card key={note.id} className={`p-4 border ${colorMap[note.color_label] || colorMap.yellow}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  {note.title && <p className="font-semibold text-sm truncate">{note.title}</p>}
                  {note.section_id && <p className="text-xs text-muted-foreground">{note.section_id}</p>}
                </div>
                <div className="flex gap-1 ml-2">
                  <button onClick={() => togglePin(note)} aria-label={note.is_pinned ? 'Unpin this note' : 'Pin this note'} className={`p-1 rounded ${note.is_pinned ? 'text-primary' : 'text-muted-foreground/40 hover:text-muted-foreground'}`}>
                    <Pin className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button onClick={() => { setEditingId(note.id); setForm({ title: note.title || '', content: note.content, section_id: note.section_id || '', topic: note.topic || '', color_label: note.color_label || 'yellow' }); setShowCreate(true); }} aria-label="Edit this note" className="p-1 text-muted-foreground/40 hover:text-muted-foreground">
                    <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button onClick={() => deleteNote(note.id)} aria-label="Delete this note" className="p-1 text-muted-foreground/40 hover:text-red-500">
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <p className="text-sm whitespace-pre-wrap line-clamp-6">{note.content}</p>
              <p className="text-xs text-muted-foreground mt-3">{new Date(note.updated_at).toLocaleDateString()}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FLASHCARDS TAB
// ═══════════════════════════════════════════════════════════════

function FlashcardsTab({ examType, sections }: { examType: string; sections: any[] }) {
  const isCISSP = examType === 'CISSP';
  const isSecPlus = examType === 'SECURITY_PLUS';
  const isPatentBar = examType === 'PATENT_BAR';
  const isFEEE = examType === 'FE_EE';
  const isFEME = examType === 'FE_ME';
  const isPEEE = examType === 'PE_EE';
  const isMCAT = examType === 'MCAT';
  const isLSAT = examType === 'LSAT';
  const isGRE = examType === 'GRE';
  const isSAT = examType === 'SAT';
  const isGMAT = examType === 'GMAT';
  const hasFlashcards = isCISSP || isSecPlus || isPatentBar || isFEEE || isFEME || isPEEE || isMCAT || isLSAT || isGRE || isSAT || isGMAT;
  const [view, setView] = useState<'home' | 'study' | 'create'>('home');
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [shuffled, setShuffled] = useState(false);

  // Study state
  const [deck, setDeck] = useState<any[]>([]);
  const [deckIndex, setDeckIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ seen: 0, know: 0, dontKnow: 0 });
  const [knownCards, setKnownCards] = useState<Set<number>>(new Set());

  // Get filtered cards
  const allCards = isCISSP
    ? getCISSPFlashcards(activeDomain || undefined)
    : isSecPlus
      ? getSecurityPlusFlashcards(activeDomain || undefined)
      : isPatentBar
        ? getPatentBarFlashcards(activeDomain || undefined)
        : isFEEE
          ? getFEEEFlashcards(activeDomain || undefined)
          : isFEME
            ? getFMEFlashcards(activeDomain || undefined)
            : isPEEE
              ? getPEEEFlashcards(activeDomain || undefined)
              : isMCAT
                ? getMCATFlashcards(activeDomain || undefined)
                : isLSAT
                  ? (activeDomain ? LSAT_FLASHCARDS.filter((c) => c.domain === activeDomain) : LSAT_FLASHCARDS)
                  : isGRE
                    ? getGREFlashcards(activeDomain || undefined)
                    : isSAT
                      ? getSATFlashcards(activeDomain || undefined)
                      : isGMAT
                        ? getGMATFlashcards(activeDomain || undefined)
                        : [];
  const filteredCards = allCards.filter(c => {
    if (activeCategory && c.category !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.front.toLowerCase().includes(q) || c.back.toLowerCase().includes(q);
    }
    return true;
  });

  const domainCounts = isCISSP
    ? CISSP_FLASHCARD_DOMAINS
    : isSecPlus
      ? SECPLUS_FLASHCARD_DOMAINS
      : isPatentBar
        ? PATENT_BAR_FLASHCARD_DOMAINS
        : isFEEE
          ? FEEE_FLASHCARD_DOMAINS
          : isFEME
            ? FME_FLASHCARD_DOMAINS
            : isPEEE
              ? PEEE_FLASHCARD_DOMAINS
              : isMCAT
                ? MCAT_FLASHCARD_DOMAINS
                : isLSAT
                  ? LSAT_FLASHCARD_DOMAINS
                  : isGRE
                    ? GRE_FLASHCARD_DOMAINS
                    : isSAT
                      ? SAT_FLASHCARD_DOMAINS
                      : isGMAT
                        ? GMAT_FLASHCARD_DOMAINS
                        : [];
  const flashcardCount = isCISSP
    ? CISSP_FLASHCARD_COUNT
    : isSecPlus
      ? SECPLUS_FLASHCARD_COUNT
      : isPatentBar
        ? PATENT_BAR_FLASHCARD_COUNT
        : isFEEE
          ? FEEE_FLASHCARD_COUNT
          : isFEME
            ? FME_FLASHCARD_COUNT
            : isPEEE
              ? PEEE_FLASHCARD_COUNT
              : isMCAT
                ? MCAT_FLASHCARD_COUNT
                : isLSAT
                  ? LSAT_FLASHCARDS.length
                  : isGRE
                    ? GRE_FLASHCARD_COUNT
                    : isSAT
                      ? SAT_FLASHCARD_COUNT
                      : isGMAT
                        ? GMAT_FLASHCARD_COUNT
                        : 0;
  const flashcardTitle = isCISSP
    ? 'CISSP Flashcard Deck'
    : isSecPlus
      ? 'Security+ Flashcard Deck'
      : isPatentBar
        ? 'Patent Bar Flashcard Deck'
        : isFEEE
          ? 'FE Electrical & Computer Flashcard Deck'
          : isFEME
            ? 'FE Mechanical Engineering Flashcard Deck'
            : isPEEE
              ? 'PE Electrical & Computer (Power) Flashcard Deck'
              : isMCAT
                ? 'MCAT Flashcard Deck'
                : isLSAT
                  ? 'LSAT Flashcard Deck'
                  : isGRE
                    ? 'GRE Flashcard Deck'
                    : isSAT
                      ? 'SAT Flashcard Deck'
                      : isGMAT
                        ? 'GMAT Flashcard Deck'
                        : 'Flashcard Deck';
  const flashcardSubtitle = isCISSP
    ? `${CISSP_FLASHCARD_COUNT.toLocaleString()} cards across all 8 domains + extras`
    : isSecPlus
      ? `${SECPLUS_FLASHCARD_COUNT.toLocaleString()} cards across all 5 domains + exam tips`
      : isPatentBar
        ? `${PATENT_BAR_FLASHCARD_COUNT.toLocaleString()} cards across Parts 1–8 + exam traps`
        : isFEEE
          ? `${FEEE_FLASHCARD_COUNT.toLocaleString()} cards across all 18 EE topics + formulas`
          : isFEME
            ? `${FME_FLASHCARD_COUNT.toLocaleString()} cards across all 16 ME topics + formulas`
            : isPEEE
              ? `${PEEE_FLASHCARD_COUNT.toLocaleString()} cards across all 10 power sections + formulas`
              : isMCAT
                ? `${MCAT_FLASHCARD_COUNT.toLocaleString()} cards across all 4 MCAT sections + formulas`
                : isGRE
                  ? `${GRE_FLASHCARD_COUNT.toLocaleString()} cards across Quant, Verbal, Vocab & Writing`
                  : isSAT
                    ? `${SAT_FLASHCARD_COUNT.toLocaleString()} cards across Reading & Writing and Math`
                    : isGMAT
                      ? `${GMAT_FLASHCARD_COUNT.toLocaleString()} cards across Quant, Verbal & Data Insights`
                      : '';

  const startStudy = (cards: any[]) => {
    if (cards.length === 0) return;
    const studyDeck = shuffled ? shuffle(cards) : cards;
    setDeck(studyDeck);
    setDeckIndex(0);
    setFlipped(false);
    setSessionStats({ seen: 0, know: 0, dontKnow: 0 });
    setKnownCards(new Set());
    setView('study');
  };

  const rateCard = (knew: boolean) => {
    const card = deck[deckIndex];
    if (!card) return;
    setSessionStats(prev => ({
      seen: prev.seen + 1,
      know: knew ? prev.know + 1 : prev.know,
      dontKnow: knew ? prev.dontKnow : prev.dontKnow + 1,
    }));
    if (knew) setKnownCards(prev => new Set(prev).add(card.id));

    if (deckIndex + 1 < deck.length) {
      setDeckIndex(deckIndex + 1);
      setFlipped(false);
    } else {
      setView('home');
    }
  };

  // ── Study view ──
  if (view === 'study' && deck.length > 0) {
    const card = deck[deckIndex];
    const progress = ((deckIndex + 1) / deck.length) * 100;

    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => setView('home')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Exit
          </button>
          <span className="text-sm font-medium text-muted-foreground">{deckIndex + 1} / {deck.length}</span>
          <div className="flex gap-3 text-sm font-medium">
            <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" />{sessionStats.know}</span>
            <span className="text-red-500 flex items-center gap-1"><XCircle className="h-3.5 w-3.5" />{sessionStats.dontKnow}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="w-full h-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        {/* Card */}
        <div onClick={() => setFlipped(!flipped)} className="cursor-pointer select-none perspective-1000">
          <div className={`relative rounded-2xl border-2 min-h-[360px] transition-all duration-500 shadow-lg hover:shadow-xl ${
            flipped
              ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 border-indigo-500 text-white'
              : 'bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800'
          }`}>
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <Badge className={`text-[10px] border-0 ${flipped ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'}`}>
                {card.domainName}
              </Badge>
              {card.category && (
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${flipped ? 'bg-white/15 text-white/80' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'}`}>
                  {card.category}
                </span>
              )}
            </div>
            <div className="flex flex-col items-center justify-center text-center p-8 pt-14 min-h-[360px]">
              {!flipped ? (
                <>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md mb-5">
                    <BrainCircuit className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-lg font-semibold leading-relaxed mb-6">{card.front}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" /> Tap to reveal answer
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs uppercase tracking-widest font-bold mb-4 opacity-60">Answer</p>
                  <p className="text-base leading-relaxed">{card.back}</p>
                </>
              )}
            </div>
            {card.topics && card.topics.length > 0 && (
              <div className={`absolute bottom-4 left-4 right-4 text-center text-[10px] ${flipped ? 'text-white/50' : 'text-muted-foreground'}`}>
                {card.topics.join(' / ')}
              </div>
            )}
          </div>
        </div>

        {/* Rating - show after flip */}
        {flipped && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => rateCard(false)}
              className="flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-red-200 dark:border-red-800/60 bg-red-50/50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/40 transition-all text-red-600 dark:text-red-400 font-semibold text-sm"
            >
              <RotateCcw className="h-5 w-5" /> Still Learning
            </button>
            <button
              onClick={() => rateCard(true)}
              className="flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-green-200 dark:border-green-800/60 bg-green-50/50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-950/40 transition-all text-green-600 dark:text-green-400 font-semibold text-sm"
            >
              <CheckCircle2 className="h-5 w-5" /> Got It
            </button>
          </div>
        )}

        {/* Keyboard hint */}
        <p className="text-center text-[10px] text-muted-foreground">Click card to flip</p>
      </div>
    );
  }

  // ── Home view ──
  if (!hasFlashcards) {
    return (
      <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-12 text-center">
        <Layers className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-700" />
        <h3 className="text-lg font-semibold mb-2">Flashcards coming soon</h3>
        <p className="text-muted-foreground">Flashcard deck for {examType} is being prepared.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="rounded-2xl border-2 border-indigo-100 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 dark:from-indigo-950/40 dark:via-gray-950 dark:to-purple-950/40 p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <Layers className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{flashcardTitle}</h3>
            <p className="text-sm text-muted-foreground">{flashcardSubtitle}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Total Cards', value: flashcardCount, color: 'text-indigo-600 dark:text-indigo-400' },
            { label: 'Concepts', value: allCards.filter(c => c.category === 'concept').length, color: 'text-blue-600 dark:text-blue-400' },
            { label: 'Definitions', value: allCards.filter(c => c.category === 'definition').length, color: 'text-purple-600 dark:text-purple-400' },
            { label: 'Questions', value: allCards.filter(c => c.category === 'question').length, color: 'text-amber-600 dark:text-amber-400' },
            { label: 'Tips', value: allCards.filter(c => c.category === 'tip').length, color: 'text-green-600 dark:text-green-400' },
          ].map(s => (
            <div key={s.label} className="bg-white/60 dark:bg-gray-900/40 rounded-xl p-3 text-center border border-gray-100 dark:border-gray-800">
              <p className={`text-xl font-bold ${s.color}`}>{s.value.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Domain Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Filter by Domain</h3>
          {activeDomain && (
            <button onClick={() => setActiveDomain(null)} className="text-xs text-indigo-500 hover:text-indigo-700 font-medium">Clear filter</button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {domainCounts.map(d => (
            <button
              key={d.id}
              onClick={() => setActiveDomain(activeDomain === d.id ? null : d.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 border-2 ${
                activeDomain === d.id
                  ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm'
                  : 'bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700'
              }`}
            >
              {d.label} <span className="opacity-60">({d.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter + Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5">
          {['concept', 'definition', 'question', 'comparison', 'tip'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-purple-100 dark:hover:bg-purple-900/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search flashcards..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-600 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Study Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => startStudy(filteredCards)}
          disabled={filteredCards.length === 0}
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold text-sm hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Layers className="h-4 w-4" />
          Study {filteredCards.length > 0 ? `(${filteredCards.length} cards)` : ''}
        </button>
        <button
          onClick={() => setShuffled(!shuffled)}
          className={`px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
            shuffled
              ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300'
              : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-amber-300'
          }`}
        >
          <Sparkles className="h-4 w-4 inline mr-1.5" />
          {shuffled ? 'Shuffled' : 'Shuffle'}
        </button>
      </div>

      {/* Card Preview Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {filteredCards.length.toLocaleString()} cards{activeDomain ? ` in ${domainCounts.find(d => d.id === activeDomain)?.name || activeDomain}` : ''}
          </h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCards.slice(0, 18).map(card => (
            <div
              key={card.id}
              className="rounded-xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200 cursor-pointer group"
              onClick={() => {
                setDeck([card]);
                setDeckIndex(0);
                setFlipped(false);
                setSessionStats({ seen: 0, know: 0, dontKnow: 0 });
                setView('study');
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                  {card.domainName?.split(' ').slice(0, 2).join(' ') || card.domain}
                </span>
                {card.category && (
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                    card.category === 'concept' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                    : card.category === 'definition' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                    : card.category === 'question' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                    : card.category === 'tip' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300'
                  }`}>{card.category}</span>
                )}
              </div>
              <p className="text-sm font-medium line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{card.front}</p>
              {card.topics && card.topics.length > 0 && (
                <p className="text-[10px] text-muted-foreground mt-2 truncate">{card.topics[0]}</p>
              )}
            </div>
          ))}
        </div>
        {filteredCards.length > 18 && (
          <p className="text-center text-xs text-muted-foreground mt-4">
            Showing 18 of {filteredCards.length.toLocaleString()} cards. Click "Study" to go through all of them.
          </p>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// QBANK TAB
// ═══════════════════════════════════════════════════════════════

/**
 * "Add to SRS" button shown in the answer-revealed panel.
 * Auto-fills the card from the current question/explanation:
 *   - front: the question text (truncated to keep card scannable)
 *   - back:  the correct answer + explanation
 *   - deck:  the exam_type so /dashboard/srs groups by exam
 *   - tags:  question_id, topic_id, source: "qbank_miss"
 * Disables itself after a successful save so users don't dupe the card.
 */
function AddToSrsButton({
  question,
  answerResult,
  examType,
  resolveTopicId,
}: {
  question: any;
  answerResult: any;
  examType: string;
  resolveTopicId: (q: any) => string;
}) {
  const [adding, setAdding] = React.useState(false);
  const [added, setAdded] = React.useState(false);

  const handleAdd = async () => {
    if (added || adding || !question) return;
    setAdding(true);
    try {
      const correctIdx = Number(
        answerResult?.correct_index ?? question?.correct_index ?? 0,
      );
      const correctText =
        (Array.isArray(question?.options) && question.options[correctIdx]?.text) ||
        (Array.isArray(question?.options) && question.options[correctIdx]) ||
        '';
      const front =
        (question?.question_text || question?.question || '').toString().slice(0, 1000);
      const explanation =
        (answerResult?.explanation || question?.explanation || '').toString();
      const back =
        (correctText ? `**Correct:** ${correctText}\n\n` : '') +
        (explanation || 'No explanation provided.');

      await apiClient.createSrsCard({
        deck: examType,
        front,
        back,
        tags: {
          source: 'qbank_miss',
          exam_type: examType,
          topic_id: resolveTopicId(question),
          question_id: question?.id ?? null,
        },
      });
      setAdded(true);
      toast.success('Added to SRS — review in /dashboard/srs');
    } catch {
      toast.error('Could not save card. Try again.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <Button
      size="sm"
      variant={added ? 'outline' : 'ghost'}
      onClick={handleAdd}
      disabled={added || adding}
      className="gap-1.5"
      title={added ? 'Card already added' : 'Save this question to your SRS deck for spaced review'}
    >
      {added ? (
        <>
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Added to SRS
        </>
      ) : (
        <>
          <BrainCircuit className="h-4 w-4" />
          {adding ? 'Saving…' : 'Add to SRS'}
        </>
      )}
    </Button>
  );
}

function QBankTab({ examType, config, sections }: { examType: string; config: any; sections: any[] }) {
  const [view, setView] = useState<'setup' | 'session' | 'results'>('setup');
  const [stats, setStats] = useState<any>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const [currentQ, setCurrentQ] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerResult, setAnswerResult] = useState<any>(null);
  const [results, setResults] = useState<any>(null);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);

  // Setup form
  const [mode, setMode] = useState('tutor');
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(20);
  const [patentAiaEra, setPatentAiaEra] = useState<string>('');
  const [patentContentTypes, setPatentContentTypes] = useState<string[]>([]);
  // Drill only the official USPTO released-exam questions (ids `uspto-*`).
  const [patentOfficialOnly, setPatentOfficialOnly] = useState(false);
  // WS3 blueprint coverage (Patent Bar): per-section bank counts and
  // verification split vs exam-config weights. Computed from the same lazy
  // bank modules the session fallback uses.
  const [pbCoverage, setPbCoverage] = useState<{ rows: any[]; bankTotal: number } | null>(null);

  useEffect(() => {
    if (examType !== 'PATENT_BAR') return;
    (async () => {
      try {
        const [bank, gapfill, gapfillDesign, gapfillPct, octAm, octPm, aprAm, aprPm, cov] = await Promise.all([
          import('@/lib/patent-bar-qbank-data'),
          import('@/lib/patent-bar-gapfill-ethics-data'),
          import('@/lib/patent-bar-gapfill-design-data'),
          import('@/lib/patent-bar-gapfill-pct-data'),
          import('@/lib/patent-bar-uspto-oct2003-data'),
          import('@/lib/patent-bar-uspto-oct2003-pm-data'),
          import('@/lib/patent-bar-uspto-apr2003-data'),
          import('@/lib/patent-bar-uspto-apr2003-pm-data'),
          import('@/lib/patent-bar-coverage'),
        ]);
        const all = [
          ...bank.PATENT_BAR_QUESTIONS,
          ...gapfill.PATENT_BAR_GAPFILL_ETHICS,
          ...gapfillDesign.PATENT_BAR_GAPFILL_DESIGN,
          ...gapfillPct.PATENT_BAR_GAPFILL_PCT,
          ...octAm.USPTO_OCT2003_AM_QUESTIONS,
          ...octPm.USPTO_OCT2003_PM_QUESTIONS,
          ...aprAm.USPTO_APR2003_AM_QUESTIONS,
          ...aprPm.USPTO_APR2003_PM_QUESTIONS,
        ];
        setPbCoverage(cov.computePatentBarCoverage(all));
      } catch { /* coverage card simply doesn't render */ }
    })();
  }, [examType]);

  // Question bank sizes per exam (actual number of questions in the static bank)
  const QBANK_SIZES: Record<string, number> = {
    MCAT: 580, CISSP: 400, PE_EE: 399, FE_EE: 610, FE_ME: 554,
    // PATENT_BAR = 536 authored + 65 ethics + 66 design/plant + 40 PCT gap-fill
    // (WS3) + 174 official USPTO (Oct 2003: 47 AM + 48 PM; Apr 2003: 40 AM + 39 PM)
    PATENT_BAR: 881, SECURITY_PLUS: 472, SAT: 139, GRE: 87, GMAT: 75, LSAT: 200,
  };
  const OFFICIAL_USPTO_COUNT = 174; // Oct 2003: 47 AM + 48 PM; Apr 2003: 40 AM + 39 PM
  const qbankMax =
    examType === 'PATENT_BAR' && patentOfficialOnly
      ? OFFICIAL_USPTO_COUNT
      : QBANK_SIZES[examType] || config.totalQuestions || 200;

  useEffect(() => {
    apiClient.getQBankStats(examType).then(setStats).catch(() => {});
  }, [examType]);

  // Timer
  useEffect(() => {
    if (view !== 'session') return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [view]);

  const startSession = async () => {
    setLoading(true);
    try {
      const payload: {
        exam_type: string;
        mode: string;
        section_ids?: string[];
        question_count: number;
        patent_filters?: { aia_era?: string; content_types?: string[]; official_only?: boolean };
      } = {
        exam_type: examType,
        mode,
        section_ids: selectedSections.length > 0 ? selectedSections : undefined,
        question_count: questionCount,
      };
      if (examType === 'PATENT_BAR') {
        const pf: { aia_era?: string; content_types?: string[]; official_only?: boolean } = {};
        if (patentAiaEra) pf.aia_era = patentAiaEra;
        if (patentContentTypes.length > 0) pf.content_types = patentContentTypes;
        if (patentOfficialOnly) pf.official_only = true;
        if (Object.keys(pf).length > 0) payload.patent_filters = pf;
      }
      const data = await apiClient.createQBankSession(payload);
      // The test-prep microservice returns 404 ("no questions") for exams whose
      // banks live client-side (SAT/GRE/GMAT and the other static exams), and
      // the graceful-degrade interceptor can resolve a null/empty body when the
      // service is offline or can't auth. In either case there's no usable
      // question — throw so we fall through to the static bank below instead of
      // entering the session view with an undefined question ("not answering").
      if (!data || !data.session_id || !data.question) {
        throw new Error('no usable backend session — using static bank');
      }
      setSessionId(data.session_id);
      setSessionData(data);
      setCurrentQ(data.question);
      setCurrentIndex(0);
      setTimer(0);
      setView('session');
    } catch {
      // Fallback: use static CISSP questions if API is unavailable
      if (examType === 'CISSP') {
        const { getCISSPQuestions } = await import('@/lib/cissp-qbank-data');
        const staticQs = getCISSPQuestions({
          sectionIds: selectedSections.length > 0 ? selectedSections : undefined,
          count: questionCount,
        });
        if (staticQs.length > 0) {
          const fakeSessionId = `static-${Date.now()}`;
          setSessionId(fakeSessionId);
          setSessionData({
            session_id: fakeSessionId,
            question_count: staticQs.length,
            _staticQuestions: staticQs,
          });
          setCurrentQ(staticQs[0]);
          setCurrentIndex(0);
          setTimer(0);
          setView('session');
        } else {
          toast.error('No questions available for the selected sections.');
        }
      } else if (examType === 'FE_EE') {
        // Static fallback for FE EE using local question bank
        const { FE_EE_QUESTIONS } = await import('@/lib/fe-ee-qbank-data');
        let feQuestions = [...FE_EE_QUESTIONS];
        if (selectedSections.length > 0) {
          // Map section IDs to numeric topicIds
          const sectionToTopic: Record<string, number> = {
            fee_math: 0, fee_prob_stats: 1, fee_ethics: 2, fee_eng_econ: 3,
            fee_materials: 4, fee_eng_sci: 5, fee_circuits: 6, fee_linear_sys: 7,
            fee_signal_proc: 8, fee_electronics: 9, fee_power_sys: 10,
            fee_electromagnetics: 11, fee_control: 12, fee_comms: 13,
            fee_networks: 14, fee_digital: 15, fee_comp_sys: 16, fee_software: 17,
          };
          const topicIds = selectedSections.map(s => sectionToTopic[s]).filter(n => n !== undefined);
          feQuestions = feQuestions.filter(q => topicIds.includes(q.topicId));
        }
        // Shuffle and limit
        feQuestions = shuffle(feQuestions).slice(0, questionCount);
        if (feQuestions.length > 0) {
          // Normalize to match the static question format
          const normalized = feQuestions.map((q, i) => ({
            ...q,
            question_text: q.question,
            options: q.options.map((opt: string, idx: number) => ({ text: opt, index: idx })),
            correct_index: q.correct,
            explanation_text: q.explanation,
            section_id: `fee_topic${q.topicId}`,
            _idx: i,
          }));
          const fakeSessionId = `static-${Date.now()}`;
          setSessionId(fakeSessionId);
          setSessionData({
            session_id: fakeSessionId,
            question_count: normalized.length,
            _staticQuestions: normalized,
          });
          setCurrentQ(normalized[0]);
          setCurrentIndex(0);
          setTimer(0);
          setView('session');
        } else {
          toast.error('No questions available for the selected sections.');
        }
      } else if (examType === 'FE_ME') {
        const { FME_QUESTIONS } = await import('@/lib/fme-qbank-data');
        let meQuestions = [...FME_QUESTIONS];
        if (selectedSections.length > 0) {
          const sectionToTopic: Record<string, number> = {
            fme_math: 0, fme_prob_stats: 1, fme_comp_tools: 2, fme_ethics: 3,
            fme_eng_econ: 4, fme_statics: 5, fme_dynamics: 6, fme_mechanics: 7,
            fme_materials: 8, fme_fluids: 9, fme_thermo: 10, fme_heat: 11,
            fme_controls: 12, fme_design: 13, fme_manufacturing: 14, fme_management: 15,
          };
          const topicIds = selectedSections.map(s => sectionToTopic[s]).filter(n => n !== undefined);
          meQuestions = meQuestions.filter(q => topicIds.includes(q.topicId));
        }
        meQuestions = shuffle(meQuestions).slice(0, questionCount);
        if (meQuestions.length > 0) {
          const normalized = meQuestions.map((q: any, i: number) => ({
            ...q,
            question_text: q.question,
            options: q.options.map((opt: string, idx: number) => ({ text: opt, index: idx })),
            correct_index: q.correct,
            explanation_text: q.explanation,
            section_id: `fme_topic${q.topicId}`,
            _idx: i,
          }));
          const fakeSessionId = `static-${Date.now()}`;
          setSessionId(fakeSessionId);
          setSessionData({ session_id: fakeSessionId, question_count: normalized.length, _staticQuestions: normalized });
          setCurrentQ(normalized[0]);
          setCurrentIndex(0);
          setTimer(0);
          setView('session');
        } else {
          toast.error('No questions available for the selected sections.');
        }
      } else if (examType === 'PE_EE') {
        const { PE_EE_QUESTIONS } = await import('@/lib/pe-ee-qbank-data');
        let peeQuestions = [...PE_EE_QUESTIONS];
        if (selectedSections.length > 0) {
          const sectionToTopic: Record<string, number> = {
            pee_general: 0, pee_measurement: 1, pee_circuits: 2, pee_rotating: 3,
            pee_electromagnetics: 4, pee_transmission: 5, pee_protection: 6,
            pee_power_quality: 7, pee_codes: 8, pee_power_system: 9,
          };
          const topicIds = selectedSections.map(s => sectionToTopic[s]).filter(n => n !== undefined);
          peeQuestions = peeQuestions.filter(q => topicIds.includes(q.topicId));
        }
        peeQuestions = shuffle(peeQuestions).slice(0, questionCount);
        if (peeQuestions.length > 0) {
          const normalized = peeQuestions.map((q: any, i: number) => ({
            ...q,
            question_text: q.question,
            options: q.options.map((opt: string, idx: number) => ({ text: opt, index: idx })),
            correct_index: q.correct,
            explanation_text: q.explanation,
            section_id: `pee_topic${q.topicId}`,
            _idx: i,
          }));
          const fakeSessionId = `static-${Date.now()}`;
          setSessionId(fakeSessionId);
          setSessionData({ session_id: fakeSessionId, question_count: normalized.length, _staticQuestions: normalized });
          setCurrentQ(normalized[0]);
          setCurrentIndex(0);
          setTimer(0);
          setView('session');
        } else {
          toast.error('No questions available for the selected sections.');
        }
      } else if (examType === 'MCAT') {
        const { MCAT_QUESTIONS } = await import('@/lib/mcat-qbank-data');
        let mcatQuestions = [...MCAT_QUESTIONS];
        if (selectedSections.length > 0) {
          const sectionToTopic: Record<string, number> = {
            chem_phys: 0, cars: 1, bio_biochem: 2, psych_soc: 3,
          };
          const topicIds = selectedSections.map(s => sectionToTopic[s]).filter(n => n !== undefined);
          mcatQuestions = mcatQuestions.filter(q => topicIds.includes(q.topicId));
        }
        mcatQuestions = shuffle(mcatQuestions).slice(0, questionCount);
        if (mcatQuestions.length > 0) {
          const normalized = mcatQuestions.map((q: any, i: number) => ({
            ...q,
            question_text: q.question,
            options: q.options.map((opt: string, idx: number) => ({ text: opt, index: idx })),
            correct_index: q.correct,
            explanation_text: q.explanation,
            section_id: `mcat_topic${q.topicId}`,
            _idx: i,
          }));
          const fakeSessionId = `static-${Date.now()}`;
          setSessionId(fakeSessionId);
          setSessionData({ session_id: fakeSessionId, question_count: normalized.length, _staticQuestions: normalized });
          setCurrentQ(normalized[0]);
          setCurrentIndex(0);
          setTimer(0);
          setView('session');
        } else {
          toast.error('No questions available for the selected sections.');
        }
      } else if (examType === 'SECURITY_PLUS') {
        const { SECPLUS_QUESTIONS } = await import('@/lib/security-plus-qbank-data');
        let spQuestions = [...SECPLUS_QUESTIONS];
        if (selectedSections.length > 0) {
          const sectionToTopic: Record<string, number> = {
            general_concepts: 0, threats_vuln: 1, architecture: 2, operations: 3, program_mgmt: 4,
          };
          const topicIds = selectedSections.map(s => sectionToTopic[s]).filter(n => n !== undefined);
          spQuestions = spQuestions.filter(q => topicIds.includes(q.topicId));
        }
        spQuestions = shuffle(spQuestions).slice(0, questionCount);
        if (spQuestions.length > 0) {
          const normalized = spQuestions.map((q: any, i: number) => ({
            ...q, question_text: q.question,
            options: q.options.map((opt: string, idx: number) => ({ text: opt, index: idx })),
            correct_index: q.correct, explanation_text: q.explanation,
            section_id: `sp_topic${q.topicId}`, _idx: i,
          }));
          const fakeSessionId = `static-${Date.now()}`;
          setSessionId(fakeSessionId);
          setSessionData({ session_id: fakeSessionId, question_count: normalized.length, _staticQuestions: normalized });
          setCurrentQ(normalized[0]); setCurrentIndex(0); setTimer(0); setView('session');
        } else { toast.error('No questions available for the selected sections.'); }
      } else if (examType === 'PATENT_BAR') {
        const { PATENT_BAR_QUESTIONS, getPatentBarVerification } = await import('@/lib/patent-bar-qbank-data');
        // Official public-domain USPTO released-exam questions (Oct 2003) join
        // the practice pool alongside the authored bank. They carry official
        // model-answer explanations and are labeled [OFFICIAL USPTO EXAM].
        const { USPTO_OCT2003_AM_QUESTIONS } = await import('@/lib/patent-bar-uspto-oct2003-data');
        const { USPTO_OCT2003_PM_QUESTIONS } = await import('@/lib/patent-bar-uspto-oct2003-pm-data');
        const { USPTO_APR2003_AM_QUESTIONS } = await import('@/lib/patent-bar-uspto-apr2003-data');
        const { USPTO_APR2003_PM_QUESTIONS } = await import('@/lib/patent-bar-uspto-apr2003-pm-data');
        const { PATENT_BAR_GAPFILL_ETHICS } = await import('@/lib/patent-bar-gapfill-ethics-data');
        const { PATENT_BAR_GAPFILL_DESIGN } = await import('@/lib/patent-bar-gapfill-design-data');
        const { PATENT_BAR_GAPFILL_PCT } = await import('@/lib/patent-bar-gapfill-pct-data');
        let pbQuestions = [...PATENT_BAR_QUESTIONS, ...PATENT_BAR_GAPFILL_ETHICS, ...PATENT_BAR_GAPFILL_DESIGN, ...PATENT_BAR_GAPFILL_PCT, ...USPTO_OCT2003_AM_QUESTIONS, ...USPTO_OCT2003_PM_QUESTIONS, ...USPTO_APR2003_AM_QUESTIONS, ...USPTO_APR2003_PM_QUESTIONS];
        if (patentOfficialOnly) {
          pbQuestions = pbQuestions.filter((q) => q.id.startsWith('uspto-'));
        }
        if (selectedSections.length > 0) {
          const sectionToTopic: Record<string, number> = {
            patentability: 0, application_prep: 1, filing_prosecution: 2, office_responses: 3,
            pct_international: 4, post_issuance: 5, design_plant: 6, ethics_conduct: 7,
          };
          const topicIds = selectedSections.map(s => sectionToTopic[s]).filter(n => n !== undefined);
          pbQuestions = pbQuestions.filter(q => topicIds.includes(q.topicId));
        }
        pbQuestions = shuffle(pbQuestions).slice(0, questionCount);
        if (pbQuestions.length > 0) {
          const normalized = pbQuestions.map((q: any, i: number) => ({
            ...q, question_text: q.question,
            options: q.options.map((opt: string, idx: number) => ({ text: opt, index: idx })),
            correct_index: q.correct, explanation_text: q.explanation,
            section_id: `pb_topic${q.topicId}`, _idx: i,
            // WS2 provenance: 'official' (USPTO released exam), 'sme'
            // (expert-reviewed), or 'unverified' (AI-authored, pending
            // review). Surfaced as a badge in the session header.
            verification: getPatentBarVerification(q),
          }));
          const fakeSessionId = `static-${Date.now()}`;
          setSessionId(fakeSessionId);
          setSessionData({ session_id: fakeSessionId, question_count: normalized.length, _staticQuestions: normalized });
          setCurrentQ(normalized[0]); setCurrentIndex(0); setTimer(0); setView('session');
        } else { toast.error('No questions available for the selected sections.'); }
      } else if (examType === 'LSAT') {
        // LSAT QBank: 200 original questions, topicId 0=LR, 1=RC. Section
        // filter maps the curriculum sectionIds to those numeric topic ids.
        const { LSAT_QUESTIONS } = await import('@/lib/lsat-qbank-data');
        let lsatQuestions = [...LSAT_QUESTIONS];
        if (selectedSections.length > 0) {
          const sectionToTopic: Record<string, number> = {
            logical_reasoning: 0,
            reading_comprehension: 1,
          };
          const topicIds = selectedSections
            .map((s) => sectionToTopic[s])
            .filter((n) => n !== undefined);
          if (topicIds.length > 0) {
            lsatQuestions = lsatQuestions.filter((q) => topicIds.includes(q.topicId));
          }
        }
        lsatQuestions = shuffle(lsatQuestions).slice(0, questionCount);
        if (lsatQuestions.length > 0) {
          const normalized = lsatQuestions.map((q: any, i: number) => ({
            ...q,
            question_text: q.question,
            options: q.options.map((opt: string, idx: number) => ({ text: opt, index: idx })),
            correct_index: q.correct,
            explanation_text: q.explanation,
            section_id: q.topicId === 0 ? 'logical_reasoning' : 'reading_comprehension',
            _idx: i,
          }));
          const fakeSessionId = `static-${Date.now()}`;
          setSessionId(fakeSessionId);
          setSessionData({ session_id: fakeSessionId, question_count: normalized.length, _staticQuestions: normalized });
          setCurrentQ(normalized[0]); setCurrentIndex(0); setTimer(0); setView('session');
        } else { alert('No LSAT questions available for the selected sections.'); }
      } else if (examType === 'SAT') {
        // Digital SAT QBank: original audited questions, topicId 0=Reading&Writing, 1=Math.
        const { SAT_QUESTIONS } = await import('@/lib/sat-qbank-data');
        let satQuestions = [...SAT_QUESTIONS];
        if (selectedSections.length > 0) {
          const sectionToTopic: Record<string, number> = {
            reading_writing: 0,
            math: 1,
          };
          const topicIds = selectedSections.map((s) => sectionToTopic[s]).filter((n) => n !== undefined);
          if (topicIds.length > 0) {
            satQuestions = satQuestions.filter((q) => topicIds.includes(q.topicId));
          }
        }
        satQuestions = shuffle(satQuestions).slice(0, questionCount);
        if (satQuestions.length > 0) {
          const normalized = satQuestions.map((q: any, i: number) => ({
            ...q,
            question_text: q.passage ? `${q.passage}\n\n${q.question}` : q.question,
            options: q.options.map((opt: string, idx: number) => ({ text: opt, index: idx })),
            correct_index: q.correct,
            explanation_text: q.explanation,
            section_id: q.topicId === 0 ? 'reading_writing' : 'math',
            _idx: i,
          }));
          const fakeSessionId = `static-${Date.now()}`;
          setSessionId(fakeSessionId);
          setSessionData({ session_id: fakeSessionId, question_count: normalized.length, _staticQuestions: normalized });
          setCurrentQ(normalized[0]); setCurrentIndex(0); setTimer(0); setView('session');
        } else { toast.error('No SAT questions available for the selected sections.'); }
      } else if (examType === 'GRE') {
        // GRE QBank: original audited questions, topicId 0=Quantitative, 1=Verbal.
        const { GRE_QUESTIONS } = await import('@/lib/gre-qbank-data');
        let greQuestions = [...GRE_QUESTIONS];
        if (selectedSections.length > 0) {
          const sectionToTopic: Record<string, number> = { quantitative: 0, verbal: 1 };
          const topicIds = selectedSections.map((s) => sectionToTopic[s]).filter((n) => n !== undefined);
          if (topicIds.length > 0) greQuestions = greQuestions.filter((q) => topicIds.includes(q.topicId));
        }
        greQuestions = shuffle(greQuestions).slice(0, questionCount);
        if (greQuestions.length > 0) {
          const normalized = greQuestions.map((q: any, i: number) => ({
            ...q,
            question_text: q.passage ? `${q.passage}\n\n${q.question}` : q.question,
            options: q.options.map((opt: string, idx: number) => ({ text: opt, index: idx })),
            correct_index: q.correct,
            explanation_text: q.explanation,
            section_id: q.topicId === 0 ? 'quantitative' : 'verbal',
            _idx: i,
          }));
          const fakeSessionId = `static-${Date.now()}`;
          setSessionId(fakeSessionId);
          setSessionData({ session_id: fakeSessionId, question_count: normalized.length, _staticQuestions: normalized });
          setCurrentQ(normalized[0]); setCurrentIndex(0); setTimer(0); setView('session');
        } else { toast.error('No GRE questions available for the selected sections.'); }
      } else if (examType === 'GMAT') {
        // GMAT Focus QBank: topicId 0=Quantitative, 1=Verbal, 2=Data Insights.
        const { GMAT_QUESTIONS } = await import('@/lib/gmat-qbank-data');
        let gmatQuestions = [...GMAT_QUESTIONS];
        if (selectedSections.length > 0) {
          const sectionToTopic: Record<string, number> = { quantitative: 0, verbal: 1, data_insights: 2 };
          const topicIds = selectedSections.map((s) => sectionToTopic[s]).filter((n) => n !== undefined);
          if (topicIds.length > 0) gmatQuestions = gmatQuestions.filter((q) => topicIds.includes(q.topicId));
        }
        gmatQuestions = shuffle(gmatQuestions).slice(0, questionCount);
        if (gmatQuestions.length > 0) {
          const normalized = gmatQuestions.map((q: any, i: number) => ({
            ...q,
            question_text: q.passage ? `${q.passage}\n\n${q.question}` : q.question,
            options: q.options.map((opt: string, idx: number) => ({ text: opt, index: idx })),
            correct_index: q.correct,
            explanation_text: q.explanation,
            section_id: q.topicId === 0 ? 'quantitative' : q.topicId === 1 ? 'verbal' : 'data_insights',
            _idx: i,
          }));
          const fakeSessionId = `static-${Date.now()}`;
          setSessionId(fakeSessionId);
          setSessionData({ session_id: fakeSessionId, question_count: normalized.length, _staticQuestions: normalized });
          setCurrentQ(normalized[0]); setCurrentIndex(0); setTimer(0); setView('session');
        } else { toast.error('No GMAT questions available for the selected sections.'); }
      } else {
        toast('No questions available for this exam yet. Questions are being added.', { icon: 'ℹ️' });
      }
    }
    setLoading(false);
  };

  const submitAnswer = async () => {
    if (selectedAnswer === null || !sessionId || !currentQ) return;
    setLoading(true);

    // Static fallback: evaluate locally
    if (sessionId.startsWith('static-')) {
      const isCorrect = selectedAnswer === currentQ.correct_index;
      setAnswerResult({
        correct_index: currentQ.correct_index,
        is_correct: isCorrect,
        explanation: currentQ.explanation,
      });
      // Persist to api-core /me/progress so Command Center analytics
      // (P0-5 / P1-3) fill in for the current user. Best-effort —
      // failures (offline, 401, unsupported exam) must not block the
      // UI.
      void recordCurrentAttempt(isCorrect);
      setLoading(false);
      return;
    }

    try {
      const result = await apiClient.submitQBankAnswer(sessionId, {
        question_id: currentQ.id,
        answer_index: selectedAnswer,
        time_spent_seconds: timer,
      });
      setAnswerResult(result);
      setSessionData((prev: any) => ({ ...prev, ...result }));
      void recordCurrentAttempt(Boolean(result?.is_correct));
    } catch { /* ignore */ }
    setLoading(false);
  };

  // Keyboard shortcuts inside the QBank session view: 1-9 picks the
  // matching answer option, Enter submits (or advances to next when
  // an answer is already revealed). Ignored when the user is typing
  // in an input/textarea or when the answer has been revealed (option
  // buttons disable themselves at that point).
  useEffect(() => {
    if (view !== 'session') return;
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      // Number keys → pick that option index (1-based UI → 0-based state).
      if (/^[1-9]$/.test(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        const optionCount = currentQ?.options?.length ?? 0;
        if (idx >= 0 && idx < optionCount && !answerResult) {
          e.preventDefault();
          setSelectedAnswer(idx);
        }
      }
      // Enter submits or advances depending on phase.
      if (e.key === 'Enter') {
        e.preventDefault();
        if (!answerResult && selectedAnswer !== null && !loading) {
          submitAnswer();
        } else if (answerResult && !loading) {
          nextQuestion();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, currentQ, answerResult, selectedAnswer, loading]);

  // Resolve the stable topic_id to send to /me/progress. Each exam's
  // question shape carries a granular bucket in `subtopic` (LSAT:
  // 'lr_strengthen', Patent Bar: '101_subject_matter', MCAT: 'Gen Chem
  // — Atomic Structure', etc.). Fall back to `topic` if no subtopic
  // (CISSP / Security+ / FE-EE store domain there) and finally to the
  // numeric topicId stringified.
  const resolveTopicId = (q: any): string => {
    const sub = (q?.subtopic ?? '').toString().trim();
    if (sub) return sub;
    const topic = (q?.topic ?? '').toString().trim();
    if (topic) return topic;
    const tid = q?.topicId;
    return tid !== undefined && tid !== null ? `t${tid}` : 'unknown';
  };

  // Map UI exam id → ExamTypeKind enum value the backend accepts.
  // Anything outside this set is silently skipped (the backend would
  // 422 on an unknown enum). Keep in sync with
  // services/api-core/app/models/user_progress.py:ExamTypeKind.
  const PROGRESS_SUPPORTED_EXAMS = new Set([
    'PATENT_BAR', 'MCAT', 'LSAT', 'CISSP', 'SECURITY_PLUS',
    'FE_EE', 'FE_ME', 'PE_EE', 'SAT', 'GRE', 'GMAT',
  ]);

  const recordCurrentAttempt = async (isCorrect: boolean): Promise<void> => {
    if (!currentQ) return;
    if (!PROGRESS_SUPPORTED_EXAMS.has(examType)) return;
    try {
      await apiClient.recordProgress({
        exam_type: examType,
        topic_id: resolveTopicId(currentQ),
        is_correct: isCorrect,
        seconds: timer || 0,
      });
    } catch {
      // Silent: progress recording is best-effort. Common reasons it
      // fails in dev: anonymous user (no JWT yet), api-core down, or a
      // brand-new topic_id the upsert hasn't seen — none should
      // disrupt the practice UI.
    }
  };

  const nextQuestion = async () => {
    if (!sessionId) return;
    const nextIdx = currentIndex + 1;
    setLoading(true);

    // Static fallback: serve next question from local array
    if (sessionId.startsWith('static-') && sessionData?._staticQuestions) {
      const staticQs = sessionData._staticQuestions as CISSPQuestion[];
      if (nextIdx < staticQs.length) {
        setCurrentQ(staticQs[nextIdx]);
        setCurrentIndex(nextIdx);
        setSelectedAnswer(null);
        setAnswerResult(null);
        setTimer(0);
      } else {
        setResults({ score_percent: 0, total_questions: staticQs.length, session_id: sessionId });
        setView('results');
      }
      setLoading(false);
      return;
    }

    try {
      const data = await apiClient.getQBankQuestion(sessionId, nextIdx);
      setCurrentQ(data.question);
      setCurrentIndex(nextIdx);
      setSelectedAnswer(null);
      setAnswerResult(null);
      setTimer(0);
      if (data.previous_answer) {
        setSelectedAnswer(data.previous_answer.answer_index);
      }
    } catch {
      // No more questions, complete session
      const res = await apiClient.completeQBankSession(sessionId);
      setResults(res);
      setView('results');
    }
    setLoading(false);
  };

  const finishSession = async () => {
    if (!sessionId) return;

    // Static fallback: just show results
    if (sessionId.startsWith('static-')) {
      const staticQs = sessionData?._staticQuestions || [];
      setResults({ score_percent: 0, total_questions: staticQs.length, session_id: sessionId });
      setView('results');
      return;
    }

    const res = await apiClient.completeQBankSession(sessionId);
    setResults(res);
    setView('results');
  };

  // ── Setup view ──
  if (view === 'setup') {
    return (
      <div className="space-y-6">
        {/* Stats overview */}
        {stats && (
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold">{stats.total_questions}</p>
              <p className="text-xs text-muted-foreground">Questions Available</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold">{stats.completed_sessions || 0}</p>
              <p className="text-xs text-muted-foreground">Sessions Completed</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold">{stats.avg_score_percent != null ? `${stats.avg_score_percent}%` : '—'}</p>
              <p className="text-xs text-muted-foreground">Average Score</p>
            </Card>
          </div>
        )}

        <Card className="p-6 space-y-5">
          <h3 className="text-lg font-semibold">Configure QBank Session</h3>

          {/* Mode */}
          <div>
            <label className="block text-sm font-medium mb-2">Mode</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'tutor', label: 'Tutor', desc: 'See explanations after each question' },
                { id: 'timed', label: 'Timed', desc: 'Simulate real exam time pressure' },
                { id: 'review', label: 'Review', desc: 'See answers and explanations upfront' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${mode === m.id ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground/30'}`}
                >
                  <p className="font-medium text-sm">{m.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div>
            <label className="block text-sm font-medium mb-2">Sections (leave empty for all)</label>
            <div className="flex flex-wrap gap-2">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSections((prev) =>
                    prev.includes(s.id) ? prev.filter((x) => x !== s.id) : [...prev, s.id]
                  )}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    selectedSections.includes(s.id)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted text-muted-foreground border-transparent hover:border-muted-foreground/30'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {examType === 'PATENT_BAR' && (
            <div className="rounded-lg border bg-muted/20 p-4 space-y-3">
              <p className="text-sm font-medium">Patent Bar filters (optional)</p>
              <p className="text-xs text-muted-foreground">
                Requires tagged questions in the bank. Leave blank to include all available items.
              </p>
              <button
                type="button"
                onClick={() => {
                  setPatentOfficialOnly((prev) => {
                    const next = !prev;
                    // Clamp the session size to the smaller official pool.
                    if (next && questionCount > OFFICIAL_USPTO_COUNT) {
                      setQuestionCount(OFFICIAL_USPTO_COUNT);
                    }
                    return next;
                  });
                }}
                className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                  patentOfficialOnly
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'bg-background hover:bg-muted'
                }`}
              >
                <span>
                  <span className="font-medium">Official USPTO questions only</span>
                  <span className="block text-xs text-muted-foreground">
                    {OFFICIAL_USPTO_COUNT} real released-exam questions (Oct 2003 + Apr 2003, both sessions) with
                    the USPTO&apos;s own model-answer explanations
                  </span>
                </span>
                <span
                  className={`ml-3 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                    patentOfficialOnly ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
                      patentOfficialOnly ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </span>
              </button>
              <div>
                <label className="block text-xs font-medium mb-1">AIA era</label>
                <select
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  value={patentAiaEra}
                  onChange={(e) => setPatentAiaEra(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="post_aia">Post-AIA dominant</option>
                  <option value="pre_aia">Pre-AIA dominant</option>
                  <option value="both">Mixed / both flagged</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Content type</label>
                <div className="flex flex-wrap gap-2">
                  {(['statute', 'rule', 'case_law', 'procedure', 'mixed'] as const).map((ct) => (
                    <button
                      key={ct}
                      type="button"
                      onClick={() =>
                        setPatentContentTypes((prev) =>
                          prev.includes(ct) ? prev.filter((x) => x !== ct) : [...prev, ct]
                        )
                      }
                      className={`px-2 py-1 rounded text-xs border ${
                        patentContentTypes.includes(ct) ? 'bg-primary text-primary-foreground border-primary' : 'bg-background'
                      }`}
                    >
                      {ct}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* WS3 blueprint coverage matrix (Patent Bar) */}
          {examType === 'PATENT_BAR' && pbCoverage && (
            <div className="rounded-lg border bg-muted/20 p-4">
              <p className="text-sm font-medium">Blueprint coverage</p>
              <p className="mb-2 text-xs text-muted-foreground">
                Bank of {pbCoverage.bankTotal} vs the 100-question exam blueprint. Sections below their
                blueprint weight are the current authoring gaps.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="py-1 pr-2 font-medium">Section</th>
                      <th className="py-1 pr-2 text-right font-medium">Weight</th>
                      <th className="py-1 pr-2 text-right font-medium">Qs</th>
                      <th className="py-1 pr-2 text-right font-medium">Share</th>
                      <th className="py-1 pr-2 text-right font-medium">Official</th>
                      <th className="py-1 pr-2 text-right font-medium">Unverified</th>
                      <th className="py-1 text-center font-medium">Floor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pbCoverage.rows.map((r: any) => (
                      <tr key={r.id} className="border-t border-border/50">
                        <td className="py-1 pr-2">{r.name}</td>
                        <td className="py-1 pr-2 text-right">{r.weightPct}%</td>
                        <td className="py-1 pr-2 text-right">{r.total}</td>
                        <td className={`py-1 pr-2 text-right ${r.meetsWeight ? '' : 'text-amber-600 dark:text-amber-400'}`}>{r.sharePct}%</td>
                        <td className="py-1 pr-2 text-right text-emerald-600">{r.official}</td>
                        <td className="py-1 pr-2 text-right text-muted-foreground">{r.unverified}</td>
                        <td className="py-1 text-center">{r.meetsWeight ? '✓' : <span className="text-amber-600 dark:text-amber-400">gap</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Question count */}
          <div>
            <label className="block text-sm font-medium mb-2">Questions: {questionCount}</label>
            <input
              type="range"
              min={5}
              max={qbankMax}
              step={5}
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>5</span><span>{Math.round(qbankMax / 2)}</span><span>{qbankMax}</span>
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={startSession} disabled={loading}>
            {loading ? 'Starting...' : 'Start QBank Session'}
          </Button>
        </Card>
      </div>
    );
  }

  // ── Session view ──
  if (view === 'session' && currentQ) {
    return (
      <div className="space-y-4">
        {/* Session header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="secondary">Q {currentIndex + 1}/{sessionData?.question_count || '?'}</Badge>
            <Badge variant="outline">{currentQ.section}</Badge>
            {currentQ.difficulty_label && <Badge variant="outline">{currentQ.difficulty_label}</Badge>}
            {/* WS2 provenance badge — honest labeling: official released-exam
                items vs SME-reviewed vs AI-authored/unverified. The id-prefix
                fallback covers questions that skipped fallback normalization. */}
            {examType === 'PATENT_BAR' && (() => {
              const v = currentQ.verification ?? (String(currentQ.id || '').startsWith('uspto-') ? 'official' : 'unverified');
              if (v === 'official') return (
                <Badge className="bg-emerald-600 text-white text-[10px]" title="Official USPTO released-exam question, graded against the USPTO's published model answer.">
                  Official USPTO
                </Badge>
              );
              if (v === 'sme') return (
                <Badge className="bg-sky-600 text-white text-[10px]" title="Reviewed and approved by a subject-matter expert.">
                  SME-verified
                </Badge>
              );
              return (
                <Badge variant="outline" className="border-amber-500 text-amber-600 dark:text-amber-400 text-[10px]" title="AI-authored practice item — not yet reviewed by a subject-matter expert. Official USPTO items carry the USPTO's own model answers.">
                  Unverified
                </Badge>
              );
            })()}
            {examType === 'PATENT_BAR' && currentQ.patent?.aia_era && (
              <Badge variant="outline" className="text-[10px] font-mono">AIA: {currentQ.patent.aia_era}</Badge>
            )}
            {examType === 'PATENT_BAR' && currentQ.patent?.content_type && (
              <Badge variant="outline" className="text-[10px]">{currentQ.patent.content_type}</Badge>
            )}
            {examType === 'PATENT_BAR' && currentQ.patent?.trap_type && currentQ.patent.trap_type !== 'Unassigned' && (
              <Badge variant="secondary" className="text-[10px]">Trap: {currentQ.patent.trap_type}</Badge>
            )}
            {examType === 'PATENT_BAR' && currentQ.patent?.mpep_revision_reviewed && (
              <span className="text-[10px] text-muted-foreground font-mono">Rev {currentQ.patent.mpep_revision_reviewed}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-muted-foreground flex items-center gap-1">
              <Timer className="h-4 w-4" />
              {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
            </span>
            {sessionData?.score_percent != null && (
              <Badge className={sessionData.score_percent >= 70 ? 'bg-green-600' : sessionData.score_percent >= 50 ? 'bg-yellow-600' : 'bg-red-600'}>
                {sessionData.score_percent}%
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={finishSession}>End Session</Button>
          </div>
        </div>

        {/* Question */}
        <Card className="p-6">
          <p className="text-xs text-muted-foreground mb-3">{currentQ.topic}{currentQ.subtopic ? ` > ${currentQ.subtopic}` : ''}</p>
          {examType === 'PATENT_BAR' && currentQ.patent && (
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              {currentQ.patent.mpep_chapter && (
                <Badge className="text-[10px] font-mono bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100">
                  MPEP Ch. {currentQ.patent.mpep_chapter}
                </Badge>
              )}
              {currentQ.patent.statute_section && (
                <Badge variant="outline" className="text-[10px] font-mono">{currentQ.patent.statute_section}</Badge>
              )}
              {currentQ.patent.mpep_anchor && (
                <span className="text-[10px] text-muted-foreground font-mono">{currentQ.patent.mpep_anchor}</span>
              )}
            </div>
          )}
          <p className="text-lg font-medium mb-3">{currentQ.question_text}</p>
          <p className="text-[11px] text-muted-foreground mb-4">
            Tip: press{' '}
            <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 dark:bg-gray-800">1</kbd>–
            <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 dark:bg-gray-800">5</kbd>{' '}
            to pick, <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 dark:bg-gray-800">Enter</kbd>{' '}
            to {answerResult ? 'go to the next question' : 'submit'}.
          </p>

          {/* Answer options. Treated as a radio group for screen readers
              (aria-radiogroup + role=radio on each option) so SR users
              hear "1 of 5, Option A, selected" instead of "button". */}
          <div
            className="space-y-2"
            role="radiogroup"
            aria-label="Answer choices — press 1 to 5 to select, Enter to submit"
          >
            {currentQ.options?.map((opt: any) => {
              const idx = opt.index;
              const isSelected = selectedAnswer === idx;
              const showResult = answerResult !== null;
              const isCorrect = showResult && idx === answerResult.correct_index;
              const isWrong = showResult && isSelected && !answerResult.is_correct;
              const letter = String.fromCharCode(65 + idx);
              const shortcut = String(idx + 1);

              return (
                <button
                  key={idx}
                  disabled={showResult}
                  onClick={() => setSelectedAnswer(idx)}
                  role="radio"
                  aria-checked={isSelected}
                  aria-keyshortcuts={shortcut}
                  aria-label={`Option ${letter}${isSelected ? ', selected' : ''}: ${opt.text}`}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-offset-gray-950 ${
                    showResult
                      ? isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-950'
                        : isWrong ? 'border-red-500 bg-red-50 dark:bg-red-950'
                        : 'border-muted'
                      : isSelected ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold" aria-hidden="true">
                      {letter}
                    </span>
                    <span className="text-sm">{opt.text}</span>
                    <kbd className="ml-auto px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/5 dark:bg-white/10 text-muted-foreground" aria-hidden="true">
                      {shortcut}
                    </kbd>
                    {showResult && isCorrect && <CheckCircle2 className="h-5 w-5 text-green-600" aria-hidden="true" />}
                    {showResult && isWrong && <X className="h-5 w-5 text-red-600" aria-hidden="true" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation (tutor mode) */}
          {answerResult?.explanation && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg space-y-3">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-2"><Lightbulb className="h-4 w-4" /> Explanation</p>
              <p className="text-sm text-blue-800 dark:text-blue-200">{answerResult.explanation}</p>
              {examType === 'PATENT_BAR' && answerResult.patent?.correct_rule_cite && (
                <p className="text-xs text-blue-900/90 dark:text-blue-100/90 border-t border-blue-200/50 pt-2">
                  <strong>Rule anchor:</strong> {answerResult.patent.correct_rule_cite}
                </p>
              )}
              {examType === 'PATENT_BAR' && answerResult.why_wrong_mpep && (
                <p className="text-xs text-blue-900/90 dark:text-blue-100/90 border-t border-blue-200/50 pt-2">
                  <strong>Why your choice fails (MPEP framing):</strong> {answerResult.why_wrong_mpep}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center gap-2 mt-6 flex-wrap">
            {answerResult && (
              <AddToSrsButton
                question={currentQ}
                answerResult={answerResult}
                examType={examType}
                resolveTopicId={resolveTopicId}
              />
            )}
            {!answerResult ? (
              <Button onClick={submitAnswer} disabled={selectedAnswer === null || loading} className="ml-auto">
                Submit Answer
              </Button>
            ) : (
              <Button onClick={nextQuestion} disabled={loading} className="ml-auto gap-2">
                Next Question <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // ── Results view ──
  if (view === 'results' && results) {
    return (
      <div className="space-y-6">
        <Card className="p-8 text-center">
          <Trophy className="h-12 w-12 mx-auto mb-3 text-yellow-500" />
          <h2 className="text-2xl font-bold mb-1">Session Complete!</h2>
          <p className="text-4xl font-bold my-4">{results.score_percent ?? 0}%</p>
          <div className="flex justify-center gap-6 text-sm">
            <div><span className="font-bold text-green-600">{results.correct_count}</span> correct</div>
            <div><span className="font-bold text-red-600">{results.incorrect_count}</span> incorrect</div>
            <div><span className="font-bold text-muted-foreground">{Math.floor((results.total_time_seconds || 0) / 60)} min</span> total</div>
          </div>
        </Card>

        {/* Review */}
        {results.review?.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-3">Question Review</h3>
            <div className="space-y-3">
              {results.review.map((item: any, i: number) => (
                <Card key={i} className={`p-4 border-l-4 ${item.is_correct ? 'border-l-green-500' : 'border-l-red-500'}`}>
                  <div className="flex items-start gap-3">
                    {item.is_correct ? <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" /> : <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.question_text}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.topic} &middot; {item.time_spent}s</p>
                      {item.explanation && <p className="text-xs mt-2 text-blue-700 dark:text-blue-300">{item.explanation}</p>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <Button onClick={() => { setView('setup'); setResults(null); setSessionId(null); setCurrentQ(null); setAnswerResult(null); setSelectedAnswer(null); }} className="w-full">
          Start New Session
        </Button>
      </div>
    );
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════
// FE EE FULL EXAM SIMULATOR
// ═══════════════════════════════════════════════════════════════

const FE_EE_TOPIC_NAMES = [
  'Mathematics', 'Probability & Statistics', 'Ethics & Professional Practice',
  'Engineering Economics', 'Electrical Materials', 'Engineering Sciences',
  'Circuit Analysis (DC & AC)', 'Linear Systems', 'Signal Processing',
  'Electronics', 'Power Systems', 'Electromagnetics', 'Control Systems',
  'Communications', 'Computer Networks', 'Digital Systems', 'Computer Systems',
  'Software Development',
];

// Sums to 110 (the real NCEES FE Electrical & Computer length). Math (topic 0)
// and Power (topic 10) were below the NCEES minimums (11 and 8); bumped to their
// floors, which also brings the total from 106 up to the correct 110.
const FE_EE_TOPIC_DISTRIBUTION = [11, 4, 4, 4, 4, 4, 11, 6, 6, 7, 8, 6, 7, 6, 6, 7, 5, 4];
const FE_EE_EXAM_TIME = 19200; // 5 hours 20 minutes

function FEEEExamTab() {
  const [phase, setPhase] = useState<'intro' | 'exam' | 'results'>('intro');
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(FE_EE_EXAM_TIME);
  const [results, setResults] = useState<any>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Lazy-load the FE EE question pool (P3-9 stage 3 — task #63). Used
  // only by startExam below. Stays empty until the dynamic import
  // resolves; the Start button disables itself while it's loading so
  // the user can't fire startExam before the data is here.
  const [questionPool, setQuestionPool] = useState<any[]>([]);
  React.useEffect(() => {
    let cancelled = false;
    import('@/lib/fe-ee-qbank-data').then((m) => {
      if (!cancelled) setQuestionPool(m.FE_EE_QUESTIONS);
    });
    return () => { cancelled = true; };
  }, []);

  // Timer
  React.useEffect(() => {
    if (phase !== 'exam') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  // Auto-submit when time runs out
  React.useEffect(() => {
    if (phase === 'exam' && timeLeft === 0) handleSubmit();
  }, [timeLeft, phase]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const startExam = () => {
    if (questionPool.length === 0) return;
    const examQs: any[] = [];
    let idx = 0;
    for (let topicId = 0; topicId < 18; topicId++) {
      const count = FE_EE_TOPIC_DISTRIBUTION[topicId];
      const topicQs = questionPool.filter((q: FEEEQuestion) => q.topicId === topicId);
      const shuffled = shuffle(topicQs).slice(0, count);
      shuffled.forEach(q => { examQs.push({ ...q, examIdx: idx }); idx++; });
    }
    setQuestions(examQs);
    setAnswers({});
    setFlagged(new Set());
    setCurrentIdx(0);
    setTimeLeft(FE_EE_EXAM_TIME);
    setPhase('exam');
  };

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const res: any = { total: questions.length, correct: 0, incorrect: [], byTopic: {}, timeSpent: FE_EE_EXAM_TIME - timeLeft };
    questions.forEach(q => {
      if (!res.byTopic[q.topicId]) res.byTopic[q.topicId] = { correct: 0, total: 0 };
      res.byTopic[q.topicId].total++;
      if (answers[q.examIdx] === q.correct) {
        res.correct++;
        res.byTopic[q.topicId].correct++;
      } else {
        res.incorrect.push({ question: q, userAnswer: answers[q.examIdx] !== undefined ? q.options[answers[q.examIdx]] : 'Not answered', correctAnswer: q.options[q.correct], explanation: q.explanation });
      }
    });
    res.percentage = Math.round((res.correct / res.total) * 100);
    res.passed = res.percentage >= 70;
    // Save to localStorage for analytics (instant/offline) + sync to api-core.
    const feeeEntry = { date: new Date().toISOString(), score: res.percentage, passed: res.passed, correct: res.correct, total: res.total, timeSpent: res.timeSpent, byTopic: res.byTopic };
    const history = JSON.parse(localStorage.getItem('feee_exam_history') || '[]');
    history.push(feeeEntry);
    localStorage.setItem('feee_exam_history', JSON.stringify(history));
    recordExamAttempt('FE_EE', feeeEntry); // best-effort durable/cross-device sync
    setResults(res);
    setPhase('results');
  };

  // INTRO
  if (phase === 'intro') {
    return (
      <div className="space-y-6">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-800 p-8 text-white text-center">
            <Trophy className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">FE Electrical & Computer — Full Practice Exam</h2>
            <p className="text-red-100 text-lg">110 Questions &middot; 5 Hours 20 Minutes</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <p className="text-2xl font-bold text-blue-600">110</p>
                <p className="text-xs text-muted-foreground">Questions</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <p className="text-2xl font-bold text-purple-600">18</p>
                <p className="text-xs text-muted-foreground">Topics</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <p className="text-2xl font-bold text-amber-600">5:20</p>
                <p className="text-xs text-muted-foreground">Hours</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <p className="text-2xl font-bold text-green-600">70%</p>
                <p className="text-xs text-muted-foreground">Est. Pass</p>
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg p-4 text-sm space-y-1">
              <p className="font-semibold text-red-900 dark:text-red-200">Exam Rules:</p>
              <ul className="text-red-800 dark:text-red-300 space-y-1 ml-4 list-disc">
                <li>Questions selected per NCEES weight distribution</li>
                <li>Timer starts immediately — auto-submits at 0:00</li>
                <li>Flag questions for review before submitting</li>
                <li>Results saved locally for analytics tracking</li>
              </ul>
            </div>
            <Button onClick={startExam} disabled={questionPool.length === 0} className="w-full py-6 text-lg font-bold bg-green-600 hover:bg-green-700 disabled:opacity-60">
              {questionPool.length === 0 ? 'Loading questions…' : 'Start Exam Now'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // EXAM
  if (phase === 'exam' && questions.length > 0) {
    const q = questions[currentIdx];
    const answered = Object.keys(answers).length;
    const isFlagged = flagged.has(currentIdx);

    return (
      <div className="space-y-4">
        {/* Timer + Progress */}
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Q {currentIdx + 1} / {questions.length}</span>
              <div className="w-48 bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
              </div>
              <span className="text-xs text-muted-foreground">{answered} answered</span>
            </div>
            <div className={`text-2xl font-mono font-bold ${timeLeft < 600 ? 'text-red-600 animate-pulse' : 'text-gray-900 dark:text-gray-100'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
        </Card>

        {/* Question */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="text-xs">{FE_EE_TOPIC_NAMES[q.topicId]}</Badge>
            <Badge variant="outline" className="text-xs">{q.subtopic}</Badge>
          </div>
          <h3 className="text-lg font-semibold mb-6">{q.question}</h3>
          <div className="space-y-3">
            {q.options.map((opt: string, i: number) => (
              <button key={i} onClick={() => setAnswers(prev => ({ ...prev, [currentIdx]: i }))}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  answers[currentIdx] === i
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                }`}>
                <span className="font-mono text-sm mr-3 text-muted-foreground">{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between mt-6">
            <button onClick={() => { const nf = new Set(flagged); isFlagged ? nf.delete(currentIdx) : nf.add(currentIdx); setFlagged(nf); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isFlagged ? 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
              {isFlagged ? '★ Flagged' : '☆ Flag'}
            </button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={currentIdx === 0} onClick={() => setCurrentIdx(currentIdx - 1)}>← Prev</Button>
              {currentIdx < questions.length - 1
                ? <Button size="sm" onClick={() => setCurrentIdx(currentIdx + 1)}>Next →</Button>
                : <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => { if (confirm('Submit exam? You cannot change answers.')) handleSubmit(); }}>Submit Exam</Button>
              }
            </div>
          </div>
        </Card>

        {/* Navigation Grid */}
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Question Navigator</p>
          <div className="flex flex-wrap gap-1">
            {questions.map((_, i) => (
              <button key={i} onClick={() => setCurrentIdx(i)}
                className={`w-7 h-7 rounded text-[10px] font-bold transition ${
                  i === currentIdx ? 'bg-blue-600 text-white'
                  : flagged.has(i) ? 'bg-amber-400 dark:bg-amber-600 text-amber-900 dark:text-white'
                  : answers[i] !== undefined ? 'bg-green-400 dark:bg-green-600 text-green-900 dark:text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}>
                {i + 1}
              </button>
            ))}
          </div>
          <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded" /> Unanswered</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-400 dark:bg-green-600 rounded" /> Answered</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-400 dark:bg-amber-600 rounded" /> Flagged</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-600 rounded" /> Current</span>
          </div>
        </Card>
      </div>
    );
  }

  // RESULTS
  if (phase === 'results' && results) {
    return (
      <div className="space-y-6">
        <Card className={`overflow-hidden ${results.passed ? 'border-green-500' : 'border-red-500'} border-2`}>
          <div className={`p-8 text-center text-white ${results.passed ? 'bg-gradient-to-r from-green-600 to-emerald-700' : 'bg-gradient-to-r from-red-600 to-red-800'}`}>
            <p className="text-6xl font-black mb-2">{results.percentage}%</p>
            <p className="text-xl">{results.correct} of {results.total} correct</p>
            <p className="mt-2 text-lg font-bold">{results.passed ? '✓ PASS — You\'re ready!' : '⚠ NEEDS REVIEW — Keep studying'}</p>
            <p className="text-sm mt-1 opacity-80">Time: {formatTime(results.timeSpent)} &middot; Avg: {Math.round(results.timeSpent / results.total)}s per question</p>
          </div>
        </Card>

        {/* By Topic */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Performance by Topic</h3>
          <div className="space-y-3">
            {Object.entries(results.byTopic).map(([tid, data]: [string, any]) => {
              const pct = Math.round((data.correct / data.total) * 100);
              return (
                <div key={tid}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{FE_EE_TOPIC_NAMES[Number(tid)]}</span>
                    <span className={pct >= 70 ? 'text-green-600' : 'text-red-600'}>{data.correct}/{data.total} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div className={`h-2 rounded-full ${pct >= 70 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Missed Questions */}
        {results.incorrect.length > 0 && (
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">Review Missed Questions ({results.incorrect.length})</h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {results.incorrect.map((item: any, i: number) => (
                <div key={i} className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="font-medium text-sm mb-1">{item.question.question}</p>
                  <p className="text-xs text-red-600">Your answer: {item.userAnswer}</p>
                  <p className="text-xs text-green-600">Correct: {item.correctAnswer}</p>
                  <p className="text-xs text-muted-foreground mt-1 bg-gray-50 dark:bg-gray-900 p-2 rounded">{item.explanation}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="flex gap-4">
          <Button onClick={() => { setPhase('intro'); setResults(null); }} className="flex-1" variant="outline">Take Another Exam</Button>
          <Button onClick={() => setPhase('intro')} className="flex-1">Back to Intro</Button>
        </div>
      </div>
    );
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════
// FE EE ANALYTICS TAB
// ═══════════════════════════════════════════════════════════════

function FEEEAnalyticsTab() {
  const [history, setHistory] = useState<any[]>([]);

  React.useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('feee_exam_history') || '[]');
    setHistory(stored);
    // Upgrade to durable/cross-device history once api-core responds.
    getExamAttempts('FE_EE').then((remote) => { if (remote.length) setHistory(mergeExamHistory(stored, remote)); });
  }, []);

  const latestByTopic: Record<number, { correct: number; total: number }> = {};
  if (history.length > 0) {
    const latest = history[history.length - 1];
    if (latest.byTopic) {
      Object.entries(latest.byTopic).forEach(([tid, data]: [string, any]) => {
        latestByTopic[Number(tid)] = data;
      });
    }
  }

  const totalAttempts = history.length;
  const avgScore = totalAttempts > 0 ? Math.round(history.reduce((s: number, h: any) => s + h.score, 0) / totalAttempts) : 0;
  const bestScore = totalAttempts > 0 ? Math.max(...history.map((h: any) => h.score)) : 0;
  const passCount = history.filter((h: any) => h.passed).length;

  const weakTopics = Object.entries(latestByTopic)
    .map(([tid, d]) => ({ id: Number(tid), name: FE_EE_TOPIC_NAMES[Number(tid)], pct: Math.round((d.correct / d.total) * 100), correct: d.correct, total: d.total }))
    .sort((a, b) => a.pct - b.pct);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-1">Performance Analytics</h2>
        <p className="text-purple-100 text-sm">Track your FE EE exam preparation progress</p>
      </div>

      {totalAttempts === 0 ? (
        <Card className="p-8 text-center">
          <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No exam attempts yet</h3>
          <p className="text-muted-foreground text-sm">Take a Full Exam to see your performance analytics here.</p>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">{totalAttempts}</p>
              <p className="text-xs text-muted-foreground">Exams Taken</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-purple-600">{avgScore}%</p>
              <p className="text-xs text-muted-foreground">Average Score</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-green-600">{bestScore}%</p>
              <p className="text-xs text-muted-foreground">Best Score</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-amber-600">{passCount}/{totalAttempts}</p>
              <p className="text-xs text-muted-foreground">Pass Rate</p>
            </Card>
          </div>

          {/* Exam History */}
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">Exam History</h3>
            <div className="space-y-2">
              {[...history].reverse().map((h: any, i: number) => (
                <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <span className="text-sm text-muted-foreground">{new Date(h.date).toLocaleDateString()} {new Date(h.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="font-bold">{h.score}%</span>
                  <span className="text-sm">{h.correct}/{h.total}</span>
                  <Badge className={h.passed ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}>
                    {h.passed ? 'PASS' : 'REVIEW'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Performance by Topic (latest exam) */}
          {weakTopics.length > 0 && (
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Latest Exam — Performance by Topic</h3>
              <div className="space-y-3">
                {weakTopics.map(t => (
                  <div key={t.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{t.name}</span>
                      <span className={t.pct >= 70 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{t.correct}/{t.total} ({t.pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5">
                      <div className={`h-2.5 rounded-full transition-all ${t.pct >= 70 ? 'bg-green-500' : t.pct >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${t.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Weakest Areas */}
          {weakTopics.length > 0 && (
            <Card className="p-6 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900">
              <h3 className="font-bold text-lg mb-3 text-orange-900 dark:text-orange-200">Areas for Improvement</h3>
              <div className="space-y-2">
                {weakTopics.filter(t => t.pct < 70).slice(0, 5).map(t => (
                  <div key={t.id} className="flex justify-between items-center">
                    <span className="text-orange-800 dark:text-orange-200 text-sm">{t.name}</span>
                    <span className="font-semibold text-orange-600">{t.pct}%</span>
                  </div>
                ))}
                {weakTopics.filter(t => t.pct < 70).length === 0 && (
                  <p className="text-green-700 dark:text-green-300 text-sm font-medium">All topics at 70% or above — great work!</p>
                )}
              </div>
            </Card>
          )}

          {/* Clear History */}
          <div className="text-center">
            <button onClick={() => { if (confirm('Clear all exam history?')) { localStorage.removeItem('feee_exam_history'); setHistory([]); } }}
              className="text-xs text-muted-foreground hover:text-red-500 transition">
              Clear exam history
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPTIA SECURITY+ — FULL PRACTICE EXAM + ANALYTICS
// ═══════════════════════════════════════════════════════════════
// 90-question timed mock mirroring the FE EE simulator. Domains follow the
// SY0-701 taxonomy (5 domains, topicId 0–4). The distribution matches the
// official SY0-701 exam weights (GSC 12% / Threats 22% / Arch 18% / Ops 28% /
// Mgmt 20%) and sums to 90. Question supply per domain (35/75/93/144/105)
// comfortably sustains a full-length draw with variety.
const SECPLUS_TOPIC_NAMES = [
  'General Security Concepts',
  'Threats, Vulnerabilities & Mitigations',
  'Security Architecture',
  'Security Operations',
  'Security Program Management',
];
// SY0-701 exam weights, matching exam-config.ts SECURITY_PLUS.sections by
// topicId order 0–4. Sums to 90.
const SECPLUS_TOPIC_DISTRIBUTION = [11, 20, 16, 25, 18]; // = 90 questions
const SECPLUS_EXAM_TIME = 5400; // 90 minutes
const SECPLUS_PASS_PCT = 75;    // practice benchmark (labeled "Est. Pass")

function SECPLUSExamTab() {
  const [phase, setPhase] = useState<'intro' | 'exam' | 'results'>('intro');
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<number, number | number[]>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SECPLUS_EXAM_TIME);
  const [results, setResults] = useState<any>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Lazy-load the Security+ question pool (same pattern as the FE EE tab).
  const [questionPool, setQuestionPool] = useState<any[]>([]);
  const [pbqPool, setPbqPool] = useState<any[]>([]);
  React.useEffect(() => {
    let cancelled = false;
    import('@/lib/security-plus-qbank-data').then((m) => {
      if (!cancelled) { setQuestionPool(m.SECPLUS_QUESTIONS); setPbqPool(m.SECPLUS_PBQ_QUESTIONS); }
    });
    return () => { cancelled = true; };
  }, []);

  React.useEffect(() => {
    if (phase !== 'exam') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  React.useEffect(() => {
    if (phase === 'exam' && timeLeft === 0) handleSubmit();
  }, [timeLeft, phase]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const startExam = () => {
    if (questionPool.length === 0) return;
    const examQs: any[] = [];
    let idx = 0;
    for (let topicId = 0; topicId < 5; topicId++) {
      const count = SECPLUS_TOPIC_DISTRIBUTION[topicId];
      const topicQs = questionPool.filter((q: any) => q.topicId === topicId);
      const shuffled = shuffle(topicQs).slice(0, count);
      shuffled.forEach(q => { examQs.push({ ...q, examIdx: idx }); idx++; });
    }
    // Append the multi-select / performance-based items after the 90 MCQ.
    pbqPool.forEach((q: any) => { examQs.push({ ...q, examIdx: idx }); idx++; });
    setQuestions(examQs);
    setAnswers({});
    setFlagged(new Set());
    setCurrentIdx(0);
    setTimeLeft(SECPLUS_EXAM_TIME);
    setPhase('exam');
  };

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const res: any = { total: questions.length, correct: 0, incorrect: [], byTopic: {}, timeSpent: SECPLUS_EXAM_TIME - timeLeft };
    questions.forEach(q => {
      if (!res.byTopic[q.topicId]) res.byTopic[q.topicId] = { correct: 0, total: 0 };
      res.byTopic[q.topicId].total++;
      const a = answers[q.examIdx];
      let isCorrect: boolean;
      if (q.type === 'multi') {
        const sel = Array.isArray(a) ? [...a].sort((x, y) => x - y) : [];
        const want = [...(q.correctAnswers || [])].sort((x: number, y: number) => x - y);
        isCorrect = sel.length === want.length && sel.every((v, i) => v === want[i]);
      } else {
        isCorrect = a === q.correct;
      }
      if (isCorrect) {
        res.correct++;
        res.byTopic[q.topicId].correct++;
      } else {
        const userAnswer = q.type === 'multi'
          ? (Array.isArray(a) && a.length ? a.map((i: number) => q.options[i]).join('; ') : 'Not answered')
          : (a !== undefined ? q.options[a as number] : 'Not answered');
        const correctAnswer = q.type === 'multi'
          ? (q.correctAnswers || []).map((i: number) => q.options[i]).join('; ')
          : q.options[q.correct];
        res.incorrect.push({ question: q, userAnswer, correctAnswer, explanation: q.explanation });
      }
    });
    res.percentage = Math.round((res.correct / res.total) * 100);
    res.passed = res.percentage >= SECPLUS_PASS_PCT;
    // Save to localStorage for analytics (instant/offline) + sync to api-core.
    const secplusEntry = { date: new Date().toISOString(), score: res.percentage, passed: res.passed, correct: res.correct, total: res.total, timeSpent: res.timeSpent, byTopic: res.byTopic };
    const history = JSON.parse(localStorage.getItem('secplus_exam_history') || '[]');
    history.push(secplusEntry);
    localStorage.setItem('secplus_exam_history', JSON.stringify(history));
    recordExamAttempt('SECURITY_PLUS', secplusEntry); // best-effort durable/cross-device sync
    setResults(res);
    setPhase('results');
  };

  // INTRO
  if (phase === 'intro') {
    return (
      <div className="space-y-6">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-800 p-8 text-white text-center">
            <Trophy className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">CompTIA Security+ — Full Practice Exam</h2>
            <p className="text-blue-100 text-lg">90 Multiple-Choice + 6 Multi-Select &middot; 90 Minutes</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <p className="text-2xl font-bold text-blue-600">90</p>
                <p className="text-xs text-muted-foreground">Questions</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <p className="text-2xl font-bold text-purple-600">5</p>
                <p className="text-xs text-muted-foreground">Domains</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <p className="text-2xl font-bold text-amber-600">1:30</p>
                <p className="text-xs text-muted-foreground">Hours</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <p className="text-2xl font-bold text-green-600">{SECPLUS_PASS_PCT}%</p>
                <p className="text-xs text-muted-foreground">Est. Pass</p>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4 text-sm space-y-1">
              <p className="font-semibold text-blue-900 dark:text-blue-200">Exam Rules:</p>
              <ul className="text-blue-800 dark:text-blue-300 space-y-1 ml-4 list-disc">
                <li>Questions weighted across the 5 Security+ domains</li>
                <li>Timer starts immediately — auto-submits at 0:00</li>
                <li>Flag questions for review before submitting</li>
                <li>Results saved locally and synced to your account</li>
              </ul>
            </div>
            <Button onClick={startExam} disabled={questionPool.length === 0} className="w-full py-6 text-lg font-bold bg-green-600 hover:bg-green-700 disabled:opacity-60">
              {questionPool.length === 0 ? 'Loading questions…' : 'Start Exam Now'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // EXAM
  if (phase === 'exam' && questions.length > 0) {
    const q = questions[currentIdx];
    const answered = Object.keys(answers).length;
    const isFlagged = flagged.has(currentIdx);

    return (
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Q {currentIdx + 1} / {questions.length}</span>
              <div className="w-48 bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
              </div>
              <span className="text-xs text-muted-foreground">{answered} answered</span>
            </div>
            <div className={`text-2xl font-mono font-bold ${timeLeft < 600 ? 'text-red-600 animate-pulse' : 'text-gray-900 dark:text-gray-100'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="text-xs">{SECPLUS_TOPIC_NAMES[q.topicId]}</Badge>
            <Badge variant="outline" className="text-xs">{q.subtopic}</Badge>
            {q.type === 'multi' && <Badge className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Select all that apply</Badge>}
          </div>
          <h3 className="text-lg font-semibold mb-6">{q.question}</h3>
          <div className="space-y-3">
            {q.options.map((opt: string, i: number) => {
              const cur = answers[currentIdx];
              const selected = q.type === 'multi' ? (Array.isArray(cur) && cur.includes(i)) : cur === i;
              const toggle = () => setAnswers(prev => {
                if (q.type === 'multi') {
                  const arr = Array.isArray(prev[currentIdx]) ? [...(prev[currentIdx] as number[])] : [];
                  const at = arr.indexOf(i);
                  if (at >= 0) arr.splice(at, 1); else arr.push(i);
                  return { ...prev, [currentIdx]: arr };
                }
                return { ...prev, [currentIdx]: i };
              });
              return (
                <button key={i} onClick={toggle}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                  }`}>
                  <span className="font-mono text-sm mr-3 text-muted-foreground">{q.type === 'multi' ? (selected ? '☑' : '☐') : String.fromCharCode(65 + i)}</span>
                  {opt}
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-6">
            <button onClick={() => { const nf = new Set(flagged); isFlagged ? nf.delete(currentIdx) : nf.add(currentIdx); setFlagged(nf); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isFlagged ? 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
              {isFlagged ? '★ Flagged' : '☆ Flag'}
            </button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={currentIdx === 0} onClick={() => setCurrentIdx(currentIdx - 1)}>← Prev</Button>
              {currentIdx < questions.length - 1
                ? <Button size="sm" onClick={() => setCurrentIdx(currentIdx + 1)}>Next →</Button>
                : <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => { if (confirm('Submit exam? You cannot change answers.')) handleSubmit(); }}>Submit Exam</Button>
              }
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Question Navigator</p>
          <div className="flex flex-wrap gap-1">
            {questions.map((_, i) => (
              <button key={i} onClick={() => setCurrentIdx(i)}
                className={`w-7 h-7 rounded text-[10px] font-bold transition ${
                  i === currentIdx ? 'bg-blue-600 text-white'
                  : flagged.has(i) ? 'bg-amber-400 dark:bg-amber-600 text-amber-900 dark:text-white'
                  : answers[i] !== undefined ? 'bg-green-400 dark:bg-green-600 text-green-900 dark:text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}>
                {i + 1}
              </button>
            ))}
          </div>
          <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded" /> Unanswered</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-400 dark:bg-green-600 rounded" /> Answered</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-400 dark:bg-amber-600 rounded" /> Flagged</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-600 rounded" /> Current</span>
          </div>
        </Card>
      </div>
    );
  }

  // RESULTS
  if (phase === 'results' && results) {
    return (
      <div className="space-y-6">
        <Card className={`overflow-hidden ${results.passed ? 'border-green-500' : 'border-red-500'} border-2`}>
          <div className={`p-8 text-center text-white ${results.passed ? 'bg-gradient-to-r from-green-600 to-emerald-700' : 'bg-gradient-to-r from-red-600 to-red-800'}`}>
            <p className="text-6xl font-black mb-2">{results.percentage}%</p>
            <p className="text-xl">{results.correct} of {results.total} correct</p>
            <p className="mt-2 text-lg font-bold">{results.passed ? '✓ PASS — You\'re ready!' : '⚠ NEEDS REVIEW — Keep studying'}</p>
            <p className="text-sm mt-1 opacity-80">Time: {formatTime(results.timeSpent)} &middot; Avg: {Math.round(results.timeSpent / results.total)}s per question</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Performance by Domain</h3>
          <div className="space-y-3">
            {Object.entries(results.byTopic).map(([tid, data]: [string, any]) => {
              const pct = Math.round((data.correct / data.total) * 100);
              return (
                <div key={tid}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{SECPLUS_TOPIC_NAMES[Number(tid)]}</span>
                    <span className={pct >= 70 ? 'text-green-600' : 'text-red-600'}>{data.correct}/{data.total} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div className={`h-2 rounded-full ${pct >= 70 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {results.incorrect.length > 0 && (
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">Review Missed Questions ({results.incorrect.length})</h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {results.incorrect.map((item: any, i: number) => (
                <div key={i} className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="font-medium text-sm mb-1">{item.question.question}</p>
                  <p className="text-xs text-red-600">Your answer: {item.userAnswer}</p>
                  <p className="text-xs text-green-600">Correct: {item.correctAnswer}</p>
                  <p className="text-xs text-muted-foreground mt-1 bg-gray-50 dark:bg-gray-900 p-2 rounded">{item.explanation}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="flex gap-4">
          <Button onClick={() => { setPhase('intro'); setResults(null); }} className="flex-1" variant="outline">Take Another Exam</Button>
          <Button onClick={() => setPhase('intro')} className="flex-1">Back to Intro</Button>
        </div>
      </div>
    );
  }

  return null;
}

function SECPLUSAnalyticsTab() {
  const [history, setHistory] = useState<any[]>([]);
  React.useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('secplus_exam_history') || '[]');
    setHistory(stored);
    getExamAttempts('SECURITY_PLUS').then((remote) => { if (remote.length) setHistory(mergeExamHistory(stored, remote)); });
  }, []);

  const latestByTopic: Record<number, { correct: number; total: number }> = {};
  if (history.length > 0) {
    const latest = history[history.length - 1];
    if (latest.byTopic) {
      Object.entries(latest.byTopic).forEach(([tid, data]: [string, any]) => {
        latestByTopic[Number(tid)] = data;
      });
    }
  }

  const totalAttempts = history.length;
  const avgScore = totalAttempts > 0 ? Math.round(history.reduce((s: number, h: any) => s + h.score, 0) / totalAttempts) : 0;
  const bestScore = totalAttempts > 0 ? Math.max(...history.map((h: any) => h.score)) : 0;
  const passCount = history.filter((h: any) => h.passed).length;

  const weakTopics = Object.entries(latestByTopic)
    .map(([tid, d]) => ({ id: Number(tid), name: SECPLUS_TOPIC_NAMES[Number(tid)], pct: Math.round((d.correct / d.total) * 100), correct: d.correct, total: d.total }))
    .sort((a, b) => a.pct - b.pct);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-1">Security+ Performance Analytics</h2>
        <p className="text-indigo-100 text-sm">Track your CompTIA Security+ exam preparation progress</p>
      </div>

      {totalAttempts === 0 ? (
        <Card className="p-8 text-center">
          <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No exam attempts yet</h3>
          <p className="text-muted-foreground text-sm">Take a Full Exam to see your performance analytics here.</p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">{totalAttempts}</p>
              <p className="text-xs text-muted-foreground">Exams Taken</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-purple-600">{avgScore}%</p>
              <p className="text-xs text-muted-foreground">Average Score</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-green-600">{bestScore}%</p>
              <p className="text-xs text-muted-foreground">Best Score</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-amber-600">{passCount}/{totalAttempts}</p>
              <p className="text-xs text-muted-foreground">Pass Rate</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">Exam History</h3>
            <div className="space-y-2">
              {[...history].reverse().map((h: any, i: number) => (
                <div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <span className="text-sm text-muted-foreground">{new Date(h.date).toLocaleDateString()} {new Date(h.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="font-bold">{h.score}%</span>
                  <span className="text-sm">{h.correct}/{h.total}</span>
                  <Badge className={h.passed ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}>
                    {h.passed ? 'PASS' : 'REVIEW'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {weakTopics.length > 0 && (
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Latest Exam — Performance by Domain</h3>
              <div className="space-y-3">
                {weakTopics.map(t => (
                  <div key={t.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{t.name}</span>
                      <span className={t.pct >= 70 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{t.correct}/{t.total} ({t.pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5">
                      <div className={`h-2.5 rounded-full transition-all ${t.pct >= 70 ? 'bg-green-500' : t.pct >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${t.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {weakTopics.length > 0 && (
            <Card className="p-6 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900">
              <h3 className="font-bold text-lg mb-3 text-orange-900 dark:text-orange-200">Areas for Improvement</h3>
              <div className="space-y-2">
                {weakTopics.filter(t => t.pct < 70).slice(0, 5).map(t => (
                  <div key={t.id} className="flex justify-between items-center">
                    <span className="text-orange-800 dark:text-orange-200 text-sm">{t.name}</span>
                    <span className="font-semibold text-orange-600">{t.pct}%</span>
                  </div>
                ))}
                {weakTopics.filter(t => t.pct < 70).length === 0 && (
                  <p className="text-green-700 dark:text-green-300 text-sm font-medium">All domains at 70% or above — great work!</p>
                )}
              </div>
            </Card>
          )}

          <div className="text-center">
            <button onClick={() => { if (confirm('Clear all exam history?')) { localStorage.removeItem('secplus_exam_history'); setHistory([]); } }}
              className="text-xs text-muted-foreground hover:text-red-500 transition">
              Clear exam history
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FE ME FULL EXAM SIMULATOR + ANALYTICS
// ═══════════════════════════════════════════════════════════════

const FME_TOPIC_NAMES = ['Mathematics','Probability & Statistics','Computational Tools','Ethics & Professional Practice','Engineering Economics','Statics','Dynamics, Kinematics & Vibrations','Mechanics of Materials','Material Science','Fluid Mechanics','Thermodynamics','Heat Transfer','Measurements & Controls','Mechanical Design & Analysis','Manufacturing Processes','Engineering Management'];
// Sums to 110 (the real NCEES FE Mechanical length). The five largest
// knowledge areas each took +1 to lift the total from 105 to 110 while
// keeping the draw proportional to NCEES weighting.
const FME_TOPIC_DISTRIBUTION = [7,4,3,4,4,10,11,10,6,10,9,8,6,11,4,3];
const FME_EXAM_TIME = 19200;

function FMEExamTab() {
  const [phase, setPhase] = useState<'intro' | 'exam' | 'results'>('intro');
  const [questions, setQuestions] = useState<any[]>([]); const [answers, setAnswers] = useState<Record<number, number>>({}); const [flagged, setFlagged] = useState<Set<number>>(new Set()); const [currentIdx, setCurrentIdx] = useState(0); const [timeLeft, setTimeLeft] = useState(FME_EXAM_TIME); const [results, setResults] = useState<any>(null); const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  // Lazy-loaded FME question pool (P3-9 stage 3).
  const [questionPool, setQuestionPool] = useState<any[]>([]);
  React.useEffect(() => { let cancelled = false; import('@/lib/fme-qbank-data').then((m) => { if (!cancelled) setQuestionPool(m.FME_QUESTIONS); }); return () => { cancelled = true; }; }, []);
  React.useEffect(() => { if (phase !== 'exam') return; timerRef.current = setInterval(() => { setTimeLeft(prev => { if (prev <= 1) { clearInterval(timerRef.current!); return 0; } return prev - 1; }); }, 1000); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, [phase]);
  React.useEffect(() => { if (phase === 'exam' && timeLeft === 0) handleSubmit(); }, [timeLeft, phase]);
  const formatTime = (s: number) => { const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); const sec = s % 60; return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`; };
  const startExam = () => { if (questionPool.length === 0) return; const examQs: any[] = []; let idx = 0; for (let tid = 0; tid < 16; tid++) { const count = FME_TOPIC_DISTRIBUTION[tid]; const tQs = questionPool.filter((q: any) => q.topicId === tid); const sh = shuffle(tQs).slice(0, count); sh.forEach((q: any) => { examQs.push({ ...q, examIdx: idx }); idx++; }); } setQuestions(examQs); setAnswers({}); setFlagged(new Set()); setCurrentIdx(0); setTimeLeft(FME_EXAM_TIME); setPhase('exam'); };
  const handleSubmit = () => { if (timerRef.current) clearInterval(timerRef.current); const res: any = { total: questions.length, correct: 0, incorrect: [], byTopic: {}, timeSpent: FME_EXAM_TIME - timeLeft }; questions.forEach(q => { if (!res.byTopic[q.topicId]) res.byTopic[q.topicId] = { correct: 0, total: 0 }; res.byTopic[q.topicId].total++; if (answers[q.examIdx] === q.correct) { res.correct++; res.byTopic[q.topicId].correct++; } else { res.incorrect.push({ question: q, userAnswer: answers[q.examIdx] !== undefined ? q.options[answers[q.examIdx]] : 'Not answered', correctAnswer: q.options[q.correct], explanation: q.explanation }); } }); res.percentage = Math.round((res.correct / res.total) * 100); res.passed = res.percentage >= 70; const fmeEntry = { date: new Date().toISOString(), score: res.percentage, passed: res.passed, correct: res.correct, total: res.total, timeSpent: res.timeSpent, byTopic: res.byTopic }; const hist = JSON.parse(localStorage.getItem('fme_exam_history') || '[]'); hist.push(fmeEntry); localStorage.setItem('fme_exam_history', JSON.stringify(hist)); recordExamAttempt('FME', fmeEntry); setResults(res); setPhase('results'); };
  if (phase === 'intro') return (<div className="space-y-6"><Card className="overflow-hidden"><div className="bg-gradient-to-r from-orange-600 to-red-700 p-8 text-white text-center"><Trophy className="h-12 w-12 mx-auto mb-4" /><h2 className="text-3xl font-bold mb-2">FE Mechanical Engineering — Full Practice Exam</h2><p className="text-orange-100 text-lg">110 Questions &middot; 5 Hours 20 Minutes</p></div><div className="p-6 space-y-4"><div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center"><div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4"><p className="text-2xl font-bold text-blue-600">110</p><p className="text-xs text-muted-foreground">Questions</p></div><div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4"><p className="text-2xl font-bold text-purple-600">16</p><p className="text-xs text-muted-foreground">Topics</p></div><div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4"><p className="text-2xl font-bold text-amber-600">5:20</p><p className="text-xs text-muted-foreground">Hours</p></div><div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4"><p className="text-2xl font-bold text-green-600">70%</p><p className="text-xs text-muted-foreground">Est. Pass</p></div></div><Button onClick={startExam} disabled={questionPool.length === 0} className="w-full py-6 text-lg font-bold bg-green-600 hover:bg-green-700 disabled:opacity-60">{questionPool.length === 0 ? 'Loading questions…' : 'Start Exam Now'}</Button></div></Card></div>);
  if (phase === 'exam' && questions.length > 0) { const q = questions[currentIdx]; const answered = Object.keys(answers).length; const isFl = flagged.has(currentIdx); return (<div className="space-y-4"><Card className="p-4"><div className="flex justify-between items-center"><div className="flex items-center gap-4"><span className="text-sm font-medium">Q {currentIdx+1} / {questions.length}</span><div className="w-48 bg-gray-200 dark:bg-gray-800 rounded-full h-2"><div className="bg-orange-600 h-2 rounded-full transition-all" style={{width:`${((currentIdx+1)/questions.length)*100}%`}}/></div><span className="text-xs text-muted-foreground">{answered} answered</span></div><div className={`text-2xl font-mono font-bold ${timeLeft<600?'text-red-600 animate-pulse':'text-gray-900 dark:text-gray-100'}`}>{formatTime(timeLeft)}</div></div></Card><Card className="p-6"><div className="flex items-center gap-2 mb-4"><Badge variant="secondary" className="text-xs">{FME_TOPIC_NAMES[q.topicId]}</Badge><Badge variant="outline" className="text-xs">{q.subtopic}</Badge></div><h3 className="text-lg font-semibold mb-6">{q.question}</h3><div className="space-y-3">{q.options.map((opt:string,i:number)=>(<button key={i} onClick={()=>setAnswers(p=>({...p,[currentIdx]:i}))} className={`w-full text-left p-4 rounded-lg border-2 transition-all ${answers[currentIdx]===i?'border-orange-500 bg-orange-50 dark:bg-orange-950/30':'border-gray-200 dark:border-gray-700 hover:border-gray-400'}`}><span className="font-mono text-sm mr-3 text-muted-foreground">{String.fromCharCode(65+i)}</span>{opt}</button>))}</div><div className="flex items-center justify-between mt-6"><button onClick={()=>{const nf=new Set(flagged);isFl?nf.delete(currentIdx):nf.add(currentIdx);setFlagged(nf);}} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isFl?'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100':'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>{isFl?'★ Flagged':'☆ Flag'}</button><div className="flex gap-2"><Button variant="outline" size="sm" disabled={currentIdx===0} onClick={()=>setCurrentIdx(currentIdx-1)}>← Prev</Button>{currentIdx<questions.length-1?<Button size="sm" onClick={()=>setCurrentIdx(currentIdx+1)}>Next →</Button>:<Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>{if(confirm('Submit exam?'))handleSubmit();}}>Submit</Button>}</div></div></Card><Card className="p-4"><p className="text-xs font-medium text-muted-foreground mb-2">Navigator</p><div className="flex flex-wrap gap-1">{questions.map((_:any,i:number)=>(<button key={i} onClick={()=>setCurrentIdx(i)} className={`w-7 h-7 rounded text-[10px] font-bold transition ${i===currentIdx?'bg-orange-600 text-white':flagged.has(i)?'bg-amber-400 dark:bg-amber-600 text-amber-900 dark:text-white':answers[i]!==undefined?'bg-green-400 dark:bg-green-600 text-green-900 dark:text-white':'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>{i+1}</button>))}</div></Card></div>); }
  if (phase === 'results' && results) return (<div className="space-y-6"><Card className={`overflow-hidden ${results.passed?'border-green-500':'border-red-500'} border-2`}><div className={`p-8 text-center text-white ${results.passed?'bg-gradient-to-r from-green-600 to-emerald-700':'bg-gradient-to-r from-red-600 to-red-800'}`}><p className="text-6xl font-black mb-2">{results.percentage}%</p><p className="text-xl">{results.correct} of {results.total} correct</p><p className="mt-2 text-lg font-bold">{results.passed?'✓ PASS':'⚠ NEEDS REVIEW'}</p></div></Card><Card className="p-6"><h3 className="font-bold text-lg mb-4">By Topic</h3><div className="space-y-3">{Object.entries(results.byTopic).map(([tid,data]:[string,any])=>{const pct=Math.round((data.correct/data.total)*100);return(<div key={tid}><div className="flex justify-between text-sm mb-1"><span className="font-medium">{FME_TOPIC_NAMES[Number(tid)]}</span><span className={pct>=70?'text-green-600':'text-red-600'}>{data.correct}/{data.total} ({pct}%)</span></div><div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2"><div className={`h-2 rounded-full ${pct>=70?'bg-green-500':'bg-red-500'}`} style={{width:`${pct}%`}}/></div></div>);})}</div></Card>{results.incorrect.length>0&&(<Card className="p-6"><h3 className="font-bold text-lg mb-4">Missed ({results.incorrect.length})</h3><div className="space-y-4 max-h-[500px] overflow-y-auto">{results.incorrect.map((item:any,i:number)=>(<div key={i} className="border-l-4 border-red-500 pl-4 py-2"><p className="font-medium text-sm mb-1">{item.question.question}</p><p className="text-xs text-red-600">You: {item.userAnswer}</p><p className="text-xs text-green-600">Correct: {item.correctAnswer}</p><p className="text-xs text-muted-foreground mt-1 bg-gray-50 dark:bg-gray-900 p-2 rounded">{item.explanation}</p></div>))}</div></Card>)}<Button onClick={()=>{setPhase('intro');setResults(null);}} className="w-full" variant="outline">Take Another</Button></div>);
  return null;
}

function FMEAnalyticsTab() {
  const [history, setHistory] = useState<any[]>([]); React.useEffect(() => { const stored = JSON.parse(localStorage.getItem('fme_exam_history') || '[]'); setHistory(stored); getExamAttempts('FME').then((remote) => { if (remote.length) setHistory(mergeExamHistory(stored, remote)); }); }, []);
  const latestByTopic: Record<number, {correct:number;total:number}> = {}; if (history.length > 0) { const latest = history[history.length-1]; if (latest.byTopic) Object.entries(latest.byTopic).forEach(([tid,data]:[string,any]) => { latestByTopic[Number(tid)] = data; }); }
  const totalAttempts = history.length; const avgScore = totalAttempts > 0 ? Math.round(history.reduce((s:number,h:any)=>s+h.score,0)/totalAttempts) : 0; const bestScore = totalAttempts > 0 ? Math.max(...history.map((h:any)=>h.score)) : 0; const passCount = history.filter((h:any)=>h.passed).length;
  const weakTopics = Object.entries(latestByTopic).map(([tid,d])=>({id:Number(tid),name:FME_TOPIC_NAMES[Number(tid)],pct:Math.round((d.correct/d.total)*100),correct:d.correct,total:d.total})).sort((a,b)=>a.pct-b.pct);
  return (<div className="space-y-6"><div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white"><h2 className="text-2xl font-bold mb-1">FE ME Performance Analytics</h2><p className="text-orange-100 text-sm">Track your Mechanical Engineering exam preparation</p></div>{totalAttempts===0?(<Card className="p-8 text-center"><BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4"/><h3 className="text-lg font-semibold mb-2">No exam attempts yet</h3><p className="text-muted-foreground text-sm">Take a Full Exam to see analytics.</p></Card>):(<><div className="grid grid-cols-2 md:grid-cols-4 gap-4"><Card className="p-4 text-center"><p className="text-3xl font-bold text-blue-600">{totalAttempts}</p><p className="text-xs text-muted-foreground">Exams</p></Card><Card className="p-4 text-center"><p className="text-3xl font-bold text-purple-600">{avgScore}%</p><p className="text-xs text-muted-foreground">Average</p></Card><Card className="p-4 text-center"><p className="text-3xl font-bold text-green-600">{bestScore}%</p><p className="text-xs text-muted-foreground">Best</p></Card><Card className="p-4 text-center"><p className="text-3xl font-bold text-amber-600">{passCount}/{totalAttempts}</p><p className="text-xs text-muted-foreground">Pass Rate</p></Card></div><Card className="p-6"><h3 className="font-bold text-lg mb-4">Exam History</h3><div className="space-y-2">{[...history].reverse().map((h:any,i:number)=>(<div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"><span className="text-sm text-muted-foreground">{new Date(h.date).toLocaleDateString()}</span><span className="font-bold">{h.score}%</span><Badge className={h.passed?'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}>{h.passed?'PASS':'REVIEW'}</Badge></div>))}</div></Card>{weakTopics.length>0&&(<Card className="p-6"><h3 className="font-bold text-lg mb-4">Latest — By Topic</h3><div className="space-y-3">{weakTopics.map(t=>(<div key={t.id}><div className="flex justify-between text-sm mb-1"><span className="font-medium">{t.name}</span><span className={t.pct>=70?'text-green-600 font-semibold':'text-red-600 font-semibold'}>{t.correct}/{t.total} ({t.pct}%)</span></div><div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5"><div className={`h-2.5 rounded-full ${t.pct>=70?'bg-green-500':t.pct>=50?'bg-amber-500':'bg-red-500'}`} style={{width:`${t.pct}%`}}/></div></div>))}</div></Card>)}<div className="text-center"><button onClick={()=>{if(confirm('Clear history?')){localStorage.removeItem('fme_exam_history');setHistory([]);}}} className="text-xs text-muted-foreground hover:text-red-500 transition">Clear history</button></div></>)}</div>);
}

// ═══════════════════════════════════════════════════════════════
// PE EE FULL EXAM SIMULATOR + ANALYTICS
// ═══════════════════════════════════════════════════════════════

const PEE_TOPIC_NAMES = ['General Power Engineering','Measurement & Instrumentation','Circuit Analysis','Rotating Machines & Drives','Electromagnetic Devices','Transmission & Distribution','Protection','Power Quality & Reliability','Codes & Standards','Power System Analysis'];
const PEE_TOPIC_DISTRIBUTION = [7,6,8,10,7,10,10,6,8,8];
const PEE_EXAM_TIME = 28800; // 8 hours in seconds

function PEEEExamTab() {
  const [phase, setPhase] = useState<'intro' | 'exam' | 'results'>('intro');
  const [questions, setQuestions] = useState<any[]>([]); const [answers, setAnswers] = useState<Record<number, number>>({}); const [flagged, setFlagged] = useState<Set<number>>(new Set()); const [currentIdx, setCurrentIdx] = useState(0); const [timeLeft, setTimeLeft] = useState(PEE_EXAM_TIME); const [results, setResults] = useState<any>(null); const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  // Lazy-loaded PE EE (Power) question pool (P3-9 stage 3).
  const [questionPool, setQuestionPool] = useState<any[]>([]);
  React.useEffect(() => { let cancelled = false; import('@/lib/pe-ee-qbank-data').then((m) => { if (!cancelled) setQuestionPool(m.PE_EE_QUESTIONS); }); return () => { cancelled = true; }; }, []);
  React.useEffect(() => { if (phase !== 'exam') return; timerRef.current = setInterval(() => { setTimeLeft(prev => { if (prev <= 1) { clearInterval(timerRef.current!); return 0; } return prev - 1; }); }, 1000); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, [phase]);
  React.useEffect(() => { if (phase === 'exam' && timeLeft === 0) handleSubmit(); }, [timeLeft, phase]);
  const formatTime = (s: number) => { const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); const sec = s % 60; return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`; };
  const startExam = () => { if (questionPool.length === 0) return; const examQs: any[] = []; let idx = 0; for (let tid = 0; tid < 10; tid++) { const count = PEE_TOPIC_DISTRIBUTION[tid]; const tQs = questionPool.filter((q: any) => q.topicId === tid); const sh = shuffle(tQs).slice(0, count); sh.forEach((q: any) => { examQs.push({ ...q, examIdx: idx }); idx++; }); } setQuestions(examQs); setAnswers({}); setFlagged(new Set()); setCurrentIdx(0); setTimeLeft(PEE_EXAM_TIME); setPhase('exam'); };
  const handleSubmit = () => { if (timerRef.current) clearInterval(timerRef.current); const res: any = { total: questions.length, correct: 0, incorrect: [], byTopic: {}, timeSpent: PEE_EXAM_TIME - timeLeft }; questions.forEach(q => { if (!res.byTopic[q.topicId]) res.byTopic[q.topicId] = { correct: 0, total: 0 }; res.byTopic[q.topicId].total++; if (answers[q.examIdx] === q.correct) { res.correct++; res.byTopic[q.topicId].correct++; } else { res.incorrect.push({ question: q, userAnswer: answers[q.examIdx] !== undefined ? q.options[answers[q.examIdx]] : 'Not answered', correctAnswer: q.options[q.correct], explanation: q.explanation }); } }); res.percentage = Math.round((res.correct / res.total) * 100); res.passed = res.percentage >= 60; const peeeEntry = { date: new Date().toISOString(), score: res.percentage, passed: res.passed, correct: res.correct, total: res.total, timeSpent: res.timeSpent, byTopic: res.byTopic }; const hist = JSON.parse(localStorage.getItem('peee_exam_history') || '[]'); hist.push(peeeEntry); localStorage.setItem('peee_exam_history', JSON.stringify(hist)); recordExamAttempt('PE_EE', peeeEntry); setResults(res); setPhase('results'); };
  if (phase === 'intro') return (<div className="space-y-6"><Card className="overflow-hidden"><div className="bg-gradient-to-r from-yellow-600 to-amber-700 p-8 text-white text-center"><Trophy className="h-12 w-12 mx-auto mb-4" /><h2 className="text-3xl font-bold mb-2">PE Electrical & Computer (Power) — Full Practice Exam</h2><p className="text-yellow-100 text-lg">80 Questions &middot; 8 Hours</p></div><div className="p-6 space-y-4"><div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center"><div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4"><p className="text-2xl font-bold text-blue-600">80</p><p className="text-xs text-muted-foreground">Questions</p></div><div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4"><p className="text-2xl font-bold text-purple-600">10</p><p className="text-xs text-muted-foreground">Sections</p></div><div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4"><p className="text-2xl font-bold text-amber-600">8:00</p><p className="text-xs text-muted-foreground">Hours</p></div><div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4"><p className="text-2xl font-bold text-green-600">60%</p><p className="text-xs text-muted-foreground">Est. Pass</p></div></div><Button onClick={startExam} disabled={questionPool.length === 0} className="w-full py-6 text-lg font-bold bg-green-600 hover:bg-green-700 disabled:opacity-60">{questionPool.length === 0 ? 'Loading questions…' : 'Start Exam Now'}</Button></div></Card></div>);
  if (phase === 'exam' && questions.length > 0) { const q = questions[currentIdx]; const answered = Object.keys(answers).length; const isFl = flagged.has(currentIdx); return (<div className="space-y-4"><Card className="p-4"><div className="flex justify-between items-center"><div className="flex items-center gap-4"><span className="text-sm font-medium">Q {currentIdx+1} / {questions.length}</span><div className="w-48 bg-gray-200 dark:bg-gray-800 rounded-full h-2"><div className="bg-amber-600 h-2 rounded-full transition-all" style={{width:`${((currentIdx+1)/questions.length)*100}%`}}/></div><span className="text-xs text-muted-foreground">{answered} answered</span></div><div className={`text-2xl font-mono font-bold ${timeLeft<600?'text-red-600 animate-pulse':'text-gray-900 dark:text-gray-100'}`}>{formatTime(timeLeft)}</div></div></Card><Card className="p-6"><div className="flex items-center gap-2 mb-4"><Badge variant="secondary" className="text-xs">{PEE_TOPIC_NAMES[q.topicId]}</Badge><Badge variant="outline" className="text-xs">{q.subtopic}</Badge></div><h3 className="text-lg font-semibold mb-6">{q.question}</h3><div className="space-y-3">{q.options.map((opt:string,i:number)=>(<button key={i} onClick={()=>setAnswers(p=>({...p,[currentIdx]:i}))} className={`w-full text-left p-4 rounded-lg border-2 transition-all ${answers[currentIdx]===i?'border-amber-500 bg-amber-50 dark:bg-amber-950/30':'border-gray-200 dark:border-gray-700 hover:border-gray-400'}`}><span className="font-mono text-sm mr-3 text-muted-foreground">{String.fromCharCode(65+i)}</span>{opt}</button>))}</div><div className="flex items-center justify-between mt-6"><button onClick={()=>{const nf=new Set(flagged);isFl?nf.delete(currentIdx):nf.add(currentIdx);setFlagged(nf);}} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isFl?'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100':'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>{isFl?'★ Flagged':'☆ Flag'}</button><div className="flex gap-2"><Button variant="outline" size="sm" disabled={currentIdx===0} onClick={()=>setCurrentIdx(currentIdx-1)}>← Prev</Button>{currentIdx<questions.length-1?<Button size="sm" onClick={()=>setCurrentIdx(currentIdx+1)}>Next →</Button>:<Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>{if(confirm('Submit exam?'))handleSubmit();}}>Submit</Button>}</div></div></Card><Card className="p-4"><p className="text-xs font-medium text-muted-foreground mb-2">Navigator</p><div className="flex flex-wrap gap-1">{questions.map((_:any,i:number)=>(<button key={i} onClick={()=>setCurrentIdx(i)} className={`w-7 h-7 rounded text-[10px] font-bold transition ${i===currentIdx?'bg-amber-600 text-white':flagged.has(i)?'bg-yellow-400 dark:bg-yellow-600 text-yellow-900 dark:text-white':answers[i]!==undefined?'bg-green-400 dark:bg-green-600 text-green-900 dark:text-white':'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>{i+1}</button>))}</div></Card></div>); }
  if (phase === 'results' && results) return (<div className="space-y-6"><Card className={`overflow-hidden ${results.passed?'border-green-500':'border-red-500'} border-2`}><div className={`p-8 text-center text-white ${results.passed?'bg-gradient-to-r from-green-600 to-emerald-700':'bg-gradient-to-r from-red-600 to-red-800'}`}><p className="text-6xl font-black mb-2">{results.percentage}%</p><p className="text-xl">{results.correct} of {results.total} correct</p><p className="mt-2 text-lg font-bold">{results.passed?'✓ PASS':'⚠ NEEDS REVIEW'}</p></div></Card><Card className="p-6"><h3 className="font-bold text-lg mb-4">By Section</h3><div className="space-y-3">{Object.entries(results.byTopic).map(([tid,data]:[string,any])=>{const pct=Math.round((data.correct/data.total)*100);return(<div key={tid}><div className="flex justify-between text-sm mb-1"><span className="font-medium">{PEE_TOPIC_NAMES[Number(tid)]}</span><span className={pct>=60?'text-green-600':'text-red-600'}>{data.correct}/{data.total} ({pct}%)</span></div><div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2"><div className={`h-2 rounded-full ${pct>=60?'bg-green-500':'bg-red-500'}`} style={{width:`${pct}%`}}/></div></div>);})}</div></Card>{results.incorrect.length>0&&(<Card className="p-6"><h3 className="font-bold text-lg mb-4">Missed ({results.incorrect.length})</h3><div className="space-y-4 max-h-[500px] overflow-y-auto">{results.incorrect.map((item:any,i:number)=>(<div key={i} className="border-l-4 border-red-500 pl-4 py-2"><p className="font-medium text-sm mb-1">{item.question.question}</p><p className="text-xs text-red-600">You: {item.userAnswer}</p><p className="text-xs text-green-600">Correct: {item.correctAnswer}</p><p className="text-xs text-muted-foreground mt-1 bg-gray-50 dark:bg-gray-900 p-2 rounded">{item.explanation}</p></div>))}</div></Card>)}<Button onClick={()=>{setPhase('intro');setResults(null);}} className="w-full" variant="outline">Take Another</Button></div>);
  return null;
}

function PEEEAnalyticsTab() {
  const [history, setHistory] = useState<any[]>([]); React.useEffect(() => { const stored = JSON.parse(localStorage.getItem('peee_exam_history') || '[]'); setHistory(stored); getExamAttempts('PE_EE').then((remote) => { if (remote.length) setHistory(mergeExamHistory(stored, remote)); }); }, []);
  const latestByTopic: Record<number, {correct:number;total:number}> = {}; if (history.length > 0) { const latest = history[history.length-1]; if (latest.byTopic) Object.entries(latest.byTopic).forEach(([tid,data]:[string,any]) => { latestByTopic[Number(tid)] = data; }); }
  const totalAttempts = history.length; const avgScore = totalAttempts > 0 ? Math.round(history.reduce((s:number,h:any)=>s+h.score,0)/totalAttempts) : 0; const bestScore = totalAttempts > 0 ? Math.max(...history.map((h:any)=>h.score)) : 0; const passCount = history.filter((h:any)=>h.passed).length;
  const weakTopics = Object.entries(latestByTopic).map(([tid,d])=>({id:Number(tid),name:PEE_TOPIC_NAMES[Number(tid)],pct:Math.round((d.correct/d.total)*100),correct:d.correct,total:d.total})).sort((a,b)=>a.pct-b.pct);
  return (<div className="space-y-6"><div className="bg-gradient-to-r from-yellow-600 to-amber-600 rounded-xl p-6 text-white"><h2 className="text-2xl font-bold mb-1">PE EE (Power) Performance Analytics</h2><p className="text-yellow-100 text-sm">Track your PE Electrical Power exam preparation</p></div>{totalAttempts===0?(<Card className="p-8 text-center"><BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4"/><h3 className="text-lg font-semibold mb-2">No exam attempts yet</h3><p className="text-muted-foreground text-sm">Take a Full Exam to see analytics.</p></Card>):(<><div className="grid grid-cols-2 md:grid-cols-4 gap-4"><Card className="p-4 text-center"><p className="text-3xl font-bold text-blue-600">{totalAttempts}</p><p className="text-xs text-muted-foreground">Exams</p></Card><Card className="p-4 text-center"><p className="text-3xl font-bold text-purple-600">{avgScore}%</p><p className="text-xs text-muted-foreground">Average</p></Card><Card className="p-4 text-center"><p className="text-3xl font-bold text-green-600">{bestScore}%</p><p className="text-xs text-muted-foreground">Best</p></Card><Card className="p-4 text-center"><p className="text-3xl font-bold text-amber-600">{passCount}/{totalAttempts}</p><p className="text-xs text-muted-foreground">Pass Rate</p></Card></div><Card className="p-6"><h3 className="font-bold text-lg mb-4">Exam History</h3><div className="space-y-2">{[...history].reverse().map((h:any,i:number)=>(<div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"><span className="text-sm text-muted-foreground">{new Date(h.date).toLocaleDateString()}</span><span className="font-bold">{h.score}%</span><Badge className={h.passed?'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}>{h.passed?'PASS':'REVIEW'}</Badge></div>))}</div></Card>{weakTopics.length>0&&(<Card className="p-6"><h3 className="font-bold text-lg mb-4">Latest — By Section</h3><div className="space-y-3">{weakTopics.map(t=>(<div key={t.id}><div className="flex justify-between text-sm mb-1"><span className="font-medium">{t.name}</span><span className={t.pct>=60?'text-green-600 font-semibold':'text-red-600 font-semibold'}>{t.correct}/{t.total} ({t.pct}%)</span></div><div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5"><div className={`h-2.5 rounded-full ${t.pct>=60?'bg-green-500':t.pct>=40?'bg-amber-500':'bg-red-500'}`} style={{width:`${t.pct}%`}}/></div></div>))}</div></Card>)}<div className="text-center"><button onClick={()=>{if(confirm('Clear history?')){localStorage.removeItem('peee_exam_history');setHistory([]);}}} className="text-xs text-muted-foreground hover:text-red-500 transition">Clear history</button></div></>)}</div>);
}

// ═══════════════════════════════════════════════════════════════
// MCAT FULL EXAM SIMULATOR + ANALYTICS
// ═══════════════════════════════════════════════════════════════

const MCAT_SECTION_NAMES = ['Chemical & Physical Foundations','Critical Analysis & Reasoning (CARS)','Biological & Biochemical Foundations','Psychological, Social & Biological Foundations'];
const MCAT_SECTION_DISTRIBUTION = [59,53,59,59];
const MCAT_EXAM_TIME = 22500; // 375 min = 6 hr 15 min in seconds

function MCATExamTab() {
  const [phase, setPhase] = useState<'intro' | 'exam' | 'results'>('intro');
  const [questions, setQuestions] = useState<any[]>([]); const [answers, setAnswers] = useState<Record<number, number>>({}); const [flagged, setFlagged] = useState<Set<number>>(new Set()); const [currentIdx, setCurrentIdx] = useState(0); const [timeLeft, setTimeLeft] = useState(MCAT_EXAM_TIME); const [results, setResults] = useState<any>(null); const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  // Lazy-loaded MCAT question pool (P3-9 stage 3).
  const [questionPool, setQuestionPool] = useState<any[]>([]);
  React.useEffect(() => { let cancelled = false; import('@/lib/mcat-qbank-data').then((m) => { if (!cancelled) setQuestionPool(m.MCAT_QUESTIONS); }); return () => { cancelled = true; }; }, []);
  React.useEffect(() => { if (phase !== 'exam') return; timerRef.current = setInterval(() => { setTimeLeft(prev => { if (prev <= 1) { clearInterval(timerRef.current!); return 0; } return prev - 1; }); }, 1000); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, [phase]);
  React.useEffect(() => { if (phase === 'exam' && timeLeft === 0) handleSubmit(); }, [timeLeft, phase]);
  const formatTime = (s: number) => { const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); const sec = s % 60; return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`; };
  const startExam = () => { if (questionPool.length === 0) return; const examQs: any[] = []; let idx = 0; for (let tid = 0; tid < 4; tid++) { const count = MCAT_SECTION_DISTRIBUTION[tid]; const tQs = questionPool.filter((q: any) => q.topicId === tid); const sh = shuffle(tQs).slice(0, count); sh.forEach((q: any) => { examQs.push({ ...q, examIdx: idx }); idx++; }); } setQuestions(examQs); setAnswers({}); setFlagged(new Set()); setCurrentIdx(0); setTimeLeft(MCAT_EXAM_TIME); setPhase('exam'); };
  const handleSubmit = () => { if (timerRef.current) clearInterval(timerRef.current); const res: any = { total: questions.length, correct: 0, incorrect: [], byTopic: {}, timeSpent: MCAT_EXAM_TIME - timeLeft }; questions.forEach(q => { if (!res.byTopic[q.topicId]) res.byTopic[q.topicId] = { correct: 0, total: 0 }; res.byTopic[q.topicId].total++; if (answers[q.examIdx] === q.correct) { res.correct++; res.byTopic[q.topicId].correct++; } else { res.incorrect.push({ question: q, userAnswer: answers[q.examIdx] !== undefined ? q.options[answers[q.examIdx]] : 'Not answered', correctAnswer: q.options[q.correct], explanation: q.explanation }); } }); res.percentage = Math.round((res.correct / res.total) * 100); res.passed = res.percentage >= 70; const mcatEntry = { date: new Date().toISOString(), score: res.percentage, passed: res.passed, correct: res.correct, total: res.total, timeSpent: res.timeSpent, byTopic: res.byTopic }; const hist = JSON.parse(localStorage.getItem('mcat_exam_history') || '[]'); hist.push(mcatEntry); localStorage.setItem('mcat_exam_history', JSON.stringify(hist)); recordExamAttempt('MCAT', mcatEntry); setResults(res); setPhase('results'); };
  if (phase === 'intro') return (<div className="space-y-6"><Card className="overflow-hidden"><div className="bg-gradient-to-r from-teal-600 to-cyan-700 p-8 text-white text-center"><Trophy className="h-12 w-12 mx-auto mb-4" /><h2 className="text-3xl font-bold mb-2">MCAT — Full Practice Exam</h2><p className="text-teal-100 text-lg">230 Questions &middot; 6 Hours 15 Minutes &middot; 4 Sections</p></div><div className="p-6 space-y-4"><div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center"><div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4"><p className="text-2xl font-bold text-blue-600">230</p><p className="text-xs text-muted-foreground">Questions</p></div><div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4"><p className="text-2xl font-bold text-purple-600">4</p><p className="text-xs text-muted-foreground">Sections</p></div><div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4"><p className="text-2xl font-bold text-teal-600">6:15</p><p className="text-xs text-muted-foreground">Hours</p></div><div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4"><p className="text-2xl font-bold text-green-600">472–528</p><p className="text-xs text-muted-foreground">Score Range</p></div></div><div className="bg-teal-50 dark:bg-teal-950/30 rounded-lg p-4 text-sm"><p className="font-semibold text-teal-900 dark:text-teal-200 mb-1">MCAT Scoring</p><p className="text-teal-800 dark:text-teal-300">Each section scored 118–132. Total: 472–528. Median ≈ 500. Competitive: 510+. Top 10%: 519+.</p></div><Button onClick={startExam} disabled={questionPool.length === 0} className="w-full py-6 text-lg font-bold bg-green-600 hover:bg-green-700 disabled:opacity-60">{questionPool.length === 0 ? 'Loading questions…' : 'Start Full Exam'}</Button></div></Card></div>);
  if (phase === 'exam' && questions.length > 0) { const q = questions[currentIdx]; const answered = Object.keys(answers).length; const isFl = flagged.has(currentIdx); return (<div className="space-y-4"><Card className="p-4"><div className="flex justify-between items-center"><div className="flex items-center gap-4"><span className="text-sm font-medium">Q {currentIdx+1} / {questions.length}</span><div className="w-48 bg-gray-200 dark:bg-gray-800 rounded-full h-2"><div className="bg-teal-600 h-2 rounded-full transition-all" style={{width:`${((currentIdx+1)/questions.length)*100}%`}}/></div><span className="text-xs text-muted-foreground">{answered} answered</span></div><div className={`text-2xl font-mono font-bold ${timeLeft<600?'text-red-600 animate-pulse':'text-gray-900 dark:text-gray-100'}`}>{formatTime(timeLeft)}</div></div></Card><Card className="p-6"><div className="flex items-center gap-2 mb-4"><Badge variant="secondary" className="text-xs">{MCAT_SECTION_NAMES[q.topicId]}</Badge><Badge variant="outline" className="text-xs">{q.subtopic}</Badge></div><h3 className="text-lg font-semibold mb-6">{q.question}</h3><div className="space-y-3">{q.options.map((opt:string,i:number)=>(<button key={i} onClick={()=>setAnswers(p=>({...p,[currentIdx]:i}))} className={`w-full text-left p-4 rounded-lg border-2 transition-all ${answers[currentIdx]===i?'border-teal-500 bg-teal-50 dark:bg-teal-950/30':'border-gray-200 dark:border-gray-700 hover:border-gray-400'}`}><span className="font-mono text-sm mr-3 text-muted-foreground">{String.fromCharCode(65+i)}</span>{opt}</button>))}</div><div className="flex items-center justify-between mt-6"><button onClick={()=>{const nf=new Set(flagged);isFl?nf.delete(currentIdx):nf.add(currentIdx);setFlagged(nf);}} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isFl?'bg-teal-200 dark:bg-teal-900 text-teal-900 dark:text-teal-100':'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>{isFl?'★ Flagged':'☆ Flag'}</button><div className="flex gap-2"><Button variant="outline" size="sm" disabled={currentIdx===0} onClick={()=>setCurrentIdx(currentIdx-1)}>← Prev</Button>{currentIdx<questions.length-1?<Button size="sm" onClick={()=>setCurrentIdx(currentIdx+1)}>Next →</Button>:<Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={()=>{if(confirm('Submit exam?'))handleSubmit();}}>Submit</Button>}</div></div></Card><Card className="p-4"><p className="text-xs font-medium text-muted-foreground mb-2">Navigator</p><div className="flex flex-wrap gap-1">{questions.map((_:any,i:number)=>(<button key={i} onClick={()=>setCurrentIdx(i)} className={`w-7 h-7 rounded text-[10px] font-bold transition ${i===currentIdx?'bg-teal-600 text-white':flagged.has(i)?'bg-cyan-400 dark:bg-cyan-600 text-cyan-900 dark:text-white':answers[i]!==undefined?'bg-green-400 dark:bg-green-600 text-green-900 dark:text-white':'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>{i+1}</button>))}</div></Card></div>); }
  if (phase === 'results' && results) return (<div className="space-y-6"><Card className={`overflow-hidden ${results.passed?'border-green-500':'border-red-500'} border-2`}><div className={`p-8 text-center text-white ${results.passed?'bg-gradient-to-r from-green-600 to-emerald-700':'bg-gradient-to-r from-red-600 to-red-800'}`}><p className="text-6xl font-black mb-2">{results.percentage}%</p><p className="text-xl">{results.correct} of {results.total} correct</p><p className="mt-2 text-lg font-bold">{results.passed?'Strong Performance':'Keep Studying'}</p><p className="mt-1 text-sm opacity-80">Estimated scaled score: {Math.round(472 + (results.percentage / 100) * 56)}</p></div></Card><Card className="p-6"><h3 className="font-bold text-lg mb-4">By Section</h3><div className="space-y-3">{Object.entries(results.byTopic).map(([tid,data]:[string,any])=>{const pct=Math.round((data.correct/data.total)*100);return(<div key={tid}><div className="flex justify-between text-sm mb-1"><span className="font-medium">{MCAT_SECTION_NAMES[Number(tid)]}</span><span className={pct>=70?'text-green-600':'text-red-600'}>{data.correct}/{data.total} ({pct}%)</span></div><div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2"><div className={`h-2 rounded-full ${pct>=70?'bg-green-500':'bg-red-500'}`} style={{width:`${pct}%`}}/></div></div>);})}</div></Card>{results.incorrect.length>0&&(<Card className="p-6"><h3 className="font-bold text-lg mb-4">Missed ({results.incorrect.length})</h3><div className="space-y-4 max-h-[500px] overflow-y-auto">{results.incorrect.slice(0, 50).map((item:any,i:number)=>(<div key={i} className="border-l-4 border-red-500 pl-4 py-2"><p className="font-medium text-sm mb-1">{item.question.question}</p><p className="text-xs text-red-600">You: {item.userAnswer}</p><p className="text-xs text-green-600">Correct: {item.correctAnswer}</p><p className="text-xs text-muted-foreground mt-1 bg-gray-50 dark:bg-gray-900 p-2 rounded">{item.explanation}</p></div>))}{results.incorrect.length>50&&<p className="text-xs text-muted-foreground text-center">Showing first 50 of {results.incorrect.length} missed questions</p>}</div></Card>)}<Button onClick={()=>{setPhase('intro');setResults(null);}} className="w-full" variant="outline">Take Another</Button></div>);
  return null;
}

function MCATAnalyticsTab() {
  const [history, setHistory] = useState<any[]>([]); React.useEffect(() => { const stored = JSON.parse(localStorage.getItem('mcat_exam_history') || '[]'); setHistory(stored); getExamAttempts('MCAT').then((remote) => { if (remote.length) setHistory(mergeExamHistory(stored, remote)); }); }, []);
  const latestByTopic: Record<number, {correct:number;total:number}> = {}; if (history.length > 0) { const latest = history[history.length-1]; if (latest.byTopic) Object.entries(latest.byTopic).forEach(([tid,data]:[string,any]) => { latestByTopic[Number(tid)] = data; }); }
  const totalAttempts = history.length; const avgScore = totalAttempts > 0 ? Math.round(history.reduce((s:number,h:any)=>s+h.score,0)/totalAttempts) : 0; const bestScore = totalAttempts > 0 ? Math.max(...history.map((h:any)=>h.score)) : 0; const passCount = history.filter((h:any)=>h.passed).length;
  const weakTopics = Object.entries(latestByTopic).map(([tid,d])=>({id:Number(tid),name:MCAT_SECTION_NAMES[Number(tid)],pct:Math.round((d.correct/d.total)*100),correct:d.correct,total:d.total})).sort((a,b)=>a.pct-b.pct);
  return (<div className="space-y-6"><div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl p-6 text-white"><h2 className="text-2xl font-bold mb-1">MCAT Performance Analytics</h2><p className="text-teal-100 text-sm">Track your MCAT preparation across all 4 sections</p></div>{totalAttempts===0?(<Card className="p-8 text-center"><BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4"/><h3 className="text-lg font-semibold mb-2">No exam attempts yet</h3><p className="text-muted-foreground text-sm">Take a Full Exam to see analytics.</p></Card>):(<><div className="grid grid-cols-2 md:grid-cols-4 gap-4"><Card className="p-4 text-center"><p className="text-3xl font-bold text-blue-600">{totalAttempts}</p><p className="text-xs text-muted-foreground">Exams</p></Card><Card className="p-4 text-center"><p className="text-3xl font-bold text-purple-600">{avgScore}%</p><p className="text-xs text-muted-foreground">Average</p></Card><Card className="p-4 text-center"><p className="text-3xl font-bold text-green-600">{bestScore}%</p><p className="text-xs text-muted-foreground">Best</p></Card><Card className="p-4 text-center"><p className="text-3xl font-bold text-teal-600">{Math.round(472 + (avgScore/100)*56)}</p><p className="text-xs text-muted-foreground">Est. Score</p></Card></div><Card className="p-6"><h3 className="font-bold text-lg mb-4">Exam History</h3><div className="space-y-2">{[...history].reverse().map((h:any,i:number)=>(<div key={i} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"><span className="text-sm text-muted-foreground">{new Date(h.date).toLocaleDateString()}</span><span className="font-bold">{h.score}% (≈{Math.round(472+(h.score/100)*56)})</span><Badge className={h.passed?'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200':'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}>{h.passed?'STRONG':'REVIEW'}</Badge></div>))}</div></Card>{weakTopics.length>0&&(<Card className="p-6"><h3 className="font-bold text-lg mb-4">Latest — By Section</h3><div className="space-y-3">{weakTopics.map(t=>(<div key={t.id}><div className="flex justify-between text-sm mb-1"><span className="font-medium">{t.name}</span><span className={t.pct>=70?'text-green-600 font-semibold':'text-red-600 font-semibold'}>{t.correct}/{t.total} ({t.pct}%)</span></div><div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5"><div className={`h-2.5 rounded-full ${t.pct>=70?'bg-green-500':t.pct>=50?'bg-amber-500':'bg-red-500'}`} style={{width:`${t.pct}%`}}/></div></div>))}</div></Card>)}<div className="text-center"><button onClick={()=>{if(confirm('Clear history?')){localStorage.removeItem('mcat_exam_history');setHistory([]);}}} className="text-xs text-muted-foreground hover:text-red-500 transition">Clear history</button></div></>)}</div>);
}
