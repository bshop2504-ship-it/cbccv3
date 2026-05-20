import { supabase } from "../lib/supabaseClient";

export const fetchCurrentUser = async () => {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError || !sessionData?.session) {
    return null;
  }

  const token = sessionData.session.access_token;

  try {
    const res = await fetch("/api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.user;
  } catch (err) {
    console.error("fetchCurrentUser error:", err);
    return null;
  }
};
