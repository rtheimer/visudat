// config.js

// Define the API protocol based on the current window location (http or https)
export const apiProtocol = window.location.protocol;

// Define the API base URL based on the current window location's hostname (e.g., domain or IP address)
export const apiBaseUrl = window.location.hostname;

// Define the API port based on the current window location's port
// Note: This is a conditional assignment for development and build environments
// In the build environment, use the dynamic port from the window.location.port
// In the development environment, use a specific port (e.g., 8000)
export const apiPort = window.location.port; // build
//export const apiPort = 8000; // development
