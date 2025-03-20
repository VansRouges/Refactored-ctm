import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";
import ENV from "@/constants/env";

const databaseId = ENV.databaseId;
const collectionId = ENV.collections.copyTradingPurchases;

export async function PUT(req: Request) {
  try {
    const { tradeId, status } = await req.json();

    if (!tradeId || !status) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Update the trade status
    const response = await databases.updateDocument(
      databaseId,
      collectionId,
      tradeId,
      { trade_status: status }
    );

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error("Error updating trade status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update trade status" },
      { status: 500 }
    );
  }
}