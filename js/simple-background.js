// Simple Background Animation for STESA

let animation = {
    active: true,
    container: null,
    scene: null,
    camera: null,
    renderer: null,
    particles: null,
    lines: null,
    animationId: null,
    
    init: function() {
        console.log('Initializing simple background animation');
        
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
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0); // Transparent background
        this.container.appendChild(this.renderer.domElement);
        
        // Create particles
        const particleCount = 100;
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        const particleColors = new Float32Array(particleCount * 3);
        const particleShapes = new Float32Array(particleCount); // Store shape type for each particle
        const particleSizes = new Float32Array(particleCount); // Store size for each particle
        
        // Color options
        const colorOptions = [
            new THREE.Color(0x0066cc), // Blue
            new THREE.Color(0xcc00cc), // Magenta
            new THREE.Color(0x009900), // Green
            new THREE.Color(0xcc9900)  // Gold
        ];
        
        // Set random positions and colors
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Random position in a sphere
            const radius = 30;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI * 2;
            
            particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
            particlePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            particlePositions[i3 + 2] = radius * Math.cos(phi);
            
            // Random color
            const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
            particleColors[i3] = color.r;
            particleColors[i3 + 1] = color.g;
            particleColors[i3 + 2] = color.b;
            
            // Random shape (0=circle, 1=square, 2=triangle, 3=diamond, 4=star)
            particleShapes[i] = Math.floor(Math.random() * 5);
            
            // Random size (between 8 and 16)
            particleSizes[i] = 8 + Math.random() * 8;
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
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = [];
        const lineColors = [];
        
        // Connect particles that are close to each other
        const maxDistance = 15;
        const positions = particleGeometry.attributes.position.array;
        const particleColorArray = particleGeometry.attributes.color.array;
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const x1 = positions[i3];
            const y1 = positions[i3 + 1];
            const z1 = positions[i3 + 2];
            
            for (let j = i + 1; j < particleCount; j++) {
                const j3 = j * 3;
                const x2 = positions[j3];
                const y2 = positions[j3 + 1];
                const z2 = positions[j3 + 2];
                
                // Calculate distance
                const dx = x2 - x1;
                const dy = y2 - y1;
                const dz = z2 - z1;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                // If close enough, create a line
                if (distance < maxDistance) {
                    linePositions.push(x1, y1, z1);
                    linePositions.push(x2, y2, z2);
                    
                    lineColors.push(particleColorArray[i3], particleColorArray[i3 + 1], particleColorArray[i3 + 2]);
                    lineColors.push(particleColorArray[j3], particleColorArray[j3 + 1], particleColorArray[j3 + 2]);
                }
            }
        }
        
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));
        
        const lineMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.6, // Increased opacity for better visibility
            linewidth: 2, // Thicker lines (note: may not work in all browsers)
            blending: THREE.AdditiveBlending
        });
        
        this.lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        this.scene.add(this.lines);
        
        // Position camera
        this.camera.position.z = 50;
        
        // Add resize listener
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Start animation
        this.animate();
        console.log('Simple background animation started');
    },
    
    animate: function() {
        if (!this.active) return;
        
        this.animationId = requestAnimationFrame(this.animate.bind(this));
        
        // Rotate particles and lines
        this.particles.rotation.x += 0.001;
        this.particles.rotation.y += 0.002;
        
        this.lines.rotation.x += 0.001;
        this.lines.rotation.y += 0.002;
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    },
    
    handleResize: function() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
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
        animation.init();
    }, 100);
});

// Export toggle function
window.toggleBackgroundAnimation = function() {
    return animation.toggle();
};
