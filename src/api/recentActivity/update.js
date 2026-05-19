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

export const updateRecentActivity = async ({
  id,
  title,
  subtitle,
  description,
  date,
  img,
  oldImg,
}) => {
  try {
    let imageUrl = oldImg || null;

    // ─── UPLOAD NEW IMAGE ──────────────────────────────────────
    if (img && typeof img !== "string") {
      const fileExt = img.name.split(".").pop();

      const fileName = `${Date.now()}.${fileExt}`;

      const filePath = `recent-act-files/${fileName}`;

      // Upload new image
      const { error: uploadError } = await supabase.storage
        .from("cbcc-bucket")
        .upload(filePath, img, {
          cacheControl: "3600",
          upsert: false,
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

      imageUrl = publicData.publicUrl;

      // ─── DELETE OLD IMAGE ────────────────────────────────────
      if (oldImg) {
        const oldPath = extractPathFromUrl(oldImg);

        console.log("Deleting old file:", oldPath);

        if (oldPath) {
          const { data: deleteData, error: deleteError } =
            await supabase.storage.from("cbcc-bucket").remove([oldPath]);

          console.log("Old image delete response:", deleteData);

          if (deleteError) {
            console.error("Old image delete error:", deleteError.message);
          }
        }
      }
    }

    // ─── UPDATE DATABASE ──────────────────────────────────────
    const { data, error } = await supabase
      .from("recent_activities")
      .update({
        title,
        subtitle,
        description,
        date,
        img: imageUrl,
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
