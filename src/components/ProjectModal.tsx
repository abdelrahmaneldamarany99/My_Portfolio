import React, { useEffect } from 'react';
import { X, ExternalLink, Github, Database, Layers, CheckCircle2 } from 'lucide-react';
import type { Project, Language } from '../types/index.ts';
import { translations } from '../data/translations.ts';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  language: Language;
}

export function ProjectModal({ project, onClose, language }: ProjectModalProps) {
  const t = translations[language].projects;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div
        className="dark:bg-[#0D1322] bg-white border dark:border-white/15 border-slate-200 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative transition-colors"
        role="dialog"
        aria-modal="true"
      >
        <div className="sticky top-0 z-10 dark:bg-[#0D1322]/95 bg-white/95 backdrop-blur-md px-6 py-4 border-b dark:border-white/10 border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs dark:text-slate-400 text-slate-500 font-mono">
            <span className="text-blue-600 dark:text-blue-400 font-semibold uppercase">{project.category}</span>
            <span aria-hidden="true">·</span>
            <span>{project.timeline}</span>
            <span aria-hidden="true">·</span>
            <span>{project.role}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 dark:text-slate-400 text-slate-500 hover:dark:text-white hover:text-slate-900 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold dark:text-white text-slate-900 mb-3">
              {project.title}
            </h2>
            <p className="text-base dark:text-slate-300 text-slate-600 leading-relaxed">
              {project.description}
            </p>
          </div>

          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 dark:bg-slate-900/90 bg-slate-50 rounded-xl border dark:border-white/10 border-slate-200">
              {project.metrics.map((m, idx) => (
                <div key={idx}>
                  <div className="text-xl font-bold font-mono dark:text-white text-slate-900 tabular-nums">{m.value}</div>
                  <div className="text-xs dark:text-slate-400 text-slate-500">{m.label}</div>
                </div>
              ))}
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider dark:text-slate-400 text-slate-600 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{t.architectureHighlights}</span>
            </h3>
            <ul className="space-y-2.5">
              {project.architectureHighlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm dark:text-slate-300 text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider dark:text-slate-400 text-slate-600 mb-3 flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{t.databaseStrategy}</span>
            </h3>
            <div className="dark:bg-slate-900/60 bg-slate-50 p-4 rounded-xl border dark:border-white/10 border-slate-200 text-sm dark:text-slate-300 text-slate-600 leading-relaxed">
              {project.databaseDesign}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider dark:text-slate-400 text-slate-600 mb-3">
              {t.tooling}
            </h3>
            <div className="flex flex-wrap gap-2 text-xs font-mono dark:text-slate-300 text-slate-700">
              {project.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 dark:bg-slate-900 bg-slate-100 rounded border dark:border-white/10 border-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t dark:border-white/10 border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold dark:text-white text-slate-700 dark:bg-slate-800 bg-slate-100 hover:dark:bg-slate-700 hover:bg-slate-200 border dark:border-white/15 border-slate-300 rounded-lg transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>{t.repository}</span>
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{t.livePlatform}</span>
                </a>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium dark:text-slate-400 text-slate-500 hover:dark:text-white hover:text-slate-900 transition-colors"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
