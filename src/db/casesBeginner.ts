import { CaseDefinition } from '../types';

// Lenient keyword validator keeps every set solvable for beginners.
// Returns VERIFIED when any required keyword appears in the finding text.
const keywordCheck = (required: string[], hint: string) => {
  return (data: { culprit: string; discrepancy: string; explanation: string; evidenceCount: number }) => {
    const text = `${data.culprit} ${data.discrepancy} ${data.explanation}`.toLowerCase();
    const hit = required.some((k) => text.includes(k.toLowerCase()));
    const breakdown: string[] = [];
    if (hit) {
      breakdown.push('Named the key pattern from the data.');
    } else {
      breakdown.push(`Missing keyword. Hint: ${hint}`);
    }
    if (data.evidenceCount > 0) {
      breakdown.push(`Attached ${data.evidenceCount} piece(s) of evidence.`);
    } else {
      breakdown.push('Tip: pin at least 1 query result as evidence.');
    }
    if (hit) {
      return {
        status: 'VERIFIED' as const,
        score: 100,
        feedback: 'Solved! Your finding matches the ground truth.',
        breakdown,
      };
    }
    return {
      status: 'PARTIAL' as const,
      score: 50,
      feedback: `Almost there. ${hint}`,
      breakdown,
    };
  };
};

export const BEGINNER_CASES: CaseDefinition[] = [
  {
    id: 'case-06',
    code: 'Case #06',
    title: 'The Empty Shelf',
    difficulty: 'Beginner',
    category: 'Filtering',
    summary: 'Three products show zero stock but are still listed as for sale. Find them with WHERE.',
    problem: `The shop lists 8 products as available, but warehouse staff say 3 shelves are empty. Customers can still order items with zero stock. Query the products table and list every product that must be hidden until restocked.`,
    objective: 'Use SELECT + WHERE to find all products with stock = 0.',
    initialSql: `-- Step 1: list every product with zero stock:
SELECT product_id, name, stock
FROM products
WHERE stock = 0;`,
    hints: [
      'Use WHERE stock = 0 to filter rows.',
      'SELECT only the columns you need: product_id, name, stock.',
      'Count them: there should be exactly 3 empty products.',
    ],
    expectedDiscrepancy: 3,
    tables: [
      {
        name: 'products',
        rowCount: 8,
        description: 'Shop catalogue with live stock counts.',
        columns: [
          { name: 'product_id', type: 'INTEGER', isPrimary: true, description: 'Product ID' },
          { name: 'name', type: 'VARCHAR', description: 'Product name' },
          { name: 'price', type: 'NUMERIC', description: 'Price in PHP' },
          { name: 'stock', type: 'INTEGER', description: 'Units on shelf' },
        ],
      },
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS products;
      CREATE TABLE products (
        product_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        stock INT NOT NULL
      );
      INSERT INTO products (product_id, name, price, stock) VALUES
      (1, 'Notebook', 120.00, 40),
      (2, 'Pen Set', 85.00, 0),
      (3, 'Desk Lamp', 950.00, 12),
      (4, 'USB Cable', 250.00, 0),
      (5, 'Mouse Pad', 300.00, 25),
      (6, 'Keyboard', 1800.00, 7),
      (7, 'Webcam', 2400.00, 0),
      (8, 'Monitor Stand', 1500.00, 9);
    `,
    solution: {
      rootCause: 'Pen Set, USB Cable, and Webcam have stock = 0 but are still listed.',
      expectedDiscrepancyText: '3 products with zero stock',
      keyFindings: [
        'WHERE stock = 0 returns exactly 3 rows.',
        'Those 3 items must be hidden until restocked.',
      ],
      validationCheck: keywordCheck(['stock', 'zero', 'empty', 'out of stock', 'pen set', 'usb', 'webcam'], 'Mention stock, zero, or empty shelf.'),
    },
  },
  {
    id: 'case-07',
    code: 'Case #07',
    title: 'The Late Parcel',
    difficulty: 'Beginner',
    category: 'Filtering',
    summary: 'Four parcels arrived after their due date. Filter by date comparison.',
    problem: `Support received complaints about late deliveries. Each shipment has a due_date and a real ship_date. Find every parcel where ship_date came after due_date and report how many were late.`,
    objective: 'Compare two DATE columns with WHERE ship_date > due_date.',
    initialSql: `-- Step 1: find late parcels by comparing dates:
SELECT shipment_id, order_id, due_date, ship_date
FROM shipments
WHERE ship_date > due_date;`,
    hints: [
      'Compare columns directly: WHERE ship_date > due_date.',
      'There are exactly 4 late parcels.',
      'Try ORDER BY ship_date to see the latest one first.',
    ],
    expectedDiscrepancy: 4,
    tables: [
      {
        name: 'shipments',
        rowCount: 7,
        description: 'Parcel deliveries with due and actual dates.',
        columns: [
          { name: 'shipment_id', type: 'INTEGER', isPrimary: true, description: 'Shipment ID' },
          { name: 'order_id', type: 'INTEGER', description: 'Order ID' },
          { name: 'due_date', type: 'DATE', description: 'Promised date' },
          { name: 'ship_date', type: 'DATE', description: 'Actual date' },
        ],
      },
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS shipments;
      CREATE TABLE shipments (
        shipment_id SERIAL PRIMARY KEY,
        order_id INT NOT NULL,
        due_date DATE NOT NULL,
        ship_date DATE NOT NULL
      );
      INSERT INTO shipments (shipment_id, order_id, due_date, ship_date) VALUES
      (1, 101, '2024-09-01', '2024-09-01'),
      (2, 102, '2024-09-02', '2024-09-05'),
      (3, 103, '2024-09-03', '2024-09-03'),
      (4, 104, '2024-09-04', '2024-09-07'),
      (5, 105, '2024-09-05', '2024-09-05'),
      (6, 106, '2024-09-06', '2024-09-09'),
      (7, 107, '2024-09-07', '2024-09-10');
    `,
    solution: {
      rootCause: 'Shipments 2, 4, 6, and 7 arrived after their due dates.',
      expectedDiscrepancyText: '4 late parcels',
      keyFindings: [
        'WHERE ship_date > due_date returns 4 rows.',
        'Latest delay was shipment 7 (3 days late).',
      ],
      validationCheck: keywordCheck(['late', 'delay', 'due', 'ship_date', 'after'], 'Mention late, delay, or due date.'),
    },
  },
  {
    id: 'case-08',
    code: 'Case #08',
    title: 'The Top Spender',
    difficulty: 'Beginner',
    category: 'Aggregates',
    summary: 'One customer spent far more than anyone else. Use SUM + GROUP BY + ORDER BY.',
    problem: `Marketing wants to reward the single biggest spender. The orders table lists every purchase per customer. Add up totals per customer, sort biggest first, and name the winner with LIMIT 1.`,
    objective: 'Aggregate with SUM(customer) GROUP BY customer_id ORDER BY total DESC LIMIT 1.',
    initialSql: `-- Step 1: total spent per customer, biggest first:
SELECT customer_id, SUM(amount) AS total_spent
FROM orders
GROUP BY customer_id
ORDER BY total_spent DESC
LIMIT 3;`,
    hints: [
      'SUM(amount) adds up each customer total.',
      'GROUP BY customer_id makes one row per customer.',
      'ORDER BY total_spent DESC + LIMIT 1 gives the winner.',
    ],
    expectedDiscrepancy: 1,
    tables: [
      {
        name: 'orders',
        rowCount: 8,
        description: 'One row per purchase.',
        columns: [
          { name: 'order_id', type: 'INTEGER', isPrimary: true, description: 'Order ID' },
          { name: 'customer_id', type: 'INTEGER', description: 'Customer ID' },
          { name: 'amount', type: 'NUMERIC', description: 'Order amount in PHP' },
        ],
      },
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS orders;
      CREATE TABLE orders (
        order_id SERIAL PRIMARY KEY,
        customer_id INT NOT NULL,
        amount NUMERIC(10, 2) NOT NULL
      );
      INSERT INTO orders (order_id, customer_id, amount) VALUES
      (1, 11, 500.00),
      (2, 12, 1200.00),
      (3, 11, 700.00),
      (4, 13, 2500.00),
      (5, 12, 800.00),
      (6, 14, 300.00),
      (7, 13, 900.00),
      (8, 14, 400.00);
    `,
    solution: {
      rootCause: 'Customer 13 spent 3,400 total, the highest of all customers.',
      expectedDiscrepancyText: 'Customer 13 is the top spender (3,400)',
      keyFindings: [
        'Customer 11 total = 1,200; customer 12 total = 2,000.',
        'Customer 13 total = 3,400 with SUM + GROUP BY.',
      ],
      validationCheck: keywordCheck(['13', '3400', '3,400', 'top spender', 'sum', 'group by'], 'Name customer 13 and the 3,400 total.'),
    },
  },
  {
    id: 'case-09',
    code: 'Case #09',
    title: 'The Missing Email',
    difficulty: 'Beginner',
    category: 'Foundations',
    summary: 'Two users signed up without an email. Find NULL values with IS NULL.',
    problem: `The newsletter bounced for some users. The users table allows empty emails. Find every account where email IS NULL so support can ask them to update their profile.`,
    objective: 'Filter NULLs with WHERE email IS NULL.',
    initialSql: `-- Step 1: find accounts missing an email:
SELECT user_id, name, email
FROM users
WHERE email IS NULL;`,
    hints: [
      'NULL means unknown, so use IS NULL (not = NULL).',
      'There are exactly 2 users without email.',
      'Try WHERE email IS NOT NULL to see everyone else.',
    ],
    expectedDiscrepancy: 2,
    tables: [
      {
        name: 'users',
        rowCount: 6,
        description: 'App accounts, some missing email.',
        columns: [
          { name: 'user_id', type: 'INTEGER', isPrimary: true, description: 'User ID' },
          { name: 'name', type: 'VARCHAR', description: 'Full name' },
          { name: 'email', type: 'VARCHAR', description: 'Email, may be NULL' },
        ],
      },
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS users;
      CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100)
      );
      INSERT INTO users (user_id, name, email) VALUES
      (1, 'Ana', 'ana@example.com'),
      (2, 'Ben', NULL),
      (3, 'Cora', 'cora@example.com'),
      (4, 'Dan', NULL),
      (5, 'Eli', 'eli@example.com'),
      (6, 'Fay', 'fay@example.com');
    `,
    solution: {
      rootCause: 'Users Ben (2) and Dan (4) have NULL emails.',
      expectedDiscrepancyText: '2 users missing email',
      keyFindings: [
        'WHERE email IS NULL returns Ben and Dan.',
        'IS NULL is the only correct NULL test.',
      ],
      validationCheck: keywordCheck(['null', 'missing', 'ben', 'dan', 'is null', 'email'], 'Mention NULL, missing email, Ben or Dan.'),
    },
  },
  {
    id: 'case-10',
    code: 'Case #10',
    title: 'The Overpriced Coffee',
    difficulty: 'Beginner',
    category: 'Aggregates',
    summary: 'One menu item costs far more than the rest. Use MAX(price).',
    problem: `A cafe suspects a typo made one drink absurdly expensive. Look at the menu table, find the MAX(price), and name the overpriced item.`,
    objective: 'Use MAX() and ORDER BY price DESC to spot the outlier.',
    initialSql: `-- Step 1: most expensive item first:
SELECT item_id, name, price
FROM menu
ORDER BY price DESC
LIMIT 3;`,
    hints: [
      'ORDER BY price DESC puts the biggest price on top.',
      'SELECT MAX(price) FROM menu gives the number alone.',
      'The answer costs 9,500 while the rest are under 300.',
    ],
    expectedDiscrepancy: 9500,
    tables: [
      {
        name: 'menu',
        rowCount: 6,
        description: 'Cafe menu with prices.',
        columns: [
          { name: 'item_id', type: 'INTEGER', isPrimary: true, description: 'Item ID' },
          { name: 'name', type: 'VARCHAR', description: 'Drink or snack' },
          { name: 'price', type: 'NUMERIC', description: 'Price in PHP' },
        ],
      },
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS menu;
      CREATE TABLE menu (
        item_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price NUMERIC(10, 2) NOT NULL
      );
      INSERT INTO menu (item_id, name, price) VALUES
      (1, 'Espresso', 140.00),
      (2, 'Latte', 180.00),
      (3, 'Cappuccino', 170.00),
      (4, 'Mocha', 195.00),
      (5, 'Truffle Latte', 9500.00),
      (6, 'Americano', 150.00);
    `,
    solution: {
      rootCause: 'Truffle Latte at 9,500 is a price typo, 50x the normal range.',
      expectedDiscrepancyText: 'Truffle Latte overpriced at 9,500',
      keyFindings: [
        'MAX(price) = 9,500 on Truffle Latte.',
        'All other drinks are 140 to 195.',
      ],
      validationCheck: keywordCheck(['truffle', '9500', '9,500', 'max', 'overpriced', 'typo'], 'Name Truffle Latte and 9,500.'),
    },
  },
  {
    id: 'case-11',
    code: 'Case #11',
    title: 'The Double Email',
    difficulty: 'Beginner',
    category: 'Duplicates',
    summary: 'One email registered twice. Use GROUP BY + HAVING COUNT(*) > 1.',
    problem: `Signups should be unique per email, but one address appears twice and gets double promos. Group signups by email and keep only groups with more than one row.`,
    objective: 'Find duplicates with GROUP BY email HAVING COUNT(*) > 1.',
    initialSql: `-- Step 1: emails used more than once:
SELECT email, COUNT(*) AS times
FROM signups
GROUP BY email
HAVING COUNT(*) > 1;`,
    hints: [
      'GROUP BY email makes one row per address.',
      'HAVING COUNT(*) > 1 keeps only duplicates.',
      'The duplicate is june@example.com (2 times).',
    ],
    expectedDiscrepancy: 2,
    tables: [
      {
        name: 'signups',
        rowCount: 6,
        description: 'Newsletter signups, one duplicate.',
        columns: [
          { name: 'signup_id', type: 'INTEGER', isPrimary: true, description: 'Signup ID' },
          { name: 'email', type: 'VARCHAR', description: 'Email used' },
          { name: 'signup_date', type: 'DATE', description: 'Date joined' },
        ],
      },
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS signups;
      CREATE TABLE signups (
        signup_id SERIAL PRIMARY KEY,
        email VARCHAR(100) NOT NULL,
        signup_date DATE NOT NULL
      );
      INSERT INTO signups (signup_id, email, signup_date) VALUES
      (1, 'ana@example.com', '2024-09-01'),
      (2, 'june@example.com', '2024-09-02'),
      (3, 'leo@example.com', '2024-09-03'),
      (4, 'june@example.com', '2024-09-04'),
      (5, 'mia@example.com', '2024-09-05'),
      (6, 'noa@example.com', '2024-09-06');
    `,
    solution: {
      rootCause: 'june@example.com signed up twice and receives double promos.',
      expectedDiscrepancyText: 'june@example.com appears 2 times',
      keyFindings: [
        'GROUP BY email HAVING COUNT(*) > 1 returns one row.',
        'june@example.com has count = 2.',
      ],
      validationCheck: keywordCheck(['june', 'duplicate', 'having', 'count', 'group by', 'twice'], 'Name june@example.com or duplicate + HAVING.'),
    },
  },
  {
    id: 'case-12',
    code: 'Case #12',
    title: 'The Quiet Member',
    difficulty: 'Beginner',
    category: 'Joins',
    summary: 'Two members never placed an order. Use LEFT JOIN + IS NULL.',
    problem: `The gym has 5 members but only 3 ever booked a class in orders. Join members to orders, keep members with no match, and list the quiet members.`,
    objective: 'LEFT JOIN members to orders and filter WHERE orders.order_id IS NULL.',
    initialSql: `-- Step 1: members with no orders:
SELECT m.member_id, m.name
FROM members m
LEFT JOIN orders o ON o.member_id = m.member_id
WHERE o.order_id IS NULL;`,
    hints: [
      'LEFT JOIN keeps every member even without orders.',
      'WHERE o.order_id IS NULL keeps only the non-matches.',
      'There are exactly 2 quiet members.',
    ],
    expectedDiscrepancy: 2,
    tables: [
      {
        name: 'members',
        rowCount: 5,
        description: 'Gym members.',
        columns: [
          { name: 'member_id', type: 'INTEGER', isPrimary: true, description: 'Member ID' },
          { name: 'name', type: 'VARCHAR', description: 'Member name' },
        ],
      },
      {
        name: 'orders',
        rowCount: 3,
        description: 'Class bookings.',
        columns: [
          { name: 'order_id', type: 'INTEGER', isPrimary: true, description: 'Order ID' },
          { name: 'member_id', type: 'INTEGER', isForeign: true, foreignTable: 'members', description: 'Member who booked' },
        ],
      },
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS members;
      CREATE TABLE members (
        member_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      );
      CREATE TABLE orders (
        order_id SERIAL PRIMARY KEY,
        member_id INT REFERENCES members(member_id)
      );
      INSERT INTO members (member_id, name) VALUES
      (1, 'Ava'), (2, 'Ben'), (3, 'Cid'), (4, 'Dee'), (5, 'Eli');
      INSERT INTO orders (order_id, member_id) VALUES
      (101, 1), (102, 3), (103, 5);
    `,
    solution: {
      rootCause: 'Members Ben (2) and Dee (4) never booked; LEFT JOIN shows NULL orders.',
      expectedDiscrepancyText: '2 members with zero orders',
      keyFindings: [
        'LEFT JOIN + IS NULL returns Ben and Dee.',
        'INNER JOIN would wrongly hide them.',
      ],
      validationCheck: keywordCheck(['left join', 'is null', 'quiet', 'ben', 'dee', 'inactive', 'never'], 'Mention LEFT JOIN + IS NULL, or Ben and Dee.'),
    },
  },
  {
    id: 'case-13',
    code: 'Case #13',
    title: 'The Daily Total',
    difficulty: 'Beginner',
    category: 'Aggregates',
    summary: 'Add up sales per day. The best day made 3,300. Use SUM + GROUP BY.',
    problem: `The owner asks: which single day earned the most? The sales table has one row per receipt with sale_date and amount. Group by date, sum each day, and sort to find the winner.`,
    objective: 'GROUP BY sale_date, SUM(amount), ORDER BY total DESC.',
    initialSql: `-- Step 1: revenue per day, best day first:
SELECT sale_date, SUM(amount) AS day_total
FROM sales
GROUP BY sale_date
ORDER BY day_total DESC;`,
    hints: [
      'SUM(amount) is the day total.',
      'GROUP BY sale_date makes one row per day.',
      'The best day is 2024-09-03 with 3,300.',
    ],
    expectedDiscrepancy: 3300,
    tables: [
      {
        name: 'sales',
        rowCount: 7,
        description: 'One row per receipt.',
        columns: [
          { name: 'sale_id', type: 'INTEGER', isPrimary: true, description: 'Receipt ID' },
          { name: 'sale_date', type: 'DATE', description: 'Sale day' },
          { name: 'amount', type: 'NUMERIC', description: 'Receipt total' },
        ],
      },
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS sales;
      CREATE TABLE sales (
        sale_id SERIAL PRIMARY KEY,
        sale_date DATE NOT NULL,
        amount NUMERIC(10, 2) NOT NULL
      );
      INSERT INTO sales (sale_id, sale_date, amount) VALUES
      (1, '2024-09-01', 800.00),
      (2, '2024-09-01', 1200.00),
      (3, '2024-09-02', 500.00),
      (4, '2024-09-03', 1500.00),
      (5, '2024-09-03', 1800.00),
      (6, '2024-09-04', 700.00),
      (7, '2024-09-04', 900.00);
    `,
    solution: {
      rootCause: '2024-09-03 earned 3,300, the highest daily total.',
      expectedDiscrepancyText: 'Best day 2024-09-03 with 3,300',
      keyFindings: [
        '2024-09-01 total = 2,000; 2024-09-03 total = 3,300.',
        'SUM + GROUP BY + ORDER BY finds the winner.',
      ],
      validationCheck: keywordCheck(['2024-09-03', '3300', '3,300', 'sum', 'group by', 'daily', 'best day'], 'Name 2024-09-03 and 3,300.'),
    },
  },
  {
    id: 'case-14',
    code: 'Case #14',
    title: 'The Cheap Ticket',
    difficulty: 'Beginner',
    category: 'Aggregates',
    summary: 'Find the cheapest flight with MIN(price). One route costs only 1,200.',
    problem: `A travel desk must book the cheapest flight on record. The flights table lists 6 routes with prices. Use MIN(price) or ORDER BY price ASC LIMIT 1 to find the bargain.`,
    objective: 'Use MIN() or ORDER BY ASC LIMIT 1 to find the lowest price.',
    initialSql: `-- Step 1: cheapest flight first:
SELECT flight_id, route, price
FROM flights
ORDER BY price ASC
LIMIT 3;`,
    hints: [
      'ORDER BY price ASC puts the cheapest on top.',
      'SELECT MIN(price) FROM flights gives the number.',
      'The cheapest route costs 1,200.',
    ],
    expectedDiscrepancy: 1200,
    tables: [
      {
        name: 'flights',
        rowCount: 6,
        description: 'Flight routes with prices.',
        columns: [
          { name: 'flight_id', type: 'INTEGER', isPrimary: true, description: 'Flight ID' },
          { name: 'route', type: 'VARCHAR', description: 'Route name' },
          { name: 'price', type: 'NUMERIC', description: 'Ticket price' },
        ],
      },
    ],
    dbSchemaSql: `
      DROP TABLE IF EXISTS flights;
      CREATE TABLE flights (
        flight_id SERIAL PRIMARY KEY,
        route VARCHAR(100) NOT NULL,
        price NUMERIC(10, 2) NOT NULL
      );
      INSERT INTO flights (flight_id, route, price) VALUES
      (1, 'Manila-Cebu', 2800.00),
      (2, 'Manila-Davao', 3500.00),
      (3, 'Manila-Iloilo', 1200.00),
      (4, 'Cebu-Bohol', 1900.00),
      (5, 'Manila-Bacolod', 2400.00),
      (6, 'Davao-Siargao', 4100.00);
    `,
    solution: {
      rootCause: 'Manila-Iloilo at 1,200 is the cheapest route on record.',
      expectedDiscrepancyText: 'Cheapest flight 1,200 (Manila-Iloilo)',
      keyFindings: [
        'MIN(price) = 1,200.',
        'ORDER BY price ASC LIMIT 1 returns flight 3.',
      ],
      validationCheck: keywordCheck(['iloilo', '1200', '1,200', 'min', 'cheapest', 'lowest'], 'Name Manila-Iloilo and 1,200.'),
    },
  },
];
