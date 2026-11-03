import React from 'react';
import { Calendar, CheckCircle2, Building2 } from 'lucide-react';
import type { Language } from '../types/index.ts';
import { translations } from '../data/translations.ts';

interface ExperienceProps {
  language: Language;
}

interface ExperienceItemLocalized {
  id: string;
  role: string;
  companyOrType: string;
  period: string;
  responsibilities: string[];
  highlightProjects: string[];
}

const experienceData: Record<Language, ExperienceItemLocalized[]> = {
  en: [
    {
      id: 'exp-1',
      role: 'React / Next.js / Full-Stack (MERN) Developer',
      companyOrType: 'Capital Numbers',
      period: 'Jan 2024 – Jan 2026',
      responsibilities: [
        'Developed React and Next.js applications with end-to-end feature ownership using TypeScript, Zustand, Redux, and Redux Toolkit.',
        'Built reusable frontend architectures, integrated RESTful APIs, and developed responsive interfaces.',
        'Improved application performance using code splitting, lazy loading, memoization, and other optimization techniques.',
      ],
      highlightProjects: [
        'Task Management System (React • Node.js • Express.js • MongoDB • JWT)',
        'Nana Food (React • TypeScript • Zustand • Tailwind CSS • Google Maps)',
        'Smart Mall Management System (Next.js • TypeScript • AI Chatbot)',
        'ShopSphere (React • TypeScript • Supabase • Context API • Tailwind CSS)',
        'Business Operations Dashboard (React • TypeScript • Node.js • Redux)',
      ],
    },
    {
      id: 'exp-2',
      role: 'React / Full-Stack (MERN) Developer',
      companyOrType: 'Spectragold',
      period: 'Dec 2020 – Nov 2023',
      responsibilities: [
        'Developed full-stack web applications using React, Node.js, Express.js, and MongoDB.',
        'Built reusable components, frontend architectures, state management solutions, RESTful APIs, and database models.',
        'Delivered responsive, maintainable applications independently with a focus on code quality and performance.',
      ],
      highlightProjects: [
        'Shopping Platform (MERN Stack • Context API • Bootstrap)',
        'Repository Listing Explorer (React • Sass • Redux • REST API)',
        'E-commerce Store (React • Firebase)',
        'Online Books Library (MERN Stack • Redux • Bootstrap)',
      ],
    },
    {
      id: 'exp-3',
      role: 'Independent / Self-Employed React / Full-Stack / Next.js Developer',
      companyOrType: 'Self-Employed / Consulting',
      period: 'Jan 2019 – Dec 2020 & Jan 2026 – Present',
      responsibilities: [
        'Developed responsive web applications and interactive UI solutions using React, JavaScript, Node.js, and Next.js.',
        'Converted Figma designs into responsive, production-ready interfaces using reusable components and modern UI practices.',
        'Worked independently across implementation, debugging, optimization, and project delivery.',
      ],
      highlightProjects: [
        'Medical PDF Generator Dashboard (React • Node.js • React Table)',
        'Jerash Festival Platform (React • Bootstrap)',
        'Location-Based Landmarks Application (Next.js • TypeScript • Supabase • Context API • Tailwind CSS)',
        'STI Sports Store (Vanilla JavaScript • Bootstrap)',
      ],
    },
  ],
  ar: [
    {
      id: 'exp-1',
      role: 'مطور React / Next.js / Full-Stack (MERN)',
      companyOrType: 'كابيتال نمبرز (Capital Numbers)',
      period: 'يناير 2024 – يناير 2026',
      responsibilities: [
        'تطوير تطبيقات React و Next.js متكاملة مع ملكية كاملة للمزايا باستخدام TypeScript و Zustand و Redux و Redux Toolkit.',
        'بناء معماريات واجهات أمامية قابلة لإعادة الاستخدام، ودمج واجهات RESTful API، وتطوير واجهات مستخدم تفاعلية متجاوبة.',
        'تحسين أداء وسرعة التطبيقات عبر تقنيات Code Splitting، والتحميل الكسول (Lazy Loading)، وتقنيات الـ Memoization.',
      ],
      highlightProjects: [
        'نظام إدارة المهام (Task Management System: React • Node.js • Express.js • MongoDB • JWT)',
        'تطبيق نانا فود (Nana Food: React • TypeScript • Zustand • Tailwind CSS • Google Maps)',
        'منصة إدارة المولات الذكية (Smart Mall Management: Next.js • TypeScript • AI Chatbot)',
        'متجر شوب سفير (ShopSphere: React • TypeScript • Supabase • Context API • Tailwind CSS)',
        'لوحة معلومات العمليات والشركات (Business Operations Dashboard: React • TypeScript • Node.js • Redux)',
      ],
    },
    {
      id: 'exp-2',
      role: 'مطور تطبيقات React / Full-Stack (MERN)',
      companyOrType: 'سبكتراجولد (Spectragold)',
      period: 'ديسمبر 2020 – نوفمبر 2023',
      responsibilities: [
        'تطوير تطبيقات ويب متكاملة Full-Stack باستخدام React و Node.js و Express.js و MongoDB.',
        'بناء مكوّنات قابلة لإعادة الاستخدام، ومعماريات واجهات، وحلول إدارة الحالة، وواجهات RESTful API، ونماذج قواعد البيانات.',
        'تسليم تطبيقات متجاوبة وقابلة للصيانة باستقلالية تامة مع التركيز على جودة الكود والأداء العالي.',
      ],
      highlightProjects: [
        'منصة التسوق (Shopping Platform: MERN Stack • Context API • Bootstrap)',
        'مستكشف مستودعات الأكواد (Repository Listing Explorer: React • Sass • Redux • REST API)',
        'متجر إلكتروني متجاوب (E-commerce Store: React • Firebase)',
        'مكتبة الكتب الإلكترونية (Online Books Library: MERN Stack • Redux • Bootstrap)',
      ],
    },
    {
      id: 'exp-3',
      role: 'مطور React / Full-Stack / Next.js مستقل / عمل حر',
      companyOrType: 'عمل حر واستشارات برمجية مستقلة',
      period: 'يناير 2019 – ديسمبر 2020 & يناير 2026 – الحاضر',
      responsibilities: [
        'تطوير تطبيقات ويب متجاوبة وحلول واجهات تفاعلية باستخدام React و JavaScript و Node.js و Next.js.',
        'تحويل تصاميم Figma إلى واجهات برمجية متجاوبة وجاهزة للإنتاج باستخدام مكونات قابلة لإعادة الاستخدام وممارسات UI حديثة.',
        'العمل باستقلالية تامة عبر مراحل التنفيذ والبرمجة، وتصحيح الأخطاء، وتحسين الأداء، وتسليم المشاريع.',
      ],
      highlightProjects: [
        'لوحة استخراج التقارير الطبية (Medical PDF Generator Dashboard: React • Node.js • React Table)',
        'منصة مهرجان جرش (Jerash Festival Platform: React • Bootstrap)',
        'تطبيق المعالم الجغرافية الذكي (Location-Based Landmarks Application: Next.js • TypeScript • Supabase • Context API • Tailwind CSS)',
        'متجر المعدات الرياضية (STI Sports Store: Vanilla JavaScript • Bootstrap)',
      ],
    },
  ],
};

export function Experience({ language }: ExperienceProps) {
  const t = translations[language].experience;
  const list = experienceData[language];

  return (
    <section id="experience" className="py-20 border-b dark:border-white/10 border-slate-200 relative transition-colors">
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

        <div className="space-y-8">
          {list.map((exp) => (
            <div
              key={exp.id}
              className="dark:bg-[#0D1424] bg-white border dark:border-white/10 border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b dark:border-white/10 border-slate-200">
                <div>
                  <h3 className="text-xl font-bold dark:text-white text-slate-900">
                    {exp.role}
                  </h3>
                  <div className="flex items-center gap-2 text-xs dark:text-slate-400 text-slate-500 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>{exp.companyOrType}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono dark:text-slate-300 text-slate-700 dark:bg-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg border dark:border-white/10 border-slate-200 w-fit">
                  <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{exp.period}</span>
                </div>
              </div>

              <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider dark:text-slate-400 text-slate-600">
                    {t.keyResponsibilities}
                  </div>
                  <ul className="space-y-2.5">
                    {exp.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm dark:text-slate-300 text-slate-600 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-1" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lg:col-span-5 dark:bg-slate-900/60 bg-slate-50 p-5 rounded-xl border dark:border-white/5 border-slate-200">
                  <div className="text-xs font-semibold uppercase tracking-wider dark:text-slate-400 text-slate-600 mb-3">
                    {t.selectedDeliverables}
                  </div>
                  <ul className="space-y-2 text-xs dark:text-slate-300 text-slate-700 font-mono">
                    {exp.highlightProjects.map((proj, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-blue-600 dark:text-blue-400 font-bold">›</span>
                        <span>{proj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
