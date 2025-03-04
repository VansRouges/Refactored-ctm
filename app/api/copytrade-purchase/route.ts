import { NextResponse } from "next/server";
import { databases, ID } from "@/lib/appwrite";
import ENV from "@/constants/env";

export async function POST(req: Request) {
  try {
    const copyTradePayload = await req.json();

    const response = await databases.createDocument(
      ENV.databaseId,
      ENV.collections.copyTradingPurchases,
      ID.unique(),
      copyTradePayload
    );

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error("Error creating copy trade:", error);
    return NextResponse.json({ success: false, message: "Failed to create copy trade." }, { status: 500 });
  }
}
