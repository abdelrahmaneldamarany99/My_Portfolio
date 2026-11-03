import React, { useState } from 'react';
import { ArrowLeft, Kanban, GitCommit, ShieldCheck, BookOpen, Terminal, Layers } from 'lucide-react';
import type { Ticket, Commit, ArchitectureDoc, TerminalTheme, Language } from '../types/index.ts';
import { TicketsBoard } from './TicketsBoard.tsx';
import { CommitsAudit } from './CommitsAudit.tsx';
import { TestRunner } from './TestRunner.tsx';
import { ArchitectureDocs } from './ArchitectureDocs.tsx';
import { ThreeScene } from './ThreeScene.tsx';
import { translations } from '../data/translations.ts';

export type ConsoleTab = 'tickets' | 'commits' | 'tests' | 'docs' | '3d-cluster';

interface ConsoleSuiteProps {
  tickets: Ticket[];
  commits: Commit[];
  docs: ArchitectureDoc[];
  onRefreshTickets: () => void;
  language: Language;
  activeTab?: ConsoleTab;
  onTabChange?: (tab: ConsoleTab) => void;
  onBackToPortfolio?: () => void;
}

export function ConsoleSuite({
  tickets,
  commits,
  docs,
  onRefreshTickets,
  language,
  activeTab: controlledTab,
  onTabChange,
  onBackToPortfolio,
}: ConsoleSuiteProps) {
  const [internalTab, setInternalTab] = useState<ConsoleTab>('tests');
  const activeTab = controlledTab ?? internalTab;
  const setActiveTab = (tab: ConsoleTab) => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };

  const [terminalTheme, setTerminalTheme] = useState<TerminalTheme>('cobalt');
  const t = translations[language].console;
  const isAr = language === 'ar';

  const tabs: { id: ConsoleTab; label: string; icon: React.ElementType }[] = [
    { id: 'tickets', label: t.sprintTickets, icon: Kanban },
    { id: 'commits', label: t.gitAudit, icon: GitCommit },
    { id: 'tests', label: t.testRunner, icon: ShieldCheck },
    { id: 'docs', label: t.architectureDocs, icon: BookOpen },
    { id: '3d-cluster', label: isAr ? 'معمارية 3D' : '3D Topology', icon: Layers },
  ];

  return (
    <div className="py-12 max-w-7xl mx-auto px-6 space-y-8 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b dark:border-white/10 border-slate-200">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {onBackToPortfolio && (
              <button
                onClick={onBackToPortfolio}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-colors cursor-pointer"
                title={isAr ? 'العودة لمعرض الأعمال' : 'Back to Portfolio'}
              >
                <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                <span>{isAr ? 'العودة لمعرض الأعمال' : 'Back to Portfolio'}</span>
              </button>
            )}
            <div className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-blue-400">
              <Terminal className="w-4 h-4" />
              <span>{t.badge}</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold dark:text-white text-slate-900">
            {t.title}
          </h2>
          <p className="text-xs sm:text-sm dark:text-slate-400 text-slate-600 mt-1 max-w-2xl">
            {t.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 dark:bg-slate-900 bg-slate-100 border dark:border-white/10 border-slate-200 rounded-xl overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'dark:text-slate-400 text-slate-600 hover:dark:text-white hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 p-1 dark:bg-slate-900 bg-slate-100 border dark:border-white/10 border-slate-200 rounded-xl text-xs font-mono">
            <span className="px-2 text-[11px] dark:text-slate-400 text-slate-500 uppercase hidden sm:inline">
              {t.themeLabel}
            </span>
            <button
              onClick={() => setTerminalTheme('cobalt')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                terminalTheme === 'cobalt'
                  ? 'bg-blue-600/20 text-blue-600 dark:text-blue-300 border border-blue-500/40 font-semibold'
                  : 'dark:text-slate-400 text-slate-600 hover:dark:text-white hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Cobalt</span>
            </button>
            <button
              onClick={() => setTerminalTheme('retro-green')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                terminalTheme === 'retro-green'
                  ? 'bg-emerald-950/70 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                  : 'dark:text-slate-400 text-slate-600 hover:dark:text-white hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10B981]" />
              <span>Retro Green</span>
            </button>
          </div>
        </div>
      </div>

      <div>
        {activeTab === 'tickets' && (
          <TicketsBoard
            tickets={tickets}
            onRefresh={onRefreshTickets}
            language={language}
          />
        )}
        {activeTab === 'commits' && (
          <CommitsAudit
            commits={commits}
            language={language}
          />
        )}
        {activeTab === 'tests' && (
          <TestRunner
            terminalTheme={terminalTheme}
            onToggleTheme={(theme) => setTerminalTheme(theme)}
            language={language}
          />
        )}
        {activeTab === 'docs' && (
          <ArchitectureDocs
            docs={docs}
            terminalTheme={terminalTheme}
            language={language}
          />
        )}
        {activeTab === '3d-cluster' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold dark:text-white text-slate-900">
                  {isAr ? 'مصفوفة التوزيع المعماري ثلاثية الأبعاد' : '3D Interactive Architecture Cluster'}
                </h3>
                <p className="text-xs dark:text-slate-400 text-slate-600">
                  {isAr
                    ? 'محاكاة ثلاثية الأبعاد لبيئة الخوادم والخدمات السحابية المصغرة ونواة البيانات التفاعلية.'
                    : 'Procedural Three.js visualization of cloud microservices, database core, and fiber telemetry.'}
                </p>
              </div>
            </div>
            <ThreeScene language={language} className="h-[520px]" />
          </div>
        )}
      </div>
    </div>
  );
}
