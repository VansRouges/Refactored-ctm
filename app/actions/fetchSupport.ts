export const fetchSupport = async (user_id: string) => {
    try {
      if (!user_id) throw new Error("User ID is required");
  
      const response = await fetch(`/api/fetch-support?user_id=${user_id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch support requests");
      }
  
      return result.supportRequests;
    } catch (error) {
      console.error("Fetch Support API Error:", error);
      throw error;
    }
  };
  