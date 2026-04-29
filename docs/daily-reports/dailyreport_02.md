# Day 02 – Vector Trading

## Overview

Today focused on implementing authentication and introducing the first real database model for the application. The goal was to transition from a static frontend into a functional full-stack system with user-specific data.

---

## What I Worked On

* Integrated Supabase authentication using email and password
* Built login and signup flows with form handling
* Implemented protected routes using server-side session checks
* Created a dashboard shell with navigation and layout components
* Designed and implemented a `profiles` table to store user-specific data
* Enabled row-level security (RLS) and added access policies
* Inserted a profile record automatically during user signup
* Handled edge cases where a profile might not exist

---

## What I Completed

* Fully functional authentication system (signup, login, logout)
* Protected `/dashboard` route that requires authentication
* Session persistence across page reloads
* Dashboard layout with navbar and sidebar
* `profiles` table linked to authenticated users
* Default trading account initialized with:

  * cash balance: 100,000
  * total value: 100,000
* Dashboard displays real user data from database
* Implemented fallback logic to auto-create profile if missing

---

## Database Design Decision

Instead of storing additional user data inside `auth.users`, I created a separate `profiles` table.

### Reason:

* `auth.users` is managed by Supabase
* modifying it directly is not recommended
* separating concerns allows scalability and flexibility

### Schema:

* `id` → references `auth.users.id`
* `email` → user email
* `cash_balance` → simulated available funds
* `total_value` → total portfolio value

---

## Security Implementation

* Enabled Row Level Security (RLS) on `profiles`
* Created policies to ensure:

  * users can only read their own data
  * users can only insert their own profile
  * users can only update their own profile

This ensures proper multi-user data isolation.

---

## Problems I Faced

### 1. Profile Fetch Error

Error:
"Cannot coerce the result to a single JSON object"

### Cause:

* `.single()` was used but no row existed for the user

### Solution:

* replaced `.single()` with `.maybeSingle()`
* added fallback logic to insert profile if missing

---

### 2. Signup Profile Insert Timing

* profile insert during signup did not always reflect immediately

### Solution:

* added defensive logic in dashboard to ensure profile existence

---

## What I Learned

* How authentication works in Next.js App Router using Supabase
* Difference between client-side and server-side Supabase usage
* Importance of separating auth data and application data
* How to design secure database access using RLS
* Handling edge cases where expected data may not exist
* Writing resilient backend logic that can recover from inconsistencies

---

## Screenshots / Notes

* Signup page working
* Login page working
* Dashboard displaying real user data
* Profiles table showing inserted user records

---

## Next Steps

* Implement watchlist feature
* Integrate market data API (Finnhub)
* Allow users to search and track stocks
* Begin building trading functionality

---

## Reflection

Day 02 marked the transition from a frontend project into a real full-stack system.

The addition of authentication and a structured database model significantly increased the realism of the application. The project now resembles a production-grade system where each user has isolated data and a persistent state.

This sets the foundation for all future features, including trading, analytics, and real-time updates.

---
