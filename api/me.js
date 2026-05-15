import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export default async function handler(req, res) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No auth header" });
    }

    const token = authHeader.replace("Bearer ", "");

    // Get authenticated Supabase user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: "Invalid user" });
    }

    // Get user data from your custom table
    const { data: userRow, error: dbError } = await supabase
      .from("userTB")
      .select("id, auth_id, role, name")
      .eq("auth_id", user.id)
      .single();

    if (dbError) {
      return res.status(400).json({ error: dbError.message });
    }

    // Final response
    console.log(user);
    return res.status(200).json({
      user: {
        user_id: userRow.id, // 👈 your DB user ID
        auth_id: userRow.auth_id, // 👈 Supabase auth ID
        role: userRow.role,
        name: userRow.name,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
