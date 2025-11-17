import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as puppeteer from 'puppeteer';
import * as Diff from 'diff';
import {
  Content,
  ContentVersion,
  WorkflowStatus,
  ContentType,
  Module,
  Lesson,
} from '../entities/content.entity';
import { CreateContentDto, CreateModuleDto, CreateLessonDto } from '../dto/create-content.dto';
import { UpdateContentDto, UpdateWorkflowStatusDto } from '../dto/update-content.dto';

@Injectable()
export class ContentService {
  // In-memory storage (replace with database in production)
  private content: Map<string, Content> = new Map();

  /**
   * Create new content with initial version
   */
  create(createDto: CreateContentDto, authorId: string): Content {
    const slug = this.generateSlug(createDto.title);
    const contentId = uuidv4();

    const initialVersion: ContentVersion = {
      version: 1,
      content: createDto.content,
      createdAt: new Date(),
      createdBy: authorId,
      changeLog: createDto.changeLog || 'Initial version',
      status: createDto.status || WorkflowStatus.DRAFT,
    };

    const content: Content = {
      id: contentId,
      type: createDto.type,
      title: createDto.title,
      slug,
      currentVersion: 1,
      status: createDto.status || WorkflowStatus.DRAFT,
      content: createDto.content,
      versions: [initialVersion],
      metadata: createDto.metadata,
      citations: (createDto.citations || []).map((c) => ({ ...c, id: uuidv4() })),
      figures: [],
      tables: [],
      assets: [],
      parentId: createDto.parentId,
      relatedContent: createDto.relatedContent || [],
      author: authorId,
      reviewers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.content.set(contentId, content);
    return content;
  }

  /**
   * Create a module with lesson management
   */
  createModule(createDto: CreateModuleDto, authorId: string): Module {
    const baseContent = this.create(createDto, authorId) as Module;
    baseContent.lessons = [];
    baseContent.sequence = createDto.sequence;
    this.content.set(baseContent.id, baseContent);
    return baseContent;
  }

  /**
   * Create a lesson and link to module
   */
  createLesson(createDto: CreateLessonDto, authorId: string): Lesson {
    const module = this.content.get(createDto.moduleId) as Module;
    if (!module || module.type !== ContentType.MODULE) {
      throw new NotFoundException('Module not found');
    }

    const baseContent = this.create(createDto, authorId) as Lesson;
    baseContent.moduleId = createDto.moduleId;
    baseContent.sequence = createDto.sequence;
    baseContent.glossaryTerms = [];

    // Add lesson to module
    module.lessons.push(baseContent.id);
    this.content.set(module.id, module);
    this.content.set(baseContent.id, baseContent);

    return baseContent;
  }

  /**
   * Find all content with optional filtering
   */
  findAll(filters?: {
    type?: ContentType;
    status?: WorkflowStatus;
    author?: string;
    tags?: string[];
  }): Content[] {
    let results = Array.from(this.content.values());

    if (filters) {
      if (filters.type) {
        results = results.filter((c) => c.type === filters.type);
      }
      if (filters.status) {
        results = results.filter((c) => c.status === filters.status);
      }
      if (filters.author) {
        results = results.filter((c) => c.author === filters.author);
      }
      if (filters.tags && filters.tags.length > 0) {
        results = results.filter((c) =>
          filters.tags.some((tag) => c.metadata.tags.includes(tag)),
        );
      }
    }

    return results;
  }

  /**
   * Find one content by ID
   */
  findOne(id: string): Content {
    const content = this.content.get(id);
    if (!content) {
      throw new NotFoundException(`Content with ID ${id} not found`);
    }
    return content;
  }

  /**
   * Find content by slug
   */
  findBySlug(slug: string): Content {
    const content = Array.from(this.content.values()).find((c) => c.slug === slug);
    if (!content) {
      throw new NotFoundException(`Content with slug ${slug} not found`);
    }
    return content;
  }

  /**
   * Update content and create new version
   */
  update(id: string, updateDto: UpdateContentDto, userId: string): Content {
    const content = this.findOne(id);

    // Create new version if content changed
    if (updateDto.content && updateDto.content !== content.content) {
      const newVersion: ContentVersion = {
        version: content.currentVersion + 1,
        content: updateDto.content,
        createdAt: new Date(),
        createdBy: userId,
        changeLog: updateDto.changeLog || 'Content updated',
        status: content.status, // Keep current status for new version
      };

      content.versions.push(newVersion);
      content.currentVersion = newVersion.version;
      content.content = updateDto.content;
    }

    // Update other fields
    if (updateDto.title) {
      content.title = updateDto.title;
      content.slug = this.generateSlug(updateDto.title);
    }
    if (updateDto.metadata) {
      content.metadata = { ...content.metadata, ...updateDto.metadata };
    }
    if (updateDto.citations) {
      content.citations = updateDto.citations.map((c) => ({ ...c, id: uuidv4() }));
    }
    if (updateDto.relatedContent) {
      content.relatedContent = updateDto.relatedContent;
    }

    content.updatedAt = new Date();
    this.content.set(id, content);
    return content;
  }

  /**
   * Update workflow status with validation
   */
  updateWorkflowStatus(
    id: string,
    statusDto: UpdateWorkflowStatusDto,
    userId: string,
  ): Content {
    const content = this.findOne(id);

    // Validate workflow transitions
    this.validateWorkflowTransition(content.status, statusDto.status);

    const previousStatus = content.status;
    content.status = statusDto.status;
    content.updatedAt = new Date();

    // Handle specific workflow states
    switch (statusDto.status) {
      case WorkflowStatus.IN_REVIEW:
        if (!content.reviewers.includes(userId)) {
          content.reviewers.push(userId);
        }
        break;

      case WorkflowStatus.APPROVED:
        content.approvedBy = userId;
        content.approvedAt = new Date();
        break;

      case WorkflowStatus.PUBLISHED:
        if (previousStatus !== WorkflowStatus.APPROVED) {
          throw new BadRequestException('Content must be approved before publishing');
        }
        content.publishedAt = new Date();
        break;
    }

    this.content.set(id, content);
    return content;
  }

  /**
   * Get version history for content
   */
  getVersionHistory(id: string): ContentVersion[] {
    const content = this.findOne(id);
    return content.versions.sort((a, b) => b.version - a.version);
  }

  /**
   * Revert to a previous version
   */
  revertToVersion(id: string, version: number, userId: string): Content {
    const content = this.findOne(id);
    const targetVersion = content.versions.find((v) => v.version === version);

    if (!targetVersion) {
      throw new NotFoundException(`Version ${version} not found`);
    }

    // Create new version from old content
    const newVersion: ContentVersion = {
      version: content.currentVersion + 1,
      content: targetVersion.content,
      editorState: targetVersion.editorState,
      createdAt: new Date(),
      createdBy: userId,
      changeLog: `Reverted to version ${version}`,
      status: content.status,
    };

    content.versions.push(newVersion);
    content.currentVersion = newVersion.version;
    content.content = targetVersion.content;
    content.updatedAt = new Date();

    this.content.set(id, content);
    return content;
  }

  /**
   * Compare two versions
   */
  compareVersions(id: string, version1: number, version2: number) {
    const content = this.findOne(id);
    const v1 = content.versions.find((v) => v.version === version1);
    const v2 = content.versions.find((v) => v.version === version2);

    if (!v1 || !v2) {
      throw new NotFoundException('Version not found');
    }

    return {
      version1: v1,
      version2: v2,
      contentDiff: this.calculateDiff(v1.content, v2.content),
    };
  }

  /**
   * Search content with advanced filtering
   */
  search(
    query?: string,
    filters?: {
      type?: ContentType;
      status?: WorkflowStatus;
      tags?: string[];
      specialty?: string;
      difficulty?: string;
    },
  ): Content[] {
    let results = Array.from(this.content.values());

    // Apply keyword search if provided
    if (query && query.trim()) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(
        (c) =>
          c.title.toLowerCase().includes(lowerQuery) ||
          c.content.toLowerCase().includes(lowerQuery) ||
          c.metadata.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
          c.metadata.keywords.some((kw) => kw.toLowerCase().includes(lowerQuery)),
      );
    }

    // Apply filters if provided
    if (filters) {
      if (filters.type) {
        results = results.filter((c) => c.type === filters.type);
      }

      if (filters.status) {
        results = results.filter((c) => c.status === filters.status);
      }

      if (filters.tags && filters.tags.length > 0) {
        results = results.filter((c) =>
          filters.tags.some((tag) => c.metadata.tags.includes(tag)),
        );
      }

      if (filters.specialty) {
        results = results.filter(
          (c) =>
            c.metadata.specialty &&
            c.metadata.specialty.toLowerCase().includes(filters.specialty.toLowerCase()),
        );
      }

      if (filters.difficulty) {
        results = results.filter(
          (c) =>
            c.metadata.difficulty &&
            c.metadata.difficulty.toLowerCase() === filters.difficulty.toLowerCase(),
        );
      }
    }

    return results;
  }

  /**
   * Export content to PDF
   */
  async exportToPDF(id: string): Promise<Buffer> {
    const content = this.findOne(id);

    // Create HTML template for PDF
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${content.title}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px 20px;
            }
            h1 {
              color: #1a202c;
              border-bottom: 3px solid #3182ce;
              padding-bottom: 10px;
              margin-bottom: 30px;
            }
            h2 {
              color: #2d3748;
              margin-top: 30px;
              margin-bottom: 15px;
            }
            h3 {
              color: #4a5568;
              margin-top: 20px;
              margin-bottom: 10px;
            }
            p {
              margin-bottom: 15px;
            }
            ul, ol {
              margin-bottom: 15px;
              padding-left: 30px;
            }
            li {
              margin-bottom: 8px;
            }
            code {
              background-color: #f7fafc;
              padding: 2px 6px;
              border-radius: 3px;
              font-family: 'Courier New', monospace;
              font-size: 0.9em;
            }
            pre {
              background-color: #1a202c;
              color: #e2e8f0;
              padding: 16px;
              border-radius: 6px;
              overflow-x: auto;
              margin-bottom: 20px;
            }
            pre code {
              background-color: transparent;
              color: inherit;
              padding: 0;
            }
            blockquote {
              border-left: 4px solid #3182ce;
              padding-left: 20px;
              margin-left: 0;
              font-style: italic;
              color: #4a5568;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #e2e8f0;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #f7fafc;
              font-weight: 600;
            }
            img {
              max-width: 100%;
              height: auto;
              border-radius: 6px;
              margin: 20px 0;
            }
            .metadata {
              background-color: #f7fafc;
              padding: 20px;
              border-radius: 6px;
              margin-bottom: 30px;
              font-size: 0.9em;
            }
            .metadata-item {
              margin-bottom: 8px;
            }
            .metadata-label {
              font-weight: 600;
              color: #2d3748;
            }
            .footer {
              margin-top: 50px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              font-size: 0.85em;
              color: #718096;
            }
          </style>
        </head>
        <body>
          <div class="metadata">
            <div class="metadata-item">
              <span class="metadata-label">Type:</span> ${content.type}
            </div>
            <div class="metadata-item">
              <span class="metadata-label">Status:</span> ${content.status}
            </div>
            ${content.metadata.specialty ? `
            <div class="metadata-item">
              <span class="metadata-label">Specialty:</span> ${content.metadata.specialty}
            </div>
            ` : ''}
            ${content.metadata.tags.length > 0 ? `
            <div class="metadata-item">
              <span class="metadata-label">Tags:</span> ${content.metadata.tags.join(', ')}
            </div>
            ` : ''}
            <div class="metadata-item">
              <span class="metadata-label">Last Updated:</span> ${content.updatedAt.toLocaleDateString()}
            </div>
          </div>

          <h1>${content.title}</h1>

          ${content.content}

          ${content.citations.length > 0 ? `
            <div class="footer">
              <h3>References</h3>
              <ol>
                ${content.citations.map(citation => `
                  <li>
                    ${citation.authors.join(', ')}. (${citation.year}).
                    <em>${citation.title}</em>. ${citation.journal || ''}
                    ${citation.url ? ` <a href="${citation.url}">${citation.url}</a>` : ''}
                  </li>
                `).join('')}
              </ol>
            </div>
          ` : ''}

          <div class="footer">
            <p>Generated on ${new Date().toLocaleString()}</p>
            <p>EUREKA Medical Education Platform</p>
          </div>
        </body>
      </html>
    `;

    // Launch headless browser and generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm',
        },
        printBackground: true,
        preferCSSPageSize: true,
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }

  /**
   * Delete content
   */
  remove(id: string): void {
    const content = this.findOne(id);

    // If it's a module, check for orphaned lessons
    if (content.type === ContentType.MODULE) {
      const module = content as Module;
      if (module.lessons && module.lessons.length > 0) {
        throw new BadRequestException(
          'Cannot delete module with lessons. Delete lessons first.',
        );
      }
    }

    // If it's a lesson, remove from parent module
    if (content.type === ContentType.LESSON) {
      const lesson = content as Lesson;
      const module = this.content.get(lesson.moduleId) as Module;
      if (module) {
        module.lessons = module.lessons.filter((lid) => lid !== id);
        this.content.set(module.id, module);
      }
    }

    this.content.delete(id);
  }

  // ========== Private Helper Methods ==========

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  private validateWorkflowTransition(from: WorkflowStatus, to: WorkflowStatus): void {
    const validTransitions: Record<WorkflowStatus, WorkflowStatus[]> = {
      [WorkflowStatus.DRAFT]: [
        WorkflowStatus.IN_REVIEW,
        WorkflowStatus.ARCHIVED,
      ],
      [WorkflowStatus.IN_REVIEW]: [
        WorkflowStatus.DRAFT,
        WorkflowStatus.APPROVED,
        WorkflowStatus.ARCHIVED,
      ],
      [WorkflowStatus.APPROVED]: [
        WorkflowStatus.PUBLISHED,
        WorkflowStatus.DRAFT,
        WorkflowStatus.ARCHIVED,
      ],
      [WorkflowStatus.PUBLISHED]: [
        WorkflowStatus.DRAFT,
        WorkflowStatus.ARCHIVED,
      ],
      [WorkflowStatus.ARCHIVED]: [
        WorkflowStatus.DRAFT,
      ],
    };

    if (!validTransitions[from]?.includes(to)) {
      throw new BadRequestException(
        `Invalid workflow transition from ${from} to ${to}`,
      );
    }
  }

  /**
   * Calculate detailed diff between two content versions
   * Uses word-level diffing for better readability
   */
  private calculateDiff(content1: string, content2: string): any {
    const diff = Diff.diffWords(content1, content2);

    const changes = diff.map(part => ({
      added: part.added || false,
      removed: part.removed || false,
      value: part.value,
      count: part.count || 0,
    }));

    const summary = {
      additions: diff
        .filter(p => p.added)
        .reduce((sum, p) => sum + (p.count || 0), 0),
      deletions: diff
        .filter(p => p.removed)
        .reduce((sum, p) => sum + (p.count || 0), 0),
      unchanged: diff
        .filter(p => !p.added && !p.removed)
        .reduce((sum, p) => sum + (p.count || 0), 0),
      totalChanges: diff.filter(p => p.added || p.removed).length,
    };

    return {
      changes,
      summary,
      hasChanges: summary.additions > 0 || summary.deletions > 0,
    };
  }
}
