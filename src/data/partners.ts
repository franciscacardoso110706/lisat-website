import type {
  Partner,
  PartnerPriority,
  PartnerTier,
  PartnerTierMeta,
} from '@/lib/types'

/**
 * Organisations supporting LISAT.
 *
 * Tiers for MEO, Thales, Marinha Portuguesa, Oeiras Valley, Instituto de
 * Telecomunicações, JTA, Althima, Altair, Mauser, Allkits, Aubay, GALP, Ordem
 * dos Engenheiros, NanoSatLab, Xpand IT, IST, AEIST and IPDJ come straight from
 * the partners page on lisat.space. ESSS is tagged silver on the strength of
 * its own announcement post.
 *
 * The remaining logos appeared in the homepage support strip without a stated
 * tier. Academic bodies are grouped as `institutional` and everything else as
 * `supporter` — change a `tier` value here if a relationship is formally
 * different.
 *
 * `priority` only decides how large a partner is drawn on the Partners page;
 * it follows the tier unless set. Oeiras Valley is set to `featured` so it sits
 * beside MEO, at the team's request — its official tier is unchanged.
 *
 * These records are the fallback. A partner published in Sanity Studio with
 * the same key replaces the fields it sets — see `src/lib/partner-source.ts`.
 */
export const partners: Partner[] = [
  {
    id: 'meo',
    name: 'MEO',
    tier: 'main',
    logo: '/images/partners/meo.png',
    url: 'https://www.meo.pt',
    contribution: 'Main partner. Hosted the team at its Satellite Operations Center.',
    featuredImage: {
      src: '/images/updates/altice-01.jpg',
      alt: 'The LISAT team at MEO’s Satellite Operations Center, in front of a ground-station antenna',
    },
  },

  {
    id: 'thales',
    name: 'Thales Portugal',
    tier: 'gold',
    logo: '/images/partners/thales.png',
    url: 'https://www.thalesgroup.com/',
    contribution:
      'Guidance on communications, satellite operations and systems engineering.',
  },
  {
    id: 'marinha-portuguesa',
    name: 'Marinha Portuguesa',
    tier: 'gold',
    logo: '/images/partners/marinha-portuguesa.png',
    url: 'https://www.marinha.pt',
    contribution:
      'Operational context for maritime surveillance of the EEZ, with CINAV-Lab.',
  },
  {
    id: 'oeiras-valley',
    name: 'Oeiras Valley',
    tier: 'gold',
    logo: '/images/partners/oeiras-valley.png',
    url: 'https://oeirasvalley.com',
    priority: 'featured',
  },
  {
    id: 'instituto-telecomunicacoes',
    name: 'Instituto de Telecomunicações',
    tier: 'gold',
    logo: '/images/partners/instituto-telecomunicacoes.png',
    url: 'https://www.it.pt',
  },

  {
    id: 'jta',
    name: 'JTA — The Data Scientists',
    tier: 'silver',
    logo: '/images/partners/jta.png',
    contribution: 'Data science and software development support.',
  },
  {
    id: 'althima',
    name: 'Althima',
    tier: 'silver',
    logo: '/images/partners/althima.svg',
    contribution:
      'Engineering services and advanced simulation, AI and HPC software solutions.',
  },
  {
    id: 'esss',
    name: 'ESSS',
    tier: 'silver',
    logo: '/images/partners/esss.png',
    contribution:
      'Access to Ansys for structural, thermal, fluid and electromagnetic analysis.',
  },
  {
    id: 'altair',
    name: 'Altair',
    tier: 'silver',
    logo: '/images/partners/altair.png',
    contribution: 'FEKO academic grant for electromagnetic antenna simulation.',
  },

  {
    id: 'mauser',
    name: 'Mauser',
    tier: 'bronze',
    logo: '/images/partners/mauser.png',
    contribution: 'Electronic components and hardware for testing and prototyping.',
  },
  {
    id: 'allkits',
    name: 'Allkits',
    tier: 'bronze',
    logo: '/images/partners/allkits.png',
    contribution: 'Custom team clothing, made in Portugal.',
  },

  {
    id: 'aubay',
    name: 'Aubay',
    tier: 'technical',
    logo: '/images/partners/aubay.png',
    url: 'https://www.aubay.com',
  },
  {
    id: 'xpand-it',
    name: 'Xpand IT',
    tier: 'technical',
    logo: '/images/partners/xpand-it.svg',
    url: 'https://www.xpand-it.com/',
  },
  {
    id: 'galp',
    name: 'GALP',
    tier: 'technical',
    logo: '/images/partners/galp.png',
  },
  {
    id: 'nanosatlab',
    name: 'IST NanoSat Lab',
    tier: 'technical',
    logo: '/images/partners/nanosatlab.png',
  },
  {
    id: 'ansys',
    name: 'Ansys',
    tier: 'technical',
    logo: '/images/partners/ansys.png',
    contribution: 'Simulation software, provided through ESSS.',
  },
  {
    id: 'ordem-engenheiros',
    name: 'Ordem dos Engenheiros — Região Sul',
    tier: 'technical',
    logo: '/images/partners/ordem-engenheiros.png',
  },

  {
    id: 'instituto-superior-tecnico',
    name: 'Instituto Superior Técnico',
    tier: 'institutional',
    logo: '/images/partners/instituto-superior-tecnico.png',
    url: 'https://tecnico.ulisboa.pt',
  },
  {
    id: 'aeist',
    name: 'AEIST',
    tier: 'institutional',
    logo: '/images/partners/aeist.png',
  },
  {
    id: 'idmec',
    name: 'IDMEC',
    tier: 'institutional',
    logo: '/images/partners/idmec.png',
  },
  {
    id: 'fcul',
    name: 'Faculdade de Ciências da Universidade de Lisboa',
    tier: 'institutional',
    logo: '/images/partners/fcul.png',
  },
  {
    id: 'iseg',
    name: 'ISEG',
    tier: 'institutional',
    logo: '/images/partners/iseg.png',
  },
  {
    id: 'isel',
    name: 'ISEL',
    tier: 'institutional',
    logo: '/images/partners/isel.png',
  },
  {
    id: 'ipdj',
    name: 'IPDJ',
    tier: 'institutional',
    logo: '/images/partners/ipdj.png',
  },

  {
    id: 'emetres',
    name: 'Emetrês',
    tier: 'supporter',
    logo: '/images/partners/emetres.png',
    contribution: '3D printing material for prototyping.',
  },
  {
    id: 'ncab',
    name: 'NCAB Group',
    tier: 'supporter',
    logo: '/images/partners/ncab.png',
  },
  {
    id: 'texugo3d',
    name: 'Texugo3D',
    tier: 'supporter',
    logo: '/images/partners/texugo3d.png',
  },
  {
    id: 'millebrindes',
    name: 'Millebrindes',
    tier: 'supporter',
    logo: '/images/partners/millebrindes.png',
  },
  {
    id: 'istartlab',
    name: 'iStartLab',
    tier: 'supporter',
    logo: '/images/partners/istartlab.png',
  },
]

/** Tier metadata, in the order tiers should be displayed. */
export const partnerTiers: PartnerTierMeta[] = [
  {
    id: 'main',
    label: 'Main partner',
    description: 'The organisation backing the mission at the highest level.',
  },
  {
    id: 'gold',
    label: 'Gold',
    description: 'Partners providing sustained technical and operational support.',
  },
  {
    id: 'silver',
    label: 'Silver',
    description: 'Partners supplying software, tooling and specialist expertise.',
  },
  {
    id: 'bronze',
    label: 'Bronze',
    description: 'Partners supporting hardware, prototyping and team equipment.',
  },
  {
    id: 'technical',
    label: 'Technical partners',
    description: 'Companies and labs collaborating on engineering and simulation.',
  },
  {
    id: 'institutional',
    label: 'Institutional',
    description: 'Universities, faculties and public bodies supporting the project.',
  },
  {
    id: 'supporter',
    label: 'Supporters',
    description: 'Organisations contributing materials, services and equipment.',
  },
]

/**
 * The size each tier is drawn at when a partner has no `priority` of its own.
 * The main partner leads; gold and silver have contributions worth writing
 * out; everyone else flows past as a logo.
 */
const tierPriority: Record<PartnerTier, PartnerPriority> = {
  main: 'featured',
  gold: 'major',
  silver: 'major',
  bronze: 'standard',
  technical: 'standard',
  institutional: 'standard',
  supporter: 'standard',
}

/** A tier as a singular label, for one partner: "Gold partner". */
export const tierBadge: Record<PartnerTier, string> = {
  main: 'Main partner',
  gold: 'Gold partner',
  silver: 'Silver partner',
  bronze: 'Bronze partner',
  technical: 'Technical partner',
  institutional: 'Institutional partner',
  supporter: 'Supporter',
}

export function partnerPriority(partner: Partner): PartnerPriority {
  return partner.priority ?? tierPriority[partner.tier]
}

const priorityRank: Record<PartnerPriority, number> = {
  featured: 0,
  major: 1,
  standard: 2,
}

const tierRank = new Map(partnerTiers.map((t, i) => [t.id, i]))

/**
 * Display order: priority, then official tier, then `order`. The sort is
 * stable, so partners with no `order` keep the order of the list above — and
 * within "major" a gold partner always precedes a silver one.
 */
export function sortPartners(list: Partner[]): Partner[] {
  return [...list].sort(
    (a, b) =>
      priorityRank[partnerPriority(a)] - priorityRank[partnerPriority(b)] ||
      (tierRank.get(a.tier) ?? 99) - (tierRank.get(b.tier) ?? 99) ||
      (a.order ?? 1000) - (b.order ?? 1000),
  )
}

export function partnersByTier(tier: PartnerTier): Partner[] {
  return partners.filter((p) => p.tier === tier)
}

/** Tiers that actually have partners, used to build the filter bar. */
export const activeTiers = partnerTiers.filter(
  (t) => partners.some((p) => p.tier === t.id),
)

/** A short, high-recognition selection for the homepage strip. */
export const featuredPartnerIds = [
  'meo',
  'thales',
  'marinha-portuguesa',
  'instituto-telecomunicacoes',
  'oeiras-valley',
  'instituto-superior-tecnico',
  'nanosatlab',
  'jta',
  'althima',
  'aubay',
  'xpand-it',
  'ipdj',
]

export const featuredPartners = featuredPartnerIds
  .map((id) => partners.find((p) => p.id === id))
  .filter((p): p is Partner => Boolean(p))
