import { btnStyles, Spinner } from "./AdminSharedComponents";
import { Icon } from "../assets/svg/Icon.jsx";
import { colors, ink, fonts } from "../lib/theme";
// ─── Shared sub-components ─────────────────────────────────────────
export function SectionHeader({ icon, label, count, onAdd, addLabel }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
        flexWrap: "wrap",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            background: "rgba(9,60,93,0.07)",
            border: "1px solid rgba(9,60,93,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#3B7597",
          }}
        >
          {icon}
        </div>
        <h3
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: 20,
            fontWeight: 700,
            color: "#093C5D",
          }}
        >
          {label}
        </h3>
        <span
          style={{
            fontFamily: "DM Mono, monospace",
            fontSize: 11,
            background: "rgba(111,209,215,0.15)",
            color: "#3B7597",
            border: "1px solid rgba(111,209,215,0.3)",
            padding: "2px 8px",
            borderRadius: 999,
          }}
        >
          {count}
        </span>
      </div>
      <button onClick={onAdd} style={btnStyles.primary}>
        <Icon.Plus /> {addLabel}
      </button>
    </div>
  );
}

export function ModalFooter({
  onClose,
  onSave,
  saveLabel = "Save",
  loading = false,
  loadingLabel = "Saving…",
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        justifyContent: "flex-end",
        marginTop: 24,
        paddingTop: 20,
        borderTop: "1px solid rgba(9,60,93,0.07)",
      }}
    >
      <button
        onClick={onClose}
        disabled={loading}
        style={{ ...btnStyles.ghost, ...(loading && btnStyles.disabled) }}
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        disabled={loading}
        style={{
          ...btnStyles.primary,
          minWidth: 120,
          justifyContent: "center",
          ...(loading && btnStyles.disabled),
        }}
      >
        {loading ? <Spinner /> : <Icon.Check />}
        {loading ? loadingLabel : saveLabel}
      </button>
    </div>
  );
}

// label is kept for older call sites; title/subtitle/icon are optional extras
export function EmptyState({ label, title, subtitle, icon }) {
  return (
    <div
      style={{
        padding: "40px 24px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      {icon && (
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: ink(0.05),
            border: `1px dashed ${ink(0.18)}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: ink(0.35),
            marginBottom: 4,
          }}
        >
          {icon}
        </div>
      )}
      <span
        style={{
          color: ink(0.4),
          fontFamily: fonts.mono,
          fontSize: 12,
          letterSpacing: "0.08em",
        }}
      >
        {title ?? label}
      </span>
      {subtitle && (
        <span style={{ color: ink(0.35), fontFamily: fonts.sans, fontSize: 13 }}>
          {subtitle}
        </span>
      )}
    </div>
  );
}

export function LoadingState({ label = "Loading…" }) {
  return (
    <div
      role="status"
      style={{
        padding: "40px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        color: colors.steel,
        fontFamily: fonts.mono,
        fontSize: 12,
        letterSpacing: "0.08em",
      }}
    >
      <Spinner size={16} />
      {label}
    </div>
  );
}

export function tagStyle(color) {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "3px 10px",
    borderRadius: 999,
    fontSize: 11,
    fontFamily: "DM Mono, monospace",
    fontWeight: 600,
    letterSpacing: "0.06em",
    color: color,
    background: `${color}18`,
    border: `1px solid ${color}40`,
  };
}

export const tableStyles = {
  wrapper: {
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.9)",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(9,60,93,0.06)",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: 10,
    fontFamily: "DM Mono, monospace",
    fontWeight: 600,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "rgba(9,60,93,0.45)",
    borderBottom: "1px solid rgba(9,60,93,0.07)",
    background: "rgba(9,60,93,0.02)",
    whiteSpace: "nowrap",
  },
  tr: { borderBottom: "1px solid rgba(9,60,93,0.05)" },
  td: { padding: "14px 16px", verticalAlign: "middle", fontSize: 13 },
  // Edit/Delete button group in the last column
  actions: { display: "flex", gap: 6, justifyContent: "flex-end" },
};

export const formGrid = (cols) => ({
  display: "grid",
  gridTemplateColumns: cols === 2 ? "repeat(2, 1fr)" : "1fr",
  gap: 14,
});
