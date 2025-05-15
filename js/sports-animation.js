// Sports Animation for STESA

let sportsAnimation = {
    active: true,
    container: null,
    scene: null,
    camera: null,
    renderer: null,
    objects: [],
    animationId: null,
    time: 0,
    
    init: function() {
        console.log('Initializing sports animation');
        
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
        this.camera.position.z = 50;
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0); // Transparent background
        this.container.appendChild(this.renderer.domElement);
        
        // Create sports-themed objects (balls and trajectories)
        this.createObjects();
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x009900, 0.5); // Green light for sports theme
        this.scene.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 1, 1);
        this.scene.add(directionalLight);
        
        // Start animation
        this.animate();
        console.log('Sports animation started');
    },
    
    createObjects: function() {
        // Create several "balls" with trajectories
        const ballCount = 15;
        const colors = [
            0x009900, // Green (primary)
            0x00cc00, // Bright green
            0x66ff66, // Light green
            0x006600  // Dark green
        ];
        
        for (let i = 0; i < ballCount; i++) {
            // Create a ball
            const geometry = new THREE.SphereGeometry(0.5 + Math.random() * 0.5, 16, 16);
            const material = new THREE.MeshPhongMaterial({
                color: colors[Math.floor(Math.random() * colors.length)],
                wireframe: Math.random() > 0.5, // Some balls are wireframe
                transparent: true,
                opacity: 0.8
            });
            
            const ball = new THREE.Mesh(geometry, material);
            
            // Random position
            ball.position.x = (Math.random() - 0.5) * 80;
            ball.position.y = (Math.random() - 0.5) * 80;
            ball.position.z = (Math.random() - 0.5) * 80;
            
            // Random velocity
            const velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5
            );
            
            // Add to scene
            this.scene.add(ball);
            
            // Store object with its properties
            this.objects.push({
                mesh: ball,
                velocity: velocity,
                initialPosition: ball.position.clone(),
                trajectory: this.createTrajectory(ball.position.clone(), 20)
            });
        }
    },
    
    createTrajectory: function(startPosition, length) {
        // Create a line showing the ball's trajectory
        const points = [];
        points.push(startPosition.clone());
        
        // Add some random points along a curved path
        for (let i = 1; i <= length; i++) {
            const t = i / length;
            const point = startPosition.clone();
            point.x += Math.sin(t * Math.PI * 2) * 10;
            point.y += Math.cos(t * Math.PI * 3) * 5;
            point.z += (t - 0.5) * 20;
            points.push(point);
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0x009900,
            transparent: true,
            opacity: 0.3
        });
        
        const line = new THREE.Line(geometry, material);
        this.scene.add(line);
        
        return line;
    },
    
    animate: function() {
        if (!this.active) return;
        
        this.animationId = requestAnimationFrame(this.animate.bind(this));
        this.time += 0.01;
        
        // Update each ball
        this.objects.forEach(obj => {
            // Move along trajectory
            const t = (this.time * 0.2) % 1;
            const trajectory = obj.trajectory.geometry.attributes.position;
            
            // Find position along the trajectory
            const index = Math.floor(t * (trajectory.count - 1));
            const nextIndex = (index + 1) % trajectory.count;
            
            const currentPos = new THREE.Vector3(
                trajectory.array[index * 3],
                trajectory.array[index * 3 + 1],
                trajectory.array[index * 3 + 2]
            );
            
            const nextPos = new THREE.Vector3(
                trajectory.array[nextIndex * 3],
                trajectory.array[nextIndex * 3 + 1],
                trajectory.array[nextIndex * 3 + 2]
            );
            
            // Interpolate between points
            const subT = (t * (trajectory.count - 1)) - index;
            obj.mesh.position.lerpVectors(currentPos, nextPos, subT);
            
            // Rotate the ball
            obj.mesh.rotation.x += 0.02;
            obj.mesh.rotation.y += 0.03;
        });
        
        // Rotate the entire scene slightly
        this.scene.rotation.y = Math.sin(this.time * 0.1) * 0.1;
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    },
    
    handleResize: function() {
        if (!this.camera || !this.renderer) return;
        
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
    if (sportsAnimation) {
        sportsAnimation.handleResize();
    }
});

// Export the animation object
window.sportsAnimation = sportsAnimation;
