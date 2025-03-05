import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import ENV from "@/constants/env";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const response = await databases.listDocuments(
      ENV.databaseId,
      ENV.collections.copyTradingPurchases,
      [Query.equal("user_id", user_id)]
    );

    const copiedTrades = response.documents.map((doc) => ({
      $id: doc.$id,
      trade_title: doc.trade_title,
      trade_min: doc.trade_min,
      trade_max: doc.trade_max,
      trade_roi_min: doc.trade_roi_min,
      trade_roi_max: doc.trade_roi_max,
      trade_risk: doc.trade_risk,
      trade_current_value: doc.trade_current_value,
      trade_profit_loss: doc.trade_profit_loss,
      trade_win_rate: doc.trade_win_rate,
      isProfit: doc.isProfit,
      initial_investment: doc.initial_investment,
      trade_token: doc.trade_token,
      trade_token_address: doc.trade_token_address,
      trade_status: doc.trade_status,
      full_name: doc.full_name,
    }));

    return NextResponse.json({ success: true, copiedTrades }, { status: 200 });
  } catch (error) {
    console.error("Error fetching copied trades:", error);
    return NextResponse.json({ error: "Failed to fetch copied trades" }, { status: 500 });
  }
}
