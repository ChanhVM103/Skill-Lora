import { Course, FaqItem, UserProfile, AssessmentQuestion, RoadmapItem, CvAnalysis, ActivityLogItem } from '../types';


export const currentUser: UserProfile = {
  name: 'Nguyễn Văn Minh',
  studentId: '31221020456',
  faculty: 'Khoa Công Nghệ Thông Tin Kinh Doanh',
  careerGoal: 'Fullstack Web & AI Application Developer',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'student',
  email: 'minh.nguyen@skillora.edu.vn',
};

export const adminUser: UserProfile = {
  name: 'Quản Trị Viên Hệ Thống',
  studentId: 'ADMIN-001',
  faculty: 'Ban Quản Trị & Đào Tạo Skillora',
  careerGoal: 'System & Academic Administrator',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  role: 'admin',
  email: 'admin@skillora.edu.vn',
};

export const initialCourses: Course[] = [
  {
    id: 'c1',
    code: '13-7-2026-KTCT-SANG T2+T4+T6-B2-311',
    title: 'Kiến Trúc Máy Tính & Hệ Điều Hành Hệ Thống',
    instructor: 'Nguyễn Minh Tuấn',
    progress: 68,
    patternTheme: 'purple-mesh',
    category: 'Công nghệ thông tin',
    level: 'Trung cấp',
    description: 'Nghiên cứu cấu trúc phần cứng, vi kiến trúc x86/ARM, cơ chế quản lý bộ nhớ ảo, phân luồng đa nhiệm và giao tiếp thiết bị.',
    lessonsCount: 12,
    completedLessons: 8,
    skillsTaught: ['Computer Architecture', 'Linux OS', 'Memory Management', 'C/C++'],
    lessons: [
      { id: 'l1', title: 'Tổng quan kiến trúc Von Neumann và bộ vi xử lý', duration: '45 phút', completed: true },
      { id: 'l2', title: 'Bộ nhớ ảo, Phân trang (Paging) và Hoán đổi (Swapping)', duration: '60 phút', completed: true },
      { id: 'l3', title: 'Quản lý Process và Multithreading trong Linux', duration: '50 phút', completed: false, quizQuestion: {
        question: 'Cơ chế nào trong OS giúp tránh hiện tượng Race Condition giữa các thread?',
        options: ['Mutex & Semaphore', 'Stack Overflow', 'Paging', 'Round Robin'],
        correctAnswer: 0
      } },
    ],
  },
  {
    id: 'c2',
    code: '2025.N1.K51 - Sinh hoạt công dân đầu khóa',
    title: 'Sinh Hoạt Công Dân & Kỹ Năng Hòa Nhập Đại Học',
    instructor: 'SHCD Khóa 51 - ĐHCQ',
    progress: 100,
    patternTheme: 'yellow-mesh',
    category: 'Kỹ năng nghề nghiệp',
    level: 'Cơ bản',
    description: 'Quy chế đào tạo tín chỉ, văn hóa học đường số, đạo đức học thuật và định hướng nghề nghiệp thời đại số.',
    lessonsCount: 6,
    completedLessons: 6,
    skillsTaught: ['Quy chế học vụ', 'Đạo đức nghề nghiệp', 'Tư duy phát triển'],
    lessons: [
      { id: 'l4', title: 'Quy chế tín chỉ và đăng ký học phần', duration: '30 phút', completed: true },
      { id: 'l5', title: 'Văn hóa ứng xử và Liêm chính học thuật', duration: '40 phút', completed: true },
    ],
  },
  {
    id: 'c3',
    code: '26D1PHI51002321',
    title: 'Triết Học & Phương Pháp Luận Nghiên Cứu Khoa Học',
    instructor: 'Phạm Thị Kiên',
    progress: 65,
    patternTheme: 'slate-poly',
    category: 'Kỹ năng nghề nghiệp',
    level: 'Cơ bản',
    description: 'Hệ thống triết học Mác - Lênin, phương pháp tư duy biện chứng và ứng dụng giải quyết các bài toán kinh tế - kỹ thuật.',
    lessonsCount: 10,
    completedLessons: 6,
    skillsTaught: ['Critical Thinking', 'Research Methodology', 'Analytical Thinking'],
    lessons: [
      { id: 'l6', title: 'Quy luật chuyển hóa từ lượng thành chất', duration: '45 phút', completed: true },
      { id: 'l7', title: 'Thực tiễn và tiêu chuẩn của chân lý khoa học', duration: '50 phút', completed: false },
    ],
  },
  {
    id: 'c4',
    code: 'CTD1-26D1ENG51319924- SAT. MAY - MS. LOAN',
    title: 'Tiếng Anh Học Thuật & Giao Tiếp Chuyên Ngành Kỹ Thuật',
    instructor: 'Nguyễn Thị Thùy Loan',
    progress: 72,
    patternTheme: 'blue-statue',
    category: 'Ngoại ngữ',
    level: 'Trung cấp',
    description: 'Rèn luyện kỹ năng thuyết trình, đọc tài liệu kỹ thuật, viết email công việc và phỏng vấn việc làm bằng tiếng Anh.',
    lessonsCount: 14,
    completedLessons: 10,
    skillsTaught: ['Technical English', 'Business Presentation', 'Interview Skills'],
    lessons: [
      { id: 'l8', title: 'Technical Documentation Reading Strategies', duration: '55 phút', completed: true },
      { id: 'l9', title: 'Mock Interview: Answering Behavioral Questions', duration: '60 phút', completed: false },
    ],
  },
  {
    id: 'c5',
    code: 'DB_0608_ST6_HKD2026_HUYBX',
    title: 'Cơ Sở Dữ Liệu Quan Hệ & Tối Ưu Hóa Truy Vấn SQL',
    instructor: 'Trần Bùi Huy',
    progress: 97,
    patternTheme: 'purple-mesh',
    category: 'Công nghệ thông tin',
    level: 'Trung cấp',
    description: 'Thiết kế lược đồ ERD, chuẩn hóa 3NF/BCNF, lập trình Stored Procedures, Indexing và tối ưu hóa câu truy vấn SQL.',
    lessonsCount: 15,
    completedLessons: 14,
    skillsTaught: ['PostgreSQL', 'SQL Optimization', 'Indexing', 'Database Modeling'],
    lessons: [
      { id: 'l10', title: 'B-Tree Indexing và Phân tích Execution Plan EXPLAIN', duration: '60 phút', completed: true },
      { id: 'l11', title: 'Transaction Isolation Levels và Concurrency Control', duration: '50 phút', completed: true },
    ],
  },
  {
    id: 'c6',
    code: 'ATD_MARKETING_BRANDING_2026',
    title: 'Digital Marketing & Xây Dựng Thương Hiệu Cho Sản Phẩm Số',
    instructor: 'Trung tâm CNTT và Thiết kế (ATD)',
    progress: 100,
    patternTheme: 'blue-statue',
    category: 'Kinh tế & Quản trị',
    level: 'Cơ bản',
    description: 'Chiến lược tăng trưởng sản phẩm công nghệ (Product-led Growth), SEO, Content Strategy và UI/UX Branding.',
    lessonsCount: 8,
    completedLessons: 8,
    skillsTaught: ['Product Branding', 'SEO / ASO', 'Growth Marketing', 'User Acquisition'],
    lessons: [
      { id: 'l12', title: 'Định vị giá trị sản phẩm số (Value Proposition)', duration: '40 phút', completed: true },
    ],
  },
  {
    id: 'c7',
    code: 'HKC2026 LẬP TRÌNH HƯỚNG ĐỐI TƯỢNG',
    title: 'Lập Trình Hướng Đối Tượng (OOP) & Clean Code',
    instructor: 'Võ Văn Hải',
    progress: 92,
    patternTheme: 'green-abstract',
    category: 'Công nghệ thông tin',
    level: 'Trung cấp',
    description: '4 trụ cột OOP, Design Patterns (Factory, Singleton, Observer, Strategy), nguyên lý SOLID và Clean Architecture.',
    lessonsCount: 16,
    completedLessons: 15,
    skillsTaught: ['TypeScript / Java', 'OOP Design', 'SOLID Principles', 'Design Patterns'],
    lessons: [
      { id: 'l13', title: 'Áp dụng nguyên lý SOLID trong React & TypeScript', duration: '60 phút', completed: true },
      { id: 'l14', title: 'Observer Pattern và State Management', duration: '50 phút', completed: true },
    ],
  },
  {
    id: 'c8',
    code: 'HKG2026 KINH TẾ VI MÔ - 26G1ECO50100103',
    title: 'Kinh Tế Vi Mô Ứng Dụng Trong Quyết Định Kinh Doanh',
    instructor: 'Nguyễn Thị Bích Hằng',
    progress: 100,
    patternTheme: 'teal-geometric',
    category: 'Kinh tế & Quản trị',
    level: 'Cơ bản',
    description: 'Lý thuyết cung cầu, độ co giãn, chi phí cơ hội, tối ưu hóa lợi nhuận và lý thuyết trò chơi trong thị trường cạnh tranh.',
    lessonsCount: 10,
    completedLessons: 10,
    skillsTaught: ['Economic Modeling', 'Data Analysis', 'Cost-Benefit Analysis'],
    lessons: [
      { id: 'l15', title: 'Cân bằng thị trường và hiệu quả phúc lợi kinh tế', duration: '45 phút', completed: true },
    ],
  },
  {
    id: 'c9',
    code: 'KTMT-HDH-ST7.04.2026',
    title: 'Điện Toán Đám Mây & Kiến Trúc Microservices với Docker',
    instructor: 'Hồ Thị Thanh Tuyền',
    progress: 50,
    patternTheme: 'teal-geometric',
    category: 'Công nghệ thông tin',
    level: 'Nâng cao',
    description: 'Containerization với Docker, điều phối Kubernetes, CI/CD pipeline, kiến trúc Cloud Native và bảo mật dịch vụ đám mây.',
    lessonsCount: 14,
    completedLessons: 7,
    skillsTaught: ['Docker', 'Kubernetes', 'CI/CD Pipelines', 'Cloud Architecture'],
    lessons: [
      { id: 'l16', title: 'Multi-stage Docker build cho ứng dụng React/Vite', duration: '45 phút', completed: true },
      { id: 'l17', title: 'Thiết lập Docker Compose và Reverse Proxy NGINX', duration: '60 phút', completed: false, quizQuestion: {
        question: 'Lệnh nào sau đây dùng để chạy container ở chế độ background trong Docker?',
        options: ['docker run -d', 'docker run -it', 'docker compose stop', 'docker build .'],
        correctAnswer: 0
      } },
    ],
  },
  {
    id: 'c10',
    code: '26D1BUS50309526',
    title: 'Kỹ Năng Mềm: Đàm Phán, Thuyết Trình & Làm Việc Nhóm',
    instructor: 'Cao Văn Tiến',
    progress: 50,
    patternTheme: 'pink-mosaic',
    category: 'Kỹ năng nghề nghiệp',
    level: 'Cơ bản',
    description: 'Kỹ năng giao tiếp chuyên nghiệp, quản lý thời gian Pomodoro, giải quyết xung đột nhóm và thuyết trình dự án công nghệ.',
    lessonsCount: 8,
    completedLessons: 4,
    skillsTaught: ['Teamwork', 'Agile/Scrum', 'Conflict Resolution', 'Public Speaking'],
    lessons: [
      { id: 'l18', title: 'Quy trình Daily Standup và Sprint Planning trong Scrum', duration: '40 phút', completed: true },
      { id: 'l19', title: 'Thuyết phục nhà tuyển dụng và đối tác qua Elevator Pitch', duration: '45 phút', completed: false },
    ],
  },
  {
    id: 'c11',
    code: '26D1PHY51401124 - LỚP CLNC',
    title: 'Phát Triển Ứng Dụng Web Hiện Đại với React & TypeScript',
    instructor: 'Nguyễn Thị Minh Cẩm',
    progress: 100,
    patternTheme: 'slate-poly',
    category: 'Công nghệ thông tin',
    level: 'Nâng cao',
    description: 'Component Lifecycle, Hooks chuyên sâu, State Machines, tối ưu hiệu năng Web Vitals và kiến trúc Micro-Frontend.',
    lessonsCount: 16,
    completedLessons: 16,
    skillsTaught: ['React 18', 'TypeScript', 'Tailwind CSS', 'State Management', 'Web Performance'],
    lessons: [
      { id: 'l20', title: 'Tối ưu Re-render với React.memo và useMemo/useCallback', duration: '50 phút', completed: true },
    ],
  },
  {
    id: 'c12',
    code: 'LUẬT CÔNG NGHỆ THÔNG TIN K51',
    title: 'Pháp Luật Công Nghệ Thông Tin & An Toàn Dữ Liệu Số',
    instructor: 'Nguyễn Thùy Dung',
    progress: 80,
    patternTheme: 'blue-statue',
    category: 'Pháp lý & Luật',
    level: 'Trung cấp',
    description: 'Luật an ninh mạng, bảo vệ dữ liệu cá nhân (Nghị định 13/2023), sở hữu trí tuệ phần mềm và trách nhiệm pháp lý trong AI.',
    lessonsCount: 10,
    completedLessons: 8,
    skillsTaught: ['Cybersecurity Law', 'GDPR & Decree 13', 'Intellectual Property'],
    lessons: [
      { id: 'l21', title: 'Tuân thủ bảo vệ dữ liệu người dùng theo Nghị định 13/2023', duration: '50 phút', completed: true },
    ],
  },
];

export const mockCvAnalysis: CvAnalysis = {
  fileName: 'Nguyen_Van_Minh_CV_Frontend_Dev.pdf',
  fileSize: '1.4 MB',
  uploadedAt: 'Hôm nay, 19:15',
  matchScore: 84,
  targetRole: 'Senior Frontend & Fullstack Web Engineer',
  summary: 'Hồ sơ có nền tảng vững chắc về React, TypeScript, HTML/CSS và tư duy giải thuật. Để sẵn sàng cho các vòng phỏng vấn công ty công nghệ đa quốc gia, cần nâng cao kiến thức về Cloud/Docker, Kiểm thử tự động và Tối ưu hiệu năng tải trang Core Web Vitals.',
  matchedSkills: [
    'React 18 & Hooks',
    'TypeScript nâng cao',
    'Tailwind CSS & Responsive Design',
    'RESTful APIs & Fetching',
    'Git & GitHub Teamwork',
    'Cơ sở dữ liệu SQL'
  ],
  missingSkills: [
    'Docker & Containerization',
    'Tối ưu Web Vitals (LCP/CLS)',
    'CI/CD GitHub Actions',
    'Kiểm thử tự động (Unit / E2E)',
    'Tiếng Anh phỏng vấn kỹ thuật'
  ],
  suggestedCourseIds: ['c9', 'c11', 'c4', 'c7'],
  radarScores: [
    { subject: 'Chuyên môn Web (Frontend)', score: 92, fullMark: 100 },
    { subject: 'Hạ tầng & Cloud (DevOps)', score: 58, fullMark: 100 },
    { subject: 'Cơ sở dữ liệu & Backend', score: 75, fullMark: 100 },
    { subject: 'Ngoại ngữ & Giao tiếp', score: 70, fullMark: 100 },
    { subject: 'Kiến trúc & Clean Code', score: 85, fullMark: 100 },
  ],
};

export const mockQuestions: AssessmentQuestion[] = [
  {
    id: 1,
    question: 'Khi ứng dụng React gặp hiện tượng tải trang chậm do tệp JavaScript bundle quá nặng, giải pháp kiến trúc tối ưu nhất là gì?',
    options: [
      'Áp dụng Code Splitting động kết hợp React.lazy và Suspense',
      'Chuyển toàn bộ component sang sử dụng inline styles',
      'Bỏ qua TypeScript và viết lại bằng JavaScript thuần',
      'Tăng dung lượng RAM trên máy chủ lưu trữ'
    ],
    category: 'Web Architecture'
  },
  {
    id: 2,
    question: 'Nguyên lý Single Responsibility Principle (chữ S trong SOLID) yêu cầu điều gì đối với một module/class?',
    options: [
      'Một class chỉ nên có duy nhất một lý do để thay đổi',
      'Mỗi hàm chỉ được phép có 1 tham số duy nhất',
      'Mọi class phải kế thừa từ một interface duy nhất',
      'Chỉ được viết code trên 1 file mã nguồn duy nhất'
    ],
    category: 'Software Design'
  },
  {
    id: 3,
    question: 'Trong Docker, việc sử dụng "Multi-stage Builds" mang lại lợi ích cốt lõi nào?',
    options: [
      'Tạo ra production image nhẹ tối đa bằng cách loại bỏ công cụ build trung gian',
      'Cho phép chạy đồng thời nhiều container mà không tốn port mạng',
      'Tự động sao lưu database sang cloud',
      'Không cần viết tệp Dockerfile'
    ],
    category: 'Cloud & DevOps'
  },
  {
    id: 4,
    question: 'Chỉ số Largest Contentful Paint (LCP) trong bộ chỉ số Core Web Vitals của Google đo lường yếu tố nào?',
    options: [
      'Thời gian hiển thị khối nội dung lớn nhất (hình ảnh/văn bản) trên màn hình người dùng',
      'Thời gian máy chủ phản hồi gói tin đầu tiên (TTFB)',
      'Mức độ giật lag khi người dùng click vào button',
      'Độ dịch chuyển layout bất ngờ khi load tài nguyên'
    ],
    category: 'Web Performance'
  },
  {
    id: 5,
    question: 'Bạn thường quản lý trạng thái chia sẻ giữa các component nhiều tầng (prop drilling) bằng kỹ thuật nào hiệu quả nhất?',
    options: [
      'Sử dụng React Context API hoặc State Management chuyên dụng (Zustand/Redux)',
      'Lưu tất cả biến vào biến toàn cục window',
      'Sử dụng LocalStorage cho mọi biến giao diện',
      'Truyền thủ công qua 10 cấp component'
    ],
    category: 'State Management'
  }
];

export const mockRoadmap: RoadmapItem[] = [
  {
    id: 'r1',
    week: 1,
    title: 'Kiểm tra Năng lực Đầu vào & Tối ưu Codebase React/TypeScript',
    description: 'Nắm vững Advanced TypeScript Generics, Component Composition, Clean Code theo chuẩn SOLID.',
    courseId: 'c7',
    completed: true,
    estimatedHours: 10,
  },
  {
    id: 'r2',
    week: 2,
    title: 'Tối ưu hóa Hiệu năng Web & Chỉ số Core Web Vitals',
    description: 'Phân tích profiling, lazy load hình ảnh, giảm bundle size, đo lường LCP/INP/CLS.',
    courseId: 'c11',
    completed: true,
    estimatedHours: 8,
  },
  {
    id: 'r3',
    week: 3,
    title: 'Container hóa Ứng dụng với Docker & Docker Compose',
    description: 'Viết Dockerfile chuẩn production, multi-stage build, thiết lập network và volume chia sẻ.',
    courseId: 'c9',
    completed: false,
    estimatedHours: 12,
  },
  {
    id: 'r4',
    week: 4,
    title: 'Xây dựng Pipeline CI/CD Tự Động Hóa & Kiểm Thử',
    description: 'Thiết lập GitHub Actions tự động lint, chạy unit test và triển khai tự động lên Cloud.',
    courseId: 'c9',
    completed: false,
    estimatedHours: 10,
  },
  {
    id: 'r5',
    week: 5,
    title: 'Tiếng Anh Phỏng Vấn Kỹ Thuật & Xây Dựng Portfolio Chuyên Nghiệp',
    description: 'Luyện tập trả lời Behavioral Questions theo phương pháp STAR, hoàn thiện hồ sơ GitHub và CV.',
    courseId: 'c4',
    completed: false,
    estimatedHours: 6,
  },
  {
    id: 'r6',
    week: 6,
    title: 'Dự Án Capstone: Triển Khai Hệ Thống Thực Tế & Nhận Chứng Nhận',
    description: 'Đóng gói toàn bộ sản phẩm, bảo vệ đồ án trước hội đồng doanh nghiệp và nhận huy hiệu Verified Skill.',
    courseId: 'c1',
    completed: false,
    estimatedHours: 15,
  },
];

export const faqsList: FaqItem[] = [
  {
    question: 'Làm thế nào để AI quét và đối soát kỹ năng từ CV sinh viên?',
    answer: 'Hệ thống sử dụng mô hình AI tiên tiến để trích xuất văn bản từ tệp PDF/DOCX của bạn, tự động phân tích kinh nghiệm, dự án và nhóm kỹ năng cứng/mềm. Sau đó, hệ thống đối chiếu với chuẩn yêu cầu việc làm thực tế và kho học phần của trường để chỉ ra chính xác các kỹ năng còn thiếu (Skill Gap).'
  },
  {
    question: 'Sinh viên năm 1 - năm 2 chưa có nhiều dự án thì quét CV có ích gì không?',
    answer: 'Rất hữu ích! Đối với sinh viên giai đoạn đầu, hệ thống sẽ phân tích các học phần bạn đã tích lũy trên LMS, gợi ý các dự án môn học (Mini-project) thực chiến để bạn làm quen và tự động bổ sung vào CV chuẩn ATS ngay từ sớm.'
  },
  {
    question: 'Tiến độ học tập và điểm số trên LMS có tự động đồng bộ vào hồ sơ nghề nghiệp không?',
    answer: 'Có! Khi bạn hoàn thành bất kỳ bài học hoặc bài kiểm tra đạt yêu cầu trên LMS, tỷ lệ hoàn thành % trên thẻ môn học sẽ tăng lên lập tức. Đồng thời, kỹ năng liên quan sẽ được tự động tích xanh xác thực (Verified Skill Badge) trên hồ sơ cá nhân.'
  },
  {
    question: 'Tôi có thể quét lại nhiều phiên bản CV khác nhau không?',
    answer: 'Bạn có thể tải lên và phân tích phiên bản CV mới bất cứ lúc nào không giới hạn. Toàn bộ lịch sử điểm tương thích (Match Score) và biểu đồ năng lực qua các lần quét sẽ được ghi nhận để bạn dễ dàng thấy được sự bứt phá.'
  },
  {
    question: 'Các khóa học được gợi ý dựa trên tiêu chuẩn nào?',
    answer: 'Thuật toán đối soát trực tiếp các kỹ năng còn thiếu với ngân hàng môn học chính khóa và khóa học kỹ năng của trường, ưu tiên các học phần có đồ án thực tế và phù hợp với tiến độ kỳ học của bạn.'
  }
];

export const initialActivityHistory: ActivityLogItem[] = [
  {
    id: 'act-1',
    type: 'cv_scan',
    title: 'Quét & Phân tích CV ATS hoàn tất',
    description: 'Tệp Nguyen_Van_Minh_CV_Developer.pdf được AI phân tích đạt 84/100 điểm tương thích với vị trí Frontend & Fullstack Web Engineer.',
    timestamp: '16:15 - Hôm nay',
    metadata: {
      score: 84,
      targetRole: 'Senior Frontend & Fullstack Web Engineer',
      fileName: 'Nguyen_Van_Minh_CV_Developer.pdf',
    },
  },
  {
    id: 'act-2',
    type: 'lesson_complete',
    title: 'Hoàn thành bài học: Bộ nhớ ảo & Paging',
    description: 'Đã hoàn thành bài học thuộc học phần Kiến Trúc Máy Tính & Hệ Điều Hành Hệ Thống (Mã: KTCT-B2-311).',
    timestamp: '14:30 - Hôm nay',
    metadata: {
      courseId: 'c1',
      courseTitle: 'Kiến Trúc Máy Tính & Hệ Điều Hành Hệ Thống',
      lessonTitle: 'Bộ nhớ ảo, Phân trang (Paging) và Hoán đổi (Swapping)',
    },
  },
  {
    id: 'act-3',
    type: 'quiz_attempt',
    title: 'Đạt điểm tối đa Mini Quiz Hệ điều hành',
    description: 'Trả lời chính xác 100% câu hỏi về cơ chế Mutex & Semaphore chống Race Condition.',
    timestamp: '14:22 - Hôm nay',
    metadata: {
      courseId: 'c1',
      score: 100,
    },
  },
  {
    id: 'act-4',
    type: 'assessment_submit',
    title: 'Khảo sát Năng lực Kỹ thuật AI hoàn tất',
    description: 'Hoàn thành 5/5 câu hỏi khảo sát năng lực công nghệ và thuật toán, ghi nhận điểm năng lực cốt lõi 86/100.',
    timestamp: '10:05 - Hôm nay',
    metadata: {
      score: 86,
    },
  },
  {
    id: 'act-5',
    type: 'page_visit',
    title: 'Truy cập Lộ trình phát triển 6 tuần',
    description: 'Xem chi tiết các mốc mục tiêu tuần và các học phần liên kết với chuẩn đầu ra thị trường.',
    timestamp: '09:40 - Hôm nay',
    metadata: {
      tabName: 'roadmap',
    },
  },
  {
    id: 'act-6',
    type: 'lesson_complete',
    title: 'Hoàn thành bài học: Định vị giá trị sản phẩm số',
    description: 'Đã hoàn thành bài học thuộc môn Digital Marketing & Xây Dựng Thương Hiệu Cho Sản Phẩm Số.',
    timestamp: '15:20 - Hôm qua',
    metadata: {
      courseId: 'c6',
      courseTitle: 'Digital Marketing & Xây Dựng Thương Hiệu Cho Sản Phẩm Số',
    },
  },
];

