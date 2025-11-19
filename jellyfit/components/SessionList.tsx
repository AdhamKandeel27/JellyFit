import React from 'react';
import { Calendar, Clock, ChevronRight, Trophy } from 'lucide-react';
import { Session, SessionType } from '../types';

interface SessionListProps {
  sessions: Session[];
  onSelectSession: (session: Session) => void;
}

export const SessionList: React.FC<SessionListProps> = ({ sessions, onSelectSession }) => {
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-300">
        <Trophy size={64} className="mb-6 opacity-20" strokeWidth={1} />
        <p className="font-serif text-lg text-slate-400 italic">No sessions recorded yet.</p>
        <p className="text-xs uppercase tracking-widest mt-2">Start your journey today</p>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 space-y-4 animate-in slide-in-from-bottom-4">
      <h2 className="font-serif font-bold text-3xl text-navy-900 mb-6">History</h2>
      {sessions.map((session) => (
        <button 
          key={session.id} 
          onClick={() => onSelectSession(session)}
          className="w-full bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-all hover:border-navy-200 text-left group"
        >
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className={`w-2 h-2 rounded-full ${session.type === SessionType.STRENGTH ? 'bg-navy-600' : 'bg-gold-500'}`}></span>
              <h3 className="font-bold text-slate-800 font-serif group-hover:text-navy-800 transition-colors">{session.type}</h3>
            </div>
            <div className="flex items-center space-x-4 text-xs text-slate-500 font-medium">
              <span className="flex items-center"><Calendar size={12} className="mr-1.5 text-slate-300" /> {new Date(session.date).toLocaleDateString()}</span>
              <span className="flex items-center"><Clock size={12} className="mr-1.5 text-slate-300" /> {session.durationMinutes} min</span>
            </div>
          </div>
          <ChevronRight className="text-slate-200 group-hover:text-navy-300" />
        </button>
      ))}
    </div>
  );
};