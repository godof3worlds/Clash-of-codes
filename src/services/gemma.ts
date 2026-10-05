import { AIFeedback, Course, Problem, UserProfile } from '../types';

const env = (import.meta as any).env || {};
const GEMMA_API_KEY = env.VITE_GEMMA_API_KEY || '';

export async function callGeminiApi(prompt: string, systemInstruction?: string): Promise<string> {
  if (!GEMMA_API_KEY) {
    throw new Error('AI is offline: VITE_GEMMA_API_KEY is not configured.');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMMA_API_KEY}`;
  
  const body: any = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  };

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('AI API Error Response:', errText);
      throw new Error(`AI is offline (HTTP ${response.status})`);
    }

    const json = await response.json();
    const candidateText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('AI is offline: No response generated.');
    }
    return candidateText;
  } catch (err: any) {
    console.warn('AI call failure:', err.message);
    throw new Error('AI is offline');
  }
}

export async function generateAIProblem(
  topic: string = 'Arrays',
  difficulty: 'Easy' | 'Medium' | 'Hard' = 'Easy',
  language: string = 'Python'
): Promise<Problem> {
  const prompt = `Generate a coding problem on topic "${topic}" with difficulty "${difficulty}".
Output ONLY valid JSON without markdown fences matching this exact schema:
{
  "title": "Problem Title",
  "difficulty": "${difficulty}",
  "difficultyValue": ${difficulty === 'Hard' ? 3 : difficulty === 'Medium' ? 2 : 1},
  "topic": "${topic}",
  "language": "${language}",
  "description": "Clear problem description...",
  "constraints": ["1 <= n <= 10^5", "Time limit: 2.0s"],
  "examples": [{"input": "sample input", "output": "sample output", "explanation": "why"}],
  "starterCode": {
    "Python": "def solve(nums):\\n    # write code here\\n    pass\\n\\nprint(solve([1, 2]))",
    "JavaScript": "function solve(nums) {\\n  // write code here\\n}\\nconsole.log(solve([1, 2]));"
  },
  "testCases": [
    {"id": "tc1", "input": "[1, 2]", "expectedOutput": "3"},
    {"id": "tc2", "input": "[3, 4]", "expectedOutput": "7"}
  ],
  "points": ${difficulty === 'Hard' ? 200 : difficulty === 'Medium' ? 150 : 100}
}`;

  try {
    const raw = await callGeminiApi(prompt, 'You are an expert algorithms challenge designer for a gamified coding platform.');
    const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return {
      ...parsed,
      id: `ai_gen_${Date.now()}`,
    };
  } catch (err: any) {
    // If AI offline, throw explicit error
    throw new Error('AI is offline');
  }
}

export async function analyzeCodeWithGemma(
  problem: Problem,
  userCode: string,
  passed: boolean
): Promise<AIFeedback> {
  const prompt = `Review this ${problem.language} code for problem "${problem.title}". Test pass status: ${passed ? 'PASSED' : 'FAILED'}.
User Code:
${userCode}

Return ONLY valid JSON matching this schema:
{
  "summary": "Brief analysis summary",
  "mistakes": ["mistake 1 if any"],
  "improvements": ["improvement 1", "improvement 2"],
  "efficiency": {
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "suggestions": "Efficiency notes"
  },
  "recommendedTopic": "${problem.topic}",
  "nextSteps": "Next practice recommendation"
}`;

  try {
    const raw = await callGeminiApi(prompt, 'You are a code analysis and optimization engine.');
    const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    // Return offline notice if AI is unavailable
    return {
      summary: 'AI is offline. Unable to generate real-time feedback at this moment.',
      mistakes: ['AI is offline: Check internet connection or API status.'],
      improvements: ['Verify edge cases and syntax manually while offline.'],
      efficiency: {
        timeComplexity: 'Offline',
        spaceComplexity: 'Offline',
        suggestions: 'AI is offline.',
      },
      recommendedTopic: problem.topic,
      nextSteps: 'Continue practicing with offline test cases.',
    };
  }
}

export async function askAIMentor(
  question: string,
  userProfile: UserProfile,
  assistanceLevel: number = 1
): Promise<string> {
  const prompt = `User Profile (Level ${userProfile.level}, XP ${userProfile.xp}, Streak: ${userProfile.streakDays}).
User Question: "${question}"
Assistance Level Hint (1 = Socratic hint, 3 = code explanation). Provide a helpful concise answer formatted with markdown.`;

  try {
    return await callGeminiApi(prompt, 'You are CodeConquer AI Mentor, an encouraging coding sensei.');
  } catch (err) {
    return 'AI is offline. Please check your network connection or API key configuration.';
  }
}

export async function generateAICourse(
  topic: string,
  level: string,
  language: string,
  timeCommitment: string
): Promise<Course> {
  const prompt = `Generate a structured coding course for topic "${topic}", skill level "${level}", language "${language}", commit "${timeCommitment}".
Return ONLY valid JSON:
{
  "title": "Course Title",
  "description": "Short description",
  "level": "${level}",
  "language": "${language}",
  "estimatedHours": 10,
  "modulesCount": 4,
  "lessonsCount": 16,
  "practiceProblemsCount": 30,
  "progressPercent": 0,
  "modules": [
    {
      "id": "m1",
      "title": "Module 1: Title",
      "description": "Module description",
      "durationMinutes": 45,
      "completed": false,
      "topics": ["Topic 1", "Topic 2"]
    }
  ]
}`;

  try {
    const raw = await callGeminiApi(prompt, 'You are an educational syllabus architect.');
    const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return {
      ...parsed,
      id: `course_ai_${Date.now()}`,
    };
  } catch (err) {
    throw new Error('AI is offline');
  }
}
