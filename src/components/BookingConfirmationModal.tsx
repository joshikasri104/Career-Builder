import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Ticket, 
  Printer, 
  ArrowRight, 
  X, 
  QrCode,
  Sparkles,
  Download
} from 'lucide-react';
import { RegistrationItem } from '../types';

interface BookingConfirmationModalProps {
  registration: RegistrationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onGoToBookings: () => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  registration,
  isOpen,
  onClose,
  onGoToBookings,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Trigger festive confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B'],
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [isOpen]);

  if (!isOpen || !registration) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Header */}
        <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white p-7 text-center relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
          
          <div className="w-16 h-16 rounded-2xl bg-white text-emerald-600 shadow-xl flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-10 h-10 stroke-[2.2]" />
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight">Booking Confirmed!</h2>
          <p className="text-violet-100 text-xs mt-1 max-w-xs mx-auto">
            You're officially on the guest list. A digital ticket pass has been generated.
          </p>

          <div className="inline-block mt-4 px-3.5 py-1.5 rounded-xl bg-white/15 border border-white/20 backdrop-blur-sm">
            <span className="text-[11px] uppercase tracking-wider text-violet-200 block">
              Booking Reference
            </span>
            <span className="font-mono text-base font-extrabold tracking-widest text-white">
              {registration.bookingReference}
            </span>
          </div>
        </div>

        {/* Digital Ticket Pass Card */}
        <div className="p-6 space-y-5">
          <div className="rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50/40 p-5 space-y-4 relative">
            {/* Notch circles */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-r border-violet-200" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-l border-violet-200" />

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700 bg-violet-100 px-2 py-0.5 rounded">
                Official Digital Admission Pass
              </span>
              <h3 className="font-bold text-slate-900 text-lg mt-1 leading-snug">
                {registration.eventTitle}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-violet-600" />
                  Date
                </span>
                <p className="font-bold text-slate-800">{registration.eventDate}</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3 text-violet-600" />
                  Time
                </span>
                <p className="font-bold text-slate-800">{registration.eventTime}</p>
              </div>

              <div className="space-y-0.5 col-span-2">
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-violet-600" />
                  Venue & Location
                </span>
                <p className="font-bold text-slate-800 truncate">
                  {registration.eventVenue} {registration.eventLocation ? `• ${registration.eventLocation}` : ''}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <User className="w-3 h-3 text-violet-600" />
                  Attendee
                </span>
                <p className="font-bold text-slate-800 truncate">{registration.userName}</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Ticket className="w-3 h-3 text-violet-600" />
                  Tickets
                </span>
                <p className="font-bold text-slate-800">
                  {registration.ticketQuantity} {registration.ticketQuantity === 1 ? 'Pass' : 'Passes'}
                </p>
              </div>
            </div>

            {/* Simulated QR Code for entry */}
            <div className="pt-3 border-t border-violet-200/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 p-1 flex items-center justify-center shadow-sm">
                  <QrCode className="w-10 h-10 text-slate-800" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-800">Scan at Entrance</p>
                  <p className="text-[10px] text-slate-400">Digital verification pass</p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                Confirmed
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            <button
              onClick={handlePrint}
              className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              Print / Save Ticket
            </button>
            <button
              onClick={() => {
                onClose();
                onGoToBookings();
              }}
              className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition shadow-sm shadow-violet-500/20"
            >
              My Bookings
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
