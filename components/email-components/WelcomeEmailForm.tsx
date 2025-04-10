"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { EmailTemplate } from "@/lib/emailTemplates"

interface WelcomeEmailFormProps {
  template: EmailTemplate
  onClose: () => void
}

export function WelcomeEmailForm({ template, onClose }: WelcomeEmailFormProps) {
  const [recipient, setRecipient] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const subject = template.subject;
      const body = template.body.replace("{{name}}", name);

      console.log("Sending Welcome Email:", {
        to: recipient,
        subject,
        body,
        templateData: {
            name,
        },
    });

      const response = await fetch("/api/email/welcome", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: recipient,
          name,
          subject,
          password,
          emailMessage: body,
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        console.log("Email sent successfully:", result);
      } else {
        console.error("Error sending email:", result);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="recipient">Recipient Email</Label>
        <Input
          id="recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="user@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <Input id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="*********" required />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Send Email</Button>
      </div>
    </form>
  )
}
