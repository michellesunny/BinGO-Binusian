import React from 'react';
import { BingoLogo } from './BingoLogo';
import { StatusBar } from './StatusBar';
import { VENDOR_PROFILE } from '../data/mockData';
import { ChevronDown } from 'lucide-react';

interface VendorHeaderProps {
  onTitleClick?: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  onSwitchMode?: () => void;
  isStudentMode?: boolean;
}

export const VendorHeader: React.FC<VendorHeaderProps> = ({
  isOpen,
  onToggleOpen,
  onSwitchMode,
  isStudentMode = false,
}) => {
  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 transition-all">
      <StatusBar />
      <div className="flex items-center justify-between px-4 py-3 min-h-[58px]">
        {/* Left: Vendor Profile */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <img
              src={VENDOR_PROFILE.avatarUrl}
              alt={VENDOR_PROFILE.name}
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
              <h1 className="font-extrabold text-slate-900 text-lg tracking-tight leading-tight">
                {VENDOR_PROFILE.name}
              </h1>
              <button
                onClick={onToggleOpen}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                  isOpen
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                }`}
                title="Klik untuk ubah status operasional"
              >
                {isOpen ? 'Buka' : 'Tutup'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: BinGO! Brand Logo */}
        <div className="flex items-center gap-2">
          {onSwitchMode && (
            <button
              onClick={onSwitchMode}
              className="hidden xs:flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg transition-colors"
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
  );
};
