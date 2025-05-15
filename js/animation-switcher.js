// Animation Switcher for STESA
// Allows switching between different background animations

const AnimationSwitcher = {
    currentAnimation: 'simple', // Default animation
    animations: {
        'simple': {
            scriptId: 'simple-background-script',
            scriptSrc: 'simple-background.js',
            toggleFunction: 'toggleBackgroundAnimation'
        },
        'flat': {
            scriptId: 'flat-network-script',
            scriptSrc: 'flat-network.js',
            toggleFunction: 'toggleFlatNetwork'
        }
    },
    
    init: function() {
        console.log('Initializing Animation Switcher');
        
        // Create animation switcher UI
        this.createSwitcherUI();
        
        // Load default animation
        this.loadAnimation(this.currentAnimation);
    },
    
    createSwitcherUI: function() {
        // Create container for animation controls
        const container = document.createElement('div');
        container.id = 'animation-controls';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.zIndex = '100';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        
        // Create toggle button
        const toggleButton = document.createElement('button');
        toggleButton.id = 'toggle-animation';
        toggleButton.textContent = 'Hide Background';
        toggleButton.style.padding = '10px';
        toggleButton.style.background = 'rgba(255,255,255,0.7)';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '5px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.fontFamily = "'Exo 2', sans-serif";
        
        // Create style switcher
        const styleSwitcher = document.createElement('select');
        styleSwitcher.id = 'animation-style';
        styleSwitcher.style.padding = '10px';
        styleSwitcher.style.background = 'rgba(255,255,255,0.7)';
        styleSwitcher.style.border = 'none';
        styleSwitcher.style.borderRadius = '5px';
        styleSwitcher.style.cursor = 'pointer';
        styleSwitcher.style.fontFamily = "'Exo 2', sans-serif";
        
        // Add options
        const option1 = document.createElement('option');
        option1.value = 'simple';
        option1.textContent = '3D Network';
        
        const option2 = document.createElement('option');
        option2.value = 'flat';
        option2.textContent = '2D Network';
        
        styleSwitcher.appendChild(option1);
        styleSwitcher.appendChild(option2);
        
        // Add event listeners
        toggleButton.addEventListener('click', this.toggleAnimation.bind(this));
        styleSwitcher.addEventListener('change', (e) => {
            this.switchAnimation(e.target.value);
        });
        
        // Add elements to container
        container.appendChild(styleSwitcher);
        container.appendChild(toggleButton);
        
        // Add container to document
        document.body.appendChild(container);
    },
    
    loadAnimation: function(animationName) {
        const animation = this.animations[animationName];
        
        if (!animation) {
            console.error('Animation not found:', animationName);
            return;
        }
        
        // Check if script already exists
        let script = document.getElementById(animation.scriptId);
        
        if (!script) {
            // Remove any existing animation scripts
            Object.values(this.animations).forEach(anim => {
                const existingScript = document.getElementById(anim.scriptId);
                if (existingScript) {
                    existingScript.remove();
                }
            });
            
            // Create new script element
            script = document.createElement('script');
            script.id = animation.scriptId;
            script.src = animation.scriptSrc;
            script.async = true;
            
            // Add to document
            document.body.appendChild(script);
            
            console.log('Loaded animation script:', animationName);
        }
        
        this.currentAnimation = animationName;
    },
    
    switchAnimation: function(animationName) {
        // Stop current animation if it's running
        this.stopCurrentAnimation();
        
        // Load and start new animation
        this.loadAnimation(animationName);
        
        // Update toggle button text
        const toggleButton = document.getElementById('toggle-animation');
        if (toggleButton) {
            toggleButton.textContent = 'Hide Background';
        }
    },
    
    stopCurrentAnimation: function() {
        const animation = this.animations[this.currentAnimation];
        
        if (animation && window[animation.toggleFunction]) {
            // If animation is active, toggle it off
            const isActive = window[animation.toggleFunction]();
            if (isActive) {
                window[animation.toggleFunction]();
            }
        }
    },
    
    toggleAnimation: function() {
        const animation = this.animations[this.currentAnimation];
        const toggleButton = document.getElementById('toggle-animation');
        
        if (animation && window[animation.toggleFunction]) {
            const isActive = window[animation.toggleFunction]();
            if (toggleButton) {
                toggleButton.textContent = isActive ? 'Hide Background' : 'Show Background';
            }
        }
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        AnimationSwitcher.init();
    }, 200);
});
