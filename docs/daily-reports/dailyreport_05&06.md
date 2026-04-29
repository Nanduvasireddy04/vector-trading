# Day 6 – Asset Detail Page

## Goal
Build a Robinhood-style individual stock page for Vector Trading where users can view stock details, chart data, their position, recent orders, and place buy/sell trades.

## Completed Features

### 1. Dynamic Stock Detail Page
Created a dynamic route:

/stocks/[symbol]

This allows users to visit pages like:

/stocks/AAPL

The page displays:
- Stock symbol
- Company name
- Current market price
- Historical chart
- Trade panel
- User position
- Recent orders

### 2. Finnhub Integration
Used Finnhub to fetch:
- Live stock quote
- Company profile information

Finnhub is used for lightweight real-time stock data.

### 3. Polygon.io Chart Integration
Added Polygon.io as a second market data provider.

Polygon is used for historical aggregate candle data because Finnhub historical candles were restricted on the current API plan.

This improved the architecture by separating:
- Finnhub → quotes and company profile
- Polygon → historical chart data

### 4. Custom Stock Chart
Built a custom chart component using Recharts.

The chart displays recent daily closing prices from Polygon API.

Also handled chart container sizing issues and fixed Recharts layout warnings.

### 5. Trade Panel on Stock Page
Added a Buy/Sell panel directly inside the asset detail page.

The panel connects to the existing Day 4 paper trading engine through the `placeMarketOrder` server action.

Users can now place trades directly from the stock page.

### 6. Position Summary
Added a position summary section showing:
- Shares owned
- Average cost
- Market value
- Unrealized P&L

Fixed the database connection by using:
- `positions.asset_id`
- `positions.average_cost`

instead of incorrect symbol-based fields.

### 7. Recent Orders for Stock
Added recent orders for the selected stock.

Fixed order display by using:
- `orders.asset_id`
- `orders.estimated_price`

instead of incorrect symbol/price fields.

## Bugs Fixed

### Finnhub Candle Access Issue
Finnhub returned:

"You don't have access to this resource."

Solution:
Switched historical chart data to Polygon.io.

### UUID Error in Trade Panel
Error:

invalid input syntax for type uuid: ""

Cause:
The TradePanel was receiving an empty asset ID.

Fix:
Fetched the correct asset from the `assets` table and passed the real `asset.id` into the TradePanel.

### Position Not Showing
Cause:
The stock page was incorrectly querying positions by symbol.

Fix:
Updated query to use `asset_id`, matching the trading engine schema.

### Recent Orders Type Error
Cause:
The component expected `price`, but the database stores `estimated_price`.

Fix:
Updated `RecentStockOrders.tsx` to use `estimated_price`.

## Final Result
The asset detail page now supports:

- Live stock price
- Company information
- Historical chart
- Buy/Sell trading
- Position tracking
- Recent order history

This completes the core Robinhood-style stock page experience.

## Interview Talking Point
I built a full stock detail page with live market data, historical charting, trading actions, portfolio integration, and recent order tracking. I also handled real-world API limitations by using multiple market data providers and designing the page around the actual database schema.