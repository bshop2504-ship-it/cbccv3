import React, { useState, useEffect } from "react";
import { Icon } from "../../assets/svg/Icon";
import { motion } from "framer-motion";
import {
  Field,
  Input,
  ImagePicker,
  Modal,
  ConfirmDelete,
  btnStyles,
} from "../AdminSharedComponents";
import {
  SectionHeader,
  ModalFooter,
  EmptyState,
  LoadingState,
  formGrid,
} from "../AdminSharedSubComponents";
import { useToast } from "../../hooks/useToast";
import { colors } from "../../lib/theme";

import { createRecentActivity } from "../../api/recentActivity/create";
import { fetchRecentActivities } from "../../api/recentActivity/read";
import { updateRecentActivity } from "../../api/recentActivity/update";
import { deleteRecentActivity } from "../../api/recentActivity/delete";
export default function ActivitiesPanel({ data, setData }) {
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const empty = {
    title: "",
    subtitle: "",
    description: "",
    date: "",
    img: "",
  };

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
    if (!form.date.trim()) e.date = "Date is required";

    return e;
  };

  const save = async () => {
    const validation = validate();

    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setSaving(true);

    try {
      // EDIT MODE
      if (editing) {
        const result = await updateRecentActivity({
          id: editing.id,
          title: form.title,
          subtitle: form.subtitle,
          description: form.description,
          date: form.date,
          img: form.img,
          oldImg: editing.img,
        });

        if (!result.success) {
          toast.error(result.error, "Couldn't update the activity");
          return;
        }

        setData((prev) =>
          prev.map((item) => (item.id === editing.id ? result.data[0] : item)),
        );
      }

      // CREATE MODE
      else {
        const result = await createRecentActivity({
          title: form.title,
          subtitle: form.subtitle,
          description: form.description,
          date: form.date,
          img: form.img,
        });

        if (!result.success) {
          toast.error(result.error, "Couldn't add the activity");
          return;
        }

        setData((prev) => [result.data[0], ...prev]);
      }

      toast.success(editing ? "Activity updated" : "Activity added");

      // Reset modal
      setModalOpen(false);
      setForm(empty);
      setEditing(null);
      setErrors({});
    } catch (err) {
      toast.error(err, "Couldn't save the activity");
    } finally {
      setSaving(false);
    }
  };
  useEffect(() => {
    const loadActivities = async () => {
      const result = await fetchRecentActivities();

      if (result.success) {
        setData(result.data);
      } else {
        toast.error(result.error, "Couldn't load activities");
      }

      setLoading(false);
    };

    loadActivities();
  }, [setData, toast]);

  const remove = async (item) => {
    if (!item?.id) return;

    setDeleting(true);

    const result = await deleteRecentActivity({
      id: item.id,
      img: item.img, // 👈 REQUIRED for storage deletion
    });

    setDeleting(false);

    if (!result.success) {
      toast.error(result.error, "Couldn't delete the activity");
      return;
    }

    // remove from UI
    setData((d) => d.filter((x) => x.id !== item.id));
    toast.success("Activity deleted");
    setDeleteTarget(null);
  };

  return (
    <div>
      <SectionHeader
        icon={<Icon.Camera />}
        label="Recent Activities"
        count={data.length}
        onAdd={openAdd}
        addLabel="Add Activity"
      />

      {loading && <LoadingState label="Loading activities…" />}

      {!loading && data.length === 0 && (
        <EmptyState
          icon={<Icon.Camera />}
          title="No activities yet"
          subtitle="Add photos and highlights from church activities."
        />
      )}

      <div
        style={{
          display: loading ? "none" : "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 14,
        }}
      >
        {data.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            style={{
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.9)",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(9,60,93,0.06)",
            }}
          >
            {/* Image */}
            <div
              style={{
                height: 140,
                background: item.img
                  ? `url(${item.img}) center/cover`
                  : `linear-gradient(135deg, ${colors.navy}, ${colors.steel})`,
                position: "relative",
              }}
            >
              {!item.img && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  <Icon.Image />
                </div>
              )}

              <div
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  display: "flex",
                  gap: 6,
                }}
              >
                <button
                  onClick={() => openEdit(item)}
                  style={btnStyles.overlay}
                  title="Edit"
                >
                  <Icon.Edit />
                </button>

                <button
                  onClick={() => setDeleteTarget(item)}
                  style={btnStyles.overlayDanger}
                  title="Delete"
                >
                  <Icon.Trash />
                </button>
              </div>
            </div>

            {/* Info */}
            <div style={{ padding: "14px 16px" }}>
              {item.subtitle && (
                <span
                  style={{
                    fontFamily: "DM Mono, monospace",
                    fontSize: 10,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#6FD1D7",
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  {item.subtitle}
                </span>
              )}

              <p
                style={{
                  fontWeight: 600,
                  color: "#093C5D",
                  fontSize: 14,
                  marginBottom: 4,
                  lineHeight: 1.3,
                }}
              >
                {item.title}
              </p>

              {item.description && (
                <p
                  style={{
                    fontSize: 12,
                    color: "rgba(9,60,93,0.55)",
                    lineHeight: 1.5,
                    marginBottom: 8,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {item.description}
                </p>
              )}

              <span
                style={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: 10,
                  color: "rgba(9,60,93,0.4)",
                }}
              >
                {item.date}
              </span>
            </div>
          </motion.div>
        ))}

        {/* Add card */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={openAdd}
          style={{
            height: 220,
            borderRadius: 16,
            border: "2px dashed rgba(9,60,93,0.15)",
            background: "rgba(9,60,93,0.02)",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            color: "rgba(9,60,93,0.3)",
            transition: "all 0.2s",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: "2px dashed rgba(9,60,93,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon.Plus />
          </div>

          <span
            style={{
              fontSize: 12,
              fontFamily: "DM Mono, monospace",
              letterSpacing: "0.1em",
            }}
          >
            ADD ACTIVITY
          </span>
        </motion.button>
      </div>

      {/* MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => !saving && setModalOpen(false)}
        title={editing ? "Edit Activity" : "Add Activity"}
        icon={<Icon.Camera />}
        width={560}
      >
        <div style={formGrid(1)}>
          <Field label="Title" required error={errors.title}>
            <Input
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  title: e.target.value,
                }))
              }
              placeholder="e.g. Sunday Worship — April 27"
            />
          </Field>

          <Field label="Subtitle / Category">
            <Input
              value={form.subtitle}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  subtitle: e.target.value,
                }))
              }
              placeholder="e.g. Weekly Gathering, Youth, Outreach"
            />
          </Field>

          <Field label="Date" required error={errors.date}>
            <Input
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  date: e.target.value,
                }))
              }
            />
          </Field>

          <ImagePicker
            label="Activity Image"
            value={form.img}
            onChange={(val) =>
              setForm((f) => ({
                ...f,
                img: val,
              }))
            }
            height={160}
          />

          <Field label="Description">
            <Input
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  description: e.target.value,
                }))
              }
              placeholder="Brief description of the activity..."
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

      {/* DELETE */}
      <ConfirmDelete
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && remove(deleteTarget)}
        itemName={deleteTarget?.title}
        loading={deleting}
      />
    </div>
  );
}
