import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Order, Vendor, MenuItem, OperationalEvent } from '../types';
import { MOCK_VENDORS, INITIAL_ORDERS, INITIAL_MENU_ITEMS, INITIAL_OPERATIONAL_EVENTS } from '../data/mockData';

const ORDERS_COLLECTION = 'orders';
const VENDORS_COLLECTION = 'vendors';
const MENU_ITEMS_COLLECTION = 'menu_items';
const USERS_COLLECTION = 'users';
const EVENTS_COLLECTION = 'operational_events';

function cleanForFirestore(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Seed initial vendors, menus, orders, users, and events into Firestore if collections are empty.
 */
export async function seedInitialDataIfEmpty() {
  try {
    // 1. Vendors
    const vendorsSnap = await getDocs(collection(db, VENDORS_COLLECTION));
    if (vendorsSnap.empty) {
      console.log('[Firebase] Seeding initial vendors to Firestore...');
      for (const vendor of MOCK_VENDORS) {
        const vendorRef = doc(db, VENDORS_COLLECTION, vendor.id);
        await setDoc(vendorRef, cleanForFirestore({
          ...vendor,
          updatedAt: new Date().toISOString(),
        }));
      }
      console.log('[Firebase] Initial vendors seeded successfully.');
    }

    // 2. Menu Items
    const menuSnap = await getDocs(collection(db, MENU_ITEMS_COLLECTION));
    if (menuSnap.empty) {
      console.log('[Firebase] Seeding initial menu items to Firestore...');
      for (const item of INITIAL_MENU_ITEMS) {
        const itemRef = doc(db, MENU_ITEMS_COLLECTION, item.id);
        await setDoc(itemRef, cleanForFirestore({
          ...item,
          updatedAt: new Date().toISOString(),
        }));
      }
      console.log('[Firebase] Initial menu items seeded successfully.');
    }

    // 3. Orders
    const ordersSnap = await getDocs(collection(db, ORDERS_COLLECTION));
    if (ordersSnap.empty) {
      console.log('[Firebase] Seeding initial orders to Firestore...');
      for (const order of INITIAL_ORDERS) {
        const orderRef = doc(db, ORDERS_COLLECTION, order.id);
        await setDoc(orderRef, cleanForFirestore({
          ...order,
          createdAt: order.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
      }
      console.log('[Firebase] Initial orders seeded successfully.');
    }

    // 4. Events
    const eventsSnap = await getDocs(collection(db, EVENTS_COLLECTION));
    if (eventsSnap.empty) {
      console.log('[Firebase] Seeding initial operational events to Firestore...');
      for (const event of INITIAL_OPERATIONAL_EVENTS) {
        const eventRef = doc(db, EVENTS_COLLECTION, event.id);
        await setDoc(eventRef, cleanForFirestore({
          ...event,
          updatedAt: new Date().toISOString(),
        }));
      }
      console.log('[Firebase] Initial operational events seeded successfully.');
    }
  } catch (err) {
    console.warn('[Firebase] Seeding notice:', err);
  }
}

/**
 * Real-time listener for orders.
 */
export function subscribeToOrders(onUpdate: (orders: Order[]) => void) {
  try {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const orders: Order[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              ...data,
            } as Order;
          });
          onUpdate(orders);
        }
      },
      (error) => {
        console.warn('[Firebase] Orders subscription warning:', error.message);
      }
    );
  } catch (err) {
    console.warn('[Firebase] Orders query setup error:', err);
    return () => {};
  }
}

/**
 * Create a new order in Firestore.
 */
export async function createOrderInFirebase(order: Order): Promise<string> {
  const orderId = order.id || `ORD-${Date.now().toString().slice(-4)}`;
  const orderRef = doc(db, ORDERS_COLLECTION, orderId);
  await setDoc(orderRef, cleanForFirestore({
    ...order,
    id: orderId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
  return orderId;
}

/**
 * Update an order's status in Firestore (e.g., from vendor kitchen queue).
 */
export async function updateOrderStatusInFirebase(
  orderId: string,
  newStatus: string
): Promise<void> {
  const orderRef = doc(db, ORDERS_COLLECTION, orderId);
  await updateDoc(orderRef, {
    status: newStatus,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Save new or updated menu item to Firestore.
 */
export async function saveMenuItemInFirebase(item: MenuItem): Promise<void> {
  const itemRef = doc(db, MENU_ITEMS_COLLECTION, item.id);
  await setDoc(itemRef, cleanForFirestore({
    ...item,
    updatedAt: new Date().toISOString(),
  }));
}

/**
 * Real-time listener for menu items.
 */
export function subscribeToMenuItems(onUpdate: (items: MenuItem[]) => void) {
  try {
    const coll = collection(db, MENU_ITEMS_COLLECTION);
    return onSnapshot(
      coll,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: MenuItem[] = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          } as MenuItem));
          onUpdate(items);
        }
      },
      (error) => {
        console.warn('[Firebase] Menu items subscription warning:', error.message);
      }
    );
  } catch (err) {
    console.warn('[Firebase] Menu items subscription error:', err);
    return () => {};
  }
}

/**
 * Save operational event to Firestore.
 */
export async function saveOperationalEventInFirebase(event: OperationalEvent): Promise<void> {
  const eventRef = doc(db, EVENTS_COLLECTION, event.id);
  await setDoc(eventRef, cleanForFirestore({
    ...event,
    updatedAt: new Date().toISOString(),
  }));
}

/**
 * Real-time listener for operational events.
 */
export function subscribeToOperationalEvents(onUpdate: (events: OperationalEvent[]) => void) {
  try {
    const coll = collection(db, EVENTS_COLLECTION);
    return onSnapshot(
      coll,
      (snapshot) => {
        if (!snapshot.empty) {
          const events: OperationalEvent[] = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          } as OperationalEvent));
          onUpdate(events);
        }
      },
      (error) => {
        console.warn('[Firebase] Operational events subscription warning:', error.message);
      }
    );
  } catch (err) {
    console.warn('[Firebase] Operational events subscription error:', err);
    return () => {};
  }
}

/**
 * Real-time listener for vendors.
 */
export function subscribeToVendors(onUpdate: (vendors: Vendor[]) => void) {
  try {
    const coll = collection(db, VENDORS_COLLECTION);
    return onSnapshot(
      coll,
      (snapshot) => {
        if (!snapshot.empty) {
          const vendors: Vendor[] = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          } as Vendor));
          onUpdate(vendors);
        }
      },
      (error) => {
        console.warn('[Firebase] Vendors subscription warning:', error.message);
      }
    );
  } catch (err) {
    console.warn('[Firebase] Vendors subscription error:', err);
    return () => {};
  }
}
