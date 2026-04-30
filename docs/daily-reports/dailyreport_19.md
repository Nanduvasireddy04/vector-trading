# Day 19 — Portfolio-Level Analytics & Equity Curve

## Objective

The goal of Day 19 was to move from asset-level analytics to portfolio-level performance analytics.

The main outcome was building an **equity curve**, which tracks total portfolio value over time.

---

## Features Implemented

### 1. Portfolio Daily Values Table

Created:

```sql
portfolio_daily_values
```

This table stores one portfolio value per user per day.

---

### 2. Portfolio Analytics Transformation API

Created:

```bash
src/app/api/analytics/portfolio-values/route.ts
```

This API transforms raw portfolio snapshot data into daily portfolio values.

---

### 3. Snapshot-to-Daily Aggregation

Implemented this flow:

```text
portfolio_snapshots
      ↓
group by user + date
      ↓
take latest value of day
      ↓
upsert into portfolio_daily_values
```

---

### 4. Idempotent Upsert Logic

Used `upsert` with:

```text
user_id,value_date
```

This allows the transformation to be safely re-run without creating duplicate rows.

---

### 5. Equity Curve Chart

Created:

```bash
src/features/portfolio/EquityCurveChart.tsx
```

This chart visualizes portfolio account value over time.

---

### 6. Analytics Page Upgrade

Updated:

```bash
src/app/analytics/page.tsx
```

The analytics page now includes:

* Equity curve chart
* Daily returns table

---

## Architecture Flow

```text
Portfolio trades
      ↓
portfolio_snapshots
      ↓
portfolio_daily_values
      ↓
equity curve chart
```

---

## Quant / Data Science Importance

The equity curve is a foundational metric for:

* Backtesting
* Strategy comparison
* Risk analysis
* Portfolio performance tracking

Later, this can be compared against:

* Strategy equity curves
* Buy-and-hold benchmarks
* Market index benchmarks

---

## Resume Impact

This feature demonstrates:

* Portfolio analytics
* Time-series aggregation
* Idempotent transformations
* Financial performance modeling
* Data pipeline design
* Quant analytics foundations

---

## Status

Completed and tested successfully.
