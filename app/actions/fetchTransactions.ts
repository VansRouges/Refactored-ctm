export const fetchTransactions = async (user_id: string) => {
    try {
      const response = await fetch(`/api/fetch-transactions?user_id=${user_id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch transactions");
      }
  
      return result.transactions;
    } catch (error) {
      console.error("Fetch Transactions API Error:", error);
      throw error;
    }
  };
  