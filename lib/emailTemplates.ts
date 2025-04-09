import React from "react";
import WelcomeTemplate from "@/components/email-templates/welcome";
import SupportResponseTemplate from "@/components/email-templates/SupportResponseTemplate";
import PaymentConfirmationTemplate from "@/components/email-templates/PaymentConfirmationTemplate";


export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  category: "welcome" | "notification" | "marketing" | "support";
  component: React.ComponentType<{ data?: any }>;
}


export const emailTemplates: EmailTemplate[] = [
  {
    id: "template-1",
    name: "Welcome Email",
    subject: "Welcome to Our Platform!",
    category: "welcome",
    component: WelcomeTemplate
  },
  {
    id: "template-2",
    name: "Payment Confirmation",
    subject: "Payment Confirmation - Invoice #{{invoiceNumber}}",
    category: "notification",
    component: PaymentConfirmationTemplate
  },
  {
    id: "template-3",
    name: "Support Ticket Response",
    subject: "Re: Support Ticket #{{ticketNumber}}",
    category: "support",
    component: SupportResponseTemplate
  },
];