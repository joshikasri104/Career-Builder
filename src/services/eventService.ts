import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  increment,
  runTransaction
} from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../firebase';
import { EventItem, RegistrationItem, UserProfile, DashboardStats } from '../types';
import { INITIAL_SEED_EVENTS } from '../data/seedData';

const EVENTS_COLLECTION = 'events';
const REGISTRATIONS_COLLECTION = 'registrations';
const USERS_COLLECTION = 'users';

// Real-time events subscriber
export function subscribeToEvents(callback: (events: EventItem[]) => void) {
  try {
    const q = query(collection(db, EVENTS_COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        const events: EventItem[] = [];
        snapshot.forEach((docSnap) => {
          events.push({ id: docSnap.id, ...docSnap.data() } as EventItem);
        });
        // Sort by date ascending
        events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        callback(events);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, EVENTS_COLLECTION);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, EVENTS_COLLECTION);
  }
}

// Get single event
export async function getEventById(id: string): Promise<EventItem | null> {
  const path = `${EVENTS_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, EVENTS_COLLECTION, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as EventItem;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// Create new event (Admin)
export async function createEvent(eventData: Omit<EventItem, 'id' | 'createdAt' | 'updatedAt' | 'currentParticipants'>): Promise<string> {
  const path = EVENTS_COLLECTION;
  try {
    const now = new Date().toISOString();
    const docRef = await addDoc(collection(db, EVENTS_COLLECTION), {
      ...eventData,
      currentParticipants: 0,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Update event (Admin)
export async function updateEvent(id: string, updates: Partial<EventItem>): Promise<void> {
  const path = `${EVENTS_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, EVENTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Delete event (Admin)
export async function deleteEvent(id: string): Promise<void> {
  const path = `${EVENTS_COLLECTION}/${id}`;
  try {
    const docRef = doc(db, EVENTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Seed initial sample events if collection is empty
export async function seedInitialEventsIfEmpty(): Promise<boolean> {
  const path = EVENTS_COLLECTION;
  try {
    const snap = await getDocs(collection(db, EVENTS_COLLECTION));
    if (snap.size === 0) {
      console.log('Seeding initial events into Firestore...');
      for (const event of INITIAL_SEED_EVENTS) {
        await addDoc(collection(db, EVENTS_COLLECTION), event);
      }
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Could not auto-seed events (may need admin auth):', error);
    return false;
  }
}

// Explicit seed by admin
export async function forceSeedEvents(): Promise<number> {
  const path = EVENTS_COLLECTION;
  try {
    let count = 0;
    for (const event of INITIAL_SEED_EVENTS) {
      await addDoc(collection(db, EVENTS_COLLECTION), event);
      count++;
    }
    return count;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Subscribe to user bookings / registrations
export function subscribeToUserRegistrations(userId: string, callback: (registrations: RegistrationItem[]) => void) {
  const path = REGISTRATIONS_COLLECTION;
  try {
    const q = query(
      collection(db, REGISTRATIONS_COLLECTION),
      where('userId', '==', userId)
    );
    return onSnapshot(
      q,
      (snapshot) => {
        const list: RegistrationItem[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as RegistrationItem);
        });
        // Sort by registeredAt descending
        list.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
        callback(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// Subscribe to all registrations (Admin)
export function subscribeToAllRegistrations(callback: (registrations: RegistrationItem[]) => void) {
  const path = REGISTRATIONS_COLLECTION;
  try {
    const q = query(collection(db, REGISTRATIONS_COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: RegistrationItem[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as RegistrationItem);
        });
        list.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
        callback(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// Generate unique booking reference (e.g., EE-79821-B)
export function generateBookingReference(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const letter = chars.charAt(Math.floor(Math.random() * chars.length));
  return `EE-${num}-${letter}`;
}

// Register for an event with capacity & duplicate registration checks
export async function registerForEvent(params: {
  event: EventItem;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  ticketQuantity: number;
  notes?: string;
}): Promise<RegistrationItem> {
  const { event, userId, userName, userEmail, userPhone, ticketQuantity, notes } = params;

  // 1. Check duplicate active registration in Firestore
  const qExisting = query(
    collection(db, REGISTRATIONS_COLLECTION),
    where('eventId', '==', event.id),
    where('userId', '==', userId)
  );

  const existingDocs = await getDocs(qExisting);
  const activeExisting = existingDocs.docs.find((d) => d.data().status === 'confirmed');

  if (activeExisting) {
    throw new Error('You have already registered for this event. You can review your ticket under My Bookings.');
  }

  // 2. Transaction to verify capacity and atomically reserve tickets
  const eventRef = doc(db, EVENTS_COLLECTION, event.id);
  const registrationRef = doc(collection(db, REGISTRATIONS_COLLECTION));
  const bookingReference = generateBookingReference();
  const registeredAt = new Date().toISOString();

  let finalRegItem: RegistrationItem | null = null;

  try {
    await runTransaction(db, async (transaction) => {
      const eventSnap = await transaction.get(eventRef);
      if (!eventSnap.exists()) {
        throw new Error('The selected event no longer exists.');
      }

      const eventData = eventSnap.data() as EventItem;

      if (eventData.status !== 'open') {
        throw new Error(`This event is currently ${eventData.status} and cannot accept new registrations.`);
      }

      const newCount = (eventData.currentParticipants || 0) + ticketQuantity;
      if (newCount > eventData.maxParticipants) {
        const remaining = Math.max(0, eventData.maxParticipants - (eventData.currentParticipants || 0));
        throw new Error(
          remaining <= 0
            ? 'This event has reached full capacity and is completely sold out.'
            : `Only ${remaining} ${remaining === 1 ? 'seat remains' : 'seats remain'}. Please reduce your ticket quantity.`
        );
      }

      const newStatus = newCount >= eventData.maxParticipants ? 'closed' : 'open';

      // Update event participants count
      transaction.update(eventRef, {
        currentParticipants: newCount,
        status: newStatus,
        updatedAt: registeredAt,
      });

      // Create registration document
      finalRegItem = {
        id: registrationRef.id,
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time,
        eventVenue: event.venue,
        eventLocation: event.location,
        eventImageUrl: event.imageUrl,
        userId,
        userName,
        userEmail,
        userPhone,
        ticketQuantity,
        notes: notes || '',
        bookingReference,
        status: 'confirmed',
        registeredAt,
      };

      transaction.set(registrationRef, finalRegItem);
    });

    if (!finalRegItem) {
      throw new Error('Registration could not be completed. Please try again.');
    }

    return finalRegItem;
  } catch (error: any) {
    if (error.message && !error.message.includes('missing or insufficient permissions')) {
      throw error;
    }
    handleFirestoreError(error, OperationType.WRITE, REGISTRATIONS_COLLECTION);
  }
}

// Cancel a registration and restore event capacity
export async function cancelRegistration(registration: RegistrationItem): Promise<void> {
  const regRef = doc(db, REGISTRATIONS_COLLECTION, registration.id);
  const eventRef = doc(db, EVENTS_COLLECTION, registration.eventId);

  try {
    await runTransaction(db, async (transaction) => {
      const regSnap = await transaction.get(regRef);
      if (!regSnap.exists()) {
        throw new Error('Registration record not found.');
      }

      if (regSnap.data().status === 'cancelled') {
        throw new Error('This registration is already cancelled.');
      }

      // Mark registration as cancelled
      transaction.update(regRef, {
        status: 'cancelled',
      });

      // Restore participant count on event
      const eventSnap = await transaction.get(eventRef);
      if (eventSnap.exists()) {
        const eventData = eventSnap.data() as EventItem;
        const current = eventData.currentParticipants || 0;
        const restoredCount = Math.max(0, current - (registration.ticketQuantity || 1));
        const updates: Partial<EventItem> = {
          currentParticipants: restoredCount,
          updatedAt: new Date().toISOString(),
        };
        // If event was closed due to capacity, reopen it
        if (eventData.status === 'closed' && restoredCount < eventData.maxParticipants) {
          updates.status = 'open';
        }
        transaction.update(eventRef, updates);
      }
    });
  } catch (error: any) {
    if (error.message && !error.message.includes('missing or insufficient permissions')) {
      throw error;
    }
    handleFirestoreError(error, OperationType.UPDATE, `${REGISTRATIONS_COLLECTION}/${registration.id}`);
  }
}

// User Profile Operations
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const path = `${USERS_COLLECTION}/${userId}`;
  try {
    const snap = await getDoc(doc(db, USERS_COLLECTION, userId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as UserProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const path = `${USERS_COLLECTION}/${profile.id}`;
  try {
    await setDoc(doc(db, USERS_COLLECTION, profile.id), profile, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Get all users (Admin)
export async function getAllUsers(): Promise<UserProfile[]> {
  const path = USERS_COLLECTION;
  try {
    const snap = await getDocs(collection(db, USERS_COLLECTION));
    const users: UserProfile[] = [];
    snap.forEach((d) => {
      users.push({ id: d.id, ...d.data() } as UserProfile);
    });
    return users;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// Compute dashboard statistics
export function computeDashboardStats(
  events: EventItem[],
  registrations: RegistrationItem[],
  usersCount: number
): DashboardStats {
  const totalEvents = events.length;
  const activeEvents = events.filter((e) => e.status === 'open').length;
  const confirmedRegistrations = registrations.filter((r) => r.status === 'confirmed');
  const totalRegistrations = confirmedRegistrations.length;

  let totalCapacity = 0;
  let filledSeats = 0;

  events.forEach((e) => {
    totalCapacity += e.maxParticipants || 0;
    filledSeats += e.currentParticipants || 0;
  });

  const occupancyRate = totalCapacity > 0 ? Math.round((filledSeats / totalCapacity) * 100) : 0;

  return {
    totalEvents,
    totalRegistrations,
    totalUsers: usersCount,
    activeEvents,
    totalCapacity,
    filledSeats,
    occupancyRate,
  };
}
