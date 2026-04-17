"use client";

import type { TemplateProps } from "@/types/resume";

/**
 * Foundry Template — Dark header, bold typography
 * Best for: Creative / Startups
 */
export function FoundryTemplate({ data, scale = 1, paperSize = "letter", sectionVisibility }: TemplateProps) {
  const { header, summary, experience, education, skills, projects, certifications, languages } = data;
  const { colorScheme, fontFamily, fontSize } = data.meta;
  const vis = sectionVisibility ?? {};
  const isVisible = (s: string) => vis[s as keyof typeof vis] !== false;
  const sizes = { sm: "9pt", md: "10pt", lg: "11pt" };
  const pw = paperSize === "a4" ? "794px" : "816px";
  const ph = paperSize === "a4" ? "1123px" : "1056px";

  return (
    <div className="bg-white text-black" style={{ width: pw, minHeight: ph, fontFamily: `'${fontFamily}', sans-serif`, fontSize: sizes[fontSize], lineHeight: "1.4", transform: `scale(${scale})`, transformOrigin: "top left" }}>
      {/* Dark Header */}
      {isVisible("header") && (
        <div style={{ backgroundColor: "#0f172a", color: "white", padding: "32px 44px" }}>
          <h1 className="font-black" style={{ fontSize: "28pt", letterSpacing: "-1px" }}>{header.firstName} <span style={{ color: colorScheme }}>{header.lastName}</span></h1>
          {header.headline && <p className="mt-1 font-light text-sm uppercase tracking-[0.2em]" style={{ color: "#94a3b8", fontSize: "10pt" }}>{header.headline}</p>}
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-xs" style={{ color: "#cbd5e1", fontSize: "8.5pt" }}>
            {header.email && <span>{header.email}</span>}
            {header.phone && <span>{header.phone}</span>}
            {header.location && <span>{header.location}</span>}
            {header.linkedin && <span>{header.linkedin}</span>}
            {header.github && <span>{header.github}</span>}
            {header.website && <span>{header.website}</span>}
          </div>
        </div>
      )}

      <div style={{ padding: "24px 44px 40px" }}>
        {isVisible("summary") && summary.content && (
          <div className="mb-5">
            <p className="text-sm leading-relaxed" style={{ color: "#475569", borderLeft: `4px solid ${colorScheme}`, paddingLeft: "12px" }}>{summary.content}</p>
          </div>
        )}

        {isVisible("experience") && experience.length > 0 && (
          <div className="mb-5">
            <h2 className="font-black uppercase mb-2" style={{ fontSize: "11pt", color: "#0f172a", letterSpacing: "1px" }}>Experience</h2>
            {experience.map(exp => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <div><span className="font-bold" style={{ fontSize: "10.5pt" }}>{exp.title}</span> <span className="text-sm" style={{ color: colorScheme }}>@ {exp.company}</span></div>
                  <span className="text-xs" style={{ color: "#94a3b8" }}>{exp.startDate} — {exp.current ? "Present" : exp.endDate}</span>
                </div>
                {exp.location && <p className="text-xs" style={{ color: "#94a3b8" }}>{exp.location}</p>}
                {exp.bullets.length > 0 && <ul className="mt-1 space-y-0.5">{exp.bullets.filter(b => b.content).map(b => <li key={b.id} className="text-sm pl-4 relative" style={{ color: "#374151", fontWeight: b.highlighted ? 700 : 400 }}><span className="absolute left-0 font-bold" style={{ color: colorScheme }}>&rsaquo;</span>{b.content}</li>)}</ul>}
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-6">
          <div className="flex-1">
            {isVisible("education") && education.length > 0 && (
              <div className="mb-5">
                <h2 className="font-black uppercase mb-2" style={{ fontSize: "11pt", color: "#0f172a", letterSpacing: "1px" }}>Education</h2>
                {education.map(edu => (
                  <div key={edu.id} className="mb-2">
                    <p className="font-bold" style={{ fontSize: "10pt" }}>{edu.degree}{edu.field ? ` — ${edu.field}` : ""}</p>
                    <p className="text-sm" style={{ color: colorScheme }}>{edu.institution}</p>
                    <p className="text-xs" style={{ color: "#94a3b8" }}>{edu.endDate}{edu.gpa ? ` | GPA: ${edu.gpa}` : ""}</p>
                  </div>
                ))}
              </div>
            )}

            {isVisible("projects") && projects.length > 0 && (
              <div className="mb-5">
                <h2 className="font-black uppercase mb-2" style={{ fontSize: "11pt", color: "#0f172a", letterSpacing: "1px" }}>Projects</h2>
                {projects.map(p => (
                  <div key={p.id} className="mb-2">
                    <p className="font-bold" style={{ fontSize: "10pt" }}>{p.name}</p>
                    {p.description && <p className="text-xs italic" style={{ color: "#64748b" }}>{p.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ width: "200px" }}>
            {isVisible("skills") && skills.groups.some(g => g.skills.length > 0) && (
              <div className="mb-5">
                <h2 className="font-black uppercase mb-2" style={{ fontSize: "11pt", color: "#0f172a", letterSpacing: "1px" }}>Skills</h2>
                {skills.groups.filter(g => g.skills.length > 0).map(g => (
                  <div key={g.id} className="mb-2">
                    <p className="text-xs font-bold uppercase" style={{ color: colorScheme }}>{g.label}</p>
                    <p className="text-xs" style={{ color: "#475569" }}>{g.skills.join(", ")}</p>
                  </div>
                ))}
              </div>
            )}

            {isVisible("certifications") && certifications.length > 0 && (
              <div className="mb-5">
                <h2 className="font-black uppercase mb-2" style={{ fontSize: "11pt", color: "#0f172a", letterSpacing: "1px" }}>Certs</h2>
                {certifications.map(c => <p key={c.id} className="text-xs mb-1"><span className="font-semibold">{c.name}</span></p>)}
              </div>
            )}

            {isVisible("languages") && languages.length > 0 && (
              <div className="mb-5">
                <h2 className="font-black uppercase mb-2" style={{ fontSize: "11pt", color: "#0f172a", letterSpacing: "1px" }}>Languages</h2>
                {languages.map(l => <p key={l.id} className="text-xs">{l.language} · {l.proficiency}</p>)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
