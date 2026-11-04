/**
 * Слуцкие электрические сети — полноценный сайт филиала
 * script.js
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initSmoothScroll();
  initCounters();
  initContactForm();
  initActiveNav();
  initScrollTop();
  initReveal();
});

/* ===== Header scroll effect ===== */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ===== Mobile navigation ===== */
function initMobileNav() {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !burger.contains(e.target) && nav.classList.contains('open')) {
      nav.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ===== Smooth scroll ===== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ===== Animated counters ===== */
function initCounters() {
  const items = document.querySelectorAll('.stat-item');
  if (!items.length) return;

  const animateValue = (el, target, duration = 1600) => {
    const valueEl = el.querySelector('.stat-item__value');
    if (!valueEl) return;

    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      valueEl.textContent = current.toLocaleString('ru-RU');

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        valueEl.textContent = target.toLocaleString('ru-RU');
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const item = entry.target;
          const target = parseInt(item.dataset.target, 10);
          if (!isNaN(target)) {
            animateValue(item, target);
          }
          obs.unobserve(item);
        }
      });
    },
    { threshold: 0.3 }
  );

  items.forEach(item => observer.observe(item));
}

/* ===== Contact form ===== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#name')?.value.trim();
    const email = form.querySelector('#email')?.value.trim();
    const message = form.querySelector('#message')?.value.trim();

    if (!name || !email || !message) {
      showToast('Пожалуйста, заполните все поля');
      return;
    }

    showToast('Сообщение принято. Спасибо за обращение!');
    form.reset();
  });
}

/* ===== Toast ===== */
function showToast(text) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = text;
  toast.classList.add('show');

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* ===== Active nav on scroll ===== */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav__link');

  if (!sections.length || !links.length) return;

  const onScroll = () => {
    const scrollPos = window.scrollY + 110;

    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ===== Scroll to top button ===== */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  const toggle = () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  };

  window.addEventListener('scroll', toggle, { passive: true });
  toggle();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===== Section reveal on scroll ===== */
function initReveal() {
  const sections = document.querySelectorAll('[data-animate]');
  if (!sections.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    sections.forEach(s => s.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  sections.forEach(s => observer.observe(s));
}
