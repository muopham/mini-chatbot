# ChatBot – Neobrutalism

A fully responsive chat application built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **ESLint**, and **Prettier**.

## Tech Stack

| Tool | Version |
|------|---------|
| Next.js | 14.2.3 (App Router) |
| React | 18 |
| TypeScript | 5 |
| Tailwind CSS | 3.4 |
| ESLint | 8 + eslint-config-next |
| Prettier | 3 + prettier-plugin-tailwindcss |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (fonts, metadata)
│   ├── page.tsx            # Redirects → /login
│   ├── globals.css         # Tailwind + neobrutalism utilities
│   ├── login/
│   │   └── page.tsx        # Login screen (desktop)
│   ├── signup/
│   │   └── page.tsx        # Sign-up screen
│   └── dashboard/
│       ├── layout.tsx      # Dashboard layout (header + sidebar + bottom nav)
│       └── page.tsx        # Chat view
├── components/
│   ├── ui/
│   │   └── Logo.tsx        # Reusable logo component
│   ├── layout/
│   │   ├── DashboardHeader.tsx
│   │   ├── Sidebar.tsx
│   │   └── BottomNav.tsx   # Mobile bottom navigation
│   └── chat/
│       ├── ChatWindow.tsx  # Messages thread + input
│       └── InfoPanel.tsx   # Right panel (profile, files, media)
├── lib/
│   ├── data.ts             # Mock data (users, messages, files)
│   └── utils.ts            # cn() helper (clsx + tailwind-merge)
└── types/
    └── index.ts            # TypeScript interfaces
```

## Pages / Routes

| Route | Description |
|-------|-------------|
| `/` | Redirects to `/login` |
| `/login` | Login screen |
| `/signup` | Create account screen |
| `/dashboard` | Chat dashboard (3-column layout) |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Lint
npm run lint

# Format with Prettier
npm run format
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Design System – Neobrutalism

All design tokens are defined in `tailwind.config.ts`:

| Token | Value |
|-------|-------|
| `accent-yellow` | `#FFD60A` |
| `accent-orange` | `#FF7A00` |
| `primary` | `#ec5b13` |
| `background-light` | `#FFF9E6` |

Custom CSS utility classes in `globals.css`:

- `.neo-border` – 4px solid black border  
- `.neo-shadow` – 8px hard offset shadow  
- `.neo-shadow-sm` – 4px hard offset shadow  
- `.neo-shadow-hover` – hover translate + shadow shrink  
- `.neo-shadow-active` – active translate + shadow remove  
- `.editorial-shadow` – 4px dark editorial shadow  
- `.editorial-active` – active press effect  
