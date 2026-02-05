/**
 * Home Page Conversion Optimization JavaScript
 * Handles dynamic elements for maximum conversions
 */

(function() {
  'use strict';

  // ===========================
  // URGENCY COUNTDOWN TIMER
  // ===========================
  function initCountdown() {
    const countdownElements = document.querySelectorAll('.urgency-banner__countdown');
    
    countdownElements.forEach(element => {
      const type = element.dataset.countdownType;
      let endTime;

      if (type === 'daily') {
        // Daily countdown - resets at midnight
        const now = new Date();
        endTime = new Date(now);
        endTime.setHours(23, 59, 59, 999);
      } else if (type === 'fixed') {
        // Fixed countdown - set specific end date
        endTime = new Date(element.dataset.endDate);
      }

      if (!endTime || isNaN(endTime.getTime())) return;

      const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = endTime.getTime() - now;

        if (distance < 0) {
          // Timer expired, reset for daily or hide for fixed
          if (type === 'daily') {
            endTime = new Date();
            endTime.setDate(endTime.getDate() + 1);
            endTime.setHours(23, 59, 59, 999);
            return updateCountdown();
          } else {
            element.innerHTML = '<span class="countdown-expired">Sale Ended</span>';
            clearInterval(interval);
            return;
          }
        }

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const hoursEl = element.querySelector('[data-hours]');
        const minutesEl = element.querySelector('[data-minutes]');
        const secondsEl = element.querySelector('[data-seconds]');

        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
    });
  }

  // ===========================
  // STICKY CTA - Show after scroll
  // ===========================
  function initStickyCTA() {
    const stickyCTA = document.querySelector('.sticky-mobile-cta');
    if (!stickyCTA) return;

    let hasShown = false;

    const checkScroll = () => {
      const scrolled = window.scrollY;
      const viewportHeight = window.innerHeight;

      // Show after scrolling 50% of viewport
      if (scrolled > viewportHeight * 0.5 && !hasShown) {
        stickyCTA.style.display = 'block';
        hasShown = true;
      }
    };

    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkScroll();
          ticking = false;
        });
        ticking = true;
      }
    });

    checkScroll(); // Check on load
  }

  // ===========================
  // PRODUCT CARD HOVER EFFECTS
  // ===========================
  function enhanceProductCards() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
      // Add quick view functionality on hover (if quick_add is enabled)
      const quickAdd = card.querySelector('.quick-add__submit');
      if (quickAdd) {
        card.addEventListener('mouseenter', () => {
          quickAdd.style.opacity = '1';
          quickAdd.style.pointerEvents = 'auto';
        });
      }
    });
  }

  // ===========================
  // INTERSECTION OBSERVER FOR ANIMATIONS
  // ===========================
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe sections for fade-in animations
    const sections = document.querySelectorAll('.value-props, .comparison-section, .lifestyle-gallery, .trust-badges');
    sections.forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(30px)';
      section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      observer.observe(section);
    });
  }

  // ===========================
  // URGENCY STOCK COUNTER
  // ===========================
  function initStockCounter() {
    const stockMessages = document.querySelectorAll('[data-stock-urgency]');
    
    stockMessages.forEach(msg => {
      const count = Math.floor(Math.random() * 10) + 3; // Random between 3-12
      msg.textContent = `Only ${count} left in stock!`;
      msg.style.color = '#dc2626';
      msg.style.fontWeight = '700';
      msg.style.marginTop = '0.5rem';
    });
  }

  // ===========================
  // CUSTOMER COUNTER (Social Proof)
  // ===========================
  function initCustomerCounter() {
    const customerCounters = document.querySelectorAll('[data-customer-count]');
    
    customerCounters.forEach(counter => {
      const startCount = 847;
      const endCount = 1247;
      let currentCount = startCount;
      
      const increment = Math.floor(Math.random() * 5) + 1;
      const targetCount = Math.min(startCount + increment, endCount);
      
      counter.textContent = `${targetCount} people`;
    });
  }

  // ===========================
  // EMAIL SIGNUP ENHANCEMENT
  // ===========================
  function enhanceEmailSignup() {
    const emailForm = document.querySelector('.email-signup__form');
    if (!emailForm) return;

    const emailInput = emailForm.querySelector('input[type="email"]');
    const submitBtn = emailForm.querySelector('button[type="submit"]');

    if (!emailInput || !submitBtn) return;

    // Add placeholder animation
    const placeholders = [
      'your@email.com',
      'Get 10% off now...',
      'Join 5,000+ customers'
    ];
    let placeholderIndex = 0;

    setInterval(() => {
      placeholderIndex = (placeholderIndex + 1) % placeholders.length;
      emailInput.placeholder = placeholders[placeholderIndex];
    }, 3000);

    // Form validation
    emailForm.addEventListener('submit', (e) => {
      const email = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        e.preventDefault();
        emailInput.style.borderColor = '#dc2626';
        emailInput.placeholder = 'Please enter a valid email';
        
        setTimeout(() => {
          emailInput.style.borderColor = '';
          emailInput.placeholder = 'your@email.com';
        }, 3000);
      }
    });
  }

  // ===========================
  // COMPARISON TABLE HIGHLIGHT
  // ===========================
  function enhanceComparisonTable() {
    const ourCells = document.querySelectorAll('.comparison-table__value--us');
    
    ourCells.forEach(cell => {
      const checkIcon = cell.querySelector('.check-icon');
      if (checkIcon) {
        cell.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
      }
    });
  }

  // ===========================
  // ADD TO CART SUCCESS FEEDBACK
  // ===========================
  function enhanceAddToCart() {
    document.addEventListener('click', (e) => {
      const button = e.target.closest('.product-form__submit, .quick-add__submit');
      if (!button) return;

      // Add loading state
      button.classList.add('loading');
      
      // Simulate success after cart update
      setTimeout(() => {
        button.classList.remove('loading');
        button.classList.add('added');
        button.textContent = '✓ Added to Cart!';
        
        setTimeout(() => {
          button.classList.remove('added');
          button.textContent = 'Add to Cart';
        }, 2000);
      }, 800);
    });
  }

  // ===========================
  // PERFORMANCE MONITORING
  // ===========================
  function monitorPerformance() {
    if ('PerformanceObserver' in window) {
      // Monitor Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // Browser doesn't support this metric
      }
    }
  }

  // ===========================
  // MOBILE MENU OPTIMIZATION
  // ===========================
  function optimizeMobileMenu() {
    if (window.innerWidth > 749) return;

    const menuToggle = document.querySelector('[data-menu-toggle]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuToggle && mobileMenu) {
      // Prevent body scroll when menu is open
      menuToggle.addEventListener('click', () => {
        document.body.style.overflow = mobileMenu.classList.contains('active') ? '' : 'hidden';
      });
    }
  }

  // ===========================
  // INITIALIZE ALL FEATURES
  // ===========================
  function init() {
    // Check if we're on the home page
    if (!document.body.classList.contains('template-index')) return;

    // Initialize features
    initCountdown();
    initStickyCTA();
    enhanceProductCards();
    initScrollAnimations();
    initStockCounter();
    initCustomerCounter();
    enhanceEmailSignup();
    enhanceComparisonTable();
    enhanceAddToCart();
    optimizeMobileMenu();
    
    if (window.location.search.includes('debug')) {
      monitorPerformance();
    }

    console.log('🚀 Home page conversion optimization loaded');
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-init on Shopify section updates
  document.addEventListener('shopify:section:load', init);
  document.addEventListener('shopify:section:reorder', init);

})();
