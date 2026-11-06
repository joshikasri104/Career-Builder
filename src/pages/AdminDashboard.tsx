import React from 'react';
import { 
  Calendar, 
  Users, 
  Ticket, 
  TrendingUp, 
  PlusCircle, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Database,
  BarChart3,
  ExternalLink,
  ShieldCheck,
  Building
} from 'lucide-react';
import { EventItem, RegistrationItem, DashboardStats } from '../types';

interface AdminDashboardProps {
  stats: DashboardStats;
  events: EventItem[];
  registrations: RegistrationItem[];
  onOpenCreateEvent: () => void;
  onNavigate: (page: string, eventId?: string) => void;
  onSeedEvents: () => Promise<void>;
  isSeeding: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  events,
  registrations,
  onOpenCreateEvent,
  onNavigate,
  onSeedEvents,
  isSeeding,
}) => {
  const recentRegistrations = registrations.slice(0, 6);
  const upcomingEvents = events.slice(0, 5);

  // Group events by category for visual analytics
  const categoryCounts = events.reduce<Record<string, number>>((acc, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Top Banner & Quick Actions */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Admin & Organizer Console
            </span>
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Firestore Sync
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">System Performance & Analytics</h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Monitor real-time attendee reservations, capacity fill rates, and event operational statuses across the entire EventEase network.
          </p>
        </div>

        <div className="relative flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenCreateEvent}
            className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-violet-200" />
            Create New Event
          </button>

          <button
            onClick={onSeedEvents}
            disabled={isSeeding}
            className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition flex items-center gap-1.5"
            title="Populate realistic demo events for testing"
          >
            <Database className="w-4 h-4 text-violet-300" />
            {isSeeding ? 'Seeding Events...' : 'Seed Sample Events'}
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Events */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Events
            </span>
            <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-900">{stats.totalEvents}</p>
            <p className="text-xs text-slate-500 mt-1">
              <strong className="text-emerald-600 font-bold">{stats.activeEvents}</strong> open for registration
            </p>
          </div>
        </div>

        {/* Total Registrations */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Bookings
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-900">{stats.totalRegistrations}</p>
            <p className="text-xs text-slate-500 mt-1">
              Confirmed attendee passes
            </p>
          </div>
        </div>

        {/* Total Registered Users */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Registered Users
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-900">{stats.totalUsers || 14}</p>
            <p className="text-xs text-slate-500 mt-1">
              Attendees & organizers
            </p>
          </div>
        </div>

        {/* Capacity Fill Rate */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Capacity Utilization
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-900">{stats.occupancyRate}%</p>
            <p className="text-xs text-slate-500 mt-1">
              {stats.filledSeats} / {stats.totalCapacity} seats filled
            </p>
          </div>
        </div>

      </div>

      {/* Middle Grid: Category Distribution & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Category Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-violet-600" />
              Events by Category
            </h2>
            <span className="text-xs text-slate-400 font-medium">Distribution</span>
          </div>

          <div className="space-y-3.5">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = events.length > 0 ? Math.round((count / events.length) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>{cat}</span>
                    <span className="text-slate-400">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigate('manage-events')}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
            >
              Open Full Events Manager
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Upcoming Events Spotlight (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-violet-600" />
              Active Event Spotlights
            </h2>
            <button
              onClick={() => onNavigate('manage-events')}
              className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1"
            >
              Manage All
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {upcomingEvents.map((event) => {
              const current = event.currentParticipants || 0;
              const max = event.maxParticipants || 1;
              const pct = Math.min(100, Math.round((current / max) * 100));

              return (
                <div key={event.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={event.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3
                        onClick={() => onNavigate('event-details', event.id)}
                        className="text-xs font-bold text-slate-900 truncate hover:text-violet-600 cursor-pointer"
                      >
                        {event.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 truncate">
                        {event.date} • {event.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-right">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        {current} / {max}
                      </span>
                      <span className="text-[10px] text-slate-400">{pct}% filled</span>
                    </div>

                    <button
                      onClick={() => onNavigate('participants', event.id)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition"
                      title="View registered attendees"
                    >
                      <Users className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Recent Registrations Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Ticket className="w-4 h-4 text-violet-600" />
              Latest Attendee Registrations
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Real-time incoming event bookings</p>
          </div>

          <button
            onClick={() => onNavigate('participants')}
            className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1 self-start sm:self-auto"
          >
            View All Registrations
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentRegistrations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="pb-3">Reference</th>
                  <th className="pb-3">Attendee</th>
                  <th className="pb-3">Event</th>
                  <th className="pb-3">Tickets</th>
                  <th className="pb-3">Registration Time</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 font-mono font-bold text-slate-800">
                      {reg.bookingReference}
                    </td>
                    <td className="py-3">
                      <p className="font-bold text-slate-900">{reg.userName}</p>
                      <p className="text-[11px] text-slate-400">{reg.userEmail}</p>
                    </td>
                    <td className="py-3 text-slate-700 font-medium max-w-[200px] truncate">
                      {reg.eventTitle}
                    </td>
                    <td className="py-3 font-semibold text-slate-800">
                      {reg.ticketQuantity}
                    </td>
                    <td className="py-3 text-slate-400">
                      {new Date(reg.registeredAt).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          reg.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {reg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-xs text-slate-400">
            No registrations received yet.
          </div>
        )}
      </div>

    </div>
  );
};
