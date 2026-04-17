"use client";

import type { TemplateProps } from "@/types/resume";
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";

/**
 * Atlas Template — Two-column with left sidebar
 * Best for: Business / Finance roles
 * Style: Left sidebar with contact/skills, main content area for experience/education
 */
export function AtlasTemplate({ data, scale = 1, paperSize = "letter", sectionVisibility }: TemplateProps) {
  const { header, summary, experience, education, skills, projects, certifications, languages } = data;
  const { colorScheme, fontFamily, fontSize } = data.meta;
  const vis = sectionVisibility ?? {};
  const isVisible = (section: string) => vis[section as keyof typeof vis] !== false;

  const fontSizeMap = { sm: "8.5pt", md: "9.5pt", lg: "10.5pt" };
  const baseFontSize = fontSizeMap[fontSize] || "9.5pt";

  const pageWidth = paperSize === "a4" ? "794px" : "816px";
  const pageHeight = paperSize === "a4" ? "1123px" : "1056px";

  return (
    <div
      className="bg-white text-black"
      style={{
        width: pageWidth,
        minHeight: pageHeight,
        fontFamily: `'${fontFamily}', sans-serif`,
        fontSize: baseFontSize,
        lineHeight: "1.4",
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        display: "flex",
        boxSizing: "border-box",
      }}
    >
      {/* Left Sidebar */}
      <div
        className="flex-shrink-0"
        style={{
          width: "240px",
          backgroundColor: colorScheme,
          color: "white",
          padding: "32px 20px",
        }}
      >
        {/* Name */}
        {isVisible("header") && (
          <div className="mb-6">
            <h1 className="text-xl font-bold leading-tight" style={{ fontSize: "18pt" }}>
              {header.firstName}
              <br />
              {header.lastName}
            </h1>
            {header.headline && (
              <p className="mt-1 text-xs uppercase tracking-wider opacity-80" style={{ fontSize: "8.5pt" }}>
                {header.headline}
              </p>
            )}
          </div>
        )}

        {/* Contact */}
        {isVisible("header") && (
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.3)", fontSize: "8pt" }}>
              Contact
            </h3>
            <div className="space-y-1.5 text-xs" style={{ fontSize: "8.5pt" }}>
              {header.email && <div className="flex items-start gap-1.5"><Mail className="w-3 h-3 mt-0.5 flex-shrink-0" /><span className="break-all">{header.email}</span></div>}
              {header.phone && <div className="flex items-start gap-1.5"><Phone className="w-3 h-3 mt-0.5 flex-shrink-0" /><span>{header.phone}</span></div>}
              {header.location && <div className="flex items-start gap-1.5"><MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" /><span>{header.location}</span></div>}
              {header.linkedin && <div className="flex items-start gap-1.5"><Linkedin className="w-3 h-3 mt-0.5 flex-shrink-0" /><span className="break-all">{header.linkedin}</span></div>}
              {header.github && <div className="flex items-start gap-1.5"><Github className="w-3 h-3 mt-0.5 flex-shrink-0" /><span className="break-all">{header.github}</span></div>}
              {header.website && <div className="flex items-start gap-1.5"><Globe className="w-3 h-3 mt-0.5 flex-shrink-0" /><span className="break-all">{header.website}</span></div>}
            </div>
          </div>
        )}

        {/* Skills in sidebar */}
        {isVisible("skills") && skills.groups.some(g => g.skills.length > 0) && (
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.3)", fontSize: "8pt" }}>
              Skills
            </h3>
            {skills.groups.filter(g => g.skills.length > 0).map((group) => (
              <div key={group.id} className="mb-2">
                <p className="text-xs font-semibold opacity-90" style={{ fontSize: "8pt" }}>{group.label}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {group.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: "rgba(255,255,255,0.15)", fontSize: "7.5pt" }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Languages in sidebar */}
        {isVisible("languages") && languages.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.3)", fontSize: "8pt" }}>
              Languages
            </h3>
            <div className="space-y-1">
              {languages.map((lang) => (
                <div key={lang.id} className="text-xs" style={{ fontSize: "8.5pt" }}>
                  <span className="font-semibold">{lang.language}</span>
                  <span className="opacity-70"> — {lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications in sidebar */}
        {isVisible("certifications") && certifications.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.3)", fontSize: "8pt" }}>
              Certifications
            </h3>
            <div className="space-y-1.5">
              {certifications.map((cert) => (
                <div key={cert.id} className="text-xs" style={{ fontSize: "8.5pt" }}>
                  <p className="font-semibold">{cert.name}</p>
                  {cert.issuer && <p className="opacity-70">{cert.issuer}</p>}
                  {cert.date && <p className="opacity-50" style={{ fontSize: "7.5pt" }}>{cert.date}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1" style={{ padding: "32px 28px" }}>
        {/* Summary */}
        {isVisible("summary") && summary.content && (
          <div className="mb-5">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-1.5" style={{ color: colorScheme, fontSize: "10pt" }}>
              About Me
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
              {summary.content}
            </p>
          </div>
        )}

        {/* Experience */}
        {isVisible("experience") && experience.length > 0 && (
          <div className="mb-5">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: colorScheme, fontSize: "10pt" }}>
              Experience
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <p className="font-bold" style={{ fontSize: "10pt" }}>{exp.title}</p>
                  <p className="text-xs flex-shrink-0 ml-2" style={{ color: "#6b7280", fontSize: "8pt" }}>
                    {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                  </p>
                </div>
                <p className="text-sm" style={{ color: colorScheme, fontStyle: "italic" }}>
                  {exp.company}{exp.location ? `, ${exp.location}` : ""}
                </p>
                {exp.bullets.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {exp.bullets.filter(b => b.content).map((bullet) => (
                      <li key={bullet.id} className="text-sm pl-3 relative" style={{ color: "#374151", fontWeight: bullet.highlighted ? 600 : 400 }}>
                        <span className="absolute left-0" style={{ color: colorScheme }}>&bull;</span>
                        {bullet.content}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {isVisible("education") && education.length > 0 && (
          <div className="mb-5">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: colorScheme, fontSize: "10pt" }}>
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <p className="font-bold" style={{ fontSize: "10pt" }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                  </p>
                  <p className="text-xs flex-shrink-0 ml-2" style={{ color: "#6b7280", fontSize: "8pt" }}>
                    {edu.startDate} — {edu.endDate}
                  </p>
                </div>
                <p className="text-sm" style={{ color: colorScheme, fontStyle: "italic" }}>{edu.institution}</p>
                {edu.gpa && <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>GPA: {edu.gpa}</p>}
                {edu.highlights.length > 0 && (
                  <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{edu.highlights.join(" | ")}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {isVisible("projects") && projects.length > 0 && (
          <div className="mb-5">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: colorScheme, fontSize: "10pt" }}>
              Projects
            </h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-2">
                <p className="font-bold" style={{ fontSize: "10pt" }}>{proj.name}</p>
                {proj.description && <p className="text-sm italic" style={{ color: "#6b7280" }}>{proj.description}</p>}
                {proj.technologies.length > 0 && (
                  <p className="text-xs" style={{ color: "#9ca3af" }}>
                    {proj.technologies.join(" | ")}
                  </p>
                )}
                {proj.bullets.length > 0 && (
                  <ul className="mt-0.5 space-y-0.5">
                    {proj.bullets.filter(b => b.content).map((bullet) => (
                      <li key={bullet.id} className="text-sm pl-3 relative" style={{ color: "#374151" }}>
                        <span className="absolute left-0" style={{ color: colorScheme }}>&bull;</span>
                        {bullet.content}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
