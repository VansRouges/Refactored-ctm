import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";
import ENV from "@/constants/env";

const databaseId = ENV.databaseId;
const collectionId = ENV.collections.copyTradingPurchases;

export async function PUT(req: Request) {
  try {
    const { tradeId, status, tradeDuration } = await req.json();

    if (!tradeId || !status) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: {
      trade_status: string;
      trade_approval_date?: string;
      trade_end_date?: string;
    } = { trade_status: status };

    // Only set dates if status is not "rejected"
    if (status.toLowerCase() !== "rejected") {
      const approvalDate = new Date(); // Today's date
      const endDate = new Date();
      endDate.setDate(approvalDate.getDate() + (tradeDuration || 0)); // Add trade duration days

      updateData.trade_approval_date = approvalDate.toISOString();
      updateData.trade_end_date = endDate.toISOString();
    } else {
      // For rejected status, set empty strings
      updateData.trade_approval_date = "";
      updateData.trade_end_date = "";
    }

    // Update the trade document
    const response = await databases.updateDocument(
      databaseId,
      collectionId,
      tradeId,
      updateData
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