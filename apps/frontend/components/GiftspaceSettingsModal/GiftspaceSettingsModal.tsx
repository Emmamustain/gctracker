"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, X, UserPlus, Search } from "lucide-react";
import { TGiftspace, TUser } from "@shared/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/stores/user.store";
import { toast } from "sonner";
// Using a simple badge-like component since Badge might not exist

interface GiftspaceSettingsModalProps {
  giftspace: TGiftspace;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GiftspaceSettingsModal({
  giftspace,
  isOpen,
  onOpenChange,
}: GiftspaceSettingsModalProps) {
  const { user } = useUserStore();
  const queryClient = useQueryClient();
  const [name, setName] = useState(giftspace.name);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setName(giftspace.name);
    setSearchQuery("");
    setShowResults(false);
  }, [giftspace]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    if (showResults) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showResults]);

  async function getAllUsers(): Promise<TUser[]> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`,
    );
    return response.json();
  }

  async function getGiftspaceUsers(): Promise<TUser[]> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/giftspaces/${giftspace.id}/users`,
    );
    return response.json();
  }

  const { data: allUsers } = useQuery({
    queryKey: ["getAllUsers"],
    queryFn: getAllUsers,
  });

  const { data: giftspaceUsers } = useQuery({
    queryKey: ["getGiftspaceUsers", giftspace.id],
    queryFn: getGiftspaceUsers,
    enabled: isOpen,
  });

  const updateGiftspace = useMutation({
    mutationFn: async (newName: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/giftspaces/${giftspace.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newName }),
        },
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getGiftspacesByOwner"] });
      queryClient.invalidateQueries({ queryKey: ["getSharedGiftspaces"] });
      toast.success("Giftspace renamed successfully");
    },
  });

  const addUser = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/giftspaces/${giftspace.id}/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        },
      );
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Failed to add user" }));
        throw new Error(error.message || "Failed to add user");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getGiftspaceUsers", giftspace.id] });
      queryClient.invalidateQueries({ queryKey: ["getSharedGiftspaces"] });
      toast.success("User added successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add user");
    },
  });

  const removeUser = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/giftspaces/${giftspace.id}/users/${userId}`,
        {
          method: "DELETE",
        },
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getGiftspaceUsers", giftspace.id] });
      queryClient.invalidateQueries({ queryKey: ["getSharedGiftspaces"] });
      toast.success("User removed successfully");
    },
  });

  // Filter out users already in the giftspace and the current user
  const availableUsers = (Array.isArray(allUsers) ? allUsers : []).filter(
    (u) =>
      !(Array.isArray(giftspaceUsers) ? giftspaceUsers : []).some((gu) => gu.id === u.id) &&
      u.id !== user?.id &&
      u.id !== giftspace.owner,
  );

  // Filter users based on search query
  const filteredUsers = availableUsers.filter(
    (u) =>
      searchQuery.trim() === "" ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSaveName = () => {
    if (name.trim() && name !== giftspace.name) {
      updateGiftspace.mutate(name.trim());
    }
  };

  const handleAddUser = (userId: string) => {
    addUser.mutate(userId);
    setSearchQuery("");
    setShowResults(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">
            Giftspace Settings
          </DialogTitle>
          <DialogDescription className="text-center">
            Manage your giftspace name and shared users
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Rename Section */}
          <div className="grid gap-2">
            <Label htmlFor="name">Giftspace Name</Label>
            <div className="flex gap-2">
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter giftspace name"
              />
              <Button
                onClick={handleSaveName}
                disabled={updateGiftspace.isPending || name.trim() === giftspace.name}
                size="sm"
              >
                Save
              </Button>
            </div>
          </div>

          {/* Add User Section */}
          <div className="grid gap-2">
            <Label htmlFor="add-user">Add User</Label>
            <div className="relative" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="add-user"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowResults(e.target.value.trim().length > 0);
                  }}
                  onFocus={() => {
                    if (searchQuery.trim().length > 0) {
                      setShowResults(true);
                    }
                  }}
                  placeholder="Search users by name or email..."
                  className="pl-10"
                />
              </div>
              
              {/* Search Results Dropdown */}
              {showResults && searchQuery.trim().length > 0 && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover shadow-md">
                  {filteredUsers.length > 0 ? (
                    <div className="p-1">
                      {filteredUsers.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => handleAddUser(u.id)}
                          className="w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                          disabled={addUser.isPending}
                        >
                          <div className="font-medium">{u.username}</div>
                          {u.email && (
                            <div className="text-xs text-muted-foreground">{u.email}</div>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 text-center text-sm text-muted-foreground">
                      No users found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Current Users Section */}
          <div className="grid gap-2">
            <Label>Shared Users</Label>
            <div className="flex flex-wrap gap-2 rounded-lg border p-3 min-h-[60px]">
              {Array.isArray(giftspaceUsers) && giftspaceUsers.length > 0 ? (
                giftspaceUsers.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm"
                  >
                    {u.username}
                    {u.id !== giftspace.owner && (
                      <button
                        onClick={() => removeUser.mutate(u.id)}
                        className="ml-1 rounded-full hover:bg-destructive/20 p-0.5 transition-colors"
                        disabled={removeUser.isPending}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No users shared yet
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

