import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { generateAIProblem } from '../services/gemma';

export const IslandWorld: React.FC = () => {
  const { islands, setActiveIsland, activeIslandId, setCurrentView, setActiveProblem, problems, showToast } = useStore();
  const [selectedIsland, setSelectedIsland] = useState(activeIslandId);
  const [isGenerating, setIsGenerating] = useState(false);
  const island = islands.find((i) => i.id === selectedIsland) || islands[0];

  const handleTerritoryClick = (territoryId: string) => {
    const territory = island.territories.find((t) => t.id === territoryId);
    if (!territory || territory.status === 'locked') return;
    const prob = problems.find((p) => p.id === territory.problemId) || problems[0];
    if (prob) {
      setActiveProblem(prob);
      setActiveIsland(island.id);
      setCurrentView('practice-lab');
    }
  };

  const handleGenerateTerritoryChallenge = async (territoryId: string) => {
    const territory = island.territories.find((t) => t.id === territoryId);
    if (!territory) return;
    setIsGenerating(true);
    try {
      const newProb = await generateAIProblem(
        island.name.replace(' Shores', '').replace(' Lagoon', '').replace(' Archipelago', '').replace(' Atoll', ''),
        territory.difficulty,
        'Python'
      );
      setActiveProblem(newProb);
      setActiveIsland(island.id);
      showToast(`⚔️ AI generated new battle kata: "${newProb.title}"!`);
      setCurrentView('practice-lab');
    } catch (err) {
      showToast('⚠️ AI is offline. Launching standard territory kata.');
      handleTerritoryClick(territoryId);
    } finally {
      setIsGenerating(false);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'captured': return 'bg-tertiary shadow-[0_0_12px_rgba(78,222,163,0.5)]';
      case 'available': return 'bg-primary animate-pulse shadow-[0_0_12px_rgba(76,215,246,0.5)]';
      case 'in_progress': return 'bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]';
      default: return 'bg-surface-container-highest opacity-50';
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'captured': return 'Captured';
      case 'available': return 'Available';
      case 'in_progress': return 'In Progress';
      default: return 'Locked';
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface">Island World</h1>
          <p className="font-sans text-sm text-on-surface-variant mt-1">Explore islands, conquer territories, and generate AI battle challenges.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedIsland}
            onChange={(e) => setSelectedIsland(e.target.value)}
            className="bg-surface-container-high border border-surface-container-highest rounded-xl px-3 py-2 text-sm text-on-surface font-sans focus:outline-none focus:border-primary"
          >
            {islands.map((i) => (
              <option key={i.id} value={i.id}>{i.name} {!i.unlocked ? '🔒' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Island Map */}
      <div className="relative bg-surface-container rounded-2xl overflow-hidden shadow-xl border border-surface-container-high/50 min-h-[500px]">
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${island.bgColor} opacity-60`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(15,19,29,0.8))]" />

        {/* SVG Territory Map */}
        <svg className="relative w-full h-[500px]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          {/* Connection Lines */}
          {island.territories.map((ter) =>
            ter.connectedTerritoryIds.map((connId) => {
              const conn = island.territories.find((t) => t.id === connId);
              if (!conn) return null;
              if (ter.id > connId) return null;
              return (
                <line
                  key={`${ter.id}-${connId}`}
                  x1={ter.x} y1={ter.y}
                  x2={conn.x} y2={conn.y}
                  stroke={ter.status === 'captured' && conn.status === 'captured' ? '#4edea3' : 'rgba(188,201,205,0.2)'}
                  strokeWidth="0.4"
                  strokeDasharray={ter.status === 'locked' || conn.status === 'locked' ? '1,1' : 'none'}
                />
              );
            })
          )}

          {/* Territory Nodes */}
          {island.territories.map((ter) => (
            <g
              key={ter.id}
              onClick={() => handleTerritoryClick(ter.id)}
              className={`${ter.status !== 'locked' ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            >
              <circle
                cx={ter.x} cy={ter.y} r="4.5"
                className={`${statusColor(ter.status)} transition-all duration-300`}
                fill="currentColor"
                opacity={ter.status === 'locked' ? 0.3 : 0.9}
              />
              <circle
                cx={ter.x} cy={ter.y} r="3"
                fill={ter.status === 'captured' ? '#4edea3' : ter.status === 'available' ? '#4cd7f6' : ter.status === 'in_progress' ? '#f59e0b' : '#313540'}
              />
              {ter.status === 'locked' && (
                <text x={ter.x} y={ter.y + 1.2} textAnchor="middle" fill="#bcc9cd" fontSize="3" opacity="0.5">🔒</text>
              )}
              <text x={ter.x} y={ter.y + 8} textAnchor="middle" fill="#dfe2f1" fontSize="2.2" fontFamily="Plus Jakarta Sans">
                {ter.name.split(': ')[1] || ter.name}
              </text>
            </g>
          ))}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 flex items-center gap-4">
          {['captured', 'available', 'in_progress', 'locked'].map((status) => (
            <div key={status} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${
                status === 'captured' ? 'bg-tertiary' :
                status === 'available' ? 'bg-primary' :
                status === 'in_progress' ? 'bg-amber-400' : 'bg-surface-container-highest'
              }`} />
              <span className="font-mono text-[10px] text-on-surface-variant">{statusLabel(status)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Territory Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {island.territories.map((ter) => {
          const prob = problems.find((p) => p.id === ter.problemId);
          return (
            <div
              key={ter.id}
              className={`bg-surface-container rounded-xl p-4 shadow-lg border transition-all duration-200 ${
                ter.status === 'available' ? 'border-primary/30 hover:glow-primary' :
                ter.status === 'captured' ? 'border-tertiary/20 opacity-80' :
                ter.status === 'in_progress' ? 'border-amber-400/30' :
                'border-surface-container-high/30 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-display text-sm font-bold text-on-surface">{ter.name.split(': ')[1] || ter.name}</span>
                <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                  ter.difficulty === 'Easy' ? 'bg-tertiary/20 text-tertiary' :
                  ter.difficulty === 'Medium' ? 'bg-amber-400/20 text-amber-400' :
                  'bg-error/20 text-error'
                }`}>{ter.difficulty}</span>
              </div>
              {prob && <p className="font-sans text-xs text-on-surface-variant">Default: {prob.title}</p>}
              <div className="flex items-center justify-between mt-3">
                <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] ${
                  ter.status === 'captured' ? 'bg-tertiary/20 text-tertiary' :
                  ter.status === 'available' ? 'bg-primary/20 text-primary' :
                  ter.status === 'in_progress' ? 'bg-amber-400/20 text-amber-400' :
                  'bg-surface-container-highest text-on-surface-variant'
                }`}>{statusLabel(ter.status)}</span>
                
                {ter.status !== 'locked' && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleGenerateTerritoryChallenge(ter.id)}
                      disabled={isGenerating}
                      className="px-2 py-1 bg-secondary/20 hover:bg-secondary/30 text-secondary rounded-lg font-mono text-[10px] font-bold transition-all disabled:opacity-50"
                      title="Generate dynamic AI question for this node"
                    >
                      ⚡ AI Battle
                    </button>
                    <button
                      onClick={() => handleTerritoryClick(ter.id)}
                      className="px-2.5 py-1 bg-primary text-surface-container-lowest rounded-lg font-sans text-xs font-bold hover:shadow-md transition-all"
                    >
                      Enter
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
