# 📊 Day 09 — Portfolio Value Chart (Analytics Feature)

## 🎯 Objective

The goal of Day 9 was to introduce **portfolio performance tracking over time** by building a **time-series visualization of account value**.

This enhances the platform by adding:

* Historical analytics
* Visual insights into performance
* A strong, resume-level feature similar to real trading platforms

---

## 🏗️ Features Implemented

### 1. Portfolio Value Chart UI

* Built a responsive **line chart** using Recharts
* Displayed account value trend over time
* Integrated into the portfolio dashboard

#### Key Capabilities:

* Time-series visualization
* Dynamic tooltip formatting
* Responsive layout for different screen sizes
* Handles empty state (no data scenario)

---

### 2. Portfolio Snapshots Table (Database Layer)

Created a new table:

```sql
portfolio_snapshots
```

#### Structure:

| Column         | Description                  |
| -------------- | ---------------------------- |
| id             | Unique snapshot ID           |
| user_id        | Linked to authenticated user |
| account_value  | Total portfolio value        |
| cash_balance   | Available cash               |
| holdings_value | Value of positions           |
| created_at     | Timestamp                    |

#### Security:

* Enabled **Row-Level Security (RLS)**
* Users can only:

  * View their own snapshots
  * Insert their own snapshots

---

### 3. Server Action for Snapshot Creation

Created:

```bash
src/features/portfolio/actions.ts
```

#### Function:

```ts
createPortfolioSnapshot()
```

#### Responsibilities:

* Fetch authenticated user
* Insert snapshot into database
* Store:

  * Account value
  * Cash balance
  * Holdings value
  * Timestamp

---

### 4. Event-Driven Snapshot System (Key Feature 🚀)

Instead of manual tracking, implemented **automatic snapshot creation**:

📍 Trigger Points:

* After BUY order execution
* After SELL order execution

#### Flow:

```text
User Trade → Update Portfolio → Calculate Values → Save Snapshot
```

#### Calculations:

```text
account_value = cash_balance + holdings_value
holdings_value = Σ (quantity × average_cost)
```

> Note: Currently cost-based valuation. Future upgrade will use live prices.

---

### 5. Real Data Integration into Chart

Replaced static chart data with live database data:

#### Data Fetch:

```ts
portfolio_snapshots → ordered by created_at
```

#### Transformation:

```ts
{
  date: formatted_date,
  value: account_value
}
```

#### Result:

* Chart now reflects **real user trading activity**
* Updates dynamically as trades occur

---

## 🧠 Key Concepts Learned

* Time-series data modeling
* Event-driven architecture
* Backend → frontend data flow
* Financial metric calculations
* React client vs server component separation
* Data visualization using Recharts
* Secure multi-tenant data access using RLS

---

## 🚀 Outcome

By the end of Day 9, the application now supports:

* 📈 Portfolio performance tracking
* 🕒 Historical account value storage
* 🔄 Automatic snapshot generation
* 📊 Real-time chart updates after trades

---

## 💡 Why This Matters (Resume Impact)

This feature demonstrates:

* Real-world product thinking
* Financial analytics implementation
* Full-stack integration (DB + API + UI)
* Time-series data handling

It significantly strengthens the project by making it comparable to platforms like:

* Robinhood
* Coinbase

---

## 🔜 Next Steps

* Replace cost-based valuation with **live market prices**
* Add:

  * Daily performance metrics
  * Percentage change indicators
  * P&L charts
* Introduce:

  * Real-time updates (polling or WebSockets)
  * Advanced analytics dashboard

---

## ✅ Status

✔ Completed
✔ Fully functional
✔ Resume-ready feature implemented
