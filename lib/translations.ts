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
      professionalProfile: 'Professional profile',
      dateOfBirth: 'Date of Birth',
      age: 'Age',
      location: 'Location',
      nationality: 'Nationality',
      education: 'Current Education',
      university: 'University',
      graduation: 'Expected Graduation',
      languages: 'Languages',
      status: 'Status',
      interests: 'Interests',
      availability: 'Availability',
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
  ar: {
    nav: { home: 'الرئيسية', about: 'نبذة', skills: 'المهارات', certifications: 'الشهادات', journey: 'المسيرة', updates: 'التحديثات', connect: 'تواصل' },
    hero: { hello: 'مرحبًا، أنا', explore: 'استكشف', aboutMe: 'نبذة عني', codeWindowCaption: 'بُني بفضول', typewriterTitles: ['طالب علوم المعلومات', 'مطور ويب', 'متعلم فضولي', 'مستكشف قواعد البيانات', 'مصمم'] },
    about: { label: 'نبذة', profile: 'الملف الشخصي', currently: 'حاليًا', basedIn: 'الموقع', focus: 'التركيز', professionalProfile: 'الملف الشخصي المهني', dateOfBirth: 'تاريخ الميلاد', age: 'العمر', location: 'الموقع', nationality: 'الجنسية', education: 'التعليم الحالي', university: 'الجامعة', graduation: 'التخرج المتوقع', languages: 'اللغات', status: 'الحالة', interests: 'الاهتمامات', availability: 'التوفر' },
    skills: { label: 'المهارات' },
    certifications: { label: 'الشهادات', title: 'خبرة موثقة.', description: 'الشهادات والاعتمادات التي حصلت عليها.', emptyMessage: 'لا توجد شهادات بعد.', issued: 'تاريخ الإصدار', id: 'المعرف', clickToView: 'اضغط لعرض الشهادة كاملة', certificate: 'شهادة', closeViewer: 'إغلاق عرض الشهادة', tapToClose: 'اضغط خارجًا للإغلاق', viewCredential: 'عرض اعتماد' },
    journey: { label: 'المسيرة', title: 'أتعلم. أبني. أنمو.', ctaTitle: 'شاهد مسيرتي كاملة على LinkedIn', ctaButton: 'زيارة LinkedIn' },
    updates: { label: 'التحديثات', title: 'ما الجديد.', description: 'أحدث الإنجازات والمشاريع والتحديثات.', categories: { certification: 'شهادة', achievement: 'إنجاز', experience: 'خبرة', skill: 'مهارة', update: 'تحديث' } },
    connect: { label: 'تواصل', title: 'تجدني حول الويب.', description: 'تابعني أو تواصل معي في أي وقت.', github: 'GitHub', githubSubtitle: 'استكشف شيفرتي', githubCta: 'زيارة GitHub', linkedin: 'LinkedIn', linkedinSubtitle: 'شاهد مسيرتي وخبراتي', linkedinCta: 'زيارة LinkedIn', email: 'البريد الإلكتروني', emailSubtitle: 'أرسل رسالة مباشرة', emailCta: 'إرسال بريد' },
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
