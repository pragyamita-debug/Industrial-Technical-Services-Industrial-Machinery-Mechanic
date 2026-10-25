import type { Resume } from '../lib/types';

/**
 * Everything the page shows comes from this object.
 * Replace the placeholder values with real ones and the whole site updates —
 * no other file needs to change. The numbers in `stats` are what count up.
 */
export const profile: Resume = {
  name: 'Your Name',
  headline: 'Your Role | Your Specialty',
  tagline: 'Your statement, in one clear sentence.',
  email: 'you@example.com',
  phone: '+00 00000 00000',
  location: 'Your City, Country',
  links: {
    linkedin: 'https://www.linkedin.com/',
    github: 'https://github.com/',
  },
  summary:
    'Every section of this page is filled from one profile: skills, experience, projects, results and certifications, with the numbers counting up.',
  motto: 'Built to keep things moving.',

  experience: [
    { role: 'Your Current Role', company: 'Company Name', period: '2023 – Present', current: true, bullets: ['What you are responsible for.', 'A result you are proud of.'] },
    { role: 'Previous Role', company: 'Company Name', period: '2020 – 2023', current: false, bullets: ['What you delivered there.'] },
    { role: 'Earlier Role', company: 'Company Name', period: '2018 – 2020', current: false, bullets: ['Where you started.'] },
  ],

  education: [{ degree: 'Your Degree in Your Subject', short: 'M.Sc.', field: 'Your Subject', institution: 'Your University', year: '2020' }],

  skills: [
    'Skill One',
    'Skill Two',
    'Skill Three',
    'Skill Four',
    'Skill Five',
    'Method One',
    'Method Two',
    'Method Three',
    'Tool One',
    'Tool Two',
    'Tool Three',
    'Tool Four',
  ],

  projects: [
    { title: 'Your Study or Project', description: 'What it was and why it mattered.', tags: ['Method', 'Tool'] },
    { title: 'Project Two', description: 'What it was and why it mattered.', tags: [] },
    { title: 'Project Three', description: 'What it was and why it mattered.', tags: [] },
    { title: 'Project Four', description: 'What it was and why it mattered.', tags: [] },
    { title: 'Project Five', description: 'What it was and why it mattered.', tags: [] },
    { title: 'Project Six', description: 'What it was and why it mattered.', tags: [] },
  ],

  achievements: ['Your First Achievement', 'A Result With A Number', 'An Award You Received', 'A Milestone You Reached', 'Something You Improved'],
  certifications: ['Certification One', 'Certification Two', 'Certification Three'],

  goals: [
    { label: 'Goal', value: 'Your next milestone', note: 'a measurable target' },
    { label: 'Next Step', value: 'What you are working on now' },
  ],

  interests: ['Interest One', 'Interest Two', 'Interest Three', 'Interest Four', 'Interest Five'],

  stats: { years: 5, yearsPlus: true, projects: 6, projectsPlus: false, skills: 12 },
};
