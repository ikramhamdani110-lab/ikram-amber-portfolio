'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Lock,
  Plus,
  Trash2,
  Edit,
  Save,
  ArrowUp,
  ArrowDown,
  Check,
  LogOut,
  Globe,
  Award,
  BookOpen,
  Briefcase,
  User,
  Settings,
  Bell,
  Upload,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw,
  FolderPlus,
  Code,
  Moon,
  Sun
} from 'lucide-react'
import type { DbSchema, Certification, PortfolioUpdate, Skill, SkillGroup, JourneyStage } from '@/lib/db'

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState<
    'overview' | 'profile' | 'skills' | 'journey' | 'certifications' | 'socials' | 'updates' | 'settings' | 'security'
  >('overview')
  const [theme, setTheme] = useState<'dark' | 'light'>('light')

  // Db State
  const [db, setDb] = useState<DbSchema | null>(null)
  const [loadingDb, setLoadingDb] = useState(false)
  const [saveStatus, setSaveStatus] = useState<string>('')

  // Initialize theme - default to light for admin dashboard
  useEffect(() => {
    try {
      const savedAdminTheme = localStorage.getItem('admin-theme')
      if (savedAdminTheme === 'dark' || savedAdminTheme === 'light') {
        setTheme(savedAdminTheme)
      } else {
        // Default to light mode for admin dashboard
        setTheme('light')
        localStorage.setItem('admin-theme', 'light')
      }
    } catch (err) {
      console.error('Error reading admin theme from localStorage:', err)
    }
  }, [])

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('light', theme === 'light')
  }, [theme])

  // Check auth
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/check')
        const json = await res.json()
        setIsAuthenticated(json.authenticated)
        if (json.authenticated) {
          loadPortfolioData()
        }
      } catch (err) {
        setIsAuthenticated(false)
      }
    }
    checkAuth()
  }, [])

  // Load db data
  async function loadPortfolioData() {
    setLoadingDb(true)
    try {
      const res = await fetch('/api/portfolio', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setDb(data)
      }
    } catch (err) {
      console.error('Failed to load portfolio data', err)
    } finally {
      setLoadingDb(false)
    }
  }

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        setIsAuthenticated(true)
        loadPortfolioData()
      } else {
        const err = await res.json()
        setLoginError(err.error || 'Invalid credentials')
      }
    } catch (err) {
      setLoginError('Server connection error')
    }
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setIsAuthenticated(false)
      setDb(null)
      setPassword('')
    } catch (err) {
      console.error('Logout error', err)
    }
  }

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem('admin-theme', nextTheme)
      } catch (err) {
        console.error('Error saving admin theme to localStorage:', err)
      }
      return nextTheme
    })
  }

  // Generic Save Helper
  const saveSectionData = async (section: string, payload: any) => {
    if (saveStatus === 'saving') return
    setSaveStatus('saving')
    try {
      const res = await fetch(`/api/admin/${section}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        const result = await res.json()
        setSaveStatus('success')
        setTimeout(() => setSaveStatus(''), 2000)
        // Refresh local DB
        await loadPortfolioData()
        return result
      } else {
        const result = await res.json().catch(() => null)
        setSaveStatus(`error:${result?.error || `Save failed (${res.status})`}`)
      }
    } catch (err) {
      setSaveStatus(`error:${err instanceof Error ? err.message : 'Unable to reach the server while saving'}`)
    }
  }

  // Image Upload helper
  const uploadImage = async (file: File): Promise<string> => {
    if (file.size > 5 * 1024 * 1024) throw new Error('Image must be 5 MB or smaller')
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      throw new Error('Only JPEG, PNG, GIF, and WebP images are allowed')
    }
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) throw new Error('Upload failed')
    const json = await res.json()
    return json.path
  }

  // Render Login Screen
  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground font-mono text-xs">
        Checking secure session...
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-2xl dark:bg-[#0e0b0d]">
          <div className="flex flex-col items-center text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-accent-soft text-[#201319] mb-4 dark:text-[#201319]">
              <Lock className="size-6" />
            </div>
            <h1 className="font-serif text-3xl font-light">Admin Access</h1>
            <p className="mt-2 text-xs font-mono text-muted-foreground uppercase tracking-widest">
              Ikram Hamdani Portfolio
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                Security Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-border bg-background p-4 text-sm focus:border-accent outline-none transition-colors text-foreground dark:bg-[#0e0b0d]"
              />
            </div>

            {loginError && (
              <div className="flex items-center gap-2 rounded-xl bg-red-950/30 border border-red-900/50 p-3 text-xs text-red-400 dark:bg-red-950/30 dark:border-red-900/50">
                <AlertCircle className="size-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-accent-soft py-4 text-sm font-medium text-[#201319] transition-transform hover:-translate-y-0.5 dark:text-[#201319]"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (loadingDb || !db) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground font-mono text-xs">
        Loading CMS configurations...
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground md:flex">
      <aside className="w-full shrink-0 border-b border-border bg-card p-4 dark:bg-[#0e0b0d] md:sticky md:top-0 md:flex md:h-screen md:w-64 md:flex-col md:justify-between md:overflow-y-auto md:border-b-0 md:border-r md:p-6">
        <div>
          <div className="mb-5 font-serif text-xl font-medium tracking-tight sm:text-2xl md:mb-8">
            IKRAM<span className="text-accent">.</span> Dashboard
          </div>

          <nav className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:block md:space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: Globe },
              { id: 'profile', label: 'Profile & Hero', icon: User },
              { id: 'skills', label: 'Skills', icon: RefreshCw },
              { id: 'certifications', label: 'Certifications', icon: Award },
              { id: 'journey', label: 'Journey Stages', icon: BookOpen },
              { id: 'socials', label: 'Social Links', icon: Globe },
              { id: 'updates', label: 'Updates Feed', icon: Bell },
              { id: 'settings', label: 'Site Settings', icon: Settings },
              { id: 'security', label: 'Security', icon: Lock },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                    className={`flex min-h-11 w-full items-center gap-2 rounded-2xl px-3 py-3 text-left text-[10px] font-mono uppercase tracking-wider transition-colors sm:text-xs md:gap-3 md:px-4 ${
                    isActive
                      ? 'bg-accent-soft text-[#201319] dark:text-[#201319]'
                      : 'text-muted-foreground hover:bg-background hover:text-foreground dark:hover:bg-card dark:hover:text-foreground'
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="mt-4 border-t border-border/40 pt-4 md:mt-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:text-red-400 dark:hover:text-red-400 transition-colors"
          >
            <LogOut className="size-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="min-w-0 w-full max-w-5xl flex-1 overflow-y-auto p-4 sm:p-6 md:mx-auto md:p-10">
        {/* Header bar */}
        <div className="mb-6 flex flex-col gap-4 border-b border-border/40 pb-5 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-serif text-3xl font-light uppercase tracking-tight">
              {activeTab.replace('-', ' ')}
            </h2>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-1">
              CMS Panel / {activeTab}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {saveStatus === 'saving' && (
              <span className="text-xs font-mono text-accent animate-pulse">Saving changes...</span>
            )}
            {saveStatus === 'success' && (
              <span className="text-xs font-mono text-green-400 flex items-center gap-1">
                <Check className="size-3.5" /> Saved!
              </span>
            )}
            {saveStatus.startsWith('error:') && (
              <span className="text-xs font-mono text-red-400 flex items-center gap-1">
                <AlertCircle className="size-3.5" /> {saveStatus.slice(6)}
              </span>
            )}
            <button
              onClick={handleToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="rounded-full border border-border px-3 py-2 text-[10px] font-mono uppercase tracking-wider hover:border-accent hover:text-accent transition-colors flex items-center gap-2"
            >
              {theme === 'dark' ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            <a
              href="/"
              target="_blank"
              className="rounded-full border border-border px-4 py-2 text-[10px] font-mono uppercase tracking-wider hover:border-accent hover:text-accent transition-colors"
            >
              View Site
            </a>
          </div>
        </div>

        {/* CMS TAB CONTENTS */}
        {activeTab === 'overview' && (
          <OverviewTab db={db} setActiveTab={setActiveTab} />
        )}
        {activeTab === 'profile' && (
          <ProfileTab db={db} save={saveSectionData} uploadImage={uploadImage} />
        )}
        {activeTab === 'skills' && (
          <SkillsTab db={db} save={saveSectionData} />
        )}
        {activeTab === 'journey' && (
          <JourneyTab db={db} save={saveSectionData} />
        )}
        {activeTab === 'certifications' && (
          <CertificationsTab db={db} save={saveSectionData} uploadImage={uploadImage} />
        )}
        {activeTab === 'socials' && (
          <SocialsTab db={db} save={saveSectionData} uploadImage={uploadImage} />
        )}
        {activeTab === 'updates' && (
          <UpdatesTab db={db} save={saveSectionData} uploadImage={uploadImage} />
        )}
        {activeTab === 'settings' && (
          <SettingsTab db={db} save={saveSectionData} />
        )}
        {activeTab === 'security' && (
          <SecurityTab />
        )}
      </main>
    </div>
  )
}

// ----------------------------------------------------
// 1. OVERVIEW TAB
// ----------------------------------------------------
function OverviewTab({ db, setActiveTab }: { db: DbSchema; setActiveTab: any }) {
  const visibleCerts = db.certifications?.filter((c) => c.visible !== false) || []
  const visibleUpdates = db.updates?.filter((u) => u.visible !== false) || []

  return (
    <div className="space-y-8">
      {/* Quick stats grid */}
      <div className="grid gap-5 sm:grid-cols-4">
        {[
          { label: 'Skill Badges', count: db.skills?.aboutSkills?.length + (db.skills?.groups?.reduce((acc, curr) => acc + curr.skills.length, 0) || 0), tab: 'skills' },
          { label: 'Certifications', count: db.certifications?.length || 0, tab: 'certifications' },
          { label: 'Journey Stages', count: db.journey?.stages?.length || 0, tab: 'journey' },
          { label: 'Updates Posted', count: db.updates?.length || 0, tab: 'updates' },
        ].map((stat, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(stat.tab)}
            className="text-left rounded-3xl border border-border bg-card p-6 hover:border-accent transition-colors shadow-sm dark:bg-[#0e0b0d] dark:shadow-none"
          >
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </div>
            <div className="font-serif text-4xl font-light mt-3">{stat.count}</div>
          </button>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid gap-6 md:grid-cols-1">
        <div className="rounded-3xl border border-border bg-card/40 p-7 dark:bg-card/40">
          <h3 className="font-serif text-xl font-light mb-4">Quick Content Creator</h3>
          <div className="grid gap-3">
            <button
              onClick={() => setActiveTab('certifications')}
              className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 text-xs font-mono uppercase tracking-wider hover:border-accent text-left dark:bg-[#0e0b0d]"
            >
              Add New Certification
              <Plus className="size-4 text-accent" />
            </button>
            <button
              onClick={() => setActiveTab('updates')}
              className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 text-xs font-mono uppercase tracking-wider hover:border-accent text-left dark:bg-[#0e0b0d]"
            >
              Post a What&apos;s New Update
              <Plus className="size-4 text-accent" />
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 text-xs font-mono uppercase tracking-wider hover:border-accent text-left dark:bg-[#0e0b0d]"
            >
              Add New Technical Skill
              <Plus className="size-4 text-accent" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ----------------------------------------------------
// 2. PROFILE & HERO TAB
// ----------------------------------------------------
function ProfileTab({ db, save, uploadImage }: { db: DbSchema; save: any; uploadImage: any }) {
  const [hello, setHello] = useState(db.hero?.hello || '')
  const [name, setName] = useState(db.hero?.name || '')
  const [title, setTitle] = useState(db.hero?.title || '')
  const [bio, setBio] = useState(db.hero?.bio || '')
  const [location, setLocation] = useState(db.hero?.location || '')
  const [creative, setCreative] = useState(db.hero?.creativeTechnologist || '')
  const [exploreLabel, setExploreLabel] = useState(db.hero?.exploreLabel || 'Explore')
  const [aboutLabel, setAboutLabel] = useState(db.hero?.aboutLabel || 'About Me')
  
  // profile card fields
  const [aboutPhoto, setAboutPhoto] = useState(db.about?.photo || '/uploads/photo_2026-09-01_06-34-10.jpg')
  const [fullName, setFullName] = useState(db.about?.fullName || 'Ikram Hamdani')
  const [aboutTitle, setAboutTitle] = useState(db.about?.title || '')
  const [aboutBio, setAboutBio] = useState(db.about?.bio || '')
  const [dateOfBirth, setDateOfBirth] = useState(db.about?.dateOfBirth || '08 December 2006')
  const [age, setAge] = useState(db.about?.age || '19')
  const [nationality, setNationality] = useState(db.about?.nationality || 'Algerian')
  const [education, setEducation] = useState(db.about?.education || 'Licence 3 — Information Science')
  const [university, setUniversity] = useState(db.about?.university || 'Hassiba Benbouali University of Chlef')
  const [expectedGraduation, setExpectedGraduation] = useState(db.about?.expectedGraduation || '2027')
  const [languages, setLanguages] = useState(db.about?.languages || 'Arabic · French · English')
  const [status, setStatus] = useState(db.about?.status || 'Information Science Student')
  const [interests, setInterests] = useState(db.about?.interests || 'Web Development · Software · Databases · Digital Design')
  const [availability, setAvailability] = useState(db.about?.availability || 'Open to internships, freelance opportunities, and collaborations')
  const [currently, setCurrently] = useState(db.about?.currently || '')
  const [aboutLocation, setAboutLocation] = useState(db.about?.location || '')
  const [focusInput, setFocusInput] = useState(db.about?.focus?.join(', ') || '')
  const [profileLabel, setProfileLabel] = useState(db.about?.profileLabel || 'Profile')
  const [currentlyLabel, setCurrentlyLabel] = useState(db.about?.currentlyLabel || 'Currently')
  const [basedInLabel, setBasedInLabel] = useState(db.about?.basedInLabel || 'Based in')
  const [focusLabel, setFocusLabel] = useState(db.about?.focusLabel || 'Focus')
  const [statusLabel, setStatusLabel] = useState(db.about?.statusLabel || 'Status')
  const [interestsLabel, setInterestsLabel] = useState(db.about?.interestsLabel || 'Interests')
  const [aboutSectionLabel, setAboutSectionLabel] = useState(db.about?.sectionLabel || 'About')

  // Code editor lines
  const [codeLines, setCodeLines] = useState<{ n: number; code: string }[]>(db.hero?.codeLines || [])
  const [codeFilename, setCodeFilename] = useState(db.hero?.codeWindowFilename || 'ikram.js')
  const [codeCaption, setCodeCaption] = useState(db.hero?.codeWindowCaption || 'built with curiosity')

  // Code editor editing helpers
  const handleCodeLineChange = (index: number, val: string) => {
    const lines = [...codeLines]
    lines[index].code = val
    setCodeLines(lines)
  }

  const handleAboutPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      setAboutPhoto(await uploadImage(file))
    } catch (error) {
      console.error('About photo upload failed', error)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    save('profile', {
      hero: {
        hello,
        name,
        title,
        bio,
        location,
        creativeTechnologist: creative,
        exploreLabel,
        aboutLabel,
        codeLines,
        codeWindowFilename: codeFilename,
        codeWindowCaption: codeCaption,
      },
      about: {
        photo: aboutPhoto,
        fullName,
        dateOfBirth,
        age,
        nationality,
        education,
        university,
        expectedGraduation,
        languages,
        status,
        interests,
        availability,
        currently,
        location: aboutLocation,
        focus: focusInput.split(',').map(f => f.trim()).filter(Boolean),
        title: aboutTitle,
        bio: aboutBio,
        profileLabel,
        currentlyLabel,
        basedInLabel,
        focusLabel,
        statusLabel,
        interestsLabel,
        sectionLabel: aboutSectionLabel
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Hero section group */}
      <div className="rounded-3xl border border-border bg-card/40 p-7 space-y-5 dark:bg-card/40">
        <h3 className="font-serif text-xl font-light border-b border-border/40 pb-3 flex items-center gap-2">
          <Sparkles className="size-4 text-accent" /> Hero Section Title & Bio
        </h3>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Explore button label</label>
            <input type="text" value={exploreLabel} onChange={(e) => setExploreLabel(e.target.value)} className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]" />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">About button label</label>
            <input type="text" value={aboutLabel} onChange={(e) => setAboutLabel(e.target.value)} className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]" />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Greeting text</label>
            <input
              type="text"
              value={hello}
              onChange={(e) => setHello(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Name Title</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground font-serif dark:bg-[#0e0b0d]"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Subtitle / Profession Tagline</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground font-serif text-lg dark:bg-[#0e0b0d]"
          />
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Introductory Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full rounded-2xl border border-border bg-background p-4 text-sm focus:border-accent outline-none text-foreground leading-relaxed dark:bg-[#0e0b0d]"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Location string</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Role/Tagline metadata</label>
            <input
              type="text"
              value={creative}
              onChange={(e) => setCreative(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
            />
          </div>
        </div>
      </div>

      {/* Code window emulator */}
      <div className="rounded-3xl border border-border bg-card/40 p-7 space-y-5 dark:bg-card/40">
        <h3 className="font-serif text-xl font-light border-b border-border/40 pb-3 flex items-center gap-2">
          <Code className="size-4 text-accent" /> Hero Code Simulator Window
        </h3>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Window tab filename</label>
            <input
              type="text"
              value={codeFilename}
              onChange={(e) => setCodeFilename(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground font-mono dark:bg-[#0e0b0d]"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Caption note</label>
            <input
              type="text"
              value={codeCaption}
              onChange={(e) => setCodeCaption(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground italic dark:bg-[#0e0b0d]"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Interactive Code Lines</label>
          <div className="space-y-2 bg-background border border-border/60 rounded-2xl p-5 dark:bg-[#0e0b0d]">
            {codeLines.map((line, i) => (
              <div key={line.n} className="flex items-center gap-4">
                <span className="font-mono text-xs text-muted-foreground w-4 text-right">{line.n}</span>
                <input
                  type="text"
                  value={line.code}
                  onChange={(e) => handleCodeLineChange(i, e.target.value)}
                  className="flex-1 bg-transparent border-b border-border/30 outline-none focus:border-accent font-mono text-sm text-accent py-1 dark:border-white/5 dark:text-[#e6a4c4]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Section details */}
      <div className="rounded-3xl border border-border bg-card/40 p-7 space-y-5 dark:bg-card/40">
        <h3 className="font-serif text-xl font-light border-b border-border/40 pb-3 flex items-center gap-2">
          <User className="size-4 text-accent" /> About Section Card Info
        </h3>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Status label</label>
            <input type="text" value={statusLabel} onChange={(e) => setStatusLabel(e.target.value)} className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]" />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Interests label</label>
            <input type="text" value={interestsLabel} onChange={(e) => setInterestsLabel(e.target.value)} className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]" />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">About section title</label>
          <input type="text" value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground font-serif dark:bg-[#0e0b0d]" />
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">About section bio</label>
          <textarea value={aboutBio} onChange={(e) => setAboutBio(e.target.value)} rows={4} className="w-full rounded-2xl border border-border bg-background p-4 text-sm focus:border-accent outline-none text-foreground leading-relaxed dark:bg-[#0e0b0d]" />
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-background p-4 sm:flex-row sm:items-center dark:bg-[#0e0b0d]">
          <img src={aboutPhoto} alt="About portrait preview" className="size-24 rounded-xl border border-[#e6a4c4]/60 object-cover object-center" />
          <div className="space-y-2">
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">About portrait</label>
            <input type="file" accept="image/*" onChange={handleAboutPhotoChange} className="block max-w-full text-xs text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-accent-soft file:px-3 file:py-2 file:text-[10px] file:font-mono file:uppercase file:text-[#201319]" />
            <p className="break-all text-[10px] text-muted-foreground">{aboutPhoto}</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {[
            ['Full Name', fullName, setFullName],
            ['Date of Birth', dateOfBirth, setDateOfBirth],
            ['Age', age, setAge],
            ['Nationality', nationality, setNationality],
            ['Current Education', education, setEducation],
            ['University', university, setUniversity],
            ['Expected Graduation', expectedGraduation, setExpectedGraduation],
            ['Languages', languages, setLanguages],
            ['Status', status, setStatus],
            ['Interests', interests, setInterests],
            ['Availability', availability, setAvailability],
          ].map(([label, value, setter]) => (
            <div key={label as string} className={label === 'Availability' ? 'sm:col-span-2' : ''}>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">{label as string}</label>
              <input type="text" value={value as string} onChange={(e) => (setter as (value: string) => void)(e.target.value)} className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]" />
            </div>
          ))}
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Currently doing</label>
          <input
            type="text"
            value={currently}
            onChange={(e) => setCurrently(e.target.value)}
            placeholder="Learning → Building → Experimenting"
            className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground font-serif dark:bg-[#0e0b0d]"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Based in City, Country</label>
            <input
              type="text"
              value={aboutLocation}
              onChange={(e) => setAboutLocation(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Focus tags (comma-separated)</label>
            <input
              type="text"
              value={focusInput}
              onChange={(e) => setFocusInput(e.target.value)}
              placeholder="Web, Software, Databases"
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Profile Card Label</label>
            <input
              type="text"
              value={profileLabel}
              onChange={(e) => setProfileLabel(e.target.value)}
              placeholder="Profile"
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Currently Label</label>
            <input
              type="text"
              value={currentlyLabel}
              onChange={(e) => setCurrentlyLabel(e.target.value)}
              placeholder="Currently"
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Based In Label</label>
            <input
              type="text"
              value={basedInLabel}
              onChange={(e) => setBasedInLabel(e.target.value)}
              placeholder="Based in"
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Focus Label</label>
            <input
              type="text"
              value={focusLabel}
              onChange={(e) => setFocusLabel(e.target.value)}
              placeholder="Focus"
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Navigation Section Label</label>
          <input
            type="text"
            value={aboutSectionLabel}
            onChange={(e) => setAboutSectionLabel(e.target.value)}
            placeholder="About"
            className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
          />
        </div>
      </div>

      <button
        type="submit"
        className="rounded-full bg-accent-soft px-8 py-3.5 text-xs font-mono uppercase tracking-wider text-[#201319] hover:bg-accent transition-transform hover:-translate-y-0.5 dark:text-[#201319]"
      >
        Save Profile Configurations
      </button>
    </form>
  )
}

// ----------------------------------------------------
// 3. SKILLS TAB
// ----------------------------------------------------
function SkillsTab({ db, save }: { db: DbSchema; save: any }) {
  const [title, setTitle] = useState(db.skills?.title || '')
  const [description, setDescription] = useState(db.skills?.description || '')
  const [dbTextBadge, setDbTextBadge] = useState(db.skills?.dbTextBadge || '')
  const [sectionLabel, setSectionLabel] = useState(db.skills?.sectionLabel || 'Skills')
  
  // local copy of skills inside groups
  const [groups, setGroups] = useState<SkillGroup[]>(db.skills?.groups || [])
  const [aboutSkills, setAboutSkills] = useState<Skill[]>(db.skills?.aboutSkills || [])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    save('skills', {
      title,
      description,
      dbTextBadge,
      sectionLabel,
      aboutSkills,
      groups,
    })
  }

  // Edit fields helper
  const updateGroupSkill = (groupIndex: number, skillIndex: number, key: keyof Skill, value: string) => {
    const updated = [...groups]
    updated[groupIndex].skills[skillIndex] = {
      ...updated[groupIndex].skills[skillIndex],
      [key]: value,
    }
    setGroups(updated)
  }

  const deleteGroupSkill = (groupIndex: number, skillIndex: number) => {
    const updated = [...groups]
    updated[groupIndex].skills = updated[groupIndex].skills.filter((_, idx) => idx !== skillIndex)
    setGroups(updated)
  }

  const addGroupSkill = (groupIndex: number) => {
    const updated = [...groups]
    updated[groupIndex].skills.push({
      name: 'NEW SKILL',
      note: 'Skill details',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'
    })
    setGroups(updated)
  }

  // Edit main about skills badge list
  const updateAboutSkill = (index: number, key: keyof Skill, value: string) => {
    const updated = [...aboutSkills]
    updated[index] = { ...updated[index], [key]: value }
    setAboutSkills(updated)
  }

  const addAboutSkill = () => {
    setAboutSkills([
      ...aboutSkills,
      { name: 'SKILL', note: 'Hover text', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' }
    ])
  }

  const deleteAboutSkill = (index: number) => {
    setAboutSkills(aboutSkills.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="rounded-3xl border border-border bg-card/40 p-7 space-y-5 dark:bg-card/40">
        <h3 className="font-serif text-xl font-light border-b border-border/40 pb-3">Skills Page Text</h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Section title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground font-serif dark:bg-[#0e0b0d]"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Navigation Section Label</label>
            <input
              type="text"
              value={sectionLabel}
              onChange={(e) => setSectionLabel(e.target.value)}
              placeholder="Skills"
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Databases Text Badge</label>
            <input
              type="text"
              value={dbTextBadge}
              onChange={(e) => setDbTextBadge(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground font-serif dark:bg-[#0e0b0d]"
            />
          </div>
        </div>
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Short Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
          />
        </div>
      </div>

      {/* Main highlight skills */}
      <div className="rounded-3xl border border-border bg-card/40 p-7 space-y-5 dark:bg-card/40">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <h3 className="font-serif text-xl font-light">About section badges (Main highlights)</h3>
          <button
            type="button"
            onClick={addAboutSkill}
            className="flex items-center gap-1.5 rounded-full bg-accent-soft px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#201319] dark:text-[#201319]"
          >
            <Plus className="size-3" /> Add Highlight Badge
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {aboutSkills.map((skill, index) => (
            <div key={index} className="flex gap-4 p-4 border border-border/60 bg-background rounded-2xl relative dark:bg-[#0e0b0d]">
              <button
                type="button"
                onClick={() => deleteAboutSkill(index)}
                className="absolute top-2 right-2 text-muted-foreground hover:text-red-400 p-1"
              >
                <Trash2 className="size-3.5" />
              </button>

              <div className="flex flex-col justify-center gap-1.5 flex-1 pr-6">
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => updateAboutSkill(index, 'name', e.target.value)}
                  placeholder="SKILL NAME"
                  className="bg-transparent border-b border-border/30 font-mono text-xs focus:border-accent outline-none dark:border-white/5"
                />
                <input
                  type="text"
                  value={skill.note}
                  onChange={(e) => updateAboutSkill(index, 'note', e.target.value)}
                  placeholder="Hover details"
                  className="bg-transparent border-b border-border/30 text-xs text-muted-foreground focus:border-accent outline-none dark:border-white/5"
                />
                <input
                  type="text"
                  value={skill.icon}
                  onChange={(e) => updateAboutSkill(index, 'icon', e.target.value)}
                  placeholder="Icon url"
                  className="bg-transparent border-b border-border/30 text-[10px] text-muted-foreground/60 focus:border-accent outline-none dark:border-white/5"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categorized Skills list */}
      <div className="space-y-6">
        {groups.map((group, groupIndex) => (
          <div key={group.num} className="rounded-3xl border border-border bg-card/40 p-7 space-y-5 dark:bg-card/40">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-accent">{group.num}</span>
                <h4 className="font-serif text-lg">{group.title} Skills</h4>
              </div>

              <button
                type="button"
                onClick={() => addGroupSkill(groupIndex)}
                className="flex items-center gap-1.5 rounded-full bg-accent-soft px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#201319] dark:text-[#201319]"
              >
                <Plus className="size-3" /> Add Skill
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {group.skills.map((skill, skillIndex) => (
                <div key={skillIndex} className="flex gap-4 p-4 border border-border/60 bg-background rounded-2xl relative dark:bg-[#0e0b0d]">
                  <button
                    type="button"
                    onClick={() => deleteGroupSkill(groupIndex, skillIndex)}
                    className="absolute top-2 right-2 text-muted-foreground hover:text-red-400 p-1"
                  >
                    <Trash2 className="size-3.5" />
                  </button>

                  <div className="flex flex-col justify-center gap-1.5 flex-1 pr-6">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => updateGroupSkill(groupIndex, skillIndex, 'name', e.target.value)}
                      placeholder="SKILL NAME"
                      className="bg-transparent border-b border-border/30 font-mono text-xs focus:border-accent outline-none dark:border-white/5"
                    />
                    <input
                      type="text"
                      value={skill.note}
                      onChange={(e) => updateGroupSkill(groupIndex, skillIndex, 'note', e.target.value)}
                      placeholder="Hover details"
                      className="bg-transparent border-b border-border/30 text-xs text-muted-foreground focus:border-accent outline-none dark:border-white/5"
                    />
                    <input
                      type="text"
                      value={skill.icon}
                      onChange={(e) => updateGroupSkill(groupIndex, skillIndex, 'icon', e.target.value)}
                      placeholder="Icon url"
                      className="bg-transparent border-b border-border/30 text-[10px] text-muted-foreground/60 focus:border-accent outline-none dark:border-white/5"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="rounded-full bg-accent-soft px-8 py-3.5 text-xs font-mono uppercase tracking-wider text-[#201319] hover:bg-accent transition-transform hover:-translate-y-0.5 dark:text-[#201319]"
      >
        Save Skills Configuration
      </button>
    </form>
  )
}

// ----------------------------------------------------
// 4. JOURNEY STAGES TAB
// ----------------------------------------------------
function JourneyTab({ db, save }: { db: DbSchema; save: any }) {
  const [title, setTitle] = useState(db.journey?.title || '')
  const [ctaTitle, setCtaTitle] = useState(db.journey?.ctaTitle || '')
  const [ctaButtonText, setCtaButtonText] = useState(db.journey?.ctaButtonText || '')
  const [sectionLabel, setSectionLabel] = useState(db.journey?.sectionLabel || 'Journey')
  const [stages, setStages] = useState<JourneyStage[]>(db.journey?.stages || [])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    save('journey', {
      title,
      stages,
      ctaTitle,
      ctaButtonText,
      sectionLabel,
    })
  }

  // CRUD helpers
  const handleStageChange = (index: number, key: keyof JourneyStage, val: any) => {
    const updated = [...stages]
    updated[index] = { ...updated[index], [key]: val }
    setStages(updated)
  }

  const deleteStage = (index: number) => {
    const updated = stages.filter((_, i) => i !== index)
    // Normalize step numbers e.g. "01", "02"...
    const normalized = updated.map((s, i) => ({
      ...s,
      num: String(i + 1).padStart(2, '0'),
      stage: `STAGE ${String(i + 1).padStart(2, '0')}`
    }))
    setStages(normalized)
  }

  const addStage = () => {
    const num = String(stages.length + 1).padStart(2, '0')
    const newStage: JourneyStage = {
      num,
      short: 'Timeline Node',
      stage: `STAGE ${num}`,
      title: 'Timeline stage title',
      body: ' timeline node details...',
      tags: ['Topic', 'Focus']
    }
    setStages([...stages, newStage])
  }

  // Reordering helpers
  const moveStage = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === stages.length - 1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const updated = [...stages]
    
    // Swap items
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp

    // Re-normalize indices & stage indicators
    const normalized = updated.map((s, i) => ({
      ...s,
      num: String(i + 1).padStart(2, '0'),
      stage: `STAGE ${String(i + 1).padStart(2, '0')}`
    }))

    setStages(normalized)
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Journey Settings */}
      <div className="rounded-3xl border border-border bg-card/40 p-7 space-y-5 dark:bg-card/40">
        <h3 className="font-serif text-xl font-light border-b border-border/40 pb-3">Journey Section Text</h3>
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Section title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground font-serif dark:bg-[#0e0b0d]"
          />
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Navigation Section Label</label>
          <input
            type="text"
            value={sectionLabel}
            onChange={(e) => setSectionLabel(e.target.value)}
            placeholder="Journey"
            className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">CTA banner title</label>
            <input
              type="text"
              value={ctaTitle}
              onChange={(e) => setCtaTitle(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground font-serif dark:bg-[#0e0b0d]"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">CTA button text</label>
            <input
              type="text"
              value={ctaButtonText}
              onChange={(e) => setCtaButtonText(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
            />
          </div>
        </div>
      </div>

      {/* Stepper list */}
      <div className="rounded-3xl border border-border bg-card/40 p-7 space-y-6 dark:bg-card/40">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <h3 className="font-serif text-xl font-light">Journey Stages / Timeline</h3>
          <button
            type="button"
            onClick={addStage}
            className="flex items-center gap-1.5 rounded-full bg-accent-soft px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#201319] dark:text-[#201319]"
          >
            <Plus className="size-3" /> Add Stage
          </button>
        </div>

        <div className="space-y-6">
          {stages.map((s, index) => (
            <div key={index} className="border border-border/60 bg-background rounded-2xl p-5 relative space-y-4 dark:bg-[#0e0b0d]">
              <div className="flex items-center justify-between border-b border-border/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-accent">{s.num}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {s.stage}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => moveStage(index, 'up')}
                    disabled={index === 0}
                    className="text-muted-foreground hover:text-accent p-1.5 border border-border/30 rounded-lg disabled:opacity-30"
                  >
                    <ArrowUp className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveStage(index, 'down')}
                    disabled={index === stages.length - 1}
                    className="text-muted-foreground hover:text-accent p-1.5 border border-border/30 rounded-lg disabled:opacity-30"
                  >
                    <ArrowDown className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteStage(index)}
                    className="text-muted-foreground hover:text-red-400 p-1.5 border border-border/30 rounded-lg"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Stepper Label</label>
                  <input
                    type="text"
                    value={s.short}
                    onChange={(e) => handleStageChange(index, 'short', e.target.value)}
                    className="w-full bg-background border border-border/60 rounded-xl p-2.5 text-xs text-foreground font-serif dark:bg-[#141013]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Card Header Title</label>
                  <input
                    type="text"
                    value={s.title}
                    onChange={(e) => handleStageChange(index, 'title', e.target.value)}
                    className="w-full bg-background border border-border/60 rounded-xl p-2.5 text-xs text-foreground font-serif dark:bg-[#141013]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Body Text</label>
                <textarea
                  value={s.body}
                  onChange={(e) => handleStageChange(index, 'body', e.target.value)}
                  rows={2}
                  className="w-full bg-background border border-border/60 rounded-xl p-3 text-xs text-foreground leading-relaxed dark:bg-[#141013]"
                />
              </div>

              <div>
                <label className="block font-mono text-[9px] uppercase tracking-wider text-muted-foreground mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={s.tags?.join(', ') || ''}
                  onChange={(e) => handleStageChange(index, 'tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                  placeholder="e.g. Relational Databases, MySQL"
                  className="w-full bg-background border border-border/60 rounded-xl p-2.5 text-xs text-foreground dark:bg-[#141013]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="rounded-full bg-accent-soft px-8 py-3.5 text-xs font-mono uppercase tracking-wider text-[#201319] hover:bg-accent transition-transform hover:-translate-y-0.5 dark:text-[#201319]"
      >
        Save Journey Changes
      </button>
    </form>
  )
}

// ----------------------------------------------------
// 5. CERTIFICATIONS TAB (CRUD & REORDER & UPLOADS)
// ----------------------------------------------------
interface CertFormState {
  id?: string
  name: string
  organization: string
  date: string
  credentialId: string
  credentialUrl: string
  image: string
  description: string
  visible: boolean
}

function CertificationsTab({ db, save, uploadImage }: { db: DbSchema; save: any; uploadImage: any }) {
  const [certs, setCerts] = useState<Certification[]>(db.certifications || [])
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<CertFormState>({
    name: '',
    organization: '',
    date: '',
    credentialId: '',
    credentialUrl: '',
    image: '',
    description: '',
    visible: true
  })
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleEditClick = (cert: Certification) => {
    setEditForm({
      id: cert.id,
      name: cert.name,
      organization: cert.organization,
      date: cert.date,
      credentialId: cert.credentialId || '',
      credentialUrl: cert.credentialUrl || '',
      image: cert.image || '',
      description: cert.description || '',
      visible: cert.visible !== false
    })
    setIsEditing(true)
  }

  const handleAddClick = () => {
    setEditForm({
      name: '',
      organization: '',
      date: '',
      credentialId: '',
      credentialUrl: '',
      image: '',
      description: '',
      visible: true
    })
    setIsEditing(true)
  }

  // Handle Form Input Changes
  const handleInputChange = (key: keyof CertFormState, val: any) => {
    setEditForm({ ...editForm, [key]: val })
  }

  // Handle image upload from form
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const path = await uploadImage(file)
      handleInputChange('image', path)
    } catch (err) {
      alert('Failed to upload image')
    }
  }

  // Save/Create operation
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const url = '/api/admin/certifications'
    const method = editForm.id ? 'PUT' : 'POST'
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      
      if (res.ok) {
        const json = await res.json()
        setCerts(json.certifications || [])
        setIsEditing(false)
      } else {
        const json = await res.json().catch(() => null)
        alert(json?.error || `Failed to save certification (${res.status})`)
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Unable to reach the server while saving certification')
    }
  }

  // Delete operation
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this certification?')) return

    try {
      const res = await fetch(`/api/admin/certifications?id=${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        const json = await res.json()
        setCerts(json.certifications || [])
      } else {
        alert('Failed to delete')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Reorder operation (Up/Down)
  const moveCert = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === certs.length - 1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const updated = [...certs]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp

    // Send array to bulk reorder PUT endpoint
    try {
      const res = await fetch('/api/admin/certifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
      if (res.ok) {
        const json = await res.json()
        setCerts(json.certifications || [])
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Toggle Visibility
  const toggleVisibility = async (cert: Certification) => {
    try {
      const res = await fetch('/api/admin/certifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cert, visible: !cert.visible }),
      })
      if (res.ok) {
        const json = await res.json()
        setCerts(json.certifications || [])
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Render Form view
  if (isEditing) {
    return (
      <div className="rounded-3xl border border-border bg-card/40 p-7 space-y-6 dark:bg-card/40">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <h3 className="font-serif text-xl font-light">
            {editForm.id ? 'Edit Certification' : 'Add Certification'}
          </h3>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Certification Name</label>
              <input
                type="text"
                required
                value={editForm.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground font-serif dark:bg-[#0e0b0d]"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Issuing Organization</label>
              <input
                type="text"
                required
                value={editForm.organization}
                onChange={(e) => handleInputChange('organization', e.target.value)}
                className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground font-serif dark:bg-[#0e0b0d]"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Issue Date (e.g. Month Year)</label>
              <input
                type="text"
                required
                value={editForm.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                placeholder="August 2026"
                className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Credential ID (Optional)</label>
              <input
                type="text"
                value={editForm.credentialId}
                onChange={(e) => handleInputChange('credentialId', e.target.value)}
                className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground font-mono dark:bg-[#0e0b0d]"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Credential Verification URL (Optional)</label>
            <input
              type="url"
              value={editForm.credentialUrl}
              onChange={(e) => handleInputChange('credentialUrl', e.target.value)}
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-[1fr_120px] items-end">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Logo/Certificate Badge Image Path</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editForm.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="/uploads/file.png"
                  className="flex-1 rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground font-mono dark:bg-[#0e0b0d]"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-2xl border border-border bg-card p-3 text-muted-foreground hover:text-accent"
                >
                  <Upload className="size-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
            {editForm.image && (
              <div className="size-16 rounded-xl border border-border bg-background flex items-center justify-center p-2 dark:bg-[#0e0b0d]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={editForm.image} alt="" className="size-full object-contain" />
              </div>
            )}
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Short Description (Optional)</label>
            <textarea
              value={editForm.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-border bg-background p-4 text-sm focus:border-accent outline-none text-foreground leading-relaxed dark:bg-[#0e0b0d]"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleInputChange('visible', !editForm.visible)}
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
            >
              {editForm.visible ? (
                <>
                  <Eye className="size-4 text-green-400" /> Publicly Published
                </>
              ) : (
                <>
                  <EyeOff className="size-4 text-yellow-500" /> Private Draft
                </>
              )}
            </button>
          </div>

          <button
            type="submit"
            className="rounded-full bg-accent-soft px-8 py-3.5 text-xs font-mono uppercase tracking-wider text-[#201319] hover:bg-accent transition-transform hover:-translate-y-0.5 dark:text-[#201319]"
          >
            Save Certification
          </button>
        </form>
      </div>
    )
  }

  // Render List view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl font-light">My Credentials ({certs.length})</h3>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-1.5 rounded-full bg-accent-soft px-4 py-2 text-xs font-mono uppercase tracking-wider text-[#201319] dark:text-[#201319]"
        >
          <Plus className="size-4" /> Add Certification
        </button>
      </div>

      {certs.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card/10 p-10 text-center text-sm text-muted-foreground">
          No certifications added yet. Click &quot;Add Certification&quot; to begin.
        </div>
      ) : (
        <div className="space-y-4">
          {certs.map((c, index) => (
            <div
              key={c.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm dark:bg-[#0e0b0d] dark:shadow-none"
            >
              <div className="flex items-center gap-4">
                {c.image ? (
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-[#ffeaf3] p-2.5 shrink-0 dark:from-white dark:to-[#ffeaf3]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.image} alt="" className="size-full object-contain" />
                  </div>
                ) : (
                  <div className="flex size-14 items-center justify-center rounded-2xl border border-border bg-card text-accent shrink-0">
                    <Award className="size-6" />
                  </div>
                )}

                <div>
                  <h4 className="font-serif text-lg font-medium leading-tight">{c.name}</h4>
                  <p className="text-xs text-muted-foreground font-serif italic mt-0.5">{c.organization}</p>
                  <div className="flex items-center gap-2 mt-1.5 font-mono text-[9px] text-muted-foreground/80 uppercase tracking-widest">
                    <span>Issued: {c.date}</span>
                    {c.credentialId && (
                      <>
                        <span>·</span>
                        <span className="max-w-[120px] truncate">ID: {c.credentialId}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 border-t border-border/20 pt-4 sm:pt-0 sm:border-t-0 justify-end">
                <button
                  onClick={() => toggleVisibility(c)}
                  className={`p-2 border border-border/60 rounded-xl transition-colors ${
                    c.visible !== false ? 'text-green-400 hover:bg-green-950/20' : 'text-yellow-500 hover:bg-yellow-950/20'
                  }`}
                  title={c.visible !== false ? 'Make Draft' : 'Publish'}
                >
                  {c.visible !== false ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                </button>
                <button
                  onClick={() => moveCert(index, 'up')}
                  disabled={index === 0}
                  className="p-2 border border-border/60 rounded-xl text-muted-foreground hover:text-accent transition-colors disabled:opacity-30"
                >
                  <ArrowUp className="size-3.5" />
                </button>
                <button
                  onClick={() => moveCert(index, 'down')}
                  disabled={index === certs.length - 1}
                  className="p-2 border border-border/60 rounded-xl text-muted-foreground hover:text-accent transition-colors disabled:opacity-30"
                >
                  <ArrowDown className="size-3.5" />
                </button>
                <button
                  onClick={() => handleEditClick(c)}
                  className="p-2 border border-border/60 rounded-xl text-muted-foreground hover:text-accent transition-colors"
                >
                  <Edit className="size-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-2 border border-border/60 rounded-xl text-muted-foreground hover:text-red-400 transition-colors"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ----------------------------------------------------
// 6. SOCIAL LINKS TAB
// ----------------------------------------------------
function SocialsTab({ db, save, uploadImage }: { db: DbSchema; save: any; uploadImage: any }) {
  const [github, setGithub] = useState(db.socials?.github || '')
  const [linkedin, setLinkedin] = useState(db.socials?.linkedin || '')
  const [email, setEmail] = useState(db.socials?.email || '')
  const [fiverr, setFiverr] = useState(db.socials?.fiverr || '')
  
  // Connect section labels
  const [connectSectionLabel, setConnectSectionLabel] = useState(db.connect?.sectionLabel || 'Connect')
  const [connectTitle, setConnectTitle] = useState(db.connect?.title || 'Find me around the web.')
  const [connectDescription, setConnectDescription] = useState(db.connect?.description || 'No forms, no fuss — just the places I actually live online. Follow along, or reach out whenever you like.')
  const [githubLabel, setGithubLabel] = useState(db.connect?.githubLabel || 'GitHub')
  const [githubSubtitle, setGithubSubtitle] = useState(db.connect?.githubSubtitle || 'Explore my code')
  const [githubCta, setGithubCta] = useState(db.connect?.githubCta || 'Visit GitHub')
  const [linkedinLabel, setLinkedinLabel] = useState(db.connect?.linkedinLabel || 'LinkedIn')
  const [linkedinSubtitle, setLinkedinSubtitle] = useState(db.connect?.linkedinSubtitle || 'See my journey & experiences')
  const [linkedinCta, setLinkedinCta] = useState(db.connect?.linkedinCta || 'Visit LinkedIn')
  const [emailLabel, setEmailLabel] = useState(db.connect?.emailLabel || 'Email')
  const [emailSubtitle, setEmailSubtitle] = useState(db.connect?.emailSubtitle || 'Say hello directly')
  const [emailCta, setEmailCta] = useState(db.connect?.emailCta || 'Send Email')
  
  const [customLinks, setCustomLinks] = useState(db.customSocialLinks || [])
  const [isEditingCustom, setIsEditingCustom] = useState(false)
  const [customForm, setCustomForm] = useState<{ id?: string; name: string; url: string; icon: string }>({
    name: '',
    url: '',
    icon: ''
  })
  
  const customFileInputRef = useRef<HTMLInputElement>(null)

  const handleSavePredefined = (e: React.FormEvent) => {
    e.preventDefault()
    save('profile', {
      socials: { github, linkedin, email, fiverr },
      connect: {
        sectionLabel: connectSectionLabel,
        title: connectTitle,
        description: connectDescription,
        githubLabel,
        githubSubtitle,
        githubCta,
        linkedinLabel,
        linkedinSubtitle,
        linkedinCta,
        emailLabel,
        emailSubtitle,
        emailCta
      }
    })
  }

  const handleAddCustom = () => {
    setCustomForm({ name: '', url: '', icon: '' })
    setIsEditingCustom(true)
  }

  const handleEditCustom = (link: any) => {
    setCustomForm({ id: link.id, name: link.name, url: link.url, icon: link.icon || '' })
    setIsEditingCustom(true)
  }

  const handleCustomFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const path = await uploadImage(file)
      setCustomForm({ ...customForm, icon: path })
    } catch (err) {
      alert('Upload failed')
    }
  }

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = '/api/admin/custom-socials'
    const method = customForm.id ? 'PUT' : 'POST'
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customForm),
      })
      if (res.ok) {
        const json = await res.json()
        setCustomLinks(json.links || [])
        setIsEditingCustom(false)
      } else {
        const json = await res.json().catch(() => null)
        alert(json?.error || `Failed to save social link (${res.status})`)
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Unable to reach the server while saving social link')
    }
  }

  const handleDeleteCustom = async (id: string) => {
    if (!confirm('Delete this social link?')) return
    try {
      const res = await fetch(`/api/admin/custom-socials?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        const json = await res.json()
        setCustomLinks(json.links || [])
      }
    } catch (err) {
      console.error(err)
    }
  }

  const moveCustomLink = async (index: number, direction: 'up' | 'down') => {
    const newLinks = [...customLinks]
    if (direction === 'up' && index > 0) {
      [newLinks[index], newLinks[index - 1]] = [newLinks[index - 1], newLinks[index]]
    } else if (direction === 'down' && index < newLinks.length - 1) {
      [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]]
    }
    
    try {
      const res = await fetch('/api/admin/custom-socials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLinks.map((l, i) => ({ ...l, order: i }))),
      })
      if (res.ok) {
        const json = await res.json()
        setCustomLinks(json.links || [])
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (isEditingCustom) {
    return (
      <div className="rounded-3xl border border-border bg-card/40 p-7 space-y-6 dark:bg-card/40">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <h3 className="font-serif text-xl font-light">
            {customForm.id ? 'Edit Custom Link' : 'Add Custom Link'}
          </h3>
          <button type="button" onClick={() => setIsEditingCustom(false)} className="font-mono text-[10px] text-muted-foreground">
            Cancel
          </button>
        </div>

        <form onSubmit={handleCustomSubmit} className="space-y-5">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Platform Name</label>
            <input
              type="text"
              required
              value={customForm.name}
              onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
              placeholder="e.g., Behance, Dribbble, Mostaql"
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground font-serif dark:bg-[#0e0b0d]"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">URL</label>
            <input
              type="url"
              required
              value={customForm.url}
              onChange={(e) => setCustomForm({ ...customForm, url: e.target.value })}
              placeholder="https://..."
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground font-mono dark:bg-[#0e0b0d]"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Icon URL (Optional)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customForm.icon}
                onChange={(e) => setCustomForm({ ...customForm, icon: e.target.value })}
                className="flex-1 rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground font-mono dark:bg-[#0e0b0d]"
              />
              <button
                type="button"
                onClick={() => customFileInputRef.current?.click()}
                className="rounded-2xl border border-border bg-card p-3 text-muted-foreground hover:text-accent"
              >
                <Upload className="size-4" />
              </button>
              <input
                ref={customFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCustomFileChange}
                className="hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            className="rounded-full bg-accent-soft px-8 py-3.5 text-xs font-mono uppercase tracking-wider text-[#201319] hover:bg-accent transition-transform hover:-translate-y-0.5 dark:text-[#201319]"
          >
            {customForm.id ? 'Update Link' : 'Add Link'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Predefined social links */}
      <form onSubmit={handleSavePredefined} className="rounded-3xl border border-border bg-card/40 p-7 space-y-5 dark:bg-card/40">
        <h3 className="font-serif text-xl font-light border-b border-border/40 pb-3">Predefined Social Channels</h3>

        <div>
          <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">GitHub URL</label>
          <input
            type="url"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            placeholder="https://github.com/..."
            className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground font-mono dark:bg-[#0e0b0d]"
          />
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">LinkedIn URL</label>
          <input
            type="url"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="https://linkedin.com/in/..."
            className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground font-mono dark:bg-[#0e0b0d]"
          />
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground font-mono dark:bg-[#0e0b0d]"
          />
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Fiverr URL (Optional)</label>
          <input
            type="url"
            value={fiverr}
            onChange={(e) => setFiverr(e.target.value)}
            placeholder="https://fiverr.com/..."
            className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground font-mono dark:bg-[#0e0b0d]"
          />
        </div>

        <button
          type="submit"
          className="rounded-full bg-accent-soft px-8 py-3.5 text-xs font-mono uppercase tracking-wider text-[#201319] hover:bg-accent transition-transform hover:-translate-y-0.5 dark:text-[#201319]"
        >
          Save Social & Connect Settings
        </button>
      </form>

      {/* Connect section labels */}
      <div className="rounded-3xl border border-border bg-card/40 p-7 space-y-5 dark:bg-card/40">
        <h3 className="font-serif text-xl font-light border-b border-border/40 pb-3">Connect Section Labels</h3>
        
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Navigation Section Label</label>
          <input
            type="text"
            value={connectSectionLabel}
            onChange={(e) => setConnectSectionLabel(e.target.value)}
            placeholder="Connect"
            className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
          />
        </div>
        
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Section Title</label>
          <input
            type="text"
            value={connectTitle}
            onChange={(e) => setConnectTitle(e.target.value)}
            placeholder="Find me around the web."
            className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground font-serif text-lg dark:bg-[#0e0b0d]"
          />
        </div>
        
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Section Description</label>
          <textarea
            value={connectDescription}
            onChange={(e) => setConnectDescription(e.target.value)}
            rows={2}
            className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">GitHub Label</label>
            <input
              type="text"
              value={githubLabel}
              onChange={(e) => setGithubLabel(e.target.value)}
              placeholder="GitHub"
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">GitHub Subtitle</label>
            <input
              type="text"
              value={githubSubtitle}
              onChange={(e) => setGithubSubtitle(e.target.value)}
              placeholder="Explore my code"
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">GitHub CTA</label>
            <input
              type="text"
              value={githubCta}
              onChange={(e) => setGithubCta(e.target.value)}
              placeholder="Visit GitHub"
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">LinkedIn Label</label>
            <input
              type="text"
              value={linkedinLabel}
              onChange={(e) => setLinkedinLabel(e.target.value)}
              placeholder="LinkedIn"
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">LinkedIn Subtitle</label>
            <input
              type="text"
              value={linkedinSubtitle}
              onChange={(e) => setLinkedinSubtitle(e.target.value)}
              placeholder="See my journey & experiences"
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">LinkedIn CTA</label>
            <input
              type="text"
              value={linkedinCta}
              onChange={(e) => setLinkedinCta(e.target.value)}
              placeholder="Visit LinkedIn"
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Email Label</label>
            <input
              type="text"
              value={emailLabel}
              onChange={(e) => setEmailLabel(e.target.value)}
              placeholder="Email"
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Email Subtitle</label>
            <input
              type="text"
              value={emailSubtitle}
              onChange={(e) => setEmailSubtitle(e.target.value)}
              placeholder="Say hello directly"
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Email CTA</label>
            <input
              type="text"
              value={emailCta}
              onChange={(e) => setEmailCta(e.target.value)}
              placeholder="Send Email"
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
            />
          </div>
        </div>
      </div>

      {/* Custom social links */}
      <div className="rounded-3xl border border-border bg-card/40 p-7 space-y-5 dark:bg-card/40">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <h3 className="font-serif text-xl font-light">Custom Social Links ({customLinks.length})</h3>
          <button
            onClick={handleAddCustom}
            className="flex items-center gap-1.5 rounded-full bg-accent-soft px-4 py-2 text-xs font-mono uppercase tracking-wider text-[#201319] dark:text-[#201319]"
          >
            <Plus className="size-4" /> Add Custom Link
          </button>
        </div>

        {customLinks.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card/10 p-10 text-center text-sm text-muted-foreground">
            No custom social links added yet. Add platforms like Behance, Dribbble, Mostaql, etc.
          </div>
        ) : (
          <div className="space-y-4">
            {customLinks.map((link, index) => (
              <div
                key={link.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm dark:bg-[#0e0b0d] dark:shadow-none"
              >
                <div className="flex items-center gap-4">
                  {link.icon ? (
                    <div className="size-12 rounded-xl overflow-hidden bg-card flex items-center justify-center">
                      <img src={link.icon} alt="" className="size-8 object-contain" />
                    </div>
                  ) : (
                    <div className="size-12 rounded-xl bg-card flex items-center justify-center text-muted-foreground">
                      <Globe className="size-5" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-serif text-lg font-medium">{link.name}</h4>
                    <p className="text-xs text-muted-foreground font-mono">{link.url}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t border-border/20 pt-4 sm:pt-0 sm:border-t-0 justify-end">
                  <button
                    onClick={() => moveCustomLink(index, 'up')}
                    disabled={index === 0}
                    className="p-2 border border-border/60 rounded-xl text-muted-foreground hover:text-accent transition-colors disabled:opacity-30"
                  >
                    <ArrowUp className="size-3.5" />
                  </button>
                  <button
                    onClick={() => moveCustomLink(index, 'down')}
                    disabled={index === customLinks.length - 1}
                    className="p-2 border border-border/60 rounded-xl text-muted-foreground hover:text-accent transition-colors disabled:opacity-30"
                  >
                    <ArrowDown className="size-3.5" />
                  </button>
                  <button
                    onClick={() => handleEditCustom(link)}
                    className="p-2 border border-border/60 rounded-xl text-muted-foreground hover:text-accent transition-colors"
                  >
                    <Edit className="size-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCustom(link.id)}
                    className="p-2 border border-border/60 rounded-xl text-muted-foreground hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ----------------------------------------------------
// 7. UPDATES / WHAT'S NEW TAB
// ----------------------------------------------------
interface UpdateFormState {
  id?: string
  title: string
  description: string
  date: string
  image: string
  visible: boolean
  category: 'certification' | 'skill' | 'achievement' | 'experience' | 'update'
}

function UpdatesTab({ db, save, uploadImage }: { db: DbSchema; save: any; uploadImage: any }) {
  const [updates, setUpdates] = useState<PortfolioUpdate[]>(db.updates || [])
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<UpdateFormState>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    image: '',
    visible: true,
    category: 'update'
  })
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleEditClick = (upd: PortfolioUpdate) => {
    setEditForm({
      id: upd.id,
      title: upd.title,
      description: upd.description,
      date: upd.date,
      image: upd.image || '',
      visible: upd.visible !== false,
      category: upd.category || 'update'
    })
    setIsEditing(true)
  }

  const handleAddClick = () => {
    setEditForm({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      image: '',
      visible: true,
      category: 'update'
    })
    setIsEditing(true)
  }

  const handleInputChange = (key: keyof UpdateFormState, val: any) => {
    setEditForm({ ...editForm, [key]: val })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const path = await uploadImage(file)
      handleInputChange('image', path)
    } catch (err) {
      alert('Upload failed')
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = '/api/admin/updates'
    const method = editForm.id ? 'PUT' : 'POST'
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      if (res.ok) {
        const json = await res.json()
        setUpdates(json.updates || [])
        setIsEditing(false)
      } else {
        const json = await res.json().catch(() => null)
        alert(json?.error || `Failed to save update (${res.status})`)
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Unable to reach the server while saving update')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this update log?')) return
    try {
      const res = await fetch(`/api/admin/updates?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        const json = await res.json()
        setUpdates(json.updates || [])
      }
    } catch (err) {
      console.error(err)
    }
  }

  const toggleVisibility = async (upd: PortfolioUpdate) => {
    try {
      const res = await fetch('/api/admin/updates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...upd, visible: !upd.visible }),
      })
      if (res.ok) {
        const json = await res.json()
        setUpdates(json.updates || [])
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (isEditing) {
    return (
      <div className="rounded-3xl border border-border bg-card/40 p-7 space-y-6 dark:bg-card/40">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <h3 className="font-serif text-xl font-light">
            {editForm.id ? 'Edit Update Log' : 'Post New Update'}
          </h3>
          <button type="button" onClick={() => setIsEditing(false)} className="font-mono text-[10px] text-muted-foreground">
            Cancel
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-[1fr_200px]">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Update Title</label>
              <input
                type="text"
                required
                value={editForm.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground font-serif dark:bg-[#0e0b0d]"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Update Category</label>
              <select
                value={editForm.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground font-mono dark:bg-[#0e0b0d]"
              >
                <option value="update">Update</option>
                <option value="certification">Certification</option>
                <option value="skill">Skill</option>
                <option value="achievement">Achievement</option>
                <option value="experience">Experience</option>
              </select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Date (YYYY-MM-DD)</label>
              <input
                type="date"
                required
                value={editForm.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground font-mono dark:bg-[#0e0b0d]"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Optional Image (Upload or path)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editForm.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  className="flex-1 rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground font-mono dark:bg-[#0e0b0d]"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-2xl border border-border bg-card p-3 text-muted-foreground hover:text-accent"
                >
                  <Upload className="size-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Description Detail</label>
            <textarea
              required
              value={editForm.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-border bg-background p-4 text-sm focus:border-accent outline-none text-foreground leading-relaxed dark:bg-[#0e0b0d]"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleInputChange('visible', !editForm.visible)}
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
            >
              {editForm.visible ? (
                <>
                  <Eye className="size-4 text-green-400" /> Publicly Published
                </>
              ) : (
                <>
                  <EyeOff className="size-4 text-yellow-500" /> Private Draft
                </>
              )}
            </button>
          </div>

          <button
            type="submit"
            className="rounded-full bg-accent-soft px-8 py-3.5 text-xs font-mono uppercase tracking-wider text-[#201319] hover:bg-accent transition-transform hover:-translate-y-0.5 dark:text-[#201319]"
          >
            Publish Update
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl font-light">Updates Log ({updates.length})</h3>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-1.5 rounded-full bg-accent-soft px-4 py-2 text-xs font-mono uppercase tracking-wider text-[#201319] dark:text-[#201319]"
        >
          <Plus className="size-4" /> Add Update
        </button>
      </div>

      {updates.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card/10 p-10 text-center text-sm text-muted-foreground">
          No updates posted yet.
        </div>
      ) : (
        <div className="space-y-4">
          {updates.map((u) => (
            <div
              key={u.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm dark:bg-[#0e0b0d] dark:shadow-none"
            >
              <div>
                <h4 className="font-serif text-lg font-medium leading-tight">{u.title}</h4>
                <p className="text-xs text-muted-foreground/80 font-mono uppercase tracking-widest mt-1">
                  {u.date} · <span className="text-accent">{u.category}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{u.description}</p>
              </div>

              <div className="flex items-center gap-2 border-t border-border/20 pt-4 sm:pt-0 sm:border-t-0 justify-end">
                <button
                  onClick={() => toggleVisibility(u)}
                  className={`p-2 border border-border/60 rounded-xl transition-colors ${
                    u.visible !== false ? 'text-green-400 hover:bg-green-950/20' : 'text-yellow-500 hover:bg-yellow-950/20'
                  }`}
                >
                  {u.visible !== false ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                </button>
                <button
                  onClick={() => handleEditClick(u)}
                  className="p-2 border border-border/60 rounded-xl text-muted-foreground hover:text-accent transition-colors"
                >
                  <Edit className="size-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="p-2 border border-border/60 rounded-xl text-muted-foreground hover:text-red-400 transition-colors"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ----------------------------------------------------
// 8. SITE SETTINGS TAB
// ----------------------------------------------------
function SettingsTab({ db, save }: { db: DbSchema; save: any }) {
  const [metaTitle, setMetaTitle] = useState(db.siteSettings?.metaTitle || '')
  const [metaDescription, setMetaDescription] = useState(db.siteSettings?.metaDescription || '')
  const [wordmark, setWordmark] = useState(db.siteSettings?.wordmark || '')
  const [copyright, setCopyright] = useState(db.siteSettings?.copyright || '')
  const [favicon, setFavicon] = useState(db.siteSettings?.favicon || '/uploads/BCO.4a8408d8-a19f-4b25-84fa-5e00fbb1e8db.png')
  const [certificationDescription, setCertificationDescription] = useState(db.certificationsSettings?.description || '')
  const [updateDescription, setUpdateDescription] = useState(db.updatesSettings?.description || '')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    save('profile', {
      siteSettings: {
        metaTitle,
        metaDescription,
        wordmark,
        copyright,
        favicon
      },
      certificationsSettings: { ...db.certificationsSettings, description: certificationDescription },
      updatesSettings: { ...db.updatesSettings, description: updateDescription }
    })
  }

  return (
    <form onSubmit={handleSave} className="rounded-3xl border border-border bg-card/40 p-7 space-y-5 dark:bg-card/40">
      <h3 className="font-serif text-xl font-light border-b border-border/40 pb-3">Global SEO & settings</h3>

      <div>
        <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Favicon image</label>
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-background p-3 dark:bg-[#0e0b0d]">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-border bg-transparent p-2">
            <img src={favicon} alt="Current strawberry favicon" className="size-full object-contain" />
          </div>
          <input
            type="text"
            value={favicon}
            onChange={(e) => setFavicon(e.target.value)}
            className="min-w-0 flex-1 bg-transparent p-1 text-sm font-mono outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Certifications description</label>
        <textarea value={certificationDescription} onChange={(e) => setCertificationDescription(e.target.value)} rows={2} className="w-full rounded-2xl border border-border bg-background p-4 text-sm focus:border-accent outline-none text-foreground leading-relaxed dark:bg-[#0e0b0d]" />
      </div>

      <div>
        <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Updates description</label>
        <textarea value={updateDescription} onChange={(e) => setUpdateDescription(e.target.value)} rows={2} className="w-full rounded-2xl border border-border bg-background p-4 text-sm focus:border-accent outline-none text-foreground leading-relaxed dark:bg-[#0e0b0d]" />
      </div>

      <div>
        <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Wordmark Logo Text</label>
        <input
          type="text"
          value={wordmark}
          onChange={(e) => setWordmark(e.target.value)}
          className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground font-serif dark:bg-[#0e0b0d]"
        />
      </div>

      <div>
        <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Copyright label</label>
        <input
          type="text"
          value={copyright}
          onChange={(e) => setCopyright(e.target.value)}
          className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground font-mono dark:bg-[#0e0b0d]"
        />
      </div>

      <div>
        <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">SEO Meta Title</label>
        <input
          type="text"
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
          className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
        />
      </div>

      <div>
        <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">SEO Meta Description</label>
        <textarea
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          rows={3}
          className="w-full rounded-2xl border border-border bg-background p-4 text-sm focus:border-accent outline-none text-foreground leading-relaxed dark:bg-[#0e0b0d]"
        />
      </div>

      <button
        type="submit"
        className="rounded-full bg-accent-soft px-8 py-3.5 text-xs font-mono uppercase tracking-wider text-[#201319] hover:bg-accent transition-transform hover:-translate-y-0.5 dark:text-[#201319]"
      >
        Save Site Settings
      </button>
    </form>
  )
}

function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)
  const [verificationEnabled, setVerificationEnabled] = useState(false)
  const [pendingSetupUrl, setPendingSetupUrl] = useState('')
  const [setupCode, setSetupCode] = useState('')
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadSecurityStatus() {
      try {
        const res = await fetch('/api/auth/security', { method: 'GET' })
        if (!res.ok) return
        const data = await res.json()
        setVerificationEnabled(Boolean(data.verificationEnabled))
      } catch {
        // ignore and keep UI generic
      }
    }
    loadSecurityStatus()
  }, [])

  const passwordStrength = (() => {
    if (!newPassword) return { label: 'Empty', score: 0, valid: false }
    const checks = [/.{12,}/, /[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/]
    const score = checks.filter((rule) => rule.test(newPassword)).length
    if (score <= 2) return { label: 'Weak', score, valid: false }
    if (score === 3 || score === 4) return { label: 'Good', score, valid: true }
    return { label: 'Strong', score, valid: true }
  })()

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)

    if (!currentPassword || !newPassword || !confirmPassword || !verificationCode) {
      setStatus({ type: 'error', message: 'Please complete all fields.' })
      return
    }

    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'New passwords do not match.' })
      return
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/.test(newPassword)) {
      setStatus({ type: 'error', message: 'Password does not meet the required strength rules.' })
      return
    }

    if (!/^\d{6}$/.test(verificationCode)) {
      setStatus({ type: 'error', message: 'Verification code must be 6 digits.' })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, verificationCode }),
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus({ type: 'error', message: data.error || 'Password change failed.' })
        return
      }

      setStatus({ type: 'success', message: 'Password changed successfully.' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setVerificationCode('')
    } catch {
      setStatus({ type: 'error', message: 'Unable to update password.' })
    } finally {
      setLoading(false)
    }
  }

  const handleSetupTotp = async () => {
    setStatus(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/setup-totp', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        setStatus({ type: 'error', message: data.error || 'Unable to configure verification.' })
        return
      }
      setPendingSetupUrl(data.otpauthUrl || '')
      setVerificationEnabled(false)
      setStatus({ type: 'info', message: 'Scan the QR code with your authenticator app, then confirm the setup.' })
    } catch {
      setStatus({ type: 'error', message: 'Unable to configure verification.' })
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^\d{6}$/.test(setupCode)) {
      setStatus({ type: 'error', message: 'Enter the 6-digit authenticator code.' })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/confirm-totp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: setupCode }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus({ type: 'error', message: data.error || 'Verification setup failed.' })
        return
      }

      setVerificationEnabled(true)
      setPendingSetupUrl('')
      setSetupCode('')
      setRecoveryCodes(data.recoveryCodes || [])
      setStatus({ type: 'success', message: 'Authenticator verification enabled.' })
    } catch {
      setStatus({ type: 'error', message: 'Unable to confirm verification setup.' })
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerateCodes = async () => {
    setStatus(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/recovery-codes', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        setStatus({ type: 'error', message: data.error || 'Unable to regenerate codes.' })
        return
      }
      setRecoveryCodes(data.recoveryCodes || [])
      setStatus({ type: 'success', message: 'Recovery codes regenerated.' })
    } catch {
      setStatus({ type: 'error', message: 'Unable to regenerate recovery codes.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-card/40 p-7 dark:bg-card/40">
        <h3 className="font-serif text-xl font-light border-b border-border/40 pb-3">Account Security</h3>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">
          <span className="rounded-full border border-border px-3 py-1.5">Verification: {verificationEnabled ? 'Enabled' : 'Not Enabled'}</span>
          <button
            type="button"
            onClick={handleSetupTotp}
            className="rounded-full bg-accent-soft px-4 py-2 text-[#201319] transition-transform hover:-translate-y-0.5 dark:text-[#201319]"
          >
            {verificationEnabled ? 'Reset Authenticator' : 'Set Up Verification'}
          </button>
          {verificationEnabled && (
            <button
              type="button"
              onClick={handleRegenerateCodes}
              className="rounded-full border border-border px-4 py-2 hover:border-accent hover:text-accent transition-colors"
            >
              Regenerate Recovery Codes
            </button>
          )}
        </div>
      </div>

      {pendingSetupUrl && (
        <form onSubmit={handleConfirmSetup} className="rounded-3xl border border-border bg-card/40 p-7 space-y-5 dark:bg-card/40">
          <h3 className="font-serif text-xl font-light">Confirm authenticator setup</h3>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="rounded-2xl border border-border bg-background p-3 dark:bg-[#0e0b0d]">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pendingSetupUrl)}`}
                alt="Authenticator QR code"
                className="h-44 w-44 object-contain"
              />
            </div>
            <div className="flex-1 space-y-3">
              <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Enter 6-digit code from your app</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={setupCode}
                onChange={(e) => setSetupCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-accent-soft px-8 py-3.5 text-xs font-mono uppercase tracking-wider text-[#201319] hover:bg-accent transition-transform hover:-translate-y-0.5 disabled:opacity-70 dark:text-[#201319]"
              >
                Confirm Setup
              </button>
            </div>
          </div>
        </form>
      )}

      {recoveryCodes.length > 0 && (
        <div className="rounded-3xl border border-border bg-card/40 p-7 dark:bg-card/40">
          <h3 className="font-serif text-xl font-light border-b border-border/40 pb-3">Recovery Codes</h3>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {recoveryCodes.map((code) => (
              <div key={code} className="rounded-2xl border border-border bg-background p-3 font-mono text-xs tracking-widest text-foreground dark:bg-[#0e0b0d]">
                {code}
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handlePasswordChange} className="rounded-3xl border border-border bg-card/40 p-7 space-y-5 dark:bg-card/40">
        <h3 className="font-serif text-xl font-light border-b border-border/40 pb-3">Change Password</h3>

        <div>
          <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Current password</label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background p-3 pr-11 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
            />
            <button type="button" onClick={() => setShowCurrent((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">New password</label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background p-3 pr-11 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
            />
            <button type="button" onClick={() => setShowNew((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            <span>Password strength: {passwordStrength.label}</span>
            <span>{passwordStrength.score}/5</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
            <div
              className={`h-full rounded-full ${passwordStrength.valid ? 'bg-emerald-400' : passwordStrength.score > 0 ? 'bg-amber-400' : 'bg-border'}`}
              style={{ width: `${Math.max(10, (passwordStrength.score / 5) * 100)}%` }}
            />
          </div>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
            <li>At least 12 characters</li>
            <li>One uppercase letter</li>
            <li>One lowercase letter</li>
            <li>One number</li>
            <li>One special character</li>
          </ul>
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Confirm new password</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background p-3 pr-11 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
            />
            <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">6-digit verification code</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full rounded-2xl border border-border bg-background p-3 text-sm focus:border-accent outline-none text-foreground dark:bg-[#0e0b0d]"
          />
        </div>

        {status && (
          <div className={`rounded-2xl border p-3 text-sm ${status.type === 'success' ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300' : status.type === 'error' ? 'border-red-500/40 bg-red-950/20 text-red-300' : 'border-accent/40 bg-accent/10 text-accent'}`}>
            {status.message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-accent-soft px-8 py-3.5 text-xs font-mono uppercase tracking-wider text-[#201319] hover:bg-accent transition-transform hover:-translate-y-0.5 disabled:opacity-70 dark:text-[#201319]"
        >
          Change Password
        </button>
      </form>
    </div>
  )
}

