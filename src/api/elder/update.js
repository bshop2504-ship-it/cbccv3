export const updateElderFile = async (payload) => {
  try {
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
