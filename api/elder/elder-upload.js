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

    // GET USER TB
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

    // FORM PARSE
    const form = formidable({
      multiples: false,
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      try {
        if (err) {
          console.error(err);

          return res.status(500).json({
            error: err.message,
          });
        }

        const file = files.file;

        if (!file) {
          return res.status(400).json({
            error: "No file uploaded",
          });
        }

        const title = fields.title;

        const description = fields.description || "";

        // READ FILE
        const fileBuffer = fs.readFileSync(file.filepath);

        // UNIQUE NAME
        const uniqueName = `${Date.now()}-${file.originalFilename}`;

        // STORAGE
        const { error: uploadError } = await supabase.storage
          .from("cbcc-bucket")
          .upload(uniqueName, fileBuffer, {
            contentType: file.mimetype,
          });

        if (uploadError) {
          console.error(uploadError);

          return res.status(500).json({
            error: uploadError.message,
          });
        }

        // URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("cbcc-bucket").getPublicUrl(uniqueName);

        // INSERT DB
        const { data, error: insertError } = await supabase
          .from("elder-storage_tb")
          .insert([
            {
              user_id: currentUser.id,

              title,
              description,

              file_url: publicUrl,

              file_name: file.originalFilename,

              mime_type: file.mimetype,

              file_size: file.size,
            },
          ])
          .select()
          .single();

        if (insertError) {
          console.error(insertError);

          return res.status(500).json({
            error: insertError.message,
          });
        }

        return res.status(200).json({
          success: true,
          data,
        });
      } catch (innerError) {
        console.error(innerError);

        return res.status(500).json({
          error: innerError.message,
        });
      }
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message,
    });
  }
}
