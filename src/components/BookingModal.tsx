import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Users, Ticket, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { EventItem, RegistrationItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { registerForEvent } from '../services/eventService';

interface BookingModalProps {
  event: EventItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (registration: RegistrationItem) => void;
  onRequireLogin: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  event,
  isOpen,
  onClose,
  onSuccess,
  onRequireLogin,
}) => {
  const { currentUser, userProfile } = useAuth();

  const [userName, setUserName] = useState(userProfile?.displayName || '');
  const [userEmail, setUserEmail] = useState(currentUser?.email || '');
  const [userPhone, setUserPhone] = useState(userProfile?.phone || '');
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const current = event.currentParticipants || 0;
  const max = event.maxParticipants || 1;
  const remaining = Math.max(0, max - current);
  const maxAllowedTickets = Math.min(5, remaining);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!currentUser) {
      onRequireLogin();
      return;
    }

    if (!userName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!userEmail.trim() || !userEmail.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    if (!userPhone.trim()) {
      setErrorMessage('Please enter a contact phone number.');
      return;
    }

    if (ticketQuantity <= 0 || ticketQuantity > maxAllowedTickets) {
      setErrorMessage(`Please select between 1 and ${maxAllowedTickets} tickets.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const newRegistration = await registerForEvent({
        event,
        userId: currentUser.uid,
        userName: userName.trim(),
        userEmail: userEmail.trim(),
        userPhone: userPhone.trim(),
        ticketQuantity,
        notes: notes.trim(),
      });

      onSuccess(newRegistration);
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrorMessage(error.message || 'An error occurred during booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="relative bg-slate-900 text-white p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30 mb-2">
            Event Registration
          </span>
          <h2 className="text-xl font-bold leading-snug line-clamp-2">{event.title}</h2>

          <div className="flex flex-wrap gap-y-1 gap-x-4 mt-3 text-xs text-slate-300">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-violet-400" />
              {event.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-violet-400" />
              {event.time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-violet-400" />
              {event.location}
            </span>
          </div>
        </div>

        {/* Content & Form */}
        <div className="p-6">
          {/* Seats Availability Notice */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 mb-5 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-violet-600" />
              <span>Available Capacity</span>
            </div>
            <span className="font-bold text-slate-900">
              {remaining} spots available
            </span>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Registration Issue</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {!currentUser ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center mx-auto">
                <Ticket className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Sign In Required</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Please log in or register an account to book your ticket and receive a digital confirmation pass.
              </p>
              <button
                type="button"
                onClick={onRequireLogin}
                className="mt-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white font-semibold text-sm hover:bg-violet-700 shadow-md shadow-violet-500/20 transition"
              >
                Sign In to Continue
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (Ticket Recipient) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="e.g. jane@example.com"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
                />
              </div>

              {/* Number of Tickets */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Number of Tickets
                  </label>
                  <span className="text-[11px] text-slate-400">Max {maxAllowedTickets} per order</span>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={ticketQuantity}
                    onChange={(e) => setTicketQuantity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                  >
                    {Array.from({ length: maxAllowedTickets }, (_, i) => i + 1).map((qty) => (
                      <option key={qty} value={qty}>
                        {qty} {qty === 1 ? 'Ticket (Standard Pass)' : 'Tickets'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Special Requests or Dietary Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Special Notes / Dietary Requirements (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Vegetarian meal, wheelchair access required..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                />
              </div>

              {/* Price Calculation */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-sm">
                <span className="text-slate-600 font-medium">Total Registration Fee:</span>
                <span className="font-bold text-base text-slate-900">
                  {event.price && event.price > 0 ? (
                    `$${event.price * ticketQuantity} USD`
                  ) : (
                    <span className="text-emerald-600">FREE Admission</span>
                  )}
                </span>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || remaining <= 0}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-violet-600 text-white font-semibold text-sm hover:bg-violet-700 shadow-md shadow-violet-500/20 transition flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Reserving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Confirm Booking
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
