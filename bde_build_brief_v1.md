# BDE platform — build brief v1

Paste this as your first message to your AI coding assistant. Add your BDE's
logo and colours before you send it.

---

## What we're building

A Progressive Web App for a French student union (BDE). Students open it in a
browser, add it to their home screen, and use it to see upcoming events, find
partner discounts on a map, and buy their BDE card. The BDE team publishes
content and sends push notifications.

Audience: master's students, 21–25, almost entirely on mobile. French language
throughout the interface.

## Explicitly NOT in v1

Do not build any of these. They are planned for v2 and adding them now will
slow the launch:

- No user accounts, no login, no signup
- No digital BDE card in the app
- No profile pages
- No payment handling in code — the card is bought on HelloAsso via a plain link
- No custom admin panel — content is edited in the Supabase dashboard

## Stack — locked, do not substitute

| Layer | Choice | Why |
|---|---|---|
| Framework | React + Vite | Pure client-side, no server needed, deploys as static files |
| PWA | `vite-plugin-pwa` | Manifest + service worker |
| Styling | Tailwind CSS | |
| Database | Supabase (`@supabase/supabase-js`) | Free tier |
| Map | Leaflet + `react-leaflet` + OpenStreetMap tiles | Free, no API key, no credit card |
| Push | OneSignal Web SDK | Free tier |
| Hosting | Netlify | Free tier allows commercial use |

No server-side rendering. No Next.js. No serverless functions. The whole app is
static files plus direct calls to Supabase from the browser.

## Data

The Supabase tables already exist: `events`, `partners`, `partner_categories`.
Row Level Security is on, and only rows with `is_published = true` are readable.
The app is read-only against the database.

Environment variables (Netlify → Site settings → Environment variables):

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_ONESIGNAL_APP_ID=
```

## Screens

**Accueil** — the next three events, a prominent "Ma carte BDE" call to action,
a shortcut to the partners list.

**Événements** — two views the user toggles between: a chronological list of
upcoming events, and a month calendar. Past events are hidden by default.

**Détail événement** — visual, date and time formatted in French
(`samedi 12 septembre, 21h00`), location, description, ticket link when present,
and an "Ajouter à mon agenda" button that downloads an `.ics` file.

**Partenaires** — search box plus category filter chips. Each row shows logo,
name, and the benefit in bold — the benefit is the thing students scan for, so
it must be the most visible text in the row.

**Détail partenaire** — full description, address, a small map, tappable phone
number and website link.

**Carte** — full-screen map with every published partner that has coordinates.
Category filter. Tapping a pin opens the partner detail.

**Ma carte BDE** — what the card gets you, the price, and a large button linking
to the HelloAsso form. Add a line warning that HelloAsso will suggest a
voluntary contribution at checkout and that it can be set to zero — students
find this confusing otherwise.

**Infos légales** — mentions légales and privacy policy. Reachable from a footer
link on every page.

## PWA requirements

- Web app manifest: name, short name, theme colour, `display: standalone`,
  icons at 192px and 512px including a maskable variant
- Service worker caching the app shell so it opens instantly and works offline
  for already-viewed content
- On Android, listen for `beforeinstallprompt` and show a custom install button
- On iOS, detect Safari and show an install sheet with the Share → "Sur l'écran
  d'accueil" steps, since iOS gives no automatic prompt

## Push notifications

- Never request permission on first page load. Ask after the user has opened at
  least one event — opt-in rates are several times higher.
- The request must fire from a real tap, not automatically. iOS enforces this.
- On iOS, push only works when the app is running from the home screen. If
  `window.matchMedia('(display-mode: standalone)').matches` is false on an iOS
  device, hide the notification opt-in entirely and show the install steps
  instead. Requesting permission in a Safari tab silently does nothing.
- Provide a visible unsubscribe control in settings. This is a GDPR requirement,
  not a nice-to-have.

## Traps that will cost you days

1. **Service worker collision.** OneSignal registers its own service worker and
   `vite-plugin-pwa` registers another. Only one can own the scope. Use
   `injectManifest` mode and pull OneSignal's worker into yours with
   `importScripts()`. Getting this wrong breaks push with no error message.

2. **Never put the Supabase `service_role` key in the frontend.** The `anon` key
   is designed to be public and is safe to ship; Row Level Security is what
   protects the data. The `service_role` key bypasses RLS entirely and would
   expose everything. It belongs nowhere near this codebase.

3. **Leaflet needs its CSS imported explicitly** (`import 'leaflet/dist/leaflet.css'`)
   or the map renders as scrambled tiles.

4. **Leaflet's default marker icons break under Vite.** The icon paths don't
   survive bundling. Configure the icon URLs manually or markers vanish.

5. **Timezones.** Store everything as `timestamptz`, display in `Europe/Paris`.
   Events near midnight will show the wrong day otherwise.

6. **Test on a real iPhone before launch,** not the simulator. Install
   behaviour and push are the two things that differ most.

## Design direction

Start from the BDE's own visual identity — logo and colours. If there isn't one
yet, settle that before any UI is written.

- Mobile first. Design at 390px wide. Desktop is an afterthought.
- One accent colour, taken from the BDE identity. Everything else neutral.
- **Avoid these three looks.** AI design tools land on them by default
  regardless of subject, and they read as templated: cream background with a
  high-contrast serif and a terracotta accent; near-black with a single acid
  green or vermilion accent; a hairline-ruled broadsheet grid with square
  corners. Where this brief leaves an axis free, don't spend it on one of these.
- One display face used with restraint, one body face. Not a single family at
  four weights.
- Events and partners are different kinds of object and should not share a
  component. Events are visual and card-shaped; partners are a dense scannable
  list where the discount is the hero.
- Sentence case everywhere. Buttons say what happens: "Voir l'événement", not
  "En savoir plus".
- Empty states are an invitation, not an apology. "Pas encore d'événement —
  reviens vite" beats "Aucune donnée".
- Quality floor, unannounced: works down to 360px, visible keyboard focus,
  `prefers-reduced-motion` respected.

## Build order

1. Project skeleton, Tailwind, Supabase client, deployed to Netlify and live
2. Partners list + category filter (simplest screen, proves the data pipeline)
3. Events list + detail
4. Map
5. Carte BDE page + HelloAsso link
6. PWA manifest, service worker, install flows
7. OneSignal push
8. Mentions légales and privacy page
