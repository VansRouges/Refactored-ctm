export const fetchStocks = async () => {
    try {
      const response = await fetch("/api/fetch-stocks", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch stocks");
      }
  
      return result.stocks;
    } catch (error) {
      console.error("Fetch Stocks API Error:", error);
      throw error;
    }
  };
  