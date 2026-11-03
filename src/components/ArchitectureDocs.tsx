import React, { useState } from 'react';
import { Send, Code, Terminal } from 'lucide-react';
import type { ArchitectureDoc, TerminalTheme, Language } from '../types/index.ts';
import { translations } from '../data/translations.ts';

interface ArchitectureDocsProps {
  docs: ArchitectureDoc[];
  terminalTheme?: TerminalTheme;
  language?: Language;
}

export function ArchitectureDocs({
  docs,
  terminalTheme = 'cobalt',
  language = 'en',
}: ArchitectureDocsProps) {
  const isRetro = terminalTheme === 'retro-green';
  const t = translations[language].docs;

  const [selectedDocId, setSelectedDocId] = useState<string>(docs[0]?.id || '');
  const [testEndpointUrl, setTestEndpointUrl] = useState<string>('/api/profile');
  const [responseOutput, setResponseOutput] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const activeDoc = docs.find((d) => d.id === selectedDocId) || docs[0];

  const handleTestEndpoint = async (path: string, method: 'GET' | 'POST' = 'GET') => {
    setIsLoading(true);
    setResponseOutput(null);
    setResponseStatus(null);
    const start = performance.now();

    try {
      const res = await fetch(path, {
        method,
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      const end = performance.now();
      setLatencyMs(Math.round(end - start));
      setResponseStatus(res.status);
      setResponseOutput(JSON.stringify(data, null, 2));
    } catch (err: unknown) {
      const end = performance.now();
      setLatencyMs(Math.round(end - start));
      setResponseStatus(500);
      setResponseOutput(JSON.stringify({ error: err instanceof Error ? err.message : 'Request failed' }, null, 2));
    } finally {
      setIsLoading(false);
    }
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

        <div className="flex items-center gap-1.5 dark:bg-slate-900 bg-slate-100 border dark:border-white/10 border-slate-200 rounded-lg p-1 text-xs font-mono">
          {docs.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setSelectedDocId(doc.id)}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                activeDoc?.id === doc.id
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'dark:text-slate-400 text-slate-600 hover:dark:text-white hover:text-slate-900'
              }`}
            >
              {doc.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {activeDoc && (
        <div className="dark:bg-[#0D1424] bg-white border dark:border-white/10 border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm transition-colors">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
              {activeDoc.category} architecture
            </div>
            <h4 className="text-xl font-bold dark:text-white text-slate-900 mb-2">
              {activeDoc.title}
            </h4>
            <p className="text-sm dark:text-slate-300 text-slate-600 leading-relaxed">
              {activeDoc.summary}
            </p>
          </div>

          <div className="text-sm dark:text-slate-300 text-slate-600 leading-relaxed dark:bg-slate-900/60 bg-slate-50 p-5 rounded-xl border dark:border-white/5 border-slate-200">
            {activeDoc.content}
          </div>

          {activeDoc.asciiDiagram && (
            <div>
              <div className="text-xs font-mono font-medium dark:text-slate-400 text-slate-600 mb-2 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Architecture Diagram</span>
              </div>
              <pre className={`p-4 rounded-xl border text-[11px] font-mono overflow-x-auto leading-relaxed ${
                isRetro
                  ? 'bg-[#030C05] border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                  : 'dark:bg-slate-950 bg-slate-900 text-slate-200 border-slate-800'
              }`}>
                {activeDoc.asciiDiagram}
              </pre>
            </div>
          )}

          {activeDoc.endpoints && activeDoc.endpoints.length > 0 && (
            <div className="space-y-4 pt-4 border-t dark:border-white/10 border-slate-200">
              <div className="text-xs font-semibold uppercase tracking-wider dark:text-slate-400 text-slate-600">
                {t.endpointsSpec}
              </div>

              <div className="grid grid-cols-1 gap-3">
                {activeDoc.endpoints.map((ep, idx) => (
                  <div
                    key={idx}
                    className="dark:bg-slate-900/90 bg-slate-50 border dark:border-white/10 border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span
                          className={`px-2 py-0.5 rounded font-bold ${
                            ep.method === 'GET'
                              ? 'dark:bg-blue-900/60 bg-blue-100 text-blue-700 dark:text-blue-400 border border-blue-500/30'
                              : 'dark:bg-emerald-900/60 bg-emerald-100 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {ep.method}
                        </span>
                        <span className="dark:text-white text-slate-900 font-semibold font-mono">{ep.path}</span>
                      </div>
                      <p className="text-xs dark:text-slate-400 text-slate-600 mt-1">
                        {ep.description}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setTestEndpointUrl(ep.path);
                        handleTestEndpoint(ep.path, ep.method === 'GET' ? 'GET' : 'GET');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold dark:text-white text-slate-700 dark:bg-slate-800 bg-white hover:dark:bg-slate-700 hover:bg-slate-100 border dark:border-white/10 border-slate-300 rounded-lg transition-colors whitespace-nowrap self-start md:self-auto shadow-xs"
                    >
                      <Send className="w-3 h-3 text-blue-600 dark:text-blue-400 rtl:rotate-180" />
                      <span>{t.testEndpoint}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-6 border-t dark:border-white/10 border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono font-medium dark:text-slate-400 text-slate-600 flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{t.liveResponseTitle}</span>
              </div>
              {responseStatus !== null && (
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className={responseStatus < 400 ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-rose-600 dark:text-rose-400 font-semibold'}>
                    HTTP {responseStatus}
                  </span>
                  {latencyMs !== null && (
                    <span className="dark:text-slate-400 text-slate-500">{latencyMs} ms</span>
                  )}
                </div>
              )}
            </div>

            <div className={`p-4 rounded-xl border transition-all duration-300 ${
              isRetro
                ? 'bg-[#020A03] border-emerald-500/40 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                : 'dark:bg-slate-950 bg-slate-900 border-slate-800 dark:border-white/10'
            }`}>
              {isLoading ? (
                <div className={`text-xs font-mono py-6 text-center ${isRetro ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {t.executing} {testEndpointUrl}...
                </div>
              ) : responseOutput ? (
                <pre className={`text-xs font-mono max-h-72 overflow-y-auto leading-relaxed ${
                  isRetro
                    ? 'text-emerald-300 drop-shadow-[0_0_4px_rgba(52,211,153,0.4)]'
                    : 'text-emerald-400'
                }`}>
                  {responseOutput}
                </pre>
              ) : (
                <div className={`text-xs font-mono py-4 text-center ${isRetro ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {t.standbyNote}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
