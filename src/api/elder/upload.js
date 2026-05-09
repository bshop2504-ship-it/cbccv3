import { supabase } from "../../lib/supabaseClient";

export const handleUpload = async ({ file, title, description }) => {
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
    // BUILD FORM DATA
    // ─────────────────────────────
    const formData = new FormData();

    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description || "");

    // ─────────────────────────────
    // CALL SERVERLESS API
    // ─────────────────────────────
    const response = await fetch("/api/elder/elder-upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    // ─────────────────────────────
    // SAFE JSON PARSE (IMPORTANT)
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
      throw new Error(data?.error || "Upload failed");
    }

    return data;
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    throw err;
  }
};
