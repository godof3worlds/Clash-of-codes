# CodeConquer --- Complete AI Build Prompt & Product Specification

## 0. How to use this document

This document is the **single source of truth** for generating the
CodeConquer application with an AI coding agent such as Antigravity,
Cursor, Claude Code, Gemini, or another full-stack code-generation tool.

Build the application in modules, but **do not remove any feature
described here**. If a feature is too large for one generation pass,
implement a clean MVP version with the correct architecture and leave
extension points rather than replacing it with a fake/static
implementation.

The uploaded UI reference image is the visual direction: a **dark
fantasy / pixel-art coding world**, with deep navy backgrounds, glowing
panels, colorful island artwork, rounded cards, compact game HUDs, and
readable coding interfaces.

------------------------------------------------------------------------

# 1. Product identity

## Product name

**CodeConquer**

## Problem statement

Create a gamified learning platform focused specifically on **learning
to code**.

Traditional coding-learning platforms can feel like a sequence of
disconnected exercises. CodeConquer turns learning into a persistent
world:

-   users explore islands,
-   unlock territories,
-   solve coding challenges,
-   practice independently,
-   compete in multiplayer Clash matches,
-   earn XP and badges,
-   receive AI-generated feedback,
-   get adaptive difficulty,
-   receive AI mentor recommendations,
-   generate personalized courses,
-   and learn from AI-curated documentation.

The primary purpose is **learning programming**. Gamification should
make learning engaging and motivating, not exploit attention or
encourage unhealthy compulsive use.

------------------------------------------------------------------------

# 2. Core product loop

The main learning loop is:

**LEARN → PRACTICE → CLASH → CODE → EXECUTE → SOLVE → CAPTURE → AI
FEEDBACK → ADAPT → IMPROVE**

A typical user journey:

1.  Register/login.
2.  Complete an optional skill assessment.
3.  Receive an initial learner profile.
4.  Enter the dashboard.
5.  Explore the island world.
6.  Select Practice or Clash.
7.  Receive a coding problem.
8.  Write code in the editor.
9.  Execute code using JDoodle.
10. If correct, unlock/capture the appropriate territory.
11. AI analyzes the submitted code.
12. Show:

-   what the code does,
-   what was done well,
-   bugs/mistakes,
-   possible improvements,
-   efficiency suggestions,
-   time/space complexity,
-   recommended concepts.

13. Update learner mastery and adaptive difficulty.
14. Earn XP/rewards.
15. AI Mentor recommends the next topic.
16. User can continue practicing, enter another Clash, or generate a
    custom course.

------------------------------------------------------------------------

# 3. Visual/UI direction

Use the uploaded reference image as the main visual inspiration.

## Visual style

-   Dark fantasy coding world.
-   Deep navy / midnight backgrounds.
-   Pixel-art or stylized low-poly island illustrations.
-   Glowing cyan, mint, purple, blue, orange, and pink accents.
-   Rounded glassy/dark panels.
-   Subtle borders and glow.
-   Small fantasy characters/avatars.
-   Island maps with territories.
-   Coding UI should remain highly readable.
-   Use bright accent colors for states rather than making the entire
    interface bright.
-   Use tasteful motion and micro-interactions.
-   Avoid excessive flashing, seizure-inducing effects, or manipulative
    infinite-reward mechanics.

## Suggested palette

-   Background: #06111F / #081426
-   Panel: #0B1A2E
-   Panel elevated: #10233D
-   Primary cyan/mint: #4DE3B2
-   Secondary blue: #4DA3FF
-   Purple: #A875FF
-   Gold: #FFC857
-   Error: #FF6B6B
-   Text: #EAF4FF
-   Muted text: #8FA7C2

Allow themes to be centralized in CSS variables.

## Typography

Use a modern readable UI font such as:

-   Inter / Space Grotesk for UI.
-   JetBrains Mono for code.

------------------------------------------------------------------------

# 4. Required technology stack

## Frontend

-   React
-   TypeScript
-   Vite
-   Tailwind CSS
-   shadcn/ui
-   Framer Motion
-   Monaco Editor
-   SVG/Canvas for the 2D island world
-   Zustand for client state
-   TanStack Query for server state
-   React Hook Form
-   Zod
-   Recharts for analytics

## Backend

-   Node.js
-   TypeScript
-   Express.js
-   REST API
-   Zod validation
-   Server-authoritative game logic

## Database / backend services

-   Supabase PostgreSQL
-   Supabase Auth
-   Supabase Row Level Security
-   Supabase Realtime

## AI

-   Gemma 4 / configured Gemma API endpoint

Important: keep the exact model ID and endpoint configurable through
environment variables because model/API identifiers can change.

## Code execution

-   JDoodle online compiler API
-   Client ID and Client Secret must remain server-side.

## Version control

-   Git
-   GitHub

------------------------------------------------------------------------

# 5. Environment variables

Create:

`.env.example`

with:

``` env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

GEMMA_API_KEY=
GEMMA_MODEL=
GEMMA_API_URL=

JDOODLE_CLIENT_ID=
JDOODLE_CLIENT_SECRET=

WEB_SEARCH_API_KEY=
WEB_SEARCH_API_URL=

APP_URL=
API_URL=
```

Never expose:

-   Supabase service role key
-   Gemma API key
-   JDoodle client secret
-   Web search API key

Never hard-code secrets.

Never commit `.env`.

Add to `.gitignore`:

``` gitignore
.env
.env.local
.env.*.local
```

Commit only `.env.example`.

------------------------------------------------------------------------

# 6. Application pages

Create these major pages:

1.  Dashboard
2.  Island World
3.  Clash
4.  Clash Lobby
5.  Practice
6.  Problem View
7.  AI Mentor
8.  Course Generator
9.  Courses
10. Course Module
11. Leaderboard
12. Profile
13. Badges/Achievements
14. Settings
15. Authentication

------------------------------------------------------------------------

# 7. Dashboard

The dashboard should show:

-   User avatar
-   Username
-   Level
-   XP
-   XP progress
-   Current streak
-   Problems solved
-   Current adaptive difficulty
-   Current skill level
-   Current island
-   Island progress
-   Continue Clash/course button
-   Recent activity
-   Recent solved problems
-   Badges
-   AI Mentor recommendation
-   Weak topics
-   Recommended next practice
-   Course progress
-   Multiplayer status if currently in a room

Example dashboard card:

> **AI Mentor**
>
> Your array skills are improving. You struggled with two recursion
> problems recently.
>
> Recommended: 1. Recursion fundamentals 2. Call stack visualization 3.
> Easy → Medium recursion practice

------------------------------------------------------------------------

# 8. Island World

The island world is a major part of CodeConquer.

## Important correction

The island system must **NOT be a simple 1D level list**.

Each island is a **2D territory/pathway network**.

Players should visually explore a map containing:

-   regions
-   nodes
-   paths
-   intersections
-   locked territories
-   unlocked territories
-   captured territories
-   challenge territories
-   shortcuts
-   optional side paths
-   final objectives

Represent the map as a graph.

Example:

``` text
Start
  |
  +------ Territory A ------ Territory C
  |              |
  |              +------ Territory D
  |
  +------ Territory B ------ Territory E ------ Final Objective
```

Players do not necessarily have to complete every node.

------------------------------------------------------------------------

# 9. Example islands

Create example worlds:

-   Python Shores
-   Algorithm Atoll
-   Array Archipelago
-   Function Forest
-   Data Structure Dominion
-   Recursion Reef
-   Sorting Sands
-   Graph Galaxy
-   Dynamic Programming Depths

Each island should have:

-   name
-   description
-   topic
-   recommended skill level
-   visual artwork
-   territories
-   connections
-   difficulty range
-   completion percentage

------------------------------------------------------------------------

# 10. Territory model

Each territory represents a learning challenge.

Possible states:

``` text
LOCKED
AVAILABLE
IN_PROGRESS
CAPTURED
```

A territory may require:

-   previous territory
-   topic prerequisite
-   minimum learner level
-   previous challenge completion

MVP can use:

``` text
AVAILABLE
CAPTURED
```

but design the database so more states can be added.

------------------------------------------------------------------------

# 11. Clash system

Clash is the competitive multiplayer coding mode.

## Concept

Multiple players enter the same island and compete to conquer
territories by solving coding problems.

The competition should not simply reward who types fastest.

A valid capture requires:

1.  Player is in the active match.
2.  Player has access to the territory.
3.  Player receives the territory's challenge.
4.  Player submits code.
5.  Backend sends code to JDoodle.
6.  Required tests pass.
7.  Backend validates the attempt.
8.  Territory is atomically captured.
9.  Realtime event is broadcast.
10. Player receives score/XP according to the match rules.

------------------------------------------------------------------------

# 12. Multiplayer room

Room data:

-   room ID
-   room code
-   island ID
-   host ID
-   players
-   max players
-   match status
-   created time
-   start time
-   end time
-   match configuration

Statuses:

``` text
WAITING
COUNTDOWN
ACTIVE
FINISHED
CANCELLED
```

------------------------------------------------------------------------

# 13. Clash matchmaking

Support:

### Quick Match

Automatically find an appropriate active room.

### Create Room

User creates:

-   public/private room
-   island
-   max players
-   optional difficulty range

### Join Room

User enters a room code.

### Private Room

Generate a shareable room code/link.

------------------------------------------------------------------------

# 14. Clash lobby

Show:

-   island preview
-   island name
-   room code
-   player list
-   avatar
-   username
-   ready status
-   connection status
-   room settings
-   selected island
-   start countdown
-   host controls

Do not allow the client to bypass server match rules.

------------------------------------------------------------------------

# 15. Multiplayer communication

Use:

**Supabase Realtime**

Realtime events should include:

``` text
PLAYER_JOINED
PLAYER_LEFT
PLAYER_READY
MATCH_STARTED
PLAYER_MOVED
CHALLENGE_STARTED
CHALLENGE_SUBMITTED
TERRITORY_CAPTURED
PLAYER_DISCONNECTED
PLAYER_RECONNECTED
PLAYER_FINISHED
MATCH_FINISHED
```

Important architecture rule:

**Realtime is synchronization, not the permanent source of truth.**

Supabase PostgreSQL remains the persistent source of truth.

When a player reconnects:

1.  Fetch current match state from backend/database.
2.  Restore local state.
3.  Resubscribe to realtime updates.

------------------------------------------------------------------------

# 16. Server-authoritative multiplayer

Never allow the browser to directly decide:

-   score
-   territory ownership
-   winner
-   XP
-   match state
-   rewards
-   difficulty

The frontend only requests actions.

The backend validates them.

Example:

``` text
Frontend
   ↓
"Capture Territory 8"
   ↓
Backend
   ↓
Check room
Check player
Check territory
Check prerequisites
Run code
Validate tests
Atomic DB update
   ↓
Supabase Realtime
   ↓
All players
```

------------------------------------------------------------------------

# 17. Race-condition handling

Two players may solve the same territory almost simultaneously.

The database/backend must resolve this atomically.

Example:

``` text
Player A submits
Player B submits

A passes
B passes

Backend attempts territory claim

First valid transaction → CAPTURED
Second transaction → territory already captured
```

The client must never decide who won the race.

------------------------------------------------------------------------

# 18. Reconnection

Player states:

``` text
CONNECTED
DISCONNECTED
RECONNECTING
FINISHED
ELIMINATED
```

Temporary connection failure should not immediately punish a player.

Keep their legitimate captured territories.

If they reconnect before the configured timeout, restore their match
state.

------------------------------------------------------------------------

# 19. Match ending

A match can end when:

### Option A

A player captures the final objective.

### Option B

The timer expires.

If the timer expires, rank using:

1.  Valid territories captured
2.  Difficulty-weighted points
3.  Completed challenges
4.  Valid completion timestamp as a final tie-breaker

Do not make raw speed the only metric.

------------------------------------------------------------------------

# 20. Fair multiplayer scoring

Use:

``` text
Problem Points =
Base Points × Difficulty Multiplier
```

Example:

``` text
Easy   = 1.0×
Medium = 1.5×
Hard   = 2.2×
Expert = 3.0×
```

Add controlled bonuses for:

-   final objective
-   optional side territory
-   clean completion

Do not give unlimited points for repeated retries.

------------------------------------------------------------------------

# 21. Practice page

Practice must be a separate page from Clash.

Features:

-   Topic filter
-   Difficulty filter
-   Programming language filter
-   Search
-   AI-generated problems
-   Problem cards
-   Start problem
-   Code editor
-   Run
-   Submit
-   Test results
-   Hints
-   AI summary
-   AI feedback
-   Attempt history
-   Progress tracking

Practice is non-competitive.

------------------------------------------------------------------------

# 22. Coding editor

Use Monaco Editor.

Features:

-   language selector
-   syntax highlighting
-   line numbers
-   autocomplete
-   run
-   submit
-   reset
-   test cases
-   output
-   errors
-   execution time
-   memory if available
-   theme matching the application

The code editor must not expose JDoodle credentials.

------------------------------------------------------------------------

# 23. JDoodle integration

Flow:

``` text
Monaco
   ↓
Backend
   ↓
JDoodle
   ↓
Execution result
   ↓
Backend validation
   ↓
Problem result
   ↓
Frontend
```

Store credentials only in backend environment variables:

``` env
JDOODLE_CLIENT_ID=
JDOODLE_CLIENT_SECRET=
```

Add server-side protections:

-   maximum code size
-   execution timeout
-   output size limit
-   supported language allowlist
-   request rate limit
-   duplicate submission protection

Never execute arbitrary backend commands outside the approved compiler
service.

------------------------------------------------------------------------

# 24. AI-generated problems

Use Gemma for:

-   coding problem generation
-   explanations
-   hints
-   summaries
-   code feedback
-   topic recommendations
-   course generation

However:

**AI must not be the final authority for whether code passes.**

JDoodle execution + backend test validation is authoritative.

------------------------------------------------------------------------

# 25. Problem-generation pipeline

``` text
Learner profile
      ↓
Adaptive difficulty engine
      ↓
Topic + difficulty
      ↓
Gemma
      ↓
Problem schema validation
      ↓
Test case generation
      ↓
Reference solution
      ↓
JDoodle verification
      ↓
Difficulty validation
      ↓
Approved problem
```

Do not immediately publish raw AI output.

Validate:

-   problem statement
-   input/output
-   constraints
-   examples
-   test cases
-   expected outputs
-   reference solution
-   difficulty
-   language compatibility

------------------------------------------------------------------------

# 26. AI code analysis

After every meaningful submission, Gemma can produce:

### Code summary

What the code is doing.

### What went well

Positive aspects.

### Problems

Bugs, weak logic, unnecessary operations, edge-case issues.

### Improvements

How to make it clearer or more robust.

### Efficiency

Possible time/space improvements.

### Complexity

Example:

``` text
Current:
O(n²)

Possible:
O(n)
```

### Learning recommendation

Example:

> Review hash maps before attempting the next medium array challenge.

AI feedback should be structured JSON before being rendered.

------------------------------------------------------------------------

# 27. Adaptive difficulty

Difficulty should range from:

``` text
1 → 10
```

Do not change difficulty dramatically after one failed question.

Maintain a rolling learner performance signal.

Example conceptual performance score:

``` text
P =
0.35 × correctness
+ 0.20 × recent_success
+ 0.15 × topic_mastery
+ 0.10 × efficiency
+ 0.10 × consistency
+ 0.10 × independent_completion
```

Where:

-   correctness = test success
-   recent_success = recent rolling success rate
-   topic_mastery = mastery estimate for that topic
-   efficiency = normalized execution/solution efficiency
-   consistency = stable performance across attempts
-   independent_completion = performance without excessive hints

Then:

``` text
difficulty_change =
small_step × (P - target_performance)
```

Use a moving average/EMA so one bad attempt does not suddenly make the
learner's questions extremely easy.

Example behavior:

``` text
Repeated strong performance
→ difficulty rises gradually

Stable performance
→ difficulty stays similar

Repeated struggle
→ difficulty decreases gradually

One failure
→ small/no immediate reduction
```

The goal is to maintain a productive challenge level, not manipulate the
user into endless engagement.

------------------------------------------------------------------------

# 28. AI Mentor

Create a dedicated AI Mentor page.

The mentor receives a compact learner context:

-   current level
-   current difficulty
-   strong topics
-   weak topics
-   recent attempts
-   recent mistakes
-   hints used
-   course progress
-   learning goals

Do not send the entire database/history to Gemma.

Mentor can answer:

-   What should I learn next?
-   Why am I struggling with arrays?
-   What should I practice today?
-   Explain this concept.
-   Give me a hint.
-   Create a learning plan.

Use progressive hint levels:

``` text
Hint
↓
Concept
↓
Guided approach
↓
Detailed explanation
```

Avoid immediately dumping complete solutions unless the learning flow
explicitly calls for an explanation after an attempt.

------------------------------------------------------------------------

# 29. Custom AI Course Generator

Create a separate page.

Inputs:

-   topic
-   current level
-   programming language
-   goal
-   available time
-   preferred difficulty
-   desired depth

Example:

``` text
Topic:
Data Structures

Current level:
Beginner

Language:
Python

Goal:
Interview preparation

Time:
5 hours/week

Depth:
Detailed
```

Gemma generates:

-   course title
-   prerequisites
-   learning objectives
-   modules
-   lessons
-   documentation
-   examples
-   practice questions
-   challenges
-   assessments
-   final project

------------------------------------------------------------------------

# 30. Course learning rule

The AI should primarily generate **study documentation and learning
material**, then generate questions based on that material.

Pipeline:

``` text
Course goal
   ↓
Gemma course planner
   ↓
Module
   ↓
Documentation
   ↓
Examples
   ↓
Questions
   ↓
Practice
   ↓
Assessment
```

Do not make the course a random collection of AI-generated questions.

------------------------------------------------------------------------

# 31. Web research / scraping

Give the backend controlled web research capability.

Use:

``` text
Search
↓
Retrieve
↓
Sanitize
↓
Extract relevant content
↓
Gemma
↓
Structured documentation
↓
Citations/sources
```

Important:

Do NOT implement unrestricted arbitrary scraping.

Protect against:

-   prompt injection
-   malicious pages
-   huge pages
-   excessive requests
-   unsafe redirects
-   arbitrary internal URLs
-   untrusted instructions inside webpages

Treat web content as **untrusted data**, not instructions.

Keep the source URL/title so course documentation can show references.

------------------------------------------------------------------------

# 32. Gamification

Use:

-   XP
-   Levels
-   Streaks
-   Badges
-   Achievements
-   Islands
-   Territories
-   Leaderboards
-   Custom badges
-   Clash wins
-   Course completion

But keep gamification subordinate to learning.

------------------------------------------------------------------------

# 33. Important correction to the original leaderboard formula

Do NOT use:

``` text
(streak × total problems solved / 2) - problems failed
```

Problems:

-   Can become negative.
-   Encourages quantity over learning quality.
-   A huge streak can dominate everything.
-   Penalizing failures can discourage experimentation.
-   Users can grind easy problems.
-   Does not account for difficulty.
-   Does not represent actual skill.

Instead use:

``` text
Final Competitive Score =
Σ(Problem Points)
+ Achievement Bonus
+ Controlled Streak Bonus
```

Where:

``` text
Problem Points =
Base Points × Difficulty Multiplier
```

Failures should generally not cause large negative scores.

Use streak bonuses with a cap/diminishing return.

Keep:

``` text
XP
```

separate from:

``` text
Competitive Score
```

------------------------------------------------------------------------

# 34. Leaderboard

Pages:

-   Global
-   Weekly
-   Monthly
-   Friends (optional)

Display:

-   rank
-   avatar
-   username
-   score
-   XP
-   problems solved
-   streak
-   territories captured
-   Clash wins

Do not make leaderboard rank the only indicator of success.

------------------------------------------------------------------------

# 35. Badges

Examples:

-   First Code
-   First Island
-   10 Problems
-   50 Problems
-   Debugging Master
-   Array Explorer
-   Algorithm Apprentice
-   Hard Challenge
-   7-Day Streak
-   Course Complete
-   Clash Champion
-   Territory Conqueror
-   Recursion Explorer

------------------------------------------------------------------------

# 36. Custom badges

Users/admin/event systems may create custom badges.

Examples:

-   Hackathon Winner
-   Event Champion
-   Special Challenge
-   Community Achievement

Custom badges should be cosmetic or controlled achievements.

Do not let users arbitrarily create badges that increase competitive
score.

------------------------------------------------------------------------

# 37. Streak system

A streak should require meaningful learning activity.

Examples:

-   complete a practice problem
-   complete a lesson
-   finish a meaningful coding challenge

Simply opening the app should not count.

Avoid mechanics designed to make users feel forced to maintain a streak
at all costs.

------------------------------------------------------------------------

# 38. Database design

Use Supabase PostgreSQL.

Core tables:

``` text
profiles
problems
problem_test_cases
problem_attempts

islands
island_territories
territory_connections

clash_rooms
clash_players
clash_events
clash_territory_captures

user_progress
user_topic_progress

badges
user_badges
custom_badges
streaks

courses
course_modules
course_progress

ai_mentor_sessions

raised_problems
```

Leaderboard can be implemented using a view/materialized view or
server-side aggregation.

------------------------------------------------------------------------

# 39. User/profile data

Store:

-   user ID
-   username
-   avatar
-   level
-   XP
-   competitive score
-   current streak
-   longest streak
-   skill level
-   preferences
-   programming languages
-   created date

Do not store sensitive information unless genuinely required.

------------------------------------------------------------------------

# 40. User progress

Track:

-   problems solved
-   attempts
-   topic mastery
-   difficulty
-   preferred language
-   weak topics
-   strong topics
-   island progress
-   territory progress
-   course progress
-   Clash history

------------------------------------------------------------------------

# 41. Raised problems

Users can report:

-   incorrect answer
-   broken test case
-   ambiguous statement
-   incorrect difficulty
-   compiler issue
-   other

Store reports in:

``` text
raised_problems
```

Include:

-   problem ID
-   reporter ID
-   reason
-   description
-   status
-   created time
-   review result

------------------------------------------------------------------------

# 42. RLS/security

Supabase Row Level Security must be enabled.

Users can read/write only what they are authorized to access.

Examples:

A user can:

-   read their own profile
-   update allowed profile fields
-   read their own progress
-   submit attempts
-   read their badges
-   participate in authorized rooms

A normal client must NOT be able to:

-   change another user's XP
-   change territory ownership
-   change score
-   declare itself winner
-   change difficulty
-   grant badges
-   modify match state

Privileged operations happen through the backend/service layer.

------------------------------------------------------------------------

# 43. Backend modules

Implement separate services/modules:

``` text
Auth Service
Authorization Service

Problem Service
Problem Generator
Problem Validator
Test Generator

Code Execution Service
JDoodle Service

AI Service
Gemma Problem Generator
Gemma Code Analyzer
Gemma Mentor
Gemma Course Generator
Recommendation Engine

Adaptive Learning Service
Difficulty Engine
Topic Mastery
Learner Model

Web Research Service
Search
Retrieval
Sanitization
Citation

Multiplayer Service
Matchmaking
Room Management
Match State
Player State
Territory Validation
Race Condition Handling
Reconnection

Gamification Service
XP
Levels
Badges
Streaks
Leaderboard

Course Service
Report Service
Rate Limit Service
Validation Service
```

------------------------------------------------------------------------

# 44. Frontend component architecture

## Authentication

``` text
Login
Register
OAuth
ProtectedRoute
```

## Navigation

``` text
Sidebar
Topbar
UserMenu
NotificationCenter
```

## Dashboard

``` text
XPCard
StreakCard
ProgressCard
RecommendationCard
ContinueCard
AchievementCard
RecentActivity
```

## Island world

``` text
IslandMap
Territory
TerritoryPath
PlayerMarker
IslandInfo
MapControls
```

## Clash

``` text
ClashLobby
PlayerList
ClashMap
ClashHUD
ChallengePanel
CodeEditor
HintPanel
TestResults
LiveScoreboard
ConnectionStatus
ClashResults
```

## Practice

``` text
ProblemList
ProblemFilters
ProblemCard
ProblemView
PracticeHistory
```

## AI

``` text
Mentor
MentorChat
RecommendationPanel
CodeFeedback
CourseGenerator
```

## Courses

``` text
CourseList
CourseOverview
CourseModule
Lesson
CourseProgress
Assessment
```

## Gamification

``` text
XP
Level
Badge
BadgeCollection
Streak
Achievements
```

## Other

``` text
Leaderboard
Profile
Settings
ProblemReport
```

------------------------------------------------------------------------

# 45. Clash UI

The Clash page should visually match the reference.

Recommended layout:

``` text
┌───────────────────────────────────────────────────────┐
│ Clash HUD | Timer | Score | Connection | Players      │
├───────────────────┬───────────────────┬───────────────┤
│                   │                   │               │
│  Challenge        │   2D Island Map   │ Live Players  │
│  Description      │                   │ Scoreboard    │
│                   │   Territories     │               │
│  Test Cases       │   Paths           │               │
│                   │   Player markers  │               │
├───────────────────┴───────────────────┴───────────────┤
│ Monaco Code Editor                         Run Submit │
├───────────────────────────────────────────────────────┤
│ Test Results / AI Feedback / Hints                    │
└───────────────────────────────────────────────────────┘
```

------------------------------------------------------------------------

# 46. Practice UI

``` text
┌───────────────┬─────────────────────────────┐
│ Filters       │ Problem list                │
│               │                             │
│ Topic         │ Two Sum                     │
│ Difficulty    │ Binary Search               │
│ Language      │ Reverse Linked List         │
│ Search        │ ...                         │
└───────────────┴─────────────────────────────┘
```

Clicking a problem opens:

``` text
Problem
↓
Examples
↓
Constraints
↓
Monaco
↓
Run
↓
Submit
↓
Tests
↓
AI Feedback
```

------------------------------------------------------------------------

# 47. AI Mentor UI

Create a friendly fantasy mentor character/icon.

Sections:

-   Recommendation
-   Why this topic?
-   What to learn
-   Practice next
-   Ask Mentor
-   Learning plan

Example:

``` text
Your next recommendation

Recursion

Why?
You are comfortable with loops, but recent attempts show
difficulty understanding recursive state.

Suggested path:
1. Call stack
2. Base cases
3. Recursive state
4. Easy recursion
5. Medium recursion
```

------------------------------------------------------------------------

# 48. Course Generator UI

Use a form card:

``` text
What do you want to learn?
[ Data Structures ]

Current Level
[ Beginner ]

Language
[ Python ]

Goal
[ Interviews ]

Time available
[ 5 hrs/week ]

Depth
[ Detailed ]

[ Generate Course ]
```

Show generation progress without pretending that an AI request completed
before it actually did.

------------------------------------------------------------------------

# 49. Profile UI

Show:

-   avatar
-   username
-   level
-   XP
-   streak
-   badges
-   territories
-   islands
-   Clash wins
-   problems solved
-   course completion
-   strong topics
-   weak topics
-   recent activity

------------------------------------------------------------------------

# 50. Error handling

Never silently fail.

Examples:

### Gemma unavailable

Show:

> AI service is temporarily unavailable. Your progress is safe. You can
> continue with existing problems.

### JDoodle unavailable

Show:

> Code execution is temporarily unavailable. Please try again.

### Supabase unavailable

Show:

> We couldn't save your progress. We're reconnecting.

### Realtime disconnected

Show:

> Reconnecting to Clash...

Do not punish a user for temporary network failures.

------------------------------------------------------------------------

# 51. AI output safety and validation

All AI outputs must be treated as untrusted generated data.

Use schemas such as Zod.

Example problem schema:

``` ts
{
  title: string,
  description: string,
  difficulty: number,
  topic: string,
  inputFormat: string,
  outputFormat: string,
  constraints: string[],
  examples: Example[],
  hints: string[],
  explanation: string
}
```

AI output must pass validation before use.

------------------------------------------------------------------------

# 52. Anti-cheat principles

The frontend cannot be trusted.

Never accept from the client:

``` text
score
winner
territory ownership
XP
badge rewards
difficulty
test result
match result
```

Instead calculate them on the backend.

------------------------------------------------------------------------

# 53. Rate limiting

Rate-limit:

-   AI generation
-   AI mentor requests
-   course generation
-   code execution
-   web searches
-   login attempts
-   room creation
-   problem submissions

This protects API quotas and prevents abuse.

------------------------------------------------------------------------

# 54. Testing

## Unit tests

Test:

-   difficulty calculation
-   XP
-   score
-   badge unlocks
-   streak
-   territory validation
-   path validation
-   matchmaking
-   match state
-   winner calculation

## Integration tests

Test:

-   backend ↔ Supabase
-   backend ↔ Gemma
-   backend ↔ JDoodle
-   backend ↔ Realtime

## Multiplayer tests

Test:

-   join
-   leave
-   reconnect
-   duplicate submission
-   simultaneous territory capture
-   match start
-   match finish
-   disconnected players
-   race conditions

## E2E test

Test:

``` text
Register
↓
Login
↓
Dashboard
↓
Join Clash
↓
Second player joins
↓
Ready
↓
Match starts
↓
Solve problem
↓
JDoodle
↓
Capture territory
↓
Realtime update
↓
Finish match
↓
Rewards
↓
AI summary
```

------------------------------------------------------------------------

# 55. Accessibility

Support:

-   keyboard navigation
-   visible focus
-   screen-reader labels
-   readable contrast
-   reduced motion
-   clear error messages
-   resizable UI
-   icons + text for important states

Do not communicate important information through color alone.

------------------------------------------------------------------------

# 56. Responsive design

Support:

-   desktop
-   laptop
-   tablet
-   mobile

Coding experience should prioritize desktop/tablet.

The island map should remain usable on small screens with:

-   zoom
-   pan
-   simplified HUD
-   collapsible panels

------------------------------------------------------------------------

# 57. Important product corrections

## Original idea: "dopamine induced"

Replace this product goal with:

> High-engagement, rewarding gamification that keeps learners motivated
> while preserving healthy stopping points and keeping learning as the
> primary objective.

Do not intentionally create manipulative mechanics such as:

-   endless reward loops
-   forced notifications
-   punishment for taking breaks
-   fake scarcity
-   deceptive progress bars
-   excessive flashing
-   deliberately addictive variable-ratio rewards

------------------------------------------------------------------------

# 58. Better leaderboard design

Original:

``` text
(streak × total problems solved / 2) - failures
```

Replace with difficulty-aware scoring.

Recommended:

``` text
Problem Points = Base × Difficulty Multiplier

Competitive Score =
Σ Problem Points
+ Achievement Bonuses
+ Capped Streak Bonus
```

Use separate:

``` text
XP
Competitive Score
Skill Rating
```

This gives three different meanings:

-   XP = overall progression
-   Competitive Score = leaderboard performance
-   Skill Rating = estimated coding ability

------------------------------------------------------------------------

# 59. Better adaptive learning design

Do not make every question harder after every success.

Use:

-   rolling performance
-   topic-specific mastery
-   confidence
-   recent failure history
-   hint usage
-   complexity/efficiency
-   consistency

Difficulty should change gradually.

This prevents:

``` text
Easy → Hard → Impossible → Easy
```

and instead produces:

``` text
Easy → Medium → Medium+ → Hard
```

when the learner genuinely improves.

------------------------------------------------------------------------

# 60. Better multiplayer design

Do not make Clash simply:

> whoever submits first wins.

Instead:

-   territories have different point values
-   harder territories are worth more
-   multiple pathways exist
-   players choose strategic routes
-   final objective gives controlled bonus
-   skill-balanced matchmaking
-   server-authoritative validation

This turns the island into an actual strategy layer.

------------------------------------------------------------------------

# 61. Better learning design

AI feedback should not just say:

> Your code is inefficient.

It should teach.

Example:

``` text
You searched the array inside another loop.

Current complexity:
O(n²)

Why:
For every element, the code scans the remaining array.

Better concept:
Hash maps can store previously seen values.

Try this:
Rewrite the solution using a hash map.
```

Then offer a follow-up practice problem.

------------------------------------------------------------------------

# 62. AI source-of-truth hierarchy

Use this hierarchy:

``` text
Backend
  ↓
Authority over game state, score, rewards, authorization

Supabase
  ↓
Persistent data

JDoodle
  ↓
Code execution result

Gemma
  ↓
Generation, explanation, recommendations, analysis

Web sources
  ↓
External learning material
```

Gemma must not override compiler results.

Web pages must not override application rules.

The browser must not override backend decisions.

------------------------------------------------------------------------

# 63. AI context optimization

Do not send complete user history to Gemma every time.

Send compact context:

``` text
Current level
Current difficulty
Strong topics
Weak topics
Recent attempts
Recent mistakes
Recent successes
Hints used
Course progress
Learning goal
```

This reduces token usage and improves relevance.

------------------------------------------------------------------------

# 64. Database relationship overview

``` text
profiles
   │
   ├── user_progress
   ├── user_topic_progress
   ├── problem_attempts
   ├── user_badges
   ├── streaks
   ├── course_progress
   └── clash_players
             │
             └── clash_rooms
                    │
                    ├── clash_events
                    └── clash_territory_captures

islands
   │
   └── island_territories
          │
          └── territory_connections

problems
   │
   ├── problem_test_cases
   └── problem_attempts

courses
   │
   └── course_modules
```

------------------------------------------------------------------------

# 65. Final system architecture

``` text
                    ┌────────────────────┐
                    │      USER          │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │ React + TypeScript │
                    │ Vite + Tailwind    │
                    │ Monaco + SVG Map   │
                    └─────────┬──────────┘
                              │ HTTPS
                              ▼
                    ┌────────────────────┐
                    │ Node + Express API │
                    │ Server Authority   │
                    └──────┬─────┬───────┘
                           │     │
             ┌─────────────┘     └─────────────┐
             ▼                                 ▼
      ┌───────────────┐                 ┌──────────────┐
      │   Supabase    │                 │    Gemma     │
      │ DB/Auth/RLS   │                 │ AI Services  │
      │ Realtime      │                 └──────────────┘
      └───────┬───────┘
              │
              │ Realtime
              ▼
       Other Clash Players

Backend ───────────────► JDoodle
Backend ───────────────► Web Research
```

------------------------------------------------------------------------

# 66. Complete feature checklist

The final application must include:

-   [ ] Authentication
-   [ ] Dashboard
-   [ ] User profiles
-   [ ] XP
-   [ ] Levels
-   [ ] Streaks
-   [ ] Badges
-   [ ] Custom badges
-   [ ] Islands
-   [ ] 2D territory maps
-   [ ] Branching pathways
-   [ ] Territory capture
-   [ ] Practice page
-   [ ] AI-generated practice problems
-   [ ] Clash page
-   [ ] Clash lobby
-   [ ] Multiplayer rooms
-   [ ] Matchmaking
-   [ ] Supabase Realtime
-   [ ] Reconnection
-   [ ] Server-authoritative state
-   [ ] Race-condition protection
-   [ ] Monaco editor
-   [ ] JDoodle execution
-   [ ] AI code summaries
-   [ ] AI code improvement suggestions
-   [ ] AI efficiency suggestions
-   [ ] AI complexity explanations
-   [ ] Adaptive difficulty
-   [ ] AI Mentor
-   [ ] Topic recommendations
-   [ ] Custom AI Course Generator
-   [ ] AI-generated documentation
-   [ ] Questions based on documentation
-   [ ] Controlled web research
-   [ ] Source citations
-   [ ] Leaderboard
-   [ ] Problem reporting
-   [ ] Analytics
-   [ ] Secure environment variables
-   [ ] Supabase RLS
-   [ ] Rate limiting
-   [ ] AI output validation
-   [ ] Testing
-   [ ] Accessibility
-   [ ] Responsive UI
-   [ ] Error handling

------------------------------------------------------------------------

# 67. Implementation order

Build in this order instead of trying to generate everything
simultaneously.

## Phase 1 --- Foundation

-   React/Vite/TypeScript
-   Tailwind
-   shadcn
-   Supabase
-   Auth
-   database schema
-   base layout
-   navigation

## Phase 2 --- Core learning

-   Problems
-   Monaco
-   JDoodle
-   Practice page
-   Attempts
-   AI feedback

## Phase 3 --- Adaptive learning

-   learner model
-   topic mastery
-   difficulty engine
-   AI recommendations
-   AI Mentor

## Phase 4 --- Gamification

-   XP
-   levels
-   streaks
-   badges
-   leaderboard

## Phase 5 --- Islands

-   island data
-   SVG map
-   territories
-   paths
-   progression

## Phase 6 --- Multiplayer Clash

-   rooms
-   lobby
-   matchmaking
-   realtime
-   player state
-   territory capture
-   race-condition handling
-   reconnection
-   match results

## Phase 7 --- AI courses

-   course generator
-   documentation
-   questions
-   assessments
-   progress

## Phase 8 --- Web research

-   search
-   retrieval
-   sanitization
-   citations
-   prompt-injection protection

## Phase 9 --- Polish

-   animations
-   responsive UI
-   accessibility
-   performance
-   testing
-   error states

------------------------------------------------------------------------

# 68. MVP priority

If development time becomes limited, prioritize:

### Tier 1

1.  Auth
2.  Dashboard
3.  Practice
4.  Monaco
5.  JDoodle
6.  AI-generated problems
7.  AI feedback
8.  Adaptive difficulty
9.  Islands
10. Basic Clash

### Tier 2

11. Supabase Realtime
12. Multiplayer rooms
13. Leaderboard
14. Badges
15. AI Mentor
16. Course Generator

### Tier 3

17. Web research
18. Advanced matchmaking
19. Advanced analytics
20. Custom badges
21. advanced map strategy

Do not fake multiplayer with frontend-only state.

------------------------------------------------------------------------

# 69. Final product definition

CodeConquer is:

> **A real-time multiplayer coding-learning world where learners explore
> branching 2D islands, solve programming challenges to capture
> territories, compete in Clashes, practice independently, and receive
> continuous AI-powered personalization through adaptive difficulty,
> code analysis, mentoring, and custom courses.**

The architectural principles are:

``` text
Gamification = engagement
Multiplayer = competition
AI = personalization
JDoodle = execution authority
Backend = game authority
Supabase = persistent source of truth
Web = external learning material
Education = primary purpose
```

------------------------------------------------------------------------

# 70. Questions / decisions to confirm before implementation

These are the main remaining product decisions that should be answered
before the first production build:

1.  **Which programming languages are required for MVP?**
    -   Python only?
    -   Python + C++?
    -   Python + C++ + Java?
    -   All JDoodle-supported languages?
2.  **Gemma deployment**
    -   Gemini/Gemma API endpoint?
    -   Local Gemma?
    -   Cloud Gemma?
    -   What exact Gemma model ID?
3.  **Web search provider**
    -   Which search API will be used?
    -   Is web research required in the MVP or Phase 2?
4.  **Clash player count**
    -   Recommended starting point: 4--8 players.
5.  **Match duration**
    -   Recommended: 10--20 minutes.
6.  **Should territories be permanently captured on the user's island
    after a Clash, or should each Clash have a temporary map state?**
    -   Recommended: permanent solo progression + temporary Clash
        ownership.
7.  **Should a player be allowed to capture the same territory again for
    practice?**
    -   Recommended: yes in Practice, but not for duplicate competitive
        points in the same Clash.
8.  **How should matchmaking work?**
    -   Recommended: group users by a hidden skill rating / recent
        performance rather than XP alone.
9.  **Should AI-generated problems be generated live every time?**
    -   Recommended: generate + validate + cache approved problems
        instead of generating every problem synchronously.
10. **Should users be able to choose their own difficulty?**
    -   Recommended: allow a preferred range, but let adaptive learning
        recommend the actual difficulty.
11. **Should Clash and Practice use the same problem bank?**
    -   Recommended: share the validated problem infrastructure, but use
        different problem selection/rules.
12. **Should the leaderboard be global only?**
    -   Recommended: global + weekly + monthly, with friends as
        optional.
13. **Should the course generator allow users to paste their own
    resources?**
    -   Recommended: yes, but sanitize uploaded/web content before
        sending it to the AI.
14. **How should custom badges be awarded?**
    -   Recommended: admin/event-controlled badges rather than
        unrestricted user-created competitive rewards.
15. **Should the island map be SVG or Canvas?**
    -   Recommended for MVP: SVG because territories, paths, labels,
        click targets, and React state are easier to manage.
16. **Do you want the first build to prioritize the multiplayer Clash or
    the AI learning system?**
    -   Recommended development order: Practice + AI + adaptive engine
        first, then multiplayer.

------------------------------------------------------------------------

# 71. Non-negotiable rules for the coding agent

When generating the actual application:

1.  Do not create fake API responses for core functionality.
2.  Do not expose secrets in frontend code.
3.  Do not put JDoodle credentials in React.
4.  Do not trust client-side score/territory/winner data.
5.  Do not let Gemma decide whether code passed.
6.  Do not publish unvalidated AI-generated coding problems.
7.  Do not implement unrestricted web scraping.
8.  Do not make Clash a simple first-click-wins system.
9.  Do not use the original failure-penalty leaderboard formula.
10. Do not make one failure drastically lower difficulty.
11. Do not make streaks the primary measure of skill.
12. Do not store unnecessary sensitive user data.
13. Do not silently fail when an API is unavailable.
14. Do not replace real backend functionality with static demo data
    unless explicitly marked as seed/demo data.
15. Keep all modules extensible and typed.
16. Use clear API/service boundaries.
17. Use database transactions or atomic operations for competitive state
    changes.
18. Validate all external and AI-generated data.
19. Keep the learning experience motivating but not manipulative.
20. Preserve the dark fantasy/pixel-art CodeConquer visual identity
    shown in the reference image.

------------------------------------------------------------------------

# 72. One-shot build instruction

**Build CodeConquer according to this document.**

Start with the foundation and implement the application in phases. Use
real Supabase integration, real JDoodle execution, configurable Gemma
integration, secure backend APIs, and Supabase Realtime.

Create a polished dark fantasy/pixel-art coding world inspired by the
supplied reference image. The interface should feel like a premium
coding game while remaining practical for actual programming.

Do not remove any listed module. If a full implementation cannot fit
into one generation, create the correct architecture and continue
module-by-module rather than simplifying the product into a static
mockup.

The final result should be a functional, secure, scalable prototype
rather than only a visual demo.
