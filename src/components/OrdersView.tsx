import React, { useState } from 'react';
import { ChevronLeft, Clock, Users, Search, PlusCircle, CheckCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order, OrderStatus } from '../types';
import { BingoLogo } from './BingoLogo';
import { StatusBar } from './StatusBar';
import { OrderDetailsModal } from './OrderDetailsModal';
import { playNotificationChime } from '../utils/audio';

interface OrdersViewProps {
  orders: Order[];
  onBack: () => void;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  onSimulateNewOrder: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onBack,
  onUpdateStatus,
  onSimulateNewOrder,
}) => {
  const [activeTab, setActiveTab] = useState<'masuk' | 'diproses' | 'siap_diambil' | 'selesai'>('masuk');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBuddyOnly, setFilterBuddyOnly] = useState(false);

  // Tab counts
  const masukCount = orders.filter((o) => o.status === 'masuk').length;
  const diprosesCount = orders.filter((o) => o.status === 'diproses').length;
  const siapCount = orders.filter((o) => o.status === 'siap_diambil').length;
  const selesaiCount = orders.filter((o) => o.status === 'selesai').length;

  // Filtered orders
  const currentTabOrders = orders.filter((o) => {
    if (o.status !== activeTab) return false;
    if (filterBuddyOnly && !o.isBuddyOrder) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchReceipt = (o.receiptNo || o.orderNumber || '').toLowerCase().includes(q);
      const matchItem = o.items.some((i) => i.name.toLowerCase().includes(q));
      return matchName || matchReceipt || matchItem;
    }
    return true;
  });

  const handleProcess = (orderId: string) => {
    playNotificationChime('ready');
    onUpdateStatus(orderId, 'diproses');
  };

  const handleReady = (orderId: string) => {
    playNotificationChime('ready');
    onUpdateStatus(orderId, 'siap_diambil');
  };

  const handlePickUp = (orderId: string) => {
    playNotificationChime('success');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#F59E0B', '#2563EB', '#10B981'],
    });
    onUpdateStatus(orderId, 'selesai');
  };

  const advanceCurrentStatus = (orderId: string) => {
    const o = orders.find((x) => x.id === orderId);
    if (!o) return;
    if (o.status === 'masuk') handleProcess(orderId);
    else if (o.status === 'diproses') handleReady(orderId);
    else if (o.status === 'siap_diambil') handlePickUp(orderId);
  };

  return (
    <div className="relative w-full h-full flex-1 overflow-y-auto min-h-0 bg-slate-50 flex flex-col pb-12">
      {/* Top Header (Matches Wireframe 2, 3, 4 & Vendor Header) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <StatusBar />
        <div className="flex items-center justify-between px-4 py-3 min-h-[58px]">
          {/* Back button with title */}
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-slate-800 hover:text-slate-950 font-bold text-base transition-colors cursor-pointer group"
          >
            <ChevronLeft className="w-5 h-5 -ml-1 text-slate-700 group-hover:-translate-x-0.5 transition-transform" />
            <span>Pesanan</span>
          </button>

          {/* BinGO! Logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSimulateNewOrder}
              className="text-[11px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              title="Simulasi pesanan siswa baru masuk"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Simulasi Order</span>
            </button>
            <BingoLogo size="md" />
          </div>
        </div>

        {/* Tab Navigation (Exact wireframe tabs: Masuk, Diproses, Siap Diambil, plus Selesai) */}
        <div className="px-3 pt-1 border-t border-slate-100 overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-1 min-w-max">
            {/* Tab: Masuk */}
            <button
              onClick={() => setActiveTab('masuk')}
              className={`pb-2.5 pt-1.5 px-3 text-xs sm:text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === 'masuk'
                  ? 'text-slate-900 font-extrabold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>Masuk ({masukCount})</span>
              {activeTab === 'masuk' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>

            {/* Tab: Diproses */}
            <button
              onClick={() => setActiveTab('diproses')}
              className={`pb-2.5 pt-1.5 px-3 text-xs sm:text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === 'diproses'
                  ? 'text-slate-900 font-extrabold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>Diproses ({diprosesCount})</span>
              {activeTab === 'diproses' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>

            {/* Tab: Siap Diambil */}
            <button
              onClick={() => setActiveTab('siap_diambil')}
              className={`pb-2.5 pt-1.5 px-3 text-xs sm:text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === 'siap_diambil'
                  ? 'text-slate-900 font-extrabold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>Siap Diambil ({siapCount})</span>
              {activeTab === 'siap_diambil' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>

            {/* Tab: Selesai */}
            <button
              onClick={() => setActiveTab('selesai')}
              className={`pb-2.5 pt-1.5 px-3 text-xs sm:text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === 'selesai'
                  ? 'text-slate-900 font-extrabold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>Selesai ({selesaiCount})</span>
              {activeTab === 'selesai' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="p-4 space-y-3 max-w-md mx-auto w-full">
        {/* Search & Buddy Filter Bar */}
        <div className="flex items-center gap-2 mb-1">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari no struk, nama, atau menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-slate-400"
            />
          </div>
          <button
            onClick={() => setFilterBuddyOnly(!filterBuddyOnly)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-colors cursor-pointer ${
              filterBuddyOnly
                ? 'bg-orange-500 text-white border-orange-600'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Buddy</span>
          </button>
        </div>

        {/* Empty State */}
        {currentTabOrders.length === 0 && (
          <div className="text-center py-12 px-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">
              {activeTab === 'masuk'
                ? 'Belum ada pesanan baru masuk'
                : activeTab === 'diproses'
                ? 'Tidak ada pesanan yang sedang diproses'
                : activeTab === 'siap_diambil'
                ? 'Belum ada pesanan yang siap diambil'
                : 'Belum ada riwayat pesanan selesai'}
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              {activeTab === 'masuk'
                ? 'Pesanan pre-order siswa akan otomatis muncul di sini. Coba klik "Simulasi Order" untuk menguji.'
                : 'Status pesanan akan terbarui secara otomatis saat diproses.'}
            </p>
            {activeTab === 'masuk' && (
              <button
                onClick={onSimulateNewOrder}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Buat Simulasi Pesanan Siswa</span>
              </button>
            )}
          </div>
        )}

        {/* Orders List (Matches exact visual layout of Wireframes 2, 3, 4) */}
        {currentTabOrders.map((order) => (
          <div
            key={order.id}
            className="w-full bg-white rounded-2xl border border-slate-200 shadow-xs p-4 transition-all hover:border-slate-300"
          >
            {/* Top row: Receipt No */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-extrabold text-slate-800 tracking-tight text-sm">
                Receipt No {order.receiptNo}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">{order.createdAt}</span>
            </div>

            {/* Pemesan & Ambil row */}
            <div className="flex items-baseline justify-between mb-1.5">
              <div className="font-bold text-slate-900 text-sm">
                Pemesan: <span className="font-extrabold">{order.customerName}</span>
              </div>
              <div className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>Ambil: {order.pickupTime}</span>
              </div>
            </div>

            {/* Buddy Order Highlight (Seen in wireframe Phone 2: Buddy Order - Max) */}
            {order.isBuddyOrder && (
              <div className="mb-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 bg-orange-50 border border-orange-200/80 px-2 py-0.5 rounded-md">
                  <Users className="w-3 h-3" />
                  <span>
                    Buddy Order - {order.buddyLeadName || order.customerName.split('&')[0].trim()}
                  </span>
                </span>
              </div>
            )}

            {/* Items list separator */}
            <div className="border-t border-slate-100 my-2 pt-2">
              <div className="space-y-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs text-slate-800">
                    <span className="font-medium">
                      <span className="font-extrabold text-slate-900 mr-1.5">
                        {item.quantity}x
                      </span>
                      {item.name}
                    </span>
                    {idx === 0 && (
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer ml-2"
                      >
                        See Details
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes Section (Seen in wireframe: "Note : tanpa sambal") */}
            <div className="border-t border-slate-100 mt-2.5 pt-2 flex items-center justify-between">
              <div className="text-xs text-slate-600 italic truncate max-w-[200px] sm:max-w-xs">
                {order.notes ? (
                  <span>
                    <span className="font-semibold not-italic text-slate-500">Note :</span>{' '}
                    {order.notes}
                  </span>
                ) : (
                  <span className="text-slate-400 not-italic">Tidak ada catatan</span>
                )}
              </div>

              {/* Action Button: Matches wireframe styling per tab */}
              <div>
                {/* In "Masuk" tab: Yellow/Amber "Process" button */}
                {activeTab === 'masuk' && (
                  <button
                    onClick={() => handleProcess(order.id)}
                    className="px-5 py-1.5 rounded-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-xs transition-all active:scale-[0.97] cursor-pointer"
                  >
                    Process
                  </button>
                )}

                {/* In "Diproses" tab: Blue "Ready" button */}
                {activeTab === 'diproses' && (
                  <button
                    onClick={() => handleReady(order.id)}
                    className="px-5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all active:scale-[0.97] cursor-pointer"
                  >
                    Ready
                  </button>
                )}

                {/* In "Siap Diambil" tab: Pick up confirmation */}
                {activeTab === 'siap_diambil' && (
                  <button
                    onClick={() => handlePickUp(order.id)}
                    className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-[0.97] cursor-pointer flex items-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Selesai</span>
                  </button>
                )}

                {/* In "Selesai" tab: Status badge */}
                {activeTab === 'selesai' && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    Sudah Diambil
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Details Modal (when "See Details" is clicked) */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onAdvanceStatus={advanceCurrentStatus}
      />
    </div>
  );
};
