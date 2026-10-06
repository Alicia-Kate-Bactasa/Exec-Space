import React, { useState } from 'react';
import { useCaseStore } from '../../store/useCaseStore';
import {
  Database,
  ChevronDown,
  ChevronRight,
  Play,
  BookOpen,
  BookmarkCheck,
  FileText,
  Key,
  Columns,
  FolderOpen,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    cases,
    activeCase,
    selectCase,
    activeView,
    setActiveView,
    evidenceList,
    runSampleQuery,
    sidebarTab,
    setSidebarTab,
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
      {/* SIDEBAR TABS: CASES vs DATABASE */}
      <div className="h-11 px-3 border-b border-investigative-border/50 flex items-center space-x-1.5 bg-investigative-surface-raised/30 shrink-0">
        <button
          onClick={() => setSidebarTab('cases')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-md text-xs transition-colors font-mono ${
            sidebarTab === 'cases'
              ? 'bg-investigative-surface text-investigative-text font-semibold border border-investigative-border/70 shadow-xs'
              : 'text-investigative-text-muted hover:text-investigative-text'
          }`}
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span>Cases ({cases.length})</span>
        </button>

        <button
          onClick={() => setSidebarTab('database')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-md text-xs transition-colors font-mono ${
            sidebarTab === 'database'
              ? 'bg-investigative-surface text-investigative-text font-semibold border border-investigative-border/70 shadow-xs'
              : 'text-investigative-text-muted hover:text-investigative-text'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-investigative-violet" />
          <span>Database</span>
        </button>
      </div>

      {/* CONTENT: CASES LIST */}
      {sidebarTab === 'cases' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cases.map((c) => {
            const isSelected = activeCase.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  selectCase(c.id);
                  setActiveView('workspace');
                }}
                className={`w-full text-left p-3 rounded-lg transition-all flex flex-col border ${
                  isSelected
                    ? 'bg-investigative-surface-raised border-investigative-violet/80 shadow-xs'
                    : 'bg-investigative-surface border-investigative-border/50 hover:bg-investigative-surface-raised/50 hover:border-investigative-border/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[11px] font-mono font-semibold ${
                    isSelected ? 'text-investigative-violet' : 'text-investigative-text-muted'
                  }`}>
                    {c.code}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-medium ${
                    c.difficulty === 'Beginner'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : c.difficulty === 'Intermediate'
                      ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                      : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  }`}>
                    {c.difficulty}
                  </span>
                </div>
                <div className="text-xs font-semibold text-investigative-text mb-1">
                  {c.title}
                </div>
                <div className="text-[11px] text-investigative-text-muted line-clamp-2 leading-relaxed">
                  {c.summary}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* CONTENT: DATABASE EXPLORER */}
      {sidebarTab === 'database' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          <div className="p-2.5 bg-investigative-surface-raised/40 border border-investigative-border/60 rounded-md flex items-center justify-between text-xs font-mono">
            <span className="text-investigative-text-muted">Target DB:</span>
            <span className="font-semibold text-investigative-text">
              {activeCase.id}_pg
            </span>
          </div>

          {activeCase.tables.map((table) => {
            const isExpanded = !!expandedTables[table.name];
            return (
              <div
                key={table.name}
                className="border border-investigative-border/60 rounded-lg overflow-hidden bg-investigative-surface"
              >
                <div
                  onClick={() => toggleTable(table.name)}
                  className="px-3 py-2.5 flex items-center justify-between cursor-pointer hover:bg-investigative-surface-raised transition-colors"
                >
                  <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-investigative-text">
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
                      setActiveView('workspace');
                    }}
                    title={`Sample 10 rows from ${table.name}`}
                    className="p-1 rounded-md text-investigative-text-muted hover:text-investigative-violet hover:bg-investigative-violet-subtle transition-colors"
                  >
                    <Play className="w-3 h-3" />
                  </button>
                </div>

                {isExpanded && (
                  <div className="px-3 py-2 bg-investigative-surface-raised/40 border-t border-investigative-border/50 space-y-1.5">
                    <p className="text-[11px] text-investigative-text-muted mb-2 leading-relaxed">
                      {table.description}
                    </p>
                    {table.columns.map((col) => (
                      <div
                        key={col.name}
                        className="flex items-center justify-between text-xs font-mono py-1 border-b border-investigative-border/20 last:border-b-0 text-investigative-text-muted hover:text-investigative-text"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          {col.isPrimary ? (
                            <Key className="w-3 h-3 text-amber-400 shrink-0" />
                          ) : col.isForeign ? (
                            <Key className="w-3 h-3 text-violet-400 shrink-0" />
                          ) : (
                            <Columns className="w-3 h-3 text-investigative-border-muted shrink-0" />
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
      )}

      {/* FOOTER NAVIGATION */}
      <div className="p-2.5 border-t border-investigative-border/60 bg-investigative-surface-raised/20 space-y-1 shrink-0">
        <button
          onClick={() => setActiveView('workspace')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors ${
            activeView === 'workspace'
              ? 'bg-investigative-violet text-white font-medium shadow-xs'
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
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors ${
            activeView === 'evidence'
              ? 'bg-investigative-violet text-white font-medium shadow-xs'
              : 'text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised'
          }`}
        >
          <div className="flex items-center space-x-2">
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Evidence Board</span>
          </div>
          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
            activeView === 'evidence' ? 'bg-white/20 text-white' : 'bg-investigative-border/60 text-investigative-text-muted'
          }`}>
            {evidenceList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveView('finding')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs transition-colors ${
            activeView === 'finding'
              ? 'bg-investigative-violet text-white font-medium shadow-xs'
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
