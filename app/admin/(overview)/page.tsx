"use client";

import React, { useState } from "react";
import AdminDashboard from "./admin-dashboard";
import UserDetails from "./user-details";
import { databases, Query } from "@/lib/appwrite";
import ENV from "@/constants/env";
import { toast } from "sonner" 
import type { User } from "@/types";
import { useUser } from "@clerk/nextjs";


const AdminPanel: React.FC = () => {
  const { user } = useUser()
  console.log("Public metadata", user?.publicMetadata)
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  console.log("user", selectedUser);

  const handleSelectUser = async (user: User) => {
    const userID = user?.user_id;

    try {
      const transactionsResult = await databases.listDocuments(
        ENV.databaseId,
        ENV.collections.transactions,
        [Query.equal("user_id", userID)]
      );

      const transactions = transactionsResult.documents.map((doc) => ({
        id: doc.id,
        type: doc.isDeposit ? "Deposit" : "Withdraw",
        amount: doc.amount,
        currency: doc.token_name,
        status: doc.status,
        date: doc.$createdAt,
      }));

      setSelectedUser({
        ...user,
        transactions,
      });
    } catch (err) {
      const error = err as Error;
      console.error(error);
    }
  };

  const handleSuspendAccount = async (userID: string) => {
    try {
      await databases.updateDocument(
        ENV.databaseId,
        ENV.collections.profile,
        userID,
        { account_status: false } // Assume `status: false` represents a suspended account
      );
      console.log(`User with ID ${userID} has been suspended.`);
      toast("Account Suspended", {
        description: "Account suspended successfully.",
      });
    } catch (err) {
      const error = err as Error;
      console.error("Error suspending account:", error);
      toast("Error suspending account", {
        description: `Error: ${error.message}`,
      });
    }
  };

  const handleUnSuspendAccount = async (userID: string) => {
    try {
      await databases.updateDocument(
        ENV.databaseId,
        ENV.collections.profile,
        userID,
        { account_status: true } // Assume `status: false` represents a suspended account
      );
      console.log(`User with ID ${userID} has been suspended.`);
      toast( "Account Suspended",{
        description: "Account suspended successfully.",
      });
    } catch (err) {
      const error = err as Error;
      console.error("Error suspending account:", error);
      toast("Error suspending account", {
        description: `Error: ${error.message}`,
      });
    }
  };

  const handleDeleteAccount = async (userID: string) => {
    try {
      await databases.deleteDocument(
        ENV.databaseId,
        ENV.collections.profile,
        userID
      );
      console.log(`User with ID ${userID} has been deleted.`);
      setSelectedUser(null); // Reset selected user after deletion
      toast("Account deleted", {
        description: "Account suspended successfully.",
      });
    } catch (err) {
      const error = err as Error;
      console.error("Error deleting account:", error);
      toast("Error deleting account", {
        description: `Error: ${error.message}`,
      });
    }
  };

  return (
    <div className="h-full overflow-y-scroll">
      {selectedUser ? (
        <UserDetails
          initialUser={selectedUser}
          onBack={() => setSelectedUser(null)}
          onSuspendAccount={handleSuspendAccount}
          onUnSuspendAccount={handleUnSuspendAccount}
          onDeleteAccount={handleDeleteAccount}
        />
      ) : (
        <AdminDashboard onSelectUser={handleSelectUser} />
      )}
    </div>
  );
};

export default AdminPanel;
