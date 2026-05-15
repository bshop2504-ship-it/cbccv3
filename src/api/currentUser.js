import { supabase } from "../lib/supabaseClient";

export const fetchCurrentUser = async () => {
  const { data: sessionData } = await supabase.auth.getSession();

  const token = sessionData?.session?.access_token;

  // return null instead of crashing
  if (!token) {
    console.warn("No session found");
    return null;
  }

  const res = await fetch("/api/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  console.log(data.user);
  return data.user;
};
