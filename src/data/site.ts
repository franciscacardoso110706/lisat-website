import type { NavItem, SocialLink } from '@/lib/types'

/**
 * Site-wide settings: identity, navigation, contact details and press.
 *
 * All values below were taken from lisat.space.
 */

export const site = {
  name: 'LISAT',
  fullName: "LISAT (Lisbon's New Satellite)",
  tagline: "Lisbon's New Satellite",
  /** Change this to the production domain before launch. */
  url: 'https://www.lisat.space',
  description:
    "LISAT is a student-led space engineering team at Instituto Superior Técnico building LISAT-01, a 1U CubeSat that collects maritime AIS signals from orbit over Portugal's Exclusive Economic Zone.",
  shortDescription:
    'Student-led satellite engineering at Instituto Superior Técnico, Lisbon.',
  founded: 2024,
  institution: 'Instituto Superior Técnico',
  university: 'Universidade de Lisboa',
  city: 'Lisbon',
  country: 'Portugal',
  locale: 'en',
  /**
   * Lisbon, used for the technical annotations in the hero and footer.
   * Rounded to four decimals, which is the city centre rather than a
   * building — this is a label, not a location for anyone to visit.
   */
  coordinates: {
    lat: '38.7369° N',
    lon: '9.1389° W',
  },
} as const

export const contact = {
  email: 'geral@lisat.space',
  /** Published as the team's general contact number on lisat.space. */
  phone: '+351 926 847 850',
  phoneHref: 'tel:+351926847850',
  address: 'Av. Prof. Dr. Cavaco Silva, 2744-016 Porto Salvo',
  addressNote: 'Taguspark, Instituto Superior Técnico',
  mapUrl:
    'https://maps.google.com/?q=Av.+Prof.+Dr.+Cavaco+Silva,+2744-016+Porto+Salvo',
  /** Pre-filled mailto used by every "partner with us" call to action. */
  partnershipsMailto:
    'mailto:geral@lisat.space?subject=Partnership%20proposal%20%E2%80%94%20LISAT',
  pressMailto: 'mailto:geral@lisat.space?subject=Press%20enquiry%20%E2%80%94%20LISAT',
  joinMailto: 'mailto:geral@lisat.space?subject=Joining%20LISAT',
} as const

/** LISAT is on Instagram and LinkedIn only. */
export const socials: SocialLink[] = [
  { label: 'Instagram', href: 'https://www.instagram.com/lisat.space' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/lisat-space' },
]

/**
 * Routes whose first section is a dark hero.
 *
 * The navbar is transparent until the page scrolls, so on these routes it has
 * to adopt the dark palette — otherwise its links resolve to the light theme's
 * near-black and sit invisibly on top of the photography. Add a route here if
 * you give it a dark opening section.
 */
export const darkHeroRoutes = ['/', '/mission/lisat-01', '/partners'] as const

/** Primary navigation. Order here is the order in the navbar. */
export const mainNav: NavItem[] = [
  { label: 'Mission', href: '/mission/lisat-01' },
  { label: 'Team', href: '/team' },
  { label: 'Departments', href: '/departments' },
  { label: 'Updates', href: '/updates' },
  { label: 'Partners', href: '/partners' },
]

/**
 * The header's single call to action, kept out of `mainNav` so it can be
 * styled and placed apart from the page navigation.
 */
export const headerCta: NavItem = { label: 'Get involved', href: '/join-us' }

/** Everything the mobile menu lists, including the routes the desktop bar
 *  surfaces as a button rather than as a nav item. */
export const mobileNav: NavItem[] = [
  ...mainNav,
  headerCta,
  { label: 'Contact', href: '/contact' },
]

/** Grouped links used by the footer. */
export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: 'Explore',
    items: [
      { label: 'Mission', href: '/mission/lisat-01' },
      { label: 'Team', href: '/team' },
      { label: 'Departments', href: '/departments' },
    ],
  },
  {
    title: 'Discover',
    items: [
      { label: 'Updates', href: '/updates' },
      { label: 'Partners', href: '/partners' },
      { label: 'Join Us', href: '/join-us' },
    ],
  },
  {
    title: 'Contact',
    items: [
      { label: 'Get in touch', href: '/contact' },
      { label: 'Partner with LISAT', href: '/partners#partner-with-us' },
      { label: 'Press', href: '/contact#press' },
    ],
  },
]

/** Press coverage. Only entries we can link to a published article. */
export const pressMentions = [
  {
    outlet: 'Diferencial',
    author: 'Tomás Ferreira',
    quote:
      'New group of Técnico students promises to build a nano-satellite by 2026.',
    url: 'https://diferencial.tecnico.ulisboa.pt/noticia/novo-nucleo-de-estudantes-do-tecnico-promete-construir-nano-satelite-ate-2026/',
  },
  {
    outlet: 'UniArea',
    author: 'Pedro Baptista',
    quote:
      "LISAT: Técnico's new student group that brought satellite development to university students.",
    url: 'https://uniarea.com/lisat-o-novo-nucleo-de-estudantes-do-tecnico-que-trouxe-o-desenvolvimento-de-satelites-aos-estudantes-universitarios/',
  },
]
