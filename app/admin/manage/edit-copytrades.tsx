"use client";
import { useEffect, useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner"
import { Trade } from "@/types/dashboard";
import { TableSkeleton } from "@/skeletons";
import { TraderForm } from "@/components/admin-manage/admin-copytrades-form";
import { DeleteTradeDialog, EditTradeDialog } from "@/components/admin-manage/admin-editcopytrades-form";
import { truncateText, formatCurrency } from "@/lib/utils";

export default function AdminCopyTrading() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTrades, setEditingTrades] = useState<Trade | null>(null);
  const { user } = useUser();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/copytrade/manage');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setTrades(data);
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch traders from Appwrite on component mount
  useEffect(() => {
    fetchData();
  }, []);


  console.log("Trades", trades)

  const refreshTrades = async () => {
      try {
        await fetchData();
      } catch (err) {
        const error = err as Error;
        console.error("Error refreshing tokens", error);
        toast("Error", {
          description: error.message,
        });
      }
  };

  const handleAddTrade = async (
    newTrade: Omit<Trade, "id" | "user_id" | "user_name">
  ) => {
    setIsLoading(true);
    console.log("checking trade_risk", newTrade?.trade_risk);
    try {
      const response = await fetch('/api/admin/copytrade/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newTrade,
          user_id: user?.id, // Replace with actual user ID
          user_name: user?.username // Replace with actual username
        }),
      });

      const createdTrade = await response.json();
      setTrades([...trades, createdTrade]);
      toast("New Trade Added",{
        description: `Added ${newTrade?.trade_title}`,
      });
      setIsAddDialogOpen(false);
    } catch (err) {
      const error = err as Error;
      toast("Error Adding New Trade", {
        description: `Error: ${error.message}`
      });
      console.error("Failed to add trade:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTrades = async (
    updatedTrade: Omit<Trade, "user_id" | "user_name">
  ) => {
    setIsLoading(true);
    console.log("checking trade_risk", updatedTrade?.trade_risk);
    
    try {
      await fetch('/api/admin/copytrade/manage', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTrade),
      });

      setTrades(trades.map(trade => 
        trade.id === updatedTrade.id ? updatedTrade : trade
      ));
  
      toast("Trade Updated", {
        description: `Successfully updated ${updatedTrade?.trade_title}`,
      });
      setEditingTrades(null);
      setIsEditDialogOpen(false);
      await refreshTrades();
    } catch (err) {
      const error = err as Error;
      toast("Error Updating Trade", {
        description: `Error: ${error.message}`,
      });
      console.error("Failed to update trade:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteTrade = async (id: string) => {
    setIsLoading(true);
    try {
      await fetch('/api/admin/copytrade/manage', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      setTrades(trades.filter(trade => trade.id !== id));
      toast("Delete Trade", {
        description: "Deleted Trade Successfully!",
      });
    } catch (err) {
      const error = err as Error;
      toast( "Error deleting Trade", {
        description: `Error: ${error.message}`,
      });
      console.error("Failed to delete trade:", error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg md:text-2xl font-bold">
          Manage Copy Trading Options
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-appCardGold text-appDarkCard">
                <Plus className="mr-2 h-4 w-4" /> Add Trade
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Trader</DialogTitle>
              </DialogHeader>
              <TraderForm isLoading={isLoading} onSubmit={handleAddTrade} />
            </DialogContent>
          </Dialog>
        </div>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trade</TableHead>
                <TableHead>Trade Desc.</TableHead>
                <TableHead>Trade Risk</TableHead>
                <TableHead>Trade Min</TableHead>
                <TableHead>Trade Max</TableHead>
                <TableHead>Trade ROI Min(%)</TableHead>
                <TableHead>Trade ROI Max(%)</TableHead>
                <TableHead>Trade Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades?.map((trade) => (
                <TableRow key={trade?.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {truncateText(trade?.trade_title, 10)}
                    </div>
                  </TableCell>
                  <TableCell>{truncateText(trade?.trade_description, 10)}</TableCell>
                  <TableCell>{trade?.trade_risk}</TableCell>
                  <TableCell>{formatCurrency(trade?.trade_min)}</TableCell>
                  <TableCell>{formatCurrency(trade?.trade_max)}</TableCell>
                  <TableCell>{trade?.trade_roi_min}%</TableCell>
                  <TableCell>{trade?.trade_roi_max}%</TableCell>
                  <TableCell>{trade?.trade_duration}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <EditTradeDialog
                        isLoading={isLoading}
                        trades={trade}
                        isEditDialogOpen={isEditDialogOpen}
                        setIsEditDialogOpen={setIsEditDialogOpen}
                        editingTrades={editingTrades}
                        setEditingTrades={setEditingTrades}
                        handleEditTrades={handleEditTrades}
                      />
                      <DeleteTradeDialog
                        tradeId={trade?.id}
                        isLoading={isLoading}
                        handleDeleteTrade={handleDeleteTrade}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

