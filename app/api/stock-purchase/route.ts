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

export async function PUT(req: Request) {
  try {
    const { id, isTrading } = await req.json();

    if (!id || !isTrading) {
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 });
  }
     await databases.updateDocument(
      ENV.databaseId,
      ENV.collections.stockOptionsPurchases,
      id,
      { isTrading: isTrading }
    );

    return NextResponse.json({ success: true, message: `Stock with ${id} has been updated successfully` });
  } catch (error) {
    console.error("Error updating stock trade:", error);
    return NextResponse.json({ success: false, message: "Failed to update stock trade." }, { status: 500 });
  }
}

