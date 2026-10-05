import React, { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { useStore } from '../store/useStore';
import { executeCode } from '../services/jdoodle';
import { analyzeCodeWithGemma, generateAIProblem } from '../services/gemma';
import { ExecutionResult, Problem } from '../types';

export const PracticeLab: React.FC = () => {
  const {
    activeProblem, setActiveProblem, currentCode, setCurrentCode, selectedLanguage, setSelectedLanguage,
    addXP, captureTerritory, activeIslandId, updateAdaptiveDifficulty,
    setLastAIFeedback, lastAIFeedback, showToast, setShowReportModal,
  } = useStore();

  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState<'problem' | 'results' | 'feedback'>('problem');

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setActiveTab('results');
    const result = await executeCode(currentCode, selectedLanguage, activeProblem.testCases.filter((t) => !t.isSecret));
    setExecutionResult(result);
    setIsRunning(false);
  }, [currentCode, selectedLanguage, activeProblem]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setActiveTab('results');
    const result = await executeCode(currentCode, selectedLanguage, activeProblem.testCases);
    setExecutionResult(result);

    if (result.passed) {
      addXP(activeProblem.points);
      captureTerritory(activeIslandId, activeProblem.id);
      updateAdaptiveDifficulty(true);
    } else {
      updateAdaptiveDifficulty(false);
    }

    // Get AI Feedback
    const feedback = await analyzeCodeWithGemma(activeProblem, currentCode, result.passed);
    setLastAIFeedback(feedback);
    setShowFeedback(true);
    setActiveTab('feedback');
    setIsSubmitting(false);
  }, [currentCode, selectedLanguage, activeProblem, activeIslandId, addXP, captureTerritory, updateAdaptiveDifficulty, setLastAIFeedback]);

  const handleGenerateQuestion = async () => {
    setIsGeneratingAI(true);
    try {
      const newProb = await generateAIProblem(
        activeProblem.topic || 'Arrays',
        activeProblem.difficulty || 'Easy',
        selectedLanguage || 'Python'
      );
      setActiveProblem(newProb);
      showToast(`✨ Generated new AI challenge: "${newProb.title}"!`);
      setActiveTab('problem');
    } catch (err: any) {
      showToast('⚠️ AI is offline. Unable to generate new challenge.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const langOptions = Object.keys(activeProblem.starterCode);

  return (
    <div className="flex flex-col space-y-4">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => useStore.getState().setCurrentView('island-world')} className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          </button>
          <h1 className="font-display text-lg font-bold text-on-surface">{activeProblem.title}</h1>
          <span className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold ${
            activeProblem.difficulty === 'Easy' ? 'bg-tertiary/20 text-tertiary' :
            activeProblem.difficulty === 'Medium' ? 'bg-amber-400/20 text-amber-400' :
            'bg-error/20 text-error'
          }`}>{activeProblem.difficulty}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateQuestion}
            disabled={isGeneratingAI}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/15 border border-secondary/40 text-secondary font-sans text-xs font-bold hover:bg-secondary/25 transition-all disabled:opacity-50"
            title="Generate a brand new challenge using Gemma AI"
          >
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            {isGeneratingAI ? 'Generating...' : 'AI Generate Question'}
          </button>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-surface-container-high border border-surface-container-highest rounded-lg px-3 py-1.5 text-sm text-on-surface font-mono focus:outline-none focus:border-primary"
          >
            {langOptions.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <button onClick={handleRun} disabled={isRunning} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-surface-container-high border border-primary/30 text-primary font-sans text-sm font-medium hover:bg-surface-container-highest transition-colors disabled:opacity-50">
            <span className="material-symbols-outlined text-[16px]">play_arrow</span>
            {isRunning ? 'Running...' : 'Run'}
          </button>
          <button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-primary-container to-primary text-surface-container-lowest font-sans text-sm font-bold hover:shadow-[0_0_16px_rgba(76,215,246,0.3)] transition-all disabled:opacity-50">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>

      {/* Main Split View: Left (Problem/Results/AI Feedback) + Right (Monaco Editor) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[calc(100vh-180px)]">
        {/* Left Panel: Tabs */}
        <div className="lg:col-span-5 bg-surface-container rounded-xl shadow-xl border border-surface-container-high/50 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-surface-container-high/50">
            <button
              onClick={() => setActiveTab('problem')}
              className={`flex-1 py-2.5 font-sans text-xs font-bold text-center transition-colors border-b-2 ${
                activeTab === 'problem' ? 'border-primary text-primary bg-surface-container-high/40' : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`flex-1 py-2.5 font-sans text-xs font-bold text-center transition-colors border-b-2 ${
                activeTab === 'results' ? 'border-tertiary text-tertiary bg-surface-container-high/40' : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Test Results
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`flex-1 py-2.5 font-sans text-xs font-bold text-center transition-colors border-b-2 relative ${
                activeTab === 'feedback' ? 'border-secondary text-secondary bg-surface-container-high/40' : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              AI Feedback
              {lastAIFeedback && <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-secondary animate-ping" />}
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-5 overflow-y-auto max-h-[calc(100vh-260px)]">
            {activeTab === 'problem' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-base font-bold text-on-surface">{activeProblem.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-[11px] text-tertiary font-bold">{activeProblem.topic}</span>
                    <span className="text-on-surface-variant text-[11px]">•</span>
                    <span className="font-mono text-[11px] text-primary font-bold">{activeProblem.points} XP Reward</span>
                  </div>
                </div>

                <div className="font-sans text-sm text-on-surface leading-relaxed whitespace-pre-line">
                  {activeProblem.description}
                </div>

                {/* Examples */}
                {activeProblem.examples.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">Examples</h4>
                    {activeProblem.examples.map((ex, i) => (
                      <div key={i} className="bg-surface-container-lowest rounded-lg p-3 space-y-1 font-mono text-xs border border-surface-container-high/30">
                        <div><span className="text-on-surface-variant">Input: </span><span className="text-primary">{ex.input}</span></div>
                        <div><span className="text-on-surface-variant">Output: </span><span className="text-tertiary">{ex.output}</span></div>
                        {ex.explanation && <div className="text-[11px] text-on-surface-variant/80 font-sans mt-1">{ex.explanation}</div>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Constraints */}
                <div className="space-y-1.5">
                  <h4 className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">Constraints</h4>
                  <ul className="list-disc list-inside space-y-1 font-mono text-xs text-on-surface-variant">
                    {activeProblem.constraints.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'results' && (
              <div className="space-y-4">
                {!executionResult ? (
                  <div className="text-center py-12 text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl mb-2 text-surface-container-highest">play_circle</span>
                    <p className="font-sans text-sm">Click "Run" or "Submit" to execute your solution against test cases.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Summary Card */}
                    <div className={`p-4 rounded-xl border flex items-center justify-between ${
                      executionResult.passed ? 'bg-tertiary/10 border-tertiary/30' : 'bg-error/10 border-error/30'
                    }`}>
                      <div className="flex items-center gap-3">
                        <span className={`material-symbols-outlined text-2xl ${executionResult.passed ? 'text-tertiary' : 'text-error'}`}>
                          {executionResult.passed ? 'check_circle' : 'cancel'}
                        </span>
                        <div>
                          <h4 className={`font-display text-sm font-bold ${executionResult.passed ? 'text-tertiary' : 'text-error'}`}>
                            {executionResult.passed ? 'All Tests Passed!' : 'Tests Failed'}
                          </h4>
                          <span className="font-mono text-xs text-on-surface-variant">
                            {executionResult.passedCount} / {executionResult.totalTests} test cases passed
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-on-surface-variant">
                        {executionResult.executionTimeMs}ms
                      </span>
                    </div>

                    {/* Test Case Cards */}
                    <div className="space-y-2">
                      <h4 className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">Test Cases</h4>
                      {executionResult.testDetails.map((td, i) => (
                        <div key={td.testId} className={`p-3 rounded-lg border font-mono text-xs space-y-1 ${
                          td.passed ? 'bg-surface-container-lowest border-tertiary/20' : 'bg-surface-container-lowest border-error/30'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-on-surface">Test #{i + 1}</span>
                            <span className={td.passed ? 'text-tertiary' : 'text-error'}>{td.passed ? 'PASSED' : 'FAILED'}</span>
                          </div>
                          <div><span className="text-on-surface-variant">Input: </span><span className="text-primary">{td.input}</span></div>
                          <div><span className="text-on-surface-variant">Expected: </span><span className="text-tertiary">{td.expected}</span></div>
                          <div><span className="text-on-surface-variant">Actual: </span><span className={td.passed ? 'text-on-surface' : 'text-error'}>{td.actual}</span></div>
                        </div>
                      ))}
                    </div>

                    {/* Logs */}
                    {executionResult.logs.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">Standard Output</h4>
                        <pre className="bg-surface-container-lowest p-3 rounded-lg font-mono text-xs text-on-surface-variant overflow-x-auto">
                          {executionResult.logs.join('\n')}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'feedback' && (
              <div className="space-y-4">
                {!lastAIFeedback ? (
                  <div className="text-center py-12 text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl mb-2 text-secondary">psychology</span>
                    <p className="font-sans text-sm">Submit your solution to get real-time AI code analysis and optimization tips.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Summary */}
                    <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-4 glow-secondary">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-secondary text-[20px]">psychology</span>
                        <h4 className="font-display text-sm font-bold text-on-surface">AI Code Review</h4>
                      </div>
                      <p className="font-sans text-xs text-on-surface leading-relaxed">{lastAIFeedback.summary}</p>
                    </div>

                    {/* Complexity & Efficiency */}
                    <div className="bg-surface-container-lowest rounded-xl p-4 border border-surface-container-high/30 space-y-2">
                      <h4 className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">Complexity Analysis</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-2.5 rounded-lg bg-surface-container-high">
                          <span className="font-mono text-[10px] text-on-surface-variant block">Time Complexity</span>
                          <span className="font-mono text-sm text-primary font-bold">{lastAIFeedback.efficiency.timeComplexity}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-surface-container-high">
                          <span className="font-mono text-[10px] text-on-surface-variant block">Space Complexity</span>
                          <span className="font-mono text-sm text-tertiary font-bold">{lastAIFeedback.efficiency.spaceComplexity}</span>
                        </div>
                      </div>
                      <p className="font-sans text-xs text-on-surface-variant mt-2">{lastAIFeedback.efficiency.suggestions}</p>
                    </div>

                    {/* Improvements */}
                    {lastAIFeedback.improvements.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-mono text-[11px] uppercase tracking-wider text-tertiary">Suggested Refactorings</h4>
                        <div className="space-y-1.5">
                          {lastAIFeedback.improvements.map((imp, i) => (
                            <div key={i} className="flex items-start gap-2 bg-surface-container-lowest p-2.5 rounded-lg border border-tertiary/20">
                              <span className="material-symbols-outlined text-tertiary text-[16px] mt-0.5">lightbulb</span>
                              <span className="font-sans text-xs text-on-surface">{imp}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mistakes if any */}
                    {lastAIFeedback.mistakes.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-mono text-[11px] uppercase tracking-wider text-error">Issues Detected</h4>
                        <div className="space-y-1.5">
                          {lastAIFeedback.mistakes.map((mis, i) => (
                            <div key={i} className="flex items-start gap-2 bg-surface-container-lowest p-2.5 rounded-lg border border-error/20">
                              <span className="material-symbols-outlined text-error text-[16px] mt-0.5">warning</span>
                              <span className="font-sans text-xs text-on-surface">{mis}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Monaco Editor */}
        <div className="lg:col-span-7 bg-surface-container rounded-xl shadow-xl border border-surface-container-high/50 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-surface-container-high border-b border-surface-container-highest">
            <span className="font-mono text-xs text-on-surface-variant flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
              solution.{selectedLanguage.toLowerCase() === 'python' ? 'py' : 'js'}
            </span>
            <button
              onClick={() => setCurrentCode(activeProblem.starterCode[selectedLanguage] || '')}
              className="font-sans text-xs text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">restart_alt</span>
              Reset
            </button>
          </div>
          <div className="flex-1 min-h-[400px]">
            <Editor
              height="100%"
              language={selectedLanguage.toLowerCase() === 'python' ? 'python' : 'javascript'}
              value={currentCode}
              onChange={(value) => setCurrentCode(value || '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                padding: { top: 12, bottom: 12 },
                tabSize: 4,
                automaticLayout: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
