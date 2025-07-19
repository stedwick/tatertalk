import React, { useState, useEffect } from 'react';
import { MicrophoneIcon, ScissorsIcon } from '@heroicons/react/24/outline';
import Header from '../atoms/Header';
import TextArea from '../atoms/TextArea';
import ActionButton from '../atoms/ActionButton';
import SideMenu from '../molecules/SideMenu';

const MainPage: React.FC = () => {
  const savedTheme = document.documentElement.getAttribute('data-theme');
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(savedTheme === 'dark');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Update document theme when isDarkMode changes
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleMenuClick = () => {
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleStartDictation = () => {
    setIsRecording(true);
    // TODO: Implement speech recognition
    console.log('Starting dictation...');
  };

  const handleStopDictation = () => {
    setIsRecording(false);
    // TODO: Stop speech recognition
    console.log('Stopping dictation...');
  };

  const handleCutText = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      setText('');
      console.log('Text cut to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      <Header 
        onMenuClick={handleMenuClick} 
        onThemeToggle={handleThemeToggle}
        isDarkMode={isDarkMode}
      />
      
      <SideMenu 
        isOpen={isMenuOpen}
        onClose={handleMenuClose}
      />
      
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col">
        <div className="flex-1 flex flex-col">
          <TextArea 
            value={text}
            onChange={setText}
          />
        </div>
        
        <div className="flex gap-4 mt-6 justify-center">
          <ActionButton
            onClick={isRecording ? handleStopDictation : handleStartDictation}
            className={isRecording ? 'btn-error btn-lg' : 'btn-outline btn-primary btn-lg'}
            icon={<MicrophoneIcon className="w-6 h-6" />}
          >
            {isRecording ? 'Stop Dictation' : 'Start Dictation'}
          </ActionButton>
          
          <ActionButton
            onClick={handleCutText}
            className="btn-outline btn-lg"
            disabled={!text}
            icon={<ScissorsIcon className="w-6 h-6" />}
          >
            Cut Text
          </ActionButton>
        </div>
      </main>
    </div>
  );
};

export default MainPage; 