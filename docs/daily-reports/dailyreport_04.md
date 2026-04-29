# Day 04 – Vector Trading

## Overview

Today I built the **core paper trading engine**, which is the most important part of the application so far.

The goal was to simulate how a real trading system works:

* users can place buy/sell orders
* system executes them at market price
* positions are updated
* cash balance is adjusted
* portfolio reflects current holdings

This transforms the project from a tracking app into a **functional trading simulation platform**.

---

## What I Worked On

* Designed database tables for trading system
* Implemented market order execution logic
* Built buy/sell functionality in the UI
* Calculated position quantities and average cost
* Updated user cash balance after each trade
* Created portfolio page to display holdings
* Connected trading flow with real-time market prices

---

## What I Completed

### 1. Orders System

Created an `orders` table to record all trades.

Each order stores:

* user_id
* asset_id
* side (buy/sell)
* quantity
* executed price
* status (filled)

This acts as a **trade history log**, similar to real trading platforms.

---

### 2. Positions System

Created a `positions` table to track user holdings.

For each asset, it stores:

* total quantity owned
* average cost per share

### Logic:

* Buy → increases quantity and recalculates average cost
* Sell → decreases quantity
* If quantity becomes 0 → position effectively closes

---

### 3. Cash Ledger

Created a `cash_ledger` table to track money movement.

* Buy → negative entry (cash decreases)
* Sell → positive entry (cash increases)

This ensures every financial action is recorded and traceable.

---

### 4. Market Order Execution

Implemented a server-side action:

* Fetches real-time price using Finnhub
* Calculates total order value
* Validates:

  * sufficient cash (for buy)
  * sufficient shares (for sell)

### Execution flow:

1. Fetch current price
2. Create order record
3. Update position
4. Update cash balance
5. Insert ledger entry

This mirrors how real trading systems process orders.

---

### 5. Trade Form (UI)

Added a trading interface to each watchlist card:

* quantity input
* Buy button
* Sell button

Users can now directly trade from their watchlist.

---

### 6. Portfolio Page

Built `/portfolio` page to display:

* cash balance
* total account value
* list of positions

Each position shows:

* symbol
* quantity
* average cost
* total cost basis

---

## Problems I Faced

### 1. Passing asset_id to trading logic

**Issue:**
Trade form needed asset_id but watchlist query did not include it.

**Fix:**

* Updated query to include `asset_id`
* Updated TypeScript types accordingly

---

### 2. Connecting watchlist to trading system

**Issue:**
Watchlist UI did not initially support trading actions.

**Fix:**

* Injected TradeForm into each watchlist card
* Passed asset_id and symbol correctly

---

### 3. Handling financial calculations

**Issue:**
Needed correct calculation of average cost and balances.

**Fix:**

* Used weighted average formula for positions
* Ensured numeric conversions using `Number()`

---

## What I Learned

* How trading systems manage orders, positions, and cash
* Difference between:

  * orders (transactions)
  * positions (current holdings)
* Importance of keeping financial logic server-side
* How to safely update multiple tables during a transaction-like flow
* How real trading platforms separate:

  * trade execution
  * portfolio state
  * transaction history

---

## System Design Understanding

The system now follows a real trading architecture:

* `orders` → historical transactions
* `positions` → current holdings
* `profiles` → account balance
* `cash_ledger` → money movement

This separation allows scalability and maintainability.

---

## Screenshots / Notes

* Buy order executed successfully
* Sell order executed successfully
* Portfolio updates correctly after trades
* Cash balance changes reflect transactions
* Data persists across refresh

---

## Next Steps

* Add real-time portfolio value calculation
* Calculate unrealized profit/loss (P&L)
* Build order history page
* Add asset detail page with charts
* Improve UI with better financial metrics

---

## Reflection

Day 04 was the most important step so far.

The application now:

* simulates real trading behavior
* maintains financial state
* integrates live market data into backend logic

This is the point where the project moves from a demo into a **real system design project**.

---
