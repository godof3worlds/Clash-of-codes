import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { askAIMentor, generateAICourse } from '../services/gemma';

export const AIMentor: React.FC = () => {
  const { user, courses, addCourse, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<'mentor' | 'courses'>('mentor');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: '🧙 **AI Mentor:** Welcome! Based on your recent activity, I recommend:\n\n1. **Recursion** – You struggled with 2 recent problems involving recursion.\n2. **Dynamic Programming** – It will help you with advanced problems and interviews.\n3. **Practice:** Try 5 recursion problems (Easy + Medium) in the Practice Lab.\n\nAsk me anything about coding concepts, study plans, or career advice!' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Course generator state
  const [courseTopic, setCourseTopic] = useState('Data Structures and Algorithms');
  const [courseLevel, setCourseLevel] = useState('Intermediate');
  const [courseLang, setCourseLang] = useState('Python');
  const [courseTime, setCourseTime] = useState('2-3 hours per week');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const userMsg = inputValue.trim();
    setChatMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setInputValue('');
    setIsLoading(true);

    const response = await askAIMentor(userMsg, user);
    setChatMessages((prev) => [...prev, { role: 'ai', content: response }]);
    setIsLoading(false);
  };

  const handleGenerateCourse = async () => {
    setIsGenerating(true);
    const course = await generateAICourse(courseTopic, courseLevel, courseLang, courseTime);
    addCourse(course);
    setIsGenerating(false);
  };

  const quickActions = [
    { label: 'Explain a concept', icon: 'school', query: 'Explain recursion with a simple example' },
    { label: 'Give a hint', icon: 'lightbulb', query: 'Give me a hint for Two Sum problem' },
    { label: 'Suggest a topic', icon: 'explore', query: 'What should I study next based on my progress?' },
    { label: 'What should I learn next?', icon: 'psychology', query: 'What should I learn next?' },
  ];

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-on-surface">AI Mentor & Courses</h1>
        <p className="font-sans text-sm text-on-surface-variant mt-1">Your personal learning assistant and custom course generator.</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 bg-surface-container-high rounded-xl p-1 w-fit">
        {(['mentor', 'courses'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg font-sans text-sm font-medium transition-all capitalize ${
              activeTab === tab ? 'bg-surface-container text-primary shadow-md' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab === 'mentor' ? 'AI Mentor' : 'Course Generator'}
          </button>
        ))}
      </div>

      {activeTab === 'mentor' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Chat Panel */}
          <div className="lg:col-span-3 bg-surface-container rounded-xl shadow-xl border border-secondary/20 flex flex-col min-h-[500px]">
            {/* Chat Header */}
            <div className="px-5 py-3 border-b border-surface-container-high/50 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-[22px]">psychology</span>
              </div>
              <div>
                <span className="font-display text-sm font-bold text-on-surface">AI Mentor</span>
                <p className="font-sans text-[11px] text-on-surface-variant">Powered by Gemma 4</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3.5 rounded-xl ${
                    msg.role === 'user'
                      ? 'bg-primary/20 border border-primary/30 rounded-br-sm'
                      : 'bg-surface-container-low border border-surface-container-high/50 rounded-bl-sm'
                  }`}>
                    <p className="font-sans text-sm text-on-surface whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-surface-container-low border border-surface-container-high/50 rounded-xl rounded-bl-sm p-3.5">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <div className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-surface-container-high/50">
              <div className="flex gap-2">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-surface-container-lowest border border-surface-container-highest rounded-xl px-4 py-2.5 text-sm font-sans text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary"
                />
                <button onClick={handleSend} disabled={isLoading} className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-surface-container-lowest hover:shadow-[0_0_12px_rgba(76,215,246,0.3)] transition-all disabled:opacity-50">
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-4">
            <div className="bg-surface-container rounded-xl p-4 shadow-xl border border-surface-container-high/50">
              <h4 className="font-display text-sm font-bold text-on-surface mb-3">Quick Actions</h4>
              <div className="space-y-2">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => { setInputValue(action.query); }}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-container-lowest/50 hover:bg-surface-container-low border border-surface-container-high/30 hover:border-primary/30 transition-all text-left"
                  >
                    <span className="material-symbols-outlined text-primary text-[18px]">{action.icon}</span>
                    <span className="font-sans text-xs text-on-surface">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-surface-container rounded-xl p-4 shadow-xl border border-surface-container-high/50">
              <h4 className="font-display text-sm font-bold text-on-surface mb-2">Your Focus</h4>
              <div className="space-y-2">
                {Object.entries(user.topicStrengths).slice(0, 4).map(([topic, val]) => (
                  <div key={topic} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${val >= 70 ? 'bg-tertiary' : val >= 40 ? 'bg-amber-400' : 'bg-error'}`} />
                    <span className="font-sans text-xs text-on-surface-variant flex-1 truncate">{topic}</span>
                    <span className="font-mono text-[10px] text-on-surface-variant">{val}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course Generator Form */}
          <div className="bg-surface-container rounded-xl p-6 shadow-xl border border-tertiary/20 glow-tertiary">
            <h3 className="font-display text-base font-bold text-on-surface mb-4">Custom Course Generator</h3>
            <p className="font-sans text-xs text-on-surface-variant mb-5">Tell us what you want to learn and AI will create a personalized course.</p>
            <div className="space-y-4">
              <div>
                <label className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider block mb-1">What do you want to learn?</label>
                <input value={courseTopic} onChange={(e) => setCourseTopic(e.target.value)} className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-lg px-3 py-2 text-sm font-sans text-on-surface focus:outline-none focus:border-tertiary" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider block mb-1">Current Level</label>
                  <select value={courseLevel} onChange={(e) => setCourseLevel(e.target.value)} className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-lg px-3 py-2 text-sm font-sans text-on-surface focus:outline-none focus:border-tertiary">
                    <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider block mb-1">Language</label>
                  <select value={courseLang} onChange={(e) => setCourseLang(e.target.value)} className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-lg px-3 py-2 text-sm font-sans text-on-surface focus:outline-none focus:border-tertiary">
                    <option>Python</option><option>JavaScript</option><option>Java</option><option>C++</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider block mb-1">Time Available</label>
                <select value={courseTime} onChange={(e) => setCourseTime(e.target.value)} className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-lg px-3 py-2 text-sm font-sans text-on-surface focus:outline-none focus:border-tertiary">
                  <option>1-2 hours per week</option><option>2-3 hours per week</option><option>5+ hours per week</option>
                </select>
              </div>
              <button onClick={handleGenerateCourse} disabled={isGenerating} className="w-full bg-gradient-to-r from-tertiary-container to-tertiary text-surface-container-lowest font-display font-bold text-sm py-3 rounded-xl hover:shadow-[0_0_20px_rgba(78,222,163,0.3)] transition-all disabled:opacity-50">
                {isGenerating ? 'Generating...' : 'Generate Course'}
              </button>
            </div>
          </div>

          {/* Existing Courses */}
          <div className="space-y-4">
            <h3 className="font-display text-base font-bold text-on-surface">Your Courses</h3>
            {courses.map((course) => (
              <div key={course.id} className="bg-surface-container rounded-xl p-5 shadow-xl border border-surface-container-high/50">
                <h4 className="font-display text-sm font-bold text-on-surface mb-1">{course.title}</h4>
                <p className="font-sans text-xs text-on-surface-variant mb-3">{course.description}</p>
                <div className="flex items-center gap-3 text-[11px] font-mono text-on-surface-variant mb-3">
                  <span>{course.modulesCount} Modules</span>
                  <span>•</span>
                  <span>{course.lessonsCount} Lessons</span>
                  <span>•</span>
                  <span>{course.practiceProblemsCount} Problems</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-tertiary-container to-tertiary rounded-full transition-all" style={{ width: `${course.progressPercent}%` }} />
                </div>
                <span className="font-mono text-[10px] text-on-surface-variant mt-1 block">{course.progressPercent}% complete</span>

                {/* Modules list */}
                <div className="mt-3 space-y-1.5">
                  {course.modules.slice(0, 4).map((mod) => (
                    <div key={mod.id} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface-container-lowest/50">
                      <span className={`material-symbols-outlined text-[14px] ${mod.completed ? 'text-tertiary' : 'text-on-surface-variant/50'}`}>
                        {mod.completed ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <span className={`font-sans text-xs ${mod.completed ? 'text-on-surface' : 'text-on-surface-variant'}`}>{mod.title}</span>
                    </div>
                  ))}
                  {course.modules.length > 4 && (
                    <span className="font-mono text-[10px] text-on-surface-variant pl-2">+{course.modules.length - 4} more modules...</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
