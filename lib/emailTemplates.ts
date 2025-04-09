export interface EmailTemplate {
    id: string
    name: string
    subject: string
    body: string
    category: "welcome" | "notification" | "marketing" | "support"
  }
  
  export const emailTemplates: EmailTemplate[] = [
    {
      id: "template-1",
      name: "Welcome Email",
      subject: "Welcome to Our Platform!",
      body: `Dear {{name}},
  
  Thank you for joining our platform! We're excited to have you on board.
  
  Here are a few things you can do to get started:
  - Complete your profile
  - Explore our features
  - Connect with other users
  
  If you have any questions, feel free to reach out to our support team.
  
  Best regards,
  The Team`,
      category: "welcome",
    },
    {
      id: "template-2",
      name: "Password Reset",
      subject: "Password Reset Request",
      body: `Dear {{name}},
  
  We received a request to reset your password. If you didn't make this request, you can safely ignore this email.
  
  To reset your password, click on the following link:
  {{resetLink}}
  
  This link will expire in 24 hours.
  
  Best regards,
  The Security Team`,
      category: "support",
    },
    {
      id: "template-3",
      name: "New Feature Announcement",
      subject: "Exciting New Features Just Launched!",
      body: `Hello {{name}},
  
  We're thrilled to announce some exciting new features that we've just launched:
  
  1. {{feature1}} - {{feature1Description}}
  2. {{feature2}} - {{feature2Description}}
  3. {{feature3}} - {{feature3Description}}
  
  Log in to your account to try them out!
  
  Best regards,
  The Product Team`,
      category: "marketing",
    },
    {
      id: "template-4",
      name: "Payment Confirmation",
      subject: "Payment Confirmation - Invoice #{{invoiceNumber}}",
      body: `Dear {{name}},
  
  Thank you for your payment of {{amount}} on {{date}}.
  
  Invoice Details:
  - Invoice Number: {{invoiceNumber}}
  - Date: {{date}}
  - Amount: {{amount}}
  - Payment Method: {{paymentMethod}}
  
  You can view and download your invoice by logging into your account.
  
  Thank you for your business!
  
  Best regards,
  The Billing Team`,
      category: "notification",
    },
    {
      id: "template-5",
      name: "Support Ticket Response",
      subject: "Re: Support Ticket #{{ticketNumber}}",
      body: `Dear {{name}},
  
  Thank you for contacting our support team. We're writing in response to your support ticket #{{ticketNumber}} regarding {{ticketSubject}}.
  
  {{responseDetails}}
  
  If you have any further questions, please don't hesitate to reply to this email.
  
  Best regards,
  The Support Team`,
      category: "support",
    },
  ]
  
  