// Society Animation for STESA

let societyAnimation = {
    active: false,
    container: null,
    scene: null,
    camera: null,
    renderer: null,
    particles: null,
    lines: null,
    animationId: null,
    time: 0,
    particleData: [],
    
    init: function() {
        console.log('Initializing society animation');
        
        // Get container
        this.container = document.getElementById('canvas-container');
        if (!this.container) {
            console.error('Canvas container not found');
            return;
        }
        
        // Set up Three.js
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(
            window.innerWidth / -2, window.innerWidth / 2,
            window.innerHeight / 2, window.innerHeight / -2,
            0.1, 1000
        );
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.container.appendChild(this.renderer.domElement);
        
        // Create particles
        const particleCount = 80;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        // Color options - blue theme for society
        const colorOptions = [
            new THREE.Color(0x0066cc), // Blue (primary)
            new THREE.Color(0x0099ff), // Light blue
            new THREE.Color(0x003399), // Dark blue
            new THREE.Color(0x66ccff)  // Sky blue
        ];
        
        // Calculate width and height for distribution
        const width = window.innerWidth * 1.2;
        const height = window.innerHeight * 1.2;
        
        // Create particles
        this.particleData = [];
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Random position
            const x = (Math.random() - 0.5) * width;
            const y = (Math.random() - 0.5) * height;
            const z = 0;
            
            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;
            
            // Random color
            const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            // Store additional data
            this.particleData.push({
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                originX: x,
                originY: y,
                phase: Math.random() * Math.PI * 2
            });
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 5,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
        
        // Create lines
        this.updateConnections();
        
        // Add resize handler
        window.addEventListener('resize', this.handleResize.bind(this));
    },
    
    updateConnections: function() {
        if (!this.particles) return;
        
        // Remove old lines
        if (this.lines) {
            this.scene.remove(this.lines);
        }
        
        const positions = this.particles.geometry.attributes.position.array;
        const linePositions = [];
        
        // Connect particles that are close
        const maxDistance = 100;
        
        for (let i = 0; i < positions.length / 3; i++) {
            const i3 = i * 3;
            const x1 = positions[i3];
            const y1 = positions[i3 + 1];
            const z1 = positions[i3 + 2];
            
            for (let j = i + 1; j < positions.length / 3; j++) {
                const j3 = j * 3;
                const x2 = positions[j3];
                const y2 = positions[j3 + 1];
                const z2 = positions[j3 + 2];
                
                const dx = x2 - x1;
                const dy = y2 - y1;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    linePositions.push(x1, y1, z1);
                    linePositions.push(x2, y2, z2);
                }
            }
        }
        
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x0066cc,
            transparent: true,
            opacity: 0.3
        });
        
        this.lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        this.scene.add(this.lines);
    },
    
    animate: function() {
        if (!this.active) return;
        
        this.animationId = requestAnimationFrame(this.animate.bind(this));
        this.time += 0.01;
        
        // Update particle positions
        const positions = this.particles.geometry.attributes.position.array;
        
        for (let i = 0; i < this.particleData.length; i++) {
            const i3 = i * 3;
            const data = this.particleData[i];
            
            // Move particles
            data.originX += data.vx;
            data.originY += data.vy;
            
            // Add some floating motion
            const offsetX = Math.sin(this.time + data.phase) * 15;
            const offsetY = Math.cos(this.time + data.phase * 0.5) * 15;
            
            positions[i3] = data.originX + offsetX;
            positions[i3 + 1] = data.originY + offsetY;
            
            // Boundary check
            const width = window.innerWidth / 2;
            const height = window.innerHeight / 2;
            
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
        
        // Update connections occasionally
        if (Math.floor(this.time * 10) % 10 === 0) {
            this.updateConnections();
        }
        
        // Render
        this.renderer.render(this.scene, this.camera);
    },
    
    handleResize: function() {
        if (!this.camera || !this.renderer) return;
        
        this.camera.left = window.innerWidth / -2;
        this.camera.right = window.innerWidth / 2;
        this.camera.top = window.innerHeight / 2;
        this.camera.bottom = window.innerHeight / -2;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    
    start: function() {
        console.log('Starting society animation');
        this.active = true;
        this.animate();
    },
    
    stop: function() {
        console.log('Stopping society animation');
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
window.societyAnimation = societyAnimation;
