import type {
  MissionObjective,
  MissionPhase,
  MissionSpec,
  MissionSubsystem,
} from '@/lib/types'

/**
 * LISAT-01 — the team's first satellite.
 *
 * Everything here is taken from lisat.space. Where a figure was not published,
 * the entry is marked `provisional: true` and renders with a "TBC" flag rather
 * than a made-up number. Replace those values once the team confirms them; do
 * not guess.
 */

export const mission = {
  name: 'LISAT-01',
  subtitle: 'AIS from space',
  headline: 'Maritime awareness from space',
  summary:
    'LISAT-01 is our first 1U CubeSat, fully developed by students at Instituto Superior Técnico. It collects AIS signals from ships to strengthen Portugal’s maritime domain awareness — and to prove that an academic team can design, build and operate a satellite.',
  /** Current programme status, shown in the mission hero. */
  status: 'Critical Design Review complete — awaiting Phase B decision',
  statusDate: '2025-12-24',
  /**
   * Short form of the same status, for the technical annotations in the
   * homepage hero where there is no room for the full sentence.
   */
  phase: 'In development',
  competition: {
    name: 'CubeSat Portugal',
    organiser: 'Portuguese Space Agency',
    teams: 7,
    description:
      'LISAT is competing in CubeSat Portugal, the national nanosatellite programme promoted by the Portuguese Space Agency. Seven teams are competing and the winner gets the opportunity to launch their own satellite. The programme exists to give university students hands-on experience in space engineering and to build a national platform for innovation, collaboration and technical excellence.',
  },
} as const

/** The problem the mission addresses, as framed on the current site. */
export const challenge = {
  title: 'The challenge',
  points: [
    'Portugal controls one of the largest maritime zones in Europe.',
    'Patrolling that area with ships and aircraft is expensive and cannot see everything, especially in remote waters far from the coast.',
    'Vast stretches of ocean go unwatched, and illegal activity and environmental incidents slip by unseen.',
    'Decision-makers need frequent, reliable, actionable data. When data fails, response comes late — and costs more.',
  ],
}

export const impact = {
  title: 'Impact',
  body: 'Better awareness of who is where, doing what. That supports safety, environmental protection and sovereignty — without the price tag of traditional surveillance programmes.',
}

export const objectives: MissionObjective[] = [
  {
    id: 'ais',
    title: 'Collect AIS signals from orbit',
    description:
      'Detect and decode Automatic Identification System messages broadcast by vessels at sea, including those far beyond the reach of coastal receivers.',
  },
  {
    id: 'downlink',
    title: 'Relay the data to ground',
    description:
      'Forward decoded maritime traffic to LISAT ground stations in Portugal, reliably and on a predictable schedule.',
  },
  {
    id: 'awareness',
    title: 'Strengthen maritime domain awareness',
    description:
      "Lower the cost of monitoring Portugal's Exclusive Economic Zone, supporting maritime safety, environmental protection and navigation intelligence.",
  },
  {
    id: 'demonstrate',
    title: 'Prove that students can fly a mission',
    description:
      'Demonstrate that an academic team can design, build, qualify and operate a real spacecraft end to end.',
  },
]

/**
 * Published specifications. Anything not stated on lisat.space is marked
 * provisional — the mission page renders those with a TBC badge.
 */
export const specs: MissionSpec[] = [
  { label: 'Form factor', value: '1U CubeSat' },
  { label: 'Dimensions', value: '10 × 10 × 10 cm' },
  { label: 'Payload', value: 'AIS receiver' },
  { label: 'Mission', value: 'Maritime domain awareness' },
  { label: 'Ground segment', value: '3 ground stations in Portugal' },
  { label: 'Programme', value: 'CubeSat Portugal' },
  { label: 'Orbit', value: 'To be confirmed', provisional: true },
  { label: 'Mass', value: 'To be confirmed', provisional: true },
  { label: 'Design lifetime', value: 'To be confirmed', provisional: true },
  { label: 'Launch', value: 'To be confirmed', provisional: true },
]

/**
 * The three pillars of the mission, used by the homepage scroll sequence.
 * `annotation` and `chapter` are the labels shown beside the imagery — both
 * repeat figures already published in `specs` above.
 */
export const pillars = [
  {
    id: 'payload',
    chapter: 'The payload',
    annotation: 'AIS receiver',
    title: 'AIS payload',
    body: 'A compact receiver that detects and decodes AIS signals from ships, demonstrating small-satellite support for maritime safety and navigation intelligence.',
    image: '/images/mission/render-ocean.jpg',
    imageAlt: 'The ocean seen from orbit at night',
  },
  {
    id: 'platform',
    chapter: 'The spacecraft',
    annotation: '10 × 10 × 10 cm',
    title: '1U CubeSat platform',
    body: 'Built and integrated by students — modular ADCS, power and communications inside a 10 × 10 × 10 cm bus, engineered for fast testing and operations.',
    image: '/images/mission/render-cubesat.jpg',
    imageAlt: 'Render of a 1U CubeSat in low Earth orbit',
  },
  {
    id: 'ground',
    chapter: 'The ground segment',
    annotation: '3 ground stations in Portugal',
    title: 'Ground segment',
    body: 'Operated by students and partners, our network includes three ground stations across Portugal to maximise maritime coverage and ensure reliable telemetry and AIS downlink.',
    image: '/images/mission/render-radar.jpg',
    imageAlt: 'Radar sweep showing tracked vessels',
  },
]

/** How each department contributes to the flight system. */
/**
 * How the mission actually works, in three steps.
 *
 * Every line below is a condensed form of `objectives` above — the AIS
 * detection wording from OBJ-01, the downlink wording from OBJ-02. Note that
 * the published data says "ground stations in Portugal", not Lisbon: do not
 * narrow that here without something to back it up.
 *
 * `tone` is the surface each step is shown on. Light, dark, light — the dark
 * middle is what makes the spacecraft the centre of the sequence.
 */
export const signalPath = [
  {
    id: 'vessel',
    label: 'Vessel',
    title: ['Signal', 'from the sea'],
    body: 'A vessel broadcasts its AIS message from far beyond the reach of any coastal receiver.',
    tone: 'ice' as const,
    image: '/images/updates/jornadasdomar-04.jpg',
    imageAlt: 'A naval vessel alongside at dusk',
    /** Keeps the superstructure in frame as the panel changes shape. */
    imagePosition: '50% 38%',
  },
  {
    id: 'orbit',
    label: 'Orbit',
    title: ['Store.', 'Then forward.'],
    body: 'LISAT-01 detects and decodes those messages as it passes, and holds them on board until it can pass them on.',
    tone: 'void' as const,
    image: '/images/mission/render-cubesat.jpg',
    imageAlt: 'Render of LISAT-01 in low Earth orbit',
    imagePosition: '50% 50%',
  },
  {
    id: 'ground',
    label: 'Ground',
    title: ['Back', 'to Earth.'],
    body: 'Decoded maritime traffic is relayed down to LISAT ground stations in Portugal, on a predictable schedule.',
    tone: 'cloud' as const,
    /**
     * Ground infrastructure the team visited, not LISAT's own station — the
     * alt text says so rather than implying the dish belongs to the mission.
     */
    image: '/images/updates/altice-03.jpg',
    imageAlt: 'A satellite ground station antenna against a clear sky',
    imagePosition: '50% 45%',
  },
]

export const subsystems: MissionSubsystem[] = [
  {
    department: 'hardware',
    summary: 'Builds and integrates the AIS receiver chain and the flight hardware.',
  },
  {
    department: 'cdh',
    summary: 'Runs the on-board computer, schedules capture and manages stored data.',
  },
  {
    department: 'communications',
    summary: 'Closes the RF link to the ground stations that receive telemetry and AIS data.',
  },
  {
    department: 'adcs',
    summary: 'Determines and controls attitude so antennas and sensors point where they must.',
  },
  {
    department: 'power-systems',
    summary: 'Generates, stores and distributes the energy every subsystem depends on.',
  },
  {
    department: 'structures-thermal',
    summary: 'Holds the stack together and keeps it inside its temperature limits.',
  },
]

/**
 * Programme timeline. Phases A/B concluded with the Critical Design Review in
 * December 2025; everything after that is dependent on the competition outcome.
 */
export const phases: MissionPhase[] = [
  {
    id: 'formation',
    name: 'Team formation',
    period: '2024',
    status: 'complete',
    description:
      'LISAT is founded at Instituto Superior Técnico and enters CubeSat Portugal, the national nanosatellite programme.',
    image: '/images/mission/hero-team.jpg',
    imageAlt: 'The LISAT team together at Instituto Superior Técnico',
    imageRatio: 1.88,
  },
  {
    id: 'ppr',
    name: 'Preliminary Project Report',
    period: 'Apr 2025',
    status: 'complete',
    description:
      'First complete package: mission architecture, system budgets and the LISAT-01 test plan.',
    image: '/images/mission/team-work-01.jpg',
    imageAlt: 'LISAT members working through the first project package',
    imageRatio: 1.5,
  },
  {
    id: 'design',
    name: 'Phases A/B — design',
    period: '2025',
    status: 'complete',
    description:
      'Subsystem design, simulation and prototyping across all eight departments, supported by partner labs and industry feedback.',
    image: '/images/updates/bootcamp-02.jpg',
    imageAlt: 'A LISAT test bench during the CubeSat Portugal bootcamp',
    imageRatio: 1.5,
  },
  {
    id: 'cdr',
    name: 'Critical Design Review',
    period: 'Dec 2025',
    status: 'complete',
    description:
      'More than 500 pages of technical documentation defended before the competition jury, covering mission architecture, subsystems, operations concept and risk strategy.',
    image: '/images/updates/cdr-03.jpg',
    imageAlt: 'LISAT members presenting at the Critical Design Review',
    imageRatio: 1.5,
  },
  {
    id: 'phase-b',
    name: 'Phase B decision',
    period: 'Current',
    status: 'active',
    description:
      'Awaiting the competition’s decision on progression, while the team continues subsystem development and testing.',
  },
  {
    id: 'ait',
    name: 'Assembly, integration & test',
    period: 'To be confirmed',
    status: 'planned',
    description:
      'Flight model integration and environmental qualification of the complete satellite.',
  },
  {
    id: 'launch',
    name: 'Launch & operations',
    period: 'To be confirmed',
    status: 'planned',
    description:
      'Launch, commissioning and routine AIS collection, operated from the LISAT ground segment.',
  },
]

/** Development photography used across the mission page. */
export const missionGallery = [
  { src: '/images/mission/hero-team.jpg', alt: 'The LISAT team together at Instituto Superior Técnico' },
  { src: '/images/mission/team-work-01.jpg', alt: 'LISAT members working on the satellite' },
  { src: '/images/mission/team-work-02.jpg', alt: 'LISAT members during a working session' },
  { src: '/images/mission/team-work-03.jpg', alt: 'LISAT members at an engineering review' },
  { src: '/images/mission/team-work-04.jpg', alt: 'LISAT members presenting the project' },
]
