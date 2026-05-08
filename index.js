const root = document.documentElement;
const themeButtons = document.querySelectorAll('[data-theme-choice]');
const languageButtons = document.querySelectorAll('[data-language-choice]');
const switchers = document.querySelectorAll('.switcher');
const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
const compactSwitcherQuery = window.matchMedia('(max-width: 560px)');

function updateCompactSwitcherWidth(switcher) {
  if (!compactSwitcherQuery.matches) return;

  const buttons = Array.from(switcher.querySelectorAll('.theme-option'));
  const activeButton =
    buttons.find((button) => button.classList.contains('is-active')) || buttons[0];
  if (!activeButton) return;

  const styles = window.getComputedStyle(switcher);
  const gap = Number.parseFloat(styles.columnGap || styles.gap || '0');
  const paddingLeft = Number.parseFloat(styles.paddingLeft || '0');
  const paddingRight = Number.parseFloat(styles.paddingRight || '0');
  const collapsedWidth = activeButton.offsetWidth + paddingLeft + paddingRight;
  const expandedWidth =
    buttons.reduce((total, button) => total + button.offsetWidth, 0) +
    gap * Math.max(buttons.length - 1, 0) +
    paddingLeft +
    paddingRight;

  switcher.style.setProperty('--compact-width', `${collapsedWidth}px`);
  switcher.style.setProperty('--expanded-width', `${expandedWidth}px`);
}

function collapseCompactSwitcher(switcher) {
  switcher.classList.remove('is-expanded');
  updateCompactSwitcherWidth(switcher);
}

function collapseCompactSwitchers(exceptSwitcher) {
  switchers.forEach((switcher) => {
    if (switcher !== exceptSwitcher) {
      collapseCompactSwitcher(switcher);
    }
  });
}

function syncCompactSwitchers() {
  switchers.forEach((switcher) => {
    if (compactSwitcherQuery.matches) {
      switcher.classList.add('is-compact');
      updateCompactSwitcherWidth(switcher);
    } else {
      switcher.classList.remove('is-compact', 'is-expanded');
      switcher.style.removeProperty('--compact-width');
      switcher.style.removeProperty('--expanded-width');
    }
  });
}

function getResolvedTheme(choice) {
  if (choice === 'system') {
    return systemThemeQuery.matches ? 'dark' : 'light';
  }
  return choice;
}

function applyTheme(choice) {
  const selected = choice || localStorage.getItem('preferred-theme') || 'system';
  const resolved = getResolvedTheme(selected);

  root.dataset.theme = resolved;
  root.dataset.themeChoice = selected;
  localStorage.setItem('preferred-theme', selected);

  themeButtons.forEach((button) => {
    const active = button.dataset.themeChoice === selected;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  syncCompactSwitchers();
}

switchers.forEach((switcher) => {
  switcher.addEventListener(
    'click',
    (event) => {
      if (!compactSwitcherQuery.matches) return;

      const button = event.target.closest('.theme-option');
      if (!button) return;

      const isExpanded = switcher.classList.contains('is-expanded');
      const isActive = button.classList.contains('is-active');

      if (!isExpanded && isActive) {
        event.preventDefault();
        event.stopPropagation();
        collapseCompactSwitchers(switcher);
        switcher.classList.add('is-expanded');
        updateCompactSwitcherWidth(switcher);
        return;
      }

      if (isExpanded && isActive) {
        event.preventDefault();
        event.stopPropagation();
        collapseCompactSwitcher(switcher);
      }
    },
    true,
  );

  switcher.addEventListener('click', (event) => {
    if (!compactSwitcherQuery.matches) return;

    const button = event.target.closest('.theme-option');
    if (!button || !switcher.classList.contains('is-expanded')) return;

    requestAnimationFrame(() => {
      collapseCompactSwitcher(switcher);
    });
  });
});

themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    applyTheme(button.dataset.themeChoice);
  });
});

languageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    applyLanguage(button.dataset.languageChoice);
  });
});

systemThemeQuery.addEventListener('change', () => {
  if ((localStorage.getItem('preferred-theme') || 'system') === 'system') {
    applyTheme('system');
  }
});

compactSwitcherQuery.addEventListener('change', () => {
  syncCompactSwitchers();
});

document.addEventListener('click', (event) => {
  if (!compactSwitcherQuery.matches) return;
  if (event.target.closest('.switcher')) return;
  collapseCompactSwitchers();
});

applyTheme(localStorage.getItem('preferred-theme') || 'system');
syncCompactSwitchers();

document.querySelectorAll('[data-scroll-to="work"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const target = document.querySelector('.cards-section');
    if (!target) return;

    const headerOffset = 0;
    const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: targetTop,
      behavior: 'smooth',
    });
  });
});

window.addEventListener('load', () => {
  if (typeof gsap === 'undefined') {
    console.error('GSAP failed to load.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({
    ignoreMobileResize: true,
  });

  ScrollTrigger.matchMedia({
    '(min-width: 861px)': function () {
      initCardScroll({
        yIn: 120,
        prevY: -24,
        prevRotateX: 14,
        prevScale: 0.9,
        prevOpacity: 0.32,
        nextRotateX: -14,
        nextRotateZ: 3,
        nextScale: 0.9,
        endMultiplier: 1.2,
        scrub: 0.7,
        useBlur: false,
      });
    },

    '(max-width: 860px)': function () {
      initCardScroll({
        yIn: 32,
        prevY: -10,
        prevRotateX: 0,
        prevScale: 0.965,
        prevOpacity: 0.05,
        nextRotateX: 0,
        nextRotateZ: 0,
        nextScale: 0.965,
        endMultiplier: 1.1,
        scrub: 0.8,
        useBlur: false,
      });
    },
  });

  function initCardScroll(options) {
    const cards = gsap.utils.toArray('.profile-card');
    if (!cards.length) return;

    let timeline;

    function applyCardState(index, isActive) {
      const card = cards[index];
      if (!card) return;

      gsap.set(card, {
        yPercent: isActive ? 0 : options.yIn,
        rotateX: isActive ? 0 : options.nextRotateX,
        rotateZ: isActive ? 0 : options.nextRotateZ,
        scale: isActive ? 1 : options.nextScale,
        opacity: isActive ? 1 : 0,
        filter: options.useBlur ? 'blur(0px)' : 'none',
        force3D: true,
      });
    }

    function resetCards() {
      cards.forEach((_, index) => applyCardState(index, index === 0));
    }

    gsap.set(cards, {
      clearProps: 'transform,opacity,filter',
      transformPerspective: 1800,
      force3D: true,
    });

    resetCards();

    timeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.cards-section',
        start: 'top top',
        end: () => '+=' + window.innerHeight * (cards.length + options.endMultiplier),
        scrub: options.scrub,
        pin: '.cards-pin',
        anticipatePin: 1,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
        onRefreshInit: resetCards,
        onLeaveBack: () => {
          resetCards();
          timeline.progress(0);
        },
      },
    });

    cards.forEach((card, index) => {
      if (index === 0) return;

      const previous = cards[index - 1];

      timeline
        .to(previous, {
          yPercent: options.prevY,
          rotateX: options.prevRotateX,
          rotateZ: -2,
          scale: options.prevScale,
          opacity: options.prevOpacity,
          filter: options.useBlur ? 'blur(2px)' : 'none',
          duration: 1,
          ease: 'none',
          force3D: true,
          overwrite: 'auto',
        })
        .to(
          card,
          {
            yPercent: 0,
            rotateX: 0,
            rotateZ: 0,
            scale: 1,
            opacity: 1,
            filter: options.useBlur ? 'blur(0px)' : 'none',
            duration: 1,
            ease: 'none',
            force3D: true,
            overwrite: 'auto',
          },
          '<0.12',
        );
    });

    timeline.to(cards[cards.length - 1], {
      yPercent: -8,
      scale: 0.97,
      opacity: 1,
      duration: 0.8,
      ease: 'none',
      force3D: true,
      overwrite: 'auto',
    });
  }

  gsap.from('.hero .eyebrow, .hero h1, .hero-copy', {
    y: 48,
    opacity: 0,
    duration: 1.2,
    stagger: 0.12,
    ease: 'power3.out',
  });

  gsap.from('.closing .closing-kicker, .closing h2, .closing p', {
    scrollTrigger: {
      trigger: '.closing',
      start: 'top 72%',
    },
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.12,
    ease: 'power3.out',
  });

  window.addEventListener('resize', () => {
    syncCompactSwitchers();
    ScrollTrigger.refresh();
  });
});
