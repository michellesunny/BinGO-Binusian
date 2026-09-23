import React, { useState } from 'react';
import { Logo } from './Logo';
import { StatusBar } from './StatusBar';
import { ASSET_IMAGES } from '../data/mockData';
import { ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onSignIn: () => void;
  onSignUp: () => void;
  onExploreDirectly: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onSignIn,
  onSignUp,
  onExploreDirectly,
}) => {
  const [slide, setSlide] = useState<1 | 2 | 3>(1);

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#FFF5EB] via-white to-[#F0F7FF] text-slate-900">
      <StatusBar theme="dark" />

      {/* Slide 1: Welcome & Logo */}
      {slide === 1 && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center animate-fadeIn">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-orange-400/20 rounded-full filter blur-2xl transform scale-150 animate-pulse" />
            <div className="relative scale-125">
              <Logo size="xl" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mt-6 tracking-tight">
            Kantin Kampus Jadi Lebih Cepat
          </h1>
          <p className="text-sm text-slate-500 mt-2 max-w-xs leading-relaxed">
            Pesan makanan favorit di kantin tanpa antri dan titip teman lewat fitur <span className="font-semibold text-[#F38B21]">Order Buddy</span>!
          </p>

          <div className="mt-10 flex items-center gap-2">
            <span className="w-6 h-2 rounded-full bg-[#F38B21]" />
            <span className="w-2 h-2 rounded-full bg-slate-200" />
            <span className="w-2 h-2 rounded-full bg-slate-200" />
          </div>

          <button
            type="button"
            onClick={() => setSlide(2)}
            className="mt-8 flex items-center justify-center gap-2 w-full max-w-xs h-12 rounded-2xl bg-gradient-to-r from-[#F38B21] to-[#FC9B3B] text-white font-semibold shadow-lg shadow-orange-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <span>Lanjutkan</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Slide 2: Buddy & Delivery Explanation */}
      {slide === 2 && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center animate-fadeIn">
          <div className="relative w-full max-w-xs aspect-4/3 rounded-2xl overflow-hidden shadow-xl border border-white/80 mb-6 bg-orange-50">
            <img
              src={ASSET_IMAGES.onboardingArt}
              alt="BinGO! Campus Order Buddy"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-xs rounded-xl p-2 text-left flex items-center gap-2 shadow-xs">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-[11px] leading-tight text-slate-700">
                <span className="font-bold text-slate-900">Hemat Waktu & Uang:</span> Titip pesanan ke teman sekelas atau bantu antarkan untuk dapat tip!
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Bisa Titip atau Jadi Buddy
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-xs leading-relaxed">
            Lagi ada kelas di lantai atas? Minta bantuan Buddy untuk antar sampai depan ruanganmu.
          </p>

          <div className="mt-8 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-200" />
            <span className="w-6 h-2 rounded-full bg-[#387CB7]" />
            <span className="w-2 h-2 rounded-full bg-slate-200" />
          </div>

          <button
            type="button"
            onClick={() => setSlide(3)}
            className="mt-8 flex items-center justify-center gap-2 w-full max-w-xs h-12 rounded-2xl bg-gradient-to-r from-[#387CB7] to-[#135381] text-white font-semibold shadow-lg shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <span>Mulai Sekarang</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Slide 3: Sign In / Sign Up Entry (Figma Splashscreen 3) */}
      {slide === 3 && (
        <div className="flex-1 flex flex-col items-center justify-between px-8 py-6 text-center animate-fadeIn">
          <div className="w-full flex justify-end">
            <button
              type="button"
              onClick={onExploreDirectly}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 py-1 px-3 rounded-full bg-slate-100/80 cursor-pointer"
            >
              Lewati (Demo Mode)
            </button>
          </div>

          <div className="flex flex-col items-center my-auto">
            <Logo size="lg" />
            <h2 className="text-2xl font-bold text-slate-900 mt-6 tracking-tight">
              Selamat Datang di BinGO!
            </h2>
            <p className="text-sm text-slate-500 mt-2 max-w-xs leading-relaxed">
              Masuk dengan akun BINUS atau buat akun baru untuk mulai memesan makanan.
            </p>
          </div>

          <div className="w-full max-w-xs space-y-3 pb-6">
            <button
              type="button"
              onClick={onSignUp}
              className="w-full h-12 rounded-2xl bg-[#F38B21] text-white font-semibold text-sm shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer hover:bg-[#e07d1a]"
            >
              <span>Sign Up</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onSignIn}
              className="w-full h-12 rounded-2xl bg-white border border-slate-300 text-slate-800 font-semibold text-sm active:scale-95 transition-all hover:bg-slate-50 shadow-xs cursor-pointer"
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={onExploreDirectly}
              className="text-xs text-slate-400 hover:text-slate-600 block pt-2 underline underline-offset-4"
            >
              Lanjut sebagai Guest (Amelia Angelica)
            </button>
          </div>
        </div>
      )}

      {/* Safe bottom spacer */}
      <div className="w-[153px] h-[5px] bg-slate-900/30 rounded-full mx-auto mb-3" />
    </div>
  );
};
