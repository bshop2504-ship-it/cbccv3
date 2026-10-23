import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContext } from "../hooks/useToast";
import { colors } from "../lib/theme";

const MAX_VISIBLE = 4;

const VARIANTS = {
  success: { accent: colors.aqua, duration: 3500, label: "Success" },
  error: { accent: colors.danger, duration: 6000, label: "Error" },
  info: { accent: colors.steel, duration: 4000, label: "Notice" },
};

const toMessage = (value, fallback) => {
  if (typeof value === "string" && value.trim()) return value;
  if (value?.message) return value.message;
  return fallback;
};

function ToastIcon({ type }) {
  if (type === "success") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "error") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 8v5M12 16.5v.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 11v5M12 7.5v.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function ToastItem({ toast, onDismiss }) {
  const variant = VARIANTS[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), variant.duration);
    return () => clearTimeout(timer);
  }, [toast.id, variant.duration, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.96 }}
      transition={{ type: "spring", damping: 26, stiffness: 320 }}
      role={toast.type === "error" ? "alert" : "status"}
      className="pointer-events-auto relative overflow-hidden rounded-2xl border border-white bg-white/95 shadow-[0_12px_40px_rgba(9,60,93,0.18)] backdrop-blur-xl"
    >
      <div className="flex items-start gap-3 px-4 py-3.5 pr-11">
        <span
          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
          style={{ background: `${variant.accent}22`, color: toast.type === "success" ? colors.navy : variant.accent }}
        >
          <ToastIcon type={toast.type} />
        </span>

        <div className="min-w-0">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-navy/45">
            {variant.label}
          </p>
          <p className="break-words font-sans text-sm leading-snug text-navy">
            {toast.message}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-lg text-steel transition hover:bg-navy/5"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <motion.span
        className="absolute bottom-0 left-0 h-[3px]"
        style={{ background: variant.accent }}
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: variant.duration / 1000, ease: "linear" }}
      />
    </motion.div>
  );
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((type, message) => {
    nextId.current += 1;
    const id = nextId.current;
    setToasts((list) => [...list, { id, type, message }].slice(-MAX_VISIBLE));
    return id;
  }, []);

  const api = useMemo(
    () => ({
      success: (message) => push("success", toMessage(message, "Done")),
      error: (error, fallback = "Something went wrong. Please try again.") =>
        push("error", toMessage(error, fallback)),
      info: (message) => push("info", toMessage(message, "")),
      dismiss,
    }),
    [push, dismiss],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}

      <div
        aria-live="polite"
        className="pointer-events-none fixed left-4 right-4 top-4 z-[1100] flex flex-col gap-2 sm:left-auto sm:w-96"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
