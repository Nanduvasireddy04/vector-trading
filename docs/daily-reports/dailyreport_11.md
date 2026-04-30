# ⚡ Day 11 — Real-Time Portfolio Updates (Live Polling System)

## 🎯 Objective

The goal of Day 11 was to enhance the portfolio experience by enabling **real-time updates without manual page refresh**.

Previously, users had to refresh the page to see updated prices and portfolio values.
Now, the system automatically updates every few seconds, mimicking real trading platforms.

---

## 🏗️ Features Implemented

### 1. Real-Time Portfolio API

Created a backend API route:

```bash
src/app/api/portfolio/route.ts
```

#### Responsibilities:

* Fetch user portfolio data from Supabase
* Retrieve live prices from Finnhub
* Compute:

  * Account value
  * Holdings value
  * Cost basis
  * Unrealized P&L
* Return structured JSON data

#### Data Flow:

```text
Supabase (positions + profile)
        ↓
Fetch symbols
        ↓
Finnhub API (live prices)
        ↓
Compute metrics
        ↓
Return JSON response
```

---

### 2. Client-Side Live Component

Created:

```bash
src/features/portfolio/PortfolioLiveView.tsx
```

#### Key Features:

* Uses `useEffect` + `setInterval`
* Fetches `/api/portfolio` every **5 seconds**
* Updates UI dynamically
* Displays last updated timestamp

#### Polling Logic:

```text
Component mounts → Fetch data → Update state → Repeat every 5 seconds
```

---

### 3. Separation of Concerns (Important Architecture)

Refactored portfolio into:

#### Server Component:

```bash
src/app/portfolio/page.tsx
```

* Handles authentication
* Provides layout (DashboardShell)

#### Client Component:

```bash
PortfolioLiveView.tsx
```

* Handles real-time updates
* Renders dynamic data

---

### 4. Live Updating UI

The following now update automatically:

* 📈 Account Value
* 💰 Cash Balance
* 📊 Holdings Value
* 📉 Unrealized P&L
* 📊 Portfolio chart (via snapshots)
* 📋 Holdings table

---

### 5. Improved User Experience

Added:

* ⏱️ “Last updated” timestamp
* Smooth auto-refresh behavior
* No manual reload required

---

## 🧠 Key Concepts Learned

* Client vs Server Components in Next.js
* Polling vs real-time streaming
* API route design
* State management with `useState`
* Periodic data fetching with `setInterval`
* Full-stack data flow (DB → API → UI)

---

## 🚀 Outcome

By the end of Day 11, the platform now supports:

* ⚡ Live portfolio updates
* 🔄 Automatic data refresh
* 📊 Real-time financial metrics
* 🎯 Production-like user experience

---

## 💡 Why This Matters (Resume Impact)

This feature demonstrates:

* Real-time system design
* API-driven architecture
* Full-stack integration (DB + API + frontend)
* Performance-conscious UI updates

Comparable to behavior in:

* Robinhood
* Coinbase

---

## 🔜 Next Steps (Day 12)

* Implement order history filters
* Add pagination
* Improve query efficiency
* Enhance UX for large datasets

---

## ✅ Status

✔ Completed
✔ Fully functional
✔ Real-time system implemented
