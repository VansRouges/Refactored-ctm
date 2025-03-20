"use client"

import { useEffect, useState} from "react"
import { AdminSupportRequestList } from "@/components/support/AdminSupportRequestList"
import { type SupportRequest } from "@/components/support/type"
import { fetchSupportRequests, updateSupportRequestStatus } from "@/app/actions/support";
import { toast } from "sonner"

export default function AdminSupportCenter() {
    const [requests, setRequests] = useState<SupportRequest[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const loadSupportRequests = async () => {
        setIsLoading(true);
        const supportRequests = await fetchSupportRequests();
        setRequests(supportRequests);
        setIsLoading(false);
    };

    useEffect(() => {
        loadSupportRequests();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        const success = await updateSupportRequestStatus(id, newStatus);

        if (success) {
            setRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request.$id === id
                        ? { ...request, status: newStatus as SupportRequest["status"], $updatedAt: new Date().toISOString() }
                        : request
                )
            );
            toast("Success", { description: "Support request updated successfully!" });
        } else {
            toast("Error", { description: "Failed to update request status" });
        }
    };

    return (
        <div className="container mx-auto py-6 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Admin Support Center</h1>
            </div>
            <div className="bg-card rounded-lg shadow-md p-6">
                <AdminSupportRequestList 
                    isLoading={isLoading} 
                    requests={requests} 
                    fetchRequests={loadSupportRequests}
                    onStatusUpdate={handleStatusUpdate} 
                    setIsLoading={setIsLoading}
                />
            </div>
        </div>
    );
}

