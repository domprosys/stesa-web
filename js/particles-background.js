// New particles background animation inspired by the reference image
// Features smooth-moving particles with connecting lines on a deep blue background

document.addEventListener('DOMContentLoaded', function() {
    // Initialize canvas and context
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Get canvas container and append canvas
    const container = document.getElementById('canvas-container');
    if (!container) return;
    
    container.appendChild(canvas);
    
    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Deep blue background color (similar to the reference image)
    const backgroundColor = '#030b35';
    
    // Particle settings
    const particleCount = 100;
    const particles = [];
    const connectionDistance = 150; // Maximum distance to draw connections between particles
    const minSize = 2;
    const maxSize = 6;
    
    // Color palette based on STESA colors but with more blue tones for the space theme
    const colorOptions = [
        { r: 0, g: 102, b: 204, a: 0.8 },  // Blue (#0066cc)
        { r: 204, g: 0, b: 204, a: 0.7 },  // Magenta (#cc00cc)
        { r: 0, g: 153, b: 0, a: 0.6 },    // Green (#009900)
        { r: 204, g: 153, b: 0, a: 0.7 },  // Gold (#cc9900)
        { r: 70, g: 130, b: 255, a: 0.8 }, // Light blue
        { r: 0, g: 50, b: 150, a: 0.7 }    // Dark blue
    ];
    
    // Line settings
    const lineWidth = 0.5;
    const lineOpacityDivisor = 3; // Higher = more transparent lines
    
    // Mouse interaction
    let mouse = {
        x: null,
        y: null,
        radius: 100
    };
    
    // Particle class
    class Particle {
        constructor() {
            // Random position
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            
            // Random velocity
            this.vx = Math.random() * 0.5 - 0.25;
            this.vy = Math.random() * 0.5 - 0.25;
            
            // Random size
            this.size = Math.random() * (maxSize - minSize) + minSize;
            
            // Random color from palette
            this.color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
            
            // Random shape (0 = circle, 1 = square, 2 = triangle, 3 = diamond)
            this.shape = Math.floor(Math.random() * 4);
        }
        
        // Update particle position
        update() {
            // Move particle
            this.x += this.vx;
            this.y += this.vy;
            
            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) {
                this.vx = -this.vx;
            }
            
            if (this.y < 0 || this.y > canvas.height) {
                this.vy = -this.vy;
            }
            
            // Mouse interaction - particles move away from mouse
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const angle = Math.atan2(dy, dx);
                    const pushFactor = (mouse.radius - distance) / mouse.radius;
                    
                    this.x -= Math.cos(angle) * pushFactor;
                    this.y -= Math.sin(angle) * pushFactor;
                }
            }
        }
        
        // Draw particle
        draw() {
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
            ctx.beginPath();
            
            // Draw different shapes based on the shape property
            switch(this.shape) {
                // Circle
                case 0:
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    break;
                
                // Square
                case 1:
                    ctx.rect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
                    break;
                
                // Triangle
                case 2:
                    ctx.moveTo(this.x, this.y - this.size);
                    ctx.lineTo(this.x + this.size, this.y + this.size);
                    ctx.lineTo(this.x - this.size, this.y + this.size);
                    break;
                
                // Diamond
                case 3:
                    ctx.moveTo(this.x, this.y - this.size);
                    ctx.lineTo(this.x + this.size, this.y);
                    ctx.lineTo(this.x, this.y + this.size);
                    ctx.lineTo(this.x - this.size, this.y);
                    break;
            }
            
            ctx.closePath();
            ctx.fill();
        }
    }
    
    // Initialize particles
    function init() {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Draw connections between particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    // Calculate opacity based on distance (closer = more opaque)
                    const opacity = (1 - distance / connectionDistance) / lineOpacityDivisor;
                    
                    // Average the colors of the two particles
                    const color1 = particles[i].color;
                    const color2 = particles[j].color;
                    
                    const r = Math.floor((color1.r + color2.r) / 2);
                    const g = Math.floor((color1.g + color2.g) / 2);
                    const b = Math.floor((color1.b + color2.b) / 2);
                    
                    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
                    ctx.lineWidth = lineWidth;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        // Clear canvas with semi-transparent background for trail effect
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        
        // Draw connections between particles
        drawConnections();
        
        // Request next frame
        requestAnimationFrame(animate);
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    
    // Track mouse position
    window.addEventListener('mousemove', function(e) {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    
    // Mouse leaves window
    window.addEventListener('mouseout', function() {
        mouse.x = null;
        mouse.y = null;
    });
    
    // Initialize and start animation
    init();
    animate();
});
