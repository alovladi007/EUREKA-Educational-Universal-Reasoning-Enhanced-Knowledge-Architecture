export interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'teacher' | 'admin' | 'parent'
  tier: 'hs' | 'ug' | 'grad' | 'med' | 'law' | 'mba' | 'eng'
  avatar?: string
  organizationId: string
}

export interface Course {
  id: string
  title: string
  description: string
  tier: string
  subject: string
  instructor: User
  enrollmentCount: number
  thumbnail?: string
  progress?: number
  startDate: string
  endDate: string
  status: 'draft' | 'published' | 'archived'
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  description: string
  type: 'video' | 'reading' | 'quiz' | 'lab' | 'discussion'
  duration: number
  order: number
  isCompleted?: boolean
  content: any
}

export interface Assessment {
  id: string
  courseId: string
  title: string
  description: string
  type: 'quiz' | 'exam' | 'assignment' | 'project'
  questions: Question[]
  timeLimit?: number
  dueDate: string
  totalPoints: number
  status: 'not_started' | 'in_progress' | 'submitted' | 'graded'
  score?: number
}

export interface Question {
  id: string
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'code'
  question: string
  options?: string[]
  correctAnswer?: any
  points: number
  explanation?: string
}

export interface TutorMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  context?: any
}

export interface LearningPath {
  id: string
  studentId: string
  courseId: string
  modules: LearningModule[]
  masteryLevel: number
  adaptiveRecommendations: string[]
}

export interface LearningModule {
  id: string
  title: string
  skills: Skill[]
  isUnlocked: boolean
  isCompleted: boolean
  masteryScore: number
}

export interface Skill {
  id: string
  name: string
  knowledgeState: 'unknown' | 'learning' | 'practiced' | 'mastered'
  probability: number
}

export interface Analytics {
  overallProgress: number
  timeSpent: number
  assignmentsCompleted: number
  averageScore: number
  strengths: string[]
  areasForImprovement: string[]
  engagementTrend: DataPoint[]
  performanceTrend: DataPoint[]
}

export interface DataPoint {
  date: string
  value: number
}

export interface Organization {
  id: string
  name: string
  type: 'school' | 'university' | 'professional'
  tier: string
  settings: any
}
