export const createCopyStockTrade = async (data : { 
    initial_investment : number,
    trade_min : number,
    trade_max : number,
    trade_roi_min : number,
    trade_roi_max : number,
    trade_risk : string,
    isProfit: boolean,
    trade_current_value: number,
    trade_title: string,
    trade_token: string,
    trade_token_address: string,
    trade_status: string,
    trade_profit_loss: number,
    trade_win_rate: number,
    full_name: string | null | undefined,
    user_id: string | null | undefined,
  }) => {
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
        console.error("Error in createCopyStockTrade:", error);
        throw error;
      }
    };
    