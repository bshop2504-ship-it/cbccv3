import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const supabaseClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 🔑 Get token from headers
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 👤 Get current logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({ error: "Invalid user" });
    }

    //  Get role from your DB (userTB)
    const { data: currentUser, error: roleError } = await supabaseAdmin
      .from("userTB")
      .select("role")
      .eq("auth_id", user.id)
      .single();

    if (roleError || !currentUser) {
      return res.status(403).json({ error: "User role not found" });
    }

    //  BLOCK if not Super Admin
    if (currentUser.role !== "Super Admin") {
      return res.status(403).json({
        error: "Only Super Admin can create users",
      });
    }

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
