import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, Users, Image as ImageIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { EventItem, EventCategory, EventStatus } from '../types';
import { PRESET_EVENT_IMAGES } from '../data/seedData';
import { useAuth } from '../context/AuthContext';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<EventItem, 'id' | 'createdAt' | 'updatedAt' | 'currentParticipants'>) => Promise<void>;
  initialEvent?: EventItem | null;
  mode: 'create' | 'edit';
}

const CATEGORIES: EventCategory[] = [
  'Technology',
  'Business',
  'Design & Arts',
  'Music & Concerts',
  'Workshops',
  'Sports & Fitness',
  'Community & Networking',
];

export const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialEvent,
  mode,
}) => {
  const { currentUser, userProfile } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EventCategory>('Technology');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [venue, setVenue] = useState('');
  const [location, setLocation] = useState('');
  const [organizerName, setOrganizerName] = useState('');
  const [organizerEmail, setOrganizerEmail] = useState('');
  const [maxParticipants, setMaxParticipants] = useState<number>(100);
  const [price, setPrice] = useState<number>(0);
  const [status, setStatus] = useState<EventStatus>('open');
  const [imageUrl, setImageUrl] = useState(PRESET_EVENT_IMAGES[0].url);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state when editing or opening
  useEffect(() => {
    if (initialEvent && mode === 'edit') {
      setTitle(initialEvent.title);
      setDescription(initialEvent.description);
      setCategory(initialEvent.category);
      setDate(initialEvent.date);
      setTime(initialEvent.time);
      setVenue(initialEvent.venue);
      setLocation(initialEvent.location);
      setOrganizerName(initialEvent.organizerName);
      setOrganizerEmail(initialEvent.organizerEmail);
      setMaxParticipants(initialEvent.maxParticipants);
      setPrice(initialEvent.price || 0);
      setStatus(initialEvent.status);
      setImageUrl(initialEvent.imageUrl);
    } else {
      // Default initial values for new event
      setTitle('');
      setDescription('');
      setCategory('Technology');
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 7);
      setDate(tomorrow.toISOString().split('T')[0]);
      setTime('10:00');
      setVenue('');
      setLocation('');
      setOrganizerName(userProfile?.displayName || 'EventEase Organizer');
      setOrganizerEmail(currentUser?.email || 'organizer@eventease.app');
      setMaxParticipants(150);
      setPrice(0);
      setStatus('open');
      setImageUrl(PRESET_EVENT_IMAGES[0].url);
    }
    setErrorMessage(null);
  }, [initialEvent, mode, isOpen, userProfile, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('Please provide an event title.');
      return;
    }

    if (!description.trim() || description.length < 20) {
      setErrorMessage('Please write a descriptive event overview (at least 20 characters).');
      return;
    }

    if (!date) {
      setErrorMessage('Please choose an event date.');
      return;
    }

    if (!venue.trim()) {
      setErrorMessage('Please specify the venue address or building name.');
      return;
    }

    if (!location.trim()) {
      setErrorMessage('Please specify the city/location.');
      return;
    }

    if (maxParticipants <= 0) {
      setErrorMessage('Maximum participants must be at least 1.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        category,
        date,
        time,
        venue: venue.trim(),
        location: location.trim(),
        organizerName: organizerName.trim() || 'Event Organizer',
        organizerId: currentUser?.uid || 'admin_user',
        organizerEmail: organizerEmail.trim() || 'admin@eventease.app',
        maxParticipants: Number(maxParticipants),
        status,
        price: Number(price) || 0,
        imageUrl: imageUrl.trim() || PRESET_EVENT_IMAGES[0].url,
        featured: mode === 'edit' ? initialEvent?.featured || false : false,
      });
      onClose();
    } catch (err: any) {
      console.error('Save event failed:', err);
      setErrorMessage(err.message || 'Failed to save event. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">
              {mode === 'create' ? 'Create New Event' : 'Edit Event Details'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Fill in the parameters below to publish on EventEase.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Event Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Next-Gen AI Innovators Conference 2026"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registration Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EventStatus)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
              >
                <option value="open">Open (Accepting Registrations)</option>
                <option value="closed">Closed (Sold Out / Locked)</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Date, Time, Capacity, Price */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Max Capacity <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                max={50000}
                required
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Price ($ USD)
              </label>
              <input
                type="number"
                min={0}
                step={1}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="0 = Free"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Venue & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Venue / Hall / Building <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Grand Convention Pavilion, Hall 4"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City / Region <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Organizer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Organizer Organization / Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={organizerName}
                onChange={(e) => setOrganizerName(e.target.value)}
                placeholder="e.g. Global Tech Council"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Organizer Contact Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={organizerEmail}
                onChange={(e) => setOrganizerEmail(e.target.value)}
                placeholder="organizer@eventease.app"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Event Description & Agenda <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a comprehensive summary of keynotes, schedule, speakers, and participant guidelines..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Image Selection with Presets + Custom URL */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Event Cover Banner Image
            </label>
            
            {/* Image Preview & URL input */}
            <div className="flex gap-4 items-center">
              <div className="w-28 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PRESET_EVENT_IMAGES[0].url;
                  }}
                />
              </div>
              <div className="flex-1">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Choose a preset below or paste any custom image URL.
                </p>
              </div>
            </div>

            {/* Presets Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESET_EVENT_IMAGES.map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => setImageUrl(preset.url)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${
                    imageUrl === preset.url
                      ? 'bg-violet-50 border-violet-500 text-violet-700 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 px-6 rounded-xl bg-violet-600 text-white font-semibold text-sm hover:bg-violet-700 shadow-md shadow-violet-500/20 transition flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : mode === 'create' ? (
                'Create & Publish Event'
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
