import { supabase } from "../../lib/supabaseClient";

export const publicFetchAnnouncements = async () => {
  try {
    const { data, error } = await supabase
      .from("announce_tb")
      .select("*")
      .order("id", { ascending: false });

    console.log("ANNOUNCEMENTS:", data);
    console.log("ERROR:", error);

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  } catch (err) {
    console.error("FETCH ANNOUNCEMENTS ERROR:", err);
    throw err;
  }
};
