import { GapCategory } from '../dto/generate-roadmap-request.dto.js';

export type PhaseTemplate = {
  key: GapCategory;
  title: string;
  description: string;
  baseDurationWeeks: number;
};

export const phaseTemplates: Record<GapCategory, PhaseTemplate> = {
  [GapCategory.Transition]: {
    key: GapCategory.Transition,
    title: 'Career Transition Foundations',
    description:
      'Build the baseline knowledge needed before starting role-specific skills.',
    baseDurationWeeks: 3,
  },
  [GapCategory.Foundation]: {
    key: GapCategory.Foundation,
    title: 'Foundation Skills',
    description:
      'Close prerequisite gaps before moving into core role skills.',
    baseDurationWeeks: 2,
  },
  [GapCategory.Core]: {
    key: GapCategory.Core,
    title: 'Core Role Skills',
    description:
      'Build the most important skills for the selected target role.',
    baseDurationWeeks: 2,
  },
  [GapCategory.AppliedProject]: {
    key: GapCategory.AppliedProject,
    title: 'Applied Practice Project',
    description: 'Apply role skills in a realistic project.',
    baseDurationWeeks: 2,
  },
  [GapCategory.Portfolio]: {
    key: GapCategory.Portfolio,
    title: 'Portfolio and Interview Readiness',
    description:
      'Turn learning evidence into portfolio-ready artifacts.',
    baseDurationWeeks: 1,
  },
};

export const phaseOrder: GapCategory[] = [
  GapCategory.Transition,
  GapCategory.Foundation,
  GapCategory.Core,
  GapCategory.AppliedProject,
  GapCategory.Portfolio,
];
