import { supabase } from "../../lib/supabaseClient";

export const deleteElderFile = async ({ id }) => {
  try {
    // ─────────────────────────────
    // GET SESSION TOKEN
    // ─────────────────────────────
    const { data: sessionData } = await supabase.auth.getSession();

    const token = sessionData?.session?.access_token;

    if (!token) {
      throw new Error("No session found");
    }

    // ─────────────────────────────
    // CALL DELETE API
    // ─────────────────────────────
    const response = await fetch("/api/elder/elder-delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });

    // ─────────────────────────────
    // SAFE JSON PARSE
    // ─────────────────────────────
    let data;

    try {
      data = await response.json();
    } catch {
      const text = await response.text();
      throw new Error(text);
    }

    // ─────────────────────────────
    // HANDLE ERROR
    // ─────────────────────────────
    if (!response.ok) {
      throw new Error(data?.error || "Delete failed");
    }

    return data;
  } catch (err) {
    console.error("DELETE ERROR:", err);
    throw err;
  }
};
