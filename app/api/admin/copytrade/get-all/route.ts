import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";
import ENV from "@/constants/env";

const databaseId = ENV.databaseId;
const collectionId = ENV.collections.copyTradingPurchases;

export async function GET() {
  try {
    // Fetch copy trading data from Appwrite
    const response = await databases.listDocuments(databaseId, collectionId);

    // Format the data
    const formattedData = response.documents.map((doc) => ({
      $id: doc.$id,
      trade_title: doc.trade_title,
      trade_token: doc.trade_token,
      initial_investment: doc.initial_investment,
      trade_current_value: doc.trade_current_value,
      isProfit: doc.isProfit,
      trade_profit_loss: doc.trade_profit_loss,
      trade_win_rate: doc.trade_win_rate,
      trade_risk: doc.trade_risk,
      copiedSince: new Date(doc.$createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      $createdAt: doc.$createdAt,
      trade_status: doc.trade_status,
    }));

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("Failed to fetch copy trading data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch copy trading data" },
      { status: 500 }
    );
  }
}