import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  X, 
  SlidersHorizontal,
  Sparkles,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { EventItem, EventCategory } from '../types';
import { EventCard } from '../components/EventCard';

interface EventsPageProps {
  events: EventItem[];
  onSelectEvent: (eventId: string) => void;
  onRegisterEvent: (event: EventItem) => void;
  userRegistrationEventIds: Set<string>;
}

const ALL_CATEGORIES: (EventCategory | 'All')[] = [
  'All',
  'Technology',
  'Business',
  'Design & Arts',
  'Music & Concerts',
  'Workshops',
  'Sports & Fitness',
  'Community & Networking',
];

export const EventsPage: React.FC<EventsPageProps> = ({
  events,
  onSelectEvent,
  onRegisterEvent,
  userRegistrationEventIds,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'All'>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('All');
  const [availabilityOnly, setAvailabilityOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'date-asc' | 'date-desc' | 'capacity' | 'title'>('date-asc');

  // Extract unique locations dynamically from current events
  const uniqueLocations = useMemo(() => {
    const locs = new Set<string>();
    events.forEach((e) => {
      if (e.location) {
        // extract city portion
        const parts = e.location.split(',');
        locs.add(parts[0].trim());
      }
    });
    return Array.from(locs);
  }, [events]);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(q);
        const matchesDesc = event.description.toLowerCase().includes(q);
        const matchesVenue = event.venue.toLowerCase().includes(q);
        const matchesLocation = event.location.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesVenue && !matchesLocation) {
          return false;
        }
      }

      // 2. Category
      if (selectedCategory !== 'All' && event.category !== selectedCategory) {
        return false;
      }

      // 3. Location
      if (selectedLocation !== 'All' && !event.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
        return false;
      }

      // 4. Availability
      if (availabilityOnly) {
        const current = event.currentParticipants || 0;
        const max = event.maxParticipants || 1;
        if (event.status !== 'open' || current >= max) {
          return false;
        }
      }

      // 5. Date filter
      if (selectedDateRange !== 'All') {
        const eventDate = new Date(event.date);
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        if (selectedDateRange === 'this-month') {
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          if (eventDate < now || eventDate > endOfMonth) return false;
        } else if (selectedDateRange === 'next-month') {
          const startNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          const endNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
          if (eventDate < startNextMonth || eventDate > endNextMonth) return false;
        } else if (selectedDateRange === 'upcoming') {
          if (eventDate < now) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date-asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'date-desc') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'capacity') {
        return (b.maxParticipants || 0) - (a.maxParticipants || 0);
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [events, searchQuery, selectedCategory, selectedLocation, availabilityOnly, selectedDateRange, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLocation('All');
    setSelectedDateRange('All');
    setAvailabilityOnly(false);
    setSortBy('date-asc');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'All' ||
    selectedLocation !== 'All' ||
    selectedDateRange !== 'All' ||
    availabilityOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-violet-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-2xl space-y-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
            Event Explorer
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Explore Upcoming Events
          </h1>
          <p className="text-sm text-slate-300">
            Browse through our verified schedule of industry summits, creative masterclasses, and music performances.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
        
        {/* Search Bar + Location + Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search by text */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by event title, keyword, or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Location filter */}
          <div className="sm:col-span-3 relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            >
              <option value="All">All Locations</option>
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range filter */}
          <div className="sm:col-span-2">
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            >
              <option value="All">Any Date</option>
              <option value="upcoming">Future Only</option>
              <option value="this-month">This Month</option>
              <option value="next-month">Next Month</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="sm:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            >
              <option value="date-asc">Date: Soonest</option>
              <option value="date-desc">Date: Furthest</option>
              <option value="capacity">Capacity: High</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Availability Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 max-w-4xl">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/20 font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={availabilityOnly}
                onChange={(e) => setAvailabilityOnly(e.target.checked)}
                className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-slate-300"
              />
              <span>Open Spots Only</span>
            </label>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 transition"
              >
                <RefreshCw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>
          Showing <strong className="text-slate-900">{filteredEvents.length}</strong> of{' '}
          {events.length} total events
        </span>
        {hasActiveFilters && (
          <span className="text-violet-600 font-semibold">
            Filters currently applied
          </span>
        )}
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onViewDetails={onSelectEvent}
              onRegister={onRegisterEvent}
              isRegistered={userRegistrationEventIds.has(event.id)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No events found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn't find any events matching your selected search criteria. Try modifying your search or reset filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-violet-600 text-white font-semibold text-xs hover:bg-violet-700 transition shadow-sm"
          >
            Clear All Filters
          </button>
        </div>
      )}

    </div>
  );
};
