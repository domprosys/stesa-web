// STESA Background Animation Component
class BackgroundAnimation {
    constructor(containerId = 'canvas-container') {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particleSystem = null;
        this.lines = null;
        this.animationId = null;
        this.isActive = false;
        
        // Variables for animation
        this.particleCount = 150;
        this.time = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.hoveredParticleIndex = -1;
        
        // Create container if it doesn't exist
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = this.containerId;
            this.container.style.position = 'fixed';
            this.container.style.top = '0';
            this.container.style.left = '0';
            this.container.style.width = '100%';
            this.container.style.height = '100%';
            this.container.style.zIndex = '-1';
            document.body.appendChild(this.container);
        }
        
        // Bind methods
        this.animate = this.animate.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }
    
    init() {
        if (this.isActive) return;
        
        console.log('Initializing animation in BackgroundAnimation.init()');
        
        try {
            // Particle/Line Animation Scene
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setClearColor(0xf5f5f7, 0); // Light background color to match CSS
            this.container.appendChild(this.renderer.domElement);
            
            console.log('Created renderer and added to container');
            
            // Create particles
            const particles = new THREE.BufferGeometry();
            const positions = new Float32Array(this.particleCount * 3);
            const colors = new Float32Array(this.particleCount * 3);
            const sizes = new Float32Array(this.particleCount);
            this.originalPositions = new Float32Array(this.particleCount * 3);
            const shapes = new Float32Array(this.particleCount); // 0 = circle, 1 = square, 2 = triangle, 3 = diamond
            
            // Color palette
            const colorOptions = [
                new THREE.Color(0x0066cc), // Blue
                new THREE.Color(0xcc00cc), // Magenta
                new THREE.Color(0x009900), // Green
                new THREE.Color(0xcc9900)  // Gold
            ];
            
            for (let i = 0; i < this.particleCount; i++) {
                const i3 = i * 3;
                
                // Random position in a wider sphere
                const radius = 20 + Math.random() * 30; // Spread particles out more
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI * 2; // Full sphere distribution
                
                positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
                positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                positions[i3 + 2] = radius * Math.cos(phi);
                
                // Store original positions for wave effect
                this.originalPositions[i3] = positions[i3];
                this.originalPositions[i3 + 1] = positions[i3 + 1];
                this.originalPositions[i3 + 2] = positions[i3 + 2];
                
                // Random color from options
                const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
                colors[i3] = color.r;
                colors[i3 + 1] = color.g;
                colors[i3 + 2] = color.b;
                
                // Random size
                sizes[i] = 0.5 + Math.random() * 1.0;
                
                // Random shape
                shapes[i] = Math.floor(Math.random() * 4);
            }
            
            particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
            particles.setAttribute('shape', new THREE.BufferAttribute(shapes, 1));
            
            console.log('Created particles');
            
            // Create particle material with custom shader
            const particlesMaterial = new THREE.ShaderMaterial({
                vertexShader: `
                    attribute float size;
                    attribute float shape;
                    varying vec3 vColor;
                    varying float vShape;
                    void main() {
                        vColor = color;
                        vShape = shape;
                        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                        gl_PointSize = size * (300.0 / -mvPosition.z);
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `,
                fragmentShader: `
                    varying vec3 vColor;
                    varying float vShape;
                    void main() {
                        // Convert from -1,1 to 0,1
                        vec2 uv = gl_PointCoord * 2.0 - 1.0;
                        float r = 0.0;
                        
                        // Circle
                        if (vShape < 0.5) {
                            r = length(uv);
                            if (r > 1.0) discard;
                        }
                        // Square
                        else if (vShape < 1.5) {
                            if (abs(uv.x) > 0.8 || abs(uv.y) > 0.8) discard;
                        }
                        // Triangle
                        else if (vShape < 2.5) {
                            if (uv.y > 0.8 || uv.y < -0.8 * uv.x - 0.3 || uv.y < 0.8 * uv.x - 0.3) discard;
                        }
                        // Diamond
                        else {
                            if (abs(uv.x) + abs(uv.y) > 1.0) discard;
                        }
                        
                        gl_FragColor = vec4(vColor, 1.0);
                    }
                `,
                vertexColors: true,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });
            
            this.particleSystem = new THREE.Points(particles, particlesMaterial);
            this.scene.add(this.particleSystem);
            
            console.log('Added particle system to scene');
            
            // Now create connections after particle system is created
            this.updateConnections();
            
            this.camera.position.z = 50;
            
            // Setup raycaster for hover effects
            this.raycaster = new THREE.Raycaster();
            this.mouse = new THREE.Vector2();
            
            // Add event listeners
            window.addEventListener('resize', this.handleResize);
            document.addEventListener('mousemove', this.handleMouseMove);
            
            // Start animation
            this.isActive = true;
            this.animate();
            console.log('Animation started');
        } catch (error) {
            console.error('Error initializing background animation:', error);
        }
    }
    
    updateConnections() {
        if (!this.particleSystem) return;
        
        // Create a lines material
        const linesMaterial = new THREE.LineBasicMaterial({ 
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const positions = this.particleSystem.geometry.attributes.position.array;
        const colors = this.particleSystem.geometry.attributes.color.array;
        
        // Recreate connections
        if (this.lines) {
            this.scene.remove(this.lines);
        }
        
        const connections = new THREE.BufferGeometry();
        const linePositions = [];
        const lineColors = [];
        
        // Maximum distance for creating a connection
        const maxDistance = 15;
        
        for (let i = 0; i < this.particleCount; i++) {
            const x1 = positions[i * 3];
            const y1 = positions[i * 3 + 1];
            const z1 = positions[i * 3 + 2];
            
            for (let j = i + 1; j < this.particleCount; j++) {
                const x2 = positions[j * 3];
                const y2 = positions[j * 3 + 1];
                const z2 = positions[j * 3 + 2];
                
                // Calculate distance between particles
                const dx = x2 - x1;
                const dy = y2 - y1;
                const dz = z2 - z1;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                // If particles are close enough, create a connection
                if (distance < maxDistance) {
                    // Add line vertices
                    linePositions.push(x1, y1, z1);
                    linePositions.push(x2, y2, z2);
                    
                    // Add line colors (average of the two particles)
                    const r1 = colors[i * 3];
                    const g1 = colors[i * 3 + 1];
                    const b1 = colors[i * 3 + 2];
                    
                    const r2 = colors[j * 3];
                    const g2 = colors[j * 3 + 1];
                    const b2 = colors[j * 3 + 2];
                    
                    // Fade the line based on distance
                    const opacity = 1 - (distance / maxDistance);
                    
                    lineColors.push(r1, g1, b1);
                    lineColors.push(r2, g2, b2);
                }
            }
        }
        
        connections.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        connections.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));
        
        this.lines = new THREE.LineSegments(connections, linesMaterial);
        this.scene.add(this.lines);
    }
    
    animate() {
        if (!this.isActive) return;
        
        this.animationId = requestAnimationFrame(this.animate);
        this.time += 0.01;
        
        // Move camera slightly based on mouse position
        this.camera.position.x += (this.mouseX * 5 - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouseY * 5 - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);
        
        // Check for particle hover
        const intersects = this.raycaster.intersectObject(this.particleSystem);
        
        // Reset all particle sizes to original
        const sizesAttr = this.particleSystem.geometry.getAttribute('size');
        for(let i = 0; i < this.particleCount; i++) {
            if (this.hoveredParticleIndex !== i) {
                sizesAttr.array[i] = 0.5 + Math.random() * 1.0;
            }
        }
        
        // Highlight hovered particle
        if (intersects.length > 0) {
            this.hoveredParticleIndex = intersects[0].index;
            sizesAttr.array[this.hoveredParticleIndex] = 3.0; // Make hovered particle larger
        } else {
            this.hoveredParticleIndex = -1;
        }
        sizesAttr.needsUpdate = true;
        
        // Update particle positions with wave effect
        const positionAttr = this.particleSystem.geometry.getAttribute('position');
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            // Apply wave effect
            const xPos = this.originalPositions[i3];
            const yPos = this.originalPositions[i3 + 1];
            const zPos = this.originalPositions[i3 + 2];
            
            // Calculate distance from origin for wave effect
            const distance = Math.sqrt(xPos * xPos + yPos * yPos + zPos * zPos);
            
            // Wave effect
            const waveX = Math.sin(this.time * 0.5 + distance * 0.1) * 2;
            const waveY = Math.cos(this.time * 0.6 + distance * 0.1) * 2;
            const waveZ = Math.sin(this.time * 0.7 + distance * 0.1) * 2;
            
            positionAttr.array[i3] = xPos + waveX;
            positionAttr.array[i3 + 1] = yPos + waveY;
            positionAttr.array[i3 + 2] = zPos + waveZ;
        }
        positionAttr.needsUpdate = true;
        
        // Update connections between particles
        this.updateConnections();
        
        this.renderer.render(this.scene, this.camera);
    }
    
    handleResize() {
        if (!this.isActive) return;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    handleMouseMove(event) {
        // Update mouse position for camera movement
        this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouseY = (event.clientY / window.innerHeight) * 2 - 1;
        
        // Update raycaster for particle hover
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
    }
    
    start() {
        if (!this.isActive) {
            this.init();
        }
        
        // Show the container
        this.container.style.display = 'block';
        this.isActive = true;
    }
    
    stop() {
        if (!this.isActive) return;
        
        // Cancel animation frame
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // Hide the container
        this.container.style.display = 'none';
        this.isActive = false;
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('mousemove', this.handleMouseMove);
        
        // Clean up THREE.js resources
        if (this.renderer) {
            this.renderer.dispose();
            this.container.removeChild(this.renderer.domElement);
        }
        
        if (this.particleSystem) {
            this.scene.remove(this.particleSystem);
            this.particleSystem.geometry.dispose();
            this.particleSystem.material.dispose();
        }
        
        if (this.lines) {
            this.scene.remove(this.lines);
            this.lines.geometry.dispose();
            this.lines.material.dispose();
        }
    }
    
    toggle() {
        if (this.isActive) {
            this.stop();
        } else {
            this.start();
        }
        return this.isActive;
    }
}

// Create a global instance
let backgroundAnimation = null;

// Initialize function that can be called immediately
function initBackgroundAnimation() {
    console.log('Initializing background animation');
    
    // Create the canvas container if it doesn't exist
    let container = document.getElementById('canvas-container');
    if (!container) {
        console.log('Creating canvas container');
        container = document.createElement('div');
        container.id = 'canvas-container';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.zIndex = '-1';
        document.body.insertBefore(container, document.body.firstChild);
    } else {
        console.log('Canvas container exists');
    }
    
    // Initialize the background animation
    backgroundAnimation = new BackgroundAnimation('canvas-container');
    backgroundAnimation.init();
    console.log('Background animation initialized');
}

// Try to initialize immediately if the DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('Document already loaded, initializing now');
    setTimeout(initBackgroundAnimation, 100); // Short delay to ensure DOM is fully processed
} else {
    // Otherwise wait for DOMContentLoaded
    console.log('Waiting for DOMContentLoaded');
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOMContentLoaded fired');
        setTimeout(initBackgroundAnimation, 100); // Short delay to ensure DOM is fully processed
    });
}

// Export the toggle function for global access
window.toggleBackgroundAnimation = function() {
    console.log('Toggle background animation called');
    if (backgroundAnimation) {
        const result = backgroundAnimation.toggle();
        console.log('Animation is now: ' + (result ? 'on' : 'off'));
        return result;
    }
    console.log('Background animation not initialized yet');
    return false;
};
