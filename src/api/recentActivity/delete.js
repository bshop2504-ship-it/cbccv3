import { supabase } from "../../lib/supabaseClient";

/**
 * Delete recent activity (DB + Storage)
 */
export const deleteRecentActivity = async ({ id, img }) => {
  try {
    // ─────────────────────────────────────
    // Extract storage path from Supabase public URL
    // ─────────────────────────────────────
    const extractStoragePath = (url) => {
      try {
        if (!url) return null;

        // remove query params if any
        const cleanUrl = url.split("?")[0];

        // your bucket name is: cbcc-bucket
        const marker = "/cbcc-bucket/";

        const index = cleanUrl.indexOf(marker);

        if (index === -1) return null;

        return cleanUrl.substring(index + marker.length);
      } catch (err) {
        return null;
      }
    };

    const storagePath = extractStoragePath(img);

    console.log("DELETE STORAGE PATH:", storagePath);

    // ─────────────────────────────────────
    // DELETE FROM STORAGE FIRST
    // ─────────────────────────────────────
    if (storagePath) {
      const { error: storageError } = await supabase.storage
        .from("cbcc-bucket")
        .remove([storagePath]);

      if (storageError) {
        console.error("Storage delete error:", storageError);

        return {
          success: false,
          error: storageError.message,
        };
      }
    }

    // ─────────────────────────────────────
    // DELETE FROM DATABASE
    // ─────────────────────────────────────
    const { error: dbError } = await supabase
      .from("recent_activities")
      .delete()
      .eq("id", id);

    if (dbError) {
      console.error("DB delete error:", dbError);

      return {
        success: false,
        error: dbError.message,
      };
    }

    // ─────────────────────────────────────
    // SUCCESS
    // ─────────────────────────────────────
    return {
      success: true,
      message: "Deleted successfully",
    };
  } catch (err) {
    console.error("Unexpected delete error:", err);

    return {
      success: false,
      error: err.message,
    };
  }
};
