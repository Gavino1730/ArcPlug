/**
 * Sticky Add-to-Cart & Mobile Conversion Optimizer
 * Ensures the buy button is always accessible
 */

class StickyCartOptimizer {
  constructor() {
    this.config = {
      stickyEnabled: true,
      mobileBreakpoint: 768,
      scrollThreshold: 300
    };
    
    this.isSticky = false;
    this.init();
  }

  init() {
    if (!this.config.stickyEnabled) return;
    
    this.createStickyBar();
    this.setupScrollListener();
    this.enhanceMobileExperience();
    this.optimizeCheckoutButton();
  }

  createStickyBar() {
    // Only create if on product page
    const productPage = document.querySelector('[data-product-page], .product');
    if (!productPage) return;

    const productForm = document.querySelector('product-form, [data-product-form]');
    if (!productForm) return;

    const stickyBar = document.createElement('div');
    stickyBar.id = 'sticky-add-to-cart';
    stickyBar.className = 'sticky-cart-bar';
    stickyBar.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: white;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.15);
      padding: 12px 16px;
      z-index: 999;
      transform: translateY(100%);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: none;
    `;

    // Get product info
    const productTitle = document.querySelector('.product__title, .product-title, h1')?.textContent.trim() || 'Product';
    const productPrice = document.querySelector('.price__regular .price-item, .product__price .price-item')?.textContent.trim() || '';
    const productImage = document.querySelector('.product__media img, .product-media img')?.src || '';

    stickyBar.innerHTML = `
      <div style="display: flex; align-items: center; gap: 16px; max-width: 1200px; margin: 0 auto;">
        ${productImage ? `
          <img src="${productImage}" alt="${productTitle}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; display: none;" class="desktop-only" />
        ` : ''}
        <div style="flex: 1; min-width: 0;">
          <div style="font-weight: 700; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${productTitle}</div>
          ${productPrice ? `<div style="font-size: 16px; font-weight: 700; color: #10b981; margin-top: 2px;">${productPrice}</div>` : ''}
        </div>
        <button 
          type="button"
          class="sticky-add-to-cart-btn"
          style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 14px 32px; border: none; border-radius: 8px; font-size: 16px; font-weight: 700; cursor: pointer; white-space: nowrap; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); transition: all 0.3s;"
          onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(16, 185, 129, 0.4)';"
          onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(16, 185, 129, 0.3)';"
        >
          🛒 Add to Cart
        </button>
      </div>
    `;

    document.body.appendChild(stickyBar);

    // Connect button to actual add to cart
    const stickyBtn = stickyBar.querySelector('.sticky-add-to-cart-btn');
    const originalBtn = document.querySelector('[name="add"], .product-form__submit');
    
    if (stickyBtn && originalBtn) {
      stickyBtn.addEventListener('click', () => {
        originalBtn.click();
      });
    }

    // Show desktop image on larger screens
    const mediaQuery = window.matchMedia(`(min-width: ${this.config.mobileBreakpoint}px)`);
    const updateImageVisibility = (e) => {
      const img = stickyBar.querySelector('.desktop-only');
      if (img) {
        img.style.display = e.matches ? 'block' : 'none';
      }
    };
    mediaQuery.addListener(updateImageVisibility);
    updateImageVisibility(mediaQuery);
  }

  setupScrollListener() {
    const stickyBar = document.getElementById('sticky-add-to-cart');
    if (!stickyBar) return;

    const originalBtn = document.querySelector('[name="add"], .product-form__submit');
    if (!originalBtn) return;

    let ticking = false;

    const checkPosition = () => {
      const btnRect = originalBtn.getBoundingClientRect();
      const isButtonVisible = btnRect.top < window.innerHeight && btnRect.bottom > 0;
      
      // Show sticky bar when original button is not visible and user has scrolled
      if (!isButtonVisible && window.scrollY > this.config.scrollThreshold) {
        if (!this.isSticky) {
          stickyBar.style.display = 'block';
          setTimeout(() => {
            stickyBar.style.transform = 'translateY(0)';
          }, 10);
          this.isSticky = true;
        }
      } else {
        if (this.isSticky) {
          stickyBar.style.transform = 'translateY(100%)';
          setTimeout(() => {
            stickyBar.style.display = 'none';
          }, 300);
          this.isSticky = false;
        }
      }
      
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        window.requestAnimationFrame(checkPosition);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick, { passive: true });
  }

  enhanceMobileExperience() {
    // Optimize for mobile devices
    if (window.innerWidth >= this.config.mobileBreakpoint) return;

    // Make quantity selectors larger on mobile
    const quantityInputs = document.querySelectorAll('input[type="number"], .quantity__input');
    quantityInputs.forEach(input => {
      input.style.fontSize = '16px'; // Prevents zoom on iOS
      input.style.minHeight = '44px'; // iOS recommended touch target
    });

    // Make buttons larger
    const buttons = document.querySelectorAll('button, .button, [type="submit"]');
    buttons.forEach(btn => {
      if (btn.offsetHeight < 44) {
        btn.style.minHeight = '44px';
        btn.style.padding = '12px 24px';
      }
    });

    // Optimize images for mobile
    this.optimizeMobileImages();

    // Add tap feedback
    this.addTapFeedback();

    // Simplify mobile checkout
    this.simplifyMobileCheckout();
  }

  optimizeMobileImages() {
    if (window.innerWidth >= this.config.mobileBreakpoint) return;

    const images = document.querySelectorAll('.product__media img, .product-media img');
    images.forEach(img => {
      // Enable pinch-to-zoom on mobile
      img.style.touchAction = 'pinch-zoom';
      
      // Add loading feedback
      if (!img.complete) {
        img.style.backgroundColor = '#f3f4f6';
      }
      
      img.addEventListener('load', () => {
        img.style.backgroundColor = 'transparent';
      });
    });
  }

  addTapFeedback() {
    const interactiveElements = document.querySelectorAll('button, a, [role="button"]');
    
    interactiveElements.forEach(el => {
      el.addEventListener('touchstart', function() {
        this.style.opacity = '0.7';
      }, { passive: true });
      
      el.addEventListener('touchend', function() {
        this.style.opacity = '1';
      }, { passive: true });
    });
  }

  simplifyMobileCheckout() {
    if (window.innerWidth >= this.config.mobileBreakpoint) return;

    // Make checkout button full-width on mobile
    const checkoutBtn = document.querySelector('[name="checkout"], .checkout-button');
    if (checkoutBtn) {
      checkoutBtn.style.width = '100%';
      checkoutBtn.style.fontSize = '18px';
      checkoutBtn.style.padding = '16px';
    }
  }

  optimizeCheckoutButton() {
    // Add "Buy Now" express checkout option
    const productForm = document.querySelector('product-form, [data-product-form]');
    if (!productForm) return;

    const addToCartBtn = document.querySelector('[name="add"]');
    if (!addToCartBtn) return;

    // Create Buy Now button
    const buyNowBtn = document.createElement('button');
    buyNowBtn.type = 'button';
    buyNowBtn.className = 'buy-now-button';
    buyNowBtn.innerHTML = '⚡ Buy Now - Express Checkout';
    buyNowBtn.style.cssText = `
      width: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 24px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      margin-top: 12px;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      transition: all 0.3s;
    `;

    buyNowBtn.addEventListener('mouseenter', () => {
      buyNowBtn.style.transform = 'translateY(-2px)';
      buyNowBtn.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
    });

    buyNowBtn.addEventListener('mouseleave', () => {
      buyNowBtn.style.transform = 'translateY(0)';
      buyNowBtn.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
    });

    buyNowBtn.addEventListener('click', () => {
      // Add to cart and go directly to checkout
      addToCartBtn.click();
      setTimeout(() => {
        window.location.href = '/checkout';
      }, 500);
    });

    addToCartBtn.parentNode.insertBefore(buyNowBtn, addToCartBtn.nextSibling);
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.stickyCartOptimizer = new StickyCartOptimizer();
  });
} else {
  window.stickyCartOptimizer = new StickyCartOptimizer();
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StickyCartOptimizer;
}
