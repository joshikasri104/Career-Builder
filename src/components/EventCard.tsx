import React from 'react';
import { Calendar, Clock, MapPin, Users, Ticket, ArrowRight, CheckCircle2 } from 'lucide-react';
import { EventItem } from '../types';

interface EventCardProps {
  event: EventItem;
  onViewDetails: (eventId: string) => void;
  onRegister?: (event: EventItem) => void;
  isRegistered?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onViewDetails,
  onRegister,
  isRegistered = false,
}) => {
  const current = event.currentParticipants || 0;
  const max = event.maxParticipants || 1;
  const percentFilled = Math.min(100, Math.round((current / max) * 100));
  const remaining = Math.max(0, max - current);
  const isSoldOut = remaining <= 0 || event.status === 'closed';
  const isCancelled = event.status === 'cancelled';

  // Format date nicely
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-violet-200 transition-all duration-300 flex flex-col h-full">
      
      {/* Event Image Banner with Overlays */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 text-slate-800 shadow-sm backdrop-blur-sm">
            {event.category}
          </span>
        </div>

        {/* Status Pill */}
        <div className="absolute top-3 right-3">
          {isCancelled ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-600 text-white shadow-sm">
              Cancelled
            </span>
          ) : isSoldOut ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-600 text-white shadow-sm">
              Sold Out
            </span>
          ) : remaining <= 15 ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white shadow-sm animate-pulse">
              Only {remaining} left
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-sm">
              Available
            </span>
          )}
        </div>

        {/* Price Tag Overlay at bottom right of image */}
        <div className="absolute bottom-3 right-3">
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900/90 text-white backdrop-blur-sm">
            {event.price && event.price > 0 ? `$${event.price}` : 'Free'}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          
          {/* Date & Time Row */}
          <div className="flex items-center gap-3 text-xs font-medium text-violet-700">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(event.date)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {event.time}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onViewDetails(event.id)}
            className="font-bold text-lg text-slate-900 line-clamp-2 hover:text-violet-600 transition cursor-pointer leading-snug"
          >
            {event.title}
          </h3>

          {/* Location & Venue */}
          <p className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{event.venue}, {event.location}</span>
          </p>

          {/* Description snippet */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Capacity Bar & Action Buttons */}
        <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-slate-400" />
                Capacity
              </span>
              <span>
                <strong className="text-slate-800">{current}</strong> / {max} registered ({percentFilled}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
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
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onViewDetails(event.id)}
              className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition flex items-center justify-center gap-1"
            >
              Details
              <ArrowRight className="w-3 h-3" />
            </button>

            {isRegistered ? (
              <span className="py-2 px-3 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Booked
              </span>
            ) : isSoldOut || isCancelled ? (
              <button
                disabled
                className="py-2 px-3 text-xs font-semibold rounded-xl bg-slate-100 text-slate-400 cursor-not-allowed"
              >
                {isCancelled ? 'Cancelled' : 'Sold Out'}
              </button>
            ) : onRegister ? (
              <button
                onClick={() => onRegister(event)}
                className="py-2 px-3.5 text-xs font-semibold rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition shadow-sm shadow-violet-500/20 flex items-center justify-center gap-1"
              >
                <Ticket className="w-3.5 h-3.5" />
                Register
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
