export const createCopyTrade = async ({ 
  data, 
  initial_investment,
  trade_title,
  trade_token,
  trade_token_address, 
  trade_status,
  user_id,
  full_name,
}: {
  data: any;
  initial_investment: number;
  trade_title: string;
  trade_token: string;
  trade_token_address: string;
  trade_status: string;
  user_id: string | null | undefined;
  full_name: string | null | undefined;
}) => {
  const copyTradePayload =
  data && trade_title?.trim() !== "" 
      ? {
      trade_title,
      trade_min: data.trade_min,
      trade_max: data.trade_max,
      trade_roi_min: data.trade_roi_min,
      trade_roi_max: data.trade_roi_max,
      trade_win_rate: 0.0,
      trade_risk: data.trade_risk,
      trade_current_value: 0.0,
      trade_profit_loss: 0.0,
      isProfit: false,
      initial_investment,
      trade_token,
      trade_token_address,
      trade_status,
      user_id,
      full_name
    } :
    null

    try {
      const response = await fetch("/api/copytrade-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(copyTradePayload),
      });
  
      if (!response.ok) throw new Error("Failed to create copy trade");
      console.log("Copy trade created successfully", response)
      return await response.json();
    } catch (error) {
      console.error("Error in createCopyTrade:", error);
      throw error;
    }
  };
  