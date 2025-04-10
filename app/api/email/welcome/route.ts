import { Resend } from "resend";
import ENV from "@/constants/env";
import { databases, ID, Permission, Role } from "@/lib/appwrite";
import { NextRequest, NextResponse } from "next/server";
import Welcome from "../../../../components/email-templates/welcome";

const resend = new Resend(process.env.RESEND_API_KEY);
const databaseId = ENV.databaseId;
const collectionId = ENV.collections.emails; // Ensure this collection exists in Appwrite

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, subject, password, emailMessage } = body;

    // Validate input
    if (!email || !name || !subject || !body) {
      return NextResponse.json(
        { message: "Email or name or subject or body is missing" },
        { status: 400 }
      );
    }

    // Send the email using the Resend API
    const data = await resend.emails.send({
      from: "Harry from CopyTradingMarkets <harry@copytradingmarkets.com>",
      to: [email],
      subject: subject,
      react: Welcome({ name, password }), // Use the body as the React component
    });

    const createEmail = await databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      {
        from: "harry@copytradingmarkets.com",
        to: email,
        subject: subject,
        message: emailMessage, // Use the body as the React component
        status: "received",
        email_id: data.data?.id,
      },
      [Permission.read(Role.any())]
    );
    console.log("Email document created:", createEmail);

    // Respond with success
    return NextResponse.json({
      message: "Email sent successfully",
      id: data.data?.id,
    });

  } catch (err) {
    console.error("Error sending email:", err);

    // Respond with error
    return NextResponse.json(
      { message: "Email not sent", error: err },
      { status: 500 }
    );
  }
}