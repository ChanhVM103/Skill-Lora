import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  User,
  Shield,
  Palette,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Mail,
  Phone,
  BookOpen,
  Briefcase,
  Globe,
  Sun,
  Moon,
  Sparkles,
  UploadCloud,
} from 'lucide-react';
import { profileService, ChangePasswordPayload } from '../../services/profile.service';
import { Language, ThemeMode, translations } from '../../i18n/translations';
import type { UserProfile } from '../../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onUserUpdate: (updated: UserProfile) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUserUpdate,
  language,
  onLanguageChange,
  theme,
  onThemeChange,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'appearance'>('profile');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    fullName: user?.name || '',
    email: '',
    phone: '',
    bio: '',
    school: user?.faculty || '',
    major: 'Công nghệ thông tin',
    targetRole: user?.careerGoal || 'backend_developer',
    avatar: user?.avatar || '',
  });

  // Password Form state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const t = translations[language];

  useEffect(() => {
    if (isOpen) {
      // Load current profile from Backend API
      profileService
        .getProfile()
        .then((data: any) => {
          setProfileForm({
            fullName: data.fullName || user?.name || '',
            email: data.email || '',
            phone: data.phone || '',
            bio: data.bio || '',
            school: data.school || user?.faculty || '',
            major: data.major || 'Công nghệ thông tin',
            targetRole: data.targetRole || user?.careerGoal || 'backend_developer',
            avatar: data.avatar || data.avatarUrl || user?.avatar || '',
          });
        })
        .catch(() => {
          // fallback to localStorage user
          const savedStr = localStorage.getItem('user');
          if (savedStr) {
            try {
              const u = JSON.parse(savedStr);
              setProfileForm((prev) => ({
                ...prev,
                fullName: u.fullName || prev.fullName,
                email: u.email || prev.email,
                phone: u.phone || prev.phone,
                avatar: u.avatar || u.avatarUrl || prev.avatar,
              }));
            } catch {}
          }
        });
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const updated = await profileService.updateProfile({
        fullName: profileForm.fullName,
        phone: profileForm.phone,
        bio: profileForm.bio,
        school: profileForm.school,
        major: profileForm.major,
        targetRole: profileForm.targetRole,
        avatar: profileForm.avatar,
      });

      // Update parent state
      onUserUpdate({
        name: updated.fullName || profileForm.fullName,
        studentId: user?.studentId || '2026-IT',
        faculty: updated.school || profileForm.school,
        careerGoal: updated.targetRole || profileForm.targetRole,
        avatar: updated.avatar || updated.avatarUrl || profileForm.avatar,
      });

      showToast('Cập nhật thông tin cá nhân thành công!');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Không thể cập nhật hồ sơ.');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Ảnh đại diện không được vượt quá 5MB.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const { avatarUrl } = await profileService.uploadAvatar(file);
      if (avatarUrl) {
        setProfileForm((prev) => ({ ...prev, avatar: avatarUrl }));
        onUserUpdate({
          ...user!,
          avatar: avatarUrl,
        });
        showToast('Tải ảnh đại diện lên Cloudinary thành công!');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Lỗi khi tải ảnh đại diện lên.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (passwordForm.newPassword.length < 6) {
      setErrorMsg('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp!');
      return;
    }

    setLoading(true);
    try {
      await profileService.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      showToast('Đổi mật khẩu thành công!');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setErrorMsg(err?.message || 'Lỗi khi đổi mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-800/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-ueh-teal flex items-center justify-center text-white shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Hồ Sơ & Cài Đặt Tài Khoản
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Quản lý thông tin cá nhân, bảo mật và tùy biến giao diện
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-neutral-200/60 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-neutral-100 dark:border-neutral-800 px-5 bg-white dark:bg-neutral-900">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'border-ueh-teal text-ueh-teal font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Thông tin cá nhân</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'security'
                ? 'border-ueh-teal text-ueh-teal font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Đổi mật khẩu</span>
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'appearance'
                ? 'border-ueh-teal text-ueh-teal font-bold'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Giao diện & Ngôn ngữ</span>
          </button>
        </div>

        {/* Toast / Messages */}
        <div className="px-5 pt-3">
          {successMsg && (
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Tab 1: Profile Information */}
        {activeTab === 'profile' && (
          <form onSubmit={handleUpdateProfile} className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Avatar Section */}
            <div className="flex items-center gap-4 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 to-ueh-teal flex items-center justify-center text-white font-bold text-xl uppercase shadow-xs">
                  {profileForm.avatar ? (
                    <img src={profileForm.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    profileForm.fullName.charAt(0) || 'U'
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-ueh-teal text-white flex items-center justify-center shadow hover:bg-teal-700 transition cursor-pointer"
                  title="Tải ảnh đại diện lên Cloudinary"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                />
              </div>

              <div>
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Ảnh đại diện</h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Tải ảnh (PNG, JPG, WebP tối đa 5MB) lưu trữ trực tiếp trên Cloudinary
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Họ và tên *
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    required
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Số điện thoại
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="0912 345 678"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Trường / Khoa
                </label>
                <div className="relative">
                  <BookOpen className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={profileForm.school}
                    onChange={(e) => setProfileForm({ ...profileForm, school: e.target.value })}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Mục tiêu nghề nghiệp
                </label>
                <div className="relative">
                  <Briefcase className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <select
                    value={profileForm.targetRole}
                    onChange={(e) => setProfileForm({ ...profileForm, targetRole: e.target.value })}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white cursor-pointer"
                  >
                    <option value="backend_developer">Backend Developer</option>
                    <option value="data_analyst">Data Analyst</option>
                    <option value="ai_engineer">AI Engineer</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Tiểu sử / Giới thiệu bản thân
              </label>
              <textarea
                rows={3}
                placeholder="Mô tả kinh nghiệm, sở thích công nghệ hoặc mục tiêu học tập..."
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="w-full p-2.5 text-xs rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-ueh-teal"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-ueh-teal hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-transform hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Change Password & Security */}
        {activeTab === 'security' && (
          <form onSubmit={handleChangePassword} className="p-5 space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Mật khẩu hiện tại *
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Mật khẩu mới (tối thiểu 6 ký tự) *
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Xác nhận mật khẩu mới *
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-ueh-teal hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-transform hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Appearance & Language Preferences */}
        {activeTab === 'appearance' && (
          <div className="p-5 space-y-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 mb-2.5">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Chế độ hiển thị (Theme)</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onThemeChange('light')}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'border-ueh-teal bg-teal-50/50 dark:bg-teal-950/30 text-ueh-teal font-semibold'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span className="text-xs">Sáng (Light)</span>
                </button>
                <button
                  type="button"
                  onClick={() => onThemeChange('dark')}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'border-ueh-teal bg-teal-50/50 dark:bg-teal-950/30 text-ueh-teal font-semibold'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs">Tối (Dark)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 mb-2.5">
                <Globe className="w-3.5 h-3.5 text-ueh-teal" />
                <span>Ngôn ngữ (Language)</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onLanguageChange('vi')}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    language === 'vi'
                      ? 'border-ueh-teal bg-teal-50/50 dark:bg-teal-950/30 text-ueh-teal font-semibold'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <span className="text-base">🇻🇳</span>
                  <span className="text-xs">Tiếng Việt</span>
                </button>
                <button
                  type="button"
                  onClick={() => onLanguageChange('en')}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    language === 'en'
                      ? 'border-ueh-teal bg-teal-50/50 dark:bg-teal-950/30 text-ueh-teal font-semibold'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <span className="text-base">🇬🇧</span>
                  <span className="text-xs">English</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
