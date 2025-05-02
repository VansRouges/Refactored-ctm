export async function fetchCopyTradingData() {
    try {
      const response = await fetch("/api/admin/copytrade/get-all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch copy trading data");
      }
  
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to fetch copy trading data");
      }
  
      return data.data;
    } catch (error) {
      console.error("Error fetching copy trading data:", error);
      throw error;
    }
  }

  export async function updateTradeStatus(tradeId: string, status: string, tradeDuration: number | undefined) {
    try {
      const response = await fetch("/api/admin/copytrade/update-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tradeId, status, tradeDuration }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update trade status");
      }
  
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to update trade status");
      }
  
      return data.data;
    } catch (error) {
      console.error("Error updating trade status:", error);
      throw error;
    }
  }

  export async function updateTrade(id: string, updatedFields: Record<string, unknown>) {
    try {
      const response = await fetch("/api/admin/copytrade/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, updatedFields }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update trade");
      }
  
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to update trade");
      }
  
      return data.data;
    } catch (error) {
      console.error("Error updating trade:", error);
      throw error;
    }
  }