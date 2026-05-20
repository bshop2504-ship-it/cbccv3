import { supabase } from "../../lib/supabaseClient";

export const deleteLiveStream = async (id) => {
  try {
    const { error } = await supabase
      .from("livestream_tb")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return {
      success: true,
    };
  } catch (err) {
    console.error("DELETE LIVESTREAM ERROR:", err);

    return {
      success: false,
      error: err.message,
    };
  }
};
