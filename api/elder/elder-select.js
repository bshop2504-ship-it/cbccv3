import { createClient } from "@supabase/supabase-js";
import { requireRole, ELDER_ROLES } from "../_lib/auth.js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    // AUTH (Elders + Super Admin only)
    const auth = await requireRole(req, res, ELDER_ROLES);
    if (!auth) return;

    const currentUser = auth.dbUser;

    // OPTIONAL QUERY
    // ?mode=all
    // ?mode=mine (default; any other value is treated as mine)

    const mode = req.query.mode === "all" ? "all" : "mine";

    let query = supabase
      .from("elder-storage_tb")
      .select(
        `
        *,
        userTB (
          id,
          name,
          email
        )
      `,
      )
      .order("created_at", { ascending: false });

    // CURRENT USER ONLY
    if (mode === "mine") {
      query = query.eq("user_id", currentUser.id);
    }

    // ALL FILES
    const { data, error } = await query;

    if (error) {
      console.error(error);

      return res.status(500).json({
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      mode,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message,
    });
  }
}
