import { createClient } from "@supabase/supabase-js";

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
    // AUTH
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "No auth header",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({
        error: "Invalid user",
      });
    }

    // GET CURRENT USER
    const { data: currentUser, error: userError } = await supabase
      .from("userTB")
      .select("*")
      .eq("auth_id", user.id)
      .single();

    if (userError || !currentUser) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    // OPTIONAL QUERY
    // ?mode=all
    // ?mode=mine

    const mode = req.query.mode || "mine";

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
