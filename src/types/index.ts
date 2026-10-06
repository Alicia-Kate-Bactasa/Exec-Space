export type InvestigationStep = 'cases' | 'schema' | 'query' | 'results' | 'evidence' | 'finding';

export type ActiveView = 'landing' | 'workspace' | 'evidence' | 'finding';

export interface ColumnDefinition {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeign?: boolean;
  foreignTable?: string;
  description?: string;
}

export interface TableDefinition {
  name: string;
  rowCount: number;
  description: string;
  columns: ColumnDefinition[];
}

export interface CaseDefinition {
  id: string;
  code: string; // e.g. "Case #04"
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Missing Revenue' | 'Duplicate Transactions' | 'Suspicious Sales' | 'Corrupted Records' | 'Anomaly Detection';
  summary: string;
  problem: string;
  objective: string;
  initialSql: string;
  dbSchemaSql: string; // DDL + Seed SQL for client-side PGlite
  tables: TableDefinition[];
  hints: string[];
  expectedDiscrepancy?: number;
  solution: {
    rootCause: string;
    expectedDiscrepancyText: string;
    keyFindings: string[];
    validationCheck: (data: { culprit: string; discrepancy: string; explanation: string; evidenceCount: number }) => {
      status: 'VERIFIED' | 'PARTIAL' | 'INCORRECT';
      score: number;
      feedback: string;
      breakdown: string[];
    };
  };
}

export interface QueryResult {
  columns: string[];
  rows: (string | number | boolean | null)[][];
  rowCount: number;
  executionTimeMs: number;
  error?: string;
  executedAt: string;
  rawQuery: string;
}

export interface QueryHistoryItem {
  id: string;
  caseId: string;
  query: string;
  rowCount: number;
  executionTimeMs: number;
  status: 'success' | 'error';
  timestamp: string;
  errorMessage?: string;
}

export interface EvidenceItem {
  id: string;
  caseId: string;
  title: string;
  note: string;
  query: string;
  resultPreview: {
    columns: string[];
    sampleRows: (string | number | boolean | null)[][];
    totalRows: number;
  };
  chartConfig?: {
    type: 'bar' | 'line' | 'donut';
    xKey: string;
    yKey: string;
  };
  createdAt: string;
}

export interface FindingSubmission {
  id: string;
  caseId: string;
  culprit: string;
  discrepancy: string;
  explanation: string;
  selectedEvidenceIds: string[];
  submittedAt: string;
  verdict?: {
    status: 'VERIFIED' | 'PARTIAL' | 'INCORRECT';
    score: number;
    feedback: string;
    breakdown: string[];
  };
}

export interface DataLineage {
  sourceTable: string;
  filterOrAggregation: string;
  resultRowsCount: number;
  targetArtifact: string;
}
