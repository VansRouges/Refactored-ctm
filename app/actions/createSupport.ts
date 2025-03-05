export const createSupport = async (supportData: {
    user_id: string | null | undefined;
    full_name: string | null | undefined;
    email: string | undefined;
    title: string;
    message: string;
    priority: string;
  }) => {
    try {
      const response = await fetch("/api/create-support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supportData),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || "Failed to create support ticket");
      }
  
      return result.support;
    } catch (error) {
      console.error("Create Support API Error:", error);
      throw error;
    }
  };
  