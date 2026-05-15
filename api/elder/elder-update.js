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

      old_file_path,

      file,
      file_name,
      file_size,
      mime_type,
    } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Missing file id" });
    }

    let uploadedFileUrl = null;
    let uploadedFilePath = null;

    // ─────────────────────────────
    // REPLACE FILE IF EXISTS
    // ─────────────────────────────
    if (file) {
      // DELETE OLD FILE
      if (old_file_path) {
        await supabase.storage.from("cbcc-bucket").remove([old_file_path]);
      }

      const uniqueName = `${Date.now()}-${file_name}`;
      const filePath = `elder-files/${uniqueName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("cbcc-bucket")
        .upload(filePath, Buffer.from(file, "base64"), {
          contentType: mime_type,
        });

      if (uploadError) {
        throw uploadError;
      }

      uploadedFilePath = uploadData.path;

      const {
        data: { publicUrl },
      } = supabase.storage.from("cbcc-bucket").getPublicUrl(filePath);

      uploadedFileUrl = publicUrl;
    }

    // ─────────────────────────────
    // UPDATE DB
    // ─────────────────────────────
    const updatePayload = {
      title,
      description,
      updated_at: new Date(),
    };

    if (uploadedFileUrl) {
      updatePayload.file_url = uploadedFileUrl;
      updatePayload.file_path = uploadedFilePath;
      updatePayload.file_name = file_name;
      updatePayload.file_size = file_size;
      updatePayload.mime_type = mime_type;
    }

    const { data, error } = await supabase
      .from("elder-storage_tb")
      .update(updatePayload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return res.status(200).json({
      message: "File updated successfully",
      data,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
