// Enhanced glitch effect for the hero title
document.addEventListener('DOMContentLoaded', function() {
    const title = document.querySelector('.hero h1');
    if (!title) return;
    
    const originalText = title.textContent;
    const glitchChars = '!<>-_\/@#$%^&*()=+[]{}~?|';
    
    // Create a container for the glitch effect
    const container = document.createElement('div');
    container.className = 'glitch-container';
    container.style.position = 'relative';
    container.style.display = 'inline-block';
    
    // Replace the title with the container
    title.parentNode.replaceChild(container, title);
    
    // Create multiple layers for the glitch effect
    const layers = [];
    const layerCount = 5;
    
    for (let i = 0; i < layerCount; i++) {
        const layer = document.createElement('h1');
        layer.textContent = originalText;
        layer.style.margin = '0';
        layer.style.position = i === 0 ? 'relative' : 'absolute';
        layer.style.top = '0';
        layer.style.left = '0';
        layer.style.width = '100%';
        layer.style.padding = '15px 30px';
        layer.style.borderRadius = '30px';
        layer.style.backgroundColor = i === 0 ? 'rgba(255, 255, 255, 0.7)' : 'transparent';
        layer.style.color = '#333';
        layer.style.fontWeight = '700';
        layer.style.fontSize = '4rem';
        layer.style.letterSpacing = '10px';
        layer.style.boxShadow = i === 0 ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none';
        layer.style.zIndex = layerCount - i;
        
        if (i > 0) {
            layer.classList.add('glitch-layer');
            layer.style.opacity = '0';
            layer.style.color = i === 1 ? '#0066cc' : i === 2 ? '#cc00cc' : i === 3 ? '#009900' : '#cc9900';
        } else {
            layer.classList.add('glitch-base');
        }
        
        container.appendChild(layer);
        layers.push(layer);
    }
    
    // Add CSS for the glitch layers
    const style = document.createElement('style');
    style.textContent = `
        @keyframes glitch-anim-1 {
            0% { opacity: 1; transform: translate3d(10px, 0, 0); clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%); }
            2% { clip-path: polygon(0 15%, 100% 15%, 100% 15%, 0 15%); }
            4% { clip-path: polygon(0 10%, 100% 10%, 100% 20%, 0 20%); }
            6% { clip-path: polygon(0 1%, 100% 1%, 100% 2%, 0 2%); }
            8% { clip-path: polygon(0 33%, 100% 33%, 100% 33%, 0 33%); }
            10% { clip-path: polygon(0 44%, 100% 44%, 100% 44%, 0 44%); }
            12% { clip-path: polygon(0 50%, 100% 50%, 100% 20%, 0 20%); }
            14% { opacity: 1; transform: translate3d(7px, 0, 0); }
            15% { opacity: 0; transform: translate3d(0, 0, 0); }
            100% { opacity: 0; }
        }

        @keyframes glitch-anim-2 {
            0% { opacity: 1; transform: translate3d(-10px, 0, 0); clip-path: polygon(0 25%, 100% 25%, 100% 30%, 0 30%); }
            3% { clip-path: polygon(0 3%, 100% 3%, 100% 3%, 0 3%); }
            5% { clip-path: polygon(0 5%, 100% 5%, 100% 20%, 0 20%); }
            7% { clip-path: polygon(0 20%, 100% 20%, 100% 20%, 0 20%); }
            9% { clip-path: polygon(0 40%, 100% 40%, 100% 40%, 0 40%); }
            11% { clip-path: polygon(0 52%, 100% 52%, 100% 59%, 0 59%); }
            13% { clip-path: polygon(0 60%, 100% 60%, 100% 60%, 0 60%); }
            15% { opacity: 1; transform: translate3d(-5px, 0, 0); }
            16% { opacity: 0; transform: translate3d(0, 0, 0); }
            100% { opacity: 0; }
        }

        @keyframes glitch-anim-3 {
            0% { opacity: 1; transform: translate3d(0, 5px, 0); clip-path: polygon(0 78%, 100% 78%, 100% 78%, 0 78%); }
            5% { clip-path: polygon(0 63%, 100% 63%, 100% 63%, 0 63%); }
            10% { clip-path: polygon(0 73%, 100% 73%, 100% 73%, 0 73%); }
            15% { opacity: 1; }
            16% { opacity: 0; }
            100% { opacity: 0; }
        }

        @keyframes glitch-anim-4 {
            0% { opacity: 1; transform: translate3d(0, -5px, 0); clip-path: polygon(0 95%, 100% 95%, 100% 95%, 0 95%); }
            5% { clip-path: polygon(0 83%, 100% 83%, 100% 83%, 0 83%); }
            10% { clip-path: polygon(0 98%, 100% 98%, 100% 98%, 0 98%); }
            15% { opacity: 1; }
            16% { opacity: 0; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Function to apply glitch effect
    function applyGlitch() {
        // Base layer (no glitch)
        const baseLayer = layers[0];
        baseLayer.style.transform = 'none';
        
        // Glitch layers
        for (let i = 1; i < layers.length; i++) {
            const layer = layers[i];
            
            // Random glitch effect
            if (Math.random() < 0.8) {
                // Apply glitch animation
                layer.style.opacity = '1';
                layer.style.animation = `glitch-anim-${i} ${0.2 + Math.random() * 0.3}s forwards`;
                
                // Random text distortion
                if (Math.random() < 0.3) {
                    let glitchedText = '';
                    for (let j = 0; j < originalText.length; j++) {
                        if (Math.random() < 0.2) {
                            glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                        } else {
                            glitchedText += originalText[j];
                        }
                    }
                    layer.textContent = glitchedText;
                } else {
                    layer.textContent = originalText;
                }
                
                // Random offset
                const offsetX = (Math.random() - 0.5) * 10;
                const offsetY = (Math.random() - 0.5) * 5;
                layer.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            } else {
                layer.style.opacity = '0';
                layer.style.animation = 'none';
            }
        }
    }
    
    // Apply glitch effect periodically
    function startGlitching() {
        // Initial glitch
        applyGlitch();
        
        // Random interval for glitching
        const glitchInterval = setInterval(() => {
            if (Math.random() < 0.7) { // 70% chance to glitch
                applyGlitch();
                
                // Add glitching class to base layer for additional effect
                layers[0].classList.add('glitching');
                
                // Remove glitching class after a short delay
                setTimeout(() => {
                    layers[0].classList.remove('glitching');
                }, 150);
            }
        }, 2000 + Math.random() * 4000); // Random interval between 2-6 seconds
        
        return glitchInterval;
    }
    
    // Start the glitch effect
    startGlitching();
});
