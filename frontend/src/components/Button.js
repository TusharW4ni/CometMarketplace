import React from 'react';

const Button = ({ children, disabled=false, className, ...rest }) => {
  const buttonClasses = `font-bold py-2 px-4 rounded ${className}`;

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
