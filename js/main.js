// Particle/Line Animation Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xf5f5f7, 0); // Light background color to match CSS
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Create particles
const particleCount = 150; // More particles for better visibility
const particles = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const sizes = new Float32Array(particleCount);
const originalPositions = new Float32Array(particleCount * 3);
const shapes = new Float32Array(particleCount); // 0 = circle, 1 = square, 2 = triangle, 3 = diamond

// Color palette
const colorOptions = [
    new THREE.Color(0x0066cc), // Blue
    new THREE.Color(0xcc00cc), // Magenta
    new THREE.Color(0x009900), // Green
    new THREE.Color(0xcc9900)  // Gold
];

for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    
    // Random position in a wider sphere
    const radius = 20 + Math.random() * 30; // Spread particles out more
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 2; // Full sphere distribution
    
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);
    
    // Store original positions for wave effect
    originalPositions[i3] = positions[i3];
    originalPositions[i3 + 1] = positions[i3 + 1];
    originalPositions[i3 + 2] = positions[i3 + 2];
    
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

// Create lines between nearby particles
const linesMaterial = new THREE.LineBasicMaterial({ 
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
});

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

const particleSystem = new THREE.Points(particles, particlesMaterial);
scene.add(particleSystem);

// Create connections between particles that are close to each other
function createConnections() {
    const connections = new THREE.BufferGeometry();
    const linePositions = [];
    const lineColors = [];
    
    const positions = particles.attributes.position.array;
    const colors = particles.attributes.color.array;
    
    // Maximum distance for creating a connection
    const maxDistance = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const x1 = positions[i * 3];
        const y1 = positions[i * 3 + 1];
        const z1 = positions[i * 3 + 2];
        
        for (let j = i + 1; j < particleCount; j++) {
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
    
    return new THREE.LineSegments(connections, linesMaterial);
}

// Initialize lines variable with let instead of const
let lines = createConnections();
scene.add(lines);

camera.position.z = 50;

// Variables for mouse interaction
let mouseX = 0;
let mouseY = 0;
let hoveredParticleIndex = -1;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

// Add mouse move listener for hover effects
document.addEventListener('mousemove', (event) => {
    // Update mouse position for camera movement
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * 2 - 1;
    
    // Update raycaster for particle hover
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
});

// Animation
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.01;
    
    // Move camera slightly based on mouse position
    camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    // Check for particle hover
    const intersects = raycaster.intersectObject(particleSystem);
    
    // Reset all particle sizes to original
    const sizesAttr = particles.getAttribute('size');
    for(let i = 0; i < particleCount; i++) {
        if (hoveredParticleIndex !== i) {
            sizesAttr.array[i] = 0.5 + Math.random() * 1.0;
        }
    }
    
    // Highlight hovered particle
    if (intersects.length > 0) {
        hoveredParticleIndex = intersects[0].index;
        sizesAttr.array[hoveredParticleIndex] = 3.0; // Make hovered particle larger
    } else {
        hoveredParticleIndex = -1;
    }
    sizesAttr.needsUpdate = true;
    
    // Update particle positions with wave effect
    const positionAttr = particles.getAttribute('position');
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Apply wave effect
        const xPos = originalPositions[i3];
        const yPos = originalPositions[i3 + 1];
        const zPos = originalPositions[i3 + 2];
        
        // Calculate distance from origin for wave effect
        const distance = Math.sqrt(xPos * xPos + yPos * yPos + zPos * zPos);
        
        // Wave effect
        const waveX = Math.sin(time * 0.5 + distance * 0.1) * 2;
        const waveY = Math.cos(time * 0.6 + distance * 0.1) * 2;
        const waveZ = Math.sin(time * 0.7 + distance * 0.1) * 2;
        
        positionAttr.array[i3] = xPos + waveX;
        positionAttr.array[i3 + 1] = yPos + waveY;
        positionAttr.array[i3 + 2] = zPos + waveZ;
    }
    positionAttr.needsUpdate = true;
    
    // Update connections between particles
    updateConnections();
    
    renderer.render(scene, camera);
}

// Update connections between particles
function updateConnections() {
    const positions = particles.attributes.position.array;
    const linePositions = lines.geometry.attributes.position.array;
    const lineColors = lines.geometry.attributes.color.array;
    
    for (let i = 0; i < particleCount; i++) {
        const x1 = positions[i * 3];
        const y1 = positions[i * 3 + 1];
        const z1 = positions[i * 3 + 2];
        
        for (let j = i + 1; j < particleCount; j++) {
            const x2 = positions[j * 3];
            const y2 = positions[j * 3 + 1];
            const z2 = positions[j * 3 + 2];
            
            // Calculate distance between particles
            const dx = x2 - x1;
            const dy = y2 - y1;
            const dz = z2 - z1;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            // If particles are close enough, create a connection
            if (distance < 15) {
                const index = (i * (particleCount - 1) + j - i - 1) * 6;
                linePositions[index] = x1;
                linePositions[index + 1] = y1;
                linePositions[index + 2] = z1;
                linePositions[index + 3] = x2;
                linePositions[index + 4] = y2;
                linePositions[index + 5] = z2;
                
                // Add line colors (average of the two particles)
                const r1 = colors[i * 3];
                const g1 = colors[i * 3 + 1];
                const b1 = colors[i * 3 + 2];
                
                const r2 = colors[j * 3];
                const g2 = colors[j * 3 + 1];
                const b2 = colors[j * 3 + 2];
                
                // Fade the line based on distance
                const opacity = 1 - (distance / 15);
                
                lineColors[index] = r1;
                lineColors[index + 1] = g1;
                lineColors[index + 2] = b1;
                lineColors[index + 3] = r2;
                lineColors[index + 4] = g2;
                lineColors[index + 5] = b2;
            }
        }
    }
    lines.geometry.attributes.position.needsUpdate = true;
    lines.geometry.attributes.color.needsUpdate = true;
}

animate();

// Window resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
