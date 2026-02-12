"use client";

import React, { useState } from "react";
import { HistoryIcon, Edit3, Trash2, Plus, Minus } from "lucide-react";
import { TTransaction } from "@shared/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TransactionHistoryProps {
  giftcardId: string;
}

function TransactionHistory({ giftcardId }: TransactionHistoryProps) {
  const queryClient = useQueryClient();
  const [editingTransaction, setEditingTransaction] = useState<TTransaction | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const { data: transactions, isLoading } = useQuery<TTransaction[]>({
    queryKey: ["getTransactions", giftcardId],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions/giftcard/${giftcardId}`,
      );
      if (!response.ok) throw new Error("Failed to fetch transactions");
      return response.json();
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: async (transactionId: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions/${transactionId}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) throw new Error("Failed to delete transaction");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getTransactions", giftcardId] });
      queryClient.invalidateQueries({ queryKey: ["getGiftcard", giftcardId] });
      queryClient.invalidateQueries({ queryKey: ["getGiftcards"] });
      toast.success("Transaction deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete transaction");
    },
  });

  const updateTransaction = useMutation({
    mutationFn: async (data: { id: string; amount: number; description?: string }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions/${data.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: data.amount.toString(),
            description: data.description,
          }),
        },
      );
      if (!response.ok) throw new Error("Failed to update transaction");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["getTransactions", giftcardId] });
      queryClient.invalidateQueries({ queryKey: ["getGiftcard", giftcardId] });
      queryClient.invalidateQueries({ queryKey: ["getGiftcards"] });
      setEditingTransaction(null);
      setEditAmount("");
      setEditDescription("");
      toast.success("Transaction updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update transaction");
      console.error(error);
    },
  });

  const handleEdit = (transaction: TTransaction) => {
    setEditingTransaction(transaction);
    setEditAmount(transaction.amount);
    setEditDescription(transaction.description || "");
  };

  const handleUpdate = () => {
    if (!editingTransaction) return;

    const amount = parseFloat(editAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid positive amount");
      return;
    }

    updateTransaction.mutate({
      id: editingTransaction.id,
      amount,
      description: editDescription.trim() || undefined,
    });
  };

  const handleDelete = (transactionId: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction.mutate(transactionId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-muted-foreground">Loading transactions...</div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <HistoryIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Transaction History</h3>
      </div>

      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <Minus className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium">€{transaction.amount}</p>
                <p className="text-sm text-muted-foreground">
                  {transaction.description || "No description"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleEdit(transaction)}
              >
                <Edit3 size={14} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => handleDelete(transaction.id)}
                disabled={deleteTransaction.isPending}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Transaction Dialog */}
      <Dialog open={!!editingTransaction} onOpenChange={() => setEditingTransaction(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Update the transaction details below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-amount">Amount (€)</Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                min="0"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="e.g., Coffee purchase"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingTransaction(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={updateTransaction.isPending}
              >
                {updateTransaction.isPending ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TransactionHistory;