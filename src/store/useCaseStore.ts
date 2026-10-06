import { create } from 'zustand';
import { CASE_LIST } from '../db/casesData';
import { dbManager } from '../db/pglite';
import {
  ActiveView,
  CaseDefinition,
  EvidenceItem,
  FindingSubmission,
  InvestigationStep,
  QueryHistoryItem,
  QueryResult,
} from '../types';

interface CaseStoreState {
  cases: CaseDefinition[];
  activeCase: CaseDefinition;
  activeView: ActiveView;
  currentStep: InvestigationStep;
  currentSql: string;
  currentResult: QueryResult | null;
  history: QueryHistoryItem[];
  evidenceList: EvidenceItem[];
  notes: Record<string, string>;
  findings: Record<string, FindingSubmission>;
  theme: 'dark' | 'light';
  sidebarTab: 'cases' | 'database';
  isExecuting: boolean;
  isDbReady: boolean;
  dbError: string | null;

  // Actions
  setSidebarTab: (tab: 'cases' | 'database') => void;
  selectCase: (caseId: string) => Promise<void>;
  setActiveView: (view: ActiveView) => void;
  setCurrentStep: (step: InvestigationStep) => void;
  setCurrentSql: (sql: string) => void;
  executeQuery: () => Promise<QueryResult>;
  runSampleQuery: (tableName: string) => Promise<void>;
  addEvidence: (item: Omit<EvidenceItem, 'id' | 'createdAt'>) => void;
  removeEvidence: (id: string) => void;
  setNotes: (text: string) => void;
  submitFinding: (finding: {
    culprit: string;
    discrepancy: string;
    explanation: string;
    selectedEvidenceIds: string[];
  }) => FindingSubmission;
  toggleTheme: () => void;
  resetCurrentCase: () => Promise<void>;
}

// Load initial theme from localStorage or system preference
const getInitialTheme = (): 'dark' | 'light' => {
  const saved = localStorage.getItem('execspace_theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

// Initial state setup
export const useCaseStore = create<CaseStoreState>((set, get) => ({
  cases: CASE_LIST,
  activeCase: CASE_LIST[0], // Default to Case #04
  activeView: 'workspace',
  currentStep: 'cases',
  currentSql: CASE_LIST[0].initialSql,
  currentResult: null,
  history: [],
  evidenceList: [],
  notes: {},
  findings: {},
  theme: getInitialTheme(),
  sidebarTab: 'cases',
  isExecuting: false,
  isDbReady: false,
  dbError: null,

  setSidebarTab: (tab) => set({ sidebarTab: tab }),

  selectCase: async (caseId: string) => {
    const selected = get().cases.find((c) => c.id === caseId) || get().cases[0];
    set({
      activeCase: selected,
      currentSql: selected.initialSql,
      currentResult: null,
      isDbReady: false,
      dbError: null,
      currentStep: 'schema',
      sidebarTab: 'database',
    });

    try {
      await dbManager.initCase(selected.id, selected.dbSchemaSql);
      set({ isDbReady: true });
    } catch (err: any) {
      set({ dbError: err?.message || 'Failed to initialize database' });
    }
  },

  setActiveView: (view: ActiveView) => set({ activeView: view }),

  setCurrentStep: (step: InvestigationStep) => set({ currentStep: step }),

  setCurrentSql: (sql: string) => set({ currentSql: sql }),

  executeQuery: async () => {
    const { currentSql, activeCase, history } = get();
    set({ isExecuting: true });

    const result = await dbManager.runQuery(currentSql);

    const historyItem: QueryHistoryItem = {
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      caseId: activeCase.id,
      query: currentSql,
      rowCount: result.rowCount,
      executionTimeMs: result.executionTimeMs,
      status: result.error ? 'error' : 'success',
      timestamp: result.executedAt,
      errorMessage: result.error,
    };

    set({
      currentResult: result,
      isExecuting: false,
      history: [historyItem, ...history.slice(0, 49)], // Keep up to 50 items
      currentStep: result.error ? 'query' : 'results',
    });

    return result;
  },

  runSampleQuery: async (tableName: string) => {
    const sampleSql = `SELECT * FROM ${tableName} LIMIT 10;`;
    set({ currentSql: sampleSql });
    await get().executeQuery();
  },

  addEvidence: (item) => {
    const newEvidence: EvidenceItem = {
      ...item,
      id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [newEvidence, ...get().evidenceList];
    set({
      evidenceList: updated,
      currentStep: 'evidence',
    });
  },

  removeEvidence: (id: string) => {
    set({
      evidenceList: get().evidenceList.filter((e) => e.id !== id),
    });
  },

  setNotes: (text: string) => {
    const activeCaseId = get().activeCase.id;
    set({
      notes: {
        ...get().notes,
        [activeCaseId]: text,
      },
    });
  },

  submitFinding: ({ culprit, discrepancy, explanation, selectedEvidenceIds }) => {
    const activeCase = get().activeCase;
    const verdict = activeCase.solution.validationCheck({
      culprit,
      discrepancy,
      explanation,
      evidenceCount: selectedEvidenceIds.length,
    });

    const submission: FindingSubmission = {
      id: `find_${Date.now()}`,
      caseId: activeCase.id,
      culprit,
      discrepancy,
      explanation,
      selectedEvidenceIds,
      submittedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
      verdict,
    };

    set({
      findings: {
        ...get().findings,
        [activeCase.id]: submission,
      },
      currentStep: 'finding',
    });

    // Persist to local storage
    try {
      const stored = JSON.parse(localStorage.getItem('execspace_findings') || '{}');
      stored[activeCase.id] = submission;
      localStorage.setItem('execspace_findings', JSON.stringify(stored));
    } catch (e) {
      // LocalStorage fallback
    }

    return submission;
  },

  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('execspace_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    set({ theme: nextTheme });
  },

  resetCurrentCase: async () => {
    const activeCase = get().activeCase;
    set({
      currentSql: activeCase.initialSql,
      currentResult: null,
      isDbReady: false,
    });
    await dbManager.resetCurrentCase(activeCase.dbSchemaSql);
    set({ isDbReady: true });
  },
}));
