# 📊 Day 15 — Market Data Storage & Ingestion

## 🎯 Objective

The goal of Day 15 was to introduce a **market data storage layer** by capturing live stock prices and storing them in the database for future analytics and backtesting.

This marks the transition from a pure application to a **data engineering system**.

---

## 🏗️ Features Implemented

### 1. Market Prices Table

Created a new table:

```sql
market_prices
```

#### Columns:

* symbol → stock ticker (AAPL, TSLA, etc.)
* price → latest market price
* source → data provider (Finnhub)
* captured_at → timestamp

#### Additional:

* Index on `(symbol, captured_at)` for efficient queries
* Row Level Security enabled

---

### 2. Market Data Capture API

Created API route:

```bash
src/app/api/market-prices/capture/route.ts
```

#### Responsibilities:

* Fetch all unique symbols from `assets` table
* Call Finnhub for live prices
* Store results in `market_prices`

---

### 3. Dual Route Support (GET + POST)

Enabled both:

```ts
GET  → browser testing
POST → programmatic usage
```

This allows:

* Easy manual testing via browser
* Future automation via cron jobs or pipelines

---

### 4. Data Ingestion Flow

```text
Assets table
    ↓
Extract symbols
    ↓
Finnhub API
    ↓
Transform (symbol, price)
    ↓
Insert into market_prices
```

---

### 5. Incremental Data Storage

Each API call inserts new rows:

```text
AAPL → 189.3 → 10:00 AM
AAPL → 190.1 → 10:05 AM
```

This creates a **time-series dataset**.

---

## 🧠 Key Concepts Learned

* Data ingestion patterns
* Time-series data modeling
* API → database pipelines
* Deduplicating symbols
* Indexing for performance
* Separation of raw vs computed data

---

## 🚀 Outcome

By the end of Day 15, the system supports:

* 📊 Historical price storage
* 🕒 Time-based price tracking
* 🔄 Repeatable ingestion process
* ⚙️ Foundation for analytics and backtesting

---

## 💡 Why This Matters (Resume Impact)

This feature demonstrates:

* Data pipeline design
* External API ingestion
* Time-series data handling
* Database indexing and optimization

Comparable to real systems like:

* Bloomberg
* Snowflake ingestion pipelines

---

## 🔜 Next Steps

* Build `/market-data` page to view captured data
* Add scheduled ingestion (cron)
* Create analytics tables (daily returns)
* Use data for backtesting strategies

---

## ✅ Status

✔ Completed
✔ Data ingestion working
✔ Market data stored successfully
