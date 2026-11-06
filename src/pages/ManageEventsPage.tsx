import React, { useState } from 'react';
import { 
  Calendar, 
  PlusCircle, 
  Search, 
  Edit3, 
  Trash2, 
  Users, 
  ExternalLink, 
  MapPin, 
  Filter, 
  CheckCircle,
  AlertCircle,
  Lock,
  Unlock,
  Eye
} from 'lucide-react';
import { EventItem, EventStatus, EventCategory } from '../types';

interface ManageEventsPageProps {
  events: EventItem[];
  onOpenCreateEvent: () => void;
  onEditEvent: (event: EventItem) => void;
  onDeleteEvent: (eventId: string) => Promise<void>;
  onUpdateEventStatus: (eventId: string, newStatus: EventStatus) => Promise<void>;
  onViewEventDetails: (eventId: string) => void;
  onViewParticipants: (eventId: string) => void;
}

export const ManageEventsPage: React.FC<ManageEventsPageProps> = ({
  events,
  onOpenCreateEvent,
  onEditEvent,
  onDeleteEvent,
  onUpdateEventStatus,
  onViewEventDetails,
  onViewParticipants,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredEvents = events.filter((e) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = e.title.toLowerCase().includes(q);
      const matchesLoc = e.location.toLowerCase().includes(q);
      const matchesOrg = e.organizerName.toLowerCase().includes(q);
      if (!matchesTitle && !matchesLoc && !matchesOrg) return false;
    }
    if (filterCategory !== 'All' && e.category !== filterCategory) return false;
    if (filterStatus !== 'All' && e.status !== filterStatus) return false;
    return true;
  });

  const handleDelete = async (e: EventItem) => {
    if (window.confirm(`Are you sure you want to permanently delete "${e.title}"? This action cannot be undone.`)) {
      await onDeleteEvent(e.id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="relative space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
            Admin Operations
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Manage Events Catalog</h1>
          <p className="text-xs text-slate-300">
            Create, update schedules, configure participant maximum limits, and monitor live seat capacities.
          </p>
        </div>

        <button
          onClick={onOpenCreateEvent}
          className="relative px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-violet-200" />
          Create New Event
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search events by title, organizer, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Category */}
        <div className="w-full sm:w-44">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
          >
            <option value="All">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Business">Business</option>
            <option value="Design & Arts">Design & Arts</option>
            <option value="Music & Concerts">Music & Concerts</option>
            <option value="Workshops">Workshops</option>
            <option value="Sports & Fitness">Sports & Fitness</option>
            <option value="Community & Networking">Community & Networking</option>
          </select>
        </div>

        {/* Status */}
        <div className="w-full sm:w-36">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-3.5 px-4">Event</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date & Location</th>
                  <th className="py-3.5 px-4">Capacity Progress</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvents.map((event) => {
                  const current = event.currentParticipants || 0;
                  const max = event.maxParticipants || 1;
                  const pct = Math.min(100, Math.round((current / max) * 100));

                  return (
                    <tr key={event.id} className="hover:bg-slate-50/70 transition">
                      
                      {/* Event Banner & Title */}
                      <td className="py-3.5 px-4 max-w-[280px]">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                            <img
                              src={event.imageUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <h3
                              onClick={() => onViewEventDetails(event.id)}
                              className="font-bold text-slate-900 truncate hover:text-violet-600 cursor-pointer text-xs"
                            >
                              {event.title}
                            </h3>
                            <p className="text-[11px] text-slate-400 truncate">
                              Organized by {event.organizerName}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {event.category}
                        </span>
                      </td>

                      {/* Date & Location */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <p className="font-semibold text-slate-800">{event.date} • {event.time}</p>
                        <p className="text-[11px] text-slate-400">{event.location}</p>
                      </td>

                      {/* Capacity */}
                      <td className="py-3.5 px-4 min-w-[160px]">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-800">{current} / {max}</span>
                            <span className="text-slate-400">{pct}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                pct >= 100 ? 'bg-rose-500' : pct >= 80 ? 'bg-amber-500' : 'bg-violet-600'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={event.status}
                          onChange={(e) => onUpdateEventStatus(event.id, e.target.value as EventStatus)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold border cursor-pointer focus:outline-none ${
                            event.status === 'open'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : event.status === 'closed'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          <option value="open">Open</option>
                          <option value="closed">Closed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onViewParticipants(event.id)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                            title="View registered attendees"
                          >
                            <Users className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onEditEvent(event)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                            title="Edit Event"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(event)}
                            className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                            title="Delete Event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 p-6 space-y-3">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No events found</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              There are no events matching your filter query.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
