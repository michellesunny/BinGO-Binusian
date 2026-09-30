import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share, PlusSquare, X, Smartphone } from 'lucide-react';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (compact) {
      return (
        <button
          type="button"
          onClick={install}
          className="p-1.5 rounded-xl bg-orange-50 text-[#F38B21] hover:bg-orange-100 transition-colors flex items-center gap-1 text-xs font-bold shadow-2xs cursor-pointer"
          title="Install BinGO! ke HP"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="text-[10px] hidden xs:inline">Install App</span>
        </button>
      );
    }

    return (
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#135381] to-[#387CB7] text-white shadow-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-xs font-bold leading-tight">Install BinGO! di HP</h4>
            <p className="text-[10px] text-blue-100 leading-tight">Buka lebih cepat & hemat kuota seperti aplikasi native</p>
          </div>
        </div>
        <button
          type="button"
          onClick={install}
          className="px-3 py-1.5 rounded-xl bg-white text-[#135381] font-bold text-xs hover:bg-blue-50 transition-colors shadow-xs shrink-0 cursor-pointer flex items-center gap-1 active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install</span>
        </button>
      </div>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        {compact ? (
          <button
            type="button"
            onClick={() => setShowIOSGuide(true)}
            className="p-1.5 rounded-xl bg-blue-50 text-[#135381] hover:bg-blue-100 transition-colors flex items-center gap-1 text-xs font-bold shadow-2xs cursor-pointer"
            title="Install BinGO! ke iPhone"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden xs:inline">Install App</span>
          </button>
        ) : (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#135381] to-[#387CB7] text-white shadow-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">Pasang BinGO! di iPhone</h4>
                <p className="text-[10px] text-blue-100 leading-tight">Jadikan aplikasi di Home Screen iOS kamu</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowIOSGuide(true)}
              className="px-3 py-1.5 rounded-xl bg-white text-[#135381] font-bold text-xs hover:bg-blue-50 transition-colors shadow-xs shrink-0 cursor-pointer flex items-center gap-1 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Pasang</span>
            </button>
          </div>
        )}

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-sm rounded-3xl bg-white p-5 text-slate-900 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#135381] flex items-center justify-center font-bold">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Cara Pasang di iPhone / iPad</h3>
                    <p className="text-[10px] text-slate-400">Tambahkan ke Layar Utama</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#135381] font-bold text-xs shrink-0">
                    1
                  </div>
                  <p className="text-slate-700 leading-snug">
                    Buka situs ini di browser <strong>Safari</strong> iPhone kamu, lalu ketuk tombol <strong>Share</strong> (ikon kotak dengan panah ke atas <Share className="w-3.5 h-3.5 inline mx-0.5 text-blue-600" /> di bilah bawah).
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#135381] font-bold text-xs shrink-0">
                    2
                  </div>
                  <p className="text-slate-700 leading-snug">
                    Gulir ke bawah dan pilih menu <strong>Add to Home Screen</strong> (Tambah ke Layar Utama <PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-slate-700" />).
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#135381] font-bold text-xs shrink-0">
                    3
                  </div>
                  <p className="text-slate-700 leading-snug">
                    Ketuk <strong>Add / Tambah</strong> di pojok kanan atas. BinGO! akan muncul di layar HP kamu seperti aplikasi biasa!
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-[#135381] hover:bg-[#387CB7] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Mengerti
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback when browser hasn't fired beforeinstallprompt or desktop browser
  return null;
};
