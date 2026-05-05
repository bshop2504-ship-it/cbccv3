export const registerAccount = async (name, email, password, role) => {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password, role }),
  });

  const text = await response.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.error("❌ Invalid JSON response:", text);
    throw new Error("Invalid server response");
  }

  if (!response.ok) {
    throw new Error(data?.error || "Request failed");
  }

  return data;
};
