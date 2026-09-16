import React from 'react';
import { LandingNavbar } from './LandingNavbar';
import { LandingHero } from './LandingHero';
import { LandingCourses } from './LandingCourses';
import { LandingJourney } from './LandingJourney';
import { LandingFeedback } from './LandingFeedback';
import { LandingFooter } from './LandingFooter';
import { Language, ThemeMode } from '../../i18n/translations';
import { MainTabType } from '../../types';

interface LandingPageProps {
  onNavigateToAuth: (targetTab?: MainTabType) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToAuth,
  language,
  onLanguageChange,
  theme,
  onThemeChange,
}) => {
  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-neutral-950 font-sans text-neutral-900 dark:text-neutral-100 flex flex-col transition-colors duration-200">
      {/* 1. Floating Glassmorphic Header */}
      <LandingNavbar
        onNavigateToAuth={() => onNavigateToAuth('cv-scanner')}
        language={language}
        onLanguageChange={onLanguageChange}
        theme={theme}
        onThemeChange={onThemeChange}
      />

      {/* 2. Full-screen Cinematic Hero */}
      <LandingHero
        onStartScan={() => onNavigateToAuth('cv-scanner')}
        onNavigateToAuth={() => onNavigateToAuth('cv-scanner')}
        language={language}
      />

      {/* 3. Course Recommendations & UEH Library Standard */}
      <LandingCourses
        onNavigateToAuth={() => onNavigateToAuth('courses')}
        language={language}
      />

      {/* 4. 3-Step Journey Section */}
      <LandingJourney
        onStartScan={() => onNavigateToAuth('cv-scanner')}
        language={language}
      />

      {/* 6. Student & Alumni Feedback / Testimonials */}
      <LandingFeedback
        language={language}
      />

      {/* 7. Landing Footer */}
      <LandingFooter
        onNavigateToAuth={onNavigateToAuth}
        language={language}
      />
    </div>
  );
};
