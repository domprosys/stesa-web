// Flat 2D Network Animation for STESA

let flatNetwork = {
    active: true,
    container: null,
    scene: null,
    camera: null,
    renderer: null,
    particles: null,
    lines: null,
    animationId: null,
    particleCount: 80,
    time: 0,
    particleData: [], // Store additional data for animation
    
    init: function() {
        console.log('Initializing flat network animation');
        
        // Create or get container
        this.container = document.getElementById('canvas-container');
        if (!this.container) {
            console.log('Creating canvas container');
            this.container = document.createElement('div');
            this.container.id = 'canvas-container';
            this.container.style.position = 'fixed';
            this.container.style.top = '0';
            this.container.style.left = '0';
            this.container.style.width = '100%';
            this.container.style.height = '100%';
            this.container.style.zIndex = '-1';
            document.body.insertBefore(this.container, document.body.firstChild);
        }
        
        // Basic Three.js setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(
            window.innerWidth / -2, window.innerWidth / 2,
            window.innerHeight / 2, window.innerHeight / -2,
            0.1, 1000
        );
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0); // Transparent background
        this.container.appendChild(this.renderer.domElement);
        
        // Create particles
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(this.particleCount * 3);
        const particleColors = new Float32Array(this.particleCount * 3);
        const particleShapes = new Float32Array(this.particleCount); // Store shape type for each particle
        const particleSizes = new Float32Array(this.particleCount); // Store size for each particle
        
        // Color options
        const colorOptions = [
            new THREE.Color(0x0066cc), // Blue
            new THREE.Color(0xcc00cc), // Magenta
            new THREE.Color(0x009900), // Green
            new THREE.Color(0xcc9900)  // Gold
        ];
        
        // Calculate width and height for distribution
        const width = window.innerWidth * 1.2; // Slightly wider than screen
        const height = window.innerHeight * 1.2; // Slightly taller than screen
        
        // Set random positions and colors
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            // Random position in a 2D plane
            const x = (Math.random() - 0.5) * width;
            const y = (Math.random() - 0.5) * height;
            const z = 0; // All particles on z=0 plane
            
            particlePositions[i3] = x;
            particlePositions[i3 + 1] = y;
            particlePositions[i3 + 2] = z;
            
            // Random color
            const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
            particleColors[i3] = color.r;
            particleColors[i3 + 1] = color.g;
            particleColors[i3 + 2] = color.b;
            
            // Random shape (0=circle, 1=square, 2=triangle, 3=diamond, 4=star)
            particleShapes[i] = Math.floor(Math.random() * 5);
            
            // Random size (between 8 and 16)
            particleSizes[i] = 8 + Math.random() * 8;
            
            // Store additional data for animation
            this.particleData.push({
                vx: (Math.random() - 0.5) * 1.0, // Increased velocity for more movement
                vy: (Math.random() - 0.5) * 1.0, // Increased velocity for more movement
                originX: x,
                originY: y,
                phase: Math.random() * Math.PI * 2 // Random starting phase
            });
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
        particleGeometry.setAttribute('shape', new THREE.BufferAttribute(particleShapes, 1));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
        
        // Create custom shader material for different shapes
        const particleMaterial = new THREE.ShaderMaterial({
            vertexShader: `
                attribute float shape;
                attribute float size;
                varying vec3 vColor;
                varying float vShape;
                
                void main() {
                    vColor = color;
                    vShape = shape;
                    gl_PointSize = size;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vShape;
                
                void main() {
                    // Convert from 0,1 to -1,1 coordinates
                    vec2 uv = 2.0 * gl_PointCoord - 1.0;
                    float alpha = 1.0;
                    
                    // Circle (shape 0)
                    if (vShape < 0.5) {
                        float r = length(uv);
                        if (r > 0.8) alpha = 0.0;
                    }
                    // Square (shape 1)
                    else if (vShape < 1.5) {
                        if (abs(uv.x) > 0.7 || abs(uv.y) > 0.7) alpha = 0.0;
                    }
                    // Triangle (shape 2)
                    else if (vShape < 2.5) {
                        if (uv.y > 0.8 || uv.y < -0.7 * uv.x - 0.3 || uv.y < 0.7 * uv.x - 0.3) alpha = 0.0;
                    }
                    // Diamond (shape 3)
                    else if (vShape < 3.5) {
                        if (abs(uv.x) + abs(uv.y) > 0.8) alpha = 0.0;
                    }
                    // Star (shape 4)
                    else {
                        float r = length(uv);
                        float theta = atan(uv.y, uv.x);
                        float starRadius = 0.4 + 0.4 * cos(theta * 5.0);
                        if (r > starRadius) alpha = 0.0;
                    }
                    
                    if (alpha < 0.1) discard;
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            vertexColors: true,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        
        // Create particle system
        this.particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particles);
        
        // Create lines between particles
        this.updateConnections();
        
        // Position camera
        this.camera.position.z = 100;
        
        // Add resize listener
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Start animation
        this.animate();
        console.log('Flat network animation started');
    },
    
    updateConnections: function() {
        // Remove old lines if they exist
        if (this.lines) {
            this.scene.remove(this.lines);
            this.lines.geometry.dispose();
            this.lines.material.dispose();
        }
        
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = [];
        const lineColors = [];
        
        // Connect particles that are close to each other
        const maxDistance = window.innerWidth * 0.15; // Responsive max distance
        const positions = this.particles.geometry.attributes.position.array;
        const particleColorArray = this.particles.geometry.attributes.color.array;
        
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            const x1 = positions[i3];
            const y1 = positions[i3 + 1];
            const z1 = positions[i3 + 2];
            
            for (let j = i + 1; j < this.particleCount; j++) {
                const j3 = j * 3;
                const x2 = positions[j3];
                const y2 = positions[j3 + 1];
                const z2 = positions[j3 + 2];
                
                // Calculate distance (2D only, ignore z)
                const dx = x2 - x1;
                const dy = y2 - y1;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // If close enough, create a line
                if (distance < maxDistance) {
                    // Calculate opacity based on distance
                    const opacity = 1 - (distance / maxDistance);
                    
                    linePositions.push(x1, y1, z1);
                    linePositions.push(x2, y2, z2);
                    
                    lineColors.push(
                        particleColorArray[i3] * opacity,
                        particleColorArray[i3 + 1] * opacity,
                        particleColorArray[i3 + 2] * opacity
                    );
                    lineColors.push(
                        particleColorArray[j3] * opacity,
                        particleColorArray[j3 + 1] * opacity,
                        particleColorArray[j3 + 2] * opacity
                    );
                }
            }
        }
        
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));
        
        const lineMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            linewidth: 2,
            blending: THREE.AdditiveBlending
        });
        
        this.lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        this.scene.add(this.lines);
    },
    
    animate: function() {
        if (!this.active) return;
        
        this.animationId = requestAnimationFrame(this.animate.bind(this));
        this.time += 0.015; // Increased time increment for faster animation
        
        // Update particle positions
        const positions = this.particles.geometry.attributes.position.array;
        
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            const data = this.particleData[i];
            
            // More dynamic floating motion
            const offsetX = Math.sin(this.time * 0.7 + data.phase) * 25;
            const offsetY = Math.cos(this.time * 0.5 + data.phase * 2) * 25;
            
            // Update position
            positions[i3] = data.originX + offsetX;
            positions[i3 + 1] = data.originY + offsetY;
            
            // Faster movement of origin points
            data.originX += data.vx;
            data.originY += data.vy;
            
            // Boundary check and bounce
            const width = window.innerWidth * 0.6;
            const height = window.innerHeight * 0.6;
            
            if (Math.abs(data.originX) > width) {
                data.vx *= -1;
                data.originX = Math.sign(data.originX) * width;
            }
            
            if (Math.abs(data.originY) > height) {
                data.vy *= -1;
                data.originY = Math.sign(data.originY) * height;
            }
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true;
        
        // Update connections more frequently
        if (Math.floor(this.time * 100) % 5 === 0) {
            this.updateConnections();
        }
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    },
    
    handleResize: function() {
        // Update orthographic camera
        this.camera.left = window.innerWidth / -2;
        this.camera.right = window.innerWidth / 2;
        this.camera.top = window.innerHeight / 2;
        this.camera.bottom = window.innerHeight / -2;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    
    stop: function() {
        this.active = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.container.style.display = 'none';
        console.log('Animation stopped');
    },
    
    start: function() {
        if (!this.active) {
            this.active = true;
            this.container.style.display = 'block';
            this.animate();
            console.log('Animation started');
        }
    },
    
    toggle: function() {
        if (this.active) {
            this.stop();
        } else {
            this.start();
        }
        return this.active;
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        flatNetwork.init();
    }, 100);
});

// Export toggle function
window.toggleFlatNetwork = function() {
    return flatNetwork.toggle();
};
