import React, { useState } from 'react';
import {
  ChevronLeft,
  Upload,
  Clock,
  Sparkles,
  Flame,
  Check,
  AlertCircle,
  Eye,
  PlusCircle,
  Tag,
} from 'lucide-react';
import { MenuItem } from '../types';
import { StatusBar } from './StatusBar';
import { BingoLogo } from './BingoLogo';
import sotoImg from '../assets/images/soto_nusantara_1790156371147.jpg';
import mieAyamImg from '../assets/images/mie_ayam_special_1790156384301.jpg';

interface AddMenuViewProps {
  onBack: () => void;
  onSave: (newItem: MenuItem) => void;
}

// Preset food image options for easy selection by canteen vendors
const PRESET_IMAGES = [
  {
    name: 'Soto Nusantara',
    url: sotoImg,
  },
  {
    name: 'Mie Ayam Pangsit',
    url: mieAyamImg,
  },
  {
    name: 'Nasi Goreng Spesial',
    url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Ayam Geprek Sambal Bawang',
    url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Kebab Daging Sapi',
    url: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Es Teh Manis Jumbo',
    url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Dimsum Ayam Kukus',
    url: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Kopi Susu Gula Aren',
    url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
  },
];

const CATEGORIES = [
  'Makanan Utama',
  'Pelengkap & Sate',
  'Minuman',
  'Camilan',
];

export const AddMenuView: React.FC<AddMenuViewProps> = ({ onBack, onSave }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('Makanan Utama');
  const [price, setPrice] = useState<number | ''>(18000);
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState<number>(5);
  const [initialStock, setInitialStock] = useState<number>(30);
  const [selectedImage, setSelectedImage] = useState<string>(PRESET_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  const [isPopular, setIsPopular] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const currentDisplayImage = customImageUrl.trim() ? customImageUrl : selectedImage;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Nama menu hidangan tidak boleh kosong.');
      return;
    }
    if (!price || Number(price) <= 0) {
      setErrorMsg('Harga jual harus lebih dari Rp 0.');
      return;
    }

    const newItem: MenuItem = {
      id: `menu-${Date.now()}`,
      name: name.trim(),
      category,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      description: description.trim() || 'Menu lezat dan higienis siap santap di kantin.',
      image: currentDisplayImage,
      isAvailable,
      preparationTimeMinutes: Number(prepTime) || 5,
      stockRemaining: Number(initialStock) || 0,
      soldCount: 0,
      isPopular,
      isBestSeller: isPopular,
    };

    onSave(newItem);
  };

  return (
    <div className="w-full h-full flex-1 overflow-y-auto min-h-0 bg-slate-50 flex flex-col pb-24 overscroll-contain select-none">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <StatusBar />
        <div className="flex items-center justify-between px-4 py-3 min-h-[58px]">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-slate-800 hover:text-slate-950 font-bold text-base transition-colors cursor-pointer group"
          >
            <ChevronLeft className="w-5 h-5 -ml-1 group-hover:-translate-x-0.5 transition-transform" />
            <span>Tambah Menu Baru</span>
          </button>
          <BingoLogo size="md" />
        </div>
      </header>

      {/* Main Content Form */}
      <div className="p-4 max-w-md mx-auto w-full space-y-4">
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Card 1: Basic Information */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3.5">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm border-b border-slate-100 pb-2">
              <Tag className="w-4 h-4 text-amber-500" />
              <span>Informasi Utama Menu</span>
            </div>

            {/* Nama Menu */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Menu <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="Contoh: Soto Ayam Lamongan, Es Kopi Susu"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-slate-900 transition-all font-medium"
              />
            </div>

            {/* Kategori Menu */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kategori
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                      category === cat
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Deskripsi Singkat Hidangan
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tuliskan isian, lauk pauk, atau keunggulan rasa..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-slate-900 transition-all"
              />
            </div>
          </div>

          {/* Card 2: Harga, Stok & Waktu Saji */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3.5">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm border-b border-slate-100 pb-2">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span>Harga, Stok & Estimasi Saji</span>
            </div>

            {/* Harga Jual & Harga Coret */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Harga Jual (Rp) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="500"
                  step="500"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="18000"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  {price ? formatRupiah(Number(price)) : 'Rp 0'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Harga Coret (Opsional)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Contoh: 22000"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  {originalPrice ? `Coret: ${formatRupiah(Number(originalPrice))}` : 'Tidak ada diskon'}
                </span>
              </div>
            </div>

            {/* Estimasi Masak & Stok Awal */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Waktu Saji (Menit)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={prepTime}
                    onChange={(e) => setPrepTime(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 font-semibold pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 font-medium">
                    mnt
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Stok Awal (Porsi)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={initialStock}
                    onChange={(e) => setInitialStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 font-semibold pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 font-medium">
                    porsi
                  </span>
                </div>
              </div>
            </div>

            {/* Toggle Status Stok & Menu Favorit */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-2">
                  <Flame className={`w-4 h-4 ${isPopular ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Tandai Rekomendasi / Populer</span>
                    <span className="text-[10px] text-slate-500">Beri badge favorit pada kartu menu</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Langsung Aktifkan Status Tersedia</span>
                  <span className="text-[10px] text-slate-500">Siswa dapat langsung memesan saat ini</span>
                </div>
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Card 3: Pilihan Foto Makanan */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                <Upload className="w-4 h-4 text-blue-500" />
                <span>Pilih Foto Hidangan</span>
              </div>
              <span className="text-[11px] text-slate-500">Pilih dari katalog</span>
            </div>

            {/* Preset Images Grid */}
            <div className="grid grid-cols-4 gap-2">
              {PRESET_IMAGES.map((preset) => {
                const isSelected = selectedImage === preset.url && !customImageUrl.trim();
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setSelectedImage(preset.url);
                      setCustomImageUrl('');
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer group ${
                      isSelected
                        ? 'border-amber-500 ring-2 ring-amber-300 shadow-md scale-102'
                        : 'border-slate-200 hover:border-amber-300'
                    }`}
                    title={preset.name}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                        <span className="bg-amber-500 text-white rounded-full p-0.5 shadow-sm">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Atau Input URL Gambar Kustom */}
            <div className="pt-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Atau Masukkan URL Gambar Sendiri:
              </label>
              <input
                type="url"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Card 4: Pratinjau Tampilan Siswa */}
          <div className="bg-amber-50/50 rounded-2xl border border-amber-200/70 p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <Eye className="w-3.5 h-3.5 text-amber-600" />
              <span>Pratinjau Tampilan di Layar Siswa:</span>
            </div>

            {/* Simulated Menu Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex gap-3 shadow-xs">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 relative">
                <img
                  src={currentDisplayImage}
                  alt={name || 'Menu Baru'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {isPopular && (
                  <span className="absolute top-1 left-1 bg-amber-500 text-white p-0.5 rounded-md shadow-xs">
                    <Flame className="w-2.5 h-2.5 fill-current" />
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h5 className="font-extrabold text-xs text-slate-900 truncate">
                    {name.trim() || 'Nama Menu Baru'}
                  </h5>
                  <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                    ~{prepTime} mnt
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                  {description.trim() || 'Deskripsi hidangan akan tampil di sini.'}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xs font-extrabold text-orange-600">
                    {price ? formatRupiah(Number(price)) : 'Rp 0'}
                  </span>
                  {originalPrice && Number(originalPrice) > Number(price) && (
                    <span className="text-[10px] text-slate-400 line-through">
                      {formatRupiah(Number(originalPrice))}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer text-center"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-[2] py-3 px-4 rounded-xl bg-[#F38B21] hover:bg-[#e07b14] text-white font-extrabold text-xs shadow-md shadow-orange-500/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Simpan & Terbitkan Menu</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
