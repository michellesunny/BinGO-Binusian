import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { MenuItem, Order, Vendor, CartItem, ReviewItem, OperationalEvent, GeneralOperationalInfo } from '../types';
import { MOCK_VENDORS } from '../data/mockData';
import { playNotificationChime } from '../utils/audio';

// Import newly created student interface components
import { SplashScreen } from './SplashScreen';
import { AuthScreens, UserProfile, PRESET_USERS } from './AuthScreens';
import { HomeScreen } from './HomeScreen';
import { FoodListScreen } from './FoodListScreen';
import { CheckoutScreen } from './CheckoutScreen';
import { OngoingScreen } from './OngoingScreen';
import { HistoryScreen } from './HistoryScreen';
import { TicketScreen } from './TicketScreen';
import { CalendarModal } from './CalendarModal';
import { StudentCalendarView } from './StudentCalendarView';
import { FeedbackModal } from './FeedbackModal';
import { BottomNavBar, NavTab } from './BottomNavBar';
import { Toast, ToastMessage } from './Toast';

interface StudentOrderViewProps {
  menuItems: MenuItem[];
  onPlaceOrder: (newOrder: any) => void;
  onBackToVendor: () => void;
  studentOrders: Order[];
  onUpdateOrderStatus?: (orderId: string, newStatus: any) => void;
  operationalEvents?: OperationalEvent[];
  generalInfo?: GeneralOperationalInfo;
}

export const StudentOrderView: React.FC<StudentOrderViewProps> = ({
  menuItems,
  onPlaceOrder,
  onBackToVendor,
  studentOrders,
  onUpdateOrderStatus,
  operationalEvents,
  generalInfo,
}) => {
  // Navigation Screens
  const [currentScreen, setCurrentScreen] = useState<
    'splash' | 'auth' | 'home' | 'food_list' | 'checkout' | 'ongoing' | 'history' | 'ticket' | 'calendar'
  >('home');
  const [navTab, setNavTab] = useState<NavTab>('home');
  const [authInitialView, setAuthInitialView] = useState<'login' | 'signup'>('login');
  const [calendarSourceScreen, setCalendarSourceScreen] = useState<'home' | 'food_list'>('home');

  // Modals
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isTicketFromHistory, setIsTicketFromHistory] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [localCompletedOrders, setLocalCompletedOrders] = useState<Order[]>([]);

  // Student Profile (Amelia or Valencia)
  const [user, setUser] = useState<UserProfile>(PRESET_USERS.pemesan);

  const handleLogout = () => {
    setCurrentScreen('auth');
    showToast('🔒 Telah Keluar', 'Silakan pilih profil login atau masukkan akun baru.');
  };

  // Ensure primary vendor (Kedai Selan) stays in sync with live menuItems
  const vendorsList: Vendor[] = MOCK_VENDORS.map((v) => {
    if (v.id === 'kedai-selan') {
      return {
        ...v,
        menu: menuItems.map((item, idx) => ({
          ...item,
          isBestSeller: idx === 0,
          likes: 120 - idx * 25,
        })),
      };
    }
    return v;
  });

  const [selectedVendor, setSelectedVendor] = useState<Vendor>(vendorsList[0]);
  const [cart, setCart] = useState<CartItem[]>([
    { menuItem: vendorsList[0].menu[0] || menuItems[0], quantity: 1 },
  ]);

  // Order state tracking
  const [activeOrder, setActiveOrder] = useState<Order | null>(
    studentOrders.length > 0 ? studentOrders[0] : null
  );
  const [ticketOrder, setTicketOrder] = useState<Order | null>(
    studentOrders.length > 0 ? studentOrders[0] : null
  );

  const showToast = (title: string, description?: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ id: `toast-${Date.now()}`, title, description, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Cart operations
  const handleUpdateCart = (item: MenuItem, delta: number) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === item.id);
      if (!existing) {
        if (delta > 0) return [...prev, { menuItem: item, quantity: 1 }];
        return prev;
      }
      const newQty = existing.quantity + delta;
      if (newQty <= 0) {
        return prev.filter((c) => c.menuItem.id !== item.id);
      }
      return prev.map((c) => (c.menuItem.id === item.id ? { ...c, quantity: newQty } : c));
    });
  };

  // Handle Checkout Confirmation
  const handleConfirmOrder = (newOrder: Order) => {
    // Notify vendor side as well
    const vendorFormattedOrder = {
      id: newOrder.id,
      receiptNo: `#${100 + studentOrders.length + 1}`,
      orderNumber: newOrder.orderNumber,
      customerName: user.name,
      nim: user.nim,
      isBuddyOrder: newOrder.isBuddyEnabled,
      buddyLeadName: newOrder.buddy?.name,
      pickupTime: newOrder.pickupSlot,
      pickupSlotLabel: 'Slot Pengambilan',
      items: newOrder.items.map((i: any) => ({
        id: i.menuItem?.id || i.id,
        name: i.menuItem?.name || i.name,
        quantity: i.quantity,
        price: i.menuItem?.price || i.price,
      })),
      status: 'masuk' as const,
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      totalAmount: newOrder.total,
      paymentMethod: 'QRIS' as const,
      paymentStatus: 'Lunas' as const,
    };

    onPlaceOrder(vendorFormattedOrder);

    setActiveOrder(newOrder);
    setTicketOrder(newOrder);
    setCart([]);

    playNotificationChime('ready');
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F38B21', '#387CB7', '#10B981'],
      });
    } catch {
      // ignore
    }

    showToast('🎉 Pesanan Berhasil Dibuat!', 'Vendor sedang menyiapkan pesananmu.');
    setCurrentScreen('ticket');
    setNavTab('ongoing');
  };

  // Verification code check: user / buyer inputs the code shown on ticket / buddy
  const handleVerifyCompletionCode = (enteredCode: string): boolean => {
    const target = activeOrder || ticketOrder;
    if (!target) return false;

    const expected = target.verificationCode || '8492';
    if (enteredCode.trim().toUpperCase() === expected.trim().toUpperCase()) {
      const updatedTimeline = (target.timeline || []).map((step) => ({
        ...step,
        done: true,
        active: false,
      }));
      if (updatedTimeline.length > 0) {
        updatedTimeline[updatedTimeline.length - 1].done = true;
        updatedTimeline[updatedTimeline.length - 1].time = 'Baru saja';
      }

      const completedOrder: Order = {
        ...target,
        status: 'completed',
        timeline: updatedTimeline,
      };

      setActiveOrder(completedOrder);
      setTicketOrder(completedOrder);
      setLocalCompletedOrders((prev) => [completedOrder, ...prev.filter((o) => o.id !== completedOrder.id)]);

      if (onUpdateOrderStatus) {
        onUpdateOrderStatus(target.id, 'selesai');
      }

      playNotificationChime('success');
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#F38B21', '#387CB7'],
        });
      } catch {
        // ignore
      }

      showToast('🎉 Pesanan Selesai!', 'Kode cocok & diverifikasi. Pesanan masuk ke Riwayat Selesai.');

      // Automatically move to history screen as requested
      setTimeout(() => {
        setCurrentScreen('history');
        setNavTab('history');
      }, 600);

      return true;
    }
    return false;
  };

  // Timeline advancement simulation for students
  const handleAdvanceTimeline = () => {
    if (!activeOrder || !activeOrder.timeline) return;

    const timeline = [...activeOrder.timeline];
    const activeIndex = timeline.findIndex((t) => t.active);

    if (activeIndex !== -1 && activeIndex < timeline.length - 1) {
      timeline[activeIndex].done = true;
      timeline[activeIndex].active = false;
      timeline[activeIndex + 1].active = true;
      timeline[activeIndex + 1].time = 'Baru saja';

      const updated = { ...activeOrder, timeline };
      setActiveOrder(updated);
      showToast('🚀 Status Pesanan Diperbarui', timeline[activeIndex + 1].status, 'info');
    } else if (activeIndex === timeline.length - 1) {
      timeline[activeIndex].done = true;
      timeline[activeIndex].active = false;
      const updated = { ...activeOrder, timeline, status: 'completed' };
      setActiveOrder(updated);
      showToast('✅ Pesanan Selesai!', 'Terima kasih telah memesan lewat BinGO!', 'success');
    }
  };

  const handleResetTimeline = () => {
    if (!activeOrder) return;
    const timeline = [
      { status: 'Pesanan dibuat', time: 'Baru saja', done: true, active: true },
      { status: 'Pesanan disiapkan vendor', time: 'Menunggu', done: false, active: false },
      { status: 'Siap diambil di vendor', time: 'Estimasi 09.05', done: false, active: false },
      { status: 'Pesanan sampai / selesai', time: 'Estimasi 09.10', done: false, active: false },
    ];
    setActiveOrder({ ...activeOrder, timeline, status: 'created' });
    showToast('🔄 Demo Direset', 'Timeline kembali ke tahap awal.');
  };

  // Tab switching from BottomNavBar
  const handleSelectTab = (tab: NavTab) => {
    setNavTab(tab);
    if (tab === 'home') setCurrentScreen('home');
    else if (tab === 'ongoing') setCurrentScreen('ongoing');
    else if (tab === 'history') setCurrentScreen('history');
  };

  // Render individual student screens
  const renderCurrentView = () => {
    switch (currentScreen) {
      case 'splash':
        return (
          <SplashScreen
            onSignIn={() => {
              setAuthInitialView('login');
              setCurrentScreen('auth');
            }}
            onSignUp={() => {
              setAuthInitialView('signup');
              setCurrentScreen('auth');
            }}
            onExploreDirectly={() => setCurrentScreen('home')}
          />
        );

      case 'auth':
        return (
          <AuthScreens
            initialView={authInitialView}
            onSuccess={(profile) => {
              setUser(profile);
              showToast('👋 Selamat Datang!', `Halo, ${profile.name} (${profile.role === 'buddy' ? 'Buddy' : 'Pemesan'})`);
              setCurrentScreen('home');
              setNavTab('home');
            }}
            onBackToSplash={() => setCurrentScreen('home')}
          />
        );

      case 'food_list':
        return (
          <FoodListScreen
            vendor={selectedVendor}
            cart={cart}
            onUpdateCart={handleUpdateCart}
            onGoBack={() => setCurrentScreen('home')}
            onProceedToOrder={() => setCurrentScreen('checkout')}
            onOpenFeedback={() => setIsFeedbackOpen(true)}
            onOpenCalendar={() => {
              setCalendarSourceScreen('food_list');
              setCurrentScreen('calendar');
            }}
          />
        );

      case 'checkout': {
        const incomingPeers: any[] = [];
        const candidateOrders = [activeOrder, ...studentOrders].filter(
          (o, idx, arr) => o && o.isBuddyEnabled && arr.findIndex((x) => x?.id === o.id) === idx
        );
        candidateOrders.forEach((co) => {
          if (co) {
            incomingPeers.push({
              id: `peer-${co.id}`,
              studentName: co.customerName || 'Amelia Angelica',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
              dropLocation: co.dropLocation || 'Atrium Lt. 1',
              items: (co.items || []).map((it) => ({
                name: it.menuItem?.name || it.name || 'Soto Nusantara',
                quantity: it.quantity || 1,
                price: it.menuItem?.price || it.price || 18000,
              })),
              fee: 2000,
              selected: true,
            });
          }
        });

        return (
          <CheckoutScreen
            cart={cart}
            user={user}
            onGoBack={() => setCurrentScreen('food_list')}
            onConfirmOrder={handleConfirmOrder}
            incomingPeerRequests={incomingPeers}
          />
        );
      }

      case 'ticket':
        return (
          <TicketScreen
            order={ticketOrder || activeOrder || studentOrders[0]}
            onGoBack={() => {
              setCurrentScreen('home');
              setNavTab('home');
            }}
            onGoToOngoing={() => {
              setCurrentScreen('ongoing');
              setNavTab('ongoing');
            }}
            onOpenRating={() => setIsFeedbackOpen(true)}
            onVerifyCompletionCode={handleVerifyCompletionCode}
            userRole={user.role}
            isFromHistory={isTicketFromHistory}
          />
        );

      case 'ongoing':
        return (
          <OngoingScreen
            order={activeOrder}
            onViewTicket={() => {
              setTicketOrder(activeOrder);
              setIsTicketFromHistory(false);
              setCurrentScreen('ticket');
            }}
            onAdvanceTimeline={handleAdvanceTimeline}
            onResetOrder={handleResetTimeline}
            onVerifyCompletionCode={handleVerifyCompletionCode}
            onGoToHistory={() => {
              setCurrentScreen('history');
              setNavTab('history');
            }}
            userRole={user.role}
          />
        );

      case 'history':
        return (
          <HistoryScreen
            orders={[
              ...localCompletedOrders,
              ...studentOrders.filter((so) => !localCompletedOrders.some((lo) => lo.id === so.id)),
            ]}
            onReorder={(order) => {
              const vendor = vendorsList.find((v) => v.name === order.vendorName) || vendorsList[0];
              setSelectedVendor(vendor);
              setCurrentScreen('food_list');
              showToast('🔄 Pesan Ulang', `Membuka menu ${vendor.name}`);
            }}
            onViewOrderDetails={(order) => {
              setTicketOrder({ ...order, status: 'completed' });
              setIsTicketFromHistory(true);
              setCurrentScreen('ticket');
            }}
          />
        );

      case 'calendar':
        return (
          <StudentCalendarView
            onBack={() => setCurrentScreen(calendarSourceScreen)}
            events={operationalEvents}
            generalInfo={generalInfo}
          />
        );

      case 'home':
      default:
        return (
          <HomeScreen
            user={user}
            vendors={vendorsList}
            activeOrder={activeOrder}
            onSelectVendor={(v) => {
              setSelectedVendor(v);
              setCurrentScreen('food_list');
            }}
            onOpenCalendar={() => {
              setCalendarSourceScreen('home');
              setCurrentScreen('calendar');
            }}
            onViewActiveOrder={() => {
              setCurrentScreen('ongoing');
              setNavTab('ongoing');
            }}
            onLogout={handleLogout}
          />
        );
    }
  };

  // Determine whether to show the bottom navigation bar (ticket screen has NO footer)
  const shouldShowBottomNav =
    currentScreen === 'home' || currentScreen === 'ongoing' || currentScreen === 'history';

  return (
    <div className="relative w-full h-full flex-1 flex flex-col overflow-hidden bg-slate-50">
      {/* Toast Notification */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Main Screen Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        {renderCurrentView()}
      </div>

      {/* Persistent Bottom Navigation Bar for Home, Ongoing, History, and Ticket */}
      {shouldShowBottomNav && (
        <BottomNavBar
          activeTab={navTab}
          onSelectTab={handleSelectTab}
          hasActiveOrder={Boolean(activeOrder && activeOrder.status !== 'completed' && activeOrder.status !== 'selesai')}
        />
      )}

      {/* Operational Calendar Modal */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
      />

      {/* Rating & Review Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        vendorName={selectedVendor.name}
        onSubmitted={() => {
          showToast('⭐ Terima Kasih!', 'Ulasan dan bintangmu telah dipublikasikan.');
        }}
      />
    </div>
  );
};
