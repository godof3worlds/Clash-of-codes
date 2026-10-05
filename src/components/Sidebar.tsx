import React from 'react';
import { useStore } from '../store/useStore';
import { ViewMode } from '../types';

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView } = useStore();

  const navItems: { id: ViewMode; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
    { id: 'island-world', label: 'Island World', icon: 'explore' },
    { id: 'island-clash', label: 'Island Clash', icon: 'swords' },
    { id: 'practice-lab', label: 'Practice Lab', icon: 'terminal' },
    { id: 'ai-mentor', label: 'AI Mentor & Courses', icon: 'psychology' },
    { id: 'leaderboard', label: 'Leaderboard', icon: 'leaderboard' },
    { id: 'profile', label: 'Badges & Profile', icon: 'military_tech' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low/95 backdrop-blur-xl z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.5)] border-r border-surface-container-high/40">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="px-5 pt-5 pb-4 flex items-center gap-3 border-b border-surface-container-high/30">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-container via-primary to-secondary p-0.5 shadow-[0_0_15px_rgba(76,215,246,0.3)]">
            <div className="w-full h-full bg-surface-container-lowest rounded-[10px] flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[22px]">code</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg tracking-tight text-primary leading-tight">CodeConquer</span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-secondary">Learn • Code • Conquer</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-4 space-y-1.5 flex-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-surface-container-high text-primary font-bold shadow-[inset_0_0_0_1px_rgba(76,215,246,0.3)] shadow-[0_4px_12px_rgba(0,0,0,0.3)]'
                    : 'text-on-surface-variant hover:bg-surface-container-high/50 hover:text-on-surface'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {item.icon}
                </span>
                <span className="font-sans text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Quest Radar Widget */}
      <div className="p-3">
        <div className="bg-surface-container rounded-xl p-3.5 relative overflow-hidden shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] border border-secondary/20">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-[18px]">smart_toy</span>
            </div>
            <span className="font-mono text-[11px] text-secondary font-bold uppercase tracking-wider">Quest Radar</span>
          </div>
          <p className="font-sans text-xs text-on-surface font-medium leading-snug">Small steps, Big conquests!</p>
          <p className="font-mono text-[11px] text-on-surface-variant mt-1">Daily streak active. Next island awaits!</p>
        </div>
      </div>
    </aside>
  );
};
