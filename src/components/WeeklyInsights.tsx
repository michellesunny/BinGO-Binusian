import React from 'react';
import { ArrowUpRight, Flame } from 'lucide-react';
import { WEEKLY_STATS } from '../data/mockData';

interface WeeklyInsightsProps {
  ordersCount?: number;
  totalRevenue?: number;
  onPopularProductClick?: () => void;
}

export const WeeklyInsights: React.FC<WeeklyInsightsProps> = ({
  ordersCount = WEEKLY_STATS.totalOrders,
  totalRevenue = WEEKLY_STATS.totalRevenue,
  onPopularProductClick,
}) => {
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-xs p-4 transition-all">
      {/* Header Label */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Weekly Insights
        </h2>
        <span className="text-[11px] text-slate-400 font-medium">Minggu Ini</span>
      </div>

      {/* Two Metric Cards Side-by-Side */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Metric 1: Orders */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">
              {ordersCount}
            </div>
            <div className="text-xs font-semibold text-slate-600 mt-0.5">Orders</div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{WEEKLY_STATS.orderGrowthPercentage}% vs minggu lalu</span>
          </div>
        </div>

        {/* Metric 2: Revenue */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight tabular-nums truncate">
              {formatRupiah(totalRevenue)}
            </div>
            <div className="text-xs font-semibold text-slate-600 mt-0.5">Revenue</div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{WEEKLY_STATS.revenueGrowthPercentage}% vs minggu lalu</span>
          </div>
        </div>
      </div>

      {/* Popular Product Bar */}
      <button
        onClick={onPopularProductClick}
        className="w-full bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200/80 rounded-xl px-3 py-2 flex items-center justify-between text-left transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-2 truncate">
          <span className="p-1 rounded-md bg-amber-500 text-white shrink-0 shadow-xs">
            <Flame className="w-3.5 h-3.5 fill-current" />
          </span>
          <div className="text-xs truncate">
            <span className="text-slate-600 font-medium">Popular Product: </span>
            <span className="font-extrabold text-slate-900 group-hover:text-amber-800 transition-colors">
              {WEEKLY_STATS.popularProductName}
            </span>
          </div>
        </div>
        <div className="text-xs font-bold text-amber-900 tabular-nums shrink-0 ml-2 bg-amber-200/60 px-2 py-0.5 rounded-full">
          {WEEKLY_STATS.popularProductSoldCount} Sold
        </div>
      </button>
    </div>
  );
};
