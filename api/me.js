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

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Invalid user" });
    }

    // get role from userTB
    const { data, error: dbError } = await supabase
      .from("userTB")
      .select("auth_id, role, name")
      .eq("auth_id", user.id)
      .single();

    if (dbError) {
      return res.status(400).json({ error: dbError.message });
    }

    return res.status(200).json({
      user: data,
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
