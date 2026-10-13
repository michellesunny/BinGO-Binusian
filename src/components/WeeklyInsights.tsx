import React from 'react';
import { ArrowUpRight, Flame } from 'lucide-react';
import { WEEKLY_STATS } from '../data/mockData';

interface WeeklyInsightsProps {
  ordersCount?: number;
  popularProductName?: string;
  popularProductSoldCount?: number;
  onPopularProductClick?: () => void;
}

export const WeeklyInsights: React.FC<WeeklyInsightsProps> = ({
  ordersCount = WEEKLY_STATS.totalOrders,
  popularProductName = WEEKLY_STATS.popularProductName,
  popularProductSoldCount = WEEKLY_STATS.popularProductSoldCount,
  onPopularProductClick,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-xs p-4 transition-all">
      {/* Header Label */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Weekly Insights
        </h2>
        <span className="text-xs text-slate-500 font-medium">Minggu Ini</span>
      </div>

      {/* Orders Metric Card (Revenue removed per user request) */}
      <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-100 mb-3 flex items-center justify-between">
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            {ordersCount}
          </div>
          <div className="text-xs font-semibold text-slate-600 mt-0.5">Total Orders Masuk</div>
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-lg">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>+{WEEKLY_STATS.orderGrowthPercentage}% vs minggu lalu</span>
        </div>
      </div>

      {/* Popular Product Bar */}
      <button
        type="button"
        onClick={onPopularProductClick}
        className="w-full bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200/80 rounded-xl px-3 py-2.5 flex items-center justify-between text-left transition-colors cursor-pointer group"
      >
        <div className="flex items-center gap-2 truncate">
          <span className="p-1.5 rounded-md bg-amber-500 text-white shrink-0 shadow-xs">
            <Flame className="w-4 h-4 fill-current" />
          </span>
          <div className="text-xs truncate">
            <span className="text-slate-600 font-medium">Popular Product: </span>
            <span className="font-extrabold text-slate-900 group-hover:text-amber-800 transition-colors">
              {popularProductName}
            </span>
          </div>
        </div>
        <div className="text-xs font-bold text-amber-900 tabular-nums shrink-0 ml-2 bg-amber-200/70 px-2.5 py-1 rounded-full">
          {popularProductSoldCount} Sold
        </div>
      </button>
    </div>
  );
};
