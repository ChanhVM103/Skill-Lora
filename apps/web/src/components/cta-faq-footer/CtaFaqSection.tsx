import React from 'react';
import { AnimatedGradientCta } from './AnimatedGradientCta';
import { FaqAccordion } from './FaqAccordion';
import { faqsList } from '../../data/mockData';

interface CtaFaqSectionProps {
  onStartAction: () => void;
}

export const CtaFaqSection: React.FC<CtaFaqSectionProps> = ({ onStartAction }) => {
  return (
    <div className="w-full bg-white dark:bg-slate-950 text-neutral-900 dark:text-slate-100 transition-colors">
      <main className="max-w-[1100px] w-full mx-auto px-5 py-20 max-[900px]:py-[60px]">
        <div className="grid grid-cols-[1.6fr_1fr] gap-[30px] items-stretch max-[900px]:grid-cols-1 max-[900px]:gap-[60px]">
          {/* Left column — Animated Gradient CTA card */}
          <AnimatedGradientCta
            onActionClick={onStartAction}
          />

          {/* Right column — FAQ accordion */}
          <FaqAccordion
            items={faqsList}
          />
        </div>
      </main>
    </div>
  );
};
