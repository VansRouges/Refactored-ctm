export const withdraw = async (
    currency: string, 
    amount: number, 
    address: string, 
    user_id: string, 
    full_name: string
  ) => {
    try {
      const response = await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency, amount, address, user_id, full_name }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || "Failed to process withdrawal");
      }
  
      return result.transaction;
    } catch (error) {
      console.error("Withdraw API Error:", error);
      throw error;
    }
  };
  