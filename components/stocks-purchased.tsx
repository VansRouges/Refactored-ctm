"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown, RefreshCw } from "lucide-react";
import { TableSkeleton } from "@/skeletons";
import { useUser } from "@clerk/nextjs";
import { fetchPurchasedStocks } from "@/app/actions/fetchPurchasedStocks";
import { createCopyStockTrade } from "@/app/actions/copyStockTrade";
import { toast } from "sonner"
import { updateCreateStock } from "@/app/actions/stockPurchase";

interface Stock {
  $id: string;
  stock_symbol: string;
  stock_name: string;
  stock_quantity: number;
  stock_initial_value: number;
  stock_initial_value_pu: number;
  stock_current_value: number;
  stock_status: string;
  isProfit: boolean;
  stock_profit_loss: number;
  stock_change: number;
  isMinus: boolean;
  isTrading: boolean;
}

const StockPage = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const { user } = useUser()
  const user_id = user?.id || "";
  const [sortConfig, setSortConfig] = useState({
    key: "symbol",
    direction: "asc",
  });
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [creatingTrade, setCreatingTrade] = useState(false);

  const getPurchasedStocks = useCallback(async () => {
    setIsLoading(true);
    try {
      const purchasedStocks = await fetchPurchasedStocks(user_id);
      setStocks(purchasedStocks);
    } catch (error) {
      console.error("Error fetching purchased stocks:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user_id])

  useEffect(() => {
  
    getPurchasedStocks();
  }, [user_id, getPurchasedStocks]);

  const handleSort = (key: keyof Stock) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    setStocks((prevStocks) =>
      [...prevStocks].sort((a: Stock, b: Stock) => {
        if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
        if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
        return 0;
      })
    );
  };

  const handleFilter = (value: string) => {
    setFilter(value);
  };

  const filteredStocks =
    filter === "all"
      ? stocks
      : stocks.filter((stock: Stock) => {
          const totalValue = stock.stock_current_value * stock.stock_quantity;
          const purchaseValue = stock.stock_initial_value;
          const percentageChange =
            ((totalValue - purchaseValue) / purchaseValue) * 100;

          if (filter === "gainers") return percentageChange > 0;
          if (filter === "losers") return percentageChange < 0;
          return true;
        });

  const calculateTotalValue = (stock: Stock) => {
    const quantity = stock.stock_quantity || 0
    const current_value = stock.stock_current_value || 0
    return Number((quantity * current_value).toFixed(2)); // Returns a number instead of a string
  };

  console.log("Stocks", stocks)

  const handleCopyTrade = async (stock: Stock) => {
    setCreatingTrade(true)
    try{
      createCopyStockTrade({
        initial_investment: stock?.stock_initial_value,
        trade_min: 0,
        trade_max: 0,
        trade_roi_min : 0,
        trade_roi_max : 0,
        trade_risk : "medium",
        isProfit: stock?.isProfit,
        trade_current_value: 0,
        trade_title: stock?.stock_symbol,
        trade_token: "stock",
        trade_token_address: "stock",
        trade_status: "approved",
        trade_profit_loss: stock?.stock_profit_loss,
        trade_win_rate: 0,
        full_name: user?.fullName,
        user_id: user?.id
      })
      const isTrading: boolean = true
      updateCreateStock(stock?.$id, isTrading)
      toast.success("Copy Trade Created")
      getPurchasedStocks()
    } catch(err){
      console.error("Error creating copy trade:", err);
      toast.error("Error creating copy trade")
    } finally {
      setCreatingTrade(false)
      getPurchasedStocks()
    }
  }

  return (
    <div className="flex h-full justify-center items-center w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="w-full"
      >
        <Card>
          <CardHeader className="flex w-full flex-col sm:flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold">Your Portfolio</CardTitle>
            <div className="flex w-full flex-col sm:flex-row items-center gap-2 sm:gap-0 sm:space-x-4">
              <Select className="w-full sm:w-max" onValueChange={handleFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter stocks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stocks</SelectItem>
                  <SelectItem value="gainers">Gainers</SelectItem>
                  <SelectItem value="losers">Losers</SelectItem>
                </SelectContent>
              </Select>
              <Button
                className="bg-appCardGold w-full sm:w-max"
                onClick={() => getPurchasedStocks()}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Prices
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      onClick={() => handleSort("stock_symbol")}
                      className="cursor-pointer"
                    >
                      Symbol{" "}
                      {sortConfig.key === "stock_symbol" && (
                        <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                      )}
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("stock_name")}
                      className="cursor-pointer"
                    >
                      Name{" "}
                      {sortConfig.key === "stock_name" && (
                        <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                      )}
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("stock_quantity")}
                      className="cursor-pointer"
                    >
                      Quantity{" "}
                      {sortConfig.key === "stock_quantity" && (
                        <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                      )}
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("stock_initial_value")}
                      className="cursor-pointer"
                    >
                      Ini. Total Value{" "}
                      {sortConfig.key === "stock_initial_value" && (
                        <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                      )}
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("stock_current_value")}
                      className="cursor-pointer"
                    >
                      Initial Value(pu){" "}
                      {sortConfig.key === "stock_current_values" && (
                        <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                      )}
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("stock_current_value")}
                      className="cursor-pointer"
                    >
                      Current Value(pu){" "}
                      {sortConfig.key === "stock_current_values" && (
                        <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                      )}
                    </TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Profit/Loss</TableHead>
                    <TableHead>% Change</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStocks.map((stock: Stock) => (
                    <TableRow key={stock?.$id}>
                      <TableCell className="font-medium">
                        {stock?.stock_symbol}
                      </TableCell>
                      <TableCell>{stock?.stock_name}</TableCell>
                      <TableCell>{stock?.stock_quantity}</TableCell>
                      <TableCell>
                        ${Number(stock?.stock_initial_value || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        ${Number(stock?.stock_initial_value_pu || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {stock?.stock_status == "pending" ? (
                          <span className="bg-yellow-400 rounded-xl animate-pulse p-2 text-white">
                            Processing
                          </span>
                        ) : stock?.stock_status == "rejected" ? (
                          <span className="bg-red-400 rounded-xl animate-pulse p-2 text-white">
                            Rejected
                          </span>
                        ) : (
                          `$${stock?.stock_current_value ? stock.stock_current_value.toFixed(2) : "0.00"}`
                        )}
                      </TableCell>
                      <TableCell>
                        {stock?.stock_status == "pending" ? (
                          <span className="bg-yellow-400 rounded-xl animate-pulse p-2 text-white">
                            Processing
                          </span>
                        ) : stock?.stock_status == "rejected" ? (
                          <span className="bg-red-400 rounded-xl animate-pulse p-2 text-white">
                            Rejected
                          </span>
                        ) : (
                          `${calculateTotalValue(stock)}`
                        )}
                      </TableCell>
                      <TableCell>
                        {stock?.stock_status == "pending" ? (
                          <span className="bg-yellow-400 rounded-xl animate-pulse p-2 text-white">
                            Processing
                          </span>
                        ) : stock?.stock_status == "rejected" ? (
                          <span className="bg-red-400 rounded-xl animate-pulse p-2 text-white">
                            Rejected
                          </span>
                        ) : (
                          <span
                            className={
                              stock?.isProfit
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            ${stock?.stock_profit_loss ? stock.stock_profit_loss.toFixed(2) : "0.00"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {stock?.stock_status == "pending" ? (
                          <span className="bg-yellow-400 rounded-xl animate-pulse p-2 text-white">
                            Processing
                          </span>
                        ) : stock?.stock_status == "rejected" ? (
                          <span className="bg-red-400 rounded-xl animate-pulse p-2 text-white">
                            Rejected
                          </span>
                        ) : (
                          <span
                            className={
                              stock?.isMinus ? "text-green-600" : "text-red-600"
                            }
                          >
                            {stock?.stock_change ? stock.stock_change.toFixed(2) : "0.00"}%
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {stock?.stock_status === "approved" && (
                          <Button 
                            className="bg-appCardGold w-full sm:w-max"
                            disabled={creatingTrade}
                            onClick={() => {
                              if (!stock?.isTrading) {
                                handleCopyTrade(stock);
                              }
                            }}
                          >
                            {stock?.isTrading ? "View Trade" : "Copy Trade"}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default StockPage;
