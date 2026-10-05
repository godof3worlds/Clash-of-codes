import React, { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { Dashboard } from './pages/Dashboard';
import { IslandWorld } from './pages/IslandWorld';
import { IslandClash } from './pages/IslandClash';
import { PracticeLab } from './pages/PracticeLab';
import { AIMentor } from './pages/AIMentor';
import { Leaderboard } from './pages/Leaderboard';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { useStore } from './store/useStore';

const App: React.FC = () => {
  const { currentView, toastMessage, clearToast, syncWithDatabase } = useStore();

  useEffect(() => {
    syncWithDatabase();
  }, [syncWithDatabase]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(clearToast, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, clearToast]);

  const renderPage = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'island-world': return <IslandWorld />;
      case 'island-clash': return <IslandClash />;
      case 'practice-lab': return <PracticeLab />;
      case 'ai-mentor': return <AIMentor />;
      case 'courses': return <AIMentor />;
      case 'leaderboard': return <Leaderboard />;
      case 'profile': return <Profile />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <main className="pl-64 pt-16 min-h-screen">
        <div className="p-6 animate-fade-in">
          {renderPage()}
        </div>
      </main>
      {toastMessage && <Toast message={toastMessage} onClose={clearToast} />}
    </div>
  );
};

export default App;
