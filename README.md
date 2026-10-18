# ExecSpace

A minimalist database investigation playground for students.

---

## System Overview

ExecSpace is an interactive learning platform that teaches database problem-solving through real-world business scenarios. Instead of practicing isolated SQL syntax drills, students step into the role of a data investigator to uncover the root causes behind messy data problems—such as revenue discrepancies, broken loyalty tiers, duplicate transactions, and mismatched inventory ledgers.

The platform runs a complete PostgreSQL database engine directly inside the browser using WebAssembly. This allows students to execute complex SQL queries (including joins, aggregates, CTEs, and window functions) instantly without installing software or connecting to external servers.

### Investigation Workflow

1. **Select a Case**: Choose from beginner, intermediate, or advanced business scenarios with clear problem briefs and objectives.
2. **Explore the Database**: Review table structures, column types, primary and foreign keys, and row counts.
3. **Write and Run Queries**: Execute SQL statements in the editor with immediate tabular results, timing metrics, and visual charts.
4. **Collect Evidence**: Pin query snapshots, summary notes, and charts to an Evidence board.
5. **Take Notes**: Record intermediate hypotheses, order IDs, arithmetic notes, and patterns in an organized notes workspace.
6. **Submit Findings**: Submit identified culprits, discrepancy amounts, and explanations to receive automated audit feedback and scoring.

---

## Tech Stack

### Frontend
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![CodeMirror](https://img.shields.io/badge/CodeMirror_6-2B2B2B?style=for-the-badge&logo=codemirror&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E3A?style=for-the-badge)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge)
![Lucide](https://img.shields.io/badge/Lucide_Icons-2C3E50?style=for-the-badge)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)
![TSX](https://img.shields.io/badge/TSX-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Dotenv](https://img.shields.io/badge/Dotenv-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black)
![CORS](https://img.shields.io/badge/CORS-E34F26?style=for-the-badge)

### Database
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![PGlite](https://img.shields.io/badge/PGlite_(WASM)-654FF0?style=for-the-badge&logo=webassembly&logoColor=white)
![IndexedDB](https://img.shields.io/badge/IndexedDB-29ABE2?style=for-the-badge&logo=html5&logoColor=white)

### Tools
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![PostCSS](https://img.shields.io/badge/PostCSS-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white)

---

## Key Features & Integrations

### Key Features

* **In-Browser PostgreSQL Engine**: Runs a complete PostgreSQL instance directly inside the browser using PGlite and WebAssembly. No database installation, cloud server, or internet connection required.
* **Database Explorer**: Inspect table names, schema definitions, column data types, primary keys, foreign keys, and row counts in real time.
* **SQL Workspace**: Write and run multi-table queries with keyboard execution shortcuts (`Ctrl + Enter` / `Cmd + Enter`), query history logs, and instant query re-execution.
* **Query Results and Visualizations**: View query outputs in formatted tables with execution times and row counts, or switch to the Visualization tab to render dynamic Bar, Line, and Donut charts.
* **Evidence Board**: Pin query outputs, data snapshots, and chart cards to an Evidence board to substantiate case findings.
* **Case Finding and Verification**: Synthesize investigation findings by documenting root causes, calculating exact financial or record discrepancies, and attaching supporting evidence for automated audit grading.
* **Investigation Notes**: Built-in notes scratchpad with folder organization, case tag linking, and automatic saving.
* **User Profile & Progression**: Track completed investigations, accuracy scores, and solved cases across difficulty tiers.
* **Dark and Light Themes**: Designed with a comfortable dark violet and black visual palette alongside a full light mode.

### Core Integrations

* **PGlite (ElectricSQL)**: Embeds a lightweight WebAssembly build of PostgreSQL into client memory. Each investigation case loads its schema and data rows directly into IndexedDB, supporting joins, subqueries, CTEs, and window functions.
* **CodeMirror 6 (`@uiw/react-codemirror`)**: Provides code editing with SQL syntax highlighting, custom dark/light editor themes, line numbering, bracket matching, and execution shortcuts.
* **Recharts**: Maps tabular query results dynamically to responsive Bar, Line, and Donut charts for immediate visual analysis.
* **Lucide React**: Supplies consistent, accessible vector icons for navigation, data actions, schema keys, and status indicators.

---

## Repository Structure

```
Exec-Space/
├── public/                     # Static public assets and case database files
├── src/
│   ├── components/             # User interface components
│   │   ├── auth/               # Authentication and sign-in modal
│   │   ├── evidence/           # Evidence board and snapshot capture modal
│   │   ├── findings/           # Case submission reports and evaluation views
│   │   ├── help/               # Documentation and SQL beginner guides
│   │   ├── landing/            # Landing page and showcase walkthrough
│   │   ├── layout/             # Header, Sidebar, Lineage bar, and User dropdown
│   │   ├── notes/              # Notes page and in-case scratchpad
│   │   ├── profile/            # User profile, statistics, and solved cases
│   │   └── workspace/          # Case details, SQL editor, query results, and charts
│   ├── db/                     # Database cases, schema definitions, and PGlite runtime
│   │   ├── casesBeginner.ts    # Beginner investigation scenarios
│   │   ├── casesIntermediate.ts# Intermediate investigation scenarios
│   │   ├── casesAdvanced.ts    # Advanced investigation scenarios
│   │   ├── casesData.ts        # Case repository registry and seed loader
│   │   └── pglite.ts           # PGlite WebAssembly database instance manager
│   ├── store/                  # Zustand state stores
│   │   ├── useAuthStore.ts     # User authentication state
│   │   └── useCaseStore.ts     # Case selection, queries, evidence, and notes state
│   ├── types/                  # TypeScript interface and type declarations
│   │   └── index.ts            # Data models for cases, queries, evidence, and notes
│   ├── App.tsx                 # Root application component with view routing
│   ├── main.tsx                # React application entry point
│   ├── index.css               # Global CSS and Tailwind directives
│   └── vite-env.d.ts           # Vite TypeScript environment declarations
├── index.html                  # HTML entry template
├── package.json                # Project dependencies and script definitions
├── tsconfig.json               # TypeScript compiler configuration
├── vite.config.ts              # Vite bundler configuration
└── README.md                   # Project documentation
```

---

## Future Plans with Projects

### Project 1: Backend API & Cloud Sync
* **Express.js API Server**: Provide secure REST endpoints for user authentication, profile data, and saved findings.
* **Cloud Database Persistence**: Connect PostgreSQL with Drizzle ORM to persist user investigations and notes across devices.
* **Case State Synchronization**: Seamlessly sync local PGlite progress with cloud accounts.

### Project 2: Custom Case Creator & Schema Builder
* **Scenario Authoring Tool**: Allow educators and mentors to design custom business problems with custom schemas.
* **Data Importer**: Upload CSV files or SQL seed scripts to auto-generate new case databases.
* **Custom Rubric Builder**: Define custom ground-truth verification checks and discrepancy calculation tests.

### Project 3: Collaborative Investigations
* **Team Workspaces**: Allow student pairs to investigate the same case in real time.
* **Shared Evidence Boards**: Pin and annotate evidence cards visible to all team members.
* **Peer Reviews**: Submit case findings for peer debriefing and collaborative discussion.

### Project 4: Expanded Business Case Library
* **E-Commerce & Logistics**: Inventory reconciliation, lost shipment audits, and warehouse capacity modeling.
* **Subscription & SaaS Billing**: Churn analysis, prorated subscription overcharges, and MRR calculations.
* **Security & Fraud Detection**: Detecting concurrent logins, credential stuffing patterns, and unauthorized balance adjustments.

### Project 5: SQL Performance & Query Profiling
* **Visual Execution Plans**: Visual `EXPLAIN ANALYZE` tree maps to teach indexing and query performance.
* **Index Recommendations**: Interactive suggestions for query optimization and table scanning improvements.
* **Query Performance Benchmarks**: Side-by-side execution time comparisons for alternative query strategies.

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
