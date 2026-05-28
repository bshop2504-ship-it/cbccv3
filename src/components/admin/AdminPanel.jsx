import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Icon } from "../../assets/svg/Icon";

import {
  registerAccount,
  fetchUsers,
  updateUser,
  deleteUser,
} from "../../api/auth";

import { fetchCurrentUser } from "../../api/currentUser";

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
  tagStyle,
  tableStyles,
  formGrid,
} from "../AdminSharedSubComponents";

const ROLES = ["Editor", "Elder", "Super Admin"];

export default function AdminPanel({ data, setData }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [errors, setErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const empty = {
    name: "",
    email: "",
    password: "",
    role: "Editor",
  };

  const [form, setForm] = useState(empty);

  // =====================
  // LOAD USERS
  // =====================
  useEffect(() => {
    const loadUsers = async () => {
      const result = await fetchUsers();
      if (result.success) setData(result.users);
    };

    loadUsers();
  }, []);

  // =====================
  // LOAD CURRENT USER
  // =====================
  useEffect(() => {
    const loadMe = async () => {
      const user = await fetchCurrentUser();
      setCurrentUser(user);
    };

    loadMe();
  }, []);

  // =====================
  // OPEN MODALS
  // =====================
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

  // =====================
  // VALIDATION
  // =====================
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!editing && !form.password.trim()) e.password = "Password is required";
    if (!form.role) e.role = "Role is required";
    return e;
  };

  // =====================
  // SAVE (CREATE / UPDATE)
  // =====================
  const save = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setLoading(true);

    try {
      // UPDATE
      if (editing) {
        const result = await updateUser(editing.auth_id, form.name, form.role);

        if (!result.success) throw new Error(result.error);

        const refreshed = await fetchUsers();
        if (refreshed.success) setData(refreshed.users);

        setModalOpen(false);
        setEditing(null);
        return;
      }

      // CREATE
      const result = await registerAccount(
        form.name,
        form.email,
        form.password,
        form.role,
      );

      if (!result.success) throw new Error(result.error);

      const user = result.user;

      setData((prev) => [
        ...prev,
        {
          id: user.id,
          auth_id: user.id,
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

  // =====================
  // DELETE (SUPER ADMIN ONLY)
  // =====================
  const remove = async (item) => {
    try {
      if (!currentUser?.auth_id) {
        throw new Error("User not loaded");
      }

      const result = await deleteUser(item.auth_id, currentUser.auth_id);

      if (!result.success) throw new Error(result.error);

      const refreshed = await fetchUsers();
      if (refreshed.success) setData(refreshed.users);

      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // =====================
  // UI HELPERS
  // =====================
  const roleColor = {
    "Super Admin": "#E53E3E",
    Editor: "#6FD1D7",
    Elder: "#c7d76f",
  };

  const avatar = (name = "") =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const isReady = !!currentUser;

  // =====================
  // UI
  // =====================
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
      <div
        style={{
          ...tableStyles.wrapper,
          width: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "thin",
        }}
      >
        <table
          style={{
            ...tableStyles.table,
            minWidth: 700,
          }}
        >
          <thead>
            <tr>
              {["Admin", "Email", "Role", "Action"].map((h) => (
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

                <td style={tableStyles.td}>
                  <button
                    onClick={() => openEdit(item)}
                    style={btnStyles.iconBtn}
                  >
                    <Icon.Edit />
                  </button>
                  <button
                    disabled={!isReady}
                    style={btnStyles.danger}
                    onClick={() => setDeleteTarget(item)}
                  >
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
        icon={<Icon.Users />}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Admin" : "Add Admin"}
      >
        <div style={formGrid(1)}>
          <Field label="Full Name" error={errors.name}>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="John Doe"
            />
          </Field>

          {!editing && (
            <Field label="Email" error={errors.email}>
              <Input
                value={form.email}
                disabled={!!editing}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="johndoe@cbcc.com"
              />
            </Field>
          )}
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
        onConfirm={() => remove(deleteTarget)}
        itemName={deleteTarget?.name}
      />
    </div>
  );
}
