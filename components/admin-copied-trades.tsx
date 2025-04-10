"use client";
import React, { useEffect, useState } from "react";
import AdminManageCopyTradingModal from "@/components/modals/admin-manage-copy-trading";
import { toast } from "sonner"
import { fetchCopyTradingData, updateTradeStatus } from "@/app/actions/admin/copytrade";
import type { CopyTradingOption } from "@/types";
import { CopyTradingTable } from "./admin-copied-trades-table";

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

  const handleUpdateTradeStatus = async (tradeId: string, status: string) => {
    try {
      await updateTradeStatus(tradeId, status);
      setCopyTradingOptions((prevTrade) =>
        prevTrade.map((trade) =>
          trade.$id === tradeId ? { ...trade, trade_status: status } : trade
        )
      );
      toast("Success", {
        description: `Trade status updated to ${status}.`,
      });
    } catch (error) {
      console.error("Error updating trade status:", error);
      toast("Error", {
        description: "Failed to update trade status. Please try again.",
      });
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
