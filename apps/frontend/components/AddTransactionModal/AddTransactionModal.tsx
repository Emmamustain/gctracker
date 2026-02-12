"use client";

import React, { useState } from "react";
import { Plus, AlertTriangle } from "lucide-react";
import { TGiftcard } from "@shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface AddTransactionModalProps {
  giftcard: TGiftcard;
}

function AddTransactionModal({ giftcard }: AddTransactionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [discardData, setDiscardData] = useState<any>(null);
  const queryClient = useQueryClient();

  const addTransaction = useMutation({
    mutationFn: async (data: { amount: number; description?: string }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions/giftcard/${giftcard.id}/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: data.amount,
            description: data.description,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to add transaction");
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (data.requiresDiscard) {
        setShowDiscardDialog(true);
        setDiscardData(data);
        return;
      }

      queryClient.invalidateQueries({
        queryKey: ["getTransactions", giftcard.id],
      });
      queryClient.invalidateQueries({ queryKey: ["getGiftcard", giftcard.id] });
      queryClient.invalidateQueries({ queryKey: ["getGiftcards"] });

      setIsOpen(false);
      setAmount("");
      setDescription("");
      toast.success(`Transaction added! New balance: €${data.newBalance}`);
    },
    onError: (error) => {
      toast.error("Failed to add transaction");
      console.error(error);
    },
  });

  const discardCard = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions/discard/${giftcard.id}`,
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to discard card");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getGiftcard", giftcard.id] });
      queryClient.invalidateQueries({ queryKey: ["getGiftcards"] });

      setIsOpen(false);
      setShowDiscardDialog(false);
      setAmount("");
      setDescription("");
      toast.success("Card discarded successfully");
    },
    onError: () => {
      toast.error("Failed to discard card");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const transactionAmount = parseFloat(amount);
    if (isNaN(transactionAmount) || transactionAmount <= 0) {
      toast.error("Please enter a valid positive amount");
      return;
    }

    addTransaction.mutate({
      amount: transactionAmount,
      description: description.trim() || undefined,
    });
  };

  const handleDiscard = () => {
    discardCard.mutate();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus size={16} />
            Add Transaction
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <Plus className="text-primary h-6 w-6" />
            </div>
            <DialogTitle className="text-center text-xl">
              Add Transaction
            </DialogTitle>
            <DialogDescription className="text-center">
              Record a purchase or expense for this gift card.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount (€)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Coffee purchase at Starbucks"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={addTransaction.isPending}>
                {addTransaction.isPending ? "Adding..." : "Add Transaction"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Discard Confirmation Dialog */}
      <Dialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <DialogTitle className="text-center text-xl">
              Insufficient Balance
            </DialogTitle>
            <DialogDescription className="text-center">
              This transaction would make your balance negative. Would you like
              to discard this gift card instead?
            </DialogDescription>
          </DialogHeader>

          {discardData && (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Current Balance</p>
                  <p className="font-semibold">€{discardData.currentBalance}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Transaction Amount</p>
                  <p className="font-semibold text-red-600">
                    -€{discardData.transactionAmount}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Resulting Balance</p>
                  <p className="font-semibold text-red-600">
                    €{discardData.newBalance}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDiscardDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDiscard}
              disabled={discardCard.isPending}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {discardCard.isPending ? "Discarding..." : "Discard Card"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddTransactionModal;
