import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Icon } from "../../assets/svg/Icon";
import {
  Field,
  Input,
  Modal,
  ConfirmDelete,
  btnStyles,
} from "../AdminSharedComponents";
import {
  SectionHeader,
  ModalFooter,
  EmptyState,
  LoadingState,
  tagStyle,
  tableStyles,
  formGrid,
} from "../AdminSharedSubComponents";
import { useToast } from "../../hooks/useToast";

import { createVerse } from "../../api/dailydevotion/create";
import { fetchVerses } from "../../api/dailydevotion/read";
import { updateVerse } from "../../api/dailydevotion/update";
import { deleteVerse } from "../../api/dailydevotion/delete";

// ─── PANEL: Daily Devotion ─────────────────────────────────────────
export default function DevotionPanel({ data, setData }) {
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    word: "",
    verse: "",
    reference: "",
  });

  const [errors, setErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ─── FETCH VERSES ─────────────────────────────────────────
  useEffect(() => {
    let ignore = false;

    fetchVerses().then((result) => {
      if (ignore) return;

      if (result.success) {
        setData(result.data);
      } else {
        toast.error(result.error, "Couldn't load devotions");
      }

      setLoading(false);
    });

    return () => {
      ignore = true;
    };
  }, [setData, toast]);

  // ─── OPEN ADD ─────────────────────────────────────────
  const openAdd = () => {
    setEditing(null);

    setForm({
      word: "",
      verse: "",
      reference: "",
    });

    setErrors({});
    setModalOpen(true);
  };

  // ─── OPEN EDIT ─────────────────────────────────────────
  const openEdit = (item) => {
    setEditing(item);

    setForm({
      word: item.word,
      verse: item.verse,
      reference: item.reference,
    });

    setErrors({});
    setModalOpen(true);
  };

  // ─── VALIDATE ─────────────────────────────────────────
  const validate = () => {
    const e = {};

    if (!form.word.trim()) e.word = "Word is required";

    if (!form.verse.trim()) e.verse = "Verse text is required";

    if (!form.reference.trim()) e.reference = "Bible reference is required";

    return e;
  };

  // ─── SAVE ─────────────────────────────────────────
  const save = async () => {
    const e = validate();

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setSaving(true);

    // UPDATE
    if (editing) {
      const result = await updateVerse({
        id: editing.id,
        word: form.word,
        verse: form.verse,
        reference: form.reference,
      });

      if (result.success) {
        setData((d) =>
          d.map((x) =>
            x.id === editing.id
              ? {
                  ...x,
                  word: form.word,
                  verse: form.verse,
                  reference: form.reference,
                }
              : x,
          ),
        );

        toast.success("Devotion updated");
        setModalOpen(false);
      } else {
        toast.error(result.error, "Couldn't update the devotion");
      }
    }

    // CREATE
    else {
      const result = await createVerse({
        word: form.word,
        verse: form.verse,
        reference: form.reference,
      });

      if (result.success) {
        setData((d) => [...result.data, ...d]);

        toast.success("Devotion added");
        setModalOpen(false);
      } else {
        toast.error(result.error, "Couldn't add the devotion");
      }
    }

    setSaving(false);
  };

  // ─── DELETE ─────────────────────────────────────────
  const remove = async (id) => {
    setDeleting(true);

    const result = await deleteVerse(id);

    setDeleting(false);

    if (result.success) {
      setData((d) => d.filter((x) => x.id !== id));
      toast.success("Devotion deleted");
      setDeleteTarget(null);
    } else {
      toast.error(result.error, "Couldn't delete the devotion");
    }
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
            {!loading &&
              data.map((item, i) => (
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
                    <div style={tableStyles.actions}>
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

        {loading ? (
          <LoadingState label="Loading devotions…" />
        ) : (
          data.length === 0 && <EmptyState label="No devotions yet" />
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => !saving && setModalOpen(false)}
        title={editing ? "Edit Devotion" : "Add Devotion"}
        icon={<Icon.Book />}
      >
        <div style={formGrid(1)}>
          <Field label="Theme Word" required error={errors.word}>
            <Input
              value={form.word}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  word: e.target.value,
                }))
              }
              placeholder="e.g. Faith, Hope, Love"
            />
          </Field>

          <Field label="Bible Reference" required error={errors.reference}>
            <Input
              value={form.reference}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  reference: e.target.value,
                }))
              }
              placeholder="e.g. John 3:16, ESV"
            />
          </Field>

          <Field label="Verse Text" required error={errors.verse}>
            <Input
              value={form.verse}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  verse: e.target.value,
                }))
              }
              placeholder="Paste the full ESV verse here..."
              rows={4}
            />
          </Field>
        </div>

        <ModalFooter
          onClose={() => setModalOpen(false)}
          onSave={save}
          loading={saving}
        />
      </Modal>

      <ConfirmDelete
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => remove(deleteTarget?.id)}
        itemName={deleteTarget?.word}
        loading={deleting}
      />
    </div>
  );
}
