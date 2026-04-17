"use client";

import { useState } from "react";
import { useResumeStore } from "@/stores/resume";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  User,
  Briefcase,
  GraduationCap,
  Target,
  Layout,
  Check,
} from "lucide-react";
import { TEMPLATES, TEMPLATE_LIST } from "@/lib/resume/template-registry";
import type { TemplateId } from "@/types/resume";
import { generateId } from "@/lib/resume/default-data";

interface OnboardingWizardProps {
  onComplete: (resumeId: string) => void;
  onCancel: () => void;
}

export function OnboardingWizard({ onComplete, onCancel }: OnboardingWizardProps) {
  const createDocument = useResumeStore((s) => s.createDocument);
  const [step, setStep] = useState(0);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [headline, setHeadline] = useState("");
  const [yearsExp, setYearsExp] = useState("");
  const [currentCompany, setCurrentCompany] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("meridian");

  const steps = [
    { icon: User, label: "Your Info", description: "Basic contact details" },
    { icon: Briefcase, label: "Current Role", description: "Your experience level" },
    { icon: Target, label: "Target", description: "What you're aiming for" },
    { icon: Layout, label: "Template", description: "Choose your look" },
    { icon: Check, label: "Create", description: "Launch your resume" },
  ];

  const handleCreate = () => {
    const id = createDocument(`${firstName || "My"}'s Resume`);
    const store = useResumeStore.getState();
    const doc = store.documents[id];
    if (doc) {
      doc.data.header.firstName = firstName;
      doc.data.header.lastName = lastName;
      doc.data.header.email = email;
      doc.data.header.phone = phone;
      doc.data.header.headline = headline || targetRole;
      doc.templateId = selectedTemplate;

      // Pre-populate experience if provided
      if (currentCompany && headline) {
        doc.data.experience = [{
          id: generateId("exp"),
          company: currentCompany,
          title: headline,
          location: "",
          startDate: "",
          endDate: null,
          current: true,
          bullets: [
            { id: generateId("b"), content: "", highlighted: false },
            { id: generateId("b"), content: "", highlighted: false },
            { id: generateId("b"), content: "", highlighted: false },
          ],
        }];
      }

      // Pre-populate summary placeholder
      if (targetRole && yearsExp) {
        doc.data.summary.content = `Experienced ${headline || targetRole} with ${yearsExp}+ years of professional experience. Seeking to leverage expertise in [key skills] to drive impact as a ${targetRole}.`;
      }
    }
    onComplete(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-xl p-0 overflow-hidden">
        {/* Progress bar */}
        <div className="flex border-b">
          {steps.map((s, i) => (
            <button
              key={i}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 px-2 text-xs font-medium transition-colors ${
                i === step
                  ? "bg-primary/10 text-primary border-b-2 border-primary"
                  : i < step
                  ? "text-primary/60"
                  : "text-muted-foreground"
              }`}
              onClick={() => i < step && setStep(i)}
              disabled={i > step}
            >
              <s.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6 min-h-[300px]">
          {/* Step 0: Basic Info */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold">Let's get started</h2>
                <p className="text-sm text-muted-foreground mt-1">Tell us about yourself</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">First Name</Label>
                  <Input className="h-9" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" autoFocus />
                </div>
                <div>
                  <Label className="text-xs">Last Name</Label>
                  <Input className="h-9" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" />
                </div>
                <div>
                  <Label className="text-xs">Email</Label>
                  <Input className="h-9" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
                </div>
                <div>
                  <Label className="text-xs">Phone</Label>
                  <Input className="h-9" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Current Role */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold">Your current role</h2>
                <p className="text-sm text-muted-foreground mt-1">This helps us customize your resume</p>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Current Job Title</Label>
                  <Input className="h-9" value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Software Engineer" />
                </div>
                <div>
                  <Label className="text-xs">Current Company</Label>
                  <Input className="h-9" value={currentCompany} onChange={(e) => setCurrentCompany(e.target.value)} placeholder="Acme Inc." />
                </div>
                <div>
                  <Label className="text-xs">Years of Experience</Label>
                  <Input className="h-9" value={yearsExp} onChange={(e) => setYearsExp(e.target.value)} placeholder="5" type="number" min="0" max="50" />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Target */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold">What are you targeting?</h2>
                <p className="text-sm text-muted-foreground mt-1">We'll tailor suggestions to your goal</p>
              </div>
              <div>
                <Label className="text-xs">Target Role / Position</Label>
                <Input className="h-9" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="Senior Software Engineer at Google" />
              </div>
              <div className="p-3 rounded-lg bg-violet-50 dark:bg-violet-950/20 border border-violet-200">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  <span className="text-sm font-medium text-violet-700 dark:text-violet-300">AI will help you</span>
                </div>
                <p className="text-xs text-violet-600 dark:text-violet-400 mt-1">
                  Our AI assistant will generate a professional summary and suggest bullet points tailored to your target role.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Template */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold">Choose a template</h2>
                <p className="text-sm text-muted-foreground mt-1">You can change this anytime</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {TEMPLATE_LIST.map((t) => (
                  <button
                    key={t.id}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      selectedTemplate === t.id
                        ? "border-primary bg-primary/5"
                        : "border-transparent bg-muted/50 hover:bg-muted"
                    }`}
                    onClick={() => setSelectedTemplate(t.id)}
                  >
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.bestFor}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Ready to build!</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  We'll create your resume with the {TEMPLATES[selectedTemplate].name} template
                  {firstName ? ` for ${firstName} ${lastName}` : ""}.
                </p>
              </div>
              <div className="text-left p-3 rounded-lg bg-muted/50 text-sm space-y-1">
                {firstName && <p><span className="font-medium">Name:</span> {firstName} {lastName}</p>}
                {headline && <p><span className="font-medium">Current:</span> {headline}{currentCompany ? ` at ${currentCompany}` : ""}</p>}
                {targetRole && <p><span className="font-medium">Target:</span> {targetRole}</p>}
                <p><span className="font-medium">Template:</span> {TEMPLATES[selectedTemplate].name}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/30">
          <Button variant="ghost" size="sm" onClick={step === 0 ? onCancel : () => setStep(step - 1)}>
            {step === 0 ? "Cancel" : <><ChevronLeft className="w-4 h-4 mr-1" /> Back</>}
          </Button>
          <div className="flex items-center gap-1">
            {steps.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === step ? "bg-primary" : i < step ? "bg-primary/40" : "bg-muted-foreground/20"}`} />
            ))}
          </div>
          {step < 4 ? (
            <Button size="sm" onClick={() => setStep(step + 1)}>
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={handleCreate}>
              <Sparkles className="w-4 h-4 mr-1" /> Create Resume
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
