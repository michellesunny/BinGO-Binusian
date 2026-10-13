import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json' with { type: 'json' };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

function clean(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}

// 1. Vendors
const VENDORS = [
  {
    id: 'kedai-selan-01',
    name: 'Kedai Selan',
    subtitle: 'Kantin Sekolah & Kampus BinGO!',
    stallNumber: 'Kios 04',
    category: 'Makanan Nusantara & Soto',
    rating: 4.9,
    reviewCount: 342,
    location: 'Kantin Sentral YSKI Lt. 1',
    description: 'Soto ayam kuning gurih, mie ayam pangsit, dan aneka sate bacem istimewa.',
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Ibu Selan Rahmawati',
    phone: '081298765432',
    email: 'kedai.selan@bingo.id',
    openTime: '07:00',
    closeTime: '15:30',
  },
  {
    id: 'warung-bu-dian',
    name: 'Kantin Bu Dian',
    subtitle: 'Aneka Nasi & Masakan Rumahan',
    stallNumber: 'Kios 02',
    category: 'Masakan Rumahan & Nasi Rames',
    rating: 4.8,
    reviewCount: 215,
    location: 'Kantin Sentral YSKI Lt. 1',
    description: 'Nasi rames dengan aneka lauk pauk segar setiap hari, ayam bakar, tempe orek, dan sayur asem.',
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Ibu Dian Safitri',
    phone: '081234567891',
    email: 'budian@bingo.id',
    openTime: '06:30',
    closeTime: '15:00',
  },
  {
    id: 'geprek-kampus',
    name: 'Ayam Geprek Sambal Bawang',
    subtitle: 'Pedas Mantap Level 1-5',
    stallNumber: 'Kios 05',
    category: 'Ayam Geprek & Nasi Box',
    rating: 4.9,
    reviewCount: 420,
    location: 'Kantin Sentral YSKI Lt. 1',
    description: 'Ayam goreng tepung krispi dengan ulekan sambal bawang pedas gurih, disajikan dengan nasi hangat dan lalapan.',
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
    ownerName: 'Mas Danang',
    phone: '081234567892',
    email: 'geprek.kampus@bingo.id',
    openTime: '08:00',
    closeTime: '16:00',
  },
];

// 2. Menu Items
const MENU_ITEMS = [
  {
    id: 'menu-soto',
    vendorId: 'kedai-selan-01',
    name: 'Soto Nusantara',
    category: 'Makanan Utama',
    price: 18000,
    originalPrice: 20000,
    description: 'Soto ayam kuning gurih kaya rempah nusantara dengan suwiran ayam empuk, soun, tauge, kol, dan telur rebus.',
    image: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    preparationTimeMinutes: 5,
    soldCount: 84,
    stockRemaining: 35,
    isPopular: true,
  },
  {
    id: 'menu-mie-ayam',
    vendorId: 'kedai-selan-01',
    name: 'Mie Ayam Jamur Spesial',
    category: 'Makanan Utama',
    price: 16000,
    description: 'Mie kenyal gurih dengan topping potongan ayam kecap jamur merang, caisim segar, dan pangsit goreng renyah.',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    preparationTimeMinutes: 6,
    soldCount: 62,
    stockRemaining: 24,
    isPopular: false,
  },
  {
    id: 'menu-sate-telur',
    vendorId: 'kedai-selan-01',
    name: 'Sate Telur Puyuh',
    category: 'Pelengkap & Sate',
    price: 5000,
    description: 'Sate telur puyuh bumbu bacem manis gurih legit (isi 2 tusuk). Cocok dipadukan dengan Soto atau Mie Ayam.',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    preparationTimeMinutes: 1,
    soldCount: 95,
    stockRemaining: 50,
    isPopular: false,
  },
  {
    id: 'menu-nasgor',
    vendorId: 'kedai-selan-01',
    name: 'Nasi Goreng Kantin Spesial',
    category: 'Makanan Utama',
    price: 18000,
    description: 'Nasi goreng harum wajan panas dengan suwiran ayam, bakso sapi, telur orak-arik, dan kerupuk renyah.',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    preparationTimeMinutes: 7,
    soldCount: 48,
    stockRemaining: 18,
    isPopular: false,
  },
  {
    id: 'menu-es-teh',
    vendorId: 'kedai-selan-01',
    name: 'Es Teh Manis Jumbo',
    category: 'Minuman',
    price: 4000,
    description: 'Teh melati seduh segar dingin dengan es batu kristal dan gula tebu asli menyegarkan.',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    preparationTimeMinutes: 2,
    soldCount: 110,
    stockRemaining: 60,
    isPopular: false,
  },
  {
    id: 'menu-ayam-geprek',
    vendorId: 'geprek-kampus',
    name: 'Ayam Geprek Sambal Bawang + Nasi',
    category: 'Makanan Utama',
    price: 20000,
    description: 'Ayam goreng tepung renyah digeprek dengan cabai rawit merah dan bawang putih segar. Lengkap nasi dan lalapan.',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    preparationTimeMinutes: 5,
    soldCount: 78,
    stockRemaining: 25,
    isPopular: true,
  },
];

// 3. User Profiles
const USERS = [
  {
    id: 'user-amelia',
    uid: 'user-amelia',
    name: 'Amelia Angelica Suryanto',
    nim: '2802403247',
    campus: 'BINUS Kemanggisan - Anggrek',
    email: 'amelia.suryanto@binus.ac.id',
    phone: '081298765432',
    role: 'pemesan',
    balance: 50000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-valencia',
    uid: 'user-valencia',
    name: 'Valencia (Buddy)',
    nim: '2802409821',
    campus: 'BINUS Kemanggisan - Anggrek',
    email: 'valencia.buddy@binus.ac.id',
    phone: '081298765433',
    role: 'buddy',
    balance: 85000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vendor-kedai-selan',
    uid: 'vendor-kedai-selan',
    name: 'Ibu Selan Rahmawati',
    stallName: 'Kedai Selan',
    stallNumber: 'Kios 04',
    email: 'kedai.selan@bingo.id',
    phone: '081298765432',
    role: 'vendor',
    createdAt: new Date().toISOString(),
  },
];

// 4. Orders
const ORDERS = [
  {
    id: 'ord-101',
    receiptNo: '#101',
    customerName: 'Joko & Fajar',
    isBuddyOrder: true,
    buddyLeadName: 'Joko',
    buddyMembers: ['Joko', 'Fajar'],
    pickupTime: '11.30 WIB',
    pickupSlotLabel: 'Istirahat 2',
    vendorId: 'kedai-selan-01',
    vendorName: 'Kedai Selan',
    items: [
      { id: 'item-1', name: 'Soto Nusantara', quantity: 2, price: 18000 },
      { id: 'item-2', name: 'Sate Telur Puyuh', quantity: 2, price: 5000 },
    ],
    notes: 'tanpa sambal, kuah dipisah di mangkok plastik',
    status: 'masuk',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    totalAmount: 46000,
    paymentMethod: 'QRIS',
    paymentStatus: 'Lunas',
  },
  {
    id: 'ord-102',
    receiptNo: '#102',
    customerName: 'Nadia Salsabila',
    isBuddyOrder: false,
    pickupTime: '11.30 WIB',
    pickupSlotLabel: 'Istirahat 2',
    vendorId: 'kedai-selan-01',
    vendorName: 'Kedai Selan',
    items: [
      { id: 'item-3', name: 'Mie Ayam Jamur Spesial', quantity: 1, price: 16000 },
      { id: 'item-4', name: 'Es Teh Manis Jumbo', quantity: 1, price: 4000 },
    ],
    notes: 'ekstra sambal dan jeruk nipis',
    status: 'masuk',
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
    totalAmount: 20000,
    paymentMethod: 'KantinPay',
    paymentStatus: 'Lunas',
  },
  {
    id: 'ord-98',
    receiptNo: '#98',
    customerName: 'Reyhan Pratama',
    isBuddyOrder: false,
    pickupTime: '10.00 WIB',
    pickupSlotLabel: 'Istirahat 1',
    vendorId: 'kedai-selan-01',
    vendorName: 'Kedai Selan',
    items: [
      { id: 'item-5', name: 'Nasi Goreng Kantin Spesial', quantity: 1, price: 18000 },
      { id: 'item-6', name: 'Es Jeruk Peras Segar', quantity: 1, price: 6000 },
    ],
    notes: 'tidak pedas untuk anak sekolah',
    status: 'diproses',
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    totalAmount: 24000,
    paymentMethod: 'QRIS',
    paymentStatus: 'Lunas',
  },
  {
    id: 'ord-95',
    receiptNo: '#95',
    customerName: 'Pak Hendra (Guru)',
    isBuddyOrder: false,
    pickupTime: '09.30 WIB',
    pickupSlotLabel: 'Pagi',
    vendorId: 'kedai-selan-01',
    vendorName: 'Kedai Selan',
    items: [
      { id: 'item-7', name: 'Soto Nusantara', quantity: 1, price: 18000 },
      { id: 'item-8', name: 'Sate Telur Puyuh', quantity: 2, price: 5000 },
    ],
    notes: 'kuah dipisah',
    status: 'siap_diambil',
    createdAt: new Date(Date.now() - 50 * 60000).toISOString(),
    totalAmount: 28000,
    paymentMethod: 'QRIS',
    paymentStatus: 'Lunas',
  },
  {
    id: 'ord-90',
    receiptNo: '#90',
    customerName: 'Budi Santoso',
    isBuddyOrder: false,
    pickupTime: '08.00 WIB',
    pickupSlotLabel: 'Sarapan',
    vendorId: 'kedai-selan-01',
    vendorName: 'Kedai Selan',
    items: [
      { id: 'item-9', name: 'Soto Nusantara', quantity: 1, price: 18000 },
    ],
    notes: '',
    status: 'selesai',
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    totalAmount: 18000,
    paymentMethod: 'KantinPay',
    paymentStatus: 'Lunas',
  },
];

// 5. Operational Events
const OPERATIONAL_EVENTS = [
  {
    id: 'evt-1',
    title: 'Cuti bersama tahun baru 2026',
    description: 'Cuti bersama tahun baru. Seluruh unit sekolah dan kantin libur.',
    startDate: '2027-01-03',
    endDate: '2027-01-03',
    type: 'libur',
    canteenStatus: 'Tutup',
  },
  {
    id: 'evt-2',
    title: 'Tutup jam 3 sore (Rapat Evaluasi Pedagang)',
    description: 'Rapat koordinasi dan evaluasi bulanan pedagang kantin bersama pihak sekolah/kampus.',
    startDate: '2027-01-20',
    endDate: '2027-01-20',
    type: 'tutup_awal',
    canteenStatus: 'Tutup Lebih Awal',
  },
];

async function seedAll() {
  console.log('🚀 Starting Cloud Firestore Seeding into database:', firebaseConfig.firestoreDatabaseId);

  // Seed Vendors
  for (const vendor of VENDORS) {
    await setDoc(doc(db, 'vendors', vendor.id), clean(vendor));
    console.log(`✅ Seeded vendor: ${vendor.name} (${vendor.id})`);
  }

  // Seed Menu Items
  for (const item of MENU_ITEMS) {
    await setDoc(doc(db, 'menu_items', item.id), clean(item));
    console.log(`✅ Seeded menu item: ${item.name} (${item.id})`);
  }

  // Seed Users
  for (const user of USERS) {
    await setDoc(doc(db, 'users', user.id), clean(user));
    console.log(`✅ Seeded user: ${user.name} (${user.id})`);
  }

  // Seed Orders
  for (const order of ORDERS) {
    await setDoc(doc(db, 'orders', order.id), clean(order));
    console.log(`✅ Seeded order: ${order.receiptNo} - ${order.customerName} (${order.id})`);
  }

  // Seed Operational Events
  for (const event of OPERATIONAL_EVENTS) {
    await setDoc(doc(db, 'operational_events', event.id), clean(event));
    console.log(`✅ Seeded operational event: ${event.title} (${event.id})`);
  }

  console.log('🎉 All Firestore collections seeded successfully!');
  process.exit(0);
}

seedAll().catch((err) => {
  console.error('❌ Error seeding Firestore:', err);
  process.exit(1);
});
