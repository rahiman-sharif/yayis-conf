// Enhanced JavaScript for Yayi's Confectionery

document.addEventListener('DOMContentLoaded', () => {
    console.log("Yayi's Confectionery website loaded.");

    // Ensure hero content is visible
    document.addEventListener("DOMContentLoaded", function() {
        // Force hero content to be visible
        const heroContent = document.querySelector('.hero-content');
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-buttons');
        
        if (heroContent) {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }
        
        if (heroElements) {
            heroElements.forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                el.style.animationDelay = '0s';
            });
        }
    });

    // Ensure featured sections are visible
    document.addEventListener("DOMContentLoaded", function() {
        // Force featured sections to be visible
        const featuredSections = document.querySelectorAll('.featured-section, .featured-grid, .featured-card');
        
        if (featuredSections) {
            featuredSections.forEach(el => {
                el.style.visibility = 'visible';
                el.style.opacity = '1';
                el.style.display = el.classList.contains('featured-grid') ? 'grid' : '';
            });
        }
        
        // Force section headers to be visible
        const sectionHeaders = document.querySelectorAll('.section-header, .section-title, .section-subtitle');
        
        if (sectionHeaders) {
            sectionHeaders.forEach(el => {
                el.style.visibility = 'visible';
                el.style.opacity = '1';
            });
        }
        
        console.log('Visibility fix applied to featured sections');
    });

    // Fix for featured menu items visibility
    document.addEventListener("DOMContentLoaded", function() {
        // Check if featured menu exists
        const featuredMenu = document.getElementById('featured-menu');
        if (featuredMenu) {
            // Make sure it's visible
            featuredMenu.style.display = 'block';
            
            // Get the container with the grid
            const featuredGrid = featuredMenu.querySelector('.featured-grid');
            if (featuredGrid) {
                // Ensure grid is visible and properly rendered
                featuredGrid.style.display = 'grid';
                
                // Check if there are any cards
                const cards = featuredGrid.querySelectorAll('.featured-card');
                console.log(`Found ${cards.length} featured menu cards`);
                
                // If no cards are found, try to check JSON data
                if (cards.length === 0) {
                    // Create a debugging message
                    const debugMsg = document.createElement('div');
                    debugMsg.style.padding = '20px';
                    debugMsg.style.backgroundColor = '#f8d7da';
                    debugMsg.style.color = '#721c24';
                    debugMsg.style.marginBottom = '20px';
                    debugMsg.style.borderRadius = '5px';
                    debugMsg.style.textAlign = 'center';
                    debugMsg.innerHTML = 'Warning: No featured menu items found. Please check the menu.json file.';
                    
                    // Insert before the section-cta
                    const sectionCta = featuredMenu.querySelector('.section-cta');
                    if (sectionCta) {
                        featuredMenu.insertBefore(debugMsg, sectionCta);
                    } else {
                        featuredGrid.appendChild(debugMsg);
                    }
                }
            } else {
                console.log('Featured grid not found');
            }
        } else {
            console.log('Featured menu section not found');
        }
    });

    // Scroll animations
    const animatedElements = document.querySelectorAll('.scroll-animate');
    
    // Check if we have any animated elements
    if (animatedElements.length > 0) {
        console.log(`Found ${animatedElements.length} elements for scroll animation`);
        
        // Initialize elements that are in view immediately
        animatedElements.forEach(element => {
            // Add force-visible class to ensure items are visible without JS
            element.classList.add('force-visible');
            
            // If JS works, we'll handle visibility with scroll
            if (isElementInViewport(element)) {
                element.classList.add('revealed');
                console.log(`Element already in viewport, revealed`);
            }
        });
        
        // Set up the scroll event listener
        const handleScroll = debounce(() => {
            animatedElements.forEach(element => {
                if (isElementInViewport(element)) {
                    element.classList.add('revealed');
                }
            });
        }, 200);
        
        // Listen for scroll
        window.addEventListener('scroll', handleScroll);
        
        // Trigger once for elements that are already visible
        handleScroll();
    }
    
    // Utility function - Check if element is in viewport
    function isElementInViewport(el) {
        if (!el) return false;
        
        try {
            const rect = el.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9 &&
                rect.bottom >= 0
            );
        } catch (error) {
            console.error('Error checking if element is in viewport:', error);
            return true; // If there's an error, show the element
        }
    }
    
    // Utility function - Debounce
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Specific handler for stall cards animation
    const stallCards = document.querySelectorAll('.stall-card');
    
    if (stallCards.length > 0) {
        console.log(`Found ${stallCards.length} stall cards for animation`);
        
        // Add force-visible class to ensure cards are visible without JS
        stallCards.forEach((card, index) => {
            card.classList.add('force-visible');
            
            // Staggered reveal with animation delay
            const delay = index * 150; // 150ms delay between each card
            card.style.transitionDelay = `${delay}ms`;
            
            // Remove transition delay after animation completes
            setTimeout(() => {
                card.style.transitionDelay = '';
            }, delay + 1000); // 1000ms is the transition duration
        });
    } else {
        console.log('No stall cards found on this page');
    }

    // Add scroll classes to elements
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        card.classList.add('scroll-animate', 'fade-up');
        // Add staggered delay for cascade effect
        card.style.transitionDelay = `${0.1 * index}s`;
    });

    document.querySelectorAll('.featured-card').forEach((card, index) => {
        card.classList.add('scroll-animate', 'fade-up');
        card.style.transitionDelay = `${0.1 * index}s`;
    });

    document.querySelectorAll('.section-header').forEach(header => {
        header.classList.add('scroll-animate', 'fade-up');
    });    // Header scroll effect
    const header = document.querySelector('header');
    const scrollThreshold = 50;

    function handleScroll() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    
    // Initialize on page load
    handleScroll();

    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll indicator
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const featuresSection = document.querySelector('#features');
            if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Mobile menu toggle
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const body = document.body;

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            body.classList.toggle('menu-open'); // Prevents background scrolling when menu is open
        });

        // Close menu when clicking on links
        const mobileNavLinks = mainNav.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });
    }

    // Image hover effects
    const hoverImages = document.querySelectorAll('.featured-image img, .gallery-item img');
    hoverImages.forEach(img => {
        img.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.5s ease';
        });
        
        img.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.classList.add('btn-ripple');
    });

    // Back to top button
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Handle image errors
    document.addEventListener("DOMContentLoaded", function() {
        // Find all images in featured items
        const featuredImages = document.querySelectorAll('.featured-image img');
        
        featuredImages.forEach(img => {
            img.onerror = function() {
                // Replace with placeholder image if loading fails
                this.src = '/images/brand/logo.png'; // Use the site logo as a fallback
                
                // Add a styling class to make it look like a placeholder
                this.classList.add('image-placeholder');
                
                // Update parent container to indicate missing image
                const container = this.closest('.featured-image');
                if (container) {
                    container.classList.add('missing-image');
                }
                
                console.log('Image failed to load, replaced with placeholder:', img.getAttribute('alt'));
            };
        });
        
        // Add style for placeholder images
        const style = document.createElement('style');
        style.textContent = `
            .image-placeholder {
                object-fit: contain !important;
                padding: 20px;
                background-color: #f8f9fa;
            }
            
            .missing-image {
                position: relative;
            }
            
            .missing-image::after {
                content: 'Image not available';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background-color: rgba(0,0,0,0.7);
                color: white;
                text-align: center;
                padding: 5px;
                font-size: 12px;
            }
        `;
        document.head.appendChild(style);
    });
    
    // Fix layout issues with featured items and buttons
    document.addEventListener("DOMContentLoaded", function() {
        // Fix featured card layout
        const fixFeaturedLayout = () => {
            const featuredSection = document.querySelector('.featured-section');
            if (!featuredSection) return;
            
            // Ensure proper layout for featured grid
            const featuredGrid = document.querySelector('.featured-grid');
            if (featuredGrid) {
                // Make sure the grid is properly displayed
                featuredGrid.style.display = 'grid';
                
                // Ensure consistent height for featured cards
                const cards = document.querySelectorAll('.featured-card');
                let maxHeight = 0;
                
                // First, reset heights to get natural height
                cards.forEach(card => {
                    card.style.height = 'auto';
                });
                
                // Find the tallest card
                cards.forEach(card => {
                    maxHeight = Math.max(maxHeight, card.offsetHeight);
                });
                
                // Set all cards to the same height
                if (maxHeight > 0) {
                    cards.forEach(card => {
                        card.style.height = `${maxHeight}px`;
                    });
                }
                
                // Fix images
                const images = document.querySelectorAll('.featured-image img');
                images.forEach(img => {
                    img.style.objectFit = 'cover';
                    img.style.width = '100%';
                    img.style.height = '100%';
                });
            }
            
            // Fix "View Full Menu" button placement
            const sectionCta = document.querySelector('.section-cta');
            if (sectionCta) {
                // Ensure the button is centered and visible
                sectionCta.style.textAlign = 'center';
                sectionCta.style.marginTop = '3rem';
                sectionCta.style.clear = 'both';
                sectionCta.style.display = 'block';
                
                // Style the button itself
                const button = sectionCta.querySelector('.btn');
                if (button) {
                    button.style.display = 'inline-block';
                    button.style.padding = '1rem 2.5rem';
                    button.style.backgroundColor = '#8E44AD'; // Secondary color
                    button.style.color = 'white';
                    button.style.fontWeight = '600';
                    button.style.borderRadius = '8px';
                    button.style.boxShadow = '0 4px 10px rgba(142, 68, 173, 0.3)';
                }
            }
        };
        
        // Run once on load
        fixFeaturedLayout();
        
        // Also run on window resize for responsive behavior
        window.addEventListener('resize', fixFeaturedLayout);
    });
    
    // Back to top button functionality
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        // Show button when user scrolls down
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        // Smooth scroll to top when clicked
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Fix for gallery images
    document.addEventListener('DOMContentLoaded', function() {
        const galleryCards = document.querySelectorAll('.gallery-card-home');
        
        if (galleryCards.length > 0) {
            console.log(`Found ${galleryCards.length} gallery cards`);
            
            galleryCards.forEach((card, index) => {
                const img = card.querySelector('img');
                
                if (img) {
                    // Handle image loading errors
                    img.addEventListener('error', function() {
                        this.src = '/images/brand/logo.png'; // Fallback image
                        this.alt = 'Image not available';
                        
                        const overlay = card.querySelector('.gallery-overlay-home');
                        if (overlay) {
                            const overlayContent = overlay.querySelector('.gallery-overlay-content');
                            if (overlayContent) {
                                overlayContent.innerHTML = `
                                    <h4>Image Unavailable</h4>
                                    <p>Please check the project details</p>
                                `;
                            }
                        }
                        
                        console.error(`Failed to load gallery image ${index + 1}`);
                    });
                    
                    // Force consistent sizing
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';
                } else {
                    console.error(`No image found in gallery card ${index + 1}`);
                }
                
                // Ensure card has proper dimensions
                card.style.height = '100%';
                card.style.aspectRatio = '1/1';
            });
        }
    });

    // Ensure gallery grid is visible and properly spaced
    document.addEventListener('DOMContentLoaded', function() {
        const galleryGrid = document.querySelector('.gallery-grid-home');
        
        if (galleryGrid) {
            galleryGrid.style.display = 'grid';
            galleryGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
            galleryGrid.style.gap = '1.5rem';
            console.log('Gallery grid styles applied');
        }
    });
    
    // Fix menu card sizing and alignment
    document.addEventListener('DOMContentLoaded', function() {
        // Function to equalize heights of menu cards in the same row
        function equalizeHeights() {
            if (window.innerWidth < 768) return; // Skip on mobile
            
            const menuGrid = document.querySelector('.menu-grid');
            if (!menuGrid) return;
            
            const cards = menuGrid.querySelectorAll('.menu-card');
            if (cards.length === 0) return;
            
            // Reset heights first
            cards.forEach(card => {
                card.style.height = 'auto';
                const content = card.querySelector('.menu-card-content');
                if (content) content.style.height = 'auto';
            });
            
            // Group cards by rows
            let rowsCount = 1;
            if (window.innerWidth > 991) {
                rowsCount = 3; // Desktop: 3 cards per row
            } else if (window.innerWidth > 768) {
                rowsCount = 2; // Tablet: 2 cards per row
            }
            
            // Process each row
            for (let i = 0; i < cards.length; i += rowsCount) {
                const rowCards = Array.from(cards).slice(i, i + rowsCount);
                
                // Find max height for card content in this row
                let maxContentHeight = 0;
                rowCards.forEach(card => {
                    const content = card.querySelector('.menu-card-content');
                    if (content) {
                        maxContentHeight = Math.max(maxContentHeight, content.scrollHeight);
                    }
                });
                
                // Apply height to all cards in this row
                rowCards.forEach(card => {
                    const content = card.querySelector('.menu-card-content');
                    if (content) {
                        content.style.height = maxContentHeight + 'px';
                    }
                });
            }
            
            console.log('Menu card heights equalized');
        }
        
        // Run equalization on load and resize
        window.addEventListener('load', equalizeHeights);
        window.addEventListener('resize', equalizeHeights);
    });
    
    // Gallery Page Functionality
    document.addEventListener('DOMContentLoaded', function() {
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!galleryGrid) return;

        const galleryItems = galleryGrid.querySelectorAll('.gallery-item');
        
        // Handle image loading
        galleryItems.forEach(item => {
            const img = item.querySelector('.gallery-item-image');
            const container = item.querySelector('.gallery-item-image-container');
            
            if (img) {
                // Add loading state
                container.classList.add('loading');
                
                // Handle successful image load
                img.addEventListener('load', () => {
                    container.classList.remove('loading');
                    container.classList.add('loaded');
                });
                
                // Handle image load error
                img.addEventListener('error', () => {
                    container.classList.remove('loading');
                    container.classList.add('error');
                    img.src = '/images/brand/logo.png'; // Fallback image
                    img.alt = 'Image not available';
                });
            }
        });

        // Lazy load images as they come into view
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            galleryItems.forEach(item => {
                const img = item.querySelector('.gallery-item-image');
                if (img && img.dataset.src) {
                    imageObserver.observe(img);
                }
            });
        }

        // Add scroll reveal animation
        function revealItems() {
            galleryItems.forEach((item, index) => {
                if (isElementInViewport(item)) {
                    setTimeout(() => {
                        item.classList.add('revealed');
                    }, index * 100); // Stagger the animation
                }
            });
        }

        // Initial check for visible items
        revealItems();

        // Check on scroll
        window.addEventListener('scroll', debounce(revealItems, 100));
    });

    // Product Detail Page functionality
    function initializeProductDetailPage() {
        console.log("Initializing product detail page");
        
        // Animate in the product detail container
        const productDetailContainer = document.querySelector('.product-detail-container');
        if (productDetailContainer) {
            setTimeout(() => {
                productDetailContainer.classList.add('revealed');
            }, 300);
        }

        // Image zoom functionality
        const productImage = document.querySelector('.product-image-container img');
        const zoomIcon = document.querySelector('.zoom-icon');
        
        if (productImage && zoomIcon) {
            zoomIcon.addEventListener('click', () => {
                // Create a modal with the full-size image
                const modalOverlay = document.createElement('div');
                modalOverlay.className = 'modal-overlay';
                
                const modalContent = document.createElement('div');
                modalContent.className = 'modal-content';
                
                const fullSizeImage = document.createElement('img');
                fullSizeImage.src = productImage.src;
                fullSizeImage.alt = productImage.alt;
                
                const closeButton = document.createElement('div');
                closeButton.className = 'modal-close';
                closeButton.innerHTML = '<i class="fas fa-times"></i>';
                
                modalContent.appendChild(fullSizeImage);
                modalContent.appendChild(closeButton);
                modalOverlay.appendChild(modalContent);
                document.body.appendChild(modalOverlay);
                
                // Prevent scrolling when modal is open
                document.body.style.overflow = 'hidden';
                
                // Fade in modal
                setTimeout(() => {
                    modalOverlay.style.opacity = '1';
                }, 10);
                
                // Close modal on click outside or on close button
                modalOverlay.addEventListener('click', (e) => {
                    if (e.target === modalOverlay || e.target === closeButton || e.target.closest('.modal-close')) {
                        modalOverlay.style.opacity = '0';
                        setTimeout(() => {
                            document.body.removeChild(modalOverlay);
                            document.body.style.overflow = '';
                        }, 300);
                    }
                });
            });
        }
    }

    // Gallery/Project Detail Page functionality
    function initializeGalleryDetailPage() {
        console.log("Initializing gallery detail page");
        
        // Animate in the gallery detail container
        const galleryDetailContainer = document.querySelector('.gallery-detail-container');
        if (galleryDetailContainer) {
            setTimeout(() => {
                galleryDetailContainer.classList.add('revealed');
            }, 300);
        }

        // Image zoom functionality
        const projectImage = document.querySelector('.project-image-container img');
        const zoomIcon = document.querySelector('.project-image-container .zoom-icon');
        
        if (projectImage && zoomIcon) {
            zoomIcon.addEventListener('click', () => {
                // Create a modal with the full-size image
                const modalOverlay = document.createElement('div');
                modalOverlay.className = 'modal-overlay';
                
                const modalContent = document.createElement('div');
                modalContent.className = 'modal-content';
                
                const fullSizeImage = document.createElement('img');
                fullSizeImage.src = projectImage.src;
                fullSizeImage.alt = projectImage.alt;
                
                const closeButton = document.createElement('div');
                closeButton.className = 'modal-close';
                closeButton.innerHTML = '<i class="fas fa-times"></i>';
                
                modalContent.appendChild(fullSizeImage);
                modalContent.appendChild(closeButton);
                modalOverlay.appendChild(modalContent);
                document.body.appendChild(modalOverlay);
                
                // Prevent scrolling when modal is open
                document.body.style.overflow = 'hidden';
                
                // Fade in modal
                setTimeout(() => {
                    modalOverlay.style.opacity = '1';
                }, 10);
                
                // Close modal on click outside or on close button
                modalOverlay.addEventListener('click', (e) => {
                    if (e.target === modalOverlay || e.target === closeButton || e.target.closest('.modal-close')) {
                        modalOverlay.style.opacity = '0';
                        setTimeout(() => {
                            document.body.removeChild(modalOverlay);
                            document.body.style.overflow = '';
                        }, 300);
                    }
                });
            });
        }
    }

    // Call the initialization function when the DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize product detail page if we're on that page
        if (document.querySelector('.product-detail-container')) {
            initializeProductDetailPage();
        }
        
        // Initialize gallery detail page if we're on that page
        if (document.querySelector('.gallery-detail-container')) {
            initializeGalleryDetailPage();
        }
    });
});

// Add JS detection for progressive enhancement
document.addEventListener('DOMContentLoaded', function() {
    // Add js-enabled class to body when JavaScript is available
    document.documentElement.classList.add('js-enabled');
    
    // Force reveal gallery items if they're not visible after a delay
    setTimeout(function() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (galleryItems.length > 0) {
            console.log('Force revealing gallery items');
            galleryItems.forEach(item => {
                item.classList.add('revealed');
            });
        }
    }, 500); // Half a second delay
});

// Fix for gallery page - force items to be visible
document.addEventListener('DOMContentLoaded', function() {
    // Target specifically the main gallery page
    const galleryPage = document.querySelector('.gallery-section');
    if (!galleryPage) return;
    
    console.log('Gallery page detected, forcing visibility of items');
    
    // Get all gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length === 0) {
        console.log('No gallery items found');
        return;
    }
    
    console.log(`Found ${galleryItems.length} gallery items, making them visible`);
    
    // Force all items to be visible immediately
    galleryItems.forEach(item => {
        // Force visibility with inline styles (highest priority)
        item.style.opacity = '1 !important';
        item.style.transform = 'translateY(0) !important';
        item.style.visibility = 'visible !important';
        item.classList.add('revealed');
        
        // Add additional class for visibility
        item.classList.add('force-visible');
    });
});

// Force gallery detail container to be visible (fallback for gallery page)
document.addEventListener('DOMContentLoaded', function() {
    const galleryDetailContainer = document.querySelector('.gallery-detail-container');
    if (galleryDetailContainer) {
        console.log('Gallery detail page detected, forcing visibility');
        
        // Force it to be visible after a small delay
        setTimeout(() => {
            galleryDetailContainer.classList.add('revealed');
            galleryDetailContainer.classList.add('force-visible');
        }, 100);
    }
});

// Utility functions for animations
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}
