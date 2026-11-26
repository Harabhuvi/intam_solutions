import React from 'react';
export const Button = ({ variant = 'primary', size, asChild = false, className = '', children, ...props }) => {
  const classes = ['btn', `btn--${variant}`, size === 'lg' ? 'btn--lg' : '', className].filter(Boolean).join(' ');
  if (asChild && React.isValidElement(children)) return React.cloneElement(children, { ...props, className: [classes, children.props.className].filter(Boolean).join(' ') });
  return <button {...props} className={classes}>{children}</button>;
};
