import React from 'react';
import { useStore } from '../store/useStore';

export const Dashboard: React.FC = () => {
  const { user, islands, setCurrentView, badges } = useStore();
  const currentIsland = islands.find((i) => i.id === user.currentIslandId) || islands[0];

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* XP Card */}
        <div className="relative bg-surface-container rounded-xl p-5 shadow-xl overflow-hidden group hover:bg-surface-container-high transition-all duration-300 border border-surface-container-high/50">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">Conquest Power</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">bolt</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-bold text-on-surface tracking-tight">{user.xp}</span>
            <span className="font-mono text-sm text-primary font-bold">XP</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="font-mono text-[11px] text-tertiary flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +140 XP
            </span>
            <span className="font-sans text-xs text-on-surface-variant">this week</span>
          </div>
          <div className="mt-3 w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-primary-container via-primary to-secondary h-full rounded-full transition-all duration-1000" style={{ width: `${(user.xp / user.nextLevelXp) * 100}%` }} />
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="font-mono text-[11px] text-on-surface-variant">Lv. {user.level}</span>
            <span className="font-mono text-[11px] text-primary">Next: {user.nextLevelXp.toLocaleString()} XP</span>
          </div>
        </div>

        {/* Problems Solved Card */}
        <div className="relative bg-surface-container rounded-xl p-5 shadow-xl overflow-hidden group hover:bg-surface-container-high transition-all duration-300 border border-surface-container-high/50">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-tertiary/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">Kata Mastery</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[20px]">terminal</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-bold text-on-surface tracking-tight">{user.problemsSolved.total}</span>
            <span className="font-sans text-xs text-on-surface-variant font-medium">challenges conquered</span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-1 bg-surface-container-lowest px-2 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-tertiary" />
              <span className="font-mono text-[11px] text-on-surface">{user.problemsSolved.easy} Easy</span>
            </div>
            <div className="flex items-center gap-1 bg-surface-container-lowest px-2 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="font-mono text-[11px] text-on-surface">{user.problemsSolved.medium} Med</span>
            </div>
            <div className="flex items-center gap-1 bg-surface-container-lowest px-2 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-error" />
              <span className="font-mono text-[11px] text-on-surface">{user.problemsSolved.hard} Hard</span>
            </div>
          </div>
        </div>

        {/* Adaptive Difficulty Card */}
        <div className="relative bg-surface-container rounded-xl p-5 shadow-xl overflow-hidden group hover:bg-surface-container-high transition-all duration-300 border border-surface-container-high/50">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-secondary/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">Adaptive Threat</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[20px]">speed</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-bold text-on-surface tracking-tight">{user.adaptiveDifficulty.toFixed(1)}</span>
            <span className="font-mono text-sm text-on-surface-variant">/ 10</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="px-2 py-0.5 rounded-full bg-secondary-container font-mono text-[11px] text-secondary font-bold">Balanced Growth</span>
          </div>
          <div className="mt-2 flex gap-1">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded ${i < Math.round(user.adaptiveDifficulty) ? 'bg-secondary' : 'bg-surface-container-highest'}`} />
            ))}
          </div>
        </div>

        {/* Badges Card */}
        <div className="relative bg-surface-container rounded-xl p-5 shadow-xl overflow-hidden group hover:bg-surface-container-high transition-all duration-300 border border-surface-container-high/50">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">Battle Trophies</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-amber-400">
              <span className="material-symbols-outlined text-[20px]">military_tech</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-bold text-on-surface tracking-tight">{user.badgesCount}</span>
            <span className="font-sans text-xs text-on-surface-variant font-medium">earned</span>
          </div>
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            {badges.slice(0, 4).map((b) => (
              <div key={b.id} className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center" title={b.name}>
                <span className="material-symbols-outlined text-amber-400 text-[16px]">{b.icon}</span>
              </div>
            ))}
            {badges.length > 4 && (
              <span className="font-mono text-[11px] text-on-surface-variant ml-1">+{badges.length - 4} more</span>
            )}
          </div>
        </div>
      </div>

      {/* Middle Row: Island Preview + AI Mentor Suggestion + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Current Island Preview */}
        <div className="lg:col-span-1 bg-surface-container rounded-xl overflow-hidden shadow-xl border border-surface-container-high/50">
          <div className="h-40 bg-gradient-to-br from-emerald-950/80 via-cyan-950/60 to-surface-container relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(78,222,163,0.15),transparent_60%)]" />
            <div className="absolute bottom-4 left-5 right-5">
              <span className="font-mono text-[10px] text-tertiary uppercase tracking-wider">Current Island</span>
              <h3 className="font-display text-xl font-bold text-on-surface mt-0.5">{currentIsland.name}</h3>
              <p className="font-sans text-xs text-on-surface-variant mt-1">{currentIsland.description}</p>
            </div>
          </div>
          <div className="p-4">
            <button
              onClick={() => setCurrentView('island-world')}
              className="w-full bg-gradient-to-r from-primary-container to-primary text-surface-container-lowest font-display font-bold text-sm py-2.5 rounded-xl hover:shadow-[0_0_20px_rgba(76,215,246,0.3)] transition-all flex items-center justify-center gap-2"
            >
              Continue Conquest
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* AI Mentor Suggestion */}
        <div className="lg:col-span-1 bg-surface-container rounded-xl p-5 shadow-xl border border-secondary/20 glow-secondary">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary text-[20px]">psychology</span>
            </div>
            <span className="font-display text-sm font-bold text-on-surface">AI Mentor Suggests</span>
          </div>
          <p className="font-sans text-sm text-on-surface leading-relaxed">
            Your array skills are strong! Try practicing <span className="text-primary font-bold">recursion</span> next. It'll unlock Data Forest island.
          </p>
          <button
            onClick={() => setCurrentView('ai-mentor')}
            className="mt-3 font-sans text-xs text-secondary hover:text-primary transition-colors flex items-center gap-1"
          >
            View Recommendations
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-1 bg-surface-container rounded-xl p-5 shadow-xl border border-surface-container-high/50">
          <h3 className="font-display text-sm font-bold text-on-surface mb-3">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { icon: 'flag', text: 'Captured Island Territory 3', time: '2h ago', color: 'text-tertiary' },
              { icon: 'terminal', text: 'Solved: Two Sum', time: '3h ago', color: 'text-primary' },
              { icon: 'military_tech', text: 'Earned Badge: First Island', time: '1d ago', color: 'text-amber-400' },
              { icon: 'trending_up', text: 'Streak reached 12 days!', time: '1d ago', color: 'text-error' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-surface-container-highest flex items-center justify-center flex-shrink-0">
                  <span className={`material-symbols-outlined text-[16px] ${item.color}`}>{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-xs text-on-surface truncate">{item.text}</p>
                </div>
                <span className="font-mono text-[10px] text-on-surface-variant flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Island Map Overview & Topic Strength */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* All Islands Overview */}
        <div className="bg-surface-container rounded-xl p-5 shadow-xl border border-surface-container-high/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm font-bold text-on-surface">Island Progress</h3>
            <button onClick={() => setCurrentView('island-world')} className="font-sans text-xs text-primary hover:underline">View Map →</button>
          </div>
          <div className="space-y-3">
            {islands.map((isl) => (
              <div key={isl.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-container-lowest/50 hover:bg-surface-container-low transition-colors">
                <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center">
                  <span className={`material-symbols-outlined text-[20px] ${isl.unlocked ? 'text-primary' : 'text-on-surface-variant/50'}`}>{isl.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`font-sans text-sm font-medium ${isl.unlocked ? 'text-on-surface' : 'text-on-surface-variant/60'}`}>{isl.name}</span>
                    <span className="font-mono text-[11px] text-on-surface-variant">{isl.progress}</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden mt-1.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isl.unlocked ? 'bg-gradient-to-r from-primary to-tertiary' : 'bg-surface-container-high'}`}
                      style={{ width: `${isl.totalTerritories > 0 ? (isl.capturedTerritories / isl.totalTerritories) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                {!isl.unlocked && (
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant/50">lock</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Topic Strength Radar */}
        <div className="bg-surface-container rounded-xl p-5 shadow-xl border border-surface-container-high/50">
          <h3 className="font-display text-sm font-bold text-on-surface mb-4">Topic Strengths</h3>
          <div className="space-y-3">
            {Object.entries(user.topicStrengths).map(([topic, strength]) => (
              <div key={topic}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-sans text-xs text-on-surface">{topic}</span>
                  <span className="font-mono text-[11px] text-on-surface-variant">{strength}%</span>
                </div>
                <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      strength >= 70 ? 'bg-tertiary' : strength >= 40 ? 'bg-amber-400' : 'bg-error'
                    }`}
                    style={{ width: `${strength}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-surface-container-lowest border border-error/20">
            <span className="font-mono text-[11px] text-error font-bold uppercase tracking-wider">Focus Areas</span>
            <p className="font-sans text-xs text-on-surface-variant mt-1">{user.topicWeaknesses.join(', ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
