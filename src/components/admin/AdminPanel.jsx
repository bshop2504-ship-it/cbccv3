import React, { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "../../assets/svg/Icon";
import { registerAccount } from "../../api/auth";

import {
  Field,
  Input,
  Select,
  Modal,
  ConfirmDelete,
} from "../AdminSharedComponents";

import {
  SectionHeader,
  ModalFooter,
  EmptyState,
  tagStyle,
  tableStyles,
  formGrid,
} from "../AdminSharedSubComponents";

const ROLES = ["Super Admin", "Editor", "Viewer"];

export default function AdminPanel({ data, setData }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [errors, setErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);

  const empty = {
    name: "",
    email: "",
    password: "",
    role: "Viewer",
  };

  const [form, setForm] = useState(empty);

  const openAdd = () => {
    setEditing(null);
    setForm(empty);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name,
      email: item.email,
      password: "",
      role: item.role,
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!editing && !form.password.trim()) e.password = "Password is required";
    if (!form.role) e.role = "Role is required";
    return e;
  };
  const save = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setLoading(true);

    try {
      // EDIT MODE
      if (editing) {
        setData((d) =>
          d.map((x) =>
            x.id === editing.id
              ? { ...x, name: form.name, email: form.email, role: form.role }
              : x,
          ),
        );

        setModalOpen(false);
        return;
      }

      // CREATE MODE
      const result = await registerAccount(
        form.name,
        form.email,
        form.password,
        form.role,
      );

      if (!result || !result.user) {
        throw new Error(result?.error || "Signup failed");
      }

      const user = result.user;

      setData((d) => [
        ...d,
        {
          id: user.id,
          name: form.name,
          email: form.email,
          role: form.role,
        },
      ]);

      setModalOpen(false);
      setForm(empty);
    } catch (err) {
      console.error("SAVE ERROR:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  const remove = (id) => {
    setData((d) => d.filter((x) => x.id !== id));
    setDeleteTarget(null);
  };

  const roleColor = {
    "Super Admin": "#E53E3E",
    Editor: "#6FD1D7",
    Viewer: "#3B7597",
  };

  const avatar = (name = "") =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div>
      <SectionHeader
        icon={<Icon.Users />}
        label="Admin Users"
        count={data.length}
        onAdd={openAdd}
        addLabel="Add Admin"
      />

      {/* TABLE */}
      <div style={tableStyles.wrapper}>
        <table style={tableStyles.table}>
          <thead>
            <tr>
              {["Admin", "Email", "Role", ""].map((h) => (
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
                  <div style={{ display: "flex", gap: 10 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #093C5D, #3B7597)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#6FD1D7",
                        fontWeight: 700,
                        fontSize: 12,
                      }}
                    >
                      {avatar(item.name)}
                    </div>
                    <span style={{ fontWeight: 500 }}>{item.name}</span>
                  </div>
                </td>

                <td style={tableStyles.td}>{item.email}</td>

                <td style={tableStyles.td}>
                  <span style={tagStyle(roleColor[item.role])}>
                    {item.role}
                  </span>
                </td>

                <td style={{ textAlign: "right" }}>
                  <button onClick={() => openEdit(item)}>
                    <Icon.Edit />
                  </button>
                  <button onClick={() => setDeleteTarget(item)}>
                    <Icon.Trash />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && <EmptyState label="No admins yet" />}
      </div>

      {/* MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Admin" : "Add Admin"}
      >
        <div style={formGrid(1)}>
          <Field label="Full Name" error={errors.name}>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </Field>

          <Field label="Email" error={errors.email}>
            <Input
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
          </Field>

          {!editing && (
            <Field label="Password" error={errors.password}>
              <Input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
              />
            </Field>
          )}

          <Field label="Role" error={errors.role}>
            <Select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              options={ROLES}
            />
          </Field>
        </div>

        <ModalFooter
          onClose={() => setModalOpen(false)}
          onSave={save}
          saveLabel={editing ? "Update" : "Create"}
          disabled={loading}
        />
      </Modal>

      {/* DELETE */}
      <ConfirmDelete
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => remove(deleteTarget?.id)}
        itemName={deleteTarget?.name}
      />
    </div>
  );
}
