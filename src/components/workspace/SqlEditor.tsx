import React, { useEffect, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { useCaseStore } from '../../store/useCaseStore';
import { Play, RotateCcw, Clock, Sparkles } from 'lucide-react';

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
    <div className="h-full flex flex-col bg-investigative-surface border-b border-investigative-border overflow-hidden">
      {/* Editor Header */}
      <div className="h-10 px-3 border-b border-investigative-border flex items-center justify-between bg-investigative-surface/80 shrink-0">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono font-bold tracking-wider text-investigative-text uppercase">
            Query
          </span>
          <span className="hidden sm:inline-block text-[11px] font-mono text-investigative-text-muted">
            Ctrl + Enter to run
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleHistory}
            className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors border ${
              showHistory
                ? 'bg-investigative-surface-raised border-investigative-red text-investigative-red'
                : 'border-investigative-border text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>History ({history.length})</span>
          </button>

          <button
            onClick={() => setCurrentSql('')}
            className="px-2 py-1 rounded text-xs text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised border border-investigative-border transition-colors"
            title="Clear editor"
          >
            Clear
          </button>

          <button
            onClick={handleRun}
            disabled={isExecuting || !isDbReady}
            className="flex items-center space-x-1.5 px-3 py-1 rounded text-xs font-medium bg-investigative-red text-white hover:bg-investigative-red-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <Play className={`w-3 h-3 fill-white ${isExecuting ? 'animate-spin' : ''}`} />
            <span>{isExecuting ? 'Running...' : 'Run Query'}</span>
          </button>
        </div>
      </div>

      {/* CodeMirror Workspace */}
      <div className="flex-1 min-h-0 relative">
        <CodeMirror
          value={currentSql}
          height="100%"
          theme={theme === 'dark' ? oneDark : 'light'}
          extensions={[sql()]}
          onChange={(val) => setCurrentSql(val)}
          placeholder="-- Write SQL query here..."
          className="h-full text-xs font-mono"
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightActiveLine: true,
            foldGutter: false,
          }}
        />
      </div>

      {/* Editor Footer / Quick Snippets */}
      <div className="h-8 px-3 border-t border-investigative-border bg-investigative-surface/60 flex items-center justify-between text-[11px] font-mono text-investigative-text-muted shrink-0 overflow-x-auto">
        <div className="flex items-center space-x-1.5">
          <span className="text-[10px] uppercase text-investigative-text-muted/60">Quick:</span>
          <button
            onClick={() => insertSnippet('SELECT * FROM orders LIMIT 10;')}
            className="px-1.5 py-0.5 rounded hover:bg-investigative-surface-raised hover:text-investigative-text transition-colors"
          >
            SELECT *
          </button>
          <span>·</span>
          <button
            onClick={() => insertSnippet('GROUP BY column_name\nHAVING COUNT(*) > 1;')}
            className="px-1.5 py-0.5 rounded hover:bg-investigative-surface-raised hover:text-investigative-text transition-colors"
          >
            GROUP BY & HAVING
          </button>
          <span>·</span>
          <button
            onClick={() => insertSnippet('JOIN refunds ON orders.order_id = refunds.order_id')}
            className="px-1.5 py-0.5 rounded hover:bg-investigative-surface-raised hover:text-investigative-text transition-colors"
          >
            INNER JOIN
          </button>
          <span>·</span>
          <button
            onClick={() => insertSnippet('SUM(gross_amount) AS total')}
            className="px-1.5 py-0.5 rounded hover:bg-investigative-surface-raised hover:text-investigative-text transition-colors"
          >
            SUM()
          </button>
        </div>

        <span className="text-[10px] text-investigative-text-muted">
          PGlite WebAssembly
        </span>
      </div>
    </div>
  );
};
