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
import { minidenticon } from "minidenticons";
import { useMemo, useState } from "react";
import { Settings } from "lucide-react";
import { GiftspaceSettingsModal } from "../GiftspaceSettingsModal/GiftspaceSettingsModal";

export function ProfileDropdown() {
  const [settingsGiftspace, setSettingsGiftspace] = useState<TGiftspace | null>(
    null,
  );
  const { user } = useUserStore();
  const { logout } = useAuthStore();
  const router = useRouter();

  const avatarSvg = useMemo(() => {
    if (!user?.username) return "";
    return minidenticon(user.username, 95, 45);
  }, [user?.username]);

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
        <DropdownMenuLabel className="flex items-center gap-3">
          <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg shadow-inner">
            <div
              className="h-full w-full bg-white"
              dangerouslySetInnerHTML={{ __html: avatarSvg }}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{user?.username}</span>
            <span className="text-muted-foreground text-xs font-normal">
              Personal Account
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Your Giftspaces:</DropdownMenuLabel>

          {giftspaces &&
            giftspaces.map((giftspace: TGiftspace) => (
              <DropdownMenuItem
                key={giftspace.id}
                className="flex items-center justify-between"
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                <span
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    router.push(`/giftspace/${giftspace.id}`);
                  }}
                >
                  {giftspace.name}
                </span>
                {giftspace.name.toLowerCase() !== "personal" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSettingsGiftspace(giftspace);
                    }}
                    className="hover:bg-accent ml-2 rounded p-1"
                  >
                    <Settings className="h-3.5 w-3.5" />
                  </button>
                )}
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
          {sharedGiftspaces && sharedGiftspaces.length > 0 && (
            <>
              <DropdownMenuLabel>Shared Giftspaces:</DropdownMenuLabel>
              {sharedGiftspaces.map((giftspace: TGiftspace) => (
                <DropdownMenuItem
                  key={giftspace.id}
                  className="flex items-center justify-between"
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  <span
                    className="flex-1 cursor-pointer"
                    onClick={() => {
                      router.push(`/giftspace/${giftspace.id}`);
                    }}
                  >
                    {giftspace.name}
                  </span>
                  {giftspace.name.toLowerCase() !== "personal" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSettingsGiftspace(giftspace);
                      }}
                      className="hover:bg-accent ml-2 rounded p-1"
                    >
                      <Settings className="h-3.5 w-3.5" />
                    </button>
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
            </>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            router.push("/settings");
          }}
        >
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

      {settingsGiftspace && (
        <GiftspaceSettingsModal
          giftspace={settingsGiftspace}
          isOpen={!!settingsGiftspace}
          onOpenChange={(open) => {
            if (!open) setSettingsGiftspace(null);
          }}
        />
      )}
    </DropdownMenu>
  );
}
