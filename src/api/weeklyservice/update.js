import { supabase } from "../../lib/supabaseClient";

export const updateWeekService = async (id, payload) => {
  const { data, error } = await supabase
    .from("weekservice_tb")
    .update({
      month: payload.month,
      day: payload.day,
      title: payload.title,
      time: payload.time,
      pastor: payload.pastor,
      description: payload.description,
      category: payload.category,
    })
    .eq("id", id)
    .select();

  if (error) {
    console.error("UPDATE ERROR:", error);
    return { success: false, error };
  }

  return { success: true, data };
};
