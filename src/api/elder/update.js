export const updateElderFile = async ({
  id,
  title,
  description,

  // old file
  old_file_path,

  // new file
  file,
  file_name,
  file_size,
  mime_type,
}) => {
  try {
    const payload = {
      id,
      title,
      description,
      old_file_path,
    };

    // ONLY INCLUDE FILE DATA IF USER REPLACED FILE
    if (file) {
      payload.file = file;
      payload.file_name = file_name;
      payload.file_size = file_size;
      payload.mime_type = mime_type;
    }

    const res = await fetch("/api/elder/elder-update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Update failed");
    }

    return data;
  } catch (err) {
    console.error("Update error:", err);
    throw err;
  }
};
