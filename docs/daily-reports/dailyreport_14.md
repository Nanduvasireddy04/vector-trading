# Day 14 — Portfolio Analytics Metrics

## Objective

The goal of Day 14 was to upgrade the portfolio page from simple holdings tracking into a stronger **portfolio analytics dashboard**.

This adds more analytical insight into the user’s portfolio and starts moving Vector Trading toward a data-driven trading analytics platform.

---

## Features Implemented

### 1. Portfolio Analytics API Enhancement

Updated:

```bash
src/app/api/portfolio/route.ts
```

The portfolio API now calculates and returns additional analytics metrics.

---

### 2. Position Count

Added total number of active holdings:

```text
positionCount
```

This gives users a quick summary of portfolio diversification.

---

### 3. Best Performing Holding

Calculated the stock with the highest unrealized P&L percentage.

Example:

```text
Best Performer: NVDA +4.25%
```

---

### 4. Worst Performing Holding

Calculated the stock with the lowest unrealized P&L percentage.

Example:

```text
Worst Performer: TSLA -2.10%
```

---

### 5. Portfolio Allocation Percentage

Added allocation percentage per holding:

```text
allocationPercent = position market value / total holdings value × 100
```

This helps users understand portfolio concentration risk.

---

### 6. Largest Allocation Card

Added a dashboard card showing which stock has the largest portfolio allocation.

This helps identify if the portfolio is overly concentrated in one position.

---

### 7. Holdings Table Upgrade

Updated the holdings table to display allocation percentage for each stock.

Example:

```text
AAPL   Allocation: 35.20%
TSLA   Allocation: 52.40%
NVDA   Allocation: 12.40%
```

---

## Architecture Flow

```text
Supabase positions
      ↓
Live price enrichment
      ↓
Portfolio value calculation
      ↓
Analytics calculation
      ↓
API response
      ↓
PortfolioLiveView UI
```

---

## Key Concepts Learned

* Portfolio analytics calculation
* Percentage allocation logic
* Best/worst performer detection
* API response enhancement
* Client-side rendering of analytical metrics
* Financial dashboard design

---

## Data Science / Analytics Importance

This feature introduces portfolio-level analytics such as:

* Ranking holdings by performance
* Measuring allocation concentration
* Tracking diversification
* Understanding unrealized returns

These are foundational ideas in:

* Portfolio analytics
* Quant research
* Risk management
* Investment dashboards

---

## Resume Impact

This feature demonstrates experience with:

* Financial analytics
* Derived metrics
* API-driven dashboards
* Real-time data enrichment
* Portfolio risk visibility
* Full-stack analytics implementation

A strong resume bullet could be:

```text
Built real-time portfolio analytics including allocation percentages, best/worst performer detection, and unrealized P&L metrics using Next.js, Supabase, and live market data APIs.
```

---

## Status

Completed, tested, and working.
