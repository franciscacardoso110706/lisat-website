import type {
  FaqItem,
  RecruitmentGate,
  RecruitmentStatus,
  RecruitmentStep,
} from '@/lib/types'
import { contact } from './site'

/**
 * Recruitment state.
 *
 * Change `status` to flip the whole Join Us page between three modes:
 *   'open'     — applications accepted, `applicationUrl` is used for the CTA
 *   'closed'   — cycle finished, the page explains what happens next
 *   'interest' — no cycle running, visitors can register interest by email
 *
 * Remember to update `window` and `applicationUrl` when a new cycle opens.
 */
export const recruitment = {
  status: 'closed' as RecruitmentStatus,
  /** Human-readable application window, e.g. "18 Feb – 6 Mar". */
  window: '18 February to 6 March',
  /** Set this to the application form when the status is 'open'. */
  applicationUrl: '',
  /** Fallback route used for 'closed' and 'interest'. */
  interestMailto: contact.joinMailto,
  mode: 'Hybrid in Lisbon, with async work',
  averageTimeline: '2–3 weeks',
  /** How many people joined in the most recent cycle. */
  lastIntake: 8,
} as const

export const statusCopy: Record<
  RecruitmentStatus,
  { badge: string; title: string; body: string; cta: string }
> = {
  open: {
    badge: 'Applications open',
    title: 'Applications are open',
    body: 'Pick up to three departments, tell us what you want to work on, and we will take it from there. No previous space experience required.',
    cta: 'Apply to join LISAT',
  },
  closed: {
    badge: 'Applications closed',
    title: 'Applications are closed for this cycle',
    body: 'Selection is in progress. We usually open a new cycle each semester. Send us a note and we will tell you when the next one starts.',
    cta: 'Tell us you are interested',
  },
  interest: {
    badge: 'Register interest',
    title: 'No cycle is running right now',
    body: 'We open recruitment once or twice a year. Leave us your name and what you would like to work on, and you will hear from us first.',
    cta: 'Register your interest',
  },
}

/**
 * Recruitment gates. The `code` values are kept from the current site, where
 * each department is presented as a departure gate.
 */
export const gates: RecruitmentGate[] = [
  {
    code: 'G15',
    department: 'adcs',
    tasks: ['Sensor integration support', 'Algorithm testing', 'Simulation and validation'],
    skills: ['Control', 'MATLAB / Python', 'Testing'],
  },
  {
    code: 'G12',
    department: 'power-systems',
    tasks: ['Battery and power budget support', 'Integration and testing', 'Documentation and verification'],
    skills: ['Electronics', 'Testing', 'Documentation'],
  },
  {
    code: 'G09',
    department: 'communications',
    tasks: ['Link budget support', 'Ground test assistance', 'Documentation and verification'],
    skills: ['RF basics', 'Communications', 'Documentation'],
  },
  {
    code: 'G08',
    department: 'cdh',
    tasks: ['Flight software support', 'Interface testing', 'Data handling and verification'],
    skills: ['Embedded C', 'Software', 'Testing'],
  },
  {
    code: 'G04',
    department: 'structures-thermal',
    tasks: ['CAD and structural support', 'Thermal analysis assistance', 'Material testing'],
    skills: ['CAD', 'Simulation', 'Mechanics'],
  },
  {
    code: 'G01',
    department: 'hardware',
    tasks: ['Assembly support', 'Cable management and integration', 'Basic testing assistance'],
    skills: ['Hands-on', 'Integration', 'Teamwork'],
  },
  {
    code: 'G02',
    department: 'hr-logistics',
    tasks: ['Recruitment and onboarding support', 'Budget and grant assistance', 'Logistics coordination'],
    skills: ['Organisation', 'Communication', 'Process'],
  },
  {
    code: 'G21',
    department: 'marketing-sponsors',
    tasks: ['Partnership outreach', 'Content and design support', 'Event coordination'],
    skills: ['Writing', 'Design', 'Negotiation'],
  },
]

export const steps: RecruitmentStep[] = [
  {
    title: 'Application form',
    description:
      'Fill out the form and pick the departments you would like to join, up to two or three.',
  },
  {
    title: 'First technical task',
    description:
      'A short task related to your department, designed to understand how you approach a problem rather than what you already know.',
  },
  {
    title: 'Second technical task',
    description:
      'A follow-up challenge to see how you work through something with a bit more depth, and how you collaborate.',
  },
  {
    title: 'Interview and onboarding',
    description:
      'A final conversation, then a decision by email. New members get a welcome session, access to our tools, a buddy and their first tasks.',
  },
]

export const faqs: FaqItem[] = [
  {
    question: 'Do I need previous experience?',
    answer:
      'No. Motivation and consistency matter more than what you already know. We onboard and train you.',
  },
  {
    question: 'How many hours per week does it take?',
    answer:
      'It depends on the department and the time of year; exam periods are lighter. We agree expectations with you during onboarding.',
  },
  {
    question: 'Is it remote or on-site?',
    answer:
      'Mostly hybrid: async work during the week with occasional in-person sessions in Lisbon.',
  },
  {
    question: 'What if I do not get my first choice?',
    answer:
      'We may suggest a department that fits your profile better, based on what you are good at and where the project needs people.',
  },
  {
    question: 'Can I switch departments later?',
    answer:
      'Sometimes, after onboarding. It depends on availability and what the project needs at that moment.',
  },
  {
    question: 'Do I have to study at Instituto Superior Técnico?',
    answer:
      'Most of the team is at IST, but we also have members from other faculties. If you are studying in Lisbon and the project interests you, apply.',
  },
]

/** What members get out of it — used by the "What you can learn" section. */
export const whatYouLearn = [
  {
    title: 'Real systems engineering',
    body: 'Requirements, budgets, interfaces, reviews and documentation: the parts of engineering that courses rarely cover.',
  },
  {
    title: 'Hardware you can touch',
    body: 'Prototyping, assembly, integration and test on flight-representative hardware, not a simulation exercise.',
  },
  {
    title: 'Working across disciplines',
    body: 'Mechanical, electrical, software and management people solving the same problem in the same room.',
  },
  {
    title: 'Industry contact',
    body: 'Reviews and visits with partners such as Thales, MEO and the Portuguese Navy, plus conferences and fairs.',
  },
]
