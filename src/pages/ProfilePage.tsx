import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Calendar, 
  Ticket, 
  CheckCircle2, 
  Edit3, 
  Save, 
  LogOut,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RegistrationItem } from '../types';

interface ProfilePageProps {
  registrations: RegistrationItem[];
  onNavigate: (page: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  registrations,
  onNavigate,
}) => {
  const { 
    currentUser, 
    userProfile, 
    isAdmin, 
    logout, 
    updateCurrentProfile, 
    switchRoleForTesting 
  } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const confirmedCount = registrations.filter((r) => r.status === 'confirmed').length;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCurrentProfile({
      displayName: displayName.trim(),
      phone: phone.trim(),
      bio: bio.trim(),
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        
        {/* Banner Top */}
        <div className="h-32 bg-gradient-to-r from-slate-900 via-indigo-950 to-violet-900 relative">
          <div className="absolute right-6 top-6">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${
              isAdmin
                ? 'bg-purple-500/30 text-purple-200 border border-purple-400/30'
                : 'bg-white/20 text-white border border-white/30'
            }`}>
              {isAdmin ? 'Administrator / Organizer' : 'Event Attendee'}
            </span>
          </div>
        </div>

        {/* Profile Info Row */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 mb-6">
            
            {/* Avatar */}
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-3xl bg-violet-600 text-white font-extrabold text-3xl flex items-center justify-center border-4 border-white shadow-xl">
                {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="pb-1">
                <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">
                  {userProfile?.displayName || 'EventEase Member'}
                </h1>
                <p className="text-xs text-slate-500">{currentUser?.email}</p>
              </div>
            </div>

            {/* Edit Profile Action */}
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <button
                  onClick={() => {
                    setDisplayName(userProfile?.displayName || '');
                    setPhone(userProfile?.phone || '');
                    setBio(userProfile?.bio || '');
                    setIsEditing(true);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {saveSuccess && (
            <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Your profile information has been successfully updated.</span>
            </div>
          )}

          {/* Profile Form / View */}
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bio & Professional Summary
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short bio or industry background..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs transition shadow-md shadow-violet-500/20 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-slate-400 font-semibold flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-violet-600" />
                    Email Address
                  </span>
                  <p className="font-bold text-slate-800">{currentUser?.email}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-slate-400 font-semibold flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-violet-600" />
                    Phone Number
                  </span>
                  <p className="font-bold text-slate-800">
                    {userProfile?.phone || 'Not specified'}
                  </p>
                </div>
              </div>

              {userProfile?.bio && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-slate-400 text-xs font-semibold">About</span>
                  <p className="text-xs text-slate-700 leading-relaxed">{userProfile.bio}</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Activity Statistics & Quick Testing Switcher */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Bookings Summary */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Ticket className="w-4 h-4 text-violet-600" />
              Event Engagement Summary
            </h3>
            <button
              onClick={() => onNavigate('my-bookings')}
              className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1"
            >
              View Passes
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-violet-50/70 border border-violet-100">
              <span className="text-2xl font-extrabold text-violet-900 block">{confirmedCount}</span>
              <span className="text-[11px] text-violet-700 font-semibold">Active Bookings</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-2xl font-extrabold text-slate-800 block">{registrations.length}</span>
              <span className="text-[11px] text-slate-500 font-semibold">Total History</span>
            </div>
          </div>
        </div>

        {/* Presentation & Testing Role Controls */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-violet-600" />
            Role & Permissions Mode
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Easily toggle between standard Attendee view and Administrator/Organizer mode for evaluation and testing.
          </p>

          <div className="pt-2">
            <button
              onClick={() => switchRoleForTesting(isAdmin ? 'user' : 'admin')}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                isAdmin
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-violet-600 text-white hover:bg-violet-700 shadow-md shadow-violet-500/20'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Switch Account Role to {isAdmin ? 'Standard Attendee' : 'Admin / Organizer'}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
