import { supabase } from "../../lib/supabaseClient";

const extractPathFromUrl = (url) => {
  if (!url) return null;

  try {
    const urlObj = new URL(url);
    const parts = urlObj.pathname.split("/cbcc-bucket/");
    return parts[1] || null;
  } catch (err) {
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
    let newImagePath = null;

    // ─── 1. Upload NEW image first ─────────────────────────────
    if (img && typeof img !== "string") {
      const fileExt = img.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      newImagePath = `recent-act-files/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("cbcc-bucket")
        .upload(newImagePath, img, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        return {
          success: false,
          error: uploadError.message,
        };
      }

      const { data: publicData } = supabase.storage
        .from("cbcc-bucket")
        .getPublicUrl(newImagePath);

      imageUrl = publicData.publicUrl;
    }

    // ─── 2. Update DB FIRST ─────────────────────────────
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

    // ─── 3. DELETE OLD IMAGE ONLY AFTER SUCCESS ─────────────────
    if (img && typeof img !== "string" && oldImg) {
      const oldPath = extractPathFromUrl(oldImg);

      if (oldPath) {
        const { error: deleteError } = await supabase.storage
          .from("cbcc-bucket")
          .remove([oldPath]);

        if (deleteError) {
          console.error("Old image delete failed:", deleteError.message);
        } else {
          console.log("Old image deleted:", oldPath);
        }
      }
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
