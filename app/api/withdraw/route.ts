import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";
import { ID, Permission, Role } from "appwrite";
import ENV from "@/constants/env";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { currency, amount, address, user_id, full_name } = body;

    if (!user_id || !currency || !amount || !address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const transactionPayload = {
      token_name: currency,
      isWithdraw: true,
      isDeposit: false,
      status: "pending",
      amount,
      token_withdraw_address: address,
      token_deposit_address: null,
      user_id,
      full_name,
    };

    const transaction = await databases.createDocument(
      ENV.databaseId,
      ENV.collections.transactions,
      ID.unique(),
      transactionPayload,
      [Permission.read(Role.any())]
    );

    return NextResponse.json({ success: true, transaction }, { status: 201 });
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    return NextResponse.json({ error: "Failed to process withdrawal" }, { status: 500 });
  }
}
