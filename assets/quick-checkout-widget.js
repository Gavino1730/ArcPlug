/**
 * Quick Checkout Widget
 * Floating checkout button for mobile that follows user
 */

class QuickCheckoutWidget {
  constructor() {
    this.isVisible = false;
    this.init();
  }

  init() {
    if (window.innerWidth > 768) return; // Only for mobile

    this.createWidget();
    this.attachScrollListener();
  }

  createWidget() {
    const widget = document.createElement('div');
    widget.className = 'quick-checkout-widget';
    widget.innerHTML = `
      <div style="position: fixed; bottom: 20px; left: 20px; right: 20px; z-index: 9999; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 16px; padding: 16px 20px; box-shadow: 0 8px 24px rgba(16, 185, 129, 0.5); display: none; animation: slideUp 0.3s ease-out;" id="quick-checkout-widget">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px;">
          <div style="flex: 1; color: white;">
            <div style="font-size: 13px; opacity: 0.9; margin-bottom: 4px;">Cart Total</div>
            <div style="font-size: 20px; font-weight: 700;" id="widget-cart-total">$0.00</div>
          </div>
          <button onclick="this.closest('.quick-checkout-widget').goToCheckout()" style="background: white; color: #059669; border: none; padding: 14px 28px; border-radius: 12px; font-weight: 700; font-size: 15px; cursor: pointer; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); transition: all 0.2s;" onmousedown="this.style.transform='scale(0.95)'" onmouseup="this.style.transform='scale(1)'">
            Checkout →
          </button>
        </div>
        <div style="margin-top: 12px; text-align: center; font-size: 12px; color: rgba(255, 255, 255, 0.8);" id="widget-item-count">
          0 items
        </div>
      </div>
      <style>
        @keyframes slideUp {
          from {
            transform: translateY(150%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      </style>
    `;

    document.body.appendChild(widget);
    this.widget = document.getElementById('quick-checkout-widget');

    // Add checkout method
    widget.goToCheckout = () => {
      const checkoutBtn = document.querySelector('[name="checkout"]');
      if (checkoutBtn) {
        checkoutBtn.click();
      } else {
        window.location.href = '/checkout';
      }
    };

    this.updateCartInfo();
  }

  attachScrollListener() {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      const checkoutBtn = document.querySelector('.cart__checkout-button');
      
      if (!checkoutBtn || !this.widget) return;

      const checkoutBtnRect = checkoutBtn.getBoundingClientRect();
      
      // Show widget when checkout button is out of view and user is scrolling
      if (checkoutBtnRect.top > window.innerHeight || checkoutBtnRect.bottom < 0) {
        if (!this.isVisible && currentScroll > 300) {
          this.show();
        }
      } else {
        if (this.isVisible) {
          this.hide();
        }
      }
      
      lastScroll = currentScroll;
    });

    // Update on cart changes
    if (typeof PUB_SUB_EVENTS !== 'undefined') {
      subscribe(PUB_SUB_EVENTS.cartUpdate, () => {
        this.updateCartInfo();
      });
    }
  }

  updateCartInfo() {
    if (!this.widget) return;

    fetch('/cart.js')
      .then(response => response.json())
      .then(cart => {
        const total = (cart.total_price / 100).toFixed(2);
        const itemCount = cart.item_count;
        
        document.getElementById('widget-cart-total').textContent = `$${total}`;
        document.getElementById('widget-item-count').textContent = 
          `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;
      })
      .catch(e => console.log('Could not update widget cart info'));
  }

  show() {
    if (this.widget) {
      this.widget.style.display = 'block';
      this.isVisible = true;
    }
  }

  hide() {
    if (this.widget) {
      this.widget.style.display = 'none';
      this.isVisible = false;
    }
  }
}

// Initialize on cart page
if (document.querySelector('.cart') || document.querySelector('[data-cart]')) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new QuickCheckoutWidget();
    });
  } else {
    new QuickCheckoutWidget();
  }
}
