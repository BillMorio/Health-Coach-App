# Lumina Design System: "Operations Terminal" 

This document defines the visual language and technical implementation of the Lumina dashboard. It is designed to be copy-pasted into new projects to replicate the "Glassmorphism Tactical" aesthetic.

---

## 1. Typography & Hierarchy
Lumina uses the **Geist** font family for a clean, high-tech engineering feel.

| Role | Font Family | Tailwind Class |
| :--- | :--- | :--- |
| **Primary UI** | `Geist Sans` | `font-sans` |
| **Technical Data** | `Geist Mono` | `font-mono text-xs tracking-tight` |
| **Labels** | `Geist Sans` | `uppercase tracking-widest font-bold text-[10px]` |

### Visibility Palette
*   **Primary Text**: `Zinc-100` (`#F4F4F5`) — Titles and primary data.
*   **Secondary Text**: `Zinc-400` (`#A1A1AA`) — Labels and headers.
*   **Tertiary Text**: `Zinc-600` (`#52525B`) — Timestamps and silent metadata.

---

## 2. Core Layout & Atmospheric Effects
The "Tactical Grid" is the foundation of the app. It consists of three layers.

### Implementation Snippet (React/Tailwind)
```tsx
<div className="relative min-h-screen bg-[#050505] overflow-hidden text-zinc-100 selection:bg-lime-500/30">
  
  {/* Layer 1: Fixed Ambient Glows (Orbs) */}
  <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-lime-500/10 rounded-full blur-[120px] pointer-events-none" />
  <div className="fixed -top-40 right-[-20%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
  <div className="fixed bottom-0 left-[-10%] w-[800px] h-[400px] bg-teal-500/5 rounded-full blur-[150px] pointer-events-none" />

  {/* Layer 2: Technical Mesh Grid (24px cells) */}
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

  {/* Layer 3: Main Navigation & Content */}
  <div className="relative z-10 p-6 md:p-10">
    {children}
  </div>
</div>
```

---

## 3. Component Architecture

### The Lumina Glass Card
The "vibe" depends on the precision of the transparent borders.
*   **Radius**: `12px` (`rounded-xl`)
*   **Background**: `white/[0.015]`
*   **Border**: `white/[0.04]` (Increases to `white/[0.1]` on hover)
*   **Refraction**: `backdrop-blur-[2px]` (Keep blur low for "Clear Glass" feel)

```tsx
<div className="rounded-xl border border-white/[0.04] bg-white/[0.015] backdrop-blur-[2px] transition-all hover:bg-white/[0.03] hover:border-white/[0.08]">
  {/* Content */}
</div>
```
PGgzRKJZuxg3QyTK


### Strategic Buttons
High-contrast tactical buttons with neon glow.
*   **Success**: Lime-400 (`#A3E635`) with `shadow-[0_0_20px_-5px_rgba(163,230,53,0.3)]`.
*   **Neutral**: Transparent with `border-white/[0.06]`.

```tsx
<button className="h-10 bg-lime-400 text-black font-extrabold text-xs px-6 rounded-lg uppercase tracking-wide shadow-[0_0_25px_-5px_rgba(163,230,53,0.4)]">
  Deploy Agent
</button>
```

---

## 4. Visual Variables (Tailwind Extension)
If migrating to a new project, add these to your `tailwind.config.js` or `globals.css`:

```css
:root {
  --background: #050505;
  --foreground: #F4F4F5;
  --primary: #A3E635; /* Neon Lime */
  --secondary: #10B981; /* Emerald */
  --radius: 0.625rem; /* 10px base radius */
}

/* Glass Utility */
.glass-panel {
  @apply bg-white/[0.015] border border-white/[0.04] backdrop-blur-sm;
}
```
