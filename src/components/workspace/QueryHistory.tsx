import React from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import { Clock, Play, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface QueryHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QueryHistory: React.FC<QueryHistoryProps> = ({ isOpen, onClose }) => {
  const { history, setCurrentSql, executeQuery } = useCaseStore();

  if (!isOpen) return null;

  const handleSelectQuery = (query: string) => {
    setCurrentSql(query);
  };

  const handleReRunQuery = async (query: string) => {
    setCurrentSql(query);
    await executeQuery();
  };

  return (
    <div className="absolute right-0 top-10 bottom-0 w-80 bg-investigative-surface border-l border-investigative-border shadow-xl z-20 flex flex-col animate-slideLeft">
      <div className="p-3 border-b border-investigative-border flex items-center justify-between bg-investigative-surface-raised/40">
        <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-investigative-text">
          <Clock className="w-3.5 h-3.5 text-investigative-red" />
          <span>QUERY HISTORY</span>
        </div>
        <button
          onClick={onClose}
          className="text-investigative-text-muted hover:text-investigative-text p-1 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-xs text-investigative-text-muted">
            No queries executed yet.
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="p-2.5 rounded bg-investigative-surface-raised/30 border border-investigative-border hover:border-investigative-border-muted transition-colors text-xs font-mono"
            >
              <div className="flex items-center justify-between text-[10px] text-investigative-text-muted mb-1.5">
                <div className="flex items-center space-x-1">
                  {item.status === 'success' ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-rose-500" />
                  )}
                  <span>{item.timestamp}</span>
                </div>
                <span>{item.executionTimeMs} ms · {item.rowCount} rows</span>
              </div>

              <div
                onClick={() => handleSelectQuery(item.query)}
                className="text-investigative-text text-[11px] line-clamp-3 cursor-pointer bg-investigative-surface p-1.5 rounded border border-investigative-border/50 hover:border-investigative-red/50 transition-colors mb-2 font-mono"
              >
                {item.query}
              </div>

              <div className="flex items-center justify-end space-x-1">
                <button
                  onClick={() => handleSelectQuery(item.query)}
                  className="px-2 py-0.5 rounded text-[10px] border border-investigative-border text-investigative-text-muted hover:text-investigative-text"
                >
                  Load to Editor
                </button>
                <button
                  onClick={() => handleReRunQuery(item.query)}
                  className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] bg-investigative-red text-white hover:bg-investigative-red-hover"
                >
                  <Play className="w-2.5 h-2.5" />
                  <span>Re-run</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
