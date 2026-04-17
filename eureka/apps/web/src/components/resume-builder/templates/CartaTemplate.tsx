"use client";

import type { TemplateProps } from "@/types/resume";

/**
 * Carta Template — Minimalist, generous whitespace, typography-driven
 * Best for: Executives / Senior roles
 */
export function CartaTemplate({ data, scale = 1, paperSize = "letter", sectionVisibility }: TemplateProps) {
  const { header, summary, experience, education, skills, projects, certifications, languages } = data;
  const { colorScheme, fontFamily, fontSize } = data.meta;
  const vis = sectionVisibility ?? {};
  const isVisible = (s: string) => vis[s as keyof typeof vis] !== false;
  const sizes = { sm: "9pt", md: "10pt", lg: "11pt" };
  const pw = paperSize === "a4" ? "794px" : "816px";
  const ph = paperSize === "a4" ? "1123px" : "1056px";

  return (
    <div className="bg-white text-black" style={{ width: pw, minHeight: ph, fontFamily: `'${fontFamily}', sans-serif`, fontSize: sizes[fontSize], lineHeight: "1.5", padding: "48px 56px", transform: `scale(${scale})`, transformOrigin: "top left" }}>
      {isVisible("header") && (
        <div className="mb-6">
          <h1 className="font-light" style={{ fontSize: "32pt", color: colorScheme, letterSpacing: "-1px" }}>{header.firstName} {header.lastName}</h1>
          {header.headline && <p className="mt-1 uppercase tracking-[0.3em] text-xs" style={{ color: "#64748b", fontSize: "9pt" }}>{header.headline}</p>}
          <div className="flex gap-4 mt-3 text-xs" style={{ color: "#64748b" }}>
            {header.email && <span>{header.email}</span>}
            {header.phone && <span>{header.phone}</span>}
            {header.location && <span>{header.location}</span>}
          </div>
          {(header.linkedin || header.github || header.website) && (
            <div className="flex gap-4 mt-1 text-xs" style={{ color: "#94a3b8" }}>
              {header.linkedin && <span>{header.linkedin}</span>}
              {header.github && <span>{header.github}</span>}
              {header.website && <span>{header.website}</span>}
            </div>
          )}
          <div className="mt-4" style={{ borderBottom: `1px solid ${colorScheme}30` }} />
        </div>
      )}

      {isVisible("summary") && summary.content && (
        <div className="mb-6">
          <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{summary.content}</p>
        </div>
      )}

      {isVisible("experience") && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: colorScheme }}>Experience</h2>
          {experience.map(exp => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold" style={{ fontSize: "11pt" }}>{exp.title}</h3>
                <span className="text-xs" style={{ color: "#94a3b8" }}>{exp.startDate} — {exp.current ? "Present" : exp.endDate}</span>
              </div>
              <p className="text-sm" style={{ color: "#64748b" }}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
              {exp.bullets.length > 0 && <ul className="mt-2 space-y-1">{exp.bullets.filter(b => b.content).map(b => <li key={b.id} className="text-sm pl-4 relative" style={{ color: "#475569", fontWeight: b.highlighted ? 600 : 400 }}><span className="absolute left-0" style={{ color: colorScheme }}>—</span>{b.content}</li>)}</ul>}
            </div>
          ))}
        </div>
      )}

      {isVisible("education") && education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: colorScheme }}>Education</h2>
          {education.map(edu => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold" style={{ fontSize: "11pt" }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</h3>
                <span className="text-xs" style={{ color: "#94a3b8" }}>{edu.endDate}</span>
              </div>
              <p className="text-sm" style={{ color: "#64748b" }}>{edu.institution}</p>
            </div>
          ))}
        </div>
      )}

      {isVisible("skills") && skills.groups.some(g => g.skills.length > 0) && (
        <div className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: colorScheme }}>Skills</h2>
          {skills.groups.filter(g => g.skills.length > 0).map(g => <p key={g.id} className="text-sm mb-0.5"><span className="font-medium">{g.label}:</span> <span style={{ color: "#475569" }}>{g.skills.join(" · ")}</span></p>)}
        </div>
      )}

      {isVisible("projects") && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: colorScheme }}>Projects</h2>
          {projects.map(p => (
            <div key={p.id} className="mb-2">
              <h3 className="font-semibold" style={{ fontSize: "11pt" }}>{p.name}</h3>
              {p.description && <p className="text-sm" style={{ color: "#64748b" }}>{p.description}</p>}
            </div>
          ))}
        </div>
      )}

      {isVisible("certifications") && certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: colorScheme }}>Certifications</h2>
          {certifications.map(c => <p key={c.id} className="text-sm mb-0.5">{c.name}{c.issuer ? ` — ${c.issuer}` : ""}{c.date ? ` (${c.date})` : ""}</p>)}
        </div>
      )}

      {isVisible("languages") && languages.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ color: colorScheme }}>Languages</h2>
          <p className="text-sm" style={{ color: "#475569" }}>{languages.map(l => `${l.language} (${l.proficiency})`).join(" · ")}</p>
        </div>
      )}
    </div>
  );
}
