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
import { TGiftspace } from "@shared/types";
import { useRouter } from "next/navigation";

export function ProfileDropdown() {
  const { user } = useUserStore();
  const { logout } = useAuthStore();
  const router = useRouter();

  async function getGiftspaces(): Promise<TGiftspace[]> {
    if (!user) return [];
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/giftspaces/${user?.id}`,
    );
    return response.json();
  }

  async function getSharedGiftspaces(): Promise<TGiftspace[]> {
    if (!user) return [];
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/giftspaces/shared/${user?.id}`,
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

  const { data: sharedGiftspaces } = useQuery({
    queryKey: ["getSharedGiftspaces", user],
    queryFn: getSharedGiftspaces,
  });

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
          <DropdownMenuLabel>Your Giftspaces:</DropdownMenuLabel>

          {giftspaces &&
            giftspaces.map((giftspace) => (
              <DropdownMenuItem
                key={giftspace.id}
                onClick={() => {
                  router.push(`/giftspace/${giftspace.id}`);
                }}
              >
                {giftspace.name}
              </DropdownMenuItem>
            ))}

          {/* Add Giftspace */}
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <AddGiftspaceModal />
            <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Shared Giftspaces:</DropdownMenuLabel>

          {sharedGiftspaces &&
            sharedGiftspaces.map((giftspace) => (
              <DropdownMenuItem
                key={giftspace.id}
                onClick={() => {
                  router.push(`/giftspace/${giftspace.id}`);
                }}
              >
                {giftspace.name}
              </DropdownMenuItem>
            ))}
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
