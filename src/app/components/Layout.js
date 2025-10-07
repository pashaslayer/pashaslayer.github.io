"use client";

import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import Image from "next/image";

// Helper and constants
const delay = ms => new Promise(res => setTimeout(res, ms));
const leverFrames = ['/lever-1.png', '/lever-2.png', '/lever-3.png', '/lever-4.png'];
const menuButtonImage = '/menu-button.png';

const LightningScrollbar = ({ scrollProgress }) => {
  const pathRef = useRef(null);
  const [pathLength, setPathLength] = useState(0);
  useEffect(() => { if (pathRef.current) setPathLength(pathRef.current.getTotalLength()) }, []);
  const strokeDashoffset = pathLength - (pathLength * scrollProgress);
  return (
    <div className="fixed top-0 right-0 h-full w-12 flex items-center justify-center pointer-events-none z-30">
      <svg width="18" height="95%" viewBox="0 0 24 600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 0 L10 150 L20 300 L5 450 L15 600" stroke="#444" strokeWidth="2" />
        <path ref={pathRef} d="M15 0 L10 150 L20 300 L5 450 L15 600" stroke="white" strokeWidth="4" strokeLinecap="round" strokeDasharray={pathLength} strokeDashoffset={strokeDashoffset} />
      </svg>
    </div>
  );
};

export default function Layout({ children }) {
  const [scroll, setScroll] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleScroll = () => {
    const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    setScroll(totalHeight > 0 ? window.scrollY / totalHeight : 0);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLeverToggle = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const isTurningOn = theme === 'dark';
    if (isTurningOn) {
      for (let i = 1; i < leverFrames.length; i++) {
        await delay(150);
        setCurrentFrame(i);
      }
      setTheme('light');
    } else {
      for (let i = leverFrames.length - 2; i >= 0; i--) {
        await delay(150);
        setCurrentFrame(i);
      }
      setTheme('dark');
    }
    setIsAnimating(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const themeClasses = {
    dark: { bg: 'bg-[#1a1a1a]', text: 'text-[#9f86c0]', altText: 'text-gray-400', hover: 'hover:text-white' },
    light: { bg: 'bg-white', text: 'text-gray-800', altText: 'text-gray-500', hover: 'hover:text-blue-600' }
  };
  const currentTheme = themeClasses[theme];
  const currentLeverImage = leverFrames[currentFrame];

  // --- NEW: Define the accent color based on the theme ---
  const accentColor = theme === 'dark' ? '#9f86c0' : '#374151'; // Violet for dark, gray-700 for light

  return (
    <>
      <LightningScrollbar scrollProgress={scroll} />
      <div className={`fixed inset-0 z-40 flex items-center justify-center transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={toggleMenu}></div>
        <div className="relative w-72 h-auto p-8 rounded-lg">
          <button onClick={toggleMenu} className="absolute top-2 right-2 text-white text-4xl hover:text-orange-400">&times;</button>
          <nav className="flex flex-col items-center space-y-6 text-2xl">
            <Link href="/" className="text-white hover:text-orange-400">Home</Link>
            <Link href="/about" className="text-white hover:text-orange-400">About</Link>
            <Link href="/projects" className="text-white hover:text-orange-400">Projects</Link>
            <Link href="/blog" className="text-white hover:text-orange-400">Blog</Link>
            <Link href="/contact" className="text-white hover:text-orange-400">Contact</Link>
          </nav>
        </div>
      </div>
      
      {/* --- MODIFIED: Added a style prop to set the CSS variable --- */}
      <div
        style={{ '--accent-color': accentColor }}
        className={`min-h-screen font-sans text-2xl p-6 flex flex-col transition-colors duration-500 ${currentTheme.bg} ${currentTheme.text}`}
      >
        <header className="flex justify-between items-start text-3xl z-10">
          <button onClick={toggleMenu} className="relative w-16 h-16 cursor-pointer"><Image src={menuButtonImage} alt="Open Menu" layout="fill" objectFit="contain" /></button>
          <button onClick={handleLeverToggle} disabled={isAnimating} className="relative w-24 h-24"><Image src={currentLeverImage} alt="Theme toggle" layout="fill" objectFit="contain" priority /></button>
        </header>

        {children}

        <footer className={`flex justify-between items-center text-xl transition-colors duration-500 mt-auto pt-12 ${currentTheme.altText}`}>
          <p>Pavel Khakhlou</p>
          <div className="flex space-x-8">
            <Link href="https://github.com/pashaslayer" className={`transition-colors ${currentTheme.hover}`}>Github</Link>
            <Link href="https://www.linkedin.com/in/pavel-khakhlou-b07310327/" className={`transition-colors ${currentTheme.hover}`}>LinkedIn</Link>
          </div>
        </footer>
      </div>
    </>
  );
}