import { supabase } from "../../lib/supabaseClient";

export const fetchElderFiles = async () => {
  const { data: sessionData } = await supabase.auth.getSession();

  const token = sessionData?.session?.access_token;

  if (!token) {
    throw new Error("No session found");
  }

  const res = await fetch("/api/elder/elder-select", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  let data;

  try {
    data = await res.json();
  } catch {
    const text = await res.text();
    throw new Error(text);
  }

  if (!res.ok) {
    throw new Error(data?.error || "Failed to fetch data");
  }

  return data.data;
};
