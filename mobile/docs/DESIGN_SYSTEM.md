# PocketCA — UI Design Language & Visual System

## Design Philosophy
- **Vibe:** Premium, Minimal, Modern, Trustworthy, Elegant, Fast, Calm, Confident.
- **Goal:** Reduce stress, create confidence. Money is stressful; the app should not be.
- **Inspiration:** Apple, Linear, Notion, Mercury, Ramp, Monzo, Stripe, CRED (Original feel, no direct copying).

## Visual Principles
- Clarity first, Beauty second, Consistency always.
- Whitespace is a feature. Never clutter, never overload.

## Design Tokens (No Hardcoding)
Everything must use tokens. Never hardcode colors, spacing, radius, typography, shadow, opacity, animation duration, or animation curves.

### 1. Color System
- Support Light and Dark Themes.
- Tokens: Primary, Secondary, Accent, Success, Warning, Error, Info, Background, Surface, Card, Border, Divider, Typography, Muted Text, Disabled, Hover, Pressed, Selected, Focus.

### 2. Typography System
- Font: Modern geometric sans-serif.
- Hierarchy: Display Large/Medium/Small, Heading 1/2/3/4, Title, Subtitle, Body Large/Medium/Small, Caption, Overline, Button Text, Numeric Display.
- Attributes: Size, Weight, Letter Spacing, Line Height, Text Transform.

### 3. Spacing System (8-Point Grid)
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72, 80, 96.
- All padding, margins, and layout grids must use this scale. Visual rhythm is mandatory.

### 4. Border Radius System
- Scale: Extra Small, Small, Medium, Large, Extra Large, Full.
- Consistent usage across components.

### 5. Shadow System
- Soft, minimal shadows. Use elevation only where necessary.
- Support: Card, FAB, Bottom Sheet, Modal, Dropdown, Toast.

## Component Specifications

### Buttons
- Types: Primary, Secondary, Outline, Ghost, Danger, Icon, FAB.
- States: Default, Hover, Pressed, Disabled, Loading, Success, Focus.

### Inputs
- Types: Text, Password, OTP, Search, Currency, Amount, Date Picker, Dropdown, Checkbox, Radio, Toggle.
- States: Focused, Filled, Disabled, Read Only, Error, Success, Loading.

### Cards & Lists
- Cards: Primary content container. Rounded corners, soft shadows, clear hierarchy, consistent spacing. Never crowded.
- Lists: Support Avatar, Icon, Amount, Status, Subtitle, Action, Swipe Actions, Selection. Touch-friendly.

### Overlays
- Bottom Sheets: Preferred over modals. Snap Points, Drag, Scroll, Keyboard, Animation, Backdrop Blur.
- Modals: Critical actions only (Delete, Logout, Permissions, Alerts). Never for navigation.

## Data Visualization (Charts)
- Explain information, no decorative graphs.
- Types: Line, Bar, Pie, Area, Progress Ring, Goal Progress, Cash Flow, Budget Breakdown.
- Must include labels, context, insights, legends, empty states.

## Motion & Interaction
- Animations: Fast, smooth, natural, purposeful. Never flashy.
- Support: Fade, Scale, Slide, Shared Element, Gesture Animation, Skeleton Loading, Pull to Refresh, Streaming AI, Page Transition, Bottom Sheet.
- Feedback: Every action produces feedback (Success, Error, Warning, Info, Loading, Offline, Saved, Deleted, Updated).

## Accessibility & Responsive Design
- Accessibility is mandatory: Dynamic Font, High Contrast, Screen Reader (TalkBack/VoiceOver), Large Touch Targets, Reduced Motion.
- Responsive: Fluid layouts for Small, Medium, Large phones. No fixed layouts.

## Final Objective
PocketCA must establish a distinct, world-class visual identity worthy of Apple Design Awards or Dribbble/Behance features.
