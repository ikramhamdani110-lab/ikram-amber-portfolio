'use client'

import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'ar'

/**
 * UI strings that live inside components (buttons, hardcoded titles, labels).
 * Editable portfolio *content* lives in the DB; this dictionary only covers
 * the fixed interface chrome that isn't stored there.
 */
export const UI = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      skills: 'Skills',
      certifications: 'Certifications',
      journey: 'Journey',
      updates: 'Updates',
      connect: 'Connect',
    },
    hero: {
      explore: 'Explore',
      aboutMe: 'About Me',
      titles: [
        'Information Science Student',
        'Web Developer',
        'Curious Learner',
        'Database Explorer',
        'Designer',
      ],
    },
    common: {
      codedBy: 'Coded & designed by',
    },
    certs: {
      intro: 'Validated',
      accent: 'expertise.',
      description: 'Certificates and credentials I have earned through coursework and examinations.',
      issued: 'Issued:',
      id: 'ID:',
      clickToView: 'Click to view full certificate',
      certificate: 'Certificate',
      tapToClose: 'Tap outside to close',
    },
    updates: {
      intro: "What's",
      accent: 'new.',
      description: 'Recent highlights, completed projects, and notifications of my progress.',
      categories: {
        certification: 'certification',
        skill: 'skill',
        achievement: 'achievement',
        experience: 'experience',
        update: 'update',
      } as Record<string, string>,
    },
    lang: {
      aria: 'Switch language',
    },
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      about: 'نبذة',
      skills: 'المهارات',
      certifications: 'الشهادات',
      journey: 'المسيرة',
      updates: 'المستجدّات',
      connect: 'تواصل',
    },
    hero: {
      explore: 'استكشف',
      aboutMe: 'نبذة عني',
      titles: [
        'طالبة علوم المعلومات',
        'مطوّرة ويب',
        'متعلّمة شغوفة',
        'مستكشِفة قواعد البيانات',
        'مصمّمة',
      ],
    },
    common: {
      codedBy: 'برمجة وتصميم',
    },
    certs: {
      intro: 'خبرة',
      accent: 'موثّقة.',
      description: 'شهادات واعتمادات حصلت عليها من خلال الدراسة والامتحانات.',
      issued: 'تاريخ الإصدار:',
      id: 'المعرّف:',
      clickToView: 'اضغط لعرض الشهادة كاملة',
      certificate: 'شهادة',
      tapToClose: 'اضغط في الخارج للإغلاق',
    },
    updates: {
      intro: 'كل',
      accent: 'جديد.',
      description: 'أبرز اللحظات الأخيرة، والمشاريع المنجزة، وإشعارات تقدّمي.',
      categories: {
        certification: 'شهادة',
        skill: 'مهارة',
        achievement: 'إنجاز',
        experience: 'خبرة',
        update: 'تحديث',
      } as Record<string, string>,
    },
    lang: {
      aria: 'تغيير اللغة',
    },
  },
} as const

export type UIStrings = (typeof UI)['en']

interface LanguageContextValue {
  lang: Lang
  dir: 'ltr' | 'rtl'
  t: UIStrings
  setLang: (lang: Lang) => void
  toggle: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function readInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  try {
    const saved = window.localStorage.getItem('lang')
    return saved === 'ar' ? 'ar' : 'en'
  } catch {
    return 'en'
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang)

  useEffect(() => {
    const el = document.documentElement
    el.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
    el.setAttribute('lang', lang)
  }, [lang])

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      window.localStorage.setItem('lang', next)
    } catch (err) {
      console.error('Error saving lang to localStorage:', err)
    }
  }, [])

  const toggle = useCallback(() => {
    setLang(lang === 'ar' ? 'en' : 'ar')
  }, [lang, setLang])

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      dir: lang === 'ar' ? 'rtl' : 'ltr',
      t: UI[lang],
      setLang,
      toggle,
    }),
    [lang, setLang, toggle],
  )

  return createElement(LanguageContext.Provider, { value }, children)
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return ctx
}
