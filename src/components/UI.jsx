import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDownIcon } from "../assets/svg/Icons.jsx";

// ─── Section Container ──────────────────────────────────────────
export function SectionContainer({
  id,
  children,
  className = "",
  dark = false,
}) {
  return (
    <section
      id={id}
      className={`section-padding ${dark ? "bg-navy text-white" : "mesh-bg text-navy"} ${className}`}
    >
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
}

// ─── Section Header ──────────────────────────────────────────────
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  light = false,
  center = true,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className={`mb-16 ${center ? "text-center" : ""}`}
    >
      {eyebrow && (
        <span
          className={`inline-block text-xs font-mono font-semibold tracking-[0.2em] uppercase mb-4 px-4 py-1.5 rounded-full border ${
            light
              ? "text-aqua border-aqua/30 bg-aqua/10"
              : "text-steel border-steel/30 bg-steel/10"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight ${
          light ? "text-white" : "text-navy"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base sm:text-lg leading-relaxed max-w-2xl ${center ? "mx-auto" : ""} ${
            light ? "text-white/60" : "text-steel/70"
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

// ─── Glass Card ──────────────────────────────────────────────────
export function Card({ children, className = "", hover = true, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={hover ? { y: -6, transition: { duration: 0.25 } } : undefined}
      className={`glass-card rounded-2xl p-6 ${hover ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ─── Dark Glass Card ─────────────────────────────────────────────
export function DarkCard({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={`glass-dark rounded-2xl p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ─── Grid ────────────────────────────────────────────────────────
export function Grid({ children, cols = 3, className = "" }) {
  const colClass =
    {
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    }[cols] || "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid ${colClass} gap-6 ${className}`}>{children}</div>
  );
}

// ─── Accordion ───────────────────────────────────────────────────
export function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          className="glass-card rounded-2xl overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between p-5 text-left group"
          >
            <div className="flex items-center gap-4">
              {item.icon && (
                <div className="w-9 h-9 rounded-xl bg-navy/10 border border-navy/15 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
              )}
              <span className="font-semibold text-navy text-sm sm:text-base">
                {item.title}
              </span>
            </div>
            <motion.div
              animate={{ rotate: openIndex === i ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="shrink-0 ml-4"
            >
              <ChevronDownIcon size={20} color="#3B7597" />
            </motion.div>
          </button>

          <AnimateHeight isOpen={openIndex === i}>
            <div className="px-5 pb-5 text-steel/80 text-sm leading-relaxed border-t border-navy/10 pt-4">
              {item.content}
            </div>
          </AnimateHeight>
        </motion.div>
      ))}
    </div>
  );
}

function AnimateHeight({ isOpen, children }) {
  return (
    <motion.div
      initial={false}
      animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{ overflow: "hidden" }}
    >
      {children}
    </motion.div>
  );
}

// ─── Icon Card ───────────────────────────────────────────────────
export function IconCard({
  icon,
  title,
  description,
  delay = 0,
  dark = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -6 }}
      className={`rounded-2xl p-6 flex flex-col gap-4 ${dark ? "glass-dark" : "glass-card"}`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          dark
            ? "bg-aqua/20 border border-aqua/30"
            : "bg-navy/10 border border-navy/15"
        }`}
      >
        {icon}
      </div>
      <div>
        <h3
          className={`font-semibold text-base mb-2 ${dark ? "text-white" : "text-navy"}`}
        >
          {title}
        </h3>
        <p
          className={`text-sm leading-relaxed ${dark ? "text-white/50" : "text-steel/70"}`}
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Divider ─────────────────────────────────────────────────────
export function Divider({ light = false }) {
  return (
    <div
      className={`w-16 h-0.5 rounded-full ${light ? "bg-aqua/40" : "bg-steel/30"} my-6`}
    />
  );
}

// ─── Badge ───────────────────────────────────────────────────────
export function Badge({ children, color = "steel" }) {
  const styles = {
    steel: "bg-steel/10 text-steel border-steel/20",
    aqua: "bg-aqua/10 text-aqua border-aqua/20",
    navy: "bg-navy/10 text-navy border-navy/20",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${styles[color]}`}
    >
      {children}
    </span>
  );
}
// ─── Stats Card ────────────────────────────────────────────────────
export function StatCard({ label, value, icon, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(14px)",
        border: "1px solid rgba(255,255,255,0.9)",
        borderRadius: 16,
        padding: "18px 20px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        boxShadow: "0 4px 18px rgba(9,60,93,0.06)",
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: `${color}18`,
          border: `1px solid ${color}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <p
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: 26,
            fontWeight: 900,
            color: "#093C5D",
            lineHeight: 1,
          }}
        >
          {value}
        </p>
        <p
          style={{
            fontFamily: "DM Mono, monospace",
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(9,60,93,0.45)",
            marginTop: 4,
          }}
        >
          {label}
        </p>
      </div>
    </motion.div>
  );
}
