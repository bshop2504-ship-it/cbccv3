import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export default async function handler(req, res) {
  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { title, description } = req.body;

    // Validation
    if (!title || title.trim() === "") {
      return res.status(400).json({
        error: "Title is required",
      });
    }

    // Insert announcement
    const { data, error } = await supabase
      .from("announce_tb")
      .insert([
        {
          title,
          description,
        },
      ])
      .select();

    if (error) {
      console.error(error);

      return res.status(500).json({
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Announcement created successfully",
      data,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
