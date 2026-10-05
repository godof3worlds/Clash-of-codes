import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

export const IslandClash: React.FC = () => {
  const { activeClashRoom, joinClashRoom, togglePlayerReady, captureClashTerritory, leaveClashRoom, setCurrentView } = useStore();
  const [countdown, setCountdown] = useState(45);
  const [roomIdInput, setRoomIdInput] = useState('');

  // Countdown timer when in a clash
  useEffect(() => {
    if (!activeClashRoom || activeClashRoom.status !== 'waiting') return;
    const timer = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [activeClashRoom]);

  // Lobby view if not in a room
  if (!activeClashRoom) {
    return (
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface">Island Clash</h1>
          <p className="font-sans text-sm text-on-surface-variant mt-1">Compete with players, conquer the island!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create / Join Room */}
          <div className="bg-surface-container rounded-xl p-6 shadow-xl border border-primary/20 glow-primary">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[24px]">swords</span>
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-on-surface">Quick Match</h3>
                <p className="font-sans text-xs text-on-surface-variant">Auto-matched, ranked competitive battle</p>
              </div>
            </div>
            <button
              onClick={() => joinClashRoom()}
              className="w-full bg-gradient-to-r from-primary-container to-primary text-surface-container-lowest font-display font-bold text-sm py-3 rounded-xl hover:shadow-[0_0_20px_rgba(76,215,246,0.3)] transition-all"
            >
              Find Match
            </button>
          </div>

          <div className="bg-surface-container rounded-xl p-6 shadow-xl border border-secondary/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-[24px]">group</span>
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-on-surface">Private Room</h3>
                <p className="font-sans text-xs text-on-surface-variant">Create or join with a room code</p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                value={roomIdInput}
                onChange={(e) => setRoomIdInput(e.target.value)}
                placeholder="Enter Room Code..."
                className="flex-1 bg-surface-container-lowest border border-surface-container-highest rounded-lg px-3 py-2 text-sm font-mono text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary"
              />
              <button
                onClick={() => joinClashRoom(roomIdInput || '#CUSTOM')}
                className="px-4 py-2 rounded-lg bg-secondary-container text-secondary font-sans text-sm font-bold hover:bg-secondary/30 transition-colors"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Room Settings Preview */}
        <div className="bg-surface-container rounded-xl p-5 shadow-xl border border-surface-container-high/50">
          <h3 className="font-display text-sm font-bold text-on-surface mb-3">Room Settings</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Room Type', value: 'Public Room', icon: 'public' },
              { label: 'Match Type', value: 'Ranked Match', icon: 'emoji_events' },
              { label: 'Team Size', value: '8 Players', icon: 'group' },
              { label: 'Map', value: 'Algorithm Atoll', icon: 'map' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">{s.icon}</span>
                <div>
                  <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">{s.label}</p>
                  <p className="font-sans text-xs text-on-surface font-medium">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Active Clash Room View
  const room = activeClashRoom;
  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="flex flex-col space-y-5">
      {/* Room Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={leaveClashRoom} className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          </button>
          <div>
            <h1 className="font-display text-lg font-bold text-on-surface">Clash Room {room.id}</h1>
            <p className="font-sans text-xs text-on-surface-variant">{room.islandName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-high border border-primary/30">
            <span className="material-symbols-outlined text-primary text-[18px]">timer</span>
            <span className="font-mono text-xl font-bold text-on-surface">{formatTime(countdown)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Players List */}
        <div className="bg-surface-container rounded-xl p-5 shadow-xl border border-surface-container-high/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-sm font-bold text-on-surface">Players</h3>
            <span className="font-mono text-[11px] text-on-surface-variant">{room.currentPlayers.length}/{room.maxPlayers}</span>
          </div>
          <div className="space-y-2">
            {room.currentPlayers.map((player, i) => (
              <div key={player.id} className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${player.isCurrentUser ? 'bg-primary/10 border border-primary/20' : 'bg-surface-container-lowest/50'}`}>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="font-mono text-xs text-on-surface-variant w-4">{i + 1}</span>
                  <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0" style={{ borderColor: player.color, borderWidth: 2, borderStyle: 'solid' }}>
                    <img src={player.avatarUrl} alt={player.username} className="w-full h-full object-cover" />
                  </div>
                  <span className="font-sans text-xs font-medium text-on-surface truncate">{player.username}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] ${player.isReady ? 'bg-tertiary/20 text-tertiary' : 'bg-amber-400/20 text-amber-400'}`}>
                  {player.isReady ? 'Ready' : 'Waiting'}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={togglePlayerReady}
              className="flex-1 py-2 rounded-lg bg-tertiary/20 text-tertiary font-sans text-sm font-bold hover:bg-tertiary/30 transition-colors"
            >
              {room.currentPlayers.find((p) => p.isCurrentUser)?.isReady ? 'Unready' : 'Ready Up'}
            </button>
            <button
              onClick={() => joinClashRoom()}
              className="flex-1 py-2 rounded-lg bg-primary/20 text-primary font-sans text-sm font-bold hover:bg-primary/30 transition-colors"
            >
              Join Room
            </button>
          </div>
        </div>

        {/* Live Battle Map */}
        <div className="lg:col-span-2 bg-surface-container rounded-xl shadow-xl border border-surface-container-high/50 overflow-hidden relative min-h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-purple-950/30 to-surface-container" />
          <div className="relative p-5">
            <h3 className="font-display text-sm font-bold text-on-surface mb-3">Battle Map — {room.islandName}</h3>

            {/* Live Player Scores */}
            <div className="flex flex-wrap gap-3 mb-4">
              {room.currentPlayers.map((p) => (
                <div key={p.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-lowest/80 border border-surface-container-high/30">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="font-mono text-[10px] text-on-surface">{p.username.split(' ')[0]}</span>
                  <span className="font-mono text-[10px] text-primary font-bold">{p.score}</span>
                </div>
              ))}
            </div>

            {/* Simplified Battle Actions */}
            <div className="grid grid-cols-2 gap-3">
              {['Territory A', 'Territory B', 'Territory C', 'Territory D'].map((name, i) => (
                <button
                  key={i}
                  onClick={() => {
                    captureClashTerritory(`ct_${i}`);
                    useStore.getState().setActiveProblem(useStore.getState().problems[i % useStore.getState().problems.length]);
                    setCurrentView('practice-lab');
                  }}
                  className="p-4 rounded-xl bg-surface-container-lowest/80 border border-primary/20 hover:border-primary/50 hover:glow-primary transition-all text-left"
                >
                  <span className="font-display text-sm font-bold text-on-surface">{name}</span>
                  <p className="font-mono text-[10px] text-on-surface-variant mt-1">Solve to capture → +120 pts</p>
                </button>
              ))}
            </div>
          </div>

          {/* Match Countdown Overlay */}
          <div className="absolute bottom-4 right-4">
            <div className="px-3 py-1.5 rounded-lg bg-surface-container-lowest/90 border border-primary/30 font-mono text-xs text-primary">
              Match starts in: <span className="font-bold">{formatTime(countdown)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
