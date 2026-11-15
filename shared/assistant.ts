export function generateFallbackResponse(prompt: string, language: 'en' | 'ar' = 'en'): string {
  const q = prompt.toLowerCase();
  const hasArabicChars = /[\u0600-\u06FF]/.test(prompt);
  const isAr = language === 'ar' || hasArabicChars;

  if (q.includes('mern') || q.includes('stack') || q.includes('node') || q.includes('react') || q.includes('تقني') || q.includes('مهارات')) {
    if (isAr) {
      return `يتخصص المهندس عبد الرحمن الضمراني في معمارية وتطوير تطبيقات الويب الحديثة (MERN & Next.js) بخبرة عملية تتجاوز +7 سنوات:
- **تطوير الواجهات (Frontend)**: React 19/18, Next.js (App & Pages router), TypeScript, Zustand, Redux Toolkit, Tailwind CSS.
- **الخوادم والـ APIs (Backend)**: Node.js, Express.js, Nest.js بمعمارية نظيفة ثلاثية الطبقات (Controller-Service-Repository)، ومعالجة مركزية للأخطاء.
- **قواعد البيانات (Databases)**: تصميم متقدم لـ MongoDB مع فهارس مركبة وخطوط تجميع (Aggregation Pipelines)، بالإضافة إلى Redis للتخزين المؤقت (Caching).
- **الذكاء الاصطناعي (AI & ML)**: +3 سنوات خبرة في دمج نماذج التعلم الآلي والـ Gemini API والوكلاء التفاعليين.`;
    }
    return `Abdelrahman Eldamarany specializes in the modern MERN & Next.js ecosystem with 7+ years of industry experience:
- **Frontend Architecture**: React 19/18, Next.js (Server & Client Components), TypeScript, Zustand, Redux Toolkit, Tailwind CSS.
- **Backend & APIs**: Node.js, Express.js, Nest.js with layered controller-service-repository patterns, robust middleware, and centralized error handling.
- **Database Engineering**: Production MongoDB design with compound indices, aggregation pipelines, and Redis caching.
- **AI & ML**: 3+ years experience integrating modern AI models (including Gemini Flash & Live API).`;
  }

  if (q.includes('project') || q.includes('مشروع') || q.includes('مشاريع') || q.includes('task') || q.includes('nana')) {
    if (isAr) {
      return `قام عبد الرحمن بتصميم وتطوير العديد من الأنظمة البرمجية المتكاملة بمستوى Production-grade:
1. **نظام إدارة المهام (Task Management System)**: تطبيق MERN متكامل مع توثيق JWT وأذونات الأدوار واستعلامات MongoDB سريعة.
2. **منصة Nana Food**: تطبيق توصيل بـ React و TypeScript و Zustand وتتبع فوري للسائقين عبر خرائط Google.
3. **نظام إدارة المول الذكي (Smart Mall)**: منصة إدارة مراكز تجارية بـ Next.js و TypeScript ومساعد ذكي للعملاء.
4. **منصة ShopSphere**: متجر إلكتروني بـ React و TypeScript و Supabase و Context API.
5. **لوحة العمليات التجارية (Business Operations Dashboard)**: لوحة بيانات إدارية بـ React و Node.js و Redux.
6. **تطبيق المعالم المعتمد على الموقع (Landmarks App)**: دليل سياحي تفاعلي بـ Next.js و Supabase ومساعد AI.
يمكنك استعراض تفاصيل كافة المشاريع في صفحة المشاريع أو الكونسول!`;
    }
    return `Abdelrahman has engineered several production-grade applications featured in this portfolio:
1. **Task Management System**: Full-stack MERN with JWT auth, role-based workflows, and indexed MongoDB aggregation.
2. **Nana Food**: React and TypeScript delivery client with Google Maps driver telemetry and Zustand state slices.
3. **Smart Mall Management System**: Next.js admin portal with an AI-powered customer support chatbot.
4. **ShopSphere**: React e-commerce platform with Supabase backend and Context API state.
5. **Business Operations Dashboard**: React/Node.js/Redux data management dashboard with high-throughput tables.
Feel free to explore the interactive Ticket and Projects tab in the console!`;
  }

  if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('تواصل') || q.includes('ايميل') || q.includes('توظيف')) {
    if (isAr) {
      return `يمكنك التواصل مباشرة مع المهندس عبد الرحمن الضمراني عبر:
- **البريد الإلكتروني**: abdelrahmaneldamarany99@gmail.com
- **الهاتف**: +02-01111295894
- **LinkedIn**: https://linkedin.com/in/abdelrahman-eldamarany/
- **GitHub**: https://github.com/abdelrahmaneldamarany99
كما يمكنك إرسال رسالة مباشرة عبر نافذة "تواصل معي" في الشريط العلوي!`;
    }
    return `You can reach Abdelrahman Eldamarany directly via:
- **Email**: abdelrahmaneldamarany99@gmail.com
- **Phone**: +02-01111295894
- **LinkedIn**: https://linkedin.com/in/abdelrahman-eldamarany/
- **GitHub**: https://github.com/abdelrahmaneldamarany99
You can also send a direct message through the Contact dialog in the top navigation!`;
  }

  if (q.includes('test') || q.includes('qa') || q.includes('اختبار') || q.includes('جودة')) {
    if (isAr) {
      return `يولي عبد الرحمن أولوية قصوى لمعايير الجودة وهندسة النظم:
- حزم اختبارات Unit و Integration باستخدام Jest و React Testing Library (بنسبة تغطية تتجاوز 90% للمسارات الحيوية).
- اختبارات تكامل لنقاط الـ REST Endpoints باستخدام Supertest.
- خطوط فحص وتحقق آلية CI/CD قبل نشر أي كود إلى الإنتاج.
يمكنك تشغيل حزمة الاختبارات الحية مباشرة عبر تبويب **الكونسول التقني -> Test Runner**!`;
    }
    return `Abdelrahman treats testing as a first-class engineering discipline:
- Unit testing with Jest and React Testing Library (>90% coverage on critical paths).
- Integration testing with Supertest on Express endpoints.
- End-to-end regression validation and automated CI/CD pipeline checks.
You can run live automated test suites directly in the **Console Suite -> Test Runner**!`;
  }

  if (isAr) {
    return `أهلاً بك! المهندس عبد الرحمن الضمراني مطور تطبيقات MERN و React و Next.js بخبرة +7 سنوات في التطوير المتكامل و +3 سنوات في الذكاء الاصطناعي.
كيف يمكنني مساعدتك اليوم؟ يمكنك سؤالي عن المعمارية البرمجية، تفاصيل المشاريع، معايير الاختبارات، أو معلومات التواصل.`;
  }

  return `Abdelrahman Eldamarany is a React / Next.js / MERN Full-Stack Developer with 7+ years of experience and hands-on AI/ML expertise.
How can I assist you today? You can ask about his architecture strategies, project implementations, testing practices, or contact information.`;
}
