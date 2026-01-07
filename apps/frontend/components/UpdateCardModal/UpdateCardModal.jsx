import React, { useState, useEffect } from "react";
import { CreditCard, Edit3 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

function UpdateCardModal({ giftcard }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputName, setInputName] = useState(giftcard?.name || "");
  const [inputBalance, setInputBalance] = useState(giftcard?.balance || "");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (giftcard) {
      setInputName(giftcard.name);
      setInputBalance(giftcard.balance);
    }
  }, [giftcard, isOpen]);

  const updateCard = useMutation({
    mutationFn: async (data) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/giftcards/${giftcard.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );
      if (!response.ok) throw new Error("Failed to update card");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getGiftcard", giftcard.id] });
      queryClient.invalidateQueries({ queryKey: ["getGiftcards"] });
      setIsOpen(false);
      toast.success("Card updated successfully");
    },
    onError: () => {
      toast.error("Failed to update card");
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Edit3 size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <CreditCard className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">Update Card</DialogTitle>
          <DialogDescription className="text-center">
            Modify your gift card details below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Card Name</Label>
            <Input
              id="name"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder="e.g., My Amazon Card"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="balance">Balance (€)</Label>
            <Input
              id="balance"
              type="number"
              value={inputBalance}
              onChange={(e) => setInputBalance(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="mt-2 space-y-2">
            <Label className="text-xs text-muted-foreground uppercase font-bold">Read-only info</Label>
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-3 text-sm">
              <div>
                <p className="text-muted-foreground text-[10px] uppercase font-bold">Brand</p>
                <p className="font-medium">{giftcard?.brand}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] uppercase font-bold">Code</p>
                <p className="font-mono">{giftcard?.code}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              updateCard.mutate({
                name: inputName,
                balance: inputBalance,
              });
            }}
            disabled={updateCard.isPending}
          >
            {updateCard.isPending ? "Updating..." : "Update Card"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateCardModal;