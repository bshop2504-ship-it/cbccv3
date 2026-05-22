import { supabase } from "../../lib/supabaseClient";

export const deleteWeeklyDevotion = async ({ id, file }) => {
  try {
    // DELETE STORAGE FILE
    if (file) {
      const filePath = file.split("/cbcc-bucket/")[1];

      console.log("Deleting:", filePath);

      const { data, error } = await supabase.storage
        .from("cbcc-bucket")
        .remove([filePath]);

      console.log("DELETE RESULT:", data);

      if (error) {
        console.error(error);

        return {
          success: false,
          error: error.message,
        };
      }
    }

    // DELETE DATABASE ROW
    const { error } = await supabase
      .from("weekly_devotion_tb")
      .delete()
      .eq("id", id);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
};
