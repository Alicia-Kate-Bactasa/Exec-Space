import { CaseDefinition } from '../types';
import { BEGINNER_CASES } from './casesBeginner';
import { INTERMEDIATE_CASES } from './casesIntermediate';
import { ADVANCED_CASES } from './casesAdvanced';

const ORIGINAL_CASES: CaseDefinition[] = [
  {
    id: 'case-04',
    code: 'Case #04',
    title: 'The Missing ₱2.4M',
    difficulty: 'Intermediate',
    category: 'Missing Revenue',
    summary: 'A company report says ₱8.2M in revenue, but the finance database says ₱5.8M. Investigate the database and find out why.',
    problem: `Executive management received an automated monthly revenue summary asserting gross sales of ₱8,200,000 across Q3. 
However, the treasury & finance department only verified ₱5,800,000 deposited in bank settlements.
There is a massive ₱2,400,000 discrepancy between what business reporting claims and what bank settlement records show.
Your mission as the Data Detective is to query the transactional database, identify the discrepancy sources, and calculate the exact mathematical proof.`,
    objective: 'Investigate the orders, refunds, and bank_settlements tables to locate the exact ₱2,400,000 variance.',
    initialSql: `-- Start by inspecting the total revenue reported by raw orders:
SELECT 
    COUNT(*) AS total_orders,
    SUM(gross_amount) AS raw_total_revenue
FROM orders;`,
    hints: [
      'Check the status column in the orders table. Are all orders actually completed?',
      'Inspect the refunds table. Did any refunds get issued that were not deducted from the raw revenue report?',
      'Compare SUM(gross_amount) of failed/cancelled orders and SUM(amount) of refunds.'
    ],
    expectedDiscrepancy: 2400000,
    tables: [
      {
        name: 'orders',
        rowCount: 16,
        description: 'Customer transactions placed through web and mobile channels.',
        columns: [
          { name: 'order_id', type: 'INTEGER', isPrimary: true, description: 'Unique order identifier' },
          { name: 'customer_id', type: 'INTEGER', description: 'Customer ID' },
          { name: 'order_date', type: 'DATE', description: 'Date of order placement' },
          { name: 'gross_amount', type: 'NUMERIC', description: 'Gross order value in PHP' },
          { name: 'payment_method', type: 'VARCHAR', description: 'Payment channel (CARD, GCASH, MAYA)' },
          { name: 'status', type: 'VARCHAR', description: 'Order fulfillment status (completed, cancelled, failed)' },
        ],
      },
      {
        name: 'refunds',
        rowCount: 5,
        description: 'Processed customer refunds and payment reversals.',
        columns: [
          { name: 'refund_id', type: 'INTEGER', isPrimary: true, description: 'Unique refund identifier' },
          { name: 'order_id', type: 'INTEGER', isForeign: true, foreignTable: 'orders', description: 'Associated order ID' },
          { name: 'refund_date', type: 'DATE', description: 'Date refund was processed' },
          { name: 'amount', type: 'NUMERIC', description: 'Refunded amount in PHP' },
          { name: 'reason', type: 'VARCHAR', description: 'Customer reason for refund' },
        ],
      },
      {
        name: 'bank_settlements',
        rowCount: 10,
        description: 'Actual verified payouts deposited into corporate bank accounts.',
        columns: [
          { name: 'settlement_id', type: 'INTEGER', isPrimary: true, description: 'Settlement batch ID' },
          { name: 'order_id', type: 'INTEGER', isForeign: true, foreignTable: 'orders', description: 'Settled order ID' },
          { name: 'settlement_date', type: 'DATE', description: 'Settlement clearing date' },
          { name: 'settled_amount', type: 'NUMERIC', description: 'Net amount deposited in bank' },
          { name: 'channel', type: 'VARCHAR', description: 'Settlement gateway channel' },
        ],
      },
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS bank_settlements;
      DROP TABLE IF EXISTS refunds;
      DROP TABLE IF EXISTS orders;

      CREATE TABLE orders (
        order_id SERIAL PRIMARY KEY,
        customer_id INT NOT NULL,
        order_date DATE NOT NULL,
        gross_amount NUMERIC(12, 2) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL
      );

      CREATE TABLE refunds (
        refund_id SERIAL PRIMARY KEY,
        order_id INT REFERENCES orders(order_id),
        refund_date DATE NOT NULL,
        amount NUMERIC(12, 2) NOT NULL,
        reason VARCHAR(150) NOT NULL
      );

      CREATE TABLE bank_settlements (
        settlement_id SERIAL PRIMARY KEY,
        order_id INT REFERENCES orders(order_id),
        settlement_date DATE NOT NULL,
        settled_amount NUMERIC(12, 2) NOT NULL,
        channel VARCHAR(50) NOT NULL
      );

      -- Seed Orders (Sum gross_amount = 8,200,000)
      -- Completed orders = 5,800,000 + 900,000 (refunded later) = 6,700,000
      -- Failed/Cancelled orders = 1,500,000
      INSERT INTO orders (order_id, customer_id, order_date, gross_amount, payment_method, status) VALUES
      (101, 1001, '2024-09-01', 850000.00, 'CARD', 'completed'),
      (102, 1002, '2024-09-02', 450000.00, 'GCASH', 'completed'),
      (103, 1003, '2024-09-03', 700000.00, 'CARD', 'failed'),
      (104, 1004, '2024-09-05', 900000.00, 'MAYA', 'completed'),
      (105, 1005, '2024-09-07', 800000.00, 'CARD', 'cancelled'),
      (106, 1006, '2024-09-08', 350000.00, 'GCASH', 'completed'),
      (107, 1007, '2024-09-10', 400000.00, 'CARD', 'completed'),
      (108, 1008, '2024-09-12', 650000.00, 'MAYA', 'completed'),
      (109, 1009, '2024-09-15', 500000.00, 'CARD', 'completed'),
      (110, 1010, '2024-09-16', 300000.00, 'GCASH', 'completed'),
      (111, 1011, '2024-09-18', 400000.00, 'CARD', 'completed'),
      (112, 1012, '2024-09-20', 600000.00, 'CARD', 'completed'),
      (113, 1013, '2024-09-22', 750000.00, 'GCASH', 'completed'),
      (114, 1014, '2024-09-25', 250000.00, 'MAYA', 'completed'),
      (115, 1015, '2024-09-27', 150000.00, 'CARD', 'completed'),
      (116, 1016, '2024-09-28', 150000.00, 'GCASH', 'completed');

      -- Seed Refunds (Total = 900,000)
      INSERT INTO refunds (refund_id, order_id, refund_date, amount, reason) VALUES
      (201, 104, '2024-09-09', 400000.00, 'Damaged luxury equipment on delivery'),
      (202, 107, '2024-09-14', 200000.00, 'Partial customer return of order batch'),
      (203, 110, '2024-09-21', 150000.00, 'Incorrect corporate invoice quantity'),
      (204, 114, '2024-09-27', 100000.00, 'Late delivery SLA penalty refund'),
      (205, 115, '2024-09-29', 50000.00, 'Promotional rebate adjustment');

      -- Seed Bank Settlements (Total = 5,800,000)
      INSERT INTO bank_settlements (settlement_id, order_id, settlement_date, settled_amount, channel) VALUES
      (301, 101, '2024-09-03', 850000.00, 'METROBANK'),
      (302, 102, '2024-09-04', 450000.00, 'BDO'),
      (303, 104, '2024-09-11', 500000.00, 'BPI'), -- 900k gross minus 400k refund
      (304, 106, '2024-09-10', 350000.00, 'BDO'),
      (305, 107, '2024-09-16', 200000.00, 'METROBANK'), -- 400k gross minus 200k refund
      (306, 108, '2024-09-14', 650000.00, 'BPI'),
      (307, 109, '2024-09-17', 500000.00, 'METROBANK'),
      (308, 110, '2024-09-23', 150000.00, 'BDO'), -- 300k gross minus 150k refund
      (309, 111, '2024-09-20', 400000.00, 'METROBANK'),
      (310, 112, '2024-09-22', 600000.00, 'BDO'),
      (311, 113, '2024-09-24', 750000.00, 'BPI'),
      (312, 114, '2024-09-29', 150000.00, 'BPI'), -- 250k gross minus 100k refund
      (313, 115, '2024-09-30', 100000.00, 'METROBANK'), -- 150k gross minus 50k refund
      (314, 116, '2024-09-30', 150000.00, 'BDO');
    `,
    solution: {
      rootCause: 'Unfiltered failed/cancelled orders (₱1.5M) combined with unrecorded processed refunds (₱900K).',
      expectedDiscrepancyText: '₱2,400,000 (₱1,500,000 in unfulfilled orders + ₱900,000 in refunds)',
      keyFindings: [
        'Orders table includes ₱1,500,000 from failed and cancelled orders (Order 103 for ₱700K failed, Order 105 for ₱800K cancelled).',
        'Refunds table records ₱900,000 across 5 refunded orders that were deducted from bank settlements but left in the gross sales report.',
        'Net formula: ₱8,200,000 - ₱1,500,000 (unfulfilled) - ₱900,000 (refunds) = ₱5,800,000 verified settlement.'
      ],
      validationCheck: (data) => {
        const text = `${data.culprit} ${data.discrepancy} ${data.explanation}`.toLowerCase();
        const hasRefundMention = text.includes('refund') || text.includes('900');
        const hasFailedOrCancelled = text.includes('fail') || text.includes('cancel') || text.includes('status') || text.includes('1.5') || text.includes('1,500,000');
        const hasAmount = text.includes('2.4') || text.includes('2,400,000') || text.includes('2400000');

        const breakdown: string[] = [];

        if (hasFailedOrCancelled) {
          breakdown.push('Identified unfulfilled/failed/cancelled orders totaling ₱1.5M');
        } else {
          breakdown.push('Missing observation: Failed/cancelled orders were incorrectly counted in gross revenue.');
        }

        if (hasRefundMention) {
          breakdown.push('Identified customer refunds totaling ₱900,000 deducted by the bank');
        } else {
          breakdown.push('Missing observation: Processed customer refunds were not subtracted.');
        }

        if (hasAmount) {
          breakdown.push('Accurately pinned the ₱2.4M exact mathematical discrepancy.');
        }

        if (data.evidenceCount > 0) {
          breakdown.push(`Attached ${data.evidenceCount} verified piece(s) of database evidence.`);
        } else {
          breakdown.push('No evidence items attached from the Evidence Board.');
        }

        if (hasFailedOrCancelled && hasRefundMention && (hasAmount || text.includes('2.4'))) {
          return {
            status: 'VERIFIED',
            score: 100,
            feedback: 'Excellent Detective Work! You uncovered both the unfulfilled order leakage (₱1.5M) and the unrecorded refund deductions (₱900K), resolving the full ₱2.4M discrepancy.',
            breakdown,
          };
        } else if (hasFailedOrCancelled || hasRefundMention) {
          return {
            status: 'PARTIAL',
            score: 65,
            feedback: 'Partial Discovery: You found one component of the discrepancy, but the report has multiple root causes (check both order status and refunds table).',
            breakdown,
          };
        } else {
          return {
            status: 'INCORRECT',
            score: 25,
            feedback: 'Hypothesis needs revision. Examine the "status" field in orders and compare it with the "refunds" table.',
            breakdown,
          };
        }
      },
    },
  },
  {
    id: 'case-01',
    code: 'Case #01',
    title: 'The Phantom Double-Dips',
    difficulty: 'Beginner',
    category: 'Duplicate Transactions',
    summary: 'Clients reported double billings. Finance observed customer charges exceed fulfilled orders by ₱420,000.',
    problem: `During November reconciliation, customer service flagged that several clients complained about getting charged twice for a single invoice.
The database shows total customer payments charged exceed valid invoiced purchases by exactly ₱420,000.
Identify which invoices were duplicated, why it happened, and the exact excess amount.`,
    objective: 'Query invoices, payments, and gateway logs to discover duplicate charges and quantify the ₱420,000 overcharge.',
    initialSql: `-- Inspect payments grouped by invoice_id to check for duplicate billing:
SELECT 
    invoice_id, 
    COUNT(*) AS payment_count, 
    SUM(amount_paid) AS total_paid
FROM payments
GROUP BY invoice_id
HAVING COUNT(*) > 1;`,
    hints: [
      'Use GROUP BY invoice_id HAVING COUNT(*) > 1 on the payments table.',
      'Check the time difference between duplicate payments in the payments table.',
      'Inspect gateway_logs to see if network timeout retries were triggered without idempotency.'
    ],
    expectedDiscrepancy: 420000,
    tables: [
      {
        name: 'invoices',
        rowCount: 8,
        description: 'Customer invoices generated for validated sales.',
        columns: [
          { name: 'invoice_id', type: 'INTEGER', isPrimary: true, description: 'Invoice number' },
          { name: 'customer_id', type: 'INTEGER', description: 'Billed client ID' },
          { name: 'issue_date', type: 'DATE', description: 'Date invoice was issued' },
          { name: 'expected_amount', type: 'NUMERIC', description: 'Legitimate billable amount in PHP' },
        ],
      },
      {
        name: 'payments',
        rowCount: 11,
        description: 'Payment transactions processed through credit card gateways.',
        columns: [
          { name: 'payment_id', type: 'INTEGER', isPrimary: true, description: 'Transaction ID' },
          { name: 'invoice_id', type: 'INTEGER', isForeign: true, foreignTable: 'invoices', description: 'Referenced invoice ID' },
          { name: 'payment_time', type: 'TIMESTAMP', description: 'Exact timestamp of gateway charge' },
          { name: 'amount_paid', type: 'NUMERIC', description: 'Actual amount deducted' },
          { name: 'idempotency_key', type: 'VARCHAR', description: 'Unique payment idempotent identifier' },
        ],
      },
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS payments;
      DROP TABLE IF EXISTS invoices;

      CREATE TABLE invoices (
        invoice_id SERIAL PRIMARY KEY,
        customer_id INT NOT NULL,
        issue_date DATE NOT NULL,
        expected_amount NUMERIC(10, 2) NOT NULL
      );

      CREATE TABLE payments (
        payment_id SERIAL PRIMARY KEY,
        invoice_id INT REFERENCES invoices(invoice_id),
        payment_time TIMESTAMP NOT NULL,
        amount_paid NUMERIC(10, 2) NOT NULL,
        idempotency_key VARCHAR(100)
      );

      INSERT INTO invoices (invoice_id, customer_id, issue_date, expected_amount) VALUES
      (501, 901, '2024-11-01', 120000.00),
      (502, 902, '2024-11-02', 180000.00),
      (503, 903, '2024-11-03', 250000.00),
      (504, 904, '2024-11-05', 90000.00),
      (505, 905, '2024-11-06', 150000.00),
      (506, 906, '2024-11-08', 300000.00),
      (507, 907, '2024-11-10', 80000.00),
      (508, 908, '2024-11-12', 210000.00);

      -- Payments with duplicates on invoice 502 (180k) and 503 (240k? wait: 180k + 240k = 420k)
      INSERT INTO payments (payment_id, invoice_id, payment_time, amount_paid, idempotency_key) VALUES
      (1, 501, '2024-11-01 10:15:20', 120000.00, 'KEY-501-A'),
      (2, 502, '2024-11-02 14:02:10', 180000.00, 'KEY-502-A'),
      (3, 502, '2024-11-02 14:02:12', 180000.00, NULL), -- DUPLICATE 180,000
      (4, 503, '2024-11-03 09:30:45', 240000.00, 'KEY-503-A'),
      (5, 503, '2024-11-03 09:30:48', 240000.00, NULL), -- DUPLICATE 240,000 (total = 420,000)
      (6, 504, '2024-11-05 16:45:00', 90000.00, 'KEY-504-A'),
      (7, 505, '2024-11-06 11:20:10', 150000.00, 'KEY-505-A'),
      (8, 506, '2024-11-08 13:10:30', 300000.00, 'KEY-506-A'),
      (9, 507, '2024-11-10 18:05:15', 80000.00, 'KEY-507-A'),
      (10, 508, '2024-11-12 12:40:22', 210000.00, 'KEY-508-A');
    `,
    solution: {
      rootCause: 'Network retry duplicate payments on Invoices #502 and #503 with NULL idempotency keys.',
      expectedDiscrepancyText: '₱420,000 (Duplicate ₱180,000 on Invoice 502 + ₱240,000 on Invoice 503)',
      keyFindings: [
        'Invoice 502 was billed twice for ₱180,000 within 2 seconds.',
        'Invoice 503 was billed twice for ₱240,000 within 3 seconds.',
        'Total excess phantom charges: ₱180,000 + ₱240,000 = ₱420,000.',
        'The secondary charges lacked idempotency keys.'
      ],
      validationCheck: (data) => {
        const text = `${data.culprit} ${data.discrepancy} ${data.explanation}`.toLowerCase();
        const hasDuplicates = text.includes('duplicate') || text.includes('double') || text.includes('502') || text.includes('503');
        const hasAmount = text.includes('420') || text.includes('420,000') || (text.includes('180') && text.includes('240'));

        const breakdown: string[] = [];
        if (hasDuplicates) breakdown.push('Identified duplicate transactions on invoices 502 and 503');
        if (hasAmount) breakdown.push('Correctly quantified the ₱420,000 overbilled amount');
        if (data.evidenceCount > 0) breakdown.push(`Attached ${data.evidenceCount} verified piece(s) of evidence`);

        if (hasDuplicates && hasAmount) {
          return {
            status: 'VERIFIED',
            score: 100,
            feedback: 'Case Solved! You identified the duplicate charges on invoices 502 and 503 caused by missing idempotency keys, confirming the ₱420,000 total.',
            breakdown,
          };
        } else {
          return {
            status: 'PARTIAL',
            score: 50,
            feedback: 'Review invoices 502 and 503 and sum their duplicated amounts.',
            breakdown,
          };
        }
      },
    },
  },
  {
    id: 'case-02',
    code: 'Case #02',
    title: 'The Midnight Ghost Cart',
    difficulty: 'Intermediate',
    category: 'Suspicious Sales',
    summary: '85 high-end graphics cards vanished from inventory between 2 AM and 4 AM, but revenue was only ₱85 instead of ₱4.25M.',
    problem: `During an audit of the tech warehouse, logistics noted that 85 flagship RTX 4090 GPUs (valued at ₱50,000 each) were checked out between 02:00 AM and 04:00 AM on Sunday.
However, finance only recorded ₱85 in revenue from the order items. 
Investigate the orders, discount codes, and order_items to explain this pricing exploitation.`,
    objective: 'Examine order_items, orders, and promo codes to discover how 85 units were acquired for ₱1 each.',
    initialSql: `-- Inspect items sold with abnormal prices:
SELECT 
    oi.item_id, 
    oi.product_name, 
    oi.unit_price, 
    oi.quantity, 
    o.voucher_code,
    o.order_time
FROM order_items oi
JOIN orders o ON oi.order_id = o.order_id
WHERE oi.unit_price < 100;`,
    hints: [
      'Check the unit_price in order_items for high-value items.',
      'Check which voucher_code was applied on orders between 02:00 and 04:00.',
      'Inspect the vouchers table to see the flaw in how the test discount was defined.'
    ],
    expectedDiscrepancy: 4249915,
    tables: [
      {
        name: 'order_items',
        rowCount: 8,
        description: 'Line items associated with each customer order.',
        columns: [
          { name: 'item_id', type: 'INTEGER', isPrimary: true, description: 'Line item ID' },
          { name: 'order_id', type: 'INTEGER', description: 'Order ID' },
          { name: 'product_name', type: 'VARCHAR', description: 'Product title' },
          { name: 'quantity', type: 'INTEGER', description: 'Units purchased' },
          { name: 'unit_price', type: 'NUMERIC', description: 'Final price per unit charged in PHP' },
        ],
      },
      {
        name: 'orders',
        rowCount: 6,
        description: 'Customer orders placed during the weekend shift.',
        columns: [
          { name: 'order_id', type: 'INTEGER', isPrimary: true, description: 'Order ID' },
          { name: 'customer_ip', type: 'VARCHAR', description: 'Source IP address' },
          { name: 'order_time', type: 'TIMESTAMP', description: 'Order timestamp' },
          { name: 'voucher_code', type: 'VARCHAR', description: 'Voucher code applied' },
        ],
      },
      {
        name: 'vouchers',
        rowCount: 4,
        description: 'Discount codes registered in the marketing system.',
        columns: [
          { name: 'code', type: 'VARCHAR', isPrimary: true, description: 'Promo code' },
          { name: 'discount_type', type: 'VARCHAR', description: 'Type (PERCENTAGE vs FIXED_PRICE_OVERRIDE)' },
          { name: 'value', type: 'NUMERIC', description: 'Voucher configuration value' },
          { name: 'is_internal_test', type: 'BOOLEAN', description: 'Whether meant for staging testing' },
        ],
      },
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS order_items;
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS vouchers;

      CREATE TABLE vouchers (
        code VARCHAR(50) PRIMARY KEY,
        discount_type VARCHAR(50) NOT NULL,
        value NUMERIC(10, 2) NOT NULL,
        is_internal_test BOOLEAN NOT NULL
      );

      CREATE TABLE orders (
        order_id SERIAL PRIMARY KEY,
        customer_ip VARCHAR(50) NOT NULL,
        order_time TIMESTAMP NOT NULL,
        voucher_code VARCHAR(50)
      );

      CREATE TABLE order_items (
        item_id SERIAL PRIMARY KEY,
        order_id INT REFERENCES orders(order_id),
        product_name VARCHAR(100) NOT NULL,
        quantity INT NOT NULL,
        unit_price NUMERIC(10, 2) NOT NULL
      );

      INSERT INTO vouchers (code, discount_type, value, is_internal_test) VALUES
      ('WELCOME10', 'PERCENTAGE', 10.00, FALSE),
      ('FLASHSALE', 'PERCENTAGE', 25.00, FALSE),
      ('DEV_1PESO_OVERRIDE', 'FIXED_PRICE_OVERRIDE', 1.00, TRUE),
      ('VIP50', 'PERCENTAGE', 50.00, FALSE);

      INSERT INTO orders (order_id, customer_ip, order_time, voucher_code) VALUES
      (701, '112.198.40.12', '2024-10-13 01:15:00', 'WELCOME10'),
      (702, '45.140.18.99', '2024-10-13 02:22:15', 'DEV_1PESO_OVERRIDE'),
      (703, '45.140.18.99', '2024-10-13 02:45:00', 'DEV_1PESO_OVERRIDE'),
      (704, '45.140.18.99', '2024-10-13 03:10:40', 'DEV_1PESO_OVERRIDE'),
      (705, '120.28.0.5', '2024-10-13 08:30:10', 'FLASHSALE');

      INSERT INTO order_items (item_id, order_id, product_name, quantity, unit_price) VALUES
      (1, 701, 'Mechanical Keyboard', 2, 4500.00),
      (2, 702, 'RTX 4090 GPU (24GB)', 30, 1.00),
      (3, 703, 'RTX 4090 GPU (24GB)', 30, 1.00),
      (4, 704, 'RTX 4090 GPU (24GB)', 25, 1.00),
      (5, 705, '4K Gaming Monitor', 1, 32000.00);
    `,
    solution: {
      rootCause: 'Leaked internal test voucher DEV_1PESO_OVERRIDE forced fixed price of ₱1 per GPU.',
      expectedDiscrepancyText: '₱4,249,915 revenue loss (85 units valued at ₱50,000 sold for ₱85 total)',
      keyFindings: [
        'Orders 702, 703, and 704 were placed from the same IP (45.140.18.99).',
        'Voucher DEV_1PESO_OVERRIDE had discount_type FIXED_PRICE_OVERRIDE setting unit_price to ₱1.00.',
        '85 units of RTX 4090 were bought for ₱85 instead of ₱4,250,000.'
      ],
      validationCheck: (data) => {
        const text = `${data.culprit} ${data.discrepancy} ${data.explanation}`.toLowerCase();
        const hasVoucher = text.includes('voucher') || text.includes('promo') || text.includes('dev_1peso') || text.includes('override');
        const hasQuantityOrLoss = text.includes('85') || text.includes('4,250,000') || text.includes('4.25');

        const breakdown: string[] = [];
        if (hasVoucher) breakdown.push('Identified the internal test price override voucher exploitation');
        if (hasQuantityOrLoss) breakdown.push('Correctly linked the 85 GPU units and financial damage');
        if (data.evidenceCount > 0) breakdown.push(`Attached ${data.evidenceCount} verified piece(s) of evidence`);

        if (hasVoucher && hasQuantityOrLoss) {
          return {
            status: 'VERIFIED',
            score: 100,
            feedback: 'Perceptive investigation! You caught the unauthorized execution of DEV_1PESO_OVERRIDE that exploited 85 GPUs down to ₱1 each.',
            breakdown,
          };
        } else {
          return {
            status: 'PARTIAL',
            score: 55,
            feedback: 'Inspect the voucher_code column and vouchers table to identify the exploit mechanism.',
            breakdown,
          };
        }
      },
    },
  },
  {
    id: 'case-03',
    code: 'Case #03',
    title: 'The Amnesiac Loyalty Accounts',
    difficulty: 'Advanced',
    category: 'Corrupted Records',
    summary: 'VIP members reported their accumulated tier points reset to 0 after an overnight database sync.',
    problem: `Following a database migration sync between legacy web accounts and the new membership system, hundreds of VIP clients discovered their lifetime loyalty points balances displayed 0.
The legacy data was not deleted, but queries on customer balances return zeroes for migrated accounts.
Uncover how the data sync broke the linkage between customers and their loyalty ledgers.`,
    objective: 'Discover the join mismatch between customers and loyalty_points caused by unformatted email strings.',
    initialSql: `-- Compare email formats between customers and loyalty_points:
SELECT 
    c.customer_id, 
    c.email AS customer_email, 
    lp.email AS ledger_email, 
    lp.points
FROM customers c
LEFT JOIN loyalty_points lp ON c.email = lp.email;`,
    hints: [
      'Look at whitespace or casing in the email columns using LENGTH(email).',
      'Try joining on TRIM(LOWER(c.email)) = TRIM(LOWER(lp.email)).',
      'Determine how many loyalty points were orphaned due to dirty string formatting.'
    ],
    expectedDiscrepancy: 84000,
    tables: [
      {
        name: 'customers',
        rowCount: 6,
        description: 'New unified user directory.',
        columns: [
          { name: 'customer_id', type: 'INTEGER', isPrimary: true, description: 'Customer ID' },
          { name: 'name', type: 'VARCHAR', description: 'Customer full name' },
          { name: 'email', type: 'VARCHAR', description: 'Email address' },
          { name: 'tier', type: 'VARCHAR', description: 'Loyalty tier' },
        ],
      },
      {
        name: 'loyalty_points',
        rowCount: 6,
        description: 'Legacy loyalty ledger table with accumulated points.',
        columns: [
          { name: 'ledger_id', type: 'INTEGER', isPrimary: true, description: 'Ledger record ID' },
          { name: 'email', type: 'VARCHAR', description: 'Email tied to points ledger' },
          { name: 'points', type: 'INTEGER', description: 'Points balance' },
        ],
      },
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS loyalty_points;
      DROP TABLE IF EXISTS customers;

      CREATE TABLE customers (
        customer_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        tier VARCHAR(50) NOT NULL
      );

      CREATE TABLE loyalty_points (
        ledger_id SERIAL PRIMARY KEY,
        email VARCHAR(100) NOT NULL,
        points INT NOT NULL
      );

      INSERT INTO customers (customer_id, name, email, tier) VALUES
      (1, 'Alice Tan', 'alice.tan@example.com ', 'DIAMOND'), -- trailing space
      (2, 'Roberto Gomez', 'ROBERTO@EXAMPLE.COM', 'PLATINUM'), -- uppercase
      (3, 'Carla Diaz', 'carla.diaz@example.com', 'GOLD'),
      (4, 'David Lee', 'david.lee@example.com ', 'DIAMOND'), -- trailing space
      (5, 'Elena Santos', 'ELENA.S@EXAMPLE.COM ', 'PLATINUM'), -- uppercase & space
      (6, 'Ferdinand Marcos', 'ferdinand@example.com', 'SILVER');

      INSERT INTO loyalty_points (ledger_id, email, points) VALUES
      (101, 'alice.tan@example.com', 25000),
      (102, 'roberto@example.com', 18000),
      (103, 'carla.diaz@example.com', 12000),
      (104, 'david.lee@example.com', 22000),
      (105, 'elena.s@example.com', 19000),
      (106, 'ferdinand@example.com', 5000);
    `,
    solution: {
      rootCause: 'Untrimmed whitespace and inconsistent email casing prevented standard equality joins on customer email.',
      expectedDiscrepancyText: '84,000 points orphaned across 4 VIP accounts',
      keyFindings: [
        'Standard join failed on 4 out of 6 accounts due to whitespace and casing differences.',
        'Using TRIM(LOWER(email)) reconnects 84,000 missing loyalty points.',
        'Alice (25k), Roberto (18k), David (22k), and Elena (19k) = 84k points.'
      ],
      validationCheck: (data) => {
        const text = `${data.culprit} ${data.discrepancy} ${data.explanation}`.toLowerCase();
        const hasTrimOrCase = text.includes('trim') || text.includes('space') || text.includes('case') || text.includes('whitespace') || text.includes('lower');
        const hasPoints = text.includes('84,000') || text.includes('84000') || text.includes('point');

        const breakdown: string[] = [];
        if (hasTrimOrCase) breakdown.push('Identified whitespace/casing discrepancy in email strings');
        if (hasPoints) breakdown.push('Accounted for the 84,000 orphaned points');
        if (data.evidenceCount > 0) breakdown.push(`Attached ${data.evidenceCount} verified piece(s) of evidence`);

        if (hasTrimOrCase) {
          return {
            status: 'VERIFIED',
            score: 100,
            feedback: 'Brilliant data detective work! You discovered the dirty string encoding (trailing spaces & uppercase) that broke the customer loyalty joins.',
            breakdown,
          };
        } else {
          return {
            status: 'PARTIAL',
            score: 50,
            feedback: 'Inspect the length and casing of emails in both tables using LENGTH() and LOWER().',
            breakdown,
          };
        }
      },
    },
  },
  {
    id: 'case-05',
    code: 'Case #05',
    title: 'The Black Friday Gateway Drop',
    difficulty: 'Intermediate',
    category: 'Anomaly Detection',
    summary: 'At 18:00 on Black Friday, revenue dropped 75% despite peak site traffic.',
    problem: `During Black Friday peak hours, web traffic surged past 50,000 concurrent shoppers.
However, revenue abruptly cratered from ₱3.2M/hour down to under ₱800K/hour starting at 18:00.
Marketing blamed user drop-off, while DevOps claimed the servers stayed up.
Investigate the checkout logs and gateway rates to determine what caused thousands of payments to fail.`,
    objective: 'Query checkout_attempts and gateway_configs to diagnose the rate-limit failure at 18:00.',
    initialSql: `-- Check hourly checkout success vs failure rates:
SELECT 
    hour_slot, 
    COUNT(*) AS total_attempts,
    SUM(CASE WHEN status = 'SUCCESS' THEN 1 ELSE 0 END) AS success_count,
    SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) AS fail_count
FROM checkout_attempts
GROUP BY hour_slot
ORDER BY hour_slot;`,
    hints: [
      'Group checkout_attempts by hour_slot and status.',
      'Check error_code in checkout_attempts for failed transactions at 18:00.',
      'Check gateway_configs for rate limits and fallback gateway status.'
    ],
    expectedDiscrepancy: 12400,
    tables: [
      {
        name: 'checkout_attempts',
        rowCount: 8,
        description: 'Aggregated hourly checkout logs by payment processor.',
        columns: [
          { name: 'hour_slot', type: 'VARCHAR', description: 'Hourly time window' },
          { name: 'gateway_code', type: 'VARCHAR', description: 'Target gateway' },
          { name: 'status', type: 'VARCHAR', description: 'SUCCESS or FAILED' },
          { name: 'error_code', type: 'VARCHAR', description: 'Reported error code' },
          { name: 'attempt_count', type: 'INTEGER', description: 'Number of transactions' },
        ],
      },
      {
        name: 'gateway_configs',
        rowCount: 2,
        description: 'Payment gateway configuration and failover settings.',
        columns: [
          { name: 'gateway_code', type: 'VARCHAR', isPrimary: true, description: 'Gateway ID' },
          { name: 'rate_limit_per_hour', type: 'INTEGER', description: 'Max allowed hourly transactions' },
          { name: 'fallback_enabled', type: 'BOOLEAN', description: 'Automatic failover flag' },
        ],
      },
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS checkout_attempts;
      DROP TABLE IF EXISTS gateway_configs;

      CREATE TABLE gateway_configs (
        gateway_code VARCHAR(50) PRIMARY KEY,
        rate_limit_per_hour INT NOT NULL,
        fallback_enabled BOOLEAN NOT NULL
      );

      CREATE TABLE checkout_attempts (
        hour_slot VARCHAR(10) NOT NULL,
        gateway_code VARCHAR(50) NOT NULL,
        status VARCHAR(20) NOT NULL,
        error_code VARCHAR(50),
        attempt_count INT NOT NULL
      );

      INSERT INTO gateway_configs (gateway_code, rate_limit_per_hour, fallback_enabled) VALUES
      ('PAY_PRIMARY', 3000, FALSE),
      ('PAY_SECONDARY_BACKUP', 10000, FALSE);

      INSERT INTO checkout_attempts (hour_slot, gateway_code, status, error_code, attempt_count) VALUES
      ('16:00', 'PAY_PRIMARY', 'SUCCESS', NULL, 2800),
      ('17:00', 'PAY_PRIMARY', 'SUCCESS', NULL, 2950),
      ('18:00', 'PAY_PRIMARY', 'SUCCESS', NULL, 3000),
      ('18:00', 'PAY_PRIMARY', 'FAILED', 'RATE_LIMIT_EXCEEDED', 9400),
      ('19:00', 'PAY_PRIMARY', 'SUCCESS', NULL, 3000),
      ('19:00', 'PAY_PRIMARY', 'FAILED', 'RATE_LIMIT_EXCEEDED', 8200),
      ('20:00', 'PAY_PRIMARY', 'SUCCESS', NULL, 2500);
    `,
    solution: {
      rootCause: 'Primary gateway hit 3,000 req/hr rate limit quota, failing 17,600+ checkouts because fallback_enabled was FALSE.',
      expectedDiscrepancyText: '17,600 failed transactions at 18:00 and 19:00 due to RATE_LIMIT_EXCEEDED',
      keyFindings: [
        'At 18:00 and 19:00, PAY_PRIMARY hit its cap of 3,000 transactions.',
        '9,400 attempts at 18:00 and 8,200 at 19:00 failed with RATE_LIMIT_EXCEEDED.',
        'PAY_SECONDARY_BACKUP was never engaged because fallback_enabled was set to FALSE in gateway_configs.'
      ],
      validationCheck: (data) => {
        const text = `${data.culprit} ${data.discrepancy} ${data.explanation}`.toLowerCase();
        const hasRateLimit = text.includes('rate') || text.includes('limit') || text.includes('exceeded') || text.includes('quota');
        const hasFallback = text.includes('fallback') || text.includes('backup') || text.includes('secondary');

        const breakdown: string[] = [];
        if (hasRateLimit) breakdown.push('Diagnosed the payment gateway rate limit ceiling');
        if (hasFallback) breakdown.push('Identified the missing automatic failover configuration');
        if (data.evidenceCount > 0) breakdown.push(`Attached ${data.evidenceCount} verified piece(s) of evidence`);

        if (hasRateLimit) {
          return {
            status: 'VERIFIED',
            score: 100,
            feedback: 'Masterful diagnosis! You identified the rate limit bottleneck on the primary gateway and the failure of the backup failover mechanism.',
            breakdown,
          };
        } else {
          return {
            status: 'PARTIAL',
            score: 45,
            feedback: 'Inspect the error_code column in checkout_attempts and check gateway_configs.',
            breakdown,
          };
        }
      },
    },
  },
];

// Combined library: 30 sets ordered by difficulty (beginner -> advanced).
// All sets render in one go on the landing page; no pagination or staged fades.
const BEGINNERS = [...BEGINNER_CASES, ...ORIGINAL_CASES.filter((c) => c.difficulty === 'Beginner')];
const INTERMEDIATES = [...ORIGINAL_CASES.filter((c) => c.difficulty === 'Intermediate'), ...INTERMEDIATE_CASES];
const ADVANCEDS = [...ORIGINAL_CASES.filter((c) => c.difficulty === 'Advanced'), ...ADVANCED_CASES];

export const CASE_LIST: CaseDefinition[] = [...BEGINNERS, ...INTERMEDIATES, ...ADVANCEDS];
