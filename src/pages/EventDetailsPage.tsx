import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Ticket, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  Edit3, 
  Trash2, 
  Sparkles,
  AlertCircle,
  Building,
  UserCheck,
  Check
} from 'lucide-react';
import { EventItem } from '../types';
import { useAuth } from '../context/AuthContext';

interface EventDetailsPageProps {
  event: EventItem;
  onBack: () => void;
  onRegister: (event: EventItem) => void;
  onEdit?: (event: EventItem) => void;
  onDelete?: (eventId: string) => void;
  onViewParticipants?: (eventId: string) => void;
  isRegistered?: boolean;
}

export const EventDetailsPage: React.FC<EventDetailsPageProps> = ({
  event,
  onBack,
  onRegister,
  onEdit,
  onDelete,
  onViewParticipants,
  isRegistered = false,
}) => {
  const { currentUser, isAdmin } = useAuth();
  const [copied, setCopied] = useState(false);

  const current = event.currentParticipants || 0;
  const max = event.maxParticipants || 1;
  const percentFilled = Math.min(100, Math.round((current / max) * 100));
  const remaining = Math.max(0, max - current);
  const isSoldOut = remaining <= 0 || event.status === 'closed';
  const isCancelled = event.status === 'cancelled';

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button and Admin Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                Share Event
              </>
            )}
          </button>

          {/* Admin Controls */}
          {isAdmin && (
            <div className="flex items-center gap-2">
              {onViewParticipants && (
                <button
                  onClick={() => onViewParticipants(event.id)}
                  className="px-3 py-1.5 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  View Attendees
                </button>
              )}

              {onEdit && (
                <button
                  onClick={() => onEdit(event)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                  Edit
                </button>
              )}

              {onDelete && (
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
                      onDelete(event.id);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Left Details & Right Booking Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Full Details */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Hero Image Card */}
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-900 shadow-lg border border-slate-200">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-800 shadow-sm backdrop-blur-sm">
                {event.category}
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                {event.title}
              </h1>
              <p className="flex items-center gap-2 text-xs text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-violet-400" />
                {event.venue}, {event.location}
              </p>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-violet-600" />
                Date
              </span>
              <p className="text-sm font-bold text-slate-900">{event.date}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-violet-600" />
                Start Time
              </span>
              <p className="text-sm font-bold text-slate-900">{event.time} Local</p>
            </div>

            <div className="space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
                <Ticket className="w-3.5 h-3.5 text-violet-600" />
                Admission Fee
              </span>
              <p className="text-sm font-bold text-slate-900">
                {event.price && event.price > 0 ? `$${event.price} USD` : 'Free Admission'}
              </p>
            </div>
          </div>

          {/* About Event Description */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">About This Event</h2>
            <div className="prose prose-slate text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {event.description}
            </div>

            {/* Event Highlights Perks */}
            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Attendee Inclusions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant digital pass with entry QR code</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Interactive Q&A session with keynotes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Official Certificate of Participation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Attendee networking lounge access</span>
                </div>
              </div>
            </div>
          </div>

          {/* Organizer Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-violet-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-violet-500/20">
              {event.organizerName.charAt(0)}
            </div>
            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Event Organizer
              </span>
              <h3 className="font-bold text-slate-900 text-base">{event.organizerName}</h3>
              <p className="text-xs text-slate-500">{event.organizerEmail}</p>
            </div>
            <div className="hidden sm:block">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                Verified Host
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: Sticky Booking Card */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xl space-y-5">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-400 font-medium">Ticket Price</span>
                <p className="text-2xl font-extrabold text-slate-900">
                  {event.price && event.price > 0 ? `$${event.price}` : 'Free'}
                </p>
              </div>
              <div>
                {isCancelled ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                    Cancelled
                  </span>
                ) : isSoldOut ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                    Sold Out
                  </span>
                ) : remaining <= 10 ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 animate-pulse">
                    Few Spots Left
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    Registration Open
                  </span>
                )}
              </div>
            </div>

            {/* Capacity Meter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-violet-600" />
                  Reserved Capacity
                </span>
                <span>{percentFilled}% Filled</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    percentFilled >= 100
                      ? 'bg-rose-500'
                      : percentFilled >= 80
                      ? 'bg-amber-500'
                      : 'bg-violet-600'
                  }`}
                  style={{ width: `${percentFilled}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{current} Confirmed Attendees</span>
                <span>{max} Total Seats</span>
              </div>
            </div>

            {/* Action Buttons based on status */}
            <div className="pt-2">
              {isRegistered ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2 text-center">
                  <div className="flex items-center justify-center gap-1.5 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    You are registered!
                  </div>
                  <p className="text-xs text-emerald-700">
                    Your digital pass is available under My Bookings.
                  </p>
                </div>
              ) : isSoldOut || isCancelled ? (
                <button
                  disabled
                  className="w-full py-3.5 px-4 rounded-xl bg-slate-200 text-slate-400 font-semibold text-sm cursor-not-allowed"
                >
                  {isCancelled ? 'Event Cancelled' : 'Registration Closed (Full)'}
                </button>
              ) : (
                <button
                  onClick={() => onRegister(event)}
                  className="w-full py-3.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-lg shadow-violet-600/30 transition flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  Register Now ({remaining} spots left)
                </button>
              )}
            </div>

            {/* Venue & Location Overview */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <Building className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block">Venue</strong>
                  <span>{event.venue}</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block">City & Region</strong>
                  <span>{event.location}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
