"use client";

import { useState, useCallback } from "react";
import { useResumeStore } from "@/stores/resume";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  X,
  FileText,
  Zap,
  Lightbulb,
  Target,
  Wand2,
  RefreshCw,
  Check,
  Loader2,
  Copy,
  AlertCircle,
  Plus,
  MessageSquare,
} from "lucide-react";
import {
  apiGenerateSummary,
  apiGenerateBullets,
  apiTailorResume,
  apiSuggestSkills,
  apiCheckTone,
} from "@/lib/resume/api";

interface AIAssistantPanelProps {
  open: boolean;
  onClose: () => void;
}

type AIMode = "summary" | "bullets" | "improve" | "tailor" | "skills" | "tone";

export function AIAssistantPanel({ open, onClose }: AIAssistantPanelProps) {
  const doc = useResumeStore((s) => s.activeDocument());
  const updateSummary = useResumeStore((s) => s.updateSummary);
  const pushHistory = useResumeStore((s) => s.pushHistory);

  const [mode, setMode] = useState<AIMode>("summary");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<string[]>([]);
  const [tailorResults, setTailorResults] = useState<{
    summary_rewrite?: string;
    bullet_suggestions?: Array<{ original?: string; suggested: string; reason?: string }>;
    missing_keywords?: string[];
    skill_gaps?: string[];
    overall_match_score?: number;
  } | null>(null);
  const [skillResults, setSkillResults] = useState<Array<{ skill: string; category: string; relevance: string }>>([]);
  const [toneResults, setToneResults] = useState<{ issues: Array<{ original: string; suggestion: string; reason: string }>; tone_score: number; rewritten?: string } | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  // Form state
  const [jobTitle, setJobTitle] = useState("");
  const [years, setYears] = useState("");
  const [company, setCompany] = useState("");
  const [context, setContext] = useState("");
  const [bulletToImprove, setBulletToImprove] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const clearResults = () => {
    setResults([]);
    setTailorResults(null);
    setSkillResults([]);
    setToneResults(null);
    setError(null);
  };

  // ── Summary Generation ────────────────────────────────────
  const generateSummary = useCallback(async () => {
    setLoading(true);
    clearResults();
    try {
      const res = await apiGenerateSummary({
        title: jobTitle || doc?.data.header.headline || "Professional",
        years: years || "5",
        experience: doc?.data.experience,
        target_role: jobTitle || undefined,
      });
      setResults(res.variants);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate summary. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  }, [jobTitle, years, doc]);

  // ── Bullet Generation ─────────────────────────────────────
  const generateBullets = useCallback(async () => {
    setLoading(true);
    clearResults();
    try {
      const res = await apiGenerateBullets({
        action: "generate",
        title: jobTitle || doc?.data.header.headline || "Professional",
        company: company || undefined,
        context: context || undefined,
      });
      setResults(res.bullets);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate bullets.");
    } finally {
      setLoading(false);
    }
  }, [jobTitle, company, context, doc]);

  // ── Bullet Improvement ────────────────────────────────────
  const improveBullet = useCallback(async () => {
    if (!bulletToImprove.trim()) return;
    setLoading(true);
    clearResults();
    try {
      const res = await apiGenerateBullets({
        action: "improve",
        bullet: bulletToImprove,
        title: doc?.data.header.headline || undefined,
        company: doc?.data.experience[0]?.company || undefined,
      });
      setResults(res.bullets);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to improve bullet.");
    } finally {
      setLoading(false);
    }
  }, [bulletToImprove, doc]);

  // ── JD Tailoring ──────────────────────────────────────────
  const tailorResume = useCallback(async () => {
    if (!jobDescription.trim() || !doc) return;
    setLoading(true);
    clearResults();
    try {
      const res = await apiTailorResume({
        resume_data: doc.data as unknown as Record<string, unknown>,
        job_description: jobDescription,
      });
      setTailorResults(res as typeof tailorResults);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to tailor resume.");
    } finally {
      setLoading(false);
    }
  }, [jobDescription, doc]);

  // ── Skills Suggestion ─────────────────────────────────────
  const suggestSkills = useCallback(async () => {
    setLoading(true);
    clearResults();
    try {
      const res = await apiSuggestSkills({
        title: jobTitle || doc?.data.header.headline || "Professional",
        experience: doc?.data.experience,
        education: doc?.data.education,
      });
      setSkillResults(res.suggested_skills);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to suggest skills.");
    } finally {
      setLoading(false);
    }
  }, [jobTitle, doc]);

  // ── Tone Check ────────────────────────────────────────────
  const checkTone = useCallback(async () => {
    if (!doc) return;
    setLoading(true);
    clearResults();
    try {
      // Collect all bullet text
      const allText = [
        doc.data.summary.content,
        ...doc.data.experience.flatMap((e) => e.bullets.map((b) => b.content)),
        ...doc.data.projects.flatMap((p) => p.bullets.map((b) => b.content)),
      ].filter(Boolean).join("\n");

      if (!allText.trim()) {
        setError("No content to analyze. Add some experience bullets or a summary first.");
        return;
      }

      const res = await apiCheckTone({ text: allText });
      setToneResults(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to check tone.");
    } finally {
      setLoading(false);
    }
  }, [doc]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const useSummary = (text: string) => {
    pushHistory();
    updateSummary(text);
    onClose();
  };

  const addSkillToResume = (skill: string, category: string) => {
    if (!doc) return;
    const store = useResumeStore.getState();
    // Find matching group or create one
    const groups = doc.data.skills.groups;
    let group = groups.find((g) => g.label.toLowerCase() === category.toLowerCase());
    if (group) {
      if (!group.skills.includes(skill)) {
        store.addSkill(group.id, skill);
      }
    } else {
      // Add to first group or create via store
      if (groups.length > 0) {
        store.addSkill(groups[0].id, skill);
      }
    }
  };

  if (!open) return null;

  const MODES: { id: AIMode; icon: React.ElementType; label: string }[] = [
    { id: "summary", icon: FileText, label: "Summary" },
    { id: "bullets", icon: Zap, label: "Bullets" },
    { id: "improve", icon: Lightbulb, label: "Improve" },
    { id: "tailor", icon: Target, label: "Tailor" },
    { id: "skills", icon: Wand2, label: "Skills" },
    { id: "tone", icon: MessageSquare, label: "Tone" },
  ];

  return (
    <div className="fixed right-0 top-16 bottom-0 w-[420px] bg-background border-l shadow-xl z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-violet-50 dark:bg-violet-950/20">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-500" />
          <span className="font-semibold text-sm">AI Writing Assistant</span>
          <Badge variant="secondary" className="text-[10px] h-4">Powered by Claude</Badge>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Mode Tabs */}
      <div className="flex border-b px-1 py-1 gap-0.5 overflow-x-auto">
        {MODES.map((m) => (
          <Button
            key={m.id}
            variant={mode === m.id ? "secondary" : "ghost"}
            size="sm"
            className="h-7 text-[11px] gap-1 px-2 flex-shrink-0"
            onClick={() => { setMode(m.id); clearResults(); }}
          >
            <m.icon className="w-3 h-3" />
            {m.label}
          </Button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {/* ── Summary Mode ──────────────────────── */}
        {mode === "summary" && (
          <>
            <div>
              <Label className="text-xs">Job Title / Target Role</Label>
              <Input className="h-8 text-sm" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder={doc?.data.header.headline || "Software Engineer"} />
            </div>
            <div>
              <Label className="text-xs">Years of Experience</Label>
              <Input className="h-8 text-sm" value={years} onChange={(e) => setYears(e.target.value)} placeholder="5" />
            </div>
            <Button className="w-full h-9 text-xs bg-violet-500 hover:bg-violet-600" onClick={generateSummary} disabled={loading}>
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Sparkles className="w-3.5 h-3.5 mr-1.5" />}
              Generate 3 Summary Variants
            </Button>
          </>
        )}

        {/* ── Bullets Mode ──────────────────────── */}
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
              <textarea className="w-full min-h-[60px] rounded border bg-background px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-violet-500/20" value={context} onChange={(e) => setContext(e.target.value)} placeholder="Built APIs, managed databases, led a team of 5..." />
            </div>
            <Button className="w-full h-9 text-xs bg-violet-500 hover:bg-violet-600" onClick={generateBullets} disabled={loading}>
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Zap className="w-3.5 h-3.5 mr-1.5" />}
              Generate 5 Strong Bullets
            </Button>
          </>
        )}

        {/* ── Improve Mode ──────────────────────── */}
        {mode === "improve" && (
          <>
            <div>
              <Label className="text-xs">Paste a weak bullet point to improve</Label>
              <textarea className="w-full min-h-[60px] rounded border bg-background px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-violet-500/20" value={bulletToImprove} onChange={(e) => setBulletToImprove(e.target.value)} placeholder="Worked on building the company website and helped with various tasks..." />
            </div>
            <Button className="w-full h-9 text-xs bg-violet-500 hover:bg-violet-600" onClick={improveBullet} disabled={loading || !bulletToImprove.trim()}>
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Lightbulb className="w-3.5 h-3.5 mr-1.5" />}
              Improve with AI
            </Button>
          </>
        )}

        {/* ── Tailor Mode ───────────────────────── */}
        {mode === "tailor" && (
          <>
            <div>
              <Label className="text-xs">Paste the Job Description</Label>
              <textarea className="w-full min-h-[120px] rounded border bg-background px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-violet-500/20" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="We are looking for a Senior Software Engineer who..." />
            </div>
            <Button className="w-full h-9 text-xs bg-violet-500 hover:bg-violet-600" onClick={tailorResume} disabled={loading || !jobDescription.trim()}>
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Target className="w-3.5 h-3.5 mr-1.5" />}
              Tailor Resume to This Job
            </Button>
          </>
        )}

        {/* ── Skills Mode ───────────────────────── */}
        {mode === "skills" && (
          <>
            <div>
              <Label className="text-xs">Job Title / Target Role</Label>
              <Input className="h-8 text-sm" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder={doc?.data.header.headline || "Software Engineer"} />
            </div>
            <Button className="w-full h-9 text-xs bg-violet-500 hover:bg-violet-600" onClick={suggestSkills} disabled={loading}>
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Wand2 className="w-3.5 h-3.5 mr-1.5" />}
              Suggest Skills for This Role
            </Button>
          </>
        )}

        {/* ── Tone Mode ─────────────────────────── */}
        {mode === "tone" && (
          <>
            <p className="text-xs text-muted-foreground">Analyzes all your bullet points and summary for weak language, passive voice, and vague words.</p>
            <Button className="w-full h-9 text-xs bg-violet-500 hover:bg-violet-600" onClick={checkTone} disabled={loading}>
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <MessageSquare className="w-3.5 h-3.5 mr-1.5" />}
              Analyze Tone & Language
            </Button>
          </>
        )}

        {/* ── Error ──────────────────────────────── */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 text-sm">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 dark:text-red-400 text-xs">{error}</p>
          </div>
        )}

        {/* ── Text Results (Summary, Bullets, Improve) ────── */}
        {results.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            <p className="text-xs font-semibold text-violet-600 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Suggestions
            </p>
            {results.map((result, i) => (
              <Card key={i} className="p-3 text-sm leading-relaxed hover:border-violet-300 transition-colors">
                <p className="text-xs">{result}</p>
                <div className="flex gap-1 mt-2">
                  {mode === "summary" && (
                    <Button variant="ghost" size="sm" className="h-6 text-[10px] text-violet-500 hover:text-violet-600" onClick={() => useSummary(result)}>
                      <Check className="w-3 h-3 mr-0.5" /> Use This
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => copyToClipboard(result, i)}>
                    {copied === i ? <Check className="w-3 h-3 mr-0.5 text-green-500" /> : <Copy className="w-3 h-3 mr-0.5" />}
                    {copied === i ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </Card>
            ))}
            <Button variant="ghost" size="sm" className="w-full h-7 text-xs" onClick={mode === "summary" ? generateSummary : mode === "bullets" ? generateBullets : improveBullet} disabled={loading}>
              <RefreshCw className="w-3 h-3 mr-1" /> Regenerate
            </Button>
          </div>
        )}

        {/* ── Tailor Results ──────────────────────── */}
        {tailorResults && (
          <div className="space-y-3 pt-2 border-t">
            <p className="text-xs font-semibold text-violet-600 flex items-center gap-1">
              <Target className="w-3 h-3" /> Tailoring Results
            </p>

            {/* Match Score */}
            {tailorResults.overall_match_score !== undefined && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">Match Score:</span>
                <Badge className={`text-xs ${(tailorResults.overall_match_score ?? 0) >= 80 ? "bg-green-100 text-green-700" : (tailorResults.overall_match_score ?? 0) >= 60 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                  {tailorResults.overall_match_score}%
                </Badge>
              </div>
            )}

            {/* Rewritten Summary */}
            {tailorResults.summary_rewrite && (
              <Card className="p-3">
                <p className="text-[10px] font-semibold text-violet-500 mb-1">Tailored Summary</p>
                <p className="text-xs">{tailorResults.summary_rewrite}</p>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] mt-1 text-violet-500" onClick={() => useSummary(tailorResults.summary_rewrite!)}>
                  <Check className="w-3 h-3 mr-0.5" /> Use This Summary
                </Button>
              </Card>
            )}

            {/* Missing Keywords */}
            {tailorResults.missing_keywords && tailorResults.missing_keywords.length > 0 && (
              <Card className="p-3">
                <p className="text-[10px] font-semibold text-red-500 mb-1">Missing Keywords</p>
                <div className="flex flex-wrap gap-1">
                  {tailorResults.missing_keywords!.map((kw, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] text-red-600 border-red-200">{kw}</Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Skill Gaps */}
            {tailorResults.skill_gaps && tailorResults.skill_gaps.length > 0 && (
              <Card className="p-3">
                <p className="text-[10px] font-semibold text-amber-500 mb-1">Skill Gaps</p>
                <div className="flex flex-wrap gap-1">
                  {tailorResults.skill_gaps!.map((skill, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] text-amber-600 border-amber-200 cursor-pointer hover:bg-amber-50" onClick={() => addSkillToResume(skill, "Skills")}>
                      <Plus className="w-2.5 h-2.5 mr-0.5" /> {skill}
                    </Badge>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Click a skill to add it to your resume</p>
              </Card>
            )}

            {/* Bullet Suggestions */}
            {tailorResults.bullet_suggestions && tailorResults.bullet_suggestions.length > 0 && (
              <Card className="p-3">
                <p className="text-[10px] font-semibold text-violet-500 mb-1">Bullet Suggestions</p>
                {tailorResults.bullet_suggestions.map((s, i) => (
                  <div key={i} className="mb-2 text-xs">
                    <p className="text-green-600">→ {s.suggested}</p>
                    {s.reason && <p className="text-muted-foreground text-[10px] italic">{s.reason}</p>}
                    <Button variant="ghost" size="sm" className="h-5 text-[10px] mt-0.5" onClick={() => copyToClipboard(s.suggested, i + 100)}>
                      {copied === i + 100 ? <Check className="w-2.5 h-2.5 mr-0.5" /> : <Copy className="w-2.5 h-2.5 mr-0.5" />} Copy
                    </Button>
                  </div>
                ))}
              </Card>
            )}
          </div>
        )}

        {/* ── Skills Results ──────────────────────── */}
        {skillResults.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            <p className="text-xs font-semibold text-violet-600 flex items-center gap-1">
              <Wand2 className="w-3 h-3" /> Suggested Skills
            </p>
            {/* Group by category */}
            {Object.entries(
              skillResults.reduce<Record<string, typeof skillResults>>((acc, s) => {
                (acc[s.category] = acc[s.category] || []).push(s);
                return acc;
              }, {})
            ).map(([category, skills]) => (
              <Card key={category} className="p-3">
                <p className="text-[10px] font-semibold text-muted-foreground mb-1">{category}</p>
                <div className="flex flex-wrap gap-1">
                  {skills.map((s, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className={`text-[10px] cursor-pointer hover:bg-violet-50 transition-colors ${
                        s.relevance === "high" ? "border-green-300 text-green-700" :
                        s.relevance === "medium" ? "border-amber-300 text-amber-700" :
                        "border-gray-300 text-gray-600"
                      }`}
                      onClick={() => addSkillToResume(s.skill, category)}
                    >
                      <Plus className="w-2.5 h-2.5 mr-0.5" /> {s.skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
            <p className="text-[10px] text-muted-foreground text-center">Click a skill to add it to your resume</p>
          </div>
        )}

        {/* ── Tone Results ────────────────────────── */}
        {toneResults && (
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-violet-600 flex items-center gap-1">
                <MessageSquare className="w-3 h-3" /> Tone Analysis
              </p>
              <Badge className={`text-xs ${toneResults.tone_score >= 80 ? "bg-green-100 text-green-700" : toneResults.tone_score >= 60 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                Score: {toneResults.tone_score}/100
              </Badge>
            </div>

            {toneResults.issues.length === 0 ? (
              <Card className="p-3 text-center">
                <Check className="w-6 h-6 text-green-500 mx-auto" />
                <p className="text-xs font-medium mt-1">Your resume tone is excellent!</p>
              </Card>
            ) : (
              <>
                {toneResults.issues.map((issue, i) => (
                  <Card key={i} className="p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div className="text-xs">
                        <p><span className="line-through text-red-500">{issue.original}</span> → <span className="font-semibold text-green-600">{issue.suggestion}</span></p>
                        <p className="text-muted-foreground text-[10px] mt-0.5">{issue.reason}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </>
            )}

            {toneResults.rewritten && (
              <Card className="p-3">
                <p className="text-[10px] font-semibold text-violet-500 mb-1">Rewritten Version</p>
                <p className="text-xs whitespace-pre-wrap">{toneResults.rewritten}</p>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] mt-1" onClick={() => copyToClipboard(toneResults.rewritten!, 999)}>
                  {copied === 999 ? <Check className="w-2.5 h-2.5 mr-0.5" /> : <Copy className="w-2.5 h-2.5 mr-0.5" />} Copy All
                </Button>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t bg-muted/30">
        <p className="text-[10px] text-muted-foreground text-center">
          Powered by Claude AI. Review and personalize all suggestions before use.
        </p>
      </div>
    </div>
  );
}
