import React from 'react';
import { useStore } from '../store/useStore';

export const Profile: React.FC = () => {
  const { user, badges, islands } = useStore();

  const totalCaptured = islands.reduce((sum, isl) => sum + isl.capturedTerritories, 0);

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-on-surface">Profile & Badges</h1>
        <p className="font-sans text-sm text-on-surface-variant mt-1">Your achievements, stats, and badge collection.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-surface-container rounded-xl p-6 shadow-xl border border-primary/20 text-center">
          <div className="relative mx-auto w-24 h-24 mb-4">
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-primary via-secondary to-tertiary p-0.5 shadow-[0_0_24px_rgba(76,215,246,0.3)]">
              <img src={user.avatarUrl} alt={user.username} className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="absolute -bottom-1 right-1 px-2 py-0.5 rounded-full bg-surface-container-high border border-primary/30">
              <span className="font-mono text-[10px] text-primary font-bold">Lv. {user.level}</span>
            </div>
          </div>
          <h2 className="font-display text-xl font-bold text-on-surface">{user.username}</h2>
          <p className="font-sans text-xs text-on-surface-variant mt-1">Recruit Voyager • Begin your conquests!</p>

          {/* XP Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-[11px] font-mono mb-1">
              <span className="text-primary">XP {user.xp}</span>
              <span className="text-on-surface-variant">{user.nextLevelXp}</span>
            </div>
            <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-tertiary rounded-full" style={{ width: `${user.nextLevelXp > 0 ? (user.xp / user.nextLevelXp) * 100 : 0}%` }} />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="bg-surface-container-lowest rounded-lg p-3">
              <span className="font-display text-lg font-bold text-on-surface block">{user.problemsSolved.total}</span>
              <span className="font-mono text-[10px] text-on-surface-variant">Problems</span>
            </div>
            <div className="bg-surface-container-lowest rounded-lg p-3">
              <span className="font-display text-lg font-bold text-on-surface block">{user.streakDays}</span>
              <span className="font-mono text-[10px] text-on-surface-variant">Streak</span>
            </div>
            <div className="bg-surface-container-lowest rounded-lg p-3">
              <span className="font-display text-lg font-bold text-on-surface block">{totalCaptured}</span>
              <span className="font-mono text-[10px] text-on-surface-variant">Territories</span>
            </div>
          </div>
        </div>

        {/* Badges Collection */}
        <div className="lg:col-span-2 bg-surface-container rounded-xl p-6 shadow-xl border border-surface-container-high/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-bold text-on-surface">Badges ({badges.length})</h3>
            <div className="flex gap-1">
              {['all', 'learning', 'conquest', 'streak', 'special'].map((cat) => (
                <span key={cat} className="px-2 py-0.5 rounded-full bg-surface-container-high font-mono text-[10px] text-on-surface-variant capitalize">{cat}</span>
              ))}
            </div>
          </div>
          {badges.length === 0 ? (
            <div className="p-12 text-center bg-surface-container-lowest rounded-xl border border-dashed border-surface-container-highest">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">military_tech</span>
              <h4 className="font-display text-sm font-bold text-on-surface">No Badges Earned Yet</h4>
              <p className="font-sans text-xs text-on-surface-variant mt-1">Conquer territories, solve katas, and maintain streaks to unlock badges!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {badges.map((badge) => (
                <div key={badge.id} className={`p-4 rounded-xl border text-center transition-all hover:scale-[1.02] ${
                  badge.isCustom ? 'bg-secondary/10 border-secondary/30 glow-secondary' : 'bg-surface-container-lowest border-surface-container-high/30'
                }`}>
                  <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-2 ${
                    badge.isCustom ? 'bg-secondary-container' : 'bg-surface-container-high'
                  }`}>
                    <span className={`material-symbols-outlined text-[28px] ${
                      badge.category === 'learning' ? 'text-primary' :
                      badge.category === 'conquest' ? 'text-tertiary' :
                      badge.category === 'streak' ? 'text-amber-400' :
                      'text-secondary'
                    }`}>{badge.icon}</span>
                  </div>
                  <h4 className="font-display text-xs font-bold text-on-surface mb-0.5">{badge.name}</h4>
                  <p className="font-sans text-[10px] text-on-surface-variant leading-tight">{badge.description}</p>
                  {badge.earnedAt && (
                    <span className="font-mono text-[9px] text-on-surface-variant/60 mt-1 block">{badge.earnedAt}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Learning Goals & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container rounded-xl p-5 shadow-xl border border-surface-container-high/50">
          <h3 className="font-display text-sm font-bold text-on-surface mb-3">Beginner Objectives</h3>
          <div className="space-y-3">
            {[
              { text: 'Conquer your first territory on Python Shores', done: false },
              { text: 'Solve 1 coding puzzle in the Practice Lab', done: false },
              { text: 'Complete a 3-day coding streak', done: false },
              { text: 'Join an Island Clash multiplayer room', done: false },
            ].map((goal, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className={`material-symbols-outlined text-[18px] ${goal.done ? 'text-tertiary' : 'text-on-surface-variant/40'}`}>
                  {goal.done ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span className={`font-sans text-sm ${goal.done ? 'text-on-surface line-through opacity-60' : 'text-on-surface'}`}>{goal.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-container rounded-xl p-5 shadow-xl border border-surface-container-high/50">
          <h3 className="font-display text-sm font-bold text-on-surface mb-3">Activity Status</h3>
          <div className="p-6 text-center bg-surface-container-lowest rounded-xl">
            <span className="material-symbols-outlined text-3xl text-primary/60 mb-2">history_edu</span>
            <p className="font-sans text-xs text-on-surface font-medium">Account Initialized (Zero Base)</p>
            <p className="font-sans text-[11px] text-on-surface-variant mt-0.5">Your journey starts now. Take on challenges to populate your log.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
