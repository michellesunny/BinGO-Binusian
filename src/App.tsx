/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  MOCK_USER,
  MOCK_VENDORS,
  INITIAL_ACTIVE_ORDER,
  MOCK_HISTORY_ORDERS,
} from './data/mockData';
import { Vendor, MenuItem, CartItem, Order, ReviewItem } from './types';
import { SplashScreen } from './components/SplashScreen';
import { AuthScreens } from './components/AuthScreens';
import { HomeScreen } from './components/HomeScreen';
import { FoodListScreen } from './components/FoodListScreen';
import { CheckoutScreen } from './components/CheckoutScreen';
import { TicketScreen } from './components/TicketScreen';
import { OngoingScreen } from './components/OngoingScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { BottomNavBar, NavTab } from './components/BottomNavBar';
import { CalendarModal } from './components/CalendarModal';
import { FeedbackModal } from './components/FeedbackModal';
import { Toast, ToastMessage } from './components/Toast';
import {
  Smartphone,
  Maximize2,
  Minimize2,
  RefreshCw,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';

type AppView =
  | 'splash'
  | 'login'
  | 'signup'
  | 'home'
  | 'food-list'
  | 'checkout'
  | 'ticket'
  | 'ongoing'
  | 'history';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // Presentation State (Mobile Device Frame vs Responsive Fullscreen)
  const [isDeviceMockup, setIsDeviceMockup] = useState(true);

  // User State
  const [user, setUser] = useState(MOCK_USER);

  // Selected Vendor for Food List
  const [selectedVendor, setSelectedVendor] = useState<Vendor>(MOCK_VENDORS[0]);

  // Shopping Cart
  const [cart, setCart] = useState<CartItem[]>([
    {
      menuItem: MOCK_VENDORS[0].menu[0], // Soto Nusantara
      quantity: 1,
      notes: 'Tanpa seledri, kuah dipisah',
    },
  ]);

  // Active Ongoing Order
  const [activeOrder, setActiveOrder] = useState<Order | null>(INITIAL_ACTIVE_ORDER);

  // History Orders
  const [historyOrders, setHistoryOrders] = useState<Order[]>(MOCK_HISTORY_ORDERS);

  // Modals
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (title: string, description?: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({
      id: `${Date.now()}`,
      title,
      description,
      type,
    });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Cart operations
  const handleUpdateCart = (menuItem: MenuItem, delta: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.menuItem.id === menuItem.id);
      if (!existing) {
        if (delta > 0) {
          showToast('Menu Ditambahkan', `${menuItem.name} berhasil masuk keranjang.`);
          return [...prev, { menuItem, quantity: delta, notes: '' }];
        }
        return prev;
      }

      const newQty = existing.quantity + delta;
      if (newQty <= 0) {
        return prev.filter((item) => item.menuItem.id !== menuItem.id);
      }

      return prev.map((item) =>
        item.menuItem.id === menuItem.id ? { ...item, quantity: newQty } : item
      );
    });
  };

  // Switch Bottom Nav Tabs
  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'home') setCurrentView('home');
    else if (tab === 'ongoing') setCurrentView('ongoing');
    else if (tab === 'history') setCurrentView('history');
  };

  // Handle Checkout Confirmation
  const handleConfirmOrder = (newOrder: Order) => {
    setActiveOrder(newOrder);
    setCurrentView('ticket');
    showToast(
      'Pembayaran Masuk!',
      `Pesanan ${newOrder.orderNumber} berhasil dibuat dengan slot ${newOrder.pickupSlot}.`
    );
  };

  // Advance Ongoing Order Timeline (Interactive Simulator)
  const handleAdvanceTimeline = () => {
    if (!activeOrder) return;

    const timeline = [...activeOrder.timeline];
    const firstIncompleteIdx = timeline.findIndex((s) => !s.done);

    if (firstIncompleteIdx !== -1) {
      timeline[firstIncompleteIdx].done = true;
      timeline[firstIncompleteIdx].active = false;

      if (firstIncompleteIdx + 1 < timeline.length) {
        timeline[firstIncompleteIdx + 1].active = true;
        timeline[firstIncompleteIdx + 1].time = 'Baru saja';
        setActiveOrder({ ...activeOrder, timeline });
        showToast('Status Pesanan Diperbarui', timeline[firstIncompleteIdx + 1].status);
      } else {
        // Complete the order and move to history
        const completed: Order = {
          ...activeOrder,
          status: 'completed',
          timeline,
        };
        setActiveOrder(null);
        setHistoryOrders([completed, ...historyOrders]);
        setCurrentView('history');
        setActiveTab('history');
        showToast('Pesanan Selesai!', 'Terima kasih telah memesan melalui BinGO!');
      }
    }
  };

  // Reset Order (Demo Helper)
  const handleResetOrder = () => {
    setActiveOrder(INITIAL_ACTIVE_ORDER);
    showToast('Demo Direset', 'Pesanan aktif ORDER 001 telah direset.');
  };

  const handleReorder = (order: Order) => {
    setCart(order.items);
    setSelectedVendor(MOCK_VENDORS.find((v) => v.id === order.vendorId) || MOCK_VENDORS[0]);
    setCurrentView('checkout');
    showToast('Menu Ditambahkan', 'Item pesanan sebelumnya telah dimasukkan ke keranjang.');
  };

  // Screens where Bottom Bar is shown
  const isBottomBarVisible = ['home', 'ongoing', 'history'].includes(currentView);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-0 md:p-6 font-sans">
      {/* Toast Notification Container */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Desktop Toolbar: Switcher & Quick Screen Jumper */}
      <div className="w-full max-w-4xl mb-4 hidden md:flex items-center justify-between px-4 py-2.5 bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700 text-white shadow-xl text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>BinGO! Campus Prototype</span>
          </div>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300">
            Figma Design Frame: <strong className="text-white capitalize">{currentView}</strong>
          </span>
        </div>

        {/* Quick Nav jump buttons for reviewer */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(
            [
              { id: 'splash', label: 'Splash' },
              { id: 'login', label: 'Login/Sign Up' },
              { id: 'home', label: 'Home' },
              { id: 'food-list', label: 'Food List' },
              { id: 'checkout', label: 'Checkout' },
              { id: 'ticket', label: 'Bukti Tiket' },
              { id: 'ongoing', label: 'Ongoing' },
              { id: 'history', label: 'History' },
            ] as const
          ).map((screen) => (
            <button
              key={screen.id}
              type="button"
              onClick={() => {
                setCurrentView(screen.id);
                if (['home', 'ongoing', 'history'].includes(screen.id)) {
                  setActiveTab(screen.id as NavTab);
                }
              }}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                currentView === screen.id
                  ? 'bg-[#F38B21] text-white font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              {screen.label}
            </button>
          ))}

          <div className="h-4 w-px bg-slate-700 mx-1" />

          {/* Device Mockup Toggle */}
          <button
            type="button"
            onClick={() => setIsDeviceMockup(!isDeviceMockup)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isDeviceMockup
                ? 'border-[#387CB7] bg-[#387CB7]/20 text-[#6CA3D2]'
                : 'border-slate-700 text-slate-400 hover:text-white'
            }`}
            title={isDeviceMockup ? 'Full Width Mode' : 'iPhone Device Mockup'}
          >
            {isDeviceMockup ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Canvas Container (iPhone 16 Pro dimension: 402px x 874px aspect ratio or responsive fluid) */}
      <div
        className={`relative flex flex-col bg-white overflow-hidden transition-all duration-300 ${
          isDeviceMockup
            ? 'w-full max-w-[402px] h-[874px] rounded-[48px] shadow-[0_25px_70px_rgba(0,0,0,0.6)] border-[10px] border-slate-800 ring-1 ring-white/10'
            : 'w-full max-w-md h-screen md:h-[90vh] md:rounded-3xl shadow-2xl border border-slate-700'
        }`}
      >
        {/* VIEW ROUTING */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {currentView === 'splash' && (
            <SplashScreen
              onSignIn={() => setCurrentView('login')}
              onSignUp={() => setCurrentView('signup')}
              onExploreDirectly={() => {
                setCurrentView('home');
                setActiveTab('home');
              }}
            />
          )}

          {currentView === 'login' && (
            <AuthScreens
              initialView="login"
              onSuccess={(profile) => {
                if (profile) setUser({ ...user, ...profile });
                setCurrentView('home');
                setActiveTab('home');
                showToast('Selamat Datang!', 'Berhasil masuk ke akun BinGO!');
              }}
              onBackToSplash={() => setCurrentView('splash')}
            />
          )}

          {currentView === 'signup' && (
            <AuthScreens
              initialView="signup"
              onSuccess={(profile) => {
                if (profile) setUser({ ...user, ...profile });
                setCurrentView('home');
                setActiveTab('home');
                showToast('Akun Terdaftar!', 'Selamat bergabung dengan BinGO!');
              }}
              onBackToSplash={() => setCurrentView('splash')}
            />
          )}

          {currentView === 'home' && (
            <HomeScreen
              user={user}
              vendors={MOCK_VENDORS}
              activeOrder={activeOrder}
              onSelectVendor={(v) => {
                setSelectedVendor(v);
                setCurrentView('food-list');
              }}
              onOpenCalendar={() => setIsCalendarOpen(true)}
              onViewActiveOrder={() => {
                setCurrentView('ongoing');
                setActiveTab('ongoing');
              }}
            />
          )}

          {currentView === 'food-list' && (
            <FoodListScreen
              vendor={selectedVendor}
              cart={cart}
              onUpdateCart={handleUpdateCart}
              onGoBack={() => setCurrentView('home')}
              onProceedToOrder={() => setCurrentView('checkout')}
              onOpenFeedback={() => setIsFeedbackOpen(true)}
            />
          )}

          {currentView === 'checkout' && (
            <CheckoutScreen
              cart={cart}
              user={user}
              onGoBack={() => setCurrentView('food-list')}
              onConfirmOrder={handleConfirmOrder}
            />
          )}

          {currentView === 'ticket' && activeOrder && (
            <TicketScreen
              order={activeOrder}
              onGoBack={() => setCurrentView('home')}
              onGoToOngoing={() => {
                setCurrentView('ongoing');
                setActiveTab('ongoing');
              }}
              onOpenRating={() => setIsFeedbackOpen(true)}
              onMarkAsPickedUp={() => {
                handleAdvanceTimeline();
              }}
            />
          )}

          {currentView === 'ongoing' && (
            <OngoingScreen
              order={activeOrder}
              onViewTicket={() => setCurrentView('ticket')}
              onAdvanceTimeline={handleAdvanceTimeline}
              onResetOrder={handleResetOrder}
            />
          )}

          {currentView === 'history' && (
            <HistoryScreen
              orders={historyOrders}
              onReorder={handleReorder}
              onViewOrderDetails={(order) => {
                setActiveOrder(order);
                setCurrentView('ticket');
              }}
            />
          )}
        </div>

        {/* Global Bottom Navigation Bar (Figma Tab Bar) */}
        {isBottomBarVisible && (
          <BottomNavBar
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
            hasActiveOrder={Boolean(activeOrder && activeOrder.status !== 'completed')}
          />
        )}

        {/* Operational Calendar Modal (Figma Kalender 134:3631) */}
        <CalendarModal
          isOpen={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
        />

        {/* Feedback & Review Modal (Figma Feedback 43:2936 & Frame 5163) */}
        <FeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
          vendorName={selectedVendor.name}
          buddyName={activeOrder?.buddy?.name || 'Valencia'}
          onSubmitted={(rev) => {
            showToast('Ulasan Dikirim', 'Terima kasih atas ulasan dan rating Anda!');
          }}
        />
      </div>
    </div>
  );
}
