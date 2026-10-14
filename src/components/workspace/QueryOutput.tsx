import React, { useState } from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import { Visualization } from './Visualization';
import { InvestigationNotes } from '../notes/InvestigationNotes';
import { WorkspaceEvidenceTab } from './WorkspaceEvidenceTab';
import { WorkspaceFindingTab } from './WorkspaceFindingTab';
import {
  BookmarkPlus,
  Table,
  BarChart3,
  Edit3,
  AlertCircle,
  Copy,
  Check,
  BookmarkCheck,
  FileText,
} from 'lucide-react';

interface QueryOutputProps {
  onOpenSaveEvidence: () => void;
}

export const QueryOutput: React.FC<QueryOutputProps> = ({ onOpenSaveEvidence }) => {
  const {
    currentResult,
    isExecuting,
    workspaceTab,
    setWorkspaceTab,
    evidenceList,
    activeCase,
    findings,
  } = useCaseStore();

  const [copied, setCopied] = useState(false);

  const caseEvidence = evidenceList.filter((e) => e.caseId === activeCase.id);
  const isSolved = findings[activeCase.id]?.verdict?.status === 'VERIFIED';
  const hasData = currentResult && !currentResult.error && currentResult.rows.length > 0;

  const copyAsCsv = async () => {
    if (!hasData || !currentResult) return;

    const escapeCell = (value: string | number | boolean | null) => {
      if (value === null || value === undefined) return '';
      const text = String(value);
      return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    };

    const lines = [
      currentResult.columns.map(escapeCell).join(','),
      ...currentResult.rows.map((row) => row.map(escapeCell).join(',')),
    ];

    await navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const tabButtonClass = (isActive: boolean) =>
    `flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm transition-colors cursor-pointer ${
      isActive
        ? 'bg-investigative-surface text-investigative-text font-medium shadow-xs border border-investigative-border/70'
        : 'text-investigative-text-muted hover:text-investigative-text'
    }`;

  return (
    <div className="h-full flex flex-col bg-investigative-surface/70 overflow-hidden">
      {/* Results & Evidence Header Tabs */}
      <div className="h-12 px-3 sm:px-4 border-b border-investigative-border/50 flex items-center justify-between bg-investigative-surface/50 shrink-0 gap-2 overflow-x-auto select-none">
        <div className="flex items-center space-x-1 bg-investigative-surface-raised/40 p-1 rounded-full border border-investigative-border/40 shrink-0">
          <button
            onClick={() => setWorkspaceTab('table')}
            className={tabButtonClass(workspaceTab === 'table')}
          >
            <Table className="w-4 h-4" />
            <span>Results</span>
          </button>

          <button
            onClick={() => setWorkspaceTab('evidence')}
            className={tabButtonClass(workspaceTab === 'evidence')}
          >
            <BookmarkCheck className="w-4 h-4 text-investigative-violet" />
            <span>Evidence</span>
            <span
              className={`text-[11px] font-mono px-1.5 py-0.2 rounded-full ${
                workspaceTab === 'evidence'
                  ? 'bg-investigative-violet-subtle text-investigative-violet font-semibold'
                  : 'bg-investigative-surface-raised text-investigative-text-muted'
              }`}
            >
              {caseEvidence.length}
            </span>
          </button>

          <button
            onClick={() => setWorkspaceTab('finding')}
            className={tabButtonClass(workspaceTab === 'finding')}
          >
            <FileText className="w-4 h-4" />
            <span>Finding</span>
            {isSolved && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs" title="Case Solved" />
            )}
          </button>

          <button
            onClick={() => setWorkspaceTab('chart')}
            className={tabButtonClass(workspaceTab === 'chart')}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden md:inline">Chart</span>
          </button>

          <button
            onClick={() => setWorkspaceTab('notes')}
            className={tabButtonClass(workspaceTab === 'notes')}
          >
            <Edit3 className="w-4 h-4" />
            <span className="hidden md:inline">Notes</span>
          </button>
        </div>

        {/* Stats & Actions when on Results tab */}
        <div className="flex items-center space-x-2 shrink-0">
          {workspaceTab === 'table' && currentResult && (
            <div className="hidden lg:flex items-center space-x-2 text-xs font-mono text-investigative-text-muted">
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

          {workspaceTab === 'table' && (
            <>
              <button
                onClick={copyAsCsv}
                disabled={!hasData || isExecuting}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs border border-investigative-border/70 text-investigative-text-muted hover:text-investigative-text hover:border-investigative-violet hover:bg-investigative-violet-subtle transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Copy result as CSV"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy CSV'}</span>
              </button>

              <button
                onClick={onOpenSaveEvidence}
                disabled={!hasData || isExecuting}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border border-investigative-border/70 hover:border-investigative-violet hover:bg-investigative-violet-subtle text-investigative-text transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs cursor-pointer"
                title="Save query and result to Evidence"
              >
                <BookmarkPlus className="w-3.5 h-3.5 text-investigative-violet" />
                <span>Save Evidence</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Tab Content Area */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {workspaceTab === 'chart' ? (
          <Visualization />
        ) : workspaceTab === 'notes' ? (
          <InvestigationNotes />
        ) : workspaceTab === 'evidence' ? (
          <WorkspaceEvidenceTab
            onGoToResults={() => setWorkspaceTab('table')}
            onGoToFinding={() => setWorkspaceTab('finding')}
          />
        ) : workspaceTab === 'finding' ? (
          <WorkspaceFindingTab
            onGoToEvidence={() => setWorkspaceTab('evidence')}
          />
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
