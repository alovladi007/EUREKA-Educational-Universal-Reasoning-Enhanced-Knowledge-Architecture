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
  // Use the backend to parse the ZIP, or parse CSV files directly if user uploads individual CSVs
  // For ZIP files, we send to backend. For CSV files, parse client-side.

  if (file.name.endsWith(".csv")) {
    return parseLinkedInCSV(file);
  }

  // For ZIP: send to backend for processing, or try client-side extraction
  // Since JSZip has monorepo issues, upload to backend instead
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${process.env.NEXT_PUBLIC_API_PREFIX || "/api/v1"}`;
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`${apiUrl}/resumes/import/pdf`, { method: "POST", body: formData });
    if (res.ok) {
      const result = await res.json();
      if (result.success) return result.data;
    }
  } catch {
    // Backend unavailable — fall through to CSV parsing hint
  }

  throw new Error("LinkedIn ZIP import requires the backend service. Alternatively, extract the CSV files from the ZIP and upload them individually (Profile.csv, Positions.csv, Education.csv, Skills.csv).");
}

async function parseLinkedInCSV(file: File): Promise<Partial<ResumeData>> {
  const text = await file.text();
  const { rows } = parseCSV(text);
  const data: Partial<ResumeData> = { ...structuredClone(DEFAULT_RESUME_DATA) };

  // Detect which CSV based on columns
  const headers = Object.keys(rows[0] || {});
  const headersLower = headers.map((h) => h.toLowerCase());

  if (headersLower.some((h) => h.includes("first name") || h.includes("first_name"))) {
    // Profile.csv
    const p = rows[0];
    data.header = {
      ...DEFAULT_RESUME_DATA.header,
      firstName: p["First Name"] || p["first_name"] || "",
      lastName: p["Last Name"] || p["last_name"] || "",
      headline: p["Headline"] || p["headline"] || "",
      location: p["Geo Location"] || p["geo_location"] || p["Location"] || "",
      email: p["Email Address"] || p["email"] || "",
    };
  } else if (headersLower.some((h) => h.includes("company") || h.includes("title"))) {
    // Positions.csv
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
  } else if (headersLower.some((h) => h.includes("school") || h.includes("degree"))) {
    // Education.csv
    data.education = rows.map((r): EducationItem => ({
      id: generateId("edu"),
      institution: r["School Name"] || r["school_name"] || "",
      degree: r["Degree Name"] || r["degree_name"] || "",
      field: r["Fields of Study"] || r["fields_of_study"] || "",
      location: "",
      startDate: r["Start Date"] || r["start_date"] || "",
      endDate: r["End Date"] || r["end_date"] || "",
      highlights: [],
    }));
  } else {
    // Skills.csv or unknown
    const skills = rows.map((r) => r["Name"] || r["name"] || Object.values(r)[0] || "").filter(Boolean);
    data.skills = { display: "grouped", groups: [{ id: generateId("sg"), label: "Skills", skills }] };
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
