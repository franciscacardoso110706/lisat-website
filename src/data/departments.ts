import type { Department, DepartmentKey, DepartmentSlug } from '@/lib/types'

/**
 * The eight engineering and organisational departments that build LISAT-01,
 * plus Research & Development.
 *
 * Copy comes from the department pages on lisat.space, lightly edited for
 * consistency. To add a department, append an entry here and drop a photo in
 * /public/images/departments — the listing page, the /departments/[slug] page,
 * the team filters and the recruitment gates all read from this array.
 *
 * Note: "Research & Development" appears in the team roster but did not have a
 * public page on the old site. Its copy below is intentionally short — replace
 * `summary` and `description` when the department writes its own.
 */
export const departments: Department[] = [
  {
    slug: 'adcs',
    name: 'Attitude Determination & Control System',
    abbr: 'ADCS',
    tagline: 'Sensing, estimation and control',
    summary:
      "This department makes sure the satellite knows where it is and where it's going. From precise orientation to trajectory planning, we simulate and control every move.",
    description: [
      'The department is built on two pillars: attitude control and orbital mechanics.',
      "In attitude control, the mission is to orient and stabilise the satellite using mechanical systems, aligning its sensors and antennas with the Earth so data can be received and transmitted in real time.",
      'In orbital mechanics, we calculate and simulate optimal orbits for the satellite’s operation, and we model the return to Earth by computing orbit decay and re-entry trajectories.',
    ],
    responsibilities: [
      'Attitude determination from sensor measurements',
      'Attitude control algorithms and actuator sizing',
      'Orbit determination and propagation',
      'Orbit decay and re-entry analysis',
      'Simulation, validation and hardware-in-the-loop testing',
    ],
    roleOnLisat01:
      'Keeps the AIS antenna pointed at the ocean and the satellite stable enough for a usable downlink.',
    disciplines: ['Control theory', 'Orbital mechanics', 'MATLAB', 'Python', 'Sensor fusion'],
    segment: 'platform',
  },
  {
    slug: 'cdh',
    name: 'Command & Data Handling',
    abbr: 'CDH',
    tagline: 'On-board software architecture and data',
    summary:
      'Our CDH team is the brain of the mission. From executing ground commands to managing data flow between subsystems, we keep the satellite autonomous and mission-ready at all times.',
    description: [
      'Command and Data Handling is responsible for the management and processing of all spacecraft commands and data.',
      'The department designs, implements and operates the on-board computer system: communication between subsystems, execution of commands from the ground station, and data storage management.',
      'The team makes sure the CubeSat operates autonomously, efficiently and securely throughout the mission.',
    ],
    responsibilities: [
      'On-board computer selection and integration',
      'Flight software architecture',
      'Inter-subsystem communication buses',
      'Telecommand execution and telemetry generation',
      'Data storage and memory management',
    ],
    roleOnLisat01:
      'Schedules AIS capture, stores decoded messages and hands them to Communications for downlink.',
    disciplines: ['Embedded C', 'RTOS', 'Flight software', 'Data management', 'Verification'],
    segment: 'platform',
    image: '/images/departments/cdh.jpg',
  },
  {
    slug: 'communications',
    name: 'Communications Systems',
    abbr: 'COMMS',
    tagline: 'RF link, antennas and ground segment',
    summary:
      'Talking to space, and making sure it talks back. Our Communications team builds and tests the systems that transmit, receive and keep the mission in sync.',
    description: [
      'The Communications Systems department ensures that the CubeSat correctly transmits and receives the information the mission depends on.',
      'The department is divided into two main areas: antenna design and RF systems.',
    ],
    responsibilities: [
      'Link budget analysis',
      'Antenna design and characterisation',
      'RF front-end selection and testing',
      'Ground station operation and support',
      'Communications documentation and verification',
    ],
    roleOnLisat01:
      'Closes the link between the spacecraft and the ground stations that receive LISAT-01 telemetry and AIS data.',
    disciplines: ['RF engineering', 'Antenna design', 'Link budgets', 'SDR', 'Ground stations'],
    segment: 'ground',
  },
  {
    slug: 'hardware',
    name: 'Hardware',
    abbr: 'HW',
    tagline: 'Assembly, integration and quality assurance',
    summary:
      'This is the heart of the mission. From design to integration, our Hardware team makes sure the satellite delivers the data and results that truly matter.',
    description: [
      "The Hardware department designs, develops and integrates the satellite's primary scientific and technical instruments: the parts that make the mission objectives achievable.",
      'Responsibilities include defining goals, writing requirements, selecting components and working with suppliers. The department builds prototypes, integrates the payload and runs rigorous tests to ensure it works alongside the rest of the satellite.',
      'The team also coordinates with external partners, maintains documentation and provides operational support during the mission, troubleshooting to optimise payload performance.',
    ],
    responsibilities: [
      'Payload requirements and component selection',
      'Prototyping and board bring-up',
      'Assembly, integration and cable management',
      'Functional testing, reliability and EMC',
      'Supplier coordination and documentation',
    ],
    roleOnLisat01:
      'Builds and integrates the AIS receiver chain and the physical hardware that carries it.',
    disciplines: ['Electronics', 'AIT', 'Reliability', 'EMC', 'Prototyping'],
    segment: 'payload',
  },
  {
    slug: 'power-systems',
    name: 'Power Systems',
    abbr: 'PS',
    tagline: 'Generation, storage and distribution',
    summary:
      "Powering every move, every system, every second. Our team designs, tests and manages the satellite's entire energy flow, from solar panels to battery optimisation.",
    description: [
      "The Power Systems department designs and develops the satellite's power generation, storage and distribution systems, ensuring a reliable supply throughout the mission.",
      'The team selects solar panels, batteries and power-management components, integrates them with the satellite, and performs functional, thermal and load tests.',
      'We work with other departments and external partners, monitor power performance during the mission and troubleshoot to optimise power usage. A dependable supply is critical to every satellite operation.',
    ],
    responsibilities: [
      'Solar panel and battery selection',
      'Power budget analysis',
      'Power-management electronics',
      'Functional, thermal and load testing',
      'In-orbit power performance monitoring',
    ],
    roleOnLisat01:
      'Keeps the spacecraft alive through eclipse and supplies the payload during AIS capture windows.',
    disciplines: ['Power electronics', 'Batteries', 'Photovoltaics', 'Characterisation', 'Testing'],
    segment: 'platform',
  },
  {
    slug: 'structures-thermal',
    name: 'Structures & Thermal Control',
    abbr: 'STC',
    tagline: 'Mechanical design, assembly and thermal',
    summary:
      'From geometric centres to thermal extremes, this team makes sure the satellite holds together and keeps cool.',
    description: [
      "The department's main mission is to guarantee the satellite's structural integrity: studying geometric centres, centres of mass and material behaviour.",
      'It also designs and tests ventilation and energy-dispersion systems to manage the extreme temperatures the spacecraft will face in orbit.',
    ],
    responsibilities: [
      'Structural design of the 1U bus',
      'Mass properties and centre-of-mass control',
      'Material selection and behaviour',
      'Thermal modelling and dissipation design',
      'Structural and thermal simulation',
    ],
    roleOnLisat01:
      'Holds every subsystem inside a 10 × 10 × 10 cm envelope and keeps it within its temperature limits.',
    disciplines: ['CAD', 'FEA', 'Thermal analysis', 'Materials', 'Mechanical testing'],
    segment: 'platform',
    image: '/images/departments/stc.jpg',
  },
  {
    slug: 'hr-logistics',
    name: 'HR & Logistics',
    abbr: 'HR&L',
    tagline: 'People, operations and resources',
    summary:
      'We support the mission from the inside out. HR & Logistics manages people, operations and resources, making sure every team has what it needs to work efficiently and sustainably.',
    description: [
      'The department is the backbone of our organisational structure, focusing on two pillars.',
      'Human Resources: recruitment, internal communication and team well-being, keeping the environment collaborative.',
      "Logistics & Finance: managing the mission's resources, from budget planning to the physical coordination of materials and supplies.",
    ],
    responsibilities: [
      'Recruitment and onboarding',
      'Internal communication and team well-being',
      'Budget planning and grant applications',
      'Material and supply coordination',
      'Process and documentation support',
    ],
    roleOnLisat01:
      'Makes sure the people and the parts are in the right place at the right time.',
    disciplines: ['People operations', 'Finance', 'Grants', 'Logistics', 'Process'],
    segment: 'organisation',
  },
  {
    slug: 'marketing-sponsors',
    name: 'Marketing & Sponsors',
    abbr: 'M&S',
    tagline: 'Communication, outreach and partnerships',
    summary:
      'We make sure LISAT reaches the community as a whole. We secure strategic investment and manage the project’s global communication.',
    description: [
      "The department is responsible for LISAT's public identity and financial sustainability.",
      'Public Relations: managing social media, events and press to share our technical milestones.',
      "Sponsorships: identifying and securing industry partners who share our vision, and managing the mission's funding and corporate relations.",
      'Creative Media: developing the visual language, photography and video that document our journey.',
    ],
    responsibilities: [
      'Partnership outreach and sponsor relations',
      'Social media and press',
      'Event coordination and career fairs',
      'Visual identity and content design',
      'Photography and video',
    ],
    roleOnLisat01:
      'Funds the hardware and tells the story of the mission to partners, students and press.',
    disciplines: ['Communication', 'Partnerships', 'Design', 'Photography', 'Events'],
    segment: 'organisation',
  },
  {
    slug: 'research-development',
    name: 'Research & Development',
    abbr: 'R&D',
    tagline: 'Future missions and applied research',
    summary:
      'R&D looks past LISAT-01, exploring the technologies and mission concepts that could follow it.',
    description: [
      'Research & Development investigates concepts for future LISAT missions and the technologies that would make them possible.',
      // TODO: replace with the department's own description once it is written.
    ],
    responsibilities: ['Future mission research', 'Technology scouting', 'Concept studies'],
    roleOnLisat01:
      'Feeds lessons from LISAT-01 into what the team builds next.',
    disciplines: ['Mission analysis', 'Research', 'Concept design'],
    segment: 'organisation',
  },
]

/** Departments that had a dedicated page on the old site, in display order. */
export const engineeringDepartments = departments.filter(
  (d) => d.segment !== 'organisation',
)

export const organisationDepartments = departments.filter(
  (d) => d.segment === 'organisation',
)

/**
 * Keyed by `string`, not by `DepartmentSlug`, because these lookups now also
 * receive slugs created in Sanity Studio. A miss is expected and handled — the
 * helpers below fall back to the slug itself.
 */
const bySlug = new Map<string, Department>(departments.map((d) => [d.slug, d]))

export function getDepartment(slug: string): Department | undefined {
  return bySlug.get(slug)
}

/**
 * Department slugs created in Sanity Studio, mapped back to the routes on this
 * site.
 *
 * The department pages are generated from the array above, so their addresses
 * are the short slugs. The Studio's were written out in full by whoever
 * created them. Without this map a "See the department" link would point at a
 * page that does not exist.
 *
 * A CMS department with no entry here simply gets no link — never a 404.
 */
const CMS_SLUG_TO_ROUTE: Record<string, DepartmentSlug> = {
  'attitude-determination-and-control-systems': 'adcs',
  'command-and-data-handling': 'cdh',
  'communication-systems': 'communications',
  'structures-and-thermal-control': 'structures-thermal',
  'human-resources-and-logistics': 'hr-logistics',
  'marketing-and-sponsors': 'marketing-sponsors',
}

/**
 * The short, code-side slug for a slug from either source: a Studio slug is
 * translated, a code slug comes back unchanged. Used to match a person from
 * Sanity to the department page they belong on.
 */
export function routeSlug(slug: DepartmentKey): string {
  return CMS_SLUG_TO_ROUTE[slug] ?? slug
}

/** `/departments/…` for a slug from either source, or null if there is no page. */
export function departmentRoute(slug: DepartmentKey): string | null {
  const mapped = CMS_SLUG_TO_ROUTE[slug] ?? (bySlug.has(slug) ? slug : null)
  return mapped ? `/departments/${mapped}` : null
}

/**
 * Every engineering and organisational discipline named across the
 * departments, in order, de-duplicated. Used by the team page as the list of
 * things this team actually does — it is read from the departments, not
 * written by hand.
 */
export const disciplines: string[] = Array.from(
  new Set(departments.flatMap((d) => d.disciplines)),
)

/** Short label for a department slug — used by team cards and filters. */
export function departmentAbbr(slug: DepartmentKey): string {
  return slug === 'board' ? 'Board' : (bySlug.get(slug)?.abbr ?? slug)
}

export function departmentName(slug: DepartmentKey): string {
  return slug === 'board' ? 'Board' : (bySlug.get(slug)?.name ?? slug)
}
