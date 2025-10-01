import React from 'react';
import PropTypes from 'prop-types';

// Error fallback component for better error boundaries
const ErrorFallback = ({ error, resetError }) => {
  return (
    <div className="error-fallback" role="alert">
      <div className="error-fallback-content">
        <h2>Oops! Something went wrong</h2>
        <p>We're sorry, but something unexpected happened.</p>
        {process.env.NODE_ENV === 'development' && (
          <details className="error-details">
            <summary>Error Details</summary>
            <pre>{error?.toString()}</pre>
          </details>
        )}
        <div className="error-actions">
          <button onClick={resetError} className="retry-button">
            Try Again
          </button>
          <button onClick={() => window.location.reload()} className="reload-button">
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
};

ErrorFallback.propTypes = {
  error: PropTypes.object,
  resetError: PropTypes.func.isRequired
};

export default ErrorFallback;
