export type ViewMode = 
  | 'dashboard' 
  | 'island-world' 
  | 'island-clash' 
  | 'practice-lab' 
  | 'ai-mentor' 
  | 'courses' 
  | 'leaderboard' 
  | 'profile' 
  | 'settings';

export interface UserProfile {
  id: string;
  username: string;
  avatarUrl: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  streakDays: number;
  adaptiveDifficulty: number; // 1 to 10
  problemsSolved: {
    total: number;
    easy: number;
    medium: number;
    hard: number;
  };
  badgesCount: number;
  currentIslandId: string;
  topicStrengths: Record<string, number>; // topic -> 0-100%
  topicWeaknesses: string[];
}

export interface Territory {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  difficultyValue: number;
  status: 'locked' | 'available' | 'in_progress' | 'captured';
  capturedByPlayerId?: string;
  connectedTerritoryIds: string[];
  x: number; // SVG percentage
  y: number;
  problemId: string;
  branchLevel?: number;
  icon?: string;
}

export interface Island {
  id: string;
  name: string;
  description: string;
  icon: string;
  image?: string;
  unlocked: boolean;
  progress: string; // e.g. "0/5"
  totalTerritories: number;
  capturedTerritories: number;
  territories: Territory[];
  bgColor: string;
  accentColor: string;
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isSecret?: boolean;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  difficultyValue: number;
  topic: string;
  language: string;
  description: string;
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  starterCode: Record<string, string>; // lang -> code
  testCases: TestCase[];
  points: number;
}

export interface ExecutionResult {
  passed: boolean;
  totalTests: number;
  passedCount: number;
  logs: string[];
  testDetails: {
    testId: string;
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
  }[];
  executionTimeMs: number;
  memoryKb?: number;
  error?: string;
}

export interface AIFeedback {
  summary: string;
  mistakes: string[];
  improvements: string[];
  efficiency: {
    timeComplexity: string;
    spaceComplexity: string;
    suggestions: string;
  };
  recommendedTopic: string;
  nextSteps: string;
}

export interface ClashPlayer {
  id: string;
  username: string;
  avatarUrl: string;
  isReady: boolean;
  score: number;
  capturedCount: number;
  totalTerritories: number;
  currentTerritoryId: string;
  color: string;
  isCurrentUser?: boolean;
}

export interface ClashRoom {
  id: string;
  name: string;
  islandName: string;
  status: 'waiting' | 'countdown' | 'active' | 'finished';
  maxPlayers: number;
  currentPlayers: ClashPlayer[];
  timeRemainingSeconds: number;
  winnerId?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  isCustom?: boolean;
  category: 'learning' | 'conquest' | 'streak' | 'special';
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  completed: boolean;
  topics: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  language: string;
  estimatedHours: number;
  modulesCount: number;
  lessonsCount: number;
  practiceProblemsCount: number;
  modules: CourseModule[];
  progressPercent: number;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  avatarUrl: string;
  score: number;
  xp: number;
  problemsSolved: number;
  streakDays: number;
  isCurrentUser?: boolean;
}
