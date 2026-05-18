// UPDATE
import { supabase } from "../../lib/supabaseClient";

export const updateVerse = async ({ id, word, verse, reference }) => {
  const { data, error } = await supabase
    .from("bible_verses")
    .update({
      word,
      verse,
      reference,
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error("UPDATE ERROR:", error);
    return { success: false, error };
  }

  return { success: true, data };
};
