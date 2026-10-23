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
  tableStyles,
  formGrid,
} from "../AdminSharedSubComponents";
import { useToast } from "../../hooks/useToast";
import { createLiveStream } from "../../api/livestream/create";
import { fetchLiveStreams } from "../../api/livestream/read";
import { updateLiveStream } from "../../api/livestream/update";
import { deleteLiveStream } from "../../api/livestream/delete";
export default function LivePanel({ data, setData }) {
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const empty = { title: "", description: "", pastor: "", link: "" };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setForm(empty);
    setErrors({});
    setModalOpen(true);
  };
  const openEdit = (item) => {
    setEditing(item);
    setForm({ ...item });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.link.trim()) e.link = "Live link is required";
    if (!form.pastor.trim()) e.pastor = "Pastor is required";
    return e;
  };

  const save = async () => {
    const e = validate();

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setSaving(true);

    try {
      let res;

      if (editing) {
        res = await updateLiveStream({
          id: editing.id,
          ...form,
        });
      } else {
        res = await createLiveStream(form);
      }

      if (!res.success) {
        toast.error(res.error, "Couldn't save the live stream");
        return;
      }

      await loadLiveStreams();

      toast.success(editing ? "Live stream updated" : "Live stream added");
      setModalOpen(false);
      setForm(empty);
      setEditing(null);
    } catch (err) {
      toast.error(err, "Couldn't save the live stream");
    } finally {
      setSaving(false);
    }
  };

  const loadLiveStreams = async () => {
    const res = await fetchLiveStreams();

    if (res.success) {
      setData(res.data);
    } else {
      toast.error(res.error, "Couldn't load live streams");
    }

    setLoading(false);
  };

  useEffect(() => {
    loadLiveStreams();
  }, []);

  const remove = async (id) => {
    setDeleting(true);

    const res = await deleteLiveStream(id);

    setDeleting(false);

    if (!res.success) {
      toast.error(res.error, "Couldn't delete the live stream");
      return;
    }

    await loadLiveStreams();

    toast.success("Live stream deleted");
    setDeleteTarget(null);
  };

  return (
    <div>
      <SectionHeader
        icon={<Icon.Radio />}
        label="Live Service"
        count={data.length}
        onAdd={openAdd}
        addLabel="Add Live Stream"
      />
      <div style={tableStyles.wrapper}>
        <table style={tableStyles.table}>
          <thead>
            <tr>
              {["Title", "Pastor", "Live Link", "Status", ""].map((h) => (
                <th key={h} style={tableStyles.th}>
                  {h}
                </th>
              ))}
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
                <td
                  style={{
                    ...tableStyles.td,
                    fontWeight: 500,
                    color: "#093C5D",
                  }}
                >
                  {item.title}
                </td>
                <td
                  style={{
                    ...tableStyles.td,
                    fontSize: 13,
                    color: "rgba(9,60,93,0.7)",
                  }}
                >
                  {item.pastor}
                </td>
                <td style={tableStyles.td}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      color: "#3B7597",
                      fontSize: 12,
                      fontFamily: "DM Mono, monospace",
                      textDecoration: "none",
                    }}
                  >
                    <Icon.Link />{" "}
                    {item.link.length > 30
                      ? item.link.slice(0, 30) + "..."
                      : item.link}
                  </a>
                </td>
                <td style={tableStyles.td}>
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 5 }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#E53E3E",
                        display: "inline-block",
                        boxShadow: "0 0 0 3px rgba(229,62,62,0.2)",
                        animation: "liveDot 1s ease-in-out infinite",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "DM Mono, monospace",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#E53E3E",
                        letterSpacing: "0.12em",
                      }}
                    >
                      LIVE
                    </span>
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
          <LoadingState label="Loading live streams…" />
        ) : (
          data.length === 0 && <EmptyState label="No live streams yet" />
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => !saving && setModalOpen(false)}
        title={editing ? "Edit Live Stream" : "Add Live Stream"}
        icon={<Icon.Radio />}
      >
        <div style={formGrid(1)}>
          <Field label="Stream Title" required error={errors.title}>
            <Input
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="e.g. Sunday Live Worship"
            />
          </Field>
          <Field label="Pastor / Speaker" required error={errors.pastor}>
            <Input
              value={form.pastor}
              onChange={(e) =>
                setForm((f) => ({ ...f, pastor: e.target.value }))
              }
              placeholder="e.g. Ptr. Ramon Santos"
            />
          </Field>
          <Field
            label="Live Link (YouTube / Facebook)"
            required
            error={errors.link}
          >
            <Input
              value={form.link}
              onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
              placeholder="https://youtube.com/live/..."
            />
          </Field>
          <Field label="Description">
            <Input
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Brief description of the live stream..."
              rows={3}
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
        itemName={deleteTarget?.title}
        loading={deleting}
      />
    </div>
  );
}
