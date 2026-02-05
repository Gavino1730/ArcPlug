/**
 * Enhanced Product Urgency & Social Proof
 * Advanced conversion optimization for product pages
 */

class ProductUrgency {
  constructor() {
    this.config = {
      showViewerCount: true,
      showRecentPurchases: true,
      showLowStock: true,
      showCountdown: true,
      showTrending: true
    };
    
    this.init();
  }
  
  init() {
    this.addRealtimeViewers();
    this.addRecentPurchases();
    this.enhanceLowStockAlerts();
    this.addFlashSaleCountdown();
    this.addTrendingBadge();
    this.trackPageViews();
  }
  
  // Real-time viewer count
  addRealtimeViewers() {
    if (!this.config.showViewerCount) return;
    
    const productInfo = document.querySelector('.product__info-container');
    if (!productInfo) return;
    
    const viewerCount = Math.floor(Math.random() * 15) + 8; // 8-22 viewers
    
    const viewersHtml = `
      <div class="product-urgency-viewers" style="
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
        border-radius: 0.5rem;
        margin: 1rem 0;
        font-size: 0.875rem;
        font-weight: 500;
        animation: pulse 2s infinite;
      ">
        <span style="
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
          animation: blink 1.5s infinite;
        "></span>
        <span style="color: #dc2626;">
          <strong>${viewerCount}</strong> people are viewing this right now
        </span>
      </div>
      <style>
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      </style>
    `;
    
    const priceElement = document.querySelector('#price-' + document.querySelector('[data-section]')?.dataset.section);
    if (priceElement) {
      priceElement.insertAdjacentHTML('afterend', viewersHtml);
      
      // Update count periodically
      setInterval(() => {
        const newCount = Math.floor(Math.random() * 15) + 8;
        const countElement = document.querySelector('.product-urgency-viewers strong');
        if (countElement) {
          countElement.textContent = newCount;
        }
      }, 15000); // Update every 15 seconds
    }
  }
  
  // Recent purchase notifications
  addRecentPurchases() {
    if (!this.config.showRecentPurchases) return;
    
    const locations = [
      'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX',
      'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA',
      'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Jacksonville, FL',
      'Seattle, WA', 'Denver, CO', 'Boston, MA', 'Portland, OR',
      'Miami, FL', 'Atlanta, GA', 'Nashville, TN', 'Detroit, MI'
    ];
    
    const products = [
      'this product', 'a similar item', 'from this collection'
    ];
    
    const showNotification = () => {
      const location = locations[Math.floor(Math.random() * locations.length)];
      const product = products[Math.floor(Math.random() * products.length)];
      const timeAgo = Math.floor(Math.random() * 45) + 5; // 5-50 minutes ago
      
      const notification = document.createElement('div');
      notification.className = 'purchase-notification';
      notification.innerHTML = `
        <div class="purchase-notification-content">
          <div class="purchase-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
            </svg>
          </div>
          <div class="purchase-text">
            <strong>Someone in ${location}</strong> purchased ${product}
            <div class="purchase-time">${timeAgo} minutes ago</div>
          </div>
        </div>
        <button class="purchase-close" onclick="this.parentElement.remove()">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      `;
      
      // Add styles if not already present
      if (!document.getElementById('purchase-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'purchase-notification-styles';
        style.textContent = `
          .purchase-notification {
            position: fixed;
            bottom: 2rem;
            left: 2rem;
            max-width: 480px;
            background: white;
            border-radius: 0.75rem;
            padding: 1.25rem 1.5rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            z-index: 9998;
            animation: slideInLeft 0.5s ease, fadeOut 0.5s ease 4.5s;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
          }
          
          .purchase-notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            flex: 1;
          }
          
          .purchase-icon {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #10b981, #059669);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            flex-shrink: 0;
          }
          
          .purchase-text {
            font-size: 1rem;
            line-height: 1.4;
            color: #1f2937;
          }
          
          .purchase-text strong {
            display: block;
            font-weight: 600;
            margin-bottom: 0.125rem;
          }
          
          .purchase-time {
            font-size: 0.875rem;
            color: #6b7280;
          }
          
          .purchase-close {
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.25rem;
            color: #9ca3af;
            transition: color 0.2s ease;
            flex-shrink: 0;
          }
          
          .purchase-close:hover {
            color: #1f2937;
          }
          
          @keyframes slideInLeft {
            from {
              transform: translateX(-100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes fadeOut {
            to {
              opacity: 0;
              transform: translateX(-20px);
            }
          }
          
          @media screen and (max-width: 749px) {
            .purchase-notification {
              left: 1rem;
              right: 1rem;
              max-width: none;
              bottom: 1rem;
            }
          }
        `;
        document.head.appendChild(style);
      }
      
      document.body.appendChild(notification);
      
      // Remove after 5 seconds
      setTimeout(() => {
        notification.remove();
      }, 5000);
    };
    
    // Show first notification after 8 seconds
    setTimeout(showNotification, 8000);
    
    // Then show periodically
    setInterval(showNotification, 30000); // Every 30 seconds
  }
  
  // Enhanced low stock alerts
  enhanceLowStockAlerts() {
    if (!this.config.showLowStock) return;
    
    const inventoryElement = document.querySelector('[id^="Inventory-"]');
    if (!inventoryElement) return;
    
    const inventoryText = inventoryElement.textContent.trim();
    
    // Check if low stock
    if (inventoryText.includes('low stock') || inventoryText.includes('Only')) {
      inventoryElement.style.cssText = `
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #ef4444;
        font-weight: 600;
        animation: shake 0.5s ease;
      `;
      
      // Add animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  // Flash sale countdown
  addFlashSaleCountdown() {
    if (!this.config.showCountdown) return;
    
    const productInfo = document.querySelector('.product__info-container');
    if (!productInfo) return;
    
    // Set end time to midnight
    const now = new Date();
    const endTime = new Date(now);
    endTime.setHours(23, 59, 59, 999);
    
    const countdownHtml = `
      <div class="flash-sale-countdown" style="
        background: linear-gradient(135deg, #dc2626, #991b1b);
        color: white;
        padding: 1rem;
        border-radius: 0.75rem;
        margin: 1.5rem 0;
        text-align: center;
      ">
        <div style="font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; opacity: 0.9;">
          ⚡ FLASH SALE ENDS IN
        </div>
        <div id="countdownTimer" style="
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        "></div>
        <div style="font-size: 0.875rem; margin-top: 0.5rem; opacity: 0.9;">
          Get an extra 15% OFF at checkout!
        </div>
      </div>
    `;
    
    const titleElement = document.querySelector('.product__title');
    if (titleElement) {
      titleElement.insertAdjacentHTML('afterend', countdownHtml);
      
      // Update countdown
      const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = endTime.getTime() - now;
        
        if (distance < 0) {
          endTime.setDate(endTime.getDate() + 1);
          return;
        }
        
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const timerElement = document.getElementById('countdownTimer');
        if (timerElement) {
          timerElement.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
      };
      
      updateCountdown();
      setInterval(updateCountdown, 1000);
    }
  }
  
  // Add trending badge
  addTrendingBadge() {
    if (!this.config.showTrending) return;
    
    // Random chance to show trending (70%)
    if (Math.random() > 0.7) return;
    
    const productTitle = document.querySelector('.product__title');
    if (!productTitle) return;
    
    const badge = document.createElement('span');
    badge.innerHTML = '🔥 TRENDING';
    badge.style.cssText = `
      display: inline-block;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      margin-left: 0.75rem;
      vertical-align: middle;
      animation: trendingPulse 2s infinite;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes trendingPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
    `;
    document.head.appendChild(style);
    
    productTitle.appendChild(badge);
  }
  
  // Track page views for analytics
  trackPageViews() {
    const productId = document.querySelector('[data-product-id]')?.dataset.productId;
    if (!productId) return;
    
    // Store view in localStorage
    const viewKey = `product_view_${productId}`;
    const lastView = localStorage.getItem(viewKey);
    const now = Date.now();
    
    // Only count if not viewed in last 24 hours
    if (!lastView || (now - parseInt(lastView)) > 86400000) {
      localStorage.setItem(viewKey, now.toString());
      
      // Send analytics event if available
      if (typeof gtag !== 'undefined') {
        gtag('event', 'view_item', {
          items: [{
            item_id: productId,
            item_name: document.querySelector('.product__title')?.textContent?.trim()
          }]
        });
      }
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ProductUrgency();
  });
} else {
  new ProductUrgency();
}
