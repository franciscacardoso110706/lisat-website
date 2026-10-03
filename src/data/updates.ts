import type { Update, UpdateCategory } from '@/lib/types'

/**
 * News and milestones, newest first.
 *
 * To publish a new update: add an entry at the top of the array, drop its
 * images in /public/images/updates, and that is it — the index page, the
 * category filter, the homepage preview and /updates/<slug> all pick it up.
 *
 * `body` is an array of paragraphs. Keep `excerpt` under about 180 characters,
 * because it is also used as the page's meta description.
 */
export const updates: Update[] = [
  {
    slug: 'smallsat-europe-2026',
    title: 'LISAT at SmallSat Europe 2026',
    date: '2026-06-07',
    category: 'events',
    excerpt:
      'From May 26 to 28, LISAT attended SmallSat Europe 2026 in Amsterdam, the largest small satellite conference in Europe. A milestone that brought our team closer to the people, companies, and ideas…',
    lead:
      'From May 26 to 28, LISAT attended SmallSat Europe 2026 in Amsterdam, the largest small satellite conference in Europe. A milestone that brought our team closer to the people, companies, and ideas shaping the future of the space industry.',
    readingMinutes: 5,
    cover: {
      src: '/images/updates/smallsat-01.jpg',
      alt: 'SmallSat Europe 2026',
    },
    body: [
      'LISAT attended SmallSat Europe 2026 in Amsterdam, the largest small satellite conference in Europe.',
      'Over three days, our team had the opportunity to learn more about the space industry, its challenges, and its enormous growth potential.',
      'It was an inspiring moment for LISAT: we met outstanding professionals from across the sector, presented our team and our project, and exchanged ideas on how space technology can help address real-world challenges.',
      'More than just attending an international event, this experience represented an important step forward for our team. It started with an ambitious idea, bringing LISAT to Europe’s largest small satellite conference, and became a collective achievement built through teamwork, persistence, and belief in what we are building.',
      'We would like to sincerely thank Raj Khehar, Event Director of SmallSat Europe, for welcoming LISAT and for helping create such a valuable space for connection, learning, and collaboration within the European space ecosystem.',
      'This achievement was also made possible by the support of our partners Xpand IT, Instituto Superior Técnico, and Santander Portugal. Thank you for believing in our mission and helping us take another important step forward.',
      '“The journey is just beginning, but one thing is becoming increasingly clear: we are building Lisbon’s next satellite.”',
      '— Pedro Baptista',
    ],
    gallery: [
      { src: '/images/updates/smallsat-02.jpg', alt: 'LISAT presenting the project in Amsterdam' },
      { src: '/images/updates/smallsat-03.jpg', alt: 'LISAT at RAI Amsterdam' },
      { src: '/images/updates/smallsat-04.jpg', alt: 'SmallSat Europe 2026 event floor' },
      { src: '/images/updates/smallsat-05.jpg', alt: 'LISAT members networking with space industry professionals' },
      { src: '/images/updates/smallsat-06.jpg', alt: 'LISAT at SmallSat Europe 2026' },
    ],
  },
  {
    slug: 'tecnico-open-day',
    title: 'LISAT participates in Técnico Open Day',
    date: '2026-04-18',
    category: 'events',
    excerpt:
      'On 18 April, Técnico opened its doors to over 3,300 visitors for its Open Day. LISAT took part in the Science Fair, welcoming future students, families, and curious minds of all ages.',
    lead:
      'On 18 April, Técnico opened its doors to over 3,300 visitors for its Open Day. LISAT took part in the Science Fair, welcoming future students, families, and curious minds of all ages.',
    readingMinutes: 3,
    cover: {
      src: '/images/updates/openday-01.jpg',
      alt: 'Técnico Open Day',
    },
    body: [
      'On 18 April, Técnico welcomed more than 3,300 visitors for its Open Day, opening the campus to students, families, parents, and children curious about science, engineering, and life at Instituto Superior Técnico.',
      'LISAT took part in the Science Fair, alongside other departments and institutes at IST. Throughout the day, our team presented the LISAT project, explained the mission behind our nanosatellite, and shared how students from different engineering fields are contributing to Portuguese innovation in space.',
      'The event was also an opportunity to connect with future university students and show how space projects can bring together communication systems, electronics, software, structures, operations, and teamwork in a real engineering challenge.',
      '“The perfect place to spark the interest of a new generation in space.”',
      '— João Souto, Head of Communication Systems',
      'We would like to thank Instituto Superior Técnico for organizing this initiative and everyone who visited our stand. Days like this remind us why LISAT exists: to bring curious students closer to space engineering and to help build the future of the Portuguese space sector.',
    ],
  },
  {
    slug: 'recruitment-2026',
    title: 'Your Journey Starts Here - Recruitment 2026',
    date: '2026-03-23',
    category: 'recruitment',
    excerpt:
      'LISAT’s Recruitment 2026 cycle is now complete, marking another important moment in the project’s growth and in the arrival of a new generation of candidates interested in joining the team.',
    lead:
      'LISAT’s Recruitment 2026 cycle is now complete, marking another important moment in the project’s growth and in the arrival of a new generation of candidates interested in joining the team.',
    readingMinutes: 3,
    cover: {
      src: '/images/updates/recruitment26-01.jpg',
      alt: 'Your Journey Starts Here - Recruitment 2026',
    },
    body: [
      'Our 2026 intake reached an important milestone with 75 applications, bringing together candidates from several academic backgrounds and universities across Portugal.',
      'An important step in the process was the team and project presentation meeting held on March 10, which gave candidates the opportunity to better understand LISAT’s mission, structure and expectations.',
      'The process then continued with interviews and practical tasks designed to assess motivation, collaboration and role fit. Final selections are now being aligned with project needs, and the new members are expected to officially integrate into the team soon.',
      'This strong level of interest is an encouraging sign that ambition and talent around space innovation continue to grow. To everyone who applied, thank you for your time, energy and enthusiasm.',
      'Recruitment reel coming soon The video space is already prepared and can be activated as soon as the final file URL is available.',
    ],
  },
  {
    slug: 'two-years-of-lisat',
    title: 'LISAT celebrates 2 years',
    date: '2026-03-11',
    category: 'team',
    excerpt:
      'On March 11, LISAT celebrated its second anniversary. Two years of ambition, teamwork, learning, and progress towards building Lisbon’s next satellite.',
    lead:
      'On March 11, LISAT celebrated its second anniversary. Two years of ambition, teamwork, learning, and progress towards building Lisbon’s next satellite.',
    readingMinutes: 4,
    cover: {
      src: '/images/updates/2years-01.jpg',
      alt: 'LISAT 2 years',
    },
    body: [
      'On March 11, LISAT celebrated two years since the beginning of a project created with a clear ambition: to bring students together around space technology and contribute to the development of the Portuguese space ecosystem.',
      'What started as an idea has grown into a multidisciplinary team, bringing together students from different backgrounds, courses, and institutions. Over these two years, LISAT has evolved through technical work, partnerships, events, outreach, and the continuous effort of everyone who has contributed to the project.',
      'This anniversary is more than a date. It is a moment to look back at everything that has been built and to recognize the people who made it possible: our members, alumni, mentors, partners, and everyone who believed in LISAT from the very beginning.',
      'Two years later, our mission remains stronger than ever. We continue to work towards building Lisbon’s next satellite, while creating opportunities for students to learn, lead, experiment, and take part in real space engineering challenges.',
    ],
    gallery: [
      { src: '/images/updates/2years-02.jpg', alt: 'LISAT members highlight' },
    ],
  },
  {
    slug: 'critical-design-review',
    title: 'Critical Design Review: CubeSat Portugal',
    date: '2025-12-24',
    category: 'mission',
    excerpt:
      'This week, our team completed the Critical Design Review (CDR), one of the most important milestones in the CubeSat Portugal competition. The jury challenged our mission concept, system…',
    lead:
      'This week, our team completed the Critical Design Review (CDR), one of the most important milestones in the CubeSat Portugal competition. The jury challenged our mission concept, system architecture, and technical solutions, helping us refine our project and strengthen our design.',
    readingMinutes: 2,
    cover: {
      // cdr-01 and cdr-04 were stored on their side and have been rotated
      // upright; both are portrait, so a landscape frame is used for the
      // cover and they sit in the gallery instead.
      src: '/images/updates/cdr-02.jpg',
      alt: 'LISAT members presenting at the Critical Design Review',
    },
    body: [
      'Our Critical Design Review marked the conclusion of Phases A/B, following months of intense work, personal dedication, and the delivery of more than 500 pages of technical documentation.',
      'During the session, the jury conducted an in-depth evaluation of our mission architecture, subsystems, operations concept, and risk strategy. Their questions challenged us to defend our decisions and further refine our approach.',
      'This milestone strengthened our team and increased the maturity of our system design. We now await the competition’s decision regarding our progression to Phase B.',
      'We are extremely proud of what has been achieved so far and grateful to all teammates, partners, sponsors, friends of the project, and our universities for their continuous support.',
    ],
    gallery: [
      { src: '/images/updates/cdr-01.jpg', alt: 'A LISAT member taking notes during the review' },
      { src: '/images/updates/cdr-03.jpg', alt: 'The team following the jury’s questions' },
      { src: '/images/updates/cdr-04.jpg', alt: 'Reviewing documentation during the session' },
      { src: '/images/updates/cdr-05.jpg', alt: 'Team members at their laptops during the review' },
    ],
  },
  {
    slug: 'recruitment-onboarding',
    title: 'Wrapping up our latest recruitment with onboarding',
    date: '2025-12-10',
    category: 'recruitment',
    excerpt:
      'Our latest recruitment round, launched in late September, has now officially come to an end with an onboarding meeting held on 2 December. During this session, we welcomed eight new members to…',
    lead:
      'Our latest recruitment round, launched in late September, has now officially come to an end with an onboarding meeting held on 2 December. During this session, we welcomed eight new members to LISAT and brought everyone up to speed on the status of the project, our mission and how each role will contribute to the next steps.',
    readingMinutes: 3,
    cover: {
      src: '/images/updates/onboarding-01.jpg',
      alt: 'Onbourding',
    },
    body: [
      'Our most recent recruitment cycle started in late September and attracted candidates from different universities and backgrounds across Portugal.',
      'After application screening, interviews and practical tasks, we selected eight new team members to join LISAT, reinforcing both our technical and organisational fronts.',
      'To formally close this process, we held an onboarding meeting on 2 December.',
      'The session focused on updating the new members on the current status of the project, outlining our mission and long-term vision, and explaining how each working group contributes to the development of our nanosatellite.',
      'Beyond the technical overview, the meeting was also an opportunity to connect new and existing members, align expectations, and clarify responsibilities for the coming months.',
      'We discussed our roadmap, upcoming deliverables and how collaboration between teams will be key to keeping LISAT progressing at a steady pace.',
      'This recruitment round confirmed that there is strong interest and talent around space projects and student-led initiatives.',
      'To everyone who applied, thank you for your time, energy and enthusiasm, and a special welcome to the eight new members who are now officially part of the LISAT journey.',
    ],
  },
  {
    slug: 'jornadas-do-mar',
    title: 'LISAT showcased at the Jornadas do Mar',
    date: '2025-12-07',
    category: 'events',
    excerpt:
      'From 26 to 28 November 2025, LISAT took part in the Jornadas do Mar at the Portuguese Naval Academy, under the theme “Navegando nos Mares do Conhecimento”.',
    lead:
      'From 26 to 28 November 2025, LISAT took part in the Jornadas do Mar at the Portuguese Naval Academy, under the theme “Navegando nos Mares do Conhecimento”.',
    readingMinutes: 3,
    cover: {
      src: '/images/updates/jornadasdomar-01.jpg',
      alt: 'Jornadas do Mar',
    },
    body: [
      'Since 1998, Jornadas do Mar has established itself as a student-to-student colloquium, designed to energise the university community around knowledge related to the sea.',
      'This initiative promoted by the Marinha Portuguesa, aimed at higher education students, seeks to encourage the presentation and guided thematic discussion, while fostering interaction between students from different higher education institutions and key figures connected to the various fields under debate.',
      'Among the most relevant moments of the programme, three stand out: the convivial dinner held at Farol da Guia on the 27th, the presentation of our project entitled “LISAT-01: nanosatélite 1U para vigilância marítima por AIS na ZEE, Plataforma Continental e Regiões de Busca e Salvamento”, and the Closing Ceremony of Jornadas do Mar 2025, both on the 28th.',
      'We would like to thank the Naval Academy for the opportunity to present our project.',
      'This occasion not only enabled us to showcase our work, but also to strengthen our relationship with an institution whose partnership we deeply value.',
    ],
    gallery: [
      { src: '/images/updates/jornadasdomar-02.jpg', alt: 'Vicente\'s presentation' },
      { src: '/images/updates/jornadasdomar-03.jpg', alt: 'Miguel\'s presentation' },
      { src: '/images/updates/jornadasdomar-04.jpg', alt: 'Marinha\'s ship' },
      { src: '/images/updates/jornadasdomar-05.jpg', alt: 'LISAT showcased at the Jornadas do Mar' },
      { src: '/images/updates/jornadasdomar-06.jpg', alt: 'LISAT showcased at the Jornadas do Mar' },
    ],
  },
  {
    slug: 'tec4defence',
    title: 'LISAT takes part in Téc4Defence and DEM Industry Day',
    date: '2025-11-19',
    category: 'events',
    excerpt:
      'On November 14, the Técnico Innovation Center powered by Fidelidade hosted Téc4Defence, the first event at Instituto Superior Técnico fully dedicated to Defence-related topics. Organized in…',
    lead:
      'On November 14, the Técnico Innovation Center powered by Fidelidade hosted Téc4Defence, the first event at Instituto Superior Técnico fully dedicated to Defence-related topics. Organized in collaboration with the Industry Day of the Department of Mechanical Engineering (DEM), the initiative brought together students, researchers, industry leaders, and policymakers to discuss the growing relevance of Defence and dual-use technologies in the European context.',
    readingMinutes: 3,
    cover: {
      src: '/images/updates/tec4defence-01.jpg',
      alt: 'Téc4Defense',
    },
    body: [
      'The event was jointly organized by several Técnico student groups, including NFIST, AeroTéc, Lisbon’s New Satellite (LISAT), Fórum Mecânica, NEEC, and Técnico Debate Club. As one of the organizing bodies, LISAT played an active role in shaping the program and representing the student community focused on aerospace and satellite engineering.',
      'Throughout the day, participants attended presentations and discussions featuring , the Portuguese Armed Forces, companies such as Thales, MEO, Tekever and CEiiA, and research institutes connected to Técnico. Attendees were also able to explore real prototypes with both civilian and military applications. The program concluded with roundtable sessions involving political decision-makers, addressing the past, present, and future of Defence in Portugal and Europe.',
      'LISAT’s presence at Téc4Defence highlighted the group’s commitment to advancing technological innovation, fostering interdisciplinary collaboration, and contributing to national and European discussions on security and defence.',
    ],
  },
  {
    slug: 'web-summit-2025',
    title: 'From Técnico to Web Summit 2025',
    date: '2025-11-15',
    category: 'events',
    excerpt:
      'From Nov 3rd to the 6th, members of LISAT attended Web Summit 2025 to meet innovators, explore the latest space-tech trends and bring back fresh ideas for our CubeSat mission. Between talks and…',
    lead:
      'From Nov 3rd to the 6th, members of LISAT attended Web Summit 2025 to meet innovators, explore the latest space-tech trends and bring back fresh ideas for our CubeSat mission. Between talks and demo booths, we also challenged ourselves to ask one simple question to several well-known speakers and industry voices.',
    readingMinutes: 4,
    cover: {
      src: '/images/updates/websummit-01.jpg',
      alt: 'Web Summit',
    },
    body: [
      'Since some LISAT members were already attending Web Summit 2025 in representation of Instituto Superior Técnico, we took the opportunity to broaden the spotlight to LISAT itself. Although we didn’t take part in any on-stage presentations, the event was a great chance to connect with people, exchange ideas, and expand awareness of our student group beyond the university environment. We used the Summit to speak with professionals across tech and space and share what LISAT is building.',
      'This year we also tried something different: we approached several well-known speakers and asked a short question:',
      '“How long do you think our satellite takes to go around the Earth?”',
      '- Francisca Cardoso We got quick, honest replies from people such as Lourenço Ortigão, Lilly Sabri, Caroline Garcia and other industry voices. The answers ranged from “24 hours" to “4 days, 7 hours and 23 minutes”, being the right answer only 90 minutes.',
    ],
    gallery: [
      { src: '/images/updates/websummit-02.jpg', alt: 'From Técnico to Web Summit 2025' },
    ],
  },
  {
    slug: 'career-fairs-second-edition',
    title: 'LISAT on Tour: Career Fairs (2nd Edition)',
    date: '2025-09-04',
    category: 'events',
    excerpt:
      'Continuing our journey of presenting LISAT’s work at business fairs, here are the events we participated in up to the beginning of this school year.',
    lead:
      'Continuing our journey of presenting LISAT’s work at business fairs, here are the events we participated in up to the beginning of this school year.',
    readingMinutes: 5,
    cover: {
      src: '/images/updates/careerfairs2-01.jpg',
      alt: 'LISAT on Tour: Career Fairs',
    },
    body: [
      'Over the past months, we have collaborated with some of the most renowned business fairs associated with Instituto Superior Técnico and the Técnico Innovation Center, such as:',
      'PIC Mechanical Engineering (27/06), PIC Aerospace Engineering (01/07) and Welcome Week (01/09).',
      'We also had the chance to participate in the Azeitão Space Party on 28/06, expanding our presence beyond the Técnico community.',
      'With each fair, LISAT had the chance to showcase our project, connect with students and companies, and attract new members excited about space and satellite technology.',
    ],
    gallery: [
      { src: '/images/updates/careerfairs2-02.jpg', alt: 'PIC Eng.Aeroespacial' },
      { src: '/images/updates/careerfairs2-03.jpg', alt: 'Azeitão Space Party' },
    ],
  },
  {
    slug: 'cubesat-portugal-bootcamp',
    title: 'Bootcamp CubeSat Portugal - LISAT Recap',
    date: '2025-07-06',
    category: 'engineering',
    excerpt:
      'On May 19, 20 and 21 we participated in the Portugal Space bootcamp, as part of the CubeSat Portugal competition. An opportunity to receive direct feedback from leading engineers and to meet the…',
    lead:
      'On May 19, 20 and 21 we participated in the Portugal Space bootcamp, as part of the CubeSat Portugal competition. An opportunity to receive direct feedback from leading engineers and to meet the other teams up close.',
    readingMinutes: 7,
    cover: {
      src: '/images/updates/bootcamp-01.jpg',
      alt: 'Bootcamp Recap',
    },
    body: [
      'Throughout the event, we had sessions with the Portuguese Space Agency, ANACOM, NOVASPACE, IST NanoSat Lab, and D-Orbit, which allowed us to clarify several issues related to all areas of our team\'s activity. It was at this event that we took an important step towards our goals.',
      'These experiences are essential for our growth and for establishing ourselves in this sector, always with a focus on the main objective.',
      'We would like to thank the Portuguese Space Agency for this valuable opportunity and all the teams involved for the enriching exchange of ideas.',
      '“It was an excellent initiative by the CubeSat Portugal competition, and we hope to see many more in the future.”',
      '— Manuel Camelo',
    ],
    gallery: [
      { src: '/images/updates/bootcamp-02.jpg', alt: 'Testing bench' },
      { src: '/images/updates/bootcamp-03.jpg', alt: 'Members talking during event' },
      { src: '/images/updates/bootcamp-04.jpg', alt: '1:1 mentoring' },
      { src: '/images/updates/bootcamp-05.jpg', alt: 'LISAT booth and roll-up' },
    ],
  },
  {
    slug: 'career-fairs-first-edition',
    title: 'LISAT on Tour: Career Fairs (1st Edition)',
    date: '2025-05-18',
    category: 'events',
    excerpt:
      'Besides all the events LISAT has participated in, we have also found another effective way to showcase our work and attract new members: taking part in business fairs.',
    lead:
      'Besides all the events LISAT has participated in, we have also found another effective way to showcase our work and attract new members: taking part in business fairs.',
    readingMinutes: 3,
    cover: {
      src: '/images/updates/careerfairs1-01.jpg',
      alt: 'MecanIST fair',
    },
    body: [
      'Over the past months, we have collaborated with some of the most renowned business fairs associated with Instituto Superior Técnico and the Técnico Innovation Center, such as:',
      'Semana Aeroespacial (19/02), MecanIST (27/02), JobShop (29/04) and JEEC (07/05).',
      'With each fair, LISAT had the chance to showcase our project, connect with students and companies, and attract new members excited about space and satellite technology.',
    ],
    gallery: [
      { src: '/images/updates/careerfairs1-02.jpg', alt: 'Semana Aeroespacial fair' },
    ],
  },
  {
    slug: 'lisat-on-tour',
    title: 'LISAT on Tour: Recap',
    date: '2025-05-17',
    category: 'events',
    excerpt:
      'From conferences to industry visits, LISAT has been sharing our passion for space and satellite technology: meeting leaders, showcasing our work, and strengthening the community that supports…',
    lead:
      'From conferences to industry visits, LISAT has been sharing our passion for space and satellite technology: meeting leaders, showcasing our work, and strengthening the community that supports student-led innovation.',
    readingMinutes: 3,
    cover: {
      src: '/images/updates/events-01.jpg',
      alt: 'Events. recap',
    },
    body: [
      'LISAT has been on an exciting journey, sharing our passion for space exploration and satellite technology. Here’s a recap of the events where we\'ve had the opportunity to present our project and connect with the space community:',
      'Inauguration of CINAV-Lab (07/11). This event provided our team with the opportunity to engage with the Minister of Defence Nuno Melo and Admiral Henrique Gouveia e Melo, further solidifying our collaboration with the Portuguese Navy.',
      'Thales (18/11 and 19/02). Both visits aimed to showcase and update our work, learn from leading experts in the field, and consolidate our partnership.',
      'Centro Operacional de Satélites do Continente, MEO (10/12). A memorable experience, offering a firsthand look at real-world antennas and the operations behind critical communications.',
      'P3A Programme Awards - 25/02 Receiving this award energized our team and reaffirmed our commitment to innovation and excellence.',
      'Ariane 6 Launch Event - 09/07 ISTSat-1, Portugal’s first university-built nanosatellite, was launched aboard Ariane 6, with the event celebrated live at Taguspark. The crowd - including the LISAT team - watched the countdown from French Guiana and applauded as the rocket reached orbital altitude. The ceremony highlighted Técnico’s ability to transform ambitious ideas into reality.',
      'With each event, the LISAT project grows stronger and more inspired. Stay tuned as we continue to push the boundaries of student-led satellite development!',
    ],
    gallery: [
      { src: '/images/updates/events-02.jpg', alt: 'LISAT on tour, moments with partners' },
    ],
  },
  {
    slug: 'tecnico-holiday-programme-easter',
    title: 'Técnico Holiday Programme: Easter',
    date: '2025-04-12',
    category: 'team',
    excerpt:
      'On April 12th, 2025, we wrapped up a week-long edition of the Técnico Holiday Programme (Easter, April 7–11), where high-school students visited Técnico and explored hands-on activities led by…',
    lead:
      'On April 12th, 2025, we wrapped up a week-long edition of the Técnico Holiday Programme (Easter, April 7–11), where high-school students visited Técnico and explored hands-on activities led by different student groups. Our workshop, Space Design, challenged teams to plan a complete lunar rescue mission, from objectives to execution.',
    readingMinutes: 2,
    cover: {
      src: '/images/updates/easter-01.jpg',
      alt: 'Técnico Holiday Easter Programme - Easter',
    },
    body: [
      'During the week of April 7–11, several high-school students visited Técnico for the Técnico Holiday Programme (Easter), joining a variety of activities organized by student groups across the school.',
      'Our workshop, Space Design, proposed a space rescue mission to save a team of astronauts stranded on the Moon. Each team had to plan the full mission (objectives, constraints, sequence of maneuvers and key risks) before presenting their plan.',
      'This was the first time our team took part in this programme. It helped us explore new skills as a team while promoting our work and activities, so that future Técnico students may be inspired to join us.',
    ],
    gallery: [
      { src: '/images/updates/easter-02.jpg', alt: 'Mission boards and outputs from the workshop' },
      { src: '/images/updates/easter-03.jpg', alt: 'Teams planning a lunar rescue mission at the working tables' },
    ],
  },
  {
    slug: 'cinav-naval-academy-conference',
    title: 'LISAT showcased at CINAV - Naval Academy Conference',
    date: '2025-04-04',
    category: 'events',
    excerpt:
      'This wednesday, April 2nd, we attended a conference that brought together all researchers from CINAV and the Naval Academy, as well as all projects being developed in partnership with them.',
    lead:
      'This wednesday, April 2nd, we attended a conference that brought together all researchers from CINAV and the Naval Academy, as well as all projects being developed in partnership with them.',
    readingMinutes: 3,
    cover: {
      src: '/images/updates/navalacademy-01.jpg',
      alt: 'CINAV - Naval academy Conference',
    },
    body: [
      'Our Technical Director, Vicente Aroso, had the opportunity to speak with other representatives about their projects and to introduce LISAT in more detail to the Naval Academy students and Marinha Portuguesa officers.',
      'A coffee break followed, providing another networking opportunity to establish valuable contacts for the development of our project.',
      'Our thanks to the Naval Academy for the opportunity of presenting our project. This occasion not only allowed us to showcase our work, but also to engage with an esteemed institution whose expertise and tradition we deeply respect. We look forward to the possibility of strengthening ties in the future.',
    ],
    gallery: [
      { src: '/images/updates/navalacademy-02.jpg', alt: 'CINAV Naval School conference' },
    ],
  },
  {
    slug: 'recruitment-update',
    title: 'Update on the Recruitment Process',
    date: '2025-02-28',
    category: 'recruitment',
    excerpt:
      'Our recruitment has officially wrapped up with a record 110 applications across multiple universities and fields. This response shows how fast interest in innovation and collaboration around LISAT…',
    lead:
      'Our recruitment has officially wrapped up with a record 110 applications across multiple universities and fields. This response shows how fast interest in innovation and collaboration around LISAT is growing.',
    readingMinutes: 3,
    cover: {
      src: '/images/updates/recruitment-01.jpg',
      alt: 'Recruitment: general meeting with candidates',
    },
    body: [
      'Our 2025 intake reached a new milestone with 110 applications, bringing together candidates from several fields and Universities across Portugal.',
      'The process included a general kick-off meeting held last Thursday, followed by interviews and practical tasks designed to assess motivation, collaboration, and role fit. Final selections will be aligned with project needs, and the new members are expected to officially integrate the team in April.',
      'This overwhelming interest is a strong signal that ambition and talent around space innovation are thriving. Therefore, to everyone who applied thank you for your time, energy, and enthusiasm.',
      '“I knew I wanted to be part of the team that would develop Lisbon’s next nanosatellite.”',
      '— Maria Maia',
    ],
    gallery: [
      { src: '/images/updates/recruitment-02.jpg', alt: 'Recruitment: interview round' },
    ],
  },
  {
    slug: 'mentoring-cansat-teams',
    title: 'The experience of mentoring two 12th edition CanSat teams',
    date: '2025-02-04',
    category: 'team',
    excerpt:
      'Our knowledge in satellite development extends beyond our own team; it’s also a valuable resource for others tackling challenges in this field. The CanSat Portugal Competition, organized by Ciência…',
    lead:
      'Our knowledge in satellite development extends beyond our own team; it’s also a valuable resource for others tackling challenges in this field. The CanSat Portugal Competition, organized by Ciência Viva in collaboration with ESERO Portugal, brings together teams of high school students from across the country to design and develop mini-satellites of the size of a soda can. The challenge lies in integrating essential systems, such as power, sensors, and communication, into this incredibly small space.',
    readingMinutes: 5,
    cover: {
      src: '/images/updates/cansat-01.jpg',
      alt: 'Group foto',
    },
    body: [
      'For the 12th edition of the competition, we have had the pleasure of mentoring two outstanding teams:',
      '• IRSAT from Escola Secundária José Saramago, Mafra, which is exploring the development of a low-cost inertial navigation system. Their system is designed to function autonomously in environments lacking GPS signals, such as the surface of Mars, showcasing its potential for space exploration.',
      '• Xanthoria CanSat from Colégio Ribadouro, Porto, which is creating an innovative protective coating for their CanSat. Their solution uses lichens (symbiotic organisms formed by the relationship between fungi and algae) to shield sensitive electronic components from harmful UV radiation.',
      'We are thrilled to announce that both teams have successfully advanced to the final stage of the competition, and we will continue to provide our full support as they work to achieve their goals. We extend our warmest congratulations to IRSAT and Xanthoria for their dedication and innovation.',
    ],
  },
  {
    slug: 'meo-satellite-operations-center',
    title: 'LISAT visits Altice’s Satellite Operations Center (MEO)',
    date: '2024-12-23',
    category: 'partnerships',
    excerpt:
      'On December 10th, our team visited Altice’s Centro Operacional de Satélites do Continente. We had a behind-the-scenes look at the antennas and ground infrastructure that keep critical…',
    lead:
      'On December 10th, our team visited Altice’s Centro Operacional de Satélites do Continente. We had a behind-the-scenes look at the antennas and ground infrastructure that keep critical communications running every day, a visit that deepened our technical understanding and opened doors for future collaboration.',
    readingMinutes: 3,
    cover: {
      src: '/images/updates/altice-01.jpg',
      alt: 'MEO Satellite Operations Center',
    },
    body: [
      'We had the opportunity to learn, on site, how Altice’s ground segment supports national and international communications, from robust antenna systems to real-time monitoring and operations workflows that keep services reliable at scale.',
      'This visit helped our team connect classroom and lab work with real infrastructure, clarifying technical topics across RF, ground stations, and operations. We left with a stronger understanding of the ecosystem and the standards that guide it.',
      'Our thanks to Altice for the warm welcome and the time dedicated to guiding us through the facility. We look forward to future collaboration opportunities that can create impact for students, partners, and the wider community.',
    ],
    gallery: [
      { src: '/images/updates/altice-02.jpg', alt: 'Control room operations' },
      { src: '/images/updates/altice-03.jpg', alt: 'Antenna field, panoramic view' },
      { src: '/images/updates/altice-04.jpg', alt: 'Ground antennas, detail' },
      { src: '/images/updates/altice-05.jpg', alt: 'LISAT visit, team moment' },
    ],
  },
  {
    slug: 'thales-portugal-visit',
    title: 'LISAT\'s first visit to Thales headquarters',
    date: '2024-11-22',
    category: 'partnerships',
    excerpt:
      'On November 18th, our team visited the facilities of Thales Portugal in Paço de Arcos to learn more about the operations of one of our key partners.',
    lead:
      'On November 18th, our team visited the facilities of Thales Portugal in Paço de Arcos to learn more about the operations of one of our key partners.',
    readingMinutes: 4,
    cover: {
      src: '/images/updates/thales-01.jpg',
      alt: 'Thales visit',
    },
    body: [
      'The activity began with a demonstration of Tacticos, a combat management system designed to serve maritime security operations, followed by a demonstration of an air traffic control simulator developed for an airport control tower.',
      'After a short break, we attended presentations by the Marketing & Communication Director of Thales Portugal, Pedro Nunes, the Human Resources Director, Débora Louro, and updates on our team’s progress. The session also included the team responsible for the AEROS MH1 satellite, the second Portuguese satellite to enter orbit, which has been mentoring us throughout the entire project.',
      'We thank Thales Portugal for their support and the opportunity to gain closer insight into the working methods and organization of one of the market leaders in Aeronautics, Space, and Naval Defence.',
      '“Seeing mission-critical systems up close helped us align our engineering priorities with real operational needs.”',
      '— LISAT Team',
    ],
    gallery: [
      { src: '/images/updates/thales-02.jpg', alt: 'LISAT team with Thales staff' },
      { src: '/images/updates/thales-03.jpg', alt: 'Air traffic control simulator' },
      { src: '/images/updates/thales-04.jpg', alt: 'Tacticos system demonstration' },
      { src: '/images/updates/thales-05.jpg', alt: 'Briefing with Thales team' },
      { src: '/images/updates/thales-06.jpg', alt: 'Thales Portugal headquarters, exterior' },
    ],
  },
  {
    slug: 'cinav-lab-inauguration',
    title: 'Participation in the Inauguration of CINAV-Lab',
    date: '2024-11-19',
    category: 'events',
    excerpt:
      'On November 7th, LISAT attended the inauguration of CINAV-Lab, the new Robotics, Decision Support Systems, and Artificial Intelligence Laboratory at the Portuguese Navy’s Naval Research Center.',
    lead:
      'On November 7th, LISAT attended the inauguration of CINAV-Lab, the new Robotics, Decision Support Systems, and Artificial Intelligence Laboratory at the Portuguese Navy’s Naval Research Center.',
    readingMinutes: 3,
    cover: {
      src: '/images/updates/cinav-01.jpg',
      alt: 'LISAT members at CINAV-Lab',
    },
    body: [
      'The inauguration gathered several distinguished figures, including the Minister of Defense, Nuno Melo, and the Chief of the Naval Staff and National Maritime Authority, Admiral Henrique Gouveia e Melo. Representatives from Instituto Superior Técnico, such as Professor Alexandra Moutinho and Professor Hugo Policarpo, were also present, highlighting the value of academic–industry collaboration.',
      'For LISAT, being present at this milestone was both an honor and an opportunity to align our mission with the Portuguese Navy’s vision. These connections serve as strong foundations for our future success.',
      'The event underscored the importance of collaborative efforts between military, academic, and technological stakeholders in driving progress and ensuring operational excellence.',
    ],
    gallery: [
      { src: '/images/updates/cinav-02.jpg', alt: 'Minister of Defense and Navy representatives at CINAV-Lab' },
      { src: '/images/updates/cinav-03.jpg', alt: 'Professors and Navy representatives during event' },
      { src: '/images/updates/cinav-04.jpg', alt: 'Networking and discussions at the inauguration' },
    ],
  },
]

export const updateCategories: { id: UpdateCategory; label: string }[] = [
  { id: 'mission', label: 'Mission' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'events', label: 'Events' },
  { id: 'team', label: 'Team' },
  { id: 'partnerships', label: 'Partnerships' },
  { id: 'recruitment', label: 'Recruitment' },
]

const labels = new Map(updateCategories.map((c) => [c.id, c.label]))

export function categoryLabel(id: UpdateCategory): string {
  return labels.get(id) ?? id
}

/** Categories that actually have posts, used to build the filter bar. */
export const activeCategories = updateCategories.filter((c) =>
  updates.some((u) => u.category === c.id),
)

export function getUpdate(slug: string): Update | undefined {
  return updates.find((u) => u.slug === slug)
}

/** The most recent updates, for the homepage. */
export function latestUpdates(count: number): Update[] {
  return updates.slice(0, count)
}

/** Other posts to show at the foot of an article. */
export function relatedUpdates(slug: string, count = 3): Update[] {
  const current = getUpdate(slug)
  if (!current) return updates.slice(0, count)
  const sameCategory = updates.filter(
    (u) => u.slug !== slug && u.category === current.category,
  )
  const rest = updates.filter(
    (u) => u.slug !== slug && u.category !== current.category,
  )
  return [...sameCategory, ...rest].slice(0, count)
}
