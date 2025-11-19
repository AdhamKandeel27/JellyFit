import React, { useState, useEffect, useRef } from 'react';
import { Plus, Check, X, Camera, Video, Timer as TimerIcon, Trash2, Save, MoreHorizontal, ArrowLeft } from 'lucide-react';
import { Session, ExerciseData, SetData, Template, SessionType } from '../types';
import { Button } from '../components/Button';
import { v4 as uuidv4 } from 'uuid';

const generateId = () => Math.random().toString(36).substr(2, 9);

interface ActiveSessionViewProps {
  template: Template;
  onFinish: (session: Session) => void;
  onCancel: () => void;
}

export const ActiveSessionView: React.FC<ActiveSessionViewProps> = ({ template, onFinish, onCancel }) => {
  const [sessionStart] = useState(new Date());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [exercises, setExercises] = useState<ExerciseData[]>([]);
  
  // State for adding new exercise
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const newExerciseInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize from template
  useEffect(() => {
    const initialExercises: ExerciseData[] = template.defaultExercises.map(name => ({
      id: generateId(),
      name,
      sets: [createSet()],
      mediaType: undefined,
      isTimed: false
    }));
    setExercises(initialExercises);
  }, [template]);

  useEffect(() => {
    if (isAddingExercise && newExerciseInputRef.current) {
      newExerciseInputRef.current.focus();
    }
  }, [isAddingExercise]);

  // Session Timer
  useEffect(() => {
    const interval = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const createSet = (): SetData => ({
    id: generateId(),
    reps: 10,
    weight: null,
    time: null,
    completed: false
  });

  const handleAddExercise = () => {
    if (newExerciseName.trim()) {
      setExercises([...exercises, {
        id: generateId(),
        name: newExerciseName.trim(),
        sets: [createSet()],
        isTimed: false
      }]);
      setNewExerciseName('');
      setIsAddingExercise(false);
    }
  };

  const addSet = (exerciseId: string) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        const lastSet = ex.sets[ex.sets.length - 1];
        const newSet = createSet();
        if (lastSet) {
            newSet.reps = lastSet.reps;
            newSet.weight = lastSet.weight;
            newSet.time = lastSet.time;
        }
        return { ...ex, sets: [...ex.sets, newSet] };
      }
      return ex;
    }));
  };

  const updateSet = (exerciseId: string, setId: string, field: keyof SetData, value: any) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(s => s.id === setId ? { ...s, [field]: value } : s)
        };
      }
      return ex;
    }));
  };

  const toggleSetComplete = (exerciseId: string, setId: string) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(s => s.id === setId ? { ...s, completed: !s.completed } : s)
        };
      }
      return ex;
    }));
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId) {
        return { ...ex, sets: ex.sets.filter(s => s.id !== setId) };
      }
      return ex;
    }));
  };

  const removeExercise = (exerciseId: string) => {
     if(window.confirm("Remove this exercise?")) {
         setExercises(exercises.filter(ex => ex.id !== exerciseId));
     }
  };

  const toggleTimedExercise = (exerciseId: string) => {
      setExercises(exercises.map(ex => {
          if(ex.id === exerciseId) return { ...ex, isTimed: !ex.isTimed };
          return ex;
      }));
  }

  const handleMediaUpload = (exerciseId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith('video') ? 'video' : 'image';
      setExercises(exercises.map(ex => ex.id === exerciseId ? { ...ex, mediaUrl: url, mediaType: type } : ex));
    }
  };

  const handleFinish = () => {
    const session: Session = {
      id: generateId(),
      date: sessionStart.toISOString(),
      type: template.type,
      durationMinutes: Math.ceil(elapsedSeconds / 60),
      exercises,
      isCircuit: template.type === SessionType.CIRCUIT
    };
    onFinish(session);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-32 flex flex-col">
      {/* Elegant Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100 px-4 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
            <button onClick={onCancel} className="mr-3 text-slate-400 hover:text-slate-600"><ArrowLeft size={20} /></button>
            <div>
                <h2 className="font-serif font-bold text-navy-900 text-lg leading-none">{template.name}</h2>
                <div className="flex items-center text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-2"></span>
                    {formatTime(elapsedSeconds)}
                </div>
            </div>
        </div>
        <Button onClick={handleFinish} size="sm" variant="gold">Finish</Button>
      </div>

      <div className="p-4 space-y-8 flex-1">
        {exercises.length === 0 && !isAddingExercise && (
            <div className="text-center py-12 text-slate-400">
                <p className="font-serif text-xl mb-2 italic">Empty Session</p>
                <p className="text-sm">Add an exercise to get started.</p>
            </div>
        )}

        {exercises.map((ex, index) => (
          <div key={ex.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Exercise Header */}
            <div className="bg-slate-50/50 p-4 border-b border-slate-100 flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-serif font-bold text-slate-800 text-xl">{ex.name}</h3>
                <div className="flex gap-3 mt-2">
                   <button 
                    onClick={() => toggleTimedExercise(ex.id)}
                    className={`p-1.5 rounded transition-colors flex items-center text-xs font-medium ${ex.isTimed ? 'bg-navy-50 text-navy-700' : 'text-slate-400 hover:bg-slate-100'}`}
                   >
                       <TimerIcon size={14} className="mr-1" /> {ex.isTimed ? 'Timed' : 'Reps'}
                   </button>
                   <label className="p-1.5 rounded text-slate-400 hover:bg-slate-100 cursor-pointer hover:text-slate-600 transition-colors flex items-center text-xs font-medium">
                        <input type="file" className="hidden" accept="image/*,video/*" onChange={(e) => handleMediaUpload(ex.id, e)} />
                        {ex.mediaType === 'video' ? <Video size={14} className="mr-1 text-navy-600" /> : <Camera size={14} className={`mr-1 ${ex.mediaUrl ? "text-navy-600" : ""}`} />}
                        {ex.mediaUrl ? 'Media Added' : 'Add Media'}
                   </label>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Ex {index + 1}</span>
                  <button onClick={() => removeExercise(ex.id)} className="text-slate-300 hover:text-red-400 transition-colors"><X size={16} /></button>
              </div>
            </div>

            {/* Media Preview */}
            {ex.mediaUrl && (
              <div className="w-full h-56 bg-black flex justify-center items-center relative">
                 <button 
                    className="absolute top-3 right-3 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-1.5 rounded-full z-10 transition-all"
                    onClick={() => setExercises(exercises.map(e => e.id === ex.id ? {...e, mediaUrl: undefined} : e))}
                 >
                     <X size={14} />
                 </button>
                 {ex.mediaType === 'video' ? (
                     <video src={ex.mediaUrl} controls className="h-full" />
                 ) : (
                     <img src={ex.mediaUrl} alt="Form check" className="h-full object-contain" />
                 )}
              </div>
            )}

            {/* Sets Table Header */}
            <div className="p-3">
              <div className="grid grid-cols-10 gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-2 text-center">
                <div className="col-span-1">#</div>
                <div className="col-span-3">{ex.isTimed ? 'Time (s)' : 'Kg'}</div>
                <div className="col-span-3">{ex.isTimed ? 'Rest' : 'Reps'}</div>
                <div className="col-span-3">Complete</div>
              </div>

              <div className="space-y-2">
                {ex.sets.map((set, i) => (
                  <div key={set.id} className={`grid grid-cols-10 gap-2 items-center p-2 rounded-lg transition-all duration-300 ${set.completed ? 'bg-green-50/50 border border-green-100' : 'bg-slate-50 border border-transparent'}`}>
                    <div className="col-span-1 text-center font-serif font-bold text-slate-500">{i + 1}</div>
                    
                    {/* Input 1: Weight or Duration */}
                    <div className="col-span-3">
                        {ex.isTimed ? (
                             <input 
                             type="number" 
                             className="w-full text-center bg-white border border-slate-200 rounded shadow-sm py-2 text-slate-900 font-medium focus:ring-1 focus:ring-navy-500 focus:border-navy-500 outline-none transition-all"
                             value={set.time || ''}
                             onChange={(e) => updateSet(ex.id, set.id, 'time', Number(e.target.value))}
                           />
                        ) : (
                            <input 
                            type="number" 
                            className="w-full text-center bg-white border border-slate-200 rounded shadow-sm py-2 text-slate-900 font-medium focus:ring-1 focus:ring-navy-500 focus:border-navy-500 outline-none transition-all"
                            value={set.weight || ''}
                            onChange={(e) => updateSet(ex.id, set.id, 'weight', Number(e.target.value))}
                          />
                        )}
                    </div>

                    {/* Input 2: Reps or Rest */}
                    <div className="col-span-3">
                      <input 
                        type="number" 
                        className="w-full text-center bg-white border border-slate-200 rounded shadow-sm py-2 text-slate-900 font-medium focus:ring-1 focus:ring-navy-500 focus:border-navy-500 outline-none transition-all"
                        value={set.reps || ''}
                        onChange={(e) => updateSet(ex.id, set.id, 'reps', Number(e.target.value))}
                      />
                    </div>

                    {/* Action */}
                    <div className="col-span-3 flex justify-center gap-2">
                      <button 
                        onClick={() => toggleSetComplete(ex.id, set.id)}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${set.completed ? 'bg-green-500 text-white shadow-md shadow-green-200' : 'bg-slate-200 text-slate-400 hover:bg-slate-300'}`}
                      >
                        <Check size={16} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                 <button 
                    onClick={() => addSet(ex.id)}
                    className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wide text-navy-800 bg-navy-50 hover:bg-navy-100 rounded-lg transition-colors border border-navy-100 flex items-center justify-center"
                >
                    <Plus size={14} className="mr-1" /> Add Set
                </button>
                {ex.sets.length > 0 && (
                    <button 
                        onClick={() => removeSet(ex.id, ex.sets[ex.sets.length - 1].id)}
                        className="px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-red-500 bg-transparent rounded-lg transition-colors flex items-center justify-center"
                    >
                        <Trash2 size={14} />
                    </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Add Exercise Input Section */}
        {isAddingExercise ? (
           <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200 animate-in slide-in-from-bottom-2 fade-in duration-300">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">New Exercise Name</label>
              <div className="flex gap-2">
                  <input 
                    ref={newExerciseInputRef}
                    type="text" 
                    value={newExerciseName}
                    onChange={(e) => setNewExerciseName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddExercise()}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:ring-2 focus:ring-navy-500 outline-none"
                    placeholder="e.g. Bulgarian Split Squat"
                  />
                  <button 
                    onClick={handleAddExercise}
                    className="bg-navy-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-navy-800"
                  >
                    Add
                  </button>
                  <button 
                    onClick={() => setIsAddingExercise(false)}
                    className="bg-slate-200 text-slate-600 px-3 py-2 rounded-lg hover:bg-slate-300"
                  >
                    <X size={20} />
                  </button>
              </div>
           </div>
        ) : (
            <button 
            onClick={() => setIsAddingExercise(true)}
            className="w-full py-5 border border-dashed border-slate-300 rounded-xl text-slate-400 font-medium hover:bg-white hover:border-navy-400 hover:text-navy-700 transition-all flex items-center justify-center bg-slate-50/50"
            >
            <Plus size={20} className="mr-2" /> Add Exercise
            </button>
        )}
        
      </div>
    </div>
  );
};