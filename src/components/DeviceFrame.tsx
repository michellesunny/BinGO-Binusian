import React from 'react';
import { Smartphone, Monitor, UserCheck, UtensilsCrossed, BellRing } from 'lucide-react';
import { ViewMode, DevicePreviewMode } from '../types';
import { BingoLogo } from './BingoLogo';

interface DeviceFrameProps {
  children: React.ReactNode;
  viewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode) => void;
  devicePreview: DevicePreviewMode;
  onToggleDevicePreview: (mode: DevicePreviewMode) => void;
  onSimulateOrder: () => void;
  pendingCount: number;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  viewMode,
  onToggleViewMode,
  devicePreview,
  onToggleDevicePreview,
  onSimulateOrder,
  pendingCount,
}) => {
  return (
    <div className="min-h-screen bg-slate-900/95 flex flex-col items-center justify-start text-slate-100 antialiased selection:bg-amber-400 selection:text-slate-950">
      {/* Top Universal Control Bar */}
      <nav className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 sticky top-0 z-50 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <BingoLogo size="sm" variant="dark" />

          {/* Role Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-700/80 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => onToggleViewMode('vendor')}
              className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'vendor'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Penjual (Kedai Selan)</span>
              {pendingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-red-600 text-white rounded-full font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onToggleViewMode('student')}
              className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'student'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Siswa (Pesan Makanan)</span>
            </button>
          </div>
        </div>

        {/* Right Controls: Device Preview Toggle & Simulate Order */}
        <div className="flex items-center gap-2">
          {/* Simulate Order Button */}
          <button
            onClick={onSimulateOrder}
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            title="Kirim simulasi pesanan baru ke dapur"
          >
            <BellRing className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span className="hidden sm:inline">+ Simulasi Order</span>
          </button>

          {/* Phone vs Desktop Frame Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-700/80 p-0.5 rounded-lg text-xs">
            <button
              onClick={() => onToggleDevicePreview('mobile')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                devicePreview === 'mobile'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Tampilan HP (Sesuai Desain Wireframe)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleDevicePreview('responsive')}
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                devicePreview === 'responsive'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Tampilan Penuh Layar Lebar"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Frame Container */}
      <div className="w-full flex-1 flex items-start justify-center p-0 sm:p-4 md:p-6 transition-all">
        {devicePreview === 'mobile' ? (
          /* Realistic Smartphone Bezel Container (Matches Wireframes) */
          <div className="relative w-full max-w-[420px] bg-slate-950 rounded-[44px] p-2.5 shadow-2xl ring-1 ring-slate-800/80 my-2 sm:my-4 transition-all">
            {/* Phone Outer Shadow / Rim with strictly isolated containment */}
            <div className="relative rounded-[36px] overflow-hidden bg-white text-slate-800 shadow-inner h-[844px] max-h-[calc(100dvh-65px)] flex flex-col [transform:translateZ(0)] isolate">
              {children}
            </div>

            {/* Simulated iPhone bottom home swipe indicator */}
            <div className="w-32 h-1 bg-slate-700 rounded-full mx-auto my-2 opacity-80" />
          </div>
        ) : (
          /* Responsive Desktop/Tablet Container */
          <div className="w-full max-w-2xl bg-white text-slate-800 rounded-2xl shadow-xl overflow-hidden my-2 sm:my-4 border border-slate-200 relative [transform:translateZ(0)] isolate h-[844px] max-h-[calc(100dvh-65px)] flex flex-col">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
