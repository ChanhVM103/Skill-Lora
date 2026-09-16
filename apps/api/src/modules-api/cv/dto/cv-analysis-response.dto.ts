import { ApiProperty } from '@nestjs/swagger';

export class LayoutEvidenceIssueDto {
  @ApiProperty({ example: 'Lề trái & lề phải trang 1' })
  cv_evidence_location!: string;

  @ApiProperty({
    example: 'Khoảng cách lề trái (1.2cm) và lề phải (2.5cm) không cân đối',
  })
  issue_description!: string;

  @ApiProperty({ example: 'Căn chỉnh lề trái và lề phải đều 2.0cm' })
  fix_recommendation!: string;
}

export class TypographyEvidenceIssueDto {
  @ApiProperty({ example: "Mục 'Kinh nghiệm làm việc' -> Dòng 5" })
  cv_evidence_location!: string;

  @ApiProperty({
    example: 'Font chữ bị nhảy từ Arial sang Times New Roman',
  })
  issue_description!: string;

  @ApiProperty({ example: 'Đồng bộ toàn bộ văn bản về một loại font nhất quán' })
  fix_recommendation!: string;
}

export class VisionLayoutAuditDto {
  @ApiProperty({ example: 85.0 })
  score!: number;

  @ApiProperty({ example: 85 })
  margin_balance!: number;

  @ApiProperty({ example: 90 })
  color_harmony!: number;

  @ApiProperty({ example: 80 })
  whitespace_usage!: number;

  @ApiProperty({ type: [LayoutEvidenceIssueDto] })
  layout_evidence_issues!: LayoutEvidenceIssueDto[];

  @ApiProperty({
    type: [String],
    example: ['Màu sắc phối hài hòa', 'Lề trái/phải căn đối chuẩn.'],
  })
  design_feedback!: string[];
}

export class TypographyAuditDto {
  @ApiProperty({ example: 88.0 })
  score!: number;

  @ApiProperty({ example: 90 })
  font_consistency!: number;

  @ApiProperty({ example: 85 })
  heading_body_harmony!: number;

  @ApiProperty({ example: 92 })
  bullet_alignment!: number;

  @ApiProperty({ type: [TypographyEvidenceIssueDto] })
  typography_evidence_issues!: TypographyEvidenceIssueDto[];

  @ApiProperty({
    type: [String],
    example: [
      'Font chữ đồng bộ tốt giữa tiêu đề và nội dung.',
      'Kích thước tiêu đề H2 nên điều chỉnh ở mức 14pt-16pt.',
    ],
  })
  design_feedback!: string[];
}

export class Part1VisualAndFormattingAuditDto {
  @ApiProperty({
    example: 'Đánh giá Bố cục, Phối màu và Định dạng Font chữ CV qua 2 AI Model riêng biệt',
  })
  summary!: string;

  @ApiProperty({ type: VisionLayoutAuditDto })
  vision_layout_audit!: VisionLayoutAuditDto;

  @ApiProperty({ type: TypographyAuditDto })
  typography_audit!: TypographyAuditDto;
}

export class CandidateLevelDto {
  @ApiProperty({ example: 'JUNIOR' })
  current_level!: string;

  @ApiProperty({ example: 'MID_LEVEL' })
  next_level!: string;

  @ApiProperty({ example: 74.0 })
  competency_score!: number;

  @ApiProperty({ example: 1.5 })
  verified_experience_years!: number;

  @ApiProperty({
    example:
      'Ứng viên đang ở trình độ JUNIOR với 1.5 năm kinh nghiệm làm việc.',
  })
  level_summary!: string;

  @ApiProperty({
    example:
      'CV chưa ghi nhận chứng chỉ hoặc trình độ Tiếng Anh cụ thể (Cần bổ sung chứng chỉ TOEIC/IELTS vào CV).',
  })
  english_evaluation_note!: string;
}

export class CvAnalysisMetadataDto {
  @ApiProperty({ example: 'cv_sample.pdf' })
  cv_file_name!: string;

  @ApiProperty({ example: 'pdf' })
  cv_file_type!: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/.../cv.pdf' })
  cv_file_url?: string;

  @ApiProperty({ example: 'Văn bản đầy đủ được trích xuất từ CV...' })
  extracted_cv_text!: string;

  @ApiProperty({ example: 1.5 })
  verified_experience_years!: number;
}

export class CvEvidenceIssueDto {
  @ApiProperty({ example: 'ISSUE_01' })
  issue_id!: string;

  @ApiProperty({ example: 'PROJECT_FEATURE_OPTIMIZATION' })
  category!: string;

  @ApiProperty({ example: 'Website E-Commerce Microservices' })
  project_name!: string;

  @ApiProperty({
    example:
      "Mục 'Projects' -> Dự án 'E-Commerce' -> Dòng 3 mô tả chức năng tìm kiếm",
  })
  cv_evidence_location!: string;

  @ApiProperty({
    example: "Tìm kiếm bài viết và sản phẩm bằng truy vấn SQL LIKE '%query%'",
  })
  evidence_snippet!: string;

  @ApiProperty({
    example:
      'Sử dụng truy vấn SQL LIKE cho tìm kiếm bài viết sẽ gây quét toàn bộ bảng (Table Scan), gây chậm API khi dữ liệu lớn.',
  })
  why_unsuitable!: string;

  @ApiProperty({ example: 'PostgreSQL Full-Text Search hoặc Elasticsearch' })
  recommended_replacement_tech!: string;

  @ApiProperty({
    example:
      "Cập nhật mô tả trên CV thành: 'Triển khai Full-Text Search với PostgreSQL Indexing giúp giảm thời gian truy vấn 80%'.",
  })
  action_to_fix!: string;
}

export class ActionableLevelUpBlueprintDto {
  @ApiProperty({ example: 'BP_01' })
  blueprint_id!: string;

  @ApiProperty({
    example: 'Upload & Quản lý File Media lên Cloud Storage',
  })
  feature_title!: string;

  @ApiProperty({ example: 'INTERMEDIATE_PRACTICAL' })
  feature_difficulty!: string;

  @ApiProperty({
    example:
      'Dự án thực tế doanh nghiệp không lưu file trực tiếp trên ổ cứng Server local mà lưu trên Cloud để mở rộng.',
  })
  why_practical!: string;

  @ApiProperty({
    type: [String],
    example: [
      'NestJS FileInterceptor & Multer',
      'AWS S3 / Cloudinary SDK (@aws-sdk/client-s3)',
      'File Stream & MIME-Type Validation',
    ],
  })
  required_skills_to_learn!: string[];

  @ApiProperty({
    example:
      'Đọc tài liệu tiếng Anh chính thức từ AWS S3 Docs / Cloudinary Node.js SDK, hiểu từ vựng Secure Pre-signed URL, Bucket Permissions.',
  })
  english_requirement!: string;

  @ApiProperty({
    example:
      '1. Tạo S3 Bucket / Cloudinary App. 2. Viết NestJS Custom Pipe validate MIME type (png, jpg, pdf) & max size 5MB. 3. Viết Service upload stream lên S3 và trả về CDN URL.',
  })
  step_by_step_action!: string;
}

export class EvaluatedCertificateDto {
  @ApiProperty({ example: 'AWS Certified Cloud Practitioner' })
  certificate_name!: string;

  @ApiProperty({ example: 'TIER_2_SILVER' })
  tier!: string;

  @ApiProperty({
    example:
      'Chứng chỉ AWS được các công ty tuyển dụng Backend/Cloud rất ưa chuộng.',
  })
  recruiter_value_note!: string;
}

export class CertificationEvaluationDto {
  @ApiProperty({ example: 85.0 })
  score!: number;

  @ApiProperty({ type: [EvaluatedCertificateDto] })
  evaluated_certificates!: EvaluatedCertificateDto[];
}

export class Part2CvContentAndLevelAssessmentDto {
  @ApiProperty({
    example:
      'Đánh giá Nội dung CV, Chỉ rõ Dẫn chứng Vị trí CV & Bản Thiết kế Lộ trình Nâng Level',
  })
  summary!: string;

  @ApiProperty({ type: CandidateLevelDto })
  candidate_level!: CandidateLevelDto;

  @ApiProperty({ type: [CvEvidenceIssueDto] })
  cv_evidence_issues_and_optimizations!: CvEvidenceIssueDto[];

  @ApiProperty({ type: [ActionableLevelUpBlueprintDto] })
  actionable_level_up_blueprint!: ActionableLevelUpBlueprintDto[];

  @ApiProperty({ type: CertificationEvaluationDto })
  certification_evaluation!: CertificationEvaluationDto;
}

export class CvAnalysisResponseDto {
  @ApiProperty({ example: '65f8d9a1e4b0a123456789ab' })
  analysis_id!: string;

  @ApiProperty({ example: 'COMPLETED' })
  status!: string;

  @ApiProperty({ example: 'backend_nestjs' })
  target_role!: string;

  @ApiProperty({ type: CvAnalysisMetadataDto })
  metadata!: CvAnalysisMetadataDto;

  @ApiProperty({ type: Part1VisualAndFormattingAuditDto })
  part_1_visual_and_formatting_audit!: Part1VisualAndFormattingAuditDto;

  @ApiProperty({ type: Part2CvContentAndLevelAssessmentDto })
  part_2_cv_content_and_level_assessment!: Part2CvContentAndLevelAssessmentDto;

  @ApiProperty({ example: '2026-09-16T12:00:00.000Z' })
  created_at!: string;
}
