"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowDownIcon, ArrowUpIcon, CheckIcon, XIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { TableSkeleton } from "@/skeletons";
import { fetchTransactions, updateTransactionStatus } from "@/app/actions/admin/transactions";
import { updateUserMetadata } from "@/app/actions/role";
import { fetchAllUsers } from '@/app/actions/admin/users';
import { User, Live } from "@/types";


interface Transaction {
  $id: string;
  userId: string;
  isWithdraw: boolean;
  token_name: string;
  amount: number;
  token_withdraw_address?: string;
  full_name: string;
  $createdAt: string;
  status: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [live, setLive] = useState<Live[]>([])
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  // Fetch transactions from Appwrite database
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTransactions();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast("Failed to fetch transactions.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const { data } = await fetchAllUsers()
      setUsers(data)
      console.log("Users:", data)
    } catch (error) {
      console.error('Error loading users:', error)
      toast.error('Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const res = await fetch('/api/live-crypto');
        const data = await res.json();
        console.log("Extracted cryptos:", data); // Only name and price
        setLive(data);
      } catch (error) {
        console.error("Error fetching cryptos from backend:", error);
      }
    };
  
    fetchCryptos();
  }, []);
  
  
  const handleUpdateStatus = async (id: string, status: "approved" | "rejected", transaction: Transaction) => {
    try {
      // Set loading state for the specific transaction
      if (status === "approved") {
        setApprovingId(id);
      } else {
        setRejectingId(id);
      }
  
      // Process metadata updates for approved transactions
      if (status === "approved") {
        const user = users.find(user => user.id === transaction.userId);
        
        if (!user) {
          throw new Error('User not found');
        }
  
        let newTotalInvestment = Number(user.publicMetadata?.totalInvestment) || 0;
        let depositValue = 0;
  
        // Handle USDT transactions (1:1 value)
        if (transaction.token_name.toLowerCase().includes('usdt')) {
          depositValue = transaction.amount;
        } else {
          // Find crypto price for non-USDT tokens
          const crypto = live.find(c => 
            c.name.toLowerCase() === transaction.token_name.toLowerCase()
          );
          
          if (!crypto) {
            throw new Error(`Could not find price data for ${transaction.token_name}`);
          }
          depositValue = crypto.price * transaction.amount;
        }
  
        // Handle withdrawals (subtract) vs deposits (add)
        if (transaction.isWithdraw) {
          // Verify sufficient balance before withdrawal
          if (newTotalInvestment < depositValue) {
            throw new Error('Insufficient funds for withdrawal');
          }
          newTotalInvestment -= depositValue;
        } else {
          newTotalInvestment += depositValue;
        }
  
        // Update user metadata
        await updateUserMetadata({
          userId: user.id,
          metadata: {
            ...user.publicMetadata,
            totalInvestment: newTotalInvestment,
            role: user.publicMetadata?.role as "admin" | "user" | undefined
          }
        });
      }
  
      // Update the transaction status
      await updateTransactionStatus(id, status);
      setTransactions((prev) =>
        prev.map((t) => (t.$id === id ? { ...t, status } : t))
      );
      
      toast.success(`Transaction ${status} successfully.`, {
        description: status === "approved" ? "User balance has been updated" : undefined,
      });
    } catch (error) {
      console.error(`Error ${status === "approved" ? "approving" : "rejecting"} transaction:`, error);
      toast.error(`Failed to ${status === "approved" ? "approve" : "reject"} transaction`, {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      // Clear loading states
      setApprovingId(null);
      setRejectingId(null);
    }
  };

  // https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest
  // API KEY: a8e86a57-c8a7-4fe3-9c18-d2f9c5ca1f67

  // await updateUserMetadata({
  //   userId: user.id,
  //   metadata: {
  //     roi: user?.publicMetadata.roi,
  //     currentValue: user?.publicMetadata.currentValue,
  //     totalInvestment: user?.publicMetadata.totalInvestment,
  //     kycStatus: user?.publicMetadata.kycStatus,
  //     accountStatus: user?.publicMetadata.accountStatus,
  //   },
  // })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto h-full overflow-y-scroll p-4"
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            View and manage recent withdrawal and deposit requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Token</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Withdraw Address</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.$id}>
                    <TableCell>
                      <Badge>
                        {transaction.isWithdraw ? (
                          <ArrowUpIcon className="mr-1 h-4 w-4" />
                        ) : (
                          <ArrowDownIcon className="mr-1 h-4 w-4" />
                        )}
                        {transaction.isWithdraw ? "withdrawal" : "deposit"}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.token_name}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>
                      {transaction.isWithdraw
                        ? transaction.token_withdraw_address
                        : "(empty)"}
                    </TableCell>
                    <TableCell>{transaction.full_name}</TableCell>
                    <TableCell>
                      {new Date(transaction.$createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          transaction.status === "pending"
                            ? "bg-yellow-400"
                            : transaction.status === "approved"
                            ? "bg-green-500"
                            : "bg-red-600"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                    {transaction.status === "pending" && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(transaction.$id, "approved", transaction)}
                          disabled={approvingId === transaction.$id || rejectingId === transaction.$id}
                        >
                          {approvingId === transaction.$id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckIcon className="mr-1 h-4 w-4" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleUpdateStatus(transaction.$id, "rejected", transaction)}
                          disabled={rejectingId === transaction.$id || approvingId === transaction.$id}
                        >
                          {rejectingId === transaction.$id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <XIcon className="mr-1 h-4 w-4" />
                              Reject
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}