import React, { useState } from 'react';
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
  Sparkles,
  ShieldCheck,
  CreditCard,
  Plus,
} from 'lucide-react';

interface CheckoutScreenProps {
  cart: CartItem[];
  user: { name: string; nim: string; campus: string };
  onGoBack: () => void;
  onConfirmOrder: (newOrder: Order) => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  cart,
  user,
  onGoBack,
  onConfirmOrder,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<string>('09:00 - 09:10 WIB');
  const [showSlotDropdown, setShowSlotDropdown] = useState(false);

  // Buddy toggle & modes
  const [isBuddyEnabled, setIsBuddyEnabled] = useState(true);
  const [buddyMode, setBuddyMode] = useState<'ask' | 'be'>('ask');

  // "Ask a Buddy" selections
  const [deliveryLocation, setDeliveryLocation] = useState<string>('Atrium Lt. 1');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedBuddy, setSelectedBuddy] = useState<Buddy>(MOCK_BUDDIES[0]);

  // "Be a Buddy" peer requests
  const [peerRequests, setPeerRequests] = useState<PeerRequest[]>(MOCK_PEER_REQUESTS);

  // Item custom note
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({
    'menu-soto': 'Tanpa sambal, kuah dipisah',
  });

  const cartSubtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const platformFee = Math.round(cartSubtotal * 0.05);
  const buddyFee = isBuddyEnabled && buddyMode === 'ask' ? 2000 : 0;

  // Earnings if user is "Be a Buddy"
  const buddyEarnings =
    isBuddyEnabled && buddyMode === 'be'
      ? peerRequests.filter((r) => r.selected).reduce((sum, r) => sum + r.fee, 0)
      : 0;

  const totalPayment = cartSubtotal + platformFee + buddyFee;

  const togglePeerRequest = (id: string) => {
    setPeerRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, selected: !req.selected } : req))
    );
  };

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
      buddyMode: isBuddyEnabled ? buddyMode : undefined,
      buddy: isBuddyEnabled && buddyMode === 'ask' ? selectedBuddy : undefined,
      pickupLocation: 'Kantin Utama, Lt. 1',
      dropLocation: isBuddyEnabled && buddyMode === 'ask' ? deliveryLocation : undefined,
      status: 'created',
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
      <StatusBar theme="dark" />

      {/* Header */}
      <div className="px-5 py-3 bg-white border-b border-slate-100 flex items-center justify-between shadow-2xs">
        <button
          type="button"
          onClick={onGoBack}
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
          Pesanan Saya
        </h1>
        <div className="w-10" />
      </div>

      {/* Scrollable Form Body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-28">
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
                  placeholder="Notes (optional) - Example : tanpa sambal"
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

        {/* Slot Waktu Pengambilan (Figma: Pilih Slot Waktu Pengambilan) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#F38B21]" />
              <span>Pilih Slot Waktu Pengambilan</span>
            </label>
            <span className="text-[10px] text-slate-400">10 menit per slot</span>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSlotDropdown(!showSlotDropdown)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs font-semibold text-slate-800 hover:border-[#F38B21] transition-all cursor-pointer"
            >
              <span>{selectedSlot}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showSlotDropdown ? 'rotate-180' : ''}`} />
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

        {/* Feature: ORDER BUDDY (Figma Frames: 43:2045, 88:1104, 88:1239) */}
        <div className="bg-white rounded-3xl p-4 border border-orange-200/90 shadow-sm relative overflow-hidden">
          {/* Header & Toggle */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#F38B21] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-slate-900 leading-tight">
                  Aktifkan fitur Buddy
                </h3>
                <p className="text-[10px] text-slate-500">
                  Titip pesan antar sesama mahasiswa BINUS
                </p>
              </div>
            </div>

            {/* Toggle switch (Figma: _Toggle base) */}
            <button
              type="button"
              role="switch"
              aria-checked={isBuddyEnabled}
              onClick={() => setIsBuddyEnabled(!isBuddyEnabled)}
              className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                isBuddyEnabled ? 'bg-[#F38B21]' : 'bg-slate-300'
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
            <div className="pt-3 space-y-3 animate-fadeIn">
              {/* Tabs: Ask a Buddy vs Be a Buddy */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setBuddyMode('ask')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    buddyMode === 'ask'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Ask a Buddy
                </button>
                <button
                  type="button"
                  onClick={() => setBuddyMode('be')}
                  className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    buddyMode === 'be'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Be a Buddy
                </button>
              </div>

              {/* MODE 1: ASK A BUDDY */}
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
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs font-medium text-slate-800 hover:border-[#F38B21] transition-all cursor-pointer"
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

                  {/* List of Available Buddies (Figma Frame 88:1104: Valencia, Leon W.) */}
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

                  {/* Buddy Notice */}
                  <div className="p-2.5 rounded-xl bg-orange-50/80 border border-orange-200/50 flex items-start gap-2 text-[11px] text-slate-600">
                    <Info className="w-4 h-4 text-[#F38B21] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800">
                        Note: Biaya layanan Buddy adalah Rp 2.000/orang.
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Menunggu pesanan... tersisa 5 menit, maksimal 4 orang dalam 1 kloter pengantaran.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 2: BE A BUDDY (Earn commission) */}
              {buddyMode === 'be' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-200 text-xs">
                    <div className="flex items-center justify-between font-bold text-emerald-900">
                      <span>Komisi Tambahanmu</span>
                      <span className="text-sm font-extrabold text-emerald-700 tabular-nums">
                        +Rp {buddyEarnings.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <p className="text-[10px] text-emerald-700 mt-1">
                      Kamu sedang menuju ke kantin? Bantu bawa pesanan temanmu sekalian jalan untuk dapat tip Rp 2.000 per orang!
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                      Permintaan Titipan Teman Kampus (Frame 5161)
                    </span>

                    <div className="space-y-2">
                      {peerRequests.map((req) => (
                        <div
                          key={req.id}
                          onClick={() => togglePeerRequest(req.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            req.selected
                              ? 'border-emerald-500 bg-emerald-50/30 shadow-xs'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">
                                {req.studentName}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                                Antar ke: {req.dropLocation}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-1">
                              Rangkuman Pesanan:{' '}
                              <span className="font-semibold text-slate-700">
                                {req.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-emerald-600 tabular-nums">
                              +Rp {req.fee.toLocaleString('id-ID')}
                            </span>
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                                req.selected
                                  ? 'border-emerald-600 bg-emerald-600 text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {req.selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Total Payment Breakdown (Figma Frame 43:1380) */}
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

          <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
            <span className="font-bold text-slate-900 text-sm">Total harga</span>
            <span className="text-base font-extrabold text-[#F38B21] tabular-nums">
              Rp {totalPayment.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Checkout Action */}
      <div className="absolute bottom-4 left-4 right-4 z-30 animate-slideUp">
        <button
          type="button"
          onClick={handleCheckout}
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#F38B21] to-[#FC9B3B] text-white font-bold text-sm shadow-xl shadow-orange-500/25 active:scale-98 transition-all cursor-pointer flex items-center justify-between px-5 hover:brightness-105"
        >
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span>Konfirmasi & Bayar</span>
          </div>
          <span className="text-base font-black tabular-nums">
            Rp {totalPayment.toLocaleString('id-ID')}
          </span>
        </button>
      </div>
    </div>
  );
};
