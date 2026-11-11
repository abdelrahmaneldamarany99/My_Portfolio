import React, { useState, useEffect, lazy, Suspense } from 'react';
import type {
  ProfileData,
  Project,
  Ticket,
  Commit,
  ArchitectureDoc,
  Language,
  ThemeMode,
  AppView,
} from './types/index.ts';
import {
  fetchProfile,
  fetchProjects,
  fetchTickets,
  fetchCommits,
  fetchDocs,
} from './services/api.ts';
import { fallbackProfile } from './data/fallback.ts';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { Projects } from './components/Projects.tsx';
import { EngineeringRigor } from './components/EngineeringRigor.tsx';
import { ProjectModal } from './components/ProjectModal.tsx';
import { Experience } from './components/Experience.tsx';
import { Skills } from './components/Skills.tsx';
import { Education } from './components/Education.tsx';
import type { ConsoleTab } from './components/ConsoleSuite.tsx';
import { ContactModal } from './components/ContactModal.tsx';
import { Footer } from './components/Footer.tsx';
import { ArrowRight, FolderGit2, ShieldCheck, Milestone, Terminal, FileDown } from 'lucide-react';

const ProjectEngagementStats = lazy(() =>
  import('./components/ProjectEngagementStats.tsx').then((m) => ({ default: m.ProjectEngagementStats }))
);
const ConsoleSuite = lazy(() =>
  import('./components/ConsoleSuite.tsx').then((m) => ({ default: m.ConsoleSuite }))
);
const LiveVoiceAgent = lazy(() =>
  import('./components/LiveVoiceAgent.tsx').then((m) => ({ default: m.LiveVoiceAgent }))
);
const GeminiChatbot = lazy(() =>
  import('./components/GeminiChatbot.tsx').then((m) => ({ default: m.GeminiChatbot }))
);

function SectionFallback() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
    </div>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState<AppView>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (['overview', 'projects', 'experience', 'skills', 'engineering', 'console'].includes(hash)) {
        return hash as AppView;
      }
    }
    return 'overview';
  });

  const [consoleTab, setConsoleTab] = useState<ConsoleTab>('tests');
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio-language') as Language | null;
      if (saved === 'en' || saved === 'ar') return saved;
    }
    return 'en';
  });
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio-theme') as ThemeMode | null;
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'dark';
  });

  const [profile, setProfile] = useState<ProfileData>(fallbackProfile);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [docs, setDocs] = useState<ArchitectureDoc[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isVoiceAgentOpen, setIsVoiceAgentOpen] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    try {
      localStorage.setItem('portfolio-language', language);
    } catch {
      void 0;
    }
  }, [language]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch {
      void 0;
    }
  }, [theme]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (['overview', 'projects', 'experience', 'skills', 'engineering', 'console'].includes(hash)) {
        setActiveView(hash as AppView);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [profData, projData, tickData, commData, docData] = await Promise.all([
          fetchProfile().catch(() => fallbackProfile),
          fetchProjects().catch(() => []),
          fetchTickets().catch(() => []),
          fetchCommits().catch(() => []),
          fetchDocs().catch(() => []),
        ]);

        if (isMounted) {
          if (profData) setProfile(profData);
          if (projData) setProjects(projData);
          if (tickData) setTickets(tickData);
          if (commData) setCommits(commData);
          if (docData) setDocs(docData);
        }
      } catch {
        void 0;
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshTickets = async () => {
    try {
      const refreshed = await fetchTickets();
      setTickets(refreshed);
    } catch {
      void 0;
    }
  };

  const navigateToView = (view: AppView) => {
    setActiveView(view);
    if (typeof window !== 'undefined') {
      window.location.hash = `#/${view}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateToConsoleTab = (tab: ConsoleTab) => {
    setConsoleTab(tab);
    navigateToView('console');
  };

  const isAr = language === 'ar';
  const cvDownloadUrl = '/assets/cv.pdf';

  return (
    <div className="min-h-screen dark:bg-[#090D16] bg-[#F8FAFC] dark:text-[#F1F5F9] text-[#0F172A] flex flex-col font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200">
      <Header
        activeView={activeView}
        setActiveView={navigateToView}
        onNavigateTab={navigateToConsoleTab}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenVoiceAgent={() => setIsVoiceAgentOpen(true)}
        language={language}
        onToggleLanguage={setLanguage}
        theme={theme}
        onToggleTheme={setTheme}
      />

      <main className="flex-1">
        {activeView === 'overview' && (
          <div className="space-y-16 pb-20">
            <Hero
              profile={profile}
              onOpenConsole={() => navigateToConsoleTab('tests')}
              onOpenContact={() => setIsContactOpen(true)}
              onOpenVoiceAgent={() => setIsVoiceAgentOpen(true)}
              onNavigateToProjects={() => navigateToView('projects')}
              language={language}
            />

            <section className="max-w-7xl mx-auto px-6">
              <div className="flex items-center justify-between mb-8 pb-4 border-b dark:border-white/10 border-slate-200">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                    {isAr ? 'المشاريع المميزة' : 'Featured Case Studies'}
                  </div>
                  <h2 className="text-2xl font-bold dark:text-white text-slate-900">
                    {isAr ? 'أحدث النظم والتطبيقات المسلّمة' : 'Latest Shipped Web Applications'}
                  </h2>
                </div>
                <button
                  onClick={() => navigateToView('projects')}
                  className="hidden sm:flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  <span>{isAr ? 'عرض جميع المشاريع والإحصائيات' : 'View All Projects & Stats'}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.slice(0, 3).map((proj) => (
                  <div
                    key={proj._id}
                    className="p-6 rounded-2xl dark:bg-[#0D1526] bg-white border dark:border-white/10 border-slate-200 hover:border-blue-500/40 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="px-2.5 py-0.5 rounded-full font-mono uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">
                          {proj.category}
                        </span>
                        <span className="dark:text-slate-400 text-slate-500">{proj.timeline}</span>
                      </div>
                      <h3 className="text-lg font-bold dark:text-white text-slate-900 mb-2">
                        {proj.title}
                      </h3>
                      <p className="text-xs dark:text-slate-300 text-slate-600 leading-relaxed mb-4 line-clamp-3">
                        {proj.summary}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {proj.techStack.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded text-[11px] font-mono dark:bg-slate-800 bg-slate-100 dark:text-slate-300 text-slate-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedProject(proj)}
                      className="w-full py-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors cursor-pointer"
                    >
                      {isAr ? 'تفاصيل دراسة الحالة' : 'Inspect Case Study'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center sm:hidden">
                <button
                  onClick={() => navigateToView('projects')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-blue-600 text-white"
                >
                  <span>{isAr ? 'عرض جميع المشاريع والإحصائيات' : 'View All Projects & Stats'}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  onClick={() => navigateToView('engineering')}
                  className="p-6 rounded-2xl dark:bg-[#0D1526] bg-white border dark:border-white/10 border-slate-200 hover:border-emerald-500/40 transition-all shadow-sm cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold dark:text-white text-slate-900 mb-2">
                    {isAr ? 'معايير الإنتاجية وهندسة النظم' : 'Engineering Rigor & Proof'}
                  </h3>
                  <p className="text-xs dark:text-slate-300 text-slate-600 leading-relaxed mb-4">
                    {isAr
                      ? 'حزمة اختبارات آلية، تذاكر سبرينت حية، وتوثيق معمارية النظم بمستوى Production-grade.'
                      : 'Automated test runner, sprint backlog board, and verified architecture decision specs.'}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <span>{isAr ? 'استكشف المعايير' : 'Explore Standards'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </div>
                </div>

                <div
                  onClick={() => navigateToView('experience')}
                  className="p-6 rounded-2xl dark:bg-[#0D1526] bg-white border dark:border-white/10 border-slate-200 hover:border-blue-500/40 transition-all shadow-sm cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Milestone className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold dark:text-white text-slate-900 mb-2">
                    {isAr ? 'المسار المهني والأكاديمي' : 'Career Track & Education'}
                  </h3>
                  <p className="text-xs dark:text-slate-300 text-slate-600 leading-relaxed mb-4">
                    {isAr
                      ? '+7 سنوات خبرة Full-Stack، دور في Capital Numbers، وبكالوريوس هندسة الحاسبات والإلكترونيات.'
                      : '7+ years Full-Stack, Capital Numbers developer tenure, and engineering degree foundations.'}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <span>{isAr ? 'عرض الخبرات والتعليم' : 'View Career & Degree'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </div>
                </div>

                <div
                  onClick={() => navigateToView('console')}
                  className="p-6 rounded-2xl dark:bg-[#0D1526] bg-white border dark:border-white/10 border-slate-200 hover:border-indigo-500/40 transition-all shadow-sm cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold dark:text-white text-slate-900 mb-2">
                    {isAr ? 'كونسول المهندس التفاعلي' : 'Interactive Engineering Console'}
                  </h3>
                  <p className="text-xs dark:text-slate-300 text-slate-600 leading-relaxed mb-4">
                    {isAr
                      ? 'مختبر اختبارات حية، وسجل الـ Git Commits مع مقارنة الـ Diffs، ومواصفات الـ REST API.'
                      : 'Execute unit suites, explore git patch diffs, and inspect RESTful API architecture.'}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    <span>{isAr ? 'فتح الكونسول' : 'Launch Console'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </div>
                </div>
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-6">
              <div className="p-8 rounded-2xl dark:bg-gradient-to-r dark:from-blue-950/40 dark:to-slate-900 bg-blue-50 border dark:border-blue-500/20 border-blue-200 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2">
                    {isAr ? 'هل تود الاطلاع على السيرة الذاتية الرسمية كاملة؟' : 'Looking for the Official Resume / CV?'}
                  </h3>
                  <p className="text-xs sm:text-sm dark:text-slate-300 text-slate-600 max-w-2xl leading-relaxed">
                    {isAr
                      ? 'تحتوي السيرة الذاتية المحدثة على كافة تفاصيل المشروعات المنفذة، التقنيات، شهادات الاعتماد، والمسار الوظيفي المعتمد بصيغة PDF قابلة للطباعة.'
                      : 'The updated resume contains comprehensive verified credentials, production deliveries, and accredited certifications.'}
                  </p>
                </div>
                <a
                  href={cvDownloadUrl}
                  download="Abdelrahman_Eldamarany_CV.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/25 flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0"
                >
                  <FileDown className="w-4 h-4" />
                  <span>{isAr ? 'تحميل السيرة الذاتية المحدثة (PDF)' : 'Download Updated CV (PDF)'}</span>
                </a>
              </div>
            </section>
          </div>
        )}

        {activeView === 'projects' && (
          <div className="space-y-16 pb-20 pt-6">
            <Projects
              projects={projects}
              onSelectProject={setSelectedProject}
              language={language}
            />
            <Suspense fallback={<SectionFallback />}>
              <ProjectEngagementStats
                projects={projects}
                language={language}
              />
            </Suspense>
          </div>
        )}

        {activeView === 'experience' && (
          <div className="space-y-16 pb-20 pt-6">
            <Experience language={language} />
            <Education language={language} />

            <div className="max-w-4xl mx-auto px-6">
              <div className="p-6 rounded-2xl dark:bg-[#0D1526] bg-white border dark:border-white/10 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="font-bold dark:text-white text-slate-900 text-sm">
                    {isAr ? 'نسخة السيرة الذاتية المحدثة PDF' : 'Updated Resume PDF Version'}
                  </div>
                  <div className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">
                    {isAr ? 'جاهزة للتنزيل والطباعة المباشرة' : 'Ready for direct download & review'}
                  </div>
                </div>
                <a
                  href={cvDownloadUrl}
                  download="Abdelrahman_Eldamarany_CV.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors whitespace-nowrap"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تحميل السيرة الذاتية (PDF)' : 'Download CV (PDF)'}</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {activeView === 'skills' && (
          <div className="pb-20 pt-6">
            <Skills language={language} />
          </div>
        )}

        {activeView === 'engineering' && (
          <div className="pb-20 pt-6">
            <EngineeringRigor
              language={language}
              onOpenConsoleTab={navigateToConsoleTab}
              ticketCount={tickets.length}
              commitCount={commits.length}
              docCount={docs.length}
            />
          </div>
        )}

        {activeView === 'console' && (
          <div className="pb-20 pt-2">
            <Suspense fallback={<SectionFallback />}>
              <ConsoleSuite
                tickets={tickets}
                commits={commits}
                docs={docs}
                onRefreshTickets={refreshTickets}
                language={language}
                activeTab={consoleTab}
                onTabChange={setConsoleTab}
                onBackToPortfolio={() => navigateToView('overview')}
              />
            </Suspense>
          </div>
        )}
      </main>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        language={language}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        profile={profile}
        language={language}
      />

      <Suspense fallback={null}>
        <LiveVoiceAgent
          isOpen={isVoiceAgentOpen}
          onClose={() => setIsVoiceAgentOpen(false)}
          language={language}
        />

        <GeminiChatbot
          language={language}
        />
      </Suspense>

      <Footer
        profile={profile}
        language={language}
        onNavigateView={navigateToView}
      />
    </div>
  );
}
