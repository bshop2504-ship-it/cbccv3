import { supabase } from "../../lib/supabaseClient";

export const updateElderFile = async ({
  id,
  title,
  description,

  // new file
  file,
  file_name,
  file_size,
  mime_type,
}) => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();

    const token = sessionData?.session?.access_token;

    if (!token) {
      throw new Error("No session found");
    }

    const payload = {
      id,
      title,
      description,
    };

    // ONLY INCLUDE FILE DATA IF USER REPLACED FILE
    if (file) {
      payload.file = file;
      payload.file_name = file_name;
      payload.file_size = file_size;
      payload.mime_type = mime_type;
    }

    const res = await fetch("/api/elder/elder-update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Update failed");
    }

    return data;
  } catch (err) {
    console.error("Update error:", err);
    throw err;
  }
};
