import { create } from 'zustand';
import { CASE_LIST } from '../db/casesData';
import { dbManager } from '../db/pglite';
import {
  ActiveView,
  CaseDefinition,
  EvidenceItem,
  FindingSubmission,
  InvestigationStep,
  NoteItem,
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
  notesList: NoteItem[];
  availableFolders: string[];
  findings: Record<string, FindingSubmission>;
  theme: 'dark' | 'light';
  lastCaseId: string | null;
  lastWorkView: Extract<ActiveView, 'workspace' | 'evidence' | 'finding'>;
  workspaceTab: 'table' | 'chart' | 'evidence' | 'finding' | 'notes';
  sidebarTab: 'cases' | 'database';
  isExecuting: boolean;
  isDbReady: boolean;
  dbError: string | null;

  // Actions
  setWorkspaceTab: (tab: 'table' | 'chart' | 'evidence' | 'finding' | 'notes') => void;
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
  createNote: (data: { title: string; content: string; folder?: string; caseId?: string }) => NoteItem;
  updateNote: (id: string, updates: Partial<Pick<NoteItem, 'title' | 'content' | 'folder' | 'caseId'>>) => void;
  deleteNote: (id: string) => void;
  addFolder: (folderName: string) => void;
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

// Load persisted findings so progress survives reloads
const getInitialFindings = (): Record<string, FindingSubmission> => {
  try {
    return JSON.parse(localStorage.getItem('execspace_findings') || '{}');
  } catch {
    return {};
  }
};

const getInitialLastCaseId = (): string | null => {
  try {
    return localStorage.getItem('execspace_last_case_id');
  } catch {
    return null;
  }
};

const getInitialLastWorkView = (): Extract<ActiveView, 'workspace' | 'evidence' | 'finding'> => {
  try {
    const saved = localStorage.getItem('execspace_last_work_view');
    return saved === 'evidence' || saved === 'finding' ? saved : 'workspace';
  } catch {
    return 'workspace';
  }
};

const DEFAULT_FOLDERS = ['General', 'Case Notes', 'Hypotheses', 'Findings'];

const getInitialFolders = (): string[] => {
  try {
    const saved = JSON.parse(localStorage.getItem('execspace_folders') || '[]');
    if (Array.isArray(saved) && saved.length > 0) {
      return Array.from(new Set([...DEFAULT_FOLDERS, ...saved]));
    }
  } catch {
    // fallback
  }
  return DEFAULT_FOLDERS;
};

const getInitialNotesList = (): NoteItem[] => {
  try {
    const saved = JSON.parse(localStorage.getItem('execspace_saved_notes') || '[]');
    if (Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
  } catch {
    // fallback
  }

  return [
    {
      id: 'note_seed_1',
      caseId: 'case-01',
      caseCode: 'Case #01',
      caseTitle: 'The Case of the Ghost Orders',
      title: 'Hypothesis: Ghost Orders in Orders Table',
      content: 'Checked order IDs where status is COMPLETED but total amount is zero or negative. Need to cross-reference with order_items to verify whether line item sums match order totals.',
      folder: 'Hypotheses',
      createdAt: '2026-10-15T14:30:00.000Z',
      updatedAt: '2026-10-16T18:20:00.000Z',
    },
    {
      id: 'note_seed_2',
      title: 'SQL Investigation Checklist',
      content: '1. Check NULL values in foreign keys and critical fields.\n2. Look for duplicate transaction IDs or order references.\n3. Compare timestamps across related tables.\n4. Verify aggregate sums against the reported financial discrepancy.',
      folder: 'General',
      createdAt: '2026-10-14T09:15:00.000Z',
      updatedAt: '2026-10-16T11:00:00.000Z',
    },
    {
      id: 'note_seed_3',
      caseId: 'case-02',
      caseCode: 'Case #02',
      caseTitle: 'The Mystery of the Midnight Returns',
      title: 'Case #02 Return Window Analysis',
      content: 'Review timestamp differences between delivery_date and return_request_date. Verify if policy window allows 14 days or 30 days, and check for negative elapsed days.',
      folder: 'Case Notes',
      createdAt: '2026-10-13T10:00:00.000Z',
      updatedAt: '2026-10-14T16:45:00.000Z',
    },
  ];
};

// Initial state setup (default case is the first Beginner set)
export const useCaseStore = create<CaseStoreState>((set, get) => ({
  cases: CASE_LIST,
  activeCase: CASE_LIST[0],
  activeView: 'landing',
  currentStep: 'cases',
  currentSql: CASE_LIST[0].initialSql,
  currentResult: null,
  history: [],
  evidenceList: [],
  notes: {},
  notesList: getInitialNotesList(),
  availableFolders: getInitialFolders(),
  findings: getInitialFindings(),
  theme: getInitialTheme(),
  lastCaseId: getInitialLastCaseId(),
  lastWorkView: getInitialLastWorkView(),
  workspaceTab: 'table',
  sidebarTab: 'cases',
  isExecuting: false,
  isDbReady: false,
  dbError: null,

  setWorkspaceTab: (tab) => set({ workspaceTab: tab }),
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
      lastCaseId: selected.id,
    });
    localStorage.setItem('execspace_last_case_id', selected.id);

    try {
      await dbManager.initCase(selected.id, selected.dbSchemaSql);
      set({ isDbReady: true });
    } catch (err: any) {
      set({ dbError: err?.message || 'Failed to initialize database' });
    }
  },

  setActiveView: (view: ActiveView) => {
    if (view === 'workspace' || view === 'evidence' || view === 'finding') {
      localStorage.setItem('execspace_last_work_view', view);
      set({ activeView: view, lastWorkView: view });
      return;
    }
    set({ activeView: view });
  },

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
    const activeCase = get().activeCase;
    const notes = {
      ...get().notes,
      [activeCase.id]: text,
    };

    // Synchronize to notesList
    const existingIndex = get().notesList.findIndex(
      (n) => n.caseId === activeCase.id && n.folder === 'Case Notes'
    );
    let updatedNotesList = [...get().notesList];
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      if (!text.trim()) {
        updatedNotesList.splice(existingIndex, 1);
      } else {
        updatedNotesList[existingIndex] = {
          ...updatedNotesList[existingIndex],
          content: text,
          updatedAt: now,
        };
      }
    } else if (text.trim()) {
      const newNote: NoteItem = {
        id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        caseId: activeCase.id,
        caseCode: activeCase.code,
        caseTitle: activeCase.title,
        title: `${activeCase.code} Investigation Notes`,
        content: text,
        folder: 'Case Notes',
        createdAt: now,
        updatedAt: now,
      };
      updatedNotesList = [newNote, ...updatedNotesList];
    }

    try {
      localStorage.setItem('execspace_saved_notes', JSON.stringify(updatedNotesList));
    } catch {
      // ignore
    }

    set({ notes, notesList: updatedNotesList });
  },

  createNote: (data) => {
    const now = new Date().toISOString();
    const activeCase = data.caseId ? get().cases.find((c) => c.id === data.caseId) : undefined;
    const newNote: NoteItem = {
      id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      caseId: data.caseId,
      caseCode: activeCase?.code,
      caseTitle: activeCase?.title,
      title: data.title.trim() || 'Untitled Note',
      content: data.content,
      folder: data.folder || 'General',
      createdAt: now,
      updatedAt: now,
    };

    const updatedList = [newNote, ...get().notesList];
    try {
      localStorage.setItem('execspace_saved_notes', JSON.stringify(updatedList));
    } catch {}

    if (data.caseId && (data.folder === 'Case Notes' || !get().notes[data.caseId])) {
      set({
        notesList: updatedList,
        notes: { ...get().notes, [data.caseId]: data.content },
      });
    } else {
      set({ notesList: updatedList });
    }

    return newNote;
  },

  updateNote: (id, updates) => {
    const now = new Date().toISOString();
    const updatedList = get().notesList.map((n) => {
      if (n.id !== id) return n;
      const associatedCase = updates.caseId
        ? get().cases.find((c) => c.id === updates.caseId)
        : updates.caseId === ''
        ? undefined
        : n.caseId
        ? get().cases.find((c) => c.id === n.caseId)
        : undefined;

      return {
        ...n,
        ...updates,
        caseCode: updates.caseId !== undefined ? associatedCase?.code : n.caseCode,
        caseTitle: updates.caseId !== undefined ? associatedCase?.title : n.caseTitle,
        updatedAt: now,
      };
    });

    try {
      localStorage.setItem('execspace_saved_notes', JSON.stringify(updatedList));
    } catch {}

    const targetNote = updatedList.find((n) => n.id === id);
    if (targetNote?.caseId && targetNote.caseId === get().activeCase.id && updates.content !== undefined) {
      set({
        notesList: updatedList,
        notes: { ...get().notes, [targetNote.caseId]: updates.content },
      });
    } else {
      set({ notesList: updatedList });
    }
  },

  deleteNote: (id) => {
    const noteToDelete = get().notesList.find((n) => n.id === id);
    const updatedList = get().notesList.filter((n) => n.id !== id);
    try {
      localStorage.setItem('execspace_saved_notes', JSON.stringify(updatedList));
    } catch {}

    if (noteToDelete?.caseId && noteToDelete.folder === 'Case Notes') {
      const nextNotes = { ...get().notes };
      delete nextNotes[noteToDelete.caseId];
      set({ notesList: updatedList, notes: nextNotes });
    } else {
      set({ notesList: updatedList });
    }
  },

  addFolder: (folderName) => {
    const trimmed = folderName.trim();
    if (!trimmed || get().availableFolders.includes(trimmed)) return;
    const nextFolders = [...get().availableFolders, trimmed];
    try {
      localStorage.setItem('execspace_folders', JSON.stringify(nextFolders));
    } catch {}
    set({ availableFolders: nextFolders });
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
