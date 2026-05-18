import { supabase } from "../../lib/supabaseClient";

export const createWeekService = async (payload) => {
  const { data, error } = await supabase
    .from("weekservice_tb")
    .insert([
      {
        month: payload.month,
        day: payload.day,
        title: payload.title,
        time: payload.time,
        pastor: payload.pastor,
        description: payload.description,
        category: payload.category,
      },
    ])
    .select();

  if (error) {
    console.error("INSERT ERROR:", error);
    return { success: false, error };
  }

  return { success: true, data };
};
