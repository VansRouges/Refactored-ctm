'use server'

export async function sendEmailWithTemplate({
  from,
  to,
  subject,
  templateId,
  templateData
}: {
  from: string;
  to: string;
  subject: string;
  templateId: string;
  templateData: Record<string, any>;
}) {
  const res = await fetch("/api/email/send", {
    method: "POST",
    body: JSON.stringify({
      from,
      to,
      subject,
      templateId,
      templateData,
    }),
    headers: { "Content-Type": "application/json" },
  });

  return await res.json();
}
