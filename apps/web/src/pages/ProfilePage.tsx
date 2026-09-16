import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, refreshProfile, logout } = useAuth();

  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [targetRole, setTargetRole] = useState('backend_developer');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setBio(user.bio || '');
      setTargetRole(user.targetRole || 'backend_developer');
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage(null);

    try {
      await authService.updateProfile({
        fullName,
        bio,
        targetRole,
      });
      await refreshProfile();
      setMessage({ type: 'success', text: 'Cập nhật thông tin hồ sơ thành công!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Cập nhật thất bại. Vui lòng thử lại.' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setIsUploadingAvatar(true);
      setMessage(null);

      try {
        await authService.uploadAvatar(file);
        await refreshProfile();
        setMessage({ type: 'success', text: 'Tải lên ảnh đại diện thành công!' });
      } catch (err: any) {
        setMessage({ type: 'error', text: err.message || 'Tải ảnh đại diện thất bại.' });
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <main className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <Card padding="lg" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={{ marginBottom: '0.75rem' }}>Yêu Cầu Đăng Nhập</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Vui lòng đăng nhập hoặc tạo tài khoản để quản lý hồ sơ cá nhân và theo dõi lộ trình học tập của bạn.
          </p>
        </Card>
      </main>
    );
  }

  return (
    <main className="container" style={{ padding: '3.5rem 1.5rem 5rem 1.5rem', maxWidth: '750px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Badge variant="indigo" size="md" style={{ marginBottom: '0.5rem' }}>
          Tài Khoản Cá Nhân
        </Badge>
        <h1>Hồ Sơ Của Bạn</h1>
      </div>

      {message ? (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            background: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
            border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
            color: message.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-rose)',
            fontSize: '0.9rem',
          }}
        >
          {message.text}
        </div>
      ) : null}

      <Card padding="lg">
        {/* Avatar Section */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            paddingBottom: '2rem',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--grad-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              color: '#ffffff',
              overflow: 'hidden',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
              flexShrink: 0,
            }}
          >
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              (user.fullName || user.email).charAt(0).toUpperCase()
            )}
          </div>

          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{user.fullName || 'Người Dùng Skillora'}</h3>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user.email}</span>
              <Badge variant="violet" size="sm">
                {user.role === 'teacher' ? 'Giảng Viên' : user.role === 'admin' ? 'Quản Trị Viên' : 'Sinh Viên'}
              </Badge>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              isLoading={isUploadingAvatar}
              onClick={() => fileInputRef.current?.click()}
            >
              📷 Đổi Ảnh Đại Diện (Cloudinary)
            </Button>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Họ và Tên</label>
            <input
              type="text"
              required
              className="form-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email (Không thể thay đổi)</label>
            <input
              type="email"
              disabled
              className="form-input"
              value={user.email}
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mục tiêu nghề nghiệp</label>
            <select
              className="form-select"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            >
              <option value="backend_developer">Kỹ Sư Backend (Backend Developer)</option>
              <option value="data_analyst">Chuyên Viên Phân Tích Dữ Liệu (Data Analyst)</option>
              <option value="ai_engineer">Kỹ Sư Trí Tuệ Nhân Tạo (AI Engineer)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Tiểu sử ngắn / Mục tiêu học tập</label>
            <textarea
              className="form-textarea"
              placeholder="Chia sẻ đôi nét về mục tiêu nghề nghiệp và các kỹ năng bạn đang hướng đến..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
            <Button type="button" variant="danger" size="md" onClick={logout}>
              Đăng Xuất
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={isUpdating}>
              Lưu Thay Đổi
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
};
