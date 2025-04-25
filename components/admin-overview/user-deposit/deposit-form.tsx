"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft } from "lucide-react"
import { createDeposit } from "@/app/actions/deposit"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DepositFormProps {
  onBack: () => void
  onComplete: () => void
  cryptocurrencies: { id: string; name: string; value: string; address: string }[]
  userId: string | null | undefined
  fullName: string | null | undefined
}

export default function DepositForm({ onBack, onComplete, userId, fullName, cryptocurrencies }: DepositFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    token_name: "",
    amount: 0,
    token_deposit_address: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTokenSelect = (value: string) => {
    const selectedCrypto = cryptocurrencies.find(crypto => crypto.value === value)
    if (selectedCrypto) {
      setFormData(prev => ({
        ...prev,
        token_name: selectedCrypto.value,
        token_deposit_address: selectedCrypto.address
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try{
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount.toString()),
        isWithdraw: false,
        isDeposit: true,
        status: "pending",
      }

      await createDeposit({
        token_name: formData.token_name,
        amount: transactionData.amount,
        token_deposit_address: formData.token_deposit_address,
        user_id: userId,
        full_name: fullName,
      })

      console.log("Deposit transaction:", transactionData)
    } catch (error) {
      console.error("Error creating deposit transaction:", error)
    } finally {
      setIsLoading(false)
      onComplete()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <Button type="button" variant="ghost" onClick={onBack} className="mb-2 h-8 px-2">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back
      </Button>

      <div className="space-y-2">
        <Label htmlFor="token">Select Cryptocurrency</Label>
        <Select onValueChange={handleTokenSelect} required>
          <SelectTrigger>
            <SelectValue placeholder="Select a token" />
          </SelectTrigger>
          <SelectContent>
            {cryptocurrencies.map((crypto) => (
              <SelectItem key={crypto.id} value={crypto.value}>
                {crypto.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="any"
          min="0"
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
          readOnly // Since we're auto-populating this from the selection
        />
      </div>

      <Button disabled={isLoading} type="submit" className="w-full">
      {isLoading ? "Processsing..." : "Submit Deposit"}
      </Button>
    </form>
  )
}