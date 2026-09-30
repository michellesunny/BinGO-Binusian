import React, { useState } from 'react';
import {
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Search,
  Flame,
  Clock,
  Package,
  ChevronRight,
} from 'lucide-react';
import { MenuItem } from '../types';
import { StatusBar } from './StatusBar';
import { BingoLogo } from './BingoLogo';

interface MenuStockViewProps {
  menuItems: MenuItem[];
  onBack: () => void;
  onToggleAvailability: (itemId: string) => void;
  onSelectItem: (itemId: string) => void;
  onUpdateItem?: (item: MenuItem) => void;
}

export const MenuStockView: React.FC<MenuStockViewProps> = ({
  menuItems,
  onBack,
  onToggleAvailability,
  onSelectItem,
}) => {
  const [search, setSearch] = useState('');

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredItems = menuItems.filter((item) => {
    if (search.trim() && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="w-full h-full flex-1 overflow-y-auto min-h-0 bg-slate-50 flex flex-col pb-20 overscroll-contain">
      {/* Header (Matches Vendor Header standard) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <StatusBar />
        <div className="flex items-center justify-between px-4 py-3 min-h-[58px]">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-slate-800 hover:text-slate-950 font-bold text-base transition-colors cursor-pointer group"
          >
            <ChevronLeft className="w-5 h-5 -ml-1 group-hover:-translate-x-0.5 transition-transform" />
            <span>Menu & Stok Siap Saji</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {menuItems.filter((i) => i.isAvailable).length} Aktif
            </span>
            <BingoLogo size="md" />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="p-4 max-w-md mx-auto w-full space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari hidangan atau minuman..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Menu Items List */}
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const stock = item.stockRemaining ?? (item.isAvailable ? 25 : 0);
            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item.id)}
                className={`bg-white rounded-2xl border p-3.5 flex flex-col gap-2.5 transition-all cursor-pointer hover:border-amber-400 hover:shadow-md active:scale-[0.99] group ${
                  item.isAvailable && stock > 0
                    ? 'border-slate-200 shadow-xs'
                    : 'border-slate-200 bg-slate-50/80 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.isPopular && (
                      <span className="absolute top-1 left-1 bg-amber-500 text-white p-0.5 rounded-md shadow-xs">
                        <Flame className="w-2.5 h-2.5 fill-current" />
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors truncate">
                        {item.name}
                      </h4>
                    </div>
                    {item.description && (
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {item.description}
                      </p>
                    )}
                    <p className="text-xs text-orange-600 font-bold mt-1">
                      {formatRupiah(item.price)}
                    </p>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-1">
                      <span>Terjual {item.soldCount}x</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5 text-blue-600 font-semibold">
                        <Clock className="w-3 h-3" />
                        ~{item.preparationTimeMinutes} mnt
                      </span>
                    </div>
                  </div>

                  {/* Stock Toggle Switch */}
                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleAvailability(item.id);
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        item.isAvailable && stock > 0
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100'
                      }`}
                      title="Klik untuk ubah cepat status stok"
                    >
                      {item.isAvailable && stock > 0 ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tersedia</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Habis</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Bottom interactive row with stock badge and edit indicator */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-600 font-medium">Sisa Stok:</span>
                    <span
                      className={`font-bold px-2 py-0.2 rounded-full ${
                        stock === 0
                          ? 'bg-rose-100 text-rose-800'
                          : stock <= 5
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {stock > 0 ? `${stock} Porsi` : '0 Porsi (Habis)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-700 font-bold group-hover:translate-x-0.5 transition-transform">
                    <span>Atur Stok & Waktu</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
