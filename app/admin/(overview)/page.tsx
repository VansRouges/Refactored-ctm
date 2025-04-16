"use client"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { fetchAllUsers } from '@/app/actions/admin/users';
import type { User, SelectedUser } from "@/types"
import { 
  UserDetail, 
  UserDetailSkeleton,
  UpdateUserModal,
} from "@/components/admin-overview"
import { updateUserMetadata } from "@/app/actions/role"

export default function Home() {
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    roi: 0,
    currentValue: 0,
    totalInvestment: 0,
    kycStatus: false,
    accountStatus: false,
  })

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

  useEffect(() => {
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

  const openUpdateModal = () => {
    if (selectedUser) {
      setFormData({
        roi: selectedUser.roi,
        currentValue: selectedUser.currentValue,
        totalInvestment: selectedUser.totalInvestment,
        kycStatus: selectedUser.kycStatus ?? false,
        accountStatus: selectedUser.accountStatus ?? false,
      })
      setIsUpdateModalOpen(true)
    }
  }


const handleUpdateUser = async () => {
  if (!selectedUser) return

  try {
    // 1. Update metadata on Clerk
    await updateUserMetadata({
      userId: selectedUser.id,
      metadata: {
        roi: formData.roi,
        currentValue: formData.currentValue,
        totalInvestment: formData.totalInvestment,
        kycStatus: formData.kycStatus,
        accountStatus: formData.accountStatus,
      },
    })

    setIsUpdateModalOpen(false)

    toast("User updated", {
      description: `${selectedUser.name}'s profile has been updated.`,
    })
  } catch (error) {
    console.error("Failed to update user metadata:", error)
    toast("Update failed", {
      description: "Something went wrong while updating the user."
    })
  } finally{
    await loadUsers()
  }
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
              <UserDetail user={selectedUser} onUpdateClick={openUpdateModal} />
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

      {/* Update User Modal */}
      <UpdateUserModal
        loading={loading}
        open={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
        selectedUser={selectedUser}
        formData={formData}
        setFormData={setFormData}
        handleUpdateUser={handleUpdateUser}
      />
    </main>
  )
}