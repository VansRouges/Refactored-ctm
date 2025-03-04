import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite"; // Ensure correct Appwrite import
import ENV from "@/constants/env"; // Ensure correct environment config import

export async function GET() {
  try {
    const response = await databases.listDocuments(
      ENV.databaseId,
      ENV.collections.cryptoOptions
    );

    const cryptoData = response.documents.map((doc: any) => ({
      id: doc?.$id,
      name: doc?.token_symbol,
      value: doc?.token_name,
      address: doc?.token_address,
    }));

    return NextResponse.json({ success: true, data: cryptoData });
  } catch (error) {
    console.error("Error fetching cryptocurrencies:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch cryptocurrency data." },
      { status: 500 }
    );
  }
}
