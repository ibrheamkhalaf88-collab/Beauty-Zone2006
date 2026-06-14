# Beauty Zone Auth Prototype — Design Spec

**Date:** 2025-01-10  
**Project:** Beauty Zone (بيوتي زون) — Interactive Auth & Dashboard Prototype  
**Status:** Approved  
**Author:** Frontend Engineering + UX/UI Design  

---

## 1. Overview

A premium, interactive login and user dashboard prototype for the Beauty Zone e-commerce platform. Built with React 18 + TypeScript + Tailwind CSS + Framer Motion to deliver a "wow" experience that matches the existing luxury brand identity (warm terracotta, gold, burgundy).

The prototype includes:
1. **Interactive CSS Art Cat Login** — a playful, animated cat character that reacts to user input (cursor tracking, password hide animation)
2. **Animated User Dashboard** — "Beauty Zone" dashboard with confetti entry, beauty points counter, orders timeline, personalized offers, and achievement badges
3. **Seamless integration** with the existing vanilla JS website via static build

---

## 2. Goals

- 🎯 Deliver a premium, Apple/Linear quality UX for login & user dashboard
- 🎨 Maintain visual consistency with existing warm terracotta + gold theme
- ✨ Provide delightful micro-interactions (hover, tap, entrance animations)
- 🐱 Create an unforgettable first impression with the interactive cat character
- 📱 Fully responsive (mobile → desktop) with RTL support
- 🔄 Build as reusable React components for future integration

---

## 3. Design System

### 3.1 Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--bg-warm` | #faf7f5 | Page background |
| `--primary` | #8B3A3A | Primary buttons, accents |
| `--secondary` | #C4A35A | Gold accents, highlights |
| `--accent` | #F0E6D3 | Champagne, subtle backgrounds |
| `--text-dark` | #2C1810 | Primary text |
| `--text-mid` | #6B4C3B | Secondary text |
| `--text-light` | #9C7A6A | Muted text |
| `--surface` | #ffffff | Card surfaces |
| `--glass` | `rgba(255,255,255,0.08)` | Glassmorphism overlay |

### 3.2 Typography

- **Headings:** Playfair Display (serif), 400–700 weight
- **Body/UI:** Tajawal, 300–700 weight
- **English labels:** DM Sans, 400–500 weight

### 3.3 Spacing Scale

```
space-1: 4px
space-2: 8px
space-3: 12px
space-4: 16px
space-6: 24px
space-8: 32px
space-10: 40px
space-12: 48px
```

### 3.4 Shadows

```
shadow-sm: 0 2px 16px rgba(44, 24, 16, 0.08)
shadow-md: 0 8px 40px rgba(44, 24, 16, 0.14)
shadow-lg: 0 20px 70px rgba(44, 24, 16, 0.2)
```

---

## 4. Component Architecture

### 4.1 Login Page

```
LoginPage (page container)
├── LoginModal (glassmorphism overlay)
│   ├── InteractiveCat (CSS Art Cat)
│   │   ├── CatHead (circle with gradient)
│   │   ├── CatEars (animated triangles)
│   │   ├── CatEyes (interactive, track mouse)
│   │   └── CatNose/Mouth (smile animation on success)
│   ├── LoginForm
│   │   ├── PhoneInput / EmailInput
│   │   ├── PasswordInput (triggers cat eye cover)
│   │   └── SubmitButton (3D push effect)
│   └── RegisterForm (tab switch)
│       ├── NameInput
│       ├── PhoneInput
│       ├── EmailInput
│       ├── LocationSelect
│       └── PasswordInput
```

### 4.2 Dashboard Page

```
DashboardPage
├── WelcomeOverlay (confetti + animated text)
├── DashboardHeader (user greeting)
├── BeautyPointsCard
│   ├── AnimatedCounter (0 → points)
│   └── CircularProgressBar
├── OrdersTimeline
│   └── OrderCard × N (horizontal scroll)
├── OffersCarousel
│   └── OfferCard × N (3D carousel)
└── AchievementsGrid
    └── AchievementBadge × N (locked/unlocked)
```

---

## 5. Interactive Behaviors

### 5.1 CSS Art Cat (InteractiveCat)

| State | Behavior |
|---|---|
| **Idle** | Eyes follow cursor smoothly (400ms ease-out) |
| **Hover input** | Ears perk up (slight rotation), eyes widen |
| **Typing password** | Cat "covers eyes" with paws (paws move up, eyes disappear) |
| **Focus email** | Cat "looks" at email field (head tilts slightly) |
| **Success** | Cat smiles, golden pulse effect on head, sparkle particles |
| **Error** | Cat shakes head, ears droop, red tint on eyes |

**Implementation:** SVG/CSS-based cat drawn with divs. JavaScript controls transforms (rotate, translate) via refs. No external assets.

### 5.2 Entry Animations (Dashboard)

| Element | Animation |
|---|---|
| **Confetti** | Canvas-based burst of gold/pink particles from center, falling with gravity |
| **Welcome text** | Letter-by-letter reveal (staggered, 30ms per char) |
| **Cards** | Staggered fade-in + translateY(30px → 0), 100ms delay between cards |
| **Counter** | Animated count-up from 0 to target over 2s with easing |
| **Progress bar** | Stroke-dashoffset animation (1.5s ease-out) |

### 5.3 Hover & Tap Effects

| Element | Hover | Tap/Active |
|---|---|---|
| Buttons | scale(1.02), shadow elevation, shimmer | scale(0.98), 3D push |
| Cards | translateY(-4px), shadow-lg | — |
| Badges | scale(1.1), glow effect | — |
| Timeline items | Highlight border, scale(1.02) | — |

---

## 6. Data Model (Mock Data)

```typescript
interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  beautyPoints: number;
  nextRewardPoints: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

interface Order {
  id: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  total: number;
  date: string;
  image: string;
}

interface Offer {
  title: string;
  description: string;
  code: string;
  discount: number;
  image: string;
  expiryDate: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}
```

---

## 7. Responsive Breakpoints

```
Mobile:   < 640px  (single column, full-width cards)
Tablet:   640–1024px (2-column grid)
Desktop:  > 1024px  (3-column grid, sidebar layout)
```

---

## 8. Accessibility

- All interactive elements keyboard-accessible (Tab, Enter, Space)
- ARIA labels for screen readers
- Focus rings visible (gold outline, 2px offset)
- Respect `prefers-reduced-motion` (disable heavy animations)
- Color contrast ≥ 4.5:1 for all text

---

## 9. Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | ^18.2.0 | UI framework |
| TypeScript | ^5.0.0 | Type safety |
| Tailwind CSS | ^3.4.0 | Styling |
| Framer Motion | ^10.0.0 | Animations |
| Lucide React | ^0.400.0 | Icons |
| Vite | ^5.0.0 | Build tool |

---

## 10. Integration with Existing Site

The prototype is built as a **standalone React app** in `frontend/auth-app/`. Integration options:

1. **Static Build (Recommended):** Build to static files, output to `frontend/auth/`, serve via existing Node.js server
2. **iframe:** Embed `auth/index.html` inside an iframe in the existing modal
3. **Redirect:** Navigate to `auth/index.html` for full-page experience

---

## 11. File Structure

```
frontend/auth-app/
├── public/
│   └── (static assets)
├── src/
│   ├── components/
│   │   ├── cat/
│   │   │   ├── InteractiveCat.tsx
│   │   │   ├── CatHead.tsx
│   │   │   ├── CatEyes.tsx
│   │   │   └── CatPaws.tsx
│   │   ├── login/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   └── dashboard/
│   │       ├── DashboardPage.tsx
│   │       ├── WelcomeOverlay.tsx
│   │       ├── BeautyPointsCard.tsx
│   │       ├── OrdersTimeline.tsx
│   │       ├── OffersCarousel.tsx
│   │       └── AchievementsGrid.tsx
│   ├── hooks/
│   │   ├── useMousePosition.ts
│   │   ├── useAnimatedCounter.ts
│   │   └── useConfetti.ts
│   ├── data/
│   │   └── mockData.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

---

## 12. Verification Checklist

- [ ] Cat eyes track cursor smoothly
- [ ] Cat covers eyes when typing password
- [ ] Login form validates inputs
- [ ] Dashboard shows confetti on entry
- [ ] Counter animates from 0 to target
- [ ] Orders timeline scrolls horizontally on mobile
- [ ] All buttons have hover + active states
- [ ] RTL layout works correctly
- [ ] Responsive at 320px, 768px, 1024px, 1440px
- [ ] No console errors

---

**Next Step:** Implementation plan via `writing-plans` skill.
