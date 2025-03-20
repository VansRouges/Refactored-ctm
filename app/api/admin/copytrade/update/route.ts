import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";
import ENV from "@/constants/env";

const databaseId = ENV.databaseId;
const collectionId = ENV.collections.copyTradingPurchases;

export async function PUT(req: Request) {
  try {
    const { id, updatedFields } = await req.json();

    if (!id || !updatedFields) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Update the trade document
    const response = await databases.updateDocument(
      databaseId,
      collectionId,
      id,
      updatedFields
    );

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error("Error updating trade:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update trade" },
      { status: 500 }
    );
  }
}