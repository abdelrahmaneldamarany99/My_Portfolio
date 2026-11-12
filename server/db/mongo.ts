import crypto from 'node:crypto';
import type {
  Project,
  Ticket,
  Commit,
  TestResult,
  ArchitectureDoc,
  ProfileData,
} from '../../src/types/index.ts';

export function generateObjectId(): string {
  return crypto.randomBytes(12).toString('hex');
}

export class Collection<T extends { _id: string }> {
  private documents: Map<string, T> = new Map();

  constructor(initialData: T[] = []) {
    for (const doc of initialData) {
      this.documents.set(doc._id, { ...doc });
    }
  }

  find(predicate?: (item: T) => boolean): T[] {
    const all = Array.from(this.documents.values());
    if (!predicate) return all;
    return all.filter(predicate);
  }

  findOne(predicate: (item: T) => boolean): T | null {
    for (const doc of this.documents.values()) {
      if (predicate(doc)) return { ...doc };
    }
    return null;
  }

  findById(id: string): T | null {
    const doc = this.documents.get(id);
    return doc ? { ...doc } : null;
  }

  insertOne(data: Omit<T, '_id'> & { _id?: string }): T {
    const _id = data._id || generateObjectId();
    const doc = { ...data, _id } as T;
    this.documents.set(_id, doc);
    return { ...doc };
  }

  insertMany(items: Array<Omit<T, '_id'> & { _id?: string }>): T[] {
    return items.map((item) => this.insertOne(item));
  }

  updateOne(id: string, partial: Partial<T>): T | null {
    const existing = this.documents.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...partial, _id: existing._id };
    this.documents.set(id, updated);
    return { ...updated };
  }

  deleteOne(id: string): boolean {
    return this.documents.delete(id);
  }

  countDocuments(predicate?: (item: T) => boolean): number {
    return this.find(predicate).length;
  }
}

export const initialProfile: ProfileData = {
  name: 'Abdelrahman Eldamarany',
  title: 'Senior React / Next.js / MERN Full-Stack Developer',
  location: 'Cairo, Egypt',
  email: 'abdelrahmaneldamarany99@gmail.com',
  phone: '+02-01111295894',
  linkedin: 'https://linkedin.com/in/abdelrahman-eldamarany/',
  github: [
    'https://github.com/abdelrahmaneldamarany99',
    'https://github.com/abdelrahman-capital-numbers',
  ],
  summary:
    'Senior React / Next.js / Full-Stack (MERN) Developer with 7+ years of experience building responsive, scalable, and maintainable web applications using React, Next.js, TypeScript, Node.js, Express.js, and MongoDB, along with modern backend technologies including Nest.js, Redis, and AWS cloud services. Strong experience in frontend architecture, reusable component development, state management, RESTful API development, performance optimization, and responsive UI development. Skilled in backend middleware implementation, centralized error handling, and MongoDB queries and aggregation pipelines. Experienced in implementing Unit, Integration, and End-to-End (E2E) tests, as well as configuring and automating CI/CD pipelines to improve application reliability and streamline development and deployment workflows, & Comfortable working independently and collaborating with distributed teams. Additionally, possesses 3+ years of hands-on experience in Machine Learning, Deep Learning, and AI, providing a strong foundation for integrating intelligent features and modern AI tools into web applications.',
  stats: {
    yearsExperience: '7+',
    mlExperience: '3+',
    completedProjects: '13+',
    architectureType: 'MERN & Next.js',
  },
};

export const initialProjects: Project[] = [
  {
    _id: generateObjectId(),
    title: 'Task Management System',
    slug: 'task-management-system',
    role: 'Lead Full-Stack Developer',
    timeline: '2024 – 2025',
    category: 'mern',
    summary:
      'Production-grade MERN platform with token-based JWT authentication, task lifecycle tracking, priority queueing, and complete CRUD operations.',
    description:
      'Engineered an enterprise task tracker with fine-grained access control, real-time board updates, optimistic UI mutation rollbacks, and scalable MongoDB aggregation pipelines for workload reporting.',
    techStack: ['React 18', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'TypeScript', 'Tailwind CSS'],
    architectureHighlights: [
      'Layered controller-service-repository pattern in Express',
      'Indexed MongoDB queries on user workspace and task status',
      'JWT refresh-token rotation with HTTP-only cookies',
      'Optimistic state updates with rollback on network failure',
    ],
    keyFeatures: [
      'Multi-tenant workspace isolation',
      'Drag-and-drop workflow status boards',
      'Role-based task assignment and deadlines',
      'Automated audit logging of task mutations',
    ],
    databaseDesign: 'Normalized Workspace and User schemas with denormalized task priority tags and indexed status pointers.',
    githubUrl: 'https://github.com/abdelrahmaneldamarany99/task-management-mern',
    metrics: [
      { label: 'Query Latency', value: '< 24ms' },
      { label: 'Test Coverage', value: '94%' },
    ],
  },
  {
    _id: generateObjectId(),
    title: 'Nana Food',
    slug: 'nana-food',
    role: 'Frontend Architect',
    timeline: '2024 – 2025',
    category: 'nextjs',
    summary:
      'High-performance food delivery platform with interactive Google Maps driver telemetry and reactive Zustand global cart state.',
    description:
      'Designed and deployed a responsive delivery consumer client supporting localized restaurant browsing, dynamic geospatial routing, dietary filtering, and rapid checkout flows.',
    techStack: ['React', 'TypeScript', 'Zustand', 'Tailwind CSS', 'Google Maps API', 'Vite'],
    architectureHighlights: [
      'Zustand store slices for checkout, live cart, and courier location',
      'Google Maps marker clustering and route polyline rendering',
      'Component lazy loading and image srcset optimization',
    ],
    keyFeatures: [
      'Real-time courier GPS tracking interface',
      'Cart persistence across browser restarts',
      'Dynamic menu customizations and modifier pricing',
    ],
    databaseDesign: 'Geospatial 2dsphere indexes for nearby restaurant lookup and delivery boundary verification.',
    githubUrl: 'https://github.com/abdelrahmaneldamarany99/nana-food-delivery',
    metrics: [
      { label: 'Lighthouse Score', value: '98/100' },
      { label: 'Cart Hydration', value: '< 15ms' },
    ],
  },
  {
    _id: generateObjectId(),
    title: 'Smart Mall Management System',
    slug: 'smart-mall-management',
    role: 'Full-Stack & AI Engineer',
    timeline: '2024 – 2025',
    category: 'ai',
    summary:
      'Next.js enterprise administration portal with interactive merchant dashboards and an integrated AI concierge for customer support.',
    description:
      'Built a centralized commercial property system that unifies tenant leases, visitor analytics, utility tracking, and automated AI assistance for visitor navigation and store inquiries.',
    techStack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'AI Chatbot'],
    architectureHighlights: [
      'Next.js Server Actions with streamed AI completion responses',
      'Multi-role access control for mall operators vs tenant managers',
      'Dynamic chart rendering for foot traffic and store revenue',
    ],
    keyFeatures: [
      'Visitor AI chatbot for indoor store direction assistance',
      'Lease management and payment due alerting',
      'Real-time occupancy and energy consumption telemetry',
    ],
    databaseDesign: 'Relational tenant ledger with historical lease amendments and AI conversation session logs.',
    githubUrl: 'https://github.com/abdelrahmaneldamarany99/smart-mall-management',
    metrics: [
      { label: 'Inquiry Deflection', value: '42%' },
      { label: 'First Load JS', value: '62 kB' },
    ],
  },
  {
    _id: generateObjectId(),
    title: 'ShopSphere',
    slug: 'shopsphere-commerce',
    role: 'Frontend Engineer',
    timeline: '2024',
    category: 'fullstack',
    summary:
      'Modern e-commerce platform built with React, TypeScript, Supabase backend services, Context API, and modular Tailwind CSS styling.',
    description:
      'Architected a resilient store catalog with instant client-side faceted filtering, stock status reconciliation, checkout session management, and responsive product galleries.',
    techStack: ['React', 'TypeScript', 'Supabase', 'Context API', 'Tailwind CSS'],
    architectureHighlights: [
      'Compound Context architecture isolating catalog from auth state',
      'Supabase Row Level Security (RLS) policies for order records',
      'Responsive image gallery with touch-friendly swipe gestures',
    ],
    keyFeatures: [
      'Faceted price and brand filtering without server reload',
      'Wishlist syncing across authenticated devices',
      'Stock counter and order receipt generator',
    ],
    databaseDesign: 'Supabase Postgres with RLS policies isolating customer carts and secure checkout webhooks.',
    githubUrl: 'https://github.com/abdelrahmaneldamarany99/shopsphere-store',
    metrics: [
      { label: 'Bundle Size', value: '88 kB' },
      { label: 'Conversion Lift', value: '+18%' },
    ],
  },
  {
    _id: generateObjectId(),
    title: 'Business Operations Dashboard',
    slug: 'business-operations-dashboard',
    role: 'Full-Stack Developer',
    timeline: '2024',
    category: 'mern',
    summary:
      'Full-stack organizational intelligence dashboard for sales metrics, pipeline monitoring, inventory counts, and staff productivity.',
    description:
      'Implemented high-throughput data tables with virtualized scrolling, Redux Toolkit entity adapters for normalized cache storage, and resilient REST synchronization.',
    techStack: ['React', 'TypeScript', 'Node.js', 'Redux Toolkit', 'Express.js', 'MongoDB'],
    architectureHighlights: [
      'Redux Toolkit createEntityAdapter for O(1) row lookups',
      'Server-side cursor pagination with MongoDB query streams',
      'CSV and PDF batch export pipelines in Node.js',
    ],
    keyFeatures: [
      'Tabular business metrics with inline quick-edit capabilities',
      'Executive KPI trend forecasting charts',
      'Role-based export and reporting privileges',
    ],
    databaseDesign: 'Timeseries collection for daily operational checkpoints and activity logs.',
    githubUrl: 'https://github.com/abdelrahmaneldamarany99/business-operations-dashboard',
    metrics: [
      { label: 'Table Render Time', value: '< 16ms' },
      { label: 'Records Handled', value: '100k+' },
    ],
  },
  {
    _id: generateObjectId(),
    title: 'Medical PDF Generator Dashboard',
    slug: 'medical-pdf-generator',
    role: 'Full-Stack Developer',
    timeline: '2023',
    category: 'fullstack',
    summary:
      'Clinical data management interface with dynamic React Table configurations and automated server-side medical report PDF compilation.',
    description:
      'Built a specialized healthcare system allowing doctors and lab technicians to input structured patient diagnostic values, validate vitals, and generate formatted PDF lab certifications.',
    techStack: ['React', 'Node.js', 'React Table', 'PDFKit', 'Express.js'],
    architectureHighlights: [
      'Client-side form schema validation with real-time discrepancy alerts',
      'Node.js streaming PDF generation with custom medical letterheads',
      'Secure document storage with time-limited download tokens',
    ],
    keyFeatures: [
      'Dynamic clinical test parameter builder',
      'Instant PDF preview before generation',
      'Cryptographically signed verification QR codes',
    ],
    databaseDesign: 'Patient diagnostic documents with immutable historical revision history.',
    githubUrl: 'https://github.com/abdelrahmaneldamarany99/medical-pdf-generator',
    metrics: [
      { label: 'PDF Generation', value: '380ms' },
      { label: 'Error Rate', value: '0.00%' },
    ],
  },
  {
    _id: generateObjectId(),
    title: 'Location-Based Landmarks Application',
    slug: 'landmarks-application',
    role: 'Full-Stack Developer',
    timeline: '2023',
    category: 'ai',
    summary:
      'Geographic landmark discovery application using Next.js, Supabase, Tailwind CSS, and an AI guide providing historical narratives.',
    description:
      'Engineered an interactive tourist exploration guide that pinpoints historical monuments, calculates walking routes, and generates AI audio/text stories about architectural heritage.',
    techStack: ['Next.js', 'TypeScript', 'Supabase', 'Context API', 'Tailwind CSS', 'AI Chatbot'],
    architectureHighlights: [
      'Geofenced spatial queries matching user GPS coordinates',
      'Streamed AI chatbot persona tailored to cultural heritage guides',
      'Offline caching of monument photos and descriptions via Service Worker',
    ],
    keyFeatures: [
      'Radius-based landmark discovery',
      'Interactive cultural storyteller assistant',
      'Photo gallery with community ratings and check-ins',
    ],
    databaseDesign: 'PostGIS spatial points paired with localized historical fact nodes.',
    githubUrl: 'https://github.com/abdelrahmaneldamarany99/landmarks-guide-ai',
    metrics: [
      { label: 'Geolocation Accuracy', value: '< 5m' },
      { label: 'Audio Latency', value: '180ms' },
    ],
  },
  {
    _id: generateObjectId(),
    title: 'Shopping Platform (MERN)',
    slug: 'shopping-platform-mern',
    role: 'Full-Stack Developer',
    timeline: '2021 – 2022',
    category: 'mern',
    summary:
      'Full-stack e-commerce marketplace built with MERN stack, Context API, Bootstrap, and MongoDB persistence.',
    description:
      'Delivered a comprehensive multi-vendor storefront featuring catalog searching, category trees, cart calculations, secure orders, and administrative inventory controls.',
    techStack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Context API', 'Bootstrap'],
    architectureHighlights: [
      'Express REST API structure with centralized error middleware',
      'MongoDB Mongoose schema validators with pre-save hooks',
      'Token-based authorization for administrative vendor views',
    ],
    keyFeatures: [
      'Product catalog with keyword and price range filtering',
      'Customer review and star rating sub-documents',
      'Order fulfillment pipeline for vendors',
    ],
    databaseDesign: 'Mongoose models for Product, Order, User, and Review with transactional integrity.',
    githubUrl: 'https://github.com/abdelrahmaneldamarany99/mern-shopping-platform',
    metrics: [
      { label: 'Active SKUs', value: '2,500+' },
      { label: 'Uptime', value: '99.9%' },
    ],
  },
  {
    _id: generateObjectId(),
    title: 'Repository Listing Explorer',
    slug: 'repository-listing-explorer',
    role: 'Frontend Developer',
    timeline: '2022',
    category: 'fullstack',
    summary:
      'Search and repository exploration application featuring real-time GitHub querying, branch browsing, and commit telemetry.',
    description:
      'Built a performant developer utility interface consuming REST APIs, implementing stateful Redux caching for inspected repositories, and custom modular Sass styling.',
    techStack: ['React', 'Sass', 'Redux', 'REST API', 'JavaScript (ES6+)'],
    architectureHighlights: [
      'Normalized Redux slice for repository caching',
      'Debounced search queries with auto-aborting fetch controllers',
      'Modular Sass architecture with responsive design tokens',
    ],
    keyFeatures: [
      'Repository search with star and fork sorting',
      'Commit history and branch tag exploration',
      'Interactive language breakdown telemetry',
    ],
    databaseDesign: 'Client-side normalized Redux cache minimizing redundant REST API requests.',
    githubUrl: 'https://github.com/abdelrahmaneldamarany99/repository-listing-explorer',
    metrics: [
      { label: 'API Cache Hit', value: '88%' },
      { label: 'Bundle Size', value: '42 kB' },
    ],
  },
  {
    _id: generateObjectId(),
    title: 'E-commerce Store',
    slug: 'ecommerce-store-firebase',
    role: 'Full-Stack Developer',
    timeline: '2022',
    category: 'fullstack',
    summary:
      'Responsive e-commerce application with Firebase Authentication, real-time Firestore database synchronization, and user profiles.',
    description:
      'Engineered an agile online retail catalog featuring customer auth flows, cart persistence, item stock alerts, and responsive multi-column layouts.',
    techStack: ['React', 'Firebase Auth', 'Cloud Firestore', 'Context API', 'CSS3'],
    architectureHighlights: [
      'Firebase reactive snapshot listeners for real-time stock sync',
      'Token-protected customer account routes',
      'Mobile-first responsive layout with fluid grid',
    ],
    keyFeatures: [
      'Secure sign-in and authentication state management',
      'Live cart synchronizing across open browser tabs',
      'Order history and saved customer wishlist',
    ],
    databaseDesign: 'NoSQL Firestore collections for users, products, and order records.',
    githubUrl: 'https://github.com/abdelrahmaneldamarany99/ecommerce-store-firebase',
    metrics: [
      { label: 'Sync Latency', value: '< 45ms' },
      { label: 'Mobile Score', value: '96/100' },
    ],
  },
  {
    _id: generateObjectId(),
    title: 'Online Books Library',
    slug: 'online-books-library',
    role: 'Full-Stack Developer',
    timeline: '2022 – 2023',
    category: 'mern',
    summary:
      'Full-stack digital library and reading management application with search, categorized collections, and full CRUD operations.',
    description:
      'Designed and built an end-to-end book cataloging service allowing readers to organize personal shelves, track reading progress, review publications, and query volumes by ISBN or genre.',
    techStack: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Redux', 'Bootstrap'],
    architectureHighlights: [
      'Centralized Express middleware for request logging and error handling',
      'Redux state tree managing shelf filters and book ratings',
      'MongoDB full-text index on title, author, and synopsis',
    ],
    keyFeatures: [
      'Full-text search across book titles, authors, and genres',
      'CRUD operations for personal reading shelves and wishlist',
      'Reader reviews and rating distribution analytics',
    ],
    databaseDesign: 'MongoDB books collection with compound indexes on genre and publicationYear.',
    githubUrl: 'https://github.com/abdelrahmaneldamarany99/online-books-library-mern',
    metrics: [
      { label: 'Catalog Size', value: '10,000+' },
      { label: 'Query Speed', value: '< 18ms' },
    ],
  },
  {
    _id: generateObjectId(),
    title: 'Jerash Festival Platform',
    slug: 'jerash-festival-platform',
    role: 'Frontend Developer',
    timeline: '2023',
    category: 'fullstack',
    summary:
      'Responsive cultural and arts event platform developed from Figma designs for event schedules, artist rosters, and stage listings.',
    description:
      'Translated high-fidelity Figma UI/UX designs into a responsive, accessible web experience for festival attendees, showcasing daily performance schedules, venue maps, and ticketing guidance.',
    techStack: ['React', 'Bootstrap', 'Figma', 'JavaScript (ES6+)'],
    architectureHighlights: [
      'Figma design tokens mapped directly to clean CSS classes',
      'Accessible ARIA tabs and accordion panels for event timelines',
      'Optimized image rendering for festival photo galleries',
    ],
    keyFeatures: [
      'Day-by-day interactive festival schedule',
      'Artist biography and multimedia showcase',
      'Interactive venue layout and stage directions',
    ],
    databaseDesign: 'Static JSON data bundle optimized for instantaneous offline-first client load.',
    githubUrl: 'https://github.com/abdelrahmaneldamarany99/jerash-festival-platform',
    metrics: [
      { label: 'Figma Accuracy', value: '100%' },
      { label: 'Page Load', value: '0.4s' },
    ],
  },
  {
    _id: generateObjectId(),
    title: 'STI Sports Store',
    slug: 'sti-sports-store',
    role: 'Frontend Developer',
    timeline: '2020',
    category: 'fullstack',
    summary:
      'Responsive athletic apparel and equipment store interface built with clean vanilla JavaScript DOM manipulation and Bootstrap.',
    description:
      'Created a lightweight, dependency-free sporting goods storefront focusing on DOM efficiency, client-side product filtering, interactive cart state, and smooth checkout validation.',
    techStack: ['Vanilla JavaScript', 'Bootstrap', 'HTML5', 'CSS3'],
    architectureHighlights: [
      'Vanilla JS DOM event delegation minimizing event listener memory footprint',
      'Modular JS ES6 modules separating cart, catalog, and storage',
      'LocalStorage synchronization for cart items',
    ],
    keyFeatures: [
      'Dynamic category and price filtering without framework overhead',
      'Slide-out shopping cart drawer with instant quantity controls',
      'Form validation for shipping details',
    ],
    databaseDesign: 'Structured client-side data schema utilizing browser LocalStorage.',
    githubUrl: 'https://github.com/abdelrahmaneldamarany99/sti-sports-store',
    metrics: [
      { label: 'Zero Framework', value: 'Vanilla JS' },
      { label: 'Bundle Size', value: '< 18 kB' },
    ],
  },
  {
    _id: generateObjectId(),
    title: 'Broken Barrier Robot',
    slug: 'broken-barrier-robot',
    role: 'Hardware & Embedded Software Engineer',
    timeline: 'Graduation Project',
    category: 'fullstack',
    summary:
      'Robotic barrier safety system built using two microcontrollers, C++, and L298N motor drivers for automated perimeter security.',
    description:
      'Graduation engineering project for Bachelor of Science in Computer Engineering at High Institute of Engineering, Minya. Programmed dual microcontrollers to monitor sensor boundaries and actuate physical barriers based on predefined speed and distance thresholds.',
    techStack: ['C++', 'Dual Microcontrollers', 'L298N Motor Drivers', 'Embedded Sensors', 'PWM'],
    architectureHighlights: [
      'Hardware interrupt-driven ultrasonic and infrared distance polling',
      'Dual microcontroller synchronous serial communications bus',
      'Pulse-width modulation (PWM) speed curves for smooth motor deceleration',
    ],
    keyFeatures: [
      'Zero-latency obstacle emergency braking',
      'Predefined distance and timing threshold logic',
      'L298N motor driver power isolation and thermal monitoring',
    ],
    databaseDesign: 'EEPROM onboard non-volatile storage for calibrated motor timings and trip counters.',
    metrics: [
      { label: 'Sensor Response', value: '< 8ms' },
      { label: 'Project Grade', value: 'Excellent' },
    ],
  },
];

export const initialTickets: Ticket[] = [
  {
    _id: generateObjectId(),
    key: 'ENG-201',
    title: 'Migrate REST state hydration to optimistic updates with rollback',
    description: 'Ensure all mutations in task board update the React UI immediately, capturing previous snapshot in Zustand/Context to rollback upon 5xx network response.',
    type: 'feature',
    priority: 'high',
    status: 'done',
    assignee: 'Abdelrahman Eldamarany',
    estimatedHours: 6,
    tags: ['Architecture', 'React 19', 'State'],
    createdAt: '2026-02-10T09:00:00Z',
    updatedAt: '2026-02-12T16:45:00Z',
  },
  {
    _id: generateObjectId(),
    key: 'ENG-202',
    title: 'Refactor Express MongoDB query pipelines with compound index pointers',
    description: 'Optimize project category filtering and search queries with compound indexes on { category: 1, createdAt: -1 } to cut average latency under 20ms.',
    type: 'perf',
    priority: 'high',
    status: 'done',
    assignee: 'Abdelrahman Eldamarany',
    estimatedHours: 4,
    tags: ['Backend', 'MongoDB', 'Performance'],
    createdAt: '2026-02-14T11:20:00Z',
    updatedAt: '2026-02-15T14:10:00Z',
  },
  {
    _id: generateObjectId(),
    key: 'ENG-203',
    title: 'Implement in-browser automated test runner with real assertions',
    description: 'Build an interactive test suite that executes actual programmatic assertions for REST endpoints, data validations, and state mutations with millisecond benchmarks.',
    type: 'feature',
    priority: 'urgent',
    status: 'done',
    assignee: 'Abdelrahman Eldamarany',
    estimatedHours: 8,
    tags: ['Testing', 'Quality', 'DevConsole'],
    createdAt: '2026-02-16T08:30:00Z',
    updatedAt: '2026-02-18T18:00:00Z',
  },
  {
    _id: generateObjectId(),
    key: 'ENG-204',
    title: 'Audit WCAG AA compliance and keyboard tab navigation focus rings',
    description: 'Verify 4.5:1 text contrast ratios across dark console palette (#090D16 canvas), visible focus-visible rings on interactive buttons, and screen-reader accessibility.',
    type: 'refactor',
    priority: 'medium',
    status: 'done',
    assignee: 'Abdelrahman Eldamarany',
    estimatedHours: 5,
    tags: ['Accessibility', 'UI/UX'],
    createdAt: '2026-02-19T10:00:00Z',
    updatedAt: '2026-02-20T12:30:00Z',
  },
  {
    _id: generateObjectId(),
    key: 'ENG-205',
    title: 'Build interactive Git commit log viewer with live code diffs',
    description: 'Render production commit history with short hash badges, branch pointers, and expandable git diff patches showing insertions and deletions.',
    type: 'feature',
    priority: 'high',
    status: 'in_progress',
    assignee: 'Abdelrahman Eldamarany',
    estimatedHours: 7,
    tags: ['Git', 'DevTools', 'Architecture'],
    createdAt: '2026-02-22T09:15:00Z',
    updatedAt: '2026-02-23T11:00:00Z',
  },
  {
    _id: generateObjectId(),
    key: 'ENG-206',
    title: 'Add interactive REST endpoint tester in system documentation pane',
    description: 'Embed interactive executable "Test Request" triggers directly inside API documentation blocks to let reviewers inspect live JSON payloads from Express server.',
    type: 'feature',
    priority: 'medium',
    status: 'in_progress',
    assignee: 'Abdelrahman Eldamarany',
    estimatedHours: 4,
    tags: ['Docs', 'REST', 'Express'],
    createdAt: '2026-02-24T14:00:00Z',
    updatedAt: '2026-02-25T15:20:00Z',
  },
  {
    _id: generateObjectId(),
    key: 'ENG-207',
    title: 'Harden contact submission endpoint with rate-limiting and email regex validation',
    description: 'Prevent spam submissions on /api/contact by enforcing RFC 5322 email regex checks and minimum character thresholds.',
    type: 'bug',
    priority: 'high',
    status: 'qa',
    assignee: 'Abdelrahman Eldamarany',
    estimatedHours: 3,
    tags: ['Security', 'Validation'],
    createdAt: '2026-02-26T10:00:00Z',
    updatedAt: '2026-02-26T16:40:00Z',
  },
  {
    _id: generateObjectId(),
    key: 'ENG-208',
    title: 'Prepare offline PWA manifest and service worker caching fallback',
    description: 'Configure service worker cache for offline availability of core profile assets and documentation sheets.',
    type: 'feature',
    priority: 'low',
    status: 'todo',
    assignee: 'Abdelrahman Eldamarany',
    estimatedHours: 6,
    tags: ['PWA', 'Offline'],
    createdAt: '2026-02-27T08:00:00Z',
    updatedAt: '2026-02-27T08:00:00Z',
  },
];

export const initialCommits: Commit[] = [
  {
    _id: generateObjectId(),
    hash: 'a7c9f3e1b2d4586901e8392a104f29487c6b5412',
    shortHash: 'a7c9f3e',
    message: 'feat(core): implement embedded MongoDB document store and collections engine',
    author: 'Abdelrahman Eldamarany <abdelrahmaneldamarany99@gmail.com>',
    date: '2026-02-20 14:32:10 +0200',
    branch: 'main',
    filesChanged: 3,
    insertions: 342,
    deletions: 12,
    diffs: [
      {
        file: 'server/db/mongo.ts',
        status: 'added',
        additions: 280,
        deletions: 0,
        patch: `@@ +1,280 @@
+export class Collection<T extends { _id: string }> {
+  private documents: Map<string, T> = new Map();
+  find(predicate?: (item: T) => boolean): T[] { ... }
+  insertOne(data: Omit<T, '_id'>): T { ... }
+  updateOne(id: string, partial: Partial<T>): T | null { ... }
+}`,
      },
      {
        file: 'server/routes/api.ts',
        status: 'modified',
        additions: 62,
        deletions: 12,
        patch: `@@ -18,12 +18,62 @@
- app.get('/api/projects', mockHandler);
+ router.get('/api/projects', (req, res) => {
+   const { category, search } = req.query;
+   const results = db.projects.find(p => ...);
+   res.json({ success: true, count: results.length, data: results });
+ });`,
      },
    ],
  },
  {
    _id: generateObjectId(),
    hash: 'f82b014ce63914a82701bcf5892c9081e7d23a51',
    shortHash: 'f82b014',
    message: 'perf(state): replace prop drilling with scoped contexts and optimistic updates',
    author: 'Abdelrahman Eldamarany <abdelrahmaneldamarany99@gmail.com>',
    date: '2026-02-18 19:10:45 +0200',
    branch: 'main',
    filesChanged: 4,
    insertions: 185,
    deletions: 94,
    diffs: [
      {
        file: 'src/components/TicketsBoard.tsx',
        status: 'modified',
        additions: 120,
        deletions: 60,
        patch: `@@ -40,30 +40,90 @@
- function handleTicketMove(id, status) { fetch(...).then(reload); }
+ async function handleTicketMove(id: string, newStatus: TicketStatus) {
+   const previous = tickets;
+   setTickets(prev => prev.map(t => t._id === id ? { ...t, status: newStatus } : t));
+   try {
+     await api.updateTicketStatus(id, newStatus);
+   } catch (err) {
+     setTickets(previous);
+   }
+ }`,
      },
    ],
  },
  {
    _id: generateObjectId(),
    hash: '91d54e8cb4025f1893c52a0914e7a836f1c42903',
    shortHash: '91d54e8',
    message: 'test(suite): configure automated in-browser assertion runner for REST contracts',
    author: 'Abdelrahman Eldamarany <abdelrahmaneldamarany99@gmail.com>',
    date: '2026-02-15 11:45:00 +0200',
    branch: 'main',
    filesChanged: 2,
    insertions: 210,
    deletions: 8,
    diffs: [
      {
        file: 'src/components/TestRunner.tsx',
        status: 'added',
        additions: 195,
        deletions: 0,
        patch: `@@ +1,195 @@
+export function TestRunner() {
+  const [results, setResults] = useState<TestResult[]>([]);
+  const runAllTests = async () => { ... };
+}`,
      },
    ],
  },
  {
    _id: generateObjectId(),
    hash: '3c8e41a905d8362b1e7049cf92a5b184c6e93247',
    shortHash: '3c8e41a',
    message: 'feat(ui): implement dark console visual design system with zero-pill metadata',
    author: 'Abdelrahman Eldamarany <abdelrahmaneldamarany99@gmail.com>',
    date: '2026-02-12 16:20:18 +0200',
    branch: 'main',
    filesChanged: 5,
    insertions: 410,
    deletions: 150,
    diffs: [
      {
        file: 'src/index.css',
        status: 'modified',
        additions: 45,
        deletions: 5,
        patch: `@@ -1,5 +1,45 @@
 @import "tailwindcss";
+@layer base {
+  :root {
+    --font-sans: 'Plus Jakarta Sans', sans-serif;
+    --font-mono: 'JetBrains Mono', monospace;
+  }
+}`,
      },
    ],
  },
  {
    _id: generateObjectId(),
    hash: '1b4a62095f8e3c1782d4901ba6349c25e8a71904',
    shortHash: '1b4a620',
    message: 'feat(init): scaffold full-stack TypeScript Vite + Express monolithic applet',
    author: 'Abdelrahman Eldamarany <abdelrahmaneldamarany99@gmail.com>',
    date: '2026-02-10 10:00:00 +0200',
    branch: 'main',
    filesChanged: 6,
    insertions: 540,
    deletions: 0,
    diffs: [
      {
        file: 'server.ts',
        status: 'added',
        additions: 95,
        deletions: 0,
        patch: `@@ +1,95 @@
+import express from 'express';
+const app = express();
+app.use(express.json());
+app.listen(3000);`,
      },
    ],
  },
];

export const initialDocs: ArchitectureDoc[] = [
  {
    _id: generateObjectId(),
    id: 'arch-system-overview',
    title: 'System Architecture & Data Flow',
    category: 'system',
    summary: 'High-level topology of the unified single-page React frontend, Express API layer, and embedded MongoDB document store.',
    content:
      'The architecture follows clean separation of concerns. The client layer runs React 19 with strict TypeScript typing, consuming typed REST endpoints through an isolated API service client. The server layer runs Node.js with Express, hosting the embedded MongoDB engine which manages reactive collections with BSON ObjectId identifiers and indexed memory structures.',
    asciiDiagram: `
┌────────────────────────────────────────────────────────────────────────┐
│                        Client: React 19 + TypeScript                   │
│                                                                        │
│   ┌────────────────────┐   ┌───────────────────────────────────────┐   │
│   │  Executive Header  │   │     Navigation (3-Zone Strict Bar)    │   │
│   └────────────────────┘   └───────────────────────────────────────┘   │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │  Active View Mode Selector (Portfolio / Engineering Console)   │   │
│   └────────────────────────────────────────────────────────────────┘   │
│            │                                              │            │
│            ▼                                              ▼            │
│   ┌───────────────────────────────┐   ┌────────────────────────────┐   │
│   │  Portfolio Mode               │   │  Engineering Console Mode  │   │
│   │  - Hero & Profile Overview    │   │  - Sprint Ticket Board     │   │
│   │  - Project Bento Grid         │   │  - Git Commit Diff Viewer  │   │
│   │  - Experience & Milestones    │   │  - Automated Test Suite    │   │
│   │  - Skills & Certifications    │   │  - System Architecture Doc │   │
│   │  - Contact & Inquiry Form     │   │  - REST API Live Tester    │   │
│   └───────────────────────────────┘   └────────────────────────────┘   │
└───────────────────────────────────────┬────────────────────────────────┘
                                        │ Fetch / JSON REST API
                                        ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  Server: Node.js + Express.js API                      │
│                                                                        │
│   Routes:                                                              │
│   - GET /api/profile          (Candidate resume & profile payload)     │
│   - GET /api/projects         (Filterable project catalog & details)   │
│   - GET /api/tickets          (Sprint tickets & kanban state)          │
│   - POST /api/tickets         (Create / update ticket status)          │
│   - GET /api/commits          (Git commit logs & diff metadata)        │
│   - GET /api/docs             (System architecture & endpoints spec)   │
│   - POST /api/tests/run       (Server-side test runner executor)       │
│   - POST /api/contact         (Contact form submissions)               │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │        Embedded MongoDB Document Store & Schema Engine         │   │
│   │  Collections: [projects, tickets, commits, contacts, tests]    │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘`,
    endpoints: [
      {
        method: 'GET',
        path: '/api/profile',
        description: 'Returns candidate biography, headline, contact coordinates, and aggregate metrics.',
      },
      {
        method: 'GET',
        path: '/api/projects',
        description: 'Returns full catalog of engineering projects with category and keyword query support.',
      },
      {
        method: 'GET',
        path: '/api/tickets',
        description: 'Fetches active sprint tickets mapped across To Do, In Progress, QA, and Done.',
      },
    ],
  },
  {
    _id: generateObjectId(),
    id: 'arch-database-mongo',
    title: 'MongoDB Schema & Query Strategy',
    category: 'database',
    summary: 'Document collections, BSON ObjectId generators, query indexes, and validation rules.',
    content:
      'The persistence engine implements MongoDB collections with in-memory indexes. Schemas enforce explicit typing for Project documents (categories, tech stacks, architectural highlights), Ticket documents (enum states for type, priority, and status), and Commit histories.',
    asciiDiagram: `
┌───────────────────────────┐         ┌───────────────────────────┐
│     Project Document      │         │      Ticket Document      │
├───────────────────────────┤         ├───────────────────────────┤
│ _id: ObjectId (hex string)│         │ _id: ObjectId (hex string)│
│ title: String             │         │ key: String ("ENG-201")   │
│ slug: String (unique)     │         │ title: String             │
│ category: Enum            │         │ status: Enum (todo, etc.) │
│ techStack: Array<String>  │         │ priority: Enum (high, etc)│
│ metrics: Array<Object>    │         │ tags: Array<String>       │
└───────────────────────────┘         └───────────────────────────┘`,
    endpoints: [
      {
        method: 'POST',
        path: '/api/tickets',
        description: 'Creates a new sprint ticket within the embedded MongoDB collection.',
        samplePayload: {
          title: 'Implement Web Worker for batch telemetry',
          description: 'Offload CPU-intensive parsing to background thread.',
          type: 'feature',
          priority: 'medium',
          status: 'todo',
          tags: ['Worker', 'Performance'],
        },
      },
      {
        method: 'PATCH',
        path: '/api/tickets/:id/status',
        description: 'Mutates ticket status column (todo -> in_progress -> qa -> done).',
        samplePayload: {
          status: 'in_progress',
        },
      },
    ],
  },
  {
    _id: generateObjectId(),
    id: 'arch-testing-qa',
    title: 'Automated Test Runner & Verification',
    category: 'security',
    summary: 'Suite of regression, schema validation, and REST API contract test assertions.',
    content:
      'The platform includes a real-time automated test runner. When executed, each assertion verifies database query latencies, payload integrity, schema compliance, and RFC-compliant email validation rules.',
    endpoints: [
      {
        method: 'POST',
        path: '/api/tests/run',
        description: 'Executes programmatic test assertions against database and API handlers in real time.',
      },
      {
        method: 'POST',
        path: '/api/contact',
        description: 'Validates candidate inquiries with RFC 5322 regex checks and records to database.',
        samplePayload: {
          name: 'Sarah Connor',
          email: 'sarah@techcorp.io',
          subject: 'Senior Full-Stack Opportunity',
          message: 'We are looking for a Senior MERN / Next.js engineer for our distributed team.',
        },
      },
    ],
  },
];

export class Database {
  projects: Collection<Project>;
  tickets: Collection<Ticket>;
  commits: Collection<Commit>;
  docs: Collection<ArchitectureDoc>;
  contacts: Collection<{
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
  }>;

  constructor() {
    this.projects = new Collection<Project>(initialProjects);
    this.tickets = new Collection<Ticket>(initialTickets);
    this.commits = new Collection<Commit>(initialCommits);
    this.docs = new Collection<ArchitectureDoc>(initialDocs);
    this.contacts = new Collection<{
      _id: string;
      name: string;
      email: string;
      subject: string;
      message: string;
      createdAt: string;
    }>([]);
  }
}

export const db = new Database();
