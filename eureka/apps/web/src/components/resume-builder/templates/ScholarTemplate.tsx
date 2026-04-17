"use client";

import type { TemplateProps } from "@/types/resume";

/**
 * Scholar Template — Academic, dense, no-frills
 * Best for: Academia / Research
 */
export function ScholarTemplate({ data, scale = 1, paperSize = "letter", sectionVisibility }: TemplateProps) {
  const { header, summary, experience, education, skills, projects, certifications, languages } = data;
  const { fontFamily, fontSize } = data.meta;
  const vis = sectionVisibility ?? {};
  const isVisible = (s: string) => vis[s as keyof typeof vis] !== false;
  const sizes = { sm: "9pt", md: "10pt", lg: "11pt" };
  const pw = paperSize === "a4" ? "794px" : "816px";
  const ph = paperSize === "a4" ? "1123px" : "1056px";

  return (
    <div className="bg-white text-black" style={{ width: pw, minHeight: ph, fontFamily: `'${fontFamily}', serif`, fontSize: sizes[fontSize], lineHeight: "1.35", padding: "36px 52px", transform: `scale(${scale})`, transformOrigin: "top left" }}>
      {isVisible("header") && (
        <div className="text-center mb-3 pb-2 border-b-2 border-black">
          <h1 className="font-bold" style={{ fontSize: "20pt" }}>{header.firstName} {header.lastName}</h1>
          {header.headline && <p className="text-sm italic mt-0.5">{header.headline}</p>}
          <p className="text-xs mt-1" style={{ color: "#374151" }}>
            {[header.email, header.phone, header.location, header.website, header.linkedin].filter(Boolean).join(" | ")}
          </p>
        </div>
      )}

      {isVisible("summary") && summary.content && (
        <div className="mb-3">
          <h2 className="font-bold text-sm uppercase border-b border-gray-400 pb-0.5 mb-1" style={{ fontSize: "10.5pt" }}>Research Interests</h2>
          <p className="text-sm" style={{ color: "#1f2937" }}>{summary.content}</p>
        </div>
      )}

      {isVisible("education") && education.length > 0 && (
        <div className="mb-3">
          <h2 className="font-bold text-sm uppercase border-b border-gray-400 pb-0.5 mb-1" style={{ fontSize: "10.5pt" }}>Education</h2>
          {education.map(edu => (
            <div key={edu.id} className="mb-1.5">
              <div className="flex justify-between"><span className="font-bold">{edu.degree}{edu.field ? `, ${edu.field}` : ""}</span><span className="text-xs">{edu.startDate} — {edu.endDate}</span></div>
              <p className="italic text-sm">{edu.institution}{edu.location ? `, ${edu.location}` : ""}</p>
              {edu.gpa && <p className="text-xs">GPA: {edu.gpa}</p>}
              {edu.highlights.length > 0 && <p className="text-xs">{edu.highlights.join("; ")}</p>}
            </div>
          ))}
        </div>
      )}

      {isVisible("experience") && experience.length > 0 && (
        <div className="mb-3">
          <h2 className="font-bold text-sm uppercase border-b border-gray-400 pb-0.5 mb-1" style={{ fontSize: "10.5pt" }}>Research & Professional Experience</h2>
          {experience.map(exp => (
            <div key={exp.id} className="mb-2">
              <div className="flex justify-between"><span className="font-bold">{exp.title}</span><span className="text-xs">{exp.startDate} — {exp.current ? "Present" : exp.endDate}</span></div>
              <p className="italic text-sm">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
              {exp.bullets.length > 0 && <ul className="mt-0.5 space-y-0">{exp.bullets.filter(b => b.content).map(b => <li key={b.id} className="text-sm pl-3 relative" style={{ fontWeight: b.highlighted ? 600 : 400 }}><span className="absolute left-0">&bull;</span>{b.content}</li>)}</ul>}
            </div>
          ))}
        </div>
      )}

      {isVisible("projects") && projects.length > 0 && (
        <div className="mb-3">
          <h2 className="font-bold text-sm uppercase border-b border-gray-400 pb-0.5 mb-1" style={{ fontSize: "10.5pt" }}>Publications & Projects</h2>
          {projects.map(p => (
            <div key={p.id} className="mb-1.5">
              <p><span className="font-bold">{p.name}</span>{p.description ? ` — ${p.description}` : ""}</p>
              {p.url && <p className="text-xs italic">{p.url}</p>}
              {p.bullets.filter(b => b.content).map(b => <p key={b.id} className="text-sm pl-3 relative"><span className="absolute left-0">&bull;</span>{b.content}</p>)}
            </div>
          ))}
        </div>
      )}

      {isVisible("skills") && skills.groups.some(g => g.skills.length > 0) && (
        <div className="mb-3">
          <h2 className="font-bold text-sm uppercase border-b border-gray-400 pb-0.5 mb-1" style={{ fontSize: "10.5pt" }}>Technical Skills</h2>
          {skills.groups.filter(g => g.skills.length > 0).map(g => <p key={g.id} className="text-sm"><span className="font-bold">{g.label}:</span> {g.skills.join(", ")}</p>)}
        </div>
      )}

      {isVisible("certifications") && certifications.length > 0 && (
        <div className="mb-3">
          <h2 className="font-bold text-sm uppercase border-b border-gray-400 pb-0.5 mb-1" style={{ fontSize: "10.5pt" }}>Awards & Certifications</h2>
          {certifications.map(c => <p key={c.id} className="text-sm"><span className="font-bold">{c.name}</span>{c.issuer ? `, ${c.issuer}` : ""}{c.date ? ` (${c.date})` : ""}</p>)}
        </div>
      )}

      {isVisible("languages") && languages.length > 0 && (
        <div className="mb-3">
          <h2 className="font-bold text-sm uppercase border-b border-gray-400 pb-0.5 mb-1" style={{ fontSize: "10.5pt" }}>Languages</h2>
          <p className="text-sm">{languages.map(l => `${l.language} (${l.proficiency})`).join(", ")}</p>
        </div>
      )}
    </div>
  );
}
