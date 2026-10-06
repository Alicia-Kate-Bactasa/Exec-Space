# ExecSpace

A minimalist database investigation playground for students.

---

## Purpose

ExecSpace helps students and beginners develop practical database analysis skills through realistic company problem scenarios instead of memorizing isolated SQL syntax drills.

In typical learning platforms, students answer artificial exercises such as selecting rows matching a single condition. In real workplace environments, data issues are messy and ambiguous: missing revenue figures, duplicate charges, broken inventory ledgers, or customer account joins that fail silently.

ExecSpace provides students with realistic business briefs, authentic database schemas, and an in-browser PostgreSQL environment. Students explore tables, write SQL queries, verify discrepancies, pin critical query results to an Evidence board, and submit findings against case audits.

---

## Features

### In-Browser PostgreSQL Engine
ExecSpace runs a complete PostgreSQL database directly inside the browser using PGlite (WebAssembly). No database installation, cloud server, or internet connection to a backend API is required.

### Database Explorer
Inspect table names, schema definitions, column data types, primary keys, foreign keys, and row counts in real time. Quickly run sample queries to understand data formats.

### SQL Workspace
Write and execute multi-table queries using a built-in SQL editor with keyboard shortcuts (`Ctrl + Enter` / `Cmd + Enter`). Review query history and reload previous queries with a single click.

### Query Results and Visualizations
View query outputs in formatted tables with execution times and row counts. Switch to the Visualization tab to view query results as Bar, Line, or Donut charts.

### Evidence Board
Pin suspicious query results, data snapshots, and custom notes directly to an Evidence board. Collected evidence substantiates your final case finding.

### Case Finding and Verification
Synthesize investigation findings by documenting root causes, calculating exact financial or record discrepancies, and attaching supporting evidence. Receive immediate audit evaluation and scoring against the ground truth.

### Investigation Notes
An autosaving scratchpad attached to each case allows students to record intermediate hypotheses, order IDs, arithmetic notes, and patterns as they work.

### Responsive Light and Dark Modes
Designed with a black and dark violet palette with off-whites and cool grays for comfortable reading, along with a full light theme option.

---

## Project Plan

```
Phase 1: Foundation and In-Browser Database Runtime
├── Architecture setup with Vite, React, and TypeScript
├── Integration of PGlite WebAssembly PostgreSQL engine
└── Schema initialization and sample database seeding

Phase 2: Database Workspace and SQL Tooling
├── CodeMirror 6 SQL editor with keyboard execution
├── Tabular results viewer with execution metrics
├── Dynamic Recharts visualization (Bar, Line, Donut)
└── Query history logging and instant re-run capability

Phase 3: Evidence Collection and Finding Evaluation
├── Evidence Board with snapshot capture and notes
├── Case finding submission interface with evidence checklists
└── Automated ground-truth audit verification and debrief notes

Phase 4: Interface and Branding Overhaul
├── Landing page introduction with showcase workflow
├── Google Font typography integration (Poppins and JetBrains Mono)
├── Monochromatic dark violet and black visual palette
└── Minimalist navigation with circular border radius accents

Phase 5: Case Expansion and Performance
├── Additional business problem scenarios
├── Exportable case reports
└── Query execution profiling
```

---

## Stack

![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![WebAssembly](https://img.shields.io/badge/WebAssembly-654FF0?style=for-the-badge&logo=webassembly&logoColor=white)
![CodeMirror](https://img.shields.io/badge/CodeMirror_6-2B2B2B?style=for-the-badge&logo=codemirror&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E3A?style=for-the-badge)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge)
![Lucide](https://img.shields.io/badge/Lucide_Icons-2C3E50?style=for-the-badge)

* **Framework**: React 18 with TypeScript and Vite
* **Database**: PGlite (PostgreSQL compiled to WebAssembly)
* **Code Editor**: CodeMirror 6 with SQL language support
* **State Management**: Zustand
* **Styling**: Tailwind CSS v4
* **Charting**: Recharts
* **Icons**: Lucide React
* **Typography**: Google Fonts (Poppins and JetBrains Mono)

---

## Integrations

### PGlite (ElectricSQL)
ExecSpace embeds PGlite, a lightweight WebAssembly build of PostgreSQL. Each investigation case loads its schema and data rows directly into client memory via IndexedDB and WASM, enabling authentic SQL features including CTEs, window functions, joins, and aggregates with zero server infrastructure.

### CodeMirror 6 (`@uiw/react-codemirror`)
Provides code editing with SQL syntax highlighting, custom themes, line numbering, bracket matching, and shortcut bindings (`Ctrl + Enter` to execute).

### Recharts
Translates tabular query outputs into responsive Bar, Line, and Donut charts. Columns from query results are mapped dynamically to chart axes and data series.

### Lucide React
Supplies consistent vector icons for navigation, data actions, schema keys, and status badges.

---

## Getting Started

### Prerequisites
* Node.js 18 or higher
* npm

### Installation
```bash
git clone https://github.com/Alicia-Kate-Bactasa/Exec-Space.git
cd Exec-Space
npm install
```

### Development
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### Production Build
```bash
npm run build
npm run preview
```
