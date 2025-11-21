
import React, { useState, useEffect } from 'react';
import { LayoutGrid, PlusCircle, History, MessageSquare, User as UserIcon, Dumbbell } from 'lucide-react';
import { ViewState, Session, Template, UserProfile, WeeklyPlan, DailyPlan, User } from './types';
import { DashboardView } from './views/DashboardView';
import { NewSessionView } from './views/NewSessionView';
import { ActiveSessionView } from './views/ActiveSessionView';
import { SessionList } from './components/SessionList';
import { SessionDetailsView } from './views/SessionDetailsView';
import { ProfileWizard } from './components/ProfileWizard';
import { ChatView } from './views/ChatView';
import { AuthView } from './views/AuthView';
import { ProfileView } from './views/ProfileView';
import { TrackerView } from './views/TrackerView';
import { storageService } from './services/storageService';
import { authService } from './services/authService';
import { generateWeeklyPlan } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('auth');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  
  // Auth & AI Coaching State
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);

  // Load data on mount
  useEffect(() => {
    // 1. Check for authenticated user
    const currentUser = authService.getCurrentUser();
    
    if (currentUser) {
      setUser(currentUser);
      
      // 2. If auth exists, load app data
      const loadedProfile = storageService.getUserProfile();
      const loadedSessions = storageService.getSessions();
      const loadedPlan = storageService.getWeeklyPlan();

      setSessions(loadedSessions);
      setWeeklyPlan(loadedPlan);

      if (loadedProfile) {
        setUserProfile(loadedProfile);
        setCurrentView('dashboard');
      } else {
        // User exists but no fitness profile yet
        setCurrentView('profile-wizard');
      }
    } else {
      // No auth, go to auth screen
      setCurrentView('auth');
    }
  }, []);

  const handleAuthSuccess = (user: User) => {
    setUser(user);
    // Check if profile exists (might be a re-login)
    const loadedProfile = storageService.getUserProfile();
    if (loadedProfile) {
      setUserProfile(loadedProfile);
      setCurrentView('dashboard');
    } else {
      setCurrentView('profile-wizard');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setUserProfile(null);
    setSessions([]);
    setWeeklyPlan(null);
    setCurrentView('auth');
  };

  const handleCreateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    storageService.saveUserProfile(profile);
    setCurrentView('dashboard');
  };

  const handleUpdateProfile = () => {
    setCurrentView('profile-wizard');
  };

  const handleCreateSession = () => {
    setCurrentView('new-session');
  };

  const handleSelectTemplate = (template: Template) => {
    setActiveTemplate(template);
    setCurrentView('active-session');
  };

  const handleStartPlanSession = (day: DailyPlan) => {
    // Convert DailyPlan to Template for the runner
    const template: Template = {
      id: `plan-${Date.now()}`,
      name: day.focus,
      type: day.type,
      description: `Scheduled session for ${day.day}`,
      defaultExercises: day.exercises.map(e => e.name),
      detailedExercises: day.exercises // Pass detailed sets/reps
    };
    setActiveTemplate(template);
    setCurrentView('active-session');
  };

  const handleGenerateWeeklyPlan = async () => {
    if (userProfile) {
      const plan = await generateWeeklyPlan(userProfile);
      if (plan) {
        setWeeklyPlan(plan);
        storageService.saveWeeklyPlan(plan);
      }
    }
  };

  const handleFinishSession = (session: Session) => {
    // Save to state and storage
    const updatedSessions = storageService.saveSession(session);
    setSessions(updatedSessions);

    // If this was part of a plan, mark it complete
    if (weeklyPlan) {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      storageService.markPlanDayComplete(today);
      setWeeklyPlan(storageService.getWeeklyPlan()); // reload
    }

    setCurrentView('dashboard');
    setActiveTemplate(null);
  };

  const handleCancelSession = () => {
    setCurrentView('dashboard');
    setActiveTemplate(null);
  };

  const handleSelectSession = (session: Session) => {
    setSelectedSession(session);
    setCurrentView('session-details');
  };

  // Navigation wrapper
  const renderView = () => {
    switch (currentView) {
      case 'auth':
        return <AuthView onSuccess={handleAuthSuccess} />;
      case 'profile-wizard':
        return <ProfileWizard onComplete={handleCreateProfile} existingProfile={userProfile} />;
      case 'dashboard':
        return (
          <DashboardView 
            sessions={sessions} 
            onCreateSession={handleCreateSession} 
            onStartPlanSession={handleStartPlanSession}
            onOpenChat={() => setCurrentView('chat')}
            onEditProfile={() => setCurrentView('profile')} // Nav to profile tab
            onLogout={handleLogout}
            profile={userProfile}
            weeklyPlan={weeklyPlan}
            onGeneratePlan={handleGenerateWeeklyPlan}
          />
        );
      case 'tracker':
        return (
          <TrackerView 
            sessions={sessions} 
            onCreateSession={handleCreateSession} 
            onSelectSession={handleSelectSession} 
          />
        );
      case 'chat':
        return <ChatView onBack={() => setCurrentView('dashboard')} profile={userProfile!} />;
      case 'history':
        return <SessionList sessions={sessions} onSelectSession={handleSelectSession} className="p-6 pb-24" title="Full History" />;
      case 'profile':
        if (!user) return null;
        return (
          <ProfileView 
            user={user} 
            profile={userProfile} 
            onEditProfile={handleUpdateProfile} 
            onLogout={handleLogout} 
          />
        );
      case 'new-session':
        return (
          <NewSessionView 
            onSelectTemplate={handleSelectTemplate} 
            onBack={() => setCurrentView('dashboard')} 
            userSport={userProfile?.sport || null}
            onUpdateSport={(sport) => {
               if(userProfile) {
                 const updated = {...userProfile, sport};
                 setUserProfile(updated);
                 storageService.saveUserProfile(updated);
               }
            }}
          />
        );
      case 'active-session':
        if (!activeTemplate) return null;
        return <ActiveSessionView template={activeTemplate} onFinish={handleFinishSession} onCancel={handleCancelSession} />;
      case 'session-details':
        if (!selectedSession) return <DashboardView sessions={sessions} onCreateSession={handleCreateSession} onStartPlanSession={() => {}} onOpenChat={() => {}} onEditProfile={() => {}} onLogout={handleLogout} profile={userProfile} weeklyPlan={weeklyPlan} onGeneratePlan={() => {}} />;
        return <SessionDetailsView session={selectedSession} onBack={() => setCurrentView('history')} />;
      default:
        return null;
    }
  };

  const isTabBarVisible = ['dashboard', 'tracker', 'history', 'profile'].includes(currentView);

  return (
    <div className="mx-auto min-h-screen bg-slate-100 relative overflow-hidden font-sans flex justify-center">
      <div className="w-full max-w-lg min-h-screen bg-slate-50 shadow-2xl relative">
        {renderView()}
      
        {/* Bottom Navigation */}
        {isTabBarVisible && (
          <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white/90 backdrop-blur-lg border-t border-slate-100 px-2 py-4 flex justify-around items-center z-50 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`flex flex-col items-center space-y-1 px-2 transition-colors ${currentView === 'dashboard' ? 'text-navy-900' : 'text-slate-300 hover:text-slate-500'}`}
            >
              <LayoutGrid size={22} strokeWidth={currentView === 'dashboard' ? 2.5 : 2} />
              <span className="text-[9px] font-bold tracking-wide uppercase">Home</span>
            </button>

            <button 
              onClick={() => setCurrentView('tracker')}
              className={`flex flex-col items-center space-y-1 px-2 transition-colors ${currentView === 'tracker' ? 'text-navy-900' : 'text-slate-300 hover:text-slate-500'}`}
            >
              <Dumbbell size={22} strokeWidth={currentView === 'tracker' ? 2.5 : 2} />
              <span className="text-[9px] font-bold tracking-wide uppercase">Tracker</span>
            </button>

            <button 
              onClick={handleCreateSession}
              className="flex flex-col items-center -mt-10 group mx-1"
            >
              <div className="bg-navy-900 text-white p-3.5 rounded-2xl shadow-xl shadow-navy-900/30 group-hover:bg-navy-800 group-hover:scale-105 transition-all border-4 border-slate-50">
                <PlusCircle size={28} strokeWidth={1.5} />
              </div>
            </button>

            <button 
              onClick={() => setCurrentView('history')}
              className={`flex flex-col items-center space-y-1 px-2 transition-colors ${currentView === 'history' ? 'text-navy-900' : 'text-slate-300 hover:text-slate-500'}`}
            >
              <History size={22} strokeWidth={currentView === 'history' ? 2.5 : 2} />
              <span className="text-[9px] font-bold tracking-wide uppercase">History</span>
            </button>

            <button 
              onClick={() => setCurrentView('profile')}
              className={`flex flex-col items-center space-y-1 px-2 transition-colors ${currentView === 'profile' ? 'text-navy-900' : 'text-slate-300 hover:text-slate-500'}`}
            >
              <UserIcon size={22} strokeWidth={currentView === 'profile' ? 2.5 : 2} />
              <span className="text-[9px] font-bold tracking-wide uppercase">Profile</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
