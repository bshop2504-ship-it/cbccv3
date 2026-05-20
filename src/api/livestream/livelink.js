import { supabase } from "../../lib/supabaseClient";

export const fetchLiveStreams = async () => {
  try {
    const { data, error } = await supabase
      .from("livestream_tb")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error("FETCH LIVESTREAMS ERROR:", err);

    return {
      success: false,
      error: err.message,
      data: null,
    };
  }
};
