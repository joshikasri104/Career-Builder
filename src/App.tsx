/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { BookingConfirmationModal } from './components/BookingConfirmationModal';
import { EventFormModal } from './components/EventFormModal';
import { CancelModal } from './components/CancelModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ManageEventsPage } from './pages/ManageEventsPage';
import { ParticipantsPage } from './pages/ParticipantsPage';
import { AuthPage } from './pages/AuthPage';

import { 
  EventItem, 
  RegistrationItem, 
  EventStatus, 
  DashboardStats 
} from './types';
import {
  subscribeToEvents,
  subscribeToUserRegistrations,
  subscribeToAllRegistrations,
  seedInitialEventsIfEmpty,
  forceSeedEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  cancelRegistration,
  computeDashboardStats,
  getAllUsers
} from './services/eventService';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

function EventEaseApp() {
  const { currentUser, userProfile, isAdmin, isLoading: authLoading } = useAuth();

  // Navigation State
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [participantsFilterEventId, setParticipantsFilterEventId] = useState<string | undefined>(undefined);

  // Data States
  const [events, setEvents] = useState<EventItem[]>([]);
  const [userRegistrations, setUserRegistrations] = useState<RegistrationItem[]>([]);
  const [allRegistrations, setAllRegistrations] = useState<RegistrationItem[]>([]);
  const [usersCount, setUsersCount] = useState<number>(12);
  const [eventsLoading, setEventsLoading] = useState<boolean>(true);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Modals state
  const [bookingEvent, setBookingEvent] = useState<EventItem | null>(null);
  const [confirmationReg, setConfirmationReg] = useState<RegistrationItem | null>(null);
  const [eventFormState, setEventFormState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    event: EventItem | null;
  }>({
    isOpen: false,
    mode: 'create',
    event: null,
  });
  const [cancelModalReg, setCancelModalReg] = useState<RegistrationItem | null>(null);

  // 1. Subscribe to Events
  useEffect(() => {
    // Check if initial seeding is needed
    seedInitialEventsIfEmpty().catch(console.warn);

    const unsubscribe = subscribeToEvents((data) => {
      setEvents(data);
      setEventsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Subscribe to User Registrations when logged in
  useEffect(() => {
    if (!currentUser) {
      setUserRegistrations([]);
      return;
    }

    const unsubscribe = subscribeToUserRegistrations(currentUser.uid, (data) => {
      setUserRegistrations(data);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 3. Subscribe to All Registrations if Admin
  useEffect(() => {
    if (!isAdmin) {
      setAllRegistrations([]);
      return;
    }

    const unsubscribe = subscribeToAllRegistrations((data) => {
      setAllRegistrations(data);
    });

    // Fetch user count for admin dashboard
    getAllUsers()
      .then((users) => {
        if (users.length > 0) setUsersCount(users.length);
      })
      .catch(console.warn);

    return () => unsubscribe();
  }, [isAdmin]);

  // Fast set of event IDs that the current user has booked
  const userRegistrationEventIds = useMemo(() => {
    const set = new Set<string>();
    userRegistrations.forEach((r) => {
      if (r.status === 'confirmed') {
        set.add(r.eventId);
      }
    });
    return set;
  }, [userRegistrations]);

  // Compute live dashboard stats
  const dashboardStats: DashboardStats = useMemo(() => {
    return computeDashboardStats(events, allRegistrations, usersCount);
  }, [events, allRegistrations, usersCount]);

  // Navigation Handler
  const handleNavigate = (page: string, eventId?: string) => {
    if (eventId) {
      if (page === 'participants') {
        setParticipantsFilterEventId(eventId);
      } else {
        setSelectedEventId(eventId);
      }
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    setCurrentPage('event-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Booking Flow
  const handleOpenRegister = (event: EventItem) => {
    if (!currentUser) {
      setCurrentPage('login');
      showToast('Please sign in to register for events.', 'error');
      return;
    }
    setBookingEvent(event);
  };

  const handleBookingSuccess = (registration: RegistrationItem) => {
    setBookingEvent(null);
    setConfirmationReg(registration);
    showToast(`Successfully registered for ${registration.eventTitle}!`);
  };

  // Cancellation Flow
  const handleOpenCancel = (registration: RegistrationItem) => {
    setCancelModalReg(registration);
  };

  const handleConfirmCancel = async (registration: RegistrationItem) => {
    try {
      await cancelRegistration(registration);
      showToast('Registration cancelled. Seat capacity has been restored.');
    } catch (e: any) {
      console.error('Cancel failed:', e);
      showToast(e.message || 'Failed to cancel registration.', 'error');
    }
  };

  // Admin Event Management Handlers
  const handleOpenCreateEvent = () => {
    setEventFormState({
      isOpen: true,
      mode: 'create',
      event: null,
    });
  };

  const handleOpenEditEvent = (event: EventItem) => {
    setEventFormState({
      isOpen: true,
      mode: 'edit',
      event,
    });
  };

  const handleSaveEvent = async (data: Omit<EventItem, 'id' | 'createdAt' | 'updatedAt' | 'currentParticipants'>) => {
    if (eventFormState.mode === 'create') {
      await createEvent(data);
      showToast('New event created and published successfully!');
    } else if (eventFormState.event) {
      await updateEvent(eventFormState.event.id, data);
      showToast('Event details updated successfully!');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      showToast('Event deleted from system.');
      if (selectedEventId === eventId) {
        setCurrentPage('manage-events');
      }
    } catch (e: any) {
      showToast(e.message || 'Failed to delete event.', 'error');
    }
  };

  const handleUpdateStatus = async (eventId: string, newStatus: EventStatus) => {
    try {
      await updateEvent(eventId, { status: newStatus });
      showToast(`Event status updated to ${newStatus}.`);
    } catch (e: any) {
      showToast(e.message || 'Failed to update status.', 'error');
    }
  };

  // Seed Events Handler
  const handleSeedEvents = async () => {
    setIsSeeding(true);
    try {
      const count = await forceSeedEvents();
      showToast(`Added ${count} sample events to Firestore!`);
    } catch (e: any) {
      showToast(e.message || 'Failed to seed sample events.', 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  // Selected event for details view
  const currentSelectedEvent = useMemo(() => {
    if (!selectedEventId) return events[0] || null;
    return events.find((e) => e.id === selectedEventId) || events[0] || null;
  }, [events, selectedEventId]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased selection:bg-violet-100 selection:text-violet-900">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-semibold ${
              toast.type === 'success'
                ? 'bg-slate-900 text-white border-slate-800'
                : 'bg-rose-600 text-white border-rose-700'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-white shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenCreateEvent={handleOpenCreateEvent}
      />

      {/* Main Page Content Router */}
      <main className="flex-1">
        {eventsLoading && events.length === 0 ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Loading EventEase System...</p>
          </div>
        ) : (
          <>
            {/* 1. Landing Page */}
            {currentPage === 'landing' && (
              <LandingPage
                events={events}
                onNavigate={handleNavigate}
                onSelectEvent={handleSelectEvent}
                onRegisterEvent={handleOpenRegister}
                userRegistrationEventIds={userRegistrationEventIds}
              />
            )}

            {/* 2. Events Explorer Page */}
            {currentPage === 'events' && (
              <EventsPage
                events={events}
                onSelectEvent={handleSelectEvent}
                onRegisterEvent={handleOpenRegister}
                userRegistrationEventIds={userRegistrationEventIds}
              />
            )}

            {/* 3. Event Details Page */}
            {currentPage === 'event-details' && currentSelectedEvent && (
              <EventDetailsPage
                event={currentSelectedEvent}
                onBack={() => handleNavigate('events')}
                onRegister={handleOpenRegister}
                onEdit={handleOpenEditEvent}
                onDelete={handleDeleteEvent}
                onViewParticipants={(id) => handleNavigate('participants', id)}
                isRegistered={userRegistrationEventIds.has(currentSelectedEvent.id)}
              />
            )}

            {/* 4. My Bookings Page */}
            {currentPage === 'my-bookings' && (
              <MyBookingsPage
                registrations={userRegistrations}
                onSelectEvent={handleSelectEvent}
                onCancelRegistration={handleOpenCancel}
                onExploreEvents={() => handleNavigate('events')}
              />
            )}

            {/* 5. Profile Page */}
            {currentPage === 'profile' && (
              <ProfilePage
                registrations={userRegistrations}
                onNavigate={handleNavigate}
              />
            )}

            {/* 6. Admin Dashboard */}
            {currentPage === 'admin-dashboard' && (
              <AdminDashboard
                stats={dashboardStats}
                events={events}
                registrations={allRegistrations}
                onOpenCreateEvent={handleOpenCreateEvent}
                onNavigate={handleNavigate}
                onSeedEvents={handleSeedEvents}
                isSeeding={isSeeding}
              />
            )}

            {/* 7. Manage Events Page */}
            {currentPage === 'manage-events' && (
              <ManageEventsPage
                events={events}
                onOpenCreateEvent={handleOpenCreateEvent}
                onEditEvent={handleOpenEditEvent}
                onDeleteEvent={handleDeleteEvent}
                onUpdateEventStatus={handleUpdateStatus}
                onViewEventDetails={handleSelectEvent}
                onViewParticipants={(id) => handleNavigate('participants', id)}
              />
            )}

            {/* 8. Participants Registry Page */}
            {currentPage === 'participants' && (
              <ParticipantsPage
                registrations={allRegistrations}
                events={events}
                initialEventId={participantsFilterEventId}
                onCancelRegistration={handleOpenCancel}
                onSelectEvent={handleSelectEvent}
              />
            )}

            {/* 9 & 10. Login and Registration */}
            {(currentPage === 'login' || currentPage === 'register') && (
              <AuthPage
                initialMode={currentPage as 'login' | 'register'}
                onSuccess={(target) => handleNavigate(target || 'events')}
              />
            )}
          </>
        )}
      </main>

      {/* Global Modals */}
      {bookingEvent && (
        <BookingModal
          event={bookingEvent}
          isOpen={!!bookingEvent}
          onClose={() => setBookingEvent(null)}
          onSuccess={handleBookingSuccess}
          onRequireLogin={() => {
            setBookingEvent(null);
            handleNavigate('login');
          }}
        />
      )}

      {confirmationReg && (
        <BookingConfirmationModal
          registration={confirmationReg}
          isOpen={!!confirmationReg}
          onClose={() => setConfirmationReg(null)}
          onGoToBookings={() => handleNavigate('my-bookings')}
        />
      )}

      {eventFormState.isOpen && (
        <EventFormModal
          isOpen={eventFormState.isOpen}
          mode={eventFormState.mode}
          initialEvent={eventFormState.event}
          onClose={() => setEventFormState({ isOpen: false, mode: 'create', event: null })}
          onSubmit={handleSaveEvent}
        />
      )}

      {cancelModalReg && (
        <CancelModal
          registration={cancelModalReg}
          isOpen={!!cancelModalReg}
          onClose={() => setCancelModalReg(null)}
          onConfirm={handleConfirmCancel}
        />
      )}

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <EventEaseApp />
    </AuthProvider>
  );
}
