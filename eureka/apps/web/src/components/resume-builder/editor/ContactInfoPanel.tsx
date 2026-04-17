"use client";

import { useResumeStore } from "@/stores/resume";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, Globe, Linkedin, Github, Camera } from "lucide-react";

export function ContactInfoPanel() {
  const doc = useResumeStore((s) => s.activeDocument());
  const updateHeader = useResumeStore((s) => s.updateHeader);
  const vis = doc?.sectionVisibility;

  if (!doc || vis?.header === false) return null;
  const h = doc.data.header;

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
        <User className="w-4 h-4 text-primary" />
        Contact Information
      </h3>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">First Name</Label>
          <Input className="h-8 text-sm" value={h.firstName} onChange={(e) => updateHeader("firstName", e.target.value)} placeholder="John" />
        </div>
        <div>
          <Label className="text-xs">Last Name</Label>
          <Input className="h-8 text-sm" value={h.lastName} onChange={(e) => updateHeader("lastName", e.target.value)} placeholder="Doe" />
        </div>
        <div className="col-span-2">
          <Label className="text-xs">Headline / Title</Label>
          <Input className="h-8 text-sm" value={h.headline} onChange={(e) => updateHeader("headline", e.target.value)} placeholder="Software Engineer" />
        </div>
        <div className="col-span-2">
          <Label className="text-xs flex items-center gap-1"><Camera className="w-3 h-3" /> Profile Photo <span className="text-muted-foreground">(optional)</span></Label>
          <div className="flex items-center gap-3 mt-1">
            {h.photo ? (
              <img src={h.photo} alt="Profile" className="w-12 h-12 rounded-full object-cover border" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center border">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1">
              <Input
                className="h-8 text-sm"
                type="url"
                value={h.photo || ""}
                onChange={(e) => updateHeader("photo", e.target.value)}
                placeholder="https://... or upload coming soon"
              />
              <p className="text-[10px] text-muted-foreground mt-0.5">Paste a photo URL. Some templates display this in the header.</p>
            </div>
          </div>
        </div>
        <div>
          <Label className="text-xs flex items-center gap-1"><Mail className="w-3 h-3" /> Email</Label>
          <Input className="h-8 text-sm" type="email" value={h.email} onChange={(e) => updateHeader("email", e.target.value)} placeholder="john@email.com" />
        </div>
        <div>
          <Label className="text-xs flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</Label>
          <Input className="h-8 text-sm" value={h.phone} onChange={(e) => updateHeader("phone", e.target.value)} placeholder="(555) 123-4567" />
        </div>
        <div>
          <Label className="text-xs flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</Label>
          <Input className="h-8 text-sm" value={h.location} onChange={(e) => updateHeader("location", e.target.value)} placeholder="City, State" />
        </div>
        <div>
          <Label className="text-xs flex items-center gap-1"><Globe className="w-3 h-3" /> Website</Label>
          <Input className="h-8 text-sm" value={h.website} onChange={(e) => updateHeader("website", e.target.value)} placeholder="yoursite.com" />
        </div>
        <div>
          <Label className="text-xs flex items-center gap-1"><Linkedin className="w-3 h-3" /> LinkedIn</Label>
          <Input className="h-8 text-sm" value={h.linkedin} onChange={(e) => updateHeader("linkedin", e.target.value)} placeholder="linkedin.com/in/you" />
        </div>
        <div>
          <Label className="text-xs flex items-center gap-1"><Github className="w-3 h-3" /> GitHub</Label>
          <Input className="h-8 text-sm" value={h.github} onChange={(e) => updateHeader("github", e.target.value)} placeholder="github.com/you" />
        </div>
      </div>
    </Card>
  );
}
