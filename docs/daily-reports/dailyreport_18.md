# 📊 Day 18 — Daily Returns Analytics (Data Transformation Layer)

## 🎯 Objective

The goal of Day 18 was to transform raw market data into an **analytics-ready dataset** by calculating daily returns.

This introduces a structured data modeling layer similar to **dbt transformations** used in modern data engineering workflows.

---

## 🏗️ Features Implemented

### 1. Daily Returns Table

Created:

```sql
daily_returns
```

#### Columns:

* symbol → stock ticker
* price_date → date of aggregation
* open_price → first captured price of the day
* close_price → last captured price of the day
* daily_return → percentage change
* created_at → timestamp

#### Constraints:

* Unique key on `(symbol, price_date)`
* Indexed for efficient querying

---

### 2. Transformation API

Created:

```bash
src/app/api/analytics/daily-returns/route.ts
```

#### Responsibilities:

* Read raw data from `market_prices`
* Group by:

  * symbol
  * date
* Compute:

  * open price (first)
  * close price (last)
  * daily return %

---

### 3. Transformation Logic

```text
Group prices by symbol + date
      ↓
Extract first price → open
Extract last price → close
      ↓
Compute:
daily_return = (close - open) / open × 100
```

---

### 4. Upsert Strategy

Used:

```ts
.upsert(dailyRows, { onConflict: "symbol,price_date" })
```

#### Benefits:

* Prevents duplicate records
* Allows re-running transformations safely
* Mimics idempotent data pipelines

---

### 5. Analytics Page

Created:

```bash
src/app/analytics/page.tsx
```

Displays:

* Symbol
* Date
* Open price
* Close price
* Daily return %

With visual indicators:

* 🟢 Positive returns
* 🔴 Negative returns

---

## 🧠 Key Concepts Learned

* Data transformation pipelines
* Time-series aggregation
* Grouping and window logic
* Idempotent writes (upsert)
* Raw vs transformed data layers
* Analytics table design

---

## 🧱 Data Architecture Evolution

```text
Finnhub API
    ↓
market_prices (raw layer)
    ↓
daily_returns (transformed layer)
    ↓
Analytics page (consumption layer)
```

---

## 🚀 Outcome

By the end of Day 18, the system supports:

* 📊 Aggregated daily metrics
* 📈 Price change analysis
* 🔄 Repeatable transformations
* 🧠 Analytics-ready datasets

---

## 💡 Why This Matters (Resume Impact)

This feature demonstrates:

* Data modeling and transformation
* Time-series analytics
* Pipeline design patterns (raw → curated)
* Idempotent ETL/ELT processes

Comparable to:

* dbt transformations
* Databricks pipelines
* Snowflake analytics layers

---

## 🔜 Next Steps

* Portfolio-level daily returns
* Rolling averages (moving average)
* Backtesting engine (strategy simulation)
* Risk metrics (Sharpe ratio, drawdown)

---

## ✅ Status

✔ Completed
✔ Fully functional
✔ Analytics layer established
