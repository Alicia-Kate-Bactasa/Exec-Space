import React, { useEffect, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { useCaseStore } from '../../store/useCaseStore';
import { Play, Clock } from 'lucide-react';

interface SqlEditorProps {
  onToggleHistory: () => void;
  showHistory: boolean;
}

export const SqlEditor: React.FC<SqlEditorProps> = ({ onToggleHistory, showHistory }) => {
  const { currentSql, setCurrentSql, executeQuery, isExecuting, isDbReady, history, theme } = useCaseStore();

  const handleRun = useCallback(() => {
    if (!isExecuting) {
      executeQuery();
    }
  }, [isExecuting, executeQuery]);

  // Global Ctrl+Enter or Cmd+Enter to execute query
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRun]);

  const insertSnippet = (snippet: string) => {
    setCurrentSql(currentSql ? `${currentSql}\n\n${snippet}` : snippet);
  };

  return (
    <div className="h-full flex flex-col bg-investigative-surface/70 overflow-hidden">
      {/* Editor Header */}
      <div className="h-12 px-4 border-b border-investigative-border/50 flex items-center justify-between bg-investigative-surface/50 shrink-0">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-mono font-bold tracking-wider text-investigative-text uppercase">
            Query
          </span>
          <span className="hidden sm:inline-block text-xs font-mono text-investigative-text-muted/80">
            Ctrl + Enter to run
          </span>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Muted Secondary History Button */}
          <button
            onClick={onToggleHistory}
            className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs md:text-sm transition-colors border ${
              showHistory
                ? 'bg-investigative-surface-raised border-investigative-violet text-investigative-violet font-medium'
                : 'border-investigative-border/60 text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>History ({history.length})</span>
          </button>

          {/* Muted Secondary Clear Button */}
          <button
            onClick={() => setCurrentSql('')}
            className="px-3.5 py-1.5 rounded-full text-xs md:text-sm text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised border border-investigative-border/60 transition-colors"
            title="Clear editor"
          >
            Clear
          </button>

          {/* Hero Dark Violet Primary Run Button */}
          <button
            onClick={handleRun}
            disabled={isExecuting || !isDbReady}
            className="flex items-center space-x-2 px-5 py-1.5 rounded-full text-xs md:text-sm font-medium bg-investigative-violet hover:bg-investigative-violet-hover text-white transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs active:scale-[0.98]"
          >
            <Play className={`w-3.5 h-3.5 fill-white ${isExecuting ? 'animate-spin' : ''}`} />
            <span>{isExecuting ? 'Running...' : 'Run Query'}</span>
          </button>
        </div>
      </div>

      {/* CodeMirror Workspace with negative space and rounded-xl */}
      <div className="flex-1 min-h-0 relative p-3 bg-investigative-surface/40">
        <div className="h-full rounded-xl overflow-hidden border border-investigative-border/40 shadow-2xs">
          <CodeMirror
            value={currentSql}
            height="100%"
            theme={theme === 'dark' ? oneDark : 'light'}
            extensions={[sql()]}
            onChange={(val) => setCurrentSql(val)}
            placeholder="-- Write SQL query here..."
            className="h-full text-xs md:text-sm font-mono"
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              highlightActiveLine: true,
              foldGutter: false,
            }}
          />
        </div>
      </div>

      {/* Editor Footer / Quick Snippets */}
      <div className="h-10 px-4 border-t border-investigative-border/50 bg-investigative-surface/40 flex items-center justify-between text-xs font-mono text-investigative-text-muted shrink-0 overflow-x-auto">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] uppercase text-investigative-text-muted/60">Quick:</span>
          <button
            onClick={() => insertSnippet('SELECT * FROM orders LIMIT 10;')}
            className="px-2.5 py-1 rounded-lg hover:bg-investigative-surface-raised hover:text-investigative-text transition-colors"
          >
            SELECT *
          </button>
          <span>·</span>
          <button
            onClick={() => insertSnippet('GROUP BY column_name\nHAVING COUNT(*) > 1;')}
            className="px-2.5 py-1 rounded-lg hover:bg-investigative-surface-raised hover:text-investigative-text transition-colors"
          >
            GROUP BY & HAVING
          </button>
          <span>·</span>
          <button
            onClick={() => insertSnippet('JOIN refunds ON orders.order_id = refunds.order_id')}
            className="px-2.5 py-1 rounded-lg hover:bg-investigative-surface-raised hover:text-investigative-text transition-colors"
          >
            INNER JOIN
          </button>
          <span>·</span>
          <button
            onClick={() => insertSnippet('SUM(gross_amount) AS total')}
            className="px-2.5 py-1 rounded-lg hover:bg-investigative-surface-raised hover:text-investigative-text transition-colors"
          >
            SUM()
          </button>
        </div>

        <span className="text-xs text-investigative-text-muted/70">
          PGlite Engine
        </span>
      </div>
    </div>
  );
};
