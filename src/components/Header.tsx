import React from 'react';
import { useStore } from '../store/useStore';

export const Header: React.FC = () => {
  const { user, showToast } = useStore();

  const xpPercentage = Math.round((user.xp / user.nextLevelXp) * 100);

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface-container-low/90 backdrop-blur-xl z-40 shadow-[0_1px_8px_rgba(0,0,0,0.3)] border-b border-surface-container-high/30">
      <div className="h-16 w-full px-6 flex items-center justify-between gap-4">
        {/* Welcome Text */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="hidden xl:flex flex-col">
            <span className="font-display text-base font-bold text-on-surface truncate">
              Welcome back, {user.username}!
            </span>
            <span className="font-sans text-xs text-on-surface-variant truncate">
              Keep coding, new islands await!
            </span>
          </div>
        </div>

        {/* User Stats HUD */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Streak Flame */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high border border-amber-500/30 shadow-[inset_0_0_8px_rgba(245,158,11,0.15)]">
            <span className="material-symbols-outlined text-amber-400 text-[18px] animate-pulse">
              local_fire_department
            </span>
            <span className="font-mono text-xs font-bold text-amber-400 tracking-wider">
              {user.streakDays} DAY STREAK
            </span>
          </div>

          {/* XP Progress Bar */}
          <div className="hidden sm:flex flex-col gap-1 w-40 px-3 py-1.5 rounded-xl bg-surface-container-high border border-primary/20">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-mono text-primary font-bold">Lv. {user.level}</span>
              <span className="font-mono text-on-surface-variant">{user.xp} / {user.nextLevelXp} XP</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-container via-primary to-tertiary rounded-full transition-all duration-500"
                style={{ width: `${xpPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Adaptive Threat Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high border border-tertiary/30">
            <span className="material-symbols-outlined text-tertiary text-[18px]">
              speed
            </span>
            <span className="font-mono text-xs text-on-surface-variant">
              Diff: <span className="text-tertiary font-bold">{user.adaptiveDifficulty.toFixed(1)}/10</span>
            </span>
          </div>

          {/* Notification Button & Avatar */}
          <div className="flex items-center gap-3 pl-2">
            <button
              onClick={() => showToast('🔔 Daily Quest: Conquer 1 Island Territory to earn +100 XP!')}
              className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors border border-surface-container-highest"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <div className="relative flex items-center justify-center cursor-pointer" onClick={() => useStore.getState().setCurrentView('profile')}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-tertiary p-0.5 shadow-[0_0_10px_rgba(76,215,246,0.4)]">
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-tertiary shadow-[0_0_6px_rgba(78,222,163,0.8)] border border-surface-container"></span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
