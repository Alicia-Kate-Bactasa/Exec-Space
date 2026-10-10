import { CaseDefinition } from '../types';

const keywordCheck = (required: string[], hint: string) => {
  return (data: { culprit: string; discrepancy: string; explanation: string; evidenceCount: number }) => {
    const text = `${data.culprit} ${data.discrepancy} ${data.explanation}`.toLowerCase();
    const hit = required.some((k) => text.includes(k.toLowerCase()));
    const breakdown: string[] = [];
    if (hit) breakdown.push('Named the key pattern from the data.');
    else breakdown.push(`Missing keyword. Hint: ${hint}`);
    if (data.evidenceCount > 0) breakdown.push(`Attached ${data.evidenceCount} piece(s) of evidence.`);
    else breakdown.push('Tip: pin at least 1 query result as evidence.');
    if (hit) {
      return { status: 'VERIFIED' as const, score: 100, feedback: 'Solved! Your finding matches the ground truth.', breakdown };
    }
    return { status: 'PARTIAL' as const, score: 55, feedback: `Good start. ${hint}`, breakdown };
  };
};

export const INTERMEDIATE_CASES: CaseDefinition[] = [
  {
    id: 'case-15',
    code: 'Case #15',
    title: 'The Refund Leak',
    difficulty: 'Intermediate',
    category: 'Missing Revenue',
    summary: 'Gross sales say 12,000 but refunds of 3,200 were ignored. Compute net revenue.',
    problem: `The dashboard reports gross sales of 12,000 from the orders table. But finance netted only 8,800 after refunds. Join orders to refunds, sum both sides, and prove the 3,200 leak.`,
    objective: 'SUM orders, SUM refunds, subtract to get net 8,800.',
    initialSql: `-- Step 1: compare gross vs refunds:
SELECT (SELECT SUM(amount) FROM orders) AS gross,
       (SELECT SUM(amount) FROM refunds) AS refund_total;`,
    hints: [
      'SUM(amount) FROM orders should be 12,000.',
      'SUM(amount) FROM refunds should be 3,200.',
      'Net = gross - refunds = 8,800.',
    ],
    expectedDiscrepancy: 3200,
    tables: [
      { name: 'orders', rowCount: 5, description: 'Gross sales.', columns: [
        { name: 'order_id', type: 'INTEGER', isPrimary: true }, { name: 'amount', type: 'NUMERIC' },
      ]},
      { name: 'refunds', rowCount: 3, description: 'Refunds to subtract.', columns: [
        { name: 'refund_id', type: 'INTEGER', isPrimary: true }, { name: 'order_id', type: 'INTEGER', isForeign: true, foreignTable: 'orders' }, { name: 'amount', type: 'NUMERIC' },
      ]},
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS refunds;
      DROP TABLE IF EXISTS orders;
      CREATE TABLE orders (order_id SERIAL PRIMARY KEY, amount NUMERIC(10,2) NOT NULL);
      CREATE TABLE refunds (refund_id SERIAL PRIMARY KEY, order_id INT REFERENCES orders(order_id), amount NUMERIC(10,2) NOT NULL);
      INSERT INTO orders (order_id, amount) VALUES (1,3000),(2,2500),(3,2000),(4,2800),(5,1700);
      INSERT INTO refunds (refund_id, order_id, amount) VALUES (1,2,1500),(2,4,1000),(3,5,700);
    `,
    solution: {
      rootCause: 'Refunds of 3,200 were never subtracted from gross 12,000; net is 8,800.',
      expectedDiscrepancyText: '3,200 refund leak (12,000 - 3,200 = 8,800)',
      keyFindings: ['Gross = 12,000.', 'Refunds = 3,200.', 'Net = 8,800.'],
      validationCheck: keywordCheck(['refund', '3200', '3,200', 'net', '8800', '8,800'], 'Mention refunds and the 3,200 total.'),
    },
  },
  {
    id: 'case-16',
    code: 'Case #16',
    title: 'The Stale Inventory',
    difficulty: 'Intermediate',
    category: 'Joins',
    summary: 'Three products never sold once. Find unsold stock with LEFT JOIN.',
    problem: `The catalogue has 6 products but sales mention only 3 of them. LEFT JOIN products to sales and keep rows where the sale side IS NULL to list dead stock worth clearing.`,
    objective: 'LEFT JOIN products to sales; filter unsold with IS NULL.',
    initialSql: `-- Step 1: products with no sales:
SELECT p.product_id, p.name
FROM products p
LEFT JOIN sales s ON s.product_id = p.product_id
WHERE s.sale_id IS NULL;`,
    hints: ['LEFT JOIN keeps every product.', 'WHERE s.sale_id IS NULL keeps unsold only.', 'There are 3 stale products.'],
    expectedDiscrepancy: 3,
    tables: [
      { name: 'products', rowCount: 6, description: 'Catalogue.', columns: [
        { name: 'product_id', type: 'INTEGER', isPrimary: true }, { name: 'name', type: 'VARCHAR' },
      ]},
      { name: 'sales', rowCount: 4, description: 'Sales lines.', columns: [
        { name: 'sale_id', type: 'INTEGER', isPrimary: true }, { name: 'product_id', type: 'INTEGER', isForeign: true, foreignTable: 'products' },
      ]},
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS sales;
      DROP TABLE IF EXISTS products;
      CREATE TABLE products (product_id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL);
      CREATE TABLE sales (sale_id SERIAL PRIMARY KEY, product_id INT REFERENCES products(product_id));
      INSERT INTO products (product_id, name) VALUES (1,'Lamp'),(2,'Chair'),(3,'Desk'),(4,'Shelf'),(5,'Rug'),(6,'Clock');
      INSERT INTO sales (sale_id, product_id) VALUES (1,1),(2,1),(3,3),(4,5);
    `,
    solution: {
      rootCause: 'Chair (2), Shelf (4), and Clock (6) never sold; LEFT JOIN exposes them.',
      expectedDiscrepancyText: '3 unsold products',
      keyFindings: ['Sold: Lamp, Desk, Rug.', 'Stale: Chair, Shelf, Clock.'],
      validationCheck: keywordCheck(['left join', 'is null', 'unsold', 'stale', 'chair', 'shelf', 'clock'], 'Mention LEFT JOIN + IS NULL or the stale items.'),
    },
  },
  {
    id: 'case-17',
    code: 'Case #17',
    title: 'The Discount Trap',
    difficulty: 'Intermediate',
    category: 'Anomaly Detection',
    summary: 'Two orders used >50% discounts and wiped margin. Filter discount_pct > 50.',
    problem: `Promo abuse: most orders use 5-20% off, but two used 70% and 60%. List orders with discount_pct above 50 and add up the lost margin.`,
    objective: 'WHERE discount_pct > 50; SUM the excess.',
    initialSql: `-- Step 1: abusive discounts:
SELECT order_id, total, discount_pct
FROM orders
WHERE discount_pct > 50;`,
    hints: ['Filter with WHERE discount_pct > 50.', 'Only 2 rows should return.', 'Orders 3 (70%) and 5 (60%).'],
    expectedDiscrepancy: 2,
    tables: [
      { name: 'orders', rowCount: 6, description: 'Orders with promo percent.', columns: [
        { name: 'order_id', type: 'INTEGER', isPrimary: true }, { name: 'total', type: 'NUMERIC' }, { name: 'discount_pct', type: 'INTEGER' },
      ]},
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS orders;
      CREATE TABLE orders (order_id SERIAL PRIMARY KEY, total NUMERIC(10,2) NOT NULL, discount_pct INT NOT NULL);
      INSERT INTO orders (order_id, total, discount_pct) VALUES
      (1,2000,10),(2,1500,20),(3,5000,70),(4,1800,5),(5,4200,60),(6,2200,15);
    `,
    solution: {
      rootCause: 'Orders 3 (70%) and 5 (60%) abused stackable promos.',
      expectedDiscrepancyText: '2 orders above 50% discount',
      keyFindings: ['Normal range is 5-20%.', 'Outliers: order 3 and order 5.'],
      validationCheck: keywordCheck(['discount', '70', '60', '50', 'promo', 'abuse'], 'Mention discount and orders 3 and 5.'),
    },
  },
  {
    id: 'case-18',
    code: 'Case #18',
    title: 'The Orphan Line',
    difficulty: 'Intermediate',
    category: 'Corrupted Records',
    summary: 'Two order lines point to orders that do not exist. Find orphans with LEFT JOIN.',
    problem: `After a bad import, some order_lines reference order_ids missing from orders. LEFT JOIN lines to orders and keep lines where the order side IS NULL.`,
    objective: 'Expose orphan lines via LEFT JOIN ... IS NULL.',
    initialSql: `-- Step 1: lines with no parent order:
SELECT l.line_id, l.order_id, l.item
FROM order_lines l
LEFT JOIN orders o ON o.order_id = l.order_id
WHERE o.order_id IS NULL;`,
    hints: ['Join lines to orders on order_id.', 'NULL on the orders side means orphan.', 'There are 2 orphan lines.'],
    expectedDiscrepancy: 2,
    tables: [
      { name: 'orders', rowCount: 3, description: 'Valid orders.', columns: [
        { name: 'order_id', type: 'INTEGER', isPrimary: true },
      ]},
      { name: 'order_lines', rowCount: 5, description: 'Lines, 2 orphaned.', columns: [
        { name: 'line_id', type: 'INTEGER', isPrimary: true }, { name: 'order_id', type: 'INTEGER' }, { name: 'item', type: 'VARCHAR' },
      ]},
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS order_lines;
      DROP TABLE IF EXISTS orders;
      CREATE TABLE orders (order_id INT PRIMARY KEY);
      CREATE TABLE order_lines (line_id SERIAL PRIMARY KEY, order_id INT NOT NULL, item VARCHAR(100) NOT NULL);
      INSERT INTO orders (order_id) VALUES (101),(102),(103);
      INSERT INTO order_lines (line_id, order_id, item) VALUES
      (1,101,'Keyboard'),(2,102,'Mouse'),(3,999,'Monitor'),(4,103,'Cable'),(5,888,'Desk');
    `,
    solution: {
      rootCause: 'Lines 3 (order 999) and 5 (order 888) reference deleted orders.',
      expectedDiscrepancyText: '2 orphan lines (999, 888)',
      keyFindings: ['LEFT JOIN shows NULL parents.', 'Orphans: line 3 and line 5.'],
      validationCheck: keywordCheck(['orphan', 'left join', 'is null', '999', '888'], 'Mention orphan or lines 999/888.'),
    },
  },
  {
    id: 'case-19',
    code: 'Case #19',
    title: 'The Salary Outlier',
    difficulty: 'Intermediate',
    category: 'Aggregates',
    summary: 'One salary is 5x the team average. Use AVG() then compare.',
    problem: `Payroll looks fine until you average it. Compute AVG(salary) for staff, then list anyone earning more than double the average to catch the outlier.`,
    objective: 'AVG(salary), then WHERE salary > avg * 2.',
    initialSql: `-- Step 1: team average:
SELECT AVG(salary) AS avg_pay FROM staff;
-- Step 2: who earns 2x the average?
SELECT name, salary FROM staff ORDER BY salary DESC;`,
    hints: ['AVG(salary) is about 33,000.', 'Nobody else is above 40,000.', 'The outlier earns 120,000.'],
    expectedDiscrepancy: 120000,
    tables: [
      { name: 'staff', rowCount: 6, description: 'Team payroll.', columns: [
        { name: 'staff_id', type: 'INTEGER', isPrimary: true }, { name: 'name', type: 'VARCHAR' }, { name: 'salary', type: 'NUMERIC' },
      ]},
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS staff;
      CREATE TABLE staff (staff_id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, salary NUMERIC(10,2) NOT NULL);
      INSERT INTO staff (staff_id, name, salary) VALUES
      (1,'Ana',28000),(2,'Ben',30000),(3,'Cora',32000),(4,'Dan',26000),(5,'Eli',24000),(6,'Max',120000);
    `,
    solution: {
      rootCause: 'Max earns 120,000, nearly 4x the 33,333 team average.',
      expectedDiscrepancyText: 'Outlier salary 120,000 (avg ~33,333)',
      keyFindings: ['AVG(salary) = 33,333.', 'Max is the only 2x+ outlier.'],
      validationCheck: keywordCheck(['avg', 'average', 'outlier', 'max', '120000', '120,000'], 'Mention AVG/average and Max at 120,000.'),
    },
  },
  {
    id: 'case-20',
    code: 'Case #20',
    title: 'The Weekend Dip',
    difficulty: 'Intermediate',
    category: 'Anomaly Detection',
    summary: 'Weekday sales beat weekends 3-to-1. GROUP BY day_type and compare.',
    problem: `Foot traffic is steady but weekend revenue collapsed. Group receipts by day_type (WEEKDAY vs WEEKEND), sum each, and quantify the dip.`,
    objective: 'GROUP BY day_type; SUM(amount); compare.',
    initialSql: `-- Step 1: weekday vs weekend totals:
SELECT day_type, SUM(amount) AS total
FROM receipts
GROUP BY day_type;`,
    hints: ['GROUP BY day_type gives 2 rows.', 'WEEKDAY total = 9,000; WEEKEND = 3,000.', 'The dip is 6,000.'],
    expectedDiscrepancy: 6000,
    tables: [
      { name: 'receipts', rowCount: 8, description: 'Receipts tagged by day type.', columns: [
        { name: 'receipt_id', type: 'INTEGER', isPrimary: true }, { name: 'day_type', type: 'VARCHAR' }, { name: 'amount', type: 'NUMERIC' },
      ]},
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS receipts;
      CREATE TABLE receipts (receipt_id SERIAL PRIMARY KEY, day_type VARCHAR(20) NOT NULL, amount NUMERIC(10,2) NOT NULL);
      INSERT INTO receipts (receipt_id, day_type, amount) VALUES
      (1,'WEEKDAY',2000),(2,'WEEKDAY',2500),(3,'WEEKDAY',2200),(4,'WEEKDAY',2300),
      (5,'WEEKEND',800),(6,'WEEKEND',700),(7,'WEEKEND',900),(8,'WEEKEND',600);
    `,
    solution: {
      rootCause: 'Weekends earned 3,000 vs 9,000 weekdays: a 6,000 dip.',
      expectedDiscrepancyText: 'Weekend dip of 6,000 (9,000 vs 3,000)',
      keyFindings: ['WEEKDAY = 9,000.', 'WEEKEND = 3,000.'],
      validationCheck: keywordCheck(['weekend', 'weekday', 'dip', '6000', '6,000', 'group by'], 'Mention weekend/weekday and 6,000.'),
    },
  },
  {
    id: 'case-21',
    code: 'Case #21',
    title: 'The Tier Mismatch',
    difficulty: 'Intermediate',
    category: 'Corrupted Records',
    summary: 'Two GOLD members hold platinum-level points. Use CASE to re-tier.',
    problem: `Loyalty tiers should follow points: 20,000+ means PLATINUM. Two members labelled GOLD actually qualify. Use a CASE expression to recompute tiers and list mismatches.`,
    objective: 'CASE WHEN points >= 20000 THEN PLATINUM; compare to tier.',
    initialSql: `-- Step 1: recompute tiers with CASE:
SELECT member_id, name, tier, points,
  CASE WHEN points >= 20000 THEN 'PLATINUM' ELSE tier END AS correct_tier
FROM members;`,
    hints: ['CASE WHEN points >= 20000 THEN PLATINUM.', 'Filter WHERE tier <> correct tier via subquery.', 'Mismatches: Cora and Eli.'],
    expectedDiscrepancy: 2,
    tables: [
      { name: 'members', rowCount: 5, description: 'Members with tiers + points.', columns: [
        { name: 'member_id', type: 'INTEGER', isPrimary: true }, { name: 'name', type: 'VARCHAR' }, { name: 'tier', type: 'VARCHAR' }, { name: 'points', type: 'INTEGER' },
      ]},
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS members;
      CREATE TABLE members (member_id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, tier VARCHAR(20) NOT NULL, points INT NOT NULL);
      INSERT INTO members (member_id, name, tier, points) VALUES
      (1,'Ana','PLATINUM',25000),(2,'Ben','GOLD',12000),(3,'Cora','GOLD',22000),(4,'Dan','SILVER',5000),(5,'Eli','GOLD',21000);
    `,
    solution: {
      rootCause: 'Cora (22,000) and Eli (21,000) are GOLD but qualify for PLATINUM.',
      expectedDiscrepancyText: '2 tier mismatches (Cora, Eli)',
      keyFindings: ['Rule: 20,000+ = PLATINUM.', 'CASE exposes Cora and Eli.'],
      validationCheck: keywordCheck(['case', 'tier', 'mismatch', 'cora', 'eli', 'platinum', '20000'], 'Mention CASE/tier and Cora/Eli.'),
    },
  },
];
