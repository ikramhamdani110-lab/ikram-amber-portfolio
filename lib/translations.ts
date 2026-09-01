export type Language = 'en' | 'ar'
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
    // Language Switcher
    language: {
      switch: 'Switch to Arabic',
      switchAr: 'التبديل إلى العربية',
    },
  },
  ar: {
    // Navigation
    nav: {
      home: 'الرئيسية',
      about: 'عني',
      skills: 'المهارات',
      certifications: 'الشهادات',
      journey: 'رحلتي',
      updates: 'التحديثات',
      connect: 'تواصل معي',
    },
    // Hero
    hero: {
      hello: 'مرحباً، أنا',
      explore: 'استكشف',
      aboutMe: 'تعرف علي',
      codeWindowCaption: 'مبني بحب الفضول',
      typewriterTitles: [
        'طالبة علوم المعلومات',
        'مطورة ويب',
        'متعلمة شغوفة',
        'مستكشفة قواعد البيانات',
        'مصممة',
      ],
    },
    // About
    about: {
      label: 'عني',
      profile: 'الملف الشخصي',
      currently: 'حالياً',
      basedIn: 'مقيمة في',
      focus: 'التركيز',
    },
    // Skills
    skills: {
      label: 'المهارات',
    },
    // Certifications
    certifications: {
      label: 'الشهادات',
      title: 'خبرات معتمدة.',
      description: 'الشهادات والاعتمادات التي حصلت عليها من خلال الدورات والامتحانات.',
      emptyMessage: 'لم تُضاف شهادات بعد.',
      issued: 'تاريخ الإصدار',
      id: 'رقم الشهادة',
      clickToView: 'انقر لعرض الشهادة كاملة',
      certificate: 'الشهادة',
      closeViewer: 'إغلاق عارض الشهادات',
      tapToClose: 'انقر في أي مكان للإغلاق',
      viewCredential: 'عرض الاعتماد لـ',
    },
    // Journey
    journey: {
      label: 'رحلتي',
      title: 'أتعلم. أبني. أنمو.',
      ctaTitle: 'شاهد رحلتي الكاملة على لينكدإن',
      ctaButton: 'عرض لينكدإن',
    },
    // Updates
    updates: {
      label: 'التحديثات',
      title: 'ما الجديد.',
      description: 'أحدث الإنجازات والمشاريع المكتملة وإشعارات تقدمي.',
      categories: {
        certification: 'شهادة',
        achievement: 'إنجاز',
        experience: 'خبرة',
        skill: 'مهارة',
        update: 'تحديث',
      },
    },
    // Connect
    connect: {
      label: 'تواصل معي',
      title: 'ابحث عنني على الإنترنت.',
      description: 'بدون تعقيدات — الأماكن التي أتواجد فيها فعلياً. تابعني، أو تواصل معي متى شئت.',
      github: 'جيت هب',
      githubSubtitle: 'اكتشف أكوادي',
      githubCta: 'زيارة جيت هب',
      linkedin: 'لينكدإن',
      linkedinSubtitle: 'شاهد رحلتي وخبراتي',
      linkedinCta: 'زيارة لينكدإن',
      email: 'البريد الإلكتروني',
      emailSubtitle: 'قل مرحباً مباشرة',
      emailCta: 'إرسال بريد',
    },
    // Language Switcher
    language: {
      switch: 'التبديل إلى العربية',
      switchAr: 'Switch to English',
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
