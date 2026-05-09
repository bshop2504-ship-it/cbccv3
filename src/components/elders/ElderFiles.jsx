import React, { useState, useEffect } from "react";
import { Icon } from "../../assets/svg/Icon";
import { motion } from "framer-motion";

import { handleUpload } from "../../api/elder/upload";
import { fetchElderFiles } from "../../api/elder/select";
import { updateElderFile } from "../../api/elder/update";
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
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(empty);

  const [errors, setErrors] = useState({});

  const [deleteTarget, setDeleteTarget] = useState(null);

  const isImage = (item) => item.fileType === "image";
  const isVideo = (item) => item.fileType === "video";
  const isPDF = (item) => item.fileUrl?.toLowerCase().includes(".pdf");
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
  const save = async () => {
    try {
      const e = validate();

      if (Object.keys(e).length) {
        setErrors(e);
        return;
      }

      setUploading(true);

      if (editing) {
        // 🔥 UPDATE MODE
        const result = await updateElderFile({
          id: editing.id,
          title: form.title,
          description: form.description,
        });

        const updated = result.data;

        setData((prev) =>
          prev.map((item) =>
            item.id === updated.id
              ? {
                  ...item,
                  ...updated,
                  fileUrl: updated.file_url,
                  fileName: updated.file_name,
                  fileType: updated.mime_type?.startsWith("image/")
                    ? "image"
                    : updated.mime_type?.startsWith("video/")
                      ? "video"
                      : "file",
                  fileSize: formatBytes(updated.file_size),
                }
              : item,
          ),
        );
      } else {
        // fallback to upload (your existing logic)
      }

      setModalOpen(false);
      setForm(empty);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  // ───────────────────────────────────────────────────────────
  // REMOVE
  // ───────────────────────────────────────────────────────────
  const remove = (id) => {
    setData((d) => d.filter((x) => x.id !== id));
    setDeleteTarget(null);
  };
  // ───────────────────────────────────────────────────────────
  // RETRIEVE UPLOADS
  // ───────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchElderFiles();

        const formatted = result.map((item) => ({
          ...item,

          fileUrl: item.file_url,
          fileName: item.file_name,

          fileType: item.mime_type?.startsWith("image/")
            ? "image"
            : item.mime_type?.startsWith("video/")
              ? "video"
              : "file",

          fileSize: formatBytes(item.file_size),
          date: new Date(item.created_at).toLocaleString(),

          uploadedBy: item.userTB?.name || item.userTB?.email || "Unknown",
        }));

        setData(formatted);
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    };

    load();
  }, []);
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
          <>
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
              <div
                style={{
                  height: 220,
                  background: "#EDF2F7",
                  position: "relative",
                }}
              >
                {/* IMAGE */}
                {item.fileType === "image" && item.fileUrl && (
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
                {item.fileType === "video" && item.fileUrl && (
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

                {/* PDF */}
                {item.fileUrl?.toLowerCase().includes(".pdf") && (
                  <iframe
                    src={`${item.fileUrl}#toolbar=0`}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                  />
                )}

                {/* FALLBACK */}
                {!item.fileType ||
                  (item.fileType === "file" && (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                      }}
                    >
                      <Icon.File />
                      <span style={{ fontSize: 12 }}>{item.fileName}</span>

                      {/* OPEN BUTTON FIX */}
                      <a href={item.fileUrl} target="_blank" rel="noreferrer">
                        Open File
                      </a>
                    </div>
                  ))}
              </div>
              {/* INFO */}
              <div style={{ padding: 16 }}>
                {/* TYPE + SIZE */}
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

                {/* TITLE */}
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

                {/* DESCRIPTION */}
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

                {/* 👤 UPLOADED BY + TIME */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 10,
                    flexWrap: "wrap",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "DM Mono, monospace",
                      color: "rgba(9,60,93,0.6)",
                    }}
                  >
                    Uploaded by: <b>{item.uploadedBy}</b>
                  </span>

                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "DM Mono, monospace",
                      color: "rgba(9,60,93,0.4)",
                    }}
                  >
                    {new Date(item.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </>
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

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 20,
          }}
        >
          {/* CANCEL */}
          <button
            onClick={() => setModalOpen(false)}
            disabled={uploading}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #ccc",
              background: "#fff",
              cursor: uploading ? "not-allowed" : "pointer",
              opacity: uploading ? 0.6 : 1,
            }}
          >
            Cancel
          </button>

          {/* UPLOAD */}
          <button
            onClick={save}
            disabled={uploading}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "none",
              background: uploading ? "#6b7280" : "#093C5D",
              color: "#fff",
              cursor: uploading ? "not-allowed" : "pointer",
              minWidth: 150,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {uploading ? (
              <>
                <span className="animate-spin-smooth w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Uploading...
              </>
            ) : (
              "Upload File"
            )}
          </button>
        </div>
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
