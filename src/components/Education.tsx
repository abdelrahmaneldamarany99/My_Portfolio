import React from 'react';
import { GraduationCap, Award, Globe, Cpu } from 'lucide-react';
import type { Language } from '../types/index.ts';
import { translations } from '../data/translations.ts';

interface EducationProps {
  language: Language;
}

interface CertificationLocalized {
  title: Record<Language, string>;
  issuer: string;
  description: Record<Language, string>;
}

const certifications: CertificationLocalized[] = [
  {
    title: {
      en: 'React Nanodegree',
      ar: 'درجة النانو المتقدمة في React (React Nanodegree)',
    },
    issuer: 'Udacity',
    description: {
      en: 'Comprehensive specialization covering React fundamentals, Redux architecture, React Native mobile patterns, and performance tuning.',
      ar: 'تخصص شامل يغطي أساسيات React المتقدمة، معمارية Redux، تطبيقات React Native للهواتف، وضبط وتحسين الأداء.',
    },
  },
  {
    title: {
      en: 'JavaScript Algorithms and Data Structures',
      ar: 'الخوارزميات وهياكل البيانات بلغة JavaScript',
    },
    issuer: 'freeCodeCamp',
    description: {
      en: 'Algorithm scripting, complex data structure implementations, and object-oriented programming paradigms in ES6+.',
      ar: 'بناء وبرمجة الخوارزميات، وتطبيق هياكل البيانات المعقدة، والبرمجة كائنية التوجه (OOP) في بيئة ES6+.',
    },
  },
  {
    title: {
      en: 'Advanced Styling with Responsive Design',
      ar: 'التنسيقات المتقدمة والتصميم المتجاوب (Responsive Design)',
    },
    issuer: 'Coursera',
    description: {
      en: 'Multi-device media query strategies, fluid typography calculations, CSS Grid, and responsive layout engineering.',
      ar: 'استراتيجيات استعلامات الوسائط للأجهزة المتعددة، حسابات الطباعة السلسة، CSS Grid، وهندسة التخطيطات المتجاوبة.',
    },
  },
  {
    title: {
      en: 'Interactivity with JavaScript',
      ar: 'التفاعلية المتقدمة بلغة JavaScript',
    },
    issuer: 'Coursera',
    description: {
      en: 'Asynchronous event listeners, DOM tree manipulation, interactive state mutation, and browser accessibility.',
      ar: 'مستمعات الأحداث غير المتزامنة، معالجة وتعديل شجرة الـ DOM، إدارة الحالة التفاعلية، ومعايير إمكانية الوصول في المتصفح.',
    },
  },
];

export function Education({ language }: EducationProps) {
  const t = translations[language].education;

  return (
    <section id="education" className="py-20 border-b dark:border-white/10 border-slate-200 relative transition-colors">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="dark:bg-[#0D1424] bg-white border dark:border-white/10 border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm transition-colors">
              <div className="flex items-center gap-3 pb-6 border-b dark:border-white/10 border-slate-200">
                <div className="p-2.5 bg-blue-600/10 border border-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold dark:text-white text-slate-900">
                    {t.degreeTitle}
                  </h3>
                  <div className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">
                    {t.institute}
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-4">
                <div className="dark:bg-slate-900/70 bg-slate-50 border dark:border-white/5 border-slate-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                    <Cpu className="w-4 h-4" />
                    <span>{t.graduationProjectTitle}</span>
                  </div>
                  <p className="text-sm dark:text-slate-300 text-slate-600 leading-relaxed">
                    {t.graduationProjectDesc}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4 text-xs font-mono dark:text-slate-400 text-slate-600">
                    <span className="dark:bg-slate-950 bg-white px-2.5 py-1 rounded border dark:border-white/5 border-slate-200">C++</span>
                    <span className="dark:bg-slate-950 bg-white px-2.5 py-1 rounded border dark:border-white/5 border-slate-200">Dual Microcontrollers</span>
                    <span className="dark:bg-slate-950 bg-white px-2.5 py-1 rounded border dark:border-white/5 border-slate-200">L298N Motor Drivers</span>
                    <span className="dark:bg-slate-950 bg-white px-2.5 py-1 rounded border dark:border-white/5 border-slate-200">Embedded Robotics</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="dark:bg-slate-900/40 bg-slate-50 p-4 rounded-xl border dark:border-white/5 border-slate-200">
                    <div className="flex items-center gap-2 text-xs dark:text-slate-400 text-slate-500 mb-1">
                      <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>{t.arabicLang}</span>
                    </div>
                    <div className="text-sm font-semibold dark:text-white text-slate-900">{t.arabicLevel}</div>
                  </div>
                  <div className="dark:bg-slate-900/40 bg-slate-50 p-4 rounded-xl border dark:border-white/5 border-slate-200">
                    <div className="flex items-center gap-2 text-xs dark:text-slate-400 text-slate-500 mb-1">
                      <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>{t.englishLang}</span>
                    </div>
                    <div className="text-sm font-semibold dark:text-white text-slate-900">{t.englishLevel}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider dark:text-slate-400 text-slate-600 mb-2">
              {t.certificationsBadge}
            </div>
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                className="dark:bg-[#0D1424] bg-white border dark:border-white/10 border-slate-200 rounded-xl p-5 shadow-sm transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <h4 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>{cert.title[language]}</span>
                  </h4>
                  <span className="text-xs font-mono dark:text-slate-400 text-slate-500 shrink-0">{cert.issuer}</span>
                </div>
                <p className="text-xs dark:text-slate-300 text-slate-600 leading-relaxed mt-2">
                  {cert.description[language]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
