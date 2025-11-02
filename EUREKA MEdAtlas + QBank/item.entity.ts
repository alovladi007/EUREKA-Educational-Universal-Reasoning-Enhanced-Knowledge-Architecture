import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum ItemType {
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay',
  CLINICAL_VIGNETTE = 'clinical_vignette',
}

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  VERY_HARD = 'very_hard',
}

export interface ItemOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface ItemContent {
  stem: string;
  vignette?: string;
  options: ItemOption[];
  correctAnswers: string[];
  explanation: string;
  references?: string[];
}

@Entity('qbank_items')
@Index(['orgId', 'isActive'])
@Index(['tags'], { fulltext: true })
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  orgId: string;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  authorId: string;

  @Column({ type: 'enum', enum: ItemType })
  type: ItemType;

  @Column({ type: 'enum', enum: DifficultyLevel, default: DifficultyLevel.MEDIUM })
  difficultyLevel: DifficultyLevel;

  @Column({ type: 'jsonb' })
  content: ItemContent;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @Column('text', { array: true, default: [] })
  learningObjectives: string[];

  @Column({ type: 'text', nullable: true })
  blueprint: string;

  // IRT Parameters
  @Column({ type: 'float', default: 0.0, comment: 'IRT difficulty parameter (-3 to +3)' })
  difficulty: number;

  @Column({ type: 'float', default: 1.0, comment: 'IRT discrimination parameter (0 to 2+)' })
  discrimination: number;

  @Column({ type: 'float', default: 0.25, comment: 'IRT guessing parameter (0 to 1)' })
  guessing: number;

  // Analytics
  @Column({ type: 'int', default: 0 })
  timesUsed: number;

  @Column({ type: 'int', default: 0 })
  timesCorrect: number;

  @Column({ type: 'float', default: 0.0 })
  averageTimeSeconds: number;

  @Column({ type: 'float', nullable: true })
  pointBiserial: number;

  // Status
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isReviewed: boolean;

  @Column({ type: 'uuid', nullable: true })
  reviewedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  // Computed field for p-value (proportion correct)
  get pValue(): number {
    return this.timesUsed > 0 ? this.timesCorrect / this.timesUsed : 0;
  }

  // Computed field for quality index
  get qualityIndex(): number {
    // Combine multiple quality metrics
    const pValueScore = Math.abs(this.pValue - 0.7) < 0.2 ? 1 : 0.5;
    const discriminationScore = this.discrimination > 0.3 ? 1 : 0.5;
    const usageScore = Math.min(this.timesUsed / 100, 1);
    return (pValueScore + discriminationScore + usageScore) / 3;
  }
}
