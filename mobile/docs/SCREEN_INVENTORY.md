# PocketCA — Complete Screen Inventory & Feature Blueprint

## Application Modules
1. Authentication
2. Home Dashboard
3. Transactions
4. Goals
5. AI Coach
6. Insights & Reports
7. Bills & Subscriptions
8. Notifications
9. Profile
10. Settings
11. Premium
12. Help & Support

## Module Breakdown

### 1. Authentication
**Purpose:** Authenticate users quickly and securely. Minimal friction.
**Screens:** Splash, Welcome, Onboarding, Login, Register, OTP Verification, Forgot/Reset Password, Complete Profile, Biometric Setup, Success.
**Support:** Email, Phone, Google, Apple (Future), Biometrics.

### 2. Home Dashboard
**Purpose:** Financial control center (Where is my money? What next?).
**Screens:** Dashboard, Health Overview, Monthly/Spending/Income Overview, Recent Transactions, Budget/Goal Progress, Upcoming Bills, Quick Actions, AI Suggestions, Financial Score.

### 3. Transactions
**Purpose:** Effortless expense tracking.
**Screens:** List, Details, Add Expense/Income, Edit/Delete, Category Manager, Search, Filters, Recurring, Receipts, Notes.

### 4. Goals
**Purpose:** Help users save consistently.
**Screens:** List, Details, Create/Edit/Delete, Timeline, Milestones, Contributions, Analytics, Success.

### 5. AI Coach (Flagship Feature)
**Purpose:** Personalized, contextual financial guidance. Never generic.
**Screens:** AI Home, Chat, Conversation, Suggested Qs, Insights, Budget/Goal Planner, Tax Assistant, Investment Guide, Health Report, History.

### 6. Insights & Reports
**Purpose:** Convert raw data into actionable insights (What? Why? How to improve?).
**Screens:** Overview, Income/Expense Analytics, Category Breakdown, Cash Flow, Savings Trends, Budget Performance, Health Score, Monthly/Annual Reports, Export.

### 7. Global & Common UI Patterns
- **Global Screens:** Loading, Skeleton, Offline, Server Error, Maintenance, Empty, Success, Permission, Update, Session Expired.
- **Common Patterns:** Pull to Refresh, Search, Filters, Pagination, Keyboard Handling, Accessibility, Dark/Light Mode.

## Screen Specification Template
*Every individual screen created must follow this template:*
- Screen Name
- Purpose
- Business Goal & User Goal
- Navigation Entry & Exit
- Layout Structure
- Component Hierarchy
- Data Requirements & API Dependencies
- User Actions & Validation Rules
- States: Loading, Skeleton, Empty, Offline, Error
- Permission Handling
- Animations
- Accessibility & Performance Rules
- Edge Cases
- Acceptance Criteria
- Future Improvements

## Feature Priority
- **MVP (Phase 1):** Auth, Dashboard, Transactions, Goals, AI Coach, Reports, Profile, Settings.
- **Phase 2:** Bills, Subscriptions, Premium, Notifications, Bank Sync, OCR.
- **Phase 3:** Investments, Tax Filing, Family/Business Accounts, Voice AI, Widgets, Wearables.
