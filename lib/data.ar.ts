import type { DbSchema } from '@/lib/db'

const D = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons'

/**
 * Professional Modern Standard Arabic translation of the portfolio content.
 * Technology/brand names (PYTHON, MYSQL, GitHub, LinkedIn, ...) are intentionally
 * kept in Latin script. Dynamic/user data (socials, custom links, certifications,
 * updates) is sourced from the live English DB at runtime, not from this file.
 */
export const AR_DATA: DbSchema = {
  hero: {
    hello: 'مرحبًا، أنا',
    name: 'IKRAM',
    title: 'طالبة علوم المعلومات ومطوّرة ويب',
    bio: 'أحبّ تحويل الأفكار إلى تجارب رقمية بينما أستكشف البرمجيات وتقنيات الويب وقواعد البيانات ونظم المعلومات.',
    location: 'الشلف · الجزائر',
    creativeTechnologist: 'تقنية مبدعة',
    codeWindowFilename: 'ikram.js',
    codeWindowCaption: 'صُنع بشغف',
    codeLines: [
      { n: 1, code: 'const ikram = {' },
      { n: 2, code: '  learns: "technology",' },
      { n: 3, code: '  builds: "web experiences",' },
      { n: 4, code: '  goal: "keep growing"' },
      { n: 5, code: '};' },
    ],
  },
  about: {
    title: 'فضولية بطبعي. دائمة التعلّم.',
    bio: 'أنا طالبة في علوم المعلومات مهتمّة بتطوير البرمجيات وتقنيات الويب وقواعد البيانات ونظم المعلومات. أستمتع بالتعلّم عبر التجربة وببناء أشياء عملية تحوّل الأفكار إلى تجارب رقمية حيّة.',
    currently: 'أتعلّم → أبني → أجرّب',
    location: 'الشلف، الجزائر',
    focus: ['الويب', 'البرمجيات', 'قواعد البيانات'],
    profileLabel: 'الملف',
    currentlyLabel: 'حاليًا',
    basedInLabel: 'المقر',
    focusLabel: 'التركيز',
    sectionLabel: 'نبذة',
  },
  skills: {
    title: 'صندوق أدواتي الرقمي.',
    description: 'منظومة متنامية من اللغات والأدوات التي أستخدمها لأتعلّم وأبني وأجرّب. مرّر فوق أي بطاقة لتعرف ماذا تعني لي.',
    dbTextBadge: 'تصميم قواعد البيانات',
    sectionLabel: 'المهارات',
    aboutSkills: [
      { name: 'PYTHON', note: 'برمجة · بيانات · أتمتة', icon: `${D}/python/python-original.svg` },
      { name: 'MYSQL', note: 'استعلامات وعلاقات', icon: `${D}/mysql/mysql-original.svg` },
      { name: 'HTML5', note: 'بنية دلالية', icon: `${D}/html5/html5-original.svg` },
      { name: 'GIT', note: 'التحكّم في الإصدارات', icon: `${D}/git/git-original.svg` },
    ],
    groups: [
      {
        num: '01',
        title: 'البرمجة',
        skills: [
          { name: 'C', note: 'الأساسيات · الذاكرة · المنطق', icon: `${D}/c/c-original.svg` },
          { name: 'PYTHON', note: 'برمجة · بيانات · أتمتة', icon: `${D}/python/python-original.svg` },
          { name: 'JAVA', note: 'البرمجة الكائنية · برامج منظّمة', icon: `${D}/java/java-original.svg` },
        ],
      },
      {
        num: '02',
        title: 'الويب',
        skills: [
          { name: 'HTML5', note: 'بنية دلالية', icon: `${D}/html5/html5-original.svg` },
          { name: 'CSS3', note: 'تخطيط · حركة · تصميم', icon: `${D}/css3/css3-original.svg` },
          { name: 'JAVASCRIPT', note: 'تفاعل ومنطق', icon: `${D}/javascript/javascript-original.svg` },
          { name: 'PHP', note: 'برمجة من جهة الخادم', icon: `${D}/php/php-original.svg` },
        ],
      },
      {
        num: '03',
        title: 'قواعد البيانات',
        skills: [
          { name: 'MYSQL', note: 'استعلامات وعلاقات', icon: `${D}/mysql/mysql-original.svg` },
          { name: 'MARIADB', note: 'قاعدة بيانات مفتوحة المصدر', icon: `${D}/mariadb/mariadb-original.svg` },
        ],
      },
      {
        num: '04',
        title: 'الأدوات',
        skills: [
          { name: 'GIT', note: 'التحكّم في الإصدارات', icon: `${D}/git/git-original.svg` },
          { name: 'GITHUB', note: 'الاستضافة والتعاون', icon: `${D}/github/github-original.svg` },
          { name: 'VS CODE', note: 'محرّري اليومي', icon: `${D}/vscode/vscode-original.svg` },
          { name: 'XAMPP', note: 'حزمة خادم محلي', icon: `${D}/xampp/xampp-original.svg` },
          { name: 'CODE::BLOCKS', note: 'بيئة تطوير C/C++', icon: `${D}/codeblocks/codeblocks-original.svg` },
        ],
      },
    ],
  },
  journey: {
    title: 'أتعلّم. أبني. أنمو.',
    ctaTitle: 'هل تودّ رؤية المزيد من مسيرتي؟',
    ctaButtonText: 'زر حسابي على LinkedIn',
    sectionLabel: 'المسيرة',
    stages: [
      {
        num: '01',
        short: 'الجامعة',
        stage: 'المرحلة 01',
        title: 'علوم المعلومات',
        body: 'السنة الثانية ليسانس — دراسة نظم المعلومات ونمذجة الأنظمة والأسس التي تربط البيانات والأشخاص والبرمجيات.',
        tags: ['نظم المعلومات', 'نمذجة الأنظمة'],
      },
      {
        num: '02',
        short: 'البرمجة',
        stage: 'المرحلة 02',
        title: 'أسس الكود',
        body: 'تعلّم التفكير بالمنطق — الخوارزميات وهياكل البيانات باستخدام C وPython وJava.',
        tags: ['الخوارزميات', 'هياكل البيانات'],
      },
      {
        num: '03',
        short: 'تطوير الويب',
        stage: 'المرحلة 03',
        title: 'البناء للمتصفّح',
        body: 'تحويل الصفحات الثابتة إلى تجارب تفاعلية باستخدام HTML وCSS وJavaScript وPHP.',
        tags: ['HTML · CSS · JS', 'PHP'],
      },
      {
        num: '04',
        short: 'قواعد البيانات',
        stage: 'المرحلة 04',
        title: 'هيكلة المعلومات',
        body: 'تصميم واستعلام قواعد البيانات العلائقية باستخدام MySQL وMariaDB.',
        tags: ['تصميم قواعد البيانات', 'SQL'],
      },
      {
        num: '05',
        short: 'الاستكشاف',
        stage: 'المرحلة 05',
        title: 'فضول دائم',
        body: 'تجربة أدوات وأفكار جديدة، والنموّ قليلًا كلّ يوم.',
        tags: ['أدوات جديدة', 'تجارب جانبية'],
      },
    ],
  },
  socials: {
    github: 'https://github.com/ikramhamdani110-lab',
    linkedin: 'https://www.linkedin.com/in/REPLACE-WITH-YOUR-LINKEDIN',
    email: 'your.email@example.com',
  },
  customSocialLinks: [],
  connect: {
    sectionLabel: 'تواصل',
    title: 'تجدني عبر الويب.',
    description: 'لا نماذج ولا تعقيد — فقط الأماكن التي أتواجد فيها فعلًا على الإنترنت. تابعني، أو تواصل معي متى شئت.',
    githubLabel: 'GitHub',
    githubSubtitle: 'استكشف أكوادي',
    githubCta: 'زر GitHub',
    linkedinLabel: 'LinkedIn',
    linkedinSubtitle: 'اطّلع على مسيرتي وخبراتي',
    linkedinCta: 'زر LinkedIn',
    emailLabel: 'البريد الإلكتروني',
    emailSubtitle: 'راسلني مباشرة',
    emailCta: 'أرسل رسالة',
  },
  siteSettings: {
    metaTitle: 'إكرام حمداني | طالبة علوم المعلومات ومطوّرة ويب',
    metaDescription: 'أحبّ تحويل الأفكار إلى تجارب رقمية بينما أستكشف البرمجيات وتقنيات الويب وقواعد البيانات ونظم المعلومات.',
    wordmark: 'IKRAM',
    copyright: '© 2026 إكرام حمداني',
  },
  certifications: [],
  certificationsSettings: {
    sectionLabel: 'الشهادات',
    title: 'خبرة موثّقة',
    emptyMessage: 'لم تُضَف أي شهادات بعد.',
  },
  updates: [],
  updatesSettings: {
    sectionLabel: 'المستجدّات',
    title: 'ما الجديد',
    emptyMessage: 'لا توجد مستجدّات بعد.',
  },
}
