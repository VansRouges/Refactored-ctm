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
      ENV.collections.transactions,
      [Query.equal("user_id", user_id)]
    );

    const transactions = response.documents.map((transaction) => ({
      ...transaction,
      type: transaction.isDeposit ? "Deposit" : "Withdrawal",
    }));

    return NextResponse.json({ success: true, transactions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}
