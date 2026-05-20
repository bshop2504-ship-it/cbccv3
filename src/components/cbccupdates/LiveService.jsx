import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Icon } from "../../assets/svg/Icon";
import { supabase } from "../../lib/supabaseClient";
import { fetchLiveStreams } from "../../api/livestream/livelink";

export default function LiveService() {
  const [watching, setWatching] = useState(false);
  const [floating, setFloating] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);

  const isLive = true;

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    let channel;

    const loadLive = async () => {
      const result = await fetchLiveStreams();

      if (result.success) {
        setLiveData(result.data);
      }

      setLoading(false);

      // REALTIME LISTENER
      channel = supabase
        .channel("livestream-realtime")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "livestream_tb",
          },
          async () => {
            const updated = await fetchLiveStreams();

            if (updated.success) {
              setLiveData(updated.data);
            }
          },
        )
        .subscribe();
    };

    loadLive();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        Loading live stream...
      </div>
    );
  }

  if (!liveData) {
    return (
      <section className="w-full min-h-screen flex flex-col items-center justify-center py-10 px-4 bg-[#f5f5f5]">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8 w-full max-w-6xl">
          <span className="text-cyan-400 animate-pulse">
            <Icon.Radio />
          </span>

          <span className="tracking-[0.3em] text-sm font-medium text-[#295a7a] uppercase">
            Live Service
          </span>

          <span className="flex items-center gap-1 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            LIVE
          </span>
        </div>

        {/* EMPTY CARD */}
        <div className="w-full max-w-6xl">
          <div
            className="relative h-[500px] rounded-[30px] overflow-hidden flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, #0f4a73 0%, #216796 55%, #2f7ca8 100%)",
            }}
          >
            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-black/10" />

            {/* CONTENT */}
            <div className="relative z-10 flex flex-col items-center text-center text-white">
              {/* PLAY BUTTON */}
              <div className="relative flex items-center justify-center">
                <div className="absolute w-44 h-44 rounded-full border border-cyan-300/10 animate-pulse" />

                <div className="absolute w-28 h-28 rounded-full bg-cyan-300/10" />

                <button className="w-24 h-24 rounded-full bg-cyan-300 flex items-center justify-center shadow-2xl hover:scale-105 transition">
                  <Icon.Play />
                </button>
              </div>

              {/* TITLE */}
              <h2 className="mt-10 text-4xl font-bold tracking-tight">
                No Live Stream Available
              </h2>

              {/* SUBTITLE */}
              <p className="mt-2 text-cyan-100 text-lg opacity-80">
                Please wait for the next worship celebration
              </p>

              {/* WATCHERS */}
              <div className="flex items-center gap-2 mt-6 text-cyan-100 opacity-70">
                <Icon.Signal />
                <span>0 watching</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const Player = () => {
    if (!liveData) return null;

    return (
      <motion.div
        className={`relative bg-black flex items-center justify-center ${
          fullscreen
            ? "w-screen h-screen"
            : "h-[420px] w-full rounded-2xl overflow-hidden"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
            liveData?.link,
          )}&show_text=false&width=560&t=0`}
          style={{ border: "none", overflow: "hidden" }}
          scrolling="no"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
        />

        <div className="absolute bottom-4 left-4 flex gap-2">
          <button
            onClick={() => {
              setWatching(false);
              setFloating(false);
              setFullscreen(false);
            }}
            className="w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-full transition hover:scale-105"
          >
            <Icon.Stop />
          </button>
          <button
            onClick={() => setFloating(true)}
            className="w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white rounded-full transition"
          >
            <Icon.Minimize />
          </button>

          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white rounded-full transition"
          >
            {fullscreen ? <Icon.FullscreenExit /> : <Icon.Fullscreen />}
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {/* NORMAL PAGE */}
      {!floating && (
        <section className="w-full min-h-screen flex flex-col items-center justify-center py-10 px-4 bg-gray-50">
          {/* HEADER */}
          <div className="flex items-center gap-3 mb-8">
            <span className="text-blue-500 animate-pulse">
              <Icon.Radio />
            </span>

            <span className="tracking-widest text-sm font-semibold text-gray-600">
              LIVE SERVICE
            </span>

            {isLive && (
              <span className="flex items-center gap-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE
              </span>
            )}
          </div>

          {/* CARD */}
          <div className="w-full flex justify-center">
            <div className="w-full max-w-4xl">
              <div className="rounded-2xl overflow-hidden shadow-xl bg-white">
                {!watching ? (
                  <div
                    className="relative h-[420px] flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, #1e6899 0%, #2f7fa5 50%, #3a7597 100%)",
                    }}
                  >
                    <div className="absolute inset-0 bg-black/10" />

                    {/* PLAY */}
                    <button
                      onClick={() => setWatching(true)}
                      className="relative z-10 w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:scale-110 transition"
                    >
                      <Icon.Play />
                    </button>

                    {/* INFO */}
                    <div className="absolute bottom-6 text-white text-center">
                      <h2 className="text-xl font-semibold">
                        {liveData.title || "Live Service"}
                      </h2>
                      <p className="text-sm opacity-80">
                        {liveData.speaker || "Church Service"}
                      </p>

                      <div className="flex items-center justify-center gap-2 mt-2 text-sm opacity-80">
                        <Icon.Signal />
                      </div>
                    </div>
                  </div>
                ) : (
                  <Player />
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FLOATING PLAYER */}
      {floating && !fullscreen && (
        <motion.div
          className="fixed bottom-5 right-5 w-80 bg-black rounded-xl shadow-2xl overflow-hidden z-50"
          drag
        >
          <Player />

          <button
            onClick={() => setFloating(false)}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full"
          >
            <Icon.Close />
          </button>
        </motion.div>
      )}

      {/* FULLSCREEN */}
      {fullscreen && (
        <div className="fixed inset-0 z-[999] bg-black">
          <Player />
        </div>
      )}
    </>
  );
}
