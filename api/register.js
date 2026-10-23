import { createClient } from "@supabase/supabase-js";
import { requireRole, USER_ADMINS } from "./_lib/auth.js";

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    //  BLOCK if not Super Admin
    const auth = await requireRole(req, res, USER_ADMINS);
    if (!auth) return;

    //  Proceed with creation
    const { email, password, name = "", role = "Viewer" } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const { error: insertError } = await supabaseAdmin.from("userTB").insert([
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
      message: "User created by Super Admin",
    });
  } catch (err) {
    console.error("Register API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
