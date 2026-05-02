# Day 23 — Data Pipeline Dashboard (Observability & Monitoring)

## Overview

Today I focused on building a **Data Pipeline dashboard** that simulates how real-world data engineering systems are monitored.

Instead of just displaying static data, I designed a system that tracks **pipeline executions, status, and data quality metrics**, similar to what production systems use.

The goal was to make this part of the project feel like a **real data engineering platform**, not just a frontend feature.

---

## 🧩 What I Built

### 1. Application Structure (Sidebar Cleanup)

I restructured the entire sidebar to make the product feel more realistic and domain-driven.

**TRADING**

* Dashboard
* Watchlist
* Portfolio
* Orders
* Ledger

**DATA**

* Analytics
* Data Pipeline

**QUANT**

* Backtests

I removed the "Market Data" section because it wasn’t serving a strong purpose and moved **Ledger under Trading**, which makes more sense functionally.

---

### 2. Data Pipeline Page (`/data-pipeline`)

This is the core of today’s work.

I created a dedicated page to represent a **full data engineering pipeline**, including ingestion, transformation, and serving layers.

This page is protected using Supabase authentication, so only logged-in users can access their pipeline data.

---

### 3. Pipeline Execution Tracking (Database Design)

I created a table called `pipeline_runs` to track pipeline executions.

Each row represents **one pipeline run**, and includes:

* Pipeline name
* Data source
* Records ingested
* Failed records
* Status (success / failed / running)
* Start time
* Completion time

This is essentially a **run history system**, which is something used in real data platforms to monitor pipelines.

I also enabled:

* Row Level Security (RLS)
* User-specific access (each user only sees their own pipeline runs)

---

### 4. Pipeline Metrics Dashboard

At the top of the page, I added key metrics:

* **Records Ingested** → how much data was processed
* **Pipeline Status** → latest run state
* **Last Run Time** → when pipeline last executed
* **Failed Records** → data quality signal

These metrics are derived from the **latest pipeline run**.

---

### 5. Pipeline Run History Table

This is one of the most important parts.

I built a table that shows the history of all pipeline executions:

* Pipeline name
* Source
* Status
* Records processed
* Failed records
* Start time
* Completion time

Each row represents a real execution event.

I also added **status badges**:

* 🟢 Success
* 🔴 Failed
* 🟡 Running

This makes it visually clear how the pipeline is performing.

---

### 6. Architecture Flow Section

To make the system more understandable and closer to real-world pipelines, I added a visual representation of the data flow:

Market APIs → Kafka → S3 → Databricks (Bronze / Silver / Gold) → dbt → Supabase → Dashboard

Even though not all components are fully implemented yet, this shows the **intended architecture**, which is important for interviews.

---

### 7. Storage Layer Representation

I added a section showing where data lives:

* Raw data → S3
* Processed data → Databricks (Bronze / Silver / Gold)
* Serving layer → Supabase

This helps connect the UI to actual data engineering concepts.

---

### 8. Data Quality Checks (Planned Layer)

I added a placeholder section for:

* Duplicate checks
* Null validation
* Schema validation
* Freshness checks

These are common in real pipelines, and I plan to implement them later.

---

### 9. Pipeline Simulation (Server Action)

Instead of manually inserting rows into the database, I implemented a **server action**:

👉 “Trigger Test Run”

When clicked:

* A new pipeline run is inserted into the database
* Values are randomized (records, failures, status)
* Dashboard updates on refresh

This simulates how pipelines generate logs automatically in real systems.

---

## 🧠 Key Learnings

* How to design a **pipeline run tracking system**
* Importance of **user-based filtering with Supabase RLS**
* Difference between:

  * `.maybeSingle()` → single row
  * `.select()` → multiple rows
* How real systems track:

  * execution status
  * performance
  * data quality

---

## 🚀 Outcome

By the end of today:

This is no longer just a UI page.

It is now a **data pipeline observability system** that includes:

* Execution tracking
* Monitoring dashboard
* Run history logging
* Data quality visibility
* Simulated pipeline events

---

## 💼 Resume Impact

A strong way to describe this:

> Built a data pipeline observability dashboard with execution tracking, monitoring, and simulated pipeline runs using Next.js and Supabase.

---

## 🔜 Next Steps (Day 24)

* Automate pipeline runs (no manual trigger)
* Add runtime calculation
* Add success rate metrics
* Make dashboard auto-refresh
* Simulate real-time pipeline behavior
* (Advanced) Kafka-style event simulation

---

## Final Note

Today’s work made the project feel significantly more like a **real data engineering system** rather than a frontend demo.

This is a strong step toward making the project **interview-ready and resume-worthy**.
