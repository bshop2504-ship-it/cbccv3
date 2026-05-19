import { supabase } from "../../lib/supabaseClient";

export const createRecentActivity = async ({
  title,
  subtitle,
  description,
  date,
  img,
}) => {
  try {
    let imageUrl = "";

    if (img && typeof img !== "string") {
      const fileExt = img.name.split(".").pop();

      const fileName = `${Date.now()}.${fileExt}`;

      const filePath = `recent-act-files/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
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
    } else if (typeof img === "string") {
      imageUrl = img;
    }

    // ─── Save to DB ───────────────────────────────
    const { data, error } = await supabase
      .from("recent_activities")
      .insert([
        {
          title,
          subtitle,
          description,
          date,
          img: imageUrl || null,
        },
      ])
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
