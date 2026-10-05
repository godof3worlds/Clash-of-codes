import { AIFeedback, Course, Problem, UserProfile } from '../types';

export async function analyzeCodeWithGemma(
  problem: Problem,
  userCode: string,
  passed: boolean
): Promise<AIFeedback> {
  // Simulates Gemma 4 LLM analysis of code logic, complexity, mistakes, and suggestions
  return new Promise((resolve) => {
    setTimeout(() => {
      if (passed) {
        resolve({
          summary: `Your ${problem.language} solution for "${problem.title}" correctly solves the problem using an optimal hash-map or two-pointer approach!`,
          mistakes: [],
          improvements: [
            'Consider adding explicit type annotations to improve readability.',
            'Ensure variable names clearly describe their purpose (e.g. `numToIdx` instead of `m`).',
          ],
          efficiency: {
            timeComplexity: 'O(N)',
            spaceComplexity: 'O(N)',
            suggestions: 'Your algorithm runs in linear O(N) time complexity, which meets the optimal constraint requirement.',
          },
          recommendedTopic: 'Two Pointers & Sliding Window',
          nextSteps: 'You are ready to attempt Medium difficulty challenges in Algorithm Atoll!',
        });
      } else {
        resolve({
          summary: `Your code attempted to solve "${problem.title}", but failed on secret test cases or encountered a logic/boundary error.`,
          mistakes: [
            'Off-by-one array index boundary check during iteration.',
            'Potential unhandled null/undefined value when target difference is missing.',
          ],
          improvements: [
            'Dry run your loop boundary using a small sample array like `[2, 7]`.',
            'Initialize hash keys before querying to avoid KeyErrors.',
          ],
          efficiency: {
            timeComplexity: 'O(N^2)',
            spaceComplexity: 'O(1)',
            suggestions: 'Nested loop scanning leads to O(N^2) time complexity. Using a Hash Set reduces lookup to O(1).',
          },
          recommendedTopic: 'Array Indexing & Hash Map Basics',
          nextSteps: 'Try practicing 2 Easy array problems before retrying this territory!',
        });
      }
    }, 700);
  });
}

export async function askAIMentor(
  question: string,
  userProfile: UserProfile,
  assistanceLevel: number = 1
): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lower = question.toLowerCase();
      if (lower.includes('recursion') || lower.includes('recurse')) {
        resolve(
          `🧙 **AI Mentor (Level ${assistanceLevel} Hint):**\n\nRecursion relies on two core parts:\n1. **Base Case:** The stopping condition that prevents infinite call stacks.\n2. **Recursive Step:** Reducing the problem to a smaller sub-problem.\n\n*Suggestion:* Start by writing \`if n <= 1: return n\` first!`
        );
      } else if (lower.includes('next') || lower.includes('study') || lower.includes('recommend')) {
        resolve(
          `🧙 **AI Mentor Learning Recommendation:**\n\nBased on your recent 12-day streak and 85% score in Arrays:\n1. **Topic to Revise:** Recursion & Linked Lists (Current Strength: 45%).\n2. **Target Island:** Conquer **Territory 4: Function Fort** in Python Shores.\n3. **Recommended Course:** Module 4 in *Data Structures & Algorithms* course!`
        );
      } else {
        resolve(
          `🧙 **AI Mentor:**\n\nGreat question! In programming, breaking down complex requirements into smaller testable functions is key. To conquer your next territory, focus on maintaining clean O(N) linear time complexity!`
        );
      }
    }, 600);
  });
}

export async function generateAICourse(
  topic: string,
  level: string,
  language: string,
  timeCommitment: string
): Promise<Course> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `course_gen_${Date.now()}`,
        title: `Custom Course: ${topic} (${level})`,
        description: `AI-generated personalized learning path for ${topic} in ${language} designed for ${timeCommitment}/week.`,
        level,
        language,
        estimatedHours: 12,
        modulesCount: 5,
        lessonsCount: 25,
        practiceProblemsCount: 50,
        progressPercent: 0,
        modules: [
          { id: 'cm1', title: `1. Fundamentals of ${topic}`, description: `Core concepts, syntax, and foundational patterns in ${language}.`, durationMinutes: 45, completed: false, topics: ['Syntax', 'Variables', 'Logic'] },
          { id: 'cm2', title: `2. Intermediate Patterns & Optimization`, description: 'Common algorithmic patterns, edge-case handling, and performance tuning.', durationMinutes: 60, completed: false, topics: ['Pointers', 'Hash Maps'] },
          { id: 'cm3', title: '3. Real-World Applications & Kata', description: 'Interactive problem-solving challenges matching interview standards.', durationMinutes: 90, completed: false, topics: ['Problem Solving', 'Unit Testing'] },
          { id: 'cm4', title: '4. Advanced Techniques & Complexity', description: 'Deep dive into space and time complexity optimizations.', durationMinutes: 75, completed: false, topics: ['Big-O', 'Refactoring'] },
          { id: 'cm5', title: '5. Capstone Assessment', description: 'Final island conquest challenge validating complete topic mastery.', durationMinutes: 120, completed: false, topics: ['Capstone', 'Assessment'] },
        ],
      });
    }, 1000);
  });
}

export async function performWebResearch(query: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        query,
        sources: [
          { title: 'Python Official Documentation - Data Structures', url: 'https://docs.python.org/3/tutorial/datastructures.html', summary: 'Covers lists, dictionaries, tuples, and built-in sequence operations.' },
          { title: 'GeeksforGeeks - Time and Space Complexity Analysis', url: 'https://www.geeksforgeeks.org/analysis-algorithms-big-o-analysis/', summary: 'Detailed walkthrough of Big-O, Big-Omega, and Big-Theta notations.' },
        ],
        sanitizedContent: `Web Research Summary for "${query}":\n\nStandard algorithmic best practices recommend using Hash Sets for O(1) membership testing instead of array linear scans O(N). Always account for empty inputs and boundary conditions.`,
      });
    }, 800);
  });
}
