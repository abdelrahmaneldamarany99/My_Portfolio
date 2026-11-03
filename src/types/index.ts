export interface Project {
  _id: string;
  title: string;
  slug: string;
  role: string;
  timeline: string;
  category: 'mern' | 'nextjs' | 'ai' | 'fullstack';
  summary: string;
  description: string;
  techStack: string[];
  architectureHighlights: string[];
  keyFeatures: string[];
  databaseDesign: string;
  githubUrl?: string;
  liveUrl?: string;
  metrics?: { label: string; value: string }[];
}

export type TerminalTheme = 'cobalt' | 'retro-green';
export type Language = 'en' | 'ar';
export type ThemeMode = 'dark' | 'light';
export type AppView = 'overview' | 'projects' | 'experience' | 'skills' | 'engineering' | 'console';

export type TicketStatus = 'todo' | 'in_progress' | 'qa' | 'done';
export type TicketPriority = 'urgent' | 'high' | 'medium' | 'low';
export type TicketType = 'feature' | 'bug' | 'refactor' | 'perf';

export interface Ticket {
  _id: string;
  key: string;
  title: string;
  description: string;
  type: TicketType;
  priority: TicketPriority;
  status: TicketStatus;
  assignee: string;
  estimatedHours: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CommitDiff {
  file: string;
  status: 'modified' | 'added' | 'deleted';
  additions: number;
  deletions: number;
  patch: string;
}

export interface Commit {
  _id: string;
  hash: string;
  shortHash: string;
  message: string;
  author: string;
  date: string;
  branch: string;
  filesChanged: number;
  insertions: number;
  deletions: number;
  diffs: CommitDiff[];
}

export interface TestResult {
  id: string;
  suite: string;
  name: string;
  category: 'backend' | 'database' | 'integration' | 'performance';
  status: 'passed' | 'failed';
  durationMs: number;
  assertion: string;
  error?: string;
}

export interface ArchitectureDoc {
  _id: string;
  id: string;
  title: string;
  category: 'system' | 'database' | 'security' | 'api';
  summary: string;
  content: string;
  asciiDiagram?: string;
  endpoints?: {
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    path: string;
    description: string;
    samplePayload?: Record<string, unknown>;
  }[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  companyOrType: string;
  period: string;
  isCurrent?: boolean;
  responsibilities: string[];
  highlightProjects: string[];
}

export interface ProfileData {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string[];
  summary: string;
  stats: {
    yearsExperience: string;
    mlExperience: string;
    completedProjects: string;
    architectureType: string;
  };
}
