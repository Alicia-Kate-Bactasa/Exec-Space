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
    <div className="h-full flex flex-col bg-investigative-surface overflow-hidden">
      {/* Results Header */}
      <div className="h-10 px-3 border-b border-investigative-border flex items-center justify-between bg-investigative-surface/80 shrink-0">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('table')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
              activeTab === 'table'
                ? 'bg-investigative-surface-raised text-investigative-text font-medium border border-investigative-border'
                : 'text-investigative-text-muted hover:text-investigative-text'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Results</span>
          </button>

          <button
            onClick={() => setActiveTab('chart')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
              activeTab === 'chart'
                ? 'bg-investigative-surface-raised text-investigative-text font-medium border border-investigative-border'
                : 'text-investigative-text-muted hover:text-investigative-text'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Visualization</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
              activeTab === 'notes'
                ? 'bg-investigative-surface-raised text-investigative-text font-medium border border-investigative-border'
                : 'text-investigative-text-muted hover:text-investigative-text'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Notes</span>
          </button>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center space-x-3">
          {currentResult && (
            <div className="flex items-center space-x-2 text-[11px] font-mono text-investigative-text-muted">
              {currentResult.error ? (
                <span className="text-rose-500 font-semibold">Error</span>
              ) : (
                <>
                  <span>{currentResult.rowCount} rows</span>
                  <span>·</span>
                  <span>{currentResult.executionTimeMs} ms</span>
                </>
              )}
            </div>
          )}

          <button
            onClick={onOpenSaveEvidence}
            disabled={!hasData || isExecuting}
            className="flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium border border-investigative-border hover:border-investigative-red hover:bg-investigative-red-subtle text-investigative-text transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Save query and result to Evidence Board"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-investigative-red" />
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
                <Table className="w-8 h-8 mb-2 text-investigative-border-muted" />
                <p className="text-xs">Execute a SQL query to inspect database records.</p>
              </div>
            ) : currentResult.error ? (
              <div className="p-4 m-3 bg-rose-500/10 border border-rose-500/30 rounded text-xs space-y-1.5 font-mono">
                <div className="flex items-center space-x-1.5 text-rose-500 font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  <span>SQL Error:</span>
                </div>
                <div className="text-investigative-text whitespace-pre-wrap">
                  {currentResult.error}
                </div>
              </div>
            ) : currentResult.rows.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-investigative-text-muted font-mono">
                Query executed successfully. (0 rows returned)
              </div>
            ) : (
              <div className="min-w-full inline-block align-middle">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead className="bg-investigative-surface-raised/80 sticky top-0 border-b border-investigative-border text-investigative-text z-10 backdrop-blur-sm">
                    <tr>
                      <th className="py-2 px-3 text-[10px] uppercase text-investigative-text-muted font-normal w-12 border-r border-investigative-border/50">
                        #
                      </th>
                      {currentResult.columns.map((col) => (
                        <th key={col} className="py-2 px-3 font-semibold border-r border-investigative-border/50 last:border-r-0">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-investigative-border/50 text-investigative-text">
                    {currentResult.rows.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className="hover:bg-investigative-surface-raised/50 transition-colors"
                      >
                        <td className="py-1.5 px-3 text-[10px] text-investigative-text-muted/60 border-r border-investigative-border/50">
                          {rowIdx + 1}
                        </td>
                        {row.map((cell, cellIdx) => {
                          const isNull = cell === null || cell === undefined;
                          const isNumeric = typeof cell === 'number';
                          return (
                            <td
                              key={cellIdx}
                              className={`py-1.5 px-3 border-r border-investigative-border/50 last:border-r-0 truncate max-w-xs ${
                                isNumeric ? 'text-right' : ''
                              }`}
                            >
                              {isNull ? (
                                <span className="text-investigative-text-muted/50 italic">NULL</span>
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
