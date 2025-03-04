export const createCopyTrade = async (data: any) => {
    try {
      const response = await fetch("/api/copytrade-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) throw new Error("Failed to create copy trade");
      console.log("Copy trade created successfully", response)
      return await response.json();
    } catch (error) {
      console.error("Error in createCopyTrade:", error);
      throw error;
    }
  };
  