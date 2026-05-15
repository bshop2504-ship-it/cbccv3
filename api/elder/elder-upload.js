import { createClient } from "@supabase/supabase-js";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // ─────────────────────────────
    // AUTH
    // ─────────────────────────────
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing auth token" });
    }

    const token = authHeader.split(" ")[1];

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: "Invalid user" });
    }

    const { data: currentUser } = await supabase
      .from("userTB")
      .select("*")
      .eq("auth_id", user.id)
      .single();

    if (!currentUser) {
      return res.status(400).json({ error: "User not found" });
    }

    // ─────────────────────────────
    // FORM PARSE
    // ─────────────────────────────
    const form = formidable({
      multiples: false,
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const file = files.file;

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileBuffer = fs.readFileSync(file.filepath);

      const uniqueName = `${Date.now()}-${file.originalFilename}`;
      const filePath = `elder-files/${uniqueName}`;

      // ─────────────────────────────
      // UPLOAD TO SUPABASE STORAGE
      // ─────────────────────────────
      const { error: uploadError } = await supabase.storage
        .from("cbcc-bucket")
        .upload(filePath, fileBuffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (uploadError) {
        return res.status(500).json({ error: uploadError.message });
      }

      // ─────────────────────────────
      // GET PUBLIC URL
      // ─────────────────────────────
      const {
        data: { publicUrl },
      } = supabase.storage.from("cbcc-bucket").getPublicUrl(filePath);

      // ─────────────────────────────
      // INSERT DB
      // ─────────────────────────────
      const { data, error: insertError } = await supabase
        .from("elder-storage_tb")
        .insert([
          {
            user_id: currentUser.id,
            title: fields.title,
            description: fields.description || "",
            file_url: publicUrl,
            file_path: filePath,
            file_name: file.originalFilename,
            mime_type: file.mimetype,
            file_size: file.size,
          },
        ])
        .select()
        .single();

      if (insertError) {
        return res.status(500).json({ error: insertError.message });
      }

      return res.status(200).json({
        success: true,
        data,
      });
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
