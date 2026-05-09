import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // AUTH
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No auth header" });
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: "Invalid user" });
    }

    // QUERY WITH JOIN
    const { data, error } = await supabase
      .from("elder-storage_tb")
      .select(
        `
    id,
    title,
    description,
    file_url,
    file_name,
    mime_type,
    file_size,
    created_at,
    userTB (
      id,
      name,
      email
    )
  `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
