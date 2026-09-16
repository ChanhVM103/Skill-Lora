import React from 'react';
import { X, Sun, Moon, Globe, Check, Settings, Sparkles } from 'lucide-react';
import { Language, ThemeMode, translations } from '../../i18n/translations';

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  theme,
  onThemeChange,
}) => {
  if (!isOpen) return null;

  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-ueh-green/20 dark:bg-ueh-green/30 text-ueh-green flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                {t.customizationTitle}
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                {t.customizationDesc}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-neutral-200/60 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* 1. Theme Setting (Sáng / Tối) */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.theme}</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Light Mode Option */}
              <button
                onClick={() => onThemeChange('light')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  theme === 'light'
                    ? 'border-ueh-green bg-green-50/50 text-neutral-900 ring-2 ring-ueh-green/30 font-semibold shadow-xs'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Sun className="w-4 h-4" />
                </div>
                <span className="text-xs">{t.lightMode}</span>
                {theme === 'light' && (
                  <span className="text-[10px] bg-ueh-green text-white px-2 py-0.2 rounded-full font-bold flex items-center gap-1">
                    <Check className="w-2.5 h-2.5" /> Đang dùng
                  </span>
                )}
              </button>

              {/* Dark Mode Option */}
              <button
                onClick={() => onThemeChange('dark')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  theme === 'dark'
                    ? 'border-ueh-green bg-neutral-800 text-white ring-2 ring-ueh-green/30 font-semibold shadow-xs'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center justify-center">
                  <Moon className="w-4 h-4" />
                </div>
                <span className="text-xs">{t.darkMode}</span>
                {theme === 'dark' && (
                  <span className="text-[10px] bg-ueh-green text-white px-2 py-0.2 rounded-full font-bold flex items-center gap-1">
                    <Check className="w-2.5 h-2.5" /> Đang dùng
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* 2. Language Setting (Tiếng Việt / English) */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              <span>{t.language}</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Vietnamese Option */}
              <button
                onClick={() => onLanguageChange('vi')}
                className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                  language === 'vi'
                    ? 'border-ueh-teal dark:border-teal-500 bg-teal-50/50 dark:bg-teal-950/40 text-neutral-900 dark:text-white font-semibold ring-2 ring-ueh-teal/20 shadow-xs'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇻🇳</span>
                  <span className="text-xs">{t.vietnamese}</span>
                </div>
                {language === 'vi' && <Check className="w-4 h-4 text-ueh-teal dark:text-teal-400 shrink-0" />}
              </button>

              {/* English Option */}
              <button
                onClick={() => onLanguageChange('en')}
                className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                  language === 'en'
                    ? 'border-ueh-teal dark:border-teal-500 bg-teal-50/50 dark:bg-teal-950/40 text-neutral-900 dark:text-white font-semibold ring-2 ring-ueh-teal/20 shadow-xs'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇬🇧</span>
                  <span className="text-xs">{t.english}</span>
                </div>
                {language === 'en' && <Check className="w-4 h-4 text-ueh-teal dark:text-teal-400 shrink-0" />}
              </button>
            </div>
          </div>

          <div className="p-3 bg-neutral-100 dark:bg-neutral-800/80 rounded-xl text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-ueh-orange shrink-0" />
            <span>{t.applyThemeInstantly}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-800/60 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold rounded-xl shadow transition-transform hover:-translate-y-0.5"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
