import { supabase } from "../../lib/supabaseClient";

export const fetchRecentActivities = async () => {
  const { data, error } = await supabase
    .from("recent_activities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("FETCH ERROR:", error);
    return { success: false, error };
  }

  return { success: true, data };
};
