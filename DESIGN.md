# SettimaArte — Design System

## Colors

| Token | Value | Usage |
|-------|-------|-------|
| --color-azzurro | #0597de | Colore principale, CTA, link |
| --color-blu | #20244c | Secondario, testi scuri, header |
| --color-fucsia | #e50576 | Accent, highlight, underline menu |
| --color-azzurro-light | #dbdbdb | Neutro, background sezioni alternate |
| --color-white | #ffffff | Sfondi chiari |
| --color-black | #000000 | Testi principali |

Strategy: **Full palette** — 3 colori named con ruoli precisi, usati in modo deliberato.

## Typography

Font principale: **Funnel Display** (custom @font-face, file .ttf in src/assets/fonts/FunnelDisplay/)
Pesi: Light, Regular, Medium, SemiBold, Bold, ExtraBold

- Classe Tailwind: `font-funnel`
- Usato per TUTTO: titoli, body, UI
- Fallback: sans-serif di sistema

Scale fluida con `clamp()` per i display heading. Minimo 1.25× ratio tra steps.

## Components

- HeroSlider: fullscreen 100vw×100vh, overlay scuro, testo sovrapposto, autoplay Framer Motion
- Gallery: griglia con lightbox, preview 3 elementi + "vedi tutto", lazy loading
- VotazioniSection: visibile solo dicembre/giugno, 4 card corti
- ContactForm: React Hook Form + Zod, POST HubSpot API
- FAQAccordion: shadcn/ui Accordion
- Header: sticky, background trasparente → bg-blu/90 on scroll

## Elevation / Shadows

Cards: border-radius pronunciato (quasi squircle), shadow leggera
Hero overlay: dark gradient per leggibilità testo

## Motion

Framer Motion per entrate sezioni (viewport intersection)
Rispettare prefers-reduced-motion
