import { Island, Problem, Badge, LeaderboardEntry, UserProfile, Course } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'new_user_1',
  username: 'New Recruit',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
  level: 1,
  xp: 0,
  nextLevelXp: 500,
  streakDays: 0,
  adaptiveDifficulty: 1.0,
  problemsSolved: {
    total: 0,
    easy: 0,
    medium: 0,
    hard: 0,
  },
  badgesCount: 0,
  currentIslandId: 'python-shores',
  topicStrengths: {},
  topicWeaknesses: [],
};

export const INITIAL_ISLANDS: Island[] = [
  {
    id: 'python-shores',
    name: 'Python Shores',
    description: 'Master the fundamentals of variables, loops, arrays and basic functions.',
    icon: 'water_drop',
    unlocked: true,
    progress: '0/5',
    totalTerritories: 5,
    capturedTerritories: 0,
    bgColor: 'from-emerald-950/60 to-cyan-950/60',
    accentColor: '#4edea3',
    territories: [
      { id: 't1', name: 'Territory 1: Variable Cove', difficulty: 'Easy', difficultyValue: 1, status: 'available', connectedTerritoryIds: ['t2', 't3'], x: 20, y: 70, problemId: 'prob_two_sum' },
      { id: 't2', name: 'Territory 2: Loop Lagoon', difficulty: 'Easy', difficultyValue: 2, status: 'locked', connectedTerritoryIds: ['t1', 't4'], x: 40, y: 50, problemId: 'prob_valid_anagram' },
      { id: 't3', name: 'Territory 3: Array Atoll', difficulty: 'Easy', difficultyValue: 2, status: 'locked', connectedTerritoryIds: ['t1', 't4'], x: 50, y: 80, problemId: 'prob_contains_duplicate' },
      { id: 't4', name: 'Territory 4: Function Fort', difficulty: 'Medium', difficultyValue: 3, status: 'locked', connectedTerritoryIds: ['t2', 't3', 't5'], x: 70, y: 45, problemId: 'prob_buy_sell_stock' },
      { id: 't5', name: 'Territory 5: Master Citadel', difficulty: 'Medium', difficultyValue: 4, status: 'locked', connectedTerritoryIds: ['t4'], x: 88, y: 30, problemId: 'prob_product_except_self' },
    ],
  },
  {
    id: 'algorithm-atoll',
    name: 'Algorithm Atoll',
    description: 'Conquer search algorithms, sorting algorithms, and hash tables.',
    icon: 'terrain',
    unlocked: false,
    progress: '0/5',
    totalTerritories: 5,
    capturedTerritories: 0,
    bgColor: 'from-indigo-950/60 to-purple-950/60',
    accentColor: '#4cd7f6',
    territories: [
      { id: 'at1', name: 'Territory 1: Binary Bay', difficulty: 'Easy', difficultyValue: 2, status: 'locked', connectedTerritoryIds: ['at2', 'at3'], x: 15, y: 65, problemId: 'prob_binary_search' },
      { id: 'at2', name: 'Territory 2: Hash Haven', difficulty: 'Medium', difficultyValue: 3, status: 'locked', connectedTerritoryIds: ['at1', 'at4'], x: 42, y: 35, problemId: 'prob_valid_anagram' },
      { id: 'at3', name: 'Territory 3: Sorting Sands', difficulty: 'Medium', difficultyValue: 3, status: 'locked', connectedTerritoryIds: ['at1', 'at4'], x: 45, y: 75, problemId: 'prob_buy_sell_stock' },
      { id: 'at4', name: 'Territory 4: Two-Pointer Ridge', difficulty: 'Medium', difficultyValue: 4, status: 'locked', connectedTerritoryIds: ['at2', 'at3', 'at5'], x: 72, y: 50, problemId: 'prob_two_sum' },
      { id: 'at5', name: 'Territory 5: Algorithmic Peak', difficulty: 'Hard', difficultyValue: 5, status: 'locked', connectedTerritoryIds: ['at4'], x: 90, y: 25, problemId: 'prob_product_except_self' },
    ],
  },
  {
    id: 'data-forest',
    name: 'Data Forest',
    description: 'Navigate through Linked Lists, Stacks, Queues, and Trees.',
    icon: 'park',
    unlocked: false,
    progress: '0/5',
    totalTerritories: 5,
    capturedTerritories: 0,
    bgColor: 'from-amber-950/60 to-orange-950/60',
    accentColor: '#f59e0b',
    territories: [
      { id: 'df1', name: 'Territory 1: Stack Grove', difficulty: 'Medium', difficultyValue: 3, status: 'locked', connectedTerritoryIds: ['df2'], x: 20, y: 70, problemId: 'prob_valid_anagram' },
      { id: 'df2', name: 'Territory 2: Queue Clearing', difficulty: 'Medium', difficultyValue: 4, status: 'locked', connectedTerritoryIds: ['df1', 'df3'], x: 45, y: 50, problemId: 'prob_contains_duplicate' },
      { id: 'df3', name: 'Territory 3: Tree Canopy', difficulty: 'Hard', difficultyValue: 5, status: 'locked', connectedTerritoryIds: ['df2'], x: 80, y: 30, problemId: 'prob_two_sum' },
    ],
  },
  {
    id: 'graph-galaxy',
    name: 'Graph Galaxy',
    description: 'Master BFS, DFS, shortest paths, and complex network traversals.',
    icon: 'auto_awesome',
    unlocked: false,
    progress: '0/5',
    totalTerritories: 5,
    capturedTerritories: 0,
    bgColor: 'from-pink-950/60 to-purple-950/60',
    accentColor: '#ec4899',
    territories: [],
  },
];

export const MOCK_PROBLEMS: Problem[] = [
  {
    id: 'prob_two_sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    difficultyValue: 1,
    topic: 'Arrays',
    language: 'Python',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`. You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    examples: [
      { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]' },
    ],
    starterCode: {
      Python: `def twoSum(nums, target):\n    # Write your solution here\n    hashmap = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in hashmap:\n            return [hashmap[diff], i]\n        hashmap[num] = i\n    return []\n\n# Example execution\nprint(twoSum([2, 7, 11, 15], 9))\n`,
      JavaScript: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}\n\nconsole.log(twoSum([2, 7, 11, 15], 9));\n`,
    },
    testCases: [
      { id: 'tc1', input: '[2, 7, 11, 15]\n9', expectedOutput: '[0, 1]' },
      { id: 'tc2', input: '[3, 2, 4]\n6', expectedOutput: '[1, 2]' },
      { id: 'tc3', input: '[3, 3]\n6', expectedOutput: '[0, 1]', isSecret: true },
    ],
    points: 100,
  },
  {
    id: 'prob_buy_sell_stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Medium',
    difficultyValue: 3,
    topic: 'Arrays',
    language: 'Python',
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the i-th day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.`,
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4',
    ],
    examples: [
      { input: 'prices = [7, 1, 5, 3, 6, 4]', output: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.' },
      { input: 'prices = [7, 6, 4, 3, 1]', output: '0', explanation: 'In this case, no transactions are done and max profit = 0.' },
    ],
    starterCode: {
      Python: `def maxProfit(prices):\n    min_price = float('inf')\n    max_profit = 0\n    for price in prices:\n        if price < min_price:\n            min_price = price\n        elif price - min_price > max_profit:\n            max_profit = price - min_price\n    return max_profit\n\nprint(maxProfit([7, 1, 5, 3, 6, 4]))\n`,
      JavaScript: `function maxProfit(prices) {\n  let minPrice = Infinity;\n  let maxProfit = 0;\n  for (let price of prices) {\n    if (price < minPrice) minPrice = price;\n    else if (price - minPrice > maxProfit) maxProfit = price - minPrice;\n  }\n  return maxProfit;\n}\nconsole.log(maxProfit([7, 1, 5, 3, 6, 4]));\n`,
    },
    testCases: [
      { id: 'tc1', input: '[7, 1, 5, 3, 6, 4]', expectedOutput: '5' },
      { id: 'tc2', input: '[7, 6, 4, 3, 1]', expectedOutput: '0' },
    ],
    points: 150,
  },
  {
    id: 'prob_product_except_self',
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    difficultyValue: 4,
    topic: 'Arrays',
    language: 'Python',
    description: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all the elements of \`nums\` except \`nums[i]\`. You must write an algorithm that runs in O(n) time and without using the division operation.`,
    constraints: [
      '2 <= nums.length <= 10^5',
      '-30 <= nums[i] <= 30',
    ],
    examples: [
      { input: 'nums = [1, 2, 3, 4]', output: '[24, 12, 8, 6]' },
    ],
    starterCode: {
      Python: `def productExceptSelf(nums):\n    res = [1] * len(nums)\n    prefix = 1\n    for i in range(len(nums)):\n        res[i] = prefix\n        prefix *= nums[i]\n    postfix = 1\n    for i in range(len(nums) - 1, -1, -1):\n        res[i] *= postfix\n        postfix *= nums[i]\n    return res\n\nprint(productExceptSelf([1, 2, 3, 4]))\n`,
      JavaScript: `function productExceptSelf(nums) {\n  const res = new Array(nums.length).fill(1);\n  let prefix = 1;\n  for (let i = 0; i < nums.length; i++) {\n    res[i] = prefix;\n    prefix *= nums[i];\n  }\n  let postfix = 1;\n  for (let i = nums.length - 1; i >= 0; i--) {\n    res[i] *= postfix;\n    postfix *= nums[i];\n  }\n  return res;\n}\nconsole.log(productExceptSelf([1, 2, 3, 4]));\n`,
    },
    testCases: [
      { id: 'tc1', input: '[1, 2, 3, 4]', expectedOutput: '[24, 12, 8, 6]' },
    ],
    points: 180,
  },
  {
    id: 'prob_valid_anagram',
    title: 'Valid Anagram',
    difficulty: 'Easy',
    difficultyValue: 1,
    topic: 'Strings',
    language: 'Python',
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.`,
    constraints: [
      '1 <= s.length, t.length <= 5 * 10^4',
      's and t consist of lowercase English letters.',
    ],
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: 'true' },
      { input: 's = "rat", t = "car"', output: 'false' },
    ],
    starterCode: {
      Python: `def isAnagram(s, t):\n    return sorted(s) == sorted(t)\n\nprint(isAnagram("anagram", "nagaram"))\n`,
      JavaScript: `function isAnagram(s, t) {\n  return s.split('').sort().join('') === t.split('').sort().join('');\n}\nconsole.log(isAnagram("anagram", "nagaram"));\n`,
    },
    testCases: [
      { id: 'tc1', input: '"anagram"\n"nagaram"', expectedOutput: 'true' },
      { id: 'tc2', input: '"rat"\n"car"', expectedOutput: 'false' },
    ],
    points: 100,
  },
  {
    id: 'prob_contains_duplicate',
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    difficultyValue: 1,
    topic: 'Arrays',
    language: 'Python',
    description: `Given an integer array \`nums\`, return \`true\` if any value appears at least twice in the array, and return \`false\` if every element is distinct.`,
    constraints: ['1 <= nums.length <= 10^5'],
    examples: [
      { input: 'nums = [1, 2, 3, 1]', output: 'true' },
      { input: 'nums = [1, 2, 3, 4]', output: 'false' },
    ],
    starterCode: {
      Python: `def containsDuplicate(nums):\n    return len(nums) != len(set(nums))\n\nprint(containsDuplicate([1, 2, 3, 1]))\n`,
      JavaScript: `function containsDuplicate(nums) {\n  return new Set(nums).size !== nums.length;\n}\nconsole.log(containsDuplicate([1, 2, 3, 1]));\n`,
    },
    testCases: [
      { id: 'tc1', input: '[1, 2, 3, 1]', expectedOutput: 'true' },
      { id: 'tc2', input: '[1, 2, 3, 4]', expectedOutput: 'false' },
    ],
    points: 90,
  },
  {
    id: 'prob_binary_search',
    title: 'Binary Search',
    difficulty: 'Easy',
    difficultyValue: 2,
    topic: 'Algorithms',
    language: 'Python',
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`. You must write an algorithm with O(log n) runtime complexity.`,
    constraints: [
      '1 <= nums.length <= 10^4',
      'All integers in nums are unique.',
    ],
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' },
    ],
    starterCode: {
      Python: `def search(nums, target):\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        m = (l + r) // 2\n        if nums[m] == target:\n            return m\n        elif nums[m] < target:\n            l = m + 1\n        else:\n            r = m - 1\n    return -1\n\nprint(search([-1, 0, 3, 5, 9, 12], 9))\n`,
      JavaScript: `function search(nums, target) {\n  let l = 0, r = nums.length - 1;\n  while (l <= r) {\n    let m = Math.floor((l + r) / 2);\n    if (nums[m] === target) return m;\n    if (nums[m] < target) l = m + 1;\n    else r = m - 1;\n  }\n  return -1;\n}\nconsole.log(search([-1, 0, 3, 5, 9, 12], 9));\n`,
    },
    testCases: [
      { id: 'tc1', input: '[-1, 0, 3, 5, 9, 12]\n9', expectedOutput: '4' },
      { id: 'tc2', input: '[-1, 0, 3, 5, 9, 12]\n2', expectedOutput: '-1' },
    ],
    points: 110,
  },
];

export const MOCK_BADGES: Badge[] = [];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [];

export const MOCK_COURSES: Course[] = [];
