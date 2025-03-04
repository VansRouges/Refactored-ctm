"use client";
// import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { databases, ID } from "@/lib/appwrite";
import ENV from "@/constants/env";
// import { useProfile } from "@/app/context/ProfileContext";
import { RootState } from "@/store/store";
import { clearStockOption } from "@/store/stockOptionsSlice";
import { clearCopyTrade } from "@/store/copyTradeSlice";
import { type Hex, parseEther } from "viem";
import { type BaseError, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import DepositFunds from "@/components/user-deposit/DepositFunds";
import type { DepositCryptocurrency} from "@/types";
import { useUser } from "@clerk/nextjs";
import { fetchCryptocurrencies } from "@/app/actions/deposit";
import { createStockPurchase } from "@/app/actions/stockPurchase";
import { createCopyTrade } from "@/app/actions/copytrade";

const depositSchema = z.object({
  currency: z.string().nonempty("Please select a cryptocurrency."),
  amount: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().positive("Amount must be a positive number.")
  ),
});

const Deposit = () => {
  const { user } = useUser();
  const dispatch = useDispatch();
  const stockOption = useSelector((state: RootState) => state.stockOption);
  const copyTrade = useSelector((state: RootState) => state.copyTrade);
  const { data: hash, error, sendTransaction } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  const [cryptocurrencies, setCryptocurrencies] = useState<{ id: string; name: string; value: string; address: string }[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
//   const { profile } = useProfile();

  const form = useForm({
    resolver: zodResolver(depositSchema),
    defaultValues: { currency: "", amount: 0 },
  });

  useEffect(() => {
    const getCryptocurrencies = async () => {
      try {
        const response = await fetchCryptocurrencies();
        setCryptocurrencies(response);
      } catch (error) {
        console.error("Error fetching cryptocurrencies:", error);
        toast("Error", {
          description: "Failed to fetch cryptocurrency data.",
        });
      }
    };

    getCryptocurrencies();
  }, [toast]);

  interface FormData {
    currency: string;
    amount: number;
  }

  const onSubmit = async (data: FormData) => {
    const to: Hex = selectedAddress as Hex;
    const value = parseEther(data.amount.toString());
    sendTransaction({ to, value });
    setIsLoading(true);
  };

  const baseError = error as BaseError || undefined;
  const tranHash = hash || undefined;

  useEffect(() => {
    if (isConfirmed) {
      const handleTransactionSuccess = async () => {
        try {
          const transactionPayload = {
            token_name: form.getValues().currency,
            isWithdraw: false,
            isDeposit: true,
            status: "pending",
            amount: form.getValues().amount,
            token_deposit_address: selectedAddress,
            user_id: user?.id,
            full_name: user?.fullName,
          };

          await databases.createDocument(
              ENV.databaseId,
              ENV.collections.transactions,
              ID.unique(),
              transactionPayload
          );

          // Conditionally include stock data if available
          const stockPurchasePayload =
              stockOption?.stock && stockOption.stock.symbol.trim() !== ""
                  ? {
                    stock_symbol: stockOption.stock.symbol,
                    stock_name: stockOption.stock.name,
                    stock_quantity: stockOption.stock.quantity || 1,
                    stock_initial_value: stockOption.stock.total,
                    stock_initial_value_pu: stockOption.stock?.price,
                    stock_change: stockOption.stock.change,
                    stock_current_value: 0.0,
                    stock_total_value: 0.0,
                    stock_profit_loss: 0.0,
                    isProfit: false,
                    isMinus: stockOption.stock.isMinus,
                    stock_value_entered: form.getValues().amount,
                    stock_token: form.getValues().currency,
                    stock_token_address: selectedAddress,
                    stock_status: "pending",
                    isTrading: false,
                    user_id: user?.id,
                    full_name: user?.fullName,
                  }
                  : null;

          // Conditionally include copytrade data if available
          const copyTradePayload =
              copyTrade?.copy && copyTrade.copy.title.trim() !== ""
                  ? {
                    trade_title: copyTrade?.copy?.title,
                    trade_min: copyTrade?.copy?.trade_min,
                    trade_max: copyTrade?.copy?.trade_max,
                    trade_roi_min: copyTrade?.copy?.trade_roi_min,
                    trade_roi_max: copyTrade?.copy?.trade_roi_max,
                    trade_win_rate: 0.0,
                    trade_risk: copyTrade?.copy?.trade_risk,
                    trade_current_value: 0.0,
                    trade_profit_loss: 0.0,
                    isProfit: false,
                    initial_investment: form.getValues().amount,
                    trade_token: form.getValues().currency,
                    trade_token_address: selectedAddress,
                    trade_status: "pending",
                    user_id: user?.id,
                    full_name: user?.fullName,
                  }
                  : null;

          if (stockPurchasePayload) {
            // await databases.createDocument(
            //     ENV.databaseId,
            //     ENV.collections.stockOptionsPurchases,
            //     ID.unique(),
            //     stockPurchasePayload
            // );
            createStockPurchase(stockPurchasePayload)
          }

          if (copyTradePayload) {
            // await databases.createDocument(
            //     ENV.databaseId,
            //     ENV.collections.copyTradingPurchases,
            //     ID.unique(),
            //     copyTradePayload
            // );
            createCopyTrade(copyTradePayload)
          }
        } catch (err) {
          const error = err as Error
          toast("Error", { description: `Failed to create transaction.${error.message}` });
        } finally {
          setIsLoading(false);
          dispatch(clearStockOption());
          dispatch(clearCopyTrade());
        }
      };
      handleTransactionSuccess();
    }
  }, [isConfirmed, copyTrade.copy, dispatch, form, user?.fullName, user?.id, selectedAddress, stockOption.stock, toast]);


  const handleCurrencyChange = (currency: string) => {
    const selectedCrypto: DepositCryptocurrency | undefined = cryptocurrencies.find(crypto => crypto.value === currency);
    setSelectedAddress(selectedCrypto?.address || "");
    form.setValue("currency", currency);
  };

  const handleCopyAddress = async () => {
    if (selectedAddress) {
      try {
        await navigator.clipboard.writeText(selectedAddress);
        toast("Copied!", { description: "Wallet address has been copied to clipboard." });
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        const error = err as Error
        toast("Copy failed", { description: `${error.message}` });
      }
    }
  };

  return (
    <DepositFunds
      form={form}
      cryptocurrencies={cryptocurrencies}
      selectedAddress={selectedAddress}
      handleCurrencyChange={handleCurrencyChange}
      onSubmit={onSubmit}
      isLoading={isLoading || isConfirming}
      stockOption={stockOption}
      copyTrade={copyTrade}
      baseError={baseError}
      tranHash={tranHash || ""}
    />
  );
};

export default Deposit;
