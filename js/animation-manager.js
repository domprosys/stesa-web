// Animation Manager for STESA
// ANIMATIONS DISABLED

const animationManager = {
    activeAnimation: null,
    currentBox: null,
    animations: {
        society: null,
        technology: null,
        sports: null,
        arts: null
    },
    animationsLoaded: false,
    
    init: function() {
        console.log('Animation manager initialized (animations disabled)');
        // Animations are disabled, so we don't create a container or load any scripts
    },
    
    loadAnimations: function() {
        // Animations are disabled, so we don't load any scripts
        console.log('Animation loading skipped (animations disabled)');
    },
    
    setupEventListeners: function() {
        // No animation-specific event listeners needed
    },
    
    handleBoxClick: function(boxId) {
        // Animations are disabled, so we don't do anything when boxes are clicked
        console.log(`Box clicked: ${boxId} (animations disabled)`);
    },
    
    handleCloseClick: function() {
        // Animations are disabled, so we don't do anything when close buttons are clicked
        console.log('Close button clicked (animations disabled)');
    },
    
    stopCurrentAnimation: function() {
        // Animations are disabled, so there's nothing to stop
    },
    
    toggleAnimation: function() {
        // Animations are disabled, so there's nothing to toggle
        return false;
    }
};

// Make animation manager globally accessible
window.animationManager = animationManager;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        animationManager.init();
    }, 200);
});

// Export toggle function
window.toggleAnimation = function() {
    return animationManager.toggleAnimation();
};
