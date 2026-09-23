import React, { useState } from 'react';
import { StatusBar } from './StatusBar';
import { Vendor, Order } from '../types';
import {
  Search,
  MapPin,
  Calendar,
  Sparkles,
  Star,
  ChevronRight,
  TrendingUp,
  Tag,
  Clock,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface HomeScreenProps {
  user: { name: string; nim: string; campus: string; balance: number };
  vendors: Vendor[];
  activeOrder?: Order | null;
  onSelectVendor: (vendor: Vendor) => void;
  onOpenCalendar: () => void;
  onViewActiveOrder: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  vendors,
  activeOrder,
  onSelectVendor,
  onOpenCalendar,
  onViewActiveOrder,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentLocation, setCurrentLocation] = useState('Atrium Lt. 1');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

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
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50 text-slate-900 select-none pb-4">
      <StatusBar theme="dark" />

      {/* Top Greeting Header */}
      <div className="px-5 pt-3 pb-4 bg-white border-b border-slate-100 shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400">Good morning,</span>
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug">
              {user.name}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Operational Calendar Quick Action */}
            <button
              type="button"
              onClick={onOpenCalendar}
              className="p-2 rounded-xl bg-orange-50 text-[#F38B21] hover:bg-orange-100 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              title="Kalender Operasional"
              aria-label="Kalender Operasional"
            >
              <Calendar className="w-4 h-4" />
              <span className="text-[11px] font-bold hidden sm:inline">Kalender</span>
            </button>
          </div>
        </div>

        {/* Location selector pill */}
        <div className="mt-3 relative">
          <button
            type="button"
            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#F38B21]" />
            <span>Lokasimu: {currentLocation}</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showLocationDropdown ? 'rotate-90' : ''}`} />
          </button>

          {showLocationDropdown && (
            <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-40 animate-fadeIn">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Pilih Lokasi Kampus
              </div>
              {['Atrium Lt. 1', 'Lt. 2 (Food Court)', 'Lt. 3 (Perpustakaan)', 'Lt. 4 (Ruang Kuliah)', 'Lobby Utama Anggrek'].map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    setCurrentLocation(loc);
                    setShowLocationDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-orange-50 transition-colors cursor-pointer ${
                    currentLocation === loc ? 'text-[#F38B21] font-bold bg-orange-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>{loc}</span>
                  {currentLocation === loc && <span className="w-1.5 h-1.5 rounded-full bg-[#F38B21]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pt-4 space-y-4">
        {/* Active Order Banner (if exists) */}
        {activeOrder && activeOrder.status !== 'completed' && (
          <div
            onClick={onViewActiveOrder}
            className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#135381] to-[#387CB7] text-white shadow-md cursor-pointer hover:shadow-lg transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-amber-300 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                    Pesanan Aktif
                  </span>
                  <span className="text-xs font-semibold text-white/90">
                    {activeOrder.orderNumber}
                  </span>
                </div>
                <p className="text-xs font-bold mt-0.5 text-white">
                  {activeOrder.buddy ? `Diantar oleh ${activeOrder.buddy.name}` : 'Siap diambil di vendor'}
                </p>
              </div>
            </div>
            <div className="flex items-center text-xs font-bold text-amber-300 hover:text-white transition-colors">
              <span>Lacak</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </div>
          </div>
        )}

        {/* Promo Card (Figma: Kedai Selan sedang ada promo 10%!) */}
        <div
          onClick={() => {
            const kedaiSelan = vendors.find((v) => v.id === 'kedai-selan');
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

                    <p className="text-[11px] text-[#387CB7] font-semibold mt-0.5">
                      {vendor.category}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {vendor.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {vendor.location}
                    </span>
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
