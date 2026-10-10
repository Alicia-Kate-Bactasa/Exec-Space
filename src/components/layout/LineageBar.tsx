import React from 'react';
import { useCaseStore } from '../../store/useCaseStore';

// Minimal one-line breadcrumb: case -> table -> result. No animation.
export const LineageBar: React.FC = () => {
  const { activeCase, currentSql, currentResult, activeView } = useCaseStore();

  const detectedTables = activeCase.tables.filter((t) =>
    new RegExp(`\\b${t.name}\\b`, 'i').test(currentSql)
  );

  const tableName =
    detectedTables.length > 0
      ? detectedTables.map((t) => t.name).join(', ')
      : activeCase.tables[0]?.name || 'Database';

  const resultText = currentResult
    ? currentResult.error
      ? 'Error'
      : `${currentResult.rowCount} rows`
    : 'No query yet';

  const dest =
    activeView === 'evidence'
      ? 'Evidence'
      : activeView === 'finding'
      ? 'Finding'
      : 'Results';

  return (
    <div className="h-9 bg-investigative-surface/40 border-b border-investigative-border/60 px-4 flex items-center text-xs font-mono text-investigative-text-muted overflow-x-auto select-none shrink-0 whitespace-nowrap">
      <span>{activeCase.code}</span>
      <span className="mx-2 text-investigative-border-muted">/</span>
      <span>{tableName}</span>
      <span className="mx-2 text-investigative-border-muted">/</span>
      <span>{resultText}</span>
      <span className="mx-2 text-investigative-border-muted">/</span>
      <span className="text-investigative-text">{dest}</span>
    </div>
  );
};
