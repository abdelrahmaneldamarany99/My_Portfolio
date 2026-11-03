import React, { useState } from 'react';
import { Search, ArrowUpRight, BarChart2 } from 'lucide-react';
import type { Project, Language } from '../types/index.ts';
import { translations } from '../data/translations.ts';

interface ProjectsProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  language: Language;
}

export function Projects({ projects, onSelectProject, language }: ProjectsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const t = translations[language].projects;

  const categories = [
    { id: 'all', label: t.all },
    { id: 'mern', label: t.mern },
    { id: 'nextjs', label: t.nextjs },
    { id: 'ai', label: t.ai },
    { id: 'fullstack', label: t.fullstack },
  ];

  const filtered = projects.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.techStack.some((tech) => tech.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  return (
    <section id="projects" className="py-20 border-b dark:border-white/10 border-slate-200 relative transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
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

          <div className="w-full md:w-72">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full ps-9 pe-4 py-2 dark:bg-slate-900 bg-white border dark:border-white/10 border-slate-200 rounded-lg text-xs dark:text-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-1.5 p-1 dark:bg-slate-900 bg-slate-100 border dark:border-white/10 border-slate-200 rounded-lg overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'dark:text-slate-400 text-slate-600 hover:dark:text-white hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <a
            href="#engagement-stats"
            className="px-3 py-1.5 rounded-lg border dark:border-white/10 border-slate-200 dark:bg-slate-900/60 bg-white hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-mono dark:text-slate-300 text-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <BarChart2 className="w-3.5 h-3.5 text-blue-500" />
            <span>{language === 'ar' ? 'عرض إحصائيات التفاعل' : 'Engagement Analytics'}</span>
          </a>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 dark:bg-slate-900/40 bg-slate-50 border dark:border-white/10 border-slate-200 rounded-2xl">
            <p className="dark:text-slate-400 text-slate-600 text-sm">{t.noResults}</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              {t.resetFilters}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <div
                key={project._id}
                onClick={() => onSelectProject(project)}
                className="group cursor-pointer dark:bg-[#0D1424] bg-white hover:dark:bg-[#111A30] hover:bg-slate-50 border dark:border-white/10 border-slate-200 hover:dark:border-blue-500/40 hover:border-blue-400 rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 text-xs dark:text-slate-400 text-slate-500 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold uppercase text-[11px] font-mono">
                        {project.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{project.timeline}</span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors rtl:rotate-[-90deg]" />
                  </div>

                  <h3 className="text-lg font-bold dark:text-white text-slate-900 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors mb-2">
                    {project.title}
                  </h3>

                  <p className="text-sm dark:text-slate-300 text-slate-600 leading-relaxed mb-6 line-clamp-3">
                    {project.summary}
                  </p>
                </div>

                <div>
                  {project.metrics && project.metrics.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 py-3 px-3.5 mb-5 dark:bg-slate-900/70 bg-slate-50 border dark:border-white/5 border-slate-200 rounded-xl">
                      {project.metrics.slice(0, 2).map((m, idx) => (
                        <div key={idx}>
                          <div className="text-sm font-bold font-mono dark:text-white text-slate-900 tabular-nums">
                            {m.value}
                          </div>
                          <div className="text-[11px] dark:text-slate-400 text-slate-500">
                            {m.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5 pt-4 border-t dark:border-white/5 border-slate-100">
                    {project.techStack.slice(0, 4).map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono dark:text-slate-400 text-slate-600 dark:bg-slate-900/80 bg-slate-100 px-2 py-0.5 rounded border dark:border-white/5 border-slate-200"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 4 && (
                      <span className="text-[11px] font-mono text-slate-500 self-center">
                        +{project.techStack.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
