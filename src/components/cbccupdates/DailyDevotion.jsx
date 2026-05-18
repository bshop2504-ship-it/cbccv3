import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpenIcon,
  CrossIcon,
  ChevronLeft,
  ChevronRight,
} from "../../assets/svg/Icons";

import { supabase } from "../../lib/supabaseClient";
import { fetchVerses } from "../../api/dailydevotion/read";

// ─── DAILY DEVOTION ───────────────────────────────────────────────
export default function DailyDevotion() {
  const [verses, setVerses] = useState([]);

  const [verseIndex, setVerseIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [progress, setProgress] = useState(0);

  const timerRef = useRef(null);
  const progressRef = useRef(null);

  const DISPLAY_DURATION = 7000;

  const verse =
    verses.length > 0
      ? verses[verseIndex]
      : {
          word: "",
          verse: "",
          reference: "",
        };

  // ─── FETCH VERSES ───────────────────────────────────────────────
  useEffect(() => {
    loadVerses();

    // REALTIME SUBSCRIPTION
    const channel = supabase
      .channel("daily-devotion-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bible_verses",
        },
        async () => {
          await loadVerses();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadVerses = async () => {
    const result = await fetchVerses();

    if (result.success) {
      setVerses(result.data || []);
    } else {
      console.error(result.error);
    }
  };

  // ─── RESET TYPEWRITER ───────────────────────────────────────────
  useEffect(() => {
    if (!verse?.verse) return;

    setDisplayed("");
    setCharIndex(0);
    setIsTyping(true);
    setProgress(0);
  }, [verseIndex, verses]);

  // ─── TYPEWRITER EFFECT ──────────────────────────────────────────
  useEffect(() => {
    if (!verse?.verse) return;

    if (charIndex < verse.verse.length) {
      const speed = 28;

      const t = setTimeout(() => {
        setDisplayed(verse.verse.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      }, speed);

      return () => clearTimeout(t);
    } else {
      setIsTyping(false);
    }
  }, [charIndex, verse]);

  // ─── AUTO NEXT ──────────────────────────────────────────────────
  useEffect(() => {
    if (isTyping || verses.length === 0) return;

    timerRef.current = setTimeout(() => {
      setVerseIndex((i) => (i + 1) % verses.length);
    }, DISPLAY_DURATION);

    return () => clearTimeout(timerRef.current);
  }, [isTyping, verseIndex, verses]);

  // ─── PROGRESS BAR ───────────────────────────────────────────────
  useEffect(() => {
    if (isTyping || verses.length === 0) return;

    setProgress(0);

    const start = Date.now();

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - start;

      setProgress(Math.min(elapsed / DISPLAY_DURATION, 1));
    }, 50);

    return () => clearInterval(progressRef.current);
  }, [isTyping, verseIndex, verses]);

  // ─── NAVIGATION ─────────────────────────────────────────────────
  const goTo = (dir) => {
    if (verses.length === 0) return;

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
            {verse.word}
          </motion.div>
        </AnimatePresence>

        {/* Verse text */}
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
              — {verse.reference}, ESV
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="devotion-controls">
          <button
            className="nav-btn"
            onClick={() => goTo(-1)}
            aria-label="Previous verse"
          >
            <ChevronLeft />
          </button>

          {/* Dots */}
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

        {/* Progress */}
        <div className="progress-track">
          <motion.div
            className="progress-fill"
            style={{
              width: `${progress * 100}%`,
            }}
          />
        </div>

        {/* Count */}
        <p className="verse-count">
          {verses.length === 0
            ? "0 / 0"
            : `${verseIndex + 1} / ${verses.length}`}
        </p>
      </div>
    </section>
  );
}
