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
    const { auth_id, requester_auth_id } = req.body ?? {};

    if (!auth_id || !requester_auth_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    //  1. Check requester role
    const { data: requester, error: requesterError } = await supabase
      .from("userTB")
      .select("role")
      .eq("auth_id", requester_auth_id)
      .single();

    if (requesterError || !requester) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (requester.role !== "Super Admin") {
      return res.status(403).json({
        error: "Only Super Admin can delete users",
      });
    }

    // 🧹 2. Delete from userTB
    const { error: dbError } = await supabase
      .from("userTB")
      .delete()
      .eq("auth_id", auth_id);

    if (dbError) {
      return res.status(400).json({ error: dbError.message });
    }

    //  3. Delete from Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(auth_id);

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("DELETE ERROR:", err);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
