import React, { useState } from 'react';

interface AnimatedGradientCtaProps {
  onActionClick: () => void;
}

export const AnimatedGradientCta: React.FC<AnimatedGradientCtaProps> = ({
  onActionClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="c5-animated-gradient rounded-[24px] py-20 px-10 text-white flex flex-col justify-center items-center text-center"
      style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)' }}
    >
      <h2
        className="font-normal leading-[1.1] mb-[15px]"
        style={{ fontSize: '3.5rem', letterSpacing: '-0.03em' }}
      >
        Sẵn Sàng Bứt Phá<br />Cùng Skillora?
      </h2>

      <p className="text-[0.9rem] mb-[30px] font-normal opacity-85">
        Chinh phục kỹ năng công nghệ đỉnh cao & mở lối tương lai sự nghiệp toàn cầu
      </p>

      <button
        onClick={onActionClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-neutral-900 text-white font-semibold cursor-pointer border-none text-[0.95rem] transition-all duration-200 hover:-translate-y-0.5"
        style={{
          padding: '14px 32px',
          borderRadius: '12px',
          boxShadow: isHovered
            ? '0 14px 30px rgba(0,0,0,0.4)'
            : '0 10px 20px rgba(0,0,0,0.3)',
        }}
      >
        Bắt Đầu Đánh Giá Kỹ Năng
      </button>
    </div>
  );
};
