import React, { useState } from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import { Database, ChevronDown, ChevronRight, Play, BookOpen, BookmarkCheck, FileText, Key, Columns } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    cases,
    activeCase,
    selectCase,
    activeView,
    setActiveView,
    evidenceList,
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
    <aside className="w-80 h-full border-r border-investigative-border bg-investigative-surface flex flex-col shrink-0 select-none">
      {/* CASES LIST SECTION */}
      <div className="flex-1 overflow-y-auto border-b border-investigative-border flex flex-col min-h-0">
        <div className="p-3 border-b border-investigative-border/70 flex items-center justify-between bg-investigative-surface/80 sticky top-0 z-10 backdrop-blur-sm">
          <span className="text-xs font-mono font-bold tracking-wider text-investigative-text uppercase">
            Cases
          </span>
          <span className="text-[10px] font-mono bg-investigative-surface-raised border border-investigative-border px-1.5 py-0.5 rounded text-investigative-text-muted">
            {cases.length} Available
          </span>
        </div>

        <div className="p-2 space-y-1.5 overflow-y-auto">
          {cases.map((c) => {
            const isSelected = activeCase.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => selectCase(c.id)}
                className={`w-full text-left p-2.5 rounded transition-all flex flex-col border ${
                  isSelected
                    ? 'bg-investigative-surface-raised border-investigative-red shadow-sm'
                    : 'bg-transparent border-transparent hover:bg-investigative-surface-raised/50 hover:border-investigative-border'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[11px] font-mono font-bold ${isSelected ? 'text-investigative-red' : 'text-investigative-text-muted'}`}>
                    {c.code}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    c.difficulty === 'Beginner'
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : c.difficulty === 'Intermediate'
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                  }`}>
                    {c.difficulty}
                  </span>
                </div>
                <div className="text-xs font-medium text-investigative-text line-clamp-1 mb-1">
                  {c.title}
                </div>
                <div className="text-[11px] text-investigative-text-muted line-clamp-1">
                  {c.category}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* DATABASE EXPLORER SECTION */}
      <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
        <div className="p-3 border-b border-investigative-border/70 flex items-center justify-between bg-investigative-surface/80 sticky top-0 z-10 backdrop-blur-sm">
          <div className="flex items-center space-x-1.5">
            <Database className="w-3.5 h-3.5 text-investigative-red" />
            <span className="text-xs font-mono font-bold tracking-wider text-investigative-text uppercase">
              Database
            </span>
          </div>
          <span className="text-[10px] font-mono text-investigative-text-muted">
            PostgreSQL (PGlite)
          </span>
        </div>

        <div className="p-2 space-y-1.5 overflow-y-auto">
          {activeCase.tables.map((table) => {
            const isExpanded = !!expandedTables[table.name];
            return (
              <div
                key={table.name}
                className="border border-investigative-border/60 rounded overflow-hidden bg-investigative-surface/40"
              >
                <div
                  onClick={() => toggleTable(table.name)}
                  className="px-2.5 py-2 flex items-center justify-between cursor-pointer hover:bg-investigative-surface-raised transition-colors"
                >
                  <div className="flex items-center space-x-1.5 text-xs font-mono font-medium text-investigative-text">
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-investigative-text-muted" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-investigative-text-muted" />
                    )}
                    <span>{table.name}</span>
                    <span className="text-[10px] text-investigative-text-muted font-normal">
                      ({table.rowCount} rows)
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      runSampleQuery(table.name);
                    }}
                    title={`Sample 5 rows from ${table.name}`}
                    className="p-1 rounded text-investigative-text-muted hover:text-investigative-red hover:bg-investigative-red-subtle transition-colors"
                  >
                    <Play className="w-3 h-3" />
                  </button>
                </div>

                {isExpanded && (
                  <div className="px-3 py-1.5 bg-investigative-surface-raised/40 border-t border-investigative-border/40 space-y-1">
                    <p className="text-[10px] text-investigative-text-muted mb-1.5 italic">
                      {table.description}
                    </p>
                    {table.columns.map((col) => (
                      <div
                        key={col.name}
                        className="flex items-center justify-between text-[11px] font-mono py-0.5 text-investigative-text-muted hover:text-investigative-text"
                      >
                        <div className="flex items-center space-x-1.5 truncate">
                          {col.isPrimary ? (
                            <Key className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                          ) : col.isForeign ? (
                            <Key className="w-2.5 h-2.5 text-blue-400 shrink-0" />
                          ) : (
                            <Columns className="w-2.5 h-2.5 text-investigative-border-muted shrink-0" />
                          )}
                          <span className="truncate">{col.name}</span>
                        </div>
                        <span className="text-[10px] text-investigative-text-muted/70 uppercase shrink-0 ml-2">
                          {col.type}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER NAVIGATION */}
      <div className="p-2 border-t border-investigative-border bg-investigative-surface-raised/30 space-y-1 shrink-0">
        <button
          onClick={() => setActiveView('workspace')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs transition-colors ${
            activeView === 'workspace'
              ? 'bg-investigative-red text-white font-medium'
              : 'text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised'
          }`}
        >
          <div className="flex items-center space-x-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Investigation</span>
          </div>
        </button>

        <button
          onClick={() => setActiveView('evidence')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs transition-colors ${
            activeView === 'evidence'
              ? 'bg-investigative-red text-white font-medium'
              : 'text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised'
          }`}
        >
          <div className="flex items-center space-x-2">
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Evidence Board</span>
          </div>
          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
            activeView === 'evidence' ? 'bg-white/20 text-white' : 'bg-investigative-border text-investigative-text-muted'
          }`}>
            {evidenceList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveView('finding')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs transition-colors ${
            activeView === 'finding'
              ? 'bg-investigative-red text-white font-medium'
              : 'text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised'
          }`}
        >
          <div className="flex items-center space-x-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Final Finding</span>
          </div>
        </button>
      </div>
    </aside>
  );
};
