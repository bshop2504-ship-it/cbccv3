import { supabase } from "../../lib/supabaseClient";

export const createVerse = async ({ word, verse, reference }) => {
  const { data, error } = await supabase
    .from("bible_verses")
    .insert([
      {
        word,
        verse,
        reference,
      },
    ])
    .select();

  if (error) {
    console.error("CREATE ERROR:", error);
    return { success: false, error };
  }

  return { success: true, data };
};
