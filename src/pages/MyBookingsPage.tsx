import React, { useState } from 'react';
import { 
  Ticket, 
  Calendar, 
  Clock, 
  MapPin, 
  Search, 
  Printer, 
  XCircle, 
  QrCode, 
  CheckCircle2, 
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { RegistrationItem } from '../types';

interface MyBookingsPageProps {
  registrations: RegistrationItem[];
  onSelectEvent: (eventId: string) => void;
  onCancelRegistration: (registration: RegistrationItem) => void;
  onExploreEvents: () => void;
}

export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({
  registrations,
  onSelectEvent,
  onCancelRegistration,
  onExploreEvents,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = registrations.filter((reg) => {
    if (filterStatus !== 'all' && reg.status !== filterStatus) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = reg.eventTitle.toLowerCase().includes(q);
      const matchesRef = reg.bookingReference.toLowerCase().includes(q);
      const matchesVenue = reg.eventVenue.toLowerCase().includes(q);
      return matchesTitle || matchesRef || matchesVenue;
    }
    return true;
  });

  const confirmedCount = registrations.filter((r) => r.status === 'confirmed').length;

  const handlePrintTicket = (reg: RegistrationItem) => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Page Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Attendee Portal
            </span>
            <span className="text-xs text-slate-400">
              {confirmedCount} Active {confirmedCount === 1 ? 'Booking' : 'Bookings'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            My Registered Bookings & Passes
          </h1>
          <p className="text-sm text-slate-300">
            View your event tickets, display entrance QR codes on your mobile device, or download printable confirmation passes.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              filterStatus === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Bookings ({registrations.length})
          </button>
          <button
            onClick={() => setFilterStatus('confirmed')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              filterStatus === 'confirmed'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Confirmed ({confirmedCount})
          </button>
          <button
            onClick={() => setFilterStatus('cancelled')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              filterStatus === 'cancelled'
                ? 'bg-white text-rose-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cancelled ({registrations.length - confirmedCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by event or reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
      </div>

      {/* Bookings List */}
      {filtered.length > 0 ? (
        <div className="space-y-6">
          {filtered.map((reg) => {
            const isConfirmed = reg.status === 'confirmed';

            return (
              <div
                key={reg.id}
                className={`bg-white rounded-3xl border ${
                  isConfirmed ? 'border-slate-200 shadow-sm hover:shadow-md' : 'border-slate-200/60 opacity-80'
                } p-6 sm:p-7 transition space-y-6`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                  
                  {/* Left: Event Details & Pass */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
                        {reg.bookingReference}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isConfirmed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {isConfirmed ? 'Confirmed Ticket' : 'Registration Cancelled'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Booked on {new Date(reg.registeredAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h2
                      onClick={() => onSelectEvent(reg.eventId)}
                      className="text-xl font-bold text-slate-900 hover:text-violet-600 transition cursor-pointer"
                    >
                      {reg.eventTitle}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                        <span>{reg.eventDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                        <span>{reg.eventTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                        <span className="truncate">{reg.eventVenue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Simulated QR Pass Card */}
                  <div className="flex items-center gap-4 bg-violet-50/60 border border-violet-100 rounded-2xl p-4 shrink-0">
                    <div className="w-16 h-16 bg-white rounded-xl border border-violet-200 p-1 flex items-center justify-center shadow-sm">
                      <QrCode className="w-14 h-14 text-slate-900" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700 block">
                        Entrance Gate Pass
                      </span>
                      <p className="text-xs font-bold text-slate-900">
                        {reg.ticketQuantity} {reg.ticketQuantity === 1 ? 'Person' : 'Persons'}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate max-w-[140px]">
                        {reg.userName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  <div className="text-xs text-slate-500">
                    Attendee contact: <strong className="text-slate-800">{reg.userEmail}</strong> • {reg.userPhone}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => onSelectEvent(reg.eventId)}
                      className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      Event Details
                    </button>

                    {isConfirmed && (
                      <>
                        <button
                          onClick={() => handlePrintTicket(reg)}
                          className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5 text-slate-500" />
                          Print Ticket
                        </button>

                        <button
                          onClick={() => onCancelRegistration(reg)}
                          className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition flex items-center justify-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No event registrations found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {filterStatus !== 'all'
              ? `You don't have any ${filterStatus} bookings.`
              : "You haven't reserved tickets for any events yet. Explore upcoming summits, concerts, and workshops today!"}
          </p>
          <button
            onClick={onExploreEvents}
            className="px-5 py-2.5 rounded-xl bg-violet-600 text-white font-semibold text-xs hover:bg-violet-700 shadow-md shadow-violet-500/20 transition inline-flex items-center gap-1.5"
          >
            Explore Events Schedule
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
};
