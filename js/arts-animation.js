// Arts Animation for STESA

let artsAnimation = {
    active: true,
    container: null,
    scene: null,
    camera: null,
    renderer: null,
    particles: null,
    animationId: null,
    time: 0,
    
    init: function() {
        console.log('Initializing arts animation');
        
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
        this.camera.position.z = 20;
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0); // Transparent background
        this.container.appendChild(this.renderer.domElement);
        
        // Create artistic particles
        this.createParticles();
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xcc9900, 0.5); // Gold light for arts theme
        this.scene.add(ambientLight);
        
        // Start animation
        this.animate();
        console.log('Arts animation started');
    },
    
    createParticles: function() {
        // Create a shader-based particle system for artistic effect
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];
        const sizes = [];
        const angles = [];
        
        // Arts theme colors - gold/yellow palette
        const colorOptions = [
            new THREE.Color(0xcc9900), // Gold (primary)
            new THREE.Color(0xffcc00), // Yellow
            new THREE.Color(0xff9900), // Orange
            new THREE.Color(0xcc6600)  // Amber
        ];
        
        // Create particles in artistic patterns
        const particleCount = 300;
        
        for (let i = 0; i < particleCount; i++) {
            // Create spiral pattern
            const t = i / particleCount;
            const angle = t * Math.PI * 20;
            const radius = t * 15;
            
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const z = (Math.random() - 0.5) * 10;
            
            vertices.push(x, y, z);
            
            // Random color from options
            const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
            colors.push(color.r, color.g, color.b);
            
            // Random size
            sizes.push(0.5 + Math.random() * 1.5);
            
            // Random angle for rotation
            angles.push(Math.random() * Math.PI * 2);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        geometry.setAttribute('angle', new THREE.Float32BufferAttribute(angles, 1));
        
        // Create shader material for artistic particles
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                pixelRatio: { value: window.devicePixelRatio }
            },
            vertexShader: `
                uniform float time;
                uniform float pixelRatio;
                attribute float size;
                attribute float angle;
                attribute vec3 color;
                varying vec3 vColor;
                varying float vAngle;
                
                void main() {
                    vColor = color;
                    vAngle = angle + time;
                    
                    // Animate position slightly
                    vec3 pos = position;
                    pos.x += sin(time * 0.5 + position.z) * 0.5;
                    pos.y += cos(time * 0.3 + position.x) * 0.5;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                    gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                varying float vAngle;
                
                void main() {
                    // Calculate position within the point (from -1 to 1)
                    vec2 center = gl_PointCoord - 0.5;
                    
                    // Rotate the point
                    float c = cos(vAngle);
                    float s = sin(vAngle);
                    vec2 rotated = vec2(center.x * c - center.y * s, center.x * s + center.y * c);
                    
                    // Create different shapes based on position
                    float shape;
                    
                    // Star shape
                    float angle = atan(rotated.y, rotated.x);
                    float radius = length(rotated);
                    float star = 0.5 + 0.3 * sin(angle * 5.0);
                    
                    if (radius > star) {
                        discard;
                    }
                    
                    // Apply color with fade at edges
                    float alpha = 1.0 - radius / star;
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    },
    
    animate: function() {
        if (!this.active) return;
        
        this.animationId = requestAnimationFrame(this.animate.bind(this));
        this.time += 0.01;
        
        // Update shader uniforms
        if (this.particles && this.particles.material.uniforms) {
            this.particles.material.uniforms.time.value = this.time;
        }
        
        // Rotate the entire particle system
        if (this.particles) {
            this.particles.rotation.z = this.time * 0.05;
            this.particles.rotation.x = Math.sin(this.time * 0.1) * 0.2;
        }
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    },
    
    handleResize: function() {
        if (!this.camera || !this.renderer) return;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Update pixel ratio in shader
        if (this.particles && this.particles.material.uniforms) {
            this.particles.material.uniforms.pixelRatio.value = window.devicePixelRatio;
        }
    },
    
    stop: function() {
        this.active = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    },
    
    start: function() {
        if (!this.active) {
            this.active = true;
            this.animate();
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

// Add resize handler
window.addEventListener('resize', function() {
    if (artsAnimation) {
        artsAnimation.handleResize();
    }
});

// Export the animation object
window.artsAnimation = artsAnimation;
