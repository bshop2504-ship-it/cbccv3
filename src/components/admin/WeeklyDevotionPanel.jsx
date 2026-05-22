import React, { useState, useEffect } from "react";
import { Icon } from "../../assets/svg/Icon";
import { motion, AnimatePresence } from "framer-motion";

import { createWeeklyDevotion } from "../../api/weeklydevotion/create";
import { fetchWeeklyDevotions } from "../../api/weeklydevotion/read";
import { updateWeeklyDevotion } from "../../api/weeklydevotion/update";
import { deleteWeeklyDevotion } from "../../api/weeklydevotion/delete";

import { Field, Input, Modal, ConfirmDelete } from "../AdminSharedComponents";

import {
  SectionHeader,
  EmptyState,
  formGrid,
} from "../AdminSharedSubComponents";

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const empty = {
  title: "",
  description: "",
  date: "",
  file: null,
  fileUrl: "",
  fileName: "",
  fileType: "",
  fileSize: "",
};

const getFileType = (fileOrUrl, mime = "") => {
  if (!fileOrUrl && !mime) return "file";

  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";

  if (typeof fileOrUrl === "string") {
    const lower = fileOrUrl.toLowerCase();

    if (
      lower.includes(".jpg") ||
      lower.includes(".jpeg") ||
      lower.includes(".png") ||
      lower.includes(".gif") ||
      lower.includes(".webp")
    ) {
      return "image";
    }

    if (
      lower.includes(".mp4") ||
      lower.includes(".mov") ||
      lower.includes(".webm") ||
      lower.includes(".avi")
    ) {
      return "video";
    }
  }

  if (fileOrUrl?.type) {
    if (fileOrUrl.type.startsWith("image/")) return "image";
    if (fileOrUrl.type.startsWith("video/")) return "video";
  }

  return "file";
};

const formatBytes = (bytes) => {
  if (!bytes) return "0 KB";

  const kb = bytes / 1024;

  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`;
  }

  return `${(kb / 1024).toFixed(1)} MB`;
};

const getTypeColor = (type) => {
  switch (type) {
    case "image":
      return "#38B2AC";
    case "video":
      return "#805AD5";
    default:
      return "#4A5568";
  }
};

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
export default function WeeklyDevotionPanel({ data, setData }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingFiles, setDeletingFiles] = useState(false);

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

    setForm({
      id: item.id,
      title: item.title || "",
      description: item.description || "",
      date: item.date || "",
      file: null,
      fileUrl: item.file || "",
      fileName: item.fileName || "",
      fileType: item.fileType || "",
      fileSize: item.fileSize || "",
    });

    setErrors({});
    setModalOpen(true);
  };

  // ───────────────────────────────────────────────────────────
  // FILE CHANGE
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
  // FORMAT FILES
  // ───────────────────────────────────────────────────────────
  const formatFiles = (items) => {
    return items.map((item) => {
      const fileUrl = item.file || "";

      const fileName = fileUrl
        ? decodeURIComponent(fileUrl.split("/").pop().split("?")[0])
        : "Unknown File";

      return {
        ...item,

        fileUrl,
        fileName,

        fileType: getFileType(fileUrl),
      };
    });
  };

  // ───────────────────────────────────────────────────────────
  // LOAD FILES
  // ───────────────────────────────────────────────────────────
  const refreshData = async () => {
    try {
      const result = await fetchWeeklyDevotions();

      if (!result.success) {
        throw new Error(result.error);
      }

      setData(formatFiles(result.data));
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to load files");
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

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

      // ─────────────────────────────
      // UPDATE
      // ─────────────────────────────
      if (editing) {
        const result = await updateWeeklyDevotion({
          id: editing.id,
          title: form.title,
          description: form.description,
          date: form.date,
          file: form.file || form.fileUrl,
          oldFile: editing.fileUrl,
        });

        if (!result.success) {
          throw new Error(result.error);
        }
      }

      // ─────────────────────────────
      // CREATE
      // ─────────────────────────────
      else {
        const result = await createWeeklyDevotion({
          title: form.title,
          description: form.description,
          date: form.date,
          file: form.file,
        });

        if (!result.success) {
          throw new Error(result.error);
        }
      }

      setModalOpen(false);

      setForm((prev) => ({
        ...empty,

        // KEEP THESE
        title: prev.title,
        description: prev.description,
        date: prev.date,
        fileUrl: prev.fileUrl,
      }));

      await refreshData();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to save file");
    } finally {
      setUploading(false);
    }
  };

  // ───────────────────────────────────────────────────────────
  // REMOVE
  // ───────────────────────────────────────────────────────────
  const remove = async (item) => {
    try {
      setDeletingFiles(true);

      const result = await deleteWeeklyDevotion({
        id: item.id,
        file: item.fileUrl,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      setData((prev) => prev.filter((x) => x.id !== item.id));

      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete file");
    } finally {
      setDeletingFiles(false);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <SectionHeader
        icon={<Icon.Folder />}
        label="Weekly Devotion"
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
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: 20,
          alignItems: "start",
        }}
      >
        <AnimatePresence>
          {data.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              whileHover={{ y: -4 }}
              style={{
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(14px)",
                borderRadius: 24,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.7)",
                boxShadow: "0 10px 35px rgba(9,60,93,0.08)",
                position: "relative",
              }}
            >
              {/* PREVIEW */}
              <div
                style={{
                  height: 230,
                  position: "relative",
                  background: "#EDF2F7",
                  overflow: "hidden",
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

                {/* PDF */}
                {item.fileUrl?.toLowerCase().includes(".pdf") && (
                  <iframe
                    src={`${item.fileUrl}#toolbar=0`}
                    title={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                  />
                )}

                {/* FILE */}
                {item.fileType === "file" &&
                  !item.fileUrl?.toLowerCase().includes(".pdf") && (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 14,
                        padding: 20,
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          width: 78,
                          height: 78,
                          borderRadius: 24,
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
                            fontWeight: 700,
                            fontSize: 14,
                            color: "#093C5D",
                            marginBottom: 6,
                            wordBreak: "break-word",
                          }}
                        >
                          {item.fileName}
                        </p>

                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            textDecoration: "none",
                            color: "#38B2AC",
                            fontWeight: 600,
                            fontSize: 13,
                          }}
                        >
                          Open File
                        </a>
                      </div>
                    </div>
                  )}

                {/* OVERLAY */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.45), transparent 55%)",
                    pointerEvents: "none",
                  }}
                />

                {/* TOP ACTIONS */}
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    display: "flex",
                    gap: 8,
                    zIndex: 5,
                  }}
                >
                  <button
                    onClick={() => openEdit(item)}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      border: "none",
                      background: "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(8px)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon.Edit />
                  </button>

                  <button
                    onClick={() => setDeleteTarget(item)}
                    disabled={deletingFiles}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      border: "none",
                      background: "rgba(255,255,255,0.9)",
                      cursor: deletingFiles ? "not-allowed" : "pointer",
                      opacity: deletingFiles ? 0.5 : 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon.Trash />
                  </button>
                </div>

                {/* FILE TYPE BADGE */}
                <div
                  style={{
                    position: "absolute",
                    left: 16,
                    bottom: 16,
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 999,
                    padding: "6px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    zIndex: 5,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: getTypeColor(item.fileType),
                    }}
                  />

                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#093C5D",
                    }}
                  >
                    {item.fileType}
                  </span>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-5">
                {/* TITLE */}
                <h3 className="mb-2 text-[17px] font-bold leading-[1.4] text-[#093C5D]">
                  {item.title}
                </h3>

                {/* DESCRIPTION */}
                {item.description && (
                  <p className="mb-4 text-sm leading-7 text-[#093C5DAD]">
                    {item.description}
                  </p>
                )}

                {/* DATE */}
                <div className="mb-4 rounded-xl bg-[#093C5D0A] px-4 py-3">
                  <p className="mb-1 text-[11px] text-[#093C5D99]">
                    Uploaded Date
                  </p>

                  <span className="text-sm font-semibold text-[#093C5D]">
                    {item.date
                      ? new Date(item.date).toLocaleDateString()
                      : new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* BUTTON */}
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-xl bg-[#093C5D] px-4 py-2 text-sm font-semibold text-white no-underline transition hover:opacity-90"
                >
                  Open File
                </a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* ADD CARD */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={openAdd}
          style={{
            minHeight: 420,
            borderRadius: 24,
            border: "2px dashed rgba(9,60,93,0.14)",
            background: "rgba(9,60,93,0.03)",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            color: "rgba(9,60,93,0.35)",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 24,
              background: "rgba(9,60,93,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon.Plus />
          </div>

          <div style={{ textAlign: "center" }}>
            <p
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: 14,
                color: "#093C5D",
                marginBottom: 6,
              }}
            >
              Upload New File
            </p>

            <span
              style={{
                fontSize: 11,
                letterSpacing: "0.08em",
                fontFamily: "DM Mono, monospace",
              }}
            >
              IMAGES • VIDEOS • DOCUMENTS
            </span>
          </div>
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
          <Field label="Date">
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
                cursor: "pointer",
              }}
              onClick={() =>
                document.getElementById("weeklyDevotionUpload").click()
              }
            >
              <input
                type="file"
                hidden
                id="weeklyDevotionUpload"
                accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                onChange={handleFileChange}
              />

              {/* ICON */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 20,
                  background: "rgba(9,60,93,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon.Upload />
              </div>

              {/* TEXT */}
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#093C5D",
                    marginBottom: 4,
                  }}
                >
                  {form.fileUrl ? "Replace File" : "Click to upload"}
                </p>

                <span
                  style={{
                    fontSize: 11,
                    color: "rgba(9,60,93,0.5)",
                  }}
                >
                  Images, videos, PDF, DOCX, XLSX, PPT
                </span>
              </div>

              {/* FILE INFO */}
              {form.fileUrl && (
                <div style={{ marginTop: 10, textAlign: "center" }}>
                  <p
                    style={{
                      fontWeight: 700,
                      color: "#093C5D",
                      marginBottom: 6,
                      wordBreak: "break-word",
                    }}
                  >
                    {form.fileName}
                  </p>

                  <span
                    style={{
                      fontSize: 12,
                      color: "rgba(9,60,93,0.5)",
                    }}
                  >
                    {form.fileSize}
                  </span>
                </div>
              )}
            </div>
          </Field>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 24,
          }}
        >
          <button
            onClick={() => setModalOpen(false)}
            style={{
              padding: "10px 16px",
              borderRadius: 12,
              border: "1px solid #D1D5DB",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={save}
            disabled={uploading}
            style={{
              padding: "10px 18px",
              borderRadius: 12,
              border: "none",
              background: "#093C5D",
              color: "#fff",
              cursor: "pointer",
              minWidth: 150,
              fontWeight: 600,
            }}
          >
            {uploading ? "Uploading..." : "Save File"}
          </button>
        </div>
      </Modal>

      {/* DELETE */}
      <ConfirmDelete
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => remove(deleteTarget)}
        itemName={deleteTarget?.title}
      />

      {deletingFiles && (
        <p style={{ color: "#E53E3E", fontWeight: 600, marginTop: 10 }}>
          Deleting file...
        </p>
      )}
    </div>
  );
}
