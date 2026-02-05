class CartDrawer extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
    this.setHeaderCartIconAccessibility();
  }

  setHeaderCartIconAccessibility() {
    const cartLink = document.querySelector('#cart-icon-bubble');
    if (!cartLink) return;

    cartLink.setAttribute('role', 'button');
    cartLink.setAttribute('aria-haspopup', 'dialog');
    cartLink.addEventListener('click', (event) => {
      event.preventDefault();
      this.open(cartLink);
    });
    cartLink.addEventListener('keydown', (event) => {
      if (event.code.toUpperCase() === 'SPACE') {
        event.preventDefault();
        this.open(cartLink);
      }
    });
  }

  open(triggeredBy) {
    if (triggeredBy) this.setActiveElement(triggeredBy);
    const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
    if (cartDrawerNote && !cartDrawerNote.hasAttribute('role')) this.setSummaryAccessibility(cartDrawerNote);
    // here the animation doesn't seem to always get triggered. A timeout seem to help
    setTimeout(() => {
      this.classList.add('animate', 'active');
    });

    this.addEventListener(
      'transitionend',
      () => {
        const containerToTrapFocusOn = this.classList.contains('is-empty')
          ? this.querySelector('.drawer__inner-empty')
          : document.getElementById('CartDrawer');
        const focusElement = this.querySelector('.drawer__inner') || this.querySelector('.drawer__close');
        trapFocus(containerToTrapFocusOn, focusElement);
      },
      { once: true }
    );

    document.body.classList.add('overflow-hidden');
    
    // Add conversion optimization on cart open
    this.optimizeCartForConversion();
  }

  close() {
    this.classList.remove('active');
    removeTrapFocus(this.activeElement);
    document.body.classList.remove('overflow-hidden');
  }

  setSummaryAccessibility(cartDrawerNote) {
    cartDrawerNote.setAttribute('role', 'button');
    cartDrawerNote.setAttribute('aria-expanded', 'false');

    if (cartDrawerNote.nextElementSibling.getAttribute('id')) {
      cartDrawerNote.setAttribute('aria-controls', cartDrawerNote.nextElementSibling.id);
    }

    cartDrawerNote.addEventListener('click', (event) => {
      event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
    });

    cartDrawerNote.parentElement.addEventListener('keyup', onKeyUpEscape);
  }

  renderContents(parsedState) {
    this.querySelector('.drawer__inner').classList.contains('is-empty') &&
      this.querySelector('.drawer__inner').classList.remove('is-empty');
    this.productId = parsedState.id;
    this.getSectionsToRender().forEach((section) => {
      const sectionElement = section.selector
        ? document.querySelector(section.selector)
        : document.getElementById(section.id);

      if (!sectionElement) return;
      sectionElement.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
    });

    setTimeout(() => {
      this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
      this.open();
    });
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-drawer',
        selector: '#CartDrawer',
      },
      {
        id: 'cart-icon-bubble',
      },
    ];
  }

  getSectionDOM(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector);
  }

  setActiveElement(element) {
    this.activeElement = element;
  }

  optimizeCartForConversion() {
    // Add free shipping progress bar if not already added
    setTimeout(() => {
      const cartDrawer = document.getElementById('CartDrawer');
      if (!cartDrawer || cartDrawer.querySelector('.shipping-progress-bar')) return;

      const cartTotal = parseFloat(cartDrawer.dataset.cartTotal || 0);
      const freeShippingThreshold = 75; // $75 for free shipping
      const remaining = Math.max(0, freeShippingThreshold - cartTotal);
      const progress = Math.min(100, (cartTotal / freeShippingThreshold) * 100);

      const progressBar = document.createElement('div');
      progressBar.className = 'shipping-progress-bar';
      progressBar.innerHTML = `
        <div style="padding: 16px; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-bottom: 2px solid #86efac; margin-bottom: 16px;">
          ${remaining > 0 ? `
            <div style="text-align: center; margin-bottom: 12px; font-size: 14px; font-weight: 600; color: #166534;">
              🚚 Add <strong>$${remaining.toFixed(2)}</strong> more for FREE shipping!
            </div>
          ` : `
            <div style="text-align: center; margin-bottom: 12px; font-size: 14px; font-weight: 600; color: #166534;">
              🎉 Congrats! You've qualified for FREE shipping!
            </div>
          `}
          <div style="background: #d1fae5; height: 8px; border-radius: 20px; overflow: hidden;">
            <div style="background: linear-gradient(90deg, #10b981 0%, #059669 100%); height: 100%; width: ${progress}%; transition: width 0.5s ease; border-radius: 20px;"></div>
          </div>
        </div>
      `;

      const drawerInner = cartDrawer.querySelector('.drawer__inner');
      if (drawerInner) {
        drawerInner.insertBefore(progressBar, drawerInner.firstChild);
      }

      // Add trust badges in cart
      if (!cartDrawer.querySelector('.cart-trust-badges')) {
        const trustBadges = document.createElement('div');
        trustBadges.className = 'cart-trust-badges';
        trustBadges.innerHTML = `
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 12px; background: #fef3c7; border-radius: 8px; margin: 16px 0; font-size: 11px; text-align: center;">
            <div>
              <div style="font-size: 20px; margin-bottom: 4px;">🔒</div>
              <div style="font-weight: 600; color: #78350f;">Secure</div>
            </div>
            <div>
              <div style="font-size: 20px; margin-bottom: 4px;">✓</div>
              <div style="font-weight: 600; color: #78350f;">Guaranteed</div>
            </div>
            <div>
              <div style="font-size: 20px; margin-bottom: 4px;">↩️</div>
              <div style="font-weight: 600; color: #78350f;">Easy Returns</div>
            </div>
          </div>
        `;
        
        const checkoutButton = cartDrawer.querySelector('.cart__checkout-button, [name="checkout"]');
        if (checkoutButton && checkoutButton.parentElement) {
          checkoutButton.parentElement.insertBefore(trustBadges, checkoutButton);
        }
      }
    }, 100);
  }
}

customElements.define('cart-drawer', CartDrawer);

class CartDrawerItems extends CartItems {
  getSectionsToRender() {
    return [
      {
        id: 'CartDrawer',
        section: 'cart-drawer',
        selector: '.drawer__inner',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section',
      },
    ];
  }
}

customElements.define('cart-drawer-items', CartDrawerItems);
