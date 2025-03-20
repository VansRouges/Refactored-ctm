"use client"
import { useState } from "react"
import type { SupportRequest } from "./type"
import { PriorityBadge } from "./PriorityBadge"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { AdminSupportRequestDetails } from "./AdminSupportRequestDetails"
import { TableSkeleton } from "@/skeletons"
import { deleteSupportRequest } from "@/app/actions/support"
import { toast } from "sonner"
import { Trash } from "lucide-react"

interface AdminSupportRequestListProps {
    requests: SupportRequest[]
    onStatusUpdate: (id: string, newStatus: string) => void
    isLoading?: boolean
    setIsLoading: (value: boolean) => void
    fetchRequests: () => Promise<void>
}

export function AdminSupportRequestList({ requests, onStatusUpdate, isLoading, setIsLoading, fetchRequests }: AdminSupportRequestListProps) {
    const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null)
    const isMobile = useMediaQuery("(max-width: 640px)")

    const handleRequestClick = (request: SupportRequest) => {
        setSelectedRequest(request)
    }

    const handleStatusChange = (id: string, newStatus: string) => {
        onStatusUpdate(id, newStatus)
    }

    const handleDelete = async (id: string) => {
        try{
            await deleteSupportRequest(id);
            setIsLoading(true)
            console.log("Support request deleted successfully!");
            toast("Deleted Successfully", 
                { description: "support ticket deleted successfully"})
            fetchRequests()
            // Optionally, refresh the list of support requests
        } catch(err){
            const error = err as Error
            console.error("Error deleting support request:", error.message);
            toast("Error deleting support request", 
                { description: `Error: ${error.message}`})
        } finally{
            setIsLoading(false)
        }
    };
    

    return (
        <>
            {isLoading ? (
                <TableSkeleton />
            ) : (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead className="hidden md:table-cell">Created</TableHead>
                        <TableHead className="hidden md:table-cell">Updated</TableHead>
                        <TableHead className="hidden md:table-cell">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {requests.map((request) => (
                        <TableRow key={request?.$id} className="cursor-pointer hover:bg-muted/50">
                            <TableCell className="font-medium" onClick={() => handleRequestClick(request)}>
                                {request?.title?.length > 30 ? `${request?.title?.substring(0, 30)}...` : request?.title}
                            </TableCell>
                            <TableCell>
                                <Select value={request?.status} onValueChange={(newStatus) => handleStatusChange(request.$id, newStatus)}>
                                    <SelectTrigger className="w-[130px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="open">
                                            <Badge variant="default">Open</Badge>
                                        </SelectItem>
                                        <SelectItem value="in-progress">
                                            <Badge variant="secondary">In Progress</Badge>
                                        </SelectItem>
                                        <SelectItem value="resolved">
                                            <Badge variant="outline">Resolved</Badge>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <PriorityBadge priority={request.priority} />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="hidden md:table-cell">{new Date(request.updatedAt).toLocaleDateString()}</TableCell>
                            <TableCell className="hidden md:table-cell"><Trash onClick={() => handleDelete(request.$id)} /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
                )}
            <AdminSupportRequestDetails
                request={selectedRequest}
                isOpen={!!selectedRequest}
                onClose={() => setSelectedRequest(null)}
                isMobile={isMobile}
                onStatusUpdate={onStatusUpdate}
            />
        </>
    )
}

