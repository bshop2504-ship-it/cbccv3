import { createClient } from "@supabase/supabase-js";

// Files under api/_lib are not deployed as endpoints (underscore prefix).

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export const SUPER_ADMIN = "Super Admin";

export const USER_ADMINS = [SUPER_ADMIN];
export const CONTENT_EDITORS = [SUPER_ADMIN, "Editor"];
export const ELDER_ROLES = [SUPER_ADMIN, "Elder"];

// Verifies the bearer token and the caller's role in userTB.
// On failure it sends the 401/403 response and returns null, so callers do:
//   const auth = await requireRole(req, res, USER_ADMINS);
//   if (!auth) return;
// The caller's identity always comes from the token, never the request body.
export async function requireRole(req, res, allowedRoles) {
  const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }

  const { data: dbUser, error: dbError } = await supabase
    .from("userTB")
    .select("id, auth_id, role, name, email")
    .eq("auth_id", user.id)
    .single();

  if (dbError || !dbUser || !allowedRoles.includes(dbUser.role)) {
    res.status(403).json({ error: "Forbidden" });
    return null;
  }

  return { authUser: user, dbUser };
}
