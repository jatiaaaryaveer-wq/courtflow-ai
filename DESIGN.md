# Design Brief

## Direction

CourtFlow AI — Premium dark-mode sports dashboard for live tennis tournament control, optimized for fast decision-making by tournament organizers.

## Tone

Refined control room energy: confident, zero-fluff, high-contrast clarity built for real-time match scheduling under time pressure.

## Differentiation

Gold accent used strategically for urgency/priority (recommended matches, delayed status) instead of generic secondary blue, creating a distinctive premium sports feel.

## Color Palette

| Token           | OKLCH        | Role                          |
|-----------------|--------------|-------------------------------|
| background      | 0.12 0.01 0  | Deep charcoal base            |
| foreground      | 0.96 0.01 0  | Clean white text              |
| card            | 0.16 0.02 0  | Elevated surface              |
| primary         | 0.68 0.16 140| Emerald green (active/live)   |
| accent          | 0.78 0.18 50 | Gold (priority/urgency)       |
| muted           | 0.22 0.01 0  | Neutral inactive state        |
| destructive     | 0.65 0.22 25 | Red (alerts/delays)           |

## Typography

- Display: Space Grotesk — headlines, court labels, tournament name
- Body: Plus Jakarta Sans — match details, player names, status text
- Scale: h1 `text-3xl font-display font-bold`, h2 `text-xl font-display`, label `text-sm font-body font-medium`, body `text-base font-body`

## Elevation & Depth

Multi-layer card hierarchy: dark background → elevated card surfaces with subtle border and shadow → interactive hover states with opacity lift. Sidebar darker than main content.

## Structural Zones

| Zone         | Background      | Border                | Notes                                           |
|--------------|-----------------|----------------------|-------------------------------------------------|
| Header       | bg-card         | border-b border-border| Tournament time counter, court count, action bar|
| Sidebar      | bg-sidebar      | border-r sidebar-border| Navigation tabs (Dashboard, Courts, Matches, etc)|
| Content      | bg-background   | —                    | 4-column responsive grid for court cards      |
| Footer       | bg-card         | border-t border-border| Court utilisation %, tournament status hint   |

## Spacing & Rhythm

Dense information architecture with 1rem gaps between sections, 0.5rem micro-spacing within cards. Alternating `bg-muted/10` for table row rhythm. Mobile-first grid: 1 court card at `sm:`, 2 at `md:`, 4 at `lg:`.

## Component Patterns

- Buttons: Emerald primary (active actions), gold accent (priority/override), muted (secondary). Rounded `lg` (0.625rem), no shadow on default, `shadow-card` on hover.
- Cards: Emerald border on active matches, muted border on idle. `rounded-lg`, `bg-card`, `shadow-card`. Inside: title `text-foreground`, metadata `text-muted-foreground`.
- Badges: Status badges (`status-active`, `status-ready`, `status-pending`, `status-delayed`) as inline `badge-sm`. Match queue shows priority score 0–100 in small gold badge.
- Tables: Striped with `hover:bg-muted/20`, `match-row` class for consistent hover transition.

## Motion

- Entrance: `slide-up` 0.3s ease-out for modals, match recommendations, action confirmations.
- Hover: `transition-smooth` (0.3s cubic-bezier) on buttons, cards, rows — opacity lift + subtle shadow increase.
- Decorative: `pulse-urgent` (2s infinite) on delayed/urgent match badges to draw attention.

## Constraints

- No gradients (solid colors only for clarity)
- No bounce animations (professional control room tone)
- Icons must be high-contrast (SVG 24px, emerald/gold/white only)
- Mobile: no horizontal scroll, cards stack vertically on < 768px

## Signature Detail

Gold accent for priority scores and urgent matches elevates the dashboard from generic tournament software to premium sports control experience — a deliberate nod to tournament trophy finishes and elite-tier scheduling intelligence.
