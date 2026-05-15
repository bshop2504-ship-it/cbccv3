import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing auth token" });
    }

    const token = authHeader.split(" ")[1];

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: "Invalid user" });
    }

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Missing file id" });
    }

    // OPTIONAL: get file first (for storage cleanup later)
    const { data: fileRow, error: fetchError } = await supabase
      .from("elder-storage_tb")
      .select("file_url")
      .eq("id", id)
      .single();

    if (fetchError) {
      return res.status(404).json({ error: "File not found" });
    }

    // DELETE DB ROW
    const { error } = await supabase
      .from("elder-storage_tb")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
      deletedFile: fileRow,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
