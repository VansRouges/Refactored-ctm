"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { EmailTemplate } from "@/lib/emailTemplates"
import { WelcomeEmailForm } from "./WelcomeEmailForm"

interface EmailTemplateCardProps {
  template: EmailTemplate
}

export function EmailTemplateCard({ template }: EmailTemplateCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenModal = () => {
    setIsOpen(true)
  }

  const renderEmailForm = () => {
    switch (template.id) {
      case "template-1":
        return <WelcomeEmailForm template={template} onClose={() => setIsOpen(false)} />
      
      default:
        return null
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>Category: {template.category}</CardDescription>
            </div>
            <Badge>{template.category}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <span className="font-semibold">Subject:</span> {template.subject}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Body:</span>
            <p className="text-sm whitespace-pre-line line-clamp-3 mt-1">{template.body}</p>
          </div>
          <Button onClick={handleOpenModal}>Send Email</Button>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send {template.name}</DialogTitle>
          </DialogHeader>
          {renderEmailForm()}
        </DialogContent>
      </Dialog>
    </>
  )
}
