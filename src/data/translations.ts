import type { Language } from '../types/index.ts';

export interface Translations {
  nav: {
    portfolio: string;
    overview: string;
    projects: string;
    experience: string;
    techStack: string;
    engineering: string;
    console: string;
    resume: string;
    downloadCv: string;
    contact: string;
  };
  hero: {
    badge: string;
    headline: string;
    description: string;
    launchConsole: string;
    contactMe: string;
    cairo: string;
    yearsExp: string;
    yearsExpLabel: string;
    aiExp: string;
    aiExpLabel: string;
    shippedSystems: string;
    shippedSystemsLabel: string;
    ownership: string;
    ownershipLabel: string;
    runtimeSpec: string;
    statusOk: string;
    candidateProfile: string;
    roleTitle: string;
    dataEngine: string;
    dataEngineDesc: string;
    aiBase: string;
    aiBaseDesc: string;
    coreMethodology: string;
    methodologyText: string;
  };
  projects: {
    badge: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    all: string;
    mern: string;
    nextjs: string;
    ai: string;
    fullstack: string;
    noResults: string;
    resetFilters: string;
    inspectCaseStudy: string;
    livePlatform: string;
    repository: string;
    architectureHighlights: string;
    databaseStrategy: string;
    tooling: string;
    close: string;
  };
  experience: {
    badge: string;
    title: string;
    subtitle: string;
    keyResponsibilities: string;
    selectedDeliverables: string;
  };
  skills: {
    badge: string;
    title: string;
    subtitle: string;
    advanced: string;
    proficient: string;
    familiar: string;
  };
  education: {
    badge: string;
    title: string;
    subtitle: string;
    degreeTitle: string;
    institute: string;
    graduationProjectTitle: string;
    graduationProjectDesc: string;
    arabicLang: string;
    arabicLevel: string;
    englishLang: string;
    englishLevel: string;
    certificationsBadge: string;
  };
  console: {
    badge: string;
    title: string;
    subtitle: string;
    themeLabel: string;
    sprintTickets: string;
    gitAudit: string;
    testRunner: string;
    architectureDocs: string;
  };
  tickets: {
    title: string;
    subtitle: string;
    newTicket: string;
    toDo: string;
    inProgress: string;
    qa: string;
    completed: string;
    emptyLane: string;
    createTitle: string;
    ticketTitleLabel: string;
    descLabel: string;
    typeLabel: string;
    priorityLabel: string;
    tagsLabel: string;
    cancel: string;
    submit: string;
    creating: string;
  };
  commits: {
    title: string;
    subtitle: string;
    verifiedBranch: string;
    showingDiff: string;
    copyHash: string;
  };
  tests: {
    title: string;
    subtitle: string;
    allSpecs: string;
    unit: string;
    integration: string;
    runTests: string;
    haltRunner: string;
    testScope: string;
    passedSpecs: string;
    codeCoverage: string;
    suiteLatency: string;
    statusRunning: string;
    statusComplete: string;
    statusStandby: string;
    filterAll: string;
    filterPassed: string;
    filterFailed: string;
    specsMapped: string;
    subMilli: string;
    statementsBranches: string;
    assertionsMapped: string;
  };
  docs: {
    title: string;
    subtitle: string;
    testEndpoint: string;
    liveResponseTitle: string;
    executing: string;
    standbyNote: string;
    endpointsSpec: string;
  };
  contact: {
    title: string;
    subtitle: string;
    nameLabel: string;
    emailLabel: string;
    subjectLabel: string;
    messageLabel: string;
    cancel: string;
    send: string;
    sending: string;
    successTitle: string;
    successMessage: string;
    close: string;
    direct: string;
  };
  footer: {
    role: string;
    top: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      portfolio: 'Portfolio',
      overview: 'Overview',
      projects: 'Projects & Stats',
      experience: 'Experience & Education',
      techStack: 'Tech Stack',
      engineering: 'Engineering Proof',
      console: 'Console Suite',
      resume: 'Resume',
      downloadCv: 'Download CV',
      contact: 'Contact',
    },
    hero: {
      badge: 'Web Development & Architecture',
      headline: 'Building high-throughput, scalable web systems with React, Next.js, Node.js & MongoDB.',
      description: 'I am Abdelrahman Eldamarany, a Senior React, Next.js, and MERN Full-Stack Developer with 7+ years of experience building responsive, scalable, and maintainable web applications using React, Next.js, TypeScript, Node.js, Express.js, MongoDB, Nest.js, Redis, and AWS cloud services. Additionally, possesses 3+ years of hands-on experience in Machine Learning, Deep Learning, and AI.',
      launchConsole: 'Launch Engineering Console',
      contactMe: 'Contact Abdelrahman',
      cairo: 'Cairo, Egypt',
      yearsExp: '7+ Years',
      yearsExpLabel: 'Full-Stack Development',
      aiExp: '3+ Years',
      aiExpLabel: 'AI, ML & Deep Learning',
      shippedSystems: '13+ Systems',
      shippedSystemsLabel: 'Shipped Web Applications',
      ownership: '100%',
      ownershipLabel: 'End-to-End Feature Ownership',
      runtimeSpec: '',
      statusOk: '',
      candidateProfile: 'CANDIDATE_PROFILE',
      roleTitle: 'Senior React / Next.js / MERN Full-Stack Developer',
      dataEngine: 'DATA ENGINE',
      dataEngineDesc: 'Active In-Memory Node',
      aiBase: 'AI / ML BASE',
      aiBaseDesc: '3+ Years Practical Experience',
      coreMethodology: 'CORE METHODOLOGY',
      methodologyText: 'Clean Architecture · RESTful Micro-Services · Optimistic UI Updates · Code Splitting & Lazy Loading · Strict Type Safety',
    },
    projects: {
      badge: 'Engineering Catalog',
      title: 'Featured Case Studies & Systems',
      subtitle: 'Production-grade applications built across MERN architecture, Next.js full-stack frameworks, real-time tracking, and AI integration.',
      searchPlaceholder: 'Search stack, keyword...',
      all: 'All Projects',
      mern: 'MERN Stack',
      nextjs: 'Next.js & React',
      ai: 'AI & Chatbots',
      fullstack: 'Architecture & Systems',
      noResults: 'No systems matching the current filter criteria.',
      resetFilters: 'Reset filters',
      inspectCaseStudy: 'Inspect Case Study',
      livePlatform: 'Live Platform',
      repository: 'Repository',
      architectureHighlights: 'Architectural Highlights',
      databaseStrategy: 'Database & Data Strategy',
      tooling: 'Tech Stack & Tooling',
      close: 'Close Window',
    },
    experience: {
      badge: 'Career Timeline',
      title: 'Professional Experience',
      subtitle: '7+ years of end-to-end full-stack feature delivery across engineering teams, distributed client products, and independent initiatives.',
      keyResponsibilities: 'Key Responsibilities',
      selectedDeliverables: 'Selected Deliverables',
    },
    skills: {
      badge: 'Technical Stack',
      title: 'Core Competencies & Tooling',
      subtitle: 'A comprehensive matrix of technologies mastered across 7+ years of web application development and 3+ years in AI & Deep Learning.',
      advanced: 'Advanced / Primary',
      proficient: 'Proficient',
      familiar: 'Familiar / Secondary',
    },
    education: {
      badge: 'Academic Background & Accreditations',
      title: 'Education & Certifications',
      subtitle: 'Formal foundations in Computer Engineering coupled with accredited modern web specializations.',
      degreeTitle: "Bachelor's Degree in Computer Engineering",
      institute: 'High Institute of Engineering, Minya, Egypt',
      graduationProjectTitle: 'Graduation Project: Broken Barrier Robot',
      graduationProjectDesc: 'Designed and programmed a robotic barrier system using two microcontrollers and C++. The system controlled motor movement based on predefined distance and timing parameters. L298N motor drivers were used to manage power delivery and control the physical motors.',
      arabicLang: 'Arabic',
      arabicLevel: 'Native Language',
      englishLang: 'English',
      englishLevel: 'Professional Proficiency',
      certificationsBadge: 'Industry Certifications',
    },
    console: {
      badge: 'Production Engineering Workspace',
      title: 'Engineering Console',
      subtitle: 'Inspect real engineering artifacts: sprint backlog tasks, Git commit diffs, live automated test suites, and system architecture specifications.',
      themeLabel: 'Terminal Theme:',
      sprintTickets: 'Sprint Tickets',
      gitAudit: 'Git Audit Log',
      testRunner: 'Test Suite Runner',
      architectureDocs: 'Architecture & REST Docs',
    },
    tickets: {
      title: 'Sprint Backlog & Engineering Tickets',
      subtitle: 'Active backlog synchronized with the embedded MongoDB collections engine.',
      newTicket: 'New Ticket',
      toDo: 'To Do',
      inProgress: 'In Progress',
      qa: 'QA / Review',
      completed: 'Completed',
      emptyLane: 'No tickets in this lane',
      createTitle: 'Create Sprint Ticket',
      ticketTitleLabel: 'Ticket Title',
      descLabel: 'Description',
      typeLabel: 'Type',
      priorityLabel: 'Priority',
      tagsLabel: 'Tags (comma separated)',
      cancel: 'Cancel',
      submit: 'Create Ticket',
      creating: 'Creating...',
    },
    commits: {
      title: 'Repository Commit Audit',
      subtitle: 'Verified change history, commit hashes, file stats, and inline patch diffs.',
      verifiedBranch: 'branch: main (verified)',
      showingDiff: 'Showing diff for',
      copyHash: 'Copy full hash',
    },
    tests: {
      title: 'Interactive Test Runner',
      subtitle: 'Simulates and executes automated unit and integration suites with live progress telemetry and real-time console streams.',
      allSpecs: 'All Tests',
      unit: 'Unit',
      integration: 'Integration',
      runTests: 'Run',
      haltRunner: 'Halt Runner',
      testScope: 'Test Scope',
      passedSpecs: 'Passed Specs',
      codeCoverage: 'Code Coverage',
      suiteLatency: 'Suite Latency',
      statusRunning: 'EXECUTION IN PROGRESS',
      statusComplete: 'SUITE COMPLETE',
      statusStandby: 'STANDBY',
      filterAll: 'all',
      filterPassed: 'passed',
      filterFailed: 'failed',
      specsMapped: 'Specs',
      subMilli: 'Sub-millisecond resolution',
      statementsBranches: 'Statements & Branches',
      assertionsMapped: 'assertions mapped',
    },
    docs: {
      title: 'System Architecture & API Specifications',
      subtitle: 'Production system design specifications, data diagrams, and live interactive API runner.',
      testEndpoint: 'Test Endpoint',
      liveResponseTitle: 'Live REST Response Console',
      executing: 'Executing request to',
      standbyNote: 'Click "Test Endpoint" above to issue live network queries against Express.js and MongoDB.',
      endpointsSpec: 'Live REST Endpoints Specification',
    },
    contact: {
      title: 'Get in Touch',
      subtitle: 'Direct communication line with Abdelrahman Eldamarany.',
      nameLabel: 'Your Name *',
      emailLabel: 'Your Email *',
      subjectLabel: 'Subject',
      messageLabel: 'Message *',
      cancel: 'Cancel',
      send: 'Send Message',
      sending: 'Sending...',
      successTitle: 'Message Dispatched',
      successMessage: 'Your inquiry has been safely stored in the MongoDB inquiries collection. Abdelrahman will review and respond directly to your email.',
      close: 'Close Window',
      direct: 'Direct:',
    },
    footer: {
      role: 'React / Next.js / MERN Full-Stack Engineer · Cairo, Egypt',
      top: 'Top',
    },
  },
  ar: {
    nav: {
      portfolio: 'معرض الأعمال',
      overview: 'الرئيسية',
      projects: 'المشاريع والإحصائيات',
      experience: 'الخبرات والتعليم',
      techStack: 'المهارات التقنية',
      engineering: 'معايير النظم',
      console: 'الكونسول التقني',
      resume: 'السيرة الذاتية',
      downloadCv: 'تحميل السيرة الذاتية',
      contact: 'تواصل معي',
    },
    hero: {
      badge: 'هندسة الويب المتكاملة والمعمارية البرمجية',
      headline: 'بناء أنظمة ويب متكاملة وعالية الأداء بالاعتماد على React, Next.js, Node.js و MongoDB.',
      description: 'أنا عبد الرحمن الضمراني، مهندس ومطور تطبيقات MERN و React و Next.js بخبرة +7 سنوات في بناء وتطوير تطبيقات ويب عالية الأداء وقابلة للتوسع والصيانة باستخدام React و Next.js و TypeScript و Node.js و Express.js و MongoDB و Nest.js و Redis وخدمات AWS السحابية، بالإضافة إلى +3 سنوات خبرة عملية في تعلم الآلة والتعلم العميق والذكاء الاصطناعي.',
      launchConsole: 'تشغيل كونسول المهندس',
      contactMe: 'تواصل مع عبد الرحمن',
      cairo: 'القاهرة، مصر',
      yearsExp: '+7 سنوات',
      yearsExpLabel: 'تطوير Full-Stack متكامل',
      aiExp: '+3 سنوات',
      aiExpLabel: 'الذكاء الاصطناعي وتعلم الآلة',
      shippedSystems: '+13 نظاماً',
      shippedSystemsLabel: 'تطبيقات ويب تم تسليمها',
      ownership: '100%',
      ownershipLabel: 'ملكية وتنفيذ المزايا من البداية للنهاية',
      runtimeSpec: '',
      statusOk: '',
      candidateProfile: 'الملف المهني',
      roleTitle: 'مطور React / Next.js MERN Full-Stack',
      dataEngine: 'محرك البيانات',
      dataEngineDesc: 'عقدة نشطة في الذاكرة',
      aiBase: 'قاعدة الذكاء الاصطناعي',
      aiBaseDesc: '+3 سنوات خبرة عملية',
      coreMethodology: 'المنهجية الهندسية الأساسية',
      methodologyText: 'معمارية نظيفة · خدمات RESTful مصغرة · تحديثات واجهة استباقية (Optimistic) · تقسيم الأكواد والتحميل الكسول · نمط أمان برمجي صارم Typescript',
    },
    projects: {
      badge: 'كتالوج الأنظمة الهندسية',
      title: 'دراسات الحالة والمشاريع المميزة',
      subtitle: 'تطبيقات بمستوى Production-grade مبنية بمعمارية MERN وأطر عمل Next.js المتقدمة مع التتبع اللحظي ودمج الذكاء الاصطناعي.',
      searchPlaceholder: 'ابحث بالتقنية أو اسم المشروع...',
      all: 'جميع المشاريع',
      mern: 'MERN Stack',
      nextjs: 'Next.js و React',
      ai: 'الذكاء الاصطناعي والشات بوت',
      fullstack: 'المعمارية والأنظمة',
      noResults: 'لا توجد مشاريع تطابق معايير البحث الحالية.',
      resetFilters: 'إعادة ضبط الفلاتر',
      inspectCaseStudy: 'معاينة دراسة الحالة',
      livePlatform: 'المنصة الحية',
      repository: 'مستودع الكود',
      architectureHighlights: 'أبرز النقاط المعمارية',
      databaseStrategy: 'استراتيجية وتصميم قاعدة البيانات',
      tooling: 'مصفوفة التقنيات والأدوات',
      close: 'إغلاق النافذة',
    },
    experience: {
      badge: 'المسار المهني الزمني',
      title: 'الخبرات الوظيفية والمهنية',
      subtitle: '7+ سنوات من قيادة وتسليم المزايا البرمجية عبر فرق التطوير الموزعة والمشاريع المستقلة.',
      keyResponsibilities: 'المسؤوليات الرئيسية',
      selectedDeliverables: 'أبرز ما تم إنجازه وتسليمه',
    },
    skills: {
      badge: 'التقنيات والأدوات',
      title: 'الكفاءات والقدرات التقنية',
      subtitle: 'مصفوفة شاملة من التقنيات المتقنة عبر 7+ سنوات في هندسة الويب وتطبيقات الحوسبة السحابية و 3+ سنوات في الذكاء الاصطناعي والتعلم العميق.',
      advanced: 'مستوى متقدم / أساسي',
      proficient: 'مستوى متمكن',
      familiar: 'مستوى دراية وثانوي',
    },
    education: {
      badge: 'المؤهلات الأكاديمية والشهادات',
      title: 'التعليم والاعتمادات الرسمية',
      subtitle: 'أسس أكاديمية متينة في هندسة الحاسب الآلي مقترنة بتخصصات تقنية معتمدة في الويب الحديث.',
      degreeTitle: 'بكالوريوس هندسة الحاسبات',
      institute: 'المعهد العالي للهندسة والتكنولوجيا، المنيا، مصر',
      graduationProjectTitle: 'مشروع التخرج: روبوت الحواجز الآلي (Broken Barrier Robot)',
      graduationProjectDesc: 'تصميم وبرمجة نظام حاجز أمني روبوتي باستخدام متحكمين دقيقين (Microcontrollers) ولغة C++. يتحكم النظام في حركة المحركات بناءً على مؤشرات المسافة والتوقيت المعايرة مسبقاً، واستخدام مشغلات المحركات L298N للتحكم في استهلاك وتوزيع الطاقة.',
      arabicLang: 'اللغة العربية',
      arabicLevel: 'اللغة الأم (Native)',
      englishLang: 'اللغة الإنجليزية',
      englishLevel: 'إتقان مهني كامل (Professional)',
      certificationsBadge: 'الشهادات الاحترافية المعتمدة',
    },
    console: {
      badge: 'بيئة العمل الهندسية الإنتاجية',
      title: 'كونسول المهندس (Engineering Console)',
      subtitle: 'استعراض حقيقي للأدوات والمخرجات الهندسية: تذاكر الـ Sprint، سجلات Git، مشغل الاختبارات الآلي، ومواصفات المعمارية.',
      themeLabel: 'مظهر الكونسول:',
      sprintTickets: 'تذاكر السبرنت',
      gitAudit: 'سجل تدقيق Git',
      testRunner: 'مشغل الاختبارات الآلية',
      architectureDocs: 'وثائق المعمارية والـ REST API',
    },
    tickets: {
      title: 'سجل تذاكر السبرنت (Sprint Backlog)',
      subtitle: 'لوحة تفاعلية متزامنة مباشرة مع محرك وثائق MongoDB المضمن.',
      newTicket: 'تذكرة جديدة',
      toDo: 'قيد الانتظار (To Do)',
      inProgress: 'قيد التنفيذ (In Progress)',
      qa: 'المراجعة والاختبار (QA)',
      completed: 'مكتمل (Completed)',
      emptyLane: 'لا توجد تذاكر في هذه المرحلة',
      createTitle: 'إنشاء تذكرة سبرنت جديدة',
      ticketTitleLabel: 'عنوان التذكرة',
      descLabel: 'الوصف والمتطلبات التقنية',
      typeLabel: 'النوع',
      priorityLabel: 'الأولوية',
      tagsLabel: 'الوسوم (مفصولة بفواصل)',
      cancel: 'إلغاء',
      submit: 'إنشاء التذكرة',
      creating: 'جاري الحفظ...',
    },
    commits: {
      title: 'سجل تدقيق ومراجعة الـ Commits',
      subtitle: 'تاريخ التعديلات الموثق، معرّفات الـ Hash، وإحصائيات الملفات مع فوارق الكود الحية (Diffs).',
      verifiedBranch: 'الفرع: main (مؤكد)',
      showingDiff: 'عرض الفوارق لـ',
      copyHash: 'نسخ الـ Hash الكامل',
    },
    tests: {
      title: 'مشغل الاختبارات التفاعلي (Interactive Test Runner)',
      subtitle: 'تنفيذ ومحاكاة اختبارات الـ Unit والـ Integration الآلية مع بث مباشر للتقدم وسجلات الكونسول.',
      allSpecs: 'كافة الاختبارات',
      unit: 'اختبارات الوحدة (Unit)',
      integration: 'اختبارات التكامل (Integration)',
      runTests: 'تشغيل',
      haltRunner: 'إيقاف المشغل',
      testScope: 'نطاق الاختبارات',
      passedSpecs: 'الاختبارات الناجحة',
      codeCoverage: 'نسبة التغطية الكودية',
      suiteLatency: 'زمن تنفيذ الحزمة',
      statusRunning: 'جاري تنفيذ الاختبارات',
      statusComplete: 'اكتملت الحزمة بنجاح',
      statusStandby: 'جاهز للبدء',
      filterAll: 'الكل',
      filterPassed: 'الناجحة',
      filterFailed: 'المتعثرة',
      specsMapped: 'حالات اختبار',
      subMilli: 'دقة أقل من جزء من المللي ثانية',
      statementsBranches: 'الجمل والفروع المنطقية',
      assertionsMapped: 'تأكيدات مبرمجة',
    },
    docs: {
      title: 'المعمارية البرمجية ومواصفات واجهة REST API',
      subtitle: 'توثيق مواصفات النظام، مخططات البيانات ASCII، ومختبر تفاعلي حي لنقاط الـ API.',
      testEndpoint: 'اختبار الـ Endpoint',
      liveResponseTitle: 'كونسول استجابة REST API المباشرة',
      executing: 'جاري إرسال الطلب إلى',
      standbyNote: 'اضغط على "اختبار الـ Endpoint" أعلاه لإرسال طلب حي إلى خادم Express.js ومحرك MongoDB.',
      endpointsSpec: 'المواصفات الفنية لنقاط الـ REST API',
    },
    contact: {
      title: 'تواصل مع عبد الرحمن',
      subtitle: 'قناة اتصال مباشرة وسريعة.',
      nameLabel: 'الاسم الكريم *',
      emailLabel: 'البريد الإلكتروني *',
      subjectLabel: 'الموضوع',
      messageLabel: 'الرسالة وتفاصيل المشروع أو الفرصة *',
      cancel: 'إلغاء',
      send: 'إرسال الرسالة',
      sending: 'جاري الإرسال...',
      successTitle: 'تم إرسال الرسالة بنجاح',
      successMessage: 'تم حفظ رسالتك بنجاح في قاعدة بيانات MongoDB. سيقوم عبد الرحمن بمراجعتها والرد المباشر على بريدك.',
      close: 'إغلاق النافذة',
      direct: 'مباشر:',
    },
    footer: {
      role: 'مهندس برمجيات وتطبيقات MERN / Next.js · القاهرة، مصر',
      top: 'للأعلى',
    },
  },
};
