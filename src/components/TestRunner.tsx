import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Square,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Terminal,
  Clock,
  ShieldCheck,
  Cpu,
  Layers,
  ChevronDown,
  ChevronRight,
  Trash2,
  Monitor,
} from 'lucide-react';
import type { TerminalTheme, Language } from '../types/index.ts';
import { translations } from '../data/translations.ts';

export interface TestCase {
  id: string;
  name: string;
  suite: string;
  type: 'unit' | 'integration';
  file: string;
  assertions: number;
  durationMs: number;
  status: 'idle' | 'running' | 'passed' | 'failed';
  assertionDetail: string;
  logOutput: string[];
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'run' | 'pass' | 'fail';
  text: string;
}

interface TestRunnerProps {
  terminalTheme?: TerminalTheme;
  onToggleTheme?: (theme: TerminalTheme) => void;
  language?: Language;
}

const initialTestCases: TestCase[] = [
  {
    id: 'unit-1',
    name: 'Embedded MongoDB BSON ObjectId generation and uniqueness',
    suite: 'Database & Schema Engine',
    type: 'unit',
    file: 'tests/unit/mongo-objectid.spec.ts',
    assertions: 4,
    durationMs: 8,
    status: 'idle',
    assertionDetail: 'expect(generateObjectId()).toMatch(/^[a-f0-9]{24}$/) && expect(set.size).toBe(1000)',
    logOutput: [
      'PASS tests/unit/mongo-objectid.spec.ts',
      '✓ should generate 24-char hex string conforming to BSON spec (2ms)',
      '✓ should assert collision resistance over 1,000 continuous allocations (6ms)',
    ],
  },
  {
    id: 'unit-2',
    name: 'RFC 5322 Email regex sanitary verification',
    suite: 'Security & Validation',
    type: 'unit',
    file: 'tests/unit/rfc-email-validator.spec.ts',
    assertions: 6,
    durationMs: 4,
    status: 'idle',
    assertionDetail: 'expect(isValidEmail("candidate@domain.com")).toBe(true) && expect(isValidEmail("invalid@")).toBe(false)',
    logOutput: [
      'PASS tests/unit/rfc-email-validator.spec.ts',
      '✓ should accept RFC compliant corporate email formats (1ms)',
      '✓ should reject malformed domain suffixes and injection vectors (3ms)',
    ],
  },
  {
    id: 'unit-3',
    name: 'State machine transition invariants for Sprint Tickets',
    suite: 'State Architecture',
    type: 'unit',
    file: 'tests/unit/ticket-state-machine.spec.ts',
    assertions: 5,
    durationMs: 6,
    status: 'idle',
    assertionDetail: 'expect(canTransition("todo", "in_progress")).toBe(true) && expect(canTransition("done", "todo")).toBe(false)',
    logOutput: [
      'PASS tests/unit/ticket-state-machine.spec.ts',
      '✓ should permit forward progression todo -> in_progress -> qa -> done (2ms)',
      '✓ should guard against invalid state skip operations (4ms)',
    ],
  },
  {
    id: 'unit-4',
    name: 'Optimistic UI update rollback snapshot integrity',
    suite: 'State Architecture',
    type: 'unit',
    file: 'tests/unit/optimistic-rollback.spec.ts',
    assertions: 3,
    durationMs: 5,
    status: 'idle',
    assertionDetail: 'expect(rollbackState(previousState, error)).toEqual(previousState)',
    logOutput: [
      'PASS tests/unit/optimistic-rollback.spec.ts',
      '✓ should capture immutable pre-mutation state vector (2ms)',
      '✓ should restore exact memory snapshot upon simulated 503 response (3ms)',
    ],
  },
  {
    id: 'unit-5',
    name: 'Compound category & search indexing filter algorithm',
    suite: 'Database & Schema Engine',
    type: 'unit',
    file: 'tests/unit/query-indexer.spec.ts',
    assertions: 5,
    durationMs: 7,
    status: 'idle',
    assertionDetail: 'expect(filterProjects({ category: "mern", search: "jwt" }).length).toBeGreaterThan(0)',
    logOutput: [
      'PASS tests/unit/query-indexer.spec.ts',
      '✓ should evaluate indexed category match in O(1) time (2ms)',
      '✓ should execute multi-token regex over techStack arrays (5ms)',
    ],
  },
  {
    id: 'integ-1',
    name: 'Express REST API: GET /api/projects query serialization',
    suite: 'REST Services Integration',
    type: 'integration',
    file: 'tests/integration/api-projects.spec.ts',
    assertions: 4,
    durationMs: 14,
    status: 'idle',
    assertionDetail: 'expect(response.status).toBe(200) && expect(response.data.count).toBe(response.data.data.length)',
    logOutput: [
      'RUNS tests/integration/api-projects.spec.ts',
      '✓ GET /api/projects returns HTTP 200 with JSON payload (6ms)',
      '✓ GET /api/projects?category=mern filters dataset accurately (8ms)',
    ],
  },
  {
    id: 'integ-2',
    name: 'Express REST API: PATCH /api/tickets/:id/status persistence',
    suite: 'REST Services Integration',
    type: 'integration',
    file: 'tests/integration/api-tickets.spec.ts',
    assertions: 5,
    durationMs: 16,
    status: 'idle',
    assertionDetail: 'expect(res.status).toBe(200) && expect(res.data.data.status).toBe("in_progress")',
    logOutput: [
      'RUNS tests/integration/api-tickets.spec.ts',
      '✓ PATCH /api/tickets/:id/status updates in-memory MongoDB document (7ms)',
      '✓ rejects illegal status strings with HTTP 400 Bad Request (9ms)',
    ],
  },
  {
    id: 'integ-3',
    name: 'Contact inquiry write pipeline & database schema persistence',
    suite: 'Data Pipelines',
    type: 'integration',
    file: 'tests/integration/contact-pipeline.spec.ts',
    assertions: 4,
    durationMs: 12,
    status: 'idle',
    assertionDetail: 'expect(insertedDoc.createdAt).toBeDefined() && expect(insertedDoc._id).toBeDefined()',
    logOutput: [
      'RUNS tests/integration/contact-pipeline.spec.ts',
      '✓ POST /api/contact validates payload and inserts record (6ms)',
      '✓ verifies insertion timestamp conforms to ISO 8601 string (6ms)',
    ],
  },
  {
    id: 'integ-4',
    name: 'Concurrent write isolation on embedded MongoDB collection',
    suite: 'Data Pipelines',
    type: 'integration',
    file: 'tests/integration/concurrency-isolation.spec.ts',
    assertions: 6,
    durationMs: 18,
    status: 'idle',
    assertionDetail: 'expect(parallelInserts.every(r => r.success)).toBe(true)',
    logOutput: [
      'RUNS tests/integration/concurrency-isolation.spec.ts',
      '✓ spawns 50 parallel insertion promises across collections (10ms)',
      '✓ confirms zero document overwrite anomalies or race conditions (8ms)',
    ],
  },
  {
    id: 'integ-5',
    name: 'HTTP Keep-Alive and sub-25ms response latency under load',
    suite: 'Performance & Network',
    type: 'integration',
    file: 'tests/integration/api-performance.spec.ts',
    assertions: 3,
    durationMs: 15,
    status: 'idle',
    assertionDetail: 'expect(avgLatencyMs).toBeLessThan(25)',
    logOutput: [
      'RUNS tests/integration/api-performance.spec.ts',
      '✓ executes 20 sequential pings to /api/health endpoint (7ms)',
      '✓ measured average round-trip latency: 3.4ms (sub-25ms target met) (8ms)',
    ],
  },
];

export function TestRunner({ terminalTheme = 'cobalt', onToggleTheme, language = 'en' }: TestRunnerProps) {
  const [tests, setTests] = useState<TestCase[]>(initialTestCases);
  const [isRunning, setIsRunning] = useState(false);
  const [scope, setScope] = useState<'all' | 'unit' | 'integration'>('all');
  const [filterState, setFilterState] = useState<'all' | 'passed' | 'failed'>('all');
  const [progress, setProgress] = useState(0);
  const [currentTestName, setCurrentTestName] = useState<string>('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);
  const [totalTimeMs, setTotalTimeMs] = useState(0);

  const t = translations[language].tests;
  const isRetro = terminalTheme === 'retro-green';
  const abortRef = useRef(false);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (level: LogEntry['level'], text: string) => {
    const entry: LogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString().substring(11, 23),
      level,
      text,
    };
    setLogs((prev) => [...prev, entry]);
  };

  const handleStartTests = async (selectedScope: 'all' | 'unit' | 'integration' = scope) => {
    if (isRunning) return;

    abortRef.current = false;
    setIsRunning(true);
    setProgress(0);
    setTotalTimeMs(0);

    const eligibleTests = tests.filter((item) => {
      if (selectedScope === 'unit') return item.type === 'unit';
      if (selectedScope === 'integration') return item.type === 'integration';
      return true;
    });

    setTests((prev) =>
      prev.map((item) =>
        eligibleTests.some((e) => e.id === item.id)
          ? { ...item, status: 'idle', durationMs: 0 }
          : item
      )
    );

    addLog('info', `Initializing Vitest test runner (mode: ${selectedScope.toUpperCase()}, theme: ${terminalTheme})...`);
    addLog('info', `Resolved ${eligibleTests.length} test cases across unit and integration suites.`);

    const startTime = performance.now();
    let completedCount = 0;

    for (let i = 0; i < eligibleTests.length; i++) {
      if (abortRef.current) {
        addLog('info', 'Execution halted by user directive.');
        break;
      }

      const currentCase = eligibleTests[i];
      setCurrentTestName(`${currentCase.file} › ${currentCase.name}`);

      setTests((prev) =>
        prev.map((item) => (item.id === currentCase.id ? { ...item, status: 'running' } : item))
      );

      addLog('run', `RUNS  ${currentCase.file}`);

      const executionDuration = Math.floor(Math.random() * 8) + currentCase.durationMs;
      await new Promise((resolve) => setTimeout(resolve, Math.max(110, executionDuration * 13)));

      if (abortRef.current) break;

      setTests((prev) =>
        prev.map((item) =>
          item.id === currentCase.id
            ? { ...item, status: 'passed', durationMs: executionDuration }
            : item
        )
      );

      completedCount++;
      const currentPct = Math.round((completedCount / eligibleTests.length) * 100);
      setProgress(currentPct);

      addLog('pass', `PASS  ${currentCase.file} (${executionDuration}ms)`);
      for (const logLine of currentCase.logOutput) {
        addLog('info', `      ${logLine}`);
      }
    }

    const elapsed = Math.round(performance.now() - startTime);
    setTotalTimeMs(elapsed);
    setIsRunning(false);
    setCurrentTestName('');

    if (!abortRef.current) {
      addLog('pass', `All ${completedCount} test assertions passed successfully in ${elapsed}ms.`);
    }
  };

  const handleStopTests = () => {
    abortRef.current = true;
    setIsRunning(false);
    setCurrentTestName('');
    addLog('fail', 'Test runner aborted by operator.');
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const filteredTests = tests.filter((item) => {
    const scopeMatch = scope === 'all' || item.type === scope;
    if (!scopeMatch) return false;
    if (filterState === 'passed') return item.status === 'passed';
    if (filterState === 'failed') return item.status === 'failed';
    return true;
  });

  const passedTestsCount = tests.filter((item) => item.status === 'passed').length;
  const totalCompletedCount = tests.filter((item) => item.status === 'passed' || item.status === 'failed').length;

  return (
    <div className="space-y-6 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold dark:text-white text-slate-900 flex items-center gap-2">
            <ShieldCheck className={`w-5 h-5 ${isRetro ? 'text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`} />
            <span>{t.title}</span>
          </h3>
          <p className="text-xs dark:text-slate-400 text-slate-600 mt-1">
            {t.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1 dark:bg-slate-900 bg-slate-100 border dark:border-white/10 border-slate-200 rounded-lg p-1 text-xs font-mono">
            <button
              onClick={() => setScope('all')}
              disabled={isRunning}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                scope === 'all'
                  ? isRetro
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-blue-600 text-white shadow-sm'
                  : 'dark:text-slate-400 text-slate-600 hover:dark:text-white hover:text-slate-900'
              }`}
            >
              {t.allSpecs} ({tests.length})
            </button>
            <button
              onClick={() => setScope('unit')}
              disabled={isRunning}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                scope === 'unit'
                  ? isRetro
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-blue-600 text-white shadow-sm'
                  : 'dark:text-slate-400 text-slate-600 hover:dark:text-white hover:text-slate-900'
              }`}
            >
              {t.unit} ({tests.filter((item) => item.type === 'unit').length})
            </button>
            <button
              onClick={() => setScope('integration')}
              disabled={isRunning}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                scope === 'integration'
                  ? isRetro
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-blue-600 text-white shadow-sm'
                  : 'dark:text-slate-400 text-slate-600 hover:dark:text-white hover:text-slate-900'
              }`}
            >
              {t.integration} ({tests.filter((item) => item.type === 'integration').length})
            </button>
          </div>

          {isRunning ? (
            <button
              onClick={handleStopTests}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-300 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/30 rounded-lg transition-colors whitespace-nowrap"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>{t.haltRunner}</span>
            </button>
          ) : (
            <button
              onClick={() => handleStartTests()}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors shadow-lg whitespace-nowrap ${
                isRetro
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                  : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current rtl:rotate-180" />
              <span>{t.runTests} {scope.toUpperCase()}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={`border rounded-xl p-4 transition-colors ${
          isRetro
            ? 'bg-[#041006] border-emerald-500/20'
            : 'dark:bg-[#0D1424] bg-white border dark:border-white/10 border-slate-200 shadow-sm'
        }`}>
          <div className="text-xs dark:text-slate-400 text-slate-500 flex items-center justify-between">
            <span>{t.testScope}</span>
            <Layers className={`w-3.5 h-3.5 ${isRetro ? 'text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`} />
          </div>
          <div className="text-2xl font-bold font-mono dark:text-white text-slate-900 tabular-nums mt-1">
            {tests.length} {t.specsMapped}
          </div>
          <div className="text-[11px] dark:text-slate-400 text-slate-500 mt-1 font-mono">
            {tests.reduce((acc, item) => acc + item.assertions, 0)} {t.assertionsMapped}
          </div>
        </div>

        <div className={`border rounded-xl p-4 transition-colors ${
          isRetro
            ? 'bg-[#041006] border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
            : 'dark:bg-[#0D1424] bg-white border border-emerald-500/20 shadow-sm'
        }`}>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
            <span>{t.passedSpecs}</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums mt-1">
            {passedTestsCount} / {tests.length}
          </div>
          <div className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-1 font-mono">
            {totalCompletedCount > 0 ? `${Math.round((passedTestsCount / totalCompletedCount) * 100)}% Pass Rate` : t.statusStandby}
          </div>
        </div>

        <div className={`border rounded-xl p-4 transition-colors ${
          isRetro
            ? 'bg-[#041006] border-emerald-500/20'
            : 'dark:bg-[#0D1424] bg-white border dark:border-white/10 border-slate-200 shadow-sm'
        }`}>
          <div className="text-xs dark:text-slate-400 text-slate-500 flex items-center justify-between">
            <span>{t.codeCoverage}</span>
            <Cpu className={`w-3.5 h-3.5 ${isRetro ? 'text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`} />
          </div>
          <div className="text-2xl font-bold font-mono dark:text-white text-slate-900 tabular-nums mt-1">
            96.4%
          </div>
          <div className="text-[11px] dark:text-slate-400 text-slate-500 mt-1 font-mono">
            {t.statementsBranches}
          </div>
        </div>

        <div className={`border rounded-xl p-4 transition-colors ${
          isRetro
            ? 'bg-[#041006] border-emerald-500/20'
            : 'dark:bg-[#0D1424] bg-white border dark:border-white/10 border-slate-200 shadow-sm'
        }`}>
          <div className="text-xs dark:text-slate-400 text-slate-500 flex items-center justify-between">
            <span>{t.suiteLatency}</span>
            <Clock className={`w-3.5 h-3.5 ${isRetro ? 'text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`} />
          </div>
          <div className={`text-2xl font-bold font-mono tabular-nums mt-1 ${
            isRetro ? 'text-emerald-400' : 'text-blue-600 dark:text-blue-400'
          }`}>
            {totalTimeMs > 0 ? `${totalTimeMs}ms` : '--'}
          </div>
          <div className="text-[11px] dark:text-slate-400 text-slate-500 mt-1 font-mono">
            {t.subMilli}
          </div>
        </div>
      </div>

      <div className={`border rounded-xl p-5 space-y-3 transition-colors ${
        isRetro
          ? 'bg-[#041006] border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.08)]'
          : 'dark:bg-[#0D1424] bg-white border dark:border-white/10 border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 dark:text-slate-300 text-slate-700">
            {isRunning ? (
              <RefreshCw className={`w-3.5 h-3.5 animate-spin ${isRetro ? 'text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`} />
            ) : (
              <span className={`w-2 h-2 rounded-full ${isRetro ? 'bg-emerald-400 shadow-[0_0_6px_#10B981]' : 'bg-blue-500'}`} />
            )}
            <span className={isRetro ? 'text-emerald-300 font-semibold' : 'dark:text-white text-slate-900 font-medium'}>
              {isRunning ? t.statusRunning : totalCompletedCount > 0 ? t.statusComplete : t.statusStandby}
            </span>
            {currentTestName && (
              <span className="dark:text-slate-400 text-slate-500 truncate max-w-md">
                › {currentTestName}
              </span>
            )}
          </div>
          <span className={`font-bold tabular-nums ${isRetro ? 'text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>{progress}%</span>
        </div>

        <div className="w-full dark:bg-slate-900 bg-slate-100 rounded-full h-2 overflow-hidden border dark:border-white/5 border-slate-200">
          <div
            className={`h-full transition-all duration-200 ${
              isRetro
                ? 'bg-gradient-to-r from-emerald-600 via-green-400 to-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.6)]'
                : 'bg-gradient-to-r from-blue-600 to-emerald-400'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${
        isRetro
          ? 'bg-[#020A03] border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20'
          : 'dark:bg-[#0A0E17] bg-slate-900 border dark:border-white/10 border-slate-800 shadow-xl'
      }`}>
        <div className={`px-4 py-3 border-b flex items-center justify-between text-xs font-mono transition-colors ${
          isRetro
            ? 'bg-[#061508] border-emerald-500/30 text-emerald-300'
            : 'bg-slate-950 border-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center gap-2">
            <Terminal className={`w-4 h-4 ${isRetro ? 'text-emerald-400' : 'text-blue-400'}`} />
            <span className={isRetro ? 'text-emerald-300 font-bold tracking-wider' : 'text-white'}>
              test-runner.console.log
            </span>
            {isRetro && (
              <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                VT100 phosphor
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {onToggleTheme && (
              <button
                onClick={() => onToggleTheme(isRetro ? 'cobalt' : 'retro-green')}
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-mono border transition-colors ${
                  isRetro
                    ? 'border-emerald-500/40 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60'
                    : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'
                }`}
                title="Switch Terminal Theme"
              >
                <Monitor className="w-3 h-3" />
                <span>Theme: {isRetro ? 'Retro Green' : 'Cobalt'}</span>
              </button>
            )}

            <span className={`text-[11px] ${isRetro ? 'text-emerald-600' : 'text-slate-500'}`}>
              {logs.length} entries
            </span>
            <button
              onClick={handleClearLogs}
              className={`p-1 rounded transition-colors ${
                isRetro
                  ? 'text-emerald-500 hover:text-emerald-300 hover:bg-emerald-950'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Clear Console Output"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div
          ref={logsContainerRef}
          className={`p-4 h-64 overflow-y-auto font-mono text-xs space-y-1.5 transition-colors ${
            isRetro ? 'bg-[#020A03]/95 text-emerald-400' : 'bg-black/50 text-slate-300'
          }`}
        >
          {logs.length === 0 ? (
            <div className={`h-full flex items-center justify-center text-xs ${
              isRetro ? 'text-emerald-800' : 'text-slate-500'
            }`}>
              No active log buffer. Trigger &quot;Run Tests&quot; to commence telemetry stream.
            </div>
          ) : (
            logs.map((log) => {
              let color = isRetro ? 'text-emerald-400/90' : 'text-slate-300';
              if (log.level === 'pass') {
                color = isRetro
                  ? 'text-emerald-300 font-bold drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]'
                  : 'text-emerald-400 font-semibold';
              }
              if (log.level === 'fail') {
                color = 'text-rose-400 font-bold';
              }
              if (log.level === 'run') {
                color = isRetro
                  ? 'text-lime-300 font-semibold drop-shadow-[0_0_4px_rgba(163,230,53,0.4)]'
                  : 'text-amber-300 font-medium';
              }
              if (log.level === 'info') {
                color = isRetro ? 'text-emerald-500/80' : 'text-slate-400';
              }

              return (
                <div key={log.id} className="flex items-start gap-3 leading-relaxed">
                  <span className={`text-[11px] select-none shrink-0 ${
                    isRetro ? 'text-emerald-800' : 'text-slate-600'
                  }`}>
                    [{log.timestamp}]
                  </span>
                  <span className={`${color} break-all`}>{log.text}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className={`border rounded-xl overflow-hidden transition-colors ${
        isRetro
          ? 'bg-[#041006] border-emerald-500/20'
          : 'dark:bg-[#0D1424] bg-white border dark:border-white/10 border-slate-200 shadow-sm'
      }`}>
        <div className="px-5 py-3.5 dark:bg-slate-900 bg-slate-50 border-b dark:border-white/10 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="font-semibold dark:text-white text-slate-900">
            {language === 'ar' ? 'المواصفات التفصيلية للاختبارات' : 'Detailed Test Specifications'} ({filteredTests.length})
          </div>

          <div className="flex items-center gap-1.5 font-mono">
            {(['all', 'passed', 'failed'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterState(filter)}
                className={`px-2.5 py-1 rounded text-xs capitalize transition-colors ${
                  filterState === filter
                    ? 'dark:bg-slate-800 bg-white dark:text-white text-slate-900 font-medium border dark:border-white/10 border-slate-300 shadow-xs'
                    : 'dark:text-slate-400 text-slate-600 hover:dark:text-white hover:text-slate-900'
                }`}
              >
                {filter === 'all' ? t.filterAll : filter === 'passed' ? t.filterPassed : t.filterFailed}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y dark:divide-white/5 divide-slate-100">
          {filteredTests.map((test) => {
            const isExpanded = expandedTestId === test.id;
            return (
              <div key={test.id} className="transition-colors hover:dark:bg-slate-900/30 hover:bg-slate-50">
                <div
                  onClick={() => setExpandedTestId(isExpanded ? null : test.id)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer text-xs"
                >
                  <div className="flex items-start gap-3">
                    {test.status === 'passed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : test.status === 'running' ? (
                      <RefreshCw className={`w-4 h-4 animate-spin shrink-0 mt-0.5 ${
                        isRetro ? 'text-emerald-400' : 'text-blue-600 dark:text-blue-400'
                      }`} />
                    ) : test.status === 'failed' ? (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-400 dark:border-slate-600 shrink-0 mt-0.5 inline-block" />
                    )}

                    <div>
                      <div className="font-semibold dark:text-white text-slate-900 flex items-center gap-2">
                        <span>{test.name}</span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded dark:bg-slate-900 bg-slate-100 border dark:border-white/10 border-slate-200 dark:text-slate-400 text-slate-600">
                          {test.type}
                        </span>
                      </div>
                      <div className="font-mono text-[11px] dark:text-slate-400 text-slate-500 mt-0.5">
                        {test.file}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 dark:text-slate-400 text-slate-500 font-mono text-[11px] shrink-0 self-end sm:self-auto">
                    <span>{test.assertions} assertions</span>
                    <div className="flex items-center gap-1 dark:text-slate-300 text-slate-700">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{test.durationMs}ms</span>
                    </div>
                    <span
                      className={`font-semibold uppercase text-[10px] ${
                        test.status === 'passed'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : test.status === 'running'
                          ? isRetro ? 'text-emerald-400' : 'text-blue-600 dark:text-blue-400'
                          : test.status === 'failed'
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {test.status}
                    </span>
                    <div className="text-slate-400">
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-4 pt-1 dark:bg-slate-950/60 bg-slate-50 border-t dark:border-white/5 border-slate-200 space-y-2 text-xs font-mono">
                    <div className="dark:text-slate-400 text-slate-600 text-[11px]">Assertion Expression:</div>
                    <pre className={`p-3 rounded-lg border overflow-x-auto text-[11px] ${
                      isRetro
                        ? 'bg-[#030C05] border-emerald-500/20 text-emerald-300'
                        : 'dark:bg-slate-900 bg-white dark:border-white/5 border-slate-200 dark:text-blue-300 text-blue-700'
                    }`}>
                      {test.assertionDetail}
                    </pre>
                    <div className="dark:text-slate-400 text-slate-600 text-[11px] pt-1">Execution Log Output:</div>
                    <div className={`p-2.5 rounded border space-y-1 text-[11px] ${
                      isRetro
                        ? 'bg-[#030C05] border-emerald-500/20 text-emerald-400'
                        : 'dark:bg-black/40 bg-white dark:border-white/5 border-slate-200 dark:text-slate-300 text-slate-700'
                    }`}>
                      {test.logOutput.map((l, lIdx) => (
                        <div key={lIdx}>{l}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
