import { supabase } from "../../lib/supabaseClient";

export const deleteWeekService = async (id) => {
  const { data, error } = await supabase
    .from("weekservice_tb")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    console.error("DELETE ERROR:", error);
    return { success: false, error };
  }

  return { success: true, data };
};
