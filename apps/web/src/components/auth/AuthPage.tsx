import React, { useState } from 'react';
import {
  BookOpen,
  ArrowLeft,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  GraduationCap,
  CheckCircle2,
  Compass,
  Globe,
  Sun,
  Moon,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { currentUser, adminUser } from '../../data/mockData';
import { Language, ThemeMode, translations } from '../../i18n/translations';
import { authService } from '../../services/auth.service';

interface AuthPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  onBack?: () => void;
  canGoBack?: boolean;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onLoginSuccess,
  onBack,
  canGoBack = true,
  language,
  onLanguageChange,
  theme,
  onThemeChange,
}) => {
  const t = translations[language];
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [faculty, setFaculty] = useState('Khoa Công nghệ Thông tin & Trí tuệ nhân tạo');
  const [careerGoal, setCareerGoal] = useState('Frontend Developer (React/TypeScript)');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!identifier.trim()) {
      setFormError(
        language === 'vi'
          ? 'Vui lòng nhập Mã sinh viên hoặc Email'
          : 'Please enter your Student ID or Email'
      );
      return;
    }
    if (!password.trim()) {
      setFormError(
        language === 'vi'
          ? 'Vui lòng nhập mật khẩu'
          : 'Please enter your password'
      );
      return;
    }

    setIsLoading(true);
    const email = identifier.includes('@')
      ? identifier.trim().toLowerCase()
      : `${identifier.trim().toLowerCase()}@skillora.edu.vn`;

    try {
      const res = await authService.login({ email, password });
      setIsLoading(false);
      const role = res.user?.role || (email.toLowerCase().startsWith('admin') ? 'admin' : 'student');
      const loggedUser: UserProfile = {
        name: res.user?.fullName || (identifier.includes('@') ? identifier.split('@')[0] : `Sinh viên ${identifier}`),
        studentId: identifier.replace(/\D/g, '') || (role === 'admin' ? 'ADMIN-001' : '2612001'),
        faculty: res.user?.major || (role === 'admin' ? 'Ban Quản Trị Hệ Thống Skillora' : 'Khoa Công nghệ Thông tin & Trí tuệ nhân tạo'),
        careerGoal: res.user?.targetRole || (role === 'admin' ? 'System & Academic Administrator' : 'Backend Developer'),
        avatar: res.user?.avatar || res.user?.avatarUrl || (role === 'admin' ? adminUser.avatar : currentUser.avatar),
        role,
        email: res.user?.email || email,
      };
      onLoginSuccess(loggedUser);
    } catch (err: any) {
      setIsLoading(false);
      // Fallback demo login if server unreachable
      if (err.message && err.message.includes('Network Error')) {
        const role = email.toLowerCase().startsWith('admin') ? 'admin' : 'student';
        const demoUser: UserProfile = {
          name: identifier.includes('@') ? identifier.split('@')[0] : (role === 'admin' ? 'Quản Trị Viên' : `Sinh viên ${identifier}`),
          studentId: identifier.replace(/\D/g, '') || (role === 'admin' ? 'ADMIN-001' : '2612001'),
          faculty: role === 'admin' ? 'Ban Quản Trị Hệ Thống' : 'Khoa Công nghệ Thông tin & Trí tuệ nhân tạo',
          careerGoal: role === 'admin' ? 'System Administrator' : 'Backend Developer',
          avatar: role === 'admin' ? adminUser.avatar : currentUser.avatar,
          role,
          email,
        };
        onLoginSuccess(demoUser);
      } else {
        setFormError(
          err.message ||
            (language === 'vi'
              ? 'Đăng nhập không thành công. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.'
              : 'Login failed. Please check your credentials.')
        );
      }
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim()) {
      setFormError(
        language === 'vi' ? 'Vui lòng nhập họ và tên sinh viên' : 'Please enter full name'
      );
      return;
    }
    if (!identifier.trim()) {
      setFormError(
        language === 'vi'
          ? 'Vui lòng nhập Email hoặc Mã sinh viên'
          : 'Please enter your Email or Student ID'
      );
      return;
    }
    if (!password.trim() || password.length < 6) {
      setFormError(
        language === 'vi'
          ? 'Mật khẩu phải chứa ít nhất 6 ký tự'
          : 'Password must be at least 6 characters'
      );
      return;
    }

    setIsLoading(true);
    const email = identifier.includes('@')
      ? identifier.trim().toLowerCase()
      : `${identifier.trim().toLowerCase()}@skillora.edu.vn`;

    try {
      const res = await authService.register({
        fullName: fullName.trim(),
        email,
        password,
        role: 'student',
      });
      setIsLoading(false);
      const newUser: UserProfile = {
        name: res.user?.fullName || fullName.trim(),
        studentId: identifier.replace(/\D/g, '') || ('261' + Math.floor(1000 + Math.random() * 9000)),
        faculty,
        careerGoal,
        avatar: res.user?.avatar || res.user?.avatarUrl || currentUser.avatar,
      };
      onLoginSuccess(newUser);
    } catch (err: any) {
      setIsLoading(false);
      setFormError(
        err.message ||
          (language === 'vi'
            ? 'Đăng ký không thành công. Email có thể đã được sử dụng.'
            : 'Registration failed. Email may already be in use.')
      );
    }
  };

  // 1-Click Demo Login with Student Nguyen Van Minh
  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(currentUser);
    }, 400);
  };

  // 1-Click Demo Login with Dedicated Admin Account
  const handleQuickAdminLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(adminUser);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Floating Control Bar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between z-10">
        {canGoBack && onBack ? (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.backToHome}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#f15a38] text-white font-bold text-xs sm:text-sm shadow-sm">
              <BookOpen className="w-4 h-4" />
              <span>{t.brand}</span>
            </div>
            <span className="hidden sm:inline text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              {language === 'vi' ? 'Cổng Xác Thực Sinh Viên' : 'Student Authentication'}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Theme Toggle */}
          <button
            onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 shadow-sm transition-colors"
            title={theme === 'light' ? t.darkMode : t.lightMode}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-slate-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Quick Language Switcher */}
          <button
            onClick={() => onLanguageChange(language === 'vi' ? 'en' : 'vi')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 shadow-sm transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-ueh-teal dark:text-teal-400" />
            <span>{language === 'vi' ? '🇻🇳 VN' : '🇬🇧 EN'}</span>
          </button>
        </div>
      </header>

      {/* Main Content: Split Hero Banner & Auth Card */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pb-12 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-5xl items-center">
          {/* Left Column: Skillora Hero Branding (5 cols) */}
          <div className="lg:col-span-5 hidden lg:flex flex-col justify-between p-8 rounded-3xl bg-gradient-to-br from-[#00383f] via-ueh-teal to-[#00525d] text-white shadow-2xl relative overflow-hidden min-h-[580px]">
            {/* Background Decorative Rings */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-ueh-orange/20 blur-3xl pointer-events-none" />

            {/* Brand Header */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f15a38] text-white font-bold text-sm tracking-wide shadow-md mb-6">
                <BookOpen className="w-4 h-4" />
                <span>{t.brand}</span>
              </div>

              <h1 className="text-2xl xl:text-3xl font-extrabold leading-tight text-white mb-3">
                {language === 'vi'
                  ? 'Cổng Học Tập & Định Hình Sự Nghiệp Bằng AI'
                  : 'AI-Powered Learning & Career Readiness Portal'}
              </h1>
              <p className="text-xs xl:text-sm text-teal-100/90 leading-relaxed">
                {language === 'vi'
                  ? 'Nền tảng kết nối trực tiếp học phần đào tạo với yêu cầu tuyển dụng thực tế thông qua công nghệ AI CV Scanner.'
                  : 'Bridging curriculum modules with real-world industry demands powered by intelligent AI CV scanning.'}
              </p>
            </div>

            {/* 3 Key Platform Value Props */}
            <div className="relative z-10 space-y-3.5 my-8">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <div className="p-2 rounded-xl bg-orange-500/30 text-amber-300 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white">
                    {language === 'vi' ? 'Quét CV & Nhận Diện Kỹ Năng' : 'AI CV Scanner & Matcher'}
                  </h2>
                  <p className="text-[11px] text-teal-100/80 mt-0.5">
                    {language === 'vi'
                      ? 'Tự động trích xuất kỹ năng, chấm điểm tương thích 84/100 và phát hiện lỗ hổng chuyên môn.'
                      : 'Instantly extract skills, calculate 84/100 match score, and detect domain gaps.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <div className="p-2 rounded-xl bg-teal-500/30 text-teal-200 shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white">
                    {language === 'vi' ? '12+ Khóa Học Chuẩn Đồ Án' : '12+ Practical Micro-Courses'}
                  </h2>
                  <p className="text-[11px] text-teal-100/80 mt-0.5">
                    {language === 'vi'
                      ? 'Gắn nhãn học phần LMS tương ứng để bù đắp ngay kỹ năng còn thiếu trên thị trường.'
                      : 'Directly bridge missing career skills through curated university learning modules.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <div className="p-2 rounded-xl bg-indigo-500/30 text-indigo-200 shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white">
                    {language === 'vi' ? 'Lộ Trình Nghề Nghiệp 6 Tuần' : '6-Week Career Roadmap'}
                  </h2>
                  <p className="text-[11px] text-teal-100/80 mt-0.5">
                    {language === 'vi'
                      ? 'Lộ trình cá nhân hóa từng tuần với AI Coach đồng hành và đánh giá năng lực liên tục.'
                      : 'Personalized step-by-step weekly milestone tracking with AI Coach mentorship.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Trust Badge */}
            <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-teal-100">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Bảo mật dữ liệu sinh viên</span>
              </span>
              <span className="font-semibold text-amber-300">2,500+ Sinh viên</span>
            </div>
          </div>

          {/* Right Column: Authentication Card (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-3xl p-6 sm:p-9 shadow-xl dark:shadow-2xl transition-colors duration-200">
            {/* Tab Selector: Đăng nhập vs Đăng ký */}
            <div className="flex items-center justify-center p-1 bg-slate-100 dark:bg-neutral-800/80 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setFormError(null);
                }}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  authMode === 'login'
                    ? 'bg-white dark:bg-neutral-900 text-ueh-teal dark:text-teal-400 shadow-sm'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {t.login}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setFormError(null);
                }}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  authMode === 'register'
                    ? 'bg-white dark:bg-neutral-900 text-ueh-teal dark:text-teal-400 shadow-sm'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {t.register}
              </button>
            </div>

            {/* Form Title & Subtitle */}
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
                {authMode === 'login' ? t.welcomeBack : t.register}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {authMode === 'login' ? t.loginSubtitle : t.registerSubtitle}
              </p>
            </div>

            {/* Quick Demo Login Banner Buttons (Only in Login Mode) */}
            {authMode === 'login' && (
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-50/80 via-orange-50/50 to-rose-50/80 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-rose-950/20 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{language === 'vi' ? 'Đăng Nhập Nhanh Trải Nghiệm (Demo Accounts)' : 'Quick Preview Accounts'}</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">1-Click Login</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Account 1: Student */}
                  <button
                    type="button"
                    onClick={handleQuickDemoLogin}
                    disabled={isLoading}
                    className="p-2.5 rounded-xl bg-white dark:bg-neutral-850 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-neutral-200 dark:border-neutral-700 hover:border-amber-400 text-left transition-all shadow-2xs group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                          {language === 'vi' ? 'Tài khoản Sinh Viên' : 'Student Account'}
                        </div>
                        <div className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                          Nguyễn Văn Minh (IT)
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Account 2: Dedicated Admin */}
                  <button
                    type="button"
                    onClick={handleQuickAdminLogin}
                    disabled={isLoading}
                    className="p-2.5 rounded-xl bg-white dark:bg-neutral-850 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-neutral-200 dark:border-neutral-700 hover:border-rose-400 text-left transition-all shadow-2xs group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-xs shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-rose-700 dark:text-rose-400 truncate flex items-center gap-1">
                          <span>{language === 'vi' ? 'Tài khoản Admin' : 'Admin Account'}</span>
                          <span className="text-[9px] px-1 py-0.2 rounded bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 font-mono">
                            PRO
                          </span>
                        </div>
                        <div className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                          Quản trị viên Hệ thống
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Error banner */}
            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs font-medium flex items-center gap-2">
                <span>⚠️</span>
                <span>{formError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={authMode === 'login' ? handleLoginSubmit : handleRegisterSubmit} className="space-y-4">
              {/* Full Name field (Register only) */}
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    {t.fullName} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder={language === 'vi' ? 'VD: Nguyễn Quốc Phong' : 'e.g. Alex Nguyen'}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-ueh-teal dark:focus:ring-teal-500 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Student ID or Email field */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  {t.studentIdOrEmail} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder={
                      language === 'vi'
                        ? 'Mã SV (2612001) hoặc email@student.edu.vn'
                        : 'Student ID or student@university.edu'
                    }
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-ueh-teal dark:focus:ring-teal-500 transition-all"
                  />
                </div>
              </div>

              {/* Faculty & Career Goal selectors (Register only) */}
              {authMode === 'register' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      {t.facultyLabel}
                    </label>
                    <select
                      value={faculty}
                      onChange={(e) => setFaculty(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ueh-teal"
                    >
                      <option value="Khoa Công nghệ Thông tin & Trí tuệ nhân tạo">
                        {language === 'vi' ? 'Khoa CNTT & AI' : 'Dept. of IT & AI'}
                      </option>
                      <option value="Khoa Kinh doanh Quốc tế & Marketing">
                        {language === 'vi' ? 'Khoa KDQT & Marketing' : 'Dept. of Int. Business & Mkt'}
                      </option>
                      <option value="Khoa Tài chính - Ngân hàng">
                        {language === 'vi' ? 'Khoa Tài chính - Ngân hàng' : 'Dept. of Finance & Banking'}
                      </option>
                      <option value="Khoa Thiết kế Đồ họa & Trải nghiệm (UI/UX)">
                        {language === 'vi' ? 'Khoa Thiết kế & UI/UX' : 'Dept. of Design & UI/UX'}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      {t.careerGoalLabel}
                    </label>
                    <select
                      value={careerGoal}
                      onChange={(e) => setCareerGoal(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ueh-teal"
                    >
                      <option value="Frontend Developer (React/TypeScript)">
                        Frontend Developer (React/TS)
                      </option>
                      <option value="AI & Data Engineer">AI & Data Engineer</option>
                      <option value="Fullstack Web Developer">Fullstack Web Developer</option>
                      <option value="UI/UX Product Designer">UI/UX Product Designer</option>
                      <option value="Business Analyst / PM">Business Analyst / PM</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Password field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    {t.password} <span className="text-red-500">*</span>
                  </label>
                  {authMode === 'login' && (
                    <a
                      href="#forgot-password"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(
                          language === 'vi'
                            ? 'Vui lòng liên hệ phòng Đào tạo hoặc dùng tính năng Đăng nhập mẫu bên trên.'
                            : 'Please contact the Registrar or use Quick Demo login above.'
                        );
                      }}
                      className="text-[11px] font-medium text-ueh-teal dark:text-teal-400 hover:underline"
                    >
                      {t.forgotPassword}
                    </a>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-ueh-teal dark:focus:ring-teal-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              {authMode === 'login' && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-ueh-teal border-neutral-300 focus:ring-ueh-teal"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-xs text-neutral-600 dark:text-neutral-400 cursor-pointer"
                  >
                    {t.rememberMe}
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-ueh-teal hover:bg-ueh-darkteal text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{authMode === 'login' ? t.login : t.register}</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Toggle Note */}
            <div className="mt-6 pt-5 border-t border-neutral-200 dark:border-neutral-800 text-center text-xs text-neutral-600 dark:text-neutral-400">
              {authMode === 'login' ? (
                <p>
                  {t.noAccount}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setFormError(null);
                    }}
                    className="font-bold text-ueh-teal dark:text-teal-400 hover:underline ml-1"
                  >
                    {t.register}
                  </button>
                </p>
              ) : (
                <p>
                  {t.haveAccount}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setFormError(null);
                    }}
                    className="font-bold text-ueh-teal dark:text-teal-400 hover:underline ml-1"
                  >
                    {t.login}
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
