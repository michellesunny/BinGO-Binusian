import React from 'react';
import bingoLogoSvg from '../assets/gambar/bingo_logo.svg';
import bingoLogoPng from '../assets/gambar/bingo_logo.png';

interface BingoLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showSubtitle?: boolean;
  showMascot?: boolean;
  variant?: 'light' | 'dark';
  mode?: 'image' | 'vector';
}

export const BingoLogo: React.FC<BingoLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'light',
}) => {
  const isDark = variant === 'dark';

  // Responsive height scaling matching various UI contexts
  const sizeClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-11',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24',
    full: 'h-28 sm:h-32',
  }[size];

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${
        isDark ? 'bg-white px-2 py-1 rounded-xl shadow-xs' : ''
      } ${className}`}
      title="BinGO! BINUS Grab & Order"
    >
      <img
        src={bingoLogoSvg || bingoLogoPng}
        alt="BinGO! BINUS Grab & Order"
        referrerPolicy="no-referrer"
        className={`${sizeClasses} w-auto object-contain shrink-0`}
      />
    </div>
  );
};
