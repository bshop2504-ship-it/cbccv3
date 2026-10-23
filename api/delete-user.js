import { createClient } from "@supabase/supabase-js";
import { requireRole, USER_ADMINS } from "./_lib/auth.js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    //  1. Check requester role (from the token, not the body)
    const auth = await requireRole(req, res, USER_ADMINS);
    if (!auth) return;

    const { auth_id } = req.body ?? {};

    if (!auth_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (auth_id === auth.authUser.id) {
      return res.status(400).json({
        error: "You cannot delete your own account",
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
