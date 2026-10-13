import { useState, useEffect } from 'react';
import {
  ActiveScreen,
  DevicePreviewMode,
  GeneralOperationalInfo,
  MenuItem,
  OperationalEvent,
  Order,
  OrderStatus,
  ViewMode,
  VendorUser,
} from './types';
import {
  GENERAL_OPERATIONAL_INFO,
  INITIAL_MENU_ITEMS,
  INITIAL_OPERATIONAL_EVENTS,
  INITIAL_ORDERS,
} from './data/mockData';
import {
  seedInitialDataIfEmpty,
  subscribeToOrders,
  subscribeToMenuItems,
  createOrderInFirebase,
  updateOrderStatusInFirebase,
  saveMenuItemInFirebase,
  saveOperationalEventInFirebase,
} from './services/firebaseService';
import { VendorHeader } from './components/VendorHeader';
import { WeeklyInsights } from './components/WeeklyInsights';
import { ActionCards } from './components/ActionCards';
import { OrdersView } from './components/OrdersView';
import { CalendarView } from './components/CalendarView';
import { AddEventModal } from './components/AddEventModal';
import { MenuStockView } from './components/MenuStockView';
import { MenuDetailEditView } from './components/MenuDetailEditView';
import { AddMenuView } from './components/AddMenuView';
import { VendorAuthView, PRESET_DEFAULT_VENDOR } from './components/VendorAuthView';
import { StudentOrderView } from './components/StudentOrderView';
import { OwnerDashboardView } from './components/OwnerDashboardView';
import { DeviceFrame } from './components/DeviceFrame';
import { OfflineIndicator } from './components/OfflineIndicator';
import { playNotificationChime } from './utils/audio';
import { Utensils, ChevronRight, Clock, Package, Plus } from 'lucide-react';

export default function App() {
  // Application Data States
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [events, setEvents] = useState<OperationalEvent[]>(INITIAL_OPERATIONAL_EVENTS);
  const [generalInfo, setGeneralInfo] = useState<GeneralOperationalInfo>(GENERAL_OPERATIONAL_INFO);
  const [isCanteenOpen, setIsCanteenOpen] = useState<boolean>(true);

  // Vendor User & Auth State
  const [vendorUser, setVendorUser] = useState<VendorUser | null>(PRESET_DEFAULT_VENDOR);
  const [isVendorLoggedIn, setIsVendorLoggedIn] = useState<boolean>(true);

  // Navigation & View States
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('vendor_home');
  const [selectedEditingItemId, setSelectedEditingItemId] = useState<string>('menu-soto');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>('2027-01-23');
  const [viewMode, setViewMode] = useState<ViewMode>('vendor');
  const [devicePreview, setDevicePreview] = useState<DevicePreviewMode>('mobile');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with Cloud Firestore on mount
  useEffect(() => {
    // Seed initial collections if first time running on new database
    seedInitialDataIfEmpty();

    let initialLoadDone = false;

    // Subscribe to live orders
    const unsubscribe = subscribeToOrders((liveOrders) => {
      if (liveOrders && liveOrders.length > 0) {
        setOrders((prev) => {
          if (initialLoadDone && prev.length > 0) {
            // Find newly arrived orders
            const prevIds = new Set(prev.map((o) => o.id));
            const newOrders = liveOrders.filter((o) => !prevIds.has(o.id));
            if (newOrders.length > 0) {
              const latest = newOrders[0];
              playNotificationChime('new_order');
              showToast(`🔔 Pesanan Baru Masuk! Struk ${latest.receiptNo || ''} dari ${latest.customerName}`);
            }
          }
          initialLoadDone = true;
          return liveOrders;
        });
      }
    });

    // Subscribe to live menu items
    const unsubMenu = subscribeToMenuItems((liveItems) => {
      if (liveItems && liveItems.length > 0) {
        setMenuItems(liveItems);
      }
    });

    return () => {
      unsubscribe();
      unsubMenu();
    };
  }, []);

  // Helper Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Vendor Authentication Handlers
  const handleVendorLogout = () => {
    setIsVendorLoggedIn(false);
    showToast('Berhasil keluar dari akun vendor.');
  };

  const handleVendorLoginSuccess = (user: VendorUser) => {
    setVendorUser(user);
    setIsVendorLoggedIn(true);
    setActiveScreen('vendor_home');
    showToast(`Selamat datang, ${user.stallName}!`);
  };

  // Order Status Updates
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    // Push update to Firebase Firestore
    updateOrderStatusInFirebase(orderId, newStatus).catch((err) => {
      console.warn('[Firebase] Error updating status in Firestore:', err);
    });
  };

  // Simulate an incoming student order
  const handleSimulateNewOrder = () => {
    const nextReceiptNum = 100 + orders.length + 1;
    const isBuddy = Math.random() > 0.4;
    const mockNames = [
      { name: 'Joko & Fajar', buddy: 'Joko', members: ['Joko', 'Fajar'] },
      { name: 'Nadia Salsabila', buddy: '', members: [] },
      { name: 'Gavin & Michael', buddy: 'Gavin', members: ['Gavin', 'Michael'] },
      { name: 'Bu Dian', buddy: '', members: [] },
      { name: 'Reyhan Pratama', buddy: '', members: [] },
    ];
    const picked = mockNames[Math.floor(Math.random() * mockNames.length)];

    const simulatedOrder: Order = {
      id: `ord-${Date.now()}`,
      receiptNo: `#${nextReceiptNum}`,
      customerName: picked.name,
      isBuddyOrder: isBuddy,
      buddyLeadName: isBuddy ? picked.buddy : undefined,
      buddyMembers: isBuddy ? picked.members : undefined,
      pickupTime: '11.30 WIB',
      pickupSlotLabel: 'Istirahat 2',
      items: [
        { id: 'sim-1', name: 'Soto Nusantara', quantity: 2, price: 18000 },
        { id: 'sim-2', name: 'Sate Telur Puyuh', quantity: 1, price: 5000 },
      ],
      notes: isBuddy ? 'tanpa sambal, kuah dipisah' : 'ekstra jeruk nipis',
      status: 'masuk',
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      totalAmount: 41000,
      paymentMethod: 'QRIS',
      paymentStatus: 'Lunas',
    };

    setOrders((prev) => [simulatedOrder, ...prev]);
    // Save to Firestore
    createOrderInFirebase(simulatedOrder).catch((err) => {
      console.warn('[Firebase] Error creating order in Firestore:', err);
    });
    playNotificationChime('new_order');
    showToast(`🔔 Pesanan Baru Masuk! Struk ${simulatedOrder.receiptNo} dari ${simulatedOrder.customerName}`);
  };

  // Student places an order through StudentOrderView
  const handlePlaceStudentOrder = (
    orderData: Omit<Order, 'id' | 'receiptNo' | 'createdAt' | 'status'>
  ) => {
    const nextReceiptNum = 100 + orders.length + 1;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      receiptNo: `#${nextReceiptNum}`,
      status: 'masuk',
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    };

    setOrders((prev) => [newOrder, ...prev]);
    playNotificationChime('new_order');
    showToast(`🔔 Pesanan Baru Masuk! Struk ${newOrder.receiptNo} dari ${newOrder.customerName}`);

    // Save to Firestore
    createOrderInFirebase(newOrder).catch((err) => {
      console.warn('[Firebase] Error creating order in Firestore:', err);
    });
  };

  // Calendar Event Add
  const handleAddCalendarEvent = (newEvent: Omit<OperationalEvent, 'id'>) => {
    const eventItem: OperationalEvent = {
      ...newEvent,
      id: `evt-${Date.now()}`,
    };
    setEvents((prev) => [...prev, eventItem]);
    saveOperationalEventInFirebase(eventItem).catch((err) => {
      console.warn('[Firebase] Error saving event to Firestore:', err);
    });
    showToast(`📅 Agenda "${eventItem.title}" berhasil ditambahkan ke kalendar!`);
    setActiveScreen('calendar');
  };

  const handleDeleteCalendarEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    showToast('Agenda dihapus.');
  };

  // Menu Availability Toggle
  const handleToggleMenuAvailability = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              isAvailable: !item.isAvailable,
              stockRemaining: !item.isAvailable ? (item.stockRemaining || 20) : 0,
            }
          : item
      )
    );
  };

  const handleOpenEditMenu = (itemId: string) => {
    setSelectedEditingItemId(itemId);
    setActiveScreen('edit_menu_item');
  };

  // Pending incoming count
  const pendingOrdersCount = orders.filter((o) => o.status === 'masuk').length;
  const upcomingEvent = events[0]?.title ? `${events[0].title}` : undefined;

  // Format currency
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Render Vendor Screen Router
  const renderVendorScreen = () => {
    // If vendor is logged out, show the Vendor Auth Screen (Login / Sign Up)
    if (!isVendorLoggedIn) {
      return (
        <VendorAuthView
          onSuccess={handleVendorLoginSuccess}
          onSwitchToStudent={() => setViewMode('student')}
        />
      );
    }

    switch (activeScreen) {
      case 'vendor_auth':
        return (
          <VendorAuthView
            onSuccess={handleVendorLoginSuccess}
            onSwitchToStudent={() => setViewMode('student')}
          />
        );

      case 'pesanan':
        return (
          <OrdersView
            orders={orders}
            onBack={() => setActiveScreen('vendor_home')}
            onUpdateStatus={handleUpdateOrderStatus}
            onSimulateNewOrder={handleSimulateNewOrder}
          />
        );

      case 'calendar':
        return (
          <CalendarView
            events={events}
            generalInfo={generalInfo}
            onBack={() => setActiveScreen('vendor_home')}
            onOpenAddEvent={(dateStr) => {
              if (dateStr) setSelectedCalendarDate(dateStr);
              setActiveScreen('add_event');
            }}
            onDeleteEvent={handleDeleteCalendarEvent}
            onUpdateGeneralInfo={(info) => {
              setGeneralInfo(info);
              showToast('Jam operasional disimpan.');
            }}
          />
        );

      case 'add_event':
        return (
          <AddEventModal
            defaultDate={selectedCalendarDate}
            onBack={() => setActiveScreen('calendar')}
            onAddEvent={handleAddCalendarEvent}
          />
        );

      case 'menu_stock':
        return (
          <MenuStockView
            menuItems={menuItems}
            onBack={() => setActiveScreen('vendor_home')}
            onToggleAvailability={handleToggleMenuAvailability}
            onSelectItem={handleOpenEditMenu}
            onOpenAddMenu={() => setActiveScreen('add_menu_item')}
            onUpdateItem={(updated) =>
              setMenuItems((prev) =>
                prev.map((i) => (i.id === updated.id ? updated : i))
              )
            }
          />
        );

      case 'add_menu_item':
        return (
          <AddMenuView
            onBack={() => setActiveScreen('menu_stock')}
            onSave={(newItem) => {
              setMenuItems((prev) => [newItem, ...prev]);
              saveMenuItemInFirebase(newItem).catch((err) => {
                console.warn('[Firebase] Error saving menu item to Firestore:', err);
              });
              playNotificationChime('ready');
              showToast(`✅ Menu "${newItem.name}" berhasil ditambahkan & terbit!`);
              setActiveScreen('menu_stock');
            }}
          />
        );

      case 'edit_menu_item': {
        const itemToEdit =
          menuItems.find((i) => i.id === selectedEditingItemId) || menuItems[0];
        return (
          <MenuDetailEditView
            item={itemToEdit}
            onBack={() => setActiveScreen('menu_stock')}
            onSave={(updated) => {
              setMenuItems((prev) =>
                prev.map((i) => (i.id === updated.id ? updated : i))
              );
              saveMenuItemInFirebase(updated).catch((err) => {
                console.warn('[Firebase] Error saving updated menu to Firestore:', err);
              });
              playNotificationChime('ready');
              showToast(`✅ Stok & estimasi waktu masak "${updated.name}" berhasil disimpan!`);
              setActiveScreen('menu_stock');
            }}
          />
        );
      }

      case 'vendor_home':
      default:
        return (
          <div className="w-full h-full flex-1 overflow-y-auto min-h-0 bg-slate-50 flex flex-col pb-10">
            {/* Header: Cat avatar, Stall Name, BinGO! logo, and Logout option */}
            <VendorHeader
              isOpen={isCanteenOpen}
              onToggleOpen={() => {
                setIsCanteenOpen(!isCanteenOpen);
                showToast(
                  !isCanteenOpen
                    ? 'Kantin sekarang BUKA (Menerima Pesanan)'
                    : 'Kantin sekarang TUTUP'
                );
              }}
              onSwitchMode={() => setViewMode('student')}
              onOpenOwnerDashboard={() => setViewMode('owner_dashboard')}
              isStudentMode={false}
              vendorUser={vendorUser}
              onLogout={handleVendorLogout}
            />

            {/* Body matching Wireframe Phone 1 */}
            <div className="p-4 max-w-md mx-auto w-full space-y-4">
              {/* Weekly Insights Card (Revenue removed per user request) */}
              <WeeklyInsights
                ordersCount={orders.length + 130}
                popularProductName={menuItems.find((i) => i.isPopular)?.name || 'Nasi Selan Spesial'}
                popularProductSoldCount={menuItems.find((i) => i.isPopular)?.soldCount || 142}
                onPopularProductClick={() => {
                  const pop = menuItems.find((i) => i.isPopular) || menuItems[0];
                  handleOpenEditMenu(pop.id);
                }}
              />

              {/* Action Cards (Pesanan & Calendar) */}
              <ActionCards
                onOpenPesanan={() => setActiveScreen('pesanan')}
                onOpenCalendar={() => setActiveScreen('calendar')}
                pendingOrdersCount={pendingOrdersCount}
                upcomingEventTitle={upcomingEvent}
              />

              {/* Card Kelola Menu */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shadow-2xs">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                        Kelola Menu
                      </h4>
                      <p className="text-xs text-slate-500">Kelola hidangan & stok</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveScreen('menu_stock')}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline flex items-center gap-0.5 cursor-pointer bg-transparent py-1 transition-colors"
                  >
                    <span>Lihat Semua</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {menuItems.slice(0, 4).map((item) => {
                    const stock = item.stockRemaining ?? (item.isAvailable ? 25 : 0);
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleOpenEditMenu(item.id)}
                        className="p-3 rounded-xl border border-slate-100 hover:border-amber-300 hover:bg-amber-50/20 transition-all flex items-center gap-3.5 cursor-pointer group"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0 group-hover:scale-105 transition-transform"
                        />

                        <div className="flex-1 min-w-0">
                          {/* Row 1: Judul */}
                          <h5 className="font-extrabold text-sm text-slate-900 group-hover:text-amber-600 transition-colors truncate">
                            {item.name}
                          </h5>

                          {/* Row 2: Desc */}
                          {item.description && (
                            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                              {item.description}
                            </p>
                          )}

                          {/* Row 3 (1 Clean Line): Harga · Lama Masak · Porsi/Stok */}
                          <div className="flex items-center gap-2 text-xs mt-1.5 flex-wrap">
                            <span className="font-extrabold text-orange-600">
                              {formatRupiah(item.price)}
                            </span>
                            <span className="text-slate-300">·</span>
                            <span className="flex items-center gap-1 text-slate-600 font-medium">
                              <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              <span>~{item.preparationTimeMinutes} mnt</span>
                            </span>
                            <span className="text-slate-300">·</span>
                            <span
                              className={`font-bold ${
                                item.isAvailable && stock > 0
                                  ? 'text-emerald-700'
                                  : 'text-rose-600'
                              }`}
                            >
                              {stock > 0 ? `${stock} stok` : 'Habis'}
                            </span>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <DeviceFrame
      viewMode={viewMode}
      onToggleViewMode={(mode) => setViewMode(mode)}
      devicePreview={devicePreview}
      onToggleDevicePreview={(mode) => setDevicePreview(mode)}
      onSimulateOrder={handleSimulateNewOrder}
      pendingCount={pendingOrdersCount}
    >
      {/* Toast Notification strictly inside container */}
      {toastMessage && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-950/95 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xl border border-slate-700/80 animate-in fade-in slide-in-from-top-2 duration-200 flex items-center gap-2 max-w-[90%] truncate">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main View Router: Owner Dashboard (Desktop), Vendor (HP), or Student (HP) */}
      {viewMode === 'owner_dashboard' ? (
        <OwnerDashboardView
          orders={orders}
          menuItems={menuItems}
          onSwitchMode={(mode) => setViewMode(mode)}
          onSimulateOrder={handleSimulateNewOrder}
          isLoggedIn={isVendorLoggedIn}
          onLogin={handleVendorLoginSuccess}
          onLogout={handleVendorLogout}
          vendorUser={vendorUser}
          onUpdateMenuItem={(updated) => {
            setMenuItems((prev) =>
              prev.map((i) => (i.id === updated.id ? updated : i))
            );
            saveMenuItemInFirebase(updated).catch((err) => {
              console.warn('[Firebase] Error saving updated menu to Firestore:', err);
            });
            playNotificationChime('ready');
            showToast(`✅ Menu "${updated.name}" berhasil diperbarui!`);
          }}
        />
      ) : viewMode === 'vendor' ? (
        renderVendorScreen()
      ) : (
        <StudentOrderView
          menuItems={menuItems}
          onPlaceOrder={handlePlaceStudentOrder}
          onBackToVendor={() => setViewMode('vendor')}
          studentOrders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          operationalEvents={events}
          generalInfo={generalInfo}
        />
      )}

      {/* Offline Status Indicator */}
      <OfflineIndicator />
    </DeviceFrame>
  );
}
