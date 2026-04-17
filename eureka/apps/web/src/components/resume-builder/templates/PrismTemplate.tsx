"use client";

import type { TemplateProps } from "@/types/resume";
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";

/**
 * Prism Template — Colorful header band with modern typography
 * Best for: Design / Marketing roles
 */
export function PrismTemplate({ data, scale = 1, paperSize = "letter", sectionVisibility }: TemplateProps) {
  const { header, summary, experience, education, skills, projects, certifications, languages } = data;
  const { colorScheme, fontFamily, fontSize } = data.meta;
  const vis = sectionVisibility ?? {};
  const isVisible = (s: string) => vis[s as keyof typeof vis] !== false;

  const sizes = { sm: "9pt", md: "10pt", lg: "11pt" };
  const pw = paperSize === "a4" ? "794px" : "816px";
  const ph = paperSize === "a4" ? "1123px" : "1056px";

  return (
    <div className="bg-white text-black" style={{ width: pw, minHeight: ph, fontFamily: `'${fontFamily}', sans-serif`, fontSize: sizes[fontSize], lineHeight: "1.45", transform: `scale(${scale})`, transformOrigin: "top left" }}>
      {/* Colorful Header Band */}
      {isVisible("header") && (
        <div style={{ backgroundColor: colorScheme, color: "white", padding: "28px 44px 24px" }}>
          <h1 className="font-bold" style={{ fontSize: "26pt", letterSpacing: "-0.5px" }}>
            {header.firstName} {header.lastName}
          </h1>
          {header.headline && <p className="mt-1 text-sm opacity-90 uppercase tracking-widest" style={{ fontSize: "10pt" }}>{header.headline}</p>}
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-xs" style={{ fontSize: "8.5pt", opacity: 0.85 }}>
            {header.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{header.email}</span>}
            {header.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{header.phone}</span>}
            {header.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{header.location}</span>}
            {header.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" />{header.linkedin}</span>}
            {header.github && <span className="flex items-center gap-1"><Github className="w-3 h-3" />{header.github}</span>}
            {header.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{header.website}</span>}
          </div>
        </div>
      )}

      <div style={{ padding: "24px 44px 40px" }}>
        {isVisible("summary") && summary.content && (
          <div className="mb-5">
            <h2 className="font-bold uppercase tracking-wider mb-1" style={{ color: colorScheme, fontSize: "10pt", letterSpacing: "2px" }}>Profile</h2>
            <p className="leading-relaxed" style={{ color: "#374151" }}>{summary.content}</p>
          </div>
        )}

        {isVisible("experience") && experience.length > 0 && (
          <div className="mb-5">
            <h2 className="font-bold uppercase tracking-wider mb-2" style={{ color: colorScheme, fontSize: "10pt", letterSpacing: "2px" }}>Experience</h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-3 pl-3" style={{ borderLeft: `3px solid ${colorScheme}30` }}>
                <div className="flex justify-between"><p className="font-bold" style={{ fontSize: "10.5pt" }}>{exp.title}</p><p className="text-xs" style={{ color: "#6b7280" }}>{exp.startDate} — {exp.current ? "Present" : exp.endDate}</p></div>
                <p className="italic" style={{ color: colorScheme, fontSize: "9.5pt" }}>{exp.company}{exp.location ? ` | ${exp.location}` : ""}</p>
                {exp.bullets.length > 0 && <ul className="mt-1 space-y-0.5">{exp.bullets.filter(b => b.content).map(b => <li key={b.id} className="text-sm pl-3 relative" style={{ color: "#374151", fontWeight: b.highlighted ? 600 : 400 }}><span className="absolute left-0" style={{ color: colorScheme }}>&#9656;</span>{b.content}</li>)}</ul>}
              </div>
            ))}
          </div>
        )}

        {isVisible("education") && education.length > 0 && (
          <div className="mb-5">
            <h2 className="font-bold uppercase tracking-wider mb-2" style={{ color: colorScheme, fontSize: "10pt", letterSpacing: "2px" }}>Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2 pl-3" style={{ borderLeft: `3px solid ${colorScheme}30` }}>
                <div className="flex justify-between"><p className="font-bold" style={{ fontSize: "10.5pt" }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p><p className="text-xs" style={{ color: "#6b7280" }}>{edu.startDate} — {edu.endDate}</p></div>
                <p className="italic" style={{ color: colorScheme, fontSize: "9.5pt" }}>{edu.institution}</p>
                {edu.gpa && <p className="text-xs" style={{ color: "#6b7280" }}>GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        )}

        {isVisible("skills") && skills.groups.some(g => g.skills.length > 0) && (
          <div className="mb-5">
            <h2 className="font-bold uppercase tracking-wider mb-2" style={{ color: colorScheme, fontSize: "10pt", letterSpacing: "2px" }}>Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.groups.flatMap(g => g.skills).map((skill, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${colorScheme}15`, color: colorScheme, border: `1px solid ${colorScheme}30`, fontSize: "8.5pt" }}>{skill}</span>
              ))}
            </div>
          </div>
        )}

        {isVisible("projects") && projects.length > 0 && (
          <div className="mb-5">
            <h2 className="font-bold uppercase tracking-wider mb-2" style={{ color: colorScheme, fontSize: "10pt", letterSpacing: "2px" }}>Projects</h2>
            {projects.map(p => (
              <div key={p.id} className="mb-2 pl-3" style={{ borderLeft: `3px solid ${colorScheme}30` }}>
                <p className="font-bold" style={{ fontSize: "10.5pt" }}>{p.name}</p>
                {p.description && <p className="text-sm italic" style={{ color: "#6b7280" }}>{p.description}</p>}
                {p.bullets.filter(b => b.content).map(b => <p key={b.id} className="text-sm pl-3 relative" style={{ color: "#374151" }}><span className="absolute left-0" style={{ color: colorScheme }}>&#9656;</span>{b.content}</p>)}
              </div>
            ))}
          </div>
        )}

        {isVisible("certifications") && certifications.length > 0 && (
          <div className="mb-5">
            <h2 className="font-bold uppercase tracking-wider mb-2" style={{ color: colorScheme, fontSize: "10pt", letterSpacing: "2px" }}>Certifications</h2>
            {certifications.map(c => <div key={c.id} className="flex justify-between mb-1"><span className="font-semibold text-sm">{c.name}{c.issuer ? ` — ${c.issuer}` : ""}</span>{c.date && <span className="text-xs" style={{ color: "#6b7280" }}>{c.date}</span>}</div>)}
          </div>
        )}

        {isVisible("languages") && languages.length > 0 && (
          <div className="mb-5">
            <h2 className="font-bold uppercase tracking-wider mb-2" style={{ color: colorScheme, fontSize: "10pt", letterSpacing: "2px" }}>Languages</h2>
            <div className="flex flex-wrap gap-x-6">{languages.map(l => <span key={l.id} className="text-sm"><span className="font-semibold">{l.language}</span> — {l.proficiency}</span>)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
