export const fetchPurchasedStocks = async (user_id: string) => {
    try {
        if (!user_id) throw new Error("User ID is required");

        const response = await fetch(`/api/fetch-purchased-stocks?user_id=${user_id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
    
        const result = await response.json();
    
        if (!response.ok) {
            throw new Error(result.error || "Failed to fetch purchased stocks");
        }
    
        return result.purchasedStocks;
    } catch (error) {
      console.error("Fetch Purchased Stocks API Error:", error);
      throw error;
    }
  };
  