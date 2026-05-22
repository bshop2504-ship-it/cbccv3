import { supabase } from "../../lib/supabaseClient";

const extractPathFromUrl = (url) => {
  if (!url) return null;

  try {
    return url.split("/cbcc-bucket/")[1];
  } catch (err) {
    console.error("Path extraction failed:", err);

    return null;
  }
};

export const updateWeeklyDevotion = async ({
  id,
  title,
  description,
  date,
  file,
  oldFile,
}) => {
  try {
    let fileUrl = oldFile || null;

    // ─── UPLOAD NEW FILE ───────────────────────────────
    if (file && typeof file !== "string") {
      const fileExt = file.name.split(".").pop();

      const fileName = `${Date.now()}.${fileExt}`;

      const filePath = `devotion-files/${fileName}`;

      // Upload new file
      const { error: uploadError } = await supabase.storage
        .from("cbcc-bucket")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        return {
          success: false,
          error: uploadError.message,
        };
      }

      // Get public URL
      const { data: publicData } = supabase.storage
        .from("cbcc-bucket")
        .getPublicUrl(filePath);

      fileUrl = publicData.publicUrl;

      // ─── DELETE OLD FILE ───────────────────────────
      if (oldFile) {
        const oldPath = extractPathFromUrl(oldFile);

        console.log("Deleting old file:", oldPath);

        if (oldPath) {
          const { data: deleteData, error: deleteError } =
            await supabase.storage.from("cbcc-bucket").remove([oldPath]);

          console.log("Old file delete response:", deleteData);

          if (deleteError) {
            console.error("Old file delete error:", deleteError.message);
          }
        }
      }
    }

    // ─── UPDATE DATABASE ────────────────────────────
    const { data, error } = await supabase
      .from("weekly_devotion_tb")
      .update({
        title,
        description,
        date,
        file: fileUrl,
      })
      .eq("id", id)
      .select();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
};
