import React, { useState } from 'react';
import { LayoutGrid, PlusCircle, History } from 'lucide-react';
import { ViewState, Session, Template } from './types';
import { DashboardView } from './views/DashboardView';
import { NewSessionView } from './views/NewSessionView';
import { ActiveSessionView } from './views/ActiveSessionView';
import { SessionList } from './components/SessionList';
import { SessionDetailsView } from './views/SessionDetailsView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const handleCreateSession = () => {
    setCurrentView('new-session');
  };

  const handleSelectTemplate = (template: Template) => {
    setActiveTemplate(template);
    setCurrentView('active-session');
  };

  const handleFinishSession = (session: Session) => {
    setSessions([session, ...sessions]);
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
      case 'dashboard':
        return <DashboardView sessions={sessions} onCreateSession={handleCreateSession} />;
      case 'history':
        return <SessionList sessions={sessions} onSelectSession={handleSelectSession} />;
      case 'new-session':
        return <NewSessionView onSelectTemplate={handleSelectTemplate} onBack={() => setCurrentView('dashboard')} />;
      case 'active-session':
        if (!activeTemplate) return null;
        return <ActiveSessionView template={activeTemplate} onFinish={handleFinishSession} onCancel={handleCancelSession} />;
      case 'session-details':
        if (!selectedSession) return <DashboardView sessions={sessions} onCreateSession={handleCreateSession} />;
        return <SessionDetailsView session={selectedSession} onBack={() => setCurrentView('history')} />;
      default:
        return <DashboardView sessions={sessions} onCreateSession={handleCreateSession} />;
    }
  };

  const isTabBarVisible = ['dashboard', 'history'].includes(currentView);

  return (
    <div className="mx-auto min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      
      <div className="max-w-lg mx-auto min-h-screen bg-slate-50 shadow-2xl relative">
        {renderView()}
      </div>

      {/* Bottom Navigation */}
      {isTabBarVisible && (
        <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white/90 backdrop-blur-lg border-t border-slate-100 px-6 py-4 flex justify-around items-center z-50 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center space-y-1.5 transition-colors ${currentView === 'dashboard' ? 'text-navy-900' : 'text-slate-300 hover:text-slate-500'}`}
          >
            <LayoutGrid size={24} strokeWidth={currentView === 'dashboard' ? 2.5 : 2} />
            <span className="text-[10px] font-bold tracking-wide uppercase">Home</span>
          </button>

          <button 
            onClick={handleCreateSession}
            className="flex flex-col items-center -mt-12 group"
          >
            <div className="bg-navy-900 text-white p-4 rounded-2xl shadow-xl shadow-navy-900/30 group-hover:bg-navy-800 group-hover:scale-105 transition-all border-4 border-slate-50">
              <PlusCircle size={32} strokeWidth={1.5} />
            </div>
          </button>

          <button 
            onClick={() => setCurrentView('history')}
            className={`flex flex-col items-center space-y-1.5 transition-colors ${currentView === 'history' ? 'text-navy-900' : 'text-slate-300 hover:text-slate-500'}`}
          >
            <History size={24} strokeWidth={currentView === 'history' ? 2.5 : 2} />
            <span className="text-[10px] font-bold tracking-wide uppercase">History</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;