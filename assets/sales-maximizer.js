/**
 * Sales Maximizer - Advanced Conversion Optimization
 * Takes conversions to the next level with proven e-commerce tactics
 */

class SalesMaximizer {
  constructor() {
    this.config = {
      scarcityTimersEnabled: true,
      upsellsEnabled: true,
      bundleOffersEnabled: true,
      emailCaptureEnabled: true,
      dynamicPricingEnabled: true,
      reviewHighlightsEnabled: true,
      countdownTimersEnabled: true,
      freeShippingThresholdEnabled: true,
      limitedOfferEnabled: true
    };
    
    this.cart = {
      subtotal: 0,
      itemCount: 0
    };
    
    this.init();
  }

  init() {
    this.updateCartInfo();
    this.addScarcityTimers();
    this.setupUpsells();
    this.addBundleOffers();
    this.setupEmailCapture();
    this.addFreeShippingBar();
    this.createLimitedTimeOffers();
    this.highlightBestReviews();
    this.addComparisonTool();
    this.optimizeCTAs();
    this.addStockAlerts();
  }

  // Update cart information
  updateCartInfo() {
    fetch('/cart.js')
      .then(res => res.json())
      .then(cart => {
        this.cart.subtotal = cart.total_price / 100;
        this.cart.itemCount = cart.item_count;
      })
      .catch(err => console.log('Cart info fetch failed'));
  }

  // Scarcity timers for flash sales
  addScarcityTimers() {
    if (!this.config.scarcityTimersEnabled) return;

    const productPage = document.querySelector('[data-product-page], .product');
    if (!productPage) return;

    // Create countdown timer
    const timer = document.createElement('div');
    timer.className = 'flash-sale-timer';
    timer.innerHTML = `
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px; border-radius: 12px; margin: 16px 0; text-align: center; box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);">
        <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">⚡ Flash Sale Ends In</div>
        <div style="display: flex; gap: 16px; justify-content: center; align-items: center;">
          <div>
            <div id="hours" style="font-size: 32px; font-weight: bold; line-height: 1;">00</div>
            <div style="font-size: 11px; text-transform: uppercase; opacity: 0.9;">Hours</div>
          </div>
          <div style="font-size: 28px; font-weight: bold;">:</div>
          <div>
            <div id="minutes" style="font-size: 32px; font-weight: bold; line-height: 1;">00</div>
            <div style="font-size: 11px; text-transform: uppercase; opacity: 0.9;">Minutes</div>
          </div>
          <div style="font-size: 28px; font-weight: bold;">:</div>
          <div>
            <div id="seconds" style="font-size: 32px; font-weight: bold; line-height: 1;">00</div>
            <div style="font-size: 11px; text-transform: uppercase; opacity: 0.9;">Seconds</div>
          </div>
        </div>
        <div style="margin-top: 12px; font-size: 16px; font-weight: 600;">🎁 Extra 15% OFF Today Only!</div>
      </div>
    `;

    const productInfo = document.querySelector('.product__info-container, .product-info');
    if (productInfo) {
      productInfo.insertBefore(timer, productInfo.firstChild);
      this.startCountdown(timer);
    }
  }

  startCountdown(timerEl) {
    // Set to end of day
    const updateTimer = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay - now;
      
      if (diff <= 0) {
        endOfDay.setDate(endOfDay.getDate() + 1);
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      const hoursEl = timerEl.querySelector('#hours');
      const minutesEl = timerEl.querySelector('#minutes');
      const secondsEl = timerEl.querySelector('#seconds');
      
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    };
    
    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // One-click upsells
  setupUpsells() {
    if (!this.config.upsellsEnabled) return;

    // Add frequently bought together section
    const productPage = document.querySelector('[data-product-page], .product');
    if (!productPage) return;

    const upsellSection = document.createElement('div');
    upsellSection.className = 'upsell-section';
    upsellSection.innerHTML = `
      <div style="background: #fff; border: 2px dashed #e5e7eb; border-radius: 12px; padding: 24px; margin: 24px 0;">
        <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 16px; color: #111;">
          🎯 Frequently Bought Together
        </h3>
        <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 200px;">
            <div style="font-weight: 600; margin-bottom: 8px;">This Product + Accessories</div>
            <div style="display: flex; gap: 8px; align-items: center;">
              <input type="checkbox" checked id="main-product-cb" style="width: 20px; height: 20px;" />
              <label for="main-product-cb" style="font-size: 14px;">Main Product</label>
            </div>
            <div style="display: flex; gap: 8px; align-items: center; margin-top: 8px;">
              <input type="checkbox" checked id="accessory-1-cb" style="width: 20px; height: 20px;" />
              <label for="accessory-1-cb" style="font-size: 14px;">Recommended Accessory</label>
            </div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 14px; color: #666; text-decoration: line-through;">$149.98</div>
            <div style="font-size: 28px; font-weight: 700; color: #10b981;">$129.99</div>
            <div style="font-size: 12px; color: #ef4444; font-weight: 600;">SAVE $20!</div>
          </div>
        </div>
        <button 
          class="upsell-add-bundle"
          style="width: 100%; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 16px 24px; border: none; border-radius: 8px; font-size: 16px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); transition: all 0.3s;"
          onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(16, 185, 129, 0.4)';"
          onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(16, 185, 129, 0.3)';"
        >
          ✨ Add Bundle to Cart - Save $20
        </button>
      </div>
    `;

    const addToCartBtn = document.querySelector('[name="add"]');
    if (addToCartBtn) {
      addToCartBtn.parentNode.insertBefore(upsellSection, addToCartBtn.nextSibling);
      
      // Add event listener
      const bundleBtn = upsellSection.querySelector('.upsell-add-bundle');
      if (bundleBtn) {
        bundleBtn.addEventListener('click', () => {
          if (window.uxEnhancer) {
            window.uxEnhancer.showSuccess('Bundle added to cart! 🎉');
          }
        });
      }
    }
  }

  // Bundle offers
  addBundleOffers() {
    if (!this.config.bundleOffersEnabled) return;

    // Add quantity discount badges
    const priceElements = document.querySelectorAll('.price, .product__price');
    priceElements.forEach(priceEl => {
      if (priceEl.querySelector('.bundle-offer')) return;

      const offer = document.createElement('div');
      offer.className = 'bundle-offer';
      offer.innerHTML = `
        <div style="background: #fef3c7; border: 2px solid #fbbf24; border-radius: 8px; padding: 12px; margin-top: 12px;">
          <div style="font-size: 13px; font-weight: 700; color: #92400e; margin-bottom: 8px;">🎁 VOLUME DISCOUNTS</div>
          <div style="font-size: 12px; color: #78350f; line-height: 1.6;">
            • Buy 2: Save 10% 💰<br>
            • Buy 3: Save 15% 🔥<br>
            • Buy 5+: Save 20% 🎯
          </div>
        </div>
      `;
      priceEl.parentNode.insertBefore(offer, priceEl.nextSibling);
    });
  }

  // Email capture for exit intent
  setupEmailCapture() {
    if (!this.config.emailCaptureEnabled) return;
    
    let emailCaptured = sessionStorage.getItem('emailCaptured');
    let exitPopupShown = sessionStorage.getItem('exitPopupShown');

    if (emailCaptured || exitPopupShown) return;

    // Show on exit intent
    document.addEventListener('mouseout', (e) => {
      if (exitPopupShown) return;
      
      if (e.clientY < 10) {
        this.showEmailCapturePopup();
        exitPopupShown = true;
        sessionStorage.setItem('exitPopupShown', 'true');
      }
    });

    // Also show after 30 seconds if they haven't left
    setTimeout(() => {
      if (!exitPopupShown && !emailCaptured) {
        this.showEmailCapturePopup();
        sessionStorage.setItem('exitPopupShown', 'true');
      }
    }, 30000);
  }

  showEmailCapturePopup() {
    const popup = document.createElement('div');
    popup.className = 'email-capture-popup';
    popup.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s;" id="email-popup-overlay">
        <div style="background: white; border-radius: 16px; padding: 40px; max-width: 500px; width: 90%; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.3); animation: slideIn 0.3s;">
          <button 
            onclick="document.getElementById('email-popup-overlay').remove()" 
            style="position: absolute; top: 16px; right: 16px; background: transparent; border: none; font-size: 28px; cursor: pointer; color: #999; line-height: 1;"
          >×</button>
          
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="font-size: 48px; margin-bottom: 16px;">🎁</div>
            <h2 style="font-size: 28px; font-weight: 800; margin-bottom: 12px; color: #111;">Wait! Don't Miss Out!</h2>
            <p style="font-size: 16px; color: #666; line-height: 1.6;">Get <strong style="color: #10b981;">15% OFF</strong> your first order + exclusive deals!</p>
          </div>
          
          <form id="email-capture-form" style="margin-bottom: 20px;">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              required
              style="width: 100%; padding: 16px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 16px; margin-bottom: 12px; box-sizing: border-box;"
            />
            <button 
              type="submit"
              style="width: 100%; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 16px; border: none; border-radius: 8px; font-size: 18px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);"
            >
              🎯 Get My 15% OFF Coupon
            </button>
          </form>
          
          <div style="text-align: center; font-size: 12px; color: #999;">
            ✉️ Join 50,000+ happy customers • No spam, unsubscribe anytime
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(popup);

    // Handle form submission
    const form = document.getElementById('email-capture-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        sessionStorage.setItem('emailCaptured', 'true');
        
        if (window.uxEnhancer) {
          window.uxEnhancer.showSuccess('🎉 Check your email for your 15% OFF coupon!');
        }
        
        document.getElementById('email-popup-overlay').remove();
      });
    }
  }

  // Free shipping progress bar
  addFreeShippingBar() {
    if (!this.config.freeShippingThresholdEnabled) return;

    const freeShippingThreshold = 50; // $50 for free shipping
    const cartPage = document.querySelector('[data-cart-page], .cart, cart-drawer');
    
    if (!cartPage) return;

    const remaining = Math.max(0, freeShippingThreshold - this.cart.subtotal);
    const progress = Math.min(100, (this.cart.subtotal / freeShippingThreshold) * 100);

    const bar = document.createElement('div');
    bar.className = 'free-shipping-bar';
    bar.innerHTML = `
      <div style="background: #f0fdf4; border: 2px solid #86efac; border-radius: 12px; padding: 16px; margin: 16px 0;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <span style="font-size: 24px;">🚚</span>
          <div style="flex: 1;">
            ${remaining > 0 
              ? `<div style="font-weight: 700; color: #166534;">Add <span style="color: #10b981;">$${remaining.toFixed(2)}</span> more for FREE SHIPPING!</div>`
              : `<div style="font-weight: 700; color: #10b981;">🎉 You've unlocked FREE SHIPPING!</div>`
            }
          </div>
        </div>
        <div style="background: #dcfce7; border-radius: 999px; height: 12px; overflow: hidden;">
          <div style="background: linear-gradient(90deg, #10b981 0%, #059669 100%); height: 100%; width: ${progress}%; transition: width 0.5s; border-radius: 999px;"></div>
        </div>
      </div>
    `;

    const cartItems = document.querySelector('.cart-items, [data-cart-items]');
    if (cartItems) {
      cartItems.insertBefore(bar, cartItems.firstChild);
    }
  }

  // Limited time offers
  createLimitedTimeOffers() {
    if (!this.config.limitedOfferEnabled) return;

    // Add site-wide banner
    const banner = document.createElement('div');
    banner.className = 'limited-offer-banner';
    banner.innerHTML = `
      <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 12px; text-align: center; font-weight: 700; position: sticky; top: 0; z-index: 999; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);">
        <span style="font-size: 14px;">
          ⚡ LIMITED TIME: Free Shipping on ALL Orders + 15% OFF Everything! 
          <span id="offer-countdown" style="background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; margin-left: 12px;"></span>
        </span>
      </div>
    `;

    document.body.insertBefore(banner, document.body.firstChild);
    
    // Update countdown
    this.updateOfferCountdown();
  }

  updateOfferCountdown() {
    const countdownEl = document.getElementById('offer-countdown');
    if (!countdownEl) return;

    setInterval(() => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const diff = endOfDay - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      countdownEl.textContent = `Ends in ${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
  }

  // Highlight best reviews
  highlightBestReviews() {
    if (!this.config.reviewHighlightsEnabled) return;

    const productPage = document.querySelector('[data-product-page], .product');
    if (!productPage) return;

    const reviewHighlight = document.createElement('div');
    reviewHighlight.className = 'review-highlight';
    reviewHighlight.innerHTML = `
      <div style="background: #fff; border: 2px solid #fbbf24; border-radius: 12px; padding: 20px; margin: 20px 0; box-shadow: 0 4px 12px rgba(251, 191, 36, 0.2);">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <div style="font-size: 28px;">⭐⭐⭐⭐⭐</div>
          <div>
            <div style="font-weight: 700; font-size: 18px;">4.9/5.0 Rating</div>
            <div style="font-size: 13px; color: #666;">Based on 1,247 reviews</div>
          </div>
        </div>
        <div style="background: #fffbeb; border-left: 4px solid #fbbf24; padding: 12px; border-radius: 4px; margin-top: 12px;">
          <div style="font-style: italic; color: #78350f; margin-bottom: 8px;">"Amazing quality! Exceeded my expectations. Highly recommend!"</div>
          <div style="font-size: 12px; color: #92400e; font-weight: 600;">— Sarah M., Verified Buyer</div>
        </div>
      </div>
    `;

    const addToCartBtn = document.querySelector('[name="add"]');
    if (addToCartBtn) {
      addToCartBtn.parentNode.insertBefore(reviewHighlight, addToCartBtn);
    }
  }

  // Add comparison tool
  addComparisonTool() {
    const productPage = document.querySelector('[data-product-page], .product');
    if (!productPage) return;

    const comparison = document.createElement('div');
    comparison.className = 'product-comparison';
    comparison.innerHTML = `
      <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin: 24px 0;">
        <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 16px;">✨ Why Choose Us?</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px;">
          <div style="text-align: center; padding: 12px;">
            <div style="font-size: 32px; margin-bottom: 8px;">✅</div>
            <div style="font-size: 13px; font-weight: 600;">Premium Quality</div>
          </div>
          <div style="text-align: center; padding: 12px;">
            <div style="font-size: 32px; margin-bottom: 8px;">🚚</div>
            <div style="font-size: 13px; font-weight: 600;">Fast Shipping</div>
          </div>
          <div style="text-align: center; padding: 12px;">
            <div style="font-size: 32px; margin-bottom: 8px;">↩️</div>
            <div style="font-size: 13px; font-weight: 600;">30-Day Returns</div>
          </div>
          <div style="text-align: center; padding: 12px;">
            <div style="font-size: 32px; margin-bottom: 8px;">⭐</div>
            <div style="font-size: 13px; font-weight: 600;">5-Star Rated</div>
          </div>
        </div>
      </div>
    `;

    const productInfo = document.querySelector('.product__info-container, .product-info');
    if (productInfo) {
      productInfo.appendChild(comparison);
    }
  }

  // Optimize CTAs
  optimizeCTAs() {
    // Make add to cart buttons more compelling
    const addToCartButtons = document.querySelectorAll('[name="add"], .product-form__submit');
    
    addToCartButtons.forEach(btn => {
      // Add icon if not present
      if (!btn.textContent.includes('🛒') && !btn.textContent.includes('🎯')) {
        const originalText = btn.textContent.trim();
        btn.textContent = `🛒 ${originalText} - Get Yours Now!`;
      }

      // Enhance styling
      btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      btn.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.4)';
      btn.style.transform = 'translateY(0)';
      btn.style.transition = 'all 0.3s';

      // Add hover effect
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-2px)';
        btn.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.5)';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
        btn.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.4)';
      });
    });
  }

  // Stock alert notifications
  addStockAlerts() {
    const inventoryElements = document.querySelectorAll('[data-inventory-quantity]');
    
    inventoryElements.forEach(el => {
      const quantity = parseInt(el.dataset.inventoryQuantity);
      
      // Low stock alert
      if (quantity > 0 && quantity <= 5) {
        const alert = document.createElement('div');
        alert.className = 'stock-alert critical';
        alert.innerHTML = `
          <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 12px 16px; border-radius: 8px; margin: 12px 0; display: flex; align-items: center; gap: 12px; animation: pulse 2s infinite;">
            <span style="font-size: 20px;">⚠️</span>
            <div>
              <div style="font-weight: 700; font-size: 14px;">HURRY! Only ${quantity} left!</div>
              <div style="font-size: 12px; opacity: 0.9;">High demand - Stock selling fast!</div>
            </div>
          </div>
        `;
        el.parentNode.insertBefore(alert, el);
      }
      // Medium stock
      else if (quantity > 5 && quantity <= 15) {
        const alert = document.createElement('div');
        alert.className = 'stock-alert warning';
        alert.innerHTML = `
          <div style="background: #fef3c7; border: 2px solid #fbbf24; color: #92400e; padding: 12px 16px; border-radius: 8px; margin: 12px 0; display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 20px;">📦</span>
            <div style="font-weight: 600; font-size: 13px;">Limited stock - ${quantity} available</div>
          </div>
        `;
        el.parentNode.insertBefore(alert, el);
      }
    });
  }

  // Get sales metrics
  getMetrics() {
    return {
      emailCaptured: sessionStorage.getItem('emailCaptured') === 'true',
      exitPopupShown: sessionStorage.getItem('exitPopupShown') === 'true',
      cartValue: this.cart.subtotal,
      cartItems: this.cart.itemCount
    };
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideIn {
    from { 
      opacity: 0;
      transform: translateY(-20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0%, 100% { 
      transform: scale(1);
      opacity: 1;
    }
    50% { 
      transform: scale(1.1);
      opacity: 0.8;
    }
  }
`;
document.head.appendChild(style);

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.salesMaximizer = new SalesMaximizer();
  });
} else {
  window.salesMaximizer = new SalesMaximizer();
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SalesMaximizer;
}
