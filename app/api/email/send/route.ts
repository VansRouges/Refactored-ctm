import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import ReactDOMServer from "react-dom/server";
import { emailTemplates } from "@/lib/emailTemplates";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from, to, subject, templateId, templateData } = body;

    if (!to || !from || !templateId) {
      return NextResponse.json(
        { message: "Missing recipient, sender, or template information." },
        { status: 400 }
      );
    }

    // Find the template component
    const template = emailTemplates.find(t => t.id === templateId);
    if (!template) {
      return NextResponse.json(
        { message: `Template with ID '${templateId}' not found.` },
        { status: 404 }
      );
    }

    // Render the selected template with data
    const EmailComponent = template.component;
    const html = ReactDOMServer.renderToStaticMarkup(
      <EmailComponent data={templateData} />
    );

    const response = await resend.emails.send({
      from,
      to: [to],
      subject,
      html,
    });

    return NextResponse.json({
      id: response.data?.id,
      message: "Email sent successfully",
    });

  } catch (err) {
    console.error("Error sending email:", err);
    return NextResponse.json(
      { message: "Internal server error", error: err },
      { status: 500 }
    );
  }
}
