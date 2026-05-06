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
    const { auth_id, name, role } = req.body ?? {};

    if (!auth_id) {
      return res.status(400).json({ error: "auth_id is required" });
    }

    if (!name && !role) {
      return res.status(400).json({
        error: "Nothing to update (name or role required)",
      });
    }

    const { data, error } = await supabase
      .from("userTB")
      .update({
        ...(name !== undefined && { name }),
        ...(role !== undefined && { role }),
      })
      .eq("auth_id", auth_id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      success: true,
      user: data,
      message: "User updated successfully",
    });
  } catch (err) {
    console.error("UPDATE USER ERROR:", err);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
