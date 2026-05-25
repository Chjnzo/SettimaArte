# CLAUDE.md — SettimaArte Website
> File di contesto per sessioni di sviluppo con Claude Code.
> Leggi tutto prima di scrivere una sola riga di codice.

---

## 1. Cos'è il Progetto

**SettimaArte** è il progetto educational di **Oriocenter** (centro commerciale a Bergamo), realizzato in collaborazione con **Skillherz** (ex Edoomark). Offre agli studenti delle scuole superiori un'esperienza di **Formazione Scuola-Lavoro (FSL / PCTO)** centrata sul linguaggio cinematografico.

Il progetto si articola in **3 format**:
- **FSL** — percorso PCTO in cui gli studenti girano cortometraggi dentro Oriocenter
- **Festival** — evento pubblico (dicembre e giugno) in cui i corti vengono proiettati alla sala 14 di UCI Orio a Oriocenter, con votazioni online e giuria (Frank Matano, i Pampers, OkiDoki)
- **Cortometraggio Professionale** — 10 studenti selezionati affiancano una troupe professionale (OkiDoki) per produrre un cortometraggio estivo reale, candidato ai festival nazionali

**Edizioni completate:** 8+ edizioni. Ultimi corti: *Le Faremo Sapere* (2024, regia Beppe Tufarulo) e *Sono Sempre Qui Per Te* (2025, regia Marco Pacchiana).

**URL produzione:** https://www.settimaartefestival.it

---

## 2. Stack Tecnologico

### Frontend
| Tool | Versione |
|------|----------|
| React | 19.x |
| TypeScript | 5.5.x |
| Vite | 6.3.x |
| React Router DOM | 6.26.x |
| TanStack Query | 5.56.x |
| Framer Motion | 12.x |
| Tailwind CSS | 3.4.x |
| shadcn/ui | latest |
| Radix UI | vari |
| Lucide React | 0.462.x |
| React Hook Form | 7.53.x |
| Zod | 3.23.x |
| react-helmet-async | 2.x |
| sonner | 1.5.x |

### Backend
| Tool | Ruolo |
|------|-------|
| Supabase | Database PostgreSQL + Auth admin |
| @supabase/supabase-js | 2.95.x — client SDK |

> Supabase è usato SOLO per la sezione votazioni Festival e l'area admin. Il resto del sito è statico.

### Integrazione HubSpot
Form contatti custom React → fetch POST all'API HubSpot Forms. **NON usare embed diretto HubSpot.**
```
POST https://api.hsforms.com/submissions/v3/integration/submit/{portalId}/{formId}
```
Campi: Nome, Cognome, Sono uno (studente/genitore/docente/altro), Email, Cellulare, Provincia, Messaggio.

### Deployment
- **Primario:** Cloudflare Workers (Wrangler 4.71.x + Cloudflare Vite Plugin 1.26.x)
- **Staging:** Vercel

---

## 3. Design System

### Palette Colori (ufficiale dal brand SettimaArte)
```css
--color-azzurro:        #0597de;   /* colore principale */
--color-blu:            #20244c;   /* secondario / testi scuri */
--color-fucsia:         #e50576;   /* accent / highlight */
--color-azzurro-light:  #dbdbdb;   /* neutro / background */
--color-white:          #ffffff;
--color-black:          #000000;
```

### Typography
**Font principale: Funnel Display** (font custom, file .ttf forniti)
- Pesi disponibili: Light, Regular, Medium, SemiBold, Bold, ExtraBold
- Usato per titoli, headline, display text
- File in: `src/assets/fonts/FunnelDisplay/`
- Caricato via `@font-face` nel CSS globale

Per il body/testo corrente usare un sans-serif di sistema o Inter come fallback leggibile.

### Design Feeling
Riferimento visivo: **https://skillherz.com** — moderno, fresco, accattivante, immediato.
- Sezioni ampie con un'idea forte ciascuna
- Whitespace generoso
- Headline grandi e bold
- Numeri statistici come elementi visivi (enormi, display)
- Cards con border-radius molto pronunciato (quasi squircle)
- Fotografia reale come materia prima
- Animazioni Framer Motion per entrata sezioni (non esagerate)
- Mobile-first

### Logo
3 varianti PNG con trasparenza in `public/logo/`:
- `7arte-oriocenter_logo_2024.png` — versione colori (header su sfondo bianco)
- `7arte-oriocenter_logo_2024_negativo.png` — versione bianca (per sfondi scuri)
- `7arte-oriocenter_logo_2024_positivo.png` — versione positivo (per sfondi chiari)

---

## 4. Struttura delle Directory

```
settimarte/
├── public/
│   ├── logo/                    # 3 varianti logo PNG
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── fonts/
│   │       └── FunnelDisplay/   # .ttf files (Light/Regular/Medium/SemiBold/Bold/ExtraBold)
│   ├── components/
│   │   ├── ui/                  # shadcn/ui — NON modificare direttamente
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ScrollToTop.tsx
│   │   ├── HeroSlider.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── Gallery.tsx
│   │   ├── VideoEmbed.tsx
│   │   ├── FAQAccordion.tsx
│   │   ├── ContactForm.tsx
│   │   ├── VotazioniSection.tsx
│   │   ├── CortoCard.tsx
│   │   └── EdizioneCortometraggio.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── FSL.tsx
│   │   ├── Festival.tsx
│   │   ├── Cortometraggio.tsx
│   │   ├── Admin.tsx
│   │   ├── Privacy.tsx
│   │   └── NotFound.tsx
│   ├── hooks/
│   │   ├── useVotazioni.ts
│   │   └── useAdminAuth.ts
│   ├── lib/
│   │   ├── supabaseClient.ts
│   │   ├── hubspotClient.ts
│   │   └── utils.ts
│   ├── data/
│   │   ├── fsl.ts               # dati statici gallerie FSL per edizione
│   │   ├── festival.ts          # dati statici gallery festival
│   │   ├── cortometraggio.ts    # dati statici edizioni corto
│   │   └── faq.ts               # domande FAQ
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                # @font-face Funnel Display + variabili CSS
├── .env                         # variabili ambiente (vedi sezione 8)
├── wrangler.jsonc               # config Cloudflare Workers
├── vercel.json                  # config staging Vercel
├── tailwind.config.ts
├── vite.config.ts
└── CLAUDE.md                    # questo file
```

---

## 5. Routing

```
/                  → Home.tsx
/fsl               → FSL.tsx
/festival          → Festival.tsx
/cortometraggio    → Cortometraggio.tsx
/admin             → Admin.tsx          (noindex, non linkata nel menu)
/privacy           → Privacy.tsx
*                  → NotFound.tsx
```

- Tutte le pagine: lazy load con `React.lazy` + `Suspense`
- Tutte le pagine: meta tag SEO con `react-helmet-async`
- Home supporta `?scroll=<id>` per scroll parametrico alle sezioni
- `/admin` ha `<meta name="robots" content="noindex, nofollow">`

### Navigazione Header
Menu: `HOME` / `FSL` / `FESTIVAL` / `CORTOMETRAGGIO`
Su mobile: hamburger → drawer laterale
`/admin` non appare nel menu pubblico.

---

## 6. Pagine — Struttura e Contenuto

### Home (`/`)
1. **HeroSlider** — slider fullscreen foto/video con lancio alle sezioni (autoplay, transizioni Framer Motion)
2. **Intro** — h2 tagline: *"Settima Arte è il progetto educational di Oriocenter, un'occasione educativa per sperimentare il mondo del lavoro utilizzando il linguaggio a loro più noto: il video."* + piccolo testo su Ricciotto Canudo e la settima arte (1911) — **h2 prima, testo Canudo dopo**
3. **ProjectCard FSL** — immagine sx, testo dx. Copy: *"In un mondo in cui i giovani sfruttano sempre più supporti audio-visivi per esprimere chi sono, Oriocenter ha pensato dunque di rendere il cinema protagonista del suo progetto di Formazione Scuola-Lavoro. In collaborazione con Skillherz nel 2018 è nato il progetto Settima Arte, in cui gli studenti coinvolti raccontano le storie che vivono, osservano e immaginano, trasformando vetrine, negozi e corridoi in veri e propri set cinematografici."* CTA "Scopri di più" → `/fsl`
4. **ProjectCard Festival** — testo sx, immagine dx. Copy: *"L'apprezzamento di studenti, genitori e scuole ha portato il progetto a svilupparsi in due edizioni annuali…"* CTA "Scopri di più" → `/festival`
5. **ProjectCard Cortometraggio** — immagine sx, testo dx. Copy: *"Nelle ultime due edizioni il progetto ha fatto un passo in più…"* CTA "Scopri di più" → `/cortometraggio`
6. **Nota geografica** — *"La partecipazione a questo progetto educational di Oriocenter è aperto a tutte le scuole secondarie di II° grado della provincia di Bergamo e non solo! L'ultima edizione ha visto infatti partecipare istituti delle province di Brescia, Lecco, Como e Monza Brianza."* — nota: "aperto" (non "aperta")
7. **FAQAccordion** — accordion shadcn/ui (contenuto FAQ da `src/data/faq.ts`)
8. **ContactForm** — form HubSpot custom. Campi: Nome*, Cognome*, Sono uno* (studente/genitore/docente/altro), Email*, Cellulare, Provincia*, Messaggio.

### FSL (`/fsl`)
1. **Hero** — foto/video fullscreen + titolo: *"Un'esperienza di Formazione Scuola-Lavoro unica nel suo genere"*
2. **Copy descrittivo** — 4 paragrafi (copy ufficiale del committente, non modificare):
   - P1: FSL diventati passaggio obbligato, rischio attività ripetitive (fotocopie, pratiche amministrative)
   - P2: Approccio Oriocenter — progetto educational per valorizzare il potenziale; esperienza creativa con linguaggio cinematografico
   - P3: Percorso immersivo con videomaker ed educatori; tutte le fasi del cortometraggio; ruoli diversi (regia, produzione, recitazione)
   - P4: Obiettivo non formare registi ma far emergere competenze trasversali (collaborazione, stress, decisioni, ascolto)
3. **Risultati numerici** (display grande):
   - 1.450 studenti coinvolti
   - 58 settimane di FSL
   - 16 eventi pubblici
   - 4.480 persone coinvolte
   - Certificate of Merit CNCC 2023
4. **Copy intermedio** — 2 paragrafi (copy ufficiale del committente, non modificare):
   - P1: esperienze che raccontano cosa accade quando le aziende aprono spazi reali ai giovani; valore dei ragazzi che sorprende
   - P2: Generazione Z, esperienze concrete e guidate, Oriocenter — risultato non solo educativo ma culturale
5. **Gallery mista backstage** — foto edizioni precedenti (tutte insieme)
6. **Gallery edizione 24/25** — foto + video YouTube (locandine + embed)
7. **Gallery edizione 23/24** — foto + video YouTube
8. **Gallery edizione 22/23** — foto + video YouTube
9. **Footer link** — *"Per vedere tutti i video visita il canale YouTube di Oriocenter"*

> I video delle gallery FSL sono embed YouTube. I link sono in un file Google Sheet/doc in FSL/Cartella3. Da embeddare come `<iframe>` o tramite componente `VideoEmbed`.

### Festival (`/festival`)
1. **Hero** — foto/video + titolo: *"In occasione del Festival i corti degli studenti sono proiettati sul maxischermo di UCI Orio a Oriocenter"*
2. **Copy evento** — 6 paragrafi (copy ufficiale del committente, non modificare):
   - P1: set cinematografico come esperienza intensa; percorso che si trasforma in evento
   - P2: giornata-evento aperta al pubblico; visibilità e riconoscimento
   - P3: votazioni da casa nelle settimane precedenti; ruolo attivo dei ragazzi nel promuovere il progetto
   - P4: due volte l'anno (Dicembre e Giugno) nella sala 14 di UCI Orio
   - P5: vero format; giuria d'eccezione (Frank Matano, Pampers, Oki Doki Film); voto da casa decreta il vincitore
   - P6: per alcuni ragazzi non è il punto di arrivo; produzione cinematografica estiva con Oki Doki Film
3. **Risultati** (display grande):
   - ~500 studenti coinvolti per edizione
   - Fino a 16 cortometraggi ogni anno
   - Media 5.000 voti online per evento
4. **Link interno** → `/cortometraggio` (*"Scopri di più sulla produzione estiva"*)
5. **VotazioniSection** — **VISIBILE SOLO IN DICEMBRE E GIUGNO**. 4 card (una per classe) con: nome classe, trama, locandina, link cortometraggio, CTA "Vota qui!" (link esterno Google Form). Dati da Supabase tabella `corti_correnti`.
6. **Gallery evento** — foto delle edizioni precedenti del Festival
7. **Gallery video backstage** — video backstage edizioni precedenti

### Cortometraggio (`/cortometraggio`)
1. **Hero** — video fullscreen + titolo: *"Produzione cinematografica professionale estiva per alcuni studenti del progetto educational Settima Arte"*
2. **Copy introduttivo** — 5 paragrafi (copy ufficiale del committente, non modificare):
   - P1: obiettivo chiaro del progetto (sperimentare ruoli, tempi, responsabilità)
   - P2: domanda naturale — cosa succede quando questo potenziale viene portato ancora oltre?
   - P3: evoluzione del progetto; troupe professionale; non più simulazione ma produzione reale
   - P4: set vero con ritmi e standard autentici
   - P5: cinema come strumento educativo potente; valore della settima arte per chi la vive
3. **L'iter** — 4 paragrafi (copy ufficiale del committente, non modificare):
   - P1: commissione, tema del cortometraggio, casa di produzione
   - P2: Oriocenter promotore; Delta Index base scientifica; Oki Doki Film garanzia cinematografica
   - P3: selezione 10 studenti durante FSL (affidabilità, team, attitudine)
   - P4: estate con Oki Doki Film; esperienza immersiva; competenze, consapevolezza, memoria
4. **Aspetti chiave** (4 card):
   - Selezione di 10 studenti
   - Supporto contenutistico Delta Index
   - Produzione professionale
   - Candidatura ai principali festival nazionali
5. **Gallery foto backstage studenti** — foto dal set
6. **Edizione 2024** — scheda:
   - Descrizione: *"La prima edizione di questo percorso ha dato vita al cortometraggio Le Faremo Sapere…"* (copy ufficiale, include Cortinametraggio)
   - Titolo: *Le Faremo Sapere* | Regia: Beppe Tufarulo | Attori: Giorgio Marchesi, Antonia Fotaras
   - Premi: Due premi Cortinametraggio, Miglior Sceneggiatura + Miglior Attore Protagonista (E Fu Cinema Festival Pomarance), Premio Troisi Videocorto Nettuno, Miglior Attore + Miglior Attrice (Movievalley Festival Bologna), shortlist David di Donatello, shortlist Nastri d'Argento
   - Trama: colloquio di lavoro che si rivela uno screen test
   - **Embed trailer** video
   - Gallery (locandina, foto premi, attori, troupe backstage)
7. **Edizione 2025** — scheda:
   - Descrizione: *"La seconda edizione ha portato alla realizzazione di Sono sempre qui per te…"* (in distribuzione nei festival, non ancora disponibile online)
   - Titolo: *Sono Sempre Qui Per Te* | Regia: Marco Pacchiana | Attori: Jacopo Olmo Antinori, Walter Tiraboschi, Giulia Gonella
   - Trama: Manuel, copywriter 25enne, agenzia pubblicitaria, consegna importante, AI, merito, ribellione
   - Foto attori + backstage
8. **Citazione finale** — *"Investire sui giovani non dovrebbe essere un gesto simbolico, ma una scelta strategica capace di generare valore nel tempo. Le esperienze sviluppate per Oriocenter attorno al linguaggio cinematografico mostrano come, quando l'incontro tra impresa e nuove generazioni è progettato con cura, possa dare vita a risultati inattesi — e talvolta straordinari."* — foto sfondo

### Admin (`/admin`)
- Route non linkata nel menu pubblico
- `ProtectedRoute` — controlla sessione Supabase, redirige a `/admin/login` se non autenticato
- `AdminLogin` — form email + password → Supabase Auth
- `AdminDashboard` — 4 form (uno per classe) per aggiornare `corti_correnti`:
  - nome_progetto
  - trama
  - locandina_url
  - video_url
  - link_voto
  - attivo (boolean)
- Feedback tramite toast (sonner)

---

## 7. Database Supabase

### Tabella: `corti_correnti`
```sql
CREATE TABLE corti_correnti (
  id            integer PRIMARY KEY,      -- 1, 2, 3, 4 (uno per classe)
  edizione      text NOT NULL,            -- es. "dic_25", "giu_26"
  classe        integer NOT NULL,         -- 1, 2, 3, 4
  nome_progetto text NOT NULL,
  trama         text,
  locandina_url text,
  video_url     text,                     -- embed YouTube/Vimeo
  link_voto     text,                     -- URL Google Form votazione
  attivo        boolean DEFAULT false,
  updated_at    timestamptz DEFAULT now()
);
```

### Policy RLS
```sql
-- Lettura pubblica solo record attivi
CREATE POLICY "public_read" ON corti_correnti
  FOR SELECT USING (attivo = true);

-- Scrittura solo admin autenticati
CREATE POLICY "admin_write" ON corti_correnti
  FOR ALL USING (auth.role() = 'authenticated');
```

### Auth Admin
- Supabase Auth email + password
- Account admin creati manualmente dalla dashboard Supabase
- Max 2-5 utenti admin

---

## 8. Variabili di Ambiente

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_HUBSPOT_PORTAL_ID=
VITE_HUBSPOT_FORM_ID=
```

> `VITE_HUBSPOT_PORTAL_ID` e `VITE_HUBSPOT_FORM_ID` non sono segreti — esposti nel frontend per design HubSpot.

---

## 9. Asset Media — Mappatura Supabase Storage

Tutti gli asset sono su **Supabase Storage** nel bucket `media`. Struttura bucket:

```
media/
├── home/
│   ├── hero/              ← Cartella 1 HP — foto per lo slider hero (multiple)
│   ├── sezione-fsl/       ← Cartella 2 HP — 1 foto per ProjectCard FSL
│   ├── sezione-festival/  ← Cartella 3 HP — 1 foto per ProjectCard Festival
│   └── sezione-corto/     ← Cartella 4 HP — 1 foto per ProjectCard Cortometraggio
├── fsl/
│   ├── hero/              ← Cartella 1 FSL — foto/video hero
│   ├── backstage-misto/   ← Cartella 2 FSL — gallery foto edizioni miste
│   └── gallery-edizioni/  ← Cartella 3 FSL — sottocartelle per anno:
│       ├── locandine-22-23/
│       ├── locandine-23-24/
│       ├── locandine-24-25/
│       └── locandine-25-26/
│       (+ file con link YouTube corti per anno)
├── festival/
│   ├── hero/              ← Cartella 1 Festival — foto/video hero
│   ├── gallery-evento/    ← Cartella 2 Festival — foto evento edizioni precedenti
│   └── gallery-backstage/ ← Cartella 3 Festival — video backstage edizioni
└── cortometraggio/
    ├── hero/              ← Cartella 1 Corto — VIDEO per hero
    ├── backstage-studenti/← Cartella 2 Corto — gallery foto backstage studenti
    ├── edizione-2024/     ← Cartella 3 Corto — video trailer edizione 2024
    ├── edizione-2025/     ← Cartella 4 Corto — gallery backstage edizione 2025
    └── citazione/         ← Cartella 5 Corto — 1 foto per sezione citazione finale
```

### URL pattern asset
```
https://<project-ref>.supabase.co/storage/v1/object/public/media/<path>
```

### Video YouTube
I video FSL e backstage Festival sono embed YouTube. I link sono in un file nella cartella FSL/Cartella3. Usare il componente `VideoEmbed` con `<iframe>` lazy load.

---

## 10. Componenti — Specifiche Chiave

### HeroSlider
- Fullscreen (100vw × 100vh)
- Autoplay con transizione Framer Motion
- Overlay scuro leggero per leggibilità testo
- Testo sovrapposto con titolo e CTA
- Su mobile: aspect ratio 16:9 fisso

### Gallery
- Griglia di foto con lightbox al click
- Su mobile: scroll orizzontale o griglia 2 colonne
- Lazy loading nativo (`loading="lazy"`)
- Può contenere mix foto + embed video YouTube

### VideoEmbed
- Wrapper per embed YouTube/Vimeo
- Lazy load: mostra thumbnail finché non si clicca play
- Aspect ratio 16:9

### ContactForm
- React Hook Form + Zod per validazione
- Al submit: `fetch` POST → HubSpot API
- Successo: toast sonner + reset form
- Errore: messaggio inline rosso
- Layout 2 colonne su desktop, 1 su mobile

### VotazioniSection
- **Condizionale**: visibile SOLO in dicembre e giugno
- Logica visibilità: controlla mese corrente (`new Date().getMonth()`) oppure flag `attivo` da Supabase
- 4 card con border-radius pronunciato (stile squircle)
- Dati da Supabase via `useVotazioni` hook (TanStack Query, staleTime 5 min)
- Layout: griglia 2×2 desktop, colonna singola mobile

### FAQAccordion
- Componente Accordion di shadcn/ui
- Contenuto da `src/data/faq.ts`

### ProtectedRoute
- HOC che wrappa `/admin`
- Controlla `supabase.auth.getSession()`
- Se non autenticato → redirect a `/admin/login`

---

## 11. SEO

| Pagina | Title Tag | Canonical |
|--------|-----------|-----------|
| Home | SettimaArte \| Il Progetto Educational di Oriocenter | https://www.settimaartefestival.it/ |
| FSL | Formazione Scuola-Lavoro \| SettimaArte | https://www.settimaartefestival.it/fsl |
| Festival | Festival \| I Cortometraggi degli Studenti \| SettimaArte | https://www.settimaartefestival.it/festival |
| Cortometraggio | Cortometraggio Professionale \| SettimaArte | https://www.settimaartefestival.it/cortometraggio |
| Admin | Area Admin \| SettimaArte | noindex, nofollow |
| Privacy | Privacy Policy \| SettimaArte | https://www.settimaartefestival.it/privacy |

---

## 12. Comandi

```bash
npm run dev          # dev server Vite (localhost)
npm run build        # build produzione
npm run build:dev    # build development
npm run lint         # ESLint
npm run preview      # build + wrangler dev (preview Cloudflare locale)
npm run deploy       # build + wrangler deploy (Cloudflare Workers)
```

---

## 13. Regole di Sviluppo

- **Mai modificare** i file in `src/components/ui/` (shadcn/ui)
- **Mai inserire** chiavi API private HubSpot nel frontend
- **`/admin`** deve sempre avere `noindex, nofollow`
- **Font Funnel Display** caricato via `@font-face` in `index.css`, mai via Google Fonts
- **Contenuti statici** centralizzati in `src/data/` — mai hardcoded nei componenti
- **Lazy loading** su tutte le pagine con `React.lazy + Suspense`
- **Mobile-first** con Tailwind CSS
- **Animazioni** Framer Motion: entrate pulite, mai eccessive. Rispettare `prefers-reduced-motion`
- **Immagini**: sempre `loading="lazy"` e `alt` descrittivo
- **TypeScript**: tutto tipizzato, niente `any`
- **Colori**: sempre usare le CSS custom properties (`var(--color-azzurro)` ecc.), mai hardcodare hex

---

## 14. Contatti Progetto

| Ruolo | Dettaglio |
|-------|-----------|
| Promotore | Oriocenter |
| Organizzatore | Skillherz (ex Edoomark) |
| Email | info@skillherz.com |
| URL | https://www.settimaartefestival.it |
| Area | Bergamo e province limitrofe (Lombardia) |
