"use client";

import type { TemplateProps } from "@/types/resume";
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";

/**
 * Meridian Template — Clean, single-column, professional
 * Best for: Tech / Engineering roles
 * Style: Bold section headers, clear hierarchy, ATS-friendly
 */
export function MeridianTemplate({ data, scale = 1, paperSize = "letter", sectionVisibility }: TemplateProps) {
  const { header, summary, experience, education, skills, projects, certifications, languages } = data;
  const { colorScheme, fontFamily, fontSize } = data.meta;
  const vis = sectionVisibility ?? {};
  const isVisible = (section: string) => vis[section as keyof typeof vis] !== false;

  const fontSizeMap = { sm: "9pt", md: "10pt", lg: "11pt" };
  const baseFontSize = fontSizeMap[fontSize] || "10pt";

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
        padding: "40px 48px",
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      {isVisible("header") && (
        <div className="text-center mb-4 pb-3" style={{ borderBottom: `2px solid ${colorScheme}` }}>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: colorScheme, fontSize: "24pt" }}>
            {header.firstName} {header.lastName}
          </h1>
          {header.headline && (
            <p className="mt-1 text-sm tracking-wide uppercase" style={{ fontSize: "11pt", color: "#475569" }}>
              {header.headline}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 text-xs" style={{ fontSize: "9pt", color: "#334155" }}>
            {header.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" /> {header.email}
              </span>
            )}
            {header.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" /> {header.phone}
              </span>
            )}
            {header.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {header.location}
              </span>
            )}
            {header.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin className="w-3 h-3" /> {header.linkedin}
              </span>
            )}
            {header.github && (
              <span className="flex items-center gap-1">
                <Github className="w-3 h-3" /> {header.github}
              </span>
            )}
            {header.website && (
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" /> {header.website}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Summary */}
      {isVisible("summary") && summary.content && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-1 pb-0.5" style={{ color: colorScheme, borderBottom: `1px solid ${colorScheme}40`, fontSize: "11pt" }}>
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "#334155" }}>
            {summary.content}
          </p>
        </div>
      )}

      {/* Experience */}
      {isVisible("experience") && experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 pb-0.5" style={{ color: colorScheme, borderBottom: `1px solid ${colorScheme}40`, fontSize: "11pt" }}>
            Experience
          </h2>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold" style={{ fontSize: "10.5pt" }}>{exp.title}</p>
                  <p className="text-sm italic" style={{ color: "#475569" }}>{exp.company}{exp.location ? ` — ${exp.location}` : ""}</p>
                </div>
                <p className="text-xs whitespace-nowrap ml-4" style={{ color: "#64748b", fontSize: "9pt" }}>
                  {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                </p>
              </div>
              {exp.bullets.length > 0 && (
                <ul className="mt-1 space-y-0.5 pl-4">
                  {exp.bullets.filter(b => b.content).map((bullet) => (
                    <li
                      key={bullet.id}
                      className="relative text-sm pl-2"
                      style={{ color: "#334155", fontWeight: bullet.highlighted ? 600 : 400 }}
                    >
                      <span className="absolute -left-2">&bull;</span>
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
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 pb-0.5" style={{ color: colorScheme, borderBottom: `1px solid ${colorScheme}40`, fontSize: "11pt" }}>
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold" style={{ fontSize: "10.5pt" }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                  </p>
                  <p className="text-sm italic" style={{ color: "#475569" }}>
                    {edu.institution}{edu.location ? ` — ${edu.location}` : ""}
                  </p>
                </div>
                <p className="text-xs whitespace-nowrap ml-4" style={{ color: "#64748b", fontSize: "9pt" }}>
                  {edu.startDate} — {edu.endDate}
                </p>
              </div>
              {(edu.gpa || edu.highlights.length > 0) && (
                <div className="mt-0.5 text-sm" style={{ color: "#334155" }}>
                  {edu.gpa && <p>GPA: {edu.gpa}</p>}
                  {edu.highlights.length > 0 && (
                    <p>{edu.highlights.join(" | ")}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {isVisible("skills") && skills.groups.some(g => g.skills.length > 0) && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 pb-0.5" style={{ color: colorScheme, borderBottom: `1px solid ${colorScheme}40`, fontSize: "11pt" }}>
            Skills
          </h2>
          {skills.groups.filter(g => g.skills.length > 0).map((group) => (
            <div key={group.id} className="mb-1">
              <span className="font-semibold text-sm">{group.label}: </span>
              <span className="text-sm" style={{ color: "#334155" }}>
                {group.skills.join(", ")}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {isVisible("projects") && projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 pb-0.5" style={{ color: colorScheme, borderBottom: `1px solid ${colorScheme}40`, fontSize: "11pt" }}>
            Projects
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold" style={{ fontSize: "10.5pt" }}>{proj.name}</p>
                  {proj.description && <p className="text-sm italic" style={{ color: "#475569" }}>{proj.description}</p>}
                </div>
                {proj.url && <p className="text-xs ml-4" style={{ color: colorScheme }}>{proj.url}</p>}
              </div>
              {proj.technologies.length > 0 && (
                <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                  Technologies: {proj.technologies.join(", ")}
                </p>
              )}
              {proj.bullets.length > 0 && (
                <ul className="mt-1 space-y-0.5 pl-4">
                  {proj.bullets.filter(b => b.content).map((bullet) => (
                    <li key={bullet.id} className="relative text-sm pl-2" style={{ color: "#334155" }}>
                      <span className="absolute -left-2">&bull;</span>
                      {bullet.content}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {isVisible("certifications") && certifications.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 pb-0.5" style={{ color: colorScheme, borderBottom: `1px solid ${colorScheme}40`, fontSize: "11pt" }}>
            Certifications
          </h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="flex justify-between mb-1">
              <div>
                <span className="font-semibold text-sm">{cert.name}</span>
                {cert.issuer && <span className="text-sm" style={{ color: "#475569" }}> — {cert.issuer}</span>}
              </div>
              {cert.date && <span className="text-xs" style={{ color: "#64748b" }}>{cert.date}</span>}
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {isVisible("languages") && languages.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 pb-0.5" style={{ color: colorScheme, borderBottom: `1px solid ${colorScheme}40`, fontSize: "11pt" }}>
            Languages
          </h2>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {languages.map((lang) => (
              <span key={lang.id} className="text-sm">
                <span className="font-semibold">{lang.language}</span>
                <span style={{ color: "#475569" }}> — {lang.proficiency}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
