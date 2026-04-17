import type { TemplateConfig, TemplateId } from "@/types/resume";

export const TEMPLATES: Record<TemplateId, TemplateConfig> = {
  meridian: {
    id: "meridian",
    name: "Meridian",
    description: "Clean, single-column layout with bold section headers",
    bestFor: "Tech / Engineering",
  },
  atlas: {
    id: "atlas",
    name: "Atlas",
    description: "Two-column layout with a left sidebar for skills and contact",
    bestFor: "Business / Finance",
  },
  prism: {
    id: "prism",
    name: "Prism",
    description: "Colorful header band with modern typography",
    bestFor: "Design / Marketing",
  },
  scholar: {
    id: "scholar",
    name: "Scholar",
    description: "Academic-focused, dense layout with publications support",
    bestFor: "Academia / Research",
  },
  carta: {
    id: "carta",
    name: "Carta",
    description: "Minimalist design with generous whitespace",
    bestFor: "Executives / Senior roles",
  },
  vertex: {
    id: "vertex",
    name: "Vertex",
    description: "Technical grid-based layout with clear hierarchy",
    bestFor: "Project Managers / Engineers",
  },
  foundry: {
    id: "foundry",
    name: "Foundry",
    description: "Bold typography with a dark header accent",
    bestFor: "Creative / Startups",
  },
  pulse: {
    id: "pulse",
    name: "Pulse",
    description: "Timeline-based layout with visual progression",
    bestFor: "UX / Product",
  },
};

export const TEMPLATE_LIST = Object.values(TEMPLATES);

export const FONT_OPTIONS = [
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Lato", label: "Lato" },
  { value: "Merriweather", label: "Merriweather" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Source Sans 3", label: "Source Sans" },
  { value: "Nunito", label: "Nunito" },
  { value: "Raleway", label: "Raleway" },
  { value: "IBM Plex Sans", label: "IBM Plex Sans" },
];

export const COLOR_PRESETS = [
  { value: "#2563eb", label: "Professional Blue" },
  { value: "#0f172a", label: "Classic Black" },
  { value: "#059669", label: "Emerald Green" },
  { value: "#7c3aed", label: "Royal Purple" },
  { value: "#dc2626", label: "Bold Red" },
  { value: "#d97706", label: "Warm Amber" },
  { value: "#0891b2", label: "Teal" },
  { value: "#4f46e5", label: "Indigo" },
  { value: "#64748b", label: "Slate Gray" },
  { value: "#be185d", label: "Rose" },
];
