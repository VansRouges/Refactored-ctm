"use client";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { clearStockOption } from "@/store/stockOptionsSlice";
import { clearCopyTrade } from "@/store/copyTradeSlice";
import { type Hex, parseEther } from "viem";
import { type BaseError, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import DepositFunds from "@/components/user-deposit/DepositFunds";
import type { DepositCryptocurrency} from "@/types";
import { useUser } from "@clerk/nextjs";
import { fetchCryptocurrencies } from "@/app/actions/fetch-crypto";
// import { createStockPurchase } from "@/app/actions/stockPurchase";
// import { createCopyTrade } from "@/app/actions/copytrade";
import { createDeposit } from "@/app/actions/deposit";

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
  const [isLoading, setIsLoading] = useState(false);

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
  }, []);

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
          await createDeposit({
            token_name: form.getValues().currency,
            amount: form.getValues().amount,
            token_deposit_address: selectedAddress,
            user_id: user?.id,
            full_name: user?.fullName,
          });

          // Conditionally include stock data if available
          // if (stockOption?.stock) {
          //   createStockPurchase({
          //     data: stockOption?.stock,
          //     user_id: user?.id,
          //     stock_initial_value:  stockOption.stock.total,
          //     full_name: user?.fullName,
          //     stock_value_entered: form.getValues().amount,
          //     stock_token: form.getValues().currency,
          //     stock_quantity: stockOption?.stock?.total,
          //     stock_status: "pending",
          //     stock_token_address: selectedAddress,
          //   })
          // }

          // if (copyTrade?.copy) {
          //   createCopyTrade({ 
          //     data: copyTrade?.copy, 
          //     trade_title: copyTrade?.copy.title,
          //     user_id: user?.id, 
          //     full_name: user?.fullName,
          //     initial_investment: form.getValues().amount,
          //     trade_token: form.getValues().currency,
          //     trade_token_address: selectedAddress,
          //     trade_status: "pending"              
          //   })
          // }

          console.log("isConfirmed", isConfirmed)
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
  }, [isConfirmed, copyTrade.copy, dispatch, form, user?.fullName, user?.id, selectedAddress, stockOption.stock]);


  const handleCurrencyChange = (currency: string) => {
    const selectedCrypto: DepositCryptocurrency | undefined = cryptocurrencies.find(crypto => crypto.value === currency);
    setSelectedAddress(selectedCrypto?.address || "");
    form.setValue("currency", currency);
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
