export type UserRole = 'admin' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
}

export type EventCategory = 
  | 'Technology' 
  | 'Business' 
  | 'Design & Arts' 
  | 'Music & Concerts' 
  | 'Workshops' 
  | 'Sports & Fitness' 
  | 'Community & Networking';

export type EventStatus = 'open' | 'closed' | 'cancelled';

export interface EventItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: EventCategory;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  venue: string;
  location: string;
  organizerName: string;
  organizerId: string;
  organizerEmail: string;
  maxParticipants: number;
  currentParticipants: number;
  status: EventStatus;
  price?: number; // 0 for Free
  featured?: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export type RegistrationStatus = 'confirmed' | 'cancelled';

export interface RegistrationItem {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  eventLocation?: string;
  eventImageUrl?: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  ticketQuantity: number;
  notes?: string;
  bookingReference: string;
  status: RegistrationStatus;
  registeredAt: string;
}

export interface DashboardStats {
  totalEvents: number;
  totalRegistrations: number;
  totalUsers: number;
  activeEvents: number;
  totalCapacity: number;
  filledSeats: number;
  occupancyRate: number;
}
