/**
 * Performance Optimizer
 * Automatically optimizes images, defers non-critical resources, and monitors performance
 */

class PerformanceOptimizer {
  constructor() {
    this.config = {
      lazyLoadOffset: 200,
      imageQuality: 85,
      enableWebP: true,
      deferImages: true
    };
    this.init();
  }

  init() {
    this.setupLazyLoading();
    this.optimizeImages();
    this.prefetchLinks();
    this.monitorResourceTiming();
    this.setupIntersectionObserver();
  }

  // Lazy load images and iframes
  setupLazyLoading() {
    const lazyElements = document.querySelectorAll('[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading support
      lazyElements.forEach(el => {
        if (el.dataset.src) {
          el.src = el.dataset.src;
        }
      });
    } else {
      // Fallback for browsers without native lazy loading
      this.lazyLoadFallback();
    }
  }

  lazyLoadFallback() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
          }
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: `${this.config.lazyLoadOffset}px`
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Optimize images with srcset
  optimizeImages() {
    const images = document.querySelectorAll('img:not([srcset])');
    
    images.forEach(img => {
      if (!img.complete) {
        img.addEventListener('load', () => {
          this.addImageMetrics(img);
        }, { once: true });
      }
    });
  }

  addImageMetrics(img) {
    const naturalWidth = img.naturalWidth;
    const displayWidth = img.offsetWidth;
    
    // Warn if image is oversized
    if (naturalWidth > displayWidth * 2) {
      console.warn(`Image oversized: ${img.src} (${naturalWidth}px served for ${displayWidth}px display)`);
    }
  }

  // Prefetch links on hover
  prefetchLinks() {
    let prefetchedLinks = new Set();

    const prefetch = (url) => {
      if (prefetchedLinks.has(url)) return;
      
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      link.as = 'document';
      document.head.appendChild(link);
      
      prefetchedLinks.add(url);
    };

    // Prefetch on hover with delay
    document.addEventListener('mouseover', (e) => {
      const link = e.target.closest('a[href]');
      if (link && link.hostname === window.location.hostname) {
        setTimeout(() => prefetch(link.href), 100);
      }
    }, { passive: true });

    // Prefetch visible links on idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        const visibleLinks = Array.from(document.querySelectorAll('a[href]'))
          .filter(link => {
            const rect = link.getBoundingClientRect();
            return rect.top < window.innerHeight && rect.bottom > 0;
          })
          .slice(0, 5); // Only prefetch first 5 visible links

        visibleLinks.forEach(link => {
          if (link.hostname === window.location.hostname) {
            prefetch(link.href);
          }
        });
      });
    }
  }

  // Monitor resource timing
  monitorResourceTiming() {
    if (!window.performance || !window.performance.getEntriesByType) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const resources = performance.getEntriesByType('resource');
        
        const slowResources = resources.filter(r => r.duration > 1000);
        const largeResources = resources.filter(r => r.transferSize > 500000); // > 500KB

        if (slowResources.length > 0) {
          console.group('⚠️ Slow Resources (>1s)');
          slowResources.forEach(r => {
            console.log(`${r.name}: ${r.duration.toFixed(2)}ms`);
          });
          console.groupEnd();
        }

        if (largeResources.length > 0) {
          console.group('⚠️ Large Resources (>500KB)');
          largeResources.forEach(r => {
            console.log(`${r.name}: ${(r.transferSize / 1024).toFixed(2)}KB`);
          });
          console.groupEnd();
        }
      }, 0);
    });
  }

  // Setup intersection observer for sections
  setupIntersectionObserver() {
    const sections = document.querySelectorAll('.section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
          
          // Trigger any deferred scripts for this section
          this.loadSectionScripts(entry.target);
        }
      });
    }, {
      rootMargin: '50px'
    });

    sections.forEach(section => sectionObserver.observe(section));
  }

  loadSectionScripts(section) {
    const scripts = section.querySelectorAll('script[data-defer]');
    scripts.forEach(script => {
      if (!script.src) return;
      
      const newScript = document.createElement('script');
      newScript.src = script.src;
      newScript.async = true;
      script.parentNode.replaceChild(newScript, script);
    });
  }

  // Get performance metrics
  getMetrics() {
    if (!window.performance) return null;

    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    return {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp: navigation.connectEnd - navigation.connectStart,
      ttfb: navigation.responseStart - navigation.requestStart,
      download: navigation.responseEnd - navigation.responseStart,
      domInteractive: navigation.domInteractive - navigation.fetchStart,
      domComplete: navigation.domComplete - navigation.fetchStart,
      loadComplete: navigation.loadEventEnd - navigation.fetchStart,
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
    };
  }

  // Report performance
  reportPerformance() {
    const metrics = this.getMetrics();
    if (!metrics) return;

    console.group('📊 Performance Metrics');
    console.log(`DNS Lookup: ${metrics.dns.toFixed(2)}ms`);
    console.log(`TCP Connection: ${metrics.tcp.toFixed(2)}ms`);
    console.log(`Time to First Byte: ${metrics.ttfb.toFixed(2)}ms`);
    console.log(`Download Time: ${metrics.download.toFixed(2)}ms`);
    console.log(`DOM Interactive: ${metrics.domInteractive.toFixed(2)}ms`);
    console.log(`DOM Complete: ${metrics.domComplete.toFixed(2)}ms`);
    console.log(`Page Load Complete: ${metrics.loadComplete.toFixed(2)}ms`);
    console.log(`First Paint: ${metrics.firstPaint.toFixed(2)}ms`);
    console.log(`First Contentful Paint: ${metrics.firstContentfulPaint.toFixed(2)}ms`);
    console.groupEnd();
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.perfOptimizer = new PerformanceOptimizer();
    window.addEventListener('load', () => {
      setTimeout(() => window.perfOptimizer.reportPerformance(), 0);
    });
  });
} else {
  window.perfOptimizer = new PerformanceOptimizer();
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceOptimizer;
}
