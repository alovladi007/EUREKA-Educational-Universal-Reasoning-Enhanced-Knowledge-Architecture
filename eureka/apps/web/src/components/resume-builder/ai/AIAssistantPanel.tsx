"use client";

import { useState, useCallback } from "react";
import { useResumeStore } from "@/stores/resume";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sparkles,
  X,
  FileText,
  Zap,
  Lightbulb,
  Target,
  RefreshCw,
  Check,
  Loader2,
  Copy,
} from "lucide-react";

interface AIAssistantPanelProps {
  open: boolean;
  onClose: () => void;
}

type AIMode = "summary" | "bullets" | "improve" | "tailor" | "skills" | "tone";

// Simulated AI responses (replace with actual API calls in Phase 5)
async function generateAISummary(title: string, years: string): Promise<string[]> {
  await new Promise(r => setTimeout(r, 1500));
  return [
    `Results-driven ${title} with ${years}+ years of experience delivering high-impact solutions. Proven track record of leading cross-functional teams, optimizing processes, and driving measurable business outcomes. Passionate about leveraging technology to solve complex challenges.`,
    `Dynamic ${title} with ${years} years of progressive experience in fast-paced environments. Expert in building scalable systems, mentoring teams, and translating business requirements into technical solutions. Strong communicator with a data-driven approach to problem-solving.`,
    `Accomplished ${title} with ${years}+ years of expertise spanning full software development lifecycle. Demonstrated ability to architect robust systems, improve performance by 40%+, and deliver products used by millions. Committed to continuous learning and engineering excellence.`,
  ];
}

async function generateAIBullets(title: string, company: string, context: string): Promise<string[]> {
  await new Promise(r => setTimeout(r, 1500));
  return [
    `Led cross-functional initiative at ${company} resulting in 30% improvement in key performance metrics and $500K+ in annual cost savings`,
    `Architected and deployed scalable ${context || "system"} serving 100K+ users with 99.9% uptime and sub-200ms response times`,
    `Spearheaded adoption of modern engineering practices, reducing deployment time by 60% and increasing team velocity by 25%`,
    `Mentored 5+ junior team members through structured development programs, resulting in 3 promotions within 18 months`,
    `Designed and implemented automated testing framework achieving 95%+ code coverage, reducing production incidents by 40%`,
  ];
}

async function improveAIBullet(bullet: string): Promise<string[]> {
  await new Promise(r => setTimeout(r, 1200));
  const improved = bullet.replace(/worked on/i, "Architected and delivered")
    .replace(/responsible for/i, "Led")
    .replace(/helped/i, "Drove");
  return [
    improved + (bullet.match(/\d/) ? "" : ", resulting in 25% improvement in operational efficiency"),
    `${improved.split(",")[0]}, leveraging best practices to achieve measurable impact across the organization`,
    `Spearheaded ${bullet.toLowerCase().replace(/^(i |we |the team )/i, "").trim()}, exceeding targets by 20%`,
  ];
}

export function AIAssistantPanel({ open, onClose }: AIAssistantPanelProps) {
  const doc = useResumeStore((s) => s.activeDocument());
  const updateSummary = useResumeStore((s) => s.updateSummary);

  const [mode, setMode] = useState<AIMode>("summary");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [jobTitle, setJobTitle] = useState("");
  const [years, setYears] = useState("");
  const [company, setCompany] = useState("");
  const [context, setContext] = useState("");
  const [bulletToImprove, setBulletToImprove] = useState("");

  const generateSummary = useCallback(async () => {
    setLoading(true);
    setResults([]);
    try {
      const summaries = await generateAISummary(
        jobTitle || doc?.data.header.headline || "Professional",
        years || "5"
      );
      setResults(summaries);
    } finally {
      setLoading(false);
    }
  }, [jobTitle, years, doc]);

  const generateBullets = useCallback(async () => {
    setLoading(true);
    setResults([]);
    try {
      const bullets = await generateAIBullets(
        jobTitle || doc?.data.header.headline || "Professional",
        company || "the organization",
        context
      );
      setResults(bullets);
    } finally {
      setLoading(false);
    }
  }, [jobTitle, company, context, doc]);

  const improveBullet = useCallback(async () => {
    if (!bulletToImprove.trim()) return;
    setLoading(true);
    setResults([]);
    try {
      const improved = await improveAIBullet(bulletToImprove);
      setResults(improved);
    } finally {
      setLoading(false);
    }
  }, [bulletToImprove]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!open) return null;

  const MODES: { id: AIMode; icon: React.ElementType; label: string }[] = [
    { id: "summary", icon: FileText, label: "Summary" },
    { id: "bullets", icon: Zap, label: "Bullets" },
    { id: "improve", icon: Lightbulb, label: "Improve" },
    { id: "tailor", icon: Target, label: "Tailor" },
  ];

  return (
    <div className="fixed right-0 top-16 bottom-0 w-96 bg-background border-l shadow-xl z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-violet-50 dark:bg-violet-950/20">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-500" />
          <span className="font-semibold text-sm">AI Writing Assistant</span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Mode Tabs */}
      <div className="flex border-b px-2 py-1 gap-1">
        {MODES.map((m) => (
          <Button
            key={m.id}
            variant={mode === m.id ? "secondary" : "ghost"}
            size="sm"
            className="flex-1 h-7 text-xs gap-1"
            onClick={() => { setMode(m.id); setResults([]); }}
          >
            <m.icon className="w-3 h-3" />
            {m.label}
          </Button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {mode === "summary" && (
          <>
            <div>
              <Label className="text-xs">Job Title</Label>
              <Input className="h-8 text-sm" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder={doc?.data.header.headline || "Software Engineer"} />
            </div>
            <div>
              <Label className="text-xs">Years of Experience</Label>
              <Input className="h-8 text-sm" value={years} onChange={(e) => setYears(e.target.value)} placeholder="5" />
            </div>
            <Button className="w-full h-8 text-xs bg-violet-500 hover:bg-violet-600" onClick={generateSummary} disabled={loading}>
              {loading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Sparkles className="w-3 h-3 mr-1" />}
              Generate 3 Summary Variants
            </Button>
          </>
        )}

        {mode === "bullets" && (
          <>
            <div>
              <Label className="text-xs">Job Title</Label>
              <Input className="h-8 text-sm" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Software Engineer" />
            </div>
            <div>
              <Label className="text-xs">Company</Label>
              <Input className="h-8 text-sm" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Inc." />
            </div>
            <div>
              <Label className="text-xs">What did you do? (brief description)</Label>
              <textarea
                className="w-full min-h-[60px] rounded border bg-background px-3 py-2 text-sm resize-y"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Built APIs, managed databases, led a team..."
              />
            </div>
            <Button className="w-full h-8 text-xs bg-violet-500 hover:bg-violet-600" onClick={generateBullets} disabled={loading}>
              {loading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Zap className="w-3 h-3 mr-1" />}
              Generate 5 Strong Bullets
            </Button>
          </>
        )}

        {mode === "improve" && (
          <>
            <div>
              <Label className="text-xs">Paste a bullet point to improve</Label>
              <textarea
                className="w-full min-h-[60px] rounded border bg-background px-3 py-2 text-sm resize-y"
                value={bulletToImprove}
                onChange={(e) => setBulletToImprove(e.target.value)}
                placeholder="Worked on building the company website..."
              />
            </div>
            <Button className="w-full h-8 text-xs bg-violet-500 hover:bg-violet-600" onClick={improveBullet} disabled={loading || !bulletToImprove.trim()}>
              {loading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Lightbulb className="w-3 h-3 mr-1" />}
              Improve with AI
            </Button>
          </>
        )}

        {mode === "tailor" && (
          <>
            <div>
              <Label className="text-xs">Paste the Job Description</Label>
              <textarea
                className="w-full min-h-[100px] rounded border bg-background px-3 py-2 text-sm resize-y"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="We are looking for a Senior Software Engineer who..."
              />
            </div>
            <Button className="w-full h-8 text-xs bg-violet-500 hover:bg-violet-600" disabled>
              <Target className="w-3 h-3 mr-1" />
              Tailor Resume (Coming Soon)
            </Button>
            <p className="text-xs text-muted-foreground text-center">AI will analyze the JD and suggest resume improvements</p>
          </>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            <p className="text-xs font-semibold text-violet-600">AI Suggestions:</p>
            {results.map((result, i) => (
              <Card key={i} className="p-3 text-sm leading-relaxed hover:border-violet-300 transition-colors">
                <p>{result}</p>
                <div className="flex gap-1 mt-2">
                  {mode === "summary" && (
                    <Button
                      variant="ghost" size="sm" className="h-6 text-xs text-violet-500"
                      onClick={() => { updateSummary(result); onClose(); }}
                    >
                      <Check className="w-3 h-3 mr-1" /> Use This
                    </Button>
                  )}
                  <Button
                    variant="ghost" size="sm" className="h-6 text-xs"
                    onClick={() => copyToClipboard(result)}
                  >
                    <Copy className="w-3 h-3 mr-1" /> Copy
                  </Button>
                </div>
              </Card>
            ))}
            <Button variant="ghost" size="sm" className="w-full h-7 text-xs" onClick={mode === "summary" ? generateSummary : mode === "bullets" ? generateBullets : improveBullet} disabled={loading}>
              <RefreshCw className="w-3 h-3 mr-1" /> Regenerate
            </Button>
          </div>
        )}
      </div>

      <div className="p-3 border-t bg-muted/30">
        <p className="text-[10px] text-muted-foreground text-center">
          AI-generated content should be reviewed and personalized before use.
        </p>
      </div>
    </div>
  );
}
