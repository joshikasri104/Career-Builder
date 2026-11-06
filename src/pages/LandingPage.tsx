import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Users, 
  Award, 
  CheckCircle,
  TrendingUp,
  Cpu,
  Briefcase,
  Music,
  Palette,
  Dumbbell,
  GraduationCap
} from 'lucide-react';
import { EventItem, EventCategory } from '../types';
import { EventCard } from '../components/EventCard';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  events: EventItem[];
  onNavigate: (page: string, eventId?: string) => void;
  onSelectEvent: (eventId: string) => void;
  onRegisterEvent: (event: EventItem) => void;
  userRegistrationEventIds: Set<string>;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  events,
  onNavigate,
  onSelectEvent,
  onRegisterEvent,
  userRegistrationEventIds,
}) => {
  const { isAdmin } = useAuth();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');

  // Featured events
  const featuredEvents = events.filter((e) => e.featured || e.status === 'open').slice(0, 3);
  const upcomingEvents = events.slice(0, 6);

  // Category counts
  const categoriesList = [
    { name: 'Technology', icon: Cpu, count: events.filter(e => e.category === 'Technology').length },
    { name: 'Business', icon: Briefcase, count: events.filter(e => e.category === 'Business').length },
    { name: 'Music & Concerts', icon: Music, count: events.filter(e => e.category === 'Music & Concerts').length },
    { name: 'Design & Arts', icon: Palette, count: events.filter(e => e.category === 'Design & Arts').length },
    { name: 'Workshops', icon: GraduationCap, count: events.filter(e => e.category === 'Workshops').length },
    { name: 'Sports & Fitness', icon: Dumbbell, count: events.filter(e => e.category === 'Sports & Fitness').length },
  ];

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('events');
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-16 pb-20 lg:pt-24 lg:pb-32">
        {/* Subtle decorative background lights */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/15 border border-violet-400/25 text-violet-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Smart Event Management & Seamless Ticket Booking</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Discover, Attend & Manage <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300">
                Remarkable Experiences
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
              EventEase empowers attendees to discover verified conferences, workshops, and concerts while giving organizers total control over capacity, registrations, and analytics.
            </p>

            {/* Search Bar Widget */}
            <form
              onSubmit={handleHeroSearch}
              className="mt-8 p-2 sm:p-2.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex-1 w-full flex items-center gap-2.5 px-3 py-2 bg-white/10 rounded-xl">
                <Search className="w-4 h-4 text-violet-300 shrink-0" />
                <input
                  type="text"
                  placeholder="Search events, keywords, or topics..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
                />
              </div>

              <div className="w-full sm:w-44 flex items-center gap-2 px-3 py-2 bg-white/10 rounded-xl text-slate-300">
                <MapPin className="w-4 h-4 text-violet-300 shrink-0" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-transparent text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="All" className="bg-slate-900 text-white">All Locations</option>
                  <option value="San Francisco" className="bg-slate-900 text-white">San Francisco, CA</option>
                  <option value="New York" className="bg-slate-900 text-white">New York, NY</option>
                  <option value="Austin" className="bg-slate-900 text-white">Austin, TX</option>
                  <option value="Chicago" className="bg-slate-900 text-white">Chicago, IL</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm shadow-lg shadow-violet-600/30 transition flex items-center justify-center gap-2 shrink-0"
              >
                Find Events
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Metrics Bar */}
            <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-2xl sm:text-3xl font-extrabold text-white">{events.length}+</p>
                <p className="text-xs text-slate-400 mt-1">Curated Events</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-2xl sm:text-3xl font-extrabold text-violet-400">100%</p>
                <p className="text-xs text-slate-400 mt-1">Verified Organizers</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-2xl sm:text-3xl font-extrabold text-white">Real-Time</p>
                <p className="text-xs text-slate-400 mt-1">Firestore Seat Sync</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">Instant</p>
                <p className="text-xs text-slate-400 mt-1">Digital QR Passes</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Events Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-violet-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              Editor's Handpicked
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Events This Month
            </h2>
          </div>

          <button
            onClick={() => onNavigate('events')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-700 transition group"
          >
            Browse All {events.length} Events
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onViewDetails={onSelectEvent}
              onRegister={onRegisterEvent}
              isRegistered={userRegistrationEventIds.has(event.id)}
            />
          ))}
        </div>
      </section>

      {/* Explore By Category */}
      <section className="bg-slate-50 border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore by Category
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              From tech keynotes to live indie concerts, discover events matching your passion.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoriesList.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => onNavigate('events')}
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-violet-300 hover:shadow-lg transition-all text-center group flex flex-col items-center justify-center space-y-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition flex items-center justify-center shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-800 group-hover:text-violet-700 transition">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {cat.count} {cat.count === 1 ? 'event' : 'events'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose EventEase Feature Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-3 py-1 rounded-full">
            Engineering Precision
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
            Why Event Organizers & Attendees Rely on EventEase
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Built with strict ACID-compliant Firestore transactional locks and role-based permissions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Zero Overbooking Guarantee</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every ticket reservation uses atomic Firestore runTransactions. Once an event hits its maximum attendee capacity, registrations lock automatically to prevent duplicates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Digital QR Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Attendees instantly receive unique booking references and digital entrance passes ready for mobile display or one-click printable admission tickets.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Comprehensive Organizer Suite</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time attendance graphs, participant filtering, CSV roster exports, and instant event editing capabilities directly from the Admin Portal.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Upcoming Events Calendar
            </h2>
            <p className="text-xs text-slate-500 mt-1">Reserve your spot before capacity runs out.</p>
          </div>
          <button
            onClick={() => onNavigate('events')}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            View Full List
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onViewDetails={onSelectEvent}
              onRegister={onRegisterEvent}
              isRegistered={userRegistrationEventIds.has(event.id)}
            />
          ))}
        </div>
      </section>

      {/* Organizer Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-violet-950 text-white p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/30 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              For Event Directors & Organizers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Host Your Next Conference, Gala, or Meetup?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Launch events in minutes with full attendee management, custom participant limits, and real-time dashboard analytics.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate(isAdmin ? 'manage-events' : 'login')}
                className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm shadow-lg shadow-violet-600/30 transition flex items-center gap-2"
              >
                {isAdmin ? 'Open Event Manager' : 'Sign in as Organizer'}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('events')}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition"
              >
                Browse Public Schedule
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
