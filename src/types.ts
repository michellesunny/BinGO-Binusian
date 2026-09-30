export type OrderStatus = 'masuk' | 'diproses' | 'siap_diambil' | 'selesai' | 'dibatalkan';

export type EventType = 'libur' | 'tutup_awal' | 'event_khusus' | 'stok_terbatas';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
  image?: string;
}

export interface Buddy {
  id: string;
  name: string;
  avatar: string;
  location: string;
  rating: number;
  activeMinutesText: string;
}

export interface PeerRequest {
  id: string;
  studentName: string;
  avatar?: string;
  dropLocation: string;
  items: { name: string; quantity: number; price?: number }[];
  fee: number;
  selected?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  category?: 'Makanan Utama' | 'Pelengkap & Sate' | 'Minuman' | 'Camilan' | string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  isAvailable?: boolean;
  preparationTimeMinutes?: number;
  soldCount?: number;
  stockRemaining?: number;
  isPopular?: boolean;
  isBestSeller?: boolean;
  likes?: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  location: string;
  description: string;
  image: string;
  promo?: boolean;
  menu: MenuItem[];
}

export interface CalendarEvent {
  day: number;
  dateStr: string;
  title: string;
  type: 'holiday' | 'early_close' | 'special';
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  comment: string;
  timeAgo: string;
}

export interface OrderTimelineStep {
  status: string;
  time: string;
  done: boolean;
  active: boolean;
}

export interface Order {
  id: string;
  orderNumber?: string;
  receiptNo?: string;
  nim?: string;
  customerName: string;
  vendorId?: string;
  vendorName?: string;
  items: any[];
  subtotal?: number;
  platformFee?: number;
  buddyFee?: number;
  total?: number;
  totalAmount?: number;
  pickupSlot?: string;
  pickupTime?: string;
  pickupSlotLabel?: string;
  isBuddyEnabled?: boolean;
  isBuddyOrder?: boolean;
  buddyLeadName?: string;
  buddyMembers?: string[];
  buddyMode?: 'ask' | 'be';
  buddy?: Buddy;
  peerRequests?: PeerRequest[];
  buddyEarnings?: number;
  pickupLocation?: string;
  dropLocation?: string;
  status: OrderStatus | string;
  verificationCode?: string;
  date?: string;
  createdAt?: string;
  timeline?: OrderTimelineStep[];
  notes?: string;
  paymentMethod?: 'QRIS' | 'KantinPay' | 'Tunai di Kasir' | string;
  paymentStatus?: 'Lunas' | 'Belum Bayar' | string;
  customerPhone?: string;
  customerClass?: string;
}

export interface OperationalEvent {
  id: string;
  title: string;
  description: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
  type: EventType;
  canteenStatus: 'Tutup' | 'Tutup Lebih Awal' | 'Buka Normal' | 'Jadwal Khusus';
}

export interface GeneralOperationalInfo {
  weekdays: string;
  saturday: string;
  sunday: string;
  specialNote?: string;
}

export type ActiveScreen = 
  | 'vendor_home' 
  | 'pesanan' 
  | 'calendar' 
  | 'menu_stock' 
  | 'edit_menu_item'
  | 'add_event'
  | 'student_menu'
  | 'student_my_orders';

export type ViewMode = 'vendor' | 'student';
export type DevicePreviewMode = 'mobile' | 'responsive';
