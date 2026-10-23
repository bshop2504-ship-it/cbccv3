import { supabase } from "../lib/supabaseClient";

const getAuthHeader = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Not authenticated");
  }

  return { Authorization: `Bearer ${session.access_token}` };
};

export const loginAccount = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return {
    success: true,
    user: data.user,
    session: data.session,
  };
};
export const registerAccount = async (name, email, password, role) => {
  try {
    //  get session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("Not authenticated");
    }

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ name, email, password, role }),
    });

    const text = await response.text();

    if (!text) {
      throw new Error("Empty server response");
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("Invalid JSON response:", text);
      throw new Error("Server returned invalid JSON");
    }

    if (!response.ok) {
      throw new Error(data?.error || `Request failed (${response.status})`);
    }

    return {
      success: true,
      user: data.user,
      message: data.message,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
};
export const updateUser = async (auth_id, name, role) => {
  try {
    const res = await fetch("/api/update-user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(await getAuthHeader()),
      },
      body: JSON.stringify({ auth_id, name, role }),
    });

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Invalid JSON response");
    }

    if (!res.ok) {
      throw new Error(data?.error || "Update failed");
    }

    return { success: true, user: data.user };
  } catch (err) {
    console.error(" updateUser error:", err.message);
    return { success: false, error: err.message };
  }
};
export const deleteUser = async (auth_id) => {
  const res = await fetch("/api/delete-user", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(await getAuthHeader()),
    },
    body: JSON.stringify({ auth_id }),
  });

  const text = await res.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON response");
  }

  if (!res.ok) {
    throw new Error(data?.error || "Delete failed");
  }

  return { success: true };
};
export const fetchUsers = async () => {
  try {
    const res = await fetch("/api/users", {
      headers: await getAuthHeader(),
    });

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Invalid JSON response");
    }

    if (!res.ok) {
      throw new Error(data?.error || "Failed to fetch users");
    }

    return {
      success: true,
      users: data.users,
    };
  } catch (err) {
    console.error(" fetchUsers error:", err.message);

    return {
      success: false,
      error: err.message,
    };
  }
};
export const forgotPassword = async (email) => {
  const res = await fetch("/api/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
};
