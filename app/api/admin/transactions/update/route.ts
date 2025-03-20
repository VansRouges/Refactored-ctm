import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";
import ENV from "@/constants/env";

const databaseId = ENV.databaseId;
const collectionId = ENV.collections.transactions;

export async function PUT(req: Request) {
  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Update the transaction status
    const response = await databases.updateDocument(
      databaseId,
      collectionId,
      id,
      { status }
    );

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}