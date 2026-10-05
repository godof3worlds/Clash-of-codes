import { createClient } from '@supabase/supabase-js';
import { Island, Problem, Course, LeaderboardEntry, Territory } from '../types';

const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://shdywfzoqhsbjflqgpab.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchDbIslands(): Promise<Island[]> {
  try {
    const { data: islandsData, error: islandsError } = await supabase
      .from('islands')
      .select('*')
      .order('required_level', { ascending: true });

    if (islandsError || !islandsData || islandsData.length === 0) {
      return [];
    }

    const { data: territoriesData } = await supabase
      .from('territories')
      .select('*')
      .order('order_index', { ascending: true });

    return islandsData.map((isl) => {
      const filtered = (territoriesData || []).filter((t) => t.island_id === isl.id);
      const islandTerritories: Territory[] = filtered.map((t, idx) => {
        const nextId = filtered[idx + 1]?.id || '';
        return {
          id: t.id,
          name: t.title || t.topic || `Territory ${idx + 1}`,
          difficulty: (t.difficulty as 'Easy' | 'Medium' | 'Hard') || 'Easy',
          difficultyValue: t.difficulty === 'Hard' ? 3 : t.difficulty === 'Medium' ? 2 : 1,
          status: (idx === 0 ? 'available' : 'locked') as 'locked' | 'available' | 'in_progress' | 'captured',
          connectedTerritoryIds: nextId ? [nextId] : [],
          x: 15 + Math.min(75, idx * 18),
          y: idx === 0 || idx === filtered.length - 1 ? 50 : idx % 2 === 1 ? 25 : 75,
          problemId: t.problem_id || 'prob_two_sum',
        };
      });

      const total = islandTerritories.length || isl.total_territories || 5;
      const captured = islandTerritories.filter((t) => t.status === 'captured').length;

      return {
        id: isl.id,
        name: isl.name,
        description: isl.description || '',
        icon: isl.id.includes('loop') ? 'cached' : isl.id.includes('array') ? 'layers' : isl.id.includes('recursion') ? 'all_inclusive' : 'water_drop',
        image: `/assets/islands/${isl.id}.png`,
        unlocked: isl.required_level <= 1,
        progress: `${captured}/${total}`,
        totalTerritories: total,
        capturedTerritories: captured,
        territories: islandTerritories,
        bgColor: isl.bg_gradient || 'from-emerald-950/80 to-cyan-950/80',
        accentColor: isl.color || '#4edea3',
      };
    });
  } catch (err) {
    console.error('Error fetching islands from Supabase:', err);
    return [];
  }
}

export async function fetchDbLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, level, xp, streak_count')
      .order('xp', { ascending: false })
      .limit(20);

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map((p, idx) => ({
      rank: idx + 1,
      id: p.id,
      username: p.username || `Coder_${p.id.slice(0, 4)}`,
      avatarUrl: p.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      score: (p.xp || 0) * 10,
      xp: p.xp || 0,
      problemsSolved: Math.floor((p.xp || 0) / 100),
      streakDays: p.streak_count || 1,
      isCurrentUser: false,
    }));
  } catch (err) {
    console.error('Error fetching leaderboard from Supabase:', err);
    return [];
  }
}

export async function fetchDbProblems(): Promise<Problem[]> {
  try {
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map((p) => ({
      id: p.id,
      title: p.title,
      difficulty: (p.difficulty as 'Easy' | 'Medium' | 'Hard') || 'Easy',
      difficultyValue: p.difficulty === 'Hard' ? 3 : p.difficulty === 'Medium' ? 2 : 1,
      topic: p.category || 'Algorithms',
      language: 'Python',
      description: p.description || '',
      constraints: ['Time limit: 2.0s', 'Memory limit: 128MB'],
      examples: [],
      starterCode: p.initial_code || { Python: '# write code here' },
      testCases: p.test_cases || [],
      points: 100,
    }));
  } catch (err) {
    console.error('Error fetching problems from Supabase:', err);
    return [];
  }
}

export async function fetchDbCourses(): Promise<Course[]> {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map((c) => ({
      id: c.id,
      title: c.title,
      description: `Course generated for ${c.topic || 'Coding'}`,
      level: c.target_skill_level || 'Beginner',
      language: 'Python',
      estimatedHours: 4,
      modulesCount: (c.modules || []).length,
      lessonsCount: (c.modules || []).length * 3,
      practiceProblemsCount: (c.modules || []).length * 2,
      modules: c.modules || [],
      progressPercent: c.progress || 0,
    }));
  } catch (err) {
    console.error('Error fetching courses from Supabase:', err);
    return [];
  }
}

export async function saveDbSubmission(
  problemId: string,
  code: string,
  language: string,
  status: string,
  passedTests: number,
  totalTests: number,
  aiFeedback?: any
) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('submissions').insert({
      user_id: user.id,
      problem_id: problemId,
      code,
      language,
      status,
      passed_tests: passedTests,
      total_tests: totalTests,
      ai_feedback: aiFeedback,
    });
  } catch (err) {
    console.warn('Could not save submission to Supabase:', err);
  }
}

export async function saveDbCourse(course: Course) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('courses').insert({
      user_id: user.id,
      title: course.title,
      topic: course.language,
      target_skill_level: course.level,
      progress: course.progressPercent,
      modules: course.modules,
    });
  } catch (err) {
    console.warn('Could not save course to Supabase:', err);
  }
}
