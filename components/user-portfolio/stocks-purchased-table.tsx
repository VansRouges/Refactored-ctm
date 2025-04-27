import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

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

interface StockTableProps {
  filteredStocks: Stock[];
  sortConfig: { key: string; direction: string };
  handleSort: (key: keyof Stock) => void;
  calculateTotalValue: (stock: Stock) => number;
  handleCopyTrade: (stock: Stock) => void;
  creatingTrade: boolean;
}

export function StockTable({
  filteredStocks,
  sortConfig,
  handleSort,
  calculateTotalValue,
  handleCopyTrade,
  creatingTrade
}: StockTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead onClick={() => handleSort("stock_symbol")} className="cursor-pointer">
            Symbol{" "}
            {sortConfig.key === "stock_symbol" && (
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            )}
          </TableHead>
          <TableHead onClick={() => handleSort("stock_name")} className="cursor-pointer">
            Name{" "}
            {sortConfig.key === "stock_name" && (
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            )}
          </TableHead>
          <TableHead onClick={() => handleSort("stock_quantity")} className="cursor-pointer">
            Quantity{" "}
            {sortConfig.key === "stock_quantity" && (
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            )}
          </TableHead>
          <TableHead onClick={() => handleSort("stock_initial_value")} className="cursor-pointer">
            Ini. Total Value{" "}
            {sortConfig.key === "stock_initial_value" && (
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            )}
          </TableHead>
          <TableHead onClick={() => handleSort("stock_initial_value_pu")} className="cursor-pointer">
            Initial Value(pu){" "}
            {sortConfig.key === "stock_initial_value_pu" && (
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            )}
          </TableHead>
          <TableHead onClick={() => handleSort("stock_current_value")} className="cursor-pointer">
            Current Value(pu){" "}
            {sortConfig.key === "stock_current_value" && (
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
            <TableCell className="font-medium">{stock?.stock_symbol}</TableCell>
            <TableCell>{stock?.stock_name}</TableCell>
            <TableCell>{stock?.stock_quantity}</TableCell>
            <TableCell>${Number(stock?.stock_initial_value || 0).toFixed(2)}</TableCell>
            <TableCell>${Number(stock?.stock_initial_value_pu || 0).toFixed(2)}</TableCell>
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
                <span className={stock?.isProfit ? "text-green-600" : "text-red-600"}>
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
                <span className={stock?.isMinus ? "text-green-600" : "text-red-600"}>
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
  );
}