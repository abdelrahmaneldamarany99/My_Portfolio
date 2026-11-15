import React, { useState } from 'react';
import { Hammer, X } from 'lucide-react';
import type { Language } from '../types/index.ts';

const DISMISS_KEY = 'portfolio-dev-notice-dismissed';

interface DevNoticeProps {
  language: Language;
}

export function DevNotice({ language }: DevNoticeProps) {
  const [visible, setVisible] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) !== '1';
    } catch {
      return true;
    }
  });

  if (!visible) return null;

  const isAr = language === 'ar';

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      void 0;
    }
  };

  return (
    <div className="border-b border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-center gap-3 text-center">
        <Hammer className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <p className="text-xs sm:text-sm font-medium text-amber-800 dark:text-amber-200/90">
          {isAr
            ? 'هذا الموقع قيد التطوير والتحسين المستمر — بعض الأقسام قد تتغير أثناء العمل.'
            : 'This site is currently under active development and improvement — some sections may change as work continues.'}
        </p>
        <button
          onClick={dismiss}
          className="p-1 rounded-md text-amber-700 dark:text-amber-300/80 hover:bg-amber-500/20 transition-colors cursor-pointer shrink-0"
          aria-label={isAr ? 'إغلاق التنبيه' : 'Dismiss notice'}
          title={isAr ? 'إغلاق' : 'Dismiss'}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
