import { LandingCourse, StudentFeedback, JourneyStep, LandingCvMockResult } from '../types/landing';

export const landingCourses: LandingCourse[] = [
  {
    id: 'course-data-storytelling',
    title: 'Data Storytelling trong Kinh Doanh & Phân Tích Thực Tiễn',
    category: 'Phân Tích Dữ Liệu',
    mentor: 'ThS. Lê Bảo Ngọc',
    mentorTitle: 'Senior Data Lead @ Tech Unicorn • Giảng viên Thỉnh giảng UEH',
    duration: '4 tuần (16 giờ học)',
    level: 'Trung cấp',
    description:
      'Chuyển hóa dữ liệu thô và biểu đồ thành câu chuyện kinh doanh thuyết phục ban giám đốc, sử dụng trực quan hóa PowerBI & Dashboard điều hành.',
    highlightTag: 'Khóa học được tuyển dụng nhiều nhất',
    practicalProject: 'Báo cáo trực quan hóa phân tích tăng trưởng doanh thu quý IV',
    skills: ['Data Visualization', 'PowerBI', 'Executive Presentation', 'Business Metrics'],
  },
  {
    id: 'course-cv-writing-ats',
    title: 'Kỹ Năng Viết CV Chuyên Nghiệp & Phỏng Vấn Chuẩn ATS',
    category: 'Kỹ Năng Nghề Nghiệp',
    mentor: 'TS. Hoàng Minh Tuấn',
    mentorTitle: 'Chuyên gia Hướng nghiệp & Cố vấn Tuyển dụng Doanh nghiệp',
    duration: '2 tuần (8 giờ học)',
    level: 'Cơ bản',
    description:
      'Tối ưu hóa cấu trúc CV vượt qua bộ lọc tự động ATS của các tập đoàn đa quốc gia, lượng hóa thành tích bằng công thức STAR & Action Verbs.',
    highlightTag: 'Khuyên học sau khi quét CV',
    practicalProject: 'Bộ hồ sơ Portfolio & CV hoàn thiện cá nhân hóa theo từng vị trí ứng tuyển',
    skills: ['ATS Optimization', 'STAR Method', 'Career Portfolio', 'Interview Skills'],
  },
  {
    id: 'course-sql-basics',
    title: 'SQL Căn Bản & Tối Ưu Hóa Truy Vấn Cơ Sở Dữ Liệu',
    category: 'Công Nghệ & Kỹ Thuật',
    mentor: 'ThS. Trần Bùi Huy',
    mentorTitle: 'Database Architect • Giảng viên Khoa CNTT',
    duration: '6 tuần (24 giờ học)',
    level: 'Cơ bản',
    description:
      'Làm chủ ngôn ngữ SQL, thiết kế lược đồ quan hệ chuẩn hóa 3NF và viết các câu truy vấn trích xuất dữ liệu đa bảng tốc độ cao với PostgreSQL.',
    highlightTag: 'Nền tảng kỹ thuật bắt buộc',
    practicalProject: 'Xây dựng cơ sở dữ liệu và hệ thống truy vấn báo cáo bán lẻ trực tuyến',
    skills: ['PostgreSQL', 'SQL Joins', 'Aggregations', 'Index Optimization'],
  },
];

export const mockLandingCvResult: LandingCvMockResult = {
  fileName: 'Nguyen_Quoc_Phong_CV_2026.pdf',
  fileSize: '1.4 MB',
  matchScore: 72,
  targetRole: 'Frontend Developer & Product Technologist',
  analyzedDate: 'Hôm nay, 16/09/2026',
  summary:
    'Hồ sơ có nền tảng học vấn tốt và tư duy kỹ thuật rõ ràng. Tuy nhiên, tỷ lệ phản hồi từ nhà tuyển dụng bị giới hạn do thiếu các dự án thực tế có thể kiểm chứng và chưa lượng hóa được kết quả cụ thể.',
  missingItems: [
    {
      id: 'missing-projects',
      title: 'Thiếu liên kết dự án thực chiến (Projects)',
      issue: 'Chưa đính kèm đường dẫn GitHub/Demo trực tiếp cho các sản phẩm đã lập trình.',
      solution: 'Bổ sung ít nhất 2 dự án cá nhân có link live demo và mô tả rõ stack React/TypeScript.',
      priority: 'Cao',
      impactPercentage: 15,
    },
    {
      id: 'missing-linkedin',
      title: 'Chưa kết nối hồ sơ LinkedIn chuyên nghiệp',
      issue: 'Thiếu liên kết trang cá nhân để nhà tuyển dụng xác minh mạng lưới quan hệ và hoạt động.',
      solution: 'Thêm URL LinkedIn rút gọn ở phần đầu CV kèm chứng chỉ học tập đại học.',
      priority: 'Trung bình',
      impactPercentage: 5,
    },
    {
      id: 'missing-metrics',
      title: 'Thiếu số liệu đo lường kết quả (Measurable Outcomes)',
      issue: 'Các gạch đầu dòng kinh nghiệm chỉ mô tả công việc chung chung, chưa có chỉ số định lượng.',
      solution: 'Áp dụng công thức STAR: Tăng tốc độ tải trang 35%, tối ưu 12 luồng người dùng.',
      priority: 'Cao',
      impactPercentage: 8,
    },
  ],
  suggestedCourseIds: ['course-cv-writing-ats', 'course-data-storytelling', 'course-sql-basics'],
};

export const journeySteps: JourneyStep[] = [
  {
    step: 1,
    title: 'Tải CV lên Nền tảng',
    tagline: 'Kéo thả PDF / DOCX chỉ trong 3 giây',
    description:
      'Hệ thống tự động đọc và phân tích cấu trúc CV của bạn, bóc tách các trường thông tin: kỹ năng, kinh nghiệm, học vấn và dự án cá nhân.',
    iconName: 'FileUp',
    actionHint: 'Hỗ trợ định dạng PDF, DOCX tối đa 10MB',
  },
  {
    step: 2,
    title: 'Nhận Đề xuất Ưu tiên',
    tagline: 'Chỉ ra chính xác lỗ hổng kỹ năng',
    description:
      'AI đối chiếu hồ sơ với ma trận yêu cầu tuyển dụng thực tế của hơn 500+ doanh nghiệp hàng đầu, chỉ ra các điểm yếu cần khắc phục ngay.',
    iconName: 'Sparkles',
    actionHint: 'Chấm điểm % hoàn thiện & danh sách thiếu sót',
  },
  {
    step: 3,
    title: 'Học tập & Bứt phá',
    tagline: 'Khóa học bám sát mục tiêu nghề nghiệp',
    description:
      'Lộ trình cá nhân hóa kết nối trực tiếp với các học phần thư viện thực nghiệm đại học, giúp bạn bổ sung kỹ năng và tự tin ứng tuyển việc làm.',
    iconName: 'Compass',
    actionHint: 'Chứng nhận hoàn thành & Portfolio chuẩn',
  },
];

export const studentFeedbacks: StudentFeedback[] = [
  {
    id: 'feedback-1',
    name: 'Nguyễn Hoàng Nam',
    faculty: 'Khoa Công Nghệ Thông Tin Kinh Doanh',
    university: 'Đại học Kinh tế TP.HCM (UEH)',
    roleWon: 'Data Analyst Intern',
    company: 'Shopee Vietnam',
    quote:
      '“Nhờ phần quét CV của Skillora, mình mới nhận ra hồ sơ cũ hoàn toàn thiếu các số liệu định lượng kết quả. Sau khi học xong khóa Data Storytelling và bổ sung dự án vào CV, mình nhận được lời mời phỏng vấn ngay tuần tiếp theo!”',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    cvScoreBefore: 65,
    cvScoreAfter: 92,
  },
  {
    id: 'feedback-2',
    name: 'Trần Lê Thảo Vy',
    faculty: 'Khoa Kinh Doanh Quốc Tế - Marketing',
    university: 'Đại học UEH',
    roleWon: 'Product Marketing Associate',
    company: 'VNG Corporation',
    quote:
      '“Giao diện rất điện ảnh và tạo cảm giác tin cậy. Tính năng chỉ ra điểm thiếu trong CV chuẩn xác đến bất ngờ. Mình đặc biệt thích cách Skillora gợi ý môn học bù đắp kỹ năng thay vì chỉ đưa ra lời khuyên chung chung.”',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    cvScoreBefore: 70,
    cvScoreAfter: 89,
  },
  {
    id: 'feedback-3',
    name: 'Lê Quốc Bảo',
    faculty: 'Khoa Khoa Học & Kỹ Thuật Máy Tính',
    university: 'Đại học Bách Khoa TP.HCM',
    roleWon: 'Frontend Developer Intern',
    company: 'MoMo E-Wallet',
    quote:
      '“Trước đây CV của mình liệt kê công nghệ rất rời rạc. Hệ thống đã giúp mình tinh chỉnh lại theo chuẩn ATS và đính kèm đường link demo sản phẩm rõ ràng. Một công cụ không thể thiếu cho sinh viên trước mùa thực tập.”',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    cvScoreBefore: 68,
    cvScoreAfter: 94,
  },
];
