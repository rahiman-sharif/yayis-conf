// Basic JavaScript for Yayi's Confectionery (e.g., animations, interactions)

document.addEventListener('DOMContentLoaded', () => {
    console.log("Yayi's Confectionery website loaded.");

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
