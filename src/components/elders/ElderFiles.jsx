import React, { useState, useEffect } from "react";
import { Icon } from "../../assets/svg/Icon";
import { motion, AnimatePresence } from "framer-motion";

import { handleUpload } from "../../api/elder/upload";
import { fetchElderFiles } from "../../api/elder/select";
import { updateElderFile } from "../../api/elder/update";
import { deleteElderFile } from "../../api/elder/delete";
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
export default function ElderFiles({ data, setData }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loadingFiles, setLoadingFiles] = useState(false);
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
        const uploaded = await handleUpload(form);

        setData((prev) => [uploaded, ...prev]);
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
  const remove = async (id) => {
    try {
      await deleteElderFile({ id });

      setData((d) => d.filter((x) => x.id !== id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete file");
    }
  };

  // ───────────────────────────────────────────────────────────
  // LOAD FILES
  // ───────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingFiles(true);

        const mode = filter === "all" ? "all" : "mine";

        const result = await fetchElderFiles(mode);

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

          uploadedBy: item.userTB?.name || item.userTB?.email || "Unknown User",
        }));

        setData(formatted);
      } catch (err) {
        console.error(err);
        alert(err.message);
      } finally {
        setLoadingFiles(false);
      }
    };

    load();
  }, [filter]);

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
      <div style={{ display: "flex", gap: 10, margin: "12px 0" }}>
        <button
          onClick={() => setFilter("all")}
          disabled={loadingFiles}
          style={{
            padding: "8px 14px",
            borderRadius: 10,
            background: filter === "all" ? "#093C5D" : "#fff",
            color: filter === "all" ? "#fff" : "#093C5D",
            border: "1px solid #ccc",
            cursor: loadingFiles ? "not-allowed" : "pointer",
            opacity: loadingFiles ? 0.7 : 1,
          }}
        >
          {loadingFiles && filter === "all" ? "Loading..." : "All"}
        </button>

        <button
          onClick={() => setFilter("mine")}
          disabled={loadingFiles}
          style={{
            padding: "8px 14px",
            borderRadius: 10,
            background: filter === "mine" ? "#093C5D" : "#fff",
            color: filter === "mine" ? "#fff" : "#093C5D",
            border: "1px solid #ccc",
            cursor: loadingFiles ? "not-allowed" : "pointer",
            opacity: loadingFiles ? 0.7 : 1,
          }}
        >
          {loadingFiles && filter === "mine" ? "Loading..." : "Mine"}
        </button>
      </div>
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
                {/* TOP ACTIONS */}
                {filter === "mine" && (
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
                      <Icon.Trash />
                    </button>
                  </div>
                )}

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
              <div style={{ padding: 20 }}>
                {/* TITLE */}
                <h3
                  style={{
                    margin: 0,
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#093C5D",
                    lineHeight: 1.4,
                    marginBottom: 10,
                  }}
                >
                  {item.title}
                </h3>

                {/* DESCRIPTION */}
                {item.description && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      lineHeight: 1.7,
                      color: "rgba(9,60,93,0.68)",
                      marginBottom: 18,
                    }}
                  >
                    {item.description}
                  </p>
                )}

                {/* FILE META */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                    padding: "12px 14px",
                    borderRadius: 14,
                    background: "rgba(9,60,93,0.04)",
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 10,
                        color: "rgba(9,60,93,0.45)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 4,
                      }}
                    >
                      File Size
                    </p>

                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#093C5D",
                      }}
                    >
                      {item.fileSize}
                    </span>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 10,
                        color: "rgba(9,60,93,0.45)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 4,
                      }}
                    >
                      Uploaded
                    </p>

                    <span
                      style={{
                        fontSize: 12,
                        color: "#093C5D",
                      }}
                    >
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* FOOTER */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,#093C5D,#38B2AC)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 14,
                      }}
                    >
                      {item.uploadedBy?.charAt(0)?.toUpperCase()}
                    </div>

                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 11,
                          color: "rgba(9,60,93,0.45)",
                          marginBottom: 2,
                        }}
                      >
                        Uploaded by
                      </p>

                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#093C5D",
                        }}
                      >
                        {item.uploadedBy}
                      </span>
                    </div>
                  </div>

                  <a
                    href={item.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: "10px 14px",
                      borderRadius: 12,
                      background: "#093C5D",
                      color: "#fff",
                      textDecoration: "none",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    Open
                  </a>
                </div>
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
              }}
            >
              <input
                type="file"
                hidden
                id="fileUpload"
                accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                onChange={handleFileChange}
              />

              {!form.fileUrl && (
                <label
                  htmlFor="fileUpload"
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
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

                  <div style={{ textAlign: "center" }}>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#093C5D",
                        marginBottom: 4,
                      }}
                    >
                      Click to upload
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
                </label>
              )}

              {form.fileUrl && (
                <div style={{ textAlign: "center" }}>
                  <p
                    style={{
                      fontWeight: 700,
                      color: "#093C5D",
                      marginBottom: 6,
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
        onConfirm={() => remove(deleteTarget?.id)}
        itemName={deleteTarget?.title}
      />
    </div>
  );
}
