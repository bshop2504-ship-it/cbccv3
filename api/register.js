import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password, name = "", role = "Viewer" } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    //CREATE USER EMAIL-AUTH
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    //INSERT INTO userTB
    const { error: insertError } = await supabase.from("userTB").insert([
      {
        auth_id: data.user.id,
        name,
        email,
        role,
      },
    ]);

    if (insertError) {
      return res.status(400).json({ error: insertError.message });
    }

    return res.status(200).json({
      user: data.user,
      message: "User created and saved in userTB",
    });
  } catch (err) {
    console.error("Register API error:", err);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
