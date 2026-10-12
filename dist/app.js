(() => {
  const content = window.siteContent;
  const languageButton = document.querySelector('.language');
  let lang = 'zh';
  try { lang = localStorage.getItem('dataverse-language') === 'en' ? 'en' : 'zh'; } catch {}
  function applyLanguage(next) {
    lang = next;
    const copy = content[lang];
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = copy.title;
    document.querySelector('meta[name="description"]').content = copy.description;
    document.querySelector('meta[property="og:title"]').content = copy.title;
    document.querySelector('meta[property="og:description"]').content = copy.description;
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = copy[el.dataset.i18n]; });
    document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = copy[el.dataset.i18nHtml]; });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', copy[el.dataset.i18nAria]); });
    document.querySelectorAll('[data-i18n-alt]').forEach(el => { el.alt = copy[el.dataset.i18nAlt]; });
    languageButton.setAttribute('aria-label', lang === 'zh' ? 'Switch to English' : '切换为中文');
    document.querySelector('.lang-zh').classList.toggle('selected', lang === 'zh');
    document.querySelector('.lang-en').classList.toggle('selected', lang === 'en');
    try { localStorage.setItem('dataverse-language', lang); } catch {}
    window.dispatchEvent(new CustomEvent('dataverse:language'));
  }
  applyLanguage(lang);
  languageButton.addEventListener('click', () => applyLanguage(lang === 'zh' ? 'en' : 'zh'));
  document.getElementById('year').textContent = new Date().getFullYear();
  // Deterministic, lightweight illustration with no WebGL or dependencies.
  if (document.getElementById('data-universe')) {
  const NS = 'http://www.w3.org/2000/svg';
  const points = []; let seed = 42;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  for (let i = 0; i < 94; i++) {
    const a = random() * Math.PI * 2; const r = 45 + Math.sqrt(random()) * 145;
    const x = 268 + Math.cos(a) * r; const y = 244 + Math.sin(a) * r * .92;
    points.push({ x, y });
    const circle = document.createElementNS(NS, 'circle');
    circle.setAttribute('cx', x); circle.setAttribute('cy', y);
    circle.setAttribute('r', i % 13 === 0 ? 3 : i % 5 === 0 ? 2 : 1.3);
    circle.setAttribute('fill', i % 13 === 0 ? '#d96443' : '#6b87a0');
    circle.setAttribute('opacity', i % 3 === 0 ? '.8' : '.45');
    if (i % 7 === 0) { circle.classList.add('data-pulse'); circle.style.animationDelay = `${random() * -5}s`; }
    document.getElementById('universe-points').appendChild(circle);
  }
  points.forEach((p, i) => {
    points.slice(i + 1).forEach(q => {
      const distance = Math.hypot(p.x - q.x, p.y - q.y);
      if (distance > 25 && distance < 68) {
        const line = document.createElementNS(NS, 'line');
        for (const [key, value] of Object.entries({x1:p.x, y1:p.y, x2:q.x, y2:q.y, stroke:'#bccbd8', 'stroke-width':'.55', opacity:'.28'})) line.setAttribute(key, value);
        document.getElementById('universe-lines').appendChild(line);
      }
    });
  });
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.nav a').forEach(a => a.classList.toggle('current', a.hash === `#${entry.target.id}`));
        }
      });
    }, {rootMargin:'-15% 0px -50% 0px'});
    document.querySelectorAll('#home,#approach,#data,#team,#contact').forEach(section => observer.observe(section));
  }
})();
