import { createClient } from "@supabase/supabase-js";
import { requireRole, ELDER_ROLES, SUPER_ADMIN } from "../_lib/auth.js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const auth = await requireRole(req, res, ELDER_ROLES);
    if (!auth) return;

    const {
      id,
      title,
      description,

      file,
      file_name,
      file_size,
      mime_type,
    } = req.body ?? {};

    if (!id) {
      return res.status(400).json({ error: "Missing file id" });
    }

    // ─────────────────────────────
    // LOAD EXISTING ROW + CHECK OWNER
    // (old file path comes from the DB, never from the client)
    // ─────────────────────────────
    const { data: existing, error: fetchError } = await supabase
      .from("elder-storage_tb")
      .select("user_id, file_path")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ error: "File not found" });
    }

    if (
      existing.user_id !== auth.dbUser.id &&
      auth.dbUser.role !== SUPER_ADMIN
    ) {
      return res.status(403).json({ error: "You can only edit your own files" });
    }

    let uploadedFileUrl = null;
    let uploadedFilePath = null;

    // ─────────────────────────────
    // UPLOAD REPLACEMENT FILE IF PROVIDED
    // ─────────────────────────────
    if (file) {
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

    // ─────────────────────────────
    // DELETE OLD FILE (only after the row points at the new one)
    // ─────────────────────────────
    if (uploadedFilePath && existing.file_path) {
      const { error: removeError } = await supabase.storage
        .from("cbcc-bucket")
        .remove([existing.file_path]);

      if (removeError) {
        console.error("Old file delete error:", removeError.message);
      }
    }

    return res.status(200).json({
      message: "File updated successfully",
      data,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
