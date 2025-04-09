"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { EmailForm, type EmailData } from "@/components/email-components/EmailForm"
import { Mail, FileText } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { emailTemplates } from "@/lib/emailTemplates"
import { fetchEmails } from "@/app/actions/email/get-all"

export default function AdminEmailPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [pastEmails, setPastEmails] = useState([])
  const [loading, setLoading] = useState(true)
  const isMobile = useMediaQuery("(max-width: 640px)")

  useEffect(() => {
    const loadEmails = async () => {
      try {
        const emails = await fetchEmails()
        setPastEmails(emails)
      } catch (error) {
        console.error("Failed to fetch emails:", error)
      } finally {
        setLoading(false)
      }
    }
    loadEmails()
  }, [])

  const handleSubmit = (emailData: EmailData) => {
    console.log("Email Data:", emailData)
    setIsOpen(false)
    // Here you would typically send the email and update the pastEmails list
  }

  const Content = <EmailForm onCancel={() => setIsOpen(false)} />

  console.log("emails", pastEmails)

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Email Center</h1>
        {isMobile ? (
          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
              <Button>
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Compose Email</DrawerTitle>
                <DrawerDescription>Fill out this form to send an email.</DrawerDescription>
              </DrawerHeader>
              <div className="p-4 pb-0">{Content}</div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ) : (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[85%]">
              <DialogHeader>
                <DialogTitle>Compose Email</DialogTitle>
                <DialogDescription>Fill out this form to send an email.</DialogDescription>
              </DialogHeader>
              {Content}
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="emails">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="emails">Sent Emails</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="emails">
          {/* Table of past emails */}
          <div className="bg-card rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Past Emails</h2>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <p>Loading emails...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>To</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastEmails.length > 0 ? (
                    pastEmails.map((email) => (
                      <TableRow key={email?.id}>
                        <TableCell>{email.to}</TableCell>
                        <TableCell>{email.subject}</TableCell>
                        <TableCell>
                          <Badge variant={email.status === "received" ? "default" : "destructive"}>
                            {email.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(email.$createdAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No emails found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="bg-card rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Email Templates</h2>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emailTemplates.map((template) => (
                <Card key={template.id}>
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
                    <div>
                      <span className="font-semibold">Body:</span>
                      <p className="text-sm whitespace-pre-line line-clamp-3 mt-1">{template.body}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}