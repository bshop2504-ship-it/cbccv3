import { supabase } from "../../lib/supabaseClient";

export const deleteAnnouncement = async (id) => {
  const { data, error } = await supabase
    .from("announce_tb")
    .delete()
    .eq("id", Number(id))
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
