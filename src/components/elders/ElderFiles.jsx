import React, { useState } from "react";
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
  formGrid,
} from "../AdminSharedSubComponents";

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2);

const empty = {
  title: "",
  description: "",
  file: null,
  fileUrl: "",
  fileName: "",
  fileType: "",
  fileSize: "",
};

const getFileType = (file) => {
  if (!file) return "file";

  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";

  return "file";
};

const formatBytes = (bytes) => {
  if (!bytes) return "0 KB";

  const kb = bytes / 1024;

  if (kb < 1024) return `${kb.toFixed(1)} KB`;

  return `${(kb / 1024).toFixed(1)} MB`;
};

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
export default function ElderFiles({ data, setData }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState(empty);

  const [errors, setErrors] = useState({});

  const [deleteTarget, setDeleteTarget] = useState(null);

  // ───────────────────────────────────────────────────────────
  // OPEN ADD
  // ───────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditing(null);
    setForm(empty);
    setErrors({});
    setModalOpen(true);
  };

  // ───────────────────────────────────────────────────────────
  // OPEN EDIT
  // ───────────────────────────────────────────────────────────
  const openEdit = (item) => {
    setEditing(item);
    setForm(item);
    setErrors({});
    setModalOpen(true);
  };

  // ───────────────────────────────────────────────────────────
  // FILE UPLOAD
  // ───────────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const url = URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,
      file,
      fileUrl: url,
      fileName: file.name,
      fileType: getFileType(file),
      fileSize: formatBytes(file.size),
    }));
  };

  // ───────────────────────────────────────────────────────────
  // VALIDATE
  // ───────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};

    if (!form.title.trim()) {
      e.title = "Title is required";
    }

    if (!form.fileUrl) {
      e.file = "Please upload a file";
    }

    return e;
  };

  // ───────────────────────────────────────────────────────────
  // SAVE
  // ───────────────────────────────────────────────────────────
  const save = () => {
    const e = validate();

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    if (editing) {
      setData((d) =>
        d.map((x) =>
          x.id === editing.id
            ? {
                ...x,
                ...form,
              }
            : x,
        ),
      );
    } else {
      setData((d) => [
        {
          id: uid(),
          ...form,
          date: new Date().toLocaleDateString(),
        },
        ...d,
      ]);
    }

    setModalOpen(false);
  };

  // ───────────────────────────────────────────────────────────
  // REMOVE
  // ───────────────────────────────────────────────────────────
  const remove = (id) => {
    setData((d) => d.filter((x) => x.id !== id));
    setDeleteTarget(null);
  };

  return (
    <div>
      {/* HEADER */}
      <SectionHeader
        icon={<Icon.Folder />}
        label="CBCC Files"
        count={data.length}
        onAdd={openAdd}
        addLabel="Upload File"
      />

      {/* EMPTY */}
      {!data.length && (
        <EmptyState
          icon={<Icon.Folder />}
          title="No files uploaded"
          subtitle="Upload files, videos, or images for CBCC."
          buttonLabel="Upload File"
          onClick={openAdd}
        />
      )}

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 16,
        }}
      >
        {data.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.8)",
              borderRadius: 18,
              overflow: "hidden",
              boxShadow: "0 6px 20px rgba(9,60,93,0.08)",
            }}
          >
            {/* PREVIEW */}
            <div
              style={{
                height: 220,
                background: "#EDF2F7",
                position: "relative",
              }}
            >
              {/* IMAGE */}
              {item.fileType === "image" && (
                <img
                  src={item.fileUrl}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              )}

              {/* VIDEO */}
              {item.fileType === "video" && (
                <video
                  src={item.fileUrl}
                  controls
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    background: "#000",
                  }}
                />
              )}

              {/* OTHER FILE */}
              {item.fileType === "file" && (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    color: "#093C5D",
                  }}
                >
                  <div
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 20,
                      background: "rgba(9,60,93,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon.File />
                  </div>

                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      maxWidth: 220,
                      textAlign: "center",
                      wordBreak: "break-word",
                    }}
                  >
                    {item.fileName}
                  </span>
                </div>
              )}

              {/* ACTIONS */}
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  display: "flex",
                  gap: 8,
                }}
              >
                {/* DOWNLOAD */}
                <a
                  href={item.fileUrl}
                  download={item.fileName}
                  style={{
                    ...btnStyles.iconBtn,
                    background: "rgba(255,255,255,0.92)",
                    border: "none",
                    textDecoration: "none",
                    color: "#093C5D",
                  }}
                >
                  <Icon.Download />
                </a>

                {/* EDIT */}
                <button
                  onClick={() => openEdit(item)}
                  style={{
                    ...btnStyles.iconBtn,
                    background: "rgba(255,255,255,0.92)",
                    border: "none",
                  }}
                >
                  <Icon.Edit />
                </button>

                {/* DELETE */}
                <button
                  onClick={() => setDeleteTarget(item)}
                  style={{
                    ...btnStyles.iconBtn,
                    background: "rgba(255,255,255,0.92)",
                    border: "none",
                    color: "#E53E3E",
                  }}
                >
                  <Icon.Trash />
                </button>
              </div>
            </div>

            {/* INFO */}
            <div
              style={{
                padding: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontFamily: "DM Mono, monospace",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#6FD1D7",
                  }}
                >
                  {item.fileType}
                </span>

                <span
                  style={{
                    fontSize: 10,
                    color: "rgba(9,60,93,0.4)",
                    fontFamily: "DM Mono, monospace",
                  }}
                >
                  {item.fileSize}
                </span>
              </div>

              <p
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#093C5D",
                  marginBottom: 8,
                  lineHeight: 1.4,
                }}
              >
                {item.title}
              </p>

              {item.description && (
                <p
                  style={{
                    fontSize: 12,
                    color: "rgba(9,60,93,0.6)",
                    lineHeight: 1.6,
                    marginBottom: 10,
                  }}
                >
                  {item.description}
                </p>
              )}

              <span
                style={{
                  fontSize: 10,
                  fontFamily: "DM Mono, monospace",
                  color: "rgba(9,60,93,0.4)",
                }}
              >
                {item.date}
              </span>
            </div>
          </motion.div>
        ))}

        {/* ADD CARD */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={openAdd}
          style={{
            minHeight: 320,
            borderRadius: 18,
            border: "2px dashed rgba(9,60,93,0.15)",
            background: "rgba(9,60,93,0.02)",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            color: "rgba(9,60,93,0.35)",
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 18,
              background: "rgba(9,60,93,0.06)",
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
            UPLOAD FILE
          </span>
        </motion.button>
      </div>

      {/* MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit File" : "Upload File"}
        icon={<Icon.Folder />}
        width={560}
      >
        <div style={formGrid(1)}>
          {/* TITLE */}
          <Field label="Title" required error={errors.title}>
            <Input
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  title: e.target.value,
                }))
              }
              placeholder="Enter file title"
            />
          </Field>

          {/* DESCRIPTION */}
          <Field label="Description">
            <Input
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  description: e.target.value,
                }))
              }
              placeholder="Write description..."
            />
          </Field>

          {/* FILE PICKER */}
          <Field label="Upload File" required error={errors.file}>
            <div
              style={{
                border: "2px dashed rgba(9,60,93,0.14)",
                borderRadius: 18,
                padding: 28,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                background: "rgba(9,60,93,0.03)",
                position: "relative",
              }}
            >
              <input
                type="file"
                hidden
                id="fileUpload"
                accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                onChange={handleFileChange}
              />

              {/* IF NO FILE */}
              {!form.fileUrl && (
                <label
                  htmlFor="fileUpload"
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 18,
                      background: "rgba(9,60,93,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon.Upload />
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#093C5D",
                        marginBottom: 4,
                      }}
                    >
                      Click to upload file
                    </p>

                    <span
                      style={{
                        fontSize: 11,
                        color: "rgba(9,60,93,0.5)",
                      }}
                    >
                      Images, videos, PDF, DOCX, XLSX, PPT, TXT
                    </span>
                  </div>
                </label>
              )}

              {/* IF FILE EXISTS */}
              {form.fileUrl && (
                <div
                  style={{
                    width: "100%",
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  {/* REMOVE BUTTON */}
                  <button
                    onClick={() => {
                      setForm({
                        ...form,
                        file: null,
                        fileUrl: "",
                        fileName: "",
                        fileType: "",
                        fileSize: "",
                      });
                    }}
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      border: "none",
                      background: "rgba(229,62,62,0.1)",
                      color: "#E53E3E",
                      padding: "4px 8px",
                      borderRadius: 10,
                      fontSize: 11,
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Remove
                  </button>

                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#093C5D",
                      marginBottom: 4,
                      wordBreak: "break-word",
                    }}
                  >
                    {form.fileName}
                  </p>

                  <span
                    style={{
                      fontSize: 11,
                      color: "rgba(9,60,93,0.5)",
                    }}
                  >
                    {form.fileSize}
                  </span>
                </div>
              )}
            </div>
          </Field>

          {/* PREVIEW */}
          {form.fileUrl && (
            <div
              style={{
                borderRadius: 18,
                overflow: "hidden",
                border: "1px solid rgba(9,60,93,0.08)",
              }}
            >
              {form.fileType === "image" && (
                <img
                  src={form.fileUrl}
                  alt="preview"
                  style={{
                    width: "100%",
                    maxHeight: 280,
                    objectFit: "cover",
                  }}
                />
              )}

              {form.fileType === "video" && (
                <video
                  src={form.fileUrl}
                  controls
                  style={{
                    width: "100%",
                    maxHeight: 280,
                    background: "#000",
                  }}
                />
              )}

              {form.fileType === "file" && (
                <div
                  style={{
                    padding: 24,
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background: "rgba(9,60,93,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon.File />
                  </div>

                  <div>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#093C5D",
                        marginBottom: 4,
                      }}
                    >
                      {form.fileName}
                    </p>

                    <span
                      style={{
                        fontSize: 11,
                        color: "rgba(9,60,93,0.5)",
                      }}
                    >
                      {form.fileSize}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <ModalFooter onClose={() => setModalOpen(false)} onSave={save} />
      </Modal>

      {/* DELETE */}
      <ConfirmDelete
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => remove(deleteTarget?.id)}
        itemName={deleteTarget?.title}
      />
    </div>
  );
}
