(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  const mobileQuery = window.matchMedia('(max-width: 780px)');

  function closeMenu(restoreFocus = false) {
    if (!menuButton || !nav) return;
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
    if (restoreFocus) menuButton.focus();
  }

  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) nav.querySelector('a')?.focus();
  });

  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('click', event => {
    if (mobileQuery.matches && nav?.classList.contains('open') && !nav.contains(event.target) && !menuButton?.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav?.classList.contains('open')) closeMenu(true);
  });
  mobileQuery.addEventListener?.('change', () => closeMenu());

  function makeTabs(selector, panelPrefix, onChange) {
    const buttons = [...document.querySelectorAll(selector)];
    if (!buttons.length) return;
    function activate(button, moveFocus = false) {
      const value = button.dataset.step || button.dataset.experience;
      buttons.forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', String(active));
        item.tabIndex = active ? 0 : -1;
        const itemValue = item.dataset.step || item.dataset.experience;
        const panel = document.getElementById(`${panelPrefix}${itemValue}`);
        if (panel) {
          panel.hidden = !active;
          panel.classList.toggle('active', active);
        }
      });
      if (moveFocus) button.focus();
      onChange?.(value);
    }
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => activate(button));
      button.addEventListener('keydown', event => {
        let next = index;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % buttons.length;
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + buttons.length) % buttons.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = buttons.length - 1;
        else return;
        event.preventDefault();
        activate(buttons[next], true);
      });
    });
  }

  makeTabs('.workflow-tab', 'panel-');

  const mockText = {
    motorist: {
      label: 'MOTORIST LOOKUP', eyebrow: 'YOUR NOTICE', title: 'A clearer way<br>to follow a fine.',
      refLabel: 'REFERENCE', ref: 'SAMPLE NOTICE', sideLabel: 'NEXT STEP', side: 'Review payment<br>or court options', progress: '38%'
    },
    operator: {
      label: 'OPERATIONS VIEW', eyebrow: 'WORK QUEUE', title: 'See what needs<br>attention.',
      refLabel: 'RECONCILIATION', ref: 'SETTLEMENT REVIEW', sideLabel: 'NEXT STEP', side: 'Inspect evidence<br>and resolve', progress: '71%'
    }
  };
  makeTabs('.experience-switch [role="tab"]', 'experience-', value => {
    const data = mockText[value];
    if (!data) return;
    document.getElementById('mock-label').textContent = data.label;
    document.getElementById('mock-eyebrow').textContent = data.eyebrow;
    document.getElementById('mock-title').innerHTML = data.title;
    document.getElementById('mock-ref-label').textContent = data.refLabel;
    document.getElementById('mock-ref-value').textContent = data.ref;
    document.getElementById('mock-side-label').textContent = data.sideLabel;
    document.getElementById('mock-side-value').innerHTML = data.side;
    document.querySelector('.mock-progress-track span').style.width = data.progress;
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 25px 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }
})();
