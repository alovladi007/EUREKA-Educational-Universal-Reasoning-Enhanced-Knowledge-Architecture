"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  Brain,
  Heart,
  Upload,
  X,
  Check,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  FileText,
  TrendingUp,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PredictionResult {
  label: string;
  confidence: number;
  color: string;
}

const SAMPLE_ECG_PREDICTIONS = [
  { label: "Normal Sinus Rhythm", confidence: 0.89, color: "text-green-600" },
  { label: "Atrial Fibrillation", confidence: 0.06, color: "text-orange-600" },
  { label: "Ventricular Tachycardia", confidence: 0.03, color: "text-red-600" },
  { label: "Premature Ventricular Contractions", confidence: 0.02, color: "text-yellow-600" },
];

const SAMPLE_XRAY_PREDICTIONS = [
  { label: "Normal", confidence: 0.12, color: "text-green-600" },
  { label: "Pneumonia", confidence: 0.78, color: "text-red-600" },
  { label: "Pleural Effusion", confidence: 0.07, color: "text-orange-600" },
  { label: "Cardiomegaly", confidence: 0.03, color: "text-yellow-600" },
];

const SAMPLE_DERM_PREDICTIONS = [
  { label: "Benign Nevus", confidence: 0.72, color: "text-green-600" },
  { label: "Melanoma", confidence: 0.15, color: "text-red-600" },
  { label: "Seborrheic Keratosis", confidence: 0.08, color: "text-orange-600" },
  { label: "Basal Cell Carcinoma", confidence: 0.05, color: "text-yellow-600" },
];

function ECGDemo() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictions, setPredictions] = useState<PredictionResult[] | null>(null);
  const [selectedSample, setSelectedSample] = useState<string | null>(null);

  const handleAnalyzeSample = (sampleName: string) => {
    setSelectedSample(sampleName);
    setIsAnalyzing(true);
    setPredictions(null);

    // Simulate ML model inference
    setTimeout(() => {
      setIsAnalyzing(false);
      setPredictions(SAMPLE_ECG_PREDICTIONS);
    }, 2000);
  };

  const handleReset = () => {
    setSelectedSample(null);
    setPredictions(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Input Panel */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              ECG Analysis
            </CardTitle>
            <CardDescription>
              Deep learning model for cardiac rhythm classification from 12-lead ECG recordings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Upload ECG data or try a sample
              </p>
              <Button variant="outline" disabled>
                <Upload className="w-4 h-4 mr-2" />
                Upload ECG File
              </Button>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Try Sample ECG Recordings:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAnalyzeSample("Normal Sinus")}
                  disabled={isAnalyzing}
                >
                  Normal Sinus Rhythm
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAnalyzeSample("AFib")}
                  disabled={isAnalyzing}
                >
                  Atrial Fibrillation
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAnalyzeSample("VTach")}
                  disabled={isAnalyzing}
                >
                  V-Tach
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAnalyzeSample("PVC")}
                  disabled={isAnalyzing}
                >
                  PVCs
                </Button>
              </div>
            </div>

            {selectedSample && (
              <div className="p-4 rounded-lg bg-accent">
                <p className="text-sm font-medium mb-2">Selected Sample:</p>
                <p className="text-sm">{selectedSample}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={handleReset}
                >
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
              Model Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Architecture:</span>
              <span className="font-medium">ResNet-50 + LSTM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Training Dataset:</span>
              <span className="font-medium">PTB-XL (21,837 ECGs)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Accuracy:</span>
              <span className="font-medium text-green-600">94.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Classes:</span>
              <span className="font-medium">12 Cardiac Rhythms</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Panel */}
      <div>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Prediction Results</CardTitle>
            <CardDescription>Model confidence scores for detected cardiac rhythms</CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedSample && !predictions && (
              <div className="flex items-center justify-center h-64 text-center">
                <div>
                  <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">
                    Select a sample ECG to see analysis results
                  </p>
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Analyzing ECG pattern...</p>
                </div>
              </div>
            )}

            {predictions && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900 dark:text-green-100">
                        {predictions[0].label}
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Confidence: {(predictions[0].confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">All Classifications:</p>
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
                  <Button className="w-full" onClick={handleReset}>
                    <X className="w-4 h-4 mr-2" />
                    Analyze Another ECG
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

function RadiologyDemo() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictions, setPredictions] = useState<PredictionResult[] | null>(null);
  const [selectedSample, setSelectedSample] = useState<string | null>(null);

  const handleAnalyzeSample = (sampleName: string) => {
    setSelectedSample(sampleName);
    setIsAnalyzing(true);
    setPredictions(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      setPredictions(SAMPLE_XRAY_PREDICTIONS);
    }, 2000);
  };

  const handleReset = () => {
    setSelectedSample(null);
    setPredictions(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Chest X-Ray Analysis
            </CardTitle>
            <CardDescription>
              AI-powered detection of thoracic pathologies from chest radiographs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Upload X-ray image or try a sample
              </p>
              <Button variant="outline" disabled>
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Try Sample X-Ray Images:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAnalyzeSample("Normal Chest")}
                  disabled={isAnalyzing}
                >
                  Normal Chest
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAnalyzeSample("Pneumonia")}
                  disabled={isAnalyzing}
                >
                  Pneumonia
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAnalyzeSample("Effusion")}
                  disabled={isAnalyzing}
                >
                  Pleural Effusion
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAnalyzeSample("Cardiomegaly")}
                  disabled={isAnalyzing}
                >
                  Cardiomegaly
                </Button>
              </div>
            </div>

            {selectedSample && (
              <div className="p-4 rounded-lg bg-accent">
                <p className="text-sm font-medium mb-2">Selected Sample:</p>
                <p className="text-sm">{selectedSample}</p>
                <Button variant="ghost" size="sm" className="mt-2" onClick={handleReset}>
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
              Model Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Architecture:</span>
              <span className="font-medium">DenseNet-121</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Training Dataset:</span>
              <span className="font-medium">ChestX-ray14 (112K images)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">AUC Score:</span>
              <span className="font-medium text-green-600">0.89</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Classes:</span>
              <span className="font-medium">14 Thoracic Conditions</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Prediction Results</CardTitle>
            <CardDescription>Detected pathologies with confidence scores</CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedSample && !predictions && (
              <div className="flex items-center justify-center h-64 text-center">
                <div>
                  <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">
                    Select a sample X-ray to see analysis results
                  </p>
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Analyzing radiograph...</p>
                </div>
              </div>
            )}

            {predictions && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900 dark:text-red-100">
                        {predictions[1].label}
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        Confidence: {(predictions[1].confidence * 100).toFixed(1)}%
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                        ⚠ Pathology detected - clinical correlation recommended
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">All Classifications:</p>
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
                  <Button className="w-full" onClick={handleReset}>
                    <X className="w-4 h-4 mr-2" />
                    Analyze Another Image
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

function DermatologyDemo() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictions, setPredictions] = useState<PredictionResult[] | null>(null);
  const [selectedSample, setSelectedSample] = useState<string | null>(null);

  const handleAnalyzeSample = (sampleName: string) => {
    setSelectedSample(sampleName);
    setIsAnalyzing(true);
    setPredictions(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      setPredictions(SAMPLE_DERM_PREDICTIONS);
    }, 2000);
  };

  const handleReset = () => {
    setSelectedSample(null);
    setPredictions(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Skin Lesion Analysis
            </CardTitle>
            <CardDescription>
              Deep learning for automated detection and classification of skin lesions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Upload dermoscopy image or try a sample
              </p>
              <Button variant="outline" disabled>
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Try Sample Lesion Images:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAnalyzeSample("Benign Nevus")}
                  disabled={isAnalyzing}
                >
                  Benign Nevus
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAnalyzeSample("Melanoma")}
                  disabled={isAnalyzing}
                >
                  Melanoma
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAnalyzeSample("Seborrheic Keratosis")}
                  disabled={isAnalyzing}
                >
                  Seb. Keratosis
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAnalyzeSample("Basal Cell")}
                  disabled={isAnalyzing}
                >
                  Basal Cell
                </Button>
              </div>
            </div>

            {selectedSample && (
              <div className="p-4 rounded-lg bg-accent">
                <p className="text-sm font-medium mb-2">Selected Sample:</p>
                <p className="text-sm">{selectedSample}</p>
                <Button variant="ghost" size="sm" className="mt-2" onClick={handleReset}>
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
              Model Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Architecture:</span>
              <span className="font-medium">EfficientNet-B4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Training Dataset:</span>
              <span className="font-medium">HAM10000 (10K images)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Accuracy:</span>
              <span className="font-medium text-green-600">91.8%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Classes:</span>
              <span className="font-medium">7 Skin Conditions</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Prediction Results</CardTitle>
            <CardDescription>Classification results with confidence scores</CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedSample && !predictions && (
              <div className="flex items-center justify-center h-64 text-center">
                <div>
                  <Brain className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">
                    Select a sample lesion to see analysis results
                  </p>
                </div>
              </div>
            )}

            {isAnalyzing && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Analyzing skin lesion...</p>
                </div>
              </div>
            )}

            {predictions && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900 dark:text-green-100">
                        {predictions[0].label}
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Confidence: {(predictions[0].confidence * 100).toFixed(1)}%
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                        ✓ Likely benign - routine monitoring recommended
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">All Classifications:</p>
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
                  <Button className="w-full" onClick={handleReset}>
                    <X className="w-4 h-4 mr-2" />
                    Analyze Another Lesion
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
          Explore state-of-the-art machine learning models for medical image analysis and diagnosis
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
                Interactive demonstrations of deep learning models trained on real medical datasets
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ecg" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ecg" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                ECG Analysis
              </TabsTrigger>
              <TabsTrigger value="radiology" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Radiology
              </TabsTrigger>
              <TabsTrigger value="dermatology" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Dermatology
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="ecg" className="m-0">
                <ECGDemo />
              </TabsContent>

              <TabsContent value="radiology" className="m-0">
                <RadiologyDemo />
              </TabsContent>

              <TabsContent value="dermatology" className="m-0">
                <DermatologyDemo />
              </TabsContent>
            </div>
          </Tabs>

          {/* Disclaimer */}
          <div className="mt-6 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                  Educational Purpose Only
                </p>
                <p className="text-yellow-800 dark:text-yellow-200">
                  These are demonstration models for educational purposes. They are not intended for clinical
                  use or medical diagnosis. Always consult qualified healthcare professionals for medical
                  advice.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
