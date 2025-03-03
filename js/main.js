/**
 * Main script for the everyThink solar system
 * Creates and manages the 3D visualization and user interactions
 */

// Global variables
let scene, camera, renderer, clock;
let planets = [];
let stars;
let orbitLines = [];
let hoveredPlanet = null;
let selectedPlanet = null;
let loadingElement = document.getElementById('loadingScreen');
let planetTooltip = document.getElementById('planetTooltip');
let solarSystemContainer = document.getElementById('solarSystem');
let isTooltipExpanded = false;
let orbitSpeedMultiplier = 1.0;
let logoMode = false;
let cameraLocked = true;
let orbitControls;

// Camera target positions (for smooth transitions)
let targetCameraPosition = new THREE.Vector3(0, 80, 0);
let targetLookAt = new THREE.Vector3(0, 0, 0);

// Initialize the solar system
function initSolarSystem() {
    logDebug('Initializing solar system');
    
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    // Create camera
    const aspectRatio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 1000);
    camera.position.set(0, 80, 0); // Top-down view by default
    camera.lookAt(0, 0, 0);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    solarSystemContainer.appendChild(renderer.domElement);
    
    // Create clock for animation timing
    clock = new THREE.Clock();
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create stars
    createStars();
    
    // Create planets
    createPlanets();
    
    // Create orbit controls
    setupOrbitControls();
    
    // Set up event listeners
    setupEventListeners();
    
    // Start animation loop
    animate();
    
    // Hide loading screen after everything is loaded
    initLoading();
    
    logDebug('Solar system initialized');
}

// Create background stars
function createStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        opacity: 0.8
    });
    
    const starsVertices = [];
    for (let i = 0; i < 5000; i++) {
        const x = THREE.MathUtils.randFloatSpread(1000);
        const y = THREE.MathUtils.randFloatSpread(1000);
        const z = THREE.MathUtils.randFloatSpread(1000);
        
        // Exclude center area to avoid stars inside the solar system
        if (Math.sqrt(x*x + y*y + z*z) < 100) continue;
        
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

// Create planets from the configuration data
function createPlanets() {
    PLANETS_DATA.forEach(data => {
        createPlanet(data);
    });
    
    // Create moons after all planets exist
    MOONS_DATA.forEach(data => {
        createMoon(data);
    });
}

// Create a single planet
function createPlanet(data) {
    // Create planet group (for positioning)
    const group = new THREE.Group();
    scene.add(group);
    
    // Create planet mesh
    const geometry = new THREE.SphereGeometry(data.size, 32, 32);
    const material = new THREE.MeshLambertMaterial({
        color: data.color,
        emissive: new THREE.Color(data.color).multiplyScalar(0.1)
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);
    
    // Create orbit - just the circular line
    const orbit = createOrbitRing(data.distance);
    scene.add(orbit);
    orbitLines.push(orbit);
    
    // Store planet data
    const planet = {
        mesh,
        group,
        data,
        angle: Math.random() * Math.PI * 2, // Random start position
        moons: []
    };
    
    planets.push(planet);
    
    // Set initial position
    updatePlanetPosition(planet);
}

// Create a moon orbiting around a parent planet
function createMoon(data) {
    // Find parent planet
    const parentPlanet = planets.find(p => p.data.id === data.parentId);
    if (!parentPlanet) {
        logDebug(`Parent planet ${data.parentId} not found for moon ${data.id}`);
        return;
    }
    
    // Create moon group
    const group = new THREE.Group();
    parentPlanet.group.add(group);
    
    // Create moon mesh
    const geometry = new THREE.SphereGeometry(data.size, 16, 16);
    const material = new THREE.MeshLambertMaterial({
        color: data.color,
        emissive: new THREE.Color(data.color).multiplyScalar(0.1)
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);
    
    // Create orbit
    const orbit = createOrbitRing(data.distance);
    orbit.scale.set(1, 1, 1); // Scale orbit to moon size
    parentPlanet.group.add(orbit);
    orbitLines.push(orbit);
    
    // Store moon data
    const moon = {
        mesh,
        group,
        data,
        angle: Math.random() * Math.PI * 2, // Random start position
        parentPlanet
    };
    
    // Add to parent's moons array
    parentPlanet.moons.push(moon);
    
    // Set initial position
    updateMoonPosition(moon);
}

// Create orbit ring
function createOrbitRing(radius) {
    const segments = 64;
    const material = new THREE.LineBasicMaterial({
        color: 0x666666,
        linewidth: 3,  // Thicker lines
        transparent: true,
        opacity: 0.8   // More visible
    });
    
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(segments * 3);
    
    for (let i = 0; i < segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const line = new THREE.Line(geometry, material);
    line.rotation.x = Math.PI / 2;
    return line;
}

// Update planet position based on its orbit
function updatePlanetPosition(planet) {
    const { group, data, angle } = planet;
    
    // Position in orbit
    group.position.x = Math.cos(angle) * data.distance;
    group.position.z = Math.sin(angle) * data.distance;
    group.position.y = 0;
}

// Update moon position based on its orbit
function updateMoonPosition(moon) {
    const { group, data, angle } = moon;
    
    // Position in orbit around parent
    group.position.x = Math.cos(angle) * data.distance;
    group.position.z = Math.sin(angle) * data.distance;
    group.position.y = 0;
}

// Set up orbit controls for free camera movement
function setupOrbitControls() {
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;
    orbitControls.screenSpacePanning = false;
    orbitControls.maxPolarAngle = Math.PI;
    orbitControls.enabled = !cameraLocked; // Initially disabled
    
    // Prevent OrbitControls from hijacking all click events
    orbitControls.addEventListener('change', () => {
        // Update target values to match current camera position when in free mode
        if (!cameraLocked) {
            targetCameraPosition.copy(camera.position);
            // targetLookAt remains the same
        }
    });
}

// Set up all event listeners
function setupEventListeners() {
    // Window resize
    window.addEventListener('resize', onWindowResize);
    
    // Mouse events for tooltips and selection
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);
    
    // Control buttons
    const resetViewBtn = document.getElementById('resetView');
    const topViewBtn = document.getElementById('topView');
    const logoModeBtn = document.getElementById('logoMode');
    const cameraLockToggleBtn = document.getElementById('cameraLockToggle');
    
    resetViewBtn.addEventListener('click', resetView);
    topViewBtn.addEventListener('click', topView);
    logoModeBtn.addEventListener('click', toggleLogoMode);
    
    // Camera lock toggle
    cameraLockToggleBtn.addEventListener('click', toggleCameraLock);
    
    // Arrow controls for camera movement
    document.querySelectorAll('.arrow-btn').forEach(btn => {
        btn.addEventListener('click', handleArrowControl);
    });
    
    // Orbit speed slider
    const speedSlider = document.getElementById('speedSlider');
    speedSlider.addEventListener('input', () => {
        orbitSpeedMultiplier = speedSlider.value / 100;
        logDebug(`Orbit speed set to ${orbitSpeedMultiplier}x`);
    });
    
    // Coin icons
    document.querySelectorAll('.coin-icon').forEach(coin => {
        coin.addEventListener('click', () => {
            const section = coin.getAttribute('data-section');
            showSection(section);
        });
    });
}

// Handle window resize
function onWindowResize() {
    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    // Update renderer size
    if (logoMode) {
        renderer.setSize(150, 150);
    } else {
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Mouse move handler for hover effects
function onMouseMove(event) {
    // Convert mouse position to normalized device coordinates
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Raycasting to detect hover
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    // Get objects intersecting the ray
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    // Find the first planet or moon that was hit
    let hitObject = null;
    for (let i = 0; i < intersects.length; i++) {
        const object = intersects[i].object;
        if (object.type === 'Mesh' && object !== stars) {
            hitObject = object;
            break;
        }
    }
    
    // Handle hover state
    if (hitObject !== hoveredPlanet) {
        // Reset previous hover
        if (hoveredPlanet) {
            unhighlightObject(hoveredPlanet);
            hideTooltip();
        }
        
        // Set new hover
        if (hitObject) {
            highlightObject(hitObject);
            showTooltip(hitObject, event);
        }
        
        hoveredPlanet = hitObject;
    } else if (hoveredPlanet) {
        // Update tooltip position if still hovering
        updateTooltipPosition(event);
    }
}

// Highlight a planet or moon on hover
function highlightObject(object) {
    if (object.material && object.material.emissive) {
        object.userData.originalEmissive = object.material.emissive.clone();
        object.material.emissive = new THREE.Color(object.material.color).multiplyScalar(0.15);
    }
}

// Remove highlight from a planet or moon
function unhighlightObject(object) {
    if (object.material && object.material.emissive && object.userData.originalEmissive) {
        object.material.emissive.copy(object.userData.originalEmissive);
    }
}

// Show tooltip for a planet or moon
function showTooltip(object, event) {
    // Find planet data
    const planetObj = planets.find(p => p.mesh === object);
    if (!planetObj) return;
    
    // Set tooltip content
    const { name, description } = planetObj.data;
    document.querySelector('.tooltip-title').textContent = name;
    document.querySelector('.tooltip-content').innerHTML = `<p>${description}</p>`;
    
    // Show tooltip
    planetTooltip.classList.add('visible');
    updateTooltipPosition(event);
}

// Update tooltip position to follow mouse
function updateTooltipPosition(event) {
    if (!isTooltipExpanded) {
        planetTooltip.style.left = `${event.clientX + 15}px`;
        planetTooltip.style.top = `${event.clientY + 15}px`;
    }
}

// Hide tooltip
function hideTooltip() {
    planetTooltip.classList.remove('visible');
    isTooltipExpanded = false;
    planetTooltip.classList.remove('expanded');
}

// Handle click events
function onClick(event) {
    // Ignore clicks on UI elements
    if (event.target.closest('#controls') || 
        event.target.closest('#coinIcons') || 
        event.target.closest('#contentArea') ||
        event.target.closest('#debugPanel') ||
        event.target.closest('.camera-arrows')) {
        return;
    }
    
    if (hoveredPlanet) {
        // If it's a planet, focus on it
        const planetObj = planets.find(p => p.mesh === hoveredPlanet);
        if (planetObj) {
            focusOnPlanet(planetObj);
        } else {
            // Toggle expanded state for sun or other objects
            isTooltipExpanded = !isTooltipExpanded;
            if (isTooltipExpanded) {
                planetTooltip.classList.add('expanded');
            } else {
                planetTooltip.classList.remove('expanded');
            }
        }
    } else {
        // Hide tooltip if clicking elsewhere
        hideTooltip();
    }
}

// Focus camera on a specific planet
function focusOnPlanet(planet) {
    const planetPos = planet.group.position.clone();
    
    // Position camera to view planet from the side
    const cameraOffset = new THREE.Vector3(-20, 10, 0);
    cameraOffset.applyQuaternion(planet.group.quaternion);
    
    // Set target positions
    targetCameraPosition.copy(planetPos).add(cameraOffset);
    targetLookAt.copy(planetPos);
    
    // Show expanded info panel
    showTooltip(planet.mesh);
    isTooltipExpanded = true;
    planetTooltip.classList.add('expanded');
    
    // Position tooltip on right side of screen
    planetTooltip.style.left = 'auto';
    planetTooltip.style.right = '50px';
    planetTooltip.style.top = '50%';
    planetTooltip.style.transform = 'translateY(-50%) scale(1)';
}

// Reset view to initial position
function resetView() {
    targetCameraPosition.set(0, 80, 0);
    targetLookAt.set(0, 0, 0);
    hideTooltip();
    logDebug('View reset');
}

// Set top-down view
function topView() {
    targetCameraPosition.set(0, 100, 0);
    targetLookAt.set(0, 0, 0);
    logDebug('Top view set');
}

// Toggle logo mode (small top-left display)
function toggleLogoMode() {
    logoMode = !logoMode;
    
    if (logoMode) {
        // Enter logo mode
        solarSystemContainer.classList.add('logo-mode');
        renderer.setSize(150, 150);
        
        // Position in top-left corner
        solarSystemContainer.style.top = '20px';
        solarSystemContainer.style.left = '20px';
        
        // Show content area
        document.getElementById('contentArea').classList.add('visible');
        
        // Hide stars in logo mode
        if (stars) stars.visible = false;
        
        // Make orbit lines more visible
        orbitLines.forEach(line => {
            line.material.linewidth = 3; 
            line.material.opacity = 0.8;
        });
        
        logDebug('Logo mode enabled');
    } else {
        // Exit logo mode
        solarSystemContainer.classList.remove('logo-mode');
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Reset position
        solarSystemContainer.style.top = '0';
        solarSystemContainer.style.left = '0';
        
        // Hide content area
        document.getElementById('contentArea').classList.remove('visible');
        
        // Show stars again
        if (stars) stars.visible = true;
        
        // Reset orbit lines visibility
        orbitLines.forEach(line => {
            line.material.linewidth = 2;
            line.material.opacity = 0.6;
        });
        
        logDebug('Logo mode disabled');
    }
}

// Toggle camera lock
function toggleCameraLock() {
    cameraLocked = !cameraLocked;
    
    const lockButton = document.getElementById('cameraLockToggle');
    const arrowControls = document.querySelector('.camera-arrows');
    
    if (cameraLocked) {
        // Enable lock
        lockButton.innerHTML = '<i class="fas fa-lock"></i> Lock Camera';
        lockButton.classList.remove('unlocked');
        arrowControls.classList.remove('visible');
        orbitControls.enabled = false;
        
        logDebug('Camera locked');
    } else {
        // Disable lock
        lockButton.innerHTML = '<i class="fas fa-lock-open"></i> Free Camera';
        lockButton.classList.add('unlocked');
        arrowControls.classList.add('visible');
        orbitControls.enabled = true;
        
        logDebug('Camera unlocked');
    }
}

// Handle arrow control clicks
function handleArrowControl(event) {
    if (cameraLocked) return;
    
    const moveSpeed = 5;
    
    if (event.currentTarget.classList.contains('arrow-up')) {
        camera.position.z -= moveSpeed;
    } else if (event.currentTarget.classList.contains('arrow-down')) {
        camera.position.z += moveSpeed;
    } else if (event.currentTarget.classList.contains('arrow-left')) {
        camera.position.x -= moveSpeed;
    } else if (event.currentTarget.classList.contains('arrow-right')) {
        camera.position.x += moveSpeed;
    } else if (event.currentTarget.classList.contains('arrow-center')) {
        // Reset to current target
        camera.lookAt(targetLookAt);
    }
    
    // Update target position
    targetCameraPosition.copy(camera.position);
}

// Show content section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }
    
    // Update active coin
    document.querySelectorAll('.coin-icon').forEach(coin => {
        coin.classList.remove('active');
        if (coin.getAttribute('data-section') === sectionId) {
            coin.classList.add('active');
        }
    });
    
    // Ensure logo mode is active to show content
    if (!logoMode) {
        toggleLogoMode();
    }
}

// Initialize the loading screen
function initLoading() {
    // Handle the loading screen transition
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingElement.style.opacity = 0;
            setTimeout(() => {
                loadingElement.style.display = 'none';
            }, 800);
        }, 1000); // Show loading for at least 1 second
    });
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Calculate delta time
    const delta = clock.getDelta();
    
    // Update planets
    planets.forEach((planet) => {
        const { mesh, group, data } = planet;
        
        // Update orbit angle - scale by deltaTime for consistent speed
        planet.angle += data.orbitSpeed * orbitSpeedMultiplier * 0.01;
        
        // Position planet in orbit
        updatePlanetPosition(planet);
        
        // Rotate planet on its axis - also scale by orbitSpeedMultiplier
        mesh.rotation.y += data.rotationSpeed * orbitSpeedMultiplier * delta;
        
        // Update moons
        planet.moons.forEach(moon => {
            // Update orbit angle
            moon.angle += moon.data.orbitSpeed * orbitSpeedMultiplier * 0.01;
            
            // Position moon in orbit around parent
            updateMoonPosition(moon);
            
            // Rotate moon on its axis
            moon.mesh.rotation.y += moon.data.rotationSpeed * orbitSpeedMultiplier * delta;
        });
    });
    
    // Only apply automatic camera positioning if camera is locked
    if (cameraLocked) {
        // Smooth camera movement with lerping
        camera.position.lerp(targetCameraPosition, 0.05);
        camera.lookAt(targetLookAt);
    } else {
        // Update orbit controls
        orbitControls.update();
    }
    
    // Render the scene
    renderer.render(scene, camera);
}

// Initialize the solar system when the DOM is loaded
document.addEventListener('DOMContentLoaded', initSolarSystem);
