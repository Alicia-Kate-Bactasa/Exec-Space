import React from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import { useAuthStore } from '../../store/useAuthStore';
import { ArrowRight, BookOpen, BookmarkCheck, CircleHelp, FileText, Play, Search } from 'lucide-react';

const STEPS = [
  {
    title: 'Choose a case',
    text: 'Open Home, pick a case set, and start with the starter SQL.',
    icon: Search,
  },
  {
    title: 'Investigate',
    text: 'Run queries in Workspace and inspect the Results or Visualization tabs.',
    icon: Play,
  },
  {
    title: 'Save evidence',
    text: 'Use Save Evidence whenever you find key rows or totals you want to keep.',
    icon: BookmarkCheck,
  },
  {
    title: 'Submit finding',
    text: 'Open Finding, explain the root cause, and submit your conclusion.',
    icon: FileText,
  },
];

export const HelpPage: React.FC = () => {
  const { setActiveView } = useCaseStore();
  const user = useAuthStore((s) => s.user);

  return (
    <div className="h-full overflow-y-auto bg-investigative-bg text-investigative-text">
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-investigative-violet/30 bg-investigative-violet-subtle px-3 py-1 text-xs font-mono text-investigative-violet mb-3">
            <CircleHelp className="w-3.5 h-3.5" />
            Help Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight mb-2">How to use ExecSpace</h1>
          <p className="text-sm sm:text-base text-investigative-text-muted max-w-2xl">
            A quick guide to move through each investigation without changing your current workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {STEPS.map((step, index) => (
            <div key={step.title} className="rounded-2xl border border-investigative-border/60 bg-investigative-surface p-5">
              <div className="w-8 h-8 rounded-full bg-investigative-violet-subtle border border-investigative-violet/30 flex items-center justify-center text-investigative-violet mb-3">
                <step.icon className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-semibold mb-1">{index + 1}. {step.title}</h2>
              <p className="text-xs sm:text-sm text-investigative-text-muted leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-investigative-border/60 bg-investigative-surface p-5 mb-8">
          <h2 className="text-sm font-semibold mb-3">Useful shortcuts</h2>
          <ul className="space-y-2 text-sm text-investigative-text-muted">
            <li>• <span className="text-investigative-text font-mono">Ctrl/Cmd + Enter</span> runs the SQL query.</li>
            <li>• Use <span className="text-investigative-text">History</span> in the editor to revisit past query runs.</li>
            <li>• Use <span className="text-investigative-text">Starter</span> to restore the default query for the active case.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-investigative-border/60 bg-investigative-surface p-5 flex flex-wrap gap-3">
          <button
            onClick={() => setActiveView('landing')}
            className="px-4 py-2 rounded-full border border-investigative-border/70 text-sm text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised transition-colors"
          >
            Back to Home
          </button>
          <button
            onClick={() => setActiveView(user ? 'workspace' : 'landing')}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-investigative-violet text-white text-sm font-medium hover:bg-investigative-violet-hover transition-colors"
          >
            {user ? 'Go to Workspace' : 'Open cases after login'}
            <ArrowRight className="w-4 h-4" />
          </button>
          {user && (
            <button
              onClick={() => setActiveView('evidence')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-investigative-border/70 text-sm text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Review Evidence
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
