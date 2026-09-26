# LISAT — lisat.space

The website of LISAT, a student-led space engineering team at Instituto
Superior Técnico building **LISAT-01**, a 1U CubeSat that collects maritime AIS
signals from orbit.

Built with Next.js (App Router), TypeScript, Tailwind CSS and Lucide icons.

---

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm start          # serve the production build
npm run lint       # ESLint
npm run typecheck  # TypeScript, no emit
```

> **If the dev server renders but nothing is clickable** (filters do not respond,
> the mobile menu does not open), the Next.js hot-reload WebSocket is being
> blocked — usually by local antivirus or firewall software inspecting
> `localhost`. The site itself is fine: run `npm run build && npm start` for an
> accurate preview, or allow `node.exe` through the firewall.

---

## Editing content

**You should not need to touch a React component to update the site.**
Everything lives in `src/data/`:

| File | What it holds |
| --- | --- |
| `site.ts` | Name, contact details, social links, navigation, headline statistics |
| `mission.ts` | LISAT-01 — summary, objectives, specifications, subsystems, phases |
| `departments.ts` | The nine departments: description, responsibilities, role on LISAT-01 |
| `team.ts` | Every member: name, role, department, degree, year, LinkedIn, photo |
| `partners.ts` | Partners and supporters, grouped by tier |
| `updates.ts` | News articles |
| `recruitment.ts` | Recruitment status, departments open, process, FAQ |

Each file starts with a comment explaining how to add an entry. TypeScript will
tell you if a required field is missing.

### Common tasks

**Add a team member** — add a block to the array in `src/data/team.ts`:

```ts
{
  id: 'ana-silva',                    // also the photo filename
  name: 'Ana Silva',
  role: 'Antenna Design',
  rank: 'member',                     // 'board' | 'lead' | 'member' | 'advisor'
  department: 'communications',
  degree: 'LEEC',
  year: 2,
  faculty: 'IST',
  linkedin: 'https://www.linkedin.com/in/…',
  photo: '/images/team/ana-silva.jpg', // omit if there is no photo yet
}
```

**Add a photo for a member** — save a square image as
`public/images/team/<id>.jpg` and set `photo` on their entry. Members without a
photo get a typographic monogram, which is a deliberate design, not a
placeholder to be filled with a stock image.

**Publish an update** — add an entry at the top of `src/data/updates.ts`, put
its images in `public/images/updates/`, and it appears on `/updates`, in the
category filter and on the homepage automatically.

**Open or close recruitment** — change one value in `src/data/recruitment.ts`:

```ts
status: 'open'      // 'open' | 'closed' | 'interest'
applicationUrl: 'https://…'   // required when status is 'open'
```

The Join Us page, its call to action and the homepage recruitment block all
follow. The wording for each state is in `statusCopy` in the same file.

**Change a department leader** — set `rank: 'lead'` on their entry in
`team.ts`. Department pages and filters pick it up.

---

## The CMS (Sanity)

Departments and team members are moving out of the code and into Sanity, so
that a future LISAT team can add a member, change a role or mark somebody as
having left without opening an editor. Everything else on the site still reads
from `src/data`.

### Setting it up

1. Copy `.env.local.example` to `.env.local`.
2. Fill in `NEXT_PUBLIC_SANITY_PROJECT_ID` from
   [sanity.io/manage](https://www.sanity.io/manage).
3. Restart the dev server.
4. Open [localhost:3000/studio](http://localhost:3000/studio).

With no project ID set, the site reads the team from `src/data/team.ts` and
behaves exactly as it did before Sanity existed. Nothing breaks; the Studio
shows a short setup message instead.

### Who can edit

Whoever is a member of the Sanity project, and nobody else. The Studio asks
Sanity who you are before it shows a single document, so knowing the `/studio`
address gets an unauthorised visitor a login screen and nothing more. There is
no shared password and no custom login to maintain.

Handover is therefore a Sanity operation, not a code change: invite next
year's editors in sanity.io/manage and remove the previous ones.

### What is public

Everything in Sanity is published on lisat.space. The team member schema has
deliberately **no field** for a personal email, phone number, student number or
internal note. If one is added, it ends up on the public internet.

### Migration state

`src/lib/team-source.ts` holds a single constant that decides where the team
page gets its people:

| Mode | Behaviour |
| --- | --- |
| `code` | Sanity ignored; the old data files only. The rollback. |
| `merge` | Both, with Sanity winning on a matching id. **Current setting.** |
| `sanity` | Sanity only. Switch to this once every member has been migrated. |

`merge` is what makes the migration safe to do one person at a time: publishing
somebody in the Studio adds them to the page without removing the 43 people
still defined in code.

To *replace* one of those 43 rather than add to them, fill in the
**"Replaces (migration only)"** field on their Studio record with their id from
`src/data/team.ts` — the CMS version then takes their place instead of the page
showing them twice. Leave it blank for anyone new.

`src/data/team.ts` is not deleted by any of this.

### Adding another content type later

Write a schema file next to `src/sanity/schemas/department.ts`, list it in
`schemas/index.ts`, and add a menu item in `sanity.config.ts`. Then write a
query and an adapter alongside `src/sanity/team.ts` that returns the shape the
existing components already take — the point of that file is that no component
had to change.

---

## Project structure

```
src/
  app/                    routes (App Router)
    page.tsx              homepage
    mission/lisat-01/     the mission
    team/                 team directory
    departments/          listing + [slug] pages
    updates/              index + [slug] articles
    partners/  join-us/  contact/
    sitemap.ts  robots.ts  icon.png  opengraph-image.png
  components/
    layout/               Navbar, MobileMenu, Footer
    ui/                   Section, Button, Figure, Gallery, Reveal, Counter…
    home/ mission/ team/ departments/ updates/ partners/ join/
  data/                   ← all editable content
  lib/                    types and small helpers
public/images/            brand, team, mission, departments, partners, updates
```

---

## Design system

### Colour

There are nine brand colours and nothing else. They live once, as CSS custom
properties, at the top of `src/app/globals.css`:

| Token | Value | What it is |
| --- | --- | --- |
| `--lisat-blue` | `#3A76D9` | The LISAT blue |
| `--lisat-blue-soft` | `#7FA9EB` | The blue, on a dark surface |
| `--lisat-blue-deep` | `#2764C9` | The blue, as small text on a light surface |
| `--lisat-white` | `#FCFCFA` | Warm white |
| `--lisat-cloud` | `#F6F8FC` | |
| `--lisat-ice` | `#EAF1FB` | |
| `--lisat-mist` | `#DDE9F8` | The deepest light surface |
| `--lisat-navy` | `#142033` | Text, and the lightest dark surface |
| `--lisat-midnight` | `#0C1728` | The dark surface |
| `--lisat-slate` | `#53657D` | Dates, captions, metadata |

There is no pure black and no pure white anywhere. Dark is deep blue, light is
off-white, and both are tinted toward the brand.

**Why the blue appears at three values.** `#3A76D9` is the identity, and it is
what you see on buttons, illumination, the timeline and large statements. But
it reaches only 4.28:1 on warm white and 4.08:1 on midnight, so it cannot carry
small text on either. Interface blue therefore deepens to `#2764C9` on light
and lifts to `#7FA9EB` on dark. Same hue, same saturation — it reads as one
colour and passes WCAG AA everywhere.

### Tones

Colours are **tone-aware**. A section declares a tone and everything inside it
resolves against the right palette:

```tsx
<Section tone="cloud">…</Section>
```

The ladder, lightest first:

```
paper  #FCFCFA   warm white — the default page
cloud  #F6F8FC   the everyday alternate
ice    #EAF1FB   a section that should feel cooler
mist   #DDE9F8   the deepest light surface, one band at a time
space  #101D33  ─┐
hull   #142033   ├ dark, and deliberately rare
void   #0C1728  ─┘
```

Roughly two thirds of the site is light. **Light is the environment; dark is an
event** — the homepage opening, the mission journey, the departments, the
updates cover, closing calls to action and the footer. If you find yourself
making a fourth section dark, one of the other three probably should not be.

Inside a section, use the semantic tokens rather than a colour name:

| Use | Class |
| --- | --- |
| Headings, body | `text-fg` |
| Supporting copy | `text-fg-muted` |
| Dates, captions, counts | `text-fg-faint` |
| Links, accent words, active states | `text-accent` |
| A filled blue surface | `bg-accent-solid` + `text-accent-fg` |
| The brand blue, decoratively | `bg-brand`, `text-brand` |
| Blue light | `rgb(var(--glow) / 0.2)` |
| Hairlines | `border-rule`, `border-rule-strong` |
| A card on the current surface | `bg-surface-raised` |

All of these are variables rebound by the tone class, so the same component is
legible on light and dark without conditional class names.

> **Gotcha:** `rule` and `rule-strong` are full `rgba()` values, not channel
> triplets, so they do **not** accept an opacity modifier. `border-rule/50`
> silently produces no CSS. Change the alpha in the token instead.

### Joining two sections

Two light surfaces one rung apart differ by about 4% in luminance — small, but
across a full-width page the eye still finds the line and reads it as a stripe.
Pass `join` to dissolve it:

```tsx
<Section tone="ice" join="soft">…</Section>    // light meeting light
<Section tone="void" join="curve">…</Section>  // light meeting dark
```

`soft` is a wide, shallow ellipse; `curve` is a pronounced radius for the
moments where the step is the point.

### Typography

| Face | Variable | Where |
| --- | --- | --- |
| Montserrat | `font-display` | Headings, navigation, buttons, interface labels |
| Inter | `font-sans` | Running text |
| Anton | `font-poster` | Two or three statements per site, never a heading |
| IBM Plex Mono | `font-mono` | Eyebrows, specifications, coordinates, counts |

Anton is a poster face. It is currently used in exactly one place — the
`MISSION UPDATES` cover — and it should stay that rare; on every section it
would read as a flyer rather than a spacecraft programme.

The brand's text face is **Open Sauce**, which is not on Google Fonts and is
not licensed here. Running text uses Inter until someone buys or vendors a
licensed copy; when that happens, change `--font-sans` in `src/app/layout.tsx`
and nothing else.

**Animation** is CSS-first. The hero entrance uses keyframes and scroll reveals
use an IntersectionObserver that *adds* the hidden state only once JavaScript
runs — so content is never invisible if a script fails, and
`prefers-reduced-motion` is respected throughout.

### Homepage choreography

The homepage carries three scroll-driven moments. Everything between them is
deliberately still — the contrast is what makes them land, so resist adding a
fourth.

| Moment | Component | What happens |
| --- | --- | --- |
| The handoff | `home/Hero` | On `lg` and up the hero is pinned and the intro rides up over it. The photograph scales and drifts, and a veil deepens as it goes. |
| Three chapters | `home/MissionStory` | The imagery is pinned while payload → spacecraft → ground segment advance beside it, the three renders cross-fading against scroll position. |
| The team | `home/People` | Photographs travel at different rates and the group bleeds past the right edge of the measure. |

All three use `useScroll` + `useTransform`, so they are tied to scroll position
rather than triggered once: stop scrolling and they stop, scroll back and they
reverse. Two rules hold everywhere:

- **Every transform rests at its neutral value at progress 0**, so the
  server-rendered (and un-hydrated) page is already the correct one.
- **Under `prefers-reduced-motion` every range collapses to `[0, 0]`** and the
  mission sequence simply holds its first image.

Below `lg` the pinning is dropped: the mission chapters stack with an image
each, which keeps mobile scrolling cheap.

> **Gotcha:** `position: sticky` is silently disabled by any ancestor with
> `overflow: hidden`. `Section` clips by default, so pass `clip={false}` on any
> section that contains a sticky child — `MissionStory` does exactly this.

---

## Content notes

Content was migrated from the previous Wix site. Two things are worth knowing:

- **Specifications that were never published** (orbit, mass, design lifetime,
  launch) are marked `provisional: true` in `src/data/mission.ts` and render as
  "TBC". They were deliberately not invented — fill them in when the design is
  frozen.
- **Research & Development** appears in the roster but had no page on the old
  site. Its entry in `departments.ts` has a short placeholder description marked
  with a `TODO`.

### Redirects

Every URL from the old Wix site is permanently redirected to its replacement in
`next.config.ts` — `/projects-1` → `/mission/lisat-01`, `/the-team-adcs` →
`/departments/adcs`, each `/updates-*` page to its new slug, and so on. Keep
them so existing links and search results do not break.

---

## Deploying

The site is fully static — 45 prerendered pages, no database, no API.

1. Push the repository to GitHub.
2. Import it on [Vercel](https://vercel.com/new); the defaults are correct.
3. Add `lisat.space` and `www.lisat.space` as domains and update the DNS
   records Vercel gives you.
4. Set `url` in `src/data/site.ts` if the production domain ever changes — it is
   what the sitemap, canonical URLs and social cards are built from.

---

Built by LISAT.
