"use client";
import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    // DialogDescription
} from "@/components/ui/dialog";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"
import { updateTrade } from "@/app/actions/admin/copytrade";
// import { formatCurrency } from "@/lib/utils";

interface AdminManageCopyTradingModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedOption: {
        trade_status: string;
        trade_current_value: number;
        trade_profit_loss: number;
        trade_win_rate: number;
        isProfit: boolean;
        $id: string;
        full_name?: string;
        initial_investment: number;
        trade_title: string;
        trade_token: string;
        trade_token_address?: string;
        copiedSince?: string;
        $createdAt?: string;
        trade_risk: string;
    };
    setSelectedOption: (option: AdminManageCopyTradingModalProps['selectedOption']) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

const AdminManageCopyTradingModal: React.FC<AdminManageCopyTradingModalProps> = ({ isOpen, onClose, selectedOption, setSelectedOption, isLoading, setIsLoading }) => {
    const isDisabled = selectedOption?.trade_status === "pending" || selectedOption?.trade_status === "rejected";
    console.log("Selected Trade Option", selectedOption);

    const handleSave = async () => { 
        setIsLoading(true);
    
        const validTradeCurrentValue = parseFloat(selectedOption?.trade_current_value.toString());
        const validTradeProfitLoss = parseFloat(selectedOption?.trade_profit_loss.toString());
        const validTradeWinRate = parseFloat(selectedOption?.trade_win_rate.toString());
    
        if (isNaN(validTradeCurrentValue)) {
          console.error("Invalid trade_current_value:", selectedOption?.trade_current_value);
          toast("Error", {
            description: "Trade current value must be a valid number.",
          });
          return;
        }
        if (isNaN(validTradeProfitLoss)) {
          console.error("Invalid trade_profit_loss:", selectedOption?.trade_profit_loss);
          toast("Error", {
            description: "Trade profit/loss must be a valid number.",
          });
          return;
        }
        if (isNaN(validTradeWinRate)) {
          console.error("Invalid trade_win_rate:", selectedOption?.trade_win_rate);
          toast("Error", {
            description: "Trade win rate must be a valid number.",
          });
          return;
        }
    
        try {
          const updatedFields = {
            trade_current_value: validTradeCurrentValue,
            trade_profit_loss: validTradeProfitLoss,
            isProfit: selectedOption.isProfit,
            trade_win_rate: validTradeWinRate,
          };
    
          await updateTrade(selectedOption.$id, updatedFields);
    
          toast("Success", {
            description: "Trade updated successfully.",
          });
          console.log("Trade updated successfully:", updatedFields);
          onClose();
        } catch (error) {
          console.error("Error updating trade:", error);
          toast("Error", {
            description: "Failed to update trade. Please try again.",
          });
        } finally {
          setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {
                            selectedOption?.trade_status === "pending" ? "View Details"
                                : selectedOption?.trade_status === "rejected" ? "View Details"
                                    : "Manage Trade"
                        }
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label>Trade Title</Label>
                        <Input value={selectedOption?.trade_title} readOnly className="bg-gray-100" />
                    </div>
                    {/* <div>
                        <Label>Trade</Label>
                        <Input value={selectedOption?.full_name} readOnly className="bg-gray-100" />
                    </div> */}
                    <div>
                        <Label>Initial Investment</Label>
                        <Input
                            value={`$${selectedOption?.initial_investment.toFixed(2)}`}
                            readOnly
                            className="bg-gray-100"
                        />
                    </div>
                    <div>
                        <Label>Current Value</Label>
                        <Input
                            value={selectedOption?.trade_current_value || 0}
                            onChange={(e) =>
                                setSelectedOption({
                                    ...selectedOption,
                                    trade_current_value: parseFloat(e.target.value) || 0,
                                })
                            }
                            type="number"
                        />
                    </div>
                    <div>
                        <Label>Profit/Loss</Label>
                        <Input
                            value={selectedOption?.trade_profit_loss || ""}
                            onChange={(e) =>
                                setSelectedOption({
                                    ...selectedOption,
                                    trade_profit_loss: parseFloat(e.target.value) || 0,
                                })
                            }
                        />
                    </div>
                    <div>
                        <Label>Profit Status (isProfit)</Label>
                        <Select
                            onValueChange={(value) =>
                                setSelectedOption({
                                    ...selectedOption,
                                    isProfit: value === "true",
                                })
                            }
                            value={selectedOption?.isProfit ? "true" : "false"}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Bullish</SelectItem>
                                <SelectItem value="false">Bearish</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Risk Level</Label>
                        <Input
                            value={selectedOption?.trade_risk}
                            readOnly
                            className="bg-gray-100"
                        />
                    </div>
                    {/* <div>
                        <Label>Win Rate</Label>
                        <Input
                            value={selectedOption?.trade_win_rate || ""}
                            onChange={(e) =>
                                setSelectedOption({
                                    ...selectedOption,
                                    trade_win_rate: parseFloat(e.target.value) || 0,
                                })
                            }
                        />
                    </div> */}
                    <div>
                        <Label>Status</Label>
                        <Input
                            value={selectedOption?.trade_status}
                            readOnly
                            className="bg-gray-100"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button disabled={isDisabled || isLoading} onClick={handleSave}>
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AdminManageCopyTradingModal;
