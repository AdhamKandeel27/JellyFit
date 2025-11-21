
import React from 'react';
import { User, UserProfile } from '../types';
import { Button } from '../components/Button';
import { LogOut, Edit3, Shield, Activity, Mail, Trophy } from 'lucide-react';

interface ProfileViewProps {
  user: User;
  profile: UserProfile | null;
  onEditProfile: () => void;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, profile, onEditProfile, onLogout }) => {
  return (
    <div className="pb-24 animate-in slide-in-from-right duration-300 bg-slate-50 min-h-screen">
      {/* Header with background */}
      <div className="bg-navy-900 text-white px-6 pt-12 pb-24 relative rounded-b-[2.5rem] shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full p-1 shadow-md">
             {user.avatarUrl ? (
                 <img src={user.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
             ) : (
                 <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-navy-900 font-bold text-2xl">
                    {user.name.charAt(0)}
                 </div>
             )}
          </div>
          <div>
            <h1 className="font-serif font-bold text-2xl">{user.name}</h1>
            <div className="flex items-center text-navy-200 text-sm mt-1">
               <Mail size={12} className="mr-1.5" /> {user.email}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="px-6 -mt-16 relative z-10">
        
        {/* Fitness Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
           <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-navy-900 flex items-center gap-2 font-serif text-lg">
                 <Trophy size={18} className="text-gold-500" /> Athlete Profile
              </h3>
              <button onClick={onEditProfile} className="text-slate-400 hover:text-navy-600 transition-colors">
                 <Edit3 size={18} />
              </button>
           </div>

           {profile ? (
             <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-xl">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sport</div>
                        <div className="font-bold text-navy-900">{profile.sport}</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Level</div>
                        <div className="font-bold text-navy-900">{profile.experienceLevel}</div>
                    </div>
                </div>
                
                <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Goal</div>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">{profile.goals}</p>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-green-700 bg-green-50 p-2 rounded-lg">
                   <Activity size={14} />
                   <span>Training Frequency: {profile.frequency} days/week</span>
                </div>
             </div>
           ) : (
             <div className="text-center py-6">
                <p className="text-slate-400 text-sm mb-3">No fitness profile set.</p>
                <Button size="sm" onClick={onEditProfile}>Create Profile</Button>
             </div>
           )}
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <button className="w-full p-4 flex items-center justify-between border-b border-slate-50 hover:bg-slate-50 transition-colors text-left">
                <div className="flex items-center gap-3 text-slate-700 font-medium">
                    <Shield size={18} className="text-slate-400" /> Privacy & Security
                </div>
            </button>
            <button 
                onClick={onLogout}
                className="w-full p-4 flex items-center justify-between hover:bg-red-50 transition-colors text-left group"
            >
                <div className="flex items-center gap-3 text-red-600 font-medium">
                    <LogOut size={18} /> Sign Out
                </div>
            </button>
        </div>

        <div className="text-center mt-8">
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">JellyFit Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};
