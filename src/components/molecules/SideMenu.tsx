import React from 'react';
import { XMarkIcon, Cog6ToothIcon, InformationCircleIcon, QuestionMarkCircleIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { useSupabase } from '../../hooks/useSupabase';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
  const { signOut } = useSupabase();

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Logout error:', error);
      } else {
        console.log('Logged out successfully');
        onClose();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    {
      icon: <Cog6ToothIcon className="w-5 h-5" />,
      label: 'Settings',
      onClick: () => {
        console.log('Settings clicked');
        onClose();
      }
    },
    {
      icon: <InformationCircleIcon className="w-5 h-5" />,
      label: 'About',
      onClick: () => {
        console.log('About clicked');
        onClose();
      }
    },
    {
      icon: <QuestionMarkCircleIcon className="w-5 h-5" />,
      label: 'Help',
      onClick: () => {
        window.open('https://youtu.be/47E8MYEPQrI', '_blank');
        onClose();
      }
    },
    {
      icon: <ArrowRightStartOnRectangleIcon className="w-5 h-5" />,
      label: 'Logout',
      onClick: handleLogout
    }
  ];

  return (
    <>
      {/* Backdrop - transparent with blur effect */}
      {isOpen && (
        <div 
          className="fixed inset-0 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}
      
      {/* Menu */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-base-200/95 backdrop-blur-md shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-base-300">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button 
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-circle cursor-pointer"
              aria-label="Close menu"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          
          {/* Menu Items */}
          <div className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={item.onClick}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-base-300 transition-colors cursor-pointer"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-base-300">
            <div className="text-sm text-base-content/70">
              Tater Talk v0.1.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu; 