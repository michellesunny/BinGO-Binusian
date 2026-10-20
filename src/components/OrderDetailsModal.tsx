import React from 'react';
import { X, Clock, CheckCircle2, AlertCircle, Users, Receipt, ArrowRight } from 'lucide-react';
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

  const handleSendToWhatsApp = () => {
    const itemsList = order.items
      .map((item, idx) => `${idx + 1}. ${item.quantity}x ${item.name} (${formatRupiah(item.price * item.quantity)})`)
      .join('\n');

    const totalStr = formatRupiah(order.totalAmount ?? order.total ?? 0);

    const message = `*HALO KAK ${order.customerName.toUpperCase()}! 👋*\n` +
      `Pesanan Anda di *BinGO! E-Canteen* telah tercatat dengan rincian berikut:\n\n` +
      `🧾 *No. Struk:* ${order.receiptNo}\n` +
      `⏰ *Jadwal Ambil:* ${order.pickupTime}\n` +
      `📍 *Status Pesanan:* ${badge.text}\n` +
      (order.isBuddyOrder ? `👥 *Tipe:* Pesanan Kelompok (Buddy Order)\n` : '') +
      `\n📋 *Daftar Menu:*\n${itemsList}\n\n` +
      `💰 *Total Pembayaran:* ${totalStr}\n` +
      `💳 *Metode:* ${order.paymentMethod} (${order.paymentStatus})\n` +
      (order.notes ? `📝 *Catatan:* "${order.notes}"\n\n` : '\n') +
      `Silakan ambil pesanan Anda di stan kantin sesuai waktu istirahat. Terima kasih! 🍽️`;

    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

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
            onClick={handleSendToWhatsApp}
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
            title="Kirim Struk ke WhatsApp"
          >
            <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span>Kirim ke WA</span>
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
