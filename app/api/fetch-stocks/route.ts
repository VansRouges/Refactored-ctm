import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";
import ENV from "@/constants/env";

export async function GET() {
  try {
    const response = await databases.listDocuments(
      ENV.databaseId,
      ENV.collections.stockOptions
    );

    const stocks = response.documents.map((doc) => ({
      id: doc.$id,
      symbol: doc.symbol,
      name: doc.name,
      price: doc.price,
      change: doc.change,
      isMinus: doc.isMinus,
    }));

    return NextResponse.json({ success: true, stocks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching stocks:", error);
    return NextResponse.json({ error: "Failed to fetch stocks" }, { status: 500 });
  }
}
