// Create mini Three.js scenes for each box
function createMiniScene(boxId, geometry, color) {
    const box = document.getElementById(boxId);
    if (!box) {
        console.error(`Box element with id ${boxId} not found`);
        return null;
    }
    
    // Clear any existing content
    while (box.firstChild) {
        if (box.firstChild.className !== 'box-label') {
            box.removeChild(box.firstChild);
        } else {
            break;
        }
    }
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(box.clientWidth, box.clientHeight);
    box.insertBefore(renderer.domElement, box.firstChild); // Insert before label if exists
    
    // Create scene and camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create shape with material
    const material = new THREE.MeshBasicMaterial({ 
        color: color, 
        wireframe: true,
        transparent: true,
        opacity: 0.4 // Reduced opacity to make text more readable
    });
    const shape = new THREE.Mesh(geometry, material);
    scene.add(shape);
    
    // Add subtle ambient light
    const ambientLight = new THREE.AmbientLight(color, 0.5);
    scene.add(ambientLight);
    
    // Add point light
    const pointLight = new THREE.PointLight(color, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    // Debug info
    console.log(`Created scene for ${boxId} with dimensions ${box.clientWidth}x${box.clientHeight}`);
    
    return {
        renderer,
        scene,
        camera,
        shape,
        rotationSpeed: 0.01
    };
}

// Feature boxes with rotating 3D shapes
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing feature boxes');
    
    // Define box configurations
    const boxes = [
        { id: 'society-box', color: '#0066cc', hoverColor: 'rgba(0, 102, 204, 0.7)', contentId: 'society-content', label: 'society-title' },
        { id: 'tech-box', color: '#cc00cc', hoverColor: 'rgba(204, 0, 204, 0.7)', contentId: 'technology-content', label: 'technology-title' },
        { id: 'sports-box', color: '#009900', hoverColor: 'rgba(0, 153, 0, 0.7)', contentId: 'sports-content', label: 'sports-title' },
        { id: 'arts-box', color: '#cc9900', hoverColor: 'rgba(204, 153, 0, 0.7)', contentId: 'arts-content', label: 'arts-title' }
    ];
    
    // Store all scenes and shapes for animation
    const scenes = [];
    
    // Initialize each box
    boxes.forEach(box => {
        const boxElement = document.getElementById(box.id);
        if (!boxElement) {
            console.error(`Box element with id ${box.id} not found`);
            return;
        }
        
        // Clear any existing canvas/renderer added by this script
        const existingCanvas = boxElement.querySelector('canvas');
        if (existingCanvas && existingCanvas.parentElement === boxElement) {
            boxElement.removeChild(existingCanvas);
        }
        
        // Create renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(boxElement.clientWidth, boxElement.clientHeight);
        boxElement.appendChild(renderer.domElement);
        
        // Create scene and camera
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, boxElement.clientWidth / boxElement.clientHeight, 0.1, 1000);
        camera.position.z = 5;
        
        // Create geometry based on box id
        let geometry;
        let material;
        let shape;
        
        switch(box.id) {
            case 'society-box':
                geometry = new THREE.SphereGeometry(1.5, 16, 16); // Sphere
                material = new THREE.MeshBasicMaterial({
                    color: parseInt(box.color.replace('#', '0x')),
                    wireframe: true,
                    transparent: true,
                    opacity: 0.4 // Reduced opacity to make text more readable
                });
                shape = new THREE.Mesh(geometry, material);
                break;
                
            case 'tech-box':
                geometry = new THREE.OctahedronGeometry(1.5, 0); // Octahedron
                material = new THREE.MeshBasicMaterial({
                    color: parseInt(box.color.replace('#', '0x')),
                    wireframe: true,
                    transparent: true,
                    opacity: 0.4 // Reduced opacity to make text more readable
                });
                shape = new THREE.Mesh(geometry, material);
                break;
                
            case 'sports-box':
                // Create a disc (cylinder) with an axle through its center
                const discGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 32);
                const axleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 4, 16);
                
                // Create materials - both using the same green color
                const discMaterial = new THREE.MeshBasicMaterial({
                    color: parseInt(box.color.replace('#', '0x')),
                    wireframe: true,
                    transparent: true,
                    opacity: 0.4 // Reduced opacity to make text more readable
                });
                
                const axleMaterial = new THREE.MeshBasicMaterial({
                    color: parseInt(box.color.replace('#', '0x')), // Same green color as the disc
                    wireframe: true,
                    transparent: true,
                    opacity: 0.4 // Reduced opacity to make text more readable
                });
                
                // Create meshes
                const disc = new THREE.Mesh(discGeometry, discMaterial);
                const axle = new THREE.Mesh(axleGeometry, axleMaterial);
                
                // Position axle perpendicular to the disc (along Y-axis)
                // No rotation needed as cylinder geometry is already aligned with Y-axis
                
                // Create a group to hold both parts
                shape = new THREE.Group();
                shape.add(disc);
                shape.add(axle);
                break;
                
            case 'arts-box':
                // Create a more complex shape with gradient shader material for Arts
                geometry = new THREE.TorusKnotGeometry(1, 0.4, 64, 8); // Swirly thing
                
                // Create a shader material with gradient effect
                const vertexShader = `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `;
                
                const fragmentShader = `
                    uniform float time;
                    varying vec2 vUv;
                    
                    void main() {
                        // Create a gradient based on position and time
                        vec3 color1 = vec3(0.8, 0.6, 0.0); // Gold
                        vec3 color2 = vec3(0.8, 0.3, 0.0); // Orange-red
                        
                        float t = sin(vUv.y * 10.0 + time) * 0.5 + 0.5;
                        vec3 color = mix(color1, color2, t);
                        
                        // Add some sparkle
                        float sparkle = pow(sin(vUv.x * 40.0 + time) * sin(vUv.y * 40.0 + time), 16.0);
                        color += vec3(sparkle);
                        
                        gl_FragColor = vec4(color, 0.4); // Reduced opacity to make text more readable
                    }
                `;
                
                material = new THREE.ShaderMaterial({
                    uniforms: {
                        time: { value: 0.0 }
                    },
                    vertexShader: vertexShader,
                    fragmentShader: fragmentShader,
                    wireframe: true,
                    transparent: true
                });
                
                shape = new THREE.Mesh(geometry, material);
                break;
                
            default:
                // Default to a cube if no specific shape is defined
                geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
                material = new THREE.MeshBasicMaterial({
                    color: parseInt(box.color.replace('#', '0x')),
                    wireframe: true,
                    transparent: true,
                    opacity: 0.4 // Reduced opacity to make text more readable
                });
                shape = new THREE.Mesh(geometry, material);
        }
        
        scene.add(shape);
        
        // Add label
        if (!boxElement.querySelector('.box-label')) {
            const label = document.createElement('div');
            label.className = 'box-label';
            label.setAttribute('data-translate', box.label);
            label.textContent = box.label.split('-')[0].charAt(0).toUpperCase() + box.label.split('-')[0].slice(1);
            // Center the label both horizontally and vertically
            label.style.position = 'absolute';
            label.style.top = '50%';
            label.style.left = '50%';
            label.style.transform = 'translate(-50%, -50%)';
            label.style.textAlign = 'center';
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.justifyContent = 'center';
            label.style.color = box.color;
            label.style.fontWeight = 'bold';
            label.style.fontSize = '1.2rem';
            label.style.textTransform = 'uppercase';
            label.style.letterSpacing = '2px';
            label.style.textShadow = '0 0 5px rgba(255, 255, 255, 0.8)';
            label.style.pointerEvents = 'none'; // Prevent label from interfering with clicks
            boxElement.appendChild(label);
        }
        
        // Add the scene to our collection
        scenes.push({
            id: box.id,
            scene,
            camera,
            renderer,
            shape,
            material,
            rotationSpeed: 0.01
        });
        
        // Disable click logic for feature boxes
        // Commenting out the event listener for clicks on feature boxes
        // boxes.forEach(box => {
        //     const boxElement = document.getElementById(box.id);
        //     const contentElement = document.getElementById(box.contentId);
        
        //     if (boxElement && contentElement) {
        //         // Make sure the box is clickable by setting pointer events and cursor
        //         boxElement.style.cursor = 'pointer';
        //         boxElement.style.pointerEvents = 'auto';
        
        //         boxElement.addEventListener('click', function(e) {
        //             console.log(`Box clicked: ${box.id}`);
                
        //             // If this box is already active, deactivate it
        //             if (this.classList.contains('active')) {
        //                 console.log(`Deactivating box: ${box.id}`);
        //                 // Hide feature content
        //                 contentElement.classList.remove('active');
                    
        //                 // Show default hero content
        //                 heroDefault.classList.remove('hidden');
                    
        //                 // Reset box styling
        //                 this.classList.remove('active');
        //                 this.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        //                 this.style.transform = 'translateY(0) scale(1)';
        //                 this.style.boxShadow = `0 4px 8px rgba(0, 0, 0, 0.1), 0 0 15px ${box.color}`;
                    
        //                 // Reset label color
        //                 const label = this.querySelector('.box-label');
        //                 if (label) {
        //                     label.style.color = box.color;
        //                 }
                    
        //                 // Reset active box
        //                 activeBox = null;
        //             } else {
        //                 console.log(`Activating box: ${box.id}`);
        //                 // If another box is active, deactivate it first
        //                 if (activeBox) {
        //                     const activeBoxConfig = boxes.find(b => b.id === activeBox.id);
        //                     const activeContentId = activeBoxConfig?.contentId;
        //                     const activeContent = activeContentId ? document.getElementById(activeContentId) : null;
                        
        //                     if (activeContent) {
        //                         activeContent.classList.remove('active');
        //                     }
                        
        //                     activeBox.classList.remove('active');
        //                     activeBox.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        //                     activeBox.style.transform = 'translateY(0) scale(1)';
                        
        //                     if (activeBoxConfig) {
        //                         activeBox.style.boxShadow = `0 4px 8px rgba(0, 0, 0, 0.1), 0 0 15px ${activeBoxConfig.color}`;
                            
        //                         // Reset label color
        //                         const label = activeBox.querySelector('.box-label');
        //                         if (label) {
        //                             label.style.color = activeBoxConfig.color;
        //                         }
        //                     }
        //                 }
                    
        //                 // Hide default hero content
        //                 heroDefault.classList.add('hidden');
                    
        //                 // Show this feature content
        //                 featureContents.forEach(content => content.classList.remove('active'));
        //                 contentElement.classList.add('active');
                    
        //                 // Activate this box
        //                 this.classList.add('active');
        //                 this.style.backgroundColor = box.hoverColor;
        //                 this.style.transform = 'translateY(-5px) scale(1.05)';
        //                 this.style.boxShadow = `0 8px 16px rgba(0, 0, 0, 0.2), 0 0 20px ${box.color}`;
                    
        //                 // Change label color
        //                 const label = this.querySelector('.box-label');
        //                 if (label) {
        //                     label.style.color = '#ffffff';
        //                 }
                    
        //                 activeBox = this;
                    
        //                 // Start typewriter effect
        //                 startTypewriterForContent(contentElement);
                    
        //                 // Notify animation manager (if available)
        //                 if (window.animationManager && typeof window.animationManager.handleBoxClick === 'function') {
        //                     // Extract box type from id (e.g., 'society-box' -> 'society')
        //                     let boxType = box.id.split('-')[0];
                        
        //                     // Handle the tech box specially
        //                     if (boxType === 'tech') {
        //                         boxType = 'technology';
        //                     }
                        
        //                     console.log('Box clicked, notifying animation manager with type:', boxType);
        //                     window.animationManager.handleBoxClick(boxType);
        //                 }
        //             }
        //         });
        //     }
        // });
        
        // Add hover effects
        boxElement.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-5px) scale(1.05)';
                this.style.boxShadow = `0 8px 16px rgba(0, 0, 0, 0.2), 0 0 20px ${box.color}`;
                
                // Find the corresponding scene and slow down rotation
                const sceneItem = scenes.find(item => item.id === box.id);
                if (sceneItem) {
                    sceneItem.rotationSpeed = 0.0025; // 0.25x of the default 0.01 (even slower)
                }
            }
        });
        
        boxElement.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(0) scale(1)';
                // Reset box shadow to default with no colored glow
                this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                
                // Find the corresponding scene and restore normal rotation speed
                const sceneItem = scenes.find(item => item.id === box.id);
                if (sceneItem) {
                    sceneItem.rotationSpeed = 0.01; // Restore default speed
                }
            }
        });
    });
    
    // Track time for shader animations
    let time = 0;
    
    // Animation function
    function animate() {
        requestAnimationFrame(animate);
        
        // Update time for shader materials
        time += 0.01;
        
        // Animate each scene
        scenes.forEach(item => {
            // Rotate the shape
            if (item.shape) {
                item.shape.rotation.x += item.rotationSpeed;
                item.shape.rotation.y += item.rotationSpeed * 1.5;
            }
            
            // Update shader uniforms if applicable
            if (item.material && item.material.uniforms && item.material.uniforms.time) {
                item.material.uniforms.time.value = time;
            }
            
            // Render the scene
            item.renderer.render(item.scene, item.camera);
        });
    }
    
    // Start animation
    animate();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        scenes.forEach(item => {
            const boxElement = document.getElementById(item.id);
            if (boxElement) {
                // Update renderer size
                item.renderer.setSize(boxElement.clientWidth, boxElement.clientHeight);
                
                // Update camera aspect ratio
                item.camera.aspect = boxElement.clientWidth / boxElement.clientHeight;
                item.camera.updateProjectionMatrix();
            }
        });
    });
    
    // Typewriter effect function
    function typewriterEffect(element, text, speed = 30, startDelay = 0) {
        return new Promise(resolve => {
            setTimeout(() => {
                element.textContent = '';
                let i = 0;
                const interval = setInterval(() => {
                    if (i < text.length) {
                        element.textContent += text.charAt(i);
                        i++;
                    } else {
                        clearInterval(interval);
                        resolve();
                    }
                }, speed);
            }, startDelay);
        });
    }
    
    // Function to reset and start typewriter effect for a content element
    function startTypewriterForContent(contentElement) {
        if (contentElement) {
            // Get all paragraphs with typewriter-text spans
            const typewriterSpans = contentElement.querySelectorAll('.typewriter-text');
            
            // If no typewriter spans found, create them
            if (typewriterSpans.length === 0) {
                const paragraphs = contentElement.querySelectorAll('p');
                paragraphs.forEach(p => {
                    const originalText = p.textContent;
                    p.innerHTML = `<span class="typewriter-text">${originalText}</span>`;
                });
            }
            
            // Now get all typewriter spans (original or newly created)
            const updatedTypewriterSpans = contentElement.querySelectorAll('.typewriter-text');
            
            // Chain typewriter effects with promises
            let typewriterPromise = Promise.resolve();
            
            updatedTypewriterSpans.forEach((span, index) => {
                const originalText = span.textContent;
                span.textContent = '';
                
                typewriterPromise = typewriterPromise.then(() => {
                    return typewriterEffect(span, originalText, 20, 100);
                });
            });
        }
    }
    
    // Get feature content elements
    const heroDefault = document.querySelector('.hero-default');
    const featureContents = document.querySelectorAll('.feature-content');
    const heroTitleContainer = document.querySelector('.hero-title-container');
    let activeBox = null;
    
    // Add click event to close buttons
    document.querySelectorAll('.close-feature').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event from bubbling up
            
            // Hide all feature content
            featureContents.forEach(content => content.classList.remove('active'));
            
            // Show default hero content
            heroDefault.classList.remove('hidden');
            
            // Reset active box if exists
            if (activeBox) {
                activeBox.classList.remove('active');
                
                const activeBoxConfig = boxes.find(b => b.id === activeBox.id);
                if (activeBoxConfig) {
                    activeBox.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                    activeBox.style.transform = 'translateY(0) scale(1)';
                    activeBox.style.boxShadow = `0 4px 8px rgba(0, 0, 0, 0.1), 0 0 15px ${activeBoxConfig.color}`;
                    
                    // Reset label color
                    const label = activeBox.querySelector('.box-label');
                    if (label) {
                        label.style.color = activeBoxConfig.color;
                    }
                }
                
                activeBox = null;
            }
        });
    });
});
