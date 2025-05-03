"use client";
import React, { useEffect, useState } from "react";
import AdminManageCopyTradingModal from "@/components/modals/admin-manage-copy-trading";
import { toast } from "sonner"
import { fetchCopyTradingData, updateTradeStatus } from "@/app/actions/admin/copytrade";
import type { CopyTradingOption, User } from "@/types";
import { CopyTradingTable } from "./admin-copied-trades-table";
import { fetchAllUsers } from "@/app/actions/admin/users";
import { updateUserMetadata } from "@/app/actions/role";
import { fetchTransactions } from "@/app/actions/fetchTransactions";

// export interface CopyTradingOption {fixed
//   $id: string;
//   trade_title: string;
//   trade_token: string;
//   full_name?: string;
//   trade_duration?: number;
//   trade_token_address?: string;
//   initial_investment: number;
//   trade_current_value: number;
//   trade_roi_min?: number,
//   trade_roi_max?: number,
//   isProfit: boolean;
//   user_id?: string;
//   trade_profit_loss: number;
//   trade_win_rate: number;
//   trade_risk: string;
//   copiedSince?: string;
//   $createdAt?: string;
//   trade_status: string;
// }

const AdminCopyTradingPage = () => {
  const [copyTradingOptions, setCopyTradingOptions] = useState<
    CopyTradingOption[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "profitLoss",
    direction: "desc",
  });
  const [filter, setFilter] = useState("all");
  const [selectedOption, setSelectedOption] =
    useState<CopyTradingOption | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCopyTradingData();
      console.log("copyTradingOptions", data)
      setCopyTradingOptions(data);
    } catch (error) {
      console.error("Failed to fetch copy trading data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // Fetch data from Appwrite
  useEffect(() => {
    fetchData();
  }, []);

  const [users, setUsers] = useState<User[]>([]);
  // const [transactions, setTransactions] = useState<Transaction[]>([]);
  // const [live, setLive] = useState<Live[]>([]);


  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     try {
  //       const data = await fetchTransactions(userId);
  //       setTransactions(data);
  //     } catch (error) {
  //       console.error("Error fetching transactions:", error);
  //       toast("Failed to fetch.");
  //     }
  //   };

  //   fetchData();
  // }, [userId]);

  // useEffect(() => {
  //   const fetchCryptos = async () => {
  //     try {
  //       const res = await fetch('/api/live-crypto');
  //       const data = await res.json();
  //       setLive(data);
  //     } catch (error) {
  //       console.error("Error fetching cryptos from backend:", error);
  //     }
  //   };
  
  //   fetchCryptos();
  // }, []);

  const loadUsers = async () => {
    // setIsLoading(true)
    try {
      const { data } = await fetchAllUsers()
      setUsers(data)
      console.log("Users:", data)
    } catch (error) {
      console.error('Error loading users:', error)
      toast.error('Failed to load users')
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleSort = (key: keyof CopyTradingOption) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    setCopyTradingOptions(
      [...copyTradingOptions].sort(
        (a: CopyTradingOption, b: CopyTradingOption) => {
          if ((a[key] ?? 0) < (b[key] ?? 0)) return direction === "asc" ? -1 : 1;
          if ((a[key] ?? 0) > (b[key] ?? 0)) return direction === "asc" ? 1 : -1;
          return 0;
        }
      )
    );
  };

  const handleFilter = (value: string) => {
    setFilter(value);
  };

  const filteredOptions =
    filter === "all"
      ? copyTradingOptions
      : copyTradingOptions.filter(
          (option) => option.trade_risk.toLowerCase() === filter
        );

  const handleManage = (option: CopyTradingOption) => {
    setSelectedOption(option);
    setIsManageModalOpen(true);
  };

  const handleUpdateTradeStatus = async (tradeId: string, status: string, option: CopyTradingOption) => {
    console.log("tradeId", tradeId)
    try {
      // Convert status to lowercase for case-insensitive comparison
      const normalizedStatus = status.toLowerCase();
  
      // Only proceed with financial calculations if status is "approved"
      if (normalizedStatus === 'approved') {
        const user = users.find(u => u.id === option.user_id);
        
        if (user) {
          const currentMetadata = user.publicMetadata || {};
          const currentTotalInvestment = Number(currentMetadata.totalInvestment) || 0;
          const currentValue = Number(currentMetadata.currentValue) || 0;
          const initialInvestment = Number(option.initial_investment) || 0;
  
          // Calculate new values
          const newTotalInvestment = currentTotalInvestment - initialInvestment;

          const roiMultiplier = option.isProfit 
            ? (option.trade_roi_max || 0) 
            : (option.trade_roi_min || 0);
          console.log("roiMultiplier", roiMultiplier)
          console.log("option.isProfit", option.isProfit)

          const profitLossAmount = initialInvestment * (roiMultiplier / 100);
          console.log("profitLossAmount", profitLossAmount)

          const newCurrentValue = option?.isProfit ? currentValue + profitLossAmount : currentValue - profitLossAmount;
          console.log("newTotalInvestment", newTotalInvestment)
          console.log("newCurrentValue", newCurrentValue)
  
          // // Update user metadata
          await updateUserMetadata({
            userId: user.id,
            metadata: {
              ...currentMetadata,
              totalInvestment: newTotalInvestment,
              currentValue: newCurrentValue,
              role: user.publicMetadata?.role as "admin" | "user" | undefined
            }
          });

          const transactions = await fetchTransactions(user?.id);
          console.log("Transactions", transactions)
        }
      }
  
      // For "rejected" status, only update the trade status without financial changes
      if (normalizedStatus === 'rejected') {
        // No financial calculations - just proceed to updateTradeStatus
      }
  
      // Update the trade status (for both approved and rejected)
      await updateTradeStatus(tradeId, status, option?.trade_duration);
  
      // Update local state
      setCopyTradingOptions(prevTrade =>
        prevTrade.map(trade =>
          trade.$id === tradeId ? { ...trade, trade_status: status } : trade
        )
      );
  
      toast.success(`Trade status updated to ${status}`);
      
    } catch (error) {
      console.error("Error updating trade status:", error);
      toast.error("Failed to update trade status. Please try again.");
    }
  };


  return (
    <div className="flex h-full justify-center items-center w-full">
      <CopyTradingTable
        isLoading={isLoading}
        filteredOptions={filteredOptions}
        sortConfig={sortConfig}
        handleFilter={handleFilter}
        handleSort={handleSort}
        handleUpdateTradeStatus={handleUpdateTradeStatus}
        handleManage={handleManage}
        fetchCopyTradingData={fetchData}
      />
      {selectedOption !== null && (
        <AdminManageCopyTradingModal
          isOpen={isManageModalOpen}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          onClose={() => setIsManageModalOpen(false)}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
      )}
    </div>
  );
};

export default AdminCopyTradingPage;
