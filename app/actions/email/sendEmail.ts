export const sendEmail = async ({
    from,
    to,
    subject,
    message,
  }: {
    from: string;
    to: string;
    subject: string;
    message: string;
  }) => {
    try {
      const response = await fetch("/api/email/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to, subject, message }),
      });
  
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to send email");
      }
  
      return result;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  };
  