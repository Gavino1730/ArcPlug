/**
 * Checkout Accelerator & A/B Testing Framework
 * Optimizes checkout flow and tests different CTA variations
 */

class CheckoutAccelerator {
  constructor() {
    this.config = {
      expressCheckoutEnabled: true,
      progressIndicatorEnabled: true,
      autofillEnabled: true,
      oneClickCheckoutEnabled: true,
      abTestingEnabled: true
    };
    
    this.abTests = {
      ctaVariations: ['default', 'urgent', 'benefit', 'scarcity'],
      currentVariation: null
    };
    
    this.init();
  }

  init() {
    this.optimizeCheckoutFlow();
    this.addExpressCheckoutOptions();
    this.addProgressIndicator();
    this.enableSmartAutofill();
    this.addTrustSignals();
    this.setupABTesting();
    this.addCheckoutGuarantees();
    this.optimizePaymentOptions();
  }

  optimizeCheckoutFlow() {
    // Simplify form fields
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // Remove optional fields from initial view
      const optionalFields = form.querySelectorAll('[aria-required="false"], .optional');
      optionalFields.forEach(field => {
        field.style.display = 'none';
      });

      // Add "Show more fields" button if there are hidden fields
      if (optionalFields.length > 0) {
        const showMoreBtn = document.createElement('button');
        showMoreBtn.type = 'button';
        showMoreBtn.textContent = '+ Show optional fields';
        showMoreBtn.style.cssText = `
          background: transparent;
          border: 2px dashed #d1d5db;
          color: #6b7280;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          margin: 16px 0;
          width: 100%;
          transition: all 0.3s;
        `;

        showMoreBtn.addEventListener('click', () => {
          optionalFields.forEach(field => {
            field.style.display = 'block';
          });
          showMoreBtn.remove();
        });

        form.appendChild(showMoreBtn);
      }
    });
  }

  addExpressCheckoutOptions() {
    if (!this.config.expressCheckoutEnabled) return;

    const checkoutArea = document.querySelector('.cart__checkout, [data-checkout]');
    if (!checkoutArea) return;

    const expressOptions = document.createElement('div');
    expressOptions.className = 'express-checkout-options';
    expressOptions.innerHTML = `
      <div style="margin: 24px 0;">
        <div style="text-align: center; margin-bottom: 16px; color: #6b7280; font-size: 14px; font-weight: 600;">
          <span style="background: white; padding: 0 12px; position: relative; z-index: 1;">Express Checkout</span>
          <div style="height: 1px; background: #e5e7eb; margin-top: -10px;"></div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px;">
          <button class="express-checkout-btn" data-method="shop-pay" style="background: #5a31f4; color: white; border: none; padding: 14px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s; box-shadow: 0 2px 8px rgba(90, 49, 244, 0.3);">
            <span>Shop</span><span style="background: white; color: #5a31f4; padding: 2px 8px; border-radius: 4px;">Pay</span>
          </button>
          
          <button class="express-checkout-btn" data-method="paypal" style="background: #0070ba; color: white; border: none; padding: 14px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.3s; box-shadow: 0 2px 8px rgba(0, 112, 186, 0.3);">
            PayPal
          </button>
          
          <button class="express-checkout-btn" data-method="apple-pay" style="background: #000; color: white; border: none; padding: 14px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.3s; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);">
             Apple Pay
          </button>
          
          <button class="express-checkout-btn" data-method="google-pay" style="background: white; color: #5f6368; border: 1px solid #dadce0; padding: 14px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.3s;">
            G Pay
          </button>
        </div>
        
        <div style="text-align: center; margin: 20px 0; color: #9ca3af; font-size: 13px; position: relative;">
          <span style="background: white; padding: 0 12px; position: relative; z-index: 1;">OR</span>
          <div style="height: 1px; background: #e5e7eb; margin-top: -10px;"></div>
        </div>
      </div>
    `;

    checkoutArea.insertBefore(expressOptions, checkoutArea.firstChild);

    // Add click handlers
    expressOptions.querySelectorAll('.express-checkout-btn').forEach(btn => {
      btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
      });

      btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
      });

      btn.addEventListener('click', function() {
        const method = this.dataset.method;
        if (window.uxEnhancer) {
          window.uxEnhancer.showSuccess(`Redirecting to ${method}...`);
        }
        // Would integrate with actual payment methods
      });
    });
  }

  addProgressIndicator() {
    if (!this.config.progressIndicatorEnabled) return;

    const checkoutPage = document.querySelector('[data-checkout-page]');
    if (!checkoutPage) return;

    const steps = ['Cart', 'Information', 'Shipping', 'Payment'];
    const currentStep = this.getCurrentCheckoutStep();

    const progressBar = document.createElement('div');
    progressBar.className = 'checkout-progress';
    progressBar.innerHTML = `
      <div style="background: white; padding: 24px; margin-bottom: 24px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <div style="display: flex; justify-content: space-between; position: relative;">
          ${steps.map((step, index) => {
            const isComplete = index < currentStep;
            const isCurrent = index === currentStep;
            
            return `
              <div style="flex: 1; text-align: center; position: relative;">
                <div style="width: 40px; height: 40px; margin: 0 auto 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; z-index: 2; position: relative; ${
                  isComplete ? 'background: #10b981; color: white;' : 
                  isCurrent ? 'background: #667eea; color: white;' : 
                  'background: #e5e7eb; color: #9ca3af;'
                }">
                  ${isComplete ? '✓' : index + 1}
                </div>
                <div style="font-size: 13px; font-weight: ${isCurrent ? '700' : '600'}; color: ${isCurrent ? '#667eea' : '#6b7280'};">
                  ${step}
                </div>
                ${index < steps.length - 1 ? `
                  <div style="position: absolute; top: 20px; left: 50%; width: 100%; height: 2px; background: ${isComplete ? '#10b981' : '#e5e7eb'}; z-index: 1;"></div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    checkoutPage.insertBefore(progressBar, checkoutPage.firstChild);
  }

  getCurrentCheckoutStep() {
    // Detect current step based on URL or page content
    const url = window.location.pathname;
    if (url.includes('/cart')) return 0;
    if (url.includes('/information')) return 1;
    if (url.includes('/shipping')) return 2;
    if (url.includes('/payment')) return 3;
    return 0;
  }

  enableSmartAutofill() {
    if (!this.config.autofillEnabled) return;

    // Add proper autocomplete attributes
    const fieldMappings = {
      'email': 'email',
      'first-name': 'given-name',
      'last-name': 'family-name',
      'address1': 'address-line1',
      'address2': 'address-line2',
      'city': 'address-level2',
      'country': 'country-name',
      'province': 'address-level1',
      'zip': 'postal-code',
      'phone': 'tel'
    };

    Object.entries(fieldMappings).forEach(([key, value]) => {
      const inputs = document.querySelectorAll(`[name*="${key}"], #${key}, .${key}`);
      inputs.forEach(input => {
        if (!input.hasAttribute('autocomplete')) {
          input.setAttribute('autocomplete', value);
        }
      });
    });

    // Remember user's info (with permission)
    this.setupFormMemory();
  }

  setupFormMemory() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // Load saved data
      const savedData = localStorage.getItem('checkout_autofill');
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          Object.entries(data).forEach(([key, value]) => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input && input.type !== 'password') {
              input.value = value;
            }
          });
        } catch (e) {
          console.log('Could not load saved data');
        }
      }

      // Save on change
      form.addEventListener('change', () => {
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
          if (key !== 'password' && key !== 'credit_card') {
            data[key] = value;
          }
        }
        localStorage.setItem('checkout_autofill', JSON.stringify(data));
      });
    });
  }

  addTrustSignals() {
    const checkoutArea = document.querySelector('.cart, [data-checkout]');
    if (!checkoutArea) return;

    const trustSignals = document.createElement('div');
    trustSignals.className = 'checkout-trust-signals';
    trustSignals.innerHTML = `
      <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 2px solid #86efac; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <div style="font-size: 18px; font-weight: 700; color: #166534; margin-bottom: 16px; text-align: center;">
          🛡️ Safe & Secure Checkout
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px;">
          <div style="text-align: center;">
            <div style="font-size: 32px; margin-bottom: 8px;">🔒</div>
            <div style="font-size: 13px; font-weight: 600; color: #166534;">SSL Encrypted</div>
            <div style="font-size: 11px; color: #16a34a;">256-bit Security</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 32px; margin-bottom: 8px;">💳</div>
            <div style="font-size: 13px; font-weight: 600; color: #166534;">PCI Compliant</div>
            <div style="font-size: 11px; color: #16a34a;">Secure Payments</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 32px; margin-bottom: 8px;">↩️</div>
            <div style="font-size: 13px; font-weight: 600; color: #166534;">Money-Back</div>
            <div style="font-size: 11px; color: #16a34a;">30-Day Guarantee</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 32px; margin-bottom: 8px;">⭐</div>
            <div style="font-size: 13px; font-weight: 600; color: #166534;">5-Star Rated</div>
            <div style="font-size: 11px; color: #16a34a;">10,000+ Reviews</div>
          </div>
        </div>
      </div>
    `;

    const checkoutBtn = document.querySelector('[name="checkout"]');
    if (checkoutBtn) {
      checkoutBtn.parentNode.insertBefore(trustSignals, checkoutBtn);
    }
  }

  setupABTesting() {
    if (!this.config.abTestingEnabled) return;

    // Select random variation or get from session
    let variation = sessionStorage.getItem('cta_variation');
    
    if (!variation) {
      variation = this.abTests.ctaVariations[
        Math.floor(Math.random() * this.abTests.ctaVariations.length)
      ];
      sessionStorage.setItem('cta_variation', variation);
    }

    this.abTests.currentVariation = variation;
    this.applyCTAVariation(variation);
    
    // Track which variation user saw
    console.log('A/B Test - CTA Variation:', variation);
  }

  applyCTAVariation(variation) {
    const ctaButtons = document.querySelectorAll(
      '[name="add"], [name="checkout"], .product-form__submit, .checkout-button'
    );

    const variations = {
      default: {
        text: '🛒 Add to Cart',
        checkoutText: 'Checkout',
        style: 'background: linear-gradient(135deg, #10b981 0%, #059669 100%);'
      },
      urgent: {
        text: '⚡ Add to Cart NOW - Limited Stock!',
        checkoutText: '🔥 Complete Order NOW',
        style: 'background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); animation: pulse 2s infinite;'
      },
      benefit: {
        text: '✨ Add to Cart - Free Shipping!',
        checkoutText: '🎁 Get My Order - Free Shipping',
        style: 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);'
      },
      scarcity: {
        text: '🎯 Claim Yours - Only 5 Left!',
        checkoutText: '🚀 Secure My Order Now',
        style: 'background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);'
      }
    };

    const config = variations[variation] || variations.default;

    ctaButtons.forEach(btn => {
      const isCheckout = btn.name === 'checkout' || btn.classList.contains('checkout-button');
      
      // Update text
      const newText = isCheckout ? config.checkoutText : config.text;
      if (!btn.querySelector('img') && !btn.querySelector('svg')) {
        btn.textContent = newText;
      }

      // Apply styling
      btn.style.cssText += config.style;
      btn.style.color = 'white';
      btn.style.fontWeight = '700';
      btn.style.padding = '16px 32px';
      btn.style.borderRadius = '8px';
      btn.style.border = 'none';
      btn.style.cursor = 'pointer';
      btn.style.transition = 'all 0.3s';
      btn.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';

      // Track clicks
      btn.addEventListener('click', () => {
        console.log(`A/B Test Click - Variation: ${variation}`);
        
        // Send to analytics
        if (window.gtag) {
          window.gtag('event', 'cta_click', {
            event_category: 'ab_test',
            event_label: variation
          });
        }
      });
    });
  }

  addCheckoutGuarantees() {
    const cartPage = document.querySelector('[data-cart-page], .cart');
    if (!cartPage) return;

    const guarantees = document.createElement('div');
    guarantees.className = 'checkout-guarantees';
    guarantees.innerHTML = `
      <div style="background: #fffbeb; border: 2px solid #fbbf24; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <div style="font-size: 16px; font-weight: 700; color: #92400e; margin-bottom: 12px; text-align: center;">
          ✨ Our Promises to You
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: white; border-radius: 8px;">
            <span style="font-size: 24px;">📦</span>
            <div>
              <div style="font-weight: 600; font-size: 14px; color: #78350f;">Fast Shipping</div>
              <div style="font-size: 12px; color: #92400e;">Ships within 24 hours</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: white; border-radius: 8px;">
            <span style="font-size: 24px;">✅</span>
            <div>
              <div style="font-weight: 600; font-size: 14px; color: #78350f;">Quality Guaranteed</div>
              <div style="font-size: 12px; color: #92400e;">Premium products only</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: white; border-radius: 8px;">
            <span style="font-size: 24px;">💯</span>
            <div>
              <div style="font-weight: 600; font-size: 14px; color: #78350f;">100% Satisfaction</div>
              <div style="font-size: 12px; color: #92400e;">Love it or get a full refund</div>
            </div>
          </div>
        </div>
      </div>
    `;

    cartPage.appendChild(guarantees);
  }

  optimizePaymentOptions() {
    // Make payment method selection more visual
    const paymentMethods = document.querySelectorAll('[name="payment_method"], .payment-method');
    
    paymentMethods.forEach(method => {
      const label = method.parentElement;
      if (label) {
        label.style.cssText = `
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: 12px;
        `;

        label.addEventListener('mouseenter', function() {
          this.style.borderColor = '#10b981';
          this.style.background = '#f0fdf4';
        });

        label.addEventListener('mouseleave', function() {
          if (!method.checked) {
            this.style.borderColor = '#e5e7eb';
            this.style.background = 'white';
          }
        });

        method.addEventListener('change', function() {
          if (this.checked) {
            label.style.borderColor = '#10b981';
            label.style.background = '#f0fdf4';
          }
        });
      }
    });
  }

  // Get metrics
  getMetrics() {
    return {
      ctaVariation: this.abTests.currentVariation,
      checkoutStep: this.getCurrentCheckoutStep()
    };
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.checkoutAccelerator = new CheckoutAccelerator();
  });
} else {
  window.checkoutAccelerator = new CheckoutAccelerator();
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CheckoutAccelerator;
}
