"use client"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { fetchAllUsers } from '@/app/actions/admin/users';
import { formatCurrency } from "@/lib/utils"
import type { User, SelectedUser } from "@/types"


export default function Home() {
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true)
      try {
        const { data } = await fetchAllUsers()
        setUsers(data)
      } catch (error) {
        console.error('Error loading users:', error)
        toast.error('Failed to load users')
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [])

  const handleUserClick = (user: User): void => {
    setLoading(true)
    setTimeout(() => {
      const selectedUserData: SelectedUser = {
        id: user.id,
        username: user.username,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0],
        name: `${user.firstName} ${user.lastName}`,
        role: user.publicMetadata?.role || 'User',
        currentValue: user.publicMetadata?.currentValue || 0,
        totalInvestment: user.publicMetadata?.totalInvestment || 0,
        roi: user.publicMetadata?.roi || 0,
        accountStatus: user.publicMetadata?.accountStatus,
        kycStatus: user.publicMetadata?.kycStatus,
        lastSeen: user?.lastSignInAt,
        joinDate: user.createdAt,
      }
      setSelectedUser(selectedUserData) 
      setLoading(false)
    }, 500)
  }


  return (
    <main className="container mx-auto py-6 px-4 md:px-6 h-[calc(100vh-10rem)] overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6">User Directory</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1st grid */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Select a user to view details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedUser?.id === user.id ? "bg-primary/10" : "hover:bg-muted"
                    }`}
                    onClick={() => handleUserClick(user)}
                  >
                      <Avatar>
                        <AvatarImage src={user.imageUrl} alt={`${user?.firstName} ${user?.lastName}`} />
                        <AvatarFallback>
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {user.username}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.publicMetadata?.role || 'User'}
                        </div>
                      </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* 2nd grid */}
        <div className="md:col-span-2">
          <div className="sticky top-1">
            {loading ? (
              <UserDetailSkeleton />
            ) : selectedUser ? (
              <UserDetail user={selectedUser} />
            ) : (
              <div className="flex items-center justify-center h-full min-h-[300px] rounded-lg border border-dashed">
                <div className="text-center">
                  <h3 className="text-lg font-medium">No user selected</h3>
                  <p className="text-sm text-muted-foreground mt-1">Select a user from the list to view their details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

function UserDetail({ user }: { user: SelectedUser }) {
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
        </div>
      </CardContent>
    </Card>
  )
}

function UserDetailSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Skeleton className="h-4 w-32" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>

          <div className="grid gap-3">
            <Skeleton className="h-4 w-24" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          <div className="grid gap-3">
            <Skeleton className="h-4 w-20" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-6 w-24 rounded-full" />
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <Skeleton className="h-4 w-16" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-6 w-20 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}