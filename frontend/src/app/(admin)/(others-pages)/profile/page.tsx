"use client";
import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import React from "react";
import { UserProvider, useUser } from "@/context/UserContext";
import { useEffect } from 'react';







export default function Profile() {
  const { user, getUserApi } = useUser();

  useEffect(() => {
    getUserApi();
  }, [getUserApi]);

  return (
    <UserProvider>
      <div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="space-y-6">
            {user && (
              <UserMetaCard
                user={user}
              />
            )}
            {user && (
              <UserInfoCard
                user={user}
              />
            )}
            {user && (
              <UserAddressCard
                user={user}
              />
            )}
          </div>
        </div>
      </div>
    </UserProvider>
  );
}
