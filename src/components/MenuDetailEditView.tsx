import React, { useState } from 'react';
import {
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  Flame,
  Save,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import { MenuItem } from '../types';
import { StatusBar } from './StatusBar';
import { BingoLogo } from './BingoLogo';

interface MenuDetailEditViewProps {
  item: MenuItem;
  onBack: () => void;
  onSave: (updatedItem: MenuItem) => void;
}

export const MenuDetailEditView: React.FC<MenuDetailEditViewProps> = ({
  item,
  onBack,
  onSave,
}) => {
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price);
  const [isAvailable, setIsAvailable] = useState(item.isAvailable);
  const [stockRemaining, setStockRemaining] = useState<number>(
    item.stockRemaining ?? (item.isAvailable ? 25 : 0)
  );
  const [prepTime, setPrepTime] = useState<number>(item.preparationTimeMinutes ?? 5);
  const [isPopular, setIsPopular] = useState(item.isPopular ?? false);
  const [description, setDescription] = useState(item.description);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleStockChange = (delta: number) => {
    setStockRemaining((prev) => {
      const next = Math.max(0, prev + delta);
      if (next === 0) setIsAvailable(false);
      else if (!isAvailable) setIsAvailable(true);
      return next;
    });
  };

  const handlePresetStock = (amount: number) => {
    setStockRemaining(amount);
    if (amount === 0) {
      setIsAvailable(false);
    } else {
      setIsAvailable(true);
    }
  };

  const handleToggleAvailability = () => {
    const nextState = !isAvailable;
    setIsAvailable(nextState);
    if (!nextState) {
      setStockRemaining(0);
    } else if (stockRemaining === 0) {
      setStockRemaining(20);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...item,
      name: name.trim() || item.name,
      price: Number(price) > 0 ? Number(price) : item.price,
      isAvailable: isAvailable && stockRemaining > 0,
      stockRemaining,
      preparationTimeMinutes: Math.max(1, prepTime),
      isPopular,
      description: description.trim() || item.description,
    });
  };

  const timePresets = [
    { label: '1 mnt (Siap Saji)', val: 1 },
    { label: '3 mnt (Cepat)', val: 3 },
    { label: '5 mnt (Standar)', val: 5 },
    { label: '8 mnt (Masak Baru)', val: 8 },
    { label: '12 mnt (Khusus)', val: 12 },
  ];

  return (
    <div className="w-full h-full flex-1 overflow-y-auto min-h-0 bg-slate-50 flex flex-col pb-24 overscroll-contain">
      {/* Sticky Header (Standardized height & margin with other headers) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <StatusBar />
        <div className="flex items-center justify-between px-4 py-3 min-h-[58px]">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-slate-800 hover:text-slate-950 font-bold text-base transition-colors cursor-pointer group"
          >
            <ChevronLeft className="w-5 h-5 -ml-1 text-slate-700 group-hover:-translate-x-0.5 transition-transform" />
            <span>Detail Menu</span>
          </button>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                isAvailable && stockRemaining > 0
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {isAvailable && stockRemaining > 0 ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Tersedia ({stockRemaining})</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 text-rose-600" />
                  <span>Stok Habis</span>
                </>
              )}
            </span>
            <BingoLogo size="md" />
          </div>
        </div>
      </header>

      {/* Main Form Content */}
      <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto w-full space-y-4">
        {/* Hero Card: Item Image & Identity */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 relative shadow-inner">
            <img
              src={item.image}
              alt={item.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {isPopular && (
              <span className="absolute top-1 left-1 bg-amber-500 text-white p-1 rounded-md shadow-xs">
                <Flame className="w-3 h-3 fill-current" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full inline-block mb-1">
              {item.category}
            </span>
            <h2 className="text-base font-extrabold text-slate-900 leading-snug truncate">
              {item.name}
            </h2>
            <p className="text-sm font-bold text-orange-600 mt-0.5">
              {formatRupiah(item.price)}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Terjual {item.soldCount} porsi minggu ini
            </p>
          </div>
        </div>

        {/* Section 1: Ketersediaan & Update Stok */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Ketersediaan & Stok</h3>
                <p className="text-[11px] text-slate-500">Atur status jual dan sisa porsi siap saji</p>
              </div>
            </div>

            {/* Availability Toggle */}
            <button
              type="button"
              onClick={handleToggleAvailability}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isAvailable ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isAvailable ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sisa Stok Counter */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Sisa Porsi Tersedia:</span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  stockRemaining === 0
                    ? 'bg-rose-100 text-rose-800'
                    : stockRemaining <= 5
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {stockRemaining === 0
                  ? 'Habis / Tutup'
                  : stockRemaining <= 5
                  ? 'Stok Kritis'
                  : 'Stok Tersedia'}
              </span>
            </div>

            {/* Big Stepper */}
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleStockChange(-5)}
                  disabled={stockRemaining <= 0}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 font-bold text-xs rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  -5
                </button>
                <button
                  type="button"
                  onClick={() => handleStockChange(-1)}
                  disabled={stockRemaining <= 0}
                  className="w-9 h-9 bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-800 font-extrabold text-base rounded-lg border border-slate-200 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                >
                  -
                </button>
              </div>

              <div className="flex items-baseline gap-1">
                <input
                  type="number"
                  min="0"
                  max="999"
                  value={stockRemaining}
                  onChange={(e) => {
                    const val = Math.max(0, parseInt(e.target.value) || 0);
                    setStockRemaining(val);
                    setIsAvailable(val > 0);
                  }}
                  className="w-16 text-center text-2xl font-black text-slate-900 bg-transparent focus:outline-none focus:bg-white rounded-md"
                />
                <span className="text-xs font-semibold text-slate-500">Porsi</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleStockChange(1)}
                  className="w-9 h-9 bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-base rounded-lg border border-slate-200 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => handleStockChange(5)}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  +5
                </button>
              </div>
            </div>

            {/* Quick Stock Presets */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] text-slate-500 mr-1">Preset:</span>
              <button
                type="button"
                onClick={() => handlePresetStock(0)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  stockRemaining === 0
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Habiskan (0)
              </button>
              {[10, 25, 40, 60].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handlePresetStock(amt)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    stockRemaining === amt
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {amt} Porsi
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Estimasi Waktu Masak / Penyiapan */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Estimasi Waktu Masak</h3>
              <p className="text-[11px] text-slate-500">Waktu penyiapan untuk kalkulasi antrean siswa</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Visual Time Display */}
            <div className="flex items-center justify-between bg-blue-50/60 border border-blue-100 rounded-xl p-3">
              <div>
                <span className="text-xs text-blue-900 font-medium">Waktu Siap Saji:</span>
                <div className="text-xl font-black text-blue-950 flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>~{prepTime} Menit</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPrepTime((p) => Math.max(1, p - 1))}
                  className="w-8 h-8 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-lg border border-slate-200 flex items-center justify-center shadow-xs cursor-pointer"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => setPrepTime((p) => Math.min(60, p + 1))}
                  className="w-8 h-8 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-lg border border-slate-200 flex items-center justify-center shadow-xs cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Slider */}
            <div>
              <input
                type="range"
                min="1"
                max="30"
                value={prepTime}
                onChange={(e) => setPrepTime(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                <span>1 Menit</span>
                <span>15 Menit</span>
                <span>30 Menit</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-slate-500">Pilihan Cepat Waktu:</span>
              <div className="grid grid-cols-2 gap-2">
                {timePresets.map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setPrepTime(preset.val)}
                    className={`px-2.5 py-2 rounded-xl text-xs font-semibold border text-left transition-all cursor-pointer ${
                      prepTime === preset.val
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Estimasi ini ditampilkan ke siswa saat memesan dan membantu memperkirakan slot antrean di jam istirahat.
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Informasi Menu & Harga */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Detail Informasi Hidangan
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Hidangan
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Harga Satuan (Rupiah)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                Rp
              </span>
              <input
                type="number"
                step="500"
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                required
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Deskripsi Menu
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 resize-none"
            />
          </div>

          {/* Popular Tag Toggle */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <div>
                <span className="text-xs font-semibold text-slate-800">Menu Populer</span>
                <p className="text-[10px] text-slate-500">Tampilkan badge "Popular" di menu</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPopular(!isPopular)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isPopular ? 'bg-amber-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isPopular ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-2 space-y-2">
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm shadow-md shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Stok & Waktu</span>
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};
