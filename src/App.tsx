import { useState } from 'react';
import {
  ActiveScreen,
  DevicePreviewMode,
  GeneralOperationalInfo,
  MenuItem,
  OperationalEvent,
  Order,
  OrderStatus,
  ViewMode,
} from './types';
import {
  GENERAL_OPERATIONAL_INFO,
  INITIAL_MENU_ITEMS,
  INITIAL_OPERATIONAL_EVENTS,
  INITIAL_ORDERS,
} from './data/mockData';
import { VendorHeader } from './components/VendorHeader';
import { WeeklyInsights } from './components/WeeklyInsights';
import { ActionCards } from './components/ActionCards';
import { OrdersView } from './components/OrdersView';
import { CalendarView } from './components/CalendarView';
import { AddEventModal } from './components/AddEventModal';
import { MenuStockView } from './components/MenuStockView';
import { MenuDetailEditView } from './components/MenuDetailEditView';
import { StudentOrderView } from './components/StudentOrderView';
import { DeviceFrame } from './components/DeviceFrame';
import { OfflineIndicator } from './components/OfflineIndicator';
import { playNotificationChime } from './utils/audio';
import { Utensils, ChevronRight, Clock, Package } from 'lucide-react';

export default function App() {
  // Application Data States
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [events, setEvents] = useState<OperationalEvent[]>(INITIAL_OPERATIONAL_EVENTS);
  const [generalInfo, setGeneralInfo] = useState<GeneralOperationalInfo>(GENERAL_OPERATIONAL_INFO);
  const [isCanteenOpen, setIsCanteenOpen] = useState<boolean>(true);

  // Navigation & View States
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('vendor_home');
  const [selectedEditingItemId, setSelectedEditingItemId] = useState<string>('menu-soto');
  const [viewMode, setViewMode] = useState<ViewMode>('vendor');
  const [devicePreview, setDevicePreview] = useState<DevicePreviewMode>('mobile');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Helper Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Order Status Updates
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
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
    showToast(`✅ Pesanan Struk ${newOrder.receiptNo} berhasil dibuat!`);
  };

  // Calendar Event Add
  const handleAddCalendarEvent = (newEvent: Omit<OperationalEvent, 'id'>) => {
    const eventItem: OperationalEvent = {
      ...newEvent,
      id: `evt-${Date.now()}`,
    };
    setEvents((prev) => [...prev, eventItem]);
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
    switch (activeScreen) {
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
            onOpenAddEvent={() => setActiveScreen('add_event')}
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
            onUpdateItem={(updated) =>
              setMenuItems((prev) =>
                prev.map((i) => (i.id === updated.id ? updated : i))
              )
            }
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
            {/* Header: Cat avatar, Kedai Selan, BinGO! logo */}
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
              isStudentMode={false}
            />

            {/* Body matching Wireframe Phone 1 */}
            <div className="p-4 max-w-md mx-auto w-full space-y-4">
              {/* Weekly Insights Card */}
              <WeeklyInsights
                ordersCount={orders.length + 130}
                totalRevenue={orders.reduce((s, o) => s + (o.totalAmount ?? o.total ?? 0), 3840000)}
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
                      <p className="text-[11px] text-slate-500">Kelola hidangan & stok</p>
                    </div>
                  </div>
                  <button
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
                        className="p-3 rounded-xl border border-slate-100 hover:border-amber-300 hover:bg-amber-50/20 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 group-hover:scale-105 transition-transform"
                          />
                          <div className="min-w-0">
                            <h5 className="font-extrabold text-xs text-slate-900 group-hover:text-amber-600 transition-colors truncate">
                              {item.name}
                            </h5>
                            {item.description && (
                              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                {item.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                              <span className="font-bold text-orange-600">
                                {formatRupiah(item.price)}
                              </span>
                              <span>·</span>
                              <span className="flex items-center gap-0.5 text-blue-600 font-semibold">
                                <Clock className="w-3 h-3" />
                                ~{item.preparationTimeMinutes} mnt
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                              item.isAvailable && stock > 0
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            <Package className="w-3 h-3" />
                            <span>{stock > 0 ? `${stock} Porsi` : 'Habis'}</span>
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                        </div>
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

      {/* Main View Router */}
      {viewMode === 'vendor' ? (
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
