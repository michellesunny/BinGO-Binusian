import React, { useState, useEffect } from 'react';
import { StatusBar } from './StatusBar';
import { CartItem, Buddy, PeerRequest, Order } from '../types';
import {
  MOCK_BUDDIES,
  MOCK_PEER_REQUESTS,
  TIME_SLOTS,
  CAMPUS_LOCATIONS,
} from '../data/mockData';
import {
  ArrowLeft,
  Clock,
  MapPin,
  Users,
  Star,
  Check,
  Info,
  ChevronDown,
} from 'lucide-react';

interface CheckoutScreenProps {
  cart: CartItem[];
  user: { name: string; nim: string; campus: string; role?: 'pemesan' | 'buddy' };
  onGoBack: () => void;
  onConfirmOrder: (newOrder: Order) => void;
  incomingPeerRequests?: PeerRequest[];
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  cart,
  user,
  onGoBack,
  onConfirmOrder,
  incomingPeerRequests,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<string>('09:00 - 09:10 WIB');
  const [showSlotDropdown, setShowSlotDropdown] = useState(false);

  // Buddy toggle & modes: defaults according to user profile
  const [isBuddyEnabled, setIsBuddyEnabled] = useState(true);
  const [buddyMode, setBuddyMode] = useState<'ask' | 'be'>(user.role === 'buddy' ? 'be' : 'ask');

  // "Ask a Buddy" selections
  const [deliveryLocation, setDeliveryLocation] = useState<string>('Atrium Lt. 1');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedBuddy, setSelectedBuddy] = useState<Buddy>(MOCK_BUDDIES[0]);

  // "Be a Buddy" current location and incoming requests
  const [currentLocation, setCurrentLocation] = useState<string>('Atrium Lt. 1');
  const [showCurrentLocationDropdown, setShowCurrentLocationDropdown] = useState(false);
  const [peerRequests] = useState<PeerRequest[]>(() => {
    if (incomingPeerRequests && incomingPeerRequests.length > 0) {
      return [...incomingPeerRequests, ...MOCK_PEER_REQUESTS.filter((m) => !incomingPeerRequests.some((i) => i.studentName === m.studentName))].slice(0, 4);
    }
    return MOCK_PEER_REQUESTS;
  });

  // Countdown timer for Be a Buddy waiting pool (5 minutes = 300 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(300);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Item custom note
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({
    'menu-soto': 'Tanpa sambal, kuah dipisah',
  });

  const cartSubtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const platformFee = Math.round(cartSubtotal * 0.05);
  const buddyFee = isBuddyEnabled && buddyMode === 'ask' ? 2000 : 0;

  // Earnings if user is "Be a Buddy": 2.000 setiap 1 kali pengantaran (bukan per orang)
  const buddyEarnings = isBuddyEnabled && buddyMode === 'be' ? 2000 : 0;

  const totalPayment = cartSubtotal + platformFee + buddyFee;

  const handleCheckout = () => {
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber: 'ORDER 001',
      nim: user.nim,
      customerName: user.name,
      vendorId: 'kedai-selan',
      vendorName: 'Kedai Selan',
      items: cart,
      subtotal: cartSubtotal,
      platformFee: platformFee,
      buddyFee: buddyFee,
      total: totalPayment,
      pickupSlot: selectedSlot.replace(' WIB', ''),
      isBuddyEnabled: isBuddyEnabled,
      isBuddyOrder: isBuddyEnabled && buddyMode === 'be',
      buddyMode: isBuddyEnabled ? buddyMode : undefined,
      buddy: isBuddyEnabled && buddyMode === 'ask' ? selectedBuddy : undefined,
      peerRequests: isBuddyEnabled && buddyMode === 'be' ? peerRequests : undefined,
      buddyEarnings: isBuddyEnabled && buddyMode === 'be' ? 2000 : 0,
      pickupLocation: 'Kantin Utama, Lt. 1',
      dropLocation: isBuddyEnabled && buddyMode === 'ask' ? deliveryLocation : (isBuddyEnabled && buddyMode === 'be' ? currentLocation : undefined),
      status: 'created',
      verificationCode: String(Math.floor(1000 + Math.random() * 9000)),
      date: new Date().toLocaleDateString('id-ID'),
      timeline: [
        { status: 'Pesanan dibuat', time: 'Baru saja', done: true, active: true },
        { status: 'Pesanan disiapkan vendor', time: 'Menunggu', done: false, active: false },
        {
          status: isBuddyEnabled && buddyMode === 'ask' ? `Diambil oleh Buddy (${selectedBuddy.name})` : 'Siap diambil di vendor',
          time: 'Estimasi 09.05',
          done: false,
          active: false,
        },
        { status: 'Pesanan sampai / selesai', time: 'Estimasi 09.10', done: false, active: false },
      ],
    };

    onConfirmOrder(newOrder);
  };

  return (
    <div className="relative flex-1 flex flex-col h-full bg-slate-50 text-slate-900 select-none overflow-hidden">
      {/* Sticky Header with white background covering StatusBar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-2xs shrink-0">
        <StatusBar theme="dark" />
        <div className="px-5 pt-1.5 pb-3 flex items-center justify-between min-h-[58px]">
          <button
            type="button"
            onClick={onGoBack}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer -ml-2"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
            Pesanan Saya
          </h1>
          <div className="w-8" />
        </div>
      </header>

      {/* Scrollable Form Body */}
      <div className="flex-1 overflow-y-auto min-h-0 px-5 py-4 space-y-4 pb-28">
        {/* Pilih Slot Waktu Pengambilan (Matches Wireframe in image.png) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-700" />
            <span>Pilih Slot Waktu Pengambilan</span>
          </label>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSlotDropdown(!showSlotDropdown)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs font-medium text-slate-700 hover:border-slate-400 transition-all cursor-pointer shadow-2xs"
            >
              <span className="text-slate-500">{selectedSlot || 'Pilih rentang waktu ambil pesanan'}</span>
              <div className="w-5 h-2.5 rounded-full bg-slate-300" />
            </button>

            {showSlotDropdown && (
              <div className="absolute top-12 left-0 right-0 max-h-48 overflow-y-auto bg-white rounded-xl shadow-xl border border-slate-200 z-40 py-1 divide-y divide-slate-100">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      setSelectedSlot(slot);
                      setShowSlotDropdown(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs font-medium hover:bg-orange-50 transition-colors flex items-center justify-between cursor-pointer ${
                      selectedSlot === slot ? 'text-[#F38B21] font-bold bg-orange-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{slot}</span>
                    {selectedSlot === slot && <Check className="w-3.5 h-3.5 text-[#F38B21]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Feature: BUDDY FEATURE (Matches image.png) */}
        <div className="space-y-3 pt-1">
          {/* Header & Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-900">
                Aktifkan fitur Buddy
              </h3>
              <Info className="w-4 h-4 text-slate-400 cursor-pointer" />
            </div>

            {/* iOS style Toggle Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={isBuddyEnabled}
              onClick={() => setIsBuddyEnabled(!isBuddyEnabled)}
              className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                isBuddyEnabled ? 'bg-[#5B7BF5]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                  isBuddyEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {isBuddyEnabled && (
            <div className="space-y-3">
              {/* Tab Navigation: Be a Buddy vs Ask a Buddy (Matches image.png) */}
              <div className="flex border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setBuddyMode('be')}
                  className={`flex-1 py-2 text-xs font-bold text-center transition-all cursor-pointer ${
                    buddyMode === 'be'
                      ? 'text-slate-900 border-b-2 border-blue-600'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Be a Buddy
                </button>
                <button
                  type="button"
                  onClick={() => setBuddyMode('ask')}
                  className={`flex-1 py-2 text-xs font-bold text-center transition-all cursor-pointer ${
                    buddyMode === 'ask'
                      ? 'text-slate-900 border-b-2 border-blue-600'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Ask a Buddy
                </button>
              </div>

              {/* MODE 1: BE A BUDDY (Matches image.png layout) */}
              {buddyMode === 'be' && (
                <div className="space-y-3.5">
                  {/* Location Selector: "Pilih lokasimu saat ini" */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-slate-700 whitespace-nowrap">
                      Pilih lokasimu saat ini
                    </span>
                    <div className="relative flex-1 max-w-[200px]">
                      <button
                        type="button"
                        onClick={() => setShowCurrentLocationDropdown(!showCurrentLocationDropdown)}
                        className="w-full h-8 px-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs text-slate-800 hover:border-slate-400 transition-all cursor-pointer"
                      >
                        <span className="truncate">{currentLocation}</span>
                        <div className="w-4 h-2 rounded-full bg-slate-300 shrink-0 ml-1" />
                      </button>

                      {showCurrentLocationDropdown && (
                        <div className="absolute top-9 right-0 w-48 bg-white rounded-xl shadow-lg border border-slate-200 z-40 py-1 divide-y divide-slate-100">
                          {CAMPUS_LOCATIONS.map((loc) => (
                            <button
                              key={loc}
                              type="button"
                              onClick={() => {
                                setCurrentLocation(loc);
                                setShowCurrentLocationDropdown(false);
                              }}
                              className={`w-full px-3 py-2 text-left text-xs hover:bg-orange-50 transition-colors flex items-center justify-between cursor-pointer ${
                                currentLocation === loc ? 'text-[#F38B21] font-bold bg-orange-50/50' : 'text-slate-700'
                              }`}
                            >
                              <span>{loc}</span>
                              {currentLocation === loc && <Check className="w-3.5 h-3.5 text-[#F38B21]" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Main Waiting Card (Matches image.png) */}
                  <div className="bg-[#F8F9FA] rounded-[32px] p-8 border border-slate-200/50 min-h-[300px] flex flex-col items-center justify-between text-center shadow-xs">
                    <div className="my-auto flex flex-col items-center">
                      <h4 className="text-base font-bold text-slate-900 tracking-tight">
                        Menunggu pesanan...
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 mb-6 font-normal">
                        maksimal 4 orang
                      </p>

                      {/* Row of circular student avatars (Matches image.png with 4 avatars) */}
                      <div className="flex items-center justify-center -space-x-1.5">
                        {peerRequests.slice(0, 4).map((peer) => (
                          <div
                            key={peer.id}
                            className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-200/60 bg-slate-100"
                            title={`${peer.studentName} • ${peer.dropLocation}`}
                          >
                            <img
                              src={peer.avatar}
                              alt={peer.studentName}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{peerRequests.length} orang menitip padamu</span>
                      </div>
                    </div>

                    {/* Countdown text at bottom */}
                    <div className="text-xs text-slate-400 font-medium tracking-wide">
                      tersisa 5 menit ({formatCountdown(secondsRemaining)})
                    </div>
                  </div>

                  {/* Note Komisi Tambahan: Rp 2.000 setiap 1 kali pengantaran (bukan per orang) */}
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs">
                    <div className="flex items-center justify-between font-bold text-emerald-900">
                      <span>Komisi Tambahanmu</span>
                      <span className="text-sm font-extrabold text-emerald-700 tabular-nums">
                        +Rp 2.000
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-700 mt-1 leading-relaxed">
                      Kamu akan mendapatkan komisi Rp 2.000 setiap 1 kali pengantaran (maksimal 4 orang 1 kloter).
                    </p>
                  </div>
                </div>
              )}

              {/* MODE 2: ASK A BUDDY */}
              {buddyMode === 'ask' && (
                <div className="space-y-3">
                  {/* Delivery Location dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Pilih lokasi antar
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs font-medium text-slate-800 hover:border-[#F38B21] transition-all cursor-pointer shadow-2xs"
                      >
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#F38B21]" />
                          {deliveryLocation}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      {showLocationDropdown && (
                        <div className="absolute top-11 left-0 right-0 bg-white rounded-xl shadow-lg border border-slate-200 z-40 py-1 divide-y divide-slate-100">
                          {CAMPUS_LOCATIONS.map((loc) => (
                            <button
                              key={loc}
                              type="button"
                              onClick={() => {
                                setDeliveryLocation(loc);
                                setShowLocationDropdown(false);
                              }}
                              className={`w-full px-3 py-2 text-left text-xs hover:bg-orange-50 transition-colors flex items-center justify-between cursor-pointer ${
                                deliveryLocation === loc ? 'text-[#F38B21] font-bold bg-orange-50/50' : 'text-slate-700'
                              }`}
                            >
                              <span>{loc}</span>
                              {deliveryLocation === loc && <Check className="w-3.5 h-3.5 text-[#F38B21]" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* List of Available Buddies */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-slate-700">
                        Buddy Tersedia di Sekitarmu
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        Live
                      </span>
                    </div>

                    <div className="space-y-2">
                      {MOCK_BUDDIES.map((buddy) => {
                        const isSelected = selectedBuddy.id === buddy.id;
                        return (
                          <div
                            key={buddy.id}
                            onClick={() => setSelectedBuddy(buddy)}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'border-[#F38B21] bg-orange-50/40 shadow-xs'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                <img
                                  src={buddy.avatar}
                                  alt={buddy.name}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                              </div>

                              <div>
                                <div className="flex items-center gap-1.5">
                                  <h4 className="text-xs font-bold text-slate-900">
                                    {buddy.name}
                                  </h4>
                                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                                    {buddy.location}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                                  {buddy.rating ? (
                                    <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                                      <Star className="w-3 h-3 fill-current" />
                                      {buddy.rating}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400">Belum ada review</span>
                                  )}
                                  <span>•</span>
                                  <span className="text-emerald-700 font-semibold">
                                    {buddy.activeMinutesText}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                                isSelected
                                  ? 'border-[#F38B21] bg-[#F38B21] text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ask a Buddy Note requested: "Maksimal 4 orang 1 kloter pengantaran" */}
                  <div className="p-2.5 rounded-xl bg-orange-50/80 border border-orange-200/50 flex items-center gap-2 text-xs text-slate-700">
                    <Info className="w-4 h-4 text-[#F38B21] shrink-0" />
                    <p className="font-semibold text-slate-800">
                      Maksimal 4 orang 1 kloter pengantaran
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Ordered items breakdown */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Menu Dipesan
          </div>

          {cart.map((item) => (
            <div key={item.menuItem.id} className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-orange-100 text-[#F38B21] flex items-center justify-center text-xs font-bold">
                    {item.quantity}x
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    {item.menuItem.name}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                  Rp {(item.menuItem.price * item.quantity).toLocaleString('id-ID')}
                </span>
              </div>

              {/* Notes Input */}
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Notes (optional) - Contoh: tanpa sambal"
                  value={itemNotes[item.menuItem.id] || ''}
                  onChange={(e) =>
                    setItemNotes({ ...itemNotes, [item.menuItem.id]: e.target.value })
                  }
                  className="w-full text-[11px] px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/70 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#F38B21] focus:bg-white transition-all"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Total Payment Breakdown */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2 text-xs">
          <h3 className="font-bold text-slate-900 mb-2">Total Payment</h3>

          <div className="flex justify-between text-slate-500">
            <span>Order Subtotal</span>
            <span className="font-semibold text-slate-700 tabular-nums">
              Rp {cartSubtotal.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex justify-between text-slate-500">
            <span>Platform Fee (5%)</span>
            <span className="font-semibold text-slate-700 tabular-nums">
              Rp {platformFee.toLocaleString('id-ID')}
            </span>
          </div>

          {isBuddyEnabled && buddyMode === 'ask' && (
            <div className="flex justify-between text-slate-500">
              <span className="flex items-center gap-1">
                <span>Biaya Layanan Buddy</span>
                <span className="text-[10px] text-[#F38B21] font-bold">({selectedBuddy.name})</span>
              </span>
              <span className="font-semibold text-slate-700 tabular-nums">
                Rp {buddyFee.toLocaleString('id-ID')}
              </span>
            </div>
          )}

          {isBuddyEnabled && buddyMode === 'be' && (
            <div className="flex justify-between text-emerald-700 font-semibold pt-1 border-t border-slate-100">
              <span>Potensi Komisi Tambahan Buddy</span>
              <span className="tabular-nums">+Rp 2.000</span>
            </div>
          )}

          <div className="border-t border-slate-100 pt-2 flex justify-between font-extrabold text-sm text-slate-900">
            <span>Total Pembayaran</span>
            <span className="text-[#F38B21] tabular-nums">
              Rp {totalPayment.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>

      {/* Floating Bottom Bar (Matches image.png: 1 item | Rp 12.600 >>> [Checkout]) */}
      <div className="sticky bottom-2 left-0 right-0 px-4 py-2 z-30 shrink-0">
        <div className="bg-gradient-to-r from-[#F5A623] to-[#E68A00] rounded-2xl px-5 py-3 shadow-lg flex items-center justify-between text-white border border-amber-300/40">
          <div>
            <span className="text-[11px] text-white/90 block font-medium leading-tight">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} item
            </span>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight">
                Rp {totalPayment.toLocaleString('id-ID')}
              </span>
              <span className="text-xs font-bold text-white/80 tracking-widest">&gt;&gt;&gt;</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            className="px-6 py-2.5 rounded-xl bg-white text-slate-900 font-extrabold text-xs shadow-md hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};
