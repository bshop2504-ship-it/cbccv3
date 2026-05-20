import { supabase } from "../../lib/supabaseClient";

export const updateLiveStream = async ({
  id,
  title,
  description,
  pastor,
  link,
}) => {
  try {
    const { data, error } = await supabase
      .from("livestream_tb")
      .update({
        title,
        description,
        pastor,
        link,
      })
      .eq("id", id)
      .select();

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error("UPDATE LIVESTREAM ERROR:", err);

    return {
      success: false,
      error: err.message,
    };
  }
};
