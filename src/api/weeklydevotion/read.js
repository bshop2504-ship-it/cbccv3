import { supabase } from "../../lib/supabaseClient";
export const fetchWeeklyDevotions = async () => {
  try {
    const { data, error } = await supabase
      .from("weekly_devotion_tb")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
};
