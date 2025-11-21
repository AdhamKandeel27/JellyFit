
import React from 'react';
import { Calendar, Clock, ChevronRight, Trophy } from 'lucide-react';
import { Session, SessionType } from '../types';

interface SessionListProps {
  sessions: Session[];
  onSelectSession: (session: Session) => void;
  title?: string;
}

export const SessionList: React.FC<SessionListProps> = ({ sessions, onSelectSession, title = "History" }) => {
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[40vh] text-slate-300">
        <Trophy size={48} className="mb-4 opacity-20" strokeWidth={1} />
        <p className="font-serif text-base text-slate-400 italic">No sessions recorded yet.</p>
        <p className="text-[10px] uppercase tracking-widest mt-1">Start your journey today</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in slide-in-from-bottom-4">
      {title && <h2 className="font-serif font-bold text-2xl text-navy-900 mb-4 px-1">{title}</h2>}
      <div className="space-y-3">
        {sessions.map((session) => (
          <button 
            key={session.id} 
            onClick={() => onSelectSession(session)}
            className="w-full bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-all hover:border-navy-200 text-left group"
          >
            <div>
              <div className="flex items-center space-x-2 mb-1.5">
                <span className={`w-2 h-2 rounded-full ${session.type === SessionType.STRENGTH ? 'bg-navy-600' : 'bg-gold-500'}`}></span>
                <h3 className="font-bold text-slate-800 font-serif group-hover:text-navy-800 transition-colors text-base">{session.type}</h3>
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-500 font-medium">
                <span className="flex items-center"><Calendar size={12} className="mr-1 text-slate-300" /> {new Date(session.date).toLocaleDateString()}</span>
                <span className="flex items-center"><Clock size={12} className="mr-1 text-slate-300" /> {session.durationMinutes} min</span>
              </div>
            </div>
            <ChevronRight className="text-slate-200 group-hover:text-navy-300" size={18} />
          </button>
        ))}
      </div>
    </div>
  );
};
