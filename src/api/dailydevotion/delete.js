// DELETE
import { supabase } from "../../lib/supabaseClient";

export const deleteVerse = async (id) => {
  const { error } = await supabase.from("bible_verses").delete().eq("id", id);

  if (error) {
    console.error("DELETE ERROR:", error);
    return { success: false, error };
  }

  return { success: true };
};
