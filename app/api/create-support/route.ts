import { NextResponse } from "next/server";
import { databases, ID, Permission, Role } from "@/lib/appwrite";
import ENV from "@/constants/env";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { user_id, full_name, email, title, message, priority } = body;

    if (!user_id || !full_name || !email || !title || !message || !priority) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const supportData = {
      user_id,
      full_name,
      email,
      status: "open",
      title,
      message,
      priority,
    };

    const support = await databases.createDocument(
      ENV.databaseId,
      ENV.collections.support,
      ID.unique(),
      supportData,
      [Permission.read(Role.any())]
    );

    return NextResponse.json({ success: true, support }, { status: 201 });
  } catch (error) {
    console.error("Error creating support ticket:", error);
    return NextResponse.json({ error: "Failed to create support ticket" }, { status: 500 });
  }
}
