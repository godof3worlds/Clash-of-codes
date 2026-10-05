import React, { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { useStore } from '../store/useStore';
import { executeCode } from '../services/jdoodle';
import { analyzeCodeWithGemma } from '../services/gemma';
import { ExecutionResult } from '../types';

export const PracticeLab: React.FC = () => {
  const {
    activeProblem, currentCode, setCurrentCode, selectedLanguage, setSelectedLanguage,
    addXP, captureTerritory, activeIslandId, updateAdaptiveDifficulty,
    setLastAIFeedback, lastAIFeedback, showToast, setShowReportModal,
  } = useStore();

  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const langOptions = Object.keys(activeProblem.starterCode);

  return (
    <div className="flex flex-col space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
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

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[calc(100vh-180px)]">
        {/* Left Panel: Problem + Results + Feedback (tabs) */}
        <div className="bg-surface-container rounded-xl shadow-xl border border-surface-container-high/50 flex flex-col overflow-hidden">
          {/* Tab Bar */}
          <div className="flex border-b border-surface-container-high/50">
            {(['problem', 'results', 'feedback'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 font-sans text-sm font-medium transition-colors capitalize ${
                  activeTab === tab
                    ? 'text-primary border-b-2 border-primary bg-surface-container-low/50'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab === 'results' && executionResult && (
                  <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${executionResult.passed ? 'bg-tertiary' : 'bg-error'}`} />
                )}
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === 'problem' && (
              <div className="space-y-4 animate-fade-in">
                <div className="prose prose-invert prose-sm max-w-none">
                  <p className="font-sans text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{activeProblem.description}</p>
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-on-surface mb-2">Constraints</h4>
                  <ul className="space-y-1">
                    {activeProblem.constraints.map((c, i) => (
                      <li key={i} className="font-mono text-xs text-on-surface-variant flex items-start gap-1.5">
                        <span className="text-primary mt-0.5">•</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-on-surface mb-2">Examples</h4>
                  {activeProblem.examples.map((ex, i) => (
                    <div key={i} className="bg-surface-container-lowest rounded-lg p-3 mb-2 border border-surface-container-high/30">
                      <div className="font-mono text-xs text-on-surface-variant mb-1">
                        <span className="text-primary font-bold">Input:</span> {ex.input}
                      </div>
                      <div className="font-mono text-xs text-on-surface-variant">
                        <span className="text-tertiary font-bold">Output:</span> {ex.output}
                      </div>
                      {ex.explanation && (
                        <div className="font-sans text-xs text-on-surface-variant/70 mt-1 italic">{ex.explanation}</div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <span className="font-mono text-[11px] text-on-surface-variant">Points:</span>
                  <span className="font-mono text-sm text-primary font-bold">{activeProblem.points} XP</span>
                </div>
              </div>
            )}

            {activeTab === 'results' && (
              <div className="space-y-4 animate-fade-in">
                {!executionResult ? (
                  <div className="flex flex-col items-center justify-center h-48 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[48px] mb-2 opacity-30">play_circle</span>
                    <p className="font-sans text-sm">Run or Submit your code to see results</p>
                  </div>
                ) : (
                  <>
                    {/* Summary */}
                    <div className={`p-4 rounded-xl border ${executionResult.passed ? 'bg-tertiary/10 border-tertiary/30' : 'bg-error/10 border-error/30'}`}>
                      <div className="flex items-center gap-2">
                        <span className={`material-symbols-outlined text-[24px] ${executionResult.passed ? 'text-tertiary' : 'text-error'}`}>
                          {executionResult.passed ? 'check_circle' : 'cancel'}
                        </span>
                        <span className={`font-display text-base font-bold ${executionResult.passed ? 'text-tertiary' : 'text-error'}`}>
                          {executionResult.passed ? 'All Tests Passed!' : `${executionResult.passedCount}/${executionResult.totalTests} Passed`}
                        </span>
                      </div>
                      <p className="font-mono text-[11px] text-on-surface-variant mt-1">
                        Execution Time: {executionResult.executionTimeMs}ms | Memory: {executionResult.memoryKb ? `${(executionResult.memoryKb / 1024).toFixed(1)}MB` : 'N/A'}
                      </p>
                    </div>

                    {/* Test Details */}
                    <div className="space-y-2">
                      <h4 className="font-display text-sm font-bold text-on-surface">Test Cases</h4>
                      {executionResult.testDetails.map((td, i) => (
                        <div key={td.testId} className={`p-3 rounded-lg border ${td.passed ? 'bg-surface-container-lowest border-tertiary/20' : 'bg-surface-container-lowest border-error/20'}`}>
                          <div className="flex items-center gap-2">
                            <span className={`material-symbols-outlined text-[16px] ${td.passed ? 'text-tertiary' : 'text-error'}`}>
                              {td.passed ? 'check' : 'close'}
                            </span>
                            <span className="font-sans text-xs font-medium text-on-surface">Test {i + 1}: {td.passed ? 'Passed' : 'Failed'}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Console Output */}
                    <div>
                      <h4 className="font-display text-sm font-bold text-on-surface mb-2">Console</h4>
                      <div className="bg-surface-container-lowest rounded-lg p-3 border border-surface-container-high/30 font-mono text-xs text-on-surface-variant space-y-0.5">
                        {executionResult.logs.map((log, i) => (
                          <div key={i}>{log}</div>
                        ))}
                        {executionResult.error && <div className="text-error">{executionResult.error}</div>}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'feedback' && (
              <div className="space-y-4 animate-fade-in">
                {!lastAIFeedback ? (
                  <div className="flex flex-col items-center justify-center h-48 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[48px] mb-2 opacity-30">psychology</span>
                    <p className="font-sans text-sm">Submit your code to receive AI feedback</p>
                  </div>
                ) : (
                  <>
                    <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/30">
                      <h4 className="font-display text-sm font-bold text-secondary mb-1">AI Analysis (Gemma 4)</h4>
                      <p className="font-sans text-sm text-on-surface leading-relaxed">{lastAIFeedback.summary}</p>
                    </div>

                    {lastAIFeedback.mistakes.length > 0 && (
                      <div>
                        <h4 className="font-display text-sm font-bold text-error mb-2">Mistakes Found</h4>
                        <ul className="space-y-1">
                          {lastAIFeedback.mistakes.map((m, i) => (
                            <li key={i} className="font-sans text-xs text-on-surface-variant flex items-start gap-1.5">
                              <span className="text-error mt-0.5">✕</span> {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <h4 className="font-display text-sm font-bold text-tertiary mb-2">Improvements</h4>
                      <ul className="space-y-1">
                        {lastAIFeedback.improvements.map((imp, i) => (
                          <li key={i} className="font-sans text-xs text-on-surface-variant flex items-start gap-1.5">
                            <span className="text-tertiary mt-0.5">→</span> {imp}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-lg bg-surface-container-lowest border border-primary/20">
                      <h4 className="font-mono text-[11px] text-primary font-bold uppercase tracking-wider mb-1">Complexity Analysis</h4>
                      <p className="font-mono text-xs text-on-surface-variant">Time: {lastAIFeedback.efficiency.timeComplexity} | Space: {lastAIFeedback.efficiency.spaceComplexity}</p>
                      <p className="font-sans text-xs text-on-surface-variant mt-1">{lastAIFeedback.efficiency.suggestions}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-surface-container-lowest border border-secondary/20">
                      <h4 className="font-mono text-[11px] text-secondary font-bold uppercase tracking-wider mb-1">Next Steps</h4>
                      <p className="font-sans text-xs text-on-surface-variant">{lastAIFeedback.nextSteps}</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Report Problem Button */}
          <div className="p-3 border-t border-surface-container-high/30">
            <button
              onClick={() => showToast('📋 Problem reported! Our team will review it.')}
              className="font-sans text-xs text-on-surface-variant hover:text-error transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">flag</span> Report Problem
            </button>
          </div>
        </div>

        {/* Right Panel: Monaco Editor */}
        <div className="bg-surface-container rounded-xl shadow-xl border border-surface-container-high/50 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-container-high/50 bg-surface-container-low/50">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[16px]">code</span>
              <span className="font-mono text-xs text-on-surface font-medium">{selectedLanguage}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setCurrentCode(activeProblem.starterCode[selectedLanguage] || '')} className="px-2 py-1 rounded text-[11px] font-mono text-on-surface-variant hover:text-on-surface bg-surface-container-high hover:bg-surface-container-highest transition-colors">
                Reset
              </button>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={selectedLanguage === 'Python' ? 'python' : 'javascript'}
              value={currentCode}
              onChange={(value) => setCurrentCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', monospace",
                lineNumbers: 'on',
                roundedSelection: true,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 12, bottom: 12 },
                renderLineHighlight: 'gutter',
                suggestOnTriggerCharacters: true,
                tabSize: 4,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
