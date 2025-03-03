/**
 * Utility functions for the everyThink solar system
 */

// Debug mode flag
const DEBUG_MODE = true;

// Debug panel elements
const debugPanel = document.getElementById('debugPanel');
const debugContent = document.getElementById('debugContent');
const toggleDebug = document.getElementById('toggleDebug');

// Initialize debug panel
function initDebugPanel() {
    // Toggle debug panel expansion
    toggleDebug.addEventListener('click', () => {
        debugPanel.classList.toggle('expanded');
        toggleDebug.textContent = debugPanel.classList.contains('expanded') ? 'Debug Info ▼' : 'Debug Info ▲';
    });
}

/**
 * Log debug information to the debug panel
 * @param {string} message - Message to log
 */
function logDebug(message) {
    if (!DEBUG_MODE) return;
    
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    
    // Format timestamp
    const timestamp = new Date();
    const timeString = `${timestamp.getHours().toString().padStart(2, '0')}:${
        timestamp.getMinutes().toString().padStart(2, '0')}:${
        timestamp.getSeconds().toString().padStart(2, '0')}.${
        timestamp.getMilliseconds().toString().padStart(3, '0')}`;
    
    logEntry.innerHTML = `<span class="timestamp">[${timeString}]</span> ${message}`;
    
    // Add to debug panel
    debugContent.appendChild(logEntry);
    debugContent.scrollTop = debugContent.scrollHeight;
}

/**
 * Helper to create a Three.js color from a hex string
 * @param {string} hexColor - Hex color (e.g., "#ff0000")
 * @returns {THREE.Color} Three.js color object
 */
function createThreeColor(hexColor) {
    return new THREE.Color(hexColor);
}

/**
 * Generate a random color
 * @returns {string} Random hex color
 */
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * Linear interpolation between two values
 * @param {number} a - Start value
 * @param {number} b - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
function lerp(a, b, t) {
    return a + (b - a) * t;
}

/**
 * Easing function for smooth transitions (ease-out)
 * @param {number} t - Input value (0-1)
 * @returns {number} Eased value
 */
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// Initialize the debug panel
initDebugPanel();
