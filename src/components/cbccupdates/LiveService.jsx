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

export default function LiveService() {
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
