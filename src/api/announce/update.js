import { supabase } from "../../lib/supabaseClient";

export const updateAnnouncement = async ({ id, title, description }) => {
  const { data, error } = await supabase
    .from("announce_tb")
    .update({
      title,
      description,
    })
    .eq("id", Number(id))
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
