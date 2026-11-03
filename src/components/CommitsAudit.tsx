import React, { useState } from 'react';
import { GitCommit, GitBranch, ChevronDown, ChevronRight, Copy, Check, FileCode } from 'lucide-react';
import type { Commit, Language } from '../types/index.ts';
import { translations } from '../data/translations.ts';

interface CommitsAuditProps {
  commits: Commit[];
  language?: Language;
}

export function CommitsAudit({ commits, language = 'en' }: CommitsAuditProps) {
  const [expandedCommitId, setExpandedCommitId] = useState<string | null>(
    commits[0]?._id || null
  );
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const t = translations[language].commits;

  const copyToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-6 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold dark:text-white text-slate-900">{t.title}</h3>
          <p className="text-xs dark:text-slate-400 text-slate-600 mt-1">
            {t.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono dark:text-slate-400 text-slate-600 dark:bg-slate-900 bg-slate-100 border dark:border-white/10 border-slate-200 px-3 py-1.5 rounded-lg w-fit shadow-xs">
          <GitBranch className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>{t.verifiedBranch}</span>
        </div>
      </div>

      <div className="space-y-3">
        {commits.map((commit) => {
          const isExpanded = expandedCommitId === commit._id;
          return (
            <div
              key={commit._id}
              className="dark:bg-[#0D1424] bg-white border dark:border-white/10 border-slate-200 rounded-xl overflow-hidden shadow-sm transition-colors"
            >
              <div
                onClick={() => setExpandedCommitId(isExpanded ? null : commit._id)}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:dark:bg-slate-900/60 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-blue-600/10 border border-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400 mt-0.5">
                    <GitCommit className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="text-sm font-semibold dark:text-white text-slate-900 font-mono">
                      {commit.message}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs dark:text-slate-400 text-slate-500 mt-1">
                      <span>{commit.author}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{commit.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">+{commit.insertions}</span>
                    <span className="text-rose-600 dark:text-rose-400 font-medium">-{commit.deletions}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(commit.hash);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 dark:bg-slate-900 bg-slate-100 border dark:border-white/10 border-slate-200 rounded font-mono text-xs dark:text-slate-300 text-slate-700 hover:dark:text-white hover:text-slate-900 hover:dark:bg-slate-800 hover:bg-slate-200 transition-colors shadow-xs"
                    title={t.copyHash}
                  >
                    <span>{commit.shortHash}</span>
                    {copiedHash === commit.hash ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-400" />
                    )}
                  </button>

                  <div className="text-slate-400">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 rtl:rotate-180" />}
                  </div>
                </div>
              </div>

              {isExpanded && commit.diffs && (
                <div className="p-4 sm:p-5 dark:bg-slate-950/70 bg-slate-50 border-t dark:border-white/10 border-slate-200 space-y-4">
                  <div className="text-xs font-mono dark:text-slate-400 text-slate-600">
                    {t.showingDiff} {commit.diffs.length} {language === 'ar' ? 'ملفات معدلة:' : 'changed file(s):'}
                  </div>

                  {commit.diffs.map((diff, dIdx) => (
                    <div
                      key={dIdx}
                      className="border dark:border-white/10 border-slate-200 rounded-lg overflow-hidden dark:bg-slate-900/90 bg-white text-xs font-mono shadow-xs"
                    >
                      <div className="px-3.5 py-2 dark:bg-slate-900 bg-slate-100 border-b dark:border-white/10 border-slate-200 flex items-center justify-between dark:text-slate-300 text-slate-700">
                        <div className="flex items-center gap-2">
                          <FileCode className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          <span>{diff.file}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="text-emerald-600 dark:text-emerald-400">+{diff.additions}</span>
                          <span className="text-rose-600 dark:text-rose-400">-{diff.deletions}</span>
                        </div>
                      </div>

                      <pre className="p-3.5 overflow-x-auto dark:text-slate-300 text-slate-800 text-[11px] leading-relaxed">
                        {diff.patch}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
