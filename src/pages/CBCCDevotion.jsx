import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchWeeklyDevotions } from "../api/weeklydevotion/read";

// ─── Type helpers ────────────────────────────────────────────────────────────
const EXT_MAP = {
  jpg: "image",
  jpeg: "image",
  png: "image",
  gif: "image",
  webp: "image",
  svg: "image",
  bmp: "image",
  mp4: "video",
  webm: "video",
  mov: "video",
  ogg: "video",
  avi: "video",
  pdf: "pdf",
  doc: "doc",
  docx: "doc",
  xls: "sheet",
  xlsx: "sheet",
  ppt: "slide",
  pptx: "slide",
  mp3: "audio",
  wav: "audio",
  aac: "audio",
  zip: "archive",
  rar: "archive",
  "7z": "archive",
};

const TYPE_LABEL = {
  image: "IMAGE",
  video: "VIDEO",
  pdf: "PDF",
  doc: "DOC",
  sheet: "SHEET",
  slide: "SLIDES",
  audio: "AUDIO",
  archive: "ARCHIVE",
  file: "FILE",
};

function getType(name) {
  if (!name) return "file";
  const ext = name.split(".").pop().toLowerCase();
  return EXT_MAP[ext] || "file";
}

function fmtSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

// ─── File Card ───────────────────────────────────────────────────────────────
function FileCard({ file, onPreview }) {
  const thumbContent =
    file.type === "image" && file.url ? (
      <img
        src={file.url}
        alt={file.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
    ) : file.type === "video" && file.url ? (
      <video
        src={file.url}
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />
    ) : (
      <div className="flex items-center justify-center w-full h-full">
        <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/45">
          {TYPE_LABEL[file.type] || "FILE"}
        </span>
      </div>
    );

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-white/90 bg-white/70 backdrop-blur-xl shadow-[0_6px_24px_rgba(9,60,93,0.07)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(9,60,93,0.14)] cursor-pointer"
      style={{ animation: "fadeUp 0.3s ease both" }}
      onClick={() => onPreview(file)}
    >
      {/* Thumbnail */}
      <div className="relative h-36 bg-gradient-to-br from-[#093C5D] to-[#3B7597] flex items-center justify-center overflow-hidden">
        {thumbContent}

        {/* Type pill */}
        <span className="absolute top-2.5 left-2.5 font-mono text-[9px] tracking-wider uppercase bg-[#093C5D]/70 text-[#6FD1D7] px-2 py-0.5 rounded-md backdrop-blur-sm">
          {TYPE_LABEL[file.type] || "FILE"}
        </span>
      </div>

      {/* Body */}
      <div className="p-3.5">
        {file.date && (
          <span className="block font-mono text-[9px] tracking-widest uppercase text-[#6FD1D7] mb-1">
            {file.date}
          </span>
        )}

        <p className="text-sm font-semibold text-[#093C5D] leading-snug mb-1.5">
          {file.title}
        </p>

        {file.desc && (
          <p className="text-[11.5px] text-[#093C5D]/52 leading-relaxed line-clamp-2 mb-2.5">
            {file.desc}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] text-[#093C5D]/35">
            {fmtSize(file.size)}
          </span>

          <a
            href={file.url || "#"}
            download={file.name || file.title}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();

              if (!file.url) {
                e.preventDefault();
              }
            }}
            className={`font-mono text-[9px] tracking-wider uppercase rounded-lg px-2.5 py-1 transition-all border ${
              file.url
                ? "text-[#0a8c94] bg-[#6FD1D7]/10 border-[#6FD1D7]/25 hover:bg-[#6FD1D7]/22"
                : "text-[#093C5D]/30 bg-[#093C5D]/05 border-[#093C5D]/10 cursor-not-allowed"
            }`}
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Preview Modal ───────────────────────────────────────────────────────────
function PreviewModal({ file, onClose }) {
  if (!file) return null;

  const previewContent = () => {
    if (!file.url) {
      return (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-white/45">No preview available.</p>
        </div>
      );
    }

    // IMAGE
    if (file.type === "image") {
      return (
        <img
          src={file.url}
          alt={file.title}
          className="w-full rounded-xl max-h-[75vh] object-contain"
        />
      );
    }

    // VIDEO
    if (file.type === "video") {
      return (
        <video
          src={file.url}
          controls
          className="w-full rounded-xl max-h-[75vh]"
        />
      );
    }

    // AUDIO
    if (file.type === "audio") {
      return (
        <div className="py-8">
          <audio src={file.url} controls className="w-full" />
        </div>
      );
    }

    // PDF
    if (file.type === "pdf") {
      return (
        <iframe
          src={file.url}
          title={file.title}
          className="w-full h-[75vh] rounded-xl bg-white"
        />
      );
    }

    // DOC / DOCX / XLS / PPT
    if (file.type === "doc" || file.type === "sheet" || file.type === "slide") {
      return (
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
            file.url,
          )}`}
          title={file.title}
          className="w-full h-[75vh] rounded-xl bg-white"
        />
      );
    }

    // OTHER FILES
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-white/45">
        <p className="text-sm text-white/60">{file.name || file.title}</p>

        <a
          href={file.url}
          download={file.name || file.title}
          className="bg-[#6FD1D7]/12 border border-[#6FD1D7]/25 text-[#6FD1D7] rounded-xl px-4 py-2 font-mono text-[10px] tracking-wider uppercase transition-all hover:bg-[#6FD1D7]/22"
        >
          Download File
        </a>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-[#05141f]/88 backdrop-blur-xl z-[100] flex items-center justify-center p-5">
      <div
        className="bg-[#0d3b58] rounded-2xl w-full max-w-3xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.45)]"
        style={{ animation: "slideUp 0.22s ease" }}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-white/08 flex items-center justify-between">
          <span className="text-white text-sm font-semibold">{file.title}</span>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/12 border border-white/20 text-white flex items-center justify-center text-sm transition-all hover:bg-white/22"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4">{previewContent()}</div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-white/08 flex justify-end">
          <button
            onClick={onClose}
            className="bg-white/08 border border-white/15 text-white/70 rounded-xl px-4 py-2 text-sm transition-all hover:bg-white/15"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Search Bar ──────────────────────────────────────────────────────────────
function SearchBar({ query, onChange, onClear, fileCount }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative mb-7">
      <div
        className={`flex items-center gap-3 bg-white/85 backdrop-blur-xl border rounded-[18px] px-4 py-3 shadow-[0_8px_32px_rgba(9,60,93,0.08)] transition-all ${
          focused
            ? "border-[#6FD1D7]/60 shadow-[0_8px_32px_rgba(9,60,93,0.12),0_0_0_3px_rgba(111,209,215,0.12)]"
            : "border-white/95"
        }`}
      >
        <span className="text-[#6FD1D7] text-lg flex-shrink-0">Search</span>

        <input
          value={query}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search files, bulletins, media..."
          className="flex-1 bg-transparent text-sm text-[#093C5D] placeholder-[#093C5D]/35 outline-none"
        />

        {query && (
          <button
            onClick={onClear}
            className="w-6 h-6 rounded-lg bg-[#093C5D]/08 text-[#093C5D]/40 flex items-center justify-center text-xs transition-all hover:bg-[#093C5D]/15 hover:text-[#093C5D]"
          >
            ✕
          </button>
        )}

        <div className="w-px h-4 bg-[#093C5D]/12" />

        <span className="font-mono text-[10px] text-[#093C5D]/35 tracking-wide flex-shrink-0">
          {fileCount} file{fileCount !== 1 ? "s" : ""}
        </span>

        <div className="w-px h-4 bg-[#093C5D]/12" />

        <button className="bg-gradient-to-r from-[#093C5D] to-[#1a5278] text-white rounded-xl px-3.5 py-1.5 text-xs font-semibold flex-shrink-0 shadow-[0_4px_14px_rgba(9,60,93,0.22)] transition-all hover:-translate-y-px">
          Search
        </button>
      </div>
    </div>
  );
}

// ─── Filter chips ────────────────────────────────────────────────────────────
const FILTERS = [
  { type: "all", label: "All" },
  { type: "image", label: "Images" },
  { type: "video", label: "Videos" },
  { type: "pdf", label: "PDFs" },
  { type: "doc", label: "Documents" },
  { type: "file", label: "Other" },
];

function FilterChips({ active, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap mb-6">
      {FILTERS.map(({ type, label }) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border-[1.5px] font-mono text-[10px] tracking-widest uppercase transition-all ${
            active === type
              ? "border-[#6FD1D7] bg-[#6FD1D7]/10 text-[#0a8c94]"
              : "border-[#093C5D]/12 bg-white/70 backdrop-blur-sm text-[#093C5D]/50 hover:border-[#6FD1D7]/40 hover:text-[#0a8c94]"
          }`}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "currentColor", opacity: 0.6 }}
          />
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function CBCCDevotion() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [previewing, setPreviewing] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // ─── FETCH DATA ────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadDevotions = async () => {
      setLoading(true);

      const result = await fetchWeeklyDevotions();

      if (result.success) {
        const mapped = result.data.map((item) => ({
          id: item.id,
          title: item.title || "Untitled File",
          desc: item.description || "",
          date: item.date || "",
          url: item.file_url || item.url || "",
          name: item.file_name || item.title || "file",
          size: item.file_size || 0,
          type: getType(item.file_name || item.file_url || item.url || "file"),
        }));

        setFiles(mapped);
      }

      setLoading(false);
    };

    loadDevotions();
  }, []);

  // ─── FILTER ────────────────────────────────────────────────────────────────
  const filtered = files.filter((f) => {
    const matchType = activeFilter === "all" || f.type === activeFilter;

    const q = query.toLowerCase();

    const matchQ =
      !q ||
      f.title.toLowerCase().includes(q) ||
      (f.desc || "").toLowerCase().includes(q);

    return matchType && matchQ;
  });

  return (
    <>
      {/* Keyframe animations */}
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
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
            <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-[#6FD1D7] mb-4 px-4 py-1.5 rounded-full border border-[#6FD1D7]/30 bg-[#6FD1D7]/08">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6FD1D7] opacity-50" />
              <span>CBCC Files</span>
            </div>

            <h1
              className="font-bold text-white leading-none tracking-tight mb-3"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(34px, 6vw, 60px)",
                fontWeight: 900,
                letterSpacing: "-0.02em",
              }}
            >
              Church{" "}
              <em className="text-[#6FD1D7]" style={{ fontStyle: "italic" }}>
                Resources
              </em>
            </h1>

            <p className="text-white/50 text-sm max-w-sm mx-auto">
              Bulletins, media, and documents from Cauayan Bible Christian
              Church.
            </p>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-6 py-14">
          <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.18em] uppercase text-[#3B7597] mb-7">
            <span>File Library</span>

            <span className="w-1 h-1 rounded-full bg-[#6FD1D7] opacity-50" />

            <span className="text-[10px] text-[#3B7597]/55">
              Download & Preview
            </span>
          </div>

          {/* Search */}
          <SearchBar
            query={query}
            onChange={setQuery}
            onClear={() => setQuery("")}
            fileCount={filtered.length}
          />

          {/* Filters */}
          <FilterChips active={activeFilter} onChange={setActiveFilter} />

          {/* Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: 20,
              alignItems: "start",
            }}
          >
            <AnimatePresence>
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  whileHover={{ y: -4 }}
                  style={{
                    background: "rgba(255,255,255,0.88)",
                    backdropFilter: "blur(14px)",
                    borderRadius: 24,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.7)",
                    boxShadow: "0 10px 35px rgba(9,60,93,0.08)",
                    position: "relative",
                  }}
                >
                  {/* PREVIEW */}
                  <div
                    style={{
                      height: 230,
                      position: "relative",
                      background: "#EDF2F7",
                      overflow: "hidden",
                    }}
                  >
                    {/* IMAGE */}
                    {item.type === "image" && (
                      <img
                        src={item.url}
                        alt={item.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}

                    {/* VIDEO */}
                    {item.type === "video" && (
                      <video
                        src={item.url}
                        controls
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          background: "#000",
                        }}
                      />
                    )}

                    {/* PDF */}
                    {item.type === "pdf" && (
                      <iframe
                        src={`${item.url}#toolbar=0`}
                        title={item.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          border: "none",
                        }}
                      />
                    )}

                    {/* OTHER FILES */}
                    {item.type !== "image" &&
                      item.type !== "video" &&
                      item.type !== "pdf" && (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 14,
                            padding: 20,
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              width: 78,
                              height: 78,
                              borderRadius: 24,
                              background: "rgba(9,60,93,0.08)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 32,
                            }}
                          >
                            📄
                          </div>

                          <div>
                            <p
                              style={{
                                fontWeight: 700,
                                fontSize: 14,
                                color: "#093C5D",
                                marginBottom: 6,
                                wordBreak: "break-word",
                              }}
                            >
                              {item.title}
                            </p>

                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                textDecoration: "none",
                                color: "#38B2AC",
                                fontWeight: 600,
                                fontSize: 13,
                              }}
                            >
                              Open File
                            </a>
                          </div>
                        </div>
                      )}

                    {/* OVERLAY */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.45), transparent 55%)",
                        pointerEvents: "none",
                      }}
                    />

                    {/* FILE TYPE BADGE */}
                    <div
                      style={{
                        position: "absolute",
                        left: 16,
                        bottom: 16,
                        background: "rgba(255,255,255,0.9)",
                        backdropFilter: "blur(10px)",
                        borderRadius: 999,
                        padding: "6px 12px",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        zIndex: 5,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 999,
                          background: "#38B2AC",
                        }}
                      />

                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "#093C5D",
                        }}
                      >
                        {item.type}
                      </span>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-5">
                    {/* TITLE */}
                    <h3 className="mb-2 text-[17px] font-bold leading-[1.4] text-[#093C5D]">
                      {item.title}
                    </h3>

                    {/* DESCRIPTION */}
                    {item.desc && (
                      <p className="mb-4 text-sm leading-7 text-[#093C5DAD]">
                        {item.desc}
                      </p>
                    )}

                    {/* DATE */}
                    <div className="mb-4 rounded-xl bg-[#093C5D0A] px-4 py-3">
                      <p className="mb-1 text-[11px] text-[#093C5D99]">
                        Uploaded Date
                      </p>

                      <span className="text-sm font-semibold text-[#093C5D]">
                        {item.date}
                      </span>
                    </div>

                    {/* BUTTON */}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-xl bg-[#093C5D] px-4 py-2 text-sm font-semibold text-white no-underline transition hover:opacity-90"
                    >
                      Open File
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 font-mono text-[11px] text-[#093C5D]/28 tracking-widest">
          CBCC · Cagayan Valley · "Loving God. Loving People. Making Disciples."
        </footer>
      </div>

      {/* Preview */}
      <PreviewModal file={previewing} onClose={() => setPreviewing(null)} />
    </>
  );
}
