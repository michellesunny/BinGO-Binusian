import React, { useState } from 'react';
import { BingoLogo } from './BingoLogo';
import { StatusBar } from './StatusBar';
import { VENDOR_PROFILE } from '../data/mockData';
import { ChevronDown, LogOut, Store, LayoutDashboard } from 'lucide-react';
import { VendorUser } from '../types';

interface VendorHeaderProps {
  onTitleClick?: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  onSwitchMode?: () => void;
  onOpenOwnerDashboard?: () => void;
  isStudentMode?: boolean;
  vendorUser?: VendorUser | null;
  onLogout?: () => void;
}

export const VendorHeader: React.FC<VendorHeaderProps> = ({
  isOpen,
  onToggleOpen,
  onSwitchMode,
  onOpenOwnerDashboard,
  isStudentMode = false,
  vendorUser,
  onLogout,
}) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const stallName = vendorUser?.stallName || VENDOR_PROFILE.name;
  const avatar = vendorUser?.avatarUrl || VENDOR_PROFILE.avatarUrl;
  const stallNumber = vendorUser?.stallNumber || VENDOR_PROFILE.stallNumber;

  return (
    <>
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 transition-all">
        <StatusBar />
        <div className="flex items-center justify-between px-4 py-3 min-h-[58px]">
          {/* Left: Vendor Profile */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={avatar}
                alt={stallName}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-full object-cover border-2 border-amber-200 shadow-xs"
              />
              {/* Open / Closed Live Indicator */}
              <span
                className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  isOpen ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
                title={isOpen ? 'Kantin Buka' : 'Kantin Tutup'}
              />
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-slate-900 text-base tracking-tight leading-tight">
                  {stallName}
                </h1>
                <button
                  type="button"
                  onClick={onToggleOpen}
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                    isOpen
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  }`}
                  title="Klik untuk ubah status operasional"
                >
                  {isOpen ? 'Buka' : 'Tutup'}
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Store className="w-3.5 h-3.5 text-slate-400" />
                <span>{stallNumber}</span>
              </div>
            </div>
          </div>

          {/* Right: Actions (Logout, Role switcher & Brand Logo) */}
          <div className="flex items-center gap-2">
            {onLogout && (
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                title="Keluar / Logout Akun Vendor"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

            {onOpenOwnerDashboard && (
              <button
                type="button"
                onClick={onOpenOwnerDashboard}
                className="hidden xs:flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
                title="Buka Owner Dashboard Desktop"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-amber-600" />
                <span>Owner DB</span>
              </button>
            )}

            {onSwitchMode && (
              <button
                type="button"
                onClick={onSwitchMode}
                className="hidden xs:flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                title="Beralih peran"
              >
                <span>{isStudentMode ? 'Mode Penjual' : 'Coba Pesan'}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            )}

            <BingoLogo size="md" />
          </div>
        </div>
      </header>

      {/* Confirmation Modal for Logout */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-extrabold text-slate-900">
                Keluar dari Akun Vendor?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Anda harus masuk kembali untuk mengelola menu dan menerima pesanan kantin.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout?.();
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-sm transition-colors cursor-pointer"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
