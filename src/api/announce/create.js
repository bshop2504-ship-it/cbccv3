import { supabase } from "../../lib/supabaseClient";

export const createAnnouncement = async ({ title, description }) => {
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
    // CALL SERVERLESS API
    // ─────────────────────────────
    const response = await fetch("/api/announce/announce-create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
      }),
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
      throw new Error(data?.error || "Create announcement failed");
    }

    return data;
  } catch (err) {
    console.error("CREATE ANNOUNCEMENT ERROR:", err);
    throw err;
  }
};
