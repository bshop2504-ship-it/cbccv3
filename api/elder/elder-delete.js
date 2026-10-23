import { createClient } from "@supabase/supabase-js";
import { requireRole, ELDER_ROLES, SUPER_ADMIN } from "../_lib/auth.js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    // ─────────────────────────────────────
    // AUTH
    // ─────────────────────────────────────
    const auth = await requireRole(req, res, ELDER_ROLES);
    if (!auth) return;

    // ─────────────────────────────────────
    // GET FILE ID
    // ─────────────────────────────────────
    const { id } = req.body ?? {};

    if (!id) {
      return res.status(400).json({
        error: "Missing file id",
      });
    }

    // ─────────────────────────────────────
    // GET FILE DATA
    // ─────────────────────────────────────
    const { data: fileRow, error: fetchError } = await supabase
      .from("elder-storage_tb")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !fileRow) {
      return res.status(404).json({
        error: "File not found",
      });
    }

    if (
      fileRow.user_id !== auth.dbUser.id &&
      auth.dbUser.role !== SUPER_ADMIN
    ) {
      return res.status(403).json({
        error: "You can only delete your own files",
      });
    }

    // ─────────────────────────────────────
    // DELETE FILE FROM STORAGE
    // ─────────────────────────────────────
    if (fileRow.file_path) {
      const { error: storageError } = await supabase.storage
        .from("cbcc-bucket")
        .remove([fileRow.file_path]);

      if (storageError) {
        console.error("Storage delete error:", storageError.message);
      }
    }

    // ─────────────────────────────────────
    // DELETE DATABASE RECORD
    // ─────────────────────────────────────
    const { error: deleteError } = await supabase
      .from("elder-storage_tb")
      .delete()
      .eq("id", id);

    if (deleteError) {
      throw deleteError;
    }

    // ─────────────────────────────────────
    // SUCCESS
    // ─────────────────────────────────────
    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
      deletedFile: fileRow,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message,
    });
  }
}
