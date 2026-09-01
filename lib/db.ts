import fs from 'fs'
import path from 'path'
import { list, put } from '@vercel/blob'

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
      const result = await list({ prefix: BLOB_DB_NAME, token: process.env.BLOB_READ_WRITE_TOKEN })
      const blob = result.blobs.find((item) => item.pathname === BLOB_DB_NAME)
      if (!blob) {
        let initialData = DEFAULT_DATA
        if (fs.existsSync(DB_PATH)) {
          try {
            initialData = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')) as DbSchema
          } catch (error) {
            console.error('Error importing local database into Vercel Blob:', error)
          }
        }

        await put(BLOB_DB_NAME, JSON.stringify(initialData, null, 2), {
          access: 'public',
          addRandomSuffix: false,
          token: process.env.BLOB_READ_WRITE_TOKEN,
          contentType: 'application/json',
        })
        return initialData
      }

      const response = await fetch(`${blob.url}?v=${blob.uploadedAt}`, { cache: 'no-store' })
      if (!response.ok) throw new Error(`Blob database read failed (${response.status})`)
      return await response.json() as DbSchema
    } catch (error) {
      console.error('Error reading Vercel Blob database:', error)
      throw new Error('Persistent database is unavailable. Check BLOB_READ_WRITE_TOKEN and Blob configuration.')
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
    return JSON.parse(content) as DbSchema
  } catch (error) {
    console.error('Error reading DB:', error)
    return DEFAULT_DATA
  }
}

export async function writeDb(data: DbSchema): Promise<boolean> {
  if (usesBlobStorage()) {
    try {
      await put(BLOB_DB_NAME, JSON.stringify(data, null, 2), {
        access: 'public',
        addRandomSuffix: false,
        token: process.env.BLOB_READ_WRITE_TOKEN,
        contentType: 'application/json',
      })
      return true
    } catch (error) {
      console.error('Error writing Vercel Blob database:', error)
      return false
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

