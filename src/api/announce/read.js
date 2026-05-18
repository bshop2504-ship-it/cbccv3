import { supabase } from "../../lib/supabaseClient";

export const fetchAnnouncements = async () => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();

    const token = sessionData?.session?.access_token;

    if (!token) {
      throw new Error("No session found");
    }

    const response = await fetch("/api/announce/announce-read", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    let data;

    try {
      data = await response.json();
    } catch {
      const text = await response.text();
      throw new Error(text);
    }

    if (!response.ok) {
      throw new Error(data?.error || "Fetch announcements failed");
    }

    return data.data;
  } catch (err) {
    console.error("FETCH ANNOUNCEMENTS ERROR:", err);
    throw err;
  }
};
