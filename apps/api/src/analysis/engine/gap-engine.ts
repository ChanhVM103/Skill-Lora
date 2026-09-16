import {
  CurrentLevel,
  GapSeverity,
  RoadmapGapItemDto,
  TargetLevel,
} from '../../roadmap/dto/generate-roadmap-request.dto.js';
import { RoleProfileConfig, SkillRequirement } from '../config/role-requirements.config.js';

export interface GapEngineResult {
  existing_skills: string[];
  missing_skills: string[];
  gap_items: RoadmapGapItemDto[];
  prioritized_actions: Array<{
    id: string;
    order: number;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
  }>;
}

export class GapEngine {
  static analyze(extractedText: string, roleConfig: RoleProfileConfig): GapEngineResult {
    const lowerText = extractedText.toLowerCase();

    const existing_skills: string[] = [];
    const missing_skills: string[] = [];
    const gap_items: RoadmapGapItemDto[] = [];

    // Always ensure foundational version control / basic programming if found
    if (lowerText.includes('git') || lowerText.includes('github')) {
      existing_skills.push('Git & GitHub');
    }
    if (lowerText.includes('javascript') || lowerText.includes('typescript') || lowerText.includes('python')) {
      existing_skills.push('Ngôn ngữ lập trình chính');
    }

    roleConfig.core_skills.forEach((skillReq) => {
      // Check if any keyword of this skill is present in the text
      const matches = skillReq.keywords.filter((kw) =>
        lowerText.includes(kw.toLowerCase()),
      );

      const matchRatio = matches.length / skillReq.keywords.length;

      if (matchRatio >= 0.4) {
        existing_skills.push(skillReq.skill_name);
      } else {
        missing_skills.push(skillReq.skill_name);

        const severity =
          skillReq.importance >= 5
            ? GapSeverity.High
            : skillReq.importance === 4
              ? GapSeverity.Medium
              : GapSeverity.Low;

        const current_level =
          matchRatio > 0 ? CurrentLevel.Partial : CurrentLevel.Missing;

        gap_items.push({
          skill_id: skillReq.skill_id,
          skill_name: skillReq.skill_name,
          category: skillReq.category,
          severity,
          current_level,
          target_level: TargetLevel.Intermediate,
          reason:
            matchRatio > 0
              ? `Đã có kiến thức ban đầu về ${matches.join(', ')}, nhưng chưa có bằng chứng dự án hoàn chỉnh trong hồ sơ.`
              : `Không tìm thấy bằng chứng thực hành về ${skillReq.skill_name} trong CV tải lên.`,
        });
      }
    });

    // If no gap was detected (very strong CV), keep at least 1-2 advanced portfolio skills
    if (gap_items.length === 0) {
      const topSkill = roleConfig.core_skills[0];
      gap_items.push({
        skill_id: `${topSkill.skill_id}_adv`,
        skill_name: `${topSkill.skill_name} (Nâng Cao & Scale)`,
        category: topSkill.category,
        severity: GapSeverity.Medium,
        current_level: CurrentLevel.Partial,
        target_level: TargetLevel.Advanced,
        reason: 'Cần nâng cao kiến thức tối ưu hiệu năng và xử lý tải cao.',
      });
    }

    // Sort gap items by severity: High first, then Medium, then Low
    const severityWeight = {
      [GapSeverity.High]: 3,
      [GapSeverity.Medium]: 2,
      [GapSeverity.Low]: 1,
    };
    gap_items.sort((a, b) => severityWeight[b.severity] - severityWeight[a.severity]);

    // Generate Prioritized Actions
    const prioritized_actions = gap_items.slice(0, 4).map((gap, idx) => ({
      id: `act_${idx + 1}`,
      order: idx + 1,
      title: `Bổ sung kỹ năng thực chiến: ${gap.skill_name}`,
      description: `Thực hiện 1 dự án nhỏ và hoàn thành các bài học kiểm thử cho ${gap.skill_name} để đưa vào mục Project của CV.`,
      priority:
        gap.severity === GapSeverity.High
          ? ('high' as const)
          : gap.severity === GapSeverity.Medium
            ? ('medium' as const)
            : ('low' as const),
      category: gap.category,
    }));

    return {
      existing_skills: Array.from(new Set(existing_skills)),
      missing_skills,
      gap_items,
      prioritized_actions,
    };
  }
}
