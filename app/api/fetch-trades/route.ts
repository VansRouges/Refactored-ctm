import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";
import ENV from "@/constants/env";

export async function GET() {
  try {
    const response = await databases.listDocuments(
      ENV.databaseId,
      ENV.collections.copyTrading
    );

    const trades = response.documents.map((doc) => ({
      id: doc.$id,
      trade_title: doc.trade_title,
      trade_max: doc.trade_max,
      trade_min: doc.trade_min,
      trade_roi_min: doc.trade_roi_min,
      trade_roi_max: doc.trade_roi_max,
      trade_description: doc.trade_description,
      trade_risk: doc.trade_risk,
      trade_duration: doc.trade_duration,
    }));

    return NextResponse.json({ success: true, trades }, { status: 200 });
  } catch (error) {
    console.error("Error fetching trades:", error);
    return NextResponse.json({ error: "Failed to fetch trades" }, { status: 500 });
  }
}
