"use client";

import { useState, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Grid3x3,
  Bone,
  Heart,
  Brain,
  Loader2,
  Info,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LayerConfig {
  id: string;
  name: string;
  icon: any;
  color: string;
  visible: boolean;
}

// Import Canvas with SSR disabled
const ThreeViewer = dynamic(() => import("./ThreeViewer"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading 3D viewer...</p>
      </div>
    </div>
  ),
});

export default function AnatomyViewerPage() {
  const [layers, setLayers] = useState<LayerConfig[]>([
    { id: "skeleton", name: "Skeletal System", icon: Bone, color: "bg-amber-500", visible: true },
    { id: "heart", name: "Cardiovascular System", icon: Heart, color: "bg-red-500", visible: false },
    { id: "brain", name: "Nervous System", icon: Brain, color: "bg-pink-300", visible: false },
    { id: "organs", name: "Organ Systems", icon: Layers, color: "bg-purple-500", visible: false },
  ]);

  const [autoRotate, setAutoRotate] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  const toggleLayer = (id: string) => {
    setLayers((prev) =>
      prev.map((layer) => (layer.id === id ? { ...layer, visible: !layer.visible } : layer))
    );
  };

  const toggleAllLayers = () => {
    const allVisible = layers.every((l) => l.visible);
    setLayers((prev) => prev.map((layer) => ({ ...layer, visible: !allVisible })));
  };

  const resetView = () => {
    setAutoRotate(false);
  };

  const visibleLayers = layers.filter((l) => l.visible);

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">3D Anatomy Viewer</h1>
        <p className="text-muted-foreground mt-2">
          Interactive 3D visualization of human anatomy with multiple system layers
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100%-5rem)]">
        {/* Control Panel */}
        <div className="col-span-3 space-y-4 overflow-y-auto">
          {/* Layer Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Anatomical Layers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={toggleAllLayers}
              >
                {layers.every((l) => l.visible) ? "Hide All" : "Show All"}
              </Button>

              {layers.map((layer) => {
                const Icon = layer.icon;
                return (
                  <button
                    key={layer.id}
                    onClick={() => toggleLayer(layer.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border transition-all",
                      layer.visible
                        ? "bg-primary/10 border-primary shadow-sm"
                        : "hover:bg-accent border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", layer.color, "bg-opacity-20")}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{layer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {layer.visible ? "Visible" : "Hidden"}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full",
                          layer.visible ? layer.color : "bg-muted"
                        )}
                      />
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* View Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="w-5 h-5" />
                View Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={autoRotate ? "default" : "outline"}
                size="sm"
                className="w-full"
                onClick={() => setAutoRotate(!autoRotate)}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Auto Rotate
              </Button>

              <Button
                variant={showGrid ? "default" : "outline"}
                size="sm"
                className="w-full"
                onClick={() => setShowGrid(!showGrid)}
              >
                <Grid3x3 className="w-4 h-4 mr-2" />
                Show Grid
              </Button>

              <Button variant="outline" size="sm" className="w-full" onClick={resetView}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset View
              </Button>
            </CardContent>
          </Card>

          {/* Information Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="w-5 h-5" />
                Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-1">Active Layers</p>
                <div className="flex flex-wrap gap-2">
                  {visibleLayers.length === 0 ? (
                    <Badge variant="secondary">None</Badge>
                  ) : (
                    visibleLayers.map((layer) => (
                      <Badge key={layer.id} className={layer.color}>
                        {layer.name.split(" ")[0]}
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground">
                  <strong>Controls:</strong>
                </p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li>• Left click + drag to rotate</li>
                  <li>• Right click + drag to pan</li>
                  <li>• Scroll to zoom in/out</li>
                  <li>• Toggle layers on the left</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3D Viewer */}
        <div className="col-span-9">
          <Card className="h-full">
            <CardContent className="p-0 h-full">
              <div className="relative w-full h-full rounded-lg overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
                <ThreeViewer layers={layers} autoRotate={autoRotate} showGrid={showGrid} />

                {/* Overlay Controls */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="icon" variant="secondary" className="bg-black/50 backdrop-blur">
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="bg-black/50 backdrop-blur">
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                </div>

                {/* System Labels */}
                {visibleLayers.length > 0 && (
                  <div className="absolute bottom-4 left-4 space-y-2">
                    {visibleLayers.map((layer) => {
                      const Icon = layer.icon;
                      return (
                        <div
                          key={layer.id}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/50 backdrop-blur text-white"
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm font-medium">{layer.name}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
