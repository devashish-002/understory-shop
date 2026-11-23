'use strict';

require('dotenv').config();

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const Database = require('better-sqlite3');
const Razorpay = require('razorpay');
const PRODUCTS = require('./products.js');

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const dummyPasswordHash = bcrypt.hashSync(crypto.randomBytes(32).toString('hex'), 12);
const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || (isProduction ? '0.0.0.0' : '127.0.0.1');
const dataDirectory = path.join(__dirname, 'data');
const databasePath = path.resolve(process.env.DATABASE_PATH || path.join(dataDirectory, 'understory.sqlite'));

if (isProduction && (!process.env.SESSION_SECRET || Buffer.byteLength(process.env.SESSION_SECRET) < 32)) {
  throw new Error('SESSION_SECRET must contain at least 32 bytes in production.');
}

if (!process.env.SESSION_SECRET) {
  process.env.SESSION_SECRET = crypto.randomBytes(32).toString('hex');
  console.warn('Using an ephemeral development session secret. Set SESSION_SECRET to keep sessions across restarts.');
}

fs.mkdirSync(path.dirname(databasePath), { recursive: true });
fs.mkdirSync(dataDirectory, { recursive: true });

const database = new Database(databasePath);
database.pragma('journal_mode = WAL');
database.pragma('foreign_keys = ON');
const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })
  : null;
database.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL COLLATE NOCASE UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL,
    total INTEGER NOT NULL CHECK (total >= 0)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id TEXT REFERENCES orders(id) ON DELETE SET NULL,
    amount INTEGER NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('paid', 'failed')),
    provider TEXT NOT NULL,
    last4 TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS checkout_sessions (
    razorpay_order_id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    items_json TEXT NOT NULL,
    amount INTEGER NOT NULL CHECK (amount > 0),
    created_at TEXT NOT NULL
  );
`);

const findUserByEmail = database.prepare('SELECT id, email, password_hash FROM users WHERE email = ?');
const findUserById = database.prepare('SELECT id, email FROM users WHERE id = ?');
const createUser = database.prepare('INSERT INTO users (email, password_hash, created_at) VALUES (?, ?, ?)');
const findOrders = database.prepare('SELECT id, created_at AS createdAt, total FROM orders WHERE user_id = ? ORDER BY created_at DESC');
const findOrderItems = database.prepare('SELECT product_id AS productId, name, price, quantity FROM order_items WHERE order_id = ?');
const createOrder = database.prepare('INSERT INTO orders (id, user_id, created_at, total) VALUES (?, ?, ?, ?)');
const createOrderItem = database.prepare('INSERT INTO order_items (order_id, product_id, name, price, quantity) VALUES (?, ?, ?, ?, ?)');
const createPayment = database.prepare('INSERT INTO payments (id, user_id, order_id, amount, currency, status, provider, last4, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
const createCheckoutSession = database.prepare('INSERT INTO checkout_sessions (razorpay_order_id, user_id, items_json, amount, created_at) VALUES (?, ?, ?, ?, ?)');
const findCheckoutSession = database.prepare('SELECT razorpay_order_id AS razorpayOrderId, user_id AS userId, items_json AS itemsJson, amount, created_at AS createdAt FROM checkout_sessions WHERE razorpay_order_id = ? AND user_id = ?');
const deleteCheckoutSession = database.prepare('DELETE FROM checkout_sessions WHERE razorpay_order_id = ? AND user_id = ?');
const findOrderById = database.prepare('SELECT id, created_at AS createdAt, total FROM orders WHERE id = ? AND user_id = ?');
const updateUserPassword = database.prepare('UPDATE users SET password_hash = ? WHERE id = ?');
const deleteUser = database.prepare('DELETE FROM users WHERE id = ?');
const deleteExpiredCheckoutSessions = database.prepare(
  "DELETE FROM checkout_sessions WHERE created_at < ?"
);
const completeCheckout = database.transaction((userId, order, items, payment) => {
  const { id: orderId, createdAt, total } = order;
  createOrder.run(orderId, userId, createdAt, total);
  for (const item of items) {
    createOrderItem.run(orderId, item.id, item.name, item.price, item.quantity);
  }
  createPayment.run(payment.id, userId, orderId, total, 'INR', 'paid', 'razorpay', '', createdAt);
  deleteCheckoutSession.run(payment.orderId, userId);
});

app.disable('x-powered-by');
app.set('trust proxy', isProduction ? 1 : false);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      connectSrc: ["'self'", 'https://api.razorpay.com', 'https://*.razorpay.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      frameSrc: ["'self'", 'https://checkout.razorpay.com', 'https://api.razorpay.com', 'https://*.razorpay.com'],
      imgSrc: ["'self'", 'data:', 'https://images.unsplash.com', 'https://*.razorpay.com'],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'", 'https://checkout.razorpay.com', 'https://cdn.razorpay.com', 'https://*.razorpay.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://*.razorpay.com'],
      upgradeInsecureRequests: isProduction ? [] : null
    }
  }
}));
app.use(express.json({ limit: '20kb' }));
app.use(cookieSession({
  name: 'understory.sid',
  keys: [process.env.SESSION_SECRET],
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: 'lax',
  secure: isProduction
}));

app.use('/api', (request, response, next) => {
  const origin = request.get('origin');
  const expectedOrigin = `${request.protocol}://${request.get('host')}`;

  if (request.method !== 'GET' && request.method !== 'HEAD' && origin && origin !== expectedOrigin) {
    return response.status(403).json({ error: 'Cross-origin request rejected.' });
  }

  next();
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 12,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again later.' }
});
function requireUser(request, response, next) {
  const userId = Number(request.session?.userId);
  if (!Number.isSafeInteger(userId) || userId < 1) {
    return response.status(401).json({ error: 'Sign in to continue.' });
  }

  const user = findUserById.get(userId);
  if (!user) {
    request.session = null;
    return response.status(401).json({ error: 'Sign in to continue.' });
  }

  request.user = user;
  next();
}

function normalizeEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function validEmail(email) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateOrderItems(submittedItems) {
  if (!Array.isArray(submittedItems) || submittedItems.length < 1 || submittedItems.length > 30) {
    throw new Error('Your cart must contain between 1 and 30 products.');
  }

  const productById = new Map(PRODUCTS.map((product) => [product.id, product]));
  const seenIds = new Set();
  const items = [];

  for (const entry of submittedItems) {
    const productId = Number(entry?.productId);
    const quantity = Number(entry?.quantity);
    const product = productById.get(productId);

    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 20 || seenIds.has(productId)) {
      throw new Error('Your cart contains an invalid product or quantity.');
    }

    seenIds.add(productId);
    items.push({ id: product.id, name: product.name, price: product.price, quantity });
  }

  return items;
}

function isValidRazorpaySignature(orderId, paymentId, signature) {
  if (typeof signature !== 'string' || !/^[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest();
  const received = Buffer.from(signature, 'hex');
  return received.length === expected.length && crypto.timingSafeEqual(received, expected);
}

app.get('/api/health', (request, response) => {
  response.json({ status: 'ok', database: 'ok', payments: razorpay ? 'configured' : 'demo' });
});

app.get('/api/products', (request, response) => {
  response.json({ products: PRODUCTS });
});

app.get('/api/products/:id', (request, response) => {
  const productId = Number(request.params.id);
  const product = PRODUCTS.find((item) => item.id === productId);
  if (!product) {
    return response.status(404).json({ error: 'Product not found.' });
  }
  response.json({ product });
});

app.get('/api/auth/me', (request, response) => {
  const userId = Number(request.session?.userId);
  const user = Number.isSafeInteger(userId) && userId > 0 ? findUserById.get(userId) : null;
  response.json({ user: user || null });
});

app.post('/api/auth/register', authLimiter, async (request, response, next) => {
  const email = normalizeEmail(request.body?.email);
  const password = request.body?.password;
  const passwordBytes = typeof password === 'string' ? Buffer.byteLength(password, 'utf8') : 0;

  if (!validEmail(email)) {
    return response.status(400).json({ error: 'Enter a valid email address.' });
  }
  if (typeof password !== 'string' || passwordBytes < 10 || passwordBytes > 72) {
    return response.status(400).json({ error: 'Use a password between 10 and 72 bytes.' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const result = createUser.run(email, passwordHash, new Date().toISOString());
    request.session = { userId: Number(result.lastInsertRowid) };
    response.status(201).json({ user: { id: Number(result.lastInsertRowid), email } });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return response.status(409).json({ error: 'An account with that email already exists.' });
    }
    next(error);
  }
});

app.post('/api/auth/login', authLimiter, async (request, response, next) => {
  const email = normalizeEmail(request.body?.email);
  const password = request.body?.password;

  if (!validEmail(email) || typeof password !== 'string' || Buffer.byteLength(password, 'utf8') > 72) {
    return response.status(401).json({ error: 'Email or password is incorrect.' });
  }

  try {
    const user = findUserByEmail.get(email);
    const passwordMatches = await bcrypt.compare(password, user?.password_hash || dummyPasswordHash);
    if (!user || !passwordMatches) {
      return response.status(401).json({ error: 'Email or password is incorrect.' });
    }

    request.session = { userId: user.id };
    response.json({ user: { id: user.id, email: user.email } });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/logout', (request, response) => {
  request.session = null;
  response.status(204).end();
});

app.patch('/api/auth/password', authLimiter, requireUser, async (request, response, next) => {
  const currentPassword = request.body?.currentPassword;
  const newPassword = request.body?.newPassword;

  if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
    return response.status(400).json({ error: 'Enter both your current and new passwords.' });
  }

  const passwordBytes = Buffer.byteLength(newPassword, 'utf8');
  if (passwordBytes < 10 || passwordBytes > 72) {
    return response.status(400).json({ error: 'Use a password between 10 and 72 bytes.' });
  }

  try {
    const user = findUserByEmail.get(request.user.email);
    const passwordMatches = await bcrypt.compare(currentPassword, user.password_hash);
    if (!passwordMatches) {
      return response.status(401).json({ error: 'The current password is incorrect.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    updateUserPassword.run(passwordHash, request.user.id);
    response.json({ message: 'Password updated.' });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/auth/account', requireUser, (request, response) => {
  deleteUser.run(request.user.id);
  request.session = null;
  response.status(204).end();
});

app.post('/api/checkout/create-order', requireUser, async (request, response, next) => {
  let items;
  try {
    items = validateOrderItems(request.body?.items);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!razorpay) {
    const demoOrderId = `demo_${crypto.randomUUID().replaceAll('-', '').slice(0, 24)}`;
    createCheckoutSession.run(
      demoOrderId,
      request.user.id,
      JSON.stringify(items),
      total,
      new Date().toISOString()
    );

    return response.status(201).json({
      demo: true,
      keyId: null,
      orderId: demoOrderId,
      amount: total * 100,
      currency: 'INR',
      message: 'Demo checkout enabled. Payment is simulated for local development.'
    });
  }

  try {
    const checkoutOrder = await razorpay.orders.create({
      amount: total * 100,
      currency: 'INR',
      receipt: crypto.randomUUID().replaceAll('-', '').slice(0, 24),
      notes: { user_id: String(request.user.id) }
    });

    createCheckoutSession.run(
      checkoutOrder.id,
      request.user.id,
      JSON.stringify(items),
      total,
      new Date().toISOString()
    );

    response.status(201).json({
      demo: false,
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: checkoutOrder.id,
      amount: checkoutOrder.amount,
      currency: checkoutOrder.currency
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/orders', requireUser, (request, response) => {
  const orders = findOrders.all(request.user.id).map((order) => ({
    ...order,
    items: findOrderItems.all(order.id)
  }));
  response.json({ orders });
});

app.get('/api/orders/:id', requireUser, (request, response) => {
  const order = findOrderById.get(request.params.id, request.user.id);
  if (!order) {
    return response.status(404).json({ error: 'Order not found.' });
  }
  response.json({ order: { ...order, items: findOrderItems.all(order.id) } });
});

app.post('/api/checkout/cancel', requireUser, (request, response) => {
  const orderId = request.body?.orderId;
  if (typeof orderId !== 'string') {
    return response.status(400).json({ error: 'Checkout order ID is required.' });
  }

  const result = deleteCheckoutSession.run(orderId, request.user.id);
  response.json({ cancelled: result.changes > 0 });
});

app.post('/api/checkout/verify', requireUser, async (request, response, next) => {
  const isDemoCheckout = !razorpay && request.body?.demo === true;

  if (isDemoCheckout) {
    const demoOrderId = request.body?.orderId;
    if (typeof demoOrderId !== 'string') {
      return response.status(400).json({ error: 'Checkout order ID is required.' });
    }

    const checkoutSession = findCheckoutSession.get(demoOrderId, request.user.id);
    if (!checkoutSession) {
      return response.status(404).json({ error: 'Demo checkout session not found or already completed.' });
    }

    let items;
    try {
      items = JSON.parse(checkoutSession.itemsJson);
    } catch (error) {
      return response.status(500).json({ error: 'Saved checkout data is invalid.' });
    }

    const total = checkoutSession.amount;
    const order = {
      id: demoOrderId,
      createdAt: new Date().toISOString(),
      total,
      items
    };

    completeCheckout(request.user.id, order, items, {
      id: `demo_payment_${crypto.randomUUID().replaceAll('-', '').slice(0, 20)}`,
      orderId: order.id
    });

    return response.status(201).json({
      order,
      payment: {
        id: `demo_payment_${order.id}`,
        amount: total,
        currency: 'INR',
        status: 'paid',
        provider: 'demo',
        createdAt: order.createdAt
      }
    });
  }

  if (!razorpay) {
    return response.status(503).json({ error: 'Razorpay is not configured.' });
  }

  const orderId = request.body?.razorpay_order_id;
  const paymentId = request.body?.razorpay_payment_id;
  const signature = request.body?.razorpay_signature;
  if (typeof orderId !== 'string' || typeof paymentId !== 'string' || !isValidRazorpaySignature(orderId, paymentId, signature)) {
    return response.status(400).json({ error: 'Payment verification failed.' });
  }

  const checkoutSession = findCheckoutSession.get(orderId, request.user.id);
  if (!checkoutSession) {
    return response.status(404).json({ error: 'Checkout session not found or already completed.' });
  }

  try {
    let gatewayPayment = await razorpay.payments.fetch(paymentId);
    if (gatewayPayment.order_id !== orderId || Number(gatewayPayment.amount) !== checkoutSession.amount * 100 || gatewayPayment.currency !== 'INR') {
      return response.status(400).json({ error: 'Payment does not match this checkout.' });
    }
    if (gatewayPayment.status === 'authorized') {
      await razorpay.payments.capture(paymentId, checkoutSession.amount * 100, 'INR');
      gatewayPayment = await razorpay.payments.fetch(paymentId);
    }
    if (gatewayPayment.status !== 'captured') {
      return response.status(402).json({ error: 'Payment has not been captured.' });
    }

    const items = JSON.parse(checkoutSession.itemsJson);
    const order = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      total: checkoutSession.amount,
      items
    };
    completeCheckout(request.user.id, order, items, { id: paymentId, orderId });

    response.status(201).json({
      order,
      payment: {
        id: paymentId,
        amount: checkoutSession.amount,
        currency: 'INR',
        status: 'paid',
        provider: 'razorpay',
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

const publicFiles = new Map([
  ['/', 'index.html'],
  ['/index.html', 'index.html'],
  ['/login.html', 'login.html'],
  ['/style.css', 'style.css'],
  ['/script.js', 'script.js'],
  ['/api.js', 'api.js'],
  ['/login.js', 'login.js'],
  ['/products.js', 'products.js']
]);

app.get([...publicFiles.keys()], (request, response) => {
  response.sendFile(path.join(__dirname, publicFiles.get(request.path)));
});

app.use((request, response) => {
  response.status(404).json({ error: 'Not found.' });
});

app.use((error, request, response, next) => {
  if (response.headersSent) return next(error);
  if (error.type === 'entity.parse.failed') {
    return response.status(400).json({ error: 'Request body must be valid JSON.' });
  }
  console.error(error);
  response.status(500).json({ error: 'Something went wrong.' });
});

deleteExpiredCheckoutSessions.run(new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
const checkoutCleanup = setInterval(() => {
  deleteExpiredCheckoutSessions.run(new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
}, 60 * 60 * 1000);
if (typeof checkoutCleanup.unref === 'function') {
  checkoutCleanup.unref();
}

let server;
if (require.main === module) {
  server = app.listen(port, host, () => {
    console.log(`Understory backend listening at http://${host}:${port}`);
  });

  function shutdown() {
    server.close(() => {
      clearInterval(checkoutCleanup);
      database.close();
      process.exit(0);
    });
  }

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

app.database = database;
module.exports = app;
