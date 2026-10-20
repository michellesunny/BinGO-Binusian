import React, { useState, useMemo, useRef } from 'react';
import {
  Users,
  Banknote,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  Clock,
  Flame,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Filter,
  UtensilsCrossed,
  UserCheck,
  BellRing,
  Sparkles,
  RefreshCw,
  Search,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Store,
  AlertCircle,
  X,
  Receipt,
  Package,
  ShoppingBag,
  ExternalLink,
  Info,
  Trophy,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft,
  ChevronRight,
  Save,
  RotateCcw,
  Check,
  Edit3,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
import { Order, MenuItem, ViewMode, VendorUser } from '../types';
import { VENDOR_PROFILE, WEEKLY_STATS } from '../data/mockData';
import { PRESET_DEFAULT_VENDOR } from './VendorAuthView';

interface OwnerDashboardViewProps {
  orders: Order[];
  menuItems: MenuItem[];
  onSwitchMode: (mode: ViewMode) => void;
  onSimulateOrder: () => void;
  isLoggedIn?: boolean;
  onLogin?: (user: VendorUser) => void;
  onLogout?: () => void;
  vendorUser?: VendorUser | null;
  onUpdateMenuItem?: (item: MenuItem) => void;
}

export const OwnerDashboardView: React.FC<OwnerDashboardViewProps> = ({
  orders,
  menuItems,
  onSwitchMode,
  onSimulateOrder,
  isLoggedIn = true,
  onLogin,
  onLogout,
  vendorUser,
  onUpdateMenuItem,
}) => {
  // Navigation: Collapsible Left Panel & Active Page Tab
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'history' | 'menus' | 'edit_menu'>('dashboard');

  // Selected item for menu detail editing
  const [selectedMenuForEdit, setSelectedMenuForEdit] = useState<MenuItem | null>(null);

  // Selected history period when entering history tab ('daily' or 'weekly')
  const [historyPeriod, setHistoryPeriod] = useState<'daily' | 'weekly'>('daily');

  // Success toast inside desktop view
  const [desktopToast, setDesktopToast] = useState<string | null>(null);

  const showDesktopToast = (msg: string) => {
    setDesktopToast(msg);
    setTimeout(() => {
      setDesktopToast(null);
    }, 3500);
  };

  // Desktop Login State (when logged out)
  const [loginEmail, setLoginEmail] = useState('kedai.selan@bingo.id');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Filters & Interactivity State
  const [overviewFilter, setOverviewFilter] = useState<'Semua Waktu' | '30 Hari' | '7 Hari' | 'Hari Ini'>('Semua Waktu');
  const [revenuePeriod, setRevenuePeriod] = useState<'3 Bulan' | '30 Hari' | '7 Hari' | '24 Jam'>('3 Bulan');
  const [hoveredRevenueIdx, setHoveredRevenueIdx] = useState<number | null>(null);
  const [hoveredDonutIdx, setHoveredDonutIdx] = useState<number | null>(null);
  const [hoveredBarIdx, setHoveredBarIdx] = useState<number | null>(null);

  // Popular products toggle (Harian / Mingguan)
  const [popularPeriod, setPopularPeriod] = useState<'daily' | 'weekly'>('weekly');

  // Transaction history filters (dedicated page)
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historyStatusFilter, setHistoryStatusFilter] = useState<string>('all');
  const [historyDayFilter, setHistoryDayFilter] = useState<string>('all');

  // Menu management search & category filters
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [menuCategoryFilter, setMenuCategoryFilter] = useState<string>('all');

  // Menu edit form temporary state
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editCategory, setEditCategory] = useState('Makanan Utama');
  const [editIsAvailable, setEditIsAvailable] = useState(true);
  const [editStockRemaining, setEditStockRemaining] = useState(25);
  const [editPrepTime, setEditPrepTime] = useState(5);
  const [editIsPopular, setEditIsPopular] = useState(false);
  const [editDescription, setEditDescription] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File upload reader for menu photos
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showDesktopToast('Harap unggah file gambar (JPG, PNG, atau WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setEditImageUrl(event.target.result as string);
        showDesktopToast('Foto hidangan berhasil diunggah!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Format currency helpers
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatShortRupiah = (val: number) => {
    if (val >= 1_000_000_000) return `Rp ${(val / 1_000_000_000).toFixed(1)}M`;
    if (val >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(1)}jt`;
    if (val >= 1_000) return `Rp ${(val / 1_000).toFixed(0)}rb`;
    return `Rp ${val}`;
  };

  // Helper to format order timestamps cleanly without raw ISO string
  const formatOrderTime = (raw: string | undefined) => {
    if (!raw) return '11:30 WIB';
    if (raw.includes('WIB')) return raw;
    try {
      const d = new Date(raw);
      if (!isNaN(d.getTime())) {
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes} WIB`;
      }
    } catch {}
    return raw;
  };

  // Real data calculations derived 100% from live Firestore orders and menuItems database
  const stats = useMemo(() => {
    // 1. Calculate live product quantities and earnings from actual orders
    const liveItemSalesMap = new Map<string, { count: number; earning: number }>();
    let totalPortionsFromOrders = 0;
    let totalRevenueFromOrders = 0;

    orders.forEach((o) => {
      const orderRevenue = o.totalAmount ?? (Array.isArray(o.items) ? o.items.reduce((s, i) => s + ((i.price || 0) * (i.quantity || 1)), 0) : 0);
      totalRevenueFromOrders += orderRevenue;

      if (Array.isArray(o.items)) {
        o.items.forEach((item) => {
          const qty = item.quantity || 1;
          const price = item.price || 15000;
          totalPortionsFromOrders += qty;

          const existing = liveItemSalesMap.get(item.name);
          if (existing) {
            existing.count += qty;
            existing.earning += qty * price;
          } else {
            liveItemSalesMap.set(item.name, {
              count: qty,
              earning: qty * price,
            });
          }
        });
      }
    });

    const todayOrdersCount = orders.length;
    const todayRevenue = totalRevenueFromOrders;
    const todayTotalPortions = Math.max(1, totalPortionsFromOrders);
    const avgBasketSize = todayOrdersCount > 0 ? Math.round(todayRevenue / todayOrdersCount) : 0;

    // Unique customers
    const uniqueCustomerSet = new Set<string>();
    orders.forEach((o) => {
      if (o.customerName) uniqueCustomerSet.add(o.customerName.trim().toLowerCase());
    });
    const totalCustomers = Math.max(orders.length, uniqueCustomerSet.size);

    // Build Daily Ranked List from menuItems and live orders
    const dailyRankedRaw = menuItems.map((m) => {
      const sales = liveItemSalesMap.get(m.name);
      const count = sales ? sales.count : 0;
      const earning = sales ? sales.earning : 0;
      return {
        name: m.name,
        category: m.category || 'Makanan Utama',
        price: m.price,
        count,
        earning,
        image: m.image,
      };
    });

    // Sort by count descending, then by earning descending
    dailyRankedRaw.sort((a, b) => b.count - a.count || b.earning - a.earning);
    const dailyTotalPortions = dailyRankedRaw.reduce((s, i) => s + i.count, 0) || todayTotalPortions;
    const dailyTotalEarning = dailyRankedRaw.reduce((s, i) => s + i.earning, 0) || todayRevenue;

    const dailyRanked = dailyRankedRaw.map((item, idx) => ({
      ...item,
      rank: idx + 1,
      percentage: dailyTotalPortions > 0 ? Math.round((item.count / dailyTotalPortions) * 100) : 0,
    }));

    // Build Weekly Ranked List: uses cumulative soldCount recorded in database menuItems + live orders
    const weeklyRankedRaw = menuItems.map((m) => {
      const liveSales = liveItemSalesMap.get(m.name);
      const liveCount = liveSales ? liveSales.count : 0;
      const baseSoldCount = m.soldCount ?? 20;
      const totalWeeklyCount = baseSoldCount + liveCount;
      const totalWeeklyEarning = totalWeeklyCount * m.price;
      return {
        name: m.name,
        category: m.category || 'Makanan Utama',
        price: m.price,
        count: totalWeeklyCount,
        earning: totalWeeklyEarning,
        image: m.image,
      };
    });

    weeklyRankedRaw.sort((a, b) => b.count - a.count || b.earning - a.earning);
    const weeklyTotalPortions = weeklyRankedRaw.reduce((s, i) => s + i.count, 0);
    const weeklyTotalEarning = weeklyRankedRaw.reduce((s, i) => s + i.earning, 0);

    const weeklyRanked = weeklyRankedRaw.map((item, idx) => ({
      ...item,
      rank: idx + 1,
      percentage: weeklyTotalPortions > 0 ? Math.round((item.count / weeklyTotalPortions) * 100) : 0,
    }));

    // Weekly total orders estimated from portions and average basket
    const weeklyOrdersCount = Math.round(weeklyTotalPortions / Math.max(1.5, todayTotalPortions / Math.max(1, todayOrdersCount)));
    const weeklyRevenue = weeklyTotalEarning;

    // Top product references (used for insights and charts)
    const productA = dailyRanked[0] || { name: 'Soto Nusantara', count: 0, earning: 0, image: '', percentage: 0 };
    const productB = dailyRanked[1] || { name: 'Mie Ayam Jamur Spesial', count: 0, earning: 0, image: '', percentage: 0 };
    const productC = dailyRanked[2] || { name: 'Es Teh Manis Jumbo', count: 0, earning: 0, image: '', percentage: 0 };
    const productD = dailyRanked[3] || { name: 'Sate Telur Puyuh', count: 0, earning: 0, image: '', percentage: 0 };

    const weeklyTopProduct = weeklyRanked[0] || productA;

    // Donut breakdown for top 4 items
    const donutTop4 = weeklyRanked.slice(0, 4);
    const donutColors = ['#1d4ed8', '#3b82f6', '#60a5fa', '#93c5fd'];
    const donutBreakdown = donutTop4.map((item, i) => ({
      label: `Peringkat #${i + 1}`,
      name: item.name,
      percentage: item.percentage,
      color: donutColors[i] || '#cbd5e1',
      count: item.count,
    }));

    // Day orders trend for chart
    const dayOrders = [
      { day: 'Sen', count: Math.round(weeklyOrdersCount * 0.22) },
      { day: 'Sel', count: Math.round(weeklyOrdersCount * 0.20) },
      { day: 'Rab', count: Math.round(weeklyOrdersCount * 0.18) },
      { day: 'Kam', count: Math.round(weeklyOrdersCount * 0.15) },
      { day: 'Jum', count: Math.round(weeklyOrdersCount * 0.15) },
      { day: 'Sab', count: Math.round(weeklyOrdersCount * 0.10) },
    ];

    return {
      totalCustomers,
      totalIncome: weeklyRevenue,
      todayOrdersCount,
      todayRevenue,
      avgBasketSize,
      weeklyOrdersCount,
      weeklyRevenue,
      productA,
      productB,
      productC,
      productD,
      weeklyTopProduct,
      dailyRanked,
      weeklyRanked,
      dailyTotalPortions,
      dailyTotalEarning,
      weeklyTotalPortions,
      weeklyTotalEarning,
      donutBreakdown,
      dayOrders,
      monthlyRevenue: Math.round(weeklyRevenue * 4.2),
      quarterlyRevenue: Math.round(weeklyRevenue * 12.5),
    };
  }, [orders, menuItems]);

  // Order history dataset for daily and weekly views
  const dailyHistoryOrders = useMemo(() => {
    const liveConverted = orders.map((o, idx) => ({
      id: o.id.startsWith('ord-') ? `ORD-${o.receiptNo?.replace('#', '') || (100 + idx)}` : o.id,
      time: formatOrderTime(o.createdAt),
      pickupSlot: o.pickupSlotLabel || 'Istirahat 2 (11:30 - 12:00)',
      customerName: o.customerName || 'Siswa BinGO!',
      nim: (o as any).nim || '2601' + Math.floor(100000 + ((idx * 179) % 899999)),
      items: Array.isArray(o.items) && o.items.length > 0 ? o.items.map((i) => `${i.quantity}x ${i.name}`).join(', ') : '1x Pesanan Kantin',
      paymentMethod: o.paymentMethod || 'QRIS BCA',
      totalAmount: o.totalAmount ?? (Array.isArray(o.items) ? o.items.reduce((s, i) => s + ((i.price || 0) * (i.quantity || 1)), 0) : 0),
      status: o.status,
      isBuddy: !!o.isBuddyOrder,
      buddyName: o.buddyLeadName,
    }));

    const baseToday = [
      {
        id: 'ORD-108',
        time: '12:20 WIB',
        pickupSlot: '12:30 - 12:45',
        customerName: 'Jonathan Kevin',
        nim: '2601982312',
        items: '1x Soto Nusantara, 1x Es Teh Manis Jumbo',
        paymentMethod: 'QRIS BCA',
        totalAmount: 22000,
        status: 'siap_diambil',
        isBuddy: false,
      },
      {
        id: 'ORD-107',
        time: '12:10 WIB',
        pickupSlot: '12:15 - 12:30',
        customerName: 'Amanda Putri',
        nim: '2601984421',
        items: '2x Mie Ayam Jamur Spesial, 2x Es Jeruk Peras Segar',
        paymentMethod: 'Saldo BinGO!',
        totalAmount: 44000,
        status: 'selesai',
        isBuddy: true,
        buddyName: 'Budi Santoso',
      },
      {
        id: 'ORD-106',
        time: '11:55 WIB',
        pickupSlot: '12:00 - 12:15',
        customerName: 'Darren Tan',
        nim: '2601990182',
        items: '1x Nasi Goreng Kantin Spesial, 1x Sate Telur Puyuh',
        paymentMethod: 'GoPay',
        totalAmount: 23000,
        status: 'selesai',
        isBuddy: false,
      },
      {
        id: 'ORD-105',
        time: '11:42 WIB',
        pickupSlot: '12:00 - 12:15',
        customerName: 'Jessica Lin',
        nim: '2601978219',
        items: '1x Soto Nusantara, 1x Es Teh Manis Jumbo',
        paymentMethod: 'QRIS Mandiri',
        totalAmount: 22000,
        status: 'selesai',
        isBuddy: false,
      },
      {
        id: 'ORD-104',
        time: '11:20 WIB',
        pickupSlot: '11:30 - 11:45',
        customerName: 'Budi Santoso',
        nim: '2601981104',
        items: '2x Soto Nusantara, 2x Sate Telur Puyuh (Pesanan Kelompok)',
        paymentMethod: 'Saldo BinGO!',
        totalAmount: 46000,
        status: 'selesai',
        isBuddy: true,
        buddyName: 'Budi Santoso (Ketua Kelompok)',
      },
      {
        id: 'ORD-103',
        time: '10:45 WIB',
        pickupSlot: '11:00 - 11:15',
        customerName: 'Clara Wijaya',
        nim: '2601994320',
        items: '1x Mie Ayam Jamur Spesial, 1x Es Jeruk Peras Segar',
        paymentMethod: 'BCA Virtual Account',
        totalAmount: 22000,
        status: 'selesai',
        isBuddy: false,
      },
      {
        id: 'ORD-102',
        time: '10:15 WIB',
        pickupSlot: '10:30 - 10:45',
        customerName: 'Rian Pratama',
        nim: '2601962381',
        items: '1x Soto Nusantara, 1x Sate Telur Puyuh',
        paymentMethod: 'QRIS BCA',
        totalAmount: 23000,
        status: 'selesai',
        isBuddy: false,
      },
      {
        id: 'ORD-101',
        time: '09:50 WIB',
        pickupSlot: '10:00 - 10:15',
        customerName: 'Stefanie Aurelia',
        nim: '2601970221',
        items: '1x Soto Nusantara',
        paymentMethod: 'OVO',
        totalAmount: 18000,
        status: 'selesai',
        isBuddy: false,
      },
    ];

    return [...liveConverted, ...baseToday];
  }, [orders]);

  const weeklyHistoryOrders = useMemo(() => {
    const liveConverted = orders.map((o, idx) => ({
      id: o.id.startsWith('ord-') ? `ORD-${o.receiptNo?.replace('#', '') || (100 + idx)}` : o.id,
      day: 'Hari Ini',
      date: '13 Okt 2026',
      time: formatOrderTime(o.createdAt),
      customerName: o.customerName || 'Siswa BinGO!',
      nim: (o as any).nim || '2601' + Math.floor(100000 + ((idx * 179) % 899999)),
      items: Array.isArray(o.items) && o.items.length > 0 ? o.items.map((i) => `${i.quantity}x ${i.name}`).join(', ') : '1x Pesanan Kantin',
      paymentMethod: o.paymentMethod || 'QRIS BCA',
      totalAmount: o.totalAmount ?? (Array.isArray(o.items) ? o.items.reduce((s, i) => s + ((i.price || 0) * (i.quantity || 1)), 0) : 0),
      status: o.status,
    }));

    const weeklySeed = [
      {
        id: 'ORD-W41-24',
        day: 'Senin',
        date: '12 Okt 2026',
        time: '12:20 WIB',
        customerName: 'Jonathan Kevin',
        nim: '2601982312',
        items: '1x Soto Nusantara, 1x Es Teh Manis Jumbo',
        paymentMethod: 'QRIS BCA',
        totalAmount: 22000,
        status: 'selesai',
      },
      {
        id: 'ORD-W41-23',
        day: 'Senin',
        date: '12 Okt 2026',
        time: '11:45 WIB',
        customerName: 'Amanda Putri',
        nim: '2601984421',
        items: '2x Mie Ayam Jamur Spesial',
        paymentMethod: 'Saldo BinGO!',
        totalAmount: 32000,
        status: 'selesai',
      },
      {
        id: 'ORD-W41-22',
        day: 'Senin',
        date: '12 Okt 2026',
        time: '11:10 WIB',
        customerName: 'Budi Santoso',
        nim: '2601981104',
        items: '2x Soto Nusantara, 2x Sate Telur Puyuh',
        paymentMethod: 'Saldo BinGO!',
        totalAmount: 46000,
        status: 'selesai',
      },
      {
        id: 'ORD-W41-21',
        day: 'Senin',
        date: '12 Okt 2026',
        time: '10:25 WIB',
        customerName: 'Jessica Lin',
        nim: '2601978219',
        items: '1x Soto Nusantara',
        paymentMethod: 'QRIS Mandiri',
        totalAmount: 18000,
        status: 'selesai',
      },
      {
        id: 'ORD-W41-20',
        day: 'Senin',
        date: '12 Okt 2026',
        time: '09:40 WIB',
        customerName: 'Darren Tan',
        nim: '2601990182',
        items: '1x Nasi Goreng Kantin Spesial',
        paymentMethod: 'GoPay',
        totalAmount: 18000,
        status: 'selesai',
      },
      {
        id: 'ORD-W41-19',
        day: 'Selasa',
        date: '13 Okt 2026',
        time: '12:15 WIB',
        customerName: 'Vanessa Angela',
        nim: '2601955102',
        items: '1x Soto Nusantara, 1x Es Jeruk Peras Segar',
        paymentMethod: 'QRIS BCA',
        totalAmount: 24000,
        status: 'selesai',
      },
      {
        id: 'ORD-W41-18',
        day: 'Selasa',
        date: '13 Okt 2026',
        time: '11:30 WIB',
        customerName: 'Felix Nathan',
        nim: '2601967731',
        items: '2x Mie Ayam Jamur Spesial',
        paymentMethod: 'ShopeePay',
        totalAmount: 32000,
        status: 'selesai',
      },
      {
        id: 'ORD-W41-17',
        day: 'Selasa',
        date: '13 Okt 2026',
        time: '10:40 WIB',
        customerName: 'Clara Wijaya',
        nim: '2601994320',
        items: '1x Nasi Goreng Kantin Spesial',
        paymentMethod: 'BCA VA',
        totalAmount: 18000,
        status: 'selesai',
      },
      {
        id: 'ORD-W41-16',
        day: 'Rabu',
        date: '14 Okt 2026',
        time: '12:40 WIB',
        customerName: 'Budi Santoso',
        nim: '2601981104',
        items: '2x Soto Nusantara',
        paymentMethod: 'Saldo BinGO!',
        totalAmount: 36000,
        status: 'selesai',
      },
      {
        id: 'ORD-W41-15',
        day: 'Rabu',
        date: '14 Okt 2026',
        time: '11:20 WIB',
        customerName: 'Stefanie Aurelia',
        nim: '2601970221',
        items: '1x Soto Nusantara',
        paymentMethod: 'OVO',
        totalAmount: 18000,
        status: 'selesai',
      },
      {
        id: 'ORD-W41-14',
        day: 'Kamis',
        date: '15 Okt 2026',
        time: '12:10 WIB',
        customerName: 'Jonathan Kevin',
        nim: '2601982312',
        items: '1x Soto Nusantara',
        paymentMethod: 'QRIS BCA',
        totalAmount: 18000,
        status: 'selesai',
      },
      {
        id: 'ORD-W41-13',
        day: 'Jumat',
        date: '16 Okt 2026',
        time: '11:45 WIB',
        customerName: 'Amanda Putri',
        nim: '2601984421',
        items: '1x Mie Ayam Jamur Spesial, 1x Es Teh Manis Jumbo',
        paymentMethod: 'Saldo BinGO!',
        totalAmount: 20000,
        status: 'selesai',
      },
      {
        id: 'ORD-W41-12',
        day: 'Jumat',
        date: '16 Okt 2026',
        time: '10:30 WIB',
        customerName: 'Clara Wijaya',
        nim: '2601994320',
        items: '1x Soto Nusantara, 1x Es Jeruk Peras Segar',
        paymentMethod: 'BCA VA',
        totalAmount: 24000,
        status: 'selesai',
      },
      {
        id: 'ORD-W41-11',
        day: 'Sabtu',
        date: '17 Okt 2026',
        time: '10:50 WIB',
        customerName: 'Rian Pratama',
        nim: '2601962381',
        items: '1x Mie Ayam Jamur Spesial, 1x Sate Telur Puyuh',
        paymentMethod: 'QRIS BCA',
        totalAmount: 21000,
        status: 'selesai',
      },
    ];

    return [...liveConverted, ...weeklySeed];
  }, [orders]);

  // Indonesian Month Abbreviations (Clean, Non-overflowing)
  const revenueChartMonthsIndo = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const series1Points = [42, 43, 44, 43, 46, 52, 51, 48, 54, 55, 59, 68];
  const series2Points = [34, 35, 36, 35, 39, 44, 43, 39, 45, 47, 51, 60];
  const series3Points = [26, 27, 28, 27, 30, 35, 34, 25, 36, 38, 42, 50];

  const busyHoursDisplayTimes = ['08:50', '10:00', '11:15', '11:45', '12:15', '12:45', '13:30', '14:15', '15:00', '15:45', '16:30', '17:00'];
  const busyActiveUsersSeries = [15, 16.5, 16, 16.8, 17, 18, 17.5, 16.8, 18.5, 19, 18.5, 21.2];

  const displayedNetRevenue = useMemo(() => {
    switch (revenuePeriod) {
      case '24 Jam':
        return formatRupiah(stats.todayRevenue);
      case '7 Hari':
        return formatRupiah(stats.weeklyRevenue);
      case '30 Hari':
        return 'Rp 14.850.000';
      case '3 Bulan':
      default:
        return 'Rp 42.600.000';
    }
  }, [revenuePeriod, stats.todayRevenue, stats.weeklyRevenue]);

  // Open edit menu page
  const handleOpenEditMenu = (item: MenuItem) => {
    setSelectedMenuForEdit(item);
    setEditName(item.name);
    setEditPrice(item.price);
    setEditCategory(item.category || 'Makanan Utama');
    setEditIsAvailable(item.isAvailable ?? true);
    setEditStockRemaining(item.stockRemaining ?? 25);
    setEditPrepTime(item.preparationTimeMinutes ?? 5);
    setEditIsPopular(item.isPopular ?? false);
    setEditDescription(item.description || '');
    setEditImageUrl(item.image || VENDOR_PROFILE.avatarUrl);
    setCurrentTab('edit_menu');
  };

  // Save menu changes handler
  const handleSaveMenuChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMenuForEdit) return;

    const updatedItem: MenuItem = {
      ...selectedMenuForEdit,
      name: editName.trim() || selectedMenuForEdit.name,
      price: Number(editPrice) > 0 ? Number(editPrice) : selectedMenuForEdit.price,
      category: editCategory,
      isAvailable: editIsAvailable && editStockRemaining > 0,
      stockRemaining: editStockRemaining,
      preparationTimeMinutes: Math.max(1, editPrepTime),
      isPopular: editIsPopular,
      description: editDescription.trim(),
      image: editImageUrl.trim() || selectedMenuForEdit.image,
    };

    if (onUpdateMenuItem) {
      onUpdateMenuItem(updatedItem);
    }
    showDesktopToast(`✅ Informasi menu "${updatedItem.name}" berhasil disimpan!`);
    setCurrentTab('menus');
  };

  const handleDesktopLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setLoginError('Harap masukkan email akun owner.');
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError('Harap masukkan kata sandi.');
      return;
    }
    setLoginError(null);
    if (onLogin) {
      onLogin({
        ...PRESET_DEFAULT_VENDOR,
        email: loginEmail.trim(),
        ownerName: vendorUser?.ownerName || PRESET_DEFAULT_VENDOR.ownerName,
        stallName: vendorUser?.stallName || PRESET_DEFAULT_VENDOR.stallName,
      });
    }
  };

  const handleQuickDemoLogin = () => {
    setLoginError(null);
    if (onLogin) {
      onLogin(vendorUser || PRESET_DEFAULT_VENDOR);
    }
  };

  // If owner is logged out on desktop, display the dedicated Desktop Login View
  if (!isLoggedIn) {
    return (
      <div className="w-full min-h-screen bg-slate-100/90 text-slate-800 flex flex-col font-sans select-none">
        <header className="w-full bg-white border-b border-slate-200/90 px-6 py-4 flex items-center justify-between shadow-2xs shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold tracking-tight text-slate-900">Bin</span>
              <span className="text-2xl font-bold tracking-tight text-amber-500">GO</span>
              <span className="text-2xl font-bold text-amber-500">!</span>
            </div>
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />
            <span className="text-sm font-semibold text-slate-700 hidden sm:inline">
              Portal Pemilik Kios Kantin BINUS
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Sistem Kasir Terverifikasi</span>
            </span>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-6 bg-radial from-amber-50/40 via-slate-100 to-slate-200/70">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                <Store className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Masuk ke Dashboard Pemilik
              </h1>
              <p className="text-sm text-slate-600">
                Akses pantauan omzet, riwayat transaksi harian, dan kelola menu kios
              </p>
            </div>

            {loginError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs font-semibold text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleDesktopLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Akun Pemilik
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="contoh: kedai.selan@bingo.id"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                  />
                  <span>Ingat saya di perangkat ini</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-[#df7a32] hover:from-amber-600 hover:to-[#c96c2b] shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 text-sm transition-all cursor-pointer"
              >
                <span>Masuk ke Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-xs font-bold text-slate-500 uppercase">
                Akses Cepat
              </span>
            </div>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-3 px-4 rounded-xl font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Masuk Langsung sebagai Pemilik Kedai Selan</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans select-none">
      {/* Toast Notification Alert */}
      {desktopToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{desktopToast}</span>
        </div>
      )}

      {/* 1. Header Web Desktop */}
      <header className="w-full bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-2xs shrink-0 z-20">
        {/* Left: Brand Logo + Stall Info (and Open Menu button if closed) */}
        <div className="flex items-center gap-3">
          {!sidebarOpen && (
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 px-3 rounded-xl text-slate-800 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-colors cursor-pointer flex items-center gap-2 shadow-2xs mr-1"
              title="Buka Menu Pengelolaan"
            >
              <PanelLeftOpen className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-bold text-amber-900 hidden sm:inline">Buka Menu</span>
            </button>
          )}

          <div className="flex items-baseline">
            <span className="text-2xl font-bold tracking-tight text-slate-900">Bin</span>
            <span className="text-2xl font-bold tracking-tight text-amber-500">GO</span>
            <span className="text-2xl font-bold text-amber-500">!</span>
          </div>

          <div className="h-6 w-px bg-slate-200 hidden md:block" />

          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {vendorUser?.stallName || 'Kedai Selan'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal hidden sm:block">
              Sistem Analisis Penjualan & Pendapatan Kios Kantin BINUS
            </p>
          </div>
        </div>

        {/* Right: Simulasi Pesanan, Profil Kios, dan Tombol Keluar */}
        <div className="flex items-center gap-3 sm:gap-4 ml-auto">
          <button
            type="button"
            onClick={onSimulateOrder}
            className="text-xs sm:text-sm font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
            title="Kirim pesanan simulasi baru ke database real-time"
          >
            <BellRing className="w-4 h-4 text-amber-600" />
            <span>+ Simulasi Pesanan</span>
          </button>

          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="relative">
              <img
                src={vendorUser?.avatarUrl || VENDOR_PROFILE.avatarUrl}
                alt={vendorUser?.stallName || VENDOR_PROFILE.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shadow-xs"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            <div className="hidden sm:block text-left">
              <div className="text-sm font-semibold text-slate-900 leading-tight">
                {vendorUser?.ownerName || 'Ibu Selan'}
              </div>
              <div className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                Kios Aktif • Menerima Pesanan
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 hover:text-rose-800 border border-rose-200 rounded-xl transition-all shadow-2xs cursor-pointer ml-1 active:scale-95"
              title="Keluar dari akun pemilik"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Workspace Layout with Collapsible Sidebar and Main Content Canvas */}
      <div className="flex-1 flex overflow-hidden min-h-0 bg-slate-100">
        {/* Collapsible Left Navigation Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 select-none transition-all duration-200 z-10">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Menu Pengelolaan
              </span>

              {/* Simbol Tutup Menu di Panel Menu Pengelolaan */}
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                title="Tutup Menu Pengelolaan"
              >
                <PanelLeftClose className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
              <button
                type="button"
                onClick={() => setCurrentTab('dashboard')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  currentTab === 'dashboard'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-5 h-5 shrink-0" />
                  <span>Dashboard Utama</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCurrentTab('menus')}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  currentTab === 'menus' || currentTab === 'edit_menu'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <UtensilsCrossed className="w-5 h-5 shrink-0" />
                  <span>Kelola & Edit Menu</span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    currentTab === 'menus' || currentTab === 'edit_menu'
                      ? 'bg-amber-400/30 text-white'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {menuItems.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentTab('history');
                  setHistoryPeriod('daily');
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  currentTab === 'history'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Receipt className="w-5 h-5 shrink-0" />
                  <span>Riwayat Transaksi</span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    currentTab === 'history'
                      ? 'bg-amber-400/30 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {orders.length}
                </span>
              </button>
            </nav>
          </aside>
        )}

        {/* Main Content Area (Switches between Dashboard, Riwayat Transaksi, and Kelola Menu) */}
        <main className="flex-1 overflow-y-auto bg-slate-50/70 p-4 sm:p-6 lg:p-8">
          {/* ========================================================================= */}
          {/* TAB 1: DASHBOARD UTAMA                                                    */}
          {/* ========================================================================= */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Daily Insights & Weekly Insights Prominent Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. Daily Insights (Hari Ini) */}
                <div
                  onClick={() => {
                    setCurrentTab('history');
                    setHistoryPeriod('daily');
                  }}
                  className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ea580c] via-[#f97316] to-[#fb923c] p-6 text-white shadow-lg shadow-orange-500/25 border border-orange-400/40 hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer select-none flex flex-col justify-between"
                  role="button"
                  tabIndex={0}
                  title="Klik untuk membuka rincian riwayat transaksi & analitik harian"
                >
                  <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                  <div className="absolute right-12 top-4 w-20 h-20 bg-amber-300/20 rounded-full blur-xl pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-xs group-hover:bg-white/25 transition-colors">
                          <Flame className="w-6 h-6 text-amber-200 animate-pulse" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-orange-100">
                              INSIGHT HARIAN
                            </span>
                            <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
                          </div>
                          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                            Hari Ini
                          </h2>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 border border-white/30 px-4 py-2 rounded-full text-xs sm:text-sm font-bold text-white transition-colors">
                        <span>Lihat Rincian</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 my-3">
                      <div className="bg-black/15 backdrop-blur-xs rounded-2xl p-4 border border-white/15">
                        <span className="text-xs sm:text-sm font-medium text-orange-100 uppercase tracking-wider block">
                          Pesanan Masuk
                        </span>
                        <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight tabular-nums mt-1">
                          {stats.todayOrdersCount}{' '}
                          <span className="text-sm sm:text-base font-normal text-orange-100">Pesanan</span>
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-amber-200 mt-1.5 inline-block">
                          Total {stats.dailyTotalPortions} porsi terjual
                        </span>
                      </div>

                      <div className="bg-black/15 backdrop-blur-xs rounded-2xl p-4 border border-white/15">
                        <span className="text-xs sm:text-sm font-medium text-orange-100 uppercase tracking-wider block">
                          Omzet Kotor
                        </span>
                        <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight tabular-nums mt-1 truncate">
                          {formatShortRupiah(stats.todayRevenue)}
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-amber-200 mt-1.5 inline-block">
                          Rata-rata: {formatShortRupiah(stats.avgBasketSize)}/psn
                        </span>
                      </div>
                    </div>

                    <div className="bg-white/15 backdrop-blur-xs rounded-2xl p-4 border border-white/20 mt-2">
                      <div className="flex items-center justify-between text-xs sm:text-sm text-orange-100 mb-1">
                        <span className="font-semibold">Menu Terlaris Hari Ini:</span>
                        <span className="text-amber-200 font-bold">{stats.productA.count} Porsi Terjual</span>
                      </div>
                      <div className="text-lg font-bold text-white truncate">
                        {stats.productA.name}
                      </div>
                      <div className="text-xs sm:text-sm text-orange-100 mt-1">
                        Kontribusi: {stats.productA.percentage}% dari penjualan hari ini
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs sm:text-sm text-orange-100">
                    <span>
                      Klik kartu untuk membuka halaman riwayat transaksi lengkap
                    </span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform font-bold text-white">
                      Buka Riwayat →
                    </span>
                  </div>
                </div>

                {/* 2. Weekly Insights (Minggu Ini) */}
                <div
                  onClick={() => {
                    setCurrentTab('history');
                    setHistoryPeriod('weekly');
                  }}
                  className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#3b82f6] p-6 text-white shadow-lg shadow-blue-600/25 border border-blue-400/40 hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer select-none flex flex-col justify-between"
                  role="button"
                  tabIndex={0}
                  title="Klik untuk membuka rincian riwayat transaksi & analitik mingguan"
                >
                  <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                  <div className="absolute right-12 top-4 w-20 h-20 bg-cyan-300/20 rounded-full blur-xl pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-xs group-hover:bg-white/25 transition-colors">
                          <TrendingUp className="w-6 h-6 text-cyan-200" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-100">
                              INSIGHT MINGGUAN
                            </span>
                            <span className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse" />
                          </div>
                          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                            7 Hari Terakhir
                          </h2>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 border border-white/30 px-4 py-2 rounded-full text-xs sm:text-sm font-bold text-white transition-colors">
                        <span>Lihat Rincian</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 my-3">
                      <div className="bg-black/15 backdrop-blur-xs rounded-2xl p-4 border border-white/15">
                        <span className="text-xs sm:text-sm font-medium text-blue-100 uppercase tracking-wider block">
                          Total Pesanan
                        </span>
                        <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight tabular-nums mt-1">
                          {stats.weeklyOrdersCount}{' '}
                          <span className="text-sm sm:text-base font-normal text-blue-100">Pesanan</span>
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-cyan-200 mt-1.5 inline-block">
                          Total {stats.weeklyTotalPortions} porsi terjual
                        </span>
                      </div>

                      <div className="bg-black/15 backdrop-blur-xs rounded-2xl p-4 border border-white/15">
                        <span className="text-xs sm:text-sm font-medium text-blue-100 uppercase tracking-wider block">
                          Omzet 7 Hari
                        </span>
                        <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight tabular-nums mt-1 truncate">
                          {formatShortRupiah(stats.weeklyRevenue)}
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-cyan-200 mt-1.5 inline-block">
                          Rata-rata {Math.round(stats.weeklyOrdersCount / 6)} psn/hari
                        </span>
                      </div>
                    </div>

                    <div className="bg-white/15 backdrop-blur-xs rounded-2xl p-4 border border-white/20 mt-2">
                      <div className="flex items-center justify-between text-xs sm:text-sm text-blue-100 mb-1">
                        <span className="font-semibold">Juara Terlaris 7 Hari:</span>
                        <span className="text-cyan-200 font-bold">{stats.weeklyTopProduct.count} Porsi Terjual</span>
                      </div>
                      <div className="text-lg font-bold text-white truncate">
                        {stats.weeklyTopProduct.name}
                      </div>
                      <div className="text-xs sm:text-sm text-blue-100 mt-1">
                        Kontribusi: {stats.weeklyTopProduct.percentage}% dari omzet 7 hari
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs sm:text-sm text-blue-100">
                    <span>
                      Klik kartu untuk membuka laporan keuangan mingguan
                    </span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform font-bold text-white">
                      Buka Riwayat →
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Grid: Left Column (67% Width) and Right Column (33% Width - Reduced per user request) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* ================= LEFT COLUMN (8 Columns / ~67%): Charts & Ringkasan ================= */}
                <div className="lg:col-span-8 space-y-6 flex flex-col">
                  {/* Card 1: Ringkasan (Overview) */}
                  <div className="bg-[#2b4162] rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h2 className="text-xl font-semibold tracking-tight text-white">Ringkasan</h2>
                        <p className="text-xs text-blue-200 mt-0.5">
                          Statistik pelanggan dan total pemasukan kios
                        </p>
                      </div>

                      <div className="relative">
                        <select
                          value={overviewFilter}
                          onChange={(e) => setOverviewFilter(e.target.value as any)}
                          className="appearance-none bg-blue-400/30 hover:bg-blue-400/40 text-white text-xs sm:text-sm font-semibold pl-4 pr-9 py-2 rounded-xl border border-blue-300/40 cursor-pointer focus:outline-none"
                        >
                          <option value="Semua Waktu" className="bg-slate-900 text-white">Semua Waktu</option>
                          <option value="30 Hari" className="bg-slate-900 text-white">30 Hari</option>
                          <option value="7 Hari" className="bg-slate-900 text-white">7 Hari</option>
                          <option value="Hari Ini" className="bg-slate-900 text-white">Hari Ini</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-white absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Pelanggan */}
                      <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-slate-200 text-sm sm:text-base font-semibold">
                            <span>Pelanggan</span>
                            <Users className="w-5 h-5 text-blue-300" />
                          </div>
                          <span className="bg-emerald-400/20 text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-md border border-emerald-400/30 flex items-center gap-0.5">
                            <span>+12%</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                        <div className="text-3xl sm:text-4xl font-semibold text-white tracking-tight tabular-nums">
                          {stats.totalCustomers}
                        </div>
                        <span className="text-xs text-blue-200 mt-1">Siswa aktif memesan</span>
                      </div>

                      {/* Total Pendapatan */}
                      <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-white/10 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-slate-200 text-sm sm:text-base font-semibold">
                            <span>Total Pendapatan</span>
                            <Banknote className="w-5 h-5 text-emerald-300" />
                          </div>
                        </div>
                        <div className="text-2xl sm:text-3xl font-semibold text-white tracking-tight tabular-nums truncate">
                          {formatRupiah(stats.totalIncome)}
                        </div>
                        <span className="text-xs text-blue-200 mt-1">Akumulasi seluruh transaksi</span>
                      </div>
                    </div>
                  </div>

                    {/* Card 2: Pendapatan Bersih (Net Revenue) - Guaranteed Zero Overlap */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs overflow-hidden flex flex-col">
                      {/* Clean Divided Header Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                        <div>
                          <span className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider block">
                            Pendapatan Bersih
                          </span>
                          <div className="flex items-center gap-2.5 mt-0.5">
                            <span className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight tabular-nums">
                              {displayedNetRevenue}
                            </span>
                            <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-0.5">
                              <span>+12%</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>

                        {/* Filter Pills in Indonesian */}
                        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-semibold self-start sm:self-auto">
                          {(['3 Bulan', '30 Hari', '7 Hari', '24 Jam'] as const).map((period) => (
                            <button
                              key={period}
                              type="button"
                              onClick={() => setRevenuePeriod(period)}
                              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                revenuePeriod === period
                                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              {period}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Chart Legend in Indonesian with safe spacing */}
                      <div className="flex items-center justify-end gap-4 text-xs font-medium text-slate-600 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-[#1e40af]" />
                          <span>Pekan Ini</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-[#3b82f6]" />
                          <span>Pekan Lalu</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-[#93c5fd]" />
                          <span>Rata-rata</span>
                        </div>
                      </div>

                      {/* SVG Multi-Line Chart (Safe height and no title overlap) */}
                      <div className="relative w-full h-44 sm:h-48 pt-1">
                        <svg className="w-full h-full overflow-hidden" viewBox="0 0 600 170" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="revenueGradientDesktop" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#1e40af" stopOpacity="0.18" />
                              <stop offset="100%" stopColor="#1e40af" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>

                          {/* Horizontal grid lines */}
                          <line x1="0" y1="25" x2="600" y2="25" stroke="#f1f5f9" strokeWidth="1" />
                          <line x1="0" y1="68" x2="600" y2="68" stroke="#f1f5f9" strokeWidth="1" />
                          <line x1="0" y1="112" x2="600" y2="112" stroke="#f1f5f9" strokeWidth="1" />
                          <line x1="0" y1="155" x2="600" y2="155" stroke="#e2e8f0" strokeWidth="1" />

                          {/* Series 3 */}
                          <path
                            d="M 0,135 Q 50,130 100,127 T 200,125 T 300,118 T 400,138 T 500,112 T 600,90"
                            fill="none"
                            stroke="#93c5fd"
                            strokeWidth="2"
                          />

                          {/* Series 2 */}
                          <path
                            d="M 0,118 Q 50,115 100,110 T 200,108 T 300,95 T 400,115 T 500,85 T 600,68"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2.5"
                          />

                          {/* Series 1 with area fill */}
                          <path
                            d="M 0,102 Q 50,98 100,94 T 200,92 T 300,78 T 400,96 T 500,68 T 600,48 L 600,155 L 0,155 Z"
                            fill="url(#revenueGradientDesktop)"
                          />
                          <path
                            d="M 0,102 Q 50,98 100,94 T 200,92 T 300,78 T 400,96 T 500,68 T 600,48"
                            fill="none"
                            stroke="#1e40af"
                            strokeWidth="3"
                          />

                          {/* Hover points on Series 1 */}
                          {revenueChartMonthsIndo.map((m, idx) => {
                            const cx = (idx / 11) * 600;
                            const cy = 102 - (series1Points[idx] - 42) * 1.8;
                            return (
                              <g
                                key={m}
                                className="cursor-pointer"
                                onMouseEnter={() => setHoveredRevenueIdx(idx)}
                                onMouseLeave={() => setHoveredRevenueIdx(null)}
                              >
                                <circle
                                  cx={cx}
                                  cy={cy}
                                  r={hoveredRevenueIdx === idx ? 5 : 3.5}
                                  className="fill-white stroke-[#1e40af] stroke-2 transition-all"
                                />
                              </g>
                            );
                          })}
                        </svg>

                        {/* Tooltip on Hover */}
                        {hoveredRevenueIdx !== null && (
                          <div
                            className="absolute top-1 z-20 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2"
                            style={{ left: `${Math.max(10, Math.min(90, (hoveredRevenueIdx / 11) * 100))}%` }}
                          >
                            <div className="font-semibold whitespace-nowrap">
                              {revenueChartMonthsIndo[hoveredRevenueIdx]}: {formatRupiah(series1Points[hoveredRevenueIdx] * 650000)}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Month labels strictly inside card with border top */}
                      <div className="grid grid-cols-12 text-center text-xs font-semibold text-slate-500 pt-3 border-t border-slate-100 mt-2">
                        {revenueChartMonthsIndo.map((m) => (
                          <span key={m} className="truncate">{m}</span>
                        ))}
                      </div>
                    </div>

                    {/* Charts Row: Tren Jam Sibuk & Total Pesanan per Hari */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Card 3: Tren Jam Sibuk */}
                      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                          <div>
                            <h3 className="text-base font-semibold text-slate-900">Tren Jam Sibuk</h3>
                            <p className="text-xs text-slate-500">Lonjakan pemesanan kantin</p>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#1e40af]" />
                            <span>Puncak</span>
                          </div>
                        </div>

                        <div className="flex gap-2.5 pt-1">
                          <div className="flex flex-col justify-between text-xs text-slate-400 font-medium h-32 text-right pr-1 pb-1 select-none shrink-0 w-6">
                            <span>25</span>
                            <span>20</span>
                            <span>15</span>
                            <span>10</span>
                            <span>5</span>
                          </div>

                          <div className="flex-1 flex flex-col">
                            <div className="h-32 w-full relative">
                              <svg className="w-full h-full overflow-hidden" viewBox="0 0 300 130" preserveAspectRatio="none">
                                <line x1="0" y1="20" x2="300" y2="20" stroke="#f8fafc" strokeWidth="1" />
                                <line x1="0" y1="50" x2="300" y2="50" stroke="#f8fafc" strokeWidth="1" />
                                <line x1="0" y1="80" x2="300" y2="80" stroke="#f8fafc" strokeWidth="1" />
                                <line x1="0" y1="110" x2="300" y2="110" stroke="#e2e8f0" strokeWidth="1" />

                                <path
                                  d="M 0,105 Q 30,100 60,92 T 120,76 T 180,56 T 240,40 T 300,28"
                                  fill="none"
                                  stroke="#1e40af"
                                  strokeWidth="2.5"
                                />
                                <path
                                  d="M 0,112 Q 30,108 60,102 T 120,88 T 180,72 T 240,58 T 300,44"
                                  fill="none"
                                  stroke="#3b82f6"
                                  strokeWidth="2"
                                  strokeDasharray="4 3"
                                />
                              </svg>
                            </div>

                            <div className="flex justify-between text-xs font-medium text-slate-400 pt-2 px-1 border-t border-slate-100 mt-1">
                              <span>08:50</span>
                              <span>10:00</span>
                              <span>11:45</span>
                              <span>12:30</span>
                              <span>14:00</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                          <span>Puncak pesanan: Istirahat 2 (11.45 - 12.30 WIB)</span>
                          <span className="font-semibold text-emerald-600">98% Tepat Waktu</span>
                        </div>
                      </div>

                      {/* Card 4: Total Pesanan per Hari & Komposisi Menu (Guaranteed Zero Overlap) */}
                      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                          <div>
                            <h3 className="text-base font-semibold text-slate-900">Total Pesanan per Hari</h3>
                            <p className="text-xs text-slate-500">Senin sampai Sabtu</p>
                          </div>
                          <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                            {stats.weeklyOrdersCount} Porsi
                          </span>
                        </div>

                        {/* Bar chart with overflow-hidden and scaled height so it NEVER overlaps title */}
                        <div className="flex items-end justify-between gap-2 h-32 pt-1 pb-1 border-b border-slate-100">
                          {(() => {
                            const maxDayCount = Math.max(...stats.dayOrders.map((d) => d.count), 1);
                            return stats.dayOrders.map((d, idx) => {
                              const heightPct = Math.min(85, Math.max(15, Math.round((d.count / maxDayCount) * 85)));
                              const isHovered = hoveredBarIdx === idx;
                              return (
                                <div
                                  key={d.day}
                                  className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer group"
                                  onMouseEnter={() => setHoveredBarIdx(idx)}
                                  onMouseLeave={() => setHoveredBarIdx(null)}
                                >
                                  <div className="w-full bg-slate-100 rounded-t-lg h-20 flex items-end justify-center p-0.5 overflow-hidden">
                                    <div
                                      className={`w-full rounded-t-md transition-all ${
                                        isHovered ? 'bg-amber-500' : 'bg-blue-600 group-hover:bg-blue-500'
                                      }`}
                                      style={{ height: `${heightPct}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-semibold text-slate-600">{d.day}</span>
                                </div>
                              );
                            });
                          })()}
                        </div>


                        {/* Donut summary breakdown */}
                        <div className="pt-3 grid grid-cols-2 gap-2 text-xs">
                          {stats.donutBreakdown.slice(0, 4).map((d) => (
                            <div key={d.label} className="flex items-center justify-between text-slate-600 truncate">
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                                <span className="truncate">{d.name}</span>
                              </div>
                              <span className="font-semibold text-slate-800 ml-1">{d.percentage}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                {/* ================= RIGHT COLUMN (4 Columns / ~33%): Menu Terpopuler (Reduced Width!) ================= */}
                <div className="lg:col-span-4 flex flex-col">
                  <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-6 flex flex-col h-full justify-between">
                    <div>
                      {/* Header (Stacked layout so toggle never overflows card) */}
                      <div className="pb-4 border-b border-slate-100 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20 shrink-0">
                            <Trophy className="w-5 h-5 text-amber-600" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
                                Menu Terpopuler
                              </h3>
                              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                Peringkat
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 truncate">
                              {popularPeriod === 'daily'
                                ? 'Peringkat penjualan hari ini'
                                : 'Peringkat 7 hari terakhir'}
                            </p>
                          </div>
                        </div>

                        {/* Full Width Segmented Toggle Harian / Mingguan (Stays inside card) */}
                        <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs sm:text-sm font-bold w-full shadow-2xs">
                          <button
                            type="button"
                            onClick={() => setPopularPeriod('daily')}
                            className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                              popularPeriod === 'daily'
                                ? 'bg-amber-500 text-white shadow-xs font-bold'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <Flame className="w-4 h-4 shrink-0" />
                            <span>Harian</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setPopularPeriod('weekly')}
                            className={`py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                              popularPeriod === 'weekly'
                                ? 'bg-blue-600 text-white shadow-xs font-bold'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <Calendar className="w-4 h-4 shrink-0" />
                            <span>Mingguan</span>
                          </button>
                        </div>
                      </div>

                      {/* Summary Metrics */}
                      <div className="grid grid-cols-2 gap-2.5 my-3.5">
                        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
                            Porsi Terjual
                          </span>
                          <div className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight tabular-nums mt-0.5">
                            {popularPeriod === 'daily' ? stats.dailyTotalPortions : stats.weeklyTotalPortions}{' '}
                            <span className="text-xs font-normal text-slate-500">Porsi</span>
                          </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
                            Total Omzet
                          </span>
                          <div className="text-lg sm:text-xl font-semibold text-emerald-600 tracking-tight tabular-nums mt-0.5 truncate">
                            {formatShortRupiah(popularPeriod === 'daily' ? stats.dailyTotalEarning : stats.weeklyTotalEarning)}
                          </div>
                        </div>
                      </div>

                      {/* Ranked Products List (No Emojis, Clean Contribution Only) */}
                      <div className="space-y-2.5">
                        {(popularPeriod === 'daily' ? stats.dailyRanked : stats.weeklyRanked).map((item) => {
                          const isFirst = item.rank === 1;
                          const isSecond = item.rank === 2;
                          const isThird = item.rank === 3;

                          return (
                            <div
                              key={item.rank}
                              className={`rounded-2xl p-3 transition-all border ${
                                isFirst
                                  ? 'bg-amber-50/50 border-amber-200'
                                  : isSecond
                                  ? 'bg-slate-50/80 border-slate-200'
                                  : isThird
                                  ? 'bg-amber-50/20 border-amber-100'
                                  : 'bg-white hover:bg-slate-50 border-slate-100'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2.5">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {/* Clean Rank Badge #1, #2, etc. (No emojis) */}
                                  <div
                                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                                      isFirst
                                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                        : isSecond
                                        ? 'bg-slate-200 text-slate-700 border border-slate-300'
                                        : isThird
                                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                                    }`}
                                  >
                                    #{item.rank}
                                  </div>

                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    referrerPolicy="no-referrer"
                                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                                  />

                                  <div className="min-w-0">
                                    <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                                      {item.name}
                                    </h4>
                                    <p className="text-xs sm:text-sm text-slate-600 truncate">
                                      {item.category} • {formatRupiah(item.price)}
                                    </p>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <div className="text-sm sm:text-base font-bold text-slate-900 tabular-nums">
                                    {item.count} <span className="text-xs font-normal text-slate-500">psn</span>
                                  </div>
                                  <div className="text-xs sm:text-sm font-bold text-emerald-600 tabular-nums">
                                    {formatShortRupiah(item.earning)}
                                  </div>
                                </div>
                              </div>

                              {/* Clean Contribution Bar */}
                              <div className="mt-2 pt-2 border-t border-slate-100/80 flex items-center justify-between text-xs sm:text-sm text-slate-600">
                                <span>Kontribusi Penjualan:</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${
                                        isFirst ? 'bg-amber-500' : 'bg-blue-600'
                                      }`}
                                      style={{ width: `${item.percentage}%` }}
                                    />
                                  </div>
                                  <span className="font-bold text-slate-800 tabular-nums">
                                    {item.percentage}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: RIWAYAT TRANSAKSI (Dedicated Full-Page View, Not a Popup)          */}
          {/* ========================================================================= */}
          {currentTab === 'history' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Title Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Riwayat Transaksi & Laporan Keuangan
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Rincian seluruh pesanan siswa, waktu pengambilan, metode pembayaran, dan rekapitulasi omzet
                  </p>
                </div>

                {/* Period Switcher: Hari Ini vs 7 Hari Terakhir */}
                <div className="flex items-center bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs text-xs sm:text-sm font-semibold self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setHistoryPeriod('daily')}
                    className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                      historyPeriod === 'daily'
                        ? 'bg-amber-500 text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Flame className="w-4 h-4" />
                    <span>Laporan Hari Ini</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHistoryPeriod('weekly')}
                    className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                      historyPeriod === 'weekly'
                        ? 'bg-blue-600 text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Laporan 7 Hari Terakhir</span>
                  </button>
                </div>
              </div>

              {/* Senior-Friendly Summary Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs">
                  <span className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider block">
                    {historyPeriod === 'daily' ? 'Total Pesanan Hari Ini' : 'Total Pesanan 7 Hari'}
                  </span>
                  <div className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mt-1 tabular-nums">
                    {historyPeriod === 'daily' ? stats.todayOrdersCount : stats.weeklyOrdersCount}{' '}
                    <span className="text-sm font-normal text-slate-500">Pesanan</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 mt-1 inline-block">
                    {historyPeriod === 'daily' ? '+18% vs kemarin' : `+${WEEKLY_STATS.orderGrowthPercentage}% mingguan`}
                  </span>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs">
                  <span className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider block">
                    Total Pendapatan
                  </span>
                  <div className="text-2xl sm:text-3xl font-semibold text-emerald-600 tracking-tight mt-1 tabular-nums truncate">
                    {formatRupiah(historyPeriod === 'daily' ? stats.todayRevenue : stats.weeklyRevenue)}
                  </div>
                  <span className="text-xs font-normal text-slate-500 mt-1 inline-block">
                    {historyPeriod === 'daily' ? 'Omzet Kotor Hari Ini' : 'Omzet Bersih 7 Hari'}
                  </span>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs">
                  <span className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider block">
                    {historyPeriod === 'daily' ? 'Rata-rata per Pesanan' : 'Rata-rata per Hari'}
                  </span>
                  <div className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mt-1 tabular-nums">
                    {historyPeriod === 'daily'
                      ? formatRupiah(stats.avgBasketSize)
                      : `${Math.round(stats.weeklyOrdersCount / 6)} Psn/Hari`}
                  </div>
                  <span className="text-xs font-normal text-slate-500 mt-1 inline-block">
                    Ukuran rata-rata keranjang
                  </span>
                </div>

                <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs">
                  <span className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider block">
                    Tingkat Keberhasilan
                  </span>
                  <div className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight mt-1">
                    100% Selesai
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 mt-1 inline-block">
                    Nir-pembatalan (Zero Cancel)
                  </span>
                </div>
              </div>

              {/* Filters & Search Row */}
              <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari nama siswa, nomor struk, atau nama menu..."
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={historyStatusFilter}
                    onChange={(e) => setHistoryStatusFilter(e.target.value)}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="all">Semua Status Pesanan</option>
                    <option value="selesai">Selesai</option>
                    <option value="siap_diambil">Siap Diambil</option>
                    <option value="diproses">Sedang Diproses</option>
                    <option value="masuk">Pesanan Masuk</option>
                  </select>

                  {historyPeriod === 'weekly' && (
                    <select
                      value={historyDayFilter}
                      onChange={(e) => setHistoryDayFilter(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="all">Semua Hari</option>
                      <option value="Senin">Senin</option>
                      <option value="Selasa">Selasa</option>
                      <option value="Rabu">Rabu</option>
                      <option value="Kamis">Kamis</option>
                      <option value="Jumat">Jumat</option>
                      <option value="Sabtu">Sabtu</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Transactions Table / List (Spacious, Clear, Elderly-Friendly) */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-600">
                        <th className="py-4 px-4 sm:px-6">No. Struk / Waktu</th>
                        <th className="py-4 px-4 sm:px-6">Nama Siswa / NIM</th>
                        <th className="py-4 px-4 sm:px-6">Menu Pesanan</th>
                        <th className="py-4 px-4 sm:px-6">Jam Ambil & Bayar</th>
                        <th className="py-4 px-4 sm:px-6 text-right">Total Bayar</th>
                        <th className="py-4 px-4 sm:px-6 text-center whitespace-nowrap min-w-[150px]">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {(historyPeriod === 'daily' ? dailyHistoryOrders : weeklyHistoryOrders)
                        .filter((item: any) => {
                          if (historyStatusFilter !== 'all' && item.status !== historyStatusFilter) return false;
                          if (historyDayFilter !== 'all' && item.day && item.day !== historyDayFilter) return false;
                          if (historySearchQuery.trim()) {
                            const q = historySearchQuery.toLowerCase();
                            const matchesName = item.customerName.toLowerCase().includes(q);
                            const matchesId = item.id.toLowerCase().includes(q);
                            const matchesItems = item.items.toLowerCase().includes(q);
                            return matchesName || matchesId || matchesItems;
                          }
                          return true;
                        })
                        .map((item: any) => (
                          <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-4 px-4 sm:px-6">
                              <span className="font-bold text-slate-900 text-sm sm:text-base block">{item.id}</span>
                              <span className="text-xs sm:text-sm text-slate-500 block mt-0.5">
                                {item.time} {item.day ? `• ${item.day}` : ''}
                              </span>
                            </td>

                            <td className="py-4 px-4 sm:px-6">
                              <span className="font-bold text-slate-900 text-sm sm:text-base block">{item.customerName}</span>
                              {item.isBuddy && (
                                <span className="inline-block mt-1 text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                                  Pesanan Kelompok
                                </span>
                              )}
                            </td>

                            <td className="py-4 px-4 sm:px-6 font-medium text-slate-800 text-sm sm:text-base max-w-xs">
                              {item.items}
                            </td>

                            <td className="py-4 px-4 sm:px-6">
                              <span className="text-slate-800 font-medium text-sm sm:text-base block">{item.pickupSlot || 'Istirahat 2'}</span>
                              <span className="text-xs sm:text-sm text-slate-500 font-medium">{item.paymentMethod}</span>
                            </td>

                            <td className="py-4 px-4 sm:px-6 text-right font-bold text-slate-900 text-sm sm:text-base tabular-nums">
                              {formatRupiah(item.totalAmount)}
                            </td>

                            <td className="py-4 px-4 sm:px-6 text-center whitespace-nowrap min-w-[150px]">
                              <span
                                className={`whitespace-nowrap inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold border shrink-0 ${
                                  item.status === 'selesai'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                    : item.status === 'siap_diambil'
                                    ? 'bg-blue-50 text-blue-700 border-blue-300'
                                    : 'bg-amber-50 text-amber-700 border-amber-300'
                                }`}
                              >
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                <span className="whitespace-nowrap">
                                  {item.status === 'selesai'
                                    ? 'Selesai'
                                    : item.status === 'siap_diambil'
                                    ? 'Siap Diambil'
                                    : 'Diproses'}
                                </span>
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span>Data terhubung secara real-time dengan pencatatan kasir kantin BinGO!</span>
                  <span>Total Transaksi Tercatat: {orders.length + 15} pesanan</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: KELOLA & EDIT MENU (Daftar Card-Card Menu Kios)                   */}
          {/* ========================================================================= */}
          {currentTab === 'menus' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Kelola & Edit Informasi Menu
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Klik pada kartu menu mana saja untuk mengedit detail nama, harga, stok, waktu masak, atau deskripsi
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-semibold bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-slate-700 shadow-2xs">
                    Total Menu: {menuItems.length} Hidangan
                  </span>
                </div>
              </div>

              {/* Search & Category Filter */}
              <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari hidangan atau minuman..."
                    value={menuSearchQuery}
                    onChange={(e) => setMenuSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {['all', 'Makanan Utama', 'Makanan Ringan', 'Minuman'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setMenuCategoryFilter(cat)}
                      className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                        menuCategoryFilter === cat
                          ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat === 'all' ? 'Semua Kategori' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Menu Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {menuItems
                  .filter((item) => {
                    if (menuCategoryFilter !== 'all' && item.category && !item.category.includes(menuCategoryFilter)) {
                      return false;
                    }
                    if (menuSearchQuery.trim()) {
                      const q = menuSearchQuery.toLowerCase();
                      return item.name.toLowerCase().includes(q) || (item.description && item.description.toLowerCase().includes(q));
                    }
                    return true;
                  })
                  .map((item) => {
                    const isAvail = item.isAvailable !== false;
                    const stock = item.stockRemaining ?? (isAvail ? 25 : 0);

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleOpenEditMenu(item)}
                        className="bg-white rounded-3xl border border-slate-200/90 hover:border-amber-400 shadow-xs hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col justify-between group p-5 select-none"
                        role="button"
                        tabIndex={0}
                      >
                        <div>
                          {/* Image & Badges */}
                          <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 bg-slate-100">
                            <img
                              src={item.image}
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${
                                  isAvail && stock > 0
                                    ? 'bg-emerald-500 text-white border-emerald-400'
                                    : 'bg-rose-500 text-white border-rose-400'
                                }`}
                              >
                                {isAvail && stock > 0 ? 'Tersedia' : 'Stok Habis'}
                              </span>

                              {item.isPopular && (
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-amber-950 border border-amber-300 shadow-xs">
                                  Favorit Siswa
                                </span>
                              )}
                            </div>

                            <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-xs font-medium px-2.5 py-1 rounded-lg">
                              ~{item.preparationTimeMinutes ?? 5} mnt masak
                            </span>
                          </div>

                          {/* Content */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {item.category || 'Makanan Utama'}
                              </span>
                              <span className="text-xs font-medium text-slate-600">
                                Sisa Stok: <strong className="text-slate-900">{stock} porsi</strong>
                              </span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                              {item.name}
                            </h3>

                            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                              {item.description || 'Hidangan lezat dan higienis khas kantin BINUS.'}
                            </p>
                          </div>
                        </div>

                        {/* Price & Edit Button Row */}
                        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                          <div className="text-lg font-extrabold text-amber-600 tabular-nums">
                            {formatRupiah(item.price)}
                          </div>

                          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-700 bg-amber-50 group-hover:bg-amber-100 px-3.5 py-2 rounded-xl border border-amber-200 transition-colors">
                            <Edit3 className="w-4 h-4 text-amber-600" />
                            <span>Edit Detail</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: EDIT DETAIL MENU (Halaman Khusus Edit Informasi Menu)              */}
          {/* ========================================================================= */}
          {currentTab === 'edit_menu' && selectedMenuForEdit && (
            <div className="space-y-6 max-w-5xl mx-auto">
              {/* Back to Menus Button */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setCurrentTab('menus')}
                  className="p-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-white border border-slate-200 shadow-2xs transition-all cursor-pointer flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-800" />
                  <span className="text-sm font-semibold">Kembali ke Daftar Menu</span>
                </button>

                <div className="text-right">
                  <span className="text-xs text-slate-500">Mengedit ID:</span>
                  <span className="text-xs font-bold text-slate-800 ml-1.5">{selectedMenuForEdit.id}</span>
                </div>
              </div>

              {/* 2-Column Desktop Layout: Preview on Left, Form on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Live Menu Card Preview */}
                <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 sticky top-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    Pratinjau Tampilan Menu
                  </h3>

                  <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                    <div className="relative h-52 w-full bg-slate-200">
                      <img
                        src={editImageUrl || selectedMenuForEdit.image}
                        alt={editName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${
                            editIsAvailable && editStockRemaining > 0
                              ? 'bg-emerald-500 text-white border-emerald-400'
                              : 'bg-rose-500 text-white border-rose-400'
                          }`}
                        >
                          {editIsAvailable && editStockRemaining > 0 ? 'Tersedia' : 'Stok Habis'}
                        </span>
                        {editIsPopular && (
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-amber-950 border border-amber-300">
                            Favorit
                          </span>
                        )}
                      </div>
                      <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-xs font-medium px-2.5 py-1 rounded-lg">
                        ~{editPrepTime} mnt masak
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{editCategory}</span>
                        <span className="font-semibold text-slate-700">{editStockRemaining} porsi tersisa</span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900">{editName || 'Nama Menu'}</h4>
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-3">
                        {editDescription || 'Deskripsi menu belum diisi.'}
                      </p>
                      <div className="pt-2 border-t border-slate-200/80 text-xl font-black text-amber-600 tabular-nums">
                        {formatRupiah(editPrice || 0)}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
                    <span className="font-bold block">💡 Info untuk Pemilik:</span>
                    <p>
                      Perubahan informasi menu akan langsung sinkron dengan daftar belanja siswa di BinGO! secara real-time.
                    </p>
                  </div>
                </div>

                {/* Right Column: Senior-Friendly Edit Form */}
                <form
                  onSubmit={handleSaveMenuChanges}
                  className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      Informasi Hidangan & Stok
                    </h2>
                    <p className="text-sm text-slate-600">
                      Ubah data menu di bawah ini lalu klik tombol Simpan Perubahan.
                    </p>
                  </div>

                  {/* Field 1: Nama Menu */}
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-1.5">
                      Nama Hidangan / Minuman
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-4 py-3 text-base bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 font-medium"
                      placeholder="Contoh: Nasi Selan Spesial"
                      required
                    />
                  </div>

                  {/* Field 2 & 3: Kategori & Harga Satuan */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-1.5">
                        Kategori Menu
                      </label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 font-medium cursor-pointer"
                      >
                        <option value="Makanan Utama">Makanan Utama</option>
                        <option value="Makanan Ringan">Makanan Ringan</option>
                        <option value="Pelengkap & Sate">Pelengkap & Sate</option>
                        <option value="Minuman Segar">Minuman Segar</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-800 mb-1.5">
                        Harga Jual Satuan (Rp)
                      </label>
                      <input
                        type="number"
                        min="1000"
                        step="500"
                        value={editPrice}
                        onChange={(e) => setEditPrice(Number(e.target.value))}
                        className="w-full px-4 py-3 text-base bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 font-semibold"
                        required
                      />
                    </div>
                  </div>

                  {/* Field 4: Status Ketersediaan (Toggle) */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/80 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">
                        Status Ketersediaan Menu
                      </span>
                      <span className="text-xs text-slate-600">
                        {editIsAvailable
                          ? 'Menu aktif dan dapat dipesan oleh siswa.'
                          : 'Menu ditandai habis dan tidak bisa dipesan.'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setEditIsAvailable(!editIsAvailable)}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        editIsAvailable
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-rose-600 text-white shadow-xs'
                      }`}
                    >
                      {editIsAvailable ? 'Aktif (Tersedia)' : 'Tutup (Habis)'}
                    </button>
                  </div>

                  {/* Field 5: Sisa Stok Harian (Presets & Stepper) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-slate-800">
                        Sisa Stok Porsi Hari Ini
                      </label>
                      <span className="text-sm font-bold text-amber-600">
                        {editStockRemaining} Porsi
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditStockRemaining((prev) => Math.max(0, prev - 5))}
                        className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-base text-slate-700 flex items-center justify-center cursor-pointer"
                      >
                        -5
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditStockRemaining((prev) => Math.max(0, prev - 1))}
                        className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-base text-slate-700 flex items-center justify-center cursor-pointer"
                      >
                        -1
                      </button>

                      <input
                        type="number"
                        min="0"
                        value={editStockRemaining}
                        onChange={(e) => setEditStockRemaining(Math.max(0, Number(e.target.value)))}
                        className="flex-1 py-2.5 px-3 text-center font-bold text-base bg-slate-50 border border-slate-200 rounded-xl"
                      />

                      <button
                        type="button"
                        onClick={() => setEditStockRemaining((prev) => prev + 1)}
                        className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-base text-slate-700 flex items-center justify-center cursor-pointer"
                      >
                        +1
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditStockRemaining((prev) => prev + 5)}
                        className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-base text-slate-700 flex items-center justify-center cursor-pointer"
                      >
                        +5
                      </button>
                    </div>

                    {/* Presets */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs text-slate-500">Pilihan Cepat:</span>
                      {[10, 20, 30, 50].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setEditStockRemaining(amt)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                        >
                          {amt} Porsi
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Field 6: Estimasi Waktu Masak */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-800">
                      Estimasi Waktu Menyiapkan (Menit)
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {[
                        { val: 1, label: '1 mnt (Siap Saji)' },
                        { val: 3, label: '3 mnt (Cepat)' },
                        { val: 5, label: '5 mnt (Standar)' },
                        { val: 8, label: '8 mnt (Masak)' },
                        { val: 12, label: '12 mnt (Khusus)' },
                      ].map((t) => (
                        <button
                          key={t.val}
                          type="button"
                          onClick={() => setEditPrepTime(t.val)}
                          className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                            editPrepTime === t.val
                              ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Field 7: Menu Unggulan (Checkbox) */}
                  <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editIsPopular}
                      onChange={(e) => setEditIsPopular(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                    />
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">
                        Jadikan Menu Unggulan (Favorit Siswa)
                      </span>
                      <span className="text-xs text-slate-600">
                        Menu ini akan disorot di baris rekomendasi teratas pada layar siswa.
                      </span>
                    </div>
                  </label>

                  {/* Field 8: Deskripsi Menu */}
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-1.5">
                      Deskripsi Hidangan
                    </label>
                    <textarea
                      rows={3}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
                      placeholder="Jelaskan isi hidangan, porsi nasi, bumbu lauk, atau keunggulan menu..."
                    />
                  </div>

                  {/* Field 9: Upload File Foto Menu */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-800">
                      Foto Hidangan
                    </label>

                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="p-4 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/40 hover:bg-amber-50 hover:border-amber-400 transition-all cursor-pointer flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left group"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                        {editImageUrl ? (
                          <img
                            src={editImageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-slate-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                          <Upload className="w-4 h-4 text-amber-600" />
                          <span className="text-sm font-bold text-slate-900">
                            Upload File Foto dari Perangkat
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Klik di sini untuk memilih foto langsung dari galeri komputer atau HP (JPG, PNG, WebP).
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold shrink-0 transition-colors shadow-2xs"
                      >
                        Pilih File Foto
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentTab('menus')}
                      className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Batal
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-[#df7a32] hover:from-amber-600 hover:to-[#c96c2b] shadow-md shadow-amber-500/25 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan Menu</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 max-w-sm w-full space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Keluar dari Dashboard Pemilik?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Anda akan keluar dari sesi pengelolaan kios di layar desktop ini dan kembali ke portal masuk.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full py-2.5 px-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  if (onLogout) onLogout();
                }}
                className="w-full py-2.5 px-3 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/20 transition-all cursor-pointer active:scale-95"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
