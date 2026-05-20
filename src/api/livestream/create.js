import { supabase } from "../../lib/supabaseClient";

export const createLiveStream = async ({
  title,
  description,
  pastor,
  link,
}) => {
  try {
    const { data, error } = await supabase
      .from("livestream_tb")
      .insert([
        {
          title,
          description,
          pastor,
          link,
        },
      ])
      .select();

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error("CREATE LIVESTREAM ERROR:", err);

    return {
      success: false,
      error: err.message,
    };
  }
};
