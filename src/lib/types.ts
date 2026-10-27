/**
 * Shared content types for the LISAT website.
 *
 * Everything the site renders comes from `src/data/*`. If you are updating
 * content, edit those files — these types just describe their shape so the
 * editor can tell you when something is missing.
 */

/* ------------------------------------------------------------------ team */

/** Where someone sits in the organisation. */
export type MemberRank = 'board' | 'lead' | 'member' | 'advisor'

/** Department identifier. Must match a `Department['slug']`. */
export type DepartmentSlug =
  | 'adcs'
  | 'cdh'
  | 'communications'
  | 'hardware'
  | 'power-systems'
  | 'structures-thermal'
  | 'hr-logistics'
  | 'marketing-sponsors'
  | 'research-development'
  | 'board'

/**
 * A department slug.
 *
 * The literals are the departments that exist in `src/data/departments.ts`,
 * and they still autocomplete. The `string & {}` arm widens the type to accept
 * a slug created in Sanity Studio, which cannot be known at compile time.
 */
export type DepartmentKey = DepartmentSlug | (string & {})

/** The minimum a department has to provide to appear as a team filter. */
export interface DepartmentRef {
  slug: DepartmentKey
  name: string
  /** Short form shown on cards and filter buttons, e.g. "ADCS". */
  abbr: string
  /** One or two sentences, shown when the team page filters to it. */
  description?: string
}

export interface TeamMember {
  /** Stable slug, also used for the photo filename. */
  id: string
  name: string
  /** Job title shown on the card, e.g. "Department Leader". */
  role: string
  rank: MemberRank
  department: DepartmentKey
  /** Degree code as used at IST, e.g. "LEAer". */
  degree?: string
  /** Curricular year. */
  year?: number
  /** Home faculty — IST, FCUL, ISEG, … */
  faculty?: string
  /** Full public LinkedIn URL. */
  linkedin?: string
  /** Public contact address. Only set for board members. */
  email?: string
  /**
   * Either a path under /public/images/team, or a Sanity CDN URL for a member
   * managed in the Studio. Omit when we have no photo.
   */
  photo?: string
  /** Alt text for a CMS photograph. Falls back to the person's name. */
  photoAlt?: string
  /**
   * Short department label for the card, e.g. "ADCS".
   *
   * CMS members carry their own, because a department created in the Studio
   * has whatever slug the editor generated — looking it up in the code's
   * department map would miss and print the raw slug on the card.
   */
  departmentLabel?: string
  /** Public one-liner from the CMS. Not rendered by the current card. */
  bio?: string
  /** Where this record came from. Only set for CMS members. */
  source?: 'sanity'
}

/* ----------------------------------------------------------- departments */

export interface Department {
  slug: DepartmentSlug
  /** Full name, e.g. "Attitude Determination & Control System". */
  name: string
  /** Short form used in diagrams and filters, e.g. "ADCS". */
  abbr: string
  /** One line, sentence case, no full stop. */
  tagline: string
  /** Two or three sentences for the department page hero. */
  summary: string
  /** Longer "What do we do?" body. Each string is a paragraph. */
  description: string[]
  /** Bulleted responsibilities. */
  responsibilities: string[]
  /** How this department shows up in the flight system. */
  roleOnLisat01: string
  /** Engineering areas / tools, shown as small tags. */
  disciplines: string[]
  /** Which part of the satellite block diagram this maps to. */
  segment: 'platform' | 'payload' | 'ground' | 'organisation'
  /** Path under /public/images/departments, if we have a photo. */
  image?: string
}

/* -------------------------------------------------------------- partners */

export type PartnerTier =
  | 'main'
  | 'gold'
  | 'silver'
  | 'bronze'
  | 'technical'
  | 'institutional'
  | 'supporter'

/**
 * How much room a partner gets on the Partners page. A display hierarchy, not
 * a public label: the official classification is `tier`.
 *
 *   featured   a large editorial placement of its own
 *   major      a medium tile with its contribution written out
 *   standard   a logo in the moving stream
 *
 * Leave it unset and it follows the tier (see `partnerPriority`).
 */
export type PartnerPriority = 'featured' | 'major' | 'standard'

export interface Partner {
  id: string
  name: string
  tier: PartnerTier
  /** Path under /public/images/partners, or a Sanity CDN URL. */
  logo: string
  /** Official site. Omit when the current site does not link one. */
  url?: string
  /** One line on what the partnership provides, when we know it. */
  contribution?: string
  /** Overrides the size that `tier` would give this partner. */
  priority?: PartnerPriority
  /** Lower comes first within the same priority and tier. */
  order?: number
  /** Draws a wide logo larger than its size allows, e.g. 1.2. Size is unchanged. */
  logoScale?: number
  /** A real photograph of the partnership. Never a stock image. */
  featuredImage?: { src: string; alt: string }
  /** A story about this partnership on the Updates page, e.g. "/updates/thales-portugal-visit". */
  story?: string
  /** Where this record came from. Only set for CMS partners. */
  source?: 'sanity'
}

export interface PartnerTierMeta {
  id: PartnerTier
  label: string
  description: string
}

/* --------------------------------------------------------------- updates */

export type UpdateCategory =
  | 'mission'
  | 'engineering'
  | 'events'
  | 'team'
  | 'partnerships'
  | 'recruitment'

export interface UpdateImage {
  src: string
  alt: string
  /**
   * `object-position` for this photograph, set only where the default centre
   * crop would cut the subject — a group shot whose faces sit high in the
   * frame, for instance. Leave it out otherwise.
   */
  position?: string
}

export interface Update {
  slug: string
  title: string
  /** ISO date — used for sorting and <time dateTime>. */
  date: string
  category: UpdateCategory
  /** Card summary and meta description. Keep under ~180 characters. */
  excerpt: string
  /** Standfirst shown above the body on the article page. */
  lead?: string
  /** Body paragraphs, in order. */
  body: string[]
  /** Card / hero image. */
  cover: UpdateImage
  /** Additional images shown in the article gallery. */
  gallery?: UpdateImage[]
  /** Estimated reading time in minutes. */
  readingMinutes?: number
}

/* --------------------------------------------------------------- mission */

export interface MissionSpec {
  label: string
  value: string
  /** Set when the value still needs confirmation from the team. */
  provisional?: boolean
}

export interface MissionObjective {
  id: string
  title: string
  description: string
}

export interface MissionSubsystem {
  department: DepartmentSlug
  summary: string
}

export type PhaseStatus = 'complete' | 'active' | 'planned'

export interface MissionPhase {
  id: string
  name: string
  /** Short label such as "Phase A/B" or a date range. */
  period: string
  status: PhaseStatus
  description: string
  /**
   * Photography for the journey timeline. Only set where a real photograph of
   * that milestone exists — the planned phases have none, which is correct:
   * they have not happened yet.
   */
  image?: string
  imageAlt?: string
  /**
   * The photograph's own width/height ratio. The timeline sizes each frame to
   * match it, so `object-fit: cover` has nothing to crop and no face is ever
   * cut off. Read it from the file rather than guessing.
   */
  imageRatio?: number
  /** Only needed when a frame deliberately differs from the source ratio. */
  imagePosition?: string
}

/* ----------------------------------------------------------- recruitment */

export type RecruitmentStatus = 'open' | 'closed' | 'interest'

export interface RecruitmentGate {
  /** Gate code shown on the card, kept from the current site. */
  code: string
  department: DepartmentSlug
  tasks: string[]
  skills: string[]
}

export interface RecruitmentStep {
  title: string
  description: string
}

export interface FaqItem {
  question: string
  answer: string
}

/* -------------------------------------------------------------- site nav */

export interface NavItem {
  label: string
  href: string
}

export interface SocialLink {
  label: string
  href: string
}
