import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { Session } from '../types';
import { MOCK_HISTORY_DATA } from '../constants';
import { getTrainingInsights } from '../services/geminiService';
import { Button } from '../components/Button';

interface DashboardViewProps {
  sessions: Session[];
  onCreateSession: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ sessions, onCreateSession }) => {
  const [insights, setInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

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

  return (
    <div className="pb-24 space-y-8 animate-in fade-in duration-500">
      {/* Elegant Header */}
      <div className="px-6 pt-8 pb-2 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-navy-900 font-serif tracking-tight">JellyFit</h1>
          <p className="text-slate-500 font-medium mt-1">Elevate your performance.</p>
        </div>
        <div className="bg-gold-100 text-gold-700 border border-gold-200 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
          Premium
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4 px-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-slate-50 p-2 rounded-lg text-navy-700">
                <Activity size={18} />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+12%</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-serif">{sessionsThisWeek}</div>
          <div className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-1">Sessions This Week</div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-slate-50 p-2 rounded-lg text-gold-600">
                <Clock size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-serif">{Math.floor(totalMinutes / 60)}<span className="text-lg text-slate-400 font-sans font-normal">h</span> {totalMinutes % 60}<span className="text-lg text-slate-400 font-sans font-normal">m</span></div>
          <div className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-1">Total Focus Time</div>
        </div>
      </div>

      {/* Main Action */}
      <div className="px-6">
        <Button 
            onClick={onCreateSession} 
            size="lg" 
            className="w-full shadow-lg shadow-navy-900/20 bg-navy-900 border border-navy-800 flex justify-between items-center group"
        >
          <span>Start Training</span>
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
              <Sparkles size={18} className="text-gold-500" /> AI Coach Insights
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