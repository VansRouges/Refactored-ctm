"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import DepositForm from "./deposit-form"
import WithdrawForm from "./withdraw-form"

type TransactionType = "deposit" | "withdraw" | null

interface TransactionModalProps {
    userId: string | null | undefined
    fullName: string | null | undefined
    isOpen: boolean
    onClose: () => void
}

export default function TransactionModal({ isOpen, onClose, userId, fullName }: TransactionModalProps) {
  const [transactionType, setTransactionType] = useState<TransactionType>(null)

  const handleClose = () => {
    setTransactionType(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {transactionType === null
              ? "Choose Transaction Type"
              : transactionType === "deposit"
                ? "Deposit Funds"
                : "Withdraw Funds"}
          </DialogTitle>
        </DialogHeader>

        {transactionType === null ? (
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button onClick={() => setTransactionType("deposit")} className="h-20 text-lg">
              Deposit
            </Button>
            <Button onClick={() => setTransactionType("withdraw")} variant="outline" className="h-20 text-lg">
              Withdraw
            </Button>
          </div>
        ) : transactionType === "deposit" ? (
          <DepositForm onBack={() => setTransactionType(null)} userId={userId} fullName={fullName} onComplete={handleClose} />
        ) : (
          <WithdrawForm onBack={() => setTransactionType(null)} userId={userId} fullName={fullName} onComplete={handleClose} />
        )}
      </DialogContent>
    </Dialog>
  )
}
