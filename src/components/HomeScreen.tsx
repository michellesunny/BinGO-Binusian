import React, { useState } from 'react';
import { StatusBar } from './StatusBar';
import { BingoLogo } from './BingoLogo';
import { Vendor, Order } from '../types';
import { VENDOR_PROFILE } from '../data/mockData';
import {
  Search,
  Sparkles,
  Star,
  ChevronRight,
  TrendingUp,
  Tag,
  Clock,
  ArrowRight,
  Flame,
  LogOut,
  Calendar,
} from 'lucide-react';

interface HomeScreenProps {
  user: { name: string; nim: string; campus: string; balance?: number; role?: 'pemesan' | 'buddy' };
  vendors: Vendor[];
  activeOrder?: Order | null;
  onSelectVendor: (vendor: Vendor) => void;
  onOpenCalendar?: () => void;
  onViewActiveOrder?: () => void;
  onLogout?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  vendors,
  onSelectVendor,
  onOpenCalendar,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Makanan Indonesia', 'Catering sehat', 'Kebab', 'Cemilan & Kopi'];

  const filteredVendors = vendors.filter((v) => {
    const matchQuery =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.menu.some((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedCategory === 'All') return matchQuery;
    if (selectedCategory === 'Makanan Indonesia') return matchQuery && v.category.includes('Indonesia');
    if (selectedCategory === 'Catering sehat') return matchQuery && v.category.includes('sehat');
    if (selectedCategory === 'Kebab') return matchQuery && v.category.includes('Kebab');
    if (selectedCategory === 'Cemilan & Kopi') return matchQuery && v.category.includes('Cemilan');
    return matchQuery;
  });

  return (
    <div className="flex-1 flex flex-col overflow-y-auto min-h-0 bg-slate-50 text-slate-900 select-none pb-6">
      {/* Top Greeting Header (White background extends to StatusBar) */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-100 shadow-2xs">
        <StatusBar theme="dark" />
        <div className="px-5 pt-1.5 pb-3 flex items-center justify-between min-h-[58px]">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-slate-400 block leading-tight">Good morning,</span>
              {user.role === 'buddy' ? (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-orange-100 text-[#F38B21]">
                  Buddy
                </span>
              ) : (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-blue-100 text-[#135381]">
                  Pemesan
                </span>
              )}
            </div>
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug mt-0.5">
              {user.name}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <BingoLogo size="md" />
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
                title="Logout / Ganti Akun"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-[11px] font-medium hidden xs:inline">Keluar</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="px-5 pt-4 space-y-4">
        {/* Promo Card (Directly displayed - active order card removed) */}
        <div
          onClick={() => {
            const kedaiSelan = vendors.find((v) => v.id === 'kedai-selan') || vendors[0];
            if (kedaiSelan) onSelectVendor(kedaiSelan);
          }}
          className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-r from-[#FC9B3B] to-[#6CA3D2] text-white shadow-lg cursor-pointer transform hover:-translate-y-0.5 transition-all group"
        >
          {/* Subtle background decorative shapes */}
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-xl group-hover:scale-125 transition-transform" />
          <div className="absolute -left-4 -bottom-4 w-24 h-24 rounded-full bg-black/10 blur-md" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/25 backdrop-blur-md text-[11px] font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>PROMO KANTIN HARI INI</span>
            </div>
            <h2 className="text-lg font-extrabold leading-tight text-white drop-shadow-xs max-w-[240px]">
              Kedai Selan sedang ada promo 10%!
            </h2>
            <p className="text-xs text-white/90 mt-1 font-medium">
              *berlaku untuk semua menu Soto & Sate
            </p>

            <div className="mt-4 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-[#F38B21] text-xs font-bold shadow-sm group-hover:bg-orange-50 transition-colors">
                <span>Pesan Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
              <span className="text-[10px] text-white/80 font-medium">
                Kantin Utama Lt. 1
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Food/Vendor..."
            className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 shadow-xs focus:outline-none focus:border-[#F38B21] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Categories horizontal scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Section: Vendor Kantin */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#F38B21]" />
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Vendor Kantin
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              {filteredVendors.length} gerai buka
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                onClick={() => onSelectVendor(vendor)}
                className="bg-white rounded-2xl p-3 border border-slate-200/70 shadow-xs hover:shadow-md hover:border-orange-200 transition-all cursor-pointer flex gap-3.5 group"
              >
                {/* Vendor Image */}
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={vendor.image}
                    alt={vendor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {vendor.promo && (
                    <span className="absolute top-1 left-1 bg-[#F38B21] text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                      10% OFF
                    </span>
                  )}
                </div>

                {/* Vendor Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-[#F38B21] transition-colors">
                        {vendor.name}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-md shrink-0">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{vendor.rating}</span>
                      </div>
                    </div>

                    {vendor.id !== 'kedai-selan' && (
                      <p className="text-[11px] text-[#387CB7] font-semibold mt-0.5">
                        {vendor.category}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {vendor.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-end pt-2 border-t border-slate-100 mt-2 text-[10px]">
                    <span className="text-[#F38B21] font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Lihat Menu <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {filteredVendors.length === 0 && (
              <div className="text-center py-10 bg-white rounded-2xl border border-slate-200">
                <p className="text-xs text-slate-400">Tidak ada vendor yang cocok dengan pencarian.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
