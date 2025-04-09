// Fetch All Emails
export async function fetchEmails() {
    try {
      const response = await fetch("/api/email/get-emails", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
      console.log("server emails: ", data.emails)
      return data.emails || [];
    } catch (error) {
      console.error("Error fetching emails:", error);
      return [];
    }
  }