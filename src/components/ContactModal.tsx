import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { submitContact } from '../services/api.ts';
import type { ProfileData, Language } from '../types/index.ts';
import { translations } from '../data/translations.ts';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
  language: Language;
}

export function ContactModal({ isOpen, onClose, profile, language }: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const t = translations[language].contact;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة.' : 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await submitContact({
        name,
        email,
        subject,
        message,
      });
      setIsSuccess(true);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="dark:bg-[#0D1424] bg-white border dark:border-white/15 border-slate-200 rounded-2xl w-full max-w-xl p-6 sm:p-8 shadow-2xl relative transition-colors">
        <div className="flex items-center justify-between pb-4 mb-6 border-b dark:border-white/10 border-slate-200">
          <div>
            <h3 className="text-xl font-bold dark:text-white text-slate-900">{t.title}</h3>
            <p className="text-xs dark:text-slate-400 text-slate-600 mt-0.5">
              {t.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 dark:text-slate-400 text-slate-500 hover:dark:text-white hover:text-slate-900 rounded-lg dark:hover:bg-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold dark:text-white text-slate-900">{t.successTitle}</h4>
            <p className="text-xs dark:text-slate-300 text-slate-600 max-w-sm mx-auto leading-relaxed">
              {t.successMessage}
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                setName('');
                setEmail('');
                setMessage('');
                setSubject('');
                onClose();
              }}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow-sm"
            >
              {t.close}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600 dark:text-red-400">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block dark:text-slate-300 text-slate-700 font-medium mb-1">{t.nameLabel}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 dark:bg-slate-900 bg-white border dark:border-white/10 border-slate-300 rounded-lg dark:text-white text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block dark:text-slate-300 text-slate-700 font-medium mb-1">{t.emailLabel}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 dark:bg-slate-900 bg-white border dark:border-white/10 border-slate-300 rounded-lg dark:text-white text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block dark:text-slate-300 text-slate-700 font-medium mb-1">{t.subjectLabel}</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Senior MERN / Next.js Role or Project Inquiry"
                className="w-full px-3 py-2 dark:bg-slate-900 bg-white border dark:border-white/10 border-slate-300 rounded-lg dark:text-white text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block dark:text-slate-300 text-slate-700 font-medium mb-1">{t.messageLabel}</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Outline project timeline, role scope, or engineering details..."
                className="w-full px-3 py-2 dark:bg-slate-900 bg-white border dark:border-white/10 border-slate-300 rounded-lg dark:text-white text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-[11px] dark:text-slate-400 text-slate-500">
                {t.direct} <a href={`mailto:${profile.email}`} className="text-blue-600 dark:text-blue-400 hover:underline font-mono">{profile.email}</a>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 dark:text-slate-400 text-slate-600 hover:dark:text-white hover:text-slate-900"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                  <span>{isSubmitting ? t.sending : t.send}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
