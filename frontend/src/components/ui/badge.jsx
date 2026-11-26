import React from 'react';
export const Badge = ({ children, className = '' }) => <span className={`hero__badge ${className}`.trim()}>{children}</span>;
