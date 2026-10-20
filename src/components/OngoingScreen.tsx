import React, { useState } from 'react';
import { StatusBar } from './StatusBar';
import { BingoLogo } from './BingoLogo';
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
  Star,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  Lock,
  ArrowRight,
} from 'lucide-react';

interface OngoingScreenProps {
  order: Order | null;
  onViewTicket: () => void;
  onAdvanceTimeline?: () => void;
  onResetOrder?: () => void;
  onVerifyCompletionCode?: (code: string, autoRedirect?: boolean) => boolean;
  onGoToHistory?: () => void;
  userRole?: 'pemesan' | 'buddy';
}

export const OngoingScreen: React.FC<OngoingScreenProps> = ({
  order,
  onViewTicket,
  onAdvanceTimeline,
  onResetOrder,
  onVerifyCompletionCode,
  onGoToHistory,
  userRole = 'pemesan',
}) => {
  const [buddyRating, setBuddyRating] = useState<number>(5);
  const [buddyComment, setBuddyComment] = useState<string>('');
  const [isBuddyReviewSubmitted, setIsBuddyReviewSubmitted] = useState<boolean>(false);
  const [handoverCodeInput, setHandoverCodeInput] = useState<string>('');
  const [handoverError, setHandoverError] = useState<string>('');
  const [isHandoverVerified, setIsHandoverVerified] = useState<boolean>(false);

  const isCompleted =
    order?.status === 'completed' ||
    order?.status === 'selesai' ||
    Boolean(order?.timeline && order.timeline.length > 0 && order.timeline.every((t) => t.done));

  const isBuddyOrder = Boolean(
    order?.buddy ||
    order?.isBuddyOrder ||
    order?.isBuddyEnabled ||
    order?.buddyLeadName
  );

  const buddyName = order?.buddy?.name || order?.buddyLeadName || 'Valencia (Buddy)';
  const expectedVerificationCode = order?.verificationCode || '8492';

  const isLastStepActive = Boolean(
    order?.timeline &&
    order.timeline.length > 0 &&
    order.timeline[order.timeline.length - 1].active
  );

  const isAtHandoverStage = isCompleted || isLastStepActive;

  const handleVerifyHandover = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = handoverCodeInput.trim().toUpperCase();
    if (!cleanCode) {
      setHandoverError('Silakan masukkan 4 digit kode serah terima.');
      return;
    }

    if (cleanCode === expectedVerificationCode.trim().toUpperCase()) {
      setIsHandoverVerified(true);
      setHandoverError('');
      if (onVerifyCompletionCode) {
        onVerifyCompletionCode(cleanCode, false);
      }
    } else {
      setHandoverError(`Kode tidak sesuai. Minta kode 4 digit pada layar ${buddyName}.`);
    }
  };

  const completedCustomerReviews = [
    {
      id: 'rev-c1',
      author: order?.customerName || 'Amelia Angelica',
      roleLabel: userRole === 'buddy' ? 'Pemesan Utama' : 'Ulasan Kamu',
      rating: 5.0,
      comment: 'Makanan sampai tepat waktu, kemasan rapi dan masih hangat! Terima kasih banyak!',
      timeAgo: 'Baru saja',
    },
    {
      id: 'rev-c2',
      author: 'Michelley',
      roleLabel: 'Titip Pesanan',
      rating: 5.0,
      comment: 'Sangat terbantu ada titip pesanan pas lagi kelas di lantai atas. Pelayanan ramah!',
      timeAgo: '5 menit lalu',
    },
    {
      id: 'rev-c3',
      author: 'Raychelley',
      roleLabel: 'Titip Pesanan',
      rating: 4.8,
      comment: 'Pesanan sesuai dan cepat diantar sampai depan ruangan.',
      timeAgo: '15 menit lalu',
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto min-h-0 bg-slate-50 text-slate-900 select-none pb-6">
      {/* Sticky Header with white background covering StatusBar */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-100 shadow-2xs">
        <StatusBar theme="dark" />
        <div className="px-5 pt-1.5 pb-3 flex items-center justify-between min-h-[58px]">
          <div>
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-snug">
              Ongoing Order
            </h1>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">
              Lacak status persiapan & pengantaran pesananmu
            </p>
          </div>
          <div className="flex items-center">
            <BingoLogo size="md" />
          </div>
        </div>
      </header>

      <div className="px-5 pt-4 space-y-4">
        {order ? (
          <>
            {/* Order Card Container */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
              {/* Header inside card */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900">
                      {order.vendorName || 'Kedai Selan'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-[#387CB7] font-bold">
                      {order.pickupSlot || order.pickupTime || 'Istirahat 1'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    No. Struk: {order.orderNumber || order.receiptNo}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onViewTicket}
                  className="px-2.5 py-1.5 rounded-xl bg-orange-50 text-[#F38B21] hover:bg-orange-100 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <span>Bukti Tiket</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Items summary */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Rangkuman Menu
                </span>
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between font-medium">
                    <span className="text-slate-800">
                      {item.menuItem?.name || item.name} <span className="text-slate-400">x{item.quantity}</span>
                    </span>
                    <span className="tabular-nums font-bold text-slate-900">
                      Rp {((item.menuItem?.price || item.price) * item.quantity).toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Timeline Tracker */}
              <div className="pt-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Status Pengantaran
                </h3>

                <div className="space-y-4 relative pl-7 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {(order.timeline || [
                    { status: 'Pesanan dibuat', time: 'Baru saja', done: true, active: true },
                    { status: 'Pesanan disiapkan vendor', time: 'Menunggu', done: false, active: false },
                    { status: 'Siap diambil di vendor', time: 'Estimasi 09.05', done: false, active: false },
                    { status: 'Pesanan selesai', time: 'Estimasi 09.10', done: false, active: false },
                  ]).map((step, idx) => {
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

              {/* Review & Rating Section Saat Pesanan Selesai / Tahap Serah Terima */}
              {isAtHandoverStage && (
                <div className="pt-4 border-t border-slate-100 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {userRole === 'pemesan' ? (
                    isBuddyOrder ? (
                      /* Pemesan dengan pesanan Buddy: Harus masukkan kode serah terima dulu sebelum review */
                      !isHandoverVerified ? (
                        /* Form Masukkan Kode Serah Terima */
                        <div className="p-4 rounded-3xl bg-blue-50/40 border-2 border-blue-200/90 shadow-xs space-y-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-[#135381] flex items-center justify-center font-bold shadow-2xs shrink-0">
                              <KeyRound className="w-5 h-5" />
                            </div>
                            <div className="leading-tight">
                              <span className="text-[10px] font-bold text-[#135381] uppercase tracking-wider block">
                                Konfirmasi Penerimaan
                              </span>
                              <h4 className="text-xs font-extrabold text-slate-900 mt-0.5">
                                Masukkan Kode Serah Terima
                              </h4>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 leading-snug">
                            Minta 4 digit kode serah terima dari Buddy ({buddyName}) untuk konfirmasi makanan telah sampai.
                          </p>

                          <form onSubmit={handleVerifyHandover} className="space-y-2.5">
                            <div className="space-y-1">
                              <input
                                type="text"
                                maxLength={6}
                                value={handoverCodeInput}
                                onChange={(e) => {
                                  setHandoverCodeInput(e.target.value);
                                  setHandoverError('');
                                }}
                                placeholder="Ketik 4 Digit Kode"
                                className="w-full py-3 px-4 text-center text-xl font-mono font-black tracking-widest rounded-2xl border-2 border-blue-200 focus:outline-none focus:border-blue-600 bg-white text-slate-900 placeholder:text-slate-300 placeholder:font-normal placeholder:tracking-normal placeholder:text-xs shadow-inner"
                              />

                              {handoverError && (
                                <p className="text-[11px] text-rose-600 font-semibold flex items-center justify-center gap-1 pt-0.5">
                                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                  <span>{handoverError}</span>
                                </p>
                              )}
                            </div>

                            {/* Tombol Isi Otomatis */}
                            <div className="flex justify-end pt-0.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setHandoverCodeInput(expectedVerificationCode);
                                  setHandoverError('');
                                }}
                                className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                              >
                                Isi Otomatis
                              </button>
                            </div>

                            <button
                              type="submit"
                              className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-[#135381] hover:brightness-105 active:scale-98 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <ShieldCheck className="w-4 h-4" />
                              <span>Verifikasi Kode &amp; Buka Review Buddy</span>
                            </button>
                          </form>
                        </div>
                      ) : (
                        /* Kode telah terverifikasi: Tampilkan badge sukses & form review bernuansa oranye/amber */
                        <div className="space-y-3">
                          {/* Success Handover Banner */}
                          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between shadow-2xs">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-5 h-5" />
                              </div>
                              <div>
                                <span className="text-xs font-bold block text-emerald-900">
                                  Serah Terima Berhasil Terverifikasi!
                                </span>
                                <span className="text-[10px] text-emerald-700">
                                  Kode {expectedVerificationCode} cocok. Makanan telah resmi diterima dari {buddyName}.
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Header Review */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                Beri Rating &amp; Review Buddy
                              </h4>
                            </div>
                            {isBuddyReviewSubmitted && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Terkirim
                              </span>
                            )}
                          </div>

                          {isBuddyReviewSubmitted ? (
                            <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-orange-100 text-[#F38B21] flex items-center justify-center font-bold text-xs">
                                    {order.customerName ? order.customerName[0].toUpperCase() : 'A'}
                                  </div>
                                  <div>
                                    <span className="text-xs font-bold text-slate-900">Ulasan Kamu</span>
                                    <span className="text-[10px] text-slate-400 block">Untuk {buddyName}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-white px-2 py-0.5 rounded-lg border border-amber-200 shadow-2xs">
                                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                  <span>{buddyRating.toFixed(1)}</span>
                                </div>
                              </div>

                              <p className="text-xs text-slate-700 leading-snug">
                                "{buddyComment || 'Makanan sampai tepat waktu, kemasan rapi dan masih hangat! Terima kasih banyak!'}"
                              </p>

                              <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 border-t border-amber-200/50">
                                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Ulasan tersimpan
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setIsBuddyReviewSubmitted(false)}
                                  className="text-[#F38B21] font-bold hover:underline cursor-pointer"
                                >
                                  Ubah Ulasan
                                </button>
                              </div>

                              {onGoToHistory && (
                                <button
                                  type="button"
                                  onClick={onGoToHistory}
                                  className="w-full mt-2 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <span>Lihat Riwayat Pesanan</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                              <div className="text-center space-y-0.5">
                                <p className="text-xs font-bold text-slate-800">
                                  Bagaimana pengantaran oleh {buddyName}?
                                </p>
                                <p className="text-[10px] text-slate-400">
                                  Beri penilaian bintang dan ulasan untuk buddy kamu
                                </p>
                              </div>

                              {/* Star Selector */}
                              <div className="flex justify-center items-center gap-2 py-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setBuddyRating(star)}
                                    className="p-1 cursor-pointer transition-transform hover:scale-125 active:scale-95"
                                  >
                                    <Star
                                      className={`w-7 h-7 ${
                                        star <= buddyRating
                                          ? 'fill-amber-400 text-amber-500'
                                          : 'fill-slate-100 text-slate-300'
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                              <div className="text-center">
                                <span className="text-xs font-bold text-amber-600">
                                  {buddyRating === 5 && '⭐️ Sangat Memuaskan (5.0)'}
                                  {buddyRating === 4 && '⭐️ Memuaskan (4.0)'}
                                  {buddyRating === 3 && '⭐️ Cukup Baik (3.0)'}
                                  {buddyRating === 2 && '⭐️ Kurang Memuaskan (2.0)'}
                                  {buddyRating === 1 && '⭐️ Sangat Kurang (1.0)'}
                                </span>
                              </div>

                              {/* Quick Tags */}
                              <div className="flex flex-wrap gap-1.5 justify-center pt-0.5">
                                {['Tepat Waktu', 'Makanan Hangat', 'Sangat Ramah', 'Komunikatif', 'Kemasan Rapi'].map((tag) => (
                                  <button
                                    key={tag}
                                    type="button"
                                    onClick={() => {
                                      if (!buddyComment.includes(tag)) {
                                        setBuddyComment((prev) => (prev ? `${prev}, ${tag.toLowerCase()}` : tag));
                                      }
                                    }}
                                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-50 hover:bg-orange-50 hover:text-[#F38B21] border border-slate-200 text-slate-600 transition-colors cursor-pointer"
                                  >
                                    + {tag}
                                  </button>
                                ))}
                              </div>

                              {/* Textarea */}
                              <textarea
                                rows={2}
                                value={buddyComment}
                                onChange={(e) => setBuddyComment(e.target.value)}
                                placeholder="Tulis ulasan untuk Buddy pengantar..."
                                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F38B21] focus:ring-1 focus:ring-[#F38B21] text-slate-800 placeholder:text-slate-400 resize-none"
                              />

                              {/* Submit Button */}
                              <button
                                type="button"
                                onClick={() => setIsBuddyReviewSubmitted(true)}
                                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#F38B21] to-amber-500 hover:brightness-105 active:scale-98 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Star className="w-3.5 h-3.5 fill-white" />
                                <span>Kirim Ulasan &amp; Rating Buddy</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    ) : (
                      /* Pemesan tanpa Buddy (Ambil sendiri di kantin) */
                      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                        <h4 className="text-xs font-bold text-emerald-900">
                          Pesanan Selesai Diambil
                        </h4>
                        <p className="text-[11px] text-emerald-700">
                          Terima kasih telah mengambil pesanan Anda di kantin. Selamat menikmati makanan Anda!
                        </p>
                      </div>
                    )
                  ) : (
                    /* Bagian Buddy: Tampilkan review & rating dari para pemesan */
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Review & Rating dari Pemesan
                        </h4>
                      </div>

                      <div className="space-y-2">
                        {completedCustomerReviews.map((rev) => (
                          <div
                            key={rev.id}
                            className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/60 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900">{rev.author}</span>
                                <span className="text-[10px] text-slate-400">({rev.roleLabel})</span>
                              </div>
                              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-white px-2 py-0.5 rounded-lg border border-amber-200/80 shadow-2xs">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                <span>{rev.rating.toFixed(1)}</span>
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-700 leading-snug">
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
              )}

              {/* Buddy details if assigned - only shown for student/pemesan, NOT for the buddy themselves */}
              {order.buddy && userRole !== 'buddy' && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50/50 border border-orange-200/70 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden border border-orange-300 shrink-0">
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
            <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-2">
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
