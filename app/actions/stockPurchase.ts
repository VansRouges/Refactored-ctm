export const createStockPurchase = async (data: any) => {
    try {
      const response = await fetch("/api/stock-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) throw new Error("Failed to create stock purchase");
  
      return await response.json();
    } catch (error) {
      console.error("Error in createStockPurchase:", error);
      throw error;
    }
  };
  