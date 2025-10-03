import React from 'react';
import PropTypes from 'prop-types';

// Accessibility wrapper component
const AccessibilityWrapper = ({ 
  children, 
  role, 
  ariaLabel, 
  ariaDescribedBy, 
  tabIndex,
  onKeyDown 
}) => {
  return (
    <div
      role={role}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
};

AccessibilityWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.string,
  ariaLabel: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
  tabIndex: PropTypes.number,
  onKeyDown: PropTypes.func
};

export default AccessibilityWrapper;
