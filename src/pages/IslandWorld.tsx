import React, { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import confetti from 'canvas-confetti';
import { useStore } from '../store/useStore';
import { executeCode } from '../services/jdoodle';
import { askAIMentor } from '../services/gemma';
import { ExecutionResult, Problem, Territory } from '../types';

export const IslandWorld: React.FC = () => {
  const {
    islands, setActiveIsland, activeIslandId, captureTerritory,
    problems, user, addXP, updateAdaptiveDifficulty, showToast,
  } = useStore();

  const [selectedIslandId, setSelectedIslandId] = useState<string>(activeIslandId || 'python-shores');
  const currentIsland = islands.find((i) => i.id === selectedIslandId) || islands[0];

  // Conquest Modal State
  const [activeTerritory, setActiveTerritory] = useState<Territory | null>(null);
  const [modalProblem, setModalProblem] = useState<Problem | null>(null);
  const [modalCode, setModalCode] = useState<string>('');
  const [modalLang, setModalLang] = useState<string>('Python');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [execResult, setExecResult] = useState<ExecutionResult | null>(null);
  const [modalTab, setModalTab] = useState<'problem' | 'results' | 'mentor'>('problem');
  const [mentorHint, setMentorHint] = useState<string | null>(null);
  const [isAskingMentor, setIsAskingMentor] = useState(false);
  const [conquestSuccess, setConquestSuccess] = useState(false);

  // Open the conquest coding window for a node
  const handleOpenConquest = (territory: Territory, targetIslandId?: string) => {
    const islId = targetIslandId || selectedIslandId;
    const currentIsl = useStore.getState().islands.find((i) => i.id === islId) || islands[0];
    const liveTer = currentIsl.territories.find((t) => t.id === territory.id) || territory;

    if (liveTer.status === 'locked') {
      showToast('🔒 This territory is locked. Conquer prerequisite nodes on the branching path first!');
      return;
    }
    const prob = problems.find((p) => p.id === liveTer.problemId) || problems[0];
    setActiveTerritory(liveTer);
    setModalProblem(prob);
    setModalLang('Python');
    setModalCode(prob.starterCode['Python'] || prob.starterCode['JavaScript'] || '# Write your solution\n');
    setExecResult(null);
    setMentorHint(null);
    setConquestSuccess(liveTer.status === 'captured');
    setModalTab('problem');
  };

  const handleCloseModal = () => {
    setActiveTerritory(null);
    setModalProblem(null);
    setConquestSuccess(false);
  };

  const handleRunCode = useCallback(async () => {
    if (!modalProblem) return;
    setIsRunning(true);
    setModalTab('results');
    const res = await executeCode(
      modalCode,
      modalLang,
      modalProblem.testCases.filter((t) => !t.isSecret)
    );
    setExecResult(res);
    setIsRunning(false);
  }, [modalCode, modalLang, modalProblem]);

  const handleSubmitCode = useCallback(async () => {
    if (!modalProblem || !activeTerritory) return;
    setIsSubmitting(true);
    setModalTab('results');
    const res = await executeCode(modalCode, modalLang, modalProblem.testCases);
    setExecResult(res);

    if (res.passed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      addXP(modalProblem.points);
      captureTerritory(currentIsland.id, activeTerritory.id);
      updateAdaptiveDifficulty(true);
      setConquestSuccess(true);
      showToast(`🎉 Victory! Conquered "${activeTerritory.name}" (+${modalProblem.points} XP)!`);
    } else {
      updateAdaptiveDifficulty(false);
      showToast('⚠️ Solution did not pass all test cases. Check output and retry!');
    }
    setIsSubmitting(false);
  }, [modalProblem, activeTerritory, modalCode, modalLang, currentIsland.id, addXP, captureTerritory, updateAdaptiveDifficulty, showToast]);

  const handleAskMentorHint = async () => {
    if (!modalProblem) return;
    setIsAskingMentor(true);
    setModalTab('mentor');
    const hint = await askAIMentor(
      `Give me a gentle hint on how to approach the "${modalProblem.title}" problem without giving away full code.`,
      user,
      1
    );
    setMentorHint(hint);
    setIsAskingMentor(false);
  };

  // Find next territory or next island deterministically from fresh store
  const handleNextUnlocked = () => {
    const freshIslands = useStore.getState().islands;
    const currentIsl = freshIslands.find((i) => i.id === selectedIslandId) || freshIslands[0];
    
    // 1. Try directly connected child nodes first
    let nextNode: Territory | undefined;
    if (activeTerritory && activeTerritory.connectedTerritoryIds?.length > 0) {
      nextNode = currentIsl.territories.find((t) => 
        activeTerritory.connectedTerritoryIds.includes(t.id) && t.status !== 'locked' && t.id !== activeTerritory.id
      );
    }

    // 2. If no direct child, try any available or non-captured node on this island
    if (!nextNode) {
      nextNode = currentIsl.territories.find((t) => (t.status === 'available' || t.status === 'in_progress') && t.id !== activeTerritory?.id);
    }

    if (nextNode) {
      handleOpenConquest(nextNode, currentIsl.id);
      showToast(`⚔️ Opening next territory: "${nextNode.name}"`);
      return;
    }

    // 3. If all nodes on current island are captured, advance to next island
    const currentIslIndex = freshIslands.findIndex((i) => i.id === currentIsl.id);
    if (currentIslIndex >= 0 && currentIslIndex + 1 < freshIslands.length) {
      const nextIsl = freshIslands[currentIslIndex + 1];
      setSelectedIslandId(nextIsl.id);
      setActiveIsland(nextIsl.id);

      const firstNode = nextIsl.territories[0];
      if (firstNode) {
        handleOpenConquest(firstNode, nextIsl.id);
        showToast(`🌴 Welcome to ${nextIsl.name}! Starting first territory.`);
        return;
      }
    }

    // 4. Default fallback: close modal
    handleCloseModal();
    showToast('🌟 All currently unlocked territories completed! Explore the world map.');
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Island Biome Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-container rounded-2xl p-4 shadow-xl border border-surface-container-high/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-tertiary uppercase tracking-wider">Conquest World Map</span>
            <span className="px-2 py-0.5 rounded-full bg-primary/20 font-mono text-[10px] text-primary font-bold">
              Branching Skill Tree
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-on-surface mt-0.5">{currentIsland.name}</h1>
          <p className="font-sans text-xs text-on-surface-variant max-w-xl">{currentIsland.description}</p>
        </div>

        {/* Islands Carousel / Dropdown */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
          {islands.map((isl) => (
            <button
              key={isl.id}
              onClick={() => {
                setSelectedIslandId(isl.id);
                setActiveIsland(isl.id);
              }}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl transition-all border ${
                selectedIslandId === isl.id
                  ? 'bg-surface-container-high border-primary text-primary shadow-[0_0_16px_rgba(76,215,246,0.25)]'
                  : 'bg-surface-container-lowest/60 border-surface-container-high/40 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              {isl.image ? (
                <img src={isl.image} alt={isl.name} className="w-6 h-6 rounded-md object-cover" />
              ) : (
                <span className="material-symbols-outlined text-[18px]">{isl.icon}</span>
              )}
              <span className="font-sans text-xs font-medium whitespace-nowrap">{isl.name}</span>
              <span className="font-mono text-[10px] opacity-70">({isl.progress})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Branching Map Canvas */}
      <div className="relative bg-surface-container rounded-3xl overflow-hidden shadow-2xl border border-surface-container-high/60 min-h-[560px]">
        {/* Island Biome Graphics Backdrop */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {currentIsland.image && (
            <div className="absolute top-4 right-6 w-72 h-72 opacity-25 filter blur-[1px] transform rotate-3">
              <img src={currentIsland.image} alt="Island Sprite" className="w-full h-full object-contain pixelated" />
            </div>
          )}
          <div className={`absolute inset-0 bg-gradient-to-br ${currentIsland.bgColor} opacity-70`} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(15,19,29,0.85))]" />
        </div>

        {/* Grid Pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        {/* SVG Skill Tree & Connectors */}
        <svg className="relative w-full h-[560px]" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="capturedLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4edea3" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#4cd7f6" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="activeLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4cd7f6" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.5" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render Branching Bezier Connectors */}
          {currentIsland.territories.map((src) =>
            src.connectedTerritoryIds.map((targetId) => {
              const target = currentIsland.territories.find((t) => t.id === targetId);
              if (!target) return null;

              const isCapturedPath = src.status === 'captured' && target.status === 'captured';
              const isAvailablePath = src.status === 'captured' && (target.status === 'available' || target.status === 'in_progress');

              // Control points for smooth organic curve
              const dx = target.x - src.x;
              const cp1x = src.x + dx * 0.5;
              const cp1y = src.y;
              const cp2x = src.x + dx * 0.5;
              const cp2y = target.y;
              const pathD = `M ${src.x} ${src.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${target.x} ${target.y}`;

              return (
                <g key={`${src.id}-${target.id}`}>
                  {(isCapturedPath || isAvailablePath) && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke={isCapturedPath ? '#4edea3' : '#4cd7f6'}
                      strokeWidth="1.2"
                      opacity="0.3"
                      filter="url(#glow)"
                    />
                  )}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={
                      isCapturedPath
                        ? 'url(#capturedLine)'
                        : isAvailablePath
                        ? 'url(#activeLine)'
                        : 'rgba(255, 255, 255, 0.12)'
                    }
                    strokeWidth={isCapturedPath ? '0.8' : isAvailablePath ? '0.6' : '0.4'}
                    strokeDasharray={isCapturedPath ? 'none' : isAvailablePath ? '1.5, 1' : '1, 1.5'}
                    className={isAvailablePath ? 'animate-pulse' : ''}
                  />
                </g>
              );
            })
          )}

          {/* Render Branching Tree Nodes */}
          {currentIsland.territories.map((node) => {
            const isCaptured = node.status === 'captured';
            const isAvailable = node.status === 'available';
            const isLocked = node.status === 'locked';

            return (
              <g
                key={node.id}
                onClick={() => handleOpenConquest(node)}
                className="cursor-pointer group"
                style={{ transformOrigin: `${node.x}% ${node.y}%` }}
              >
                {/* Pulsing Ring for Available Nodes */}
                {isAvailable && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="5.5"
                    fill="none"
                    stroke="#4cd7f6"
                    strokeWidth="0.5"
                    opacity="0.6"
                    className="animate-ping"
                  />
                )}

                {/* Outer Ring */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="4.2"
                  fill={isCaptured ? '#4edea3' : isAvailable ? '#4cd7f6' : '#232836'}
                  opacity={isLocked ? 0.4 : 0.8}
                  className="transition-all duration-300 group-hover:scale-125"
                />

                {/* Inner Core */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="3.2"
                  fill={isCaptured ? '#064e3b' : isAvailable ? '#0c4a6e' : '#131722'}
                  stroke={isCaptured ? '#4edea3' : isAvailable ? '#4cd7f6' : '#374151'}
                  strokeWidth="0.4"
                />

                {/* Node Status Icon */}
                <text
                  x={node.x}
                  y={node.y + 1}
                  textAnchor="middle"
                  fontSize="2"
                  fill={isCaptured ? '#4edea3' : isAvailable ? '#4cd7f6' : '#9ca3af'}
                  fontWeight="bold"
                >
                  {isCaptured ? '✓' : isLocked ? '🔒' : '⚔️'}
                </text>

                {/* Territory Label Badge */}
                <g transform={`translate(${node.x}, ${node.y + 6.5})`}>
                  <rect
                    x="-12"
                    y="-2.5"
                    width="24"
                    height="5"
                    rx="1.5"
                    fill="#0f131d"
                    fillOpacity="0.85"
                    stroke={isCaptured ? '#4edea3' : isAvailable ? '#4cd7f6' : '#374151'}
                    strokeWidth="0.2"
                  />
                  <text
                    x="0"
                    y="0.8"
                    textAnchor="middle"
                    fill="#f3f4f6"
                    fontSize="1.6"
                    fontWeight="600"
                    fontFamily="Plus Jakarta Sans"
                  >
                    {node.name.length > 18 ? node.name.slice(0, 16) + '...' : node.name}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Floating Controls & Legend */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 bg-surface-container-lowest/80 backdrop-blur-md p-3 rounded-2xl border border-surface-container-high/40">
          <div className="flex items-center gap-4 text-xs font-sans">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-tertiary shadow-[0_0_8px_rgba(78,222,163,0.6)]" />
              <span className="text-on-surface font-medium">Captured</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(76,215,246,0.6)] animate-pulse" />
              <span className="text-on-surface font-medium">Available (Click to Code)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-gray-600 opacity-60" />
              <span className="text-on-surface-variant font-medium">Locked Branch</span>
            </div>
          </div>

          <div className="font-mono text-xs text-primary font-bold">
            Progress: {currentIsland.capturedTerritories} / {currentIsland.totalTerritories} conquered
          </div>
        </div>
      </div>

      {/* SEPARATE CONQUEST CODING WINDOW (OVERLAY WORKSPACE) */}
      {activeTerritory && modalProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-6xl h-[92vh] bg-surface-container rounded-2xl shadow-2xl border border-primary/40 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex flex-wrap items-center justify-between px-6 py-3.5 bg-surface-container-high border-b border-surface-container-highest gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold">
                  ⚔️
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-tertiary font-bold uppercase">{currentIsland.name}</span>
                    <span className="text-on-surface-variant text-xs">•</span>
                    <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                      activeTerritory.difficulty === 'Easy' ? 'bg-tertiary/20 text-tertiary' :
                      activeTerritory.difficulty === 'Medium' ? 'bg-amber-400/20 text-amber-400' :
                      'bg-error/20 text-error'
                    }`}>{activeTerritory.difficulty}</span>
                  </div>
                  <h2 className="font-display text-base sm:text-lg font-bold text-on-surface">
                    {activeTerritory.name}: {modalProblem.title}
                  </h2>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <select
                  value={modalLang}
                  onChange={(e) => {
                    const l = e.target.value;
                    setModalLang(l);
                    setModalCode(modalProblem.starterCode[l] || modalProblem.starterCode['Python'] || '');
                  }}
                  className="bg-surface-container-lowest border border-surface-container-highest rounded-xl px-3 py-1.5 text-xs text-on-surface font-mono focus:outline-none focus:border-primary"
                >
                  <option value="Python">Python 3</option>
                  <option value="JavaScript">JavaScript</option>
                </select>

                <button
                  onClick={handleAskMentorHint}
                  disabled={isAskingMentor}
                  className="px-3 py-1.5 rounded-xl bg-secondary/15 border border-secondary/40 text-secondary font-sans text-xs font-bold hover:bg-secondary/25 transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">psychology</span>
                  {isAskingMentor ? 'Thinking...' : 'AI Hint'}
                </button>

                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="px-4 py-1.5 rounded-xl bg-surface-container-lowest border border-primary/40 text-primary font-sans text-xs font-bold hover:bg-surface-container-high transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                  {isRunning ? 'Running...' : 'Run'}
                </button>

                <button
                  onClick={handleSubmitCode}
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-primary-container to-primary text-surface-container-lowest font-sans text-xs font-bold hover:shadow-[0_0_16px_rgba(76,215,246,0.4)] transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  {isSubmitting ? 'Conquering...' : 'Submit & Conquer'}
                </button>

                {/* Permanent Next Challenge Button */}
                <button
                  onClick={handleNextUnlocked}
                  className={`px-3.5 py-1.5 rounded-xl font-sans text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    conquestSuccess
                      ? 'bg-tertiary text-surface-container-lowest border-tertiary shadow-[0_0_16px_rgba(78,222,163,0.5)] animate-pulse'
                      : 'bg-surface-container-lowest border-surface-container-highest text-on-surface hover:text-primary hover:border-primary/40'
                  }`}
                  title="Advance to next territory or island"
                >
                  <span>Next Challenge</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>

                <button
                  onClick={handleCloseModal}
                  className="w-8 h-8 rounded-xl bg-surface-container-lowest hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-all ml-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body: Split 50/50 Problem & Monaco Editor */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
              {/* Left Column: Problem Tabs */}
              <div className="lg:col-span-5 border-r border-surface-container-high/60 flex flex-col bg-surface-container-lowest/40 overflow-hidden">
                <div className="flex border-b border-surface-container-high/60">
                  <button
                    onClick={() => setModalTab('problem')}
                    className={`flex-1 py-3 font-sans text-xs font-bold transition-all border-b-2 ${
                      modalTab === 'problem' ? 'border-primary text-primary bg-surface-container/50' : 'border-transparent text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Mission Brief
                  </button>
                  <button
                    onClick={() => setModalTab('results')}
                    className={`flex-1 py-3 font-sans text-xs font-bold transition-all border-b-2 ${
                      modalTab === 'results' ? 'border-tertiary text-tertiary bg-surface-container/50' : 'border-transparent text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Test Output
                  </button>
                  <button
                    onClick={() => setModalTab('mentor')}
                    className={`flex-1 py-3 font-sans text-xs font-bold transition-all border-b-2 ${
                      modalTab === 'mentor' ? 'border-secondary text-secondary bg-surface-container/50' : 'border-transparent text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    AI Sensei
                  </button>
                </div>

                <div className="flex-1 p-5 overflow-y-auto space-y-4">
                  {/* Victory Banner with Next Challenge Button */}
                  {conquestSuccess && (
                    <div className="p-4 rounded-xl bg-tertiary/15 border border-tertiary/40 glow-tertiary">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">🏆</span>
                          <div>
                            <h4 className="font-display text-sm font-bold text-tertiary">Territory Conquered!</h4>
                            <p className="font-sans text-xs text-on-surface-variant">Next branch is unlocked.</p>
                          </div>
                        </div>
                        <button
                          onClick={handleNextUnlocked}
                          className="px-4 py-2 rounded-xl bg-tertiary text-surface-container-lowest font-sans text-xs font-bold hover:shadow-lg transition-all flex items-center gap-1.5"
                        >
                          <span>Next Challenge</span>
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {modalTab === 'problem' && (
                    <div className="space-y-4 font-sans text-sm text-on-surface leading-relaxed">
                      <div className="whitespace-pre-line bg-surface-container/30 p-4 rounded-xl border border-surface-container-high/30">
                        {modalProblem.description}
                      </div>

                      {modalProblem.examples.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">Example Cases</h4>
                          {modalProblem.examples.map((ex, i) => (
                            <div key={i} className="p-3 bg-surface-container-lowest rounded-xl font-mono text-xs border border-surface-container-high/40">
                              <div><span className="text-on-surface-variant">Input: </span><span className="text-primary">{ex.input}</span></div>
                              <div><span className="text-on-surface-variant">Output: </span><span className="text-tertiary">{ex.output}</span></div>
                              {ex.explanation && <div className="text-[11px] text-on-surface-variant/80 font-sans mt-1">{ex.explanation}</div>}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="space-y-1">
                        <h4 className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">Constraints</h4>
                        <ul className="list-disc list-inside space-y-1 font-mono text-xs text-on-surface-variant">
                          {modalProblem.constraints.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                      </div>
                    </div>
                  )}

                  {modalTab === 'results' && (
                    <div className="space-y-4">
                      {!execResult ? (
                        <div className="text-center py-16 text-on-surface-variant">
                          <span className="material-symbols-outlined text-4xl mb-2">code</span>
                          <p className="font-sans text-xs">Run or Submit to test your code against battle test cases.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className={`p-4 rounded-xl border flex items-center justify-between ${
                            execResult.passed ? 'bg-tertiary/15 border-tertiary/40' : 'bg-error/15 border-error/40'
                          }`}>
                            <div>
                              <h4 className={`font-display text-sm font-bold ${execResult.passed ? 'text-tertiary' : 'text-error'}`}>
                                {execResult.passed ? '✓ All Test Cases Conquered!' : '✗ Tests Failed'}
                              </h4>
                              <span className="font-mono text-xs text-on-surface-variant">
                                {execResult.passedCount} / {execResult.totalTests} passed
                              </span>
                            </div>
                            <span className="font-mono text-xs text-on-surface-variant">{execResult.executionTimeMs}ms</span>
                          </div>

                          {execResult.testDetails.map((td, i) => (
                            <div key={i} className="p-3 bg-surface-container-lowest rounded-xl border border-surface-container-high/40 font-mono text-xs space-y-1">
                              <div className="flex justify-between">
                                <span className="font-bold text-on-surface">Test #{i + 1}</span>
                                <span className={td.passed ? 'text-tertiary' : 'text-error'}>{td.passed ? 'PASS' : 'FAIL'}</span>
                              </div>
                              <div><span className="text-on-surface-variant">Input: </span>{td.input}</div>
                              <div><span className="text-on-surface-variant">Expected: </span>{td.expected}</div>
                              <div><span className="text-on-surface-variant">Actual: </span><span className={td.passed ? 'text-tertiary' : 'text-error'}>{td.actual}</span></div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {modalTab === 'mentor' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/30">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="material-symbols-outlined text-secondary">psychology</span>
                          <h4 className="font-display text-sm font-bold text-on-surface">AI Mentor Sensei</h4>
                        </div>
                        <p className="font-sans text-xs text-on-surface leading-relaxed whitespace-pre-line">
                          {mentorHint || 'Need guidance? Click "AI Hint" above for a Socratic hint tailored to your battle node!'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Full Monaco Code Editor */}
              <div className="lg:col-span-7 flex flex-col bg-surface-container overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-surface-container-high border-b border-surface-container-highest text-xs font-mono text-on-surface-variant">
                  <span>solution.{modalLang === 'Python' ? 'py' : 'js'}</span>
                  <button
                    onClick={() => setModalCode(modalProblem.starterCode[modalLang] || '')}
                    className="hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">restart_alt</span>
                    Reset Starter Code
                  </button>
                </div>
                <div className="flex-1 min-h-[300px]">
                  <Editor
                    height="100%"
                    language={modalLang.toLowerCase() === 'python' ? 'python' : 'javascript'}
                    value={modalCode}
                    onChange={(v) => setModalCode(v || '')}
                    theme="vs-dark"
                    options={{
                      fontSize: 14,
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      padding: { top: 12, bottom: 12 },
                      tabSize: 4,
                      automaticLayout: true,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
