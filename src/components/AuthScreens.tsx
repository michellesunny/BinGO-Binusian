import React, { useState, useEffect } from 'react';
import { StatusBar } from './StatusBar';
import { BingoLogo } from './BingoLogo';
import { Mail, Lock, User, Phone, MapPin, CreditCard, Eye, EyeOff, Sparkles } from 'lucide-react';

export interface UserProfile {
  id: string;
  name: string;
  nim: string;
  campus: string;
  email: string;
  balance: number;
  role: 'pemesan' | 'buddy';
}

export const PRESET_USERS: Record<string, UserProfile> = {
  pemesan: {
    id: 'user-pemesan',
    name: 'Amelia Angelica Suryanto',
    nim: '2802403247',
    campus: 'BINUS Kemanggisan - Anggrek',
    email: 'amelia.suryanto@binus.ac.id',
    balance: 50000,
    role: 'pemesan',
  },
  buddy: {
    id: 'user-buddy',
    name: 'Valencia (Buddy)',
    nim: '2802409821',
    campus: 'BINUS Kemanggisan - Anggrek',
    email: 'valencia.buddy@binus.ac.id',
    balance: 85000,
    role: 'buddy',
  },
};

interface AuthScreensProps {
  initialView?: 'login' | 'signup';
  onSuccess: (userProfile: UserProfile) => void;
  onBackToSplash?: () => void;
}

export const AuthScreens: React.FC<AuthScreensProps> = ({
  initialView = 'login',
  onSuccess,
}) => {
  const [view, setView] = useState<'login' | 'signup'>(initialView);

  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  // Form states
  const [email, setEmail] = useState('amelia.suryanto@binus.ac.id');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sign up fields
  const [fullName, setFullName] = useState('Amelia Angelica Suryanto');
  const [nim, setNim] = useState('2802403247');
  const [phone, setPhone] = useState('081298765432');
  const [confirmPassword, setConfirmPassword] = useState('••••••••');
  const [campusBranch, setCampusBranch] = useState('BINUS Kemanggisan - Anggrek');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Detect if logging in with buddy email
    if (email.toLowerCase().includes('valencia') || email.toLowerCase().includes('buddy')) {
      onSuccess(PRESET_USERS.buddy);
    } else {
      onSuccess({
        id: `user-${Date.now()}`,
        name: fullName || 'Amelia Angelica Suryanto',
        nim: nim || '2802403247',
        campus: campusBranch || 'BINUS Kemanggisan - Anggrek',
        email: email || 'amelia.suryanto@binus.ac.id',
        balance: 50000,
        role: 'pemesan',
      });
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Directly log in as requested ("abaikan OTP nya biar ga ribet")
    onSuccess({
      id: `user-${Date.now()}`,
      name: fullName,
      nim: nim,
      campus: campusBranch,
      email: email,
      balance: 50000,
      role: 'pemesan',
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-y-auto bg-white text-slate-900 select-none">
      <StatusBar theme="dark" />

      {/* Prominent Unified Control Tab Header for both Log In and Sign Up */}
      <div className="px-6 pt-3 pb-2 bg-white shrink-0">
        <div className="flex items-center justify-between mb-3">
          <BingoLogo size="md" />
          <span className="text-[11px] font-semibold text-slate-400">Akun BinGO!</span>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/70">
          <button
            type="button"
            onClick={() => setView('login')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
              view === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setView('signup')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
              view === 'signup'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* VIEW 1: SIGN UP (Matches image.png Frame 1) */}
      {view === 'signup' && (
        <div className="flex-1 px-6 pt-2 pb-6 flex flex-col justify-between animate-in fade-in duration-200">
          <div>
            <div className="mb-4">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Sign Up
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Buat akun baru untuk menggunakan BinGO!
              </p>
            </div>

            <form onSubmit={handleSignUpSubmit} className="space-y-3">
              {/* Nama Lengkap */}
              <div className="relative flex items-center">
                <User className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nama Lengkap"
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#E68A00] transition-colors"
                />
              </div>

              {/* NIM / NIP */}
              <div className="relative flex items-center">
                <CreditCard className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  placeholder="NIM / NIP"
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#E68A00] transition-colors"
                />
              </div>

              {/* Email BINUS */}
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email BINUS"
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#E68A00] transition-colors"
                />
              </div>

              {/* Nomor Telepon */}
              <div className="relative flex items-center">
                <Phone className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nomor Telepon"
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#E68A00] transition-colors"
                />
              </div>

              {/* Password */}
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#E68A00] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Confirmation Password */}
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmation Password"
                  className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#E68A00] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Cabang Kampus */}
              <div className="relative flex items-center">
                <MapPin className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={campusBranch}
                  onChange={(e) => setCampusBranch(e.target.value)}
                  placeholder="Cabang Kampus"
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#E68A00] transition-colors"
                />
              </div>

              {/* Sign Up Button (Warm orange gradient matching image.png) */}
              <button
                type="submit"
                className="w-full h-12 mt-4 rounded-xl bg-gradient-to-r from-[#F5A623] to-[#E68A00] text-white font-extrabold text-sm shadow-md hover:brightness-105 active:scale-98 transition-all cursor-pointer"
              >
                Sign Up
              </button>
            </form>
          </div>

          <div className="pt-4 text-center text-xs text-slate-500">
            <span>Sudah memiliki akun? </span>
            <button
              type="button"
              onClick={() => setView('login')}
              className="text-[#387CB7] font-bold hover:underline cursor-pointer"
            >
              Log in
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: LOG IN (Matches image.png Frame 3) */}
      {view === 'login' && (
        <div className="flex-1 px-6 pt-2 pb-6 flex flex-col justify-between animate-in fade-in duration-200">
          <div>
            <div className="mb-5">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Log In
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Selamat datang kembali!
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              {/* Email BINUS */}
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email BINUS"
                  className="w-full h-12 pl-10 pr-3.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#E68A00] transition-colors"
                />
              </div>

              {/* Password */}
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full h-12 pl-10 pr-10 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#E68A00] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Log In Button (Warm orange gradient matching image.png) */}
              <button
                type="submit"
                className="w-full h-12 mt-4 rounded-xl bg-gradient-to-r from-[#F5A623] to-[#E68A00] text-white font-extrabold text-sm shadow-md hover:brightness-105 active:scale-98 transition-all cursor-pointer"
              >
                Log In
              </button>
            </form>

            {/* Quick 1-Click Profile Switcher for Testing */}
            <div className="mt-6 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#F38B21]" />
                <span>Pilih Profil Masuk Cepat (Demo):</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onSuccess(PRESET_USERS.pemesan)}
                  className="p-2.5 rounded-xl bg-white border border-blue-200 hover:border-blue-400 text-left transition-all shadow-2xs cursor-pointer group"
                >
                  <span className="text-[10px] font-bold text-blue-600 block">
                    🎓 Akun Pemesan
                  </span>
                  <span className="text-xs font-bold text-slate-900 block truncate group-hover:text-blue-700">
                    Amelia Angelica
                  </span>
                  <span className="text-[10px] text-slate-400 block">NIM: 2802403247</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSuccess(PRESET_USERS.buddy)}
                  className="p-2.5 rounded-xl bg-white border border-orange-200 hover:border-orange-400 text-left transition-all shadow-2xs cursor-pointer group"
                >
                  <span className="text-[10px] font-bold text-[#F38B21] block">
                    🚴 Akun Buddy
                  </span>
                  <span className="text-xs font-bold text-slate-900 block truncate group-hover:text-orange-700">
                    Valencia
                  </span>
                  <span className="text-[10px] text-slate-400 block">Pegang Kode Serah</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 text-center text-xs text-slate-500">
            <span>Belum memiliki akun? </span>
            <button
              type="button"
              onClick={() => setView('signup')}
              className="text-[#387CB7] font-bold hover:underline cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
