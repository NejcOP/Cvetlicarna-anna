// Gallery JavaScript with Filtering, Animations, and Lightbox

// Load gallery data from JSON script tag
const galleryDataElement = document.getElementById('galleryData');
const galleryData = JSON.parse(galleryDataElement.textContent);

// State
let currentCategory = 'vse';
let currentLightboxIndex = 0;
let filteredItems = [];

// DOM Elements
const galleryGrid = document.getElementById('galleryGrid');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const filterButtons = document.querySelectorAll('.filter-btn');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxCategory = document.getElementById('lightboxCategory');
const lightboxDescription = document.getElementById('lightboxDescription');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

// Category names mapping
const categoryNames = {
    'vse': 'Vse',
    'porocni': 'Poročni šopki',
    'zalni': 'Žalni aranžmaji',
    'darilni': 'Darilni program',
    'dnevna': 'Dnevna ponudba'
};

// Initialize gallery
function initGallery() {
    updateFilterCounts();
    renderGallery();
    
    // Simulate loading
    setTimeout(() => {
        loadingState.style.display = 'none';
    }, 500);
}

// Update filter button counts
function updateFilterCounts() {
    const counts = {
        'vse': galleryData.length,
        'porocni': galleryData.filter(item => item.category === 'porocni').length,
        'zalni': galleryData.filter(item => item.category === 'zalni').length,
        'darilni': galleryData.filter(item => item.category === 'darilni').length,
        'dnevna': galleryData.filter(item => item.category === 'dnevna').length
    };

    filterButtons.forEach(btn => {
        const category = btn.getAttribute('data-category');
        const countElement = btn.querySelector('.filter-count');
        if (countElement && counts[category]) {
            countElement.textContent = counts[category];
        }
    });
}

// Filter functionality
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Update active state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Get selected category
        currentCategory = this.getAttribute('data-category');
        
        // Render gallery with animation
        renderGallery();
    });
});

// Render gallery
function renderGallery() {
    // Filter items
    if (currentCategory === 'vse') {
        filteredItems = [...galleryData];
    } else {
        filteredItems = galleryData.filter(item => item.category === currentCategory);
    }

    // Add fade out animation to existing items
    const existingItems = document.querySelectorAll('.gallery-item');
    existingItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('fade-out');
        }, index * 30);
    });

    // Wait for fade out, then render new items
    setTimeout(() => {
        if (filteredItems.length === 0) {
            galleryGrid.innerHTML = '';
            emptyState.style.display = 'block';
            lucide.createIcons();
        } else {
            emptyState.style.display = 'none';
            galleryGrid.innerHTML = filteredItems.map((item, index) => `
                <div class="gallery-item" data-index="${index}" style="animation-delay: ${index * 0.05}s">
                    <img src="${item.thumbnail}" 
                         alt="${item.title}" 
                         class="gallery-item-image"
                         loading="lazy">
                    <div class="gallery-item-overlay">
                        <h3 class="gallery-item-title">${item.title}</h3>
                        <span class="gallery-item-category">${categoryNames[item.category]}</span>
                    </div>
                </div>
            `).join('');

            // Add click event to gallery items
            attachGalleryClickEvents();
        }
    }, existingItems.length * 30 + 300);
}

// Attach click events to gallery items
function attachGalleryClickEvents() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            openLightbox(index);
        });
    });
}

// Lightbox functionality
function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function updateLightboxContent() {
    const item = filteredItems[currentLightboxIndex];
    lightboxImage.src = item.image;
    lightboxImage.alt = item.title;
    lightboxTitle.textContent = item.title;
    lightboxCategory.textContent = categoryNames[item.category];
    lightboxDescription.textContent = item.description;
}

function nextImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % filteredItems.length;
    updateLightboxContent();
}

function prevImage() {
    currentLightboxIndex = (currentLightboxIndex - 1 + filteredItems.length) % filteredItems.length;
    updateLightboxContent();
}

// Event listeners for lightbox
lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', nextImage);
lightboxPrev.addEventListener('click', prevImage);

// Close lightbox on background click
lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;
    
    switch(e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowRight':
            nextImage();
            break;
        case 'ArrowLeft':
            prevImage();
            break;
    }
});

// Image lazy loading optimization
function optimizeImageLoading() {
    const images = document.querySelectorAll('.gallery-item-image');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('src');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Smooth scroll to top when changing categories
function smoothScrollToGallery() {
    const gallerySection = document.querySelector('.gallery-section');
    if (gallerySection) {
        const offset = 100;
        const elementPosition = gallerySection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Add scroll to filter buttons
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        setTimeout(smoothScrollToGallery, 100);
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initGallery();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// Performance: Debounce resize events
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Re-initialize icons after resize if needed
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, 250);
});

// Export for potential external use
window.galleryAPI = {
    setCategory: function(category) {
        currentCategory = category;
        renderGallery();
    },
    refresh: function() {
        initGallery();
    },
    getData: function() {
        return galleryData;
    }
};
