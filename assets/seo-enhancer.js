/**
 * SEO Enhancer
 * Improves SEO with structured data, meta optimization, and social sharing
 */

class SEOEnhancer {
  constructor() {
    this.init();
  }

  init() {
    this.addStructuredData();
    this.optimizeMetaTags();
    this.addSocialMetaTags();
    this.setupBreadcrumbs();
    this.improveInternalLinking();
    this.trackOutboundLinks();
  }

  // Add comprehensive structured data
  addStructuredData() {
    // Product schema
    const productElements = document.querySelectorAll('[itemtype*="Product"]');
    productElements.forEach(product => {
      this.enhanceProductSchema(product);
    });

    // Breadcrumb schema
    this.addBreadcrumbSchema();
    
    // Local business schema for stores
    this.addLocalBusinessSchema();
  }

  enhanceProductSchema(productElement) {
    const price = productElement.querySelector('[itemprop="price"]');
    const availability = productElement.querySelector('[itemprop="availability"]');
    
    if (price && !price.hasAttribute('content')) {
      const priceText = price.textContent.replace(/[^0-9.]/g, '');
      price.setAttribute('content', priceText);
    }

    if (availability && !availability.hasAttribute('href')) {
      const inStock = !productElement.querySelector('.sold-out');
      availability.setAttribute('href', inStock ? 
        'https://schema.org/InStock' : 
        'https://schema.org/OutOfStock'
      );
    }
  }

  addBreadcrumbSchema() {
    const breadcrumbs = document.querySelector('.breadcrumbs, [role="navigation"][aria-label*="breadcrumb"]');
    if (!breadcrumbs) return;

    const items = Array.from(breadcrumbs.querySelectorAll('a, span'));
    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.textContent.trim(),
        "item": item.href || window.location.href
      }))
    };

    this.injectSchema(schema, 'breadcrumb-schema');
  }

  addLocalBusinessSchema() {
    // Add if store has physical location
    const schema = {
      "@context": "https://schema.org",
      "@type": "Store",
      "name": document.title,
      "url": window.location.origin,
      "image": document.querySelector('meta[property="og:image"]')?.content
    };

    this.injectSchema(schema, 'business-schema');
  }

  injectSchema(schema, id) {
    if (document.getElementById(id)) return;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  // Optimize meta tags
  optimizeMetaTags() {
    // Ensure viewport is optimized
    let viewport = document.querySelector('meta[name="viewport"]');
    if (viewport && !viewport.content.includes('viewport-fit=cover')) {
      viewport.content += ', viewport-fit=cover';
    }

    // Add theme-color if missing
    if (!document.querySelector('meta[name="theme-color"]')) {
      const themeColor = document.createElement('meta');
      themeColor.name = 'theme-color';
      themeColor.content = getComputedStyle(document.body).backgroundColor;
      document.head.appendChild(themeColor);
    }

    // Ensure description is not too long
    const description = document.querySelector('meta[name="description"]');
    if (description && description.content.length > 160) {
      console.warn('Meta description is too long (>160 characters):', description.content.length);
    }
  }

  // Add social media meta tags
  addSocialMetaTags() {
    const title = document.title;
    const description = document.querySelector('meta[name="description"]')?.content || '';
    const image = document.querySelector('meta[property="og:image"]')?.content || '';
    const url = window.location.href;

    // Twitter Card
    if (!document.querySelector('meta[name="twitter:card"]')) {
      this.addMetaTag('name', 'twitter:card', 'summary_large_image');
      this.addMetaTag('name', 'twitter:title', title);
      this.addMetaTag('name', 'twitter:description', description);
      this.addMetaTag('name', 'twitter:image', image);
    }

    // Pinterest
    if (!document.querySelector('meta[property="pinterest:rich_pin"]')) {
      this.addMetaTag('property', 'pinterest:rich_pin', 'true');
    }
  }

  addMetaTag(attribute, name, content) {
    if (!content) return;
    
    const meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    meta.content = content;
    document.head.appendChild(meta);
  }

  // Setup breadcrumbs
  setupBreadcrumbs() {
    const breadcrumbs = document.querySelector('.breadcrumbs');
    if (breadcrumbs) {
      breadcrumbs.setAttribute('aria-label', 'Breadcrumb navigation');
      
      const links = breadcrumbs.querySelectorAll('a');
      links.forEach((link, index) => {
        if (index === links.length - 1) {
          link.setAttribute('aria-current', 'page');
        }
      });
    }
  }

  // Improve internal linking
  improveInternalLinking() {
    // Add rel="noopener" to external links
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
      if (!link.rel.includes('noopener')) {
        link.rel = link.rel ? `${link.rel} noopener` : 'noopener';
      }
    });

    // Mark external links
    document.querySelectorAll('a[href^="http"]').forEach(link => {
      if (link.hostname !== window.location.hostname) {
        link.classList.add('external-link');
        
        // Add screen reader text
        if (!link.querySelector('.sr-only')) {
          const srText = document.createElement('span');
          srText.className = 'sr-only';
          srText.textContent = ' (opens in new window)';
          link.appendChild(srText);
        }
      }
    });
  }

  // Track outbound links for analytics
  trackOutboundLinks() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="http"]');
      if (link && link.hostname !== window.location.hostname) {
        // Log outbound click (integrate with your analytics)
        console.log('Outbound link clicked:', link.href);
        
        // Track in analytics if available
        if (window.gtag) {
          window.gtag('event', 'click', {
            'event_category': 'outbound',
            'event_label': link.href,
            'transport_type': 'beacon'
          });
        }
      }
    });
  }

  // Generate sitemap data (for debugging)
  generateSitemapData() {
    const links = Array.from(document.querySelectorAll('a[href]'))
      .filter(link => link.hostname === window.location.hostname)
      .map(link => link.href)
      .filter((href, index, self) => self.indexOf(href) === index); // unique

    return {
      totalLinks: links.length,
      uniquePages: links,
      timestamp: new Date().toISOString()
    };
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.seoEnhancer = new SEOEnhancer();
  });
} else {
  window.seoEnhancer = new SEOEnhancer();
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SEOEnhancer;
}
