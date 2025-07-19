import React, { useState } from 'react';
import { useSupabase } from '../../hooks/useSupabase';

interface AuthButtonProps {
  variant?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({ 
  variant = 'primary', 
  className = '' 
}) => {
  const { user, signIn, signOut } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthClick = async () => {
    if (user) {
      setIsLoading(true);
      await signOut();
      setIsLoading(false);
    } else {
      // For demo purposes - you might want to create a proper auth form
      setIsLoading(true);
      const { error } = await signIn('demo@example.com', 'password');
      if (error) {
        console.error('Sign in error:', error);
      }
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAuthClick}
      disabled={isLoading}
      className={`btn btn-${variant} ${className}`}
    >
      {isLoading ? (
        <span className="loading loading-spinner loading-sm"></span>
      ) : (
        user ? 'Sign Out' : 'Sign In'
      )}
    </button>
  );
};

export default AuthButton; 