import React from 'react';
import { Home, Clock, History } from 'lucide-react';

export type NavTab = 'home' | 'ongoing' | 'history';

interface BottomNavBarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  hasActiveOrder?: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  hasActiveOrder = false,
}) => {
  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-6 pt-2 pb-5 flex flex-col items-center shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-30">
      <div className="w-full max-w-sm flex items-center justify-around">
        {/* Home Tab */}
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-4 min-w-[64px] min-h-[44px] rounded-xl transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'text-[#F38B21] font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
          aria-label="Home"
        >
          <Home className={`w-6 h-6 transition-transform ${activeTab === 'home' ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[11px] mt-1 tracking-tight">Home</span>
          {activeTab === 'home' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#F38B21] mt-0.5" />
          )}
        </button>

        {/* Ongoing Tab */}
        <button
          type="button"
          onClick={() => onSelectTab('ongoing')}
          className={`relative flex flex-col items-center justify-center py-1 px-4 min-w-[64px] min-h-[44px] rounded-xl transition-all cursor-pointer ${
            activeTab === 'ongoing'
              ? 'text-[#387CB7] font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
          aria-label="Ongoing Orders"
        >
          <div className="relative">
            <Clock className={`w-6 h-6 transition-transform ${activeTab === 'ongoing' ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
            {hasActiveOrder && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F38B21]"></span>
              </span>
            )}
          </div>
          <span className="text-[11px] mt-1 tracking-tight">Ongoing</span>
          {activeTab === 'ongoing' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#387CB7] mt-0.5" />
          )}
        </button>

        {/* History Tab */}
        <button
          type="button"
          onClick={() => onSelectTab('history')}
          className={`flex flex-col items-center justify-center py-1 px-4 min-w-[64px] min-h-[44px] rounded-xl transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'text-[#135381] font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
          aria-label="Order History"
        >
          <History className={`w-6 h-6 transition-transform ${activeTab === 'history' ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[11px] mt-1 tracking-tight">History</span>
          {activeTab === 'history' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#135381] mt-0.5" />
          )}
        </button>
      </div>

      {/* iPhone Home indicator bar */}
      <div className="w-[153px] h-[5px] bg-slate-900/30 rounded-full mt-3" />
    </div>
  );
};
