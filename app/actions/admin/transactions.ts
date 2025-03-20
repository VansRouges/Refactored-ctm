export async function fetchTransactions() {
    try {
      const response = await fetch("/api/admin/transactions/get-all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
  
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to fetch transactions");
      }
  
      return data.data;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  }

  export async function updateTransactionStatus(id: string, status: "approved" | "rejected") {
    try {
      const response = await fetch("/api/admin/transactions/update", {
        method: "PUT", // Changed from POST to PUT
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update transaction status");
      }
  
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to update transaction status");
      }
  
      return data.data;
    } catch (error) {
      console.error("Error updating transaction status:", error);
      throw error;
    }
  }