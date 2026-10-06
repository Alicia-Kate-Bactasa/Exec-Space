import React from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import { BookmarkCheck, Trash2, ArrowRight, Table, Terminal, FileText, Plus } from 'lucide-react';

export const EvidenceBoard: React.FC = () => {
  const { evidenceList, removeEvidence, setActiveView, activeCase } = useCaseStore();

  const caseEvidence = evidenceList.filter((e) => e.caseId === activeCase.id);

  return (
    <div className="h-full flex flex-col p-6 bg-investigative-bg overflow-y-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-investigative-border mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <BookmarkCheck className="w-5 h-5 text-investigative-red" />
            <h1 className="text-lg font-bold text-investigative-text">
              Evidence Board
            </h1>
            <span className="text-xs font-mono bg-investigative-surface-raised border border-investigative-border px-2 py-0.5 rounded text-investigative-text-muted">
              {caseEvidence.length} items pinned for {activeCase.code}
            </span>
          </div>
          <p className="text-xs text-investigative-text-muted">
            Saved database queries, aggregated records, and notes to substantiate your final finding.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveView('workspace')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs border border-investigative-border text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Investigate More</span>
          </button>
          <button
            onClick={() => setActiveView('finding')}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded text-xs font-medium bg-investigative-red text-white hover:bg-investigative-red-hover transition-colors shadow-sm"
          >
            <span>Proceed to Finding</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid of Evidence Cards */}
      {caseEvidence.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center border border-dashed border-investigative-border rounded-lg bg-investigative-surface/30">
          <BookmarkCheck className="w-10 h-10 text-investigative-border-muted mb-3" />
          <h2 className="text-sm font-semibold text-investigative-text mb-1">No Evidence Pinned Yet</h2>
          <p className="text-xs text-investigative-text-muted max-w-md mb-4">
            Run queries in the Investigation Workspace, inspect anomalies, and click <span className="font-semibold text-investigative-text">"Save Evidence"</span> to pin findings here.
          </p>
          <button
            onClick={() => setActiveView('workspace')}
            className="px-3 py-1.5 rounded text-xs bg-investigative-surface-raised border border-investigative-border text-investigative-text hover:border-investigative-red transition-colors"
          >
            Open Investigation Workspace
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {caseEvidence.map((item) => (
            <div
              key={item.id}
              className="bg-investigative-surface border border-investigative-border rounded-lg p-4 flex flex-col justify-between hover:border-investigative-border-muted transition-colors shadow-xs"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h2 className="text-xs font-bold text-investigative-text leading-snug">
                    {item.title}
                  </h2>
                  <button
                    onClick={() => removeEvidence(item.id)}
                    className="text-investigative-text-muted hover:text-rose-500 p-1 rounded transition-colors"
                    title="Remove evidence"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Note */}
                {item.note && (
                  <div className="text-xs text-investigative-text/90 bg-investigative-surface-raised/50 border border-investigative-border/50 p-2.5 rounded mb-3 leading-relaxed">
                    <p className="text-[10px] uppercase font-mono text-investigative-text-muted mb-1 flex items-center space-x-1">
                      <FileText className="w-3 h-3 text-investigative-red" />
                      <span>Detective Note:</span>
                    </p>
                    {item.note}
                  </div>
                )}

                {/* SQL Code Snippet */}
                <div className="bg-investigative-surface-raised border border-investigative-border rounded p-2 mb-3 font-mono text-[11px] overflow-x-auto text-investigative-text">
                  <div className="flex items-center space-x-1 text-[10px] text-investigative-text-muted mb-1">
                    <Terminal className="w-3 h-3" />
                    <span>SQL Query</span>
                  </div>
                  <pre className="text-[11px] whitespace-pre-wrap leading-tight text-investigative-text/90">
                    {item.query}
                  </pre>
                </div>

                {/* Data Preview Table */}
                <div className="border border-investigative-border rounded overflow-hidden mb-3">
                  <div className="bg-investigative-surface-raised/80 px-2 py-1 text-[10px] font-mono text-investigative-text-muted flex justify-between border-b border-investigative-border">
                    <span>Result Preview</span>
                    <span>{item.resultPreview.totalRows} rows captured</span>
                  </div>
                  <div className="overflow-x-auto max-h-36">
                    <table className="w-full text-left text-[10px] font-mono border-collapse">
                      <thead className="bg-investigative-surface text-investigative-text-muted border-b border-investigative-border">
                        <tr>
                          {item.resultPreview.columns.slice(0, 4).map((col) => (
                            <th key={col} className="p-1.5 font-semibold truncate">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-investigative-border/50 text-investigative-text">
                        {item.resultPreview.sampleRows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.slice(0, 4).map((cell, cIdx) => (
                              <td key={cIdx} className="p-1.5 truncate max-w-[120px]">
                                {cell === null ? 'NULL' : String(cell)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-investigative-border/50 flex items-center justify-between text-[10px] font-mono text-investigative-text-muted">
                <span>Pinned at {item.createdAt}</span>
                <span className="text-emerald-500 font-semibold">Evidence #{item.id.substring(3, 7)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
