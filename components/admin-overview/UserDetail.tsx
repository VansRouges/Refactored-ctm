import { formatCurrency } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import type { SelectedUser, Live } from "@/types"
import { Button } from "../ui/button";
import { Edit, Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { fetchTransactions } from "@/app/actions/fetchTransactions";
import { useEffect, useState } from "react";
import TransactionModal from "./user-deposit/transaction-modal";

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

export default function UserDetail({ user, onUpdateClick }: { user: SelectedUser, onUpdateClick: () => void }) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [liveData, setLiveData] = useState<Live[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const fetchData = async () => {
          if (!user?.id) return;
          
          setIsLoading(true);
          try {
              // Fetch transactions and live data in parallel
              const [transactionsRes, liveRes] = await Promise.all([
                  fetchTransactions(user.id),
                  fetch('/api/live-crypto').then(res => res.json())
              ]);
              
              setTransactions(transactionsRes);
              setLiveData(liveRes);
          } catch (error) {
              console.error("Error fetching data:", error);
          } finally {
              setIsLoading(false);
          }
      };

      fetchData();
  }, [user?.id]);

   // Helper function to get crypto price and calculate value
    const getCryptoData = (currency: string) => {
        const crypto = liveData.find(c => c.name === currency);
        return {
            price: crypto?.price || 0,
            value: crypto ? crypto.price : 0
        };
    };

    return (
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.imageUrl} alt={`${user?.name}` || "no full name"} />
            <AvatarFallback>{user?.name || "noName"}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{user.name ?? "No full name yet"}</CardTitle>
            <CardDescription>Role: {user.role}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onUpdateClick}>
          <Edit className="h-4 w-4 mr-2" />
          Update
        </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <div className="text-sm font-bold">User Information</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Username</span>
                  <span className="text-sm font-medium">{user.username}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <button
                    className="text-sm font-medium text-left hover:underline"
                    // onClick={() => onContactClick(user.email)}
                  >
                    {user.email}
                  </button>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Last Seen:</span>
                  <span className="text-sm font-medium">{user.lastSeen}</span>
                </div>
              </div>
            </div>
  
            <div className="grid gap-3">
              <div className="text-sm font-bold">Account Status</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${user.kycStatus ? "bg-green-500" : "bg-red-500"}`}></div>
                  <span className="text-sm">KYC Status: {user.kycStatus ? "Verified" : "Not Verified"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${user.accountStatus ? "bg-green-500" : "bg-red-500"}`}></div>
                  <span className="text-sm">Account Status: {user.accountStatus ? "Active" : "Inactive"}</span>
                </div>
              </div>
            </div>
  
            <div className="grid gap-3">
              <div className="text-sm font-bold">User Portfolio</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">ROI</span>
                  <span className={`text-sm font-medium ${user.roi < 10 ? "text-red-500" : "text-green-500"}`}>
                    {user.roi}%
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Current Value</span>
                  <span className="text-sm font-medium">{formatCurrency(user.currentValue)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Total Investment</span>
                  <span className="text-sm font-medium">{formatCurrency(user.totalInvestment)}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
                <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Transactions</div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2"
                  onClick={() => setIsModalOpen(true)} 
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
                </div>
                <div className="rounded-md border">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Token</TableHead>
                        <TableHead>Price(in USD)</TableHead>
                        <TableHead>Value(in USD)</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center">
                                        Loading transactions...
                                    </TableCell>
                                </TableRow>
                            ) : transactions.length > 0 ? (
                                transactions.map((transaction) => {
                                    const cryptoData = getCryptoData(transaction.token_name);
                                    const value = transaction.amount * cryptoData.price;
                                    
                                    return (
                                        <TableRow key={transaction.$id}>                        
                                            <TableCell>
                                                {new Date(transaction.$createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </TableCell>
                                            <TableCell>{transaction.type}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                  {transaction.token_name}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {cryptoData.price > 0 ? formatCurrency(cryptoData.price) : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {value > 0 ? formatCurrency(value) : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {transaction.amount.toLocaleString("en-US", {
                                                    maximumFractionDigits: 8
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs ${
                                                        transaction.status === "approved"
                                                            ? "bg-green-100 text-green-800"
                                                            : transaction.status === "pending"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {transaction.status}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                                        No transactions found
                                    </TableCell>
                                </TableRow>
                            )}
                    </TableBody>
                </Table>
                </div>

                <TransactionModal 
                  isOpen={isModalOpen} 
                  onClose={() => setIsModalOpen(false)} 
                  userId={user?.id}
                  fullName={user?.name}
                />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }