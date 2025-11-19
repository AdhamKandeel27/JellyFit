import React, { useState } from 'react';
import { Timer } from '../components/Timer';
import { Hourglass, Clock } from 'lucide-react';

export const ToolsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stopwatch' | 'timer'>('stopwatch');

  return (
    <div className="pb-24 animate-in fade-in duration-500">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-3xl font-bold font-serif text-jelly-900">Tools</h1>
        <p className="text-stone-500 text-sm">Precision timing for your workouts.</p>
      </div>

      {/* Tab Switcher */}
      <div className="px-6 mb-8">
        <div className="bg-stone-200/50 p-1 rounded-xl flex">
          <button 
            onClick={() => setActiveTab('stopwatch')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center ${activeTab === 'stopwatch' ? 'bg-white text-jelly-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <Clock size={16} className="mr-2" /> Stopwatch
          </button>
          <button 
             onClick={() => setActiveTab('timer')}
             className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center ${activeTab === 'timer' ? 'bg-white text-jelly-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <Hourglass size={16} className="mr-2" /> Timer
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6">
        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-6 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
             {/* Decorative background elements */}
             <div className="absolute -top-20 -right-20 w-64 h-64 bg-jelly-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
             <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gold-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

             {activeTab === 'stopwatch' ? (
                 <div className="text-center z-10 w-full">
                    <h3 className="text-stone-400 uppercase tracking-widest font-bold text-xs mb-4">Stopwatch</h3>
                    <Timer initialSeconds={0} variant="large" />
                 </div>
             ) : (
                 <div className="text-center z-10 w-full">
                    <h3 className="text-stone-400 uppercase tracking-widest font-bold text-xs mb-4">Countdown</h3>
                    {/* For MVP, we just show a fixed 60s countdown reset, could be editable later */}
                    <Timer initialSeconds={60} variant="large" />
                    <p className="text-xs text-stone-400 mt-8">Default 1 minute interval</p>
                 </div>
             )}
        </div>
      </div>
    </div>
  );
};