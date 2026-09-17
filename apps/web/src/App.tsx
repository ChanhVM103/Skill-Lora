import { useState, useEffect } from 'react';
import { LmsNavbar } from './components/layout/LmsNavbar';
import { LmsSubheader } from './components/layout/LmsSubheader';
import { LmsSidebar } from './components/layout/LmsSidebar';
import { CourseGrid } from './components/education/CourseGrid';
import { CourseDetailModal } from './components/education/CourseDetailModal';
import { CustomizeModal } from './components/layout/CustomizeModal';
import { FileUploadZone } from './components/cv-scanner/FileUploadZone';
import { CvAnalysisResult } from './components/cv-scanner/CvAnalysisResult';
import { SkillAssessmentChat } from './components/assessment/SkillAssessmentChat';
import { CareerRoadmap } from './components/roadmap/CareerRoadmap';
import { ActivityHistory } from './components/history/ActivityHistory';
import { LmsFooter } from './components/cta-faq-footer/LmsFooter';
import { AuthPage } from './components/auth/AuthPage';
import { LandingPage } from './components/landing/LandingPage';
import { GeminiHistorySidebar } from './components/layout/GeminiHistorySidebar';
import { WorkflowStepper } from './components/workflow/WorkflowStepper';
import { AdminUsersView } from './components/admin/AdminUsersView';
import { AddResourceModal } from './components/resources/AddResourceModal';
import { UserProfileModal } from './components/layout/UserProfileModal';
import { initialCourses, mockCvAnalysis, initialActivityHistory, currentUser, adminUser } from './data/mockData';
import { Course, CvAnalysis, MainTabType, UserProfile, ActivityLogItem } from './types';
import { Language, ThemeMode, translations } from './i18n/translations';
import { Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { resourcesService } from './services/resources.service';
import { analysisService } from './services/analysis.service';

export type ViewMode = 'landing' | 'auth' | 'portal';

export default function App() {
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('skillora_courses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // ignore parse error
      }
    }
    return initialCourses;
  });

  // Sync courses with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('skillora_courses', JSON.stringify(courses));
    } catch {
      // ignore storage error
    }
  }, [courses]);

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('skillora_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Master View Mode: 'landing' (default) -> 'auth' -> 'portal'
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'login' || hash === 'auth') return 'auth';
    if (['courses', 'cv-scanner', 'assessment', 'roadmap', 'history', 'admin'].includes(hash)) {
      // If user has saved session, allow portal directly, otherwise landing
      const savedUser = localStorage.getItem('skillora_user') || localStorage.getItem('user');
      return savedUser ? 'portal' : 'landing';
    }
    return 'landing';
  });

  const [activeTab, setActiveTab] = useState<MainTabType>(() => {
    const hash = window.location.hash.replace('#', '');
    if (['courses', 'cv-scanner', 'assessment', 'roadmap', 'history', 'admin', 'login'].includes(hash)) {
      return hash as MainTabType;
    }
    return 'cv-scanner';
  });
  const [intendedTab, setIntendedTab] = useState<MainTabType>('cv-scanner');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [cvAnalysis, setCvAnalysis] = useState<CvAnalysis | null>(mockCvAnalysis);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Web & Activity History State
  const [history, setHistory] = useState<ActivityLogItem[]>(() => {
    const saved = localStorage.getItem('skillora_activity_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialActivityHistory;
      }
    }
    return initialActivityHistory;
  });

  // Sync history with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('skillora_activity_history', JSON.stringify(history));
    } catch {
      // localStorage quota or private mode fallback
    }
  }, [history]);

  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Load live teacher resources from Backend API
  const loadLiveResources = async () => {
    try {
      const liveResources = await resourcesService.getResources();
      if (liveResources && liveResources.length > 0) {
        const mappedCourses: Course[] = liveResources.map((res, idx) => ({
          id: res.id || `live-res-${idx + 1}`,
          code: `RES-${String(idx + 1).padStart(3, '0')}`,
          title: res.title,
          instructor: res.author || 'ThS. Giảng viên phụ trách',
          progress: 0,
          patternTheme: (['teal-geometric', 'orange-waves', 'purple-mesh', 'slate-poly', 'blue-statue', 'pink-mosaic', 'green-abstract', 'yellow-mesh'] as const)[idx % 8],
          category: res.type === 'lecture' ? 'Lý thuyết' : (res.type === 'project' ? 'Dự án' : 'Thực hành'),
          level: res.difficulty === 'beginner' ? 'Cơ bản' : (res.difficulty === 'intermediate' ? 'Trung cấp' : 'Nâng cao'),
          description: res.description || `Tài liệu hướng dẫn chuyên sâu về ${res.skill_tags?.join(', ')}.`,
          lessonsCount: 4,
          completedLessons: 0,
          skillsTaught: res.skill_tags || [],
          lessons: [
            { id: `l-${res.id}-1`, title: 'Tổng quan & Khái niệm then chốt', duration: '45 phút', completed: false },
            { id: `l-${res.id}-2`, title: 'Thực hành & Dự án thực tế', duration: '60 phút', completed: false },
          ],
          isRecommendedFromCv: true,
        }));
        setCourses((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const newToAdd = mappedCourses.filter((c) => !existingIds.has(c.id));
          return [...newToAdd, ...prev];
        });
      }
    } catch {
      // keep initial courses
    }
  };

  useEffect(() => {
    loadLiveResources();
  }, []);

  const addHistoryItem = (item: Omit<ActivityLogItem, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} - Hôm nay`;
    const newItem: ActivityLogItem = {
      ...item,
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: timeStr,
    };
    setHistory((prev) => [newItem, ...prev]);
  };

  const isAdmin = user?.role === 'admin';

  const handleCreateResource = async (res: any) => {
    if (!isAdmin) {
      showToast(
        language === 'vi'
          ? 'Chỉ Quản trị viên (Admin) mới có quyền thêm khóa học!'
          : 'Only Administrators have permission to add new courses!'
      );
      return;
    }

    const newCourseItem: Course = {
      id: res.id || `custom-res-${Date.now()}`,
      code: `RES-${String(courses.length + 1).padStart(3, '0')}`,
      title: res.title,
      instructor: user?.name || res.author || 'ThS. Giảng viên phụ trách',
      progress: 0,
      patternTheme: (['teal-geometric', 'orange-waves', 'purple-mesh', 'slate-poly', 'blue-statue', 'pink-mosaic', 'green-abstract', 'yellow-mesh'] as const)[courses.length % 8],
      category: res.type === 'lecture' ? 'Lý thuyết' : (res.type === 'project' ? 'Dự án' : 'Thực hành'),
      level: res.difficulty === 'beginner' ? 'Cơ bản' : (res.difficulty === 'intermediate' ? 'Trung cấp' : 'Nâng cao'),
      description: res.description || `Tài liệu giảng dạy về ${res.skill_tags?.join(', ')}.`,
      lessonsCount: 4,
      completedLessons: 0,
      skillsTaught: res.skill_tags || [],
      lessons: [
        { id: `l-${Date.now()}-1`, title: 'Tổng quan & Khái niệm then chốt', duration: '45 phút', completed: false },
        { id: `l-${Date.now()}-2`, title: 'Thực hành & Đồ án minh họa', duration: '60 phút', completed: false },
      ],
      isRecommendedFromCv: true,
    };

    // Update local courses state immediately
    setCourses((prev) => [newCourseItem, ...prev]);

    // Record activity log
    addHistoryItem({
      type: 'page_visit',
      title: language === 'vi' ? `Admin thêm khóa học: ${res.title}` : `Admin added course: ${res.title}`,
      description: language === 'vi'
        ? `Đã bổ sung học phần (${res.type}) đào tạo các kỹ năng: ${res.skill_tags?.join(', ')}.`
        : `Added course (${res.type}) for skills: ${res.skill_tags?.join(', ')}.`,
      metadata: {
        tabName: 'courses',
        courseId: newCourseItem.id,
      },
    });

    try {
      await resourcesService.createResource({
        title: res.title,
        type: res.type,
        skill_tags: res.skill_tags,
        difficulty: res.difficulty,
        url: res.url,
        description: res.description,
        author: user?.name || 'Giảng viên đóng góp',
      });
      showToast(
        language === 'vi'
          ? `Đã lưu khóa học "${res.title}" thành công!`
          : `Saved course "${res.title}" successfully!`
      );
      await loadLiveResources();
    } catch {
      showToast(
        language === 'vi'
          ? `Đã thêm khóa học "${res.title}" vào danh sách học phần!`
          : `Added course "${res.title}" to courses list!`
      );
    }
  };

  const handleDeleteCourse = (courseId: string) => {
    if (!isAdmin) {
      showToast(
        language === 'vi'
          ? 'Chỉ Quản trị viên (Admin) mới có quyền xóa khóa học!'
          : 'Only Administrators have permission to delete courses!'
      );
      return;
    }

    const courseToDelete = courses.find((c) => c.id === courseId);
    if (!courseToDelete) return;

    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    if (selectedCourse?.id === courseId) {
      setSelectedCourse(null);
    }

    addHistoryItem({
      type: 'page_visit',
      title: language === 'vi' ? `Admin xóa khóa học: ${courseToDelete.title}` : `Admin deleted course: ${courseToDelete.title}`,
      description: language === 'vi'
        ? `Đã xóa học phần ${courseToDelete.code} khỏi chương trình đào tạo.`
        : `Removed course ${courseToDelete.code} from the curriculum.`,
      metadata: {
        tabName: 'courses',
        courseId,
      },
    });

    showToast(
      language === 'vi'
        ? `Đã xóa khóa học "${courseToDelete.title}" khỏi hệ thống!`
        : `Deleted course "${courseToDelete.title}" from system!`
    );
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('skillora_activity_history');
    showToast(
      language === 'vi'
        ? translations.vi.clearHistorySuccess
        : translations.en.clearHistorySuccess
    );
  };

  // Gemini Sidebar Collapsed State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('skillora_sidebar_collapsed');
    return saved === 'true';
  });

  useEffect(() => {
    try {
      localStorage.setItem('skillora_sidebar_collapsed', String(isSidebarCollapsed));
    } catch {
      // ignore storage errors
    }
  }, [isSidebarCollapsed]);

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    showToast(
      language === 'vi'
        ? 'Đã xóa mục hoạt động khỏi lịch sử!'
        : 'Removed item from activity history!'
    );
  };

  const handleSelectHistoryItem = async (item: ActivityLogItem) => {
    if (item.type === 'cv_scan') {
      setActiveTab('cv-scanner');
      if (item.metadata?.analysisId) {
        try {
          const res = await analysisService.getAnalysisById(item.metadata.analysisId);
          if (res) {
            const roleLabel =
              res.target_role === 'backend_developer'
                ? 'Backend Developer'
                : res.target_role === 'data_analyst'
                ? 'Data Analyst'
                : 'AI Engineer';

            const reloadedAnalysis: CvAnalysis = {
              analysisId: res.analysis_id,
              fileName: item.metadata?.fileName || 'CV_Uploaded.pdf',
              fileSize: '1.2 MB',
              uploadedAt: 'Đã lưu trong lịch sử',
              matchScore: res.scores?.readiness_score ?? 75,
              targetRole: roleLabel,
              summary:
                res.parsed_cv?.experience_summary ||
                `Báo cáo phân tích đã lưu cho vị trí ${roleLabel}. Hệ thống ghi nhận ${res.existing_skills?.length || 0} kỹ năng phù hợp.`,
              matchedSkills: res.existing_skills?.length ? res.existing_skills : ['Node.js', 'SQL'],
              missingSkills: res.missing_skills?.length ? res.missing_skills : ['Docker', 'Kubernetes'],
              suggestedCourseIds: ['course-1', 'course-2', 'course-3'],
              radarScores: [
                { subject: 'Sẵn sàng công việc', score: res.scores?.readiness_score ?? 75, fullMark: 100 },
                { subject: 'Định dạng ATS', score: res.scores?.ats_score ?? 80, fullMark: 100 },
                { subject: 'Học thuật tiên quyết', score: res.scores?.academic_score ?? 70, fullMark: 100 },
                { subject: 'Độ khớp yêu cầu', score: res.scores?.match_percentage ?? 65, fullMark: 100 },
                { subject: 'Kỹ năng cốt lõi', score: 80, fullMark: 100 },
              ],
              actionableLevelUpBlueprint:
                res.actionable_level_up_blueprint ||
                res.part_2_cv_content_and_level_assessment?.actionable_level_up_blueprint ||
                null,
            };
            setCvAnalysis(reloadedAnalysis);
            showToast(
              language === 'vi'
                ? `Đã tải lại báo cáo phân tích #${res.analysis_id.slice(0, 8)}!`
                : `Reloaded analysis report #${res.analysis_id.slice(0, 8)}!`
            );
          }
        } catch (err) {
          console.error('Failed to reload analysis by id:', err);
        }
      }
    } else if (item.type === 'lesson_complete' || item.type === 'quiz_attempt') {
      setActiveTab('courses');
      if (item.metadata?.courseId) {
        const found = courses.find((c) => c.id === item.metadata?.courseId);
        if (found) {
          setSelectedCourse(found);
        }
      }
    } else if (item.type === 'assessment_submit') {
      setActiveTab('assessment');
    } else if (item.type === 'page_visit') {
      if (item.metadata?.tabName && ['courses', 'cv-scanner', 'assessment', 'roadmap'].includes(item.metadata.tabName)) {
        setActiveTab(item.metadata.tabName as MainTabType);
      } else {
        setActiveTab('roadmap');
      }
    }
  };

  const handleNewScan = () => {
    setActiveTab('cv-scanner');
    const scrollElem = document.getElementById('portal-scroll-container');
    if (scrollElem) {
      scrollElem.scrollTo({ top: 0, behavior: 'smooth' });
    }
    showToast(
      language === 'vi'
        ? 'Đã sẵn sàng tải lên CV mới để đối soát kỹ năng!'
        : 'Ready to upload a new CV for skill matching!'
    );
  };

  // Sync hash on viewMode & activeTab changes
  useEffect(() => {
    if (viewMode === 'landing') {
      window.location.hash = 'home';
    } else if (viewMode === 'auth') {
      window.location.hash = 'login';
    } else {
      window.location.hash = activeTab;
    }

    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'home' || hash === 'landing' || hash === '') {
        setViewMode('landing');
      } else if (hash === 'login' || hash === 'auth') {
        setViewMode('auth');
      } else if (['courses', 'cv-scanner', 'assessment', 'roadmap', 'history'].includes(hash)) {
        setViewMode('portal');
        setActiveTab(hash as MainTabType);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [viewMode, activeTab]);

  // Theme State: 'light' | 'dark'
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('skillora_theme') as ThemeMode | null;
    return saved === 'dark' ? 'dark' : 'light';
  });

  // Language State: 'vi' | 'en'
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('skillora_lang') as Language | null;
    return saved === 'en' ? 'en' : 'vi';
  });

  // Customize Modal state
  const [customizeOpen, setCustomizeOpen] = useState(false);

  // Sync theme with HTML class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('skillora_theme', theme);
  }, [theme]);

  // Sync language with localStorage
  useEffect(() => {
    localStorage.setItem('skillora_lang', language);
  }, [language]);

  // Sync user with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('skillora_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('skillora_user');
    }
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleLoginSuccess = (newUser: UserProfile) => {
    setUser(newUser);
    setViewMode('portal');
    setActiveTab(intendedTab);
    setIntendedTab('cv-scanner');
    showToast(
      language === 'vi'
        ? `${translations.vi.loginSuccessMsg} ${newUser.name}!`
        : `${translations.en.loginSuccessMsg} ${newUser.name}!`
    );
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('skillora_user');
    setViewMode('landing');
    showToast(
      language === 'vi'
        ? translations.vi.logoutSuccessMsg
        : translations.en.logoutSuccessMsg
    );
  };

  const handleSwitchUser = (newUser: UserProfile) => {
    setUser(newUser);
    if (newUser.role === 'admin') {
      setActiveTab('admin');
    } else if (activeTab === 'admin') {
      setActiveTab('cv-scanner');
    }
    showToast(
      language === 'vi'
        ? `Đã chuyển sang tài khoản ${newUser.name} (${newUser.role === 'admin' ? 'Quyền Quản Trị Viên' : 'Học Viên'})!`
        : `Switched to ${newUser.name} (${newUser.role === 'admin' ? 'Administrator' : 'Student'})!`
    );
  };

  // Instant Lesson Toggle - Updates progress bar immediately without page reload
  const handleToggleLesson = (courseId: string, lessonId: string) => {
    setCourses((prevCourses) =>
      prevCourses.map((c) => {
        if (c.id !== courseId) return c;

        const updatedLessons = c.lessons.map((l) =>
          l.id === lessonId ? { ...l, completed: !l.completed } : l
        );
        const completedCount = updatedLessons.filter((l) => l.completed).length;
        const newProgress = Math.round((completedCount / updatedLessons.length) * 100);

        // Find target lesson to log history if completed
        const targetLesson = c.lessons.find((l) => l.id === lessonId);
        if (targetLesson && !targetLesson.completed) {
          addHistoryItem({
            type: 'lesson_complete',
            title: language === 'vi' ? `Hoàn thành bài học: ${targetLesson.title}` : `Completed: ${targetLesson.title}`,
            description: language === 'vi'
              ? `Học phần: ${c.title} (${c.code}). Đã cập nhật tiến độ lên ${newProgress}%.`
              : `Course: ${c.title} (${c.code}). Progress updated to ${newProgress}%.`,
            metadata: {
              courseId: c.id,
              courseTitle: c.title,
              lessonTitle: targetLesson.title,
            },
          });
        }

        const updatedCourse = {
          ...c,
          lessons: updatedLessons,
          completedLessons: completedCount,
          progress: newProgress,
        };

        if (selectedCourse?.id === courseId) {
          setSelectedCourse(updatedCourse);
        }

        return updatedCourse;
      })
    );

    showToast(language === 'vi'
      ? 'Đã cập nhật tiến độ bài học và đồng bộ thanh tiến độ khóa học!'
      : 'Lesson progress updated and synced with course progress bar!');
  };

  const handleCvAnalysisComplete = (result: CvAnalysis) => {
    setCvAnalysis(result);
    setCourses((prev) =>
      prev.map((c) => ({
        ...c,
        isRecommendedFromCv: result.suggestedCourseIds.includes(c.id),
      }))
    );
    addHistoryItem({
      type: 'cv_scan',
      title: language === 'vi' ? 'Quét & Phân tích CV hoàn tất' : 'CV Scan completed',
      description: language === 'vi'
        ? `Tệp ${result.fileName} đạt ${result.matchScore}/100 điểm tương thích với vị trí ${result.targetRole}. Đã gắn nhãn khóa học đề xuất.`
        : `File ${result.fileName} scored ${result.matchScore}/100 match for ${result.targetRole}. Suggested modules highlighted.`,
      metadata: {
        analysisId: result.analysisId,
        score: result.matchScore,
        targetRole: result.targetRole,
        fileName: result.fileName,
      },
    });
    showToast(language === 'vi'
      ? `Quét CV thành công! Điểm tương thích: ${result.matchScore}/100. Đã đánh dấu khóa học bù đắp kỹ năng.`
      : `CV Scanned! Match score: ${result.matchScore}/100. Recommended modules highlighted.`);
  };

  const handleApplyCvRecommendations = () => {
    if (!cvAnalysis) return;
    setCourses((prev) =>
      prev.map((c) => ({
        ...c,
        isRecommendedFromCv: cvAnalysis.suggestedCourseIds.includes(c.id),
      }))
    );
    showToast(language === 'vi'
      ? 'Đã gắn nhãn "Gợi ý từ CV" cho các học phần liên quan!'
      : 'Applied "Recommended from CV" badges to related courses!');
  };

  // 1. Landing Page View (Default for public visitors)
  if (viewMode === 'landing') {
    return (
      <div className="min-h-screen font-sans transition-colors duration-200">
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs sm:text-sm px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-neutral-700 dark:border-neutral-300 animate-in fade-in slide-in-from-bottom-5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
        <LandingPage
          onNavigateToAuth={(targetTab) => {
            if (targetTab) setIntendedTab(targetTab);
            setViewMode('auth');
          }}
          language={language}
          onLanguageChange={setLanguage}
          theme={theme}
          onThemeChange={setTheme}
        />
      </div>
    );
  }

  // 2. Auth Page View (Dedicated full-screen login & register)
  if (viewMode === 'auth' || (!user && viewMode === 'portal')) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 font-sans transition-colors duration-200">
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs sm:text-sm px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-neutral-700 dark:border-neutral-300 animate-in fade-in slide-in-from-bottom-5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
        <AuthPage
          onLoginSuccess={handleLoginSuccess}
          onBack={() => setViewMode('landing')}
          canGoBack={true}
          language={language}
          onLanguageChange={setLanguage}
          theme={theme}
          onThemeChange={setTheme}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans transition-colors duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs sm:text-sm px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-neutral-700 dark:border-neutral-300 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Authentic Gemini Activity History Sidebar (Left) */}
      <GeminiHistorySidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        history={history}
        onClearHistory={handleClearHistory}
        onDeleteItem={handleDeleteHistoryItem}
        onSelectHistoryItem={handleSelectHistoryItem}
        onNewScan={handleNewScan}
        activeTab={activeTab}
        onNavigateToTab={setActiveTab}
        user={user}
        onOpenSettings={() => setCustomizeOpen(true)}
        onLogout={handleLogout}
        language={language}
      />

      {/* 2. Main Portal Scroll Container (Right) */}
      <div id="portal-scroll-container" className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* LMS Deep Teal Navbar with Sidebar Toggle */}
        <LmsNavbar
          user={user}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onQuickCvScanClick={() => setActiveTab('cv-scanner')}
          language={language}
          onLanguageChange={setLanguage}
          theme={theme}
          onThemeChange={setTheme}
          onOpenCustomize={() => setCustomizeOpen(true)}
          onOpenProfile={() => setProfileModalOpen(true)}
          onLogout={handleLogout}
          onNavigateToLanding={() => setViewMode('landing')}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isSidebarCollapsed={isSidebarCollapsed}
          onSwitchUser={handleSwitchUser}
        />

        {/* Subheader with 4 Primary Workflow Tabs (Admin tab only visible when user.role === 'admin') */}
        <LmsSubheader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          totalCoursesCount={courses.length}
          hasCvAnalysis={Boolean(cvAnalysis)}
          language={language}
          onOpenCustomize={() => setCustomizeOpen(true)}
          user={user}
        />

        {/* Main Educational Dashboard Workspace */}
        <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-6 flex-1">
          {/* Top Guided Workflow Stepper */}
          <WorkflowStepper
            activeTab={activeTab}
            onTabChange={setActiveTab}
            hasCvAnalysis={Boolean(cvAnalysis)}
            language={language}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Main Area: 8 columns on large screens (12 on admin tab) */}
            <div className={`${activeTab === 'admin' ? 'lg:col-span-12' : 'lg:col-span-8'} space-y-6`}>
              {/* Tab: Admin Users Management (Protected for Admin accounts only) */}
              {activeTab === 'admin' && (
                user?.role === 'admin' ? (
                  <AdminUsersView
                    courses={courses}
                    onDeleteCourse={handleDeleteCourse}
                    onOpenAddCourse={() => setIsAddResourceOpen(true)}
                  />
                ) : (
                  <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-rose-200 dark:border-rose-900/70 p-8 sm:p-12 text-center space-y-4 shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center shadow-inner">
                      <ShieldAlert className="w-8 h-8" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                        {language === 'vi' ? 'Yêu Cầu Quyền Quản Trị Viên (Admin)' : 'Administrator Privileges Required'}
                      </h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
                        {language === 'vi'
                          ? 'Cổng Quản Trị Người Dùng & Dữ Liệu chỉ dành riêng cho tài khoản Quản Trị Viên được cấp phép, không khả dụng cho tài khoản người dùng thường.'
                          : 'The User Management Portal is restricted to authorized Administrator accounts, not available for regular user accounts.'}
                      </p>
                    </div>
                    <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={() => handleSwitchUser(adminUser)}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        {language === 'vi' ? 'Đăng nhập tài khoản Quản Trị Viên (Admin)' : 'Sign In with Admin Account'}
                      </button>
                      <button
                        onClick={() => setActiveTab('cv-scanner')}
                        className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold rounded-xl border border-neutral-300 dark:border-neutral-700 transition-colors cursor-pointer"
                      >
                        {language === 'vi' ? 'Quay về Cổng Học Viên' : 'Return to Student Portal'}
                      </button>
                    </div>
                  </div>
                )
              )}

              {/* Tab: Courses Grid */}
              {activeTab === 'courses' && (
                <CourseGrid
                  courses={courses}
                  onSelectCourse={setSelectedCourse}
                  onQuickContinue={setSelectedCourse}
                  onOpenCvTab={() => setActiveTab('cv-scanner')}
                  onGoToAssessment={() => setActiveTab('assessment')}
                  isAdmin={isAdmin}
                  onOpenAddResource={isAdmin ? () => setIsAddResourceOpen(true) : undefined}
                  onDeleteCourse={isAdmin ? handleDeleteCourse : undefined}
                  language={language}
                />
              )}

              {/* Tab: CV Scanner & Skill Gap Matcher */}
              {activeTab === 'cv-scanner' && (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm transition-colors duration-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-ueh-orange">
                        <Sparkles className="w-5 h-5" />
                      </span>
                      <div>
                        <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                          {language === 'vi' ? 'Quét CV & Tự Động Đối Soát Học Phần LMS' : 'AI CV Scanner & LMS Course Matcher'}
                        </h2>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {language === 'vi'
                            ? 'Kéo thả CV (PDF/DOCX) để AI trích xuất kỹ năng và tìm môn học bù đắp khoảng trống nghề nghiệp.'
                            : 'Upload your CV (PDF/DOCX) for AI to extract skills and match modules bridging career gaps.'}
                        </p>
                      </div>
                    </div>

                    <FileUploadZone
                      onAnalysisComplete={handleCvAnalysisComplete}
                      isAnalyzing={false}
                    />
                  </div>

                  {cvAnalysis && (
                    <CvAnalysisResult
                      analysis={cvAnalysis}
                      allCourses={courses}
                      onSelectCourse={setSelectedCourse}
                      onApplyRecommendations={handleApplyCvRecommendations}
                    />
                  )}
                </div>
              )}

              {/* Tab: AI Skill Assessment Chat */}
              {activeTab === 'assessment' && (
                <SkillAssessmentChat
                  onGoToRoadmap={() => setActiveTab('roadmap')}
                />
              )}

              {/* Tab: Personalized Career Roadmap */}
              {activeTab === 'roadmap' && (
                <CareerRoadmap
                  courses={courses}
                  onSelectCourse={setSelectedCourse}
                  cvAnalysis={cvAnalysis}
                />
              )}

              {/* Tab: Web & Learning Activity History */}
              {activeTab === 'history' && (
                <ActivityHistory
                  history={history}
                  onClearHistory={handleClearHistory}
                  onNavigateToTab={setActiveTab}
                  onSelectCourse={setSelectedCourse}
                  onSelectHistoryItem={handleSelectHistoryItem}
                  allCourses={courses}
                  language={language}
                />
              )}
            </div>

            {/* Right Sidebar: 4 columns on large screens (hide when on admin tab) */}
            {activeTab !== 'admin' && (
              <div className="lg:col-span-4">
                <LmsSidebar
                  courses={courses}
                  onSelectCourse={setSelectedCourse}
                  onNavigateToCvScan={() => setActiveTab('cv-scanner')}
                  hasCvAnalysis={Boolean(cvAnalysis)}
                  language={language}
                />
              </div>
            )}
          </div>
        </div>

        {/* 5. 4-Column Footer */}
        <LmsFooter />
      </div>

      {/* Course Detail / Lesson Player Modal */}
      <CourseDetailModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onToggleLesson={handleToggleLesson}
      />

      {/* Customize Page Modal (Light/Dark Theme & Language) */}
      <CustomizeModal
        isOpen={customizeOpen}
        onClose={() => setCustomizeOpen(false)}
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeChange={setTheme}
      />

      {/* Teacher Add Resource Modal */}
      <AddResourceModal
        isOpen={isAddResourceOpen}
        onClose={() => setIsAddResourceOpen(false)}
        onAddResource={handleCreateResource}
      />

      {/* User Profile, Security & Preferences Modal */}
      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={user}
        onUserUpdate={(updatedUser) => setUser(updatedUser)}
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onThemeChange={setTheme}
      />
    </div>
  );
}

