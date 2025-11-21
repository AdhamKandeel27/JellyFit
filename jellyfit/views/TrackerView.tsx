
import React from 'react';
import { Dumbbell, Clock, Calendar, Plus, ArrowRight } from 'lucide-react';
import { Session } from '../types';
import { SessionList } from '../components/SessionList';
import { Button } from '../components/Button';

interface TrackerViewProps {
  sessions: Session[];
  onCreateSession: () => void;
  onSelectSession: (session: Session) => void;
}

export const TrackerView: React.FC<TrackerViewProps> = ({ sessions, onCreateSession, onSelectSession }) => {
  // Calculate simple stats
  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const lastSessionDate = sessions.length > 0 ? new Date(sessions[0].date).toLocaleDateString() : 'N/A';

  return (
    <div className="pb-24 min-h-screen bg-slate-50 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b border-slate-200 px-6 py-5 shadow-sm">
        <div className="flex justify-between items-center">
           <div>
             <h1 className="font-serif font-bold text-2xl text-navy-900">Tracker</h1>
             <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wide">Your Training Log</p>
           </div>
           <div className="bg-navy-50 p-2 rounded-full text-navy-900">
             <Calendar size={20} />
           </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-navy-900 text-white p-4 rounded-2xl shadow-lg shadow-navy-900/20">
              <div className="flex items-center gap-2 text-navy-300 mb-2 text-xs font-bold uppercase tracking-wider">
                 <Dumbbell size={14} /> Workouts
              </div>
              <div className="text-3xl font-mono font-bold">{totalSessions}</div>
              <div className="text-[10px] text-navy-400 mt-1">Lifetime total</div>
           </div>
           <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-slate-400 mb-2 text-xs font-bold uppercase tracking-wider">
                 <Clock size={14} /> Hours
              </div>
              <div className="text-3xl font-mono font-bold text-slate-800">
                {(totalMinutes / 60).toFixed(1)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Time trained</div>
           </div>
        </div>

        {/* Main CTA */}
        <div className="bg-white p-6 rounded-2xl border border-dashed border-slate-300 text-center space-y-4">
            <div className="w-12 h-12 bg-gold-100 text-gold-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Plus size={24} />
            </div>
            <div>
                <h3 className="font-bold text-navy-900 text-lg">Log a Session</h3>
                <p className="text-slate-500 text-sm mt-1 max-w-[200px] mx-auto">Track your exercises, sets, reps and weights manually.</p>
            </div>
            <Button onClick={onCreateSession} className="w-full" icon={<ArrowRight size={16} />}>
                Start New Log
            </Button>
        </div>

        {/* Recent List */}
        <div>
           <SessionList 
              sessions={sessions} 
              onSelectSession={onSelectSession} 
              title="Recent Logs"
           />
        </div>

      </div>
    </div>
  );
};
