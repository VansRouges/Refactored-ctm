"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hook";
import { setStockOption } from "@/store/stockOptionsSlice";
import { toast } from "sonner"
import { TableSkeleton } from "@/skeletons";
import { StockModal } from "./user-deposit/stock-modal";
import { Stock } from "@/types";
import { useUser } from "@clerk/nextjs";
import { fetchStocks } from "@/app/actions/fetch-stocks";
import { createStockPurchase } from "@/app/actions/stockPurchase";


export function StockOptions({ portfolio }:
  { 
    portfolio: { total_investment: number, current_value: number, roi: number }, 
  }
) {
  const { user } = useUser()
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [showAlertDialog, setShowAlertDialog] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const getStocks = async () => {
      setIsLoading(true);
      try {
        const stocksData = await fetchStocks();
        setStocks(stocksData);
      } catch (error) {
        console.error("Failed to fetch stocks:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    getStocks();
  }, []);

  const handleQuantityChange = (id: string, quantity: string) => {
    setQuantities({ ...quantities, [id]: parseInt(quantity) || 0 });
  };

  const handlePurchase = (stock: Stock) => {
    const quantity = quantities[stock.id] || 0;
    const total = quantity * stock.price;
    const total_investment = portfolio?.total_investment ?? 0;
    try {
      if (quantity > 0 && total_investment < total) {
        const difference = total - total_investment;
        dispatch(
          setStockOption({
            name: stock.name,
            symbol: stock.symbol,
            price: stock.price,
            change: stock.change,
            isMinus: stock.isMinus,
            quantity,
            total: difference,
          })
        );

        toast("Purchase initiated!", {
          description: `Deposit $${total.toFixed(2)} to complete the transaction.`,
        });

        router.push("/dashboard/deposit");
      } else{
        setSelectedStock(stock)
        setShowAlertDialog(true)
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error in handlePurchase:", error);
    }
  };

  const handleStockModalPurchase = async () => {
    if (!selectedStock) return; // Ensure selectedStock is not null before proceeding

    const quantity = quantities[selectedStock.id] || 0;
    const total = quantity * (selectedStock.price ?? 0);
    const total_investment = portfolio?.total_investment ?? 0;
    if (!selectedStock || total > total_investment) return;
    try {
      createStockPurchase({
        data: selectedStock,
        user_id: user?.id,
        full_name: user?.fullName,
        stock_initial_value: total,
        stock_value_entered: 0.0,
        stock_token: "fromBalance",
        stock_quantity: quantities[selectedStock.id] || 1,
        stock_status: "approved",
        stock_token_address: "fromBalance",
      })

      const newTotalInvestment = portfolio.total_investment - total;
      console.log("New total investment:", newTotalInvestment);
      // await databases.updateDocument(
      //   ENV.databaseId,
      //   ENV.collections.profile,
      //   user?.id || "",
      //   { total_investment: newTotalInvestment }
      // );
      setShowAlertDialog(false);
      setSelectedStock(null);
      setShowSuccessMessage(true)
      toast("Stock Purchased!", { description: "Thank you for your purchase!" });
    } catch (error) {
      console.error("Error purchasing stock:", error);
      toast("Error purchasing stock!", { description: "Please try again later." });
    }
  };


  return (
  <>
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Stock Options</CardTitle>
        <CardDescription>View and purchase available stocks</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stocks?.map((stock) => (
                <TableRow key={stock.id}>
                  <TableCell className="font-medium">{stock.symbol}</TableCell>
                  <TableCell>{stock.name}</TableCell>
                  <TableCell>${stock.price.toFixed(2)}</TableCell>
                  <TableCell
                    className={
                      stock.isMinus ? "text-green-600" : "text-red-600"
                    }
                  >
                    {stock.change >= 0 ? (
                      <TrendingUp className="inline mr-1" />
                    ) : (
                      <TrendingDown className="inline mr-1" />
                    )}
                    {stock.change.toFixed(2)}%
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      value={quantities[stock.id] || ""}
                      onChange={(e) =>
                        handleQuantityChange(stock.id, e.target.value)
                      }
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handlePurchase(stock)}
                      disabled={!quantities[stock.id]}
                      className="bg-appCardGold disabled:bg-gray-500"
                    >
                      <DollarSign className="mr-1 h-4 w-4" />
                      Buy
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Stock prices are delayed by 15 minutes and are for trading
          informational purposes only.
        </p>
      </CardFooter>
    </Card>

    {selectedStock && 
      <StockModal
        selectedStock={selectedStock}
        showAlertDialog={showAlertDialog}
        setShowAlertDialog={setShowAlertDialog}
        showSuccessMessage={showSuccessMessage}
        setShowSuccessMessage={setShowSuccessMessage}
        handleStockModalPurchase={handleStockModalPurchase}
        quantity={quantities[selectedStock.id] || 0}
      />
    }
  </>
  );
}
