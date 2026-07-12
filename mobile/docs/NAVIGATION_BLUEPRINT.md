# PocketCA — Navigation Blueprint & Information Architecture

## Primary User Goal
When users open PocketCA, they must immediately understand:
- Where their money goes
- How much they have saved
- What they should do next
- Whether they are financially healthy

## Primary Navigation (Bottom Tabs)
The application uses a 5-tab Bottom Navigation Bar:
1. **Home**: Financial overview, today's status, upcoming bills, recent transactions, AI recommendations, quick actions.
2. **Goals**: Manage financial goals, track progress, view milestones.
3. **AI Coach**: The core feature. Chat-based financial advisor providing actionable advice, tax guidance, and saving suggestions.
4. **Insights**: Monthly overview, income/expense analysis, category breakdown, cash flow, net worth.
5. **Profile**: Settings, notifications, security, connected accounts, subscriptions.

## Secondary Navigation (Stack)
These screens sit on top of the tabs or exist outside of them:
- Splash, Onboarding, Authentication (Login/Signup/OTP)
- Create Goal, Goal Details, Transaction Details
- AI Chat History, Settings, Subscription Plans, Support

## User Flows
- **Onboarding Flow**: Splash -> Welcome -> Intro -> Highlights -> Permissions -> Auth -> Complete Profile -> Dashboard.
- **Auth Flow**: Splash -> Login/Signup -> OTP -> Profile Setup -> Dashboard.
- **Home Flow**: Dashboard -> Quick Summary -> Actions -> Transactions -> Bills -> Savings -> AI Card -> Quick Actions.
- **Goals Flow**: Goals -> List -> Details -> Timeline -> History -> Edit -> Complete.
- **AI Coach Flow**: Coach -> Suggested Qs -> Chat -> Streaming Response -> Actions -> Insights -> Save.
- **Insights Flow**: Insights -> Summary -> Income/Expenses -> Categories -> Cash Flow -> Reports.
- **Profile Flow**: Profile -> Personal Info -> Security -> Notifications -> Subscriptions -> Help.

## Quick Actions (Home)
One-tap access to: Add Expense, Add Income, Create Goal, Ask AI, View Reports, Pay Bills.

## Global Strategies
- **Search**: Available in Transactions, Goals, Reports, AI Chat, Settings. Never for decoration.
- **Notifications**: Meaningful only (budget exceeded, bill due, goal completed, new AI advice).
- **Empty States**: Explain *why* it's empty, *how* to start, and *what* action to take. No generic "No Data".
- **Error States**: Support Network, Server, Permission, Timeout, AI Failure, Payment Failure. Always include a recovery action.
- **Offline Experience**: Browse cached data, past reports, past goals, past AI chats. Clear offline indicators.

## Architecture Principles
- Primary information first, secondary later.
- Never create deep navigation chains.
- Users must always know where they are, how they got there, and how to go back.
