"use client";

import Layout from "./components/Layout";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [showAltImage, setShowAltImage] = useState(false);

  const roles = [
    "Full Stack Developer",
    "Gym enjoer",
    "Problem Solver",
    "Tech Enthusiast",
  ];

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % roles.length;
      const fullText = roles[i];

      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 75 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, roles, typingSpeed]);

  const handleImageClick = () => {
    setShowAltImage(!showAltImage);
  };

  return (
    <Layout>
      <main className="flex-grow flex flex-col justify-center items-center text-center px-4 -mt-16 sm:-mt-20">
        <div className="relative mb-8">
          {showAltImage && (
            <div className="absolute -top-40 left-1/2 transform -translate-x-1/2 z-10 transition-all duration-300">
              <Image
                src="/centipede.png"
                alt="Alternate profile picture"
                width={900}
                height={900}
                className="w-64 h-64 sm:w-80 sm:h-80 rounded-lg shadow-lg object-contain"
              />
            </div>
          )}

          <div
            className="relative w-32 h-32 sm:w-40 sm:h-40 cursor-pointer z-0"
            onClick={handleImageClick}
          >
            <div className="absolute inset-0 bg-gray-400 rounded-full"></div>

            <div className="absolute inset-0 rounded-full overflow-hidden">
              <Image
                src="/profile.png"
                alt="Profile picture"
                width={160}
                height={160}
                className="rounded-full w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl tracking-wider mb-4">
          @pashaslayer
        </h1>

        <div className="h-8 flex items-center justify-center">
          <span className="text-xl sm:text-2xl text-gray-300 font-mono">
            {text}
            <span className="ml-1 animate-pulse">|</span>
          </span>
        </div>
      </main>
    </Layout>
  );
}
