import React, { useState, useRef, useEffect } from "react";
import { Icon } from "../../assets/svg/Icon";
import {
  Field,
  Input,
  Select,
  ImagePicker,
  Modal,
  ConfirmDelete,
  btnStyles,
} from "../AdminSharedComponents";
import {
  SectionHeader,
  ModalFooter,
  EmptyState,
  tagStyle,
  tableStyles,
  formGrid,
} from "../AdminSharedSubComponents";
// ─── PANEL: Daily Devotion ─────────────────────────────────────────
export default function DevotionPanel({ data, setData }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ word: "", verse: "", reference: "" });
  const [errors, setErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openAdd = () => {
    setEditing(null);
    setForm({ word: "", verse: "", reference: "" });
    setErrors({});
    setModalOpen(true);
  };
  const openEdit = (item) => {
    setEditing(item);
    setForm({ word: item.word, verse: item.verse, reference: item.reference });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const e = {};
    if (!form.word.trim()) e.word = "Word is required";
    if (!form.verse.trim()) e.verse = "Verse text is required";
    if (!form.reference.trim()) e.reference = "Bible reference is required";
    return e;
  };

  const save = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    if (editing) {
      setData((d) =>
        d.map((x) => (x.id === editing.id ? { ...x, ...form } : x)),
      );
    } else {
      setData((d) => [...d, { id: uid(), ...form }]);
    }
    setModalOpen(false);
  };

  const remove = (id) => {
    setData((d) => d.filter((x) => x.id !== id));
    setDeleteTarget(null);
  };

  return (
    <div>
      <SectionHeader
        icon={<Icon.Book />}
        label="Daily Devotion"
        count={data.length}
        onAdd={openAdd}
        addLabel="Add Devotion"
      />
      <div style={tableStyles.wrapper}>
        <table style={tableStyles.table}>
          <thead>
            <tr>
              {["Theme Word", "Bible Reference", "Verse Preview", ""].map(
                (h) => (
                  <th key={h} style={tableStyles.th}>
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={tableStyles.tr}
              >
                <td style={tableStyles.td}>
                  <span style={{ ...tagStyle("#6FD1D7") }}>{item.word}</span>
                </td>
                <td style={tableStyles.td}>
                  <span
                    style={{
                      fontFamily: "DM Mono, monospace",
                      fontSize: 12,
                      color: "#3B7597",
                    }}
                  >
                    {item.reference}
                  </span>
                </td>
                <td style={{ ...tableStyles.td, maxWidth: 260 }}>
                  <span
                    style={{
                      fontSize: 13,
                      color: "rgba(9,60,93,0.6)",
                      fontStyle: "italic",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    "{item.verse}"
                  </span>
                </td>
                <td style={{ ...tableStyles.td, textAlign: "right" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      style={btnStyles.iconBtn}
                      onClick={() => openEdit(item)}
                      title="Edit"
                    >
                      <Icon.Edit />
                    </button>
                    <button
                      style={btnStyles.danger}
                      onClick={() => setDeleteTarget(item)}
                      title="Delete"
                    >
                      <Icon.Trash />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && <EmptyState label="No devotions yet" />}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Devotion" : "Add Devotion"}
        icon={<Icon.Book />}
      >
        <div style={formGrid(1)}>
          <Field label="Theme Word" required error={errors.word}>
            <Input
              value={form.word}
              onChange={(e) => setForm((f) => ({ ...f, word: e.target.value }))}
              placeholder="e.g. Faith, Hope, Love"
            />
          </Field>
          <Field label="Bible Reference" required error={errors.reference}>
            <Input
              value={form.reference}
              onChange={(e) =>
                setForm((f) => ({ ...f, reference: e.target.value }))
              }
              placeholder="e.g. John 3:16, ESV"
            />
          </Field>
          <Field label="Verse Text" required error={errors.verse}>
            <Input
              value={form.verse}
              onChange={(e) =>
                setForm((f) => ({ ...f, verse: e.target.value }))
              }
              placeholder="Paste the full ESV verse here..."
              rows={4}
            />
          </Field>
        </div>
        <ModalFooter onClose={() => setModalOpen(false)} onSave={save} />
      </Modal>

      <ConfirmDelete
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => remove(deleteTarget?.id)}
        itemName={deleteTarget?.word}
      />
    </div>
  );
}
