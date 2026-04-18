/**
 * LinkedIn Data Export Parser
 * Parses CSV files from LinkedIn data export ZIP:
 * - Profile.csv → header info
 * - Positions.csv → experience
 * - Education.csv → education
 * - Skills.csv → skills
 */

import type { ResumeData, ExperienceItem, EducationItem } from "@/types/resume";
import { DEFAULT_RESUME_DATA, generateId } from "./default-data";

interface ParsedCSV {
  headers: string[];
  rows: Record<string, string>[];
}

function parseCSV(text: string): ParsedCSV {
  const lines = text.split("\n").filter((l) => l.trim());
  if (lines.length === 0) return { headers: [], rows: [] };

  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  const rows = lines.slice(1).map((line) => {
    const values = line.match(/(".*?"|[^,]+)/g) || [];
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = (values[i] || "").replace(/^"|"$/g, "").trim();
    });
    return row;
  });

  return { headers, rows };
}

export async function parseLinkedInZip(file: File): Promise<Partial<ResumeData>> {
  // Dynamic import JSZip only when needed
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(file);

  const data: Partial<ResumeData> = {
    ...structuredClone(DEFAULT_RESUME_DATA),
  };

  // Parse Profile.csv
  const profileFile = zip.file("Profile.csv") || zip.file("profile.csv");
  if (profileFile) {
    const text = await profileFile.async("text");
    const { rows } = parseCSV(text);
    if (rows[0]) {
      const p = rows[0];
      data.header = {
        ...DEFAULT_RESUME_DATA.header,
        firstName: p["First Name"] || p["first_name"] || "",
        lastName: p["Last Name"] || p["last_name"] || "",
        headline: p["Headline"] || p["headline"] || "",
        location: p["Geo Location"] || p["geo_location"] || p["Location"] || "",
        email: p["Email Address"] || p["email"] || "",
      };
      if (p["Summary"] || p["summary"]) {
        data.summary = { content: p["Summary"] || p["summary"] || "" };
      }
    }
  }

  // Parse Positions.csv
  const posFile = zip.file("Positions.csv") || zip.file("positions.csv");
  if (posFile) {
    const text = await posFile.async("text");
    const { rows } = parseCSV(text);
    data.experience = rows.map((r): ExperienceItem => ({
      id: generateId("exp"),
      title: r["Title"] || r["title"] || "",
      company: r["Company Name"] || r["company_name"] || "",
      location: r["Location"] || r["location"] || "",
      startDate: formatLinkedInDate(r["Started On"] || r["started_on"] || ""),
      endDate: r["Finished On"] || r["finished_on"] ? formatLinkedInDate(r["Finished On"] || r["finished_on"]) : null,
      current: !(r["Finished On"] || r["finished_on"]),
      bullets: (r["Description"] || r["description"] || "")
        .split(/[.;]\s+/)
        .filter((s) => s.trim().length > 10)
        .slice(0, 5)
        .map((s) => ({ id: generateId("b"), content: s.trim(), highlighted: false })),
    }));
  }

  // Parse Education.csv
  const eduFile = zip.file("Education.csv") || zip.file("education.csv");
  if (eduFile) {
    const text = await eduFile.async("text");
    const { rows } = parseCSV(text);
    data.education = rows.map((r): EducationItem => ({
      id: generateId("edu"),
      institution: r["School Name"] || r["school_name"] || "",
      degree: r["Degree Name"] || r["degree_name"] || "",
      field: r["Fields of Study"] || r["fields_of_study"] || "",
      location: "",
      startDate: r["Start Date"] || r["start_date"] || "",
      endDate: r["End Date"] || r["end_date"] || "",
      highlights: (r["Activities and Societies"] || r["activities_and_societies"] || "").split(",").filter(Boolean).map((s) => s.trim()),
    }));
  }

  // Parse Skills.csv
  const skillFile = zip.file("Skills.csv") || zip.file("skills.csv");
  if (skillFile) {
    const text = await skillFile.async("text");
    const { rows } = parseCSV(text);
    const skills = rows.map((r) => r["Name"] || r["name"] || "").filter(Boolean);
    data.skills = {
      display: "grouped",
      groups: [{ id: generateId("sg"), label: "Skills", skills }],
    };
  }

  return data;
}

function formatLinkedInDate(dateStr: string): string {
  if (!dateStr) return "";
  // LinkedIn dates are typically "Mon YYYY" or "YYYY"
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length === 2) {
    const months: Record<string, string> = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" };
    return `${parts[1]}-${months[parts[0]] || "01"}`;
  }
  return dateStr;
}

/**
 * Parse a LinkedIn JSON export (newer format)
 */
export function parseLinkedInJSON(jsonData: Record<string, unknown>): Partial<ResumeData> {
  const data: Partial<ResumeData> = { ...structuredClone(DEFAULT_RESUME_DATA) };

  // Handle various LinkedIn JSON formats
  const profile = (jsonData.profile || jsonData.basics || jsonData) as Record<string, unknown>;

  if (profile.firstName || profile.first_name) {
    data.header = {
      ...DEFAULT_RESUME_DATA.header,
      firstName: String(profile.firstName || profile.first_name || ""),
      lastName: String(profile.lastName || profile.last_name || ""),
      headline: String(profile.headline || profile.label || ""),
      email: String(profile.email || ""),
      location: String(profile.location || ""),
    };
  }

  return data;
}
