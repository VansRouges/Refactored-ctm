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
      ENV.collections.support,
      [Query.equal("user_id", user_id)]
    );

    const supportRequests = response.documents.map((doc) => ({
      id: doc.$id,
      title: doc.title,
      message: doc.message,
      status: doc.status,
      email: doc.email,
      full_name: doc.full_name,
      priority: doc.priority,
      createdAt: doc.$createdAt,
      updatedAt: doc.$updatedAt,
    }));

    return NextResponse.json({ success: true, supportRequests }, { status: 200 });
  } catch (error) {
    console.error("Error fetching support requests:", error);
    return NextResponse.json({ error: "Failed to fetch support requests" }, { status: 500 });
  }
}
