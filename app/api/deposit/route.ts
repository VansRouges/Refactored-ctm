import { NextResponse } from "next/server";
import { databases, ID } from "@/lib/appwrite";
import ENV from "@/constants/env";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { token_name, amount, token_deposit_address, user_id, full_name } = body;

    if (!token_name || !amount || !token_deposit_address || !user_id || !full_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const transactionPayload = {
      token_name,
      isWithdraw: false,
      isDeposit: true,
      status: "pending",
      amount,
      token_deposit_address,
      user_id,
      full_name,
    };

    const transaction = await databases.createDocument(
      ENV.databaseId,
      ENV.collections.transactions,
      ID.unique(),
      transactionPayload
    );

    return NextResponse.json({ success: true, transaction }, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
