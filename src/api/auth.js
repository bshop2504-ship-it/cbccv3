import { supabase } from "../lib/supabaseClient";

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
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, role }),
    });

    const text = await response.text();

    //  Handle empty response
    if (!text) {
      throw new Error("Empty server response");
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error(" Invalid JSON response:", text);
      throw new Error("Server returned invalid JSON");
    }

    //  Handle API errors
    if (!response.ok) {
      console.error(" API Error:", data);
      throw new Error(data?.error || `Request failed (${response.status})`);
    }

    // Success
    return {
      success: true,
      user: data.user,
      message: data.message,
    };
  } catch (err) {
    console.error(" registerAccount error:", err.message);

    return {
      success: false,
      error: err.message,
    };
  }
};
// export const loginAccount = async (email, password) => {
//   const response = await fetch("/api/login", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ email, password }),
//   });

//   const text = await response.text();

//   let data;
//   try {
//     data = JSON.parse(text);
//   } catch {
//     throw new Error("Invalid server response");
//   }

//   if (!response.ok) {
//     throw new Error(data?.error || "Login failed");
//   }

//   return data;
// };
export const fetchUsers = async () => {
  try {
    const res = await fetch("/api/users");

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
export const updateUser = async (auth_id, name, role) => {
  try {
    const res = await fetch("/api/update-user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
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
export const deleteUser = async (auth_id, requester_auth_id) => {
  const res = await fetch("/api/delete-user", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      auth_id,
      requester_auth_id,
    }),
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
