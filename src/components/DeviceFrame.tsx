import React from 'react';
import { Smartphone, Monitor, UserCheck, UtensilsCrossed, BellRing, LayoutDashboard } from 'lucide-react';
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
  // When viewing Desktop Owner Dashboard, render clean full-screen desktop view without phone mode switcher in header
  if (viewMode === 'owner_dashboard') {
    return (
      <div className="w-full min-h-screen bg-[#fafafa] flex flex-col font-sans antialiased text-slate-800 selection:bg-amber-400 selection:text-slate-950">
        <div className="w-full flex-1 flex flex-col min-h-0">
          {children}
        </div>
        {/* Subtle, unobtrusive floating toggle in bottom corner for dev/preview testing */}
        <div className="fixed bottom-3 right-3 z-50 flex items-center gap-1.5 opacity-30 hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onToggleViewMode('vendor')}
            className="px-2.5 py-1 rounded-full bg-slate-900/90 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-semibold shadow-lg backdrop-blur-xs flex items-center gap-1 cursor-pointer"
            title="Buka Pratinjau Tampilan HP"
          >
            <Smartphone className="w-3 h-3 text-amber-400" />
            <span>Mode HP</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-start text-slate-800 antialiased selection:bg-amber-400 selection:text-slate-950">
      {/* Top Universal Control Bar for Mobile Preview */}
      <nav className="w-full bg-[#fafafa]/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 sticky top-0 z-50 flex items-center justify-between flex-wrap gap-2 shadow-2xs text-slate-800">
        <div className="flex items-center gap-3">
          <BingoLogo size="sm" variant="light" />

          {/* Role Switcher */}
          <div className="flex items-center bg-slate-100 border border-slate-200/90 p-0.5 rounded-xl text-xs">
            <button
              onClick={() => onToggleViewMode('vendor')}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'vendor'
                  ? 'bg-[#F38B21] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
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
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'student'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Siswa (Pesan Makanan)</span>
            </button>
            <button
              onClick={() => onToggleViewMode('owner_dashboard')}
              className="px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer text-slate-600 hover:text-slate-900"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-amber-500" />
              <span>Owner Dashboard (Desktop)</span>
            </button>
          </div>
        </div>

        {/* Right Controls: Device Preview Toggle & Simulate Order */}
        <div className="flex items-center gap-2">
          {/* Simulate Order Button */}
          <button
            onClick={onSimulateOrder}
            className="px-2.5 py-1 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#F38B21] border border-orange-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            title="Kirim simulasi pesanan baru ke dapur & database Firestore"
          >
            <BellRing className="w-3.5 h-3.5 text-[#F38B21] animate-bounce" />
            <span className="hidden sm:inline">+ Simulasi Order</span>
          </button>

          {/* Phone vs Desktop Frame Toggle */}
          <div className="flex items-center bg-slate-100 border border-slate-200/90 p-0.5 rounded-xl text-xs">
            <button
              onClick={() => onToggleDevicePreview('mobile')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                devicePreview === 'mobile'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan HP (Sesuai Desain Wireframe)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleDevicePreview('responsive')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                devicePreview === 'responsive'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Penuh Layar Lebar"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Frame Container for Mobile */}
      <div className="w-full flex-1 flex items-start justify-center p-0 sm:p-4 md:p-6 transition-all">
        {devicePreview === 'mobile' ? (
          /* Realistic Smartphone Bezel Container (Matches Wireframes) */
          <div className="relative w-full max-w-[420px] bg-slate-950 rounded-[44px] p-2.5 shadow-2xl ring-1 ring-slate-900/10 my-2 sm:my-4 transition-all">
            {/* Phone Outer Shadow / Rim with strictly isolated containment */}
            <div className="relative rounded-[36px] overflow-hidden bg-white text-slate-800 shadow-inner h-[844px] max-h-[calc(100dvh-65px)] flex flex-col [transform:translateZ(0)] isolate">
              {children}
            </div>

            {/* Simulated iPhone bottom home swipe indicator */}
            <div className="w-32 h-1 bg-slate-600 rounded-full mx-auto my-2 opacity-80" />
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
