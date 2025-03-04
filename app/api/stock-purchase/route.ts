import { NextResponse } from "next/server";
import { databases, ID } from "@/lib/appwrite";
import ENV from "@/constants/env";

export async function POST(req: Request) {
  try {
    const stockPurchasePayload = await req.json();

    const response = await databases.createDocument(
      ENV.databaseId,
      ENV.collections.stockOptionsPurchases,
      ID.unique(),
      stockPurchasePayload
    );

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error("Error creating stock purchase:", error);
    return NextResponse.json({ success: false, message: "Failed to create stock purchase." }, { status: 500 });
  }
}
