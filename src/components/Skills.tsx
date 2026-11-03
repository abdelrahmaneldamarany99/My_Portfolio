import { Code, Server, Cpu, Brain, Wrench, ShieldCheck, Cloud, Terminal } from 'lucide-react';
import type { Language } from '../types/index.ts';
import { translations } from '../data/translations.ts';

interface SkillsProps {
  language: Language;
}

interface SkillCategory {
  title: Record<Language, string>;
  icon: React.ElementType;
  advanced: string[];
  proficient: string[];
  familiar: string[];
}

const skillCategories: SkillCategory[] = [
  {
    title: {
      en: 'Frontend Architecture & Engineering',
      ar: 'معمارية الواجهات الأمامية (Frontend Development)',
    },
    icon: Code,
    advanced: [
      'React (18/19)',
      'Next.js 13+ (App & Pages)',
      'State Management (Context API, Zustand, Redux, Redux Toolkit)',
      'Frontend Architecture & UI Development',
      'Performance Optimization (Code Splitting, Lazy Loading, Memoization)',
    ],
    proficient: [
      'TypeScript',
      'Tailwind CSS',
      'Responsive Web Design',
      'JavaScript DOM/BOM Manipulation',
      'Styled Components',
      'Regular Expressions',
      'Angular',
    ],
    familiar: ['Material UI', 'React Native', 'WordPress', 'Web Accessibility (WCAG)'],
  },
  {
    title: {
      en: 'Backend, APIs & Databases',
      ar: 'الواجهة الخلفية وقواعد البيانات (Backend & Databases)',
    },
    icon: Server,
    advanced: [
      'Node.js & Express.js',
      'RESTful API Development',
      'Express Middleware Architecture',
      'Centralized Error Handling',
      'MongoDB Querying, Filtering & Aggregation Pipeline',
    ],
    proficient: [
      'Nest.js',
      'Redis Caching',
      'Authentication & Authorization (JWT)',
      'Supabase & Firebase',
      'SQL / Relational Databases',
    ],
    familiar: ['Microservices Patterns', 'Database Sharding & Replication'],
  },
  {
    title: {
      en: 'Testing & Quality Assurance',
      ar: 'جودة البرمجيات والاختبارات الآلية (Testing & QA)',
    },
    icon: ShieldCheck,
    advanced: [
      'Unit Testing',
      'Integration Testing',
      'End-to-End (E2E) Testing',
      'Test Automation',
    ],
    proficient: [
      'Jest / Vitest Test Suites',
      'API Regression Testing',
      'Automated Mocking & Fixtures',
    ],
    familiar: ['Load & Stress Testing', 'Performance Profiling Tools'],
  },
  {
    title: {
      en: 'DevOps, Cloud & Collaboration',
      ar: 'العمليات السحابية وأدوات التطوير (DevOps & Cloud)',
    },
    icon: Cloud,
    advanced: [
      'CI/CD Pipeline Configuration & Automation',
      'Automated Build, Testing & Deployment Workflows',
      'Git, GitHub, npm, Yarn, Vite',
    ],
    proficient: [
      'AWS (EC2, S3, Lambda, RDS, SQS, EventBridge)',
      'Docker & Docker Compose',
      'Postman API Workflows',
      'Agile Methodologies & Remote Team Collaboration',
      'Code Reviews & Technical Documentation',
    ],
    familiar: ['Kubernetes Basics', 'Serverless Frameworks'],
  },
  {
    title: {
      en: 'AI, Machine Learning & Deep Learning',
      ar: 'الذكاء الاصطناعي وتعلم الآلة والتعلم العميق (AI & ML)',
    },
    icon: Brain,
    advanced: [
      'Python3 (Data Science & ML Ecosystem)',
      'Pandas, NumPy, Matplotlib, Seaborn',
      'Scikit-learn, XGBoost, LightGBM',
      'Data Preprocessing, Feature Engineering & EDA',
      'Classification, Regression & Clustering',
    ],
    proficient: [
      'PyTorch & TensorFlow',
      'Neural Networks, CNNs, RNNs, Keras',
      'LLM Integration, RAG Pipelines & Fine-Tuning',
      'Model Evaluation & Performance Analysis',
    ],
    familiar: ['JAX', 'Computer Vision Deployments', 'Vector Databases'],
  },
  {
    title: {
      en: 'Languages, Core CS & Developer Tooling',
      ar: 'اللغات الأساسية، علوم الحاسب وبيئات التطوير المتقدمة',
    },
    icon: Terminal,
    advanced: [
      'JavaScript (ES6+)',
      'TypeScript',
      'Problem Solving, Debugging & Algorithms',
      'Built-in Data Structures',
      'HTML5 & Modern CSS3',
      'Developer Tooling: VS Code, Linux Shell, Postman & Git',
    ],
    proficient: [
      'C++ (Embedded & Systems Programming)',
      'Object-Oriented Programming (OOP)',
      'Sass CSS Preprocessor',
    ],
    familiar: ['Custom Data Structure Implementations', 'Compiler Concepts'],
  },
];

export function Skills({ language }: SkillsProps) {
  const t = translations[language].skills;

  return (
    <section id="skills" className="py-20 border-b dark:border-white/10 border-slate-200 relative transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
            {t.badge}
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight dark:text-white text-slate-900">
            {t.title}
          </h2>
          <p className="text-sm sm:text-base dark:text-slate-400 text-slate-600 mt-2 max-w-xl">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="dark:bg-[#0D1424] bg-white border dark:border-white/10 border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2.5 pb-4 mb-4 border-b dark:border-white/10 border-slate-200">
                    <div className="p-2 bg-blue-600/10 border border-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold dark:text-white text-slate-900">
                      {cat.title[language]}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-[11px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                        {t.advanced}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.advanced.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-xs dark:bg-slate-900 bg-slate-100 border dark:border-white/10 border-slate-200 px-2.5 py-1 rounded-md dark:text-slate-200 text-slate-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-mono uppercase tracking-wider dark:text-slate-400 text-slate-500 mb-2">
                        {t.proficient}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.proficient.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-xs dark:bg-slate-900/60 bg-slate-50 border dark:border-white/5 border-slate-200 px-2.5 py-1 rounded-md dark:text-slate-300 text-slate-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-mono uppercase tracking-wider dark:text-slate-500 text-slate-400 mb-2">
                        {t.familiar}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.familiar.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[11px] dark:text-slate-400 text-slate-500 px-2 py-0.5 rounded border dark:border-white/5 border-slate-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
