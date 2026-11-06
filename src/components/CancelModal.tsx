import React, { useState } from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { RegistrationItem } from '../types';

interface CancelModalProps {
  registration: RegistrationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (registration: RegistrationItem) => Promise<void>;
}

export const CancelModal: React.FC<CancelModalProps> = ({
  registration,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !registration) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(registration);
      onClose();
    } catch (e) {
      console.error('Cancellation error:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900">Cancel Registration?</h3>
        
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          Are you sure you want to cancel your registration for{' '}
          <strong className="text-slate-900">{registration.eventTitle}</strong>?
        </p>

        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-1">
          <p>
            • Reference Code:{' '}
            <span className="font-mono font-semibold text-slate-800">
              {registration.bookingReference}
            </span>
          </p>
          <p>
            • {registration.ticketQuantity}{' '}
            {registration.ticketQuantity === 1 ? 'ticket' : 'tickets'} will be returned to the event seat capacity.
          </p>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition"
          >
            Keep Ticket
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-sm shadow-rose-500/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Cancelling...
              </>
            ) : (
              'Confirm Cancellation'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
