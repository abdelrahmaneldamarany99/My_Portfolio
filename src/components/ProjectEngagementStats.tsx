import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  ShieldCheck,
  Eye,
  GitCommit,
  Zap,
  Globe2,
  Calendar,
  Layers,
} from 'lucide-react';
import type { Project, Language } from '../types/index.ts';

interface ProjectEngagementStatsProps {
  projects: Project[];
  language: Language;
}

type ChartView = 'trends' | 'comparison' | 'radar' | 'share';
type Timeframe = '30d' | '90d' | '1y';

const MONTHLY_TRENDS_EN = [
  { month: 'Nov', views: 32100, sessions: 61500, invocations: 128000, commits: 74 },
  { month: 'Dec', views: 36800, sessions: 72000, invocations: 145000, commits: 88 },
  { month: 'Jan', views: 41500, sessions: 81300, invocations: 162000, commits: 92 },
  { month: 'Feb', views: 46200, sessions: 94600, invocations: 184000, commits: 85 },
  { month: 'Mar', views: 52800, sessions: 108200, invocations: 210000, commits: 110 },
  { month: 'Apr', views: 58400, sessions: 124800, invocations: 242000, commits: 126 },
];

const MONTHLY_TRENDS_AR = [
  { month: 'نوفمبر', views: 32100, sessions: 61500, invocations: 128000, commits: 74 },
  { month: 'ديسمبر', views: 36800, sessions: 72000, invocations: 145000, commits: 88 },
  { month: 'يناير', views: 41500, sessions: 81300, invocations: 162000, commits: 92 },
  { month: 'فبراير', views: 46200, sessions: 94600, invocations: 184000, commits: 85 },
  { month: 'مارس', views: 52800, sessions: 108200, invocations: 210000, commits: 110 },
  { month: 'أبريل', views: 58400, sessions: 124800, invocations: 242000, commits: 126 },
];

const TECH_RADAR_DATA_EN = [
  { subject: 'React & Next.js', score: 98, fullMark: 100 },
  { subject: 'TypeScript', score: 96, fullMark: 100 },
  { subject: 'Node & Express', score: 93, fullMark: 100 },
  { subject: 'MongoDB / DB', score: 91, fullMark: 100 },
  { subject: 'AI / Deep Learning', score: 86, fullMark: 100 },
  { subject: 'REST & WebSockets', score: 94, fullMark: 100 },
];

const TECH_RADAR_DATA_AR = [
  { subject: 'React & Next.js', score: 98, fullMark: 100 },
  { subject: 'TypeScript', score: 96, fullMark: 100 },
  { subject: 'Node & Express', score: 93, fullMark: 100 },
  { subject: 'MongoDB / قواعد البيانات', score: 91, fullMark: 100 },
  { subject: 'الذكاء الاصطناعي AI', score: 86, fullMark: 100 },
  { subject: 'واجهات REST والويب سوكت', score: 94, fullMark: 100 },
];

const CATEGORY_SHARE_EN = [
  { name: 'MERN Full-Stack', value: 35, color: '#2563eb' },
  { name: 'Next.js & SSR', value: 30, color: '#38bdf8' },
  { name: 'AI & Telemetry', value: 20, color: '#10b981' },
  { name: 'Cloud & Tooling', value: 15, color: '#f59e0b' },
];

const CATEGORY_SHARE_AR = [
  { name: 'تطبيقات MERN المتكاملة', value: 35, color: '#2563eb' },
  { name: 'معمارية Next.js و SSR', value: 30, color: '#38bdf8' },
  { name: 'الذكاء الاصطناعي وتتبع القياسات', value: 20, color: '#10b981' },
  { name: 'المنصات السحابية والأدوات', value: 15, color: '#f59e0b' },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number | string;
    color?: string;
  }>;
  label?: string;
  isAr: boolean;
}

function CustomGlassTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border border-slate-700/60 dark:border-white/15 px-3.5 py-2.5 rounded-xl shadow-2xl text-xs font-mono text-slate-100 z-50">
      {label && <div className="font-semibold text-slate-300 pb-1.5 mb-1.5 border-b border-white/10">{label}</div>}
      <div className="space-y-1">
        {payload.map((entry, idx) => (
          <div key={`tooltip-${idx}`} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || '#38bdf8' }} />
              <span>{entry.name}:</span>
            </span>
            <span className="font-bold text-white tabular-nums">
              {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectEngagementStats({ projects, language }: ProjectEngagementStatsProps) {
  const [activeView, setActiveView] = useState<ChartView>('trends');
  const [timeframe, setTimeframe] = useState<Timeframe>('30d');
  const isAr = language === 'ar';

  const projectComparisonData = useMemo(() => {
    const fallbackList = [
      { name: 'Nana Delivery', views: 18400, invocations: 42900, commits: 186 },
      { name: 'Smart Mall AI', views: 14200, invocations: 38100, commits: 214 },
      { name: 'ShopSphere', views: 12800, invocations: 29400, commits: 168 },
      { name: 'TaskMaster', views: 9600, invocations: 21300, commits: 142 },
      { name: 'PulseMetrics', views: 16500, invocations: 46200, commits: 230 },
      { name: 'HealthSync', views: 11300, invocations: 24800, commits: 155 },
    ];

    if (!projects || projects.length === 0) return fallbackList;

    return projects.slice(0, 6).map((p, idx) => {
      const base = fallbackList[idx % fallbackList.length];
      const shortTitle = p.title.length > 14 ? `${p.title.slice(0, 12)}…` : p.title;
      return {
        name: shortTitle,
        fullName: p.title,
        views: base.views,
        invocations: base.invocations,
        commits: base.commits,
      };
    });
  }, [projects]);

  const trendsData = useMemo(() => {
    const raw = isAr ? MONTHLY_TRENDS_AR : MONTHLY_TRENDS_EN;
    if (timeframe === '30d') return raw.slice(-3);
    if (timeframe === '90d') return raw.slice(-4);
    return raw;
  }, [isAr, timeframe]);

  const radarData = isAr ? TECH_RADAR_DATA_AR : TECH_RADAR_DATA_EN;
  const shareData = isAr ? CATEGORY_SHARE_AR : CATEGORY_SHARE_EN;

  return (
    <section id="engagement-stats" className="py-20 border-b dark:border-white/10 border-slate-200 relative transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{isAr ? 'تحليلات تفاعل المشاريع والأداء' : 'Project Engagement & Telemetry'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight dark:text-white text-slate-900">
              {isAr ? 'إحصائيات تفاعلية ونشاط الكود' : 'Project Engagement Analytics'}
            </h2>
            <p className="text-sm sm:text-base dark:text-slate-400 text-slate-600 mt-2 max-w-2xl">
              {isAr
                ? 'رصد حي لمعدلات الزيارات، استدعاءات الـ REST APIs، ونشاط الـ Commits الموزعة عبر المعماريات البرمجية.'
                : 'Interactive data visualization of project adoption, API consumption volume, and codebase velocity.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border dark:border-white/10 border-slate-300 flex items-center gap-1 text-xs font-medium">
              {(['30d', '90d', '1y'] as Timeframe[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-mono ${
                    timeframe === tf
                      ? 'bg-blue-600 text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tf === '30d' ? (isAr ? '٣٠ يوم' : '30D') : tf === '90d' ? (isAr ? '٩٠ يوم' : '90D') : isAr ? 'سنة' : '1Y'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl dark:bg-slate-900/70 bg-white border dark:border-white/10 border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
              <span>{isAr ? 'إجمالي الزيارات الشهرية' : 'Monthly Engagements'}</span>
              <Eye className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold font-mono dark:text-white text-slate-900 tabular-nums">58.4K+</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-1">
              +18.4% {isAr ? 'مقارنة بالشهر السابق' : 'vs last period'}
            </div>
          </div>

          <div className="p-4 rounded-xl dark:bg-slate-900/70 bg-white border dark:border-white/10 border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
              <span>{isAr ? 'استدعاءات الـ API الحية' : 'REST API Calls'}</span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold font-mono dark:text-white text-slate-900 tabular-nums">242K+</div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-mono mt-1">
              &lt; 38ms {isAr ? 'متوسط سرعة الاستجابة' : 'avg response time'}
            </div>
          </div>

          <div className="p-4 rounded-xl dark:bg-slate-900/70 bg-white border dark:border-white/10 border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
              <span>{isAr ? 'التعديلات المعتمدة (Commits)' : 'Repository Commits'}</span>
              <GitCommit className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold font-mono dark:text-white text-slate-900 tabular-nums">1,240+</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-1">
              {isAr ? 'عبر 12+ مشروع نشط' : 'across 12+ projects'}
            </div>
          </div>

          <div className="p-4 rounded-xl dark:bg-slate-900/70 bg-white border dark:border-white/10 border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
              <span>{isAr ? 'جاهزية الخوادم والـ Uptime' : 'Production Uptime'}</span>
              <ShieldCheck className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-2xl font-bold font-mono dark:text-white text-slate-900 tabular-nums">99.96%</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-1">
              {isAr ? 'مع استقرار متكامل' : 'zero service outages'}
            </div>
          </div>
        </div>

        <div className="dark:bg-[#0c1220] bg-white border dark:border-white/10 border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xl transition-colors">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b dark:border-white/10 border-slate-200">
            <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-900/80 border dark:border-white/10 border-slate-300 text-xs font-medium">
              <button
                onClick={() => setActiveView('trends')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeView === 'trends'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{isAr ? 'مسار النمو' : 'Traffic Growth'}</span>
              </button>

              <button
                onClick={() => setActiveView('comparison')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeView === 'comparison'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>{isAr ? 'مقارنة المشاريع' : 'Project Breakdown'}</span>
              </button>

              <button
                onClick={() => setActiveView('radar')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeView === 'radar'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isAr ? 'عمق المهارات' : 'Tech Radar'}</span>
              </button>

              <button
                onClick={() => setActiveView('share')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeView === 'share'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <PieIcon className="w-3.5 h-3.5" />
                <span>{isAr ? 'توزيع المعمارية' : 'Architecture Share'}</span>
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span>{isAr ? 'الزيارات' : 'Engagements'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                <span>{isAr ? 'الجلسات والـ APIs' : 'Invocations'}</span>
              </span>
            </div>
          </div>

          <div className="w-full h-[340px] sm:h-[400px]">
            {activeView === 'trends' && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendsData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                    tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomGlassTooltip isAr={isAr} />} />
                  <Legend
                    wrapperStyle={{ paddingTop: 16 }}
                    formatter={(value) => (
                      <span className="text-xs dark:text-slate-300 text-slate-700 font-sans">
                        {value === 'views'
                          ? isAr
                            ? 'عدد الزيارات'
                            : 'Views'
                          : value === 'sessions'
                          ? isAr
                            ? 'الجلسات النشطة'
                            : 'Active Sessions'
                          : value}
                      </span>
                    )}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    name={isAr ? 'عدد الزيارات' : 'Views'}
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorViews)"
                  />
                  <Area
                    type="monotone"
                    dataKey="sessions"
                    name={isAr ? 'الجلسات النشطة' : 'Active Sessions'}
                    stroke="#38bdf8"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorSessions)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {activeView === 'comparison' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectComparisonData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(148, 163, 184, 0.2)' }}
                    tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomGlassTooltip isAr={isAr} />} />
                  <Legend
                    wrapperStyle={{ paddingTop: 16 }}
                    formatter={(value) => (
                      <span className="text-xs dark:text-slate-300 text-slate-700 font-sans">
                        {value === 'views'
                          ? isAr
                            ? 'الزيارات'
                            : 'Views'
                          : value === 'invocations'
                          ? isAr
                            ? 'استدعاءات API'
                            : 'API Calls'
                          : value === 'commits'
                          ? isAr
                            ? 'عدد الـ Commits'
                            : 'Commits'
                          : value}
                      </span>
                    )}
                  />
                  <Bar
                    dataKey="views"
                    name={isAr ? 'الزيارات' : 'Views'}
                    fill="#2563eb"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="invocations"
                    name={isAr ? 'استدعاءات API' : 'API Calls'}
                    fill="#38bdf8"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}

            {activeView === 'radar' && (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="75%">
                  <PolarGrid stroke="rgba(148, 163, 184, 0.2)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    stroke="#64748b"
                    tick={{ fill: '#64748b', fontSize: 9 }}
                  />
                  <Radar
                    name={isAr ? 'مستوى الاحتراف' : 'Proficiency Score'}
                    dataKey="score"
                    stroke="#38bdf8"
                    fill="#2563eb"
                    fillOpacity={0.45}
                    strokeWidth={2}
                  />
                  <Tooltip content={<CustomGlassTooltip isAr={isAr} />} />
                </RadarChart>
              </ResponsiveContainer>
            )}

            {activeView === 'share' && (
              <div className="w-full h-full flex flex-col md:flex-row items-center justify-around gap-6">
                <div className="w-full md:w-1/2 h-[260px] sm:h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={shareData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {shareData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomGlassTooltip isAr={isAr} />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="w-full md:w-1/2 space-y-3 font-mono text-xs">
                  {shareData.map((item) => (
                    <div
                      key={item.name}
                      className="p-3 rounded-xl dark:bg-slate-900/80 bg-slate-50 border dark:border-white/5 border-slate-200 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-sans font-medium dark:text-slate-200 text-slate-800">
                          {item.name}
                        </span>
                      </div>
                      <span className="font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                        {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
