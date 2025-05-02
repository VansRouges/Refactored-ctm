"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RefreshCw, ArrowUpDown, TrendingUp, TrendingDown, Check, X } from "lucide-react";
import { TableSkeleton } from "@/skeletons";
import { CopyTradingOption } from "@/types"; // Define this type if not already defined
import { formatCurrency } from "@/lib/utils";

interface CopyTradingTableProps {
  isLoading: boolean;
  filteredOptions: CopyTradingOption[];
  sortConfig: { key: string; direction: string };
  handleFilter: (value: string) => void;
  handleSort: (key: keyof CopyTradingOption) => void;
  handleUpdateTradeStatus: (tradeId: string, status: string, option: CopyTradingOption) => void;
  handleManage: (option: CopyTradingOption) => void;
  fetchCopyTradingData: () => void;
}

export const CopyTradingTable = ({
  isLoading,
  filteredOptions,
  sortConfig,
  handleFilter,
  handleSort,
  handleUpdateTradeStatus,
  handleManage,
  fetchCopyTradingData,
}: CopyTradingTableProps) => {

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="w-full"
    >
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between">
          <CardTitle className="text-xl sm:text-2xl font-bold">
            Admin Copy Trading Options
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0 w-full space-x-4">
            <Select className="w-full sm:w-max" onValueChange={handleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="bg-appCardGold sm:w-max w-full"
              onClick={fetchCopyTradingData}
              disabled={isLoading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 transition-transform duration-500 ${
                  isLoading ? "animate-spin" : ""
                }`}
              />
              {isLoading ? "Refreshing..." : "Refresh Data"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="">
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <div className="overflow-y-auto max-h-[370px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    {[
                      { label: "Trade", key: "trade_title" },
                      { label: "Initial Investment", key: "initial_investment" },
                      { label: "Current Value", key: "trade_current_value" },
                      { label: "Profit/Loss %", key: "trade_profit_loss" },
                      // { label: "Win Rate %", key: "trade_win_rate" },
                      { label: "Risk Level", key: "trade_risk" },
                      { label: "Copied Since", key: "copiedSince" },
                      { label: "Status", key: "trade_status" },
                    ].map((column) => (
                      <TableHead
                        key={column.key}
                        onClick={() =>
                          handleSort(column.key as keyof CopyTradingOption)
                        }
                        className="cursor-pointer"
                      >
                        {column.label}{" "}
                        {sortConfig.key === column.key && (
                          <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                        )}
                      </TableHead>
                    ))}
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOptions.map((option) => (
                    <TableRow key={option?.$id}>
                      <TableCell className="font-medium">
                        {option?.trade_title}
                      </TableCell>
                      <TableCell>
                        {option.trade_token === "USDT" || "fromBalance"
                          ? formatCurrency(option?.initial_investment)
                          : option?.initial_investment}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(option?.trade_current_value)}
                      </TableCell>
                      <TableCell
                        className={
                          option?.isProfit ? "text-green-600" : "text-red-600"
                        }
                      >
                        {option?.isProfit ? (
                          <TrendingUp className="inline mr-1" />
                        ) : (
                          <TrendingDown className="inline mr-1" />
                        )}
                        {option?.trade_profit_loss}%
                      </TableCell>
                      {/* <TableCell>{option?.trade_win_rate}%</TableCell> */}
                      <TableCell>
                        <span
                          className={`px-2 py-1 capitalize rounded-full text-xs ${
                            option?.trade_risk === "low"
                              ? "bg-green-200 text-green-800"
                              : option.trade_risk === "Medium"
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-red-200 text-red-800"
                          }`}
                        >
                          {option?.trade_risk}
                        </span>
                      </TableCell>
                      <TableCell>{option.copiedSince}</TableCell>
                      <TableCell>
                        {option.trade_status === "rejected" ? (
                          <span className="badge bg-red-500 rounded-xl p-2 text-white">
                            Rejected
                          </span>
                        ) : option.trade_status === "pending" ? (
                          <span className="badge bg-yellow-500 rounded-xl p-2 text-white">
                            Pending
                          </span>
                        ) : (
                          <span className="badge bg-green-500 rounded-xl p-2 text-white">
                            Approved
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="flex items-center space-x-2">
                        {option.trade_status === "pending" && (
                          <>
                            <Button
                              onClick={() => {
                                if (
                                  confirm(
                                    "Are you sure you want to approve this Trade?"
                                  )
                                ) {
                                  handleUpdateTradeStatus(option.$id, "approved", option);
                                }
                              }}
                              className="text-white bg-green-500 hover:bg-green-800"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => {
                                if (
                                  confirm(
                                    "Are you sure you want to reject this trade?"
                                  )
                                ) {
                                  handleUpdateTradeStatus(option.$id, "rejected", option);
                                }
                              }}
                              className="text-white bg-red-500 hover:bg-red-800"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleManage(option)}
                        >
                          {option.trade_status === "pending"
                            ? "View Details"
                            : option?.trade_status === "rejected"
                            ? "View Details"
                            : "Manage Trade"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};