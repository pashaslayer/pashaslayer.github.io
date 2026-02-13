"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";

// --- CONFIGURATION ---

const sentences = [
  "Привет Маргарита...",
  "Я скучал...",
  "У меня есть к тебе несколько вопросов...",
  "Ты готова?",
];

const questions = [
  {
    question: "Кто любит тебя больше всех в этом мире?",
    answers: [
      { text: "Райан Гослинг", correct: false },
      { text: "Паша", correct: true },
      { text: "Зеленский", correct: false },
      { text: "Чехов Антон Павлович", correct: false },
    ],
  },
  {
    question: "Когда мы начали встречаться?",
    answers: [
      { text: "22 АвLуста", correct: false },
      { text: "22 A8густа", correct: false },
      { text: "22 Авгусta", correct: false },
      { text: "22 Августа", correct: true },
    ],
  },
  {
    question: "Кого ты любишь больше всех?",
    answers: [
      { text: "Лиса", correct: false },
      { text: "Ирбис", correct: false },
      { text: "Ксюша", correct: false },
      { text: "Паша", correct: true },
    ],
  },
  {
    question: "Какого цвета Пашины глаза?",
    answers: [
      { text: "Зелёные", correct: true },
      { text: "Синие", correct: false },
      { text: "Ананас", correct: false },
      { text: "Арбуз", correct: false },
    ],
  },
  {
    question: "Что ты больше всего любишь делать?",
    answers: [
      { text: "Кокос", correct: true },
      { text: "Принимать ванны", correct: true },
      { text: "Зеленый Чай с молоком", correct: true },
      { text: "Какао", correct: true },
    ],
  },
];

export default function Home() {
  const [stage, setStage] = useState("intro");

  // Intro
  const [textElements, setTextElements] = useState([]);
  const textElementsRef = useRef([]); // synchronous storage
  const sentenceIdxRef = useRef(0);
  const charIdxRef = useRef(0);
  const typingTimeoutRef = useRef(null);
  const pauseTimeoutRef = useRef(null);

  // Proposal
  const [noBtnPos, setNoBtnPos] = useState({ top: "60%", left: "60%" });

  // Quiz
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [results, setResults] = useState([null, null, null, null, null]);

  // Wheel & Host
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isHostTalking, setIsHostTalking] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showResetMsg, setShowResetMsg] = useState(false);

  // Result Animation State
  const [chaoticPhotos, setChaoticPhotos] = useState([]);

  // Audio Refs
  const typingAudioRef = useRef(null);
  const buzzerAudioRef = useRef(null);
  const wheelAudioRef = useRef(null);
  const hostAudioRef = useRef(null);
  const finalAudioRef = useRef(null);
  const trueAudioRef = useRef(null); // for correct answer

  // --- 1. INTRO: TYPING EFFECT (fixed double letters) ---
  useEffect(() => {
    if (stage !== "intro") {
      // Clear any pending timeouts when leaving intro stage
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
      return;
    }

    // Reset progress
    sentenceIdxRef.current = 0;
    charIdxRef.current = 0;
    textElementsRef.current = [];
    setTextElements([]);

    const playTyping = () => {
      if (typingAudioRef.current) {
        typingAudioRef.current.currentTime = 0;
        typingAudioRef.current.play().catch(() => {});
      }
    };

    const scheduleNext = () => {
      // If we've completed all sentences, move to transition after a delay
      if (sentenceIdxRef.current >= sentences.length) {
        pauseTimeoutRef.current = setTimeout(() => {
          setStage("transition");
        }, 4000);
        return;
      }

      const sentence = sentences[sentenceIdxRef.current];

      if (charIdxRef.current < sentence.length) {
        // Type next character
        playTyping();

        // Update the ref synchronously
        const newArr = textElementsRef.current;
        if (charIdxRef.current === 0) {
          // Start new sentence with random position
          const top = Math.floor(Math.random() * 60) + 20 + "%";
          const left = Math.floor(Math.random() * 60) + 10 + "%";
          newArr.push({
            text: sentence[0],
            top,
            left,
            id: Date.now() + Math.random(),
          });
        } else {
          // Append to last element
          newArr[newArr.length - 1].text += sentence[charIdxRef.current];
        }

        // Update state with a shallow copy of the ref's array to trigger re-render
        setTextElements([...newArr]);

        charIdxRef.current++;
        typingTimeoutRef.current = setTimeout(scheduleNext, 100);
      } else {
        // End of sentence: pause before next sentence
        charIdxRef.current = 0;
        sentenceIdxRef.current++;
        pauseTimeoutRef.current = setTimeout(scheduleNext, 1500);
      }
    };

    // Start the chain
    scheduleNext();

    // Cleanup on unmount or stage change
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, [stage]);

  // --- 2. TRANSITION EFFECT ---
  useEffect(() => {
    if (stage === "transition") {
      if (buzzerAudioRef.current) {
        buzzerAudioRef.current
          .play()
          .catch((e) => console.log("Audio play failed", e));
      }

      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#ff0000", "#ff69b4"],
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#ff0000", "#ff69b4"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        } else {
          setStage("proposal");
        }
      };
      frame();
    }
  }, [stage]);

  // --- 3. FINAL MUSIC & PHOTO GENERATION ---
  useEffect(() => {
    if (stage === "result") {
      if (finalAudioRef.current) {
        finalAudioRef.current.volume = 0.6;
        finalAudioRef.current.currentTime = 0;
        finalAudioRef.current.play().catch((error) => {
          console.error("Final music playback failed:", error);
        });
      }

      const newPhotos = Array.from({ length: 40 }).map((_, i) => {
        const startSide = Math.floor(Math.random() * 4);

        let xStart, yStart, xEnd, yEnd;

        if (startSide === 0) {
          // Top -> Bottom
          xStart = Math.random() * 100;
          yStart = -20;
          xEnd = Math.random() * 140 - 20;
          yEnd = 120;
        } else if (startSide === 1) {
          // Right -> Left
          xStart = 120;
          yStart = Math.random() * 100;
          xEnd = -20;
          yEnd = Math.random() * 140 - 20;
        } else if (startSide === 2) {
          // Bottom -> Top
          xStart = Math.random() * 100;
          yStart = 120;
          xEnd = Math.random() * 140 - 20;
          yEnd = -20;
        } else {
          // Left -> Right
          xStart = -20;
          yStart = Math.random() * 100;
          xEnd = 120;
          yEnd = Math.random() * 140 - 20;
        }

        return {
          id: i,
          photoId: (i % 5) + 1,
          xStart: `${xStart}vw`,
          yStart: `${yStart}vh`,
          xEnd: `${xEnd}vw`,
          yEnd: `${yEnd}vh`,
          rStart: `${Math.random() * 360}deg`,
          rEnd: `${Math.random() * 360 + 360}deg`,
          duration: `${Math.random() * 20 + 15}s`,
          delay: `${Math.random() * 15}s`,
          size: `${Math.random() * 150 + 100}px`,
        };
      });

      setChaoticPhotos(newPhotos);
    }
  }, [stage]);

  // --- 4. PROPOSAL LOGIC ---
  const handleNoHover = () => {
    const x = Math.random() * 80 + 10;
    const y = Math.random() * 80 + 10;
    setNoBtnPos({ top: `${y}%`, left: `${x}%` });
  };

  const handleYes = () => {
    setStage("greeting");
  };

  // --- 5. GAME SHOW LOGIC ---

  const initiateSpinSequence = () => {
    if (isSpinning || isHostTalking) return;

    setIsHostTalking(true);

    if (hostAudioRef.current) {
      hostAudioRef.current.currentTime = 0;
      hostAudioRef.current.play().catch((e) => {
        console.error("Host audio failed", e);
        startWheelSpin();
      });
    }
  };

  const startWheelSpin = () => {
    setIsHostTalking(false);
    setIsSpinning(true);

    if (wheelAudioRef.current) {
      wheelAudioRef.current.currentTime = 0;
      wheelAudioRef.current.play();
    }

    const newRotation = wheelRotation + 2000 + Math.random() * 360;
    setWheelRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);

      if (wheelAudioRef.current) {
        wheelAudioRef.current.pause();
        wheelAudioRef.current.currentTime = 0;
      }

      setShowQuestionModal(true);
    }, 6000);
  };

  const resetGame = () => {
    setShowResetMsg(false);
    setCurrentQuestion(0);
    setResults([null, null, null, null, null]);
    setStage("quiz");
  };

  const handleAnswer = (isCorrect) => {
    const newResults = [...results];

    if (isCorrect) {
      // Play true sound
      if (trueAudioRef.current) {
        trueAudioRef.current.currentTime = 0;
        trueAudioRef.current.play().catch((e) => {
          console.error("True sound failed", e);
        });
      }

      newResults[currentQuestion] = "correct";
      setResults(newResults);
      setShowQuestionModal(false);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setStage("result");
      }
    } else {
      if (buzzerAudioRef.current) {
        buzzerAudioRef.current.currentTime = 0;
        buzzerAudioRef.current
          .play()
          .catch((e) => console.error("Buzzer play failed", e));
      }

      newResults[currentQuestion] = "wrong";
      setResults(newResults);
      setShowQuestionModal(false);

      setShowResetMsg(true);
      setTimeout(() => {
        resetGame();
      }, 2500);
    }
  };

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-1000 overflow-hidden ${
        stage === "intro" ? "bg-black" : "bg-white"
      }`}
    >
      {/* Audio Elements */}
      <audio ref={typingAudioRef} src="/typing.mp3" />
      <audio ref={buzzerAudioRef} src="/buzzer.mp3" />
      <audio ref={wheelAudioRef} src="/wheel_spin.mp3" />
      <audio ref={hostAudioRef} src="/host.mp3" onEnded={startWheelSpin} />
      <audio ref={finalAudioRef} src="/final_music.mp3" loop />
      <audio ref={trueAudioRef} src="/true.mp3" />

      {/* --- STAGE 1: INTRO --- */}
      {stage === "intro" && (
        <div className="relative w-full h-screen" onClick={() => typingAudioRef.current?.play()}>
          {textElements.map((el) => (
            <div
              key={el.id}
              className="absolute text-white font-mono text-base sm:text-3xl typing-cursor"
              style={{ top: el.top, left: el.left }}
            >
              {el.text}
            </div>
          ))}
        </div>
      )}

      {/* --- STAGE 2: TRANSITION --- */}
      {stage === "transition" && (
        <div className="flex items-center justify-center h-screen w-full bg-white transition-all duration-1000">
          <div className="text-7xl sm:text-9xl animate-bounce">❤️</div>
        </div>
      )}

      {/* --- STAGE 3: PROPOSAL --- */}
      {stage === "proposal" && (
        <div className="relative w-full h-screen flex flex-col items-center justify-center bg-pink-50 text-center p-4">
          <h1 className="text-3xl sm:text-5xl font-bold text-red-600 mb-8 sm:mb-12 leading-tight">
            Станешь моей на День всех влюблённых?
          </h1>
          <div className="flex gap-4 sm:gap-8 items-center justify-center w-full h-64 relative">
            <button
              onClick={handleYes}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 sm:py-4 sm:px-12 rounded-full text-lg sm:text-2xl shadow-lg transform hover:scale-110 transition-all z-10 min-w-[120px]"
            >
              ДА
            </button>
            <button
              onMouseEnter={handleNoHover}
              onTouchStart={handleNoHover}
              style={{
                position: "absolute",
                top: noBtnPos.top,
                left: noBtnPos.left,
                transition: "all 0.1s ease",
              }}
              className="bg-gray-400 text-white font-bold py-2 px-6 sm:py-4 sm:px-12 rounded-full text-lg sm:text-2xl z-10 min-w-[120px]"
            >
              НЕТ
            </button>
          </div>
        </div>
      )}

      {/* --- STAGE 4: GREETING --- */}
      {stage === "greeting" && (
        <div className="text-center animate-in fade-in zoom-in duration-500 p-4 sm:p-8">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-pink-600 mb-4 sm:mb-8">
            Привет, любимая! ❤️
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-6 sm:mb-8">
            Приглашаю тебя на шоу!<br />
            Тебе нужно собрать всех пятерых котиков, чтобы победить... 🐱
          </p>
          <button
            onClick={() => setStage("quiz")}
            className="bg-pink-500 text-white py-2 px-6 sm:py-3 sm:px-8 rounded-lg text-lg sm:text-xl hover:bg-pink-600 transition"
          >
            Я согласна...
          </button>
        </div>
      )}

      {/* --- STAGE 5: QUIZ (STUDIO LAYOUT) --- */}
      {stage === "quiz" && (
        <div className="relative w-full h-screen bg-gradient-to-b from-blue-900 to-blue-700 overflow-hidden flex flex-col">
          {showResetMsg && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in">
              <div className="text-center p-4">
                <div className="text-7xl sm:text-9xl mb-4">😿</div>
                <h2 className="text-3xl sm:text-4xl font-bold text-red-500 mb-2">WRONG ANSWER!</h2>
                <p className="text-white text-lg sm:text-xl">Starting over...</p>
              </div>
            </div>
          )}

          {/* Score indicator - responsive sizes */}
          <div className="absolute top-3 sm:top-6 left-1/2 transform -translate-x-1/2 z-20 flex flex-row items-center gap-2 sm:gap-4 bg-black/30 px-4 sm:px-8 py-1 sm:py-3 rounded-full backdrop-blur-sm border border-white/20 shadow-lg">
            <p className="text-white text-[10px] sm:text-xs font-bold tracking-widest mr-1 sm:mr-2 opacity-80">SCORE</p>
            {results.map((status, i) => (
              <div key={i} className="w-6 h-6 sm:w-10 sm:h-10 flex items-center justify-center transition-all duration-500">
                {status === "correct" ? (
                  <div className="relative w-full h-full drop-shadow-[0_0_10px_rgba(255,200,200,0.8)] animate-pulse">
                    <Image src="/kitten.png" width={40} height={40} className="object-contain" alt="kitten" unoptimized />
                  </div>
                ) : status === "wrong" ? (
                  <span className="text-lg sm:text-2xl drop-shadow-md">❌</span>
                ) : (
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white/30"></div>
                )}
              </div>
            ))}
          </div>

          {/* Main game area: stacked on mobile, row on desktop */}
          <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-12 w-full max-w-7xl mx-auto px-4 pb-16 lg:pb-48 pt-20 lg:pt-0">
            {/* Left player - order 1 on mobile, stays left on desktop */}
            <div className="flex flex-col items-center justify-center w-full lg:w-1/6 animate-breathing z-10 order-1 lg:order-none">
              <div className="relative w-full flex justify-center max-w-[150px] lg:max-w-none">
                <Image src="/player1.png" width={200} height={300} className="object-contain drop-shadow-2xl w-full h-auto" alt="Player 1" unoptimized />
              </div>
              <div className="bg-blue-600 text-white text-center px-2 py-0.5 sm:px-4 sm:py-1 mt-1 sm:mt-2 rounded border border-white font-bold text-sm sm:text-base w-full max-w-[120px] sm:max-w-[150px]">
                Лиса
              </div>
            </div>

            {/* Wheel + host - order 2 on mobile, center on desktop */}
            <div className="flex flex-col items-center justify-center w-full lg:w-1/3 relative z-0 order-2 lg:order-none">
              <div className={`relative z-20 -mb-6 lg:-mb-10 ${isHostTalking ? "animate-shake" : ""}`}>
                <Image src="/host.png" width={220} height={220} className="object-contain w-28 sm:w-36 lg:w-[220px] h-auto" alt="Host" priority unoptimized />
              </div>
              <div className="relative z-10">
                <div className="absolute left-1/2 -translate-x-1/2 top-[-15px] z-30 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-red-600 drop-shadow-lg"></div>
                <div className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-full border-4 sm:border-8 border-yellow-500 bg-white/90 shadow-[0_0_40px_rgba(255,255,255,0.4)] overflow-hidden flex items-center justify-center">
                  <div
                    style={{
                      transform: `rotate(${wheelRotation}deg)`,
                      transition: isSpinning ? "transform 6000ms cubic-bezier(0.25, 0.1, 0.25, 1)" : "none",
                    }}
                  >
                    <Image src="/wheel.png" width={320} height={320} className="object-cover w-full h-full" alt="Wheel" priority unoptimized />
                  </div>
                </div>
              </div>

              {/* Spin button - now positioned normally, not absolute */}
              {!isSpinning && !isHostTalking && !showQuestionModal && !showResetMsg && (
                <button
                  onClick={initiateSpinSequence}
                  className="mt-4 sm:mt-6 z-30 bg-gradient-to-b from-yellow-300 to-yellow-500 text-red-800 font-extrabold text-base sm:text-lg lg:text-2xl py-2 px-6 sm:py-3 sm:px-10 rounded-full border-b-4 sm:border-b-8 border-yellow-700 shadow-2xl hover:translate-y-1 active:border-b-0 active:translate-y-2 transition-all animate-pulse"
                >
                  Крутить барабан
                </button>
              )}
              {isHostTalking && (
                <div className="mt-4 sm:mt-6 z-30 bg-white/80 px-3 py-1 sm:px-4 sm:py-2 rounded-full font-bold text-blue-800 text-sm sm:text-base animate-bounce">
                  ... 🎤
                </div>
              )}
            </div>

            {/* Right player - order 3 on mobile, stays right on desktop */}
            <div className="flex flex-col items-center justify-center w-full lg:w-1/6 animate-breathing z-10 order-3 lg:order-none" style={{ animationDelay: "1s" }}>
              <div className="relative w-full flex justify-center max-w-[150px] lg:max-w-none">
                <Image src="/player2.png" width={200} height={300} className="object-contain drop-shadow-2xl w-full h-auto" alt="Player 2" unoptimized />
              </div>
              <div className="bg-red-600 text-white text-center px-2 py-0.5 sm:px-4 sm:py-1 mt-1 sm:mt-2 rounded border border-white font-bold text-sm sm:text-base w-full max-w-[120px] sm:max-w-[150px]">
                Ирбис
              </div>
            </div>
          </div>

          {/* Question modal - responsive */}
          {showQuestionModal && (
            <div
              style={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
              className="z-50 w-full animate-in slide-in-from-bottom duration-500"
            >
              <div className="w-full bg-white/95 backdrop-blur-3xl border-t-8 border-yellow-400 p-4 sm:p-6 shadow-[0_-10px_60px_rgba(0,0,0,0.6)] flex flex-col items-center">
                <div className="absolute -top-4 sm:-top-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 sm:px-8 py-1 sm:py-2 rounded-full font-bold uppercase tracking-widest text-xs sm:text-sm shadow-xl border-2 border-white">
                  Question {currentQuestion + 1}
                </div>

                <div className="w-full max-w-6xl flex flex-col items-center gap-4 sm:gap-6 mt-4 sm:mt-2">
                  <h2 className="text-gray-900 text-xl sm:text-2xl md:text-4xl font-extrabold text-center leading-tight">
                    {questions[currentQuestion].question}
                  </h2>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 w-full">
                    {questions[currentQuestion].answers.map((ans, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(ans.correct)}
                        className="w-full relative group overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 p-3 sm:p-5 transition-all duration-200 hover:border-blue-500 hover:shadow-lg active:scale-95 flex items-center justify-center"
                      >
                        <span className="relative z-10 text-blue-900 font-bold text-sm sm:text-base md:text-xl text-center">
                          {ans.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- STAGE 6: RESULT (SUCCESS) --- */}
      {stage === "result" && (
        <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center z-10">
          {/* BACKGROUND PHOTOS */}
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            {chaoticPhotos.map((photo) => (
              <div
                key={photo.id}
                className="absolute rounded-xl shadow-2xl border-4 border-white animate-trajectory"
                style={{
                  width: photo.size,
                  height: 'auto', // let the image set the height
                  top: 0,
                  left: 0,
                  opacity: 1,
                  zIndex: 1,
                  '--x-start': photo.xStart,
                  '--y-start': photo.yStart,
                  '--x-end': photo.xEnd,
                  '--y-end': photo.yEnd,
                  '--r-start': photo.rStart,
                  '--r-end': photo.rEnd,
                  animationDuration: photo.duration,
                  animationDelay: photo.delay,
                  willChange: 'transform',
                }}
              >
                <img
                  src={`/photo${photo.photoId}.jpg`}
                  alt="Memory"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>

          {/* Center Card - responsive */}
          <div className="z-20 text-center bg-white/95 backdrop-blur-xl p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border-4 border-pink-300 max-w-5xl mx-4 relative">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-pink-600 mb-2 sm:mb-4">Приз в студию! 💖</h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-4 sm:mb-8">Мы идеальная пара! Просто посмотри на это!</p>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-4 sm:mb-8">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="transform transition hover:scale-125 duration-300">
                  <Image
                    src={`/photo${(i % 15) + 1}.jpg`}
                    width={80}
                    height={80}
                    alt="Memory"
                    className="rounded-lg shadow-md border-2 border-pink-300 object-cover aspect-square w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
                    unoptimized
                  />
                </div>
              ))}
            </div>

            <div className="animate-bounce mt-2 sm:mt-4">
              <Image src="/flowers.png" width={300} height={300} alt="Flowers" className="mx-auto drop-shadow-2xl w-40 sm:w-60 md:w-80 h-auto" unoptimized />
              <p className="text-xl sm:text-2xl md:text-3xl font-permanent-marker text-red-500 mt-2 sm:mt-4">Мой тебе дигитальный букет, люблю тебя! 🌹</p>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes breathing {
          0% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.02);
          }
          100% {
            transform: translateY(0px) scale(1);
          }
        }
        .animate-breathing {
          animation: breathing 3s ease-in-out infinite;
        }

        @keyframes shake {
          0% {
            transform: translate(1px, 1px) rotate(0deg);
          }
          10% {
            transform: translate(-1px, -2px) rotate(-1deg);
          }
          20% {
            transform: translate(-3px, 0px) rotate(1deg);
          }
          30% {
            transform: translate(3px, 2px) rotate(0deg);
          }
          40% {
            transform: translate(1px, -1px) rotate(1deg);
          }
          50% {
            transform: translate(-1px, 2px) rotate(-1deg);
          }
          60% {
            transform: translate(-3px, 1px) rotate(0deg);
          }
          70% {
            transform: translate(3px, 1px) rotate(-1deg);
          }
          80% {
            transform: translate(-1px, -1px) rotate(1deg);
          }
          90% {
            transform: translate(1px, 2px) rotate(0deg);
          }
          100% {
            transform: translate(1px, -2px) rotate(-1deg);
          }
        }
        .animate-shake {
          animation: shake 0.5s infinite;
        }
      `}</style>

      {/* Global styles for trajectory animation – moved outside styled-jsx global to ensure they work */}
      <style>{`
        @keyframes trajectory {
          0% {
            transform: translate3d(var(--x-start), var(--y-start), 0) rotate(var(--r-start));
          }
          100% {
            transform: translate3d(var(--x-end), var(--y-end), 0) rotate(var(--r-end));
          }
        }
        .animate-trajectory {
          animation-name: trajectory;
          animation-duration: 15s; /* fallback */
          animation-iteration-count: infinite;
          animation-timing-function: linear;
          animation-fill-mode: forwards; /* keeps the transform at end of each loop, but with infinite it will jump back; optional */
          will-change: transform;
        }
      `}</style>
    </main>
  );
}