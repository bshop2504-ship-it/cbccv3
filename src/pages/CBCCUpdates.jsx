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
} from "../assets/svg/Icons";

import DailyDevotion from "../components/cbccupdates/DailyDevotion";
import WeeklyService from "../components/cbccupdates/WeeklyService";
import LiveService from "../components/cbccupdates/LiveService";
import RecentActivities from "../components/cbccupdates/RecentActivities";
import Announcements from "../components/cbccupdates/Announcements";
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

        {/* Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Announcements />
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
      </div>
    </>
  );
}
