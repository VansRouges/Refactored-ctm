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
import { ArrowDownIcon, ArrowUpIcon, CheckIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { TableSkeleton } from "@/skeletons";
import { fetchTransactions, updateTransactionStatus } from "@/app/actions/admin/transactions";
import { updateUserMetadata } from "@/app/actions/role";
import { fetchAllUsers } from '@/app/actions/admin/users';
import { User } from "@/types";


interface Transaction {
    $id: string;
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

  // Fetch transactions from Appwrite database
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTransactions();
        setTransactions(data);
        const { userData } = await fetchAllUsers()
        setUsers(userData)
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast("Failed to fetch transactions.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCryptoPrices = async () => {
      try {
        const response = await fetch("https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest", {
          headers: {
            "X-CMC_PRO_API_KEY": "a8e86a57-c8a7-4fe3-9c18-d2f9c5ca1f67",
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch cryptocurrency data");
        }
  
        const result = await response.json();
        const simplifiedCryptos = result.data.map((crypto: any) => ({
          name: crypto.name,
          price: crypto.quote?.USD?.price,
        }));
  
        console.log("Simplified Crypto List:", simplifiedCryptos);
      } catch (error) {
        console.error("Error fetching cryptocurrencies:", error);
      }
    };
  
    fetchCryptoPrices();
  }, []);
  

  const handleUpdateStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      await updateTransactionStatus(id, status);
      setTransactions((prev) =>
        prev.map((t) => (t.$id === id ? { ...t, status } : t))
      );
      toast("Success", {
        description: `Transaction ${status} successfully.`,
      });
    } catch (error) {
      console.error(`Error ${status === "approved" ? "approving" : "rejecting"} transaction:`, error);
      toast("Error", {
        description: `Failed to ${status === "approved" ? "approve" : "reject"} transaction.`,
      });
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
                            onClick={() => handleUpdateStatus(transaction.$id, "approved")}
                          >
                            <CheckIcon className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleUpdateStatus(transaction.$id, "rejected")}
                          >
                            <XIcon className="mr-1 h-4 w-4" />
                            Reject
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