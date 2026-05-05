import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDownIcon, CrossIcon, DoveIcon } from "../assets/svg/Icons.jsx";
import churchImage from "../assets/images/cbccchurch.webp";
export default function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section
      ref={ref}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Cinematic background */}
      <motion.div
        style={{ scale }}
        className="absolute inset-0 hero-gradient"
      />

      {/* Layered noise/texture overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.2'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
        }}
      />

      {/* Animated orbs */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(111,209,215,0.25) 0%, transparent 70%)",
        }}
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 40, 0], opacity: [0.15, 0.3, 0.15] }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(59,117,151,0.35) 0%, transparent 70%)",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage: `url(${churchImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />

      {/* Parallax content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
      >
        {/* Floating badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border border-white/25 text-aqua/90 text-xs font-mono tracking-widest uppercase mb-5"
        >
          <DoveIcon size={14} color="#6FD1D7" />
          <span>Anao, Cabagan, Isabela</span>
        </motion.div>
        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl sm:text-6xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight mb-5"
        >
          The Cabagan
          <span className="block">
            <em className="not-italic text-gradient-light">Bible Community </em>
          </span>
          Church
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.9 }}
          className="text-white/60 text-base sm:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-10"
        >
          DISCOVERING CBCC: A Disciple-Making Church
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/about"
            className="group px-8 py-4 rounded-2xl bg-aqua text-navy font-semibold text-sm tracking-wide hover:bg-white transition-all duration-300 shadow-lg shadow-aqua/30"
          >
            Discover Our Story
          </Link>
          <Link
            to="/discipleship"
            className="px-8 py-4 rounded-2xl glass border border-white/25 text-white font-medium text-sm hover:bg-white/15 transition-all duration-300"
          >
            Discipleship Journey
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
      >
        <span className="text-[10px] font-mono tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDownIcon size={18} color="rgba(255,255,255,0.4)" />
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F5F5F5] to-transparent" />
    </section>
  );
}
