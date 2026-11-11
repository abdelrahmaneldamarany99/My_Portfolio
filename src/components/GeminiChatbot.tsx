import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  RotateCcw,
  Minimize2,
  Maximize2,
  Terminal,
  CheckCircle2,
} from 'lucide-react';
import type { Language } from '../types/index.ts';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface GeminiChatbotProps {
  language: Language;
}

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

function getGreeting(lang: Language): Message {
  return {
    id: 'welcome',
    role: 'model',
    text:
      lang === 'ar'
        ? 'مرحباً بك! أنا المساعد التقني والمعماري للمهندس عبد الرحمن الضمراني.\n\nيمكنك الاستفسار عن خبرته العملية (+7 سنوات في React, Next.js و Full-Stack و +3 سنوات في الذكاء الاصطناعي)، أو استراتيجيات المعمارية النظيفة، ومشاريع مثل (نظام إدارة المهام، Nana Food، Car Wash Hub)، ومعايير جودة الكود واختبارات CI/CD.'
        : 'Welcome. I am the technical architectural assistant for Abdelrahman Eldamarany.\n\nAsk about his 7+ years of React, Next.js & Full-Stack production experience, 3+ years in AI/ML, architectural decisions, testing paradigms, or project case studies.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
}

export function GeminiChatbot({ language }: GeminiChatbotProps) {
  const isAr = language === 'ar';
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [messages, setMessages] = useState<Message[]>([getGreeting(language)]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'welcome') {
        return [getGreeting(language)];
      }
      return prev;
    });
  }, [language]);

  const quickPrompts = isAr
    ? [
        'ما هي معمارية MERN المعتمدة في مشاريعه؟',
        'اشرح معمارية نظام Task Management System',
        'كيف يضمن جودة الأكواد وحزم الاختبارات؟',
        'ما هي قنوات التواصل والتوظيف المتاحة؟',
      ]
    : [
        'Describe his MERN & Next.js architecture approach',
        'Explain the Task Management System architecture',
        'What automated testing & CI/CD strategies are used?',
        'How can I get in touch for senior engineering roles?',
      ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMessage: Message = {
      id: String(Date.now()),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          language,
        }),
      });

      const data = await res.json();
      const replyText = data.reply || (isAr ? 'عذراً، لم أتلق رداً صالحاً.' : 'Sorry, received an empty response.');

      const modelMessage: Message = {
        id: String(Date.now() + 1),
        role: 'model',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch {
      const errorMessage: Message = {
        id: String(Date.now() + 1),
        role: 'model',
        text: isAr
          ? 'حدث خطأ في الاتصال بالخادم. يرجى إعادة المحاولة لاحقاً.'
          : 'Network error communicating with the AI service. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: String(Date.now()),
        role: 'model',
        text: isAr ? 'تمت إعادة ضبط المحادثة. كيف يمكنني مساعدتك؟' : 'Chat session reset. How can I help you?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-4 py-2.5 rounded-xl dark:bg-slate-900 bg-white dark:hover:bg-slate-800 hover:bg-slate-50 text-slate-800 dark:text-slate-200 shadow-xl border dark:border-white/15 border-slate-300 transition-all cursor-pointer active:scale-95"
          title={isAr ? 'المساعد التقني والمعماري' : 'Technical Architecture Assistant'}
          aria-label="Open Technical Assistant"
        >
          <div className="relative flex items-center justify-center p-1.5 rounded-lg bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left rtl:text-right">
            <span className="text-xs font-bold leading-tight">
              {isAr ? 'المساعد التقني' : 'Technical Assistant'}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              {isAr ? 'استعلامات النظم' : 'System Queries'}
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 ms-1" />
        </button>
      )}

      {isOpen && (
        <div
          className={`fixed z-50 flex flex-col shadow-2xl transition-all duration-200 overflow-hidden border dark:border-white/10 border-slate-300 dark:bg-[#0B101B] bg-white ${
            isExpanded
              ? 'inset-4 md:inset-10 rounded-2xl'
              : 'bottom-4 right-4 md:bottom-6 md:right-6 w-[92vw] sm:w-[460px] h-[580px] max-h-[88vh] rounded-2xl'
          }`}
        >
          <div className="px-4 py-3.5 border-b dark:border-white/10 border-slate-200 dark:bg-slate-900/90 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-500">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold dark:text-white text-slate-900">
                    {isAr ? 'المساعد التقني والمعماري' : 'Technical Architecture Assistant'}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Online
                  </span>
                </div>
                <p className="text-[11px] dark:text-slate-400 text-slate-500 font-mono">
                  {isAr ? 'استعلامات معمارية وتفاصيل النظم' : 'Automated Systems & Architecture Queries'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={isAr ? 'إعادة ضبط المحادثة' : 'Reset Chat'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded((prev) => !prev)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={isExpanded ? 'Minimize' : 'Maximize'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title={isAr ? 'إغلاق' : 'Close'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm font-sans">
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed break-words whitespace-pre-wrap ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-br-xs shadow-md'
                        : 'dark:bg-slate-800/80 bg-slate-100 dark:text-slate-200 text-slate-800 rounded-bl-xs border dark:border-white/5 border-slate-200 shadow-xs'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">
                    {m.timestamp}
                  </span>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl dark:bg-slate-800/50 bg-slate-100 max-w-xs text-xs dark:text-slate-300 text-slate-600">
                <Terminal className="w-4 h-4 text-blue-500 animate-pulse" />
                <span>{isAr ? 'جاري استرجاع الاستجابة المعمارية...' : 'Querying architectural knowledge base...'}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 2 && (
            <div className="px-4 py-2 border-t dark:border-white/5 border-slate-100 flex flex-wrap gap-1.5 bg-slate-50/50 dark:bg-slate-900/30">
              {quickPrompts.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSendMessage(q)}
                  disabled={loading}
                  className="px-2.5 py-1 text-xs rounded-full dark:bg-slate-800 bg-white border dark:border-white/10 border-slate-200 hover:border-blue-500 hover:text-blue-500 dark:text-slate-300 text-slate-700 transition-all text-left truncate max-w-full cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="p-3 border-t dark:border-white/10 border-slate-200 dark:bg-slate-900/80 bg-slate-50 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={
                isAr
                  ? 'اكتب سؤالك الهندسي هنا (مثال: ما هي خبرتك في Microservices؟)'
                  : 'Ask about tech stack, projects, tests, or architecture...'
              }
              className="flex-1 px-3.5 py-2.5 rounded-xl text-sm dark:bg-slate-950 bg-white border dark:border-white/10 border-slate-300 dark:text-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition-colors cursor-pointer"
              title={isAr ? 'إرسال' : 'Send'}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
