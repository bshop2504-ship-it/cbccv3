import { useState, useRef, useCallback } from "react";

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

const TYPE_ICON = {
  image: "🖼️",
  video: "🎬",
  pdf: "📄",
  doc: "📝",
  sheet: "📊",
  slide: "📑",
  audio: "🎵",
  archive: "🗜️",
  file: "📎",
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

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Glass card for each file */
function FileCard({ file, onPreview, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);

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
      <div className="flex flex-col items-center gap-2 text-white/40">
        <span className="text-4xl">{TYPE_ICON[file.type] || "📎"}</span>
        <span className="font-mono text-[9px] tracking-widest uppercase">
          {TYPE_LABEL[file.type] || "FILE"}
        </span>
      </div>
    );

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-white/90 bg-white/70 backdrop-blur-xl shadow-[0_6px_24px_rgba(9,60,93,0.07)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(9,60,93,0.14)] cursor-pointer"
      style={{ animation: "fadeUp 0.3s ease both" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onPreview(file)}
    >
      {/* Thumbnail */}
      <div className="relative h-36 bg-gradient-to-br from-[#093C5D] to-[#3B7597] flex items-center justify-center overflow-hidden">
        {thumbContent}

        {/* Type pill */}
        <span className="absolute top-2.5 left-2.5 font-mono text-[9px] tracking-wider uppercase bg-[#093C5D]/70 text-[#6FD1D7] px-2 py-0.5 rounded-md backdrop-blur-sm">
          {TYPE_LABEL[file.type] || "FILE"}
        </span>

        {/* Action buttons */}
        <div
          className="absolute top-2 right-2 flex gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onEdit(file)}
            className="w-7 h-7 rounded-lg border border-white/50 bg-white/88 text-[#093C5D] flex items-center justify-center text-sm transition-all hover:bg-white hover:scale-110"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(file)}
            className="w-7 h-7 rounded-lg border border-white/50 bg-white/88 text-[#093C5D] flex items-center justify-center text-sm transition-all hover:bg-red-500 hover:text-white hover:border-red-500"
          >
            🗑️
          </button>
        </div>

        {/* Hover overlay */}
        <div
          className={`absolute inset-0 bg-[#093C5D]/55 flex items-center justify-center gap-2 backdrop-blur-[2px] transition-opacity duration-200 ${hovered ? "opacity-100" : "opacity-0"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onPreview(file)}
            className="flex items-center gap-1.5 bg-white/15 border border-white/30 text-white rounded-xl px-3 py-1.5 text-xs font-medium transition-all hover:bg-white/28"
          >
            👁 Preview
          </button>
          {file.url && (
            <a
              href={file.url}
              download={file.name || file.title}
              className="flex items-center gap-1.5 bg-white/15 border border-white/30 text-white rounded-xl px-3 py-1.5 text-xs font-medium transition-all hover:bg-white/28"
              onClick={(e) => e.stopPropagation()}
            >
              ⬇ Save
            </a>
          )}
        </div>
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
          {file.url && (
            <a
              href={file.url}
              download={file.name || file.title}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 font-mono text-[9px] tracking-wider uppercase text-[#0a8c94] bg-[#6FD1D7]/10 border border-[#6FD1D7]/25 rounded-lg px-2.5 py-1 transition-all hover:bg-[#6FD1D7]/22"
            >
              ⬇ Download
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/** Add new file card */
function AddCard({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="min-h-[280px] rounded-2xl border-2 border-dashed border-[#093C5D]/13 bg-[#093C5D]/[0.02] cursor-pointer flex flex-col items-center justify-center gap-2.5 text-[#093C5D]/28 transition-all hover:border-[#093C5D]/25 hover:text-[#093C5D]/45 w-full"
    >
      <div className="w-10 h-10 border-2 border-dashed border-[#093C5D]/18 rounded-xl flex items-center justify-center text-xl">
        ＋
      </div>
      <span className="font-mono text-[10px] tracking-widest uppercase">
        Upload File
      </span>
    </button>
  );
}

/** Field wrapper */
function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-[#093C5D] tracking-wide uppercase">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <span className="text-[10px] text-red-400">{error}</span>}
    </div>
  );
}

/** Drop zone for file upload */
function DropZone({ onFile, fileName }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) onFile(f);
    },
    [onFile],
  );

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
        dragging
          ? "border-[#6FD1D7] bg-[#6FD1D7]/07"
          : "border-[#093C5D]/16 bg-[#093C5D]/[0.02] hover:border-[#6FD1D7] hover:bg-[#6FD1D7]/05"
      }`}
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <div className="text-3xl text-[#093C5D]/25 mb-2">☁️</div>
      <p className="text-xs text-[#093C5D]/45">
        Click to browse or drag & drop
      </p>
      <p className="font-mono text-[9px] text-[#093C5D]/28 mt-1 tracking-wide">
        Images · Videos · PDFs · Docs · Any file
      </p>
      {fileName && (
        <p className="text-xs text-[#0a8c94] font-semibold mt-2">
          📎 {fileName}
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files[0];
          if (f) onFile(f);
        }}
      />
    </div>
  );
}

/** Modal shell */
function Modal({
  open,
  onClose,
  title,
  icon,
  maxWidth = "max-w-lg",
  children,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-[#093C5D]/45 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div
        className={`bg-white rounded-2xl w-full ${maxWidth} overflow-hidden shadow-[0_30px_90px_rgba(9,60,93,0.22)]`}
        style={{ animation: "slideUp 0.22s ease" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#093C5D] to-[#1a5278] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-white">
            <span className="text-[#6FD1D7] text-lg">{icon}</span>
            <span className="text-sm font-semibold">{title}</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/12 border border-white/20 text-white flex items-center justify-center text-sm transition-all hover:bg-white/22"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Confirm delete modal */
function ConfirmDelete({ open, onClose, onConfirm, itemName }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete File"
      icon="🗑️"
      maxWidth="max-w-sm"
    >
      <div className="px-5 py-6 text-center">
        <div className="text-4xl text-red-400 mb-3">⚠️</div>
        <p className="text-sm font-bold text-[#093C5D] mb-2">
          Remove this file?
        </p>
        <p className="text-xs text-[#093C5D]/50 leading-relaxed">
          "{itemName}" will be permanently removed. This cannot be undone.
        </p>
      </div>
      <div className="px-5 pb-4 flex justify-end gap-2.5">
        <button
          onClick={onClose}
          className="bg-[#093C5D]/06 border border-[#093C5D]/12 text-[#093C5D] rounded-xl px-4 py-2 text-sm font-medium transition-all hover:bg-[#093C5D]/10"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="bg-red-500 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-all hover:bg-red-600"
        >
          Yes, Delete
        </button>
      </div>
    </Modal>
  );
}

/** Preview modal */
function PreviewModal({ file, onClose }) {
  if (!file) return null;

  const previewContent = () => {
    if (!file.url) {
      return (
        <div className="flex flex-col items-center gap-3 py-12 text-white/45">
          <span className="text-5xl">{TYPE_ICON[file.type] || "📎"}</span>
          <p className="text-sm">No file uploaded yet.</p>
        </div>
      );
    }
    if (file.type === "image")
      return (
        <img
          src={file.url}
          alt={file.title}
          className="w-full rounded-xl max-h-[55vh] object-contain"
        />
      );
    if (file.type === "video")
      return (
        <video
          src={file.url}
          controls
          className="w-full rounded-xl max-h-[55vh]"
        />
      );
    if (file.type === "audio")
      return (
        <div className="flex flex-col items-center gap-4 py-8 text-white/45">
          <span className="text-5xl">🎵</span>
          <audio src={file.url} controls className="w-full" />
        </div>
      );
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-white/45">
        <span className="text-5xl">{TYPE_ICON[file.type] || "📎"}</span>
        <p className="text-sm text-white/60">{file.name || file.title}</p>
        <p className="text-xs text-white/40">
          Click Download to open this file
        </p>
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
        <div className="px-5 py-3.5 border-t border-white/08 flex justify-end gap-2.5">
          {file.url && (
            <a
              href={file.url}
              download={file.name || file.title}
              className="flex items-center gap-1.5 bg-[#6FD1D7]/12 border border-[#6FD1D7]/25 text-[#6FD1D7] rounded-xl px-4 py-2 font-mono text-[10px] tracking-wider uppercase transition-all hover:bg-[#6FD1D7]/22"
            >
              ⬇ Download
            </a>
          )}
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

// ─── Upload / Edit Modal ─────────────────────────────────────────────────────
function UploadModal({ open, onClose, onSave, editing }) {
  const [title, setTitle] = useState(editing?.title || "");
  const [desc, setDesc] = useState(editing?.desc || "");
  const [date, setDate] = useState(editing?.date || "");
  const [pending, setPending] = useState(null);
  const [errors, setErrors] = useState({});

  // Reset when editing changes
  useState(() => {
    setTitle(editing?.title || "");
    setDesc(editing?.desc || "");
    setDate(editing?.date || "");
    setPending(null);
    setErrors({});
  }, [editing]);

  const handleFile = (file) => {
    setPending(file);
    if (!title.trim()) setTitle(file.name.replace(/\.[^.]+$/, ""));
  };

  const handleSave = () => {
    const e = {};
    if (!title.trim()) e.title = "Title is required";
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    if (pending) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onSave({
          title: title.trim(),
          desc: desc.trim(),
          date: date.trim(),
          url: ev.target.result,
          name: pending.name,
          size: pending.size,
          type: getType(pending.name),
        });
      };
      reader.readAsDataURL(pending);
    } else {
      onSave({ title: title.trim(), desc: desc.trim(), date: date.trim() });
    }
  };

  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Edit File" : "Upload File"}
      icon="📂"
    >
      <div className="px-5 py-5 flex flex-col gap-3.5 max-h-[60vh] overflow-y-auto">
        <Field label="Title" required error={errors.title}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Sunday Bulletin — May 18"
            className="border-[1.5px] border-[#093C5D]/14 rounded-xl px-3 py-2.5 text-sm font-[DM_Sans,sans-serif] text-[#093C5D] bg-[#f7fafc] outline-none transition-all focus:border-[#6FD1D7] focus:bg-white"
          />
        </Field>
        <Field label="Description">
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Brief description of this file..."
            rows={3}
            className="border-[1.5px] border-[#093C5D]/14 rounded-xl px-3 py-2.5 text-sm text-[#093C5D] bg-[#f7fafc] outline-none resize-y transition-all focus:border-[#6FD1D7] focus:bg-white min-h-[68px]"
          />
        </Field>
        <Field label="Date">
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="e.g. May 18, 2025"
            className="border-[1.5px] border-[#093C5D]/14 rounded-xl px-3 py-2.5 text-sm text-[#093C5D] bg-[#f7fafc] outline-none transition-all focus:border-[#6FD1D7] focus:bg-white"
          />
        </Field>
        <DropZone
          onFile={handleFile}
          fileName={
            pending
              ? `${pending.name} (${fmtSize(pending.size)})`
              : editing?.name || ""
          }
        />
      </div>
      <div className="px-5 py-3.5 border-t border-[#093C5D]/07 flex justify-end gap-2.5">
        <button
          onClick={onClose}
          className="bg-[#093C5D]/06 border border-[#093C5D]/12 text-[#093C5D] rounded-xl px-4 py-2 text-sm font-medium transition-all hover:bg-[#093C5D]/10"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="bg-gradient-to-r from-[#093C5D] to-[#1a5278] text-white rounded-xl px-5 py-2 text-sm font-semibold shadow-[0_4px_14px_rgba(9,60,93,0.22)] transition-all hover:-translate-y-px hover:shadow-[0_6px_18px_rgba(9,60,93,0.3)]"
        >
          Save File
        </button>
      </div>
    </Modal>
  );
}

// ─── Search Bar ──────────────────────────────────────────────────────────────
function SearchBar({ query, onChange, onClear, fileCount, onUpload, files }) {
  const [focused, setFocused] = useState(false);
  const [showSugg, setShowSugg] = useState(false);
  const recent = files.slice(-5).reverse();

  return (
    <div className="relative mb-7">
      <div
        className={`flex items-center gap-3 bg-white/85 backdrop-blur-xl border rounded-[18px] px-4 py-3 shadow-[0_8px_32px_rgba(9,60,93,0.08)] transition-all ${
          focused
            ? "border-[#6FD1D7]/60 shadow-[0_8px_32px_rgba(9,60,93,0.12),0_0_0_3px_rgba(111,209,215,0.12)]"
            : "border-white/95"
        }`}
      >
        <span className="text-[#6FD1D7] text-lg flex-shrink-0">🔍</span>
        <input
          value={query}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setFocused(true);
            setShowSugg(true);
          }}
          onBlur={() => {
            setFocused(false);
            setTimeout(() => setShowSugg(false), 160);
          }}
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
        <button
          onClick={onUpload}
          className="bg-gradient-to-r from-[#093C5D] to-[#1a5278] text-white rounded-xl px-3.5 py-1.5 text-xs font-semibold flex-shrink-0 shadow-[0_4px_14px_rgba(9,60,93,0.22)] transition-all hover:-translate-y-px"
        >
          + Upload
        </button>
      </div>

      {/* Suggestions dropdown */}
      {showSugg && recent.length > 0 && (
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-white/96 backdrop-blur-xl border border-white/95 rounded-2xl shadow-[0_16px_48px_rgba(9,60,93,0.12)] overflow-hidden z-50">
          <p className="font-mono text-[9px] tracking-widest uppercase text-[#093C5D]/35 px-4 pt-3 pb-1.5">
            Recent uploads
          </p>
          {recent.map((f) => (
            <button
              key={f.id}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 transition-colors hover:bg-[#093C5D]/04 text-left"
              onMouseDown={() => {
                onChange(f.title);
                setShowSugg(false);
              }}
            >
              <div className="w-7 h-7 rounded-lg bg-[#6FD1D7]/10 border border-[#6FD1D7]/20 flex items-center justify-center text-sm flex-shrink-0">
                {TYPE_ICON[f.type] || "📎"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#093C5D] truncate">
                  {f.title}
                </p>
                <p className="font-mono text-[10px] text-[#093C5D]/40 truncate">
                  {TYPE_LABEL[f.type]} {f.date ? `· ${f.date}` : ""}
                </p>
              </div>
              <span className="font-mono text-[9px] text-[#093C5D]/30 bg-[#093C5D]/06 px-1.5 py-0.5 rounded-md flex-shrink-0">
                ↵
              </span>
            </button>
          ))}
        </div>
      )}
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
  const [files, setFiles] = useState([]);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [previewing, setPreviewing] = useState(null);

  // Filtered list
  const filtered = files.filter((f) => {
    const matchType = activeFilter === "all" || f.type === activeFilter;
    const q = query.toLowerCase();
    const matchQ =
      !q ||
      f.title.toLowerCase().includes(q) ||
      (f.desc || "").toLowerCase().includes(q);
    return matchType && matchQ;
  });

  const handleSave = (data) => {
    if (editing) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === editing.id
            ? {
                ...f,
                ...data,
                url: data.url || f.url,
                name: data.name || f.name,
                size: data.size || f.size,
                type: data.type || f.type,
              }
            : f,
        ),
      );
    } else {
      setFiles((prev) => [...prev, { id: uid(), ...data }]);
    }
    setUploadOpen(false);
    setEditing(null);
  };

  const openEdit = (file) => {
    setEditing(file);
    setUploadOpen(true);
  };

  const openAdd = () => {
    setEditing(null);
    setUploadOpen(true);
  };

  const handleDelete = (file) => setDeleteTarget(file);
  const confirmDelete = () => {
    setFiles((prev) => prev.filter((f) => f.id !== deleteTarget?.id));
    setDeleteTarget(null);
  };

  return (
    <>
      {/* Keyframe animations */}
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div
        className="min-h-screen bg-[#F5F5F5] text-[#093C5D]"
        style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
      >
        {/* ── Page Header ── */}
        <header className="bg-gradient-to-br from-[#093C5D] via-[#0d4d76] to-[#3B7597] px-6 pt-20 pb-14 text-center relative overflow-hidden">
          {/* Orbs */}
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
              <span>✝</span>
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

        {/* ── Content ── */}
        <div className="max-w-5xl mx-auto px-6 py-14">
          {/* Eyebrow */}
          <div className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.18em] uppercase text-[#3B7597] mb-7">
            <span className="text-[#6FD1D7]">📁</span>
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
            onUpload={openAdd}
            files={files}
          />

          {/* Filters */}
          <FilterChips active={activeFilter} onChange={setActiveFilter} />

          {/* Grid */}
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(268px, 1fr))",
            }}
          >
            {filtered.length === 0 && files.length > 0 && (
              <div className="col-span-full text-center py-12 text-[#093C5D]/35">
                <p className="text-3xl mb-3 opacity-40">🔍</p>
                <p className="text-sm">No files match your search.</p>
              </div>
            )}
            {files.length === 0 && (
              <div className="col-span-full text-center py-16 text-[#093C5D]/35">
                <p className="text-4xl mb-3 opacity-40">📭</p>
                <p className="text-sm">No files yet. Upload your first file!</p>
              </div>
            )}
            {filtered.map((file, i) => (
              <div key={file.id} style={{ animationDelay: `${i * 0.05}s` }}>
                <FileCard
                  file={file}
                  onPreview={setPreviewing}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              </div>
            ))}
            <AddCard onClick={openAdd} />
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="text-center py-8 font-mono text-[11px] text-[#093C5D]/28 tracking-widest">
          CBCC · Cagayan Valley · "Loving God. Loving People. Making Disciples."
        </footer>
      </div>

      {/* ── Modals ── */}
      <UploadModal
        open={uploadOpen}
        onClose={() => {
          setUploadOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
        editing={editing}
      />

      <ConfirmDelete
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        itemName={deleteTarget?.title}
      />

      <PreviewModal file={previewing} onClose={() => setPreviewing(null)} />
    </>
  );
}
