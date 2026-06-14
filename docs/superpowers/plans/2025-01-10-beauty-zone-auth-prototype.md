# Beauty Zone Auth Prototype — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive login page with CSS Art Cat and an animated user dashboard using React, TypeScript, Tailwind CSS, and Framer Motion

**Architecture:** Standalone React app (`frontend/auth-app/`) built with Vite. Two main routes: `/` (login) and `/dashboard` (user dashboard). Static build output deployed to `frontend/auth/`.

**Tech Stack:** React 18 + TypeScript + Tailwind CSS 3 + Framer Motion + Lucide React + Vite

---

## File Structure

```
frontend/auth-app/
├── public/
├── src/
│   ├── components/
│   │   ├── cat/
│   │   │   ├── InteractiveCat.tsx      # Main cat component (head, eyes, paws)
│   │   │   ├── CatHead.tsx             # Cat head shape + gradient
│   │   │   ├── CatEyes.tsx             # Interactive eyes (track mouse, blink)
│   │   │   └── CatPaws.tsx             # Paws that cover eyes on password input
│   │   ├── login/
│   │   │   ├── LoginPage.tsx           # Login page container
│   │   │   ├── LoginForm.tsx           # Login form with validation
│   │   │   └── RegisterForm.tsx        # Registration form
│   │   └── dashboard/
│   │       ├── DashboardPage.tsx       # Dashboard container
│   │       ├── WelcomeOverlay.tsx     # Confetti + welcome text
│   │       ├── BeautyPointsCard.tsx   # Points counter + progress
│   │       ├── OrdersTimeline.tsx     # Horizontal orders scroll
│   │       ├── OffersCarousel.tsx     # 3D offers carousel
│   │       └── AchievementsGrid.tsx   # Achievement badges grid
│   ├── hooks/
│   │   ├── useMousePosition.ts        # Track mouse for cat eyes
│   │   ├── useAnimatedCounter.ts      # Animated number counter
│   │   └── useConfetti.ts             # Canvas confetti effect
│   ├── data/
│   │   └── mockData.ts                # Mock user, orders, offers, achievements
│   ├── App.tsx                        # Main app with routing
│   ├── index.css                      # Tailwind + custom styles
│   └── main.tsx                       # Entry point
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── package.json
```

---

## Task 1: Project Setup

**Files:**
- Create: `frontend/auth-app/package.json`
- Create: `frontend/auth-app/vite.config.ts`
- Create: `frontend/auth-app/tsconfig.json`
- Create: `frontend/auth-app/postcss.config.js`
- Create: `frontend/auth-app/tailwind.config.js`
- Create: `frontend/auth-app/index.html`

- [ ] **Step 1: Create `package.json` with all dependencies**

```json
{
  "name": "beauty-zone-auth",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^10.18.0",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.2.0",
    "vite": "^5.0.0"
  }
}
```

- [ ] **Step 2: Create Vite config**

```typescript
// frontend/auth-app/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../auth',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
})
```

- [ ] **Step 3: Create TypeScript config**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 4: Create Tailwind config with custom colors**

```js
// frontend/auth-app/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-warm': '#faf7f5',
        'primary': '#8B3A3A',
        'secondary': '#C4A35A',
        'accent': '#F0E6D3',
        'text-dark': '#2C1810',
        'text-mid': '#6B4C3B',
        'text-light': '#9C7A6A',
        'surface': '#ffffff',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Tajawal', 'sans-serif'],
        'en': ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 2px 16px rgba(44, 24, 16, 0.08)',
        'md': '0 8px 40px rgba(44, 24, 16, 0.14)',
        'lg': '0 20px 70px rgba(44, 24, 16, 0.2)',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 5: Create PostCSS and HTML files**

```js
// frontend/auth-app/postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

```html
<!-- frontend/auth-app/index.html -->
<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Beauty Zone — تسجيل الدخول</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## Task 2: Core Setup & Tailwind

**Files:**
- Create: `frontend/auth-app/src/main.tsx`
- Create: `frontend/auth-app/src/App.tsx`
- Create: `frontend/auth-app/src/index.css`
- Create: `frontend/auth-app/src/vite-env.d.ts`

- [ ] **Step 1: Create main entry point**

```tsx
// frontend/auth-app/src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 2: Create App with routing**

```tsx
// frontend/auth-app/src/App.tsx
import { useState } from 'react'
import LoginPage from './components/login/LoginPage'
import DashboardPage from './components/dashboard/DashboardPage'

export type View = 'login' | 'dashboard'

function App() {
  const [view, setView] = useState<View>('login')
  const [user, setUser] = useState<null | { name: string }>(null)

  return (
    <div className="min-h-screen bg-bg-warm font-body text-text-dark">
      {view === 'login' ? (
        <LoginPage onLogin={(userData) => { setUser(userData); setView('dashboard') }} />
      ) : (
        <DashboardPage user={user} onLogout={() => { setUser(null); setView('login') }} />
      )}
    </div>
  )
}

export default App
```

- [ ] **Step 3: Create CSS with Tailwind directives**

```css
/* frontend/auth-app/src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap');

body {
  font-family: 'Tajawal', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

- [ ] **Step 4: Create vite-env.d.ts**

```typescript
// frontend/auth-app/src/vite-env.d.ts
/// <reference types="vite/client" />
```

---

## Task 3: Mock Data

**Files:**
- Create: `frontend/auth-app/src/data/mockData.ts`

- [ ] **Step 1: Create mock data file with all interfaces and data**

```typescript
// frontend/auth-app/src/data/mockData.ts

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  beautyPoints: number;
  nextRewardPoints: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface Order {
  id: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  total: number;
  date: string;
  image: string;
}

export interface Offer {
  title: string;
  description: string;
  code: string;
  discount: number;
  image: string;
  expiryDate: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}

export const mockUser: UserProfile = {
  name: 'سارة أحمد',
  email: 'sarah@example.com',
  phone: '0599123456',
  location: 'غزة',
  beautyPoints: 1250,
  nextRewardPoints: 2000,
  tier: 'gold',
}

export const mockOrders: Order[] = [
  { id: 'BZ-001', status: 'processing', items: 3, total: 450, date: '2026-06-10', image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=200' },
  { id: 'BZ-002', status: 'shipped', items: 2, total: 280, date: '2026-06-05', image: 'https://images.unsplash.com/photo-1595956553067-3ef228d0ad02?w=200' },
  { id: 'BZ-003', status: 'delivered', items: 5, total: 890, date: '2026-05-28', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=200' },
]

export const mockOffers: Offer[] = [
  { title: 'تخفيض 20% على NYX', description: 'استخدمي الكود واحصلي على خصم مميز', code: 'NYX20', discount: 20, image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=200', expiryDate: '2026-07-01' },
  { title: 'هدية مجانية مع L\'Oreal', description: 'مع كل طلب بقيمة 300+ شيكل', code: 'GIFT', discount: 0, image: 'https://images.unsplash.com/photo-1595956553067-3ef228d0ad02?w=200', expiryDate: '2026-06-30' },
  { title: 'خصم 15% على المكياج', description: 'على جميع منتجات MAC', code: 'MAC15', discount: 15, image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=200', expiryDate: '2026-08-15' },
]

export const mockAchievements: Achievement[] = [
  { id: '1', title: 'أول طلب', description: 'أكملي أول طلب لكِ', icon: '🎉', unlocked: true, unlockedDate: '2026-01-15' },
  { id: '2', title: 'عميلة ذهبية', description: 'أكملي 5 طلبات', icon: '⭐', unlocked: true, unlockedDate: '2026-03-20' },
  { id: '3', title: 'مستكشفة', description: 'جربي 10 منتجات مختلفة', icon: '🔍', unlocked: true, unlockedDate: '2026-04-10' },
  { id: '4', title: 'مخلصة', description: 'تابعينا على Instagram', icon: '📱', unlocked: false },
  { id: '5', title: 'VIP', description: 'أنفقي 2000+ شيكل', icon: '💎', unlocked: false },
]
```

---

## Task 4: Custom Hooks

**Files:**
- Create: `frontend/auth-app/src/hooks/useMousePosition.ts`
- Create: `frontend/auth-app/src/hooks/useAnimatedCounter.ts`
- Create: `frontend/auth-app/src/hooks/useConfetti.ts`

- [ ] **Step 1: Create useMousePosition hook**

```typescript
// frontend/auth-app/src/hooks/useMousePosition.ts
import { useState, useEffect, RefObject } from 'react'

interface MousePosition {
  x: number
  y: number
}

export function useMousePosition(ref: RefObject<HTMLElement>): MousePosition {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        setPosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [ref])

  return position
}
```

- [ ] **Step 2: Create useAnimatedCounter hook**

```typescript
// frontend/auth-app/src/hooks/useAnimatedCounter.ts
import { useState, useEffect } from 'react'

export function useAnimatedCounter(target: number, duration: number = 2000): number {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(ease * target)
      
      setCount(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(target)
      }
    }

    requestAnimationFrame(animate)
  }, [target, duration])

  return count
}
```

- [ ] **Step 3: Create useConfetti hook**

```typescript
// frontend/auth-app/src/hooks/useConfetti.ts
import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  speedX: number
  speedY: number
}

export function useConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = ['#C4A35A', '#E8A4B8', '#F0E6D3', '#8B3A3A', '#C2856B']
    const particles: Particle[] = []

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        speedX: 0,
        speedY: 0,
      })
    }

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.2 // gravity
        p.vx *= 0.99 // air resistance
        p.vy *= 0.99

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    const timer = setTimeout(() => {
      cancelAnimationFrame(animationId)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }, 3000)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return canvasRef
}
```

---

## Task 5: Cat Components

**Files:**
- Create: `frontend/auth-app/src/components/cat/InteractiveCat.tsx`
- Create: `frontend/auth-app/src/components/cat/CatHead.tsx`
- Create: `frontend/auth-app/src/components/cat/CatEyes.tsx`
- Create: `frontend/auth-app/src/components/cat/CatPaws.tsx`

- [ ] **Step 1: Create CatEyes component**

```tsx
// frontend/auth-app/src/components/cat/CatEyes.tsx
import { useEffect, useState } from 'react'

interface CatEyesProps {
  mouseX: number
  mouseY: number
  isPasswordFocused: boolean
}

function CatEyes({ mouseX, mouseY, isPasswordFocused }: CatEyesProps) {
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const maxOffset = 6
    const angle = Math.atan2(mouseY - 50, mouseX - 50)
    const distance = Math.min(Math.sqrt((mouseX - 50) ** 2 + (mouseY - 50) ** 2) / 10, maxOffset)
    
    setEyePosition({
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    })
  }, [mouseX, mouseY])

  if (isPasswordFocused) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center gap-3">
      {/* Left Eye */}
      <div className="w-6 h-8 bg-white rounded-full relative overflow-hidden">
        <div 
          className="w-3 h-3 bg-text-dark rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200"
          style={{ transform: `translate(calc(-50% + ${eyePosition.x}px), calc(-50% + ${eyePosition.y}px))` }}
        >
          <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 left-0.5" />
        </div>
      </div>
      
      {/* Right Eye */}
      <div className="w-6 h-8 bg-white rounded-full relative overflow-hidden">
        <div 
          className="w-3 h-3 bg-text-dark rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200"
          style={{ transform: `translate(calc(-50% + ${eyePosition.x}px), calc(-50% + ${eyePosition.y}px))` }}
        >
          <div className="w-1 h-1 bg-white rounded-full absolute top-0.5 left-0.5" />
        </div>
      </div>
    </div>
  )
}

export default CatEyes
```

- [ ] **Step 2: Create CatPaws component**

```tsx
// frontend/auth-app/src/components/cat/CatPaws.tsx
interface CatPawsProps {
  isVisible: boolean
}

function CatPaws({ isVisible }: CatPawsProps) {
  if (!isVisible) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center gap-4 transition-opacity duration-300">
      <div className="w-5 h-12 bg-gradient-to-b from-primary to-[#6B2F2F] rounded-full transform -rotate-12 -translate-x-2" />
      <div className="w-5 h-12 bg-gradient-to-b from-primary to-[#6B2F2F] rounded-full transform rotate-12 translate-x-2" />
    </div>
  )
}

export default CatPaws
```

- [ ] **Step 3: Create CatHead component**

```tsx
// frontend/auth-app/src/components/cat/CatHead.tsx
import { useRef } from 'react'
import CatEyes from './CatEyes'
import CatPaws from './CatPaws'

interface CatHeadProps {
  mouseX: number
  mouseY: number
  isPasswordFocused: boolean
}

function CatHead({ mouseX, mouseY, isPasswordFocused }: CatHeadProps) {
  const headRef = useRef<HTMLDivElement>(null)

  return (
    <div 
      ref={headRef}
      className="relative w-32 h-32 mx-auto mb-4"
    >
      {/* Main Head */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary to-[#B8972E] rounded-full shadow-lg">
        {/* Ears */}
        <div className="absolute -top-3 -left-1 w-0 h-0 border-l-[15px] border-r-[15px] border-b-[30px] border-l-transparent border-r-transparent border-b-secondary transform -rotate-12" />
        <div className="absolute -top-3 -right-1 w-0 h-0 border-l-[15px] border-r-[15px] border-b-[30px] border-l-transparent border-r-transparent border-b-secondary transform rotate-12" />
        
        {/* Inner ears */}
        <div className="absolute -top-1 left-2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[16px] border-l-transparent border-r-transparent border-b-pink-300 transform -rotate-12" />
        <div className="absolute -top-1 right-2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[16px] border-l-transparent border-r-transparent border-b-pink-300 transform rotate-12" />

        {/* Eyes */}
        <CatEyes mouseX={mouseX} mouseY={mouseY} isPasswordFocused={isPasswordFocused} />

        {/* Paws covering eyes */}
        <CatPaws isVisible={isPasswordFocused} />

        {/* Nose and mouth */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-2 h-2 bg-pink-400 rounded-full mb-1" />
          <div className="flex gap-0.5">
            <div className="w-3 h-2 border-b-2 border-text-dark rounded-full transform -rotate-12" />
            <div className="w-3 h-2 border-b-2 border-text-dark rounded-full transform rotate-12" />
          </div>
        </div>

        {/* Whiskers */}
        <div className="absolute top-1/2 -left-4 w-8 h-0.5 bg-text-dark/20 rotate-12" />
        <div className="absolute top-1/2 -left-4 w-8 h-0.5 bg-text-dark/20" />
        <div className="absolute top-1/2 -right-4 w-8 h-0.5 bg-text-dark/20 -rotate-12" />
        <div className="absolute top-1/2 -right-4 w-8 h-0.5 bg-text-dark/20" />
      </div>
    </div>
  )
}

export default CatHead
```

- [ ] **Step 4: Create InteractiveCat component**

```tsx
// frontend/auth-app/src/components/cat/InteractiveCat.tsx
import { useRef, useState } from 'react'
import CatHead from './CatHead'

interface InteractiveCatProps {
  isPasswordFocused: boolean
}

function InteractiveCat({ isPasswordFocused }: InteractiveCatProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      })
    }
  }

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full flex justify-center py-8 cursor-default"
    >
      <CatHead 
        mouseX={mousePosition.x} 
        mouseY={mousePosition.y} 
        isPasswordFocused={isPasswordFocused} 
      />
    </div>
  )
}

export default InteractiveCat
```

---

## Task 6: Login Page & Form

**Files:**
- Create: `frontend/auth-app/src/components/login/LoginForm.tsx`
- Create: `frontend/auth-app/src/components/login/RegisterForm.tsx`
- Create: `frontend/auth-app/src/components/login/LoginPage.tsx`

- [ ] **Step 1: Create LoginForm**

```tsx
// frontend/auth-app/src/components/login/LoginForm.tsx
import { useState } from 'react'
import { Eye, EyeOff, Phone, Mail, Lock } from 'lucide-react'

interface LoginFormProps {
  onLogin: (user: { name: string }) => void
  onSwitchToRegister: () => void
}

function LoginForm({ onLogin, onSwitchToRegister }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin({ name: 'سارة أحمد' })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="relative">
        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full pr-10 pl-4 py-3 bg-white/80 border-2 border-transparent focus:border-secondary rounded-xl outline-none transition-all duration-300 text-text-dark placeholder:text-text-light"
          dir="rtl"
        />
      </div>

      <div className="relative">
        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="كلمة المرور"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          className="w-full pr-10 pl-12 py-3 bg-white/80 border-2 border-transparent focus:border-secondary rounded-xl outline-none transition-all duration-300 text-text-dark placeholder:text-text-light"
          dir="rtl"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text-mid transition-colors"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      <button
        type="submit"
        className="w-full py-3 px-6 bg-gradient-to-r from-primary to-[#A03A3A] text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200"
      >
        تسجيل الدخول
      </button>

      <button
        type="button"
        onClick={onSwitchToRegister}
        className="w-full text-center text-text-mid hover:text-primary transition-colors text-sm"
      >
        لا تملكين حساب؟ <span className="font-bold underline">أنشئي حساب</span>
      </button>
    </form>
  )
}

export default LoginForm
```

- [ ] **Step 2: Create RegisterForm**

```tsx
// frontend/auth-app/src/components/login/RegisterForm.tsx
import { useState } from 'react'
import { User, Phone, Mail, Lock, MapPin } from 'lucide-react'

interface RegisterFormProps {
  onRegister: (user: { name: string }) => void
  onSwitchToLogin: () => void
}

function RegisterForm({ onRegister, onSwitchToLogin }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', location: '', password: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onRegister({ name: formData.name })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
        <input
          type="text"
          placeholder="الاسم الكامل"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full pr-10 pl-4 py-3 bg-white/80 border-2 border-transparent focus:border-secondary rounded-xl outline-none transition-all duration-300 text-text-dark placeholder:text-text-light"
          dir="rtl"
        />
      </div>

      <div className="relative">
        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
        <input
          type="tel"
          placeholder="رقم الهاتف"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full pr-10 pl-4 py-3 bg-white/80 border-2 border-transparent focus:border-secondary rounded-xl outline-none transition-all duration-300 text-text-dark placeholder:text-text-light"
          dir="rtl"
        />
      </div>

      <div className="relative">
        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full pr-10 pl-4 py-3 bg-white/80 border-2 border-transparent focus:border-secondary rounded-xl outline-none transition-all duration-300 text-text-dark placeholder:text-text-light"
          dir="rtl"
        />
      </div>

      <div className="relative">
        <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
        <select
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full pr-10 pl-4 py-3 bg-white/80 border-2 border-transparent focus:border-secondary rounded-xl outline-none transition-all duration-300 text-text-dark appearance-none cursor-pointer"
          dir="rtl"
        >
          <option value="">اختر موقعك</option>
          <option value="غزة">غزة</option>
          <option value="جنوب">جنوب</option>
          <option value="نصيرات">نصيرات</option>
          <option value="دير البلح">دير البلح</option>
          <option value="رفح">رفح</option>
          <option value="خانيونس">خانيونس</option>
        </select>
      </div>

      <div className="relative">
        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="كلمة المرور"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          className="w-full pr-10 pl-12 py-3 bg-white/80 border-2 border-transparent focus:border-secondary rounded-xl outline-none transition-all duration-300 text-text-dark placeholder:text-text-light"
          dir="rtl"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text-mid transition-colors"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      <button
        type="submit"
        className="w-full py-3 px-6 bg-gradient-to-r from-primary to-[#A03A3A] text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200"
      >
        إنشاء حساب
      </button>

      <button
        type="button"
        onClick={onSwitchToLogin}
        className="w-full text-center text-text-mid hover:text-primary transition-colors text-sm"
      >
        لديكِ حساب؟ <span className="font-bold underline">تسجيل الدخول</span>
      </button>
    </form>
  )
}

export default RegisterForm
```

- [ ] **Step 3: Create LoginPage**

```tsx
// frontend/auth-app/src/components/login/LoginPage.tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import InteractiveCat from '../cat/InteractiveCat'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

interface LoginPageProps {
  onLogin: (user: { name: string }) => void
}

function LoginPage({ onLogin }: LoginPageProps) {
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-amber-50/80 via-white to-rose-50/60">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-8 w-full max-w-md z-10"
      >
        {/* Cat Character */}
        <InteractiveCat isPasswordFocused={isPasswordFocused} />

        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold text-text-dark mb-2">
            {isRegistering ? 'إنشاء حساب' : 'تسجيل الدخول'}
          </h1>
          <p className="text-text-light text-sm">
            {isRegistering ? 'انضمي إلينا واستمتعي بمميزات حصرية' : 'أهلاً بعودتك، جمالك ينتظرك'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isRegistering ? (
            <RegisterForm 
              key="register"
              onRegister={onLogin}
              onSwitchToLogin={() => setIsRegistering(false)}
            />
          ) : (
            <LoginForm 
              key="login"
              onLogin={onLogin}
              onSwitchToRegister={() => setIsRegistering(true)}
            />
          )}
        </AnimatePresence>

        <div className="mt-6 text-center">
          <p className="text-text-light/60 text-xs"> Beauty Zone 2025</p>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage
```

---

## Task 7: Dashboard Components

**Files:**
- Create: `frontend/auth-app/src/components/dashboard/WelcomeOverlay.tsx`
- Create: `frontend/auth-app/src/components/dashboard/BeautyPointsCard.tsx`
- Create: `frontend/auth-app/src/components/dashboard/OrdersTimeline.tsx`
- Create: `frontend/auth-app/src/components/dashboard/OffersCarousel.tsx`
- Create: `frontend/auth-app/src/components/dashboard/AchievementsGrid.tsx`
- Create: `frontend/auth-app/src/components/dashboard/DashboardPage.tsx`

- [ ] **Step 1: Create WelcomeOverlay**

```tsx
// frontend/auth-app/src/components/dashboard/WelcomeOverlay.tsx
import { motion } from 'framer-motion'
import { useConfetti } from '../../hooks/useConfetti'

interface WelcomeOverlayProps {
  userName: string
  onComplete: () => void
}

function WelcomeOverlay({ userName, onComplete }: WelcomeOverlayProps) {
  const canvasRef = useConfetti()

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 3, duration: 0.8 }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-warm/90 backdrop-blur-sm"
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
        className="text-center z-10"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-6xl mb-4"
        >
          ✨
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-3xl font-display font-bold text-text-dark mb-2"
        >
          أهلاً وسهلاً، {userName}
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-text-mid"
        >
          جمالك يستاهل الأفضل 💎
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

export default WelcomeOverlay
```

- [ ] **Step 2: Create BeautyPointsCard**

```tsx
// frontend/auth-app/src/components/dashboard/BeautyPointsCard.tsx
import { motion } from 'framer-motion'
import { Crown } from 'lucide-react'
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter'

interface BeautyPointsCardProps {
  points: number
  nextRewardPoints: number
  tier: string
}

function BeautyPointsCard({ points, nextRewardPoints, tier }: BeautyPointsCardProps) {
  const animatedPoints = useAnimatedCounter(points, 2000)
  const progress = (points / nextRewardPoints) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-md border border-white/50"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-secondary to-amber-400 rounded-full flex items-center justify-center">
          <Crown className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-text-dark">نقاط الجمال</h3>
          <p className="text-text-light text-sm">الفئة: {tier === 'gold' ? 'ذهبية' : tier}</p>
        </div>
      </div>

      <div className="text-center mb-4">
        <motion.span
          className="text-4xl font-display font-bold text-secondary"
        >
          {animatedPoints}
        </motion.span>
        <span className="text-text-light text-sm mr-2">نقطة</span>
      </div>

      <div className="relative h-4 bg-accent/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-secondary to-amber-400 rounded-full"
        />
      </div>
      <p className="text-text-light text-xs mt-2 text-center">
        {nextRewardPoints - points} نقطة للمكافأة التالية
      </p>
    </motion.div>
  )
}

export default BeautyPointsCard
```

- [ ] **Step 3: Create OrdersTimeline**

```tsx
// frontend/auth-app/src/components/dashboard/OrdersTimeline.tsx
import { motion } from 'framer-motion'
import { Package, Truck, CheckCircle } from 'lucide-react'
import type { Order } from '../../data/mockData'

interface OrdersTimelineProps {
  orders: Order[]
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'processing': return <Package className="w-5 h-5" />
    case 'shipped': return <Truck className="w-5 h-5" />
    case 'delivered': return <CheckCircle className="w-5 h-5" />
    default: return <Package className="w-5 h-5" />
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'processing': return 'قيد التجهيز'
    case 'shipped': return 'تم الشحن'
    case 'delivered': return 'تم التوصيل'
    default: return status
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'processing': return 'bg-amber-100 text-amber-700'
    case 'shipped': return 'bg-blue-100 text-blue-700'
    case 'delivered': return 'bg-green-100 text-green-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

function OrdersTimeline({ orders }: OrdersTimelineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-md border border-white/50"
    >
      <h3 className="font-bold text-text-dark mb-4">طلباتي</h3>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2">
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            className="flex-shrink-0 w-64 bg-white/50 rounded-xl p-4 border border-white/30"
          >
            <div className="flex items-center justify-between mb-3">
              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                {getStatusLabel(order.status)}
              </span>
              <span className="text-text-light text-xs">{order.id}</span>
            </div>
            <div className="flex items-center gap-3">
              <img src={order.image} alt={order.id} className="w-12 h-12 rounded-lg object-cover" />
              <div>
                <p className="text-text-dark font-medium text-sm">{order.items} منتجات</p>
                <p className="text-secondary font-bold">{order.total} ₪</p>
              </div>
            </div>
            <p className="text-text-light text-xs mt-2">{order.date}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default OrdersTimeline
```

- [ ] **Step 4: Create OffersCarousel**

```tsx
// frontend/auth-app/src/components/dashboard/OffersCarousel.tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Copy } from 'lucide-react'
import type { Offer } from '../../data/mockData'

interface OffersCarouselProps {
  offers: Offer[]
}

function OffersCarousel({ offers }: OffersCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextOffer = () => {
    setCurrentIndex((prev) => (prev + 1) % offers.length)
  }

  const prevOffer = () => {
    setCurrentIndex((prev) => (prev - 1 + offers.length) % offers.length)
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-md border border-white/50"
    >
      <h3 className="font-bold text-text-dark mb-4">عروض خاصة</h3>
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-4"
          >
            <img src={offers[currentIndex].image} alt={offers[currentIndex].title} className="w-24 h-24 rounded-xl object-cover" />
            <div className="flex-1">
              <h4 className="font-bold text-text-dark mb-1">{offers[currentIndex].title}</h4>
              <p className="text-text-light text-sm mb-3">{offers[currentIndex].description}</p>
              <div className="flex items-center gap-2">
                <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-bold">
                  {offers[currentIndex].code}
                </span>
                <button
                  onClick={() => copyCode(offers[currentIndex].code)}
                  className="p-1.5 bg-white/50 rounded-lg hover:bg-white/80 transition-colors"
                >
                  <Copy className="w-4 h-4 text-text-mid" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-center gap-4 mt-4">
        <button onClick={prevOffer} className="p-2 bg-white/50 rounded-full hover:bg-white/80 transition-colors">
          <ChevronRight className="w-5 h-5 text-text-dark" />
        </button>
        <div className="flex gap-1.5">
          {offers.map((_, index) => (
            <div key={index} className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-secondary' : 'bg-accent'}`} />
          ))}
        </div>
        <button onClick={nextOffer} className="p-2 bg-white/50 rounded-full hover:bg-white/80 transition-colors">
          <ChevronLeft className="w-5 h-5 text-text-dark" />
        </button>
      </div>
    </motion.div>
  )
}

export default OffersCarousel
```

- [ ] **Step 5: Create AchievementsGrid**

```tsx
// frontend/auth-app/src/components/dashboard/AchievementsGrid.tsx
import { motion } from 'framer-motion'
import type { Achievement } from '../../data/mockData'
import { Lock } from 'lucide-react'

interface AchievementsGridProps {
  achievements: Achievement[]
}

function AchievementsGrid({ achievements }: AchievementsGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-md border border-white/50"
    >
      <h3 className="font-bold text-text-dark mb-4">إنجازاتي</h3>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            whileHover={{ scale: 1.1 }}
            className={`relative flex flex-col items-center p-3 rounded-xl transition-all cursor-default ${
              achievement.unlocked 
                ? 'bg-gradient-to-br from-secondary/20 to-amber-400/20 border-2 border-secondary/30' 
                : 'bg-white/30 border-2 border-dashed border-text-light/20'
            }`}
          >
            <div className="text-3xl mb-2">{achievement.unlocked ? achievement.icon : <Lock className="w-8 h-8 text-text-light/50" />}</div>
            <span className={`text-xs text-center font-medium ${achievement.unlocked ? 'text-text-dark' : 'text-text-light'}`}>
              {achievement.title}
            </span>
            {achievement.unlocked && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default AchievementsGrid
```

- [ ] **Step 6: Create DashboardPage**

```tsx
// frontend/auth-app/src/components/dashboard/DashboardPage.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { LogOut, User } from 'lucide-react'
import WelcomeOverlay from './WelcomeOverlay'
import BeautyPointsCard from './BeautyPointsCard'
import OrdersTimeline from './OrdersTimeline'
import OffersCarousel from './OffersCarousel'
import AchievementsGrid from './AchievementsGrid'
import { mockUser, mockOrders, mockOffers, mockAchievements } from '../../data/mockData'

interface DashboardPageProps {
  user: { name: string } | null
  onLogout: () => void
}

function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const [showWelcome, setShowWelcome] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/80 via-white to-rose-50/60">
      {showWelcome && (
        <WelcomeOverlay 
          userName={user?.name || mockUser.name} 
          onComplete={() => setShowWelcome(false)} 
        />
      )}

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary to-amber-400 rounded-full flex items-center justify-center shadow-md">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-text-dark">
                {user?.name || mockUser.name}
              </h1>
              <p className="text-text-light text-sm">أهلاً بكِ في بيوتي زون</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 text-text-mid hover:text-primary hover:bg-white/80 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">تسجيل الخروج</span>
          </button>
        </motion.div>

        {/* Main Grid */}
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <BeautyPointsCard
                points={mockUser.beautyPoints}
                nextRewardPoints={mockUser.nextRewardPoints}
                tier={mockUser.tier}
              />
            </div>
            <div className="md:col-span-2">
              <OffersCarousel offers={mockOffers} />
            </div>
          </div>

          <OrdersTimeline orders={mockOrders} />
          <AchievementsGrid achievements={mockAchievements} />
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pb-8">
          <p className="text-text-light/60 text-sm"> Beauty Zone 2025</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
```

---

## Task 8: Build & Integration

**Files:**
- Modify: `frontend/auth-app/vite.config.ts`

- [ ] **Step 1: Update Vite config for static build**

```typescript
// frontend/auth-app/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../auth',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  base: './',
})
```

- [ ] **Step 2: Build the project**

Run: `cd frontend/auth-app && npm install`
Run: `cd frontend/auth-app && npm run build`

- [ ] **Step 3: Verify build output in `frontend/auth/`**

Check that `frontend/auth/index.html` exists and all assets are present.

- [ ] **Step 4: Update `frontend/index.html` to link to auth app**

Add a link or redirect from the login button to `/auth/index.html`

---

## Verification Checklist

- [ ] `npm install` completes without errors
- [ ] `npm run build` completes and outputs to `frontend/auth/`
- [ ] Login page renders with cat character
- [ ] Cat eyes track mouse movement
- [ ] Cat covers eyes when password field is focused
- [ ] Login form transitions to dashboard on submit
- [ ] Dashboard shows confetti animation on entry
- [ ] Welcome overlay fades after 3 seconds
- [ ] Beauty points counter animates from 0 to 1250
- [ ] Orders timeline displays horizontally on mobile
- [ ] Offers carousel cycles through offers
- [ ] Achievement badges show locked/unlocked states
- [ ] Logout button returns to login page
- [ ] All buttons have hover/tap effects
- [ ] RTL layout works correctly
- [ ] Responsive at 320px, 768px, 1024px, 1440px
