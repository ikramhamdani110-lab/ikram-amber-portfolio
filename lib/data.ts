export type SectionId = 'home' | 'about' | 'skills' | 'certifications' | 'journey' | 'updates' | 'connect'

export const NAV_ITEMS: { id: SectionId; num: string; label: string }[] = [
  { id: 'home', num: '01', label: 'Home' },
  { id: 'about', num: '02', label: 'About' },
  { id: 'skills', num: '03', label: 'Skills' },
  { id: 'certifications', num: '04', label: 'Certifications' },
  { id: 'journey', num: '05', label: 'Journey' },
  { id: 'updates', num: '06', label: 'Updates' },
  { id: 'connect', num: '07', label: 'Connect' },
]

export const SOCIALS = {
  github: 'https://github.com/ikramhamdani110-lab',
  linkedin: 'https://www.linkedin.com/in/REPLACE-WITH-YOUR-LINKEDIN',
  email: 'your.email@example.com',
}

const D = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons'

export type Skill = { name: string; note: string; icon: string }

export const ABOUT_SKILLS: Skill[] = [
  { name: 'PYTHON', note: 'Scripting · Data · Automation', icon: `${D}/python/python-original.svg` },
  { name: 'MYSQL', note: 'Queries & relations', icon: `${D}/mysql/mysql-original.svg` },
  { name: 'HTML5', note: 'Semantic structure', icon: `${D}/html5/html5-original.svg` },
  { name: 'GIT', note: 'Version control', icon: `${D}/git/git-original.svg` },
]

export const SKILL_GROUPS: { num: string; title: string; skills: Skill[] }[] = [
  {
    num: '01',
    title: 'Programming',
    skills: [
      { name: 'C', note: 'Fundamentals · Memory · Logic', icon: `${D}/c/c-original.svg` },
      { name: 'PYTHON', note: 'Scripting · Data · Automation', icon: `${D}/python/python-original.svg` },
      { name: 'JAVA', note: 'OOP · Structured programs', icon: `${D}/java/java-original.svg` },
    ],
  },
  {
    num: '02',
    title: 'Web',
    skills: [
      { name: 'HTML5', note: 'Semantic structure', icon: `${D}/html5/html5-original.svg` },
      { name: 'CSS3', note: 'Layout · Motion · Design', icon: `${D}/css3/css3-original.svg` },
      { name: 'JAVASCRIPT', note: 'Interactivity & logic', icon: `${D}/javascript/javascript-original.svg` },
      { name: 'PHP', note: 'Server-side scripting', icon: `${D}/php/php-original.svg` },
    ],
  },
  {
    num: '03',
    title: 'Databases',
    skills: [
      { name: 'MYSQL', note: 'Queries & relations', icon: `${D}/mysql/mysql-original.svg` },
      { name: 'MARIADB', note: 'Open-source database', icon: `${D}/mariadb/mariadb-original.svg` },
    ],
  },
  {
    num: '04',
    title: 'Tools',
    skills: [
      { name: 'GIT', note: 'Version control', icon: `${D}/git/git-original.svg` },
      { name: 'GITHUB', note: 'Hosting & collaboration', icon: `${D}/github/github-original.svg` },
      { name: 'VS CODE', note: 'My daily editor', icon: `${D}/vscode/vscode-original.svg` },
      { name: 'XAMPP', note: 'Local server stack', icon: `${D}/xampp/xampp-original.svg` },
      { name: 'CODE::BLOCKS', note: 'C/C++ IDE', icon: `${D}/codeblocks/codeblocks-original.svg` },
    ],
  },
]

/* Databases group has a plain text badge (no icon) */
export const DB_TEXT_BADGE = 'Database Design'

export type JourneyStage = {
  num: string
  short: string
  stage: string
  title: string
  body: string
  tags: string[]
}

export const JOURNEY: JourneyStage[] = [
  {
    num: '01',
    short: 'University',
    stage: 'STAGE 01',
    title: 'Information Science',
    body: 'Licence 2 — studying information systems, system modeling and the foundations that connect data, people and software.',
    tags: ['Information Systems', 'System Modeling'],
  },
  {
    num: '02',
    short: 'Programming',
    stage: 'STAGE 02',
    title: 'Foundations of code',
    body: 'Learning to think in logic — algorithms and data structures with C, Python and Java.',
    tags: ['Algorithms', 'Data Structures'],
  },
  {
    num: '03',
    short: 'Web Development',
    stage: 'STAGE 03',
    title: 'Building for the browser',
    body: 'Turning static pages into interactive experiences with HTML, CSS, JavaScript and PHP.',
    tags: ['HTML · CSS · JS', 'PHP'],
  },
  {
    num: '04',
    short: 'Databases',
    stage: 'STAGE 04',
    title: 'Structuring information',
    body: 'Designing and querying relational databases with MySQL and MariaDB.',
    tags: ['Database Design', 'SQL'],
  },
  {
    num: '05',
    short: 'Exploring',
    stage: 'STAGE 05',
    title: 'Always curious',
    body: 'Experimenting with new tools and ideas, and growing a little every single day.',
    tags: ['New tools', 'Side experiments'],
  },
]
