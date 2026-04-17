"use client";

import { useResumeStore } from "@/stores/resume";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Palette } from "lucide-react";
import { COLOR_PRESETS, FONT_OPTIONS } from "@/lib/resume/template-registry";

export function TemplateCustomizer() {
  const doc = useResumeStore((s) => s.activeDocument());
  const updateMeta = useResumeStore((s) => s.updateMeta);

  if (!doc) return null;

  const { colorScheme, fontFamily, fontSize } = doc.data.meta;

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
        <Palette className="w-4 h-4 text-primary" />
        Customize Appearance
      </h3>

      {/* Color Scheme */}
      <div className="mb-3">
        <Label className="text-xs">Accent Color</Label>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {COLOR_PRESETS.map((color) => (
            <button
              key={color.value}
              className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
              style={{
                backgroundColor: color.value,
                borderColor: colorScheme === color.value ? "#000" : "transparent",
                transform: colorScheme === color.value ? "scale(1.15)" : undefined,
              }}
              onClick={() => updateMeta("colorScheme", color.value)}
              title={color.label}
            />
          ))}
          <div className="flex items-center gap-1 ml-1">
            <input
              type="color"
              value={colorScheme}
              onChange={(e) => updateMeta("colorScheme", e.target.value)}
              className="w-6 h-6 rounded cursor-pointer border-0"
              title="Custom color"
            />
          </div>
        </div>
      </div>

      {/* Font Family */}
      <div className="mb-3">
        <Label className="text-xs">Font</Label>
        <select
          className="mt-1 w-full h-8 text-sm border rounded px-2 bg-background"
          value={fontFamily}
          onChange={(e) => updateMeta("fontFamily", e.target.value)}
        >
          {FONT_OPTIONS.map((font) => (
            <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div className="mb-3">
        <Label className="text-xs">Font Size</Label>
        <div className="flex gap-1 mt-1">
          {(["sm", "md", "lg"] as const).map((size) => (
            <button
              key={size}
              className={`flex-1 h-7 text-xs rounded border transition-colors ${fontSize === size ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted"}`}
              onClick={() => updateMeta("fontSize", size)}
            >
              {size === "sm" ? "Small" : size === "md" ? "Medium" : "Large"}
            </button>
          ))}
        </div>
      </div>

      {/* Paper Size */}
      <div>
        <Label className="text-xs">Paper Size</Label>
        <div className="flex gap-1 mt-1">
          {(["letter", "a4"] as const).map((size) => (
            <button
              key={size}
              className={`flex-1 h-7 text-xs rounded border transition-colors ${doc.data.meta.paperSize === size ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted"}`}
              onClick={() => updateMeta("paperSize", size)}
            >
              {size === "letter" ? "US Letter" : "A4"}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
