import React, { useState } from 'react';
import { StatusBar } from './StatusBar';
import { Order } from '../types';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Star,
  Share2,
  Copy,
  Check,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  X,
  Users,
  User,
} from 'lucide-react';

interface TicketScreenProps {
  order: Order;
  onGoBack: () => void;
  onGoToOngoing: () => void;
  onOpenRating: () => void;
  onMarkAsPickedUp?: () => void;
  onVerifyCompletionCode?: (code: string) => boolean;
  userRole?: 'pemesan' | 'buddy';
  isFromHistory?: boolean;
}

export const TicketScreen: React.FC<TicketScreenProps> = ({
  order,
  onGoBack,
  onGoToOngoing,
  onOpenRating,
  onVerifyCompletionCode,
  userRole = 'pemesan',
  isFromHistory = false,
}) => {
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isVerifyingModalOpen, setIsVerifyingModalOpen] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const verificationCode = order.verificationCode || '8492';
  const isCompleted = order.status === 'completed' || order.status === 'selesai' || Boolean(isFromHistory);
  const isBuddy = userRole === 'buddy' || Boolean(order.isBuddyOrder);

  // Buddy's own order items
  const buddyOwnItems = isBuddy
    ? (order.items && order.items.length > 0 ? [order.items[0]] : [{ name: 'Mie Ayam Jamur Spesial', quantity: 1, price: 16000 }])
    : order.items;

  const ticketHistoryReviews = [
    {
      id: 'tk-rev-1',
      author: order.customerName && order.customerName !== 'Valencia' ? order.customerName : 'Amelia Angelica',
      roleLabel: userRole === 'buddy' ? 'Pemesan Utama' : 'Ulasan Kamu',
      rating: 5.0,
      comment: 'Makanan datang tepat waktu, masih hangat dan packingnya rapi banget!',
      timeAgo: 'Baru saja',
    },
    {
      id: 'tk-rev-2',
      author: 'Michelley',
      roleLabel: 'Titip Pesanan',
      rating: 5.0,
      comment: 'Super ngebantu pas lagi ada tugas kelas. Buddy ramah dan responsif!',
      timeAgo: 'Kemarin',
    },
    {
      id: 'tk-rev-3',
      author: 'Raychelley',
      roleLabel: 'Titip Pesanan',
      rating: 4.8,
      comment: 'Sotonya gurih nikmat, kuah aman ga tumpah. Recommended!',
      timeAgo: '2 hari lalu',
    },
  ];

  const displayedReviews = isBuddy
    ? ticketHistoryReviews
    : [
        {
          id: 'tk-rev-user',
          author: order.customerName && order.customerName !== 'Valencia' ? `${order.customerName} (Kamu)` : 'Amelia Angelica (Kamu)',
          roleLabel: 'Ulasan Kamu',
          rating: 5.0,
          comment: 'Makanan datang tepat waktu, masih hangat dan packingnya rapi banget!',
          timeAgo: 'Selesai',
        },
      ];

  // Customers' peer requests/items
  const customerPeerRequests = (order.peerRequests && order.peerRequests.length > 0)
    ? order.peerRequests
    : (isBuddy
        ? [
            {
              id: 'peer-michelle',
              studentName: order.customerName && order.customerName !== 'Valencia' ? order.customerName : 'Michelley',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
              dropLocation: order.dropLocation || 'Lt. 4 Ruang 402',
              items: order.items && order.items.length > 1
                ? order.items.slice(1).map((it: any) => ({
                    name: it.menuItem?.name || it.name,
                    quantity: it.quantity || 1,
                    price: it.menuItem?.price || it.price || 18000,
                  }))
                : [
                    { name: 'Soto Nusantara', quantity: 1, price: 18000 },
                    { name: 'Es Teh Manis Jumbo', quantity: 1, price: 4000 },
                  ],
              fee: 2000,
            },
          ]
        : []);

  const copyReceiptCode = () => {
    navigator.clipboard?.writeText(order.orderNumber || order.receiptNo || 'ORDER-001');
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2000);
  };

  const copySecretCode = () => {
    navigator.clipboard?.writeText(verificationCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) {
      setErrorMessage('Harap masukkan kode verifikasi.');
      return;
    }

    if (onVerifyCompletionCode) {
      const success = onVerifyCompletionCode(inputCode.trim());
      if (success) {
        setIsVerifyingModalOpen(false);
        setErrorMessage('');
      } else {
        setErrorMessage('Kode salah! Pastikan sama dengan kode yang ditampilkan.');
      }
    }
  };

  return (
    <div className="relative flex-1 flex flex-col h-full bg-gradient-to-b from-[#135381] via-[#387CB7] to-slate-900 text-white select-none overflow-hidden">
      {/* Top Header with StatusBar */}
      <header className="sticky top-0 z-20 bg-[#135381] border-b border-blue-400/20 shadow-xs shrink-0">
        <StatusBar theme="light" />
        <div className="px-5 pt-1 pb-3 flex items-center justify-between">
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
            onClick={copyReceiptCode}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white/90 hover:bg-white/10 transition-colors cursor-pointer"
            title="Salin Nomor Struk"
          >
            {copiedReceipt ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Ticket Card Container (Scrollable content) */}
      <div className="flex-1 overflow-y-auto min-h-0 px-5 py-3 space-y-4">
        <div className="text-center px-4">
          <p className="text-xs text-blue-100 font-medium leading-relaxed">
            {order.isBuddyEnabled && order.buddy
              ? 'Tunjukkan kode serah terima saat pesanan sampai untuk verifikasi.'
              : 'Tunjukkan bukti ini kepada vendor untuk mengambil pesananmu.'}
          </p>
        </div>

        {/* Main Ticket Surface (No barcode) */}
        <div className="bg-white rounded-3xl p-5 text-slate-900 shadow-2xl relative overflow-hidden space-y-4">
          {/* Decorative notches */}
          <div className="absolute -left-3 top-28 w-6 h-6 rounded-full bg-[#205e94]" />
          <div className="absolute -right-3 top-28 w-6 h-6 rounded-full bg-[#205e94]" />

          {/* Ticket Header */}
          <div className="flex items-center justify-between pb-3 border-b border-dashed border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                NOMOR PESANAN
              </span>
              <div className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>{order.orderNumber || order.receiptNo}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isCompleted
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-blue-100 text-[#135381]'
                }`}>
                  {isCompleted ? 'Selesai' : 'Lunas'}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                VENDOR
              </span>
              <div className="text-sm font-extrabold text-[#F38B21]">
                {order.vendorName || 'Kedai Selan'}
              </div>
            </div>
          </div>

          {/* Student Info */}
          <div className="py-2 grid grid-cols-2 gap-3 text-xs border-b border-dashed border-slate-200">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 block">Nama Pemesan</span>
              <span className="font-bold text-slate-900 leading-tight block truncate">
                {order.customerName}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 block">NIM Mahasiswa</span>
              <span className="font-mono font-bold text-slate-900 block tabular-nums">
                {order.nim || '2802403247'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 block">Slot Pengambilan</span>
              <span className="font-bold text-[#F38B21] flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{order.pickupSlot || order.pickupTime}</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 block">Titik Antar</span>
              <span className="font-bold text-slate-700 flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-[#387CB7]" />
                <span>{order.dropLocation || 'Ambil Sendiri di Kantin'}</span>
              </span>
            </div>
          </div>

          {/* Ordered Items summary: Split into Buddy + Pemesan if isBuddy */}
          {isBuddy ? (
            <div className="py-2.5 border-b border-dashed border-slate-200 space-y-3">
              {/* Bagian 1: Pesanan Buddy */}
              <div className="space-y-1.5 bg-orange-50/50 p-2.5 rounded-2xl border border-orange-200/60">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#F38B21]" />
                  <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                    Pesanan Buddy
                  </span>
                </div>

                <div className="space-y-1 pl-1">
                  {buddyOwnItems.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800">
                        {item.menuItem?.name || item.name} <span className="text-slate-400 font-normal">x{item.quantity}</span>
                      </span>
                      <span className="tabular-nums text-slate-900">
                        Rp {((item.menuItem?.price || item.price) * item.quantity).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bagian 2: Pesanan Titipan */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#387CB7]" />
                  <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                    Pesanan Titipan
                  </span>
                </div>

                <div className="space-y-2">
                  {customerPeerRequests.map((peer, idx) => (
                    <div key={idx} className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {peer.avatar ? (
                            <img
                              src={peer.avatar}
                              alt={peer.studentName}
                              className="w-6 h-6 rounded-full object-cover border border-slate-300"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-[#135381] flex items-center justify-center font-bold text-[10px]">
                              {peer.studentName[0]}
                            </div>
                          )}
                          <span className="font-bold text-slate-900">{peer.studentName}</span>
                        </div>
                        <span className="text-[10px] text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200 font-medium">
                          {peer.dropLocation}
                        </span>
                      </div>

                      <div className="pl-8 space-y-0.5 text-[11px] text-slate-600">
                        {peer.items.map((i, itemIdx) => (
                          <div key={itemIdx} className="flex justify-between">
                            <span>{i.name} <span className="text-slate-400 font-normal">x{i.quantity}</span></span>
                            {i.price && (
                              <span className="tabular-nums font-semibold text-slate-800">
                                Rp {(i.price * i.quantity).toLocaleString('id-ID')}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Ordered Items summary for regular buyer */}
              <div className="py-2 border-b border-dashed border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Rincian Menu Pribadi
                </span>
                <div className="space-y-1">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800">
                        {item.menuItem?.name || item.name} <span className="text-slate-400 font-normal">x{item.quantity}</span>
                      </span>
                      <span className="tabular-nums text-slate-900">
                        Rp {((item.menuItem?.price || item.price) * item.quantity).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Breakdown per person for peer orders if any */}
              {order.peerRequests && order.peerRequests.length > 0 && (
                <div className="py-2.5 border-b border-dashed border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#387CB7]" />
                      <span>Rangkuman Titipan Teman ({order.peerRequests.length} Orang)</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Komisi: +Rp 2.000
                    </span>
                  </div>

                  <div className="space-y-2">
                    {order.peerRequests.map((peer, idx) => (
                      <div key={idx} className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {peer.avatar ? (
                              <img
                                src={peer.avatar}
                                alt={peer.studentName}
                                className="w-6 h-6 rounded-full object-cover border border-slate-300"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-orange-100 text-[#F38B21] flex items-center justify-center font-bold text-[10px]">
                                {peer.studentName[0]}
                              </div>
                            )}
                            <span className="font-bold text-slate-900">{peer.studentName}</span>
                          </div>
                          <span className="text-[10px] text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200 font-medium">
                            {peer.dropLocation}
                          </span>
                        </div>

                        <div className="pl-8 space-y-0.5 text-[11px] text-slate-600">
                          {peer.items.map((i, itemIdx) => (
                            <div key={itemIdx} className="flex justify-between">
                              <span>{i.name} <span className="text-slate-400 font-normal">x{i.quantity}</span></span>
                              {i.price && (
                                <span className="tabular-nums font-semibold text-slate-800">
                                  Rp {(i.price * i.quantity).toLocaleString('id-ID')}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Handover Verification Code Section - Completely hidden in history or when completed */}
          {!isCompleted && !isFromHistory && isBuddy && (
            <div className="pt-1">
              <div className="mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-[#F38B21]" />
                  <span>KODE SERAH TERIMA PESANAN</span>
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Tunjukkan ke pemesan saat pesanan sampai
                </span>
              </div>

              {showCode ? (
                <div className="p-3.5 rounded-2xl bg-amber-50/90 border-2 border-dashed border-amber-300 text-center animate-in fade-in duration-200 space-y-2">
                  <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                    Kode Verifikasi (Berikan ke Pemesan)
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-mono text-3xl font-black text-slate-900 tracking-[0.25em] bg-white px-5 py-1.5 rounded-xl shadow-xs border border-amber-200">
                      {verificationCode}
                    </span>
                    <button
                      type="button"
                      onClick={copySecretCode}
                      className="p-2.5 rounded-xl bg-white hover:bg-amber-100 text-amber-800 transition-colors border border-amber-200 shadow-2xs cursor-pointer"
                      title="Salin Kode"
                    >
                      {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-amber-800 leading-snug">
                    Tunjukkan kode 4 digit ini kepada pemesan saat makanan sampai untuk dimasukkan di aplikasinya.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowCode(false)}
                    className="text-[10px] text-slate-500 hover:text-slate-700 font-semibold flex items-center justify-center gap-1 mx-auto mt-1 cursor-pointer"
                  >
                    <EyeOff className="w-3 h-3" />
                    <span>Sembunyikan Kode</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCode(true)}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 border border-orange-200 text-xs font-bold text-[#F38B21] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
                >
                  <Eye className="w-4 h-4" />
                  <span>Tampilkan Kode Serah Terima</span>
                </button>
              )}
            </div>
          )}

          {/* If Pemesan, show notice to request the code from Buddy */}
          {!isCompleted && !isBuddy && (
            <div className="pt-1">
              <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200/60 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-[#135381] font-bold text-[11px]">
                  <KeyRound className="w-3.5 h-3.5 text-[#F38B21]" />
                  <span>Kode Serah Terima Ada di Buddy</span>
                </div>
                <p className="text-[10px] text-slate-600 leading-relaxed">
                  Kode 4 digit dipegang oleh Buddy kamu ({order.buddy?.name || 'Buddy'}). Minta kodenya saat pesanan tiba, lalu masukkan untuk menyelesaikan pesanan.
                </p>
              </div>
            </div>
          )}

          {/* Buddy info card (if assigned) */}
          {order.buddy && (
            <div className="p-3 rounded-2xl bg-orange-50/70 border border-orange-200/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-orange-300 shrink-0">
                  <img
                    src={order.buddy.avatar}
                    alt={order.buddy.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#F38B21] uppercase">
                    {isBuddy ? 'Akun Buddy (Kamu)' : 'Buddy Kamu'}
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

              {!isBuddy && (
                <button
                  type="button"
                  onClick={onOpenRating}
                  className="px-2.5 py-1.5 rounded-xl bg-white border border-orange-200 text-xs font-bold text-[#F38B21] shadow-2xs hover:bg-orange-50 transition-colors cursor-pointer"
                >
                  Rating
                </button>
              )}
            </div>
          )}

          {/* Riwayat Ulasan & Rating Pemesan (Tampil saat tiket sudah completed) */}
          {isCompleted && (
            <div className="pt-3 border-t border-dashed border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{isBuddy ? 'Riwayat Review & Rating Pemesan' : 'Riwayat Ulasan Kamu'}</span>
                </span>
                {isBuddy && (
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    ⭐ 4.9
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {displayedReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-2.5 rounded-2xl bg-amber-50/40 border border-amber-200/60 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{rev.author}</span>
                        <span className="text-[10px] text-slate-400">({rev.roleLabel})</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-white px-2 py-0.5 rounded-lg border border-amber-200 shadow-2xs">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{rev.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      "{rev.comment}"
                    </p>
                    <div className="text-[9px] text-slate-400 pt-0.5 flex items-center justify-between">
                      <span>{rev.timeAgo}</span>
                      <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Terverifikasi
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="space-y-2 pt-1 pb-4">
          {!isCompleted && !isBuddy && (
            <button
              type="button"
              onClick={() => setIsVerifyingModalOpen(true)}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-lg shadow-teal-900/30 flex items-center justify-center gap-2 cursor-pointer hover:brightness-105 active:scale-98 transition-all"
            >
              <KeyRound className="w-4 h-4" />
              <span>Masukkan Kode dari Buddy untuk Selesai</span>
            </button>
          )}

          {!(isBuddy && isCompleted) && (
            <button
              type="button"
              onClick={onGoToOngoing}
              className="w-full h-11 rounded-xl bg-white text-[#135381] font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-100 active:scale-98 transition-all"
            >
              <Clock className="w-4 h-4" />
              <span>Lihat Timeline Pengantaran (Ongoing)</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Safe Area / Home Indicator extending dark blue background to the very bottom */}
      <div className="w-full pt-2 pb-5 shrink-0 flex flex-col items-center justify-center bg-transparent">
        <div className="w-32 h-1 bg-white/20 rounded-full" />
      </div>

      {/* Verification Modal for Buyer to Enter Code */}
      {isVerifyingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 text-slate-900 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#F38B21] flex items-center justify-center font-bold">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Verifikasi Serah Terima
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Masukkan kode 4-digit dari Buddy
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsVerifyingModalOpen(false);
                  setErrorMessage('');
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Minta kode rahasia 4 digit yang tampil pada tiket Buddy saat menyerahkan pesanan, lalu ketikkan di bawah ini:
            </p>

            <form onSubmit={handleVerifySubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={inputCode}
                  onChange={(e) => {
                    setInputCode(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="Ketik 4 digit kode"
                  autoFocus
                  className="w-full px-4 py-3 text-center text-xl font-mono tracking-widest font-black rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-[#F38B21] bg-slate-50 text-slate-900 placeholder:text-slate-300 placeholder:font-normal placeholder:tracking-normal placeholder:text-sm"
                />
                {errorMessage && (
                  <p className="text-[11px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1 justify-center">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsVerifyingModalOpen(false);
                    setErrorMessage('');
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#F38B21] to-amber-500 text-white text-xs font-bold shadow-md hover:brightness-105 transition-all cursor-pointer"
                >
                  Verifikasi & Selesai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
