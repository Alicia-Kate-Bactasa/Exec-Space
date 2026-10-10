import React, { useMemo, useState } from 'react';
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
  Search,
  CheckCircle2,
} from 'lucide-react';

const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'] as const;

export const Sidebar: React.FC = () => {
  const {
    cases,
    activeCase,
    selectCase,
    activeView,
    setActiveView,
    evidenceList,
    findings,
    runSampleQuery,
    sidebarTab,
    setSidebarTab,
  } = useCaseStore();

  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({
    [activeCase.tables[0]?.name || '']: true,
  });
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState<(typeof LEVELS)[number]>('All');

  const toggleTable = (tableName: string) => {
    setExpandedTables((prev) => ({
      ...prev,
      [tableName]: !prev[tableName],
    }));
  };

  const isSolved = (id: string) => findings[id]?.verdict?.status === 'VERIFIED';

  const filteredCases = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cases.filter((c) => {
      if (level !== 'All' && c.difficulty !== level) return false;
      if (!q) return true;
      return `${c.code} ${c.title} ${c.summary}`.toLowerCase().includes(q);
    });
  }, [cases, query, level]);

  return (
    <aside className="w-80 h-full border-r border-investigative-border/60 bg-investigative-surface/80 flex flex-col shrink-0 select-none">
      {/* SIDEBAR TABS: CASES vs DATABASE */}
      <div className="h-12 px-3 border-b border-investigative-border/50 flex items-center space-x-2 bg-investigative-surface-raised/30 shrink-0">
        <button
          onClick={() => setSidebarTab('cases')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-full text-sm transition-colors font-medium ${
            sidebarTab === 'cases'
              ? 'bg-investigative-surface text-investigative-text font-semibold border border-investigative-border/70'
              : 'text-investigative-text-muted hover:text-investigative-text'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span>Cases ({cases.length})</span>
        </button>

        <button
          onClick={() => setSidebarTab('database')}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-full text-sm transition-colors font-medium ${
            sidebarTab === 'database'
              ? 'bg-investigative-surface text-investigative-text font-semibold border border-investigative-border/70'
              : 'text-investigative-text-muted hover:text-investigative-text'
          }`}
        >
          <Database className="w-4 h-4 text-investigative-violet" />
          <span>Database</span>
        </button>
      </div>

      {/* CONTENT: CASES LIST with search + level filter */}
      {sidebarTab === 'cases' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          <div className="flex items-center gap-2 bg-investigative-surface border border-investigative-border/60 rounded-full px-3 py-2">
            <Search className="w-3.5 h-3.5 text-investigative-text-muted shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sets..."
              className="w-full bg-transparent text-xs outline-none placeholder:text-investigative-text-muted/60"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap px-0.5">
            {LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
                  level === l
                    ? 'bg-investigative-violet text-white border-investigative-violet'
                    : 'border-investigative-border/60 text-investigative-text-muted hover:text-investigative-text'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          {filteredCases.map((c) => {
            const isSelected = activeCase.id === c.id;
            const solved = isSolved(c.id);
            return (
              <button
                key={c.id}
                onClick={() => {
                  selectCase(c.id);
                  setActiveView('workspace');
                }}
                className={`w-full text-left p-3.5 rounded-xl transition-all flex flex-col border ${
                  isSelected
                    ? 'bg-investigative-surface-raised border-investigative-violet/80'
                    : 'bg-investigative-surface border-investigative-border/50 hover:bg-investigative-surface-raised/50 hover:border-investigative-border/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-mono font-semibold flex items-center gap-1.5 ${
                    isSelected ? 'text-investigative-violet' : 'text-investigative-text-muted'
                  }`}>
                    {solved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                    {c.code}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-lg font-mono font-medium ${
                    c.difficulty === 'Beginner'
                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                      : c.difficulty === 'Intermediate'
                      ? 'bg-violet-500/10 text-violet-500 border border-violet-500/20'
                      : 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                  }`}>
                    {c.difficulty}
                  </span>
                </div>
                <div className="text-sm font-semibold text-investigative-text mb-1">
                  {c.title}
                </div>
                <div className="text-xs text-investigative-text-muted line-clamp-2 leading-relaxed">
                  {c.summary}
                </div>
              </button>
            );
          })}
          {filteredCases.length === 0 && (
            <div className="text-xs text-investigative-text-muted text-center p-4">
              No sets match your search.
            </div>
          )}
        </div>
      )}

      {/* CONTENT: DATABASE EXPLORER */}
      {sidebarTab === 'database' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          <div className="p-3 bg-investigative-surface-raised/40 border border-investigative-border/60 rounded-xl flex items-center justify-between text-xs font-mono">
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
                className="border border-investigative-border/60 rounded-xl overflow-hidden bg-investigative-surface"
              >
                <div
                  onClick={() => toggleTable(table.name)}
                  className="px-3.5 py-2.5 flex items-center justify-between cursor-pointer hover:bg-investigative-surface-raised transition-colors"
                >
                  <div className="flex items-center space-x-2 text-sm font-mono font-semibold text-investigative-text">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-investigative-text-muted" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-investigative-text-muted" />
                    )}
                    <span>{table.name}</span>
                    <span className="text-xs text-investigative-text-muted font-normal">
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
                    className="p-1 rounded-lg text-investigative-text-muted hover:text-investigative-violet hover:bg-investigative-violet-subtle transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isExpanded && (
                  <div className="px-3.5 py-2.5 bg-investigative-surface-raised/40 border-t border-investigative-border/50 space-y-2">
                    <p className="text-xs text-investigative-text-muted mb-2 leading-relaxed">
                      {table.description}
                    </p>
                    {table.columns.map((col) => (
                      <div
                        key={col.name}
                        className="flex items-center justify-between text-xs font-mono py-1 border-b border-investigative-border/20 last:border-b-0 text-investigative-text-muted hover:text-investigative-text"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          {col.isPrimary ? (
                            <Key className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          ) : col.isForeign ? (
                            <Key className="w-3.5 h-3.5 text-violet-500 shrink-0" />
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
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* FOOTER NAVIGATION */}
      <div className="p-3 border-t border-investigative-border/60 bg-investigative-surface-raised/20 space-y-1.5 shrink-0">
        <button
          onClick={() => setActiveView('workspace')}
          className={`w-full flex items-center justify-between px-4 py-2 rounded-full text-sm transition-colors ${
            activeView === 'workspace'
              ? 'bg-investigative-violet text-white font-medium'
              : 'text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            <BookOpen className="w-4 h-4" />
            <span>Investigation</span>
          </div>
        </button>

        <button
          onClick={() => setActiveView('evidence')}
          className={`w-full flex items-center justify-between px-4 py-2 rounded-full text-sm transition-colors ${
            activeView === 'evidence'
              ? 'bg-investigative-violet text-white font-medium'
              : 'text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            <BookmarkCheck className="w-4 h-4" />
            <span>Evidence</span>
          </div>
          <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${
            activeView === 'evidence' ? 'bg-white/20 text-white' : 'bg-investigative-border/60 text-investigative-text-muted'
          }`}>
            {evidenceList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveView('finding')}
          className={`w-full flex items-center justify-between px-4 py-2 rounded-full text-sm transition-colors ${
            activeView === 'finding'
              ? 'bg-investigative-violet text-white font-medium'
              : 'text-investigative-text-muted hover:text-investigative-text hover:bg-investigative-surface-raised'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            <FileText className="w-4 h-4" />
            <span>Finding</span>
          </div>
        </button>
      </div>
    </aside>
  );
};
