import React, { useState } from 'react';
import { useStore } from '../store/useStore';

export const Leaderboard: React.FC = () => {
  const { leaderboard, user } = useStore();
  const [period, setPeriod] = useState<'global' | 'weekly' | 'monthly'>('global');

  const displayList = leaderboard.length > 0 ? leaderboard : [
    {
      rank: 1,
      id: user.id,
      username: `${user.username} (You)`,
      avatarUrl: user.avatarUrl,
      score: user.xp * 10,
      xp: user.xp,
      problemsSolved: user.problemsSolved.total,
      streakDays: user.streakDays,
      isCurrentUser: true,
    }
  ];

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-on-surface">Leaderboard</h1>
        <p className="font-sans text-sm text-on-surface-variant mt-1">Top coders this season. Rise through the ranks!</p>
      </div>

      {/* Period Tabs */}
      <div className="flex gap-1 bg-surface-container-high rounded-xl p-1 w-fit">
        {(['global', 'weekly', 'monthly'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setPeriod(tab)}
            className={`px-5 py-2 rounded-lg font-sans text-sm font-medium transition-all capitalize ${
              period === tab ? 'bg-surface-container text-primary shadow-md' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Top 3 Podium (if enough players) */}
      {displayList.length >= 3 ? (
        <div className="grid grid-cols-3 gap-4">
          {[displayList[1], displayList[0], displayList[2]].map((entry, i) => {
            const podiumOrder = [2, 1, 3];
            const isGold = podiumOrder[i] === 1;
            const isSilver = podiumOrder[i] === 2;
            return (
              <div key={entry.id} className={`bg-surface-container rounded-xl p-5 shadow-xl border text-center transition-all ${
                isGold ? 'border-amber-400/30 glow-primary' : isSilver ? 'border-gray-400/20' : 'border-amber-700/20'
              } ${isGold ? 'lg:-mt-4' : ''}`}>
                <div className="relative mx-auto w-16 h-16 mb-3">
                  <img src={entry.avatarUrl} alt={entry.username} className="w-full h-full rounded-full object-cover border-2" style={{ borderColor: isGold ? '#f59e0b' : isSilver ? '#9ca3af' : '#b45309' }} />
                  <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    isGold ? 'bg-amber-400 text-black' : isSilver ? 'bg-gray-400 text-black' : 'bg-amber-700 text-white'
                  }`}>{podiumOrder[i]}</div>
                </div>
                <h4 className="font-display text-sm font-bold text-on-surface">{entry.username}</h4>
                <p className="font-mono text-lg text-primary font-bold mt-1">{entry.score.toLocaleString()}</p>
                <p className="font-mono text-[10px] text-on-surface-variant">{entry.xp.toLocaleString()} XP</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-surface-container rounded-xl p-6 border border-surface-container-high/50 text-center">
          <span className="material-symbols-outlined text-4xl text-primary mb-2">military_tech</span>
          <h3 className="font-display text-base font-bold text-on-surface">New Season Initialized</h3>
          <p className="font-sans text-xs text-on-surface-variant mt-1">Conquer territories and solve challenges to claim the #1 spot on the leaderboard.</p>
        </div>
      )}

      {/* Full Table */}
      <div className="bg-surface-container rounded-xl shadow-xl border border-surface-container-high/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-container-high/50">
                <th className="text-left px-5 py-3 font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">#</th>
                <th className="text-left px-5 py-3 font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">Player</th>
                <th className="text-right px-5 py-3 font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">Score</th>
                <th className="text-right px-5 py-3 font-mono text-[11px] text-on-surface-variant uppercase tracking-wider hidden md:table-cell">XP</th>
                <th className="text-right px-5 py-3 font-mono text-[11px] text-on-surface-variant uppercase tracking-wider hidden md:table-cell">Solved</th>
                <th className="text-right px-5 py-3 font-mono text-[11px] text-on-surface-variant uppercase tracking-wider hidden lg:table-cell">Streak</th>
              </tr>
            </thead>
            <tbody>
              {displayList.map((entry) => (
                <tr key={entry.id} className={`border-b border-surface-container-high/20 transition-colors ${
                  entry.isCurrentUser ? 'bg-primary/5' : 'hover:bg-surface-container-low/50'
                }`}>
                  <td className="px-5 py-3">
                    <span className={`font-mono text-sm font-bold ${
                      entry.rank <= 3 ? 'text-amber-400' : 'text-on-surface-variant'
                    }`}>{entry.rank}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={entry.avatarUrl} alt={entry.username} className="w-8 h-8 rounded-full object-cover" />
                      <span className={`font-sans text-sm font-medium ${entry.isCurrentUser ? 'text-primary' : 'text-on-surface'}`}>
                        {entry.username}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-sm text-on-surface font-bold">{entry.score.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right font-mono text-sm text-on-surface-variant hidden md:table-cell">{entry.xp.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right font-mono text-sm text-on-surface-variant hidden md:table-cell">{entry.problemsSolved}</td>
                  <td className="px-5 py-3 text-right hidden lg:table-cell">
                    <span className="font-mono text-sm text-amber-400">{entry.streakDays}🔥</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
