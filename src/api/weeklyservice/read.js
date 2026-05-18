import { supabase } from "../../lib/supabaseClient";

export const fetchWeekServices = async () => {
  const { data, error } = await supabase
    .from("weekservice_tb")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("FETCH ERROR:", error);
    return { success: false, error, data: [] };
  }

  return { success: true, data };
};
