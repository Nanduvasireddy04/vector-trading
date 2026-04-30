# Day 13 — Cash Ledger Page

## Objective

The goal of Day 13 was to build a **cash ledger system** that tracks all cash movements in the trading platform.

This creates a clear financial audit trail for every trade-related cash event.

---

## Features Implemented

### 1. Cash Ledger Route

Created a new page:

```bash
src/app/ledger/page.tsx
```

This page displays ledger entries for the authenticated user.

---

### 2. Transaction History Table

The ledger shows:

* Transaction type
* Related stock symbol
* Cash amount
* Linked order reference
* Transaction timestamp

---

### 3. Buy/Sell Cash Flow Tracking

Cash movements are displayed clearly:

```text
BUY  → negative cash movement
SELL → positive cash movement
```

Positive amounts are shown in green.
Negative amounts are shown in red.

---

### 4. Relational Data Join

The ledger page connects:

```text
cash_ledger → orders → assets
```

This makes each cash transaction traceable back to the related trade and stock symbol.

---

### 5. TypeScript Fixes

Resolved TypeScript issues related to:

* Nullable Supabase results
* Nested relationship typing
* Safe mapping over query results

Used safe null handling and explicit nested relation typing where needed.

---

## Data Engineering Importance

This feature introduces an **append-only event log**, which is a core pattern in financial and data systems.

It supports:

* Auditability
* Transaction traceability
* Historical reconstruction
* Debugging financial flows
* Event-driven system design

---

## Architecture Flow

```text
Trade executed
      ↓
Order record created
      ↓
Cash ledger entry inserted
      ↓
Ledger page displays transaction history
```

---

## Resume Impact

This feature demonstrates:

* Financial data modeling
* Event logging
* Audit trail design
* Relational joins
* Secure user-specific querying
* Type-safe full-stack development

---

## Status

Completed, tested, and TypeScript errors resolved.
