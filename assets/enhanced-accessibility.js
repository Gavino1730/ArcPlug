/**
 * Enhanced Accessibility Features
 * Improves website accessibility beyond standard WCAG requirements
 */

class AccessibilityEnhancer {
  constructor() {
    this.init();
  }

  init() {
    this.addAriaLiveRegions();
    this.enhanceKeyboardNavigation();
    this.addFocusIndicators();
    this.announcePageChanges();
    this.handleColorContrastPreferences();
  }

  // Add ARIA live regions for dynamic content
  addAriaLiveRegions() {
    if (!document.getElementById('aria-live-region')) {
      const liveRegion = document.createElement('div');
      liveRegion.id = 'aria-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }
  }

  // Announce messages to screen readers
  announce(message, priority = 'polite') {
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  // Enhanced keyboard navigation
  enhanceKeyboardNavigation() {
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Alt + M: Skip to main content
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        const main = document.getElementById('MainContent');
        if (main) {
          main.focus();
          main.scrollIntoView({ behavior: 'smooth' });
        }
      }

      // Alt + S: Focus search
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        const search = document.querySelector('[type="search"]');
        if (search) {
          search.focus();
        }
      }

      // Alt + C: Focus cart
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        const cart = document.querySelector('[href*="cart"]');
        if (cart) {
          cart.click();
        }
      }
    });

    // Improve focus visibility on all interactive elements
    document.querySelectorAll('a, button, input, select, textarea').forEach(el => {
      el.addEventListener('focus', function() {
        this.setAttribute('data-user-focus', 'true');
      });
    });
  }

  // Add visible focus indicators
  addFocusIndicators() {
    const style = document.createElement('style');
    style.textContent = `
      [data-user-focus="true"]:focus {
        outline: 3px solid #4A90E2;
        outline-offset: 2px;
        box-shadow: 0 0 0 4px rgba(74, 144, 226, 0.2);
      }
    `;
    document.head.appendChild(style);
  }

  // Announce page changes for SPAs
  announcePageChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          const h1 = document.querySelector('h1');
          if (h1 && h1 !== mutation.target) {
            this.announce(`Page changed to: ${h1.textContent}`);
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Handle color contrast preferences
  handleColorContrastPreferences() {
    if (window.matchMedia) {
      const contrastQuery = window.matchMedia('(prefers-contrast: high)');
      
      const updateContrast = (e) => {
        if (e.matches) {
          document.body.classList.add('high-contrast');
        } else {
          document.body.classList.remove('high-contrast');
        }
      };

      contrastQuery.addEventListener('change', updateContrast);
      updateContrast(contrastQuery);
    }
  }
}

// Initialize on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.a11y = new AccessibilityEnhancer();
  });
} else {
  window.a11y = new AccessibilityEnhancer();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AccessibilityEnhancer;
}
