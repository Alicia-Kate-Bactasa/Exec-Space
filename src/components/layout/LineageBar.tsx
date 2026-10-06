import React from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import { Database, Terminal, Table, Sparkles, ArrowRight } from 'lucide-react';

export const LineageBar: React.FC = () => {
  const { activeCase, currentSql, currentResult, activeView } = useCaseStore();

  // Detect which tables are mentioned in the SQL query
  const detectedTables = activeCase.tables.filter((t) =>
    new RegExp(`\\b${t.name}\\b`, 'i').test(currentSql)
  );

  const primaryTableName = detectedTables.length > 0
    ? detectedTables.map((t) => t.name).join(', ')
    : activeCase.tables[0]?.name || 'Database';

  const rowCountText = currentResult
    ? currentResult.error
      ? 'Execution Error'
      : `${currentResult.rowCount} Rows`
    : 'Pending Query';

  return (
    <div className="h-9 bg-investigative-surface/40 border-b border-investigative-border/60 px-4 flex items-center justify-between text-xs overflow-x-auto select-none shrink-0">
      <div className="flex items-center space-x-2 text-investigative-text-muted font-mono">
        <span className="text-[10px] tracking-wider uppercase font-semibold text-investigative-text-muted/60">
          DATA LINEAGE:
        </span>

        {/* Step 1: Source Table */}
        <div className="flex items-center space-x-1.5 bg-investigative-surface-raised border border-investigative-border/60 px-2 py-0.5 rounded-md text-investigative-text">
          <Database className="w-3 h-3 text-investigative-violet" />
          <span className="font-medium">{primaryTableName}</span>
        </div>

        <ArrowRight className="w-3 h-3 text-investigative-border-muted" />

        {/* Step 2: Query Filter / Aggregation */}
        <div className="flex items-center space-x-1.5 bg-investigative-surface-raised border border-investigative-border/60 px-2 py-0.5 rounded-md text-investigative-text">
          <Terminal className="w-3 h-3 text-investigative-text-muted" />
          <span>SQL Query</span>
        </div>

        <ArrowRight className="w-3 h-3 text-investigative-border-muted" />

        {/* Step 3: Result Set */}
        <div className={`flex items-center space-x-1.5 bg-investigative-surface-raised border px-2 py-0.5 rounded-md ${
          currentResult?.error
            ? 'border-violet-500/50 text-violet-300'
            : 'border-investigative-border/60 text-investigative-text'
        }`}>
          <Table className="w-3 h-3 text-investigative-text-muted" />
          <span>{rowCountText}</span>
        </div>

        <ArrowRight className="w-3 h-3 text-investigative-border-muted" />

        {/* Step 4: Destination */}
        <div className="flex items-center space-x-1.5 bg-investigative-violet-subtle border border-investigative-violet/30 px-2 py-0.5 rounded-md text-investigative-text">
          <Sparkles className="w-3 h-3 text-investigative-violet" />
          <span>
            {activeView === 'evidence'
              ? 'Evidence Board'
              : activeView === 'finding'
              ? 'Final Finding'
              : 'Results Table / Chart'}
          </span>
        </div>
      </div>
    </div>
  );
};
