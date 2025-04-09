"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { EmailTemplateSelector } from "./EmailTemplatesSelector";
import type { EmailTemplate } from "@/lib/emailTemplates";

interface EmailFormProps {
  // onSubmit: (emailData: EmailData) => void;
  onCancel: () => void;
}

export interface EmailData {
  from: string;
  to: string;
  subject: string;
  message: string | React.ReactElement;
}

export function EmailForm({ onCancel }: EmailFormProps) {
  const [emailData, setEmailData] = useState<EmailData>({
    from: "admin@copytradingmarkets.com",
    to: "",
    subject: "",
    message: "",
  });

  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [templateData, setTemplateData] = useState<{ name?: string; invoiceNumber?: string; ticketNumber?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...emailData,
      message: selectedTemplate ? selectedTemplate.component({ data: templateData }) : emailData.message,
    });
  };

  const handleSelectTemplate = (template: EmailTemplate) => {
    setEmailData((prev) => ({
      ...prev,
      subject: template.subject,
    }));
    setSelectedTemplate(template);
    setTemplateData({});
  };

  const handleTemplateFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTemplateData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={`grid ${selectedTemplate ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
        {selectedTemplate && (
          <div className="p-4 border rounded-md bg-muted">
            <p className="text-xs font-semibold mb-2">Template Preview:</p>
            <div className="text-sm text-muted-foreground">
              <selectedTemplate.component data={templateData} />
            </div>
          </div>
        )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-end mb-2">
          <EmailTemplateSelector onSelectTemplate={handleSelectTemplate} />
        </div>

        

        {selectedTemplate?.id === "template-1" && (
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={templateData.name || ""} onChange={handleTemplateFieldChange} />
          </div>
        )}

        {selectedTemplate?.id === "template-2" && (
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input id="invoiceNumber" name="invoiceNumber" value={templateData.invoiceNumber || ""} onChange={handleTemplateFieldChange} />
          </div>
        )}

        {selectedTemplate?.id === "template-3" && (
          <div className="space-y-2">
            <Label htmlFor="ticketNumber">Ticket Number</Label>
            <Input id="ticketNumber" name="ticketNumber" value={templateData.ticketNumber || ""} onChange={handleTemplateFieldChange} />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="from">From</Label>
          <Input id="from" name="from" value={emailData.from} disabled />
        </div>

        <div className="space-y-2">
          <Label htmlFor="to">To</Label>
          <Input id="to" name="to" value={emailData.to} onChange={handleChange} placeholder="recipient@example.com" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" name="subject" value={emailData.subject} onChange={handleChange} placeholder="Email subject" required />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Send Email</Button>
        </div>
      </form>
    </div>
  );
}
