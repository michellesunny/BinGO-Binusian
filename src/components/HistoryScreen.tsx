import React from 'react';
import { StatusBar } from './StatusBar';
import { Order } from '../types';
import { Clock, CheckCircle2, RotateCw, ChevronRight, Receipt, Utensils } from 'lucide-react';

interface HistoryScreenProps {
  orders: Order[];
  onReorder: (order: Order) => void;
  onViewOrderDetails: (order: Order) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  orders,
  onReorder,
  onViewOrderDetails,
}) => {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50 text-slate-900 select-none pb-6">
      <StatusBar theme="dark" />

      {/* Header */}
      <div className="px-5 pt-3 pb-3 bg-white border-b border-slate-100 flex items-center justify-between shadow-2xs">
        <div>
          <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
            History Pesanan
          </h1>
          <p className="text-[11px] text-slate-400">
            Riwayat transaksi pesanan makanan di kantin
          </p>
        </div>
        <Receipt className="w-5 h-5 text-slate-400" />
      </div>

      <div className="px-5 pt-4 space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all space-y-3"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-900">
                    {order.vendorName}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Selesai
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  {order.date} • {order.orderNumber}
                </span>
              </div>

              <span className="text-xs font-extrabold text-slate-900 tabular-nums">
                Rp {order.total.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Items snippet */}
            <div className="text-xs text-slate-600 py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-100">
              {order.items.map((i) => `${i.menuItem.name} (${i.quantity}x)`).join(', ')}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onViewOrderDetails(order)}
                className="text-xs font-bold text-[#387CB7] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Bukti Tiket</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onReorder(order)}
                className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#F38B21] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RotateCw className="w-3 h-3" />
                <span>Pesan Lagi</span>
              </button>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200">
            <Utensils className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Belum ada riwayat pesanan.</p>
          </div>
        )}
      </div>
    </div>
  );
};
