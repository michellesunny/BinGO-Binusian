import React, { useState } from 'react';
import { StatusBar } from './StatusBar';
import { Logo } from './Logo';
import { ArrowLeft, Mail, Lock, User, Phone, MapPin, Hash, CheckCircle2 } from 'lucide-react';

interface AuthScreensProps {
  initialView?: 'login' | 'signup';
  onSuccess: (userProfile?: { name: string; nim: string; email: string }) => void;
  onBackToSplash: () => void;
}

export const AuthScreens: React.FC<AuthScreensProps> = ({
  initialView = 'login',
  onSuccess,
  onBackToSplash,
}) => {
  const [view, setView] = useState<'login' | 'signup' | 'otp'>(initialView);

  // Form states
  const [email, setEmail] = useState('amelia.suryanto@binus.ac.id');
  const [password, setPassword] = useState('••••••••');
  const [fullName, setFullName] = useState('AMELIA ANGELICA SURYANTO');
  const [nim, setNim] = useState('2802403247');
  const [phone, setPhone] = useState('081298765432');
  const [campusBranch, setCampusBranch] = useState('BINUS Kemanggisan - Anggrek');
  const [confirmPassword, setConfirmPassword] = useState('••••••••');
  const [otp, setOtp] = useState(['4', '8', '2', '0']);
  const [otpSent, setOtpSent] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess({
      name: fullName || 'Amelia Angelica Suryanto',
      nim: nim || '2802403247',
      email: email || 'amelia.suryanto@binus.ac.id',
    });
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setView('otp');
  };

  const handleOtpConfirm = () => {
    onSuccess({
      name: fullName,
      nim: nim,
      email: email,
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-y-auto bg-white text-slate-900 select-none">
      <StatusBar theme="dark" />

      {/* Top Header with Back Button */}
      <div className="px-6 py-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (view === 'otp') setView('signup');
            else onBackToSplash();
          }}
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Logo size="sm" />
        <div className="w-10" />
      </div>

      {/* View 1: LOGIN (Figma Frame 134:3370) */}
      {view === 'login' && (
        <div className="flex-1 px-7 py-4 flex flex-col justify-between animate-fadeIn">
          <div>
            <div className="mt-2 mb-6">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Log In</h1>
              <p className="text-sm text-slate-500 mt-1">Selamat datang kembali!</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email BINUS
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama.mahasiswa@binus.ac.id"
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#F38B21] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#F38B21] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => alert('Fitur reset password telah dikirim ke email BINUS Anda.')}
                  className="text-xs text-[#387CB7] hover:underline font-medium"
                >
                  Lupa Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full h-12 mt-4 rounded-xl bg-[#F38B21] text-white font-semibold text-sm shadow-md shadow-orange-500/20 active:scale-98 transition-all hover:bg-[#e07d1a] cursor-pointer"
              >
                Log In
              </button>
            </form>
          </div>

          <div className="py-6 text-center text-xs text-slate-500">
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

      {/* View 2: SIGN UP (Figma Frame 120) */}
      {view === 'signup' && (
        <div className="flex-1 px-7 py-3 flex flex-col justify-between animate-fadeIn">
          <div>
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sign Up</h1>
              <p className="text-xs text-slate-500 mt-1">Buat akun baru untuk menggunakan BinGO!</p>
            </div>

            <form onSubmit={handleSignUpSubmit} className="space-y-3 pb-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Nama Lengkap
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Amelia Angelica Suryanto"
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#F38B21] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    NIM / NIP
                  </label>
                  <div className="relative flex items-center">
                    <Hash className="absolute left-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={nim}
                      onChange={(e) => setNim(e.target.value)}
                      placeholder="2802403247"
                      className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#F38B21] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Nomor Telepon
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="absolute left-3 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="081298765432"
                      className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#F38B21] focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Cabang Kampus
                </label>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3 w-4 h-4 text-slate-400" />
                  <select
                    value={campusBranch}
                    onChange={(e) => setCampusBranch(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:outline-none focus:border-[#F38B21] focus:bg-white"
                  >
                    <option value="BINUS Kemanggisan - Anggrek">BINUS Kemanggisan - Kampus Anggrek</option>
                    <option value="BINUS Kemanggisan - Syahdan">BINUS Kemanggisan - Kampus Syahdan</option>
                    <option value="BINUS Alam Sutera">BINUS Alam Sutera Main Campus</option>
                    <option value="BINUS Senayan (JWC)">BINUS Senayan - JWC Campus</option>
                    <option value="BINUS Bekasi">BINUS Bekasi Campus</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Email BINUS
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="amelia.suryanto@binus.ac.id"
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:outline-none focus:border-[#F38B21] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:outline-none focus:border-[#F38B21] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Confirmation Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Konfirmasi"
                      className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50/50 text-xs text-slate-800 focus:outline-none focus:border-[#F38B21] focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 mt-3 rounded-xl bg-[#F38B21] text-white font-semibold text-xs shadow-md shadow-orange-500/20 active:scale-98 transition-all hover:bg-[#e07d1a] cursor-pointer"
              >
                Sign Up & Verifikasi OTP
              </button>
            </form>
          </div>

          <div className="py-3 text-center text-xs text-slate-500">
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

      {/* View 3: OTP VERIFICATION (Figma Frame 134:3472) */}
      {view === 'otp' && (
        <div className="flex-1 px-7 py-6 flex flex-col justify-between animate-fadeIn text-center">
          <div>
            <div className="w-14 h-14 bg-orange-100 text-[#F38B21] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">OTP</h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Buat akun baru untuk menggunakan BinGO! Kode verifikasi telah dikirim ke <span className="font-semibold text-slate-700">{email}</span>.
            </p>

            {/* 4-digit OTP code boxes */}
            <div className="flex justify-center gap-3 my-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const newOtp = [...otp];
                    newOtp[index] = e.target.value;
                    setOtp(newOtp);
                  }}
                  className="w-13 h-14 text-center text-2xl font-bold rounded-xl border-2 border-slate-200 bg-slate-50 focus:border-[#F38B21] focus:bg-white focus:outline-none transition-all shadow-xs"
                />
              ))}
            </div>

            <div className="text-xs text-slate-500">
              <span>Belum menerima email? </span>
              <button
                type="button"
                onClick={() => {
                  setOtpSent(true);
                  setTimeout(() => setOtpSent(false), 3000);
                }}
                className="text-[#387CB7] font-bold hover:underline cursor-pointer"
              >
                Kirim ulang kode
              </button>
              {otpSent && (
                <p className="text-[11px] text-emerald-600 mt-1 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Kode baru telah dikirimkan!
                </p>
              )}
            </div>
          </div>

          <div className="pb-6">
            <button
              type="button"
              onClick={handleOtpConfirm}
              className="w-full h-12 rounded-xl bg-[#F38B21] text-white font-semibold text-sm shadow-md shadow-orange-500/20 active:scale-98 transition-all hover:bg-[#e07d1a] cursor-pointer"
            >
              Konfirmasi
            </button>
          </div>
        </div>
      )}

      {/* Safe bottom spacer */}
      <div className="w-[153px] h-[5px] bg-slate-900/30 rounded-full mx-auto mb-3" />
    </div>
  );
};
