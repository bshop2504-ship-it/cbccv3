import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Icon } from "../../assets/svg/Icon";
import {
  Field,
  Input,
  Select,
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
import { colors } from "../../lib/theme";
import { createWeekService } from "../../api/weeklyservice/create";
import { fetchWeekServices } from "../../api/weeklyservice/read";
import { updateWeekService } from "../../api/weeklyservice/update";
import { deleteWeekService } from "../../api/weeklyservice/delete";
const CATEGORIES = [
  "Worship",
  "Youth",
  "Men",
  "Women",
  "Prayer",
  "Outreach",
  "Education",
  "Community",
  "Special Event",
];
// ─── PANEL: Weekly Service ─────────────────────────────────────────
export default function ServicePanel({ data, setData }) {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const empty = {
    month: "",
    day: "",
    title: "",
    time: "",
    pastor: "",
    description: "",
    category: "",
  };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  const openAdd = () => {
    setEditing(null);
    setForm(empty);
    setErrors({});
    setModalOpen(true);
  };
  const openEdit = (item) => {
    setEditing(item);
    setForm({ ...item, img: item.img || "" });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.month.trim()) e.month = "Month is required";
    if (!form.day.trim()) e.day = "Day is required";
    if (!form.time.trim()) e.time = "Time is required";
    if (!form.pastor.trim()) e.pastor = "Pastor is required";
    if (!form.category) e.category = "Category is required";
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
      if (editing) {
        const result = await updateWeekService(editing.id, form);

        if (!result.success) {
          toast.error(result.error, "Couldn't update the service");
          return;
        }

        // update UI with DB response
        setData((d) =>
          d.map((x) => (x.id === editing.id ? result.data[0] : x)),
        );
      } else {
        const result = await createWeekService(form);

        if (!result.success) {
          toast.error(result.error, "Couldn't add the service");
          return;
        }

        setData((d) => [...d, result.data[0]]);
      }

      toast.success(editing ? "Service updated" : "Service added");
      setModalOpen(false);
      setEditing(null);

      setForm({
        month: "",
        day: "",
        title: "",
        time: "",
        pastor: "",
        description: "",
        category: "",
      });
    } catch (err) {
      toast.error(err, "Couldn't save the service");
    } finally {
      setSaving(false);
    }
  };
  useEffect(() => {
    const loadServices = async () => {
      const result = await fetchWeekServices();

      if (result.success) {
        setData(result.data);
      } else {
        toast.error(result.error, "Couldn't load weekly services");
      }

      setLoading(false);
    };

    loadServices();
  }, []);
  const remove = async (id) => {
    setDeleting(true);

    try {
      const result = await deleteWeekService(id);

      if (!result.success) {
        toast.error(result.error, "Couldn't delete the service");
        return;
      }

      // update UI after DB delete
      setData((d) => d.filter((x) => x.id !== id));

      toast.success("Service deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err, "Couldn't delete the service");
    } finally {
      setDeleting(false);
    }
  };

  const catColors = {
    Worship: colors.aqua,
    Youth: colors.navy,
    Prayer: colors.steel,
    Men: colors.navy,
    Women: colors.aqua,
    Outreach: colors.steel,
  };

  return (
    <div>
      <SectionHeader
        icon={<Icon.Calendar />}
        label="Weekly Services"
        count={data.length}
        onAdd={openAdd}
        addLabel="Add Weekly Service"
      />
      <div style={tableStyles.wrapper}>
        <table style={tableStyles.table}>
          <thead>
            <tr>
              {["Date", "Title", "Time", "Pastor", "Category", ""].map((h) => (
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
                  <div
                    style={{ fontFamily: "DM Mono, monospace", fontSize: 12 }}
                  >
                    <div style={{ color: "#6FD1D7", fontWeight: 600 }}>
                      {item.month}
                    </div>
                    <div
                      style={{
                        color: "#093C5D",
                        fontSize: 18,
                        fontWeight: 700,
                        lineHeight: 1,
                      }}
                    >
                      {item.day}
                    </div>
                  </div>
                </td>
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
                    fontFamily: "DM Mono, monospace",
                    fontSize: 12,
                    color: "#3B7597",
                  }}
                >
                  {item.time}
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
                  <span style={tagStyle(catColors[item.category] || "#3B7597")}>
                    {item.category}
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
          <LoadingState label="Loading services…" />
        ) : (
          data.length === 0 && <EmptyState label="No services yet" />
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => !saving && setModalOpen(false)}
        title={editing ? "Edit Weekly Service" : "Add Weekly Service"}
        icon={<Icon.Calendar />}
        width={600}
      >
        <div style={formGrid(2)}>
          <Field label="Month" required error={errors.month}>
            <Select
              value={form.month}
              onChange={(e) =>
                setForm((f) => ({ ...f, month: e.target.value }))
              }
              placeholder="Select month"
              options={[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ]}
            />
          </Field>
          <Field label="Day" required error={errors.day}>
            <Input
              value={form.day}
              onChange={(e) => setForm((f) => ({ ...f, day: e.target.value }))}
              placeholder="e.g. 4"
            />
          </Field>
        </div>
        <div style={{ ...formGrid(1), marginTop: 14 }}>
          <Field label="Service Title" required error={errors.title}>
            <Input
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="e.g. Sunday Worship Celebration"
            />
          </Field>
        </div>
        <div style={{ ...formGrid(2), marginTop: 14 }}>
          <Field label="Time" required error={errors.time}>
            <Input
              type="time"
              value={form.time}
              onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
            />
          </Field>
          <Field label="Category" required error={errors.category}>
            <Select
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
              placeholder="Select category"
              options={CATEGORIES}
            />
          </Field>
        </div>
        <div style={{ ...formGrid(1), marginTop: 14 }}>
          <Field label="Pastor / Speaker" required error={errors.pastor}>
            <Input
              value={form.pastor}
              onChange={(e) =>
                setForm((f) => ({ ...f, pastor: e.target.value }))
              }
              placeholder="e.g. Ptr. Ramon Santos"
            />
          </Field>
          <Field label="Description">
            <Input
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Brief description of the service..."
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
