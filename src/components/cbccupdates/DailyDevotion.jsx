// ─── ESV Verses Pool ───────────────────────────────────────────────
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpenIcon,
  CalendarIcon,
  RadioIcon,
  CrossIcon,
  ChevronLeft,
  ChevronRight,
  ClockIcon,
  UserIcon,
  PlayIcon,
  SignalIcon,
} from "../../assets/svg/Icons";

const verses = [
  {
    text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
    ref: "John 3:16",
    theme: "Love",
  },
  {
    text: "I can do all things through him who strengthens me.",
    ref: "Philippians 4:13",
    theme: "Strength",
  },
  {
    text: "Trust in the LORD with all your heart, and do not lean on your own understanding.",
    ref: "Proverbs 3:5",
    theme: "Trust",
  },
  {
    text: "The LORD is my shepherd; I shall not want.",
    ref: "Psalm 23:1",
    theme: "Provision",
  },
  {
    text: "But seek first the kingdom of God and his righteousness, and all these things will be added to you.",
    ref: "Matthew 6:33",
    theme: "Purpose",
  },
  {
    text: "Be strong and courageous. Do not be frightened, and do not be dismayed, for the LORD your God is with you wherever you go.",
    ref: "Joshua 1:9",
    theme: "Courage",
  },
  {
    text: "And we know that for those who love God all things work together for good.",
    ref: "Romans 8:28",
    theme: "Hope",
  },
];

function getTodayVerseIndex() {
  const d = new Date();
  return (
    (d.getFullYear() * 366 + d.getMonth() * 31 + d.getDate()) % verses.length
  );
}

export default function DailyDevotion() {
  const [verseIndex, setVerseIndex] = useState(getTodayVerseIndex());
  const [displayed, setDisplayed] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const DISPLAY_DURATION = 7000;
  const verse = verses[verseIndex];

  // Typewriter effect
  useEffect(() => {
    setDisplayed("");
    setCharIndex(0);
    setIsTyping(true);
    setProgress(0);
  }, [verseIndex]);

  useEffect(() => {
    if (charIndex < verse.text.length) {
      const speed = 28;
      const t = setTimeout(() => {
        setDisplayed(verse.text.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      }, speed);
      return () => clearTimeout(t);
    } else {
      setIsTyping(false);
    }
  }, [charIndex, verse.text]);

  // Auto-advance every 7s after typing finishes
  useEffect(() => {
    if (isTyping) return;
    timerRef.current = setTimeout(() => {
      setVerseIndex((i) => (i + 1) % verses.length);
    }, DISPLAY_DURATION);
    return () => clearTimeout(timerRef.current);
  }, [isTyping, verseIndex]);

  // Progress bar
  useEffect(() => {
    if (isTyping) return;
    setProgress(0);
    const start = Date.now();
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(elapsed / DISPLAY_DURATION, 1));
    }, 50);
    return () => clearInterval(progressRef.current);
  }, [isTyping, verseIndex]);

  const goTo = (dir) => {
    clearTimeout(timerRef.current);
    clearInterval(progressRef.current);
    setVerseIndex((i) => (i + dir + verses.length) % verses.length);
  };

  return (
    <section className="cbcc-section devotion-section">
      <div className="section-eyebrow">
        <span className="eyebrow-icon">
          <BookOpenIcon />
        </span>
        <span>Daily Devotion</span>
        <span className="eyebrow-dot" />
        <span className="eyebrow-sub">
          ESV Translation · Auto-advances every 7s
        </span>
      </div>

      <div className="devotion-card">
        {/* Decorative cross */}
        <div className="devotion-cross-bg">
          <CrossIcon />
        </div>

        {/* Theme badge */}
        <AnimatePresence mode="wait">
          <motion.div
            key={verseIndex + "-badge"}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4 }}
            className="theme-badge"
          >
            {verse.theme}
          </motion.div>
        </AnimatePresence>

        {/* Verse text with typewriter */}
        <div className="verse-text-wrap">
          <span className="quote-mark open">"</span>
          <AnimatePresence mode="wait">
            <motion.p
              key={verseIndex + "-text"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="verse-text"
            >
              {displayed}
              {isTyping && <span className="cursor-blink">|</span>}
            </motion.p>
          </AnimatePresence>
          <span className="quote-mark close">"</span>
        </div>

        {/* Reference */}
        <AnimatePresence mode="wait">
          {!isTyping && (
            <motion.div
              key={verseIndex + "-ref"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3 }}
              className="verse-ref"
            >
              — {verse.ref}, ESV
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls & Progress */}
        <div className="devotion-controls">
          <button
            className="nav-btn"
            onClick={() => goTo(-1)}
            aria-label="Previous verse"
          >
            <ChevronLeft />
          </button>

          {/* Dot indicators */}
          <div className="verse-dots">
            {verses.map((_, i) => (
              <button
                key={i}
                className={`verse-dot ${i === verseIndex ? "active" : ""}`}
                onClick={() => {
                  clearTimeout(timerRef.current);
                  setVerseIndex(i);
                }}
                aria-label={`Verse ${i + 1}`}
              />
            ))}
          </div>

          <button
            className="nav-btn"
            onClick={() => goTo(1)}
            aria-label="Next verse"
          >
            <ChevronRight />
          </button>
        </div>

        {/* Progress bar */}
        <div className="progress-track">
          <motion.div
            className="progress-fill"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <p className="verse-count">
          {verseIndex + 1} / {verses.length}
        </p>
      </div>
    </section>
  );
}
