// READ
import { supabase } from "../../lib/supabaseClient";

export const fetchVerses = async () => {
  const { data, error } = await supabase
    .from("bible_verses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("FETCH ERROR:", error);
    return { success: false, error };
  }

  return { success: true, data };
};
