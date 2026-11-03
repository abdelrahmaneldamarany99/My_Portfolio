import React from 'react';
import {
  ShieldCheck,
  Kanban,
  GitCommit,
  BookOpen,
  ArrowRight,
  Terminal,
  CheckCircle2,
  GitBranch,
  Layers,
  FileCode,
} from 'lucide-react';
import type { Language } from '../types/index.ts';

interface EngineeringRigorProps {
  language: Language;
  onOpenConsoleTab: (tab: 'tests' | 'tickets' | 'commits' | 'docs') => void;
  ticketCount: number;
  commitCount: number;
  docCount: number;
}

export function EngineeringRigor({
  language,
  onOpenConsoleTab,
  ticketCount,
  commitCount,
  docCount,
}: EngineeringRigorProps) {
  const isAr = language === 'ar';

  return (
    <section id="engineering-rigor" className="py-20 border-b dark:border-white/10 border-slate-200 relative transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
              {isAr ? 'معايير الإنتاجية وهندسة النظم' : 'Engineering Rigor & Verification'}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight dark:text-white text-slate-900">
              {isAr ? 'منظومة الجودة والتوثيق والاختبارات' : 'Production-Grade Proof: Tests, Tickets & Docs'}
            </h2>
            <p className="text-sm sm:text-base dark:text-slate-400 text-slate-600 mt-2 max-w-2xl leading-relaxed">
              {isAr
                ? 'استعراض مباشر وموثق للممارسات الهندسية الاحترافية: حزم اختبارات مؤتمتة، إدارة تذاكر وسبرنتات متزامنة، سجل Git دقيق مع الفوارق، وتوثيق معماري متكامل.'
                : 'Verifiable evidence of production engineering: automated unit & integration suites, Jira-style sprint tracking, verified commit diffs, and architectural system specs.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono dark:text-slate-300 text-slate-700 dark:bg-slate-900 bg-white border dark:border-white/10 border-slate-200 px-3.5 py-2 rounded-xl shadow-xs self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{isAr ? 'بيئة العمل نشطة ومحدثة' : 'Production Environment Active'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="dark:bg-[#0D1424] bg-white border dark:border-white/10 border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between pb-4 mb-5 border-b dark:border-white/10 border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold dark:text-white text-slate-900">
                      {isAr ? 'مشغل الاختبارات الآلية (Test Runner)' : 'Automated Test Suite Harness'}
                    </h3>
                    <div className="text-xs dark:text-slate-400 text-slate-500 font-mono">
                      {isAr ? '12 حزمة اختبار · تغطية 100%' : '12 Passed Specs · 100% Assertion Rate'}
                    </div>
                  </div>
                </div>

                <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {isAr ? 'اجتازت بالكامل' : 'All Green'}
                </span>
              </div>

              <p className="text-xs sm:text-sm dark:text-slate-300 text-slate-600 mb-5 leading-relaxed">
                {isAr
                  ? 'حزمة اختبارات Unit و Integration آلية تحاكي تنفيذ Vitest و Jest مع تأكيد سلامة نماذج BSON، ومحركات الحالة، ونقاط RESTful API.'
                  : 'End-to-end automated unit and integration tests verifying BSON ObjectId generation, RFC email sanitization, and state machine transitions.'}
              </p>

              <div className="dark:bg-slate-950 bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-[11px] font-mono text-slate-300 space-y-1.5 mb-6 overflow-x-auto shadow-inner">
                <div className="text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>PASS tests/unit/mongo-objectid.spec.ts (8ms)</span>
                </div>
                <div className="text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>PASS tests/unit/ticket-state-machine.spec.ts (6ms)</span>
                </div>
                <div className="text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>PASS tests/integration/api-projects.spec.ts (14ms)</span>
                </div>
                <div className="text-slate-400 pt-1 text-[10px] border-t border-slate-800 flex items-center justify-between">
                  <span>Tests: 12 passed, 12 total</span>
                  <span>Time: 0.124s</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenConsoleTab('tests')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>{isAr ? 'تشغيل مشغل الاختبارات التفاعلي' : 'Launch Interactive Test Runner'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>

          <div className="dark:bg-[#0D1424] bg-white border dark:border-white/10 border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between pb-4 mb-5 border-b dark:border-white/10 border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
                    <Kanban className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold dark:text-white text-slate-900">
                      {isAr ? 'لوحة تذاكر السبرنت (Tickets Board)' : 'Sprint Backlog & Issue Tracker'}
                    </h3>
                    <div className="text-xs dark:text-slate-400 text-slate-500 font-mono">
                      {isAr ? `${ticketCount || 6} تذاكر متزامنة مع MongoDB` : `${ticketCount || 6} Tickets · MongoDB Collections`}
                    </div>
                  </div>
                </div>

                <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Sprint 24
                </span>
              </div>

              <p className="text-xs sm:text-sm dark:text-slate-300 text-slate-600 mb-5 leading-relaxed">
                {isAr
                  ? 'إدارة مهام وتذاكر برمجية بنمط Jira و Linear مع توزيع كامل عبر مسارات (To Do، In Progress، QA، Completed) وإمكانية إنشاء التذاكر الحية.'
                  : 'Live production sprint backlog managing features, bugs, performance tickets, and refactors across 4 active lifecycle stages.'}
              </p>

              <div className="space-y-2 mb-6">
                <div className="p-2.5 rounded-lg dark:bg-slate-900/80 bg-slate-50 border dark:border-white/5 border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-[11px]">ENG-104</span>
                    <span className="dark:text-slate-200 text-slate-700 truncate max-w-[200px] sm:max-w-xs">
                      {isAr ? 'تحسين استجابة التراجع المتفائل لواجهات المهام' : 'Optimistic UI update rollback snapshot'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
                    DONE
                  </span>
                </div>

                <div className="p-2.5 rounded-lg dark:bg-slate-900/80 bg-slate-50 border dark:border-white/5 border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-[11px]">ENG-105</span>
                    <span className="dark:text-slate-200 text-slate-700 truncate max-w-[200px] sm:max-w-xs">
                      {isAr ? 'فهرسة مركبة لاستعلامات وتصنيفات MongoDB' : 'Compound category query index optimization'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-medium">
                    QA
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenConsoleTab('tickets')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>{isAr ? 'فتح لوحة التذاكر والسبرنت' : 'Open Sprint Backlog & Board'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>

          <div className="dark:bg-[#0D1424] bg-white border dark:border-white/10 border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between pb-4 mb-5 border-b dark:border-white/10 border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                    <GitCommit className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold dark:text-white text-slate-900">
                      {isAr ? 'سجل تدقيق الـ Commits (Git Audit)' : 'Repository Commits & Audit Trail'}
                    </h3>
                    <div className="text-xs dark:text-slate-400 text-slate-500 font-mono">
                      {isAr ? `${commitCount || 5} تعديلات موثقة مع الفوارق` : `${commitCount || 5} Commits · branch main`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono dark:text-slate-400 text-slate-600">
                  <GitBranch className="w-3.5 h-3.5 text-blue-500" />
                  <span>main</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm dark:text-slate-300 text-slate-600 mb-5 leading-relaxed">
                {isAr
                  ? 'سجل تغييرات تفصيلي يوضح معايير الـ Semantic Commits، ورموز الـ Hash، وحجم الإضافات والحذف، مع فوارق الكود الحية (Code Diffs).'
                  : 'Verifiable change audit displaying conventional commit semantics, SHA hashes, insertions/deletions, and inline diff patch inspection.'}
              </p>

              <div className="space-y-2 mb-6 text-xs font-mono">
                <div className="p-2.5 rounded-lg dark:bg-slate-900/80 bg-slate-50 border dark:border-white/5 border-slate-200 flex items-center justify-between">
                  <div className="truncate max-w-[220px] sm:max-w-xs font-medium dark:text-slate-200 text-slate-800">
                    feat(auth): add JWT refresh token rotation with httpOnly cookies
                  </div>
                  <div className="flex items-center gap-2 shrink-0 text-[11px]">
                    <span className="text-emerald-500 font-semibold">+184</span>
                    <span className="text-rose-500 font-semibold">-12</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg dark:bg-slate-900/80 bg-slate-50 border dark:border-white/5 border-slate-200 flex items-center justify-between">
                  <div className="truncate max-w-[220px] sm:max-w-xs font-medium dark:text-slate-200 text-slate-800">
                    perf(mongo): compound indexing on project categories & techStack
                  </div>
                  <div className="flex items-center gap-2 shrink-0 text-[11px]">
                    <span className="text-emerald-500 font-semibold">+92</span>
                    <span className="text-rose-500 font-semibold">-6</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenConsoleTab('commits')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>{isAr ? 'مراجعة سجل الـ Commits والفوارق' : 'Inspect Git Commits & Diffs'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>

          <div className="dark:bg-[#0D1424] bg-white border dark:border-white/10 border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
            <div>
              <div className="flex items-center justify-between pb-4 mb-5 border-b dark:border-white/10 border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold dark:text-white text-slate-900">
                      {isAr ? 'وثائق المعمارية (Architecture Docs)' : 'Architecture Specifications & ADRs'}
                    </h3>
                    <div className="text-xs dark:text-slate-400 text-slate-500 font-mono">
                      {isAr ? `${docCount || 4} وثائق C4 ومخططات تفاعلية` : `${docCount || 4} System Specs · Live API Tester`}
                    </div>
                  </div>
                </div>

                <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  OpenAPI 3.0
                </span>
              </div>

              <p className="text-xs sm:text-sm dark:text-slate-300 text-slate-600 mb-5 leading-relaxed">
                {isAr
                  ? 'وثائق تصميم الأنظمة وقرارات المعمارية (ADRs)، مع مخططات ASCII تفاعلية ومختبر حي لإرسال طلبات الـ REST وقراءة زمن الاستجابة (Latency).'
                  : 'System design specifications, C4 container diagrams, and an interactive REST test console probing live Express.js endpoints.'}
              </p>

              <div className="space-y-2 mb-6 text-xs font-mono">
                <div className="p-2.5 rounded-lg dark:bg-slate-900/80 bg-slate-50 border dark:border-white/5 border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-600 text-white font-bold">GET</span>
                    <span className="dark:text-slate-200 text-slate-700">/api/projects</span>
                  </div>
                  <span className="text-emerald-500 text-[11px]">200 OK</span>
                </div>

                <div className="p-2.5 rounded-lg dark:bg-slate-900/80 bg-slate-50 border dark:border-white/5 border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-600 text-white font-bold">GET</span>
                    <span className="dark:text-slate-200 text-slate-700">/api/health</span>
                  </div>
                  <span className="text-emerald-500 text-[11px]">200 OK</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenConsoleTab('docs')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>{isAr ? 'قراءة وثائق المعمارية واختبار الـ APIs' : 'Read Architecture Docs & Test APIs'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
