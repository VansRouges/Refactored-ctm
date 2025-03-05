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
      ENV.collections.stockOptionsPurchases,
      [Query.equal("user_id", user_id)]
    );

    const purchasedStocks = response.documents.map((doc) => ({
      $id: doc.$id,
      stock_symbol: doc.stock_symbol,
      stock_name: doc.stock_name,
      purchase_price: doc.purchase_price,
      current_price: doc.current_price,
      shares_owned: doc.shares_owned,
      total_value: doc.total_value,
      purchase_date: doc.purchase_date,
    }));

    return NextResponse.json({ success: true, purchasedStocks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching purchased stocks:", error);
    return NextResponse.json({ error: "Failed to fetch purchased stocks" }, { status: 500 });
  }
}
