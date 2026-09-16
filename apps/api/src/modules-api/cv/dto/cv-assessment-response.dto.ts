import { ApiProperty } from '@nestjs/swagger';

export class InterviewQuestionDto {
  @ApiProperty({ example: 'q_1' })
  question_id: string;

  @ApiProperty({ example: 'technology' })
  axis: string;

  @ApiProperty({ example: 'Level 3' })
  target_level_benchmark: string;

  @ApiProperty({ example: 'E-Commerce System' })
  project_referenced: string;

  @ApiProperty({ example: 'NextJS SSR Product Catalog' })
  feature_referenced: string;

  @ApiProperty({
    example:
      'Trong tính năng Product Catalog viết bằng NextJS, khi trang bị re-render liên tục do SSR fetch data, bạn đã dùng giải pháp caching nào ở Frontend?',
  })
  question_text: string;
}

export class BaselineResponseDto {
  @ApiProperty({ example: '65fc7a12b3e4f9810a123456' })
  session_id: string;

  @ApiProperty({ example: 'frontend_reactjs' })
  target_role: string;

  @ApiProperty({ example: 'QUESTIONS_GENERATED' })
  status: string;

  @ApiProperty({
    example: {
      estimated_level: 'Fresher / Entry-Level (~0-1 yrs exp frontend_reactjs)',
      years_of_experience: 0.5,
      base_score: 76,
      bonus_score_from_credentials: 0.15,
      total_hypothesis_score: 77.15,
      rationale:
        'The candidate is currently a university student with short internship experience...',
    },
  })
  hypothesis_level: Record<string, any>;

  @ApiProperty({ type: [InterviewQuestionDto] })
  interview_questions: InterviewQuestionDto[];
}

export class EvaluationResponseDto {
  @ApiProperty({ example: '65fc7a12b3e4f9810a123456' })
  session_id: string;

  @ApiProperty({ example: 'frontend_reactjs' })
  target_role: string;

  @ApiProperty({ example: 'EVALUATED' })
  status: string;

  @ApiProperty({
    example: {
      step_1_hypothesis: 'Mid-Level (~2-3 yrs exp Frontend)',
      current_verified_level: 'Level 3 (Mid Frontend Developer)',
      next_target_level: 'Level 4 (Senior Frontend Engineer)',
      verdict: 'ACCURATE',
      verification_summary: 'Ứng viên cung cấp bằng chứng thực tế thuyết phục về giải pháp Caching và State Optimization.',
    },
  })
  hypothesis_level_verification: Record<string, any>;

  @ApiProperty({
    example: {
      technology: { level: 3, score: 78, verified_quote: 'mình dùng useMemo kết hợp với ISR...', rationale: 'Nắm vững NextJS rendering' },
      system: { level: 3, score: 72, verified_quote: 'tối ưu Web Vitals LCP...', rationale: 'Tối ưu hiệu năng tốt' },
      people: { level: 2, score: 65, verified_quote: '...', rationale: 'Giao tiếp cơ bản' },
      process: { level: 3, score: 70, verified_quote: 'dùng Lighthouse CI...', rationale: 'Tự động hóa testing' },
    },
  })
  scores_by_axis: Record<string, any>;

  @ApiProperty({ required: false })
  evidence_ledger?: Record<string, any>[];

  @ApiProperty({
    example: {
      role_context: 'frontend_reactjs',
      summary: 'Kế hoạch nâng trình độ từ Level 3 (Mid Frontend) lên Level 4 (Senior Frontend)',
      required_skills_to_learn: [
        { skill_name: 'Micro-Frontends Architecture', axis_category: 'system', why_needed: 'Xây dựng app Frontend quy mô lớn', priority: 'HIGH' },
      ],
      practical_features_to_build: [
        { feature_title: 'Tự dựng Micro-Frontend Shell với Module Federation', project_context: 'Hệ thống Dashboard', expected_learning_outcome: 'Chứng minh năng lực Level 4' },
      ],
      english_improvement_roadmap: {
        current_perceived_english: 'Đọc tài liệu cơ bản',
        target_english_benchmark: 'IELTS 6.5+ / Fluent Tech Presentation',
        key_focus_areas: ['Luyện thuyết trình kiến trúc UI bằng tiếng Anh', 'Đọc tài liệu RFCs React/NextJS'],
        recommended_action: 'Tham gia trình bày Demo kỹ thuật bằng Tiếng Anh mỗi tháng.',
      },
    },
  })
  actionable_level_up_blueprint: Record<string, any>;
}
