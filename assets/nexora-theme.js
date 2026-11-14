/**
 * NEXORA / TEKNOVA Theme JavaScript
 * Handles interactive elements, countdowns, tickers, and Theme Editor hooks.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAnnouncementBar();
  initCountdownTimers();
  initMobileMenu();
  initTabs();
});

// Support Shopify Theme Editor re-rendering
if (window.Shopify && Shopify.designMode) {
  document.addEventListener('shopify:section:load', (event) => {
    initAnnouncementBar();
    initCountdownTimers();
    initTabs();
  });
}

/**
 * 1. Announcement Ticker Cycling
 */
function initAnnouncementBar() {
  const bars = document.querySelectorAll('[data-announcement-bar]');
  bars.forEach((bar) => {
    const items = bar.querySelectorAll('[data-announcement-item]');
    if (items.length <= 1) return;

    let currentIndex = 0;
    const intervalTime = parseInt(bar.dataset.interval || '4000', 10);

    // Show first item initially
    items.forEach((item, index) => {
      item.style.display = index === 0 ? 'flex' : 'none';
      item.style.opacity = index === 0 ? '1' : '0';
      item.style.transition = 'opacity 300ms ease';
    });

    if (bar._intervalId) clearInterval(bar._intervalId);

    bar._intervalId = setInterval(() => {
      const currentItem = items[currentIndex];
      currentIndex = (currentIndex + 1) % items.length;
      const nextItem = items[currentIndex];

      currentItem.style.opacity = '0';
      setTimeout(() => {
        currentItem.style.display = 'none';
        nextItem.style.display = 'flex';
        setTimeout(() => {
          nextItem.style.opacity = '1';
        }, 50);
      }, 300);
    }, intervalTime);
  });
}

/**
 * 2. Countdown Timer
 */
function initCountdownTimers() {
  const timers = document.querySelectorAll('[data-countdown-timer]');
  timers.forEach((timer) => {
    const daysEl = timer.querySelector('[data-days]');
    const hoursEl = timer.querySelector('[data-hours]');
    const minsEl = timer.querySelector('[data-mins]');
    const secsEl = timer.querySelector('[data-secs]');

    // Check for target timestamp or default relative timer
    let targetTime = timer.dataset.targetDate ? new Date(timer.dataset.targetDate).getTime() : null;
    
    // If no target date is set or it's in the past, run a simulated recurring 48-hour loop
    if (!targetTime || targetTime <= Date.now()) {
      let durationHours = parseInt(timer.dataset.durationHours || '48', 10);
      targetTime = Date.now() + durationHours * 60 * 60 * 1000 - 15 * 60 * 1000;
    }

    function update() {
      const now = Date.now();
      const distance = targetTime - now;

      if (distance < 0) {
        if (daysEl) daysEl.textContent = '00';
        if (hoursEl) hoursEl.textContent = '00';
        if (minsEl) minsEl.textContent = '00';
        if (secsEl) secsEl.textContent = '00';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = days < 10 ? '0' + days : days;
      if (hoursEl) hoursEl.textContent = hours < 10 ? '0' + hours : hours;
      if (minsEl) minsEl.textContent = minutes < 10 ? '0' + minutes : minutes;
      if (secsEl) secsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
    }

    update();
    setInterval(update, 1000);
  });
}

/**
 * 3. Mobile Hamburger Menu Toggle
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector('[data-mobile-menu-toggle]');
  const drawer = document.querySelector('[data-mobile-menu-drawer]');
  const closeBtn = document.querySelector('[data-mobile-menu-close]');
  const backdrop = document.querySelector('[data-mobile-menu-backdrop]');

  if (!toggleBtn || !drawer) return;

  function openMenu() {
    drawer.classList.remove('translate-x-full');
    drawer.classList.add('translate-x-0');
    if (backdrop) backdrop.classList.remove('hidden');
    document.body.classList.add('mobile-menu-open');
  }

  function closeMenu() {
    drawer.classList.remove('translate-x-0');
    drawer.classList.add('translate-x-full');
    if (backdrop) backdrop.classList.add('hidden');
    document.body.classList.remove('mobile-menu-open');
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);
}

/**
 * 4. Filter Tabs in Product Sections
 */
function initTabs() {
  const tabContainers = document.querySelectorAll('[data-tabs-container]');
  tabContainers.forEach((container) => {
    const buttons = container.querySelectorAll('[data-tab-button]');
    const panels = container.querySelectorAll('[data-tab-panel]');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tabTarget;

        buttons.forEach((b) => {
          b.classList.remove('bg-surface-container-lowest', 'text-on-surface', 'font-semibold', 'shadow-sm');
          b.classList.add('text-on-surface-variant', 'font-medium');
        });

        btn.classList.add('bg-surface-container-lowest', 'text-on-surface', 'font-semibold', 'shadow-sm');
        btn.classList.remove('text-on-surface-variant', 'font-medium');

        if (panels.length > 0) {
          panels.forEach((p) => {
            if (target === 'all' || p.dataset.tabCategory === target) {
              p.style.display = '';
            } else {
              p.style.display = 'none';
            }
          });
        }
      });
    });
  });
}
