export const createDeposit = async (data: {
    token_name: string;
    amount: number;
    token_deposit_address: string;
    user_id: string | null | undefined;
    full_name: string | null | undefined;
  }) => {
    try {
      const response = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || "Failed to create transaction");
      }
  
      return result;
    } catch (error) {
      console.error("Transaction API Error:", error);
      throw error;
    }
  };
  