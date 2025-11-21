
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Button } from './Button';
import { Activity, Target, AlertCircle, Check } from 'lucide-react';

interface ProfileWizardProps {
  onComplete: (profile: UserProfile) => void;
  existingProfile?: UserProfile | null;
}

export const ProfileWizard: React.FC<ProfileWizardProps> = ({ onComplete, existingProfile }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>(existingProfile || {
    name: '',
    age: 25,
    sport: '',
    experienceLevel: 'Intermediate',
    goals: '',
    injuries: '',
    frequency: 3,
    aiCoaching: true
  });

  const handleChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="min-h-screen bg-navy-50 flex items-center justify-center p-6 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-navy-900 p-6 text-white">
          <h2 className="font-serif font-bold text-2xl">Athlete Profile</h2>
          <p className="text-navy-200 text-sm mt-1">Step {step} of 3</p>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Name</label>
                <input 
                  value={profile.name} 
                  onChange={(e) => handleChange('name', e.target.value)} 
                  className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-navy-500 outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Main Sport</label>
                <input 
                  value={profile.sport} 
                  onChange={(e) => handleChange('sport', e.target.value)} 
                  className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-navy-500 outline-none"
                  placeholder="e.g. Padel, Tennis, Running"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Age</label>
                    <input 
                      type="number"
                      value={profile.age} 
                      onChange={(e) => handleChange('age', parseInt(e.target.value))} 
                      className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-navy-500 outline-none"
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Experience</label>
                    <select 
                      value={profile.experienceLevel} 
                      onChange={(e) => handleChange('experienceLevel', e.target.value)} 
                      className="w-full border border-slate-200 rounded-lg p-3 bg-white focus:ring-2 focus:ring-navy-500 outline-none"
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                 </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={nextStep} disabled={!profile.name || !profile.sport}>Next</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Training Goals</label>
                <textarea 
                  value={profile.goals} 
                  onChange={(e) => handleChange('goals', e.target.value)} 
                  className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-navy-500 outline-none h-24 resize-none"
                  placeholder="e.g. Increase smash power, improve stamina, knee stability..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Injuries / Constraints</label>
                <textarea 
                  value={profile.injuries} 
                  onChange={(e) => handleChange('injuries', e.target.value)} 
                  className="w-full border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-navy-500 outline-none h-20 resize-none"
                  placeholder="e.g. Lower back pain, weak right ankle..."
                />
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="secondary" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep}>Next</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Sessions Per Week</label>
                <div className="flex justify-between gap-2">
                  {[1, 2, 3, 4, 5, 6, 7].map(num => (
                    <button
                      key={num}
                      onClick={() => handleChange('frequency', num)}
                      className={`flex-1 py-3 rounded-lg font-bold transition-all ${profile.frequency === num ? 'bg-navy-900 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 flex items-start gap-3">
                <Activity className="text-gold-600 shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-bold text-gold-800 text-sm">AI Coaching Enabled</h4>
                  <p className="text-xs text-gold-700 mt-1 leading-relaxed">
                    JellyCoach will generate a 7-day plan specifically for your {profile.sport} goals.
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="secondary" onClick={prevStep}>Back</Button>
                <Button onClick={() => onComplete(profile)} variant="gold" icon={<Check size={18} />}>Create Profile</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
