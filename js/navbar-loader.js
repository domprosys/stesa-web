// Load shared head component
async function loadHead() {
    try {
        const response = await fetch('components/head.html');
        const headHTML = await response.text();
        
        // Find head placeholder or insert into head
        const headPlaceholder = document.getElementById('head-placeholder');
        if (headPlaceholder) {
            headPlaceholder.outerHTML = headHTML;
        }
        
        return true;
    } catch (error) {
        console.error('Failed to load head component:', error);
        return false;
    }
}

// Navbar loader utility
async function loadNavbar() {
    try {
        const response = await fetch('components/navbar.html');
        const navbarHTML = await response.text();
        
        // Find navbar placeholder or insert at beginning of body
        const navbarPlaceholder = document.getElementById('navbar-placeholder');
        if (navbarPlaceholder) {
            navbarPlaceholder.innerHTML = navbarHTML;
        } else {
            // Insert at beginning of body if no placeholder exists
            document.body.insertAdjacentHTML('afterbegin', navbarHTML);
        }
        
        // Set active link based on current page
        setActiveNavLink();
        
        // Initialize language system after navbar is loaded
        initializeLanguageSystem();
        
        // Initialize mobile menu after navbar is loaded
        initializeMobileMenu();
        
        return true;
    } catch (error) {
        console.error('Failed to load navbar:', error);
        return false;
    }
}

// Set active navigation link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Initialize mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navbar = document.querySelector('.navbar');
    
    if (mobileMenuToggle && navbar) {
        mobileMenuToggle.addEventListener('click', function() {
            navbar.classList.toggle('mobile-menu-expanded');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (navbar.classList.contains('mobile-menu-expanded') && 
                !navbar.contains(event.target)) {
                navbar.classList.remove('mobile-menu-expanded');
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navbar.classList.remove('mobile-menu-expanded');
            });
        });
    }
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    await loadHead();
    await loadNavbar();
});