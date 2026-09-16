/**
 * Ground Truth Rubric: Engineering Ladders Framework (Level 1 -> Level 5)
 * Reference: engineering-ladders directory standard
 */

export interface LevelDefinition {
  level: number;
  title: string;
  summary: string;
  key_expectations: string[];
}

export interface AxisRubric {
  axis: 'technology' | 'system' | 'people' | 'process';
  name: string;
  description: string;
  levels: Record<number, LevelDefinition>;
}

export const ENGINEERING_LADDERS_RUBRIC: Record<string, AxisRubric> = {
  technology: {
    axis: 'technology',
    name: 'Technology (Công nghệ & Kỹ thuật chuyên sâu)',
    description:
      'Hiểu biết core/runtime, khả năng troubleshoot bug hóc búa, làm chủ framework/library.',
    levels: {
      1: {
        level: 1,
        title: 'Adopter (L1)',
        summary:
          'Sử dụng công nghệ theo chỉ dẫn, biết cú pháp căn bản, hiểu lý thuyết nhưng thiếu trải nghiệm xử lý bug thực tế.',
        key_expectations: [
          'Viết được code cơ bản làm theo hướng dẫn hoặc template có sẵn',
          'Biết dùng thư viện phổ biến nhưng chưa hiểu cơ chế core/runtime bên dưới',
          'Cần hỗ trợ khi gặp runtime error hoặc lỗi bất ngờ',
        ],
      },
      2: {
        level: 2,
        title: 'Specialist (L2)',
        summary:
          'Thành thạo công nghệ chính trong công việc hàng ngày, tự sửa được bug thường gặp, viết được unit test đơn giản.',
        key_expectations: [
          'Tự độc lập triển khai tính năng bằng framework chính (ReactJS, NestJS...)',
          'Biết tra cứu log, debug và sửa bug tầng ứng dụng',
          'Áp dụng đúng các best practice về code style và type safety',
        ],
      },
      3: {
        level: 3,
        title: 'Advanced Specialist (L3)',
        summary:
          'Hiểu sâu cơ chế runtime/core, tối ưu hiệu năng (memoization, caching, indexing), giải quyết bug hóc búa.',
        key_expectations: [
          'Tối ưu hiệu năng bộ nhớ, CPU, database query hoặc browser rendering',
          'Xử lý tốt các sự cố race condition, memory leak, cache stampede',
          'Đánh giá và lựa chọn thư viện/công cụ tối ưu cho bài toán cụ thể',
        ],
      },
      4: {
        level: 4,
        title: 'Expert / Architect (L4)',
        summary:
          'Làm chủ hệ sinh thái công nghệ, làm chủ các giải pháp chuyên sâu (Distributed Lock, Micro-frontends, Async I/O).',
        key_expectations: [
          'Thiết kế giải pháp kỹ thuật phức tạp cho toàn bộ module lớn',
          'Đặt ra tiêu chuẩn kỹ thuật, code review và guideline cho cả team',
          'Nắm vững trade-offs của các công nghệ khác nhau ở mức hệ thống',
        ],
      },
      5: {
        level: 5,
        title: 'Principal / Thought Leader (L5)',
        summary:
          'Định hình chiến lược công nghệ cho toàn công ty/tổ chức, đóng góp Open Source core hoặc phát minh công nghệ mới.',
        key_expectations: [
          'Định hướng tầm nhìn công nghệ dài hạn (3-5 năm)',
          'Giải quyết các bài toán kỹ thuật giới hạn quy mô lớn (Ultra high-throughput, AI infrastructure)',
          'Tạo ra tác động kỹ thuật ảnh hưởng đến toàn bộ ngành/tổ chức',
        ],
      },
    },
  },
  system: {
    axis: 'system',
    name: 'System (Kiến trúc Hệ thống & Quy mô)',
    description:
      'Quyền sở hữu kiến trúc (ownership), tính mở rộng (scalability), xử lý bottleneck khi traffic tăng trưởng.',
    levels: {
      1: {
        level: 1,
        title: 'Component Developer (L1)',
        summary:
          'Hiểu mô hình ứng dụng đơn giản (Monolith/Single App), viết API/UI component nhỏ.',
        key_expectations: [
          'Hiểu luồng dữ liệu cơ bản từ UI -> API -> Database',
          'Chưa từng thiết kế hoặc chịu trách nhiệm về kiến trúc hệ thống',
        ],
      },
      2: {
        level: 2,
        title: 'Module Owner (L2)',
        summary:
          'Sở hữu kiến trúc của một module/service hoàn chỉnh, biết thiết kế DB schema và API endpoint chuẩn REST/GraphQL.',
        key_expectations: [
          'Thiết kế chuẩn hóa Database schema và quan hệ dữ liệu',
          'Tách biệt các tầng Service, Repository, Controller rõ ràng',
          'Biết tích hợp Caching đơn giản và xử lý lỗi kết nối DB',
        ],
      },
      3: {
        level: 3,
        title: 'Subsystem Architect (L3)',
        summary:
          'Thiết kế hệ thống chịu tải tốt, phân tích được điểm nghẽn (bottleneck) khi traffic tăng 5x, dùng Caching/Queue nâng cao.',
        key_expectations: [
          'Xác định chính xác bottleneck ở Database (Indexing, Read-replica) hoặc Network/CPU',
          'Thiết kế hệ thống xử lý bất đồng bộ (Message Queue: RabbitMQ/Kafka)',
          'Tối ưu Web Vitals / Micro-services communication',
        ],
      },
      4: {
        level: 4,
        title: 'Enterprise System Architect (L4)',
        summary:
          'Chịu trách nhiệm kiến trúc toàn bộ hệ thống phân tán đa dịch vụ (Microservices, Event-Driven, Micro-Frontends).',
        key_expectations: [
          'Đảm bảo High Availability (HA), Fault Tolerance, Disaster Recovery',
          'Thiết kế hệ thống cho hàng triệu người dùng / High CCU',
          'Đo lường và duy trì SLA/SLO (99.99% Uptime)',
        ],
      },
      5: {
        level: 5,
        title: 'Global Platform Chief Architect (L5)',
        summary:
          'Thiết kế hạ tầng nền tảng toàn cầu (Multi-region Cloud Platform, Core Infrastructure).',
        key_expectations: [
          'Xây dựng Platform hạ tầng phục vụ hàng trăm engineer phát triển trên đó',
          'Tối ưu chi phí hạ tầng Cloud triệu đô',
        ],
      },
    },
  },
  people: {
    axis: 'people',
    name: 'People (Giao tiếp & Làm việc nhóm)',
    description:
      'Giải quyết bất đồng kiến trúc, thương lượng kỹ thuật, chia sẻ tri thức, ảnh hưởng đến đội ngũ.',
    levels: {
      1: {
        level: 1,
        title: 'Learner (L1)',
        summary:
          'Tiếp nhận nhiệm vụ từ Senior/Lead, đặt câu hỏi khi gặp khó khăn, hợp tác tốt trong nhóm nhỏ.',
        key_expectations: [
          'Lắng nghe và thực thi theo phân công',
          'Chủ động báo cáo tiến độ và rào cản công việc',
        ],
      },
      2: {
        level: 2,
        title: 'Collaborator (L2)',
        summary:
          'Chủ động giao tiếp với Product Owner/Designer/Tester, hỗ trợ đồng nghiệp mới, thực hiện code review chất lượng.',
        key_expectations: [
          'Trao đổi làm rõ requirement kỹ thuật trực tiếp với PO/Design',
          'Góp ý code review xây dựng và có căn cứ',
          'Hỗ trợ onboard đồng nghiệp mới',
        ],
      },
      3: {
        level: 3,
        title: 'Mentor & Negotiator (L3)',
        summary:
          'Mentor các Junior/Intern, giải quyết hiệu quả các xung đột/bất đồng kiến trúc kỹ thuật trong team bằng luận điểm thuyết phục.',
        key_expectations: [
          'Dẫn dắt và mentor trực tiếp 1-3 juniors tiến bộ',
          'Thương lượng trade-offs kỹ thuật với Product Manager (Technical Debt vs Feature Speed)',
          'Tổ chức chia sẻ tri thức (Tech Talk) trong team',
        ],
      },
      4: {
        level: 4,
        title: 'Engineering Leader / People Manager (L4)',
        summary:
          'Xây dựng văn hóa kỹ thuật, phát triển đội ngũ kỹ sư, đại diện team đàm phán với các phòng ban/stakeholders.',
        key_expectations: [
          'Đánh giá và nâng cấp năng lực cho cả đội ngũ',
          'Xây dựng môi trường làm việc cởi mở, khuyến khích sáng tạo kỹ thuật',
          'Định hướng lộ trình sự nghiệp (Career path) cho thành viên',
        ],
      },
      5: {
        level: 5,
        title: 'Organization Evangelist (L5)',
        summary:
          'Định hình văn hóa kỹ thuật cho toàn công ty, thu hút tài năng hàng đầu thị trường.',
        key_expectations: [
          'Tạo dựng uy tín công nghệ cho tổ chức trên thị trường',
          'Thu hút và giữ chân các chuyên gia xuất sắc',
        ],
      },
    },
  },
  process: {
    axis: 'process',
    name: 'Process (Quy trình & Release)',
    description:
      'CI/CD, quy trình kiểm thử, quản lý rủi ro release, cải tiến workflow làm việc.',
    levels: {
      1: {
        level: 1,
        title: 'Follower (L1)',
        summary:
          'Tuân thủ quy trình Git flow, commit code và tạo Pull Request đúng quy định.',
        key_expectations: [
          'Dùng Git thành thạo (branching, pull request, merge conflict đơn giản)',
          'Tuân thủ checklist deploy có sẵn',
        ],
      },
      2: {
        level: 2,
        title: 'Practitioner (L2)',
        summary:
          'Viết Unit Test / Integration Test, hiểu pipeline CI/CD cơ bản, đảm bảo an toàn khi release tính năng.',
        key_expectations: [
          'Viết kiểm thử tự động cho các case quan trọng',
          'Sử dụng CI/CD pipeline để tự động build và chạy test',
          'Kiểm soát rủi ro tính năng bằng Feature Flags',
        ],
      },
      3: {
        level: 3,
        title: 'Process Innovator (L3)',
        summary:
          'Tự thiết lập và cải tiến CI/CD pipeline (GitHub Actions, GitLab CI), áp dụng chiến lược Release an toàn (Canary/Blue-Green).',
        key_expectations: [
          'Tự viết script tự động hóa quy trình build/test/deploy',
          'Áp dụng chiến lược release an toàn (Zero-downtime, Blue/Green, Canary)',
          'Tối ưu hóa thời gian chạy CI/CD pipeline',
        ],
      },
      4: {
        level: 4,
        title: 'DevOps & Quality Champion (L4)',
        summary:
          'Chuẩn hóa toàn bộ quy trình SDLC (Software Development Life Cycle), Observability (Tracing, Metrics, Alerting).',
        key_expectations: [
          'Thiết lập hệ thống giám sát và cảnh báo sự cố tự động (Prometheus, Grafana, OpenTelemetry)',
          'Tự động hóa toàn bộ quy trình kiểm soát chất lượng code và bảo mật (SAST/DAST)',
        ],
      },
      5: {
        level: 5,
        title: 'Operational Excellence Strategist (L5)',
        summary:
          'Định hình phương pháp luận phát triển phần mềm cho toàn công ty (Agile/DevOps/SRE transformation).',
        key_expectations: [
          'Xây dựng tiêu chuẩn SRE (Site Reliability Engineering) cho toàn bộ tổ chức',
          'Tối ưu hóa hiệu suất giao hàng phần mềm (DORA metrics: Deployment Frequency, Lead Time for Changes...)',
        ],
      },
    },
  },
};
