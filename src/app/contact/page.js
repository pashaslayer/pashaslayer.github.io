"use client";

import { useState, useEffect } from 'react';
import Layout from "../components/Layout";

export default function Contact() {
  const [mousePosition, setMousePosition] = useState({ x: -300, y: -300 });
  const [isLightbulbOn, setIsLightbulbOn] = useState(true);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (isLightbulbOn) {
        setMousePosition({ x: event.clientX, y: event.clientY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isLightbulbOn]);

  const maskStyle = {
    position: 'fixed',
    inset: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    pointerEvents: 'none',
    maskImage: `radial-gradient(circle 250px at ${mousePosition.x}px ${mousePosition.y}px, transparent, black)`,
    WebkitMaskImage: `radial-gradient(circle 250px at ${mousePosition.x}px ${mousePosition.y}px, transparent, black)`,
    zIndex: 9999
  };

  const toggleLightbulb = () => {
    setIsLightbulbOn(prev => !prev);
  };

  return (
    // MODIFIED: Pass the toggle function as a prop to Layout
    <Layout onLeverToggle={toggleLightbulb}>
      {isLightbulbOn && <div style={maskStyle} />}

      <main className="flex-grow flex flex-col items-center justify-center text-center">
        <h1 className="text-7xl mb-10">Contact: <br />Pavel.khakhlou@gmx.at</h1>
        
        {/* 
        <button
          onClick={toggleLightbulb}
          className="px-6 py-3 border-2 rounded-lg text-xl z-[10000] hover:bg-white/10 transition-colors"
        >
        
          {isLightbulbOn ? 'Turn Light Off' : 'Turn Light On'}
        </button>
        */}
      </main>
    </Layout>
  );
}