import React, { useState } from 'react';
import { StatusBar } from './StatusBar';
import { Order } from '../types';
import {
  ArrowLeft,
  QrCode,
  CheckCircle2,
  Clock,
  MapPin,
  Star,
  Sparkles,
  Share2,
  Copy,
  Check,
} from 'lucide-react';

interface TicketScreenProps {
  order: Order;
  onGoBack: () => void;
  onGoToOngoing: () => void;
  onOpenRating: () => void;
  onMarkAsPickedUp?: () => void;
}

export const TicketScreen: React.FC<TicketScreenProps> = ({
  order,
  onGoBack,
  onGoToOngoing,
  onOpenRating,
  onMarkAsPickedUp,
}) => {
  const [copied, setCopied] = useState(false);
  const [pickedUpByVendor, setPickedUpByVendor] = useState(
    order.status === 'picked_up' || order.status === 'delivering' || order.status === 'completed'
  );

  const copyCode = () => {
    navigator.clipboard?.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMarkPickup = () => {
    setPickedUpByVendor(true);
    if (onMarkAsPickedUp) onMarkAsPickedUp();
  };

  return (
    <div className="relative flex-1 flex flex-col h-full bg-gradient-to-b from-[#135381] via-[#387CB7] to-slate-900 text-white select-none overflow-hidden">
      <StatusBar theme="light" />

      {/* Top Header */}
      <div className="px-5 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onGoBack}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white/90 hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-extrabold tracking-tight">
          Bukti Tiket
        </h1>
        <button
          type="button"
          onClick={copyCode}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white/90 hover:bg-white/10 transition-colors cursor-pointer"
          title="Salin Kode Pesanan"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Ticket Card Container */}
      <div className="flex-1 overflow-y-auto px-5 py-2 space-y-4 pb-24">
        <div className="text-center px-4">
          <p className="text-xs text-blue-100 font-medium leading-relaxed">
            {order.isBuddyEnabled && order.buddy
              ? 'Silakan tunggu Buddy untuk mengambil pesananmu di vendor.'
              : 'Tunjukkan bukti ini kepada vendor untuk mengambil pesanan.'}
          </p>
          <span className="text-[11px] text-amber-300 font-semibold mt-1 inline-block">
            Tampilkan barcode untuk menyelesaikan
          </span>
        </div>

        {/* Main Ticket Surface (Figma Frame 115:1501) */}
        <div className="bg-white rounded-3xl p-5 text-slate-900 shadow-2xl relative overflow-hidden">
          {/* Top Notch decorative cuts */}
          <div className="absolute -left-3 top-28 w-6 h-6 rounded-full bg-[#205e94]" />
          <div className="absolute -right-3 top-28 w-6 h-6 rounded-full bg-[#205e94]" />

          {/* Ticket Header */}
          <div className="flex items-center justify-between pb-4 border-b border-dashed border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                KODE TIKET
              </span>
              <div className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>{order.orderNumber}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  Lunas
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                VENDOR
              </span>
              <div className="text-sm font-extrabold text-[#F38B21]">
                {order.vendorName}
              </div>
            </div>
          </div>

          {/* Student Info */}
          <div className="py-4 grid grid-cols-2 gap-3 text-xs border-b border-dashed border-slate-200">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 block">Nama Pemesan</span>
              <span className="font-bold text-slate-900 leading-tight block truncate">
                {order.customerName}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 block">NIM Mahasiswa</span>
              <span className="font-mono font-bold text-slate-900 block tabular-nums">
                {order.nim}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 block">Slot Pengambilan</span>
              <span className="font-bold text-[#F38B21] flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{order.pickupSlot}</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 block">Titik Antar</span>
              <span className="font-bold text-slate-700 flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-[#387CB7]" />
                <span>{order.dropLocation || 'Ambil Sendiri'}</span>
              </span>
            </div>
          </div>

          {/* Ordered Items summary */}
          <div className="py-3 border-b border-dashed border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Pesanan
            </span>
            <div className="space-y-1">
              {order.items.map((item) => (
                <div key={item.menuItem.id} className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800">
                    {item.menuItem.name} <span className="text-slate-400 font-normal">x{item.quantity}</span>
                  </span>
                  <span className="tabular-nums text-slate-900">
                    Rp {(item.menuItem.price * item.quantity).toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Simulated Scannable Barcode & QR (Figma Ticket view) */}
          <div className="pt-4 flex flex-col items-center">
            {/* Barcode lines */}
            <div className="w-full flex items-center justify-center gap-1 h-12 px-4 py-1 bg-slate-50 rounded-xl border border-slate-100 mb-2">
              {[4, 2, 6, 1, 3, 5, 2, 4, 1, 6, 3, 2, 5, 1, 4, 3, 6, 2, 1, 5, 3, 2, 6, 4].map(
                (w, i) => (
                  <span
                    key={i}
                    style={{ width: `${w}px` }}
                    className="h-9 bg-slate-900 rounded-2xs inline-block"
                  />
                )
              )}
            </div>

            <span className="font-mono text-xs tracking-widest text-slate-500 font-bold tabular-nums">
              * 2802-4032-47-001 *
            </span>
          </div>

          {/* Buddy info card (if assigned) */}
          {order.buddy && (
            <div className="mt-4 p-3 rounded-2xl bg-orange-50/70 border border-orange-200/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-orange-300">
                  <img
                    src={order.buddy.avatar}
                    alt={order.buddy.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#F38B21] uppercase">
                    Informasi Buddy
                  </span>
                  <h4 className="text-xs font-bold text-slate-900">
                    {order.buddy.name}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-amber-600 font-semibold">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{order.buddy.rating || '4.5'}</span>
                    <span className="text-slate-400">• Diantar ke {order.dropLocation}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenRating}
                className="px-2.5 py-1.5 rounded-xl bg-white border border-orange-200 text-xs font-bold text-[#F38B21] shadow-2xs hover:bg-orange-50 transition-colors cursor-pointer"
              >
                Beri Rating
              </button>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="space-y-2 pt-2">
          {!pickedUpByVendor ? (
            <button
              type="button"
              onClick={handleMarkPickup}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-lg shadow-teal-900/30 flex items-center justify-center gap-2 cursor-pointer hover:brightness-105 active:scale-98 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Tandai sudah mengambil dari vendor</span>
            </button>
          ) : (
            <div className="w-full py-2 px-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold text-center border border-emerald-400/30 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Pesanan sudah terverifikasi & diambil dari vendor</span>
            </div>
          )}

          <button
            type="button"
            onClick={onGoToOngoing}
            className="w-full h-11 rounded-xl bg-white text-[#135381] font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-100 active:scale-98 transition-all"
          >
            <Clock className="w-4 h-4" />
            <span>Lihat Timeline Pengantaran (Ongoing)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
