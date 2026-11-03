import React from 'react';
import { Github, Linkedin, Mail, ArrowUp, FileDown } from 'lucide-react';
import type { ProfileData, Language, AppView } from '../types/index.ts';
import { translations } from '../data/translations.ts';

interface FooterProps {
  profile: ProfileData;
  language: Language;
  onNavigateView?: (view: AppView) => void;
}

export function Footer({ profile, language, onNavigateView }: FooterProps) {
  const t = translations[language].footer;
  const nav = translations[language].nav;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks: { view: AppView; label: string }[] = [
    { view: 'overview', label: nav.overview },
    { view: 'projects', label: nav.projects },
    { view: 'experience', label: nav.experience },
    { view: 'skills', label: nav.techStack },
    { view: 'engineering', label: nav.engineering },
    { view: 'console', label: nav.console },
  ];

  return (
    <footer className="border-t dark:border-white/10 border-slate-200 dark:bg-[#070A12] bg-slate-100 py-10 text-xs dark:text-slate-400 text-slate-600 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b dark:border-white/5 border-slate-200">
          <div>
            <div className="font-bold dark:text-white text-slate-900 text-sm">
              {language === 'ar' ? 'عبد الرحمن الضمراني' : 'Abdelrahman Eldamarany'}
            </div>
            <p className="mt-1 dark:text-slate-400 text-slate-600">
              {t.role}
            </p>
          </div>

          {onNavigateView && (
            <div className="flex flex-wrap gap-3">
              {navLinks.map((item) => (
                <button
                  key={item.view}
                  onClick={() => onNavigateView(item.view)}
                  className="px-2.5 py-1 rounded-md text-xs font-medium dark:text-slate-300 text-slate-600 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-5 sm:gap-6">
            <a
              href="/assets/aistudio/CV_-_En_-PDF___Abd-el-rahman_El-damarany___86505470.pdf"
              download="Abdelrahman_Eldamarany_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:dark:text-white hover:text-blue-600 transition-colors flex items-center gap-1.5 font-medium text-blue-600 dark:text-blue-400"
              title="Download CV PDF"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تحميل السيرة الذاتية (PDF)' : 'Download CV (PDF)'}</span>
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:dark:text-white hover:text-blue-600 transition-colors flex items-center gap-1.5"
            >
              <Linkedin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>LinkedIn</span>
            </a>
            {profile.github?.map((url, idx) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="hover:dark:text-white hover:text-blue-600 transition-colors flex items-center gap-1.5"
              >
                <Github className="w-3.5 h-3.5" />
                <span>{idx === 0 ? 'GitHub' : 'GitHub (CN)'}</span>
              </a>
            ))}
            <a
              href={`mailto:${profile.email}`}
              className="hover:dark:text-white hover:text-blue-600 transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="hover:dark:text-white hover:text-blue-600 transition-colors flex items-center gap-1 dark:text-slate-500 text-slate-500 cursor-pointer"
            title="Scroll to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>{t.top}</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
