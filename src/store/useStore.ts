import { create } from 'zustand';
import { ViewMode, UserProfile, Island, Problem, ClashRoom, Badge, Course, AIFeedback, LeaderboardEntry } from '../types';
import { INITIAL_USER_PROFILE, INITIAL_ISLANDS, MOCK_PROBLEMS, MOCK_BADGES, MOCK_LEADERBOARD, MOCK_COURSES } from '../data/mockData';

interface AppState {
  currentView: ViewMode;
  user: UserProfile;
  islands: Island[];
  problems: Problem[];
  badges: Badge[];
  leaderboard: LeaderboardEntry[];
  courses: Course[];
  
  // Active states
  activeIslandId: string;
  activeProblem: Problem;
  currentCode: string;
  selectedLanguage: string;
  activeClashRoom: ClashRoom | null;
  lastAIFeedback: AIFeedback | null;
  
  // UI & Notifications
  toastMessage: string | null;
  showReportModal: boolean;
  
  // Actions
  setCurrentView: (view: ViewMode) => void;
  setActiveIsland: (islandId: string) => void;
  setActiveProblem: (problem: Problem) => void;
  setCurrentCode: (code: string) => void;
  setSelectedLanguage: (lang: string) => void;
  setLastAIFeedback: (feedback: AIFeedback | null) => void;
  
  // Gamification Actions
  addXP: (amount: number) => void;
  captureTerritory: (islandId: string, territoryId: string) => void;
  updateAdaptiveDifficulty: (success: boolean) => void;
  
  // Multiplayer Clash Actions
  joinClashRoom: (roomId?: string) => void;
  togglePlayerReady: () => void;
  captureClashTerritory: (territoryId: string) => void;
  leaveClashRoom: () => void;
  
  // Courses & Badges
  addCourse: (course: Course) => void;
  showToast: (msg: string) => void;
  clearToast: () => void;
  setShowReportModal: (show: boolean) => void;
}

export const useStore = create<AppState>((set, get) => ({
  currentView: 'dashboard',
  user: INITIAL_USER_PROFILE,
  islands: INITIAL_ISLANDS,
  problems: MOCK_PROBLEMS,
  badges: MOCK_BADGES,
  leaderboard: MOCK_LEADERBOARD,
  courses: MOCK_COURSES,
  
  activeIslandId: 'python-shores',
  activeProblem: MOCK_PROBLEMS[0],
  currentCode: MOCK_PROBLEMS[0].starterCode['Python'],
  selectedLanguage: 'Python',
  activeClashRoom: null,
  lastAIFeedback: null,
  
  toastMessage: null,
  showReportModal: false,
  
  setCurrentView: (view) => set({ currentView: view }),
  
  setActiveIsland: (islandId) => set({ activeIslandId: islandId }),
  
  setActiveProblem: (problem) => {
    const lang = get().selectedLanguage;
    set({
      activeProblem: problem,
      currentCode: problem.starterCode[lang] || problem.starterCode['Python'] || '',
    });
  },
  
  setCurrentCode: (code) => set({ currentCode: code }),
  
  setSelectedLanguage: (lang) => {
    const prob = get().activeProblem;
    set({
      selectedLanguage: lang,
      currentCode: prob?.starterCode[lang] || get().currentCode,
    });
  },
  
  setLastAIFeedback: (feedback) => set({ lastAIFeedback: feedback }),
  
  addXP: (amount) => {
    set((state) => {
      const newXp = state.user.xp + amount;
      let newLevel = state.user.level;
      let newNextXp = state.user.nextLevelXp;
      
      if (newXp >= newNextXp) {
        newLevel += 1;
        newNextXp += 1000;
        get().showToast(`🎉 Level Up! You reached Level ${newLevel}!`);
      } else {
        get().showToast(`+${amount} XP Earned!`);
      }
      
      return {
        user: {
          ...state.user,
          xp: newXp,
          level: newLevel,
          nextLevelXp: newNextXp,
          problemsSolved: {
            ...state.user.problemsSolved,
            total: state.user.problemsSolved.total + 1,
          },
        },
      };
    });
  },
  
  captureTerritory: (islandId, territoryId) => {
    set((state) => {
      const updatedIslands = state.islands.map((isl) => {
        if (isl.id !== islandId) return isl;
        
        let newlyCapturedCount = 0;
        const updatedTerritories = isl.territories.map((ter) => {
          if (ter.id === territoryId) {
            newlyCapturedCount++;
            return { ...ter, status: 'captured' as const, capturedByPlayerId: state.user.id };
          }
          // Unlock connected territories if they were locked
          if (ter.connectedTerritoryIds.includes(territoryId) && ter.status === 'locked') {
            return { ...ter, status: 'available' as const };
          }
          return ter;
        });
        
        const capturedSum = updatedTerritories.filter((t) => t.status === 'captured').length;
        return {
          ...isl,
          capturedTerritories: capturedSum,
          progress: `${capturedSum}/${isl.totalTerritories}`,
          territories: updatedTerritories,
        };
      });
      
      return { islands: updatedIslands };
    });
    get().showToast('⚔️ Territory Conquered! Map Progress Updated!');
  },
  
  updateAdaptiveDifficulty: (success) => {
    set((state) => {
      const current = state.user.adaptiveDifficulty;
      const step = success ? 0.2 : -0.1;
      const nextDiff = Math.min(10, Math.max(1.0, Math.round((current + step) * 10) / 10));
      return {
        user: {
          ...state.user,
          adaptiveDifficulty: nextDiff,
        },
      };
    });
  },
  
  joinClashRoom: (roomId = '#A7F3') => {
    const room: ClashRoom = {
      id: roomId,
      name: 'Algorithm Atoll Battleground',
      islandName: 'Algorithm Atoll',
      status: 'waiting',
      maxPlayers: 8,
      timeRemainingSeconds: 512,
      currentPlayers: [
        { id: 'user_alex', username: 'You (Alex)', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', isReady: true, score: 360, capturedCount: 3, totalTerritories: 5, currentTerritoryId: 'at1', color: '#4cd7f6', isCurrentUser: true },
        { id: 'u1', username: 'ShadowCoder', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', isReady: true, score: 240, capturedCount: 2, totalTerritories: 5, currentTerritoryId: 'at2', color: '#d0bcff' },
        { id: 'u2', username: 'ByteQueen', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', isReady: true, score: 120, capturedCount: 1, totalTerritories: 5, currentTerritoryId: 'at3', color: '#4edea3' },
        { id: 'u3', username: 'LogicBeast', avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80', isReady: true, score: 120, capturedCount: 1, totalTerritories: 5, currentTerritoryId: 'at3', color: '#f59e0b' },
        { id: 'u4', username: 'DevRogue', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', isReady: true, score: 0, capturedCount: 0, totalTerritories: 5, currentTerritoryId: 'at1', color: '#ec4899' },
      ],
    };
    set({ activeClashRoom: room, currentView: 'island-clash' });
    get().showToast(`⚔️ Joined Clash Room ${roomId}!`);
  },
  
  togglePlayerReady: () => {
    set((state) => {
      if (!state.activeClashRoom) return state;
      const updatedPlayers = state.activeClashRoom.currentPlayers.map((p) =>
        p.isCurrentUser ? { ...p, isReady: !p.isReady } : p
      );
      return {
        activeClashRoom: {
          ...state.activeClashRoom,
          currentPlayers: updatedPlayers,
        },
      };
    });
  },
  
  captureClashTerritory: (territoryId) => {
    set((state) => {
      if (!state.activeClashRoom) return state;
      const updatedPlayers = state.activeClashRoom.currentPlayers.map((p) => {
        if (p.isCurrentUser) {
          return {
            ...p,
            capturedCount: p.capturedCount + 1,
            score: p.score + 120,
          };
        }
        return p;
      });
      return {
        activeClashRoom: {
          ...state.activeClashRoom,
          currentPlayers: updatedPlayers,
        },
      };
    });
    get().showToast('⚔️ Clash Territory Captured! +120 Score!');
  },
  
  leaveClashRoom: () => {
    set({ activeClashRoom: null, currentView: 'island-world' });
    get().showToast('Left Clash room.');
  },
  
  addCourse: (course) => {
    set((state) => ({ courses: [course, ...state.courses] }));
    get().showToast('📚 New Custom AI Course Added!');
  },
  
  showToast: (msg) => set({ toastMessage: msg }),
  clearToast: () => set({ toastMessage: null }),
  setShowReportModal: (show) => set({ showReportModal: show }),
}));
