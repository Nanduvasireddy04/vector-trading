# 📊 Day 16 — Market Data Viewer (Data Pipeline Visibility)

## Objective

The goal of Day 16 was to build a **visual interface** for the market data ingestion pipeline by displaying stored price data.

This allows validation and monitoring of the data pipeline.

---

## Features Implemented

### 1. Market Data Page

Created:

```bash
src/app/market-data/page.tsx
```

Displays the most recent market prices stored in the system.

---

### 2. Time-Series Data Visualization (Table)

The page shows:

* Symbol
* Price
* Data source
* Captured timestamp

Each row represents a **snapshot in time**.

---

### 3. Integration with Market Data Pipeline

Connected UI to:

```text
market_prices table
```

Which is populated via:

```text
Finnhub → API route → Supabase
```

---

### 4. Ordered Data Retrieval

Implemented:

```ts
.order("captured_at", { ascending: false })
.limit(50)
```

This ensures:

* Latest data appears first
* Query remains efficient

---

### 5. Pipeline Observability

The page acts as a monitoring tool:

* Confirms ingestion is working
* Shows frequency of captures
* Displays historical price changes

---

## Data Engineering Importance

This feature provides visibility into a **time-series ingestion pipeline**, which is critical for:

* Data validation
* Debugging pipelines
* Monitoring ingestion frequency
* Building analytics on top of raw data

---

## Architecture Flow

```text
Assets table
    ↓
Capture API
    ↓
market_prices table
    ↓
Market Data page
```

---

## Outcome

By the end of Day 16, the system supports:

* Viewing stored market data
* Validating ingestion pipeline
* Tracking historical price changes
* Observing time-series growth

---

## Resume Impact

This feature demonstrates:

* Time-series data handling
* Data pipeline monitoring
* Backend → UI data flow
* Efficient querying and ordering

---

## Status

Completed and verified.
