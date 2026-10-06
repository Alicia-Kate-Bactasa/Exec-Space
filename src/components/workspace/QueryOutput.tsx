import React, { useState } from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import { Visualization } from './Visualization';
import { InvestigationNotes } from '../notes/InvestigationNotes';
import { BookmarkPlus, Table, BarChart3, Edit3, AlertCircle } from 'lucide-react';

interface QueryOutputProps {
  onOpenSaveEvidence: () => void;
}

export const QueryOutput: React.FC<QueryOutputProps> = ({ onOpenSaveEvidence }) => {
  const { currentResult, isExecuting } = useCaseStore();
  const [activeTab, setActiveTab] = useState<'table' | 'chart' | 'notes'>('table');

  const hasData = currentResult && !currentResult.error && currentResult.rows.length > 0;

  return (
    <div className="h-full flex flex-col bg-investigative-surface/70 overflow-hidden">
      {/* Results Header */}
      <div className="h-12 px-4 border-b border-investigative-border/50 flex items-center justify-between bg-investigative-surface/50 shrink-0">
        <div className="flex items-center space-x-1.5 bg-investigative-surface-raised/40 p-1 rounded-xl border border-investigative-border/40">
          <button
            onClick={() => setActiveTab('table')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              activeTab === 'table'
                ? 'bg-investigative-surface text-investigative-text font-medium shadow-xs border border-investigative-border/70'
                : 'text-investigative-text-muted hover:text-investigative-text'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>Results</span>
          </button>

          <button
            onClick={() => setActiveTab('chart')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              activeTab === 'chart'
                ? 'bg-investigative-surface text-investigative-text font-medium shadow-xs border border-investigative-border/70'
                : 'text-investigative-text-muted hover:text-investigative-text'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Visualization</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              activeTab === 'notes'
                ? 'bg-investigative-surface text-investigative-text font-medium shadow-xs border border-investigative-border/70'
                : 'text-investigative-text-muted hover:text-investigative-text'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Notes</span>
          </button>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center space-x-3">
          {currentResult && (
            <div className="flex items-center space-x-2 text-xs font-mono text-investigative-text-muted">
              {currentResult.error ? (
                <span className="text-violet-400 font-medium">Query Error</span>
              ) : (
                <>
                  <span>{currentResult.rowCount} rows</span>
                  <span className="text-investigative-border-muted">,</span>
                  <span>{currentResult.executionTimeMs} ms</span>
                </>
              )}
            </div>
          )}

          <button
            onClick={onOpenSaveEvidence}
            disabled={!hasData || isExecuting}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium border border-investigative-border/70 hover:border-investigative-violet hover:bg-investigative-violet-subtle text-investigative-text transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            title="Save query and result to Evidence"
          >
            <BookmarkPlus className="w-4 h-4 text-investigative-violet" />
            <span>Save Evidence</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content Area */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === 'chart' ? (
          <Visualization />
        ) : activeTab === 'notes' ? (
          <InvestigationNotes />
        ) : (
          <div className="h-full overflow-auto">
            {isExecuting ? (
              <div className="h-full flex items-center justify-center text-xs text-investigative-text-muted font-mono">
                Executing SQL on PGlite...
              </div>
            ) : !currentResult ? (
              <div className="h-full flex flex-col items-center justify-center text-investigative-text-muted p-8 text-center select-none">
                <Table className="w-8 h-8 mb-2 text-investigative-border-muted/60" />
                <p className="text-xs">Execute a SQL query to inspect database records.</p>
              </div>
            ) : currentResult.error ? (
              <div className="p-4 m-4 bg-violet-950/20 border border-violet-500/30 rounded-xl text-sm space-y-2 font-mono">
                <div className="flex items-center space-x-2 text-violet-400 font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  <span>SQL Error:</span>
                </div>
                <div className="text-investigative-text whitespace-pre-wrap leading-relaxed">
                  {currentResult.error}
                </div>
              </div>
            ) : currentResult.rows.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-investigative-text-muted font-mono">
                Query executed successfully. (0 rows returned)
              </div>
            ) : (
              <div className="min-w-full inline-block align-middle">
                <table className="w-full text-left text-sm font-mono border-collapse">
                  <thead className="bg-investigative-surface-raised/80 sticky top-0 border-b border-investigative-border/50 text-investigative-text z-10 backdrop-blur-xs">
                    <tr>
                      <th className="py-2.5 px-3.5 text-xs uppercase text-investigative-text-muted font-normal w-12 border-r border-investigative-border/30">
                        #
                      </th>
                      {currentResult.columns.map((col) => (
                        <th key={col} className="py-2.5 px-3.5 font-semibold border-r border-investigative-border/30 last:border-r-0">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-investigative-border/30 text-investigative-text">
                    {currentResult.rows.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className="hover:bg-investigative-surface-raised/40 transition-colors"
                      >
                        <td className="py-2 px-3.5 text-xs text-investigative-text-muted/60 border-r border-investigative-border/30">
                          {rowIdx + 1}
                        </td>
                        {row.map((cell, cellIdx) => {
                          const isNull = cell === null || cell === undefined;
                          const isNumeric = typeof cell === 'number';
                          return (
                            <td
                              key={cellIdx}
                              className={`py-2 px-3.5 border-r border-investigative-border/30 last:border-r-0 truncate max-w-xs ${
                                isNumeric ? 'text-right font-medium' : ''
                              }`}
                            >
                              {isNull ? (
                                <span className="text-investigative-text-muted/40 italic">NULL</span>
                              ) : (
                                String(cell)
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
