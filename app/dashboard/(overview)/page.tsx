"use client";
import { CopyTradingOptions } from "@/components/copytrading-options";
import { StatsCards } from "@/components/stats-cards";
import { StockOptions } from "@/components/stock-options";
import { useDispatch } from "react-redux";
import TradingViewWidget from "@/components/TradingViewWidget"
import { useEffect } from "react";
import { toast } from "sonner"
import { clearStockOption } from "@/store/stockOptionsSlice";
import { clearCopyTrade } from "@/store/copyTradeSlice";
import { useUser } from "@clerk/nextjs";


export default function UserDashboard() {
  const { user } = useUser()
  const dispatch = useDispatch();
  const userPortfolio = { 
    total_investment: user?.publicMetadata.totalInvestment as number, 
    current_value: user?.publicMetadata.currentValue as number, 
    roi: user?.publicMetadata.roi as number, 
  }

    useEffect(() => {
        dispatch(clearStockOption());
        dispatch(clearCopyTrade());
    }, [toast]);
    
//   console.log("User Portfolio", userPortfolio)

  const stats = {
    total_investment: user?.publicMetadata.totalInvestment as number || 0.00,
    current_value: user?.publicMetadata.currentValue as number || 0.00,
    roi: user?.publicMetadata.roi as number || 0,
  }

  // console.log("User role", user?.publicMetadata.role);
  return (
    <div className="flex flex-col lg:flex-row h-full flex-1 gap-6">
      <div className="flex-1 h-full overflow-y-scroll space-y-6">
        <StatsCards stats={stats} />
        <TradingViewWidget />
        <StockOptions 
          portfolio={userPortfolio} 
          // profile={profile} 
          // fetchPortfolio={fetchUserPortfolio} 
        />
      </div>
      <div className="w-full lg:w-80 space-y-6">
        <CopyTradingOptions 
          portfolio={userPortfolio} 
          // profile={profile} 
          // fetchPortfolio={fetchUserPortfolio} 
        />
        {/*<CryptoExchange />*/}
      </div>
    </div>
  );
}
