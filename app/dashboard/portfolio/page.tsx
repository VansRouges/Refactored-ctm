"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CopyTradingPage from "@/components/user-portfolio/copied-trades";
import StockPage from "@/components/user-portfolio/stocks-purchased";
import { clearStockOption } from "@/store/stockOptionsSlice";
import { clearCopyTrade } from "@/store/copyTradeSlice";
import { useDispatch } from "react-redux";
import CryptoBalance from "@/components/user-portfolio/crypto-balance";


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("crypto");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearStockOption());
    dispatch(clearCopyTrade());
  }, [dispatch]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl md:text-3xl font-bold mb-6">Manage Options</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 p-2">
          <TabsTrigger
            className="overflow-hidden p-1 text-xs sm:text-base"
            value="crypto"
          >
            Crypto
          </TabsTrigger>
          <TabsTrigger
            className="overflow-hidden p-1 text-xs sm:text-base"
            value="stocks"
          >
            Stocks
          </TabsTrigger>
          <TabsTrigger
            className="overflow-hidden p-1 text-xs sm:text-base"
            value="copy-trades"
          >
            Copy Trades
          </TabsTrigger>
        </TabsList>
        <TabsContent value="stocks" className="mt-6">
          <StockPage />
        </TabsContent>
        <TabsContent value="crypto" className="mt-6">
          <CryptoBalance />
        </TabsContent>
        <TabsContent value="copy-trades" className="mt-6">
          <CopyTradingPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
