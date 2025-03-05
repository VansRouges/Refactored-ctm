import { Key } from "react"

export interface SupportRequest {
    id: Key | null | undefined
    $id: string
    title: string
    message: string
    email: string
    full_name: string
    status: "open" | "in-progress" | "resolved"
    priority: "urgent" | "high" | "normal" | "low"
    createdAt: string
    updatedAt: string
}