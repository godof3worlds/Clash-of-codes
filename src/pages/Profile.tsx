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
          <p className="font-sans text-xs text-on-surface-variant mt-1">Novice Voyager • Keep coding daily!</p>

          {/* XP Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-[11px] font-mono mb-1">
              <span className="text-primary">XP {user.xp}</span>
              <span className="text-on-surface-variant">{user.nextLevelXp}</span>
            </div>
            <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-tertiary rounded-full" style={{ width: `${(user.xp / user.nextLevelXp) * 100}%` }} />
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
              <span className="font-mono text-[10px] text-on-surface-variant">Islands</span>
            </div>
          </div>
        </div>

        {/* Badges Collection */}
        <div className="lg:col-span-2 bg-surface-container rounded-xl p-6 shadow-xl border border-surface-container-high/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-bold text-on-surface">Badges ({badges.length})</h3>
            <div className="flex gap-1">
              {['all', 'learning', 'conquest', 'streak', 'special'].map((cat) => (
                <span key={cat} className="px-2 py-0.5 rounded-full bg-surface-container-high font-mono text-[10px] text-on-surface-variant capitalize cursor-pointer hover:text-on-surface transition-colors">{cat}</span>
              ))}
            </div>
          </div>
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
                {badge.isCustom && (
                  <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-secondary/20 font-mono text-[9px] text-secondary">Custom</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Goals & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container rounded-xl p-5 shadow-xl border border-surface-container-high/50">
          <h3 className="font-display text-sm font-bold text-on-surface mb-3">Learning Goals</h3>
          <div className="space-y-3">
            {[
              { text: 'Master arrays & hash maps', done: true },
              { text: 'Become a full-stack developer', done: false },
              { text: 'Solve 100 coding problems', done: false },
              { text: 'Conquer all 4 islands', done: false },
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
          <h3 className="font-display text-sm font-bold text-on-surface mb-3">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { text: 'Captured Island Territory 3', time: '2 hours ago', icon: 'flag', color: 'text-tertiary' },
              { text: 'Solved: Two Sum', time: '3 hours ago', icon: 'terminal', color: 'text-primary' },
              { text: 'Custom Badge Earned', time: '1 day ago', icon: 'military_tech', color: 'text-amber-400' },
              { text: 'Max Subarray - Failed', time: '2 days ago', icon: 'close', color: 'text-error' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-surface-container-highest flex items-center justify-center flex-shrink-0">
                  <span className={`material-symbols-outlined text-[14px] ${item.color}`}>{item.icon}</span>
                </div>
                <span className="font-sans text-xs text-on-surface flex-1">{item.text}</span>
                <span className="font-mono text-[10px] text-on-surface-variant flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
