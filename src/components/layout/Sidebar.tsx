import React, { useState } from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import {
  Database,
  ChevronDown,
  ChevronRight,
  Play,
  Key,
  Columns,
  ArrowLeft,
  Info,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeCase,
    setActiveView,
    runSampleQuery,
  } = useCaseStore();

  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({
    [activeCase.tables[0]?.name || '']: true,
  });

  const toggleTable = (tableName: string) => {
    setExpandedTables((prev) => ({
      ...prev,
      [tableName]: !prev[tableName],
    }));
  };

  return (
    <aside className="w-80 h-full border-r border-investigative-border/60 bg-investigative-surface/80 flex flex-col shrink-0 select-none">
      {/* SIDEBAR HEADER */}
      <div className="h-12 px-4 border-b border-investigative-border/50 flex items-center justify-between bg-investigative-surface-raised/30 shrink-0">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-investigative-violet" />
          <span className="text-sm font-semibold text-investigative-text">
            Database Schema
          </span>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-investigative-surface-raised border border-investigative-border/60 text-investigative-text-muted">
          {activeCase.tables.length} {activeCase.tables.length === 1 ? 'table' : 'tables'}
        </span>
      </div>

      {/* ACTIVE CASE CONTEXT */}
      <div className="p-3 border-b border-investigative-border/50 bg-investigative-surface/40 shrink-0 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-investigative-text-muted">Target DB:</span>
          <span className="font-semibold text-investigative-text bg-investigative-surface-raised px-2 py-0.5 rounded border border-investigative-border/50">
            {activeCase.id}_pg
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-mono font-medium text-investigative-violet bg-investigative-violet-subtle border border-investigative-violet/20 px-2 py-0.5 rounded-full">
            {activeCase.code}
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-investigative-border/60 text-investigative-text-muted">
            {activeCase.category}
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-investigative-border/60 text-investigative-text-muted">
            {activeCase.difficulty}
          </span>
        </div>
      </div>

      {/* DATABASE TABLES EXPLORER FOR THIS CASE */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {activeCase.tables.map((table) => {
          const isExpanded = !!expandedTables[table.name];
          return (
            <div
              key={table.name}
              className="border border-investigative-border/60 rounded-xl overflow-hidden bg-investigative-surface transition-colors"
            >
              <div
                onClick={() => toggleTable(table.name)}
                className="px-3.5 py-2.5 flex items-center justify-between cursor-pointer hover:bg-investigative-surface-raised transition-colors"
              >
                <div className="flex items-center space-x-2 text-sm font-mono font-semibold text-investigative-text min-w-0">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-investigative-text-muted shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-investigative-text-muted shrink-0" />
                  )}
                  <span className="truncate">{table.name}</span>
                  <span className="text-xs text-investigative-text-muted font-normal shrink-0">
                    ({table.rowCount})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    runSampleQuery(table.name);
                    setActiveView('workspace');
                  }}
                  title={`Run sample SELECT query on ${table.name}`}
                  className="p-1 rounded-lg text-investigative-text-muted hover:text-investigative-violet hover:bg-investigative-violet-subtle transition-colors shrink-0"
                >
                  <Play className="w-3.5 h-3.5" />
                </button>
              </div>

              {isExpanded && (
                <div className="px-3.5 py-2.5 bg-investigative-surface-raised/40 border-t border-investigative-border/50 space-y-2">
                  {table.description && (
                    <p className="text-xs text-investigative-text-muted mb-2 leading-relaxed flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-investigative-violet shrink-0 mt-0.5" />
                      <span>{table.description}</span>
                    </p>
                  )}
                  <div className="space-y-1">
                    {table.columns.map((col) => (
                      <div
                        key={col.name}
                        className="flex items-center justify-between text-xs font-mono py-1 border-b border-investigative-border/20 last:border-b-0 text-investigative-text-muted hover:text-investigative-text"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          {col.isPrimary ? (
                            <span title="Primary Key">
                              <Key className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            </span>
                          ) : col.isForeign ? (
                            <span title={`Foreign Key: ${col.foreignTable || ''}`}>
                              <Key className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                            </span>
                          ) : (
                            <Columns className="w-3.5 h-3.5 text-investigative-border-muted shrink-0" />
                          )}
                          <span className="truncate">{col.name}</span>
                        </div>
                        <span className="text-[10px] text-investigative-text-muted/70 uppercase shrink-0 ml-2">
                          {col.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER: BACK TO DASHBOARD ACTION */}
      <div className="p-3 border-t border-investigative-border/60 bg-investigative-surface-raised/20 shrink-0">
        <button
          onClick={() => setActiveView('landing')}
          className="w-full flex items-center justify-center space-x-2 py-2 rounded-full bg-investigative-surface-raised border border-investigative-border/70 text-investigative-text hover:text-white hover:bg-investigative-violet hover:border-investigative-violet text-sm font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>
    </aside>
  );
};
