import { CaseDefinition } from '../types';

const keywordCheck = (required: string[], hint: string) => {
  return (data: { culprit: string; discrepancy: string; explanation: string; evidenceCount: number }) => {
    const text = `${data.culprit} ${data.discrepancy} ${data.explanation}`.toLowerCase();
    const hit = required.some((k) => text.includes(k.toLowerCase()));
    const breakdown: string[] = [];
    if (hit) breakdown.push('Named the advanced pattern from the data.');
    else breakdown.push(`Missing keyword. Hint: ${hint}`);
    if (data.evidenceCount > 0) breakdown.push(`Attached ${data.evidenceCount} piece(s) of evidence.`);
    else breakdown.push('Tip: pin at least 1 query result as evidence.');
    if (hit) {
      return { status: 'VERIFIED' as const, score: 100, feedback: 'Solved! Your finding matches the ground truth.', breakdown };
    }
    return { status: 'PARTIAL' as const, score: 55, feedback: `Good start. ${hint}`, breakdown };
  };
};

export const ADVANCED_CASES: CaseDefinition[] = [
  {
    id: 'case-22',
    code: 'Case #22',
    title: 'The Ghost Vendor',
    difficulty: 'Advanced',
    category: 'Joins',
    summary: 'Two vendors got paid with no contract. Use NOT EXISTS to find them.',
    problem: `Procurement paid 4 vendors, but only 2 have signed contracts. Use NOT EXISTS (or LEFT JOIN IS NULL) from payments to contracts to list ghost vendors and sum the 95,000 exposure.`,
    objective: 'NOT EXISTS: payments without a matching contract.',
    initialSql: `-- Step 1: paid vendors with no contract:
SELECT p.vendor, p.amount
FROM payments p
WHERE NOT EXISTS (SELECT 1 FROM contracts c WHERE c.vendor = p.vendor);`,
    hints: ['NOT EXISTS checks the contracts table per payment.', 'Ghost vendors: Nova (50,000) and Kite (45,000).', 'SUM the two = 95,000 exposure.'],
    expectedDiscrepancy: 95000,
    tables: [
      { name: 'contracts', rowCount: 2, description: 'Signed vendors.', columns: [
        { name: 'vendor', type: 'VARCHAR', isPrimary: true },
      ]},
      { name: 'payments', rowCount: 4, description: 'Vendor payouts.', columns: [
        { name: 'pay_id', type: 'INTEGER', isPrimary: true }, { name: 'vendor', type: 'VARCHAR' }, { name: 'amount', type: 'NUMERIC' },
      ]},
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS payments;
      DROP TABLE IF EXISTS contracts;
      CREATE TABLE contracts (vendor VARCHAR(100) PRIMARY KEY);
      CREATE TABLE payments (pay_id SERIAL PRIMARY KEY, vendor VARCHAR(100) NOT NULL, amount NUMERIC(10,2) NOT NULL);
      INSERT INTO contracts (vendor) VALUES ('Acme'), ('Bolt');
      INSERT INTO payments (pay_id, vendor, amount) VALUES (1,'Acme',30000),(2,'Bolt',25000),(3,'Nova',50000),(4,'Kite',45000);
    `,
    solution: {
      rootCause: 'Nova (50,000) and Kite (45,000) were paid with no contract: 95,000 exposure.',
      expectedDiscrepancyText: '95,000 paid to ghost vendors',
      keyFindings: ['NOT EXISTS returns Nova and Kite.', 'Contracted vendors: Acme, Bolt.'],
      validationCheck: keywordCheck(['not exists', 'ghost', 'nova', 'kite', '95000', '95,000', 'contract'], 'Mention NOT EXISTS/ghost or Nova and Kite.'),
    },
  },
  {
    id: 'case-23',
    code: 'Case #23',
    title: 'The Running Total',
    difficulty: 'Advanced',
    category: 'Aggregates',
    summary: 'Rebuild the ledger running balance with SUM() OVER (ORDER BY day).',
    problem: `Audit needs a day-by-day running balance from deposits. Use the SUM(amount) OVER (ORDER BY day) window function to show how 500 + 700 + 900 compounds to 2,100.`,
    objective: 'Window function: SUM OVER ORDER BY.',
    initialSql: `-- Step 1: running balance with a window:
SELECT day, amount,
  SUM(amount) OVER (ORDER BY day) AS running_balance
FROM deposits
ORDER BY day;`,
    hints: ['OVER (ORDER BY day) makes the sum cumulative.', 'Final running balance = 2,100.', 'Try ROWS BETWEEN for custom frames later.'],
    expectedDiscrepancy: 2100,
    tables: [
      { name: 'deposits', rowCount: 3, description: 'Daily deposits.', columns: [
        { name: 'day', type: 'DATE', isPrimary: true }, { name: 'amount', type: 'NUMERIC' },
      ]},
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS deposits;
      CREATE TABLE deposits (day DATE PRIMARY KEY, amount NUMERIC(10,2) NOT NULL);
      INSERT INTO deposits (day, amount) VALUES ('2024-09-01',500),('2024-09-02',700),('2024-09-03',900);
    `,
    solution: {
      rootCause: 'Running balances: 500, then 1,200, then 2,100 via window SUM.',
      expectedDiscrepancyText: 'Final running balance 2,100',
      keyFindings: ['Day 2 running = 1,200.', 'Day 3 running = 2,100.'],
      validationCheck: keywordCheck(['over', 'window', 'running', '2100', '2,100', 'sum'], 'Mention OVER/window and 2,100.'),
    },
  },
  {
    id: 'case-24',
    code: 'Case #24',
    title: 'The Churn Signal',
    difficulty: 'Advanced',
    category: 'Anomaly Detection',
    summary: 'Two customers went silent for 90+ days. Use a CTE + MAX(date).',
    problem: `Growth flags accounts with no purchase in 90 days as churned. Build a CTE of last purchase per customer with MAX(buy_date), then filter older than 2024-06-01.`,
    objective: 'WITH last_buy AS (...) SELECT churned customers.',
    initialSql: `-- Step 1: last purchase per customer (CTE):
WITH last_buy AS (
  SELECT customer_id, MAX(buy_date) AS last_date
  FROM purchases
  GROUP BY customer_id
)
SELECT * FROM last_buy
WHERE last_date < DATE '2024-06-01';`,
    hints: ['CTE + GROUP BY + MAX(date) gives last activity.', 'Churned: Ira (2024-03-10) and Jon (2024-04-01).', 'Active customers bought in August.'],
    expectedDiscrepancy: 2,
    tables: [
      { name: 'purchases', rowCount: 6, description: 'Purchase log.', columns: [
        { name: 'buy_id', type: 'INTEGER', isPrimary: true }, { name: 'customer_id', type: 'INTEGER' }, { name: 'buy_date', type: 'DATE' },
      ]},
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS purchases;
      CREATE TABLE purchases (buy_id SERIAL PRIMARY KEY, customer_id INT NOT NULL, buy_date DATE NOT NULL);
      INSERT INTO purchases (buy_id, customer_id, buy_date) VALUES
      (1,1,'2024-03-10'),(2,2,'2024-04-01'),(3,3,'2024-08-05'),(4,3,'2024-08-20'),(5,4,'2024-08-11'),(6,4,'2024-08-25');
    `,
    solution: {
      rootCause: 'Customers 1 (Ira) and 2 (Jon) last bought 90+ days before June; churned.',
      expectedDiscrepancyText: '2 churned customers',
      keyFindings: ['CTE last_buy exposes gaps.', 'Customers 3 and 4 are active in August.'],
      validationCheck: keywordCheck(['cte', 'with', 'churn', 'max', 'last', '90'], 'Mention CTE/WITH and churn.'),
    },
  },
  {
    id: 'case-25',
    code: 'Case #25',
    title: 'The Fraud Burst',
    difficulty: 'Advanced',
    category: 'Anomaly Detection',
    summary: 'One card charged 5 times in an hour. GROUP BY card + hour HAVING COUNT(*) > 3.',
    problem: `Risk rules flag any card with more than 3 charges in one hour. Group charges by card_id and hour_slot, count, and keep bursts. Card 7777 fired 5 times at 14:00.`,
    objective: 'GROUP BY card_id, hour_slot HAVING COUNT(*) > 3.',
    initialSql: `-- Step 1: bursts per card per hour:
SELECT card_id, hour_slot, COUNT(*) AS hits
FROM charges
GROUP BY card_id, hour_slot
HAVING COUNT(*) > 3;`,
    hints: ['GROUP BY two columns: card + hour.', 'HAVING COUNT(*) > 3 keeps bursts.', 'Answer: card 7777 at 14:00 with 5 hits.'],
    expectedDiscrepancy: 5,
    tables: [
      { name: 'charges', rowCount: 8, description: 'Card charges by hour.', columns: [
        { name: 'charge_id', type: 'INTEGER', isPrimary: true }, { name: 'card_id', type: 'VARCHAR' }, { name: 'hour_slot', type: 'VARCHAR' },
      ]},
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS charges;
      CREATE TABLE charges (charge_id SERIAL PRIMARY KEY, card_id VARCHAR(20) NOT NULL, hour_slot VARCHAR(10) NOT NULL);
      INSERT INTO charges (charge_id, card_id, hour_slot) VALUES
      (1,'7777','14:00'),(2,'7777','14:00'),(3,'7777','14:00'),(4,'7777','14:00'),(5,'7777','14:00'),
      (6,'1234','14:00'),(7,'1234','15:00'),(8,'9999','15:00');
    `,
    solution: {
      rootCause: 'Card 7777 burst 5 charges in the 14:00 hour; rule limit is 3.',
      expectedDiscrepancyText: 'Burst of 5 on card 7777 at 14:00',
      keyFindings: ['7777/14:00 count = 5.', 'All other groups are 1-2.'],
      validationCheck: keywordCheck(['7777', 'burst', 'having', 'count', 'fraud', '14:00'], 'Mention card 7777 and HAVING/COUNT.'),
    },
  },
  {
    id: 'case-26',
    code: 'Case #26',
    title: 'The Price Drift',
    difficulty: 'Advanced',
    category: 'Joins',
    summary: 'One product jumped 100% between price snapshots. Self-join old vs new.',
    problem: `Two snapshots (prices_old, prices_new) hold the same product_ids. Join them on product_id, compute new - old, and find the item whose price doubled from 1,000 to 2,000.`,
    objective: 'Self-style join across snapshots; compute drift.',
    initialSql: `-- Step 1: compare snapshots side by side:
SELECT o.product_id, o.price AS old_price, n.price AS new_price,
  (n.price - o.price) AS drift
FROM prices_old o
JOIN prices_new n ON n.product_id = o.product_id
ORDER BY drift DESC;`,
    hints: ['JOIN on product_id across the two tables.', 'Drift = new - old.', 'Biggest drift: Mug (1,000 -> 2,000).'],
    expectedDiscrepancy: 1000,
    tables: [
      { name: 'prices_old', rowCount: 4, description: 'January snapshot.', columns: [
        { name: 'product_id', type: 'INTEGER', isPrimary: true }, { name: 'price', type: 'NUMERIC' },
      ]},
      { name: 'prices_new', rowCount: 4, description: 'February snapshot.', columns: [
        { name: 'product_id', type: 'INTEGER', isPrimary: true }, { name: 'price', type: 'NUMERIC' },
      ]},
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS prices_new;
      DROP TABLE IF EXISTS prices_old;
      CREATE TABLE prices_old (product_id INT PRIMARY KEY, price NUMERIC(10,2) NOT NULL);
      CREATE TABLE prices_new (product_id INT PRIMARY KEY, price NUMERIC(10,2) NOT NULL);
      INSERT INTO prices_old (product_id, price) VALUES (1,500),(2,1000),(3,750),(4,900);
      INSERT INTO prices_new (product_id, price) VALUES (1,520),(2,2000),(3,760),(4,910);
    `,
    solution: {
      rootCause: 'Product 2 drifted +1,000 (1,000 to 2,000); others moved under 20.',
      expectedDiscrepancyText: 'Drift of +1,000 on product 2',
      keyFindings: ['JOIN exposes all 4 pairs.', 'Product 2 is the 100% jump.'],
      validationCheck: keywordCheck(['join', 'drift', '2000', '2,000', '1000', '1,000', 'snapshot'], 'Mention JOIN/drift and 1,000 to 2,000.'),
    },
  },
  {
    id: 'case-27',
    code: 'Case #27',
    title: 'The Cohort Gap',
    difficulty: 'Advanced',
    category: 'Joins',
    summary: 'March cohort kept 1 of 3 users in month 2. Measure retention with LEFT JOIN.',
    problem: `Cohorts list signups per month; activity lists who returned in month 2. LEFT JOIN March signups to month-2 activity and count matches: only 1 of 3 returned (33%).`,
    objective: 'LEFT JOIN cohort to activity; retention = matches / cohort.',
    initialSql: `-- Step 1: who from March returned?
SELECT s.user_id, a.user_id AS returned
FROM signups_march s
LEFT JOIN activity_m2 a ON a.user_id = s.user_id;`,
    hints: ['LEFT JOIN keeps all 3 March users.', 'Only 1 has a non-NULL match.', 'Retention = 1/3 = 33%.'],
    expectedDiscrepancy: 33,
    tables: [
      { name: 'signups_march', rowCount: 3, description: 'March cohort.', columns: [
        { name: 'user_id', type: 'INTEGER', isPrimary: true },
      ]},
      { name: 'activity_m2', rowCount: 1, description: 'Month-2 returners.', columns: [
        { name: 'user_id', type: 'INTEGER', isPrimary: true },
      ]},
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS activity_m2;
      DROP TABLE IF EXISTS signups_march;
      CREATE TABLE signups_march (user_id INT PRIMARY KEY);
      CREATE TABLE activity_m2 (user_id INT PRIMARY KEY);
      INSERT INTO signups_march (user_id) VALUES (1),(2),(3);
      INSERT INTO activity_m2 (user_id) VALUES (2);
    `,
    solution: {
      rootCause: 'March cohort retention is 33%: only user 2 of 3 returned in month 2.',
      expectedDiscrepancyText: '33% retention (1 of 3)',
      keyFindings: ['LEFT JOIN shows 2 NULLs.', 'Users 1 and 3 churned.'],
      validationCheck: keywordCheck(['cohort', 'retention', '33', 'left join', 'march'], 'Mention cohort/retention and 33%.'),
    },
  },
  {
    id: 'case-28',
    code: 'Case #28',
    title: 'The Ledger Break',
    difficulty: 'Advanced',
    category: 'Corrupted Records',
    summary: 'Cash account is off by 1,500: debits 10,000 vs credits 8,500. GROUP + HAVING.',
    problem: `Double-entry rule: per account, SUM(debit) must equal SUM(credit). Group ledger lines by account, sum both, and keep accounts where the sums differ with HAVING. Cash breaks by 1,500.`,
    objective: 'GROUP BY account HAVING SUM(debit) <> SUM(credit).',
    initialSql: `-- Step 1: balance per account:
SELECT account, SUM(debit) AS d, SUM(credit) AS c
FROM ledger
GROUP BY account
HAVING SUM(debit) <> SUM(credit);`,
    hints: ['SUM each side per account.', 'HAVING filters grouped rows.', 'Cash: 10,000 debit vs 8,500 credit.'],
    expectedDiscrepancy: 1500,
    tables: [
      { name: 'ledger', rowCount: 6, description: 'Journal lines.', columns: [
        { name: 'line_id', type: 'INTEGER', isPrimary: true }, { name: 'account', type: 'VARCHAR' }, { name: 'debit', type: 'NUMERIC' }, { name: 'credit', type: 'NUMERIC' },
      ]},
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS ledger;
      CREATE TABLE ledger (line_id SERIAL PRIMARY KEY, account VARCHAR(50) NOT NULL, debit NUMERIC(10,2) NOT NULL, credit NUMERIC(10,2) NOT NULL);
      INSERT INTO ledger (line_id, account, debit, credit) VALUES
      (1,'Cash',6000,0),(2,'Cash',4000,0),(3,'Cash',0,5000),(4,'Cash',0,3500),
      (5,'Fees',2000,0),(6,'Fees',0,2000);
    `,
    solution: {
      rootCause: 'Cash debits 10,000 vs credits 8,500: unbalanced by 1,500. Fees balance.',
      expectedDiscrepancyText: 'Cash off by 1,500',
      keyFindings: ['HAVING isolates Cash only.', 'Fees 2,000 = 2,000 balances.'],
      validationCheck: keywordCheck(['ledger', 'debit', 'credit', 'having', 'cash', '1500', '1,500'], 'Mention debit/credit/HAVING and Cash 1,500.'),
    },
  },
  {
    id: 'case-29',
    code: 'Case #29',
    title: 'The Slow Gateway',
    difficulty: 'Advanced',
    category: 'Aggregates',
    summary: 'Backup gateway averages 900ms vs 200ms primary. Use AVG + PARTITION concept.',
    problem: `Latency logs hold per-request ms by gateway. GROUP BY gateway with AVG(ms) to prove the backup is 4.5x slower (900 vs 200) and should not take peak traffic.`,
    objective: 'AVG(ms) GROUP BY gateway; compare.',
    initialSql: `-- Step 1: average latency per gateway:
SELECT gateway, AVG(ms) AS avg_ms, COUNT(*) AS n
FROM latency
GROUP BY gateway;`,
    hints: ['AVG(ms) per gateway is the signal.', 'PRIMARY ~200ms; BACKUP ~900ms.', 'COUNT shows 3 samples each.'],
    expectedDiscrepancy: 700,
    tables: [
      { name: 'latency', rowCount: 6, description: 'Request latency samples.', columns: [
        { name: 'req_id', type: 'INTEGER', isPrimary: true }, { name: 'gateway', type: 'VARCHAR' }, { name: 'ms', type: 'INTEGER' },
      ]},
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS latency;
      CREATE TABLE latency (req_id SERIAL PRIMARY KEY, gateway VARCHAR(50) NOT NULL, ms INT NOT NULL);
      INSERT INTO latency (req_id, gateway, ms) VALUES
      (1,'PRIMARY',180),(2,'PRIMARY',220),(3,'PRIMARY',200),
      (4,'BACKUP',850),(5,'BACKUP',950),(6,'BACKUP',900);
    `,
    solution: {
      rootCause: 'BACKUP averages 900ms vs PRIMARY 200ms: 700ms slower, unfit for peak.',
      expectedDiscrepancyText: '700ms gap (900 vs 200)',
      keyFindings: ['AVG groups cleanly by gateway.', 'BACKUP p99 risk confirmed by samples.'],
      validationCheck: keywordCheck(['avg', 'latency', 'backup', 'primary', '900', '200', 'slow'], 'Mention AVG and 900 vs 200.'),
    },
  },
  {
    id: 'case-30',
    code: 'Case #30',
    title: 'The Dedup Key',
    difficulty: 'Advanced',
    category: 'Duplicates',
    summary: 'Three webhook rows share one event_id. Rank with ROW_NUMBER() OVER (PARTITION BY).',
    problem: `Webhooks retried without an idempotency key: event EVT-9 arrived 3 times. Use ROW_NUMBER() OVER (PARTITION BY event_id ORDER BY received_at) to number copies and keep rn > 1 as dupes.`,
    objective: 'ROW_NUMBER() PARTITION BY event_id; dupes are rn > 1.',
    initialSql: `-- Step 1: number copies per event:
SELECT event_id, received_at,
  ROW_NUMBER() OVER (PARTITION BY event_id ORDER BY received_at) AS rn
FROM webhooks
ORDER BY event_id, rn;`,
    hints: ['PARTITION BY event_id restarts numbering per event.', 'EVT-9 gets rn = 1, 2, 3.', 'Filter rn > 1 to keep the 2 dupes.'],
    expectedDiscrepancy: 2,
    tables: [
      { name: 'webhooks', rowCount: 5, description: 'Webhook deliveries.', columns: [
        { name: 'hook_id', type: 'INTEGER', isPrimary: true }, { name: 'event_id', type: 'VARCHAR' }, { name: 'received_at', type: 'TIMESTAMP' },
      ]},
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS webhooks;
      CREATE TABLE webhooks (hook_id SERIAL PRIMARY KEY, event_id VARCHAR(50) NOT NULL, received_at TIMESTAMP NOT NULL);
      INSERT INTO webhooks (hook_id, event_id, received_at) VALUES
      (1,'EVT-9','2024-09-01 10:00:00'),(2,'EVT-9','2024-09-01 10:00:02'),(3,'EVT-9','2024-09-01 10:00:04'),
      (4,'EVT-1','2024-09-01 11:00:00'),(5,'EVT-2','2024-09-01 12:00:00');
    `,
    solution: {
      rootCause: 'EVT-9 delivered 3 times; rn 2 and 3 are the 2 duplicate retries.',
      expectedDiscrepancyText: '2 duplicate deliveries of EVT-9',
      keyFindings: ['ROW_NUMBER partitions by event_id.', 'EVT-1 and EVT-2 have rn = 1 only.'],
      validationCheck: keywordCheck(['row_number', 'partition', 'evt-9', 'dedupe', 'duplicate', 'rn'], 'Mention ROW_NUMBER/PARTITION and EVT-9.'),
    },
  },
];
