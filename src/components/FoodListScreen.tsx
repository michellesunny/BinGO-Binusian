import React, { useState } from 'react';
import { StatusBar } from './StatusBar';
import { Vendor, MenuItem, CartItem } from '../types';
import { VENDOR_PROFILE } from '../data/mockData';
import {
  ArrowLeft,
  Search,
  Heart,
  Plus,
  Minus,
  MessageSquare,
  Sparkles,
  ShoppingBag,
  Star,
  MapPin,
  Calendar as CalendarIcon,
} from 'lucide-react';

interface FoodListScreenProps {
  vendor: Vendor;
  cart: CartItem[];
  onUpdateCart: (menuItem: MenuItem, delta: number) => void;
  onGoBack: () => void;
  onProceedToOrder: () => void;
  onOpenFeedback: () => void;
  onOpenCalendar?: () => void;
}

export const FoodListScreen: React.FC<FoodListScreenProps> = ({
  vendor,
  cart,
  onUpdateCart,
  onGoBack,
  onProceedToOrder,
  onOpenFeedback,
  onOpenCalendar,
}) => {
  const [searchMenu, setSearchMenu] = useState('');
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const platformFee = Math.round(cartSubtotal * 0.05);
  const totalAmount = cartSubtotal + platformFee;

  const getQuantity = (id: string) => {
    const found = cart.find((c) => c.menuItem.id === id);
    return found ? found.quantity : 0;
  };

  const toggleLike = (id: string) => {
    setLikedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const bestSeller = vendor.menu.find((m) => m.isBestSeller) || vendor.menu[0];
  const regularItems = vendor.menu.filter((m) => m.id !== bestSeller?.id);

  const filteredItems = regularItems.filter((item) =>
    item.name.toLowerCase().includes(searchMenu.toLowerCase())
  );

  return (
    <div className="relative flex-1 flex flex-col h-full bg-slate-50 text-slate-900 select-none overflow-hidden">
      {/* Top Header with white background covering StatusBar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-2xs">
        <StatusBar theme="dark" />
        <div className="px-5 pt-1 pb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={onGoBack}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5">
              {vendor.id === 'kedai-selan' && (
                <img
                  src={VENDOR_PROFILE.avatarUrl}
                  alt="Kedai Selan"
                  className="w-5 h-5 rounded-full object-cover border border-amber-300 shadow-2xs shrink-0"
                />
              )}
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-tight">
                {vendor.name}
              </h1>
            </div>
            {vendor.id !== 'kedai-selan' && (
              <span className="text-[11px] text-[#387CB7] font-semibold">
                {vendor.category}
              </span>
            )}
          </div>

          <div className="w-10" />
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-28">
        {/* 2 Action Cards below header: Jadwal Operasional & Rating/Feedback */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1: Jadwal Operasional */}
          <button
            type="button"
            onClick={onOpenCalendar}
            className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-[#135381]/40 hover:bg-blue-50/20 transition-all text-left flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#135381] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#135381] transition-colors leading-tight">
                Jadwal Buka
              </h4>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                Kalendar operasional
              </p>
            </div>
          </button>

          {/* Card 2: Rating & Feedback */}
          <button
            type="button"
            onClick={onOpenFeedback}
            className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-amber-300 hover:bg-amber-50/20 transition-all text-left flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors leading-tight">
                  Feedback
                </h4>
                <span className="text-[10px] font-extrabold text-amber-700 bg-amber-500/10 px-1.5 py-0.5 rounded-md border border-amber-500/20 tabular-nums">
                  {vendor.rating}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                {vendor.reviewCount || 342} ulasan
              </p>
            </div>
          </button>
        </div>

        {/* Search Menu bar */}
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchMenu}
            onChange={(e) => setSearchMenu(e.target.value)}
            placeholder="Search Menu..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#F38B21] transition-all shadow-2xs"
          />
        </div>

        {/* Section: Best Menu Vendor Minggu Ini */}
        {bestSeller && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-[#F38B21]" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Best menu vendor minggu ini
              </h3>
            </div>

            <div className="bg-gradient-to-br from-amber-500/10 via-white to-orange-500/5 rounded-3xl p-4 border border-orange-200/80 shadow-xs relative overflow-hidden">
              <div className="flex gap-4">
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-slate-100 shrink-0 shadow-xs">
                  <img
                    src={bestSeller.image}
                    alt={bestSeller.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-1.5 left-1.5 bg-[#F38B21] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs">
                    BEST SELLER
                  </span>
                </div>

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 leading-tight">
                      {bestSeller.name}
                    </h4>

                    {bestSeller.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                        {bestSeller.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-extrabold text-[#F38B21] tabular-nums">
                        Rp {bestSeller.price.toLocaleString('id-ID')}
                      </span>
                      {bestSeller.originalPrice && (
                        <span className="text-xs text-slate-400 line-through tabular-nums">
                          Rp {bestSeller.originalPrice.toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => toggleLike(bestSeller.id)}
                      className={`flex items-center gap-1 text-[11px] transition-colors cursor-pointer ${
                        likedItems[bestSeller.id]
                          ? 'text-red-500 font-bold'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          likedItems[bestSeller.id] ? 'fill-current text-red-500' : ''
                        }`}
                      />
                      <span className="font-semibold tabular-nums">
                        {(bestSeller.likes ?? 120) + (likedItems[bestSeller.id] ? 1 : 0)}
                      </span>
                    </button>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 bg-slate-100 rounded-full p-1 shadow-2xs">
                      {getQuantity(bestSeller.id) > 0 ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onUpdateCart(bestSeller, -1)}
                            className="w-6 h-6 rounded-full bg-white text-slate-700 flex items-center justify-center font-bold text-xs shadow-xs hover:bg-slate-200 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center tabular-nums">
                            {getQuantity(bestSeller.id)}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateCart(bestSeller, 1)}
                            className="w-6 h-6 rounded-full bg-[#F38B21] text-white flex items-center justify-center font-bold text-xs shadow-xs hover:bg-[#e07d1a] transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onUpdateCart(bestSeller, 1)}
                          className="px-3 py-1 rounded-full bg-[#F38B21] text-white font-bold text-xs shadow-xs hover:bg-[#e07d1a] transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Menu List */}
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
            Daftar Menu Lainnya
          </h3>

          <div className="space-y-2.5">
            {filteredItems.map((item) => {
              const qty = getQuantity(item.id);
              const isLiked = likedItems[item.id];
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-3 border border-slate-200/70 shadow-xs flex items-center justify-between gap-3 hover:border-slate-300 transition-all"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {item.name}
                    </h4>
                    <span className="text-xs font-extrabold text-[#F38B21] tabular-nums mt-0.5 block">
                      Rp {item.price.toLocaleString('id-ID')}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleLike(item.id)}
                      className={`flex items-center gap-1 text-[10px] mt-1 transition-colors cursor-pointer ${
                        isLiked ? 'text-red-500 font-bold' : 'text-slate-400'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                      <span>disukai oleh {(item.likes || 45) + (isLiked ? 1 : 0)}</span>
                    </button>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-1.5 bg-slate-100 rounded-full p-1">
                    {qty > 0 ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onUpdateCart(item, -1)}
                          className="w-6 h-6 rounded-full bg-white text-slate-700 flex items-center justify-center font-bold text-xs shadow-xs hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center tabular-nums">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateCart(item, 1)}
                          className="w-6 h-6 rounded-full bg-[#F38B21] text-white flex items-center justify-center font-bold text-xs shadow-xs hover:bg-[#e07d1a] transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onUpdateCart(item, 1)}
                        className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Tambah Menu"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Floating Checkout Bar (From Figma: Checkout pill: 1 item | Rp 12.600) */}
      {totalItemsCount > 0 && (
        <div className="absolute bottom-4 left-4 right-4 z-30 animate-slideUp">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-3 shadow-xl flex items-center justify-between border border-slate-700/50">
            <div className="flex items-center gap-3 pl-1">
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-[#F38B21] flex items-center justify-center font-bold text-sm">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {totalItemsCount} item terpilih
                </div>
                <div className="text-sm font-extrabold text-white tabular-nums tracking-tight">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onProceedToOrder}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F38B21] to-[#FC9B3B] text-white font-bold text-xs shadow-md shadow-orange-500/25 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 hover:brightness-105"
            >
              <span>Checkout</span>
              <span className="text-[11px] font-normal">→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
