import React, { useState } from 'react';
import {
  Terminal,
  Sun,
  Moon,
  Globe,
  ShieldCheck,
  FolderGit2,
  FileDown,
  Layers,
  GraduationCap,
  Cpu,
  Mail,
  Menu,
  X,
} from 'lucide-react';
import type { Language, ThemeMode, AppView } from '../types/index.ts';
import type { ConsoleTab } from './ConsoleSuite.tsx';
import { translations } from '../data/translations.ts';

interface HeaderProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  onNavigateTab?: (tab: ConsoleTab) => void;
  onOpenContact: () => void;
  onOpenVoiceAgent?: () => void;
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  theme: ThemeMode;
  onToggleTheme: (theme: ThemeMode) => void;
}

export function Header({
  activeView,
  setActiveView,
  onNavigateTab,
  onOpenContact,
  language,
  onToggleLanguage,
  theme,
  onToggleTheme,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language].nav;
  const isDark = theme === 'dark';
  const isAr = language === 'ar';

  const navItems: { view: AppView; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { view: 'overview', label: t.overview, icon: Layers },
    { view: 'projects', label: t.projects, icon: FolderGit2 },
    { view: 'experience', label: t.experience, icon: GraduationCap },
    { view: 'skills', label: t.techStack, icon: Cpu },
    { view: 'engineering', label: t.engineering, icon: ShieldCheck },
    { view: 'console', label: t.console, icon: Terminal },
  ];

  const handleSelectView = (view: AppView) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    if (typeof window !== 'undefined') {
      window.location.hash = `#/${view}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const cvDownloadUrl = '/assets/aistudio/CV_-_En_-PDF___Abd-el-rahman_El-damarany___86505470.pdf';

  return (
    <header className="sticky top-0 z-40 dark:bg-[#090D16]/95 bg-white/95 backdrop-blur-md border-b dark:border-white/10 border-slate-200 transition-colors mr-[52px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-6">
        <a
          href="#/overview"
          onClick={(e) => {
            e.preventDefault();
            handleSelectView('overview');
          }}
          className="text-base sm:text-lg font-bold tracking-tight dark:text-white text-slate-900 hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden ring-1.5 ring-blue-500/40 shrink-0 bg-slate-200 dark:bg-slate-800 shadow-xs">
            <img
              src="/assets/aistudio/my_picture_5948e613.png"
              alt={language === 'ar' ? 'عبد الرحمن الضمراني' : 'Abdelrahman Eldamarany'}
              className="w-full h-full object-cover object-[center_35%]"
            />
          </div>
          <span>{language === 'ar' ? 'عبد الرحمن الضمراني' : 'Abdelrahman Eldamarany'}</span>
        </a>

        <nav className="hidden xl:flex items-center gap-1 text-sm font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => handleSelectView(item.view)}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer text-xs font-semibold ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 font-bold'
                    : 'dark:text-slate-300 text-slate-600 hover:dark:text-white hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={cvDownloadUrl}
            download="Abdelrahman_Eldamarany_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
            title={isAr ? 'تحميل السيرة الذاتية PDF المحدثة' : 'Download Updated CV (PDF)'}
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.downloadCv}</span>
            <span className="sm:hidden">CV</span>
          </a>

          <button
            onClick={() => onToggleLanguage(language === 'en' ? 'ar' : 'en')}
            className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold dark:bg-slate-900 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-slate-300 text-slate-700 border dark:border-white/10 border-slate-200 transition-colors cursor-pointer"
            title={language === 'en' ? 'Switch to Arabic' : 'التحويل للإنجليزية'}
          >
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-mono">{language === 'en' ? 'Ar' : 'EN'}</span>
          </button>

          <button
            onClick={() => onToggleTheme(isDark ? 'light' : 'dark')}
            className="p-1.5 sm:p-2 rounded-lg text-xs font-semibold dark:bg-slate-900 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-slate-300 text-slate-700 border dark:border-white/10 border-slate-200 transition-all cursor-pointer active:scale-95"
            title={
              isDark
                ? language === 'ar'
                  ? 'التحويل إلى الوضع الفاتح (Light Mode)'
                  : 'Switch to Light Mode'
                : language === 'ar'
                  ? 'التحويل إلى الوضع الداكن (Dark Mode)'
                  : 'Switch to Dark Mode'
            }
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          <button
            onClick={onOpenContact}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border dark:border-white/10 border-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-blue-500" />
            <span>{t.contact}</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border dark:border-white/10 border-slate-200 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="xl:hidden border-t dark:border-white/10 border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar bg-slate-50 dark:bg-slate-900/50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => handleSelectView(item.view)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {mobileMenuOpen && (
        <div className="xl:hidden border-t dark:border-white/10 border-slate-200 bg-white dark:bg-[#090D16] px-6 py-4 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => handleSelectView(item.view)}
                className={`w-full text-start px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-blue-500" />
                  <span>{item.label}</span>
                </div>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
              </button>
            );
          })}
          <div className="pt-2 border-t dark:border-white/10 border-slate-200 flex gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="flex-1 py-2 rounded-lg text-xs font-semibold text-center bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-blue-500" />
              <span>{t.contact}</span>
            </button>
            <a
              href={cvDownloadUrl}
              download="Abdelrahman_Eldamarany_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 rounded-lg text-xs font-semibold text-center bg-blue-600 text-white flex items-center justify-center gap-1.5"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{t.downloadCv}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
