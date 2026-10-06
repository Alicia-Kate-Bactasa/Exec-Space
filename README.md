# ExecSpace

A minimalist **Database Analytics & Data Detective Playground** for students.

Investigate realistic database problems instead of simply answering generic SQL quizzes.

---

## 🔍 The Main Idea

In traditional platforms, students are asked isolated questions like *"Write a query to find all users where status = 'active'"*.

**ExecSpace** gives students realistic company investigation briefs such as:

> **Case #04: The Missing ₱2.4M**  
> A company's report says ₱8.2M in revenue, but the finance database says ₱5.8M.  
> Investigate the database and find out why.

Students explore the schema, write SQL queries, analyze results, collect evidence into an **Evidence Board**, and file their **Final Finding** to solve the mystery.

---

## 🧭 Investigation Flow

ExecSpace organizes student investigations into an intuitive step-by-step flow:

```
Choose Case → Explore Database → Write SQL → Inspect Results → Save Evidence → Write Finding
```

1. **Choose Case**: Pick an active investigation brief (Missing Revenue, Duplicate Charges, Suspicious Pricing, Corrupted Records, Anomaly Detection).
2. **Explore Database**: Browse table structures, row counts, and column types.
3. **Write SQL**: Query the in-browser PostgreSQL engine via CodeMirror 6 with instant shortcuts (`Ctrl + Enter`).
4. **Inspect Results**: View clean tabular outputs with execution timing and render interactive Bar/Line/Donut visualizations.
5. **Save Evidence**: Pin critical queries, data snapshots, and detective notes to your Evidence Board.
6. **Write Finding**: Explain the root cause, identify the discrepancy, link supporting evidence, and verify against the case ground truth.

---

## 🚀 Built-in Cases

* **Case #04: The Missing ₱2.4M** *(Intermediate)*: Uncover unfulfilled cancelled orders and unrecorded customer refunds causing a ₱2.4M gap.
* **Case #01: The Phantom Double-Dips** *(Beginner)*: Detect duplicate billing transactions resulting from network retry storms with missing idempotency keys.
* **Case #02: The Midnight Ghost Cart** *(Intermediate)*: Trace a rogue test promotional voucher that allowed 85 flagship GPUs to be purchased for ₱1 each.
* **Case #03: The Amnesiac Loyalty Accounts** *(Advanced)*: Diagnose dirty email strings with trailing whitespace that broke customer loyalty ledger joins.
* **Case #05: The Black Friday Gateway Drop** *(Intermediate)*: Identify primary payment gateway rate-limit ceilings and misconfigured backup failover flags during peak traffic.

---

## 🛠️ Tech Stack

- **Client Framework**: Vite + React 18 + TypeScript
- **Database Engine (In-Browser)**: [PGlite](https://github.com/electric-sql/pglite) (PostgreSQL running via WebAssembly in the browser)
- **SQL Editor**: CodeMirror 6 with SQL language extensions (`@uiw/react-codemirror`)
- **State Management**: Zustand
- **Split Workspace**: `react-resizable-panels`
- **Visualization**: Recharts (monochromatic dark investigative theme)
- **Styling**: Tailwind CSS v4 with custom dark & light themes

---

## 🎨 Design Philosophy

- **Minimalist Dark Investigative Palette**:
  - Near-black backgrounds (`#09090b`)
  - Soft dark violet slate surfaces (`#121017`)
  - Dark violet accents (`#6d28d9` / `#7c3aed`)
  - Monospaced typography for queries & data (`JetBrains Mono`)
- **Full Light Theme Support**: Clean slate surfaces with deep violet accents.
- **Data Lineage**: Visual breadcrumb flow (`Table → SQL Query → Filtered Results → Target`).
- **No AI Buzzwords**: Simple, student-friendly labels (Cases, Database, Query, Results, Evidence, Notes, Finding).

---

## 💻 Getting Started

### Prerequisites

- Node.js 18+ (tested on Node v22)
- npm

### Installation & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build

```bash
npm run build
npm run preview
```
