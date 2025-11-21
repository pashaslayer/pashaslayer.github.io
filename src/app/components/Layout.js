"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const leverFrames = [
  "/lever-1.png",
  "/lever-2.png",
  "/lever-3.png",
  "/lever-4.png",
];
const menuButtonImage = "/menu-button.png";

const QUOTES = [
  {
    content:
      "Everyone thinks of changing the world, but no one thinks of changing himself.",
    author: "Leo Tolstoy",
  },
  { content: "Beauty will save the world.", author: "Fyodor Dostoevsky" },
  {
    content: "The two most powerful warriors are patience and time.",
    author: "Leo Tolstoy",
  },
  { content: "Manuscripts don't burn.", author: "Mikhail Bulgakov" },
  {
    content:
      "The mystery of human existence lies not in just staying alive, but in finding something to live for.",
    author: "Fyodor Dostoevsky",
  },
  {
    content:
      "Wrong does not cease to be wrong because the majority share in it.",
    author: "Leo Tolstoy",
  },
  {
    content: "To love is to suffer and there can be no love otherwise.",
    author: "Fyodor Dostoevsky",
  },
  {
    content: "If you look for perfection, you'll never be content.",
    author: "Leo Tolstoy",
  },
  { content: "Man is what he believes.", author: "Anton Chekhov" },
  {
    content: "A man's happiness must come from within himself.",
    author: "Ivan Turgenev",
  },
  {
    content: "To know the world, one must construct it.",
    author: "Cesare Pavese",
  },
  {
    content:
      "There is nothing like returning to a place that remains unchanged to find the ways in which you yourself have altered.",
    author: "Nelson Mandela",
  },
];

const LightningScrollbar = ({ scrollProgress }) => {
  const pathRef = useRef(null);
  const [pathLength, setPathLength] = useState(0);
  useEffect(() => {
    if (pathRef.current) setPathLength(pathRef.current.getTotalLength());
  }, []);
  const strokeDashoffset = pathLength - pathLength * scrollProgress;
  return (
    <div className="fixed top-0 right-0 h-full w-12 flex items-center justify-center pointer-events-none z-30">
      <svg
        width="18"
        height="95%"
        viewBox="0 0 24 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 0 L10 150 L20 300 L5 450 L15 600"
          stroke="#444"
          strokeWidth="2"
        />
        <path
          ref={pathRef}
          d="M15 0 L10 150 L20 300 L5 450 L15 600"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={pathLength}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
    </div>
  );
};

export default function Layout({ children, onLeverToggle = () => {} }) {
  const [scroll, setScroll] = useState(0);
  const [hasScroll, setHasScroll] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const [quote, setQuote] = useState({ content: "", author: "" });

  useEffect(() => {
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(randomQuote);
  }, []);

  const handleScroll = () => {
    const totalHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    setScroll(totalHeight > 0 ? window.scrollY / totalHeight : 0);
  };

  useEffect(() => {
    const checkScrollability = () => {
      const doc = document.documentElement;
      const isScrollable = doc.scrollHeight > doc.clientHeight + 1;
      setHasScroll(isScrollable);
    };
    checkScrollability();
    window.addEventListener("resize", checkScrollability);
    const observer = new ResizeObserver(checkScrollability);
    if (document.body) observer.observe(document.body);
    return () => {
      window.removeEventListener("resize", checkScrollability);
      observer.disconnect();
    };
  }, [children]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLeverToggle = async () => {
    if (isAnimating) return;
    onLeverToggle();
    setIsAnimating(true);
    const isTurningOn = theme === "dark";
    if (isTurningOn) {
      for (let i = 1; i < leverFrames.length; i++) {
        await delay(150);
        setCurrentFrame(i);
      }
      setTheme("light");
    } else {
      for (let i = leverFrames.length - 2; i >= 0; i--) {
        await delay(150);
        setCurrentFrame(i);
      }
      setTheme("dark");
    }
    setIsAnimating(false);
  };

  const themeClasses = {
    dark: {
      bg: "bg-[#1a1a1a]",
      text: "text-[#9f86c0]",
      altText: "text-gray-400",
      hover: "hover:text-white",
    },
    light: {
      bg: "bg-white",
      text: "text-gray-800",
      altText: "text-gray-500",
      hover: "hover:text-blue-600",
    },
  };
  const currentTheme = themeClasses[theme];
  const currentLeverImage = leverFrames[currentFrame];
  const accentColor = theme === "dark" ? "#9f86c0" : "#374151";

  return (
    <>
      {hasScroll && <LightningScrollbar scrollProgress={scroll} />}

      <div
        className={`fixed inset-0 z-40 flex items-center justify-center transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={toggleMenu}
        ></div>
        <div className="relative w-72 h-auto p-8 rounded-lg">
          <button
            onClick={toggleMenu}
            className="absolute top-2 right-2 text-white text-4xl hover:text-orange-400"
          >
            &times;
          </button>
          <nav className="flex flex-col items-center space-y-6 text-2xl">
            <Link href="/" className="text-white hover:text-orange-400">
              Home
            </Link>
            <Link href="/about" className="text-white hover:text-orange-400">
              About
            </Link>
            <Link href="/projects" className="text-white hover:text-orange-400">
              Projects
            </Link>
            <Link href="/contact" className="text-white hover:text-orange-400">
              Contact
            </Link>
          </nav>
        </div>
      </div>

      <div
        style={{ "--accent-color": accentColor }}
        className={`min-h-screen font-sans text-2xl p-6 flex flex-col transition-colors duration-500 ${currentTheme.bg} ${currentTheme.text}`}
      >
        <header className="flex justify-between items-start text-3xl z-10">
          <button
            onClick={toggleMenu}
            className="relative w-16 h-16 cursor-pointer"
          >
            <Image
              src={menuButtonImage}
              alt="Open Menu"
              layout="fill"
              objectFit="contain"
            />
          </button>

          <button
            onClick={handleLeverToggle}
            disabled={isAnimating}
            className="relative w-20 h-20"
          >
            <Image
              src={currentLeverImage}
              alt="Theme toggle"
              layout="fill"
              objectFit="contain"
              priority
            />
          </button>
        </header>

        {children}

        <footer
          className={`flex justify-between items-end text-xl transition-colors duration-500 mt-auto pt-12 ${currentTheme.altText}`}
        >
          <div className="flex flex-col max-w-md text-sm pb-2 min-h-[60px] justify-end">
            {quote.content && (
              <div className="animate-in fade-in duration-1000">
                <p className="italic opacity-80">&quot;{quote.content}&quot;</p>
                <p className="text-xs mt-1 opacity-60">— {quote.author}</p>
              </div>
            )}
          </div>

          <div className="flex space-x-8 pb-2">
            <Link
              href="https://github.com/pashaslayer"
              className={`transition-colors ${currentTheme.hover}`}
            >
              Github
            </Link>
            <Link
              href="https://www.linkedin.com/in/pavel-khakhlou-b07310327/"
              className={`transition-colors ${currentTheme.hover}`}
            >
              LinkedIn
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
}