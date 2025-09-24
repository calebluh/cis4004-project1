// Accent color options
const accentOptions = [
  { name: 'Dark Purple', value: '#6c2eb7' },
  { name: 'Blue', value: '#5da1f3' },
  { name: 'Cyan', value: '#5dd3f3' },
  { name: 'Teal', value: '#5df3e3' },
  { name: 'Red', value: '#f35d5d' },
  { name: 'Orange', value: '#f3c05d' },
  { name: 'Pink', value: '#f35d99' },
  { name: 'Purple', value: '#d55df3' },
  { name: 'Lime', value: '#d5f35d' },
  { name: 'Green', value: '#8bf35d' },
  { name: 'White', value: '#ffffff' },
  { name: 'Black', value: '#000000' },
];

// Load navbar
document.addEventListener('DOMContentLoaded', async () => {
  const navbarPlaceholder = document.getElementById('navbar-placeholder');
  if (navbarPlaceholder) {
    const res = await fetch('navbar.html');
    navbarPlaceholder.innerHTML = await res.text();
  }

  // Highlight active nav link
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-item').forEach(link => {
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
    }
  });

  // Accent color picker logic
  const accentGrid = document.getElementById('accent-options');
  let currentAccent = localStorage.getItem('accent') || accentOptions[0].value;
  function setAccent(color) {
    document.documentElement.style.setProperty('--primary', color);
    currentAccent = color;
    localStorage.setItem('accent', color);
    updateAccentUI();
  }
  function updateAccentUI() {
    document.querySelectorAll('.accent-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.color === currentAccent);
    });
  }
  if (accentGrid) {
    accentGrid.innerHTML = '';
    accentOptions.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'accent-option';
      btn.dataset.color = opt.value;
      btn.style.background = opt.value;
      btn.title = opt.name;
      btn.onclick = () => setAccent(opt.value);
      accentGrid.appendChild(btn);
    });
    setAccent(currentAccent);
  }

  // Popover logic
  const popoverBtn = document.getElementById('accent-popover-btn');
  const popoverContent = document.getElementById('accent-popover-content');
  if (popoverBtn && popoverContent) {
    popoverBtn.addEventListener('click', e => {
      popoverContent.classList.toggle('visible');
      e.stopPropagation();
    });
    document.addEventListener('click', e => {
      if (!popoverContent.contains(e.target) && e.target !== popoverBtn) {
        popoverContent.classList.remove('visible');
      }
    });
  }

  // Theme toggle logic
  const themeToggle = document.getElementById('theme-toggle-checkbox');
  function setTheme(isDark) {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (themeToggle) themeToggle.checked = isDark;
  }
  if (themeToggle) {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setTheme(isDark);
    themeToggle.checked = isDark;
    themeToggle.addEventListener('change', () => setTheme(themeToggle.checked));
  }

  // Hamburger Menu Logic
  const hamburger = document.getElementById('hamburger-btn');
  const mobileSheet = document.getElementById('mobile-sheet');
  const navLinks = document.querySelector('.nav-links');
  const themeControls = document.querySelector('.theme-controls');
  const overlay = document.getElementById('sheet-overlay');

  // Populate mobile sheet with nav and controls
  if (mobileSheet && navLinks && themeControls) {
    mobileSheet.innerHTML = '';
    const navClone = navLinks.cloneNode(true);
    const controlsClone = themeControls.cloneNode(true);
    mobileSheet.appendChild(navClone);
    mobileSheet.appendChild(controlsClone);

    // Attach event listeners to cloned theme toggle and accent picker
    const mobileThemeToggle = controlsClone.querySelector('#theme-toggle-checkbox');
    const mobileAccentOptions = controlsClone.querySelectorAll('.accent-option');

    if (mobileThemeToggle) {
      mobileThemeToggle.addEventListener('change', () => {
        const isDark = mobileThemeToggle.checked;
        document.documentElement.classList.toggle('dark', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      });
    }

    if (mobileAccentOptions) {
      mobileAccentOptions.forEach(option => {
        option.addEventListener('click', () => {
          const color = option.dataset.color;
          document.documentElement.style.setProperty('--primary', color);
          localStorage.setItem('accent', color);
        });
      });
    }
  }

  function openMenu() {
    if (mobileSheet) mobileSheet.classList.add('open');
    if (overlay) overlay.classList.add('visible');
    document.body.classList.add('menu-open');
  }
  function closeMenu() {
    if (mobileSheet) mobileSheet.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
    document.body.classList.remove('menu-open');
  }

  if (hamburger) hamburger.addEventListener('click', openMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);
  if (mobileSheet) {
    mobileSheet.addEventListener('click', e => {
      if (e.target.classList.contains('nav-item')) {
        closeMenu();
      }
    });
  }
});