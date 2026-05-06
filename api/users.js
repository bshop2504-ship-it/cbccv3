import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export default async function handler(req, res) {
  // GET ALL USERS
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("userTB")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(200).json({
        users: data,
      });
    } catch (err) {
      console.error("Fetch users error:", err);
      return res.status(500).json({
        error: "Internal server error",
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
