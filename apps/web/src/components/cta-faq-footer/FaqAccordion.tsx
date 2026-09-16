import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FaqItem } from '../../types';

interface FaqAccordionProps {
  items: FaqItem[];
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col justify-center gap-3">
      {items.map((item, index) => {
        const isActive = activeIndex === index;

        return (
          <div
            key={index}
            onClick={() => toggleAccordion(index)}
            className={`bg-white dark:bg-neutral-900 border rounded-[12px] py-[18px] px-5 cursor-pointer transition-all duration-200 ${
              isActive
                ? 'border-indigo-200 dark:border-indigo-900/60 shadow-md'
                : 'border-slate-200 dark:border-neutral-800 hover:border-indigo-300 dark:hover:border-neutral-700 shadow-xs'
            }`}
          >
            {/* Question Row */}
            <div className="flex justify-between items-center font-medium text-[0.95rem] text-slate-900 dark:text-slate-100">
              <span className="font-semibold">{item.question}</span>
              {isActive ? (
                <ChevronUp size={20} className="shrink-0 text-indigo-600 dark:text-indigo-400" />
              ) : (
                <ChevronDown size={20} className="shrink-0 text-slate-400 dark:text-slate-500" />
              )}
            </div>

            {/* Answer Block */}
            {isActive && (
              <div className="mt-3 text-[0.9rem] text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-neutral-800 pt-3 animate-in fade-in duration-200">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
