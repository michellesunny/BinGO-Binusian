import React, { useState } from 'react';
import { StatusBar } from './StatusBar';
import { Order } from '../types';
import {
  Clock,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Package,
  Bike,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';

interface OngoingScreenProps {
  order: Order | null;
  onViewTicket: () => void;
  onAdvanceTimeline?: () => void;
  onResetOrder?: () => void;
}

export const OngoingScreen: React.FC<OngoingScreenProps> = ({
  order,
  onViewTicket,
  onAdvanceTimeline,
  onResetOrder,
}) => {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50 text-slate-900 select-none pb-6">
      <StatusBar theme="dark" />

      {/* Header */}
      <div className="px-5 pt-3 pb-3 bg-white border-b border-slate-100 flex items-center justify-between shadow-2xs">
        <div>
          <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
            Ongoing Order
          </h1>
          <p className="text-[11px] text-slate-400">
            Lacak status persiapan & pengantaran pesananmu
          </p>
        </div>
        {order && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-orange-100 text-[#F38B21] font-bold">
            {order.orderNumber}
          </span>
        )}
      </div>

      <div className="px-5 pt-4 space-y-4">
        {order ? (
          <>
            {/* Main Order Status Card (Figma Home 75:750 & 75:780) */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
              {/* Vendor & Date header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-extrabold text-slate-900">
                      {order.vendorName}
                    </h2>
                    {order.isBuddyEnabled && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#135381]">
                        Buddy
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Slot: <span className="font-semibold text-slate-700">{order.pickupSlot}</span> • {order.date}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onViewTicket}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <span>Lihat Detail</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Items summary */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Rangkuman Menu
                </span>
                {order.items.map((item) => (
                  <div key={item.menuItem.id} className="flex justify-between font-medium">
                    <span className="text-slate-800">
                      {item.menuItem.name} <span className="text-slate-400">x{item.quantity}</span>
                    </span>
                    <span className="tabular-nums font-bold text-slate-900">
                      Rp {(item.menuItem.price * item.quantity).toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Timeline Tracker (From Figma: Pesanan dibuat, Pesanan diambil dari vendor, Pesanan sampai) */}
              <div className="pt-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Status Pengantaran
                </h3>

                <div className="space-y-4 relative pl-7 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {order.timeline.map((step, idx) => {
                    return (
                      <div key={idx} className="relative flex items-start justify-between">
                        {/* Dot indicator */}
                        <div
                          className={`absolute -left-7 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                            step.done
                              ? 'bg-[#F38B21] border-[#F38B21] text-white shadow-xs'
                              : step.active
                              ? 'bg-amber-400 border-white text-white animate-pulse'
                              : 'bg-white border-slate-300 text-transparent'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                        </div>

                        <div>
                          <p
                            className={`text-xs ${
                              step.done || step.active
                                ? 'font-bold text-slate-900'
                                : 'font-medium text-slate-400'
                            }`}
                          >
                            {step.status}
                          </p>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {step.time}
                          </span>
                        </div>

                        {step.active && (
                          <span className="text-[10px] font-bold text-[#F38B21] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200/60">
                            Aktif
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Buddy details if assigned */}
              {order.buddy && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50/50 border border-orange-200/70 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden border border-orange-300">
                      <img
                        src={order.buddy.avatar}
                        alt={order.buddy.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-[#F38B21] uppercase">
                        Buddy Kamu
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {order.buddy.name}
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        Menuju ke: <span className="font-semibold text-slate-800">{order.dropLocation}</span>
                      </p>
                    </div>
                  </div>

                  <a
                    href="tel:08123456789"
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                  >
                    Hubungi
                  </a>
                </div>
              )}
            </div>

            {/* Interactive Timeline Simulation Controller */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#F38B21]" />
                  <span>Simulasi Tahap Pesanan</span>
                </span>
                <span className="text-[10px] text-slate-400">Demo Interaktif</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Klik tombol di bawah untuk menyimulasikan pergerakan status pesanan secara bertahap.
              </p>

              <div className="flex items-center gap-2 pt-1">
                {onAdvanceTimeline && (
                  <button
                    type="button"
                    onClick={onAdvanceTimeline}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#387CB7] text-white text-xs font-bold hover:bg-[#135381] transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                  >
                    <span>Maju ke Tahap Berikutnya</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
                {onResetOrder && (
                  <button
                    type="button"
                    onClick={onResetOrder}
                    className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                    title="Reset Tahap Pesanan"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#F38B21] flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Belum Ada Pesanan Berjalan
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Silakan pilih menu makanan di kantin dan checkout untuk memulai pesanan baru.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
