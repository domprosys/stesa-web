// Technology Animation for STESA

let technologyAnimation = {
    active: false,
    container: null,
    scene: null,
    camera: null,
    renderer: null,
    particles: null,
    animationId: null,
    time: 0,
    
    init: function() {
        console.log('Initializing technology animation');
        
        // Get container
        this.container = document.getElementById('canvas-container');
        if (!this.container) {
            console.error('Canvas container not found');
            return;
        }
        
        // Set up Three.js
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 30;
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);
        
        // Create a 3D grid of cubes
        const gridSize = 4; // 4x4x4 grid
        const spacing = 4;
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        
        // Create a group to hold all cubes
        this.particles = new THREE.Group();
        
        // Color options - purple/magenta theme for technology
        const colors = [
            new THREE.Color(0xcc00cc), // Magenta (primary)
            new THREE.Color(0x9900cc), // Purple
            new THREE.Color(0xff33ff), // Light magenta
            new THREE.Color(0xcc33ff)  // Light purple
        ];
        
        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                for (let z = 0; z < gridSize; z++) {
                    const material = new THREE.MeshBasicMaterial({
                        color: colors[Math.floor(Math.random() * colors.length)],
                        wireframe: true,
                        transparent: true,
                        opacity: 0.8
                    });
                    
                    const cube = new THREE.Mesh(geometry, material);
                    
                    // Position in grid (centered)
                    cube.position.x = (x - gridSize/2 + 0.5) * spacing;
                    cube.position.y = (y - gridSize/2 + 0.5) * spacing;
                    cube.position.z = (z - gridSize/2 + 0.5) * spacing;
                    
                    this.particles.add(cube);
                }
            }
        }
        
        this.scene.add(this.particles);
        
        // Add resize handler
        window.addEventListener('resize', this.handleResize.bind(this));
    },
    
    animate: function() {
        if (!this.active) return;
        
        this.animationId = requestAnimationFrame(this.animate.bind(this));
        this.time += 0.01;
        
        // Rotate the entire grid
        if (this.particles) {
            this.particles.rotation.x = Math.sin(this.time * 0.3) * 0.2;
            this.particles.rotation.y = this.time * 0.2;
            
            // Pulse each cube
            this.particles.children.forEach((cube, i) => {
                const pulseFactor = 1 + 0.1 * Math.sin(this.time * 2 + i * 0.1);
                cube.scale.set(pulseFactor, pulseFactor, pulseFactor);
            });
        }
        
        // Render
        this.renderer.render(this.scene, this.camera);
    },
    
    handleResize: function() {
        if (!this.camera || !this.renderer) return;
        
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    
    start: function() {
        console.log('Starting technology animation');
        this.active = true;
        this.animate();
    },
    
    stop: function() {
        console.log('Stopping technology animation');
        this.active = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // Remove from DOM
        if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
            this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
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

// Export the animation
window.technologyAnimation = technologyAnimation;
