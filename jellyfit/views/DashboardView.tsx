
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, Clock, Sparkles, ArrowRight, Calendar, CheckCircle, MessageSquare, LogOut } from 'lucide-react';
import { Session, UserProfile, WeeklyPlan, DailyPlan } from '../types';
import { MOCK_HISTORY_DATA } from '../constants';
import { getTrainingInsights } from '../services/geminiService';
import { Button } from '../components/Button';

interface DashboardViewProps {
  sessions: Session[];
  onCreateSession: () => void;
  onStartPlanSession: (day: DailyPlan) => void;
  onOpenChat: () => void;
  onEditProfile: () => void;
  onLogout: () => void;
  profile: UserProfile | null;
  weeklyPlan: WeeklyPlan | null;
  onGeneratePlan: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  sessions, onCreateSession, onStartPlanSession, onOpenChat, onEditProfile, onLogout,
  profile, weeklyPlan, onGeneratePlan 
}) => {
  const [insights, setInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState(false);

  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const sessionsThisWeek = sessions.filter(s => {
    const date = new Date(s.date);
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return date >= oneWeekAgo;
  }).length;

  const fetchInsights = async () => {
    setLoadingInsights(true);
    try {
      const text = await getTrainingInsights(sessions.slice(0, 5));
      setInsights(text);
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleGeneratePlan = async () => {
    setGeneratingPlan(true);
    await onGeneratePlan();
    setGeneratingPlan(false);
  };

  return (
    <div className="pb-24 space-y-8 animate-in fade-in duration-500">
      {/* Elegant Header */}
      <div className="px-6 pt-8 pb-2 flex justify-between items-start">
        <div onClick={onEditProfile} className="cursor-pointer">
          <h1 className="text-3xl font-bold text-navy-900 font-serif tracking-tight">
            Hello, {profile?.name.split(' ')[0] || 'Athlete'}
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            {profile?.sport ? `${profile.sport} Training` : 'Ready to train?'}
          </p>
        </div>
        <div className="flex gap-3">
            <button 
            onClick={onLogout}
            className="bg-white text-slate-400 border border-slate-200 p-2.5 rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
            title="Sign Out"
            >
            <LogOut size={20} />
            </button>
            <button 
            onClick={onOpenChat}
            className="bg-navy-50 text-navy-900 border border-navy-100 p-2.5 rounded-full shadow-sm hover:bg-navy-100 transition-all relative"
            >
            <MessageSquare size={20} />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
            </button>
        </div>
      </div>

      {/* Weekly Plan Widget */}
      {profile?.aiCoaching && (
        <div className="px-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-navy-900 flex items-center gap-2 font-serif text-lg">
              <Calendar size={18} className="text-navy-500" /> This Week
            </h3>
            {!weeklyPlan && (
               <button 
                 onClick={handleGeneratePlan}
                 disabled={generatingPlan}
                 className="text-xs font-bold text-gold-600 uppercase tracking-widest hover:text-gold-700 disabled:opacity-50"
               >
                 {generatingPlan ? 'Designing...' : 'Create Plan'}
               </button>
            )}
          </div>
          
          {weeklyPlan ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
               <div className="flex overflow-x-auto no-scrollbar p-4 gap-3">
                  {weeklyPlan.days.map((day, idx) => (
                    <div 
                      key={idx} 
                      className={`flex-shrink-0 w-32 p-3 rounded-xl border flex flex-col gap-2 relative ${day.completed ? 'bg-green-50 border-green-100' : (day.isRestDay ? 'bg-slate-50 border-slate-100 opacity-70' : 'bg-white border-slate-200')}`}
                    >
                       <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{day.day}</div>
                       <div className={`font-serif font-bold text-sm leading-tight ${day.completed ? 'text-green-800' : 'text-navy-900'}`}>
                         {day.isRestDay ? 'Rest & Recover' : day.focus}
                       </div>
                       
                       {day.completed ? (
                         <div className="mt-auto flex items-center text-xs font-bold text-green-600">
                           <CheckCircle size={14} className="mr-1" /> Done
                         </div>
                       ) : !day.isRestDay ? (
                         <button 
                           onClick={() => onStartPlanSession(day)}
                           className="mt-auto w-full bg-navy-900 text-white text-[10px] font-bold py-1.5 rounded-lg hover:bg-navy-800"
                         >
                           Start
                         </button>
                       ) : (
                         <div className="mt-auto text-[10px] text-slate-400 font-medium">Active Recovery</div>
                       )}
                    </div>
                  ))}
               </div>
            </div>
          ) : (
             <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6 text-center">
                <p className="text-slate-500 text-sm mb-3">No plan active for this week.</p>
                <Button variant="secondary" size="sm" onClick={handleGeneratePlan} disabled={generatingPlan}>
                  {generatingPlan ? 'AI is Thinking...' : 'Generate AI Plan'}
                </Button>
             </div>
          )}
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 px-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-slate-50 p-2 rounded-lg text-navy-700 group-hover:bg-navy-50 group-hover:text-navy-900 transition-colors">
                <Activity size={18} />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+12%</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-serif">{sessionsThisWeek}</div>
          <div className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-1">Sessions This Week</div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-slate-50 p-2 rounded-lg text-gold-600 group-hover:bg-gold-50 group-hover:text-gold-700 transition-colors">
                <Clock size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-serif">{Math.floor(totalMinutes / 60)}<span className="text-lg text-slate-400 font-sans font-normal">h</span> {totalMinutes % 60}<span className="text-lg text-slate-400 font-sans font-normal">m</span></div>
          <div className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-1">Total Focus Time</div>
        </div>
      </div>

      {/* Main Action (Manual Start) */}
      <div className="px-6">
        <Button 
            onClick={onCreateSession} 
            size="lg" 
            className="w-full shadow-lg shadow-navy-900/20 bg-navy-900 border border-navy-800 flex justify-between items-center group hover:bg-navy-800"
        >
          <span>Free Training Session</span>
          <span className="bg-white/20 rounded-full p-1 group-hover:bg-white/30 transition-colors">
             <ArrowRight size={16} />
          </span>
        </Button>
      </div>

      {/* AI Insights Section */}
      <div className="px-6">
        <div className="bg-gradient-to-br from-navy-50 to-white border border-navy-100 rounded-2xl p-6 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Sparkles size={120} />
          </div>
          <div className="flex justify-between items-center mb-4 relative z-10">
            <h3 className="font-bold text-navy-900 flex items-center gap-2 font-serif text-lg">
              <Sparkles size={18} className="text-gold-500" /> Coach Insights
            </h3>
            {!insights && (
              <button 
                onClick={fetchInsights} 
                disabled={loadingInsights}
                className="text-xs bg-white text-navy-800 px-4 py-1.5 rounded-full font-bold shadow-sm border border-navy-100 hover:bg-navy-50 transition-colors"
              >
                {loadingInsights ? 'Analyzing...' : 'Analyze'}
              </button>
            )}
          </div>
          
          <div className="relative z-10">
            {insights ? (
                <div className="text-sm text-navy-900/80 leading-relaxed font-medium">
                {insights.split('\n').map((line, i) => (
                    <p key={i} className="mb-2 last:mb-0">{line}</p>
                ))}
                </div>
            ) : (
                <p className="text-sm text-slate-500 italic">
                "Tap analyze to generate personalized recovery and performance strategies based on your recent training volume."
                </p>
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="px-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6 text-sm flex items-center uppercase tracking-wider">
            <TrendingUp size={16} className="mr-2 text-slate-400" /> Weekly Load
          </h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_HISTORY_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontFamily: 'Inter'}} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontFamily: 'Inter'}}
                />
                <Bar dataKey="duration" fill="#1e3a8a" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
