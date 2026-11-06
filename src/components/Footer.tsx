import React from 'react';
import { Calendar, Heart, Shield, Sparkles, MapPin, Mail, Phone } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-md shadow-violet-500/20">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Event<span className="text-violet-400">Ease</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              The modern, cloud-powered event management and attendee booking system designed for seamless discovery, ticket reservations, and organizer controls.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Firebase Cloud Firestore Connected
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('landing')}
                  className="hover:text-white transition text-slate-400"
                >
                  Featured Events
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('events')}
                  className="hover:text-white transition text-slate-400"
                >
                  Browse All Events
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('my-bookings')}
                  className="hover:text-white transition text-slate-400"
                >
                  My Bookings & Passes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('profile')}
                  className="hover:text-white transition text-slate-400"
                >
                  Attendee Profile
                </button>
              </li>
            </ul>
          </div>

          {/* Organizer / Admin */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Organizers & Admins
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className="hover:text-white transition text-slate-400"
                >
                  Organizer Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('manage-events')}
                  className="hover:text-white transition text-slate-400"
                >
                  Manage Events & Limits
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('participants')}
                  className="hover:text-white transition text-slate-400"
                >
                  Registered Attendees
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('login')}
                  className="hover:text-white transition text-slate-400"
                >
                  Admin Portal Sign In
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Support & Inquiries
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-violet-400 shrink-0" />
                <span>support@eventease.live</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-violet-400 shrink-0" />
                <span>+1 (800) 555-EVENT</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-violet-400 shrink-0" />
                <span>San Francisco, California</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} EventEase Systems. Built with React, Tailwind CSS, & Firebase.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Audited</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
