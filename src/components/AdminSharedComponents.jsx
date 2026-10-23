import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "../assets/svg/Icon.jsx";
import { colors, ink } from "../lib/theme";

// ─── Shared: Spinner ────────────────────────────────────────────────
export function Spinner({ size = 14, color = "currentColor" }) {
  return (
    <motion.span
      aria-hidden="true"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        border: `2px solid ${color}`,
        borderTopColor: "transparent",
        opacity: 0.85,
        flexShrink: 0,
      }}
    />
  );
}

// ─── Shared: Field input ────────────────────────────────────────────
export function Field({ label, required, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontSize: 11,
          fontFamily: "DM Mono, monospace",
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: error ? "#E53E3E" : "rgba(9,60,93,0.55)",
        }}
      >
        {label}
        {required && <span style={{ color: "#6FD1D7", marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {error && <span style={{ fontSize: 11, color: "#E53E3E" }}>{error}</span>}
    </div>
  );
}

export function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  rows,
  style = {},
}) {
  const base = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid rgba(9,60,93,0.14)",
    background: "rgba(9,60,93,0.03)",
    color: "#093C5D",
    fontFamily: "DM Sans, sans-serif",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    resize: rows ? "vertical" : undefined,
    ...style,
  };
  const [focused, setFocused] = useState(false);
  const focusStyle = focused
    ? { borderColor: "#6FD1D7", boxShadow: "0 0 0 3px rgba(111,209,215,0.12)" }
    : {};
  const props = {
    value,
    onChange,
    placeholder,
    style: { ...base, ...focusStyle },
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  };
  if (rows) return <textarea rows={rows} {...props} />;
  return <input type={type} {...props} />;
}

export function Select({ value, onChange, options, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <select
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        padding: "10px 14px",
        borderRadius: 10,
        border: `1px solid ${focused ? "#6FD1D7" : "rgba(9,60,93,0.14)"}`,
        background: "rgba(9,60,93,0.03)",
        color: value ? "#093C5D" : "rgba(9,60,93,0.4)",
        fontFamily: "DM Sans, sans-serif",
        fontSize: 14,
        outline: "none",
        boxShadow: focused ? "0 0 0 3px rgba(111,209,215,0.12)" : "none",
        transition: "all 0.2s",
        cursor: "pointer",
      }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

// ─── Shared: Image Picker (URL + device upload) ────────────────────
export function ImagePicker({
  value,
  onChange,
  label = "Image",
  height = 160,
}) {
  const [tab, setTab] = useState(typeof value === "string" ? "url" : "device");

  const [urlInput, setUrlInput] = useState(
    typeof value === "string" ? value : "",
  );

  const [dragging, setDragging] = useState(false);

  const fileRef = useRef(null);

  // Preview handler
  const preview = value instanceof File ? URL.createObjectURL(value) : value;

  // Apply file
  const applyFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;

    // IMPORTANT:
    // send actual File object
    onChange(file);
  };

  // Drag drop
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    applyFile(e.dataTransfer.files[0]);
  };

  // URL apply
  const handleUrlApply = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  // Clear
  const clear = () => {
    onChange("");
    setUrlInput("");
  };

  // Tab button style
  const tabBtn = (id) => ({
    padding: "6px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontSize: 12,
    fontFamily: "DM Sans, sans-serif",
    fontWeight: 500,
    background: tab === id ? "#093C5D" : "transparent",
    color: tab === id ? "#6FD1D7" : "rgba(9,60,93,0.45)",
    transition: "all 0.2s",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <label
          style={{
            fontSize: 11,
            fontFamily: "DM Mono, monospace",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(9,60,93,0.55)",
          }}
        >
          {label}
        </label>

        <div
          style={{
            display: "flex",
            gap: 2,
            background: "rgba(9,60,93,0.06)",
            borderRadius: 10,
            padding: 3,
          }}
        >
          <button
            type="button"
            style={tabBtn("device")}
            onClick={() => setTab("device")}
          >
            Device
          </button>
        </div>
      </div>

      {/* Preview */}
      {value && (
        <div
          style={{
            position: "relative",
            borderRadius: 12,
            overflow: "hidden",
            height,
            border: "1px solid rgba(9,60,93,0.1)",
          }}
        >
          <img
            src={preview}
            alt="Preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
            onError={() => onChange("")}
          />

          {/* Remove */}
          <button
            type="button"
            onClick={clear}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "rgba(229,62,62,0.9)",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              lineHeight: 1,
            }}
          >
            ×
          </button>

          {/* Label */}
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: 8,
              background: "rgba(9,60,93,0.7)",
              borderRadius: 6,
              padding: "2px 8px",
            }}
          >
            <span
              style={{
                fontFamily: "DM Mono, monospace",
                fontSize: 9,
                color: "#6FD1D7",
                letterSpacing: "0.1em",
              }}
            >
              {value instanceof File ? "FROM DEVICE" : "FROM URL"}
            </span>
          </div>
        </div>
      )}

      {/* Upload Area */}
      {tab === "device" && !value && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          style={{
            height,
            borderRadius: 12,
            cursor: "pointer",
            border: `2px dashed ${dragging ? "#6FD1D7" : "rgba(9,60,93,0.2)"}`,
            background: dragging
              ? "rgba(111,209,215,0.06)"
              : "rgba(9,60,93,0.02)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            transition: "all 0.2s",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: dragging
                ? "rgba(111,209,215,0.15)"
                : "rgba(9,60,93,0.06)",
              border: `1.5px dashed ${
                dragging ? "#6FD1D7" : "rgba(9,60,93,0.2)"
              }`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              transition: "all 0.2s",
            }}
          >
            📷
          </div>

          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: dragging ? "#6FD1D7" : "#093C5D",
                marginBottom: 4,
              }}
            >
              {dragging ? "Drop image here" : "Click or drag to upload"}
            </p>

            <p
              style={{
                fontSize: 11,
                color: "rgba(9,60,93,0.35)",
                fontFamily: "DM Mono, monospace",
              }}
            >
              JPG, PNG, WEBP, GIF
            </p>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => applyFile(e.target.files[0])}
          />
        </div>
      )}
    </div>
  );
}

export function FilePicker({ value, onChange, label = "File", height = 160 }) {
  const [tab, setTab] = useState("device");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  const isFile = value instanceof File;
  const isImage = isFile
    ? value.type?.startsWith("image/")
    : typeof value === "string";

  const preview = isFile
    ? isImage
      ? URL.createObjectURL(value)
      : null
    : value;

  const applyFile = (file) => {
    if (!file) return;
    onChange(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    applyFile(e.dataTransfer.files[0]);
  };

  const clear = () => {
    onChange("");
  };

  const tabBtn = (id) => ({
    padding: "6px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontSize: 12,
    fontFamily: "DM Sans, sans-serif",
    fontWeight: 500,
    background: tab === id ? "#093C5D" : "transparent",
    color: tab === id ? "#6FD1D7" : "rgba(9,60,93,0.45)",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <label
          style={{
            fontSize: 11,
            fontFamily: "DM Mono, monospace",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(9,60,93,0.55)",
          }}
        >
          {label}
        </label>

        <div style={{ display: "flex", gap: 4 }}>
          <button style={tabBtn("device")} onClick={() => setTab("device")}>
            Device
          </button>
        </div>
      </div>

      {/* PREVIEW */}
      {value && (
        <div
          style={{
            position: "relative",
            height,
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid rgba(9,60,93,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f5f7fa",
          }}
        >
          {/* IMAGE FILE */}
          {isImage && preview && (
            <img
              src={preview}
              alt="preview"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}

          {/* NON-IMAGE FILE */}
          {!isImage && (
            <div
              style={{
                textAlign: "center",
                color: "rgba(9,60,93,0.6)",
                fontFamily: "DM Mono, monospace",
                fontSize: 12,
              }}
            >
              FILE SELECTED
              <br />
              <span style={{ fontSize: 10 }}>
                {isFile ? value.name : "URL FILE"}
              </span>
            </div>
          )}

          {/* REMOVE */}
          <button
            onClick={clear}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "rgba(229,62,62,0.9)",
              border: "none",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            ×
          </button>

          {/* LABEL */}
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: 8,
              background: "rgba(9,60,93,0.7)",
              borderRadius: 6,
              padding: "2px 8px",
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontFamily: "DM Mono, monospace",
                color: "#6FD1D7",
              }}
            >
              {isFile ? "FROM DEVICE" : "FROM URL"}
            </span>
          </div>
        </div>
      )}

      {/* UPLOAD AREA */}
      {tab === "device" && !value && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          style={{
            height,
            borderRadius: 12,
            cursor: "pointer",
            border: `2px dashed ${dragging ? "#6FD1D7" : "rgba(9,60,93,0.2)"}`,
            background: dragging
              ? "rgba(111,209,215,0.06)"
              : "rgba(9,60,93,0.02)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: 24 }}></div>

          <p
            style={{
              fontSize: 13,
              color: "#093C5D",
              fontWeight: 500,
            }}
          >
            {dragging ? "Drop file here" : "Click or drag to upload"}
          </p>

          <p
            style={{
              fontSize: 11,
              fontFamily: "DM Mono, monospace",
              color: "rgba(9,60,93,0.4)",
            }}
          >
            ALL FILE TYPES SUPPORTED
          </p>

          <input
            ref={fileRef}
            type="file"
            accept="*/*"
            style={{ display: "none" }}
            onChange={(e) => applyFile(e.target.files[0])}
          />
        </div>
      )}
    </div>
  );
}
// ─── Shared: Modal Shell ───────────────────────────────────────────
export function Modal({ isOpen, onClose, title, icon, children, width = 540 }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(9,60,93,0.55)",
              backdropFilter: "blur(8px)",
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 16 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: width,
              maxHeight: "90vh",
              overflowY: "auto",
              background: "rgba(255,255,255,0.96)",
              backdropFilter: "blur(20px)",
              borderRadius: 24,
              boxShadow: "0 24px 80px rgba(9,60,93,0.18)",
              border: "1px solid rgba(255,255,255,0.9)",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "22px 28px 18px",
                borderBottom: "1px solid rgba(9,60,93,0.07)",
                position: "sticky",
                top: 0,
                background: "rgba(255,255,255,0.98)",
                borderRadius: "24px 24px 0 0",
                zIndex: 5,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(9,60,93,0.07)",
                    border: "1px solid rgba(9,60,93,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#093C5D",
                  }}
                >
                  {icon}
                </div>
                <h2
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#093C5D",
                  }}
                >
                  {title}
                </h2>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: "1px solid rgba(9,60,93,0.1)",
                  background: "rgba(9,60,93,0.04)",
                  color: "#3B7597",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
              >
                <Icon.X />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "24px 28px 28px" }}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Shared: Confirm Delete Dialog ────────────────────────────────
export function ConfirmDelete({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  loading = false,
}) {
  // Don't let the dialog close while the delete is still running
  const close = loading ? () => {} : onClose;

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title="Confirm Delete"
      icon={<Icon.Trash />}
      width={400}
    >
      <p
        style={{
          color: colors.steel,
          fontSize: 14,
          lineHeight: 1.6,
          marginBottom: 24,
        }}
      >
        Are you sure you want to delete{" "}
        <strong style={{ color: colors.navy }}>"{itemName}"</strong>? This
        action cannot be undone.
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button
          onClick={close}
          disabled={loading}
          style={{ ...btnStyles.ghost, ...(loading && btnStyles.disabled) }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          style={{
            ...btnStyles.primary,
            background: colors.danger,
            color: colors.white,
            boxShadow: "0 4px 12px rgba(229,62,62,0.25)",
            ...(loading && btnStyles.disabled),
          }}
        >
          {loading ? <Spinner /> : <Icon.Trash />}
          {loading ? "Deleting…" : "Delete"}
        </button>
      </div>
    </Modal>
  );
}

// ─── Shared Button styles ─────────────────────────────────────────────────
export const btnStyles = {
  primary: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "10px 20px",
    borderRadius: 11,
    border: "none",
    background: "#093C5D",
    color: "#6FD1D7",
    fontFamily: "DM Sans, sans-serif",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 4px 14px rgba(9,60,93,0.2)",
  },
  ghost: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "10px 20px",
    borderRadius: 11,
    border: "1px solid rgba(9,60,93,0.14)",
    background: "transparent",
    color: "#3B7597",
    fontFamily: "DM Sans, sans-serif",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  iconBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    borderRadius: 8,
    border: "1px solid rgba(9,60,93,0.12)",
    background: "rgba(9,60,93,0.03)",
    color: "#3B7597",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  danger: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    borderRadius: 8,
    border: "1px solid rgba(229,62,62,0.2)",
    background: "rgba(229,62,62,0.05)",
    color: "#E53E3E",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  // Icon buttons that sit on top of an image/preview (media cards)
  overlay: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 34,
    height: 34,
    borderRadius: 10,
    border: "none",
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(8px)",
    color: colors.steel,
    cursor: "pointer",
    boxShadow: `0 2px 10px ${ink(0.12)}`,
    transition: "all 0.2s",
  },
  overlayDanger: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 34,
    height: 34,
    borderRadius: 10,
    border: "none",
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(8px)",
    color: colors.danger,
    cursor: "pointer",
    boxShadow: `0 2px 10px ${ink(0.12)}`,
    transition: "all 0.2s",
  },
  // Spread after any button style while it's busy/disabled
  disabled: {
    opacity: 0.6,
    cursor: "not-allowed",
    boxShadow: "none",
  },
};
