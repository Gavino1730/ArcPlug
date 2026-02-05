/**
 * Product Media Enhancer
 * Improves product galleries with zoom, video, and interactive features
 */

class ProductMediaEnhancer {
  constructor() {
    this.config = {
      zoomEnabled: true,
      videoAutoplayEnabled: true,
      galleryNavigationEnabled: true,
      thumbnailsEnabled: true,
      fullscreenEnabled: true
    };
    
    this.currentImageIndex = 0;
    this.images = [];
    this.init();
  }

  init() {
    this.enhanceProductGallery();
    this.addImageZoom();
    this.enhanceVideoPlayers();
    this.addImageNavigation();
    this.add360View();
    this.addImageComparisonSlider();
  }

  enhanceProductGallery() {
    const gallery = document.querySelector('.product__media-gallery, .product-media-gallery');
    if (!gallery) return;

    // Collect all images
    const imageElements = gallery.querySelectorAll('img');
    this.images = Array.from(imageElements).map(img => ({
      src: img.src,
      alt: img.alt
    }));

    // Add fullscreen button
    this.addFullscreenButton(gallery);

    // Add image counter
    this.addImageCounter(gallery);

    // Improve thumbnails
    this.enhanceThumbnails();
  }

  addFullscreenButton(gallery) {
    if (!this.config.fullscreenEnabled) return;

    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.className = 'fullscreen-toggle';
    fullscreenBtn.innerHTML = '⛶';
    fullscreenBtn.title = 'View Fullscreen';
    fullscreenBtn.style.cssText = `
      position: absolute;
      top: 16px;
      right: 16px;
      z-index: 10;
      background: rgba(255, 255, 255, 0.9);
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    fullscreenBtn.addEventListener('mouseenter', () => {
      fullscreenBtn.style.background = 'white';
      fullscreenBtn.style.transform = 'scale(1.1)';
    });

    fullscreenBtn.addEventListener('mouseleave', () => {
      fullscreenBtn.style.background = 'rgba(255, 255, 255, 0.9)';
      fullscreenBtn.style.transform = 'scale(1)';
    });

    fullscreenBtn.addEventListener('click', () => {
      this.openFullscreenGallery();
    });

    const mediaWrapper = gallery.querySelector('.product__media-wrapper, .media');
    if (mediaWrapper) {
      mediaWrapper.style.position = 'relative';
      mediaWrapper.appendChild(fullscreenBtn);
    }
  }

  openFullscreenGallery() {
    const overlay = document.createElement('div');
    overlay.className = 'fullscreen-gallery-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.95);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s;
    `;

    overlay.innerHTML = `
      <button class="close-fullscreen" style="position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.1); border: 2px solid white; color: white; width: 50px; height: 50px; border-radius: 50%; font-size: 28px; cursor: pointer; z-index: 10001; transition: all 0.3s;">×</button>
      
      <button class="prev-image" style="position: absolute; left: 20px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.1); border: 2px solid white; color: white; width: 50px; height: 50px; border-radius: 50%; font-size: 28px; cursor: pointer; z-index: 10001; transition: all 0.3s;">‹</button>
      
      <button class="next-image" style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.1); border: 2px solid white; color: white; width: 50px; height: 50px; border-radius: 50%; font-size: 28px; cursor: pointer; z-index: 10001; transition: all 0.3s;">›</button>
      
      <div class="fullscreen-image-container" style="max-width: 90%; max-height: 90%; display: flex; align-items: center; justify-content: center;">
        <img id="fullscreen-image" src="${this.images[this.currentImageIndex]?.src || ''}" alt="${this.images[this.currentImageIndex]?.alt || ''}" style="max-width: 100%; max-height: 90vh; object-fit: contain;" />
      </div>
      
      <div class="image-counter" style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(255,255,255,0.2); color: white; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600;">
        ${this.currentImageIndex + 1} / ${this.images.length}
      </div>
    `;

    document.body.appendChild(overlay);

    // Close button
    overlay.querySelector('.close-fullscreen').addEventListener('click', () => {
      overlay.remove();
    });

    // Navigation
    overlay.querySelector('.prev-image').addEventListener('click', () => {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
      this.updateFullscreenImage(overlay);
    });

    overlay.querySelector('.next-image').addEventListener('click', () => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
      this.updateFullscreenImage(overlay);
    });

    // Keyboard navigation
    const keyHandler = (e) => {
      if (e.key === 'Escape') overlay.remove();
      if (e.key === 'ArrowLeft') overlay.querySelector('.prev-image').click();
      if (e.key === 'ArrowRight') overlay.querySelector('.next-image').click();
    };
    document.addEventListener('keydown', keyHandler);

    // Cleanup
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        document.removeEventListener('keydown', keyHandler);
        overlay.remove();
      }
    });
  }

  updateFullscreenImage(overlay) {
    const img = overlay.querySelector('#fullscreen-image');
    const counter = overlay.querySelector('.image-counter');
    
    if (img && this.images[this.currentImageIndex]) {
      img.src = this.images[this.currentImageIndex].src;
      img.alt = this.images[this.currentImageIndex].alt;
    }
    
    if (counter) {
      counter.textContent = `${this.currentImageIndex + 1} / ${this.images.length}`;
    }
  }

  addImageCounter(gallery) {
    if (this.images.length <= 1) return;

    const counter = document.createElement('div');
    counter.className = 'image-counter-badge';
    counter.textContent = `${this.currentImageIndex + 1}/${this.images.length}`;
    counter.style.cssText = `
      position: absolute;
      bottom: 16px;
      left: 16px;
      z-index: 10;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
    `;

    const mediaWrapper = gallery.querySelector('.product__media-wrapper, .media');
    if (mediaWrapper) {
      mediaWrapper.style.position = 'relative';
      mediaWrapper.appendChild(counter);
    }
  }

  addImageZoom() {
    if (!this.config.zoomEnabled) return;

    const images = document.querySelectorAll('.product__media img, .product-media img');
    
    images.forEach(img => {
      img.style.cursor = 'zoom-in';
      img.style.transition = 'transform 0.3s';

      // Hover zoom on desktop
      if (window.innerWidth >= 768) {
        img.addEventListener('mouseenter', function() {
          this.style.transform = 'scale(1.2)';
        });

        img.addEventListener('mouseleave', function() {
          this.style.transform = 'scale(1)';
        });
      }

      // Click to zoom
      img.addEventListener('click', function(e) {
        if (e.target.tagName === 'IMG') {
          // Trigger fullscreen
          const fullscreenBtn = document.querySelector('.fullscreen-toggle');
          if (fullscreenBtn) fullscreenBtn.click();
        }
      });
    });
  }

  enhanceVideoPlayers() {
    const videos = document.querySelectorAll('.product__media video, video');
    
    videos.forEach(video => {
      // Add play button overlay
      const playBtn = document.createElement('button');
      playBtn.className = 'video-play-btn';
      playBtn.innerHTML = '▶';
      playBtn.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        font-size: 32px;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: 8px;
      `;

      const wrapper = video.parentElement;
      wrapper.style.position = 'relative';
      wrapper.appendChild(playBtn);

      playBtn.addEventListener('click', () => {
        if (video.paused) {
          video.play();
          playBtn.style.opacity = '0';
        } else {
          video.pause();
          playBtn.style.opacity = '1';
        }
      });

      video.addEventListener('play', () => {
        playBtn.style.opacity = '0';
      });

      video.addEventListener('pause', () => {
        playBtn.style.opacity = '1';
      });

      // Auto-play on hover (muted)
      if (this.config.videoAutoplayEnabled) {
        wrapper.addEventListener('mouseenter', () => {
          video.muted = true;
          video.play();
        });

        wrapper.addEventListener('mouseleave', () => {
          video.pause();
        });
      }
    });
  }

  addImageNavigation() {
    if (!this.config.galleryNavigationEnabled) return;

    const gallery = document.querySelector('.product__media-gallery, .product-media-gallery');
    if (!gallery || this.images.length <= 1) return;

    // Add swipe support for mobile
    this.addSwipeSupport(gallery);
  }

  addSwipeSupport(gallery) {
    let touchStartX = 0;
    let touchEndX = 0;

    gallery.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    gallery.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    }, { passive: true });
  }

  handleSwipe(startX, endX) {
    const diff = startX - endX;
    const threshold = 50;

    if (Math.abs(diff) < threshold) return;

    if (diff > 0) {
      // Swipe left - next image
      console.log('Next image');
    } else {
      // Swipe right - previous image
      console.log('Previous image');
    }
  }

  enhanceThumbnails() {
    if (!this.config.thumbnailsEnabled) return;

    const thumbnails = document.querySelectorAll('.product__media-item, .thumbnail');
    
    thumbnails.forEach((thumb, index) => {
      thumb.style.cursor = 'pointer';
      thumb.style.transition = 'all 0.3s';
      thumb.style.border = '2px solid transparent';

      thumb.addEventListener('mouseenter', function() {
        this.style.borderColor = '#10b981';
        this.style.transform = 'scale(1.05)';
      });

      thumb.addEventListener('mouseleave', function() {
        this.style.borderColor = 'transparent';
        this.style.transform = 'scale(1)';
      });

      thumb.addEventListener('click', () => {
        this.currentImageIndex = index;
      });
    });
  }

  add360View() {
    // Placeholder for 360-degree product view
    const productPage = document.querySelector('[data-product-page], .product');
    if (!productPage) return;

    // Check if product has 360 images (would need specific data attribute)
    const has360 = productPage.querySelector('[data-360-view]');
    if (!has360) return;

    const viewer360 = document.createElement('div');
    viewer360.className = '360-viewer-badge';
    viewer360.innerHTML = `
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 8px 16px; border-radius: 8px; margin: 12px 0; display: inline-flex; align-items: center; gap: 8px; font-weight: 600; font-size: 14px; cursor: pointer;">
        <span style="font-size: 20px;">🔄</span>
        360° View Available - Click to Rotate
      </div>
    `;

    const gallery = document.querySelector('.product__media-gallery, .product-media-gallery');
    if (gallery) {
      gallery.insertBefore(viewer360, gallery.firstChild);
    }
  }

  addImageComparisonSlider() {
    // Check if there are before/after images
    const comparisonContainer = document.querySelector('[data-comparison-images]');
    if (!comparisonContainer) return;

    const slider = document.createElement('div');
    slider.className = 'image-comparison-slider';
    slider.innerHTML = `
      <div style="position: relative; max-width: 600px; margin: 24px 0;">
        <div style="font-weight: 700; margin-bottom: 12px;">📸 Compare: Before & After</div>
        <div style="position: relative; overflow: hidden; border-radius: 12px;">
          <div class="comparison-before" style="position: absolute; top: 0; left: 0; width: 50%; height: 100%; overflow: hidden;">
            <img src="" alt="Before" style="width: auto; height: 100%; object-fit: cover;" />
          </div>
          <div class="comparison-after" style="width: 100%;">
            <img src="" alt="After" style="width: 100%; height: auto; display: block;" />
          </div>
          <div class="comparison-slider-handle" style="position: absolute; top: 0; left: 50%; width: 4px; height: 100%; background: white; cursor: ew-resize; box-shadow: 0 0 10px rgba(0,0,0,0.5);">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">
              ⟷
            </div>
          </div>
        </div>
      </div>
    `;

    comparisonContainer.appendChild(slider);
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.productMediaEnhancer = new ProductMediaEnhancer();
  });
} else {
  window.productMediaEnhancer = new ProductMediaEnhancer();
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProductMediaEnhancer;
}
