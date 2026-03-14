# PROJECT SPECIFICATION

**Version 1.0 · 2025**

# LUMINARY

### Cinematic Art Gallery

**Lightning**
React 18 · TypeScript · AWS Free Tier

---

## 1. Overview

LUMINARY is a full-viewport, cinematic image gallery hosted as a static site on AWS. The product presents a curated sequence of photographs in an immersive, drag-driven experience — one image commanding the entire screen at a time, with deliberate, physics-based transitions that feel editorial rather than digital.

The defining interaction: dragging (or pressing an arrow key) causes the active image to shrink and retreat to the top-left corner while the next image ascends from the bottom-right and expands to fill the viewport. The sensation is filmic — unhurried, weighted, intentional.

### 1.1 Core Goals

* **Single-page experience** — no routing, no navigation chrome.
* **Supports any mix of portrait and landscape images** without cropping.
* **Per-image contextual text**: a thematic phrase (top-right) and a caption (bottom-left).
* **Progress indicator** at centre-bottom.
* **Zero backend** — purely static, deployable to S3 + CloudFront.
* **Free-tier AWS deployment** with no custom domain required.

### 1.2 Non-Goals

* No CMS, no admin panel — images are added by editing `gallery.ts` and dropping files into `/public/images/`.
* No authentication or user accounts.
* No video or audio.

---

## 2. Functional Requirements

### 2.1 Gallery Interaction

| ID | Requirement | Priority |
| --- | --- | --- |
| **FR-01** | Display one active image at a time, full-viewport | Must |
| **FR-02** | Drag gesture (mouse + touch) advances or retreats the gallery | Must |
| **FR-03** | Drag threshold of $\ge$ 80 px triggers transition | Must |
| **FR-04** | Cancelled drag (< 80 px) snaps back to active position | Must |
| **FR-05** | Left ← / Right → arrow key navigation | Must |
| **FR-06** | Previous image held at top-left corner, reduced and dimmed | Must |
| **FR-07** | Next image held at bottom-right corner, reduced and dimmed | Must |
| **FR-08** | Progress bar at centre-bottom reflects position in sequence | Must |
| **FR-09** | Wraps at end — last image advances to first | Should |
| **FR-10** | Click on a flanking (corner) image advances to it directly | Should |

### 2.2 Overlay Text

| Position | Content | Behaviour |
| --- | --- | --- |
| **Top-right** | Short thematic phrase (e.g. "solitude in geometry") | Fades in 300 ms after image settles |
| **Bottom-left** | Image number + title (e.g. "No. 04 — Tokyo Rain") | Fades in 300 ms after image settles |
| **Both** | Defined per image in `gallery.ts` | Hidden during transition, revealed on settle |

### 2.3 Image Support

* Accepted formats: **JPEG, PNG, WebP**.
* Both portrait and landscape orientations.
* **Active image:** `object-fit: contain` — no cropping, letterboxed by canvas.
* Recommended resolution: minimum 1920 px on the long edge.
* Lazy loading on non-active images.

---

## 3. Design System

### 3.1 Aesthetic Direction

Museum after closing hours. The canvas is near-black; images are the only light source. Typography is aristocratic and unhurried. Motion is weighted — spring physics with visible inertia. Nothing snaps; everything settles.

### 3.2 Colour Palette

| Token | Hex | Usage |
| --- | --- | --- |
| `--c-canvas` | `#0A0A0A` | Page background, letterbox areas |
| `--c-ivory` | `#F0EDE6` | Primary text, progress bar fill |
| `--c-accent` | `#C8B89A` | Accent text, subtle highlights |
| `--c-mid` | `#666666` | Secondary labels, metadata |
| `--c-rule` | `#D4CFC8` | Dividers, subtle borders |
| `--c-dim` | `rgba(255,255,255,0.08)` | Flanking image overlay tint |

### 3.3 Typography

| Role | Family | Weight / Style | Size |
| --- | --- | --- | --- |
| **Display / Titles** | Cormorant Garamond | 300 Italic | 2.4 – 3.2 rem |
| **UI Labels / Captions** | DM Mono | 400 Regular | 0.75 – 0.9 rem |
| **Image Number** | DM Mono | 300 Regular | 0.65 rem |
| **Thematic Phrase** | Cormorant Garamond | 300 Italic | 1.1 rem |
| **Progress Fraction** | DM Mono | 400 Regular | 0.7 rem |

> Both fonts loaded from Google Fonts via `@import` in `global.css`.

### 3.4 Motion Specification

All transitions use **Framer Motion** spring physics. No linear or ease-in-out curves.

| Property | Value | Rationale |
| --- | --- | --- |
| **type** | `spring` | Physics-based feel |
| **stiffness** | 55 | Slow, deliberate start |
| **damping** | 18 | Slight overshoot, then settle |
| **mass** | 1.2 | Weight — image feels physical |
| **drag elasticity** | 0.15 | Subtle resistance on drag |
| **overlay text delay** | 300 ms | Reveals after image settles |

### 3.5 Layout Positions

| State | Transform | Scale | Opacity | Z-index |
| --- | --- | --- | --- | --- |
| **Active** | x: 0, y: 0 | 1.0 | 1.0 | 10 |
| **Previous (top-left)** | x: −38 vw, y: −30 vh | 0.28 | 0.45 | 5 |
| **Next (bottom-right)** | x: +38 vw, y: +30 vh | 0.28 | 0.45 | 5 |

---

## 4. Technical Architecture

### 4.1 Stack

| Layer | Technology | Version | Reason |
| --- | --- | --- | --- |
| **Framework** | React | 18 | Concurrent mode, mature ecosystem |
| **Language** | TypeScript | 5.x | Strict types, better DX |
| **Bundler** | Vite | 5.x | Fast HMR, optimised static build |
| **Animation** | Framer Motion | 11.x | Drag gestures + spring physics built-in |
| **Styling** | CSS Modules | — | Scoped, zero runtime overhead |
| **Hosting** | AWS S3 + CF | Free tier | Static CDN, HTTPS, no domain needed |

### 4.2 Folder Structure

```text
art-gallery/
├── public/
│   └── images/             ← drop images here (jpg, png, webp)
├── src/
│   ├── data/
│   │   └── gallery.ts      ← image metadata array
│   ├── components/
│   │   ├── Gallery.tsx
│   │   ├── GalleryImage.tsx
│   │   ├── ProgressBar.tsx
│   │   └── OverlayText.tsx
│   ├── hooks/
│   │   └── useKeyNav.ts
│   ├── styles/
│   │   ├── global.css
│   │   ├── Gallery.module.css
│   │   ├── GalleryImage.module.css
│   │   ├── ProgressBar.module.css
│   │   └── OverlayText.module.css
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json

```

### 4.3 Data Shape

```typescript
// src/data/gallery.ts
export interface GalleryItem {
  id:          string;      // "01", "02", ...
  src:         string;      // "/images/01.jpg"
  title:       string;      // "Tokyo Rain"
  number:      string;      // "No. 04"
  themeText:   string;      // "solitude in geometry"
  orientation: "portrait" | "landscape";
}

```

---

## 5. AWS Deployment

### 5.1 Architecture Diagram

User → **CloudFront** (HTTPS, *.cloudfront.net) → **S3** (origin, private) → static assets

### 5.2 Free-Tier Limits (12 months)

| Service | Free Allowance | Expected Usage |
| --- | --- | --- |
| **S3 Storage** | 5 GB / month | < 200 MB |
| **S3 Requests** | 20,000 GET | Negligible |
| **CloudFront Transfer** | 1 TB / month | < 1 GB for personal use |
| **HTTPS** | Included | No ACM cert cost |

### 5.3 Deployment Steps

1. **Build**: `npm run build`
2. **Create S3 Bucket**: `aws s3 mb s3://luminary-gallery`
3. **Set Policy**: Apply public read or OAI (Origin Access Identity) for CloudFront.
4. **Upload**: `aws s3 sync dist/ s3://luminary-gallery --delete`
5. **CloudFront**: Point origin to S3, set root to `index.html`.

---

## 6. Development Commands

| Command | Action |
| --- | --- |
| `npm create vite@latest art-gallery -- --template react-ts` | Scaffold project |
| `npm install framer-motion` | Install animation library |
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Production build → `dist/` |

---

## 7. Image Guidelines

* **Licensing**: Use Unsplash, Pexels, or Pixabay.
* **Technical**: WebP preferred, < 500 KB per image.
* **Resolution**: 1920 px to 2560 px on the long edge.

---

## 8. Build Phases

1. **Scaffold**: Vite init, install dependencies, setup CSS variables.
2. **Core Gallery**: State machine logic and Framer Motion variant transitions.
3. **Overlay Text**: `AnimatePresence` implementation with fade delays.
4. **Progress Bar**: Animated width component.
5. **Polish**: Keyboard navigation and mobile touch optimization.
6. **Deploy**: AWS S3/CloudFront configuration.

---

**LUMINARY · Project Specification · v1.0**