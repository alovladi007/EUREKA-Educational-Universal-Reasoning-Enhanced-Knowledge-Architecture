"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  Brain,
  Heart,
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  AlertCircle,
  Info,
  FlaskConical,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────
// IMPORTANT — these demos are ILLUSTRATIVE, not live model inference.
//
// EUREKA does not host or run any medical ML model. There is no inference
// backend behind this page. The "results" below are pre-authored, static
// example distributions that show what a classifier's output UI looks like;
// they are chosen to match the sample you pick so the illustration is
// internally consistent. Nothing is uploaded, and no prediction is computed.
//
// The model-info cards describe PUBLISHED reference architectures/benchmarks
// on real public datasets (PTB-XL, ChestX-ray14, HAM10000). Those metrics are
// what the literature reports for those models — they are NOT measured by
// anything running in this app.
// ─────────────────────────────────────────────────────────────────────────

interface ClassDef {
  label: string;
  color: string;
}

interface PredictionResult extends ClassDef {
  confidence: number;
}

interface SampleDef {
  /** value passed to the handler + shown as the selected chip */
  key: string;
  /** button caption */
  label: string;
  /** which class this sample illustrates (must match a ClassDef.label) */
  primary: string;
}

interface DemoConfig {
  id: string;
  tabLabel: string;
  icon: LucideIcon;
  title: string;
  description: string;
  uploadHint: string;
  samplesHeading: string;
  emptyHint: string;
  preparingLabel: string;
  samples: SampleDef[];
  classes: ClassDef[];
  model: {
    architecture: string;
    dataset: string;
    metricLabel: string;
    metricValue: string;
    classes: string;
  };
}

// Fixed illustrative confidences: dominant class first, then a decaying tail.
const ILLUSTRATIVE_WEIGHTS = [0.86, 0.08, 0.04, 0.02];

/** Build a static, internally-consistent example distribution for a sample. */
function buildIllustrative(
  classes: ClassDef[],
  primaryLabel: string,
): PredictionResult[] {
  const primary = classes.find((c) => c.label === primaryLabel) ?? classes[0];
  const rest = classes.filter((c) => c.label !== primary.label);
  return [primary, ...rest].map((c, i) => ({
    ...c,
    confidence: ILLUSTRATIVE_WEIGHTS[i] ?? 0.01,
  }));
}

const DEMOS: DemoConfig[] = [
  {
    id: "ecg",
    tabLabel: "ECG Analysis",
    icon: Heart,
    title: "ECG Analysis",
    description:
      "Cardiac-rhythm classification from 12-lead ECG — illustrative example of a deep-learning classifier's output.",
    uploadHint: "Upload is disabled in this illustrative demo — try a sample instead.",
    samplesHeading: "Try Sample ECG Recordings:",
    emptyHint: "Select a sample ECG to see an example result",
    preparingLabel: "Preparing sample result…",
    samples: [
      { key: "Normal Sinus", label: "Normal Sinus Rhythm", primary: "Normal Sinus Rhythm" },
      { key: "AFib", label: "Atrial Fibrillation", primary: "Atrial Fibrillation" },
      { key: "VTach", label: "V-Tach", primary: "Ventricular Tachycardia" },
      { key: "PVC", label: "PVCs", primary: "Premature Ventricular Contractions" },
    ],
    classes: [
      { label: "Normal Sinus Rhythm", color: "text-green-600" },
      { label: "Atrial Fibrillation", color: "text-orange-600" },
      { label: "Ventricular Tachycardia", color: "text-red-600" },
      { label: "Premature Ventricular Contractions", color: "text-yellow-600" },
    ],
    model: {
      architecture: "ResNet-50 + LSTM",
      dataset: "PTB-XL (21,837 ECGs)",
      metricLabel: "Reported accuracy",
      metricValue: "~94% (literature)",
      classes: "12 Cardiac Rhythms",
    },
  },
  {
    id: "radiology",
    tabLabel: "Radiology",
    icon: ImageIcon,
    title: "Chest X-Ray Analysis",
    description:
      "Thoracic-pathology detection from chest radiographs — illustrative example of a classifier's output.",
    uploadHint: "Upload is disabled in this illustrative demo — try a sample instead.",
    samplesHeading: "Try Sample X-Ray Images:",
    emptyHint: "Select a sample X-ray to see an example result",
    preparingLabel: "Preparing sample result…",
    samples: [
      { key: "Normal Chest", label: "Normal Chest", primary: "Normal" },
      { key: "Pneumonia", label: "Pneumonia", primary: "Pneumonia" },
      { key: "Effusion", label: "Pleural Effusion", primary: "Pleural Effusion" },
      { key: "Cardiomegaly", label: "Cardiomegaly", primary: "Cardiomegaly" },
    ],
    classes: [
      { label: "Normal", color: "text-green-600" },
      { label: "Pneumonia", color: "text-red-600" },
      { label: "Pleural Effusion", color: "text-orange-600" },
      { label: "Cardiomegaly", color: "text-yellow-600" },
    ],
    model: {
      architecture: "DenseNet-121",
      dataset: "ChestX-ray14 (112K images)",
      metricLabel: "Reported AUC",
      metricValue: "~0.89 (literature)",
      classes: "14 Thoracic Conditions",
    },
  },
  {
    id: "dermatology",
    tabLabel: "Dermatology",
    icon: Brain,
    title: "Skin Lesion Analysis",
    description:
      "Skin-lesion classification from dermoscopy — illustrative example of a classifier's output.",
    uploadHint: "Upload is disabled in this illustrative demo — try a sample instead.",
    samplesHeading: "Try Sample Lesion Images:",
    emptyHint: "Select a sample lesion to see an example result",
    preparingLabel: "Preparing sample result…",
    samples: [
      { key: "Benign Nevus", label: "Benign Nevus", primary: "Benign Nevus" },
      { key: "Melanoma", label: "Melanoma", primary: "Melanoma" },
      { key: "Seborrheic Keratosis", label: "Seb. Keratosis", primary: "Seborrheic Keratosis" },
      { key: "Basal Cell", label: "Basal Cell", primary: "Basal Cell Carcinoma" },
    ],
    classes: [
      { label: "Benign Nevus", color: "text-green-600" },
      { label: "Melanoma", color: "text-red-600" },
      { label: "Seborrheic Keratosis", color: "text-orange-600" },
      { label: "Basal Cell Carcinoma", color: "text-yellow-600" },
    ],
    model: {
      architecture: "EfficientNet-B4",
      dataset: "HAM10000 (10K images)",
      metricLabel: "Reported accuracy",
      metricValue: "~92% (literature)",
      classes: "7 Skin Conditions",
    },
  },
];

function ModelDemo({ config }: { config: DemoConfig }) {
  const Icon = config.icon;
  const [isPreparing, setIsPreparing] = useState(false);
  const [predictions, setPredictions] = useState<PredictionResult[] | null>(null);
  const [selectedSample, setSelectedSample] = useState<SampleDef | null>(null);

  const showSample = (sample: SampleDef) => {
    setSelectedSample(sample);
    setIsPreparing(true);
    setPredictions(null);
    // Brief delay is a UI affordance only — no model runs, nothing is
    // computed. We just reveal the pre-authored example for this sample.
    setTimeout(() => {
      setIsPreparing(false);
      setPredictions(buildIllustrative(config.classes, sample.primary));
    }, 700);
  };

  const reset = () => {
    setSelectedSample(null);
    setPredictions(null);
    setIsPreparing(false);
  };

  const top = predictions?.[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Panel */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon className="w-5 h-5" />
              {config.title}
            </CardTitle>
            <CardDescription>{config.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                {config.uploadHint}
              </p>
              <Button variant="outline" disabled>
                <Upload className="w-4 h-4 mr-2" />
                Upload (disabled)
              </Button>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">{config.samplesHeading}</p>
              <div className="grid grid-cols-2 gap-2">
                {config.samples.map((s) => (
                  <Button
                    key={s.key}
                    variant="outline"
                    size="sm"
                    onClick={() => showSample(s)}
                    disabled={isPreparing}
                  >
                    {s.label}
                  </Button>
                ))}
              </div>
            </div>

            {selectedSample && (
              <div className="p-4 rounded-lg bg-accent">
                <p className="text-sm font-medium mb-2">Selected sample:</p>
                <p className="text-sm">{selectedSample.key}</p>
                <Button variant="ghost" size="sm" className="mt-2" onClick={reset}>
                  <X className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="w-5 h-5" />
              Reference model
            </CardTitle>
            <CardDescription>
              A published architecture/benchmark — <strong>not run in this app</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Architecture:</span>
              <span className="font-medium">{config.model.architecture}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Training dataset:</span>
              <span className="font-medium">{config.model.dataset}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{config.model.metricLabel}:</span>
              <span className="font-medium">{config.model.metricValue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Classes:</span>
              <span className="font-medium">{config.model.classes}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Panel */}
      <div>
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <div>
                <CardTitle>Example result</CardTitle>
                <CardDescription>
                  Pre-authored sample output — not a live prediction
                </CardDescription>
              </div>
              <Badge variant="outline" className="shrink-0 gap-1">
                <FlaskConical className="w-3 h-3" />
                Illustrative
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {!selectedSample && !predictions && (
              <div className="flex items-center justify-center h-64 text-center">
                <div>
                  <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">{config.emptyHint}</p>
                </div>
              </div>
            )}

            {isPreparing && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                    {config.preparingLabel}
                  </p>
                </div>
              </div>
            )}

            {predictions && top && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/60 border">
                  <div className="flex items-start gap-3">
                    <FlaskConical className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">{top.label}</p>
                      <p className="text-sm text-muted-foreground">
                        Example confidence: {(top.confidence * 100).toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Illustrative output only — no model was run and nothing
                        was analyzed. Not a diagnosis.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">All classes (example):</p>
                  <div className="space-y-3">
                    {predictions.map((pred, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{pred.label}</span>
                          <span className={cn("text-sm font-semibold", pred.color)}>
                            {(pred.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${pred.confidence * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button className="w-full" variant="outline" onClick={reset}>
                    <X className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function MLDemosPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI/ML Model Demonstrations</h1>
        <p className="text-muted-foreground mt-2">
          Illustrations of how medical-imaging classifiers present their output.
          These are teaching demos — no model runs here.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Medical AI Demo Hub</CardTitle>
              <CardDescription className="mt-1">
                Interactive walk-throughs of what published deep-learning models
                for medical imaging output — using pre-authored example results.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Up-front honesty banner */}
          <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <FlaskConical className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Illustrative demo — not live inference
                </p>
                <p className="text-blue-800 dark:text-blue-200">
                  EUREKA does not host or run these models. Nothing is uploaded
                  and no prediction is computed. Each &ldquo;result&rdquo; is a
                  pre-authored example chosen to match the sample you select, so
                  you can see how such a classifier presents its output. The
                  model cards cite figures reported in the literature for the
                  named public benchmarks.
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="ecg" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {DEMOS.map((d) => {
                const TabIcon = d.icon;
                return (
                  <TabsTrigger
                    key={d.id}
                    value={d.id}
                    className="flex items-center gap-2"
                  >
                    <TabIcon className="w-4 h-4" />
                    {d.tabLabel}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div className="mt-6">
              {DEMOS.map((d) => (
                <TabsContent key={d.id} value={d.id} className="m-0">
                  <ModelDemo config={d} />
                </TabsContent>
              ))}
            </div>
          </Tabs>

          {/* Clinical disclaimer */}
          <div className="mt-6 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                  Educational purpose only
                </p>
                <p className="text-yellow-800 dark:text-yellow-200">
                  These demonstrations are for education. They are not medical
                  devices, do not perform diagnosis, and must never be used for
                  clinical decisions. Always consult a qualified healthcare
                  professional.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
