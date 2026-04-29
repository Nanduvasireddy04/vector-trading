# Day 01 – Vector Trading

## Overview

Today focused on setting up the foundation for **Vector Trading**, a Robinhood-style paper trading simulation platform.
The goal was not to build features yet, but to establish a clean, scalable, production-ready base that supports future development.

---

## What I Worked On

* Initialized the project using Next.js with TypeScript and Tailwind CSS
* Structured the project using a feature-based architecture
* Set up version control with Git and pushed the initial repository to GitHub
* Configured Supabase for backend integration (DB + Auth planned)
* Attempted to integrate shadcn/ui and resolved setup issues manually
* Built a polished landing page using reusable UI components
* Fixed module resolution errors related to path aliases and shared utilities

---

## What I Completed

* Fully working Next.js application running locally
* Clean and scalable folder structure created
* Git repository initialized and pushed to GitHub
* Supabase project created and environment variables configured
* Manual setup of reusable UI components (Button, Card, Input)
* Landing page UI built and styled using Tailwind
* Shared utility (`cn`) implemented for consistent class handling
* All initial setup issues debugged and resolved

---

## Project Structure Decision

Instead of using a flat structure, I organized the project using a **feature-based architecture**:

* `components/` → reusable UI elements
* `features/` → business logic modules (auth, trading, etc.)
* `lib/` → shared utilities and configurations
* `services/` → external API integrations
* `docs/` → project documentation and daily reports

This approach aligns with real-world production systems and makes the codebase easier to scale and maintain.

---

## Problems I Faced

### 1. Nested Project Structure Issue

Initially, the Next.js app was created inside an already existing folder, which resulted in a nested structure:

```
vector-trading/
  vector-trading/
    src/
    package.json
```

This caused confusion when running the app and installing dependencies.

---

### 2. “next: command not found” Error

When running the app, the terminal threw:

```
sh: next: command not found
```

This happened because the actual project dependencies were inside the nested folder, not the root.

---

### 3. shadcn/ui Initialization Failure

The CLI failed due to Tailwind configuration detection issues:

```
No Tailwind CSS configuration found
```

This is related to differences between Tailwind v4 setup and what the CLI expects.

---

### 4. Module Resolution Error

While building UI components, I encountered:

```
Module not found: Can't resolve '@/lib/utils'
```

This happened because the utility file structure didn’t match the import path.

---

## How I Solved Them

### Fixing Folder Structure

* Moved the actual Next.js app files to the root project folder
* Removed the unnecessary nested directory
* Reinstalled dependencies and verified app execution

---

### Fixing shadcn/ui Setup

Instead of relying on the CLI (which failed due to config mismatch), I:

* Installed required dependencies manually
* Created UI components manually (Button, Card, Input)
* Followed shadcn’s manual setup approach

---

### Fixing Module Resolution

* Created a proper utility file at:

```
src/lib/utils.ts
```

* Implemented the reusable `cn` function for Tailwind class merging
* Ensured import alias (`@/...`) correctly maps to `src/`

---

## What I Learned

* The order of project setup is critical (framework → structure → libraries)
* Folder structure decisions early on impact scalability and maintainability
* CLI tools can fail — knowing how to manually set things up is important
* Module resolution and import aliases are common sources of bugs
* Debugging setup issues is a key real-world development skill
* Building reusable components early helps maintain consistency across the app

---

## Screenshots / Notes

* Added landing page screenshot to:

```
docs/screenshots/day-01-landing-page.png
```

* Verified that the app runs successfully at:

```
http://localhost:3000
```

---

## Next Steps

For Day 02, the focus will be:

* Implementing Supabase authentication (signup/login)
* Creating protected routes
* Building dashboard layout (navbar + sidebar)
* Structuring the first real application pages

---

## Reflection

Day 01 was not about building features, but about building the **right foundation**.

Instead of rushing into functionality, I focused on:

* clean architecture
* proper tooling
* scalable structure
* debugging setup issues

This sets up the project for faster and more efficient development in the coming days.

---
