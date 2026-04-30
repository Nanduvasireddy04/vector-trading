# 📈 Day 20 — Backtesting System (Quant Layer Foundation)

## 🎯 Objective

The goal of Day 20 was to introduce a **backtesting system** that simulates trading strategies using historical data.

This marks the transition from analytics into **quantitative strategy evaluation**.

---

## 🏗️ Features Implemented

### 1. Strategy Tables

Created:

```sql
strategy_runs
strategy_trades
```

#### strategy_runs:

* Stores one backtest execution
* Includes:

  * strategy name
  * symbol
  * time range
  * initial cash
  * final value
  * total return

#### strategy_trades:

* Stores simulated trades
* Includes:

  * buy/sell actions
  * price
  * quantity
  * trade date

---

### 2. Buy-and-Hold Backtest API

Created:

```bash
src/app/api/backtests/buy-and-hold/route.ts
```

#### Logic:

```text
Fetch daily_returns
      ↓
Buy at first open price
      ↓
Hold position
      ↓
Sell at last close price
      ↓
Compute return
```

---

### 3. Strategy Simulation Output

Example:

```text
Initial Cash: 10000
Entry Price: 270.17
Exit Price: 271.87
Final Value: 10062.92
Return: +0.63%
```

---

### 4. Trade Recording

Each backtest creates:

```text
1 BUY trade
1 SELL trade
```

Stored in:

```text
strategy_trades
```

---

### 5. Backtests Page

Created:

```bash
src/app/backtests/page.tsx
```

Displays:

* Strategy name
* Symbol
* Period
* Initial cash
* Final value
* Return %
* Created timestamp

---

### 6. Interactive Testing Links

Added quick-run links:

```text
Run AAPL
Run NVDA
Run TSLA
```

These trigger the backtest API and store results instantly.

---

## 🧠 Key Concepts Learned

* Backtesting fundamentals
* Strategy simulation
* Trade lifecycle modeling
* Historical data usage
* Performance metric calculation
* Data storage for experiments

---

## 🧱 Architecture Flow

```text
market_prices
    ↓
daily_returns
    ↓
Backtest API
    ↓
strategy_runs + strategy_trades
    ↓
Backtests page
```

---

## 🚀 Outcome

By the end of Day 20, the system supports:

* 📈 Strategy simulation
* 💰 Portfolio return calculation
* 🧪 Experiment tracking
* 📊 Stored backtest results
* 🔁 Repeatable quant workflows

---

## 💡 Why This Matters (Resume Impact)

This feature demonstrates:

* Quantitative modeling
* Financial simulation
* Data-driven strategy evaluation
* Full pipeline integration (data → model → result)

Comparable to:

* QuantConnect
* Two Sigma style workflows
* Renaissance Technologies research pipelines

---

## 🔜 Next Steps

* Moving average crossover strategy
* Strategy comparison
* Risk metrics (Sharpe ratio, drawdown)
* ML-based trading signals

---

## ✅ Status

✔ Completed
✔ Backtesting system working
✔ Quant layer initialized
