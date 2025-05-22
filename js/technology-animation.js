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
        
        // Create a single wireframe icosahedron mesh for a more organic 'mesh' look
        const geometry = new THREE.IcosahedronGeometry(3, 4);
        const material = new THREE.MeshBasicMaterial({
            color: 0xcc00cc,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        this.particles = new THREE.Mesh(geometry, material);
        this.scene.add(this.particles);
        
        // Add resize handler
        window.addEventListener('resize', this.handleResize.bind(this));
    },
    
    animate: function() {
        if (!this.active) return;
        
        this.animationId = requestAnimationFrame(this.animate.bind(this));
        this.time += 0.01;
        
        // Rotate the entire mesh
        if (this.particles) {
            this.particles.rotation.x = Math.sin(this.time * 0.3) * 0.2;
            this.particles.rotation.y = this.time * 0.2;
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
