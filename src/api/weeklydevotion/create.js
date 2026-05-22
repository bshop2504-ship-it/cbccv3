import { supabase } from "../../lib/supabaseClient";

export const createWeeklyDevotion = async ({
  title,
  description,
  date,
  file,
}) => {
  try {
    let fileUrl = "";

    // Upload file
    if (file && typeof file !== "string") {
      const fileExt = file.name.split(".").pop();

      const fileName = `${Date.now()}.${fileExt}`;

      const filePath = `devotion-files/${fileName}`;

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

      const { data: publicData } = supabase.storage
        .from("cbcc-bucket")
        .getPublicUrl(filePath);

      fileUrl = publicData.publicUrl;
    } else if (typeof file === "string") {
      fileUrl = file;
    }

    // Save to DB
    const { data, error } = await supabase
      .from("weekly_devotion_tb")
      .insert([
        {
          title,
          description,
          date,
          file: fileUrl || null,
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
