import React from 'react';
import clsx from 'clsx';

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  onClick, 
  disabled = false, 
  className,
  children,
  icon 
}) => {
  return (
    <button 
      className={clsx('btn gap-2', className)}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && icon}
      {children}
    </button>
  );
};

export default ActionButton; 