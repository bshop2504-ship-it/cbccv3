import React, { useState, useRef, useEffect } from "react";
import { Icon } from "../../assets/svg/Icon";
import { motion } from "framer-motion";
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
import { createAnnouncement } from "../../api/announce/create";
import { fetchAnnouncements } from "../../api/announce/read";
import { updateAnnouncement } from "../../api/announce/update";
import { deleteAnnouncement } from "../../api/announce/delete";
export default function AnnouncementPanel() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ description: "", title: "" });
  const [errors, setErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [data, setData] = useState([]);

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

    if (!form.description.trim())
      e.description = "description text is required";
    if (!form.title.trim()) e.title = "Bible title is required";
    return e;
  };
  const loadAnnouncements = async () => {
    try {
      const result = await fetchAnnouncements();
      setData(result || []);
    } catch (err) {
      console.error("Failed to load announcements:", err);
      setData([]);
    }
  };
  const save = async () => {
    const e = validate();

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    try {
      if (editing) {
        await updateAnnouncement({
          id: editing.id,
          title: form.title,
          description: form.description,
        });
        console.log("EDITING ID:", editing.id);
        console.log("TYPE:", typeof editing.id);
      } else {
        await createAnnouncement({
          title: form.title,
          description: form.description,
        });
      }

      await loadAnnouncements();

      setModalOpen(false);
      setForm({ title: "", description: "" });
      setErrors({});
      setEditing(null);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to save announcement");
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const remove = async (id) => {
    try {
      await deleteAnnouncement(id);

      await loadAnnouncements();

      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete announcement");
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
                      >
                        <Icon.Edit />
                      </button>

                      <button
                        style={btnStyles.danger}
                        onClick={() => setDeleteTarget(item)}
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
        {data.length === 0 && <EmptyState label="No announcement yet" />}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Devotion" : "Add Devotion"}
        icon={<Icon.Book />}
      >
        <div style={formGrid(1)}>
          <Field label="Title" required error={errors.title}>
            <Input
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="Annoucement Title"
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
        <ModalFooter onClose={() => setModalOpen(false)} onSave={save} />
      </Modal>

      <ConfirmDelete
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => remove(deleteTarget?.id)}
        itemName={deleteTarget?.title}
      />
    </div>
  );
}
