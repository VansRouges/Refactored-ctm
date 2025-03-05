export const fetchCopiedTrades = async (user_id: string) => {
    try {
      if (!user_id) throw new Error("User ID is required");

      const response = await fetch(`/api/fetch-copied-trades?user_id=${user_id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch copied trades");
      }
  
      return result.copiedTrades;
    } catch (error) {
      console.error("Fetch Copied Trades API Error:", error);
      throw error;
    }
  };
  