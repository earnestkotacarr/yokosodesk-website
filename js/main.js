// ============================================
// Hotel Mate — Main JS
// ============================================

(function () {
  'use strict';

  document.documentElement.classList.add('js');

  // --- Navbar scroll effect ---
  var nav = document.querySelector('.nav');

  function onScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial check

  // --- Mobile hamburger toggle ---
  var hamburger = document.querySelector('.nav-hamburger');
  var navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      var navHeight = nav.offsetHeight;
      var targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;

      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    });
  });

  // --- Scroll reveals ---
  // Tag section content; siblings matched by the same selector within a
  // section stagger via --reveal-delay.
  var revealGroups = [
    '.section-label, .section-heading, .section-sub',
    '.service-card',
    '.product-info, .product-terminal',
    '.step',
    '.card',
    '.stat',
    '.case-card',
    '.cta-banner-heading, .cta-banner-sub, .cta-banner .btn',
    '.contact-email, .contact-location'
  ];

  var supportsObserver = 'IntersectionObserver' in window;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (supportsObserver && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    document.querySelectorAll('.section, .cta-banner').forEach(function (scope) {
      revealGroups.forEach(function (selector) {
        scope.querySelectorAll(selector).forEach(function (el, i) {
          el.classList.add('reveal');
          el.style.setProperty('--reveal-delay', (i * 90) + 'ms');
          revealObserver.observe(el);
        });
      });
    });

    // --- Terminal log lines type in sequentially ---
    var terminalObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var terminal = entry.target;
        terminal.querySelectorAll('.terminal-body > div').forEach(function (line, i) {
          line.style.transitionDelay = (200 + i * 160) + 'ms';
        });
        terminal.classList.add('in-view');
        terminalObserver.unobserve(terminal);
      });
    }, { threshold: 0.35 });

    document.querySelectorAll('.terminal').forEach(function (t) {
      terminalObserver.observe(t);
    });
  } else {
    // No observer or reduced motion: show everything immediately
    document.querySelectorAll('.terminal').forEach(function (t) {
      t.classList.add('in-view');
    });
  }
})();
