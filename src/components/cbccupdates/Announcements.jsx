import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  SignalIcon,
} from "../../assets/svg/Icons";
import { supabase } from "../../lib/supabaseClient";
import { publicFetchAnnouncements } from "../../api/announce/read-public";

export default function Announcements() {
  const [index, setIndex] = useState(0);
  const [announcements, setAnnouncements] = useState([]);

  const loadAnnouncements = async () => {
    try {
      const result = await publicFetchAnnouncements();

      const formatted = (result || []).map((item) => ({
        id: item.id,
        title: item.title,
        message: item.description,
        date: item.created_at
          ? new Date(item.created_at).toLocaleDateString()
          : "No date",
        category: item.category || "Announcement",
      }));

      setAnnouncements(formatted);
    } catch (err) {
      console.error("PUBLIC FETCH ERROR:", err);
      setAnnouncements([]);
    }
  };

  useEffect(() => {
    loadAnnouncements();

    const channel = supabase
      .channel("announce-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "announce_tb",
        },
        (payload) => {
          console.log("REALTIME EVENT:", payload);

          // reload data when something changes
          loadAnnouncements();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (announcements.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [announcements]);

  const current = announcements[index] || {};

  const next = () => {
    setIndex((prev) => (prev + 1) % announcements.length);
  };

  const prev = () => {
    setIndex(
      (prev) => (prev - 1 + announcements.length) % announcements.length,
    );
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-14 font-['DM_Sans']">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <span className="text-cyan-400">
          <SignalIcon />
        </span>

        <span className="uppercase tracking-[0.2em] text-[11px] font-medium text-slate-600 font-['DM_Mono']">
          Church Announcements
        </span>

        <span className="w-1 h-1 rounded-full bg-cyan-400 opacity-60" />

        <span className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-['DM_Mono']">
          Latest updates & schedules
        </span>
      </div>

      {/* Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.05)] overflow-hidden relative">
        {/* Background Glow */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-cyan-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id || index}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35 }}
            className="min-h-[240px] flex flex-col relative z-10"
          >
            {/* Top */}
            <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
              <div className="flex items-center gap-2 text-slate-400 text-xs uppercase tracking-[0.12em] font-['DM_Mono']">
                <CalendarIcon />
                <span>{current.date}</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="font-['Playfair_Display'] text-4xl md:text-6xl font-black text-[#093C5D] leading-[1.05] mb-5 max-w-4xl">
              {current.title}
            </h2>

            {/* Message */}
            <p className="text-slate-500 text-[15px] md:text-base leading-8 max-w-3xl">
              {current.message}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-10 flex items-center justify-between gap-4 flex-wrap relative z-10">
          {/* Dots */}
          <div className="flex items-center gap-2">
            {announcements.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-8 bg-cyan-400"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>

          {/* Nav */}
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#093C5D] hover:text-white hover:border-[#093C5D] transition-all duration-200"
            >
              <ChevronLeft />
            </button>

            <button
              onClick={next}
              className="w-11 h-11 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-[#093C5D] hover:text-white hover:border-[#093C5D] transition-all duration-200"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
