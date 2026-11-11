import React from 'react';
import { Mail, Linkedin, Github, ArrowRight, Code2, Database, Brain, FileDown } from 'lucide-react';
import type { ProfileData, Language } from '../types/index.ts';
import { translations } from '../data/translations.ts';

interface HeroProps {
  profile: ProfileData;
  onOpenConsole: () => void;
  onOpenContact: () => void;
  onOpenVoiceAgent?: () => void;
  onNavigateToProjects?: () => void;
  language: Language;
}

export function Hero({
  profile,
  onOpenConsole,
  onOpenContact,
  onNavigateToProjects,
  language,
}: HeroProps) {
  const t = translations[language].hero;
  const isAr = language === 'ar';
  const cvDownloadUrl = '/assets/cv.pdf';

  return (
    <section className="relative pt-10 pb-16 md:pt-16 md:pb-20 border-b dark:border-white/10 border-slate-200 overflow-hidden transition-colors">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.12),rgba(255,255,255,0))] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>{t.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight dark:text-white text-slate-900 mb-5 leading-tight">
              {t.headline}
            </h1>

            <p className="text-base sm:text-lg dark:text-slate-300 text-slate-600 leading-relaxed mb-8">
              {t.description}
            </p>

            <div className="flex flex-wrap items-center gap-3.5 mb-8">
              <a
                href={cvDownloadUrl}
                download="Abdelrahman_Eldamarany_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2 whitespace-nowrap cursor-pointer active:scale-95"
                title={isAr ? 'تحميل السيرة الذاتية بصيغة PDF' : 'Download CV in PDF format'}
              >
                <FileDown className="w-4 h-4" />
                <span>{isAr ? 'تحميل السيرة الذاتية (PDF)' : 'Download CV (PDF)'}</span>
              </a>

              {onNavigateToProjects && (
                <button
                  onClick={onNavigateToProjects}
                  className="px-5 py-2.5 text-sm font-semibold dark:text-slate-200 text-slate-700 dark:bg-slate-900 bg-white hover:bg-slate-50 dark:hover:bg-slate-800 border dark:border-white/15 border-slate-300 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap shadow-xs cursor-pointer"
                >
                  <span>{isAr ? 'تصفح المشاريع والتحليلات' : 'Explore Projects & Stats'}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180 text-blue-500" />
                </button>
              )}

              <button
                onClick={onOpenContact}
                className="px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 border dark:border-white/10 border-slate-200 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <Mail className="w-4 h-4 text-blue-500" />
                <span>{t.contactMe}</span>
              </button>

              <button
                onClick={onOpenConsole}
                className="px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 border dark:border-white/10 border-slate-200 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <span>{t.launchConsole}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>

              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 dark:text-slate-300 text-slate-700 hover:text-blue-600 dark:bg-slate-900 bg-white hover:bg-slate-50 dark:hover:bg-slate-800 border dark:border-white/10 border-slate-300 rounded-lg transition-colors shadow-xs"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              {profile.github?.map((url, idx) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 dark:text-slate-300 text-slate-700 hover:text-blue-600 dark:bg-slate-900 bg-white hover:bg-slate-50 dark:hover:bg-slate-800 border dark:border-white/10 border-slate-300 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 text-xs font-mono"
                  title={idx === 0 ? 'GitHub (Personal & Core)' : 'GitHub (Capital Numbers)'}
                >
                  <Github className="w-4 h-4" />
                  <span className="hidden xl:inline text-[11px] text-slate-500 dark:text-slate-400">
                    {idx === 0 ? 'github' : 'github/cn'}
                  </span>
                </a>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs dark:text-slate-400 text-slate-500">
              <span>{profile.location}</span>
              <span aria-hidden="true">·</span>
              <span>{t.cairo}</span>
              <span aria-hidden="true">·</span>
              <a href={`tel:${profile.phone}`} className="hover:text-blue-600 dark:hover:text-slate-200 transition-colors font-mono">
                {profile.phone}
              </a>
              <span aria-hidden="true">·</span>
              <a href={`mailto:${profile.email}`} className="hover:text-blue-600 dark:hover:text-slate-200 transition-colors">
                {profile.email}
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="dark:bg-[#0D1526] bg-white border dark:border-white/10 border-slate-200 rounded-2xl p-6 shadow-xl dark:shadow-2xl relative transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b dark:border-white/10 border-slate-200">
                  <div className="text-xs font-mono font-medium dark:text-slate-300 text-slate-700 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>{t.runtimeSpec}</span>
                  </div>
                  <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{t.statusOk}</div>
                </div>

                <div className="space-y-3.5 text-xs font-mono">
                  <div className="dark:bg-slate-900/80 bg-slate-50 p-4 rounded-xl border dark:border-white/5 border-slate-200 flex items-center gap-4">
                    <div className="relative shrink-0 w-24 sm:w-28 aspect-[252/348] rounded-xl overflow-hidden ring-2 ring-blue-500/30 shadow-md bg-slate-900/20">
                      <img
                        src="/assets/profile-photo.png"
                        alt={language === 'ar' ? 'عبد الرحمن الضمراني' : 'Abdelrahman Eldamarany'}
                        className="w-full h-full object-cover object-center"
                      />
                      <span
                        className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 dark:ring-[#0D1526] ring-white"
                        title={language === 'ar' ? 'متاح للعمل' : 'Available for opportunities'}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="dark:text-slate-400 text-slate-500 text-[10px] uppercase tracking-wider mb-0.5">
                        {t.candidateProfile}
                      </div>
                      <div className="dark:text-white text-slate-900 font-bold text-sm sm:text-base truncate">
                        {language === 'ar' ? 'عبد الرحمن الضمراني' : 'Abdelrahman Eldamarany'}
                      </div>
                      <div className="dark:text-blue-400 text-blue-600 text-xs font-medium mt-0.5">
                        {t.roleTitle}
                      </div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="truncate">
                          {language === 'ar' ? 'متاح للعمل وتطوير الأنظمة' : 'Available for React / Next.JS / Full-Stack Roles'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="dark:bg-slate-900/80 bg-slate-50 p-3 rounded-lg border dark:border-white/5 border-slate-200">
                      <div className="dark:text-slate-400 text-slate-500 mb-1 flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>{t.dataEngine}</span>
                      </div>
                      <div className="dark:text-white text-slate-900 font-medium">MongoDB + Express</div>
                      <div className="text-emerald-600 dark:text-emerald-400 text-[11px] mt-0.5">{t.dataEngineDesc}</div>
                    </div>

                    <div className="dark:bg-slate-900/80 bg-slate-50 p-3 rounded-lg border dark:border-white/5 border-slate-200">
                      <div className="dark:text-slate-400 text-slate-500 mb-1 flex items-center gap-1.5">
                        <Brain className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                        <span>{t.aiBase}</span>
                      </div>
                      <div className="dark:text-white text-slate-900 font-medium">PyTorch, NLP, DL</div>
                      <div className="dark:text-slate-400 text-slate-500 text-[11px] mt-0.5">{t.aiBaseDesc}</div>
                    </div>
                  </div>

                  <div className="dark:bg-slate-900/80 bg-slate-50 p-3 rounded-lg border dark:border-white/5 border-slate-200">
                    <div className="dark:text-slate-400 text-slate-500 mb-1">{t.coreMethodology}</div>
                    <div className="dark:text-slate-300 text-slate-700 leading-relaxed font-sans text-xs">
                      {t.methodologyText}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t dark:border-white/10 border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono dark:text-white text-slate-900 tabular-nums">
              {t.yearsExp}
            </div>
            <div className="text-xs dark:text-slate-400 text-slate-500 mt-1">{t.yearsExpLabel}</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono dark:text-white text-slate-900 tabular-nums">
              {t.aiExp}
            </div>
            <div className="text-xs dark:text-slate-400 text-slate-500 mt-1">{t.aiExpLabel}</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono dark:text-white text-slate-900 tabular-nums">
              {t.shippedSystems}
            </div>
            <div className="text-xs dark:text-slate-400 text-slate-500 mt-1">{t.shippedSystemsLabel}</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono dark:text-white text-slate-900 tabular-nums">
              {t.ownership}
            </div>
            <div className="text-xs dark:text-slate-400 text-slate-500 mt-1">{t.ownershipLabel}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
