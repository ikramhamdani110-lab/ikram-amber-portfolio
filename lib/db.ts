import fs from 'fs'
import path from 'path'
import { get, put } from '@vercel/blob'

// Define DB Types
export interface Skill {
  name: string
  note: string
  icon: string
}

export interface SkillGroup {
  num: string
  title: string
  skills: Skill[]
}

export interface JourneyStage {
  num: string
  short: string
  stage: string
  title: string
  body: string
  tags: string[]
}

export interface Certification {
  id: string
  name: string
  organization: string
  date: string
  credentialId?: string
  credentialUrl?: string
  image?: string
  description?: string
  visible: boolean
  order: number
}

export interface PortfolioUpdate {
  id: string
  title: string
  description: string
  date: string
  image?: string
  visible: boolean
  category: 'certification' | 'skill' | 'achievement' | 'experience' | 'update'
}

export interface CustomSocialLink {
  id: string
  name: string
  url: string
  icon?: string
  order: number
}

export interface DbSchema {
  hero: {
    hello: string
    name: string
    title: string
    bio: string
    location: string
    creativeTechnologist: string
    codeWindowFilename: string
    codeWindowCaption: string
    codeLines: { n: number; code: string }[]
    floaters?: { icon: string; className: string; delay: string }[]
  }
  about: {
    photo: string
    fullName: string
    dateOfBirth: string
    age: string
    nationality: string
    education: string
    university: string
    expectedGraduation: string
    languages: string
    status: string
    interests: string
    availability: string
    title: string
    bio: string
    currently: string
    location: string
    focus: string[]
    profileLabel: string
    currentlyLabel: string
    basedInLabel: string
    focusLabel: string
    sectionLabel: string
  }
  skills: {
    title: string
    description: string
    dbTextBadge: string
    aboutSkills: Skill[]
    groups: SkillGroup[]
    sectionLabel: string
  }
  journey: {
    title: string
    stages: JourneyStage[]
    ctaTitle: string
    ctaButtonText: string
    sectionLabel: string
  }
  socials: {
    github: string
    linkedin: string
    email: string
    fiverr?: string
  }
  customSocialLinks: CustomSocialLink[]
  connect: {
    sectionLabel: string
    title: string
    description: string
    githubLabel: string
    githubSubtitle: string
    githubCta: string
    linkedinLabel: string
    linkedinSubtitle: string
    linkedinCta: string
    emailLabel: string
    emailSubtitle: string
    emailCta: string
  }
  siteSettings: {
    metaTitle: string
    metaDescription: string
    wordmark: string
    copyright: string
    favicon: string
  }
  certifications: Certification[]
  certificationsSettings: {
    sectionLabel: string
    title: string
    emptyMessage: string
  }
  updates: PortfolioUpdate[]
  updatesSettings: {
    sectionLabel: string
    title: string
    emptyMessage: string
  }
}

// Set PORTFOLIO_DB_PATH to a persistent mounted file in production.
const DB_PATH = process.env.PORTFOLIO_DB_PATH || path.join(process.cwd(), 'data', 'db.json')
const BLOB_DB_NAME = 'portfolio-db.json'

function usesBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

function safeErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown storage error'
  return process.env.BLOB_READ_WRITE_TOKEN
    ? message.replaceAll(process.env.BLOB_READ_WRITE_TOKEN, '[redacted]')
    : message
}

function normalizeDbData(data: Partial<DbSchema>): DbSchema {
  return {
    ...DEFAULT_DATA,
    ...data,
    hero: { ...DEFAULT_DATA.hero, ...data.hero },
    about: { ...DEFAULT_DATA.about, ...data.about },
    skills: { ...DEFAULT_DATA.skills, ...data.skills },
    journey: { ...DEFAULT_DATA.journey, ...data.journey },
    socials: { ...DEFAULT_DATA.socials, ...data.socials },
    connect: { ...DEFAULT_DATA.connect, ...data.connect },
    siteSettings: { ...DEFAULT_DATA.siteSettings, ...data.siteSettings },
    certificationsSettings: { ...DEFAULT_DATA.certificationsSettings, ...data.certificationsSettings },
    updatesSettings: { ...DEFAULT_DATA.updatesSettings, ...data.updatesSettings },
    customSocialLinks: data.customSocialLinks || DEFAULT_DATA.customSocialLinks,
    certifications: data.certifications || DEFAULT_DATA.certifications,
    updates: data.updates || DEFAULT_DATA.updates,
  }
}

const D = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons'

const DEFAULT_DATA: DbSchema = {
  hero: {
    hello: "Hello, I'm",
    name: "IKRAM",
    title: "Information Science Student & Web Developer",
    bio: "I love turning ideas into digital experiences while exploring software, web technologies, databases, and information systems.",
    location: "Chlef · Algeria",
    creativeTechnologist: "Creative Technologist",
    codeWindowFilename: "ikram.js",
    codeWindowCaption: "built with curiosity",
    codeLines: [
      { n: 1, code: 'const ikram = {' },
      { n: 2, code: '  learns: "technology",' },
      { n: 3, code: '  builds: "web experiences",' },
      { n: 4, code: '  goal: "keep growing"' },
      { n: 5, code: '};' },
    ]
  },
  about: {
    photo: '/uploads/photo_2026-09-01_06-34-10.jpg',
    fullName: 'Ikram Hamdani',
    dateOfBirth: '08 December 2006',
    age: '19',
    nationality: 'Algerian',
    education: 'Licence 3 — Information Science',
    university: 'Hassiba Benbouali University of Chlef',
    expectedGraduation: '2027',
    languages: 'Arabic · French · English',
    status: 'Information Science Student',
    interests: 'Web Development · Software · Databases · Digital Design',
    availability: 'Open to internships, freelance opportunities, and collaborations',
    title: "Curious by nature. Always learning.",
    bio: "I'm an Information Science student interested in software development, web technologies, databases, and information systems. I enjoy learning through experimentation and building practical things that turn ideas into working digital experiences.",
    currently: "Learning → Building → Experimenting",
    location: "Chlef, Algeria",
    focus: ['Web', 'Software', 'Databases'],
    profileLabel: "Profile",
    currentlyLabel: "Currently",
    basedInLabel: "Based in",
    focusLabel: "Focus",
    sectionLabel: "About"
  },
  skills: {
    title: "My digital toolbox.",
    description: "A growing ecosystem of languages and tools I use to learn, build and experiment. Hover a badge to see what it means to me.",
    dbTextBadge: "Database Design",
    sectionLabel: "Skills",
    aboutSkills: [
      { name: 'PYTHON', note: 'Scripting · Data · Automation', icon: `${D}/python/python-original.svg` },
      { name: 'MYSQL', note: 'Queries & relations', icon: `${D}/mysql/mysql-original.svg` },
      { name: 'HTML5', note: 'Semantic structure', icon: `${D}/html5/html5-original.svg` },
      { name: 'GIT', note: 'Version control', icon: `${D}/git/git-original.svg` },
    ],
    groups: [
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
  },
  journey: {
    title: "Learning. Building. Growing.",
    ctaTitle: "Want to see more of my journey?",
    ctaButtonText: "Visit my LinkedIn",
    sectionLabel: "Journey",
    stages: [
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
  },
  socials: {
    github: 'https://github.com/ikramhamdani110-lab',
    linkedin: 'https://www.linkedin.com/in/REPLACE-WITH-YOUR-LINKEDIN',
    email: 'your.email@example.com',
  },
  customSocialLinks: [],
  connect: {
    sectionLabel: "Connect",
    title: "Find me around the web.",
    description: "No forms, no fuss — just the places I actually live online. Follow along, or reach out whenever you like.",
    githubLabel: "GitHub",
    githubSubtitle: "Explore my code",
    githubCta: "Visit GitHub",
    linkedinLabel: "LinkedIn",
    linkedinSubtitle: "See my journey & experiences",
    linkedinCta: "Visit LinkedIn",
    emailLabel: "Email",
    emailSubtitle: "Say hello directly",
    emailCta: "Send Email"
  },
  siteSettings: {
    metaTitle: 'Ikram Hamdani | Information Science Student & Web Developer',
    metaDescription: 'I love turning ideas into digital experiences while exploring software, web technologies, databases, and information systems.',
    wordmark: 'IKRAM',
    copyright: '© 2026 Ikram Hamdani',
    favicon: '/uploads/BCO.4a8408d8-a19f-4b25-84fa-5e00fbb1e8db.png'
  },
  certifications: [],
  certificationsSettings: {
    sectionLabel: "Certifications",
    title: "Certifications & Achievements",
    emptyMessage: "No certifications added yet."
  },
  updates: [],
  updatesSettings: {
    sectionLabel: "Updates",
    title: "What's New",
    emptyMessage: "No updates posted yet."
  }
}

export async function readDb(): Promise<DbSchema> {
  if (usesBlobStorage()) {
    try {
      const blob = await get(BLOB_DB_NAME, {
        access: 'private',
        token: process.env.BLOB_READ_WRITE_TOKEN,
        useCache: false,
      })
      if (!blob) {
        let initialData = DEFAULT_DATA
        if (fs.existsSync(DB_PATH)) {
          try {
            initialData = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')) as DbSchema
          } catch (error) {
            console.error('Error importing local database into Vercel Blob:', error)
          }
        }

        const normalizedData = normalizeDbData(initialData)
        await put(BLOB_DB_NAME, JSON.stringify(normalizedData, null, 2), {
          access: 'private',
          addRandomSuffix: false,
          allowOverwrite: true,
          token: process.env.BLOB_READ_WRITE_TOKEN,
          contentType: 'application/json',
        })
        return normalizedData
      }

      return normalizeDbData(await new Response(blob.stream).json() as Partial<DbSchema>)
    } catch (error) {
      console.error('Error reading Vercel Blob database:', safeErrorMessage(error))
      throw new Error(`Persistent database read failed: ${safeErrorMessage(error)}`)
    }
  }

  try {
    if (!fs.existsSync(DB_PATH)) {
      const dir = path.dirname(DB_PATH)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DATA, null, 2), 'utf-8')
      return DEFAULT_DATA
    }
    const content = fs.readFileSync(DB_PATH, 'utf-8')
    return normalizeDbData(JSON.parse(content) as Partial<DbSchema>)
  } catch (error) {
    console.error('Error reading DB:', error)
    return DEFAULT_DATA
  }
}

export async function writeDb(data: DbSchema): Promise<boolean> {
  if (usesBlobStorage()) {
    try {
      await put(BLOB_DB_NAME, JSON.stringify(data, null, 2), {
        access: 'private',
        addRandomSuffix: false,
        allowOverwrite: true,
        token: process.env.BLOB_READ_WRITE_TOKEN,
        contentType: 'application/json',
      })
      return true
    } catch (error) {
      const message = safeErrorMessage(error)
      console.error('Error writing Vercel Blob database:', message)
      throw new Error(`Persistent database write failed: ${message}`)
    }
  }

  try {
    const dir = path.dirname(DB_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    const tempPath = `${DB_PATH}.${process.pid}.${Date.now()}.tmp`
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8')
    fs.renameSync(tempPath, DB_PATH)
    return true
  } catch (error) {
    console.error('Error writing DB:', error)
    return false
  }
}

