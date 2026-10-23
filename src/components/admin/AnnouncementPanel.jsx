import React, { useState, useEffect } from "react";
import { Icon } from "../../assets/svg/Icon";
import { motion } from "framer-motion";
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
import { createAnnouncement } from "../../api/announce/create";
import { fetchAnnouncements } from "../../api/announce/read";
import { updateAnnouncement } from "../../api/announce/update";
import { deleteAnnouncement } from "../../api/announce/delete";
export default function AnnouncementPanel() {
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ description: "", title: "" });
  const [errors, setErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openAdd = () => {
    setEditing(null);
    setForm({ description: "", title: "" });
    setErrors({});
    setModalOpen(true);
  };
  const openEdit = (item) => {
    setEditing(item);
    setForm({
      description: item.description,
      title: item.title,
    });

    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const e = {};

    if (!form.description.trim()) e.description = "Description is required";
    if (!form.title.trim()) e.title = "Title is required";
    return e;
  };
  // Reload after a save/delete (initial load is in the effect below)
  const loadAnnouncements = async () => {
    try {
      const result = await fetchAnnouncements();
      setData(result || []);
    } catch (err) {
      toast.error(err, "Couldn't load announcements");
    }
  };
  const save = async () => {
    const e = validate();

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setSaving(true);

    try {
      if (editing) {
        await updateAnnouncement({
          id: editing.id,
          title: form.title,
          description: form.description,
        });
      } else {
        await createAnnouncement({
          title: form.title,
          description: form.description,
        });
      }

      await loadAnnouncements();

      toast.success(editing ? "Announcement updated" : "Announcement posted");
      setModalOpen(false);
      setForm({ title: "", description: "" });
      setErrors({});
      setEditing(null);
    } catch (err) {
      toast.error(err, "Couldn't save the announcement");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    fetchAnnouncements()
      .then((result) => !ignore && setData(result || []))
      .catch((err) => !ignore && toast.error(err, "Couldn't load announcements"))
      .finally(() => !ignore && setLoading(false));

    return () => {
      ignore = true;
    };
  }, [toast]);

  const remove = async (id) => {
    setDeleting(true);

    try {
      await deleteAnnouncement(id);

      await loadAnnouncements();

      toast.success("Announcement deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err, "Couldn't delete the announcement");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <SectionHeader
        icon={<Icon.Book />}
        label="Announcement Panel"
        count={data.length}
        onAdd={openAdd}
        addLabel="Add Announcement"
      />
      <div style={tableStyles.wrapper}>
        <table style={tableStyles.table}>
          <thead>
            <tr>
              {["Title", "Description", ""].map((h) => (
                <th key={h} style={tableStyles.th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => {
              if (!item || !item.id) return null;

              return (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={tableStyles.tr}
                >
                  <td style={tableStyles.td}>
                    <span
                      style={{
                        fontFamily: "DM Mono, monospace",
                        fontSize: 12,
                        color: "#3B7597",
                      }}
                    >
                      {item.title || "-"}
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
                      "{item.description || ""}"
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
              );
            })}
          </tbody>
        </table>
        {loading ? (
          <LoadingState label="Loading announcements…" />
        ) : (
          data.length === 0 && <EmptyState label="No announcements yet" />
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => !saving && setModalOpen(false)}
        title={editing ? "Edit Announcement" : "Add Announcement"}
        icon={<Icon.Book />}
      >
        <div style={formGrid(1)}>
          <Field label="Title" required error={errors.title}>
            <Input
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="Announcement title"
            />
          </Field>
          <Field label="Description" required error={errors.description}>
            <Input
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Announcement full description here..."
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
        itemName={deleteTarget?.title}
        loading={deleting}
      />
    </div>
  );
}
