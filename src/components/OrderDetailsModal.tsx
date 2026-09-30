import React from 'react';
import { X, Clock, CheckCircle2, AlertCircle, Users, Receipt, Printer, ArrowRight } from 'lucide-react';
import { Order } from '../types';

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
  onAdvanceStatus?: (orderId: string) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  onAdvanceStatus,
}) => {
  if (!order) return null;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getStatusBadge = () => {
    switch (order.status) {
      case 'masuk':
        return { text: 'Menunggu', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'diproses':
        return { text: 'Sedang Disiapkan', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'siap_diambil':
        return { text: 'Siap Diambil', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'selesai':
        return { text: 'Selesai', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
      default:
        return { text: 'Dibatalkan', bg: 'bg-rose-100 text-rose-800 border-rose-200' };
    }
  };

  const badge = getStatusBadge();

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-hidden"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[360px] rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[86%] my-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-amber-500" />
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Detail Struk {order.receiptNo}
              </h3>
              <p className="text-[10px] text-slate-500">Dipesan pada {order.createdAt}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-3.5 text-xs text-slate-700 flex-1 min-h-0">
          {/* Status & Pickup Time */}
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
            <div className="min-w-0">
              <div className="text-[10px] font-semibold text-slate-500">Jadwal Ambil</div>
              <div className="text-sm font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate">{order.pickupTime}</span>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap shrink-0 text-center leading-tight ${badge.bg}`}>
              {badge.text}
            </span>
          </div>

          {/* Customer / Buddy Info */}
          <div className="space-y-0.5 bg-slate-50 rounded-xl p-3 border border-slate-100">
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              Informasi Pemesan
            </div>
            <div className="font-extrabold text-slate-900 text-sm">{order.customerName}</div>

            {order.isBuddyOrder && (
              <div className="mt-2 pt-2 border-t border-slate-200/80">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-orange-600">
                  <Users className="w-3.5 h-3.5" />
                  <span>Buddy Order (Pesan Bareng)</span>
                </div>
                {order.buddyMembers && (
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Anggota: {order.buddyMembers.join(', ')}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Itemized Order Breakdown */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Daftar Pesanan ({order.items.reduce((s, i) => s + i.quantity, 0)} Item)
            </div>
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-white">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-600 w-5">
                      {item.quantity}x
                    </span>
                    <span className="font-medium text-slate-900">{item.name}</span>
                  </div>
                  <span className="text-slate-700 font-semibold">
                    {formatRupiah(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Special Notes */}
          {order.notes && (
            <div className="p-2.5 rounded-xl bg-orange-50/70 border border-orange-200/60 text-xs">
              <div className="font-bold text-orange-800 flex items-center gap-1 mb-0.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Catatan Pemesan:</span>
              </div>
              <p className="text-orange-950 font-medium italic">"{order.notes}"</p>
            </div>
          )}

          {/* Payment Summary */}
          <div className="border-t border-slate-100 pt-2.5 space-y-1">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Metode Pembayaran</span>
              <span className="font-medium text-slate-800">
                {order.paymentMethod} ·{' '}
                <span className="text-emerald-600 font-bold">{order.paymentStatus}</span>
              </span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-100/80">
              <span>Total Pembayaran</span>
              <span className="text-orange-600 font-black">
                {formatRupiah(order.totalAmount ?? order.total ?? 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/80 flex items-center gap-2">
          <button
            onClick={() => window.print?.()}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Cetak Tiket Struk"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak</span>
          </button>

          {onAdvanceStatus && order.status !== 'selesai' && (
            <button
              onClick={() => {
                onAdvanceStatus(order.id);
                onClose();
              }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-[0.98] cursor-pointer ${
                order.status === 'masuk'
                  ? 'bg-amber-500 hover:bg-amber-600'
                  : order.status === 'diproses'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <span>
                {order.status === 'masuk'
                  ? 'Mulai Proses'
                  : order.status === 'diproses'
                  ? 'Siap Diambil'
                  : 'Konfirmasi Diambil'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {order.status === 'selesai' && (
            <div className="flex-1 py-2 text-center text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Sudah Diserahkan</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
