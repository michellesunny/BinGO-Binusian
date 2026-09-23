import React from 'react';
import { Wifi, Battery } from 'lucide-react';

interface StatusBarProps {
  time?: string;
  theme?: 'dark' | 'light';
}

export const StatusBar: React.FC<StatusBarProps> = ({ time = '9:41', theme = 'dark' }) => {
  const isDark = theme === 'dark';

  return (
    <div className={`w-full px-7 pt-3 pb-2 flex items-center justify-between text-xs select-none transition-colors ${
      isDark ? 'text-slate-900' : 'text-white'
    }`}>
      <span className="font-semibold tracking-tight text-sm tabular-nums">{time}</span>

      {/* Dynamic island / notch aesthetic */}
      <div className="w-20 h-4 bg-black rounded-full mx-auto -mt-1 hidden sm:block opacity-90 shadow-sm" />

      <div className="flex items-center gap-1.5 font-medium">
        {/* Cell signal bars */}
        <div className="flex items-end gap-0.5 h-3">
          <span className={`w-0.5 h-1.5 rounded-full ${isDark ? 'bg-slate-900' : 'bg-white'}`} />
          <span className={`w-0.5 h-2 rounded-full ${isDark ? 'bg-slate-900' : 'bg-white'}`} />
          <span className={`w-0.5 h-2.5 rounded-full ${isDark ? 'bg-slate-900' : 'bg-white'}`} />
          <span className={`w-0.5 h-3 rounded-full ${isDark ? 'bg-slate-900' : 'bg-white'}`} />
        </div>
        <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
        <div className="flex items-center gap-0.5">
          <Battery className="w-4 h-4 stroke-[2]" />
        </div>
      </div>
    </div>
  );
};
