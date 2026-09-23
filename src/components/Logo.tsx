import React from 'react';
import { Utensils, Sparkles } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'white';
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'full' }) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
  };

  if (variant === 'icon') {
    return (
      <div className="relative inline-flex items-center justify-center p-2 rounded-2xl bg-gradient-to-tr from-[#F38B21] to-[#6CA3D2] text-white shadow-md">
        <Utensils className={iconSizes[size]} />
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-300"></span>
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 select-none">
      <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#F38B21] via-[#FC9B3B] to-[#387CB7] text-white shadow-md shadow-orange-500/20">
        <Utensils className="w-5 h-5 stroke-[2.4]" />
        <div className="absolute -bottom-0.5 -right-0.5 bg-white text-[#135381] rounded-full p-0.5 shadow-xs">
          <Sparkles className="w-2.5 h-2.5 fill-current" />
        </div>
      </div>
      <div className="flex flex-col">
        <div className={`font-black tracking-tight ${sizeClasses[size]} leading-none`}>
          <span className="text-[#F38B21]">Bin</span>
          <span className="text-[#387CB7]">GO</span>
          <span className="text-[#F38B21] italic">!</span>
        </div>
        <span className="text-[9px] font-semibold text-slate-500 tracking-wider uppercase mt-0.5">
          Campus Food & Buddy
        </span>
      </div>
    </div>
  );
};
