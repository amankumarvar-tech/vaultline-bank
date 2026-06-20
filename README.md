# Vaultline Bank — Full MERN Banking Platform

Ek complete digital banking website jo MongoDB + Express + React + Node.js (MERN)
stack par bana hai — SBI/PNB jaise multiple public pages, secure JWT authentication,
real banking operations (deposit/withdraw/transfer), aur admin analytics dashboard
ke saath.

## 📂 Project Structure

```
VaultlineMERN/
├── server/          → Node + Express + MongoDB backend (API)
└── client/          → React + Vite frontend
```

## ✨ Features

### Public Website (SBI/PNB style pages)
- Home, About Us, Personal Banking, Loans (with EMI calculator),
  Cards, Fixed Deposits (with maturity calculator), Investments,
  Locate Us (branch finder), Contact Us

### Customer Banking
- Signup / Login (JWT-secured)
- Deposit, Withdraw (with PIN verification + minimum balance rules)
- Transfer to any Vaultline account
- Digital Passbook (full transaction history)
- Change PIN, Close Account

### Admin Panel
- Total accounts, total bank balance, total transactions
- Charts: transaction activity trend, account type split, daily volume
- Account list with Freeze / Activate controls

### Security
- Passwords & PINs hashed with bcrypt
- JWT-based session authentication
- Rate limiting on sensitive routes (login, signup, withdraw, transfer)
- Helmet for HTTP security headers
- MongoDB transactions (sessions) for atomic transfers — no race conditions

---

## 🚀 Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org) v18+ installed
- A MongoDB database — either:
  - Install MongoDB locally ([download here](https://www.mongodb.com/try/download/community)), OR
  - Use a **free MongoDB Atlas** cluster (recommended, no install needed): https://www.mongodb.com/cloud/atlas/register

### 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Open `.env` and fill in:
- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` — credentials for the first admin account

Then create the first admin account and start the server:

```bash
npm run seed:admin
npm run dev
```

Server runs at `http://localhost:5000`.

### 2. Frontend Setup

Open a **new terminal**:

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Frontend runs at `http://localhost:5173`.

### 3. Open the App

Visit `http://localhost:5173` in your browser:
- Click **"Open Account"** to create a customer account
- Click **"Login"** and use the admin email (`<ADMIN_USERNAME>@vaultline.bank`)
  and the password you set in `.env` to access `/admin`

---

## 🛠 Tech Stack

| Layer      | Technology                                  |
|------------|----------------------------------------------|
| Frontend   | React 18, React Router 6, Vite, Recharts     |
| Backend    | Node.js, Express 4                           |
| Database   | MongoDB + Mongoose                           |
| Auth       | JWT, bcryptjs                                |
| Security   | Helmet, express-rate-limit                   |

---

## 📌 Notes

- This is a demo / learning project — **not connected to any real banking network**.
- Investment and loan figures shown on public pages are illustrative.
- For production deployment, you would additionally need: HTTPS, refresh tokens,
  email/OTP verification, audit logging, and a compliance review.

## 🌐 Deploying

- **Backend**: Render, Railway, or any Node hosting + MongoDB Atlas for the database.
- **Frontend**: Vercel, Netlify, or any static host (run `npm run build` in `client/`
  and deploy the `dist/` folder). Set `VITE_API_URL` to your deployed backend URL.
