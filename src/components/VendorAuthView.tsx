import React, { useState } from 'react';
import {
  Store,
  Mail,
  Lock,
  User,
  Phone,
  Clock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { StatusBar } from './StatusBar';
import { BingoLogo } from './BingoLogo';
import { VendorUser } from '../types';
import kedaiAvatarImg from '../assets/images/kedai_selan_avatar_1790156396386.jpg';

interface VendorAuthViewProps {
  onSuccess: (vendorUser: VendorUser) => void;
  onSwitchToStudent?: () => void;
}

export const PRESET_DEFAULT_VENDOR: VendorUser = {
  id: 'vendor-kedai-selan',
  ownerName: 'Ibu Selan Rahmawati',
  stallName: 'Kedai Selan',
  stallNumber: 'Kios 04',
  phone: '081298765432',
  email: 'kedai.selan@bingo.id',
  category: 'Makanan Nusantara & Soto',
  openTime: '07:00',
  closeTime: '15:30',
  avatarUrl: kedaiAvatarImg,
};

export const VendorAuthView: React.FC<VendorAuthViewProps> = ({
  onSuccess,
  onSwitchToStudent,
}) => {
  const [tab, setTab] = useState<'login' | 'signup'>('login');

  // Login states
  const [loginEmail, setLoginEmail] = useState('kedai.selan@bingo.id');
  const [loginPassword, setLoginPassword] = useState('••••••••');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Sign up states
  const [ownerName, setOwnerName] = useState('Ibu Selan Rahmawati');
  const [stallName, setStallName] = useState('Kedai Selan');
  const [stallNumber, setStallNumber] = useState('Kios 04');
  const [phone, setPhone] = useState('081298765432');
  const [email, setEmail] = useState('kedai.selan@bingo.id');
  const [category, setCategory] = useState('Makanan Nusantara & Soto');
  const [openTime, setOpenTime] = useState('07:00');
  const [closeTime, setCloseTime] = useState('15:30');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMsg('Harap isi email dan kata sandi akun vendor.');
      return;
    }

    // Login success
    onSuccess({
      ...PRESET_DEFAULT_VENDOR,
      email: loginEmail,
    });
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName.trim() || !stallName.trim() || !phone.trim() || !email.trim()) {
      setErrorMsg('Harap lengkapi semua data pendaftaran kios vendor.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    const newVendor: VendorUser = {
      id: `vendor-${Date.now()}`,
      ownerName: ownerName.trim(),
      stallName: stallName.trim(),
      stallNumber: stallNumber.trim() || 'Kios Kantin',
      phone: phone.trim(),
      email: email.trim(),
      category: category.trim(),
      openTime,
      closeTime,
      avatarUrl: kedaiAvatarImg,
    };

    onSuccess(newVendor);
  };

  return (
    <div className="w-full h-full flex-1 overflow-y-auto min-h-0 bg-slate-50 flex flex-col justify-between pb-8 select-none overscroll-contain">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <StatusBar />
        <div className="flex items-center justify-between px-4 py-3 min-h-[58px]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black shadow-xs">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-orange-600 block uppercase tracking-wider">
                Portal Mitra Kantin
              </span>
              <span className="text-xs font-extrabold text-slate-800">
                BinGO! Vendor Center
              </span>
            </div>
          </div>

          <BingoLogo size="md" />
        </div>
      </header>

      {/* Main Form Body */}
      <div className="p-4 max-w-md mx-auto w-full space-y-4 my-auto">
        {/* Hero Banner / Greeting */}
        <div className="text-center pt-2 pb-1">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {tab === 'login' ? 'Masuk ke Dapur & Kios Anda' : 'Daftar Mitra Penjual Kantin'}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {tab === 'login'
              ? 'Kelola menu, terima pesanan siswa, dan pantau antrean masak secara real-time.'
              : 'Daftarkan stan kuliner Anda dan jangkau seluruh siswa sekolah/kampus.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-200/80 p-1 rounded-2xl flex gap-1">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Masuk Mitra
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('signup');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
              tab === 'signup'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daftar Kios Baru
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
          {tab === 'login' ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Akun Vendor / ID Kios
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="nama.kios@bingo.id"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Masukkan sandi..."
                    className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-slate-900 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-3.5 h-3.5 accent-orange-500 rounded" />
                  <span>Ingat sesi saya</span>
                </label>
                <span className="text-orange-600 font-bold hover:underline cursor-pointer">
                  Lupa sandi?
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span>Masuk ke Dashboard Vendor</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick Demo Pre-fill Button */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onSuccess(PRESET_DEFAULT_VENDOR)}
                  className="w-full py-2 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                  <span>Masuk Cepat: Akun Demo Kedai Selan</span>
                </button>
              </div>
            </form>
          ) : (
            /* SIGN UP FORM */
            <form onSubmit={handleSignUpSubmit} className="space-y-3">
              {/* Nama Pemilik & Kios */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nama Pemilik <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Ibu Selan"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nama Kios / Stan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={stallName}
                    onChange={(e) => setStallName(e.target.value)}
                    placeholder="Kedai Selan"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-slate-900 font-medium"
                  />
                </div>
              </div>

              {/* Nomor Kios & WhatsApp */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nomor Kios
                  </label>
                  <input
                    type="text"
                    value={stallNumber}
                    onChange={(e) => setStallNumber(e.target.value)}
                    placeholder="Kios 04"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    No. WhatsApp Aktif <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0812..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-slate-900 font-medium"
                  />
                </div>
              </div>

              {/* Email & Kategori */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Email Vendor <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kios@bingo.id"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Kategori Utama Kuliner
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-slate-900 font-medium"
                >
                  <option value="Makanan Nusantara & Soto">Makanan Nusantara & Soto</option>
                  <option value="Mie Ayam & Bakso">Mie Ayam & Bakso</option>
                  <option value="Ayam Geprek & Nasi Box">Ayam Geprek & Nasi Box</option>
                  <option value="Kebab & Western">Kebab & Western</option>
                  <option value="Minuman Segar & Kopi">Minuman Segar & Kopi</option>
                  <option value="Cemilan, Roti & Pastry">Cemilan, Roti & Pastry</option>
                </select>
              </div>

              {/* Jam Operasional */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Jam Buka
                  </label>
                  <input
                    type="time"
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Jam Tutup
                  </label>
                  <input
                    type="time"
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-slate-900 font-semibold"
                  />
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Kata Sandi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type={showSignUpPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 digit"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Konfirmasi Sandi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type={showSignUpPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi sandi"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Data stan kantin terlindungi oleh sistem BinGO! E-Canteen.</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/25 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Daftarkan Kios & Masuk</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
