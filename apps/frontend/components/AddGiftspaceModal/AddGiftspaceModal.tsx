import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/stores/user.store";
import { TCreateGiftspace } from "@shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function AddGiftspaceModal() {
  const { user } = useUserStore();
  const [name, setName] = useState("Personal");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const createGiftspace = useMutation({
    mutationFn: ({ owner, name, password }: TCreateGiftspace) => {
      return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/giftspaces`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ owner, name, password }),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["getGiftspacesByOwner"],
      });
    },
  });

  if (!user) return;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
      }}
    >
      <form>
        <DialogTrigger
          asChild
          onClick={() => {
            setOpen(true);
          }}
        >
          <div className="font-semibold text-blue-500">+ New Giftspace</div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="giftspace-name">Name</Label>
              <Input
                id="giftspace-name"
                name="giftspace-name"
                defaultValue="Personal"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                }}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="giftspace-password">Password</Label>
              <Input
                id="giftspace-password"
                name="giftspace-password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={() => {
                createGiftspace.mutate({ name, password, owner: user.id });
                setOpen(false);
              }}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
