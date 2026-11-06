import React, { useState } from 'react';
import { 
  Calendar, 
  Ticket, 
  LayoutDashboard, 
  Users, 
  PlusCircle, 
  LogOut, 
  User, 
  Menu, 
  X, 
  Sparkles,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, eventId?: string) => void;
  onOpenCreateEvent?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenCreateEvent }) => {
  const { currentUser, userProfile, isAdmin, logout, switchRoleForTesting } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNav = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => handleNav('landing')}
              className="flex items-center gap-2.5 text-slate-900 group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-md shadow-violet-500/20 group-hover:bg-violet-700 transition">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <span className="font-bold text-xl tracking-tight text-slate-900 flex items-center gap-1">
                  Event<span className="text-violet-600">Ease</span>
                </span>
                <span className="text-[10px] font-medium tracking-wider uppercase text-slate-400 block -mt-1">
                  Smart Event System
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => handleNav('landing')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentPage === 'landing'
                    ? 'text-violet-700 bg-violet-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Home
              </button>

              <button
                onClick={() => handleNav('events')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentPage === 'events' || currentPage === 'event-details'
                    ? 'text-violet-700 bg-violet-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Explore Events
              </button>

              {currentUser && (
                <button
                  onClick={() => handleNav('my-bookings')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    currentPage === 'my-bookings'
                      ? 'text-violet-700 bg-violet-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Ticket className="w-4 h-4" />
                  My Bookings
                </button>
              )}

              {isAdmin && (
                <>
                  <div className="h-4 w-px bg-slate-200 mx-2" />
                  <button
                    onClick={() => handleNav('admin-dashboard')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                      currentPage === 'admin-dashboard'
                        ? 'text-violet-700 bg-violet-50 font-semibold'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-violet-600" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => handleNav('manage-events')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                      currentPage === 'manage-events'
                        ? 'text-violet-700 bg-violet-50 font-semibold'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Manage Events
                  </button>
                  <button
                    onClick={() => handleNav('participants')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                      currentPage === 'participants'
                        ? 'text-violet-700 bg-violet-50 font-semibold'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Users className="w-4 h-4 text-violet-600" />
                    Participants
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {isAdmin && onOpenCreateEvent && (
              <button
                onClick={onOpenCreateEvent}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm"
              >
                <PlusCircle className="w-4 h-4 text-violet-400" />
                Create Event
              </button>
            )}

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50/70 hover:bg-white transition"
                >
                  <div className="w-7 h-7 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-semibold">
                    {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 max-w-[120px] truncate">
                    {userProfile?.displayName || 'User'}
                  </span>
                  {isAdmin && (
                    <span className="text-[10px] bg-violet-100 text-violet-800 font-bold px-1.5 py-0.5 rounded">
                      Admin
                    </span>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 mr-1" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {userProfile?.displayName || 'EventEase Member'}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => handleNav('profile')}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        My Profile
                      </button>
                      <button
                        onClick={() => handleNav('my-bookings')}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Ticket className="w-4 h-4 text-slate-400" />
                        My Bookings
                      </button>
                    </div>

                    {/* Role Testing Switcher */}
                    <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/60">
                      <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                        <span className="font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-violet-600" />
                          Role Mode:
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-700'}`}>
                          {isAdmin ? 'Admin' : 'User'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          switchRoleForTesting(isAdmin ? 'user' : 'admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-center text-xs py-1 px-2 rounded border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-medium transition"
                      >
                        Switch to {isAdmin ? 'Standard User' : 'Admin / Organizer'}
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={async () => {
                          await logout();
                          setUserDropdownOpen(false);
                          handleNav('landing');
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-lg shadow-sm shadow-violet-500/20 transition"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            <button
              onClick={() => handleNav('landing')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Home
            </button>
            <button
              onClick={() => handleNav('events')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Explore Events
            </button>
            {currentUser && (
              <button
                onClick={() => handleNav('my-bookings')}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50 flex items-center gap-2"
              >
                <Ticket className="w-4 h-4 text-violet-600" />
                My Bookings
              </button>
            )}
            {isAdmin && (
              <>
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3">Admin Portal</span>
                </div>
                <button
                  onClick={() => handleNav('admin-dashboard')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50 flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-violet-600" />
                  Admin Dashboard
                </button>
                <button
                  onClick={() => handleNav('manage-events')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-violet-600" />
                  Manage Events
                </button>
                <button
                  onClick={() => handleNav('participants')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Users className="w-4 h-4 text-violet-600" />
                  All Participants
                </button>
              </>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200">
            {currentUser ? (
              <div className="space-y-2">
                <div className="px-3 py-1">
                  <p className="text-xs text-slate-500">Logged in as</p>
                  <p className="text-sm font-bold text-slate-900">{userProfile?.displayName}</p>
                  <p className="text-xs text-slate-400">{currentUser.email}</p>
                </div>
                <button
                  onClick={() => handleNav('profile')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  Profile Settings
                </button>
                <button
                  onClick={async () => {
                    await logout();
                    handleNav('landing');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleNav('login')}
                  className="w-full py-2.5 text-center text-sm font-semibold border border-slate-200 rounded-lg text-slate-800 hover:bg-slate-50"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="w-full py-2.5 text-center text-sm font-semibold rounded-lg text-white bg-violet-600 hover:bg-violet-700"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
