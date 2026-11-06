import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Download, 
  Filter, 
  XCircle, 
  CheckCircle2, 
  Mail, 
  Phone, 
  Calendar, 
  Ticket,
  FileSpreadsheet
} from 'lucide-react';
import { RegistrationItem, EventItem } from '../types';

interface ParticipantsPageProps {
  registrations: RegistrationItem[];
  events: EventItem[];
  initialEventId?: string;
  onCancelRegistration: (registration: RegistrationItem) => void;
  onSelectEvent: (eventId: string) => void;
}

export const ParticipantsPage: React.FC<ParticipantsPageProps> = ({
  registrations,
  events,
  initialEventId,
  onCancelRegistration,
  onSelectEvent,
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(initialEventId || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'confirmed' | 'cancelled'>('All');

  // Filter participants
  const filteredParticipants = useMemo(() => {
    return registrations.filter((reg) => {
      if (selectedEventId !== 'All' && reg.eventId !== selectedEventId) {
        return false;
      }
      if (statusFilter !== 'All' && reg.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = reg.userName.toLowerCase().includes(q);
        const matchesEmail = reg.userEmail.toLowerCase().includes(q);
        const matchesPhone = reg.userPhone.toLowerCase().includes(q);
        const matchesRef = reg.bookingReference.toLowerCase().includes(q);
        const matchesEvent = reg.eventTitle.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesRef && !matchesEvent) {
          return false;
        }
      }
      return true;
    });
  }, [registrations, selectedEventId, statusFilter, searchQuery]);

  // Real-time counts
  const totalCount = filteredParticipants.length;
  const confirmedCount = filteredParticipants.filter((r) => r.status === 'confirmed').length;
  const totalTickets = filteredParticipants
    .filter((r) => r.status === 'confirmed')
    .reduce((sum, r) => sum + (r.ticketQuantity || 1), 0);

  // Export to CSV functionality
  const handleExportCSV = () => {
    if (filteredParticipants.length === 0) return;

    const headers = ['Booking Reference', 'Attendee Name', 'Attendee Email', 'Phone', 'Event Title', 'Event Date', 'Tickets', 'Status', 'Registered At', 'Notes'];
    
    const rows = filteredParticipants.map((r) => [
      `"${r.bookingReference}"`,
      `"${r.userName.replace(/"/g, '""')}"`,
      `"${r.userEmail}"`,
      `"${r.userPhone}"`,
      `"${r.eventTitle.replace(/"/g, '""')}"`,
      `"${r.eventDate}"`,
      r.ticketQuantity,
      `"${r.status}"`,
      `"${r.registeredAt}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `eventease_participants_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="relative space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
            Registration Management
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Participant Directory</h1>
          <p className="text-xs text-slate-300">
            View registered attendees, verify ticket passes, export rosters, and manage admission statuses.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={filteredParticipants.length === 0}
          className="relative px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition flex items-center gap-2 self-start sm:self-auto shrink-0 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
        >
          <FileSpreadsheet className="w-4 h-4 text-violet-200" />
          Export CSV Roster
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Records
          </span>
          <p className="text-2xl font-extrabold text-slate-900">{totalCount}</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
            Active Attendees
          </span>
          <p className="text-2xl font-extrabold text-emerald-700">{confirmedCount}</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600">
            Issued Passes
          </span>
          <p className="text-2xl font-extrabold text-violet-700">{totalTickets}</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
            Cancellations
          </span>
          <p className="text-2xl font-extrabold text-rose-700">{totalCount - confirmedCount}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by participant name, email, phone, or reference code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Event Selector */}
        <div className="w-full sm:w-64">
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
          >
            <option value="All">All Events ({registrations.length})</option>
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title.length > 32 ? `${evt.title.slice(0, 32)}...` : evt.title}
              </option>
            ))}
          </select>
        </div>

        {/* Status Selector */}
        <div className="w-full sm:w-36">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Participants Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredParticipants.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-3.5 px-4">Booking Ref</th>
                  <th className="py-3.5 px-4">Participant</th>
                  <th className="py-3.5 px-4">Event Details</th>
                  <th className="py-3.5 px-4">Passes</th>
                  <th className="py-3.5 px-4">Registration Time</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredParticipants.map((reg) => {
                  const isConfirmed = reg.status === 'confirmed';

                  return (
                    <tr key={reg.id} className="hover:bg-slate-50/70 transition">
                      
                      {/* Booking Reference */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {reg.bookingReference}
                        </span>
                      </td>

                      {/* Attendee */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900">{reg.userName}</p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {reg.userEmail}
                          </p>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {reg.userPhone}
                          </p>
                        </div>
                      </td>

                      {/* Event */}
                      <td className="py-3.5 px-4 max-w-[220px]">
                        <p
                          onClick={() => onSelectEvent(reg.eventId)}
                          className="font-bold text-slate-800 truncate hover:text-violet-600 cursor-pointer"
                        >
                          {reg.eventTitle}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {reg.eventDate} • {reg.eventVenue}
                        </p>
                      </td>

                      {/* Tickets */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-800">
                        {reg.ticketQuantity} {reg.ticketQuantity === 1 ? 'Seat' : 'Seats'}
                      </td>

                      {/* Registered Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                        {new Date(reg.registeredAt).toLocaleDateString()}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isConfirmed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {reg.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        {isConfirmed ? (
                          <button
                            onClick={() => onCancelRegistration(reg)}
                            className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11px] font-semibold transition inline-flex items-center gap-1"
                          >
                            <XCircle className="w-3 h-3" />
                            Cancel Pass
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Cancelled</span>
                        )}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 p-6 space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No participants found</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              There are no attendees matching your current filters.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
