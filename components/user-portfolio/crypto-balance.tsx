"use client"
import { useState, useEffect } from "react"
import { fetchTransactions } from "@/app/actions/fetchTransactions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { Live } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface Transaction {
  $id: string;
  $createdAt: string;
  type: string;
  amount: number;
  token_name: string;
  currency: string;
  status: string;
  isDeposit?: boolean;
  date: string;
}

export default function CryptoBalance() {
  const [isLoading, setIsLoading] = useState(true); // Initialize as true
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [live, setLive] = useState<Live[]>([]);
  const { user } = useUser();
  const userId = user?.id || "";

  // Fetch transactions from Appwrite database
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTransactions(userId);
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast("Failed to fetch.");
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const res = await fetch('/api/live-crypto');
        const data = await res.json();
        setLive(data);
      } catch (error) {
        console.error("Error fetching cryptos from backend:", error);
      } finally {
        setIsLoading(false); // Set loading to false when both fetches are done
      }
    };
  
    fetchCryptos();
  }, []);

  // Calculate total value by matching transactions with live data
  const totalValue = transactions.reduce((sum, transaction) => {
    const crypto = live.find(c => c.name === transaction.token_name);
    return sum + (crypto ? transaction.amount * crypto.price : 0);
  }, 0);

  // Skeleton loading rows
  const skeletonRows = Array(5).fill(0).map((_, index) => (
    <TableRow key={`skeleton-${index}`}>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-4 w-16 ml-auto" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-4 w-16 ml-auto" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-4 w-16 ml-auto" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-4 w-10 ml-auto" />
      </TableCell>
    </TableRow>
  ));

  return (
    <main className="container mx-auto py-4 px-4 md:px-6 mb-10">
      <div className="flex flex-col gap-6">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Crypto Balance</h2>
            <p className="text-muted-foreground text-sm">Your cryptocurrency holdings</p>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Total Value</div>
            {isLoading ? (
              <Skeleton className="h-8 w-32 mt-1" />
            ) : (
              <div className="text-2xl font-bold">
                ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            )}
          </div>
        </div>

        {/* Table Section */}
        <div className="rounded-md border overflow-hidden">
          <div className="max-h-[370px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Value (USD)</TableHead>
                  <TableHead className="text-right">24h</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  skeletonRows
                ) : (
                  transactions.map((transaction) => {
                    const crypto = live.find(c => c.name === transaction.token_name);
                    const value = crypto ? transaction.amount * crypto.price : 0;
                    
                    return (
                      <TableRow key={transaction.$id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg" alt={transaction.token_name} />
                              <AvatarFallback>{transaction.token_name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{transaction.token_name}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {transaction.amount < 1 ? transaction.amount : transaction.amount.toLocaleString("en-US")}
                        </TableCell>
                        <TableCell className="text-right">
                          {crypto ? `$${
                            crypto.price < 1
                              ? crypto.price.toFixed(4)
                              : crypto.price.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                          }` : '-'}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${value.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          -
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </main>
  )
}