import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      id,
      title,
      description,
      file_url,
      file_name,
      file_size,
      mime_type,
    } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Missing file id" });
    }

    const updatePayload = {
      title,
      description,
      updated_at: new Date(),
    };

    // only update file fields if provided
    if (file_url) updatePayload.file_url = file_url;
    if (file_name) updatePayload.file_name = file_name;
    if (file_size) updatePayload.file_size = file_size;
    if (mime_type) updatePayload.mime_type = mime_type;

    const { data, error } = await supabase
      .from("elder-storage_tb")
      .update(updatePayload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;

    return res.status(200).json({
      message: "File updated successfully",
      data,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err.message,
    });
  }
}
