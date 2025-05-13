// API Configuration
const config = {
    // Use the correct backend URL
    API_BASE_URL: 'https://kosge-backend.onrender.com',
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    DEBUG: true // Enable debug logging
};

// Debug logging
function debugLog(...args) {
    if (config.DEBUG) {
        console.log('[KOSGE]', ...args);
    }
}

// Log configuration on load
debugLog('Configuration loaded:', config);

// Prevent accidental modification
Object.freeze(config);

// Export configuration
window.APP_CONFIG = config;