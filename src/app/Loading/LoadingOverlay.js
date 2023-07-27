import React from 'react';
import './LoadingOverlay.css'; // Create a separate CSS file for styling

const LoadingOverlay = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
    </div>
  );
};

export default LoadingOverlay;