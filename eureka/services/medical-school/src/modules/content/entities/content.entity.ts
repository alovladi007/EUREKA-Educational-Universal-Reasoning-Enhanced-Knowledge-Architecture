/**
 * Content Entity - Base interface for all content types
 * Supports versioning, workflow states, and rich media
 */

export enum ContentType {
  MODULE = 'module',
  LESSON = 'lesson',
  OBJECTIVE = 'objective',
  CASE = 'case',
  ASSET = 'asset',
}

export enum WorkflowStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum AssetType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  FIGURE = 'figure',
  TABLE = 'table',
}

export interface ContentMetadata {
  tags: string[];
  keywords: string[];
  learningObjectives: string[];
  prerequisites?: string[];
  estimatedDuration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  specialty: string;
  systems: string[]; // organ systems
}

export interface Citation {
  id: string;
  type: 'book' | 'journal' | 'website' | 'guideline';
  authors: string[];
  title: string;
  year: number;
  journal?: string;
  volume?: string;
  pages?: string;
  doi?: string;
  url?: string;
  pubmedId?: string;
}

export interface Figure {
  id: string;
  caption: string;
  assetId: string;
  credits?: string;
  alt: string;
}

export interface Table {
  id: string;
  caption: string;
  headers: string[];
  rows: string[][];
  footnotes?: string;
}

export interface ContentVersion {
  version: number;
  content: string; // ProseMirror JSON or HTML
  editorState?: any; // ProseMirror state for recovery
  createdAt: Date;
  createdBy: string;
  changeLog: string;
  status: WorkflowStatus;
}

export interface Asset {
  id: string;
  type: AssetType;
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number; // bytes
  url: string; // MinIO signed URL
  thumbnailUrl?: string;
  metadata: {
    width?: number;
    height?: number;
    duration?: number; // for video/audio
    alt?: string;
    caption?: string;
  };
  createdAt: Date;
  createdBy: string;
}

export interface Content {
  id: string;
  type: ContentType;
  title: string;
  slug: string;

  // Current version
  currentVersion: number;
  status: WorkflowStatus;
  content: string; // Current content body

  // Versioning
  versions: ContentVersion[];

  // Metadata
  metadata: ContentMetadata;

  // Rich content elements
  citations: Citation[];
  figures: Figure[];
  tables: Table[];
  assets: Asset[];

  // Relationships
  parentId?: string; // For hierarchical content (e.g., lesson in module)
  relatedContent: string[]; // Related content IDs

  // Workflow
  author: string;
  reviewers: string[];
  approvedBy?: string;
  approvedAt?: Date;
  publishedAt?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface Module extends Omit<Content, 'type'> {
  type: ContentType.MODULE;
  lessons: string[]; // Lesson IDs
  sequence: number;
}

export interface Lesson extends Omit<Content, 'type'> {
  type: ContentType.LESSON;
  moduleId: string;
  sequence: number;
  glossaryTerms: GlossaryTerm[];
}

export interface Objective extends Omit<Content, 'type'> {
  type: ContentType.OBJECTIVE;
  bloomLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  assessable: boolean;
  linkedItems: string[]; // Question item IDs
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  relatedTerms: string[];
}
