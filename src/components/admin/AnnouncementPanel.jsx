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
// ─── PANEL: Announcements ─────────────────────────────────────────
export default function AnnouncementPanel({ data, setData }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ description: "", title: "" });
  const [errors, setErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

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
        label="Announcement Panel"
        count={data.length}
        onAdd={openAdd}
        addLabel="Add Devotion"
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
            {data.map((item, i) => (
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
                    {item.title}
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
                    "{item.description}"
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
