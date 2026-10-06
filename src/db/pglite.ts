import { PGlite } from '@electric-sql/pglite';
import { QueryResult } from '../types';

class PGliteDatabaseManager {
  private pg: PGlite | null = null;
  private currentCaseId: string | null = null;
  private isInitializing: boolean = false;

  async initCase(caseId: string, schemaSql: string): Promise<void> {
    if (this.currentCaseId === caseId && this.pg) {
      return;
    }

    this.isInitializing = true;
    try {
      if (this.pg) {
        await this.pg.close();
        this.pg = null;
      }

      // Initialize fresh in-memory PostgreSQL instance via WebAssembly
      this.pg = new PGlite();
      await this.pg.exec(schemaSql);
      this.currentCaseId = caseId;
    } catch (err) {
      console.error('Failed to initialize PGlite instance:', err);
      throw err;
    } finally {
      this.isInitializing = false;
    }
  }

  async runQuery(sql: string): Promise<QueryResult> {
    const startTime = performance.now();
    const executedAt = new Date().toLocaleTimeString();

    if (!this.pg) {
      return {
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: 0,
        error: 'Database engine not initialized. Please select a case first.',
        executedAt,
        rawQuery: sql,
      };
    }

    try {
      const trimmed = sql.trim();
      if (!trimmed) {
        return {
          columns: [],
          rows: [],
          rowCount: 0,
          executionTimeMs: 0,
          error: 'Query is empty.',
          executedAt,
          rawQuery: sql,
        };
      }

      // Execute query on client-side PGlite
      const res = await this.pg.query(trimmed);
      const executionTimeMs = Math.round((performance.now() - startTime) * 10) / 10;

      const columns = res.fields ? res.fields.map((f) => f.name) : [];
      const rows = res.rows.map((row: any) => {
        if (Array.isArray(row)) {
          return row;
        }
        return columns.map((col) => row[col]);
      });

      return {
        columns,
        rows,
        rowCount: rows.length,
        executionTimeMs,
        executedAt,
        rawQuery: sql,
      };
    } catch (err: any) {
      const executionTimeMs = Math.round((performance.now() - startTime) * 10) / 10;
      return {
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs,
        error: err?.message || 'SQL execution failed.',
        executedAt,
        rawQuery: sql,
      };
    }
  }

  async getTableSample(tableName: string, limit = 5): Promise<QueryResult> {
    return this.runQuery(`SELECT * FROM ${tableName} LIMIT ${limit};`);
  }

  async resetCurrentCase(schemaSql: string): Promise<void> {
    if (this.currentCaseId) {
      await this.initCase(this.currentCaseId, schemaSql);
    }
  }
}

export const dbManager = new PGliteDatabaseManager();
