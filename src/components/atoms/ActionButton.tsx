import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  onClick, 
  disabled = false, 
  variant = 'primary',
  size = 'lg',
  children,
  icon 
}) => {
  const buttonClasses = `btn btn-${variant} btn-${size} gap-2`;
  
  return (
    <button 
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && icon}
      {children}
    </button>
  );
};

export default ActionButton; 