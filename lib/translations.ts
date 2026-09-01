export type Language = 'en'
export type TranslationKey = keyof typeof translations.en

export const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      about: 'About',
      skills: 'Skills',
      certifications: 'Certifications',
      journey: 'Journey',
      updates: 'Updates',
      connect: 'Connect',
    },
    // Hero
    hero: {
      hello: "Hello, I'm",
      explore: 'Explore',
      aboutMe: 'About Me',
      codeWindowCaption: 'built with curiosity',
      typewriterTitles: [
        'Information Science Student',
        'Web Developer',
        'Curious Learner',
        'Database Explorer',
        'Designer',
      ],
    },
    // About
    about: {
      label: 'About',
      profile: 'Profile',
      currently: 'Currently',
      basedIn: 'Based in',
      focus: 'Focus',
    },
    // Skills
    skills: {
      label: 'Skills',
    },
    // Certifications
    certifications: {
      label: 'Certifications',
      title: 'Validated expertise.',
      description: 'Certificates and credentials I have earned through coursework and examinations.',
      emptyMessage: 'No certifications added yet.',
      issued: 'Issued',
      id: 'ID',
      clickToView: 'Click to view full certificate',
      certificate: 'Certificate',
      closeViewer: 'Close certificate viewer',
      tapToClose: 'Tap outside to close',
      viewCredential: 'View credential for',
    },
    // Journey
    journey: {
      label: 'Journey',
      title: 'Learning. Building. Growing.',
      ctaTitle: 'See my full journey on LinkedIn',
      ctaButton: 'View LinkedIn',
    },
    // Updates
    updates: {
      label: 'Updates',
      title: "What's new.",
      description: 'Recent highlights, completed projects, and notifications of my progress.',
      categories: {
        certification: 'Certification',
        achievement: 'Achievement',
        experience: 'Experience',
        skill: 'Skill',
        update: 'Update',
      },
    },
    // Connect
    connect: {
      label: 'Connect',
      title: 'Find me around the web.',
      description: 'No forms, no fuss — just the places I actually live online. Follow along, or reach out whenever you like.',
      github: 'GitHub',
      githubSubtitle: 'Explore my code',
      githubCta: 'Visit GitHub',
      linkedin: 'LinkedIn',
      linkedinSubtitle: 'See my journey & experiences',
      linkedinCta: 'Visit LinkedIn',
      email: 'Email',
      emailSubtitle: 'Say hello directly',
      emailCta: 'Send Email',
    },
  },
}

export function getTranslation(lang: Language, key: string): string {
  const keys = key.split('.')
  let value: any = translations[lang]
  
  for (const k of keys) {
    value = value?.[k]
  }
  
  return value || key
}
