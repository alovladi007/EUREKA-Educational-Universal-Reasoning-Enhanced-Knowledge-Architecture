'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  PlayCircle, BookOpen, FileText, BarChart3, Clock, CheckCircle2,
  Plus, Search, Filter, ChevronRight, Star, Pin, Trash2, Edit3,
  Flag, ArrowRight, ArrowLeft, Timer, Pause, Play, X, Lightbulb,
  BookMarked, Video, StickyNote, BrainCircuit, Trophy, AlertCircle,
  RotateCcw, Eye, EyeOff, Layers, Zap, ThumbsUp, ThumbsDown,
  Library, ExternalLink, Search as SearchIcon, Hash, Sparkles, XCircle,
} from 'lucide-react';
import { getExamConfig, getSectionsForExam } from '@/lib/exam-config';
import { getCurriculum, getTotalTopics } from '@/lib/exam-curriculum';
import { PATENT_TOPIC_ANCHORS } from '@/lib/patent-topic-anchors';
import { apiClient } from '@/lib/api-client';
import { getCISSPLessonContent } from '@/lib/cissp-lesson-content';
import { getCISSPCourseContent, hasCISSPCourseContent, type TopicLesson } from '@/lib/cissp-course-data';
import { getSecurityPlusCourseContent, hasSecurityPlusCourseContent } from '@/lib/security-plus-course-data';
import { getPatentBarCourseContent, hasPatentBarCourseContent } from '@/lib/patent-bar-course-data';
import { getFEEECourseContent, hasFEEECourseContent } from '@/lib/fe-ee-course-data';
import { LessonQuiz } from '@/components/test-prep/cissp/LessonQuiz';
import { getCISSPQuestions, type CISSPQuestion } from '@/lib/cissp-qbank-data';
import { getCISSPVideoLessons } from '@/lib/cissp-video-lessons';
import { getCISSPFlashcards, CISSP_FLASHCARD_DOMAINS, CISSP_FLASHCARD_COUNT } from '@/lib/cissp-flashcard-data';
import { getSecurityPlusFlashcards, SECPLUS_FLASHCARD_DOMAINS, SECPLUS_FLASHCARD_COUNT } from '@/lib/security-plus-flashcard-data';
import { getPatentBarFlashcards, PATENT_BAR_FLASHCARD_DOMAINS, PATENT_BAR_FLASHCARD_COUNT } from '@/lib/patent-bar-flashcard-data';
import { getFEEEFlashcards, FEEE_FLASHCARD_DOMAINS, FEEE_FLASHCARD_COUNT } from '@/lib/fe-ee-flashcard-data';
import { FE_EE_QUESTIONS, type FEEEQuestion } from '@/lib/fe-ee-qbank-data';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PatentBarCohortPanel } from '@/components/test-prep/patent/PatentBarCohortPanel';

type Tab = 'read' | 'lessons' | 'flashcards' | 'notes' | 'qbank' | 'mpep' | 'exam' | 'analytics';

export default function ExamPage() {
  const params = useParams();
  const examId = (params.exam as string)?.toUpperCase();
  const config = getExamConfig(examId);
  const sections = getSectionsForExam(examId);
  const isPatentBar = examId === 'PATENT_BAR';
  const isFEEE = examId === 'FE_EE';
  const [activeTab, setActiveTab] = useState<Tab>('read');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'read', label: 'Read Lessons', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'lessons', label: 'Video Lessons', icon: <Video className="h-4 w-4" /> },
    { id: 'flashcards', label: 'Flashcards', icon: <Layers className="h-4 w-4" /> },
    { id: 'notes', label: 'My Notes', icon: <StickyNote className="h-4 w-4" /> },
    { id: 'qbank', label: 'QBank', icon: <BrainCircuit className="h-4 w-4" /> },
    ...(isPatentBar ? [{ id: 'mpep' as Tab, label: 'MPEP', icon: <Library className="h-4 w-4" /> }] : []),
    ...(isFEEE ? [
      { id: 'exam' as Tab, label: 'Full Exam', icon: <Trophy className="h-4 w-4" /> },
      { id: 'analytics' as Tab, label: 'Analytics', icon: <BarChart3 className="h-4 w-4" /> },
    ] : []),
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
            </div>
          </div>
        </Card>
      )}

      {isPatentBar && <PatentBarCohortPanel />}


      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-muted p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
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

      {/* Tab Content */}
      {activeTab === 'read' && <ReadLessonsTab examType={examId} />}
      {activeTab === 'lessons' && <LessonsTab examType={examId} sections={sections} />}
      {activeTab === 'flashcards' && <FlashcardsTab examType={examId} sections={sections} />}
      {activeTab === 'notes' && <NotesTab examType={examId} sections={sections} />}
      {activeTab === 'qbank' && <QBankTab examType={examId} config={config} sections={sections} />}
      {activeTab === 'mpep' && isPatentBar && <MPEPTab />}
      {activeTab === 'exam' && isFEEE && <FEEEExamTab />}
      {activeTab === 'analytics' && isFEEE && <FEEEAnalyticsTab />}
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
  { chapter: '700', topic: 'Examination of Applications', why: 'Core prosecution procedures — most heavily tested chapter.' },
  { chapter: '2100', topic: 'Patentability (35 USC 101, 102, 103, 112)', why: 'Novelty, obviousness, and subject matter eligibility are the most tested topics.' },
  { chapter: '600', topic: 'Parts, Form, and Content of Application', why: 'Specification, claims, drawings, and oath/declaration requirements.' },
  { chapter: '1200', topic: 'Appeal', why: 'Appeal procedures before the PTAB.' },
  { chapter: '2000', topic: 'Duty of Disclosure', why: 'Rule 56 duty of candor and inequitable conduct.' },
  { chapter: '1800', topic: 'Patent Cooperation Treaty (PCT)', why: 'International filing, ISA/IPEA, and national phase entry.' },
  { chapter: '200', topic: 'Types and Status of Application', why: 'Provisional, non-provisional, continuation, CIP, and divisional.' },
  { chapter: '1500', topic: 'Design Patents', why: 'Design patent prosecution rules differ from utility patents.' },
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
              href={`https://mpep.uspto.gov/RDMS/MPEP/current#/current/d0e17.html`}
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
              href={`https://www.uspto.gov/web/offices/pac/mpep/mpep-${ch.num.padStart(4, '0')}.html`}
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
        </div>
      </Card>

      {/* Quick Reference */}
      <Card className="p-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Hash className="h-5 w-5 text-indigo-500" /> Key Rules Quick Reference
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { rule: '37 CFR 1.56', desc: 'Duty to disclose material information (Rule 56)' },
            { rule: '37 CFR 1.111', desc: 'Reply to non-final Office action' },
            { rule: '37 CFR 1.113', desc: 'Final rejection' },
            { rule: '37 CFR 1.116', desc: 'Amendments after final rejection' },
            { rule: '37 CFR 1.131', desc: 'Affidavit to antedate prior art (pre-AIA)' },
            { rule: '37 CFR 1.132', desc: 'Declaration of evidence (secondary considerations)' },
            { rule: '37 CFR 1.136', desc: 'Extensions of time' },
            { rule: '37 CFR 1.321', desc: 'Terminal disclaimers' },
            { rule: '35 USC 101', desc: 'Patent-eligible subject matter' },
            { rule: '35 USC 102', desc: 'Novelty / Prior art' },
            { rule: '35 USC 103', desc: 'Obviousness' },
            { rule: '35 USC 112', desc: 'Specification requirements (written description, enablement, claims)' },
            { rule: '35 USC 119', desc: 'Foreign priority' },
            { rule: '35 USC 120', desc: 'Domestic benefit' },
            { rule: '35 USC 371', desc: 'National stage of PCT applications' },
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
              // Try rich course data first (structured with sections + quizzes)
              const courseData = (() => {
                if (hasCISSPCourseContent(activeTopic.id)) return getCISSPCourseContent(activeTopic.id);
                if (hasSecurityPlusCourseContent(activeTopic.id)) return getSecurityPlusCourseContent(activeTopic.id);
                if (hasPatentBarCourseContent(activeTopic.id)) return getPatentBarCourseContent(activeTopic.id);
                if (hasFEEECourseContent(activeTopic.id)) return getFEEECourseContent(activeTopic.id);
                return null;
              })();

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
                      const hasContent = hasCISSPCourseContent(topic.id) || hasSecurityPlusCourseContent(topic.id) || hasPatentBarCourseContent(topic.id) || hasFEEECourseContent(topic.id);
                      return (
                        <div
                          key={topic.id}
                          className="flex items-center gap-4 px-5 py-4 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all duration-200 cursor-pointer border-b border-gray-50 dark:border-gray-900 last:border-b-0"
                          onClick={() => setActiveTopic(topic)}
                        >
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleComplete(topic.id); }}
                            className={`flex-shrink-0 h-8 w-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                              done
                                ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-sm'
                                : 'border-2 border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
                            }`}
                          >
                            {done && <CheckCircle2 className="h-4 w-4" />}
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

function LessonsTab({ examType, sections }: { examType: string; sections: any[] }) {
  const [lessons, setLessons] = useState<Record<string, any[]>>({});
  const [progress, setProgress] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [lessonData, progressData] = await Promise.all([
          apiClient.getLessons(examType).catch(() => null),
          apiClient.getLessonProgress(examType).catch(() => null),
        ]);
        if (lessonData?.sections && Object.keys(lessonData.sections).length > 0) {
          setLessons(lessonData.sections);
        } else if (examType === 'CISSP') {
          // Fallback: use static CISSP video lesson data
          setLessons(getCISSPVideoLessons());
        }
        if (progressData) setProgress(progressData);
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, [examType]);

  const allLessons = Object.values(lessons).flat();
  const hasLessons = allLessons.length > 0;

  if (activeLesson) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => setActiveLesson(null)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to lessons
        </Button>
        <Card className="overflow-hidden">
          <div className="aspect-video bg-black flex items-center justify-center">
            {activeLesson.video_url ? (
              <video
                src={activeLesson.video_url}
                controls
                className="w-full h-full"
                autoPlay
              />
            ) : (
              <div className="text-white text-center">
                <PlayCircle className="h-16 w-16 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">{activeLesson.title}</p>
                <p className="text-sm opacity-60">Video coming soon</p>
              </div>
            )}
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-2">{activeLesson.title}</h2>
            <p className="text-muted-foreground mb-4">{activeLesson.description}</p>
            {activeLesson.official_notes && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2"><FileText className="h-4 w-4" /> Lesson Notes</h3>
                <div className="prose prose-sm dark:prose-invert max-w-none bg-muted/50 rounded-lg p-4 whitespace-pre-wrap">
                  {activeLesson.official_notes}
                </div>
              </div>
            )}
            {activeLesson.key_concepts?.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Key Concepts</h3>
                <div className="flex flex-wrap gap-2">
                  {activeLesson.key_concepts.map((c: string, i: number) => (
                    <Badge key={i} variant="secondary">{c}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      {progress && progress.total_lessons > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Course Progress</span>
            <span className="text-sm text-muted-foreground">{progress.completed}/{progress.total_lessons} lessons</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress.completion_percent}%` }} />
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
        sections.map((section) => {
          const sectionLessons = lessons[section.id] || [];
          if (sectionLessons.length === 0) return null;
          return (
            <div key={section.id}>
              <h3 className="font-semibold text-lg mb-3">{section.name}</h3>
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
                      <PlayCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{lesson.title}</p>
                      <p className="text-xs text-muted-foreground">{lesson.topic} &middot; {Math.round((lesson.duration_seconds || 0) / 60)} min</p>
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
                  <button onClick={() => togglePin(note)} className={`p-1 rounded ${note.is_pinned ? 'text-primary' : 'text-muted-foreground/40 hover:text-muted-foreground'}`}>
                    <Pin className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => { setEditingId(note.id); setForm({ title: note.title || '', content: note.content, section_id: note.section_id || '', topic: note.topic || '', color_label: note.color_label || 'yellow' }); setShowCreate(true); }} className="p-1 text-muted-foreground/40 hover:text-muted-foreground">
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => deleteNote(note.id)} className="p-1 text-muted-foreground/40 hover:text-red-500">
                    <Trash2 className="h-3.5 w-3.5" />
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
  const hasFlashcards = isCISSP || isSecPlus || isPatentBar || isFEEE;
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
          : [];
  const flashcardCount = isCISSP
    ? CISSP_FLASHCARD_COUNT
    : isSecPlus
      ? SECPLUS_FLASHCARD_COUNT
      : isPatentBar
        ? PATENT_BAR_FLASHCARD_COUNT
        : isFEEE
          ? FEEE_FLASHCARD_COUNT
          : 0;
  const flashcardTitle = isCISSP
    ? 'CISSP Flashcard Deck'
    : isSecPlus
      ? 'Security+ Flashcard Deck'
      : isPatentBar
        ? 'Patent Bar Flashcard Deck'
        : isFEEE
          ? 'FE Electrical & Computer Flashcard Deck'
          : 'Flashcard Deck';
  const flashcardSubtitle = isCISSP
    ? `${CISSP_FLASHCARD_COUNT.toLocaleString()} cards across all 8 domains + extras`
    : isSecPlus
      ? `${SECPLUS_FLASHCARD_COUNT.toLocaleString()} cards across all 5 domains + exam tips`
      : isPatentBar
        ? `${PATENT_BAR_FLASHCARD_COUNT.toLocaleString()} cards across Parts 1–8 + exam traps`
        : isFEEE
          ? `${FEEE_FLASHCARD_COUNT.toLocaleString()} cards across all 18 EE topics + formulas`
        : '';

  const startStudy = (cards: any[]) => {
    if (cards.length === 0) return;
    const studyDeck = shuffled ? [...cards].sort(() => Math.random() - 0.5) : cards;
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
        patent_filters?: { aia_era?: string; content_types?: string[] };
      } = {
        exam_type: examType,
        mode,
        section_ids: selectedSections.length > 0 ? selectedSections : undefined,
        question_count: questionCount,
      };
      if (examType === 'PATENT_BAR') {
        const pf: { aia_era?: string; content_types?: string[] } = {};
        if (patentAiaEra) pf.aia_era = patentAiaEra;
        if (patentContentTypes.length > 0) pf.content_types = patentContentTypes;
        if (Object.keys(pf).length > 0) payload.patent_filters = pf;
      }
      const data = await apiClient.createQBankSession(payload);
      setSessionId(data.session_id);
      setSessionData(data);
      setCurrentQ(data.question);
      setCurrentIndex(0);
      setTimer(0);
      setView('session');
    } catch {
      // Fallback: use static CISSP questions if API is unavailable
      if (examType === 'CISSP') {
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
          alert('No questions available for the selected sections.');
        }
      } else if (examType === 'FE_EE') {
        // Static fallback for FE EE using local question bank
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
        feQuestions = feQuestions.sort(() => Math.random() - 0.5).slice(0, questionCount);
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
          alert('No questions available for the selected sections.');
        }
      } else {
        alert('No questions available for this exam yet. Questions are being added.');
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
    } catch { /* ignore */ }
    setLoading(false);
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

          {/* Question count */}
          <div>
            <label className="block text-sm font-medium mb-2">Questions: {questionCount}</label>
            <input
              type="range"
              min={5}
              max={80}
              step={5}
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>5</span><span>40</span><span>80</span>
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
          <p className="text-lg font-medium mb-6">{currentQ.question_text}</p>

          <div className="space-y-2">
            {currentQ.options?.map((opt: any) => {
              const idx = opt.index;
              const isSelected = selectedAnswer === idx;
              const showResult = answerResult !== null;
              const isCorrect = showResult && idx === answerResult.correct_index;
              const isWrong = showResult && isSelected && !answerResult.is_correct;

              return (
                <button
                  key={idx}
                  disabled={showResult}
                  onClick={() => setSelectedAnswer(idx)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    showResult
                      ? isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-950'
                        : isWrong ? 'border-red-500 bg-red-50 dark:bg-red-950'
                        : 'border-muted'
                      : isSelected ? 'border-primary bg-primary/5' : 'border-muted hover:border-muted-foreground/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm">{opt.text}</span>
                    {showResult && isCorrect && <CheckCircle2 className="h-5 w-5 text-green-600 ml-auto" />}
                    {showResult && isWrong && <X className="h-5 w-5 text-red-600 ml-auto" />}
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
          <div className="flex justify-between mt-6">
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

const FE_EE_TOPIC_DISTRIBUTION = [8, 4, 4, 4, 4, 4, 11, 6, 6, 7, 7, 6, 7, 6, 6, 7, 5, 4];
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
    const examQs: any[] = [];
    let idx = 0;
    for (let topicId = 0; topicId < 18; topicId++) {
      const count = FE_EE_TOPIC_DISTRIBUTION[topicId];
      const topicQs = FE_EE_QUESTIONS.filter(q => q.topicId === topicId);
      const shuffled = [...topicQs].sort(() => Math.random() - 0.5).slice(0, count);
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
    // Save to localStorage for analytics
    const history = JSON.parse(localStorage.getItem('feee_exam_history') || '[]');
    history.push({ date: new Date().toISOString(), score: res.percentage, passed: res.passed, correct: res.correct, total: res.total, timeSpent: res.timeSpent, byTopic: res.byTopic });
    localStorage.setItem('feee_exam_history', JSON.stringify(history));
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
            <Button onClick={startExam} className="w-full py-6 text-lg font-bold bg-green-600 hover:bg-green-700">
              Start Exam Now
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
