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
  Library, ExternalLink, Search as SearchIcon, Hash,
} from 'lucide-react';
import { getExamConfig, getSectionsForExam } from '@/lib/exam-config';
import { getCurriculum, getTotalTopics } from '@/lib/exam-curriculum';
import { PATENT_TOPIC_ANCHORS } from '@/lib/patent-topic-anchors';
import { apiClient } from '@/lib/api-client';

type Tab = 'read' | 'lessons' | 'flashcards' | 'notes' | 'qbank' | 'mpep';

export default function ExamPage() {
  const params = useParams();
  const examId = (params.exam as string)?.toUpperCase();
  const config = getExamConfig(examId);
  const sections = getSectionsForExam(examId);
  const isPatentBar = examId === 'PATENT_BAR';
  const [activeTab, setActiveTab] = useState<Tab>('read');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'read', label: 'Read Lessons', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'lessons', label: 'Video Lessons', icon: <Video className="h-4 w-4" /> },
    { id: 'flashcards', label: 'Flashcards', icon: <Layers className="h-4 w-4" /> },
    { id: 'notes', label: 'My Notes', icon: <StickyNote className="h-4 w-4" /> },
    { id: 'qbank', label: 'QBank', icon: <BrainCircuit className="h-4 w-4" /> },
    ...(isPatentBar ? [{ id: 'mpep' as Tab, label: 'MPEP', icon: <Library className="h-4 w-4" /> }] : []),
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

        <Card className="p-8">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{section?.sectionName}</Badge>
            <Badge variant="outline">{activeTopic.readTimeMin} min read</Badge>
          </div>
          <h2 className="text-2xl font-bold mb-4">{activeTopic.title}</h2>
          <p className="text-muted-foreground mb-6">{activeTopic.summary}</p>

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

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="bg-muted/50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-3">Lesson Overview</h3>
              <p className="mb-4">{activeTopic.summary}</p>
              <p className="text-sm text-muted-foreground">
                This is a comprehensive lesson covering all key concepts, formulas, strategies, and practice problems for <strong>{activeTopic.title}</strong> as tested on the {examType} exam.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" /> Key Takeaways
              </h4>
              <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                <li>• Understand the core principles behind {activeTopic.title.toLowerCase()}</li>
                <li>• Know the most commonly tested patterns and question formats</li>
                <li>• Practice applying concepts to exam-style questions</li>
                <li>• Memorize the essential formulas, rules, and exceptions</li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
              <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">Exam Tips</h4>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                On the {examType}, this topic typically appears in questions that test your ability to apply concepts under time pressure. Focus on recognizing patterns quickly and eliminating wrong answers.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button
              variant={completedTopics.has(activeTopic.id) ? "default" : "outline"}
              onClick={() => toggleComplete(activeTopic.id)}
              className="gap-2"
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
                <Button variant="outline" onClick={() => { setActiveTopic(next); window.scrollTo(0, 0); }} className="gap-2">
                  Next: {next.title} <ArrowRight className="h-4 w-4" />
                </Button>
              ) : null;
            })()}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Reading Progress</span>
          <span className="text-sm text-muted-foreground">{completedCount}/{totalTopics} lessons</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${totalTopics > 0 ? (completedCount / totalTopics) * 100 : 0}%` }} />
        </div>
      </Card>

      {/* Curriculum */}
      {curriculum.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/40" />
          <h3 className="text-lg font-semibold mb-2">Curriculum coming soon</h3>
          <p className="text-muted-foreground">Reading lessons for {examType} are being prepared.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {curriculum.map((section) => {
            const isExpanded = expandedSection === section.sectionId;
            const sectionCompleted = section.topics.filter((t) => completedTopics.has(t.id)).length;

            return (
              <Card key={section.sectionId} className="overflow-hidden">
                <button
                  onClick={() => setExpandedSection(isExpanded ? null : section.sectionId)}
                  className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{section.sectionName}</p>
                      <p className="text-xs text-muted-foreground">{section.topics.length} lessons &middot; {sectionCompleted}/{section.topics.length} complete</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {sectionCompleted === section.topics.length && section.topics.length > 0 && (
                      <Badge className="bg-green-600 text-white">Done</Badge>
                    )}
                    <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t">
                    {section.topics.map((topic, i) => {
                      const done = completedTopics.has(topic.id);
                      return (
                        <div
                          key={topic.id}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-accent/30 transition-colors cursor-pointer border-b last:border-b-0"
                          onClick={() => setActiveTopic(topic)}
                        >
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleComplete(topic.id); }}
                            className={`flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              done ? 'bg-green-500 border-green-500 text-white' : 'border-muted-foreground/30 hover:border-primary'
                            }`}
                          >
                            {done && <CheckCircle2 className="h-4 w-4" />}
                            {!done && <span className="text-[10px] font-medium text-muted-foreground">{i + 1}</span>}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${done ? 'text-muted-foreground line-through' : ''}`}>{topic.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{topic.summary}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-muted-foreground">{topic.readTimeMin} min</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
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
        if (lessonData?.sections) setLessons(lessonData.sections);
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
  const [view, setView] = useState<'home' | 'study' | 'create'>('home');
  const [cards, setCards] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Study state
  const [deck, setDeck] = useState<any[]>([]);
  const [deckIndex, setDeckIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ seen: 0, correct: 0, incorrect: 0 });

  // Create state
  const [form, setForm] = useState({ front: '', back: '', hint: '', section_id: '', topic: '', difficulty: 'medium' });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [cardData, statsData] = await Promise.all([
          apiClient.getDueFlashcards(examType, 30).catch(() => null),
          apiClient.getFlashcardStats(examType).catch(() => null),
        ]);
        if (cardData?.cards) setCards(cardData.cards);
        if (statsData) setStats(statsData);
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, [examType]);

  const startStudy = () => {
    if (cards.length === 0) return;
    setDeck(cards);
    setDeckIndex(0);
    setFlipped(false);
    setSessionStats({ seen: 0, correct: 0, incorrect: 0 });
    setView('study');
  };

  const rateCard = async (rating: number) => {
    const card = deck[deckIndex];
    if (!card) return;

    try {
      await apiClient.reviewFlashcard({ flashcard_id: card.id, rating });
    } catch { /* ignore */ }

    setSessionStats((prev) => ({
      seen: prev.seen + 1,
      correct: rating >= 3 ? prev.correct + 1 : prev.correct,
      incorrect: rating < 3 ? prev.incorrect + 1 : prev.incorrect,
    }));

    if (deckIndex + 1 < deck.length) {
      setDeckIndex(deckIndex + 1);
      setFlipped(false);
    } else {
      setView('home');
      // Refresh stats
      apiClient.getFlashcardStats(examType).then(setStats).catch(() => {});
      apiClient.getDueFlashcards(examType, 30).then((d) => setCards(d.cards || [])).catch(() => {});
    }
  };

  const saveCard = async () => {
    if (!form.front.trim() || !form.back.trim()) return;
    try {
      await apiClient.createFlashcard({ exam_type: examType, ...form });
      setForm({ front: '', back: '', hint: '', section_id: '', topic: '', difficulty: 'medium' });
      setView('home');
      apiClient.getFlashcardStats(examType).then(setStats).catch(() => {});
      apiClient.getDueFlashcards(examType, 30).then((d) => setCards(d.cards || [])).catch(() => {});
    } catch { /* ignore */ }
  };

  // ── Study view ──
  if (view === 'study' && deck.length > 0) {
    const card = deck[deckIndex];
    const progress = deckIndex / deck.length;

    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Progress */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setView('home')}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Exit
          </Button>
          <span className="text-sm text-muted-foreground">{deckIndex + 1} / {deck.length}</span>
          <div className="flex gap-2 text-sm">
            <span className="text-green-600 font-medium">{sessionStats.correct}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-red-600 font-medium">{sessionStats.incorrect}</span>
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5">
          <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${progress * 100}%` }} />
        </div>

        {/* Card */}
        <div
          onClick={() => setFlipped(!flipped)}
          className="cursor-pointer select-none"
        >
          <Card className={`p-8 min-h-[320px] flex flex-col items-center justify-center text-center transition-all ${
            flipped ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800' : ''
          }`}>
            {card.section_id && (
              <Badge variant="secondary" className="mb-4">{card.section_id}{card.topic ? ` · ${card.topic}` : ''}</Badge>
            )}
            {!flipped ? (
              <>
                <p className="text-xl font-medium mb-6">{card.front}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Eye className="h-4 w-4" /> Tap to reveal answer
                </p>
              </>
            ) : (
              <>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Answer</p>
                <p className="text-lg mb-4">{card.back}</p>
                {card.hint && (
                  <p className="text-sm text-muted-foreground italic">💡 {card.hint}</p>
                )}
              </>
            )}
          </Card>
        </div>

        {/* Rating buttons (only after flip) */}
        {flipped && (
          <div className="grid grid-cols-4 gap-2">
            <Button variant="outline" className="flex-col h-auto py-3 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950" onClick={() => rateCard(1)}>
              <RotateCcw className="h-5 w-5 text-red-500 mb-1" />
              <span className="text-xs font-medium">Again</span>
              <span className="text-[10px] text-muted-foreground">1 min</span>
            </Button>
            <Button variant="outline" className="flex-col h-auto py-3 border-orange-200 hover:bg-orange-50 dark:border-orange-800 dark:hover:bg-orange-950" onClick={() => rateCard(2)}>
              <ThumbsDown className="h-5 w-5 text-orange-500 mb-1" />
              <span className="text-xs font-medium">Hard</span>
              <span className="text-[10px] text-muted-foreground">~1 day</span>
            </Button>
            <Button variant="outline" className="flex-col h-auto py-3 border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-950" onClick={() => rateCard(3)}>
              <ThumbsUp className="h-5 w-5 text-green-500 mb-1" />
              <span className="text-xs font-medium">Good</span>
              <span className="text-[10px] text-muted-foreground">~3 days</span>
            </Button>
            <Button variant="outline" className="flex-col h-auto py-3 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950" onClick={() => rateCard(4)}>
              <Zap className="h-5 w-5 text-blue-500 mb-1" />
              <span className="text-xs font-medium">Easy</span>
              <span className="text-[10px] text-muted-foreground">~7 days</span>
            </Button>
          </div>
        )}
      </div>
    );
  }

  // ── Create view ──
  if (view === 'create') {
    return (
      <div className="max-w-xl mx-auto space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setView('home')}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Create Flashcard</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Front (Question / Term)</label>
            <textarea value={form.front} onChange={(e) => setForm({ ...form, front: e.target.value })} rows={3}
              placeholder="e.g. What is the Commerce Clause?"
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Back (Answer / Definition)</label>
            <textarea value={form.back} onChange={(e) => setForm({ ...form, back: e.target.value })} rows={3}
              placeholder="e.g. Article I, Section 8 grants Congress the power to regulate commerce among the states..."
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hint (optional)</label>
            <input value={form.hint} onChange={(e) => setForm({ ...form, hint: e.target.value })}
              placeholder="A short clue..."
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Section</label>
              <select value={form.section_id} onChange={(e) => setForm({ ...form, section_id: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="">General</option>
                {sections.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Difficulty</label>
              <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg text-sm">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" onClick={() => setView('home')}>Cancel</Button>
            <Button onClick={saveCard} disabled={!form.front.trim() || !form.back.trim()}>Save Flashcard</Button>
          </div>
        </Card>
      </div>
    );
  }

  // ── Home view ──
  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-4">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold">{stats.total_cards}</p>
            <p className="text-xs text-muted-foreground">Total Cards</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{stats.due_now}</p>
            <p className="text-xs text-muted-foreground">Due for Review</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.mastered}</p>
            <p className="text-xs text-muted-foreground">Mastered</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.studied}</p>
            <p className="text-xs text-muted-foreground">Studied</p>
          </Card>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={startStudy} disabled={loading || cards.length === 0} size="lg">
          <Layers className="h-4 w-4 mr-2" />
          Study {cards.length > 0 ? `(${cards.length} cards)` : ''}
        </Button>
        <Button variant="outline" onClick={() => setView('create')} size="lg">
          <Plus className="h-4 w-4 mr-2" /> Create Card
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : cards.length === 0 && (!stats || stats.total_cards === 0) ? (
        <Card className="p-12 text-center">
          <Layers className="h-16 w-16 mx-auto mb-4 text-muted-foreground/40" />
          <h3 className="text-lg font-semibold mb-2">No flashcards yet</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Create your own flashcards or wait for the {examType} deck to be added.
          </p>
          <Button onClick={() => setView('create')}>
            <Plus className="h-4 w-4 mr-2" /> Create your first flashcard
          </Button>
        </Card>
      ) : (
        <div>
          <h3 className="font-semibold mb-3">Cards Due for Review</h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {cards.slice(0, 12).map((card: any) => (
              <Card key={card.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  {card.section_id && <Badge variant="secondary" className="text-[10px]">{card.section_id}</Badge>}
                  {card.difficulty && (
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                      card.difficulty === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : card.difficulty === 'hard' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>{card.difficulty}</span>
                  )}
                </div>
                <p className="text-sm font-medium line-clamp-2">{card.front}</p>
                {card.progress && (
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Streak: {card.progress.streak} &middot; Seen: {card.progress.times_seen}x
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
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
      // Fallback if no questions in DB
      alert('No questions available for this exam yet. Questions are being added.');
    }
    setLoading(false);
  };

  const submitAnswer = async () => {
    if (selectedAnswer === null || !sessionId || !currentQ) return;
    setLoading(true);
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
