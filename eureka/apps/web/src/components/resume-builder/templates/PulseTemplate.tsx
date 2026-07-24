"use client";

import type { TemplateProps } from "@/types/resume";

/**
 * Pulse Template — Timeline-based layout with visual progression
 * Best for: UX / Product roles
 */
export function PulseTemplate({ data, scale = 1, paperSize = "letter", sectionVisibility }: TemplateProps) {
  const { header, summary, experience, education, skills, projects, certifications, languages } = data;
  const { colorScheme, fontFamily, fontSize } = data.meta;
  const vis = sectionVisibility ?? {};
  const isVisible = (s: string) => vis[s as keyof typeof vis] !== false;
  const sizes = { sm: "9pt", md: "10pt", lg: "11pt" };
  const pw = paperSize === "a4" ? "794px" : "816px";
  const ph = paperSize === "a4" ? "1123px" : "1056px";

  return (
    <div className="bg-white text-black" style={{ width: pw, minHeight: ph, fontFamily: `'${fontFamily}', sans-serif`, fontSize: sizes[fontSize], lineHeight: "1.4", padding: "36px 44px", transform: `scale(${scale})`, transformOrigin: "top left" }}>
      {/* Header with accent line */}
      {isVisible("header") && (
        <div className="mb-5 flex items-start gap-4">
          <div className="flex-shrink-0 w-1 self-stretch rounded-full" style={{ backgroundColor: colorScheme }} />
          <div>
            <h1 className="font-bold" style={{ fontSize: "24pt", color: "#0f172a" }}>{header.firstName} {header.lastName}</h1>
            {header.headline && <p className="text-sm font-medium mt-0.5" style={{ color: colorScheme }}>{header.headline}</p>}
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2 text-xs" style={{ color: "#64748b" }}>
              {header.email && <span>{header.email}</span>}
              {header.phone && <span>{header.phone}</span>}
              {header.location && <span>{header.location}</span>}
              {header.linkedin && <span>{header.linkedin}</span>}
              {header.github && <span>{header.github}</span>}
              {header.website && <span>{header.website}</span>}
            </div>
          </div>
        </div>
      )}

      {isVisible("summary") && summary.content && (
        <div className="mb-5 ml-5 pl-4" style={{ borderLeft: `2px solid ${colorScheme}20` }}>
          <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{summary.content}</p>
        </div>
      )}

      {/* Timeline Experience */}
      {isVisible("experience") && experience.length > 0 && (
        <div className="mb-5">
          <h2 className="font-bold text-sm mb-3" style={{ color: colorScheme, fontSize: "11pt" }}>Experience</h2>
          <div className="relative ml-2">
            {/* Timeline line */}
            <div className="absolute left-1 top-2 bottom-2 w-0.5" style={{ backgroundColor: `${colorScheme}30` }} />
            {experience.map((exp, i) => (
              <div key={exp.id} className="relative pl-6 mb-4">
                {/* Timeline dot */}
                <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2" style={{ backgroundColor: i === 0 ? colorScheme : "white", borderColor: colorScheme }} />
                <div className="flex justify-between items-baseline">
                  <p className="font-bold" style={{ fontSize: "10.5pt" }}>{exp.title}</p>
                  <p className="text-xs flex-shrink-0 ml-2" style={{ color: "#94a3b8" }}>{exp.startDate} — {exp.current ? "Present" : exp.endDate}</p>
                </div>
                <p className="text-sm" style={{ color: colorScheme }}>{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                {exp.bullets.length > 0 && <ul className="mt-1 space-y-0.5">{exp.bullets.filter(b => b.content).map(b => <li key={b.id} className="block text-sm pl-3 relative" style={{ color: "#374151", fontWeight: b.highlighted ? 600 : 400 }}><span className="absolute left-0">&bull;</span>{b.content}</li>)}</ul>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two-column bottom */}
      <div className="flex gap-6">
        <div className="flex-1">
          {isVisible("education") && education.length > 0 && (
            <div className="mb-4">
              <h2 className="font-bold text-sm mb-2" style={{ color: colorScheme, fontSize: "11pt" }}>Education</h2>
              {education.map(edu => (
                <div key={edu.id} className="mb-2 pl-3" style={{ borderLeft: `2px solid ${colorScheme}30` }}>
                  <p className="font-bold text-sm">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p>
                  <p className="text-xs" style={{ color: colorScheme }}>{edu.institution}</p>
                  <p className="text-xs" style={{ color: "#94a3b8" }}>{edu.startDate} — {edu.endDate}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}</p>
                </div>
              ))}
            </div>
          )}

          {isVisible("projects") && projects.length > 0 && (
            <div className="mb-4">
              <h2 className="font-bold text-sm mb-2" style={{ color: colorScheme, fontSize: "11pt" }}>Projects</h2>
              {projects.map(p => (
                <div key={p.id} className="mb-2 pl-3" style={{ borderLeft: `2px solid ${colorScheme}30` }}>
                  <p className="font-bold text-sm">{p.name}</p>
                  {p.description && <p className="text-xs" style={{ color: "#64748b" }}>{p.description}</p>}
                  {p.technologies.length > 0 && <div className="flex flex-wrap gap-1 mt-0.5">{p.technologies.map((t, i) => <span key={i} className="text-xs px-1.5 py-0 rounded" style={{ backgroundColor: `${colorScheme}10`, color: colorScheme, fontSize: "7.5pt" }}>{t}</span>)}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ width: "200px" }}>
          {isVisible("skills") && skills.groups.some(g => g.skills.length > 0) && (
            <div className="mb-4">
              <h2 className="font-bold text-sm mb-2" style={{ color: colorScheme, fontSize: "11pt" }}>Skills</h2>
              {skills.groups.filter(g => g.skills.length > 0).map(g => (
                <div key={g.id} className="mb-2">
                  <p className="text-xs font-semibold" style={{ color: "#475569" }}>{g.label}</p>
                  <div className="flex flex-wrap gap-1 mt-0.5">{g.skills.map((s, i) => <span key={i} className="text-xs" style={{ color: "#64748b" }}>{s}{i < g.skills.length - 1 ? "," : ""}</span>)}</div>
                </div>
              ))}
            </div>
          )}

          {isVisible("certifications") && certifications.length > 0 && (
            <div className="mb-4">
              <h2 className="font-bold text-sm mb-2" style={{ color: colorScheme, fontSize: "11pt" }}>Certifications</h2>
              {certifications.map(c => <div key={c.id} className="mb-1"><p className="text-xs font-semibold">{c.name}</p>{c.issuer && <p className="text-xs" style={{ color: "#94a3b8" }}>{c.issuer}</p>}</div>)}
            </div>
          )}

          {isVisible("languages") && languages.length > 0 && (
            <div className="mb-4">
              <h2 className="font-bold text-sm mb-2" style={{ color: colorScheme, fontSize: "11pt" }}>Languages</h2>
              {languages.map(l => <p key={l.id} className="text-xs mb-0.5"><span className="font-medium">{l.language}</span> — {l.proficiency}</p>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
