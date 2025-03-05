export const fetchTrades = async () => {
    try {
      const response = await fetch("/api/fetch-trades", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch trades");
      }
  
      return result.trades;
    } catch (error) {
      console.error("Fetch Trades API Error:", error);
      throw error;
    }
  };
  