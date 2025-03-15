export async function getEmails() {
  try {
    const response = await fetch("/api/get-emails", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch emails");
    }

    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching emails:", error);
    return [];
  }
}
