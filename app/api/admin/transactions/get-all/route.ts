import { NextResponse } from "next/server";
import { databases, Query } from "@/lib/appwrite";
import ENV from "@/constants/env";

const databaseId = ENV.databaseId;
const collectionId = ENV.collections.transactions;

// NOTE:
// YOU NEED A PAGINATED FUNCTIONALITY TO FETCH ALL TRANSACTIONS

export async function GET() {
  try {
    // Fetch transactions from Appwrite
    const response = await databases.listDocuments(
      databaseId, 
      collectionId, 
      [Query.limit(100)] // Max is 100
    );
    console.log("Admin Transactions log:", response.documents)

    // Sort transactions by date (newest first)
    const sortedTransactions = response.documents.sort(
      (a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
    );

    // Map transactions to the desired format
    const transactions = sortedTransactions.map((doc) => ({
      $id: doc.$id,
      userId: doc.user_id,
      isWithdraw: doc.isWithdraw,
      token_name: doc.token_name,
      amount: doc.amount,
      token_withdraw_address: doc.token_withdraw_address,
      full_name: doc.full_name,
      $createdAt: doc.$createdAt,
      status: doc.status,
    }));

    return NextResponse.json({ success: true, data: transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}