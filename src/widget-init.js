import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatbooksRatingsWidget from './Widget';

// Global widget initialization
window.ChatbooksRatings = {
  init: (config = {}) => {
    const {
      containerId = 'chatbooks-ratings-widget',
      ...widgetConfig
    } = config;

    // Find the container element
    const container = document.getElementById(containerId);
    
    if (!container) {
      console.error(`ChatbooksRatings: Container with ID "${containerId}" not found`);
      return;
    }

    // Clear any existing content
    container.innerHTML = '';

    // Create React root and render widget
    const root = createRoot(container);
    root.render(React.createElement(ChatbooksRatingsWidget, { 
      config: widgetConfig,
      containerId 
    }));

    // Store reference for potential cleanup
    container._chatbooksRoot = root;

    console.log('ChatbooksRatings: Widget initialized successfully');
  },

  destroy: (containerId = 'chatbooks-ratings-widget') => {
    const container = document.getElementById(containerId);
    
    if (container && container._chatbooksRoot) {
      container._chatbooksRoot.unmount();
      container._chatbooksRoot = null;
      container.innerHTML = '';
      console.log('ChatbooksRatings: Widget destroyed');
    }
  },

  // Utility function to check if widget is loaded
  isLoaded: () => {
    return typeof window.ChatbooksRatings !== 'undefined';
  }
};

// Auto-initialize if container exists on page load
document.addEventListener('DOMContentLoaded', () => {
  const autoContainer = document.getElementById('chatbooks-ratings-widget');
  if (autoContainer && !autoContainer._chatbooksRoot) {
    window.ChatbooksRatings.init();
  }
});

// Export for module systems
export default window.ChatbooksRatings;
