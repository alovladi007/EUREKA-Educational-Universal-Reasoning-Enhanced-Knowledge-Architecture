"use client";

import type { TemplateProps } from "@/types/resume";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";

/**
 * Vertex Template — Technical/engineering grid-based layout
 * Best for: Project Managers / Engineers
 */
export function VertexTemplate({ data, scale = 1, paperSize = "letter", sectionVisibility }: TemplateProps) {
  const { header, summary, experience, education, skills, projects, certifications, languages } = data;
  const { colorScheme, fontFamily, fontSize } = data.meta;
  const vis = sectionVisibility ?? {};
  const isVisible = (s: string) => vis[s as keyof typeof vis] !== false;
  const sizes = { sm: "9pt", md: "10pt", lg: "11pt" };
  const pw = paperSize === "a4" ? "794px" : "816px";
  const ph = paperSize === "a4" ? "1123px" : "1056px";

  return (
    <div className="bg-white text-black" style={{ width: pw, minHeight: ph, fontFamily: `'${fontFamily}', sans-serif`, fontSize: sizes[fontSize], lineHeight: "1.4", transform: `scale(${scale})`, transformOrigin: "top left" }}>
      {/* Header with grid */}
      {isVisible("header") && (
        <div style={{ padding: "28px 40px", borderBottom: `3px solid ${colorScheme}` }}>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="font-bold" style={{ fontSize: "22pt", color: colorScheme }}>{header.firstName} {header.lastName}</h1>
              {header.headline && <p className="uppercase tracking-wider text-xs mt-0.5" style={{ color: "#475569", fontSize: "9.5pt" }}>{header.headline}</p>}
            </div>
            <div className="text-right text-xs space-y-0.5" style={{ color: "#475569", fontSize: "8.5pt" }}>
              {header.email && <div className="flex items-center justify-end gap-1"><span>{header.email}</span><Mail className="w-3 h-3" /></div>}
              {header.phone && <div className="flex items-center justify-end gap-1"><span>{header.phone}</span><Phone className="w-3 h-3" /></div>}
              {header.location && <div className="flex items-center justify-end gap-1"><span>{header.location}</span><MapPin className="w-3 h-3" /></div>}
              {header.linkedin && <div className="flex items-center justify-end gap-1"><span>{header.linkedin}</span><Linkedin className="w-3 h-3" /></div>}
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: "20px 40px 40px" }}>
        {isVisible("summary") && summary.content && (
          <div className="mb-4 p-3 rounded" style={{ backgroundColor: `${colorScheme}08`, border: `1px solid ${colorScheme}20` }}>
            <p className="text-sm leading-relaxed" style={{ color: "#334155" }}>{summary.content}</p>
          </div>
        )}

        {/* Two-column grid for skills + experience */}
        <div className="flex gap-5">
          {/* Left column — Experience + Projects */}
          <div className="flex-1">
            {isVisible("experience") && experience.length > 0 && (
              <div className="mb-4">
                <h2 className="font-bold text-sm uppercase mb-2 pb-0.5" style={{ color: colorScheme, borderBottom: `2px solid ${colorScheme}`, fontSize: "10pt" }}>Professional Experience</h2>
                {experience.map(exp => (
                  <div key={exp.id} className="mb-3">
                    <p className="font-bold" style={{ fontSize: "10pt" }}>{exp.title}</p>
                    <div className="flex justify-between"><p className="text-sm" style={{ color: colorScheme }}>{exp.company}</p><p className="text-xs" style={{ color: "#94a3b8" }}>{exp.startDate} — {exp.current ? "Present" : exp.endDate}</p></div>
                    {exp.bullets.length > 0 && <ul className="mt-1 space-y-0.5">{exp.bullets.filter(b => b.content).map(b => <li key={b.id} className="text-sm pl-3 relative" style={{ color: "#374151", fontWeight: b.highlighted ? 600 : 400 }}><span className="absolute left-0">&bull;</span>{b.content}</li>)}</ul>}
                  </div>
                ))}
              </div>
            )}

            {isVisible("projects") && projects.length > 0 && (
              <div className="mb-4">
                <h2 className="font-bold text-sm uppercase mb-2 pb-0.5" style={{ color: colorScheme, borderBottom: `2px solid ${colorScheme}`, fontSize: "10pt" }}>Key Projects</h2>
                {projects.map(p => (
                  <div key={p.id} className="mb-2">
                    <p className="font-bold" style={{ fontSize: "10pt" }}>{p.name}</p>
                    {p.description && <p className="text-sm italic" style={{ color: "#64748b" }}>{p.description}</p>}
                    {p.technologies.length > 0 && <p className="text-xs" style={{ color: "#94a3b8" }}>{p.technologies.join(" | ")}</p>}
                    {p.bullets.filter(b => b.content).map(b => <p key={b.id} className="text-sm pl-3 relative" style={{ color: "#374151" }}><span className="absolute left-0">&bull;</span>{b.content}</p>)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right column — Education + Skills + Certs */}
          <div style={{ width: "220px", flexShrink: 0 }}>
            {isVisible("education") && education.length > 0 && (
              <div className="mb-4">
                <h2 className="font-bold text-sm uppercase mb-2 pb-0.5" style={{ color: colorScheme, borderBottom: `2px solid ${colorScheme}`, fontSize: "10pt" }}>Education</h2>
                {education.map(edu => (
                  <div key={edu.id} className="mb-2">
                    <p className="font-bold text-sm">{edu.degree}</p>
                    {edu.field && <p className="text-xs" style={{ color: "#475569" }}>{edu.field}</p>}
                    <p className="text-xs" style={{ color: colorScheme }}>{edu.institution}</p>
                    <p className="text-xs" style={{ color: "#94a3b8" }}>{edu.endDate}</p>
                  </div>
                ))}
              </div>
            )}

            {isVisible("skills") && skills.groups.some(g => g.skills.length > 0) && (
              <div className="mb-4">
                <h2 className="font-bold text-sm uppercase mb-2 pb-0.5" style={{ color: colorScheme, borderBottom: `2px solid ${colorScheme}`, fontSize: "10pt" }}>Technical Skills</h2>
                {skills.groups.filter(g => g.skills.length > 0).map(g => (
                  <div key={g.id} className="mb-1.5">
                    <p className="text-xs font-semibold" style={{ color: "#475569" }}>{g.label}</p>
                    <p className="text-xs" style={{ color: "#64748b" }}>{g.skills.join(", ")}</p>
                  </div>
                ))}
              </div>
            )}

            {isVisible("certifications") && certifications.length > 0 && (
              <div className="mb-4">
                <h2 className="font-bold text-sm uppercase mb-2 pb-0.5" style={{ color: colorScheme, borderBottom: `2px solid ${colorScheme}`, fontSize: "10pt" }}>Certifications</h2>
                {certifications.map(c => <div key={c.id} className="mb-1"><p className="text-xs font-semibold">{c.name}</p>{c.issuer && <p className="text-xs" style={{ color: "#94a3b8" }}>{c.issuer} · {c.date}</p>}</div>)}
              </div>
            )}

            {isVisible("languages") && languages.length > 0 && (
              <div className="mb-4">
                <h2 className="font-bold text-sm uppercase mb-2 pb-0.5" style={{ color: colorScheme, borderBottom: `2px solid ${colorScheme}`, fontSize: "10pt" }}>Languages</h2>
                {languages.map(l => <p key={l.id} className="text-xs">{l.language} — {l.proficiency}</p>)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
