# Dashboard UI Alignment With HTML Template

## Summary
Refactor the dashboard layout and its existing components to closely match the provided neobrutalism HTML template. The goal is visual parity with the template while keeping the current component structure.

## Goals
- Match the HTML template structure and styling for dashboard UI.
- Keep existing component boundaries where possible.
- Use fake data in the sidebar sections for now.
- Preserve responsive behavior (desktop sidebars, mobile bottom nav).

## Non-Goals
- Wire real data sources.
- Introduce new routes or backend changes.
- Redesign unrelated pages.

## Current Context
- `src/app/dashboard/layout.tsx` renders `DashboardHeader`, `Sidebar`, `BottomNav`, and `children`.
- `src/components/layout/DashboardHeader.tsx` is a simple header with logo, button, avatar.
- `src/components/layout/Sidebar.tsx` currently uses `conversations` data and a compact list.
- `src/components/layout/BottomNav.tsx` is mobile-only.

## Proposed Approach
### Option A (Recommended)
Refactor existing components to mirror the HTML template.
- Pros: Minimal architectural change, reversible.
- Cons: Requires deeper markup edits in each component.

### Option B
Inline all template HTML into `DashboardLayout`.
- Pros: Fast to match visuals.
- Cons: Poor maintainability, loses component reuse.

### Option C
Create a new template wrapper component and keep legacy components.
- Pros: Isolation, low risk to existing.
- Cons: Extra indirection.

Recommendation: Option A.

## Design Details
### Layout Structure
- `DashboardLayout` remains the top-level wrapper under `ProtectedRoute`.
- Three main regions:
  - Primary sidebar (narrow icon bar).
  - Secondary sidebar (conversation list panel).
  - Main area (empty state and `children` content).
- `BottomNav` remains for mobile and uses template styling.

### Component Mapping
- `DashboardHeader`
  - Update markup to match template header sections.
  - Include logo, light/dark toggle UI (static), and "New Message" button.
- `Sidebar`
  - Split internally into primary and secondary sidebar sections.
  - Primary sidebar: app icon and vertical nav icons.
  - Secondary sidebar: header, search, group chats list, friends list, profile switcher.
  - Use hardcoded fake data for now (groups, friends, user).
- `Main Content`
  - In layout or a new small component:
    - Empty state (icon circle, welcome title, description).
    - CTA buttons (Create New Group, Find Friends).
    - Decorative card (desktop only).
  - `children` rendered within main area; empty-state shown as default shell when no content is provided.

### Visual System
- Follow the provided template's colors, type, borders, and editorial shadow.
- Keep neobrutalism styling: thick borders, offset shadows, uppercase labels, bold typography.
- No emoji icons; use Material Symbols like the template.

### Responsive Behavior
- Desktop: two sidebars + main area.
- Mobile: hide sidebars, show bottom nav and main area content.
- Ensure no horizontal scroll at 375px.

### Accessibility
- Maintain text contrast in light mode.
- Ensure focus states for clickable elements.
- Add `cursor-pointer` on interactive cards.

## Data Strategy (Temporary)
Hardcode arrays for:
- Group chats (name, members, color, last active time).
- Friends (name, status, avatar).
- Current user (name, handle, avatar).

## Risks
- Visual mismatch if template details are missed.
- Larger component size for `Sidebar` due to two-column structure.

## Testing
- Manual visual check against template.
- Responsive checks at 375px, 768px, 1024px, 1440px.
- Ensure no layout shift on hover states.

## Open Questions
- Should empty state be replaced when `children` contains actual content?
- Confirm exact placement of `children` relative to empty state shell.

