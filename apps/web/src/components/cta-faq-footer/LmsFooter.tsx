import React, { useState } from 'react';

export const LmsFooter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="dark:bg-slate-950 bg-[#fafafa] pt-20 pb-5 max-[900px]:pt-[60px] border-t border-neutral-200/80">
      <div className="max-w-[1100px] w-full mx-auto px-5">
        <div className="grid grid-cols-[2fr_1fr_1fr_2fr] gap-10 mb-[50px] max-[900px]:grid-cols-2 max-[480px]:grid-cols-1">
          {/* 1. Logo Column */}
          <div>
            <img
              src="https://pub-f170a2592d2c4a1485466404c36807be.r2.dev/Tests/logoipsum-415.svg"
              alt="Logo"
              className="h-6 mb-[15px]"
              style={{ filter: 'brightness(2)' }}
            />
            <p className="text-[0.85rem] text-[#888] leading-[1.6] max-w-[240px]">
              Nền tảng học tập thông minh, quét CV và đối soát kỹ năng chuẩn nghề nghiệp tương lai.
            </p>
          </div>

          {/* 2. Navigation */}
          <div>
            <h4 className="font-semibold mb-5 text-[0.95rem] text-neutral-900 dark:text-white">
              Khám phá
            </h4>
            <ul>
              {[
                { name: 'Khóa học của tôi', href: '#courses' },
                { name: 'Quét & Phân tích CV', href: '#cv' },
                { name: 'Đánh giá Năng lực AI', href: '#assessment' },
                { name: 'Lộ trình Nghề nghiệp', href: '#roadmap' },
              ].map((item) => (
                <li key={item.name} className="mb-3">
                  <a
                    href={item.href}
                    className="text-[#888] no-underline text-[0.85rem] transition-colors duration-200 hover:text-neutral-900"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Pages */}
          <div>
            <h4 className="font-semibold mb-5 text-[0.95rem] text-neutral-900 dark:text-white">
              Hệ thống
            </h4>
            <ul>
              {[
                { name: 'Trang chủ', href: '#' },
                { name: 'Trung tâm Trợ giúp', href: '#help' },
                { name: 'Chính sách Bảo mật', href: '#privacy' },
              ].map((item) => (
                <li key={item.name} className="mb-3">
                  <a
                    href={item.href}
                    className="text-[#888] no-underline text-[0.85rem] transition-colors duration-200 hover:text-neutral-900"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Newsletter */}
          <div>
            <h4 className="font-semibold mb-5 text-[0.95rem] text-neutral-900 dark:text-white">
              Bản tin Nghề nghiệp
            </h4>
            <p className="text-[0.85rem] text-[#888] mb-[15px]">
              Đăng ký để nhận gợi ý học phần & cơ hội việc làm mới nhất.
            </p>
            {subscribed ? (
              <div className="text-xs text-emerald-600 font-semibold p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                ✓ Cảm ơn bạn đã đăng ký nhận tin!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-[10px]">
                <input
                  type="email"
                  required
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow border border-[#f0f0f0] dark:border-[#f0f0f0] bg-white dark:bg-slate-800 outline-none transition-colors duration-200 focus:border-[#ccc] dark:focus:border-[#ccc] text-[0.9rem]"
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)',
                  }}
                />
                <button
                  type="submit"
                  className="bg-neutral-900 dark:bg-slate-100 text-white dark:text-slate-900 border-none font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-0.5 text-[0.9rem]"
                  style={{
                    padding: '12px 28px',
                    borderRadius: '10px',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.4)',
                  }}
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#f0f0f0] dark:border-slate-800 pt-[25px] pb-[10px] flex justify-between text-[0.85rem] text-[#888] dark:text-slate-400 max-[480px]:flex-col max-[480px]:gap-[15px] max-[480px]:items-center">
          <div>All rights reserved. © 2025</div>
          <div>Designed by Peter Design</div>
        </div>
      </div>
    </footer>
  );
};
