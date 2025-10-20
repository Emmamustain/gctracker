"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/stores/user.store";

import { useAuthStore } from "@/stores/auth.store";
import { AddGiftspaceModal } from "../AddGiftspaceModal/AddGiftspaceModal";

export function ProfileDropdown() {
  const { user } = useUserStore();
  const { logout } = useAuthStore();

  async function getGiftspaces() {
    if (!user) return [];
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/giftspaces/${user?.id}`,
    );
    return response.json();
  }

  // Queries
  const {
    data: giftspaces,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getGiftspacesByOwner", user],
    queryFn: getGiftspaces,
  });
  console.log({ giftspaces, isLoading, error });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{user?.username}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel className="justify-left flex items-center gap-2">
          <div className="flex h-[40px] w-[40px] items-center justify-center bg-red-400">
            photo
          </div>
          <div>
            <div>{user?.username}</div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {giftspaces &&
            giftspaces.map((giftspace: { id: string; name: string }) => (
              <DropdownMenuItem key={giftspace.id}>
                {giftspace.name}
              </DropdownMenuItem>
            ))}

          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <AddGiftspaceModal />
            <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Settings
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            logout();
          }}
        >
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
