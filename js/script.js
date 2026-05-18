/* ============================================
   SONIC WAVE — ProSound Elite X1
   Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Loading Screen ---
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 2000);
  }

  // --- Navbar Scroll Effect ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
      backTop.classList.toggle('visible', window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // --- Active Nav Links ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Hamburger / Mobile Nav ---
  const hamburger = document.querySelector('.hamburger');
  const navMobile  = document.querySelector('.nav-mobile');
  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navMobile.classList.toggle('open');
      document.body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
    });
    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMobile.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Back to Top ---
  const backTop = document.getElementById('back-top');
  if (backTop) {
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // --- Reveal on Scroll (IntersectionObserver) ---
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  // --- Animated Counters ---
  const counterEls = document.querySelectorAll('[data-count]');
  if (counterEls.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseInt(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const dur    = 1800;
          const start  = performance.now();
          const update = (now) => {
            const t = Math.min((now - start) / dur, 1);
            const ease = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.floor(ease * target) + suffix;
            if (t < 1) requestAnimationFrame(update);
          };
          requestAnimationFrame(update);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counterEls.forEach(el => counterObserver.observe(el));
  }

  // --- FAQ Accordion ---
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // --- Gallery Modal ---
  const galleryItems = document.querySelectorAll('.gallery-item');
  const modalOverlay  = document.getElementById('gallery-modal');
  const modalImg      = document.getElementById('modal-img');
  const modalClose    = document.getElementById('modal-close');
  const modalPrev     = document.getElementById('modal-prev');
  const modalNext     = document.getElementById('modal-next');
  let currentIdx = 0;

  const openModal = (idx) => {
    currentIdx = idx;
    const img = galleryItems[idx]?.querySelector('img');
    if (img && modalImg) {
      modalImg.src = img.src;
      modalImg.alt = img.alt;
    }
    if (modalOverlay) modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    if (modalOverlay) modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => openModal(idx));
  });
  if (modalClose)   modalClose.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
  if (modalPrev)    modalPrev.addEventListener('click', () => openModal((currentIdx - 1 + galleryItems.length) % galleryItems.length));
  if (modalNext)    modalNext.addEventListener('click', () => openModal((currentIdx + 1) % galleryItems.length));

  document.addEventListener('keydown', e => {
    if (!modalOverlay?.classList.contains('open')) return;
    if (e.key === 'Escape')     closeModal();
    if (e.key === 'ArrowLeft')  modalPrev?.click();
    if (e.key === 'ArrowRight') modalNext?.click();
  });

  // --- Newsletter Form ---
  const nlForm = document.querySelector('.newsletter-form-el');
  if (nlForm) {
    nlForm.addEventListener('submit', e => {
      e.preventDefault();
      const input   = nlForm.querySelector('.newsletter-input');
      const success = nlForm.querySelector('.newsletter-success') || document.querySelector('.newsletter-success');
      if (input?.value) {
        input.value = '';
        if (success) { success.style.display = 'block'; setTimeout(() => success.style.display = 'none', 3000); }
      }
    });
  }

  // --- Contact Form ---
  const contactForm = document.querySelector('.contact-form-el');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const success = document.querySelector('.form-success');
      if (success) {
        success.classList.add('show');
        contactForm.reset();
        setTimeout(() => success.classList.remove('show'), 4000);
      }
    });
  }

  // --- Hero Parallax (subtle) ---
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY * 0.25;
      heroBg.style.transform = `translateY(${offset}px)`;
    }, { passive: true });
  }

  // --- Typing Effect on hero title (optional) ---
  const heroTitle = document.querySelector('.hero-typed');
  if (heroTitle) {
    const words  = ['Experience', 'Excellence', 'Perfection'];
    let   wi     = 0, ci = 0, deleting = false;
    const type   = () => {
      const word = words[wi];
      heroTitle.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ++ci);
      let delay = deleting ? 60 : 110;
      if (!deleting && ci === word.length)   { delay = 1800; deleting = true; }
      if (deleting  && ci === 0)             { deleting = false; wi = (wi + 1) % words.length; delay = 400; }
      setTimeout(type, delay);
    };
    type();
  }

  // --- Smooth anchor scrolling (within page) ---
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id  = a.getAttribute('href').slice(1);
      const el  = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
