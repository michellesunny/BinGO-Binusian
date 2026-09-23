export interface MenuItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  likes: number;
  image: string;
  category: string;
  isBestSeller?: boolean;
  description?: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  promo?: string;
  isOpen: boolean;
  location: string;
  menu: MenuItem[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes: string;
}

export interface Buddy {
  id: string;
  name: string;
  rating: number | null;
  reviewCount: number;
  activeMinutesText: string;
  location: string;
  avatar: string;
  isOnline: boolean;
}

export interface PeerRequest {
  id: string;
  studentName: string;
  items: { name: string; quantity: number }[];
  dropLocation: string;
  fee: number;
  selected: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  nim: string;
  customerName: string;
  vendorId: string;
  vendorName: string;
  items: CartItem[];
  subtotal: number;
  platformFee: number;
  buddyFee: number;
  total: number;
  pickupSlot: string;
  isBuddyEnabled: boolean;
  buddyMode?: 'ask' | 'be';
  buddy?: Buddy;
  pickupLocation: string;
  dropLocation?: string;
  status: 'created' | 'preparing' | 'picked_up' | 'delivering' | 'arrived' | 'completed';
  date: string;
  timeline: {
    status: string;
    time: string;
    done: boolean;
    active: boolean;
  }[];
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  comment: string;
  timeAgo: string;
  role?: string;
}

export interface CalendarEvent {
  day: number;
  month: string;
  year: number;
  dateStr: string;
  title: string;
  type: 'holiday' | 'early_close' | 'special';
}
