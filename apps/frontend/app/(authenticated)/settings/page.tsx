"use client";

import React, { useState, useEffect } from "react";
import { useUserStore } from "@/stores/user.store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, User, Mail, Lock, Save } from "lucide-react";
import { toast } from "sonner";
import { minidenticon } from "minidenticons";
import Header from "@/components/Header/Header";
import { TUser } from "@shared/types";

export default function SettingsPage() {
  const { user, setUser } = useUserStore();
  const queryClient = useQueryClient();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setDisplayName(user.displayName || "");
    }
  }, [user]);

  const avatarSvg = user?.username ? minidenticon(user.username, 95, 45) : "";

  const updateProfile = useMutation({
    mutationFn: async (data: {
      username?: string;
      email?: string;
      displayName?: string;
      password?: string;
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${user?.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update profile");
      }
      return response.json();
    },
    onSuccess: (data: TUser[]) => {
      // Update the user store with the new data
      if (data[0]) {
        setUser({ ...user, ...data[0] });
      }
      toast.success("Profile updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  const handleSaveProfile = () => {
    const updates: {
      username?: string;
      email?: string;
      displayName?: string;
    } = {};

    if (username !== user?.username) {
      updates.username = username;
    }
    if (email !== user?.email) {
      updates.email = email;
    }
    if (displayName !== user?.displayName) {
      updates.displayName = displayName;
    }

    if (Object.keys(updates).length > 0) {
      updateProfile.mutate(updates);
    }
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    updateProfile.mutate({
      password: newPassword,
    });
  };

  const hasProfileChanges =
    username !== user?.username ||
    email !== user?.email ||
    displayName !== user?.displayName;

  return (
    <>
      <div className="container mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-8">
        <div className="space-y-2">
          <h1 className="syne text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Section */}
        <div className="bg-card space-y-6 rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
              <User className="text-primary h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Profile Information</h2>
              <p className="text-muted-foreground text-sm">
                Update your profile details
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Avatar Preview */}
            <div className="flex flex-col items-center gap-4 rounded-lg border p-6">
              <div className="bg-muted flex h-24 w-24 items-center justify-center overflow-hidden rounded-full shadow-inner">
                {avatarSvg ? (
                  <div
                    className="h-full w-full bg-white"
                    dangerouslySetInnerHTML={{ __html: avatarSvg }}
                  />
                ) : (
                  <User className="text-muted-foreground h-12 w-12" />
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-muted-foreground text-xs">
                  Avatar generated from username
                </p>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter display name (optional)"
                />
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={!hasProfileChanges || updateProfile.isPending}
                className="w-full"
              >
                <Save className="mr-2 h-4 w-4" />
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-card space-y-6 rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
              <Lock className="text-primary h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Change Password</h2>
              <p className="text-muted-foreground text-sm">
                Update your account password
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>

            <Button
              onClick={handleChangePassword}
              disabled={
                !currentPassword ||
                !newPassword ||
                !confirmPassword ||
                updateProfile.isPending
              }
              variant="outline"
              className="w-full md:col-span-2"
            >
              <Lock className="mr-2 h-4 w-4" />
              {updateProfile.isPending ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </div>

        {/* Account Info Section */}
        <div className="bg-card space-y-6 rounded-lg border p-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
              <Settings className="text-primary h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Account Information</h2>
              <p className="text-muted-foreground text-sm">
                View your account details
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-muted-foreground">User ID</Label>
              <p className="font-mono text-sm">{user?.id}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">Role</Label>
              <p className="text-sm capitalize">{user?.role?.toLowerCase()}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">Member Since</Label>
              <p className="text-sm">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            {user?.lastLoginAt && (
              <div className="space-y-1">
                <Label className="text-muted-foreground">Last Login</Label>
                <p className="text-sm">
                  {new Date(user.lastLoginAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
