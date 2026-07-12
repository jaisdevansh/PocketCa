# PocketCA — Component Library & Design System Architecture

## Design System Philosophy
- Scalable, Reusable, Accessible, Consistent, Maintainable, Performance Optimized, Animation Ready, Theme Ready.
- **Rule:** Every screen MUST be assembled using reusable building blocks. Never create duplicate or screen-specific UI if it can be reused.

## Component Categories
1. **Foundation:** Typography, Icon, Divider, Spacer, Avatar, Badge, Chip, Status Indicator, Pill, Tag, Progress Bar, Circular/Linear Progress, Shimmer, Skeleton.
2. **Buttons:** Primary, Secondary, Outline, Ghost, Danger, Success, FAB, Icon, Text, Loading. (Supports Default, Pressed, Hover, Disabled, Loading, Success, Error, Focus, Icons, Sizes).
3. **Inputs:** Text, Password, OTP, Email, Phone, Currency, Amount, Number, Search, Textarea, Dropdown, Date/Time Picker, Checkbox, Radio, Toggle, Slider, Multi-Select.
4. **Cards:** Base, Financial, Transaction, Goal, Budget, Insight, Report, Subscription, Premium, AI Suggestion, Bill, Reminder, Notification.
5. **Lists:** Simple, Transaction, Goal, Notification, Bill, Settings, Search, Expandable, Grouped, Swipe. (Supports Swipe Actions, Selection, Sorting, Filtering, Infinite Scroll, Pull to Refresh).
6. **Navigation:** Bottom, Top, Back Button, Tab Bar, Segmented Control, Breadcrumb, Drawer, Page Indicator.
7. **AI Components:** Chat Bubble, Suggestion Card, Recommendation, Typing Indicator, Thinking Animation, Prompts, History, Summary Card, Insight Widget, Banner, Empty/Error States, Streaming Response.
8. **Financial Components:** Balance, Income, Expense, Savings, Goal/Budget Progress, Health, EMI, Bill, Investment, Tax Summary, Net Worth, Category Breakdown, Monthly Summary, Cash Flow.
9. **Charts:** Line, Bar, Area, Pie, Donut, Progress Ring, Goal Progress, Budget Distribution, Income/Expense/Savings Trends, Category Distribution. (Supports Loading, Empty, Animation, Tooltips, Legends).
10. **Overlays:** Bottom Sheet, Modal, Alert Dialog, Confirmation Dialog, Action Sheet, Toast, Snackbar, Tooltip, Popover, Image Viewer.
11. **Feedback & Loading:** Success, Error, Empty, Offline, Maintenance, Permission, Update screens. Splash, Screen, Page, Inline, Button, AI, Skeleton, Shimmer loaders.

## Common Component Rules
- **Requirements:** Light/Dark Theme, Loading/Disabled States, Accessibility, Animation, Responsive Layout, Reusable Props, Type Safety.
- **Design Tokens:** NO HARDCODED VALUES. Always use Color, Typography, Spacing, Radius, Shadow, Animation, Opacity, Elevation tokens.
- **Performance:** Avoid unnecessary re-renders, use memoization, lazy loading, virtualization, optimize images, lightweight animations (60fps on low-end devices).
- **Accessibility:** Screen Readers, Large Text, Reduced Motion, Keyboard Navigation, Touch Target Size, High Contrast, Focus Indicators.

## Naming Convention
- Must be descriptive (e.g., `PrimaryButton`, `GoalCard`, `TransactionItem`).
- Avoid vague names (e.g., `Card1`, `Box`, `Widget`, `Container`).
