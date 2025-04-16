"use client"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

interface UpdateUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedUser: { name: string } | null
  formData: {
    roi: number
    currentValue: number
    totalInvestment: number
    kycStatus: boolean
    accountStatus: boolean
  }
  loading: boolean
  setFormData: (data: UpdateUserModalProps["formData"]) => void
  handleUpdateUser: () => void
}

export const UpdateUserModal = ({
  open,
  onOpenChange,
  selectedUser,
  loading,
  formData,
  setFormData,
  handleUpdateUser,
}: UpdateUserModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
          <DialogDescription>
            Update portfolio and account status for {selectedUser?.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="roi" className="text-right">ROI</Label>
            <Input
              id="roi"
              type="number"
              value={formData.roi}
              onChange={(e) => setFormData({ ...formData, roi: parseFloat(e.target.value) })}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="currentValue" className="text-right">Current Value</Label>
            <Input
              id="currentValue"
              value={formData.currentValue}
              onChange={(e) => setFormData({ ...formData, currentValue: parseFloat(e.target.value) })}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="totalInvestment" className="text-right">Total Investment</Label>
            <Input
              id="totalInvestment"
              value={formData.totalInvestment}
              onChange={(e) => setFormData({ ...formData, totalInvestment: parseFloat(e.target.value) })}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="kycStatus" className="text-right">KYC Status</Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch
                id="kycStatus"
                checked={formData.kycStatus}
                onCheckedChange={(checked) => setFormData({ ...formData, kycStatus: checked })}
              />
              <Label htmlFor="kycStatus">
                {formData.kycStatus ? "Verified" : "Not Verified"}
              </Label>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="accountStatus" className="text-right">Account Status</Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch
                id="accountStatus"
                checked={formData.accountStatus}
                onCheckedChange={(checked) => setFormData({ ...formData, accountStatus: checked })}
              />
              <Label htmlFor="accountStatus">
                {formData.accountStatus ? "Active" : "Inactive"}
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button disabled={loading} type="submit" onClick={handleUpdateUser}>
            {loading ? "Updating..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
