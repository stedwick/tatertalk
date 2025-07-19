import React from 'react';
import { Bars3Icon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  onMenuClick: () => void;
  onThemeToggle: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onThemeToggle, isDarkMode }) => {
  return (
    <header className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <button 
          className="btn btn-ghost btn-circle"
          onClick={onMenuClick}
          aria-label="Menu"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>
      <div className="navbar-center">
        <h1 className="text-2xl font-bold text-primary">Tater 🎙️ Talk</h1>
      </div>
      <div className="navbar-end">
        <button 
          className="btn btn-ghost btn-circle"
          onClick={onThemeToggle}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};

export default Header; 