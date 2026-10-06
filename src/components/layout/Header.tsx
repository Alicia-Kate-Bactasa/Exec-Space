import React from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import { InvestigationStep } from '../../types';
import { Moon, Sun, RotateCcw, ShieldAlert, ArrowRight } from 'lucide-react';

const STEPS: { key: InvestigationStep; label: string; num: number }[] = [
  { key: 'cases', label: 'Choose Case', num: 1 },
  { key: 'schema', label: 'Explore Database', num: 2 },
  { key: 'query', label: 'Write SQL', num: 3 },
  { key: 'results', label: 'Inspect Results', num: 4 },
  { key: 'evidence', label: 'Save Evidence', num: 5 },
  { key: 'finding', label: 'Write Finding', num: 6 },
];

export const Header: React.FC = () => {
  const { currentStep, setCurrentStep, setActiveView, setSidebarTab, theme, toggleTheme, resetCurrentCase } = useCaseStore();

  const handleStepClick = (step: InvestigationStep) => {
    setCurrentStep(step);
    if (step === 'cases') {
      setSidebarTab('cases');
      setActiveView('workspace');
    } else if (step === 'schema') {
      setSidebarTab('database');
      setActiveView('workspace');
    } else if (step === 'evidence') {
      setActiveView('evidence');
    } else if (step === 'finding') {
      setActiveView('finding');
    } else {
      setActiveView('workspace');
    }
  };

  return (
    <header className="h-14 border-b border-investigative-border bg-investigative-surface px-4 flex items-center justify-between select-none shrink-0 z-20">
      {/* Brand */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-investigative-red-subtle border border-investigative-red/30 px-2.5 py-1 rounded">
          <span className="w-2 h-2 rounded-full bg-investigative-red animate-pulse" />
          <span className="font-mono font-bold tracking-wider text-sm text-investigative-text">EXECSPACE</span>
        </div>
        <span className="text-xs text-investigative-text-muted hidden sm:inline-block border-l border-investigative-border pl-3">
          Data Detective Playground
        </span>
      </div>

      {/* Investigation Flow Stepper */}
      <nav aria-label="Investigation Flow" className="hidden md:flex items-center space-x-1">
        {STEPS.map((step, idx) => {
          const isActive = currentStep === step.key;
          return (
            <React.Fragment key={step.key}>
              <button
                onClick={() => handleStepClick(step.key)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
                  isActive
                    ? 'bg-investigative-red text-white font-medium shadow-sm'
                    : 'text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-investigative-border text-investigative-text-muted'
                }`}>
                  {step.num}
                </span>
                <span>{step.label}</span>
              </button>
              {idx < STEPS.length - 1 && (
                <span className="text-investigative-border text-xs px-0.5">→</span>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={resetCurrentCase}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded text-xs text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised border border-investigative-border transition-colors"
          title="Reset database to initial state"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset Case</span>
        </button>

        <button
          onClick={toggleTheme}
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded text-xs text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised border border-investigative-border transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-slate-700" />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
