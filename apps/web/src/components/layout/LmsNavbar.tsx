import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Globe,
  Bell,
  Menu,
  X,
  Sparkles,
  BookOpen,
  Sun,
  Moon,
  Check,
  LogIn,
  LogOut,
  User,
  SlidersHorizontal,
  Home,
  FileText,
  MessageSquare,
  Compass,
  Target,
  PanelLeftOpen,
  ShieldCheck,
} from 'lucide-react';
import { UserProfile, MainTabType } from '../../types';
import { currentUser, adminUser } from '../../data/mockData';
import { Language, ThemeMode, translations } from '../../i18n/translations';

interface LmsNavbarProps {
  user: UserProfile | null;
  activeTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
  onQuickCvScanClick: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onOpenCustomize: () => void;
  onOpenProfile?: () => void;
  onLogout?: () => void;
  onNavigateToLanding?: () => void;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  onSwitchUser?: (user: UserProfile) => void;
}

export const LmsNavbar: React.FC<LmsNavbarProps> = ({
  user,
  activeTab,
  onTabChange,
  onQuickCvScanClick,
  language,
  onLanguageChange,
  theme,
  onThemeChange,
  onOpenCustomize,
  onOpenProfile,
  onLogout,
  onNavigateToLanding,
  onToggleSidebar,
  isSidebarCollapsed,
  onSwitchUser,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const langMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const t = translations[language];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-ueh-teal dark:bg-[#00383f] text-white sticky top-0 z-40 shadow-md transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 flex items-center justify-between h-[52px]">
        {/* Left: LMS Navigation Tabs */}
        <div className="flex items-center h-full overflow-x-auto no-scrollbar space-x-0.5">
          {/* Gemini Sidebar Toggle Button in Navbar */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="h-full px-3 hover:bg-ueh-darkteal text-white/90 hover:text-white flex items-center justify-center transition-colors shrink-0"
              title={isSidebarCollapsed ? 'Mở thanh Lịch sử Gemini' : 'Thu gọn thanh Lịch sử'}
              aria-label="Toggle Activity History Sidebar"
            >
              <PanelLeftOpen className="w-4 h-4 text-amber-300" />
            </button>
          )}

          {/* Main LMS Brand Tab */}
          <button
            onClick={() => onTabChange('cv-scanner')}
            className="flex items-center gap-1.5 h-full px-4 bg-[#f15a38] font-bold text-sm tracking-wide transition-colors hover:bg-[#e04a28] shrink-0"
            title={language === 'vi' ? 'Trở về Quét CV & Đánh giá Năng lực' : 'Go to CV Scanner & Assessment'}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.brand}</span>
          </button>

          {/* Educational and career navigation links */}
          <nav className="hidden lg:flex items-center h-full text-xs font-medium">
            <button
              onClick={() => onTabChange('cv-scanner')}
              className={`h-full flex items-center gap-1 px-2.5 xl:px-3.5 transition-colors text-white/90 hover:bg-ueh-darkteal whitespace-nowrap shrink-0 ${
                activeTab === 'cv-scanner' ? 'bg-ueh-darkteal text-white font-bold shadow-inner' : ''
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.cvScanner}</span>
            </button>
            <button
              onClick={() => onTabChange('courses')}
              className={`h-full flex items-center px-2.5 xl:px-3 transition-colors text-white/90 hover:bg-ueh-darkteal whitespace-nowrap shrink-0 ${
                activeTab === 'courses' ? 'bg-ueh-darkteal text-white font-semibold' : ''
              }`}
            >
              {t.myCourses}
            </button>
            <button
              onClick={() => onTabChange('assessment')}
              className={`h-full flex items-center px-2.5 xl:px-3 transition-colors text-white/90 hover:bg-ueh-darkteal whitespace-nowrap shrink-0 ${
                activeTab === 'assessment' ? 'bg-ueh-darkteal text-white font-semibold' : ''
              }`}
            >
              {t.aiAssessment}
            </button>
            <button
              onClick={() => onTabChange('roadmap')}
              className={`h-full flex items-center px-2.5 xl:px-3 transition-colors text-white/90 hover:bg-ueh-darkteal whitespace-nowrap shrink-0 ${
                activeTab === 'roadmap' ? 'bg-ueh-darkteal text-white font-semibold' : ''
              }`}
            >
              {t.careerRoadmap}
            </button>
          </nav>
        </div>

        {/* Right: Actions + Search + Theme Toggle + Language Dropdown + Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* CV Scan Shortcut Button */}
          <button
            onClick={onQuickCvScanClick}
            className={`hidden 2xl:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-sm transition-all ${
              activeTab === 'cv-scanner'
                ? 'bg-amber-400 text-neutral-900 ring-2 ring-white'
                : 'bg-gradient-to-r from-amber-400 to-orange-400 text-neutral-950 hover:brightness-105'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-900 fill-amber-900" />
            <span>{t.quickCv}</span>
          </button>

          {/* Search Box with Orange Button */}
          <div className="relative hidden xl:flex items-center">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-36 xl:w-44 h-8 pl-3 pr-8 rounded-l text-xs text-neutral-900 bg-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-ueh-orange"
            />
            <button
              aria-label="Tìm kiếm"
              className="h-8 px-2.5 bg-ueh-orange hover:bg-[#e05f12] text-white rounded-r flex items-center justify-center transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Theme Toggle Button (Light/Dark) */}
          <button
            onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
            title={theme === 'light' ? t.darkMode : t.lightMode}
            className="p-1.5 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-amber-200" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Language Selector Dropdown */}
          <div ref={langMenuRef} className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 text-xs text-white/90 hover:text-white px-2 py-1 rounded hover:bg-white/10 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {language === 'vi' ? 'Tiếng Việt' : 'English'}
              </span>
              <span className="text-[10px]">▼</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-neutral-200 dark:border-neutral-700 py-1 text-xs text-neutral-800 dark:text-neutral-100 z-50 animate-in fade-in zoom-in-95">
                <button
                  onClick={() => {
                    onLanguageChange('vi');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-700 ${
                    language === 'vi' ? 'text-ueh-teal dark:text-teal-400 font-bold' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>🇻🇳</span>
                    <span>Tiếng Việt</span>
                  </div>
                  {language === 'vi' && <Check className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => {
                    onLanguageChange('en');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-700 ${
                    language === 'en' ? 'text-ueh-teal dark:text-teal-400 font-bold' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>🇬🇧</span>
                    <span>English</span>
                  </div>
                  {language === 'en' && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          {/* Notifications */}
          <button className="relative p-1.5 text-white/85 hover:text-white hover:bg-white/10 rounded-full transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-ueh-orange rounded-full"></span>
          </button>

          {/* User Profile / Login State */}
          {user ? (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                title={user.role === 'admin' ? 'Tài khoản Quản trị viên' : 'Hồ sơ sinh viên & Tùy chọn'}
                className="flex items-center gap-2 pl-1.5 border-l border-white/20 cursor-pointer group"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-white/40 group-hover:ring-2 group-hover:ring-white transition-all"
                />
                <span className="hidden xl:inline text-xs font-medium text-white/95 group-hover:text-white max-w-[120px] truncate">
                  {user.name}
                </span>
                {user.role === 'admin' && (
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-rose-500 text-white font-bold text-[9px] tracking-wider uppercase shadow-xs">
                    Admin
                  </span>
                )}
                <span className="text-[10px] text-white/70">▼</span>
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 py-2.5 text-xs text-neutral-800 dark:text-neutral-100 z-50 animate-in fade-in zoom-in-95">
                  {/* User Info Card Header */}
                  <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-700/80">
                    <div className="flex items-center justify-between gap-1">
                      <p className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      {user.role === 'admin' ? (
                        <span className="px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 font-bold text-[10px] uppercase">
                          Admin
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 font-medium text-[10px] uppercase">
                          Học viên
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {user.role === 'admin' ? 'Mã QTV: ' : 'MSSV: '}
                      <span className="font-semibold text-ueh-teal dark:text-teal-400">{user.studentId}</span>
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                      {user.faculty}
                    </p>
                    {user.careerGoal && (
                      <div className="mt-1.5 px-2 py-1 rounded bg-teal-50 dark:bg-teal-950/50 border border-teal-200/50 dark:border-teal-800/50 text-[10px] text-ueh-teal dark:text-teal-300 font-medium flex items-center gap-1.5 truncate">
                        <Target className="w-3 h-3 shrink-0 text-ueh-teal dark:text-teal-400" />
                        <span className="truncate">{user.careerGoal}</span>
                      </div>
                    )}
                  </div>

                  {/* Menu Options */}
                  <div className="py-1">
                    {/* Admin portal shortcut if logged in as admin */}
                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          onTabChange('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 flex items-center gap-2.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-rose-500" />
                        <span>{language === 'vi' ? 'Cổng Quản Trị Hệ Thống (Admin)' : 'Admin Management Portal'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (onOpenProfile) onOpenProfile();
                        else onOpenCustomize();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 flex items-center gap-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-ueh-teal dark:text-teal-400" />
                      <span>{language === 'vi' ? 'Hồ sơ & Đổi mật khẩu' : 'Profile & Security'}</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenCustomize();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 flex items-center gap-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 cursor-pointer"
                    >
                      <SlidersHorizontal className="w-4 h-4 text-ueh-teal dark:text-teal-400" />
                      <span>{t.customisePage}</span>
                    </button>

                    {/* Quick Role Switcher (Student <-> Admin) */}
                    {onSwitchUser && (
                      <button
                        onClick={() => {
                          if (user.role === 'admin') {
                            onSwitchUser(currentUser);
                          } else {
                            onSwitchUser(adminUser);
                          }
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 flex items-center gap-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 cursor-pointer"
                      >
                        {user.role === 'admin' ? (
                          <>
                            <User className="w-4 h-4 text-ueh-teal dark:text-teal-400" />
                            <span>{language === 'vi' ? 'Đổi sang tài khoản Sinh Viên' : 'Switch to Student Account'}</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4 text-rose-500" />
                            <span>{language === 'vi' ? 'Đổi sang tài khoản Admin' : 'Switch to Admin Account'}</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onTabChange('login');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 flex items-center gap-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200"
                    >
                      <User className="w-4 h-4 text-amber-500" />
                      <span>{language === 'vi' ? 'Đăng nhập tài khoản khác' : 'Switch Account'}</span>
                    </button>

                    {onNavigateToLanding && (
                      <button
                        onClick={() => {
                          onNavigateToLanding();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 flex items-center gap-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200"
                      >
                        <Home className="w-4 h-4 text-ueh-teal dark:text-teal-400" />
                        <span>{language === 'vi' ? 'Xem Trang chủ giới thiệu' : 'View Landing Page'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (onLogout) onLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 flex items-center gap-2.5 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t.logout}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onTabChange('login')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#f15a38] hover:bg-[#e04a28] text-white text-xs font-bold shadow transition-all active:scale-95 shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t.login}</span>
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-white hover:bg-white/10 rounded"
            aria-label="Mở menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-ueh-darkteal dark:bg-[#002b31] border-t border-white/10 px-4 py-3 space-y-2 text-sm">
          <div className="pb-2 border-b border-white/10 flex items-center justify-between">
            {user ? (
              <div className="truncate pr-2">
                <p className="text-xs text-white/90 font-medium truncate">
                  {user.name} ({user.studentId})
                </p>
                <p className="text-[10px] text-teal-200/80 truncate">{user.faculty}</p>
              </div>
            ) : (
              <span className="text-xs text-white/70">{t.notLoggedIn}</span>
            )}

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
                className="p-1 text-white bg-white/10 rounded text-xs"
              >
                {theme === 'light' ? '🌙 Tối' : '☀️ Sáng'}
              </button>

              {user ? (
                <button
                  onClick={() => {
                    if (onLogout) onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-2 py-0.5 bg-red-500/80 text-white text-xs font-medium rounded"
                >
                  {t.logout}
                </button>
              ) : (
                <button
                  onClick={() => {
                    onTabChange('login');
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-0.5 bg-ueh-orange text-white text-xs font-bold rounded"
                >
                  {t.login}
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
            <button
              onClick={() => {
                onTabChange('cv-scanner');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-left py-2 px-2.5 rounded bg-white/10 hover:bg-white/20 cursor-pointer font-semibold"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>{t.cvScanner}</span>
            </button>
            <button
              onClick={() => {
                onTabChange('courses');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-left py-2 px-2.5 rounded hover:bg-white/10 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-teal-300" />
              <span>{t.myCourses}</span>
            </button>
            <button
              onClick={() => {
                onTabChange('assessment');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-left py-2 px-2.5 rounded hover:bg-white/10 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-sky-300" />
              <span>{t.aiAssessment}</span>
            </button>
            <button
              onClick={() => {
                onTabChange('roadmap');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-left py-2 px-2.5 rounded hover:bg-white/10 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-purple-300" />
              <span>{t.careerRoadmap}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

