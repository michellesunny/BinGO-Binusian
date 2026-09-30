import React from 'react';
import { ChevronsRight, ShoppingBag, Calendar as CalendarIcon } from 'lucide-react';

interface ActionCardsProps {
  onOpenPesanan: () => void;
  onOpenCalendar: () => void;
  onOpenMenuStock?: () => void;
  pendingOrdersCount?: number;
  upcomingEventTitle?: string;
}

export const ActionCards: React.FC<ActionCardsProps> = ({
  onOpenPesanan,
  onOpenCalendar,
  pendingOrdersCount = 10,
  upcomingEventTitle = '23 Jan: Libur Sebelum UAS',
}) => {
  return (
    <div className="w-full space-y-3.5 mt-4">
      {/* 1. Pesanan Card (Matches Mockup Phone 1) */}
      <button
        onClick={onOpenPesanan}
        className="w-full relative overflow-hidden rounded-2xl p-5 text-left transition-all transform active:scale-[0.98] shadow-md hover:shadow-lg cursor-pointer bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-white group"
      >
        {/* Subtle background decorative shapes */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-110 transition-transform" />
        <div className="absolute right-12 top-2 text-white/15 pointer-events-none">
          <ShoppingBag className="w-24 h-24 stroke-[1]" />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-black tracking-tight text-white drop-shadow-xs">
                Pesanan
              </h3>
              {pendingOrdersCount > 0 && (
                <span className="bg-white text-orange-600 text-[11px] font-black px-2 py-0.5 rounded-full shadow-xs">
                  {pendingOrdersCount} Baru
                </span>
              )}
            </div>
            <p className="text-amber-50/90 text-sm font-medium">
              Mulai kelola pesanan hari ini
            </p>
          </div>

          {/* Double Chevrons (Identical to mockup) */}
          <div className="shrink-0 p-2.5 rounded-full bg-white/20 backdrop-blur-xs text-white group-hover:translate-x-1 transition-transform">
            <ChevronsRight className="w-8 h-8 stroke-[2.5]" />
          </div>
        </div>
      </button>

      {/* 2. Calendar Card (Matches Mockup Phone 1) */}
      <button
        onClick={onOpenCalendar}
        className="w-full relative overflow-hidden rounded-2xl p-5 text-left transition-all transform active:scale-[0.98] shadow-md hover:shadow-lg cursor-pointer bg-gradient-to-r from-slate-500 via-slate-600 to-blue-600/90 text-white group"
      >
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-110 transition-transform" />
        <div className="absolute right-12 top-2 text-white/15 pointer-events-none">
          <CalendarIcon className="w-24 h-24 stroke-[1]" />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-black tracking-tight text-white drop-shadow-xs">
                Calendar
              </h3>
              {upcomingEventTitle && (
                <span className="bg-blue-400/30 border border-blue-300/30 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full truncate max-w-[150px]">
                  {upcomingEventTitle}
                </span>
              )}
            </div>
            <p className="text-slate-100/90 text-sm font-medium">
              Jadwalkan ketersediaan kantin
            </p>
          </div>

          {/* Double Chevrons (Identical to mockup) */}
          <div className="shrink-0 p-2.5 rounded-full bg-white/20 backdrop-blur-xs text-white group-hover:translate-x-1 transition-transform">
            <ChevronsRight className="w-8 h-8 stroke-[2.5]" />
          </div>
        </div>
      </button>
    </div>
  );
};
