"use client"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { emailTemplates } from "@/lib/emailTemplates"
import { EmailTemplateCard } from "@/components/email-components/EmailTemplateCard"
import { fetchEmails } from "@/app/actions/email/get-all"

export default function AdminEmailPage() {
  // Fetch past emails from the server
  const [pastEmails, setPastEmails] = useState<{ $id: string; to: string; subject: string; status: string; $createdAt: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const emails = await fetchEmails()
        setPastEmails(emails)
      } catch (error) {
        console.error("Error fetching emails:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Email Center</h1>
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
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : pastEmails.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No emails sent yet.</p>
              </div>
            ) : 
            (
              <div className="overflow-y-auto max-h-[400px]">
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
                    {pastEmails.map((email) => (
                      <TableRow key={email.$id}>
                        <TableCell>{email.to}</TableCell>
                        <TableCell>{email.subject}</TableCell>
                        <TableCell>
                          <Badge variant={email.status === "received" ? "default" : "destructive"}>
                            {email.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(email.$createdAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="bg-card rounded-lg shadow-md p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold">Email Templates</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {emailTemplates.map((template) => (
                <EmailTemplateCard key={template.id} template={template} />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
