/**
 * User Experience Enhancer
 * Improves UX with better error handling, loading states, and user feedback
 */

class UXEnhancer {
  constructor() {
    this.init();
  }

  init() {
    this.setupLoadingStates();
    this.enhanceFormValidation();
    this.addToastNotifications();
    this.improveErrorMessages();
    this.addLoadingIndicators();
    this.setupSmoothScrolling();
    this.addProgressIndicators();
  }

  // Setup loading states for AJAX requests
  setupLoadingStates() {
    // Intercept fetch requests
    const originalFetch = window.fetch;
    window.fetch = (...args) => {
      const button = document.activeElement;
      if (button && button.tagName === 'BUTTON') {
        this.setLoadingState(button, true);
      }

      return originalFetch.apply(this, args)
        .then(response => {
          if (button && button.tagName === 'BUTTON') {
            this.setLoadingState(button, false);
          }
          return response;
        })
        .catch(error => {
          if (button && button.tagName === 'BUTTON') {
            this.setLoadingState(button, false);
          }
          this.showError('An error occurred. Please try again.');
          throw error;
        });
    };
  }

  setLoadingState(element, isLoading) {
    if (isLoading) {
      element.classList.add('loading');
      element.disabled = true;
      element.dataset.originalText = element.textContent;
      element.innerHTML = '<span class="spinner"></span> Loading...';
    } else {
      element.classList.remove('loading');
      element.disabled = false;
      if (element.dataset.originalText) {
        element.textContent = element.dataset.originalText;
        delete element.dataset.originalText;
      }
    }
  }

  // Enhanced form validation
  enhanceFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
        // Real-time validation
        input.addEventListener('blur', () => {
          this.validateField(input);
        });

        // Clear error on input
        input.addEventListener('input', () => {
          this.clearFieldError(input);
        });
      });

      // Enhanced form submission
      form.addEventListener('submit', (e) => {
        let isValid = true;
        
        inputs.forEach(input => {
          if (!this.validateField(input)) {
            isValid = false;
          }
        });

        if (!isValid) {
          e.preventDefault();
          this.showError('Please correct the errors in the form.');
          
          // Focus first error
          const firstError = form.querySelector('.field-error');
          if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
          }
        }
      });
    });
  }

  validateField(input) {
    const value = input.value.trim();
    let errorMessage = '';

    // Required field validation
    if (input.hasAttribute('required') && !value) {
      errorMessage = 'This field is required';
    }

    // Email validation
    if (input.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMessage = 'Please enter a valid email address';
      }
    }

    // Phone validation
    if (input.type === 'tel' && value) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value)) {
        errorMessage = 'Please enter a valid phone number';
      }
    }

    // Min length validation
    if (input.hasAttribute('minlength') && value.length < input.getAttribute('minlength')) {
      errorMessage = `Minimum ${input.getAttribute('minlength')} characters required`;
    }

    // Pattern validation
    if (input.hasAttribute('pattern') && value) {
      const pattern = new RegExp(input.getAttribute('pattern'));
      if (!pattern.test(value)) {
        errorMessage = input.getAttribute('title') || 'Invalid format';
      }
    }

    if (errorMessage) {
      this.showFieldError(input, errorMessage);
      return false;
    } else {
      this.clearFieldError(input);
      return true;
    }
  }

  showFieldError(input, message) {
    this.clearFieldError(input);
    
    input.classList.add('field-error');
    input.setAttribute('aria-invalid', 'true');
    
    const error = document.createElement('div');
    error.className = 'error-message';
    error.id = `${input.id || input.name}-error`;
    error.textContent = message;
    error.setAttribute('role', 'alert');
    
    input.setAttribute('aria-describedby', error.id);
    input.parentNode.appendChild(error);
  }

  clearFieldError(input) {
    input.classList.remove('field-error');
    input.removeAttribute('aria-invalid');
    
    const errorId = input.getAttribute('aria-describedby');
    if (errorId) {
      const error = document.getElementById(errorId);
      if (error) {
        error.remove();
      }
      input.removeAttribute('aria-describedby');
    }
  }

  // Toast notification system
  addToastNotifications() {
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(container);
    }
  }

  showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'status');
    
    const container = document.getElementById('toast-container');
    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  showError(message) {
    this.showToast(message, 'error', 5000);
  }

  showSuccess(message) {
    this.showToast(message, 'success', 3000);
  }

  // Improve error messages
  improveErrorMessages() {
    // Replace generic error messages with helpful ones
    window.addEventListener('error', (e) => {
      if (e.message.includes('Failed to fetch')) {
        this.showError('Network error. Please check your connection and try again.');
      }
    });

    // Handle promise rejections
    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
      this.showError('Something went wrong. Please try again.');
    });
  }

  // Add loading indicators for slow operations
  addLoadingIndicators() {
    // Show loading indicator for page navigation
    window.addEventListener('beforeunload', () => {
      const loader = document.createElement('div');
      loader.id = 'page-loader';
      loader.innerHTML = '<div class="spinner"></div>';
      document.body.appendChild(loader);
    });
  }

  // Smooth scrolling
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Update URL without jumping
          history.pushState(null, '', href);
          
          // Focus target for accessibility
          target.focus({ preventScroll: true });
        }
      });
    });
  }

  // Progress indicators for multi-step processes
  addProgressIndicators() {
    const steps = document.querySelectorAll('[data-step]');
    if (steps.length > 0) {
      const currentStep = Array.from(steps).findIndex(step => 
        step.classList.contains('active') || step.hasAttribute('aria-current')
      );
      
      if (currentStep >= 0) {
        const progress = ((currentStep + 1) / steps.length) * 100;
        this.updateProgress(progress);
      }
    }
  }

  updateProgress(percentage) {
    let progressBar = document.getElementById('progress-bar');
    
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = 'progress-bar';
      progressBar.setAttribute('role', 'progressbar');
      progressBar.setAttribute('aria-valuemin', '0');
      progressBar.setAttribute('aria-valuemax', '100');
      
      const bar = document.createElement('div');
      bar.className = 'progress-bar-fill';
      progressBar.appendChild(bar);
      
      document.body.insertBefore(progressBar, document.body.firstChild);
    }
    
    const fill = progressBar.querySelector('.progress-bar-fill');
    fill.style.width = `${percentage}%`;
    progressBar.setAttribute('aria-valuenow', percentage);
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.uxEnhancer = new UXEnhancer();
  });
} else {
  window.uxEnhancer = new UXEnhancer();
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UXEnhancer;
}
