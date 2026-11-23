# Understory Shop

## Run locally

Requires Node.js 20 or newer.

```powershell
npm install
Copy-Item .env.example .env
```

Set `SESSION_SECRET` in `.env` to a random value of at least 32 bytes. You can generate one with:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Then start the app:

```powershell
npm run dev
```

Open `http://127.0.0.1:3000`. Use the HTTP address rather than opening `index.html` directly; the account API and session cookie require the server.

## Account and order behavior

Accounts use bcrypt password hashes in a local SQLite database under `data/`. Signed, HttpOnly, SameSite cookies hold only the account ID. Authentication endpoints are rate-limited, and order endpoints require a signed-in account. The server calculates order prices from `products.js`; browser-submitted totals are ignored.

Checkout uses Razorpay Checkout. The server creates each gateway order from catalog prices, verifies the payment signature, checks the payment amount and captured status, and only then saves the order. Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to `.env`; use Razorpay test-mode keys while developing. Without both keys, checkout is disabled with a clear configuration error. Never expose the key secret in browser code or commit it. Before public deployment, configure HTTPS, a persistent database backup, a stable session secret, and production hosting appropriate for SQLite.
