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

// ─── Weekly Services Data ──────────────────────────────────────────
const services = [
  {
    id: 1,
    title: "Sunday Worship Celebration",
    date: "May 4, 2025",
    time: "9:00 AM & 11:00 AM",
    speaker: "Ptr. Ramon Santos",
    series: "Walking in the Spirit",
    description:
      "Join us for a powerful worship celebration as we dive into our series on Spirit-filled living. Expect anointed music, prayer, and a Word that transforms.",
    tag: "Worship",
    color: "#6FD1D7",
  },
  {
    id: 2,
    title: "Wednesday Prayer Night",
    date: "May 7, 2025",
    time: "7:00 PM",
    speaker: "Ptr. Grace Lim",
    series: "Encountering God",
    description:
      "A mid-week gathering dedicated to corporate prayer and intercession. Come with an open heart as we seek God's face together and pray for our community.",
    tag: "Prayer",
    color: "#3B7597",
  },
  {
    id: 3,
    title: "Friday Youth Service",
    date: "May 9, 2025",
    time: "6:30 PM",
    speaker: "Ptr. Carlos Vega",
    series: "Generation Rising",
    description:
      "An electrifying gathering for the next generation! Through worship, the Word, and community, we're raising up disciples who will impact their schools, homes, and cities.",
    tag: "Youth",
    color: "#093C5D",
  },
  {
    id: 4,
    title: "Saturday Men's Breakfast",
    date: "May 10, 2025",
    time: "7:00 AM",
    speaker: "Ptr. David Torres",
    series: "Iron Sharpens Iron",
    description:
      "Men gathering over breakfast for fellowship, accountability, and the Word. We're building men of God — in character, family, and community leadership.",
    tag: "Men",
    color: "#093C5D",
  },
];

// ─── Weekly Service Section ─────────────────────────────────────────
export default function WeeklyService() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const intervalRef = useRef(null);

  const startInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setActive((i) => (i + 1) % services.length);
    }, 5000);
  };

  useEffect(() => {
    startInterval();
    return () => clearInterval(intervalRef.current);
  }, []);

  const goTo = (idx) => {
    setDirection(idx > active ? 1 : -1);
    setActive(idx);
    startInterval();
  };
  const prev = () => goTo((active - 1 + services.length) % services.length);
  const next = () => goTo((active + 1) % services.length);

  const current = services[active];

  const slideVariants = {
    enter: (d) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <section className="cbcc-section service-section">
      <div className="section-eyebrow">
        <span className="eyebrow-icon">
          <CalendarIcon />
        </span>
        <span>Weekly Services</span>
        <span className="eyebrow-dot" />
        <span className="eyebrow-sub">Auto-transitions every 5s</span>
      </div>

      <div className="service-stage">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={active}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="service-card"
          >
            {/* Left: Illustrated Panel */}
            <div
              className="service-image-panel"
              style={{ "--accent": current.color }}
            >
              <div className="service-image-bg" />
              <div className="service-image-content">
                <span
                  className="service-tag"
                  style={{
                    color: current.color,
                    borderColor: `${current.color}50`,
                    background: `${current.color}18`,
                  }}
                >
                  {current.tag}
                </span>
                <div className="service-date-badge">
                  <span className="service-month">
                    {current.date.split(" ")[0]}
                  </span>
                  <span className="service-day">
                    {current.date.split(" ")[1].replace(",", "")}
                  </span>
                </div>
                <div className="service-art-cross">
                  <CrossIcon />
                </div>
                <div className="service-grid-lines" />
              </div>
            </div>

            {/* Right: Info Panel */}
            <div className="service-info-panel">
              <h3 className="service-title">{current.title}</h3>
              <div className="service-meta">
                <span className="meta-chip">
                  <ClockIcon /> {current.time}
                </span>
                <span className="meta-chip">
                  <UserIcon /> {current.speaker}
                </span>
              </div>
              <p className="service-series">
                Series: <em>{current.series}</em>
              </p>
              <p className="service-desc">{current.description}</p>
              <button
                className="service-cta"
                style={{ "--accent": current.color }}
              >
                Learn More
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next */}
        <button
          className="slide-arrow left"
          onClick={prev}
          aria-label="Previous service"
        >
          <ChevronLeft />
        </button>
        <button
          className="slide-arrow right"
          onClick={next}
          aria-label="Next service"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="service-thumbs">
        {services.map((s, i) => (
          <button
            key={s.id}
            className={`thumb-item ${i === active ? "active" : ""}`}
            onClick={() => goTo(i)}
            style={{ "--accent": s.color }}
          >
            <span
              className="thumb-dot"
              style={{
                background: i === active ? s.color : "transparent",
                borderColor: s.color,
              }}
            />
            <span className="thumb-label">{s.tag}</span>
            {i === active && (
              <motion.div
                className="thumb-underline"
                layoutId="thumb-underline"
                style={{ background: s.color }}
              />
            )}
          </button>
        ))}
      </div>

      {/* 5s progress bar */}
      <div className="service-progress-track">
        <motion.div
          key={active + "-bar"}
          className="service-progress-fill"
          style={{ background: current.color }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
        />
      </div>
    </section>
  );
}
