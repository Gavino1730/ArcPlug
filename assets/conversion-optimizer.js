/**
 * Conversion Rate Optimizer
 * Improves conversion rates with smart prompts, urgency indicators, and user behavior tracking
 */

class ConversionOptimizer {
  constructor() {
    this.config = {
      exitIntentEnabled: true,
      urgencyIndicatorsEnabled: true,
      cartAbandonmentEnabled: true,
      socialProofEnabled: true
    };
    this.init();
  }

  init() {
    this.setupExitIntent();
    this.addUrgencyIndicators();
    this.trackCartAbandonment();
    this.addSocialProof();
    this.setupSmartRecommendations();
    this.improveCheckoutFlow();
  }

  // Exit intent popup
  setupExitIntent() {
    if (!this.config.exitIntentEnabled) return;

    let exitIntentShown = sessionStorage.getItem('exitIntentShown');
    
    document.addEventListener('mouseout', (e) => {
      if (exitIntentShown) return;
      
      // Check if mouse is leaving from top of page
      if (e.clientY < 10) {
        this.showExitIntent();
        exitIntentShown = true;
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    });
  }

  showExitIntent() {
    // Only show if cart has items
    const cartCount = document.querySelector('[data-cart-count]');
    if (!cartCount || parseInt(cartCount.textContent) === 0) return;

    const message = 'Wait! Complete your order and get 10% off your first purchase!';
    
    if (window.uxEnhancer) {
      window.uxEnhancer.showToast(message, 'info', 5000);
    }
    
    // Could trigger a modal here instead
    console.log('Exit intent triggered');
  }

  // Add urgency and scarcity indicators
  addUrgencyIndicators() {
    if (!this.config.urgencyIndicatorsEnabled) return;

    // Stock level indicators
    const inventoryElements = document.querySelectorAll('[data-inventory-quantity]');
    inventoryElements.forEach(el => {
      const quantity = parseInt(el.dataset.inventoryQuantity);
      
      if (quantity > 0 && quantity <= 10) {
        const urgency = document.createElement('span');
        urgency.className = 'urgency-indicator low-stock';
        urgency.textContent = `Only ${quantity} left in stock!`;
        urgency.style.color = '#ef4444';
        urgency.style.fontWeight = 'bold';
        urgency.style.display = 'block';
        urgency.style.marginTop = '8px';
        el.parentNode.appendChild(urgency);
      }
    });

    // Trending indicators
    this.addTrendingBadges();
  }

  addTrendingBadges() {
    // Add "Trending" badges to popular products
    const productCards = document.querySelectorAll('.product-card');
    
    // Randomly mark some as trending (in real scenario, use actual data)
    const trendingIndices = this.getRandomIndices(productCards.length, Math.min(3, productCards.length));
    
    trendingIndices.forEach(index => {
      const card = productCards[index];
      if (card && !card.querySelector('.trending-badge')) {
        const badge = document.createElement('span');
        badge.className = 'trending-badge';
        badge.textContent = '🔥 Trending';
        badge.style.cssText = `
          position: absolute;
          top: 10px;
          right: 10px;
          background: #ef4444;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          z-index: 1;
        `;
        
        const imageWrapper = card.querySelector('.card__media, .media');
        if (imageWrapper) {
          imageWrapper.style.position = 'relative';
          imageWrapper.appendChild(badge);
        }
      }
    });
  }

  getRandomIndices(max, count) {
    const indices = [];
    while (indices.length < count) {
      const index = Math.floor(Math.random() * max);
      if (!indices.includes(index)) {
        indices.push(index);
      }
    }
    return indices;
  }

  // Track cart abandonment
  trackCartAbandonment() {
    if (!this.config.cartAbandonmentEnabled) return;

    // Save cart state to localStorage
    const saveCartState = () => {
      const cartItems = this.getCartItems();
      if (cartItems.length > 0) {
        localStorage.setItem('cartState', JSON.stringify({
          items: cartItems,
          timestamp: Date.now()
        }));
      }
    };

    // Monitor cart changes
    const cartObserver = new MutationObserver(saveCartState);
    const cartElements = document.querySelectorAll('[data-cart-items], cart-items');
    
    cartElements.forEach(el => {
      cartObserver.observe(el, { childList: true, subtree: true });
    });

    // Check for abandoned cart on page load
    this.checkAbandonedCart();
  }

  getCartItems() {
    const items = [];
    document.querySelectorAll('[data-cart-item]').forEach(item => {
      items.push({
        id: item.dataset.cartItemId,
        title: item.querySelector('.product-title')?.textContent,
        quantity: item.querySelector('[name="updates[]"]')?.value
      });
    });
    return items;
  }

  checkAbandonedCart() {
    const savedCart = localStorage.getItem('cartState');
    if (!savedCart) return;

    const cartState = JSON.parse(savedCart);
    const hoursSince = (Date.now() - cartState.timestamp) / (1000 * 60 * 60);

    // If cart was abandoned more than 1 hour ago
    if (hoursSince > 1 && hoursSince < 24 && cartState.items.length > 0) {
      setTimeout(() => {
        if (window.uxEnhancer) {
          window.uxEnhancer.showToast(
            'You have items waiting in your cart! Complete your purchase now.',
            'info',
            6000
          );
        }
      }, 3000);
    }
  }

  // Social proof indicators
  addSocialProof() {
    if (!this.config.socialProofEnabled) return;

    // Add "X people viewing" indicator
    const productPage = document.querySelector('.product-page, [data-product-page]');
    if (productPage) {
      this.addViewingIndicator();
    }

    // Add recent purchase notifications
    this.showRecentPurchases();
  }

  addViewingIndicator() {
    // Simulate live viewers (in production, use real data)
    const viewers = Math.floor(Math.random() * 20) + 5;
    
    const indicator = document.createElement('div');
    indicator.className = 'social-proof-indicator';
    indicator.innerHTML = `
      <span style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; font-size: 14px;">
        <span style="width: 8px; height: 8px; background: #22c55e; border-radius: 50%; animation: pulse 2s ease-in-out infinite;"></span>
        ${viewers} people viewing this product
      </span>
    `;
    
    const productInfo = document.querySelector('.product-info, .product__info-wrapper');
    if (productInfo) {
      productInfo.insertBefore(indicator, productInfo.firstChild);
    }
  }

  showRecentPurchases() {
    // Show notification of recent purchases
    const purchases = [
      'Someone in New York just purchased this item',
      'Someone in Los Angeles just purchased this item',
      'Someone in Chicago just purchased this item'
    ];

    let index = 0;
    setInterval(() => {
      if (window.uxEnhancer && Math.random() > 0.7) {
        window.uxEnhancer.showToast(purchases[index % purchases.length], 'success', 4000);
        index++;
      }
    }, 45000); // Every 45 seconds
  }

  // Smart product recommendations
  setupSmartRecommendations() {
    // Track viewed products
    const productId = this.getCurrentProductId();
    if (productId) {
      this.trackProductView(productId);
    }

    // Show recommendations based on history
    this.showPersonalizedRecommendations();
  }

  getCurrentProductId() {
    const productForm = document.querySelector('[data-product-id]');
    return productForm?.dataset.productId;
  }

  trackProductView(productId) {
    let viewHistory = JSON.parse(localStorage.getItem('viewHistory') || '[]');
    
    // Add to history (keep last 20)
    viewHistory = [productId, ...viewHistory.filter(id => id !== productId)].slice(0, 20);
    
    localStorage.setItem('viewHistory', JSON.stringify(viewHistory));
  }

  showPersonalizedRecommendations() {
    const viewHistory = JSON.parse(localStorage.getItem('viewHistory') || '[]');
    
    if (viewHistory.length > 0) {
      // Add "Based on your browsing" section
      console.log('User has viewed products:', viewHistory);
      // Implementation would fetch and display related products
    }
  }

  // Improve checkout flow
  improveCheckoutFlow() {
    // Add trust badges
    this.addTrustBadges();
    
    // Simplify form fields
    this.optimizeForms();
    
    // Add progress indicator
    this.addCheckoutProgress();
  }

  addTrustBadges() {
    const cartPage = document.querySelector('[data-cart-page], .cart');
    if (!cartPage) return;

    const badges = document.createElement('div');
    badges.className = 'trust-badges';
    badges.innerHTML = `
      <div style="display: flex; gap: 24px; justify-content: center; align-items: center; padding: 24px; background: #f9fafb; border-radius: 8px; margin: 24px 0; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 24px;">🔒</span>
          <span style="font-size: 14px; font-weight: 600;">Secure Checkout</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 24px;">📦</span>
          <span style="font-size: 14px; font-weight: 600;">Free Shipping</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 24px;">↩️</span>
          <span style="font-size: 14px; font-weight: 600;">Easy Returns</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 24px;">💳</span>
          <span style="font-size: 14px; font-weight: 600;">Secure Payment</span>
        </div>
      </div>
    `;
    
    const checkoutButton = document.querySelector('[name="checkout"]');
    if (checkoutButton) {
      checkoutButton.parentNode.insertBefore(badges, checkoutButton);
    }
  }

  optimizeForms() {
    // Add autocomplete attributes
    document.querySelectorAll('input[type="email"]').forEach(input => {
      if (!input.hasAttribute('autocomplete')) {
        input.setAttribute('autocomplete', 'email');
      }
    });

    document.querySelectorAll('input[type="tel"]').forEach(input => {
      if (!input.hasAttribute('autocomplete')) {
        input.setAttribute('autocomplete', 'tel');
      }
    });
  }

  addCheckoutProgress() {
    const steps = document.querySelectorAll('[data-checkout-step]');
    if (steps.length === 0) return;

    // Already handled by ux-enhancer.js
    console.log('Checkout has', steps.length, 'steps');
  }

  // Get conversion metrics
  getMetrics() {
    return {
      cartAbandonment: this.getCartAbandonmentRate(),
      exitIntentShown: sessionStorage.getItem('exitIntentShown') === 'true',
      viewHistory: JSON.parse(localStorage.getItem('viewHistory') || '[]').length
    };
  }

  getCartAbandonmentRate() {
    const savedCart = localStorage.getItem('cartState');
    if (!savedCart) return 0;

    const cartState = JSON.parse(savedCart);
    const hoursSince = (Date.now() - cartState.timestamp) / (1000 * 60 * 60);
    
    return hoursSince > 1 ? 1 : 0;
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.conversionOptimizer = new ConversionOptimizer();
  });
} else {
  window.conversionOptimizer = new ConversionOptimizer();
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ConversionOptimizer;
}
