// Basic JavaScript for Yayi's Confectionery (e.g., animations, interactions, data loading)

// Helper function to fetch JSON data
async function fetchJSON(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${path}:`, error);
        return null;
    }
}

// Data object to store all loaded data
const yayiData = {
    menu: null,
    projects: null,
    stalls: null,
    config: null
};

// Function to initialize the current page based on URL
function initCurrentPage() {
    const currentPath = window.location.pathname;
    
    // Home page
    if (currentPath === '/' || currentPath === '/index.html') {
        console.log('Initializing home page');
        // No specific initialization needed for home page
    }
    
    // Menu page
    else if (currentPath === '/menu.html') {
        console.log('Initializing menu page');
        renderMenuItems();
    }
    
    // Cake detail page
    else if (currentPath.includes('/cake-detail.html')) {
        console.log('Initializing cake detail page');
        const urlParams = new URLSearchParams(window.location.search);
        const cakeId = urlParams.get('id');
        if (cakeId) {
            renderCakeDetail(cakeId);
        } else {
            console.error('No cake ID provided in URL');
            window.location.href = '/menu.html'; // Redirect if no ID
        }
    }
    
    // Gallery page
    else if (currentPath === '/gallery.html') {
        console.log('Initializing gallery page');
        renderProjectsGallery();
    }
    
    // Stalls page
    else if (currentPath === '/stalls.html') {
        console.log('Initializing stalls page');
        renderUpcomingStalls();
    }
    
    // Admin pages (could be implemented in a separate JS file)
    else if (currentPath.includes('/admin')) {
        console.log('Initializing admin page');
        initAdminPage();
    }
}

// Function to render menu items on the menu page
function renderMenuItems() {
    const menuGrid = document.querySelector('.menu-grid');
    if (!menuGrid || !yayiData.menu) return;
    
    menuGrid.innerHTML = '';
    
    yayiData.menu.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item scroll-animate';
        menuItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p class="price">$${(item.price/100).toFixed(2)}</p>
            <p>${item.description.substring(0, 100)}...</p>
            <div class="menu-item-actions">
                <a href="/cake-detail.html?id=${item.id}" class="btn-details">View Details</a>
                ${yayiData.config?.whatsappNumber ? 
                    `<a href="https://wa.me/${yayiData.config.whatsappNumber}?text=Hi, I'm interested in ordering the ${encodeURIComponent(item.name)} for $${(item.price/100).toFixed(2)}." 
                     target="_blank" class="btn-whatsapp-order">Order via WhatsApp</a>` : ''}
            </div>
        `;
        menuGrid.appendChild(menuItem);
    });
}

// Function to render cake details on the cake detail page
function renderCakeDetail(cakeId) {
    const detailContainer = document.querySelector('.cake-detail-container');
    if (!detailContainer || !yayiData.menu) return;
    
    const cake = yayiData.menu.find(item => item.id === cakeId);
    if (!cake) {
        detailContainer.innerHTML = '<p>Cake not found</p>';
        return;
    }
    
    const ingredientsList = cake.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('');
    
    detailContainer.innerHTML = `
        <div class="cake-detail-image">
            <img src="${cake.image}" alt="${cake.name}">
        </div>
        <div class="cake-detail-info">
            <h1>${cake.name}</h1>
            <p class="price">$${(cake.price/100).toFixed(2)}</p>
            <p class="description">${cake.description}</p>
            <h4>Ingredients:</h4>
            <ul class="ingredients-list">
                ${ingredientsList}
            </ul>
            ${yayiData.config?.whatsappNumber ? 
                `<a href="https://wa.me/${yayiData.config.whatsappNumber}?text=Hi, I'm interested in ordering the ${encodeURIComponent(cake.name)} for $${(cake.price/100).toFixed(2)}." 
                target="_blank" class="btn-whatsapp-order">Order via WhatsApp</a>` : ''}
        </div>
    `;
}

// Function to render projects on the gallery page
function renderProjectsGallery() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid || !yayiData.projects) return;
    
    galleryGrid.innerHTML = '';
    
    yayiData.projects.forEach(project => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item scroll-animate';
        galleryItem.innerHTML = `
            <img src="${project.image}" alt="${project.title}">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
        `;
        galleryGrid.appendChild(galleryItem);
    });
}

// Function to render upcoming stalls on the stalls page
function renderUpcomingStalls() {
    const stallsList = document.querySelector('.stalls-list');
    if (!stallsList || !yayiData.stalls) return;
    
    stallsList.innerHTML = '';
    
    yayiData.stalls.forEach(stall => {
        const stallCard = document.createElement('div');
        stallCard.className = 'stall-card scroll-animate';
        stallCard.innerHTML = `
            <h3>${stall.eventName}</h3>
            <p class="stall-date-time">${stall.dateTime}</p>
            <p class="stall-location">${stall.location}</p>
            <p>${stall.description}</p>
        `;
        stallsList.appendChild(stallCard);
    });
}

// Simple admin page initialization
function initAdminPage() {
    console.log('Admin functionality would be implemented in a real application');
    // Admin functionality would typically require backend authentication and server interaction
    // For static HTML, we could just show a message or mock UI
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Yayi's Confectionery website loaded.");

    // Load all data
    try {
        yayiData.menu = await fetchJSON('/data/menu.json');
        yayiData.projects = await fetchJSON('/data/projects.json');
        yayiData.stalls = await fetchJSON('/data/stalls.json');
        yayiData.config = await fetchJSON('/data/config.json');
        
        // Initialize page based on current URL
        initCurrentPage();
    } catch (error) {
        console.error("Error initializing data:", error);
    }

    const animatedElements = document.querySelectorAll('.scroll-animate');

    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target); // Optional: stop observing after animation
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Smooth scroll for navigation links (optional, but good for UX)
    const navLinks = document.querySelectorAll('header nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Mobile menu toggle (if you add a mobile menu button)
    // const menuToggle = document.getElementById('menu-toggle');
    // const nav = document.querySelector('header nav ul');
    // if (menuToggle && nav) {
    //     menuToggle.addEventListener('click', () => {
    //         nav.classList.toggle('active');
    //     });
    // }
});
