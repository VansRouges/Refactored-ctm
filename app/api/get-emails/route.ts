import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite"; // Ensure correct Appwrite import
import ENV from "@/constants/env"; // Ensure correct environment config import

export async function GET() {
  try {
    const response = await databases.listDocuments(
      ENV.databaseId,
      ENV.collections.emails
    );

    const emails = response.documents.map((mail: any) => ({
      $id: mail?.$id,
      to: mail?.to,
      subject: mail?.subject,
      status: mail?.status,
      $createdAt: mail?.$createdAt,
    }));

    return NextResponse.json({ success: true, data: emails });
  } catch (error) {
    console.error("Error fetching past emails:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch emails" },
      { status: 500 }
    );
  }
}
