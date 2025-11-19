import React from 'react';
import { ChevronRight, Zap, Dumbbell, Activity, Box, PlayCircle, Plus } from 'lucide-react';
import { PADEL_TEMPLATES } from '../constants';
import { Template, SessionType } from '../types';

interface NewSessionViewProps {
  onSelectTemplate: (template: Template) => void;
  onBack: () => void;
}

export const NewSessionView: React.FC<NewSessionViewProps> = ({ onSelectTemplate, onBack }) => {
  
  const getIcon = (type: SessionType) => {
    switch (type) {
      case SessionType.STRENGTH: return <Dumbbell className="text-navy-600" />;
      case SessionType.MOBILITY: return <Activity className="text-emerald-500" />;
      case SessionType.PERFORMANCE: return <Zap className="text-gold-500" />;
      case SessionType.CIRCUIT: return <Box className="text-indigo-500" />;
      default: return <PlayCircle className="text-slate-400" />;
    }
  };

  return (
    <div className="pb-24 animate-in slide-in-from-bottom-4 duration-500">
      <div className="sticky top-0 bg-slate-50/95 backdrop-blur-sm z-10 p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-serif font-bold text-2xl text-navy-900">Select Routine</h2>
          <button onClick={onBack} className="text-sm font-medium text-slate-400 hover:text-slate-800 uppercase tracking-wide">Cancel</button>
      </div>

      <div className="px-6 py-6">
        <div className="space-y-4">
          {PADEL_TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className="w-full bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center text-left transition-all hover:border-navy-200 hover:shadow-lg group active:scale-[0.98]"
            >
              <div className="bg-slate-50 p-3 rounded-full mr-5 group-hover:bg-navy-50 transition-colors">
                {getIcon(template.type)}
              </div>
              <div className="flex-1">
                <h3 className="font-serif font-bold text-slate-900 text-lg group-hover:text-navy-800 transition-colors">{template.name}</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium line-clamp-2 leading-relaxed">{template.description}</p>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-navy-400 transition-colors" size={20} />
            </button>
          ))}
        </div>

        <div className="mt-10">
           <div className="flex items-center mb-4">
             <div className="h-px bg-slate-200 flex-1"></div>
             <span className="px-3 text-xs text-slate-400 font-bold uppercase tracking-widest">Or Custom</span>
             <div className="h-px bg-slate-200 flex-1"></div>
           </div>

           <button
              onClick={() => onSelectTemplate({
                  id: 'custom',
                  name: 'Custom Session',
                  type: SessionType.CUSTOM,
                  description: 'Build your own workout from scratch.',
                  defaultExercises: []
              })}
              className="w-full bg-gradient-to-r from-slate-100 to-slate-50 p-6 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 hover:border-navy-400 hover:text-navy-800 transition-all group"
            >
              <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <Plus className="text-slate-400 group-hover:text-navy-600" size={24} />
              </div>
              <span className="font-serif font-bold">Create Empty Session</span>
            </button>
        </div>
      </div>
    </div>
  );
};