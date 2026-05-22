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

import { fetchRecentActivities } from "../../api/recentActivity/read";
import { supabase } from "../../lib/supabaseClient";
// ─── Recent Activities Section ──────────────────────────────────────
export default function RecentActivities() {
  const [activities, setActivities] = useState([]);
  const [active, setActive] = useState(0);
  const [prevActive, setPrevActive] = useState(null);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const progressRef = useRef(null);
  const DURATION = 10000;

  useEffect(() => {
    const loadActivities = async () => {
      const result = await fetchRecentActivities();

      if (result.success) {
        setActivities(result.data);
      } else {
        console.error(result.error);
      }
    };

    loadActivities();

    // ─── Realtime Subscription ─────────────────────────────
    const channel = supabase
      .channel("recent-activities-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "recent_activities",
        },
        async () => {
          const result = await fetchRecentActivities();

          if (result.success) {
            setActivities(result.data);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const goTo = (idx) => {
    setPrevActive(active);
    setActive(idx);
    setProgress(0);
    resetTimers();
  };

  const resetTimers = () => {
    if (!activities.length) return;

    clearInterval(intervalRef.current);
    clearInterval(progressRef.current);

    const start = Date.now();

    progressRef.current = setInterval(() => {
      const pct = Math.min((Date.now() - start) / DURATION, 1);

      setProgress(pct);

      if (pct >= 1) clearInterval(progressRef.current);
    }, 50);

    intervalRef.current = setInterval(() => {
      setActive((a) => {
        setPrevActive(a);
        return (a + 1) % activities.length;
      });

      setProgress(0);

      const s2 = Date.now();

      clearInterval(progressRef.current);

      progressRef.current = setInterval(() => {
        const pct = Math.min((Date.now() - s2) / DURATION, 1);

        setProgress(pct);

        if (pct >= 1) clearInterval(progressRef.current);
      }, 50);
    }, DURATION);
  };

  useEffect(() => {
    if (!activities.length) return;

    resetTimers();

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(progressRef.current);
    };
  }, [activities.length]);

  const prev = () => {
    if (!activities.length) return;

    goTo((active - 1 + activities.length) % activities.length);
  };

  const next = () => {
    if (!activities.length) return;

    goTo((active + 1) % activities.length);
  };

  const current = activities[active] || {};
  if (!activities.length) return null;
  return (
    <section className="cbcc-section activities-section">
      <div className="section-eyebrow">
        <span className="eyebrow-icon">
          {/* Camera icon */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="12"
              cy="13"
              r="4"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </span>
        <span>Recent Activities</span>
        <span className="eyebrow-dot" />
        <span className="eyebrow-sub">Auto-transitions every 10s</span>
      </div>

      {/* Main fullscreen stage */}
      <div className="ra-stage">
        {/* 10-second progress bar */}
        <div className="ra-progress-bar">
          <motion.div
            key={active + "-prog"}
            className="ra-progress-fill"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: DURATION / 1000, ease: "linear" }}
          />
        </div>

        {/* Slides with crossfade */}
        <AnimatePresence mode="sync">
          <motion.div
            key={active}
            className="ra-slide"
            style={{ backgroundImage: `url(${current.img})` }}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>

        {/* Vignette */}
        <div className="ra-vignette" />

        {/* Arrows */}
        <button className="ra-arrow prev" onClick={prev} aria-label="Previous">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button className="ra-arrow next" onClick={next} aria-label="Next">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Bottom info */}
        <div className="ra-info">
          <AnimatePresence mode="wait">
            <motion.div
              key={active + "-text"}
              className="ra-text"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="ra-category">
                {current.subtitle} | {current.date}
              </span>
              <div className="ra-title">{current.title}</div>
              <div className="ra-date">{current.description}</div>
            </motion.div>
          </AnimatePresence>

          <div className="ra-controls">
            <span className="ra-counter">
              <strong>{String(active + 1).padStart(2, "0")}</strong>
              {" / "}
              {String(activities.length).padStart(2, "0")}
            </span>
            <div className="ra-dots">
              {activities.map((_, i) => (
                <button
                  key={i}
                  className={`ra-dot ${i === active ? "active" : ""}`}
                  onClick={() => goTo(i)}
                  aria-label={`Go to activity ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="ra-thumbs">
        {activities.map((act, i) => (
          <motion.button
            key={act.id}
            className={`ra-thumb ${i === active ? "active" : ""}`}
            style={{ backgroundImage: `url(${act.img})` }}
            onClick={() => goTo(i)}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.2 }}
            aria-label={act.title}
          />
        ))}
      </div>
    </section>
  );
}
