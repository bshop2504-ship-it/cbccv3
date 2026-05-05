import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Design Tokens (matching CBCC palette) ─────────────────────────
// #093C5D navy | #3B7597 steel | #6FD1D7 aqua | #F5F5F5 light

// ─── ESV Verses Pool ───────────────────────────────────────────────
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

// ─── SVG Icons ─────────────────────────────────────────────────────
const BookOpenIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const CalendarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M16 2v4M8 2v4M3 10h18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
const RadioIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <path
      d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 16.24a6 6 0 0 1 0-8.49M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
const CrossIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2V22M2 12H22"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);
const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M15 18L9 12L15 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M9 18L15 12L9 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 6v6l4 2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
  </svg>
);
const PlayIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
const SignalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 4v16"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

// ─── Helpers ────────────────────────────────────────────────────────
function getTodayVerseIndex() {
  const d = new Date();
  return (
    (d.getFullYear() * 366 + d.getMonth() * 31 + d.getDate()) % verses.length
  );
}

// ─── Daily Devotion Section ─────────────────────────────────────────
function DailyDevotion() {
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

// ─── Weekly Service Section ─────────────────────────────────────────
function WeeklyService() {
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

// ─── Live Service Section ──────────────────────────────────────────
function LiveService() {
  const [watching, setWatching] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [chatLog, setChatLog] = useState([
    {
      user: "Sister Maria",
      msg: "Praise God! Joining from Aparri 🙏",
      time: "9:02 AM",
    },
    {
      user: "Bro. Juan",
      msg: "Amen! The worship is powerful today",
      time: "9:04 AM",
    },
    {
      user: "Ptr. Grace",
      msg: "Good morning church family! God bless you all",
      time: "9:06 AM",
    },
    {
      user: "Anonymous",
      msg: "First time joining online. So blessed!",
      time: "9:08 AM",
    },
  ]);
  const [viewers] = useState(243);
  const chatEndRef = useRef(null);

  const isLive = true; // mock
  const nextServiceTime = "Sunday, May 4 · 9:00 AM";

  const sendChat = (e) => {
    e.preventDefault();
    if (!chatMsg.trim()) return;
    setChatLog((l) => [
      ...l,
      {
        user: "You",
        msg: chatMsg.trim(),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setChatMsg("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  return (
    <section className="cbcc-section live-section">
      <div className="section-eyebrow">
        <span className="eyebrow-icon live-pulse">
          <RadioIcon />
        </span>
        <span>Live Service</span>
        {isLive && (
          <span className="live-badge">
            <span className="live-dot" />
            LIVE
          </span>
        )}
      </div>

      <div className={`live-layout ${watching ? "watching" : ""}`}>
        {/* Video Panel */}
        <div className="live-video-panel">
          {!watching ? (
            <div className="live-placeholder">
              <div className="live-placeholder-bg" />
              <div className="live-placeholder-content">
                {isLive ? (
                  <>
                    <div className="live-pulse-ring" />
                    <button
                      className="live-play-btn"
                      onClick={() => setWatching(true)}
                    >
                      <PlayIcon />
                    </button>
                    <div className="live-info">
                      <p className="live-title">Sunday Worship Celebration</p>
                      <p className="live-speaker">Ptr. Ramon Santos</p>
                    </div>
                    <div className="live-viewer-count">
                      <SignalIcon />
                      <span>{viewers.toLocaleString()} watching</span>
                    </div>
                  </>
                ) : (
                  <div className="live-offline">
                    <div className="offline-icon">
                      <RadioIcon />
                    </div>
                    <p className="offline-title">Service Not Live Yet</p>
                    <p className="offline-sub">
                      Next service: {nextServiceTime}
                    </p>
                    <div className="offline-countdown">
                      <span>Join us soon</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="live-active">
              {/* Mock video player */}
              <div className="mock-player">
                <div className="mock-player-bg" />
                <div className="mock-player-overlay">
                  <div className="player-live-chip">
                    <span className="live-dot" />
                    LIVE
                  </div>
                  <div className="player-info">
                    <p className="player-title">Sunday Worship Celebration</p>
                    <p className="player-speaker">
                      Ptr. Ramon Santos · {viewers} watching
                    </p>
                  </div>
                </div>
                {/* Animated waveform */}
                <div className="waveform">
                  {[...Array(24)].map((_, i) => (
                    <div
                      key={i}
                      className="wave-bar"
                      style={{
                        animationDelay: `${i * 0.07}s`,
                        height: `${20 + Math.sin(i * 0.8) * 18}px`,
                      }}
                    />
                  ))}
                </div>
              </div>
              <button
                className="stop-live-btn"
                onClick={() => setWatching(false)}
              >
                Stop Watching
              </button>
            </div>
          )}
        </div>

        {/* Chat Panel */}
        <div className="live-chat-panel">
          <div className="chat-header">
            <span className="chat-title">Live Chat</span>
            <span className="chat-count">{chatLog.length} messages</span>
          </div>
          <div className="chat-messages">
            {chatLog.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`chat-msg ${msg.user === "You" ? "own" : ""}`}
              >
                <span className="chat-user">{msg.user}</span>
                <span className="chat-text">{msg.msg}</span>
                <span className="chat-time">{msg.time}</span>
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form className="chat-input-row" onSubmit={sendChat}>
            <input
              type="text"
              placeholder="Say something..."
              value={chatMsg}
              onChange={(e) => setChatMsg(e.target.value)}
              className="chat-input"
              maxLength={120}
            />
            <button type="submit" className="chat-send">
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Schedule Strip */}
      <div className="live-schedule-strip">
        <p className="schedule-label">Upcoming Services</p>
        <div className="schedule-items">
          {[
            { label: "Sunday Worship", time: "May 4 · 9 AM", status: "live" },
            { label: "Wednesday Prayer", time: "May 7 · 7 PM", status: "soon" },
            { label: "Friday Youth", time: "May 9 · 6:30 PM", status: "soon" },
          ].map((item, i) => (
            <div key={i} className={`schedule-item ${item.status}`}>
              <span className={`sched-dot ${item.status}`} />
              <div>
                <p className="sched-name">{item.label}</p>
                <p className="sched-time">{item.time}</p>
              </div>
              {item.status === "live" && (
                <span className="sched-live-chip">LIVE</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Recent Activities Data ────────────────────────────────────────
// Uses Unsplash sourced photos — replace src with real church photos
const activities = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1200&q=80",
    title: "Sunday Worship — April 27",
    category: "Worship",
    date: "April 27, 2025",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1609234656388-0ff363383899?w=1200&q=80",
    title: "Youth Discipleship Retreat",
    category: "Youth",
    date: "April 19–21, 2025",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200&q=80",
    title: "Community Outreach — Barangay Atulayan",
    category: "Outreach",
    date: "April 13, 2025",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1200&q=80",
    title: "Easter Sunday Celebration",
    category: "Special Event",
    date: "April 20, 2025",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    title: "Discipleship Training School — Batch 12",
    category: "Education",
    date: "April 5, 2025",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&q=80",
    title: "Men's Breakfast & Fellowship",
    category: "Men's Ministry",
    date: "April 12, 2025",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&q=80",
    title: "Life Groups Gathering — District Wide",
    category: "Community",
    date: "March 29, 2025",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1541802645635-11f2286a7482?w=1200&q=80",
    title: "Water Baptism Service",
    category: "Sacrament",
    date: "March 23, 2025",
  },
];

// ─── Recent Activities Section ──────────────────────────────────────
function RecentActivities() {
  const [active, setActive] = useState(0);
  const [prevActive, setPrevActive] = useState(null);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const progressRef = useRef(null);
  const DURATION = 10000;

  const goTo = (idx) => {
    setPrevActive(active);
    setActive(idx);
    setProgress(0);
    resetTimers();
  };

  const resetTimers = () => {
    clearInterval(intervalRef.current);
    clearInterval(progressRef.current);

    const start = Date.now();
    progressRef.current = setInterval(() => {
      const pct = Math.min((Date.now() - start) / DURATION, 1);
      setProgress(pct);
      if (pct >= 1) clearInterval(progressRef.current);
    }, 50);

    intervalRef.current = setInterval(() => {
      setPrevActive((a) => a);
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
    resetTimers();
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(progressRef.current);
    };
  }, []);

  const prev = () => goTo((active - 1 + activities.length) % activities.length);
  const next = () => goTo((active + 1) % activities.length);

  const current = activities[active];

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
            style={{ backgroundImage: `url(${current.src})` }}
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
              <span className="ra-category">{current.category}</span>
              <div className="ra-title">{current.title}</div>
              <div className="ra-date">{current.date}</div>
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
            style={{ backgroundImage: `url(${act.src})` }}
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

// ─── Styles ────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .cbcc-updates-root {
    font-family: 'DM Sans', system-ui, sans-serif;
    background: #F5F5F5;
    color: #093C5D;
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── Page Header ── */
  .page-header {
    background: linear-gradient(135deg, #093C5D 0%, #0d4d76 45%, #3B7597 100%);
    padding: 80px 24px 60px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .page-header::before {
    content: '';
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none;
  }
  .header-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'DM Mono', monospace;
    font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
    color: #6FD1D7; margin-bottom: 16px;
    padding: 6px 16px; border-radius: 999px;
    border: 1px solid rgba(111,209,215,0.3);
    background: rgba(111,209,215,0.08);
  }
  .header-dot { width: 5px; height: 5px; border-radius: 50%; background: #6FD1D7; opacity: 0.5; }
  .page-header h1 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(36px, 6vw, 64px);
    font-weight: 900; color: #fff;
    line-height: 1; letter-spacing: -0.02em;
    margin-bottom: 12px;
  }
  .page-header h1 em { font-style: italic; color: #6FD1D7; }
  .page-header p { color: rgba(255,255,255,0.55); font-size: 15px; max-width: 420px; margin: 0 auto; }
  .header-orb {
    position: absolute; border-radius: 50%; pointer-events: none;
    background: radial-gradient(circle, rgba(111,209,215,0.2) 0%, transparent 70%);
  }
  .header-orb.a { width: 300px; height: 300px; top: -80px; right: -60px; }
  .header-orb.b { width: 200px; height: 200px; bottom: -60px; left: -40px; opacity: 0.5; }

  /* ── Section Wrapper ── */
  .cbcc-section {
    max-width: 1100px; margin: 0 auto;
    padding: 64px 24px;
  }

  /* ── Eyebrow ── */
  .section-eyebrow {
    display: flex; align-items: center; gap: 10px;
    font-family: 'DM Mono', monospace;
    font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
    color: #3B7597; margin-bottom: 32px;
  }
  .eyebrow-icon { color: #6FD1D7; display: flex; align-items: center; }
  .eyebrow-dot { width: 4px; height: 4px; border-radius: 50%; background: #6FD1D7; opacity: 0.5; }
  .eyebrow-sub { color: rgba(59,117,151,0.6); font-size: 10px; }
  .live-pulse { animation: livePulse 1.8s ease-in-out infinite; }
  @keyframes livePulse { 0%,100%{opacity:1} 50%{opacity:0.5} }

  /* ═══ DAILY DEVOTION ══════════════════════════════ */
  .devotion-section { background: transparent; }

  .devotion-card {
    background: rgba(255,255,255,0.75);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.9);
    box-shadow: 0 12px 48px rgba(9,60,93,0.08);
    border-radius: 28px;
    padding: 52px 52px 36px;
    position: relative; overflow: hidden;
    min-height: 320px;
  }
  @media(max-width:600px){ .devotion-card { padding: 36px 24px 28px; } }

  .devotion-cross-bg {
    position: absolute; top: 24px; right: 28px;
    color: rgba(9,60,93,0.06);
    transform: scale(4); transform-origin: top right;
  }

  .theme-badge {
    display: inline-block;
    font-family: 'DM Mono', monospace;
    font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
    color: #6FD1D7; border: 1px solid rgba(111,209,215,0.4);
    background: rgba(111,209,215,0.08);
    padding: 4px 12px; border-radius: 999px; margin-bottom: 28px;
  }

  .verse-text-wrap {
    position: relative; margin-bottom: 24px;
  }
  .quote-mark {
    font-family: 'Playfair Display', serif;
    font-size: 80px; line-height: 1;
    color: rgba(111,209,215,0.25); font-style: italic;
    position: absolute; user-select: none;
  }
  .quote-mark.open { top: -20px; left: -8px; }
  .quote-mark.close { bottom: -50px; right: -4px; }

  .verse-text {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(18px, 2.8vw, 26px);
    font-style: italic;
    line-height: 1.55;
    color: #093C5D;
    padding: 0 20px;
    min-height: 120px;
  }

  .cursor-blink {
    display: inline-block; width: 2px; background: #6FD1D7;
    margin-left: 2px; animation: blink 0.8s step-end infinite;
    vertical-align: middle;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

  .verse-ref {
    font-family: 'DM Mono', monospace;
    font-size: 13px; color: #3B7597;
    letter-spacing: 0.04em; margin-bottom: 28px;
    padding-left: 20px;
  }

  .devotion-controls {
    display: flex; align-items: center; justify-content: center; gap: 16px;
    margin-bottom: 20px;
  }
  .nav-btn {
    width: 36px; height: 36px; border-radius: 10px;
    border: 1px solid rgba(9,60,93,0.15);
    background: rgba(9,60,93,0.04);
    color: #3B7597; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s;
  }
  .nav-btn:hover { background: #093C5D; color: #fff; border-color: #093C5D; }

  .verse-dots { display: flex; gap: 6px; align-items: center; }
  .verse-dot {
    width: 7px; height: 7px; border-radius: 50%;
    border: 1.5px solid rgba(9,60,93,0.3);
    background: transparent; cursor: pointer;
    padding: 0; transition: all 0.25s;
  }
  .verse-dot.active { background: #6FD1D7; border-color: #6FD1D7; width: 20px; border-radius: 4px; }

  .progress-track {
    height: 2px; background: rgba(9,60,93,0.08); border-radius: 2px; overflow: hidden;
    margin-bottom: 12px;
  }
  .progress-fill {
    height: 100%; background: linear-gradient(90deg, #3B7597, #6FD1D7);
    border-radius: 2px; transition: width 0.05s linear;
  }
  .verse-count {
    text-align: center; font-family: 'DM Mono', monospace;
    font-size: 10px; color: rgba(9,60,93,0.3); letter-spacing: 0.1em;
  }

  /* ═══ WEEKLY SERVICE ════════════════════════════════ */
  .service-section {
    background: #093C5D;
    border-radius: 32px;
    margin: 0 16px 0;
    padding: 56px 40px 40px;
    max-width: none;
  }
  @media(max-width:640px){ .service-section { margin: 0 8px; padding: 40px 20px 32px; } }
  .service-section .section-eyebrow { color: rgba(111,209,215,0.8); }
  .service-section .eyebrow-icon { color: #6FD1D7; }
  .service-section .eyebrow-sub { color: rgba(111,209,215,0.4); }
  .service-section .eyebrow-dot { background: rgba(111,209,215,0.4); }

  .service-stage {
    position: relative; overflow: hidden;
    border-radius: 20px;
    margin-bottom: 20px;
  }

  .service-card {
    display: grid; grid-template-columns: 280px 1fr;
    min-height: 300px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(111,209,215,0.12);
    border-radius: 20px; overflow: hidden;
  }
  @media(max-width:720px){
    .service-card { grid-template-columns: 1fr; }
  }

  .service-image-panel {
    position: relative; overflow: hidden;
    background: rgba(9,60,93,0.6);
    min-height: 200px;
  }
  .service-image-bg {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(9,60,93,0.9), rgba(59,117,151,0.5));
  }
  .service-image-content {
    position: relative; z-index: 1; height: 100%;
    display: flex; flex-direction: column;
    justify-content: space-between; padding: 24px;
  }
  .service-tag {
    display: inline-block; font-family: 'DM Mono', monospace;
    font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
    padding: 4px 12px; border-radius: 999px; border: 1px solid;
    align-self: flex-start;
  }
  .service-date-badge {
    text-align: left;
  }
  .service-month {
    display: block; font-family: 'DM Mono', monospace;
    font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
    color: rgba(111,209,215,0.7); margin-bottom: 4px;
  }
  .service-day {
    display: block; font-family: 'Playfair Display', serif;
    font-size: 64px; font-weight: 900; line-height: 1;
    color: rgba(255,255,255,0.15);
  }
  .service-art-cross {
    position: absolute; bottom: 20px; right: 20px;
    color: rgba(111,209,215,0.2); transform: scale(3); transform-origin: bottom right;
  }
  .service-grid-lines {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 30px 30px;
  }

  .service-info-panel {
    padding: 32px 36px; display: flex; flex-direction: column; gap: 12px;
  }
  @media(max-width:720px){ .service-info-panel { padding: 24px; } }

  .service-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(20px, 2.5vw, 28px); font-weight: 700;
    color: #fff; line-height: 1.2;
  }
  .service-meta { display: flex; gap: 12px; flex-wrap: wrap; }
  .meta-chip {
    display: flex; align-items: center; gap: 5px;
    font-size: 12px; color: rgba(111,209,215,0.7);
    font-family: 'DM Mono', monospace;
  }
  .service-series {
    font-size: 13px; color: rgba(255,255,255,0.45);
  }
  .service-series em { color: rgba(111,209,215,0.7); font-style: italic; }
  .service-desc {
    font-size: 14px; line-height: 1.7; color: rgba(255,255,255,0.55);
    flex: 1;
  }
  .service-cta {
    display: inline-flex; align-items: center;
    padding: 10px 24px; border-radius: 12px; border: none;
    background: var(--accent, #6FD1D7);
    color: #093C5D; font-weight: 600; font-size: 13px;
    cursor: pointer; transition: all 0.2s; align-self: flex-start;
    font-family: 'DM Sans', sans-serif;
  }
  .service-cta:hover { filter: brightness(1.1); transform: translateY(-1px); }

  .slide-arrow {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 38px; height: 38px; border-radius: 12px;
    background: rgba(9,60,93,0.7); border: 1px solid rgba(111,209,215,0.2);
    color: rgba(111,209,215,0.8); display: flex; align-items: center; justify-content: center;
    cursor: pointer; z-index: 10; transition: all 0.2s;
    backdrop-filter: blur(8px);
  }
  .slide-arrow:hover { background: #6FD1D7; color: #093C5D; }
  .slide-arrow.left { left: 12px; }
  .slide-arrow.right { right: 12px; }

  .service-thumbs {
    display: flex; gap: 4px; justify-content: center;
    margin-bottom: 12px;
  }
  .thumb-item {
    position: relative; display: flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: 10px; border: none;
    background: transparent; cursor: pointer; transition: all 0.2s;
    color: rgba(255,255,255,0.45); font-family: 'DM Mono', monospace; font-size: 10px;
    letter-spacing: 0.1em; text-transform: uppercase;
  }
  .thumb-item.active { color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.06); }
  .thumb-dot {
    width: 8px; height: 8px; border-radius: 50%;
    border: 1.5px solid; flex-shrink: 0; transition: all 0.2s;
  }
  .thumb-label { font-size: 10px; }
  .thumb-underline {
    position: absolute; bottom: 0; left: 14px; right: 14px; height: 2px; border-radius: 1px;
  }

  .service-progress-track {
    height: 2px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden;
  }
  .service-progress-fill { height: 100%; border-radius: 2px; }

  /* ═══ LIVE SERVICE ══════════════════════════════════ */
  .live-section { padding: 64px 24px; }

  .live-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 700;
    letter-spacing: 0.15em; color: #fff;
    background: #E53E3E; padding: 3px 10px; border-radius: 999px;
    margin-left: 4px;
  }
  .live-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #fff;
    animation: liveDot 1s ease-in-out infinite;
    display: inline-block;
  }
  @keyframes liveDot { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .live-layout {
    display: grid; grid-template-columns: 1fr 320px; gap: 20px;
    margin-bottom: 24px;
  }
  @media(max-width:780px){ .live-layout { grid-template-columns: 1fr; } }

  .live-video-panel {
    border-radius: 20px; overflow: hidden;
    background: #093C5D;
    min-height: 320px; position: relative;
  }
  .live-placeholder {
    width: 100%; height: 100%; min-height: 320px;
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
  }
  .live-placeholder-bg {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #093C5D 0%, #1a6699 60%, #3B7597 100%);
  }
  .live-placeholder-content {
    position: relative; z-index: 1;
    display: flex; flex-direction: column; align-items: center; gap: 16px;
  }
  .live-pulse-ring {
    position: absolute; width: 120px; height: 120px; border-radius: 50%;
    border: 2px solid rgba(111,209,215,0.3);
    animation: pulsering 2s ease-out infinite;
  }
  @keyframes pulsering { 0%{transform:scale(0.8);opacity:0.8} 100%{transform:scale(1.6);opacity:0} }

  .live-play-btn {
    width: 72px; height: 72px; border-radius: 50%; border: none;
    background: #6FD1D7; color: #093C5D;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.25s;
    box-shadow: 0 0 0 8px rgba(111,209,215,0.15);
  }
  .live-play-btn:hover { background: #fff; transform: scale(1.06); }

  .live-info { text-align: center; }
  .live-title { color: #fff; font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; }
  .live-speaker { color: rgba(111,209,215,0.7); font-family: 'DM Mono', monospace; font-size: 12px; margin-top: 4px; }

  .live-viewer-count {
    display: flex; align-items: center; gap: 6px;
    color: rgba(111,209,215,0.6); font-family: 'DM Mono', monospace; font-size: 11px;
  }

  .live-offline { text-align: center; }
  .offline-icon { color: rgba(111,209,215,0.3); margin-bottom: 12px; }
  .offline-title { color: rgba(255,255,255,0.6); font-size: 16px; font-weight: 500; margin-bottom: 6px; }
  .offline-sub { color: rgba(255,255,255,0.35); font-family: 'DM Mono', monospace; font-size: 12px; margin-bottom: 14px; }
  .offline-countdown { background: rgba(111,209,215,0.1); border: 1px solid rgba(111,209,215,0.2); padding: 8px 20px; border-radius: 10px; }
  .offline-countdown span { color: #6FD1D7; font-family: 'DM Mono', monospace; font-size: 12px; letter-spacing: 0.1em; }

  .live-active { position: relative; height: 100%; min-height: 320px; }
  .mock-player { width: 100%; height: 100%; min-height: 320px; position: relative; overflow: hidden; border-radius: 20px; }
  .mock-player-bg {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #051f30 0%, #093C5D 50%, #0a4570 100%);
  }
  .mock-player-overlay {
    position: absolute; inset: 0; padding: 20px;
    display: flex; flex-direction: column; justify-content: space-between;
    background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.5) 100%);
  }
  .player-live-chip {
    display: inline-flex; align-items: center; gap: 5px;
    background: #E53E3E; color: #fff;
    font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 700; letter-spacing: 0.15em;
    padding: 4px 10px; border-radius: 999px; align-self: flex-start;
  }
  .player-info .player-title {
    color: #fff; font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; margin-bottom: 4px;
  }
  .player-speaker { color: rgba(111,209,215,0.7); font-family: 'DM Mono', monospace; font-size: 11px; }

  .waveform {
    position: absolute; bottom: 60px; left: 50%; transform: translateX(-50%);
    display: flex; align-items: center; gap: 3px;
  }
  .wave-bar {
    width: 3px; background: rgba(111,209,215,0.5); border-radius: 2px;
    animation: wave 1.2s ease-in-out infinite alternate;
  }
  @keyframes wave { 0%{transform:scaleY(0.3)} 100%{transform:scaleY(1)} }

  .stop-live-btn {
    position: absolute; bottom: 16px; right: 16px;
    padding: 8px 16px; border-radius: 10px; border: 1px solid rgba(111,209,215,0.3);
    background: rgba(9,60,93,0.6); color: rgba(111,209,215,0.8);
    font-family: 'DM Sans', sans-serif; font-size: 12px; cursor: pointer;
    backdrop-filter: blur(8px); transition: all 0.2s;
  }
  .stop-live-btn:hover { background: rgba(9,60,93,0.9); color: #6FD1D7; }

  /* Chat */
  .live-chat-panel {
    background: rgba(255,255,255,0.7); backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.9); border-radius: 20px;
    display: flex; flex-direction: column; overflow: hidden;
  }
  .chat-header {
    padding: 16px 20px; border-bottom: 1px solid rgba(9,60,93,0.08);
    display: flex; align-items: center; justify-content: space-between;
  }
  .chat-title { font-weight: 600; font-size: 14px; color: #093C5D; }
  .chat-count { font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(59,117,151,0.6); }
  .chat-messages {
    flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px;
    max-height: 260px;
    scrollbar-width: thin; scrollbar-color: rgba(59,117,151,0.2) transparent;
  }
  .chat-msg { display: flex; flex-direction: column; gap: 2px; }
  .chat-msg.own .chat-text { background: #093C5D; color: #fff; align-self: flex-end; }
  .chat-msg.own .chat-user { text-align: right; }
  .chat-user { font-family: 'DM Mono', monospace; font-size: 10px; color: #3B7597; letter-spacing: 0.05em; }
  .chat-text {
    font-size: 13px; color: #093C5D; background: rgba(9,60,93,0.05);
    padding: 8px 12px; border-radius: 10px; display: inline-block;
    max-width: 90%; line-height: 1.4;
  }
  .chat-time { font-family: 'DM Mono', monospace; font-size: 9px; color: rgba(59,117,151,0.4); }
  .chat-input-row {
    padding: 12px 16px; border-top: 1px solid rgba(9,60,93,0.08);
    display: flex; gap: 8px;
  }
  .chat-input {
    flex: 1; padding: 10px 14px; border-radius: 10px;
    border: 1px solid rgba(9,60,93,0.15);
    background: rgba(9,60,93,0.04); color: #093C5D;
    font-family: 'DM Sans', sans-serif; font-size: 13px;
    outline: none; transition: border-color 0.2s;
  }
  .chat-input:focus { border-color: #6FD1D7; }
  .chat-input::placeholder { color: rgba(9,60,93,0.3); }
  .chat-send {
    padding: 10px 16px; border-radius: 10px; border: none;
    background: #093C5D; color: #6FD1D7;
    font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 13px;
    cursor: pointer; transition: all 0.2s;
  }
  .chat-send:hover { background: #3B7597; }

  /* Schedule strip */
  .live-schedule-strip {
    background: rgba(255,255,255,0.6); backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.9); border-radius: 20px;
    padding: 24px 28px;
  }
  .schedule-label {
    font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.18em;
    text-transform: uppercase; color: rgba(59,117,151,0.6); margin-bottom: 16px;
  }
  .schedule-items { display: flex; gap: 16px; flex-wrap: wrap; }
  .schedule-item {
    display: flex; align-items: center; gap: 12px;
    flex: 1; min-width: 180px;
    padding: 14px 18px; border-radius: 14px;
    background: rgba(9,60,93,0.04); border: 1px solid rgba(9,60,93,0.08);
    position: relative;
  }
  .schedule-item.live { background: rgba(229,62,62,0.05); border-color: rgba(229,62,62,0.2); }
  .sched-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .sched-dot.live { background: #E53E3E; animation: liveDot 1s ease-in-out infinite; }
  .sched-dot.soon { background: rgba(9,60,93,0.2); }
  .sched-name { font-size: 13px; font-weight: 600; color: #093C5D; margin-bottom: 2px; }
  .sched-time { font-family: 'DM Mono', monospace; font-size: 10px; color: rgba(59,117,151,0.6); }
  .sched-live-chip {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: #E53E3E; color: #fff; font-family: 'DM Mono', monospace;
    font-size: 9px; font-weight: 700; letter-spacing: 0.15em;
    padding: 2px 8px; border-radius: 999px;
  }

  /* ── Dividers between sections ── */
  .section-divider {
    max-width: 1100px; margin: 0 auto; padding: 0 24px;
  }
  .section-divider-line {
    height: 1px; background: linear-gradient(90deg, transparent, rgba(9,60,93,0.12), transparent);
  }

  /* ═══ RECENT ACTIVITIES ═══════════════════════════════ */
  .activities-section { padding: 64px 24px; }

  /* Fullscreen stage */
  .ra-stage {
    position: relative;
    width: 100%;
    border-radius: 28px;
    overflow: hidden;
    background: #093C5D;
    aspect-ratio: 16 / 7;
    min-height: 340px;
  }
  @media(max-width: 640px) { .ra-stage { aspect-ratio: 4 / 3; min-height: 280px; } }

  /* Each slide image fills the stage */
  .ra-slide {
    position: absolute; inset: 0;
    background-size: cover;
    background-position: center;
  }

  /* Cinematic vignette overlay */
  .ra-vignette {
    position: absolute; inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(9,60,93,0.1) 0%,
      rgba(9,60,93,0.0) 40%,
      rgba(9,60,93,0.55) 75%,
      rgba(9,60,93,0.92) 100%
    );
  }

  /* Bottom info bar */
  .ra-info {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 28px 32px 24px;
    display: flex; align-items: flex-end; justify-content: space-between; gap: 12px;
  }
  @media(max-width: 540px) { .ra-info { padding: 20px 18px 18px; flex-direction: column; align-items: flex-start; } }

  .ra-text { flex: 1; }
  .ra-category {
    font-family: 'DM Mono', monospace;
    font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
    color: #6FD1D7; margin-bottom: 6px; display: block;
  }
  .ra-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(18px, 3vw, 28px); font-weight: 700;
    color: #fff; line-height: 1.2; margin-bottom: 4px;
  }
  .ra-date {
    font-family: 'DM Mono', monospace;
    font-size: 11px; color: rgba(255,255,255,0.45);
  }

  /* Counter + dots */
  .ra-controls {
    display: flex; flex-direction: column; align-items: flex-end; gap: 10px; flex-shrink: 0;
  }
  @media(max-width: 540px) { .ra-controls { flex-direction: row; align-items: center; width: 100%; justify-content: space-between; } }

  .ra-counter {
    font-family: 'DM Mono', monospace;
    font-size: 11px; color: rgba(255,255,255,0.4); letter-spacing: 0.08em;
  }
  .ra-counter strong { color: rgba(255,255,255,0.85); }

  .ra-dots { display: flex; gap: 5px; align-items: center; }
  .ra-dot {
    width: 6px; height: 6px; border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.35);
    background: transparent; padding: 0; cursor: pointer;
    transition: all 0.3s ease;
  }
  .ra-dot.active {
    background: #6FD1D7; border-color: #6FD1D7; width: 20px; border-radius: 4px;
  }

  /* Prev / next arrows */
  .ra-arrow {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 42px; height: 42px; border-radius: 14px;
    background: rgba(9,60,93,0.55); border: 1px solid rgba(111,209,215,0.2);
    color: rgba(255,255,255,0.7); display: flex; align-items: center; justify-content: center;
    cursor: pointer; z-index: 10; transition: all 0.2s;
    backdrop-filter: blur(8px);
  }
  .ra-arrow:hover { background: rgba(111,209,215,0.25); color: #fff; border-color: rgba(111,209,215,0.5); }
  .ra-arrow.prev { left: 16px; }
  .ra-arrow.next { right: 16px; }

  /* 10-second progress bar at very top of stage */
  .ra-progress-bar {
    position: absolute; top: 0; left: 0; right: 0;
    height: 3px; z-index: 20;
    background: rgba(255,255,255,0.1);
  }
  .ra-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #6FD1D7, rgba(111,209,215,0.6));
    border-radius: 0 2px 2px 0;
  }

  /* Thumbnail strip below stage */
  .ra-thumbs {
    display: flex; gap: 8px; margin-top: 12px; overflow-x: auto;
    padding-bottom: 4px; scrollbar-width: none;
  }
  .ra-thumbs::-webkit-scrollbar { display: none; }

  .ra-thumb {
    flex-shrink: 0; width: 72px; height: 48px;
    border-radius: 10px; overflow: hidden; cursor: pointer;
    border: 2px solid transparent; transition: all 0.25s;
    background-size: cover; background-position: center;
    position: relative;
  }
  .ra-thumb::after {
    content: ''; position: absolute; inset: 0;
    background: rgba(9,60,93,0.45); transition: opacity 0.25s;
  }
  .ra-thumb.active {
    border-color: #6FD1D7;
  }
  .ra-thumb.active::after { opacity: 0; }
  .ra-thumb:not(.active):hover::after { opacity: 0.2; }
`;

// ─── Main Export ───────────────────────────────────────────────────
export default function CBCCUpdates() {
  return (
    <>
      <style>{styles}</style>
      <div className="cbcc-updates-root">
        {/* Page Header */}
        <header className="page-header">
          <div className="header-orb a" />
          <div className="header-orb b" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="header-eyebrow">
              <CrossIcon />
              <span>CBCC</span>
              <span className="header-dot" />
              <span>Updates & Live</span>
            </div>
            <h1>
              Stay <em>Connected</em>
            </h1>
            <p>
              Daily devotions, weekly services, and live worship — all in one
              place.
            </p>
          </motion.div>
        </header>

        {/* Daily Devotion */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <DailyDevotion />
        </motion.div>

        <div className="section-divider">
          <div className="section-divider-line" />
        </div>

        {/* Weekly Service */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ padding: "64px 0" }}
        >
          <WeeklyService />
        </motion.div>

        <div className="section-divider">
          <div className="section-divider-line" />
        </div>

        {/* Live Service */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <LiveService />
        </motion.div>

        <div className="section-divider">
          <div className="section-divider-line" />
        </div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <RecentActivities />
        </motion.div>

        {/* Footer note */}
        <div
          style={{
            textAlign: "center",
            padding: "32px 24px 48px",
            fontFamily: "DM Mono, monospace",
            fontSize: "11px",
            color: "rgba(9,60,93,0.3)",
            letterSpacing: "0.12em",
          }}
        >
          CBCC · Cagayan Valley · "Loving God. Loving People. Making Disciples."
        </div>
      </div>
    </>
  );
}
