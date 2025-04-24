"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft } from "lucide-react"
import { createDeposit } from "@/app/actions/deposit"

interface DepositFormProps {
  onBack: () => void
  onComplete: () => void
  userId: string | null | undefined
  fullName: string | null | undefined
}

export default function DepositForm({ onBack, onComplete, userId, fullName }: DepositFormProps) {
  const [formData, setFormData] = useState({
    token_name: "",
    amount: 0,
    token_deposit_address: "",
    user_id: "",
    full_name: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Here you would typically send this data to your backend
    const transactionData = {
      ...formData,
      isWithdraw: false,
      isDeposit: true,
      status: "pending",
    }
    await createDeposit({
        token_name: formData?.token_name,
        amount: formData?.amount,
        token_deposit_address: formData?.token_deposit_address,
        user_id: userId,
        full_name: fullName,
    });

    console.log("Deposit transaction:", transactionData)
    onComplete()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <Button type="button" variant="ghost" onClick={onBack} className="mb-2 h-8 px-2">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back
      </Button>

      <div className="space-y-2">
        <Label htmlFor="token_name">Token Name</Label>
        <Input id="token_name" name="token_name" value={formData.token_name} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="any"
          value={formData.amount}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="token_deposit_address">Token Deposit Address</Label>
        <Input
          id="token_deposit_address"
          name="token_deposit_address"
          value={formData.token_deposit_address}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="user_id">User ID</Label>
        <Input id="user_id" name="user_id" value={formData.user_id} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required />
      </div>

      <Button type="submit" className="w-full">
        Submit Deposit
      </Button>
    </form>
  )
}
