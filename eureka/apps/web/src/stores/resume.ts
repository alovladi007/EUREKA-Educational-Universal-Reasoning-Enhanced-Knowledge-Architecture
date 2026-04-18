import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type {
  ResumeData,
  ResumeDocument,
  TemplateId,
  SectionId,
  ExperienceItem,
  EducationItem,
  ProjectItem,
  CertificationItem,
  LanguageItem,
  BulletItem,
  SkillGroup,
  CustomSection,
} from "@/types/resume";
import {
  DEFAULT_RESUME_DATA,
  DEFAULT_SECTION_VISIBILITY,
  SAMPLE_RESUME_DATA,
  generateId,
} from "@/lib/resume/default-data";

interface HistoryEntry {
  documentId: string;
  data: ResumeData;
  timestamp: number;
}

interface SavedVersion {
  id: string;
  label: string;
  data: ResumeData;
  createdAt: string;
}

interface ResumeStore {
  // State
  documents: Record<string, ResumeDocument>;
  activeDocumentId: string | null;
  activeSection: SectionId | null;
  isSaving: boolean;
  lastSaved: string | null;

  // Undo/Redo
  undoStack: HistoryEntry[];
  redoStack: HistoryEntry[];
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Version History (persisted)
  savedVersions: Record<string, SavedVersion[]>;
  saveVersion: (label: string) => void;
  restoreVersion: (versionId: string) => void;
  getSavedVersions: () => SavedVersion[];

  // Computed
  activeDocument: () => ResumeDocument | null;
  activeData: () => ResumeData | null;

  // Document management
  createDocument: (title: string, useSample?: boolean) => string;
  deleteDocument: (id: string) => void;
  recoverDocument: (id: string) => void;
  permanentlyDeleteDocument: (id: string) => void;
  getDeletedDocuments: () => ResumeDocument[];
  duplicateDocument: (id: string) => string;
  setActiveDocument: (id: string | null) => void;
  renameDocument: (id: string, title: string) => void;

  // Template
  setTemplate: (templateId: TemplateId) => void;

  // Section management
  setActiveSection: (section: SectionId | null) => void;
  toggleSectionVisibility: (section: SectionId) => void;
  reorderSections: (newOrder: SectionId[]) => void;

  // Header/Contact
  updateHeader: (field: string, value: string) => void;

  // Summary
  updateSummary: (content: string) => void;

  // Experience
  addExperience: () => void;
  updateExperience: (id: string, field: string, value: unknown) => void;
  removeExperience: (id: string) => void;
  addBullet: (experienceId: string) => void;
  updateBullet: (experienceId: string, bulletId: string, content: string) => void;
  removeBullet: (experienceId: string, bulletId: string) => void;
  toggleBulletHighlight: (experienceId: string, bulletId: string) => void;
  reorderBullets: (experienceId: string, bulletIds: string[]) => void;

  // Education
  addEducation: () => void;
  updateEducation: (id: string, field: string, value: unknown) => void;
  removeEducation: (id: string) => void;

  // Skills
  addSkillGroup: () => void;
  updateSkillGroupLabel: (groupId: string, label: string) => void;
  removeSkillGroup: (groupId: string) => void;
  addSkill: (groupId: string, skill: string) => void;
  removeSkill: (groupId: string, skillIndex: number) => void;
  setSkillsDisplay: (display: "grouped" | "flat" | "rated") => void;

  // Projects
  addProject: () => void;
  updateProject: (id: string, field: string, value: unknown) => void;
  removeProject: (id: string) => void;
  addProjectBullet: (projectId: string) => void;
  updateProjectBullet: (projectId: string, bulletId: string, content: string) => void;
  removeProjectBullet: (projectId: string, bulletId: string) => void;

  // Certifications
  addCertification: () => void;
  updateCertification: (id: string, field: string, value: string) => void;
  removeCertification: (id: string) => void;

  // Languages
  addLanguage: () => void;
  updateLanguage: (id: string, field: string, value: string) => void;
  removeLanguage: (id: string) => void;

  // Meta
  updateMeta: (field: string, value: unknown) => void;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    immer((set, get) => ({
      // Initial state
      documents: {},
      activeDocumentId: null,
      activeSection: null,
      isSaving: false,
      lastSaved: null,
      undoStack: [],
      redoStack: [],
      savedVersions: {},

      // Undo/Redo
      pushHistory: () => {
        const { activeDocumentId, documents } = get();
        if (!activeDocumentId || !documents[activeDocumentId]) return;
        set((state) => {
          state.undoStack.push({
            documentId: activeDocumentId,
            data: structuredClone(documents[activeDocumentId].data),
            timestamp: Date.now(),
          });
          // Keep max 50 entries
          if (state.undoStack.length > 50) state.undoStack.shift();
          state.redoStack = []; // Clear redo on new change
        });
      },

      undo: () => {
        const { undoStack, activeDocumentId, documents } = get();
        if (undoStack.length === 0 || !activeDocumentId) return;
        set((state) => {
          const entry = state.undoStack.pop()!;
          // Save current state to redo
          state.redoStack.push({
            documentId: activeDocumentId,
            data: structuredClone(state.documents[activeDocumentId].data),
            timestamp: Date.now(),
          });
          // Restore
          state.documents[activeDocumentId].data = entry.data;
          state.documents[activeDocumentId].updatedAt = new Date().toISOString();
        });
      },

      redo: () => {
        const { redoStack, activeDocumentId } = get();
        if (redoStack.length === 0 || !activeDocumentId) return;
        set((state) => {
          const entry = state.redoStack.pop()!;
          // Save current to undo
          state.undoStack.push({
            documentId: activeDocumentId,
            data: structuredClone(state.documents[activeDocumentId].data),
            timestamp: Date.now(),
          });
          state.documents[activeDocumentId].data = entry.data;
          state.documents[activeDocumentId].updatedAt = new Date().toISOString();
        });
      },

      canUndo: () => get().undoStack.length > 0,
      canRedo: () => get().redoStack.length > 0,

      // Version History (persisted in store)
      saveVersion: (label) => {
        const doc = get().activeDocument();
        if (!doc) return;
        const version: SavedVersion = {
          id: generateId("ver"),
          label: label || `Version ${(get().savedVersions[doc.id]?.length ?? 0) + 1}`,
          data: structuredClone(doc.data),
          createdAt: new Date().toISOString(),
        };
        set((state) => {
          if (!state.savedVersions[doc.id]) state.savedVersions[doc.id] = [];
          state.savedVersions[doc.id].unshift(version);
          // Keep max 20 versions per document
          if (state.savedVersions[doc.id].length > 20) state.savedVersions[doc.id].pop();
        });
      },

      restoreVersion: (versionId) => {
        const doc = get().activeDocument();
        if (!doc) return;
        const versions = get().savedVersions[doc.id] ?? [];
        const version = versions.find((v) => v.id === versionId);
        if (!version) return;
        get().pushHistory(); // Save current state for undo
        set((state) => {
          state.documents[doc.id].data = structuredClone(version.data);
          state.documents[doc.id].updatedAt = new Date().toISOString();
        });
      },

      getSavedVersions: () => {
        const doc = get().activeDocument();
        if (!doc) return [];
        return get().savedVersions[doc.id] ?? [];
      },

      // Computed getters
      activeDocument: () => {
        const { documents, activeDocumentId } = get();
        return activeDocumentId ? documents[activeDocumentId] ?? null : null;
      },
      activeData: () => {
        const doc = get().activeDocument();
        return doc?.data ?? null;
      },

      // Document management
      createDocument: (title, useSample = false) => {
        const id = generateId("resume");
        set((state) => {
          state.documents[id] = {
            id,
            title,
            data: useSample ? structuredClone(SAMPLE_RESUME_DATA) : structuredClone(DEFAULT_RESUME_DATA),
            templateId: "meridian",
            sectionVisibility: { ...DEFAULT_SECTION_VISIBILITY },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isPublic: false,
          };
          state.activeDocumentId = id;
        });
        return id;
      },

      deleteDocument: (id) => {
        // Soft delete — mark as deleted, recoverable for 30 days
        set((state) => {
          if (state.documents[id]) {
            state.documents[id].deletedAt = new Date().toISOString();
          }
          if (state.activeDocumentId === id) {
            const remaining = Object.keys(state.documents).filter(
              (k) => !state.documents[k].deletedAt
            );
            state.activeDocumentId = remaining.length > 0 ? remaining[0] : null;
          }
        });
      },

      recoverDocument: (id) => {
        set((state) => {
          if (state.documents[id]) {
            delete state.documents[id].deletedAt;
          }
        });
      },

      permanentlyDeleteDocument: (id) => {
        set((state) => {
          delete state.documents[id];
        });
      },

      getDeletedDocuments: () => {
        return Object.values(get().documents).filter((d) => !!d.deletedAt);
      },

      duplicateDocument: (id) => {
        const newId = generateId("resume");
        set((state) => {
          const original = state.documents[id];
          if (!original) return;
          state.documents[newId] = {
            ...structuredClone(original),
            id: newId,
            title: `${original.title} (Copy)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          state.activeDocumentId = newId;
        });
        return newId;
      },

      setActiveDocument: (id) => set({ activeDocumentId: id }),

      renameDocument: (id, title) => {
        set((state) => {
          if (state.documents[id]) {
            state.documents[id].title = title;
            state.documents[id].updatedAt = new Date().toISOString();
          }
        });
      },

      // Template
      setTemplate: (templateId) => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (doc) {
            doc.templateId = templateId;
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      // Section management
      setActiveSection: (section) => set({ activeSection: section }),

      toggleSectionVisibility: (section) => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (doc) {
            doc.sectionVisibility[section] = !doc.sectionVisibility[section];
          }
        });
      },

      reorderSections: (newOrder) => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (doc) {
            doc.data.meta.sectionOrder = newOrder;
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      // Header
      updateHeader: (field, value) => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (doc) {
            (doc.data.header as Record<string, string>)[field] = value;
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      // Summary
      updateSummary: (content) => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (doc) {
            doc.data.summary.content = content;
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      // Experience
      addExperience: () => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (doc) {
            doc.data.experience.push({
              id: generateId("exp"),
              company: "",
              title: "",
              location: "",
              startDate: "",
              endDate: null,
              current: false,
              bullets: [{ id: generateId("bullet"), content: "", highlighted: false }],
            });
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      updateExperience: (id, field, value) => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (!doc) return;
          const exp = doc.data.experience.find((e) => e.id === id);
          if (exp) {
            (exp as Record<string, unknown>)[field] = value;
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      removeExperience: (id) => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (doc) {
            doc.data.experience = doc.data.experience.filter((e) => e.id !== id);
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      addBullet: (experienceId) => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (!doc) return;
          const exp = doc.data.experience.find((e) => e.id === experienceId);
          if (exp) {
            exp.bullets.push({ id: generateId("bullet"), content: "", highlighted: false });
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      updateBullet: (experienceId, bulletId, content) => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (!doc) return;
          const exp = doc.data.experience.find((e) => e.id === experienceId);
          const bullet = exp?.bullets.find((b) => b.id === bulletId);
          if (bullet) {
            bullet.content = content;
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      removeBullet: (experienceId, bulletId) => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (!doc) return;
          const exp = doc.data.experience.find((e) => e.id === experienceId);
          if (exp) {
            exp.bullets = exp.bullets.filter((b) => b.id !== bulletId);
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      toggleBulletHighlight: (experienceId, bulletId) => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (!doc) return;
          const exp = doc.data.experience.find((e) => e.id === experienceId);
          const bullet = exp?.bullets.find((b) => b.id === bulletId);
          if (bullet) {
            bullet.highlighted = !bullet.highlighted;
          }
        });
      },

      reorderBullets: (experienceId, bulletIds) => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (!doc) return;
          const exp = doc.data.experience.find((e) => e.id === experienceId);
          if (exp) {
            const bulletMap = new Map(exp.bullets.map((b) => [b.id, b]));
            exp.bullets = bulletIds.map((id) => bulletMap.get(id)!).filter(Boolean);
          }
        });
      },

      // Education
      addEducation: () => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (doc) {
            doc.data.education.push({
              id: generateId("edu"),
              institution: "",
              degree: "",
              field: "",
              location: "",
              startDate: "",
              endDate: "",
              highlights: [],
            });
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      updateEducation: (id, field, value) => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (!doc) return;
          const edu = doc.data.education.find((e) => e.id === id);
          if (edu) {
            (edu as Record<string, unknown>)[field] = value;
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      removeEducation: (id) => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (doc) {
            doc.data.education = doc.data.education.filter((e) => e.id !== id);
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      // Skills
      addSkillGroup: () => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (doc) {
            doc.data.skills.groups.push({ id: generateId("sg"), label: "New Category", skills: [] });
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      updateSkillGroupLabel: (groupId, label) => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (!doc) return;
          const group = doc.data.skills.groups.find((g) => g.id === groupId);
          if (group) {
            group.label = label;
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      removeSkillGroup: (groupId) => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (doc) {
            doc.data.skills.groups = doc.data.skills.groups.filter((g) => g.id !== groupId);
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      addSkill: (groupId, skill) => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (!doc) return;
          const group = doc.data.skills.groups.find((g) => g.id === groupId);
          if (group && !group.skills.includes(skill)) {
            group.skills.push(skill);
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      removeSkill: (groupId, skillIndex) => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (!doc) return;
          const group = doc.data.skills.groups.find((g) => g.id === groupId);
          if (group) {
            group.skills.splice(skillIndex, 1);
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      setSkillsDisplay: (display) => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (doc) {
            doc.data.skills.display = display;
          }
        });
      },

      // Projects
      addProject: () => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (doc) {
            doc.data.projects.push({
              id: generateId("proj"),
              name: "",
              description: "",
              url: "",
              technologies: [],
              bullets: [{ id: generateId("bullet"), content: "", highlighted: false }],
            });
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      updateProject: (id, field, value) => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (!doc) return;
          const proj = doc.data.projects.find((p) => p.id === id);
          if (proj) {
            (proj as Record<string, unknown>)[field] = value;
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      removeProject: (id) => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (doc) {
            doc.data.projects = doc.data.projects.filter((p) => p.id !== id);
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      addProjectBullet: (projectId) => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (!doc) return;
          const proj = doc.data.projects.find((p) => p.id === projectId);
          if (proj) {
            proj.bullets.push({ id: generateId("bullet"), content: "", highlighted: false });
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      updateProjectBullet: (projectId, bulletId, content) => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (!doc) return;
          const proj = doc.data.projects.find((p) => p.id === projectId);
          const bullet = proj?.bullets.find((b) => b.id === bulletId);
          if (bullet) {
            bullet.content = content;
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      removeProjectBullet: (projectId, bulletId) => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (!doc) return;
          const proj = doc.data.projects.find((p) => p.id === projectId);
          if (proj) {
            proj.bullets = proj.bullets.filter((b) => b.id !== bulletId);
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      // Certifications
      addCertification: () => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (doc) {
            doc.data.certifications.push({
              id: generateId("cert"),
              name: "",
              issuer: "",
              date: "",
              url: "",
            });
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      updateCertification: (id, field, value) => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (!doc) return;
          const cert = doc.data.certifications.find((c) => c.id === id);
          if (cert) {
            (cert as Record<string, string>)[field] = value;
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      removeCertification: (id) => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (doc) {
            doc.data.certifications = doc.data.certifications.filter((c) => c.id !== id);
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      // Languages
      addLanguage: () => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (doc) {
            doc.data.languages.push({
              id: generateId("lang"),
              language: "",
              proficiency: "Conversational",
            });
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      updateLanguage: (id, field, value) => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (!doc) return;
          const lang = doc.data.languages.find((l) => l.id === id);
          if (lang) {
            (lang as Record<string, string>)[field] = value;
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      removeLanguage: (id) => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (doc) {
            doc.data.languages = doc.data.languages.filter((l) => l.id !== id);
            doc.updatedAt = new Date().toISOString();
          }
        });
      },

      // Meta
      updateMeta: (field, value) => {
        set((state) => {
          const doc = state.activeDocumentId ? state.documents[state.activeDocumentId] : null;
          if (doc) {
            (doc.data.meta as Record<string, unknown>)[field] = value;
            doc.updatedAt = new Date().toISOString();
          }
        });
      },
    })),
    {
      name: "eureka-resume-builder",
      partialize: (state) => ({
        documents: state.documents,
        activeDocumentId: state.activeDocumentId,
        savedVersions: state.savedVersions,
      }),
    }
  )
);
