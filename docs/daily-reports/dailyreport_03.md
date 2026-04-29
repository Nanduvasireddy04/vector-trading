# Day 03 – Vector Trading

## Overview

Today I built the **watchlist feature**, which is the first part of the application that actually interacts with real market data.

The goal was to allow users to:

* search for stocks
* save them to a personal watchlist
* view live price data
* manage (remove) tracked assets

This marks the transition from a backend-only system to a **data-driven, user-facing trading interface**.

---

## What I Worked On

* Integrated an external market data API (Finnhub)
* Designed database tables for assets and watchlist items
* Built a search interface for stocks
* Implemented add/remove functionality for watchlist items
* Displayed real-time quote data for each asset
* Applied row-level security (RLS) for user-specific data
* Debugged API errors and database policy issues

---

## What I Completed

### 1. Stock Search

* Built a search feature using Finnhub API
* Users can search by company name or ticker (e.g., AAPL, Tesla)
* Results display symbol, company name, and asset type

---

### 2. Database Design

Created two tables:

#### `assets`

Stores unique stock data (shared across users)

* symbol (unique)
* display_symbol
* description
* type

#### `watchlist_items`

Stores user-specific watchlist entries

* user_id (linked to auth.users)
* asset_id (linked to assets)
* ensures each user has their own watchlist

---

### 3. Add to Watchlist

* Users can add a stock from search results
* If the asset already exists → reuse it
* If not → create a new entry
* Prevents duplication using unique constraints

---

### 4. Remove from Watchlist

* Users can remove assets
* Data is deleted only for that user
* Changes persist after refresh

---

### 5. Live Market Data (Quote API)

* Built a server-side API route for stock quotes

* Fetches:

  * current price
  * daily change
  * percentage change
  * open price
  * previous close

* Displayed this data in UI cards

---

### 6. User Experience

* Watchlist items display:

  * symbol
  * company name
  * price
  * daily movement
* Clean UI with loading states
* Data persists across refresh

---

## Problems I Faced

### 1. Finnhub API not working

**Issue:**
“Failed to fetch symbols”

**Cause:**

* Missing API key
* Server not restarted after adding `.env.local`

**Fix:**

* Added `FINNHUB_API_KEY`
* Restarted server

---

### 2. TypeScript import errors

**Issue:**
Module not found for watchlist components

**Cause:**

* File naming or caching issue

**Fix:**

* Verified file paths
* Restarted TypeScript server

---

### 3. Row-Level Security (RLS) error

**Error:**

```
new row violates row-level security policy for table "assets"
```

**Cause:**

* `upsert()` triggered an UPDATE operation
* No UPDATE policy existed for `assets`

**Fix:**

* Added UPDATE policy to allow asset updates

---

## What I Learned

* How to integrate third-party APIs securely using server routes
* Why API keys should not be exposed to the frontend
* How to design shared vs user-specific database tables
* How relational data models work in real applications
* How row-level security (RLS) affects database operations
* How to debug real-world issues involving APIs and database policies

---

## Screenshots / Notes

* Watchlist search working with real data
* Quote cards displaying live prices
* Supabase tables populated correctly (`assets`, `watchlist_items`)
* Add/remove functionality confirmed

---

## Next Steps

* Add real-time updates (auto-refresh prices)
* Build asset detail page (charts + history)
* Implement portfolio tracking
* Start building order execution (buy/sell simulation)

---

## Reflection

Day 03 was a major step forward.

The application now:

* interacts with real-world data
* stores user-specific preferences
* follows a scalable database design

This is no longer just a project—it’s starting to resemble a **real trading platform architecture**.

---
