import puppeteer from 'puppeteer-core';

const BASE = process.env.CHECK_URL || 'http://localhost:3000';
const WIDTHS = [320, 360, 390, 414, 768, 1024, 1280, 1440, 1920];
const ROUTES = ['#/overview', '#/projects', '#/experience', '#/skills', '#/engineering', '#/console'];
const LANG = process.env.CHECK_LANG || 'en';

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
});

const page = await browser.newPage();
let failures = 0;

for (const width of WIDTHS) {
  await page.setViewport({ width, height: 900 });
  for (const route of ROUTES) {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await page.evaluate((lang) => localStorage.setItem('portfolio-language', lang), LANG);
    await page.goto(`${BASE}/${route}`, { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 800));

    const measure = () =>
      page.evaluate(() => {
        const doc = document.documentElement;
        const overflow = doc.scrollWidth - doc.clientWidth;
        const culprits = [];
        if (overflow > 1) {
          const inScroller = (el) => {
            for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
              const ox = getComputedStyle(p).overflowX;
              if (ox === 'auto' || ox === 'scroll' || ox === 'hidden' || ox === 'clip') return true;
            }
            return false;
          };
          document.querySelectorAll('*').forEach((el) => {
            const rect = el.getBoundingClientRect();
            if ((rect.right > doc.clientWidth + 1 || rect.left < -1) && !inScroller(el)) {
              const cls = typeof el.className === 'string' ? el.className.slice(0, 90) : '';
              culprits.push(
                `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}.${cls.split(' ').slice(0, 3).join('.')} right=${Math.round(rect.right)} left=${Math.round(rect.left)}`
              );
            }
          });
        }
        return { overflow, culprits: culprits.slice(0, 8) };
      });

    const report = await measure();
    const states = [[route, report]];

    if (route === '#/console') {
      const tabCount = await page.evaluate(() => {
        const bar = document.querySelector('[data-console-tabs]');
        if (!bar) return 0;
        window.__tabButtons = [...bar.querySelectorAll('button')];
        return window.__tabButtons.length;
      });
      for (let i = 0; i < tabCount; i++) {
        await page.evaluate((idx) => window.__tabButtons[idx].click(), i);
        await new Promise((r) => setTimeout(r, 700));
        states.push([`${route} tab${i}`, await measure()]);
      }
    }

    for (const [label, rep] of states) {
      if (rep.overflow > 1) {
        failures++;
        console.log(`OVERFLOW ${rep.overflow}px @ ${width}px ${label}`);
        rep.culprits.forEach((c) => console.log(`   ${c}`));
      } else {
        console.log(`ok ${width}px ${label}`);
      }
    }
  }
}

await browser.close();
process.exit(failures ? 1 : 0);
