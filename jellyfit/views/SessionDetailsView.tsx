import React from 'react';
import { ArrowLeft, Calendar, Clock, Dumbbell, Video } from 'lucide-react';
import { Session } from '../types';

interface SessionDetailsViewProps {
  session: Session;
  onBack: () => void;
}

export const SessionDetailsView: React.FC<SessionDetailsViewProps> = ({ session, onBack }) => {
  return (
    <div className="pb-24 animate-in slide-in-from-right duration-300 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 border-b border-slate-200 px-4 py-4 flex items-center shadow-sm">
        <button onClick={onBack} className="mr-4 text-slate-500 hover:text-navy-900 transition-colors">
            <ArrowLeft size={24} />
        </button>
        <h1 className="font-serif font-bold text-xl text-navy-900">Session Details</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Overview Card */}
        <div className="bg-navy-900 text-white rounded-2xl p-6 shadow-xl shadow-navy-900/20">
            <h2 className="font-serif text-2xl font-bold mb-1">{session.type}</h2>
            <p className="text-navy-200 text-sm mb-6 font-medium">Completed on {new Date(session.date).toDateString()}</p>
            
            <div className="flex divide-x divide-navy-800">
                <div className="pr-6">
                    <div className="text-navy-400 text-[10px] font-bold uppercase tracking-widest mb-1">Duration</div>
                    <div className="text-2xl font-bold font-mono flex items-baseline">
                        {session.durationMinutes} <span className="text-sm ml-1 font-sans font-normal text-navy-300">min</span>
                    </div>
                </div>
                <div className="pl-6">
                    <div className="text-navy-400 text-[10px] font-bold uppercase tracking-widest mb-1">Exercises</div>
                    <div className="text-2xl font-bold font-mono">
                        {session.exercises.length}
                    </div>
                </div>
            </div>
        </div>

        {/* Exercises List */}
        <div className="space-y-4">
            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest ml-1">Workout Log</h3>
            {session.exercises.map((ex, idx) => (
                <div key={ex.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                        <h4 className="font-bold text-slate-800 font-serif text-lg">{idx + 1}. {ex.name}</h4>
                        {ex.isTimed && <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-medium">Timed</span>}
                    </div>
                    
                    {ex.mediaUrl && (
                        <div className="w-full h-48 bg-black relative group">
                            {ex.mediaType === 'video' ? (
                                <video src={ex.mediaUrl} controls className="w-full h-full object-contain" />
                            ) : (
                                <img src={ex.mediaUrl} className="w-full h-full object-contain" />
                            )}
                            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm flex items-center">
                                <Video size={12} className="mr-1" /> Media Attached
                            </div>
                        </div>
                    )}

                    <div className="p-3">
                        <div className="grid grid-cols-3 gap-2 mb-2">
                            <div className="text-[10px] font-bold text-slate-400 uppercase text-center">Set</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase text-center">{ex.isTimed ? 'Duration' : 'Weight'}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase text-center">{ex.isTimed ? 'Rest' : 'Reps'}</div>
                        </div>
                        <div className="space-y-1">
                            {ex.sets.map((set, setIdx) => (
                                <div key={set.id} className={`grid grid-cols-3 gap-2 py-1.5 rounded text-sm ${set.completed ? 'bg-green-50 text-green-800' : 'text-slate-600'}`}>
                                    <div className="text-center font-bold">{setIdx + 1}</div>
                                    <div className="text-center font-mono">
                                        {ex.isTimed ? (set.time ? `${set.time}s` : '-') : (set.weight ? `${set.weight}kg` : '-')}
                                    </div>
                                    <div className="text-center font-mono">
                                        {ex.isTimed ? (set.reps ? `${set.reps}s` : '-') : (set.reps || '-')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};