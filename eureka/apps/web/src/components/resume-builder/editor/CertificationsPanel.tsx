"use client";

import { useResumeStore } from "@/stores/resume";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award, Plus, Trash2 } from "lucide-react";

export function CertificationsPanel() {
  const doc = useResumeStore((s) => s.activeDocument());
  const addCertification = useResumeStore((s) => s.addCertification);
  const updateCertification = useResumeStore((s) => s.updateCertification);
  const removeCertification = useResumeStore((s) => s.removeCertification);

  if (!doc || doc.sectionVisibility.certifications === false) return null;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Award className="w-4 h-4 text-primary" />
          Certifications
          <span className="text-xs font-normal text-muted-foreground">({doc.data.certifications.length})</span>
        </h3>
        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={addCertification}>
          <Plus className="w-3 h-3 mr-1" /> Add
        </Button>
      </div>
      <div className="space-y-2">
        {doc.data.certifications.map((cert) => (
          <div key={cert.id} className="border rounded-lg p-3 bg-background">
            <div className="grid grid-cols-2 gap-2">
              <div><Label className="text-xs">Certification</Label><Input className="h-8 text-sm" value={cert.name} onChange={(e) => updateCertification(cert.id, "name", e.target.value)} placeholder="AWS Solutions Architect" /></div>
              <div><Label className="text-xs">Issuer</Label><Input className="h-8 text-sm" value={cert.issuer} onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)} placeholder="Amazon Web Services" /></div>
              <div><Label className="text-xs">Date</Label><Input className="h-8 text-sm" value={cert.date} onChange={(e) => updateCertification(cert.id, "date", e.target.value)} placeholder="2024-01" /></div>
              <div className="flex items-end">
                <Button variant="ghost" size="sm" className="h-8 text-xs text-destructive" onClick={() => removeCertification(cert.id)}>
                  <Trash2 className="w-3 h-3 mr-1" /> Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
