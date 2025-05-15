// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navbar = document.querySelector('.navbar');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navbar.classList.toggle('mobile-menu-expanded');
        });
    }
    
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
});
