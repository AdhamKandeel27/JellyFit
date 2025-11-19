
import React, { useState, useEffect } from 'react';
import { ChevronRight, Zap, Dumbbell, Activity, Box, PlayCircle, Plus, Search, Loader2, Edit3 } from 'lucide-react';
import { Template, SessionType } from '../types';
import { generateSportRoutines } from '../services/geminiService';
import { Button } from '../components/Button';

interface NewSessionViewProps {
  onSelectTemplate: (template: Template) => void;
  onBack: () => void;
  userSport: string | null;
  onUpdateSport: (sport: string) => void;
}

const COMMON_SPORTS = ['Padel', 'Tennis', 'Pickleball', 'CrossFit', 'Running', 'Basketball', 'Football', 'Golf', 'Boxing'];

export const NewSessionView: React.FC<NewSessionViewProps> = ({ onSelectTemplate, onBack, userSport, onUpdateSport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isSelectingSport, setIsSelectingSport] = useState(!userSport);

  useEffect(() => {
    if (userSport && !isSelectingSport) {
      loadTemplatesForSport(userSport);
    }
  }, [userSport, isSelectingSport]);

  const loadTemplatesForSport = async (sport: string) => {
    setLoading(true);
    try {
      const generated = await generateSportRoutines(sport);
      setTemplates(generated);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSport = (sport: string) => {
    onUpdateSport(sport);
    setIsSelectingSport(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      handleSelectSport(searchTerm.trim());
    }
  };

  const getIcon = (type: SessionType) => {
    switch (type) {
      case SessionType.STRENGTH: return <Dumbbell className="text-navy-600" />;
      case SessionType.MOBILITY: return <Activity className="text-emerald-500" />;
      case SessionType.PERFORMANCE: return <Zap className="text-gold-500" />;
      case SessionType.CIRCUIT: return <Box className="text-indigo-500" />;
      default: return <PlayCircle className="text-slate-400" />;
    }
  };

  if (isSelectingSport) {
    return (
      <div className="min-h-screen bg-slate-50 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
         <div className="sticky top-0 bg-slate-50/95 backdrop-blur-sm z-10 p-6 flex items-center justify-between">
            <h2 className="font-serif font-bold text-2xl text-navy-900">Choose Sport</h2>
            <button onClick={onBack} className="text-sm font-medium text-slate-400 hover:text-slate-800 uppercase tracking-wide">Cancel</button>
         </div>

         <div className="px-6">
            <form onSubmit={handleSearchSubmit} className="relative mb-8">
                <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search or type any sport..."
                  className="w-full bg-white border border-slate-200 pl-12 pr-4 py-3.5 rounded-xl shadow-sm text-slate-800 font-medium focus:ring-2 focus:ring-navy-500 focus:border-navy-500 outline-none transition-all"
                  autoFocus
                />
            </form>

            <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Popular Sports</h3>
                {COMMON_SPORTS.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase())).map(sport => (
                    <button 
                      key={sport}
                      onClick={() => handleSelectSport(sport)}
                      className="w-full bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-navy-200 hover:shadow-md transition-all group"
                    >
                        <span className="font-serif font-bold text-slate-700 group-hover:text-navy-900 text-lg">{sport}</span>
                        <ChevronRight size={18} className="text-slate-300 group-hover:text-navy-400" />
                    </button>
                ))}
                {searchTerm && !COMMON_SPORTS.some(s => s.toLowerCase() === searchTerm.toLowerCase()) && (
                   <button 
                   onClick={() => handleSelectSport(searchTerm)}
                   className="w-full bg-navy-50 p-4 rounded-xl border border-navy-100 shadow-sm flex items-center justify-between text-navy-900 transition-all"
                 >
                     <span className="font-serif font-bold text-lg">Select "{searchTerm}"</span>
                     <ChevronRight size={18} />
                 </button>
                )}
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="pb-24 animate-in slide-in-from-right-4 duration-500 bg-slate-50 min-h-screen">
      <div className="sticky top-0 bg-slate-50/95 backdrop-blur-sm z-10 p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
             <h2 className="font-serif font-bold text-2xl text-navy-900">Routines</h2>
             <button onClick={() => setIsSelectingSport(true)} className="flex items-center text-xs font-bold text-gold-600 uppercase tracking-wider mt-1 hover:text-gold-700">
                {userSport} <Edit3 size={12} className="ml-1" />
             </button>
          </div>
          <button onClick={onBack} className="text-sm font-medium text-slate-400 hover:text-slate-800 uppercase tracking-wide">Back</button>
      </div>

      <div className="px-6 py-6">
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 size={40} className="animate-spin text-navy-900" />
                <p className="text-slate-500 font-medium animate-pulse">Coach AI is designing your program...</p>
            </div>
        ) : (
            <div className="space-y-4">
            {templates.map((template) => (
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
        )}

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
