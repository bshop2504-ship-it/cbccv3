import { useState, useEffect } from "react";

import { supabase } from "../lib/supabaseClient";
import { fetchWeeklyDevotions } from "../api/weeklydevotion/read";

function DocPreview({ fileUrl, bgColor }) {
  const lower = fileUrl?.toLowerCase() || "";

  const isImage =
    lower.includes(".png") ||
    lower.includes(".jpg") ||
    lower.includes(".jpeg") ||
    lower.includes(".gif") ||
    lower.includes(".webp");

  const isPdf = lower.includes(".pdf");

  return (
    <div
      className={`${bgColor} h-36 relative border-b border-black/[0.07] overflow-hidden`}
    >
      {/* FILE badge */}
      <div className="absolute top-2.5 left-2.5 z-20 bg-black/55 text-white text-[10px] font-mono tracking-wider px-2 py-0.5 rounded flex items-center gap-1.5 backdrop-blur-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
        FILE
      </div>

      {/* IMAGE */}
      {isImage ? (
        <img
          src={fileUrl}
          alt="preview"
          className="w-full h-full object-cover"
        />
      ) : (
        /* PDF + OTHER FILES */
        <iframe
          src={fileUrl}
          title="preview"
          className="w-full h-full bg-white"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/5 pointer-events-none" />
    </div>
  );
}
function FileCard({ file }) {
  return (
    <div className="bg-white rounded-2xl border border-black/[0.09] overflow-hidden flex flex-col">
      <DocPreview bgColor={file.bgColor} fileUrl={file.fileUrl} />

      <div className="p-3 flex flex-col flex-1">
        <p className="text-[#093C5D] font-semibold text-sm leading-snug mb-1 line-clamp-2">
          {file.title}
        </p>
        <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-3 flex-1">
          {file.description}
        </p>
        <div className="flex items-end justify-between gap-2 mt-auto">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] uppercase tracking-widest text-gray-400 font-medium mt-1">
              Uploaded
            </span>
            <span className="text-xs font-semibold text-[#093C5D]">
              {file.uploadedDate}
            </span>
          </div>

          <button
            onClick={() => window.open(file.fileUrl, "_blank")}
            className="bg-[#093C5D] text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-[#0d4d76] transition-colors shrink-0"
          >
            Open
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CBCCDevotion() {
  const [query, setQuery] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  useEffect(() => {
    loadDevotions();

    const channel = supabase
      .channel("weekly-devotions-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "weekly_devotion_tb",
        },
        (payload) => {
          console.log("Realtime change:", payload);

          // reload data automatically
          loadDevotions();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadDevotions = async () => {
    try {
      setLoading(true);

      const res = await fetchWeeklyDevotions();

      if (res.success) {
        const formatted = res.data.map((item, index) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          fileSize: item.file_size || "N/A",
          uploadedDate: new Date(item.date).toLocaleDateString(),
          bgColor: [
            "bg-slate-100",
            "bg-green-50",
            "bg-blue-50",
            "bg-amber-50",
            "bg-rose-50",
          ][index % 5],

          fileUrl: item.file,
        }));
        setFiles(formatted);
      } else {
        console.error(res.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const filteredFiles = files.filter(
    (f) =>
      f.title.toLowerCase().includes(query.toLowerCase()) ||
      f.description.toLowerCase().includes(query.toLowerCase()),
  );
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const q = query.toLowerCase();

    const matches = files
      .filter(
        (f) =>
          f.title.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q),
      )
      .slice(0, 5)
      .map((f) => ({
        id: f.id,
        title: f.title,
        meta: f.description,
      }));

    setSuggestions(matches);
  }, [query, files]);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .file-item { animation: fadeUp 0.3s ease both; }
      `}</style>

      <div
        className="min-h-screen bg-[#F5F5F5] text-[#093C5D]"
        style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
      >
        {/* Header */}
        <header className="bg-gradient-to-br from-[#093C5D] via-[#0d4d76] to-[#3B7597] px-6 pt-20 pb-14 text-center relative overflow-hidden">
          <div
            className="absolute w-72 h-72 -top-20 -right-14 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(111,209,215,0.18) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute w-48 h-48 -bottom-14 -left-10 rounded-full pointer-events-none opacity-50"
            style={{
              background:
                "radial-gradient(circle, rgba(111,209,215,0.18) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-[#6FD1D7] mb-4 px-4 py-1.5 rounded-full border border-[#6FD1D7]/30 bg-[#6FD1D7]/[0.08]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6FD1D7] opacity-50" />
              CBCC Files
            </div>

            <h1
              className="font-black text-white leading-none tracking-tight mb-3"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(34px, 6vw, 60px)",
                letterSpacing: "-0.02em",
              }}
            >
              Weekly <em className="text-[#6FD1D7] italic">Devotion</em>
            </h1>

            <p className="text-white/50 text-sm max-w-sm mx-auto">
              Bulletins, media, and documents
            </p>
          </div>
        </header>

        {/* Search */}
        <div className="px-6 pt-6 pb-2 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search files…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full bg-white border border-[#093C5D]/10 rounded-xl px-4 py-3 text-sm text-[#093C5D] placeholder-[#093C5D]/30 focus:outline-none focus:ring-2 focus:ring-[#6FD1D7]/40 transition"
            />

            {/* Result count */}
            {query && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-gray-400">
                {filteredFiles.length} results
              </div>
            )}
          </div>

          {/* Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 mt-2 w-[calc(100%-3rem)] bg-white border border-[#093C5D]/10 rounded-2xl shadow-xl overflow-hidden">
              {suggestions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setQuery(item.title);
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-[#F5F8FA] transition border-b border-black/[0.04] last:border-none"
                >
                  <div className="text-sm font-semibold text-[#093C5D] line-clamp-1">
                    {item.title}
                  </div>

                  <div className="text-xs text-gray-400 line-clamp-1 mt-1">
                    {item.meta}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Grid */}
        <main className="px-6 py-4 pb-16">
          {loading ? (
            <p className="text-center text-gray-400 text-sm mt-10">
              Loading files...
            </p>
          ) : filteredFiles.length === 0 ? (
            <p className="text-center text-gray-400 text-sm mt-10">
              No files found.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredFiles.map((file, i) => (
                <div
                  key={file.id}
                  className="file-item"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <FileCard file={file} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
